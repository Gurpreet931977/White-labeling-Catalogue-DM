import React from 'react';
import { motion } from 'framer-motion';
import { 
  Check, 
  Gift, 
  Percent, 
  Zap, 
  Sparkles, 
  ShieldCheck, 
  Lock, 
  ArrowRight,
  Flame,
  Award,
  Star
} from 'lucide-react';
import { sounds } from '../../utils/audio';

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
      
      {/* SECTION HEADER: Progress & Target Reward Spotlight */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 pb-1">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono tracking-widest text-[#FF4800] uppercase font-bold">
              PROGRESSION TRACK
            </span>
            <span className="px-2.5 py-0.5 rounded-full bg-[#EAE0CE] text-[#6E5D4F] border border-[#DDD0BC] font-mono text-[9px] font-bold">
              {totalSlots}-STAMP CYCLE
            </span>
          </div>
          <h3 className="font-clash font-bold text-xl sm:text-2xl text-[#1C120C] mt-0.5">
            Member Stamp Journey
          </h3>
        </div>

        {/* Status Pill */}
        <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-2xl bg-white border border-[#E2D6C3] text-xs font-mono shadow-xs">
          <span className="text-[#76675B]">COLLECTED:</span>
          <span className="font-bold text-[#FF4800] text-sm">
            {currentStamps} / {totalSlots}
          </span>
          <span className="text-[#8C7D70]">({Math.round(progressPercent)}%)</span>
        </div>
      </div>

      {/* MAIN JOURNEY CONTAINER (BRIGHT WARM CERAMIC WHITE) */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white border border-[#E2D6C3] shadow-md space-y-6 relative overflow-hidden">
        
        {/* Subtle Warm Poppy Ambient Gradient */}
        <div className="absolute top-0 right-0 w-80 h-80 rounded-full bg-[#FF4800]/5 blur-[90px] pointer-events-none" />

        {/* 1. SCULPTED HORIZONTAL PROGRESS TRACK */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs font-mono text-[#76675B]">
            <span className="font-bold text-[#1C120C]">Card Journey Progress</span>
            <span className="font-bold text-[#FF4800]">
              {isMilestoneReached ? 'Milestone Unlocked!' : `${stampsRemaining} more to unlock reward`}
            </span>
          </div>
          <div className="h-3 w-full rounded-full bg-[#EFE7D8] overflow-hidden p-0.5 border border-[#DDD1BE]">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progressPercent}%` }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
              className="h-full rounded-full bg-gradient-to-r from-[#FF4800] via-[#FF7A00] to-[#F59E0B]"
            />
          </div>
        </div>

        {/* 2. DYNAMIC STAMP SLOT NODES */}
        <div className={`grid gap-3 sm:gap-4 pt-1 ${
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
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                onClick={() => {
                  sounds.playClick();
                  if (onSlotClick) onSlotClick(slotIndex);
                }}
                className={`relative rounded-2xl p-3 sm:p-4 aspect-square flex flex-col items-center justify-between text-center transition-all select-none overflow-hidden cursor-pointer ${
                  isStamped
                    ? 'bg-[#FFF8F5] border-2 border-[#FF4800] shadow-sm ring-1 ring-[#FF4800]/20'
                    : isMilestoneSlot
                    ? 'bg-[#FDFBF7] border-2 border-dashed border-[#F59E0B] ring-1 ring-[#F59E0B]/20'
                    : isNextSlot
                    ? 'bg-[#FFF9F6] border-2 border-[#FF4800]/80 shadow-xs ring-2 ring-[#FF4800]/30 animate-pulse'
                    : 'bg-[#F8F4EC] border-2 border-dashed border-[#DDD1BE] hover:border-[#FF4800]/50'
                }`}
              >
                {/* Slot Index Tag */}
                <div className="w-full flex items-center justify-between">
                  <span className="text-[10px] font-mono text-[#8C7D70] font-bold">
                    #{slotIndex}
                  </span>
                  {isStamped && (
                    <Check className="w-3.5 h-3.5 text-[#FF4800] stroke-[3]" />
                  )}
                  {isMilestoneSlot && !isStamped && (
                    <Award className="w-3.5 h-3.5 text-[#F59E0B]" />
                  )}
                </div>

                {/* Center Graphic */}
                <div className="flex-1 flex items-center justify-center my-1 w-full">
                  {isStamped ? (
                    <motion.div
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-[#FF4800] text-white flex flex-col items-center justify-center shadow-md shadow-[#FF4800]/30"
                    >
                      <Check className="w-5 h-5 stroke-[3]" />
                      <span className="text-[7px] font-mono font-black tracking-tight uppercase leading-none mt-0.5">
                        EARNED
                      </span>
                    </motion.div>
                  ) : isMilestoneSlot ? (
                    <div className="flex flex-col items-center">
                      <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-[#F59E0B]/15 border border-[#F59E0B]/40 flex items-center justify-center text-[#D97706]">
                        {currentGift?.id === 'discount50' ? (
                          <Percent className="w-5 h-5 stroke-[2.5]" />
                        ) : (
                          <Gift className="w-5 h-5 stroke-[2.5]" />
                        )}
                      </div>
                      <span className="text-[8px] font-mono font-bold text-[#D97706] mt-1 tracking-tight uppercase">
                        REWARD
                      </span>
                    </div>
                  ) : isNextSlot ? (
                    <div className="flex flex-col items-center text-[#FF4800]">
                      <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full border-2 border-[#FF4800] flex items-center justify-center">
                        <Zap className="w-4 h-4 fill-[#FF4800]" />
                      </div>
                      <span className="text-[8px] font-mono text-[#FF4800] mt-0.5 font-bold">
                        NEXT
                      </span>
                    </div>
                  ) : (
                    <div className="w-8 h-8 rounded-full border border-dashed border-[#DDD1BE] flex items-center justify-center text-[#A19183]">
                      <Star className="w-3.5 h-3.5 opacity-40" />
                    </div>
                  )}
                </div>

                {/* Slot Status Label */}
                <span className={`text-[8px] font-mono font-bold tracking-tight truncate max-w-full ${
                  isStamped
                    ? 'text-[#FF4800]'
                    : isMilestoneSlot
                    ? 'text-[#D97706]'
                    : isNextSlot
                    ? 'text-[#1C120C]'
                    : 'text-[#8C7D70]'
                }`}>
                  {isStamped ? 'VERIFIED' : isMilestoneSlot ? currentGift?.badge || 'MILESTONE' : isNextSlot ? 'NEXT BILL' : 'LOCKED'}
                </span>
              </motion.div>
            );
          })}
        </div>

        {/* 3. STREAK SPEED-UP MULTIPLIER CALLOUT (POPPY HIGHLIGHT) */}
        {hasStreakBonus && (
          <div className="p-4 rounded-2xl bg-[#FFF4EE] border-2 border-[#FF4800]/40 flex items-center justify-between text-xs font-mono shadow-xs">
            <div className="flex items-center gap-2 text-[#FF4800]">
              <Flame className="w-4 h-4 fill-[#FF4800]" />
              <span className="font-bold text-[#1C120C]">5-Day Active Streak Boost:</span>
              <span className="text-[#6E5D4F] hidden sm:inline">Next bill credits +2 STAMPS simultaneously!</span>
            </div>
            <span className="px-3 py-1 rounded-full bg-[#FF4800] text-white font-bold text-[10px] tracking-wider shadow-sm">
              +2X STAMPS
            </span>
          </div>
        )}

        {/* 4. TARGET REWARD MILESTONE BANNER */}
        <div className="p-5 sm:p-6 rounded-2xl bg-[#F8F4EC] border border-[#E2D6C3] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="w-13 h-13 rounded-2xl bg-white border border-[#E2D6C3] flex items-center justify-center text-[#FF4800] shrink-0 shadow-sm">
              {currentGift?.id === 'discount50' ? (
                <Percent className="w-6 h-6 stroke-[2.5]" />
              ) : (
                <Gift className="w-6 h-6 stroke-[2]" />
              )}
            </div>
            <div className="space-y-0.5">
              <div className="flex items-center gap-2">
                <span className="text-[9px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-[#FF4800]/10 text-[#FF4800] border border-[#FF4800]/30 uppercase tracking-wider">
                  TARGET REWARD
                </span>
                <span className="text-xs font-mono text-[#76675B]">
                  Slot #{totalSlots} Milestone
                </span>
              </div>
              <h4 className="font-clash font-bold text-lg text-[#1C120C]">
                {currentGift?.title || '50% OFF Entire Order'}
              </h4>
              <p className="text-xs text-[#76675B] font-sans">
                {currentGift?.desc || 'Applies automatically to your entire bill upon completing your card.'}
              </p>
            </div>
          </div>

          <div className="shrink-0 self-start sm:self-center">
            {isMilestoneReached ? (
              <button
                type="button"
                onClick={onClaimMilestone}
                className="px-6 py-3 rounded-2xl bg-[#FF4800] hover:bg-[#E03F00] text-white font-sans font-bold text-xs flex items-center gap-2 shadow-lg shadow-[#FF4800]/25 cursor-pointer transition-all"
              >
                <Gift className="w-4 h-4" />
                <span>Claim Milestone Pass</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <div className="px-4 py-2.5 rounded-2xl bg-white border border-[#E2D6C3] text-right shadow-xs">
                <span className="text-[9px] font-mono text-[#8C7D70] block uppercase font-bold">Remaining</span>
                <span className="font-mono text-sm font-bold text-[#1C120C]">
                  {stampsRemaining} {stampsRemaining === 1 ? 'stamp' : 'stamps'}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* 5. READ-ONLY NOTICE / AUTO-SYNC GUIDANCE */}
        <div className="flex items-center justify-between text-[11px] font-mono text-[#76675B] pt-1">
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-[#FF4800]" />
            <span>Read-only member card • Stamps sync automatically on checkout</span>
          </span>
          <span className="text-[#8C7D70] hidden sm:inline">1 Bill = +1 Stamp (+2 on 5d streak)</span>
        </div>

      </div>

    </section>
  );
}
