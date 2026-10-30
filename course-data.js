const courseModules = [
  {
    id: "m1",
    title: "Retail Operating Model Fundamentals",
    weeks: "Weeks 1-2",
    chapters: [
      {
        title: "Chapter 0: Learning Objective",
        content: `
          <p>By the end of this module, learners should be able to:</p>
          <ul class="clean">
            <li>Explain how a retail business operates end-to-end</li>
            <li>Identify major retail systems and their responsibilities</li>
            <li>Understand how data flows through retail operations</li>
            <li>Describe store hierarchy and ownership structures</li>
            <li>Recognize POS dependencies and failure impact</li>
          </ul>
          <h3>Outcome Standard</h3>
          <p>You are ready for Module 2 when you can trace one transaction from supplier inventory creation through checkout, payment settlement, and finance posting without ambiguity.</p>
          <h3>How To Study This Module</h3>
          <ul class="clean">
            <li>Focus first on process sequence, then on system ownership.</li>
            <li>Learn incident impact in business terms, not only technical terms.</li>
            <li>Memorize where data is mastered vs where it is consumed.</li>
          </ul>
        `,
        checkpoint: {
          prompt: "What is the focus of Module 1 in one line?",
          answer: "Build clear retail domain foundations before deeper technical or AI implementation."
        }
      },
      {
        title: "Chapter 1: What is Retail?",
        content: `
          <h3>Definition</h3>
          <p>Retail is the business of selling products or services directly to consumers.</p>
          <p>Examples: Walmart, Target, Costco, Kroger, HEB, Amazon Fresh.</p>
          <p>A retail company does much more than billing. It sources products, stores inventory, transports products, sells to customers, collects payment, and reconciles finances.</p>
          <h3>Retail Is A Coordinated Network</h3>
          <p>A customer sees one bill at checkout, but the business depends on synchronized operations across merchandising, supply chain, store execution, finance, and digital channels.</p>
          <ol>
            <li>Source products</li>
            <li>Store inventory</li>
            <li>Transport products</li>
            <li>Sell to customers</li>
            <li>Collect payment</li>
            <li>Reconcile finances</li>
          </ol>
          <h3>Core Operating Risks</h3>
          <ul class="clean">
            <li>Demand mismatch: overstock creates carrying cost, understock creates lost sales.</li>
            <li>Price integrity gaps: wrong price or missing promotion erodes trust.</li>
            <li>Execution variance: store-level process inconsistency impacts service quality.</li>
            <li>Settlement delay: recognized sales may not equal cash received same day.</li>
          </ul>
        `,
        checkpoint: {
          prompt: "Why is retail not just billing at POS?",
          answer: "Because billing is one step in the full chain from sourcing to settlement and accounting."
        }
      },
      {
        title: "Chapter 2: Retail Value Chain",
        content: `
          <h3>End-to-End Retail Flow</h3>
            <pre class="flow-block">Supplier
          -> Distribution Center
          -> Warehouse
          -> Store
          -> POS Checkout
          -> Payment Processor
          -> Settlement
          -> Finance Systems</pre>

          <h3>Detailed Explanation</h3>
          <p><strong>Supplier:</strong> manufactures products and sends master data.</p>
          <p><strong>Distribution Center:</strong> receives, aggregates, and routes stock.</p>
          <p><strong>Warehouse:</strong> tracks on-hand, reserved, damaged inventory.</p>
          <p><strong>Store Operations:</strong> stocking, receiving, cycle counting, customer service.</p>
          <p><strong>Checkout:</strong> scan, lookup, price, promo, tax, payment, receipt.</p>
          <p><strong>Settlement:</strong> fund movement after checkout through payment network and bank.</p>

          <p><strong>Important distinction:</strong> Sale completed is not equal to money settled.</p>
          <h3>Where Delays Commonly Occur</h3>
          <table class="content-table">
            <tr><th>Step</th><th>Frequent Delay Cause</th><th>Business Effect</th></tr>
            <tr><td>Supplier -> DC</td><td>Late ASN or shipment mismatch</td><td>Receiving backlog, shelf gaps</td></tr>
            <tr><td>Store -> POS</td><td>Catalog or price feed lag</td><td>Manual overrides at checkout</td></tr>
            <tr><td>Payment -> Settlement</td><td>Batch timing or processor hold</td><td>Cashflow visibility delay</td></tr>
          </table>
          <h3>Key Point</h3>
          <p>Retail success depends on both physical product flow and digital data flow. Break either one and customer experience degrades quickly.</p>
        `,
        checkpoint: {
          prompt: "What comes after POS checkout in money movement?",
          answer: "Processor and banking settlement flow, then finance posting."
        }
      },
      {
        title: "Chapter 3: Retail Organization Hierarchy",
        content: `
            <pre class="flow-block">Retail Chain
          -> Region
          -> District / Cluster
          -> Store
          -> POS Terminal</pre>
          <table class="content-table">
            <tr><th>Level</th><th>Example</th><th>Notes</th></tr>
            <tr><td>Retail Chain</td><td>HEB</td><td>Entire business</td></tr>
            <tr><td>Region</td><td>Texas Central</td><td>Geographic grouping</td></tr>
            <tr><td>District / Cluster</td><td>District 48</td><td>Manager oversees many stores</td></tr>
            <tr><td>Store</td><td>Store #245</td><td>Address, hours, manager, inventory</td></tr>
            <tr><td>Terminal</td><td>POS 12</td><td>Scans items, takes tenders, prints receipts</td></tr>
          </table>
          <h3>Operational Ownership By Level</h3>
          <ul class="clean">
            <li>Chain: enterprise standards, platform strategy, vendor contracts.</li>
            <li>Region: execution consistency, regional demand shape, escalations.</li>
            <li>District: multi-store coaching, incident triage coordination.</li>
            <li>Store: daily operations, labor allocation, service quality.</li>
            <li>Terminal: transaction execution and immediate customer interaction.</li>
          </ul>
          <h3>Incident Blast Radius</h3>
          <p>Terminal issue impacts one checkout lane; store issue impacts all lanes in one location; region-level issue can affect dozens of stores simultaneously.</p>
        `,
        checkpoint: {
          prompt: "Why does hierarchy matter for incidents?",
          answer: "It determines blast radius, owner routing, and escalation urgency."
        }
      },
      {
        title: "Chapter 4: Retail Systems Landscape",
        content: `
          <h3>Core System Map</h3>
            <pre class="flow-block">             ERP
              |
      IMS -------- POS -------- CRM
       |             |           |
      OMS ------- Loyalty ---- Payments</pre>

          <ul class="clean">
            <li>POS: transaction execution</li>
            <li>OMS: online order orchestration</li>
            <li>IMS: inventory truth and stock state</li>
            <li>ERP: accounting and finance posting</li>
            <li>CRM/Loyalty: customer behavior and rewards</li>
            <li>Payments: authorization, capture, settlement</li>
          </ul>
          <h3>System Of Record Vs System Of Engagement</h3>
          <table class="content-table">
            <tr><th>Category</th><th>Examples</th><th>Primary Purpose</th></tr>
            <tr><td>System of Record</td><td>ERP, IMS, Catalog</td><td>Trusted master data and auditable state</td></tr>
            <tr><td>System of Engagement</td><td>POS, E-commerce UI, Loyalty App</td><td>Customer and operator interaction</td></tr>
            <tr><td>System of Orchestration</td><td>OMS, Payment Gateway</td><td>Cross-system coordination and workflow control</td></tr>
          </table>
          <h3>Design Principle</h3>
          <p>Do not duplicate business truth in every system. Define one owning system per critical domain object.</p>
        `,
        checkpoint: {
          prompt: "OMS vs IMS in one line?",
          answer: "OMS manages order lifecycle; IMS manages inventory state."
        }
      },
      {
        title: "Chapter 5: POS Dependencies",
        content: `
          <h3>Upstream Dependencies</h3>
          <p>Price Service, Inventory Service, Tax Service, Promotion Service, Product Catalog, Loyalty Service.</p>

          <h3>Downstream Dependencies</h3>
          <p>Reporting, ERP, Inventory Updates, Settlement, Analytics, Fraud Detection.</p>

          <h3>Example Impacts</h3>
          <ul class="clean">
            <li>Price service failure -> wrong prices, complaints, sales loss</li>
            <li>Transaction upload failure -> inventory drift, reporting errors, reconciliation issues</li>
          </ul>
          <h3>Dependency Failure Matrix</h3>
          <table class="content-table">
            <tr><th>Dependency</th><th>Typical Symptom</th><th>Immediate Mitigation</th></tr>
            <tr><td>Price Service</td><td>Unexpected totals</td><td>Fallback to approved emergency price list</td></tr>
            <tr><td>Tax Service</td><td>Tax mismatch warnings</td><td>Trigger regional tax-rule fallback and audit queue</td></tr>
            <tr><td>Loyalty Service</td><td>Points not applied</td><td>Issue deferred benefit token for later reconciliation</td></tr>
            <tr><td>Upload Pipeline</td><td>Missing transactions in HQ</td><td>Replay queue with idempotency keys</td></tr>
          </table>
          <h3>Operational Insight</h3>
          <p>POS resilience is less about one perfect service and more about controlled degradation with clear reconciliation paths.</p>
        `,
        checkpoint: {
          prompt: "Price service down, POS up. What happens?",
          answer: "Checkout may continue with wrong/stale prices, causing overrides and revenue leakage."
        }
      },
      {
        title: "Chapter 6: Online vs Offline vs Omnichannel",
        content: `
          <h3>Offline Retail</h3>
          <pre class="flow-block">Customer -> Store -> POS</pre>

          <h3>Online Retail</h3>
          <pre class="flow-block">Website -> OMS -> Warehouse -> Shipping -> Customer</pre>

          <h3>Omnichannel Retail</h3>
          <table class="content-table">
            <tr><th>Pattern</th><th>Meaning</th></tr>
            <tr><td>BOPIS</td><td>Buy online, pick up in store</td></tr>
            <tr><td>Ship From Store</td><td>Store inventory fulfills online order</td></tr>
            <tr><td>Return To Store</td><td>Online purchase returned physically</td></tr>
          </table>
          <h3>Capability Comparison</h3>
          <table class="content-table">
            <tr><th>Model</th><th>Strength</th><th>Complexity Driver</th></tr>
            <tr><td>Offline</td><td>Immediate fulfillment</td><td>In-store staffing and queue control</td></tr>
            <tr><td>Online</td><td>Wider reach and assortment</td><td>Fulfillment and last-mile shipping</td></tr>
            <tr><td>Omnichannel</td><td>Customer convenience and flexibility</td><td>Real-time inventory and order sync</td></tr>
          </table>
        `,
        checkpoint: {
          prompt: "Why is omnichannel harder to run?",
          answer: "It requires cross-system synchronization between orders, inventory, and fulfillment."
        }
      },
      {
        title: "Chapter 7: Business KPIs",
        content: `
          <pre class="flow-block">Revenue = Units Sold x Selling Price
Average Basket Value = Total Sales / Number of Transactions
Conversion Rate = Purchasing Customers / Store Visitors
Inventory Accuracy = System Inventory vs Physical Inventory</pre>
          <p>Stock-out rate is a critical KPI: high stock-outs create lost sales and dissatisfaction.</p>
          <h3>KPI Interpretation Guide</h3>
          <ul class="clean">
            <li>Revenue up with margin down can signal discount overuse.</li>
            <li>Basket value up with conversion down can hide checkout friction.</li>
            <li>High inventory accuracy but high stock-out may indicate poor replenishment timing.</li>
            <li>Low conversion during promo windows often maps to POS or promotion rule failure.</li>
          </ul>
          <h3>Leading vs Lagging Indicators</h3>
          <p>Queue length and scan latency are leading indicators. Daily sales and settlement reports are lagging indicators.</p>
        `,
        checkpoint: {
          prompt: "Which KPI is hit first by checkout outages?",
          answer: "Conversion rate and revenue."
        }
      },
      {
        title: "Chapter 8: Real-World Scenario",
        content: `
          <p>Scenario: BOGO promotion expected for 2 shampoo units, but discount not applied.</p>
          <p>Likely failing areas: Promotion Service, POS integration, Pricing feed.</p>
          <p>Business impact: customer complaints, manual overrides, reporting inconsistencies.</p>
          <h3>Triage Runbook</h3>
          <ol>
            <li>Confirm promotion configuration: SKU scope, store scope, start/end time, channel eligibility.</li>
            <li>Validate customer/basket conditions: quantity threshold, excluded combinations, loyalty requirements.</li>
            <li>Inspect POS logs for rule evaluation response and fallback behavior.</li>
            <li>Compare expected vs actual price events in transaction audit trail.</li>
            <li>Escalate with incident template including sample receipt and transaction ID.</li>
          </ol>
          <h3>Recovery Options</h3>
          <ul class="clean">
            <li>Temporary cashier override policy with reason codes.</li>
            <li>Back-office compensation coupon for affected customers.</li>
            <li>Post-incident replay validation for reporting consistency.</li>
          </ul>
        `,
        checkpoint: {
          prompt: "First triage action?",
          answer: "Validate promotion eligibility and validity for SKU/store/time."
        }
      },
      {
        title: "Chapter 9: Quick Quiz",
        content: `
          <ol>
            <li>Inventory tracking system: <strong>IMS</strong></li>
            <li>POS upstream dependency: <strong>Pricing Service</strong></li>
            <li>Online orchestration system: <strong>OMS</strong></li>
            <li>After authorization comes: <strong>Capture</strong></li>
          </ol>
          <h3>Challenge Questions</h3>
          <ol>
            <li>Why can sales reports look correct while settlement is still incomplete?</li>
            <li>What distinguishes a local store incident from a region-level platform incident?</li>
            <li>When should POS fail closed vs fail open for dependency outages?</li>
          </ol>
        `,
        checkpoint: {
          prompt: "If score is low, what should you revise first?",
          answer: "System boundaries and transaction flow responsibilities."
        }
      },
      {
        title: "Chapter 10: Practical Assignments",
        content: `
          <p>Create <strong>domain/retail-system-map.md</strong> with systems, ownership, data flows, upstream/downstream dependencies.</p>
          <p>Create <strong>domain/store-operating-model.md</strong> with hierarchy, roles, opening/closing procedures, incident ownership matrix.</p>
          <h3>Assignment Quality Checklist</h3>
          <ul class="clean">
            <li>Each system must include owned data entities and non-owned consumed entities.</li>
            <li>Each dependency must include failure symptom and fallback approach.</li>
            <li>Each store process must include role owner, timing, and observable output.</li>
            <li>Incident matrix must define severity, escalation path, and communication SLA.</li>
          </ul>
        `,
        checkpoint: {
          prompt: "What makes these assignments high value?",
          answer: "They convert domain theory into operational artifacts that speed up incident triage."
        }
      },
      {
        title: "Chapter 11: Completion Criteria",
        content: `
          <p>You should answer without notes:</p>
          <ol>
            <li>Major retail systems</li>
            <li>Inventory movement supplier to customer</li>
            <li>POS dependencies</li>
            <li>OMS vs IMS</li>
            <li>Online vs offline vs omnichannel</li>
            <li>POS downtime business impact</li>
            <li>Money flow from card to retailer account</li>
          </ol>
          <h3>Performance Threshold</h3>
          <p>Target at least 80% accuracy on quiz and scenario walkthroughs, plus the ability to explain one failure case with root cause and mitigation.</p>
          <h3>Readiness Signal</h3>
          <p>If you can confidently separate responsibilities of POS, OMS, IMS, ERP, and Payments under pressure, you are ready for transaction-deep work in Module 2.</p>
        `,
        checkpoint: {
          prompt: "Ready for Module 2 when?",
          answer: "When all seven criteria are answered clearly with examples."
        }
      }
    ]
  },
  {
    id: "m2",
    title: "Core Retail Transactions and Data Semantics",
    weeks: "Weeks 3-4",
    chapters: [
      {
        title: "Chapter 0: Purpose and Learning Outcomes",
        content: `
          <h3>Purpose</h3>
          <p>Every retail operation revolves around transactions. Inventory, promotions, payments, and finance all depend on transaction correctness.</p>
          <h3>Learning Outcomes</h3>
          <ul class="clean">
            <li>Explain basket lifecycle scan to receipt</li>
            <li>Understand pricing, promotion, tax, and tender processing</li>
            <li>Differentiate return, refund, exchange, void, cancellation</li>
            <li>Understand SKU, UOM, hierarchy, catalog, price book</li>
            <li>Identify common transaction failure patterns</li>
          </ul>
        `,
        checkpoint: {
          prompt: "Why is Module 2 foundational?",
          answer: "Because transaction correctness drives revenue, tax accuracy, and customer trust."
        }
      },
      {
        title: "Chapter 1: Retail Transaction Lifecycle",
        content: `
          <pre class="flow-block">Scan -> Product Lookup -> Price -> Promotion -> Tax -> Tender -> Authorization -> Receipt -> Inventory Update -> Sales Upload</pre>
          <p>One transaction can generate dozens of system events.</p>
          <p>Incorrect transactions create revenue leakage, tax errors, and inventory drift.</p>
        `,
        checkpoint: {
          prompt: "Where do many production incidents cluster?",
          answer: "At pricing, promotion, tax, and payment authorization stages."
        }
      },
      {
        title: "Chapter 2: Product Lookup and Catalog Management",
        content: `
          <p>Barcode scan should resolve SKU, description, UOM, department, category, tax group, price group, status.</p>
          <h3>Common Issues</h3>
          <ul class="clean">
            <li>Missing SKU -> sale blocked</li>
            <li>Duplicate barcode -> wrong product sold</li>
            <li>Inactive product -> checkout rejection</li>
          </ul>
        `,
        checkpoint: {
          prompt: "Impact of missing SKU?",
          answer: "Cannot complete sale without manual intervention."
        }
      },
      {
        title: "Chapter 3: Pricing Fundamentals",
        content: `
          <p>Price sources: standard, regional, promotional, markdown, clearance, member pricing.</p>
          <pre class="flow-block">Scan -> Identify Store -> Locate Price Book -> Retrieve Active Price -> Apply Overrides</pre>
          <p>Pricing KPIs: price accuracy, override frequency, leakage, sync success rate.</p>
        `,
        checkpoint: {
          prompt: "Why can same SKU have different store prices?",
          answer: "Store-level price books and regional strategy differences."
        }
      },
      {
        title: "Chapter 4: Promotion Processing",
        content: `
          <p>Promotion flow: active date, store eligibility, customer eligibility, item eligibility, priority, stackability, apply discount.</p>
          <p>Promotion failures often come from misconfiguration, date validation errors, or mapping issues.</p>
        `,
        checkpoint: {
          prompt: "What decides winning promotion?",
          answer: "Priority and stackability rules."
        }
      },
      {
        title: "Chapter 5: Tax Calculation",
        content: `
          <p>Tax differs by jurisdiction, product type, and customer type.</p>
          <pre class="flow-block">Jurisdiction -> Tax Group -> Rules -> Calculate -> Exemptions</pre>
          <p>Tax errors create regulatory risk and financial correction overhead.</p>
        `,
        checkpoint: {
          prompt: "Why can tax differ for products in same store?",
          answer: "Different tax groups and classification rules by item."
        }
      },
      {
        title: "Chapter 6: Tender and Payment Processing",
        content: `
          <p>Tender methods include cash, card, gift card, wallet, and EBT.</p>
          <pre class="flow-block">Customer -> POS -> Gateway -> Network -> Issuer -> Response</pre>
          <p>Outcomes: approved, declined, timeout. Partial tender is common in mixed payments.</p>
        `,
        checkpoint: {
          prompt: "What is partial tender?",
          answer: "Splitting payment across methods, such as gift card plus credit card."
        }
      },
      {
        title: "Chapter 7: Receipt Generation",
        content: `
          <p>Receipts are critical for returns, audit, disputes, and service records.</p>
          <p>If printer fails after completion, system must support reprint and traceability.</p>
        `,
        checkpoint: {
          prompt: "Why is receipt reliability operationally important?",
          answer: "Because returns and audit evidence rely on receipt integrity."
        }
      },
      {
        title: "Chapter 8: Returns, Refunds, Exchanges, Voids, and Cancellations",
        content: `
          <table class="content-table">
            <tr><th>Action</th><th>Sale Completed?</th><th>Inventory Impact</th></tr>
            <tr><td>Void</td><td>No</td><td>No</td></tr>
            <tr><td>Cancellation</td><td>No</td><td>No</td></tr>
            <tr><td>Return</td><td>Yes</td><td>Usually increase</td></tr>
            <tr><td>Refund</td><td>Yes</td><td>Depends</td></tr>
            <tr><td>Exchange</td><td>Yes</td><td>Increase + decrease</td></tr>
          </table>
        `,
        checkpoint: {
          prompt: "Void vs return?",
          answer: "Void is pre-completion correction; return is post-completion reversal."
        }
      },
      {
        title: "Chapter 9: Transaction State Management",
        content: `
          <pre class="flow-block">Created -> Scanning -> Pricing -> Promotion -> Tax -> Tender -> Authorization -> Completed</pre>
          <p>Failure states: cancelled, failed, timed out, offline, refunded, voided.</p>
          <p>Recovery logic should be explicit and auditable.</p>
        `,
        checkpoint: {
          prompt: "Why explicit state transitions?",
          answer: "They control valid actions, recovery behavior, and audit compliance."
        }
      },
      {
        title: "Chapter 10: Master Data Fundamentals",
        content: `
          <p>Master data includes products, stores, customers, categories, and price books.</p>
          <p>SKU and UOM accuracy directly affects tax, pricing, and fulfillment behavior.</p>
        `,
        checkpoint: {
          prompt: "How can master data break checkout?",
          answer: "Wrong attributes propagate to pricing, tax, promo, and reporting errors."
        }
      },
      {
        title: "Chapter 11: Common Retail Transaction Failures",
        content: `
          <ul class="clean">
            <li>Price mismatch</li>
            <li>Missing promotion</li>
            <li>Duplicate payment</li>
            <li>Inventory not updated</li>
            <li>Transaction upload failure</li>
            <li>Offline store behavior mismatch</li>
          </ul>
        `,
        checkpoint: {
          prompt: "Which failures are instantly customer-visible?",
          answer: "Pricing, promotion, and payment authorization failures."
        }
      },
      {
        title: "Chapter 12: AI Opportunities in Transaction Processing",
        content: `
          <p>High-value agents: pricing validator, promotion validator, payment monitor, transaction RCA agent.</p>
          <p>Best first use case is anomaly detection before customer impact.</p>
        `,
        checkpoint: {
          prompt: "First AI use case to launch?",
          answer: "Validation and anomaly detection on pricing/promo/payment paths."
        }
      },
      {
        title: "Chapter 13: Module 2 Knowledge Checklist",
        content: `
          <ul class="clean">
            <li>Explain basket lifecycle</li>
            <li>Explain pricing/promo/tax/payment interaction</li>
            <li>Differentiate return/refund/exchange/void/cancel</li>
            <li>Explain SKU/UOM/hierarchy/catalog/price book</li>
            <li>Identify failure patterns and business impact</li>
          </ul>
          <pre class="flow-block">Deliverables:
domain/transaction-lifecycle.md
domain/retail-glossary.md</pre>
        `,
        checkpoint: {
          prompt: "Module 2 deliverables?",
          answer: "transaction lifecycle document and domain glossary."
        }
      },
      {
        title: "Chapter 14: Recommended Learning-App Structure",
        content: `
          <ol>
            <li>Transaction Lifecycle</li>
            <li>Product Lookup</li>
            <li>Pricing</li>
            <li>Promotions</li>
            <li>Taxes</li>
            <li>Payments</li>
            <li>Receipts</li>
            <li>Returns and Refunds</li>
            <li>Transaction States</li>
            <li>Master Data</li>
            <li>Failure Scenarios</li>
            <li>AI Applications</li>
            <li>Quiz Bank</li>
            <li>Flashcards</li>
            <li>Case Studies</li>
          </ol>
        `,
        checkpoint: {
          prompt: "Why include case studies?",
          answer: "They test applied reasoning, not just memory recall."
        }
      }
    ]
  },
  {
    id: "m3",
    title: "Inventory and Fulfillment Domain Mastery",
    weeks: "Weeks 5-6",
    chapters: [
      {
        title: "Chapter 0: Purpose and Learning Outcomes",
        content: `
          <h3>Purpose</h3>
          <p>Inventory is the lifeblood of retail operations.</p>
          <p>Customers buy products, but retailers manage inventory.</p>
          <p>A retailer can survive a temporary POS issue. It cannot survive prolonged inventory inaccuracy.</p>
          <p>Poor inventory management causes lost sales, stock-outs, excess inventory, shrinkage, customer dissatisfaction, forecasting errors, and financial losses.</p>
          <p>This module teaches how inventory moves, changes, gets reconciled, and supports omnichannel retail operations.</p>
          <h3>Learning Outcomes</h3>
          <ul class="clean">
            <li>Explain inventory lifecycle</li>
            <li>Differentiate inventory states</li>
            <li>Understand replenishment models</li>
            <li>Identify causes of stock drift</li>
            <li>Explain receiving and transfer processes</li>
            <li>Understand cycle counting and inventory accuracy</li>
            <li>Describe omnichannel fulfillment workflows</li>
            <li>Diagnose inventory-related production incidents</li>
            <li>Design AI agents for inventory intelligence</li>
          </ul>
        `,
        checkpoint: {
          prompt: "Why is inventory accuracy existential for retail?",
          answer: "Persistent inaccuracy breaks sales, replenishment, and customer trust at the same time."
        }
      },
      {
        title: "Chapter 1: Inventory Fundamentals",
        content: `
          <h3>What is Inventory?</h3>
          <p>Inventory is all merchandise owned or controlled by the retailer for sale.</p>
          <p>Examples: products in warehouse, products on shelves, products in backroom, products reserved for pickup, and products in transit.</p>

          <h3>Why Inventory Matters</h3>
          <p>Inventory impacts revenue, customer satisfaction, working capital, forecast accuracy, and replenishment efficiency.</p>
          <p><strong>Too little inventory:</strong> lost sales and out-of-stock situations.</p>
          <p><strong>Too much inventory:</strong> storage cost, expiration risk, and markdown losses.</p>

          <h3>Inventory Lifecycle</h3>
          <pre class="flow-block">Supplier
  -> Distribution Center
  -> Warehouse
  -> Store Receiving
  -> Store Shelf
  -> Customer Purchase
  -> Inventory Reduction</pre>
          <p>Alternative paths: transfer, return, damage, shrinkage, online fulfillment.</p>
        `,
        checkpoint: {
          prompt: "Two opposite inventory risk extremes?",
          answer: "Stock-outs from too little stock and carrying/markdown losses from too much stock."
        }
      },
      {
        title: "Chapter 2: Inventory States",
        content: `
          <p>Inventory exists in different business states. Understanding these states is critical.</p>

          <h3>On-Hand Inventory</h3>
          <p>Physical inventory present at location.</p>
          <pre class="flow-block">Store 100
Milk = 50 Units</pre>

          <h3>Available-to-Sell (ATS)</h3>
          <p>Inventory available for purchase.</p>
          <pre class="flow-block">ATS = On-Hand - Reserved
On-Hand = 50
Reserved = 10
ATS = 40</pre>

          <h3>Reserved Inventory</h3>
          <p>Inventory committed to orders. Example: BOPIS TV removed from ATS until pickup.</p>

          <h3>In-Transit Inventory</h3>
          <p>Inventory moving between locations and not yet sellable.</p>

          <h3>Damaged Inventory</h3>
          <p>Broken, expired, water damaged, or packaging damaged; must be separated from sellable stock.</p>

          <h3>Return Inventory</h3>
          <p>Products returned by customers. Outcomes: restock, refurbish, destroy, return-to-vendor.</p>

          <h3>Inventory State Diagram</h3>
          <pre class="flow-block">Received
  -> On-Hand
  -> Available To Sell
  -> Sold

Alternative routes:
On-Hand -> Damaged
On-Hand -> Transfer
On-Hand -> Reserved</pre>
        `,
        checkpoint: {
          prompt: "What does ATS represent?",
          answer: "Sellable units after reservations are deducted."
        }
      },
      {
        title: "Chapter 3: Inventory Movements",
        content: `
          <p>Inventory changes through events. Every inventory adjustment should have a business reason.</p>

          <h3>Receiving</h3>
          <pre class="flow-block">PO: 12345
Expected: 100 Cases
Received: 100 Cases</pre>
          <p>Inventory increases.</p>

          <h3>Sales</h3>
          <pre class="flow-block">Milk: 50
Customer Buys 2
Inventory = 48</pre>
          <p>Inventory decreases.</p>

          <h3>Returns</h3>
          <p>Customer returns item. Inventory usually increases.</p>

          <h3>Transfers</h3>
          <pre class="flow-block">Store 100 -> Store 120
Store 100 = -10
Store 120 = +10</pre>

          <h3>Adjustments</h3>
          <p>Manual changes for damage, theft, audits, and corrections. Should be highly controlled.</p>
        `,
        checkpoint: {
          prompt: "Why reason codes for adjustments?",
          answer: "To preserve auditability and reduce unexplained drift."
        }
      },
      {
        title: "Chapter 4: Receiving Process",
        content: `
          <p>Receiving is where inventory officially enters store ownership.</p>

          <h3>Receiving Workflow</h3>
          <pre class="flow-block">PO Created
  -> Shipment Sent
  -> Store Receives Shipment
  -> Count Verification
  -> Inventory Updated</pre>

          <h3>Receiving Variance</h3>
          <pre class="flow-block">Expected = 100
Received = 95
Shortage = 5</pre>
          <p>Investigation required.</p>

          <h3>Over Receiving</h3>
          <pre class="flow-block">Expected = 100
Received = 110</pre>
          <p>Possible causes: supplier error, count error, data error.</p>

          <h3>Receiving KPIs</h3>
          <p>Receiving Accuracy, Shipment Accuracy, Supplier Compliance, Receiving Time.</p>
        `,
        checkpoint: {
          prompt: "Main receiving variance types?",
          answer: "Short receiving and over receiving against expected quantity."
        }
      },
      {
        title: "Chapter 5: Inventory Replenishment",
        content: `
          <p>Replenishment ensures products remain available.</p>

          <h3>Why Replenishment Matters</h3>
          <p>Without replenishment: empty shelves, lost revenue, customer churn.</p>

          <h3>Reorder Point</h3>
          <pre class="flow-block">Current Stock = 20
Reorder Point = 15
No action yet.

At Stock = 15
Replenishment initiated.</pre>

          <h3>Safety Stock</h3>
          <p>Extra inventory maintained for demand fluctuations, supplier delays, and unexpected sales.</p>

          <h3>Forecast-Based Replenishment</h3>
          <p>Uses historical sales, seasonality, promotions, weather, and local events.</p>

          <h3>Replenishment KPIs</h3>
          <p>Stock-Out Rate, Fill Rate, Inventory Turnover, Forecast Accuracy.</p>
        `,
        checkpoint: {
          prompt: "Purpose of safety stock?",
          answer: "Buffer uncertainty in demand and supply."
        }
      },
      {
        title: "Chapter 6: Stock-Out Prevention",
        content: `
          <h3>What is a Stock-Out?</h3>
          <p>Product unavailable despite demand. Example: customer wants product but shelf is empty.</p>

          <h3>Causes</h3>
          <p>Poor forecasting, delayed replenishment, incorrect inventory data, unexpected demand, supplier issues.</p>

          <h3>Business Impact</h3>
          <p>Revenue loss, customer dissatisfaction, and competitor purchases.</p>

          <h3>Detection Signals</h3>
          <p>ATS = 0, shelf-empty alerts, sales drop anomalies, pickup failures.</p>
        `,
        checkpoint: {
          prompt: "Strongest immediate stock-out signal?",
          answer: "ATS equals zero under active demand."
        }
      },
      {
        title: "Chapter 7: Store Transfers",
        content: `
          <p>Stores often balance inventory through transfers.</p>

          <h3>Example</h3>
          <pre class="flow-block">Store A: 500 Units
Store B: 10 Units
Transfer: 100 Units from Store A to B</pre>

          <h3>Transfer Lifecycle</h3>
          <pre class="flow-block">Transfer Request
  -> Approval
  -> Shipment
  -> In Transit
  -> Receiving
  -> Inventory Updated</pre>

          <h3>Common Problems</h3>
          <p>Missing inventory, wrong quantities, transfer delays, lost shipments.</p>
        `,
        checkpoint: {
          prompt: "Where do transfer failures cluster?",
          answer: "Shipment/receiving handoff and in-transit tracking gaps."
        }
      },
      {
        title: "Chapter 8: Inventory Shrinkage",
        content: `
          <pre class="flow-block">Shrinkage = Expected Inventory - Actual Inventory</pre>
          <h3>Causes</h3>
          <p><strong>Theft:</strong> shoplifting and employee theft.</p>
          <p><strong>Administrative Errors:</strong> wrong counts, wrong receiving, data entry mistakes.</p>
          <p><strong>Vendor Fraud:</strong> missing shipment quantities.</p>
          <p><strong>Damage:</strong> broken or expired products.</p>

          <h3>Shrinkage Impact</h3>
          <p>Reduced profit, inventory inaccuracy, replenishment errors.</p>

          <h3>Shrinkage KPI</h3>
          <p>Shrink %, lost inventory value, high-risk departments.</p>
        `,
        checkpoint: {
          prompt: "Why does shrinkage affect replenishment?",
          answer: "False stock signals trigger wrong reorder behavior."
        }
      },
      {
        title: "Chapter 9: Cycle Counting",
        content: `
          <h3>Why Cycle Counts Matter</h3>
          <p>System inventory eventually diverges from reality. Cycle counts correct errors.</p>

          <h3>Example</h3>
          <pre class="flow-block">System: 50 Bottles
Physical Count: 47 Bottles
Difference: -3</pre>
          <p>Investigation required.</p>

          <h3>Counting Approaches</h3>
          <p>Full physical count (usually annual) and recurring cycle counts (daily/weekly/monthly).</p>

          <h3>Inventory Accuracy Formula</h3>
          <pre class="flow-block">Accurate Items / Counted Items

980 Accurate Items
1000 Counted Items
Accuracy = 98%</pre>
        `,
        checkpoint: {
          prompt: "Why cycle count instead of only annual full count?",
          answer: "Continuous correction with less operational disruption."
        }
      },
      {
        title: "Chapter 10: Omnichannel Fulfillment",
        content: `
          <h3>Buy Online Pickup In Store (BOPIS)</h3>
          <pre class="flow-block">Order Created
  -> Inventory Reserved
  -> Store Picks Product
  -> Customer Pickup
  -> Order Complete</pre>

          <h3>Ship From Store</h3>
          <pre class="flow-block">Online Order
  -> Store Selected
  -> Item Picked
  -> Packed
  -> Shipped</pre>

          <h3>Return To Store</h3>
          <p>Online purchase returned physically, requiring cross-system visibility, order lookup, and refund capability.</p>
        `,
        checkpoint: {
          prompt: "Common BOPIS failure pattern?",
          answer: "System reserves item but store cannot physically locate it."
        }
      },
      {
        title: "Chapter 11: Stock Drift and Reconciliation",
        content: `
          <h3>What is Stock Drift?</h3>
          <p>Inventory differs between systems.</p>
          <pre class="flow-block">POS = 100
IMS = 95
Mismatch exists.</pre>

          <h3>Common Causes</h3>
          <p>Sale upload failure, duplicate messages, transfer errors, improper manual adjustments, offline store sync delay.</p>

          <h3>Reconciliation Process</h3>
          <pre class="flow-block">Compare Systems
  -> Identify Variance
  -> Determine Root Cause
  -> Correct Inventory
  -> Document Adjustment</pre>
        `,
        checkpoint: {
          prompt: "First reconciliation step?",
          answer: "Compare systems and quantify variance."
        }
      },
      {
        title: "Chapter 12: Inventory KPIs",
        content: `
          <p>Core KPIs: inventory accuracy, stock-out rate, fill rate, inventory turnover, and days of supply.</p>
          <pre class="flow-block">Inventory Turnover = COGS / Average Inventory</pre>
          <pre class="flow-block">Days of Supply = Current Stock / Average Daily Sales</pre>
          <p>Higher turnover generally indicates healthier inventory movement.</p>
        `,
        checkpoint: {
          prompt: "KPI for demand satisfaction quality?",
          answer: "Fill rate."
        }
      },
      {
        title: "Chapter 13: Common Inventory Incidents",
        content: `
          <h3>Incident 1: Inventory Not Updated After Sale</h3>
          <p>Symptom: store shows stock but shelf empty. Cause: transaction upload problem.</p>

          <h3>Incident 2: Negative Inventory</h3>
          <pre class="flow-block">Inventory = -5</pre>
          <p>Usually indicates data issues.</p>

          <h3>Incident 3: BOPIS Inventory Mismatch</h3>
          <p>Customer ordered but store cannot find product. Cause: reserved inventory logic failure.</p>

          <h3>Incident 4: Transfer Inventory Lost</h3>
          <p>Shipped but never received. Cause: process failure, logistics error, or sync issue.</p>
        `,
        checkpoint: {
          prompt: "Most customer-visible inventory incident?",
          answer: "Promised item unavailable at pickup despite confirmed order."
        }
      },
      {
        title: "Chapter 14: AI Applications in Inventory Management",
        content: `
          <h3>Inventory Drift Detection Agent</h3>
          <p>Inputs: POS data, IMS data, transfers, cycle counts. Output: probable drift root causes.</p>

          <h3>Replenishment Recommendation Agent</h3>
          <p>Analyzes demand, inventory, seasonality, promotions and suggests reorder quantities.</p>

          <h3>Shrinkage Analysis Agent</h3>
          <p>Detects theft patterns, store outliers, and high-risk categories.</p>

          <h3>Fulfillment Intelligence Agent</h3>
          <p>Monitors BOPIS, ship-from-store, transfer delays and recommends actions.</p>

          <h3>Failure Scenarios Every Specialist Must Know</h3>
          <ul class="clean">
            <li>Sale succeeded but inventory not deducted</li>
            <li>Inventory deducted twice</li>
            <li>Transfer shipped but not received</li>
            <li>Reserved inventory never released</li>
            <li>BOPIS order cannot be fulfilled</li>
            <li>Negative inventory values</li>
            <li>Store shows stock but shelf empty</li>
            <li>Cycle count variance spikes</li>
            <li>Supplier shipment discrepancy</li>
            <li>Damaged inventory sold accidentally</li>
            <li>Inventory synchronization backlog</li>
            <li>Promotion causes unexpected stock depletion</li>
            <li>Omnichannel overselling</li>
            <li>Duplicate adjustment transactions</li>
            <li>Inventory drift across systems</li>
          </ul>
        `,
        checkpoint: {
          prompt: "First AI use case to deploy in inventory domain?",
          answer: "Drift detection with probable root-cause ranking."
        }
      },
      {
        title: "Chapter 15: Module 3 Knowledge Checklist and Deliverables",
        content: `
          <ul class="clean">
            <li>Difference between On-Hand, ATS, Reserved, In-Transit, and Damaged inventory</li>
            <li>Inventory lifecycle from supplier to customer</li>
            <li>How replenishment works</li>
            <li>Causes of stock-outs</li>
            <li>How store transfers work</li>
            <li>How shrinkage impacts profitability</li>
            <li>How cycle counting improves inventory accuracy</li>
            <li>BOPIS, Ship-from-Store, and Return-to-Store workflows</li>
            <li>Top causes of stock drift</li>
            <li>Inventory KPIs and business impact</li>
            <li>Where AI agents can improve inventory operations</li>
          </ul>
          <p><strong>Deliverables</strong></p>
          <p><strong>domain/inventory-event-model.md</strong> should include inventory states, inventory events, state transitions, reconciliation logic, and omnichannel flows.</p>
          <p><strong>domain/stock-drift-root-causes.md</strong> should include drift taxonomy, detection methods, RCA templates, incident examples, and recovery procedures.</p>
          <p>This module is the core knowledge layer before Module 4 (Payments, Compliance, and Risk), where inventory and sales connect to settlement, PCI, reconciliation, and fraud detection.</p>
        `,
        checkpoint: {
          prompt: "Which two artifacts prove Module 3 completion?",
          answer: "inventory-event-model and stock-drift-root-causes documents."
        }
      }
    ]
  },
  {
    id: "m4",
    title: "Payments, Compliance, and Risk",
    weeks: "Weeks 7-8",
    chapters: [
      {
        title: "Chapter 1: Payment Lifecycle",
        content: `
          <p>Authorization -> Capture -> Settlement with exception handling.</p>
          <h3>Failure Modes</h3>
          <ul class="clean">
            <li>Auth success but capture failure</li>
            <li>Capture success but settlement delay</li>
            <li>Duplicate capture due to retry bug</li>
          </ul>
        `,
        checkpoint: {
          prompt: "Settlement delayed: first business concern?",
          answer: "Reconciliation and revenue recognition delay."
        }
      }
    ]
  },
  {
    id: "m5",
    title: "Retail SRE and Support Operations",
    weeks: "Weeks 9-10",
    chapters: [
      {
        title: "Chapter 1: Incident Taxonomy",
        content: `
          <p>Define incident classes by business and technical impact.</p>
          <ul class="clean">
            <li>SEV1: region-wide checkout or payment outage</li>
            <li>SEV2: multi-store degradation with workaround</li>
            <li>SEV3: single-store low-impact issue</li>
          </ul>
        `,
        checkpoint: {
          prompt: "Best severity indicator?",
          answer: "Revenue-at-risk plus blast radius."
        }
      }
    ]
  },
  {
    id: "m6",
    title: "AI Pods Applied to Retail Domain Problems",
    weeks: "Weeks 11-12",
    chapters: [
      {
        title: "Chapter 1: Domain-First AI Pods",
        content: `
          <p>Apply agents only after domain ownership, KPIs, and controls are clearly defined.</p>
          <ul class="clean">
            <li>Classifier agent</li>
            <li>Correlator agent</li>
            <li>RCA draft agent</li>
            <li>Action recommender with risk labels</li>
          </ul>
        `,
        checkpoint: {
          prompt: "First guardrail for autonomous action?",
          answer: "Human approval for high-risk or financial-impact actions."
        }
      }
    ]
  }
];

const chapterProgressKey = "retailDomainChapterProgress";
const chapterNotesKey = "retailDomainChapterNotes";
