import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import {
  Smartphone,
  Sliders,
  ArrowLeft,
  Volume2,
  VolumeX,
  Sparkles,
  QrCode,
  Users,
  Receipt,
  Gift,
  Flame,
  User,
  X
} from 'lucide-react';
import { sounds } from '../utils/audio';
import { ModelSwitcherModal } from '../components/common/ModelSwitcherModal';
import {
  getLoyaltyAdminConfig,
  getLoyaltyCustomers,
  getGiftById
} from '../utils/loyaltyStorage';

// Retro Decorative Elements
import { RetroMarqueeBanner } from '../components/loyalty/RetroMarqueeBanner';
import { CircularStampBadge } from '../components/loyalty/CircularStampBadge';

// Customer Components
import { ValenceHeroPass } from '../components/loyalty/ValenceHeroPass';
import { ValenceStampJourney } from '../components/loyalty/ValenceStampJourney';
import { ValenceRewardsVault } from '../components/loyalty/ValenceRewardsVault';
import { ValenceActivityLedger } from '../components/loyalty/ValenceActivityLedger';
import { ValenceMemberAccount } from '../components/loyalty/ValenceMemberAccount';

// Admin Components
import { ValenceAdminOverview } from '../components/loyalty/ValenceAdminOverview';
import { ValenceAdminPOS } from '../components/loyalty/ValenceAdminPOS';
import { ValenceAdminCustomers } from '../components/loyalty/ValenceAdminCustomers';
import { ValenceAdminSettings } from '../components/loyalty/ValenceAdminSettings';

