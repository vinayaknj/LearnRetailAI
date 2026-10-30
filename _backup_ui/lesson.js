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
    "module-6-ai-pods-retail-domain-problems.json"
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

function getNotes() {
  return JSON.parse(localStorage.getItem(chapterNotesKey) || "{}");
}

function saveNotes(state) {
  localStorage.setItem(chapterNotesKey, JSON.stringify(state));
}

function noteKey(moduleId, chapterIndex) {
  return `${moduleId}:${chapterIndex}`;
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

function renderLessonPage() {
  const { module, moduleId, chapterIndex } = getModuleAndChapter();
  const chapter = module.chapters[chapterIndex];

  document.getElementById("lessonModuleWeeks").textContent = `${module.weeks} | Chapter ${chapterIndex + 1}/${module.chapters.length}`;
  document.getElementById("lessonModuleTitle").textContent = module.title;

  document.getElementById("lessonContent").innerHTML = `
    <h2 class="module-title">${chapter.title}</h2>
    <div class="lesson-body-content">${chapter.content}</div>
  `;

  const checkpointPrompt = document.getElementById("checkpointPrompt");
  const checkpointAnswer = document.getElementById("checkpointAnswer");
  const revealBtn = document.getElementById("revealAnswerBtn");

  checkpointPrompt.textContent = chapter.checkpoint.prompt;
  checkpointAnswer.textContent = "";
  checkpointAnswer.classList.add("hidden");

  revealBtn.onclick = () => {
    checkpointAnswer.textContent = chapter.checkpoint.answer;
    checkpointAnswer.classList.remove("hidden");
  };

  const notesState = getNotes();
  const currentNote = notesState[noteKey(moduleId, chapterIndex)] || "";
  const notesArea = document.getElementById("chapterNotes");
  notesArea.value = currentNote;

  document.getElementById("saveNotesBtn").onclick = () => {
    const state = getNotes();
    state[noteKey(moduleId, chapterIndex)] = notesArea.value.trim();
    saveNotes(state);

    const btn = document.getElementById("saveNotesBtn");
    const old = btn.textContent;
    btn.textContent = "Saved";
    setTimeout(() => {
      btn.textContent = old;
    }, 900);
  };

  const prevBtn = document.getElementById("prevBtn");
  const nextBtn = document.getElementById("nextBtn");

  prevBtn.disabled = chapterIndex === 0;
  nextBtn.disabled = chapterIndex >= module.chapters.length - 1;

  prevBtn.onclick = () => {
    if (chapterIndex > 0) {
      window.location.href = `lesson.html?module=${moduleId}&chapter=${chapterIndex - 1}`;
    }
  };

  nextBtn.onclick = () => {
    if (chapterIndex < module.chapters.length - 1) {
      window.location.href = `lesson.html?module=${moduleId}&chapter=${chapterIndex + 1}`;
    }
  };

  document.getElementById("markDoneBtn").onclick = () => {
    const progress = getChapterProgress();
    if (!progress[moduleId]) {
      progress[moduleId] = new Array(module.chapters.length).fill(false);
    }
    progress[moduleId][chapterIndex] = true;
    saveChapterProgress(progress);

    const btn = document.getElementById("markDoneBtn");
    const old = btn.textContent;
    btn.textContent = "Completed";
    setTimeout(() => {
      btn.textContent = old;
    }, 900);
  };
}

async function init() {
  await loadExternalModules();
  renderLessonPage();
}

init();
