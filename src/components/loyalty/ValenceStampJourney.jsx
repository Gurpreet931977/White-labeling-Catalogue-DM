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
            <span className="text-[10px] font-mono tracking-widest text-[#3B82F6] uppercase font-bold">
              PROGRESSION TRACK
            </span>
            <span className="px-2 py-0.5 rounded-full bg-[#1A1C24] text-[#8E91A0] border border-[#2B2E3D] font-mono text-[9px] font-bold">
              {totalSlots}-STAMP CYCLE
            </span>
          </div>
          <h3 className="font-clash font-bold text-xl sm:text-2xl text-[#F4F4F6] mt-0.5">
            Member Stamp Journey
          </h3>
        </div>

        {/* Status Pill */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-2xl bg-[#121318] border border-[#222533] text-xs font-mono">
          <span className="text-[#8E91A0]">COLLECTED:</span>
          <span className="font-bold text-[#3B82F6] text-sm">
            {currentStamps} / {totalSlots}
          </span>
          <span className="text-[#545768]">({Math.round(progressPercent)}%)</span>
        </div>
      </div>

      {/* MAIN JOURNEY CONTAINER */}
      <div className="p-6 sm:p-7 rounded-3xl bg-[#121318] border border-[#222533] shadow-xl space-y-6 relative overflow-hidden">
        
        {/* Subtle Background Accent Gradient */}
        <div className="absolute top-0 right-0 w-80 h-80 rounded-full bg-[#2563EB]/5 blur-[90px] pointer-events-none" />

        {/* 1. SCULPTED HORIZONTAL PROGRESS TRACK */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs font-mono text-[#8E91A0]">
            <span>Card Journey</span>
            <span>{isMilestoneReached ? 'Milestone Unlocked!' : `${stampsRemaining} more to reward`}</span>
          </div>
          <div className="h-2.5 w-full rounded-full bg-[#0B0C0E] overflow-hidden p-0.5 border border-[#242735]">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progressPercent}%` }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
              className="h-full rounded-full bg-gradient-to-r from-[#2563EB] via-[#3B82F6] to-[#F59E0B]"
            />
          </div>
        </div>

        {/* 2. DYNAMIC STAMP SLOT NODES */}
        <div className={`grid gap-3 pt-1 ${
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
                className={`relative rounded-2xl p-3 aspect-square flex flex-col items-center justify-between text-center transition-all select-none overflow-hidden cursor-pointer ${
                  isStamped
                    ? 'bg-[#191B24] border border-[#2563EB]/50 shadow-md ring-1 ring-[#2563EB]/30'
                    : isMilestoneSlot
                    ? 'bg-[#1E1B16] border-2 border-dashed border-[#F59E0B]/70 ring-1 ring-[#F59E0B]/20'
                    : isNextSlot
                    ? 'bg-[#14161F] border-2 border-[#3B82F6]/60 shadow-inner ring-1 ring-[#3B82F6]/40 animate-pulse'
                    : 'bg-[#0E0F14] border border-dashed border-[#242735] hover:border-[#3B82F6]/40'
                }`}
              >
                {/* Slot Index Tag */}
                <div className="w-full flex items-center justify-between">
                  <span className="text-[10px] font-mono text-[#8E91A0] font-semibold">
                    #{slotIndex}
                  </span>
                  {isStamped && (
                    <Check className="w-3 h-3 text-[#10B981] stroke-[3]" />
                  )}
                  {isMilestoneSlot && !isStamped && (
                    <Award className="w-3 h-3 text-[#F59E0B]" />
                  )}
                </div>

                {/* Center Graphic */}
                <div className="flex-1 flex items-center justify-center my-1 w-full">
                  {isStamped ? (
                    <motion.div
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="w-10 h-10 rounded-xl bg-[#2563EB] text-white flex flex-col items-center justify-center shadow-lg shadow-[#2563EB]/30 border border-[#3B82F6]"
                    >
                      <Check className="w-5 h-5 stroke-[3]" />
                      <span className="text-[7px] font-mono font-bold tracking-tight uppercase leading-none mt-0.5">
                        EARNED
                      </span>
                    </motion.div>
                  ) : isMilestoneSlot ? (
                    <div className="flex flex-col items-center">
                      <div className="w-10 h-10 rounded-xl bg-[#F59E0B]/15 border border-[#F59E0B]/40 flex items-center justify-center text-[#F59E0B]">
                        {currentGift?.id === 'discount50' ? (
                          <Percent className="w-5 h-5 stroke-[2.5]" />
                        ) : (
                          <Gift className="w-5 h-5" />
                        )}
                      </div>
                      <span className="text-[8px] font-mono font-bold text-[#F59E0B] mt-1 tracking-tight uppercase">
                        REWARD
                      </span>
                    </div>
                  ) : isNextSlot ? (
                    <div className="flex flex-col items-center text-[#3B82F6]">
                      <div className="w-9 h-9 rounded-full border border-[#3B82F6] flex items-center justify-center">
                        <Zap className="w-4 h-4 fill-[#3B82F6]" />
                      </div>
                      <span className="text-[8px] font-mono text-[#3B82F6] mt-0.5 font-bold">
                        NEXT
                      </span>
                    </div>
                  ) : (
                    <div className="w-8 h-8 rounded-full border border-dashed border-[#242735] flex items-center justify-center text-[#363A4D]">
                      <Star className="w-3.5 h-3.5 opacity-30" />
                    </div>
                  )}
                </div>

                {/* Slot Status Label */}
                <span className={`text-[8px] font-mono font-semibold tracking-tight truncate max-w-full ${
                  isStamped
                    ? 'text-[#3B82F6]'
                    : isMilestoneSlot
                    ? 'text-[#F59E0B]'
                    : isNextSlot
                    ? 'text-[#F4F4F6]'
                    : 'text-[#545768]'
                }`}>
                  {isStamped ? 'VERIFIED' : isMilestoneSlot ? currentGift?.badge || 'MILESTONE' : isNextSlot ? 'NEXT BILL' : 'LOCKED'}
                </span>
              </motion.div>
            );
          })}
        </div>

        {/* 3. STREAK SPEED-UP MULTIPLIER CALLOUT */}
        {hasStreakBonus && (
          <div className="p-3.5 rounded-2xl bg-[#F97316]/10 border border-[#F97316]/30 flex items-center justify-between text-xs font-mono">
            <div className="flex items-center gap-2 text-[#F97316]">
              <Flame className="w-4 h-4 fill-[#F97316]" />
              <span className="font-bold">5-Day Active Streak Boost:</span>
              <span className="text-[#F4F4F6] hidden sm:inline">Next bill awards +2 STAMPS simultaneously!</span>
            </div>
            <span className="px-2.5 py-0.5 rounded-full bg-[#F97316] text-white font-bold text-[10px]">
              +2X STAMPS
            </span>
          </div>
        )}

        {/* 4. TARGET REWARD MILESTONE BANNER */}
        <div className="p-4 sm:p-5 rounded-2xl bg-[#171922] border border-[#2B2E3D] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-[#2563EB]/15 border border-[#2563EB]/30 flex items-center justify-center text-[#3B82F6] shrink-0">
              {currentGift?.id === 'discount50' ? (
                <Percent className="w-6 h-6 stroke-[2.5]" />
              ) : (
                <Gift className="w-6 h-6 stroke-[2]" />
              )}
            </div>
            <div className="space-y-0.5">
              <div className="flex items-center gap-2">
                <span className="text-[9px] font-mono font-bold px-2 py-0.5 rounded-full bg-[#3B82F6]/15 text-[#3B82F6] border border-[#3B82F6]/30 uppercase tracking-wider">
                  TARGET REWARD
                </span>
                <span className="text-xs font-mono text-[#8E91A0]">
                  Slot #{totalSlots} Milestone
                </span>
              </div>
              <h4 className="font-clash font-bold text-base sm:text-lg text-[#F4F4F6]">
                {currentGift?.title || '50% OFF Entire Order'}
              </h4>
              <p className="text-xs text-[#8E91A0] font-sans">
                {currentGift?.desc || 'Applies automatically to your entire bill upon completing your card.'}
              </p>
            </div>
          </div>

          <div className="shrink-0 self-start sm:self-center">
            {isMilestoneReached ? (
              <button
                type="button"
                onClick={onClaimMilestone}
                className="px-5 py-2.5 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-sans font-bold text-xs flex items-center gap-2 shadow-lg shadow-[#2563EB]/30 cursor-pointer transition-all"
              >
                <Gift className="w-4 h-4" />
                <span>Claim Milestone Pass</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <div className="px-3.5 py-2 rounded-xl bg-[#0E0F14] border border-[#242735] text-right">
                <span className="text-[9px] font-mono text-[#8E91A0] block uppercase">Remaining</span>
                <span className="font-mono text-sm font-bold text-[#F4F4F6]">
                  {stampsRemaining} {stampsRemaining === 1 ? 'stamp' : 'stamps'}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* 5. READ-ONLY NOTICE / AUTO-SYNC GUIDANCE */}
        <div className="flex items-center justify-between text-[11px] font-mono text-[#8E91A0] pt-1">
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-[#3B82F6]" />
            <span>Read-only member card • Stamps sync automatically on checkout</span>
          </span>
          <span className="text-[#545768] hidden sm:inline">1 Bill = +1 Stamp (+2 on 5d streak)</span>
        </div>

      </div>

    </section>
  );
}
