import React, { useState } from 'react';
import { ActiveTab, AppScreen, HotlinkAsset, CartItem, OrderRecord, AuditRecord, OperationalException, ProductListing, CanonicalProduct } from './types';
import { CoreAppLayout } from './components/CoreAppLayout';
import { ArchitectureDiagram } from './components/ArchitectureDiagram';
import { PrdViewer } from './components/PrdViewer';
import { HotlinkStudio } from './components/HotlinkStudio';
import {
  CANONICAL_PRODUCTS,
  PRODUCT_LISTINGS,
  INITIAL_ORDERS,
  INITIAL_AUDIT_LOGS,
  INITIAL_EXCEPTIONS
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
  Search
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
      'Delivery address and recipient tracking',
      'Support case initiation for fulfillment issues'
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
      'Fulfillment order queue: Accept, Pack & Dispense, and Dispatch Courier',
      'Drug license verification and partner rating metrics'
    ],
    status: 'Ready'
  },
  {
    id: 'screen-admin-ops',
    name: 'Marketplace Operations & Governance',
    role: 'admin',
    category: 'admin',
    description: 'Central control plane for monitoring CQMO North Star metrics, resolving operational exceptions, and inspecting immutable audit logs.',
    badge: 'SCR-04',
    imageUrl: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1200&q=80',
    fallbackIcon: 'Lock',
    features: [
      'North Star Metric: Completed Qualified Medicine Orders (CQMO) counter',
      'Operational Exception Queue (Stock shortages, stale catalog alerts) (FR-ADM-04)',
      'Immutable Section 18 Audit Log with correlation IDs and state transitions',
      'Configurable Multi-Factor Ranking Weights model v1.4 (FR-CORE-06)'
    ],
    status: 'Ready'
  }
];

const INITIAL_HOTLINKS: HotlinkAsset[] = [
  {
    id: 'hl-para-pack',
    url: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=1200&q=80',
    title: 'Paracetamol IP 500mg Blister Packaging',
    screenTarget: 'screen-discovery',
    timestamp: '10:14 AM',
    status: 'active'
  },
  {
    id: 'hl-pharmacy-store',
    url: 'https://images.unsplash.com/photo-1587854692152-cbe660dbde88?auto=format&fit=crop&w=1200&q=80',
    title: 'MedPlus Licensed Chemist Pharmacy Hub',
    screenTarget: 'screen-partner-store',
    timestamp: '09:45 AM',
    status: 'active'
  },
  {
    id: 'hl-delivery-dispatch',
    url: 'https://images.unsplash.com/photo-1576602976047-174e57a47881?auto=format&fit=crop&w=1200&q=80',
    title: 'Express Courier Temperature-Controlled Dispatch',
    screenTarget: 'screen-orders',
    timestamp: '08:30 AM',
    status: 'active'
  }
];

export function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('app');
  const [screens, setScreens] = useState<AppScreen[]>(GENERICMED_SCREENS);
  const [activeScreenId, setActiveScreenId] = useState<string>('screen-discovery');
  const [hotlinks, setHotlinks] = useState<HotlinkAsset[]>(INITIAL_HOTLINKS);

  // genericMed domain state
  const [products] = useState<CanonicalProduct[]>(CANONICAL_PRODUCTS);
  const [listings, setListings] = useState<ProductListing[]>(PRODUCT_LISTINGS);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [orders, setOrders] = useState<OrderRecord[]>(INITIAL_ORDERS);
  const [auditLogs, setAuditLogs] = useState<AuditRecord[]>(INITIAL_AUDIT_LOGS);
  const [exceptions, setExceptions] = useState<OperationalException[]>(INITIAL_EXCEPTIONS);

  // Cart operations
  const handleAddToCart = (listing: ProductListing, canonicalProduct: CanonicalProduct) => {
    setCart(prev => {
      const existing = prev.find(i => i.listingId === listing.id);
      if (existing) {
        return prev.map(i => i.listingId === listing.id ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...prev, { listingId: listing.id, listing, canonicalProduct, quantity: 1 }];
    });
  };

  const handleUpdateCartQty = (listingId: string, delta: number) => {
    setCart(prev => {
      return prev.map(item => {
        if (item.listingId === listingId) {
          const newQty = item.quantity + delta;
          return newQty > 0 ? { ...item, quantity: newQty } : null;
        }
        return item;
      }).filter(Boolean) as CartItem[];
    });
  };

  const handleRemoveFromCart = (listingId: string) => {
    setCart(prev => prev.filter(i => i.listingId !== listingId));
  };

  const handleClearCart = () => {
    setCart([]);
  };

  // Order creation (FR-ORDER-01, CQMO)
  const handlePlaceOrder = (customerName: string, customerEmail: string, address: string): OrderRecord => {
    const total = cart.reduce((sum, item) => sum + (item.listing.packPrice * item.quantity), 0);
    const orderId = `ORD-2026-${Math.floor(1000 + Math.random() * 9000)}`;

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
      trackingTimeline: [
        { status: 'Order Created & Constraints Validated (FR-ORDER-01)', timestamp: 'Just now', completed: true },
        { status: 'Payment Reconciled & Verified via Gateway', timestamp: 'Just now', completed: true },
        { status: 'Fulfillment Order Transmitted to Partner Chemist', timestamp: 'In progress', completed: false },
        { status: 'Dispensed & Quality Sealed by Pharmacist', timestamp: 'Pending', completed: false },
        { status: 'Out for Express Delivery', timestamp: 'Pending', completed: false },
        { status: 'Delivered to Customer', timestamp: 'Expected in 45 mins', completed: false }
      ]
    };

    setOrders(prev => [newOrder, ...prev]);
    setCart([]);

    // Append to Section 18 Audit Log
    handleAppendAudit({
      actorId: 'customer-user',
      actorRole: 'Customer',
      actionType: 'ORDER_CREATED_AND_PAID',
      entityType: 'Order',
      entityId: orderId,
      newState: 'Paid/Confirmed',
      reason: `Customer completed discovery checkout for ${newOrder.items.length} generic medicine(s). Total: ₹${total.toFixed(2)}.`,
      correlationId: `corr-ord-${Math.floor(100000 + Math.random() * 900000)}`,
      sourceContext: 'Customer Checkout'
    });

    return newOrder;
  };

  // One-click Reorder (Persona B)
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
                  PRD Aligned
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
            onAddToCart={handleAddToCart}
            onUpdateCartQty={handleUpdateCartQty}
            onRemoveFromCart={handleRemoveFromCart}
            onClearCart={handleClearCart}
            onPlaceOrder={handlePlaceOrder}
            onReorder={handleReorder}
            onUpdateListingStock={handleUpdateListingStock}
            onUpdateListingPrice={handleUpdateListingPrice}
            onUpdateOrderStatus={handleUpdateOrderStatus}
            onResolveException={handleResolveException}
            onAppendAudit={handleAppendAudit}
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

      {/* Persistent Status & Compliance Footer */}
      <footer id="main-footer" className="bg-white border-t border-zinc-200 mt-auto py-4 text-xs text-zinc-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span className="font-medium text-zinc-700">genericMed Marketplace Production Prototype</span>
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
