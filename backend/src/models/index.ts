import mongoose, { Schema } from 'mongoose';
import {
  CanonicalProduct,
  ProductListing,
  OrderRecord,
  PrescriptionRecord,
  ChronicSubscription,
  ProductReview,
  MedicineBatchRecord,
  SupportTicket,
  AuditRecord,
  AbhaProfile,
  DualPharmacistDispenseRecord,
  PvPiAdverseReactionReport,
  NationalErpConnector,
  DrugProvenanceBlock,
  EpidemicSurveillanceSignal
} from '../types.js';

// Canonical Product Schema
const ProductSchema = new Schema<CanonicalProduct>({
  id: { type: String, required: true, unique: true, index: true },
  canonicalName: { type: String, required: true },
  genericSalt: { type: String, required: true, index: true },
  therapeuticClass: { type: String, required: true },
  strength: { type: String, required: true },
  dosageForm: { type: String, required: true },
  prescriptionRequired: { type: Boolean, default: false },
  commonBrandEquivalent: { type: String, required: true },
  brandPriceRef: { type: Number, required: true },
  description: { type: String, required: true },
  manufacturer: String,
  drugSchedule: String,
  storageGuidelines: String,
  precautions: [String],
  sideEffects: [String],
  contraindications: [String]
}, { timestamps: true });

// Product Listing Schema
const ListingSchema = new Schema<ProductListing>({
  id: { type: String, required: true, unique: true, index: true },
  productId: { type: String, required: true, index: true },
  partnerId: { type: String, required: true, index: true },
  partnerName: { type: String, required: true },
  partnerRating: { type: Number, default: 4.5 },
  partnerLocation: { type: String, required: true },
  packQuantity: { type: Number, required: true },
  packPrice: { type: Number, required: true },
  normalizedUnitPrice: { type: Number, required: true, index: true },
  unitLabel: { type: String, default: 'tablet' },
  stockCount: { type: Number, default: 0 },
  isAvailable: { type: Boolean, default: true },
  freshnessTimestamp: { type: String, default: 'Just now' },
  isStale: { type: Boolean, default: false },
  rankScore: Number,
  rankFactors: Schema.Types.Mixed
}, { timestamps: true });

// Order Schema
const OrderSchema = new Schema<any>({
  id: { type: String, required: true, unique: true, index: true },
  customerName: { type: String, required: true },
  customerEmail: { type: String, required: true },
  items: { type: Schema.Types.Mixed, required: true },
  totalAmount: { type: Number, required: true },
  status: { type: String, required: true, default: 'Paid/Confirmed' },
  paymentStatus: { type: String, default: 'Verified Paid' },
  createdAt: { type: String, default: () => new Date().toISOString() },
  deliveryAddress: { type: String, required: true },
  deliveryPin: String,
  paymentMethod: String,
  idempotencyKey: { type: String, index: true },
  trackingTimeline: Schema.Types.Mixed
}, { timestamps: true });

// Prescription Schema
const PrescriptionSchema = new Schema<any>({
  id: { type: String, required: true, unique: true, index: true },
  userId: { type: String, required: true },
  patientName: { type: String, required: true },
  doctorName: { type: String, required: true },
  doctorRegNumber: { type: String, required: true },
  issueDate: { type: String, required: true },
  validUntil: { type: String, required: true },
  imageUrl: String,
  rawOcrText: String,
  extractedEntities: Schema.Types.Mixed,
  status: { type: String, default: 'verified' },
  confidenceScore: { type: Number, default: 95 },
  validationNotes: [String]
}, { timestamps: true });

// Chronic Subscription Schema
const SubscriptionSchema = new Schema<any>({
  id: { type: String, required: true, unique: true, index: true },
  userId: { type: String, required: true },
  canonicalProduct: { type: Schema.Types.Mixed, required: true },
  listing: { type: Schema.Types.Mixed, required: true },
  quantity: { type: Number, default: 1 },
  intervalDays: { type: Number, default: 30 },
  startDate: { type: String, required: true },
  nextRefillDate: { type: String, required: true },
  status: { type: String, default: 'active' },
  deliveryAddress: { type: String, required: true },
  monthlySavings: { type: Number, default: 0 },
  autoPayMethod: { type: String, default: 'UPI AutoPay' },
  refillCount: { type: Number, default: 0 }
}, { timestamps: true });

