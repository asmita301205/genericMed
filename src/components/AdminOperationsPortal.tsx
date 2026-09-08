import React, { useState } from 'react';
import { AuditRecord, OperationalException } from '../types';
import {
  ShieldAlert,
  Sliders,
  History,
  Activity,
  CheckCircle2,
  AlertTriangle,
  FileCheck,
  Search,
  Filter,
  Save,
  Lock,
  ExternalLink
} from 'lucide-react';

interface AdminOperationsPortalProps {
  auditLogs: AuditRecord[];
  exceptions: OperationalException[];
  onResolveException: (exceptionId: string, resolution: string) => void;
  onAppendAudit: (record: Omit<AuditRecord, 'id' | 'timestamp'>) => void;
}

export const AdminOperationsPortal: React.FC<AdminOperationsPortalProps> = ({
  auditLogs,
  exceptions,
  onResolveException,
  onAppendAudit,
}) => {
  const [activeTab, setActiveTab] = useState<'exceptions' | 'audit' | 'ranking' | 'kpis'>('exceptions');
  const [auditSearch, setAuditSearch] = useState('');

  // Ranking weights configuration state (FR-CORE-06)
  const [priceWeight, setPriceWeight] = useState(40);
  const [trustWeight, setTrustWeight] = useState(25);
  const [stockWeight, setStockWeight] = useState(20);
  const [feedbackWeight, setFeedbackWeight] = useState(15);
  const [rankingSaved, setRankingSaved] = useState(false);

  const totalWeight = priceWeight + trustWeight + stockWeight + feedbackWeight;

  const handleSaveRankingWeights = () => {
    if (totalWeight !== 100) {
      alert('Total ranking weights must equal 100%. Currently: ' + totalWeight + '%');
      return;
    }

    onAppendAudit({
      actorId: 'admin-lead-arun',
      actorRole: 'Product Admin / Operations',
      actionType: 'RANKING_WEIGHT_CONFIG',
      entityType: 'Ranking Model',
      entityId: `cfg-rank-${Date.now()}`,
      previousState: 'v1.4 (Price 40%, Trust 25%, Stock 20%, Feedback 15%)',
      newState: `Price ${priceWeight}%, Trust ${trustWeight}%, Stock ${stockWeight}%, Feedback ${feedbackWeight}%`,
      reason: 'Admin adjusted weights per PRD FR-CORE-06 governance review.',
      correlationId: `corr-rank-${Date.now().toString().slice(-6)}`,
      sourceContext: 'Admin Operations Portal'
    });

    setRankingSaved(true);
    setTimeout(() => setRankingSaved(false), 3000);
  };

  const filteredAudit = auditLogs.filter(a =>
    a.actorId.toLowerCase().includes(auditSearch.toLowerCase()) ||
    a.actionType.toLowerCase().includes(auditSearch.toLowerCase()) ||
    a.entityId.toLowerCase().includes(auditSearch.toLowerCase()) ||
    a.reason?.toLowerCase().includes(auditSearch.toLowerCase())
  );

  return (
    <div id="admin-operations-root" className="space-y-6">
      {/* Admin Header Card */}
      <div className="bg-white border border-zinc-200 rounded-xl p-6 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-zinc-100 pb-5">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-50 text-rose-800 border border-rose-200">
                <Lock className="w-3.5 h-3.5 text-rose-600" />
                PRD Section 9.10 & Persona E: Admin & Operations
              </span>
              <span className="text-xs font-mono text-zinc-500 bg-zinc-100 px-2 py-0.5 rounded">
                Role: Operations Lead / Governance
              </span>
            </div>
            <h2 className="text-2xl font-bold tracking-tight text-zinc-900">
              Marketplace Operations & Governance Console
            </h2>
            <p className="text-sm text-zinc-600">
              Monitor North Star CQMO metrics, resolve operational exceptions, audit sensitive system events, and tune explainable ranking weights.
            </p>
          </div>

          <div className="flex items-center gap-2 bg-zinc-100 p-1 rounded-xl shrink-0">
            <button
              onClick={() => setActiveTab('exceptions')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                activeTab === 'exceptions' ? 'bg-white text-zinc-900 shadow-xs' : 'text-zinc-600 hover:text-zinc-900'
              }`}
            >
              Exceptions ({exceptions.filter(e => e.status !== 'resolved').length})
            </button>
            <button
              onClick={() => setActiveTab('audit')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                activeTab === 'audit' ? 'bg-white text-zinc-900 shadow-xs' : 'text-zinc-600 hover:text-zinc-900'
              }`}
            >
              Audit Trail (Sec 18)
            </button>
            <button
              onClick={() => setActiveTab('ranking')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                activeTab === 'ranking' ? 'bg-white text-zinc-900 shadow-xs' : 'text-zinc-600 hover:text-zinc-900'
              }`}
            >
              Ranking Config (FR-CORE-06)
            </button>
            <button
              onClick={() => setActiveTab('kpis')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                activeTab === 'kpis' ? 'bg-white text-zinc-900 shadow-xs' : 'text-zinc-600 hover:text-zinc-900'
              }`}
            >
              PRD KPIs (Sec 5)
            </button>
          </div>
        </div>

        {/* PRD Section 5 Telemetry Metrics Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 text-xs">
          <div className="p-3 rounded-lg bg-zinc-50 border border-zinc-100">
            <div className="flex items-center justify-between text-zinc-500">
              <span>North Star: CQMO</span>
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            </div>
            <span className="text-xl font-bold font-mono text-zinc-900 mt-1 block">84 Orders</span>
            <span className="text-[11px] text-emerald-700 font-medium">Completed Qualified Orders</span>
          </div>

          <div className="p-3 rounded-lg bg-zinc-50 border border-zinc-100">
            <span className="text-zinc-500 block">Search-to-Detail</span>
            <span className="text-xl font-bold font-mono text-zinc-900 mt-1 block">68.4%</span>
            <span className="text-[11px] text-emerald-700 font-medium">Target: ≥60% (Exceeded)</span>
          </div>

          <div className="p-3 rounded-lg bg-zinc-50 border border-zinc-100">
            <span className="text-zinc-500 block">Stock Accuracy</span>
            <span className="text-xl font-bold font-mono text-zinc-900 mt-1 block">98.9%</span>
            <span className="text-[11px] text-emerald-700 font-medium">Target: ≥98% (Compliant)</span>
          </div>

          <div className="p-3 rounded-lg bg-zinc-50 border border-zinc-100">
            <span className="text-zinc-500 block">P95 Search Latency</span>
            <span className="text-xl font-bold font-mono text-zinc-900 mt-1 block">1.24s</span>
            <span className="text-[11px] text-emerald-700 font-medium">NFR-PERF-01 (≤2s)</span>
          </div>
        </div>
      </div>

      {/* Tab Content */}
      {activeTab === 'exceptions' && (
        <div className="bg-white border border-zinc-200 rounded-xl p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-600" />
              <h3 className="text-base font-bold text-zinc-900">
                Operational Exceptions Queue (FR-ADM-04 & Section 10)
              </h3>
            </div>
            <span className="text-xs text-zinc-500">
              {exceptions.filter(e => e.status !== 'resolved').length} Open Exceptions
            </span>
          </div>

          <div className="space-y-3">
            {exceptions.map(exc => (
              <div
                key={exc.id}
                className={`p-4 rounded-xl border transition-all space-y-3 ${
                  exc.status === 'resolved'
                    ? 'border-zinc-200 bg-zinc-50/40 opacity-70'
                    : 'border-amber-200 bg-amber-50/30'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-2.5">
                    <span className="p-1 rounded bg-amber-100 text-amber-800 text-[10px] font-mono font-bold uppercase mt-0.5">
                      {exc.type}
                    </span>
                    <div>
                      <h4 className="text-sm font-bold text-zinc-900">{exc.title}</h4>
                      <p className="text-xs text-zinc-600 mt-0.5 leading-relaxed">{exc.description}</p>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <span className={`text-[10px] font-mono font-semibold px-2 py-0.5 rounded-full ${
                      exc.status === 'resolved' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                    }`}>
                      {exc.status}
                    </span>
                    <span className="text-[11px] text-zinc-400 block mt-1">{exc.timestamp}</span>
                  </div>
                </div>

                {exc.status !== 'resolved' && (
                  <div className="pt-2 border-t border-amber-200/60 flex flex-wrap items-center justify-between gap-2 text-xs">
                    <span className="text-zinc-500 font-medium">Resolution Actions:</span>
                    <div className="flex flex-wrap gap-2">
                      {exc.resolutionOptions.map((opt, oIdx) => (
                        <button
                          key={oIdx}
                          onClick={() => onResolveException(exc.id, opt)}
                          className="px-2.5 py-1 rounded bg-white hover:bg-zinc-100 border border-zinc-200 text-zinc-800 font-medium text-[11px] transition-colors"
                        >
                          {opt}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab: Immutable Audit Trail (PRD Section 18) */}
      {activeTab === 'audit' && (
        <div className="bg-white border border-zinc-200 rounded-xl p-6 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-zinc-100 pb-3">
            <div className="flex items-center gap-2">
              <History className="w-4 h-4 text-zinc-900" />
              <h3 className="text-base font-bold text-zinc-900">
                Immutable Operational Audit Log (Section 18.2 Schema)
              </h3>
            </div>

            <div className="relative w-full sm:w-64">
              <Search className="w-3.5 h-3.5 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={auditSearch}
                onChange={(e) => setAuditSearch(e.target.value)}
                placeholder="Search audit records..."
                className="w-full pl-8 pr-3 py-1.5 text-xs rounded-lg border border-zinc-200 bg-zinc-50"
              />
            </div>
          </div>

          <div className="overflow-x-auto rounded-lg border border-zinc-200">
            <table className="w-full text-xs text-left">
              <thead className="bg-zinc-50 text-zinc-700 font-semibold border-b border-zinc-200">
                <tr>
                  <th className="p-2.5">Timestamp</th>
                  <th className="p-2.5">Action Type</th>
                  <th className="p-2.5">Actor & Role</th>
                  <th className="p-2.5">Target Entity</th>
                  <th className="p-2.5">State Change</th>
                  <th className="p-2.5">Reason & Correlation ID</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100 text-zinc-700">
                {filteredAudit.map(log => (
                  <tr key={log.id} className="hover:bg-zinc-50/70">
                    <td className="p-2.5 font-mono text-[11px] text-zinc-500 whitespace-nowrap">{log.timestamp}</td>
                    <td className="p-2.5 font-mono font-bold text-zinc-900">{log.actionType}</td>
                    <td className="p-2.5">
                      <span className="font-semibold text-zinc-900">{log.actorId}</span>
                      <span className="text-[11px] text-zinc-400 block">{log.actorRole}</span>
                    </td>
                    <td className="p-2.5 font-mono text-[11px]">
                      {log.entityType} ({log.entityId})
                    </td>
                    <td className="p-2.5 text-[11px]">
                      <span className="text-zinc-400">{log.previousState || '—'}</span>
                      <span className="mx-1 text-zinc-400">→</span>
                      <span className="font-semibold text-emerald-700">{log.newState}</span>
                    </td>
                    <td className="p-2.5 text-[11px]">
                      <p className="line-clamp-2">{log.reason}</p>
                      <span className="font-mono text-[10px] text-zinc-400">ID: {log.correlationId}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab: Ranking Weights Configuration (FR-CORE-06) */}
      {activeTab === 'ranking' && (
        <div className="bg-white border border-zinc-200 rounded-xl p-6 shadow-xs space-y-6">
          <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
            <div className="flex items-center gap-2">
              <Sliders className="w-4 h-4 text-zinc-900" />
              <h3 className="text-base font-bold text-zinc-900">
                Explainable Multi-Factor Ranking Weights (FR-CORE-06)
              </h3>
            </div>
            <span className={`text-xs font-mono font-bold px-2 py-0.5 rounded ${
              totalWeight === 100 ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
            }`}>
              Total Weight: {totalWeight}% / 100%
            </span>
          </div>

          {rankingSaved && (
            <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-xs font-semibold text-emerald-800 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              Ranking weights updated and committed to Section 18 Audit Log!
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
            <div className="p-4 rounded-xl border border-zinc-200 bg-zinc-50/50 space-y-2">
              <div className="flex justify-between font-semibold text-zinc-900">
                <span>1. Normalized Price Competitiveness</span>
                <span className="font-mono">{priceWeight}%</span>
              </div>
              <input
                type="range"
                min="10"
                max="60"
                value={priceWeight}
                onChange={(e) => setPriceWeight(parseInt(e.target.value))}
                className="w-full accent-zinc-900 cursor-pointer"
              />
              <p className="text-zinc-500 text-[11px]">
                Prioritizes lowest unit price per single tablet or standard pack formulation.
              </p>
            </div>

            <div className="p-4 rounded-xl border border-zinc-200 bg-zinc-50/50 space-y-2">
              <div className="flex justify-between font-semibold text-zinc-900">
                <span>2. Partner Trust & Pharmacy SLA Rating</span>
                <span className="font-mono">{trustWeight}%</span>
              </div>
              <input
                type="range"
                min="10"
                max="50"
                value={trustWeight}
                onChange={(e) => setTrustWeight(parseInt(e.target.value))}
                className="w-full accent-zinc-900 cursor-pointer"
              />
              <p className="text-zinc-500 text-[11px]">
                Derived from licensed pharmacy reviews and on-time fulfillment records.
              </p>
            </div>

            <div className="p-4 rounded-xl border border-zinc-200 bg-zinc-50/50 space-y-2">
              <div className="flex justify-between font-semibold text-zinc-900">
                <span>3. Stock Availability & Freshness SLA</span>
                <span className="font-mono">{stockWeight}%</span>
              </div>
              <input
                type="range"
                min="10"
                max="40"
                value={stockWeight}
                onChange={(e) => setStockWeight(parseInt(e.target.value))}
                className="w-full accent-zinc-900 cursor-pointer"
              />
              <p className="text-zinc-500 text-[11px]">
                Favors partners with verified inventory depth and recently updated catalog feeds.
              </p>
            </div>

            <div className="p-4 rounded-xl border border-zinc-200 bg-zinc-50/50 space-y-2">
              <div className="flex justify-between font-semibold text-zinc-900">
                <span>4. Verified Customer Feedback Score</span>
                <span className="font-mono">{feedbackWeight}%</span>
              </div>
              <input
                type="range"
                min="5"
                max="30"
                value={feedbackWeight}
                onChange={(e) => setFeedbackWeight(parseInt(e.target.value))}
                className="w-full accent-zinc-900 cursor-pointer"
              />
              <p className="text-zinc-500 text-[11px]">
                Restricted to verified buyers to prevent review manipulation (PRD Section 3.3).
              </p>
            </div>
          </div>

          <div className="flex justify-end pt-3 border-t border-zinc-100">
            <button
              onClick={handleSaveRankingWeights}
              disabled={totalWeight !== 100}
              className="px-4 py-2 rounded-lg bg-zinc-900 text-white font-semibold text-xs flex items-center gap-1.5 disabled:opacity-50 shadow-xs"
            >
              <Save className="w-3.5 h-3.5" />
              Save & Audit Model v1.4
            </button>
          </div>
        </div>
      )}

      {/* Tab: PRD KPIs (PRD Section 5) */}
      {activeTab === 'kpis' && (
        <div className="bg-white border border-zinc-200 rounded-xl p-6 shadow-xs space-y-4">
          <div className="border-b border-zinc-100 pb-3">
            <h3 className="text-base font-bold text-zinc-900">
              PRD Section 5: Success Metrics & KPI Tracking Matrix
            </h3>
            <p className="text-xs text-zinc-500">
              Real-time measurement against targets established in Section 5.2 and Section 5.4 Guardrails.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="p-3.5 rounded-lg border border-zinc-200 bg-zinc-50/50 space-y-1.5">
              <div className="flex justify-between">
                <span className="font-semibold text-zinc-900">Search-to-Detail Rate (BG-01)</span>
                <span className="font-mono font-bold text-emerald-700">68.4% (Target: ≥60%)</span>
              </div>
              <div className="w-full bg-zinc-200 h-2 rounded-full overflow-hidden">
                <div className="bg-emerald-600 h-2 rounded-full" style={{ width: '68.4%' }}></div>
              </div>
            </div>

            <div className="p-3.5 rounded-lg border border-zinc-200 bg-zinc-50/50 space-y-1.5">
              <div className="flex justify-between">
                <span className="font-semibold text-zinc-900">Stock Accuracy Rate</span>
                <span className="font-mono font-bold text-emerald-700">98.9% (Target: ≥98%)</span>
              </div>
              <div className="w-full bg-zinc-200 h-2 rounded-full overflow-hidden">
                <div className="bg-emerald-600 h-2 rounded-full" style={{ width: '98.9%' }}></div>
              </div>
            </div>

            <div className="p-3.5 rounded-lg border border-zinc-200 bg-zinc-50/50 space-y-1.5">
              <div className="flex justify-between">
                <span className="font-semibold text-zinc-900">Price Data Freshness (&lt;24h)</span>
                <span className="font-mono font-bold text-emerald-700">99.4% (Target: ≥99%)</span>
              </div>
              <div className="w-full bg-zinc-200 h-2 rounded-full overflow-hidden">
                <div className="bg-emerald-600 h-2 rounded-full" style={{ width: '99.4%' }}></div>
              </div>
            </div>

            <div className="p-3.5 rounded-lg border border-zinc-200 bg-zinc-50/50 space-y-1.5">
              <div className="flex justify-between">
                <span className="font-semibold text-zinc-900">Critical Error Rate</span>
                <span className="font-mono font-bold text-emerald-700">0.08% (Target: &lt;1%)</span>
              </div>
              <div className="w-full bg-zinc-200 h-2 rounded-full overflow-hidden">
                <div className="bg-emerald-600 h-2 rounded-full" style={{ width: '8%' }}></div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
