function getChapterProgress() {
  return JSON.parse(localStorage.getItem(chapterProgressKey) || "{}");
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
        answer: "Review this chapter's key terms, flow, and failure patterns before proceeding."
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

function renderStats() {
  const progress = getChapterProgress();
  let done = 0;
  let total = 0;

  courseModules.forEach((module) => {
    const states = progress[module.id] || [];
    done += states.filter(Boolean).length;
    total += module.chapters.length;
  });

  const pct = total === 0 ? 0 : Math.round((done / total) * 100);
  document.getElementById("globalStats").textContent = `${pct}% complete (${done}/${total} chapters)`;
  const globalBar = document.getElementById("globalBar");
  if (globalBar) {
    globalBar.style.width = `${pct}%`;
  }
}

function getPreferredModuleIndex(progress) {
  for (let i = 0; i < courseModules.length; i += 1) {
    const module = courseModules[i];
    const states = progress[module.id] || [];
    const nextIncomplete = module.chapters.findIndex((_, chapterIndex) => !states[chapterIndex]);
    if (nextIncomplete >= 0) {
      return i;
    }
  }

  // If everything is complete, open the last module for quick review.
  return Math.max(0, courseModules.length - 1);
}

function renderHomeAccordion() {
  const progress = getChapterProgress();
  const host = document.getElementById("moduleAccordion");
  const preferredModuleIndex = getPreferredModuleIndex(progress);

  host.innerHTML = courseModules
    .map((module, moduleIndex) => {
      const doneCount = (progress[module.id] || []).filter(Boolean).length;
      const panelId = `panel-${module.id}`;

      const chapterList = module.chapters
        .map((chapter, chapterIndex) => {
          const done = (progress[module.id] || [])[chapterIndex] ? "done" : "";
          return `
            <a class="chapter-link ${done}" href="lesson.html?module=${module.id}&chapter=${chapterIndex}&v=5">
              <span>${chapter.title}</span>
              <small>${done ? "Completed" : "Start"}</small>
            </a>
          `;
        })
        .join("");

      return `
        <article class="module-item">
          <button class="module-toggle" data-target="${panelId}" data-module-index="${moduleIndex}">
            <span>
              <span class="module-badge">${moduleIndex + 1}</span>
              <span>
                <strong>${module.title}</strong>
              </span>
            </span>
            <span class="module-right">
              <span class="module-meta">${doneCount}/${module.chapters.length} chapters</span>
              <span class="mini-bar"><i style="width:${Math.round((doneCount / module.chapters.length) * 100)}%"></i></span>
            </span>
          </button>
          <div id="${panelId}" class="module-panel">
            ${chapterList}
          </div>
        </article>
      `;
    })
    .join("");

  host.querySelectorAll(".module-toggle").forEach((btn, idx) => {
    btn.addEventListener("click", () => {
      const panel = document.getElementById(btn.getAttribute("data-target"));
      const open = panel.classList.toggle("open");
      btn.classList.toggle("open", open);

      if (idx === 0 && open) {
        return;
      }
    });
  });

  const toggles = [...host.querySelectorAll(".module-toggle")];
  const preferredToggle = toggles[preferredModuleIndex] || toggles[0];
  if (preferredToggle) {
    const targetId = preferredToggle.getAttribute("data-target");
    const preferredPanel = targetId ? document.getElementById(targetId) : null;
    preferredToggle.classList.add("open");
    if (preferredPanel) {
      preferredPanel.classList.add("open");
    }
  }
}

function stripHtml(html) {
  const tmp = document.createElement("div");
  tmp.innerHTML = html;
  return (tmp.textContent || "").replace(/\s+/g, " ").trim();
}

function escapeHtml(text) {
  return text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

let searchIndex = [];

function buildSearchIndex() {
  searchIndex = [];
  courseModules.forEach((module) => {
    module.chapters.forEach((chapter, chapterIndex) => {
      searchIndex.push({
        moduleId: module.id,
        moduleTitle: module.title,
        chapterIndex,
        title: chapter.title,
        text: stripHtml(chapter.content)
      });
    });
  });
}

function runSearch(query) {
  const q = query.trim().toLowerCase();
  const results = document.getElementById("searchResults");
  const accordion = document.getElementById("moduleAccordion");

  if (q.length < 2) {
    results.classList.add("hidden");
    accordion.classList.remove("hidden");
    return;
  }

  const terms = q.split(/\s+/);
  const hits = searchIndex
    .map((entry) => {
      const title = entry.title.toLowerCase();
      const text = entry.text.toLowerCase();
      if (!terms.every((t) => title.includes(t) || text.includes(t))) {
        return null;
      }
      const score = terms.reduce((sum, t) => sum + (title.includes(t) ? 5 : 0) + (text.split(t).length - 1), 0);
      const pos = text.indexOf(terms[0]);
      const start = Math.max(0, pos - 60);
      const snippet = entry.text.slice(start, start + 170);
      return { entry, score, snippet: (start > 0 ? "..." : "") + snippet + "..." };
    })
    .filter(Boolean)
    .sort((a, b) => b.score - a.score)
    .slice(0, 30);

  accordion.classList.add("hidden");
  results.classList.remove("hidden");

  if (!hits.length) {
    results.innerHTML = `<p class="empty-state">No chapters match "${escapeHtml(query)}".</p>`;
    return;
  }

  const mark = (text) =>
    terms.reduce(
      (out, t) => out.replace(new RegExp(`(${t.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`, "gi"), "<mark>$1</mark>"),
      escapeHtml(text)
    );

  results.innerHTML =
    `<p class="results-count">${hits.length} chapter${hits.length === 1 ? "" : "s"} found</p>` +
    hits
      .map(
        ({ entry, snippet }) => `
      <a class="result-card" href="lesson.html?module=${entry.moduleId}&chapter=${entry.chapterIndex}&v=5">
        <small>${escapeHtml(entry.moduleTitle)}</small>
        <strong>${mark(entry.title)}</strong>
        <span>${mark(snippet)}</span>
      </a>`
      )
      .join("");
}

function setupResume() {
  const progress = getChapterProgress();
  const link = document.getElementById("resumeLink");

  // Show resume once there is any progress in any module.
  const hasAnyProgress = courseModules.some((module) => {
    const states = progress[module.id] || [];
    return states.some(Boolean);
  });

  if (!hasAnyProgress) {
    if (link) {
      link.hidden = true;
    }
    return;
  }

  for (const module of courseModules) {
    const states = progress[module.id] || [];
    const next = module.chapters.findIndex((_, i) => !states[i]);
    if (next >= 0) {
      if (link) {
        link.href = `lesson.html?module=${module.id}&chapter=${next}&v=5`;
        link.hidden = false;
      }
      return;
    }
  }

  if (link) {
    link.hidden = true;
  }
}

async function init() {
  await loadExternalModules();
  renderStats();
  renderHomeAccordion();
  buildSearchIndex();
  setupResume();
  document.getElementById("searchInput").addEventListener("input", (event) => runSearch(event.target.value));
}

init();