// Product Review Schema
const ReviewSchema = new Schema<any>({
  id: { type: String, required: true, unique: true, index: true },
  productId: { type: String, required: true, index: true },
  productName: { type: String, required: true },
  authorName: { type: String, required: true },
  authorLocation: { type: String, default: 'India' },
  rating: { type: Number, required: true },
  date: { type: String, required: true },
  isVerifiedPurchase: { type: Boolean, default: true },
  title: { type: String, required: true },
  comment: { type: String, required: true },
  conditionTreated: { type: String, required: true },
  clinicalFeedbackTags: [String],
  helpfulCount: { type: Number, default: 0 },
  status: { type: String, default: 'approved' },
  pharmacistVerifiedNote: String
}, { timestamps: true });

// Medicine Batch Record Schema
const BatchSchema = new Schema<any>({
  id: { type: String, required: true, unique: true, index: true },
  batchNumber: { type: String, required: true, index: true },
  productId: { type: String, required: true },
  productName: { type: String, required: true },
  partnerId: { type: String, required: true },
  partnerName: { type: String, required: true },
  mfgDate: { type: String, required: true },
  expiryDate: { type: String, required: true },
  stockUnits: { type: Number, default: 0 },
  requiresColdChain: { type: Boolean, default: false },
  targetTempRange: { type: String, default: '15°C - 25°C' },
  currentTempCelsius: { type: Number, default: 22 },
  status: { type: String, default: 'Optimal' },
  daysToExpiry: { type: Number, default: 365 },
  qcCertificateNumber: { type: String, required: true }
}, { timestamps: true });

// Support Ticket Schema
const TicketSchema = new Schema<any>({
  id: { type: String, required: true, unique: true, index: true },
  orderId: { type: String, required: true },
  customerName: { type: String, required: true },
  customerEmail: { type: String, required: true },
  category: { type: String, required: true },
  priority: { type: String, default: 'P1 High' },
  status: { type: String, default: 'Open' },
  createdAt: { type: String, default: () => new Date().toISOString() },
  subject: { type: String, required: true },
  resolutionNote: String,
  refundIssued: Number,
  messages: [Schema.Types.Mixed]
}, { timestamps: true });

// Section 18 Audit Log Schema
const AuditLogSchema = new Schema<AuditRecord>({
  id: { type: String, required: true, unique: true, index: true },
  actorId: { type: String, required: true },
  actorRole: { type: String, required: true },
  timestamp: { type: String, default: () => new Date().toISOString() },
  actionType: { type: String, required: true },
  entityType: { type: String, required: true },
  entityId: { type: String, required: true },
  previousState: String,
  newState: String,
  reason: String,
  correlationId: { type: String, required: true, index: true },
  sourceContext: { type: String, required: true }
}, { timestamps: true });

// ABHA Profile Schema
const AbhaProfileSchema = new Schema<any>({
  abhaNumber: { type: String, required: true, unique: true },
  abhaAddress: { type: String, required: true },
  fullName: { type: String, required: true },
  gender: { type: String, default: 'M' },
  dateOfBirth: { type: String, default: '1985-06-15' },
  phoneLinked: { type: String, default: '+91 98765 43210' },
  kycStatus: { type: String, default: 'Verified' },
  kycMethod: { type: String, default: 'Aadhaar_OTP' },
  linkedHospital: { type: String, default: 'All India Institute of Medical Sciences (AIIMS)' },
  qrCardToken: { type: String, default: 'ABHA-QR-VERIFIED-SECURE-2026' },
  consentArtifacts: Schema.Types.Mixed,
  linkedHealthRecordsCount: { type: Number, default: 8 }
}, { timestamps: true });

// Dual Pharmacist Record Schema
const DualDispenseSchema = new Schema<any>({
  id: { type: String, required: true, unique: true, index: true },
  orderId: { type: String, required: true },
  qcPharmacist: Schema.Types.Mixed,
  dispensePharmacist: Schema.Types.Mixed,
  gs1DataMatrixBarcode: { type: String, required: true },
  tamperSealNumber: { type: String, required: true }
}, { timestamps: true });

