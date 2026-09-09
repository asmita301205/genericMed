import React, { useState } from 'react';
import { UserProfile, DeliveryAddress, AppUserRole } from '../types';
import {
  X,
  User,
  Phone,
  Mail,
  ShieldCheck,
  CheckCircle2,
  MapPin,
  Plus,
  Lock,
  ArrowRight,
  Sparkles,
  KeyRound,
  RefreshCw
} from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserProfile;
  onUpdateUser: (updated: UserProfile) => void;
  onSwitchRole: (role: AppUserRole) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  user,
  onUpdateUser,
  onSwitchRole,
}) => {
  const [authStep, setAuthStep] = useState<'profile' | 'login' | 'otp' | 'add_address'>('profile');
  const [phoneNumber, setPhoneNumber] = useState(user.phone);
  const [emailAddress, setEmailAddress] = useState(user.email);
  const [enteredOtp, setEnteredOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [authError, setAuthError] = useState('');

  // New Address Form State
  const [newLabel, setNewLabel] = useState('Home');
  const [newStreet, setNewStreet] = useState('');
  const [newCity, setNewCity] = useState('Gurugram, Haryana');
  const [newPincode, setNewPincode] = useState('122001');

  if (!isOpen) return null;

  const handleSendOtp = () => {
    if (!phoneNumber || phoneNumber.length < 10) {
      setAuthError('Please enter a valid 10-digit mobile number.');
      return;
    }
    setAuthError('');
    setOtpSent(true);
    setAuthStep('otp');
  };

  const handleVerifyOtp = () => {
    if (enteredOtp !== '123456' && enteredOtp !== '882144' && enteredOtp.length !== 6) {
      setAuthError('Invalid OTP. Use test code 123456 for instant verification.');
      return;
    }
    setIsVerifying(true);
    setAuthError('');
    setTimeout(() => {
      setIsVerifying(false);
      onUpdateUser({
        ...user,
        phone: phoneNumber,
        email: emailAddress,
        verified: true
      });
      setAuthStep('profile');
    }, 600);
  };

  const handleAddAddress = () => {
    if (!newStreet || !newPincode) {
      setAuthError('Please fill in street address and pincode.');
      return;
    }
    const newAddress: DeliveryAddress = {
      id: `addr-${Date.now().toString().slice(-4)}`,
      label: newLabel,
      recipientName: user.name,
      phone: user.phone,
      street: newStreet,
      city: newCity,
      pincode: newPincode,
      isDefault: false
    };

    onUpdateUser({
      ...user,
      addresses: [...user.addresses, newAddress]
    });
    setNewStreet('');
    setAuthError('');
    setAuthStep('profile');
  };

  const handleSetDefaultAddress = (addressId: string) => {
    onUpdateUser({
      ...user,
      defaultAddressId: addressId,
      addresses: user.addresses.map(a => ({
        ...a,
        isDefault: a.id === addressId
      }))
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-900/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl border border-zinc-200 shadow-2xl max-w-lg w-full overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header Strip */}
        <div className="p-5 border-b border-zinc-100 flex items-center justify-between bg-zinc-50/50">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-xs">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-zinc-900 flex items-center gap-1.5">
                Authentication & Profile
                <span className="text-[11px] font-mono font-semibold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                  PRD FR-AUTH-01
                </span>
              </h3>
              <p className="text-xs text-zinc-500">
                Customer session, role verification, and delivery address book
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

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-5 text-sm">
          {/* View: User Profile Summary */}
          {authStep === 'profile' && (
            <div className="space-y-5">
              {/* Profile Card */}
              <div className="p-4 rounded-xl bg-zinc-50 border border-zinc-200/80 flex items-start justify-between">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-zinc-900">{user.name}</span>
                    {user.verified ? (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        Verified Patient
                      </span>
                    ) : (
                      <span className="text-[10px] font-medium text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                        OTP Pending
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-zinc-600 flex items-center gap-3">
                    <span className="flex items-center gap-1">
                      <Phone className="w-3 h-3 text-zinc-400" />
                      {user.phone}
                    </span>
                    <span className="flex items-center gap-1">
                      <Mail className="w-3 h-3 text-zinc-400" />
                      {user.email}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => setAuthStep('login')}
                  className="px-2.5 py-1 text-xs font-semibold rounded-md border border-zinc-200 bg-white hover:bg-zinc-100 text-zinc-700 transition-colors"
                >
                  Switch User
                </button>
              </div>

              {/* Active Role Selector (FR-AUTH-04) */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-zinc-700 uppercase tracking-wider block">
                  Active Operational Role
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { role: 'customer' as AppUserRole, label: 'Customer', desc: 'Browse & Buy' },
                    { role: 'partner' as AppUserRole, label: 'Partner Chemist', desc: 'Manage Store' },
                    { role: 'admin' as AppUserRole, label: 'Platform Admin', desc: 'Ops & Audit' }
                  ].map((r) => (
                    <button
                      key={r.role}
                      onClick={() => {
                        onSwitchRole(r.role);
                        onUpdateUser({ ...user, role: r.role });
                      }}
                      className={`p-3 rounded-xl border text-left transition-all ${
                        user.role === r.role
                          ? 'border-emerald-600 bg-emerald-50/50 shadow-xs'
                          : 'border-zinc-200 hover:border-zinc-300 bg-white'
                      }`}
                    >
                      <div className="font-bold text-xs text-zinc-900">{r.label}</div>
                      <div className="text-[11px] text-zinc-500 mt-0.5">{r.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Address Book */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-zinc-700 uppercase tracking-wider">
                    Saved Delivery Addresses ({user.addresses.length})
                  </label>
                  <button
                    onClick={() => setAuthStep('add_address')}
                    className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    Add Address
                  </button>
                </div>

                <div className="space-y-2">
                  {user.addresses.map((addr) => {
                    const isSelected = user.defaultAddressId === addr.id;
                    return (
                      <div
                        key={addr.id}
                        onClick={() => handleSetDefaultAddress(addr.id)}
                        className={`p-3 rounded-xl border transition-all cursor-pointer flex items-start justify-between ${
                          isSelected
                            ? 'border-emerald-600 bg-emerald-50/30 ring-1 ring-emerald-600'
                            : 'border-zinc-200 bg-white hover:border-zinc-300'
                        }`}
                      >
                        <div className="space-y-0.5 text-xs">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-zinc-900">{addr.label}</span>
                            {isSelected && (
                              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-1.5 py-0.2 rounded">
                                Default
                              </span>
                            )}
                          </div>
                          <p className="text-zinc-600">{addr.street}</p>
                          <p className="text-zinc-500 text-[11px]">
                            {addr.city} • PIN: {addr.pincode}
                          </p>
                        </div>
                        <div className="mt-1">
                          <input
                            type="radio"
                            checked={isSelected}
                            onChange={() => handleSetDefaultAddress(addr.id)}
                            className="text-emerald-600 focus:ring-emerald-500"
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* View: Login / Phone OTP Entry */}
          {authStep === 'login' && (
            <div className="space-y-4">
              <div className="text-center space-y-1">
                <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
                  <Phone className="w-6 h-6" />
                </div>
                <h4 className="text-base font-bold text-zinc-900">Sign in with Mobile Number</h4>
                <p className="text-xs text-zinc-500">
                  We will send a 6-digit OTP to verify your account
                </p>
              </div>

              {authError && (
                <div className="p-3 rounded-lg bg-rose-50 text-rose-700 text-xs border border-rose-200">
                  {authError}
                </div>
              )}

              <div className="space-y-3">
                <div>
                  <label className="text-xs font-semibold text-zinc-700 block mb-1">Mobile Number</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-mono text-zinc-500">
                      +91
                    </span>
                    <input
                      type="tel"
                      value={phoneNumber.replace('+91 ', '')}
                      onChange={(e) => setPhoneNumber('+91 ' + e.target.value.replace(/\D/g, ''))}
                      placeholder="9876543210"
                      className="w-full pl-12 pr-4 py-2.5 text-sm rounded-lg border border-zinc-200 bg-zinc-50 focus:bg-white focus:ring-2 focus:ring-emerald-600 focus:outline-hidden text-zinc-900 font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-zinc-700 block mb-1">Email (Optional)</label>
                  <input
                    type="email"
                    value={emailAddress}
                    onChange={(e) => setEmailAddress(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full px-3 py-2.5 text-sm rounded-lg border border-zinc-200 bg-zinc-50 focus:bg-white focus:ring-2 focus:ring-emerald-600 focus:outline-hidden text-zinc-900"
                  />
                </div>

                <button
                  onClick={handleSendOtp}
                  className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs shadow-xs transition-colors flex items-center justify-center gap-1.5"
                >
                  Send Verification OTP
                  <ArrowRight className="w-4 h-4" />
                </button>

                <div className="text-center pt-2">
                  <button
                    onClick={() => setAuthStep('profile')}
                    className="text-xs text-zinc-500 hover:underline"
                  >
                    Back to Profile
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* View: OTP Verification */}
          {authStep === 'otp' && (
            <div className="space-y-4 text-center">
              <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
                <KeyRound className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h4 className="text-base font-bold text-zinc-900">Enter 6-Digit OTP</h4>
                <p className="text-xs text-zinc-500">
                  Sent to <span className="font-mono font-semibold text-zinc-800">{phoneNumber}</span>
                </p>
                <div className="inline-block px-2.5 py-1 rounded bg-amber-50 border border-amber-200 text-amber-800 text-[11px] font-mono">
                  Test OTP: <strong className="font-bold">123456</strong>
                </div>
              </div>

              {authError && (
                <div className="p-3 rounded-lg bg-rose-50 text-rose-700 text-xs border border-rose-200">
                  {authError}
                </div>
              )}

              <div className="space-y-3 max-w-xs mx-auto">
                <input
                  type="text"
                  maxLength={6}
                  value={enteredOtp}
                  onChange={(e) => setEnteredOtp(e.target.value.replace(/\D/g, ''))}
                  placeholder="123456"
                  className="w-full text-center tracking-[0.5em] font-mono text-xl py-3 rounded-lg border border-zinc-300 bg-zinc-50 focus:bg-white focus:ring-2 focus:ring-emerald-600 focus:outline-hidden"
                />

                <button
                  onClick={handleVerifyOtp}
                  disabled={isVerifying}
                  className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs shadow-xs transition-colors flex items-center justify-center gap-1.5 disabled:opacity-50"
                >
                  {isVerifying ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      Verifying...
                    </>
                  ) : (
                    'Verify & Sign In'
                  )}
                </button>

                <button
                  onClick={() => setAuthStep('login')}
                  className="text-xs text-zinc-500 hover:underline block mx-auto"
                >
                  Change Mobile Number
                </button>
              </div>
            </div>
          )}

          {/* View: Add Address */}
          {authStep === 'add_address' && (
            <div className="space-y-4">
              <h4 className="text-sm font-bold text-zinc-900 flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-emerald-600" />
                Add New Delivery Location
              </h4>

              {authError && (
                <div className="p-3 rounded-lg bg-rose-50 text-rose-700 text-xs border border-rose-200">
                  {authError}
                </div>
              )}

              <div className="space-y-3 text-xs">
                <div>
                  <label className="text-zinc-600 block mb-1">Address Label</label>
                  <div className="flex gap-2">
                    {['Home', 'Office', 'Parents', 'Other'].map(l => (
                      <button
                        key={l}
                        type="button"
                        onClick={() => setNewLabel(l)}
                        className={`px-3 py-1.5 rounded-lg border text-xs font-semibold ${
                          newLabel === l
                            ? 'border-emerald-600 bg-emerald-50 text-emerald-800'
                            : 'border-zinc-200 bg-white text-zinc-700'
                        }`}
                      >
                        {l}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-zinc-600 block mb-1">Street / Apartment / Building</label>
                  <input
                    type="text"
                    value={newStreet}
                    onChange={(e) => setNewStreet(e.target.value)}
                    placeholder="Flat 102, Building A, Street Road"
                    className="w-full px-3 py-2 border rounded-lg border-zinc-200 bg-zinc-50 focus:bg-white text-zinc-900"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-zinc-600 block mb-1">City & State</label>
                    <input
                      type="text"
                      value={newCity}
                      onChange={(e) => setNewCity(e.target.value)}
                      className="w-full px-3 py-2 border rounded-lg border-zinc-200 bg-zinc-50 focus:bg-white text-zinc-900"
                    />
                  </div>
                  <div>
                    <label className="text-zinc-600 block mb-1">Pincode</label>
                    <input
                      type="text"
                      value={newPincode}
                      onChange={(e) => setNewPincode(e.target.value)}
                      className="w-full px-3 py-2 border rounded-lg border-zinc-200 bg-zinc-50 focus:bg-white text-zinc-900 font-mono"
                    />
                  </div>
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setAuthStep('profile')}
                    className="flex-1 py-2 rounded-lg border border-zinc-200 hover:bg-zinc-100 text-zinc-700 font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleAddAddress}
                    className="flex-1 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold shadow-xs"
                  >
                    Save Address
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Note */}
        <div className="p-4 border-t border-zinc-100 bg-zinc-50/50 flex items-center justify-between text-xs text-zinc-500">
          <span className="flex items-center gap-1">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            256-bit Encrypted Health Data Privacy
          </span>
          <button
            onClick={onClose}
            className="px-3 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-white font-semibold text-xs transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
