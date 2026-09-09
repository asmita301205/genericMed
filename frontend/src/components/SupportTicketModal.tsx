import React, { useState } from 'react';
import { SupportTicket, TicketCategory, TicketPriority, OrderRecord } from '../types';
import {
  LifeBuoy,
  MessageSquare,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Send,
  X,
  ShieldCheck,
  Package,
  FileQuestion,
  RotateCcw,
  User,
  Stethoscope
} from 'lucide-react';

interface SupportTicketModalProps {
  isOpen: boolean;
  onClose: () => void;
  tickets: SupportTicket[];
  orders: OrderRecord[];
  onCreateTicket: (ticket: Omit<SupportTicket, 'id' | 'createdAt' | 'messages'>, initialMessage: string) => void;
  onReplyTicket: (ticketId: string, text: string) => void;
  initialOrderId?: string;
}

export const SupportTicketModal: React.FC<SupportTicketModalProps> = ({
  isOpen,
  onClose,
  tickets,
  orders,
  onCreateTicket,
  onReplyTicket,
  initialOrderId,
}) => {
  const [activeTab, setActiveTab] = useState<'view' | 'create'>('view');
  const [selectedTicketId, setSelectedTicketId] = useState<string>(tickets[0]?.id || '');
  const [replyText, setReplyText] = useState('');

  // Form state for creating a ticket
  const [selectedOrderId, setSelectedOrderId] = useState<string>(initialOrderId || orders[0]?.id || '');
  const [category, setCategory] = useState<TicketCategory>('Delayed Delivery');
  const [priority, setPriority] = useState<TicketPriority>('P1 High');
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');
  const [submitSuccessMsg, setSubmitSuccessMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const activeTicket = tickets.find(t => t.id === selectedTicketId) || tickets[0];

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject.trim() || !description.trim()) {
      alert('Please fill in both a subject and detailed description.');
      return;
    }

    onCreateTicket(
      {
        orderId: selectedOrderId,
        customerName: 'Aarav Sharma',
        customerEmail: 'aarav.sharma@example.com',
        category,
        priority,
        status: 'Open',
        subject,
      },
      description
    );

    setSubmitSuccessMsg('Support ticket submitted! A pharmacist or dispatch lead will reply shortly.');
    setActiveTab('view');
    setSubject('');
    setDescription('');
    setTimeout(() => setSubmitSuccessMsg(null), 4000);
  };

  const handleSendReply = () => {
    if (!replyText.trim() || !activeTicket) return;
    onReplyTicket(activeTicket.id, replyText);
    setReplyText('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl border border-zinc-200 w-full max-w-3xl max-h-[92vh] flex flex-col overflow-hidden">
        {/* Modal Header */}
        <div className="p-5 border-b border-zinc-100 flex items-start justify-between bg-zinc-50/60">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-100 text-rose-800">
                <LifeBuoy className="w-3.5 h-3.5 text-rose-600" />
                Fulfillment Support & Clinical Desk (Phase 2)
              </span>
              <span className="text-xs font-mono text-zinc-500 bg-zinc-100 px-2 py-0.5 rounded">
                SLA: &lt;15 Mins
              </span>
            </div>
            <h2 className="text-xl font-bold text-zinc-900">
              Customer Support & Dispute Center
            </h2>
            <p className="text-xs text-zinc-600">
              Report fulfillment delays, damaged packages, dosage inquiries, or request order refunds.
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switcher */}
        <div className="px-6 pt-3 flex items-center justify-between border-b border-zinc-100 bg-white">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('view')}
              className={`pb-3 text-xs font-bold border-b-2 transition-all ${
                activeTab === 'view'
                  ? 'border-zinc-900 text-zinc-900'
                  : 'border-transparent text-zinc-500 hover:text-zinc-800'
              }`}
            >
              Active Tickets ({tickets.length})
            </button>
            <button
              onClick={() => setActiveTab('create')}
              className={`pb-3 text-xs font-bold border-b-2 transition-all ${
                activeTab === 'create'
                  ? 'border-zinc-900 text-zinc-900'
                  : 'border-transparent text-zinc-500 hover:text-zinc-800'
              }`}
            >
              + Open New Support Case
            </button>
          </div>

          {submitSuccessMsg && (
            <span className="text-xs text-emerald-700 font-semibold flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              {submitSuccessMsg}
            </span>
          )}
        </div>

        {/* Modal Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {activeTab === 'create' ? (
            <form onSubmit={handleCreateSubmit} className="space-y-4 max-w-xl mx-auto text-xs">
              <div>
                <label className="font-bold text-zinc-900 block mb-1">Select Order ID</label>
                <select
                  value={selectedOrderId}
                  onChange={(e) => setSelectedOrderId(e.target.value)}
                  className="w-full px-3 py-2 border rounded-xl border-zinc-300 bg-zinc-50 focus:bg-white text-xs font-mono font-semibold"
                >
                  {orders.map(o => (
                    <option key={o.id} value={o.id}>
                      {o.id} ({o.items.map(i => i.canonicalProduct.canonicalName).join(', ')}) - ₹{o.totalAmount.toFixed(2)}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-zinc-900 block mb-1">Issue Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as TicketCategory)}
                    className="w-full px-3 py-2 border rounded-xl border-zinc-300 bg-zinc-50 focus:bg-white text-xs font-medium"
                  >
                    <option value="Delayed Delivery">Delayed Delivery (SLA Breach)</option>
                    <option value="Damaged Package">Damaged Package / Blister</option>
                    <option value="Prescription Query">Prescription / Dosage Query</option>
                    <option value="Refund Request">Payment / Refund Request</option>
                    <option value="Dosage Clarification">Dosage Clarification</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-zinc-900 block mb-1">Priority</label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value as TicketPriority)}
                    className="w-full px-3 py-2 border rounded-xl border-zinc-300 bg-zinc-50 focus:bg-white text-xs font-medium"
                  >
                    <option value="P1 High">P1 High (Affects Treatment / Transit)</option>
                    <option value="P0 Critical">P0 Critical (Adverse Event / Damaged)</option>
                    <option value="P2 Medium">P2 Medium (General Query)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-bold text-zinc-900 block mb-1">Subject</label>
                <input
                  type="text"
                  placeholder="e.g. Courier delayed by 30 mins beyond SLA"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full px-3 py-2 border rounded-xl border-zinc-300 bg-white text-xs font-semibold"
                />
              </div>

              <div>
                <label className="font-bold text-zinc-900 block mb-1">Detailed Description</label>
                <textarea
                  rows={4}
                  placeholder="Describe your issue with the order, packaging, or doctor prescription..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3 py-2 border rounded-xl border-zinc-300 bg-white text-xs leading-relaxed"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setActiveTab('view')}
                  className="px-4 py-2 rounded-xl border border-zinc-200 text-zinc-700 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-zinc-900 text-white font-semibold hover:bg-zinc-800 shadow-xs flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  Submit Support Ticket
                </button>
              </div>
            </form>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start text-xs">
              {/* Left Column: Tickets List */}
              <div className="md:col-span-5 space-y-2.5">
                <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider block">
                  Your Tickets ({tickets.length})
                </span>
                {tickets.map(ticket => {
                  const isSelected = ticket.id === activeTicket?.id;
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
                            : 'bg-blue-100 text-blue-800'
                        }`}>
                          {ticket.status}
                        </span>
                      </div>
                      <h4 className="font-bold text-zinc-900 mt-1 line-clamp-1">{ticket.subject}</h4>
                      <div className="mt-2 flex items-center justify-between text-[11px] text-zinc-500">
                        <span>Order: {ticket.orderId}</span>
                        <span>{ticket.createdAt}</span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Right Column: Ticket Conversation Thread */}
              {activeTicket && (
                <div className="md:col-span-7 bg-zinc-50 border border-zinc-200 rounded-xl p-4 flex flex-col h-[400px]">
                  {/* Thread Header */}
                  <div className="border-b border-zinc-200 pb-3 flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-zinc-900">{activeTicket.id}</span>
                        <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-zinc-200 text-zinc-800">
                          {activeTicket.category}
                        </span>
                      </div>
                      <h4 className="font-bold text-zinc-900 mt-1">{activeTicket.subject}</h4>
                    </div>

                    {activeTicket.refundIssued && (
                      <span className="px-2 py-1 rounded bg-emerald-100 text-emerald-800 font-mono font-bold text-[11px]">
                        Refund: ₹{activeTicket.refundIssued.toFixed(2)}
                      </span>
                    )}
                  </div>

                  {/* Messages Bubble List */}
                  <div className="flex-1 overflow-y-auto py-3 space-y-3">
                    {activeTicket.messages.map(msg => {
                      const isMe = msg.sender === 'customer';
                      const isPharmacist = msg.sender === 'pharmacist';
                      return (
                        <div
                          key={msg.id}
                          className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
                        >
                          <div className="flex items-center gap-1.5 text-[10px] text-zinc-400 mb-0.5">
                            {isPharmacist && <Stethoscope className="w-3 h-3 text-emerald-600" />}
                            <span className="font-semibold text-zinc-600">{msg.senderName}</span>
                            <span>•</span>
                            <span>{msg.timestamp}</span>
                          </div>
                          <div className={`p-3 rounded-xl max-w-[85%] text-xs leading-relaxed ${
                            isMe
                              ? 'bg-zinc-900 text-white rounded-tr-none'
                              : isPharmacist
                              ? 'bg-emerald-50 border border-emerald-200 text-emerald-950 rounded-tl-none'
                              : 'bg-white border border-zinc-200 text-zinc-800 rounded-tl-none shadow-xs'
                          }`}>
                            {msg.text}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Reply Input Box */}
                  <div className="pt-3 border-t border-zinc-200 flex items-center gap-2">
                    <input
                      type="text"
                      placeholder="Type your response to support..."
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      onKeyDown={(e) => { if (e.key === 'Enter') handleSendReply(); }}
                      className="flex-1 px-3 py-2 border rounded-xl border-zinc-300 bg-white text-xs"
                    />
                    <button
                      onClick={handleSendReply}
                      className="px-3.5 py-2 rounded-xl bg-zinc-900 text-white hover:bg-zinc-800 font-semibold transition-colors flex items-center gap-1 shrink-0"
                    >
                      <Send className="w-3.5 h-3.5" />
                      Reply
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-zinc-100 bg-zinc-50/60 flex items-center justify-between text-xs">
          <div className="flex items-center gap-1.5 text-zinc-500 text-[11px]">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>All ticket interactions and refund authorizations are logged to Section 18 Audit Trail.</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-zinc-200 hover:bg-zinc-300 text-zinc-800 font-semibold transition-colors"
          >
            Close Support Desk
          </button>
        </div>
      </div>
    </div>
  );
};
