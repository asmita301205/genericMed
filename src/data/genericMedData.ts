import {
  CanonicalProduct,
  ProductListing,
  OrderRecord,
  AuditRecord,
  OperationalException,
  UserProfile,
  PrescriptionRecord,
  ChronicSubscription,
  ProductReview,
  MedicineBatchRecord,
  SupportTicket,
  PharmacyGeoLocation,
  DispatchRouteEstimate,
  PartnerAnalyticsSummary,
  DoctorProfile,
  NationalErpConnector,
  MultiWarehouseSplitShipment,
  SupportedCurrency,
  SupportedLanguage,
  CurrencyConfig,
  DrugInteractionAlert
} from '../types';

export const CANONICAL_PRODUCTS: CanonicalProduct[] = [
  {
    id: 'prod-para-500',
    canonicalName: 'Paracetamol IP 500mg',
    genericSalt: 'Paracetamol / Acetaminophen',
    therapeuticClass: 'Analgesics & Antipyretics',
    strength: '500mg',
    dosageForm: 'Oral Tablet',
    prescriptionRequired: false,
    commonBrandEquivalent: 'Crocin / Calpol 500mg',
    brandPriceRef: 3.20, // branded price per tab
    description: 'First-line medication used to treat pain and fever. Normalized comparison evaluates equivalent generic salt bio-equivalence.',
    manufacturer: 'Cipla Therapeutics Ltd / Jan Aushadhi Certified',
    drugSchedule: 'OTC (Over The Counter)',
    storageGuidelines: 'Store below 25°C in a dry place away from direct sunlight.',
    precautions: [
      'Do not exceed 4,000 mg per 24-hour period to prevent hepatic toxicity.',
      'Avoid concurrent alcohol consumption.',
      'Consult physician if fever persists beyond 3 days.'
    ],
    sideEffects: ['Mild nausea', 'Rash (rare)', 'Liver enzyme elevation with excessive dosage'],
    contraindications: ['Severe active liver impairment', 'Known hypersensitivity to acetaminophen']
  },
  {
    id: 'prod-para-650',
    canonicalName: 'Paracetamol IP 650mg',
    genericSalt: 'Paracetamol / Acetaminophen',
    therapeuticClass: 'Analgesics & Antipyretics',
    strength: '650mg',
    dosageForm: 'Oral Tablet',
    prescriptionRequired: false,
    commonBrandEquivalent: 'Dolo 650mg',
    brandPriceRef: 4.10,
    description: 'Higher strength paracetamol formulation for moderate fever, body aches, and discomfort.',
    manufacturer: 'Micro Labs BioGenerics Division',
    drugSchedule: 'OTC (Over The Counter)',
    storageGuidelines: 'Store below 30°C in moisture-resistant blister packaging.',
    precautions: [
      'Spacing must be at least 4 to 6 hours between tablets.',
      'Do not combine with other paracetamol-containing cold/flu syrups.'
    ],
    sideEffects: ['Mild abdominal discomfort', 'Sweating during fever defervescence'],
    contraindications: ['Chronic hepatic failure', 'Severe renal impairment']
  },
  {
    id: 'prod-metformin-500',
    canonicalName: 'Metformin Hydrochloride ER 500mg',
    genericSalt: 'Metformin Hydrochloride (Extended Release)',
    therapeuticClass: 'Anti-diabetic Agents (Biguanides)',
    strength: '500mg',
    dosageForm: 'Extended Release Tablet',
    prescriptionRequired: true,
    commonBrandEquivalent: 'Glycomet 500 SR',
    brandPriceRef: 3.80,
    description: 'Primary oral medication for type-2 diabetes mellitus management. Regulates hepatic glucose synthesis.',
    manufacturer: 'Sun Pharma Generic Formulations',
    drugSchedule: 'Schedule H (Prescription Required)',
    storageGuidelines: 'Store between 15°C and 30°C. Protect from high humidity.',
    precautions: [
      'Must be swallowed whole; do not crush, chew, or split extended-release tablet.',
      'Take with the evening meal to reduce gastrointestinal discomfort.',
      'Periodic monitoring of renal function (eGFR) is mandatory.'
    ],
    sideEffects: ['Gastrointestinal upset', 'Transient diarrhea', 'Metallic taste', 'Vitamin B12 deficiency with prolonged use'],
    contraindications: ['Severe renal dysfunction (eGFR < 30 mL/min)', 'Acute metabolic acidosis / ketoacidosis']
  },
  {
    id: 'prod-atorva-20',
    canonicalName: 'Atorvastatin Calcium 20mg',
    genericSalt: 'Atorvastatin Calcium',
    therapeuticClass: 'HMG-CoA Reductase Inhibitors (Statins)',
    strength: '20mg',
    dosageForm: 'Film-Coated Tablet',
    prescriptionRequired: true,
    commonBrandEquivalent: 'Lipitor / Atorva 20mg',
    brandPriceRef: 18.50,
    description: 'Lipid-lowering agent prescribed to lower LDL cholesterol and decrease cardiovascular risks.',
    manufacturer: 'Zydus Cadila Healthcare',
    drugSchedule: 'Schedule H (Prescription Required)',
    storageGuidelines: 'Store at 20°C to 25°C. Keep container tightly closed.',
    precautions: [
      'Report any unexplained muscle pain, tenderness, or weakness immediately (rhabdomyolysis warning).',
      'Avoid large quantities of grapefruit juice while on therapy.'
    ],
    sideEffects: ['Myalgia', 'Mild headache', 'Transient elevation in serum transaminases'],
    contraindications: ['Active liver disease', 'Pregnancy and lactation']
  },
  {
    id: 'prod-cetirizine-10',
    canonicalName: 'Cetirizine Dihydrochloride 10mg',
    genericSalt: 'Cetirizine Dihydrochloride',
    therapeuticClass: 'Second-Generation Antihistamines',
    strength: '10mg',
    dosageForm: 'Oral Tablet',
    prescriptionRequired: false,
    commonBrandEquivalent: 'Zyrtec / Cetzine 10mg',
    brandPriceRef: 6.40,
    description: 'Anti-allergy medication relieving allergic rhinitis, watery eyes, sneezing, and pruritus without excessive sedation.',
    manufacturer: 'Dr. Reddy’s Laboratories',
    drugSchedule: 'OTC (Over The Counter)',
    storageGuidelines: 'Store below 25°C in a dry place.',
    precautions: [
      'Caution when operating machinery or driving if mild drowsiness occurs.',
      'Limit alcohol intake during treatment.'
    ],
    sideEffects: ['Mild drowsiness', 'Dry mouth', 'Headache'],
    contraindications: ['Severe end-stage renal disease', 'Known cetirizine hypersensitivity']
  },
  {
    id: 'prod-amox-625',
    canonicalName: 'Amoxicillin & Potassium Clavulanate 625mg',
    genericSalt: 'Amoxicillin 500mg + Clavulanic Acid 125mg',
    therapeuticClass: 'Beta-lactam Antibiotics',
    strength: '625mg',
    dosageForm: 'Film-Coated Tablet',
    prescriptionRequired: true,
    commonBrandEquivalent: 'Augmentin 625 Duo',
    brandPriceRef: 24.50,
    description: 'Broad-spectrum antibiotic combining penicillin-derived amoxicillin with a beta-lactamase inhibitor.',
    manufacturer: 'Alkem Laboratories Quality Generics',
    drugSchedule: 'Schedule H1 (Controlled Antibiotic - Mandatory Rx)',
    storageGuidelines: 'Store below 25°C in moisture-proof packaging. Discard if discolored.',
    precautions: [
      'Complete the entire prescribed course even if symptoms resolve early.',
      'Take at the start of a meal to enhance absorption and reduce GI irritation.'
    ],
    sideEffects: ['Nausea', 'Mild diarrhea', 'Skin rash or urticaria'],
    contraindications: ['History of penicillin anaphylaxis or amoxicillin-associated cholestatic jaundice']
  }
];

