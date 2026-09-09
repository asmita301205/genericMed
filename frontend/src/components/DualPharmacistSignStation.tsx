import React, { useState } from 'react';
import { OrderRecord, DualPharmacistDispenseRecord, PvPiAdverseReactionReport } from '../types';
import {
  ShieldCheck,
  CheckCircle2,
  FileCheck,
  AlertTriangle,
  QrCode,
  Lock,
  Printer,
  FileText,
  UserCheck,
  Calendar,
  Sparkles,
  Send,
  X,
  Clock,
  ExternalLink
} from 'lucide-react';

interface DualPharmacistSignStationProps {
  orders: OrderRecord[];
  dualPharmacistRecords: DualPharmacistDispenseRecord[];
  onCompleteDispense: (record: DualPharmacistDispenseRecord) => void;
  onFilePvpiReport: (report: Omit<PvPiAdverseReactionReport, 'id' | 'filedAt' | 'ipcSubmissionStatus'>) => void;
}

export const DualPharmacistSignStation: React.FC<DualPharmacistSignStationProps> = ({
  orders,
  dualPharmacistRecords,
  onCompleteDispense,
  onFilePvpiReport
}) => {
  const [selectedOrderId, setSelectedOrderId] = useState<string>(orders[0]?.id || 'ORD-2026-9044');
  const [isPvpiModalOpen, setIsPvpiModalOpen] = useState(false);

  // Step 1: QC Pharmacist state
  const [qcPharmacistName, setQcPharmacistName] = useState('Ramesh Krishnan, B.Pharm');
  const [qcLicenseReg, setQcLicenseReg] = useState('KA-PHARM-2016-19402');
  const [passedQC, setPassedQC] = useState(true);
  const [coldChainVerified, setColdChainVerified] = useState(true);
  const [qcDone, setQcDone] = useState(false);

  // Step 2: Dispense Pharmacist state
  const [dispensePharmacistName, setDispensePharmacistName] = useState('Dr. Sunita Kulkarni, Pharm.D');
  const [dispenseLicenseReg, setDispenseLicenseReg] = useState('KA-PHARM-2012-08129');
  const [tamperSealNumber, setTamperSealNumber] = useState(`SEAL-SEC65-${Math.floor(1000 + Math.random() * 9000)}`);
  const [isSigned, setIsSigned] = useState(false);

  // PvPI Report state
  const [pvpiMedicine, setPvpiMedicine] = useState('Paracetamol IP 500mg');
  const [pvpiBatch, setPvpiBatch] = useState('BATCH-PAR-2025-A1');
  const [pvpiSeverity, setPvpiSeverity] = useState<PvPiAdverseReactionReport['severity']>('Mild');
  const [pvpiSymptoms, setPvpiSymptoms] = useState('');
  const [pvpiReporterName, setPvpiReporterName] = useState('Supervising Pharmacist');

  const selectedOrder = orders.find(o => o.id === selectedOrderId) || orders[0];
  const existingRecord = dualPharmacistRecords.find(r => r.orderId === selectedOrderId);

  const handleSignAndAuthorize = () => {
    const newRecord: DualPharmacistDispenseRecord = {
      id: `DISP-SEC65-${Date.now().toString().slice(-4)}`,
      orderId: selectedOrderId,
      qcPharmacist: {
        name: qcPharmacistName,
        licenseReg: qcLicenseReg,
        council: 'State Pharmacy Council',
        checkedAt: 'Just now',
        passedQC,
        coldChainVerified
      },
      dispensePharmacist: {
        name: dispensePharmacistName,
        licenseReg: dispenseLicenseReg,
        council: 'State Pharmacy Council',
        signedAt: 'Just now',
        signatureHash: `SHA256:${Math.random().toString(36).substring(2)}${Math.random().toString(36).substring(2)}`
      },
      gs1DataMatrixBarcode: `01089010830019281726090810${tamperSealNumber}2177489201`,
      tamperSealNumber
    };

    onCompleteDispense(newRecord);
    setIsSigned(true);
  };

  const handlePvpiSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pvpiSymptoms.trim()) return;

    onFilePvpiReport({
      orderId: selectedOrderId,
      medicineName: pvpiMedicine,
      genericSalt: 'Active Clinical Salt',
      batchNumber: pvpiBatch,
      severity: pvpiSeverity,
      suspectedReaction: pvpiSymptoms,
      reporterRole: 'Pharmacist',
      reporterName: pvpiReporterName
    });

    setIsPvpiModalOpen(false);
    setPvpiSymptoms('');
    alert('Adverse Drug Reaction filed directly to Pharmacovigilance Programme of India (PvPI) / IPC.');
  };

  return (
    <div className="space-y-6">
      {/* Station Banner */}
      <div className="p-5 rounded-2xl bg-linear-to-r from-blue-900 to-indigo-950 text-white border border-blue-800 shadow-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center border border-white/20">
            <UserCheck className="w-6 h-6 text-blue-300" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-mono uppercase bg-blue-500/30 text-blue-200 px-2 py-0.5 rounded font-semibold">
                Section 65 Drugs & Cosmetics Act
              </span>
              <span className="text-xs text-blue-300 font-medium">Dual-Pharmacist Sign-Off Station</span>
            </div>
            <h3 className="text-base font-bold text-white">Statutory Prescription Dispensing Verification</h3>
          </div>
        </div>

        <button
          onClick={() => setIsPvpiModalOpen(true)}
          className="px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-zinc-950 text-xs font-bold flex items-center gap-2 transition-all shadow-xs"
        >
          <AlertTriangle className="w-4 h-4" />
          Report ADR to PvPI (IPC)
        </button>
      </div>

      {/* Main Grid: Order Selector & 2-Step Sign Off */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Orders Pending Dispense */}
        <div className="lg:col-span-4 bg-white border border-zinc-200 rounded-2xl p-4 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-zinc-400 font-mono">
              Prescription Orders ({orders.length})
            </span>
            <span className="text-[11px] text-zinc-500">Select to Verify</span>
          </div>

          <div className="space-y-2 max-h-[500px] overflow-y-auto pr-1">
            {orders.map((o) => {
              const isSelected = o.id === selectedOrderId;
              const hasDispense = dualPharmacistRecords.some(r => r.orderId === o.id);

              return (
                <button
                  key={o.id}
                  onClick={() => {
                    setSelectedOrderId(o.id);
                    setQcDone(false);
                    setIsSigned(false);
                  }}
                  className={`w-full text-left p-3.5 rounded-xl border text-xs transition-all space-y-2 ${
                    isSelected
                      ? 'border-blue-600 bg-blue-50/50 shadow-xs ring-1 ring-blue-500'
                      : 'border-zinc-200 bg-white hover:border-zinc-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold text-zinc-900">{o.id}</span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        hasDispense
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {hasDispense ? 'Signed & Dispensed' : 'Needs Sec. 65 Sign'}
                    </span>
                  </div>

                  <p className="text-zinc-700 font-medium truncate">{o.customerName}</p>
                  <div className="flex items-center justify-between text-[11px] text-zinc-500">
                    <span>{o.items.length} Medicines</span>
                    <span className="font-semibold text-zinc-900">₹{o.totalAmount.toFixed(2)}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right: The 2-Step Sign Off Protocol */}
        <div className="lg:col-span-8 space-y-6">
          {/* Order Snapshot */}
          <div className="p-4 rounded-2xl bg-zinc-50 border border-zinc-200 flex flex-wrap items-center justify-between gap-3 text-xs">
            <div>
              <span className="text-[10px] font-mono text-zinc-400 block uppercase">Selected Case</span>
              <span className="font-bold text-zinc-900 text-sm">{selectedOrder.id} • {selectedOrder.customerName}</span>
            </div>
            <div>
              <span className="text-[10px] font-mono text-zinc-400 block uppercase">Destination</span>
              <span className="text-zinc-700">{selectedOrder.deliveryAddress}</span>
            </div>
            <div>
              <span className="text-[10px] font-mono text-zinc-400 block uppercase">Security Handover PIN</span>
              <span className="font-mono font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                {selectedOrder.deliveryPin}
              </span>
            </div>
          </div>

          {/* STEP 1: Registered Pharmacist 1 (QC Inspection) */}
          <div className="p-5 rounded-2xl border border-zinc-200 bg-white space-y-4 shadow-xs">
            <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
              <div className="flex items-center gap-2.5">
                <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-800 text-xs font-bold flex items-center justify-center font-mono">
                  1
                </span>
                <div>
                  <h4 className="text-sm font-bold text-zinc-900">Pharmacist 1: Quality Control & Physical Check</h4>
                  <p className="text-xs text-zinc-500">Inspect packaging, batch expiry (&gt;180 days), and temperature telemetry.</p>
                </div>
              </div>
              {qcDone && (
                <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  QC Inspection Passed
                </span>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="text-[11px] font-medium text-zinc-700 block mb-1">QC Pharmacist Name</label>
                <input
                  type="text"
                  value={qcPharmacistName}
                  onChange={(e) => setQcPharmacistName(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-zinc-200 text-xs bg-zinc-50 focus:bg-white"
                />
              </div>
              <div>
                <label className="text-[11px] font-medium text-zinc-700 block mb-1">State Council Reg Number</label>
                <input
                  type="text"
                  value={qcLicenseReg}
                  onChange={(e) => setQcLicenseReg(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-zinc-200 text-xs font-mono bg-zinc-50 focus:bg-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <label className="flex items-center gap-2.5 p-3 rounded-xl border border-zinc-200 bg-zinc-50/50 cursor-pointer text-xs">
                <input
                  type="checkbox"
                  checked={passedQC}
                  onChange={(e) => setPassedQC(e.target.checked)}
                  className="rounded text-blue-600 focus:ring-blue-500"
                />
                <span>Blister strip intact, no tears, Expiry &gt;180 days</span>
              </label>

              <label className="flex items-center gap-2.5 p-3 rounded-xl border border-zinc-200 bg-zinc-50/50 cursor-pointer text-xs">
                <input
                  type="checkbox"
                  checked={coldChainVerified}
                  onChange={(e) => setColdChainVerified(e.target.checked)}
                  className="rounded text-blue-600 focus:ring-blue-500"
                />
                <span>Cold-chain data logger verified (Safe 2°C–8°C)</span>
              </label>
            </div>

            {!qcDone && (
              <button
                onClick={() => setQcDone(true)}
                className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all shadow-xs"
              >
                Confirm Step 1: Quality Check Approved
              </button>
            )}
          </div>

          {/* STEP 2: Registered Pharmacist 2 (Dispense Sign-Off & Barcode) */}
          <div className={`p-5 rounded-2xl border transition-all space-y-4 ${
            qcDone ? 'border-zinc-200 bg-white shadow-xs' : 'border-zinc-200 bg-zinc-50 opacity-60 pointer-events-none'
          }`}>
            <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
              <div className="flex items-center gap-2.5">
                <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold flex items-center justify-center font-mono">
                  2
                </span>
                <div>
                  <h4 className="text-sm font-bold text-zinc-900">Pharmacist 2: Dispense Sign-Off & GS1 DataMatrix</h4>
                  <p className="text-xs text-zinc-500">Enter supervising license registration and generate physical tamper seal.</p>
                </div>
              </div>
              {isSigned && (
                <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Authorized & Sealed
                </span>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div>
                <label className="text-[11px] font-medium text-zinc-700 block mb-1">Supervising Pharmacist</label>
                <input
                  type="text"
                  value={dispensePharmacistName}
                  onChange={(e) => setDispensePharmacistName(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-zinc-200 text-xs bg-zinc-50 focus:bg-white"
                />
              </div>
              <div>
                <label className="text-[11px] font-medium text-zinc-700 block mb-1">State License Reg Number</label>
                <input
                  type="text"
                  value={dispenseLicenseReg}
                  onChange={(e) => setDispenseLicenseReg(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-zinc-200 text-xs font-mono bg-zinc-50 focus:bg-white"
                />
              </div>
              <div>
                <label className="text-[11px] font-medium text-zinc-700 block mb-1">Tamper Seal Number</label>
                <input
                  type="text"
                  value={tamperSealNumber}
                  onChange={(e) => setTamperSealNumber(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-zinc-200 text-xs font-mono text-emerald-700 font-bold bg-zinc-50 focus:bg-white"
                />
              </div>
            </div>

            {/* Generated GS1 DataMatrix Barcode Mockup */}
            <div className="p-4 rounded-xl bg-zinc-900 text-white flex items-center justify-between gap-4">
              <div className="space-y-1">
                <span className="text-[10px] uppercase font-mono tracking-wider text-emerald-400 font-bold">
                  GS1 DataMatrix 2D Barcode (Ready to Print)
                </span>
                <p className="text-xs font-mono text-zinc-300">
                  GTIN: 08901083001928 • Lot: {selectedOrder.items[0]?.listing.id.toUpperCase() || 'BATCH-C4'} • Seal: {tamperSealNumber}
                </p>
                <p className="text-[11px] text-zinc-400">
                  Signed by {dispensePharmacistName} ({dispenseLicenseReg})
                </p>
              </div>

              <div className="p-2 rounded-lg bg-white text-zinc-950 shrink-0">
                <QrCode className="w-12 h-12" />
              </div>
            </div>

            {!isSigned && (
              <button
                onClick={handleSignAndAuthorize}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-sm"
              >
                <Lock className="w-4 h-4" />
                Sign with Digital HMAC & Authorize Dispense
              </button>
            )}
          </div>
        </div>
      </div>

      {/* PVPI MODAL */}
      {isPvpiModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-white border border-zinc-200 rounded-2xl w-full max-w-lg shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
              <div className="flex items-center gap-2 text-amber-700 font-bold text-sm">
                <AlertTriangle className="w-5 h-5" />
                <span>PvPI Adverse Drug Reaction Form (IPC)</span>
              </div>
              <button
                onClick={() => setIsPvpiModalOpen(false)}
                className="p-1 rounded-lg text-zinc-400 hover:text-zinc-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handlePvpiSubmit} className="space-y-3 text-xs">
              <div>
                <label className="font-medium text-zinc-700 block mb-1">Suspected Medicine Name</label>
                <input
                  type="text"
                  value={pvpiMedicine}
                  onChange={(e) => setPvpiMedicine(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-zinc-200"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-medium text-zinc-700 block mb-1">Manufacturing Batch #</label>
                  <input
                    type="text"
                    value={pvpiBatch}
                    onChange={(e) => setPvpiBatch(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-zinc-200 font-mono"
                    required
                  />
                </div>
                <div>
                  <label className="font-medium text-zinc-700 block mb-1">Reaction Severity</label>
                  <select
                    value={pvpiSeverity}
                    onChange={(e) => setPvpiSeverity(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-lg border border-zinc-200"
                  >
                    <option value="Mild">Mild</option>
                    <option value="Moderate">Moderate</option>
                    <option value="Severe">Severe</option>
                    <option value="Life_Threatening">Life Threatening</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-medium text-zinc-700 block mb-1">Clinical Adverse Symptoms</label>
                <textarea
                  rows={3}
                  value={pvpiSymptoms}
                  onChange={(e) => setPvpiSymptoms(e.target.value)}
                  placeholder="Describe patient symptoms, onset latency, and clinical outcome..."
                  className="w-full px-3 py-2 rounded-lg border border-zinc-200 resize-none"
                  required
                />
              </div>

              <div>
                <label className="font-medium text-zinc-700 block mb-1">Reporting Officer / Pharmacist</label>
                <input
                  type="text"
                  value={pvpiReporterName}
                  onChange={(e) => setPvpiReporterName(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-zinc-200"
                  required
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsPvpiModalOpen(false)}
                  className="px-3 py-1.5 rounded-lg border border-zinc-200 text-zinc-600 hover:bg-zinc-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-bold"
                >
                  Submit Yellow Form to IPC
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
