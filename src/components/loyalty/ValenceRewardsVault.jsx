import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles,
  Gift,
  Percent,
  Clock,
  CheckCircle2,
  Lock,
  Copy,
  Check,
  X,
  ArrowRight,
  ShieldCheck,
  Star
} from 'lucide-react';
import { sounds } from '../../utils/audio';
import { CircularStampBadge } from './CircularStampBadge';

export function ValenceRewardsVault({ customer, totalSlots = 6, currentGift }) {
  const currentStamps = customer?.stamps || 0;
  
  // Daily Mystery Box State
  const [isMysteryShaking, setIsMysteryShaking] = useState(false);
  const [mysteryRevealed, setMysteryRevealed] = useState(false);
  const [mysteryPerk, setMysteryPerk] = useState(null);

  // Active Redemption Voucher Modal State
  const [activeVoucher, setActiveVoucher] = useState(null);
  const [timeLeft, setTimeLeft] = useState(300);
  const [isCopied, setIsCopied] = useState(false);

  useEffect(() => {
    if (!activeVoucher) return;
    setTimeLeft(300);
    const interval = setInterval(() => {
      setTimeLeft((prev) => (prev <= 1 ? 0 : prev - 1));
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

  const tieredRewards = [
    {
      id: 'perk-tier-1',
      threshold: 2,
      title: '15% Off Store Privilege',
      subtitle: 'Slot #2 Tier Privilege',
      desc: 'Instant 15% discount applied directly to your store bill.',
      type: 'discount',
      badge: '15% OFF',
      code: 'VAL-PRIV-15'
    },
    {
      id: 'perk-tier-2',
      threshold: 4,
      title: 'Complimentary Member Treat',
      subtitle: 'Slot #4 Mid-Journey Reward',
      desc: 'Enjoy a complimentary signature member treat on the house.',
      type: 'item',
      badge: 'FREE ITEM',
      code: 'VAL-TREAT-FREE'
    },
    {
      id: 'perk-tier-3',
      threshold: totalSlots,
      title: currentGift?.title || '50% OFF Entire Order',
      subtitle: `Slot #${totalSlots} VIP Milestone Grand Reward`,
      desc: currentGift?.desc || 'Applies 50% discount automatically upon completing your stamp card.',
      type: 'milestone',
      badge: currentGift?.badge || '50% OFF',
      code: 'VAL-GRAND-VIP',
      isGrand: true
    }
  ];

  return (
    <section className="space-y-6">
      
      {/* SECTION HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 pb-1">
        <div>
          <span className="text-xs font-mono font-bold tracking-widest text-[#7A1F1F] uppercase">
            PRIVILEGES & PERKS
          </span>
          <h3 className="font-groovy font-black text-3xl sm:text-4xl text-[#7A1F1F] tracking-wide mt-0.5 leading-none">
            Member Rewards Vault
          </h3>
        </div>
        <p className="text-xs text-[#7A1F1F] font-mono font-bold">
          Present unlocked vouchers to cashier at checkout
        </p>
      </div>

      {/* 1. DAILY MYSTERY TREAT (Retro Oxblood Poster Block) */}
      <div className="p-6 sm:p-7 rounded-3xl bg-[#7A1F1F] text-[#F2ECD8] border-3 border-[#5C1414] shadow-[8px_8px_0px_#5C1414] relative overflow-hidden">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6 relative z-10">
          <div className="flex items-center gap-5 text-center sm:text-left flex-col sm:flex-row">
            <motion.div
              animate={isMysteryShaking ? {
                rotate: [-10, 10, -8, 8, -4, 4, 0],
                scale: [1, 1.15, 0.95, 1.08, 1],
                transition: { duration: 0.6, repeat: Infinity }
              } : {}}
              onClick={handleShakeMystery}
              className="w-18 h-18 rounded-2xl bg-[#E5A93C] text-[#7A1F1F] border-3 border-[#7A1F1F] flex items-center justify-center cursor-pointer shadow-[4px_4px_0px_#470D0D] hover:scale-105 transition-transform shrink-0"
            >
              {mysteryRevealed ? (
                <Sparkles className="w-9 h-9 stroke-[2.5]" />
              ) : (
                <Gift className="w-9 h-9 stroke-[2.5]" />
              )}
            </motion.div>

            <div className="space-y-1">
              <div className="flex items-center gap-2 justify-center sm:justify-start">
                <span className="text-[10px] font-mono uppercase font-bold text-[#E5A93C] tracking-wider bg-[#5C1414] px-2 py-0.5 rounded-full">
                  DAILY MYSTERY PRIVILEGE
                </span>
                <span className="text-[10px] font-mono text-[#F2ECD8]/80 font-bold">
                  RESETS DAILY
                </span>
              </div>
              
              {/* Lilita One Poster Headline */}
              <h4 className="font-groovy font-black text-2xl sm:text-3xl text-[#F2ECD8] tracking-wide">
                {mysteryRevealed ? mysteryPerk?.title : 'Tap to Shake Today’s Mystery Treat'}
              </h4>
              <p className="text-xs text-[#F2ECD8]/90 max-w-md font-sans">
                {mysteryRevealed
                  ? mysteryPerk?.desc
                  : 'Check in daily to shake the gift box and unlock secret member perks and priority passes.'}
              </p>
            </div>
          </div>

          <div className="shrink-0">
            {mysteryRevealed ? (
              <div className="px-5 py-2.5 rounded-2xl bg-[#E5A93C] text-[#7A1F1F] font-mono text-xs font-black flex items-center gap-2 border-2 border-[#7A1F1F] shadow-[3px_3px_0px_#470D0D]">
                <CheckCircle2 className="w-4 h-4 stroke-[3]" />
                <span>CODE: {mysteryPerk?.code}</span>
              </div>
            ) : (
              <button
                type="button"
                onClick={handleShakeMystery}
                className="px-6 py-3 rounded-2xl bg-[#E5A93C] hover:bg-[#C98D25] text-[#7A1F1F] font-groovy font-black text-sm tracking-wider shadow-[4px_4px_0px_#470D0D] cursor-pointer transition-all flex items-center gap-2 uppercase"
              >
                <Sparkles className="w-4 h-4 stroke-[3]" />
                <span>Shake to Reveal</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 2. PERFORATED REWARD TICKETS (Warm Cream with Solid Oxblood Borders) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {tieredRewards.map((perk) => {
          const isUnlocked = currentStamps >= perk.threshold;
          const stampsNeeded = Math.max(0, perk.threshold - currentStamps);

          return (
            <div
              key={perk.id}
              className={`relative rounded-3xl p-6 border-3 flex flex-col justify-between transition-all overflow-hidden ${
                perk.isGrand
                  ? isUnlocked
                    ? 'bg-[#FAF6EA] border-[#7A1F1F] shadow-[6px_6px_0px_#7A1F1F] ring-3 ring-[#E5A93C]'
                    : 'bg-[#FAF6EA] border-[#7A1F1F] shadow-[5px_5px_0px_#7A1F1F]'
                  : isUnlocked
                  ? 'bg-[#FAF6EA] border-[#7A1F1F] shadow-[5px_5px_0px_#7A1F1F]'
                  : 'bg-[#F2ECD8] border-[#D8CEB0] opacity-80'
              }`}
            >
              {/* Semicircular Perforation Notches on edges */}
              <div className="absolute -left-3.5 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-[#F2ECD8] border-3 border-[#7A1F1F] pointer-events-none" />
              <div className="absolute -right-3.5 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-[#F2ECD8] border-3 border-[#7A1F1F] pointer-events-none" />

              <div className="space-y-3">
                {/* Header Row */}
                <div className="flex items-center justify-between gap-2 pb-2.5 border-b-2 border-dashed border-[#7A1F1F]/30">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-groovy font-black text-[#7A1F1F] uppercase tracking-wider">
                      {perk.badge}
                    </span>
                    {perk.isGrand && (
                      <span className="px-2 py-0.5 rounded-full bg-[#E5A93C] text-[#7A1F1F] text-[9px] font-groovy font-bold uppercase">
                        VIP GRAND
                      </span>
                    )}
                  </div>

                  <span className="text-xs font-mono font-bold text-[#7A1F1F]">
                    Slot #{perk.threshold}
                  </span>
                </div>

                {/* Content */}
                <div className="space-y-1">
                  <h4 className="font-groovy font-black text-xl text-[#7A1F1F] tracking-wide leading-tight">
                    {perk.title}
                  </h4>
                  <p className="text-xs text-[#7A1F1F]/80 font-sans line-clamp-2">
                    {perk.desc}
                  </p>
                </div>
              </div>

              {/* Action Bottom Row */}
              <div className="pt-5 mt-4 border-t-2 border-dashed border-[#7A1F1F]/30 flex items-center justify-between">
                {isUnlocked ? (
                  <>
                    <span className="text-xs font-groovy text-[#7A1F1F] font-bold flex items-center gap-1 uppercase">
                      <CheckCircle2 className="w-4 h-4 text-[#7A1F1F] stroke-[3]" />
                      <span>UNLOCKED</span>
                    </span>

                    <button
                      type="button"
                      onClick={() => handleOpenVoucher(perk)}
                      className="px-4 py-2 rounded-xl bg-[#E5A93C] hover:bg-[#C98D25] text-[#7A1F1F] font-groovy font-black text-xs cursor-pointer transition-all flex items-center gap-1.5 shadow-[3px_3px_0px_#7A1F1F] uppercase"
                    >
                      <span>Redeem</span>
                      <ArrowRight className="w-3.5 h-3.5 stroke-[3]" />
                    </button>
                  </>
                ) : (
                  <>
                    <span className="text-xs font-mono text-[#8F8876] flex items-center gap-1 font-bold">
                      <Lock className="w-3.5 h-3.5" />
                      <span>{stampsNeeded} more stamps</span>
                    </span>
                    <span className="text-[10px] font-mono text-[#8F8876] uppercase font-bold">
                      LOCKED
                    </span>
                  </>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* 3. 5-MINUTE LIVE REDEMPTION MODAL (Flat Retro Poster Modal) */}
      <AnimatePresence>
        {activeVoucher && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative w-full max-w-md rounded-3xl bg-[#FAF6EA] border-3 border-[#7A1F1F] shadow-[12px_12px_0px_#7A1F1F] p-6 sm:p-8 space-y-6 overflow-hidden"
            >
              {/* Close Button */}
              <button
                type="button"
                onClick={() => {
                  sounds.playClick();
                  setActiveVoucher(null);
                }}
                className="absolute top-5 right-5 w-9 h-9 rounded-full bg-[#7A1F1F] text-[#F2ECD8] flex items-center justify-center hover:bg-[#5C1414] cursor-pointer"
              >
                <X className="w-4 h-4 stroke-[3]" />
              </button>

              {/* Modal Header */}
              <div className="text-center space-y-1">
                <span className="text-xs font-mono tracking-widest text-[#7A1F1F] uppercase font-bold">
                  VERIFIED DIGITAL CERTIFICATE
                </span>
                <h3 className="font-groovy font-black text-2xl sm:text-3xl text-[#7A1F1F] leading-tight">
                  {activeVoucher.title}
                </h3>
                <p className="text-xs text-[#7A1F1F]/80 font-sans">
                  Present this active coupon voucher to the cashier at checkout.
                </p>
              </div>

              {/* Live Countdown Timer in Lilita One */}
              <div className="p-5 rounded-2xl bg-[#7A1F1F] text-[#F2ECD8] border-2 border-[#5C1414] text-center space-y-1">
                <div className="flex items-center justify-center gap-2 text-xs font-mono text-[#E5A93C] font-bold">
                  <Clock className="w-4 h-4" />
                  <span>VOUCHER ACTIVE WINDOW</span>
                </div>
                <div className="font-groovy text-4xl sm:text-5xl text-[#E5A93C] tracking-wider leading-none py-1">
                  {formatTimer(timeLeft)}
                </div>
                <p className="text-[10px] font-mono text-[#F2ECD8]/80">
                  Refreshes automatically to prevent duplication
                </p>
              </div>

              {/* Receipt Code Display */}
              <div className="p-4 rounded-2xl bg-[#F2ECD8] border-2 border-[#7A1F1F] text-center space-y-2">
                <span className="text-[10px] font-mono text-[#7A1F1F] uppercase font-bold block">
                  CASHIER REDEMPTION CODE:
                </span>
                <div className="flex items-center justify-center gap-2">
                  <span className="font-mono text-base font-black text-[#7A1F1F] tracking-widest">
                    {activeVoucher.code}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleCopyCode(activeVoucher.code)}
                    className="p-1.5 rounded-lg bg-[#7A1F1F] text-[#E5A93C] hover:bg-[#5C1414] cursor-pointer"
                  >
                    {isCopied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
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
                className="w-full py-3.5 rounded-2xl bg-[#7A1F1F] hover:bg-[#5C1414] text-[#F2ECD8] font-groovy font-black text-sm tracking-wider cursor-pointer shadow-[4px_4px_0px_#470D0D] transition-all flex items-center justify-center gap-2 uppercase"
              >
                <Check className="w-4 h-4 stroke-[3]" />
                <span>Mark as Presented / Done</span>
              </button>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </section>
  );
}
