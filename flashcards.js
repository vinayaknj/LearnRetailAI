const flashModuleFiles = [
  "module-1-retail-operating-model-fundamentals.json",
  "module-2-core-retail-transactions.json",
  "module-3-inventory-and-fulfillment-mastery.json",
  "module-4-payments-compliance-risk.json",
  "module-5-retail-sre-support-operations.json",
  "module-6-ai-pods-retail-domain-problems.json",
  "module-7-retail-data-platform-for-ai.json",
  "module-8-ai-rollout-governance-value-realization.json"
];
const flashGradeKey = "retailDomainCheckpointGrades";

let deck = [];
let position = 0;
let sessionResults = {};

async function loadFlashModules() {
  for (const file of flashModuleFiles) {
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

const readGrades = () => JSON.parse(localStorage.getItem(flashGradeKey) || "{}");

function writeGrade(id, grade) {
  const grades = readGrades();
  grades[id] = grade;
  localStorage.setItem(flashGradeKey, JSON.stringify(grades));
}

function esc(text) {
  return String(text).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function headingsOf(html) {
  const tmp = document.createElement("div");
  tmp.innerHTML = html;
  const seen = new Set();
  return [...tmp.querySelectorAll("h3")]
    .map((h) => h.textContent.trim())
    .filter((t) => t && !seen.has(t) && seen.add(t))
    .slice(0, 10);
}

function buildCards(moduleId, chapterFilter = null) {
  const cards = [];
  courseModules
    .filter((m) => moduleId === "all" || m.id === moduleId)
    .forEach((module) => {
      module.chapters.forEach((chapter, chapterIndex) => {
        if (chapterFilter !== null && module.id === moduleId && chapterIndex !== chapterFilter) {
          return;
        }
        const shortTitle = chapter.title.replace(/^Chapter \d+:\s*/, "");
        const generic = !chapter.checkpoint || /^Review this chapter's key terms/.test(chapter.checkpoint.answer);
        let front;
        let back;
        if (generic) {
          const points = headingsOf(chapter.content);
          if (!points.length) return;
          front = `List the key points covered in "${shortTitle}".`;
          back = `<ul>${points.map((p) => `<li>${esc(p)}</li>`).join("")}</ul>`;
        } else {
          front = chapter.checkpoint.prompt;
          back = `<p>${esc(chapter.checkpoint.answer)}</p>`;
        }
        cards.push({
          id: `${module.id}:${chapterIndex}`,
          meta: `${module.title} · ${chapter.title}`,
          link: `lesson.html?module=${module.id}&chapter=${chapterIndex}&v=5`,
          front,
          back
        });
      });
    });
  return cards;
}

function shuffle(list) {
  for (let i = list.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [list[i], list[j]] = [list[j], list[i]];
  }
  return list;
}

function getQueryNumber(name) {
  const raw = new URLSearchParams(window.location.search).get(name);
  if (raw === null) {
    return null;
  }
  const value = Number(raw);
  return Number.isNaN(value) ? null : value;
}

function showSummary(html) {
  document.getElementById("deckArea").classList.add("hidden");
  const summary = document.getElementById("deckSummary");
  summary.classList.remove("hidden");
  summary.innerHTML = html;
}

function startDeck() {
  const moduleId = document.getElementById("deckModule").value;
  const filter = document.getElementById("deckFilter").value;
  const grades = readGrades();
  const chapterFilter = getQueryNumber("chapter");

  deck = buildCards(moduleId, chapterFilter).filter((c) => filter === "all" || grades[c.id] !== "got");
  if (document.getElementById("deckShuffle").checked) {
    shuffle(deck);
  }
  position = 0;
  sessionResults = {};

  document.getElementById("deckSummary").classList.add("hidden");
  const cardArea = document.getElementById("deckArea");

  if (!deck.length) {
    cardArea.classList.add("hidden");
    showSummary(`<h2>Nothing to review</h2><p>All cards in this selection are marked "Got it". Switch to "All cards" to practise again.</p>`);
    return;
  }
  cardArea.classList.remove("hidden");
  showCard();
}

function showCard() {
  const card = deck[position];
  document.getElementById("flipCard").classList.remove("flipped");
  document.getElementById("cardMeta").textContent = card.meta;
  document.getElementById("cardFront").textContent = card.front;
  document.getElementById("cardBack").innerHTML =
    card.back + `<a class="deck-link" href="${card.link}">Open chapter &rarr;</a>`;
  document.getElementById("deckCount").textContent = `${position + 1} / ${deck.length}`;
  document.getElementById("deckBar").style.width = `${(position / deck.length) * 100}%`;
}

function answer(grade) {
  if (!deck.length || document.getElementById("deckArea").classList.contains("hidden")) {
    return;
  }
  const card = deck[position];
  writeGrade(card.id, grade);
  sessionResults[card.id] = grade;
  position += 1;
  if (position >= deck.length) {
    finishDeck();
  } else {
    showCard();
  }
}

function finishDeck() {
  document.getElementById("deckArea").classList.add("hidden");
  const got = deck.filter((c) => sessionResults[c.id] === "got").length;
  const missed = deck.filter((c) => sessionResults[c.id] === "again");
  const pct = Math.round((got / deck.length) * 100);
  showSummary(`
    <h2>Session complete</h2>
    <p class="score">${got} / ${deck.length} <span>(${pct}%)</span></p>
    ${
      missed.length
        ? `<h3>Review these chapters</h3><ul>${missed
            .map((c) => `<li><a href="${c.link}">${esc(c.meta)}</a></li>`)
            .join("")}</ul>`
        : `<p>Perfect run. Nice work!</p>`
    }
    <div class="deck-buttons">
      <button class="btn ghost" id="restartAll">Restart this deck</button>
      <button class="btn" id="restartMissed" ${missed.length ? "" : "disabled"}>Practice missed only</button>
    </div>`);
  document.getElementById("restartAll").onclick = startDeck;
  document.getElementById("restartMissed").onclick = () => {
    deck = missed;
    position = 0;
    sessionResults = {};
    document.getElementById("deckSummary").classList.add("hidden");
    document.getElementById("deckArea").classList.remove("hidden");
    showCard();
  };
}

function flip() {
  document.getElementById("flipCard").classList.toggle("flipped");
}

async function initFlashcards() {
  await loadFlashModules();
  const select = document.getElementById("deckModule");
  select.innerHTML =
    `<option value="all">All modules</option>` +
    courseModules.map((m) => `<option value="${m.id}">${esc(m.title)}</option>`).join("");

  const wanted = new URLSearchParams(window.location.search).get("module");
  if (wanted && courseModules.some((m) => m.id === wanted)) {
    select.value = wanted;
  }

  document.getElementById("deckStart").onclick = startDeck;
  document.getElementById("deckModule").onchange = startDeck;
  document.getElementById("deckFilter").onchange = startDeck;
  document.getElementById("deckShuffle").onchange = startDeck;
  document.getElementById("flipCard").onclick = flip;
  document.getElementById("cardGot").onclick = () => answer("got");
  document.getElementById("cardAgain").onclick = () => answer("again");

  document.addEventListener("keydown", (event) => {
    if (event.target.matches("select, input, textarea, button, a")) return;
    if (event.key === " ") {
      event.preventDefault();
      flip();
    } else if (event.key === "ArrowRight") {
      answer("got");
    } else if (event.key === "ArrowLeft") {
      answer("again");
    }
  });

  startDeck();
}

initFlashcards();
