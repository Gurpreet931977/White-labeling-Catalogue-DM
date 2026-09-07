import React from 'react';
import {
  Users,
  TrendingUp,
  Receipt,
  Zap,
  Flame,
  ArrowUpRight,
  ShieldCheck
} from 'lucide-react';
import { sounds } from '../../utils/audio';
import { CircularStampBadge } from './CircularStampBadge';

export function ValenceAdminOverview({ customers = [], config, onNavigateTab }) {
  const totalCustomers = customers.length;
  const totalStampsIssued = customers.reduce((sum, c) => sum + (c.stamps || 0), 0);
  
  let totalRevenue = 0;
  let totalTransactions = 0;
  customers.forEach((c) => {
    (c.billingHistory || []).forEach((b) => {
      totalRevenue += Number(b.amount) || 0;
      totalTransactions += 1;
    });
  });

  const kpis = [
    {
      title: 'Active Members',
      value: totalCustomers,
      unit: 'enrolled',
      change: '+14% this month',
      icon: Users
    },
    {
      title: 'Gross Billed Volume',
      value: `₹${totalRevenue.toLocaleString()}`,
      unit: `${totalTransactions} receipts`,
      change: '+22.4% vs last cycle',
      icon: Receipt
    },
    {
      title: 'Stamps In Circulation',
      value: totalStampsIssued,
      unit: `avg ${(totalStampsIssued / (totalCustomers || 1)).toFixed(1)} / member`,
      change: 'Active velocity',
      icon: Zap
    },
    {
      title: 'Streak Multipliers Active',
      value: customers.filter((c) => (c.streakDays || 0) >= (config?.streakBonusThreshold || 5)).length,
      unit: 'members earning 2X',
      change: '5-day streak threshold',
      icon: Flame
    }
  ];

  return (
    <div className="space-y-6">
      
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 pb-1">
        <div>
          <span className="text-xs font-mono font-bold tracking-widest text-[#7A1F1F] uppercase">
            EXECUTIVE CONSOLE • REAL-TIME AUDIT
          </span>
          <h3 className="font-groovy font-black text-3xl sm:text-4xl text-[#7A1F1F] tracking-wide mt-0.5 leading-none">
            Platform Overview &amp; Velocity
          </h3>
        </div>

        <button
          type="button"
          onClick={() => {
            sounds.playClick();
            if (onNavigateTab) onNavigateTab('pos');
          }}
          className="px-5 py-2.5 rounded-xl bg-[#7A1F1F] hover:bg-[#5C1414] text-[#F2ECD8] font-groovy font-black text-xs tracking-wider shadow-[4px_4px_0px_#470D0D] cursor-pointer transition-all flex items-center gap-2 uppercase"
        >
          <Receipt className="w-4 h-4" />
          <span>Launch POS Register</span>
        </button>
      </div>

      {/* 1. TOP KPI GRID (Deep Oxblood Cards with Massive Chunky Numbers) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi, idx) => {
          const Icon = kpi.icon;
          return (
            <div
              key={idx}
              className="p-5 rounded-3xl bg-[#7A1F1F] text-[#F2ECD8] border-3 border-[#5C1414] shadow-[6px_6px_0px_#5C1414] space-y-3"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-[#F2ECD8]/80 uppercase font-bold tracking-wider">
                  {kpi.title}
                </span>
                <div className="w-8 h-8 rounded-xl bg-[#5C1414] flex items-center justify-center text-[#E5A93C]">
                  <Icon className="w-4 h-4" />
                </div>
              </div>

              <div>
                {/* Massive Chunky Number at Poster Scale */}
                <div className="font-groovy font-black text-3xl sm:text-4xl text-[#E5A93C] tracking-wide leading-none">
                  {kpi.value}
                </div>
                <div className="text-[11px] font-mono text-[#F2ECD8]/80 mt-1 font-bold">
                  {kpi.unit}
                </div>
              </div>

              <div className="pt-2 border-t-2 border-[#5C1414] text-[11px] font-mono text-[#E5A93C] flex items-center gap-1 font-bold">
                <TrendingUp className="w-3.5 h-3.5" />
                <span>{kpi.change}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* 2. MEMBER CYCLE READINESS & ENGINE PARAMETERS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Cols: Member Cycle Readiness */}
        <div className="lg:col-span-2 p-6 sm:p-7 rounded-3xl bg-[#FAF6EA] border-3 border-[#7A1F1F] shadow-[8px_8px_0px_#7A1F1F] space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-groovy font-black text-2xl text-[#7A1F1F]">
                Member Cycle Readiness
              </h4>
              <p className="text-xs text-[#7A1F1F]/80 font-sans">
                Progress toward completing Slot #{config?.totalStamps || 6} milestone reward
              </p>
            </div>

            <button
              type="button"
              onClick={() => onNavigateTab && onNavigateTab('customers')}
              className="text-xs font-groovy font-bold text-[#7A1F1F] hover:underline flex items-center gap-1 cursor-pointer uppercase"
            >
              <span>View All Members</span>
              <ArrowUpRight className="w-3.5 h-3.5 stroke-[3]" />
            </button>
          </div>

          <div className="divide-y-2 divide-dashed divide-[#7A1F1F]/20">
            {customers.map((c) => {
              const currentStamps = c.stamps || 0;
              const totalStamps = config?.totalStamps || 6;
              const percent = Math.min(100, (currentStamps / totalStamps) * 100);
              const isMilestone = currentStamps >= totalStamps;
              const hasStreak = (c.streakDays || 0) >= (config?.streakBonusThreshold || 5);

              return (
                <div key={c.id} className="py-4 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3.5">
                    <div className="w-10 h-10 rounded-2xl bg-[#7A1F1F] text-[#E5A93C] flex items-center justify-center font-groovy font-black text-sm border-2 border-[#5C1414] shadow-sm">
                      {c.name.slice(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-groovy font-black text-base text-[#7A1F1F]">
                          {c.name}
                        </span>
                        {hasStreak && (
                          <span className="px-2 py-0.5 rounded-full bg-[#E5A93C] text-[#7A1F1F] text-[9px] font-groovy font-black flex items-center gap-0.5 uppercase">
                            <Flame className="w-2.5 h-2.5 fill-[#7A1F1F]" />
                            2X BOOST
                          </span>
                        )}
                      </div>
                      <span className="text-xs font-mono text-[#7A1F1F]/80 font-bold">
                        {c.phone} • {c.streakDays || 0}d streak
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 w-48">
                    <div className="flex-1 space-y-1">
                      <div className="flex justify-between text-xs font-mono font-bold">
                        <span className="text-[#7A1F1F]">{currentStamps} / {totalStamps}</span>
                        <span className={isMilestone ? 'text-[#7A1F1F] font-black' : 'text-[#7A1F1F]'}>
                          {Math.round(percent)}%
                        </span>
                      </div>
                      <div className="h-2.5 w-full rounded-full bg-[#E2D8BE] border border-[#7A1F1F] overflow-hidden">
                        <div
                          className={`h-full rounded-full ${
                            isMilestone ? 'bg-[#7A1F1F]' : 'bg-[#E5A93C]'
                          }`}
                          style={{ width: `${percent}%` }}
                        />
                      </div>
                    </div>

                    <span className={`text-[10px] font-groovy font-black shrink-0 uppercase ${
                      isMilestone ? 'text-[#7A1F1F]' : 'text-[#7A1F1F]/80'
                    }`}>
                      {isMilestone ? 'REWARD READY' : `${totalStamps - currentStamps} left`}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right 1 Col: Engine Rules */}
        <div className="p-6 sm:p-7 rounded-3xl bg-[#FAF6EA] border-3 border-[#7A1F1F] shadow-[8px_8px_0px_#7A1F1F] space-y-5 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-6 h-6 text-[#7A1F1F]" />
                <h4 className="font-groovy font-black text-xl text-[#7A1F1F]">
                  Engine Rules
                </h4>
              </div>

              <CircularStampBadge
                text="• VALENCE ENGINE • ACTIVE •"
                centerText="RULE"
                subText="V2"
                size={58}
                variant="oxblood"
              />
            </div>

            <div className="space-y-3 text-xs font-mono">
              <div className="p-3.5 rounded-2xl bg-[#F2ECD8] border-2 border-[#7A1F1F] space-y-1">
                <span className="text-[#7A1F1F]/80 block font-bold uppercase">CARD CAPACITY:</span>
                <div className="text-base font-groovy text-[#7A1F1F] font-black flex items-center justify-between">
                  <span>{config?.totalStamps || 6} Stamps Required</span>
                  <span className="text-xs text-[#7A1F1F]/70 font-mono">4-12 Slider</span>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-[#F2ECD8] border-2 border-[#7A1F1F] space-y-1">
                <span className="text-[#7A1F1F]/80 block font-bold uppercase">STREAK MULTIPLIER:</span>
                <div className="text-base font-groovy text-[#7A1F1F] font-black flex items-center justify-between">
                  <span>{config?.streakBonusThreshold || 5} Consecutive Visits</span>
                  <span className="text-xs text-[#7A1F1F] font-bold">+2 Stamps</span>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-[#F2ECD8] border-2 border-[#7A1F1F] space-y-1">
                <span className="text-[#7A1F1F]/80 block font-bold uppercase">STANDARD GST RATE:</span>
                <div className="text-base font-groovy text-[#7A1F1F] font-black flex items-center justify-between">
                  <span>5% (2.5% CGST + 2.5% SGST)</span>
                  <span className="text-xs text-[#7A1F1F] font-mono font-bold">Thermal</span>
                </div>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={() => onNavigateTab && onNavigateTab('settings')}
            className="w-full py-3 rounded-2xl bg-[#7A1F1F] hover:bg-[#5C1414] text-[#F2ECD8] font-groovy font-bold text-xs cursor-pointer transition-colors text-center uppercase shadow-[3px_3px_0px_#470D0D]"
          >
            Configure Rules &amp; Capacity
          </button>
        </div>

      </div>

    </div>
  );
}
