import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  Calendar, 
  Clock, 
  Users, 
  Sparkles, 
  CheckCircle2, 
  Phone, 
  User, 
  Send,
  Compass,
  ArrowRight
} from 'lucide-react';
import { BRAND_CONFIG } from '../../data/cafeConfig';
import { sounds } from '../../utils/audio';

export function TableReservationModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  const [date, setDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [time, setTime] = useState('19:30');
  const [guests, setGuests] = useState(2);
  const [seating, setSeating] = useState('Indoor Warm Bistro');
  const [name, setName] = useState('Alex Morgan');
  const [phone, setPhone] = useState('9876543210');
  const [notes, setNotes] = useState('');
  const [confirmedPass, setConfirmedPass] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    sounds.playSuccess();
    setConfirmedPass({
      passId: `VIP-RES-${Math.floor(1000 + Math.random() * 9000)}`,
      date,
      time,
      guests,
      seating,
      name,
      phone
    });
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="relative w-full max-w-lg bg-slate-900 border border-white/10 rounded-3xl p-5 sm:p-7 shadow-2xl overflow-hidden text-white"
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-white/10">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-2xl bg-amber-400 text-slate-950 flex items-center justify-center font-black shadow-lg">
                <Calendar className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-mono text-amber-400 uppercase tracking-wider font-bold">
                  {BRAND_CONFIG.shortName} • RESERVATION
                </span>
                <h3 className="text-lg font-bold font-syne text-white">
                  Reserve a Table
                </h3>
              </div>
            </div>

            <button
              onClick={() => { sounds.playClick(); onClose(); }}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {confirmedPass ? (
            /* Reservation Confirmed Pass */
            <div className="mt-5 space-y-4 text-center">
              <div className="w-14 h-14 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-7 h-7" />
              </div>

              <div>
                <span className="text-xs font-mono text-emerald-400 font-bold uppercase tracking-widest">
                  Confirmed Table Booking
                </span>
                <h4 className="text-xl font-bold font-syne text-white mt-1">
                  We Can't Wait To Host You!
                </h4>
                <p className="text-xs text-slate-400 font-clash mt-1">
                  Your VIP reservation has been registered with our front-of-house host.
                </p>
              </div>

              {/* Pass Card */}
              <div className="p-4 rounded-2xl bg-slate-950 border border-white/10 text-left space-y-2.5 font-mono text-xs">
                <div className="flex items-center justify-between pb-2 border-b border-white/5">
                  <span className="text-slate-500">RESERVATION ID</span>
                  <span className="text-amber-400 font-bold">{confirmedPass.passId}</span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-[11px]">
                  <div>
                    <span className="text-slate-500 block">GUEST</span>
                    <span className="text-white font-semibold">{confirmedPass.name} ({confirmedPass.guests} Guests)</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">SCHEDULE</span>
                    <span className="text-white font-semibold">{confirmedPass.date} at {confirmedPass.time}</span>
                  </div>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px]">SEATING ZONE</span>
                  <span className="text-slate-300 font-semibold">{confirmedPass.seating}</span>
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <a
                  href={`https://wa.me/${BRAND_CONFIG.contact.whatsapp}?text=${encodeURIComponent(`Hi! I've reserved a table for ${confirmedPass.guests} guests on ${confirmedPass.date} at ${confirmedPass.time}. ID: ${confirmedPass.passId}`)}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex-1 py-2.5 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 text-xs font-syne font-bold flex items-center justify-center gap-1.5 transition"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Send to WhatsApp</span>
                </a>
                <button
                  onClick={() => { sounds.playClick(); onClose(); }}
                  className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-syne font-bold transition"
                >
                  Done
                </button>
              </div>
            </div>
          ) : (
            /* Reservation Form */
            <form onSubmit={handleSubmit} className="mt-4 space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-mono text-slate-400 mb-1 block">Date</label>
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    required
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-white/10 text-white focus:outline-none focus:border-amber-400 font-mono"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-mono text-slate-400 mb-1 block">Time Slot</label>
                  <select
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-white/10 text-white focus:outline-none focus:border-amber-400 font-mono"
                  >
                    <option value="12:30">12:30 PM (Lunch)</option>
                    <option value="13:30">01:30 PM (Lunch)</option>
                    <option value="16:00">04:00 PM (High Tea)</option>
                    <option value="18:30">06:30 PM (Sunset)</option>
                    <option value="19:30">07:30 PM (Dinner)</option>
                    <option value="20:30">08:30 PM (Dinner)</option>
                    <option value="21:30">09:30 PM (Late Night)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-mono text-slate-400 mb-1 block">Party Size</label>
                  <select
                    value={guests}
                    onChange={(e) => setGuests(parseInt(e.target.value, 10))}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-white/10 text-white focus:outline-none focus:border-amber-400 font-mono"
                  >
                    {[1, 2, 3, 4, 5, 6, 8, 10, 12].map(num => (
                      <option key={num} value={num}>{num} {num === 1 ? 'Guest' : 'Guests'}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-[11px] font-mono text-slate-400 mb-1 block">Seating Zone</label>
                  <select
                    value={seating}
                    onChange={(e) => setSeating(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-white/10 text-white focus:outline-none focus:border-amber-400 font-mono"
                  >
                    <option value="Indoor Warm Bistro">Indoor Warm Bistro</option>
                    <option value="Terrace Sunset View">Terrace Sunset View</option>
                    <option value="Botanical Glass Corner">Botanical Glass Corner</option>
                    <option value="Private Alcove">Private Alcove (Quiet)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-mono text-slate-400 mb-1 block">Full Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your Name"
                    required
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-white/10 text-white focus:outline-none focus:border-amber-400 font-sans"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-mono text-slate-400 mb-1 block">Phone (for SMS/WhatsApp)</label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="Mobile Number"
                    required
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-white/10 text-white focus:outline-none focus:border-amber-400 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-mono text-slate-400 mb-1 block">Special Requests (Optional)</label>
                <input
                  type="text"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g. Birthday celebration, high chair, window seat"
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-white/10 text-white focus:outline-none focus:border-amber-400 font-sans"
                />
              </div>

              <button
                type="submit"
                className="w-full btn-3d btn-3d-amber py-2.5 rounded-xl font-syne font-bold text-xs flex items-center justify-center gap-1.5 shadow-lg pt-2 mt-2 cursor-pointer"
              >
                <span>Confirm VIP Table Reservation</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}

        </motion.div>
      </div>
    </AnimatePresence>
  );
}