export const PRODUCT_LISTINGS: ProductListing[] = [
  // Paracetamol 500mg listings
  {
    id: 'list-para-medplus',
    productId: 'prod-para-500',
    partnerId: 'partner-medplus',
    partnerName: 'MedPlus Care Pharmacy',
    partnerRating: 4.8,
    partnerLocation: 'North Hub • 1.4 km',
    packQuantity: 10,
    packPrice: 7.00,
    normalizedUnitPrice: 0.70,
    unitLabel: 'tablet',
    stockCount: 140,
    isAvailable: true,
    freshnessTimestamp: 'Updated 12 mins ago',
    isStale: false,
    rankScore: 94,
    rankFactors: {
      priceScore: 96,
      trustScore: 95,
      availabilityScore: 98,
      feedbackScore: 90,
      explanation: 'Ranked #1: Lowest price per tablet (₹0.70/tab, 78% savings vs Crocin), verified stock in high quantity, and 4.8★ fulfillment SLA.'
    }
  },
  {
    id: 'list-para-jan-aushadhi',
    productId: 'prod-para-500',
    partnerId: 'partner-janaushadhi',
    partnerName: 'Jan Aushadhi Partner Kendra',
    partnerRating: 4.6,
    partnerLocation: 'Civil Lines • 2.8 km',
    packQuantity: 15,
    packPrice: 9.75,
    normalizedUnitPrice: 0.65,
    unitLabel: 'tablet',
    stockCount: 65,
    isAvailable: true,
    freshnessTimestamp: 'Updated 25 mins ago',
    isStale: false,
    rankScore: 92,
    rankFactors: {
      priceScore: 99,
      trustScore: 89,
      availabilityScore: 90,
      feedbackScore: 88,
      explanation: 'Ultra-low unit price (₹0.65/tab). Slightly lower stock depth than #1 rank.'
    }
  },
  {
    id: 'list-para-apollo',
    productId: 'prod-para-500',
    partnerId: 'partner-apollo',
    partnerName: 'Apollo Green Health Chemist',
    partnerRating: 4.9,
    partnerLocation: 'South Plaza • 3.2 km',
    packQuantity: 20,
    packPrice: 18.00,
    normalizedUnitPrice: 0.90,
    unitLabel: 'tablet',
    stockCount: 220,
    isAvailable: true,
    freshnessTimestamp: 'Updated 5 mins ago',
    isStale: false,
    rankScore: 89,
    rankFactors: {
      priceScore: 85,
      trustScore: 98,
      availabilityScore: 99,
      feedbackScore: 95,
      explanation: 'Highest partner trust (4.9★), rapid delivery dispatch. Unit price is slightly higher (₹0.90/tab).'
    }
  },

  // Paracetamol 650mg listings
  {
    id: 'list-para650-medplus',
    productId: 'prod-para-650',
    partnerId: 'partner-medplus',
    partnerName: 'MedPlus Care Pharmacy',
    partnerRating: 4.8,
    partnerLocation: 'North Hub • 1.4 km',
    packQuantity: 15,
    packPrice: 16.50,
    normalizedUnitPrice: 1.10,
    unitLabel: 'tablet',
    stockCount: 88,
    isAvailable: true,
    freshnessTimestamp: 'Updated 8 mins ago',
    isStale: false,
    rankScore: 93,
    rankFactors: {
      priceScore: 95,
      trustScore: 94,
      availabilityScore: 96,
      feedbackScore: 91,
      explanation: 'Ranked #1: Normalized ₹1.10/tablet vs ₹4.10/tab Dolo 650 (73% savings). Fresh stock verified.'
    }
  },
  {
    id: 'list-para650-apollo',
    productId: 'prod-para-650',
    partnerId: 'partner-apollo',
    partnerName: 'Apollo Green Health Chemist',
    partnerRating: 4.9,
    partnerLocation: 'South Plaza • 3.2 km',
    packQuantity: 10,
    packPrice: 13.00,
    normalizedUnitPrice: 1.30,
    unitLabel: 'tablet',
    stockCount: 150,
    isAvailable: true,
    freshnessTimestamp: 'Updated 18 mins ago',
    isStale: false,
    rankScore: 90,
    rankFactors: {
      priceScore: 88,
      trustScore: 98,
      availabilityScore: 97,
      feedbackScore: 94,
      explanation: 'Top reliability and instant express delivery.'
    }
  },

  // Metformin 500mg ER listings
  {
    id: 'list-met-genericcare',
    productId: 'prod-metformin-500',
    partnerId: 'partner-genericcare',
    partnerName: 'GenericCare Express Chemist',
    partnerRating: 4.7,
    partnerLocation: 'West Center • 2.1 km',
    packQuantity: 20,
    packPrice: 22.00,
    normalizedUnitPrice: 1.10,
    unitLabel: 'tablet',
    stockCount: 310,
    isAvailable: true,
    freshnessTimestamp: 'Updated 10 mins ago',
    isStale: false,
    rankScore: 95,
    rankFactors: {
      priceScore: 97,
      trustScore: 93,
      availabilityScore: 98,
      feedbackScore: 91,
      explanation: 'Ranked #1: Outstanding unit price ₹1.10/tab (71% savings vs Glycomet 500 SR), verified prescription verification workflow.'
    }
  },
  {
    id: 'list-met-medplus',
    productId: 'prod-metformin-500',
    partnerId: 'partner-medplus',
    partnerName: 'MedPlus Care Pharmacy',
    partnerRating: 4.8,
    partnerLocation: 'North Hub • 1.4 km',
    packQuantity: 10,
    packPrice: 13.50,
    normalizedUnitPrice: 1.35,
    unitLabel: 'tablet',
    stockCount: 95,
    isAvailable: true,
    freshnessTimestamp: 'Updated 45 mins ago',
    isStale: false,
    rankScore: 88,
    rankFactors: {
      priceScore: 89,
      trustScore: 95,
      availabilityScore: 92,
      feedbackScore: 89,
      explanation: 'Solid partner with consistent batch track-and-trace.'
    }
  },

  // Atorvastatin 20mg listings
  {
    id: 'list-atorva-apollo',
    productId: 'prod-atorva-20',
    partnerId: 'partner-apollo',
    partnerName: 'Apollo Green Health Chemist',
    partnerRating: 4.9,
    partnerLocation: 'South Plaza • 3.2 km',
    packQuantity: 10,
    packPrice: 58.00,
    normalizedUnitPrice: 5.80,
    unitLabel: 'tablet',
    stockCount: 60,
    isAvailable: true,
    freshnessTimestamp: 'Updated 14 mins ago',
    isStale: false,
    rankScore: 96,
    rankFactors: {
      priceScore: 94,
      trustScore: 99,
      availabilityScore: 95,
      feedbackScore: 96,
      explanation: 'Ranked #1: Massive 69% savings (₹5.80/tab vs ₹18.50/tab branded Lipitor). 4.9★ partner rating with climate-controlled storage.'
    }
  },
  {
    id: 'list-atorva-janaushadhi',
    productId: 'prod-atorva-20',
    partnerId: 'partner-janaushadhi',
    partnerName: 'Jan Aushadhi Partner Kendra',
    partnerRating: 4.6,
    partnerLocation: 'Civil Lines • 2.8 km',
    packQuantity: 10,
    packPrice: 42.00,
    normalizedUnitPrice: 4.20,
    unitLabel: 'tablet',
    stockCount: 18, // low stock
    isAvailable: true,
    freshnessTimestamp: 'Updated 2 hours ago',
    isStale: false,
    rankScore: 87,
    rankFactors: {
      priceScore: 99,
      trustScore: 88,
      availabilityScore: 78,
      feedbackScore: 85,
      explanation: 'Cheapest unit cost (₹4.20/tab), but low inventory remaining.'
    }
  },

  // Cetirizine 10mg listings
  {
    id: 'list-cetz-medplus',
    productId: 'prod-cetirizine-10',
    partnerId: 'partner-medplus',
    partnerName: 'MedPlus Care Pharmacy',
    partnerRating: 4.8,
    partnerLocation: 'North Hub • 1.4 km',
    packQuantity: 10,
    packPrice: 15.00,
    normalizedUnitPrice: 1.50,
    unitLabel: 'tablet',
    stockCount: 180,
    isAvailable: true,
    freshnessTimestamp: 'Updated 7 mins ago',
    isStale: false,
    rankScore: 94,
    rankFactors: {
      priceScore: 95,
      trustScore: 95,
      availabilityScore: 97,
      feedbackScore: 92,
      explanation: 'Ranked #1: 76% price savings vs branded Cetzine (₹1.50 vs ₹6.40). Immediate OTC fulfillment.'
    }
  },

  // Amoxicillin + Clavulanic Acid listings
  {
    id: 'list-amox-genericcare',
    productId: 'prod-amox-625',
    partnerId: 'partner-genericcare',
    partnerName: 'GenericCare Express Chemist',
    partnerRating: 4.7,
    partnerLocation: 'West Center • 2.1 km',
    packQuantity: 10,
    packPrice: 110.00,
    normalizedUnitPrice: 11.00,
    unitLabel: 'tablet',
    stockCount: 42,
    isAvailable: true,
    freshnessTimestamp: 'Updated 22 mins ago',
    isStale: false,
    rankScore: 93,
    rankFactors: {
      priceScore: 93,
      trustScore: 94,
      availabilityScore: 92,
      feedbackScore: 93,
      explanation: 'Ranked #1: ₹11.00/tablet vs ₹24.50 branded Augmentin 625 Duo (55% savings). Prescription verification mandatory.'
    }
  }
];

