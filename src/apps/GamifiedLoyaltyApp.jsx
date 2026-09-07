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

  // Daily Mystery Box Reveal Action
  const handleRevealMystery = () => {
    if (mysteryRevealed || mysteryShaking) return;
    sounds.playClick();
    setMysteryShaking(true);
    setTimeout(() => {
      setMysteryShaking(false);
      setMysteryRevealed(true);
      const mysteryGifts = [
        { title: 'Free Barista Oat Milk Upgrade', desc: 'Complimentary plant-based milk swap on any brew.', code: 'OAT-MILK-FREE' },
        { title: '50% Off Morning Bakery Pastry', desc: 'Half-price croissant, roll, or muffin before noon.', code: 'PASTRY-50' },
        { title: 'Double Star Boost (+50 XP)', desc: 'Accelerates progress towards Master Roaster tier.', code: 'XP-BOOST-50' },
        { title: 'Free Extra Double-Shot Espresso', desc: 'Extra double-shot on the house on any beverage.', code: 'EXTRA-SHOT' }
      ];
      const picked = mysteryGifts[Math.floor(Math.random() * mysteryGifts.length)];
      setMysteryReward(picked);
      sounds.playRewardFanfare();
      triggerConfetti();
      showToast(`Secret Perk Revealed: ${picked.title}!`);
    }, 1200);
  };

  // Open Redemption Voucher Modal
  const handleOpenRedeem = (perk) => {
    sounds.playClick();
    setActiveRedemptionVoucher({
      title: perk.title,
      desc: perk.desc,
      code: perk.code || 'PASS-REWARD'
    });
    setRedemptionTimer(300);
  };

  // When customer taps an unstamped slot in Customer Pass View:
  // "ofcourse customer should not be able to mark the stamps."
  const handleCustomerSlotClick = (slotIndex) => {
    sounds.playClick();
    if (slotIndex > currentCustomer.stamps) {
      showToast('Stamps are marked automatically when the cafe settles your bill!');
    } else {
      showToast(`Stamp #${slotIndex} earned from your past visit billing!`);
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
        showToast(`5-Day Streak Active! +2 STAMPS marked for ${result.customer.name}!`);
      } else {
        showToast(`+1 Stamp marked for ${result.customer.name}!`);
      }

      if (result.isRewardUnlocked) {
        setTimeout(() => {
          sounds.playRewardFanfare();
          triggerConfetti();
          showToast(`MILESTONE REACHED! ${result.customer.name} unlocked their Free Gift!`);
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
    if (xp >= 650) return { name: 'Master Roaster & Baker', level: 4, badge: 'DIAMOND VIP' };
    if (xp >= 350) return { name: 'Artisan Craftsman', level: 3, badge: 'GOLD MEMBER' };
    if (xp >= 150) return { name: 'Espresso Scout', level: 2, badge: 'SILVER MEMBER' };
    return { name: 'Bean Cadet', level: 1, badge: 'BRONZE MEMBER' };
  };

  const currentTier = getTier(currentCustomer.xp || 420);
  const totalSlots = adminConfig.totalStamps || 6;
  const isMilestoneReached = (currentCustomer.stamps || 0) >= totalSlots;
  const stampsRemaining = Math.max(0, totalSlots - (currentCustomer.stamps || 0));

  // Streak status: 5-day streak grants 2 stamps on next billing
  const hasStreakBonus = (currentCustomer.streakDays || 0) >= (adminConfig.streakBonusThreshold || 5);

  return (
    <div className="min-h-screen bg-cafe-paper text-[#1A1310] font-jakarta selection:bg-[#2044E2] selection:text-white relative transition-colors duration-500 overflow-x-hidden">
      
      {/* Subtle Warm Coffee Ambient Blurs */}
      <div className="fixed -top-32 -left-32 w-96 h-96 rounded-full blur-[140px] pointer-events-none bg-[#C25E3E]/5" />
      <div className="fixed -bottom-32 -right-32 w-96 h-96 rounded-full blur-[140px] pointer-events-none bg-[#D4A373]/10" />

      {/* Top Header Navigation */}
      <header className="sticky top-0 inset-x-0 z-40 bg-[#F6F1EA]/90 backdrop-blur-xl border-b border-[#E8DDD0] px-4 sm:px-6 py-3">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-3">
          
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={() => {
                sounds.playClick();
                if (onBackToVariants) onBackToVariants();
                else if (onBackToCatalogue) onBackToCatalogue();
              }}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#EAE2D7] hover:bg-[#1A1310] hover:text-[#FFFDF9] text-[#1A1310] font-semibold text-xs transition cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Models</span>
            </button>

            <span className="hidden sm:inline-block text-[#D8CFC4]">•</span>

            {/* Model Switcher Button */}
            <button
              onClick={() => { sounds.playClick(); setIsModelSwitcherOpen(true); }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#FFFFFF] hover:bg-[#F2ECE4] text-[#1A1310] text-xs font-semibold border border-[#DDD4C7] shadow-sm transition cursor-pointer"
            >
              <Layers className="w-3.5 h-3.5 text-[#C25E3E]" />
              <span className="hidden md:inline font-space text-[11px] text-[#7A6C60]">ARCHETYPE // 07:</span>
              <span className="font-medium">Gamified Loyalty Pass</span>
              <span className="px-1.5 py-0.5 rounded bg-[#1A1310] text-[#FFFDF9] text-[9px] font-space font-bold">SWITCH</span>
            </button>
          </div>

          {/* Right Controls: View Switcher (Customer Pass vs Cafe POS & Admin) */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            <div className="flex items-center p-1 rounded-full bg-[#EAE2D7] border border-[#DDD4C7] text-xs">
              <button
                onClick={() => { sounds.playClick(); setViewMode('customer'); }}
                className={`px-3.5 py-1.5 rounded-full font-semibold transition flex items-center gap-1.5 cursor-pointer ${
                  viewMode === 'customer'
                    ? 'bg-[#1A1310] text-[#FFFDF9] font-bold shadow-sm'
                    : 'text-[#6B5E54] hover:text-[#1A1310]'
                }`}
              >
                <Smartphone className="w-3.5 h-3.5" />
                <span>Customer Pass</span>
              </button>
              
              <button
                onClick={() => { sounds.playClick(); setViewMode('pos_admin'); }}
                className={`px-3.5 py-1.5 rounded-full font-semibold transition flex items-center gap-1.5 cursor-pointer ${
                  viewMode === 'pos_admin'
                    ? 'bg-[#1A1310] text-[#FFFDF9] font-bold shadow-sm'
                    : 'text-[#6B5E54] hover:text-[#1A1310]'
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
              className="p-2 rounded-full bg-[#EAE2D7] hover:bg-[#DDD4C7] text-[#1A1310] transition cursor-pointer"
              title={soundEnabled ? 'Mute Sounds' : 'Unmute Sounds'}
            >
              {soundEnabled ? <Volume2 className="w-4 h-4 text-[#C25E3E]" /> : <VolumeX className="w-4 h-4 text-[#A89C90]" />}
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
            className="fixed top-18 inset-x-0 mx-auto w-fit z-50 px-5 py-2.5 rounded-full bg-[#1A1310] text-[#FFFDF9] border border-[#3A2E26] font-semibold text-xs shadow-2xl flex items-center gap-2 pointer-events-none"
          >
            <Sparkles className="w-4 h-4 text-[#D4A373]" />
            <span>{feedbackToast}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Container */}
      <main className="max-w-4xl mx-auto px-4 py-6 space-y-6">
        
        {/* Sub-Header / Niche Switcher Banner */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-5 rounded-3xl bg-[#FFFFFF] border border-[#E8DDD0] shadow-sm">
          <div className="flex items-center gap-3.5 text-center sm:text-left">
            <div className="w-12 h-12 rounded-2xl bg-[#FAF6F0] border border-[#E8DDD0] flex items-center justify-center shrink-0">
              {themeMode === 'coffee' ? (
                <LottieSteamingCup size={36} />
              ) : (
                <LottieJigglyCroissant size={36} />
              )}
            </div>
            <div>
              <div className="flex items-center gap-2 justify-center sm:justify-start">
                <span className="text-[10px] font-space uppercase tracking-widest text-[#C25E3E] font-bold">
                  {themeMode === 'coffee' ? 'SPECIALTY ESPRESSO ROASTERS' : 'ARTISAN SOURDOUGH & PATISSERIE'}
                </span>
                <span className="px-2 py-0.5 rounded-full bg-[#FAF5EE] text-[#1A1310] border border-[#DDD4C7] text-[10px] font-space font-bold">
                  {totalSlots}-STAMP MODEL
                </span>
              </div>
              <h2 className="font-fraunces font-bold text-xl sm:text-2xl text-[#1A1310] mt-0.5">
                {themeMode === 'coffee' ? 'Brew & Bean Rewards Club' : 'Crumb & Crust Bakery Passport'}
              </h2>
            </div>
          </div>

          {/* Theme Selector Button Pills */}
          <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-[#F6F1EA] border border-[#E8DDD0] shrink-0">
            <button
              onClick={() => { sounds.playClick(); setThemeMode('coffee'); }}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer ${
                themeMode === 'coffee'
                  ? 'bg-[#1A1310] text-[#FFFDF9] font-bold shadow-sm'
                  : 'text-[#6B5E54] hover:text-[#1A1310]'
              }`}
            >
              <Coffee className="w-3.5 h-3.5" />
              <span>Coffee Shop</span>
            </button>

            <button
              onClick={() => { sounds.playClick(); setThemeMode('bakery'); }}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer ${
                themeMode === 'bakery'
                  ? 'bg-[#1A1310] text-[#FFFDF9] font-bold shadow-sm'
                  : 'text-[#6B5E54] hover:text-[#1A1310]'
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
            <div className="p-3.5 rounded-2xl bg-[#FFFFFF] border border-[#E8DDD0] shadow-sm flex flex-col sm:flex-row items-center justify-between gap-2.5 text-xs font-space">
              <div className="flex items-center gap-2 text-[#7A6C60]">
                <Users className="w-4 h-4 text-[#C25E3E]" />
                <span>ACTIVE MEMBER ACCOUNT:</span>
              </div>
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <select
                  value={selectedCustomerId}
                  onChange={(e) => {
                    sounds.playClick();
                    setSelectedCustomerId(e.target.value);
                  }}
                  className="px-3 py-1.5 rounded-xl bg-[#F6F1EA] border border-[#DDD4C7] text-[#1A1310] font-space text-xs focus:outline-none focus:border-[#2044E2] cursor-pointer w-full sm:w-auto font-medium"
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
                  className="px-3 py-1.5 rounded-xl bg-[#FAF5EE] hover:bg-[#1A1310] hover:text-[#FFFDF9] text-[#1A1310] border border-[#DDD4C7] text-xs whitespace-nowrap transition cursor-pointer flex items-center gap-1 font-semibold"
                >
                  <Receipt className="w-3.5 h-3.5" />
                  <span>Bills</span>
                </button>
              </div>
            </div>

            {/* VIP MEMBER CARD (Physical Tactile VIP Wallet Pass) */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ rotate: 0 }}
              className="relative rounded-3xl overflow-hidden p-6 sm:p-8 bg-gradient-to-br from-[#1C1613] via-[#231C18] to-[#120E0C] text-[#FFFDF9] shadow-2xl border border-[#3A2E26] transform rotate-[-0.6deg] transition-transform duration-300 select-none"
            >
              {/* Tactile debossed edge border */}
              <div className="absolute inset-2.5 rounded-2xl border border-[#D4A373]/25 pointer-events-none" />
              
              {/* Card Top Row */}
              <div className="flex items-start justify-between relative z-10">
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-space tracking-[0.25em] text-[#D4A373] uppercase font-bold">
                      {themeMode === 'coffee' ? 'VIP ROASTERY PASS' : 'GOLDEN CRUST CLUB'}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full bg-[#D4A373]/20 text-[#E8C5A0] font-space text-[9px] font-bold border border-[#D4A373]/40 tracking-wider">
                      {currentTier.badge}
                    </span>
                  </div>
                  <h3 className="font-fraunces font-bold text-3xl sm:text-4xl text-[#FFFDF9] tracking-tight">
                    {currentCustomer.name}
                  </h3>
                  <p className="text-xs font-space text-[#A8988B] tracking-wider">
                    MEMBER #{currentCustomer.phone} • TACTILE PASS
                  </p>
                </div>

                {/* Interactive Mascot with Jiggly Spring Physics */}
                <div className="flex flex-col items-center">
                  <div className="p-2 rounded-2xl bg-[#2D221C] border border-[#42332A] shadow-inner">
                    {themeMode === 'coffee' ? (
                      <LottieSteamingCup size={54} className="hover:animate-jiggle" />
                    ) : (
                      <LottieJigglyCroissant size={54} className="hover:animate-jiggle" />
                    )}
                  </div>
                  <span className="text-[9px] font-space text-[#D4A373] mt-1 tracking-wide">
                    Tap to jiggle!
                  </span>
                </div>
              </div>

              {/* XP & Level Progress Bar */}
              <div className="mt-6 pt-5 border-t border-[#3A2E26] space-y-2 relative z-10">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5 font-bold font-jakarta text-[#FFFDF9]">
                    <span>{currentTier.icon}</span>
                    <span>Tier: {currentTier.name}</span>
                  </div>
                  <span className="font-space text-[#D4A373] font-bold">{currentCustomer.xp || 420} / 650 XP</span>
                </div>

                <div className="h-2.5 w-full rounded-full bg-[#120E0C] overflow-hidden p-0.5 border border-[#3A2E26]">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min(100, ((currentCustomer.xp || 420) / 650) * 100)}%` }}
                    transition={{ duration: 1, ease: 'easeOut' }}
                    className="h-full rounded-full bg-gradient-to-r from-[#C25E3E] via-[#E07A5F] to-[#D4A373]"
                  />
                </div>
              </div>

            </motion.div>

            {/* ============================================================= */}
            {/* STATS ROW (3 DISTINCT TACTILE COUNTER BADGES)                 */}
            {/* ============================================================= */}
            <div className="grid grid-cols-3 gap-3">
              <div className="p-4 rounded-2xl bg-[#FFFFFF] border border-[#E8DDD0] text-center shadow-sm">
                <span className="text-[10px] font-space text-[#7A6C60] block uppercase tracking-wider">
                  Stamps Marked
                </span>
                <span className="font-fraunces font-bold text-2xl sm:text-3xl text-[#2044E2] block mt-0.5">
                  {currentCustomer.stamps || 0} / {totalSlots}
                </span>
              </div>
              
              <div className="p-4 rounded-2xl bg-[#FFFFFF] border border-[#E8DDD0] text-center shadow-sm">
                <span className="text-[10px] font-space text-[#7A6C60] block uppercase tracking-wider">
                  Current Streak
                </span>
                <span className="font-fraunces font-bold text-2xl sm:text-3xl text-[#C25E3E] flex items-center justify-center gap-1 mt-0.5">
                  <span>{currentCustomer.streakDays || 1}d</span>
                  <Flame className="w-5 h-5 fill-[#C25E3E]" />
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-[#FFFFFF] border border-[#E8DDD0] text-center shadow-sm">
                <span className="text-[10px] font-space text-[#7A6C60] block uppercase tracking-wider">
                  Milestone Status
                </span>
                <span className={`font-jakarta font-bold text-xs sm:text-sm mt-2 block ${
                  isMilestoneReached ? 'text-[#2D6A4F] animate-pulse' : 'text-[#7A6C60]'
                }`}>
                  {isMilestoneReached ? 'Ready to Claim!' : `${stampsRemaining} to Unlock`}
                </span>
              </div>
            </div>

            {/* ============================================================= */}
            {/* TARGET FREE GIFT TRANSPARENCY BANNER (ARTISAN CERTIFICATE)    */}
            {/* ============================================================= */}
            <div className="p-5 sm:p-6 rounded-3xl bg-[#FFFFFF] border-2 border-[#1A1310] shadow-sm space-y-3 relative overflow-hidden">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-start gap-3.5">
                  <div className="w-13 h-13 rounded-2xl bg-[#1A1310] text-[#D4A373] flex items-center justify-center font-black shrink-0 shadow-md">
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
                      <span className="text-[9px] font-space font-bold px-2 py-0.5 rounded-full bg-[#1A1310] text-[#FFFDF9] uppercase tracking-wider">
                        YOUR ASSIGNED REWARD
                      </span>
                      <span className="text-xs font-space text-[#C25E3E] font-bold">
                        Slot #{totalSlots} Milestone
                      </span>
                    </div>
                    <h3 className="font-fraunces font-bold text-xl sm:text-2xl text-[#1A1310] mt-0.5">
                      {currentGift.title}
                    </h3>
                    <p className="text-xs text-[#7A6C60] font-jakarta mt-0.5">
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
                      className="px-6 py-3 rounded-2xl bg-[#2044E2] hover:bg-[#1635B8] text-white font-jakarta font-bold text-xs flex items-center gap-2 shadow-lg cursor-pointer transition"
                    >
                      <Gift className="w-4 h-4" />
                      <span>Claim Free Gift Now</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  ) : (
                    <div className="px-4 py-2.5 rounded-2xl bg-[#F6F1EA] border border-[#E8DDD0] text-right">
                      <span className="text-[10px] font-space text-[#7A6C60] block uppercase">Stamps to Free Gift</span>
                      <span className="font-space text-[#1A1310] font-bold text-sm">
                        {stampsRemaining} more {stampsRemaining === 1 ? 'stamp' : 'stamps'}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Notice that billing automatically marks stamps */}
              <div className="pt-2.5 border-t border-[#E8DDD0] flex items-center justify-between text-[11px] font-space text-[#7A6C60]">
                <span className="flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#2044E2]" />
                  <span>Stamps mark automatically on each bill paid at counter.</span>
                </span>
                <span className="text-[#1A1310] font-bold">1 Bill = +1 Stamp</span>
              </div>
            </div>

            {/* ============================================================= */}
            {/* DYNAMIC DIGITAL PUNCH CARD (AUTHENTIC COTTON STAMP CARD)      */}
            {/* ============================================================= */}
            <div className="p-6 sm:p-7 rounded-3xl bg-[#FFFFFF] stamp-card-stitch shadow-sm space-y-5">
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-[#E8DDD0]">
                <div>
                  <div className="flex items-center gap-2">
                    <Award className="w-5 h-5 text-[#C25E3E]" />
                    <h3 className="font-fraunces font-bold text-2xl text-[#1A1310]">
                      {totalSlots}-Slot Digital Punch Card
                    </h3>
                  </div>
                  <p className="text-xs text-[#7A6C60] font-jakarta mt-0.5">
                    Stamps are synchronized with your cafe bills. Read-only member pass.
                  </p>
                </div>

                {/* Info Pill */}
                <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-[#FAF5EE] border border-[#DDD4C7] text-xs font-space text-[#1A1310]">
                  <Lock className="w-3.5 h-3.5 text-[#2044E2]" />
                  <span>Marked on Checkout</span>
                </div>
              </div>

              {/* DYNAMIC STAMP GRID (Matches totalSlots: 6 to 12) */}
              <div className={`grid gap-3 sm:gap-4 pt-1 ${
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
                      className={`relative rounded-2xl p-3 sm:p-4 aspect-square flex flex-col items-center justify-between text-center transition-all select-none overflow-hidden cursor-pointer ${
                        isStamped
                          ? 'bg-[#FAF7F2] border border-[#E0D7CB] shadow-sm'
                          : isMilestoneSlot
                          ? 'bg-[#FFF8F5] border-2 border-dashed border-[#C25E3E] ring-1 ring-[#C25E3E]/20'
                          : 'bg-[#FFFFFF] border-2 border-dashed border-[#DDD4C7] hover:border-[#1A1310]/40'
                      }`}
                    >
                      {/* Slot Header */}
                      <span className="text-[10px] font-space font-bold text-[#A89C90] self-start">
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
                              <Percent className="w-7 h-7 text-[#C25E3E]" />
                            ) : currentGift.type === 'beverage' ? (
                              <Coffee className="w-7 h-7 text-[#C25E3E]" />
                            ) : (
                              <Gift className="w-7 h-7 text-[#C25E3E]" />
                            )}
                            <span className="text-[8px] font-space font-bold text-[#C25E3E] mt-1 uppercase text-center line-clamp-1">
                              {currentGift.badge}
                            </span>
                          </div>
                        ) : (
                          <div className="w-9 h-9 rounded-full border border-dashed border-[#DDD4C7] flex items-center justify-center text-[#B8ADA0]">
                            {themeMode === 'coffee' ? (
                              <Coffee className="w-4 h-4 opacity-40" />
                            ) : (
                              <LottieCoffeeBean size={20} />
                            )}
                          </div>
                        )}
                      </div>

                      {/* Bottom Status */}
                      <span className={`text-[8px] font-space font-bold tracking-tight truncate max-w-full ${
                        isStamped
                          ? 'text-[#2044E2]'
                          : isMilestoneSlot
                          ? 'text-[#C25E3E] font-bold'
                          : 'text-[#A89C90]'
                      }`}>
                        {isStamped ? 'STAMPED' : isMilestoneSlot ? currentGift.badge : 'Awaiting Bill'}
                      </span>
                    </motion.div>
                  );
                })}
              </div>

              {/* Card Footer Progress Bar */}
              <div className="p-3.5 rounded-2xl bg-[#F6F1EA] border border-[#E8DDD0] flex items-center justify-between text-xs font-space">
                <span className="text-[#7A6C60]">Card Progress:</span>
                <span className="text-[#1A1310] font-bold">
                  {isMilestoneReached
                    ? `ALL ${totalSlots} STAMPS COLLECTED! FREE GIFT UNLOCKED!`
                    : `${stampsRemaining} more ${stampsRemaining === 1 ? 'stamp' : 'stamps'} to unlock ${currentGift.title}`}
                </span>
              </div>

            </div>

            {/* ============================================================= */}
            {/* TWO-COLUMN GRID: WEEKLY CAFFEINE STREAK & DAILY MYSTERY TREAT  */}
            {/* ============================================================= */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

              {/* DAILY CAFFEINE STREAK WEEKLY CHECKLIST */}
              <div className="p-6 rounded-3xl bg-[#FFFFFF] border border-[#E8DDD0] shadow-sm flex flex-col justify-between space-y-4">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center gap-1.5 text-xs font-space text-[#C25E3E] font-bold uppercase tracking-wider">
                      <Flame className="w-4 h-4 fill-[#C25E3E]" />
                      <span>DAILY CAFFEINE STREAK</span>
                    </div>
                    <h4 className="font-fraunces font-bold text-2xl text-[#1A1310] flex items-center gap-2">
                      <span>{currentCustomer.streakDays || 1}-Day Hot Streak</span>
                      <Flame className="w-5 h-5 fill-[#C25E3E] text-[#C25E3E]" />
                    </h4>
                    <p className="text-xs text-[#7A6C60] font-jakarta leading-relaxed">
                      Order daily at the counter. <strong>5-Day Streak</strong> skips a day by awarding <strong>+2 STAMPS AT ONCE</strong>!
                    </p>
                  </div>
                  <LottieStreakFlame days={currentCustomer.streakDays || 1} size={52} />
                </div>

                {/* 7-Day Weekly Coffee Cup Sticker Strip */}
                <div className="grid grid-cols-7 gap-1.5 pt-2">
                  {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, dIdx) => {
                    const isCompleted = dIdx < (currentCustomer.streakDays || 1);
                    const isSpeedUpDay = dIdx === 4; // Day 5
                    const isToday = dIdx === ((currentCustomer.streakDays || 1) - 1);

                    return (
                      <div
                        key={dIdx}
                        className={`p-2 rounded-2xl text-center border transition-all ${
                          isCompleted
                            ? 'bg-[#C25E3E] text-white border-[#C25E3E] shadow-sm font-bold'
                            : isSpeedUpDay
                            ? 'bg-[#FFF8F0] border-2 border-dashed border-[#C25E3E] text-[#C25E3E]'
                            : 'bg-[#F9F6F0] border border-[#E8DDD0] text-[#A89C90]'
                        } ${isToday ? 'ring-2 ring-[#1A1310]' : ''}`}
                      >
                        <span className="text-[10px] font-space block">{day}</span>
                        <span className="text-xs mt-0.5 block font-bold flex items-center justify-center">
                          {isCompleted ? <Check className="w-3.5 h-3.5 stroke-[3]" /> : isSpeedUpDay ? <Zap className="w-3 h-3 fill-[#C25E3E]" /> : '•'}
                        </span>
                      </div>
                    );
                  })}
                </div>

                {/* Streak Power Status Banner */}
                <div className={`p-3 rounded-2xl border flex items-center justify-between text-xs ${
                  hasStreakBonus
                    ? 'bg-[#FFF6F0] border-[#F0D5C7] text-[#C25E3E]'
                    : 'bg-[#F6F1EA] border-[#E8DDD0] text-[#7A6C60]'
                }`}>
                  <span className="font-space text-[11px] font-bold flex items-center gap-1.5">
                    <Zap className="w-3.5 h-3.5 fill-current" />
                    <span>{hasStreakBonus ? 'SPEED-UP ACTIVE: Next bill yields +2 STAMPS!' : 'Reach Day 5 for Double Stamps'}</span>
                  </span>
                  <span className="font-space text-[10px] font-bold px-2 py-0.5 rounded bg-white border border-current">
                    {hasStreakBonus ? '+2 STAMPS' : '+1 STAMP'}
                  </span>
                </div>
              </div>

              {/* DAILY MYSTERY TREAT REVEAL (WAX-SEALED KRAFT PARCEL) */}
              <div className="p-6 rounded-3xl bg-[#FFFFFF] border-2 border-dashed border-[#D4A373] shadow-sm flex flex-col justify-between space-y-4">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center gap-1.5 text-xs font-space text-[#C25E3E] font-bold uppercase tracking-wider">
                      <Gift className="w-4 h-4 text-[#C25E3E]" />
                      <span>DAILY MYSTERY TREAT</span>
                    </div>
                    <h4 className="font-fraunces font-bold text-2xl text-[#1A1310]">
                      {mysteryRevealed ? 'Secret Perk Unveiled!' : 'Tap To Shake & Open'}
                    </h4>
                    <p className="text-xs text-[#7A6C60] font-jakarta leading-relaxed">
                      {mysteryRevealed
                        ? 'Surprise voucher unlocked! Present the code to your barista at checkout.'
                        : 'Every day holds a surprise barista gift: oat milk upgrades, pastry perks, or XP boosts.'}
                    </p>
                  </div>
                  <LottieMysteryBox size={52} isShaking={mysteryShaking} />
                </div>

                {/* Mystery Reveal Action Area */}
                <div className="pt-2">
                  {mysteryRevealed && mysteryReward ? (
                    <motion.div
                      initial={{ scale: 0.9, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="p-4 rounded-2xl bg-[#FFFBF5] border-2 border-[#D4A373] flex items-center justify-between gap-3 shadow-inner"
                    >
                      <div className="space-y-0.5">
                        <span className="text-[10px] font-space text-[#C25E3E] font-bold uppercase tracking-wider block">
                          VOUCHER CODE: {mysteryReward.code}
                        </span>
                        <h5 className="font-fraunces font-bold text-sm text-[#1A1310]">{mysteryReward.title}</h5>
                        <p className="text-[11px] text-[#7A6C60] font-jakarta">{mysteryReward.desc}</p>
                      </div>
                      <button
                        onClick={() => handleOpenRedeem(mysteryReward)}
                        className="px-4 py-2 rounded-xl bg-[#2044E2] hover:bg-[#1635B8] text-white font-jakarta font-bold text-xs shrink-0 cursor-pointer shadow-md transition"
                      >
                        Redeem
                      </button>
                    </motion.div>
                  ) : (
                    <button
                      onClick={handleRevealMystery}
                      disabled={mysteryShaking}
                      className="w-full py-3.5 rounded-2xl bg-[#1A1310] hover:bg-[#2C211B] text-[#FFFDF9] font-jakarta font-bold text-xs flex items-center justify-center gap-2 transition cursor-pointer shadow-md"
                    >
                      <Sparkles className="w-4 h-4 text-[#D4A373]" />
                      <span>{mysteryShaking ? 'Shaking Mystery Box...' : 'Shake & Open Daily Surprise'}</span>
                    </button>
                  )}
                </div>

                <div className="text-[10px] font-space text-[#A89C90]">
                  Resets daily at 06:00 AM • 1 surprise per 24 hours
                </div>
              </div>

            </div>

            {/* ============================================================= */}
            {/* PERKS & REWARDS VAULT (PERFORATED CAFE COUPON STUBS)          */}
            {/* ============================================================= */}
            <div className="p-6 sm:p-7 rounded-3xl bg-[#FFFFFF] border border-[#E8DDD0] shadow-sm space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-[#E8DDD0]">
                <div>
                  <h3 className="font-fraunces font-bold text-2xl text-[#1A1310]">
                    Perks &amp; Rewards Vault
                  </h3>
                  <p className="text-xs text-[#7A6C60] font-jakarta mt-0.5">
                    Redeemable voucher tickets for your member account. Present code at counter.
                  </p>
                </div>

                <span className="font-space text-xs px-3 py-1 rounded-full bg-[#FAF5EE] border border-[#DDD4C7] text-[#1A1310] font-bold">
                  {isMilestoneReached ? '2 Ready to Claim' : '1 Ready'}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2">
                {/* Perk 1: Oat Milk Upgrade */}
                <div className="p-4 rounded-2xl bg-[#FFFDF9] border border-[#E8DDD0] flex items-center justify-between gap-3 shadow-sm hover:border-[#1A1310]/30 transition">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-xl bg-[#F6F1EA] border border-[#DDD4C7] flex items-center justify-center text-[#1A1310] shrink-0 font-bold">
                      <Coffee className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-[9px] font-space text-[#2D6A4F] font-bold uppercase tracking-wider block">READY TO CLAIM</span>
                      <h5 className="font-fraunces font-bold text-sm text-[#1A1310]">Free Oat Milk Upgrade</h5>
                      <p className="text-[11px] text-[#7A6C60] font-jakarta">Plant-based milk swap on any brew</p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleOpenRedeem({ title: 'Free Oat Milk Upgrade', desc: 'Barista plant-based swap on the house.', code: 'PERK-OATMILK' })}
                    className="px-3.5 py-1.5 rounded-xl bg-[#2044E2] hover:bg-[#1635B8] text-white font-jakarta font-bold text-xs shrink-0 cursor-pointer shadow-sm transition"
                  >
                    Redeem
                  </button>
                </div>

                {/* Perk 2: Flaky Croissant (Active if stamps >= 4) */}
                <div className={`p-4 rounded-2xl border flex items-center justify-between gap-3 transition ${
                  (currentCustomer.stamps || 0) >= 4
                    ? 'bg-[#FFFDF9] border-[#E8DDD0] shadow-sm hover:border-[#1A1310]/30'
                    : 'bg-[#F9F6F0] border-[#EAE2D7] opacity-65'
                }`}>
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-xl bg-[#F6F1EA] border border-[#DDD4C7] flex items-center justify-center text-[#1A1310] shrink-0 font-bold">
                      <Gift className="w-5 h-5" />
                    </div>
                    <div>
                      <span className={`text-[9px] font-space font-bold uppercase tracking-wider block ${
                        (currentCustomer.stamps || 0) >= 4 ? 'text-[#2D6A4F]' : 'text-[#A89C90]'
                      }`}>
                        {(currentCustomer.stamps || 0) >= 4 ? 'READY TO CLAIM' : 'UNLOCKS AT 4 STAMPS'}
                      </span>
                      <h5 className="font-fraunces font-bold text-sm text-[#1A1310]">Artisan Butter Croissant</h5>
                      <p className="text-[11px] text-[#7A6C60] font-jakarta">Fresh morning flaky pastry on us</p>
                    </div>
                  </div>
                  {(currentCustomer.stamps || 0) >= 4 ? (
                    <button
                      onClick={() => handleOpenRedeem({ title: 'Artisan Butter Croissant', desc: 'Fresh French butter pastry on the house.', code: 'PERK-CROISSANT' })}
                      className="px-3.5 py-1.5 rounded-xl bg-[#2044E2] hover:bg-[#1635B8] text-white font-jakarta font-bold text-xs shrink-0 cursor-pointer shadow-sm transition"
                    >
                      Redeem
                    </button>
                  ) : (
                    <span className="text-[10px] font-space text-[#A89C90]">Locked</span>
                  )}
                </div>

                {/* Perk 3: VIP Grand Milestone Treat (Span 2 cols, Letterpress frame) */}
                <div className={`sm:col-span-2 p-5 rounded-3xl border-2 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition ${
                  isMilestoneReached
                    ? 'bg-gradient-to-r from-[#FFFBF5] via-[#FFFDF9] to-[#FFF6F0] border-[#1A1310] shadow-md'
                    : 'bg-[#F9F6F0] border-dashed border-[#DDD4C7] opacity-75'
                }`}>
                  <div className="flex items-center gap-3.5">
                    <div className="w-13 h-13 rounded-2xl bg-[#1A1310] text-[#D4A373] flex items-center justify-center shrink-0 shadow-md">
                      {currentGift.id === 'discount50' ? (
                        <Percent className="w-6 h-6 stroke-[3]" />
                      ) : (
                        <Gift className="w-6 h-6 stroke-[2.5]" />
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[9px] font-space font-bold px-2 py-0.5 rounded-full bg-[#1A1310] text-[#FFFDF9] uppercase tracking-wider">
                          VIP GRAND MILESTONE
                        </span>
                        <span className="text-xs font-space text-[#C25E3E] font-bold">
                          Slot #{totalSlots} Perk
                        </span>
                      </div>
                      <h4 className="font-fraunces font-bold text-lg text-[#1A1310] mt-0.5">
                        {currentGift.title}
                      </h4>
                      <p className="text-xs text-[#7A6C60] font-jakarta">
                        {currentGift.desc}
                      </p>
                    </div>
                  </div>

                  {isMilestoneReached ? (
                    <button
                      onClick={() => handleOpenRedeem({ title: currentGift.title, desc: currentGift.desc, code: `CLAIM-${currentGift.id.toUpperCase()}` })}
                      className="px-6 py-3 rounded-2xl bg-[#2044E2] hover:bg-[#1635B8] text-white font-jakarta font-bold text-xs shrink-0 cursor-pointer shadow-md transition flex items-center gap-2"
                    >
                      <Gift className="w-4 h-4" />
                      <span>Claim Grand Perk</span>
                    </button>
                  ) : (
                    <span className="font-space text-xs font-bold text-[#C25E3E] bg-[#FFF0E8] px-3 py-1.5 rounded-xl border border-[#F0D5C7]">
                      {stampsRemaining} stamps left to unlock
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Customer Digital Pass Code & Barcode to present at Counter */}
            <div className="p-6 rounded-3xl bg-[#FFFFFF] border border-[#E8DDD0] shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="space-y-1 text-center sm:text-left">
                <span className="text-[10px] font-space text-[#C25E3E] font-bold uppercase tracking-wider">CHECKOUT IDENTIFIER</span>
                <h4 className="font-fraunces font-bold text-xl text-[#1A1310]">Present to Barista at Counter</h4>
                <p className="text-xs text-[#7A6C60] font-jakarta">
                  Provide mobile number <strong className="text-[#1A1310]">#{currentCustomer.phone}</strong> or scan barcode to auto-record your visit stamp.
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-[#F6F1EA] border border-[#DDD4C7] text-[#1A1310] flex items-center gap-3 shrink-0 shadow-inner">
                <QrCode className="w-10 h-10" />
                <div className="font-space text-left">
                  <span className="text-[9px] block text-[#7A6C60] font-bold">DIGITAL PASS ID</span>
                  <span className="text-xs font-bold tracking-wider text-[#1A1310]">#{currentCustomer.phone}</span>
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
            <div className="p-6 rounded-3xl bg-white border border-[#DDD4C7] shadow-sm space-y-4">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-[#E8E1D5]">
                <div className="flex items-center gap-3.5">
                  <div className="w-12 h-12 rounded-2xl bg-[#1A1310] text-[#F6F1EA] flex items-center justify-center font-black shadow-md shrink-0">
                    <Store className="w-6 h-6 text-[#C25E3E]" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-space uppercase text-[#2044E2] font-bold tracking-wider">
                        CAFE ADMIN &amp; BILLING TERMINAL
                      </span>
                      <span className="px-2 py-0.5 rounded-full bg-[#EFE9DF] text-[#7A6B63] font-space text-[9px] font-bold">
                        INTERNAL REGISTER • NO GATEWAY
                      </span>
                    </div>
                    <h3 className="font-fraunces font-bold text-xl sm:text-2xl text-[#1A1310]">
                      Counter POS Register &amp; Loyalty Workstation
                    </h3>
                  </div>
                </div>

                {/* Subtab Selectors & Add Customer */}
                <div className="flex flex-wrap items-center gap-2">
                  <div className="p-1 rounded-2xl bg-[#F6F1EA] border border-[#DDD4C7] flex items-center gap-1 shadow-xs">
                    <button
                      type="button"
                      onClick={() => { sounds.playClick(); setAdminSubTab('billing'); }}
                      className={`px-3.5 py-2 rounded-xl text-xs font-space font-bold transition flex items-center gap-1.5 cursor-pointer ${
                        adminSubTab === 'billing'
                          ? 'bg-[#1A1310] text-[#F6F1EA] shadow-sm'
                          : 'text-[#7A6B63] hover:text-[#1A1310]'
                      }`}
                    >
                      <Printer className="w-3.5 h-3.5 text-[#2044E2]" />
                      <span>1. Order Billing &amp; Print</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => { sounds.playClick(); setAdminSubTab('settings'); }}
                      className={`px-3.5 py-2 rounded-xl text-xs font-space font-bold transition flex items-center gap-1.5 cursor-pointer ${
                        adminSubTab === 'settings'
                          ? 'bg-[#1A1310] text-[#F6F1EA] shadow-sm'
                          : 'text-[#7A6B63] hover:text-[#1A1310]'
                      }`}
                    >
                      <Sliders className="w-3.5 h-3.5 text-[#C25E3E]" />
                      <span>2. Card Capacity &amp; Registry</span>
                    </button>
                  </div>

                  <button
                    onClick={() => setIsAddCustomerOpen(true)}
                    className="bg-[#2044E2] hover:bg-[#1836B2] text-white px-4 py-2 text-xs font-jakarta font-bold flex items-center gap-1.5 rounded-xl shadow-md shadow-[#2044E2]/20 cursor-pointer shrink-0 transition-all"
                    title="Enroll new customer at counter"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>New Customer</span>
                  </button>
                </div>
              </div>

              {/* Sub-Header Quick Feature Highlights */}
              <div className="flex flex-wrap items-center justify-between gap-3 text-xs font-space text-[#7A6B63] pt-1">
                <div className="flex items-center gap-4">
                  <span className="flex items-center gap-1.5 text-[#1A1310] font-medium">
                    <Printer className="w-3.5 h-3.5 text-[#2044E2]" />
                    <span>80mm Thermal Receipt Direct Print</span>
                  </span>
                  <span className="hidden sm:inline text-[#DDD4C7]">•</span>
                  <span className="flex items-center gap-1.5 text-[#1A1310] font-medium">
                    <Percent className="w-3.5 h-3.5 text-[#2E7D32]" />
                    <span>5% Cafe GST Split (2.5% CGST + 2.5% SGST)</span>
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[#1A1310]">Active Card: <strong className="text-[#2044E2]">{totalSlots} Stamps</strong></span>
                  <span className="text-[#C25E3E] font-bold bg-[#C25E3E]/10 px-2.5 py-0.5 rounded-full border border-[#C25E3E]/30 inline-flex items-center gap-1">
                    <Zap className="w-3 h-3 fill-[#C25E3E]" />
                    <span>5d Streak = +2 Stamps (Skips a Day)</span>
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
                    showToast(`5-Day Streak Active! +2 STAMPS awarded to ${invoice.customer?.name}!`);
                  } else {
                    showToast(`Receipt printed! +1 Stamp awarded to ${invoice.customer?.name}! Total: ${invoice.customer?.stamps}/${totalSlots}`);
                  }
                  if (invoice.loyaltyResult?.isRewardUnlocked) {
                    setTimeout(() => {
                      sounds.playRewardFanfare();
                      triggerConfetti();
                      showToast(`MILESTONE REACHED! ${invoice.customer?.name} unlocked Free Gift!`);
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
                <div className="p-6 rounded-3xl bg-white border border-[#DDD4C7] shadow-sm space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <Sliders className="w-4 h-4 text-[#2044E2]" />
                        <h4 className="font-fraunces font-bold text-lg text-[#1A1310]">
                          Loyalty Card Capacity Setting
                        </h4>
                      </div>
                      <p className="text-xs text-[#7A6B63] font-jakarta">
                        Configure how many stamps are required to unlock the Free Gift (default: 6 stamps, up to 12).
                      </p>
                    </div>

                    <span className="px-3.5 py-1 rounded-full bg-[#2044E2] text-white font-space font-bold text-xs shadow-sm self-start sm:self-auto">
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
                        className={`py-3 rounded-xl border text-xs font-space font-bold transition cursor-pointer flex flex-col items-center justify-center gap-0.5 ${
                          totalSlots === num
                            ? 'bg-[#2044E2] text-white border-[#2044E2] shadow-md shadow-[#2044E2]/25'
                            : 'bg-[#F6F1EA] border-[#DDD4C7] text-[#1A1310] hover:bg-white hover:border-[#2044E2]'
                        }`}
                      >
                        <span className="text-sm">{num}</span>
                        <span className="text-[9px] opacity-75">{num === 6 ? 'Default' : 'Stamps'}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* SECTION C: CUSTOMER DATABASE & FREE GIFT ASSIGNMENT */}
                <div className="p-6 rounded-3xl bg-white border border-[#DDD4C7] shadow-sm space-y-5">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-[#2044E2]" />
                        <h4 className="font-fraunces font-bold text-lg text-[#1A1310]">
                          Customer Database &amp; Free Gift Assignment
                        </h4>
                      </div>
                      <p className="text-xs text-[#7A6B63] font-jakarta">
                        Choose the exact free gift for any customer, or keep as random. Data persists in browser storage.
                      </p>
                    </div>

                    <span className="text-xs font-space text-[#7A6B63] bg-[#F6F1EA] px-3 py-1 rounded-full border border-[#DDD4C7]">
                      {customers.length} Registered Members
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
                          className="p-4 rounded-2xl bg-[#FFFDF9] border border-[#E8E1D5] hover:border-[#DDD4C7] flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xs transition-all"
                        >
                          {/* Left: Customer Info */}
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <h5 className="font-fraunces font-bold text-base text-[#1A1310]">{c.name}</h5>
                              <span className="text-[10px] font-space px-2 py-0.5 rounded-full bg-[#EFE9DF] text-[#7A6B63]">
                                #{c.phone}
                              </span>
                              {(c.streakDays || 0) >= 5 && (
                                <span className="text-[10px] font-space px-2 py-0.5 rounded-full bg-[#C25E3E]/10 text-[#C25E3E] border border-[#C25E3E]/30 font-bold inline-flex items-center gap-1">
                                  <Flame className="w-2.5 h-2.5 fill-[#C25E3E]" />
                                  <span>5d Streak</span>
                                </span>
                              )}
                            </div>
                            <p className="text-xs font-space text-[#7A6B63]">
                              Progress: <strong className="text-[#2044E2] font-bold">{c.stamps || 0} / {totalSlots} Stamps</strong> • Streak: {c.streakDays || 1} days • {c.xp || 420} XP
                            </p>
                          </div>

                          {/* Middle: Free Gift Dropdown (Admin Customizer) */}
                          <div className="space-y-1">
                            <span className="text-[10px] font-space text-[#7A6B63] block">Assigned Milestone Gift</span>
                            <select
                              value={c.assignedGiftId || 'discount50'}
                              onChange={(e) => handleCustomerGiftChange(c.id, e.target.value)}
                              className="px-3 py-1.5 rounded-xl bg-white border border-[#DDD4C7] text-[#1A1310] font-space text-xs focus:outline-none focus:border-[#2044E2] focus:ring-1 focus:ring-[#2044E2] cursor-pointer shadow-xs"
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
                              className="px-2.5 py-1.5 rounded-lg bg-white hover:bg-[#2044E2] hover:text-white border border-[#DDD4C7] text-xs font-space font-bold text-[#1A1310] shadow-xs transition cursor-pointer disabled:opacity-30"
                              title="Add 1 Stamp"
                            >
                              +1
                            </button>
                            <button
                              onClick={() => handleAdjustStamps(c.id, -1)}
                              disabled={(c.stamps || 0) <= 0}
                              className="px-2.5 py-1.5 rounded-lg bg-white hover:bg-[#C25E3E] hover:text-white border border-[#DDD4C7] text-xs font-space font-bold text-[#1A1310] shadow-xs transition cursor-pointer disabled:opacity-30"
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
                              className="p-1.5 rounded-lg bg-[#F6F1EA] hover:bg-[#E8E1D5] text-[#7A6B63] hover:text-[#1A1310] border border-[#DDD4C7] transition cursor-pointer"
                              title="Reset to 1 stamp"
                            >
                              <RotateCcw className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => setHistoryCustomer(c)}
                              className="px-3 py-1.5 rounded-lg bg-[#2044E2]/10 hover:bg-[#2044E2]/20 text-[#2044E2] font-space text-xs font-bold border border-[#2044E2]/25 transition cursor-pointer flex items-center gap-1.5"
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
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1A1310]/80 backdrop-blur-md">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative w-full max-w-lg rounded-3xl bg-[#FAF6F0] border border-[#DDD4C7] p-6 shadow-2xl space-y-4 text-[#1A1310] max-h-[85vh] flex flex-col"
            >
              <div className="flex items-center justify-between pb-3 border-b border-[#DDD4C7]">
                <div className="flex items-center gap-2.5">
                  <Receipt className="w-5 h-5 text-[#2044E2]" />
                  <div>
                    <h4 className="font-fraunces font-bold text-lg text-[#1A1310]">Billing History</h4>
                    <p className="text-xs font-space text-[#7A6B63]">{historyCustomer.name} (#{historyCustomer.phone})</p>
                  </div>
                </div>
                <button
                  onClick={() => setHistoryCustomer(null)}
                  className="p-2 rounded-xl bg-white border border-[#DDD4C7] text-[#7A6B63] hover:text-[#1A1310] transition cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="overflow-y-auto space-y-2 flex-1 pr-1">
                {(!historyCustomer.billingHistory || historyCustomer.billingHistory.length === 0) ? (
                  <p className="text-xs text-[#7A6B63] font-space py-6 text-center">No bills recorded yet.</p>
                ) : (
                  historyCustomer.billingHistory.map((bill, idx) => (
                    <div key={idx} className="p-3.5 rounded-xl bg-white border border-[#E8E1D5] flex items-center justify-between text-xs font-space shadow-xs">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-[#1A1310] font-bold">{bill.id}</span>
                          <span className="text-[#A0938A]">{bill.date} {bill.time}</span>
                        </div>
                        <p className="text-[11px] text-[#7A6B63] font-jakarta mt-0.5">{bill.items}</p>
                      </div>
                      <div className="text-right">
                        <span className="text-[#1A1310] font-bold block text-sm">₹{bill.amount}</span>
                        <span className={`text-[10px] font-bold ${bill.streakApplied ? 'text-[#C25E3E]' : 'text-[#2044E2]'}`}>
                          +{bill.stampsAwarded} Stamp(s) {bill.streakApplied ? '(Streak Boost)' : ''}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>

              <button
                onClick={() => setHistoryCustomer(null)}
                className="w-full py-3 rounded-xl bg-[#1A1310] hover:bg-[#2B1F19] text-xs font-jakarta font-bold text-[#F6F1EA] transition cursor-pointer"
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
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1A1310]/80 backdrop-blur-md">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative w-full max-w-md rounded-3xl bg-[#FAF6F0] border border-[#DDD4C7] p-6 shadow-2xl space-y-4 text-[#1A1310]"
            >
              <div className="flex items-center justify-between pb-3 border-b border-[#DDD4C7]">
                <div className="flex items-center gap-2.5">
                  <UserCheck className="w-5 h-5 text-[#2044E2]" />
                  <h4 className="font-fraunces font-bold text-lg text-[#1A1310]">Enroll New Customer</h4>
                </div>
                <button
                  onClick={() => setIsAddCustomerOpen(false)}
                  className="p-2 rounded-xl bg-white border border-[#DDD4C7] text-[#7A6B63] hover:text-[#1A1310] transition cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleCreateCustomer} className="space-y-3.5">
                <div className="space-y-1">
                  <label className="text-xs font-space text-[#7A6B63] font-medium">Full Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Alex Morgan"
                    value={newCustomerName}
                    onChange={(e) => setNewCustomerName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#DDD4C7] text-[#1A1310] placeholder-[#A0938A] text-xs font-jakarta focus:outline-none focus:border-[#2044E2] shadow-xs"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-space text-[#7A6B63] font-medium">Mobile Phone</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 9811223344"
                    value={newCustomerPhone}
                    onChange={(e) => setNewCustomerPhone(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#DDD4C7] text-[#1A1310] placeholder-[#A0938A] text-xs font-space focus:outline-none focus:border-[#2044E2] shadow-xs"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-space text-[#7A6B63] font-medium">Assigned Milestone Gift</label>
                  <select
                    value={newCustomerGift}
                    onChange={(e) => setNewCustomerGift(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#DDD4C7] text-[#1A1310] text-xs font-space focus:outline-none focus:border-[#2044E2] shadow-xs cursor-pointer"
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
                    className="w-full bg-[#2044E2] hover:bg-[#1836B2] text-white py-3.5 text-xs font-jakarta font-bold rounded-xl shadow-lg shadow-[#2044E2]/25 cursor-pointer transition-all"
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
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1A1310]/85 backdrop-blur-md">
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative w-full max-w-sm rounded-3xl bg-[#FFFDF9] border-2 border-[#DDD4C7] p-7 text-center shadow-2xl space-y-5 text-[#1A1310] overflow-hidden"
            >
              <button
                onClick={() => setActiveRedemptionVoucher(null)}
                className="absolute top-4 right-4 p-2 rounded-xl bg-white border border-[#DDD4C7] text-[#7A6B63] hover:text-[#1A1310] transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="w-14 h-14 rounded-full mx-auto bg-[#2044E2]/10 border border-[#2044E2]/30 flex items-center justify-center text-[#2044E2] shadow-xs">
                <Gift className="w-7 h-7" />
              </div>

              <div className="space-y-1">
                <span className="text-[10px] font-space px-3 py-1 rounded-full bg-[#2044E2]/10 text-[#2044E2] font-bold border border-[#2044E2]/25 uppercase tracking-wider">
                  REDEEM AT COUNTER
                </span>
                <h4 className="font-fraunces font-bold text-2xl text-[#1A1310] pt-2">
                  {activeRedemptionVoucher.title}
                </h4>
                <p className="text-xs text-[#7A6B63] font-jakarta leading-relaxed">
                  {activeRedemptionVoucher.desc}
                </p>
              </div>

              {/* Dynamic QR & Barcode Simulation */}
              <div className="stamp-card-stitch p-4 rounded-2xl bg-white text-black flex flex-col items-center space-y-2 shadow-inner border-2 border-dashed border-[#DDD4C7]">
                <QrCode className="w-32 h-32 text-[#1A1310]" />
                <span className="font-space text-xs font-bold tracking-widest text-[#2044E2]">
                  PASS-{activeRedemptionVoucher.code || 'REWARD50'}
                </span>
              </div>

              {/* 5-Minute Countdown Timer */}
              <div className="flex items-center justify-center gap-2 text-xs font-space font-bold text-[#C25E3E] bg-[#C25E3E]/10 py-1.5 px-3.5 rounded-full border border-[#C25E3E]/20 mx-auto w-fit">
                <Clock className="w-4 h-4" />
                <span>
                  Valid for: {Math.floor(redemptionTimer / 60)}:{(redemptionTimer % 60).toString().padStart(2, '0')}
                </span>
              </div>

              <p className="text-[11px] text-[#7A6B63] font-jakarta">
                Show this digital pass to the barista at the counter to claim your specialty reward!
              </p>

              <button
                onClick={() => {
                  sounds.playSuccess();
                  setActiveRedemptionVoucher(null);
                  triggerConfetti();
                  showToast('Reward claimed successfully! Enjoy your treat!');
                }}
                className="w-full bg-[#2044E2] hover:bg-[#1836B2] text-white py-3.5 text-xs font-jakarta font-bold rounded-2xl shadow-lg shadow-[#2044E2]/25 cursor-pointer transition-all"
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
