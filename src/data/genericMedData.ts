import { CanonicalProduct, ProductListing, OrderRecord, AuditRecord, OperationalException } from '../types';

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
    description: 'First-line medication used to treat pain and fever. Normalized comparison evaluates equivalent generic salt bio-equivalence.'
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
    description: 'Higher strength paracetamol formulation for moderate fever, body aches, and discomfort.'
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
    description: 'Primary oral medication for type-2 diabetes mellitus management. Regulates hepatic glucose synthesis.'
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
    description: 'Lipid-lowering agent prescribed to lower LDL cholesterol and decrease cardiovascular risks.'
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
    description: 'Anti-allergy medication relieving allergic rhinitis, watery eyes, sneezing, and pruritus without excessive sedation.'
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
    description: 'Broad-spectrum antibiotic combining penicillin-derived amoxicillin with a beta-lactamase inhibitor.'
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
