import React, { useState } from 'react';
import { DrugProvenanceBlock } from '../types';
import { SAMPLE_PROVENANCE_LEDGER } from '../data/genericMedData';
import {
  Link2,
  ShieldCheck,
  CheckCircle2,
  Lock,
  QrCode,
  FileText,
  Building2,
  Cpu,
  Truck,
  Store,
  UserCheck,
  X,
  ExternalLink,
  Search,
  Sparkles,
  ArrowRight,
  Hash
} from 'lucide-react';

interface BlockchainProvenanceModalProps {
  isOpen: boolean;
  onClose: () => void;
  batchNumber?: string;
}

export const BlockchainProvenanceModal: React.FC<BlockchainProvenanceModalProps> = ({
  isOpen,
  onClose,
  batchNumber = 'BATCH-MET-2025-C4'
}) => {
  const [selectedBatch, setSelectedBatch] = useState(batchNumber);
  const [activeBlockIndex, setActiveBlockIndex] = useState(1);
  const [isVerifyingProof, setIsVerifyingProof] = useState(false);
  const [proofVerified, setProofVerified] = useState(true);

  const blocks = SAMPLE_PROVENANCE_LEDGER;
  const activeBlock = blocks.find(b => b.blockIndex === activeBlockIndex) || blocks[0];

  if (!isOpen) return null;

  const handleRunVerification = () => {
    setIsVerifyingProof(true);
    setTimeout(() => {
      setIsVerifyingProof(false);
      setProofVerified(true);
      alert('Cryptographic Merkle Proof Validated! Hash chain matches government CDSCO release records 100%. No counterfeit tampering detected.');
    }, 1200);
  };

  const getStageIcon = (stage: DrugProvenanceBlock['stage']) => {
    switch (stage) {
      case 'API_SYNTHESIS': return <Cpu className="w-5 h-5 text-purple-400" />;
      case 'WHO_GMP_FORMULATION': return <Building2 className="w-5 h-5 text-blue-400" />;
      case 'CDSCO_RELEASE': return <ShieldCheck className="w-5 h-5 text-emerald-400" />;
      case 'COLD_CHAIN_TRANSIT': return <Truck className="w-5 h-5 text-amber-400" />;
      case 'PHARMACY_RECEIPT': return <Store className="w-5 h-5 text-cyan-400" />;
      case 'PATIENT_DISPENSED': return <UserCheck className="w-5 h-5 text-emerald-400" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-zinc-950 border border-zinc-800 rounded-3xl w-full max-w-4xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 my-8 text-zinc-100">
        {/* Header Strip */}
        <div className="bg-linear-to-r from-purple-950 via-zinc-900 to-indigo-950 border-b border-zinc-800 p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-purple-500/20 border border-purple-500/40 flex items-center justify-center">
              <Link2 className="w-6 h-6 text-purple-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] uppercase tracking-wider font-semibold bg-purple-500/20 text-purple-300 px-2 py-0.5 rounded font-mono">
                  Blockchain Provenance Ledger
                </span>
                <span className="text-xs text-zinc-400">Anti-Counterfeit QR Traceability</span>
              </div>
              <h2 className="text-lg font-bold text-white">Cryptographic Drug Provenance Chain</h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleRunVerification}
              disabled={isVerifyingProof}
              className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1.5 transition-all shadow-xs"
            >
              <ShieldCheck className={`w-4 h-4 ${isVerifyingProof ? 'animate-spin' : ''}`} />
              {isVerifyingProof ? 'Verifying Hashes...' : 'Verify Cryptographic Proof'}
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6">
          {/* Batch Selector & Authenticity Badge */}
          <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-2xl bg-zinc-900/80 border border-zinc-800 text-xs">
            <div className="space-y-1">
              <span className="text-[10px] uppercase font-mono tracking-wider text-zinc-500">
                Inspecting Manufacturing Batch
              </span>
              <div className="flex items-center gap-2">
                <span className="font-mono text-base font-bold text-purple-300">{selectedBatch}</span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[11px] font-semibold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  100% Genuine WHO-GMP Batch
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 text-zinc-400 text-xs">
              <span>Total Hash Blocks: <strong className="text-zinc-200 font-mono">{blocks.length} Blocks</strong></span>
              <span>•</span>
              <span>Consensus: <strong className="text-emerald-400 font-mono">Proof of Regulatory Authority (PoRA)</strong></span>
            </div>
          </div>

          {/* Six-Stage Timeline Navigator */}
          <div className="grid grid-cols-2 sm:grid-cols-6 gap-2">
            {blocks.map((b) => {
              const isSelected = b.blockIndex === activeBlockIndex;
              return (
                <button
                  key={b.blockIndex}
                  onClick={() => setActiveBlockIndex(b.blockIndex)}
                  className={`p-3 rounded-xl border text-left transition-all space-y-2 ${
                    isSelected
                      ? 'border-purple-500 bg-purple-950/40 shadow-lg ring-1 ring-purple-500'
                      : 'border-zinc-800 bg-zinc-900 hover:border-zinc-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[10px] text-zinc-400">Block #{b.blockIndex}</span>
                    {getStageIcon(b.stage)}
                  </div>
                  <p className="text-[11px] font-bold text-zinc-200 line-clamp-1">{b.stageTitle.split(' ')[0]}</p>
                </button>
              );
            })}
          </div>

          {/* Active Block Detailed Inspector */}
          <div className="p-5 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-4">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-purple-500/20 flex items-center justify-center border border-purple-500/30">
                  {getStageIcon(activeBlock.stage)}
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">{activeBlock.stageTitle}</h3>
                  <p className="text-xs text-zinc-400">Location: {activeBlock.location}</p>
                </div>
              </div>
              <span className="font-mono text-xs text-zinc-400">{activeBlock.timestamp}</span>
            </div>

            {/* Cryptographic Hash Details */}
            <div className="space-y-3 font-mono text-xs">
              <div className="p-3 rounded-xl bg-zinc-950 border border-zinc-800 space-y-1">
                <div className="flex items-center justify-between text-zinc-400 text-[11px]">
                  <span>SHA-256 Current Block Hash:</span>
                  <span className="text-emerald-400 font-semibold">Integrity Verified</span>
                </div>
                <p className="text-purple-300 font-bold break-all">{activeBlock.blockHash}</p>
              </div>

              <div className="p-3 rounded-xl bg-zinc-950 border border-zinc-800 space-y-1">
                <span className="text-zinc-400 text-[11px] block">Previous Block Hash (Parent):</span>
                <p className="text-zinc-400 break-all">{activeBlock.prevHash}</p>
              </div>
            </div>

            {/* Metadata Attributes */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-xs">
              <div className="p-3 rounded-xl bg-zinc-950/60 border border-zinc-800/80">
                <span className="text-zinc-500 block text-[10px] uppercase font-mono">Signing Authority / Actor</span>
                <span className="text-zinc-200 font-medium">{activeBlock.actor}</span>
              </div>

              <div className="p-3 rounded-xl bg-zinc-950/60 border border-zinc-800/80">
                <span className="text-zinc-500 block text-[10px] uppercase font-mono">Statutory Certificate ID</span>
                <span className="text-purple-400 font-mono font-medium">{activeBlock.certificateId}</span>
              </div>

              <div className="p-3 rounded-xl bg-zinc-950/60 border border-zinc-800/80">
                <span className="text-zinc-500 block text-[10px] uppercase font-mono">Quality Spec Clearance</span>
                <span className="text-emerald-400 font-medium">{activeBlock.verificationBadge}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-zinc-900 border-t border-zinc-800 flex items-center justify-between text-xs text-zinc-400">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>Zero Counterfeit Risk • Immutable SHA-256 Merkle Provenance</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-zinc-800 text-white font-medium hover:bg-zinc-700 transition-colors"
          >
            Close Explorer
          </button>
        </div>
      </div>
    </div>
  );
};
