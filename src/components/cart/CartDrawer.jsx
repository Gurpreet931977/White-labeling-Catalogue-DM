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
  Award,
  Truck,
  MapPin,
  Gift,
  Calendar,
  Percent
} from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { BRAND_CONFIG } from '../../data/cafeConfig';
import { sounds } from '../../utils/audio';

export function CartDrawer({ 
  isOpen, 
  onClose, 
  onProceedToPayment, 
  onRequireAuth,
  onOpenReservation,
  onOpenLoyaltyModal
}) {
  const {
    cart,
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
  const { isLight } = useTheme();

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
        alert('Please specify a valid Table Number (e.g. 1 to 20)');
        return;
      }
      setActiveTable(num);
    } else if (diningMode === 'delivery') {
      if (!deliveryAddress || !deliveryAddress.trim()) {
        alert('Please enter a delivery address for doorstep order.');
        return;
      }
    }
    onProceedToPayment();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-hidden font-sans">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        />

        <div className="absolute inset-y-0 right-0 max-w-full flex pl-6 sm:pl-10">
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 26, stiffness: 240 }}
            className={`w-screen max-w-md flex flex-col justify-between shadow-2xl relative transition-colors duration-300 ${
              isLight 
                ? 'bg-[#FAF7F2] text-[#12100E] border-l border-[#E8E2D5]' 
                : 'bg-[#141210] text-[#FAF7F2] border-l border-white/10'
            }`}
          >
            {/* 1. Masthead Header */}
            <div className={`p-5 flex items-center justify-between border-b transition-colors ${
              isLight 
                ? 'bg-white/80 border-[#E8E2D5]' 
                : 'bg-[#0E0C0B]/90 border-white/10'
            }`}>
              <div className="flex items-center gap-3">
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs shadow-sm transition-colors ${
                  isLight 
                    ? 'bg-[#12100E] text-[#FAF7F2]' 
                    : 'bg-[#FAF7F2] text-[#12100E]'
                }`}>
                  <ShoppingBag className="w-4 h-4" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-editorial text-lg tracking-tight font-normal">
                      Your Order
                    </h3>
                    <span className={`text-[10px] font-mono tracking-widest uppercase px-1.5 py-0.5 rounded border ${
                      isLight 
                        ? 'border-stone-300 text-stone-600 bg-stone-100' 
                        : 'border-stone-800 text-stone-400 bg-stone-900'
                    }`}>
                      {itemCount} {itemCount === 1 ? 'item' : 'items'}
                    </span>
                  </div>
                  <p className={`text-[11px] font-mono uppercase tracking-wider ${
                    isLight ? 'text-stone-500' : 'text-stone-400'
                  }`}>
                    {BRAND_CONFIG.brandName} • Order Slip
                  </p>
                </div>
              </div>

              <button
                onClick={() => { sounds.playClick(); onClose(); }}
                className={`p-2 rounded-xl border transition-all ${
                  isLight 
                    ? 'border-[#E8E2D5] text-stone-600 hover:text-black hover:bg-stone-100' 
                    : 'border-white/10 text-stone-400 hover:text-white hover:bg-white/5'
                }`}
                aria-label="Close cart"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* 2. Scrollable Items & Controls Body */}
            <div className="flex-1 overflow-y-auto p-5 space-y-4">
              
              {/* BRAND SHOWCASE NOTICE */}
              {operationalModel === 'showcase' && (
                <div className={`p-4 rounded-2xl border text-center space-y-2 ${
                  isLight 
                    ? 'bg-amber-50/70 border-amber-200/80 text-stone-800' 
                    : 'bg-amber-950/20 border-amber-500/20 text-stone-300'
                }`}>
                  <span className="text-[10px] font-mono font-bold uppercase tracking-widest px-2 py-0.5 rounded-full bg-amber-400/20 text-amber-700 dark:text-amber-300">
                    Showcase Archetype Active
                  </span>
                  <p className="text-xs leading-relaxed">
                    Digital in-store checkout is in showcase mode. Explore the curated culinary lookbook or book a table in advance!
                  </p>
                  {onOpenReservation && (
                    <button
                      onClick={() => { onClose(); onOpenReservation(); }}
                      className="px-4 py-2 rounded-xl text-xs font-syne font-bold flex items-center justify-center gap-1.5 mx-auto bg-[#12100E] text-white hover:bg-black transition cursor-pointer"
                    >
                      <Calendar className="w-3.5 h-3.5" />
                      <span>Book a Table Reservation</span>
                    </button>
                  )}
                </div>
              )}

              {/* LOYALTY CARD MINI STAMP WIDGET */}
              {operationalModel === 'loyalty' && (
                <div 
                  onClick={onOpenLoyaltyModal}
                  className={`p-3.5 rounded-2xl border space-y-2 cursor-pointer transition group ${
                    isLight 
                      ? 'bg-white border-[#E8E2D5] hover:border-stone-400' 
                      : 'bg-[#1C1917] border-white/10 hover:border-white/20'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1.5">
                      <Award className="w-4 h-4 text-[#D04834]" />
                      <span className="font-syne font-bold text-xs tracking-wide">
                        The 7-Visit Loyalty Pass
                      </span>
                    </div>
                    <span className="text-[10px] font-mono font-bold text-[#D04834]">
                      {is7thVisitUnlocked ? '7 of 7 UNLOCKED' : `${loyaltyVisits} of 7 Stamps`}
                    </span>
                  </div>

                  {/* 7 Micro Stamp Dots */}
                  <div className="flex items-center justify-between gap-1.5 pt-1">
                    {[1, 2, 3, 4, 5, 6, 7].map((s) => (
                      <div
                        key={s}
                        className={`flex-1 h-2 rounded-full transition-all ${
                          loyaltyVisits >= s
                            ? 'bg-[#D04834]'
                            : s === 7
                            ? 'bg-amber-400/40 border border-amber-400/60'
                            : isLight ? 'bg-stone-200' : 'bg-stone-800'
                        }`}
                        title={`Stamp #${s}`}
                      />
                    ))}
                  </div>

                  {is7thVisitUnlocked ? (
                    <div className="pt-1">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          claim7thVisitReward();
                        }}
                        className="w-full py-1.5 rounded-xl bg-[#D04834] text-white font-syne font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm hover:brightness-105 transition cursor-pointer"
                      >
                        <Gift className="w-3.5 h-3.5" />
                        <span>Apply 50% OFF (7th Visit Reward)</span>
                      </button>
                    </div>
                  ) : (
                    <p className={`text-[10px] font-mono flex items-center justify-between ${
                      isLight ? 'text-stone-500' : 'text-stone-400'
                    }`}>
                      <span>{7 - loyaltyVisits} more visits to unlock 50% OFF</span>
                      <span className="text-[#D04834] group-hover:underline">View Pass &rarr;</span>
                    </p>
                  )}
                </div>
              )}

              {/* EMPTY STATE */}
              {cart.length === 0 ? (
                <div className="text-center py-16 space-y-4">
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mx-auto border ${
                    isLight 
                      ? 'bg-white border-[#E8E2D5] text-stone-400' 
                      : 'bg-white/5 border-white/10 text-stone-500'
                  }`}>
                    <ShoppingBag className="w-6 h-6" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="font-editorial text-xl">Your cart is empty</h4>
                    <p className={`text-xs max-w-xs mx-auto leading-relaxed ${
                      isLight ? 'text-stone-500' : 'text-stone-400'
                    }`}>
                      Your selection is empty. Discover our wood-fired pizzas, artisanal pastas, and specialty coffees.
                    </p>
                  </div>
                  <button
                    onClick={() => { sounds.playClick(); onClose(); }}
                    className={`px-5 py-2.5 rounded-xl text-xs font-syne font-bold uppercase tracking-wider transition ${
                      isLight 
                        ? 'bg-[#12100E] text-[#FAF7F2] hover:bg-stone-800' 
                        : 'bg-[#FAF7F2] text-[#12100E] hover:bg-stone-200'
                    }`}
                  >
                    Explore Menu
                  </button>
                </div>
              ) : (
                <>
                  {/* FULFILLMENT MODE SELECTOR */}
                  <div className={`p-4 rounded-2xl border space-y-3 transition-colors ${
                    isLight 
                      ? 'bg-white border-[#E8E2D5]' 
                      : 'bg-[#1C1917] border-white/10'
                  }`}>
                    
                    {/* CASE 1: SELF-SERVE */}
                    {operationalModel === 'self-serve' && (
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 font-syne font-bold text-xs">
                          <Store className="w-3.5 h-3.5 text-[#D04834]" />
                          <span>Self-Serve Express Counter</span>
                        </div>
                        <p className={`text-[11px] leading-relaxed ${
                          isLight ? 'text-stone-500' : 'text-stone-400'
                        }`}>
                          Direct counter pickup. An order token (e.g. <strong className="font-mono font-bold">#C-14</strong>) will be issued upon payment.
                        </p>
                      </div>
                    )}

                    {/* CASE 2: DIRECT DELIVERY */}
                    {operationalModel === 'delivery' && (
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 font-syne font-bold text-xs">
                          <Truck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                          <span>Doorstep Express Courier</span>
                        </div>
                        <p className={`text-[11px] ${isLight ? 'text-stone-500' : 'text-stone-400'}`}>
                          Estimated ETA: <strong className="font-mono">30-40 Mins</strong> • Zero aggregator markups
                        </p>
                      </div>
                    )}

                    {/* CASE 3: HYBRID 3-WAY */}
                    {operationalModel === 'hybrid' && (
                      <div className="space-y-2">
                        <label className={`text-[10px] font-mono uppercase tracking-widest block font-bold ${
                          isLight ? 'text-stone-500' : 'text-stone-400'
                        }`}>
                          Dining Mode / Fulfillment:
                        </label>
                        <div className="grid grid-cols-3 gap-1.5">
                          {[
                            { id: 'table', label: 'Dine-In', icon: QrCode },
                            { id: 'delivery', label: 'Delivery', icon: Truck },
                            { id: 'counter', label: 'Counter', icon: Store }
                          ].map((tab) => {
                            const Icon = tab.icon;
                            const isActive = diningMode === tab.id;
                            return (
                              <button
                                key={tab.id}
                                onClick={() => { sounds.playClick(); setDiningMode(tab.id); }}
                                className={`p-2 rounded-xl text-xs font-syne font-bold transition flex items-center justify-center gap-1.5 border ${
                                  isActive
                                    ? isLight
                                      ? 'bg-[#12100E] text-[#FAF7F2] border-[#12100E] shadow-xs'
                                      : 'bg-[#FAF7F2] text-[#12100E] border-[#FAF7F2] shadow-xs'
                                    : isLight
                                    ? 'bg-stone-50 border-stone-200 text-stone-600 hover:text-stone-900'
                                    : 'bg-[#0E0C0B] border-white/5 text-stone-400 hover:text-white'
                                }`}
                              >
                                <Icon className="w-3.5 h-3.5" />
                                <span>{tab.label}</span>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {/* CASE 4: TABLE-QR OR DEFAULT */}
                    {(operationalModel === 'table-qr' || operationalModel === 'loyalty') && (
                      <div className="space-y-2">
                        <label className={`text-[10px] font-mono uppercase tracking-widest block font-bold ${
                          isLight ? 'text-stone-500' : 'text-stone-400'
                        }`}>
                          Dining Mode:
                        </label>
                        <div className="grid grid-cols-2 gap-2">
                          <button
                            onClick={() => { sounds.playClick(); setDiningMode('table'); }}
                            className={`p-2.5 rounded-xl border text-xs font-syne font-bold flex items-center justify-center gap-2 transition ${
                              diningMode === 'table'
                                ? isLight
                                  ? 'bg-[#12100E] text-[#FAF7F2] border-[#12100E] shadow-sm'
                                  : 'bg-[#FAF7F2] text-[#12100E] border-[#FAF7F2] shadow-sm'
                                : isLight
                                ? 'bg-stone-50 border-stone-200 text-stone-600 hover:text-stone-900'
                                : 'bg-[#0E0C0B] border-white/5 text-stone-400 hover:text-white'
                            }`}
                          >
                            <QrCode className="w-3.5 h-3.5" />
                            <span>Dine-In Table</span>
                          </button>
                          <button
                            onClick={() => { sounds.playClick(); setDiningMode('counter'); }}
                            className={`p-2.5 rounded-xl border text-xs font-syne font-bold flex items-center justify-center gap-2 transition ${
                              diningMode === 'counter'
                                ? isLight
                                  ? 'bg-[#12100E] text-[#FAF7F2] border-[#12100E] shadow-sm'
                                  : 'bg-[#FAF7F2] text-[#12100E] border-[#FAF7F2] shadow-sm'
                                : isLight
                                ? 'bg-stone-50 border-stone-200 text-stone-600 hover:text-stone-900'
                                : 'bg-[#0E0C0B] border-white/5 text-stone-400 hover:text-white'
                            }`}
                          >
                            <Store className="w-3.5 h-3.5" />
                            <span>Counter Pickup</span>
                          </button>
                        </div>
                      </div>
                    )}

                    {/* TABLE NUMBER INPUT */}
                    {diningMode === 'table' && (
                      <div className={`pt-2.5 border-t flex items-center justify-between gap-3 text-xs ${
                        isLight ? 'border-stone-200' : 'border-white/10'
                      }`}>
                        <span className={`font-medium ${isLight ? 'text-stone-700' : 'text-stone-300'}`}>
                          Table Number:
                        </span>
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs font-number font-bold text-[#D04834]">TABLE</span>
                          <input
                            type="number"
                            min="1"
                            max="20"
                            value={tableInput}
                            onChange={(e) => handleTableChange(e.target.value)}
                            className={`w-14 px-2 py-1 rounded-lg border font-number font-bold text-center text-sm focus:outline-none transition ${
                              isLight 
                                ? 'bg-stone-50 border-stone-300 text-stone-900 focus:border-[#12100E]' 
                                : 'bg-[#0E0C0B] border-white/10 text-white focus:border-white/30'
                            }`}
                          />
                        </div>
                      </div>
                    )}

                    {/* DELIVERY ADDRESS INPUT */}
                    {(diningMode === 'delivery' || operationalModel === 'delivery') && (
                      <div className={`pt-2.5 border-t space-y-2 ${
                        isLight ? 'border-stone-200' : 'border-white/10'
                      }`}>
                        <div>
                          <label className={`text-[10px] font-mono mb-1 flex items-center gap-1 ${
                            isLight ? 'text-stone-600' : 'text-stone-400'
                          }`}>
                            <MapPin className="w-3 h-3 text-[#D04834]" />
                            <span>Delivery Address:</span>
                          </label>
                          <input
                            type="text"
                            value={deliveryAddress}
                            onChange={(e) => setDeliveryAddress(e.target.value)}
                            placeholder="Street address, apartment, building"
                            className={`w-full px-3 py-1.5 rounded-xl border text-xs focus:outline-none transition ${
                              isLight 
                                ? 'bg-stone-50 border-stone-300 text-stone-900 focus:border-[#12100E]' 
                                : 'bg-[#0E0C0B] border-white/10 text-white focus:border-white/30'
                            }`}
                          />
                        </div>
                        <div>
                          <input
                            type="text"
                            value={deliveryNotes}
                            onChange={(e) => setDeliveryNotes(e.target.value)}
                            placeholder="Courier notes (e.g. Ring bell, leave at door)"
                            className={`w-full px-3 py-1.5 rounded-xl border text-[11px] focus:outline-none transition ${
                              isLight 
                                ? 'bg-stone-50 border-stone-200 text-stone-800' 
                                : 'bg-[#0E0C0B] border-white/5 text-stone-300'
                            }`}
                          />
                        </div>
                      </div>
                    )}

                  </div>

                  {/* CUSTOMER INFORMATION */}
                  <div className={`p-4 rounded-2xl border space-y-2.5 transition-colors ${
                    isLight 
                      ? 'bg-white border-[#E8E2D5]' 
                      : 'bg-[#1C1917] border-white/10'
                  }`}>
                    <label className={`text-[10px] font-mono uppercase tracking-widest block font-bold ${
                      isLight ? 'text-stone-500' : 'text-stone-400'
                    }`}>
                      Guest Information:
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="relative">
                        <User className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                          type="text"
                          value={customerName}
                          onChange={(e) => setCustomerName(e.target.value)}
                          placeholder="Your Name"
                          className={`w-full pl-8 pr-2.5 py-1.5 rounded-xl border text-xs focus:outline-none transition ${
                            isLight 
                              ? 'bg-stone-50 border-stone-300 text-stone-900 placeholder:text-stone-400 focus:border-[#12100E]' 
                              : 'bg-[#0E0C0B] border-white/10 text-white placeholder:text-stone-600 focus:border-white/30'
                          }`}
                        />
                      </div>
                      <div className="relative">
                        <Phone className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                          type="tel"
                          value={customerPhone}
                          onChange={(e) => setCustomerPhone(e.target.value)}
                          placeholder="Phone Number"
                          className={`w-full pl-8 pr-2.5 py-1.5 rounded-xl border text-xs font-mono focus:outline-none transition ${
                            isLight 
                              ? 'bg-stone-50 border-stone-300 text-stone-900 placeholder:text-stone-400 focus:border-[#12100E]' 
                              : 'bg-[#0E0C0B] border-white/10 text-white placeholder:text-stone-600 focus:border-white/30'
                          }`}
                        />
                      </div>
                    </div>
                  </div>

                  {/* CART ITEMS LIST */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <label className={`text-[10px] font-mono uppercase tracking-widest font-bold ${
                        isLight ? 'text-stone-500' : 'text-stone-400'
                      }`}>
                        Selected Items ({itemCount})
                      </label>
                      <button
                        onClick={clearCart}
                        className="text-[11px] text-[#D04834] hover:underline flex items-center gap-1 font-mono"
                      >
                        <Trash2 className="w-3 h-3" />
                        <span>Clear</span>
                      </button>
                    </div>

                    <div className="space-y-2 max-h-56 overflow-y-auto pr-0.5">
                      {cart.map((cartItem) => (
                        <div
                          key={cartItem.cartItemId}
                          className={`p-3 rounded-2xl border flex items-center justify-between gap-3 transition-colors ${
                            isLight 
                              ? 'bg-white border-[#E8E2D5]' 
                              : 'bg-[#1C1917] border-white/10'
                          }`}
                        >
                          <div className="flex items-center gap-3 min-w-0 flex-1">
                            <img
                              src={cartItem.item.image}
                              alt={cartItem.item.name}
                              className="w-12 h-12 rounded-xl object-cover shrink-0 border border-stone-200/50"
                            />
                            <div className="min-w-0">
                              <h5 className="font-editorial text-sm truncate leading-snug">
                                {cartItem.item.name}
                              </h5>
                              <p className={`text-xs font-number font-bold mt-0.5 ${
                                isLight ? 'text-stone-700' : 'text-stone-300'
                              }`}>
                                ₹{cartItem.unitPrice} <span className="text-[10px] font-normal text-stone-400">each</span>
                                {cartItem.spice && ` • ${cartItem.spice}`}
                              </p>
                              {cartItem.addons.length > 0 && (
                                <p className="text-[9px] text-[#D04834] font-number font-semibold truncate">
                                  +{cartItem.addons.map(a => a.name).join(', ')}
                                </p>
                              )}
                            </div>
                          </div>

                          <div className="flex items-center gap-2 shrink-0">
                            <div className={`flex items-center rounded-xl p-0.5 border ${
                              isLight 
                                ? 'bg-stone-100 border-stone-200' 
                                : 'bg-[#0E0C0B] border-white/10'
                            }`}>
                              <button
                                onClick={() => updateQuantity(cartItem.cartItemId, -1)}
                                className={`w-6 h-6 rounded-lg flex items-center justify-center transition ${
                                  isLight 
                                    ? 'text-stone-700 hover:bg-white' 
                                    : 'text-stone-400 hover:text-white hover:bg-white/10'
                                }`}
                              >
                                <Minus className="w-3 h-3" />
                              </button>
                              <span className="w-6 text-center font-number font-bold text-sm">
                                {cartItem.quantity}
                              </span>
                              <button
                                onClick={() => updateQuantity(cartItem.cartItemId, 1)}
                                className={`w-6 h-6 rounded-lg flex items-center justify-center transition ${
                                  isLight 
                                    ? 'text-stone-700 hover:bg-white' 
                                    : 'text-stone-400 hover:text-white hover:bg-white/10'
                                }`}
                              >
                                <Plus className="w-3 h-3" />
                              </button>
                            </div>
                            <button
                              onClick={() => removeFromCart(cartItem.cartItemId)}
                              className="text-stone-400 hover:text-[#D04834] p-1 transition"
                              title="Remove item"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* PROMO CODE SLIP */}
                  <div className={`p-3.5 rounded-2xl border space-y-2 transition-colors ${
                    isLight 
                      ? 'bg-white border-[#E8E2D5]' 
                      : 'bg-[#1C1917] border-white/10'
                  }`}>
                    <label className={`text-[10px] font-mono uppercase tracking-widest flex items-center gap-1.5 font-bold ${
                      isLight ? 'text-stone-500' : 'text-stone-400'
                    }`}>
                      <Percent className="w-3 h-3 text-[#D04834]" />
                      <span>Promo Code:</span>
                    </label>

                    {appliedPromo ? (
                      <div className="flex items-center justify-between p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs">
                        <div>
                          <span className="font-mono font-bold text-emerald-700 dark:text-emerald-400 uppercase">
                            {appliedPromo.code}
                          </span>
                          <p className="text-[10px] text-stone-500">{appliedPromo.desc}</p>
                        </div>
                        <button
                          onClick={removePromoCode}
                          className="text-[#D04834] hover:underline font-bold text-xs"
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
                          className={`flex-1 px-3 py-1.5 rounded-xl border text-xs uppercase font-mono focus:outline-none transition ${
                            isLight 
                              ? 'bg-stone-50 border-stone-300 text-stone-900 placeholder:text-stone-400 focus:border-[#12100E]' 
                              : 'bg-[#0E0C0B] border-white/10 text-white placeholder:text-stone-600 focus:border-white/30'
                          }`}
                        />
                        <button
                          type="submit"
                          className={`px-3 py-1.5 rounded-xl text-xs font-syne font-bold transition ${
                            isLight 
                              ? 'bg-[#12100E] text-white hover:bg-stone-800' 
                              : 'bg-[#FAF7F2] text-[#12100E] hover:bg-stone-200'
                          }`}
                        >
                          Apply
                        </button>
                      </form>
                    )}

                    {promoError && (
                      <p className="text-[#D04834] text-[11px] font-mono">{promoError}</p>
                    )}
                  </div>

                  {/* TIP THE BRIGADE */}
                  <div className={`p-3.5 rounded-2xl border space-y-2 transition-colors ${
                    isLight 
                      ? 'bg-white border-[#E8E2D5]' 
                      : 'bg-[#1C1917] border-white/10'
                  }`}>
                    <label className={`text-[10px] font-mono uppercase tracking-widest flex items-center gap-1.5 font-bold ${
                      isLight ? 'text-stone-500' : 'text-stone-400'
                    }`}>
                      <Heart className="w-3 h-3 text-[#D04834]" />
                      <span>Tip the Cafe Staff:</span>
                    </label>
                    <div className="grid grid-cols-4 gap-2">
                      {[0, 20, 50, 100].map((amount) => (
                        <button
                          key={amount}
                          onClick={() => { sounds.playClick(); setTipAmount(amount); }}
                          className={`py-1.5 px-2 rounded-xl text-xs font-number font-bold transition border ${
                            tipAmount === amount
                              ? isLight
                                ? 'bg-[#12100E] text-white border-[#12100E] shadow-xs'
                                : 'bg-[#FAF7F2] text-[#12100E] border-[#FAF7F2] shadow-xs'
                              : isLight
                              ? 'bg-stone-50 border-stone-200 text-stone-600 hover:text-stone-900'
                              : 'bg-[#0E0C0B] border-white/5 text-stone-400 hover:text-white'
                          }`}
                        >
                          {amount === 0 ? 'None' : `+₹${amount}`}
                        </button>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* 3. Footer / Bill Summary & Primary CTA */}
            {cart.length > 0 && (
              <div className={`p-5 border-t space-y-3 transition-colors ${
                isLight 
                  ? 'bg-white border-[#E8E2D5]' 
                  : 'bg-[#0E0C0B] border-white/10'
              }`}>
                <div className={`space-y-1.5 text-xs ${isLight ? 'text-stone-600' : 'text-stone-300'}`}>
                  <div className="flex justify-between items-baseline">
                    <span>Subtotal</span>
                    <span className="font-number font-bold text-sm">₹{subtotal}</span>
                  </div>
                  {discountAmount > 0 && (
                    <div className="flex justify-between items-baseline text-[#D04834] font-medium">
                      <span>Promo Discount</span>
                      <span className="font-number font-bold text-sm">-₹{discountAmount}</span>
                    </div>
                  )}
                  {isDeliveryActive && (
                    <div className="flex justify-between items-baseline text-emerald-600 dark:text-emerald-400 font-medium">
                      <span>Delivery Fee</span>
                      <span className="font-number font-bold text-sm">
                        {deliveryFee === 0 ? 'FREE' : `+₹${deliveryFee}`}
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between items-baseline">
                    <span>GST (5%)</span>
                    <span className="font-number font-bold text-sm">₹{gstAmount}</span>
                  </div>
                  {tipAmount > 0 && (
                    <div className="flex justify-between items-baseline text-[#D04834]">
                      <span>Staff Tip</span>
                      <span className="font-number font-bold text-sm">+₹{tipAmount}</span>
                    </div>
                  )}
                  <div className={`pt-2 border-t flex justify-between items-baseline font-bold ${
                    isLight ? 'border-stone-200 text-[#12100E]' : 'border-white/10 text-white'
                  }`}>
                    <span className="font-editorial text-base">Grand Total</span>
                    <span className="font-number text-2xl font-bold text-[#D04834]">₹{grandTotal}</span>
                  </div>
                </div>

                <button
                  onClick={handleProceed}
                  className={`w-full py-3.5 rounded-2xl font-syne font-bold text-sm flex items-center justify-center gap-2 shadow-lg transition-transform active:scale-[0.99] cursor-pointer ${
                    isLight 
                      ? 'bg-[#12100E] text-[#FAF7F2] hover:bg-stone-800' 
                      : 'bg-[#FAF7F2] text-[#12100E] hover:bg-stone-200'
                  }`}
                >
                  <span className="tracking-wide">
                    {diningMode === 'table'
                      ? `PROCEED • TABLE #${tableInput || '4'}`
                      : diningMode === 'delivery'
                      ? 'PROCEED TO DELIVERY'
                      : 'PROCEED TO PICKUP'}
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
