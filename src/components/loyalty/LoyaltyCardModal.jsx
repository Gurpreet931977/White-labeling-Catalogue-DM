import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  Award, 
  Crown, 
  Check, 
  Coffee, 
  Utensils, 
  Gift, 
  Clock, 
  CheckCircle2, 
  Flame, 
  QrCode, 
  RotateCcw,
  ArrowRight,
  ShieldCheck
} from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { BRAND_CONFIG } from '../../data/cafeConfig';
import { sounds } from '../../utils/audio';

export function LoyaltyCardModal({ isOpen, onClose, onOpenCart }) {
  if (!isOpen) return null;

  const { 
    loyaltyVisits, 
    incrementLoyaltyVisit, 
    resetLoyalty, 
    is7thVisitUnlocked, 
    claim7thVisitReward, 
    lastCheckinTime,
    customerName
  } = useCart();

  const [stampFeedback, setStampFeedback] = useState(null);

  const handleManualCheckin = () => {
    incrementLoyaltyVisit('manual');
    setStampFeedback(`Visit #${loyaltyVisits + 1 > 7 ? 1 : loyaltyVisits + 1} stamped successfully!`);
    setTimeout(() => setStampFeedback(null), 3500);
  };

  const handleClaim = () => {
    claim7thVisitReward();
    if (onOpenCart) onOpenCart();
    onClose();
  };

  const totalStamps = 7;
  const stampsLeft = Math.max(0, totalStamps - loyaltyVisits);

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="relative w-full max-w-lg bg-slate-900 border border-amber-400/30 rounded-3xl p-5 sm:p-7 shadow-2xl overflow-hidden text-white"
        >
          {/* Ambient Gold Glow */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

          {/* Top Bar */}
          <div className="flex items-center justify-between pb-4 border-b border-white/10 relative z-10">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 text-slate-950 flex items-center justify-center font-black shadow-lg shadow-amber-500/20">
                <Award className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono uppercase text-amber-400 tracking-wider font-bold">
                    {BRAND_CONFIG.loyalty?.clubName || "THC Artisan Club"}
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-amber-400/15 text-amber-300 font-mono text-[9px] border border-amber-400/20 font-bold">
                    VIP PASS
                  </span>
                </div>
                <h3 className="text-lg font-bold font-syne text-white">
                  7-Visit Punch Card
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

          {/* Member Card Header */}
          <div className="mt-4 p-4 rounded-2xl bg-slate-950/80 border border-white/5 flex items-center justify-between">
            <div>
              <p className="text-[11px] text-slate-400 font-mono">Loyalty Member</p>
              <h4 className="text-sm font-bold text-white font-syne">{customerName || 'Cafe Guest'}</h4>
            </div>
            <div className="text-right">
              <p className="text-[11px] text-slate-400 font-mono">Current Status</p>
              <span className={`text-xs font-bold font-mono px-2.5 py-0.5 rounded-full ${
                is7thVisitUnlocked
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 animate-pulse'
                  : 'bg-amber-400/15 text-amber-300 border border-amber-400/30'
              }`}>
                {is7thVisitUnlocked ? 'REWARD UNLOCKED!' : `Visit ${loyaltyVisits} of 7`}
              </span>
            </div>
          </div>

          {/* Feedback Toast */}
          {stampFeedback && (
            <motion.div
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-3 p-2.5 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-mono text-center flex items-center justify-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{stampFeedback}</span>
            </motion.div>
          )}

          {/* 7 STAMP TILES GRID */}
          <div className="mt-5 space-y-2">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-slate-400">Stamp Progress:</span>
              <span className="text-amber-400 font-bold">
                {is7thVisitUnlocked ? '100% Complete!' : `${stampsLeft} more ${stampsLeft === 1 ? 'visit' : 'visits'} to unlock 50% OFF`}
              </span>
            </div>

            {/* Grid of 7 Stamps */}
            <div className="grid grid-cols-4 gap-2.5 pt-1">
              {[1, 2, 3, 4, 5, 6, 7].map((stampNum) => {
                const isStamped = loyaltyVisits >= stampNum;
                const isMilestone = stampNum === 7;

                return (
                  <motion.div
                    key={stampNum}
                    whileHover={{ scale: 1.03 }}
                    className={`relative p-3 rounded-2xl border flex flex-col items-center justify-center gap-1.5 transition-all text-center ${
                      isMilestone ? 'col-span-2' : 'col-span-1'
                    } ${
                      isStamped
                        ? 'bg-gradient-to-b from-amber-500/20 to-amber-950/40 border-amber-400/50 shadow-md shadow-amber-500/10'
                        : isMilestone
                        ? 'bg-gradient-to-b from-purple-500/15 to-slate-950 border-purple-400/30'
                        : 'bg-slate-950/60 border-white/10 opacity-70'
                    }`}
                  >
                    {/* Stamp Indicator Icon */}
                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold text-xs ${
                      isStamped
                        ? 'bg-amber-400 text-slate-950 shadow-md font-black ring-2 ring-amber-300/60'
                        : isMilestone
                        ? 'bg-purple-500/20 text-purple-300 border border-purple-400/40'
                        : 'bg-slate-800 text-slate-500'
                    }`}>
                      {isStamped ? (
                        <Check className="w-4 h-4 stroke-[3]" />
                      ) : isMilestone ? (
                        <Gift className="w-4 h-4 text-purple-300" />
                      ) : (
                        <Coffee className="w-3.5 h-3.5" />
                      )}
                    </div>

                    <span className={`text-[10px] font-mono font-bold ${
                      isStamped ? 'text-amber-300' : isMilestone ? 'text-purple-300 font-syne' : 'text-slate-400'
                    }`}>
                      {isMilestone
                        ? (isStamped ? '50% UNLOCKED' : '7TH: 50% OFF')
                        : `Visit ${stampNum}`}
                    </span>

                    {/* Stamp Watermark */}
                    {isStamped && (
                      <span className="text-[8px] font-mono px-1.5 rounded bg-amber-400/20 text-amber-200 border border-amber-400/30">
                        STAMPED
                      </span>
                    )}
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Reward Unlock Action / Claim Button */}
          {is7thVisitUnlocked ? (
            <div className="mt-5 p-4 rounded-2xl bg-gradient-to-r from-emerald-950/80 to-slate-950 border-2 border-emerald-400/60 text-center space-y-3 shadow-xl">
              <div className="flex items-center justify-center gap-2 text-emerald-300 text-sm font-bold font-syne">
                <Gift className="w-5 h-5 text-emerald-400" />
                <span>Congratulations! 7th Visit Milestone Achieved!</span>
              </div>
              <p className="text-xs text-slate-300 font-clash">
                You've unlocked <strong>50% OFF</strong> on your entire bill (or a Free Signature Beverage/Pizza)!
              </p>
              <button
                onClick={handleClaim}
                className="w-full btn-3d btn-3d-amber py-2.5 rounded-xl font-syne font-bold text-xs flex items-center justify-center gap-2 shadow-lg cursor-pointer"
              >
                <span>Apply 50% OFF To Order Now</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          ) : (
            /* Next Milestone Teaser */
            <div className="mt-4 p-3.5 rounded-2xl bg-slate-950/70 border border-white/5 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2 text-slate-300">
                <Gift className="w-4 h-4 text-amber-400 shrink-0" />
                <span className="text-[11px] leading-tight">
                  7th Visit Reward: <strong>50% OFF</strong> entire order
                </span>
              </div>
              <span className="text-[10px] font-mono text-amber-400 font-bold shrink-0">
                {stampsLeft} stamps left
              </span>
            </div>
          )}

          {/* Integrated Billing Notice */}
          <div className="mt-4 p-3 rounded-xl bg-white/[0.03] border border-white/5 flex items-start gap-2.5 text-[11px] text-slate-400 leading-relaxed">
            <ShieldCheck className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
            <p>
              <strong className="text-white">Billing Auto-Sync:</strong> Your loyalty visit count marks up automatically every time you settle a bill online or at the counter!
            </p>
          </div>

          {/* Kiosk Simulation Actions (Mark Presence / Reset) */}
          <div className="mt-5 pt-4 border-t border-white/10 flex items-center justify-between gap-3">
            <button
              onClick={handleManualCheckin}
              className="flex-1 py-2 rounded-xl bg-amber-400/15 hover:bg-amber-400/25 border border-amber-400/30 text-amber-300 font-syne font-bold text-xs flex items-center justify-center gap-2 transition cursor-pointer"
            >
              <Crown className="w-3.5 h-3.5" />
              <span>Mark Today's Visit (+1)</span>
            </button>

            <button
              onClick={resetLoyalty}
              title="Reset punch card to visit 1 (for testing)"
              className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white text-xs font-mono flex items-center gap-1.5 transition cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Reset</span>
            </button>
          </div>

        </motion.div>
      </div>
    </AnimatePresence>
  );
}
