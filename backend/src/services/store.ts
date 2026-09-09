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
  NationalErpConnector,
  AbhaProfile,
  AbdmConsentArtifact,
  DualPharmacistDispenseRecord,
  PvPiAdverseReactionReport,
  DrugProvenanceBlock,
  EpidemicSurveillanceSignal,
  BioequivalenceClinicalMetrics
} from '../types.js';

import {
  CANONICAL_PRODUCTS,
  PRODUCT_LISTINGS,
  INITIAL_ORDERS,
  INITIAL_AUDIT_LOGS,
  INITIAL_EXCEPTIONS,
  DEFAULT_USER_PROFILE,
  SAMPLE_PRESCRIPTIONS,
  SAMPLE_SUBSCRIPTIONS,
  SAMPLE_REVIEWS,
  SAMPLE_BATCH_RECORDS,
  SAMPLE_SUPPORT_TICKETS,
  NATIONAL_ERP_CONNECTORS,
  SAMPLE_ABHA_PROFILE,
  SAMPLE_DUAL_DISPENSES,
  SAMPLE_PVPI_REPORTS,
  SAMPLE_PROVENANCE_LEDGER,
  SAMPLE_EPIDEMIC_SIGNALS,
  SAMPLE_BIOEQUIVALENCE_METRICS
} from '../data/genericMedData.js';

class InMemoryStore {
  private products: CanonicalProduct[] = [...CANONICAL_PRODUCTS];
  private listings: ProductListing[] = [...PRODUCT_LISTINGS];
  private orders: OrderRecord[] = [...INITIAL_ORDERS];
  private auditLogs: AuditRecord[] = [...INITIAL_AUDIT_LOGS];
  private exceptions: OperationalException[] = [...INITIAL_EXCEPTIONS];
  private userProfile: UserProfile = { ...DEFAULT_USER_PROFILE };
  private prescriptions: PrescriptionRecord[] = [...SAMPLE_PRESCRIPTIONS];
  private subscriptions: ChronicSubscription[] = [...SAMPLE_SUBSCRIPTIONS];
  private reviews: ProductReview[] = [...SAMPLE_REVIEWS];
  private batchRecords: MedicineBatchRecord[] = [...SAMPLE_BATCH_RECORDS];
  private supportTickets: SupportTicket[] = [...SAMPLE_SUPPORT_TICKETS];
  private erpConnectors: NationalErpConnector[] = [...NATIONAL_ERP_CONNECTORS];
  private abhaProfile: AbhaProfile = { ...SAMPLE_ABHA_PROFILE };
  private dualPharmacistRecords: DualPharmacistDispenseRecord[] = [...SAMPLE_DUAL_DISPENSES];
  private pvpiReports: PvPiAdverseReactionReport[] = [...SAMPLE_PVPI_REPORTS];
  private provenanceLedger: DrugProvenanceBlock[] = [...SAMPLE_PROVENANCE_LEDGER];
  private epidemicSignals: EpidemicSurveillanceSignal[] = [...SAMPLE_EPIDEMIC_SIGNALS];
  private bioequivalenceMetrics: BioequivalenceClinicalMetrics[] = [...SAMPLE_BIOEQUIVALENCE_METRICS];

  // Products & Listings
  getProducts(): CanonicalProduct[] {
    return this.products;
  }

  getProductById(id: string): CanonicalProduct | undefined {
    return this.products.find(p => p.id === id);
  }

  getListings(): ProductListing[] {
    return this.listings;
  }

  updateListingStock(listingId: string, newStock: number): ProductListing | null {
    const idx = this.listings.findIndex(l => l.id === listingId);
    if (idx === -1) return null;
    this.listings[idx] = {
      ...this.listings[idx],
      stockCount: newStock,
      isAvailable: newStock > 0,
      freshnessTimestamp: 'Just now',
      isStale: false
    };
    return this.listings[idx];
  }

