import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Crown,
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
  Tag,
  Barcode
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
        title: 'Priority Counter Pass',
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
    <section className="relative space-y-6 pt-4">
      
      {/* SECTION HEADER */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b-3 border-[#1F1614] pb-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded bg-[#1F1614] text-[#E5A93C] font-mono text-[9px] font-black uppercase tracking-widest">
              SECTION 03 // VAULT
            </span>
            <span className="font-mono text-xs font-bold text-[#7A1F1F]/70 uppercase tracking-wider">
              ARCHIVAL PERKS &amp; TOKENS
            </span>
          </div>

          <h3 className="font-groovy font-black text-4xl sm:text-6xl text-[#7A1F1F] tracking-tight leading-[0.9]">
            PERKS &amp; VOUCHERS
          </h3>
        </div>

        <p className="text-xs text-[#7A1F1F] font-mono font-bold max-w-xs text-right hidden md:block">
          Redeem unlocked tickets directly at register checkout.
        </p>
      </div>

      {/* 1. DAILY MYSTERY TREAT ENVELOPE (Tactile Secret Dossier) */}
      <div className="relative overflow-hidden rounded-3xl bg-[#7A1F1F] text-[#F2ECD8] border-3 border-[#1F1614] shadow-[8px_8px_0px_#1F1614] p-6 sm:p-8">
        {/* Subtle Background Print Pattern */}
        <div className="absolute inset-0 bg-halftone-dots opacity-15 pointer-events-none" />

        <div className="flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
          
          <div className="flex items-center gap-5 text-center md:text-left flex-col md:flex-row">
            {/* Shakeable Mystery Seal */}
            <motion.div
              animate={isMysteryShaking ? {
                rotate: [-12, 12, -8, 8, -4, 4, 0],
                scale: [1, 1.15, 0.95, 1.1, 1],
                transition: { duration: 0.6, repeat: Infinity }
              } : {}}
              whileHover={{ scale: 1.05, rotate: 2 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleShakeMystery}
              className="w-20 h-20 rounded-2xl bg-[#E5A93C] text-[#1F1614] border-3 border-[#1F1614] shadow-[4px_4px_0px_#1F1614] flex flex-col items-center justify-center cursor-pointer transition-all shrink-0"
            >
              {mysteryRevealed ? (
                <Crown className="w-9 h-9 stroke-[2.5]" />
              ) : (
                <>
                  <Gift className="w-8 h-8 stroke-[2.5]" />
                  <span className="font-mono text-[7px] font-black uppercase tracking-tight leading-none mt-0.5">
                    UNSEAL
                  </span>
                </>
              )}
            </motion.div>

            <div className="space-y-1">
              <div className="flex items-center gap-2 justify-center md:justify-start">
                <span className="px-2 py-0.5 rounded bg-[#1F1614] text-[#E5A93C] font-mono text-[9px] font-black uppercase tracking-wider">
                  DAILY SECRET TREAT
                </span>
                <span className="font-mono text-xs text-[#F2ECD8]/70">
                  RESETS EVERY 24H
                </span>
              </div>

              <h4 className="font-groovy font-black text-2xl sm:text-3xl text-[#F2ECD8]">
                {mysteryRevealed ? mysteryPerk?.title : 'Confidential Mystery Perk'}
              </h4>

              <p className="font-mono text-xs text-[#F2ECD8]/80 max-w-md">
                {mysteryRevealed
                  ? mysteryPerk?.desc
                  : 'Tap to break the seal and uncover your complimentary member perk for today.'}
              </p>
            </div>
          </div>

          {/* Action / Token Code */}
          <div className="shrink-0 self-center md:self-auto">
            {mysteryRevealed ? (
              <div className="flex items-center gap-3 bg-[#5C1414] p-3 rounded-2xl border-2 border-[#1F1614]">
                <div className="text-left font-mono">
                  <span className="text-[9px] text-[#E5A93C] uppercase block font-bold">TOKEN VOUCHER</span>
                  <span className="font-bold text-sm text-[#F2ECD8]">{mysteryPerk?.code}</span>
                </div>
                <button
                  type="button"
                  onClick={() => handleCopyCode(mysteryPerk?.code)}
                  className="p-2 rounded-xl bg-[#E5A93C] hover:bg-[#F8CF75] text-[#1F1614] font-bold cursor-pointer transition-colors shadow-xs"
                  title="Copy token code"
                >
                  {isCopied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={handleShakeMystery}
                className="px-6 py-3 rounded-2xl bg-[#E5A93C] hover:bg-[#F8CF75] text-[#1F1614] font-groovy font-black text-xs uppercase tracking-wider border-2 border-[#1F1614] shadow-[3px_3px_0px_#1F1614] cursor-pointer transition-all"
              >
                BREAK SEAL TO REVEAL
              </button>
            )}
          </div>

        </div>
      </div>

      {/* =================================================================== */}
      {/* TIERED PERK TICKETS (Physical Perforated Coupon Stubs)              */}
      {/* =================================================================== */}
      <div className="space-y-4">
        {tieredRewards.map((perk, index) => {
          const isUnlocked = currentStamps >= perk.threshold;
          const isGrand = perk.isGrand;

          return (
            <div
              key={perk.id || index}
              className={`relative rounded-3xl border-3 border-[#1F1614] shadow-[6px_6px_0px_#1F1614] overflow-hidden transition-all ${
                isGrand
                  ? 'bg-[#7A1F1F] text-[#F2ECD8]'
                  : 'bg-[#FAF6EA] text-[#1F1614]'
              }`}
            >
              {/* Semi-Circular Ticket Notch on Left & Right Perforation */}
              <div className={`hidden sm:block absolute left-1/3 top-0 -translate-y-1/2 w-5 h-5 rounded-full border-b-3 border-[#1F1614] z-20 ${
                isGrand ? 'bg-[#F2ECD8]' : 'bg-[#F2ECD8]'
              }`} />
              <div className={`hidden sm:block absolute left-1/3 bottom-0 translate-y-1/2 w-5 h-5 rounded-full border-t-3 border-[#1F1614] z-20 ${
                isGrand ? 'bg-[#F2ECD8]' : 'bg-[#F2ECD8]'
              }`} />

              <div className="flex flex-col sm:flex-row items-stretch">
                
                {/* LEFT TICKET BODY (The Benefit & Criteria) */}
                <div className="sm:w-1/3 p-5 sm:p-6 flex flex-col justify-between border-b-2 sm:border-b-0 sm:border-r-2 border-dashed border-[#1F1614]/30 space-y-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-0.5 rounded font-mono text-[9px] font-black uppercase tracking-wider ${
                        isGrand ? 'bg-[#E5A93C] text-[#1F1614]' : 'bg-[#7A1F1F] text-[#F2ECD8]'
                      }`}>
                        {perk.badge}
                      </span>
                      <span className="font-mono text-[10px] font-bold opacity-75">
                        REQUIRES {perk.threshold} PUNCHES
                      </span>
                    </div>

                    <h4 className={`font-groovy font-black text-2xl sm:text-3xl leading-tight ${
                      isGrand ? 'text-[#F2ECD8]' : 'text-[#7A1F1F]'
                    }`}>
                      {perk.title}
                    </h4>
                  </div>

                  <div className="font-mono text-xs opacity-75">
                    {perk.subtitle}
                  </div>
                </div>

                {/* RIGHT TICKET STUB (Perforation Tear-Off & Claim Action) */}
                <div className="flex-1 p-5 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="space-y-1 max-w-md">
                    <p className={`font-mono text-xs font-bold leading-relaxed ${
                      isGrand ? 'text-[#F2ECD8]/90' : 'text-[#1F1614]/80'
                    }`}>
                      {perk.desc}
                    </p>
                    <div className="font-mono text-[10px] opacity-60">
                      IDENTIFIER // {perk.code}
                    </div>
                  </div>

                  <div className="shrink-0 self-end sm:self-center">
                    {isUnlocked ? (
                      <button
                        type="button"
                        onClick={() => handleOpenVoucher(perk)}
                        className="px-5 py-3 rounded-2xl bg-[#E5A93C] hover:bg-[#F8CF75] text-[#1F1614] font-groovy font-black text-xs uppercase tracking-wider border-2 border-[#1F1614] shadow-[3px_3px_0px_#1F1614] cursor-pointer transition-all flex items-center gap-2"
                      >
                        <CheckCircle2 className="w-4 h-4 stroke-[3]" />
                        <span>CLAIM VOUCHER</span>
                      </button>
                    ) : (
                      <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#1F1614]/10 border-2 border-[#1F1614]/20 font-mono text-xs font-bold text-[#1F1614]/60">
                        <Lock className="w-3.5 h-3.5" />
                        <span>LOCKED ({currentStamps}/{perk.threshold})</span>
                      </div>
                    )}
                  </div>
                </div>

              </div>
            </div>
          );
        })}
      </div>

      {/* =================================================================== */}
      {/* ACTIVE REDEMPTION VOUCHER MODAL (Authentic Countdown Ticket)       */}
      {/* =================================================================== */}
      <AnimatePresence>
        {activeVoucher && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative w-full max-w-md rounded-3xl bg-[#FAF6EA] text-[#1F1614] border-3 border-[#1F1614] shadow-[12px_12px_0px_#1F1614] p-6 sm:p-8 space-y-6 text-center"
            >
              <button
                type="button"
                onClick={() => setActiveVoucher(null)}
                className="absolute top-5 right-5 w-9 h-9 rounded-full bg-[#7A1F1F] text-[#F2ECD8] flex items-center justify-center hover:bg-[#5C1414] cursor-pointer border border-[#1F1614]"
              >
                <X className="w-4 h-4 stroke-[3]" />
              </button>

              <div className="space-y-1">
                <span className="text-[10px] font-mono tracking-widest text-[#7A1F1F] uppercase font-black">
                  OFFICIAL REDEMPTION PASS
                </span>
                <h3 className="font-groovy font-black text-3xl text-[#7A1F1F]">
                  {activeVoucher.title}
                </h3>
                <p className="text-xs font-mono text-[#1F1614]/70">
                  Present this live voucher to cashier during checkout
                </p>
              </div>

              {/* Countdown Timer */}
              <div className="p-4 rounded-2xl bg-[#E5A93C] text-[#1F1614] border-2 border-[#1F1614] shadow-[3px_3px_0px_#1F1614] flex items-center justify-center gap-2">
                <Clock className="w-5 h-5 stroke-[2.5]" />
                <span className="font-mono text-sm font-black">VALID FOR:</span>
                <span className="font-groovy text-2xl font-black">{formatTimer(timeLeft)}</span>
              </div>

              {/* Voucher Code Block */}
              <div className="p-4 rounded-2xl bg-white border-2 border-[#1F1614] space-y-2">
                <span className="text-[10px] font-mono text-[#1F1614]/60 uppercase block">
                  VOUCHER CODE
                </span>
                <div className="font-mono text-xl font-black text-[#7A1F1F] tracking-widest">
                  {activeVoucher.code}
                </div>
                <button
                  type="button"
                  onClick={() => handleCopyCode(activeVoucher.code)}
                  className="px-4 py-1.5 rounded-xl bg-[#FAF6EA] hover:bg-[#E2D8BE] border border-[#1F1614] text-xs font-mono font-bold cursor-pointer inline-flex items-center gap-1.5"
                >
                  {isCopied ? <Check className="w-3.5 h-3.5 text-[#7A1F1F]" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{isCopied ? 'Copied!' : 'Copy Code'}</span>
                </button>
              </div>

              <p className="text-[11px] font-mono text-[#1F1614]/60">
                Single-use credential. Discount or complimentary perk applies to the current transaction.
              </p>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </section>
  );
}
