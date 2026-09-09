# Architecture & Product Decision Records (ADR)

This document records every critical architectural, technical, and product decision made for **genericMed**. Each record captures the context, decision taken, underlying rationale, alternatives evaluated, and the downstream impact on the codebase and product roadmap.

---

## Table of Decisions

| ID | Title | Date | Status | Area |
| :--- | :--- | :--- | :--- | :--- |
| [ADR-001](#adr-001-normalized-unit-price-comparison-over-pack-price) | Normalized Unit-Price Comparison over Pack-Price | 2026-09-08 | **Approved** | Core Domain / Discovery |
| [ADR-002](#adr-002-hard-clinical-constraints-pre-filtering) | Hard Clinical Constraints Pre-Filtering | 2026-09-08 | **Approved** | Clinical Safety / Search |
| [ADR-003](#adr-003-explainable-multi-factor-ranking-engine-v14) | Explainable Multi-Factor Ranking Engine (Model v1.4) | 2026-09-08 | **Approved** | Discovery / Ranking |
| [ADR-004](#adr-004-mandatory-real-time-cart-revalidation-at-checkout) | Mandatory Real-Time Cart Revalidation at Checkout | 2026-09-08 | **Approved** | Checkout / Inventory |
| [ADR-005](#adr-005-unified-multi-role-spa-architecture) | Unified Multi-Role SPA Architecture | 2026-09-08 | **Approved** | Frontend Architecture |
| [ADR-006](#adr-006-north-star-metric-completed-qualified-medicine-orders-cqmo) | North Star Metric: Completed Qualified Medicine Orders (CQMO) | 2026-09-08 | **Approved** | Product Governance |
| [ADR-007](#adr-007-immutable-section-18-audit-log-with-correlation-ids) | Immutable Section 18 Audit Log with Correlation IDs | 2026-09-08 | **Approved** | Compliance / Audit |
| [ADR-008](#adr-008-in-memory-state-first-with-typed-domain-contracts) | In-Memory State-First with Typed Domain Contracts | 2026-09-08 | **Approved** | Engineering / Prototype |

---

## ADR-001: Normalized Unit-Price Comparison over Pack-Price

- **Date**: 2026-09-08
- **Status**: Approved
- **Deciders**: Product Management, Engineering Lead, UX Lead

### Context / Problem
In the pharmaceutical retail sector, medicine packaging is not standardized. The same chemical molecule (e.g., Paracetamol 500mg) is sold across pharmacies in strips of 10 tablets, 15 tablets, 20 tablets, or bulk containers. Displaying only the total pack price misleads cost-conscious consumers into purchasing packs with a lower sticker price but a significantly higher per-dose cost. Conversely, high-volume packs appear expensive despite offering superior unit savings.

### Decision Taken
Mandate **Normalized Unit Price** (`normalizedUnitPrice = packPrice / packQuantity`, displayed as `₹/tablet` or `₹/ml`) as the primary sorting, comparison, and display metric across all search listings, comparison matrices, and checkout cards. Total pack price (`packPrice`) and packaging quantity (`packQuantity`) must be shown as secondary attributes.

### Reasoning
1. **Apples-to-Apples Evaluation**: Enables fair comparison between disparate pack configurations (e.g., 10-tab blister vs 15-tab strip).
2. **Transparent Consumer Savings**: Accurately calculates percentage savings compared to the branded equivalent reference price (`brandPriceRef`).
3. **Regulatory Alignment**: Follows national consumer protection and fair pricing transparency guidelines for essential medicines.

### Alternatives Considered
1. **Raw Pack Price Sorting**: Rejected because it penalizes economy packs and misleads consumers on actual treatment affordability.
2. **Standard 10-Pack Virtual Multiplier**: Adjusting all prices to hypothetical "10-pack equivalents". Rejected because it confuses customers when the physical pack delivered contains 15 tablets at a different billing amount.
3. **MRP (Maximum Retail Price) Discount Percentage Only**: Rejected because inflated baseline MRPs can manufacture artificial discount percentages.

### Impact on Project
- `ProductListing` domain model must require `normalizedUnitPrice`, `packQuantity`, and `unitLabel`.
- Search index and sorting algorithms rank items by unit price rather than pack price.
- UI cards must prominently feature the unit price badge (e.g., `₹0.70 / tablet`) alongside total price.
- Cart and order totals multiply `packPrice * quantity`, retaining clear unit-level economics.

---

## ADR-002: Hard Clinical Constraints Pre-Filtering

- **Date**: 2026-09-08
- **Status**: Approved
- **Deciders**: Clinical Advisor, Product Owner, Engineering Lead

### Context / Problem
E-commerce search engines typically use fuzzy text search or semantic vector similarity. Applying fuzzy matching directly to pharmaceutical molecules can result in dangerous substitutions—for example, substituting *Metformin Immediate Release* for *Metformin Extended Release (ER)*, or matching *Paracetamol 650mg* when a pediatric patient requires *Paracetamol 250mg*.

### Decision Taken
Implement **strict two-phase query processing**:
1. **Phase 1 (Clinical Gatekeeper)**: Enforce **Hard Clinical Constraints** before any ranking takes place. A listing must strictly match:
   - Canonical Active Salt (`genericSalt`)
   - Dosage Strength (`strength`, e.g., `500mg`)
   - Dosage Formulation (`dosageForm`, e.g., `Extended Release Tablet`)
2. **Phase 2 (Commercial Ranking)**: Only candidate listings passing Phase 1 are submitted to the multi-factor ranking engine.

If zero listings satisfy Phase 1, the system must **NEVER** return a loose or alternative molecule. It must trigger the explicit "No clinical match found" empty state (PRD Section 11.2).

### Reasoning
- **Patient Safety**: In medicine, therapeutic equivalence is non-negotiable. Recommending a non-bioequivalent drug under the guise of "recommended substitute" violates medical ethics and creates severe liability.
- **Zero Hallucination**: AI and algorithmic components are restricted from relaxing clinical parameters for commercial gain.

### Alternatives Considered
- **Soft Constraint Scoring**: Penalizing non-matching strengths in the rank score while still showing them. **Strictly rejected** due to patient overdose or underdose risks.
- **Doctor Override at Checkout**: Permitting cross-strength selection if an upload prescription exists. Deferred to Phase 2 pending tele-consultation infrastructure.

### Impact on Project
- Search services must decouple molecule validation from ranking.
- UI displays distinct badges confirming clinical equivalence (`Exact Salt & Strength Match`).
- Error-state component for unmatched queries guides users to consult their physician.

---

## ADR-003: Explainable Multi-Factor Ranking Engine (Model v1.4)

- **Date**: 2026-09-08
- **Status**: Approved
- **Deciders**: Product Management, Operations Lead, Engineering Lead

### Context / Problem
Relying solely on "lowest price" produces adverse outcomes: low-quality or unverified sellers list ultra-cheap medicines that are frequently out of stock, near expiry, or delayed in fulfillment. Conversely, proprietary opaque ranking algorithms (like Amazon's "Buy Box") erode user trust and invite regulatory scrutiny regarding algorithmic bias.

### Decision Taken
Deploy an **Explainable Multi-Factor Ranking Engine** (Model v1.4) governed by transparent, audited weight distribution:
$$\text{Rank Score} = (0.40 \times \text{Price Score}) + (0.25 \times \text{Trust Score}) + (0.20 \times \text{Stock Freshness Score}) + (0.15 \times \text{Feedback Score})$$

Every `#1 Ranked` listing must render an explicit, human-readable **Explanation Badge** breaking down the factor scores (e.g., *"Ranked #1: Lowest price per tablet (₹0.70/tab, 78% savings), verified stock, and 4.8★ fulfillment SLA"*). The system must never imply clinical superiority—only commercial and fulfillment excellence.

### Reasoning
- Balances affordability with fulfillment reliability and real-time inventory confidence.
- Provides complete transparency to consumers, eliminating suspicions of sponsored bias.
- Complies with PRD Section 9.4 (FR-CORE-02, FR-CORE-06).

### Alternatives Considered
- **100% Price-Only Sorting**: Rejected because it promotes ghost inventory from unresponsive pharmacies.
- **Sponsored Placement / Paid Promotion**: Rejected to protect marketplace integrity and user trust.
- **Deep Learning / Black-Box Recommendation**: Rejected because ranking decisions must be auditable and explicable to regulators and users.

### Impact on Project
- `ProductListing` includes `rankScore` and `rankFactors` metadata.
- Admin portal includes a configuration control to tune ranking weights with mandatory change reason logging.
- Ranking configuration changes are immutably logged in the Section 18 audit ledger.

---

## ADR-004: Mandatory Real-Time Cart Revalidation at Checkout

- **Date**: 2026-09-08
- **Status**: Approved
- **Deciders**: Engineering Lead, Operations Lead, QA Lead

### Context / Problem
Retail pharmacy inventory is dynamic and decentralized. A customer might add a generic medicine to their cart and finalize the order minutes or hours later. If partner pharmacy stock is depleted or the partner updates their pricing asynchronously, executing the payment results in payment disputes, forced cancellations, and negative customer sentiment.

### Decision Taken
Implement **Mandatory Checkout-Time Revalidation (FR-CART-03)**:
Before any payment intent is created or gateway session opened:
1. Re-query the live partner inventory for available quantity.
2. Verify that unit price and pack price have not shifted.
3. Validate that partner operational status is active and SLA compliant.

If any discrepancy occurs, the transaction is intercepted:
- **Price Change**: Prompt customer with the exact price difference for explicit re-confirmation.
- **Stock Depletion**: Offer an immediate one-click substitution to the next-ranked approved partner with equivalent stock, or auto-adjust pack count.

### Reasoning
- Eliminates post-payment cancellation overhead and expensive refund gateway charges.
- Ensures order integrity before funds are deducted from the customer's account.

### Alternatives Considered
- **Inventory Locking on Add-to-Cart**: Holding stock as soon as an item is placed in a cart. Rejected because cart abandonment would lock up critical medicines from genuine buyers.
- **Post-Payment Refund Policy**: Letting the transaction proceed and refunding if stock fails. Rejected due to poor customer experience and merchant refund fees.

### Impact on Project
- `CartItem` state machine includes revalidation statuses.
- Automated creation of `OperationalException` (Type: `stock_mismatch` or `payment_mismatch`) when anomalies occur.
- Checkout UI displays a transient "Verifying live stock & price..." security barrier before launching payment.

---

## ADR-005: Unified Multi-Role SPA Architecture

- **Date**: 2026-09-08
- **Status**: Approved
- **Deciders**: Full Stack Architect, Frontend Lead

### Context / Problem
genericMed encompasses three tightly coupled operational personas:
1. **Customer**: Searches, compares unit costs, builds carts, tracks delivery.
2. **Pharmacy Partner**: Manages inventory stock counts, updates prices, processes fulfillment queue.
3. **Operations & Admin**: Resolves inventory exceptions, oversees CQMO metrics, audits compliance logs.

Building three separate web apps during rapid prototyping introduces cross-repository drift, duplicate type contracts, and complex deployment coordination.

### Decision Taken
Build a **Unified Multi-Role Single Page Application** in React 19 + TypeScript + Tailwind CSS v4. The application features:
- A centralized top-level role switcher (`Customer`, `Pharmacy Partner`, `Platform Admin`).
- Encapsulated portal modules (`CustomerMarketplace`, `PartnerPortal`, `AdminOperationsPortal`, `OrdersTracker`).
- Shared domain models (`types.ts`) and synchronized in-memory state simulating end-to-end marketplace dynamics.

### Reasoning
- Facilitates rapid stakeholder demonstrations of the complete transactional lifecycle (e.g., placing a customer order, accepting it in the partner portal, and viewing the audit trail in admin ops).
- Maintains single source of truth for types, PRD requirements, and architecture specifications.
- Enables seamless testing of edge cases across roles without managing multiple server instances.

### Alternatives Considered
- **Three Separate Micro-Frontends**: High operational overhead and duplicate mock layers during current development phase.
- **Server-Side Rendered Multi-Tenant App**: Unnecessary infrastructure complexity before backend database contracts are finalized.

### Impact on Project
- All roles share canonical data in `src/data/genericMedData.ts`.
- Navigation bar provides instant role switching with visual context preservation.
- Prepares cleanly for micro-frontend or subdomain separation when migrating to production API microservices.

---

## ADR-006: North Star Metric: Completed Qualified Medicine Orders (CQMO)

- **Date**: 2026-09-08
- **Status**: Approved
- **Deciders**: Product Owner, Founder / Business Lead, Operations Lead

### Context / Problem
Common e-commerce North Star metrics such as Gross Merchandise Value (GMV) or Monthly Active Users (MAU) fail to reflect genericMed's mission. A high GMV can be achieved by selling high-cost branded medicines—directly opposing the affordability objective. High MAU with low fulfillment rates indicates frustrated users.

### Decision Taken
Establish **Completed Qualified Medicine Orders (CQMO)** as the primary North Star Metric (PRD Section 5.1).
A transaction only qualifies as a CQMO when:
1. **Clinical Validity**: Order contains certified generic medicines matching the user's requirement.
2. **Affordability**: Achieves demonstrated cost savings against the branded benchmark.
3. **Fulfillment**: Successfully accepted, dispensed, and delivered within the partner SLA.
4. **Clean Audit**: Zero unhandled stock mismatches or unresolved payment disputes.

### Reasoning
- Aligns product features with patient health outcomes and financial savings.
- Disincentivizes partners from listing products they cannot fulfill.
- Establishes a singular metric that every team (Product, Engineering, Operations, Partnerships) can optimize.

### Alternatives Considered
- **Total Registered Customers**: Vanity metric that ignores repeat retention and fulfillment.
- **Gross Order Value (GOV)**: Incentivizes higher drug prices, contrary to genericMed's core mission.

### Impact on Project
- Admin Operations Portal prominently tracks CQMO in real time.
- Orders state machine only transitions an order to "Completed" when all qualification criteria are satisfied.

---

## ADR-007: Immutable Section 18 Audit Log with Correlation IDs

- **Date**: 2026-09-08
- **Status**: Approved
- **Deciders**: Security Architect, Compliance Lead, Backend Lead

### Context / Problem
Pharmaceutical supply chains and financial transactions are subject to strict regulatory oversight. Any mutation to catalog pricing, ranking algorithm weights, partner onboarding statuses, or payment transactions must be non-repudiable, tamper-evident, and auditable.

### Decision Taken
Implement an **Immutable Append-Only Audit Trail** adhering to PRD Section 18:
Every mutating event records:
- `actorId` and `actorRole` (Customer, Partner Staff, Admin)
- UTC `timestamp`
- `actionType` (e.g., `INVENTORY_STOCK_UPDATE`, `RANKING_WEIGHT_CONFIG`, `PAYMENT_RECONCILED`)
- `entityType` and `entityId`
- `previousState` and `newState` (state delta)
- `reason` (mandatory rationale for sensitive operations)
- `correlationId` (distributed tracing across services)
- `sourceContext` (originating portal or integration)

### Reasoning
- Ensures complete regulatory readiness for drugs and cosmetics compliance audits.
- Simplifies operational debugging by correlating payment callbacks with order fulfillment events.
- Prevents rogue administrative tampering with algorithmic ranking weights.

### Alternatives Considered
- **Ephemeral App Logging (Winston / Pino to stdout only)**: Insufficient for audit compliance; difficult to inspect in-app by operations teams.
- **Database Triggers on Updated-At Columns**: Does not preserve historical deltas or user rationale.

### Impact on Project
- `AuditRecord` interface defined in `src/types.ts`.
- `AdminOperationsPortal` includes interactive audit log viewer with filtering by role and entity.
- All state updates in the prototype trigger corresponding audit records.

---

## ADR-008: In-Memory State-First with Typed Domain Contracts

- **Date**: 2026-09-08
- **Status**: Approved
- **Deciders**: Full Stack Architect, Engineering Lead

### Context / Problem
The project requires rapid functional validation of the PRD requirements across customer discovery, partner operations, and admin governance while the target geography and cloud backend infrastructure are being finalized.

### Decision Taken
Implement a **Typed In-Memory State Architecture**:
- Define all PRD domain models in `src/types.ts`.
- Initialize realistic, comprehensive seed datasets in `src/data/genericMedData.ts`.
- Expose state management handlers in `App.tsx` that simulate backend persistence, validation, and error scenarios.
- Structure all data access using deterministic interfaces ready for drop-in HTTP/gRPC service replacement.

### Reasoning
- Zero external database setup required to run, test, and demo the full marketplace.
- Guarantees 100% type safety across components.
- Enables instant UI/UX iteration and usability testing with real-world pharmaceutical scenarios.

### Alternatives Considered
- **Mock Service Worker (MSW)**: Adds additional network interception complexity without improving in-memory state speed.
- **Direct SQLite / LocalStorage Bindings**: Limits cross-session testing and complicates hot reloading in development.

### Impact on Project
- Fast development cycle (`npm run dev`).
- Clean separation between presentation components and domain contracts.
- Seamless transition path to REST/GraphQL API integration.

---

## ADR-009: Chronic Subscription Auto-Refill Scheduling & Predictive Pre-Authorization

- **Date**: 2026-09-09
- **Status**: Approved
- **Deciders**: Product Lead, Pharmacy Operations Lead, System Architect

### Context / Problem
Chronic maintenance patients (Persona B: Diabetes, Hypertension, Dyslipidemia) require uninterrupted, predictable monthly supply of generic therapies. Requiring manual monthly search and checkout induces friction, prescription lapses, and adherence failure.

### Decision Taken
Implement an automated **Chronic Care Auto-Refill Engine**:
- Support 30, 60, and 90-day recurring delivery intervals with an extra 5% subscriber cost benefit.
- Enforce pre-authorized payment settlement tokens (UPI AutoPay / Card Vault).
- Automatically trigger 24-hour pre-dispatch stock count and price revalidation against fulfilling partner pharmacies.
- Provide instant pause, interval adjustment, and on-demand "Instant Refill Now" triggers with automated Section 18 audit logging.

### Reasoning
- Maximizes North Star Completed Qualified Medicine Orders (CQMO) through predictable repeat transactions.
- Reduces patient out-of-pocket healthcare expenses through recurring volume economies.
- Prevents clinical stockout emergencies for life-critical maintenance medications.

### Alternatives Considered
- **Push Notification Reminders Only**: Relies on patient manual re-order; high drop-off rates and missed refills.
- **Fixed 30-Day Only Schedule**: Incompatible with 60-day or 90-day chronic physician prescriptions.

### Impact on Project
- Introduced `ChronicSubscription` model in `src/types.ts`.
- Created `SubscriptionManagerModal.tsx` for complete patient lifecycle control.
- Integrated "Subscribe & Save" enrollment directly in `ProductDetailModal.tsx` and `CoreAppLayout.tsx`.

---

## ADR-010: Patient Review Integrity & Regulatory Medical Claim Moderation

- **Date**: 2026-09-09
- **Status**: Approved
- **Deciders**: Chief Compliance Officer, Product Manager, Governance Lead

### Context / Problem
Patient reviews are vital for demystifying generic drug efficacy and driving adoption, but pharmaceutical regulations (Drugs & Magic Remedies Act, Section 9.2 PRD) strictly prohibit unsubstantiated medical claims, off-label endorsements, or unmonitored dosage modifications.

### Decision Taken
Implement a **Verified Purchase Gated & Moderated Clinical Review System**:
- Only authenticated customers with completed, verified delivery records can submit reviews.
- Structured review intake capturing specific condition treated, clinical efficacy tags, and mandatory medical disclaimers.
- Reviews enter an **Admin Governance Review Moderation Queue** where operations and pharmacists approve, flag, or hide submissions before public display.
- Approved reviews feed directly into the $S_{\text{feedback}}$ factor of the Model v1.4 Explainable Ranking Engine.

### Reasoning
- Eliminates counterfeit and competitor review spam.
- Maintains 100% compliance with statutory healthcare advertising restrictions.
- Elevates consumer confidence through verified bio-equivalent peer experiences.

### Alternatives Considered
- **Unmoderated Public Reviews**: High legal and regulatory liability under pharmaceutical advertising laws.
- **No Review Capability**: Impedes marketplace trust; patients default to expensive branded benchmarks due to unfamiliarity with generic manufacturer names.

### Impact on Project
- Introduced `ProductReview` model in `src/types.ts` and `SAMPLE_REVIEWS` seed data.
- Built clinical review intake and display in `ProductDetailModal.tsx`.
- Integrated Review Moderation tab in `AdminOperationsPortal.tsx` with Section 18 audit commits.

---

## ADR-011: Geospatial Store Allocation & Cold-Chain Telemetry Dispatch

- **Date**: 2026-09-09
- **Status**: Approved
- **Deciders**: Last-Mile Logistics Lead, Pharmacy Operations, Technical Architect

### Context / Problem
Certain generic medicines (Insulin, Vaccines, Eye Drops) require strict cold-chain maintenance (2°C - 8°C) during last-mile delivery. Additionally, patients requiring acute symptom relief demand transparent, sub-30-minute delivery ETAs from their nearest licensed chemist hub.

### Decision Taken
Deploy an integrated **Geospatial Dynamic Dispatch & Cold-Chain Telemetry Architecture**:
- Partner pharmacies are mapped to geographic coordinates with defined delivery service radiuses.
- Deliveries feature real-time vector route simulation showing courier transit, speedometer, and dynamic ETA countdowns.
- Real-time IoT temperature sensor telemetry monitor displaying live package temperature (2°C - 8°C cold-chain or 15°C - 25°C ambient) with Good Distribution Practice (GDP) compliance badges.
- 4-digit contactless security delivery PIN required for order handover verification.

### Reasoning
- Prevents drug degradation and guarantees therapeutic potency upon patient receipt.
- Provides acute value-seeking patients (Persona A) with verifiable delivery timeframes.
- Prevents misdelivery or unauthorized package interception via cryptographic handover PINs.

### Alternatives Considered
- **Coarse Static Order Statuses ("In Transit")**: Fails to provide patient reassurance and lacks cold-chain auditability.
- **Third-Party Logistics Iframe Embeds**: Lacks direct pharmaceutical telemetry sensor integration.

### Impact on Project
- Added `PharmacyGeoLocation` and `DispatchRouteEstimate` in `src/types.ts`.
- Created `LiveRouteTrackerModal.tsx` accessible directly from `OrdersTracker.tsx`.
- Defined partner coordinate zones in `src/data/genericMedData.ts`.

---

## ADR-012: Batch-Level Expiry Traceability & Pharmacovigilance Quarantine

- **Date**: 2026-09-09
- **Status**: Approved
- **Deciders**: Chief Pharmacist, Quality Assurance Lead, Partner Operations

### Context / Problem
Under Section 65 of the Drugs and Cosmetics Act, dispensing medicines nearing expiration (<6 months) without patient consent or storing degraded inventory is a severe regulatory violation that damages pharmacy trust and patient safety.

### Decision Taken
Implement an automated **Partner Batch Expiry Radar & Quarantine System**:
- Pharmacy store inventory tracks individual manufacturing batch numbers, QC certificate numbers, and precise expiration dates.
- Automatic status flags: `Near Expiry (<6m)` (<180 days) and `Critical (<3m)` (<90 days).
- One-click **Administrative Quarantine**: Partner staff can quarantine compromised or expired batches, immediately revoking sellable inventory and triggering Section 18 audit notifications.

### Reasoning
- Eliminates the risk of dispensing stale or expired medications to marketplace patients.
- Protects pharmacy partner compliance standing during statutory health authority inspections.
- Provides complete supply chain traceability from manufacturer batch to dispensed patient order.

### Alternatives Considered
- **Passive Expiry Filtering**: Automatically hiding items without notifying the chemist; results in physical shelf stock confusion.
- **Aggregate SKU-Level Expiry**: Fails when a single SKU has multiple batches with disparate expiration dates.

### Impact on Project
- Added `MedicineBatchRecord` in `src/types.ts` and `SAMPLE_BATCH_RECORDS` in `src/data/genericMedData.ts`.
- Built "Batch Expiry & Cold Chain Radar" tab in `PartnerPortal.tsx`.
- Integrated quarantine state change commits directly to the Section 18 Audit Log.

