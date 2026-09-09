# Changelog

All notable changes to the **genericMed** project are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [Unreleased]

---

## [2.0.0-phase2] - 2026-09-09

### Added
- **Chronic Care Auto-Refills (Persona B)**:
  - Added `SubscriptionManagerModal` component for managing 30, 60, and 90-day recurring delivery intervals with 5% extra recurring discounts.
  - Implemented 1-click pause, resume, interval adjustment, and "Instant Refill Now" dispatch triggers with pre-authorized UPI AutoPay tokens.
  - Integrated "Subscribe & Save" enrollment option in `ProductDetailModal` and quick access from the global header.
- **Verified Patient Reviews & Regulatory Claim Moderation**:
  - Added review intake and star-rating breakdown in `ProductDetailModal` with verified purchase gating and condition-specific badges.
  - Built an Admin Review Moderation Queue in `AdminOperationsPortal` to review submissions and prevent unsubstantiated therapeutic claims per the Drugs & Magic Remedies Act.
  - Integrated review scores into the Model v1.4 Explainable Multi-Factor Ranking Engine ($S_{\text{feedback}}$).
- **Geospatial Dynamic Dispatch & Cold-Chain Telemetry**:
  - Added `LiveRouteTrackerModal` with interactive vector polyline map simulation, dynamic ETA countdown, and real-time vehicle speedometer.
  - Integrated IoT digital thermometer telemetry monitor (2°C–8°C for cold-chain medications like insulin, 15°C–25°C ambient) with GDP compliance status.
  - Enforced 4-digit handover PIN for secure contactless delivery.
- **Partner Batch Expiry Radar & Pharmacovigilance Quarantine**:
  - Added "Batch Expiry & Cold Chain Radar" tab in `PartnerPortal` tracking batch numbers, manufacturing/expiry dates, and expiration countdowns (<180d near-expiry warning, <90d critical).
  - One-click administrative quarantine workflow that immediately revokes sellable inventory and commits to the Section 18 Audit Log.
- **Customer Support & Dispute Desk**:
  - Added `SupportTicketModal` for reporting delivery delays, damaged packaging, dosage queries, and refund requests with live pharmacist chat.
  - Added Customer Support Desk tab in `AdminOperationsPortal` to review cases, issue partial/full refunds, and log resolution rationale to the audit trail.
- **Partner Growth Analytics & SLA Matrix**:
  - Added performance analytics tab in `PartnerPortal` covering Gross Merchandise Value (GMV), 98.6% on-time dispatch SLA adherence, and chronic patient retention rates.

### Changed
- Promoted application state to Phase 2, binding subscriptions, reviews, batch inventory, and support tickets into the core React application shell.
- Updated Section 18 Audit Log to record subscription refills, dispute ticket resolutions, review moderation actions, and batch quarantine events.

---

## [1.0.0-phase1] - 2026-09-09

### Added
- **Authentication & User Sessions (PRD FR-AUTH-01 to 04)**:
  - Added `AuthModal` component supporting mobile phone & email sign-in with 6-digit OTP verification simulation.
  - Multi-role profile switcher (`Customer`, `Pharmacy Partner Chemist`, `Platform Admin`).
  - Saved delivery address book with default address management.
- **Prescription AI OCR & Validation (PRD FR-SEARCH-05, FR-CART-02)**:
  - Added `PrescriptionScannerModal` integrating Google GenAI Vision (`@google/genai`) to parse prescription documents into clinical entities.
  - Automatic extraction of Doctor Medical Council Reg Number, Patient Name, Issue Date, and Prescribed Active Salts.
  - Clinical bio-equivalence validator comparing prescribed molecules with generic medicines in the cart.
  - Pre-loaded certified sample prescriptions for 1-click clinical testing.
- **Interactive Multi-Method Payment Gateway (PRD FR-PAY-01 to 06)**:
  - Added `PaymentGatewayModal` supporting UPI (dynamic QR code, GPay, PhonePe, Paytm, custom VPA), Credit/Debit Card (with live formatters and 3D Secure simulation), NetBanking, and Cash on Delivery.
  - Automatic cryptographic idempotency key generation (`idemp-pay-xxxx`) ensuring zero duplicate order creation.
  - Testing gate toggle: "Simulate Gateway Failure" to test PRD Section 11.3 payment error recovery flows.
- **Clinical Monograph Product Detail View (PRD FR-DISC-01 to 05)**:
  - Added `ProductDetailModal` rendering deep pharmacological data: active salt bio-equivalence, manufacturer GMP facility, drug schedule (Schedule H vs OTC), storage guidelines, precautions, side effects, and contraindications.
  - Real-time stock directory of licensed partner pharmacies with distance and SLA freshness.
  - Monthly chronic savings projection calculator.
