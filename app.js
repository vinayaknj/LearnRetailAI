const modules = [
  {
    id: "m1",
    title: "Retail Operating Model Fundamentals",
    weeks: "Weeks 1-2",
    objective: [
      "Explain how a retail business operates end-to-end",
      "Identify major retail systems and responsibilities",
      "Understand data flow across operations",
      "Recognize POS dependency and failure impact"
    ],
    topics: [
      "Retail value chain",
      "Store hierarchy",
      "Retail systems landscape",
      "POS dependencies and impact",
      "Online, offline, and omnichannel",
      "Business KPIs"
    ],
    lab: [
      "Create domain/retail-system-map.md",
      "Create domain/store-operating-model.md"
    ],
    checkpoint: {
      prompt: "Explain a POS outage impact chain from terminal failure to settlement impact.",
      answer:
        "Start from terminal transaction failure, then show effects on basket completion rate, revenue leakage, queue length, customer dissatisfaction, reconciliation delays, and settlement mismatches."
    }
  },
  {
    id: "m2",
    title: "Core Retail Transactions and Data Semantics",
    weeks: "Weeks 3-4",
    topics: [
      "Basket lifecycle",
      "Returns, exchanges, voids, refunds",
      "Promotion semantics",
      "Master data essentials"
    ],
    lab: ["Model transaction states", "Build retail glossary"],
    deliverables: ["domain/transaction-lifecycle.md", "domain/retail-glossary.md"],
    checkpoint: {
      prompt: "A customer receives wrong discount. Which 4 data points do you inspect first?",
      answer:
        "Price book version, promotion eligibility, store/channel scope, and transaction timestamp against validity window."
    }
  },
  {
    id: "m3",
    title: "Inventory and Fulfillment Domain Mastery",
    weeks: "Weeks 5-6",
    topics: [
      "Inventory states",
      "Replenishment and stock-out prevention",
      "Store transfer and cycle counts",
      "Omnichannel fulfillment flows"
    ],
    lab: ["Map inventory events", "Analyze stock drift root causes"],
    deliverables: ["domain/inventory-event-model.md", "domain/stock-drift-root-causes.md"],
    checkpoint: {
      prompt: "Inventory says available online but not in store. Outline your triage path.",
      answer:
        "Compare event timestamps, transfer/receiving events, reservation locks, failed sync jobs, and cycle count/shrink adjustments."
    }
  },
  {
    id: "m4",
    title: "Payments, Compliance, and Risk",
    weeks: "Weeks 7-8",
    topics: ["Payment lifecycle", "Payment failures", "PCI boundaries", "Fraud signals"],
    lab: ["Document payment incidents", "Build severity matrix"],
    deliverables: ["domain/payment-failure-taxonomy.md", "domain/incident-severity-matrix.md"],
    checkpoint: {
      prompt: "Auth success but capture failed. What business risks appear in 24 hours?",
      answer:
        "Revenue recognition delay, reconciliation exceptions, refund complexity, disputes, and support spikes."
    }
  },
  {
    id: "m5",
    title: "Retail SRE and Support Operations",
    weeks: "Weeks 9-10",
    topics: ["Incident taxonomy", "Ops metrics", "Escalation policy", "Runbook standards"],
    lab: ["Analyze incidents", "Build retail RCA template"],
    deliverables: ["ops/retail-incident-taxonomy.md", "ops/retail-rca-template.md"],
    checkpoint: {
      prompt: "How do you classify severity for POS outage affecting 15 stores?",
      answer:
        "Use failure rate, revenue-at-risk, fallback availability, blast radius, and recovery forecast."
    }
  },
  {
    id: "m6",
    title: "AI Pods Applied to Retail Domain Problems",
    weeks: "Weeks 11-12",
    topics: ["Use-case selection", "Domain constraints", "Approval gates", "KPI measurement"],
    lab: ["Build 4-agent pod", "Measure recommendation quality"],
    deliverables: ["ai/domain-first-agent-design.md", "ai/retail-agent-eval-scorecard.md"],
    checkpoint: {
      prompt: "Which remediation actions should always require human approval?",
      answer:
        "Any action with customer financial impact, mass config changes, payment routing changes, or compliance risk."
    }
  }
];

