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
    ? 'bg-[#7A1F1F] text-[#F2ECD8] border-y-3 border-[#1F1614]'
    : isMustard
    ? 'bg-[#E5A93C] text-[#1F1614] border-y-3 border-[#1F1614]'
    : isCream
    ? 'bg-[#FAF6EA] text-[#7A1F1F] border-y-3 border-[#1F1614]'
    : 'bg-[#1F1614] text-[#E5A93C] border-y-3 border-[#1F1614]';

  const fullPhrase = `${text} ${text} ${text} `;

  return (
    <div className={`overflow-hidden py-2 font-mono select-none ${bgClasses} ${className}`}>
      <div className="flex w-max whitespace-nowrap animate-marquee">
        <span className="text-xs sm:text-sm font-black uppercase tracking-[0.22em] px-2">
          {fullPhrase}
        </span>
        <span className="text-xs sm:text-sm font-black uppercase tracking-[0.22em] px-2" aria-hidden="true">
          {fullPhrase}
        </span>
      </div>
    </div>
  );
}
