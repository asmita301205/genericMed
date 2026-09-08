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
