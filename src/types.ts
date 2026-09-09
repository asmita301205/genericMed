export type ActiveTab = 'app' | 'architecture' | 'prd' | 'photos';
export type AppUserRole = 'customer' | 'partner' | 'admin';

export interface PrdSection {
  id: string;
  number: string;
  title: string;
  summary: string;
  content: {
    subtitle?: string;
    paragraphs?: string[];
    bullets?: string[];
    table?: {
      headers: string[];
      rows: string[][];
    };
  }[];
}

export interface ArchitectureNode {
  id: string;
  layer: 'client' | 'gateway' | 'services' | 'storage' | 'external';
  title: string;
  subtitle: string;
  description: string;
  tech: string[];
  responsibilities: string[];
  protocol: string;
}

export interface ArchitectureConnection {
  from: string;
  to: string;
  label: string;
  type: 'sync' | 'async' | 'asset';
}

export interface AppScreen {
  id: string;
  name: string;
  role: AppUserRole;
  category: 'discovery' | 'checkout' | 'orders' | 'partner' | 'admin';
  description: string;
  badge: string;
  imageUrl?: string;
  fallbackIcon: string;
  features: string[];
  status: 'Ready' | 'In Review' | 'Draft';
}

export interface HotlinkAsset {
  id: string;
  url: string;
  title: string;
  screenTarget: string;
  timestamp: string;
  status: 'active' | 'error' | 'loading';
  dimensions?: string;
}

// genericMed Domain Models based on PRD Section 14
export interface CanonicalProduct {
  id: string;
  canonicalName: string;
  genericSalt: string;
  therapeuticClass: string;
  strength: string;
  dosageForm: string;
  prescriptionRequired: boolean;
  commonBrandEquivalent: string;
  brandPriceRef: number; // e.g. branded MRP for savings calculation
  description: string;
  // Phase 1 Clinical Extensions (FR-DISC-01 to 05)
  manufacturer?: string;
  drugSchedule?: string; // e.g. "Schedule H (Prescription Only)" or "OTC"
  storageGuidelines?: string;
  precautions?: string[];
  sideEffects?: string[];
  contraindications?: string[];
}

export interface ProductListing {
  id: string;
  productId: string;
  partnerId: string;
  partnerName: string;
  partnerRating: number;
  partnerLocation: string;
  packQuantity: number; // e.g. 10 tablets, 15 tablets
  packPrice: number; // total price
  normalizedUnitPrice: number; // price per single tablet or unit
  unitLabel: string; // e.g. "tablet" or "ml"
  stockCount: number;
  isAvailable: boolean;
  freshnessTimestamp: string; // SLA indicator
  isStale: boolean;
  rankScore?: number;
  rankFactors?: {
    priceScore: number;
    trustScore: number;
    availabilityScore: number;
    feedbackScore: number;
    explanation: string;
  };
}

export interface CartItem {
  listingId: string;
  listing: ProductListing;
  canonicalProduct: CanonicalProduct;
  quantity: number;
}

export interface OrderRecord {
  id: string;
  customerName: string;
  customerEmail: string;
  items: CartItem[];
  totalAmount: number;
  status: 'Created' | 'Paid/Confirmed' | 'Accepted by Partner' | 'Out for Delivery' | 'Completed' | 'Cancelled';
  paymentStatus: 'Pending' | 'Verified Paid' | 'Failed' | 'Refunded';
  createdAt: string;
  deliveryAddress: string;
  deliveryPin?: string;
  paymentMethod?: string;
  idempotencyKey?: string;
  trackingTimeline: {
    status: string;
    timestamp: string;
    completed: boolean;
  }[];
}

export interface AuditRecord {
  id: string;
  actorId: string;
  actorRole: string;
  timestamp: string;
  actionType: string;
  entityType: string;
  entityId: string;
  previousState?: string;
  newState?: string;
  reason?: string;
  correlationId: string;
  sourceContext: string;
}

export interface OperationalException {
  id: string;
  type: 'payment_mismatch' | 'stock_mismatch' | 'failed_fulfillment' | 'stale_catalog';
  title: string;
  description: string;
  entityId: string;
  severity: 'high' | 'medium' | 'critical';
  status: 'open' | 'investigating' | 'resolved';
  timestamp: string;
  resolutionOptions: string[];
}

// Phase 1 MVP: User Profile & Authentication (FR-AUTH-01 to 04)
export interface DeliveryAddress {
  id: string;
  label: string; // 'Home' | 'Office' | 'Parents'
  recipientName: string;
  phone: string;
  street: string;
  city: string;
  pincode: string;
  isDefault: boolean;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: AppUserRole;
  verified: boolean;
  addresses: DeliveryAddress[];
  defaultAddressId: string;
  activePrescriptionIds: string[];
}

// Phase 1 MVP: Prescription & AI OCR Validation (FR-SEARCH-05, FR-CART-02)
export interface ExtractedPrescriptionEntity {
  patientName?: string;
  doctorName?: string;
  doctorRegNumber?: string;
  prescribedSalts: {
    saltName: string;
    dosage?: string;
    frequency?: string;
    duration?: string;
    matchesGenericSalt?: boolean;
  }[];
  prescriptionDate?: string;
  isExpired?: boolean;
}

export interface PrescriptionRecord {
  id: string;
  userId: string;
  patientName: string;
  doctorName: string;
  doctorRegNumber: string;
  issueDate: string;
  validUntil: string;
  imageUrl?: string;
  rawOcrText?: string;
  extractedEntities: ExtractedPrescriptionEntity;
  status: 'verified' | 'flagged' | 'pending';
  confidenceScore: number; // 0 to 100
  validationNotes: string[];
}

