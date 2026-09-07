import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  User,
  QrCode,
  ShieldCheck,
  Flame,
  Award,
  Sparkles,
  CheckCircle2,
  Lock,
  Volume2,
  VolumeX,
  Phone,
  Calendar,
  CreditCard,
  ChevronRight,
  Zap,
  Star
} from 'lucide-react';
import { sounds } from '../../utils/audio';

export function ValenceMemberAccount({ customer, isSoundOn, onToggleSound }) {
  const [showFullQr, setShowFullQr] = useState(false);

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
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono tracking-widest text-[#3B82F6] uppercase font-bold">
              MEMBER PROFILE
            </span>
            <span className="px-2 py-0.5 rounded-full bg-[#1A1C24] text-[#8E91A0] border border-[#2B2E3D] font-mono text-[9px] font-bold">
              IDENTITY & TIERS
            </span>
          </div>
          <h3 className="font-clash font-bold text-xl sm:text-2xl text-[#F4F4F6] mt-0.5">
            Account & Progression
          </h3>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onToggleSound}
            className="px-3.5 py-1.5 rounded-xl bg-[#121318] border border-[#222533] text-xs font-mono text-[#8E91A0] hover:text-[#F4F4F6] flex items-center gap-2 cursor-pointer transition-colors"
          >
            {isSoundOn ? <Volume2 className="w-3.5 h-3.5 text-[#10B981]" /> : <VolumeX className="w-3.5 h-3.5 text-[#EF4444]" />}
            <span>Haptic Audio: {isSoundOn ? 'ON' : 'OFF'}</span>
          </button>
        </div>
      </div>

      {/* 1. MEMBER IDENTITY CARD & OPTICAL SCANNER PASS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Left 2 Cols: Member Profile Details */}
        <div className="md:col-span-2 p-6 sm:p-7 rounded-3xl bg-[#121318] border border-[#222533] shadow-xl space-y-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#2563EB] to-[#1D4ED8] text-white flex items-center justify-center font-clash font-bold text-2xl shadow-lg shadow-[#2563EB]/25">
              {customer?.name ? customer.name.slice(0, 2).toUpperCase() : 'ME'}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="font-clash font-bold text-2xl text-[#F4F4F6]">
                  {customer?.name || 'Member'}
                </h4>
                <span className="px-2.5 py-0.5 rounded-full bg-[#F59E0B]/15 text-[#F59E0B] border border-[#F59E0B]/30 text-[10px] font-mono font-bold">
                  GOLD TIER
                </span>
              </div>
              <p className="text-xs font-mono text-[#8E91A0] mt-0.5">
                Member ID: VAL-{customer?.phone || '9876543210'}
              </p>
            </div>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
            <div className="p-3.5 rounded-2xl bg-[#0E0F14] border border-[#222533]">
              <span className="text-[10px] font-mono text-[#8E91A0] uppercase block">Lifetime Visits</span>
              <span className="font-mono text-lg font-bold text-[#F4F4F6]">
                {customer?.billingHistory?.length || 4}
              </span>
            </div>

            <div className="p-3.5 rounded-2xl bg-[#0E0F14] border border-[#222533]">
              <span className="text-[10px] font-mono text-[#8E91A0] uppercase block">Current Streak</span>
              <span className="font-mono text-lg font-bold text-[#F97316] flex items-center gap-1">
                <span>{customer?.streakDays || 5}d</span>
                <Flame className="w-3.5 h-3.5 fill-[#F97316]" />
              </span>
            </div>

            <div className="p-3.5 rounded-2xl bg-[#0E0F14] border border-[#222533]">
              <span className="text-[10px] font-mono text-[#8E91A0] uppercase block">XP Progression</span>
              <span className="font-mono text-lg font-bold text-[#F59E0B]">
                {customer?.xp || 420} XP
              </span>
            </div>

            <div className="p-3.5 rounded-2xl bg-[#0E0F14] border border-[#222533]">
              <span className="text-[10px] font-mono text-[#8E91A0] uppercase block">Pass Cycle</span>
              <span className="font-mono text-lg font-bold text-[#3B82F6]">
                {customer?.stamps || 4} / 6
              </span>
            </div>
          </div>

          {/* Security & Verification Guarantee */}
          <div className="p-4 rounded-2xl bg-[#171922] border border-[#2B2E3D] flex items-center gap-3 text-xs text-[#8E91A0]">
            <ShieldCheck className="w-5 h-5 text-[#3B82F6] shrink-0" />
            <p className="font-sans">
              Cryptographically verified account. Purchases and stamps are synchronized automatically via the terminal POS.
            </p>
          </div>
        </div>

        {/* Right 1 Col: Optical Barcode / QR Scanner Target */}
        <div className="p-6 rounded-3xl bg-[#121318] border border-[#222533] shadow-xl flex flex-col items-center justify-between text-center space-y-4">
          <div className="space-y-1">
            <span className="text-[10px] font-mono uppercase font-bold text-[#3B82F6] tracking-wider">
              SCANNER PASS
            </span>
            <h4 className="font-clash font-bold text-base text-[#F4F4F6]">
              Counter QR Code
            </h4>
            <p className="text-[11px] text-[#8E91A0]">
              Hold up to scanner during checkout to associate bills and record stamps.
            </p>
          </div>

          {/* High-Contrast Crisp QR Visual */}
          <div className="p-4 rounded-2xl bg-white shadow-md border border-gray-300 inline-block">
            <svg viewBox="0 0 100 100" className="w-36 h-36">
              {/* Corner 1 */}
              <rect x="5" y="5" width="28" height="28" rx="4" fill="#000" />
              <rect x="9" y="9" width="20" height="20" rx="2" fill="#fff" />
              <rect x="13" y="13" width="12" height="12" fill="#000" />

              {/* Corner 2 */}
              <rect x="67" y="5" width="28" height="28" rx="4" fill="#000" />
              <rect x="71" y="9" width="20" height="20" rx="2" fill="#fff" />
              <rect x="75" y="13" width="12" height="12" fill="#000" />

              {/* Corner 3 */}
              <rect x="5" y="67" width="28" height="28" rx="4" fill="#000" />
              <rect x="9" y="71" width="20" height="20" rx="2" fill="#fff" />
              <rect x="13" y="75" width="12" height="12" fill="#000" />

              {/* Center matrix dots */}
              <rect x="42" y="10" width="8" height="8" fill="#000" />
              <rect x="42" y="25" width="8" height="15" fill="#000" />
              <rect x="15" y="42" width="12" height="8" fill="#000" />
              <rect x="40" y="45" width="16" height="16" rx="2" fill="#2563EB" />
              <rect x="65" y="42" width="10" height="10" fill="#000" />
              <rect x="78" y="55" width="14" height="6" fill="#000" />
              <rect x="45" y="68" width="8" height="18" fill="#000" />
              <rect x="60" y="72" width="15" height="10" fill="#000" />
              <rect x="80" y="80" width="12" height="12" fill="#000" />
            </svg>
          </div>

          <div className="font-mono text-xs text-[#8E91A0]">
            VAL-{customer?.phone || '9876543210'}
          </div>
        </div>

      </div>

      {/* 2. TIER ROADMAP */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="font-clash font-bold text-lg text-[#F4F4F6]">
            Tier Progression & Privilege Matrix
          </h4>
          <span className="text-xs font-mono text-[#8E91A0]">
            Tier 3: Gold Active
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {tiers.map((tier, idx) => (
            <div
              key={idx}
              className={`p-5 rounded-3xl border flex flex-col justify-between space-y-4 transition-all ${
                tier.isCurrent
                  ? 'bg-gradient-to-b from-[#1C1A14] to-[#121318] border-[#F59E0B]/50 shadow-lg ring-1 ring-[#F59E0B]/30'
                  : 'bg-[#121318] border-[#222533]'
              }`}
            >
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-[#222533]">
                  <span className={`text-[10px] font-mono font-bold uppercase ${
                    tier.isCurrent ? 'text-[#F59E0B]' : 'text-[#8E91A0]'
                  }`}>
                    {tier.xpReq}
                  </span>
                  {tier.isCurrent && (
                    <span className="px-2 py-0.5 rounded-full bg-[#F59E0B]/20 text-[#F59E0B] text-[8px] font-mono font-bold">
                      CURRENT
                    </span>
                  )}
                </div>

                <div className="pt-3 space-y-2">
                  <h5 className="font-clash font-bold text-base text-[#F4F4F6]">
                    {tier.name}
                  </h5>

                  <ul className="space-y-1.5 pt-1">
                    {tier.perks.map((perk, pIdx) => (
                      <li key={pIdx} className="text-xs text-[#8E91A0] flex items-start gap-1.5">
                        <CheckCircle2 className={`w-3.5 h-3.5 shrink-0 mt-0.5 ${
                          tier.isCurrent ? 'text-[#F59E0B]' : 'text-[#545768]'
                        }`} />
                        <span>{perk}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="pt-3 border-t border-[#222533] text-[10px] font-mono text-[#545768]">
                Level {tier.level} Status
              </div>
            </div>
          ))}
        </div>
      </div>

    </section>
  );
}
