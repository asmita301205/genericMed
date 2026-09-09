import React, { useState } from 'react';
import {
  AppScreen,
  HotlinkAsset,
  CanonicalProduct,
  ProductListing,
  CartItem,
  OrderRecord,
  AuditRecord,
  OperationalException,
  UserProfile,
  PrescriptionRecord,
  PaymentSession,
  ChronicSubscription,
  ProductReview,
  MedicineBatchRecord,
  SupportTicket,
  SubscriptionIntervalDays
} from '../types';
import { CustomerMarketplace } from './CustomerMarketplace';
import { OrdersTracker } from './OrdersTracker';
import { PartnerPortal } from './PartnerPortal';
import { AdminOperationsPortal } from './AdminOperationsPortal';
import {
  LayoutDashboard,
  Layers,
  FileText,
  Image as ImageIcon,
  Monitor,
  Tablet,
  Smartphone,
  Search,
  SlidersHorizontal,
  ArrowUpRight,
  ShieldCheck,
  CheckCircle2,
  Clock,
  ExternalLink,
  ChevronRight,
  Filter,
  User,
  Store,
  Lock,
  Sparkles,
  RotateCcw,
  LifeBuoy
} from 'lucide-react';

interface CoreAppLayoutProps {
  screens: AppScreen[];
  activeScreenId: string;
  onSelectScreen: (screenId: string) => void;
  hotlinks: HotlinkAsset[];
  onOpenStudio: () => void;
  onOpenArchitecture: () => void;
  onOpenPrd: () => void;
  products: CanonicalProduct[];
  listings: ProductListing[];
  cart: CartItem[];
  orders: OrderRecord[];
  auditLogs: AuditRecord[];
  exceptions: OperationalException[];
  userProfile: UserProfile;
  onOpenAuth: () => void;
  activePrescriptions?: PrescriptionRecord[];
  onUploadPrescription?: (rx: PrescriptionRecord) => void;
  onAddToCart: (listing: ProductListing, canonicalProduct: CanonicalProduct) => void;
  onUpdateCartQty: (listingId: string, delta: number) => void;
  onRemoveFromCart: (listingId: string) => void;
  onClearCart: () => void;
  onPlaceOrder: (name: string, email: string, address: string, method?: string, idempotencyKey?: string) => OrderRecord;
  onPaymentFailure?: (errMsg: string, session: PaymentSession) => void;
  onReorder: (order: OrderRecord) => void;
  onUpdateListingStock: (listingId: string, newStock: number) => void;
  onUpdateListingPrice: (listingId: string, newPrice: number) => void;
  onUpdateOrderStatus: (orderId: string, newStatus: OrderRecord['status']) => void;
  onResolveException: (exceptionId: string, resolution: string) => void;
  onAppendAudit: (record: Omit<AuditRecord, 'id' | 'timestamp'>) => void;
  // Phase 2 props
  subscriptions?: ChronicSubscription[];
  reviews?: ProductReview[];
  batchRecords?: MedicineBatchRecord[];
  tickets?: SupportTicket[];
  onOpenSubscriptions?: () => void;
  onOpenRouteTracker?: (order: OrderRecord) => void;
  onOpenSupportTicket?: (orderId: string) => void;
  onOpenProductReviews?: (productId: string) => void;
  onSubscribe?: (product: CanonicalProduct, listing: ProductListing, interval: SubscriptionIntervalDays) => void;
  onSubmitReview?: (review: Omit<ProductReview, 'id' | 'date' | 'helpfulCount' | 'status'>) => void;
  onModerateReview?: (reviewId: string, action: 'approved' | 'flagged' | 'hidden') => void;
  onResolveTicket?: (ticketId: string, resolutionNote: string, refundAmount?: number) => void;
  onUpdateBatchStatus?: (batchId: string, status: MedicineBatchRecord['status']) => void;
}