- **Simulated Transactional SMS & WhatsApp Notifications (PRD FR-NOTIF-01)**:
  - Added `NotificationToastContainer` rendering live SMS and WhatsApp popups for order verification, delivery PIN generation, and temperature-controlled courier dispatch.

### Changed
- Replaced checkout drawer payment placeholder with interactive multi-provider payment gateway.
- Enforced Schedule H prescription validation gate in cart checkout prior to payment processing.
- Enhanced application header strip with User Profile trigger badge and role indicator.

### Fixed
- Prevented checkout payment submission when Schedule H prescription-required items lack verification.
- Ensured delivery handover PIN is generated and included in customer tracking timeline and SMS toast alerts.

---

## [0.3.0] - 2026-09-08

### Added
- **Multi-Role Application Portals**:
  - `AdminOperationsPortal`: Real-time CQMO (Completed Qualified Medicine Orders) North Star counter, operational exception management queue, and dynamic ranking weight controls.
  - `PartnerPortal`: Pharmacy partner inventory manager with real-time stock count editing, pack price configuration, and 24-hour freshness SLA indicator.
  - `OrdersTracker`: Customer order lifecycle dashboard with real-time 6-stage milestone tracker (Created → Paid → Dispensed → Delivered) and 1-click chronic reordering.
- **Section 18 Audit Log System**:
  - Implemented immutable append-only audit trail logging actor ID, actor role, timestamp, action type, entity delta, reason, and correlation ID.
- **Operational Exception Queue**:
  - Structured anomaly tracking for `stock_mismatch`, `price_change`, and `stale_catalog` events with resolution options.
- **5-Tier Architecture Diagram**:
  - Interactive visualizer modeling Presentation Tier, Edge Ingress Gateway, Domain Services, Storage Ledger, and External Integrations.
- **Interactive PRD Specification Viewer**:
  - Full-text interactive navigator covering all 22 sections of the official genericMed Product Requirements Document.
- **Hotlink Studio**:
  - Asset verification and photography management interface for high-resolution medicine packaging and pharmacy imagery.

### Changed
- Refactored `App.tsx` navigation shell into `CoreAppLayout` supporting seamless role-switching (`Customer`, `Pharmacy Partner`, `Admin & Operations`) and tab switching.
- Enhanced `CustomerMarketplace` with explainable ranking badges ("Why this ranks #1") breaking down score factors.
- Upgraded multi-factor ranking algorithm to Model v1.4 (Price 40%, Trust 25%, Stock Freshness 20%, Feedback 15%).

### Fixed
- Fixed cart state mutation bug by implementing strictly immutable state updates with TypeScript narrowing.
- Resolved table layout overflow on smaller viewports across comparison cards.

---

## [0.2.0] - 2026-09-08

### Added
- **Canonical Medicine Catalog**:
  - Seed dataset containing active salts (Paracetamol 500mg/650mg, Metformin ER 500mg, Atorvastatin 20mg, Cetirizine 10mg, Amoxicillin 625mg) with branded reference pricing.
- **Normalized Unit Price Comparison Engine**:
  - Real-time calculation of ₹ per single tablet or ml (`packPrice / packQuantity`).
  - Percentage savings calculator comparing generic options against branded equivalents (e.g., Crocin, Dolo, Lipitor).
- **Hard Clinical Constraints Gatekeeper**:
  - Pre-search filter enforcing strict matching of active molecule, dosage strength, and formulation before ranking.
- **Side-by-Side Comparison Matrix**:
  - Interactive modal comparing up to 3 candidate generic listings across unit price, savings, partner rating, distance, and stock depth.
- **Pre-Checkout Live Revalidation (FR-CART-03)**:
  - Real-time stock count and price verification preventing stale orders and checkout errors.

### Changed
- Rebranded application from generic template to **genericMed** marketplace.
- Updated `metadata.json` to reflect requirement-aware generic medicine discovery purpose.
- Redesigned search interface with prominent generic salt suggestions and common brand equivalent shortcuts.

### Fixed
- Prevented zero-quantity cart additions with input guard validations.
- Corrected unit price rounding precision to two decimal places for currency consistency.

---

## [0.1.0] - 2026-09-08

### Added
- Initial project scaffolding using **Vite 6.2** and **React 19**.
- Configured **Tailwind CSS v4** with modern color tokens and responsive grid utilities.
- Integrated **Lucide React** icon suite for medical and operational UI symbols.
- Integrated **Motion** for smooth layout transitions and micro-animations.
- Configured TypeScript with strict compiler options in `tsconfig.json`.
- Established container dev scripts on port `3000` in `package.json`.
