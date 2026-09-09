import React, { useState, useEffect } from 'react';
import { SupportedLanguage, CanonicalProduct, ProductListing, VoicePharmacistQuery } from '../types';
import { VOICE_PHARMACIST_SAMPLE_QUERIES, CANONICAL_PRODUCTS, PRODUCT_LISTINGS } from '../data/genericMedData';
import {
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Sparkles,
  CheckCircle2,
  ShoppingCart,
  Languages,
  RotateCcw,
  X,
  Play,
  Pause,
  AlertCircle,
  HelpCircle,
  Stethoscope
} from 'lucide-react';

interface VoicePharmacistModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddToCart: (listing: ProductListing, canonicalProduct: CanonicalProduct) => void;
  language?: SupportedLanguage;
}

export const VoicePharmacistModal: React.FC<VoicePharmacistModalProps> = ({
  isOpen,
  onClose,
  onAddToCart,
  language = 'hi'
}) => {
  const [selectedLanguage, setSelectedLanguage] = useState<SupportedLanguage>(language);
  const [isListening, setIsListening] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [activeQueryIndex, setActiveQueryIndex] = useState(0);

  const availableQueries = VOICE_PHARMACIST_SAMPLE_QUERIES;
  const currentQuery: VoicePharmacistQuery = availableQueries[activeQueryIndex] || availableQueries[0];

  // Matched canonical product and lowest price listing
  const matchedProduct = CANONICAL_PRODUCTS.find(p => p.id === currentQuery.matchedCanonicalProductId) || CANONICAL_PRODUCTS[0];
  const matchedListing = PRODUCT_LISTINGS.find(l => l.productId === matchedProduct.id) || PRODUCT_LISTINGS[0];

  useEffect(() => {
    // Select sample query matching language if available
    const idx = availableQueries.findIndex(q => q.language === selectedLanguage);
    if (idx !== -1) {
      setActiveQueryIndex(idx);
    }
  }, [selectedLanguage]);

  if (!isOpen) return null;

  const handleToggleListen = () => {
    if (isListening) {
      setIsListening(false);
    } else {
      setIsListening(true);
      // Simulate speech-to-text processing after 2 seconds
      setTimeout(() => {
        setIsListening(false);
        setIsPlayingAudio(true);
      }, 2200);
    }
  };

  const handleAddToCartClick = () => {
    onAddToCart(matchedListing, matchedProduct);
    onClose();
  };

  const languageLabels: Record<SupportedLanguage, string> = {
    en: 'English (EN)',
    hi: 'हिन्दी (Hindi)',
    ta: 'தமிழ் (Tamil)',
    te: 'తెలుగు (Telugu)',
    bn: 'বাংলা (Bengali)'
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white border border-zinc-200 rounded-3xl w-full max-w-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 my-8">
        {/* Header Strip */}
        <div className="bg-linear-to-r from-emerald-600 via-teal-600 to-cyan-700 text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30 shadow-inner">
              <Mic className="w-6 h-6 text-white animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] uppercase tracking-wider font-semibold bg-white/20 px-2 py-0.5 rounded font-mono">
                  Arogya Vani (आरोग्य वाणी)
                </span>
                <span className="text-xs text-emerald-100">AI Multilingual Voice Pharmacist</span>
              </div>
              <h2 className="text-lg font-bold">Speak Your Medicine Query</h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 space-y-6">
          {/* Language Selector Strip */}
          <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-2xl bg-zinc-50 border border-zinc-200 text-xs">
            <div className="flex items-center gap-2 text-zinc-600 font-medium">
              <Languages className="w-4 h-4 text-emerald-600" />
              <span>Voice Language:</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {(Object.keys(languageLabels) as SupportedLanguage[]).map((lang) => (
                <button
                  key={lang}
                  onClick={() => setSelectedLanguage(lang)}
                  className={`px-2.5 py-1 rounded-lg font-medium transition-all text-xs ${
                    selectedLanguage === lang
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'bg-white border border-zinc-200 text-zinc-700 hover:bg-zinc-100'
                  }`}
                >
                  {languageLabels[lang]}
                </button>
              ))}
            </div>
          </div>

          {/* Interactive Microphone & Waveform Centerpiece */}
          <div className="flex flex-col items-center justify-center py-6 text-center space-y-4">
            <div className="relative">
              {/* Outer pulsing radar ring */}
              {isListening && (
                <>
                  <div className="absolute inset-0 rounded-full bg-emerald-500/20 animate-ping"></div>
                  <div className="absolute -inset-4 rounded-full bg-emerald-500/10 animate-pulse"></div>
                </>
              )}

              <button
                onClick={handleToggleListen}
                className={`w-24 h-24 rounded-full flex items-center justify-center shadow-xl transition-all relative z-10 ${
                  isListening
                    ? 'bg-red-500 hover:bg-red-600 text-white scale-105'
                    : 'bg-linear-to-tr from-emerald-600 to-teal-500 hover:from-emerald-700 hover:to-teal-600 text-white'
                }`}
                title="Tap to Speak"
              >
                {isListening ? (
                  <MicOff className="w-10 h-10 animate-bounce" />
                ) : (
                  <Mic className="w-10 h-10" />
                )}
              </button>
            </div>

            <div>
              <p className="text-sm font-semibold text-zinc-900">
                {isListening ? 'Listening to your voice...' : 'Tap the microphone to ask in your language'}
              </p>
              <p className="text-xs text-zinc-500 mt-0.5">
                Speak brand name, active salt, or health symptom (e.g. "Sugar tablet", "बुखार की दवा")
              </p>
            </div>

            {/* Simulated Live Audio Waveform Bars */}
            <div className="flex items-center gap-1.5 h-10 px-4 py-2 rounded-xl bg-zinc-100 border border-zinc-200">
              {currentQuery.waveformFrequencies.map((freq, i) => (
                <div
                  key={i}
                  className={`w-1.5 rounded-full transition-all duration-150 ${
                    isListening || isPlayingAudio
                      ? 'bg-emerald-500 animate-pulse'
                      : 'bg-zinc-300'
                  }`}
                  style={{
                    height: isListening || isPlayingAudio ? `${Math.max(12, freq * 0.35)}px` : '8px'
                  }}
                />
              ))}
            </div>
          </div>

          {/* Spoken Transcript Card */}
          <div className="p-4 rounded-2xl bg-zinc-50 border border-zinc-200 space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold uppercase tracking-wider text-zinc-400 font-mono text-[10px]">
                Recognized Spoken Request
              </span>
              <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-medium text-[11px]">
                Language: {selectedLanguage.toUpperCase()}
              </span>
            </div>

            <p className="text-sm font-medium text-zinc-900 italic">
              "{currentQuery.spokenTranscript}"
            </p>

            <div className="flex items-center gap-2 pt-1 text-xs text-emerald-700 font-semibold">
              <Sparkles className="w-4 h-4" />
              <span>Extracted Molecule: <strong>{currentQuery.detectedGenericSalt}</strong></span>
            </div>
          </div>

          {/* AI Audio Bioequivalence Answer */}
          <div className="p-5 rounded-2xl bg-linear-to-br from-emerald-50 to-teal-50 border border-emerald-200 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-bold text-emerald-950">
                <Stethoscope className="w-4 h-4 text-emerald-700" />
                <span>Arogya Vani Clinical Audio Explanation</span>
              </div>
              <button
                onClick={() => setIsPlayingAudio(!isPlayingAudio)}
                className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-xs transition-colors"
              >
                {isPlayingAudio ? (
                  <>
                    <Pause className="w-3.5 h-3.5" />
                    Pause Audio
                  </>
                ) : (
                  <>
                    <Play className="w-3.5 h-3.5" />
                    Play Spoken Advice
                  </>
                )}
              </button>
            </div>

            <p className="text-xs text-emerald-950 leading-relaxed">
              {currentQuery.audioExplanationText}
            </p>

            {/* Matched Product & 1-Click Cart Bridge */}
            <div className="p-3.5 rounded-xl bg-white border border-emerald-300/80 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="space-y-1 text-left w-full sm:w-auto">
                <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-wide bg-emerald-50 px-2 py-0.5 rounded">
                  Recommended Generic Match
                </span>
                <h4 className="text-sm font-bold text-zinc-900">{matchedProduct.canonicalName}</h4>
                <div className="flex items-center gap-3 text-xs text-zinc-500">
                  <span>Unit: <strong className="text-emerald-700">₹{matchedListing.normalizedUnitPrice.toFixed(2)}/tab</strong></span>
                  <span>•</span>
                  <span>Pack: ₹{matchedListing.packPrice.toFixed(2)} ({matchedListing.packQuantity} tabs)</span>
                  <span>•</span>
                  <span className="text-emerald-600 font-semibold">Save ₹{currentQuery.savingsAnnualINR}/yr</span>
                </div>
              </div>

              <button
                onClick={handleAddToCartClick}
                className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-sm transition-all"
              >
                <ShoppingCart className="w-4 h-4" />
                Add to Cart
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-zinc-50 border-t border-zinc-200 flex items-center justify-between text-xs text-zinc-500">
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Persona C Voice Accessibility Active • No typing required</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-zinc-900 text-white font-medium hover:bg-zinc-800 transition-colors"
          >
            Close Assistant
          </button>
        </div>
      </div>
    </div>
  );
};
