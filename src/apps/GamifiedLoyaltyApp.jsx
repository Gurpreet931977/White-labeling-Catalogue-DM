import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import {
  Smartphone,
  Sliders,
  Layers,
  ArrowLeft,
  Volume2,
  VolumeX,
  Sparkles,
  QrCode,
  Users,
  Receipt,
  Gift,
  Flame,
  CheckCircle2,
  Clock,
  ShieldCheck,
  CreditCard,
  X,
  Check,
  User,
  LayoutGrid,
  Zap,
  Tag,
  ArrowRight
} from 'lucide-react';
import { sounds } from '../utils/audio';
import { ModelSwitcherModal } from '../components/common/ModelSwitcherModal';
import {
  getLoyaltyAdminConfig,
  saveLoyaltyAdminConfig,
  getLoyaltyCustomers,
  saveLoyaltyCustomer,
  getGiftById
} from '../utils/loyaltyStorage';

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
  // Primary Experience Switcher: 'customer' (Priority consumer app) vs 'admin' (Console)
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

  // Sync state with storage events
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

  // Active Customer Record
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
      particleCount: 100,
      spread: 85,
      origin: { y: 0.6 },
      colors: ['#FF4800', '#F59E0B', '#1E120B', '#10B981', '#FFFFFF']
    });
  };

  const handleToggleSound = () => {
    const newState = sounds.toggleSound();
    setIsSoundOn(newState);
  };

  return (
    <div className="min-h-screen bg-[#F7F2E7] text-[#1C120C] font-sans selection:bg-[#FF4800] selection:text-white relative transition-colors duration-300 pb-20 sm:pb-12">
      
      {/* Subtle Warm Retro Radial Atmosphere */}
      <div className="fixed -top-40 -left-40 w-[600px] h-[600px] rounded-full bg-[#FF4800]/5 blur-[160px] pointer-events-none" />
      <div className="fixed -bottom-40 -right-40 w-[600px] h-[600px] rounded-full bg-[#D4A373]/15 blur-[160px] pointer-events-none" />

      {/* TOP APPLICATION HEADER (EXPANSIVE WIDTH) */}
      <header className="sticky top-0 inset-x-0 z-40 bg-[#F7F2E7]/90 backdrop-blur-xl border-b border-[#E2D6C3] px-4 sm:px-8 lg:px-12 py-3.5">
        <div className="w-full max-w-[1520px] mx-auto flex items-center justify-between gap-4">
          
          {/* Left: Brand Identity & Model Return */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => {
                sounds.playClick();
                if (onBackToVariants) onBackToVariants();
                else if (onBackToCatalogue) onBackToCatalogue();
              }}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#EAE0CE] hover:bg-[#1C120C] text-[#6E5D4F] hover:text-[#FFFDF9] border border-[#DDD0BC] text-xs font-mono transition cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Back</span>
            </button>

            <div className="flex items-center gap-2.5">
              <span className="font-clash font-black text-2xl tracking-tight text-[#1C120C]">
                VALENCE
              </span>
              <span className="hidden md:inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#EAE0CE] border border-[#DDD0BC] font-mono text-[9px] text-[#7A695B] uppercase tracking-widest font-bold">
                <span className="w-1.5 h-1.5 rounded-full bg-[#FF4800]" />
                UNIVERSAL DIGITAL MEMBERSHIP
              </span>
            </div>
          </div>

          {/* Right Controls: Mode Toggle & Utilities */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* Customer Switcher (Demo Verification) */}
            <div className="hidden lg:flex items-center gap-2 text-xs font-mono bg-[#EAE0CE]/70 px-3 py-1.5 rounded-2xl border border-[#DDD0BC]">
              <span className="text-[#7A695B] font-semibold">DEMO MEMBER:</span>
              <select
                value={selectedCustomerId}
                onChange={(e) => {
                  sounds.playClick();
                  setSelectedCustomerId(e.target.value);
                }}
                className="bg-transparent text-[#1C120C] font-mono text-xs font-bold focus:outline-none cursor-pointer"
              >
                {customers.map((c) => (
                  <option key={c.id} value={c.id} className="bg-[#F7F2E7]">
                    {c.name} ({c.stamps}/{totalSlots} stamps • {c.streakDays}d streak)
                  </option>
                ))}
              </select>
            </div>

            {/* View Switcher: Customer App vs Admin Console */}
            <div className="flex items-center p-1 rounded-2xl bg-[#EAE0CE] border border-[#DDD0BC] text-xs">
              <button
                type="button"
                onClick={() => {
                  sounds.playClick();
                  setViewMode('customer');
                }}
                className={`px-4 py-2 rounded-xl font-medium transition flex items-center gap-1.5 cursor-pointer ${
                  viewMode === 'customer'
                    ? 'bg-[#1C120C] text-[#FFFDF9] font-bold shadow-md'
                    : 'text-[#6E5D4F] hover:text-[#1C120C]'
                }`}
              >
                <Smartphone className="w-3.5 h-3.5 text-[#FF4800]" />
                <span>Member View</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  sounds.playClick();
                  setViewMode('admin');
                }}
                className={`px-4 py-2 rounded-xl font-medium transition flex items-center gap-1.5 cursor-pointer ${
                  viewMode === 'admin'
                    ? 'bg-[#FF4800] text-white font-bold shadow-md shadow-[#FF4800]/30'
                    : 'text-[#6E5D4F] hover:text-[#1C120C]'
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
              className="p-2.5 rounded-2xl bg-[#EAE0CE] hover:bg-[#DDD0BC] text-[#1C120C] border border-[#DDD0BC] transition cursor-pointer"
              title={isSoundOn ? 'Sound is ON' : 'Sound is OFF'}
            >
              {isSoundOn ? (
                <Volume2 className="w-4 h-4 text-[#FF4800]" />
              ) : (
                <VolumeX className="w-4 h-4 text-[#A19183]" />
              )}
            </button>

          </div>

        </div>
      </header>

      {/* FLOATING INTERACTIVE TOAST */}
      <AnimatePresence>
        {feedbackToast && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="fixed top-18 inset-x-0 mx-auto w-fit z-50 px-5 py-2.5 rounded-2xl bg-[#1C120C] text-[#FFFDF9] border border-[#FF4800]/50 font-mono text-xs shadow-2xl flex items-center gap-2 pointer-events-none"
          >
            <Sparkles className="w-4 h-4 text-[#FF4800]" />
            <span>{feedbackToast}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* MAIN CONTAINER (FULL-WIDTH EXPANSIVE 1520px CANVAS) */}
      <main className="w-full max-w-[1520px] mx-auto px-4 sm:px-8 lg:px-12 py-6 sm:py-8 space-y-8">

        {/* =============================================================== */}
        {/* CUSTOMER EXPERIENCE (PRIORITY CONSUMER APP)                     */}
        {/* =============================================================== */}
        {viewMode === 'customer' && (
          <div className="space-y-8">
            
            {/* Desktop Navigation Tabs */}
            <div className="hidden sm:flex items-center justify-between border-b border-[#E2D6C3] pb-4">
              <div className="flex items-center gap-2.5">
                {[
                  { id: 'home', label: 'Home & Pass' },
                  { id: 'rewards', label: 'Perks & Vault' },
                  { id: 'activity', label: 'Activity Ledger' },
                  { id: 'account', label: 'Account & Scanner' }
                ].map((tab) => (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => {
                      sounds.playClick();
                      setCustomerTab(tab.id);
                    }}
                    className={`px-5 py-2.5 rounded-2xl text-xs font-mono font-medium transition cursor-pointer ${
                      customerTab === tab.id
                        ? 'bg-[#1C120C] text-[#FFFDF9] font-bold shadow-md'
                        : 'bg-[#EAE0CE]/50 text-[#6E5D4F] hover:text-[#1C120C] hover:bg-[#EAE0CE]'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              <div className="text-xs font-mono text-[#7A695B] flex items-center gap-2">
                <span>Member:</span>
                <span className="text-[#1C120C] font-bold bg-[#EAE0CE] px-2.5 py-1 rounded-xl">
                  {activeCustomer.name} ({activeCustomer.phone})
                </span>
              </div>
            </div>

            {/* TAB CONTENT: HOME VIEW (EXPANSIVE 2-COLUMN BALANCED HERO GRID) */}
            {customerTab === 'home' && (
              <div className="space-y-8">
                
                {/* 12-Column Hero Row */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                  
                  {/* Left Column (5 Cols): Hero Digital Pass & Quick Access Shortcuts */}
                  <div className="lg:col-span-5 space-y-6">
                    <ValenceHeroPass
                      customer={activeCustomer}
                      tier={activeTier}
                      totalSlots={totalSlots}
                      onShowQrModal={() => setShowQrModal(true)}
                    />

                    {/* Quick Access Tiles under the Pass */}
                    <div className="grid grid-cols-3 gap-3">
                      <div
                        onClick={() => {
                          sounds.playClick();
                          setCustomerTab('rewards');
                        }}
                        className="p-4 rounded-2xl bg-white border border-[#E2D6C3] hover:border-[#FF4800] shadow-sm cursor-pointer transition group text-center space-y-1.5"
                      >
                        <div className="w-9 h-9 rounded-xl bg-[#F7F2E7] text-[#FF4800] flex items-center justify-center mx-auto group-hover:bg-[#FF4800] group-hover:text-white transition-colors">
                          <Gift className="w-4 h-4" />
                        </div>
                        <span className="font-clash font-bold text-xs text-[#1C120C] block">
                          Vault
                        </span>
                        <span className="text-[10px] font-mono text-[#7A695B] block">
                          3 Perks Ready
                        </span>
                      </div>

                      <div
                        onClick={() => {
                          sounds.playClick();
                          setCustomerTab('activity');
                        }}
                        className="p-4 rounded-2xl bg-white border border-[#E2D6C3] hover:border-[#FF4800] shadow-sm cursor-pointer transition group text-center space-y-1.5"
                      >
                        <div className="w-9 h-9 rounded-xl bg-[#F7F2E7] text-[#10B981] flex items-center justify-center mx-auto group-hover:bg-[#10B981] group-hover:text-white transition-colors">
                          <Receipt className="w-4 h-4" />
                        </div>
                        <span className="font-clash font-bold text-xs text-[#1C120C] block">
                          Activity
                        </span>
                        <span className="text-[10px] font-mono text-[#7A695B] block">
                          {activeCustomer.billingHistory?.length || 0} Receipts
                        </span>
                      </div>

                      <div
                        onClick={() => {
                          sounds.playClick();
                          setShowQrModal(true);
                        }}
                        className="p-4 rounded-2xl bg-white border border-[#E2D6C3] hover:border-[#FF4800] shadow-sm cursor-pointer transition group text-center space-y-1.5"
                      >
                        <div className="w-9 h-9 rounded-xl bg-[#F7F2E7] text-[#1C120C] flex items-center justify-center mx-auto group-hover:bg-[#1C120C] group-hover:text-[#FFFDF9] transition-colors">
                          <QrCode className="w-4 h-4" />
                        </div>
                        <span className="font-clash font-bold text-xs text-[#1C120C] block">
                          QR Pass
                        </span>
                        <span className="text-[10px] font-mono text-[#7A695B] block">
                          Scan At Desk
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Right Column (7 Cols): The Satisfying Stamp Journey */}
                  <div className="lg:col-span-7">
                    <ValenceStampJourney
                      customer={activeCustomer}
                      totalSlots={totalSlots}
                      currentGift={activeGift}
                      hasStreakBonus={hasStreakBonus}
                      onSlotClick={(slotNum) => {
                        if (slotNum <= (activeCustomer.stamps || 0)) {
                          showToast(`Stamp #${slotNum} verified from past bill.`);
                        } else {
                          showToast(`Stamp #${slotNum} will be credited automatically upon checkout billing.`);
                        }
                      }}
                      onClaimMilestone={() => {
                        sounds.playRewardFanfare();
                        triggerMilestoneConfetti();
                        setCustomerTab('rewards');
                        showToast('Milestone Unlocked! Head to Perks Vault to redeem.');
                      }}
                    />
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
            <div className="sm:hidden fixed bottom-3 inset-x-4 z-40 bg-[#1C120C]/95 backdrop-blur-xl border border-[#3A2E26] rounded-3xl p-1.5 flex items-center justify-around shadow-2xl">
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
                      isActive ? 'bg-[#FF4800] text-white font-bold' : 'text-[#A19183]'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="text-[10px] font-mono">{item.label}</span>
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
          <div className="space-y-8">
            
            {/* Admin Sub-Navigation */}
            <div className="flex items-center gap-2.5 border-b border-[#E2D6C3] pb-4 overflow-x-auto no-scrollbar">
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
                  className={`px-5 py-2.5 rounded-2xl text-xs font-mono font-medium whitespace-nowrap transition cursor-pointer ${
                    adminTab === tab.id
                      ? 'bg-[#FF4800] text-white font-bold shadow-md shadow-[#FF4800]/25'
                      : 'bg-white text-[#6E5D4F] hover:text-[#1C120C] border border-[#E2D6C3]'
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
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1C120C]/80 backdrop-blur-md">
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative w-full max-w-sm rounded-3xl bg-white border border-[#E2D6C3] shadow-2xl p-6 sm:p-8 space-y-6 text-center"
            >
              <button
                type="button"
                onClick={() => setShowQrModal(false)}
                className="absolute top-5 right-5 w-8 h-8 rounded-full bg-[#F7F2E7] border border-[#E2D6C3] flex items-center justify-center text-[#7A695B] hover:text-[#1C120C] cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="space-y-1">
                <span className="text-[10px] font-mono tracking-widest text-[#FF4800] uppercase font-bold">
                  VERIFIED PASS QR
                </span>
                <h3 className="font-clash font-bold text-2xl text-[#1C120C]">
                  {activeCustomer.name}
                </h3>
                <p className="text-xs font-mono text-[#7A695B]">
                  Scan at counter to associate bill and record stamps
                </p>
              </div>

              {/* Crisp SVG QR Code */}
              <div className="p-4 rounded-3xl bg-[#F7F2E7] border border-[#E2D6C3] shadow-inner inline-block">
                <svg viewBox="0 0 100 100" className="w-48 h-48">
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

              <div className="space-y-1 font-mono text-xs">
                <div className="text-[#7A695B]">VAL-{activeCustomer.phone}</div>
                <div className="text-[#FF4800] font-bold">{activeCustomer.stamps} / {totalSlots} Stamps Recorded</div>
              </div>

              <button
                type="button"
                onClick={() => setShowQrModal(false)}
                className="w-full py-3 rounded-2xl bg-[#1C120C] hover:bg-black text-xs font-mono text-[#FFFDF9] cursor-pointer"
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