// Phase 1 MVP: Interactive Payment Gateway (FR-PAY-01 to 06)
export type PaymentMethodType = 'upi' | 'card' | 'netbanking' | 'cod';

export interface PaymentSession {
  idempotencyKey: string;
  transactionRef: string;
  amount: number;
  currency: string;
  method: PaymentMethodType;
  status: 'initiated' | 'verifying' | 'settled' | 'failed';
  provider: 'Razorpay / UPI' | 'Stripe' | 'Bank Direct' | 'Cash on Delivery';
  timestamp: string;
  gatewaySignature?: string;
  errorCode?: string;
  errorMessage?: string;
}

// Phase 1 MVP: Transactional Alerts & Notifications (FR-NOTIF-01)
export interface NotificationMessage {
  id: string;
  type: 'sms' | 'whatsapp';
  recipient: string;
  title: string;
  body: string;
  timestamp: string;
  status: 'delivered' | 'sent';
  orderId?: string;
}

// Phase 2: Chronic Auto-Refill Subscriptions (Persona B)
export type SubscriptionIntervalDays = 30 | 60 | 90;
export type SubscriptionStatus = 'active' | 'paused' | 'cancelled';

export interface ChronicSubscription {
  id: string;
  userId: string;
  canonicalProduct: CanonicalProduct;
  listing: ProductListing;
  quantity: number;
  intervalDays: SubscriptionIntervalDays;
  startDate: string;
  nextRefillDate: string;
  status: SubscriptionStatus;
  deliveryAddress: string;
  monthlySavings: number;
  autoPayMethod: 'UPI AutoPay' | 'Card Vault Token';
  refillCount: number;
}

// Phase 2: Verified Patient Reviews & Regulatory Moderation
export interface ProductReview {
  id: string;
  productId: string;
  productName: string;
  authorName: string;
  authorLocation: string;
  rating: number; // 1-5
  date: string;
  isVerifiedPurchase: boolean;
  title: string;
  comment: string;
  conditionTreated: string; // e.g., "Type-2 Diabetes", "Mild Hypertension", "Fever & Pain"
  clinicalFeedbackTags: string[]; // e.g. ["Exact bio-equivalent to Crocin", "Zero gastric irritation", "Huge 80% savings"]
  helpfulCount: number;
  status: 'approved' | 'flagged' | 'hidden';
  pharmacistVerifiedNote?: string;
}

// Phase 2: Geospatial Proximity & Cold-Chain Telemetry
export interface PharmacyGeoLocation {
  partnerId: string;
  partnerName: string;
  latitude: number;
  longitude: number;
  address: string;
  serviceRadiusKm: number;
  hubType: 'Metro Super Hub' | 'Local Jan Aushadhi' | 'Express Chemist';
  averageDispatchMinutes: number;
  coldChainEquipped: boolean;
}

export interface DispatchRouteEstimate {
  partnerId: string;
  customerAddress: string;
  distanceKm: number;
  estimatedMinutes: number;
  courierFleetType: 'Electric Two-Wheeler' | 'Temperature-Controlled Van';
  courierName: string;
  courierPhone: string;
  currentLatitude: number;
  currentLongitude: number;
  storageTempCelsius: number;
  temperatureStatus: 'Optimal Cold-Chain (2-8°C)' | 'Optimal Ambient (15-25°C)' | 'Temperature Warning';
  handoverPin: string;
  status: 'Assigning' | 'Dispatched' | 'At Local Hub' | 'Out for Delivery' | 'Arrived';
}

// Phase 2: Batch-Level Expiry & Quarantine Radar
export interface MedicineBatchRecord {
  id: string;
  batchNumber: string;
  productId: string;
  productName: string;
  partnerId: string;
  partnerName: string;
  mfgDate: string;
  expiryDate: string;
  stockUnits: number;
  requiresColdChain: boolean;
  targetTempRange: string; // e.g., "2°C - 8°C" or "15°C - 25°C"
  currentTempCelsius: number;
  status: 'Optimal' | 'Near Expiry (<6m)' | 'Critical (<3m)' | 'Quarantined';
  daysToExpiry: number;
  qcCertificateNumber: string;
}

// Phase 2: Customer Support & Dispute Desk
export type TicketCategory = 'Damaged Package' | 'Delayed Delivery' | 'Prescription Query' | 'Refund Request' | 'Dosage Clarification';
export type TicketPriority = 'P0 Critical' | 'P1 High' | 'P2 Medium';
export type TicketStatus = 'Open' | 'Investigating' | 'Resolved';

export interface SupportTicketMessage {
  id: string;
  sender: 'customer' | 'support_agent' | 'pharmacist';
  senderName: string;
  text: string;
  timestamp: string;
}

export interface SupportTicket {
  id: string;
  orderId: string;
  customerName: string;
  customerEmail: string;
  category: TicketCategory;
  priority: TicketPriority;
  status: TicketStatus;
  createdAt: string;
  resolvedAt?: string;
  subject: string;
  resolutionNote?: string;
  refundIssued?: number;
  messages: SupportTicketMessage[];
}

// Phase 2: Pharmacy Partner Analytics & SLA Performance
export interface PartnerAnalyticsSummary {
  partnerId: string;
  period: string;
  totalGrossRevenue: number;
  totalOrdersFulfilled: number;
  slaCompliancePercent: number;
  averageFulfillmentTimeMins: number;
  chronicRetentionRate: number;
  batchWasteRate: number;
  topSellingMolecules: { name: string; units: number; revenue: number }[];
}

