import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  TrendingUp, 
  DollarSign, 
  ShieldCheck, 
  Sparkles, 
  Calculator, 
  Layers,
  ArrowRight,
  CheckCircle2,
  PieChart
} from 'lucide-react';
import { BRAND_CONFIG } from '../../data/cafeConfig';
import { sounds } from '../../utils/audio';

export function CafeRoiModal({ isOpen, onClose }) {
  const [dailyOrders, setDailyOrders] = useState(120);
  const [avgTicket, setAvgTicket] = useState(550);

  if (!isOpen) return null;

  // Monthly order volume
  const monthlyOrders = dailyOrders * 30;
  const monthlyGrossRevenue = monthlyOrders * avgTicket;

  // Standard aggregator commission (30% on Zomato/Swiggy/aggregators)
  const aggregatorCut = monthlyGrossRevenue * 0.30;

  // With Velour Tech: 0% marketplace commission, direct table ordering + takeaway
  // Estimated upsell boost from digital sommelier & visual food photography: +22%
  const upsellRevenueGain = monthlyGrossRevenue * 0.22;

  // Net estimated monthly financial value
  const netMonthlyBenefit = aggregatorCut + upsellRevenueGain;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/80 backdrop-blur-md"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 16 }}
          transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full max-w-2xl bg-[#141210] border border-[#C5A880]/30 rounded-3xl shadow-2xl text-[#FAF7F2] overflow-hidden z-10 my-8"
        >
          {/* Header */}
          <div className="px-6 py-5 border-b border-white/10 bg-[#0E0C0B] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-[#C5A880]/20 border border-[#C5A880]/40 flex items-center justify-center text-[#C5A880]">
                <Calculator className="w-4 h-4" />
              </div>
              <div>
                <p className="text-[10px] font-mono tracking-widest uppercase text-[#C5A880] font-bold">
                  Bistro Economics & ROI Engine
                </p>
                <h3 className="font-editorial text-lg font-bold text-white">
                  Why Leading Cafes Switch to Velour Tech
                </h3>
              </div>
            </div>

            <button
              onClick={() => { sounds.playClick(); onClose(); }}
              className="p-1.5 rounded-xl text-stone-400 hover:text-white hover:bg-white/10 transition cursor-pointer"
              aria-label="Close ROI Modal"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="p-6 space-y-6 text-left">
            {/* Interactive Sliders */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 p-5 rounded-2xl bg-[#1A1614] border border-white/10">
              
              {/* Slider 1: Daily Orders */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-stone-300">Daily Table & Pickup Orders</span>
                  <span className="font-bold text-[#C5A880] text-sm">{dailyOrders} orders/day</span>
                </div>
                <input
                  type="range"
                  min="30"
                  max="400"
                  step="10"
                  value={dailyOrders}
                  onChange={(e) => setDailyOrders(Number(e.target.value))}
                  className="w-full accent-[#C5A880] cursor-pointer"
                />
                <div className="flex justify-between text-[10px] font-mono text-stone-400">
                  <span>Boutique (30)</span>
                  <span>Busy Bistro (400)</span>
                </div>
              </div>

              {/* Slider 2: Average Check Size */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-stone-300">Average Guest Ticket (INR)</span>
                  <span className="font-bold text-[#C5A880] text-sm">₹{avgTicket}</span>
                </div>
                <input
                  type="range"
                  min="250"
                  max="1500"
                  step="25"
                  value={avgTicket}
                  onChange={(e) => setAvgTicket(Number(e.target.value))}
                  className="w-full accent-[#C5A880] cursor-pointer"
                />
                <div className="flex justify-between text-[10px] font-mono text-stone-400">
                  <span>Fast Casual (₹250)</span>
                  <span>Fine Dining (₹1,500)</span>
                </div>
              </div>

            </div>

            {/* Financial Impact Comparison Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              
              {/* Card 1: Aggregator Loss Prevented */}
              <div className="p-4 rounded-2xl bg-[#1C1815] border border-rose-500/20 space-y-1">
                <span className="text-[10px] font-mono uppercase tracking-wider text-rose-400">
                  Aggregator Bleed (30%)
                </span>
                <p className="font-editorial text-2xl font-bold text-white">
                  ₹{Math.round(aggregatorCut).toLocaleString('en-IN')}
                </p>
                <p className="text-[10px] font-mono text-stone-400 leading-snug">
                  Lost monthly to 30% delivery commission cuts
                </p>
              </div>

              {/* Card 2: Upsell Lift */}
              <div className="p-4 rounded-2xl bg-[#1C1815] border border-cyan-500/20 space-y-1">
                <span className="text-[10px] font-mono uppercase tracking-wider text-cyan-400">
                  Sommelier Upsell (+22%)
                </span>
                <p className="font-editorial text-2xl font-bold text-white">
                  +₹{Math.round(upsellRevenueGain).toLocaleString('en-IN')}
                </p>
                <p className="text-[10px] font-mono text-stone-400 leading-snug">
                  Added revenue from visual pairing prompts
                </p>
              </div>

              {/* Card 3: Net Velour Advantage */}
              <div className="p-4 rounded-2xl bg-[#1C1815] border border-[#C5A880]/50 shadow-lg space-y-1">
                <span className="text-[10px] font-mono uppercase tracking-wider text-[#C5A880] font-bold">
                  Total Monthly Value
                </span>
                <p className="font-editorial text-2xl font-bold text-[#C5A880]">
                  ₹{Math.round(netMonthlyBenefit).toLocaleString('en-IN')}
                </p>
                <p className="text-[10px] font-mono text-stone-300 leading-snug">
                  Retained profit + operational speed gains
                </p>
              </div>

            </div>

            {/* Operational Metrics Checklist */}
            <div className="p-4 rounded-2xl bg-[#0E0C0B] border border-white/10 space-y-2.5 font-mono text-xs">
              <div className="flex items-center gap-2 text-stone-300">
                <CheckCircle2 className="w-4 h-4 text-[#C5A880] shrink-0" />
                <span>Zero aggregator commissions. 100% of guest billing settles straight to your bank UPI.</span>
              </div>
              <div className="flex items-center gap-2 text-stone-300">
                <CheckCircle2 className="w-4 h-4 text-[#C5A880] shrink-0" />
                <span>3.8x faster table turnover during peak rush hours with instant table plaque ordering.</span>
              </div>
              <div className="flex items-center gap-2 text-stone-300">
                <CheckCircle2 className="w-4 h-4 text-[#C5A880] shrink-0" />
                <span>Zero hardware rental lock-in. Runs seamlessly on standard iPads, Android tablets, and PC.</span>
              </div>
            </div>

            {/* Footer CTA */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-mono">
              <span className="text-stone-400">White-label licensing customized for individual & multi-outlet brands</span>
              <button
                onClick={() => {
                  sounds.playClick();
                  onClose();
                  window.open(`https://wa.me/${BRAND_CONFIG.contact.whatsapp}?text=Hello%20Dripp%20Media,%20I%20would%20like%20to%20deploy%20Velour%20Tech%20for%20my%20cafe`, '_blank');
                }}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-[#C5A880] hover:bg-[#B89358] text-[#12100E] font-bold flex items-center justify-center gap-2 transition cursor-pointer"
              >
                <span>Request White-Label Quote</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
