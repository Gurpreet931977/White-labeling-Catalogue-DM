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
    <div className="space-y-8">
      
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-1">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono tracking-widest text-[#FF4800] uppercase font-bold">
              MEMBERSHIP DIRECTORY
            </span>
            <span className="px-2.5 py-0.5 rounded-full bg-[#EAE0CE] text-[#6E5D4F] border border-[#DDD0BC] font-mono text-[9px] font-bold">
              CUSTOMER AUDIT
            </span>
          </div>
          <h3 className="font-clash font-bold text-2xl sm:text-3xl text-[#1C120C] mt-1">
            Customer Directory &amp; Controls
          </h3>
        </div>

        {/* Search Input */}
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-[#8C7D70] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search members by name or phone..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white border border-[#E2D6C3] text-xs text-[#1C120C] placeholder-[#A19183] focus:outline-none focus:border-[#FF4800] transition-colors"
          />
        </div>
      </div>

      {/* CUSTOMERS LIST / TABLE (WIDE EXPANSIVE) */}
      <div className="rounded-3xl bg-white border border-[#E2D6C3] p-6 sm:p-8 shadow-md space-y-4">
        <div className="divide-y divide-[#EAE0CE]">
          {filteredCustomers.map((c) => {
            const currentStamps = c.stamps || 0;
            const hasStreak = (c.streakDays || 0) >= 5;
            const activeGift = LOYALTY_GIFTS_POOL.find((g) => g.id === c.assignedGiftId) || LOYALTY_GIFTS_POOL[0];

            return (
              <div
                key={c.id}
                className="py-5 first:pt-0 last:pb-0 flex flex-col lg:flex-row lg:items-center justify-between gap-5 group"
              >
                {/* Left: Member Identity */}
                <div className="flex items-start gap-4 min-w-[260px]">
                  <div className="w-12 h-12 rounded-2xl bg-[#1C120C] text-white flex items-center justify-center font-clash font-bold text-base shrink-0 shadow-sm">
                    {c.name.slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-clash font-bold text-lg text-[#1C120C]">
                        {c.name}
                      </span>
                      {hasStreak && (
                        <span className="px-2 py-0.5 rounded-full bg-[#FF4800]/15 text-[#FF4800] font-mono text-[9px] font-bold flex items-center gap-1">
                          <Flame className="w-2.5 h-2.5 fill-[#FF4800]" />
                          5D STREAK (2X)
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-[11px] font-mono text-[#76675B] mt-0.5">
                      <span>{c.phone}</span>
                      <span>•</span>
                      <span>{c.xp || 420} XP</span>
                      <span>•</span>
                      <span>{c.streakDays || 0}d streak</span>
                    </div>
                  </div>
                </div>

                {/* Middle: Stamp Visual Track & In-line Adjuster */}
                <div className="flex items-center gap-5">
                  <div className="space-y-1.5 w-40 sm:w-48">
                    <div className="flex justify-between text-[11px] font-mono font-bold">
                      <span className="text-[#76675B]">Card Progress</span>
                      <span className="text-[#FF4800]">
                        {currentStamps} / {totalSlots}
                      </span>
                    </div>
                    <div className="h-2.5 w-full rounded-full bg-[#EFE7D8] overflow-hidden p-0.5 border border-[#DDD1BE]">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-[#FF4800] to-[#F59E0B]"
                        style={{ width: `${Math.min(100, (currentStamps / totalSlots) * 100)}%` }}
                      />
                    </div>
                  </div>

                  {/* +/- buttons */}
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      title="Deduct 1 stamp"
                      onClick={() => handleAdjustStamps(c, -1)}
                      className="w-8 h-8 rounded-xl bg-[#F8F4EC] hover:bg-[#EAE0CE] border border-[#E2D6C3] text-[#1C120C] flex items-center justify-center cursor-pointer transition-colors"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      title="Add 1 stamp"
                      onClick={() => handleAdjustStamps(c, 1)}
                      className="w-8 h-8 rounded-xl bg-[#FF4800] hover:bg-[#E03F00] text-white flex items-center justify-center cursor-pointer transition-colors shadow-sm shadow-[#FF4800]/25"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      title="Reset Card"
                      onClick={() => handleResetCard(c)}
                      className="w-8 h-8 rounded-xl bg-[#F8F4EC] hover:bg-[#EAE0CE] border border-[#E2D6C3] text-[#8C7D70] hover:text-[#EF4444] flex items-center justify-center cursor-pointer transition-colors"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Right: Milestone Reward Selector & History Button */}
                <div className="flex flex-wrap items-center gap-3.5">
                  <div className="space-y-0.5">
                    <span className="text-[9px] font-mono text-[#76675B] block uppercase font-bold">
                      Assigned Milestone Gift:
                    </span>
                    <select
                      value={c.assignedGiftId || 'discount50'}
                      onChange={(e) => handleAssignGift(c, e.target.value)}
                      className="px-3 py-2 rounded-xl bg-[#F8F4EC] border border-[#E2D6C3] text-xs font-mono font-bold text-[#D97706] focus:outline-none focus:border-[#FF4800] cursor-pointer"
                    >
                      {LOYALTY_GIFTS_POOL.map((g) => (
                        <option key={g.id} value={g.id} className="bg-white text-[#1C120C]">
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
                    className="px-4 py-2 rounded-xl bg-[#F8F4EC] hover:bg-[#1C120C] hover:text-white border border-[#E2D6C3] text-xs font-mono font-bold text-[#1C120C] flex items-center gap-1.5 cursor-pointer transition-colors self-end"
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
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1C120C]/80 backdrop-blur-md">
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative w-full max-w-lg rounded-3xl bg-white border border-[#E2D6C3] shadow-2xl p-6 sm:p-8 space-y-5 overflow-hidden"
            >
              <button
                type="button"
                onClick={() => setSelectedCustHistory(null)}
                className="absolute top-5 right-5 w-8 h-8 rounded-full bg-[#F7F2E7] border border-[#E2D6C3] flex items-center justify-center text-[#76675B] hover:text-[#1C120C] cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>

              <div>
                <span className="text-[10px] font-mono tracking-widest text-[#FF4800] uppercase font-bold">
                  MEMBER AUDIT TRAIL
                </span>
                <h4 className="font-clash font-bold text-2xl text-[#1C120C]">
                  {selectedCustHistory.name}
                </h4>
                <p className="text-xs font-mono text-[#76675B]">
                  Phone: {selectedCustHistory.phone} • Total Bills: {selectedCustHistory.billingHistory?.length || 0}
                </p>
              </div>

              <div className="space-y-2.5 max-h-80 overflow-y-auto pr-1 divide-y divide-[#EAE0CE]">
                {(selectedCustHistory.billingHistory || []).length === 0 ? (
                  <p className="text-xs font-mono text-[#A19183] py-8 text-center">
                    No billing history on record for this customer.
                  </p>
                ) : (
                  selectedCustHistory.billingHistory.map((b) => (
                    <div key={b.id} className="py-3 first:pt-0 last:pb-0 flex items-center justify-between text-xs font-mono">
                      <div>
                        <span className="font-bold text-[#1C120C]">{b.id}</span>
                        <p className="text-[11px] text-[#76675B] font-sans">{b.items}</p>
                        <span className="text-[10px] text-[#A19183]">{b.date} • {b.time}</span>
                      </div>
                      <div className="text-right">
                        <span className="font-bold text-[#1C120C] block">₹{b.amount}</span>
                        <span className="text-[10px] text-[#FF4800] font-bold">+{b.stampsAwarded} stamp</span>
                      </div>
                    </div>
                  ))
                )}
              </div>

              <button
                type="button"
                onClick={() => setSelectedCustHistory(null)}
                className="w-full py-3 rounded-xl bg-[#F7F2E7] hover:bg-[#EAE0CE] text-xs font-mono font-bold text-[#1C120C] cursor-pointer"
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
