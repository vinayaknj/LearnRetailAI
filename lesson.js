function getQueryParam(name) {
  const params = new URLSearchParams(window.location.search);
  return params.get(name);
}

function sectionToHtml(section) {
  let html = `<h3>${section.heading}</h3>`;

  if (section.points && section.points.length) {
    html += `<ul class="clean">${section.points.map((p) => `<li>${p}</li>`).join("")}</ul>`;
  }

  if (section.json) {
    html += `<pre class="flow-block">${JSON.stringify(section.json, null, 2)}</pre>`;
  }

  if (section.table) {
    const headers = section.table.headers || [];
    const rows = section.table.rows || [];
    html += `<table class="content-table"><tr>${headers.map((h) => `<th>${h}</th>`).join("")}</tr>${rows
      .map((r) => `<tr>${r.map((c) => `<td>${c}</td>`).join("")}</tr>`)
      .join("")}</table>`;
  }

  return html;
}

function transformModule2Json(moduleJson) {
  return {
    id: moduleJson.moduleId,
    title: moduleJson.title,
    weeks: moduleJson.weeks,
    chapters: moduleJson.chapters.map((ch) => {
      const sectionsHtml = (ch.sections || []).map(sectionToHtml).join("");
      const checkpoint = {
        prompt: `What is the key takeaway from ${ch.title}?`,
        answer: "Review this chapter's key terms, process flow, and failure patterns before moving next."
      };
      return {
        title: `Chapter ${ch.chapter}: ${ch.title}`,
        content: sectionsHtml,
        checkpoint
      };
    })
  };
}

function normalizeExternalModule(json) {
  if (json && json.id && Array.isArray(json.chapters)) {
    return json;
  }

  if (json && json.moduleId && Array.isArray(json.chapters)) {
    return transformModule2Json(json);
  }

  return null;
}

async function loadExternalModules() {
  const moduleFiles = [
    "module-1-retail-operating-model-fundamentals.json",
    "module-2-core-retail-transactions.json",
    "module-3-inventory-and-fulfillment-mastery.json",
    "module-4-payments-compliance-risk.json",
    "module-5-retail-sre-support-operations.json",
    "module-6-ai-pods-retail-domain-problems.json",
    "module-7-retail-data-platform-for-ai.json",
    "module-8-ai-rollout-governance-value-realization.json"
  ];

  for (const moduleFile of moduleFiles) {
    try {
      const response = await fetch(moduleFile, { cache: "no-cache" });
      if (!response.ok) {
        continue;
      }

      const rawJson = await response.json();
      const module = normalizeExternalModule(rawJson);
      if (!module) {
        continue;
      }

      const index = courseModules.findIndex((m) => m.id === module.id);
      if (index >= 0) {
        courseModules[index] = module;
      } else {
        courseModules.push(module);
      }
    } catch (error) {
      console.warn(`External module load failed for ${moduleFile}:`, error);
    }
  }
}

function getChapterProgress() {
  return JSON.parse(localStorage.getItem(chapterProgressKey) || "{}");
}

function saveChapterProgress(state) {
  localStorage.setItem(chapterProgressKey, JSON.stringify(state));
}

function getModuleAndChapter() {
  const moduleId = getQueryParam("module") || "m1";
  const chapterIndex = Number(getQueryParam("chapter") || 0);
  const module = courseModules.find((m) => m.id === moduleId) || courseModules[0];
  const safeIndex = Number.isNaN(chapterIndex)
    ? 0
    : Math.max(0, Math.min(chapterIndex, module.chapters.length - 1));
  return { module, moduleId: module.id, chapterIndex: safeIndex };
}

function cleanCardText(value) {
  return String(value || "")
    .replace(/\s+/g, " ")
    .replace(/\(Correct\)/gi, "")
    .replace(/[A-D]\.\s+/g, "")
    .trim();
}

function chapterShortTitle(chapter) {
  return (chapter.title || "").replace(/^Chapter\s+\d+:\s*/i, "").trim();
}

function safeCard(front, back) {
  const q = cleanCardText(front);
  const a = cleanCardText(back);
  if (!q || !a) {
    return null;
  }
  if (q.length < 8 || a.length < 12) {
    return null;
  }
  return {
    front: q.length > 140 ? `${q.slice(0, 137)}...` : q,
    back: a.length > 260 ? `${a.slice(0, 257)}...` : a
  };
}

