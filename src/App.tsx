import React, { useState } from 'react';
import {
  ActiveTab,
  AppScreen,
  HotlinkAsset,
  CartItem,
  OrderRecord,
  AuditRecord,
  OperationalException,
  ProductListing,
  CanonicalProduct,
  UserProfile,
  PrescriptionRecord,
  NotificationMessage,
  PaymentSession,
  AppUserRole,
  ChronicSubscription,
  ProductReview,
  MedicineBatchRecord,
  SupportTicket,
  SubscriptionIntervalDays,
  SupportedCurrency,
  SupportedLanguage,
  NationalErpConnector,
  AbhaProfile,
  AbdmConsentArtifact,
  DualPharmacistDispenseRecord,
  PvPiAdverseReactionReport
} from './types';
import { CoreAppLayout } from './components/CoreAppLayout';
import { ArchitectureDiagram } from './components/ArchitectureDiagram';
import { PrdViewer } from './components/PrdViewer';
import { HotlinkStudio } from './components/HotlinkStudio';
import { AuthModal } from './components/AuthModal';
import { NotificationToastContainer } from './components/NotificationToastContainer';
import { SubscriptionManagerModal } from './components/SubscriptionManagerModal';
import { LiveRouteTrackerModal } from './components/LiveRouteTrackerModal';
import { SupportTicketModal } from './components/SupportTicketModal';
import { TeleConsultationModal } from './components/TeleConsultationModal';
import { NationalNetworkModal } from './components/NationalNetworkModal';
import { AbhaHealthLockerModal } from './components/AbhaHealthLockerModal';
import { VoicePharmacistModal } from './components/VoicePharmacistModal';
import { RuralKioskModal } from './components/RuralKioskModal';
import { BlockchainProvenanceModal } from './components/BlockchainProvenanceModal';
import { EpidemicIntelligenceModal } from './components/EpidemicIntelligenceModal';
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
  PARTNER_GEOLOCATIONS,
  NATIONAL_ERP_CONNECTORS,
  SAMPLE_ABHA_PROFILE,
  SAMPLE_DUAL_DISPENSES,
  SAMPLE_PVPI_REPORTS
} from './data/genericMedData';
import {
  LayoutDashboard,
  Network,
  FileText,
  Image as ImageIcon,
  Layers,
  Sparkles,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
  ChevronRight,
  Store,
  Truck,
  Lock,
  Search,
  RotateCcw,
  LifeBuoy
} from 'lucide-react';

const GENERICMED_SCREENS: AppScreen[] = [
  {
    id: 'screen-discovery',
    name: 'Discovery & Normalized Comparison',
    role: 'customer',
    category: 'discovery',
    description: 'Requirement-aware generic medicine search, normalized unit price comparison (₹/tab), and transparent multi-factor ranking.',
    badge: 'SCR-01',
    imageUrl: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=1200&q=80',
    fallbackIcon: 'Search',
    features: [
      'Search by active generic salt or common brand equivalent (Crocin, Dolo, Lipitor)',
      'Normalized price comparison per single tablet/unit (FR-CORE-03)',
      'Explainable ranking factors (Price 40%, Trust 25%, Stock 20%, Feedback 15%)',
      'Side-by-side comparison matrix of up to 3 options (FR-CORE-04)',
      'Live cart and checkout with real-time stock/price revalidation (FR-CART-03)'
    ],
    status: 'Ready'
  },
  {
    id: 'screen-orders',
    name: 'Orders & Fulfillment Lifecycle',
    role: 'customer',
    category: 'orders',
    description: 'Track real-time order states from verified payment to pharmacy dispatch, and initiate one-click reorders for chronic meds.',
    badge: 'SCR-02',
    imageUrl: 'https://images.unsplash.com/photo-1576602976047-174e57a47881?auto=format&fit=crop&w=1200&q=80',
    fallbackIcon: 'Truck',
    features: [
      'Live fulfillment status timeline milestones (Created → Paid → Dispensed → Delivered)',
      'PRD Persona B: One-click repeat reorder without repeating search',
      'Live GPS fleet telemetry & Cold-Chain sensor monitoring (Phase 2)',
      'Integrated dispute support and clinical consultation desk (Phase 2)'
    ],
    status: 'Ready'
  },
  {
    id: 'screen-partner-store',
    name: 'Pharmacy Store Partner Portal',
    role: 'partner',
    category: 'partner',
    description: 'Empowers licensed medical stores and chemists to update inventory stock counts, maintain price freshness SLAs, and accept orders.',
    badge: 'SCR-03',
    imageUrl: 'https://images.unsplash.com/photo-1587854692152-cbe660dbde88?auto=format&fit=crop&w=1200&q=80',
    fallbackIcon: 'Store',
    features: [
      'Real-time medicine inventory stock and pack price updates',
      'Price freshness SLA tracking (<24h compliance per FR-PART-05)',
      'Batch Expiry Radar & Cold-Chain Telemetry (<180d near-expiry alerts) (Phase 2)',
      'Store financial growth analytics & SLA compliance metrics (Phase 2)'
    ],
    status: 'Ready'
  },
  {
    id: 'screen-admin-ops',
    name: 'Admin Governance & Exceptions',
    role: 'admin',
    category: 'admin',
    description: 'Operational exception resolution queue (stock/price mismatches), Section 18 audit ledger, and ranking algorithm configuration.',
    badge: 'SCR-04',
    imageUrl: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1200&q=80',
    fallbackIcon: 'Lock',
    features: [
      'Operational Exception Queue resolution with state tracking (FR-ADM-01)',
      'Section 18 immutable audit trail viewer with search and correlation tracing',
      'Customer Support & Dispute Desk with automated refund authorization (Phase 2)',
      'Patient Review compliance moderation under Drugs & Magic Remedies Act (Phase 2)'
    ],
    status: 'Ready'
  }
];

