import React from 'react';
import { motion } from 'framer-motion';
import {
  Users,
  TrendingUp,
  Award,
  Zap,
  Flame,
  ArrowUpRight,
  ShieldCheck,
  Receipt,
  CreditCard,
  CheckCircle2,
  Clock,
  Sparkles
} from 'lucide-react';
import { sounds } from '../../utils/audio';

export function ValenceAdminOverview({ customers = [], config, onNavigateTab }) {
  // Aggregate Metrics
  const totalCustomers = customers.length;
  const totalStampsIssued = customers.reduce((sum, c) => sum + (c.stamps || 0), 0);
  const totalStreakDays = customers.reduce((sum, c) => sum + (c.streakDays || 0), 0);
  
  let totalRevenue = 0;
  let totalTransactions = 0;
  customers.forEach((c) => {
    (c.billingHistory || []).forEach((b) => {
      totalRevenue += Number(b.amount) || 0;
      totalTransactions += 1;
    });
  });

  const milestoneReadyCount = customers.filter(
    (c) => (c.stamps || 0) >= (config?.totalStamps || 6)
  ).length;

  const kpis = [
    {
      title: 'Active Members',
      value: totalCustomers,
      unit: 'enrolled accounts',
      change: '+14% this month',
      icon: Users,
      color: 'text-[#1C120C]'
    },
    {
      title: 'Gross Billed Volume',
      value: `₹${totalRevenue.toLocaleString()}`,
      unit: `${totalTransactions} receipts`,
      change: '+22.4% vs last cycle',
      icon: Receipt,
      color: 'text-[#047857]'
    },
    {
      title: 'Stamps In Circulation',
      value: totalStampsIssued,
      unit: `avg ${(totalStampsIssued / (totalCustomers || 1)).toFixed(1)} / member`,
      change: 'Active velocity',
      icon: Zap,
      color: 'text-[#FF4800]'
    },
    {
      title: 'Streak Multipliers Active',
      value: customers.filter((c) => (c.streakDays || 0) >= (config?.streakBonusThreshold || 5)).length,
      unit: 'members earning 2X',
      change: '5-day streak threshold',
      icon: Flame,
      color: 'text-[#FF4800]'
    }
  ];

  return (
    <div className="space-y-8">
      
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-1">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono tracking-widest text-[#FF4800] uppercase font-bold">
              EXECUTIVE CONSOLE
            </span>
            <span className="px-2.5 py-0.5 rounded-full bg-[#EAE0CE] text-[#6E5D4F] border border-[#DDD0BC] font-mono text-[9px] font-bold">
              REAL-TIME ANALYTICS
            </span>
          </div>
          <h3 className="font-clash font-bold text-2xl sm:text-3xl text-[#1C120C] mt-1">
            Platform Overview &amp; Velocity
          </h3>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => {
              sounds.playClick();
              if (onNavigateTab) onNavigateTab('pos');
            }}
            className="px-6 py-3 rounded-2xl bg-[#FF4800] hover:bg-[#E03F00] text-white font-sans font-bold text-xs tracking-wide shadow-lg shadow-[#FF4800]/25 cursor-pointer transition-all flex items-center gap-2"
          >
            <Receipt className="w-4 h-4" />
            <span>Launch POS Register</span>
          </button>
        </div>
      </div>

      {/* 1. TOP KPI GRID (EXPANSIVE 4-COLUMN) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {kpis.map((kpi, idx) => {
          const Icon = kpi.icon;
          return (
            <div
              key={idx}
              className="p-6 rounded-3xl bg-white border border-[#E2D6C3] shadow-md space-y-4"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-[#76675B] uppercase font-bold">
                  {kpi.title}
                </span>
                <div className={`w-9 h-9 rounded-xl bg-[#F7F2E7] border border-[#E2D6C3] flex items-center justify-center ${kpi.color}`}>
                  <Icon className="w-4 h-4" />
                </div>
              </div>

              <div>
                <div className="font-clash font-bold text-3xl sm:text-4xl text-[#1C120C] tracking-tight">
                  {kpi.value}
                </div>
                <div className="text-xs font-mono text-[#8C7D70] mt-1 font-semibold">
                  {kpi.unit}
                </div>
              </div>

              <div className="pt-3 border-t border-[#EAE0CE] text-[10px] font-mono text-[#047857] font-bold flex items-center gap-1">
                <TrendingUp className="w-3 h-3" />
                <span>{kpi.change}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* 2. MEMBER ENGAGEMENT & MILESTONE READINESS */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left 8 Cols: Member Readiness Table */}
        <div className="lg:col-span-8 p-6 sm:p-8 rounded-3xl bg-white border border-[#E2D6C3] shadow-md space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-clash font-bold text-xl text-[#1C120C]">
                Member Cycle Readiness
              </h4>
              <p className="text-xs text-[#76675B] font-mono mt-0.5">
                Current progress toward Slot #{config?.totalStamps || 6} milestone reward
              </p>
            </div>

            <button
              type="button"
              onClick={() => onNavigateTab && onNavigateTab('customers')}
              className="text-xs font-mono text-[#FF4800] font-bold hover:underline flex items-center gap-1 cursor-pointer"
            >
              <span>View All Members</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="divide-y divide-[#EAE0CE]">
            {customers.map((c) => {
              const currentStamps = c.stamps || 0;
              const totalStamps = config?.totalStamps || 6;
              const percent = Math.min(100, (currentStamps / totalStamps) * 100);
              const isMilestone = currentStamps >= totalStamps;
              const hasStreak = (c.streakDays || 0) >= (config?.streakBonusThreshold || 5);

              return (
                <div key={c.id} className="py-4.5 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3.5">
                    <div className="w-11 h-11 rounded-2xl bg-[#1C120C] text-[#FFFDF9] flex items-center justify-center font-clash font-bold text-sm shrink-0">
                      {c.name.slice(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-sm font-bold text-[#1C120C]">
                          {c.name}
                        </span>
                        {hasStreak && (
                          <span className="px-2 py-0.5 rounded-full bg-[#FF4800]/15 text-[#FF4800] text-[9px] font-mono font-bold flex items-center gap-1">
                            <Flame className="w-2.5 h-2.5 fill-[#FF4800]" />
                            2X BOOST
                          </span>
                        )}
                      </div>
                      <span className="text-[11px] font-mono text-[#76675B]">
                        {c.phone} • {c.streakDays || 0}d streak
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 w-52 sm:w-60">
                    <div className="flex-1 space-y-1.5">
                      <div className="flex justify-between text-[11px] font-mono">
                        <span className="text-[#76675B] font-bold">{currentStamps} / {totalStamps}</span>
                        <span className={isMilestone ? 'text-[#047857] font-black' : 'text-[#FF4800] font-bold'}>
                          {Math.round(percent)}%
                        </span>
                      </div>
                      <div className="h-2 w-full rounded-full bg-[#EFE7D8] overflow-hidden">
                        <div
                          className={`h-full rounded-full ${
                            isMilestone
                              ? 'bg-[#047857]'
                              : 'bg-gradient-to-r from-[#FF4800] to-[#F59E0B]'
                          }`}
                          style={{ width: `${percent}%` }}
                        />
                      </div>
                    </div>

                    <span className={`text-[10px] font-mono font-black shrink-0 ${
                      isMilestone ? 'text-[#047857]' : 'text-[#8C7D70]'
                    }`}>
                      {isMilestone ? 'REWARD READY' : `${totalStamps - currentStamps} left`}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right 4 Cols: Quick Rules & Speed-Up Summary */}
        <div className="lg:col-span-4 p-6 sm:p-8 rounded-3xl bg-white border border-[#E2D6C3] shadow-md space-y-6 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-[#FF4800]" />
              <h4 className="font-clash font-bold text-lg text-[#1C120C]">
                Loyalty Engine Parameters
              </h4>
            </div>

            <div className="space-y-3.5 text-xs font-mono">
              <div className="p-4 rounded-2xl bg-[#F8F4EC] border border-[#E2D6C3] space-y-1">
                <span className="text-[#76675B] uppercase font-bold block">CARD CYCLE CAPACITY:</span>
                <div className="text-sm font-bold text-[#1C120C] flex items-center justify-between">
                  <span>{config?.totalStamps || 6} Stamps Required</span>
                  <span className="text-[10px] text-[#FF4800] font-bold">Adjustable 4-12</span>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-[#F8F4EC] border border-[#E2D6C3] space-y-1">
                <span className="text-[#76675B] uppercase font-bold block">STREAK MULTIPLIER RULE:</span>
                <div className="text-sm font-bold text-[#FF4800] flex items-center justify-between">
                  <span>{config?.streakBonusThreshold || 5} Consecutive Days</span>
                  <span className="text-[10px] text-[#FF4800] font-bold">+2 Stamps / Bill</span>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-[#F8F4EC] border border-[#E2D6C3] space-y-1">
                <span className="text-[#76675B] uppercase font-bold block">STANDARD GST RATE:</span>
                <div className="text-sm font-bold text-[#047857] flex items-center justify-between">
                  <span>5% (2.5% CGST + 2.5% SGST)</span>
                  <span className="text-[10px] text-[#047857] font-bold">Thermal Docket</span>
                </div>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={() => onNavigateTab && onNavigateTab('settings')}
            className="w-full py-3 rounded-2xl bg-[#F7F2E7] hover:bg-[#1C120C] hover:text-white border border-[#E2D6C3] text-xs font-mono font-bold text-[#1C120C] cursor-pointer transition-colors text-center"
          >
            Configure Rules &amp; Settings
          </button>
        </div>

      </div>

    </div>
  );
}
