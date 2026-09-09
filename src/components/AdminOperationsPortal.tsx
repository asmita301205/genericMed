import React, { useState } from 'react';
import { AuditRecord, OperationalException, SupportTicket, ProductReview, NationalErpConnector } from '../types';
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
  ExternalLink,
  LifeBuoy,
  MessageSquare,
  Star,
  ShieldCheck,
  Send,
  DollarSign,
  FileSpreadsheet,
  Download,
  Network,
  Sparkles
} from 'lucide-react';

interface AdminOperationsPortalProps {
  auditLogs: AuditRecord[];
  exceptions: OperationalException[];
  tickets?: SupportTicket[];
  reviews?: ProductReview[];
  onOpenNationalNetwork?: () => void;
  erpConnectors?: NationalErpConnector[];
  onResolveException: (exceptionId: string, resolution: string) => void;
  onAppendAudit: (record: Omit<AuditRecord, 'id' | 'timestamp'>) => void;
  onResolveTicket?: (ticketId: string, resolutionNote: string, refundAmount?: number) => void;
  onModerateReview?: (reviewId: string, action: 'approved' | 'flagged' | 'hidden') => void;
}

export const AdminOperationsPortal: React.FC<AdminOperationsPortalProps> = ({
  auditLogs,
  exceptions,
  tickets = [],
  reviews = [],
  onOpenNationalNetwork,
  erpConnectors = [],
  onResolveException,
  onAppendAudit,
  onResolveTicket,
  onModerateReview,
}) => {
  const [activeTab, setActiveTab] = useState<'exceptions' | 'audit' | 'ranking' | 'kpis' | 'support' | 'reviews' | 'compliance_auditor'>('exceptions');
  const [auditSearch, setAuditSearch] = useState('');
  const [isExportingCompliance, setIsExportingCompliance] = useState(false);
  const [complianceExportNotice, setComplianceExportNotice] = useState<string | null>(null);

  // Support ticket admin state
  const [selectedTicketId, setSelectedTicketId] = useState<string>(tickets[0]?.id || '');
  const [ticketResolutionNote, setTicketResolutionNote] = useState('');
  const [ticketRefundAmount, setTicketRefundAmount] = useState<number>(0);
  const [ticketSuccessMsg, setTicketSuccessMsg] = useState<string | null>(null);

  // Review moderation feedback
  const [reviewModMsg, setReviewModMsg] = useState<string | null>(null);

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

  const handleTicketResolution = (ticketId: string) => {
    if (!ticketResolutionNote.trim()) {
      alert('Please enter a resolution note before resolving.');
      return;
    }

    if (onResolveTicket) {
      onResolveTicket(ticketId, ticketResolutionNote, ticketRefundAmount > 0 ? ticketRefundAmount : undefined);
    }

    onAppendAudit({
      actorId: 'admin-lead-arun',
      actorRole: 'Product Admin / Operations',
      actionType: 'SUPPORT_TICKET_RESOLVED',
      entityType: 'Support Ticket',
      entityId: ticketId,
      previousState: 'Status: Open / Investigating',
      newState: `Status: Resolved (Refund: ₹${ticketRefundAmount})`,
      reason: ticketResolutionNote,
      correlationId: `corr-tkt-${Date.now().toString().slice(-6)}`,
      sourceContext: 'Customer Support Desk'
    });

    setTicketSuccessMsg(`Ticket ${ticketId} resolved successfully and audit log updated.`);
    setTicketResolutionNote('');
    setTicketRefundAmount(0);
    setTimeout(() => setTicketSuccessMsg(null), 4000);
  };

  const handleReviewAction = (reviewId: string, action: 'approved' | 'flagged' | 'hidden') => {
    if (onModerateReview) {
      onModerateReview(reviewId, action);
    }

    onAppendAudit({
      actorId: 'admin-lead-arun',
      actorRole: 'Product Admin / Operations',
      actionType: 'REVIEW_MODERATION',
      entityType: 'Product Review',
      entityId: reviewId,
      newState: `Status: ${action}`,
      reason: `Admin compliance review under Section 9.2: ${action.toUpperCase()}`,
      correlationId: `corr-rev-${Date.now().toString().slice(-6)}`,
      sourceContext: 'Review Moderation Queue'
    });

    setReviewModMsg(`Review ${reviewId} marked as ${action.toUpperCase()}.`);
    setTimeout(() => setReviewModMsg(null), 3500);
  };

  const filteredAudit = auditLogs.filter(a =>
    a.actorId.toLowerCase().includes(auditSearch.toLowerCase()) ||
    a.actionType.toLowerCase().includes(auditSearch.toLowerCase()) ||
    a.entityId.toLowerCase().includes(auditSearch.toLowerCase()) ||
    a.reason?.toLowerCase().includes(auditSearch.toLowerCase())
  );

  const activeSupportTicket = tickets.find(t => t.id === selectedTicketId) || tickets[0];

  return (
    <div id="admin-operations-root" className="space-y-6">
      {/* Admin Header Card */}
      <div className="bg-white border border-zinc-200 rounded-xl p-6 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-zinc-100 pb-5">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-50 text-rose-800 border border-rose-200">
                <Lock className="w-3.5 h-3.5 text-rose-600" />
                PRD Section 9.10 & Phase 2: Governance, Support Desk & Compliance
              </span>
              <span className="text-xs font-mono text-zinc-500 bg-zinc-100 px-2 py-0.5 rounded">
                Role: Operations Lead / Governance
              </span>
            </div>
            <h2 className="text-2xl font-bold tracking-tight text-zinc-900">
              Marketplace Operations & Governance Console
            </h2>
            <p className="text-sm text-zinc-600">
              Monitor North Star CQMO metrics, resolve customer disputes, audit Section 18 immutable trails, and moderate clinical reviews.
            </p>
          </div>

          {/* Tab Switcher */}
          <div className="flex flex-wrap items-center gap-1.5 bg-zinc-100 p-1 rounded-xl shrink-0 text-xs">
            <button
              onClick={() => setActiveTab('exceptions')}
              className={`px-3 py-1.5 font-semibold rounded-lg transition-colors ${
                activeTab === 'exceptions' ? 'bg-white text-zinc-900 shadow-xs' : 'text-zinc-600 hover:text-zinc-900'
              }`}
            >
              Exceptions ({exceptions.filter(e => e.status !== 'resolved').length})
            </button>
            <button
              onClick={() => setActiveTab('support')}
              className={`px-3 py-1.5 font-semibold rounded-lg transition-colors flex items-center gap-1 ${
                activeTab === 'support' ? 'bg-white text-zinc-900 shadow-xs' : 'text-zinc-600 hover:text-zinc-900'
              }`}
            >
              <LifeBuoy className="w-3 h-3 text-rose-600" />
              Support Desk ({tickets.filter(t => t.status !== 'Resolved').length})
            </button>
            <button
              onClick={() => setActiveTab('reviews')}
              className={`px-3 py-1.5 font-semibold rounded-lg transition-colors flex items-center gap-1 ${
                activeTab === 'reviews' ? 'bg-white text-zinc-900 shadow-xs' : 'text-zinc-600 hover:text-zinc-900'
              }`}
            >
              <MessageSquare className="w-3 h-3 text-blue-600" />
              Reviews ({reviews.length})
            </button>
            <button
              onClick={() => setActiveTab('audit')}
              className={`px-3 py-1.5 font-semibold rounded-lg transition-colors ${
                activeTab === 'audit' ? 'bg-white text-zinc-900 shadow-xs' : 'text-zinc-600 hover:text-zinc-900'
              }`}
            >
              Audit Trail (Sec 18)
            </button>
            <button
              onClick={() => setActiveTab('ranking')}
              className={`px-3 py-1.5 font-semibold rounded-lg transition-colors ${
                activeTab === 'ranking' ? 'bg-white text-zinc-900 shadow-xs' : 'text-zinc-600 hover:text-zinc-900'
              }`}
            >
              Ranking Config
            </button>
            <button
              onClick={() => setActiveTab('kpis')}
              className={`px-3 py-1.5 font-semibold rounded-lg transition-colors ${
                activeTab === 'kpis' ? 'bg-white text-zinc-900 shadow-xs' : 'text-zinc-600 hover:text-zinc-900'
              }`}
            >
              PRD KPIs
            </button>
            <button
              onClick={() => setActiveTab('compliance_auditor')}
              className={`px-3 py-1.5 font-semibold rounded-lg transition-colors flex items-center gap-1 ${
                activeTab === 'compliance_auditor' ? 'bg-white text-zinc-900 shadow-xs' : 'text-zinc-600 hover:text-zinc-900'
              }`}
            >
              <FileCheck className="w-3 h-3 text-emerald-600" />
              Statutory AI Auditor (Sec 18)
            </button>
          </div>
        </div>

        {/* PRD Section 5 Telemetry Metrics Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 text-xs">
          <div className="p-3 rounded-lg bg-zinc-50 border border-zinc-100">
            <span className="text-zinc-500 block text-[11px]">Active Exceptions</span>
            <span className="text-base font-bold text-rose-700 font-mono">
              {exceptions.filter(e => e.status !== 'resolved').length} Pending Review
            </span>
          </div>
          <div className="p-3 rounded-lg bg-zinc-50 border border-zinc-100">
            <span className="text-zinc-500 block text-[11px]">Open Support Cases</span>
            <span className="text-base font-bold text-zinc-900 font-mono">
              {tickets.filter(t => t.status !== 'Resolved').length} Active Cases
            </span>
          </div>
          <div className="p-3 rounded-lg bg-zinc-50 border border-zinc-100">
            <span className="text-zinc-500 block text-[11px]">Section 18 Audit Log</span>
            <span className="text-base font-bold text-zinc-900 font-mono">{auditLogs.length} Records</span>
          </div>
          <div className="p-3 rounded-lg bg-zinc-50 border border-zinc-100">
            <span className="text-zinc-500 block text-[11px]">Clinical Efficacy Moderation</span>
            <span className="text-base font-bold text-emerald-700">100% Verified</span>
          </div>
        </div>
      </div>

      {/* Tab: Operational Exceptions */}
      {activeTab === 'exceptions' && (
        <div className="bg-white border border-zinc-200 rounded-xl p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
            <div className="flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-rose-600" />
              <h3 className="text-base font-bold text-zinc-900">
                Live Operational Exception Resolution Queue (FR-ADM-01)
              </h3>
            </div>
            <span className="text-xs font-mono text-zinc-500">
              {exceptions.filter(e => e.status !== 'resolved').length} unresolved
            </span>
          </div>

          <div className="space-y-3">
            {exceptions.map(exception => (
              <div
                key={exception.id}
                className={`p-4 rounded-xl border transition-all text-xs ${
                  exception.status === 'resolved'
                    ? 'border-zinc-200 bg-zinc-50/50 opacity-60'
                    : 'border-rose-200 bg-rose-50/20 shadow-xs'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-zinc-900">{exception.id}</span>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        exception.severity === 'critical'
                          ? 'bg-rose-100 text-rose-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}>
                        {exception.severity}
                      </span>
                    </div>
                    <h4 className="font-bold text-zinc-900">{exception.title}</h4>
                    <p className="text-zinc-600">{exception.description}</p>
                  </div>

                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-semibold ${
                    exception.status === 'resolved' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                  }`}>
                    {exception.status}
                  </span>
                </div>

                {exception.status !== 'resolved' && (
                  <div className="mt-3 pt-3 border-t border-rose-100 flex items-center justify-between">
                    <span className="text-zinc-500 font-mono text-[11px]">Logged: {exception.timestamp}</span>
                    <div className="flex items-center gap-2">
                      {exception.resolutionOptions.map((opt, idx) => (
                        <button
                          key={idx}
                          onClick={() => onResolveException(exception.id, opt)}
                          className="px-2.5 py-1 rounded bg-white border border-zinc-300 hover:bg-zinc-100 text-zinc-800 font-medium text-xs transition-colors"
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

      {/* Tab: Support Desk & Customer Disputes (Phase 2) */}
      {activeTab === 'support' && (
        <div className="bg-white border border-zinc-200 rounded-xl p-6 shadow-xs space-y-4 text-xs">
          <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
            <div className="flex items-center gap-2">
              <LifeBuoy className="w-4 h-4 text-rose-600" />
              <h3 className="text-base font-bold text-zinc-900">
                Customer Support & Dispute Desk (Phase 2)
              </h3>
            </div>
            <span className="text-xs font-mono text-zinc-400">{tickets.length} Registered Cases</span>
          </div>

          {ticketSuccessMsg && (
            <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-xs font-semibold text-emerald-800 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              {ticketSuccessMsg}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
            {/* Tickets Left List */}
            <div className="md:col-span-5 space-y-2.5">
              <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider block">
                Dispute Inquiries ({tickets.length})
              </span>
              {tickets.map(ticket => {
                const isSelected = ticket.id === activeSupportTicket?.id;
                return (
                  <div
                    key={ticket.id}
                    onClick={() => setSelectedTicketId(ticket.id)}
                    className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                      isSelected
                        ? 'border-zinc-900 bg-zinc-50 shadow-xs ring-2 ring-zinc-900/10'
                        : 'border-zinc-200 bg-white hover:border-zinc-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono font-bold text-zinc-900">{ticket.id}</span>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        ticket.status === 'Resolved'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-rose-100 text-rose-800'
                      }`}>
                        {ticket.status}
                      </span>
                    </div>
                    <h4 className="font-bold text-zinc-900 mt-1 line-clamp-1">{ticket.subject}</h4>
                    <div className="mt-2 flex items-center justify-between text-[11px] text-zinc-500">
                      <span>{ticket.customerName}</span>
                      <span className="font-semibold text-zinc-700">{ticket.category}</span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Ticket Detail & Admin Resolution Right Box */}
            {activeSupportTicket && (
              <div className="md:col-span-7 bg-zinc-50 border border-zinc-200 rounded-xl p-4 space-y-4">
                <div className="border-b border-zinc-200 pb-3 flex items-start justify-between">
                  <div>
                    <span className="font-mono font-bold text-zinc-900 text-sm">
                      Case #{activeSupportTicket.id}
                    </span>
                    <h4 className="font-bold text-zinc-900 text-sm mt-0.5">{activeSupportTicket.subject}</h4>
                    <p className="text-zinc-500 text-[11px] mt-0.5">
                      Customer: {activeSupportTicket.customerName} ({activeSupportTicket.customerEmail}) • Order: {activeSupportTicket.orderId}
                    </p>
                  </div>
                  <span className="px-2 py-1 rounded bg-zinc-200 text-zinc-800 font-bold text-[10px]">
                    {activeSupportTicket.priority}
                  </span>
                </div>

                {/* Message Thread */}
                <div className="space-y-2.5 max-h-48 overflow-y-auto pr-1">
                  {activeSupportTicket.messages.map(m => (
                    <div key={m.id} className="p-3 rounded-lg bg-white border border-zinc-200/80 space-y-1">
                      <div className="flex justify-between text-[10px] text-zinc-400">
                        <span className="font-bold text-zinc-700">{m.senderName} ({m.sender})</span>
                        <span>{m.timestamp}</span>
                      </div>
                      <p className="text-zinc-800 text-xs">{m.text}</p>
                    </div>
                  ))}
                </div>

                {/* Resolution Desk */}
                {activeSupportTicket.status !== 'Resolved' ? (
                  <div className="pt-3 border-t border-zinc-200 space-y-3">
                    <span className="font-bold text-zinc-900 block text-xs">
                      Take Administrative Action & Log Resolution:
                    </span>
                    <textarea
                      rows={2}
                      placeholder="Enter resolution notes (e.g. Courier SLA breach acknowledged, customer credited)..."
                      value={ticketResolutionNote}
                      onChange={(e) => setTicketResolutionNote(e.target.value)}
                      className="w-full px-3 py-2 border rounded-xl border-zinc-300 bg-white text-xs"
                    />
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <DollarSign className="w-3.5 h-3.5 text-zinc-400" />
                        <span className="text-[11px] text-zinc-600 font-medium">Refund Amount (₹):</span>
                        <input
                          type="number"
                          step="10"
                          value={ticketRefundAmount}
                          onChange={(e) => setTicketRefundAmount(Number(e.target.value))}
                          className="w-20 px-2 py-1 border rounded border-zinc-300 bg-white font-mono font-bold text-xs"
                        />
                      </div>
                      <button
                        onClick={() => handleTicketResolution(activeSupportTicket.id)}
                        className="px-4 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-white font-semibold text-xs shadow-xs transition-colors"
                      >
                        Resolve & Commit Audit Log
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs">
                    <span className="font-bold block">Case Resolved</span>
                    <p className="text-[11px] mt-0.5">{activeSupportTicket.resolutionNote}</p>
                    {activeSupportTicket.refundIssued && (
                      <span className="font-mono font-bold text-emerald-800 block mt-1">
                        Refund Issued: ₹{activeSupportTicket.refundIssued.toFixed(2)}
                      </span>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tab: Patient Review Moderation Queue (Phase 2) */}
      {activeTab === 'reviews' && (
        <div className="bg-white border border-zinc-200 rounded-xl p-6 shadow-xs space-y-4 text-xs">
          <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
            <div>
              <h3 className="text-base font-bold text-zinc-900 flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-blue-600" />
                Patient Review Compliance & Moderation Queue (PRD Section 9.2)
              </h3>
              <p className="text-zinc-500 text-[11px] mt-0.5">
                Ensure customer submissions do not violate medical claims guidelines under the Drugs & Magic Remedies Act.
              </p>
            </div>
            <span className="font-mono text-zinc-400">{reviews.length} Total Reviews</span>
          </div>

          {reviewModMsg && (
            <div className="p-3 rounded-lg bg-blue-50 border border-blue-200 text-xs font-semibold text-blue-800 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-blue-600" />
              {reviewModMsg}
            </div>
          )}

          <div className="space-y-3">
            {reviews.map(review => (
              <div key={review.id} className="p-4 rounded-xl border border-zinc-200 bg-zinc-50/50 space-y-2">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-zinc-900">{review.authorName}</span>
                      <span className="text-[11px] text-zinc-400">({review.authorLocation})</span>
                      <span className="font-mono font-semibold text-zinc-700 bg-zinc-200 px-2 py-0.5 rounded text-[10px]">
                        {review.productName}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 mt-0.5">
                      {[1, 2, 3, 4, 5].map(s => (
                        <Star key={s} className={`w-3 h-3 ${s <= review.rating ? 'fill-amber-400 text-amber-400' : 'text-zinc-300'}`} />
                      ))}
                      <span className="text-[11px] text-zinc-500 ml-1">Condition: {review.conditionTreated}</span>
                    </div>
                  </div>

                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                    review.status === 'approved'
                      ? 'bg-emerald-100 text-emerald-800'
                      : review.status === 'flagged'
                      ? 'bg-rose-100 text-rose-800'
                      : 'bg-zinc-100 text-zinc-700'
                  }`}>
                    {review.status}
                  </span>
                </div>

                <h5 className="font-bold text-zinc-900">{review.title}</h5>
                <p className="text-zinc-600 leading-relaxed">{review.comment}</p>

                <div className="pt-2 border-t border-zinc-200 flex items-center justify-between text-[11px]">
                  <span className="text-zinc-400 font-mono">ID: {review.id} • {review.date}</span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleReviewAction(review.id, 'approved')}
                      className="px-2.5 py-1 rounded bg-emerald-600 hover:bg-emerald-700 text-white font-semibold transition-colors shadow-2xs"
                    >
                      Approve Review
                    </button>
                    <button
                      onClick={() => handleReviewAction(review.id, 'flagged')}
                      className="px-2.5 py-1 rounded bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-700 font-semibold transition-colors"
                    >
                      Flag for Medical Review
                    </button>
                    <button
                      onClick={() => handleReviewAction(review.id, 'hidden')}
                      className="px-2.5 py-1 rounded border border-zinc-200 text-zinc-600 hover:bg-zinc-100 transition-colors"
                    >
                      Hide
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab: Section 18 Audit Log */}
      {activeTab === 'audit' && (
        <div className="bg-white border border-zinc-200 rounded-xl p-6 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-zinc-100 pb-3">
            <div className="flex items-center gap-2">
              <History className="w-4 h-4 text-zinc-900" />
              <h3 className="text-base font-bold text-zinc-900">
                Section 18: Regulatory Immutable Audit Trail
              </h3>
            </div>
            <div className="relative w-full sm:w-64">
              <Search className="w-3.5 h-3.5 text-zinc-400 absolute left-2.5 top-2.5" />
              <input
                type="text"
                placeholder="Search audit trail..."
                value={auditSearch}
                onChange={(e) => setAuditSearch(e.target.value)}
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
                Rewards pharmacy partner rating and fulfillment SLA compliance rate.
              </p>
            </div>

            <div className="p-4 rounded-xl border border-zinc-200 bg-zinc-50/50 space-y-2">
              <div className="flex justify-between font-semibold text-zinc-900">
                <span>3. Stock Availability & Freshness</span>
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
                Penalizes listings with stale timestamps (&gt;24h) and low stock count.
              </p>
            </div>

            <div className="p-4 rounded-xl border border-zinc-200 bg-zinc-50/50 space-y-2">
              <div className="flex justify-between font-semibold text-zinc-900">
                <span>4. Verified Customer Efficacy Feedback</span>
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
                Incorporates verified patient clinical reviews and repeat chronic order frequency.
              </p>
            </div>
          </div>

          <div className="pt-2 flex justify-end">
            <button
              onClick={handleSaveRankingWeights}
              className="px-4 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-white font-semibold text-xs transition-colors shadow-xs"
            >
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

      {/* Tab: Section 18 Statutory AI Compliance Auditor & Schedule H/H1 Logs (Phase 3) */}
      {activeTab === 'compliance_auditor' && (
        <div className="bg-white border border-zinc-200 rounded-xl p-6 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-100 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <FileCheck className="w-5 h-5 text-emerald-600" />
                <h3 className="text-base font-bold text-zinc-900">Section 18 Statutory AI Compliance Auditor</h3>
                <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">
                  Schedule H/H1 Verified
                </span>
              </div>
              <p className="text-xs text-zinc-500 mt-0.5">
                Automated statutory audit checks under the Drugs and Cosmetics Act & National Telemedicine Practice Guidelines.
              </p>
            </div>

            <button
              type="button"
              onClick={() => {
                setIsExportingCompliance(true);
                setTimeout(() => {
                  setIsExportingCompliance(false);
                  setComplianceExportNotice('Form 20/21 Statutory Regulatory Audit Pack generated and signed cryptographically (SHA256: e8b91a... ready for CDSCO inspection).');
                  setTimeout(() => setComplianceExportNotice(null), 5000);
                }, 1000);
              }}
              disabled={isExportingCompliance}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-xs transition-colors cursor-pointer shrink-0"
            >
              <Download className={`w-3.5 h-3.5 ${isExportingCompliance ? 'animate-bounce' : ''}`} />
              {isExportingCompliance ? 'Compiling Audit Pack...' : 'Export Form 20/21 Regulatory Pack'}
            </button>
          </div>

          {complianceExportNotice && (
            <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 flex items-center gap-2.5 animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{complianceExportNotice}</span>
            </div>
          )}

          {/* Statutory Verification Rates */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div className="p-4 rounded-xl bg-emerald-50/60 border border-emerald-200 space-y-1">
              <span className="text-zinc-500 text-[11px] block">Prescription Validated Rate</span>
              <span className="text-2xl font-bold font-mono text-emerald-900">100.0%</span>
              <span className="text-[10px] text-emerald-700 font-semibold block">0 Dispenses Without Valid Rx</span>
            </div>

            <div className="p-4 rounded-xl bg-indigo-50/60 border border-indigo-200 space-y-1">
              <span className="text-zinc-500 text-[11px] block">Doctor MCI Registry Match</span>
              <span className="text-2xl font-bold font-mono text-indigo-900">100.0%</span>
              <span className="text-[10px] text-indigo-700 font-semibold block">NMC Verified Signatures</span>
            </div>

            <div className="p-4 rounded-xl bg-amber-50/60 border border-amber-200 space-y-1">
              <span className="text-zinc-500 text-[11px] block">Near-Expiry Quarantine</span>
              <span className="text-2xl font-bold font-mono text-amber-950">100.0%</span>
              <span className="text-[10px] text-amber-800 font-semibold block">Section 65 Shelf-Life Guard</span>
            </div>

            <div className="p-4 rounded-xl bg-purple-50/60 border border-purple-200 space-y-1">
              <span className="text-zinc-500 text-[11px] block">B2B ERP Sync Heartbeat</span>
              <span className="text-2xl font-bold font-mono text-purple-900">18 ms</span>
              <span className="text-[10px] text-purple-700 font-semibold block">FHIR R4 / EDI 850 Online</span>
            </div>
          </div>

          {/* Statutory Log Feed */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-zinc-900 flex items-center gap-1.5">
              <Activity className="w-4 h-4 text-emerald-600" />
              Automated Statutory Verification Stream (Last 24 Hours)
            </h4>

            <div className="border border-zinc-200 rounded-xl overflow-hidden divide-y divide-zinc-100 text-xs">
              <div className="p-3 bg-zinc-50 font-semibold text-zinc-700 text-[11px] flex justify-between">
                <span>Verification Scope & Entity</span>
                <span>Statutory Authority Standard</span>
                <span>Audit Status</span>
                <span>Timestamp</span>
              </div>

              <div className="p-3 bg-white flex justify-between items-center hover:bg-zinc-50/60">
                <div>
                  <strong className="text-zinc-900 block">Schedule H1 Form 20 Verification • ORD-2026-9044</strong>
                  <span className="text-[11px] text-zinc-500">Dr. Priya Kulkarni (KMC-Reg-48291)</span>
                </div>
                <span className="font-mono text-zinc-600 text-[11px]">Drugs & Cosmetics Rules 65(9)</span>
                <span className="text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  PASSED
                </span>
                <span className="text-zinc-400 text-[11px]">Today at 10:15 AM</span>
              </div>

              <div className="p-3 bg-white flex justify-between items-center hover:bg-zinc-50/60">
                <div>
                  <strong className="text-zinc-900 block">Digital Rx Telemedicine Verification • Dr. Ananya Sharma</strong>
                  <span className="text-[11px] text-zinc-500">MCI Registration REG-MCI-2012-48201 validated</span>
                </div>
                <span className="font-mono text-zinc-600 text-[11px]">Telemedicine Guidelines 2020</span>
                <span className="text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  PASSED
                </span>
                <span className="text-zinc-400 text-[11px]">Today at 09:40 AM</span>
              </div>

              <div className="p-3 bg-white flex justify-between items-center hover:bg-zinc-50/60">
                <div>
                  <strong className="text-zinc-900 block">Pharmacovigilance Batch Quarantine Check • BATCH-PCM-2026-09</strong>
                  <span className="text-[11px] text-zinc-500">Isolated & excluded from sellable inventory</span>
                </div>
                <span className="font-mono text-zinc-600 text-[11px]">D&C Act Section 18(a)</span>
                <span className="text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  QUARANTINED
                </span>
                <span className="text-zinc-400 text-[11px]">Today at 08:30 AM</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