export function GamifiedLoyaltyApp({ onBackToVariants, onBackToCatalogue }) {
  // Primary View Mode: 'customer' (Priority consumer pass) vs 'admin' (Console)
  const [viewMode, setViewMode] = useState('customer');

  // Customer Navigation Tabs: 'home' | 'rewards' | 'activity' | 'account'
  const [customerTab, setCustomerTab] = useState('home');

  // Admin Navigation Tabs: 'overview' | 'pos' | 'customers' | 'settings'
  const [adminTab, setAdminTab] = useState('overview');

  // Centralized State
  const [adminConfig, setAdminConfig] = useState(() => getLoyaltyAdminConfig());
  const [customers, setCustomers] = useState(() => getLoyaltyCustomers());
  const [selectedCustomerId, setSelectedCustomerId] = useState(() => {
    const list = getLoyaltyCustomers();
    return list[0]?.id || 'cust-1';
  });

  // UI State
  const [isSoundOn, setIsSoundOn] = useState(true);
  const [isModelSwitcherOpen, setIsModelSwitcherOpen] = useState(false);
  const [showQrModal, setShowQrModal] = useState(false);
  const [feedbackToast, setFeedbackToast] = useState(null);

  useEffect(() => {
    const handleConfigChange = (e) => {
      if (e?.detail) setAdminConfig(e.detail);
    };
    const handleCustomersChange = (e) => {
      if (e?.detail) setCustomers(e.detail);
    };
    window.addEventListener('thc_loyalty_config_change', handleConfigChange);
    window.addEventListener('thc_loyalty_customers_change', handleCustomersChange);
    return () => {
      window.removeEventListener('thc_loyalty_config_change', handleConfigChange);
      window.removeEventListener('thc_loyalty_customers_change', handleCustomersChange);
    };
  }, []);

  const activeCustomer =
    customers.find((c) => c.id === selectedCustomerId) ||
    customers[0] || {
      id: 'cust-1',
      name: 'Maya Chen',
      phone: '9876543210',
      stamps: 4,
      streakDays: 5,
      xp: 420,
      assignedGiftId: 'discount50',
      billingHistory: [],
      redeemedVouchers: []
    };

  const activeGift = getGiftById(activeCustomer.assignedGiftId || 'discount50');
  const totalSlots = adminConfig?.totalStamps || 6;
  const hasStreakBonus = (activeCustomer.streakDays || 0) >= (adminConfig?.streakBonusThreshold || 5);

  const getTier = (xp = 420) => {
    if (xp >= 700) return { name: 'Diamond VIP', level: 4, badge: 'DIAMOND' };
    if (xp >= 400) return { name: 'Gold Member', level: 3, badge: 'GOLD MEMBER' };
    if (xp >= 200) return { name: 'Silver Member', level: 2, badge: 'SILVER MEMBER' };
    return { name: 'Bronze Member', level: 1, badge: 'BRONZE MEMBER' };
  };
  const activeTier = getTier(activeCustomer.xp || 420);

  const showToast = (msg) => {
    setFeedbackToast(msg);
    setTimeout(() => setFeedbackToast(null), 3500);
  };

  const triggerMilestoneConfetti = () => {
    confetti({
      particleCount: 90,
      spread: 80,
      origin: { y: 0.6 },
      colors: ['#7A1F1F', '#E5A93C', '#FAF6EA', '#5C1414', '#D4AF37']
    });
  };

  const handleToggleSound = () => {
    const newState = sounds.toggleSound();
    setIsSoundOn(newState);
  };

  return (
    <div className="min-h-screen bg-[#F2ECD8] text-[#7A1F1F] font-sans selection:bg-[#7A1F1F] selection:text-[#F2ECD8] relative transition-colors duration-300 pb-20 sm:pb-8">
      
      {/* TOP APPLICATION HEADER (Warm Cream with Solid Oxblood Border) */}
      <header className="sticky top-0 inset-x-0 z-40 bg-[#F2ECD8]/95 backdrop-blur-md border-b-3 border-[#7A1F1F] px-4 sm:px-6 py-3">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-3">
          
          {/* Left: Brand Identity & Return */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => {
                sounds.playClick();
                if (onBackToVariants) onBackToVariants();
                else if (onBackToCatalogue) onBackToCatalogue();
              }}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#FAF6EA] hover:bg-white text-[#7A1F1F] border-2 border-[#7A1F1F] text-xs font-mono font-bold transition cursor-pointer shadow-[2px_2px_0px_#7A1F1F]"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Back</span>
            </button>

            <div className="flex items-center gap-2">
              <span className="font-groovy font-black text-2xl sm:text-3xl tracking-wide text-[#7A1F1F] leading-none">
                VALENCE
              </span>
              <span className="hidden md:inline px-2.5 py-0.5 rounded-full bg-[#7A1F1F] text-[#F2ECD8] font-mono text-[9px] font-bold uppercase tracking-widest">
                VERIFIED LOYALTY PLATFORM
              </span>
            </div>
          </div>

          {/* Right Controls: Mode Toggle & Utilities */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* Customer Switcher (Demo Verification) */}
            <div className="hidden lg:flex items-center gap-2 text-xs font-mono">
              <span className="text-[#7A1F1F]/80 font-bold">MEMBER:</span>
              <select
                value={selectedCustomerId}
                onChange={(e) => {
                  sounds.playClick();
                  setSelectedCustomerId(e.target.value);
                }}
                className="px-3 py-1.5 rounded-xl bg-[#FAF6EA] border-2 border-[#7A1F1F] text-[#7A1F1F] font-mono text-xs font-bold focus:outline-none cursor-pointer shadow-[2px_2px_0px_#7A1F1F]"
              >
                {customers.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name} ({c.stamps}/{totalSlots} stamps • {c.streakDays}d streak)
                  </option>
                ))}
              </select>
            </div>

            {/* View Switcher: Member View vs Admin Console */}
            <div className="flex items-center p-1 rounded-2xl bg-[#FAF6EA] border-2 border-[#7A1F1F] shadow-[3px_3px_0px_#7A1F1F] text-xs">
              <button
                type="button"
                onClick={() => {
                  sounds.playClick();
                  setViewMode('customer');
                }}
                className={`px-3.5 py-1.5 rounded-xl font-groovy font-bold transition flex items-center gap-1.5 cursor-pointer uppercase ${
                  viewMode === 'customer'
                    ? 'bg-[#7A1F1F] text-[#F2ECD8] shadow-sm'
                    : 'text-[#7A1F1F] hover:bg-[#E2D8BE]'
                }`}
              >
                <Smartphone className="w-3.5 h-3.5" />
                <span>Member View</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  sounds.playClick();
                  setViewMode('admin');
                }}
                className={`px-3.5 py-1.5 rounded-xl font-groovy font-bold transition flex items-center gap-1.5 cursor-pointer uppercase ${
                  viewMode === 'admin'
                    ? 'bg-[#7A1F1F] text-[#F2ECD8] shadow-sm'
                    : 'text-[#7A1F1F] hover:bg-[#E2D8BE]'
                }`}
              >
                <Sliders className="w-3.5 h-3.5" />
                <span>Admin Console</span>
              </button>
            </div>

            {/* Sound Toggle */}
            <button
              type="button"
              onClick={handleToggleSound}
              className="p-2 rounded-xl bg-[#FAF6EA] hover:bg-white text-[#7A1F1F] border-2 border-[#7A1F1F] transition cursor-pointer shadow-[2px_2px_0px_#7A1F1F]"
              title={isSoundOn ? 'Sound is ON' : 'Sound is OFF'}
            >
              {isSoundOn ? (
                <Volume2 className="w-4 h-4 text-[#7A1F1F]" />
              ) : (
                <VolumeX className="w-4 h-4 text-[#7A1F1F]/50" />
              )}
            </button>

          </div>

        </div>
      </header>

      {/* SCROLLING MARQUEE TICKER BANNER (Retro Brand Accent) */}
      <RetroMarqueeBanner
        text="COLLECT STAMPS • EARN PERKS • 5-DAY STREAK BOOST • UNLOCK 50% OFF • VERIFIED DIGITAL PASS • "
        variant="oxblood"
      />

      {/* FLOATING INTERACTIVE TOAST */}
      <AnimatePresence>
        {feedbackToast && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="fixed top-24 inset-x-0 mx-auto w-fit z-50 px-5 py-2.5 rounded-2xl bg-[#7A1F1F] text-[#F2ECD8] border-2 border-[#5C1414] font-groovy font-bold text-xs shadow-[6px_6px_0px_#470D0D] flex items-center gap-2 pointer-events-none"
          >
            <Sparkles className="w-4 h-4 text-[#E5A93C]" />
            <span>{feedbackToast}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* MAIN CONTAINER */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-6 space-y-6">

        {/* =============================================================== */}
        {/* CUSTOMER EXPERIENCE (PRIORITY CONSUMER APP)                     */}
        {/* =============================================================== */}
        {viewMode === 'customer' && (
          <div className="space-y-6">
            
            {/* Desktop Navigation Tabs (Chunky Retro Style) */}
            <div className="hidden sm:flex items-center justify-between border-b-2 border-[#7A1F1F]/20 pb-3">
              <div className="flex items-center gap-2">
                {[
                  { id: 'home', label: 'Home Pass' },
                  { id: 'rewards', label: 'Perks & Vault' },
                  { id: 'activity', label: 'Activity Ledger' },
                  { id: 'account', label: 'Account & QR' }
                ].map((tab) => (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => {
                      sounds.playClick();
                      setCustomerTab(tab.id);
                    }}
                    className={`px-5 py-2.5 rounded-2xl text-xs font-groovy uppercase tracking-wider transition cursor-pointer ${
                      customerTab === tab.id
                        ? 'bg-[#7A1F1F] text-[#F2ECD8] border-2 border-[#5C1414] shadow-[3px_3px_0px_#5C1414]'
                        : 'bg-[#FAF6EA] text-[#7A1F1F] hover:bg-white border-2 border-[#7A1F1F] shadow-[2px_2px_0px_#7A1F1F]'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              <div className="text-xs font-mono text-[#7A1F1F] font-bold">
                MEMBER: <span className="font-groovy text-sm text-[#7A1F1F] uppercase">{activeCustomer.name}</span>
              </div>
            </div>

            {/* TAB CONTENT */}
            {customerTab === 'home' && (
              <div className="space-y-8">
                
                {/* 1. HERO DIGITAL WALLET MEMBERSHIP PASS */}
                <div className="max-w-lg mx-auto">
                  <ValenceHeroPass
                    customer={activeCustomer}
                    tier={activeTier}
                    totalSlots={totalSlots}
                    onShowQrModal={() => setShowQrModal(true)}
                  />
                </div>

                {/* 2. SATISFYING STAMP JOURNEY */}
                <ValenceStampJourney
                  customer={activeCustomer}
                  totalSlots={totalSlots}
                  currentGift={activeGift}
                  hasStreakBonus={hasStreakBonus}
                  onSlotClick={(slotNum) => {
                    if (slotNum <= (activeCustomer.stamps || 0)) {
                      showToast(`Stamp #${slotNum} verified from billing.`);
                    } else {
                      showToast(`Stamp #${slotNum} marks automatically upon checkout billing.`);
                    }
                  }}
                  onClaimMilestone={() => {
                    sounds.playRewardFanfare();
                    triggerMilestoneConfetti();
                    setCustomerTab('rewards');
                    showToast('Milestone Unlocked! Head to Perks Vault to redeem.');
                  }}
                />

                {/* 3. QUICK DISCOVERY TILES (Warm Cream Cards with Solid Oxblood Borders) */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 pt-2">
                  
                  {/* Tile 1: Rewards Shortcut */}
                  <div
                    onClick={() => {
                      sounds.playClick();
                      setCustomerTab('rewards');
                    }}
                    className="p-6 rounded-3xl bg-[#FAF6EA] border-3 border-[#7A1F1F] hover:bg-white shadow-[6px_6px_0px_#7A1F1F] cursor-pointer transition group"
                  >
                    <div className="w-12 h-12 rounded-2xl bg-[#7A1F1F] text-[#E5A93C] flex items-center justify-center mb-3 group-hover:scale-105 transition-transform shadow-sm">
                      <Gift className="w-6 h-6 stroke-[2.5]" />
                    </div>
                    <h4 className="font-groovy font-black text-xl text-[#7A1F1F]">
                      Perks &amp; Rewards Vault
                    </h4>
                    <p className="text-xs text-[#7A1F1F]/80 mt-1 font-sans">
                      Daily secret treat &amp; redeemable vouchers.
                    </p>
                  </div>

                  {/* Tile 2: Activity Shortcut */}
                  <div
                    onClick={() => {
                      sounds.playClick();
                      setCustomerTab('activity');
                    }}
                    className="p-6 rounded-3xl bg-[#FAF6EA] border-3 border-[#7A1F1F] hover:bg-white shadow-[6px_6px_0px_#7A1F1F] cursor-pointer transition group"
                  >
                    <div className="w-12 h-12 rounded-2xl bg-[#7A1F1F] text-[#E5A93C] flex items-center justify-center mb-3 group-hover:scale-105 transition-transform shadow-sm">
                      <Receipt className="w-6 h-6 stroke-[2.5]" />
                    </div>
                    <h4 className="font-groovy font-black text-xl text-[#7A1F1F]">
                      Itemized Activity Ledger
                    </h4>
                    <p className="text-xs text-[#7A1F1F]/80 mt-1 font-sans">
                      {activeCustomer.billingHistory?.length || 0} verified visits &amp; tax receipts.
                    </p>
                  </div>

                  {/* Tile 3: QR Code Scanner Shortcut */}
                  <div
                    onClick={() => {
                      sounds.playClick();
                      setShowQrModal(true);
                    }}
                    className="p-6 rounded-3xl bg-[#FAF6EA] border-3 border-[#7A1F1F] hover:bg-white shadow-[6px_6px_0px_#7A1F1F] cursor-pointer transition group"
                  >
                    <div className="w-12 h-12 rounded-2xl bg-[#7A1F1F] text-[#E5A93C] flex items-center justify-center mb-3 group-hover:scale-105 transition-transform shadow-sm">
                      <QrCode className="w-6 h-6 stroke-[2.5]" />
                    </div>
                    <h4 className="font-groovy font-black text-xl text-[#7A1F1F]">
                      Optical Scanner Pass
                    </h4>
                    <p className="text-xs text-[#7A1F1F]/80 mt-1 font-sans">
                      Display high-res QR for counter scanner.
                    </p>
                  </div>

                </div>

              </div>
            )}

            {customerTab === 'rewards' && (
              <ValenceRewardsVault
                customer={activeCustomer}
                totalSlots={totalSlots}
                currentGift={activeGift}
              />
            )}

            {customerTab === 'activity' && (
              <ValenceActivityLedger customer={activeCustomer} />
            )}

            {customerTab === 'account' && (
              <ValenceMemberAccount
                customer={activeCustomer}
                isSoundOn={isSoundOn}
                onToggleSound={handleToggleSound}
              />
            )}

            {/* Mobile-First Sticky Bottom Tab Bar */}
            <div className="sm:hidden fixed bottom-3 inset-x-4 z-40 bg-[#FAF6EA] border-3 border-[#7A1F1F] rounded-3xl p-1.5 flex items-center justify-around shadow-[6px_6px_0px_#7A1F1F]">
              {[
                { id: 'home', label: 'Pass', icon: Smartphone },
                { id: 'rewards', label: 'Rewards', icon: Gift },
                { id: 'activity', label: 'Activity', icon: Receipt },
                { id: 'account', label: 'Account', icon: User }
              ].map((item) => {
                const Icon = item.icon;
                const isActive = customerTab === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => {
                      sounds.playClick();
                      setCustomerTab(item.id);
                    }}
                    className={`flex-1 py-2 rounded-2xl flex flex-col items-center gap-1 cursor-pointer transition-colors ${
                      isActive ? 'bg-[#7A1F1F] text-[#F2ECD8] font-bold' : 'text-[#7A1F1F]'
                    }`}
                  >
                    <Icon className="w-4 h-4 stroke-[2.5]" />
                    <span className="text-[10px] font-groovy uppercase">{item.label}</span>
                  </button>
                );
              })}
            </div>

          </div>
        )}

        {/* =============================================================== */}
        {/* ADMIN CONSOLE EXPERIENCE (PRODUCTIVITY TERMINAL)                */}
        {/* =============================================================== */}
        {viewMode === 'admin' && (
          <div className="space-y-6">
            
            {/* Admin Sub-Navigation */}
            <div className="flex items-center gap-2 border-b-2 border-[#7A1F1F]/20 pb-3 overflow-x-auto no-scrollbar">
              {[
                { id: 'overview', label: 'Overview' },
                { id: 'pos', label: 'Billing / POS Register' },
                { id: 'customers', label: 'Member Directory' },
                { id: 'settings', label: 'Rules & Settings' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => {
                    sounds.playClick();
                    setAdminTab(tab.id);
                  }}
                  className={`px-5 py-2.5 rounded-2xl text-xs font-groovy uppercase tracking-wider whitespace-nowrap transition cursor-pointer ${
                    adminTab === tab.id
                      ? 'bg-[#7A1F1F] text-[#F2ECD8] border-2 border-[#5C1414] shadow-[3px_3px_0px_#5C1414]'
                      : 'bg-[#FAF6EA] text-[#7A1F1F] hover:bg-white border-2 border-[#7A1F1F] shadow-[2px_2px_0px_#7A1F1F]'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Admin Tab Views */}
            {adminTab === 'overview' && (
              <ValenceAdminOverview
                customers={customers}
                config={adminConfig}
                onNavigateTab={(tabName) => setAdminTab(tabName)}
              />
            )}

            {adminTab === 'pos' && (
              <ValenceAdminPOS
                customers={customers}
                selectedCustomer={activeCustomer}
                onSelectCustomer={(cust) => setSelectedCustomerId(cust.id)}
                onTransactionComplete={(res) => {
                  setCustomers(getLoyaltyCustomers());
                  showToast(`Transaction settled! +${res.stampsAwarded} stamps synchronized to ${res.customer.name}'s pass.`);
                  if (res.isRewardUnlocked) {
                    setTimeout(() => triggerMilestoneConfetti(), 400);
                  }
                }}
              />
            )}

            {adminTab === 'customers' && (
              <ValenceAdminCustomers
                customers={customers}
                totalSlots={totalSlots}
                onUpdateCustomer={(updated) => {
                  setCustomers(getLoyaltyCustomers());
                  showToast(`Updated customer ${updated.name}`);
                }}
              />
            )}

            {adminTab === 'settings' && (
              <ValenceAdminSettings
                config={adminConfig}
                onUpdateConfig={(cfg) => {
                  setAdminConfig(cfg);
                  showToast('Configuration rules updated.');
                }}
                onNewCustomerCreated={(newCust) => {
                  setCustomers(getLoyaltyCustomers());
                  setSelectedCustomerId(newCust.id);
                  showToast(`New member ${newCust.name} enrolled!`);
                }}
              />
            )}

          </div>
        )}

      </main>

      {/* FULL-SCREEN QR CODE PASS MODAL */}
      <AnimatePresence>
        {showQrModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative w-full max-w-sm rounded-3xl bg-[#FAF6EA] border-3 border-[#7A1F1F] shadow-[12px_12px_0px_#7A1F1F] p-6 sm:p-8 space-y-6 text-center"
            >
              <button
                type="button"
                onClick={() => setShowQrModal(false)}
                className="absolute top-5 right-5 w-9 h-9 rounded-full bg-[#7A1F1F] text-[#F2ECD8] flex items-center justify-center hover:bg-[#5C1414] cursor-pointer"
              >
                <X className="w-4 h-4 stroke-[3]" />
              </button>

              <div className="space-y-1">
                <span className="text-xs font-mono tracking-widest text-[#7A1F1F] uppercase font-bold">
                  VERIFIED PASS QR
                </span>
                <h3 className="font-groovy font-black text-3xl text-[#7A1F1F]">
                  {activeCustomer.name}
                </h3>
                <p className="text-xs font-mono text-[#7A1F1F]/80">
                  Scan at checkout to associate bill and record stamps
                </p>
              </div>

              {/* High-Contrast SVG QR Code with Bold Oxblood Border */}
              <div className="p-4 rounded-3xl bg-white shadow-md border-3 border-[#7A1F1F] inline-block">
                <svg viewBox="0 0 100 100" className="w-48 h-48">
                  <rect x="5" y="5" width="28" height="28" rx="4" fill="#7A1F1F" />
                  <rect x="9" y="9" width="20" height="20" rx="2" fill="#fff" />
                  <rect x="13" y="13" width="12" height="12" fill="#7A1F1F" />

                  <rect x="67" y="5" width="28" height="28" rx="4" fill="#7A1F1F" />
                  <rect x="71" y="9" width="20" height="20" rx="2" fill="#fff" />
                  <rect x="75" y="13" width="12" height="12" fill="#7A1F1F" />

                  <rect x="5" y="67" width="28" height="28" rx="4" fill="#7A1F1F" />
                  <rect x="9" y="71" width="20" height="20" rx="2" fill="#fff" />
                  <rect x="13" y="75" width="12" height="12" fill="#7A1F1F" />

                  <rect x="42" y="10" width="8" height="8" fill="#7A1F1F" />
                  <rect x="42" y="25" width="8" height="15" fill="#7A1F1F" />
                  <rect x="15" y="42" width="12" height="8" fill="#7A1F1F" />
                  <rect x="40" y="45" width="16" height="16" rx="2" fill="#E5A93C" />
                  <rect x="65" y="42" width="10" height="10" fill="#7A1F1F" />
                  <rect x="78" y="55" width="14" height="6" fill="#7A1F1F" />
                  <rect x="45" y="68" width="8" height="18" fill="#7A1F1F" />
                  <rect x="60" y="72" width="15" height="10" fill="#7A1F1F" />
                  <rect x="80" y="80" width="12" height="12" fill="#7A1F1F" />
                </svg>
              </div>

              <div className="space-y-1 font-mono text-xs font-bold text-[#7A1F1F]">
                <div>VAL-{activeCustomer.phone}</div>
                <div className="font-groovy text-sm text-[#7A1F1F]">{activeCustomer.stamps} / {totalSlots} Stamps Recorded</div>
              </div>

              <button
                type="button"
                onClick={() => setShowQrModal(false)}
                className="w-full py-3.5 rounded-2xl bg-[#7A1F1F] hover:bg-[#5C1414] text-xs font-groovy font-bold text-[#F2ECD8] cursor-pointer uppercase shadow-[4px_4px_0px_#470D0D]"
              >
                Close Pass
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Model Switcher Modal */}
      <ModelSwitcherModal
        isOpen={isModelSwitcherOpen}
        onClose={() => setIsModelSwitcherOpen(false)}
        currentModelId="gamified-loyalty"
      />

    </div>
  );
}