// PvPI Report Schema
const PvpiReportSchema = new Schema<any>({
  id: { type: String, required: true, unique: true, index: true },
  orderId: { type: String, required: true },
  medicineName: { type: String, required: true },
  genericSalt: { type: String, required: true },
  batchNumber: { type: String, required: true },
  severity: { type: String, required: true },
  suspectedReaction: { type: String, required: true },
  reporterRole: { type: String, required: true },
  reporterName: { type: String, required: true },
  ipcSubmissionStatus: { type: String, default: 'Submitted_to_PvPI' },
  filedAt: { type: String, default: () => new Date().toISOString() }
}, { timestamps: true });

// National ERP Connector Schema
const ErpConnectorSchema = new Schema<any>({
  id: { type: String, required: true, unique: true, index: true },
  chainName: { type: String, required: true },
  logoBadge: { type: String, required: true },
  protocol: { type: String, required: true },
  endpointUrl: { type: String, required: true },
  syncStatus: { type: String, default: 'online' },
  lastSyncTimestamp: { type: String, default: 'Just now' },
  pingLatencyMs: { type: Number, default: 45 },
  totalMappedSkus: { type: Number, default: 1200 },
  discrepanciesResolved24h: { type: Number, default: 14 },
  autoReconcileEnabled: { type: Boolean, default: true },
  warehouseLocation: { type: String, required: true }
}, { timestamps: true });

// Provenance Block Schema
const ProvenanceSchema = new Schema<any>({
  blockIndex: { type: Number, required: true, unique: true, index: true },
  batchNumber: { type: String, required: true },
  timestamp: { type: String, required: true },
  stage: { type: String, required: true },
  stageTitle: { type: String, required: true },
  location: { type: String, required: true },
  actor: { type: String, required: true },
  certificateId: { type: String, required: true },
  blockHash: { type: String, required: true },
  prevHash: { type: String, required: true },
  verificationBadge: { type: String, required: true }
}, { timestamps: true });

// Epidemic Signal Schema
const EpidemicSignalSchema = new Schema<any>({
  id: { type: String, required: true, unique: true, index: true },
  diseaseName: { type: String, required: true },
  region: { type: String, required: true },
  state: { type: String, required: true },
  activeCaseVelocity: { type: String, required: true },
  spikedSaltRequired: { type: String, required: true },
  recommendedBufferDays: { type: Number, required: true },
  alertLevel: { type: String, required: true },
  actionTaken: { type: String, required: true }
}, { timestamps: true });

export const ProductModel = mongoose.model<CanonicalProduct>('Product', ProductSchema);
export const ListingModel = mongoose.model<ProductListing>('Listing', ListingSchema);
export const OrderModel = mongoose.model<OrderRecord>('Order', OrderSchema);
export const PrescriptionModel = mongoose.model<PrescriptionRecord>('Prescription', PrescriptionSchema);
export const SubscriptionModel = mongoose.model<ChronicSubscription>('Subscription', SubscriptionSchema);
export const ReviewModel = mongoose.model<ProductReview>('Review', ReviewSchema);
export const BatchModel = mongoose.model<MedicineBatchRecord>('Batch', BatchSchema);
export const TicketModel = mongoose.model<SupportTicket>('Ticket', TicketSchema);
export const AuditLogModel = mongoose.model<AuditRecord>('AuditLog', AuditLogSchema);
export const AbhaProfileModel = mongoose.model<AbhaProfile>('AbhaProfile', AbhaProfileSchema);
export const DualDispenseModel = mongoose.model<DualPharmacistDispenseRecord>('DualDispense', DualDispenseSchema);
export const PvpiReportModel = mongoose.model<PvPiAdverseReactionReport>('PvpiReport', PvpiReportSchema);
export const ErpConnectorModel = mongoose.model<NationalErpConnector>('ErpConnector', ErpConnectorSchema);
export const ProvenanceModel = mongoose.model<DrugProvenanceBlock>('Provenance', ProvenanceSchema);
export const EpidemicSignalModel = mongoose.model<EpidemicSurveillanceSignal>('EpidemicSignal', EpidemicSignalSchema);
