import React from 'react';

export function RetroMarqueeBanner({
  text = 'COLLECT PUNCHES • ACCRUE VELOCITY • 5-DAY STREAK MULTIPLIER • UNLOCK 50% REWARD • PHYSICAL PASS VERIFIED • ',
  variant = 'ink', // 'ink' | 'oxblood' | 'mustard' | 'cream'
  className = ''
}) {
  const isOxblood = variant === 'oxblood';
  const isMustard = variant === 'mustard';
  const isCream = variant === 'cream';

  const bgClasses = isOxblood
    ? 'bg-[#7A1F1F] text-[#F2ECD8] border-b border-[#1F1614]/80'
    : isMustard
    ? 'bg-[#E5A93C] text-[#1F1614] border-b border-[#1F1614]/80'
    : isCream
    ? 'bg-[#FAF6EA] text-[#7A1F1F] border-b border-[#1F1614]/80'
    : 'bg-[#1F1614] text-[#E5A93C] border-b border-[#1F1614]/80';

  const fullPhrase = `${text} ${text} ${text} `;

  return (
    <div className={`overflow-hidden py-1 sm:py-1.5 font-mono select-none ${bgClasses} ${className}`}>
      <div className="flex w-max whitespace-nowrap animate-marquee-slow">
        <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.22em] px-3">
          {fullPhrase}
        </span>
        <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.22em] px-3" aria-hidden="true">
          {fullPhrase}
        </span>
      </div>
    </div>
  );
}
