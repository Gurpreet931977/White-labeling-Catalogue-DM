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
  Layers
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
      id: `CAFE-${Math.floor(100000 + Math.random() * 900000)}`,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      modelName: variant.modelName,
      type: variant.type
    });
    setBookingSuccess(true);
  };

  const handleReset = () => {
    setBookingSuccess(false);
    setGeneratedTicket(null);
  };

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
                <Coffee className="w-5 h-5" />
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
                    ORDER TOKEN CONFIRMED
                  </span>
                  <h4 className="font-panchang font-bold text-xl text-white pt-2">
                    Simulated Experience Completed
                  </h4>
                  <p className="text-xs text-slate-300 font-clash max-w-md mx-auto">
                    In the live production build for <strong>{variant.modelName}</strong>, this updates kitchen tokens and dispatches an automated receipt.
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

                {/* ARTISANAL ROASTERY SIMULATOR */}
                {variant.id === 'artisanal-roastery' && variant.demoData && (
                  <div className="space-y-4">
                    <label className="text-[11px] font-mono text-slate-400 uppercase tracking-wider block">
                      1. Select Single-Origin Bean Profile
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {variant.demoData.beans.map((bean, idx) => (
                        <div
                          key={idx}
                          onClick={() => {
                            sounds.playClick();
                            setSelectedIndex(idx);
                          }}
                          className={`p-3.5 rounded-2xl border cursor-pointer transition ${
                            selectedIndex === idx 
                              ? 'bg-[#ebd73f]/10 border-[#ebd73f] shadow-glow-yellow' 
                              : 'bg-white/[0.03] border-white/10 hover:border-white/20'
                          }`}
                        >
                          <p className="font-clash font-bold text-xs text-white">{bean.name}</p>
                          <p className="text-[10px] text-slate-400 mt-0.5">Notes: {bean.notes}</p>
                          <div className="mt-2 pt-2 border-t border-white/10 flex items-center justify-between text-[10px] font-mono">
                            <span className="text-[#ebd73f] font-bold">{bean.price}</span>
                            <span className="text-slate-400">{bean.elevation}</span>
                          </div>
                        </div>
                      ))}
                    </div>

                    <label className="text-[11px] font-mono text-slate-400 uppercase tracking-wider block pt-2">
                      2. Choose Brew Method or Whole Bean Subscription
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {variant.demoData.brewMethods.map((method, mIdx) => (
                        <button
                          type="button"
                          key={mIdx}
                          onClick={() => {
                            sounds.playClick();
                            setSelectedSub(mIdx);
                          }}
                          className={`px-3 py-1.5 rounded-xl text-xs font-mono transition cursor-pointer ${
                            selectedSub === mIdx
                              ? 'bg-[#ebd73f] text-black font-bold shadow-md'
                              : 'bg-white/[0.04] border border-white/10 text-slate-300 hover:text-white'
                          }`}
                        >
                          {method}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* ROOFTOP BISTRO SIMULATOR */}
                {variant.id === 'rooftop-bistro' && variant.demoData && (
                  <div className="space-y-4">
                    <label className="text-[11px] font-mono text-slate-400 uppercase tracking-wider block">
                      1. Select Sunset Dining Zone
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {variant.demoData.zones.map((zone, idx) => (
                        <div
                          key={idx}
                          onClick={() => {
                            sounds.playClick();
                            setSelectedIndex(idx);
                          }}
                          className={`p-3.5 rounded-2xl border cursor-pointer transition ${
                            selectedIndex === idx 
                              ? 'bg-[#ebd73f]/10 border-[#ebd73f] shadow-glow-yellow' 
                              : 'bg-white/[0.03] border-white/10 hover:border-white/20'
                          }`}
                        >
                          <p className="font-clash font-bold text-xs text-white">{zone.name}</p>
                          <p className="text-[10px] text-slate-400 mt-0.5">{zone.vibe}</p>
                          <div className="mt-2 pt-2 border-t border-white/10 flex items-center justify-between text-[10px] font-mono">
                            <span className="text-[#ebd73f] font-bold">{zone.minSpend}</span>
                            <span className="text-slate-400">{zone.capacity}</span>
                          </div>
                        </div>
                      ))}
                    </div>

                    <label className="text-[11px] font-mono text-slate-400 uppercase tracking-wider block pt-2">
                      2. Seasonal Chef Tasting Menu
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {variant.demoData.menus.map((menu, mIdx) => (
                        <div
                          key={mIdx}
                          onClick={() => {
                            sounds.playClick();
                            setSelectedSub(mIdx);
                          }}
                          className={`p-3 rounded-xl border cursor-pointer transition ${
                            selectedSub === mIdx
                              ? 'bg-[#ebd73f] text-black font-bold'
                              : 'bg-white/[0.03] border-white/10 text-white/70 hover:text-white'
                          }`}
                        >
                          <p className="text-xs">{menu.title}</p>
                          <p className="text-[11px] font-mono mt-0.5">{menu.price}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* CLOUD KITCHEN EXPRESS SIMULATOR */}
                {variant.id === 'cloud-kitchen' && variant.demoData && (
                  <div className="space-y-4">
                    <label className="text-[11px] font-mono text-slate-400 uppercase tracking-wider block">
                      1. Select Fast-Casual Smash Box Combo
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {variant.demoData.combos.map((combo, idx) => (
                        <div
                          key={idx}
                          onClick={() => {
                            sounds.playClick();
                            setSelectedIndex(idx);
                          }}
                          className={`p-3.5 rounded-2xl border cursor-pointer transition ${
                            selectedIndex === idx 
                              ? 'bg-[#ebd73f]/10 border-[#ebd73f] shadow-glow-yellow' 
                              : 'bg-white/[0.03] border-white/10 hover:border-white/20'
                          }`}
                        >
                          <p className="font-clash font-bold text-xs text-white">{combo.name}</p>
                          <p className="text-[10px] text-slate-400 mt-1 leading-snug">{combo.includes}</p>
                          <p className="mt-2 pt-2 border-t border-white/10 text-xs font-mono text-[#ebd73f] font-bold">
                            {combo.price}
                          </p>
                        </div>
                      ))}
                    </div>

                    <label className="text-[11px] font-mono text-slate-400 uppercase tracking-wider block pt-2">
                      2. Express Pickup Window
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {variant.demoData.pickupTimes.map((time, tIdx) => (
                        <button
                          type="button"
                          key={tIdx}
                          onClick={() => {
                            sounds.playClick();
                            setSelectedSub(tIdx);
                          }}
                          className={`px-3.5 py-2 rounded-xl text-xs font-mono transition cursor-pointer ${
                            selectedSub === tIdx
                              ? 'bg-[#ebd73f] text-black font-bold shadow-md'
                              : 'bg-white/[0.04] border border-white/10 text-slate-300 hover:text-white'
                          }`}
                        >
                          {time}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Customer Name Input */}
                <div className="space-y-1 pt-2">
                  <label className="text-[11px] font-mono text-slate-400">Customer Name / Table Guest</label>
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
                    <span>Simulate Instant Order &amp; Token Checkout</span>
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