const module1Lessons = [
  {
    title: "Chapter 1: What is Retail?",
    content: `
      <p>Retail is the business of selling products and services directly to consumers.</p>
      <ul class="clean">
        <li>Examples: Walmart, Target, Costco, Kroger, HEB, Amazon Fresh</li>
        <li>Retail is more than checkout: sourcing, storage, transport, selling, payment, finance reconciliation</li>
      </ul>
      <table class="content-table">
        <tr><th>Retail Step</th><th>Meaning</th></tr>
        <tr><td>Source products</td><td>Buy goods from suppliers</td></tr>
        <tr><td>Store inventory</td><td>Track stock in DC, warehouse, and stores</td></tr>
        <tr><td>Sell to customers</td><td>Execute transaction through POS or online flow</td></tr>
        <tr><td>Collect payment</td><td>Handle authorization, capture, settlement</td></tr>
      </table>
    `,
    checkpoint: {
      prompt: "Why is retail not just a POS transaction?",
      answer: "Because POS is only one step in the full chain from supplier procurement to post-sale settlement and accounting."
    }
  },
  {
    title: "Chapter 2: Retail Value Chain",
    content: `
      <p>End-to-end flow: Supplier -> Distribution Center -> Warehouse -> Store -> POS Checkout -> Payment Processor -> Settlement -> Finance.</p>
      <h4>Detailed Roles</h4>
      <ul class="clean">
        <li>Supplier: manufactures product and sends master data</li>
        <li>Distribution Center: aggregates and routes inventory</li>
        <li>Warehouse: manages on-hand, reserved, damaged inventory</li>
        <li>Store: stocking, receiving, cycle counting, customer support</li>
      </ul>
      <h4>Checkout Flow</h4>
      <p>Scan item -> product lookup -> price -> promotion -> tax -> payment -> receipt.</p>
      <p><strong>Key concept:</strong> Sale completed is not equal to money settled.</p>
    `,
    checkpoint: {
      prompt: "What is the difference between checkout completion and settlement?",
      answer: "Checkout confirms the sale event. Settlement is the later transfer of funds from payment networks and banks into the retailer account."
    }
  },
  {
    title: "Chapter 3: Retail Organization Hierarchy",
    content: `
      <p>Most retailers use a hierarchy: Chain -> Region -> Cluster/District -> Store -> POS Terminal.</p>
      <table class="content-table">
        <tr><th>Level</th><th>Example</th><th>Ownership</th></tr>
        <tr><td>Chain</td><td>HEB</td><td>Enterprise leadership</td></tr>
        <tr><td>Region</td><td>Texas Central</td><td>Regional operations</td></tr>
        <tr><td>District</td><td>District 48</td><td>District manager</td></tr>
        <tr><td>Store</td><td>Store #245</td><td>Store manager</td></tr>
        <tr><td>Terminal</td><td>POS 12</td><td>Frontline operations</td></tr>
      </table>
    `,
    checkpoint: {
      prompt: "Why does hierarchy matter in incident management?",
      answer: "Severity and escalation depend on blast radius. A terminal issue differs from a district-wide or region-wide outage."
    }
  },
  {
    title: "Chapter 4: Retail Systems Landscape",
    content: `
      <p>Retail operations run through connected systems: POS, OMS, IMS, ERP, CRM, Loyalty, Payments.</p>
      <ul class="clean">
        <li>POS: executes transaction and tender</li>
        <li>OMS: orchestrates online orders and fulfillment</li>
        <li>IMS: tracks stock states and availability</li>
        <li>ERP: financial posting, procurement, accounting</li>
        <li>CRM/Loyalty: customer profile, offers, rewards</li>
      </ul>
      <p>System boundaries are critical for accurate RCA and ownership routing.</p>
    `,
    checkpoint: {
      prompt: "What is the quickest way to differentiate OMS vs IMS responsibilities?",
      answer: "OMS manages order lifecycle and promises, while IMS manages inventory truth and stock state."
    }
  },
  {
    title: "Chapter 5: POS Dependencies",
    content: `
      <h4>Upstream Dependencies (POS depends on)</h4>
      <ul class="clean">
        <li>Price service</li>
        <li>Tax service</li>
        <li>Promotion service</li>
        <li>Product catalog</li>
        <li>Loyalty service</li>
      </ul>
      <h4>Downstream Dependencies (Depend on POS)</h4>
      <ul class="clean">
        <li>Reporting and analytics</li>
        <li>ERP postings</li>
        <li>Inventory updates</li>
        <li>Settlement and fraud systems</li>
      </ul>
      <p>If transaction upload fails, inventory drift and reconciliation issues follow.</p>
    `,
    checkpoint: {
      prompt: "Price service fails but POS is running. What happens?",
      answer: "Transactions may continue with wrong or stale pricing, causing overrides, customer complaints, revenue leakage, and correction overhead."
    }
  },
  {
    title: "Chapter 6: Online vs Offline vs Omnichannel",
    content: `
      <table class="content-table">
        <tr><th>Mode</th><th>Flow</th><th>Characteristics</th></tr>
        <tr><td>Offline</td><td>Customer -> Store -> POS</td><td>Immediate fulfillment, local inventory, cash support</td></tr>
        <tr><td>Online</td><td>Website -> OMS -> Warehouse -> Shipping -> Customer</td><td>Fulfillment complexity, shipping cost, delayed delivery</td></tr>
        <tr><td>Omnichannel</td><td>Mixed channels</td><td>BOPIS, ship-from-store, return-to-store</td></tr>
      </table>
      <p>Omnichannel increases customer flexibility but raises orchestration complexity.</p>
    `,
    checkpoint: {
      prompt: "Why do omnichannel operations create more incident vectors?",
      answer: "Because cross-system coordination adds state synchronization, reservation logic, and fulfillment routing complexity."
    }
  },
  {
    title: "Chapter 7: Business KPIs",
    content: `
      <ul class="clean">
        <li>Revenue = Units Sold x Selling Price</li>
        <li>Average Basket Value = Total Sales / Number of Transactions</li>
        <li>Conversion Rate = Purchasing Customers / Visitors</li>
        <li>Inventory Accuracy = System Inventory vs Physical Inventory</li>
        <li>Stock-out Rate measures unavailable products</li>
      </ul>
      <p>Every system incident must be translated into KPI impact to prioritize correctly.</p>
    `,
    checkpoint: {
      prompt: "Which KPI is most sensitive to POS downtime in peak hours?",
      answer: "Conversion rate and revenue are usually hit first, then customer satisfaction and repeat visit probability."
    }
  },
  {
    title: "Chapter 8: Real-World Scenario",
    content: `
      <p>Scenario: Customer buys 2 shampoo units during BOGO promotion, but discount is not applied.</p>
      <h4>Potential Failing Systems</h4>
      <ul class="clean">
        <li>Promotion service</li>
        <li>POS integration logic</li>
        <li>Pricing feed versioning</li>
      </ul>
      <h4>Business Impact</h4>
      <ul class="clean">
        <li>Customer complaints</li>
        <li>Manual overrides and queue delays</li>
        <li>Revenue and reporting inconsistencies</li>
      </ul>
    `,
    checkpoint: {
      prompt: "What is your first triage check in this scenario?",
      answer: "Verify promotion eligibility and validity window for the SKU, store, channel, and transaction timestamp."
    }
  },
  {
    title: "Chapter 9: Quick Quiz",
    content: `
      <ol>
        <li>Which system is primarily responsible for inventory tracking? <strong>IMS</strong></li>
        <li>What is an upstream dependency of POS? <strong>Pricing service</strong></li>
        <li>Which system handles online order orchestration? <strong>OMS</strong></li>
        <li>What comes after authorization in payment lifecycle? <strong>Capture</strong></li>
      </ol>
      <p>Use this quiz before moving to assignments.</p>
    `,
    checkpoint: {
      prompt: "If you miss 2 out of 4 quiz answers, what should you review first?",
      answer: "Review system boundaries and transaction flow responsibilities before retrying."
    }
  },
  {
    title: "Chapter 10: Practical Assignments",
    content: `
      <h4>Assignment 1</h4>
      <p>Create <a href="ai-agent-pods-syllabus.md" target="_blank">domain/retail-system-map.md</a> with systems, owners, data flows, and dependencies.</p>
      <h4>Assignment 2</h4>
      <p>Create <a href="ai-agent-pods-syllabus.md" target="_blank">domain/store-operating-model.md</a> with hierarchy, roles, daily operations, and ownership matrix.</p>
      <p>Document assumptions for each system integration edge.</p>
    `,
    checkpoint: {
      prompt: "What makes a retail system map useful for incidents?",
      answer: "Clear ownership, dependency direction, and data flow timing that reduces triage ambiguity."
    }
  },
  {
    title: "Chapter 11: Completion Criteria",
    content: `
      <p>You should answer these without notes:</p>
      <ol>
        <li>What are the major retail systems?</li>
        <li>How does inventory move supplier to customer?</li>
        <li>What does POS depend on?</li>
        <li>Difference between OMS and IMS?</li>
        <li>Difference between online, offline, omnichannel?</li>
        <li>Business impact of POS downtime?</li>
        <li>How does money move to retailer account?</li>
      </ol>
      <p>If all are clear, Module 1 is complete.</p>
    `,
    checkpoint: {
      prompt: "What score should you target before Module 2?",
      answer: "At least 90% confidence across system responsibilities, dependencies, and KPI impact language."
    }
  }
];

