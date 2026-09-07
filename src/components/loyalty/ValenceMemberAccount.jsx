import React from 'react';
import {
  ShieldCheck,
  Flame,
  CheckCircle2,
  Volume2,
  VolumeX,
  QrCode,
  Star,
  Award
} from 'lucide-react';
import { sounds } from '../../utils/audio';
import { CircularStampBadge } from './CircularStampBadge';

export function ValenceMemberAccount({ customer, isSoundOn, onToggleSound }) {
  const tiers = [
    {
      name: 'Bronze Member',
      xpReq: '0 - 200 XP',
      level: 1,
      perks: ['Standard 1x stamp accrual', 'Digital membership wallet pass', 'Member newsletter updates'],
      isActive: (customer?.xp || 0) <= 200
    },
    {
      name: 'Silver Member',
      xpReq: '201 - 400 XP',
      level: 2,
      perks: ['10% bonus XP on purchases', 'Secret daily treats reveal', 'Early access to seasonal product drops'],
      isActive: (customer?.xp || 0) > 200 && (customer?.xp || 0) <= 400
    },
    {
      name: 'Gold Member',
      xpReq: '401 - 700 XP',
      level: 3,
      perks: ['5-day streak double stamp acceleration', '50% milestone reward unlock access', 'Priority counter service'],
      isActive: (customer?.xp || 0) > 400 && (customer?.xp || 0) <= 700,
      isCurrent: true
    },
    {
      name: 'Diamond Member',
      xpReq: '701+ XP',
      level: 4,
      perks: ['Permanent 2x XP booster', 'Custom concierge assistance', 'Exclusive limited VIP gift box every cycle'],
      isActive: (customer?.xp || 0) > 700
    }
  ];

  return (
    <section className="space-y-6">
      
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 pb-1">
        <div>
          <span className="text-xs font-mono font-bold tracking-widest text-[#7A1F1F] uppercase">
            MEMBER PROFILE
          </span>
          <h3 className="font-groovy font-black text-3xl sm:text-4xl text-[#7A1F1F] tracking-wide mt-0.5 leading-none">
            Account &amp; Progression
          </h3>
        </div>

        <button
          type="button"
          onClick={onToggleSound}
          className="px-4 py-2 rounded-xl bg-[#FAF6EA] border-2 border-[#7A1F1F] text-xs font-groovy font-bold text-[#7A1F1F] hover:bg-white flex items-center gap-2 cursor-pointer transition-colors shadow-[3px_3px_0px_#7A1F1F] uppercase"
        >
          {isSoundOn ? <Volume2 className="w-4 h-4 text-[#7A1F1F]" /> : <VolumeX className="w-4 h-4 text-[#7A1F1F]" />}
          <span>Audio Haptics: {isSoundOn ? 'ON' : 'OFF'}</span>
        </button>
      </div>

      {/* 1. MEMBER IDENTITY CARD & OPTICAL SCANNER PASS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Left 2 Cols: Member Profile Details */}
        <div className="md:col-span-2 p-6 sm:p-8 rounded-3xl bg-[#FAF6EA] border-3 border-[#7A1F1F] shadow-[8px_8px_0px_#7A1F1F] space-y-6">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-[#7A1F1F] text-[#F2ECD8] flex items-center justify-center font-groovy font-black text-2xl border-2 border-[#5C1414] shadow-[4px_4px_0px_#470D0D]">
                {customer?.name ? customer.name.slice(0, 2).toUpperCase() : 'ME'}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="font-groovy font-black text-2xl sm:text-3xl text-[#7A1F1F]">
                    {customer?.name || 'Member'}
                  </h4>
                  <span className="px-2.5 py-0.5 rounded-full bg-[#E5A93C] text-[#7A1F1F] font-groovy text-xs font-black uppercase">
                    GOLD TIER
                  </span>
                </div>
                <p className="text-xs font-mono text-[#7A1F1F] font-bold mt-0.5">
                  ID: VAL-{customer?.phone || '9876543210'}
                </p>
              </div>
            </div>

            {/* Circular Stamp Badge */}
            <CircularStampBadge
              text="• VALENCE STATUS • LEVEL 3 •"
              centerText="GOLD"
              subText="MEMBER"
              size={76}
              variant="oxblood"
            />
          </div>

          {/* Quick Metrics at Poster Scale */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
            <div className="p-4 rounded-2xl bg-[#F2ECD8] border-2 border-[#7A1F1F]">
              <span className="text-[10px] font-mono text-[#7A1F1F] uppercase font-bold block">Lifetime Visits</span>
              <span className="font-groovy font-black text-2xl sm:text-3xl text-[#7A1F1F]">
                {customer?.billingHistory?.length || 4}
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-[#F2ECD8] border-2 border-[#7A1F1F]">
              <span className="text-[10px] font-mono text-[#7A1F1F] uppercase font-bold block">Current Streak</span>
              <span className="font-groovy font-black text-2xl sm:text-3xl text-[#7A1F1F] flex items-center gap-1">
                <span>{customer?.streakDays || 5}d</span>
                <Flame className="w-5 h-5 fill-[#7A1F1F]" />
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-[#F2ECD8] border-2 border-[#7A1F1F]">
              <span className="text-[10px] font-mono text-[#7A1F1F] uppercase font-bold block">XP Progression</span>
              <span className="font-groovy font-black text-2xl sm:text-3xl text-[#7A1F1F]">
                {customer?.xp || 420}
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-[#F2ECD8] border-2 border-[#7A1F1F]">
              <span className="text-[10px] font-mono text-[#7A1F1F] uppercase font-bold block">Pass Cycle</span>
              <span className="font-groovy font-black text-2xl sm:text-3xl text-[#7A1F1F]">
                {customer?.stamps || 4}/6
              </span>
            </div>
          </div>

          {/* Security & Verification Guarantee */}
          <div className="p-4 rounded-2xl bg-[#7A1F1F] text-[#F2ECD8] border-2 border-[#5C1414] flex items-center gap-3 text-xs">
            <ShieldCheck className="w-6 h-6 text-[#E5A93C] shrink-0" />
            <p className="font-sans font-medium">
              Verified digital membership. Stamps and bills synchronize automatically via the in-store POS terminal.
            </p>
          </div>
        </div>

        {/* Right 1 Col: Optical Barcode / QR Scanner Target */}
        <div className="p-6 sm:p-7 rounded-3xl bg-[#FAF6EA] border-3 border-[#7A1F1F] shadow-[8px_8px_0px_#7A1F1F] flex flex-col items-center justify-between text-center space-y-4">
          <div className="space-y-1">
            <span className="text-xs font-mono uppercase font-black text-[#7A1F1F] tracking-wider">
              SCANNER PASS
            </span>
            <h4 className="font-groovy font-black text-xl text-[#7A1F1F]">
              Counter QR Code
            </h4>
            <p className="text-[11px] text-[#7A1F1F]/80 font-sans">
              Present to counter scanner during checkout to record stamps.
            </p>
          </div>

          {/* High-Contrast Crisp QR Visual with Bold Oxblood Border */}
          <div className="p-4 rounded-2xl bg-white shadow-md border-3 border-[#7A1F1F] inline-block">
            <svg viewBox="0 0 100 100" className="w-36 h-36">
              <rect x="5" y="5" width="28" height="28" rx="4" fill="#7A1F1F" />
              <rect x="9" y="9" width="20" height="20" rx="2" fill="#fff" />
              <rect x="13" y="13" width="12" height="12" fill="#7A1F1F" />

              <rect x="67" y="5" width="28" height="28" rx="4" fill="#7A1F1F" />
              <rect x="71" y="9" width="20" height="20" rx="2" fill="#fff" />
              <rect x="75" y="13" width="12" height="12" fill="#7A1F1F" />

              <rect x="5" y="67" width="28" height="28" rx="4" fill="#7A1F1F" />
              <rect x="9" y="71" width="20" height="20" rx="2" fill="#fff" />
              <rect x="13" y="75" width="12" height="12" fill="#7A1F1F" />

              <rect x="42" y="10" width="8" height="8" fill="#7A1F1F" />
              <rect x="42" y="25" width="8" height="15" fill="#7A1F1F" />
              <rect x="15" y="42" width="12" height="8" fill="#7A1F1F" />
              <rect x="40" y="45" width="16" height="16" rx="2" fill="#E5A93C" />
              <rect x="65" y="42" width="10" height="10" fill="#7A1F1F" />
              <rect x="78" y="55" width="14" height="6" fill="#7A1F1F" />
              <rect x="45" y="68" width="8" height="18" fill="#7A1F1F" />
              <rect x="60" y="72" width="15" height="10" fill="#7A1F1F" />
              <rect x="80" y="80" width="12" height="12" fill="#7A1F1F" />
            </svg>
          </div>

          <div className="font-mono text-xs font-bold text-[#7A1F1F]">
            VAL-{customer?.phone || '9876543210'}
          </div>
        </div>

      </div>

      {/* 2. TIER ROADMAP */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="font-groovy font-black text-2xl text-[#7A1F1F]">
            Tier Progression &amp; Privilege Matrix
          </h4>
          <span className="text-xs font-mono font-bold text-[#7A1F1F]">
            Tier 3: Gold Active
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {tiers.map((tier, idx) => (
            <div
              key={idx}
              className={`p-5 rounded-3xl border-3 flex flex-col justify-between space-y-4 transition-all ${
                tier.isCurrent
                  ? 'bg-[#FAF6EA] border-[#7A1F1F] shadow-[6px_6px_0px_#7A1F1F] ring-3 ring-[#E5A93C]'
                  : 'bg-[#F2ECD8] border-[#7A1F1F] shadow-[4px_4px_0px_#7A1F1F]'
              }`}
            >
              <div>
                <div className="flex items-center justify-between pb-2 border-b-2 border-dashed border-[#7A1F1F]/30">
                  <span className="text-xs font-mono font-black text-[#7A1F1F] uppercase">
                    {tier.xpReq}
                  </span>
                  {tier.isCurrent && (
                    <span className="px-2 py-0.5 rounded-full bg-[#E5A93C] text-[#7A1F1F] text-[9px] font-groovy font-black uppercase">
                      CURRENT
                    </span>
                  )}
                </div>

                <div className="pt-3 space-y-2">
                  <h5 className="font-groovy font-black text-xl text-[#7A1F1F]">
                    {tier.name}
                  </h5>

                  <ul className="space-y-1.5 pt-1">
                    {tier.perks.map((perk, pIdx) => (
                      <li key={pIdx} className="text-xs text-[#7A1F1F]/80 flex items-start gap-1.5 font-medium">
                        <CheckCircle2 className={`w-3.5 h-3.5 shrink-0 mt-0.5 ${
                          tier.isCurrent ? 'text-[#7A1F1F] stroke-[3]' : 'text-[#7A1F1F]/50'
                        }`} />
                        <span>{perk}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="pt-3 border-t-2 border-dashed border-[#7A1F1F]/30 text-[10px] font-mono font-bold text-[#7A1F1F]">
                Level {tier.level} Status
              </div>
            </div>
          ))}
        </div>
      </div>

    </section>
  );
}
