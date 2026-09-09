import React, { useState, useEffect } from 'react';
import {
  DoctorProfile,
  TeleConsultationSession,
  PrescriptionRecord,
  CanonicalProduct,
  ProductListing,
  SupportedCurrency
} from '../types';
import { DOCTOR_PROFILES, CANONICAL_PRODUCTS, PRODUCT_LISTINGS } from '../data/genericMedData';
import { formatCurrency } from '../utils/i18n';
import {
  Video,
  VideoOff,
  Mic,
  MicOff,
  PhoneOff,
  Stethoscope,
  FileCheck,
  ShieldCheck,
  Clock,
  Star,
  Activity,
  User,
  Heart,
  AlertCircle,
  CheckCircle2,
  ShoppingCart,
  Send,
  Sparkles,
  X,
  ExternalLink
} from 'lucide-react';

interface TeleConsultationModalProps {
  isOpen: boolean;
  onClose: () => void;
  currency?: SupportedCurrency;
  onIssuePrescription: (rx: PrescriptionRecord, prescribedProducts: { product: CanonicalProduct; listing: ProductListing }[]) => void;
  patientName?: string;
}

export const TeleConsultationModal: React.FC<TeleConsultationModalProps> = ({
  isOpen,
  onClose,
  currency = 'INR',
  onIssuePrescription,
  patientName = 'Aarav Sharma'
}) => {
  const [selectedDoctor, setSelectedDoctor] = useState<DoctorProfile>(DOCTOR_PROFILES[0]);
  const [consultationStep, setConsultationStep] = useState<'select' | 'in_call' | 'rx_ready'>('select');

  // Call simulation states
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [callDuration, setCallDuration] = useState(132); // start at 2m 12s for active immersion
  const [chatMessages, setChatMessages] = useState<Array<{ sender: 'doctor' | 'patient'; text: string; time: string }>>([
    { sender: 'doctor', text: `Hello ${patientName}! I see your Metformin chronic prescription is up for 90-day renewal. How have your fasting glucose numbers been?`, time: '10:12 AM' },
    { sender: 'patient', text: 'Good morning Doctor. Fasting has been around 110-116 mg/dL consistently with no hypoglycemic episodes.', time: '10:13 AM' },
    { sender: 'doctor', text: 'Excellent control. I am approving your 90-day maintenance generic refill and updating your digital Rx now.', time: '10:14 AM' }
  ]);
  const [newMsg, setNewMsg] = useState('');

  // Timer simulation
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isOpen && consultationStep === 'in_call') {
      timer = setInterval(() => {
        setCallDuration(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isOpen, consultationStep]);

  if (!isOpen) return null;

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMsg.trim()) return;
    setChatMessages(prev => [
      ...prev,
      { sender: 'patient', text: newMsg.trim(), time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }
    ]);
    setNewMsg('');

    // Simulated doctor automated reply
    setTimeout(() => {
      setChatMessages(prev => [
        ...prev,
        {
          sender: 'doctor',
          text: 'Noted in your clinical chart. The bio-equivalent generic saves ~75% and maintains exact therapeutic efficacy.',
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    }, 1500);
  };

  const handleEndCallAndGenerateRx = () => {
    setConsultationStep('rx_ready');
  };

  const handleCompleteAndAddToCart = () => {
    // Generate verified prescription
    const newRx: PrescriptionRecord = {
      id: `rx-tele-${Date.now().toString().slice(-6)}`,
      userId: 'usr-aarav-sharma',
      patientName: `${patientName} (Age: 42, Male)`,
      doctorName: selectedDoctor.name,
      doctorRegNumber: selectedDoctor.regNumber,
      issueDate: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      validUntil: new Date(Date.now() + 90 * 24 * 3600 * 1000).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      status: 'verified',
      confidenceScore: 100,
      validationNotes: [
        `In-App Tele-Consultation verified by ${selectedDoctor.name}`,
        `Doctor MCI/NMC Registration: ${selectedDoctor.regNumber}`,
        'Cryptographic digital signature verified against National Medical Registry',
        'ICD-10 Diagnosis: E11.9 Type-2 Diabetes Mellitus (Stable Control)'
      ],
      extractedEntities: {
        patientName: patientName,
        doctorName: selectedDoctor.name,
        doctorRegNumber: selectedDoctor.regNumber,
        prescriptionDate: new Date().toISOString().split('T')[0],
        isExpired: false,
        prescribedSalts: [
          {
            saltName: 'Metformin Hydrochloride ER',
            dosage: '500mg',
            frequency: 'Once daily after dinner',
            duration: '90 days',
            matchesGenericSalt: true
          },
          {
            saltName: 'Atorvastatin Calcium',
            dosage: '10mg',
            frequency: 'Once daily at bedtime',
            duration: '90 days',
            matchesGenericSalt: true
          }
        ]
      }
    };

    // Medicines to auto-add
    const prescribedItems = [
      { product: CANONICAL_PRODUCTS[1], listing: PRODUCT_LISTINGS[3] }, // Metformin
      { product: CANONICAL_PRODUCTS[3], listing: PRODUCT_LISTINGS[6] }  // Atorvastatin
    ];

    onIssuePrescription(newRx, prescribedItems);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl overflow-hidden flex flex-col max-h-[92vh] border border-zinc-200">
        
        {/* Modal Top Bar */}
        <div className="bg-zinc-900 text-white px-6 py-4 flex items-center justify-between border-b border-zinc-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600/30 border border-indigo-500/40 flex items-center justify-center text-indigo-400">
              <Stethoscope className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-base">In-App Tele-Medicine & Digital Rx Renewal</h3>
                <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                  Live Phase 3
                </span>
              </div>
              <p className="text-xs text-zinc-400 mt-0.5">
                Consult licensed physicians under Indian Telemedicine Practice Guidelines & Drugs Act Section 65.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {consultationStep === 'in_call' && (
              <div className="flex items-center gap-2 bg-rose-950/60 border border-rose-800/80 text-rose-300 px-3 py-1 rounded-full text-xs font-mono font-bold animate-pulse">
                <span className="w-2 h-2 rounded-full bg-rose-500"></span>
                REC {formatTimer(callDuration)}
              </div>
            )}
            <button
              onClick={onClose}
              className="text-zinc-400 hover:text-white p-1.5 rounded-lg hover:bg-zinc-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6">
          {consultationStep === 'select' && (
            <div className="space-y-6">
              <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-4 flex items-start gap-3">
                <Sparkles className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
                <div className="text-xs text-indigo-950 space-y-1">
                  <span className="font-bold text-sm block">Instant Prescription Renewal & Bio-Equivalent Counseling</span>
                  <p className="text-indigo-800 leading-relaxed">
                    Have an expired prescription or need a dosage review? Our certified physicians evaluate your vitals, generate a legally binding digital prescription with MCI registration, and automatically populate your genericMed cart with verified low-cost generics.
                  </p>
                </div>
              </div>

              {/* Doctor Directory */}
              <div>
                <h4 className="text-sm font-bold text-zinc-900 mb-3 flex items-center justify-between">
                  <span>Choose an Available Specialist</span>
                  <span className="text-xs font-normal text-zinc-500">Verified Credentials & MCI Registry Validated</span>
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {DOCTOR_PROFILES.map(doctor => (
                    <div
                      key={doctor.id}
                      onClick={() => setSelectedDoctor(doctor)}
                      className={`cursor-pointer rounded-xl border p-4 transition-all flex flex-col justify-between ${
                        selectedDoctor.id === doctor.id
                          ? 'border-indigo-600 bg-indigo-50/50 shadow-md ring-2 ring-indigo-500/20'
                          : 'border-zinc-200 bg-white hover:border-zinc-300 hover:shadow-xs'
                      }`}
                    >
                      <div>
                        <div className="flex items-start gap-3">
                          <img
                            src={doctor.avatarUrl}
                            alt={doctor.name}
                            className="w-14 h-14 rounded-full object-cover border-2 border-indigo-200 shrink-0"
                          />
                          <div>
                            <div className="flex items-center gap-1">
                              <h5 className="font-bold text-sm text-zinc-900">{doctor.name}</h5>
                              <ShieldCheck className="w-3.5 h-3.5 text-indigo-600" />
                            </div>
                            <span className="text-[11px] font-medium text-zinc-600 block">{doctor.title}</span>
                            <span className="text-[10px] text-zinc-500 font-mono block mt-0.5">{doctor.regNumber}</span>
                          </div>
                        </div>

                        <div className="mt-3 pt-3 border-t border-zinc-200/60 space-y-1 text-xs">
                          <div className="flex items-center justify-between text-zinc-600">
                            <span>Specialty:</span>
                            <span className="font-medium text-zinc-900">{doctor.specialty}</span>
                          </div>
                          <div className="flex items-center justify-between text-zinc-600">
                            <span>Experience:</span>
                            <span className="font-medium text-zinc-900">{doctor.experienceYears} Years</span>
                          </div>
                          <div className="flex items-center justify-between text-zinc-600">
                            <span>Rating:</span>
                            <span className="font-medium text-amber-600 flex items-center gap-0.5">
                              <Star className="w-3 h-3 fill-amber-400 text-amber-500" />
                              {doctor.rating} ({doctor.reviewCount})
                            </span>
                          </div>
                          <div className="flex items-center justify-between text-zinc-600">
                            <span>Consult Fee:</span>
                            <span className="font-bold text-emerald-700">{formatCurrency(doctor.consultationFee, currency)}</span>
                          </div>
                        </div>
                      </div>

                      <div className="mt-4 pt-2">
                        <span className="inline-block w-full text-center py-1.5 px-3 rounded-lg text-xs font-semibold bg-emerald-100 text-emerald-800">
                          {doctor.availableSlot}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Banner */}
              <div className="bg-zinc-50 border border-zinc-200 rounded-xl p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold">
                    Rx
                  </div>
                  <div>
                    <h5 className="font-bold text-xs text-zinc-900">Patient: {patientName} (Age 42)</h5>
                    <p className="text-[11px] text-zinc-600">
                      Chronic Medication: Metformin ER 500mg, Atorvastatin 10mg • No known penicillin allergies
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setConsultationStep('in_call')}
                  className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl flex items-center gap-2 shadow-md transition-all hover:shadow-indigo-500/20 cursor-pointer"
                >
                  <Video className="w-4 h-4" />
                  Connect to {selectedDoctor.name} Now
                </button>
              </div>
            </div>
          )}

          {consultationStep === 'in_call' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Video Room Canvas */}
              <div className="lg:col-span-2 space-y-4">
                <div className="relative aspect-video bg-zinc-950 rounded-2xl overflow-hidden shadow-xl border border-zinc-800 flex flex-col justify-between p-4">
                  {/* Doctor Video Stream */}
                  {isVideoEnabled ? (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <img
                        src={selectedDoctor.avatarUrl}
                        alt={selectedDoctor.name}
                        className="w-full h-full object-cover opacity-90 filter brightness-95"
                      />
                      {/* Audio visualizer wave */}
                      <div className="absolute bottom-6 left-6 bg-zinc-900/80 backdrop-blur-md px-3 py-1.5 rounded-lg border border-zinc-700 flex items-center gap-2 text-white text-xs">
                        <div className="flex items-end gap-0.5 h-3">
                          <span className="w-1 bg-emerald-400 animate-pulse h-2"></span>
                          <span className="w-1 bg-emerald-400 animate-pulse h-3"></span>
                          <span className="w-1 bg-emerald-400 animate-pulse h-1.5"></span>
                          <span className="w-1 bg-emerald-400 animate-pulse h-2.5"></span>
                        </div>
                        <span className="font-medium text-[11px]">{selectedDoctor.name} (Speaking)</span>
                      </div>
                    </div>
                  ) : (
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-zinc-500">
                      <VideoOff className="w-12 h-12 mb-2" />
                      <span className="text-xs">Camera Feed Paused</span>
                    </div>
                  )}

                  {/* Top Overlay Badge */}
                  <div className="relative z-10 flex items-center justify-between">
                    <div className="bg-zinc-900/80 backdrop-blur-md text-white text-xs px-3 py-1 rounded-full border border-zinc-700 flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                      <span>Encrypted HD Audio & Video (WebRTC)</span>
                    </div>

                    <span className="bg-indigo-600/90 text-white text-[10px] font-bold px-2 py-0.5 rounded uppercase">
                      MCI #{selectedDoctor.regNumber}
                    </span>
                  </div>

                  {/* Patient Self-View PIP */}
                  <div className="relative z-10 self-end w-32 h-24 bg-zinc-900 rounded-xl border border-zinc-700 overflow-hidden shadow-lg flex items-center justify-center text-white">
                    <div className="text-center p-2">
                      <User className="w-6 h-6 mx-auto text-zinc-400 mb-1" />
                      <span className="text-[10px] block font-medium truncate">{patientName} (You)</span>
                    </div>
                  </div>

                  {/* Call Action Bar */}
                  <div className="relative z-10 flex items-center justify-center gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => setIsMuted(!isMuted)}
                      className={`p-3 rounded-full transition-colors ${
                        isMuted ? 'bg-rose-600 text-white' : 'bg-zinc-800 text-white hover:bg-zinc-700'
                      }`}
                      title={isMuted ? 'Unmute Mic' : 'Mute Mic'}
                    >
                      {isMuted ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                    </button>

                    <button
                      type="button"
                      onClick={() => setIsVideoEnabled(!isVideoEnabled)}
                      className={`p-3 rounded-full transition-colors ${
                        !isVideoEnabled ? 'bg-rose-600 text-white' : 'bg-zinc-800 text-white hover:bg-zinc-700'
                      }`}
                      title={isVideoEnabled ? 'Turn Off Camera' : 'Turn On Camera'}
                    >
                      {isVideoEnabled ? <Video className="w-4 h-4" /> : <VideoOff className="w-4 h-4" />}
                    </button>

                    <button
                      type="button"
                      onClick={handleEndCallAndGenerateRx}
                      className="px-5 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-full flex items-center gap-2 shadow-lg transition-colors cursor-pointer"
                    >
                      <PhoneOff className="w-4 h-4" />
                      End Call & Review Digital Rx
                    </button>
                  </div>
                </div>

                {/* Patient Live Vitals Banner */}
                <div className="bg-zinc-50 border border-zinc-200 rounded-xl p-3 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1.5 text-zinc-700">
                      <Heart className="w-4 h-4 text-rose-500" />
                      <span>BP: <strong className="text-zinc-900">128/82 mmHg</strong></span>
                    </div>
                    <div className="flex items-center gap-1.5 text-zinc-700">
                      <Activity className="w-4 h-4 text-indigo-500" />
                      <span>Glucose: <strong className="text-zinc-900">114 mg/dL Fasting</strong></span>
                    </div>
                    <div className="flex items-center gap-1.5 text-zinc-700">
                      <span>HbA1c: <strong className="text-zinc-900">7.1%</strong></span>
                    </div>
                  </div>
                  <span className="text-[11px] text-emerald-700 font-semibold bg-emerald-100 px-2 py-0.5 rounded">
                    Vitals Stable
                  </span>
                </div>
              </div>

              {/* In-Call Consultation Chat & Clinical Notes */}
              <div className="flex flex-col h-full bg-zinc-50 border border-zinc-200 rounded-2xl p-4 flex-1">
                <div className="flex items-center justify-between pb-3 border-b border-zinc-200">
                  <div>
                    <h5 className="font-bold text-xs text-zinc-900">Doctor Clinical Notes & Chat</h5>
                    <span className="text-[10px] text-zinc-500">Real-time consultation transcript</span>
                  </div>
                  <span className="text-[10px] bg-indigo-100 text-indigo-800 font-bold px-2 py-0.5 rounded">
                    ICD-10: E11.9
                  </span>
                </div>

                <div className="flex-1 overflow-y-auto py-3 space-y-3 min-h-[220px] max-h-[300px]">
                  {chatMessages.map((msg, idx) => (
                    <div
                      key={idx}
                      className={`text-xs p-2.5 rounded-xl max-w-[85%] ${
                        msg.sender === 'doctor'
                          ? 'bg-white border border-zinc-200 text-zinc-800 mr-auto'
                          : 'bg-indigo-600 text-white ml-auto'
                      }`}
                    >
                      <div className="flex items-center justify-between text-[10px] mb-1 opacity-70">
                        <span className="font-semibold">{msg.sender === 'doctor' ? selectedDoctor.name : 'You'}</span>
                        <span>{msg.time}</span>
                      </div>
                      <p className="leading-relaxed">{msg.text}</p>
                    </div>
                  ))}
                </div>

                <form onSubmit={handleSendMessage} className="pt-3 border-t border-zinc-200 flex gap-2">
                  <input
                    type="text"
                    value={newMsg}
                    onChange={(e) => setNewMsg(e.target.value)}
                    placeholder="Type message to doctor..."
                    className="flex-1 bg-white border border-zinc-300 rounded-lg px-3 py-1.5 text-xs text-zinc-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                  <button
                    type="submit"
                    className="p-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors shrink-0"
                  >
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </form>
              </div>
            </div>
          )}

          {consultationStep === 'rx_ready' && (
            <div className="max-w-2xl mx-auto space-y-6">
              <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 flex items-center gap-3">
                <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0" />
                <div>
                  <h4 className="font-bold text-sm text-emerald-950">Consultation Completed & Digital Rx Issued!</h4>
                  <p className="text-xs text-emerald-800 mt-0.5">
                    Dr. {selectedDoctor.name} has validated your clinical history and signed the official prescription under CDSCO guidelines.
                  </p>
                </div>
              </div>

              {/* Digital Rx Preview Card */}
              <div className="bg-white border-2 border-indigo-200 rounded-2xl p-6 shadow-sm space-y-4 font-sans relative">
                <div className="absolute top-4 right-4 bg-indigo-50 border border-indigo-200 text-indigo-800 text-[10px] font-mono px-2 py-1 rounded">
                  CERT-DIGITAL-RX-2026-992
                </div>

                <div className="border-b border-zinc-200 pb-3">
                  <h3 className="font-bold text-base text-zinc-900">{selectedDoctor.name}</h3>
                  <p className="text-xs text-zinc-600">{selectedDoctor.title} • {selectedDoctor.specialty}</p>
                  <p className="text-[11px] font-mono text-zinc-500">MCI Registration Number: {selectedDoctor.regNumber}</p>
                </div>

                <div className="grid grid-cols-2 gap-4 text-xs text-zinc-700 py-1">
                  <div>
                    <span className="text-zinc-500 block">Patient Name:</span>
                    <strong className="text-zinc-900">{patientName} (42M)</strong>
                  </div>
                  <div>
                    <span className="text-zinc-500 block">Diagnosis (ICD-10):</span>
                    <strong className="text-zinc-900">E11.9 Type 2 Diabetes Mellitus</strong>
                  </div>
                </div>

                <div className="border-t border-zinc-200 pt-3">
                  <h5 className="font-bold text-xs text-zinc-900 mb-2 flex items-center gap-1.5">
                    <FileCheck className="w-4 h-4 text-indigo-600" />
                    Prescribed Generic Formulations (90-Day Refill)
                  </h5>

                  <div className="space-y-2">
                    <div className="p-3 bg-zinc-50 rounded-lg border border-zinc-200 flex items-center justify-between text-xs">
                      <div>
                        <strong className="text-zinc-900 block">1. Metformin Hydrochloride ER 500mg</strong>
                        <span className="text-[11px] text-zinc-500">1 tablet once daily with dinner • 90 Days (Qty: 90 tabs)</span>
                      </div>
                      <span className="text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded text-[11px]">
                        Generic Bio-Equivalent
                      </span>
                    </div>

                    <div className="p-3 bg-zinc-50 rounded-lg border border-zinc-200 flex items-center justify-between text-xs">
                      <div>
                        <strong className="text-zinc-900 block">2. Atorvastatin Calcium 10mg</strong>
                        <span className="text-[11px] text-zinc-500">1 tablet once daily at bedtime • 90 Days (Qty: 90 tabs)</span>
                      </div>
                      <span className="text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded text-[11px]">
                        Generic Bio-Equivalent
                      </span>
                    </div>
                  </div>
                </div>

                <div className="border-t border-zinc-200 pt-3 flex items-center justify-between text-[11px] text-zinc-500">
                  <div>
                    <span className="block font-mono">Digital Signature Hash:</span>
                    <span className="font-mono text-indigo-600">SHA256: 4f8e91c2b083a79d01e...</span>
                  </div>
                  <div className="text-right">
                    <span className="block font-semibold text-zinc-800">Verified by Indian Medical Registry</span>
                    <span>Valid until: 90 Days from today</span>
                  </div>
                </div>
              </div>

              {/* 1-Click Action to bridge into Cart */}
              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setConsultationStep('select')}
                  className="px-4 py-2 border border-zinc-300 hover:bg-zinc-100 rounded-xl text-xs font-semibold text-zinc-700 transition-colors cursor-pointer"
                >
                  Back to Directory
                </button>

                <button
                  type="button"
                  onClick={handleCompleteAndAddToCart}
                  className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl flex items-center gap-2 shadow-lg hover:shadow-emerald-600/30 transition-all cursor-pointer"
                >
                  <ShoppingCart className="w-4 h-4" />
                  Auto-Add Prescribed Generics to Cart & Proceed to Checkout
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
