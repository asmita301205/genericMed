import React, { useState } from 'react';
import { CanonicalProduct, ProductListing, ProductReview, SubscriptionIntervalDays } from '../types';
import {
  X,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  TrendingDown,
  Building,
  Store,
  Star,
  MapPin,
  Clock,
  ShoppingCart,
  Thermometer,
  FileText,
  Sparkles,
  RotateCcw,
  MessageSquare,
  ThumbsUp,
  Plus,
  Send,
  Info
} from 'lucide-react';

interface ProductDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: CanonicalProduct;
  listings: ProductListing[];
  reviews?: ProductReview[];
  onAddToCart: (listing: ProductListing, canonicalProduct: CanonicalProduct) => void;
  onSubscribe?: (product: CanonicalProduct, listing: ProductListing, interval: SubscriptionIntervalDays) => void;
  onSubmitReview?: (review: Omit<ProductReview, 'id' | 'date' | 'helpfulCount' | 'status'>) => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  isOpen,
  onClose,
  product,
  listings,
  reviews = [],
  onAddToCart,
  onSubscribe,
  onSubmitReview,
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'reviews'>('overview');
  const [subscribeInterval, setSubscribeInterval] = useState<SubscriptionIntervalDays>(30);
  const [subscribedFeedback, setSubscribedFeedback] = useState<string | null>(null);

  // Review submission state
  const [isWritingReview, setIsWritingReview] = useState(false);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewTitle, setReviewTitle] = useState('');
  const [reviewComment, setReviewComment] = useState('');
  const [reviewCondition, setReviewCondition] = useState('');
  const [reviewSuccessMsg, setReviewSuccessMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const matchingListings = listings.filter(l => l.productId === product.id && l.isAvailable);
  const bestListing = matchingListings[0];
  const unitSavings = bestListing
    ? Math.max(0, product.brandPriceRef - bestListing.normalizedUnitPrice)
    : 0;
  const savingsPct = bestListing
    ? Math.round((unitSavings / product.brandPriceRef) * 100)
    : 0;

  // Monthly chronic savings based on 60 tablets/month
  const monthlySavings = (unitSavings * 60).toFixed(0);

  // Filter approved reviews for this product
  const productReviews = reviews.filter(r => r.productId === product.id && r.status === 'approved');
  const avgRating = productReviews.length > 0
    ? (productReviews.reduce((sum, r) => sum + r.rating, 0) / productReviews.length).toFixed(1)
    : '4.9';

  const handleSubscribeClick = () => {
    if (bestListing && onSubscribe) {
      onSubscribe(product, bestListing, subscribeInterval);
      setSubscribedFeedback(`Enrolled in ${subscribeInterval}-day Auto-Refill! Managed in Subscriptions.`);
      setTimeout(() => setSubscribedFeedback(null), 4000);
    }
  };

  const handleSubmitReviewForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewTitle.trim() || !reviewComment.trim()) {
      alert('Please fill out the review title and comments.');
      return;
    }

    if (onSubmitReview) {
      onSubmitReview({
        productId: product.id,
        productName: product.canonicalName,
        authorName: 'Aarav Sharma',
        authorLocation: 'Gurugram',
        rating: reviewRating,
        isVerifiedPurchase: true,
        title: reviewTitle,
        comment: reviewComment,
        conditionTreated: reviewCondition.trim() || 'General Health Maintenance',
        clinicalFeedbackTags: ['Verified Purchase', 'Exact bio-equivalence', 'Significant Cost Relief']
      });

      setReviewSuccessMsg('Review submitted! Sent to Admin Governance Queue for pharmaceutical compliance review.');
      setIsWritingReview(false);
      setReviewTitle('');
      setReviewComment('');
      setReviewCondition('');
      setTimeout(() => setReviewSuccessMsg(null), 5000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-900/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl border border-zinc-200 shadow-2xl max-w-3xl w-full overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header Strip */}
        <div className="p-5 border-b border-zinc-100 flex items-center justify-between bg-zinc-50/70">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-xs">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-zinc-900">{product.canonicalName}</h3>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  product.prescriptionRequired
                    ? 'bg-amber-50 text-amber-800 border border-amber-200'
                    : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                }`}>
                  {product.prescriptionRequired ? 'Schedule H (Rx Required)' : 'OTC Available'}
                </span>
                <span className="flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-amber-50 text-amber-900 border border-amber-200">
                  <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                  {avgRating} ({productReviews.length} Reviews)
                </span>
              </div>
              <p className="text-xs text-zinc-500 font-mono">
                Salt: {product.genericSalt} • {product.therapeuticClass}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="px-6 pt-3 flex items-center gap-4 border-b border-zinc-100 bg-white text-xs">
          <button
            onClick={() => setActiveTab('overview')}
            className={`pb-3 font-bold border-b-2 transition-all ${
              activeTab === 'overview'
                ? 'border-zinc-900 text-zinc-900'
                : 'border-transparent text-zinc-500 hover:text-zinc-800'
            }`}
          >
            Clinical Monograph & Partners
          </button>
          <button
            onClick={() => setActiveTab('reviews')}
            className={`pb-3 font-bold border-b-2 transition-all flex items-center gap-1.5 ${
              activeTab === 'reviews'
                ? 'border-zinc-900 text-zinc-900'
                : 'border-transparent text-zinc-500 hover:text-zinc-800'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5 text-zinc-500" />
            Patient Reviews & Efficacy ({productReviews.length})
            <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-blue-100 text-blue-800 font-bold">
              Phase 2
            </span>
          </button>
        </div>

        {/* Subscribed or Review Feedback */}
        {subscribedFeedback && (
          <div className="mx-6 mt-4 p-3 rounded-xl bg-blue-50 border border-blue-200 text-xs text-blue-900 flex items-center gap-2 font-semibold">
            <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
            <span>{subscribedFeedback}</span>
          </div>
        )}

        {reviewSuccessMsg && (
          <div className="mx-6 mt-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 flex items-center gap-2 font-semibold">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{reviewSuccessMsg}</span>
          </div>
        )}

        {/* Modal Scrollable Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-xs flex-1">
          {activeTab === 'overview' ? (
            <>
              {/* Section 1: Value & Savings Hero */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="p-4 rounded-xl bg-emerald-50/60 border border-emerald-200 md:col-span-2 flex flex-col justify-between">
                  <div className="space-y-1">
                    <span className="text-[10px] uppercase font-bold text-emerald-800 tracking-wider">
                      Verified Unit Economics (PRD FR-CORE-03)
                    </span>
                    <div className="flex items-baseline gap-3">
                      <span className="text-2xl font-black font-mono text-emerald-700">
                        ₹{bestListing ? bestListing.normalizedUnitPrice.toFixed(2) : '0.00'}
                      </span>
                      <span className="text-xs text-zinc-500 font-medium">
                        per {bestListing?.unitLabel || 'tablet'}
                      </span>
                      <span className="line-through text-xs font-mono text-zinc-400">
                        ₹{product.brandPriceRef.toFixed(2)} (Branded {product.commonBrandEquivalent})
                      </span>
                    </div>
                    <p className="text-emerald-800 font-medium text-[11px] pt-1">
                      Save ₹{unitSavings.toFixed(2)} per unit ({savingsPct}% discount) with generic bio-equivalence.
                    </p>
                  </div>

                  {/* Chronic Monthly Savings projection */}
                  <div className="pt-3 mt-3 border-t border-emerald-200/80 flex items-center justify-between text-[11px]">
                    <span className="text-zinc-600">Chronic Maintenance Savings (60 tabs/mo):</span>
                    <span className="font-bold text-emerald-800 font-mono">≈ ₹{monthlySavings} saved / month</span>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-zinc-50 border border-zinc-200 flex flex-col justify-between">
                  <div className="space-y-1">
                    <span className="text-[10px] uppercase font-bold text-zinc-500 tracking-wider">
                      Manufacturer & Standards
                    </span>
                    <span className="font-bold text-zinc-900 block text-xs">
                      {product.manufacturer || 'Approved Generic Formulations'}
                    </span>
                    <p className="text-zinc-500 text-[11px]">
                      GMP certified facility adhering to Indian Pharmacopoeia standards.
                    </p>
                  </div>
                  <div className="pt-2 text-[10px] font-mono text-zinc-400">
                    Schedule: {product.drugSchedule || 'Standard'}
                  </div>
                </div>
              </div>

              {/* Phase 2: Subscribe & Save Box */}
              {onSubscribe && bestListing && (
                <div className="p-4 rounded-xl border border-blue-200 bg-blue-50/40 space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center">
                        <RotateCcw className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="font-bold text-blue-950 text-xs block">
                          Persona B: Subscribe & Save Extra 5%
                        </span>
                        <span className="text-zinc-500 text-[11px]">
                          Automated chronic refilling. Free cancellation anytime.
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <select
                        value={subscribeInterval}
                        onChange={(e) => setSubscribeInterval(Number(e.target.value) as SubscriptionIntervalDays)}
                        className="px-2.5 py-1.5 rounded-lg border border-blue-200 bg-white text-xs font-semibold text-zinc-800"
                      >
                        <option value={30}>Every 30 Days</option>
                        <option value={60}>Every 60 Days</option>
                        <option value={90}>Every 90 Days</option>
                      </select>

                      <button
                        onClick={handleSubscribeClick}
                        className="px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs transition-colors shadow-xs"
                      >
                        Enroll in Auto-Refill
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Section 2: Clinical Monograph & Guidelines */}
              <div className="space-y-3">
                <h4 className="font-bold text-zinc-900 text-sm flex items-center gap-2">
                  <FileText className="w-4 h-4 text-emerald-600" />
                  Clinical Monograph & Safety Guidelines (FR-DISC-02)
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {/* Precautions */}
                  <div className="p-3.5 rounded-xl border border-zinc-200 bg-zinc-50/50 space-y-1.5">
                    <span className="font-bold text-zinc-800 block text-xs">Usage Precautions</span>
                    <ul className="list-disc pl-4 space-y-1 text-zinc-600 text-[11px]">
                      {product.precautions?.map((p, i) => (
                        <li key={i}>{p}</li>
                      )) || <li>Follow prescribing doctor's exact dosage instructions.</li>}
                    </ul>
                  </div>

                  {/* Contraindications */}
                  <div className="p-3.5 rounded-xl border border-rose-200 bg-rose-50/30 space-y-1.5">
                    <span className="font-bold text-rose-900 block text-xs">Contraindications</span>
                    <ul className="list-disc pl-4 space-y-1 text-rose-800 text-[11px]">
                      {product.contraindications?.map((c, i) => (
                        <li key={i}>{c}</li>
                      )) || <li>Hypersensitivity to the active pharmaceutical ingredient.</li>}
                    </ul>
                  </div>

                  {/* Storage */}
                  <div className="p-3.5 rounded-xl border border-zinc-200 bg-zinc-50/50 space-y-1.5">
                    <span className="font-bold text-zinc-800 block text-xs flex items-center gap-1.5">
                      <Thermometer className="w-3.5 h-3.5 text-zinc-500" />
                      Storage & Temperature
                    </span>
                    <p className="text-zinc-600 text-[11px]">
                      {product.storageGuidelines || 'Store in a cool, dry place away from direct light.'}
                    </p>
                  </div>

                  {/* Common Side Effects */}
                  <div className="p-3.5 rounded-xl border border-zinc-200 bg-zinc-50/50 space-y-1.5">
                    <span className="font-bold text-zinc-800 block text-xs">Reported Side Effects</span>
                    <p className="text-zinc-600 text-[11px]">
                      {product.sideEffects?.join(', ') || 'Mild dizziness, transient nausea.'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Section 3: Available Licensed Pharmacy Partners */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-zinc-900 text-sm flex items-center gap-2">
                    <Store className="w-4 h-4 text-emerald-600" />
                    Verified Pharmacy Partners Stocking This Formulation ({matchingListings.length})
                  </h4>
                  <span className="text-[11px] text-zinc-500 font-mono">Freshness SLA &lt; 24h</span>
                </div>

                <div className="space-y-2">
                  {matchingListings.map((listing) => (
                    <div
                      key={listing.id}
                      className="p-3.5 rounded-xl border border-zinc-200 bg-white hover:border-zinc-300 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-zinc-900 text-xs">{listing.partnerName}</span>
                          <span className="inline-flex items-center gap-0.5 text-[10px] font-bold px-1.5 py-0.2 rounded bg-amber-50 text-amber-800 border border-amber-200">
                            <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                            {listing.partnerRating}
                          </span>
                        </div>
                        <div className="flex items-center gap-3 text-zinc-500 text-[11px]">
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3 h-3 text-zinc-400" />
                            {listing.partnerLocation}
                          </span>
                          <span className="flex items-center gap-1 font-mono">
                            <Clock className="w-3 h-3 text-zinc-400" />
                            {listing.freshnessTimestamp}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between sm:justify-end gap-4">
                        <div className="text-right">
                          <div className="font-bold font-mono text-zinc-900 text-sm">
                            ₹{listing.packPrice.toFixed(2)}
                          </div>
                          <div className="text-[10px] text-emerald-700 font-mono font-semibold">
                            ₹{listing.normalizedUnitPrice.toFixed(2)} / {listing.unitLabel}
                          </div>
                        </div>

                        <button
                          onClick={() => {
                            onAddToCart(listing, product);
                            onClose();
                          }}
                          className="px-3 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-white font-semibold text-xs flex items-center gap-1.5 shadow-xs transition-colors shrink-0"
                        >
                          <ShoppingCart className="w-3.5 h-3.5" />
                          Add Pack
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          ) : (
            /* Phase 2 Reviews Tab */
            <div className="space-y-5">
              {/* Reviews Summary Header */}
              <div className="p-4 rounded-xl bg-zinc-50 border border-zinc-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="text-center">
                    <span className="text-3xl font-black text-zinc-900 block font-mono">{avgRating}</span>
                    <div className="flex items-center gap-0.5 justify-center mt-0.5">
                      {[1, 2, 3, 4, 5].map(s => (
                        <Star key={s} className="w-3 h-3 fill-amber-400 text-amber-400" />
                      ))}
                    </div>
                    <span className="text-[10px] text-zinc-400 mt-1 block">
                      {productReviews.length} Verified Reviews
                    </span>
                  </div>

                  <div className="h-10 w-px bg-zinc-200 hidden sm:block" />

                  <div className="text-xs text-zinc-600 space-y-0.5">
                    <div className="font-bold text-zinc-900">Verified Patient Experiences</div>
                    <p className="text-[11px] text-zinc-500">
                      All reviews are verified against order delivery records and checked by pharmacists for medical safety.
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setIsWritingReview(!isWritingReview)}
                  className="px-3.5 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-white font-semibold text-xs flex items-center gap-1.5 transition-colors shadow-xs shrink-0"
                >
                  <Plus className="w-3.5 h-3.5" />
                  {isWritingReview ? 'Cancel Review' : 'Write Verified Review'}
                </button>
              </div>

              {/* Review Form Drawer */}
              {isWritingReview && (
                <form onSubmit={handleSubmitReviewForm} className="p-4 rounded-xl border border-blue-200 bg-blue-50/30 space-y-3">
                  <div className="font-bold text-zinc-900 text-xs flex items-center justify-between">
                    <span>Submit Verified Experience for {product.canonicalName}</span>
                    <span className="text-[10px] text-zinc-400">PRD FR-REV-01</span>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-[11px] font-bold text-zinc-700 block mb-1">Your Star Rating</label>
                      <div className="flex items-center gap-1">
                        {[1, 2, 3, 4, 5].map(s => (
                          <button
                            key={s}
                            type="button"
                            onClick={() => setReviewRating(s)}
                            className="p-1 hover:scale-110 transition-transform"
                          >
                            <Star className={`w-5 h-5 ${s <= reviewRating ? 'fill-amber-400 text-amber-400' : 'text-zinc-300'}`} />
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="text-[11px] font-bold text-zinc-700 block mb-1">Condition Treated</label>
                      <input
                        type="text"
                        placeholder="e.g. Type-2 Diabetes, Fever, Sinusitis"
                        value={reviewCondition}
                        onChange={(e) => setReviewCondition(e.target.value)}
                        className="w-full px-2.5 py-1.5 text-xs rounded border border-zinc-300 bg-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-zinc-700 block mb-1">Review Headline</label>
                    <input
                      type="text"
                      placeholder="e.g. Exact same efficacy as Crocin at a fraction of cost"
                      value={reviewTitle}
                      onChange={(e) => setReviewTitle(e.target.value)}
                      className="w-full px-2.5 py-1.5 text-xs rounded border border-zinc-300 bg-white font-medium"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-zinc-700 block mb-1">Clinical Experience Details</label>
                    <textarea
                      rows={3}
                      placeholder="Describe your experience regarding symptom relief, absorption, stomach tolerance, and cost savings..."
                      value={reviewComment}
                      onChange={(e) => setReviewComment(e.target.value)}
                      className="w-full px-2.5 py-1.5 text-xs rounded border border-zinc-300 bg-white leading-relaxed"
                    />
                  </div>

                  <div className="p-2.5 rounded bg-zinc-100/80 text-[10px] text-zinc-500">
                    <strong>Medical Disclaimer:</strong> Reviews represent individual patient experiences and cannot substitute professional doctor diagnosis or dosage modification.
                  </div>

                  <div className="flex justify-end gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => setIsWritingReview(false)}
                      className="px-3 py-1.5 rounded border border-zinc-200 text-zinc-600 text-xs"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-1.5 rounded bg-zinc-900 text-white font-semibold text-xs flex items-center gap-1.5 shadow-xs"
                    >
                      <Send className="w-3.5 h-3.5" />
                      Submit for Moderation
                    </button>
                  </div>
                </form>
              )}

              {/* Reviews List */}
              <div className="space-y-3">
                {productReviews.length === 0 ? (
                  <div className="text-center py-8 text-zinc-500">
                    <MessageSquare className="w-8 h-8 mx-auto text-zinc-300 mb-2" />
                    <p className="font-medium">No verified reviews submitted for this formulation yet.</p>
                    <p className="text-[11px] text-zinc-400">Be the first patient to share your experience!</p>
                  </div>
                ) : (
                  productReviews.map(rev => (
                    <div key={rev.id} className="p-4 rounded-xl border border-zinc-200 bg-white space-y-2.5 shadow-2xs">
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-zinc-900">{rev.authorName}</span>
                            <span className="text-[11px] text-zinc-400">({rev.authorLocation})</span>
                            <span className="inline-flex items-center gap-1 px-1.5 py-0.2 rounded text-[10px] font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
                              <ShieldCheck className="w-3 h-3 text-emerald-600" />
                              Verified Buyer
                            </span>
                          </div>
                          <div className="flex items-center gap-1 mt-0.5">
                            {[1, 2, 3, 4, 5].map(s => (
                              <Star
                                key={s}
                                className={`w-3 h-3 ${s <= rev.rating ? 'fill-amber-400 text-amber-400' : 'text-zinc-200'}`}
                              />
                            ))}
                            <span className="text-[11px] text-zinc-400 ml-1.5">{rev.date}</span>
                          </div>
                        </div>

                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-zinc-100 text-zinc-700">
                          {rev.conditionTreated}
                        </span>
                      </div>

                      <h5 className="font-bold text-zinc-900 text-xs">{rev.title}</h5>
                      <p className="text-zinc-600 text-xs leading-relaxed">{rev.comment}</p>

                      {/* Clinical tags */}
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {rev.clinicalFeedbackTags.map((tag, idx) => (
                          <span key={idx} className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-blue-50 text-blue-800 border border-blue-100">
                            {tag}
                          </span>
                        ))}
                      </div>

                      {/* Pharmacist validation note */}
                      {rev.pharmacistVerifiedNote && (
                        <div className="mt-2 p-2 rounded-lg bg-emerald-50/70 border border-emerald-200 text-[11px] text-emerald-900 flex items-start gap-2">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                          <span><strong>Pharmacist Note:</strong> {rev.pharmacistVerifiedNote}</span>
                        </div>
                      )}

                      <div className="pt-2 border-t border-zinc-100 flex items-center justify-between text-[11px] text-zinc-400">
                        <span>Was this review helpful?</span>
                        <span className="flex items-center gap-1 hover:text-zinc-700 cursor-pointer font-medium">
                          <ThumbsUp className="w-3 h-3" />
                          Helpful ({rev.helpfulCount})
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-zinc-100 bg-zinc-50/70 flex items-center justify-between text-xs">
          <span className="flex items-center gap-1 text-zinc-500 text-[11px]">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            Verified Bio-Equivalence Under Section 65 Regulatory Governance
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-white font-semibold text-xs transition-colors"
          >
            Close Details
          </button>
        </div>
      </div>
    </div>
  );
};
