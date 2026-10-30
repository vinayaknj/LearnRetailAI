const moduleFilesForLanding = [
  "module-1-retail-operating-model-fundamentals.json",
  "module-2-core-retail-transactions.json",
  "module-3-inventory-and-fulfillment-mastery.json",
  "module-4-payments-compliance-risk.json",
  "module-5-retail-sre-support-operations.json",
  "module-6-ai-pods-retail-domain-problems.json",
  "module-7-retail-data-platform-for-ai.json",
  "module-8-ai-rollout-governance-value-realization.json"
];

async function loadLandingModules() {
  for (const file of moduleFilesForLanding) {
    try {
      const response = await fetch(file, { cache: "no-cache" });
      if (!response.ok) continue;
      const json = await response.json();
      if (!json || !json.id || !Array.isArray(json.chapters)) continue;
      const index = courseModules.findIndex((m) => m.id === json.id);
      if (index >= 0) {
        courseModules[index] = json;
      } else {
        courseModules.push(json);
      }
    } catch (error) {
      console.warn(`Module load failed for ${file}:`, error);
    }
  }
}

function renderLanding() {
  const progress = JSON.parse(localStorage.getItem(chapterProgressKey) || "{}");
  let total = 0;
  let done = 0;
  let resume = null;

  courseModules.forEach((module) => {
    const states = progress[module.id] || [];
    total += module.chapters.length;
    done += states.filter(Boolean).length;
    if (!resume) {
      const next = module.chapters.findIndex((_, i) => !states[i]);
      if (next >= 0 && states.some(Boolean)) {
        resume = { module: module.id, chapter: next };
      }
    }
  });

  document.getElementById("statModules").textContent = courseModules.length;
  document.getElementById("statChapters").textContent = total;
  document.getElementById("statDone").textContent = `${total ? Math.round((done / total) * 100) : 0}%`;

  if (resume) {
    const link = document.getElementById("continueLink");
    link.href = `lesson.html?module=${resume.module}&chapter=${resume.chapter}&v=5`;
    link.hidden = false;
  }

  document.getElementById("modulePreview").innerHTML = courseModules
    .map(
      (module, i) => `
        <a class="preview-card" href="modules.html">
          <span class="preview-num">${String(i + 1).padStart(2, "0")}</span>
          <h3>${module.title}</h3>
          <p>${module.chapters.length} chapters</p>
        </a>`
    )
    .join("");
}

async function initLanding() {
  renderLanding();
  await loadLandingModules();
  renderLanding();
}

initLanding();
