import React, { useState } from 'react';
import { ProductListing, CanonicalProduct, OrderRecord } from '../types';
import {
  Store,
  Package,
  Clock,
  CheckCircle2,
  AlertCircle,
  Truck,
  Edit3,
  Save,
  ShieldCheck,
  RefreshCw,
  Plus,
  Minus,
  TrendingUp,
  X
} from 'lucide-react';

interface PartnerPortalProps {
  listings: ProductListing[];
  products: CanonicalProduct[];
  orders: OrderRecord[];
  onUpdateListingStock: (listingId: string, newStock: number) => void;
  onUpdateListingPrice: (listingId: string, newPrice: number) => void;
  onUpdateOrderStatus: (orderId: string, newStatus: OrderRecord['status']) => void;
}

export const PartnerPortal: React.FC<PartnerPortalProps> = ({
  listings,
  products,
  orders,
  onUpdateListingStock,
  onUpdateListingPrice,
  onUpdateOrderStatus,
}) => {
  const [selectedPartner, setSelectedPartner] = useState<string>('partner-medplus');
  const [editingListingId, setEditingListingId] = useState<string | null>(null);
  const [tempPrice, setTempPrice] = useState<number>(0);
  const [tempStock, setTempStock] = useState<number>(0);
  const [auditMessage, setAuditMessage] = useState<string | null>(null);

  // Filter listings for the selected partner
  const partnerListings = listings.filter(l => l.partnerId === selectedPartner);

  const startEdit = (listing: ProductListing) => {
    setEditingListingId(listing.id);
    setTempPrice(listing.packPrice);
    setTempStock(listing.stockCount);
  };

  const saveEdit = (listingId: string) => {
    onUpdateListingPrice(listingId, tempPrice);
    onUpdateListingStock(listingId, tempStock);
    setEditingListingId(null);
    setAuditMessage(`Listing updated! Price freshness SLA timestamp reset.`);
    setTimeout(() => setAuditMessage(null), 3500);
  };

  return (
    <div id="partner-portal-root" className="space-y-6">
      {/* Partner Header */}
      <div className="bg-white border border-zinc-200 rounded-xl p-6 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-zinc-100 pb-5">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-800 border border-indigo-200">
                <Store className="w-3.5 h-3.5 text-indigo-600" />
                PRD Section 9.9 & Persona C: Medical Store Partner Portal
              </span>
              <span className="text-xs font-mono text-zinc-500 bg-zinc-100 px-2 py-0.5 rounded">
                FR-PART-01 to FR-PART-05
              </span>
            </div>
            <h2 className="text-2xl font-bold tracking-tight text-zinc-900">
              Pharmacy Store Operations Console
            </h2>
            <p className="text-sm text-zinc-600">
              Manage live medicine inventory, update prices to satisfy freshness SLAs, and advance customer fulfillment stages.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <span className="text-xs text-zinc-500 font-medium">Switch Store:</span>
            <select
              value={selectedPartner}
              onChange={(e) => setSelectedPartner(e.target.value)}
              className="px-3 py-2 text-xs font-semibold rounded-lg border border-zinc-200 bg-zinc-50 text-zinc-800 focus:outline-hidden"
            >
              <option value="partner-medplus">MedPlus Care Pharmacy (North Hub)</option>
              <option value="partner-apollo">Apollo Green Health Chemist (South Plaza)</option>
              <option value="partner-janaushadhi">Jan Aushadhi Partner Kendra (Civil Lines)</option>
              <option value="partner-genericcare">GenericCare Express Chemist (West Center)</option>
            </select>
          </div>
        </div>

        {/* Audit feedback banner */}
        {auditMessage && (
          <div className="mt-4 p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-xs font-semibold text-emerald-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>{auditMessage}</span>
            </div>
            <span className="font-mono text-[11px] text-emerald-700">Audit Record Appended</span>
          </div>
        )}

        {/* Operational Metrics */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 text-xs">
          <div className="p-2.5 rounded-lg bg-zinc-50 border border-zinc-100">
            <span className="text-zinc-500 block">Catalog Listings</span>
            <span className="text-zinc-900 font-bold font-mono">{partnerListings.length} Active SKUs</span>
          </div>
          <div className="p-2.5 rounded-lg bg-zinc-50 border border-zinc-100">
            <span className="text-zinc-500 block">Price Freshness SLA</span>
            <span className="text-emerald-700 font-bold">100% Compliant (&lt;24h)</span>
          </div>
          <div className="p-2.5 rounded-lg bg-zinc-50 border border-zinc-100">
            <span className="text-zinc-500 block">Partner Trust Rating</span>
            <span className="text-zinc-900 font-bold font-mono">4.8 / 5.0 ★</span>
          </div>
          <div className="p-2.5 rounded-lg bg-zinc-50 border border-zinc-100">
            <span className="text-zinc-500 block">Drug License Status</span>
            <span className="text-blue-700 font-semibold">Verified & Audited</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Medicine Inventory Manager (Left Column) */}
        <div className="lg:col-span-7 bg-white border border-zinc-200 rounded-xl p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
            <div className="flex items-center gap-2">
              <Package className="w-4 h-4 text-zinc-900" />
              <h3 className="text-base font-bold text-zinc-900">Partner Medicine Inventory (FR-PART-02)</h3>
            </div>
            <span className="text-xs font-mono text-zinc-400">Real-time Stock Control</span>
          </div>

          <div className="space-y-3">
            {partnerListings.map(listing => {
              const product = products.find(p => p.id === listing.productId) || products[0];
              const isEditing = editingListingId === listing.id;

              return (
                <div key={listing.id} className="p-4 rounded-xl border border-zinc-200 bg-zinc-50/50 space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="text-sm font-bold text-zinc-900">{product.canonicalName}</h4>
                      <p className="text-xs text-zinc-500">
                        Active Salt: <span className="font-medium text-zinc-700">{product.genericSalt}</span>
                      </p>
                    </div>

                    <span className="text-xs font-mono font-bold bg-zinc-200 text-zinc-800 px-2 py-0.5 rounded">
                      Rank #{listing.rankScore || 90}
                    </span>
                  </div>

                  {isEditing ? (
                    <div className="grid grid-cols-2 gap-3 pt-2 border-t border-zinc-200">
                      <div>
                        <label className="text-[11px] text-zinc-500 block mb-1">Pack Price (₹)</label>
                        <input
                          type="number"
                          step="0.5"
                          value={tempPrice}
                          onChange={(e) => setTempPrice(parseFloat(e.target.value) || 0)}
                          className="w-full px-2.5 py-1.5 text-xs font-mono font-bold border rounded border-zinc-300 bg-white"
                        />
                      </div>
                      <div>
                        <label className="text-[11px] text-zinc-500 block mb-1">Stock Count (Packs)</label>
                        <input
                          type="number"
                          value={tempStock}
                          onChange={(e) => setTempStock(parseInt(e.target.value) || 0)}
                          className="w-full px-2.5 py-1.5 text-xs font-mono font-bold border rounded border-zinc-300 bg-white"
                        />
                      </div>
                      <div className="col-span-2 flex justify-end gap-2 pt-1">
                        <button
                          onClick={() => setEditingListingId(null)}
                          className="px-3 py-1.5 rounded text-xs border border-zinc-200 text-zinc-600"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={() => saveEdit(listing.id)}
                          className="px-3 py-1.5 rounded text-xs bg-emerald-600 text-white font-semibold flex items-center gap-1"
                        >
                          <Save className="w-3 h-3" />
                          Save & Update SLA
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between pt-2 border-t border-zinc-200 text-xs">
                      <div>
                        <span className="text-zinc-500">Pack Price ({listing.packQuantity} tabs): </span>
                        <span className="font-mono font-bold text-zinc-900">₹{listing.packPrice.toFixed(2)}</span>
                        <span className="text-zinc-400 text-[11px]"> (₹{listing.normalizedUnitPrice.toFixed(2)}/tab)</span>
                      </div>

                      <div className="flex items-center gap-3">
                        <span className={`font-semibold ${listing.stockCount < 20 ? 'text-amber-600' : 'text-emerald-700'}`}>
                          {listing.stockCount} packs
                        </span>

                        <button
                          onClick={() => startEdit(listing)}
                          className="px-2.5 py-1 rounded bg-white border border-zinc-200 text-zinc-700 hover:bg-zinc-100 flex items-center gap-1 font-medium"
                        >
                          <Edit3 className="w-3 h-3 text-zinc-500" />
                          Edit
                        </button>
                      </div>
                    </div>
                  )}

                  <div className="flex items-center justify-between text-[11px] text-zinc-400">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      Freshness: {listing.freshnessTimestamp}
                    </span>
                    <span>SLA: Green (Compliant)</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Incoming Orders Fulfillment Queue (Right Column) */}
        <div className="lg:col-span-5 bg-white border border-zinc-200 rounded-xl p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
            <div className="flex items-center gap-2">
              <Truck className="w-4 h-4 text-blue-600" />
              <h3 className="text-base font-bold text-zinc-900">Fulfillment Queue (FR-PART-03/04)</h3>
            </div>
            <span className="text-xs font-mono text-zinc-500">{orders.length} Orders</span>
          </div>

          <div className="space-y-3">
            {orders.map(order => (
              <div key={order.id} className="p-4 rounded-xl border border-zinc-200 bg-zinc-50/70 space-y-3 text-xs">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="font-mono font-bold text-zinc-900">{order.id}</span>
                    <p className="text-zinc-500 mt-0.5">{order.customerName}</p>
                  </div>
                  <span className={`font-semibold px-2 py-0.5 rounded-full text-[10px] ${
                    order.status === 'Completed'
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      : 'bg-blue-50 text-blue-700 border border-blue-200'
                  }`}>
                    {order.status}
                  </span>
                </div>

                <div className="p-2 rounded bg-white border border-zinc-100 space-y-1">
                  {order.items.map(item => (
                    <div key={item.listingId} className="flex justify-between text-[11px]">
                      <span>{item.canonicalProduct.canonicalName} (x{item.quantity})</span>
                      <span className="font-mono font-semibold">₹{(item.listing.packPrice * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>

                {/* State Transition Actions */}
                <div className="pt-2 border-t border-zinc-200 flex items-center justify-between gap-2">
                  <span className="text-[11px] text-zinc-500">Advance Stage:</span>
                  <div className="flex items-center gap-1.5">
                    {order.status === 'Paid/Confirmed' && (
                      <button
                        onClick={() => onUpdateOrderStatus(order.id, 'Accepted by Partner')}
                        className="px-2.5 py-1 rounded bg-blue-600 text-white font-semibold text-[11px]"
                      >
                        Accept & Verify
                      </button>
                    )}
                    {order.status === 'Accepted by Partner' && (
                      <button
                        onClick={() => onUpdateOrderStatus(order.id, 'Out for Delivery')}
                        className="px-2.5 py-1 rounded bg-indigo-600 text-white font-semibold text-[11px]"
                      >
                        Dispatch Courier
                      </button>
                    )}
                    {order.status === 'Out for Delivery' && (
                      <button
                        onClick={() => onUpdateOrderStatus(order.id, 'Completed')}
                        className="px-2.5 py-1 rounded bg-emerald-600 text-white font-semibold text-[11px]"
                      >
                        Mark Delivered
                      </button>
                    )}
                    {order.status === 'Completed' && (
                      <span className="text-emerald-700 font-bold text-[11px] flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Fulfillment Complete
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