const completionKey = "retailDomainCourseCompletion";
const notesKey = "retailDomainCourseNotes";
const lessonProgressKey = "retailDomainLessonProgress";

let activeModuleId = null;
let activeLessonIndex = 0;

function getCompletionState() {
  return JSON.parse(localStorage.getItem(completionKey) || "{}");
}

function saveCompletionState(state) {
  localStorage.setItem(completionKey, JSON.stringify(state));
}

function getLessonProgressState() {
  return JSON.parse(localStorage.getItem(lessonProgressKey) || "{}");
}

function saveLessonProgressState(state) {
  localStorage.setItem(lessonProgressKey, JSON.stringify(state));
}

function getNotesState() {
  return JSON.parse(localStorage.getItem(notesKey) || "{}");
}

function saveNotesState(state) {
  localStorage.setItem(notesKey, JSON.stringify(state));
}

function getCurrentNoteId() {
  if (!activeModuleId) {
    return "";
  }
  if (activeModuleId === "m1") {
    return `${activeModuleId}-lesson-${activeLessonIndex}`;
  }
  return activeModuleId;
}

function ensureModuleLessonState(moduleId, total) {
  const state = getLessonProgressState();
  if (!state[moduleId] || state[moduleId].length !== total) {
    state[moduleId] = new Array(total).fill(false);
    saveLessonProgressState(state);
  }
  return state[moduleId];
}