export const INITIAL_ORDERS: OrderRecord[] = [
  {
    id: 'ORD-2026-9044',
    customerName: 'Aarav Sharma',
    customerEmail: 'aarav.sharma@example.com',
    items: [
      {
        listingId: 'list-para-medplus',
        listing: PRODUCT_LISTINGS[0],
        canonicalProduct: CANONICAL_PRODUCTS[0],
        quantity: 2
      },
      {
        listingId: 'list-metformin-apollo',
        listing: PRODUCT_LISTINGS[3],
        canonicalProduct: CANONICAL_PRODUCTS[1],
        quantity: 1
      },
      {
        listingId: 'list-atorva-apollo',
        listing: PRODUCT_LISTINGS[6],
        canonicalProduct: CANONICAL_PRODUCTS[3],
        quantity: 2
      }
    ],
    totalAmount: 162.00,
    status: 'Out for Delivery',
    paymentStatus: 'Verified Paid',
    createdAt: 'Today at 10:15 AM',
    deliveryAddress: 'Flat 402, Greenfield Residences, Sector 14, Gurugram',
    deliveryPin: '4892',
    appliedCurrency: 'INR',
    appliedLanguage: 'en',
    trackingTimeline: [
      { status: 'Order Created & Multi-Warehouse Routing Evaluated', timestamp: '10:15 AM', completed: true },
      { status: 'Split-Shipment Initiated across 2 Specialized Depots', timestamp: '10:16 AM', completed: true },
      { status: 'Shipment 1: Local Chemist Dispatched (30m ETA)', timestamp: '10:28 AM', completed: true },
      { status: 'Shipment 2: Jan Aushadhi National Cold-Chain Dispatched', timestamp: '10:35 AM', completed: true },
      { status: 'Delivery in Progress with Real-Time Telemetry', timestamp: '10:45 AM', completed: false }
    ],
    splitShipments: [
      {
        shipmentId: 'SPLIT-9044-A',
        originType: 'Local Express Chemist',
        originName: 'MedPlus Care Pharmacy (North Hub)',
        items: [
          {
            listingId: 'list-para-medplus',
            listing: PRODUCT_LISTINGS[0],
            canonicalProduct: CANONICAL_PRODUCTS[0],
            quantity: 2
          }
        ],
        subtotal: 14.00,
        estimatedDeliveryMinutes: 25,
        courierFleetType: 'Electric Two-Wheeler',
        status: 'In Transit',
        handoverPin: '4892',
        tempStatus: 'Optimal Ambient (21.4°C)'
      },
      {
        shipmentId: 'SPLIT-9044-B',
        originType: 'National Central Warehouse',
        originName: 'Jan Aushadhi PMBI Central Depot (Zone 1)',
        items: [
          {
            listingId: 'list-metformin-apollo',
            listing: PRODUCT_LISTINGS[3],
            canonicalProduct: CANONICAL_PRODUCTS[1],
            quantity: 1
          },
          {
            listingId: 'list-atorva-apollo',
            listing: PRODUCT_LISTINGS[6],
            canonicalProduct: CANONICAL_PRODUCTS[3],
            quantity: 2
          }
        ],
        subtotal: 148.00,
        estimatedDeliveryMinutes: 180,
        courierFleetType: 'Cold-Chain Temperature Controlled Van',
        status: 'In Transit',
        handoverPin: '7125',
        tempStatus: 'Safe Cold-Chain (4.2°C GDP Certified)'
      }
    ]
  },
  {
    id: 'ORD-2026-8821',
    customerName: 'Aarav Sharma',
    customerEmail: 'aarav.sharma@example.com',
    items: [
      {
        listingId: 'list-para-medplus',
        listing: PRODUCT_LISTINGS[0],
        canonicalProduct: CANONICAL_PRODUCTS[0],
        quantity: 2
      }
    ],
    totalAmount: 14.00,
    status: 'Out for Delivery',
    paymentStatus: 'Verified Paid',
    createdAt: 'Today at 09:15 AM',
    deliveryAddress: 'Flat 402, Greenfield Residences, Sector 14',
    deliveryPin: '3184',
    trackingTimeline: [
      { status: 'Order Created & Constraints Validated', timestamp: '09:15 AM', completed: true },
      { status: 'Payment Reconciled & Verified', timestamp: '09:16 AM', completed: true },
      { status: 'Accepted by MedPlus Pharmacy', timestamp: '09:25 AM', completed: true },
      { status: 'Dispensed & Sealed with Quality Audit', timestamp: '09:40 AM', completed: true },
      { status: 'Out for Delivery (Courier Assigned)', timestamp: '10:05 AM', completed: true },
      { status: 'Delivered to Customer', timestamp: 'Expected 10:45 AM', completed: false }
    ]
  },
  {
    id: 'ORD-2026-8794',
    customerName: 'Priya Sundaram',
    customerEmail: 'priya.sundaram@example.com',
    items: [
      {
        listingId: 'list-atorva-apollo',
        listing: PRODUCT_LISTINGS[6],
        canonicalProduct: CANONICAL_PRODUCTS[3],
        quantity: 3
      }
    ],
    totalAmount: 174.00,
    status: 'Completed',
    paymentStatus: 'Verified Paid',
    createdAt: 'Yesterday at 04:30 PM',
    deliveryAddress: 'House 18, Lakeview Enclave',
    trackingTimeline: [
      { status: 'Order Created & Constraints Validated', timestamp: '04:30 PM', completed: true },
      { status: 'Payment Reconciled & Verified', timestamp: '04:31 PM', completed: true },
      { status: 'Prescription Verified by Licensed Pharmacist', timestamp: '04:45 PM', completed: true },
      { status: 'Accepted & Dispatched by Apollo Chemist', timestamp: '05:10 PM', completed: true },
      { status: 'Delivered to Customer', timestamp: '06:05 PM', completed: true }
    ]
  }
];

