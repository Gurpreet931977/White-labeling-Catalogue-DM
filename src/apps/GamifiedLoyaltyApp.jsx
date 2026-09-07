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
  Zap,
  X,
  ShieldCheck,
  Maximize2
} from 'lucide-react';
import { sounds } from '../utils/audio';
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
  // Primary View Mode: 'customer' (Priority consumer pass) vs 'admin' (Terminal)
  const [viewMode, setViewMode] = useState('customer');

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

  // Ensure mobile viewports strictly stay in customer mode (no admin on mobile)
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768 && viewMode === 'admin') {
        setViewMode('customer');
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [viewMode]);

  // Ensure non-admin accounts cannot stay in admin mode
  useEffect(() => {
    if (viewMode === 'admin' && !activeCustomer?.isAdmin) {
      setViewMode('customer');
    }
  }, [selectedCustomerId, viewMode]);

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
      isAdmin: true,
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
    setTimeout(() => setFeedbackToast(null), 3200);
  };

  const handleToggleSound = () => {
    const nextState = !isSoundOn;
    setIsSoundOn(nextState);
    sounds.toggleSound(nextState);
    if (nextState) sounds.playClick();
  };

  const triggerMilestoneConfetti = () => {
    sounds.playConfetti();
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#7A1F1F', '#E5A93C', '#F2ECD8', '#B33939']
    });
  };

  return (
    <div className="min-h-screen bg-[#F2ECD8] text-[#1F1614] font-sans antialiased selection:bg-[#7A1F1F] selection:text-[#F2ECD8] pb-24 sm:pb-20 relative">
      
      {/* =================================================================== */}
      {/* 1. BRUTALIST EDITORIAL MASTHEAD                                     */}
      {/* =================================================================== */}
      <header className="sticky top-0 z-40 bg-[#FAF6EA] border-b-3 border-[#1F1614] shadow-[0_4px_0_#1F1614]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-4">
          
          {/* Brand Wordmark + Archival Tag */}
          <div className="flex items-center gap-3">
            {onBackToCatalogue && (
              <button
                type="button"
                onClick={() => {
                  sounds.playClick();
                  onBackToCatalogue();
                }}
                className="p-2 rounded-xl bg-[#FAF6EA] hover:bg-white text-[#1F1614] border-2 border-[#1F1614] transition cursor-pointer shadow-[2px_2px_0px_#1F1614]"
                title="Back to Catalogue"
              >
                <ArrowLeft className="w-4 h-4 stroke-[3]" />
              </button>
            )}

            <div className="flex items-baseline gap-2">
              <span className="font-syne font-black text-3xl sm:text-4xl tracking-tighter text-[#7A1F1F] leading-none select-none">
                VALENCE
              </span>
              <span className="hidden sm:inline px-2 py-0.5 rounded bg-[#1F1614] text-[#E5A93C] font-mono text-[9px] font-black uppercase tracking-widest">
                VERIFIED ARCHIVE // 2026
              </span>
            </div>
          </div>

          {/* Right Controls */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* Customer Switcher (Archival Edition Picker) */}
            <div className="hidden lg:flex items-center gap-2 text-xs font-mono">
              <span className="text-[#1F1614]/70 font-black uppercase text-[10px]">MEMBER:</span>
              <select
                value={selectedCustomerId}
                onChange={(e) => {
                  sounds.playClick();
                  setSelectedCustomerId(e.target.value);
                }}
                className="px-3 py-1.5 rounded-xl bg-[#FAF6EA] border-2 border-[#1F1614] text-[#1F1614] font-mono text-xs font-bold focus:outline-none cursor-pointer shadow-[2px_2px_0px_#1F1614]"
              >
                {customers.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name} {c.isAdmin ? '[Admin]' : ''} ({c.stamps}/{totalSlots} stamps • {c.streakDays}d streak)
                  </option>
                ))}
              </select>
            </div>

            {/* Admin Terminal Button — Visible ONLY to Admin accounts on Desktop */}
            {viewMode === 'customer' && activeCustomer?.isAdmin && (
              <button
                type="button"
                onClick={() => {
                  sounds.playClick();
                  setViewMode('admin');
                }}
                className="hidden md:inline-flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-[#7A1F1F] hover:bg-[#5C1414] text-[#F2ECD8] border-2 border-[#1F1614] font-groovy font-bold text-xs uppercase shadow-[3px_3px_0px_#1F1614] transition cursor-pointer"
                title="Enter Admin Management Console"
              >
                <Sliders className="w-3.5 h-3.5 stroke-[2.5]" />
                <span>Admin Panel</span>
              </button>
            )}

            {/* Exit Admin Mode Button */}
            {viewMode === 'admin' && (
              <button
                type="button"
                onClick={() => {
                  sounds.playClick();
                  setViewMode('customer');
                }}
                className="hidden md:inline-flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-[#FAF6EA] hover:bg-white text-[#1F1614] border-2 border-[#1F1614] font-groovy font-bold text-xs uppercase shadow-[3px_3px_0px_#1F1614] transition cursor-pointer"
                title="Return to Member View"
              >
                <ArrowLeft className="w-3.5 h-3.5 stroke-[2.5]" />
                <span>Back to Pass</span>
              </button>
            )}

            {/* Audio Toggle */}
            <button
              type="button"
              onClick={handleToggleSound}
              className="p-2 rounded-xl bg-[#FAF6EA] hover:bg-white text-[#1F1614] border-2 border-[#1F1614] transition cursor-pointer shadow-[2px_2px_0px_#1F1614]"
              title={isSoundOn ? 'Sound is ON' : 'Sound is OFF'}
            >
              {isSoundOn ? (
                <Volume2 className="w-4 h-4 text-[#7A1F1F]" />
              ) : (
                <VolumeX className="w-4 h-4 text-[#1F1614]/40" />
              )}
            </button>

          </div>

        </div>
      </header>

      {/* CONTINUOUS BRUTALIST TICKER BANNER */}
      <RetroMarqueeBanner
        text="COLLECT PUNCHES • ACCRUE VELOCITY • 5-DAY STREAK MULTIPLIER • UNLOCK 50% REWARD • PHYSICAL PASS VERIFIED • "
        variant="ink"
      />

      {/* FLOATING INTERACTIVE TOAST */}
      <AnimatePresence>
        {feedbackToast && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="fixed top-24 inset-x-0 mx-auto w-fit z-50 px-5 py-2.5 rounded-2xl bg-[#7A1F1F] text-[#F2ECD8] border-2 border-[#1F1614] font-groovy font-bold text-xs shadow-[5px_5px_0px_#1F1614] flex items-center gap-2 pointer-events-none"
          >
            <Sparkles className="w-4 h-4 text-[#E5A93C]" />
            <span>{feedbackToast}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* =================================================================== */}
      {/* MAIN BODY CONTAINER                                                 */}
      {/* =================================================================== */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-16">

        {/* --------------------------------------------------------------- */}
        {/* CUSTOMER EDITORIAL SPREAD (THE FULL BRAND EXPERIENCE)           */}
        {/* --------------------------------------------------------------- */}
        {viewMode === 'customer' && (
          <div className="space-y-16">
            
            {/* ============================================================= */}
            {/* SECTION 01: HERO GRAPHIC SPREAD & COLLECTIBLE PASS ARTIFACT   */}
            {/* ============================================================= */}
            <section id="section-pass" className="relative space-y-6">
              
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                
                {/* LEFT HERO: Massive Poster Typography & Visual Statement */}
                <div className="lg:col-span-7 space-y-4">
                  
                  {/* Technical Coordinates Annotation */}
                  <div className="flex items-center gap-2 text-[10px] font-mono font-black text-[#7A1F1F]/70 uppercase tracking-[0.22em]">
                    <span>ARCHIVE // 01</span>
                    <span>•</span>
                    <span>COORDINATES: 28.6139° N</span>
                    <span>•</span>
                    <span>REGISTERED CITIZEN</span>
                  </div>

                  {/* Giant Editorial Member Name */}
                  <h1 className="font-syne font-black text-6xl sm:text-7xl lg:text-8xl text-[#7A1F1F] tracking-tighter leading-[0.85] uppercase select-none">
                    {activeCustomer.name.split(' ')[0]}
                    <br />
                    <span className="text-[#1F1614] hover:text-[#7A1F1F] transition-colors">
                      {activeCustomer.name.split(' ').slice(1).join(' ') || 'MEMBER'}
                    </span>
                  </h1>

                  {/* Overlapping Mustard XP Badge */}
                  <div className="pt-2 flex items-center gap-3 flex-wrap">
                    <div className="inline-flex items-center gap-3 px-5 py-2.5 rounded-2xl bg-[#E5A93C] text-[#1F1614] border-3 border-[#1F1614] shadow-[4px_4px_0px_#1F1614] transform -rotate-1 hover:rotate-0 transition-transform">
                      <span className="font-groovy font-black text-2xl tracking-wide uppercase">
                        {activeCustomer.xp || 420} XP
                      </span>
                      <span className="h-5 w-[2px] bg-[#1F1614]" />
                      <span className="font-mono text-xs font-black uppercase tracking-wider">
                        {activeTier.badge} // LEVEL {activeTier.level}
                      </span>
                    </div>

                    <div className="inline-flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-[#FAF6EA] text-[#7A1F1F] border-2 border-[#1F1614] font-mono text-xs font-bold shadow-[2px_2px_0px_#1F1614]">
                      <Flame className="w-4 h-4 fill-[#7A1F1F] text-[#7A1F1F]" />
                      <span>{activeCustomer.streakDays || 5}D STREAK VELOCITY</span>
                    </div>
                  </div>

                  {/* Editorial Anchor Navigation Jump Marks */}
                  <div className="pt-4 space-y-2">
                    <span className="font-mono text-[10px] uppercase font-black tracking-widest text-[#1F1614]/60 block">
                      ARCHIVAL DIRECTORY // QUICK JUMP
                    </span>
                    <div className="flex flex-wrap items-center gap-2">
                      {[
                        { href: '#section-pass', label: '01 / PASS' },
                        { href: '#section-matrix', label: '02 / MATRIX' },
                        { href: '#section-vault', label: '03 / TOKENS' },
                        { href: '#section-ledger', label: '04 / DOCKET' },
                        { href: '#section-dossier', label: '05 / DOSSIER' }
                      ].map((item) => (
                        <a
                          key={item.href}
                          href={item.href}
                          onClick={() => sounds.playClick()}
                          className="px-3.5 py-1.5 rounded-xl bg-[#FAF6EA] hover:bg-white text-[#1F1614] border-2 border-[#1F1614] text-[11px] font-mono font-black tracking-wider uppercase shadow-[2px_2px_0px_#1F1614] transition-all hover:-translate-y-0.5"
                        >
                          {item.label}
                        </a>
                      ))}
                    </div>
                  </div>

                </div>

                {/* RIGHT HERO: The Collectible Physical Archival Pass */}
                <div className="lg:col-span-5">
                  <div className="transform lg:rotate-1 hover:rotate-0 transition-transform duration-300">
                    <ValenceHeroPass
                      customer={activeCustomer}
                      tier={activeTier}
                      totalSlots={totalSlots}
                      onShowQrModal={() => setShowQrModal(true)}
                    />
                  </div>
                </div>

              </div>

            </section>

            {/* EDITORIAL DIVIDER MARK */}
            <div className="flex items-center justify-between text-xs font-mono font-black text-[#1F1614]/40 select-none py-2 border-y-2 border-dashed border-[#1F1614]/20">
              <span>+ + REGISTRATION: 02 // PUNCH MATRIX + +</span>
              <span className="hidden sm:inline">VALENCE CULTURAL SYSTEM</span>
              <span>INDEX: 02/05</span>
            </div>

            {/* ============================================================= */}
            {/* SECTION 02: THE STAMP PUNCH MATRIX (Physical Ink System)      */}
            {/* ============================================================= */}
            <div id="section-matrix">
              <ValenceStampJourney
                customer={activeCustomer}
                totalSlots={totalSlots}
                currentGift={activeGift}
                hasStreakBonus={hasStreakBonus}
                onSlotClick={(slotNum) => {
                  if (slotNum <= (activeCustomer.stamps || 0)) {
                    sounds.playStampSquish();
                    showToast(`Punch #${slotNum} verified in archival ledger.`);
                  } else {
                    sounds.playClick();
                    showToast(`Punch #${slotNum} unlocks on your next billing visit.`);
                  }
                }}
                onClaimMilestone={() => {
                  triggerMilestoneConfetti();
                  showToast(`Milestone Reward Unlocked: ${activeGift.title}! Present at counter.`);
                }}
              />
            </div>

            {/* EDITORIAL DIVIDER MARK */}
            <div className="flex items-center justify-between text-xs font-mono font-black text-[#1F1614]/40 select-none py-2 border-y-2 border-dashed border-[#1F1614]/20">
              <span>+ + PRIVILEGES: 03 // ARCHIVAL TOKENS + +</span>
              <span className="hidden sm:inline">NON-COMMERCIAL VOUCHERS</span>
              <span>INDEX: 03/05</span>
            </div>

            {/* ============================================================= */}
            {/* SECTION 03: PERKS & VOUCHER VAULT (Perforated Ticket Stubs)   */}
            {/* ============================================================= */}
            <div id="section-vault">
              <ValenceRewardsVault
                customer={activeCustomer}
                totalSlots={totalSlots}
                currentGift={activeGift}
              />
            </div>

            {/* EDITORIAL DIVIDER MARK */}
            <div className="flex items-center justify-between text-xs font-mono font-black text-[#1F1614]/40 select-none py-2 border-y-2 border-dashed border-[#1F1614]/20">
              <span>+ + LEDGER: 04 // SETTLED DOCKET AUDIT + +</span>
              <span className="hidden sm:inline">THERMAL PRINT REGISTRY</span>
              <span>INDEX: 04/05</span>
            </div>

            {/* ============================================================= */}
            {/* SECTION 04: SETTLED ACTIVITY DOCKET                           */}
            {/* ============================================================= */}
            <div id="section-ledger">
              <ValenceActivityLedger customer={activeCustomer} />
            </div>

            {/* EDITORIAL DIVIDER MARK */}
            <div className="flex items-center justify-between text-xs font-mono font-black text-[#1F1614]/40 select-none py-2 border-y-2 border-dashed border-[#1F1614]/20">
              <span>+ + DOSSIER: 05 // CREDENTIALS & CADRES + +</span>
              <span className="hidden sm:inline">AUTHENTICATED IDENTITY</span>
              <span>INDEX: 05/05</span>
            </div>

            {/* ============================================================= */}
            {/* SECTION 05: MEMBER DOSSIER & PROGRESSION LADDER               */}
            {/* ============================================================= */}
            <div id="section-dossier">
              <ValenceMemberAccount
                customer={activeCustomer}
                isSoundOn={isSoundOn}
                onToggleSound={handleToggleSound}
              />
            </div>

          </div>
        )}

        {/* --------------------------------------------------------------- */}
        {/* ADMIN CONSOLE EXPERIENCE (PRODUCTIVITY & BILLING TERMINAL)      */}
        {/* --------------------------------------------------------------- */}
        {viewMode === 'admin' && (
          <div className="space-y-6">
            
            {/* Admin Sub-Navigation */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-b-3 border-[#1F1614] pb-4">
              <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
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
                    className={`px-5 py-2.5 rounded-2xl text-xs font-groovy uppercase tracking-wider whitespace-nowrap transition cursor-pointer border-2 border-[#1F1614] ${
                      adminTab === tab.id
                        ? 'bg-[#7A1F1F] text-[#F2ECD8] shadow-[3px_3px_0px_#1F1614]'
                        : 'bg-[#FAF6EA] text-[#1F1614] hover:bg-white shadow-[2px_2px_0px_#1F1614]'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              <button
                type="button"
                onClick={() => {
                  sounds.playClick();
                  setViewMode('customer');
                }}
                className="hidden md:inline-flex items-center gap-1.5 px-4 py-2.5 rounded-2xl bg-[#FAF6EA] hover:bg-white text-[#1F1614] border-2 border-[#1F1614] font-groovy font-bold text-xs uppercase shadow-[2px_2px_0px_#1F1614] transition cursor-pointer"
                title="Return to Member Pass"
              >
                <ArrowLeft className="w-3.5 h-3.5 stroke-[2.5]" />
                <span>Exit Admin</span>
              </button>
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
                  showToast(`Transaction settled! +${res.stampsAwarded} punches synchronized to ${res.customer.name}.`);
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

      {/* =================================================================== */}
      {/* FULL-SCREEN ARCHIVAL QR PASS MODAL                                  */}
      {/* =================================================================== */}
      <AnimatePresence>
        {showQrModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative w-full max-w-sm rounded-3xl bg-[#FAF6EA] border-3 border-[#1F1614] shadow-[12px_12px_0px_#1F1614] p-6 sm:p-8 space-y-6 text-center"
            >
              <button
                type="button"
                onClick={() => setShowQrModal(false)}
                className="absolute top-5 right-5 w-9 h-9 rounded-full bg-[#7A1F1F] text-[#F2ECD8] flex items-center justify-center hover:bg-[#5C1414] cursor-pointer border border-[#1F1614]"
              >
                <X className="w-4 h-4 stroke-[3]" />
              </button>

              <div className="space-y-1">
                <span className="text-[10px] font-mono tracking-widest text-[#7A1F1F] uppercase font-black">
                  VERIFIED OPTICAL PASS
                </span>
                <h3 className="font-groovy font-black text-3xl text-[#1F1614]">
                  {activeCustomer.name}
                </h3>
                <p className="text-xs font-mono text-[#1F1614]/70">
                  Scan at checkout to associate bill and record punches
                </p>
              </div>

              {/* Optical QR Code with Brutalist Framing */}
              <div className="p-4 rounded-3xl bg-white shadow-md border-3 border-[#1F1614] inline-block">
                <svg viewBox="0 0 100 100" className="w-48 h-48">
                  {/* Outer Frame */}
                  <rect x="5" y="5" width="30" height="30" fill="none" stroke="#7A1F1F" strokeWidth="6" rx="4" />
                  <rect x="14" y="14" width="12" height="12" fill="#7A1F1F" rx="2" />
                  
                  <rect x="65" y="5" width="30" height="30" fill="none" stroke="#7A1F1F" strokeWidth="6" rx="4" />
                  <rect x="74" y="14" width="12" height="12" fill="#7A1F1F" rx="2" />
                  
                  <rect x="5" y="65" width="30" height="30" fill="none" stroke="#7A1F1F" strokeWidth="6" rx="4" />
                  <rect x="14" y="74" width="12" height="12" fill="#7A1F1F" rx="2" />
                  
                  {/* Dynamic Pixel Modules */}
                  <rect x="44" y="8" width="6" height="6" fill="#1F1614" />
                  <rect x="52" y="16" width="6" height="6" fill="#1F1614" />
                  <rect x="44" y="24" width="6" height="6" fill="#1F1614" />
                  
                  <rect x="10" y="44" width="6" height="6" fill="#1F1614" />
                  <rect x="20" y="52" width="6" height="6" fill="#1F1614" />
                  <rect x="28" y="44" width="6" height="6" fill="#1F1614" />
                  
                  <rect x="42" y="42" width="16" height="16" fill="#7A1F1F" rx="2" />
                  <rect x="46" y="46" width="8" height="8" fill="#E5A93C" rx="1" />
                  
                  <rect x="68" y="44" width="6" height="6" fill="#1F1614" />
                  <rect x="76" y="52" width="6" height="6" fill="#1F1614" />
                  <rect x="84" y="44" width="6" height="6" fill="#1F1614" />
                  
                  <rect x="44" y="68" width="6" height="6" fill="#1F1614" />
                  <rect x="52" y="76" width="6" height="6" fill="#1F1614" />
                  <rect x="44" y="84" width="6" height="6" fill="#1F1614" />
                  
                  <rect x="68" y="68" width="8" height="8" fill="#1F1614" />
                  <rect x="80" y="72" width="8" height="8" fill="#1F1614" />
                  <rect x="72" y="84" width="8" height="8" fill="#1F1614" />
                  <rect x="84" y="84" width="8" height="8" fill="#1F1614" />
                </svg>
              </div>

              {/* Technical Identifier */}
              <div className="space-y-1">
                <span className="font-mono text-sm font-black text-[#1F1614] tracking-widest block">
                  VAL-{activeCustomer.phone}
                </span>
                <span className="text-[10px] font-mono text-[#1F1614]/60 uppercase">
                  SECURITY KEY: {activeCustomer.id}
                </span>
              </div>

              {/* Simulation Test Button */}
              <button
                type="button"
                onClick={() => {
                  sounds.playScanSuccess();
                  showToast('Optical scan verified! Beep triggered.');
                }}
                className="w-full py-3 rounded-2xl bg-[#E5A93C] hover:bg-[#F8CF75] text-[#1F1614] font-groovy font-bold text-xs uppercase border-2 border-[#1F1614] shadow-[3px_3px_0px_#1F1614] cursor-pointer transition-all flex items-center justify-center gap-2"
              >
                <Zap className="w-4 h-4 fill-current" />
                <span>SIMULATE COUNTER SCAN SOUND</span>
              </button>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