  updateListingPrice(listingId: string, newPrice: number): ProductListing | null {
    const idx = this.listings.findIndex(l => l.id === listingId);
    if (idx === -1) return null;
    const listing = this.listings[idx];
    const normalized = Number((newPrice / listing.packQuantity).toFixed(2));
    this.listings[idx] = {
      ...listing,
      packPrice: newPrice,
      normalizedUnitPrice: normalized,
      freshnessTimestamp: 'Just now',
      isStale: false
    };
    return this.listings[idx];
  }

  // Orders
  getOrders(): OrderRecord[] {
    return this.orders;
  }

  getOrderById(id: string): OrderRecord | undefined {
    return this.orders.find(o => o.id === id);
  }

  createOrder(order: OrderRecord): OrderRecord {
    this.orders = [order, ...this.orders];
    return order;
  }

  updateOrderStatus(orderId: string, status: OrderRecord['status']): OrderRecord | null {
    const idx = this.orders.findIndex(o => o.id === orderId);
    if (idx === -1) return null;
    this.orders[idx] = {
      ...this.orders[idx],
      status
    };
    return this.orders[idx];
  }

  // Prescriptions
  getPrescriptions(): PrescriptionRecord[] {
    return this.prescriptions;
  }

  addPrescription(rx: PrescriptionRecord): PrescriptionRecord {
    this.prescriptions = [rx, ...this.prescriptions];
    return rx;
  }

  // Subscriptions
  getSubscriptions(): ChronicSubscription[] {
    return this.subscriptions;
  }

  createSubscription(sub: ChronicSubscription): ChronicSubscription {
    this.subscriptions = [sub, ...this.subscriptions];
    return sub;
  }

  toggleSubscription(id: string): ChronicSubscription | null {
    const idx = this.subscriptions.findIndex(s => s.id === id);
    if (idx === -1) return null;
    const current = this.subscriptions[idx];
    const nextStatus: ChronicSubscription['status'] = current.status === 'active' ? 'paused' : 'active';
    this.subscriptions[idx] = { ...current, status: nextStatus };
    return this.subscriptions[idx];
  }

  updateSubscriptionInterval(id: string, interval: ChronicSubscription['intervalDays']): ChronicSubscription | null {
    const idx = this.subscriptions.findIndex(s => s.id === id);
    if (idx === -1) return null;
    this.subscriptions[idx] = { ...this.subscriptions[idx], intervalDays: interval };
    return this.subscriptions[idx];
  }

  triggerSubscriptionRefill(id: string): ChronicSubscription | null {
    const idx = this.subscriptions.findIndex(s => s.id === id);
    if (idx === -1) return null;
    this.subscriptions[idx] = { ...this.subscriptions[idx], nextRefillDate: 'Dispensing Now' };
    return this.subscriptions[idx];
  }

  // Reviews
  getReviews(): ProductReview[] {
    return this.reviews;
  }

  createReview(review: ProductReview): ProductReview {
    this.reviews = [review, ...this.reviews];
    return review;
  }

  moderateReview(id: string, status: 'approved' | 'flagged' | 'hidden'): ProductReview | null {
    const idx = this.reviews.findIndex(r => r.id === id);
    if (idx === -1) return null;
    this.reviews[idx] = { ...this.reviews[idx], status };
    return this.reviews[idx];
  }

  // Batches
  getBatches(): MedicineBatchRecord[] {
    return this.batchRecords;
  }

  updateBatchStatus(batchId: string, status: MedicineBatchRecord['status']): MedicineBatchRecord | null {
    const idx = this.batchRecords.findIndex(b => b.id === batchId);
    if (idx === -1) return null;
    this.batchRecords[idx] = { ...this.batchRecords[idx], status };
    return this.batchRecords[idx];
  }

  // Support Tickets
  getTickets(): SupportTicket[] {
    return this.supportTickets;
  }

  createTicket(ticket: SupportTicket): SupportTicket {
    this.supportTickets = [ticket, ...this.supportTickets];
    return ticket;
  }

  replyTicket(ticketId: string, message: SupportTicket['messages'][0]): SupportTicket | null {
    const idx = this.supportTickets.findIndex(t => t.id === ticketId);
    if (idx === -1) return null;
    this.supportTickets[idx] = {
      ...this.supportTickets[idx],
      messages: [...this.supportTickets[idx].messages, message]
    };
    return this.supportTickets[idx];
  }