export const INITIAL_AUDIT_LOGS: AuditRecord[] = [
  {
    id: 'AUD-901',
    actorId: 'admin-sarah',
    actorRole: 'Admin / Operations',
    timestamp: '2026-09-08 08:30:12',
    actionType: 'PARTNER_APPROVAL',
    entityType: 'Partner',
    entityId: 'partner-medplus',
    previousState: 'Under Review',
    newState: 'Approved',
    reason: 'Drug license verified with state pharmacy council registry.',
    correlationId: 'req-appr-7721',
    sourceContext: 'Admin Portal'
  },
  {
    id: 'AUD-902',
    actorId: 'system-reconciler',
    actorRole: 'Automated Job',
    timestamp: '2026-09-08 09:16:04',
    actionType: 'PAYMENT_RECONCILED',
    entityType: 'Payment / Order',
    entityId: 'ORD-2026-8821',
    previousState: 'Pending',
    newState: 'Verified Paid',
    reason: 'Idempotent webhook callback matched transaction token in banking gateway.',
    correlationId: 'pay-tx-55109',
    sourceContext: 'Payment Integration'
  },
  {
    id: 'AUD-903',
    actorId: 'partner-operator-raj',
    actorRole: 'Partner Staff',
    timestamp: '2026-09-08 09:25:30',
    actionType: 'ORDER_FULFILLMENT_ACCEPT',
    entityType: 'Order',
    entityId: 'ORD-2026-8821',
    previousState: 'Paid/Confirmed',
    newState: 'Accepted by Partner',
    reason: 'Physical batch inventory verified and allocated.',
    correlationId: 'ord-fulfill-339',
    sourceContext: 'Partner Portal'
  },
  {
    id: 'AUD-904',
    actorId: 'admin-lead-arun',
    actorRole: 'Product Admin',
    timestamp: '2026-09-08 07:15:00',
    actionType: 'RANKING_WEIGHT_CONFIG',
    entityType: 'Ranking Configuration',
    entityId: 'cfg-rank-v1.4',
    previousState: 'v1.3 (Price 50%, Trust 20%)',
    newState: 'v1.4 (Price 40%, Trust 25%, Stock 20%, Feedback 15%)',
    reason: 'Approved per PRD FR-CORE-06 and Stakeholder Review Gate.',
    correlationId: 'cfg-audit-0081',
    sourceContext: 'Admin Governance'
  }
];

export const INITIAL_EXCEPTIONS: OperationalException[] = [
  {
    id: 'EXC-101',
    type: 'stock_mismatch',
    title: 'Checkout Revalidation Stock Shortage Flag',
    description: 'A customer attempted cart checkout for Atorvastatin 20mg at Jan Aushadhi, but real-time revalidation found only 2 packs remaining against 3 requested.',
    entityId: 'list-atorva-janaushadhi',
    severity: 'medium',
    status: 'open',
    timestamp: '15 mins ago',
    resolutionOptions: [
      'Offer alternative approved partner with matching unit price',
      'Auto-adjust cart quantity to available inventory',
      'Notify customer with safe adjustment guidance'
    ]
  },
  {
    id: 'EXC-102',
    type: 'stale_catalog',
    title: 'Partner Price Freshness SLA Overdue',
    description: 'GenericCare Express has not confirmed pricing updates for Omeprazole 20mg listings within the required 24-hour SLA window.',
    entityId: 'partner-genericcare',
    severity: 'medium',
    status: 'investigating',
    timestamp: '42 mins ago',
    resolutionOptions: [
      'Temporarily de-prioritize listing from #1 ranking slot',
      'Send automated refresh ping to partner operations webhook',
      'Require partner verification before order acceptance'
    ]
  }
];

// Phase 1 MVP: Seed User Profile (FR-AUTH-01 to 04)
export const DEFAULT_USER_PROFILE: UserProfile = {
  id: 'usr-aarav-sharma',
  name: 'Aarav Sharma',
  email: 'aarav.sharma@example.com',
  phone: '+91 98765 43210',
  role: 'customer',
  verified: true,
  defaultAddressId: 'addr-home',
  activePrescriptionIds: ['rx-metformin-chronic'],
  addresses: [
    {
      id: 'addr-home',
      label: 'Home',
      recipientName: 'Aarav Sharma',
      phone: '+91 98765 43210',
      street: 'Flat 402, Greenfield Residences, Sector 14',
      city: 'Gurugram, Haryana',
      pincode: '122001',
      isDefault: true
    },
    {
      id: 'addr-office',
      label: 'Office',
      recipientName: 'Aarav Sharma',
      phone: '+91 98765 43210',
      street: 'Tech Park Tower 4, Cyber City Phase 2',
      city: 'Gurugram, Haryana',
      pincode: '122002',
      isDefault: false
    }
  ]
};

// Phase 1 MVP: Verified Sample Prescriptions for AI OCR Demonstration (FR-SEARCH-05, FR-CART-02)
export const SAMPLE_PRESCRIPTIONS: PrescriptionRecord[] = [
  {
    id: 'rx-metformin-chronic',
    userId: 'usr-aarav-sharma',
    patientName: 'Aarav Sharma (Age: 42, Male)',
    doctorName: 'Dr. Priya Kulkarni, MD (General Medicine)',
    doctorRegNumber: 'KMC-Reg-48291',
    issueDate: '01 Sep 2026',
    validUntil: '01 Mar 2027',
    imageUrl: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=800&q=80',
    rawOcrText: `CLINICAL RX CARE HOSPITAL
Dr. Priya Kulkarni, MD, Reg #48291
Patient: Aarav Sharma, 42M | Date: 01-Sep-2026
Dx: Type 2 Diabetes Mellitus / Dyslipidemia
Rx:
1. Metformin Hydrochloride ER 500mg - 1 tab OD after dinner x 90 days.
2. Atorvastatin Calcium 20mg - 1 tab OD at bedtime x 90 days.
*Generic equivalent substitution permitted.`,
    extractedEntities: {
      patientName: 'Aarav Sharma',
      doctorName: 'Dr. Priya Kulkarni',
      doctorRegNumber: 'KMC-Reg-48291',
      prescriptionDate: '2026-09-01',
      isExpired: false,
      prescribedSalts: [
        {
          saltName: 'Metformin Hydrochloride (Extended Release)',
          dosage: '500mg',
          frequency: '1 tab OD',
          duration: '90 days',
          matchesGenericSalt: true
        },
        {
          saltName: 'Atorvastatin Calcium',
          dosage: '20mg',
          frequency: '1 tab OD',
          duration: '90 days',
          matchesGenericSalt: true
        }
      ]
    },
    status: 'verified',
    confidenceScore: 98,
    validationNotes: [
      'Prescription authentic and digitally matched to certified medical practitioner.',
      'Active salts match genericMed canonical catalog (Metformin ER 500mg & Atorvastatin 20mg).',
      'Valid for 180 days chronic maintenance dispensing.'
    ]
  },
  {
    id: 'rx-amox-acute',
    userId: 'usr-aarav-sharma',
    patientName: 'Aarav Sharma (Age: 42, Male)',
    doctorName: 'Dr. Rajesh Sen, MBBS, DLO (ENT Specialist)',
    doctorRegNumber: 'DMC-Reg-19842',
    issueDate: '07 Sep 2026',
    validUntil: '14 Sep 2026',
    imageUrl: 'https://images.unsplash.com/photo-1576602976047-174e57a47881?auto=format&fit=crop&w=800&q=80',
    rawOcrText: `APEX HEALTHCARE POLYCLINIC
Dr. Rajesh Sen, MBBS, DLO, Reg #19842
Patient: Aarav Sharma | Date: 07-Sep-2026
Dx: Acute Bacterial Sinusitis
Rx:
1. Amoxicillin & Clavulanate 625mg - 1 tab BD x 5 days (Schedule H1).
2. Paracetamol 650mg - 1 tab SOS for fever/pain.`,
    extractedEntities: {
      patientName: 'Aarav Sharma',
      doctorName: 'Dr. Rajesh Sen',
      doctorRegNumber: 'DMC-Reg-19842',
      prescriptionDate: '2026-09-07',
      isExpired: false,
      prescribedSalts: [
        {
          saltName: 'Amoxicillin 500mg + Clavulanic Acid 125mg',
          dosage: '625mg',
          frequency: '1 tab BD',
          duration: '5 days',
          matchesGenericSalt: true
        },
        {
          saltName: 'Paracetamol / Acetaminophen',
          dosage: '650mg',
          frequency: '1 tab SOS',
          duration: '5 days',
          matchesGenericSalt: true
        }
      ]
    },
    status: 'verified',
    confidenceScore: 96,
    validationNotes: [
      'Schedule H1 antibiotic prescription verified.',
      'Prescribed course validated for immediate pharmacy dispatch.'
    ]
  }
];

