import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  Trash2, 
  Plus, 
  Minus, 
  ShoppingBag, 
  Tag, 
  ArrowRight, 
  QrCode, 
  Store, 
  User, 
  Phone,
  Heart,
  Lock,
  Flame,
  Award,
  Truck,
  MapPin,
  FileText,
  Gift,
  CheckCircle2,
  Calendar
} from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { CAFE_CONFIG, BRAND_CONFIG } from '../../data/cafeConfig';
import { MENU_ITEMS } from '../../data/menuData';
import { sounds } from '../../utils/audio';

export function CartDrawer({ 
  isOpen, 
  onClose, 
  onProceedToPayment, 
  onOpenScanner, 
  onRequireAuth,
  onOpenReservation,
  onOpenLoyaltyModal
}) {
  const {
    cart,
    addToCart,
    itemCount,
    subtotal,
    discountAmount,
    gstAmount,
    grandTotal,
    appliedPromo,
    tipAmount,
    setTipAmount,
    activeTable,
    setActiveTable,
    diningMode,
    setDiningMode,
    customerName,
    setCustomerName,
    customerPhone,
    setCustomerPhone,
    operationalModel,
    deliveryAddress,
    setDeliveryAddress,
    deliveryNotes,
    setDeliveryNotes,
    deliveryFee,
    isDeliveryActive,
    loyaltyVisits,
    is7thVisitUnlocked,
    claim7thVisitReward,
    updateQuantity,
    removeFromCart,
    clearCart,
    applyPromoCode,
    removePromoCode
  } = useCart();

  const { isCustomerLoggedIn } = useAuth();

  const [promoInput, setPromoInput] = useState('');
  const [promoError, setPromoError] = useState('');
  const [tableInput, setTableInput] = useState(activeTable ? activeTable.toString() : '4');

  if (!isOpen) return null;

  const handleApplyPromo = (e) => {
    e.preventDefault();
    setPromoError('');
    if (!promoInput.trim()) return;
    const res = applyPromoCode(promoInput);
    if (!res.success) {
      setPromoError(res.message);
    } else {
      setPromoInput('');
    }
  };

  const handleTableChange = (val) => {
    setTableInput(val);
    const num = parseInt(val, 10);
    if (!isNaN(num) && num > 0) {
      setActiveTable(num);
    }
  };

  const handleProceed = () => {
    sounds.playClick();

    if (!isCustomerLoggedIn) {
      if (onRequireAuth) {
        onRequireAuth(() => {
          proceedAfterAuth();
        });
      }
      return;
    }

    proceedAfterAuth();
  };

  const proceedAfterAuth = () => {
    if (diningMode === 'table') {
      const num = parseInt(tableInput, 10);
      if (isNaN(num) || num < 1) {
        alert('Please enter a valid Table Number (e.g. 1 to 12)');
        return;
      }
      setActiveTable(num);
    } else if (diningMode === 'delivery') {
      if (!deliveryAddress || !deliveryAddress.trim()) {
        alert('Please enter a delivery address for doorstep order!');
        return;
      }
    }
    onProceedToPayment();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-hidden">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        />

        <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 220 }}
            className="w-screen max-w-md bg-slate-900 border-l border-white/10 flex flex-col justify-between shadow-2xl relative"
          >
            {/* Header */}
            <div className="p-5 bg-slate-950 border-b border-white/5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-amber-400 flex items-center justify-center text-slate-950 font-bold text-sm">
                  <ShoppingBag className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-syne font-bold text-white text-base">Your Cafe Order</h3>
                  <p className="text-xs text-slate-400 font-mono">
                    {itemCount} {itemCount === 1 ? 'item' : 'items'} in cart
                  </p>
                </div>
              </div>

              <button
                onClick={() => { sounds.playClick(); onClose(); }}
                className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Body / Items List */}
            <div className="flex-1 overflow-y-auto p-5 space-y-4">
              
              {/* SHOWCASE MODEL NOTICE */}
              {operationalModel === 'showcase' && (
                <div className="p-4 rounded-2xl bg-purple-950/40 border border-purple-400/30 text-center space-y-2">
                  <span className="text-[10px] font-mono font-bold text-purple-300 uppercase px-2 py-0.5 rounded-full bg-purple-400/20">
                    Brand Showcase Model Active
                  </span>
                  <p className="text-xs text-slate-300 leading-relaxed font-clash">
                    In this showcase archetype, digital in-store checkout is disabled. Diners explore your menu and book tables in advance!
                  </p>
                  {onOpenReservation && (
                    <button
                      onClick={() => { onClose(); onOpenReservation(); }}
                      className="btn-3d btn-3d-amber px-4 py-2 rounded-xl text-xs font-syne font-bold flex items-center justify-center gap-1.5 mx-auto cursor-pointer"
                    >
                      <Calendar className="w-3.5 h-3.5" />
                      <span>Book a Table Reservation</span>
                    </button>
                  )}
                </div>
              )}

              {/* LOYALTY MINI STAMP BAR WIDGET (When in Loyalty Model) */}
              {operationalModel === 'loyalty' && (
                <div 
                  onClick={onOpenLoyaltyModal}
                  className="p-3.5 rounded-2xl bg-gradient-to-r from-amber-500/10 via-slate-950 to-slate-950 border border-amber-400/30 space-y-2 cursor-pointer hover:border-amber-400/60 transition group"
                >
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1.5">
                      <Award className="w-4 h-4 text-amber-400" />
                      <span className="font-syne font-bold text-white text-xs">Loyalty Club Stamps</span>
                    </div>
                    <span className="text-[10px] font-mono text-amber-300 font-bold">
                      {is7thVisitUnlocked ? '7 of 7 COMPLETE' : `${loyaltyVisits} of 7 Stamps`}
                    </span>
                  </div>

                  {/* 7 Micro Stamp Dots */}
                  <div className="flex items-center justify-between gap-1 pt-1">
                    {[1, 2, 3, 4, 5, 6, 7].map((s) => (
                      <div
                        key={s}
                        className={`flex-1 h-2 rounded-full transition-all ${
                          loyaltyVisits >= s
                            ? 'bg-amber-400 shadow-sm shadow-amber-400/50'
                            : s === 7
                            ? 'bg-purple-500/40 border border-purple-400/40'
                            : 'bg-slate-800'
                        }`}
                        title={`Stamp #${s}`}
                      />
                    ))}
                  </div>

                  {/* 7th Visit Milestone Reward CTA */}
                  {is7thVisitUnlocked ? (
                    <div className="pt-1">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          claim7thVisitReward();
                        }}
                        className="w-full py-1.5 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 font-syne font-black text-xs flex items-center justify-center gap-1.5 shadow-md animate-pulse cursor-pointer"
                      >
                        <Gift className="w-3.5 h-3.5" />
                        <span>Apply 50% OFF (7th Visit Reward)</span>
                      </button>
                    </div>
                  ) : (
                    <p className="text-[10px] text-slate-400 font-clash flex items-center justify-between">
                      <span>{7 - loyaltyVisits} more visits to unlock 50% OFF!</span>
                      <span className="text-amber-400 group-hover:underline">View Card &rarr;</span>
                    </p>
                  )}
                </div>
              )}

              {cart.length === 0 ? (
                <div className="text-center py-16 space-y-3">
                  <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center mx-auto text-amber-400">
                    <ShoppingBag className="w-6 h-6" />
                  </div>
                  <h4 className="text-white font-syne font-bold text-base">Your Cart is Empty</h4>
                  <p className="text-slate-400 text-xs max-w-xs mx-auto">
                    Add hand-stretched wood-fired pizzas, silky pastas, or specialty espresso to your order.
                  </p>
                  <button
                    onClick={() => { sounds.playClick(); onClose(); }}
                    className="px-5 py-2.5 rounded-xl bg-amber-400 text-slate-950 font-bold text-xs font-syne"
                  >
                    EXPLORE MENU
                  </button>
                </div>
              ) : (
                <>
                  {/* FULFILLMENT MODE SELECTOR (Context-Aware based on operationalModel) */}
                  <div className="p-3.5 rounded-2xl bg-slate-950 border border-white/5 space-y-2.5">
                    
                    {/* CASE 1: SELF-SERVE MODEL */}
                    {operationalModel === 'self-serve' && (
                      <div className="space-y-1.5">
                        <div className="flex items-center gap-2 text-cyan-400 font-syne font-bold text-xs">
                          <Store className="w-4 h-4" />
                          <span>Self-Serve Express Counter Pickup</span>
                        </div>
                        <p className="text-[11px] text-slate-400 font-clash leading-relaxed">
                          No table service. An Order Token (e.g. <strong className="text-amber-300 font-mono">TOKEN #C-14</strong>) will be assigned upon payment. Collect from counter when chime sounds.
                        </p>
                      </div>
                    )}

                    {/* CASE 2: DIRECT DELIVERY MODEL */}
                    {operationalModel === 'delivery' && (
                      <div className="space-y-1.5">
                        <div className="flex items-center gap-2 text-emerald-400 font-syne font-bold text-xs">
                          <Truck className="w-4 h-4" />
                          <span>Direct Doorstep Delivery</span>
                        </div>
                        <p className="text-[11px] text-slate-400 font-clash">
                          Estimated Doorstep ETA: <strong className="text-white font-mono">30-40 Mins</strong> • 0% Aggregator Commissions
                        </p>
                      </div>
                    )}

                    {/* CASE 3: HYBRID MODEL (3-WAY SWITCHER) */}
                    {operationalModel === 'hybrid' && (
                      <div className="space-y-2">
                        <label className="text-[11px] font-semibold text-slate-300 uppercase tracking-wider block font-syne">
                          Select Ordering Channel:
                        </label>
                        <div className="grid grid-cols-3 gap-1.5">
                          <button
                            onClick={() => { sounds.playClick(); setDiningMode('table'); }}
                            className={`p-2 rounded-xl text-[11px] font-syne font-bold transition flex items-center justify-center gap-1 ${
                              diningMode === 'table'
                                ? 'bg-amber-400 text-slate-950 shadow-sm'
                                : 'bg-slate-900 text-slate-400 hover:text-white border border-white/5'
                            }`}
                          >
                            <QrCode className="w-3 h-3" />
                            <span>Table QR</span>
                          </button>
                          <button
                            onClick={() => { sounds.playClick(); setDiningMode('delivery'); }}
                            className={`p-2 rounded-xl text-[11px] font-syne font-bold transition flex items-center justify-center gap-1 ${
                              diningMode === 'delivery'
                                ? 'bg-emerald-400 text-slate-950 shadow-sm'
                                : 'bg-slate-900 text-slate-400 hover:text-white border border-white/5'
                            }`}
                          >
                            <Truck className="w-3 h-3" />
                            <span>Delivery</span>
                          </button>
                          <button
                            onClick={() => { sounds.playClick(); setDiningMode('counter'); }}
                            className={`p-2 rounded-xl text-[11px] font-syne font-bold transition flex items-center justify-center gap-1 ${
                              diningMode === 'counter'
                                ? 'bg-cyan-400 text-slate-950 shadow-sm'
                                : 'bg-slate-900 text-slate-400 hover:text-white border border-white/5'
                            }`}
                          >
                            <Store className="w-3 h-3" />
                            <span>Pickup</span>
                          </button>
                        </div>
                      </div>
                    )}

                    {/* CASE 4: TABLE-QR OR DEFAULT */}
                    {(operationalModel === 'table-qr' || operationalModel === 'loyalty') && (
                      <div className="space-y-2">
                        <label className="text-[11px] font-semibold text-slate-300 uppercase tracking-wider block font-syne">
                          Fulfillment Mode:
                        </label>
                        <div className="grid grid-cols-2 gap-2">
                          <button
                            onClick={() => { sounds.playClick(); setDiningMode('table'); }}
                            className={`p-2.5 rounded-xl border text-xs font-semibold font-syne flex items-center justify-center gap-1.5 transition ${
                              diningMode === 'table'
                                ? 'bg-amber-400 text-slate-950 border-amber-400 font-bold shadow-sm'
                                : 'bg-slate-900 border-white/5 text-slate-400 hover:text-white'
                            }`}
                          >
                            <QrCode className="w-3.5 h-3.5" />
                            <span>Serve at Table</span>
                          </button>
                          <button
                            onClick={() => { sounds.playClick(); setDiningMode('counter'); }}
                            className={`p-2.5 rounded-xl border text-xs font-semibold font-syne flex items-center justify-center gap-1.5 transition ${
                              diningMode === 'counter'
                                ? 'bg-cyan-400 text-slate-950 border-cyan-400 font-bold shadow-sm'
                                : 'bg-slate-900 border-white/5 text-slate-400 hover:text-white'
                            }`}
                          >
                            <Store className="w-3.5 h-3.5" />
                            <span>Counter Pickup</span>
                          </button>
                        </div>
                      </div>
                    )}

                    {/* SUB-FIELDS: TABLE NUMBER INPUT */}
                    {diningMode === 'table' && (
                      <div className="pt-2 border-t border-white/5 flex items-center justify-between gap-3 text-xs">
                        <span className="text-slate-300">Table Number:</span>
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs text-amber-400 font-mono font-bold">#</span>
                          <input
                            type="number"
                            min="1"
                            max="20"
                            value={tableInput}
                            onChange={(e) => handleTableChange(e.target.value)}
                            className="w-14 px-2 py-1 rounded-lg bg-slate-900 border border-white/10 text-white font-mono font-bold text-center text-xs focus:outline-none focus:border-amber-400"
                          />
                        </div>
                      </div>
                    )}

                    {/* SUB-FIELDS: DELIVERY ADDRESS INPUT */}
                    {(diningMode === 'delivery' || operationalModel === 'delivery') && (
                      <div className="pt-2 border-t border-white/5 space-y-2">
                        <div>
                          <label className="text-[10px] font-mono text-slate-400 mb-1 flex items-center gap-1">
                            <MapPin className="w-3 h-3 text-emerald-400" />
                            <span>Doorstep Delivery Address:</span>
                          </label>
                          <input
                            type="text"
                            value={deliveryAddress}
                            onChange={(e) => setDeliveryAddress(e.target.value)}
                            placeholder="Street address, Flat/House no., Landmark"
                            className="w-full px-3 py-1.5 rounded-xl bg-slate-900 border border-white/10 text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-emerald-400"
                          />
                        </div>
                        <div>
                          <input
                            type="text"
                            value={deliveryNotes}
                            onChange={(e) => setDeliveryNotes(e.target.value)}
                            placeholder="Rider instructions (e.g. Ring bell, leave at door)"
                            className="w-full px-3 py-1.5 rounded-xl bg-slate-900 border border-white/5 text-[11px] text-white placeholder:text-slate-600 focus:outline-none focus:border-emerald-400"
                          />
                        </div>
                      </div>
                    )}

                  </div>

                  {/* Customer Information */}
                  <div className="p-3.5 rounded-2xl bg-slate-950 border border-white/5 space-y-2">
                    <label className="text-[11px] font-semibold text-slate-300 uppercase tracking-wider block font-syne">
                      Customer Details:
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="relative">
                        <User className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-1/2 -translate-y-1/2" />
                        <input
                          type="text"
                          value={customerName}
                          onChange={(e) => setCustomerName(e.target.value)}
                          placeholder="Your Name"
                          className="w-full pl-8 pr-2 py-1.5 rounded-xl bg-slate-900 border border-white/5 text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-amber-400"
                        />
                      </div>
                      <div className="relative">
                        <Phone className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-1/2 -translate-y-1/2" />
                        <input
                          type="tel"
                          value={customerPhone}
                          onChange={(e) => setCustomerPhone(e.target.value)}
                          placeholder="Phone Number"
                          className="w-full pl-8 pr-2 py-1.5 rounded-xl bg-slate-900 border border-white/5 text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-amber-400 font-mono"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Cart Items List */}
                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                        Dishes &amp; Drinks ({itemCount})
                      </label>
                      <button
                        onClick={clearCart}
                        className="text-[11px] text-rose-400 hover:text-rose-300 flex items-center gap-1"
                      >
                        <Trash2 className="w-3 h-3" />
                        <span>Clear</span>
                      </button>
                    </div>

                    <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                      {cart.map((cartItem) => (
                        <div
                          key={cartItem.cartItemId}
                          className="p-3 rounded-2xl bg-slate-950 border border-white/5 flex items-center justify-between gap-3"
                        >
                          <div className="flex items-center gap-2.5 min-w-0 flex-1">
                            <img
                              src={cartItem.item.image}
                              alt={cartItem.item.name}
                              className="w-12 h-12 rounded-xl object-cover shrink-0"
                            />
                            <div className="min-w-0">
                              <h5 className="font-syne font-bold text-xs text-white truncate">
                                {cartItem.item.name}
                              </h5>
                              <p className="text-[10px] text-slate-400 font-mono mt-0.5">
                                ₹{cartItem.unitPrice} each
                                {cartItem.spice && ` • ${cartItem.spice}`}
                              </p>
                              {cartItem.addons.length > 0 && (
                                <p className="text-[9px] text-amber-300/80 font-mono truncate">
                                  +{cartItem.addons.map(a => a.name).join(', ')}
                                </p>
                              )}
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <div className="flex items-center rounded-xl bg-slate-900 border border-white/10 p-0.5">
                              <button
                                onClick={() => updateQuantity(cartItem.cartItemId, -1)}
                                className="w-6 h-6 rounded-lg flex items-center justify-center text-slate-400 hover:text-white"
                              >
                                <Minus className="w-3 h-3" />
                              </button>
                              <span className="w-6 text-center font-mono font-bold text-xs text-white">
                                {cartItem.quantity}
                              </span>
                              <button
                                onClick={() => updateQuantity(cartItem.cartItemId, 1)}
                                className="w-6 h-6 rounded-lg flex items-center justify-center text-slate-400 hover:text-white"
                              >
                                <Plus className="w-3 h-3" />
                              </button>
                            </div>
                            <button
                              onClick={() => removeFromCart(cartItem.cartItemId)}
                              className="text-slate-500 hover:text-rose-400 p-1"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Promo Code Input */}
                  <div className="p-3.5 rounded-2xl bg-slate-950 border border-white/5 space-y-2">
                    <label className="text-[11px] font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                      <Tag className="w-3.5 h-3.5 text-amber-400" />
                      <span>Apply Promo Coupon:</span>
                    </label>

                    {appliedPromo ? (
                      <div className="flex items-center justify-between p-2 rounded-xl bg-amber-400/10 border border-amber-400/30 text-xs">
                        <div>
                          <span className="font-mono font-bold text-amber-300 uppercase">
                            {appliedPromo.code}
                          </span>
                          <p className="text-[10px] text-slate-400">{appliedPromo.desc}</p>
                        </div>
                        <button
                          onClick={removePromoCode}
                          className="text-rose-400 hover:underline font-bold text-xs"
                        >
                          Remove
                        </button>
                      </div>
                    ) : (
                      <form onSubmit={handleApplyPromo} className="flex gap-2">
                        <input
                          type="text"
                          value={promoInput}
                          onChange={(e) => setPromoInput(e.target.value.toUpperCase())}
                          placeholder={operationalModel === 'loyalty' ? "e.g. LOYALTY50" : "e.g. CAFE10"}
                          className="flex-1 px-3 py-1.5 rounded-xl bg-slate-900 border border-white/5 text-xs text-white uppercase font-mono placeholder:text-slate-600 focus:outline-none focus:border-amber-400"
                        />
                        <button
                          type="submit"
                          className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold font-syne transition"
                        >
                          Apply
                        </button>
                      </form>
                    )}

                    {promoError && (
                      <p className="text-rose-400 text-[11px] font-mono">{promoError}</p>
                    )}
                  </div>

                  {/* Tip Kitchen */}
                  <div className="p-3.5 rounded-2xl bg-slate-950 border border-white/5 space-y-2">
                    <label className="text-[11px] font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                      <Heart className="w-3.5 h-3.5 text-rose-400" />
                      <span>Tip Cafe Crew:</span>
                    </label>
                    <div className="grid grid-cols-4 gap-2">
                      {[0, 20, 50, 100].map((amount) => (
                        <button
                          key={amount}
                          onClick={() => { sounds.playClick(); setTipAmount(amount); }}
                          className={`py-1.5 px-2 rounded-xl text-xs font-mono font-medium transition border ${
                            tipAmount === amount
                              ? 'bg-amber-400 text-slate-950 border-amber-400 font-bold'
                              : 'bg-slate-900 border-white/5 text-slate-400 hover:text-white'
                          }`}
                        >
                          {amount === 0 ? 'None' : `₹${amount}`}
                        </button>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Footer / Bill Breakdown */}
            {cart.length > 0 && (
              <div className="p-5 bg-slate-950 border-t border-white/5 space-y-3">
                <div className="space-y-1.5 text-xs text-slate-300">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span className="font-mono text-white">₹{subtotal}</span>
                  </div>
                  {discountAmount > 0 && (
                    <div className="flex justify-between text-amber-400 font-semibold">
                      <span>Promo Discount</span>
                      <span className="font-mono">-₹{discountAmount}</span>
                    </div>
                  )}
                  {isDeliveryActive && (
                    <div className="flex justify-between text-emerald-400">
                      <span>Doorstep Delivery Fee</span>
                      <span className="font-mono font-bold">
                        {deliveryFee === 0 ? 'FREE' : `+₹${deliveryFee}`}
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span>GST (5%)</span>
                    <span className="font-mono text-white">₹{gstAmount}</span>
                  </div>
                  {tipAmount > 0 && (
                    <div className="flex justify-between text-cyan-400">
                      <span>Crew Tip</span>
                      <span className="font-mono">+₹{tipAmount}</span>
                    </div>
                  )}
                  <div className="pt-2 border-t border-white/10 flex justify-between text-sm font-bold text-white">
                    <span className="font-syne">Total Bill</span>
                    <span className="font-mono text-amber-400 text-base">₹{grandTotal}</span>
                  </div>
                </div>

                <button
                  onClick={handleProceed}
                  className="w-full btn-3d btn-3d-amber py-3 rounded-2xl font-syne font-bold text-sm flex items-center justify-center gap-2 shadow-xl cursor-pointer"
                >
                  <span>
                    {diningMode === 'table'
                      ? `Proceed • Table #${tableInput || '4'}`
                      : diningMode === 'delivery'
                      ? 'Proceed to Delivery Checkout'
                      : 'Proceed to Counter Checkout'}
                  </span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}

          </motion.div>
        </div>
      </div>
    </AnimatePresence>
  );
}
