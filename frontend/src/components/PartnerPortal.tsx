import React, { useState } from 'react';
import {
  ProductListing,
  CanonicalProduct,
  OrderRecord,
  MedicineBatchRecord,
  PartnerAnalyticsSummary,
  SupportedCurrency,
  NationalErpConnector,
  DualPharmacistDispenseRecord,
  PvPiAdverseReactionReport
} from '../types';
import { formatCurrency } from '../utils/i18n';
import { NATIONAL_ERP_CONNECTORS } from '../data/genericMedData';
import { DualPharmacistSignStation } from './DualPharmacistSignStation';
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
  AlertTriangle,
  Thermometer,
  Calendar,
  BarChart3,
  Activity,
  DollarSign,
  ShieldAlert,
  Sparkles,
  X,
  Network
} from 'lucide-react';

interface PartnerPortalProps {
  listings: ProductListing[];
  products: CanonicalProduct[];
  orders: OrderRecord[];
  batchRecords?: MedicineBatchRecord[];
  analyticsSummary?: Record<string, PartnerAnalyticsSummary>;
  currency?: SupportedCurrency;
  onOpenNationalNetwork?: () => void;
  erpConnectors?: NationalErpConnector[];
  onUpdateListingStock: (listingId: string, newStock: number) => void;
  onUpdateListingPrice: (listingId: string, newPrice: number) => void;
  onUpdateOrderStatus: (orderId: string, newStatus: OrderRecord['status']) => void;
  onUpdateBatchStatus?: (batchId: string, status: MedicineBatchRecord['status']) => void;
  // Phase 4 props
  dualPharmacistRecords?: DualPharmacistDispenseRecord[];
  onCompleteDualDispense?: (record: DualPharmacistDispenseRecord) => void;
  onFilePvpiReport?: (report: any) => void;
  onOpenRuralKiosk?: () => void;
}