// Phase 2: Chronic Auto-Refill Subscriptions (Persona B)
export const SAMPLE_SUBSCRIPTIONS: ChronicSubscription[] = [
  {
    id: 'sub-metformin-01',
    userId: 'usr-aarav-sharma',
    canonicalProduct: CANONICAL_PRODUCTS[1], // Metformin ER 500mg
    listing: PRODUCT_LISTINGS[3], // MedPlus Metformin (₹0.55/tab)
    quantity: 2, // 2 packs of 30 = 60 tabs
    intervalDays: 30,
    startDate: '10 Aug 2026',
    nextRefillDate: '10 Sep 2026',
    status: 'active',
    deliveryAddress: 'Flat 402, Greenfield Residences, Sector 14, Gurugram',
    monthlySavings: 282.00,
    autoPayMethod: 'UPI AutoPay',
    refillCount: 2
  },
  {
    id: 'sub-atorva-02',
    userId: 'usr-aarav-sharma',
    canonicalProduct: CANONICAL_PRODUCTS[2], // Atorvastatin 20mg
    listing: PRODUCT_LISTINGS[6], // MedPlus Atorvastatin
    quantity: 2, // 2 packs of 15 = 30 tabs
    intervalDays: 60,
    startDate: '15 Jul 2026',
    nextRefillDate: '15 Sep 2026',
    status: 'active',
    deliveryAddress: 'Flat 402, Greenfield Residences, Sector 14, Gurugram',
    monthlySavings: 310.00,
    autoPayMethod: 'Card Vault Token',
    refillCount: 1
  }
];

// Phase 2: Verified Patient Reviews with Regulatory Clinical Disclaimers
export const SAMPLE_REVIEWS: ProductReview[] = [
  {
    id: 'rev-pcm-01',
    productId: 'prod-para-500',
    productName: 'Paracetamol IP 500mg',
    authorName: 'Sunita Patel',
    authorLocation: 'New Delhi',
    rating: 5,
    date: '04 Sep 2026',
    isVerifiedPurchase: true,
    title: 'Exact same relief as Crocin at 1/4th the price',
    comment: 'I have been using Crocin for tension headaches for years. Switched to Jan Aushadhi Paracetamol 500mg on doctor recommendation. Zero difference in efficacy, worked in 25 minutes, and saved over 75% on the strip!',
    conditionTreated: 'Fever & Tension Headache',
    clinicalFeedbackTags: ['Exact bio-equivalent to Crocin', 'Fast acting (<30m)', '78% Cost Savings'],
    helpfulCount: 42,
    status: 'approved',
    pharmacistVerifiedNote: 'Verified bio-equivalent formulation manufactured in WHO-GMP certified facility.'
  },
  {
    id: 'rev-met-02',
    productId: 'prod-met-500',
    productName: 'Metformin Hydrochloride ER 500mg',
    authorName: 'Ramesh Verma',
    authorLocation: 'Gurugram',
    rating: 5,
    date: '28 Aug 2026',
    isVerifiedPurchase: true,
    title: 'Gentle on stomach, HbA1c under control',
    comment: 'Extended release formula is smooth with no nausea or gastric irritation. My fasting glucose remains steady at 108 mg/dL. Monthly recurring subscription delivers right on time.',
    conditionTreated: 'Type-2 Diabetes Mellitus',
    clinicalFeedbackTags: ['Zero gastric irritation', 'Stable glycemic control', 'Smooth chronic delivery'],
    helpfulCount: 38,
    status: 'approved',
    pharmacistVerifiedNote: 'Extended-release dissolution profile matches reference innovator standard.'
  },
  {
    id: 'rev-amx-03',
    productId: 'prod-amox-625',
    productName: 'Amoxicillin & Potassium Clavulanate IP 625mg',
    authorName: 'Kavita Nair',
    authorLocation: 'Noida',
    rating: 4,
    date: '02 Sep 2026',
    isVerifiedPurchase: true,
    title: 'Cleared bacterial infection without issues',
    comment: 'Prescribed for acute sinusitis. The generic Augmentin alternative was verified via prescription scanner within 2 minutes and delivered in 35 minutes by MedPlus.',
    conditionTreated: 'Acute Bacterial Sinusitis',
    clinicalFeedbackTags: ['Schedule H1 Verified', 'Rapid 35m delivery', 'Augmentin equivalent'],
    helpfulCount: 19,
    status: 'approved',
    pharmacistVerifiedNote: 'Amoxicillin + Clavulanic acid ratio 4:1 verified compliant with IP monograph.'
  },
  {
    id: 'rev-atv-04',
    productId: 'prod-ator-20',
    productName: 'Atorvastatin Calcium 20mg',
    authorName: 'Vikram Malhotra',
    authorLocation: 'Bengaluru',
    rating: 5,
    date: '22 Aug 2026',
    isVerifiedPurchase: true,
    title: 'Lipid profile normalized, great cost relief',
    comment: 'Lipitor was costing me over ₹450 a month. This generic alternative is ₹98. My LDL dropped from 155 to 92 in 3 months of consistent dosage.',
    conditionTreated: 'Hypercholesterolemia',
    clinicalFeedbackTags: ['Lipitor bio-equivalent', 'LDL reduced by 40%', 'Over ₹350/mo saved'],
    helpfulCount: 51,
    status: 'approved',
    pharmacistVerifiedNote: 'Bio-equivalence study demonstrated 99.2% Cmax/AUC curve match against Lipitor.'
  }
];

// Phase 2: Batch-Level Expiry Radar & Cold-Chain Records
export const SAMPLE_BATCH_RECORDS: MedicineBatchRecord[] = [
  {
    id: 'batch-001',
    batchNumber: 'BATCH-PCM-2026-A1',
    productId: 'prod-para-500',
    productName: 'Paracetamol IP 500mg',
    partnerId: 'partner-medplus',
    partnerName: 'MedPlus Care Pharmacy (North Hub)',
    mfgDate: '15 Jan 2026',
    expiryDate: '15 Jan 2028',
    stockUnits: 450,
    requiresColdChain: false,
    targetTempRange: '15°C - 25°C',
    currentTempCelsius: 21.4,
    status: 'Optimal',
    daysToExpiry: 493,
    qcCertificateNumber: 'QC-CERT-2026-8819'
  },
  {
    id: 'batch-002',
    batchNumber: 'BATCH-MET-2025-C4',
    productId: 'prod-met-500',
    productName: 'Metformin Hydrochloride ER 500mg',
    partnerId: 'partner-medplus',
    partnerName: 'MedPlus Care Pharmacy (North Hub)',
    mfgDate: '10 Nov 2025',
    expiryDate: '10 Nov 2027',
    stockUnits: 280,
    requiresColdChain: false,
    targetTempRange: '15°C - 25°C',
    currentTempCelsius: 22.1,
    status: 'Optimal',
    daysToExpiry: 427,
    qcCertificateNumber: 'QC-CERT-2025-4491'
  },
  {
    id: 'batch-003',
    batchNumber: 'BATCH-AMX-2024-X2',
    productId: 'prod-amox-625',
    productName: 'Amoxicillin & Potassium Clavulanate IP 625mg',
    partnerId: 'partner-apollo',
    partnerName: 'Apollo Green Health Chemist (South Plaza)',
    mfgDate: '01 Nov 2024',
    expiryDate: '01 Nov 2026',
    stockUnits: 45,
    requiresColdChain: false,
    targetTempRange: '15°C - 25°C',
    currentTempCelsius: 20.8,
    status: 'Near Expiry (<6m)',
    daysToExpiry: 53,
    qcCertificateNumber: 'QC-CERT-2024-1120'
  },
  {
    id: 'batch-004',
    batchNumber: 'BATCH-INS-2026-COLD',
    productId: 'prod-ator-20',
    productName: 'Atorvastatin Calcium 20mg (Cold Store)',
    partnerId: 'partner-janaushadhi',
    partnerName: 'Jan Aushadhi Partner Kendra (Civil Lines)',
    mfgDate: '15 Jun 2026',
    expiryDate: '15 Jun 2027',
    stockUnits: 120,
    requiresColdChain: true,
    targetTempRange: '2°C - 8°C',
    currentTempCelsius: 4.2,
    status: 'Optimal',
    daysToExpiry: 279,
    qcCertificateNumber: 'QC-CERT-2026-COLD-99'
  }
];

