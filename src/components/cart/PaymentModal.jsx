import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  CreditCard, 
  QrCode, 
  CheckCircle2, 
  ShieldCheck, 
  Smartphone, 
  Receipt, 
  Loader2,
  Award,
  ArrowRight,
  Copy,
  Check,
  ExternalLink,
  AlertTriangle,
  Banknote,
  ShieldAlert,
  Store,
  Zap
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useCart } from '../../context/CartContext';
import { useOrder } from '../../context/OrderContext';
import { useTheme } from '../../context/ThemeContext';
import { CAFE_CONFIG, BRAND_CONFIG } from '../../data/cafeConfig';
import { sounds } from '../../utils/audio';
import { processBillingTransaction } from '../../utils/loyaltyStorage';
import { generateQRCodeDataUrl, getUpiPaymentUrl } from '../../utils/qrCode';

export function PaymentModal({ isOpen, onClose, onOrderPlacedSuccess }) {
  const { 
    cart, 
    grandTotal, 
    subtotal, 
    discountAmount, 
    gstAmount, 
    tipAmount, 
    activeTable, 
    diningMode, 
    customerName, 
    customerPhone, 
    operationalModel,
    deliveryAddress,
    deliveryNotes,
    deliveryFee,
    loyaltyVisits,
    incrementLoyaltyVisit,
    clearCart 
  } = useCart();

  const { placeOrder } = useOrder();
  const { isLight } = useTheme();

  const [paymentType, setPaymentType] = useState('online'); // 'online' | 'counter'
  const [isProcessing, setIsProcessing] = useState(false);
  const [upiQrDataUrl, setUpiQrDataUrl] = useState('');
  const [isUpiLoading, setIsUpiLoading] = useState(false);
  const [copiedUpi, setCopiedUpi] = useState(false);
  const [showCounterConfirmation, setShowCounterConfirmation] = useState(false);
  const [counterAcknowledged, setCounterAcknowledged] = useState(false);

  // Generate authentic NPCI UPI payment deep link and scannable QR
  const upiId = CAFE_CONFIG.mockUpiId || 'thccafe@icici';
  const upiPayee = BRAND_CONFIG.brandName || 'THC Cafe and Bistro';
  const orderNote = diningMode === 'table' ? `Table ${activeTable || '01'} Bill` : 'THC Cafe Order';
  const upiPaymentUrl = getUpiPaymentUrl(upiId, upiPayee, grandTotal, orderNote);

  useEffect(() => {
    if (!isOpen || paymentType !== 'online') return;
    let active = true;
    setIsUpiLoading(true);

    generateQRCodeDataUrl(upiPaymentUrl, {
      width: 260,
      margin: 1,
      color: {
        dark: '#12100E',
        light: '#FFFFFF'
      }
    })
      .then((dataUrl) => {
        if (active) setUpiQrDataUrl(dataUrl);
      })
      .catch((err) => {
        console.error('Failed to generate UPI QR:', err);
      })
      .finally(() => {
        if (active) setIsUpiLoading(false);
      });

    return () => {
      active = false;
    };
  }, [isOpen, paymentType, upiPaymentUrl]);

  const handleCopyUpiId = () => {
    sounds.playClick();
    if (navigator.clipboard) {
      navigator.clipboard.writeText(upiId);
    }
    setCopiedUpi(true);
    setTimeout(() => setCopiedUpi(false), 2000);
  };

  if (!isOpen) return null;

  const triggerCelebration = () => {
    try {
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.6 }
      });
    } catch (e) {}
  };

  const handleCompleteOrder = async (method, status = 'paid', gatewayName = 'UPI / Online') => {
    sounds.playClick();
    setIsProcessing(true);

    setTimeout(async () => {
      setIsProcessing(false);

      const orderItems = cart.map(i => ({
        name: i.item.name,
        qty: i.quantity,
        price: i.unitPrice,
        spice: i.spice,
        addons: i.addons.map(a => a.name),
        notes: i.notes
      }));

      const pickupToken = (operationalModel === 'self-serve' || diningMode === 'counter')
        ? `TOKEN #C-${Math.floor(10 + Math.random() * 89)}`
        : null;

      const newOrder = await placeOrder({
        tableNumber: diningMode === 'table' ? activeTable : null,
        diningMode: diningMode,
        pickupToken,
        deliveryAddress: diningMode === 'delivery' ? deliveryAddress : null,
        deliveryNotes: diningMode === 'delivery' ? deliveryNotes : null,
        customerName: customerName || 'Cafe Guest',
        customerPhone: customerPhone || '9876543210',
        items: orderItems,
        subtotal,
        discount: discountAmount,
        deliveryFee: diningMode === 'delivery' ? deliveryFee : 0,
        gst: gstAmount,
        tip: tipAmount,
        total: grandTotal,
        paymentMethod: method,
        paymentStatus: status,
        paymentGateway: gatewayName,
        estimatedMins: diningMode === 'delivery' ? 35 : (12 + Math.floor(Math.random() * 6)),
      });

      // AUTO-INCREMENT LOYALTY VISIT STAMP ON BILL PAYMENT
      if (operationalModel === 'loyalty') {
        incrementLoyaltyVisit('billing');
      }

      // Automatically sync with Gamified Loyalty Database & process streak
      try {
        processBillingTransaction({
          phone: customerPhone || '9876543210',
          billAmount: grandTotal,
          billItems: orderItems.map(i => `${i.qty}x ${i.name}`).join(', ')
        });
      } catch (err) {}

      triggerCelebration();
      clearCart();
      onClose();

      if (onOrderPlacedSuccess) {
        onOrderPlacedSuccess(newOrder);
      }
    }, 1000);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/75 backdrop-blur-md overflow-hidden font-sans">
        {/* Backdrop tap to close */}
        <div className="absolute inset-0 -z-10" onClick={() => { sounds.playClick(); onClose(); }} />

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 40 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className={`relative w-full max-w-md rounded-t-[32px] sm:rounded-3xl p-5 sm:p-7 shadow-2xl overflow-y-auto max-h-[92vh] sm:max-h-[90vh] border transition-colors flex flex-col ${
            isLight 
              ? 'bg-[#FAF7F2] text-[#12100E] border-[#E8E2D5]' 
              : 'bg-[#141210] text-[#FAF7F2] border-white/10'
          }`}
        >
          {/* Mobile Drag Indicator */}
          <div className="sm:hidden pt-0 pb-2.5 flex justify-center shrink-0">
            <div className="w-12 h-1.5 bg-stone-400/50 rounded-full" />
          </div>
          {/* Close */}
          <button
            onClick={() => { sounds.playClick(); onClose(); }}
            className={`absolute top-5 right-5 p-2 rounded-xl border transition-all ${
              isLight 
                ? 'border-stone-200 text-stone-500 hover:text-black hover:bg-stone-100' 
                : 'border-white/10 text-stone-400 hover:text-white hover:bg-white/5'
            }`}
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Title Masthead */}
          <div className="text-center mb-6">
            <span className={`text-[10px] font-mono uppercase tracking-widest px-2.5 py-0.5 rounded-full border ${
              isLight 
                ? 'bg-stone-100 border-stone-200 text-stone-600' 
                : 'bg-white/5 border-white/10 text-stone-400'
            }`}>
              Order Checkout
            </span>
            <h3 className="text-2xl font-editorial tracking-tight mt-2 font-normal">
              Confirm Order
            </h3>
            <p className="text-sm font-number mt-1 text-[#D04834] font-bold">
              Total: ₹{grandTotal} • {
                diningMode === 'table'
                  ? `Table #${activeTable || '04'}`
                  : diningMode === 'delivery'
                  ? 'Doorstep Delivery'
                  : 'Counter Pickup'
              }
            </p>
          </div>

          {/* Loyalty Stamp Notice */}
          {operationalModel === 'loyalty' && (
            <div className={`p-3 rounded-2xl border flex items-center justify-between text-xs mb-5 ${
              isLight 
                ? 'bg-white border-[#E8E2D5] text-stone-700' 
                : 'bg-[#1C1917] border-white/10 text-stone-300'
            }`}>
              <div className="flex items-center gap-2">
                <Award className="w-4 h-4 text-[#D04834]" />
                <span className="font-syne font-bold text-xs">Loyalty Club Reward</span>
              </div>
              <span className="font-number text-xs font-bold text-[#D04834]">
                Stamp {Math.min(7, loyaltyVisits + 1)}/7
              </span>
            </div>
          )}

          {/* Step 1: Payment Method Selector */}
          <div className="space-y-2.5 mb-5">
            <label className={`text-[10px] font-mono uppercase tracking-widest block font-bold ${
              isLight ? 'text-stone-500' : 'text-stone-400'
            }`}>
              1. Select Payment Method:
            </label>

            <div className="grid grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={() => { sounds.playClick(); setPaymentType('online'); }}
                className={`p-3.5 rounded-2xl border text-left transition ${
                  paymentType === 'online'
                    ? isLight
                      ? 'bg-white border-[#12100E] shadow-sm ring-1 ring-[#12100E]'
                      : 'bg-[#1C1917] border-white shadow-sm ring-1 ring-white'
                    : isLight
                    ? 'bg-white/60 border-[#E8E2D5] text-stone-500 hover:text-black'
                    : 'bg-[#0E0C0B] border-white/5 text-stone-400 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <Smartphone className="w-4 h-4 text-[#D04834]" />
                  <span className="font-syne font-bold text-xs">Online UPI</span>
                </div>
                <p className={`text-[11px] leading-tight ${isLight ? 'text-stone-500' : 'text-stone-400'}`}>
                  GPay, PhonePe, UPI QR
                </p>
              </button>

              <button
                type="button"
                onClick={() => { sounds.playClick(); setPaymentType('counter'); }}
                className={`p-3.5 rounded-2xl border text-left transition ${
                  paymentType === 'counter'
                    ? isLight
                      ? 'bg-white border-[#12100E] shadow-sm ring-1 ring-[#12100E]'
                      : 'bg-[#1C1917] border-white shadow-sm ring-1 ring-white'
                    : isLight
                    ? 'bg-white/60 border-[#E8E2D5] text-stone-500 hover:text-black'
                    : 'bg-[#0E0C0B] border-white/5 text-stone-400 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <Receipt className="w-4 h-4 text-[#D04834]" />
                  <span className="font-syne font-bold text-xs">
                    {diningMode === 'delivery' ? 'Cash on Delivery' : 'Pay at Counter'}
                  </span>
                </div>
                <p className={`text-[11px] leading-tight ${isLight ? 'text-stone-500' : 'text-stone-400'}`}>
                  {diningMode === 'delivery' ? 'Cash/UPI to courier' : 'Cash or card at counter'}
                </p>
              </button>
            </div>
          </div>

          {/* Step 2 Content */}
          {paymentType === 'online' ? (
            <div className="space-y-4">
              <div className={`p-5 rounded-2xl border text-center space-y-3 ${
                isLight 
                  ? 'bg-white border-[#E8E2D5] shadow-sm' 
                  : 'bg-[#1C1917] border-white/10'
              }`}>
                {/* Real Scannable UPI QR Card */}
                <div className="flex flex-col items-center justify-center">
                  <div className="relative p-3 bg-white rounded-2xl border-2 border-stone-900 shadow-md flex items-center justify-center min-h-[190px] min-w-[190px]">
                    {isUpiLoading || !upiQrDataUrl ? (
                      <div className="flex flex-col items-center justify-center text-stone-500 py-8 gap-2">
                        <Loader2 className="w-8 h-8 animate-spin text-[#D04834]" />
                        <span className="text-[11px] font-mono">Generating UPI QR...</span>
                      </div>
                    ) : (
                      <div className="relative flex flex-col items-center">
                        <img 
                          src={upiQrDataUrl} 
                          alt="Real UPI Payment QR Code" 
                          className="w-44 h-44 object-contain rounded-lg"
                        />
                        <div className="absolute bottom-1 bg-white/95 px-2 py-0.5 rounded-full border border-stone-300 text-[10px] font-mono font-bold text-stone-800 shadow-xs flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                          <span>₹{grandTotal}</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <h4 className="font-editorial text-base font-medium">Scan to Pay with Any UPI App</h4>
                  <p className={`text-xs mt-0.5 ${isLight ? 'text-stone-500' : 'text-stone-400'}`}>
                    Open Google Pay, PhonePe, Paytm, or your bank app to scan
                  </p>
                </div>

                {/* UPI ID with Quick Copy */}
                <div className="flex items-center justify-center gap-2">
                  <span className={`text-xs font-mono px-3 py-1.5 rounded-xl border flex items-center gap-1.5 ${
                    isLight ? 'bg-stone-50 border-stone-200 text-stone-700' : 'bg-white/5 border-white/10 text-stone-300'
                  }`}>
                    <span>UPI ID:</span>
                    <strong className="text-[#D04834]">{upiId}</strong>
                  </span>
                  <button
                    type="button"
                    onClick={handleCopyUpiId}
                    className={`p-1.5 rounded-xl border transition cursor-pointer flex items-center gap-1 text-xs ${
                      copiedUpi 
                        ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-400' 
                        : isLight 
                        ? 'bg-stone-100 hover:bg-stone-200 border-stone-200 text-stone-700' 
                        : 'bg-white/10 hover:bg-white/15 border-white/10 text-white'
                    }`}
                    title="Copy UPI ID"
                  >
                    {copiedUpi ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-500" />
                        <span className="text-[10px] font-mono font-bold">Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span className="text-[10px] font-mono">Copy</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Mobile Intent Trigger for Users on Phones */}
                <div className="pt-1">
                  <a
                    href={upiPaymentUrl}
                    className={`inline-flex items-center justify-center gap-1.5 text-xs font-syne font-semibold underline decoration-dotted underline-offset-4 ${
                      isLight ? 'text-stone-600 hover:text-stone-900' : 'text-stone-400 hover:text-white'
                    }`}
                  >
                    <span>On mobile? Tap here to open UPI App</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>

                {/* Accepted Wallets Badges */}
                <div className="pt-2 border-t border-stone-200/40 dark:border-white/5 flex items-center justify-center gap-2">
                  {['GPay', 'PhonePe', 'Paytm', 'BHIM', 'Cred'].map((app) => (
                    <span 
                      key={app}
                      className={`px-2 py-0.5 rounded text-[10px] font-mono uppercase tracking-wider ${
                        isLight ? 'bg-stone-100 text-stone-600 font-medium' : 'bg-white/5 text-stone-400'
                      }`}
                    >
                      {app}
                    </span>
                  ))}
                </div>
              </div>

              <button
                disabled={isProcessing}
                onClick={() => handleCompleteOrder('online', 'paid', 'UPI Online')}
                className={`w-full py-3.5 rounded-2xl font-syne font-bold text-sm shadow-md transition flex items-center justify-center gap-2 cursor-pointer ${
                  isLight 
                    ? 'bg-[#12100E] text-[#FAF7F2] hover:bg-stone-800' 
                    : 'bg-[#FAF7F2] text-[#12100E] hover:bg-stone-200'
                }`}
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Sending order to kitchen...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Confirm & Send to Kitchen (<span className="font-number font-bold">₹{grandTotal}</span>)</span>
                  </>
                )}
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {diningMode === 'delivery' ? (
                <div className={`p-4 rounded-2xl border text-left space-y-2 ${
                  isLight ? 'bg-white border-[#E8E2D5]' : 'bg-[#1C1917] border-white/10'
                }`}>
                  <h4 className="font-editorial text-base flex items-center gap-2">
                    <Receipt className="w-4 h-4 text-[#D04834]" />
                    <span>Cash on Delivery (COD)</span>
                  </h4>
                  <p className={`text-xs leading-relaxed ${isLight ? 'text-stone-600' : 'text-stone-300'}`}>
                    Your order will be prepared immediately. Pay <strong className="font-number font-bold">₹{grandTotal}</strong> in cash or UPI to the delivery rider upon arrival.
                  </p>
                </div>
              ) : (
                /* Notice #1: In-Tab Policy Warning */
                <div className={`p-4 rounded-2xl border text-left space-y-2.5 transition-all ${
                  isLight ? 'bg-amber-500/10 border-amber-500/30' : 'bg-amber-500/10 border-amber-500/25'
                }`}>
                  <div className="flex items-center justify-between">
                    <h4 className="font-editorial text-base flex items-center gap-2 text-amber-900 dark:text-amber-200">
                      <Banknote className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                      <span>Pay at Counter Desk</span>
                    </h4>
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-mono font-bold uppercase bg-amber-500/20 text-amber-800 dark:text-amber-300 border border-amber-500/30">
                      Pre-Payment Policy
                    </span>
                  </div>

                  <div className={`text-xs leading-relaxed space-y-1.5 ${isLight ? 'text-stone-700' : 'text-stone-300'}`}>
                    <div className="p-2.5 rounded-xl bg-amber-500/15 border border-amber-500/30 font-semibold text-rose-700 dark:text-rose-300 flex items-start gap-2">
                      <AlertTriangle className="w-4 h-4 text-[#D04834] shrink-0 mt-0.5" />
                      <span>Food is prepared ONLY AFTER you pay at the counter desk.</span>
                    </div>
                    <p className="text-[11px] opacity-90 pl-1">
                      To guarantee swift kitchen coordination and zero billing disputes, our chefs begin handcrafting your dishes the moment your payment of <strong className="font-number font-bold">₹{grandTotal}</strong> is confirmed at the cashier counter.
                    </p>
                  </div>
                </div>
              )}

              <button
                disabled={isProcessing}
                onClick={() => {
                  sounds.playClick();
                  if (diningMode === 'delivery') {
                    handleCompleteOrder('cod', 'unpaid', 'Cash on Delivery (COD)');
                  } else {
                    setCounterAcknowledged(false);
                    setShowCounterConfirmation(true);
                  }
                }}
                className={`w-full py-3.5 rounded-2xl font-syne font-bold text-sm shadow-md transition flex items-center justify-center gap-2 cursor-pointer ${
                  isLight 
                    ? 'bg-[#12100E] text-[#FAF7F2] hover:bg-stone-800' 
                    : 'bg-[#FAF7F2] text-[#12100E] hover:bg-stone-200'
                }`}
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Placing order...</span>
                  </>
                ) : (
                  <>
                    <ArrowRight className="w-4 h-4" />
                    <span>
                      {diningMode === 'delivery' ? `Confirm Delivery Order (₹${grandTotal})` : `Verify Pay-at-Counter Policy (₹${grandTotal})`}
                    </span>
                  </>
                )}
              </button>
            </div>
          )}

          {/* Notice #2: Pre-Order Pay-at-Counter Confirmation Modal */}
          <AnimatePresence>
            {showCounterConfirmation && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[120] flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/80 backdrop-blur-sm"
              >
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 30 }}
                  transition={{ type: "spring", damping: 25, stiffness: 300 }}
                  className={`max-w-md w-full rounded-t-[32px] sm:rounded-3xl p-6 sm:p-7 border shadow-2xl space-y-5 text-left relative max-h-[92vh] overflow-y-auto ${
                    isLight ? 'bg-[#FAF7F2] border-[#E8E2D5] text-[#12100E]' : 'bg-[#161412] border-white/10 text-[#FAF7F2]'
                  }`}
                >
                  <button
                    onClick={() => { sounds.playClick(); setShowCounterConfirmation(false); }}
                    className="absolute top-4 right-4 p-2 rounded-xl text-stone-400 hover:text-stone-700 dark:hover:text-white transition"
                  >
                    <X className="w-5 h-5" />
                  </button>

                  <div className="flex items-center gap-3 pr-8">
                    <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-600 dark:text-amber-400 shrink-0">
                      <AlertTriangle className="w-6 h-6 text-[#D04834]" />
                    </div>
                    <div>
                      <span className="text-[10px] font-mono uppercase tracking-widest text-[#D04834] font-bold">
                        Notice 2 of 3 • Pre-Payment Required
                      </span>
                      <h3 className="text-xl font-editorial font-bold tracking-tight">
                        Please Pay at Counter First
                      </h3>
                    </div>
                  </div>

                  <div className={`p-4 rounded-2xl border space-y-2.5 text-xs ${
                    isLight ? 'bg-amber-500/10 border-amber-500/30 text-stone-800' : 'bg-amber-500/10 border-amber-500/20 text-stone-200'
                  }`}>
                    <div className="flex items-start gap-2.5">
                      <ShieldAlert className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                      <p className="leading-snug">
                        <strong>Chefs will NOT start cooking yet:</strong> Your order will remain in queued hold until <strong className="font-number font-bold text-[#D04834]">₹{grandTotal}</strong> is settled at the billing counter.
                      </p>
                    </div>
                    <div className="flex items-start gap-2.5">
                      <Store className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                      <p className="leading-snug">
                        <strong>Pay immediately after confirming:</strong> Walk up to the counter desk with your Table #{activeTable || '01'} to settle with cash or QR.
                      </p>
                    </div>
                    <div className="flex items-start gap-2.5">
                      <Zap className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                      <p className="leading-snug">
                        <strong>Instant Kitchen Release:</strong> The moment our cashier taps "Paid", your food will be fired to the grill and stoves right away.
                      </p>
                    </div>
                  </div>

                  <label className={`flex items-start gap-3 p-3.5 rounded-2xl border cursor-pointer select-none transition text-xs ${
                    counterAcknowledged 
                      ? (isLight ? 'bg-emerald-50 border-emerald-300 text-emerald-950 shadow-sm' : 'bg-emerald-950/20 border-emerald-500/40 text-emerald-200')
                      : (isLight ? 'bg-white border-stone-200 hover:bg-stone-50' : 'bg-white/5 border-white/10 hover:bg-white/10')
                  }`}>
                    <input
                      type="checkbox"
                      checked={counterAcknowledged}
                      onChange={(e) => { sounds.playClick(); setCounterAcknowledged(e.target.checked); }}
                      className="mt-0.5 accent-[#D04834] w-4 h-4 rounded cursor-pointer"
                    />
                    <span className="font-medium leading-snug">
                      I understand that our food will <strong>only be prepared after I pay ₹{grandTotal}</strong> at the counter.
                    </span>
                  </label>

                  <div className="space-y-2 pt-1">
                    <button
                      disabled={!counterAcknowledged || isProcessing}
                      onClick={() => {
                        setShowCounterConfirmation(false);
                        handleCompleteOrder('counter', 'unpaid', 'Pay at Counter');
                      }}
                      className={`w-full py-3.5 rounded-2xl font-syne font-bold text-xs sm:text-sm shadow-md transition flex items-center justify-center gap-2 cursor-pointer ${
                        !counterAcknowledged || isProcessing
                          ? 'opacity-50 cursor-not-allowed bg-stone-300 dark:bg-stone-800 text-stone-500'
                          : 'bg-[#D04834] hover:bg-[#b83d2b] text-white'
                      }`}
                    >
                      {isProcessing ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <CheckCircle2 className="w-4 h-4" />
                      )}
                      <span>I Understand • Confirm &amp; I'll Pay Now</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        sounds.playClick();
                        setShowCounterConfirmation(false);
                        setPaymentType('online');
                      }}
                      className={`w-full py-2.5 rounded-2xl text-xs font-mono font-bold transition flex items-center justify-center gap-1.5 ${
                        isLight ? 'text-stone-600 hover:text-black' : 'text-stone-300 hover:text-white'
                      }`}
                    >
                      <span>Prefer instant cooking without waiting? Switch to UPI</span>
                      <ArrowRight className="w-3.5 h-3.5 text-[#D04834]" />
                    </button>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Safe Badge */}
          <div className={`mt-5 pt-3 border-t flex items-center justify-center gap-2 text-xs font-mono ${
            isLight ? 'border-stone-200 text-stone-500' : 'border-white/10 text-stone-400'
          }`}>
            <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span>Encrypted &amp; Verified Order • {BRAND_CONFIG.brandName}</span>
          </div>

        </motion.div>
      </div>
    </AnimatePresence>
  );
}
