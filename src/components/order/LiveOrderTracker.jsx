import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  CheckCircle2, 
  Clock, 
  ChefHat, 
  Bell, 
  Phone, 
  UtensilsCrossed, 
  ArrowLeft,
  Receipt,
  MapPin,
  Flame,
  Truck,
  Store,
  AlertTriangle,
  Banknote
} from 'lucide-react';
import { useOrder } from '../../context/OrderContext';
import { useTheme } from '../../context/ThemeContext';
import { BRAND_CONFIG } from '../../data/cafeConfig';
import { sounds } from '../../utils/audio';

export function LiveOrderTracker({ onOrderMore, onBackHome }) {
  const { activeCustomerOrder } = useOrder();
  const { isLight } = useTheme();
  const [minsLeft, setMinsLeft] = useState(12);

  useEffect(() => {
    if (activeCustomerOrder?.estimatedMins) {
      setMinsLeft(activeCustomerOrder.estimatedMins);
    }
  }, [activeCustomerOrder]);

  if (!activeCustomerOrder) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center p-6 space-y-4 font-sans">
        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mx-auto border ${
          isLight ? 'bg-white border-[#E8E2D5] text-[#12100E]' : 'bg-white/5 border-white/10 text-white'
        }`}>
          <Receipt className="w-6 h-6 text-[#D04834]" />
        </div>
        <div className="space-y-1">
          <h3 className="text-2xl font-editorial tracking-tight font-normal">
            No Active Orders
          </h3>
          <p className={`text-xs max-w-sm mx-auto leading-relaxed ${isLight ? 'text-stone-500' : 'text-stone-400'}`}>
            You have no active orders in preparation. Browse our curated menu lookbook to place an order.
          </p>
        </div>
        <button
          onClick={() => { sounds.playClick(); onOrderMore(); }}
          className={`px-6 py-3 rounded-2xl font-syne font-bold text-xs uppercase tracking-wider transition ${
            isLight ? 'bg-[#12100E] text-[#FAF7F2] hover:bg-stone-800' : 'bg-[#FAF7F2] text-[#12100E] hover:bg-stone-200'
          }`}
        >
          Explore Menu
        </button>
      </div>
    );
  }

  const isCounterPaymentPending = activeCustomerOrder.paymentStatus !== 'paid' && activeCustomerOrder.diningMode !== 'delivery';

  const steps = activeCustomerOrder.diningMode === 'delivery'
    ? [
        { key: 'placed', label: '1. Placed', desc: 'Received and dispatched to kitchen station', icon: Receipt },
        { key: 'cooking', label: '2. In Kitchen', desc: 'Chef preparing freshly handcrafted dishes', icon: ChefHat },
        { key: 'ready', label: '3. Out for Delivery', desc: 'Courier rider on route to your doorstep', icon: Truck },
        { key: 'served', label: '4. Delivered', desc: 'Arrived hot at your door. Enjoy!', icon: CheckCircle2 }
      ]
    : isCounterPaymentPending
    ? [
        { 
          key: 'placed', 
          label: '1. Pay at Counter', 
          desc: `Food on hold. Please visit the billing counter to pay ₹${activeCustomerOrder.total}.`, 
          icon: Banknote 
        },
        { 
          key: 'cooking', 
          label: '2. In Kitchen', 
          desc: 'Chefs fire dishes to the kitchen immediately after counter payment is recorded.', 
          icon: ChefHat 
        },
        { 
          key: 'ready', 
          label: '3. Serving', 
          desc: activeCustomerOrder.pickupToken ? 'Ready for tray collection at pickup window' : `Service heading to Table #${activeCustomerOrder.tableNumber || '04'}`, 
          icon: Bell 
        },
        { 
          key: 'served', 
          label: '4. Served', 
          desc: 'Order served. Enjoy your dining experience!', 
          icon: CheckCircle2 
        }
      ]
    : (activeCustomerOrder.diningMode === 'counter' || activeCustomerOrder.pickupToken)
    ? [
        { key: 'placed', label: '1. Placed', desc: `${activeCustomerOrder.pickupToken || 'Queue Token'} active in queue`, icon: Receipt },
        { key: 'cooking', label: '2. Preparing', desc: 'Crafting at the express counter station', icon: ChefHat },
        { key: 'ready', label: '3. Ready', desc: 'Ready for tray collection at pickup window', icon: Bell },
        { key: 'served', label: '4. Collected', desc: 'Collected. Enjoy your meal!', icon: CheckCircle2 }
      ]
    : [
        { key: 'placed', label: '1. Placed', desc: 'Order received at kitchen terminal', icon: Receipt },
        { key: 'cooking', label: '2. Preparing', desc: 'Handcrafting dishes with fresh ingredients', icon: ChefHat },
        { key: 'ready', label: '3. Serving', desc: `Service heading to Table #${activeCustomerOrder.tableNumber || '04'}`, icon: Bell },
        { key: 'served', label: '4. Served', desc: 'Served. Enjoy your dining experience!', icon: CheckCircle2 }
      ];

  const getStepIndex = (status) => {
    switch (status) {
      case 'placed': return 0;
      case 'confirmed': return 0;
      case 'cooking': return 1;
      case 'ready': return 2;
      case 'served': return 3;
      default: return 0;
    }
  };

  const currentStepIdx = getStepIndex(activeCustomerOrder.status);

  return (
    <section className="py-8 sm:py-12 max-w-3xl mx-auto px-4 sm:px-6 font-sans">
      
      {/* Top navigation */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={() => { sounds.playClick(); onBackHome(); }}
          className={`inline-flex items-center gap-1.5 text-xs font-syne font-bold transition ${
            isLight ? 'text-stone-700 hover:text-black' : 'text-stone-300 hover:text-white'
          }`}
        >
          <ArrowLeft className="w-4 h-4" /> Back to Home
        </button>

        <button
          onClick={() => { sounds.playClick(); onOrderMore(); }}
          className={`px-4 py-2 rounded-xl text-xs font-syne font-bold transition flex items-center gap-1.5 border ${
            isLight 
              ? 'bg-white border-[#E8E2D5] text-[#12100E] hover:bg-stone-50' 
              : 'bg-[#1C1917] border-white/10 text-white hover:bg-white/5'
          }`}
        >
          <UtensilsCrossed className="w-3.5 h-3.5 text-[#D04834]" />
          <span>Add More Dishes +</span>
        </button>
      </div>

      {/* Main Order Status Card */}
      <div className={`relative rounded-3xl border shadow-xl p-5 sm:p-7 space-y-6 overflow-hidden transition-colors ${
        isLight 
          ? 'bg-[#FAF7F2] text-[#12100E] border-[#E8E2D5]' 
          : 'bg-[#141210] text-[#FAF7F2] border-white/10'
      }`}>
        
        {/* Header Info */}
        <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 border-b ${
          isLight ? 'border-stone-200' : 'border-white/10'
        }`}>
          <div>
            <div className="flex items-center gap-2">
              <span className={`px-2.5 py-0.5 rounded-lg font-mono font-bold text-xs ${
                isLight ? 'bg-[#12100E] text-white' : 'bg-white text-black'
              }`}>
                #{activeCustomerOrder.orderNumber}
              </span>
              <span className={`text-xs font-mono ${isLight ? 'text-stone-500' : 'text-stone-400'}`}>
                {new Date(activeCustomerOrder.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-editorial tracking-tight mt-1.5 font-normal">
              Live Order Status
            </h2>
            <div className="flex items-center gap-1.5 font-mono text-xs mt-0.5">
              {activeCustomerOrder.diningMode === 'delivery' ? (
                <>
                  <Truck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                  <span className="text-emerald-700 dark:text-emerald-300">
                    Doorstep Delivery • {activeCustomerOrder.deliveryAddress || 'Home Address'}
                  </span>
                </>
              ) : (activeCustomerOrder.diningMode === 'counter' || activeCustomerOrder.pickupToken) ? (
                <>
                  <Store className="w-3.5 h-3.5 text-[#D04834]" />
                  <span className="text-[#D04834]">
                    {activeCustomerOrder.pickupToken ? `${activeCustomerOrder.pickupToken} • Counter Pickup` : 'Counter Pickup'}
                  </span>
                </>
              ) : (
                <>
                  <MapPin className="w-3.5 h-3.5 text-[#D04834]" />
                  <span>{`Table #${activeCustomerOrder.tableNumber || '04'} • Dine-In Table`}</span>
                </>
              )}
            </div>
          </div>

          {/* Time Badge */}
          <div className={`p-3.5 rounded-2xl border flex items-center gap-3 ${
            isLight ? 'bg-white border-[#E8E2D5]' : 'bg-[#1C1917] border-white/10'
          }`}>
            <Clock className="w-5 h-5 text-[#D04834]" />
            <div>
              <p className={`text-[10px] font-mono uppercase tracking-widest ${isLight ? 'text-stone-500' : 'text-stone-400'}`}>
                Estimated Time
              </p>
              <p className="text-base font-number font-bold">
                {isCounterPaymentPending && activeCustomerOrder.status === 'placed'
                  ? 'ON HOLD (PAY AT COUNTER)'
                  : activeCustomerOrder.status === 'ready' 
                  ? 'READY NOW!' 
                  : activeCustomerOrder.status === 'served' 
                  ? 'COMPLETED' 
                  : `${minsLeft} Min`}
              </p>
            </div>
          </div>
        </div>

        {/* Notice #3: Persistent Counter Payment Required Banner */}
        {isCounterPaymentPending && activeCustomerOrder.status === 'placed' && (
          <div className={`p-5 rounded-2xl border-2 space-y-3 text-left shadow-lg ${
            isLight 
              ? 'bg-amber-500/10 border-amber-500/40 text-stone-900' 
              : 'bg-amber-500/10 border-amber-500/30 text-[#FAF7F2]'
          }`}>
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#D04834] animate-ping" />
                <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#D04834]">
                  Action Required • Notice 3 of 3
                </span>
              </div>
              <span className="px-2.5 py-0.5 rounded-full bg-[#D04834] text-white text-[10px] font-mono font-bold uppercase tracking-wider">
                Kitchen on Hold
              </span>
            </div>

            <div className="space-y-1.5">
              <h3 className="text-lg font-editorial font-bold flex items-center gap-2 text-rose-700 dark:text-rose-300">
                <AlertTriangle className="w-5 h-5 text-[#D04834] shrink-0" />
                <span>Please Settle ₹{activeCustomerOrder.total} at the Billing Counter</span>
              </h3>
              <p className={`text-xs leading-relaxed ${isLight ? 'text-stone-700' : 'text-stone-300'}`}>
                Your order <strong>#{activeCustomerOrder.orderNumber}</strong> is safely received, but <strong>food preparation has NOT started yet</strong>. Please show this screen at the billing counter to pay. The moment payment is received, our chefs will immediately begin cooking your order!
              </p>
            </div>

            <div className={`p-3 rounded-xl border flex items-center justify-between text-xs font-mono ${
              isLight ? 'bg-white/80 border-amber-500/30 text-stone-800' : 'bg-black/30 border-white/10 text-stone-200'
            }`}>
              <span>Amount Due: <strong className="font-number font-bold text-[#D04834] text-sm">₹{activeCustomerOrder.total}</strong></span>
              <span className="font-bold">{activeCustomerOrder.tableNumber ? `Table #${activeCustomerOrder.tableNumber}` : 'Takeaway Counter'}</span>
            </div>
          </div>
        )}

        {/* COUNTER TOKEN BANNER */}
        {activeCustomerOrder.pickupToken && (
          <div className={`p-5 rounded-2xl border text-center space-y-1 ${
            isLight 
              ? 'bg-stone-100/80 border-stone-300' 
              : 'bg-[#1C1917] border-white/10'
          }`}>
            <span className="text-[10px] uppercase font-mono tracking-widest font-bold text-[#D04834]">
              Counter Pickup Token #
            </span>
            <div className="text-4xl font-number font-bold tracking-wider text-[#D04834] py-1">
              {activeCustomerOrder.pickupToken}
            </div>
            <p className={`text-xs ${isLight ? 'text-stone-600' : 'text-stone-300'}`}>
              {activeCustomerOrder.status === 'ready' 
                ? 'Token called! Please collect your tray at the pickup counter window.'
                : 'Keep this screen open. Your number will chime on the counter display.'}
            </p>
          </div>
        )}

        {/* Live Step Progression */}
        <div className="space-y-4">
          <div className="relative flex items-center justify-between">
            <div className={`absolute left-0 right-0 top-1/2 -translate-y-1/2 h-1 z-0 ${
              isLight ? 'bg-stone-200' : 'bg-stone-800'
            }`} />
            
            <div
              className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-[#D04834] z-0 transition-all duration-700"
              style={{ width: `${(currentStepIdx / (steps.length - 1)) * 100}%` }}
            />

            {steps.map((step, idx) => {
              const isCompleted = idx < currentStepIdx;
              const isCurrent = idx === currentStepIdx;
              const StepIcon = step.icon;

              return (
                <div key={step.key} className="relative z-10 flex flex-col items-center">
                  <div
                    className={`w-9 h-9 sm:w-10 sm:h-10 rounded-2xl flex items-center justify-center font-bold text-xs transition-all border ${
                      isCompleted
                        ? 'bg-[#12100E] text-white border-[#12100E]'
                        : isCurrent
                        ? 'bg-[#D04834] text-white border-[#D04834] scale-110 shadow-md'
                        : isLight 
                        ? 'bg-white border-stone-300 text-stone-400' 
                        : 'bg-[#1C1917] border-stone-800 text-stone-600'
                    }`}
                  >
                    {isCompleted ? (
                      <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                    ) : (
                      <StepIcon className="w-4 h-4 sm:w-5 sm:h-5" />
                    )}
                  </div>
                  <p
                    className={`text-[9px] sm:text-[11px] font-mono font-bold mt-2 text-center uppercase tracking-tight sm:tracking-wider max-w-[65px] sm:max-w-none leading-tight ${
                      isCurrent ? 'text-[#D04834]' : isCompleted ? (isLight ? 'text-stone-800' : 'text-white') : 'text-stone-400'
                    }`}
                  >
                    {step.label}
                  </p>
                </div>
              );
            })}
          </div>

          <div className={`p-3 rounded-2xl text-center text-xs border ${
            isLight ? 'bg-white border-[#E8E2D5] text-stone-700' : 'bg-[#1C1917] border-white/10 text-stone-300'
          }`}>
            <span className="font-bold text-[#D04834]">Current Status: </span>
            {steps[currentStepIdx]?.desc}
          </div>
        </div>

        {/* Order Details & Summary */}
        <div className={`grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t ${
          isLight ? 'border-stone-200' : 'border-white/10'
        }`}>
          
          {/* Ordered Dishes */}
          <div className="space-y-2">
            <h4 className={`text-[10px] font-mono uppercase tracking-widest font-bold ${
              isLight ? 'text-stone-500' : 'text-stone-400'
            }`}>
              Ordered Dishes ({activeCustomerOrder.items?.length})
            </h4>
            <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1">
              {activeCustomerOrder.items?.map((item, i) => (
                <div
                  key={i}
                  className={`p-2.5 rounded-xl border flex items-center justify-between text-xs ${
                    isLight ? 'bg-white border-stone-200' : 'bg-[#1C1917] border-white/5'
                  }`}
                >
                  <div>
                    <p className="font-editorial text-sm">
                      <span className="font-number font-bold">{item.qty}</span> × {item.name}
                    </p>
                    {item.spice && (
                      <span className="text-[10px] text-[#D04834] font-mono inline-flex items-center gap-1">
                        <Flame className="w-3 h-3" />
                        <span>{item.spice}</span>
                      </span>
                    )}
                  </div>
                  <span className="font-number font-bold">₹{item.price * item.qty}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Payment Summary */}
          <div className={`p-4 rounded-2xl border flex flex-col justify-between space-y-2 ${
            isLight ? 'bg-white border-[#E8E2D5]' : 'bg-[#1C1917] border-white/10'
          }`}>
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-medium">Payment Status</span>
                <span
                  className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                    activeCustomerOrder.paymentStatus === 'paid'
                      ? 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border border-emerald-500/30'
                      : 'bg-amber-400/20 text-amber-700 dark:text-amber-300 border border-amber-400/30 animate-pulse'
                  }`}
                >
                  {activeCustomerOrder.paymentStatus === 'paid' ? 'PAID ONLINE' : 'DUE AT COUNTER (HOLD)'}
                </span>
              </div>
              <p className="text-xl font-editorial font-normal mt-2">
                Total: <span className="font-number font-bold text-[#D04834]">₹{activeCustomerOrder.total}</span>
              </p>
            </div>

            <div className={`pt-2 border-t flex items-center justify-between text-xs font-mono ${
              isLight ? 'border-stone-200 text-stone-500' : 'border-white/10 text-stone-400'
            }`}>
              <span>Order #<span className="font-number font-bold">{activeCustomerOrder.orderNumber}</span></span>
              {activeCustomerOrder.paymentStatus === 'paid' ? (
                <span className="text-emerald-600 dark:text-emerald-400 font-bold">Kitchen Preparing</span>
              ) : (
                <span className="text-rose-600 dark:text-rose-400 font-bold">Pay at Counter to Cook</span>
              )}
            </div>
          </div>
        </div>

        {/* Staff Contact */}
        <div className={`pt-3 border-t flex items-center justify-between text-xs ${
          isLight ? 'border-stone-200' : 'border-white/10'
        }`}>
          <span className={isLight ? 'text-stone-500' : 'text-stone-400'}>Need assistance at your table?</span>
          <a
            href={`tel:${BRAND_CONFIG.contact.phone.replace(/\s+/g, '')}`}
            className={`px-3 py-1.5 rounded-xl border text-xs font-mono font-bold transition flex items-center gap-1.5 ${
              isLight 
                ? 'bg-white border-stone-300 text-stone-800 hover:bg-stone-50' 
                : 'bg-[#1C1917] border-white/10 text-stone-200 hover:bg-white/5'
            }`}
          >
            <Phone className="w-3.5 h-3.5 text-[#D04834]" /> Call Staff ({BRAND_CONFIG.contact.phone})
          </a>
        </div>

      </div>
    </section>
  );
}