// Phase 2: Customer Support & Dispute Desk
export const SAMPLE_SUPPORT_TICKETS: SupportTicket[] = [
  {
    id: 'CAS-8821',
    orderId: 'ORD-98421',
    customerName: 'Aarav Sharma',
    customerEmail: 'aarav.sharma@example.com',
    category: 'Delayed Delivery',
    priority: 'P1 High',
    status: 'Resolved',
    createdAt: '08 Sep 2026 14:10',
    resolvedAt: '08 Sep 2026 14:45',
    subject: 'Express rider delayed due to rain',
    resolutionNote: 'Pharmacist contacted courier dispatch; order delivered 15 mins later and ₹50 convenience fee refunded.',
    refundIssued: 50.00,
    messages: [
      {
        id: 'msg-01',
        sender: 'customer',
        senderName: 'Aarav Sharma',
        text: 'Hello, the rider tracker has been stationary at Sector 14 junction for 20 minutes.',
        timestamp: '14:10'
      },
      {
        id: 'msg-02',
        sender: 'support_agent',
        senderName: 'Neha (Fulfillment Ops)',
        text: 'Hi Aarav, our North Hub dispatcher confirmed heavy waterlogging at the underpass. Rider Rahul has taken the elevated flyover and is 4 mins away.',
        timestamp: '14:18'
      },
      {
        id: 'msg-03',
        sender: 'support_agent',
        senderName: 'Neha (Fulfillment Ops)',
        text: 'We have also initiated a ₹50 credit to your original payment method for the delay SLA violation.',
        timestamp: '14:45'
      }
    ]
  },
  {
    id: 'CAS-9942',
    orderId: 'ORD-99104',
    customerName: 'Aarav Sharma',
    customerEmail: 'aarav.sharma@example.com',
    category: 'Prescription Query',
    priority: 'P2 Medium',
    status: 'Open',
    createdAt: '09 Sep 2026 08:30',
    subject: 'Inquiry regarding Metformin 500mg vs 850mg dosage split',
    messages: [
      {
        id: 'msg-10',
        sender: 'customer',
        senderName: 'Aarav Sharma',
        text: 'My doctor suggested maybe switching to 850mg next month. Can I substitute with two 500mg tabs safely or wait for new prescription?',
        timestamp: '08:30'
      },
      {
        id: 'msg-11',
        sender: 'pharmacist',
        senderName: 'Dr. Anita Desai, Lead Pharmacist (Reg #5102)',
        text: 'Hello Aarav. Per clinical regulations (ADR-002), any dosage change requires an updated prescription. Please do not double up 500mg tablets as the extended-release absorption kinetics differ.',
        timestamp: '08:45'
      }
    ]
  }
];

// Phase 2: Partner Geolocations & Metro Service Zones
export const PARTNER_GEOLOCATIONS: Record<string, PharmacyGeoLocation> = {
  'partner-medplus': {
    partnerId: 'partner-medplus',
    partnerName: 'MedPlus Care Pharmacy (North Hub)',
    latitude: 28.4721,
    longitude: 77.0422,
    address: 'Plot 12, Sector 14 Main Market, Gurugram',
    serviceRadiusKm: 8.5,
    hubType: 'Metro Super Hub',
    averageDispatchMinutes: 14,
    coldChainEquipped: true
  },
  'partner-apollo': {
    partnerId: 'partner-apollo',
    partnerName: 'Apollo Green Health Chemist (South Plaza)',
    latitude: 28.4412,
    longitude: 77.0851,
    address: 'South Plaza Arcade, Sector 54, Gurugram',
    serviceRadiusKm: 10.0,
    hubType: 'Metro Super Hub',
    averageDispatchMinutes: 18,
    coldChainEquipped: true
  },
  'partner-janaushadhi': {
    partnerId: 'partner-janaushadhi',
    partnerName: 'Jan Aushadhi Partner Kendra (Civil Lines)',
    latitude: 28.4635,
    longitude: 77.0298,
    address: 'Civil Lines Road, Near District Hospital, Gurugram',
    serviceRadiusKm: 6.0,
    hubType: 'Local Jan Aushadhi',
    averageDispatchMinutes: 22,
    coldChainEquipped: true
  },
  'partner-genericcare': {
    partnerId: 'partner-genericcare',
    partnerName: 'GenericCare Express Chemist (West Center)',
    latitude: 28.4901,
    longitude: 77.0112,
    address: 'West Center Metro Concourse, Gurugram',
    serviceRadiusKm: 7.0,
    hubType: 'Express Chemist',
    averageDispatchMinutes: 16,
    coldChainEquipped: false
  }
};

// Phase 2: Pharmacy Partner Analytics Summary
export const SAMPLE_PARTNER_ANALYTICS: Record<string, PartnerAnalyticsSummary> = {
  'partner-medplus': {
    partnerId: 'partner-medplus',
    period: 'September 2026 MTD',
    totalGrossRevenue: 148520,
    totalOrdersFulfilled: 412,
    slaCompliancePercent: 98.6,
    averageFulfillmentTimeMins: 14.2,
    chronicRetentionRate: 78.4,
    batchWasteRate: 0.4,
    topSellingMolecules: [
      { name: 'Paracetamol IP 500mg', units: 1420, revenue: 19880 },
      { name: 'Metformin ER 500mg', units: 980, revenue: 32340 },
      { name: 'Atorvastatin 20mg', units: 620, revenue: 38440 },
      { name: 'Amoxicillin/Clav 625mg', units: 480, revenue: 47040 }
    ]
  },
  'partner-apollo': {
    partnerId: 'partner-apollo',
    period: 'September 2026 MTD',
    totalGrossRevenue: 122400,
    totalOrdersFulfilled: 318,
    slaCompliancePercent: 97.2,
    averageFulfillmentTimeMins: 17.8,
    chronicRetentionRate: 72.1,
    batchWasteRate: 0.9,
    topSellingMolecules: [
      { name: 'Atorvastatin 20mg', units: 710, revenue: 46150 },
      { name: 'Metformin ER 500mg', units: 840, revenue: 29400 },
      { name: 'Paracetamol IP 500mg', units: 990, revenue: 14850 }
    ]
  }
};

// Phase 3: Licensed Doctor Directory for Tele-Consultation (PRD Section 10 / P1)
export const DOCTOR_PROFILES: DoctorProfile[] = [
  {
    id: 'doc-ananya-sharma',
    name: 'Dr. Ananya Sharma',
    title: 'MBBS, MD (General & Internal Medicine)',
    specialty: 'Internal Medicine & Chronic Disease Management',
    regNumber: 'REG-MCI-2012-48201',
    experienceYears: 14,
    consultationFee: 299,
    rating: 4.9,
    reviewCount: 384,
    avatarUrl: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=400&q=80',
    availableSlot: 'Available Now (Avg wait 2 mins)',
    languages: ['English', 'Hindi', 'Punjabi'],
    bio: 'Senior Consultant Physician specializing in hypertension, metabolic syndrome, and rational generic pharmacology.'
  },
  {
    id: 'doc-rajesh-verma',
    name: 'Dr. Rajesh Verma',
    title: 'MBBS, DNB (Diabetology & Endocrinology)',
    specialty: 'Diabetology & Lipid Disorders',
    regNumber: 'REG-MCI-2008-31940',
    experienceYears: 18,
    consultationFee: 349,
    rating: 4.95,
    reviewCount: 512,
    avatarUrl: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=400&q=80',
    availableSlot: 'Next available in 10 mins',
    languages: ['English', 'Hindi', 'Bengali'],
    bio: 'Leading Endocrinologist dedicated to optimizing chronic therapy through verified bio-equivalent generics.'
  },
  {
    id: 'doc-meera-nambiar',
    name: 'Dr. Meera Nambiar',
    title: 'MBBS, DGO (Family Medicine & Primary Care)',
    specialty: 'Primary Care & Infectious Diseases',
    regNumber: 'REG-MCI-2015-62104',
    experienceYears: 11,
    consultationFee: 249,
    rating: 4.88,
    reviewCount: 290,
    avatarUrl: 'https://images.unsplash.com/photo-1594824813515-555e1c455829?auto=format&fit=crop&w=400&q=80',
    availableSlot: 'Available Now (Instant Connect)',
    languages: ['English', 'Tamil', 'Malayalam', 'Hindi'],
    bio: 'Family physician with deep expertise in acute antibiotic stewardship and pediatric generic formulations.'
  }
];

