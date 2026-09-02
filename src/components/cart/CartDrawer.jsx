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
  Award
} from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { CAFE_CONFIG } from '../../data/cafeConfig';
import { MENU_ITEMS } from '../../data/menuData';
import { sounds } from '../../utils/audio';

const UPSELL_CANDIDATES = [
  "chai-elaichi",
  "bun-maska-classic",
  "fries-peri-peri",
  "blue-lagoon",
  "brownie-sizzler"
];

export function CartDrawer({ isOpen, onClose, onProceedToPayment, onOpenScanner, onRequireAuth }) {
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
          onClick={() => { sounds.playClick(); onClose(); }}
          className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        />

        <div className="fixed inset-y-0 right-0 max-w-full flex sm:pl-8">
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
                  <h3 className="font-syne font-bold text-white text-base">Your Highway Order</h3>
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
            <div className="flex-1 overflow-y-auto p-5 space-y-5">
              {cart.length === 0 ? (
                <div className="text-center py-20 space-y-3">
                  <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center mx-auto text-amber-400">
                    <ShoppingBag className="w-6 h-6" />
                  </div>
                  <h4 className="text-white font-syne font-bold text-base">Your Cart is Empty</h4>
                  <p className="text-slate-400 text-xs max-w-xs mx-auto">
                    Add steaming Mussoorie Maggi, smokey burgers, or kadak chai to fuel your pitstop.
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
                  {/* Dining Mode Selector */}
                  <div className="p-3.5 rounded-2xl bg-slate-950 border border-white/5 space-y-2.5">
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
                        Dishes
                      </label>
                      <button
                        onClick={clearCart}
                        className="text-[11px] text-rose-400 hover:underline font-mono"
                      >
                        Clear All
                      </button>
                    </div>

                    {cart.map((cartItem) => (
                      <div
                        key={cartItem.cartItemId}
                        className="p-3 rounded-2xl bg-slate-950 border border-white/5 flex items-start justify-between gap-3"
                      >
                        <div className="flex-1 space-y-1">
                          <div className="flex items-center gap-1.5">
                            <span
                              className={`w-2 h-2 rounded-full ${
                                cartItem.item.isVeg ? 'bg-emerald-400' : 'bg-rose-500'
                              }`}
                            />
                            <h5 className="font-bold text-white text-xs font-syne">
                              {cartItem.item.name}
                            </h5>
                          </div>

                          <div className="flex flex-wrap gap-1 text-[10px] text-slate-400 font-mono">
                            {cartItem.spice && (
                              <span className="px-1.5 py-0.2 rounded bg-slate-900 text-rose-300">
                                {cartItem.spice}
                              </span>
                            )}
                            {cartItem.addons && cartItem.addons.map(a => (
                              <span key={a.id} className="px-1.5 py-0.2 rounded bg-slate-900 text-amber-300">
                                +{a.name}
                              </span>
                            ))}
                          </div>

                          <div className="text-xs font-mono font-semibold text-white pt-0.5">
                            ₹{cartItem.unitPrice} × {cartItem.quantity} ={' '}
                            <span className="text-amber-300 font-bold">₹{cartItem.totalPrice}</span>
                          </div>
                        </div>

                        {/* Quantity Controller & Delete */}
                        <div className="flex flex-col items-end gap-2">
                          <button
                            onClick={() => removeFromCart(cartItem.cartItemId)}
                            className="text-slate-500 hover:text-rose-400 p-0.5 transition"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>

                          <div className="flex items-center gap-1.5 bg-slate-900 px-2 py-1 rounded-lg border border-white/5">
                            <button
                              onClick={() => updateQuantity(cartItem.cartItemId, -1)}
                              className="text-slate-400 hover:text-white"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="text-xs font-mono font-bold text-white px-1">
                              {cartItem.quantity}
                            </span>
                            <button
                              onClick={() => updateQuantity(cartItem.cartItemId, 1)}
                              className="text-slate-400 hover:text-white"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Frequently Paired With / Smart Combos (DotPe-style Upselling) */}
                  {MENU_ITEMS.filter(item => 
                    UPSELL_CANDIDATES.includes(item.id) && !cart.some(c => c.item.id === item.id)
                  ).slice(0, 3).length > 0 && (
                    <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-white/10 space-y-2.5">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-bold text-amber-300 font-syne uppercase tracking-wider flex items-center gap-1.5">
                          <Award className="w-3.5 h-3.5 text-amber-400" />
                          <span>Frequently Paired With</span>
                        </span>
                        <span className="text-[10px] text-slate-500 font-mono">1-Tap Add</span>
                      </div>

                      <div className="space-y-2">
                        {MENU_ITEMS.filter(item => 
                          UPSELL_CANDIDATES.includes(item.id) && !cart.some(c => c.item.id === item.id)
                        ).slice(0, 3).map(upItem => (
                          <div
                            key={upItem.id}
                            className="p-2 rounded-xl bg-slate-900 border border-white/5 flex items-center justify-between gap-2.5 hover:border-amber-400/30 transition"
                          >
                            <div className="flex items-center gap-2.5 min-w-0">
                              <img
                                src={upItem.image}
                                alt={upItem.name}
                                className="w-10 h-10 rounded-lg object-cover shrink-0 border border-white/5"
                              />
                              <div className="min-w-0">
                                <p className="text-xs font-bold text-white truncate font-syne">{upItem.name}</p>
                                <p className="text-[11px] font-mono text-amber-400 font-bold">₹{upItem.price}</p>
                              </div>
                            </div>

                            <button
                              onClick={() => {
                                sounds.playAddToCart();
                                addToCart(upItem);
                              }}
                              className="btn-3d btn-3d-amber py-1 px-3 rounded-xl text-xs font-bold shrink-0 flex items-center gap-1"
                            >
                              <Plus className="w-3 h-3 stroke-[2.5]" />
                              <span>Add</span>
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Promo Code */}
                  <div className="p-3.5 rounded-2xl bg-slate-950 border border-white/5 space-y-2">
                    <label className="text-[11px] font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                      <Tag className="w-3.5 h-3.5 text-amber-400" />
                      <span>Promo Code</span>
                    </label>

                    {appliedPromo ? (
                      <div className="p-2 rounded-xl bg-amber-400/10 border border-amber-400/30 flex items-center justify-between text-xs">
                        <div>
                          <span className="font-mono font-bold text-amber-300 uppercase">
                            {appliedPromo.code} Applied
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
                          placeholder="e.g. HIGHWAY10"
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
                      <span>Tip Kitchen Crew:</span>
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
                  <div className="pt-2 border-t border-white/5 flex justify-between items-center text-sm font-bold">
                    <span className="text-white font-syne">Total</span>
                    <span className="text-lg font-bold text-amber-400 font-syne">
                      ₹{grandTotal}
                    </span>
                  </div>
                </div>

                {/* Proceed Button */}
                <button
                  onClick={handleProceed}
                  className="w-full py-3.5 px-5 rounded-2xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-syne font-bold text-sm shadow-md transition flex items-center justify-between group"
                >
                  <div className="flex items-center gap-2">
                    <span>PROCEED TO PAYMENT</span>
                    {!isCustomerLoggedIn && <Lock className="w-3.5 h-3.5" />}
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
                  </div>
                  <span className="font-mono font-bold">₹{grandTotal}</span>
                </button>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </AnimatePresence>
  );
}
