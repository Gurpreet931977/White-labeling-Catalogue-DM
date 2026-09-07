import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  Plus,
  Minus,
  RotateCcw,
  Gift,
  Flame,
  Receipt,
  User,
  CheckCircle2,
  Calendar,
  X,
  ShieldCheck,
  ChevronDown,
  Sparkles,
  Percent
} from 'lucide-react';
import { sounds } from '../../utils/audio';
import {
  LOYALTY_GIFTS_POOL,
  saveLoyaltyCustomer,
  resetCustomerCard
} from '../../utils/loyaltyStorage';

export function ValenceAdminCustomers({ customers = [], onUpdateCustomer, totalSlots = 6 }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCustHistory, setSelectedCustHistory] = useState(null);

  // Search Filter
  const filteredCustomers = customers.filter((c) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      c.name.toLowerCase().includes(q) ||
      c.phone.includes(q) ||
      c.id.toLowerCase().includes(q)
    );
  });

  // Adjust Stamps (+1 / -1)
  const handleAdjustStamps = (customer, delta) => {
    sounds.playStampSquish();
    const current = customer.stamps || 0;
    const nextStamps = Math.max(0, Math.min(totalSlots, current + delta));
    const updated = {
      ...customer,
      stamps: nextStamps,
      xp: Math.max(0, (customer.xp || 0) + (delta > 0 ? 50 : -50))
    };
    saveLoyaltyCustomer(updated);
    if (onUpdateCustomer) onUpdateCustomer(updated);
  };

  // Reset Card to 1 Stamp
  const handleResetCard = (customer) => {
    sounds.playClick();
    if (window.confirm(`Reset ${customer.name}'s card to 1 stamp?`)) {
      const updated = resetCustomerCard(customer.id);
      if (updated && onUpdateCustomer) onUpdateCustomer(updated);
    }
  };

  // Assign Custom Milestone Gift
  const handleAssignGift = (customer, giftId) => {
    sounds.playClick();
    const updated = {
      ...customer,
      assignedGiftId: giftId
    };
    saveLoyaltyCustomer(updated);
    if (onUpdateCustomer) onUpdateCustomer(updated);
  };

  return (
    <div className="space-y-6">
      
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 pb-1">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono tracking-widest text-[#3B82F6] uppercase font-bold">
              MEMBERSHIP DIRECTORY
            </span>
            <span className="px-2 py-0.5 rounded-full bg-[#1A1C24] text-[#8E91A0] border border-[#2B2E3D] font-mono text-[9px] font-bold">
              CUSTOMER AUDIT
            </span>
          </div>
          <h3 className="font-clash font-bold text-xl sm:text-2xl text-[#F4F4F6] mt-0.5">
            Customer Directory & Controls
          </h3>
        </div>

        {/* Search Input */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-[#8E91A0] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search members by name or phone..."
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-[#121318] border border-[#222533] text-xs text-[#F4F4F6] placeholder-[#545768] focus:outline-none focus:border-[#3B82F6] transition-colors"
          />
        </div>
      </div>

      {/* CUSTOMERS LIST / TABLE */}
      <div className="rounded-3xl bg-[#121318] border border-[#222533] p-5 sm:p-6 shadow-xl space-y-4">
        <div className="divide-y divide-[#1D1F2B]">
          {filteredCustomers.map((c) => {
            const currentStamps = c.stamps || 0;
            const hasStreak = (c.streakDays || 0) >= 5;
            const activeGift = LOYALTY_GIFTS_POOL.find((g) => g.id === c.assignedGiftId) || LOYALTY_GIFTS_POOL[0];

            return (
              <div
                key={c.id}
                className="py-4 first:pt-0 last:pb-0 flex flex-col lg:flex-row lg:items-center justify-between gap-4 group"
              >
                {/* Left: Member Identity */}
                <div className="flex items-start gap-3.5 min-w-[220px]">
                  <div className="w-10 h-10 rounded-2xl bg-[#1A1C24] border border-[#2B2E3D] flex items-center justify-center font-clash font-bold text-sm text-[#F4F4F6] shrink-0">
                    {c.name.slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-clash font-bold text-base text-[#F4F4F6]">
                        {c.name}
                      </span>
                      {hasStreak && (
                        <span className="px-1.5 py-0.2 rounded-full bg-[#F97316]/15 text-[#F97316] font-mono text-[9px] font-bold flex items-center gap-1">
                          <Flame className="w-2.5 h-2.5 fill-[#F97316]" />
                          5D STREAK (2X)
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-[10px] font-mono text-[#8E91A0] mt-0.5">
                      <span>{c.phone}</span>
                      <span>•</span>
                      <span>{c.xp || 420} XP</span>
                      <span>•</span>
                      <span>{c.streakDays || 0}d streak</span>
                    </div>
                  </div>
                </div>

                {/* Middle: Stamp Visual Track & In-line Adjuster */}
                <div className="flex items-center gap-4">
                  <div className="space-y-1 w-32 sm:w-40">
                    <div className="flex justify-between text-[10px] font-mono">
                      <span className="text-[#8E91A0]">Card Progress</span>
                      <span className="text-[#3B82F6] font-bold">
                        {currentStamps} / {totalSlots}
                      </span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-[#0E0F14] overflow-hidden p-0.5 border border-[#222533]">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-[#2563EB] to-[#3B82F6]"
                        style={{ width: `${Math.min(100, (currentStamps / totalSlots) * 100)}%` }}
                      />
                    </div>
                  </div>

                  {/* +/- buttons */}
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      title="Deduct 1 stamp"
                      onClick={() => handleAdjustStamps(c, -1)}
                      className="w-7 h-7 rounded-lg bg-[#1A1C24] hover:bg-[#252836] border border-[#2B2E3D] text-[#8E91A0] hover:text-[#F4F4F6] flex items-center justify-center cursor-pointer transition-colors"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <button
                      type="button"
                      title="Add 1 stamp"
                      onClick={() => handleAdjustStamps(c, 1)}
                      className="w-7 h-7 rounded-lg bg-[#2563EB] hover:bg-[#1D4ED8] text-white flex items-center justify-center cursor-pointer transition-colors"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                    <button
                      type="button"
                      title="Reset Card"
                      onClick={() => handleResetCard(c)}
                      className="w-7 h-7 rounded-lg bg-[#1A1C24] hover:bg-[#252836] border border-[#2B2E3D] text-[#8E91A0] hover:text-[#EF4444] flex items-center justify-center cursor-pointer transition-colors"
                    >
                      <RotateCcw className="w-3 h-3" />
                    </button>
                  </div>
                </div>

                {/* Right: Milestone Reward Selector & History Button */}
                <div className="flex flex-wrap items-center gap-3">
                  <div className="space-y-0.5">
                    <span className="text-[9px] font-mono text-[#8E91A0] block uppercase">
                      Assigned Milestone Gift:
                    </span>
                    <select
                      value={c.assignedGiftId || 'discount50'}
                      onChange={(e) => handleAssignGift(c, e.target.value)}
                      className="px-2.5 py-1.5 rounded-xl bg-[#0E0F14] border border-[#222533] text-xs font-mono text-[#F59E0B] focus:outline-none focus:border-[#F59E0B] cursor-pointer"
                    >
                      {LOYALTY_GIFTS_POOL.map((g) => (
                        <option key={g.id} value={g.id} className="bg-[#121318] text-[#F4F4F6]">
                          {g.title}
                        </option>
                      ))}
                    </select>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      sounds.playClick();
                      setSelectedCustHistory(c);
                    }}
                    className="px-3 py-1.5 rounded-xl bg-[#1A1C24] hover:bg-[#252836] border border-[#2B2E3D] text-xs font-mono text-[#8E91A0] hover:text-[#F4F4F6] flex items-center gap-1.5 cursor-pointer transition-colors self-end"
                  >
                    <Receipt className="w-3.5 h-3.5" />
                    <span>Audit Bills ({c.billingHistory?.length || 0})</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* CUSTOMER BILLING AUDIT MODAL */}
      <AnimatePresence>
        {selectedCustHistory && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative w-full max-w-lg rounded-3xl bg-[#121318] border border-[#2B2E3D] shadow-2xl p-6 sm:p-7 space-y-5 overflow-hidden"
            >
              <button
                type="button"
                onClick={() => setSelectedCustHistory(null)}
                className="absolute top-5 right-5 w-8 h-8 rounded-full bg-[#1A1C24] border border-[#2B2E3D] flex items-center justify-center text-[#8E91A0] hover:text-[#F4F4F6] cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>

              <div>
                <span className="text-[10px] font-mono tracking-widest text-[#3B82F6] uppercase font-bold">
                  MEMBER AUDIT TRAIL
                </span>
                <h4 className="font-clash font-bold text-2xl text-[#F4F4F6]">
                  {selectedCustHistory.name}
                </h4>
                <p className="text-xs font-mono text-[#8E91A0]">
                  Phone: {selectedCustHistory.phone} • Total Bills: {selectedCustHistory.billingHistory?.length || 0}
                </p>
              </div>

              <div className="space-y-2 max-h-80 overflow-y-auto pr-1 divide-y divide-[#1D1F2B]">
                {(selectedCustHistory.billingHistory || []).length === 0 ? (
                  <p className="text-xs font-mono text-[#545768] py-8 text-center">
                    No billing history on record for this customer.
                  </p>
                ) : (
                  selectedCustHistory.billingHistory.map((b) => (
                    <div key={b.id} className="py-3 first:pt-0 last:pb-0 flex items-center justify-between text-xs font-mono">
                      <div>
                        <span className="font-bold text-[#F4F4F6]">{b.id}</span>
                        <p className="text-[11px] text-[#8E91A0] font-sans">{b.items}</p>
                        <span className="text-[10px] text-[#545768]">{b.date} • {b.time}</span>
                      </div>
                      <div className="text-right">
                        <span className="font-bold text-[#F4F4F6] block">₹{b.amount}</span>
                        <span className="text-[10px] text-[#3B82F6]">+{b.stampsAwarded} stamp</span>
                      </div>
                    </div>
                  ))
                )}
              </div>

              <button
                type="button"
                onClick={() => setSelectedCustHistory(null)}
                className="w-full py-2.5 rounded-xl bg-[#1A1C24] hover:bg-[#252836] text-xs font-mono text-[#F4F4F6] cursor-pointer"
              >
                Close Audit
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
