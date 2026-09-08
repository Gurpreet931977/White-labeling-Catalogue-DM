import React from 'react';
import { motion } from 'framer-motion';
import { 
  Check, 
  Flame, 
  Gift, 
  ArrowRight,
  Crown,
  Zap
} from 'lucide-react';
import { sounds } from '../../utils/audio';
import { CircularStampBadge } from './CircularStampBadge';

export function ValenceStampJourney({ 
  customer, 
  totalSlots = 6, 
  currentGift, 
  hasStreakBonus = false,
  onSlotClick,
  onClaimMilestone
}) {
  const currentStamps = customer?.stamps || 0;
  const isMilestoneReached = currentStamps >= totalSlots;
  const stampsRemaining = Math.max(0, totalSlots - currentStamps);
  const progressPercent = Math.min(100, (currentStamps / totalSlots) * 100);

  // Organic rotation angles for realistic physical rubber stamp impressions
  const organicAngles = [-3.5, 2.8, -1.8, 3.2, -2.4, 1.9, -3.1, 2.2, -1.5, 3.0, -2.0, 1.5];

  return (
    <section className="relative space-y-6 pt-4">
      
      {/* SECTION EDITORIAL MASTHEAD */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b-3 border-[#1F1614] pb-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded bg-[#1F1614] text-[#E5A93C] font-mono text-[9px] font-black uppercase tracking-widest">
              SECTION 02 // MATRIX
            </span>
            <span className="font-mono text-xs font-bold text-[#7A1F1F]/70 uppercase tracking-wider">
              PHYSICAL INK PUNCH SYSTEM
            </span>
          </div>

          <h3 className="font-groovy font-black text-4xl sm:text-6xl text-[#7A1F1F] tracking-tight leading-[0.9]">
            PUNCH MATRIX
          </h3>
        </div>

        {/* Oversized Ratio Graphic Block */}
        <div className="flex items-center gap-3 bg-[#FAF6EA] border-3 border-[#1F1614] p-3 sm:p-4 rounded-2xl shadow-[4px_4px_0px_#1F1614] self-start md:self-auto">
          <div className="text-right font-mono">
            <span className="text-[10px] uppercase font-black text-[#7A1F1F]/70 block leading-none">
              PUNCH STATUS
            </span>
            <span className="text-xs font-bold text-[#7A1F1F]">
              {stampsRemaining === 0 ? 'GOAL COMPLETED' : `${stampsRemaining} PUNCHES LEFT`}
            </span>
          </div>

          <div className="h-10 w-[2px] bg-[#1F1614]/20" />

          <div className="font-groovy font-black text-3xl sm:text-4xl text-[#7A1F1F] leading-none">
            <span className="text-[#E5A93C]">{currentStamps}</span>
            <span className="text-[#1F1614]/40">/</span>
            <span>{totalSlots}</span>
          </div>
        </div>
      </div>

      {/* 5-DAY STREAK VELOCITY TAPE BANNER (Hazard / Editorial Tape Graphic) */}
      <div className={`relative overflow-hidden rounded-2xl border-3 border-[#1F1614] p-4 shadow-[4px_4px_0px_#1F1614] transition-all ${
        hasStreakBonus ? 'bg-[#E5A93C] text-[#1F1614]' : 'bg-[#FAF6EA] text-[#7A1F1F]'
      }`}>
        {/* Striped Caution Edge Accent */}
        <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-[#1F1614] via-[#7A1F1F] to-[#1F1614] opacity-80" />

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 relative z-10">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-groovy font-black text-lg border-2 border-[#1F1614] shrink-0 shadow-[2px_2px_0px_#1F1614] ${
              hasStreakBonus ? 'bg-[#7A1F1F] text-[#E5A93C]' : 'bg-[#E2D8BE] text-[#7A1F1F]'
            }`}>
              <Flame className="w-5 h-5 fill-current" />
            </div>

            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-groovy font-black text-base sm:text-lg tracking-wide uppercase">
                  5-Day Streak Velocity Multiplier
                </span>
                {hasStreakBonus && (
                  <span className="px-2 py-0.5 rounded-full bg-[#7A1F1F] text-[#F2ECD8] font-mono text-[10px] font-black uppercase tracking-wider">
                    2X ENGAGED
                  </span>
                )}
              </div>
              <p className="font-mono text-xs font-bold opacity-80">
                {hasStreakBonus 
                  ? 'Maintaining your 5-day streak grants 2 stamps at once on your next billing!'
                  : `Active streak: ${customer?.streakDays || 0} days. Reach 5 days to unlock 2x punch acceleration.`}
              </p>
            </div>
          </div>

          <div className="shrink-0 self-end sm:self-auto font-mono text-xs font-black uppercase px-3 py-1.5 rounded-xl bg-[#1F1614] text-[#E5A93C] border border-[#1F1614]">
            {hasStreakBonus ? '+2 STAMPS / NEXT BILL' : '1 STAMP / BILL'}
          </div>
        </div>
      </div>

      {/* =================================================================== */}
      {/* THE STAMP MATRIX GRID (Tactile Collectible Visa Stamps)             */}
      {/* =================================================================== */}
      <div className="p-6 sm:p-8 rounded-3xl bg-[#FAF6EA] border-3 border-[#1F1614] shadow-[8px_8px_0px_#1F1614] space-y-6 relative">
        
        {/* Progress Bar Line */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs font-mono font-bold text-[#7A1F1F]">
            <span className="tracking-wider uppercase">CARD PROGRESSION TRAIL</span>
            <span className="font-groovy text-sm">{Math.round(progressPercent)}% COMPLETE</span>
          </div>

          <div className="h-4 w-full rounded-full bg-[#E2D8BE] border-2 border-[#1F1614] overflow-hidden p-0.5">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progressPercent}%` }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
              className="h-full rounded-full bg-[#7A1F1F]"
            />
          </div>
        </div>

        {/* Dynamic Stamp Slots */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
          {Array.from({ length: totalSlots }, (_, i) => i + 1).map((slotIndex) => {
            const isStamped = currentStamps >= slotIndex;
            const isNextSlot = slotIndex === currentStamps + 1;
            const isMilestoneSlot = slotIndex === totalSlots;
            const angle = organicAngles[(slotIndex - 1) % organicAngles.length];

            // 1. COMPLETED STAMP (Physical Rubber Ink Mark)
            if (isStamped) {
              return (
                <motion.div
                  key={slotIndex}
                  whileHover={{ scale: 1.04, rotate: 0 }}
                  whileTap={{ scale: 0.96 }}
                  onClick={() => {
                    sounds.playStampSquish();
                    if (onSlotClick) onSlotClick(slotIndex);
                  }}
                  style={{ transform: `rotate(${angle}deg)` }}
                  className="relative p-3 aspect-square rounded-2xl bg-[#E5A93C] text-[#1F1614] border-3 border-[#1F1614] shadow-[3px_3px_0px_#1F1614] flex flex-col items-center justify-between text-center cursor-pointer select-none transition-all group overflow-hidden"
                >
                  {/* Subtle Stamp Postal Perforation */}
                  <span className="font-mono text-[10px] font-black self-start opacity-70">
                    #{slotIndex}
                  </span>

                  {/* Circular Rubber Stamp Impression */}
                  <div className="w-12 h-12 rounded-full border-2 border-dashed border-[#7A1F1F] bg-[#FAF6EA]/40 flex flex-col items-center justify-center p-1 ink-bleed">
                    <Check className="w-5 h-5 text-[#7A1F1F] stroke-[3.5]" />
                    <span className="font-mono text-[7px] font-black uppercase text-[#7A1F1F] tracking-tighter leading-none mt-0.5">
                      PUNCHED
                    </span>
                  </div>

                  <span className="font-mono text-[9px] font-black uppercase tracking-wider text-[#7A1F1F]">
                    VERIFIED
                  </span>
                </motion.div>
              );
            }

            // 2. ACTIVE NEXT TARGET SLOT (Pulsing Target Ring)
            if (isNextSlot) {
              return (
                <motion.div
                  key={slotIndex}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    sounds.playClick();
                    if (onSlotClick) onSlotClick(slotIndex);
                  }}
                  className="relative p-3 aspect-square rounded-2xl bg-[#FAF6EA] border-3 border-[#7A1F1F] shadow-[4px_4px_0px_#7A1F1F] flex flex-col items-center justify-between text-center cursor-pointer select-none ring-2 ring-[#7A1F1F]/40 transition-all"
                >
                  <span className="font-mono text-[10px] font-black self-start text-[#7A1F1F]">
                    #{slotIndex}
                  </span>

                  <div className="w-12 h-12 rounded-full border-2 border-[#7A1F1F] bg-[#E5A93C]/20 flex flex-col items-center justify-center p-1 animate-pulse">
                    <Zap className="w-4 h-4 text-[#7A1F1F]" />
                    <span className="font-mono text-[7px] font-black uppercase text-[#7A1F1F] tracking-tight leading-none mt-0.5">
                      NEXT
                    </span>
                  </div>

                  <span className="font-mono text-[9px] font-black uppercase tracking-wider text-[#7A1F1F] bg-[#E5A93C] px-1.5 py-0.5 rounded">
                    ACTIVE
                  </span>
                </motion.div>
              );
            }

            // 3. MILESTONE REWARD SLOT (The Final Golden Ticket / Seal)
            if (isMilestoneSlot) {
              return (
                <motion.div
                  key={slotIndex}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    sounds.playRewardFanfare();
                    if (onSlotClick) onSlotClick(slotIndex);
                  }}
                  className="relative p-3 aspect-square rounded-2xl bg-[#7A1F1F] text-[#F2ECD8] border-3 border-[#1F1614] shadow-[4px_4px_0px_#1F1614] flex flex-col items-center justify-between text-center cursor-pointer select-none overflow-hidden"
                >
                  <span className="font-mono text-[9px] font-black text-[#E5A93C] self-start uppercase tracking-wider">
                    VIP #{slotIndex}
                  </span>

                  <div className="w-11 h-11 rounded-full bg-[#E5A93C] text-[#1F1614] flex flex-col items-center justify-center border-2 border-[#1F1614] shadow-sm">
                    <Gift className="w-4 h-4 stroke-[2.5]" />
                    <span className="font-mono text-[7px] font-black uppercase tracking-tight leading-none mt-0.5">
                      REWARD
                    </span>
                  </div>

                  <span className="font-groovy text-[11px] font-bold text-[#E5A93C] uppercase tracking-wide">
                    50% OFF
                  </span>
                </motion.div>
              );
            }

            // 4. UPCOMING DOTTED SLOTS (Blueprint Outline)
            return (
              <div
                key={slotIndex}
                className="relative p-3 aspect-square rounded-2xl bg-[#FAF6EA] border-2 border-dashed border-[#7A1F1F]/40 flex flex-col items-center justify-between text-center opacity-65 select-none"
              >
                <span className="font-mono text-[10px] font-bold text-[#7A1F1F]/60 self-start">
                  #{slotIndex}
                </span>

                <div className="w-10 h-10 rounded-full border border-dashed border-[#7A1F1F]/30 flex items-center justify-center font-mono text-xs font-bold text-[#7A1F1F]/40">
                  {slotIndex}
                </div>

                <span className="font-mono text-[8px] font-bold uppercase tracking-wider text-[#7A1F1F]/50">
                  UPCOMING
                </span>
              </div>
            );
          })}
        </div>

        {/* MILESTONE REWARD SPOTLIGHT (Asymmetrical Bottom Feature) */}
        <div className="p-4 sm:p-5 rounded-2xl bg-[#7A1F1F] text-[#F2ECD8] border-3 border-[#1F1614] shadow-[4px_4px_0px_#1F1614] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-[#E5A93C] text-[#1F1614] flex items-center justify-center font-groovy font-black text-2xl border-2 border-[#1F1614] shrink-0 shadow-[2px_2px_0px_#1F1614]">
              %
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded bg-[#E5A93C] text-[#1F1614] font-mono text-[9px] font-black uppercase tracking-wider">
                  TARGET REWARD // SLOT #{totalSlots}
                </span>
                <span className="font-mono text-[10px] text-[#F2ECD8]/70">
                  AUTOMATIC UPON CARD COMPLETION
                </span>
              </div>
              <h4 className="font-groovy font-black text-xl sm:text-2xl text-[#F2ECD8] leading-tight mt-0.5">
                {currentGift?.title || '50% OFF Entire Order'}
              </h4>
              <p className="font-mono text-xs text-[#F2ECD8]/80">
                {currentGift?.desc || 'Applies 50% discount automatically to your entire bill upon milestone completion.'}
              </p>
            </div>
          </div>

          <div className="shrink-0 self-end sm:self-auto">
            {isMilestoneReached ? (
              <button
                type="button"
                onClick={() => {
                  sounds.playRewardFanfare();
                  if (onClaimMilestone) onClaimMilestone();
                }}
                className="px-6 py-3 rounded-2xl bg-[#E5A93C] hover:bg-[#F8CF75] text-[#1F1614] font-groovy font-black text-sm uppercase tracking-wider border-2 border-[#1F1614] shadow-[3px_3px_0px_#1F1614] cursor-pointer transition-all flex items-center gap-2"
              >
                <Crown className="w-4 h-4" />
                <span>CLAIM 50% REWARD NOW</span>
              </button>
            ) : (
              <div className="px-4 py-2 rounded-xl bg-[#5C1414] border-2 border-[#1F1614] text-right font-mono">
                <span className="text-[10px] text-[#F2ECD8]/60 uppercase block">REMAINING</span>
                <span className="font-groovy text-base text-[#E5A93C]">
                  {stampsRemaining} STAMPS
                </span>
              </div>
            )}
          </div>
        </div>

      </div>

    </section>
  );
}
