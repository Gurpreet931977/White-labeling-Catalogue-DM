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
      unit: 'enrolled',
      change: '+14% this month',
      icon: Users,
      color: 'text-[#3B82F6]'
    },
    {
      title: 'Gross Billed Volume',
      value: `₹${totalRevenue.toLocaleString()}`,
      unit: `${totalTransactions} receipts`,
      change: '+22.4% vs last cycle',
      icon: Receipt,
      color: 'text-[#10B981]'
    },
    {
      title: 'Stamps In Circulation',
      value: totalStampsIssued,
      unit: `avg ${(totalStampsIssued / (totalCustomers || 1)).toFixed(1)} / member`,
      change: 'Active velocity',
      icon: Zap,
      color: 'text-[#F59E0B]'
    },
    {
      title: 'Streak Multipliers Active',
      value: customers.filter((c) => (c.streakDays || 0) >= (config?.streakBonusThreshold || 5)).length,
      unit: 'members earning 2X',
      change: '5-day streak threshold',
      icon: Flame,
      color: 'text-[#F97316]'
    }
  ];

  return (
    <div className="space-y-6">
      
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 pb-1">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono tracking-widest text-[#3B82F6] uppercase font-bold">
              EXECUTIVE CONSOLE
            </span>
            <span className="px-2 py-0.5 rounded-full bg-[#1A1C24] text-[#8E91A0] border border-[#2B2E3D] font-mono text-[9px] font-bold">
              REAL-TIME ANALYTICS
            </span>
          </div>
          <h3 className="font-clash font-bold text-xl sm:text-2xl text-[#F4F4F6] mt-0.5">
            Platform Overview & Velocity
          </h3>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => {
              sounds.playClick();
              if (onNavigateTab) onNavigateTab('pos');
            }}
            className="px-4 py-2 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-sans font-semibold text-xs tracking-wide shadow-md shadow-[#2563EB]/25 cursor-pointer transition-all flex items-center gap-2"
          >
            <Receipt className="w-3.5 h-3.5" />
            <span>Launch POS Register</span>
          </button>
        </div>
      </div>

      {/* 1. TOP KPI GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi, idx) => {
          const Icon = kpi.icon;
          return (
            <div
              key={idx}
              className="p-5 rounded-3xl bg-[#121318] border border-[#222533] shadow-lg space-y-3"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-[#8E91A0] uppercase font-medium">
                  {kpi.title}
                </span>
                <div className={`w-8 h-8 rounded-xl bg-[#1A1C24] border border-[#2B2E3D] flex items-center justify-center ${kpi.color}`}>
                  <Icon className="w-4 h-4" />
                </div>
              </div>

              <div>
                <div className="font-clash font-bold text-2xl sm:text-3xl text-[#F4F4F6] tracking-tight">
                  {kpi.value}
                </div>
                <div className="text-[11px] font-mono text-[#8E91A0] mt-0.5">
                  {kpi.unit}
                </div>
              </div>

              <div className="pt-2 border-t border-[#1D1F2B] text-[10px] font-mono text-[#10B981] flex items-center gap-1">
                <TrendingUp className="w-3 h-3" />
                <span>{kpi.change}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* 2. MEMBER ENGAGEMENT & MILESTONE READINESS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Cols: Member Readiness Table */}
        <div className="lg:col-span-2 p-6 rounded-3xl bg-[#121318] border border-[#222533] shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-clash font-bold text-lg text-[#F4F4F6]">
                Member Cycle Readiness
              </h4>
              <p className="text-xs text-[#8E91A0] font-mono">
                Current progress toward Slot #{config?.totalStamps || 6} milestone reward
              </p>
            </div>

            <button
              type="button"
              onClick={() => onNavigateTab && onNavigateTab('customers')}
              className="text-xs font-mono text-[#3B82F6] hover:underline flex items-center gap-1 cursor-pointer"
            >
              <span>View All Members</span>
              <ArrowUpRight className="w-3 h-3" />
            </button>
          </div>

          <div className="divide-y divide-[#1D1F2B]">
            {customers.map((c) => {
              const currentStamps = c.stamps || 0;
              const totalStamps = config?.totalStamps || 6;
              const percent = Math.min(100, (currentStamps / totalStamps) * 100);
              const isMilestone = currentStamps >= totalStamps;
              const hasStreak = (c.streakDays || 0) >= (config?.streakBonusThreshold || 5);

              return (
                <div key={c.id} className="py-3.5 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-[#1A1C24] border border-[#2A2D3C] flex items-center justify-center font-clash font-bold text-sm text-[#F4F4F6]">
                      {c.name.slice(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-[#F4F4F6]">
                          {c.name}
                        </span>
                        {hasStreak && (
                          <span className="px-1.5 py-0.2 rounded bg-[#F97316]/15 text-[#F97316] text-[9px] font-mono font-bold flex items-center gap-0.5">
                            <Flame className="w-2.5 h-2.5 fill-[#F97316]" />
                            2X BOOST
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] font-mono text-[#8E91A0]">
                        {c.phone} • {c.streakDays || 0}d streak
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 w-44">
                    <div className="flex-1 space-y-1">
                      <div className="flex justify-between text-[10px] font-mono">
                        <span className="text-[#8E91A0]">{currentStamps} / {totalStamps}</span>
                        <span className={isMilestone ? 'text-[#10B981] font-bold' : 'text-[#3B82F6]'}>
                          {Math.round(percent)}%
                        </span>
                      </div>
                      <div className="h-1.5 w-full rounded-full bg-[#0D0E13] overflow-hidden">
                        <div
                          className={`h-full rounded-full ${
                            isMilestone
                              ? 'bg-[#10B981]'
                              : 'bg-gradient-to-r from-[#2563EB] to-[#3B82F6]'
                          }`}
                          style={{ width: `${percent}%` }}
                        />
                      </div>
                    </div>

                    <span className={`text-[10px] font-mono font-bold shrink-0 ${
                      isMilestone ? 'text-[#10B981]' : 'text-[#8E91A0]'
                    }`}>
                      {isMilestone ? 'REWARD READY' : `${totalStamps - currentStamps} left`}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right 1 Col: Quick Rules & Speed-Up Summary */}
        <div className="p-6 rounded-3xl bg-[#121318] border border-[#222533] shadow-xl space-y-5 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-[#3B82F6]" />
              <h4 className="font-clash font-bold text-base text-[#F4F4F6]">
                Loyalty Engine Parameters
              </h4>
            </div>

            <div className="space-y-3 text-xs font-mono">
              <div className="p-3 rounded-2xl bg-[#0E0F14] border border-[#222533] space-y-1">
                <span className="text-[#8E91A0] block">CARD CYCLE CAPACITY:</span>
                <div className="text-sm font-bold text-[#F4F4F6] flex items-center justify-between">
                  <span>{config?.totalStamps || 6} Stamps Required</span>
                  <span className="text-[10px] text-[#3B82F6]">Adjustable 4-12</span>
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-[#0E0F14] border border-[#222533] space-y-1">
                <span className="text-[#8E91A0] block">STREAK MULTIPLIER RULE:</span>
                <div className="text-sm font-bold text-[#F97316] flex items-center justify-between">
                  <span>{config?.streakBonusThreshold || 5} Consecutive Days</span>
                  <span className="text-[10px] text-[#F97316]">+2 Stamps / Bill</span>
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-[#0E0F14] border border-[#222533] space-y-1">
                <span className="text-[#8E91A0] block">STANDARD GST RATE:</span>
                <div className="text-sm font-bold text-[#10B981] flex items-center justify-between">
                  <span>5% (2.5% CGST + 2.5% SGST)</span>
                  <span className="text-[10px] text-[#10B981]">Thermal Docket</span>
                </div>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={() => onNavigateTab && onNavigateTab('settings')}
            className="w-full py-2.5 rounded-xl bg-[#1A1C24] hover:bg-[#252836] border border-[#2B2E3D] text-xs font-mono text-[#F4F4F6] cursor-pointer transition-colors text-center"
          >
            Configure Rules & Settings
          </button>
        </div>

      </div>

    </div>
  );
}
