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
  ArrowRight,
  Award,
  Store,
  Truck
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useCart } from '../../context/CartContext';
import { useOrder } from '../../context/OrderContext';
import { CAFE_CONFIG } from '../../data/cafeConfig';
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
          <div className="text-center mb-4">
            <h3 className="text-xl sm:text-2xl font-bold text-white font-syne">
              Complete Your Order
            </h3>
            <p className="text-amber-400 text-sm font-bold mt-1">
              Total Bill: ₹{grandTotal} • {
                diningMode === 'table'
                  ? `Table #${activeTable || '04'}`
                  : diningMode === 'delivery'
                  ? 'Doorstep Delivery'
                  : 'Counter Pickup'
              }
            </p>
          </div>

          {/* Integrated Loyalty Stamp Notice (ONLY in dedicated Loyalty Model) */}
          {operationalModel === 'loyalty' && (
            <div className="p-2.5 rounded-xl bg-amber-400/10 border border-amber-400/20 flex items-center justify-between text-[11px] font-mono text-amber-300 mb-5">
              <div className="flex items-center gap-1.5">
                <Award className="w-3.5 h-3.5 text-amber-400" />
                <span>Loyalty Club: +1 Stamp earned on billing!</span>
              </div>
              <span className="font-bold">Stamp {Math.min(7, loyaltyVisits + 1)}/7</span>
            </div>
          )}

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
                  <span className="font-bold text-xs">
                    {diningMode === 'delivery' ? 'Cash on Delivery' : 'Pay at Counter'}
                  </span>
                </div>
                <p className="text-[11px] text-slate-400">
                  {diningMode === 'delivery' ? 'Pay rider at doorstep' : 'Cash or card at desk'}
                </p>
              </button>
            </div>
          </div>

          {/* Step 2 Content */}
          {paymentType === 'online' ? (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-center space-y-2">
                <div className="w-10 h-10 rounded-xl bg-amber-400/10 text-amber-400 flex items-center justify-center mx-auto">
                  <QrCode className="w-5 h-5" />
                </div>
                <h4 className="font-bold text-white text-sm">Instant UPI QR Payment</h4>
                <p className="text-slate-400 text-xs">
                  Pay to: <span className="text-amber-400 font-mono font-bold">{CAFE_CONFIG.mockUpiId}</span>
                </p>
                <div className="py-2 flex items-center justify-center gap-2">
                  <span className="px-2 py-0.5 rounded-md bg-white/5 text-[10px] text-slate-300 font-mono">GPay</span>
                  <span className="px-2 py-0.5 rounded-md bg-white/5 text-[10px] text-slate-300 font-mono">PhonePe</span>
                  <span className="px-2 py-0.5 rounded-md bg-white/5 text-[10px] text-slate-300 font-mono">Paytm</span>
                  <span className="px-2 py-0.5 rounded-md bg-white/5 text-[10px] text-slate-300 font-mono">Any UPI</span>
                </div>
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
                  <span>
                    {diningMode === 'delivery' 
                      ? 'Cash on Delivery (COD)' 
                      : 'Cash Payment at Billing Counter'}
                  </span>
                </h4>
                <p className="text-slate-300 text-xs leading-relaxed">
                  {diningMode === 'delivery' ? (
                    <>Your order will be prepared and dispatched immediately. You can pay <strong>₹{grandTotal}</strong> in cash or UPI QR to the delivery rider at your doorstep.</>
                  ) : (
                    <>Your food order will go straight to the kitchen now. You can pay <strong>₹{grandTotal}</strong> in cash or card at the cafe counter when you finish.</>
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
                    <span>
                      {diningMode === 'delivery' 
                        ? `Confirm Cash on Delivery (₹${grandTotal})` 
                        : `Confirm Order Now (₹${grandTotal})`}
                    </span>
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
