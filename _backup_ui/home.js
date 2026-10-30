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
}

function renderHomeAccordion() {
  const progress = getChapterProgress();
  const host = document.getElementById("moduleAccordion");

  host.innerHTML = courseModules
    .map((module, moduleIndex) => {
      const doneCount = (progress[module.id] || []).filter(Boolean).length;
      const panelId = `panel-${module.id}`;

      const chapterList = module.chapters
        .map((chapter, chapterIndex) => {
          const done = (progress[module.id] || [])[chapterIndex] ? "done" : "";
          return `
            <a class="chapter-link ${done}" href="lesson.html?module=${module.id}&chapter=${chapterIndex}">
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
              <strong>${module.title}</strong>
              <small>${module.weeks}</small>
            </span>
            <span class="module-meta">${doneCount}/${module.chapters.length} chapters</span>
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

  const firstToggle = host.querySelector(".module-toggle");
  const firstPanel = host.querySelector(".module-panel");
  if (firstToggle && firstPanel) {
    firstToggle.classList.add("open");
    firstPanel.classList.add("open");
  }
}

async function init() {
  await loadExternalModules();
  renderStats();
  renderHomeAccordion();
}

init();
