import React, { useState, useMemo } from 'react';
import {
  CanonicalProduct,
  ProductListing,
  CartItem,
  OrderRecord,
  UserProfile,
  PrescriptionRecord,
  PaymentSession,
  ProductReview,
  SubscriptionIntervalDays
} from '../types';
import { SAMPLE_PRESCRIPTIONS } from '../data/genericMedData';
import { ProductDetailModal } from './ProductDetailModal';
import { PrescriptionScannerModal } from './PrescriptionScannerModal';
import { PaymentGatewayModal } from './PaymentGatewayModal';
import {
  Search,
  Filter,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  ShoppingCart,
  TrendingDown,
  ShieldCheck,
  Star,
  MapPin,
  Clock,
  Sparkles,
  Info,
  Scale,
  X,
  CreditCard,
  Plus,
  Minus,
  Trash2,
  RefreshCw,
  Eye,
  Check,
  FileText,
  Upload
} from 'lucide-react';

interface CustomerMarketplaceProps {
  products: CanonicalProduct[];
  listings: ProductListing[];
  cart: CartItem[];
  userProfile?: UserProfile;
  activePrescriptions?: PrescriptionRecord[];
  onAddToCart: (listing: ProductListing, canonicalProduct: CanonicalProduct) => void;
  onUpdateCartQty: (listingId: string, delta: number) => void;
  onRemoveFromCart: (listingId: string) => void;
  onClearCart: () => void;
  onPlaceOrder: (
    customerName: string,
    customerEmail: string,
    address: string,
    paymentMethod?: string,
    idempotencyKey?: string
  ) => OrderRecord;
  onPaymentFailure?: (errorMsg: string, session: PaymentSession) => void;
  onUploadPrescription?: (prescription: PrescriptionRecord) => void;
  onNavigateToOrders: () => void;
}

