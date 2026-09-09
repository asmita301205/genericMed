import React, { useState } from 'react';
import { ChronicSubscription, SubscriptionIntervalDays } from '../types';
import {
  RotateCcw,
  Calendar,
  CheckCircle2,
  AlertCircle,
  PauseCircle,
  PlayCircle,
  Zap,
  ShieldCheck,
  X,
  CreditCard,
  TrendingDown,
  Clock,
  Sparkles,
  ChevronRight
} from 'lucide-react';

interface SubscriptionManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  subscriptions: ChronicSubscription[];
  onToggleStatus: (subscriptionId: string) => void;
  onChangeInterval: (subscriptionId: string, intervalDays: SubscriptionIntervalDays) => void;
  onTriggerRefill: (subscription: ChronicSubscription) => void;
  onNavigateToDiscovery: () => void;
}

export const SubscriptionManagerModal: React.FC<SubscriptionManagerModalProps> = ({
  isOpen,
  onClose,
  subscriptions,
  onToggleStatus,
  onChangeInterval,
  onTriggerRefill,
  onNavigateToDiscovery,
}) => {
  const [refillSuccessMsg, setRefillSuccessMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const activeSubscriptions = subscriptions.filter(s => s.status === 'active');
  const totalAnnualSavings = subscriptions.reduce((sum, s) => sum + (s.monthlySavings * 12), 0);

  const handleInstantRefill = (sub: ChronicSubscription) => {
    onTriggerRefill(sub);
    setRefillSuccessMsg(`Instant refill order dispatched for ${sub.canonicalProduct.canonicalName}!`);
    setTimeout(() => setRefillSuccessMsg(null), 4000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl border border-zinc-200 w-full max-w-3xl max-h-[90vh] flex flex-col overflow-hidden">
        {/* Modal Header */}
        <div className="p-6 border-b border-zinc-100 flex items-start justify-between bg-zinc-50/50">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-blue-100 text-blue-800">
                <RotateCcw className="w-3 h-3 text-blue-600" />
                Phase 2 Growth: Chronic Care Auto-Refill (Persona B)
              </span>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium bg-emerald-100 text-emerald-800">
                <Sparkles className="w-3 h-3 text-emerald-600" />
                Extra 5% Subscriber Savings
              </span>
            </div>
            <h2 className="text-xl font-bold text-zinc-900">
              Chronic Care Subscription & Auto-Refills
            </h2>
            <p className="text-xs text-zinc-600">
              Automated delivery schedule for maintenance medications. Pause, adjust interval, or trigger on-demand instant refills anytime.
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Feedback alert */}
        {refillSuccessMsg && (
          <div className="mx-6 mt-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 flex items-center justify-between font-semibold animate-in fade-in">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{refillSuccessMsg}</span>
            </div>
            <span className="text-[11px] font-mono text-emerald-700">Order Placed & Dispatched</span>
          </div>
        )}

        {/* Savings & Overview Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-6 border-b border-zinc-100 bg-white text-xs">
          <div className="p-3 rounded-xl bg-blue-50/60 border border-blue-100">
            <span className="text-zinc-500 block text-[11px]">Active Plans</span>
            <span className="text-base font-bold text-blue-900">{activeSubscriptions.length} Subscriptions</span>
          </div>
          <div className="p-3 rounded-xl bg-emerald-50/60 border border-emerald-100">
            <span className="text-zinc-500 block text-[11px]">Projected Annual Savings</span>
            <span className="text-base font-bold text-emerald-800 font-mono">₹{totalAnnualSavings.toFixed(0)}/yr</span>
          </div>
          <div className="p-3 rounded-xl bg-purple-50/60 border border-purple-100">
            <span className="text-zinc-500 block text-[11px]">Next Automated Cycle</span>
            <span className="text-base font-bold text-purple-900 font-mono">10 Sep 2026</span>
          </div>
          <div className="p-3 rounded-xl bg-zinc-50 border border-zinc-100">
            <span className="text-zinc-500 block text-[11px]">Pre-Authorization</span>
            <span className="text-base font-bold text-zinc-800 flex items-center gap-1">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              UPI AutoPay
            </span>
          </div>
        </div>

        {/* Subscriptions List */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {subscriptions.length === 0 ? (
            <div className="text-center py-10 space-y-3">
              <RotateCcw className="w-10 h-10 text-zinc-300 mx-auto" />
              <h3 className="text-sm font-bold text-zinc-900">No Chronic Subscriptions Yet</h3>
              <p className="text-xs text-zinc-500 max-w-sm mx-auto">
                Set up automated recurring deliveries for your diabetes, cardiovascular, or hypertension maintenance medicines and save an additional 5%.
              </p>
              <button
                onClick={() => {
                  onClose();
                  onNavigateToDiscovery();
                }}
                className="px-4 py-2 rounded-xl bg-zinc-900 text-white text-xs font-semibold hover:bg-zinc-800 transition-colors shadow-xs"
              >
                Explore Maintenance Medicines
              </button>
            </div>
          ) : (
            subscriptions.map(sub => {
              const isActive = sub.status === 'active';
              return (
                <div
                  key={sub.id}
                  className={`p-5 rounded-2xl border transition-all ${
                    isActive
                      ? 'bg-white border-zinc-200 shadow-xs hover:border-zinc-300'
                      : 'bg-zinc-50/70 border-zinc-200/80 opacity-75'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h4 className="text-base font-bold text-zinc-900">
                          {sub.canonicalProduct.canonicalName}
                        </h4>
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          isActive
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                            : 'bg-amber-100 text-amber-800 border border-amber-200'
                        }`}>
                          {sub.status}
                        </span>
                      </div>
                      <p className="text-xs text-zinc-500">
                        Active Salt: <span className="font-medium text-zinc-700">{sub.canonicalProduct.genericSalt}</span> • {sub.canonicalProduct.strength}
                      </p>
                      <div className="text-xs text-zinc-600 flex items-center gap-2 pt-0.5">
                        <span className="font-medium text-zinc-800">{sub.listing.partnerName}</span>
                        <span>•</span>
                        <span>{sub.quantity} pack(s) / cycle</span>
                        <span>•</span>
                        <span className="font-mono text-emerald-700 font-bold">₹{sub.listing.packPrice * sub.quantity} / refill</span>
                      </div>
                    </div>

                    <div className="text-right sm:shrink-0 space-y-1">
                      <div className="text-xs text-zinc-400">Monthly Recurring Savings</div>
                      <div className="text-base font-bold text-emerald-700 font-mono">
                        ₹{sub.monthlySavings.toFixed(2)}/mo
                      </div>
                    </div>
                  </div>

                  {/* Settings & Actions Bar */}
                  <div className="mt-4 pt-4 border-t border-zinc-100 grid grid-cols-1 sm:grid-cols-12 gap-3 items-center text-xs">
                    {/* Interval Selector */}
                    <div className="sm:col-span-6 flex items-center gap-2">
                      <span className="text-zinc-500 text-[11px] font-medium shrink-0">Frequency:</span>
                      <div className="inline-flex rounded-lg border border-zinc-200 bg-zinc-50 p-0.5 text-[11px]">
                        {([30, 60, 90] as SubscriptionIntervalDays[]).map(days => (
                          <button
                            key={days}
                            onClick={() => onChangeInterval(sub.id, days)}
                            className={`px-2.5 py-1 rounded-md font-semibold transition-colors ${
                              sub.intervalDays === days
                                ? 'bg-white text-zinc-900 shadow-xs'
                                : 'text-zinc-600 hover:text-zinc-900'
                            }`}
                          >
                            Every {days} Days
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Next Due & Refills count */}
                    <div className="sm:col-span-6 flex items-center justify-end gap-2">
                      <button
                        onClick={() => onToggleStatus(sub.id)}
                        className={`px-3 py-1.5 rounded-lg border text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                          isActive
                            ? 'border-zinc-200 text-zinc-700 hover:bg-zinc-100'
                            : 'border-emerald-200 bg-emerald-50 text-emerald-800 hover:bg-emerald-100'
                        }`}
                      >
                        {isActive ? (
                          <>
                            <PauseCircle className="w-3.5 h-3.5 text-zinc-500" />
                            Pause Auto-Delivery
                          </>
                        ) : (
                          <>
                            <PlayCircle className="w-3.5 h-3.5 text-emerald-600" />
                            Resume Subscription
                          </>
                        )}
                      </button>

                      <button
                        onClick={() => handleInstantRefill(sub)}
                        disabled={!isActive}
                        className="px-3.5 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 disabled:opacity-50 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-xs"
                      >
                        <Zap className="w-3.5 h-3.5 text-amber-400" />
                        Instant Refill Now
                      </button>
                    </div>
                  </div>

                  {/* Delivery Info Footer */}
                  <div className="mt-3 bg-zinc-50/80 rounded-xl p-2.5 text-[11px] text-zinc-500 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <span className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-blue-600" />
                      Next Scheduled Auto-Order: <strong className="text-zinc-800">{sub.nextRefillDate}</strong>
                    </span>
                    <span className="flex items-center gap-1.5 truncate">
                      <CreditCard className="w-3.5 h-3.5 text-zinc-400" />
                      Billed via {sub.autoPayMethod} • Refilled {sub.refillCount} times
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-zinc-100 bg-zinc-50/50 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-1.5 text-zinc-500 text-[11px]">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Pre-authorized refills automatically pass inventory revalidation 24 hours prior to billing.</span>
          </div>

          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-zinc-200 hover:bg-zinc-300 text-zinc-800 font-semibold transition-colors shrink-0"
          >
            Close Subscriptions
          </button>
        </div>
      </div>
    </div>
  );
};
