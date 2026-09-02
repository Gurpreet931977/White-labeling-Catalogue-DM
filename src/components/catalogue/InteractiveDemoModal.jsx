import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  CheckCircle2, 
  Calendar, 
  Clock, 
  User, 
  Phone, 
  Sparkles, 
  QrCode, 
  Trophy, 
  MapPin, 
  CreditCard,
  Send,
  ArrowRight,
  ShieldCheck,
  Check
} from 'lucide-react';
import { sounds } from '../../utils/audio';

export function InteractiveDemoModal({ niche, isOpen, onClose, onOpenQuote }) {
  if (!isOpen || !niche) return null;

  // Generic flow states
  const [selectedItemIndex, setSelectedItemIndex] = useState(0);
  const [selectedSlot, setSelectedSlot] = useState(0);
  const [customerName, setCustomerName] = useState('Alex Morgan');
  const [customerPhone, setCustomerPhone] = useState('+91 98765 43210');
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [generatedTicket, setGeneratedTicket] = useState(null);

  const handleConfirmBooking = (e) => {
    e.preventDefault();
    sounds.playSuccess();
    
    setGeneratedTicket({
      id: `DM-${Math.floor(100000 + Math.random() * 900000)}`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      nicheTitle: niche.title,
      clientBrand: niche.clientBrand
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

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="w-full max-w-3xl bg-[#0c0c0c] border border-white/15 rounded-3xl overflow-hidden shadow-2xl shadow-black my-8 flex flex-col max-h-[90vh]"
        >
          {/* Header */}
          <div className="p-5 sm:p-6 border-b border-white/10 flex items-center justify-between bg-white/[0.02]">
            <div className="flex items-center gap-3">
              <div 
                className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-black shadow-lg"
                style={{ backgroundColor: niche.accentColor }}
              >
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-[10px] tracking-widest uppercase text-slate-400">
                    {niche.code} • INTERACTIVE DEMO
                  </span>
                  <span className="text-[10px] font-mono px-2 py-0.2 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                    ONLINE
                  </span>
                </div>
                <h3 className="font-panchang font-bold text-lg text-white">
                  {niche.clientBrand}
                </h3>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-white/70 hover:text-white transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body */}
          <div className="p-5 sm:p-6 overflow-y-auto flex-grow space-y-6">
            
            {bookingSuccess ? (
              /* SUCCESS CONFIRMATION PASS */
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-6 rounded-2xl bg-[#141414] border border-white/15 text-center space-y-5"
              >
                <div 
                  className="w-16 h-16 rounded-full mx-auto flex items-center justify-center text-black shadow-xl"
                  style={{ backgroundColor: niche.accentColor }}
                >
                  <Check className="w-8 h-8 stroke-[3]" />
                </div>

                <div className="space-y-1">
                  <span className="text-[11px] font-mono px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-400 font-bold border border-emerald-500/30">
                    CONFIRMATION TOKEN DISPATCHED
                  </span>
                  <h4 className="font-panchang font-bold text-xl text-white pt-2">
                    Booking Successfully Simulated!
                  </h4>
                  <p className="text-xs text-slate-300 font-clash max-w-md mx-auto">
                    In the live production build, an automated WhatsApp SMS and Calendar invite is sent instantly to <strong>{customerPhone}</strong>.
                  </p>
                </div>

                {/* Digital Ticket Stash */}
                <div className="max-w-md mx-auto p-4 rounded-xl bg-black/60 border border-white/10 text-left space-y-3 font-mono text-xs">
                  <div className="flex items-center justify-between pb-2 border-b border-white/10">
                    <span className="text-slate-400">TICKET REF:</span>
                    <span className="text-white font-bold">{generatedTicket?.id}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">SERVICE PORTAL:</span>
                    <span className="text-white">{niche.clientBrand}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">RECIPIENT:</span>
                    <span className="text-white font-bold">{customerName}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">DISPATCH TIME:</span>
                    <span className="text-emerald-400">{generatedTicket?.timestamp}</span>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-3">
                  <button
                    onClick={handleReset}
                    className="w-full sm:w-auto px-5 py-2.5 rounded-full bg-white/10 hover:bg-white/15 text-white text-xs font-semibold transition"
                  >
                    Test Another Simulation
                  </button>

                  <button
                    onClick={() => {
                      sounds.playClick();
                      onClose();
                      onOpenQuote();
                    }}
                    className="w-full sm:w-auto px-6 py-2.5 rounded-full text-black text-xs font-bold transition flex items-center justify-center gap-2 shadow-lg"
                    style={{ backgroundColor: niche.accentColor }}
                  >
                    <span>Deploy This System for Your Business</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </motion.div>
            ) : (
              /* INTERACTIVE FORM FLOWS BY NICHE */
              <form onSubmit={handleConfirmBooking} className="space-y-6">
                
                {/* Intro Headline */}
                <div>
                  <h4 className="font-panchang font-bold text-base sm:text-lg text-white">
                    {niche.headline}
                  </h4>
                  <p className="text-xs text-slate-300/80 font-clash mt-1">
                    Try out the booking experience below to see how easy it is for customers.
                  </p>
                </div>

                {/* NICHE 1: CLINICS */}
                {niche.id === 'clinics' && niche.demoData && (
                  <div className="space-y-4">
                    <label className="text-[11px] font-mono text-slate-400 uppercase tracking-wider block">
                      1. Select Specialist Doctor
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {niche.demoData.doctors.map((doc, idx) => (
                        <div
                          key={idx}
                          onClick={() => {
                            sounds.playClick();
                            setSelectedItemIndex(idx);
                          }}
                          className={`p-3 rounded-2xl border cursor-pointer transition ${
                            selectedItemIndex === idx 
                              ? 'bg-cyan-500/10 border-cyan-400 shadow-glow-cyan' 
                              : 'bg-white/[0.03] border-white/10 hover:border-white/20'
                          }`}
                        >
                          <img src={doc.image} alt={doc.name} className="w-12 h-12 rounded-xl object-cover mb-2" />
                          <p className="font-clash font-bold text-xs text-white">{doc.name}</p>
                          <p className="text-[10px] text-slate-400 leading-tight mt-0.5">{doc.specialty}</p>
                          <div className="mt-2 pt-2 border-t border-white/10 flex items-center justify-between text-[10px] font-mono">
                            <span className="text-cyan-400">{doc.fee}</span>
                            <span className="text-slate-400">⭐ {doc.rating}</span>
                          </div>
                        </div>
                      ))}
                    </div>

                    <label className="text-[11px] font-mono text-slate-400 uppercase tracking-wider block pt-2">
                      2. Select Consultation Slot
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {niche.demoData.availableSlots.map((slot, sIdx) => (
                        <button
                          type="button"
                          key={sIdx}
                          onClick={() => {
                            sounds.playClick();
                            setSelectedSlot(sIdx);
                          }}
                          className={`px-3 py-1.5 rounded-xl text-xs font-mono transition ${
                            selectedSlot === sIdx
                              ? 'bg-cyan-400 text-black font-bold shadow-md'
                              : 'bg-white/[0.04] border border-white/10 text-slate-300 hover:text-white'
                          }`}
                        >
                          {slot}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* NICHE 2: GYMS */}
                {niche.id === 'gyms' && niche.demoData && (
                  <div className="space-y-4">
                    <label className="text-[11px] font-mono text-slate-400 uppercase tracking-wider block">
                      1. Select Membership Tier
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {niche.demoData.plans.map((plan, idx) => (
                        <div
                          key={idx}
                          onClick={() => {
                            sounds.playClick();
                            setSelectedItemIndex(idx);
                          }}
                          className={`p-3.5 rounded-2xl border cursor-pointer transition ${
                            selectedItemIndex === idx 
                              ? 'bg-rose-500/10 border-rose-500 shadow-glow-red' 
                              : 'bg-white/[0.03] border-white/10 hover:border-white/20'
                          }`}
                        >
                          <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-white/10 text-white font-bold uppercase">
                            {plan.tag}
                          </span>
                          <p className="font-clash font-bold text-sm text-white mt-2">{plan.name}</p>
                          <p className="text-lg font-panchang font-black text-rose-400 mt-1">{plan.price}</p>
                          <p className="text-[10px] text-slate-400 -mt-1 font-mono">/{plan.cycle}</p>
                          <ul className="mt-3 pt-2 border-t border-white/10 space-y-1 text-[10px] text-slate-300">
                            {plan.perks.map((p, pI) => (
                              <li key={pI}>• {p}</li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* NICHE 3: NIGHTCLUBS */}
                {niche.id === 'clubs' && niche.demoData && (
                  <div className="space-y-4">
                    <label className="text-[11px] font-mono text-slate-400 uppercase tracking-wider block">
                      1. Select VIP Table / Bottle Service Reservation
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {niche.demoData.tables.map((table, idx) => (
                        <div
                          key={idx}
                          onClick={() => {
                            sounds.playClick();
                            setSelectedItemIndex(idx);
                          }}
                          className={`p-3.5 rounded-2xl border cursor-pointer transition ${
                            selectedItemIndex === idx 
                              ? 'bg-purple-500/10 border-purple-400 shadow-glow-purple' 
                              : 'bg-white/[0.03] border-white/10 hover:border-white/20'
                          }`}
                        >
                          <p className="font-clash font-bold text-xs text-white">{table.name}</p>
                          <p className="text-sm font-panchang font-bold text-purple-400 mt-1">{table.minSpend}</p>
                          <p className="text-[10px] font-mono text-slate-400">{table.guests}</p>
                          <p className="text-[10px] text-slate-300 mt-2 border-t border-white/10 pt-1.5 leading-snug">
                            {table.perks}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* NICHE 4: TURFS */}
                {niche.id === 'turfs' && niche.demoData && (
                  <div className="space-y-4">
                    <label className="text-[11px] font-mono text-slate-400 uppercase tracking-wider block">
                      1. Select Sports Pitch / Arena
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {niche.demoData.courts.map((court, idx) => (
                        <div
                          key={idx}
                          onClick={() => {
                            sounds.playClick();
                            setSelectedItemIndex(idx);
                          }}
                          className={`p-3.5 rounded-2xl border cursor-pointer transition ${
                            selectedItemIndex === idx 
                              ? 'bg-emerald-500/10 border-emerald-400 shadow-md' 
                              : 'bg-white/[0.03] border-white/10 hover:border-white/20'
                          }`}
                        >
                          <p className="font-clash font-bold text-xs text-white leading-tight">{court.name}</p>
                          <p className="text-sm font-panchang font-bold text-emerald-400 mt-1">{court.rateDay}</p>
                          <p className="text-[10px] font-mono text-slate-400 mt-0.5">Floodlights: {court.rateNight}</p>
                        </div>
                      ))}
                    </div>

                    <label className="text-[11px] font-mono text-slate-400 uppercase tracking-wider block pt-2">
                      2. Choose Match Time Slot
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {niche.demoData.availableSlots.map((slot, sIdx) => (
                        <button
                          type="button"
                          key={sIdx}
                          onClick={() => {
                            sounds.playClick();
                            setSelectedSlot(sIdx);
                          }}
                          className={`p-2 rounded-xl text-left border transition ${
                            selectedSlot === sIdx
                              ? 'bg-emerald-500 text-black font-bold'
                              : 'bg-white/[0.03] border-white/10 text-white/70 hover:text-white'
                          }`}
                        >
                          <p className="text-[10px] font-mono">{slot.time}</p>
                          <p className="text-xs font-bold mt-1">{slot.rate}</p>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* NICHE 5: SALONS */}
                {niche.id === 'salons' && niche.demoData && (
                  <div className="space-y-4">
                    <label className="text-[11px] font-mono text-slate-400 uppercase tracking-wider block">
                      1. Select Bespoke Treatment Package
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {niche.demoData.services.map((srv, idx) => (
                        <div
                          key={idx}
                          onClick={() => {
                            sounds.playClick();
                            setSelectedItemIndex(idx);
                          }}
                          className={`p-3.5 rounded-2xl border cursor-pointer transition ${
                            selectedItemIndex === idx 
                              ? 'bg-rose-500/10 border-rose-400 shadow-md' 
                              : 'bg-white/[0.03] border-white/10 hover:border-white/20'
                          }`}
                        >
                          <p className="font-clash font-bold text-xs text-white">{srv.name}</p>
                          <div className="flex items-center justify-between mt-2 pt-2 border-t border-white/10 text-xs font-mono">
                            <span className="text-rose-400 font-bold">{srv.price}</span>
                            <span className="text-slate-400">{srv.duration}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Customer Details Row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  <div className="space-y-1">
                    <label className="text-[11px] font-mono text-slate-400">Customer Full Name</label>
                    <input
                      type="text"
                      required
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      className="w-full px-3.5 py-2 rounded-xl bg-black border border-white/15 text-white text-xs font-clash focus:outline-none focus:border-white"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-mono text-slate-400">WhatsApp / Phone Number</label>
                    <input
                      type="text"
                      required
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      className="w-full px-3.5 py-2 rounded-xl bg-black border border-white/15 text-white text-xs font-clash focus:outline-none focus:border-white"
                    />
                  </div>
                </div>

                {/* Submit Action */}
                <div className="pt-3">
                  <button
                    type="submit"
                    className="w-full py-3.5 rounded-full font-bold text-xs text-black transition flex items-center justify-center gap-2 shadow-xl cursor-pointer hover:scale-[1.01]"
                    style={{ backgroundColor: niche.accentColor }}
                  >
                    <span>Simulate Instant Customer Booking</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                  <p className="text-center text-[10px] font-mono text-slate-500 mt-2">
                    ✦ Instant simulated flow • No real payment deducted
                  </p>
                </div>

              </form>
            )}

          </div>

        </motion.div>

      </div>
    </AnimatePresence>
  );
}