export const CustomerMarketplace: React.FC<CustomerMarketplaceProps> = ({
  products,
  listings,
  cart,
  userProfile,
  activePrescriptions = SAMPLE_PRESCRIPTIONS,
  onAddToCart,
  onUpdateCartQty,
  onRemoveFromCart,
  onClearCart,
  onPlaceOrder,
  onPaymentFailure,
  onUploadPrescription,
  onNavigateToOrders,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDosage, setSelectedDosage] = useState<string>('all');
  const [prescriptionFilter, setPrescriptionFilter] = useState<'all' | 'otc' | 'rx'>('all');
  const [sortDimension, setSortDimension] = useState<'rank' | 'price' | 'trust' | 'stock'>('rank');

  // Side-by-side comparison state (FR-CORE-04)
  const [compareListingIds, setCompareListingIds] = useState<string[]>([]);
  const [isCompareModalOpen, setIsCompareModalOpen] = useState(false);

  // Selected product detail modal (Phase 1 FR-DISC-01 to 05)
  const [selectedDetailProduct, setSelectedDetailProduct] = useState<CanonicalProduct | null>(null);
  const [isProductDetailOpen, setIsProductDetailOpen] = useState(false);

  // Prescription modal state (Phase 1 FR-SEARCH-05, FR-CART-02)
  const [isPrescriptionModalOpen, setIsPrescriptionModalOpen] = useState(false);
  const [verifiedPrescription, setVerifiedPrescription] = useState<PrescriptionRecord | null>(
    activePrescriptions[0] || null
  );

  // Payment gateway modal state (Phase 1 FR-PAY-01 to 06)
  const [isPaymentGatewayOpen, setIsPaymentGatewayOpen] = useState(false);

  // Cart / Checkout Drawer state
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [checkoutStep, setCheckoutStep] = useState<'review' | 'revalidating' | 'confirmed'>('review');
  const [revalidationPassed, setRevalidationPassed] = useState(true);
  const [checkoutName, setCheckoutName] = useState(userProfile?.name || 'Aarav Sharma');
  const [checkoutEmail, setCheckoutEmail] = useState(userProfile?.email || 'aarav.sharma@example.com');
  const [checkoutAddress, setCheckoutAddress] = useState(
    userProfile?.addresses?.find(a => a.isDefault)?.street || 'Flat 402, Greenfield Residences, Sector 14'
  );
  const [lastPlacedOrder, setLastPlacedOrder] = useState<OrderRecord | null>(null);

  // Filtered & Ranked Listings
  const enrichedListings = useMemo(() => {
    return listings.map(listing => {
      const canonical = products.find(p => p.id === listing.productId) || products[0];
      return { listing, canonical };
    });
  }, [listings, products]);

  const filteredItems = useMemo(() => {
    return enrichedListings.filter(({ listing, canonical }) => {
      const q = searchQuery.toLowerCase().trim();
      const matchesQuery = !q ||
        canonical.canonicalName.toLowerCase().includes(q) ||
        canonical.genericSalt.toLowerCase().includes(q) ||
        canonical.commonBrandEquivalent.toLowerCase().includes(q) ||
        listing.partnerName.toLowerCase().includes(q);

      const matchesDosage = selectedDosage === 'all' || canonical.dosageForm.toLowerCase().includes(selectedDosage.toLowerCase());
      const matchesPrescription =
        prescriptionFilter === 'all' ||
        (prescriptionFilter === 'otc' && !canonical.prescriptionRequired) ||
        (prescriptionFilter === 'rx' && canonical.prescriptionRequired);

      return matchesQuery && matchesDosage && matchesPrescription;
    }).sort((a, b) => {
      if (sortDimension === 'price') {
        return a.listing.normalizedUnitPrice - b.listing.normalizedUnitPrice;
      }
      if (sortDimension === 'trust') {
        return b.listing.partnerRating - a.listing.partnerRating;
      }
      if (sortDimension === 'stock') {
        return b.listing.stockCount - a.listing.stockCount;
      }
      // default: multi-factor rankScore (FR-CORE-01)
      return (b.listing.rankScore || 0) - (a.listing.rankScore || 0);
    });
  }, [enrichedListings, searchQuery, selectedDosage, prescriptionFilter, sortDimension]);

  // Cart totals
  const cartSubtotal = cart.reduce((sum, item) => sum + (item.listing.packPrice * item.quantity), 0);
  const cartTotalSavings = cart.reduce((sum, item) => {
    const brandedCost = item.canonicalProduct.brandPriceRef * item.listing.packQuantity * item.quantity;
    const genericCost = item.listing.packPrice * item.quantity;
    return sum + Math.max(0, brandedCost - genericCost);
  }, 0);

  const toggleCompare = (listingId: string) => {
    if (compareListingIds.includes(listingId)) {
      setCompareListingIds(prev => prev.filter(id => id !== listingId));
    } else {
      if (compareListingIds.length >= 3) {
        alert('You can compare up to 3 options side-by-side.');
        return;
      }
      setCompareListingIds(prev => [...prev, listingId]);
    }
  };

  const handleStartCheckout = () => {
    setIsCheckoutOpen(true);
    setCheckoutStep('revalidating');
    // Simulate real-time stock & price revalidation (FR-CART-03)
    setTimeout(() => {
      setRevalidationPassed(true);
      setCheckoutStep('review');
    }, 700);
  };

  const handleConfirmPayment = () => {
    setCheckoutStep('payment');
    setTimeout(() => {
      const order = onPlaceOrder(checkoutName, checkoutEmail, checkoutAddress);
      setLastPlacedOrder(order);
      setCheckoutStep('confirmed');
    }, 900);
  };

  return (
    <div id="customer-marketplace-root" className="space-y-6">
      {/* Search & Requirement Capture Banner (FR-SEARCH-01) */}
      <div id="marketplace-search-banner" className="bg-white border border-zinc-200 rounded-xl p-6 shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
                <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                Requirement-Aware Discovery & Normalized Comparison
              </span>
              <span className="text-xs font-mono text-zinc-500 bg-zinc-100 px-2 py-0.5 rounded">
                FR-CORE-01 / FR-SEARCH-02
              </span>
            </div>
            <h2 className="text-2xl font-bold tracking-tight text-zinc-900">
              Generic Medicine Marketplace
            </h2>
            <p className="text-sm text-zinc-600">
              Search by active salt or branded medicine. Options are normalized by unit price (per tablet) and ranked transparently by price, trust, and availability.
            </p>
          </div>

          {/* Cart & Rx Trigger Buttons */}
          <div className="flex items-center gap-2.5 shrink-0">
            <button
              id="scan-rx-banner-btn"
              onClick={() => setIsPrescriptionModalOpen(true)}
              className="inline-flex items-center gap-2 px-3.5 py-2.5 rounded-xl border border-zinc-200 bg-white hover:bg-zinc-50 text-zinc-800 transition-colors shadow-xs text-xs font-semibold"
            >
              <FileText className="w-4 h-4 text-emerald-600" />
              <span>Upload Rx (AI)</span>
              {verifiedPrescription && (
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              )}
            </button>

            <button
              id="cart-view-trigger-btn"
              onClick={() => setIsCheckoutOpen(true)}
              className="inline-flex items-center gap-2.5 px-4 py-2.5 rounded-xl bg-zinc-900 text-white hover:bg-zinc-800 transition-colors shadow-xs"
            >
              <ShoppingCart className="w-4 h-4" />
              <span className="text-sm font-semibold">Cart ({cart.reduce((s, i) => s + i.quantity, 0)})</span>
              {cart.length > 0 && (
                <span className="text-xs font-mono bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-md">
                  ₹{cartSubtotal.toFixed(2)}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Search Input & Constraint Filters */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 pt-2">
          <div className="md:col-span-6 relative">
            <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              id="med-search-input"
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by salt (e.g. Paracetamol, Metformin) or brand (Crocin, Dolo, Lipitor)..."
              className="w-full pl-10 pr-4 py-2.5 text-sm rounded-lg border border-zinc-200 bg-zinc-50 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-zinc-900 text-zinc-900 placeholder:text-zinc-400 transition-all"
            />
          </div>

          <div className="md:col-span-2">
            <select
              id="dosage-filter-select"
              value={selectedDosage}
              onChange={(e) => setSelectedDosage(e.target.value)}
              className="w-full px-3 py-2.5 text-xs rounded-lg border border-zinc-200 bg-zinc-50 focus:bg-white text-zinc-800"
            >
              <option value="all">All Formulations</option>
              <option value="tablet">Oral Tablet</option>
              <option value="extended">Extended Release</option>
              <option value="coated">Film-Coated</option>
            </select>
          </div>

          <div className="md:col-span-2">
            <select
              id="prescription-filter-select"
              value={prescriptionFilter}
              onChange={(e) => setPrescriptionFilter(e.target.value as any)}
              className="w-full px-3 py-2.5 text-xs rounded-lg border border-zinc-200 bg-zinc-50 focus:bg-white text-zinc-800"
            >
              <option value="all">All Categories</option>
              <option value="otc">OTC Only (No Rx)</option>
              <option value="rx">Prescription Required</option>
            </select>
          </div>

          <div className="md:col-span-2">
            <select
              id="sort-dimension-select"
              value={sortDimension}
              onChange={(e) => setSortDimension(e.target.value as any)}
              className="w-full px-3 py-2.5 text-xs rounded-lg border border-zinc-200 bg-zinc-50 focus:bg-white text-zinc-800 font-medium"
            >
              <option value="rank">Sort: PRD Rank Score</option>
              <option value="price">Sort: Unit Price (Lowest)</option>
              <option value="trust">Sort: Partner Rating</option>
              <option value="stock">Sort: Stock Depth</option>
            </select>
          </div>
        </div>

        {/* Quick Requirement Chips */}
        <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
          <span className="text-zinc-500 font-medium">Quick Salt Queries:</span>
          {['Paracetamol 500mg', 'Metformin ER', 'Atorvastatin', 'Cetirizine', 'Amoxicillin'].map((pill) => (
            <button
              key={pill}
              onClick={() => setSearchQuery(pill.split(' ')[0])}
              className="px-2.5 py-1 rounded-full bg-zinc-100 hover:bg-zinc-200 text-zinc-700 transition-colors font-medium text-[11px]"
            >
              {pill}
            </button>
          ))}
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="text-xs text-rose-600 hover:underline ml-2"
            >
              Clear filter
            </button>
          )}
        </div>
      </div>

      {/* Compare Floating Bar (if items selected) */}
      {compareListingIds.length > 0 && (
        <div id="compare-floating-bar" className="p-4 rounded-xl bg-zinc-900 text-white flex flex-wrap items-center justify-between gap-4 shadow-lg sticky top-4 z-20">
          <div className="flex items-center gap-3">
            <Scale className="w-5 h-5 text-amber-400" />
            <div>
              <span className="text-sm font-semibold">
                Side-by-Side Comparison Selected ({compareListingIds.length} of 3)
              </span>
              <span className="text-xs text-zinc-300 block">
                Compare normalized tablet price, partner rating, and bio-equivalence factors.
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsCompareModalOpen(true)}
              className="px-4 py-2 text-xs font-semibold rounded-lg bg-emerald-500 hover:bg-emerald-600 text-zinc-950 transition-colors"
            >
              Open Comparison Matrix
            </button>
            <button
              onClick={() => setCompareListingIds([])}
              className="p-2 text-zinc-400 hover:text-white transition-colors"
              title="Clear comparison"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Listings Grid (FR-CORE-01, FR-CORE-02, FR-CORE-03) */}
      <div className="space-y-4">
        <div className="flex items-center justify-between text-xs text-zinc-500 px-1">
          <span>Showing {filteredItems.length} verified listings across partner pharmacies</span>
          <span className="font-mono">Ranking Model v1.4 Active</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredItems.map(({ listing, canonical }, idx) => {
            const isRankOne = idx === 0;
            const savingsPercent = Math.round(
              ((canonical.brandPriceRef - listing.normalizedUnitPrice) / canonical.brandPriceRef) * 100
            );
            const isSelectedForCompare = compareListingIds.includes(listing.id);

            return (
              <div
                key={listing.id}
                id={`listing-card-${listing.id}`}
                className={`bg-white border rounded-xl p-5 flex flex-col justify-between transition-all hover:shadow-md ${
                  isRankOne
                    ? 'border-emerald-500 ring-2 ring-emerald-500/10 shadow-xs'
                    : 'border-zinc-200'
                }`}
              >
                <div className="space-y-3.5">
                  {/* Ranking Badge & Header */}
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      {isRankOne ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          Rank #1 Recommended Option
                        </span>
                      ) : (
                        <span className="text-[11px] font-mono text-zinc-500 bg-zinc-100 px-2 py-0.5 rounded">
                          Rank #{idx + 1}
                        </span>
                      )}
                      <h3 className="text-base font-bold text-zinc-900 mt-1">
                        {canonical.canonicalName}
                      </h3>
                      <p className="text-xs text-zinc-500">
                        Generic Salt: <span className="font-medium text-zinc-800">{canonical.genericSalt}</span>
                      </p>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="text-xs font-mono font-bold text-emerald-700 bg-emerald-50 px-2 py-1 rounded border border-emerald-100 block">
                        {savingsPercent > 0 ? `${savingsPercent}% Off` : 'Best Value'}
                      </span>
                      <span className="text-[10px] text-zinc-400 block mt-0.5">vs {canonical.commonBrandEquivalent}</span>
                    </div>
                  </div>

                  {/* Normalized Price Comparison Card (FR-CORE-03) */}
                  <div className="p-3 rounded-lg bg-zinc-50 border border-zinc-100 space-y-1.5">
                    <div className="flex items-baseline justify-between">
                      <span className="text-xs text-zinc-500">Normalized Unit Price:</span>
                      <div className="text-right">
                        <span className="text-lg font-extrabold text-zinc-900 font-mono">
                          ₹{listing.normalizedUnitPrice.toFixed(2)}
                        </span>
                        <span className="text-xs text-zinc-500 font-normal"> / {listing.unitLabel}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-xs pt-1 border-t border-zinc-200/60 text-zinc-600">
                      <span>Pack Size ({listing.packQuantity} tabs):</span>
                      <span className="font-semibold text-zinc-800 font-mono">₹{listing.packPrice.toFixed(2)}</span>
                    </div>
                    <div className="flex items-center justify-between text-[11px] text-zinc-400">
                      <span>Branded Ref ({canonical.commonBrandEquivalent}):</span>
                      <span className="line-through font-mono">₹{(canonical.brandPriceRef * listing.packQuantity).toFixed(2)}</span>
                    </div>
                  </div>

                  {/* Partner & Availability */}
                  <div className="space-y-1.5 text-xs text-zinc-600">
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-zinc-900 flex items-center gap-1.5">
                        <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
                        {listing.partnerName}
                      </span>
                      <span className="inline-flex items-center gap-1 text-amber-600 font-semibold">
                        <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                        {listing.partnerRating}★
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-zinc-500">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-zinc-400" />
                        {listing.partnerLocation}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3 text-zinc-400" />
                        {listing.freshnessTimestamp}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-[11px] pt-1">
                      <span className="text-zinc-500">In Stock:</span>
                      <span className={`font-semibold ${listing.stockCount < 25 ? 'text-amber-600' : 'text-emerald-700'}`}>
                        {listing.stockCount} packs available
                      </span>
                    </div>
                  </div>

                  {/* Ranking Factor Explainability Box (FR-CORE-02) */}
                  {listing.rankFactors && (
                    <div className="p-2.5 rounded-lg bg-blue-50/50 border border-blue-100 text-[11px] text-blue-900 space-y-1">
                      <div className="font-semibold flex items-center gap-1">
                        <Sparkles className="w-3 h-3 text-blue-600" />
                        Explainable Ranking Factor:
                      </div>
                      <p className="text-blue-800 leading-snug">
                        {listing.rankFactors.explanation}
                      </p>
                    </div>
                  )}
                </div>

                {/* Card Action Controls */}
                <div className="pt-4 border-t border-zinc-100 mt-4 space-y-2">
                  <div className="flex items-center gap-2">
                    <button
                      id={`inspect-btn-${listing.id}`}
                      onClick={() => {
                        setSelectedDetailProduct(canonical);
                        setIsProductDetailOpen(true);
                      }}
                      className="flex-1 py-2 px-3 rounded-lg border border-zinc-200 text-xs font-medium text-zinc-700 hover:bg-zinc-50 transition-colors flex items-center justify-center gap-1.5"
                    >
                      <Eye className="w-3.5 h-3.5 text-zinc-500" />
                      Detail
                    </button>

                    <button
                      id={`compare-btn-${listing.id}`}
                      onClick={() => toggleCompare(listing.id)}
                      className={`py-2 px-3 rounded-lg border text-xs font-medium transition-colors flex items-center justify-center gap-1.5 ${
                        isSelectedForCompare
                          ? 'border-zinc-900 bg-zinc-900 text-white'
                          : 'border-zinc-200 text-zinc-700 hover:bg-zinc-50'
                      }`}
                    >
                      <Scale className="w-3.5 h-3.5" />
                      {isSelectedForCompare ? 'Compared' : 'Compare'}
                    </button>
                  </div>

                  <button
                    id={`add-to-cart-btn-${listing.id}`}
                    onClick={() => onAddToCart(listing, canonical)}
                    className="w-full py-2.5 px-4 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-white text-xs font-semibold transition-colors flex items-center justify-center gap-2 shadow-xs"
                  >
                    <ShoppingCart className="w-4 h-4" />
                    Add Pack to Cart • ₹{listing.packPrice.toFixed(2)}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {filteredItems.length === 0 && (
          <div className="text-center py-12 bg-white rounded-xl border border-zinc-200 p-8 space-y-3">
            <AlertTriangle className="w-8 h-8 text-amber-500 mx-auto" />
            <h3 className="text-base font-semibold text-zinc-900">No Eligible Generic Matches Found</h3>
            <p className="text-xs text-zinc-500 max-w-md mx-auto">
              Per PRD Section 10 (No-Match Flow), mandatory clinical constraints prevented a match. Try relaxing your dosage formulation filter or searching for another active ingredient.
            </p>
            <button
              onClick={() => { setSearchQuery(''); setSelectedDosage('all'); setPrescriptionFilter('all'); }}
              className="px-4 py-2 text-xs font-semibold rounded-lg bg-zinc-900 text-white"
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>

      {/* Side-by-Side Comparison Modal (FR-CORE-04) */}
      {isCompareModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-4xl w-full p-6 space-y-6 shadow-2xl border border-zinc-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-zinc-100 pb-4">
              <div className="flex items-center gap-2.5">
                <Scale className="w-5 h-5 text-emerald-600" />
                <h3 className="text-lg font-bold text-zinc-900">
                  Side-by-Side Generic Medicine Comparison Matrix (FR-CORE-04)
                </h3>
              </div>
              <button onClick={() => setIsCompareModalOpen(false)} className="p-1 rounded-lg text-zinc-400 hover:text-zinc-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left border border-zinc-200 rounded-lg">
                <thead className="bg-zinc-50 text-zinc-700 font-semibold border-b border-zinc-200">
                  <tr>
                    <th className="p-3.5 w-1/4">Comparison Factor</th>
                    {compareListingIds.map(id => {
                      const item = enrichedListings.find(e => e.listing.id === id);
                      return (
                        <th key={id} className="p-3.5 text-zinc-900 font-bold border-l border-zinc-200">
                          {item?.canonical.canonicalName}
                        </th>
                      );
                    })}
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-200 text-zinc-700">
                  <tr>
                    <td className="p-3.5 font-medium bg-zinc-50/50">Normalized Unit Price</td>
                    {compareListingIds.map(id => {
                      const item = enrichedListings.find(e => e.listing.id === id);
                      return (
                        <td key={id} className="p-3.5 border-l border-zinc-200 font-mono font-extrabold text-sm text-emerald-700">
                          ₹{item?.listing.normalizedUnitPrice.toFixed(2)} / tab
                        </td>
                      );
                    })}
                  </tr>
                  <tr>
                    <td className="p-3.5 font-medium bg-zinc-50/50">Pack Price & Quantity</td>
                    {compareListingIds.map(id => {
                      const item = enrichedListings.find(e => e.listing.id === id);
                      return (
                        <td key={id} className="p-3.5 border-l border-zinc-200">
                          ₹{item?.listing.packPrice.toFixed(2)} for {item?.listing.packQuantity} tablets
                        </td>
                      );
                    })}
                  </tr>
                  <tr>
                    <td className="p-3.5 font-medium bg-zinc-50/50">Fulfillment Partner</td>
                    {compareListingIds.map(id => {
                      const item = enrichedListings.find(e => e.listing.id === id);
                      return (
                        <td key={id} className="p-3.5 border-l border-zinc-200">
                          <div className="font-semibold text-zinc-900">{item?.listing.partnerName}</div>
                          <div className="text-[11px] text-zinc-500">{item?.listing.partnerLocation} ({item?.listing.partnerRating}★)</div>
                        </td>
                      );
                    })}
                  </tr>
                  <tr>
                    <td className="p-3.5 font-medium bg-zinc-50/50">Active Generic Salt</td>
                    {compareListingIds.map(id => {
                      const item = enrichedListings.find(e => e.listing.id === id);
                      return (
                        <td key={id} className="p-3.5 border-l border-zinc-200">
                          {item?.canonical.genericSalt}
                        </td>
                      );
                    })}
                  </tr>
                  <tr>
                    <td className="p-3.5 font-medium bg-zinc-50/50">Branded Equivalent MRP</td>
                    {compareListingIds.map(id => {
                      const item = enrichedListings.find(e => e.listing.id === id);
                      return (
                        <td key={id} className="p-3.5 border-l border-zinc-200">
                          {item?.canonical.commonBrandEquivalent} (~₹{item?.canonical.brandPriceRef.toFixed(2)}/tab)
                        </td>
                      );
                    })}
                  </tr>
                  <tr>
                    <td className="p-3.5 font-medium bg-zinc-50/50">Stock & Freshness SLA</td>
                    {compareListingIds.map(id => {
                      const item = enrichedListings.find(e => e.listing.id === id);
                      return (
                        <td key={id} className="p-3.5 border-l border-zinc-200 text-[11px]">
                          <span className="font-semibold text-zinc-800">{item?.listing.stockCount} in stock</span>
                          <span className="text-zinc-400 block">{item?.listing.freshnessTimestamp}</span>
                        </td>
                      );
                    })}
                  </tr>
                  <tr>
                    <td className="p-3.5 font-medium bg-zinc-50/50">Action</td>
                    {compareListingIds.map(id => {
                      const item = enrichedListings.find(e => e.listing.id === id);
                      if (!item) return null;
                      return (
                        <td key={id} className="p-3.5 border-l border-zinc-200">
                          <button
                            onClick={() => {
                              onAddToCart(item.listing, item.canonical);
                              setIsCompareModalOpen(false);
                            }}
                            className="w-full py-1.5 px-2.5 rounded bg-zinc-900 text-white font-semibold text-xs"
                          >
                            Add to Cart
                          </button>
                        </td>
                      );
                    })}
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Product Detail Modal (Phase 1 FR-DISC-01 to 05) */}
      <ProductDetailModal
        isOpen={isProductDetailOpen && !!selectedDetailProduct}
        onClose={() => {
          setIsProductDetailOpen(false);
          setSelectedDetailProduct(null);
        }}
        product={selectedDetailProduct || products[0]}
        listings={listings}
        onAddToCart={onAddToCart}
      />

      {/* Prescription Scanner Modal (Phase 1 FR-SEARCH-05, FR-CART-02) */}
      <PrescriptionScannerModal
        isOpen={isPrescriptionModalOpen}
        onClose={() => setIsPrescriptionModalOpen(false)}
        cartItems={cart}
        canonicalProduct={selectedDetailProduct || undefined}
        onPrescriptionVerified={(rx) => {
          setVerifiedPrescription(rx);
          if (onUploadPrescription) {
            onUploadPrescription(rx);
          }
        }}
      />

      {/* Payment Gateway Modal (Phase 1 FR-PAY-01 to 06) */}
      <PaymentGatewayModal
        isOpen={isPaymentGatewayOpen}
        onClose={() => setIsPaymentGatewayOpen(false)}
        amount={cartSubtotal}
        cartItems={cart}
        customerName={checkoutName}
        customerEmail={checkoutEmail}
        onPaymentSuccess={(session) => {
          const order = onPlaceOrder(
            checkoutName,
            checkoutEmail,
            checkoutAddress,
            session.provider,
            session.idempotencyKey
          );
          setLastPlacedOrder(order);
          setCheckoutStep('confirmed');
        }}
        onPaymentFailure={(errMsg, session) => {
          if (onPaymentFailure) {
            onPaymentFailure(errMsg, session);
          }
        }}
      />

      {/* Cart & Checkout Drawer (FR-CART-03, FR-PAY-01 to 05) */}
      {isCheckoutOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex justify-end">
          <div className="bg-white w-full max-w-md h-full shadow-2xl p-6 flex flex-col justify-between overflow-y-auto border-l border-zinc-200">
            <div className="space-y-5">
              <div className="flex items-center justify-between border-b border-zinc-100 pb-4">
                <div className="flex items-center gap-2">
                  <ShoppingCart className="w-5 h-5 text-zinc-900" />
                  <h3 className="text-lg font-bold text-zinc-900">Cart & Checkout</h3>
                </div>
                <button onClick={() => setIsCheckoutOpen(false)} className="p-1 rounded-lg text-zinc-400 hover:text-zinc-700">
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Checkout Progress Stepper */}
              <div className="flex items-center justify-between text-[11px] font-mono border-b border-zinc-100 pb-3">
                <span className={checkoutStep === 'review' ? 'font-bold text-zinc-900' : 'text-zinc-400'}>
                  1. Review Cart
                </span>
                <span className="text-zinc-300">→</span>
                <span className={checkoutStep === 'revalidating' ? 'font-bold text-blue-600' : 'text-zinc-400'}>
                  2. Stock Revalidation
                </span>
                <span className="text-zinc-300">→</span>
                <span className={checkoutStep === 'payment' ? 'font-bold text-amber-600' : 'text-zinc-400'}>
                  3. Verify Payment
                </span>
                <span className="text-zinc-300">→</span>
                <span className={checkoutStep === 'confirmed' ? 'font-bold text-emerald-600' : 'text-zinc-400'}>
                  4. Confirmed
                </span>
              </div>

              {/* Step 1: Cart Items Review */}
              {checkoutStep === 'review' && (
                <div className="space-y-4">
                  {cart.length === 0 ? (
                    <div className="text-center py-10 text-xs text-zinc-500 space-y-2">
                      <ShoppingCart className="w-8 h-8 text-zinc-300 mx-auto" />
                      <p>Your medicine cart is empty.</p>
                      <button
                        onClick={() => setIsCheckoutOpen(false)}
                        className="px-3 py-1.5 rounded bg-zinc-900 text-white font-medium text-xs"
                      >
                        Explore Marketplace
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {cart.map(item => (
                        <div key={item.listingId} className="p-3 rounded-lg border border-zinc-200 bg-zinc-50/50 space-y-2">
                          <div className="flex items-start justify-between">
                            <div>
                              <h4 className="text-xs font-bold text-zinc-900">{item.canonicalProduct.canonicalName}</h4>
                              <p className="text-[11px] text-zinc-500">{item.listing.partnerName}</p>
                            </div>
                            <span className="font-mono text-xs font-bold text-zinc-900">
                              ₹{(item.listing.packPrice * item.quantity).toFixed(2)}
                            </span>
                          </div>

                          <div className="flex items-center justify-between pt-1">
                            <div className="flex items-center gap-1.5">
                              <button
                                onClick={() => onUpdateCartQty(item.listingId, -1)}
                                className="w-6 h-6 rounded border border-zinc-200 bg-white flex items-center justify-center text-zinc-600 hover:bg-zinc-100"
                              >
                                <Minus className="w-3 h-3" />
                              </button>
                              <span className="w-6 text-center text-xs font-mono font-bold text-zinc-900">
                                {item.quantity}
                              </span>
                              <button
                                onClick={() => onUpdateCartQty(item.listingId, 1)}
                                className="w-6 h-6 rounded border border-zinc-200 bg-white flex items-center justify-center text-zinc-600 hover:bg-zinc-100"
                              >
                                <Plus className="w-3 h-3" />
                              </button>
                            </div>

                            <button
                              onClick={() => onRemoveFromCart(item.listingId)}
                              className="text-zinc-400 hover:text-rose-600 transition-colors p-1"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      ))}

                      {/* Customer Delivery Details Inputs */}
                      <div className="pt-2 border-t border-zinc-100 space-y-2.5 text-xs">
                        <span className="font-semibold text-zinc-900 block">Delivery Address & Recipient</span>
                        <div>
                          <label className="text-zinc-500 block mb-1">Full Name</label>
                          <input
                            type="text"
                            value={checkoutName}
                            onChange={(e) => setCheckoutName(e.target.value)}
                            className="w-full px-3 py-2 border rounded-lg border-zinc-200 bg-zinc-50 text-xs text-zinc-900"
                          />
                        </div>
                        <div>
                          <label className="text-zinc-500 block mb-1">Email for Tracking Alerts</label>
                          <input
                            type="email"
                            value={checkoutEmail}
                            onChange={(e) => setCheckoutEmail(e.target.value)}
                            className="w-full px-3 py-2 border rounded-lg border-zinc-200 bg-zinc-50 text-xs text-zinc-900"
                          />
                        </div>
                        <div>
                          <label className="text-zinc-500 block mb-1">Delivery Address</label>
                          <textarea
                            value={checkoutAddress}
                            onChange={(e) => setCheckoutAddress(e.target.value)}
                            rows={2}
                            className="w-full px-3 py-2 border rounded-lg border-zinc-200 bg-zinc-50 text-xs text-zinc-900 resize-none"
                          />
                        </div>

                        {/* Prescription Validation Gate (FR-CART-02) */}
                        {cart.some(i => i.canonicalProduct.prescriptionRequired) && (
                          <div className="p-3 rounded-xl border border-amber-200 bg-amber-50/50 space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="font-bold text-zinc-900 text-xs flex items-center gap-1.5">
                                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                                Prescription Compliance (FR-CART-02)
                              </span>
                              {verifiedPrescription ? (
                                <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full border border-emerald-300">
                                  <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                                  Validated
                                </span>
                              ) : (
                                <span className="text-[10px] font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-full">
                                  Prescription Required
                                </span>
                              )}
                            </div>

                            {verifiedPrescription ? (
                              <div className="p-2.5 rounded-lg bg-white border border-emerald-200 text-xs space-y-1">
                                <div className="flex justify-between items-center">
                                  <span className="font-bold text-zinc-900">{verifiedPrescription.doctorName}</span>
                                  <span className="text-[10px] font-mono text-zinc-500">{verifiedPrescription.doctorRegNumber}</span>
                                </div>
                                <p className="text-[11px] text-zinc-600">
                                  AI verified generic equivalence with {verifiedPrescription.confidenceScore}% confidence.
                                </p>
                                <button
                                  type="button"
                                  onClick={() => setIsPrescriptionModalOpen(true)}
                                  className="text-[11px] font-semibold text-emerald-700 hover:underline pt-0.5 block"
                                >
                                  Change / Re-scan Prescription &rarr;
                                </button>
                              </div>
                            ) : (
                              <div className="space-y-1.5">
                                <p className="text-[11px] text-amber-800">
                                  This cart contains Schedule H medicines requiring a verified prescription before payment.
                                </p>
                                <button
                                  type="button"
                                  onClick={() => setIsPrescriptionModalOpen(true)}
                                  className="w-full py-2 rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-semibold text-xs shadow-xs flex items-center justify-center gap-1.5 transition-colors"
                                >
                                  <Upload className="w-3.5 h-3.5" />
                                  Upload / Scan Prescription (AI)
                                </button>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Step 2: Revalidation Spinner */}
              {checkoutStep === 'revalidating' && (
                <div className="py-12 text-center space-y-3">
                  <RefreshCw className="w-8 h-8 text-blue-600 animate-spin mx-auto" />
                  <h4 className="text-sm font-semibold text-zinc-900">
                    Executing Checkout-Time Revalidation (FR-CART-03)
                  </h4>
                  <p className="text-xs text-zinc-500 max-w-xs mx-auto">
                    Verifying partner inventory locks and pricing freshness before initiating banking gateway...
                  </p>
                </div>
              )}

              {/* Step 3: Order Confirmed (CQMO) */}
              {checkoutStep === 'confirmed' && lastPlacedOrder && (
                <div className="py-6 text-center space-y-4">
                  <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                    <Check className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-xs font-mono font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      PRD North Star: CQMO Recorded
                    </span>
                    <h4 className="text-lg font-bold text-zinc-900 mt-2">
                      Order Confirmed & Paid
                    </h4>
                    <p className="text-xs font-mono text-zinc-600 mt-0.5">
                      Order ID: {lastPlacedOrder.id}
                    </p>
                  </div>

                  <div className="p-3 rounded-lg bg-zinc-50 border border-zinc-200 text-xs text-left space-y-1.5">
                    <div className="flex justify-between">
                      <span className="text-zinc-500">Status:</span>
                      <span className="font-semibold text-emerald-700">{lastPlacedOrder.status}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-zinc-500">Paid Amount:</span>
                      <span className="font-mono font-bold text-zinc-900">₹{lastPlacedOrder.totalAmount.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-zinc-500">Recipient:</span>
                      <span className="text-zinc-800">{lastPlacedOrder.customerName}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      setIsCheckoutOpen(false);
                      onNavigateToOrders();
                    }}
                    className="w-full py-2.5 rounded-lg bg-zinc-900 text-white font-semibold text-xs shadow-xs"
                  >
                    View Real-Time Order Tracking Timeline
                  </button>
                </div>
              )}
            </div>

            {/* Bottom Total & Step Controls */}
            {checkoutStep === 'review' && cart.length > 0 && (
              <div className="pt-4 border-t border-zinc-200 space-y-3">
                <div className="space-y-1.5 text-xs">
                  <div className="flex justify-between text-zinc-600">
                    <span>Generic Cart Subtotal:</span>
                    <span className="font-mono font-semibold text-zinc-900">₹{cartSubtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-emerald-700 font-medium">
                    <span>Estimated Branded Savings:</span>
                    <span className="font-mono font-bold">-₹{cartTotalSavings.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-zinc-500 text-[11px]">
                    <span>Standard Express Delivery:</span>
                    <span className="text-emerald-700 font-semibold">FREE</span>
                  </div>
                  <div className="flex justify-between text-sm font-bold text-zinc-900 pt-2 border-t border-zinc-100">
                    <span>Total Payable:</span>
                    <span className="font-mono text-base">₹{cartSubtotal.toFixed(2)}</span>
                  </div>
                </div>

                <button
                  id="checkout-pay-btn"
                  onClick={() => {
                    if (cart.some(i => i.canonicalProduct.prescriptionRequired) && !verifiedPrescription) {
                      setIsPrescriptionModalOpen(true);
                      return;
                    }
                    setIsPaymentGatewayOpen(true);
                  }}
                  className="w-full py-3 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-white font-semibold text-xs flex items-center justify-center gap-2 shadow-md transition-colors"
                >
                  <CreditCard className="w-4 h-4 text-emerald-400" />
                  Proceed to Secure Payment (₹{cartSubtotal.toFixed(2)})
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
