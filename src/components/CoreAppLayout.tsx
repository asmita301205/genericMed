import React, { useState } from 'react';
import {
  AppScreen,
  HotlinkAsset,
  CanonicalProduct,
  ProductListing,
  CartItem,
  OrderRecord,
  AuditRecord,
  OperationalException
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
  Sparkles
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
  onAddToCart: (listing: ProductListing, canonicalProduct: CanonicalProduct) => void;
  onUpdateCartQty: (listingId: string, delta: number) => void;
  onRemoveFromCart: (listingId: string) => void;
  onClearCart: () => void;
  onPlaceOrder: (name: string, email: string, address: string) => OrderRecord;
  onReorder: (order: OrderRecord) => void;
  onUpdateListingStock: (listingId: string, newStock: number) => void;
  onUpdateListingPrice: (listingId: string, newPrice: number) => void;
  onUpdateOrderStatus: (orderId: string, newStatus: OrderRecord['status']) => void;
  onResolveException: (exceptionId: string, resolution: string) => void;
  onAppendAudit: (record: Omit<AuditRecord, 'id' | 'timestamp'>) => void;
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
  onAddToCart,
  onUpdateCartQty,
  onRemoveFromCart,
  onClearCart,
  onPlaceOrder,
  onReorder,
  onUpdateListingStock,
  onUpdateListingPrice,
  onUpdateOrderStatus,
  onResolveException,
  onAppendAudit,
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
    <div id="core-app-layout-root" className="w-full max-w-7xl mx-auto space-y-6">
      {/* Top Application Header Bar */}
      <div id="app-header-strip" className="bg-white border border-zinc-200 rounded-xl p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              genericMed Interactive Application
            </span>
            <span className="text-xs font-mono text-zinc-500 bg-zinc-100 px-2 py-0.5 rounded">
              PRD v0.1 Specification Aligned
            </span>
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight text-zinc-900">
            {activeScreen.name}
          </h1>
          <p className="text-xs text-zinc-600">
            {activeScreen.description}
          </p>
        </div>

        {/* Viewport Mode Switcher & Navigation Shortcuts */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Responsive Viewport Simulator */}
          <div className="flex items-center bg-zinc-100 p-1 rounded-lg border border-zinc-200">
            <button
              id="viewport-desktop-btn"
              onClick={() => setViewportMode('desktop')}
              title="Desktop View (Full Width)"
              className={`p-1.5 rounded text-xs flex items-center gap-1.5 transition-colors ${
                viewportMode === 'desktop' ? 'bg-white text-zinc-900 shadow-xs font-medium' : 'text-zinc-600 hover:text-zinc-900'
              }`}
            >
              <Monitor className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Desktop</span>
            </button>
            <button
              id="viewport-tablet-btn"
              onClick={() => setViewportMode('tablet')}
              title="Tablet View (768px)"
              className={`p-1.5 rounded text-xs flex items-center gap-1.5 transition-colors ${
                viewportMode === 'tablet' ? 'bg-white text-zinc-900 shadow-xs font-medium' : 'text-zinc-600 hover:text-zinc-900'
              }`}
            >
              <Tablet className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Tablet</span>
            </button>
            <button
              id="viewport-mobile-btn"
              onClick={() => setViewportMode('mobile')}
              title="Mobile View (420px)"
              className={`p-1.5 rounded text-xs flex items-center gap-1.5 transition-colors ${
                viewportMode === 'mobile' ? 'bg-white text-zinc-900 shadow-xs font-medium' : 'text-zinc-600 hover:text-zinc-900'
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Mobile</span>
            </button>
          </div>

          <button
            onClick={onOpenPrd}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-zinc-200 bg-white hover:bg-zinc-50 text-xs font-medium text-zinc-700 shadow-xs"
          >
            <FileText className="w-3.5 h-3.5 text-zinc-500" />
            <span>PRD Specs</span>
          </button>
          <button
            onClick={onOpenArchitecture}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-zinc-200 bg-white hover:bg-zinc-50 text-xs font-medium text-zinc-700 shadow-xs"
          >
            <Layers className="w-3.5 h-3.5 text-zinc-500" />
            <span>Architecture</span>
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
            onAddToCart={onAddToCart}
            onUpdateCartQty={onUpdateCartQty}
            onRemoveFromCart={onRemoveFromCart}
            onClearCart={onClearCart}
            onPlaceOrder={onPlaceOrder}
            onNavigateToOrders={() => onSelectScreen('screen-orders')}
          />
        )}

        {activeScreen.id === 'screen-orders' && (
          <OrdersTracker
            orders={orders}
            onReorder={onReorder}
            onNavigateToDiscovery={() => onSelectScreen('screen-discovery')}
          />
        )}

        {activeScreen.id === 'screen-partner-store' && (
          <PartnerPortal
            listings={listings}
            products={products}
            orders={orders}
            onUpdateListingStock={onUpdateListingStock}
            onUpdateListingPrice={onUpdateListingPrice}
            onUpdateOrderStatus={onUpdateOrderStatus}
          />
        )}

        {activeScreen.id === 'screen-admin-ops' && (
          <AdminOperationsPortal
            auditLogs={auditLogs}
            exceptions={exceptions}
            onResolveException={onResolveException}
            onAppendAudit={onAppendAudit}
          />
        )}
      </div>
    </div>
  );
};
