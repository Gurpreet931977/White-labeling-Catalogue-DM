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
  Lock,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useCart } from '../../context/CartContext';
import { useOrder } from '../../context/OrderContext';
import { CAFE_CONFIG } from '../../data/cafeConfig';
import { sounds } from '../../utils/audio';

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
    clearCart 
  } = useCart();

  const { placeOrder } = useOrder();

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

      const newOrder = await placeOrder({
        tableNumber: diningMode === 'table' ? activeTable : null,
        diningMode: diningMode,
        customerName: customerName || 'Highway Guest',
        customerPhone: customerPhone || '9876543210',
        items: orderItems,
        subtotal,
        discount: discountAmount,
        gst: gstAmount,
        tip: tipAmount,
        total: grandTotal,
        paymentMethod: method,
        paymentStatus: status,
        paymentGateway: gatewayName,
        estimatedMins: 12 + Math.floor(Math.random() * 6),
      });

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
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.2 }}
          className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-7 shadow-2xl my-6 overflow-hidden"
        >
          {/* Close */}
          <button
            onClick={() => { sounds.playClick(); onClose(); }}
            className="absolute top-5 right-5 p-2 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Title */}
          <div className="text-center mb-5">
            <h3 className="text-xl sm:text-2xl font-bold text-white font-syne">
              Complete Your Order
            </h3>
            <p className="text-amber-400 text-sm font-bold mt-1">
              Total Bill: ₹{grandTotal} • {diningMode === 'table' ? `Table #${activeTable || '04'}` : 'Counter Pickup'}
            </p>
          </div>

          {/* Simple Step 1: Choose Payment Method */}
          <div className="space-y-3 mb-5">
            <label className="text-xs font-bold text-slate-300 block">
              Step 1: Choose how you want to pay
            </label>

            <div className="grid grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={() => { sounds.playClick(); setPaymentType('online'); }}
                className={`p-3.5 rounded-2xl border-2 text-left transition ${
                  paymentType === 'online'
                    ? 'bg-amber-400/15 border-amber-400 text-white'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <Smartphone className="w-4 h-4 text-amber-400" />
                  <span className="font-bold text-xs">Pay Online</span>
                </div>
                <p className="text-[11px] text-slate-400">GPay, PhonePe, Paytm, UPI</p>
              </button>

              <button
                type="button"
                onClick={() => { sounds.playClick(); setPaymentType('counter'); }}
                className={`p-3.5 rounded-2xl border-2 text-left transition ${
                  paymentType === 'counter'
                    ? 'bg-cyan-400/15 border-cyan-400 text-white'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <Receipt className="w-4 h-4 text-cyan-400" />
                  <span className="font-bold text-xs">Pay at Counter</span>
                </div>
                <p className="text-[11px] text-slate-400">Pay cash/card after eating</p>
              </button>
            </div>
          </div>

          {/* Step 2: Confirmation based on selected method */}
          {paymentType === 'online' ? (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-center space-y-2">
                <div className="w-36 h-36 bg-white p-2.5 rounded-2xl mx-auto flex items-center justify-center shadow-md">
                  <QrCode className="w-32 h-32 text-black" />
                </div>
                <p className="text-white font-bold text-xs">
                  Scan QR with any UPI App (GPay / PhonePe / Paytm)
                </p>
                <p className="text-slate-400 text-xs font-mono">
                  UPI ID: {CAFE_CONFIG.mockUpiId}
                </p>
              </div>

              <button
                disabled={isProcessing}
                onClick={() => handleCompleteOrder('online', 'paid', 'UPI Online')}
                className="w-full py-3.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-sm shadow-md transition flex items-center justify-center gap-2"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Sending Order to Kitchen...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-5 h-5" />
                    <span>Confirm & Send Order to Kitchen (₹{grandTotal})</span>
                  </>
                )}
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-slate-950 border border-cyan-500/30 text-left space-y-2">
                <h4 className="font-bold text-white text-sm flex items-center gap-2">
                  <Receipt className="w-4 h-4 text-cyan-400" />
                  <span>Cash Payment at Billing Counter</span>
                </h4>
                <p className="text-slate-300 text-xs leading-relaxed">
                  Your food order will go straight to the kitchen now. You can pay <strong>₹{grandTotal}</strong> in cash or card at the cafe counter when you finish.
                </p>
              </div>

              <button
                disabled={isProcessing}
                onClick={() => handleCompleteOrder('counter', 'pending', 'Pay at Counter')}
                className="w-full py-3.5 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-bold text-sm shadow-md transition flex items-center justify-center gap-2"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Placing Order...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-5 h-5" />
                    <span>Confirm Order Now (₹{grandTotal})</span>
                  </>
                )}
              </button>
            </div>
          )}

          {/* Simple Safe Badge */}
          <div className="mt-5 pt-3 border-t border-slate-800 flex items-center justify-center gap-2 text-xs text-slate-400">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>100% Safe & Verified Order</span>
          </div>

        </motion.div>
      </div>
    </AnimatePresence>
  );
}
