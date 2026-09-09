import React, { useState, useEffect } from 'react';
import { OrderRecord, PharmacyGeoLocation, DispatchRouteEstimate } from '../types';
import {
  Truck,
  MapPin,
  Clock,
  Thermometer,
  ShieldCheck,
  Phone,
  CheckCircle2,
  Navigation,
  X,
  Radio,
  Zap,
  Key
} from 'lucide-react';

interface LiveRouteTrackerModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: OrderRecord;
  partnerLocation?: PharmacyGeoLocation;
}

export const LiveRouteTrackerModal: React.FC<LiveRouteTrackerModalProps> = ({
  isOpen,
  onClose,
  order,
  partnerLocation,
}) => {
  const [progressPercent, setProgressPercent] = useState<number>(68);
  const [currentSpeed, setCurrentSpeed] = useState<number>(24);
  const [sensorTemp, setSensorTemp] = useState<number>(4.2);
  const [etaMinutes, setEtaMinutes] = useState<number>(14);

  // Determine if order requires cold-chain
  const isColdChain = order.items.some(
    i => i.canonicalProduct.storageGuidelines?.toLowerCase().includes('2°c') ||
         i.canonicalProduct.storageGuidelines?.toLowerCase().includes('refrigerat') ||
         i.canonicalProduct.storageGuidelines?.toLowerCase().includes('below 25°c')
  );

  // Telemetry fluctuation simulation
  useEffect(() => {
    if (!isOpen) return;
    const interval = setInterval(() => {
      setProgressPercent(prev => (prev < 95 ? prev + 1 : 95));
      setCurrentSpeed(Math.floor(20 + Math.random() * 8));
      if (isColdChain) {
        setSensorTemp(parseFloat((4.0 + Math.random() * 0.5).toFixed(1)));
      } else {
        setSensorTemp(parseFloat((21.5 + Math.random() * 0.8).toFixed(1)));
      }
      setEtaMinutes(prev => (prev > 2 ? prev - 0.1 : 2));
    }, 3000);
    return () => clearInterval(interval);
  }, [isOpen, isColdChain]);

  if (!isOpen) return null;

  const partnerName = partnerLocation?.partnerName || order.items[0]?.listing.partnerName || 'MedPlus Care Pharmacy (North Hub)';
  const partnerAddress = partnerLocation?.address || 'Plot 12, Sector 14 Main Market, Gurugram';
  const handoverPin = order.deliveryPin || '8492';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl border border-zinc-200 w-full max-w-3xl max-h-[92vh] flex flex-col overflow-hidden">
        {/* Modal Header */}
        <div className="p-5 border-b border-zinc-100 flex items-start justify-between bg-zinc-50/60">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-800">
                <Radio className="w-3.5 h-3.5 text-blue-600 animate-pulse" />
                Live Geospatial Telemetry & Cold-Chain (Phase 2)
              </span>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-mono font-bold bg-emerald-100 text-emerald-800">
                <Key className="w-3 h-3" />
                Handover PIN: {handoverPin}
              </span>
            </div>
            <h2 className="text-xl font-bold text-zinc-900">
              Live Courier Route & Cold-Chain Dispatch
            </h2>
            <p className="text-xs text-zinc-600">
              Tracking Order <strong className="font-mono">{order.id}</strong> in real-time from {partnerName}.
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Simulated Geospatial Interactive Route Canvas */}
          <div className="relative w-full h-56 bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-950 rounded-2xl p-4 overflow-hidden shadow-inner border border-zinc-800 flex flex-col justify-between">
            {/* Background Map Grid & Roads Effect */}
            <div className="absolute inset-0 opacity-20 pointer-events-none">
              <svg width="100%" height="100%">
                <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="0.5" />
                </pattern>
                <rect width="100%" height="100%" fill="url(#grid)" />
                {/* Simulated Road Paths */}
                <path d="M 30 180 Q 200 40, 420 120 T 700 80" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="4" />
                <path d="M 50 40 L 250 180 L 550 160" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="3" />
              </svg>
            </div>

            {/* Route Polyline Highlight */}
            <div className="absolute inset-0 flex items-center px-12 pointer-events-none">
              <div className="w-full relative">
                {/* Background Route Bar */}
                <div className="h-2.5 bg-zinc-700/80 rounded-full w-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-blue-500 via-emerald-400 to-emerald-500 transition-all duration-700 rounded-full"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>

                {/* Origin Marker (Pharmacy) */}
                <div className="absolute -top-7 left-0 -translate-x-1/2 flex flex-col items-center">
                  <div className="w-7 h-7 rounded-full bg-blue-600 border-2 border-white flex items-center justify-center shadow-lg">
                    <MapPin className="w-3.5 h-3.5 text-white" />
                  </div>
                  <span className="text-[10px] font-bold text-white bg-zinc-900/90 px-1.5 py-0.5 rounded mt-1 whitespace-nowrap shadow-xs">
                    Pharmacy Hub
                  </span>
                </div>

                {/* Animated Courier Marker */}
                <div
                  className="absolute -top-8 -translate-x-1/2 flex flex-col items-center transition-all duration-700"
                  style={{ left: `${progressPercent}%` }}
                >
                  <div className="w-8 h-8 rounded-full bg-emerald-500 border-2 border-white flex items-center justify-center shadow-xl animate-bounce">
                    <Truck className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-[10px] font-mono font-bold text-emerald-300 bg-zinc-900/90 px-1.5 py-0.5 rounded mt-1 whitespace-nowrap shadow-xs flex items-center gap-1">
                    <Navigation className="w-2.5 h-2.5" />
                    {currentSpeed} km/h
                  </span>
                </div>

                {/* Destination Marker (Patient Home) */}
                <div className="absolute -top-7 right-0 translate-x-1/2 flex flex-col items-center">
                  <div className="w-7 h-7 rounded-full bg-rose-500 border-2 border-white flex items-center justify-center shadow-lg">
                    <CheckCircle2 className="w-3.5 h-3.5 text-white" />
                  </div>
                  <span className="text-[10px] font-bold text-white bg-zinc-900/90 px-1.5 py-0.5 rounded mt-1 whitespace-nowrap shadow-xs">
                    Your Address
                  </span>
                </div>
              </div>
            </div>

            {/* Map Top Status Bar */}
            <div className="relative z-10 flex items-center justify-between text-xs text-white">
              <div className="flex items-center gap-2 bg-zinc-900/80 backdrop-blur-xs px-3 py-1.5 rounded-lg border border-zinc-700">
                <Radio className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
                <span className="font-mono font-semibold">GPS Active: Live Fleet Telemetry</span>
              </div>
              <div className="bg-zinc-900/80 backdrop-blur-xs px-3 py-1.5 rounded-lg border border-zinc-700 font-mono text-emerald-400 font-bold">
                ETA: ~{Math.ceil(etaMinutes)} Mins Remaining
              </div>
            </div>

            {/* Map Bottom Origin / Destination Bar */}
            <div className="relative z-10 flex items-center justify-between text-[11px] text-zinc-300">
              <span className="truncate max-w-[200px]">{partnerAddress}</span>
              <span className="truncate max-w-[200px] text-right">{order.deliveryAddress}</span>
            </div>
          </div>

          {/* Telemetry Metrics Strip */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Courier Rider Card */}
            <div className="p-4 rounded-xl border border-zinc-200 bg-zinc-50/70 space-y-2">
              <div className="flex items-center justify-between text-xs text-zinc-500">
                <span className="font-semibold uppercase tracking-wider text-[10px]">Assigned Courier</span>
                <span className="px-2 py-0.5 rounded text-[10px] bg-emerald-100 text-emerald-800 font-bold">
                  Verified EV Fleet
                </span>
              </div>
              <div className="flex items-center gap-3 pt-1">
                <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-800 font-bold flex items-center justify-center text-sm">
                  RV
                </div>
                <div>
                  <div className="text-sm font-bold text-zinc-900">Rahul Verma</div>
                  <div className="text-xs text-zinc-500 flex items-center gap-1">
                    <span>Electric Van (DL-08-EV-491)</span>
                  </div>
                </div>
              </div>
              <div className="pt-2 border-t border-zinc-200/80 flex items-center justify-between text-xs">
                <span className="text-zinc-500 font-mono">4.9 ★ (1,420 Deliveries)</span>
                <a
                  href="tel:+919876543210"
                  onClick={(e) => { e.preventDefault(); alert('Connecting to courier Rahul Verma via masked call proxy...'); }}
                  className="px-2.5 py-1 rounded-lg bg-zinc-900 text-white font-semibold flex items-center gap-1 hover:bg-zinc-800"
                >
                  <Phone className="w-3 h-3" />
                  Call Rider
                </a>
              </div>
            </div>

            {/* Live Cold-Chain Temperature Sensor */}
            <div className={`p-4 rounded-xl border space-y-2 ${
              isColdChain ? 'border-blue-200 bg-blue-50/50' : 'border-zinc-200 bg-zinc-50/70'
            }`}>
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold uppercase tracking-wider text-[10px] text-zinc-500">
                  {isColdChain ? 'Cold-Chain Telemetry' : 'Ambient Cargo Sensor'}
                </span>
                <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded">
                  <ShieldCheck className="w-3 h-3" />
                  Optimal
                </span>
              </div>
              <div className="flex items-baseline gap-2 pt-1">
                <Thermometer className={`w-5 h-5 ${isColdChain ? 'text-blue-600' : 'text-amber-600'}`} />
                <span className="text-2xl font-bold font-mono text-zinc-900">
                  {sensorTemp.toFixed(1)}°C
                </span>
                <span className="text-xs text-zinc-500">
                  Target: {isColdChain ? '2°C - 8°C' : '15°C - 25°C'}
                </span>
              </div>
              <div className="pt-2 border-t border-zinc-200/80 text-[11px] text-zinc-500">
                Sensor #BT-TEMP-8812 • GDP 2026 Compliant
              </div>
            </div>

            {/* Delivery Security PIN & ETA */}
            <div className="p-4 rounded-xl border border-zinc-200 bg-zinc-50/70 space-y-2">
              <div className="flex items-center justify-between text-xs text-zinc-500">
                <span className="font-semibold uppercase tracking-wider text-[10px]">Security Handover</span>
                <span className="text-[10px] text-zinc-400 font-mono">FR-ORDER-04</span>
              </div>
              <div className="pt-1">
                <span className="text-xs text-zinc-500 block">4-Digit Delivery PIN:</span>
                <span className="text-2xl font-bold font-mono text-zinc-900 tracking-wider">
                  {handoverPin}
                </span>
              </div>
              <div className="pt-2 border-t border-zinc-200/80 text-[11px] text-zinc-500">
                Share this PIN with the rider only after receiving your sealed package.
              </div>
            </div>
          </div>

          {/* Package Contents in Transit */}
          <div className="space-y-2 text-xs">
            <span className="font-bold text-zinc-900 block">Medicines in this Package:</span>
            <div className="space-y-1.5">
              {order.items.map(item => (
                <div
                  key={item.listingId}
                  className="p-2.5 rounded-lg bg-zinc-50 border border-zinc-200/80 flex items-center justify-between"
                >
                  <div>
                    <span className="font-semibold text-zinc-900">{item.canonicalProduct.canonicalName}</span>
                    <span className="text-zinc-500 text-[11px] block">
                      {item.canonicalProduct.genericSalt} • {item.quantity} pack(s)
                    </span>
                  </div>
                  <span className="font-mono font-bold text-zinc-900">
                    ₹{(item.listing.packPrice * item.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-zinc-100 bg-zinc-50/60 flex items-center justify-between text-xs">
          <span className="text-zinc-500 text-[11px]">
            Real-time GPS telemetry updates every 3 seconds via encrypted websocket.
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-white font-semibold transition-colors shadow-xs"
          >
            Close Live Tracking
          </button>
        </div>
      </div>
    </div>
  );
};
