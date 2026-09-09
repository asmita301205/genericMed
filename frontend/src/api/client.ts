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
  AbdmConsentArtifact,
  DualPharmacistDispenseRecord,
  PvPiAdverseReactionReport,
  NationalErpConnector,
  DrugProvenanceBlock,
  EpidemicSurveillanceSignal
} from '../types';

import {
  CANONICAL_PRODUCTS,
  PRODUCT_LISTINGS,
  INITIAL_ORDERS,
  INITIAL_AUDIT_LOGS,
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
  SAMPLE_EPIDEMIC_SIGNALS
} from '../data/genericMedData';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api/v1';

async function apiRequest<T>(endpoint: string, options: RequestInit = {}, fallbackData?: T): Promise<T> {
  try {
    const url = `${BASE_URL}${endpoint}`;
    const res = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(options.headers || {})
      }
    });

    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }

    const json = await res.json();
    return json.data !== undefined ? json.data : json;
  } catch (error) {
    console.warn(`[genericMed API] Backend request to ${endpoint} failed, utilizing fallback data:`, error);
    if (fallbackData !== undefined) {
      return fallbackData;
    }
    throw error;
  }
}

export const apiClient = {
  // Health
  checkHealth: async (): Promise<{ status: string }> => {
    return apiRequest<{ status: string }>('/health', { method: 'GET' }, { status: 'fallback_mode' });
  },

  // Products & Listings
  getProducts: async (): Promise<CanonicalProduct[]> => {
    return apiRequest<CanonicalProduct[]>('/catalog/products', { method: 'GET' }, CANONICAL_PRODUCTS);
  },

  getListings: async (): Promise<ProductListing[]> => {
    return apiRequest<ProductListing[]>('/catalog/listings', { method: 'GET' }, PRODUCT_LISTINGS);
  },

  updateListingStock: async (listingId: string, stockCount: number): Promise<ProductListing> => {
    return apiRequest<ProductListing>(`/catalog/listings/${listingId}/stock`, {
      method: 'PATCH',
      body: JSON.stringify({ stockCount })
    });
  },

  updateListingPrice: async (listingId: string, packPrice: number): Promise<ProductListing> => {
    return apiRequest<ProductListing>(`/catalog/listings/${listingId}/price`, {
      method: 'PATCH',
      body: JSON.stringify({ packPrice })
    });
  },

  // Orders
  getOrders: async (): Promise<OrderRecord[]> => {
    return apiRequest<OrderRecord[]>('/orders', { method: 'GET' }, INITIAL_ORDERS);
  },

  createOrder: async (order: OrderRecord): Promise<OrderRecord> => {
    return apiRequest<OrderRecord>('/orders', {
      method: 'POST',
      body: JSON.stringify(order)
    }, order);
  },

  updateOrderStatus: async (orderId: string, status: OrderRecord['status']): Promise<OrderRecord> => {
    return apiRequest<OrderRecord>(`/orders/${orderId}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status })
    });
  },

  revalidateCart: async (items: { listingId: string; quantity: number }[]) => {
    return apiRequest('/orders/cart/revalidate', {
      method: 'POST',
      body: JSON.stringify({ items })
    }, { isValid: true, discrepancies: [] });
  },

  // Prescriptions
  getPrescriptions: async (): Promise<PrescriptionRecord[]> => {
    return apiRequest<PrescriptionRecord[]>('/prescriptions', { method: 'GET' }, SAMPLE_PRESCRIPTIONS);
  },

  uploadPrescription: async (rx: PrescriptionRecord): Promise<PrescriptionRecord> => {
    return apiRequest<PrescriptionRecord>('/prescriptions', {
      method: 'POST',
      body: JSON.stringify(rx)
    }, rx);
  },

  // Subscriptions
  getSubscriptions: async (): Promise<ChronicSubscription[]> => {
    return apiRequest<ChronicSubscription[]>('/subscriptions', { method: 'GET' }, SAMPLE_SUBSCRIPTIONS);
  },

  createSubscription: async (sub: ChronicSubscription): Promise<ChronicSubscription> => {
    return apiRequest<ChronicSubscription>('/subscriptions', {
      method: 'POST',
      body: JSON.stringify(sub)
    }, sub);
  },

  toggleSubscription: async (id: string): Promise<ChronicSubscription> => {
    return apiRequest<ChronicSubscription>(`/subscriptions/${id}/toggle`, {
      method: 'PATCH'
    });
  },

  updateSubscriptionInterval: async (id: string, intervalDays: ChronicSubscription['intervalDays']): Promise<ChronicSubscription> => {
    return apiRequest<ChronicSubscription>(`/subscriptions/${id}/interval`, {
      method: 'PATCH',
      body: JSON.stringify({ intervalDays })
    });
  },

  triggerSubscriptionRefill: async (id: string): Promise<ChronicSubscription> => {
    return apiRequest<ChronicSubscription>(`/subscriptions/${id}/refill`, {
      method: 'POST'
    });
  },

  // Reviews
  getReviews: async (): Promise<ProductReview[]> => {
    return apiRequest<ProductReview[]>('/reviews', { method: 'GET' }, SAMPLE_REVIEWS);
  },

  submitReview: async (review: ProductReview): Promise<ProductReview> => {
    return apiRequest<ProductReview>('/reviews', {
      method: 'POST',
      body: JSON.stringify(review)
    }, review);
  },

  moderateReview: async (id: string, status: 'approved' | 'flagged' | 'hidden'): Promise<ProductReview> => {
    return apiRequest<ProductReview>(`/reviews/${id}/moderate`, {
      method: 'PATCH',
      body: JSON.stringify({ status })
    });
  },

  // Batches
  getBatches: async (): Promise<MedicineBatchRecord[]> => {
    return apiRequest<MedicineBatchRecord[]>('/batches', { method: 'GET' }, SAMPLE_BATCH_RECORDS);
  },

  updateBatchStatus: async (id: string, status: MedicineBatchRecord['status']): Promise<MedicineBatchRecord> => {
    return apiRequest<MedicineBatchRecord>(`/batches/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status })
    });
  },

  // Support Tickets
  getTickets: async (): Promise<SupportTicket[]> => {
    return apiRequest<SupportTicket[]>('/tickets', { method: 'GET' }, SAMPLE_SUPPORT_TICKETS);
  },

  createTicket: async (ticket: SupportTicket): Promise<SupportTicket> => {
    return apiRequest<SupportTicket>('/tickets', {
      method: 'POST',
      body: JSON.stringify(ticket)
    }, ticket);
  },

  replyTicket: async (ticketId: string, message: SupportTicket['messages'][0]): Promise<SupportTicket> => {
    return apiRequest<SupportTicket>(`/tickets/${ticketId}/reply`, {
      method: 'POST',
      body: JSON.stringify(message)
    });
  },

  resolveTicket: async (ticketId: string, resolutionNote: string, refundAmount?: number): Promise<SupportTicket> => {
    return apiRequest<SupportTicket>(`/tickets/${ticketId}/resolve`, {
      method: 'PATCH',
      body: JSON.stringify({ resolutionNote, refundAmount })
    });
  },

  // Section 18 Audit Logs
  getAuditLogs: async (): Promise<AuditRecord[]> => {
    return apiRequest<AuditRecord[]>('/audit', { method: 'GET' }, INITIAL_AUDIT_LOGS);
  },

  appendAudit: async (record: Omit<AuditRecord, 'id' | 'timestamp'>): Promise<AuditRecord> => {
    return apiRequest<AuditRecord>('/audit', {
      method: 'POST',
      body: JSON.stringify(record)
    }, {
      ...record,
      id: `audit-${Date.now()}`,
      timestamp: new Date().toISOString()
    });
  },

  // ABHA / ABDM
  getAbhaProfile: async (): Promise<AbhaProfile> => {
    return apiRequest<AbhaProfile>('/abha/profile', { method: 'GET' }, SAMPLE_ABHA_PROFILE);
  },

  updateConsentStatus: async (consentId: string, status: AbdmConsentArtifact['status']): Promise<AbdmConsentArtifact> => {
    return apiRequest<AbdmConsentArtifact>(`/abha/consent/${consentId}`, {
      method: 'PATCH',
      body: JSON.stringify({ status })
    });
  },

  // Rule 65 Dual Pharmacist Dispensing
  getDualDispenses: async (): Promise<DualPharmacistDispenseRecord[]> => {
    return apiRequest<DualPharmacistDispenseRecord[]>('/dispense', { method: 'GET' }, SAMPLE_DUAL_DISPENSES);
  },

  createDualDispense: async (record: DualPharmacistDispenseRecord): Promise<DualPharmacistDispenseRecord> => {
    return apiRequest<DualPharmacistDispenseRecord>('/dispense', {
      method: 'POST',
      body: JSON.stringify(record)
    }, record);
  },

  // PvPI Pharmacovigilance
  getPvpiReports: async (): Promise<PvPiAdverseReactionReport[]> => {
    return apiRequest<PvPiAdverseReactionReport[]>('/pvpi', { method: 'GET' }, SAMPLE_PVPI_REPORTS);
  },

  filePvpiReport: async (reportData: any): Promise<PvPiAdverseReactionReport> => {
    return apiRequest<PvPiAdverseReactionReport>('/pvpi', {
      method: 'POST',
      body: JSON.stringify(reportData)
    });
  },

  // National ERP
  getErpConnectors: async (): Promise<NationalErpConnector[]> => {
    return apiRequest<NationalErpConnector[]>('/erp/connectors', { method: 'GET' }, NATIONAL_ERP_CONNECTORS);
  },

  syncErpConnector: async (connectorId: string): Promise<NationalErpConnector> => {
    return apiRequest<NationalErpConnector>('/erp/sync', {
      method: 'POST',
      body: JSON.stringify({ connectorId })
    });
  },

  // Provenance & Epidemic
  getProvenanceLedger: async (): Promise<DrugProvenanceBlock[]> => {
    return apiRequest<DrugProvenanceBlock[]>('/provenance/ledger', { method: 'GET' }, SAMPLE_PROVENANCE_LEDGER);
  },

  getEpidemicSignals: async (): Promise<EpidemicSurveillanceSignal[]> => {
    return apiRequest<EpidemicSurveillanceSignal[]>('/epidemic/signals', { method: 'GET' }, SAMPLE_EPIDEMIC_SIGNALS);
  }
};