function renderModuleList() {
  const list = document.getElementById("moduleList");
  const completion = getCompletionState();
  const lessonState = getLessonProgressState();
  list.innerHTML = "";

  modules.forEach((module) => {
    let doneCount = 0;
    let total = 0;

    if (module.id === "m1") {
      const states = lessonState[module.id] || [];
      doneCount = states.filter(Boolean).length;
      total = module1Lessons.length;
    } else {
      const states = completion[module.id] || [];
      doneCount = states.filter(Boolean).length;
      total = module.topics.length;
    }

    const li = document.createElement("li");
    const btn = document.createElement("button");
    btn.innerHTML = `<strong>${module.title}</strong><br><small>${module.weeks} | ${doneCount}/${total} complete</small>`;
    btn.className = module.id === activeModuleId ? "active" : "";
    btn.addEventListener("click", () => selectModule(module.id));
    li.appendChild(btn);
    list.appendChild(li);
  });

  renderGlobalProgress();
}

function renderGlobalProgress() {
  const completion = getCompletionState();
  const lessonState = getLessonProgressState();

  let done = 0;
  let total = 0;

  modules.forEach((module) => {
    if (module.id === "m1") {
      const states = lessonState[module.id] || [];
      done += states.filter(Boolean).length;
      total += module1Lessons.length;
    } else {
      const states = completion[module.id] || [];
      done += states.filter(Boolean).length;
      total += module.topics.length;
    }
  });

  const pct = total === 0 ? 0 : Math.round((done / total) * 100);
  document.getElementById("globalStats").textContent = `${pct}% complete (${done}/${total} items)`;
}

