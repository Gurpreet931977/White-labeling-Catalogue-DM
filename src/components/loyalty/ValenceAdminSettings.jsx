import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Sliders,
  ShieldCheck,
  UserPlus,
  Flame,
  Award,
  RotateCcw,
  Check,
  Save,
  CheckCircle2,
  Sparkles,
  Info
} from 'lucide-react';
import { sounds } from '../../utils/audio';
import {
  saveLoyaltyAdminConfig,
  saveLoyaltyCustomer,
  getLoyaltyCustomers,
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
    <div className="space-y-8">
      
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-1">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono tracking-widest text-[#FF4800] uppercase font-bold">
              PLATFORM CONTROLS
            </span>
            <span className="px-2.5 py-0.5 rounded-full bg-[#EAE0CE] text-[#6E5D4F] border border-[#DDD0BC] font-mono text-[9px] font-bold">
              GLOBAL CONFIGURATION
            </span>
          </div>
          <h3 className="font-clash font-bold text-2xl sm:text-3xl text-[#1C120C] mt-1">
            Loyalty Engine Settings
          </h3>
        </div>

        <button
          type="button"
          onClick={handleSaveConfig}
          className="px-6 py-3 rounded-2xl bg-[#FF4800] hover:bg-[#E03F00] text-white font-sans font-bold text-xs tracking-wide shadow-lg shadow-[#FF4800]/25 cursor-pointer transition-all flex items-center gap-2"
        >
          {isSaved ? <Check className="w-4 h-4" /> : <Save className="w-4 h-4" />}
          <span>{isSaved ? 'Settings Applied!' : 'Save System Rules'}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* LEFT COLUMN (7 Cols): STAMP CAPACITY & STREAK RULES */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* 1. Dynamic Stamp Capacity Slider (4 to 12) */}
          <div className="p-6 sm:p-8 rounded-3xl bg-white border border-[#E2D6C3] shadow-md space-y-6">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] font-mono uppercase font-bold text-[#FF4800] tracking-wider">
                  CARD PARAMETERS
                </span>
                <h4 className="font-clash font-bold text-xl text-[#1C120C]">
                  Cycle Stamp Capacity
                </h4>
                <p className="text-xs text-[#76675B] mt-0.5">
                  Configure how many stamps a member must collect to complete a card and trigger the milestone reward.
                </p>
              </div>

              <div className="w-16 h-16 rounded-2xl bg-[#F8F4EC] border border-[#E2D6C3] flex flex-col items-center justify-center text-center">
                <span className="font-clash font-black text-2xl text-[#FF4800] leading-none">
                  {totalStamps}
                </span>
                <span className="text-[8px] font-mono text-[#76675B] uppercase font-bold">
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
                className="w-full accent-[#FF4800] cursor-pointer"
              />

              <div className="flex justify-between text-[11px] font-mono text-[#76675B] font-bold">
                <span>4 Stamps (Fast Cycle)</span>
                <span className="text-[#FF4800]">6 Stamps (Default)</span>
                <span>12 Stamps (Long Haul)</span>
              </div>
            </div>

            {/* Live slot layout preview */}
            <div className="p-5 rounded-2xl bg-[#F8F4EC] border border-[#E2D6C3] space-y-2.5">
              <span className="text-[10px] font-mono text-[#76675B] block uppercase font-bold">
                Dynamic Grid Preview ({totalStamps} slots):
              </span>
              <div className="grid grid-cols-6 gap-2">
                {Array.from({ length: totalStamps }, (_, i) => i + 1).map((slot) => (
                  <div
                    key={slot}
                    className={`h-9 rounded-xl border text-[11px] font-mono flex items-center justify-center font-bold ${
                      slot === totalStamps
                        ? 'border-[#D97706] bg-[#F59E0B]/15 text-[#D97706]'
                        : 'border-[#FF4800]/40 bg-white text-[#FF4800]'
                    }`}
                  >
                    #{slot}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* 2. Streak Speed-Up Rule Configuration */}
          <div className="p-6 sm:p-8 rounded-3xl bg-white border border-[#E2D6C3] shadow-md space-y-5">
            <div>
              <span className="text-[10px] font-mono uppercase font-bold text-[#FF4800] tracking-wider">
                GAMIFIED RETENTION
              </span>
              <h4 className="font-clash font-bold text-xl text-[#1C120C]">
                Streak Acceleration Threshold
              </h4>
              <p className="text-xs text-[#76675B] mt-0.5">
                When consecutive daily visits equal or exceed this threshold, each billing automatically marks +2 stamps instead of 1.
              </p>
            </div>

            <div className="flex items-center gap-5">
              <div className="flex-1 space-y-1.5">
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
                  className="w-full accent-[#FF4800] cursor-pointer"
                />
                <div className="flex justify-between text-[11px] font-mono text-[#76675B] font-bold">
                  <span>3 Days</span>
                  <span className="text-[#FF4800]">5 Days (Standard)</span>
                  <span>10 Days</span>
                </div>
              </div>

              <div className="px-5 py-3 rounded-2xl bg-[#FFF5F0] border border-[#FF4800]/30 text-center shrink-0">
                <span className="font-clash font-black text-xl text-[#FF4800] block leading-tight">
                  {streakThreshold}d
                </span>
                <span className="text-[8px] font-mono text-[#FF4800] uppercase font-black">
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
            className="p-6 sm:p-8 rounded-3xl bg-white border border-[#E2D6C3] shadow-md space-y-5"
          >
            <div className="flex items-center gap-2">
              <UserPlus className="w-5 h-5 text-[#FF4800]" />
              <h4 className="font-clash font-bold text-xl text-[#1C120C]">
                Enroll New Member
              </h4>
            </div>

            <p className="text-xs text-[#76675B]">
              Create a new digital pass directly at the counter without requiring manual customer app setup.
            </p>

            <div className="space-y-3.5 pt-1">
              <div>
                <label className="text-[10px] font-mono uppercase text-[#76675B] block font-bold pb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="e.g. Alex Rivera"
                  className="w-full px-4 py-2.5 rounded-xl bg-[#F8F4EC] border border-[#E2D6C3] text-xs text-[#1C120C] focus:outline-none focus:border-[#FF4800]"
                />
              </div>

              <div>
                <label className="text-[10px] font-mono uppercase text-[#76675B] block font-bold pb-1">
                  Phone Number (Primary ID)
                </label>
                <input
                  type="tel"
                  required
                  value={newPhone}
                  onChange={(e) => setNewPhone(e.target.value)}
                  placeholder="e.g. 9812345678"
                  className="w-full px-4 py-2.5 rounded-xl bg-[#F8F4EC] border border-[#E2D6C3] text-xs text-[#1C120C] focus:outline-none focus:border-[#FF4800]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-mono uppercase text-[#76675B] block font-bold pb-1">
                    Initial Stamps
                  </label>
                  <input
                    type="number"
                    min="1"
                    max={totalStamps}
                    value={newStamps}
                    onChange={(e) => setNewStamps(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#F8F4EC] border border-[#E2D6C3] text-xs text-[#1C120C] focus:outline-none focus:border-[#FF4800]"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-mono uppercase text-[#76675B] block font-bold pb-1">
                    Milestone Gift
                  </label>
                  <select
                    value={newGiftId}
                    onChange={(e) => setNewGiftId(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl bg-[#F8F4EC] border border-[#E2D6C3] text-xs font-mono font-bold text-[#D97706] focus:outline-none"
                  >
                    {LOYALTY_GIFTS_POOL.map((g) => (
                      <option key={g.id} value={g.id} className="bg-white text-[#1C120C]">
                        {g.title}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {enrollSuccess && (
              <div className="p-3.5 rounded-xl bg-[#10B981]/15 border border-[#10B981]/30 text-[#047857] text-xs font-mono font-bold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>New member pass activated successfully!</span>
              </div>
            )}

            <button
              type="submit"
              className="w-full py-3.5 rounded-2xl bg-[#1C120C] hover:bg-black text-white font-sans font-bold text-xs tracking-wider uppercase flex items-center justify-center gap-2 shadow-md cursor-pointer transition-all"
            >
              <UserPlus className="w-4 h-4 text-[#FF4800]" />
              <span>Issue New Membership</span>
            </button>
          </form>

          {/* Quick Notice */}
          <div className="p-5 rounded-3xl bg-white border border-[#E2D6C3] text-xs text-[#76675B] space-y-1 shadow-sm">
            <div className="flex items-center gap-1.5 font-bold text-[#1C120C]">
              <Info className="w-4 h-4 text-[#FF4800]" />
              <span>Real-Time Local Synchronization</span>
            </div>
            <p>
              Rule changes and customer enrollments persist directly in local storage and broadcast to open client tabs.
            </p>
          </div>

        </div>

      </div>

    </div>
  );
}
