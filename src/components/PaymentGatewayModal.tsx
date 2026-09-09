import React, { useState } from 'react';
import { PaymentSession, PaymentMethodType, CartItem } from '../types';
import {
  X,
  CreditCard,
  QrCode,
  Building,
  Banknote,
  ShieldCheck,
  Lock,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  ArrowRight,
  Sparkles,
  Info
} from 'lucide-react';

interface PaymentGatewayModalProps {
  isOpen: boolean;
  onClose: () => void;
  amount: number;
  cartItems: CartItem[];
  customerName: string;
  customerEmail: string;
  onPaymentSuccess: (session: PaymentSession) => void;
  onPaymentFailure: (errorMsg: string, session: PaymentSession) => void;
}

export const PaymentGatewayModal: React.FC<PaymentGatewayModalProps> = ({
  isOpen,
  onClose,
  amount,
  cartItems,
  customerName,
  customerEmail,
  onPaymentSuccess,
  onPaymentFailure,
}) => {
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethodType>('upi');
  const [isProcessing, setIsProcessing] = useState(false);
  const [simulateFailure, setSimulateFailure] = useState(false);

  // UPI State
  const [upiId, setUpiId] = useState('aarav@okhdfcbank');
  const [upiProvider, setUpiProvider] = useState<'gpay' | 'phonepe' | 'paytm' | 'qr'>('qr');

  // Card State
  const [cardNumber, setCardNumber] = useState('4532 •••• •••• 8821');
  const [cardExpiry, setCardExpiry] = useState('08/29');
  const [cardCvv, setCardCvv] = useState('821');
  const [cardHolder, setCardHolder] = useState(customerName);

  // NetBanking State
  const [selectedBank, setSelectedBank] = useState('HDFC Bank');

  // Idempotency Key (PRD FR-PAY-03)
  const [idempotencyKey] = useState(`idemp-pay-${Math.floor(100000 + Math.random() * 900000)}`);

  if (!isOpen) return null;

  const handleExecutePayment = () => {
    setIsProcessing(true);

    const providerMap = {
      upi: 'Razorpay / UPI' as const,
      card: 'Stripe' as const,
      netbanking: 'Bank Direct' as const,
      cod: 'Cash on Delivery' as const
    };

    const session: PaymentSession = {
      idempotencyKey,
      transactionRef: `TXN-${Math.floor(10000000 + Math.random() * 90000000)}`,
      amount,
      currency: 'INR',
      method: selectedMethod,
      status: simulateFailure ? 'failed' : 'settled',
      provider: providerMap[selectedMethod],
      timestamp: new Date().toISOString(),
      gatewaySignature: `sig_sha256_${Math.random().toString(36).substring(2, 12)}`
    };

    setTimeout(() => {
      setIsProcessing(false);
      if (simulateFailure) {
        session.errorCode = 'BANK_TIMEOUT_OR_AUTH_DECLINE';
        session.errorMessage = 'Bank gateway rejected card verification or user cancelled OTP session.';
        onPaymentFailure('Payment Gateway Authorization Failed. Please try an alternate method.', session);
      } else {
        onPaymentSuccess(session);
        onClose();
      }
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-900/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl border border-zinc-200 shadow-2xl max-w-xl w-full overflow-hidden flex flex-col max-h-[92vh]">
        {/* Gateway Header Strip */}
        <div className="p-5 border-b border-zinc-100 flex items-center justify-between bg-zinc-50/70">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-zinc-900 text-white flex items-center justify-center shadow-xs">
              <Lock className="w-4 h-4 text-emerald-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-zinc-900">Secure Payment Checkout</h3>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                  FR-PAY-01
                </span>
              </div>
              <p className="text-xs font-mono text-zinc-500">
                Key: <strong className="text-zinc-700">{idempotencyKey}</strong>
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

        {/* Order Amount Banner */}
        <div className="p-4 bg-emerald-50/60 border-b border-emerald-100 flex items-center justify-between">
          <div>
            <span className="text-xs text-emerald-800 font-medium block">Total Payable for Medicines</span>
            <span className="text-xl font-bold font-mono text-zinc-900">₹{amount.toFixed(2)}</span>
          </div>
          <div className="text-right">
            <span className="text-[11px] text-zinc-500 block">Items in Basket</span>
            <span className="text-xs font-bold text-zinc-800">{cartItems.length} Generic Packs</span>
          </div>
        </div>

        {/* Body Content */}
        <div className="p-6 overflow-y-auto space-y-5 text-xs">
          {/* Method Tabs */}
          <div className="grid grid-cols-4 gap-2">
            {[
              { id: 'upi' as PaymentMethodType, label: 'UPI / QR', icon: QrCode },
              { id: 'card' as PaymentMethodType, label: 'Card', icon: CreditCard },
              { id: 'netbanking' as PaymentMethodType, label: 'NetBanking', icon: Building },
              { id: 'cod' as PaymentMethodType, label: 'Cash on Delivery', icon: Banknote },
            ].map(m => {
              const Icon = m.icon;
              const isSelected = selectedMethod === m.id;
              return (
                <button
                  key={m.id}
                  onClick={() => setSelectedMethod(m.id)}
                  className={`p-2.5 rounded-xl border flex flex-col items-center gap-1.5 transition-all ${
                    isSelected
                      ? 'border-emerald-600 bg-emerald-50/50 text-emerald-800 ring-1 ring-emerald-600 font-bold shadow-xs'
                      : 'border-zinc-200 bg-white text-zinc-600 hover:border-zinc-300'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isSelected ? 'text-emerald-600' : 'text-zinc-400'}`} />
                  <span className="text-[11px] text-center">{m.label}</span>
                </button>
              );
            })}
          </div>

          {/* Tab 1: UPI Payment */}
          {selectedMethod === 'upi' && (
            <div className="space-y-4 pt-1">
              <div className="flex gap-2">
                {[
                  { id: 'qr', label: 'Scan QR Code' },
                  { id: 'gpay', label: 'Google Pay' },
                  { id: 'phonepe', label: 'PhonePe' },
                  { id: 'paytm', label: 'Paytm / VPA' }
                ].map(u => (
                  <button
                    key={u.id}
                    onClick={() => setUpiProvider(u.id as any)}
                    className={`px-3 py-1.5 rounded-lg border text-xs font-semibold ${
                      upiProvider === u.id
                        ? 'border-emerald-600 bg-emerald-50 text-emerald-800'
                        : 'border-zinc-200 bg-white text-zinc-700'
                    }`}
                  >
                    {u.label}
                  </button>
                ))}
              </div>

              {upiProvider === 'qr' ? (
                <div className="p-4 rounded-xl border border-zinc-200 bg-zinc-50 text-center space-y-2">
                  <div className="w-32 h-32 mx-auto bg-white p-2 rounded-lg border border-zinc-300 flex items-center justify-center shadow-xs">
                    <div className="w-full h-full border-4 border-zinc-900 border-dashed rounded flex items-center justify-center font-mono text-[10px] text-zinc-600">
                      [UPI QR: ₹{amount.toFixed(2)}]
                    </div>
                  </div>
                  <p className="text-[11px] text-zinc-500">
                    Scan with any UPI app (GPay, PhonePe, Paytm, BHIM)
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  <label className="text-zinc-600 font-semibold block">Virtual Payment Address (VPA)</label>
                  <input
                    type="text"
                    value={upiId}
                    onChange={(e) => setUpiId(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-zinc-200 bg-zinc-50 focus:bg-white text-zinc-900 font-mono"
                  />
                </div>
              )}
            </div>
          )}

          {/* Tab 2: Card Payment */}
          {selectedMethod === 'card' && (
            <div className="space-y-3 pt-1">
              <div>
                <label className="text-zinc-600 font-semibold block mb-1">Card Number</label>
                <input
                  type="text"
                  value={cardNumber}
                  onChange={(e) => setCardNumber(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-zinc-200 bg-zinc-50 focus:bg-white text-zinc-900 font-mono"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-zinc-600 font-semibold block mb-1">Expiry (MM/YY)</label>
                  <input
                    type="text"
                    value={cardExpiry}
                    onChange={(e) => setCardExpiry(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-zinc-200 bg-zinc-50 focus:bg-white text-zinc-900 font-mono"
                  />
                </div>
                <div>
                  <label className="text-zinc-600 font-semibold block mb-1">CVV / Security Code</label>
                  <input
                    type="password"
                    maxLength={3}
                    value={cardCvv}
                    onChange={(e) => setCardCvv(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-zinc-200 bg-zinc-50 focus:bg-white text-zinc-900 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="text-zinc-600 font-semibold block mb-1">Cardholder Name</label>
                <input
                  type="text"
                  value={cardHolder}
                  onChange={(e) => setCardHolder(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-zinc-200 bg-zinc-50 focus:bg-white text-zinc-900"
                />
              </div>
            </div>
          )}

          {/* Tab 3: NetBanking */}
          {selectedMethod === 'netbanking' && (
            <div className="space-y-3 pt-1">
              <label className="text-zinc-600 font-semibold block">Select Your Banking Institution</label>
              <div className="grid grid-cols-2 gap-2">
                {['HDFC Bank', 'ICICI Bank', 'State Bank of India', 'Axis Bank', 'Kotak Mahindra', 'Punjab National Bank'].map(b => (
                  <button
                    key={b}
                    onClick={() => setSelectedBank(b)}
                    className={`p-2.5 rounded-lg border text-left text-xs font-semibold ${
                      selectedBank === b
                        ? 'border-emerald-600 bg-emerald-50 text-emerald-800'
                        : 'border-zinc-200 bg-white text-zinc-700'
                    }`}
                  >
                    {b}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Tab 4: Cash on Delivery */}
          {selectedMethod === 'cod' && (
            <div className="p-4 rounded-xl border border-zinc-200 bg-zinc-50 space-y-2">
              <div className="flex items-center gap-2 text-zinc-900 font-bold">
                <Banknote className="w-4 h-4 text-emerald-600" />
                Cash on Delivery Available
              </div>
              <p className="text-zinc-600 text-[11px] leading-relaxed">
                Pay in cash or UPI QR directly to the licensed courier partner upon doorstep medicine handover. Please keep exact change ready.
              </p>
            </div>
          )}

          {/* Test & Governance Toggle: Simulate Gateway Failure */}
          <div className="p-3 rounded-xl border border-zinc-200 bg-zinc-50 flex items-center justify-between">
            <div className="space-y-0.5">
              <span className="font-bold text-zinc-800 block text-xs">
                Simulate Gateway Failure (Testing Gate)
              </span>
              <span className="text-[11px] text-zinc-500">
                Tests PRD Section 11.3 payment error recovery and audit logging
              </span>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={simulateFailure}
                onChange={(e) => setSimulateFailure(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-9 h-5 bg-zinc-300 peer-focus:outline-hidden rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-zinc-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-rose-600"></div>
            </label>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-zinc-100 bg-zinc-50/70 flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-zinc-500 text-[11px]">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            PCI-DSS 3.2.1 Certified Encrypted Tokenization
          </div>

          <button
            id="gateway-confirm-payment-btn"
            onClick={handleExecutePayment}
            disabled={isProcessing}
            className={`px-5 py-2.5 rounded-xl font-semibold text-xs shadow-xs transition-colors flex items-center gap-2 ${
              simulateFailure
                ? 'bg-rose-600 hover:bg-rose-700 text-white'
                : 'bg-zinc-900 hover:bg-zinc-800 text-white'
            }`}
          >
            {isProcessing ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin text-emerald-400" />
                Settling Transaction...
              </>
            ) : (
              <>
                Pay ₹{amount.toFixed(2)}
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
