import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  Crown, 
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
      case 'gamified-loyalty': return Crown;
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

        {/* Modal Window - Modern Minimal Luxury Cafe Aesthetic */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="w-full max-w-3xl bg-[#12100E] border border-[#2B231D] rounded-[28px] overflow-hidden shadow-2xl shadow-black my-8 flex flex-col max-h-[90vh]"
        >
          {/* Header */}
          <div className="p-5 sm:p-6 border-b border-[#241E18] flex items-center justify-between bg-white/[0.02]">
            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-2xl flex items-center justify-center font-bold text-[#12100E] shadow-lg bg-gradient-to-br from-[#D4B588] to-[#C5A880]">
                <VariantIcon className="w-5 h-5 text-[#12100E]" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-[10px] tracking-widest uppercase text-stone-400">
                    {variant.code} • {variant.type}
                  </span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#C5A880]/15 text-[#E6D5B8] border border-[#C5A880]/30 font-medium">
                    ACTIVE ARCHETYPE
                  </span>
                </div>
                <h3 className="font-serif font-semibold text-lg text-[#FAF7F2] tracking-tight">
                  {variant.modelName}
                </h3>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-stone-300 hover:text-white transition cursor-pointer"
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
                className="p-6 rounded-2xl bg-[#161311] border border-[#2B231D] text-center space-y-5"
              >
                <div className="w-16 h-16 rounded-full mx-auto flex items-center justify-center text-[#12100E] shadow-xl bg-gradient-to-br from-[#D4B588] to-[#C5A880]">
                  <Check className="w-8 h-8 stroke-[3]" />
                </div>

                <div className="space-y-1">
                  <span className="text-[11px] font-mono px-2.5 py-1 rounded-full bg-[#C5A880]/20 text-[#E6D5B8] font-bold border border-[#C5A880]/30">
                    SIMULATION SUCCESSFUL
                  </span>
                  <h4 className="font-serif font-bold text-xl text-[#FAF7F2] pt-2">
                    {generatedTicket?.details}
                  </h4>
                  <p className="text-xs text-stone-300/80 font-sans max-w-md mx-auto">
                    In the live deployment for <strong>{variant.modelName}</strong>, this dispatches real-time POS receipts, triggers audio chimes, and syncs with the database.
                  </p>
                </div>

                {/* Digital Pass */}
                <div className="max-w-md mx-auto p-4 rounded-xl bg-[#0E0C0A] border border-[#2B231D] text-left space-y-3 font-mono text-xs">
                  <div className="flex items-center justify-between pb-2 border-b border-[#241E18]">
                    <span className="text-stone-400">REFERENCE:</span>
                    <span className="text-white font-bold">{generatedTicket?.id}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-stone-400">ARCHETYPE:</span>
                    <span className="text-[#C5A880]">{variant.title}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-stone-400">GUEST / USER:</span>
                    <span className="text-white font-bold">{customerName}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-stone-400">TIMESTAMP:</span>
                    <span className="text-white">{generatedTicket?.time}</span>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-3">
                  <button
                    onClick={handleReset}
                    className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-white/[0.06] hover:bg-white/10 text-stone-200 text-xs font-sans font-medium transition cursor-pointer border border-white/10"
                  >
                    Test Another Simulation
                  </button>

                  <button
                    onClick={() => {
                      sounds.playClick();
                      onClose();
                      onOpenQuote();
                    }}
                    className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#C5A880] via-[#D8B98C] to-[#C5A880] hover:brightness-110 text-[#12100E] text-xs font-sans font-bold transition flex items-center justify-center gap-2 shadow-lg cursor-pointer"
                  >
                    <span>Deploy This Model for Your Brand</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </motion.div>
            ) : (
              <form onSubmit={handleSimulate} className="space-y-6">
                
                <div>
                  <h4 className="font-serif font-semibold text-base sm:text-lg text-[#FAF7F2]">
                    {variant.tagline}
                  </h4>
                  <p className="text-xs text-stone-300/80 font-sans mt-1">
                    {variant.description}
                  </p>
                </div>

                {/* MODEL 1: TABLE QR POS SIMULATION */}
                {variant.id === 'table-qr' && (
                  <div className="space-y-3">
                    <label className="text-[11px] font-mono text-stone-400 uppercase tracking-wider block">
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
                              ? 'bg-[#C5A880] text-[#12100E] border-[#C5A880]'
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
                    <label className="text-[11px] font-mono text-stone-400 uppercase tracking-wider block">
                      1. Counter Queue Token Simulator
                    </label>
                    <div className="p-4 rounded-2xl bg-[#0E0C0A] border border-[#C5A880]/40 flex items-center justify-between">
                      <div className="space-y-1">
                        <span className="text-[10px] font-mono text-[#C5A880]">ASSIGNED TOKEN NUMBER</span>
                        <h5 className="font-mono font-black text-2xl text-[#FAF7F2]">TOKEN #C-14</h5>
                        <p className="text-xs text-stone-400">Audio chime alerts when order is Ready at Window</p>
                      </div>
                      <span className="px-3 py-1.5 rounded-full bg-[#C5A880]/15 text-[#E6D5B8] font-mono text-xs font-bold border border-[#C5A880]/30">
                        EXPRESS QUEUE
                      </span>
                    </div>
                  </div>
                )}

                {/* MODEL 3: BRAND SHOWCASE LANDING SIMULATION */}
                {variant.id === 'showcase' && (
                  <div className="space-y-3">
                    <label className="text-[11px] font-mono text-stone-400 uppercase tracking-wider block">
                      1. VIP Seating Zone Reservation Preview
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                      {["Indoor Warm Bistro", "Terrace Sunset View", "Private Wine Alcove"].map((zone, idx) => (
                        <div
                          key={idx}
                          onClick={() => { sounds.playClick(); setSelectedIndex(idx); }}
                          className={`p-3 rounded-xl border cursor-pointer transition ${
                            selectedIndex === idx
                              ? 'bg-[#C5A880]/15 border-[#C5A880] text-[#FAF7F2]'
                              : 'bg-white/[0.03] border-white/10 text-stone-400 hover:text-white'
                          }`}
                        >
                          <p className="font-serif font-semibold text-xs text-white">{zone}</p>
                          <p className="text-[10px] font-mono text-[#C5A880] mt-1">Instant VIP Pass</p>
                        </div>
                      ))}
                    </div>

                    <div className="pt-2">
                      <button
                        type="button"
                        onClick={() => {
                          sounds.playClick();
                          onClose();
                          window.location.hash = 'showcase';
                        }}
                        className="w-full py-2.5 px-3 rounded-xl bg-[#C5A880]/15 hover:bg-[#C5A880]/25 text-[#FAF7F2] border border-[#C5A880]/40 text-xs font-sans font-semibold flex items-center justify-center gap-1.5 transition cursor-pointer"
                      >
                        <Compass className="w-3.5 h-3.5 text-[#C5A880]" />
                        <span>Launch Full Brand Showcase Landing Page</span>
                        <ArrowUpRight className="w-3.5 h-3.5 text-[#C5A880]" />
                      </button>
                    </div>
                  </div>
                )}

                {/* MODEL 4: DIRECT ONLINE DELIVERY SIMULATION */}
                {variant.id === 'delivery' && (
                  <div className="space-y-3">
                    <label className="text-[11px] font-mono text-stone-400 uppercase tracking-wider block">
                      1. Doorstep Delivery Coordinates &amp; Fee
                    </label>
                    <div className="p-4 rounded-2xl bg-[#0E0C0A] border border-stone-800 space-y-2">
                      <div className="flex items-center justify-between text-xs font-mono">
                        <span className="text-stone-400">Coverage Radius:</span>
                        <span className="text-white font-bold">Up to 8 km</span>
                      </div>
                      <div className="flex items-center justify-between text-xs font-mono">
                        <span className="text-stone-400">Estimated Transit ETA:</span>
                        <span className="text-[#C5A880] font-bold">30-40 Mins</span>
                      </div>
                      <div className="flex items-center justify-between text-xs font-mono">
                        <span className="text-stone-400">Platform Commission:</span>
                        <span className="text-[#C5A880] font-bold">0% (Keep 100% Profits)</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* MODEL 5: HYBRID DUAL MODE SIMULATION */}
                {variant.id === 'hybrid' && (
                  <div className="space-y-3">
                    <label className="text-[11px] font-mono text-stone-400 uppercase tracking-wider block">
                      1. Interactive Omnichannel Switcher
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {["Table QR Dine-In", "Doorstep Delivery", "Counter Takeaway"].map((mode, mIdx) => (
                        <div
                          key={mIdx}
                          onClick={() => { sounds.playClick(); setSelectedIndex(mIdx); }}
                          className={`p-3 rounded-xl border text-center cursor-pointer transition ${
                            selectedIndex === mIdx
                              ? 'bg-[#C5A880] text-[#12100E] font-bold'
                              : 'bg-white/[0.03] border-white/10 text-white/70'
                          }`}
                        >
                          <p className="text-xs font-sans">{mode}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* MODEL 6: 7-VISIT LOYALTY CLUB SIMULATION */}
                {variant.id === 'loyalty' && (
                  <div className="space-y-3">
                    <label className="text-[11px] font-mono text-stone-400 uppercase tracking-wider block">
                      1. Digital 7-Stamp Punch Card Progression
                    </label>
                    <div className="p-4 rounded-2xl bg-[#0E0C0A] border border-[#C5A880]/30 space-y-3">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-stone-300 font-serif font-bold">Velour Artisan Club Card</span>
                        <span className="text-[#C5A880] font-mono font-bold">Stamps: 6 of 7 (Next = 50% OFF)</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        {[1, 2, 3, 4, 5, 6].map(n => (
                          <div key={n} className="flex-1 h-3 rounded-full bg-[#C5A880] shadow-sm shadow-[#C5A880]/50" />
                        ))}
                        <div className="flex-1 h-3 rounded-full bg-[#D4B588]/40 border border-[#C5A880] animate-pulse" />
                      </div>
                      <p className="text-[11px] text-stone-400 font-sans">
                        Simulating this order will record the <strong>7th Visit</strong> and unlock <strong>50% OFF</strong>!
                      </p>
                    </div>
                  </div>
                )}

                {/* MODEL 7: GAMIFIED COFFEE & BAKERY LOYALTY SIMULATION */}
                {variant.id === 'gamified-loyalty' && (
                  <div className="space-y-3">
                    <label className="text-[11px] font-mono text-stone-400 uppercase tracking-wider block">
                      1. Interactive 6-Slot Stamp Progression &amp; 5-Day Streak Speed-Up
                    </label>
                    <div className="p-4 rounded-2xl bg-[#0E0C0A] border border-[#C5A880]/30 space-y-3">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-white font-serif font-bold flex items-center gap-1.5">
                          <Coffee className="w-3.5 h-3.5 text-[#C5A880]" />
                          <span>Artisan Coffee &amp; Bakery Passport</span>
                        </span>
                        <span className="text-[#C5A880] font-mono font-bold">Stamps: 4 of 6 (Next Bill = +2 Stamps!)</span>
                      </div>
                      
                      <div className="grid grid-cols-6 gap-2 pt-1">
                        {[1, 2, 3, 4].map(n => (
                          <div key={n} className="h-8 rounded-xl bg-[#C5A880] flex items-center justify-center font-bold text-[10px] text-[#12100E] shadow-sm">
                            <Check className="w-3.5 h-3.5 stroke-[3]" />
                          </div>
                        ))}
                        <div className="h-8 rounded-xl bg-[#D4B588]/20 border border-[#C5A880] flex items-center justify-center text-[10px] text-[#E6D5B8] font-bold animate-pulse gap-0.5">
                          <span>+2</span>
                          <Zap className="w-2.5 h-2.5 fill-[#C5A880]" />
                        </div>
                        <div className="h-8 rounded-xl bg-[#C5A880]/30 border border-[#C5A880] flex items-center justify-center text-[10px] text-[#FAF7F2] font-bold">
                          50% OFF
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-[11px] text-stone-400 font-sans pt-1">
                        <span className="flex items-center gap-1">Streak: <strong className="text-[#C5A880] inline-flex items-center gap-1">5-Day Hot Streak <Flame className="w-3 h-3 fill-[#C5A880] inline" /> (Next bill awards 2 stamps)</strong></span>
                        <span className="text-stone-300 font-bold">Target: 50% OFF Entire Order</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Customer Name Input */}
                <div className="space-y-1 pt-2">
                  <label className="text-[11px] font-mono text-stone-400">Customer Name / Guest</label>
                  <input
                    type="text"
                    required
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-black/60 border border-[#2B231D] text-white text-xs font-sans focus:outline-none focus:border-[#C5A880]"
                  />
                </div>

                {/* Submit Action */}
                <div className="pt-3">
                  <button
                    type="submit"
                    className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-[#C5A880] via-[#D8B98C] to-[#C5A880] hover:brightness-110 text-[#12100E] text-xs font-sans font-bold flex items-center justify-center gap-2 shadow-xl cursor-pointer transition-all duration-300"
                  >
                    <span>Simulate {variant.modelName}</span>
                    <ArrowRight className="w-4 h-4 text-[#12100E]" />
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
