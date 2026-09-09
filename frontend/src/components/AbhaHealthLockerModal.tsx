import React, { useState } from 'react';
import { AbhaProfile, AbdmConsentArtifact } from '../types';
import {
  ShieldCheck,
  QrCode,
  Lock,
  FileText,
  Building2,
  Calendar,
  CheckCircle2,
  XCircle,
  Clock,
  ExternalLink,
  X,
  Copy,
  Check,
  Eye,
  Download,
  AlertCircle,
  Share2,
  RefreshCw,
  Sparkles
} from 'lucide-react';

interface AbhaHealthLockerModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: AbhaProfile;
  onUpdateConsent: (consentId: string, status: AbdmConsentArtifact['status']) => void;
}

export const AbhaHealthLockerModal: React.FC<AbhaHealthLockerModalProps> = ({
  isOpen,
  onClose,
  profile,
  onUpdateConsent
}) => {
  const [activeTab, setActiveTab] = useState<'card' | 'consents' | 'records'>('card');
  const [copiedNumber, setCopiedNumber] = useState(false);
  const [viewingFhirRecordId, setViewingFhirRecordId] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleCopyAbha = () => {
    navigator.clipboard?.writeText(profile.abhaNumber);
    setCopiedNumber(true);
    setTimeout(() => setCopiedNumber(false), 2000);
  };

  const sampleHealthRecords = [
    {
      id: 'REC-FHIR-01',
      type: 'Electronic Prescription (eRx)',
      title: '90-Day Metformin ER Maintenance Refill',
      facility: 'Apollo Telemedicine Clinic',
      doctor: 'Dr. Ananya Sharma, MD (Reg #MCI-2018-84920)',
      date: '2026-09-08',
      format: 'FHIR R4 MedicationRequest',
      status: 'Signed & Validated'
    },
    {
      id: 'REC-FHIR-02',
      type: 'Diagnostic Laboratory Report',
      title: 'HbA1c & Fasting Plasma Glucose Panel',
      facility: 'Dr. Lal PathLabs Central / ABDM HIP #9921',
      doctor: 'Dr. K. S. Raman, Pathologist',
      date: '2026-08-14',
      format: 'FHIR R4 Observation',
      status: 'Normal Control (HbA1c 6.4%)'
    },
    {
      id: 'REC-FHIR-03',
      type: 'Pharmacy Dispense Receipt',
      title: 'Schedule H Verified Dispensing (Paracetamol IP 500mg)',
      facility: 'MedPlus Pharmacy Hub Koramangala',
      doctor: 'Supervising Pharmacist Ramesh Krishnan',
      date: '2026-07-22',
      format: 'FHIR R4 MedicationDispense',
      status: 'Dispensed & Verified'
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white border border-zinc-200 rounded-2xl w-full max-w-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 my-8">
        {/* Header Strip */}
        <div className="bg-linear-to-r from-orange-600 via-amber-600 to-emerald-700 text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-white/15 backdrop-blur-md flex items-center justify-center border border-white/20">
              <ShieldCheck className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] uppercase tracking-wider font-semibold bg-white/20 px-2 py-0.5 rounded text-white font-mono">
                  ABDM National Health Stack
                </span>
                <span className="text-xs text-orange-100">Milestones M1 • M2 • M3</span>
              </div>
              <h2 className="text-lg font-bold">Ayushman Bharat Health Account (ABHA) Locker</h2>
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
            onClick={() => setActiveTab('card')}
            className={`pb-3 border-b-2 transition-all flex items-center gap-2 ${
              activeTab === 'card'
                ? 'border-orange-600 text-orange-600'
                : 'border-transparent text-zinc-500 hover:text-zinc-800'
            }`}
          >
            <QrCode className="w-4 h-4" />
            ABHA Digital Card (M1)
          </button>
          <button
            onClick={() => setActiveTab('consents')}
            className={`pb-3 border-b-2 transition-all flex items-center gap-2 ${
              activeTab === 'consents'
                ? 'border-orange-600 text-orange-600'
                : 'border-transparent text-zinc-500 hover:text-zinc-800'
            }`}
          >
            <Share2 className="w-4 h-4" />
            ABDM Consent Manager (M2)
            <span className="px-1.5 py-0.2 rounded-full bg-orange-100 text-orange-800 text-[10px]">
              {profile.consentArtifacts.filter(c => c.status === 'REQUESTED').length || profile.consentArtifacts.length}
            </span>
          </button>
          <button
            onClick={() => setActiveTab('records')}
            className={`pb-3 border-b-2 transition-all flex items-center gap-2 ${
              activeTab === 'records'
                ? 'border-orange-600 text-orange-600'
                : 'border-transparent text-zinc-500 hover:text-zinc-800'
            }`}
          >
            <Lock className="w-4 h-4" />
            Tokenized Health Vault (M3)
            <span className="px-1.5 py-0.2 rounded-full bg-emerald-100 text-emerald-800 text-[10px]">
              {sampleHealthRecords.length}
            </span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6">
          {/* TAB 1: ABHA SMART CARD */}
          {activeTab === 'card' && (
            <div className="space-y-6">
              {/* The Physical ABHA Card Mockup */}
              <div className="relative rounded-2xl bg-linear-to-br from-zinc-900 via-zinc-800 to-zinc-950 text-white p-6 shadow-xl border border-zinc-700/50 overflow-hidden">
                {/* Holographic Watermark effect */}
                <div className="absolute -right-12 -bottom-12 w-64 h-64 rounded-full bg-orange-500/10 blur-2xl pointer-events-none"></div>
                <div className="absolute top-0 right-0 p-4 opacity-15">
                  <ShieldCheck className="w-36 h-36 text-white" />
                </div>

                <div className="flex items-start justify-between relative z-10">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-orange-500/20 border border-orange-400/40 flex items-center justify-center">
                      <span className="font-bold text-orange-400 text-sm">AB</span>
                    </div>
                    <div>
                      <p className="text-[10px] uppercase font-mono tracking-widest text-zinc-400">National Health Authority</p>
                      <p className="text-xs font-semibold text-white">Ayushman Bharat Digital Mission</p>
                    </div>
                  </div>
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[11px] font-medium">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    Aadhaar Verified KYC
                  </div>
                </div>

                {/* Patient Information & Card Body */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-6 pt-4 border-t border-zinc-700/60 relative z-10 items-center">
                  <div className="sm:col-span-2 space-y-3">
                    <div>
                      <p className="text-[11px] text-zinc-400 uppercase font-mono">Full Legal Name</p>
                      <p className="text-lg font-bold text-white tracking-wide">{profile.fullName}</p>
                    </div>

                    <div className="grid grid-cols-2 gap-3 text-xs">
                      <div>
                        <p className="text-[10px] text-zinc-400 font-mono">Date of Birth / Gender</p>
                        <p className="text-zinc-200 font-medium">{profile.dateOfBirth} ({profile.gender})</p>
                      </div>
                      <div>
                        <p className="text-[10px] text-zinc-400 font-mono">Linked Mobile</p>
                        <p className="text-zinc-200 font-medium font-mono">{profile.phoneLinked}</p>
                      </div>
                    </div>

                    <div>
                      <p className="text-[10px] text-zinc-400 font-mono">14-Digit ABHA Number</p>
                      <div className="flex items-center gap-2">
                        <span className="text-base font-bold font-mono text-amber-300 tracking-wider">
                          {profile.abhaNumber}
                        </span>
                        <button
                          onClick={handleCopyAbha}
                          className="p-1 rounded bg-zinc-700 hover:bg-zinc-600 text-zinc-300 transition-colors"
                          title="Copy ABHA Number"
                        >
                          {copiedNumber ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                    </div>

                    <div>
                      <p className="text-[10px] text-zinc-400 font-mono">ABHA Address (PHR Handle)</p>
                      <p className="text-xs font-mono text-emerald-400 font-medium bg-emerald-950/40 inline-block px-2 py-0.5 rounded border border-emerald-800/50">
                        {profile.abhaAddress}
                      </p>
                    </div>
                  </div>

                  {/* QR Code Container */}
                  <div className="flex flex-col items-center justify-center p-3 rounded-xl bg-white text-zinc-900 shadow-md">
                    <QrCode className="w-24 h-24 text-zinc-900" />
                    <span className="text-[10px] font-mono text-zinc-500 mt-1">Scan for Fast-Track OPD</span>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-zinc-800 flex items-center justify-between text-[11px] text-zinc-400 relative z-10">
                  <div className="flex items-center gap-1.5">
                    <Building2 className="w-3.5 h-3.5 text-zinc-400" />
                    <span>Linked Facility: <strong className="text-zinc-300">{profile.linkedHospital}</strong></span>
                  </div>
                  <span className="font-mono text-[10px]">Token: {profile.qrCardToken}</span>
                </div>
              </div>

              {/* Status Info Strip */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-zinc-50 border border-zinc-200">
                  <span className="text-zinc-500 block text-[11px]">Consent Privileges</span>
                  <span className="font-semibold text-zinc-900">ABDM M2 Enabled</span>
                </div>
                <div className="p-3 rounded-xl bg-zinc-50 border border-zinc-200">
                  <span className="text-zinc-500 block text-[11px]">HIP Data Records</span>
                  <span className="font-semibold text-zinc-900">{profile.linkedHealthRecordsCount} Encrypted Documents</span>
                </div>
                <div className="p-3 rounded-xl bg-zinc-50 border border-zinc-200">
                  <span className="text-zinc-500 block text-[11px]">KYC Authorization</span>
                  <span className="font-semibold text-emerald-700 font-mono">UIDAI Aadhaar OTP (Verified)</span>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: ABDM CONSENT MANAGER (M2) */}
          {activeTab === 'consents' && (
            <div className="space-y-4">
              <div className="p-3 rounded-xl bg-blue-50/70 border border-blue-200 text-xs text-blue-900 flex items-start gap-2.5">
                <AlertCircle className="w-4 h-4 text-blue-700 shrink-0 mt-0.5" />
                <p>
                  <strong>NHA Consent Architecture:</strong> You have complete statutory control under the Digital Personal Data Protection (DPDP) Act. You may revoke or approve clinical data access at any time.
                </p>
              </div>

              <div className="space-y-3">
                {profile.consentArtifacts.map((consent) => {
                  const isGranted = consent.status === 'GRANTED';
                  const isRequested = consent.status === 'REQUESTED';
                  const isRevoked = consent.status === 'REVOKED';

                  return (
                    <div
                      key={consent.id}
                      className="p-4 rounded-xl border border-zinc-200 bg-white hover:border-zinc-300 transition-all space-y-3"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-xs font-semibold text-zinc-900">{consent.id}</span>
                            <span
                              className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                                isGranted
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : isRequested
                                  ? 'bg-amber-100 text-amber-800 animate-pulse'
                                  : isRevoked
                                  ? 'bg-red-100 text-red-800'
                                  : 'bg-zinc-100 text-zinc-600'
                              }`}
                            >
                              {consent.status}
                            </span>
                          </div>
                          <h4 className="text-sm font-semibold text-zinc-900">{consent.hiuName}</h4>
                          <p className="text-xs text-zinc-600">{consent.purpose}</p>
                        </div>

                        {/* Action buttons */}
                        <div className="flex items-center gap-2 shrink-0">
                          {isRequested && (
                            <button
                              onClick={() => onUpdateConsent(consent.id, 'GRANTED')}
                              className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold flex items-center gap-1.5 transition-all shadow-xs"
                            >
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              Grant Access
                            </button>
                          )}
                          {isGranted && (
                            <button
                              onClick={() => onUpdateConsent(consent.id, 'REVOKED')}
                              className="px-3 py-1.5 rounded-lg border border-red-200 bg-red-50 hover:bg-red-100 text-red-700 text-xs font-medium flex items-center gap-1.5 transition-all"
                            >
                              <XCircle className="w-3.5 h-3.5" />
                              Revoke
                            </button>
                          )}
                        </div>
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs pt-2 border-t border-zinc-100 text-zinc-500">
                        <div>
                          <span className="text-[10px] block text-zinc-400">Validity Period</span>
                          <span>{consent.fromDate} to {consent.toDate}</span>
                        </div>
                        <div>
                          <span className="text-[10px] block text-zinc-400">Data Types Permitted</span>
                          <span className="text-zinc-700 font-medium">{consent.dataTypes.join(', ')}</span>
                        </div>
                        <div>
                          <span className="text-[10px] block text-zinc-400">Requested Timestamp</span>
                          <span className="font-mono text-[11px]">{consent.createdAt}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 3: TOKENIZED HEALTH VAULT (M3) */}
          {activeTab === 'records' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-zinc-900">Encrypted Clinical Records</h3>
                  <p className="text-xs text-zinc-500">Linked to ABHA {profile.abhaNumber} across national hospitals & pharmacies.</p>
                </div>
                <button
                  onClick={() => alert('Downloaded full consolidated ABDM FHIR bundle (JSON) with SHA-256 integrity hash.')}
                  className="px-3 py-1.5 rounded-lg border border-zinc-200 hover:bg-zinc-50 text-zinc-700 text-xs font-medium flex items-center gap-1.5 transition-colors"
                >
                  <Download className="w-3.5 h-3.5" />
                  Export FHIR Bundle
                </button>
              </div>

              <div className="space-y-3">
                {sampleHealthRecords.map((rec) => (
                  <div
                    key={rec.id}
                    className="p-4 rounded-xl border border-zinc-200 bg-white hover:border-zinc-300 transition-all space-y-2.5"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-mono font-semibold bg-zinc-100 text-zinc-700 px-2 py-0.5 rounded">
                            {rec.id}
                          </span>
                          <span className="text-[11px] font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                            {rec.status}
                          </span>
                        </div>
                        <h4 className="text-sm font-semibold text-zinc-900">{rec.title}</h4>
                        <p className="text-xs text-zinc-500">{rec.facility} • {rec.doctor}</p>
                      </div>

                      <button
                        onClick={() => setViewingFhirRecordId(viewingFhirRecordId === rec.id ? null : rec.id)}
                        className="px-2.5 py-1.5 rounded-lg border border-zinc-200 hover:bg-zinc-50 text-xs text-zinc-700 font-medium flex items-center gap-1.5"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        {viewingFhirRecordId === rec.id ? 'Hide JSON' : 'Inspect FHIR'}
                      </button>
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-zinc-400 pt-2 border-t border-zinc-100">
                      <span>Standard: <strong className="text-zinc-600 font-mono">{rec.format}</strong></span>
                      <span>Recorded: {rec.date}</span>
                    </div>

                    {/* FHIR Inspection drawer */}
                    {viewingFhirRecordId === rec.id && (
                      <div className="mt-2 p-3 rounded-lg bg-zinc-900 text-zinc-100 font-mono text-[11px] overflow-x-auto space-y-1">
                        <p className="text-emerald-400 font-bold">// HL7 FHIR R4 Resource Verified</p>
                        <p className="text-zinc-400">{`{\n  "resourceType": "${rec.format.split(' ')[1]}",\n  "id": "${rec.id}",\n  "status": "active",\n  "subject": { "reference": "Patient/${profile.abhaAddress}" },\n  "performer": { "display": "${rec.doctor}" },\n  "authoredOn": "${rec.date}"\n}`}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-zinc-50 border-t border-zinc-200 flex items-center justify-between text-xs text-zinc-500">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span>ABDM Gateway: Live Connection Active</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-zinc-900 text-white font-medium hover:bg-zinc-800 transition-colors"
          >
            Close Locker
          </button>
        </div>
      </div>
    </div>
  );
};
