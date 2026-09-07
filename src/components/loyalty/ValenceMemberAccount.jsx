import React from 'react';
import {
  ShieldCheck,
  Flame,
  CheckCircle2,
  Volume2,
  VolumeX,
  QrCode,
  Award,
  Zap,
  ArrowRight
} from 'lucide-react';
import { sounds } from '../../utils/audio';
import { CircularStampBadge } from './CircularStampBadge';

export function ValenceMemberAccount({ customer, isSoundOn, onToggleSound }) {
  const currentXP = customer?.xp || 420;

  const tiers = [
    {
      name: 'Bronze Member',
      xpReq: '0 - 200 XP',
      level: 1,
      perks: ['Standard 1x stamp accrual', 'Digital membership wallet pass', 'Archival status record'],
      isActive: currentXP <= 200,
      isCurrent: currentXP <= 200
    },
    {
      name: 'Silver Member',
      xpReq: '201 - 400 XP',
      level: 2,
      perks: ['10% bonus XP on purchases', 'Secret daily treats reveal', 'Early access to seasonal drops'],
      isActive: currentXP > 200 && currentXP <= 400,
      isCurrent: currentXP > 200 && currentXP <= 400
    },
    {
      name: 'Gold Member',
      xpReq: '401 - 700 XP',
      level: 3,
      perks: ['5-day streak double stamp acceleration', '50% milestone reward unlock access', 'Priority counter service'],
      isActive: currentXP > 400 && currentXP <= 700,
      isCurrent: currentXP > 400 && currentXP <= 700
    },
    {
      name: 'Diamond Member',
      xpReq: '701+ XP',
      level: 4,
      perks: ['Permanent 2x XP booster', 'Custom concierge assistance', 'Exclusive limited VIP gift box every cycle'],
      isActive: currentXP > 700,
      isCurrent: currentXP > 700
    }
  ];

  return (
    <section className="relative space-y-6 pt-4">
      
      {/* SECTION HEADER */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b-3 border-[#1F1614] pb-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded bg-[#1F1614] text-[#E5A93C] font-mono text-[9px] font-black uppercase tracking-widest">
              SECTION 05 // DOSSIER
            </span>
            <span className="font-mono text-xs font-bold text-[#7A1F1F]/70 uppercase tracking-wider">
              MEMBER CREDENTIALS &amp; PROGRESSION
            </span>
          </div>

          <h3 className="font-groovy font-black text-4xl sm:text-6xl text-[#7A1F1F] tracking-tight leading-[0.9]">
            MEMBER DOSSIER
          </h3>
        </div>

        {/* Audio Toggle */}
        <button
          type="button"
          onClick={onToggleSound}
          className="px-4 py-2.5 rounded-2xl bg-[#FAF6EA] border-3 border-[#1F1614] text-xs font-mono font-black text-[#1F1614] hover:bg-white flex items-center gap-2 cursor-pointer transition-all shadow-[3px_3px_0px_#1F1614] uppercase self-start md:self-auto"
        >
          {isSoundOn ? <Volume2 className="w-4 h-4 text-[#7A1F1F]" /> : <VolumeX className="w-4 h-4 text-[#1F1614]/40" />}
          <span>AUDIO FEEDBACK: {isSoundOn ? 'ENABLED' : 'MUTED'}</span>
        </button>
      </div>

      {/* 1. EDITORIAL IDENTITY BANNER */}
      <div className="relative rounded-3xl bg-[#FAF6EA] border-3 border-[#1F1614] p-6 sm:p-8 shadow-[8px_8px_0px_#1F1614] overflow-hidden">
        
        {/* Halftone texture */}
        <div className="absolute inset-0 bg-halftone-dots opacity-10 pointer-events-none" />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          
          <div className="flex items-center gap-5">
            <div className="w-20 h-20 rounded-3xl bg-[#7A1F1F] text-[#E5A93C] flex items-center justify-center font-groovy font-black text-3xl border-3 border-[#1F1614] shadow-[4px_4px_0px_#1F1614] shrink-0">
              {customer?.name ? customer.name.slice(0, 2).toUpperCase() : 'MC'}
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h4 className="font-groovy font-black text-3xl sm:text-4xl text-[#7A1F1F] leading-none">
                  {customer?.name || 'Maya Chen'}
                </h4>
                <span className="px-2.5 py-0.5 rounded-md bg-[#E5A93C] text-[#1F1614] font-groovy text-xs font-black uppercase tracking-wider">
                  GOLD TIER
                </span>
              </div>

              <div className="flex items-center gap-3 text-xs font-mono font-bold text-[#1F1614]/80 flex-wrap">
                <span>ID: VAL-{customer?.phone || '9876543210'}</span>
                <span>•</span>
                <span>TOTAL XP: {customer?.xp || 420}</span>
                <span>•</span>
                <span>STREAK: {customer?.streakDays || 5} DAYS</span>
              </div>
            </div>
          </div>

          <div className="shrink-0 -rotate-3 hover:rotate-0 transition-transform">
            <CircularStampBadge
              text="• VALENCE DOSSIER • LEVEL 3 •"
              centerText="GOLD"
              subText="CADRE"
              size={88}
              variant="oxblood"
            />
          </div>

        </div>
      </div>

      {/* 2. BRUTALIST PROGRESSION MATRIX (Step Ladder) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between font-mono text-xs font-bold text-[#7A1F1F]">
          <span className="uppercase tracking-widest">TIER ARCHITECTURE // 4 PROGRESSION CADRES</span>
          <span>CURRENT CADRE: GOLD</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {tiers.map((t, idx) => {
            return (
              <div
                key={t.name}
                className={`relative rounded-3xl p-5 border-3 border-[#1F1614] transition-all flex flex-col justify-between space-y-4 ${
                  t.isCurrent
                    ? 'bg-[#7A1F1F] text-[#F2ECD8] shadow-[6px_6px_0px_#1F1614]'
                    : 'bg-[#FAF6EA] text-[#1F1614] shadow-[4px_4px_0px_#1F1614]'
                }`}
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-black opacity-60">
                      CADRE 0{t.level}
                    </span>
                    {t.isCurrent ? (
                      <span className="px-2 py-0.5 rounded bg-[#E5A93C] text-[#1F1614] font-mono text-[9px] font-black uppercase tracking-wider">
                        ACTIVE NOW
                      </span>
                    ) : (
                      <span className="font-mono text-[9px] uppercase opacity-50">
                        {t.xpReq}
                      </span>
                    )}
                  </div>

                  <h5 className="font-groovy font-black text-xl tracking-wide">
                    {t.name}
                  </h5>

                  <div className="font-mono text-xs font-bold opacity-80">
                    {t.xpReq}
                  </div>
                </div>

                <div className="border-t-2 border-dashed border-current/20 pt-3 space-y-1.5 font-mono text-[11px]">
                  {t.perks.map((p, pIdx) => (
                    <div key={pIdx} className="flex items-start gap-1.5 opacity-90">
                      <span className="text-[#E5A93C] font-black">+</span>
                      <span>{p}</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </section>
  );
}
