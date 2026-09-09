import React, { useState } from 'react';
import { EpidemicSurveillanceSignal, BioequivalenceClinicalMetrics } from '../types';
import { SAMPLE_EPIDEMIC_SIGNALS, SAMPLE_BIOEQUIVALENCE_METRICS } from '../data/genericMedData';
import {
  Activity,
  AlertTriangle,
  TrendingUp,
  ShieldCheck,
  CheckCircle2,
  MapPin,
  Calendar,
  X,
  Sparkles,
  BarChart3,
  Stethoscope,
  Info,
  Clock,
  ArrowRight,
  Truck
} from 'lucide-react';

interface EpidemicIntelligenceModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const EpidemicIntelligenceModal: React.FC<EpidemicIntelligenceModalProps> = ({
  isOpen,
  onClose
}) => {
  const [activeTab, setActiveTab] = useState<'epidemic' | 'bioequivalence'>('epidemic');
  const [signals, setSignals] = useState<EpidemicSurveillanceSignal[]>(SAMPLE_EPIDEMIC_SIGNALS);
  const [selectedPkIndex, setSelectedPkIndex] = useState(0);

  const pkMetrics: BioequivalenceClinicalMetrics[] = SAMPLE_BIOEQUIVALENCE_METRICS;
  const currentPk = pkMetrics[selectedPkIndex] || pkMetrics[0];

  if (!isOpen) return null;

  const handleAllocateBuffer = (signalId: string) => {
    setSignals(prev =>
      prev.map(s =>
        s.id === signalId
          ? { ...s, alertLevel: 'NORMAL', actionTaken: 'Priority 14-day stock buffer dispatched & confirmed at all local partner chemist nodes.' }
          : s
      )
    );
    alert('Preventative buffer inventory dispatched to regional fulfillment centers. Stockout risk mitigated.');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white border border-zinc-200 rounded-3xl w-full max-w-4xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 my-8">
        {/* Header Strip */}
        <div className="bg-linear-to-r from-red-700 via-rose-700 to-amber-700 text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30">
              <Activity className="w-6 h-6 text-white animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] uppercase tracking-wider font-semibold bg-white/20 px-2 py-0.5 rounded font-mono">
                  Integrated Disease Surveillance (IDSP)
                </span>
                <span className="text-xs text-rose-100">National Epidemic AI & CDSS</span>
              </div>
              <h2 className="text-lg font-bold">Predictive Supply Chain & Bioequivalence Intelligence</h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-zinc-200 bg-zinc-50 px-6 pt-3 gap-6 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('epidemic')}
            className={`pb-3 border-b-2 transition-all flex items-center gap-2 ${
              activeTab === 'epidemic'
                ? 'border-red-600 text-red-600'
                : 'border-transparent text-zinc-500 hover:text-zinc-800'
            }`}
          >
            <TrendingUp className="w-4 h-4" />
            Epidemic Supply Surveillance (IDSP)
            <span className="px-1.5 py-0.2 rounded-full bg-red-100 text-red-800 text-[10px]">
              {signals.filter(s => s.alertLevel !== 'NORMAL').length} Active Spikes
            </span>
          </button>

          <button
            onClick={() => setActiveTab('bioequivalence')}
            className={`pb-3 border-b-2 transition-all flex items-center gap-2 ${
              activeTab === 'bioequivalence'
                ? 'border-red-600 text-red-600'
                : 'border-transparent text-zinc-500 hover:text-zinc-800'
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            Pharmacokinetic (PK) Equivalence Comparator
            <span className="px-1.5 py-0.2 rounded-full bg-emerald-100 text-emerald-800 text-[10px]">
              Clinical Trials
            </span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6">
          {/* TAB 1: EPIDEMIC SURVEILLANCE & EARLY BUFFER ALLOCATION */}
          {activeTab === 'epidemic' && (
            <div className="space-y-4">
              <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-950 flex items-start gap-2.5">
                <AlertTriangle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                <p>
                  <strong>Automated Early Warning Engine:</strong> genericMed synchronizes with regional disease surveillance feeds to forecast surging generic medicine demand 14 days before retail pharmacy stockouts occur.
                </p>
              </div>

              <div className="space-y-3">
                {signals.map((sig) => {
                  const isOutbreak = sig.alertLevel === 'EPIDEMIC_OUTBREAK';
                  const isElevated = sig.alertLevel === 'ELEVATED';

                  return (
                    <div
                      key={sig.id}
                      className="p-4 rounded-2xl border border-zinc-200 bg-white hover:border-zinc-300 transition-all space-y-3 shadow-xs"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-xs font-semibold text-zinc-900">{sig.id}</span>
                            <span
                              className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                                isOutbreak
                                  ? 'bg-red-100 text-red-800 animate-pulse'
                                  : isElevated
                                  ? 'bg-amber-100 text-amber-800'
                                  : 'bg-emerald-100 text-emerald-800'
                              }`}
                            >
                              {sig.alertLevel}
                            </span>
                          </div>
                          <h4 className="text-sm font-bold text-zinc-900">{sig.diseaseName}</h4>
                          <div className="flex items-center gap-2 text-xs text-zinc-500">
                            <MapPin className="w-3.5 h-3.5 text-zinc-400" />
                            <span>{sig.region} ({sig.state})</span>
                            <span>•</span>
                            <span className="font-semibold text-rose-600">Velocity: {sig.activeCaseVelocity}</span>
                          </div>
                        </div>

                        {/* Action CTA */}
                        {sig.alertLevel !== 'NORMAL' ? (
                          <button
                            onClick={() => handleAllocateBuffer(sig.id)}
                            className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-all shadow-xs shrink-0"
                          >
                            <Truck className="w-4 h-4" />
                            Dispatch 14-Day Buffer Stock
                          </button>
                        ) : (
                          <div className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200 shrink-0">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            Buffer Stocked
                          </div>
                        )}
                      </div>

                      <div className="p-3 rounded-xl bg-zinc-50 border border-zinc-100 text-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                        <div>
                          <span className="text-[10px] text-zinc-400 uppercase font-mono block">Critical Salt Needed</span>
                          <span className="font-bold text-zinc-900">{sig.spikedSaltRequired}</span>
                        </div>
                        <div className="text-right">
                          <span className="text-[10px] text-zinc-400 uppercase font-mono block">Operational Action</span>
                          <span className="text-zinc-600 italic text-[11px]">{sig.actionTaken}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 2: PHARMACOKINETIC (PK) CLINICAL EQUIVALENCE */}
          {activeTab === 'bioequivalence' && (
            <div className="space-y-5">
              {/* Molecule Selector */}
              <div className="flex flex-wrap gap-2">
                {pkMetrics.map((pk, idx) => (
                  <button
                    key={pk.canonicalProductId}
                    onClick={() => setSelectedPkIndex(idx)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                      selectedPkIndex === idx
                        ? 'bg-zinc-900 text-white shadow-xs'
                        : 'bg-zinc-100 text-zinc-700 hover:bg-zinc-200'
                    }`}
                  >
                    {pk.genericSalt}
                  </button>
                ))}
              </div>

              {/* Clinical Equivalence Dashboard */}
              <div className="p-5 rounded-2xl bg-linear-to-br from-zinc-900 to-zinc-950 text-white border border-zinc-800 space-y-4 shadow-lg">
                <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
                  <div>
                    <span className="text-[10px] uppercase font-mono tracking-widest text-emerald-400">
                      CDSCO Clinical Trial Report • {currentPk.clinicalStudyId}
                    </span>
                    <h3 className="text-base font-bold text-white">
                      Generic {currentPk.genericSalt} vs {currentPk.innovatorBrand}
                    </h3>
                  </div>
                  <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-semibold">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    Therapeutic Equivalence Proven
                  </div>
                </div>

                {/* Visual SVG Pharmacokinetic Curve Simulation */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-xs text-zinc-400">
                    <span>Plasma Concentration (mcg/mL) vs Time (hours)</span>
                    <div className="flex items-center gap-4">
                      <span className="flex items-center gap-1.5">
                        <span className="w-3 h-0.5 bg-emerald-400 inline-block"></span>
                        Generic Formulation
                      </span>
                      <span className="flex items-center gap-1.5">
                        <span className="w-3 h-0.5 bg-blue-400 border-t border-dashed inline-block"></span>
                        Innovator Benchmark ({currentPk.innovatorBrand.split(' ')[0]})
                      </span>
                    </div>
                  </div>

                  <div className="h-44 w-full bg-zinc-950 rounded-xl p-4 border border-zinc-800 flex items-center justify-center relative overflow-hidden">
                    {/* SVG Curve overlay */}
                    <svg className="w-full h-full" viewBox="0 0 400 120">
                      <line x1="20" y1="110" x2="380" y2="110" stroke="#374151" strokeWidth="1" />
                      <line x1="20" y1="10" x2="20" y2="110" stroke="#374151" strokeWidth="1" />
                      
                      {/* Innovator Branded Curve (Blue) */}
                      <path
                        d="M 20 110 Q 70 10, 120 40 T 260 90 T 380 110"
                        fill="none"
                        stroke="#60a5fa"
                        strokeWidth="2.5"
                        strokeDasharray="4 2"
                      />

                      {/* Generic Molecule Curve (Emerald) */}
                      <path
                        d="M 20 110 Q 72 12, 122 42 T 262 89 T 380 110"
                        fill="none"
                        stroke="#34d399"
                        strokeWidth="2.5"
                      />

                      {/* Peak Concentration Cmax callout */}
                      <circle cx="72" cy="12" r="3" fill="#34d399" />
                      <text x="80" y="16" fill="#34d399" fontSize="9" fontFamily="monospace">
                        Cmax: {currentPk.cmaxRatioPercent}%
                      </text>
                    </svg>
                  </div>
                </div>

                {/* Numerical Trial Metrics */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs pt-2">
                  <div className="p-3 rounded-xl bg-zinc-900 border border-zinc-800">
                    <span className="text-zinc-500 block text-[10px] font-mono uppercase">AUC Area Under Curve</span>
                    <span className="text-base font-bold text-emerald-400 font-mono">{currentPk.aucRatioPercent}%</span>
                    <span className="text-[10px] text-zinc-400 block mt-0.5">Permitted: 80%–125%</span>
                  </div>

                  <div className="p-3 rounded-xl bg-zinc-900 border border-zinc-800">
                    <span className="text-zinc-500 block text-[10px] font-mono uppercase">Cmax Peak Ratio</span>
                    <span className="text-base font-bold text-emerald-400 font-mono">{currentPk.cmaxRatioPercent}%</span>
                    <span className="text-[10px] text-zinc-400 block mt-0.5">Exact Bioequivalent</span>
                  </div>

                  <div className="p-3 rounded-xl bg-zinc-900 border border-zinc-800">
                    <span className="text-zinc-500 block text-[10px] font-mono uppercase">Tmax Delta (hr)</span>
                    <span className="text-base font-bold text-zinc-200 font-mono">{currentPk.tmaxDeltaHours} hrs</span>
                    <span className="text-[10px] text-zinc-400 block mt-0.5">Identical Absorption Rate</span>
                  </div>

                  <div className="p-3 rounded-xl bg-zinc-900 border border-zinc-800">
                    <span className="text-zinc-500 block text-[10px] font-mono uppercase">Crossover Cohort</span>
                    <span className="text-base font-bold text-zinc-200 font-mono">{currentPk.sampleSize} Patients</span>
                    <span className="text-[10px] text-zinc-400 block mt-0.5">Double-Blind Randomized</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-zinc-50 border-t border-zinc-200 flex items-center justify-between text-xs text-zinc-500">
          <span>Clinical Decision Support System (CDSS) • Regulatory Trial Clearance Confirmed</span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-zinc-900 text-white font-medium hover:bg-zinc-800 transition-colors"
          >
            Close Intelligence
          </button>
        </div>
      </div>
    </div>
  );
};