  resolveTicket(ticketId: string, note: string, refund?: number): SupportTicket | null {
    const idx = this.supportTickets.findIndex(t => t.id === ticketId);
    if (idx === -1) return null;
    this.supportTickets[idx] = {
      ...this.supportTickets[idx],
      status: 'Resolved',
      resolutionNote: note,
      refundIssued: refund
    };
    return this.supportTickets[idx];
  }

  // Section 18 Audit Logs
  getAuditLogs(): AuditRecord[] {
    return this.auditLogs;
  }

  appendAudit(record: Omit<AuditRecord, 'id' | 'timestamp'>): AuditRecord {
    const newRecord: AuditRecord = {
      ...record,
      id: `audit-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      timestamp: new Date().toISOString()
    };
    this.auditLogs = [newRecord, ...this.auditLogs];
    return newRecord;
  }

  // Operational Exceptions
  getExceptions(): OperationalException[] {
    return this.exceptions;
  }

  resolveException(id: string, resolution: string): OperationalException | null {
    const idx = this.exceptions.findIndex(e => e.id === id);
    if (idx === -1) return null;
    this.exceptions[idx] = {
      ...this.exceptions[idx],
      status: 'resolved',
      resolutionOptions: [...this.exceptions[idx].resolutionOptions, `Resolved: ${resolution}`]
    };
    return this.exceptions[idx];
  }

  // User Profile
  getUserProfile(): UserProfile {
    return this.userProfile;
  }

  updateUserProfile(profile: Partial<UserProfile>): UserProfile {
    this.userProfile = { ...this.userProfile, ...profile };
    return this.userProfile;
  }

  // ABHA / ABDM
  getAbhaProfile(): AbhaProfile {
    return this.abhaProfile;
  }

  updateConsentStatus(consentId: string, status: AbdmConsentArtifact['status']): AbdmConsentArtifact | null {
    const idx = this.abhaProfile.consentArtifacts.findIndex(c => c.id === consentId);
    if (idx === -1) return null;
    this.abhaProfile.consentArtifacts[idx] = {
      ...this.abhaProfile.consentArtifacts[idx],
      status
    };
    return this.abhaProfile.consentArtifacts[idx];
  }

  // Rule 65 Dual Pharmacist Dispensing
  getDualDispenses(): DualPharmacistDispenseRecord[] {
    return this.dualPharmacistRecords;
  }

  addDualDispense(record: DualPharmacistDispenseRecord): DualPharmacistDispenseRecord {
    this.dualPharmacistRecords = [record, ...this.dualPharmacistRecords];
    return record;
  }

  // PvPI Pharmacovigilance
  getPvpiReports(): PvPiAdverseReactionReport[] {
    return this.pvpiReports;
  }

  addPvpiReport(report: PvPiAdverseReactionReport): PvPiAdverseReactionReport {
    this.pvpiReports = [report, ...this.pvpiReports];
    return report;
  }

  // National ERP Connectors
  getErpConnectors(): NationalErpConnector[] {
    return this.erpConnectors;
  }

  syncErpConnector(connectorId: string): NationalErpConnector | null {
    const idx = this.erpConnectors.findIndex(c => c.id === connectorId);
    if (idx === -1) return null;
    this.erpConnectors[idx] = {
      ...this.erpConnectors[idx],
      lastSyncTimestamp: 'Just now',
      syncStatus: 'online',
      totalMappedSkus: this.erpConnectors[idx].totalMappedSkus + Math.floor(Math.random() * 10) + 1
    };
    return this.erpConnectors[idx];
  }

  // Provenance & Epidemic
  getProvenanceLedger(): DrugProvenanceBlock[] {
    return this.provenanceLedger;
  }

  getEpidemicSignals(): EpidemicSurveillanceSignal[] {
    return this.epidemicSignals;
  }

  getBioequivalenceMetrics(): BioequivalenceClinicalMetrics[] {
    return this.bioequivalenceMetrics;
  }
}

export const store = new InMemoryStore();
