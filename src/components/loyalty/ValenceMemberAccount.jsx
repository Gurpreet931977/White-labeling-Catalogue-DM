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
      perks: ['10% bonus XP on purchases', 'Secret daily treats reveal', 'Early access to seasonal drops'],
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
            <span className="text-[10px] font-mono tracking-widest text-[#FF4800] uppercase font-bold">
              MEMBER PROFILE
            </span>
            <span className="px-2.5 py-0.5 rounded-full bg-[#EAE0CE] text-[#6E5D4F] border border-[#DDD0BC] font-mono text-[9px] font-bold">
              IDENTITY & TIERS
            </span>
          </div>
          <h3 className="font-clash font-bold text-xl sm:text-2xl text-[#1C120C] mt-0.5">
            Account & Progression
          </h3>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onToggleSound}
            className="px-4 py-2 rounded-xl bg-white border border-[#E2D6C3] text-xs font-mono text-[#6E5D4F] hover:text-[#1C120C] flex items-center gap-2 cursor-pointer transition-colors shadow-xs"
          >
            {isSoundOn ? <Volume2 className="w-4 h-4 text-[#FF4800]" /> : <VolumeX className="w-4 h-4 text-[#A19183]" />}
            <span>Haptic Audio: {isSoundOn ? 'ON' : 'OFF'}</span>
          </button>
        </div>
      </div>

      {/* 1. MEMBER IDENTITY CARD & OPTICAL SCANNER PASS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Left 2 Cols: Member Profile Details */}
        <div className="md:col-span-2 p-6 sm:p-8 rounded-3xl bg-white border border-[#E2D6C3] shadow-md space-y-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-[#1C120C] text-[#FFFDF9] flex items-center justify-center font-clash font-black text-2xl shadow-md">
              {customer?.name ? customer.name.slice(0, 2).toUpperCase() : 'ME'}
            </div>
            <div>
              <div className="flex items-center gap-2.5">
                <h4 className="font-clash font-bold text-2xl text-[#1C120C]">
                  {customer?.name || 'Member'}
                </h4>
                <span className="px-2.5 py-0.5 rounded-full bg-[#FF4800]/15 text-[#FF4800] border border-[#FF4800]/30 text-[10px] font-mono font-black">
                  GOLD TIER
                </span>
              </div>
              <p className="text-xs font-mono text-[#76675B] mt-0.5">
                Member ID: VAL-{customer?.phone || '9876543210'}
              </p>
            </div>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 pt-2">
            <div className="p-4 rounded-2xl bg-[#F8F4EC] border border-[#E2D6C3]">
              <span className="text-[10px] font-mono text-[#76675B] uppercase font-bold block">Lifetime Visits</span>
              <span className="font-mono text-xl font-bold text-[#1C120C]">
                {customer?.billingHistory?.length || 4}
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-[#F8F4EC] border border-[#E2D6C3]">
              <span className="text-[10px] font-mono text-[#76675B] uppercase font-bold block">Current Streak</span>
              <span className="font-mono text-xl font-bold text-[#FF4800] flex items-center gap-1">
                <span>{customer?.streakDays || 5}d</span>
                <Flame className="w-4 h-4 fill-[#FF4800]" />
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-[#F8F4EC] border border-[#E2D6C3]">
              <span className="text-[10px] font-mono text-[#76675B] uppercase font-bold block">XP Progression</span>
              <span className="font-mono text-xl font-bold text-[#D97706]">
                {customer?.xp || 420} XP
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-[#F8F4EC] border border-[#E2D6C3]">
              <span className="text-[10px] font-mono text-[#76675B] uppercase font-bold block">Pass Cycle</span>
              <span className="font-mono text-xl font-bold text-[#FF4800]">
                {customer?.stamps || 4} / 6
              </span>
            </div>
          </div>

          {/* Security & Verification Guarantee */}
          <div className="p-4 rounded-2xl bg-[#F8F4EC] border border-[#E2D6C3] flex items-center gap-3 text-xs text-[#76675B]">
            <ShieldCheck className="w-5 h-5 text-[#FF4800] shrink-0" />
            <p className="font-sans">
              Verified digital membership pass. Purchases and stamps synchronize automatically via the store terminal register.
            </p>
          </div>
        </div>

        {/* Right 1 Col: Optical Barcode / QR Scanner Target */}
        <div className="p-6 rounded-3xl bg-white border border-[#E2D6C3] shadow-md flex flex-col items-center justify-between text-center space-y-4">
          <div className="space-y-1">
            <span className="text-[10px] font-mono uppercase font-bold text-[#FF4800] tracking-wider">
              SCANNER PASS
            </span>
            <h4 className="font-clash font-bold text-base text-[#1C120C]">
              Counter QR Code
            </h4>
            <p className="text-[11px] text-[#76675B]">
              Present to cashier scanner during checkout to associate bills and credit stamps.
            </p>
          </div>

          {/* High-Contrast Crisp QR Visual */}
          <div className="p-4 rounded-2xl bg-[#F8F4EC] border border-[#E2D6C3] shadow-inner inline-block">
            <svg viewBox="0 0 100 100" className="w-36 h-36">
              <rect x="5" y="5" width="28" height="28" rx="4" fill="#1C120C" />
              <rect x="9" y="9" width="20" height="20" rx="2" fill="#fff" />
              <rect x="13" y="13" width="12" height="12" fill="#1C120C" />

              <rect x="67" y="5" width="28" height="28" rx="4" fill="#1C120C" />
              <rect x="71" y="9" width="20" height="20" rx="2" fill="#fff" />
              <rect x="75" y="13" width="12" height="12" fill="#1C120C" />

              <rect x="5" y="67" width="28" height="28" rx="4" fill="#1C120C" />
              <rect x="9" y="71" width="20" height="20" rx="2" fill="#fff" />
              <rect x="13" y="75" width="12" height="12" fill="#1C120C" />

              <rect x="42" y="10" width="8" height="8" fill="#1C120C" />
              <rect x="42" y="25" width="8" height="15" fill="#1C120C" />
              <rect x="15" y="42" width="12" height="8" fill="#1C120C" />
              <rect x="40" y="45" width="16" height="16" rx="2" fill="#FF4800" />
              <rect x="65" y="42" width="10" height="10" fill="#1C120C" />
              <rect x="78" y="55" width="14" height="6" fill="#1C120C" />
              <rect x="45" y="68" width="8" height="18" fill="#1C120C" />
              <rect x="60" y="72" width="15" height="10" fill="#1C120C" />
              <rect x="80" y="80" width="12" height="12" fill="#1C120C" />
            </svg>
          </div>

          <div className="font-mono text-xs text-[#76675B] font-bold">
            VAL-{customer?.phone || '9876543210'}
          </div>
        </div>

      </div>

      {/* 2. TIER ROADMAP */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="font-clash font-bold text-lg text-[#1C120C]">
            Tier Progression & Privilege Matrix
          </h4>
          <span className="text-xs font-mono text-[#FF4800] font-bold">
            Tier 3: Gold Active
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {tiers.map((tier, idx) => (
            <div
              key={idx}
              className={`p-6 rounded-3xl border flex flex-col justify-between space-y-4 transition-all ${
                tier.isCurrent
                  ? 'bg-[#FFF9F6] border-2 border-[#FF4800] shadow-md ring-2 ring-[#FF4800]/15'
                  : 'bg-white border-[#E2D6C3]'
              }`}
            >
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-[#E2D6C3]">
                  <span className={`text-[10px] font-mono font-bold uppercase ${
                    tier.isCurrent ? 'text-[#FF4800]' : 'text-[#8C7D70]'
                  }`}>
                    {tier.xpReq}
                  </span>
                  {tier.isCurrent && (
                    <span className="px-2 py-0.5 rounded-md bg-[#FF4800]/15 text-[#FF4800] text-[8px] font-mono font-black">
                      CURRENT
                    </span>
                  )}
                </div>

                <div className="pt-3.5 space-y-2">
                  <h5 className="font-clash font-bold text-base text-[#1C120C]">
                    {tier.name}
                  </h5>

                  <ul className="space-y-1.5 pt-1">
                    {tier.perks.map((perk, pIdx) => (
                      <li key={pIdx} className="text-xs text-[#76675B] flex items-start gap-1.5">
                        <CheckCircle2 className={`w-3.5 h-3.5 shrink-0 mt-0.5 ${
                          tier.isCurrent ? 'text-[#FF4800]' : 'text-[#A19183]'
                        }`} />
                        <span>{perk}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="pt-3 border-t border-[#E2D6C3] text-[10px] font-mono text-[#8C7D70]">
                Level {tier.level} Status
              </div>
            </div>
          ))}
        </div>
      </div>

    </section>
  );
}
