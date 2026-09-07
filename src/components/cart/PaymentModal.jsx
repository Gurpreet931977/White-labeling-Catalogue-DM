import React, { useState } from 'react';
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
  ArrowRight
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useCart } from '../../context/CartContext';
import { useOrder } from '../../context/OrderContext';
import { useTheme } from '../../context/ThemeContext';
import { CAFE_CONFIG, BRAND_CONFIG } from '../../data/cafeConfig';
import { sounds } from '../../utils/audio';
import { processBillingTransaction } from '../../utils/loyaltyStorage';

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
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md overflow-y-auto font-sans">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.2 }}
          className={`relative w-full max-w-md rounded-3xl p-6 sm:p-7 shadow-2xl my-6 overflow-hidden border transition-colors ${
            isLight 
              ? 'bg-[#FAF7F2] text-[#12100E] border-[#E8E2D5]' 
              : 'bg-[#141210] text-[#FAF7F2] border-white/10'
          }`}
        >
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
              <div className={`p-4 rounded-2xl border text-center space-y-2 ${
                isLight 
                  ? 'bg-white border-[#E8E2D5]' 
                  : 'bg-[#1C1917] border-white/10'
              }`}>
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center mx-auto ${
                  isLight ? 'bg-stone-100 text-[#12100E]' : 'bg-white/10 text-white'
                }`}>
                  <QrCode className="w-5 h-5" />
                </div>
                <h4 className="font-editorial text-base">Instant UPI QR Settlement</h4>
                <p className={`text-xs font-mono ${isLight ? 'text-stone-500' : 'text-stone-400'}`}>
                  UPI ID: <span className="font-bold text-[#D04834]">{CAFE_CONFIG.mockUpiId}</span>
                </p>
                <div className="py-1 flex items-center justify-center gap-2">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-mono uppercase ${
                    isLight ? 'bg-stone-100 text-stone-700' : 'bg-white/5 text-stone-300'
                  }`}>GPay</span>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-mono uppercase ${
                    isLight ? 'bg-stone-100 text-stone-700' : 'bg-white/5 text-stone-300'
                  }`}>PhonePe</span>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-mono uppercase ${
                    isLight ? 'bg-stone-100 text-stone-700' : 'bg-white/5 text-stone-300'
                  }`}>Paytm</span>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-mono uppercase ${
                    isLight ? 'bg-stone-100 text-stone-700' : 'bg-white/5 text-stone-300'
                  }`}>Any App</span>
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
              <div className={`p-4 rounded-2xl border text-left space-y-2 ${
                isLight 
                  ? 'bg-white border-[#E8E2D5]' 
                  : 'bg-[#1C1917] border-white/10'
              }`}>
                <h4 className="font-editorial text-base flex items-center gap-2">
                  <Receipt className="w-4 h-4 text-[#D04834]" />
                  <span>
                    {diningMode === 'delivery' 
                      ? 'Cash on Delivery (COD)' 
                      : 'Pay Directly at Counter'}
                  </span>
                </h4>
                <p className={`text-xs leading-relaxed ${isLight ? 'text-stone-600' : 'text-stone-300'}`}>
                  {diningMode === 'delivery' ? (
                    <>Your order will be prepared immediately. Pay <strong className="font-number font-bold">₹{grandTotal}</strong> in cash or UPI to the courier upon delivery.</>
                  ) : (
                    <>Your order will be sent to our chefs right away. You can settle the bill of <strong className="font-number font-bold">₹{grandTotal}</strong> at the counter when you finish.</>
                  )}
                </p>
              </div>

              <button
                disabled={isProcessing}
                onClick={() => handleCompleteOrder(
                  diningMode === 'delivery' ? 'cod' : 'counter', 
                  'pending', 
                  diningMode === 'delivery' ? 'Cash on Delivery (COD)' : 'Pay at Counter'
                )}
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
                    <CheckCircle2 className="w-4 h-4" />
                    <span>
                      {diningMode === 'delivery' ? 'Confirm Delivery Order (' : 'Send Order to Kitchen ('}
                      <span className="font-number font-bold">₹{grandTotal}</span>)
                    </span>
                  </>
                )}
              </button>
            </div>
          )}

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