function selectModule(moduleId) {
  activeModuleId = moduleId;
  const module = modules.find((m) => m.id === moduleId);

  if (moduleId === "m1") {
    ensureModuleLessonState("m1", module1Lessons.length);
    renderModule1Lesson();
    renderModuleList();
    return;
  }

  renderStandardModule(module);
  renderModuleList();
}

function renderModule1Lesson() {
  const module = modules.find((m) => m.id === "m1");
  const lessons = module1Lessons;
  const lesson = lessons[activeLessonIndex];
  const states = ensureModuleLessonState("m1", lessons.length);
  const done = states.filter(Boolean).length;

  const lessonButtons = lessons
    .map((entry, idx) => {
      const status = states[idx] ? "done" : "";
      const active = idx === activeLessonIndex ? "active" : "";
      return `<button class="lesson-btn ${active} ${status}" data-lesson-index="${idx}">${idx + 1}. ${entry.title}</button>`;
    })
    .join("");

  const html = `
    <h2 class="module-title">${module.title}</h2>
    <p class="module-weeks">${module.weeks} | Chapter ${activeLessonIndex + 1}/${lessons.length} | ${done}/${lessons.length} completed</p>

    <p class="section-label">Learning Objective</p>
    <ul class="clean">${module.objective.map((item) => `<li>${item}</li>`).join("")}</ul>

    <div class="lesson-layout">
      <div class="lesson-list">${lessonButtons}</div>
      <article class="lesson-body">
        <h3>${lesson.title}</h3>
        ${lesson.content}
      </article>
    </div>

    <div class="lesson-controls">
      <label class="check-item"><input type="checkbox" id="lessonDoneToggle" ${states[activeLessonIndex] ? "checked" : ""}/> <span>Mark chapter complete</span></label>
      <div class="nav-controls">
        <button class="btn ghost" id="prevLessonBtn" ${activeLessonIndex === 0 ? "disabled" : ""}>Previous</button>
        <button class="btn" id="nextLessonBtn" ${activeLessonIndex === lessons.length - 1 ? "disabled" : ""}>Next</button>
      </div>
    </div>
  `;

  const content = document.getElementById("chapterContent");
  content.innerHTML = html;

  content.querySelectorAll(".lesson-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      activeLessonIndex = Number(btn.getAttribute("data-lesson-index"));
      renderModule1Lesson();
      loadNotes(getCurrentNoteId());
      renderModuleList();
    });
  });

  const doneToggle = document.getElementById("lessonDoneToggle");
  doneToggle.addEventListener("change", (event) => {
    const state = getLessonProgressState();
    if (!state.m1) {
      state.m1 = new Array(module1Lessons.length).fill(false);
    }
    state.m1[activeLessonIndex] = event.target.checked;
    saveLessonProgressState(state);
    renderModuleList();
    renderModule1Lesson();
    loadNotes(getCurrentNoteId());
  });

  const prevBtn = document.getElementById("prevLessonBtn");
  const nextBtn = document.getElementById("nextLessonBtn");

  prevBtn.addEventListener("click", () => {
    if (activeLessonIndex > 0) {
      activeLessonIndex -= 1;
      renderModule1Lesson();
      loadNotes(getCurrentNoteId());
    }
  });

  nextBtn.addEventListener("click", () => {
    if (activeLessonIndex < module1Lessons.length - 1) {
      activeLessonIndex += 1;
      renderModule1Lesson();
      loadNotes(getCurrentNoteId());
    }
  });

  setupCheckpoint(lesson.checkpoint || module.checkpoint);
  loadNotes(getCurrentNoteId());
}

