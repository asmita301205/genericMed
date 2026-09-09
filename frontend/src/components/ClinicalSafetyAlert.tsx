import React, { useState } from 'react';
import { DrugInteractionAlert, SupportedLanguage } from '../types';
import { ShieldCheck, AlertTriangle, AlertOctagon, ChevronDown, ChevronUp, Video, HelpCircle } from 'lucide-react';
import { t } from '../utils/i18n';

interface ClinicalSafetyAlertProps {
  alerts: DrugInteractionAlert[];
  language?: SupportedLanguage;
  onOpenTeleConsult?: () => void;
  compact?: boolean;
}

export const ClinicalSafetyAlert: React.FC<ClinicalSafetyAlertProps> = ({
  alerts,
  language = 'en',
  onOpenTeleConsult,
  compact = false
}) => {
  const [expanded, setExpanded] = useState(!compact);

  if (alerts.length === 0) {
    return (
      <div className="bg-emerald-50/90 border border-emerald-200 rounded-xl p-3.5 flex items-center justify-between text-xs text-emerald-800 shadow-xs">
        <div className="flex items-center gap-2.5">
          <div className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center shrink-0 text-emerald-700">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <div>
            <span className="font-semibold">{t('ddi.safe_title', language)}</span>
            <span className="block text-[11px] text-emerald-600 mt-0.5">
              Formulations cross-referenced with CDSCO & WHO therapeutic safety guidelines.
            </span>
          </div>
        </div>
        <span className="bg-emerald-100 text-emerald-800 font-medium px-2 py-0.5 rounded text-[10px] uppercase tracking-wider shrink-0">
          Passed
        </span>
      </div>
    );
  }

  const hasCritical = alerts.some(a => a.severity === 'critical');

  return (
    <div className={`rounded-xl border transition-all ${
      hasCritical
        ? 'bg-rose-50/95 border-rose-200 text-rose-950 shadow-xs'
        : 'bg-amber-50/95 border-amber-200 text-amber-950 shadow-xs'
    }`}>
      {/* Header */}
      <div className="p-3.5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
            hasCritical ? 'bg-rose-100 text-rose-700' : 'bg-amber-100 text-amber-700'
          }`}>
            {hasCritical ? <AlertOctagon className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4" />}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="font-bold text-xs text-zinc-900">
                {t('ddi.warning_title', language)} ({alerts.length})
              </h4>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                hasCritical ? 'bg-rose-600 text-white' : 'bg-amber-500 text-white'
              }`}>
                {hasCritical ? 'Critical Contraindication' : 'Moderate Interaction'}
              </span>
            </div>
            <p className="text-[11px] text-zinc-600 mt-0.5">
              Active ingredients in your cart or ongoing prescription require pharmacist caution.
            </p>
          </div>
        </div>

        <button
          onClick={() => setExpanded(!expanded)}
          className="text-zinc-500 hover:text-zinc-800 p-1 rounded-md text-xs flex items-center gap-1 font-medium transition-colors"
        >
          {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
      </div>

      {/* Expanded Details */}
      {expanded && (
        <div className="border-t border-zinc-200/60 p-3.5 space-y-3 bg-white/60 rounded-b-xl">
          {alerts.map((alert) => (
            <div
              key={alert.id}
              className={`p-3 rounded-lg border text-xs ${
                alert.severity === 'critical'
                  ? 'bg-rose-50 border-rose-200'
                  : 'bg-amber-50 border-amber-200'
              }`}
            >
              <div className="flex items-center justify-between font-semibold">
                <span className="text-zinc-900">
                  {alert.primaryDrug} <span className="text-zinc-400 font-normal">↔</span> {alert.interactingDrug}
                </span>
                <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold uppercase ${
                  alert.severity === 'critical' ? 'bg-rose-200 text-rose-800' : 'bg-amber-200 text-amber-800'
                }`}>
                  {alert.severity}
                </span>
              </div>

              <div className="mt-1.5 text-zinc-600 leading-relaxed text-[11px]">
                <strong className="text-zinc-800 font-medium">Mechanism:</strong> {alert.mechanism}
              </div>

              <div className="mt-1.5 text-zinc-800 font-medium text-[11px] bg-white/80 p-2 rounded border border-zinc-200">
                <span className="text-indigo-600 font-bold">Clinical Advisory:</span> {alert.clinicalAdvisory}
              </div>

              {alert.requiresPharmacistOverride && (
                <div className="mt-2 flex items-center justify-between pt-2 border-t border-rose-200/60 text-[11px]">
                  <span className="text-rose-700 font-semibold flex items-center gap-1">
                    <HelpCircle className="w-3.5 h-3.5" />
                    Mandatory Pharmacist Verification before dispatch
                  </span>
                  {onOpenTeleConsult && (
                    <button
                      type="button"
                      onClick={onOpenTeleConsult}
                      className="inline-flex items-center gap-1 px-2.5 py-1 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-md text-[11px] transition-colors shadow-xs"
                    >
                      <Video className="w-3 h-3" />
                      Consult Doctor for Alternative
                    </button>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