export const CoreAppLayout: React.FC<CoreAppLayoutProps> = ({
  screens,
  activeScreenId,
  onSelectScreen,
  hotlinks,
  onOpenStudio,
  onOpenArchitecture,
  onOpenPrd,
  products,
  listings,
  cart,
  orders,
  auditLogs,
  exceptions,
  userProfile,
  onOpenAuth,
  activePrescriptions,
  onUploadPrescription,
  onAddToCart,
  onUpdateCartQty,
  onRemoveFromCart,
  onClearCart,
  onPlaceOrder,
  onPaymentFailure,
  onReorder,
  onUpdateListingStock,
  onUpdateListingPrice,
  onUpdateOrderStatus,
  onResolveException,
  onAppendAudit,
  subscriptions = [],
  reviews = [],
  batchRecords = [],
  tickets = [],
  onOpenSubscriptions,
  onOpenRouteTracker,
  onOpenSupportTicket,
  onOpenProductReviews,
  onSubscribe,
  onSubmitReview,
  onModerateReview,
  onResolveTicket,
  onUpdateBatchStatus,
}) => {
  const [viewportMode, setViewportMode] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [roleFilter, setRoleFilter] = useState<'all' | 'customer' | 'partner' | 'admin'>('all');

  const activeScreen = screens.find(s => s.id === activeScreenId) || screens[0];

  const filteredScreens = screens.filter(s => {
    return roleFilter === 'all' || s.role === roleFilter;
  });

  const getViewportWidthClass = () => {
    switch (viewportMode) {
      case 'mobile': return 'max-w-[420px] mx-auto border-x border-zinc-300 shadow-2xl transition-all duration-300';
      case 'tablet': return 'max-w-[768px] mx-auto border-x border-zinc-300 shadow-xl transition-all duration-300';
      default: return 'w-full transition-all duration-300';
    }
  };

  return (
    <div id="core-layout-root" className="space-y-6">
      {/* Top Banner & Control Deck */}
      <div className="bg-white border border-zinc-200 rounded-2xl p-4 sm:p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Left: Active Screen Info */}
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs font-semibold px-2.5 py-0.5 rounded-full bg-zinc-100 text-zinc-700 border border-zinc-200">
              {activeScreen.badge}
            </span>
            <span className={`text-xs font-semibold px-2 py-0.5 rounded-full capitalize ${
              activeScreen.role === 'customer'
                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                : activeScreen.role === 'partner'
                ? 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                : 'bg-rose-50 text-rose-700 border border-rose-200'
            }`}>
              {activeScreen.role} Workspace
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-zinc-900">
            {activeScreen.name}
          </h2>
          <p className="text-xs text-zinc-500 max-w-xl">
            {activeScreen.description}
          </p>
        </div>

        {/* Right: Actions & Tools */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          {/* Viewport simulation switcher */}
          <div className="inline-flex rounded-lg border border-zinc-200 bg-zinc-50 p-1 text-xs">
            <button
              onClick={() => setViewportMode('desktop')}
              className={`p-1.5 rounded-md transition-colors ${
                viewportMode === 'desktop' ? 'bg-white text-zinc-900 shadow-xs' : 'text-zinc-500 hover:text-zinc-900'
              }`}
              title="Desktop View"
            >
              <Monitor className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setViewportMode('tablet')}
              className={`p-1.5 rounded-md transition-colors ${
                viewportMode === 'tablet' ? 'bg-white text-zinc-900 shadow-xs' : 'text-zinc-500 hover:text-zinc-900'
              }`}
              title="Tablet View"
            >
              <Tablet className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setViewportMode('mobile')}
              className={`p-1.5 rounded-md transition-colors ${
                viewportMode === 'mobile' ? 'bg-white text-zinc-900 shadow-xs' : 'text-zinc-500 hover:text-zinc-900'
              }`}
              title="Mobile View"
            >
              <Smartphone className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Chronic Subscriptions Quick Button (Phase 2) */}
          {onOpenSubscriptions && (
            <button
              id="subscriptions-header-btn"
              onClick={onOpenSubscriptions}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-blue-200 bg-blue-50 hover:bg-blue-100 text-xs font-semibold text-blue-900 shadow-xs transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5 text-blue-600" />
              <span className="hidden sm:inline">Subscriptions</span>
              <span className="text-[10px] font-mono px-1 py-0.2 rounded bg-blue-200/80 text-blue-800">
                {subscriptions.length}
              </span>
            </button>
          )}

          {/* Support Desk Quick Button (Phase 2) */}
          {onOpenSupportTicket && (
            <button
              id="support-header-btn"
              onClick={() => onOpenSupportTicket('')}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-rose-200 bg-rose-50 hover:bg-rose-100 text-xs font-semibold text-rose-900 shadow-xs transition-colors"
            >
              <LifeBuoy className="w-3.5 h-3.5 text-rose-600" />
              <span className="hidden sm:inline">Support</span>
              <span className="text-[10px] font-mono px-1 py-0.2 rounded bg-rose-200/80 text-rose-800">
                {tickets.filter(t => t.status !== 'Resolved').length}
              </span>
            </button>
          )}

          {/* User Profile / Auth Trigger */}
          <button
            id="user-profile-header-btn"
            onClick={onOpenAuth}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-emerald-200 bg-emerald-50 hover:bg-emerald-100 text-xs font-semibold text-emerald-900 shadow-xs transition-colors"
          >
            <User className="w-3.5 h-3.5 text-emerald-700" />
            <span>{userProfile.name.split(' ')[0]}</span>
            <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-emerald-200/80 text-emerald-800">
              {userProfile.role}
            </span>
          </button>
        </div>
      </div>

      {/* Screen & Role Quick Selector Strip */}
      <div className="bg-white border border-zinc-200 rounded-xl p-3 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        {/* Role filters */}
        <div className="flex items-center gap-1.5">
          <span className="text-zinc-400 font-medium px-2">Role Context:</span>
          <button
            onClick={() => setRoleFilter('all')}
            className={`px-2.5 py-1 rounded-lg font-semibold transition-colors ${
              roleFilter === 'all' ? 'bg-zinc-900 text-white' : 'text-zinc-600 hover:bg-zinc-100'
            }`}
          >
            All Roles
          </button>
          <button
            onClick={() => setRoleFilter('customer')}
            className={`px-2.5 py-1 rounded-lg font-semibold transition-colors flex items-center gap-1 ${
              roleFilter === 'customer' ? 'bg-emerald-700 text-white' : 'text-zinc-600 hover:bg-zinc-100'
            }`}
          >
            <User className="w-3 h-3" />
            Customer (Persona A/B)
          </button>
          <button
            onClick={() => setRoleFilter('partner')}
            className={`px-2.5 py-1 rounded-lg font-semibold transition-colors flex items-center gap-1 ${
              roleFilter === 'partner' ? 'bg-indigo-700 text-white' : 'text-zinc-600 hover:bg-zinc-100'
            }`}
          >
            <Store className="w-3 h-3" />
            Pharmacy Partner (Persona C)
          </button>
          <button
            onClick={() => setRoleFilter('admin')}
            className={`px-2.5 py-1 rounded-lg font-semibold transition-colors flex items-center gap-1 ${
              roleFilter === 'admin' ? 'bg-rose-700 text-white' : 'text-zinc-600 hover:bg-zinc-100'
            }`}
          >
            <Lock className="w-3 h-3" />
            Admin & Ops (Persona E)
          </button>
        </div>

        {/* Screen Switcher Buttons */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {filteredScreens.map(s => {
            const isCurrent = s.id === activeScreen.id;
            return (
              <button
                key={s.id}
                id={`screen-nav-btn-${s.id}`}
                onClick={() => onSelectScreen(s.id)}
                className={`px-3 py-1.5 rounded-lg whitespace-nowrap font-medium transition-all ${
                  isCurrent
                    ? 'bg-zinc-900 text-white shadow-xs font-semibold'
                    : 'bg-zinc-100 text-zinc-700 hover:bg-zinc-200'
                }`}
              >
                {s.name}
              </button>
            );
          })}
        </div>
      </div>

      {/* Viewport Enclosed Container */}
      <div className={`${getViewportWidthClass()} transition-all`}>
        {/* Render Active Screen Component */}
        {activeScreen.id === 'screen-discovery' && (
          <CustomerMarketplace
            products={products}
            listings={listings}
            cart={cart}
            userProfile={userProfile}
            activePrescriptions={activePrescriptions}
            reviews={reviews}
            onAddToCart={onAddToCart}
            onUpdateCartQty={onUpdateCartQty}
            onRemoveFromCart={onRemoveFromCart}
            onClearCart={onClearCart}
            onPlaceOrder={onPlaceOrder}
            onPaymentFailure={onPaymentFailure}
            onUploadPrescription={onUploadPrescription}
            onNavigateToOrders={() => onSelectScreen('screen-orders')}
            onOpenSubscriptions={onOpenSubscriptions}
            onSubscribe={onSubscribe}
            onSubmitReview={onSubmitReview}
          />
        )}

        {activeScreen.id === 'screen-orders' && (
          <OrdersTracker
            orders={orders}
            onReorder={onReorder}
            onNavigateToDiscovery={() => onSelectScreen('screen-discovery')}
            onOpenRouteTracker={onOpenRouteTracker}
            onOpenSubscriptions={onOpenSubscriptions}
            onOpenSupportTicket={onOpenSupportTicket}
            onOpenProductReviews={onOpenProductReviews}
          />
        )}

        {activeScreen.id === 'screen-partner-store' && (
          <PartnerPortal
            listings={listings}
            products={products}
            orders={orders}
            batchRecords={batchRecords}
            onUpdateListingStock={onUpdateListingStock}
            onUpdateListingPrice={onUpdateListingPrice}
            onUpdateOrderStatus={onUpdateOrderStatus}
            onUpdateBatchStatus={onUpdateBatchStatus}
          />
        )}

        {activeScreen.id === 'screen-admin-ops' && (
          <AdminOperationsPortal
            auditLogs={auditLogs}
            exceptions={exceptions}
            tickets={tickets}
            reviews={reviews}
            onResolveException={onResolveException}
            onAppendAudit={onAppendAudit}
            onResolveTicket={onResolveTicket}
            onModerateReview={onModerateReview}
          />
        )}
      </div>
    </div>
  );
};
