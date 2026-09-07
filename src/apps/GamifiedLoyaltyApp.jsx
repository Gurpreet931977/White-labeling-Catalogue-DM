import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { 
  Award, 
  Sparkles, 
  Check, 
  Coffee, 
  Gift, 
  Flame, 
  RotateCcw, 
  ArrowLeft, 
  ArrowRight, 
  Layers, 
  QrCode, 
  Smartphone, 
  Tablet, 
  CheckCircle2, 
  Clock, 
  ShieldCheck, 
  Volume2, 
  VolumeX, 
  Share2, 
  Star, 
  Zap, 
  ChevronRight,
  X,
  Scan,
  Store,
  Percent,
  Sliders,
  Users,
  Receipt,
  Printer,
  UserCheck,
  Plus,
  Lock,
  Search,
  CheckCheck
} from 'lucide-react';
import { sounds } from '../utils/audio';
import { 
  LottieSteamingCup, 
  LottieJigglyCroissant, 
  LottieStreakFlame, 
  LottieCoffeeBean, 
  LottieBouncyDonut, 
  LottieMysteryBox, 
  JigglyStampMark 
} from '../components/loyalty/GamifiedLottieIcons';
import { CafeBillingPOS } from '../components/loyalty/CafeBillingPOS';
import { ModelSwitcherModal } from '../components/common/ModelSwitcherModal';
import { 
  LOYALTY_GIFTS_POOL,
  getLoyaltyAdminConfig,
  saveLoyaltyAdminConfig,
  getLoyaltyCustomers,
  saveLoyaltyCustomer,
  getLoyaltyCustomer,
  processBillingTransaction,
  resetCustomerCard,
  getGiftById,
  getRandomGift
} from '../utils/loyaltyStorage';

