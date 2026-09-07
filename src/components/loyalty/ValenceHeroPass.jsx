import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  QrCode, 
  Flame, 
  Copy, 
  Check, 
  ShieldCheck,
  Star
} from 'lucide-react';
import { sounds } from '../../utils/audio';
import { CircularStampBadge } from './CircularStampBadge';

export function ValenceHeroPass({ customer, tier, totalSlots = 6, onShowQrModal }) {
  const [isCopied, setIsCopied] = useState(false);

  const handleCopyId = (e) => {
    e.stopPropagation();
    sounds.playClick();
    navigator.clipboard?.writeText(customer?.phone || customer?.id || '9876543210');
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const xpPercent = Math.min(100, ((customer?.xp || 420) / 650) * 100);

  return (
    <div className="relative select-none">
      <motion.div
        onClick={() => {
          sounds.playStampSquish();
          if (onShowQrModal) onShowQrModal();
        }}
        whileHover={{ y: -3 }}
        whileTap={{ scale: 0.985 }}
        className="relative w-full rounded-3xl p-6 sm:p-8 bg-[#7A1F1F] text-[#F2ECD8] border-3 border-[#5C1414] shadow-[8px_8px_0px_#470D0D] cursor-pointer group overflow-hidden transition-all"
      >
        {/* Flat Dotted Inner Inset Border */}
        <div className="absolute inset-3 rounded-2xl border-2 border-dashed border-[#F2ECD8]/25 pointer-events-none" />

        {/* Content Container */}
        <div className="relative z-10 flex flex-col justify-between min-h-[230px] sm:min-h-[250px] space-y-6">
          
          {/* Top Row: Title + Circular Stamp Badge */}
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-mono tracking-[0.22em] text-[#F2ECD8]/80 uppercase font-bold">
                  OFFICIAL MEMBERSHIP PASS
                </span>
                <span className="px-2 py-0.5 rounded-full bg-[#E5A93C] text-[#7A1F1F] font-groovy text-xs font-bold uppercase tracking-wider">
                  {tier?.badge || 'GOLD MEMBER'}
                </span>
              </div>
              
              {/* Member Name at Poster Scale */}
              <h2 className="font-groovy font-black text-3xl sm:text-5xl text-[#F2ECD8] tracking-wide leading-none pt-1">
                {customer?.name || 'Valued Member'}
              </h2>
            </div>

            {/* Circular Stamp Badge Motif with Curved Text */}
            <div className="shrink-0 group-hover:rotate-12 transition-transform duration-300">
              <CircularStampBadge
                text="• VALENCE LOYALTY CLUB • VERIFIED •"
                centerText="GOLD"
                subText="TIER 3"
                size={84}
                variant="mustard"
              />
            </div>
          </div>

          {/* Middle Row: Receipt-Style Details (Space Mono) */}
          <div className="flex flex-wrap items-center justify-between gap-3 py-3 border-y-2 border-[#5C1414]">
            <button
              type="button"
              onClick={handleCopyId}
              className="flex items-center gap-2 text-xs font-mono text-[#F2ECD8]/90 hover:text-white cursor-pointer transition-colors"
              title="Click to copy member ID"
            >
              <span className="font-bold">ID: VAL-{customer?.phone || '9876543210'}</span>
              {isCopied ? (
                <Check className="w-3.5 h-3.5 text-[#E5A93C]" />
              ) : (
                <Copy className="w-3.5 h-3.5 opacity-70 group-hover:opacity-100" />
              )}
            </button>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5 text-xs font-groovy text-[#E5A93C] bg-[#5C1414] px-2.5 py-1 rounded-xl">
                <span>{customer?.streakDays || 1}d Streak</span>
                <Flame className="w-3.5 h-3.5 fill-[#E5A93C] text-[#E5A93C]" />
              </div>

              <div className="flex items-center gap-1 text-[11px] font-mono text-[#F2ECD8]/80">
                <QrCode className="w-3.5 h-3.5 text-[#E5A93C]" />
                <span className="underline uppercase tracking-wider font-bold">Show QR</span>
              </div>
            </div>
          </div>

          {/* Bottom Row: XP Track with Bold Poster Numbers */}
          <div className="space-y-2 pt-1">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-xs font-bold text-[#F2ECD8]">
                <ShieldCheck className="w-4 h-4 text-[#E5A93C]" />
                <span>Tier Progression: {tier?.name || 'Gold Member'}</span>
              </div>
              <span className="font-groovy text-sm sm:text-base text-[#E5A93C] tracking-wide">
                {customer?.xp || 420} / 650 XP
              </span>
            </div>

            {/* Flat Color Blocked Progress Bar */}
            <div className="h-3.5 w-full rounded-full bg-[#5C1414] border-2 border-[#470D0D] overflow-hidden p-0.5">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${xpPercent}%` }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
                className="h-full rounded-full bg-[#E5A93C]"
              />
            </div>
          </div>

        </div>
      </motion.div>
    </div>
  );
}