function cardScore(front, back) {
  const q = cleanCardText(front).toLowerCase();
  const a = cleanCardText(back).toLowerCase();
  let score = 0;

  const highSignalWords = [
    "why",
    "how",
    "impact",
    "risk",
    "dependency",
    "kpi",
    "flow",
    "difference",
    "responsible",
    "mitigation",
    "settlement",
    "inventory",
    "pos",
    "oms",
    "ims",
    "erp"
  ];

  highSignalWords.forEach((word) => {
    if (q.includes(word) || a.includes(word)) {
      score += 2;
    }
  });

  if (a.length >= 35 && a.length <= 200) {
    score += 3;
  }
  if (q.startsWith("what") || q.startsWith("why") || q.startsWith("how")) {
    score += 2;
  }
  if (/name one key point|what chapter are you studying/i.test(q)) {
    score -= 6;
  }

  return score;
}

function buildChapterFlashcards(chapter) {
  const candidates = [];
  const dedupe = new Set();
  const root = document.createElement("div");
  root.innerHTML = chapter.content || "";

  const pushCandidate = (front, back, sourceBoost = 0) => {
    const card = safeCard(front, back);
    if (!card) {
      return;
    }
    const key = `${card.front.toLowerCase()}|${card.back.toLowerCase()}`;
    if (dedupe.has(key)) {
      return;
    }
    dedupe.add(key);
    candidates.push({
      ...card,
      score: cardScore(card.front, card.back) + sourceBoost
    });
  };

  const title = chapterShortTitle(chapter);

  if (Array.isArray(chapter.flashcards)) {
    chapter.flashcards.forEach((item) => {
      if (item && typeof item === "object") {
        pushCandidate(item.front, item.back, 8);
      }
    });
  }

  // If curated cards exist in sufficient quantity, prefer them over generated prompts.
  if (Array.isArray(chapter.flashcards) && chapter.flashcards.length >= 4) {
    const curatedOnly = candidates
      .sort((a, b) => b.score - a.score)
      .slice(0, 8)
      .map((item) => ({ front: item.front, back: item.back }));
    if (curatedOnly.length >= 4) {
      return curatedOnly;
    }
  }

  if (chapter.checkpoint) {
    pushCandidate(chapter.checkpoint.prompt, chapter.checkpoint.answer, 7);
  }

  const quizBlocks = [...root.querySelectorAll(".quiz-q")];
  if (quizBlocks.length) {
    quizBlocks.forEach((block) => {
      const question = cleanCardText(block.querySelector("p")?.textContent || "");
      const correctChoice = block.querySelector("li.correct") || [...block.querySelectorAll("li")].find((li) => /\(Correct\)/i.test(li.textContent || ""));
      if (question && correctChoice) {
        pushCandidate(question, cleanCardText(correctChoice.textContent), 6);
      }
    });
  }

  const firstParagraphs = [...root.querySelectorAll("p")]
    .map((p) => cleanCardText(p.textContent))
    .filter((text) => text && text.length > 30 && !/^choose one answer/i.test(text))
    .slice(0, 3);
  firstParagraphs.forEach((text, i) => {
    const front = i === 0 ? `What is the core idea of ${title}?` : `What is another key idea in ${title}?`;
    pushCandidate(front, text, 3);
  });

  const sectionTitleToQuestion = (headingText) => {
    if (/definition/i.test(headingText)) {
      return `What is the definition in ${title}?`;
    }
    if (/risk|impact/i.test(headingText)) {
      return `What major risk or impact is highlighted under ${headingText}?`;
    }
    if (/dependenc/i.test(headingText)) {
      return `What dependency point matters most under ${headingText}?`;
    }
    if (/kpi|formula/i.test(headingText)) {
      return `What KPI/formula takeaway from ${headingText} should you remember?`;
    }
    return `What is the key takeaway from ${headingText}?`;
  };

  const bannedHeading = /quick\s*quiz|practical\s*assignment|outcome\s*standard/i;

  const headings = [...root.querySelectorAll("h3, h4")].slice(0, 12);
  headings.forEach((heading) => {
    const headingText = cleanCardText(heading.textContent);
    if (!headingText || /^q\d+$/i.test(headingText) || bannedHeading.test(headingText)) {
      return;
    }

    let detail = "";
    let node = heading.nextElementSibling;
    while (node && !["H3", "H4"].includes(node.tagName)) {
      if (node.matches("p")) {
        const text = cleanCardText(node.textContent);
        if (text && text.length > 20 && !/^choose one answer/i.test(text)) {
          detail = text;
          break;
        }
      }
      if (!detail && node.matches("table")) {
        const firstRow = node.querySelector("tr:not(:first-child)");
        const cells = firstRow ? [...firstRow.querySelectorAll("td")].map((td) => cleanCardText(td.textContent)) : [];
        if (cells.length >= 2 && cells[0] && cells[1]) {
          detail = `${cells[0]}: ${cells[1]}`;
          break;
        }
      }
      node = node.nextElementSibling;
    }

    if (detail) {
      pushCandidate(sectionTitleToQuestion(headingText), detail, 4);
    }
  });

  const preferredRows = [...root.querySelectorAll("table tr")].slice(0, 16);
  preferredRows.forEach((row) => {
    const cells = [...row.querySelectorAll("td")].map((td) => cleanCardText(td.textContent));
    if (cells.length >= 2 && cells[0] && cells[1]) {
      const left = cells[0];
      const right = cells[1];
      if (right.length >= 14) {
        pushCandidate(`In ${title}, what does ${left} mean?`, right, 3);
      }
    }
  });

  if (candidates.length < 4) {
    const fallbackBack = chapter.checkpoint?.answer || firstParagraphs[0] || `Understand the main process flow and incident impact for ${title}.`;
    pushCandidate(`What is the most important takeaway from ${title}?`, fallbackBack, 6);
    pushCandidate(`Why is ${title} operationally important?`, `It helps connect system behavior to business outcomes and faster incident triage.`, 5);
    pushCandidate(`How do you apply ${title} in real work?`, `Use it to explain failure symptoms, identify likely owners, and choose the right first mitigation.`, 5);
    pushCandidate(`What should be reviewed before moving on from ${title}?`, `Review the key flow, ownership boundaries, and one realistic failure scenario.`, 4);
  }

  candidates.sort((a, b) => b.score - a.score);

  const selected = [];
  for (const item of candidates) {
    if (selected.length >= 8) {
      break;
    }
    selected.push({ front: item.front, back: item.back });
  }

  if (selected.length < 4) {
    const failSafe = [
      {
        front: `What is the core idea of ${title}?`,
        back: chapter.checkpoint?.answer || `Understand the main concept and business impact of ${title}.`
      },
      {
        front: `Why does ${title} matter in retail systems?`,
        back: `It links process behavior with customer and revenue outcomes.`
      },
      {
        front: `How should you validate learning for ${title}?`,
        back: `Explain one flow, one owner, and one failure impact clearly.`
      },
      {
        front: `What is one practical action from ${title}?`,
        back: `Document dependencies and first-response checks for incidents.`
      }
    ];
    failSafe.forEach((card) => {
      if (selected.length < 4) {
        selected.push(card);
      }
    });
  }

  return selected.slice(0, 8);
}

