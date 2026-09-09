import React, { useState } from 'react';
import { NationalErpConnector, OrderRecord } from '../types';
import { NATIONAL_ERP_CONNECTORS } from '../data/genericMedData';
import {
  Network,
  RefreshCw,
  Server,
  Activity,
  CheckCircle2,
  AlertCircle,
  Truck,
  Layers,
  ArrowRight,
  Database,
  Building2,
  Clock,
  ShieldCheck,
  X,
  ExternalLink,
  Sparkles
} from 'lucide-react';

interface NationalNetworkModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTriggerSync?: (connectorId: string) => void;
}

export const NationalNetworkModal: React.FC<NationalNetworkModalProps> = ({
  isOpen,
  onClose,
  onTriggerSync
}) => {
  const [connectors, setConnectors] = useState<NationalErpConnector[]>(NATIONAL_ERP_CONNECTORS);
  const [syncingId, setSyncingId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'connectors' | 'split_routing' | 'reconciliation'>('connectors');
  const [syncNotice, setSyncNotice] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSync = (connector: NationalErpConnector) => {
    setSyncingId(connector.id);
    setSyncNotice(null);

    setTimeout(() => {
      setSyncingId(null);
      setConnectors(prev =>
        prev.map(c =>
          c.id === connector.id
            ? { ...c, lastSyncTimestamp: 'Just now', pingLatencyMs: Math.floor(Math.random() * 10 + 14) }
            : c
        )
      );
      setSyncNotice(`Successfully synchronized 100% SKU inventory with ${connector.chainName} via ${connector.protocol}.`);
      if (onTriggerSync) onTriggerSync(connector.id);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl overflow-hidden flex flex-col max-h-[92vh] border border-zinc-200">
        
        {/* Top Header */}
        <div className="bg-zinc-900 text-white px-6 py-4 flex items-center justify-between border-b border-zinc-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600/30 border border-indigo-500/40 flex items-center justify-center text-indigo-400">
              <Network className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-base">National Pharmacy Network & B2B ERP Gateway</h3>
                <span className="bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                  Phase 3 Scale
                </span>
              </div>
              <p className="text-xs text-zinc-400 mt-0.5">
                Automated B2B catalog sync & multi-warehouse split-routing across national retail chains.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-zinc-400 hover:text-white p-1.5 rounded-lg hover:bg-zinc-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Navigation Tabs */}
        <div className="bg-zinc-100 border-b border-zinc-200 px-6 flex items-center gap-2">
          <button
            onClick={() => setActiveTab('connectors')}
            className={`py-3 px-4 text-xs font-bold border-b-2 transition-colors flex items-center gap-2 cursor-pointer ${
              activeTab === 'connectors'
                ? 'border-indigo-600 text-indigo-700 bg-white'
                : 'border-transparent text-zinc-600 hover:text-zinc-900'
            }`}
          >
            <Server className="w-4 h-4" />
            ERP Connectors ({connectors.length})
          </button>

          <button
            onClick={() => setActiveTab('split_routing')}
            className={`py-3 px-4 text-xs font-bold border-b-2 transition-colors flex items-center gap-2 cursor-pointer ${
              activeTab === 'split_routing'
                ? 'border-indigo-600 text-indigo-700 bg-white'
                : 'border-transparent text-zinc-600 hover:text-zinc-900'
            }`}
          >
            <Layers className="w-4 h-4" />
            Multi-Warehouse Split-Fulfillment Engine
          </button>

          <button
            onClick={() => setActiveTab('reconciliation')}
            className={`py-3 px-4 text-xs font-bold border-b-2 transition-colors flex items-center gap-2 cursor-pointer ${
              activeTab === 'reconciliation'
                ? 'border-indigo-600 text-indigo-700 bg-white'
                : 'border-transparent text-zinc-600 hover:text-zinc-900'
            }`}
          >
            <Database className="w-4 h-4" />
            Audit & Reconciliation Stream
          </button>
        </div>

        {/* Tab Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {syncNotice && (
            <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3.5 flex items-center gap-2.5 text-xs text-emerald-900 animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{syncNotice}</span>
            </div>
          )}

          {activeTab === 'connectors' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {connectors.map(connector => (
                  <div
                    key={connector.id}
                    className="bg-white border border-zinc-200 rounded-2xl p-5 shadow-xs flex flex-col justify-between hover:shadow-md transition-shadow"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <span className="font-bold text-xs text-zinc-900">{connector.logoBadge}</span>
                        <div className="flex items-center gap-1.5 text-[10px] text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full font-semibold">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                          Online
                        </div>
                      </div>

                      <h4 className="font-bold text-sm text-zinc-900">{connector.chainName}</h4>
                      <p className="text-[11px] text-zinc-500 mt-0.5">{connector.warehouseLocation}</p>

                      <div className="mt-4 pt-3 border-t border-zinc-100 space-y-2 text-xs">
                        <div className="flex items-center justify-between text-zinc-600">
                          <span>Integration Protocol:</span>
                          <span className="font-mono font-semibold text-zinc-800 text-[11px]">{connector.protocol}</span>
                        </div>

                        <div className="flex items-center justify-between text-zinc-600">
                          <span>Ping Latency:</span>
                          <span className="font-mono font-medium text-emerald-700">{connector.pingLatencyMs} ms</span>
                        </div>

                        <div className="flex items-center justify-between text-zinc-600">
                          <span>Total Mapped SKUs:</span>
                          <span className="font-bold text-zinc-900">{connector.totalMappedSkus.toLocaleString()}</span>
                        </div>

                        <div className="flex items-center justify-between text-zinc-600">
                          <span>Last Heartbeat:</span>
                          <span className="text-zinc-500 text-[11px]">{connector.lastSyncTimestamp}</span>
                        </div>

                        <div className="flex items-center justify-between text-zinc-600">
                          <span>Discrepancies (24h):</span>
                          <span className="font-semibold text-zinc-700">{connector.discrepanciesResolved24h} resolved</span>
                        </div>
                      </div>
                    </div>

                    <div className="mt-5 pt-3 border-t border-zinc-100">
                      <button
                        type="button"
                        onClick={() => handleSync(connector)}
                        disabled={syncingId === connector.id}
                        className="w-full py-2 px-3 bg-zinc-100 hover:bg-indigo-50 hover:text-indigo-700 text-zinc-700 border border-zinc-200 hover:border-indigo-200 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer"
                      >
                        <RefreshCw className={`w-3.5 h-3.5 ${syncingId === connector.id ? 'animate-spin text-indigo-600' : ''}`} />
                        {syncingId === connector.id ? 'Reconciling Catalog...' : 'Trigger Real-Time B2B Sync'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Technical Protocol Architecture Info */}
              <div className="bg-zinc-50 border border-zinc-200 rounded-2xl p-5 space-y-3">
                <h5 className="font-bold text-xs text-zinc-900 flex items-center gap-2">
                  <Activity className="w-4 h-4 text-indigo-600" />
                  National Health Stack & FHIR R4 Integration Standard
                </h5>
                <p className="text-xs text-zinc-600 leading-relaxed">
                  genericMed communicates directly with warehouse inventory feeds using HL7/FHIR MedicationKnowledge resources and EDI 850 Purchase Order / 856 Advanced Shipping Notice protocols. Real-time webhooks guarantee less than 500ms stock latency, preventing checkout discrepancies across multi-store orders.
                </p>
              </div>
            </div>
          )}

          {activeTab === 'split_routing' && (
            <div className="space-y-6">
              <div className="bg-indigo-50 border border-indigo-200 rounded-2xl p-4 flex items-start gap-3">
                <Sparkles className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-xs text-indigo-950">Intelligent Multi-Origin Split Fulfillment</h4>
                  <p className="text-xs text-indigo-800 mt-1 leading-relaxed">
                    When a prescription contains both acute emergency medications (e.g. Paracetamol) and specialized chronic cold-chain drugs (e.g. Insulin / Atorvastatin) not co-located in a single chemist, our routing engine splits the order automatically into optimal fulfillment streams with zero customer friction.
                  </p>
                </div>
              </div>

              {/* Interactive Visual Architecture */}
              <div className="bg-zinc-900 text-white rounded-2xl p-6 shadow-md border border-zinc-800 space-y-6">
                <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
                  <span className="text-xs font-mono text-indigo-400 font-bold">ROUTING ENGINE WORKFLOW • ORDER #ORD-2026-9044</span>
                  <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded border border-emerald-500/40 font-mono">
                    2 Origins Activated
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                  {/* Origin 1 */}
                  <div className="bg-zinc-800/80 border border-zinc-700 rounded-xl p-4 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-amber-400">Origin A: Local Express</span>
                      <span className="text-[10px] font-mono text-zinc-400">30 min ETA</span>
                    </div>
                    <p className="text-xs font-medium text-zinc-200">MedPlus Care Chemist (North Hub)</p>
                    <div className="text-[11px] text-zinc-400 bg-zinc-900 p-2 rounded">
                      <strong className="text-white block">Item: Paracetamol 500mg</strong>
                      <span>Dispatched via Electric Two-Wheeler</span>
                    </div>
                    <div className="text-[10px] text-emerald-400 font-mono">Handover PIN: 4892</div>
                  </div>

                  {/* Flow Arrow */}
                  <div className="hidden md:flex flex-col items-center justify-center text-zinc-500">
                    <ArrowRight className="w-8 h-8 text-indigo-400 animate-pulse" />
                    <span className="text-[10px] font-mono text-zinc-400 mt-1">Parallel Dispatch</span>
                  </div>

                  {/* Origin 2 */}
                  <div className="bg-zinc-800/80 border border-zinc-700 rounded-xl p-4 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-indigo-400">Origin B: Central Strategic</span>
                      <span className="text-[10px] font-mono text-zinc-400">Cold-Chain 24h</span>
                    </div>
                    <p className="text-xs font-medium text-zinc-200">Jan Aushadhi Central PMBI Depot</p>
                    <div className="text-[11px] text-zinc-400 bg-zinc-900 p-2 rounded">
                      <strong className="text-white block">Items: Metformin 500mg & Atorvastatin</strong>
                      <span>Dispatched via Cold-Chain Van (4.2°C)</span>
                    </div>
                    <div className="text-[10px] text-indigo-400 font-mono">Handover PIN: 7125</div>
                  </div>
                </div>

                <div className="bg-zinc-950 rounded-xl p-3 border border-zinc-800 text-xs text-zinc-400 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    <span>Customer receives both shipments with synchronized tracking, separate OTPs, and unified billing.</span>
                  </div>
                  <span className="text-[11px] font-bold text-white">Single Order Checkout</span>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'reconciliation' && (
            <div className="space-y-4">
              <h4 className="text-xs font-bold text-zinc-900 flex items-center gap-2">
                <Database className="w-4 h-4 text-indigo-600" />
                Live Automated Stock Reconciliation Log
              </h4>

              <div className="border border-zinc-200 rounded-xl overflow-hidden divide-y divide-zinc-200 text-xs">
                <div className="p-3 bg-zinc-50 flex items-center justify-between font-semibold text-zinc-700 text-[11px]">
                  <span>Sync Event ID & Partner</span>
                  <span>Protocol & Action</span>
                  <span>Delta Impact</span>
                  <span>Timestamp</span>
                </div>

                <div className="p-3 bg-white flex items-center justify-between hover:bg-zinc-50/80">
                  <div className="font-medium text-zinc-900">
                    <span>REC-2026-904 • Apollo National</span>
                  </div>
                  <span className="font-mono text-indigo-600 text-[11px]">FHIR R4 Delta Sync</span>
                  <span className="text-emerald-700 font-semibold">+14 SKU counts verified</span>
                  <span className="text-zinc-500 text-[11px]">Today at 10:14 AM</span>
                </div>

                <div className="p-3 bg-white flex items-center justify-between hover:bg-zinc-50/80">
                  <div className="font-medium text-zinc-900">
                    <span>REC-2026-881 • MedPlus B2B</span>
                  </div>
                  <span className="font-mono text-indigo-600 text-[11px]">EDI 855 Ack</span>
                  <span className="text-emerald-700 font-semibold">Zero stock drift detected</span>
                  <span className="text-zinc-500 text-[11px]">Today at 10:11 AM</span>
                </div>

                <div className="p-3 bg-white flex items-center justify-between hover:bg-zinc-50/80">
                  <div className="font-medium text-zinc-900">
                    <span>REC-2026-749 • Jan Aushadhi Central</span>
                  </div>
                  <span className="font-mono text-indigo-600 text-[11px]">NH-Stack REST Feed</span>
                  <span className="text-emerald-700 font-semibold">Batch expiry dates verified</span>
                  <span className="text-zinc-500 text-[11px]">Today at 10:02 AM</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
