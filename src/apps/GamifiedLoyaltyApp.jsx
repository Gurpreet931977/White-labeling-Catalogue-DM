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
  Store
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
import { ModelSwitcherModal } from '../components/common/ModelSwitcherModal';

export function GamifiedLoyaltyApp({ onBackToVariants, onBackToCatalogue }) {
  // Theme Mode: 'coffee' (Espresso Roastery) vs 'bakery' (Artisan Patisserie)
  const [themeMode, setThemeMode] = useState('coffee');
  
  // View Mode: 'customer' (Mobile Passport) vs 'kiosk' (In-Store Barista Counter)
  const [viewMode, setViewMode] = useState('customer');

  // Customer State
  const [customerName, setCustomerName] = useState('Maya Chen');
  const [customerPhone, setCustomerPhone] = useState('98765 43210');
  const [stamps, setStamps] = useState(4); // default 4/8 so client immediately sees progress
  const [xp, setXp] = useState(320);
  const [streakDays, setStreakDays] = useState(5);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [isModelSwitcherOpen, setIsModelSwitcherOpen] = useState(false);
  const [feedbackToast, setFeedbackToast] = useState(null);

  // Mystery Card State
  const [mysteryRevealed, setMysteryRevealed] = useState(false);
  const [mysteryShaking, setMysteryShaking] = useState(false);
  const [mysteryReward, setMysteryReward] = useState(null);

  // Perk Redemption Modal
  const [activeRedemptionPerk, setActiveRedemptionPerk] = useState(null);
  const [redemptionTimer, setRedemptionTimer] = useState(300); // 5 mins in secs

  // Kiosk Input
  const [kioskPhoneInput, setKioskPhoneInput] = useState('');
  const [kioskPinInput, setKioskPinInput] = useState('');
  const [isKioskUnlocked, setIsKioskUnlocked] = useState(true);

  // Countdown timer for active perk voucher
  useEffect(() => {
    let interval = null;
    if (activeRedemptionPerk && redemptionTimer > 0) {
      interval = setInterval(() => {
        setRedemptionTimer((prev) => (prev > 0 ? prev - 1 : 0));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [activeRedemptionPerk, redemptionTimer]);

  const triggerConfetti = () => {
    confetti({
      particleCount: 75,
      spread: 70,
      origin: { y: 0.6 },
      colors: themeMode === 'coffee' ? ['#ebd73f', '#ca8a04', '#f59e0b', '#ffffff'] : ['#f472b6', '#f59e0b', '#fbbf24', '#ffffff']
    });
  };

  // Stamp action with rubber squish & audio feedback
  const handleStamp = (stampIndex) => {
    if (stamps >= 8 && stampIndex >= 8) return;
    
    sounds.playStampSquish();
    const nextStamps = Math.min(8, stamps + 1);
    setStamps(nextStamps);
    setXp((prev) => prev + 50);

    // Show feedback toast
    setFeedbackToast(`✨ Stamp #${nextStamps} Collected! (+50 XP)`);
    setTimeout(() => setFeedbackToast(null), 3200);

    if (nextStamps === 8) {
      setTimeout(() => {
        sounds.playRewardFanfare();
        triggerConfetti();
        setFeedbackToast('🎉 GRAND PERK UNLOCKED: Free Specialty Drink + Pastry!');
      }, 400);
    }
  };

  // Reset demo
  const handleReset = () => {
    sounds.playClick();
    setStamps(1);
    setMysteryRevealed(false);
    setMysteryReward(null);
    setFeedbackToast('Passport reset to 1 stamp for demo testing.');
    setTimeout(() => setFeedbackToast(null), 2500);
  };

  // Reveal Mystery Reward with jiggly animation
  const handleRevealMystery = () => {
    if (mysteryRevealed) return;
    sounds.playClick();
    setMysteryShaking(true);

    setTimeout(() => {
      setMysteryShaking(false);
      setMysteryRevealed(true);
      sounds.playRewardFanfare();
      triggerConfetti();

      const perks = themeMode === 'coffee'
        ? [
            { title: 'Free Oat Milk Upgrade', desc: 'Complimentary creamy oat or almond milk', code: 'OATFREE' },
            { title: '50 Bonus Beans', desc: 'Boosted XP points towards Gold Tier', code: 'BEANS50' },
            { title: 'Free Extra Espresso Shot', desc: 'Double your morning caffeine kick', code: 'SHOTBOOST' }
          ]
        : [
            { title: 'Free Glazed Donut', desc: 'Fresh morning artisanal donut on us', code: 'DONUTO' },
            { title: '25% Off Sourdough Loaf', desc: 'Stone-baked rustic country loaf discount', code: 'SOUR25' },
            { title: 'Free Cinnamon Roll Drizzle', desc: 'Warm vanilla bean glaze top-up', code: 'ROLLGLAZE' }
          ];
      setMysteryReward(perks[Math.floor(Math.random() * perks.length)]);
    }, 900);
  };

  // Redeem Voucher
  const handleOpenRedeem = (perk) => {
    sounds.playClick();
    setActiveRedemptionPerk(perk);
    setRedemptionTimer(300);
  };

  // Tier calculation
  const getTier = () => {
    if (xp >= 650) return { name: 'Master Roaster & Baker', level: 4, icon: '👑', badge: 'DIAMOND VIP', color: 'text-amber-300' };
    if (xp >= 350) return { name: 'Artisan Craftsman', level: 3, icon: '🥖', badge: 'GOLD MEMBER', color: 'text-amber-400' };
    if (xp >= 150) return { name: 'Espresso Scout', level: 2, icon: '🥐', badge: 'SILVER MEMBER', color: 'text-yellow-300' };
    return { name: 'Bean Cadet', level: 1, icon: '☕', badge: 'BRONZE MEMBER', color: 'text-slate-300' };
  };

  const currentTier = getTier();

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

          {/* Right Controls: Theme Toggle & Sound */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* View Mode Toggle: Customer Pass vs Barista Kiosk */}
            <div className="flex items-center p-1 rounded-full bg-white/5 border border-white/10 text-xs">
              <button
                onClick={() => { sounds.playClick(); setViewMode('customer'); }}
                className={`px-3 py-1 rounded-full font-semibold transition flex items-center gap-1.5 cursor-pointer ${
                  viewMode === 'customer'
                    ? 'bg-[#ebd73f] text-black font-bold shadow-sm'
                    : 'text-white/60 hover:text-white'
                }`}
              >
                <Smartphone className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Customer Pass</span>
              </button>
              <button
                onClick={() => { sounds.playClick(); setViewMode('kiosk'); }}
                className={`px-3 py-1 rounded-full font-semibold transition flex items-center gap-1.5 cursor-pointer ${
                  viewMode === 'kiosk'
                    ? 'bg-[#ebd73f] text-black font-bold shadow-sm'
                    : 'text-white/60 hover:text-white'
                }`}
              >
                <Tablet className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Barista Kiosk</span>
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

      {/* Main App Container */}
      <main className="max-w-4xl mx-auto px-4 py-8 space-y-8">
        
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
                  100% GAMIFIED
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
              <span>Bakery & Patisserie</span>
            </button>
          </div>
        </div>

        {/* ================================================================= */}
        {/* VIEW 1: CUSTOMER MOBILE LOYALTY PASSBOOK                          */}
        {/* ================================================================= */}
        {viewMode === 'customer' && (
          <div className="space-y-6">
            
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
                    {customerName}
                  </h3>
                  <p className="text-xs font-mono text-slate-400">
                    ID: #{customerPhone.replace(/\s+/g, '')} • Member since Sept 2024
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
                  <span className="font-mono text-[#ebd73f] font-bold">{xp} / 650 XP</span>
                </div>

                {/* Fluid XP Bar */}
                <div className="h-3 w-full rounded-full bg-white/10 overflow-hidden p-0.5 border border-white/10">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min(100, (xp / 650) * 100)}%` }}
                    transition={{ duration: 1, ease: 'easeOut' }}
                    className="h-full rounded-full bg-gradient-to-r from-amber-400 via-yellow-400 to-[#ebd73f] shadow-glow-yellow"
                  />
                </div>
              </div>

              {/* Quick Card Stats Pill Row */}
              <div className="mt-5 grid grid-cols-3 gap-2.5 pt-2 relative z-10">
                <div className="p-3 rounded-2xl bg-white/[0.04] border border-white/5 text-center">
                  <span className="text-[10px] font-mono text-slate-400 block">Current Stamps</span>
                  <span className="font-panchang font-bold text-lg text-[#ebd73f]">{stamps} / 8</span>
                </div>
                <div className="p-3 rounded-2xl bg-white/[0.04] border border-white/5 text-center">
                  <span className="text-[10px] font-mono text-slate-400 block">Streak Days</span>
                  <span className="font-panchang font-bold text-lg text-orange-400 flex items-center justify-center gap-1">
                    <span>{streakDays}</span>
                    <Flame className="w-4 h-4 fill-orange-400" />
                  </span>
                </div>
                <div className="p-3 rounded-2xl bg-white/[0.04] border border-white/5 text-center">
                  <span className="text-[10px] font-mono text-slate-400 block">Perks Unlocked</span>
                  <span className="font-panchang font-bold text-lg text-emerald-400">
                    {stamps >= 8 ? '3 Ready' : stamps >= 4 ? '1 Ready' : 'In Progress'}
                  </span>
                </div>
              </div>

            </motion.div>

            {/* ============================================================= */}
            {/* 8-SLOT DIGITAL JIGGLY PUNCH CARD                              */}
            {/* ============================================================= */}
            <div className="p-6 sm:p-7 rounded-3xl bg-[#111111] border border-white/10 space-y-5">
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <Award className="w-5 h-5 text-[#ebd73f]" />
                    <h3 className="font-panchang font-bold text-lg text-white">
                      8-Slot Digital Punch Card
                    </h3>
                  </div>
                  <p className="text-xs text-slate-400 font-clash mt-0.5">
                    {themeMode === 'coffee'
                      ? 'Collect 8 coffee stamps. Every stamp brings you closer to free specialty brews!'
                      : 'Collect 8 pastry stamps. 4th stamp unlocks a Butter Croissant; 8th unlocks Grand Pastry Box!'}
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => handleStamp(stamps + 1)}
                    disabled={stamps >= 8}
                    className="btn-dripp-primary px-4 py-2 text-xs font-bold flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>+1 Stamp Now</span>
                  </button>

                  <button
                    onClick={handleReset}
                    className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition cursor-pointer"
                    title="Reset Stamps (for testing)"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* 8 STAMP GRID */}
              <div className="grid grid-cols-4 sm:grid-cols-4 gap-3 sm:gap-4 pt-2">
                {[1, 2, 3, 4, 5, 6, 7, 8].map((slotNumber) => {
                  const isStamped = stamps >= slotNumber;
                  const isMilestone = slotNumber === 8;
                  const isIntermediateReward = slotNumber === 4;

                  return (
                    <motion.div
                      key={slotNumber}
                      whileHover={{ scale: 1.05, rotate: isStamped ? 0 : [-2, 2, 0] }}
                      whileTap={{ scale: 0.92 }}
                      onClick={() => !isStamped && handleStamp(slotNumber)}
                      className={`relative rounded-2xl p-3 sm:p-4 aspect-square flex flex-col items-center justify-between text-center transition-all cursor-pointer select-none overflow-hidden border ${
                        isStamped
                          ? 'bg-gradient-to-br from-amber-500/20 to-amber-950/40 border-amber-400/60 shadow-lg shadow-amber-500/10'
                          : isMilestone
                          ? 'bg-gradient-to-br from-purple-500/15 via-black to-slate-950 border-purple-400/50 hover:border-purple-300'
                          : isIntermediateReward
                          ? 'bg-amber-400/5 border-amber-400/30 hover:border-amber-400/60'
                          : 'bg-black/50 border-white/10 hover:border-white/30'
                      }`}
                    >
                      {/* Stamp Slot Number Tag */}
                      <span className="text-[10px] font-mono font-bold text-slate-400 self-start">
                        #{slotNumber}
                      </span>

                      {/* Center Graphic */}
                      <div className="flex-1 flex items-center justify-center w-full my-1">
                        {isStamped ? (
                          <JigglyStampMark
                            stampNumber={slotNumber}
                            label={isMilestone ? "FREE GIFT" : "STAMPED"}
                            isMilestone={isMilestone}
                            icon={isMilestone ? Gift : themeMode === 'coffee' ? Coffee : Check}
                          />
                        ) : isMilestone ? (
                          <div className="flex flex-col items-center animate-pulse">
                            <Gift className="w-7 h-7 text-purple-400" />
                            <span className="text-[9px] font-syne font-bold text-purple-300 mt-1">GRAND PERK</span>
                          </div>
                        ) : isIntermediateReward ? (
                          <div className="flex flex-col items-center">
                            {themeMode === 'coffee' ? (
                              <Coffee className="w-6 h-6 text-amber-400" />
                            ) : (
                              <LottieJigglyCroissant size={32} />
                            )}
                            <span className="text-[8px] font-mono text-amber-300 mt-0.5">Free Pastry</span>
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

                      {/* Bottom Status Label */}
                      <span className={`text-[9px] font-mono font-bold tracking-tight ${
                        isStamped ? 'text-amber-400' : isMilestone ? 'text-purple-400' : 'text-slate-500'
                      }`}>
                        {isStamped ? 'COMPLETED' : isMilestone ? '8th: FREE' : 'Tap to Stamp'}
                      </span>
                    </motion.div>
                  );
                })}
              </div>

              {/* Progress Summary Bar */}
              <div className="p-3.5 rounded-2xl bg-white/[0.02] border border-white/5 flex items-center justify-between text-xs font-mono">
                <span className="text-slate-400">Card Progress:</span>
                <span className="text-[#ebd73f] font-bold">
                  {stamps >= 8
                    ? '🎉 100% COMPLETE — REWARD READY!'
                    : `${8 - stamps} more ${8 - stamps === 1 ? 'stamp' : 'stamps'} to unlock Grand Reward`}
                </span>
              </div>

            </div>

            {/* ============================================================= */}
            {/* DAILY STREAK & MYSTERY SCRATCH CARD GRID                      */}
            {/* ============================================================= */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              
              {/* Daily Streak Card */}
              <div className="p-6 rounded-3xl bg-[#111111] border border-white/10 flex flex-col justify-between space-y-4">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center gap-1.5 text-xs font-mono text-orange-400 font-bold uppercase">
                      <Zap className="w-4 h-4" />
                      <span>DAILY CAFFEINE STREAK</span>
                    </div>
                    <h4 className="font-panchang font-bold text-xl text-white">
                      {streakDays}-Day Hot Streak 🔥
                    </h4>
                    <p className="text-xs text-slate-400 font-clash">
                      Check in daily at counter or online. Day 7 unlocks a <strong>2x Star Multiplier</strong>!
                    </p>
                  </div>
                  <LottieStreakFlame days={streakDays} size={52} />
                </div>

                {/* 7-Day Streak Pills */}
                <div className="grid grid-cols-7 gap-1.5 pt-2">
                  {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, dIdx) => {
                    const isActive = dIdx < streakDays;
                    const isToday = dIdx === streakDays - 1;
                    return (
                      <div
                        key={dIdx}
                        className={`p-2 rounded-xl text-center border transition-all ${
                          isActive
                            ? 'bg-orange-500/20 border-orange-500/50 text-orange-300 font-bold shadow-sm'
                            : 'bg-white/[0.02] border-white/5 text-slate-600'
                        } ${isToday ? 'ring-2 ring-orange-400' : ''}`}
                      >
                        <span className="text-[10px] font-mono block">{day}</span>
                        <span className="text-xs">{isActive ? '✓' : '•'}</span>
                      </div>
                    );
                  })}
                </div>

                <div className="pt-2 text-[11px] font-mono text-orange-300/80 flex items-center gap-1.5">
                  <Flame className="w-3.5 h-3.5 shrink-0" />
                  <span>Next milestone: Day 7 Double Roast Perks (+100 XP)</span>
                </div>
              </div>

              {/* Interactive Mystery Scratch / Treat Box */}
              <div className="p-6 rounded-3xl bg-[#111111] border border-white/10 flex flex-col justify-between space-y-4">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center gap-1.5 text-xs font-mono text-[#ebd73f] font-bold uppercase">
                      <Gift className="w-4 h-4" />
                      <span>DAILY MYSTERY TREAT</span>
                    </div>
                    <h4 className="font-panchang font-bold text-xl text-white">
                      {mysteryRevealed ? 'Secret Perk Unveiled!' : 'Tap To Shake & Reveal'}
                    </h4>
                    <p className="text-xs text-slate-400 font-clash">
                      {mysteryRevealed
                        ? 'Congratulations! Your secret daily voucher has been added to your Perk Vault.'
                        : 'Every day unlocks a surprise gift: bonus beans, free drizzle, or pastry discounts.'}
                    </p>
                  </div>
                  <LottieMysteryBox size={52} isShaking={mysteryShaking} />
                </div>

                {/* Mystery Scratch Action Area */}
                <div className="pt-2">
                  {mysteryRevealed && mysteryReward ? (
                    <motion.div
                      initial={{ scale: 0.9, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="p-4 rounded-2xl bg-amber-400/10 border border-amber-400/40 flex items-center justify-between"
                    >
                      <div className="space-y-0.5">
                        <span className="text-[10px] font-mono text-amber-300 font-bold uppercase">UNLOCKED CODE: {mysteryReward.code}</span>
                        <h5 className="font-syne font-bold text-sm text-white">{mysteryReward.title}</h5>
                        <p className="text-[11px] text-slate-400">{mysteryReward.desc}</p>
                      </div>
                      <button
                        onClick={() => handleOpenRedeem(mysteryReward)}
                        className="btn-dripp-primary px-3 py-1.5 text-xs font-bold shrink-0 cursor-pointer shadow-md"
                      >
                        Redeem
                      </button>
                    </motion.div>
                  ) : (
                    <button
                      onClick={handleRevealMystery}
                      disabled={mysteryShaking}
                      className="w-full py-3 rounded-2xl bg-gradient-to-r from-amber-400/20 via-yellow-400/20 to-amber-500/20 hover:from-amber-400/30 hover:to-amber-500/30 border border-amber-400/30 text-amber-300 font-syne font-bold text-xs flex items-center justify-center gap-2 transition cursor-pointer animate-jiggle-hover"
                    >
                      <Sparkles className="w-4 h-4 text-[#ebd73f]" />
                      <span>{mysteryShaking ? 'Shaking Box...' : 'Tap to Shake & Open Mystery Box'}</span>
                    </button>
                  )}
                </div>

                <div className="text-[10px] font-mono text-slate-500">
                  Resets daily at 06:00 AM • Available once per 24 hours
                </div>
              </div>

            </div>

            {/* ============================================================= */}
            {/* PERKS & REWARDS VAULT                                         */}
            {/* ============================================================= */}
            <div className="p-6 sm:p-7 rounded-3xl bg-[#111111] border border-white/10 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-panchang font-bold text-lg text-white">
                    Perks &amp; Rewards Vault
                  </h3>
                  <p className="text-xs text-slate-400 font-clash">
                    Show voucher QR to your barista at checkout to claim your treats.
                  </p>
                </div>
                <span className="text-xs font-mono text-[#ebd73f] font-bold">
                  {stamps >= 8 ? '2 Ready to Claim' : '1 Ready'}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                {/* Perk 1: Oat Milk Upgrade */}
                <div className="p-4 rounded-2xl bg-black/60 border border-white/10 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-amber-400/10 border border-amber-400/30 flex items-center justify-center shrink-0">
                      <Coffee className="w-5 h-5 text-amber-400" />
                    </div>
                    <div>
                      <h5 className="font-syne font-bold text-sm text-white">Free Oat Milk Upgrade</h5>
                      <p className="text-[11px] text-slate-400">Available on any beverage</p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleOpenRedeem({ title: 'Free Oat Milk Upgrade', desc: 'Any standard or iced specialty brew', code: 'OAT-PASS' })}
                    className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-[#ebd73f] hover:text-black text-xs font-bold transition cursor-pointer shrink-0"
                  >
                    Redeem
                  </button>
                </div>

                {/* Perk 2: Flaky Croissant (Active if stamps >= 4) */}
                <div className={`p-4 rounded-2xl border flex items-center justify-between gap-3 ${
                  stamps >= 4 ? 'bg-black/60 border-amber-400/40' : 'bg-black/30 border-white/5 opacity-60'
                }`}>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-amber-400/10 border border-amber-400/30 flex items-center justify-center shrink-0">
                      <LottieJigglyCroissant size={28} />
                    </div>
                    <div>
                      <h5 className="font-syne font-bold text-sm text-white">Fresh Flaky Croissant</h5>
                      <p className="text-[11px] text-slate-400">{stamps >= 4 ? 'Milestone Reached (Slot 4)' : 'Requires 4 stamps'}</p>
                    </div>
                  </div>
                  {stamps >= 4 ? (
                    <button
                      onClick={() => handleOpenRedeem({ title: 'Fresh Flaky Butter Croissant', desc: 'Baked fresh every morning at 7am', code: 'CRUMB-4' })}
                      className="px-3 py-1.5 rounded-xl bg-[#ebd73f] text-black font-bold text-xs transition cursor-pointer shrink-0"
                    >
                      Redeem
                    </button>
                  ) : (
                    <span className="text-[10px] font-mono text-slate-500">Locked</span>
                  )}
                </div>

                {/* Perk 3: Grand Milestone Perk (Active if stamps >= 8) */}
                <div className={`sm:col-span-2 p-5 rounded-2xl border flex items-center justify-between gap-4 ${
                  stamps >= 8
                    ? 'bg-gradient-to-r from-purple-950/60 to-black border-purple-400/60 ring-2 ring-purple-400/40 shadow-xl'
                    : 'bg-black/30 border-white/5 opacity-60'
                }`}>
                  <div className="flex items-center gap-3.5">
                    <div className="w-12 h-12 rounded-2xl bg-purple-500/20 border border-purple-400/40 flex items-center justify-center shrink-0">
                      <Gift className="w-6 h-6 text-purple-300" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono font-bold text-purple-300">8TH VISIT GRAND REWARD</span>
                        <span className="px-2 py-0.2 rounded-full bg-purple-500/20 text-purple-200 text-[9px] font-bold">VIP ONLY</span>
                      </div>
                      <h4 className="font-panchang font-bold text-base text-white">Free Specialty Beverage + Artisan Treat</h4>
                      <p className="text-xs text-slate-300 font-clash">Any flat white, cold brew, or latte + warm bakery item of choice.</p>
                    </div>
                  </div>

                  {stamps >= 8 ? (
                    <button
                      onClick={() => handleOpenRedeem({ title: 'Grand Milestone Treat: Drink + Pastry', desc: '100% On the house for completing 8 stamps!', code: 'GRAND-8TH' })}
                      className="btn-dripp-primary px-5 py-2.5 text-xs font-bold shrink-0 cursor-pointer shadow-lg"
                    >
                      Claim Grand Perk
                    </button>
                  ) : (
                    <span className="text-xs font-mono text-purple-400 font-bold">{8 - stamps} stamps left</span>
                  )}
                </div>
              </div>
            </div>

          </div>
        )}

        {/* ================================================================= */}
        {/* VIEW 2: IN-STORE BARISTA COUNTER KIOSK MODE                       */}
        {/* ================================================================= */}
        {viewMode === 'kiosk' && (
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="p-6 sm:p-8 rounded-3xl bg-[#0e0e0e] border-2 border-amber-400/40 shadow-2xl space-y-6"
          >
            {/* Kiosk Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 border-b border-white/10">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-[#ebd73f] text-black flex items-center justify-center font-black shadow-lg">
                  <Tablet className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono uppercase text-[#ebd73f] font-bold">
                      IN-STORE BARISTA TOUCHSCREEN TERMINAL
                    </span>
                    <span className="px-2 py-0.2 rounded-full bg-emerald-500/20 text-emerald-300 font-mono text-[9px] font-bold">
                      ONLINE
                    </span>
                  </div>
                  <h3 className="font-panchang font-bold text-xl text-white">
                    Countertop Stamp &amp; Member Kiosk
                  </h3>
                </div>
              </div>

              <div className="text-right">
                <span className="text-[11px] font-mono text-slate-400 block">Terminal ID</span>
                <span className="text-xs font-mono text-white font-bold">POS-KIOSK-01 • Barista Alex</span>
              </div>
            </div>

            {/* Member Quick-Search by Phone / Digits */}
            <div className="p-4 sm:p-5 rounded-2xl bg-black/70 border border-white/10 space-y-3">
              <label className="text-xs font-mono text-slate-400 uppercase tracking-wider block">
                1. Look up Guest by Mobile Number
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder="Enter 10-digit customer phone..."
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  className="flex-1 px-4 py-3 rounded-xl bg-slate-900 border border-white/15 text-white font-mono text-sm focus:outline-none focus:border-[#ebd73f]"
                />
                <button
                  onClick={() => {
                    sounds.playClick();
                    setFeedbackToast(`Customer account for ${customerPhone} retrieved!`);
                    setTimeout(() => setFeedbackToast(null), 2500);
                  }}
                  className="px-5 py-3 rounded-xl bg-[#ebd73f] text-black font-bold text-xs font-syne cursor-pointer"
                >
                  Lookup
                </button>
              </div>
            </div>

            {/* Guest Profile Card on Kiosk */}
            <div className="p-5 rounded-2xl bg-gradient-to-r from-stone-900 to-black border border-amber-400/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-amber-400/10 border border-amber-400/30 flex items-center justify-center font-bold text-amber-400">
                  {customerName.charAt(0)}
                </div>
                <div>
                  <h4 className="font-panchang font-bold text-base text-white">{customerName}</h4>
                  <p className="text-xs font-mono text-slate-400">{customerPhone} • {currentTier.name}</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="text-right">
                  <span className="text-[10px] font-mono text-slate-400 block">Current Progress</span>
                  <span className="font-panchang font-bold text-lg text-[#ebd73f]">{stamps} / 8 Stamps</span>
                </div>

                {stamps >= 8 ? (
                  <span className="px-3 py-1.5 rounded-full bg-purple-500/20 text-purple-300 font-mono text-xs font-bold border border-purple-400/40 animate-pulse">
                    🎉 GRAND PERK DUE
                  </span>
                ) : (
                  <span className="px-3 py-1.5 rounded-full bg-amber-400/15 text-amber-300 font-mono text-xs font-bold border border-amber-400/30">
                    Active Visitor
                  </span>
                )}
              </div>
            </div>

            {/* Quick 1-Tap Stamp Action Buttons for Staff */}
            <div className="space-y-3">
              <label className="text-xs font-mono text-slate-400 uppercase tracking-wider block">
                2. Tap to Stamp Guest Passport
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <button
                  onClick={() => handleStamp(stamps + 1)}
                  disabled={stamps >= 8}
                  className="p-5 rounded-2xl bg-gradient-to-br from-amber-400/20 to-yellow-500/10 hover:from-amber-400/30 hover:to-yellow-500/20 border border-amber-400/40 text-left cursor-pointer transition active:scale-95 disabled:opacity-50"
                >
                  <Coffee className="w-6 h-6 text-amber-400 mb-2" />
                  <h5 className="font-syne font-bold text-sm text-white">+1 Coffee Stamp</h5>
                  <p className="text-[11px] text-slate-400 mt-1">Settle order &amp; record caffeine punch</p>
                </button>

                <button
                  onClick={() => handleStamp(stamps + 1)}
                  disabled={stamps >= 8}
                  className="p-5 rounded-2xl bg-gradient-to-br from-orange-400/20 to-amber-500/10 hover:from-orange-400/30 hover:to-amber-500/20 border border-orange-400/40 text-left cursor-pointer transition active:scale-95 disabled:opacity-50"
                >
                  <LottieJigglyCroissant size={28} className="mb-2" />
                  <h5 className="font-syne font-bold text-sm text-white">+1 Pastry Stamp</h5>
                  <p className="text-[11px] text-slate-400 mt-1">Artisan loaf, croissant or morning bake</p>
                </button>

                <button
                  onClick={() => {
                    sounds.playRewardFanfare();
                    triggerConfetti();
                    setStamps(1);
                    setFeedbackToast('Perk redeemed & card renewed for next cycle!');
                    setTimeout(() => setFeedbackToast(null), 3000);
                  }}
                  className="p-5 rounded-2xl bg-gradient-to-br from-purple-500/20 to-slate-950 hover:from-purple-500/30 border border-purple-400/40 text-left cursor-pointer transition active:scale-95"
                >
                  <Gift className="w-6 h-6 text-purple-300 mb-2" />
                  <h5 className="font-syne font-bold text-sm text-white">Redeem &amp; Renew</h5>
                  <p className="text-[11px] text-slate-400 mt-1">Claim milestone &amp; start new card</p>
                </button>
              </div>
            </div>

            {/* Live Kiosk Activity Feed */}
            <div className="pt-4 border-t border-white/10 space-y-2 font-mono text-xs text-slate-400">
              <span className="text-[10px] text-slate-500 uppercase tracking-widest block">Live Activity Stream</span>
              <div className="flex items-center justify-between py-1.5 border-b border-white/5">
                <span className="text-white">Maya Chen • Visit #{stamps} Stamped (Flat White)</span>
                <span className="text-amber-400">Just Now</span>
              </div>
              <div className="flex items-center justify-between py-1.5 border-b border-white/5">
                <span className="text-white">Liam K. • Redeemed Free Almond Croissant</span>
                <span className="text-slate-500">12 mins ago</span>
              </div>
              <div className="flex items-center justify-between py-1.5">
                <span className="text-white">Sarah D. • Unlocked Level 3 Artisan VIP</span>
                <span className="text-slate-500">28 mins ago</span>
              </div>
            </div>

          </motion.div>
        )}

      </main>

      {/* ================================================================= */}
      {/* MODAL: ACTIVE PERK COUNTDOWN QR REDEMPTION PASS                   */}
      {/* ================================================================= */}
      <AnimatePresence>
        {activeRedemptionPerk && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative w-full max-w-sm rounded-3xl bg-[#0f0f0f] border border-amber-400/40 p-6 text-center shadow-2xl space-y-5 text-white"
            >
              <button
                onClick={() => setActiveRedemptionPerk(null)}
                className="absolute top-4 right-4 p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="w-14 h-14 rounded-full mx-auto bg-amber-400/20 border border-amber-400/40 flex items-center justify-center text-amber-300">
                <Gift className="w-7 h-7" />
              </div>

              <div className="space-y-1">
                <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-amber-400/15 text-amber-300 font-bold border border-amber-400/30">
                  READY FOR BARISTA SCAN
                </span>
                <h4 className="font-panchang font-bold text-lg text-white pt-2">
                  {activeRedemptionPerk.title}
                </h4>
                <p className="text-xs text-slate-400 font-clash">
                  {activeRedemptionPerk.desc}
                </p>
              </div>

              {/* Dynamic QR & Barcode Simulation */}
              <div className="p-4 rounded-2xl bg-white text-black flex flex-col items-center space-y-2 shadow-inner">
                <QrCode className="w-32 h-32" />
                <span className="font-mono text-xs font-bold tracking-widest">
                  PASS-{activeRedemptionPerk.code || 'REWARD77'}
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
                Show this digital voucher to the barista at the counter to redeem immediately.
              </p>

              <button
                onClick={() => {
                  sounds.playSuccess();
                  setActiveRedemptionPerk(null);
                  triggerConfetti();
                }}
                className="w-full btn-dripp-primary py-3 text-xs font-bold cursor-pointer"
              >
                Confirm Redemption Complete
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