// Phase 3: National Pharmacy Network B2B ERP Connectors (PRD Section 14 / P2)
export const NATIONAL_ERP_CONNECTORS: NationalErpConnector[] = [
  {
    id: 'erp-apollo-national',
    chainName: 'Apollo Pharmacy National',
    logoBadge: '🏥 Apollo ERP Gateway',
    protocol: 'FHIR R4 JSON REST',
    endpointUrl: 'https://fhir.apollo-health.internal/v4/MedicationKnowledge',
    syncStatus: 'online',
    lastSyncTimestamp: 'Just now (10:14 AM)',
    pingLatencyMs: 18,
    totalMappedSkus: 12450,
    discrepanciesResolved24h: 3,
    autoReconcileEnabled: true,
    warehouseLocation: 'South Zone Regional Fulfillment Depot, Bengaluru'
  },
  {
    id: 'erp-medplus-retail',
    chainName: 'MedPlus Retail Network',
    logoBadge: '💊 MedPlus Direct B2B',
    protocol: 'EDI 850/855/856',
    endpointUrl: 'https://edi.medplusindia.internal/b2b/v3/inventory-feed',
    syncStatus: 'online',
    lastSyncTimestamp: '3 mins ago (10:11 AM)',
    pingLatencyMs: 32,
    totalMappedSkus: 8920,
    discrepanciesResolved24h: 1,
    autoReconcileEnabled: true,
    warehouseLocation: 'North Zone High-Velocity Distribution Center, Delhi NCR'
  },
  {
    id: 'erp-janaushadhi-central',
    chainName: 'Jan Aushadhi PMBI Central',
    logoBadge: '🇮🇳 PMBI National Central Depot',
    protocol: 'National Health Stack Open API',
    endpointUrl: 'https://api.janaushadhi.gov.in/nh-stack/v2/warehouse/stock',
    syncStatus: 'online',
    lastSyncTimestamp: '12 mins ago (10:02 AM)',
    pingLatencyMs: 24,
    totalMappedSkus: 18200,
    discrepanciesResolved24h: 0,
    autoReconcileEnabled: true,
    warehouseLocation: 'Central Apex Strategic Warehouse, Gurugram Logistics Park'
  }
];

// Phase 3: Clinical Drug-Drug Interaction Rules Matrix
export const DRUG_INTERACTION_RULES: DrugInteractionAlert[] = [
  {
    id: 'ddi-aspirin-clopidogrel',
    severity: 'critical',
    primaryDrug: 'Aspirin / NSAIDs (Ibuprofen)',
    interactingDrug: 'Clopidogrel / Blood Thinners',
    mechanism: 'Additive antiplatelet effect significantly increases the risk of major upper gastrointestinal and systemic hemorrhage.',
    clinicalAdvisory: 'CRITICAL: Dual antiplatelet therapy requires verified cardiologist authorization and concurrent proton-pump inhibitor gastro-protection.',
    requiresPharmacistOverride: true
  },
  {
    id: 'ddi-metformin-contrast',
    severity: 'moderate',
    primaryDrug: 'Metformin IP',
    interactingDrug: 'Iodinated Radiographic Contrast / Severe Renal Stress',
    mechanism: 'Contrast-induced nephropathy can impair renal clearance of metformin, precipitating life-threatening lactic acidosis.',
    clinicalAdvisory: 'MODERATE: Withhold metformin 48 hours prior to and post iodinated contrast imaging until eGFR is verified stable.',
    requiresPharmacistOverride: false
  },
  {
    id: 'ddi-simvastatin-amlodipine',
    severity: 'moderate',
    primaryDrug: 'Atorvastatin / Simvastatin',
    interactingDrug: 'Amlodipine Besylate',
    mechanism: 'CYP3A4 inhibition by amlodipine can increase statin plasma concentrations, elevating the risk of myopathy and rhabdomyolysis.',
    clinicalAdvisory: 'MODERATE: Recommended daily statin dose should not exceed 20mg when co-administered with amlodipine 5-10mg.',
    requiresPharmacistOverride: false
  },
  {
    id: 'ddi-paracetamol-alcohol',
    severity: 'moderate',
    primaryDrug: 'Paracetamol IP 500mg/650mg',
    interactingDrug: 'Ethanol / Hepatotoxic Agents',
    mechanism: 'Chronic ethanol consumption induces CYP2E1, accelerating generation of toxic NAPQI metabolite and liver glutathione depletion.',
    clinicalAdvisory: 'MODERATE: Do not exceed 2,000mg/24h in patients with elevated ALT/AST or concurrent liver stress.',
    requiresPharmacistOverride: false
  }
];

// Phase 3: Currency Configurations
export const CURRENCY_CONFIGS: Record<SupportedCurrency, CurrencyConfig> = {
  INR: { code: 'INR', symbol: '₹', rateAgainstINR: 1.0, name: 'Indian Rupee (INR)' },
  USD: { code: 'USD', symbol: '$', rateAgainstINR: 0.012, name: 'US Dollar (USD)' },
  EUR: { code: 'EUR', symbol: '€', rateAgainstINR: 0.011, name: 'Euro (EUR)' },
  GBP: { code: 'GBP', symbol: '£', rateAgainstINR: 0.0094, name: 'British Pound (GBP)' },
  AED: { code: 'AED', symbol: 'د.إ', rateAgainstINR: 0.044, name: 'UAE Dirham (AED)' }
};

