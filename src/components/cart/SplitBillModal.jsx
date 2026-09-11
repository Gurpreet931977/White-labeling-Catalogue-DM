import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  Users, 
  QrCode, 
  Check, 
  Copy, 
  Share2, 
  DollarSign, 
  ShieldCheck, 
  Receipt,
  ArrowRight
} from 'lucide-react';
import { generateQRCodeDataUrl, getUpiPaymentUrl } from '../../utils/qrCode';
import { BRAND_CONFIG } from '../../data/cafeConfig';
import { sounds } from '../../utils/audio';

export function SplitBillModal({ isOpen, onClose, grandTotal = 0, tableNumber = 8 }) {
  const [splitCount, setSplitCount] = useState(2);
  const [activeGuestIndex, setActiveGuestIndex] = useState(0);
  const [qrMap, setQrMap] = useState({});
  const [paidGuests, setPaidGuests] = useState({});
  const [copiedLink, setCopiedLink] = useState(false);

  // Exact split per guest
  const perGuestAmount = splitCount > 0 ? Math.ceil(grandTotal / splitCount) : grandTotal;

  useEffect(() => {
    if (!isOpen || grandTotal <= 0) return;

    // Generate QR for active guest
    const upiUrl = getUpiPaymentUrl(
      BRAND_CONFIG.billing.mockUpiId,
      BRAND_CONFIG.brandName,
      perGuestAmount,
      `Table ${tableNumber} Split Guest ${activeGuestIndex + 1}`
    );

    generateQRCodeDataUrl(upiUrl, {
      width: 320,
      margin: 1,
      darkColor: '#12100E',
      lightColor: '#FFFFFF'
    }).then(dataUrl => {
      setQrMap(prev => ({ ...prev, [activeGuestIndex]: dataUrl }));
    });
  }, [isOpen, grandTotal, splitCount, activeGuestIndex, tableNumber, perGuestAmount]);

  if (!isOpen) return null;

  const handleToggleGuestPaid = (idx) => {
    sounds.playClick();
    setPaidGuests(prev => ({
      ...prev,
      [idx]: !prev[idx]
    }));
  };

  const handleShareWhatsApp = () => {
    sounds.playClick();
    const text = `Velour Cafe & Bistro • Table ${tableNumber} Bill Split: Each guest's share is ₹${perGuestAmount} for ${splitCount} guests. Settle via UPI to ${BRAND_CONFIG.billing.mockUpiId}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
  };

  const allSettled = Object.keys(paidGuests).filter(k => paidGuests[k]).length === splitCount;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/80 backdrop-blur-md"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 16 }}
          transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full max-w-lg bg-[#141210] border border-[#C5A880]/30 rounded-3xl shadow-2xl text-[#FAF7F2] overflow-hidden z-10 my-8"
        >
          {/* Header */}
          <div className="px-6 py-5 border-b border-white/10 bg-[#0E0C0B] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-[#C5A880]/20 border border-[#C5A880]/40 flex items-center justify-center text-[#C5A880]">
                <Users className="w-4 h-4" />
              </div>
              <div>
                <p className="text-[10px] font-mono tracking-widest uppercase text-[#C5A880] font-bold">
                  Digital Bill Splitter
                </p>
                <h3 className="font-editorial text-lg font-bold text-white">
                  Equal Table Check Division
                </h3>
              </div>
            </div>

            <button
              onClick={() => { sounds.playClick(); onClose(); }}
              className="p-1.5 rounded-xl text-stone-400 hover:text-white hover:bg-white/10 transition cursor-pointer"
              aria-label="Close Split Modal"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="p-6 space-y-5 text-left">
            {/* Total Summary Strip */}
            <div className="p-4 rounded-2xl bg-[#1A1614] border border-white/10 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-stone-400">
                  Total Table Bill
                </span>
                <p className="font-editorial text-2xl font-bold text-white">
                  ₹{grandTotal.toFixed(2)}
                </p>
              </div>

              <div className="text-right">
                <span className="text-[10px] font-mono uppercase tracking-wider text-[#C5A880]">
                  Each Guest Pays
                </span>
                <p className="font-editorial text-2xl font-bold text-[#C5A880]">
                  ₹{perGuestAmount}
                </p>
              </div>
            </div>

            {/* Split Selector Pill Strip */}
            <div className="space-y-2">
              <label className="text-xs font-mono text-stone-300 block">
                Number of Seated Diners
              </label>
              <div className="grid grid-cols-5 gap-2">
                {[2, 3, 4, 5, 6].map((num) => (
                  <button
                    key={num}
                    onClick={() => {
                      sounds.playClick();
                      setSplitCount(num);
                      if (activeGuestIndex >= num) setActiveGuestIndex(0);
                    }}
                    className={`py-2 rounded-xl text-xs font-mono font-bold transition cursor-pointer border ${
                      splitCount === num
                        ? 'bg-[#C5A880] text-[#12100E] border-[#C5A880]'
                        : 'bg-white/5 border-white/10 text-stone-300 hover:bg-white/10'
                    }`}
                  >
                    {num} Guests
                  </button>
                ))}
              </div>
            </div>

            {/* Guest Tabs */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
              {Array.from({ length: splitCount }).map((_, idx) => {
                const isPaid = paidGuests[idx];
                const isActive = activeGuestIndex === idx;

                return (
                  <button
                    key={idx}
                    onClick={() => { sounds.playClick(); setActiveGuestIndex(idx); }}
                    className={`px-3 py-1.5 rounded-lg text-xs font-mono whitespace-nowrap transition cursor-pointer flex items-center gap-1.5 border ${
                      isActive
                        ? 'bg-white/15 border-[#C5A880] text-white font-bold'
                        : 'bg-white/5 border-white/10 text-stone-400 hover:text-white'
                    }`}
                  >
                    {isPaid ? <Check className="w-3 h-3 text-emerald-400" /> : null}
                    <span>Guest {idx + 1}</span>
                    <span className="text-[10px] text-[#C5A880]">₹{perGuestAmount}</span>
                  </button>
                );
              })}
            </div>

            {/* Active Guest QR Code Card */}
            <div className="p-4 rounded-2xl bg-[#0E0C0B] border border-white/10 flex flex-col sm:flex-row items-center gap-5">
              <div className="p-2 bg-white rounded-xl shadow-md shrink-0 w-36 h-36 flex items-center justify-center">
                {qrMap[activeGuestIndex] ? (
                  <img
                    src={qrMap[activeGuestIndex]}
                    alt={`Guest ${activeGuestIndex + 1} Payment QR`}
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <QrCode className="w-8 h-8 text-stone-600 animate-spin" />
                )}
              </div>

              <div className="space-y-3 flex-grow text-center sm:text-left">
                <div>
                  <div className="flex items-center justify-center sm:justify-start gap-2">
                    <span className="text-xs font-mono font-bold text-[#C5A880]">
                      GUEST {activeGuestIndex + 1} OF {splitCount}
                    </span>
                    {paidGuests[activeGuestIndex] && (
                      <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-mono font-bold">
                        Marked Paid
                      </span>
                    )}
                  </div>
                  <h4 className="font-editorial text-xl font-bold text-white mt-0.5">
                    Scan to Pay ₹{perGuestAmount}
                  </h4>
                  <p className="text-[11px] font-mono text-stone-400 mt-1">
                    Scan using Google Pay, PhonePe, Paytm, or any UPI banking app.
                  </p>
                </div>

                <div className="flex items-center justify-center sm:justify-start gap-2 pt-1">
                  <button
                    onClick={() => handleToggleGuestPaid(activeGuestIndex)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold flex items-center gap-1.5 transition cursor-pointer border ${
                      paidGuests[activeGuestIndex]
                        ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-300'
                        : 'bg-white/10 border-white/15 text-stone-300 hover:bg-white/15'
                    }`}
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>{paidGuests[activeGuestIndex] ? 'Settled' : 'Mark as Settled'}</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-mono">
              <button
                onClick={handleShareWhatsApp}
                className="w-full sm:w-auto px-4 py-2.5 rounded-xl border border-white/15 bg-white/5 hover:bg-white/10 text-stone-300 flex items-center justify-center gap-2 transition cursor-pointer"
              >
                <Share2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Share Split via WhatsApp</span>
              </button>

              <button
                onClick={() => { sounds.playClick(); onClose(); }}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-[#C5A880] hover:bg-[#B89358] text-[#12100E] font-bold flex items-center justify-center gap-2 transition cursor-pointer"
              >
                <span>Done</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