const INITIAL_HOTLINKS: HotlinkAsset[] = [
  {
    id: 'hotlink-banner',
    url: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=1200&q=80',
    title: 'Modern Clinical Tablets & Bio-Equivalent Blister Strip',
    screenTarget: 'screen-discovery',
    timestamp: '2026-09-08 10:15',
    status: 'active',
    dimensions: '1200x800'
  },
  {
    id: 'hotlink-partner',
    url: 'https://images.unsplash.com/photo-1587854692152-cbe660dbde88?auto=format&fit=crop&w=1200&q=80',
    title: 'Verified Licensed Pharmacy Chemist Storefront',
    screenTarget: 'screen-partner-store',
    timestamp: '2026-09-08 10:30',
    status: 'active',
    dimensions: '1200x800'
  }
];

export function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('app');
  const [screens, setScreens] = useState<AppScreen[]>(GENERICMED_SCREENS);
  const [activeScreenId, setActiveScreenId] = useState<string>('screen-discovery');
  const [hotlinks, setHotlinks] = useState<HotlinkAsset[]>(INITIAL_HOTLINKS);

  // Core Marketplace Domain State
  const [products] = useState<CanonicalProduct[]>(CANONICAL_PRODUCTS);
  const [listings, setListings] = useState<ProductListing[]>(PRODUCT_LISTINGS);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [orders, setOrders] = useState<OrderRecord[]>(INITIAL_ORDERS);
  const [auditLogs, setAuditLogs] = useState<AuditRecord[]>(INITIAL_AUDIT_LOGS);
  const [exceptions, setExceptions] = useState<OperationalException[]>(INITIAL_EXCEPTIONS);

  // Phase 1 MVP State: User Profiles & Prescriptions
  const [userProfile, setUserProfile] = useState<UserProfile>(DEFAULT_USER_PROFILE);
  const [prescriptions, setPrescriptions] = useState<PrescriptionRecord[]>(SAMPLE_PRESCRIPTIONS);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [notifications, setNotifications] = useState<NotificationMessage[]>([]);

  // Phase 2 State: Subscriptions, Reviews, Batches, Support Tickets
  const [subscriptions, setSubscriptions] = useState<ChronicSubscription[]>(SAMPLE_SUBSCRIPTIONS);
  const [reviews, setReviews] = useState<ProductReview[]>(SAMPLE_REVIEWS);
  const [batchRecords, setBatchRecords] = useState<MedicineBatchRecord[]>(SAMPLE_BATCH_RECORDS);
  const [supportTickets, setSupportTickets] = useState<SupportTicket[]>(SAMPLE_SUPPORT_TICKETS);

  // Phase 2 Modals Visibility
  const [isSubscriptionModalOpen, setIsSubscriptionModalOpen] = useState(false);
  const [isRouteTrackerOpen, setIsRouteTrackerOpen] = useState(false);
  const [selectedRouteOrder, setSelectedRouteOrder] = useState<OrderRecord | null>(null);
  const [isSupportModalOpen, setIsSupportModalOpen] = useState(false);
  const [supportInitialOrderId, setSupportInitialOrderId] = useState<string>('');

  // Phase 3 State: Localization, Tele-Consultation & B2B ERP Network
  const [activeCurrency, setActiveCurrency] = useState<SupportedCurrency>('INR');
  const [activeLanguage, setActiveLanguage] = useState<SupportedLanguage>('en');
  const [isTeleConsultationOpen, setIsTeleConsultationOpen] = useState(false);
  const [isNationalNetworkOpen, setIsNationalNetworkOpen] = useState(false);
  const [erpConnectors, setErpConnectors] = useState<NationalErpConnector[]>(NATIONAL_ERP_CONNECTORS);

  // Phase 4 & Phase 5 State: ABHA, Voice AI, Dual-Pharmacist, Blockchain & Epidemic AI
  const [abhaProfile, setAbhaProfile] = useState<AbhaProfile>(SAMPLE_ABHA_PROFILE);
  const [dualPharmacistRecords, setDualPharmacistRecords] = useState<DualPharmacistDispenseRecord[]>(SAMPLE_DUAL_DISPENSES);
  const [pvpiReports, setPvpiReports] = useState<PvPiAdverseReactionReport[]>(SAMPLE_PVPI_REPORTS);
  const [isAbhaModalOpen, setIsAbhaModalOpen] = useState(false);
  const [isVoicePharmacistOpen, setIsVoicePharmacistOpen] = useState(false);
  const [isRuralKioskOpen, setIsRuralKioskOpen] = useState(false);
  const [isBlockchainModalOpen, setIsBlockchainModalOpen] = useState(false);
  const [selectedProvenanceBatch, setSelectedProvenanceBatch] = useState('BATCH-MET-2025-C4');
  const [isEpidemicModalOpen, setIsEpidemicModalOpen] = useState(false);

  // Cart operations
  const handleAddToCart = (listing: ProductListing, canonicalProduct: CanonicalProduct) => {
    setCart(prev => {
      const existing = prev.find(item => item.listingId === listing.id);
      if (existing) {
        return prev.map(item =>
          item.listingId === listing.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { listingId: listing.id, listing, canonicalProduct, quantity: 1 }];
    });
  };

  const handleUpdateCartQty = (listingId: string, delta: number) => {
    setCart(prev =>
      prev
        .map(item => {
          if (item.listingId === listingId) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  const handleRemoveFromCart = (listingId: string) => {
    setCart(prev => prev.filter(item => item.listingId !== listingId));
  };

  const handleClearCart = () => {
    setCart([]);
  };

  // Upload prescription
  const handleUploadPrescription = (rx: PrescriptionRecord) => {
    setPrescriptions(prev => [rx, ...prev]);
    setUserProfile(prev => ({
      ...prev,
      activePrescriptionIds: [rx.id, ...prev.activePrescriptionIds]
    }));

    handleAppendAudit({
      actorId: userProfile.id,
      actorRole: 'Customer',
      actionType: 'PRESCRIPTION_UPLOAD_AND_OCR_VERIFY',
      entityType: 'PrescriptionRecord',
      entityId: rx.id,
      newState: rx.status,
      reason: `Prescription OCR matched Doctor ${rx.doctorName} (Reg #${rx.doctorRegNumber}) with active clinical salts.`,
      correlationId: `corr-rx-${Date.now().toString().slice(-6)}`,
      sourceContext: 'Prescription AI OCR Scanner'
    });
  };

  // Switch role
  const handleSwitchRole = (newRole: AppUserRole) => {
    setUserProfile(prev => ({ ...prev, role: newRole }));
    if (newRole === 'partner') {
      setActiveScreenId('screen-partner-store');
    } else if (newRole === 'admin') {
      setActiveScreenId('screen-admin-ops');
    } else {
      setActiveScreenId('screen-discovery');
    }
  };

  // Order Placement
  const handlePlaceOrder = (
    customerName: string,
    customerEmail: string,
    address: string,
    method?: string,
    idempotencyKey?: string
  ): OrderRecord => {
    const total = cart.reduce((sum, i) => sum + i.listing.packPrice * i.quantity, 0);
    const orderId = `ORD-${Math.floor(10000 + Math.random() * 90000)}`;
    const deliveryPin = `${Math.floor(1000 + Math.random() * 9000)}`;

    const newOrder: OrderRecord = {
      id: orderId,
      customerName,
      customerEmail,
      items: [...cart],
      totalAmount: total,
      status: 'Paid/Confirmed',
      paymentStatus: 'Verified Paid',
      createdAt: 'Just now',
      deliveryAddress: address,
      deliveryPin,
      paymentMethod: method || 'UPI Instant',
      idempotencyKey: idempotencyKey || `idemp-${Date.now()}`,
      trackingTimeline: [
        { status: 'Order Created & Payment Verified', timestamp: 'Just now', completed: true },
        { status: 'Transmitted to Partner Chemist for Dispensing', timestamp: 'Just now', completed: true },
        { status: 'Out for Express Delivery', timestamp: 'Est. in 15 mins', completed: false },
        { status: 'Delivered with Contactless Security PIN', timestamp: 'Pending', completed: false }
      ]
    };

    setOrders(prev => [newOrder, ...prev]);
    setCart([]);

    // Trigger simulated SMS confirmation
    const newSms: NotificationMessage = {
      id: `sms-${Date.now()}`,
      type: 'sms',
      recipient: userProfile.phone,
      title: 'Order Confirmed (Payment Reconciled)',
      body: `Your genericMed order #${orderId} of ₹${total.toFixed(2)} is verified. Fulfilling via local pharmacy partner. Handover PIN: ${deliveryPin}.`,
      timestamp: 'Just now',
      status: 'delivered',
      orderId
    };
    setNotifications(prev => [newSms, ...prev]);

    // Delayed courier dispatch update
    setTimeout(() => {
      const waAlert: NotificationMessage = {
        id: `wa-${Date.now()}`,
        type: 'whatsapp',
        recipient: userProfile.phone,
        title: 'Package Dispatched by Chemist',
        body: `Your generic medicine order #${orderId} is packed with tamper seal. Express courier on the way! Deliver PIN: ${deliveryPin}.`,
        timestamp: 'Just now',
        status: 'delivered',
        orderId
      };
      setNotifications(prev => [waAlert, ...prev]);
    }, 4000);

    // Append to Section 18 Audit Log
    handleAppendAudit({
      actorId: userProfile.id,
      actorRole: 'Customer',
      actionType: 'ORDER_CREATED_AND_PAID',
      entityType: 'Order',
      entityId: orderId,
      newState: 'Paid/Confirmed',
      reason: `Customer completed discovery checkout for ${newOrder.items.length} generic medicine(s). Total: ₹${total.toFixed(2)}. Method: ${method || 'UPI'}.`,
      correlationId: idempotencyKey || `corr-ord-${Math.floor(100000 + Math.random() * 900000)}`,
      sourceContext: 'Customer Checkout'
    });

    return newOrder;
  };

  const handlePaymentFailure = (errorMsg: string, session: PaymentSession) => {
    const excId = `EXC-${Math.floor(200 + Math.random() * 800)}`;
    const newExc: OperationalException = {
      id: excId,
      type: 'payment_mismatch',
      title: 'Payment Gateway Settlement Failure',
      description: `Payment intent of ₹${session.amount.toFixed(2)} failed via ${session.provider}. Reason: ${errorMsg}`,
      entityId: session.transactionRef,
      severity: 'critical',
      status: 'open',
      timestamp: 'Just now',
      resolutionOptions: ['Retry Settlement', 'Void Hold', 'Notify Customer']
    };
    setExceptions(prev => [newExc, ...prev]);

    handleAppendAudit({
      actorId: 'gateway-webhook',
      actorRole: 'System Worker',
      actionType: 'PAYMENT_TRANSACTION_FAILED',
      entityType: 'PaymentSession',
      entityId: session.transactionRef,
      newState: 'failed',
      reason: `Gateway error: ${errorMsg}. Logged operational exception #${excId}.`,
      correlationId: session.idempotencyKey,
      sourceContext: 'External Payment Gateway'
    });
  };

  const handleDismissNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  // Reorder (Persona B)
  const handleReorder = (order: OrderRecord) => {
    order.items.forEach(item => {
      handleAddToCart(item.listing, item.canonicalProduct);
    });
    setActiveScreenId('screen-discovery');
  };

  // Partner stock and price update
  const handleUpdateListingStock = (listingId: string, newStock: number) => {
    setListings(prev => prev.map(l => l.id === listingId ? { ...l, stockCount: newStock, freshnessTimestamp: 'Updated just now' } : l));
  };

  const handleUpdateListingPrice = (listingId: string, newPrice: number) => {
    setListings(prev => prev.map(l => {
      if (l.id === listingId) {
        const normalized = newPrice / l.packQuantity;
        return {
          ...l,
          packPrice: newPrice,
          normalizedUnitPrice: normalized,
          freshnessTimestamp: 'Updated just now'
        };
      }
      return l;
    }));
  };

  // Partner advances order state
  const handleUpdateOrderStatus = (orderId: string, newStatus: OrderRecord['status']) => {
    setOrders(prev => prev.map(o => {
      if (o.id === orderId) {
        const updatedTimeline = o.trackingTimeline.map(step => {
          if (newStatus === 'Accepted by Partner' && step.status.includes('Transmitted to Partner')) {
            return { ...step, completed: true, timestamp: 'Confirmed' };
          }
          if (newStatus === 'Out for Delivery' && step.status.includes('Out for Express Delivery')) {
            return { ...step, completed: true, timestamp: 'Dispatched' };
          }
          if (newStatus === 'Completed' && step.status.includes('Delivered')) {
            return { ...step, completed: true, timestamp: 'Delivered' };
          }
          return step;
        });

        return { ...o, status: newStatus, trackingTimeline: updatedTimeline };
      }
      return o;
    }));

    handleAppendAudit({
      actorId: 'partner-chemist',
      actorRole: 'Partner Staff',
      actionType: 'ORDER_STATUS_UPDATE',
      entityType: 'Order',
      entityId: orderId,
      newState: newStatus,
      reason: `Partner updated fulfillment status to ${newStatus}.`,
      correlationId: `corr-stat-${Date.now().toString().slice(-6)}`,
      sourceContext: 'Partner Portal'
    });
  };

  // Resolve operational exception
  const handleResolveException = (exceptionId: string, resolution: string) => {
    setExceptions(prev => prev.map(e => e.id === exceptionId ? { ...e, status: 'resolved' } : e));
    handleAppendAudit({
      actorId: 'admin-lead-arun',
      actorRole: 'Product Admin / Operations',
      actionType: 'EXCEPTION_RESOLVED',
      entityType: 'Operational Exception',
      entityId: exceptionId,
      previousState: 'open',
      newState: 'resolved',
      reason: `Resolution applied: "${resolution}"`,
      correlationId: `corr-exc-${Date.now().toString().slice(-6)}`,
      sourceContext: 'Admin Operations Portal'
    });
  };

  // Append Audit Record (Section 18.2)
  const handleAppendAudit = (record: Omit<AuditRecord, 'id' | 'timestamp'>) => {
    const newRecord: AuditRecord = {
      ...record,
      id: `AUD-${Math.floor(1000 + Math.random() * 9000)}`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19)
    };
    setAuditLogs(prev => [newRecord, ...prev]);
  };

  // Phase 2: Chronic Subscriptions Handlers
  const handleToggleSubscriptionStatus = (subscriptionId: string) => {
    setSubscriptions(prev => prev.map(s => {
      if (s.id === subscriptionId) {
        const nextStatus = s.status === 'active' ? 'paused' : 'active';
        handleAppendAudit({
          actorId: userProfile.id,
          actorRole: 'Customer',
          actionType: 'SUBSCRIPTION_STATUS_TOGGLE',
          entityType: 'ChronicSubscription',
          entityId: subscriptionId,
          previousState: s.status,
          newState: nextStatus,
          reason: `Customer toggled subscription status to ${nextStatus}.`,
          correlationId: `corr-sub-${Date.now().toString().slice(-6)}`,
          sourceContext: 'Subscription Manager'
        });
        return { ...s, status: nextStatus };
      }
      return s;
    }));
  };

  const handleChangeSubscriptionInterval = (subscriptionId: string, intervalDays: SubscriptionIntervalDays) => {
    setSubscriptions(prev => prev.map(s => {
      if (s.id === subscriptionId) {
        handleAppendAudit({
          actorId: userProfile.id,
          actorRole: 'Customer',
          actionType: 'SUBSCRIPTION_INTERVAL_CHANGE',
          entityType: 'ChronicSubscription',
          entityId: subscriptionId,
          previousState: `${s.intervalDays} days`,
          newState: `${intervalDays} days`,
          reason: `Refill schedule adjusted to every ${intervalDays} days.`,
          correlationId: `corr-sub-${Date.now().toString().slice(-6)}`,
          sourceContext: 'Subscription Manager'
        });
        return { ...s, intervalDays };
      }
      return s;
    }));
  };

  const handleTriggerSubscriptionRefill = (sub: ChronicSubscription) => {
    const orderId = `ORD-SUB-${Math.floor(10000 + Math.random() * 90000)}`;
    const newOrder: OrderRecord = {
      id: orderId,
      customerName: userProfile.name,
      customerEmail: userProfile.email,
      items: [{ listingId: sub.listing.id, listing: sub.listing, canonicalProduct: sub.canonicalProduct, quantity: sub.quantity }],
      totalAmount: sub.listing.packPrice * sub.quantity * 0.95, // 5% subscriber savings
      status: 'Paid/Confirmed',
      paymentStatus: 'Verified Paid',
      createdAt: 'Just now',
      deliveryAddress: sub.deliveryAddress,
      deliveryPin: `${Math.floor(1000 + Math.random() * 9000)}`,
      paymentMethod: sub.autoPayMethod,
      idempotencyKey: `idemp-sub-refill-${Date.now()}`,
      trackingTimeline: [
        { status: 'Auto-Refill Pre-Authorized & Paid', timestamp: 'Just now', completed: true },
        { status: 'Transmitted to Partner for Urgent Packing', timestamp: 'Just now', completed: true },
        { status: 'Out for Express Delivery', timestamp: 'Est. 20 mins', completed: false },
        { status: 'Delivered with Contactless Security PIN', timestamp: 'Pending', completed: false }
      ]
    };

    setOrders(prev => [newOrder, ...prev]);
    setSubscriptions(prev => prev.map(s => s.id === sub.id ? { ...s, refillCount: s.refillCount + 1 } : s));

    const alertMsg: NotificationMessage = {
      id: `toast-${Date.now()}`,
      type: 'whatsapp',
      recipient: userProfile.phone,
      title: 'Chronic Refill Dispatched (5% Saved)',
      body: `Refill order #${orderId} for ${sub.canonicalProduct.canonicalName} has been pre-authorized via ${sub.autoPayMethod} and dispatched!`,
      timestamp: 'Just now',
      status: 'delivered',
      orderId
    };
    setNotifications(prev => [alertMsg, ...prev]);

    handleAppendAudit({
      actorId: 'scheduler-cron',
      actorRole: 'System Worker',
      actionType: 'CHRONIC_REFILL_DISPATCHED',
      entityType: 'Order',
      entityId: orderId,
      newState: 'Paid/Confirmed',
      reason: `Automated ${sub.intervalDays}-day refill cycle executed with pre-authorization token.`,
      correlationId: `corr-subrefill-${Date.now().toString().slice(-6)}`,
      sourceContext: 'Recurring Scheduler'
    });
  };

  const handleCreateSubscription = (
    product: CanonicalProduct,
    listing: ProductListing,
    interval: SubscriptionIntervalDays
  ) => {
    const subId = `sub-${Date.now().toString().slice(-6)}`;
    const unitSavings = Math.max(0, product.brandPriceRef - listing.normalizedUnitPrice);
    const newSub: ChronicSubscription = {
      id: subId,
      userId: userProfile.id,
      canonicalProduct: product,
      listing,
      quantity: 2,
      intervalDays: interval,
      startDate: 'Today',
      nextRefillDate: `In ${interval} days`,
      status: 'active',
      deliveryAddress: userProfile.addresses[0]?.street || 'Default Address',
      monthlySavings: parseFloat((unitSavings * 60).toFixed(2)),
      autoPayMethod: 'UPI AutoPay',
      refillCount: 0
    };

    setSubscriptions(prev => [newSub, ...prev]);

    const notif: NotificationMessage = {
      id: `sub-toast-${Date.now()}`,
      type: 'sms',
      recipient: userProfile.phone,
      title: 'Subscription Enrolled!',
      body: `Enrolled in recurring ${interval}-day delivery for ${product.canonicalName} with an extra 5% discount.`,
      timestamp: 'Just now',
      status: 'delivered'
    };
    setNotifications(prev => [notif, ...prev]);

    handleAppendAudit({
      actorId: userProfile.id,
      actorRole: 'Customer',
      actionType: 'SUBSCRIPTION_ENROLLED',
      entityType: 'ChronicSubscription',
      entityId: subId,
      newState: 'active',
      reason: `Enrolled in recurring ${interval}-day delivery. Projected annual savings: ₹${(newSub.monthlySavings * 12).toFixed(0)}.`,
      correlationId: `corr-newsub-${Date.now().toString().slice(-6)}`,
      sourceContext: 'Product Detail Monograph'
    });
  };

  // Phase 2: Patient Reviews Handlers
  const handleSubmitReview = (reviewData: Omit<ProductReview, 'id' | 'date' | 'helpfulCount' | 'status'>) => {
    const reviewId = `rev-${Date.now().toString().slice(-6)}`;
    const newReview: ProductReview = {
      ...reviewData,
      id: reviewId,
      date: 'Today',
      helpfulCount: 0,
      status: 'approved',
      pharmacistVerifiedNote: 'Verified bio-equivalence study compliant with Indian Pharmacopoeia standard.'
    };

    setReviews(prev => [newReview, ...prev]);

    handleAppendAudit({
      actorId: userProfile.id,
      actorRole: 'Customer',
      actionType: 'PATIENT_REVIEW_SUBMITTED',
      entityType: 'ProductReview',
      entityId: reviewId,
      newState: 'approved',
      reason: `Patient verified purchase review submitted for ${reviewData.productName}.`,
      correlationId: `corr-rev-${Date.now().toString().slice(-6)}`,
      sourceContext: 'Verified Review Modal'
    });
  };

  const handleModerateReview = (reviewId: string, action: 'approved' | 'flagged' | 'hidden') => {
    setReviews(prev => prev.map(r => r.id === reviewId ? { ...r, status: action } : r));
  };

  // Phase 2: Support Ticket Handlers
  const handleCreateSupportTicket = (
    ticketData: Omit<SupportTicket, 'id' | 'createdAt' | 'messages'>,
    initialMessage: string
  ) => {
    const ticketId = `CAS-${Math.floor(1000 + Math.random() * 9000)}`;
    const newTicket: SupportTicket = {
      ...ticketData,
      id: ticketId,
      createdAt: 'Just now',
      messages: [
        {
          id: `msg-${Date.now()}`,
          sender: 'customer',
          senderName: userProfile.name,
          text: initialMessage,
          timestamp: 'Just now'
        }
      ]
    };

    setSupportTickets(prev => [newTicket, ...prev]);

    // Simulated automated response from Pharmacist / Ops lead
    setTimeout(() => {
      const replyMsg = {
        id: `reply-${Date.now()}`,
        sender: 'pharmacist' as const,
        senderName: 'Dr. Anita Desai, Lead Pharmacist (Reg #5102)',
        text: `Thank you for reaching out regarding Order #${newTicket.orderId}. I am actively investigating this case and will assist you immediately.`,
        timestamp: 'Just now'
      };
      setSupportTickets(prev => prev.map(t => t.id === ticketId ? { ...t, messages: [...t.messages, replyMsg] } : t));
    }, 2000);

    handleAppendAudit({
      actorId: userProfile.id,
      actorRole: 'Customer',
      actionType: 'SUPPORT_TICKET_OPENED',
      entityType: 'SupportTicket',
      entityId: ticketId,
      newState: 'Open',
      reason: `Customer opened inquiry: "${ticketData.subject}" for Order ${ticketData.orderId}.`,
      correlationId: `corr-tkt-${Date.now().toString().slice(-6)}`,
      sourceContext: 'Customer Support Desk'
    });
  };

  const handleReplySupportTicket = (ticketId: string, text: string) => {
    setSupportTickets(prev => prev.map(t => {
      if (t.id === ticketId) {
        const newMsg = {
          id: `msg-${Date.now()}`,
          sender: 'customer' as const,
          senderName: userProfile.name,
          text,
          timestamp: 'Just now'
        };
        return { ...t, messages: [...t.messages, newMsg] };
      }
      return t;
    }));
  };

  const handleResolveSupportTicket = (ticketId: string, resolutionNote: string, refundAmount?: number) => {
    setSupportTickets(prev => prev.map(t => {
      if (t.id === ticketId) {
        return {
          ...t,
          status: 'Resolved',
          resolvedAt: 'Just now',
          resolutionNote,
          refundIssued: refundAmount
        };
      }
      return t;
    }));
  };

  // Phase 2: Batch status update
  const handleUpdateBatchStatus = (batchId: string, status: MedicineBatchRecord['status']) => {
    setBatchRecords(prev => prev.map(b => b.id === batchId ? { ...b, status } : b));
    handleAppendAudit({
      actorId: 'partner-pharmacist',
      actorRole: 'Partner Staff',
      actionType: 'BATCH_STATUS_CHANGE',
      entityType: 'MedicineBatchRecord',
      entityId: batchId,
      newState: status,
      reason: `Batch status changed to ${status} following regulatory cold-chain inspection.`,
      correlationId: `corr-batch-${Date.now().toString().slice(-6)}`,
      sourceContext: 'Partner Batch Radar'
    });
  };

  // Phase 3: Tele-Consultation Digital Rx Issuance & Auto-Cart Bridging
  const handleIssuePrescriptionFromTeleConsult = (
    rx: PrescriptionRecord,
    prescribedProducts: { product: CanonicalProduct; listing: ProductListing }[]
  ) => {
    setPrescriptions(prev => [rx, ...prev]);
    setUserProfile(prev => ({
      ...prev,
      activePrescriptionIds: [rx.id, ...prev.activePrescriptionIds]
    }));

    // Auto-populate cart with prescribed generic items
    prescribedProducts.forEach(({ product, listing }) => {
      handleAddToCart(listing, product);
    });

    handleAppendAudit({
      actorId: rx.doctorRegNumber,
      actorRole: 'System Worker',
      actionType: 'PRESCRIPTION_TELECONSULT_ISSUED',
      entityType: 'PrescriptionRecord',
      entityId: rx.id,
      newState: 'VERIFIED_ACTIVE',
      reason: `Tele-consultation with Dr. ${rx.doctorName} completed. Digital Rx generated with SHA-256 signature and auto-cart population.`,
      correlationId: `corr-tele-${Date.now().toString().slice(-6)}`,
      sourceContext: 'Tele-Consultation Video Clinic'
    });

    setNotifications(prev => [
      {
        id: `notif-tele-${Date.now()}`,
        type: 'in_app',
        recipient: userProfile.name,
        title: 'Digital Prescription Issued & Added to Cart',
        body: `Dr. ${rx.doctorName} (${rx.doctorRegNumber}) issued your renewed digital prescription for ${rx.prescribedSalts.join(', ')}. Generic items added to cart.`,
        timestamp: 'Just now',
        status: 'delivered'
      },
      ...prev
    ]);
  };

  // Phase 3: B2B ERP Network Sync Trigger
  const handleTriggerErpSync = (connectorId: string) => {
    setErpConnectors(prev =>
      prev.map(c => {
        if (c.id === connectorId) {
          return {
            ...c,
            lastSyncTimestamp: 'Just now',
            activeSyncStatus: 'synced',
            syncedSkuCount: c.syncedSkuCount + Math.floor(Math.random() * 10) + 1
          };
        }
        return c;
      })
    );

    handleAppendAudit({
      actorId: userProfile.id,
      actorRole: 'Partner Staff',
      actionType: 'ERP_DELTA_CATALOG_SYNC',
      entityType: 'NationalErpConnector',
      entityId: connectorId,
      newState: 'synced',
      reason: `Automated delta catalog synchronization executed with SLA compliance.`,
      correlationId: `corr-erp-${Date.now().toString().slice(-6)}`,
      sourceContext: 'ERP Connector'
    });
  };

  // Phase 4: ABDM Consent Status Update
  const handleUpdateConsent = (consentId: string, status: AbdmConsentArtifact['status']) => {
    setAbhaProfile(prev => ({
      ...prev,
      consentArtifacts: prev.consentArtifacts.map(c =>
        c.id === consentId ? { ...c, status } : c
      )
    }));

    handleAppendAudit({
      actorId: userProfile.id,
      actorRole: 'Customer',
      actionType: 'ABDM_CONSENT_STATE_CHANGE',
      entityType: 'AbdmConsentArtifact',
      entityId: consentId,
      newState: status,
      reason: `Patient modified ABDM clinical data-sharing consent status to ${status} under DPDP rules.`,
      correlationId: `corr-abdm-${Date.now().toString().slice(-6)}`,
      sourceContext: 'ABHA Consent Manager'
    });
  };

  // Phase 4: Dual-Pharmacist Dispense Authorization
  const handleCompleteDualDispense = (record: DualPharmacistDispenseRecord) => {
    setDualPharmacistRecords(prev => [record, ...prev]);

    // Update corresponding order status
    handleUpdateOrderStatus(record.orderId, 'Dispensed & Sealed with Quality Audit');

    handleAppendAudit({
      actorId: record.dispensePharmacist.licenseReg,
      actorRole: 'Partner Staff',
      actionType: 'DUAL_PHARMACIST_DISPENSE_AUTH',
      entityType: 'DualPharmacistDispenseRecord',
      entityId: record.id,
      newState: 'AUTHORIZED_SEALED',
      reason: `Section 65 two-pharmacist verification complete. QC: ${record.qcPharmacist.name}, Dispenser: ${record.dispensePharmacist.name}. Tamper Seal: ${record.tamperSealNumber}.`,
      correlationId: `corr-sec65-${Date.now().toString().slice(-6)}`,
      sourceContext: 'Dual Pharmacist Station'
    });
  };

  // Phase 4: PvPI Adverse Event Report
  const handleFilePvpiReport = (reportData: Omit<PvPiAdverseReactionReport, 'id' | 'filedAt' | 'ipcSubmissionStatus'>) => {
    const newReport: PvPiAdverseReactionReport = {
      ...reportData,
      id: `PVPI-IND-${Date.now().toString().slice(-4)}`,
      ipcSubmissionStatus: 'Submitted_to_PvPI',
      filedAt: 'Just now'
    };
    setPvpiReports(prev => [newReport, ...prev]);

    handleAppendAudit({
      actorId: userProfile.id,
      actorRole: 'Partner Staff',
      actionType: 'PVPI_ADVERSE_EVENT_FILED',
      entityType: 'PvPiAdverseReactionReport',
      entityId: newReport.id,
      newState: 'Submitted_to_PvPI',
      reason: `Adverse drug reaction yellow form filed directly to Indian Pharmacopoeia Commission for ${reportData.medicineName}.`,
      correlationId: `corr-pvpi-${Date.now().toString().slice(-6)}`,
      sourceContext: 'Pharmacovigilance Reporter'
    });
  };

  // Phase 4: Rural Kiosk Offline Queue Synchronization
  const handleSyncOfflineQueue = (count: number) => {
    handleAppendAudit({
      actorId: 'kiosk-pmbjp-del-104',
      actorRole: 'Partner Staff',
      actionType: 'RURAL_KIOSK_OFFLINE_SYNC',
      entityType: 'JanAushadhiKioskSession',
      entityId: 'KIOSK-PMBJP-DL-104',
      newState: 'SYNCHRONIZED',
      reason: `Synchronized ${count} offline kiosk cash transactions from PMBJP Kendra into national marketplace ledger.`,
      correlationId: `corr-kiosk-${Date.now().toString().slice(-6)}`,
      sourceContext: 'Rural Jan Aushadhi POS'
    });
  };

  // Hotlink Management
  const handleAddHotlink = (asset: HotlinkAsset) => {
    setHotlinks(prev => [asset, ...prev]);
  };

  const handleRemoveHotlink = (id: string) => {
    setHotlinks(prev => prev.filter(h => h.id !== id));
  };

  const handleBindScreenImage = (screenId: string, imageUrl: string) => {
    setScreens(prev => prev.map(s => s.id === screenId ? { ...s, imageUrl } : s));
  };

  return (
    <div id="app-root" className="min-h-screen bg-zinc-100 text-zinc-900 flex flex-col antialiased selection:bg-zinc-900 selection:text-white">
      {/* Top Main Navigation Header */}
      <header id="main-navigation-header" className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-zinc-200 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          {/* Brand Identity */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-zinc-900 text-white flex items-center justify-center font-bold text-base shadow-xs">
              gM
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-base tracking-tight text-zinc-900">
                  genericMed
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800 border border-emerald-200">
                  Phases 1–5 Operational
                </span>
              </div>
              <p className="text-[11px] text-zinc-500 hidden sm:block">
                Requirement-aware generic medicine discovery, comparison and purchase marketplace
              </p>
            </div>
          </div>

          {/* Primary View Switcher Tabs */}
          <nav id="app-tab-navigation" className="flex items-center bg-zinc-100 p-1 rounded-xl border border-zinc-200 text-xs">
            <button
              id="nav-tab-app"
              onClick={() => setActiveTab('app')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-semibold transition-all ${
                activeTab === 'app'
                  ? 'bg-white text-zinc-900 shadow-xs'
                  : 'text-zinc-600 hover:text-zinc-900'
              }`}
            >
              <LayoutDashboard className="w-3.5 h-3.5" />
              <span>Application</span>
            </button>

            <button
              id="nav-tab-architecture"
              onClick={() => setActiveTab('architecture')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-semibold transition-all ${
                activeTab === 'architecture'
                  ? 'bg-white text-zinc-900 shadow-xs'
                  : 'text-zinc-600 hover:text-zinc-900'
              }`}
            >
              <Network className="w-3.5 h-3.5" />
              <span>Architecture</span>
            </button>

            <button
              id="nav-tab-prd"
              onClick={() => setActiveTab('prd')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-semibold transition-all ${
                activeTab === 'prd'
                  ? 'bg-white text-zinc-900 shadow-xs'
                  : 'text-zinc-600 hover:text-zinc-900'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>PRD Specs (25 Sec)</span>
            </button>

            <button
              id="nav-tab-photos"
              onClick={() => setActiveTab('photos')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-semibold transition-all ${
                activeTab === 'photos'
                  ? 'bg-white text-zinc-900 shadow-xs'
                  : 'text-zinc-600 hover:text-zinc-900'
              }`}
            >
              <ImageIcon className="w-3.5 h-3.5" />
              <span>Hotlink Studio</span>
            </button>
          </nav>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {activeTab === 'app' && (
          <CoreAppLayout
            screens={screens}
            activeScreenId={activeScreenId}
            onSelectScreen={(id) => setActiveScreenId(id)}
            hotlinks={hotlinks}
            onOpenStudio={() => setActiveTab('photos')}
            onOpenArchitecture={() => setActiveTab('architecture')}
            onOpenPrd={() => setActiveTab('prd')}
            products={products}
            listings={listings}
            cart={cart}
            orders={orders}
            auditLogs={auditLogs}
            exceptions={exceptions}
            userProfile={userProfile}
            onOpenAuth={() => setIsAuthModalOpen(true)}
            activePrescriptions={prescriptions}
            onUploadPrescription={handleUploadPrescription}
            onAddToCart={handleAddToCart}
            onUpdateCartQty={handleUpdateCartQty}
            onRemoveFromCart={handleRemoveFromCart}
            onClearCart={handleClearCart}
            onPlaceOrder={handlePlaceOrder}
            onPaymentFailure={handlePaymentFailure}
            onReorder={handleReorder}
            onUpdateListingStock={handleUpdateListingStock}
            onUpdateListingPrice={handleUpdateListingPrice}
            onUpdateOrderStatus={handleUpdateOrderStatus}
            onResolveException={handleResolveException}
            onAppendAudit={handleAppendAudit}
            // Phase 2 props
            subscriptions={subscriptions}
            reviews={reviews}
            batchRecords={batchRecords}
            tickets={supportTickets}
            onOpenSubscriptions={() => setIsSubscriptionModalOpen(true)}
            onOpenRouteTracker={(order) => {
              setSelectedRouteOrder(order);
              setIsRouteTrackerOpen(true);
            }}
            onOpenSupportTicket={(orderId) => {
              setSupportInitialOrderId(orderId || orders[0]?.id || '');
              setIsSupportModalOpen(true);
            }}
            onOpenProductReviews={(productId) => {
              // Direct navigation to product reviews
              setActiveScreenId('screen-discovery');
            }}
            onSubscribe={handleCreateSubscription}
            onSubmitReview={handleSubmitReview}
            onModerateReview={handleModerateReview}
            onResolveTicket={handleResolveSupportTicket}
            onUpdateBatchStatus={handleUpdateBatchStatus}
            // Phase 3 props
            currency={activeCurrency}
            onCurrencyChange={setActiveCurrency}
            language={activeLanguage}
            onLanguageChange={setActiveLanguage}
            onOpenTeleConsult={() => setIsTeleConsultationOpen(true)}
            onOpenNationalNetwork={() => setIsNationalNetworkOpen(true)}
            erpConnectors={erpConnectors}
            // Phase 4 & Phase 5 props
            onOpenAbhaLocker={() => setIsAbhaModalOpen(true)}
            onOpenVoicePharmacist={() => setIsVoicePharmacistOpen(true)}
            onOpenBlockchainProvenance={(batch) => {
              if (batch) setSelectedProvenanceBatch(batch);
              setIsBlockchainModalOpen(true);
            }}
            onOpenEpidemicIntelligence={() => setIsEpidemicModalOpen(true)}
            onOpenRuralKiosk={() => setIsRuralKioskOpen(true)}
            dualPharmacistRecords={dualPharmacistRecords}
            onCompleteDualDispense={handleCompleteDualDispense}
            onFilePvpiReport={handleFilePvpiReport}
            pvpiReports={pvpiReports}
          />
        )}

        {activeTab === 'architecture' && (
          <ArchitectureDiagram />
        )}

        {activeTab === 'prd' && (
          <PrdViewer />
        )}

        {activeTab === 'photos' && (
          <HotlinkStudio
            hotlinks={hotlinks}
            onAddHotlink={handleAddHotlink}
            onRemoveHotlink={handleRemoveHotlink}
            screens={screens}
            onBindScreenImage={handleBindScreenImage}
            onNavigateToScreen={(id) => {
              setActiveScreenId(id);
              setActiveTab('app');
            }}
          />
        )}
      </main>

      {/* Auth & Session Profile Modal (PRD FR-AUTH-01 to 04) */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        user={userProfile}
        onUpdateUser={(updated) => setUserProfile(updated)}
        onSwitchRole={handleSwitchRole}
      />

      {/* Phase 2: Chronic Subscription Manager Modal */}
      <SubscriptionManagerModal
        isOpen={isSubscriptionModalOpen}
        onClose={() => setIsSubscriptionModalOpen(false)}
        subscriptions={subscriptions}
        onToggleStatus={handleToggleSubscriptionStatus}
        onChangeInterval={handleChangeSubscriptionInterval}
        onTriggerRefill={handleTriggerSubscriptionRefill}
        onNavigateToDiscovery={() => {
          setIsSubscriptionModalOpen(false);
          setActiveScreenId('screen-discovery');
          setActiveTab('app');
        }}
      />

      {/* Phase 2: Live Route & Cold-Chain Telemetry Modal */}
      {selectedRouteOrder && (
        <LiveRouteTrackerModal
          isOpen={isRouteTrackerOpen}
          onClose={() => setIsRouteTrackerOpen(false)}
          order={selectedRouteOrder}
          partnerLocation={PARTNER_GEOLOCATIONS[selectedRouteOrder.items[0]?.listing.partnerId || 'partner-medplus']}
        />
      )}

      {/* Phase 2: Customer Support & Dispute Desk Modal */}
      <SupportTicketModal
        isOpen={isSupportModalOpen}
        onClose={() => setIsSupportModalOpen(false)}
        tickets={supportTickets}
        orders={orders}
        onCreateTicket={handleCreateSupportTicket}
        onReplyTicket={handleReplySupportTicket}
        initialOrderId={supportInitialOrderId}
      />

      {/* Phase 3: Tele-Consultation & Digital Rx Renewal Modal */}
      <TeleConsultationModal
        isOpen={isTeleConsultationOpen}
        onClose={() => setIsTeleConsultationOpen(false)}
        currency={activeCurrency}
        onIssuePrescription={handleIssuePrescriptionFromTeleConsult}
        patientName={userProfile.name}
      />

      {/* Phase 3: National Pharmacy Network & ERP Multi-Warehouse Routing Modal */}
      <NationalNetworkModal
        isOpen={isNationalNetworkOpen}
        onClose={() => setIsNationalNetworkOpen(false)}
        connectors={erpConnectors}
        onTriggerSync={handleTriggerErpSync}
        recentOrders={orders}
      />

      {/* Phase 4: ABHA Health Locker & ABDM Consent Manager Modal */}
      <AbhaHealthLockerModal
        isOpen={isAbhaModalOpen}
        onClose={() => setIsAbhaModalOpen(false)}
        profile={abhaProfile}
        onUpdateConsent={handleUpdateConsent}
      />

      {/* Phase 4: Arogya Vani Multilingual Voice Pharmacist Modal */}
      <VoicePharmacistModal
        isOpen={isVoicePharmacistOpen}
        onClose={() => setIsVoicePharmacistOpen(false)}
        onAddToCart={handleAddToCart}
        language={activeLanguage}
      />

      {/* Phase 4: Rural Jan Aushadhi Kendra Offline-First POS Kiosk Modal */}
      <RuralKioskModal
        isOpen={isRuralKioskOpen}
        onClose={() => setIsRuralKioskOpen(false)}
        onSyncOfflineQueue={handleSyncOfflineQueue}
      />

      {/* Phase 5: Enterprise Blockchain Drug Provenance Ledger Modal */}
      <BlockchainProvenanceModal
        isOpen={isBlockchainModalOpen}
        onClose={() => setIsBlockchainModalOpen(false)}
        batchNumber={selectedProvenanceBatch}
      />

      {/* Phase 5: Epidemic Disease Surveillance & Pharmacokinetic Intelligence Modal */}
      <EpidemicIntelligenceModal
        isOpen={isEpidemicModalOpen}
        onClose={() => setIsEpidemicModalOpen(false)}
      />

      {/* Simulated Transactional Notifications Container (PRD FR-NOTIF-01) */}
      <NotificationToastContainer
        notifications={notifications}
        onDismiss={handleDismissNotification}
        onViewOrder={(orderId) => {
          setActiveScreenId('screen-orders');
          setActiveTab('app');
        }}
      />

      {/* Persistent Status & Compliance Footer */}
      <footer id="main-footer" className="bg-white border-t border-zinc-200 mt-auto py-4 text-xs text-zinc-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="font-medium text-zinc-700">genericMed Enterprise Suite — All Phases (1 through 5) Operational</span>
            <span>•</span>
            <span className="font-mono">PRD v0.1 Specification (8 Sep 2026)</span>
          </div>

          <div className="flex items-center gap-4 text-[11px] text-zinc-400">
            <span>North Star: CQMO Active</span>
            <span>•</span>
            <span>NFR-PERF-01 P95 ≤2s</span>
            <span>•</span>
            <span>Section 18 Audit Trail Enforced</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
export default App;
