import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  Sparkles, 
  ArrowRight, 
  Check, 
  Coffee, 
  Calendar, 
  Clock, 
  Flame, 
  ShoppingBag,
  Layers,
  Store,
  Truck,
  Award,
  Compass,
  QrCode,
  Gift,
  Zap
} from 'lucide-react';
import { sounds } from '../../utils/audio';

export function CafeDemoModal({ variant, isOpen, onClose, onOpenQuote }) {
  if (!isOpen || !variant) return null;

  const [selectedIndex, setSelectedIndex] = useState(0);
  const [selectedSub, setSelectedSub] = useState(0);
  const [customerName, setCustomerName] = useState('Alex Morgan');
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [generatedTicket, setGeneratedTicket] = useState(null);

  const handleSimulate = (e) => {
    e.preventDefault();
    sounds.playSuccess();
    setGeneratedTicket({
      id: `${variant.id.toUpperCase()}-${Math.floor(100000 + Math.random() * 900000)}`,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      modelName: variant.modelName,
      type: variant.type,
      details: variant.id === 'gamified-loyalty'
        ? "8-Slot Passport Stamped • Free Drink + Pastry Perk Unlocked!"
        : variant.id === 'loyalty'
        ? "Visit #7 Completed • 50% OFF Applied!"
        : variant.id === 'self-serve'
        ? "TOKEN #C-14 • Ready for Counter Pickup"
        : variant.id === 'delivery'
        ? "Order Dispatched • Doorstep Delivery in 35 mins"
        : "Order Bound to Table #04"
    });
    setBookingSuccess(true);
  };

  const handleReset = () => {
    setBookingSuccess(false);
    setGeneratedTicket(null);
  };

  const getVariantIcon = () => {
    switch (variant.id) {
      case 'gamified-loyalty': return Sparkles;
      case 'self-serve': return Store;
      case 'showcase': return Compass;
      case 'delivery': return Truck;
      case 'hybrid': return Layers;
      case 'loyalty': return Award;
      default: return QrCode;
    }
  };

  const VariantIcon = getVariantIcon();

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
        
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/85 backdrop-blur-xl -z-10"
        ></motion.div>

        {/* Modal Window - Pure Dripp Media Aesthetic */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="w-full max-w-3xl bg-[#0a0a0a] border border-white/15 rounded-3xl overflow-hidden shadow-2xl shadow-black my-8 flex flex-col max-h-[90vh]"
        >
          {/* Header */}
          <div className="p-5 sm:p-6 border-b border-white/10 flex items-center justify-between bg-white/[0.02]">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-black shadow-lg bg-[#ebd73f]">
                <VariantIcon className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-[10px] tracking-widest uppercase text-slate-400">
                    {variant.code} • {variant.type}
                  </span>
                  <span className="text-[10px] font-mono px-2 py-0.2 rounded-full bg-[#ebd73f]/20 text-[#ebd73f] border border-[#ebd73f]/30">
                    ACTIVE ARCHETYPE
                  </span>
                </div>
                <h3 className="font-panchang font-bold text-lg text-white">
                  {variant.modelName}
                </h3>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-white/70 hover:text-white transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body */}
          <div className="p-5 sm:p-6 overflow-y-auto flex-grow space-y-6">
            
            {bookingSuccess ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-6 rounded-2xl bg-[#111111] border border-white/15 text-center space-y-5"
              >
                <div className="w-16 h-16 rounded-full mx-auto flex items-center justify-center text-black shadow-xl bg-[#ebd73f]">
                  <Check className="w-8 h-8 stroke-[3]" />
                </div>

                <div className="space-y-1">
                  <span className="text-[11px] font-mono px-2.5 py-1 rounded-full bg-[#ebd73f]/20 text-[#ebd73f] font-bold border border-[#ebd73f]/30">
                    SIMULATION SUCCESSFUL
                  </span>
                  <h4 className="font-panchang font-bold text-xl text-white pt-2">
                    {generatedTicket?.details}
                  </h4>
                  <p className="text-xs text-slate-300 font-clash max-w-md mx-auto">
                    In the live deployment for <strong>{variant.modelName}</strong>, this dispatches real-time POS receipts, triggers audio chimes, and syncs with the database.
                  </p>
                </div>

                {/* Digital Pass */}
                <div className="max-w-md mx-auto p-4 rounded-xl bg-black/70 border border-white/10 text-left space-y-3 font-mono text-xs">
                  <div className="flex items-center justify-between pb-2 border-b border-white/10">
                    <span className="text-slate-400">REFERENCE:</span>
                    <span className="text-white font-bold">{generatedTicket?.id}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">ARCHETYPE:</span>
                    <span className="text-[#ebd73f]">{variant.title}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">GUEST / USER:</span>
                    <span className="text-white font-bold">{customerName}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">TIMESTAMP:</span>
                    <span className="text-white">{generatedTicket?.time}</span>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-3">
                  <button
                    onClick={handleReset}
                    className="w-full sm:w-auto px-5 py-2.5 rounded-full bg-white/10 hover:bg-white/15 text-white text-xs font-semibold transition cursor-pointer"
                  >
                    Test Another Simulation
                  </button>

                  <button
                    onClick={() => {
                      sounds.playClick();
                      onClose();
                      onOpenQuote();
                    }}
                    className="w-full sm:w-auto btn-dripp-primary px-6 py-2.5 text-xs font-bold transition flex items-center justify-center gap-2 shadow-lg cursor-pointer"
                  >
                    <span>Deploy This Model for Your Brand</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </motion.div>
            ) : (
              <form onSubmit={handleSimulate} className="space-y-6">
                
                <div>
                  <h4 className="font-panchang font-bold text-base sm:text-lg text-white">
                    {variant.tagline}
                  </h4>
                  <p className="text-xs text-slate-300/80 font-clash mt-1">
                    {variant.description}
                  </p>
                </div>

                {/* MODEL 1: TABLE QR POS SIMULATION */}
                {variant.id === 'table-qr' && (
                  <div className="space-y-3">
                    <label className="text-[11px] font-mono text-slate-400 uppercase tracking-wider block">
                      1. Select Test Table Plaque (Tables 1-12)
                    </label>
                    <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((tableNum) => (
                        <button
                          type="button"
                          key={tableNum}
                          onClick={() => { sounds.playClick(); setSelectedIndex(tableNum); }}
                          className={`p-3 rounded-xl border text-xs font-mono font-bold transition cursor-pointer ${
                            selectedIndex === tableNum
                              ? 'bg-[#ebd73f] text-black border-[#ebd73f]'
                              : 'bg-white/[0.03] border-white/10 text-white/70 hover:text-white'
                          }`}
                        >
                          T-{tableNum}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* MODEL 2: SELF-SERVE COUNTER SIMULATION */}
                {variant.id === 'self-serve' && (
                  <div className="space-y-3">
                    <label className="text-[11px] font-mono text-slate-400 uppercase tracking-wider block">
                      1. Counter Queue Token Simulator
                    </label>
                    <div className="p-4 rounded-2xl bg-black border border-cyan-400/40 flex items-center justify-between">
                      <div className="space-y-1">
                        <span className="text-[10px] font-mono text-cyan-400">ASSIGNED TOKEN NUMBER</span>
                        <h5 className="font-mono font-black text-2xl text-white">TOKEN #C-14</h5>
                        <p className="text-xs text-slate-400">Audio chime alerts when order is Ready at Window</p>
                      </div>
                      <span className="px-3 py-1.5 rounded-full bg-cyan-400/20 text-cyan-300 font-mono text-xs font-bold border border-cyan-400/30">
                        EXPRESS QUEUE
                      </span>
                    </div>
                  </div>
                )}

                {/* MODEL 3: BRAND SHOWCASE LANDING SIMULATION */}
                {variant.id === 'showcase' && (
                  <div className="space-y-3">
                    <label className="text-[11px] font-mono text-slate-400 uppercase tracking-wider block">
                      1. VIP Seating Zone Reservation Preview
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                      {["Indoor Warm Bistro", "Terrace Sunset View", "Private Wine Alcove"].map((zone, idx) => (
                        <div
                          key={idx}
                          onClick={() => { sounds.playClick(); setSelectedIndex(idx); }}
                          className={`p-3 rounded-xl border cursor-pointer transition ${
                            selectedIndex === idx
                              ? 'bg-[#ebd73f]/15 border-[#ebd73f] text-white'
                              : 'bg-white/[0.03] border-white/10 text-slate-400 hover:text-white'
                          }`}
                        >
                          <p className="font-syne font-bold text-xs text-white">{zone}</p>
                          <p className="text-[10px] font-mono text-amber-400 mt-1">Instant VIP Pass</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* MODEL 4: DIRECT ONLINE DELIVERY SIMULATION */}
                {variant.id === 'delivery' && (
                  <div className="space-y-3">
                    <label className="text-[11px] font-mono text-slate-400 uppercase tracking-wider block">
                      1. Doorstep Delivery Coordinates &amp; Fee
                    </label>
                    <div className="p-4 rounded-2xl bg-black border border-emerald-400/40 space-y-2">
                      <div className="flex items-center justify-between text-xs font-mono">
                        <span className="text-slate-400">Coverage Radius:</span>
                        <span className="text-white font-bold">Up to 8 km</span>
                      </div>
                      <div className="flex items-center justify-between text-xs font-mono">
                        <span className="text-slate-400">Estimated Transit ETA:</span>
                        <span className="text-emerald-400 font-bold">30-40 Mins</span>
                      </div>
                      <div className="flex items-center justify-between text-xs font-mono">
                        <span className="text-slate-400">Platform Commission:</span>
                        <span className="text-[#ebd73f] font-bold">0% (Keep 100% Profits)</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* MODEL 5: HYBRID DUAL MODE SIMULATION */}
                {variant.id === 'hybrid' && (
                  <div className="space-y-3">
                    <label className="text-[11px] font-mono text-slate-400 uppercase tracking-wider block">
                      1. Interactive Omnichannel Switcher
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {["Table QR Dine-In", "Doorstep Delivery", "Counter Takeaway"].map((mode, mIdx) => (
                        <div
                          key={mIdx}
                          onClick={() => { sounds.playClick(); setSelectedIndex(mIdx); }}
                          className={`p-3 rounded-xl border text-center cursor-pointer transition ${
                            selectedIndex === mIdx
                              ? 'bg-[#ebd73f] text-black font-bold'
                              : 'bg-white/[0.03] border-white/10 text-white/70'
                          }`}
                        >
                          <p className="text-xs">{mode}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* MODEL 6: 7-VISIT LOYALTY CLUB SIMULATION */}
                {variant.id === 'loyalty' && (
                  <div className="space-y-3">
                    <label className="text-[11px] font-mono text-slate-400 uppercase tracking-wider block">
                      1. Digital 7-Stamp Punch Card Progression
                    </label>
                    <div className="p-4 rounded-2xl bg-slate-900 border border-amber-400/40 space-y-3">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-slate-300 font-syne font-bold">THC Artisan Club Card</span>
                        <span className="text-amber-400 font-mono font-bold">Stamps: 6 of 7 (Next = 50% OFF)</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        {[1, 2, 3, 4, 5, 6].map(n => (
                          <div key={n} className="flex-1 h-3 rounded-full bg-amber-400 shadow-sm shadow-amber-400/50" />
                        ))}
                        <div className="flex-1 h-3 rounded-full bg-purple-500/60 border border-purple-400 animate-pulse" />
                      </div>
                      <p className="text-[11px] text-slate-400 font-clash">
                        Simulating this order will record the <strong>7th Visit</strong> and unlock <strong>50% OFF</strong>!
                      </p>
                    </div>
                  </div>
                )}

                {/* MODEL 7: GAMIFIED COFFEE & BAKERY LOYALTY SIMULATION */}
                {variant.id === 'gamified-loyalty' && (
                  <div className="space-y-3">
                    <label className="text-[11px] font-mono text-slate-400 uppercase tracking-wider block">
                      1. Interactive 6-Slot Stamp Progression &amp; 5-Day Streak Speed-Up
                    </label>
                    <div className="p-4 rounded-2xl bg-slate-900 border border-amber-400/40 space-y-3">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-white font-syne font-bold flex items-center gap-1.5">
                          <Coffee className="w-3.5 h-3.5 text-amber-400" />
                          <span>Artisan Coffee &amp; Bakery Passport</span>
                        </span>
                        <span className="text-[#ebd73f] font-mono font-bold">Stamps: 4 of 6 (Next Bill = +2 Stamps!)</span>
                      </div>
                      
                      <div className="grid grid-cols-6 gap-2 pt-1">
                        {[1, 2, 3, 4].map(n => (
                          <div key={n} className="h-8 rounded-xl bg-[#ebd73f] flex items-center justify-center font-bold text-[10px] text-black shadow-sm">
                            <Check className="w-3.5 h-3.5 stroke-[3]" />
                          </div>
                        ))}
                        <div className="h-8 rounded-xl bg-orange-500/20 border border-orange-400 flex items-center justify-center text-[10px] text-orange-300 font-bold animate-pulse gap-0.5">
                          <span>+2</span>
                          <Zap className="w-2.5 h-2.5 fill-orange-400" />
                        </div>
                        <div className="h-8 rounded-xl bg-purple-500/30 border border-purple-400 flex items-center justify-center text-[10px] text-purple-200 font-bold">
                          50% OFF
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-[11px] text-slate-400 font-clash pt-1">
                        <span className="flex items-center gap-1">Streak: <strong className="text-orange-400 inline-flex items-center gap-1">5-Day Hot Streak <Flame className="w-3 h-3 fill-orange-400 inline" /> (Next bill awards 2 stamps)</strong></span>
                        <span className="text-amber-300 font-bold">Target: 50% OFF Entire Order</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Customer Name Input */}
                <div className="space-y-1 pt-2">
                  <label className="text-[11px] font-mono text-slate-400">Customer Name / Guest</label>
                  <input
                    type="text"
                    required
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-black border border-white/15 text-white text-xs font-clash focus:outline-none focus:border-[#ebd73f]"
                  />
                </div>

                {/* Submit Action */}
                <div className="pt-3">
                  <button
                    type="submit"
                    className="w-full btn-dripp-primary py-3.5 text-xs font-bold flex items-center justify-center gap-2 shadow-xl cursor-pointer"
                  >
                    <span className="auth-shimmer-sweep"></span>
                    <span>Simulate {variant.modelName}</span>
                    <ArrowRight className="w-4 h-4 text-black" />
                  </button>
                </div>

              </form>
            )}

          </div>

        </motion.div>

      </div>
    </AnimatePresence>
  );
}