function renderInlineFlashcards(chapter) {
  const host = document.getElementById("inlineFlashcard");
  const meta = document.getElementById("inlineFlashcardMeta");
  const cardShell = document.getElementById("inlineFlashcardCard");
  const front = document.getElementById("inlineFlashcardFront");
  const back = document.getElementById("inlineFlashcardBack");
  const count = document.getElementById("inlineFlashcardCount");
  const prevBtn = document.getElementById("inlineCardPrev");
  const nextBtn = document.getElementById("inlineCardNext");
  const flipBtn = document.getElementById("inlineCardFlip");

  if (!host || !meta || !cardShell || !front || !back || !count || !prevBtn || !nextBtn || !flipBtn) {
    return;
  }

  const cards = buildChapterFlashcards(chapter);
  if (!cards.length) {
    host.innerHTML = "<p class=\"sidebar-meta\">No flashcards available for this chapter.</p>";
    return;
  }

  let index = 0;
  let flipped = false;

  const paint = () => {
    const card = cards[index];
    meta.textContent = "Flashcard";
    front.textContent = card.front;
    back.textContent = card.back;
    cardShell.classList.toggle("flipped", flipped);
    flipBtn.textContent = flipped ? "Hide" : "Flip";
    count.textContent = `${index + 1}/${cards.length}`;
    prevBtn.disabled = index === 0;
    nextBtn.disabled = index === cards.length - 1;
  };

  const toggleFlip = () => {
    flipped = !flipped;
    paint();
  };

  flipBtn.onclick = toggleFlip;
  cardShell.onclick = toggleFlip;
  cardShell.onkeydown = (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      toggleFlip();
    }
  };
  prevBtn.onclick = () => {
    if (index > 0) {
      index -= 1;
      flipped = false;
      paint();
    }
  };
  nextBtn.onclick = () => {
    if (index < cards.length - 1) {
      index += 1;
      flipped = false;
      paint();
    }
  };

  paint();
}

