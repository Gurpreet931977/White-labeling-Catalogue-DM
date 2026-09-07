import React from 'react';

export function RetroMarqueeBanner({
  text = 'COLLECT STAMPS • EARN PERKS • 5-DAY STREAK BOOST • UNLOCK 50% OFF • VERIFIED DIGITAL PASS • ',
  variant = 'oxblood', // 'oxblood' | 'cream' | 'mustard'
  className = ''
}) {
  const isOxblood = variant === 'oxblood';
  const isMustard = variant === 'mustard';

  const bgClasses = isOxblood
    ? 'bg-[#7A1F1F] text-[#F2ECD8] border-y-2 border-[#5C1414]'
    : isMustard
    ? 'bg-[#E5A93C] text-[#7A1F1F] border-y-2 border-[#7A1F1F]'
    : 'bg-[#F2ECD8] text-[#7A1F1F] border-y-2 border-[#7A1F1F]';

  const fullPhrase = `${text} ${text} ${text} ${text} `;

  return (
    <div className={`overflow-hidden py-2.5 font-groovy tracking-wider select-none ${bgClasses} ${className}`}>
      <div className="flex w-max whitespace-nowrap animate-marquee">
        <span className="text-xs sm:text-sm font-bold uppercase tracking-[0.18em] px-2">
          {fullPhrase}
        </span>
        <span className="text-xs sm:text-sm font-bold uppercase tracking-[0.18em] px-2" aria-hidden="true">
          {fullPhrase}
        </span>
      </div>
    </div>
  );
}
