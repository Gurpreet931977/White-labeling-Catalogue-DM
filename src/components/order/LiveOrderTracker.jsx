import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  CheckCircle2, 
  Clock, 
  ChefHat, 
  Bell, 
  Sparkles, 
  QrCode, 
  Phone, 
  UtensilsCrossed, 
  ArrowLeft,
  Receipt,
  MapPin,
  Flame,
  Truck,
  Store,
  Award
} from 'lucide-react';
import { useOrder } from '../../context/OrderContext';
import { BRAND_CONFIG } from '../../data/cafeConfig';
import { sounds } from '../../utils/audio';

export function LiveOrderTracker({ onOrderMore, onBackHome }) {
  const { activeCustomerOrder } = useOrder();
  const [minsLeft, setMinsLeft] = useState(12);

  useEffect(() => {
    if (activeCustomerOrder?.estimatedMins) {
      setMinsLeft(activeCustomerOrder.estimatedMins);
    }
  }, [activeCustomerOrder]);

  if (!activeCustomerOrder) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center p-6 space-y-3">
        <div className="w-12 h-12 rounded-2xl bg-amber-400/10 text-amber-400 flex items-center justify-center mx-auto">
          <Receipt className="w-6 h-6" />
        </div>
        <h3 className="text-xl font-bold text-white font-syne">No Active Order</h3>
        <p className="text-slate-400 text-xs max-w-sm">
          You haven't placed an order yet. Check out our menu to order tasty food!
        </p>
        <button
          onClick={() => { sounds.playClick(); onOrderMore(); }}
          className="px-5 py-2.5 rounded-xl bg-amber-400 text-slate-950 font-bold text-xs"
        >
          EXPLORE MENU
        </button>
      </div>
    );
  }

  const steps = activeCustomerOrder.diningMode === 'delivery'
    ? [
        { key: 'placed', label: '1. Order Confirmed', desc: 'Received & routed to kitchen', icon: Receipt },
        { key: 'cooking', label: '2. Wood-Fired Bake', desc: 'Chef preparing fresh dishes', icon: ChefHat },
        { key: 'ready', label: '3. Rider Dispatched', desc: 'Courier out for doorstep delivery', icon: Truck },
        { key: 'served', label: '4. Delivered', desc: 'Arrived hot at your door!', icon: Sparkles }
      ]
    : (activeCustomerOrder.diningMode === 'counter' || activeCustomerOrder.pickupToken)
    ? [
        { key: 'placed', label: '1. Token Issued', desc: `${activeCustomerOrder.pickupToken || 'Queue Token'} active`, icon: Receipt },
        { key: 'cooking', label: '2. Kitchen Prep', desc: 'Sizzling at express counter', icon: ChefHat },
        { key: 'ready', label: '3. Token Called', desc: 'Ready for pickup at counter window', icon: Bell },
        { key: 'served', label: '4. Tray Collected', desc: 'Have a fantastic meal!', icon: Sparkles }
      ]
    : [
        { key: 'placed', label: '1. Order Placed', desc: 'Order received by kitchen', icon: Receipt },
        { key: 'cooking', label: '2. Cooking', desc: 'Chef is preparing your food fresh', icon: ChefHat },
        { key: 'ready', label: '3. Serving to Table', desc: `Food being served to Table #${activeCustomerOrder.tableNumber || '04'}!`, icon: Bell },
        { key: 'served', label: '4. Enjoy Meal', desc: 'Food served! Have a wonderful meal!', icon: Sparkles }
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
    <section className="py-8 sm:py-12 max-w-3xl mx-auto px-4 sm:px-6">
      
      {/* Top navigation */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={() => { sounds.playClick(); onBackHome(); }}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-300 hover:text-white transition"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Home
        </button>

        <button
          onClick={() => { sounds.playClick(); onOrderMore(); }}
          className="px-3.5 py-2 rounded-xl bg-amber-400/15 hover:bg-amber-400 border border-amber-400/30 text-amber-300 hover:text-slate-950 font-bold text-xs transition flex items-center gap-1.5"
        >
          <UtensilsCrossed className="w-3.5 h-3.5" />
          <span>Add More Dishes +</span>
        </button>
      </div>

      {/* Main Order Status Card */}
      <div className="relative rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl p-5 sm:p-7 space-y-6 overflow-hidden">
        
        {/* Header Info */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 rounded-lg bg-amber-400 text-slate-950 font-mono font-black text-xs">
                {activeCustomerOrder.orderNumber}
              </span>
              <span className="text-xs text-slate-400">
                {new Date(activeCustomerOrder.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white mt-1.5">
              Live Order Status
            </h2>
            <div className="flex items-center gap-1.5 text-amber-400 font-bold text-xs mt-0.5">
              {activeCustomerOrder.diningMode === 'delivery' ? (
                <>
                  <Truck className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-300">
                    Doorstep Delivery • {activeCustomerOrder.deliveryAddress || 'Home Address'}
                  </span>
                </>
              ) : (activeCustomerOrder.diningMode === 'counter' || activeCustomerOrder.pickupToken) ? (
                <>
                  <Store className="w-3.5 h-3.5 text-cyan-400" />
                  <span className="text-cyan-300">
                    {activeCustomerOrder.pickupToken ? `${activeCustomerOrder.pickupToken} • Express Counter Pickup` : 'Counter Pickup'}
                  </span>
                </>
              ) : (
                <>
                  <MapPin className="w-3.5 h-3.5 text-amber-400" />
                  <span>{`Table #${activeCustomerOrder.tableNumber || '04'} • Dine In Table Service`}</span>
                </>
              )}
            </div>
          </div>

          {/* Time Badge */}
          <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 flex items-center gap-3">
            <Clock className="w-5 h-5 text-amber-400" />
            <div>
              <p className="text-[10px] text-slate-400 font-bold uppercase">Estimated Time</p>
              <p className="text-base font-black text-white">
                {activeCustomerOrder.status === 'ready' ? 'READY NOW!' : activeCustomerOrder.status === 'served' ? 'COMPLETED' : `${minsLeft} Mins`}
              </p>
            </div>
          </div>
        </div>

        {/* BIG COUNTER TOKEN BANNER FOR SELF-SERVE QSR */}
        {activeCustomerOrder.pickupToken && (
          <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-cyan-950/60 via-slate-950 to-slate-950 border border-cyan-500/40 text-center space-y-1 shadow-lg">
            <span className="text-[10px] uppercase font-mono font-bold text-cyan-300 tracking-wider">
              Your Counter Pickup Token
            </span>
            <div className="text-3xl sm:text-4xl font-black font-mono text-cyan-300 tracking-wider animate-pulse">
              {activeCustomerOrder.pickupToken}
            </div>
            <p className="text-xs text-slate-300 font-clash">
              {activeCustomerOrder.status === 'ready' 
                ? '🔔 Token Called! Please collect your tray at Counter Window #1.'
                : 'Keep this screen open. Your token number will be called at the counter when food is ready.'}
            </p>
          </div>
        )}

        {/* LIVE COURIER DISPATCH CARD FOR DOORSTEP DELIVERY */}
        {activeCustomerOrder.diningMode === 'delivery' && (
          <div className="p-4 rounded-2xl bg-slate-950 border border-emerald-500/30 space-y-2.5">
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2 text-emerald-400 font-bold font-syne">
                <Truck className="w-4 h-4" />
                <span>Doorstep Courier Dispatch</span>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-mono text-[10px] font-bold">
                {activeCustomerOrder.status === 'ready' ? 'RIDER ON THE WAY' : 'INSULATED HOT-BAG'}
              </span>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs pt-1 border-t border-white/5">
              <div className="space-y-0.5">
                <p className="text-slate-400 text-[10px] uppercase font-mono">Delivering To:</p>
                <p className="text-white font-medium text-xs">
                  {activeCustomerOrder.deliveryAddress || 'Home Address'}
                </p>
                {activeCustomerOrder.deliveryNotes && (
                  <p className="text-slate-400 text-[10px] italic">
                    Note: "{activeCustomerOrder.deliveryNotes}"
                  </p>
                )}
              </div>
              <div className="text-left sm:text-right space-y-0.5">
                <p className="text-slate-400 text-[10px] uppercase font-mono">Courier Rider:</p>
                <p className="text-emerald-300 font-mono font-bold">Raju K. (Hero Electric #04)</p>
              </div>
            </div>
          </div>
        )}

        {/* Live Step Progression */}
        <div className="space-y-4">
          <div className="relative flex items-center justify-between">
            <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-1.5 bg-slate-950 z-0" />
            
            <div
              className="absolute left-0 top-1/2 -translate-y-1/2 h-1.5 bg-amber-400 z-0 transition-all duration-700"
              style={{ width: `${(currentStepIdx / (steps.length - 1)) * 100}%` }}
            />

            {steps.map((step, idx) => {
              const isCompleted = idx < currentStepIdx;
              const isCurrent = idx === currentStepIdx;
              const StepIcon = step.icon;

              return (
                <div key={step.key} className="relative z-10 flex flex-col items-center">
                  <div
                    className={`w-10 h-10 rounded-2xl flex items-center justify-center font-bold text-xs transition-all border-2 ${
                      isCompleted
                        ? 'bg-amber-400 text-slate-950 border-amber-400'
                        : isCurrent
                        ? 'bg-cyan-400 text-slate-950 border-cyan-400 scale-110 shadow-lg'
                        : 'bg-slate-950 border-slate-800 text-slate-500'
                    }`}
                  >
                    {isCompleted ? (
                      <CheckCircle2 className="w-5 h-5" />
                    ) : (
                      <StepIcon className="w-5 h-5" />
                    )}
                  </div>
                  <p
                    className={`text-xs font-bold mt-2 text-center ${
                      isCurrent ? 'text-cyan-300' : isCompleted ? 'text-white' : 'text-slate-500'
                    }`}
                  >
                    {step.label}
                  </p>
                </div>
              );
            })}
          </div>

          <div className="p-3 rounded-2xl bg-slate-950 text-center text-xs text-slate-200 border border-slate-800">
            <span className="text-amber-400 font-bold">Current Status: </span>
            {steps[currentStepIdx]?.desc}
          </div>
        </div>

        {/* Order Details & Summary */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t border-slate-800">
          
          {/* Ordered Dishes */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
              Dishes in Your Order ({activeCustomerOrder.items?.length})
            </h4>
            <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1">
              {activeCustomerOrder.items?.map((item, i) => (
                <div
                  key={i}
                  className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between text-xs"
                >
                  <div>
                    <p className="font-bold text-white">
                      {item.qty} × {item.name}
                    </p>
                    {item.spice && (
                      <span className="text-[10px] text-rose-400 font-semibold inline-flex items-center gap-1">
                        <Flame className="w-3 h-3 text-rose-400" />
                        <span>{item.spice}</span>
                      </span>
                    )}
                  </div>
                  <span className="font-mono text-slate-300 font-bold">₹{item.price * item.qty}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Payment Summary */}
          <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col justify-between space-y-2">
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-bold text-slate-300">Payment Status</span>
                <span
                  className={`px-2 py-0.5 rounded text-xs font-bold ${
                    activeCustomerOrder.paymentStatus === 'paid'
                      ? 'bg-emerald-500/20 text-emerald-400'
                      : 'bg-amber-400/20 text-amber-300'
                  }`}
                >
                  {activeCustomerOrder.paymentStatus === 'paid' ? 'PAID ONLINE' : 'PAY AT COUNTER'}
                </span>
              </div>
              <p className="text-white text-base font-black mt-2">
                Total Bill: ₹{activeCustomerOrder.total}
              </p>
            </div>

            <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
              <span>Order #{activeCustomerOrder.orderNumber}</span>
              <span className="text-emerald-400 font-semibold">Kitchen Alert Sent</span>
            </div>
          </div>
        </div>

        {/* Staff Desk Bar */}
        <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs">
          <span className="text-slate-400">Need help or water?</span>
          <a
            href={`tel:${BRAND_CONFIG.contact.phone.replace(/\s+/g, '')}`}
            className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 text-xs font-bold transition flex items-center gap-1.5"
          >
            <Phone className="w-3.5 h-3.5" /> Call Staff ({BRAND_CONFIG.contact.phone})
          </a>
        </div>

      </div>
    </section>
  );
}
