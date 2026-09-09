import React, { useState } from 'react';
import { OrderRecord } from '../types';
import {
  Clock,
  Package,
  CheckCircle2,
  AlertCircle,
  Truck,
  RotateCcw,
  ShieldCheck,
  ChevronRight,
  ExternalLink,
  MessageSquare,
  Navigation,
  Star,
  Radio,
  Sparkles
} from 'lucide-react';

interface OrdersTrackerProps {
  orders: OrderRecord[];
  onReorder: (order: OrderRecord) => void;
  onNavigateToDiscovery: () => void;
  onOpenRouteTracker?: (order: OrderRecord) => void;
  onOpenSubscriptions?: () => void;
  onOpenSupportTicket?: (orderId: string) => void;
  onOpenProductReviews?: (productId: string) => void;
}

export const OrdersTracker: React.FC<OrdersTrackerProps> = ({
  orders,
  onReorder,
  onNavigateToDiscovery,
  onOpenRouteTracker,
  onOpenSubscriptions,
  onOpenSupportTicket,
  onOpenProductReviews,
}) => {
  const [selectedOrderId, setSelectedOrderId] = useState<string>(orders[0]?.id || '');

  const activeOrder = orders.find(o => o.id === selectedOrderId) || orders[0];

  return (
    <div id="orders-tracker-root" className="space-y-6">
      {/* Tracker Header */}
      <div className="bg-white border border-zinc-200 rounded-xl p-6 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-zinc-100 pb-5">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-800 border border-blue-200">
                <Truck className="w-3.5 h-3.5 text-blue-600" />
                PRD Section 9.7 & Phase 2: Repeat Care & Fleet Telemetry
              </span>
              <span className="text-xs font-mono text-zinc-500 bg-zinc-100 px-2 py-0.5 rounded">
                Persona B (Repeat Orders)
              </span>
            </div>
            <h2 className="text-2xl font-bold tracking-tight text-zinc-900">
              Orders, Fulfillment & Auto-Refills
            </h2>
            <p className="text-sm text-zinc-600">
              Track real-time courier GPS & cold-chain transit, configure recurring chronic subscriptions, and resolve fulfillment issues.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {onOpenSubscriptions && (
              <button
                onClick={onOpenSubscriptions}
                className="px-3.5 py-2.5 rounded-xl border border-blue-200 bg-blue-50 hover:bg-blue-100 text-xs font-semibold text-blue-800 transition-colors shadow-xs flex items-center gap-1.5"
              >
                <RotateCcw className="w-3.5 h-3.5 text-blue-600" />
                Chronic Subscriptions (5% Off)
              </button>
            )}

            <button
              onClick={onNavigateToDiscovery}
              className="px-4 py-2.5 rounded-xl border border-zinc-200 hover:bg-zinc-50 text-xs font-semibold text-zinc-800 transition-colors shadow-xs"
            >
              + New Medicine Search
            </button>
          </div>
        </div>

        {/* Quick Order Count Statistics */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 text-xs">
          <div className="p-2.5 rounded-lg bg-zinc-50 border border-zinc-100">
            <span className="text-zinc-500 block">Total Placed</span>
            <span className="text-zinc-900 font-bold font-mono">{orders.length} Completed / Active</span>
          </div>
          <div className="p-2.5 rounded-lg bg-zinc-50 border border-zinc-100">
            <span className="text-zinc-500 block">Active Delivery</span>
            <span className="text-blue-700 font-bold font-mono">
              {orders.filter(o => o.status === 'Out for Delivery' || o.status === 'Accepted by Partner').length} In Progress
            </span>
          </div>
          <div className="p-2.5 rounded-lg bg-zinc-50 border border-zinc-100">
            <span className="text-zinc-500 block">Payment Integrity</span>
            <span className="text-emerald-700 font-semibold">100% Reconciled</span>
          </div>
          <div className="p-2.5 rounded-lg bg-zinc-50 border border-zinc-100">
            <span className="text-zinc-500 block">GPS Telemetry</span>
            <span className="text-emerald-700 font-semibold flex items-center gap-1">
              <Radio className="w-3 h-3 text-emerald-600 animate-pulse" />
              Active Fleet Link
            </span>
          </div>
        </div>
      </div>

      {orders.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl border border-zinc-200 p-8 space-y-3">
          <Package className="w-10 h-10 text-zinc-300 mx-auto" />
          <h3 className="text-base font-semibold text-zinc-900">No Orders Placed Yet</h3>
          <p className="text-xs text-zinc-500 max-w-sm mx-auto">
            Discover generic medicines in the marketplace and complete a verified checkout to track your delivery here.
          </p>
          <button
            onClick={onNavigateToDiscovery}
            className="px-4 py-2 text-xs font-semibold rounded-lg bg-zinc-900 text-white shadow-xs"
          >
            Explore Medicines
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Order List (Left) */}
          <div className="lg:col-span-5 space-y-3">
            <div className="text-xs font-semibold text-zinc-500 uppercase tracking-wider px-1">
              Order History ({orders.length})
            </div>
            {orders.map(order => {
              const isSelected = order.id === activeOrder?.id;
              return (
                <div
                  key={order.id}
                  id={`order-card-${order.id}`}
                  onClick={() => setSelectedOrderId(order.id)}
                  className={`p-4 rounded-xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'border-zinc-900 bg-zinc-50/90 shadow-sm ring-2 ring-zinc-900/10'
                      : 'border-zinc-200 bg-white hover:border-zinc-300 shadow-xs'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-zinc-900">{order.id}</span>
                        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                          order.status === 'Completed'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-blue-50 text-blue-700 border border-blue-200'
                        }`}>
                          {order.status}
                        </span>
                      </div>
                      <p className="text-xs text-zinc-500 mt-1">{order.createdAt}</p>
                    </div>

                    <span className="text-sm font-mono font-bold text-zinc-900">
                      ₹{order.totalAmount.toFixed(2)}
                    </span>
                  </div>

                  <div className="mt-3 pt-2.5 border-t border-zinc-100 flex items-center justify-between text-xs text-zinc-600">
                    <span className="truncate max-w-[200px]">
                      {order.items.map(i => i.canonicalProduct.canonicalName).join(', ')}
                    </span>
                    <span className="text-[11px] text-zinc-400">
                      {order.items.reduce((s, i) => s + i.quantity, 0)} packs
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Active Order Detailed Tracking View (Right) */}
          {activeOrder && (
            <div className="lg:col-span-7 bg-white border border-zinc-200 rounded-xl p-6 shadow-xs space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-zinc-100 pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-bold text-zinc-900">Tracking: {activeOrder.id}</h3>
                    <span className="text-xs font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      {activeOrder.paymentStatus}
                    </span>
                  </div>
                  <p className="text-xs text-zinc-500 mt-0.5">
                    Recipient: <span className="font-medium text-zinc-800">{activeOrder.customerName}</span> ({activeOrder.customerEmail})
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {onOpenRouteTracker && (
                    <button
                      id={`live-route-btn-${activeOrder.id}`}
                      onClick={() => onOpenRouteTracker(activeOrder)}
                      className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold transition-colors shadow-xs"
                    >
                      <Navigation className="w-3.5 h-3.5" />
                      Live Route & Cold-Chain
                    </button>
                  )}

                  <button
                    id={`reorder-btn-${activeOrder.id}`}
                    onClick={() => onReorder(activeOrder)}
                    className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-white text-xs font-semibold transition-colors shadow-xs"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    Reorder
                  </button>
                </div>
              </div>

              {/* Items in this Order */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-zinc-900 block">Ordered Medicines</span>
                  {activeOrder.status === 'Completed' && onOpenProductReviews && (
                    <button
                      onClick={() => onOpenProductReviews(activeOrder.items[0]?.canonicalProduct.id)}
                      className="text-xs text-amber-700 hover:text-amber-800 font-semibold flex items-center gap-1"
                    >
                      <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                      Write Verified Review
                    </button>
                  )}
                </div>
                <div className="space-y-2">
                  {activeOrder.items.map(item => (
                    <div key={item.listingId} className="p-3 rounded-lg bg-zinc-50 border border-zinc-100 flex items-center justify-between text-xs">
                      <div>
                        <span className="font-bold text-zinc-900">{item.canonicalProduct.canonicalName}</span>
                        <div className="text-[11px] text-zinc-500">
                          {item.listing.partnerName} • {item.quantity} pack(s) ({item.listing.packQuantity} tabs each)
                        </div>
                      </div>
                      <span className="font-mono font-bold text-zinc-900">
                        ₹{(item.listing.packPrice * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Delivery Address */}
              <div className="p-3 rounded-lg border border-zinc-100 bg-zinc-50/50 text-xs flex items-center justify-between">
                <div>
                  <span className="text-zinc-400 block font-medium">Delivery Address</span>
                  <span className="text-zinc-800 font-medium">{activeOrder.deliveryAddress}</span>
                </div>
                {activeOrder.deliveryPin && (
                  <div className="text-right">
                    <span className="text-[10px] text-zinc-400 block">Security PIN</span>
                    <span className="font-mono font-bold text-zinc-900 text-sm">{activeOrder.deliveryPin}</span>
                  </div>
                )}
              </div>

              {/* Real-Time Timeline Milestones */}
              <div className="space-y-3">
                <span className="text-xs font-semibold text-zinc-900 block">
                  Fulfillment Status Timeline (FR-ORDER-03)
                </span>
                <div className="relative pl-6 space-y-4 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-zinc-200">
                  {activeOrder.trackingTimeline.map((step, idx) => (
                    <div key={idx} className="relative flex items-start gap-3 text-xs">
                      <div className={`absolute -left-6 top-0.5 w-4 h-4 rounded-full border-2 flex items-center justify-center bg-white ${
                        step.completed
                          ? 'border-emerald-600 bg-emerald-50 text-emerald-600'
                          : 'border-zinc-300 text-zinc-300'
                      }`}>
                        {step.completed && <CheckCircle2 className="w-3 h-3 text-emerald-600" />}
                      </div>

                      <div className="flex-1">
                        <span className={`font-semibold ${step.completed ? 'text-zinc-900' : 'text-zinc-400'}`}>
                          {step.status}
                        </span>
                        <span className="text-[11px] text-zinc-400 block mt-0.5">{step.timestamp}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Support & Issue Resolution */}
              <div className="pt-4 border-t border-zinc-100 flex items-center justify-between text-xs">
                <span className="text-zinc-500">Need help or dosage clarification?</span>
                <button
                  onClick={() => {
                    if (onOpenSupportTicket) {
                      onOpenSupportTicket(activeOrder.id);
                    }
                  }}
                  className="px-3 py-1.5 rounded-lg border border-zinc-200 hover:bg-zinc-50 text-zinc-800 font-semibold flex items-center gap-1.5 transition-colors shadow-2xs"
                >
                  <MessageSquare className="w-3.5 h-3.5 text-rose-500" />
                  Contact Fulfillment & Clinical Desk
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
