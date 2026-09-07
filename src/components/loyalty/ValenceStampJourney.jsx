import React from 'react';
import { motion } from 'framer-motion';
import { 
  Check, 
  Gift, 
  Percent, 
  Flame, 
  ArrowRight,
  ShieldCheck,
  Star
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

  return (
    <section className="space-y-4">
      
      {/* SECTION HEADER: Poster Scale */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 pb-1">
        <div>
          <span className="text-xs font-mono font-bold tracking-widest text-[#7A1F1F] uppercase">
            COLLECT STAMPS • UNLOCK REWARDS
          </span>
          <h3 className="font-groovy font-black text-3xl sm:text-4xl text-[#7A1F1F] tracking-wide mt-0.5 leading-none">
            Member Stamp Journey
          </h3>
        </div>

        {/* Big Poster Number Badge */}
        <div className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-[#7A1F1F] text-[#F2ECD8] border-2 border-[#5C1414] shadow-[4px_4px_0px_#5C1414] self-start sm:self-auto">
          <span className="text-[11px] font-mono uppercase font-bold text-[#F2ECD8]/80">PUNCHED:</span>
          <span className="font-groovy text-xl sm:text-2xl text-[#E5A93C] leading-none">
            {currentStamps} / {totalSlots}
          </span>
          <span className="text-xs font-mono text-[#F2ECD8]/80">({Math.round(progressPercent)}%)</span>
        </div>
      </div>

      {/* MAIN RETRO COTTON PUNCH CARD CONTAINER */}
      <div className="p-6 sm:p-8 rounded-3xl bg-[#FAF6EA] border-3 border-[#7A1F1F] shadow-[8px_8px_0px_#7A1F1F] space-y-6 relative overflow-hidden">
        
        {/* Inner Stitched / Dashed Margin */}
        <div className="absolute inset-3 rounded-2xl border-2 border-dashed border-[#7A1F1F]/20 pointer-events-none" />

        {/* 1. HORIZONTAL PROGRESS TRACK */}
        <div className="space-y-2 relative z-10">
          <div className="flex items-center justify-between text-xs font-mono font-bold text-[#7A1F1F]">
            <span className="uppercase tracking-wider">Card Progression</span>
            <span className="font-groovy text-sm text-[#7A1F1F]">
              {isMilestoneReached ? 'Milestone Complete!' : `${stampsRemaining} more stamps to reward`}
            </span>
          </div>

          <div className="h-4 w-full rounded-full bg-[#E2D8BE] border-2 border-[#7A1F1F] overflow-hidden p-0.5">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progressPercent}%` }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
              className="h-full rounded-full bg-[#E5A93C]"
            />
          </div>
        </div>

        {/* 2. DYNAMIC STAMP SLOT NODES (Flat Bold Color Blocking) */}
        <div className={`grid gap-3 sm:gap-4 pt-1 relative z-10 ${
          totalSlots <= 6
            ? 'grid-cols-3 sm:grid-cols-6'
            : totalSlots <= 8
            ? 'grid-cols-4 sm:grid-cols-8'
            : 'grid-cols-3 sm:grid-cols-6'
        }`}>
          {Array.from({ length: totalSlots }, (_, i) => i + 1).map((slotIndex) => {
            const isStamped = currentStamps >= slotIndex;
            const isNextSlot = slotIndex === currentStamps + 1;
            const isMilestoneSlot = slotIndex === totalSlots;

            return (
              <motion.div
                key={slotIndex}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  sounds.playClick();
                  if (onSlotClick) onSlotClick(slotIndex);
                }}
                className={`relative rounded-2xl p-3 aspect-square flex flex-col items-center justify-between text-center select-none overflow-hidden cursor-pointer transition-all ${
                  isStamped
                    ? 'bg-[#E5A93C] text-[#7A1F1F] border-3 border-[#7A1F1F] shadow-[3px_3px_0px_#7A1F1F]'
                    : isMilestoneSlot
                    ? 'bg-[#7A1F1F] text-[#F2ECD8] border-3 border-[#5C1414] shadow-[3px_3px_0px_#470D0D]'
                    : isNextSlot
                    ? 'bg-[#FAF6EA] text-[#7A1F1F] border-3 border-dashed border-[#7A1F1F] animate-pulse'
                    : 'bg-[#F2ECD8] text-[#7A1F1F]/50 border-2 border-dashed border-[#D8CEB0]'
                }`}
              >
                {/* Slot Number at Top */}
                <div className="w-full flex items-center justify-between">
                  <span className={`font-groovy text-sm ${isStamped ? 'text-[#7A1F1F]' : isMilestoneSlot ? 'text-[#E5A93C]' : 'text-[#7A1F1F]'}`}>
                    #{slotIndex}
                  </span>
                  {isStamped && (
                    <span className="w-4 h-4 rounded-full bg-[#7A1F1F] text-[#E5A93C] flex items-center justify-center">
                      <Check className="w-2.5 h-2.5 stroke-[4]" />
                    </span>
                  )}
                  {isMilestoneSlot && !isStamped && (
                    <span className="text-[10px] font-groovy text-[#E5A93C]">VIP</span>
                  )}
                </div>

                {/* Center Graphic */}
                <div className="flex-1 flex items-center justify-center my-1 w-full">
                  {isStamped ? (
                    <motion.div
                      initial={{ scale: 0.8, rotate: -15 }}
                      animate={{ scale: 1, rotate: 0 }}
                      className="w-11 h-11 rounded-full bg-[#7A1F1F] text-[#E5A93C] border-2 border-[#5C1414] flex flex-col items-center justify-center shadow-sm"
                    >
                      <Check className="w-5 h-5 stroke-[4]" />
                      <span className="text-[7px] font-groovy font-bold uppercase leading-none mt-0.5 tracking-tight">
                        STAMPED
                      </span>
                    </motion.div>
                  ) : isMilestoneSlot ? (
                    <div className="flex flex-col items-center">
                      <div className="w-11 h-11 rounded-full bg-[#E5A93C] text-[#7A1F1F] border-2 border-[#7A1F1F] flex items-center justify-center">
                        {currentGift?.id === 'discount50' ? (
                          <Percent className="w-6 h-6 stroke-[3]" />
                        ) : (
                          <Gift className="w-6 h-6 stroke-[2.5]" />
                        )}
                      </div>
                      <span className="text-[8px] font-groovy font-bold text-[#E5A93C] mt-1 uppercase">
                        REWARD
                      </span>
                    </div>
                  ) : isNextSlot ? (
                    <div className="flex flex-col items-center text-[#7A1F1F]">
                      <div className="w-9 h-9 rounded-full border-2 border-[#7A1F1F] flex items-center justify-center">
                        <Flame className="w-4 h-4 text-[#7A1F1F] fill-[#7A1F1F]" />
                      </div>
                      <span className="text-[8px] font-groovy text-[#7A1F1F] mt-0.5 font-bold">
                        NEXT
                      </span>
                    </div>
                  ) : (
                    <div className="w-8 h-8 rounded-full border border-dashed border-[#D8CEB0] flex items-center justify-center text-[#D8CEB0]">
                      <Star className="w-3.5 h-3.5" />
                    </div>
                  )}
                </div>

                {/* Bottom Label */}
                <span className={`text-[9px] font-groovy tracking-wide truncate max-w-full uppercase ${
                  isStamped
                    ? 'text-[#7A1F1F] font-bold'
                    : isMilestoneSlot
                    ? 'text-[#E5A93C] font-bold'
                    : isNextSlot
                    ? 'text-[#7A1F1F] font-bold'
                    : 'text-[#8F8876]'
                }`}>
                  {isStamped ? 'VERIFIED' : isMilestoneSlot ? currentGift?.badge || 'GIFT' : isNextSlot ? 'NEXT BILL' : 'LOCKED'}
                </span>
              </motion.div>
            );
          })}
        </div>

        {/* 3. STREAK SPEED-UP BANNER (Deep Oxblood Full-Bleed Block) */}
        {hasStreakBonus && (
          <div className="p-4 rounded-2xl bg-[#7A1F1F] text-[#F2ECD8] border-2 border-[#5C1414] shadow-[4px_4px_0px_#5C1414] flex items-center justify-between text-xs font-mono relative z-10">
            <div className="flex items-center gap-2">
              <span className="p-1 rounded-lg bg-[#E5A93C] text-[#7A1F1F]">
                <Flame className="w-4 h-4 fill-[#7A1F1F]" />
              </span>
              <div>
                <span className="font-groovy text-sm sm:text-base text-[#E5A93C] tracking-wide block leading-tight">
                  5-DAY ACTIVE STREAK MULTIPLIER
                </span>
                <span className="text-[11px] text-[#F2ECD8]/90 font-sans hidden sm:inline">
                  Maintaining your streak marks +2 stamps at once on your next bill!
                </span>
              </div>
            </div>

            <span className="px-3 py-1 rounded-xl bg-[#E5A93C] text-[#7A1F1F] font-groovy font-black text-xs uppercase shadow-sm">
              +2X SPEED-UP
            </span>
          </div>
        )}

        {/* 4. TARGET MILESTONE REWARD POSTER BLOCK */}
        <div className="p-5 sm:p-6 rounded-2xl bg-[#7A1F1F] text-[#F2ECD8] border-3 border-[#5C1414] shadow-[6px_6px_0px_#5C1414] flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-2xl bg-[#E5A93C] text-[#7A1F1F] border-2 border-[#7A1F1F] flex items-center justify-center shrink-0 shadow-sm">
              {currentGift?.id === 'discount50' ? (
                <Percent className="w-7 h-7 stroke-[3]" />
              ) : (
                <Gift className="w-7 h-7 stroke-[2.5]" />
              )}
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-[#E5A93C] text-[#7A1F1F] uppercase tracking-wider">
                  TARGET REWARD
                </span>
                <span className="text-xs font-mono text-[#F2ECD8]/80">
                  Slot #{totalSlots} Milestone
                </span>
              </div>

              {/* Reward Headline in Lilita One */}
              <h4 className="font-groovy font-black text-xl sm:text-2xl text-[#F2ECD8] tracking-wide">
                {currentGift?.title || '50% OFF Entire Order'}
              </h4>
              <p className="text-xs text-[#F2ECD8]/90 font-sans max-w-lg">
                {currentGift?.desc || 'Applies 50% discount automatically upon completing all card stamps.'}
              </p>
            </div>
          </div>

          <div className="shrink-0 self-start sm:self-center">
            {isMilestoneReached ? (
              <button
                type="button"
                onClick={onClaimMilestone}
                className="px-6 py-3 rounded-2xl bg-[#E5A93C] hover:bg-[#C98D25] text-[#7A1F1F] font-groovy font-bold text-sm tracking-wider flex items-center gap-2 shadow-[4px_4px_0px_#5C1414] cursor-pointer transition-all uppercase"
              >
                <Gift className="w-4 h-4 stroke-[2.5]" />
                <span>Claim Milestone</span>
                <ArrowRight className="w-4 h-4 stroke-[2.5]" />
              </button>
            ) : (
              <div className="px-4 py-2.5 rounded-2xl bg-[#5C1414] border-2 border-[#470D0D] text-right">
                <span className="text-[10px] font-mono text-[#F2ECD8]/70 block uppercase font-bold">Remaining</span>
                <span className="font-groovy text-base sm:text-lg text-[#E5A93C]">
                  {stampsRemaining} {stampsRemaining === 1 ? 'stamp' : 'stamps'}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* 5. READ-ONLY NOTICE / AUTO-SYNC GUIDANCE */}
        <div className="flex items-center justify-between text-xs font-mono text-[#7A1F1F] pt-1 relative z-10 border-t-2 border-dashed border-[#7A1F1F]/20">
          <span className="flex items-center gap-1.5 font-bold">
            <ShieldCheck className="w-4 h-4 text-[#7A1F1F]" />
            <span>Read-only pass • Stamps mark automatically on counter billing</span>
          </span>
          <span className="hidden sm:inline font-bold">1 Bill = +1 Stamp (+2 on 5d Streak)</span>
        </div>

      </div>

    </section>
  );
}