function renderStandardModule(module) {
  const completion = getCompletionState();
  const states = completion[module.id] || new Array(module.topics.length).fill(false);

  const topicChecklist = module.topics
    .map((topic, idx) => {
      const checked = states[idx] ? "checked" : "";
      return `<label class="check-item"><input type="checkbox" data-topic-index="${idx}" ${checked} /> <span>${topic}</span></label>`;
    })
    .join("");

  const html = `
    <h2 class="module-title">${module.title}</h2>
    <p class="module-weeks">${module.weeks}</p>

    <p class="section-label">Topics</p>
    <div class="checklist">${topicChecklist}</div>

    <p class="section-label">Lab</p>
    <ul class="clean">${module.lab.map((item) => `<li>${item}</li>`).join("")}</ul>

    <p class="section-label">Deliverables</p>
    <ul class="clean">${(module.deliverables || []).map((item) => `<li>${item}</li>`).join("")}</ul>
  `;

  const content = document.getElementById("chapterContent");
  content.innerHTML = html;

  content.querySelectorAll("input[type='checkbox']").forEach((checkbox) => {
    checkbox.addEventListener("change", (event) => {
      const topicIndex = Number(event.target.getAttribute("data-topic-index"));
      updateTopicCompletion(module.id, topicIndex, event.target.checked);
    });
  });

  setupCheckpoint(module.checkpoint);
  loadNotes(getCurrentNoteId());
}

function updateTopicCompletion(moduleId, topicIndex, checked) {
  const completion = getCompletionState();
  if (!completion[moduleId]) {
    completion[moduleId] = [];
  }
  completion[moduleId][topicIndex] = checked;
  saveCompletionState(completion);
  renderModuleList();
}

function setupCheckpoint(checkpoint) {
  document.getElementById("checkpointPrompt").textContent = checkpoint.prompt;

  const revealBtn = document.getElementById("revealAnswerBtn");
  const answer = document.getElementById("checkpointAnswer");
  answer.classList.add("hidden");
  answer.textContent = "";

  revealBtn.disabled = false;
  revealBtn.onclick = () => {
    answer.textContent = checkpoint.answer;
    answer.classList.remove("hidden");
  };
}

function loadNotes(noteId) {
  const notes = getNotesState();
  document.getElementById("chapterNotes").value = notes[noteId] || "";
}

function saveCurrentNotes() {
  if (!activeModuleId) {
    return;
  }
  const notes = getNotesState();
  const noteId = getCurrentNoteId();
  notes[noteId] = document.getElementById("chapterNotes").value.trim();
  saveNotesState(notes);
}

document.getElementById("saveNotesBtn").addEventListener("click", () => {
  saveCurrentNotes();
  const btn = document.getElementById("saveNotesBtn");
  const original = btn.textContent;
  btn.textContent = "Saved";
  setTimeout(() => {
    btn.textContent = original;
  }, 1000);
});

renderModuleList();
selectModule("m1");