export const PartnerPortal: React.FC<PartnerPortalProps> = ({
  listings,
  products,
  orders,
  batchRecords = [],
  analyticsSummary = {},
  currency = 'INR',
  onOpenNationalNetwork,
  erpConnectors = NATIONAL_ERP_CONNECTORS,
  onUpdateListingStock,
  onUpdateListingPrice,
  onUpdateOrderStatus,
  onUpdateBatchStatus,
  dualPharmacistRecords = [],
  onCompleteDualDispense,
  onFilePvpiReport,
  onOpenRuralKiosk
}) => {
  const [selectedPartner, setSelectedPartner] = useState<string>('partner-medplus');
  const [activeTab, setActiveTab] = useState<'inventory' | 'fulfillment' | 'batch_radar' | 'analytics' | 'b2b_network' | 'dual_dispense'>('inventory');
  const [editingListingId, setEditingListingId] = useState<string | null>(null);
  const [tempPrice, setTempPrice] = useState<number>(0);
  const [tempStock, setTempStock] = useState<number>(0);
  const [auditMessage, setAuditMessage] = useState<string | null>(null);

  // Filter listings and batches for the selected partner
  const partnerListings = listings.filter(l => l.partnerId === selectedPartner);
  const partnerBatches = batchRecords.filter(b => b.partnerId === selectedPartner);
  const currentAnalytics = analyticsSummary[selectedPartner] || {
    partnerId: selectedPartner,
    period: 'September 2026 MTD',
    totalGrossRevenue: 135400,
    totalOrdersFulfilled: 365,
    slaCompliancePercent: 98.1,
    averageFulfillmentTimeMins: 15.4,
    chronicRetentionRate: 75.2,
    batchWasteRate: 0.6,
    topSellingMolecules: [
      { name: 'Paracetamol IP 500mg', units: 1200, revenue: 16800 },
      { name: 'Metformin ER 500mg', units: 910, revenue: 30030 }
    ]
  };

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

  const handleQuarantine = (batchId: string) => {
    if (onUpdateBatchStatus) {
      onUpdateBatchStatus(batchId, 'Quarantined');
      setAuditMessage(`Batch ${batchId} quarantined! Removed from active dispatch allocation.`);
      setTimeout(() => setAuditMessage(null), 3500);
    }
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
                PRD Section 9.9 & Phase 2: Pharmacy Store Operations & Analytics
              </span>
              <span className="text-xs font-mono text-zinc-500 bg-zinc-100 px-2 py-0.5 rounded">
                FR-PART-01 to FR-PART-05
              </span>
            </div>
            <h2 className="text-2xl font-bold tracking-tight text-zinc-900">
              Pharmacy Store Operations & Analytics Console
            </h2>
            <p className="text-sm text-zinc-600">
              Manage inventory, monitor batch expiry radar & cold-chain telematics, track SLA dispatch, and review financial growth metrics.
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

            {onOpenRuralKiosk && (
              <button
                id="rural-kiosk-launcher-btn"
                onClick={onOpenRuralKiosk}
                className="px-3 py-2 text-xs font-bold rounded-lg border border-emerald-300 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 flex items-center gap-1.5 transition-colors shadow-2xs"
                title="Open PMBJP Jan Aushadhi Rural Kiosk POS Terminal"
              >
                <Store className="w-3.5 h-3.5 text-emerald-700" />
                <span>Rural Kendra Kiosk</span>
              </button>
            )}
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
            <span className="text-zinc-500 block">SLA Compliance</span>
            <span className="text-zinc-900 font-bold font-mono">{currentAnalytics.slaCompliancePercent}%</span>
          </div>
          <div className="p-2.5 rounded-lg bg-zinc-50 border border-zinc-100">
            <span className="text-zinc-500 block">Repeat Chronic Retention</span>
            <span className="text-blue-700 font-semibold font-mono">{currentAnalytics.chronicRetentionRate}%</span>
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex items-center gap-2 border-b border-zinc-200 pb-1 text-xs">
        <button
          onClick={() => setActiveTab('inventory')}
          className={`px-4 py-2 font-bold rounded-lg transition-colors flex items-center gap-1.5 ${
            activeTab === 'inventory'
              ? 'bg-zinc-900 text-white shadow-xs'
              : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100'
          }`}
        >
          <Package className="w-3.5 h-3.5" />
          Active Medicine Inventory ({partnerListings.length})
        </button>

        <button
          onClick={() => setActiveTab('fulfillment')}
          className={`px-4 py-2 font-bold rounded-lg transition-colors flex items-center gap-1.5 ${
            activeTab === 'fulfillment'
              ? 'bg-zinc-900 text-white shadow-xs'
              : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100'
          }`}
        >
          <Truck className="w-3.5 h-3.5" />
          Fulfillment Queue ({orders.length})
        </button>

        <button
          onClick={() => setActiveTab('batch_radar')}
          className={`px-4 py-2 font-bold rounded-lg transition-colors flex items-center gap-1.5 ${
            activeTab === 'batch_radar'
              ? 'bg-zinc-900 text-white shadow-xs'
              : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100'
          }`}
        >
          <Calendar className="w-3.5 h-3.5" />
          Batch Expiry & Cold Chain Radar
          <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-amber-100 text-amber-900 font-bold">
            Phase 2
          </span>
        </button>

        <button
          onClick={() => setActiveTab('analytics')}
          className={`px-4 py-2 font-bold rounded-lg transition-colors flex items-center gap-1.5 ${
            activeTab === 'analytics'
              ? 'bg-zinc-900 text-white shadow-xs'
              : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100'
          }`}
        >
          <BarChart3 className="w-3.5 h-3.5" />
          Analytics & GMV Growth
          <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-blue-100 text-blue-900 font-bold">
            Phase 2
          </span>
        </button>

        <button
          onClick={() => setActiveTab('b2b_network')}
          className={`px-4 py-2 font-bold rounded-lg transition-colors flex items-center gap-1.5 ${
            activeTab === 'b2b_network'
              ? 'bg-zinc-900 text-white shadow-xs'
              : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100'
          }`}
        >
          <Network className="w-3.5 h-3.5 text-indigo-500" />
          National B2B Network & ERP Feeds
          <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-indigo-100 text-indigo-900 font-bold">
            Phase 3
          </span>
        </button>

        <button
          onClick={() => setActiveTab('dual_dispense')}
          className={`px-4 py-2 font-bold rounded-lg transition-colors flex items-center gap-1.5 ${
            activeTab === 'dual_dispense'
              ? 'bg-zinc-900 text-white shadow-xs'
              : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100'
          }`}
        >
          <ShieldCheck className="w-3.5 h-3.5 text-blue-500" />
          Dual-Pharmacist Dispense (Sec. 65)
          <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-blue-100 text-blue-900 font-bold">
            Phase 4
          </span>
        </button>
      </div>

      {/* Tab: Dual-Pharmacist Dispense Station (Sec. 65) */}
      {activeTab === 'dual_dispense' && (
        <DualPharmacistSignStation
          orders={orders}
          dualPharmacistRecords={dualPharmacistRecords}
          onCompleteDispense={(rec) => {
            onCompleteDualDispense?.(rec);
            setAuditMessage(`Order ${rec.orderId} signed by 2 pharmacists! Tamper seal ${rec.tamperSealNumber} generated.`);
            setTimeout(() => setAuditMessage(null), 3500);
          }}
          onFilePvpiReport={(rep) => {
            onFilePvpiReport?.(rep);
            setAuditMessage(`PvPI Yellow Form filed for ${rep.medicineName}! Logged in IPC registry.`);
            setTimeout(() => setAuditMessage(null), 3500);
          }}
        />
      )}

      {/* Tab: Medicine Inventory */}
      {activeTab === 'inventory' && (
        <div className="bg-white border border-zinc-200 rounded-xl p-6 shadow-xs space-y-4">
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
                    <div className="grid grid-cols-2 gap-3 pt-2 border-t border-zinc-200 text-xs">
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
                    <span>SLA: Green (Compliant &lt;24h)</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Tab: Fulfillment Queue */}
      {activeTab === 'fulfillment' && (
        <div className="bg-white border border-zinc-200 rounded-xl p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
            <div className="flex items-center gap-2">
              <Truck className="w-4 h-4 text-blue-600" />
              <h3 className="text-base font-bold text-zinc-900">Partner Order Fulfillment Queue (FR-PART-03/04)</h3>
            </div>
            <span className="text-xs font-mono text-zinc-500">{orders.length} Active & Completed Orders</span>
          </div>

          <div className="space-y-3">
            {orders.map(order => (
              <div key={order.id} className="p-4 rounded-xl border border-zinc-200 bg-zinc-50/70 space-y-3 text-xs">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="font-mono font-bold text-zinc-900">{order.id}</span>
                    <p className="text-zinc-500 mt-0.5">
                      Customer: <span className="font-medium text-zinc-800">{order.customerName}</span> • {order.deliveryAddress}
                    </p>
                  </div>

                  <span className={`px-2.5 py-0.5 rounded-full font-semibold text-[10px] ${
                    order.status === 'Completed'
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-blue-100 text-blue-800'
                  }`}>
                    {order.status}
                  </span>
                </div>

                <div className="bg-white p-3 rounded-lg border border-zinc-200/80 space-y-1">
                  <span className="font-semibold text-zinc-900 block text-[11px]">Prescription Items:</span>
                  {order.items.map(i => (
                    <div key={i.listingId} className="flex justify-between text-zinc-600 text-[11px]">
                      <span>{i.canonicalProduct.canonicalName} ({i.quantity} pack)</span>
                      <span className="font-mono font-bold text-zinc-900">₹{(i.listing.packPrice * i.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>

                <div className="flex items-center justify-between pt-1">
                  <span className="text-zinc-500 font-mono text-[11px]">{order.createdAt}</span>

                  <div className="flex items-center gap-2">
                    {order.status === 'Paid/Confirmed' && (
                      <button
                        onClick={() => onUpdateOrderStatus(order.id, 'Accepted by Partner')}
                        className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-semibold transition-colors shadow-xs"
                      >
                        Accept & Dispense
                      </button>
                    )}
                    {order.status === 'Accepted by Partner' && (
                      <button
                        onClick={() => onUpdateOrderStatus(order.id, 'Out for Delivery')}
                        className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold transition-colors shadow-xs flex items-center gap-1"
                      >
                        <Truck className="w-3 h-3" />
                        Handover to Courier
                      </button>
                    )}
                    {order.status === 'Out for Delivery' && (
                      <button
                        onClick={() => onUpdateOrderStatus(order.id, 'Completed')}
                        className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold transition-colors shadow-xs flex items-center gap-1"
                      >
                        <CheckCircle2 className="w-3 h-3" />
                        Confirm Customer OTP Delivery
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab: Batch Expiry Radar & Cold Chain Tracking (Phase 2) */}
      {activeTab === 'batch_radar' && (
        <div className="bg-white border border-zinc-200 rounded-xl p-6 shadow-xs space-y-5 text-xs">
          <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
            <div>
              <h3 className="text-base font-bold text-zinc-900 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-amber-600" />
                Batch Expiry Radar & Cold-Chain Telemetry (Phase 2)
              </h3>
              <p className="text-zinc-500 text-[11px] mt-0.5">
                Regulatory compliance under Section 65 of Drugs and Cosmetics Act. Batches &lt;180 days flagged.
              </p>
            </div>
            <span className="font-mono text-zinc-400">{partnerBatches.length} Registered Batches</span>
          </div>

          <div className="overflow-x-auto rounded-xl border border-zinc-200">
            <table className="w-full text-left">
              <thead className="bg-zinc-50 text-zinc-700 font-semibold border-b border-zinc-200 text-[11px]">
                <tr>
                  <th className="p-3">Batch Number</th>
                  <th className="p-3">Medicine Formulation</th>
                  <th className="p-3">Mfg & Expiry</th>
                  <th className="p-3">Days to Expiry</th>
                  <th className="p-3">Storage Temp & Sensor</th>
                  <th className="p-3">Status</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100 text-zinc-700">
                {partnerBatches.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="p-6 text-center text-zinc-400">
                      No batch inventory recorded for this pharmacy store yet.
                    </td>
                  </tr>
                ) : (
                  partnerBatches.map(batch => {
                    const isNearExpiry = batch.daysToExpiry < 180;
                    const isCritical = batch.daysToExpiry < 90;
                    return (
                      <tr key={batch.id} className="hover:bg-zinc-50/70">
                        <td className="p-3 font-mono font-bold text-zinc-900 whitespace-nowrap">
                          {batch.batchNumber}
                          <span className="block text-[10px] text-zinc-400 font-mono">
                            {batch.qcCertificateNumber}
                          </span>
                        </td>
                        <td className="p-3">
                          <span className="font-bold text-zinc-900 block">{batch.productName}</span>
                          <span className="text-[11px] text-zinc-500">{batch.stockUnits} units in cold store</span>
                        </td>
                        <td className="p-3 font-mono text-[11px]">
                          <span>Mfg: {batch.mfgDate}</span>
                          <span className="block text-zinc-500 font-semibold">Exp: {batch.expiryDate}</span>
                        </td>
                        <td className="p-3 font-mono">
                          <span className={`font-bold ${isCritical ? 'text-rose-600' : isNearExpiry ? 'text-amber-600' : 'text-emerald-700'}`}>
                            {batch.daysToExpiry} days
                          </span>
                        </td>
                        <td className="p-3">
                          <div className="flex items-center gap-1 font-mono font-bold text-zinc-900">
                            <Thermometer className={`w-3.5 h-3.5 ${batch.requiresColdChain ? 'text-blue-600' : 'text-amber-600'}`} />
                            {batch.currentTempCelsius}°C
                          </div>
                          <span className="text-[10px] text-zinc-400 block">{batch.targetTempRange}</span>
                        </td>
                        <td className="p-3">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            batch.status === 'Quarantined'
                              ? 'bg-rose-100 text-rose-800'
                              : isNearExpiry
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-emerald-100 text-emerald-800'
                          }`}>
                            {batch.status}
                          </span>
                        </td>
                        <td className="p-3 text-right">
                          {batch.status !== 'Quarantined' ? (
                            <button
                              onClick={() => handleQuarantine(batch.id)}
                              className="px-2.5 py-1 rounded bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-700 font-semibold text-[11px] transition-colors"
                            >
                              Quarantine
                            </button>
                          ) : (
                            <span className="text-[11px] font-mono text-zinc-400">Locked</span>
                          )}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab: Analytics & GMV Growth (Phase 2) */}
      {activeTab === 'analytics' && (
        <div className="bg-white border border-zinc-200 rounded-xl p-6 shadow-xs space-y-6 text-xs">
          <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
            <div>
              <h3 className="text-base font-bold text-zinc-900 flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-blue-600" />
                Pharmacy Store Performance & Fulfillment Economics (Phase 2)
              </h3>
              <p className="text-zinc-500 text-[11px] mt-0.5">
                Reporting period: <strong className="text-zinc-700">{currentAnalytics.period}</strong>
              </p>
            </div>
            <span className="text-emerald-700 font-bold bg-emerald-50 px-2.5 py-1 rounded border border-emerald-200">
              Verified Partner Tier 1
            </span>
          </div>

          {/* Revenue KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div className="p-4 rounded-xl bg-blue-50/60 border border-blue-100 space-y-1">
              <span className="text-zinc-500 text-[11px] block">Gross Merchandise Value (GMV)</span>
              <span className="text-2xl font-bold font-mono text-blue-950">
                ₹{currentAnalytics.totalGrossRevenue.toLocaleString()}
              </span>
              <span className="text-[10px] text-blue-700 font-semibold block pt-1">
                +18.4% vs last month
              </span>
            </div>

            <div className="p-4 rounded-xl bg-emerald-50/60 border border-emerald-100 space-y-1">
              <span className="text-zinc-500 text-[11px] block">Total Orders Fulfilled</span>
              <span className="text-2xl font-bold font-mono text-emerald-900">
                {currentAnalytics.totalOrdersFulfilled}
              </span>
              <span className="text-[10px] text-emerald-700 font-semibold block pt-1">
                100% On-Time SLA Delivery
              </span>
            </div>

            <div className="p-4 rounded-xl bg-purple-50/60 border border-purple-100 space-y-1">
              <span className="text-zinc-500 text-[11px] block">Average Dispatch SLA</span>
              <span className="text-2xl font-bold font-mono text-purple-900">
                {currentAnalytics.averageFulfillmentTimeMins} mins
              </span>
              <span className="text-[10px] text-purple-700 font-semibold block pt-1">
                Benchmark: &lt;20 mins
              </span>
            </div>

            <div className="p-4 rounded-xl bg-amber-50/60 border border-amber-100 space-y-1">
              <span className="text-zinc-500 text-[11px] block">Chronic Patient Retention</span>
              <span className="text-2xl font-bold font-mono text-amber-950">
                {currentAnalytics.chronicRetentionRate}%
              </span>
              <span className="text-[10px] text-amber-800 font-semibold block pt-1">
                Persona B Auto-Refills
              </span>
            </div>
          </div>

          {/* Top Selling Generic Formulations Table */}
          <div className="space-y-2">
            <h4 className="font-bold text-zinc-900 text-sm">Top-Performing Generic Formulations</h4>
            <div className="overflow-x-auto rounded-xl border border-zinc-200">
              <table className="w-full text-left">
                <thead className="bg-zinc-50 text-zinc-700 font-semibold text-[11px]">
                  <tr>
                    <th className="p-3">Generic Molecule Formulation</th>
                    <th className="p-3">Units Dispensed</th>
                    <th className="p-3">Total Pharmacy Revenue</th>
                    <th className="p-3">Normalized Savings Generated</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100 text-zinc-700">
                  {currentAnalytics.topSellingMolecules.map((m, idx) => (
                    <tr key={idx} className="hover:bg-zinc-50/60">
                      <td className="p-3 font-bold text-zinc-900">{m.name}</td>
                      <td className="p-3 font-mono">{m.units} units</td>
                      <td className="p-3 font-mono font-bold text-zinc-900">₹{m.revenue.toLocaleString()}</td>
                      <td className="p-3 font-mono text-emerald-700 font-semibold">
                        ≈ ₹{(m.revenue * 2.8).toLocaleString()} saved by patients
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Tab: National B2B Network & ERP Feeds (Phase 3) */}
      {activeTab === 'b2b_network' && (
        <div className="bg-white border border-zinc-200 rounded-xl p-6 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-zinc-100 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <Network className="w-5 h-5 text-indigo-600" />
                <h3 className="text-base font-bold text-zinc-900">National B2B Network & ERP Connectors</h3>
                <span className="bg-indigo-100 text-indigo-800 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">
                  Phase 3 Live
                </span>
              </div>
              <p className="text-xs text-zinc-500 mt-0.5">
                Automated catalog delta synchronization across Apollo, MedPlus, and Jan Aushadhi central warehouses.
              </p>
            </div>

            {onOpenNationalNetwork && (
              <button
                type="button"
                onClick={onOpenNationalNetwork}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
              >
                <Network className="w-3.5 h-3.5" />
                Open B2B Console & Split-Router
              </button>
            )}
          </div>

          {/* Connectors Status Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {erpConnectors.map(connector => (
              <div key={connector.id} className="p-4 rounded-xl border border-zinc-200 bg-zinc-50/50 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-zinc-900">{connector.logoBadge}</span>
                  <span className="text-[10px] font-semibold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                    Online
                  </span>
                </div>

                <div>
                  <h4 className="font-bold text-xs text-zinc-900">{connector.chainName}</h4>
                  <p className="text-[10px] text-zinc-500 font-mono mt-0.5">{connector.protocol}</p>
                </div>

                <div className="space-y-1 text-[11px] text-zinc-600 border-t border-zinc-200/60 pt-2">
                  <div className="flex justify-between">
                    <span>Latency:</span>
                    <span className="font-mono text-emerald-700 font-bold">{connector.pingLatencyMs} ms</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Mapped SKUs:</span>
                    <span className="font-bold text-zinc-800">{connector.totalMappedSkus.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Last Heartbeat:</span>
                    <span className="text-zinc-500">{connector.lastSyncTimestamp}</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setAuditMessage(`Manual B2B sync initiated with ${connector.chainName} via ${connector.protocol}. 0 discrepancies found.`);
                    setTimeout(() => setAuditMessage(null), 4000);
                  }}
                  className="w-full py-1.5 px-2.5 bg-white hover:bg-indigo-50 hover:text-indigo-700 text-zinc-700 border border-zinc-200 hover:border-indigo-200 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <RefreshCw className="w-3 h-3" />
                  Sync SKUs Now
                </button>
              </div>
            ))}
          </div>

          <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-4 flex items-start gap-3">
            <Sparkles className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
            <div className="text-xs text-indigo-950 space-y-1">
              <span className="font-bold block">Autonomous Multi-Warehouse Stock Balancing</span>
              <p className="text-indigo-800 leading-relaxed">
                When customer orders contain items beyond your local store stock depth, genericMed automatically routes secondary lines to the PMBI Central Depot without cancelling the transaction.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
