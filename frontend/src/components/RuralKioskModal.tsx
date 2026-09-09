import React, { useState } from 'react';
import { JanAushadhiKioskSession } from '../types';
import { SAMPLE_KIOSK_CONFIG } from '../data/genericMedData';
import {
  Store,
  Wifi,
  WifiOff,
  RefreshCw,
  Plus,
  Trash2,
  CheckCircle2,
  Receipt,
  ShoppingCart,
  X,
  CreditCard,
  IndianRupee,
  Barcode,
  Search,
  Sparkles
} from 'lucide-react';

interface RuralKioskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSyncOfflineQueue: (queueCount: number) => void;
}

export const RuralKioskModal: React.FC<RuralKioskModalProps> = ({
  isOpen,
  onClose,
  onSyncOfflineQueue
}) => {
  const [kioskSession, setKioskSession] = useState<JanAushadhiKioskSession>(SAMPLE_KIOSK_CONFIG);
  const [isOfflineMode, setIsOfflineMode] = useState(kioskSession.isOffline);
  const [searchQuery, setSearchQuery] = useState('');
  const [posCart, setPosCart] = useState<Array<{ id: string; name: string; price: number; qty: number }>>([
    { id: 'pos-1', name: 'Paracetamol IP 500mg (10 tabs strip)', price: 5.50, qty: 2 }
  ]);
  const [isSyncing, setIsSyncing] = useState(false);

  if (!isOpen) return null;

  const subsidizedCatalog = [
    { id: 'sub-1', name: 'Paracetamol IP 500mg (10 tabs)', salt: 'Paracetamol', price: 5.50, brandRef: 32.00 },
    { id: 'sub-2', name: 'Metformin Hydrochloride ER 500mg (20 tabs)', salt: 'Metformin', price: 14.50, brandRef: 84.00 },
    { id: 'sub-3', name: 'Atorvastatin IP 10mg (10 tabs)', salt: 'Atorvastatin', price: 18.00, brandRef: 98.00 },
    { id: 'sub-4', name: 'Oral Rehydration Salts (ORS) IP 21.8g sachet', salt: 'ORS Salts', price: 4.20, brandRef: 24.00 },
    { id: 'sub-5', name: 'Cetirizine Dihydrochloride 10mg (10 tabs)', salt: 'Cetirizine', price: 4.00, brandRef: 38.00 }
  ];

  const filteredCatalog = subsidizedCatalog.filter(
    item => item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.salt.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const cartTotal = posCart.reduce((sum, item) => sum + item.price * item.qty, 0);

  const handleAddItem = (item: typeof subsidizedCatalog[0]) => {
    setPosCart(prev => {
      const exists = prev.find(p => p.id === item.id);
      if (exists) {
        return prev.map(p => p.id === item.id ? { ...p, qty: p.qty + 1 } : p);
      }
      return [...prev, { id: item.id, name: item.name, price: item.price, qty: 1 }];
    });
  };

  const handleCompleteSale = () => {
    if (posCart.length === 0) return;

    if (isOfflineMode) {
      // Add to offline pending sync queue
      const newTx = {
        transactionId: `TX-OFFLINE-${Date.now().toString().slice(-4)}`,
        medicineName: posCart.map(p => p.name).join(', '),
        packQty: posCart.reduce((s, i) => s + i.qty, 0),
        amount: cartTotal,
        timestamp: 'Just now'
      };

      setKioskSession(prev => ({
        ...prev,
        pendingSyncQueue: [newTx, ...prev.pendingSyncQueue],
        todaySubsidizedSavingsINR: prev.todaySubsidizedSavingsINR + Math.round(cartTotal * 2.5)
      }));
      alert(`[Offline Mode] Sale recorded in local Kendra SQLite memory. Total: ₹${cartTotal.toFixed(2)}. Will reconcile when online.`);
    } else {
      alert(`[Online Mode] Sale reconciled instantly to central genericMed ledger. Receipt printed.`);
    }

    setPosCart([]);
  };

  const handleTriggerSync = () => {
    setIsSyncing(true);
    setTimeout(() => {
      const count = kioskSession.pendingSyncQueue.length;
      onSyncOfflineQueue(count);
      setKioskSession(prev => ({
        ...prev,
        pendingSyncQueue: []
      }));
      setIsSyncing(false);
      alert(`Successfully synchronized ${count} offline transactions to national database.`);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white border border-zinc-200 rounded-3xl w-full max-w-4xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 my-8">
        {/* Header Strip */}
        <div className="bg-linear-to-r from-emerald-800 to-green-950 text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-white/15 backdrop-blur-md flex items-center justify-center border border-white/20">
              <Store className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] uppercase tracking-wider font-semibold bg-white/20 px-2 py-0.5 rounded font-mono">
                  {kioskSession.kendraCode}
                </span>
                <span className="text-xs text-emerald-200">Pradhan Mantri Bhartiya Janaushadhi Pariyojana</span>
              </div>
              <h2 className="text-lg font-bold">Rural Kendra POS & Offline Sync Terminal</h2>
            </div>
          </div>

          {/* Offline/Online toggle */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsOfflineMode(!isOfflineMode)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
                isOfflineMode
                  ? 'bg-amber-500 text-zinc-950 shadow-xs'
                  : 'bg-emerald-600 text-white'
              }`}
            >
              {isOfflineMode ? <WifiOff className="w-3.5 h-3.5" /> : <Wifi className="w-3.5 h-3.5" />}
              <span>{isOfflineMode ? 'Kiosk: Offline Mode' : 'Kiosk: Online Live'}</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Medicine Catalog (Subsidized flat pricing) */}
          <div className="lg:col-span-7 space-y-4">
            <div className="relative">
              <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search PMBJP generic inventory or scan barcode..."
                className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-zinc-200 bg-zinc-50 focus:bg-white"
              />
            </div>

            <div className="space-y-2.5 max-h-[420px] overflow-y-auto pr-1">
              {filteredCatalog.map((item) => (
                <div
                  key={item.id}
                  className="p-3.5 rounded-xl border border-zinc-200 hover:border-emerald-300 hover:bg-emerald-50/20 transition-all flex items-center justify-between text-xs"
                >
                  <div className="space-y-0.5">
                    <h4 className="font-bold text-zinc-900">{item.name}</h4>
                    <p className="text-[11px] text-zinc-500">Salt: {item.salt}</p>
                    <span className="text-[10px] text-emerald-700 font-semibold">
                      Branded MRP Ref: ₹{item.brandRef.toFixed(2)}
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-sm font-bold text-emerald-700 font-mono">
                      ₹{item.price.toFixed(2)}
                    </span>
                    <button
                      onClick={() => handleAddItem(item)}
                      className="p-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold transition-all shadow-xs"
                      title="Add to Counter Ticket"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Counter Register Ticket */}
          <div className="lg:col-span-5 bg-zinc-50 rounded-2xl border border-zinc-200 p-4 space-y-4 flex flex-col">
            <div className="flex items-center justify-between border-b border-zinc-200 pb-2.5">
              <div className="flex items-center gap-2 text-xs font-bold text-zinc-900">
                <Receipt className="w-4 h-4 text-emerald-700" />
                <span>Counter Ticket (#{Math.floor(1000 + Math.random() * 9000)})</span>
              </div>
              <span className="text-[10px] text-zinc-400 font-mono">Kendra In-Charge: {kioskSession.operatorName.split(',')[0]}</span>
            </div>

            {/* Ticket Line Items */}
            <div className="flex-1 space-y-2 max-h-[220px] overflow-y-auto pr-1">
              {posCart.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between p-2 rounded-lg bg-white border border-zinc-200 text-xs"
                >
                  <div className="flex-1 min-w-0 pr-2">
                    <p className="font-semibold text-zinc-900 truncate">{item.name}</p>
                    <p className="text-[10px] text-zinc-500">Qty: {item.qty} × ₹{item.price.toFixed(2)}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-zinc-900">
                      ₹{(item.price * item.qty).toFixed(2)}
                    </span>
                    <button
                      onClick={() => setPosCart(prev => prev.filter(p => p.id !== item.id))}
                      className="text-zinc-400 hover:text-red-600"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
              {posCart.length === 0 && (
                <div className="text-center py-8 text-xs text-zinc-400">
                  No medicines added to counter ticket.
                </div>
              )}
            </div>

            {/* Ticket Totals & Checkout */}
            <div className="border-t border-zinc-200 pt-3 space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="font-bold text-zinc-700">Total Payable:</span>
                <span className="text-base font-bold text-emerald-700 font-mono">₹{cartTotal.toFixed(2)}</span>
              </div>

              <button
                onClick={handleCompleteSale}
                disabled={posCart.length === 0}
                className="w-full py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 disabled:opacity-50 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-sm transition-all"
              >
                <CreditCard className="w-4 h-4" />
                {isOfflineMode ? 'Record Cash Sale (Offline Queue)' : 'Confirm Cash & Print Receipt'}
              </button>
            </div>

            {/* Pending Sync Queue status banner */}
            <div className="p-3 rounded-xl bg-white border border-zinc-200 text-xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] text-zinc-500">Offline Pending Queue</span>
                <span className="font-mono font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded">
                  {kioskSession.pendingSyncQueue.length} sales pending
                </span>
              </div>

              {kioskSession.pendingSyncQueue.length > 0 && (
                <button
                  onClick={handleTriggerSync}
                  disabled={isSyncing}
                  className="w-full py-1.5 rounded-lg border border-emerald-300 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
                  {isSyncing ? 'Reconciling Ledger...' : 'Sync Offline Transactions Now'}
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-zinc-50 border-t border-zinc-200 flex items-center justify-between text-xs text-zinc-500">
          <span>Subsidized Government Pricing Enforced • Low-Bandwidth Optimised</span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-zinc-900 text-white font-medium hover:bg-zinc-800 transition-colors"
          >
            Exit Kiosk POS
          </button>
        </div>
      </div>
    </div>
  );
};
