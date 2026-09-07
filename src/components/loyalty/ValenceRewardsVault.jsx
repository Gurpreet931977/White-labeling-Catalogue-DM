import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles,
  Gift,
  Percent,
  Award,
  Clock,
  CheckCircle2,
  Lock,
  Copy,
  Check,
  X,
  ArrowRight,
  ShieldCheck,
  Barcode,
  Flame,
  Zap
} from 'lucide-react';
import { sounds } from '../../utils/audio';
import { LottieBouncyStar } from './GamifiedLottieIcons';

export function ValenceRewardsVault({ customer, totalSlots = 6, currentGift }) {
  const currentStamps = customer?.stamps || 0;
  
  // Daily Mystery Box State
  const [isMysteryShaking, setIsMysteryShaking] = useState(false);
  const [mysteryRevealed, setMysteryRevealed] = useState(false);
  const [mysteryPerk, setMysteryPerk] = useState(null);

  // Active Redemption Voucher Modal State
  const [activeVoucher, setActiveVoucher] = useState(null);
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes live timer
  const [isCopied, setIsCopied] = useState(false);

  // Countdown timer when redemption modal is open
  useEffect(() => {
    if (!activeVoucher) return;
    setTimeLeft(300);
    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [activeVoucher]);

  const formatTimer = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleShakeMystery = () => {
    if (mysteryRevealed) return;
    sounds.playStampSquish();
    setIsMysteryShaking(true);
    setTimeout(() => {
      setIsMysteryShaking(false);
      setMysteryRevealed(true);
      sounds.playRewardFanfare();
      setMysteryPerk({
        title: 'Priority Checkout Pass',
        desc: 'Enjoy expedited counter service on your next visit today.',
        code: `VAL-MYST-${Math.floor(1000 + Math.random() * 9000)}`
      });
    }, 800);
  };

  const handleOpenVoucher = (perk) => {
    sounds.playClick();
    setActiveVoucher(perk);
  };

  const handleCopyCode = (code) => {
    sounds.playClick();
    navigator.clipboard?.writeText(code);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  // Define the tiered rewards pool
  const tieredRewards = [
    {
      id: 'perk-tier-1',
      threshold: 2,
      title: '15% Off Store Privilege',
      subtitle: 'Slot #2 Tier Privilege',
      desc: 'Instant 15% discount on any single purchase or service order.',
      type: 'discount',
      badge: '15% OFF',
      code: 'VAL-PRIV-15'
    },
    {
      id: 'perk-tier-2',
      threshold: 4,
      title: 'Complimentary Member Treat',
      subtitle: 'Slot #4 Mid-Journey Reward',
      desc: 'Enjoy an on-the-house signature member treat item of your choice.',
      type: 'item',
      badge: 'FREE ITEM',
      code: 'VAL-TREAT-FREE'
    },
    {
      id: 'perk-tier-3',
      threshold: totalSlots,
      title: currentGift?.title || '50% OFF Entire Order',
      subtitle: `Slot #${totalSlots} VIP Milestone Grand Reward`,
      desc: currentGift?.desc || 'Applies 50% discount automatically to your entire bill upon milestone completion.',
      type: 'milestone',
      badge: currentGift?.badge || '50% OFF',
      code: 'VAL-GRAND-VIP',
      isGrand: true
    }
  ];

  return (
    <section className="space-y-6">
      
      {/* SECTION TITLE */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 pb-1">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono tracking-widest text-[#3B82F6] uppercase font-bold">
              PRIVILEGES & PERKS
            </span>
            <span className="px-2 py-0.5 rounded-full bg-[#1A1C24] text-[#8E91A0] border border-[#2B2E3D] font-mono text-[9px] font-bold">
              DIGITAL VAULT
            </span>
          </div>
          <h3 className="font-clash font-bold text-xl sm:text-2xl text-[#F4F4F6] mt-0.5">
            Member Rewards Vault
          </h3>
        </div>
        <p className="text-xs text-[#8E91A0] font-mono">
          Unlocked perks can be presented to cashier for immediate redemption
        </p>
      </div>

      {/* 1. DAILY MYSTERY PERK (Interactive Discovery Parcel) */}
      <div className="p-6 rounded-3xl bg-gradient-to-br from-[#161823] via-[#12131A] to-[#0D0E13] border border-[#242738] relative overflow-hidden shadow-xl">
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#F59E0B]/5 rounded-full blur-[80px] pointer-events-none" />
        
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6 relative z-10">
          <div className="flex items-center gap-5 text-center sm:text-left flex-col sm:flex-row">
            <motion.div
              animate={isMysteryShaking ? {
                rotate: [-8, 8, -6, 6, -3, 3, 0],
                scale: [1, 1.1, 0.95, 1.05, 1],
                transition: { duration: 0.6, repeat: Infinity }
              } : {}}
              onClick={handleShakeMystery}
              className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#2563EB]/20 to-[#F59E0B]/20 border border-[#3B82F6]/40 flex items-center justify-center cursor-pointer shadow-lg hover:scale-105 transition-transform shrink-0"
            >
              {mysteryRevealed ? (
                <Sparkles className="w-8 h-8 text-[#F59E0B]" />
              ) : (
                <Gift className="w-8 h-8 text-[#3B82F6]" />
              )}
            </motion.div>

            <div className="space-y-1">
              <div className="flex items-center gap-2 justify-center sm:justify-start">
                <span className="text-[10px] font-mono uppercase font-bold text-[#F59E0B] tracking-wider">
                  DAILY MYSTERY PRIVILEGE
                </span>
                <span className="px-2 py-0.2 rounded bg-[#F59E0B]/10 text-[#F59E0B] font-mono text-[9px]">
                  RESETS DAILY
                </span>
              </div>
              <h4 className="font-clash font-bold text-lg text-[#F4F4F6]">
                {mysteryRevealed ? mysteryPerk?.title : 'Tap to Reveal Today’s Secret Perk'}
              </h4>
              <p className="text-xs text-[#8E91A0] max-w-md">
                {mysteryRevealed
                  ? mysteryPerk?.desc
                  : 'Every day you check in, you can unlock a surprise micro-benefit or priority access token.'}
              </p>
            </div>
          </div>

          <div className="shrink-0">
            {mysteryRevealed ? (
              <div className="px-4 py-2 rounded-xl bg-[#10B981]/15 border border-[#10B981]/30 text-[#10B981] font-mono text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" />
                <span>UNLOCKED: {mysteryPerk?.code}</span>
              </div>
            ) : (
              <button
                type="button"
                onClick={handleShakeMystery}
                className="px-5 py-2.5 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-sans font-semibold text-xs tracking-wide shadow-md shadow-[#2563EB]/25 cursor-pointer transition-all flex items-center gap-2"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Shake to Reveal</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 2. PERFORATED REWARD TICKETS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {tieredRewards.map((perk) => {
          const isUnlocked = currentStamps >= perk.threshold;
          const stampsNeeded = Math.max(0, perk.threshold - currentStamps);

          return (
            <div
              key={perk.id}
              className={`relative rounded-3xl p-5 border flex flex-col justify-between transition-all overflow-hidden ${
                perk.isGrand
                  ? isUnlocked
                    ? 'bg-gradient-to-br from-[#1C1710] to-[#121318] border-[#F59E0B]/50 shadow-xl ring-1 ring-[#F59E0B]/30'
                    : 'bg-[#121318] border-[#222533]'
                  : isUnlocked
                  ? 'bg-gradient-to-br from-[#121624] to-[#121318] border-[#2563EB]/50 shadow-lg'
                  : 'bg-[#0E0F14] border-[#1D1F2B] opacity-75'
              }`}
            >
              {/* Perforation notches on left and right edges */}
              <div className="absolute -left-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-[#090A0C] border border-[#222533] pointer-events-none" />
              <div className="absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-[#090A0C] border border-[#222533] pointer-events-none" />

              <div>
                {/* Header Row */}
                <div className="flex items-center justify-between gap-2 pb-3 border-b border-[#222533]">
                  <div className="flex items-center gap-1.5">
                    <span className={`text-[10px] font-mono font-bold uppercase tracking-wider ${
                      perk.isGrand ? 'text-[#F59E0B]' : isUnlocked ? 'text-[#3B82F6]' : 'text-[#8E91A0]'
                    }`}>
                      {perk.badge}
                    </span>
                    {perk.isGrand && (
                      <span className="px-1.5 py-0.5 rounded bg-[#F59E0B]/20 text-[#F59E0B] text-[8px] font-mono font-bold">
                        GRAND
                      </span>
                    )}
                  </div>

                  <span className="text-[10px] font-mono text-[#8E91A0]">
                    Slot #{perk.threshold}
                  </span>
                </div>

                {/* Content */}
                <div className="pt-4 space-y-1.5">
                  <h4 className="font-clash font-bold text-lg text-[#F4F4F6] tracking-tight">
                    {perk.title}
                  </h4>
                  <p className="text-xs text-[#8E91A0] font-sans line-clamp-2">
                    {perk.desc}
                  </p>
                </div>
              </div>

              {/* Action Bottom Row */}
              <div className="pt-6 mt-4 border-t border-dashed border-[#222533] flex items-center justify-between">
                {isUnlocked ? (
                  <>
                    <span className="text-[10px] font-mono text-[#10B981] font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>READY TO USE</span>
                    </span>
                    <button
                      type="button"
                      onClick={() => handleOpenVoucher(perk)}
                      className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold cursor-pointer transition-all flex items-center gap-1.5 ${
                        perk.isGrand
                          ? 'bg-[#F59E0B] hover:bg-[#D97706] text-black font-bold'
                          : 'bg-[#2563EB] hover:bg-[#1D4ED8] text-white'
                      }`}
                    >
                      <span>Redeem</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </>
                ) : (
                  <>
                    <span className="text-[10px] font-mono text-[#545768] flex items-center gap-1">
                      <Lock className="w-3 h-3" />
                      <span>{stampsNeeded} more stamps</span>
                    </span>
                    <span className="text-[10px] font-mono text-[#8E91A0] uppercase">
                      LOCKED
                    </span>
                  </>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* 3. 5-MINUTE LIVE REDEMPTION MODAL */}
      <AnimatePresence>
        {activeVoucher && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative w-full max-w-md rounded-3xl bg-[#121318] border border-[#2B2E3D] shadow-2xl p-6 sm:p-8 space-y-6 overflow-hidden"
            >
              {/* Close Button */}
              <button
                type="button"
                onClick={() => {
                  sounds.playClick();
                  setActiveVoucher(null);
                }}
                className="absolute top-5 right-5 w-8 h-8 rounded-full bg-[#1F222E] border border-[#2B2E3D] flex items-center justify-center text-[#8E91A0] hover:text-[#F4F4F6] cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>

              {/* Modal Header */}
              <div className="text-center space-y-1">
                <span className="text-[10px] font-mono tracking-widest text-[#3B82F6] uppercase font-bold">
                  VERIFIED DIGITAL VOUCHER
                </span>
                <h3 className="font-clash font-bold text-2xl text-[#F4F4F6]">
                  {activeVoucher.title}
                </h3>
                <p className="text-xs text-[#8E91A0]">
                  Present this dynamic pass to the cashier to apply privilege to your bill.
                </p>
              </div>

              {/* Live 5-Minute Countdown Indicator */}
              <div className="p-4 rounded-2xl bg-[#191B24] border border-[#2B2E3D] text-center space-y-1">
                <div className="flex items-center justify-center gap-2 text-xs font-mono text-[#F59E0B]">
                  <Clock className="w-4 h-4 animate-spin-slow" />
                  <span>VOUCHER ACTIVE WINDOW</span>
                </div>
                <div className="font-mono text-3xl font-bold text-[#F4F4F6] tracking-wider">
                  {formatTimer(timeLeft)}
                </div>
                <p className="text-[10px] font-mono text-[#8E91A0]">
                  Pass refreshes automatically to prevent unauthorized replication
                </p>
              </div>

              {/* Barcode & Code Display */}
              <div className="p-5 rounded-2xl bg-[#0B0C0F] border border-[#222533] text-center space-y-3">
                {/* Simulated High-Res 1D Barcode */}
                <div className="h-14 flex items-center justify-center gap-[3px] px-4 overflow-hidden">
                  {[2, 4, 1, 3, 2, 5, 1, 2, 4, 3, 1, 4, 2, 3, 5, 2, 1, 3, 4, 1, 2, 5, 3, 2, 4, 1, 3, 2, 4].map((h, idx) => (
                    <div
                      key={idx}
                      className="bg-white/80 rounded-sm"
                      style={{
                        width: `${h}px`,
                        height: '100%',
                        opacity: idx % 3 === 0 ? 0.95 : 0.75
                      }}
                    />
                  ))}
                </div>

                <div className="flex items-center justify-center gap-2">
                  <span className="font-mono text-sm font-bold text-[#F4F4F6] tracking-wider">
                    {activeVoucher.code}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleCopyCode(activeVoucher.code)}
                    className="p-1.5 rounded-lg bg-[#1F222E] text-[#8E91A0] hover:text-[#F4F4F6] cursor-pointer"
                  >
                    {isCopied ? <Check className="w-3.5 h-3.5 text-[#10B981]" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              {/* Action Button */}
              <button
                type="button"
                onClick={() => {
                  sounds.playOrderPlaced();
                  setActiveVoucher(null);
                }}
                className="w-full py-3 rounded-2xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-sans font-semibold text-sm cursor-pointer shadow-lg shadow-[#2563EB]/30 transition-all flex items-center justify-center gap-2"
              >
                <Check className="w-4 h-4 stroke-[2.5]" />
                <span>Done / Mark as Presented</span>
              </button>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </section>
  );
}
