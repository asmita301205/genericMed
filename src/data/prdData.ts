import { PrdSection } from '../types';

export const PRD_METADATA = {
  productName: 'genericMed',
  prdTitle: 'genericMed Product Requirements Document',
  subtitle: 'Requirement-aware generic medicine discovery, comparison and purchase marketplace',
  version: '0.1',
  status: 'Draft / Stakeholder Review',
  documentOwner: 'Product Management',
  date: '8 September 2026',
  audience: 'Product, Engineering, UX/UI, QA, Operations, Business/Founders, Partner Teams',
  productType: 'Web application / marketplace (working assumption)',
  targetGeography: 'TBD',
  businessModel: 'TBD',
  importantNotice: 'Launch geography, commercial model, operating model, pharmacy/partner eligibility, and applicable regulatory/compliance requirements remain unresolved. They are explicitly marked as assumptions or open questions rather than treated as confirmed decisions.'
};

export const PRD_SECTIONS: PrdSection[] = [
  {
    id: 'sec-1',
    number: '1',
    title: 'Document Control',
    summary: 'Administrative metadata, revision tracking, stakeholder responsibilities, and priority conventions.',
    content: [
      {
        subtitle: '1.1 Metadata Overview',
        table: {
          headers: ['Field', 'Value'],
          rows: [
            ['Product Name', 'genericMed'],
            ['PRD Title', 'genericMed Product Requirements Document'],
            ['Version', '0.1'],
            ['Status', 'Draft / Stakeholder Review'],
            ['Document Owner', 'Product Management'],
            ['Date', '8 September 2026'],
            ['Audience', 'Product, Engineering, UX/UI, QA, Operations, Business/Founders, Partner Teams'],
            ['Product Type', 'Web application / marketplace (working assumption)'],
            ['Target Geography', 'TBD'],
            ['Business Model', 'TBD']
          ]
        }
      },
      {
        subtitle: '1.2 Revision History',
        table: {
          headers: ['Version', 'Date', 'Author', 'Summary of Changes'],
          rows: [
            ['0.1', '8 Sep 2026', 'Product Management', 'Initial production-oriented PRD generated from product concept; unresolved decisions explicitly separated from assumptions.']
          ]
        }
      },
      {
        subtitle: '1.3 Stakeholders & Approvers',
        table: {
          headers: ['Role', 'Responsibility', 'Sign-off'],
          rows: [
            ['Product Manager / Owner', 'Product strategy, prioritization, scope and acceptance', 'Pending'],
            ['Engineering Lead', 'Architecture feasibility, technical estimates and delivery approach', 'Pending'],
            ['Design Lead', 'UX flows, accessibility and interaction design', 'Pending'],
            ['QA Lead', 'Test strategy, acceptance coverage and release quality', 'Pending'],
            ['Operations Lead', 'Partner operations, fulfillment and exception handling', 'Pending'],
            ['Business / Founder', 'Business model, launch market and commercial approval', 'Pending'],
            ['Compliance / Legal Advisor', 'Review of applicable medicine/e-commerce/privacy obligations', 'Required before launch']
          ]
        }
      },
      {
        subtitle: '1.4 Priority Conventions',
        bullets: [
          'P0 = Required for MVP / Launch (core functional scope).',
          'P1 = Important fast-follow post-launch enhancements.',
          'P2 = Desirable / future phase capabilities.',
          'Rule: A lower priority does not mean the feature is unimportant; it is intentionally deferred to protect MVP focus.'
        ]
      }
    ]
  },
  {
    id: 'sec-2',
    number: '2',
    title: 'Introduction & Product Vision',
    summary: 'Strategic purpose, one-line summary, and explicit in-scope/out-of-scope boundaries.',
    content: [
      {
        subtitle: '2.1 Purpose',
        paragraphs: [
          'The PRD provides a single product contract for what genericMed should accomplish, how users interact with it, how success is measured, and how Engineering, Design, QA, Operations and Business teams can validate decisions. It is intentionally written at product level and avoids prescribing low-level implementation.'
        ]
      },
      {
        subtitle: '2.2 Product Vision',
        paragraphs: [
          'Make generic medicine discovery simpler, more transparent and more affordable by translating a customer’s requirements into comparable marketplace options and clearly explaining why each option is ranked.'
        ]
      },
      {
        subtitle: '2.3 Product Summary',
        paragraphs: [
          'One-line summary: genericMed is a requirement-aware generic medicine marketplace that compares eligible options using price and trust signals, then enables customers to purchase a selected option through the platform.'
        ]
      },
      {
        subtitle: '2.4 Product Scope & Clinical Boundary',
        paragraphs: [
          'Covers customer discovery, requirement capture, medicine/product comparison, ranking and recommendation, product detail, cart/checkout, order lifecycle, reviews/feedback, partner/medical-store workflows, administration, notifications, analytics, operational controls, permissions and integrations.',
          'Not covered: low-level source code; detailed API contracts; detailed database schemas/indexes; infrastructure-as-code; pixel-perfect UI specifications; clinical decision-making logic; diagnosis; prescribing; or autonomous substitution of a prescribed medicine. Any medicine eligibility/substitution behavior must be reviewed against the operating and compliance model before launch.'
        ]
      }
    ]
  },
  {
    id: 'sec-3',
    number: '3',
    title: 'Problem Statement & Market Context',
    summary: 'Market inefficiencies, customer pain points, existing alternatives, and product differentiation.',
    content: [
      {
        subtitle: '3.1 The Problem Across Stakeholders',
        bullets: [
          'Customers: People looking for medicines face multiple products, brands, strengths, pack sizes, prices, ratings and availability states. The core difficulty is determining which available option best satisfies their stated requirements without creating unsafe or misleading equivalence claims.',
          'Medical stores / fulfillment partners: Need a structured way to publish accurate product information, stock, price and fulfillment status, while receiving orders without excessive manual reconciliation.',
          'Medicine companies / suppliers: Need a controlled marketplace representation of products and a channel for product visibility.',
          'Business: The platform must create value without sacrificing trust. Ranking that optimizes only for low price could damage customer safety, satisfaction and long-term retention.'
        ]
      },
      {
        subtitle: '3.2 Pain Points',
        bullets: [
          'High cognitive effort when comparing multiple medicine options.',
          'Difficulty distinguishing product identity, strength, dosage form and pack quantity.',
          'Price comparison may be inconsistent because pack sizes and quantities differ.',
          'Users may not understand why one result ranks above another.',
          'Availability and price can change between discovery and checkout.',
          'Partner inventory and order-status accuracy can be operationally difficult.',
          'Reviews can be sparse, duplicated, manipulated or irrelevant to the product being evaluated.',
          'Medicine-related decisions carry higher trust and safety expectations than ordinary retail.'
        ]
      },
      {
        subtitle: '3.3 Product Differentiation',
        paragraphs: [
          'genericMed should not position itself merely as another medicine catalog. Its core differentiator is a decision-support layer that turns user requirements into a ranked shortlist while making the ranking understandable. The product must explicitly avoid implying that the algorithm replaces a clinician or pharmacist where professional judgment is required.'
        ]
      }
    ]
  },
  {
    id: 'sec-4',
    number: '4',
    title: 'Goals, Objectives & Non-Goals',
    summary: 'Target metrics, business goals, product goals, and explicit non-goals.',
    content: [
      {
        subtitle: '4.1 Business Goals',
        table: {
          headers: ['ID', 'Goal', 'Target', 'Timeframe'],
          rows: [
            ['BG-01', 'Validate that users can discover a suitable purchasable option through comparison.', '≥60% of qualified discovery sessions reach a product-detail view.', 'First 90 days'],
            ['BG-02', 'Convert qualified discovery into completed orders.', 'Baseline in first 30 days; target set after baseline.', 'First quarter'],
            ['BG-03', 'Maintain marketplace transaction quality.', 'Cancellation/refund/complaint rates within agreed thresholds.', 'Ongoing'],
            ['BG-04', 'Build a reliable partner supply base.', 'Partner data meets agreed freshness SLA.', 'At launch'],
            ['BG-05', 'Establish a sustainable commercial model.', 'Business model approved and unit economics measured.', 'Before scale-up']
          ]
        }
      },
      {
        subtitle: '4.2 Product Goals',
        bullets: [
          'Reduce the effort required to identify relevant generic medicine options.',
          'Make comparisons understandable by normalizing key product attributes.',
          'Show ranking factors transparently enough for customers to make informed choices.',
          'Prevent obviously invalid or incomplete options from reaching purchase.',
          'Provide a dependable end-to-end purchase and order-management experience.',
          'Give partners controlled tools to keep catalog, stock, price and fulfillment data accurate.'
        ]
      },
      {
        subtitle: '4.3 Explicit Non-Goals',
        bullets: [
          'Diagnosing illnesses or generating diagnoses from symptoms.',
          'Replacing a doctor, pharmacist or other qualified healthcare professional.',
          'Automatically changing a prescription without an approved business/compliance process.',
          'Guaranteeing clinical suitability solely from an algorithmic score.',
          'Building a full hospital/clinic management system.',
          'Providing manufacturing or pharmaceutical distribution infrastructure.',
          'Advanced AI clinical reasoning.',
          'International expansion before geography and compliance are defined.'
        ]
      }
    ]
  },
  {
    id: 'sec-5',
    number: '5',
    title: 'Success Metrics & KPIs',
    summary: 'North Star Metric (CQMO), primary KPI targets, AARRR framework, and guardrail metrics.',
    content: [
      {
        subtitle: '5.1 North Star Metric',
        paragraphs: [
          'North Star: Completed Qualified Medicine Orders (CQMO). This metric counts completed orders where the customer successfully discovered an eligible option through the marketplace experience and the order reached the defined completed state. It combines customer value with marketplace execution and should be segmented to ensure growth does not come at the expense of safety, trust or operational quality.'
        ]
      },
      {
        subtitle: '5.2 Primary KPIs',
        table: {
          headers: ['KPI', 'Definition', 'Target', 'Measurement Method'],
          rows: [
            ['Search-to-detail rate', 'Qualified search sessions that view ≥1 product detail.', 'Baseline; +20% relative improvement after optimization.', 'Event funnel'],
            ['Comparison engagement', 'Discovery sessions comparing ≥2 eligible options.', 'Baseline in first 30 days.', 'Event analytics'],
            ['Checkout conversion', 'Orders placed / checkout sessions.', 'Baseline then quarterly target.', 'Order + analytics'],
            ['Order completion rate', 'Completed orders / placed orders.', '≥95% working target; validate operationally.', 'Order lifecycle'],
            ['Price-data freshness', 'Active listings meeting price freshness SLA.', '≥99% working target.', 'Catalog monitoring'],
            ['Stock accuracy', 'Accepted orders that are actually fulfillable.', '≥98% working target.', 'Order reconciliation'],
            ['Recommendation satisfaction', 'Positive usefulness feedback.', '≥80% working target.', 'In-product feedback'],
            ['Support contact rate', 'Orders generating support cases / orders.', 'Trend downward without hiding complaints.', 'Support data'],
            ['Refund/cancellation rate', 'Refunded/cancelled orders / placed orders.', 'Threshold after baseline.', 'Order data'],
            ['Critical error rate', 'Sessions encountering purchase-blocking errors.', '<1% working target.', 'Monitoring']
          ]
        }
      },
      {
        subtitle: '5.3 Guardrail Metrics',
        bullets: [
          'Medication-related complaint rate and severity.',
          'Incorrect/invalid product mapping rate.',
          'Order cancellation and refund rate.',
          'Payment failure rate.',
          'Stock mismatch rate.',
          'Critical application error rate.',
          'Unauthorized access/security incidents.',
          'Recommendation disagreement / negative-feedback rate.'
        ]
      }
    ]
  },
  {
    id: 'sec-6',
    number: '6',
    title: 'Target Users & Personas',
    summary: 'Comprehensive definitions for Personas A through E across customer, partner, and admin types.',
    content: [
      {
        subtitle: '6.1 Customer & Partner Personas',
        table: {
          headers: ['Persona', 'Role Context', 'Primary Goals', 'Core Frustrations & Needs'],
          rows: [
            ['Persona A: Value-Seeking Customer', 'Adult customer seeking affordable generic option & online purchase', 'Find eligible option quickly; compare total/normalized price; understand ranking; purchase with confidence', 'Too many similar products; unclear pack differences; unexpected price/stock changes. Needs simple comparison, clear identity, secure checkout.'],
            ['Persona B: Repeat Customer', 'Customer who repeatedly buys chronic medicines', 'Reuse prior selections; check current price/availability; track orders', 'Repeating the same search; price volatility. Needs order history, reorder entry point, saved preferences without unsafe clinical inference.'],
            ['Persona C: Pharmacy / Store Operator', 'Business partner responsible for catalog, stock, pricing, fulfillment', 'Keep listings accurate; receive/manage orders; update stock/status; reduce mistakes', 'Manual reconciliation; stale stock; unclear order states. Needs bulk-friendly workflows, alerts, dashboards, controlled permissions.'],
            ['Persona D: Catalog / Supplier Partner', 'Authorized supplier responsible for product/catalog data', 'Publish accurate product attributes; manage approved records; monitor visibility', 'Duplicate listings; data-quality issues; approval delays. Needs structured fields, validation and approval workflows.'],
            ['Persona E: Operations / Admin', 'Internal team managing users, partners, catalog quality, disputes', 'Maintain marketplace integrity; resolve exceptions; audit changes; monitor KPIs', 'Incomplete data; hidden failures; insufficient audit trails. Needs RBAC, audit logs, exception queues, reporting and safe controls.']
          ]
        }
      }
    ]
  },
  {
    id: 'sec-7',
    number: '7',
    title: 'User Stories & Jobs To Be Done',
    summary: 'Formal user stories for Customers, Partners, and Admins, plus Primary and Partner JTBD.',
    content: [
      {
        subtitle: '7.1 Customer Stories',
        bullets: [
          'As a customer, I want to enter my medicine requirements so that I can see relevant available options.',
          'As a customer, I want results filtered to products that satisfy mandatory requirements so irrelevant options do not dominate.',
          'As a customer, I want to compare price, pack size, availability and trust signals so I can choose confidently.',
          'As a customer, I want to understand why a product is ranked highly so the recommendation does not feel arbitrary.',
          'As a customer, I want complete product information before purchase so I can verify what I am buying.',
          'As a customer, I want to add an eligible product to cart so I can purchase it.',
          'As a customer, I want to pay securely and receive confirmation so I know whether my order succeeded.',
          'As a customer, I want to track my order so I know its current status.',
          'As a customer, I want to review a completed purchase so I can share useful feedback.'
        ]
      },
      {
        subtitle: '7.2 Partner & Admin Stories',
        bullets: [
          'As a partner, I want to onboard with verified business information so the marketplace can control eligibility.',
          'As a partner, I want to maintain product, price and inventory information so customers see accurate options.',
          'As a partner, I want to receive and update order statuses so customers can track fulfillment.',
          'As an admin, I want to approve or suspend partners so marketplace quality can be controlled.',
          'As an admin, I want to manage product mappings and data-quality exceptions so comparisons remain trustworthy.',
          'As an admin, I want audit logs for sensitive actions so changes are traceable.'
        ]
      },
      {
        subtitle: '7.3 Jobs To Be Done (JTBD)',
        paragraphs: [
          'Primary JTBD: When I need to purchase a medicine and have specific requirements, help me identify an eligible and affordable option with enough information to make an informed choice, then let me complete the purchase with minimal friction.',
          'Partner JTBD: When I offer medicine products through the marketplace, help me keep catalog, stock, pricing and fulfillment information accurate and turn valid customer demand into manageable orders.'
        ]
      }
    ]
  },
  {
    id: 'sec-8',
    number: '8',
    title: 'Scope, Assumptions, Constraints & Dependencies',
    summary: 'System boundaries, operational dependencies, and technical constraints.',
    content: [
      {
        subtitle: '8.1 Dependencies Table',
        table: {
          headers: ['Dependency', 'Type', 'Description', 'Impact if Delayed'],
          rows: [
            ['Approved product catalog', 'Data', 'Normalized product identities and attributes.', 'Discovery/comparison cannot be trusted.'],
            ['Partner onboarding model', 'Business/Ops', 'Defines who may sell/fulfill products.', 'Orders cannot scale safely.'],
            ['Payment service', 'External', 'Enables transaction processing.', 'Checkout unavailable.'],
            ['Authentication/OTP', 'External', 'Secure account access if selected.', 'Signup/login degraded.'],
            ['Inventory/price source', 'Partner/Data', 'Current stock and price.', 'Incorrect availability / cancellations.'],
            ['Delivery/fulfillment', 'Operations', 'Moves orders to customers.', 'Order completion unavailable.'],
            ['Compliance review', 'Governance', 'Confirms applicable operating rules.', 'Launch risk / scope blocker.'],
            ['Analytics/monitoring', 'Technical', 'Measures funnels and service health.', 'Poor decisions and incident visibility.']
          ]
        }
      }
    ]
  },
  {
    id: 'sec-9',
    number: '9',
    title: 'Functional Requirements (FR)',
    summary: 'Comprehensive requirements matrix across all 12 modules from FR-AUTH to FR-AN.',
    content: [
      {
        subtitle: '9.1 Authentication & Onboarding',
        table: {
          headers: ['ID', 'Requirement', 'Priority', 'Acceptance Criteria'],
          rows: [
            ['FR-AUTH-01', 'Allow customer to create account using approved authentication method.', 'P0', 'Valid data creates one account; duplicates rejected; invalid fields show validation.'],
            ['FR-AUTH-02', 'Authenticate customer and establish authorized session.', 'P0', 'Valid credentials/OTP authenticate; invalid/expired fail; protected pages remain inaccessible.'],
            ['FR-AUTH-03', 'Provide logout / session termination.', 'P0', 'After logout, protected actions require re-authentication.'],
            ['FR-AUTH-04', 'Apply rate limiting or abuse controls to repeated auth attempts.', 'P0', 'Repeated failures trigger throttling; legitimate recovery remains possible.'],
            ['FR-AUTH-05', 'Collect only profile info necessary for defined experience.', 'P1', 'Required fields documented; optional labeled; unnecessary fields omitted.']
          ]
        }
      },
      {
        subtitle: '9.3 Requirement Capture & Discovery',
        table: {
          headers: ['ID', 'Requirement', 'Priority', 'Acceptance Criteria'],
          rows: [
            ['FR-SEARCH-01', 'Allow customers to enter medicine requirements using structured / free-text inputs.', 'P0', 'Empty submission blocked; valid input produces search state.'],
            ['FR-SEARCH-02', 'Normalize medicine attributes (product identity, strength, dosage form, pack quantity).', 'P0', 'Equivalent attributes represented consistently; incomplete records flagged/excluded.'],
            ['FR-SEARCH-03', 'Return only options satisfying mandatory user constraints.', 'P0', 'Product violating mandatory constraint is excluded/marked ineligible.'],
            ['FR-SEARCH-04', 'Provide relevant filters including price and availability.', 'P0', 'Applying/removing filter updates results consistently.'],
            ['FR-SEARCH-05', 'Support sorting by price and approved ranking dimensions.', 'P0', 'Sort order is deterministic; missing values follow documented rules.'],
            ['FR-SEARCH-06', 'Provide meaningful empty state when no eligible products found.', 'P0', 'State explains no match and offers safe next actions.'],
            ['FR-SEARCH-07', 'Distinguish unavailable products from purchasable products.', 'P0', 'Unavailable items cannot be added to cart; status is visible.']
          ]
        }
      },
      {
        subtitle: '9.4 Comparison, Ranking & Recommendation',
        table: {
          headers: ['ID', 'Requirement', 'Priority', 'Acceptance Criteria'],
          rows: [
            ['FR-CORE-01', 'Rank eligible products using approved scoring model based on price, ratings, feedback, availability.', 'P0', 'Fixed inputs produce reproducible ranking; excluded products never outrank eligible products.'],
            ['FR-CORE-02', 'Display major factors contributing to ranking.', 'P0', 'Each recommended item exposes understandable factors; unsupported claims not shown.'],
            ['FR-CORE-03', 'Normalize price comparisons when pack quantity differs.', 'P0', 'Valid unit data enables normalized comparison (price per tablet/unit).'],
            ['FR-CORE-04', 'Allow customers to compare at least two eligible products side-by-side.', 'P0', 'Selected products show common comparable attributes; incompatible fields labeled.'],
            ['FR-CORE-05', 'Prevent ratings/reviews from being sole basis for suitability.', 'P0', 'Ranking includes approved non-review factors.'],
            ['FR-CORE-06', 'Allow authorized owners to configure ranking rules/weights.', 'P1', 'Only permitted roles configure; invalid values rejected; audited.'],
            ['FR-CORE-07', 'Provide approved guidance where comparison does not establish clinical equivalence.', 'P0', 'Displays approved safety wording and follows defined purchase rules.']
          ]
        }
      },
      {
        subtitle: '9.5 Product Detail, Cart & Revalidation',
        table: {
          headers: ['ID', 'Requirement', 'Priority', 'Acceptance Criteria'],
          rows: [
            ['FR-CART-01', 'Display product identity, attributes, seller, price, pack size, availability before purchase.', 'P0', 'Required fields present; stale/unknown data not presented as current.'],
            ['FR-CART-02', 'Allow customers to add eligible available products to cart.', 'P0', 'Eligible item added; unavailable items blocked.'],
            ['FR-CART-03', 'Revalidate price and availability before order creation.', 'P0', 'Changed price/stock is surfaced before final order submission.'],
            ['FR-CART-04', 'Prevent duplicate cart actions from creating unintended duplicate quantities.', 'P0', 'Rapid submissions idempotent or reconciled.'],
            ['FR-CART-05', 'Allow removal or quantity adjustment within configured limits.', 'P0', 'Invalid quantity rejected; zero removes item.']
          ]
        }
      },
      {
        subtitle: '9.6 Checkout & Payments',
        table: {
          headers: ['ID', 'Requirement', 'Priority', 'Acceptance Criteria'],
          rows: [
            ['FR-PAY-01', 'Present checkout summary including items, quantities, applicable charges, payable amount.', 'P0', 'Displayed total matches payment amount.'],
            ['FR-PAY-02', 'Initiate payment using approved external integration.', 'P0', 'Verified success produces paid state; failed payment cannot create falsely paid order.'],
            ['FR-PAY-03', 'Reconcile payment status before marking order as paid.', 'P0', 'Client-side success alone cannot finalize payment.'],
            ['FR-PAY-04', 'Handle payment timeout/failure with retry or alternate method.', 'P0', 'Recoverable error shown; duplicate order prevented.'],
            ['FR-PAY-05', 'Provide confirmation after successful order creation.', 'P0', 'Customer receives order ID/status and appears in history.'],
            ['FR-PAY-06', 'Do not store raw payment credentials unless approved/required.', 'P0', 'Logs contain no raw sensitive payment data.']
          ]
        }
      },
      {
        subtitle: '9.7 Orders, Tracking & History',
        table: {
          headers: ['ID', 'Requirement', 'Priority', 'Acceptance Criteria'],
          rows: [
            ['FR-ORDER-01', 'Create order only after product, availability and payment validations pass.', 'P0', 'Failed validations cannot create completed/paid order.'],
            ['FR-ORDER-02', 'Maintain defined order state lifecycle.', 'P0', 'Valid transitions succeed; invalid transitions rejected.'],
            ['FR-ORDER-03', 'Display current order status and relevant timestamps.', 'P0', 'Status is visible; tracking milestones displayed.'],
            ['FR-ORDER-04', 'Allow authorized operations/partners to update permitted order statuses.', 'P0', 'Authorized updates succeed; audited.'],
            ['FR-ORDER-05', 'Prevent duplicate order creation from repeated checkout requests.', 'P0', 'Repeated attempts create one order or recovery state.'],
            ['FR-ORDER-06', 'Support configured cancellation/refund states.', 'P1', 'Policy-eligible actions succeed; refund state reconciled.']
          ]
        }
      },
      {
        subtitle: '9.9 Partner / Medical Store Portal',
        table: {
          headers: ['ID', 'Requirement', 'Priority', 'Acceptance Criteria'],
          rows: [
            ['FR-PART-01', 'Allow authorized partners to submit onboarding info for review.', 'P0', 'Required information validated; review status set.'],
            ['FR-PART-02', 'Allow approved partners to maintain product, price, inventory info.', 'P0', 'Valid updates persist; actor/timestamp recorded.'],
            ['FR-PART-03', 'Provide partners with queue of relevant orders.', 'P0', 'Partner sees only orders assigned/available to them.'],
            ['FR-PART-04', 'Allow partners to update fulfillment statuses within permitted transitions.', 'P0', 'Valid transitions update customer-facing state and audit.'],
            ['FR-PART-05', 'Surface stale catalog / stock data to partners.', 'P1', 'Partner identifies records requiring update.']
          ]
        }
      },
      {
        subtitle: '9.10 Admin & Operations',
        table: {
          headers: ['ID', 'Requirement', 'Priority', 'Acceptance Criteria'],
          rows: [
            ['FR-ADM-01', 'Allow authorized admins to search/view users, partners, products, orders.', 'P0', 'Search respects authorization; sensitive fields masked.'],
            ['FR-ADM-02', 'Allow authorized users to approve, suspend or reject partners.', 'P0', 'Action changes status; records actor/time/reason.'],
            ['FR-ADM-03', 'Allow catalog administrators to resolve product-data exceptions.', 'P0', 'Permitted changes validated and auditable.'],
            ['FR-ADM-04', 'Expose operational exceptions (payment mismatch, stock mismatch, failed fulfillment).', 'P0', 'Exception appears in correct queue with resolution context.'],
            ['FR-ADM-05', 'Restrict high-risk actions (refunds, suspension, ranking config) to authorized roles.', 'P0', 'Unauthorized action fails; authorized action logged.']
          ]
        }
      }
    ]
  },
  {
    id: 'sec-10',
    number: '10',
    title: 'Edge Cases & Exception Handling',
    summary: 'System behavior under 18 distinct failure modes and the core Failure-State Principle.',
    content: [
      {
        subtitle: '10.1 Scenarios & Expected System Behaviour',
        table: {
          headers: ['Feature', 'Scenario', 'Expected System Behaviour'],
          rows: [
            ['Requirement Search', 'Empty requirement input', 'Block search and show required-field guidance; do not send malformed request.'],
            ['Requirement Search', 'No eligible results', 'Show empty state and allow safe adjustment of optional criteria.'],
            ['Requirement Search', 'Ambiguous/incomplete product data', 'Do not silently infer unsafe equivalence; mark ambiguity or route to defined safe path.'],
            ['Ranking', 'Missing rating/review data', 'Use documented fallback; never treat missing data as perfect.'],
            ['Ranking', 'Equal scores', 'Use deterministic approved tie-breaker.'],
            ['Comparison', 'Different pack quantities', 'Show pack and normalized price only when quantity data is valid.'],
            ['Product', 'Price changes after search', 'Refresh/flag changed price before checkout; require confirmation if needed.'],
            ['Product', 'Stock changes after cart', 'Revalidate; block unavailable item and offer recovery.'],
            ['Cart', 'Rapid repeated add', 'Prevent unintended duplicate quantity or reconcile idempotently.'],
            ['Checkout', 'Network interruption after payment', 'Reconcile provider status before allowing another payment.'],
            ['Payment', 'Provider timeout', 'Show pending/retry state; reconcile final state.'],
            ['Payment', 'Payment succeeds but order creation fails', 'Create reconciliation state/case; never lose or duplicate transaction.'],
            ['Order', 'Invalid state transition', 'Reject and log attempted action.'],
            ['Order', 'Partner rejects fulfillment', 'Notify according to policy and offer approved recovery.'],
            ['Notifications', 'Provider unavailable', 'Queue/retry where supported; internal state remains authoritative.'],
            ['Admin', 'High-risk action', 'Require role and record actor, timestamp, object, state change and reason.'],
            ['Data', 'Stale partner inventory', 'Flag listing and apply configured visibility/purchase restriction.'],
            ['Service', 'Third-party outage', 'Gracefully degrade affected capability and show actionable message.']
          ]
        }
      },
      {
        subtitle: '10.2 Failure-State Principle',
        paragraphs: [
          'genericMed should fail closed for safety-critical eligibility decisions and fail transparently for availability/transaction failures. It must never represent an unverified payment as successful, an unavailable product as purchasable, or an algorithmic ranking as clinical advice.'
        ]
      }
    ]
  },
  {
    id: 'sec-11',
    number: '11',
    title: 'Key User Flows',
    summary: 'End-to-end customer, partner, admin, exception, and review workflows.',
    content: [
      {
        subtitle: '11.1 Primary Customer Flow',
        paragraphs: [
          'Start → Open genericMed → Sign in/continue under approved access model → Enter medicine requirements → Validate → Retrieve eligible options → Filter/sort → Compare → Review ranking explanation → Product detail → Confirm product/pack/price/availability → Cart → Checkout → Revalidate → Payment → Verify → Order creation → Confirmation → Tracking → Completion.'
        ]
      },
      {
        subtitle: '11.2 Customer No-Match Flow',
        paragraphs: [
          'Search → No eligible products → Explain which mandatory constraint prevented a match → Offer safe adjustment to optional criteria → Re-run → Results or repeat no-match state.'
        ]
      },
      {
        subtitle: '11.3 Payment Failure & Stock Mismatch Flows',
        bullets: [
          'Payment Failure Flow: Checkout → Payment attempt → Provider failure/timeout/cancellation → Verified failed/pending state → Recovery action → Retry/change method → Verify payment → Create/reconcile order → Confirmation.',
          'Stock Mismatch Flow: Product → Cart → Checkout revalidation → Stock unavailable → Block order → Explain change → Refresh/remove/eligible alternative → Confirm updated cart → Checkout.'
        ]
      },
      {
        subtitle: '11.4 Partner & Admin Operations Flows',
        bullets: [
          'Partner Flow: Onboarding → Submit information → Admin review → Approved → Activate catalog/order permissions → Maintain products/price/stock → Receive order → Accept/prepare/fulfill → Update status → Customer notified → Completed.',
          'Admin Flow: Admin sign-in → Authorization → Dashboard → Exception queue → Open case → Inspect order/payment/catalog context → Permitted action → Record reason → Update state → Notify → Close/reopen.'
        ]
      },
      {
        subtitle: '11.5 Flow Design Principles',
        bullets: [
          'Every irreversible action has confirmation or verified backend state.',
          'Customer-facing status reflects verified state.',
          'Recovery actions preserve context.',
          'Safety-sensitive ambiguity is not hidden by a score.',
          'Partner/admin actions are constrained by role and valid transitions.'
        ]
      }
    ]
  },
  {
    id: 'sec-12',
    number: '12',
    title: 'Non-Functional Requirements (NFR)',
    summary: 'Performance, scalability, security, privacy, accessibility, and reliability standards.',
    content: [
      {
        subtitle: '12.1 NFR Matrix',
        table: {
          headers: ['ID', 'Category', 'Requirement', 'Target / Acceptance'],
          rows: [
            ['NFR-PERF-01', 'Performance', 'Search results return within 2 seconds for 95% of requests.', 'P95 ≤2s under baseline load.'],
            ['NFR-PERF-02', 'Performance', 'Checkout/order APIs respond promptly.', 'P95 ≤2.5s excluding payment UI latency.'],
            ['NFR-SCALE-01', 'Scalability', 'Support approved launch concurrency with headroom.', 'Capacity test at ≥2x expected peak baseline.'],
            ['NFR-AVAIL-01', 'Availability', 'Critical customer paths meet availability target.', 'Working target ≥99.5% monthly.'],
            ['NFR-REL-01', 'Reliability', 'Order creation/payment reconciliation is idempotent.', 'Zero duplicate completed orders from retries.'],
            ['NFR-SEC-01', 'Security', 'Protected resources require authentication/authorization.', '100% of protected paths tested.'],
            ['NFR-SEC-02', 'Security', 'Sensitive data encrypted in transit and at rest.', 'TLS in production; approved storage controls.'],
            ['NFR-SEC-03', 'Security', 'Authentication has abuse controls.', 'Rate limits and monitoring enabled.'],
            ['NFR-PRIV-01', 'Privacy', 'Personal data follows minimization and approved retention.', 'Every collected field has documented purpose.'],
            ['NFR-A11Y-01', 'Accessibility', 'Core web journeys meet accessibility baseline.', 'Target WCAG 2.1 AA compliant.'],
            ['NFR-DATA-01', 'Data Quality', 'Catalog records meet minimum completeness for ranking.', 'Incomplete products excluded/flagged.']
          ]
        }
      }
    ]
  },
  {
    id: 'sec-13',
    number: '13',
    title: 'Information Architecture & Key Screens',
    summary: 'Navigation hierarchy, key screen catalogue, and required UI state handling.',
    content: [
      {
        subtitle: '13.1 Navigation Hierarchies',
        bullets: [
          'Customer: Home → Search/Requirements → Results → Compare → Product Detail → Cart → Checkout → Order Confirmation → Orders → Order Detail/Tracking → Profile/Settings → Support.',
          'Partner: Dashboard → Catalog → Inventory/Price → Orders → Exceptions → Notifications → Business Profile.',
          'Admin: Dashboard → Users → Partners → Catalog → Orders → Payments/Exceptions → Reviews → Ranking Configuration → Reports → Audit Logs → System Configuration.'
        ]
      },
      {
        subtitle: '13.2 Key Screens',
        table: {
          headers: ['Screen', 'User', 'Purpose', 'Primary Actions'],
          rows: [
            ['Home / Landing', 'Customer', 'Explain value and begin discovery', 'Start search, sign in, support'],
            ['Requirement Capture', 'Customer', 'Collect requirements and constraints', 'Submit, edit, clear'],
            ['Search Results', 'Customer', 'Show eligible ranked options', 'Filter, sort, compare, detail'],
            ['Comparison', 'Customer', 'Compare selected eligible products', 'Change selection, view detail'],
            ['Product Detail', 'Customer', 'Trustworthy product/seller information', 'Add to cart, check availability'],
            ['Cart & Checkout', 'Customer', 'Review selected products and pay', 'Edit, remove, checkout, pay'],
            ['Order Confirmation & Tracking', 'Customer', 'Confirm verified state and show lifecycle', 'View order, track, contact support'],
            ['Partner Dashboard & Orders', 'Partner', 'Operational overview & process orders', 'Accept, prepare, update status'],
            ['Admin Dashboard & Exceptions', 'Admin/Ops', 'Monitor marketplace & resolve issues', 'Investigate mismatch, resolve, audit']
          ]
        }
      },
      {
        subtitle: '13.3 Required UI States',
        bullets: [
          'Loading / skeleton state for search, product and order data.',
          'Empty state for no results, empty cart, and no history.',
          'Validation state for invalid requirements, quantities, and checkout fields.',
          'Error state with retry and recovery actions.',
          'Unauthorized state for protected resources.',
          'Offline / poor-network state that never implies transaction success.',
          'Success state for verified payment / order completion.'
        ]
      }
    ]
  },
  {
    id: 'sec-14',
    number: '14',
    title: 'High-Level Data Model',
    summary: 'Conceptual business entities, relationships, and lifecycle progressions.',
    content: [
      {
        subtitle: '14.1 Business Entities',
        table: {
          headers: ['Entity', 'Purpose', 'Key Relationships', 'Lifecycle'],
          rows: [
            ['User / Customer', 'Identity and profile', 'Owns searches, carts, orders, reviews', 'Active → suspended/deleted'],
            ['Partner', 'Approved business entity', 'Owns listings and fulfills orders', 'Onboarding → review → approved/rejected'],
            ['Product', 'Canonical medicine identity', 'Referenced by listings, comparisons', 'Draft → approved → active → retired'],
            ['Product Listing', 'Partner sellable representation', 'Links Product ↔ Partner; price, stock, pack', 'Draft → active → paused → retired'],
            ['Requirement Set', 'Structured search intent', 'Used for eligibility and ranking context', 'Created → searched → retained'],
            ['Ranking Config', 'Approved rules and weights', 'Controls ranking; changes audited', 'Versioned (e.g. v1.4)'],
            ['Cart', 'Temporary purchase selection', 'Contains listing & quantity references', 'Active → checked out → expired'],
            ['Order', 'Commercial transaction', 'Belongs to customer; references listings', 'Created → paid → fulfilled / cancelled'],
            ['Payment', 'Payment transaction/state', 'Linked to order and external gateway', 'Initiated → pending → paid / failed'],
            ['Audit Event', 'Sensitive-action metadata', 'References actor and affected entity', 'Created on auditable action (immutable)']
          ]
        }
      },
      {
        subtitle: '14.2 Conceptual Data Chain',
        paragraphs: [
          'Customer → Requirement Set → Eligible Product Listings → Comparison / Ranking → Cart → Order → Payment'
        ]
      }
    ]
  },
  {
    id: 'sec-15',
    number: '15',
    title: 'Roles & Permissions',
    summary: 'Role-based access controls across Customer, Partner Staff, Operations, Catalog Admin, and Auditors.',
    content: [
      {
        subtitle: '15.1 Permissions Matrix',
        table: {
          headers: ['Role', 'Resource / Module', 'Permission', 'Control Rule'],
          rows: [
            ['Customer', 'Profile / Orders', 'Read / Update own', 'Cannot access another user data.'],
            ['Customer', 'Search / Compare', 'Create / Read', 'May only purchase eligible listings.'],
            ['Partner Staff', 'Catalog / Inventory', 'Read / Update permitted listings', 'Canonical identity remains controlled.'],
            ['Partner Staff', 'Orders Queue', 'Read / Update assigned orders', 'No restricted refunds / admin actions.'],
            ['Operations', 'Orders / Exceptions', 'Read / Update operational states', 'Sensitive actions role-limited.'],
            ['Catalog Admin', 'Product / Catalog', 'Create / Read / Update / Approve / Suspend', 'High-risk changes audited.'],
            ['Admin', 'Users / Partners', 'Read / Approve / Suspend / Manage', 'Role assignment strictly restricted.'],
            ['Auditor', 'Audit Logs', 'Read / Export where allowed', 'No operational modifications allowed.']
          ]
        }
      },
      {
        subtitle: '15.2 Permission Principles',
        bullets: [
          'Default deny for protected operations.',
          'Least privilege by role.',
          'Sensitive operations separated where practical.',
          'Role changes and state transitions are auditable.'
        ]
      }
    ]
  },
  {
    id: 'sec-16',
    number: '16',
    title: 'Integrations & Third-Party Services',
    summary: 'Capability requirements for external payments, notifications, catalog feeds, and error monitoring.',
    content: [
      {
        subtitle: '16.1 Integrations Overview',
        table: {
          headers: ['Integration', 'Purpose', 'Criticality', 'Failure Impact'],
          rows: [
            ['Payment gateway', 'Secure online payments', 'Critical', 'Checkout unavailable; no false paid state.'],
            ['Authentication / OTP', 'Account access if selected', 'High', 'Login/signup degraded.'],
            ['SMS / Email provider', 'Order/operational notifications', 'Medium/High', 'Notifications delayed; internal state authoritative.'],
            ['Inventory / catalog feeds', 'Price, stock and product data', 'Critical', 'Stale/incorrect listings; purchase restrictions apply.'],
            ['Delivery / fulfillment', 'Delivery/tracking if outsourced', 'High', 'Fulfillment/tracking degraded.'],
            ['Analytics platform', 'Product measurement', 'Medium', 'Measurement gaps; transactions continue.'],
            ['Error monitoring', 'Application health', 'High', 'Reduced incident visibility.']
          ]
        }
      }
    ]
  },
  {
    id: 'sec-17',
    number: '17',
    title: 'Analytics & Instrumentation',
    summary: 'Funnel event definitions from requirement_submitted to order_created and admin actions.',
    content: [
      {
        subtitle: '17.1 Funnel Events',
        table: {
          headers: ['Event Name', 'Trigger', 'Key Properties', 'Purpose'],
          rows: [
            ['landing_view', 'Customer opens home', 'session_id, source, device_class', 'Acquisition funnel'],
            ['requirement_submitted', 'Valid requirements submitted', 'search_id, requirement_dimensions', 'Search conversion'],
            ['search_results_viewed', 'Results rendered', 'search_id, result_count, latency_bucket', 'Discovery quality'],
            ['comparison_started', '≥2 items selected', 'search_id, count', 'Comparison engagement'],
            ['ranking_explanation_viewed', 'Explanation opened', 'search_id, listing_id', 'Explainability transparency'],
            ['add_to_cart', 'Eligible product added', 'cart_id, listing_id, quantity', 'Conversion'],
            ['checkout_started', 'Checkout entered', 'cart_id, item_count, total_band', 'Checkout funnel'],
            ['payment_result', 'Verified result received', 'order_attempt_id, result_status', 'Reliability'],
            ['order_created', 'Order successfully created', 'order_id, source_search_id', 'Core conversion (CQMO)'],
            ['admin_sensitive_action', 'Sensitive action occurs', 'actor_role, action_type, entity_type', 'Governance']
          ]
        }
      }
    ]
  },
  {
    id: 'sec-18',
    number: '18',
    title: 'Audit & Operational Logging',
    summary: 'Auditable event types, minimum record schemas, and operational health monitoring.',
    content: [
      {
        subtitle: '18.1 Minimum Audit Record Schema',
        table: {
          headers: ['Field', 'Purpose'],
          rows: [
            ['Actor ID / role', 'Who performed the action.'],
            ['Timestamp', 'When the action occurred.'],
            ['Action type', 'What operation occurred (e.g. PARTNER_APPROVAL).'],
            ['Entity type + ID', 'What object was affected.'],
            ['Previous state', 'State before change where applicable.'],
            ['New state', 'State after change.'],
            ['Reason / note', 'Why action occurred when required.'],
            ['Request / correlation ID', 'Links action to incident/request.'],
            ['Source context', 'Admin portal, partner portal, or automated job.']
          ]
        }
      }
    ]
  },
  {
    id: 'sec-19',
    number: '19',
    title: 'Release Plan & Roadmap',
    summary: 'Phased rollout strategy from Phase 0 Foundations to Phase 3 Scale and Build Order.',
    content: [
      {
        subtitle: '19.1 Release Phases',
        table: {
          headers: ['Phase', 'Theme', 'Key Scope', 'Exit Criteria'],
          rows: [
            ['Phase 0 — Foundations', 'Data, trust and operating model', 'Launch geography, compliance review, catalog model, partner model, ranking principles, analytics, security.', 'Scope, data model, partner process, risk review approved.'],
            ['Phase 1 — MVP', 'Complete core customer value loop', 'Auth, requirements, eligible search, comparison, ranking explanation, product detail, cart, payment, orders, basic partner/admin.', 'Customer can discover → compare → purchase → receive verified order.'],
            ['Phase 2 — Trust & Growth', 'Confidence and repeat usage', 'Reviews, explainability improvements, reorder, richer partner dashboards, reporting, support tooling.', 'Quality KPIs stable; recommendation satisfaction measured.'],
            ['Phase 3 — Scale & Optimization', 'Scale supply and performance', 'Catalog ingestion, ranking experimentation, integrations, localization, scalability.', 'Growth targets met without guardrail deterioration.']
          ]
        }
      }
    ]
  },
  {
    id: 'sec-20',
    number: '20',
    title: 'MVP Definition & Scope Guardrails',
    summary: 'Precise P0 Must-Have scope, P1 Should-Have, P2 Later, and the MVP Scope Guardrail.',
    content: [
      {
        subtitle: '20.1 Must Have (P0)',
        bullets: [
          'Authentication / access flow.',
          'Requirement capture and validation.',
          'Catalog-backed search and eligibility filtering.',
          'Price, pack-size and availability display.',
          'Comparison of eligible options.',
          'Transparent ranking / recommendation explanation.',
          'Product detail page with verified information.',
          'Cart with checkout-time price/stock revalidation.',
          'Payment integration and verification.',
          'Order creation, status lifecycle and customer history.',
          'Partner onboarding approval and basic catalog/order operations.',
          'Admin operational exception handling and audit logging.'
        ]
      },
      {
        subtitle: '20.2 MVP Scope Guardrail',
        paragraphs: [
          'A feature should enter MVP only if it directly enables the discovery-to-purchase loop, marketplace trust, fulfillment, or critical governance. Clinical features, broad personalization and scale optimizations should wait until the operating model and baseline transaction quality are proven.'
        ]
      }
    ]
  },
  {
    id: 'sec-21',
    number: '21',
    title: 'Risks & Mitigations',
    summary: 'Risk matrix covering clinical interpretation, stale inventory, reconciliation failures, and regulatory compliance.',
    content: [
      {
        subtitle: '21.1 Risk Register',
        table: {
          headers: ['Risk', 'Probability', 'Impact', 'Mitigation'],
          rows: [
            ['Incorrect product mapping', 'Medium', 'Very High', 'Canonical product identity, mandatory attribute validation, approval workflow, exception queues.'],
            ['Unsafe recommendation interpretation', 'Medium', 'Very High', 'Limit algorithm to approved marketplace comparison; explain factors; compliance review.'],
            ['Stale price/stock data', 'High', 'High', 'Freshness timestamps, partner SLAs, checkout revalidation and mismatch monitoring.'],
            ['Payment/order reconciliation failure', 'Medium', 'High', 'Idempotency, provider verification, reconciliation jobs and pending states.'],
            ['Low customer trust', 'Medium', 'High', 'Transparent ranking, product identity clarity, verified reviews, support and partner info.'],
            ['Review manipulation', 'Medium', 'Medium', 'Verified purchase eligibility, moderation/reporting and anomaly monitoring.'],
            ['Ranking over-optimizes price', 'Medium', 'High', 'Multi-factor ranking, guardrails, explainability and product owner approval.']
          ]
        }
      }
    ]
  },
  {
    id: 'sec-22',
    number: '22',
    title: 'Open Questions',
    summary: 'The 18 strategic, legal, and operational open questions requiring stakeholder resolution.',
    content: [
      {
        subtitle: '22.1 Strategic & Compliance Open Questions',
        table: {
          headers: ['#', 'Question', 'Owner', 'Needed By'],
          rows: [
            ['1', 'What is the launch country/city and initial serviceable geography?', 'Business/Product', 'Before roadmap lock'],
            ['2', 'What is the operating model: marketplace, inventory-owning retailer, referral layer or hybrid?', 'Business/Legal', 'Before architecture/partner model'],
            ['3', 'Which medicine categories can be sold in MVP?', 'Compliance/Product', 'Before catalog scope'],
            ['4', 'What customer eligibility/prescription workflow applies by category?', 'Compliance/Ops', 'Before checkout rules'],
            ['5', 'What business model will genericMed use?', 'Founder/Business', 'Before financial model'],
            ['6', 'Who owns fulfillment, delivery, returns and support?', 'Operations', 'Before MVP launch'],
            ['7', 'Which payment provider and settlement model will be used?', 'Finance/Engineering', 'Before checkout'],
            ['8', 'What catalog source is authoritative?', 'Catalog/Ops', 'Before search'],
            ['9', 'How will generic medicines be normalized/mapped and approved?', 'Product/Compliance/Ops', 'Before ranking'],
            ['10', 'What ranking factors and weights are approved?', 'Product/Compliance', 'Before ranking'],
            ['11', 'What evidence is sufficient to establish comparability?', 'Product/Compliance', 'Before comparison'],
            ['12', 'What review policy applies to medical-product feedback?', 'Product/Compliance', 'Before reviews'],
            ['13', 'What are cancellation/refund/failed-fulfillment policies?', 'Business/Ops', 'Before orders'],
            ['14', 'What delivery SLA/serviceability rules apply?', 'Operations', 'Before checkout'],
            ['15', 'What languages/currencies are required?', 'Business/Product', 'Before UX lock'],
            ['16', 'What support channels/SLA are required?', 'Operations', 'Before launch'],
            ['17', 'What retention/deletion rules apply?', 'Legal/Privacy', 'Before launch'],
            ['18', 'What fraud/abuse controls are required?', 'Security/Finance', 'Before launch']
          ]
        }
      }
    ]
  },
  {
    id: 'sec-23',
    number: '23',
    title: 'Traceability Check',
    summary: 'End-to-end chain from Business Goal → Product Goal → KPI → User Story → FR → Acceptance → Flow → MVP.',
    content: [
      {
        subtitle: '23.1 Traceability Chain Matrix',
        table: {
          headers: ['Business Goal', 'Product Goal', 'KPI', 'FRs', 'Acceptance Evidence', 'Flow'],
          rows: [
            ['Affordable discovery', 'Reduce comparison effort', 'Search-to-detail; comparison engagement', 'FR-SEARCH-04/05; FR-CORE-03/04', 'Filters/sorts and normalized price deterministic', 'Customer Flow'],
            ['Trustworthy ranking', 'Understandable/safe ranking', 'Recommendation satisfaction; complaints', 'FR-CORE-01/02/05/07', 'Reproducible ranking; factors shown; unsafe claims blocked', 'Customer Flow'],
            ['Completed transactions', 'Reliable purchase', 'Checkout conversion; completion', 'FR-CART-01/03; FR-PAY-01-05; FR-ORDER-01-05', 'Revalidation; payment verification; one order', 'Customer + Payment Failure'],
            ['Supply reliability', 'Accurate partner data', 'Stock accuracy; price freshness', 'FR-PART-01-05', 'Permitted updates and audit', 'Partner Flow'],
            ['Marketplace governance', 'Controlled operations', 'Security/audit metrics', 'FR-ADM-01-06', 'Sensitive actions restricted/audited', 'Admin Flow']
          ]
        }
      }
    ]
  },
  {
    id: 'sec-24',
    number: '24',
    title: 'Glossary',
    summary: 'Standardized terminology and definitions for domain concepts used throughout genericMed.',
    content: [
      {
        subtitle: '24.1 Key Definitions',
        table: {
          headers: ['Term', 'Definition'],
          rows: [
            ['Canonical Product', 'Normalized product identity used consistently across marketplace listings.'],
            ['Listing', 'Partner-specific sellable representation of a canonical product.'],
            ['Requirement Set', 'Structured representation of customer constraints/preferences used for discovery.'],
            ['Hard Constraint', 'Mandatory requirement a product must satisfy to be eligible.'],
            ['Soft Preference', 'Desirable preference used to rank eligible options but not exclude them.'],
            ['Ranking', 'Ordered presentation of eligible listings using approved rules.'],
            ['Recommendation', 'System-generated marketplace match indication, not a clinical prescription.'],
            ['Normalized Price', 'Price adjusted to a common unit/quantity when valid quantity data exists.'],
            ['Eligibility', 'Rule-based determination that a listing can be shown or purchased.'],
            ['Marketplace', 'Digital environment connecting customers with approved sellers/partners.'],
            ['Partner', 'Authorized business entity publishing listings and/or fulfilling orders.'],
            ['Order State', 'Defined stage in an order lifecycle.'],
            ['Idempotency', 'Repeated logical requests do not create unintended duplicate effects.'],
            ['Reconciliation', 'Process for resolving differences between internal and external transaction state.'],
            ['Guardrail Metric', 'Metric that must not materially worsen while optimizing another metric.'],
            ['SLA', 'Service Level Agreement defining expected service/operational standards.'],
            ['RBAC', 'Role-Based Access Control.'],
            ['NFR', 'Non-Functional Requirement.'],
            ['North Star Metric', 'Single primary metric representing core product value (CQMO).']
          ]
        }
      }
    ]
  },
  {
    id: 'sec-25',
    number: '25',
    title: 'Final Quality-Control Checklist & Review Gate',
    summary: 'Comprehensive 18-point verification checklist and Stakeholder Review Gate criteria.',
    content: [
      {
        subtitle: '25.1 Quality-Control Checklist',
        bullets: [
          'Major user types identified: customers, partners/medical stores, suppliers/catalog partners, admin/operations.',
          'Core customer value loop is defined from requirement capture through completed order.',
          'Medicine-safety boundary is explicit: marketplace comparison is not a substitute for clinical judgment.',
          'Every functional requirement has a unique ID, priority and testable acceptance criteria.',
          'P0 requirements are represented in MVP and Phase 1 roadmap.',
          'Search, ranking, comparison, cart, payment, order and partner workflows are covered.',
          'Invalid input, empty states, unauthorized access, duplicate actions, network failures and third-party failures are addressed.',
          'Payment verification and order reconciliation are explicit.',
          'Price and stock are revalidated before order creation.',
          'Role-based permissions and sensitive administrative actions are defined.',
          'NFRs include measurable performance, availability, security, privacy, accessibility and observability expectations.',
          'Data entities and lifecycle relationships are documented conceptually.',
          'Integrations are described without inventing providers.',
          'Analytics events support KPIs and the core funnel.',
          'Auditability is defined for sensitive actions.',
          'Risks include product, operational, security, business, compliance and dependency concerns.',
          'Launch geography, business model and other critical unresolved decisions are listed as open questions.'
        ]
      },
      {
        subtitle: '25.2 Stakeholder Review Gate',
        paragraphs: [
          'Before engineering estimates become committed, stakeholders should resolve launch geography, operating model, product eligibility rules, partner/fulfillment model, commercial model, payment approach, catalog authority and compliance review. Once decided, version this PRD and update affected requirements, KPIs, NFRs and roadmap items.'
        ]
      }
    ]
  }
];
