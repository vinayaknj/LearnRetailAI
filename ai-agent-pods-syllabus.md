# Retail Domain Specialist Syllabus (AI Era)

## Goal
Build deep retail domain expertise first, then apply AI pods (autonomous agents) to solve high-value retail operations problems.

## Duration
- 12 weeks
- 6-8 hours/week
- Domain-first, project-based

## Final Outcome
By the end of this syllabus, you will be able to design and lead retail-focused AI systems because you understand:
- Retail business processes end to end
- Retail KPIs and operational trade-offs
- POS, pricing, inventory, and reconciliation failure patterns
- Store support workflows and escalation paths
- Where autonomous agents create measurable business impact

---

## Module 1 (Weeks 1-2): Retail Operating Model Fundamentals
### Topics
- Retail value chain: source -> warehouse -> store -> checkout -> settlement
- Store hierarchy: chain, region, cluster, store, terminal
- Core retail systems map: POS, OMS, IMS, ERP, CRM, loyalty, payments
- Online vs offline store operations

### Lab
- Create a system-context map for a mid-size retail chain.
- Identify upstream/downstream dependencies for POS.

### Deliverable
- `domain/retail-system-map.md`
- `domain/store-operating-model.md`

---

## Module 2 (Weeks 3-4): Core Retail Transactions and Data Semantics
### Topics
- Basket lifecycle: scan -> pricing -> tax -> discount -> tender -> receipt
- Returns, exchanges, voids, cancellations, refunds
- Promotion semantics: stackability, priority, exclusions, validity windows
- Master data essentials: SKU, UOM, catalog, hierarchy, price books

### Lab
- Model transaction states and edge cases.
- Write a glossary of 100 retail domain terms.

### Deliverable
- `domain/transaction-lifecycle.md`
- `domain/retail-glossary.md`

---

## Module 3 (Weeks 5-6): Inventory and Fulfillment Domain Mastery
### Topics
- On-hand, available-to-sell, reserved, in-transit, damaged stock
- Replenishment models and stock-out prevention
- Store transfer, receiving, shrinkage, cycle counts
- Omnichannel flows: BOPIS, ship-from-store, return-to-store

### Lab
- Map inventory events and reconcile mismatches.
- Define root causes for stock drift between edge and central systems.

### Deliverable
- `domain/inventory-event-model.md`
- `domain/stock-drift-root-causes.md`

---

## Module 4 (Weeks 7-8): Payments, Compliance, and Risk
### Topics
- Payment flow: authorization, capture, reversal, settlement
- Common payment failure patterns and retry design
- PCI boundaries and sensitive data handling
- Fraud signals in retail checkout behavior

### Lab
- Document payment incident categories and response playbooks.
- Build a severity matrix for payment/POS incidents.

### Deliverable
- `domain/payment-failure-taxonomy.md`
- `domain/incident-severity-matrix.md`

---

## Module 5 (Weeks 9-10): Retail SRE and Support Operations
### Topics
- Incident taxonomy for store tech issues
- MTTA, MTTR, first-time resolution, repeat incident rate
- L1/L2/L3 triage flow and escalation policy
- Runbook quality and operational readiness standards

### Lab
- Analyze 30 historical incident examples.
- Build a domain-aware RCA template for retail outages.

### Deliverable
- `ops/retail-incident-taxonomy.md`
- `ops/retail-rca-template.md`

---

## Module 6 (Weeks 11-12): AI Pods Applied to Retail Domain Problems
### Topics
- Selecting high-value agent use cases (triage, correlation, recommendation)
- Domain-constrained agent behavior (no generic answers)
- Human approval points for high-risk actions
- Domain KPIs for measuring agent impact

### Lab
- Build a domain-first AI pod:
  - Agent 1: incident classifier (retail taxonomy)
  - Agent 2: evidence correlator (logs + tickets + runbooks)
  - Agent 3: RCA drafter (template-driven)
  - Agent 4: action recommender (approval-gated)

### Deliverable
- `ai/domain-first-agent-design.md`
- `ai/retail-agent-eval-scorecard.md`

---

## Domain Knowledge Checklist (Must Master)
- Explain end-to-end retail transaction flow without notes.
- Identify top 20 POS failure scenarios and business impact.
- Distinguish pricing issue vs inventory issue vs payment issue quickly.
- Translate technical incidents into business KPI impact.
- Define safe vs unsafe actions for autonomous agents.

---

## Capstone
## Retail Domain Intelligence Playbook + AI Pod
### Must-have artifacts
- Retail domain map (systems, events, ownership)
- Incident taxonomy and severity model
- KPI-to-incident impact matrix
- Domain-specific runbooks and RCA templates
- AI pod that uses domain rules to triage and recommend actions

### Success Criteria
- >= 90% correct incident categorization on domain test set
- >= 30% faster triage compared with manual baseline
- >= 80% action recommendations accepted by L2/L3 reviewers
- <= 5% ungrounded or domain-invalid responses

---

## Weekly Study Split
- 3h domain learning (processes, cases, metrics)
- 2h domain documentation (maps, glossaries, taxonomies)
- 2h implementation (agent/use-case build)
- 1h review (metrics, gaps, improvements)

---

## Role Positioning Statement
Use this narrative in interviews:
- "I specialize in retail operations domain intelligence, then apply AI pods to automate incident triage and recovery safely."
- "My strength is translating retail process and KPI understanding into production-grade autonomous systems."