function enhanceChapterContent(chapter, module) {
  const lessonRoot = document.querySelector(".lesson-body-content");
  if (!lessonRoot || /quick\s*quiz/i.test(chapter.title || "")) {
    return;
  }

  // Remove repetitive "additional notes" blocks and keep the core chapter domain content clean.
  const notesBlocks = [...lessonRoot.querySelectorAll("details.extra-notes")];
  notesBlocks.forEach((block) => block.remove());
}

function enhanceInlineQuickQuiz() {
  const lessonRoot = document.querySelector(".lesson-body-content");
  if (!lessonRoot) {
    return;
  }

  const questionBlocks = [...lessonRoot.querySelectorAll(".quiz-q")];
  if (!questionBlocks.length) {
    return;
  }

  questionBlocks.forEach((block, questionIndex) => {
    const listItems = [...block.querySelectorAll("ul li")];
    listItems.forEach((li, optionIndex) => {
      const correctByClass = li.classList.contains("correct");
      const correctByText = /\(Correct\)/i.test(li.textContent);
      const isCorrect = correctByClass || correctByText;
      const cleanedText = li.textContent.replace(/\(Correct\)/gi, "").trim();

      li.classList.remove("correct");
      li.innerHTML = `
        <label class="quiz-opt">
          <input type="radio" name="inlineQuizQ${questionIndex}" value="${optionIndex}" data-correct="${isCorrect ? "1" : "0"}" />
          <span>${cleanedText}</span>
        </label>
      `;
    });
  });

  const submitWrap = document.createElement("div");
  submitWrap.className = "inline-quiz-actions";
  submitWrap.innerHTML = `
    <button class="btn" id="inlineQuizSubmit">Submit Quiz</button>
    <p id="inlineQuizResult" class="answer hidden"></p>
  `;
  lessonRoot.appendChild(submitWrap);

  const submitBtn = document.getElementById("inlineQuizSubmit");
  const result = document.getElementById("inlineQuizResult");

  submitBtn.onclick = () => {
    let answered = 0;
    let correct = 0;

    questionBlocks.forEach((block, questionIndex) => {
      const selected = block.querySelector(`input[name="inlineQuizQ${questionIndex}"]:checked`);
      const options = [...block.querySelectorAll(`input[name="inlineQuizQ${questionIndex}"]`)];

      options.forEach((input) => {
        const row = input.closest("li");
        if (row) {
          row.classList.remove("correct-answer", "wrong-answer");
        }
      });

      if (!selected) {
        return;
      }

      answered += 1;

      options.forEach((input) => {
        input.disabled = true;
        const row = input.closest("li");
        if (!row) {
          return;
        }

        if (input.dataset.correct === "1") {
          row.classList.add("correct-answer");
        }
        if (input.checked && input.dataset.correct !== "1") {
          row.classList.add("wrong-answer");
        }
      });

      if (selected.dataset.correct === "1") {
        correct += 1;
      }
    });

    if (answered !== questionBlocks.length) {
      result.textContent = "Please answer all questions before submitting.";
      result.classList.remove("hidden");
      return;
    }

    const score = `${correct}/${questionBlocks.length}`;
    result.textContent = `Quiz submitted. Score: ${score}. Correct answers are now shown.`;
    result.classList.remove("hidden");
    submitBtn.disabled = true;
  };
}

