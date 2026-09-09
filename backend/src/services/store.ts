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

import {
  ProductModel,
  ListingModel,
  OrderModel,
  PrescriptionModel,
  SubscriptionModel,
  ReviewModel,
  BatchModel,
  TicketModel,
  AuditLogModel,
  AbhaProfileModel,
  DualDispenseModel,
  PvpiReportModel,
  ErpConnectorModel
} from '../models/index.js';
import { isDbConnected } from './db.js';

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

  // Sync with MongoDB Atlas when connected
  async syncFromDb(): Promise<void> {
    if (!isDbConnected()) return;
    try {
      const [
        dbProducts,
        dbListings,
        dbOrders,
        dbPrescriptions,
        dbSubscriptions,
        dbReviews,
        dbBatches,
        dbTickets,
        dbAudits,
        dbAbha,
        dbDispenses,
        dbPvpi,
        dbErps
      ] = await Promise.all([
        ProductModel.find().lean(),
        ListingModel.find().lean(),
        OrderModel.find().sort({ createdAt: -1 }).lean(),
        PrescriptionModel.find().sort({ issueDate: -1 }).lean(),
        SubscriptionModel.find().lean(),
        ReviewModel.find().lean(),
        BatchModel.find().lean(),
        TicketModel.find().lean(),
        AuditLogModel.find().sort({ timestamp: -1 }).lean(),
        AbhaProfileModel.findOne().lean(),
        DualDispenseModel.find().lean(),
        PvpiReportModel.find().lean(),
        ErpConnectorModel.find().lean()
      ]);

      if (dbProducts?.length) this.products = dbProducts as any;
      if (dbListings?.length) this.listings = dbListings as any;
      if (dbOrders?.length) this.orders = dbOrders as any;
      if (dbPrescriptions?.length) this.prescriptions = dbPrescriptions as any;
      if (dbSubscriptions?.length) this.subscriptions = dbSubscriptions as any;
      if (dbReviews?.length) this.reviews = dbReviews as any;
      if (dbBatches?.length) this.batchRecords = dbBatches as any;
      if (dbTickets?.length) this.supportTickets = dbTickets as any;
      if (dbAudits?.length) this.auditLogs = dbAudits as any;
      if (dbAbha) this.abhaProfile = dbAbha as any;
      if (dbDispenses?.length) this.dualPharmacistRecords = dbDispenses as any;
      if (dbPvpi?.length) this.pvpiReports = dbPvpi as any;
      if (dbErps?.length) this.erpConnectors = dbErps as any;

      console.log(`🔄 [Store] Synchronized in-memory cache with MongoDB Atlas. Orders: ${this.orders.length}, Listings: ${this.listings.length}`);
    } catch (err) {
      console.warn('⚠️ [Store] Error syncing from MongoDB Atlas:', (err as Error).message);
    }
  }

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

    if (isDbConnected()) {
      ListingModel.updateOne(
        { id: listingId },
        { $set: { stockCount: newStock, isAvailable: newStock > 0, freshnessTimestamp: 'Just now', isStale: false } }
      ).then(() => {
        console.log(`💾 [MongoDB] Listing #${listingId} stock updated to ${newStock} in Atlas`);
      }).catch(err => {
        console.error('❌ [MongoDB] Error updating listing stock:', err);
      });
    }

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

    if (isDbConnected()) {
      ListingModel.updateOne(
        { id: listingId },
        { $set: { packPrice: newPrice, normalizedUnitPrice: normalized, freshnessTimestamp: 'Just now', isStale: false } }
      ).then(() => {
        console.log(`💾 [MongoDB] Listing #${listingId} price updated to ₹${newPrice} in Atlas`);
      }).catch(err => {
        console.error('❌ [MongoDB] Error updating listing price:', err);
      });
    }

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

    if (isDbConnected()) {
      OrderModel.create(order).then(() => {
        console.log(`💾 [MongoDB] Order #${order.id} (₹${order.totalAmount}) saved to Atlas collection 'orders'`);
      }).catch(err => {
        console.error('❌ [MongoDB] Error saving Order to Atlas:', err);
      });
    }

    return order;
  }

  updateOrderStatus(orderId: string, status: OrderRecord['status']): OrderRecord | null {
    const idx = this.orders.findIndex(o => o.id === orderId);
    if (idx === -1) return null;
    this.orders[idx] = {
      ...this.orders[idx],
      status
    };

    if (isDbConnected()) {
      OrderModel.updateOne(
        { id: orderId },
        { $set: { status } }
      ).then(() => {
        console.log(`💾 [MongoDB] Order #${orderId} status updated to '${status}' in Atlas`);
      }).catch(err => {
        console.error('❌ [MongoDB] Error updating Order status in Atlas:', err);
      });
    }

    return this.orders[idx];
  }

  // Prescriptions
  getPrescriptions(): PrescriptionRecord[] {
    return this.prescriptions;
  }

  addPrescription(rx: PrescriptionRecord): PrescriptionRecord {
    this.prescriptions = [rx, ...this.prescriptions];

    if (isDbConnected()) {
      PrescriptionModel.create(rx).then(() => {
        console.log(`💾 [MongoDB] Prescription #${rx.id} for ${rx.patientName} saved to Atlas collection 'prescriptions'`);
      }).catch(err => {
        console.error('❌ [MongoDB] Error saving Prescription in Atlas:', err);
      });
    }

    return rx;
  }

  // Subscriptions
  getSubscriptions(): ChronicSubscription[] {
    return this.subscriptions;
  }

  createSubscription(sub: ChronicSubscription): ChronicSubscription {
    this.subscriptions = [sub, ...this.subscriptions];

    if (isDbConnected()) {
      SubscriptionModel.create(sub).then(() => {
        console.log(`💾 [MongoDB] Subscription #${sub.id} saved to Atlas collection 'subscriptions'`);
      }).catch(err => {
        console.error('❌ [MongoDB] Error saving Subscription in Atlas:', err);
      });
    }

    return sub;
  }

  toggleSubscription(id: string): ChronicSubscription | null {
    const idx = this.subscriptions.findIndex(s => s.id === id);
    if (idx === -1) return null;
    const current = this.subscriptions[idx];
    const nextStatus: ChronicSubscription['status'] = current.status === 'active' ? 'paused' : 'active';
    this.subscriptions[idx] = { ...current, status: nextStatus };

    if (isDbConnected()) {
      SubscriptionModel.updateOne(
        { id },
        { $set: { status: nextStatus } }
      ).then(() => {
        console.log(`💾 [MongoDB] Subscription #${id} toggled to '${nextStatus}' in Atlas`);
      }).catch(err => {
        console.error('❌ [MongoDB] Error toggling Subscription in Atlas:', err);
      });
    }

    return this.subscriptions[idx];
  }

  updateSubscriptionInterval(id: string, interval: ChronicSubscription['intervalDays']): ChronicSubscription | null {
    const idx = this.subscriptions.findIndex(s => s.id === id);
    if (idx === -1) return null;
    this.subscriptions[idx] = { ...this.subscriptions[idx], intervalDays: interval };

    if (isDbConnected()) {
      SubscriptionModel.updateOne(
        { id },
        { $set: { intervalDays: interval } }
      ).catch(err => console.error('❌ [MongoDB] Error updating subscription interval:', err));
    }

    return this.subscriptions[idx];
  }

  triggerSubscriptionRefill(id: string): ChronicSubscription | null {
    const idx = this.subscriptions.findIndex(s => s.id === id);
    if (idx === -1) return null;
    this.subscriptions[idx] = { ...this.subscriptions[idx], nextRefillDate: 'Dispensing Now', refillCount: this.subscriptions[idx].refillCount + 1 };

    if (isDbConnected()) {
      SubscriptionModel.updateOne(
        { id },
        { $set: { nextRefillDate: 'Dispensing Now', refillCount: this.subscriptions[idx].refillCount } }
      ).catch(err => console.error('❌ [MongoDB] Error updating subscription refill:', err));
    }

    return this.subscriptions[idx];
  }

  // Reviews
  getReviews(): ProductReview[] {
    return this.reviews;
  }

  createReview(review: ProductReview): ProductReview {
    this.reviews = [review, ...this.reviews];

    if (isDbConnected()) {
      ReviewModel.create(review).then(() => {
        console.log(`💾 [MongoDB] Review #${review.id} saved to Atlas collection 'reviews'`);
      }).catch(err => {
        console.error('❌ [MongoDB] Error saving Review in Atlas:', err);
      });
    }

    return review;
  }

  moderateReview(id: string, status: 'approved' | 'flagged' | 'hidden'): ProductReview | null {
    const idx = this.reviews.findIndex(r => r.id === id);
    if (idx === -1) return null;
    this.reviews[idx] = { ...this.reviews[idx], status };

    if (isDbConnected()) {
      ReviewModel.updateOne({ id }, { $set: { status } }).catch(err => console.error('❌ [MongoDB] Error moderating review:', err));
    }

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

    if (isDbConnected()) {
      BatchModel.updateOne({ id: batchId }, { $set: { status } }).catch(err => console.error('❌ [MongoDB] Error updating batch status:', err));
    }

    return this.batchRecords[idx];
  }

  // Support Tickets
  getTickets(): SupportTicket[] {
    return this.supportTickets;
  }

  createTicket(ticket: SupportTicket): SupportTicket {
    this.supportTickets = [ticket, ...this.supportTickets];

    if (isDbConnected()) {
      TicketModel.create(ticket).then(() => {
        console.log(`💾 [MongoDB] Support Ticket #${ticket.id} saved to Atlas collection 'tickets'`);
      }).catch(err => {
        console.error('❌ [MongoDB] Error saving Ticket in Atlas:', err);
      });
    }

    return ticket;
  }

  replyTicket(ticketId: string, message: SupportTicket['messages'][0]): SupportTicket | null {
    const idx = this.supportTickets.findIndex(t => t.id === ticketId);
    if (idx === -1) return null;
    this.supportTickets[idx] = {
      ...this.supportTickets[idx],
      messages: [...this.supportTickets[idx].messages, message]
    };

    if (isDbConnected()) {
      TicketModel.updateOne(
        { id: ticketId },
        { $push: { messages: message } }
      ).catch(err => console.error('❌ [MongoDB] Error replying Ticket:', err));
    }

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

    if (isDbConnected()) {
      TicketModel.updateOne(
        { id: ticketId },
        { $set: { status: 'Resolved', resolutionNote: note, refundIssued: refund } }
      ).catch(err => console.error('❌ [MongoDB] Error resolving Ticket in Atlas:', err));
    }

    return this.supportTickets[idx];
  }

  // Section 18 Audit Logs
  getAuditLogs(): AuditRecord[] {
    return this.auditLogs;
  }

  appendAudit(record: Omit<AuditRecord, 'id' | 'timestamp'>): AuditRecord {
    const newRecord: AuditRecord = {
      ...record,
      id: `AUD-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      timestamp: new Date().toISOString()
    };
    this.auditLogs = [newRecord, ...this.auditLogs];

    if (isDbConnected()) {
      AuditLogModel.create(newRecord).then(() => {
        console.log(`💾 [MongoDB] Section 18 Audit #${newRecord.id} (${newRecord.actionType}) saved to Atlas`);
      }).catch(err => {
        console.error('❌ [MongoDB] Error saving Audit Record in Atlas:', err);
      });
    }

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

    if (isDbConnected()) {
      AbhaProfileModel.updateOne(
        { 'consentArtifacts.id': consentId },
        { $set: { 'consentArtifacts.$.status': status } }
      ).then(() => {
        console.log(`💾 [MongoDB] ABHA Consent #${consentId} status set to ${status} in Atlas`);
      }).catch(err => {
        console.error('❌ [MongoDB] Error updating ABHA Consent in Atlas:', err);
      });
    }

    return this.abhaProfile.consentArtifacts[idx];
  }

  // Rule 65 Dual Pharmacist Dispensing
  getDualDispenses(): DualPharmacistDispenseRecord[] {
    return this.dualPharmacistRecords;
  }

  addDualDispense(record: DualPharmacistDispenseRecord): DualPharmacistDispenseRecord {
    this.dualPharmacistRecords = [record, ...this.dualPharmacistRecords];

    if (isDbConnected()) {
      DualDispenseModel.create(record).then(() => {
        console.log(`💾 [MongoDB] Dual Pharmacist Dispense #${record.id} for Order #${record.orderId} saved to Atlas`);
      }).catch(err => {
        console.error('❌ [MongoDB] Error saving Dual Dispense in Atlas:', err);
      });
    }

    return record;
  }

  // PvPI Pharmacovigilance
  getPvpiReports(): PvPiAdverseReactionReport[] {
    return this.pvpiReports;
  }

  addPvpiReport(report: PvPiAdverseReactionReport): PvPiAdverseReactionReport {
    this.pvpiReports = [report, ...this.pvpiReports];

    if (isDbConnected()) {
      PvpiReportModel.create(report).then(() => {
        console.log(`💾 [MongoDB] PvPI Adverse Reaction #${report.id} saved to Atlas collection 'pvpireports'`);
      }).catch(err => {
        console.error('❌ [MongoDB] Error saving PvPI Report in Atlas:', err);
      });
    }

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

    if (isDbConnected()) {
      ErpConnectorModel.updateOne(
        { id: connectorId },
        { $set: { lastSyncTimestamp: 'Just now', syncStatus: 'online', totalMappedSkus: this.erpConnectors[idx].totalMappedSkus } }
      ).catch(err => console.error('❌ [MongoDB] Error syncing ERP in Atlas:', err));
    }

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