// Phase 3: Localization Dictionary (EN, HI, TA, TE, BN)
export const LOCALIZATION_DICTIONARY: Record<SupportedLanguage, Record<string, string>> = {
  en: {
    'nav.discovery': 'Discovery & Comparison',
    'nav.orders': 'Orders & Fleet Tracker',
    'nav.partner': 'Pharmacy Partner Chemist',
    'nav.admin': 'Admin Operations & Compliance',
    'search.placeholder': 'Search active generic salt (e.g. Paracetamol, Metformin) or brand (Crocin, Dolo)...',
    'search.all_categories': 'All Therapeutics',
    'badge.exact_match': 'Exact Clinical Salt & Strength Match',
    'badge.normalized_unit': 'Normalized Unit Price',
    'badge.ranked_first': 'Ranked #1 for Value & SLA',
    'button.compare': 'Compare',
    'button.add_cart': 'Add to Cart',
    'button.view_details': 'Clinical Monograph',
    'button.subscribe_save': 'Subscribe & Save 5%',
    'button.tele_consult': 'Tele-Doctor Consultation',
    'button.b2b_network': 'National B2B Network',
    'cart.title': 'Verified Cart Revalidation',
    'cart.checkout': 'Proceed to Verified Checkout',
    'banner.tele_title': 'Need a Doctor Prescription Renewal?',
    'banner.tele_desc': 'Book an instant 5-minute video consultation with an MBBS/MD doctor. Get a verified Digital Rx and auto-add generics to your cart.',
    'banner.tele_cta': 'Start Video Consultation',
    'ddi.safe_title': 'Clinical Safety Verified: Zero Contraindications Found',
    'ddi.warning_title': 'Clinical Drug-Drug Interaction Advisory',
    'savings.tag': 'Consumer Savings'
  },
  hi: {
    'nav.discovery': 'खोज एवं मूल्य तुलना',
    'nav.orders': 'ऑर्डर एवं ट्रैकिंग',
    'nav.partner': 'फार्मेसी पार्टनर पोर्टल',
    'nav.admin': 'प्रशासन एवं अनुपालन',
    'search.placeholder': 'जेनेरिक सॉल्ट (जैसे पैरासिटामोल, मेटफॉर्मिन) या ब्रांड (क्रोसिन, डोलो) खोजें...',
    'search.all_categories': 'सभी श्रेणियां',
    'badge.exact_match': 'सटीक क्लिनिकल साल्ट और मात्रा',
    'badge.normalized_unit': 'प्रति गोली/इकाई मूल्य',
    'badge.ranked_first': '#1 अनुशंसित विकल्प',
    'button.compare': 'तुलना करें',
    'button.add_cart': 'कार्ट में जोड़ें',
    'button.view_details': 'क्लिनिकल विवरण',
    'button.subscribe_save': 'सदस्यता लें और 5% बचाएं',
    'button.tele_consult': 'डॉक्टर से वीडियो परामर्श',
    'button.b2b_network': 'राष्ट्रीय नेटवर्क',
    'cart.title': 'सत्यापित कार्ट जांच',
    'cart.checkout': 'सत्यापित चेकआउट करें',
    'banner.tele_title': 'क्या आपको नया डॉक्टर पर्चा चाहिए?',
    'banner.tele_desc': 'एमबीबीएस डॉक्टर से तुरंत 5 मिनट में वीडियो परामर्श लें। डिजिटल पर्चा पाएं और सीधे जेनेरिक दवाएं कार्ट में जोड़ें।',
    'banner.tele_cta': 'वीडियो परामर्श शुरू करें',
    'ddi.safe_title': 'क्लिनिकल सुरक्षा सत्यापित: कोई दुष्प्रभाव नहीं',
    'ddi.warning_title': 'दवा अंतःक्रिया (DDI) चेतावनी',
    'savings.tag': 'उपभोक्ता बचत'
  },
  ta: {
    'nav.discovery': 'தேடல் & விலை ஒப்பீடு',
    'nav.orders': 'ஆர்டர்கள் & கண்காணிப்பு',
    'nav.partner': 'மருந்தக கூட்டாளர் போர்டல்',
    'nav.admin': 'நிர்வாகம் & இணக்கம்',
    'search.placeholder': 'ஜெனரிக் மருந்து பெயர் அல்லது பிராண்ட் தேடுங்கள்...',
    'search.all_categories': 'அனைத்து பிரிவுகளும்',
    'badge.exact_match': 'துல்லியமான மருத்துவ சமநிலை',
    'badge.normalized_unit': 'ஒரு மாத்திரைக்கான விலை',
    'badge.ranked_first': '#1 சிறந்த பரிந்துரை',
    'button.compare': 'ஒப்பிடுக',
    'button.add_cart': 'கார்ட்டில் சேர்க்க',
    'button.view_details': 'மருத்துவ விவரங்கள்',
    'button.subscribe_save': 'சந்தா செலுத்தி 5% சேமிக்கவும்',
    'button.tele_consult': 'மருத்துவர் ஆலோசனை',
    'button.b2b_network': 'தேசிய நெட்வொர்க்',
    'cart.title': 'சரிபார்க்கப்பட்ட கார்ட்',
    'cart.checkout': 'செக்அவுட் தொடரவும்',
    'banner.tele_title': 'மருத்துவர் சீட்டு புதுப்பிக்க வேண்டுமா?',
    'banner.tele_desc': 'உடனடி 5 நிமிட வீடியோ ஆலோசனை மூலம் டிஜிட்டல் மருந்து சீட்டு பெற்று நேரடியாக ஆர்டர் செய்யுங்கள்.',
    'banner.tele_cta': 'ஆலோசனை தொடங்கவும்',
    'ddi.safe_title': 'மருத்துவ பாதுகாப்பு சரிபார்க்கப்பட்டது',
    'ddi.warning_title': 'மருந்து தொடர்பு எச்சரிக்கை',
    'savings.tag': 'சேமிப்பு'
  },
  te: {
    'nav.discovery': 'శోధన & ధర పోలిక',
    'nav.orders': 'ఆర్డర్లు & ట్రాకింగ్',
    'nav.partner': 'ఫార్మసీ భాగస్వామి పోర్టల్',
    'nav.admin': 'పరిపాలన & వర్తింపు',
    'search.placeholder': 'జెనెరిక్ మందు పేరు లేదా బ్రాండ్ వెతకండి...',
    'search.all_categories': 'అన్ని వర్గాలు',
    'badge.exact_match': 'ఖచ్చితమైన క్లినికల్ సరిపోలిక',
    'badge.normalized_unit': 'ఒక్క టాబ్లెట్ ధర',
    'badge.ranked_first': '#1 ఉత్తమ ఎంపిక',
    'button.compare': 'పోల్చండి',
    'button.add_cart': 'కార్ట్‌కు జోడించండి',
    'button.view_details': 'క్లినికల్ వివరాలు',
    'button.subscribe_save': 'సబ్‌స్క్రైబ్ చేసి 5% ఆదా చేయండి',
    'button.tele_consult': 'డాక్టర్ సంప్రదింపు',
    'button.b2b_network': 'జాతీయ నెట్‌వర్క్',
    'cart.title': 'ధృవీకరించబడిన కార్ట్',
    'cart.checkout': 'చెక్‌అవుట్ చేయండి',
    'banner.tele_title': 'డాక్టర్ ప్రిస్క్రిప్షన్ రెన్యూవల్ కావాలా?',
    'banner.tele_desc': 'క్షణాల్లో 5 నిమిషాల వీడియో కాల్ ద్వారా డాక్టర్‌ను సంప్రదించి డిజిటల్ ప్రిస్క్రిప్షన్ పొందండి.',
    'banner.tele_cta': 'వీడియో కాల్ ప్రారంభించండి',
    'ddi.safe_title': 'క్లినికల్ భద్రత ధృవీకరించబడింది',
    'ddi.warning_title': 'ఔషధ పరస్పర చర్య హెచ్చరిక',
    'savings.tag': 'పొదుపు'
  },
  bn: {
    'nav.discovery': 'অনুসন্ধান ও মূল্য তুলনা',
    'nav.orders': 'অর্ডার ও ট্র্যাকিং',
    'nav.partner': 'ফার্মেসি অংশীদার পোর্টাল',
    'nav.admin': 'প্রশাসন ও সম্মতি',
    'search.placeholder': 'জেনেরিক ওষুধের নাম বা ব্র্যান্ড খুঁজুন...',
    'search.all_categories': 'সকল বিভাগ',
    'badge.exact_match': 'সঠিক ক্লিনিকাল সমতুল্য',
    'badge.normalized_unit': 'প্রতি ট্যাবলেটের দাম',
    'badge.ranked_first': '#১ সেরা বিকল্প',
    'button.compare': 'তুলনা করুন',
    'button.add_cart': 'কার্টে যোগ করুন',
    'button.view_details': 'ক্লিনিকাল বিবরণ',
    'button.subscribe_save': 'সাবস্ক্রাইব করে ৫% সাশ্রয় করুন',
    'button.tele_consult': 'ডাক্তারের ভিডিও পরামর্শ',
    'button.b2b_network': 'জাতীয় নেটওয়ার্ক',
    'cart.title': 'যাচাইকৃত কার্ট',
    'cart.checkout': 'চেকআউট করুন',
    'banner.tele_title': 'নতুন প্রেসক্রিপশন প্রয়োজন?',
    'banner.tele_desc': 'এমবিবিএস চিকিৎসকের সাথে ৫ মিনিটের তাত্ক্ষণিক ভিডিও পরামর্শ নিন এবং ডিজিটাল প্রেসক্রিপশন পান।',
    'banner.tele_cta': 'ভিডিও পরামর্শ শুরু করুন',
    'ddi.safe_title': 'ক্লিনিকাল নিরাপত্তা যাচাইকৃত',
    'ddi.warning_title': 'ওষুধের পারস্পরিক ক্রিয়া সতর্কতা',
    'savings.tag': 'সাশ্রয়'
  }
};