function renderLessonPage() {
  ensureLessonLayout();
  const { module, moduleId, chapterIndex } = getModuleAndChapter();
  const chapter = module.chapters[chapterIndex];

  document.getElementById("lessonModuleWeeks").textContent = `Chapter ${chapterIndex + 1}/${module.chapters.length}`;
  document.getElementById("lessonModuleTitle").textContent = module.title;

  document.getElementById("lessonContent").innerHTML = `
    <h2 class="module-title">${chapter.title}</h2>
    <div class="lesson-body-content">${chapter.content}</div>
  `;
  enhanceChapterContent(chapter, module);
  enhanceInlineQuickQuiz();
  renderInlineFlashcards(chapter);
  const practiceChapterQuiz = document.getElementById("practiceChapterQuiz");

  if (practiceChapterQuiz) {
    const quickQuizIndex = module.chapters.findIndex((c) => /quick\s*quiz/i.test(c.title || ""));
    if (quickQuizIndex >= 0) {
      practiceChapterQuiz.href = lessonUrl(moduleId, quickQuizIndex);
      practiceChapterQuiz.hidden = false;
    } else {
      practiceChapterQuiz.hidden = true;
    }
  }

  renderSidebar(module, chapterIndex);

  const prevBtn = document.getElementById("prevBtn");
  const nextBtn = document.getElementById("nextBtn");

  const lessonBar = document.getElementById("lessonBar");
  if (lessonBar) {
    lessonBar.style.width = `${Math.round(((chapterIndex + 1) / module.chapters.length) * 100)}%`;
  }
  document.title = `${chapter.title} | ${module.title}`;

  if (!prevBtn || !nextBtn) {
    return;
  }

  prevBtn.disabled = chapterIndex === 0;
  nextBtn.disabled = chapterIndex >= module.chapters.length - 1;

  prevBtn.onclick = () => {
    if (chapterIndex > 0) {
      window.location.href = lessonUrl(moduleId, chapterIndex - 1);
    }
  };

  nextBtn.onclick = () => {
    if (chapterIndex < module.chapters.length - 1) {
      window.location.href = lessonUrl(moduleId, chapterIndex + 1);
    }
  };

  const isDone = () => Boolean((getChapterProgress()[moduleId] || [])[chapterIndex]);

  const setDone = (value) => {
    const progress = getChapterProgress();
    if (!Array.isArray(progress[moduleId])) {
      progress[moduleId] = new Array(module.chapters.length).fill(false);
    }
    progress[moduleId][chapterIndex] = value;
    saveChapterProgress(progress);
    renderSidebar(module, chapterIndex);
    paintDone();
  };

  const markDoneBtn = document.getElementById("markDoneBtn");
  if (!markDoneBtn) {
    return;
  }
  function paintDone() {
    const done = isDone();
    markDoneBtn.textContent = done ? "✓ Completed (click to undo)" : "Mark Complete";
    markDoneBtn.classList.toggle("is-done", done);
  }
  paintDone();
  markDoneBtn.onclick = () => setDone(!isDone());

  const markNextBtn = document.getElementById("markNextBtn");
  if (!markNextBtn) {
    return;
  }
  const isLast = chapterIndex >= module.chapters.length - 1;
  markNextBtn.textContent = isLast ? "Complete & Finish" : "Complete & Next";
  markNextBtn.onclick = () => {
    setDone(true);
    window.location.href = isLast ? "modules.html" : lessonUrl(moduleId, chapterIndex + 1);
  };
}

// version tag makes every link a fresh URL, so a browser that cached an older lesson.html for a chapter still loads the new page
const lessonLinkVersion = 6;

function lessonUrl(moduleId, chapterIndex) {
  return `lesson.html?module=${moduleId}&chapter=${chapterIndex}&v=${lessonLinkVersion}`;
}

// recreate the pieces added after the first release, in case an older lesson.html was served
function ensureLessonLayout() {
  const layout = document.querySelector(".lesson-page-layout");
  if (layout && !document.getElementById("chapterSidebar")) {
    const aside = document.createElement("aside");
    aside.id = "chapterSidebar";
    aside.className = "chapter-sidebar";
    layout.insertBefore(aside, layout.firstChild);
  }
  const footer = document.querySelector(".lesson-nav-footer");
  if (footer && !document.getElementById("markNextBtn")) {
    const btn = document.createElement("button");
    btn.id = "markNextBtn";
    btn.className = "btn";
    footer.appendChild(btn);
  }
}

function renderSidebar(module, activeIndex) {
  const host = document.getElementById("chapterSidebar");
  if (!host) {
    return;
  }
  const states = getChapterProgress()[module.id] || [];
  const doneCount = states.filter(Boolean).length;
  host.innerHTML = `
    <h2>${module.title}</h2>
    <p class="sidebar-meta">${doneCount}/${module.chapters.length} chapters complete</p>
    <ol class="sidebar-list">
      ${module.chapters
        .map(
          (c, i) => `
        <li>
          <a class="${i === activeIndex ? "active" : ""} ${states[i] ? "done" : ""}" href="${lessonUrl(module.id, i)}">
            <span class="sidebar-dot">${states[i] ? "&#10003;" : i + 1}</span>
            <span>${c.title.replace(/^Chapter \d+:\s*/, "")}</span>
          </a>
        </li>`
        )
        .join("")}
    </ol>`;
  const active = host.querySelector("a.active");
  if (active) {
    host.scrollTop = Math.max(0, active.offsetTop - host.clientHeight / 2);
  }
}

document.addEventListener("keydown", (event) => {
  if (event.target.matches("textarea, input") || event.altKey || event.ctrlKey || event.metaKey) {
    return;
  }
  if (event.key === "ArrowLeft") {
    document.getElementById("prevBtn").click();
  } else if (event.key === "ArrowRight") {
    document.getElementById("nextBtn").click();
  }
});

async function init() {
  await loadExternalModules();
  renderLessonPage();
}

init();
