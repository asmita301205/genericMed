import { ArchitectureNode, ArchitectureConnection } from '../types';

export const ARCHITECTURE_LAYERS = [
  { id: 'client', name: '1. Presentation & Portals Tier', badge: 'Customer / Partner / Admin', color: 'border-blue-500 bg-blue-50/50 text-blue-700' },
  { id: 'gateway', name: '2. Edge Ingress & Security Gateway', badge: 'Port 3000 • Ingress & RBAC', color: 'border-indigo-500 bg-indigo-50/50 text-indigo-700' },
  { id: 'services', name: '3. Application & Domain Services', badge: 'Eligibility • Ranking • Orders', color: 'border-emerald-500 bg-emerald-50/50 text-emerald-700' },
  { id: 'storage', name: '4. Canonical Data & Immutable Audit', badge: 'Catalog • Inventory • Ledger', color: 'border-amber-500 bg-amber-50/50 text-amber-700' },
  { id: 'external', name: '5. External Service Integrations', badge: 'Payment • SMS • Logistics', color: 'border-purple-500 bg-purple-50/50 text-purple-700' },
];

export const ARCHITECTURE_NODES: ArchitectureNode[] = [
  {
    id: 'arch-client-portals',
    layer: 'client',
    title: 'Multi-Role Frontend Web Portals',
    subtitle: 'Customer Marketplace • Partner Store Portal • Admin Ops',
    description: 'Responsive, accessible single-page web applications catering to Persona A/B (Value-seeking/Repeat Customer), Persona C (Pharmacy Operator), and Persona E (Operations/Admin).',
    tech: ['React 19', 'TypeScript', 'Tailwind CSS v4', 'Lucide Icons', 'Motion/React'],
    responsibilities: [
      'Render customer discovery funnel: Requirement capture, normalized comparison, checkout (FR-SEARCH-01, FR-CORE-04)',
      'Provide Pharmacy Partner store dashboard for catalog stock and order queue (FR-PART-01 to 04)',
      'Expose Admin & Operations console for exception resolution and audit log inspection (FR-ADM-01 to 05)',
      'Enforce responsive viewports (Desktop, Tablet, Mobile) with zero horizontal clipping'
    ],
    protocol: 'Virtual DOM / Client-side State Machine'
  },
  {
    id: 'arch-edge-ingress',
    layer: 'gateway',
    title: 'Ingress Controller & Security Gatekeeper',
    subtitle: 'Port 3000 Ingress • RBAC • Abuse Controls',
    description: 'Reverse proxy and API gateway terminating external traffic, enforcing rate limiting on authentication attempts (FR-AUTH-04), and managing Content Security Policies.',
    tech: ['Nginx Reverse Proxy', 'CSP Headers', 'Rate Limiting Middleware', 'Session Gatekeeper'],
    responsibilities: [
      'Bind strictly to container Port 3000 for all incoming client traffic',
      'Enforce Role-Based Access Control (RBAC) across Customer, Partner Staff, and Admin roles (Section 15)',
      'Apply rate-limiting and abuse throttling to repeated auth and search requests (FR-AUTH-04)',
      'Enforce referrer-policy (no-referrer) for external asset rendering'
    ],
    protocol: 'HTTPS / WSS / HTTP 1.1'
  },
  {
    id: 'arch-eligibility-ranking',
    layer: 'services',
    title: 'Eligibility Engine & Explainable Ranking Service',
    subtitle: 'Hard Constraints Validator • Multi-Factor Scoring',
    description: 'Core domain service executing the genericMed differentiator: validates mandatory clinical constraints, normalizes prices per unit, and scores eligible listings with transparent explanations (FR-CORE-01/02).',
    tech: ['Requirement Parser', 'Salt Matcher', 'Unit Normalizer Engine', 'Scoring Model v1.4'],
    responsibilities: [
      'Filter out products violating mandatory constraints (active salt, strength, dosage form) (FR-SEARCH-03)',
      'Calculate normalized price per single unit/tablet (FR-CORE-03) for apples-to-apples comparison',
      'Compute multi-factor rank score: Price (40%), Partner Trust (25%), Stock Freshness (20%), Reviews (15%)',
      'Surface transparent "Why this ranks #1" explanation tags without implying clinical superiority'
    ],
    protocol: 'gRPC / Internal JSON RPC'
  },
  {
    id: 'arch-revalidation-order',
    layer: 'services',
    title: 'Cart Revalidation & Order State Machine',
    subtitle: 'Checkout-Time Check (FR-CART-03) • Idempotent Payments',
    description: 'Transaction and fulfillment management service that revalidates live stock/price before payment initiation, prevents duplicate cart orders, and maintains order state transitions (FR-ORDER-02).',
    tech: ['State Machine Engine', 'Idempotency Keys', 'Stock Locking Service', 'Reconciliation Worker'],
    responsibilities: [
      'Perform mandatory checkout-time stock and price revalidation (FR-CART-03) to block stale listings',
      'Trigger Stock Mismatch and Price Change recovery flows if partner inventory changes asynchronously',
      'Reconcile payment status with external gateway before transitioning order to Paid (FR-PAY-03)',
      'Drive order lifecycle: Created → Paid/Confirmed → Accepted → Dispatched → Completed'
    ],
    protocol: 'Event-driven State Machine'
  },
  {
    id: 'arch-canonical-catalog-db',
    layer: 'storage',
    title: 'Canonical Medicine Catalog & Partner Inventory DB',
    subtitle: 'Verified Salts • Real-Time Stock • Freshness SLAs',
    description: 'Persistent data store housing canonical medicine definitions (active salts, strengths, brand equivalents) and partner-specific sellable listings with freshness tracking (Section 14).',
    tech: ['Relational Ledger', 'Catalog Versioning', 'Freshness Timestamps', 'Read-Replica Cache'],
    responsibilities: [
      'Maintain authoritative canonical product records (active ingredients, therapeutic class, standard forms)',
      'Store partner inventory counts, pack sizes, and batch freshness timestamps (FR-PART-02/05)',
      'Flag stale catalog data when pricing has not been confirmed within SLA limits',
      'Provide low-latency search indices for fast autocomplete (<2s P95 per NFR-PERF-01)'
    ],
    protocol: 'SQL / Indexed Document Store'
  },
  {
    id: 'arch-audit-ledger',
    layer: 'storage',
    title: 'Immutable Audit Log & Operational Exception Store',
    subtitle: 'Section 18 Audit Schema • Exception Queues (FR-ADM-04)',
    description: 'Append-only audit trail capturing all sensitive administrative, partner, and payment reconciliation actions, alongside operational exception records for mismatch resolution.',
    tech: ['Append-Only Ledger', 'Correlation ID Tracer', 'Exception Queue Manager'],
    responsibilities: [
      'Record actor ID, timestamp, action type, entity, previous state, new state, and reason (Section 18.2)',
      'Track partner onboarding approvals, suspensions, ranking weight changes, and refund authorizations',
      'Feed admin exception queues for payment mismatch, stock mismatch, and fulfillment delays',
      'Ensure non-repudiation and compliance traceability across all commercial actions'
    ],
    protocol: 'Structured JSON Logging / Audit Pipeline'
  },
  {
    id: 'arch-external-integrations',
    layer: 'external',
    title: 'External Payment Gateway, SMS & Logistics Integrations',
    subtitle: 'Section 16 Capability Integrations • Idempotent Webhooks',
    description: 'Secure adapters connecting genericMed to external financial networks, communication providers, and delivery partner dispatch systems.',
    tech: ['Payment Webhook Handlers', 'SMS/Email Gateway Client', 'Logistics Courier API', 'Catalog Ingestion'],
    responsibilities: [
      'Process customer payments securely without storing raw credentials on application servers (FR-PAY-06)',
      'Verify digital payment signatures and handle provider timeout/reconciliation (FR-PAY-04)',
      'Dispatch transactional notifications for order confirmed, dispatched, and delivered events (FR-NOTIF-01)',
      'Ingest partner catalog inventory updates and sync delivery tracking coordinates'
    ],
    protocol: 'TLS 1.3 / Signed Webhooks / REST APIs'
  }
];

export const ARCHITECTURE_CONNECTIONS: ArchitectureConnection[] = [
  { from: 'arch-client-portals', to: 'arch-edge-ingress', label: 'Port 3000 Ingress (HTTPS)', type: 'sync' },
  { from: 'arch-edge-ingress', to: 'arch-eligibility-ranking', label: 'Requirement Matching & Ranking', type: 'sync' },
  { from: 'arch-eligibility-ranking', to: 'arch-revalidation-order', label: 'Cart Revalidation & Checkout', type: 'sync' },
  { from: 'arch-revalidation-order', to: 'arch-canonical-catalog-db', label: 'Stock Lock & Order Ledger', type: 'sync' },
  { from: 'arch-revalidation-order', to: 'arch-audit-ledger', label: 'Audit Events & Exceptions', type: 'async' },
  { from: 'arch-revalidation-order', to: 'arch-external-integrations', label: 'Payment & Notification Triggers', type: 'async' }
];
