import React, { useState } from 'react';
import {
  Sliders,
  UserPlus,
  Flame,
  Check,
  Save,
  CheckCircle2,
  Info
} from 'lucide-react';
import { sounds } from '../../utils/audio';
import {
  saveLoyaltyAdminConfig,
  saveLoyaltyCustomer,
  LOYALTY_GIFTS_POOL
} from '../../utils/loyaltyStorage';

export function ValenceAdminSettings({ config, onUpdateConfig, onNewCustomerCreated }) {
  const [totalStamps, setTotalStamps] = useState(config?.totalStamps || 6);
  const [streakThreshold, setStreakThreshold] = useState(config?.streakBonusThreshold || 5);
  const [isSaved, setIsSaved] = useState(false);

  // New Customer Enrollment State
  const [newName, setNewName] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newStamps, setNewStamps] = useState(1);
  const [newGiftId, setNewGiftId] = useState('discount50');
  const [enrollSuccess, setEnrollSuccess] = useState(false);

  const handleSaveConfig = () => {
    sounds.playOrderPlaced();
    const updated = saveLoyaltyAdminConfig({
      totalStamps: Number(totalStamps),
      streakBonusThreshold: Number(streakThreshold)
    });
    if (onUpdateConfig) onUpdateConfig(updated);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2500);
  };

  const handleEnrollCustomer = (e) => {
    e.preventDefault();
    if (!newName.trim() || !newPhone.trim()) return;

    sounds.playStampSquish();
    const newCustomer = {
      id: `cust-${Date.now()}`,
      name: newName.trim(),
      phone: newPhone.replace(/\D/g, ''),
      stamps: Number(newStamps),
      streakDays: 1,
      xp: 100,
      assignedGiftId: newGiftId,
      billingHistory: [],
      redeemedVouchers: []
    };

    saveLoyaltyCustomer(newCustomer);
    if (onNewCustomerCreated) onNewCustomerCreated(newCustomer);

    setNewName('');
    setNewPhone('');
    setEnrollSuccess(true);
    setTimeout(() => setEnrollSuccess(false), 3000);
  };

  return (
    <div className="space-y-6">
      
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 pb-1">
        <div>
          <span className="text-xs font-mono font-bold tracking-widest text-[#7A1F1F] uppercase">
            GLOBAL ENGINE CONFIGURATION
          </span>
          <h3 className="font-groovy font-black text-3xl sm:text-4xl text-[#7A1F1F] tracking-wide mt-0.5 leading-none">
            Loyalty Engine Settings
          </h3>
        </div>

        <button
          type="button"
          onClick={handleSaveConfig}
          className="px-6 py-3 rounded-2xl bg-[#7A1F1F] hover:bg-[#5C1414] text-[#F2ECD8] font-groovy font-black text-xs tracking-wider shadow-[4px_4px_0px_#470D0D] cursor-pointer transition-all flex items-center gap-2 uppercase"
        >
          {isSaved ? <Check className="w-4 h-4 stroke-[3]" /> : <Save className="w-4 h-4 stroke-[2.5]" />}
          <span>{isSaved ? 'Settings Applied!' : 'Save System Rules'}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* LEFT COLUMN (7 Cols): STAMP CAPACITY & STREAK RULES */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* 1. Dynamic Stamp Capacity Slider (4 to 12) */}
          <div className="p-6 sm:p-8 rounded-3xl bg-[#FAF6EA] border-3 border-[#7A1F1F] shadow-[8px_8px_0px_#7A1F1F] space-y-5">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-xs font-mono uppercase font-black text-[#7A1F1F] tracking-wider">
                  CARD PARAMETERS
                </span>
                <h4 className="font-groovy font-black text-2xl text-[#7A1F1F]">
                  Cycle Stamp Capacity
                </h4>
                <p className="text-xs text-[#7A1F1F]/80 font-sans">
                  Configure how many stamps a member must collect to complete a card and unlock the milestone reward.
                </p>
              </div>

              <div className="w-16 h-16 rounded-2xl bg-[#7A1F1F] text-[#E5A93C] border-2 border-[#5C1414] flex flex-col items-center justify-center text-center shadow-sm shrink-0">
                <span className="font-groovy font-black text-3xl leading-none">
                  {totalStamps}
                </span>
                <span className="text-[8px] font-mono uppercase font-bold text-[#F2ECD8]">
                  SLOTS
                </span>
              </div>
            </div>

            {/* Slider */}
            <div className="space-y-2 pt-2">
              <input
                type="range"
                min="4"
                max="12"
                step="1"
                value={totalStamps}
                onChange={(e) => {
                  sounds.playClick();
                  setTotalStamps(Number(e.target.value));
                }}
                className="w-full accent-[#7A1F1F] cursor-pointer"
              />

              <div className="flex justify-between text-xs font-mono font-bold text-[#7A1F1F]">
                <span>4 Stamps (Fast)</span>
                <span className="font-groovy text-sm text-[#7A1F1F]">6 Stamps (Default)</span>
                <span>12 Stamps (Long)</span>
              </div>
            </div>

            {/* Live slot layout preview */}
            <div className="p-4 rounded-2xl bg-[#F2ECD8] border-2 border-[#7A1F1F] space-y-2">
              <span className="text-[10px] font-mono text-[#7A1F1F] block uppercase font-bold">
                Dynamic Slot Preview ({totalStamps} slots):
              </span>
              <div className="grid grid-cols-6 gap-2">
                {Array.from({ length: totalStamps }, (_, i) => i + 1).map((slot) => (
                  <div
                    key={slot}
                    className={`h-9 rounded-xl border-2 text-xs font-groovy flex items-center justify-center font-bold ${
                      slot === totalStamps
                        ? 'border-[#7A1F1F] bg-[#E5A93C] text-[#7A1F1F]'
                        : 'border-[#7A1F1F] bg-[#FAF6EA] text-[#7A1F1F]'
                    }`}
                  >
                    #{slot}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* 2. Streak Speed-Up Rule Configuration */}
          <div className="p-6 sm:p-8 rounded-3xl bg-[#FAF6EA] border-3 border-[#7A1F1F] shadow-[8px_8px_0px_#7A1F1F] space-y-4">
            <div>
              <span className="text-xs font-mono uppercase font-black text-[#7A1F1F] tracking-wider">
                RETENTION RULES
              </span>
              <h4 className="font-groovy font-black text-2xl text-[#7A1F1F]">
                Streak Acceleration Threshold
              </h4>
              <p className="text-xs text-[#7A1F1F]/80 font-sans">
                When consecutive daily visits equal or exceed this threshold, each billing automatically marks +2 stamps instead of 1.
              </p>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex-1 space-y-1">
                <input
                  type="range"
                  min="3"
                  max="10"
                  step="1"
                  value={streakThreshold}
                  onChange={(e) => {
                    sounds.playClick();
                    setStreakThreshold(Number(e.target.value));
                  }}
                  className="w-full accent-[#7A1F1F] cursor-pointer"
                />
                <div className="flex justify-between text-xs font-mono font-bold text-[#7A1F1F]">
                  <span>3 Days</span>
                  <span className="font-groovy text-sm">5 Days (Standard)</span>
                  <span>10 Days</span>
                </div>
              </div>

              <div className="px-5 py-2.5 rounded-2xl bg-[#7A1F1F] text-[#F2ECD8] border-2 border-[#5C1414] text-center shrink-0 shadow-sm">
                <span className="font-groovy font-black text-2xl text-[#E5A93C] block leading-none">
                  {streakThreshold}d
                </span>
                <span className="text-[8px] font-mono text-[#F2ECD8] uppercase font-bold">
                  2X BONUS
                </span>
              </div>
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN (5 Cols): NEW MEMBER ENROLLMENT */}
        <div className="lg:col-span-5 space-y-6">
          
          <form
            onSubmit={handleEnrollCustomer}
            className="p-6 sm:p-8 rounded-3xl bg-[#FAF6EA] border-3 border-[#7A1F1F] shadow-[8px_8px_0px_#7A1F1F] space-y-4"
          >
            <div className="flex items-center gap-2">
              <UserPlus className="w-6 h-6 text-[#7A1F1F]" />
              <h4 className="font-groovy font-black text-2xl text-[#7A1F1F]">
                Enroll New Member
              </h4>
            </div>

            <p className="text-xs text-[#7A1F1F]/80 font-sans">
              Issue a new digital member pass directly at the terminal register.
            </p>

            <div className="space-y-3 pt-1">
              <div>
                <label className="text-[10px] font-mono uppercase text-[#7A1F1F] block pb-1 font-bold">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="e.g. Alex Rivera"
                  className="w-full px-4 py-2.5 rounded-xl bg-[#F2ECD8] border-2 border-[#7A1F1F] text-xs font-mono text-[#7A1F1F] focus:outline-none focus:bg-white"
                />
              </div>

              <div>
                <label className="text-[10px] font-mono uppercase text-[#7A1F1F] block pb-1 font-bold">
                  Phone Number (Primary Member ID)
                </label>
                <input
                  type="tel"
                  required
                  value={newPhone}
                  onChange={(e) => setNewPhone(e.target.value)}
                  placeholder="e.g. 9812345678"
                  className="w-full px-4 py-2.5 rounded-xl bg-[#F2ECD8] border-2 border-[#7A1F1F] text-xs font-mono text-[#7A1F1F] focus:outline-none focus:bg-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-mono uppercase text-[#7A1F1F] block pb-1 font-bold">
                    Initial Stamps
                  </label>
                  <input
                    type="number"
                    min="1"
                    max={totalStamps}
                    value={newStamps}
                    onChange={(e) => setNewStamps(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#F2ECD8] border-2 border-[#7A1F1F] text-xs font-mono text-[#7A1F1F] focus:outline-none focus:bg-white"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-mono uppercase text-[#7A1F1F] block pb-1 font-bold">
                    Milestone Gift
                  </label>
                  <select
                    value={newGiftId}
                    onChange={(e) => setNewGiftId(e.target.value)}
                    className="w-full px-2.5 py-2.5 rounded-xl bg-[#F2ECD8] border-2 border-[#7A1F1F] text-xs font-groovy text-[#7A1F1F] focus:outline-none"
                  >
                    {LOYALTY_GIFTS_POOL.map((g) => (
                      <option key={g.id} value={g.id}>
                        {g.title}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {enrollSuccess && (
              <div className="p-3 rounded-xl bg-[#E5A93C] border-2 border-[#7A1F1F] text-[#7A1F1F] text-xs font-mono font-bold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0 stroke-[3]" />
                <span>New member pass activated successfully!</span>
              </div>
            )}

            <button
              type="submit"
              className="w-full py-3.5 rounded-2xl bg-[#7A1F1F] hover:bg-[#5C1414] text-[#F2ECD8] font-groovy font-black text-xs tracking-wider uppercase flex items-center justify-center gap-2 shadow-[4px_4px_0px_#470D0D] cursor-pointer transition-all"
            >
              <UserPlus className="w-4 h-4 stroke-[2.5]" />
              <span>Issue New Membership</span>
            </button>
          </form>

          {/* Quick Notice */}
          <div className="p-5 rounded-3xl bg-[#FAF6EA] border-3 border-[#7A1F1F] text-xs text-[#7A1F1F] space-y-1 shadow-[5px_5px_0px_#7A1F1F]">
            <div className="flex items-center gap-1.5 font-groovy font-black text-sm">
              <Info className="w-4 h-4 text-[#7A1F1F]" />
              <span>Real-Time Local Storage Sync</span>
            </div>
            <p className="font-sans font-medium text-[#7A1F1F]/80">
              Rule changes and customer enrollments persist directly in local storage and broadcast to open client tabs.
            </p>
          </div>

        </div>

      </div>

    </div>
  );
}
