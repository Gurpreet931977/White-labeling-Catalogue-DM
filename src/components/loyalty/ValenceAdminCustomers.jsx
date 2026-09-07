import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  Plus,
  Minus,
  RotateCcw,
  Receipt,
  Flame,
  X
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

  const filteredCustomers = customers.filter((c) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      c.name.toLowerCase().includes(q) ||
      c.phone.includes(q) ||
      c.id.toLowerCase().includes(q)
    );
  });

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

  const handleResetCard = (customer) => {
    sounds.playClick();
    if (window.confirm(`Reset ${customer.name}'s card to 1 stamp?`)) {
      const updated = resetCustomerCard(customer.id);
      if (updated && onUpdateCustomer) onUpdateCustomer(updated);
    }
  };

  const handleAssignGift = (customer, giftId) => {
    sounds.playClick();
    const updated = {
      ...customer,
      assignedGiftId: giftId
    };
    saveLoyaltyCustomer(updated);
    if (onUpdateCustomer) onUpdateCustomer(updated);
  };

  const handleToggleAdmin = (customer) => {
    sounds.playClick();
    const updated = {
      ...customer,
      isAdmin: !customer.isAdmin
    };
    saveLoyaltyCustomer(updated);
    if (onUpdateCustomer) onUpdateCustomer(updated);
  };

  return (
    <div className="space-y-6">
      
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 pb-1">
        <div>
          <span className="text-xs font-mono font-bold tracking-widest text-[#7A1F1F] uppercase">
            DIRECTORY AUDIT • INLINE CONTROLS
          </span>
          <h3 className="font-groovy font-black text-3xl sm:text-4xl text-[#7A1F1F] tracking-wide mt-0.5 leading-none">
            Customer Directory &amp; Controls
          </h3>
        </div>

        {/* Search Input */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-[#7A1F1F] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name or phone..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#FAF6EA] border-2 border-[#7A1F1F] text-xs font-mono text-[#7A1F1F] placeholder-[#7A1F1F]/60 focus:outline-none focus:bg-white shadow-[3px_3px_0px_#7A1F1F]"
          />
        </div>
      </div>

      {/* CUSTOMERS LIST CONTAINER */}
      <div className="rounded-3xl bg-[#FAF6EA] border-3 border-[#7A1F1F] p-6 shadow-[8px_8px_0px_#7A1F1F] space-y-4">
        <div className="divide-y-2 divide-dashed divide-[#7A1F1F]/20">
          {filteredCustomers.map((c) => {
            const currentStamps = c.stamps || 0;
            const hasStreak = (c.streakDays || 0) >= 5;

            return (
              <div
                key={c.id}
                className="py-4 first:pt-0 last:pb-0 flex flex-col lg:flex-row lg:items-center justify-between gap-4 group"
              >
                {/* Left: Member Identity */}
                <div className="flex items-start gap-3.5 min-w-[220px]">
                  <div className="w-11 h-11 rounded-2xl bg-[#7A1F1F] text-[#E5A93C] border-2 border-[#5C1414] flex items-center justify-center font-groovy font-black text-base shadow-sm shrink-0">
                    {c.name.slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-groovy font-black text-lg text-[#7A1F1F]">
                        {c.name}
                      </span>
                      {c.isAdmin ? (
                        <span className="px-2 py-0.5 rounded-full bg-[#7A1F1F] text-[#F2ECD8] font-mono text-[9px] font-bold uppercase tracking-wider border border-[#5C1414]">
                          ADMIN
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-full bg-[#E2D8BE] text-[#7A1F1F] font-mono text-[9px] font-bold uppercase tracking-wider">
                          MEMBER
                        </span>
                      )}
                      {hasStreak && (
                        <span className="px-2 py-0.5 rounded-full bg-[#E5A93C] text-[#7A1F1F] font-groovy text-[9px] font-black flex items-center gap-1 uppercase">
                          <Flame className="w-2.5 h-2.5 fill-[#7A1F1F]" />
                          5D STREAK (2X)
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-xs font-mono text-[#7A1F1F]/80 mt-0.5 font-bold">
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
                  <div className="space-y-1 w-32 sm:w-44">
                    <div className="flex justify-between text-xs font-mono font-bold text-[#7A1F1F]">
                      <span>Card Progress</span>
                      <span className="font-groovy text-sm">
                        {currentStamps} / {totalSlots}
                      </span>
                    </div>
                    <div className="h-3 w-full rounded-full bg-[#E2D8BE] border border-[#7A1F1F] overflow-hidden p-0.5">
                      <div
                        className="h-full rounded-full bg-[#E5A93C]"
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
                      className="w-8 h-8 rounded-xl bg-[#F2ECD8] hover:bg-white border-2 border-[#7A1F1F] text-[#7A1F1F] flex items-center justify-center cursor-pointer transition-colors shadow-xs font-bold"
                    >
                      <Minus className="w-3.5 h-3.5 stroke-[3]" />
                    </button>
                    <button
                      type="button"
                      title="Add 1 stamp"
                      onClick={() => handleAdjustStamps(c, 1)}
                      className="w-8 h-8 rounded-xl bg-[#7A1F1F] hover:bg-[#5C1414] text-[#E5A93C] flex items-center justify-center cursor-pointer transition-colors shadow-xs font-bold"
                    >
                      <Plus className="w-3.5 h-3.5 stroke-[3]" />
                    </button>
                    <button
                      type="button"
                      title="Reset Card"
                      onClick={() => handleResetCard(c)}
                      className="w-8 h-8 rounded-xl bg-[#F2ECD8] hover:bg-white border-2 border-[#7A1F1F] text-[#7A1F1F] flex items-center justify-center cursor-pointer transition-colors shadow-xs"
                    >
                      <RotateCcw className="w-3.5 h-3.5 stroke-[2.5]" />
                    </button>
                  </div>
                </div>

                {/* Right: Milestone Reward Selector, Role Toggle & History Button */}
                <div className="flex flex-wrap items-center gap-3">
                  <div className="space-y-0.5">
                    <span className="text-[10px] font-mono text-[#7A1F1F] block uppercase font-bold">
                      Milestone Reward:
                    </span>
                    <select
                      value={c.assignedGiftId || 'discount50'}
                      onChange={(e) => handleAssignGift(c, e.target.value)}
                      className="px-3 py-1.5 rounded-xl bg-[#F2ECD8] border-2 border-[#7A1F1F] text-xs font-groovy text-[#7A1F1F] focus:outline-none cursor-pointer"
                    >
                      {LOYALTY_GIFTS_POOL.map((g) => (
                        <option key={g.id} value={g.id}>
                          {g.title}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Toggle Admin Privilege */}
                  <button
                    type="button"
                    title={c.isAdmin ? 'Revoke admin console access' : 'Grant admin console access'}
                    onClick={() => handleToggleAdmin(c)}
                    className={`px-3 py-2 rounded-xl text-xs font-mono font-bold uppercase cursor-pointer transition-all self-end border-2 ${
                      c.isAdmin
                        ? 'bg-[#FAF6EA] text-[#7A1F1F] border-[#7A1F1F] hover:bg-white shadow-[2px_2px_0px_#7A1F1F]'
                        : 'bg-[#E2D8BE] text-[#7A1F1F]/70 border-[#7A1F1F]/30 hover:border-[#7A1F1F] hover:text-[#7A1F1F]'
                    }`}
                  >
                    {c.isAdmin ? 'Role: Admin' : 'Role: Member'}
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      sounds.playClick();
                      setSelectedCustHistory(c);
                    }}
                    className="px-3.5 py-2 rounded-xl bg-[#7A1F1F] hover:bg-[#5C1414] text-[#F2ECD8] text-xs font-groovy font-bold flex items-center gap-1.5 cursor-pointer transition-colors self-end shadow-[3px_3px_0px_#470D0D] uppercase"
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
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative w-full max-w-lg rounded-3xl bg-[#FAF6EA] border-3 border-[#7A1F1F] shadow-[12px_12px_0px_#7A1F1F] p-6 sm:p-8 space-y-5 overflow-hidden font-mono"
            >
              <button
                type="button"
                onClick={() => setSelectedCustHistory(null)}
                className="absolute top-5 right-5 w-8 h-8 rounded-full bg-[#7A1F1F] text-[#F2ECD8] flex items-center justify-center hover:bg-[#5C1414] cursor-pointer"
              >
                <X className="w-4 h-4 stroke-[3]" />
              </button>

              <div>
                <span className="text-xs font-mono tracking-widest text-[#7A1F1F] uppercase font-bold">
                  MEMBER AUDIT TRAIL
                </span>
                <h4 className="font-groovy font-black text-3xl text-[#7A1F1F]">
                  {selectedCustHistory.name}
                </h4>
                <p className="text-xs text-[#7A1F1F]/80">
                  Phone: {selectedCustHistory.phone} • Bills: {selectedCustHistory.billingHistory?.length || 0}
                </p>
              </div>

              <div className="space-y-2 max-h-80 overflow-y-auto pr-1 divide-y-2 divide-dashed divide-[#7A1F1F]/20">
                {(selectedCustHistory.billingHistory || []).length === 0 ? (
                  <p className="text-xs text-[#7A1F1F]/70 py-8 text-center font-bold">
                    No billing history on record for this customer.
                  </p>
                ) : (
                  selectedCustHistory.billingHistory.map((b) => (
                    <div key={b.id} className="py-3 first:pt-0 last:pb-0 flex items-center justify-between text-xs">
                      <div>
                        <span className="font-bold text-[#7A1F1F]">{b.id}</span>
                        <p className="text-[11px] text-[#7A1F1F]/80 font-sans">{b.items}</p>
                        <span className="text-[10px] text-[#7A1F1F]/60">{b.date} • {b.time}</span>
                      </div>
                      <div className="text-right">
                        <span className="font-groovy text-base text-[#7A1F1F] block leading-none">₹{b.amount}</span>
                        <span className="text-[10px] text-[#7A1F1F] font-bold">+{b.stampsAwarded} stamp</span>
                      </div>
                    </div>
                  ))
                )}
              </div>

              <button
                type="button"
                onClick={() => setSelectedCustHistory(null)}
                className="w-full py-3 rounded-xl bg-[#7A1F1F] hover:bg-[#5C1414] text-xs font-groovy font-bold text-[#F2ECD8] cursor-pointer uppercase shadow-[3px_3px_0px_#470D0D]"
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