export function GamifiedLoyaltyApp({ onBackToVariants, onBackToCatalogue }) {
  // Theme Mode: 'coffee' (Espresso Roastery) vs 'bakery' (Artisan Patisserie)
  const [themeMode, setThemeMode] = useState('coffee');
  
  // View Mode: 'customer' (Customer Pass) vs 'pos_admin' (Cafe Admin & POS Terminal)
  const [viewMode, setViewMode] = useState('customer');

  // Admin Sub-Tab: 'billing' (Order Billing POS & Bill Printing) vs 'settings' (Capacity & Customers)
  const [adminSubTab, setAdminSubTab] = useState('billing');

  // Centralized State from loyaltyStorage
  const [adminConfig, setAdminConfig] = useState(() => getLoyaltyAdminConfig());
  const [customers, setCustomers] = useState(() => getLoyaltyCustomers());
  const [selectedCustomerId, setSelectedCustomerId] = useState(() => {
    const list = getLoyaltyCustomers();
    return list[0]?.id || 'cust-1';
  });

  const [soundEnabled, setSoundEnabled] = useState(true);
  const [isModelSwitcherOpen, setIsModelSwitcherOpen] = useState(false);
  const [feedbackToast, setFeedbackToast] = useState(null);

  // Mystery Treat State
  const [mysteryRevealed, setMysteryRevealed] = useState(false);
  const [mysteryShaking, setMysteryShaking] = useState(false);
  const [mysteryReward, setMysteryReward] = useState(null);

  // Active Voucher Modal
  const [activeRedemptionVoucher, setActiveRedemptionVoucher] = useState(null);
  const [redemptionTimer, setRedemptionTimer] = useState(300);

  // POS Billing Form State
  const [posSelectedCustomerId, setPosSelectedCustomerId] = useState('cust-1');
  const [posBillAmount, setPosBillAmount] = useState('380');
  const [posBillItems, setPosBillItems] = useState('1x Flat White + 1x Butter Croissant');
  const [posRecentReceipt, setPosRecentReceipt] = useState(null);

  // Admin New Customer Modal
  const [isAddCustomerOpen, setIsAddCustomerOpen] = useState(false);
  const [newCustomerName, setNewCustomerName] = useState('');
  const [newCustomerPhone, setNewCustomerPhone] = useState('');
  const [newCustomerGift, setNewCustomerGift] = useState('discount50');

  // Customer History Modal
  const [historyCustomer, setHistoryCustomer] = useState(null);

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

  // Active customer object
  const currentCustomer = customers.find((c) => c.id === selectedCustomerId) || customers[0] || {
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

  const currentGift = getGiftById(currentCustomer.assignedGiftId || 'discount50');

  // Countdown timer for active voucher
  useEffect(() => {
    let interval = null;
    if (activeRedemptionVoucher && redemptionTimer > 0) {
      interval = setInterval(() => {
        setRedemptionTimer((prev) => (prev > 0 ? prev - 1 : 0));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [activeRedemptionVoucher, redemptionTimer]);

  const triggerConfetti = () => {
    confetti({
      particleCount: 80,
      spread: 75,
      origin: { y: 0.6 },
      colors: ['#ebd73f', '#ca8a04', '#f59e0b', '#f472b6', '#ffffff']
    });
  };

  const showToast = (message) => {
    setFeedbackToast(message);
    setTimeout(() => setFeedbackToast(null), 3500);
  };

  // When customer taps an unstamped slot in Customer Pass View:
  // "ofcourse customer should not be able to mark the stamps."
  const handleCustomerSlotClick = (slotIndex) => {
    sounds.playClick();
    if (slotIndex > currentCustomer.stamps) {
      showToast('🔒 Stamps are marked automatically when the cafe settles your bill!');
    } else {
      showToast(`✓ Stamp #${slotIndex} earned from your past visit billing!`);
    }
  };

  // Barista POS Settle Bill & Auto-Mark Stamps Action
  const handlePosSettleBill = (e) => {
    e.preventDefault();
    sounds.playClick();

    const result = processBillingTransaction({
      customerId: posSelectedCustomerId,
      billAmount: posBillAmount,
      billItems: posBillItems
    });

    if (result) {
      sounds.playStampSquish();
      setCustomers(getLoyaltyCustomers());
      setPosRecentReceipt(result);

      if (result.hasStreakBonus) {
        showToast(`⚡ 5-Day Streak Active! +2 STAMPS marked for ${result.customer.name}!`);
      } else {
        showToast(`✨ +1 Stamp marked for ${result.customer.name}!`);
      }

      if (result.isRewardUnlocked) {
        setTimeout(() => {
          sounds.playRewardFanfare();
          triggerConfetti();
          showToast(`🎉 MILESTONE REACHED! ${result.customer.name} unlocked their Free Gift!`);
        }, 500);
      }
    }
  };

  // Admin: Change Stamp Length (6 default, up to 12)
  const handleTotalStampsChange = (newTotal) => {
    sounds.playClick();
    const updated = saveLoyaltyAdminConfig({ totalStamps: newTotal });
    setAdminConfig(updated);
    showToast(`Stamp card capacity updated to ${newTotal} stamps!`);
  };

  // Admin: Assign specific Free Gift to customer
  const handleCustomerGiftChange = (customerId, newGiftId) => {
    sounds.playClick();
    const cust = customers.find((c) => c.id === customerId);
    if (cust) {
      const updatedCust = { ...cust, assignedGiftId: newGiftId };
      saveLoyaltyCustomer(updatedCust);
      setCustomers(getLoyaltyCustomers());
      const gift = getGiftById(newGiftId);
      showToast(`Assigned "${gift.title}" to ${cust.name}!`);
    }
  };

  // Admin: Quick adjust customer stamps (+1 / -1)
  const handleAdjustStamps = (customerId, delta) => {
    sounds.playClick();
    const cust = customers.find((c) => c.id === customerId);
    if (!cust) return;
    const nextStamps = Math.max(0, Math.min(adminConfig.totalStamps, (cust.stamps || 0) + delta));
    const updatedCust = { ...cust, stamps: nextStamps };
    saveLoyaltyCustomer(updatedCust);
    setCustomers(getLoyaltyCustomers());
    showToast(`Updated ${cust.name} to ${nextStamps}/${adminConfig.totalStamps} stamps.`);
  };

  // Admin: Create new customer
  const handleCreateCustomer = (e) => {
    e.preventDefault();
    if (!newCustomerName || !newCustomerPhone) return;

    sounds.playSuccess();
    const newCust = {
      id: `cust-${Date.now()}`,
      name: newCustomerName,
      phone: newCustomerPhone,
      stamps: 0,
      streakDays: 1,
      xp: 50,
      assignedGiftId: newCustomerGift || 'discount50',
      billingHistory: [],
      redeemedVouchers: []
    };

    saveLoyaltyCustomer(newCust);
    setCustomers(getLoyaltyCustomers());
    setSelectedCustomerId(newCust.id);
    setIsAddCustomerOpen(false);
    setNewCustomerName('');
    setNewCustomerPhone('');
    showToast(`New customer "${newCust.name}" added successfully!`);
  };

  // Customer Tier computation
  const getTier = (xp = 420) => {
    if (xp >= 650) return { name: 'Master Roaster & Baker', level: 4, icon: '👑', badge: 'DIAMOND VIP' };
    if (xp >= 350) return { name: 'Artisan Craftsman', level: 3, icon: '🥖', badge: 'GOLD MEMBER' };
    if (xp >= 150) return { name: 'Espresso Scout', level: 2, icon: '🥐', badge: 'SILVER MEMBER' };
    return { name: 'Bean Cadet', level: 1, icon: '☕', badge: 'BRONZE MEMBER' };
  };

  const currentTier = getTier(currentCustomer.xp || 420);
  const totalSlots = adminConfig.totalStamps || 6;
  const isMilestoneReached = (currentCustomer.stamps || 0) >= totalSlots;
  const stampsRemaining = Math.max(0, totalSlots - (currentCustomer.stamps || 0));

  // Streak status: 5-day streak grants 2 stamps on next billing
  const hasStreakBonus = (currentCustomer.streakDays || 0) >= (adminConfig.streakBonusThreshold || 5);

  return (
    <div className={`min-h-screen font-sans selection:bg-[#ebd73f] selection:text-black relative transition-colors duration-500 overflow-x-hidden ${
      themeMode === 'coffee' ? 'bg-[#0a0705] text-amber-50' : 'bg-[#0c0809] text-rose-50'
    }`}>
      
      {/* Dynamic Ambient Blur Glows */}
      <div className={`fixed -top-32 -left-32 w-96 h-96 rounded-full blur-[140px] pointer-events-none transition-all duration-700 ${
        themeMode === 'coffee' ? 'bg-amber-600/15' : 'bg-rose-500/15'
      }`} />
      <div className={`fixed -bottom-32 -right-32 w-96 h-96 rounded-full blur-[140px] pointer-events-none transition-all duration-700 ${
        themeMode === 'coffee' ? 'bg-yellow-500/10' : 'bg-pink-500/15'
      }`} />

      {/* Top Header Navigation */}
      <header className="sticky top-0 inset-x-0 z-40 bg-black/85 backdrop-blur-xl border-b border-white/10 px-4 sm:px-6 py-3">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-3">
          
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={() => {
                sounds.playClick();
                if (onBackToVariants) onBackToVariants();
                else if (onBackToCatalogue) onBackToCatalogue();
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/10 hover:bg-[#ebd73f] hover:text-black font-semibold text-xs transition cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Models</span>
            </button>

            <span className="hidden sm:inline-block text-white/20">•</span>

            {/* Model Switcher Button */}
            <button
              onClick={() => { sounds.playClick(); setIsModelSwitcherOpen(true); }}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#ebd73f]/15 hover:bg-[#ebd73f]/25 text-[#ebd73f] text-xs font-semibold border border-[#ebd73f]/30 transition cursor-pointer"
            >
              <Layers className="w-3.5 h-3.5" />
              <span className="hidden md:inline">ARCHETYPE // 07:</span>
              <span>Gamified Loyalty Pass</span>
              <span className="px-1.5 py-0.2 rounded bg-[#ebd73f] text-black text-[9px] font-bold">SWITCH</span>
            </button>
          </div>

          {/* Right Controls: View Switcher (Customer Pass vs Cafe POS & Admin) */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            <div className="flex items-center p-1 rounded-full bg-white/5 border border-white/10 text-xs">
              <button
                onClick={() => { sounds.playClick(); setViewMode('customer'); }}
                className={`px-3.5 py-1.5 rounded-full font-semibold transition flex items-center gap-1.5 cursor-pointer ${
                  viewMode === 'customer'
                    ? 'bg-[#ebd73f] text-black font-bold shadow-md'
                    : 'text-white/60 hover:text-white'
                }`}
              >
                <Smartphone className="w-3.5 h-3.5" />
                <span>Customer Pass</span>
              </button>
              
              <button
                onClick={() => { sounds.playClick(); setViewMode('pos_admin'); }}
                className={`px-3.5 py-1.5 rounded-full font-semibold transition flex items-center gap-1.5 cursor-pointer ${
                  viewMode === 'pos_admin'
                    ? 'bg-[#ebd73f] text-black font-bold shadow-md'
                    : 'text-white/60 hover:text-white'
                }`}
              >
                <Receipt className="w-3.5 h-3.5" />
                <span>Cafe Admin &amp; Billing</span>
              </button>
            </div>

            {/* Sound Toggle */}
            <button
              onClick={() => {
                const state = sounds.toggleSound();
                setSoundEnabled(state);
              }}
              className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-white/70 hover:text-white transition cursor-pointer"
              title={soundEnabled ? 'Mute Sounds' : 'Unmute Sounds'}
            >
              {soundEnabled ? <Volume2 className="w-4 h-4 text-[#ebd73f]" /> : <VolumeX className="w-4 h-4 text-slate-500" />}
            </button>

          </div>

        </div>
      </header>

      {/* Floating Interactive Toast Feedback */}
      <AnimatePresence>
        {feedbackToast && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.9 }}
            className="fixed top-18 inset-x-0 mx-auto w-fit z-50 px-5 py-2.5 rounded-full bg-gradient-to-r from-amber-400 to-yellow-500 text-slate-950 font-bold text-xs shadow-2xl shadow-amber-500/40 flex items-center gap-2 pointer-events-none"
          >
            <Sparkles className="w-4 h-4" />
            <span>{feedbackToast}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Container */}
      <main className="max-w-4xl mx-auto px-4 py-6 space-y-6">
        
        {/* Sub-Header / Niche Switcher Banner */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 sm:p-5 rounded-3xl bg-white/[0.03] border border-white/10 backdrop-blur-md">
          <div className="flex items-center gap-3 text-center sm:text-left">
            <div className="w-12 h-12 rounded-2xl bg-amber-400/10 border border-amber-400/20 flex items-center justify-center shrink-0">
              {themeMode === 'coffee' ? (
                <LottieSteamingCup size={36} />
              ) : (
                <LottieJigglyCroissant size={36} />
              )}
            </div>
            <div>
              <div className="flex items-center gap-2 justify-center sm:justify-start">
                <span className="text-[10px] font-mono uppercase tracking-widest text-[#ebd73f] font-bold">
                  {themeMode === 'coffee' ? 'SPECIALTY ESPRESSO ROASTERS' : 'ARTISAN SOURDOUGH & PATISSERIE'}
                </span>
                <span className="px-2 py-0.2 rounded-full bg-[#ebd73f]/20 text-[#ebd73f] text-[9px] font-mono font-bold">
                  {totalSlots}-STAMP MODEL
                </span>
              </div>
              <h2 className="font-panchang font-bold text-lg text-white">
                {themeMode === 'coffee' ? 'Brew & Bean Rewards Club' : 'Crumb & Crust Bakery Passport'}
              </h2>
            </div>
          </div>

          {/* Theme Selector Button Pills */}
          <div className="flex items-center gap-2 p-1 rounded-2xl bg-black/60 border border-white/10 shrink-0">
            <button
              onClick={() => { sounds.playClick(); setThemeMode('coffee'); }}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer ${
                themeMode === 'coffee'
                  ? 'bg-amber-400 text-slate-950 font-bold shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Coffee className="w-3.5 h-3.5" />
              <span>Coffee Shop</span>
            </button>

            <button
              onClick={() => { sounds.playClick(); setThemeMode('bakery'); }}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer ${
                themeMode === 'bakery'
                  ? 'bg-amber-400 text-slate-950 font-bold shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Store className="w-3.5 h-3.5" />
              <span>Bakery &amp; Patisserie</span>
            </button>
          </div>
        </div>

        {/* ================================================================= */}
        {/* VIEW 1: CUSTOMER MOBILE LOYALTY PASSBOOK (READ-ONLY STAMPING)     */}
        {/* ================================================================= */}
        {viewMode === 'customer' && (
          <div className="space-y-6">
            
            {/* Quick Customer Switcher Bar (For Demo Verification) */}
            <div className="p-3 rounded-2xl bg-black/40 border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs font-mono">
              <div className="flex items-center gap-2 text-slate-400">
                <Users className="w-4 h-4 text-[#ebd73f]" />
                <span>Viewing Customer Account:</span>
              </div>
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <select
                  value={selectedCustomerId}
                  onChange={(e) => {
                    sounds.playClick();
                    setSelectedCustomerId(e.target.value);
                  }}
                  className="px-3 py-1.5 rounded-xl bg-slate-900 border border-white/20 text-white font-mono text-xs focus:outline-none focus:border-[#ebd73f] cursor-pointer w-full sm:w-auto"
                >
                  {customers.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} ({c.phone}) • {c.stamps}/{totalSlots} Stamps
                    </option>
                  ))}
                </select>

                <button
                  onClick={() => {
                    sounds.playClick();
                    setHistoryCustomer(currentCustomer);
                  }}
                  className="px-2.5 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white text-xs whitespace-nowrap transition cursor-pointer flex items-center gap-1"
                >
                  <Receipt className="w-3.5 h-3.5" />
                  <span>Bills</span>
                </button>
              </div>
            </div>

            {/* VIP Member Card (Apple/Google Wallet Style) */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="relative rounded-3xl overflow-hidden p-6 sm:p-8 border border-amber-400/30 shadow-2xl bg-gradient-to-br from-stone-900 via-stone-950 to-black text-white"
            >
              {/* Card Ambient Shimmer Background */}
              <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

              {/* Card Top Row */}
              <div className="flex items-start justify-between relative z-10">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-mono text-[#ebd73f] tracking-widest uppercase font-bold">
                      {themeMode === 'coffee' ? 'VIP ROASTERY PASS' : 'GOLDEN CRUST CLUB'}
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-amber-400/15 text-amber-300 font-mono text-[9px] font-bold border border-amber-400/30">
                      {currentTier.badge}
                    </span>
                  </div>
                  <h3 className="font-panchang font-black text-2xl sm:text-3xl text-white">
                    {currentCustomer.name}
                  </h3>
                  <p className="text-xs font-mono text-slate-400">
                    ID: #{currentCustomer.phone} • Scan at checkout to earn stamps
                  </p>
                </div>

                {/* Interactive Mascot with Jiggly Spring Physics */}
                <div className="flex flex-col items-center">
                  {themeMode === 'coffee' ? (
                    <LottieSteamingCup size={64} className="hover:animate-jiggle" />
                  ) : (
                    <LottieJigglyCroissant size={64} className="hover:animate-jiggle" />
                  )}
                  <span className="text-[9px] font-mono text-amber-400/80 mt-1">
                    Tap to jiggle!
                  </span>
                </div>
              </div>

              {/* XP & Level Progress Bar */}
              <div className="mt-6 pt-5 border-t border-white/10 space-y-2 relative z-10">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5 font-bold font-syne text-white">
                    <span>{currentTier.icon}</span>
                    <span>Tier: {currentTier.name}</span>
                  </div>
                  <span className="font-mono text-[#ebd73f] font-bold">{currentCustomer.xp || 420} / 650 XP</span>
                </div>

                <div className="h-3 w-full rounded-full bg-white/10 overflow-hidden p-0.5 border border-white/10">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min(100, ((currentCustomer.xp || 420) / 650) * 100)}%` }}
                    transition={{ duration: 1, ease: 'easeOut' }}
                    className="h-full rounded-full bg-gradient-to-r from-amber-400 via-yellow-400 to-[#ebd73f] shadow-glow-yellow"
                  />
                </div>
              </div>

              {/* Quick Card Stats Pill Row */}
              <div className="mt-5 grid grid-cols-3 gap-2.5 pt-2 relative z-10">
                <div className="p-3 rounded-2xl bg-white/[0.04] border border-white/5 text-center">
                  <span className="text-[10px] font-mono text-slate-400 block">Stamps Marked</span>
                  <span className="font-panchang font-bold text-lg text-[#ebd73f]">{currentCustomer.stamps || 0} / {totalSlots}</span>
                </div>
                
                <div className="p-3 rounded-2xl bg-white/[0.04] border border-white/5 text-center">
                  <span className="text-[10px] font-mono text-slate-400 block">Current Streak</span>
                  <span className="font-panchang font-bold text-lg text-orange-400 flex items-center justify-center gap-1">
                    <span>{currentCustomer.streakDays || 1}</span>
                    <Flame className="w-4 h-4 fill-orange-400" />
                  </span>
                </div>

                <div className="p-3 rounded-2xl bg-white/[0.04] border border-white/5 text-center">
                  <span className="text-[10px] font-mono text-slate-400 block">Milestone Status</span>
                  <span className={`font-panchang font-bold text-xs sm:text-sm mt-1 block ${
                    isMilestoneReached ? 'text-emerald-400 animate-pulse' : 'text-amber-300'
                  }`}>
                    {isMilestoneReached ? '🎉 Ready to Claim!' : `${stampsRemaining} to Unlock`}
                  </span>
                </div>
              </div>

            </motion.div>

            {/* ============================================================= */}
            {/* TARGET FREE GIFT TRANSPARENCY BANNER                          */}
            {/* ============================================================= */}
            <div className="p-5 sm:p-6 rounded-3xl bg-gradient-to-r from-amber-500/15 via-yellow-500/10 to-transparent border-2 border-amber-400/50 shadow-xl space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-amber-400 text-black flex items-center justify-center font-black shrink-0 shadow-lg shadow-amber-400/20">
                    {currentGift.id === 'discount50' ? (
                      <Percent className="w-6 h-6 stroke-[3]" />
                    ) : currentGift.type === 'beverage' ? (
                      <Coffee className="w-6 h-6 stroke-[2.5]" />
                    ) : (
                      <Gift className="w-6 h-6 stroke-[2.5]" />
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-amber-400 text-black">
                        YOUR ASSIGNED REWARD
                      </span>
                      <span className="text-xs font-mono text-amber-300 font-bold">
                        Slot #{totalSlots} Milestone
                      </span>
                    </div>
                    <h3 className="font-panchang font-bold text-lg sm:text-xl text-white mt-1">
                      {currentGift.title}
                    </h3>
                    <p className="text-xs text-slate-300 font-clash mt-0.5">
                      {currentGift.desc}
                    </p>
                  </div>
                </div>

                {/* Milestone Claim or Countdown Button */}
                <div className="shrink-0 self-start sm:self-center">
                  {isMilestoneReached ? (
                    <button
                      onClick={() => {
                        sounds.playRewardFanfare();
                        triggerConfetti();
                        setActiveRedemptionVoucher({
                          title: currentGift.title,
                          desc: currentGift.desc,
                          code: `CLAIM-${currentGift.id.toUpperCase()}`
                        });
                      }}
                      className="btn-dripp-primary px-5 py-3 text-xs font-bold flex items-center gap-2 shadow-glow-yellow cursor-pointer animate-pulse"
                    >
                      <Gift className="w-4 h-4" />
                      <span>Claim Free Gift Now</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  ) : (
                    <div className="px-4 py-2.5 rounded-2xl bg-black/60 border border-white/10 text-right">
                      <span className="text-[10px] font-mono text-slate-400 block">Stamps to Free Gift</span>
                      <span className="font-mono text-amber-400 font-bold text-sm">
                        {stampsRemaining} more {stampsRemaining === 1 ? 'stamp' : 'stamps'}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Notice that billing automatically marks stamps */}
              <div className="pt-2 border-t border-white/10 flex items-center justify-between text-[11px] font-mono text-slate-400">
                <span className="flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Stamps mark automatically on each bill paid at counter or online.</span>
                </span>
                <span className="text-[#ebd73f] font-bold">1 Bill = +1 Stamp</span>
              </div>
            </div>

            {/* ============================================================= */}
            {/* 5-DAY STREAK SPEED-UP HIGHLIGHT CARD                          */}
            {/* ============================================================= */}
            <div className={`p-5 rounded-3xl border transition-all ${
              hasStreakBonus
                ? 'bg-gradient-to-r from-orange-500/20 via-amber-500/15 to-transparent border-orange-400/60 shadow-lg shadow-orange-500/20'
                : 'bg-[#111111] border-white/10'
            }`}>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-start gap-3">
                  <div className="shrink-0">
                    <LottieStreakFlame days={currentCustomer.streakDays || 1} size={48} />
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-bold uppercase text-orange-400 flex items-center gap-1">
                        <Flame className="w-4 h-4 fill-orange-400" />
                        <span>{currentCustomer.streakDays || 1}-Day Caffeine Streak</span>
                      </span>
                      {hasStreakBonus && (
                        <span className="px-2 py-0.5 rounded-full bg-orange-500 text-black text-[9px] font-mono font-bold animate-pulse">
                          ⚡ SPEED-UP ACTIVE
                        </span>
                      )}
                    </div>
                    
                    {hasStreakBonus ? (
                      <p className="text-xs sm:text-sm text-orange-200 font-clash leading-relaxed">
                        <strong>Awesome job!</strong> You maintained a 5-day streak! Your next billing will <strong>skip a day and award 2 STAMPS AT ONCE</strong>!
                      </p>
                    ) : (
                      <p className="text-xs text-slate-400 font-clash leading-relaxed">
                        Reach a 5-day streak to unlock the <strong>Speed-Up Power</strong> (earning 2 stamps at a time on your next bill).
                      </p>
                    )}
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span className="text-[10px] font-mono text-slate-400 block">Next Bill Yield</span>
                  <span className={`font-panchang font-bold text-base ${hasStreakBonus ? 'text-orange-400' : 'text-slate-300'}`}>
                    {hasStreakBonus ? '⚡ +2 STAMPS' : '+1 STAMP'}
                  </span>
                </div>
              </div>
            </div>

            {/* ============================================================= */}
            {/* DYNAMIC DIGITAL PUNCH CARD (6 TO 12 SLOTS)                    */}
            {/* ============================================================= */}
            <div className="p-6 sm:p-7 rounded-3xl bg-[#111111] border border-white/10 space-y-5">
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <Award className="w-5 h-5 text-[#ebd73f]" />
                    <h3 className="font-panchang font-bold text-lg text-white">
                      {totalSlots}-Slot Digital Punch Card
                    </h3>
                  </div>
                  <p className="text-xs text-slate-400 font-clash mt-0.5">
                    Stamps are synchronized with your cafe bills. Customer pass is read-only.
                  </p>
                </div>

                {/* Info Pill */}
                <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-mono text-slate-300">
                  <Lock className="w-3.5 h-3.5 text-[#ebd73f]" />
                  <span>Marked on checkout</span>
                </div>
              </div>

              {/* DYNAMIC STAMP GRID (Matches totalSlots: 6 to 12) */}
              <div className={`grid gap-3 sm:gap-4 pt-2 ${
                totalSlots <= 6
                  ? 'grid-cols-3 sm:grid-cols-6'
                  : totalSlots <= 8
                  ? 'grid-cols-4 sm:grid-cols-8'
                  : 'grid-cols-3 sm:grid-cols-6'
              }`}>
                {Array.from({ length: totalSlots }, (_, i) => i + 1).map((slotNumber) => {
                  const isStamped = (currentCustomer.stamps || 0) >= slotNumber;
                  const isMilestoneSlot = slotNumber === totalSlots;

                  return (
                    <motion.div
                      key={slotNumber}
                      whileHover={{ scale: 1.04 }}
                      onClick={() => handleCustomerSlotClick(slotNumber)}
                      className={`relative rounded-2xl p-3 sm:p-4 aspect-square flex flex-col items-center justify-between text-center transition-all select-none overflow-hidden border cursor-pointer ${
                        isStamped
                          ? 'bg-gradient-to-br from-amber-500/20 to-amber-950/40 border-amber-400/60 shadow-lg shadow-amber-500/10'
                          : isMilestoneSlot
                          ? 'bg-gradient-to-br from-amber-400/15 via-black to-slate-950 border-amber-400/70 ring-2 ring-amber-400/30'
                          : 'bg-black/50 border-white/10 hover:border-white/20'
                      }`}
                    >
                      {/* Slot Header */}
                      <span className="text-[10px] font-mono font-bold text-slate-400 self-start">
                        #{slotNumber}
                      </span>

                      {/* Center Graphic */}
                      <div className="flex-1 flex items-center justify-center w-full my-1">
                        {isStamped ? (
                          <JigglyStampMark
                            stampNumber={slotNumber}
                            label={isMilestoneSlot ? "FREE GIFT" : "STAMPED"}
                            isMilestone={isMilestoneSlot}
                            icon={isMilestoneSlot ? Gift : themeMode === 'coffee' ? Coffee : Check}
                          />
                        ) : isMilestoneSlot ? (
                          <div className="flex flex-col items-center animate-pulse">
                            {currentGift.id === 'discount50' ? (
                              <Percent className="w-7 h-7 text-amber-400" />
                            ) : currentGift.type === 'beverage' ? (
                              <Coffee className="w-7 h-7 text-amber-400" />
                            ) : (
                              <Gift className="w-7 h-7 text-amber-400" />
                            )}
                            <span className="text-[8px] font-syne font-bold text-amber-300 mt-1 uppercase text-center line-clamp-1">
                              {currentGift.badge}
                            </span>
                          </div>
                        ) : (
                          <div className="w-8 h-8 rounded-full border border-dashed border-white/20 flex items-center justify-center text-slate-500">
                            {themeMode === 'coffee' ? (
                              <Coffee className="w-4 h-4 opacity-40" />
                            ) : (
                              <LottieCoffeeBean size={20} />
                            )}
                          </div>
                        )}
                      </div>

                      {/* Bottom Status */}
                      <span className={`text-[9px] font-mono font-bold tracking-tight truncate max-w-full ${
                        isStamped
                          ? 'text-amber-400'
                          : isMilestoneSlot
                          ? 'text-amber-300 font-bold'
                          : 'text-slate-500'
                      }`}>
                        {isStamped ? 'STAMPED' : isMilestoneSlot ? currentGift.badge : 'Awaiting Bill'}
                      </span>
                    </motion.div>
                  );
                })}
              </div>

              {/* Card Footer Progress Bar */}
              <div className="p-3.5 rounded-2xl bg-white/[0.02] border border-white/5 flex items-center justify-between text-xs font-mono">
                <span className="text-slate-400">Card Progress:</span>
                <span className="text-[#ebd73f] font-bold">
                  {isMilestoneReached
                    ? `🎉 ALL ${totalSlots} STAMPS COLLECTED! FREE GIFT UNLOCKED!`
                    : `${stampsRemaining} more ${stampsRemaining === 1 ? 'stamp' : 'stamps'} to unlock ${currentGift.title}`}
                </span>
              </div>

            </div>

            {/* Customer Digital Pass Code & Barcode to present at Counter */}
            <div className="p-5 rounded-3xl bg-black/60 border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="space-y-1 text-center sm:text-left">
                <span className="text-[10px] font-mono text-[#ebd73f] font-bold uppercase">CHECKOUT IDENTIFIER</span>
                <h4 className="font-panchang font-bold text-base text-white">Present to Barista at Checkout</h4>
                <p className="text-xs text-slate-400 font-clash">
                  Provide mobile number <strong>{currentCustomer.phone}</strong> or scan below to auto-record your visit stamp.
                </p>
              </div>

              <div className="p-3 rounded-2xl bg-white text-black flex items-center gap-3 shrink-0 shadow-lg">
                <QrCode className="w-10 h-10" />
                <div className="font-mono text-left">
                  <span className="text-[9px] block text-slate-600 font-bold">DIGITAL PASS ID</span>
                  <span className="text-xs font-bold tracking-wider">#{currentCustomer.phone}</span>
                </div>
              </div>
            </div>

          </div>
        )}

        {/* ================================================================= */}
        {/* VIEW 2: CAFE ADMIN & COUNTER BILLING POS TERMINAL                */}
        {/* ================================================================= */}
        {viewMode === 'pos_admin' && (
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="space-y-6"
          >
            
            {/* Terminal Header Banner with Subtab Navigation */}
            <div className="p-5 rounded-3xl bg-[#111111] border-2 border-amber-400/40 shadow-2xl space-y-4">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-white/10">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-[#ebd73f] text-black flex items-center justify-center font-black shadow-lg shrink-0">
                    <Store className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono uppercase text-[#ebd73f] font-bold">
                        CAFE ADMIN &amp; BILLING TERMINAL
                      </span>
                      <span className="px-2 py-0.2 rounded-full bg-emerald-500/20 text-emerald-300 font-mono text-[9px] font-bold">
                        INTERNAL REGISTER • NO GATEWAY
                      </span>
                    </div>
                    <h3 className="font-panchang font-bold text-lg sm:text-xl text-white">
                      Counter POS Register &amp; Loyalty Workstation
                    </h3>
                  </div>
                </div>

                {/* Subtab Selectors & Add Customer */}
                <div className="flex flex-wrap items-center gap-2">
                  <div className="p-1 rounded-2xl bg-black border border-white/15 flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => { sounds.playClick(); setAdminSubTab('billing'); }}
                      className={`px-3.5 py-2 rounded-xl text-xs font-mono font-bold transition flex items-center gap-1.5 cursor-pointer ${
                        adminSubTab === 'billing'
                          ? 'bg-[#ebd73f] text-black shadow-md'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      <Printer className="w-3.5 h-3.5" />
                      <span>1. Order Billing &amp; Print</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => { sounds.playClick(); setAdminSubTab('settings'); }}
                      className={`px-3.5 py-2 rounded-xl text-xs font-mono font-bold transition flex items-center gap-1.5 cursor-pointer ${
                        adminSubTab === 'settings'
                          ? 'bg-[#ebd73f] text-black shadow-md'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      <Sliders className="w-3.5 h-3.5" />
                      <span>2. Card Capacity &amp; Registry</span>
                    </button>
                  </div>

                  <button
                    onClick={() => setIsAddCustomerOpen(true)}
                    className="btn-dripp-primary px-3.5 py-2 text-xs font-bold flex items-center gap-1.5 cursor-pointer shrink-0"
                    title="Enroll new customer at counter"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>New Customer</span>
                  </button>
                </div>
              </div>

              {/* Sub-Header Quick Feature Highlights */}
              <div className="flex flex-wrap items-center justify-between gap-3 text-xs font-mono text-slate-400 pt-1">
                <div className="flex items-center gap-4">
                  <span className="flex items-center gap-1.5 text-slate-300">
                    <Printer className="w-3.5 h-3.5 text-[#ebd73f]" />
                    <span>80mm Thermal Receipt Direct Print</span>
                  </span>
                  <span className="hidden sm:inline text-white/20">•</span>
                  <span className="flex items-center gap-1.5 text-slate-300">
                    <Percent className="w-3.5 h-3.5 text-emerald-400" />
                    <span>5% Cafe GST Split (2.5% CGST + 2.5% SGST)</span>
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-white">Active Card: <strong className="text-[#ebd73f]">{totalSlots} Stamps</strong></span>
                  <span className="text-orange-400 font-bold bg-orange-500/10 px-2 py-0.5 rounded border border-orange-500/30">
                    🔥 5d Streak = +2 Stamps (Skips a Day)
                  </span>
                </div>
              </div>
            </div>

            {/* ============================================================= */}
            {/* SUBTAB 1: DEDICATED ORDER BILLING, GST & THERMAL BILL PRINTING*/}
            {/* ============================================================= */}
            {adminSubTab === 'billing' && (
              <CafeBillingPOS
                customers={customers}
                selectedCustomerId={selectedCustomerId}
                onSelectCustomer={(id) => {
                  setSelectedCustomerId(id);
                  setPosSelectedCustomerId(id);
                }}
                onBillSettled={(invoice) => {
                  setCustomers(getLoyaltyCustomers());
                  sounds.playStampSquish();
                  if (invoice.loyaltyResult?.hasStreakBonus) {
                    showToast(`⚡ 5-Day Streak Active! +2 STAMPS awarded to ${invoice.customer?.name}!`);
                  } else {
                    showToast(`✨ Receipt printed! +1 Stamp awarded to ${invoice.customer?.name}! Total: ${invoice.customer?.stamps}/${totalSlots}`);
                  }
                  if (invoice.loyaltyResult?.isRewardUnlocked) {
                    setTimeout(() => {
                      sounds.playRewardFanfare();
                      triggerConfetti();
                      showToast(`🎉 MILESTONE REACHED! ${invoice.customer?.name} unlocked Free Gift!`);
                    }, 500);
                  }
                }}
                totalStamps={totalSlots}
                onAddNewCustomer={() => setIsAddCustomerOpen(true)}
              />
            )}

            {/* ============================================================= */}
            {/* SUBTAB 2: CARD CAPACITY (6-12) & CUSTOMER REGISTRY DATABASE  */}
            {/* ============================================================= */}
            {adminSubTab === 'settings' && (
              <div className="space-y-6">
                
                {/* SECTION B: ADMIN CONFIGURATION (6 TO 12 STAMPS) */}
                <div className="p-6 rounded-3xl bg-[#111111] border border-white/10 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <Sliders className="w-4 h-4 text-[#ebd73f]" />
                        <h4 className="font-panchang font-bold text-base text-white">
                          Loyalty Card Capacity Setting
                        </h4>
                      </div>
                      <p className="text-xs text-slate-400 font-clash">
                        Configure how many stamps are required to unlock the Free Gift (default: 6 stamps, up to 12).
                      </p>
                    </div>

                    <span className="px-3 py-1 rounded-full bg-amber-400 text-black font-mono font-bold text-xs">
                      Active: {totalSlots} Stamps
                    </span>
                  </div>

                  {/* Stamp Length Selector Buttons: 4 to 12 */}
                  <div className="grid grid-cols-5 sm:grid-cols-9 gap-2 pt-2">
                    {[4, 5, 6, 7, 8, 9, 10, 11, 12].map((num) => (
                      <button
                        key={num}
                        type="button"
                        onClick={() => handleTotalStampsChange(num)}
                        className={`py-3 rounded-xl border text-xs font-mono font-bold transition cursor-pointer flex flex-col items-center justify-center gap-0.5 ${
                          totalSlots === num
                            ? 'bg-[#ebd73f] text-black border-[#ebd73f] shadow-glow-yellow'
                            : 'bg-black/60 border-white/10 text-slate-300 hover:text-white hover:border-white/30'
                        }`}
                      >
                        <span>{num}</span>
                        <span className="text-[9px] opacity-75">{num === 6 ? 'Default' : 'Stamps'}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* SECTION C: CUSTOMER DATABASE & FREE GIFT ASSIGNMENT */}
                <div className="p-6 rounded-3xl bg-[#111111] border border-white/10 space-y-5">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-[#ebd73f]" />
                        <h4 className="font-panchang font-bold text-base text-white">
                          Customer Database &amp; Free Gift Assignment
                        </h4>
                      </div>
                      <p className="text-xs text-slate-400 font-clash">
                        Choose the exact free gift for any customer, or keep as random. Data persists in browser storage.
                      </p>
                    </div>

                    <span className="text-xs font-mono text-slate-400">
                      {customers.length} Stored Accounts
                    </span>
                  </div>

                  {/* Customer Cards List */}
                  <div className="space-y-3">
                    {customers.map((c) => {
                      const gift = getGiftById(c.assignedGiftId || 'discount50');
                      const isReady = (c.stamps || 0) >= totalSlots;

                      return (
                        <div
                          key={c.id}
                          className="p-4 rounded-2xl bg-black/60 border border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-4"
                        >
                          {/* Left: Customer Info */}
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <h5 className="font-syne font-bold text-sm text-white">{c.name}</h5>
                              <span className="text-[10px] font-mono px-2 py-0.2 rounded-full bg-white/10 text-slate-300">
                                #{c.phone}
                              </span>
                              {(c.streakDays || 0) >= 5 && (
                                <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-orange-500/20 text-orange-300 border border-orange-500/30">
                                  🔥 5d Streak
                                </span>
                              )}
                            </div>
                            <p className="text-xs font-mono text-slate-400">
                              Progress: <strong className="text-[#ebd73f]">{c.stamps || 0} / {totalSlots} Stamps</strong> • Streak: {c.streakDays || 1} days • {c.xp || 420} XP
                            </p>
                          </div>

                          {/* Middle: Free Gift Dropdown (Admin Customizer) */}
                          <div className="space-y-1">
                            <span className="text-[10px] font-mono text-slate-400 block">Assigned Free Gift</span>
                            <select
                              value={c.assignedGiftId || 'discount50'}
                              onChange={(e) => handleCustomerGiftChange(c.id, e.target.value)}
                              className="px-3 py-1.5 rounded-xl bg-slate-900 border border-white/20 text-white font-mono text-xs focus:outline-none focus:border-[#ebd73f] cursor-pointer"
                            >
                              {LOYALTY_GIFTS_POOL.map((g) => (
                                <option key={g.id} value={g.id}>
                                  {g.title} ({g.badge})
                                </option>
                              ))}
                            </select>
                          </div>

                          {/* Right: Quick Adjust & History */}
                          <div className="flex items-center gap-2 self-start md:self-center">
                            <button
                              onClick={() => handleAdjustStamps(c.id, 1)}
                              disabled={(c.stamps || 0) >= totalSlots}
                              className="px-2.5 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-xs font-mono text-white transition cursor-pointer disabled:opacity-30"
                              title="Add 1 Stamp"
                            >
                              +1
                            </button>
                            <button
                              onClick={() => handleAdjustStamps(c.id, -1)}
                              disabled={(c.stamps || 0) <= 0}
                              className="px-2.5 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-xs font-mono text-white transition cursor-pointer disabled:opacity-30"
                              title="Subtract 1 Stamp"
                            >
                              -1
                            </button>
                            <button
                              onClick={() => {
                                resetCustomerCard(c.id);
                                setCustomers(getLoyaltyCustomers());
                                showToast(`Reset ${c.name}'s card to 1 stamp.`);
                              }}
                              className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition cursor-pointer"
                              title="Reset to 1 stamp"
                            >
                              <RotateCcw className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => setHistoryCustomer(c)}
                              className="px-3 py-1.5 rounded-lg bg-[#ebd73f]/15 hover:bg-[#ebd73f]/30 text-[#ebd73f] font-mono text-xs font-bold transition cursor-pointer flex items-center gap-1"
                            >
                              <Receipt className="w-3.5 h-3.5" />
                              <span>Bills ({c.billingHistory?.length || 0})</span>
                            </button>
                          </div>

                        </div>
                      );
                    })}
                  </div>

                </div>

              </div>
            )}

          </motion.div>
        )}

      </main>

      {/* ================================================================= */}
      {/* MODAL: CUSTOMER BILLING AUDIT HISTORY                             */}
      {/* ================================================================= */}
      <AnimatePresence>
        {historyCustomer && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative w-full max-w-lg rounded-3xl bg-[#111111] border border-white/15 p-6 shadow-2xl space-y-4 text-white max-h-[85vh] flex flex-col"
            >
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <Receipt className="w-5 h-5 text-[#ebd73f]" />
                  <div>
                    <h4 className="font-panchang font-bold text-base text-white">Billing History</h4>
                    <p className="text-xs font-mono text-slate-400">{historyCustomer.name} (#{historyCustomer.phone})</p>
                  </div>
                </div>
                <button
                  onClick={() => setHistoryCustomer(null)}
                  className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="overflow-y-auto space-y-2 flex-1 pr-1">
                {(!historyCustomer.billingHistory || historyCustomer.billingHistory.length === 0) ? (
                  <p className="text-xs text-slate-400 font-mono py-4 text-center">No bills recorded yet.</p>
                ) : (
                  historyCustomer.billingHistory.map((bill, idx) => (
                    <div key={idx} className="p-3 rounded-xl bg-black/60 border border-white/5 flex items-center justify-between text-xs font-mono">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-white font-bold">{bill.id}</span>
                          <span className="text-slate-400">{bill.date} {bill.time}</span>
                        </div>
                        <p className="text-[11px] text-slate-400 font-clash mt-0.5">{bill.items}</p>
                      </div>
                      <div className="text-right">
                        <span className="text-[#ebd73f] font-bold block">₹{bill.amount}</span>
                        <span className={`text-[10px] ${bill.streakApplied ? 'text-orange-400 font-bold' : 'text-emerald-400'}`}>
                          +{bill.stampsAwarded} Stamp(s) {bill.streakApplied ? '(Streak ⚡)' : ''}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>

              <button
                onClick={() => setHistoryCustomer(null)}
                className="w-full py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-xs font-bold text-white transition"
              >
                Close History
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ================================================================= */}
      {/* MODAL: ADD NEW CUSTOMER                                           */}
      {/* ================================================================= */}
      <AnimatePresence>
        {isAddCustomerOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative w-full max-w-md rounded-3xl bg-[#111111] border border-white/15 p-6 shadow-2xl space-y-4 text-white"
            >
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <UserCheck className="w-5 h-5 text-[#ebd73f]" />
                  <h4 className="font-panchang font-bold text-base text-white">Enroll New Customer</h4>
                </div>
                <button
                  onClick={() => setIsAddCustomerOpen(false)}
                  className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleCreateCustomer} className="space-y-3">
                <div className="space-y-1">
                  <label className="text-xs font-mono text-slate-400">Full Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Alex Morgan"
                    value={newCustomerName}
                    onChange={(e) => setNewCustomerName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-black border border-white/15 text-white text-xs font-clash focus:outline-none focus:border-[#ebd73f]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-mono text-slate-400">Mobile Phone</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 9811223344"
                    value={newCustomerPhone}
                    onChange={(e) => setNewCustomerPhone(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-black border border-white/15 text-white text-xs font-mono focus:outline-none focus:border-[#ebd73f]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-mono text-slate-400">Assigned Free Gift</label>
                  <select
                    value={newCustomerGift}
                    onChange={(e) => setNewCustomerGift(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-black border border-white/15 text-white text-xs font-mono focus:outline-none focus:border-[#ebd73f]"
                  >
                    {LOYALTY_GIFTS_POOL.map((g) => (
                      <option key={g.id} value={g.id}>
                        {g.title} ({g.badge})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="pt-3">
                  <button
                    type="submit"
                    className="w-full btn-dripp-primary py-3 text-xs font-bold cursor-pointer"
                  >
                    Create Member Account
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ================================================================= */}
      {/* MODAL: ACTIVE VOUCHER COUNTDOWN REDEMPTION PASS                   */}
      {/* ================================================================= */}
      <AnimatePresence>
        {activeRedemptionVoucher && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative w-full max-w-sm rounded-3xl bg-[#0f0f0f] border border-amber-400/40 p-6 text-center shadow-2xl space-y-5 text-white"
            >
              <button
                onClick={() => setActiveRedemptionVoucher(null)}
                className="absolute top-4 right-4 p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="w-14 h-14 rounded-full mx-auto bg-amber-400/20 border border-amber-400/40 flex items-center justify-center text-amber-300">
                <Gift className="w-7 h-7" />
              </div>

              <div className="space-y-1">
                <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-amber-400/15 text-amber-300 font-bold border border-amber-400/30">
                  REDEEM AT COUNTER
                </span>
                <h4 className="font-panchang font-bold text-lg text-white pt-2">
                  {activeRedemptionVoucher.title}
                </h4>
                <p className="text-xs text-slate-400 font-clash">
                  {activeRedemptionVoucher.desc}
                </p>
              </div>

              {/* Dynamic QR & Barcode Simulation */}
              <div className="p-4 rounded-2xl bg-white text-black flex flex-col items-center space-y-2 shadow-inner">
                <QrCode className="w-32 h-32" />
                <span className="font-mono text-xs font-bold tracking-widest">
                  PASS-{activeRedemptionVoucher.code || 'REWARD50'}
                </span>
              </div>

              {/* 5-Minute Countdown Timer */}
              <div className="flex items-center justify-center gap-2 text-xs font-mono text-amber-400">
                <Clock className="w-4 h-4" />
                <span>
                  Valid for: {Math.floor(redemptionTimer / 60)}:{(redemptionTimer % 60).toString().padStart(2, '0')}
                </span>
              </div>

              <p className="text-[11px] text-slate-400">
                Show this digital pass to the barista at the counter to redeem your free gift!
              </p>

              <button
                onClick={() => {
                  sounds.playSuccess();
                  setActiveRedemptionVoucher(null);
                  triggerConfetti();
                  showToast('Reward claimed successfully! Enjoy your treat!');
                }}
                className="w-full btn-dripp-primary py-3 text-xs font-bold cursor-pointer"
              >
                Confirm Reward Handed Out
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Model Switcher Modal */}
      <ModelSwitcherModal
        isOpen={isModelSwitcherOpen}
        onClose={() => setIsModelSwitcherOpen(false)}
      />

    </div>
  );
}
