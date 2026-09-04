import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { 
  QrCode, 
  UtensilsCrossed, 
  Compass,
  Award,
  CheckCircle2,
  Clock, 
  ArrowRight,
  Star, 
  Lock, 
  ChevronRight, 
  ChevronLeft 
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { BRAND_CONFIG } from '../../data/cafeConfig';
import { sounds } from '../../utils/audio';

// =========================================================================
// CUSTOM ANIMATED 2D VECTOR ICONS (MODERN, LAYERED, NO EMOJIS)
// =========================================================================

/** 1. Animated 2D Speed & Lightning Icon */
function AnimatedSpeedIcon() {
  return (
    <div className="relative w-10 h-10 rounded-2xl bg-gradient-to-br from-amber-500/20 via-amber-500/10 to-slate-950 border border-amber-400/30 flex items-center justify-center shadow-lg shadow-amber-500/10 overflow-hidden group">
      {/* Ambient Pulsing Glow */}
      <motion.div
        animate={{ scale: [1, 1.3, 1], opacity: [0.3, 0.7, 0.3] }}
        transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
        className="absolute inset-0 bg-amber-400/20 rounded-full blur-md"
      />

      {/* Rotating Speed Halo Ring */}
      <motion.svg
        animate={{ rotate: 360 }}
        transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
        className="absolute inset-0.5 w-9 h-9"
        viewBox="0 0 36 36"
        fill="none"
      >
        <circle
          cx="18"
          cy="18"
          r="16"
          stroke="url(#speed-halo-grad)"
          strokeWidth="1.5"
          strokeDasharray="4 6"
          strokeLinecap="round"
          opacity="0.6"
        />
        <defs>
          <linearGradient id="speed-halo-grad" x1="0" y1="0" x2="36" y2="36" gradientUnits="userSpaceOnUse">
            <stop stopColor="#F59E0B" />
            <stop offset="1" stopColor="#FDE047" stopOpacity="0.2" />
          </linearGradient>
        </defs>
      </motion.svg>

      {/* Modern 2D Layered Lightning Bolt */}
      <motion.svg
        animate={{
          scale: [1, 1.08, 0.96, 1.05, 1],
          filter: [
            "drop-shadow(0 0 2px rgba(251, 191, 36, 0.6))",
            "drop-shadow(0 0 6px rgba(251, 191, 36, 0.9))",
            "drop-shadow(0 0 2px rgba(251, 191, 36, 0.6))"
          ]
        }}
        transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
        className="w-5 h-5 relative z-10"
        viewBox="0 0 24 24"
        fill="none"
      >
        {/* Outer Bold Shaded Path */}
        <path
          d="M13 2L3 14H12L11 22L21 10H12L13 2Z"
          fill="url(#bolt-grad)"
          stroke="#F59E0B"
          strokeWidth="1.2"
          strokeLinejoin="round"
        />
        {/* Inner Highlight Core */}
        <path
          d="M12.5 4L5.5 13H11.5L10.8 19L18.5 11H12.5L12.5 4Z"
          fill="url(#bolt-core-grad)"
          opacity="0.85"
        />
        <defs>
          <linearGradient id="bolt-grad" x1="3" y1="2" x2="21" y2="22" gradientUnits="userSpaceOnUse">
            <stop stopColor="#FDE047" />
            <stop offset="0.5" stopColor="#F59E0B" />
            <stop offset="1" stopColor="#D97706" />
          </linearGradient>
          <linearGradient id="bolt-core-grad" x1="5.5" y1="4" x2="18.5" y2="19" gradientUnits="userSpaceOnUse">
            <stop stopColor="#FFFFFF" />
            <stop offset="0.6" stopColor="#FEF08A" />
            <stop offset="1" stopColor="#FBBF24" />
          </linearGradient>
        </defs>
      </motion.svg>
    </div>
  );
}

/** 2. Animated 2D Contactless Smart Card / Instant Pay Icon */
function AnimatedPaymentIcon() {
  return (
    <div className="relative w-10 h-10 rounded-2xl bg-gradient-to-br from-cyan-500/20 via-cyan-500/10 to-slate-950 border border-cyan-400/30 flex items-center justify-center shadow-lg shadow-cyan-500/10 overflow-hidden group">
      {/* Ambient Pulsing Glow */}
      <motion.div
        animate={{ scale: [1, 1.3, 1], opacity: [0.3, 0.7, 0.3] }}
        transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut", delay: 0.4 }}
        className="absolute inset-0 bg-cyan-400/20 rounded-full blur-md"
      />

      <svg className="w-5 h-5 relative z-10" viewBox="0 0 24 24" fill="none">
        {/* Card Body with metallic gradient */}
        <rect
          x="2"
          y="5"
          width="20"
          height="14"
          rx="3"
          fill="url(#card-body-grad)"
          stroke="#38BDF8"
          strokeWidth="1.2"
        />
        
        {/* Card Magnetic / Laser Stripe */}
        <rect x="2" y="8.5" width="20" height="3" fill="#0369A1" opacity="0.6" />

        {/* EMV Microchip */}
        <rect x="4.5" y="13" width="3.5" height="3" rx="0.75" fill="url(#chip-grad)" stroke="#F59E0B" strokeWidth="0.5" />

        {/* Contactless Signal Waves (Animated Pulse) */}
        <motion.path
          animate={{ opacity: [0.2, 1, 0.2] }}
          transition={{ duration: 1.5, repeat: Infinity, delay: 0 }}
          d="M16 12.5C16.5 13.2 16.5 14.3 16 15"
          stroke="#38BDF8"
          strokeWidth="1.2"
          strokeLinecap="round"
        />
        <motion.path
          animate={{ opacity: [0.2, 1, 0.2] }}
          transition={{ duration: 1.5, repeat: Infinity, delay: 0.3 }}
          d="M18 11.5C19 12.7 19 14.8 18 16"
          stroke="#7DD3FC"
          strokeWidth="1.2"
          strokeLinecap="round"
        />

        <defs>
          <linearGradient id="card-body-grad" x1="2" y1="5" x2="22" y2="19" gradientUnits="userSpaceOnUse">
            <stop stopColor="#0C4A6E" />
            <stop offset="1" stopColor="#082F49" />
          </linearGradient>
          <linearGradient id="chip-grad" x1="4.5" y1="13" x2="8" y2="16" gradientUnits="userSpaceOnUse">
            <stop stopColor="#FDE047" />
            <stop offset="1" stopColor="#D97706" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
}

/** 3. Animated 2D Realistic Sizzling Flame Icon (Multilayer vector + rising embers) */
function AnimatedFlameIcon() {
  return (
    <div className="relative w-10 h-10 rounded-2xl bg-gradient-to-br from-rose-500/20 via-orange-500/10 to-slate-950 border border-rose-400/30 flex items-center justify-center shadow-lg shadow-rose-500/10 overflow-hidden group">
      {/* Ambient Pulsing Red-Orange Glow */}
      <motion.div
        animate={{ scale: [1, 1.35, 1], opacity: [0.3, 0.75, 0.3] }}
        transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
        className="absolute inset-0 bg-rose-500/25 rounded-full blur-md"
      />

      {/* Floating Micro Ember 1 */}
      <motion.div
        animate={{
          y: [-2, -14],
          x: [0, -3],
          opacity: [0, 1, 0],
          scale: [0.6, 1.2, 0.4]
        }}
        transition={{ duration: 1.6, repeat: Infinity, ease: "easeOut" }}
        className="absolute w-1 h-1 rounded-full bg-amber-300 pointer-events-none top-5 left-3"
      />

      {/* Floating Micro Ember 2 */}
      <motion.div
        animate={{
          y: [-2, -16],
          x: [0, 4],
          opacity: [0, 1, 0],
          scale: [0.5, 1, 0.3]
        }}
        transition={{ duration: 2.1, repeat: Infinity, ease: "easeOut", delay: 0.5 }}
        className="absolute w-1 h-1 rounded-full bg-orange-400 pointer-events-none top-6 right-3"
      />

      {/* Dancing Layered 2D Flame Vector */}
      <motion.svg
        animate={{
          scaleY: [1, 1.12, 0.94, 1.08, 1],
          scaleX: [1, 0.94, 1.05, 0.98, 1],
          skewX: [-2, 3, -1, 2, 0],
          filter: [
            "drop-shadow(0 0 2px rgba(249, 115, 22, 0.6))",
            "drop-shadow(0 0 6px rgba(239, 68, 68, 0.9))",
            "drop-shadow(0 0 2px rgba(249, 115, 22, 0.6))"
          ]
        }}
        transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
        className="w-5 h-5 relative z-10 origin-bottom"
        viewBox="0 0 24 24"
        fill="none"
      >
        {/* Outer Flame (Crimson to Orange) */}
        <path
          d="M12 2C9.5 5 7 8 7 12C7 16.5 10 19.5 12 21C14 19.5 17 16.5 17 12C17 7 13.5 4 12 2Z"
          fill="url(#outer-flame-grad)"
          stroke="#EF4444"
          strokeWidth="0.8"
        />

        {/* Middle Flame Lick */}
        <path
          d="M12 7C10.5 9 8.5 11 8.5 13.5C8.5 16.5 10.5 18.5 12 19.5C13.5 18.5 15.5 16.5 15.5 13.5C15.5 10.5 13 8 12 7Z"
          fill="url(#mid-flame-grad)"
        />

        {/* Hot Core Flame (Golden Amber to White) */}
        <path
          d="M12 11C11 12.5 10 13.8 10 15C10 17 11.2 18.2 12 18.8C12.8 18.2 14 17 14 15C14 13.5 12.8 12 12 11Z"
          fill="url(#core-flame-grad)"
        />

        <defs>
          <linearGradient id="outer-flame-grad" x1="12" y1="2" x2="12" y2="21" gradientUnits="userSpaceOnUse">
            <stop stopColor="#F97316" />
            <stop offset="0.5" stopColor="#EF4444" />
            <stop offset="1" stopColor="#B91C1C" />
          </linearGradient>
          <linearGradient id="mid-flame-grad" x1="12" y1="7" x2="12" y2="19.5" gradientUnits="userSpaceOnUse">
            <stop stopColor="#FBBF24" />
            <stop offset="1" stopColor="#EA580C" />
          </linearGradient>
          <linearGradient id="core-flame-grad" x1="12" y1="11" x2="12" y2="18.8" gradientUnits="userSpaceOnUse">
            <stop stopColor="#FFFFFF" />
            <stop offset="0.7" stopColor="#FEF08A" />
            <stop offset="1" stopColor="#F59E0B" />
          </linearGradient>
        </defs>
      </motion.svg>
    </div>
  );
}

// =========================================================================
// FEATURED SIGNATURE DISHES FOR 3D CAROUSEL
// =========================================================================

const SHOWCASE_DISHES = [
  {
    id: "thc-01",
    tag: "WOOD-FIRED NEAPOLITAN",
    badge: "Chef's Signature",
    name: "Wood-Fired Margherita Basilico",
    price: 349,
    rating: "5.0",
    reviews: "2.8k+ reviews",
    prepTime: "12 mins",
    image: "https://images.unsplash.com/photo-1604382355076-af4b0eb60143?auto=format&fit=crop&w=800&q=80",
    description: "Authentic Neapolitan crust, San Marzano tomato concasse, fresh buffalo mozzarella & aromatic sweet basil.",
    accentColor: "from-amber-500/20 via-orange-500/10 to-transparent",
    badgeColor: "bg-amber-400 text-slate-950"
  },
  {
    id: "thc-05",
    tag: "ARTISAN ITALIAN PASTA",
    badge: "Most Loved",
    name: "Smoked Alfredo White Sauce Penne",
    price: 269,
    rating: "4.9",
    reviews: "3.2k+ reviews",
    prepTime: "12 mins",
    image: "https://images.unsplash.com/photo-1645112411341-6c4fd023714a?auto=format&fit=crop&w=800&q=80",
    description: "Rich garlic Parmesan cream sauce penne tossed with sweet corn, wild mushrooms, and herbed European butter.",
    accentColor: "from-yellow-500/20 via-amber-500/10 to-transparent",
    badgeColor: "bg-yellow-400 text-slate-950"
  },
  {
    id: "thc-17",
    tag: "GOURMET CAFE SPECIAL",
    badge: "Crowd Choice",
    name: "Truffle Mushroom & Swiss Burger",
    price: 279,
    rating: "4.9",
    reviews: "1.9k+ reviews",
    prepTime: "12 mins",
    image: "https://images.unsplash.com/photo-1586190848861-99aa4a171e90?auto=format&fit=crop&w=800&q=80",
    description: "Crispy grilled herb-mushroom patty, melted Swiss cheese, balsamic caramelized onions, and white truffle garlic aioli.",
    accentColor: "from-rose-500/20 via-orange-500/10 to-transparent",
    badgeColor: "bg-rose-500 text-white"
  },
  {
    id: "thc-21",
    tag: "SPECIALTY ROAST BREW",
    badge: "Barista Favorite",
    name: "Classic Iced Caramel Macchiato",
    price: 189,
    rating: "4.9",
    reviews: "2.4k+ reviews",
    prepTime: "5 mins",
    image: "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?auto=format&fit=crop&w=800&q=80",
    description: "Vanilla-infused cold frothed milk marked with double shot dark espresso float and salted caramel lattice.",
    accentColor: "from-orange-500/20 via-amber-500/10 to-transparent",
    badgeColor: "bg-amber-400 text-slate-950"
  },
  {
    id: "thc-29",
    tag: "AUTHENTIC ITALIAN DOLCE",
    badge: "Must Try",
    name: "Tiramisu Classico della Casa",
    price: 229,
    rating: "5.0",
    reviews: "3.6k+ reviews",
    prepTime: "4 mins",
    image: "https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?auto=format&fit=crop&w=800&q=80",
    description: "Espresso-soaked Savoiardi ladyfingers layered with velvety mascarpone cream and dusted with Valrhona cocoa.",
    accentColor: "from-emerald-500/20 via-teal-500/10 to-transparent",
    badgeColor: "bg-emerald-400 text-slate-950"
  }
];

export function HeroSection({ onExploreMenu, onOpenScanner, onOpenAdmin }) {
  const { isCustomerLoggedIn } = useAuth();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const [isPaused, setIsPaused] = useState(false);

  // 3D Parallax Mouse Tilt Setup (Subtle & Refined)
  const cardRef = useRef(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [3, -3]), { stiffness: 180, damping: 22 });
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-3, 3]), { stiffness: 180, damping: 22 });

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    mouseX.set(x);
    mouseY.set(y);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  // Auto slide timer
  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      setDirection(1);
      setCurrentIndex((prev) => (prev + 1) % SHOWCASE_DISHES.length);
    }, 4200);

    return () => clearInterval(interval);
  }, [isPaused]);

  const handleNext = () => {
    sounds.playClick();
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % SHOWCASE_DISHES.length);
  };

  const handlePrev = () => {
    sounds.playClick();
    setDirection(-1);
    setCurrentIndex((prev) => (prev - 1 + SHOWCASE_DISHES.length) % SHOWCASE_DISHES.length);
  };

  const currentDish = SHOWCASE_DISHES[currentIndex];

  // Refined 3D Animation Variants for Screen Changing (Subtle & Smooth)
  const slideVariants = {
    enter: (dir) => ({
      rotateY: dir > 0 ? 12 : -12,
      scale: 0.96,
      z: -30,
      opacity: 0,
      filter: 'blur(3px)'
    }),
    center: {
      rotateY: 0,
      rotateX: 0,
      scale: 1,
      z: 0,
      opacity: 1,
      filter: 'blur(0px)',
      transition: {
        type: 'spring',
        stiffness: 260,
        damping: 26,
        mass: 0.8
      }
    },
    exit: (dir) => ({
      rotateY: dir > 0 ? -12 : 12,
      scale: 0.96,
      z: -30,
      opacity: 0,
      filter: 'blur(3px)',
      transition: {
        duration: 0.3,
        ease: 'easeInOut'
      }
    })
  };

  return (
    <section className="relative pt-12 pb-20 overflow-hidden">
      {/* Background Subtle Ambience */}
      <div className="absolute top-1/4 -left-32 w-80 h-80 bg-amber-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-10 -right-32 w-80 h-80 bg-rose-500/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Refined Editorial Copy */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            
            {/* Minimal Bistro Tag */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/90 border border-white/10 text-xs font-mono text-slate-300"
            >
              <Compass className="w-3.5 h-3.5 text-amber-400" />
              <span>{BRAND_CONFIG.hero.locationTag}</span>
            </motion.div>

            {/* Main Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-4xl sm:text-6xl xl:text-7xl font-black text-white font-syne tracking-tight leading-[1.08]"
            >
              {BRAND_CONFIG.hero.headlineLine1} <br />
              <span className="bg-gradient-to-r from-amber-300 via-amber-200 to-yellow-100 bg-clip-text text-transparent">
                {BRAND_CONFIG.hero.headlineLine2}
              </span>
            </motion.h1>

            {/* Subheading */}
            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="text-slate-400 text-sm sm:text-base max-w-xl mx-auto lg:mx-0 leading-relaxed font-normal"
            >
              {BRAND_CONFIG.hero.description}
            </motion.p>

            {/* Action CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="flex flex-wrap items-center justify-center lg:justify-start gap-3.5 pt-2"
            >
              {/* Explore Menu Button */}
              <button
                onClick={() => { sounds.playClick(); onExploreMenu(); }}
                className="btn-3d btn-3d-amber px-6 py-3.5 rounded-2xl font-syne font-bold text-xs sm:text-sm flex items-center gap-2 group"
              >
                <UtensilsCrossed className="w-4 h-4 transition-transform group-hover:rotate-12" />
                <span>EXPLORE MENU</span>
                {!isCustomerLoggedIn && <Lock className="w-3.5 h-3.5 text-slate-900" />}
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
              </button>

              {/* Scan Table QR Button */}
              <button
                onClick={() => { sounds.playClick(); onOpenScanner(); }}
                className="btn-3d btn-3d-dark px-5 py-3.5 rounded-2xl font-syne font-semibold text-xs sm:text-sm flex items-center gap-2"
              >
                <QrCode className="w-4 h-4 text-amber-400" />
                <span>SCAN TABLE QR</span>
              </button>
            </motion.div>

            {/* Micro Highlights Badges with Real 2D Animated Vectors */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 pt-6 border-t border-white/5 max-w-xl mx-auto lg:mx-0"
            >
              {/* Badge 1: 10-15 Min Serve */}
              <motion.div
                whileHover={{ y: -3, scale: 1.02 }}
                className="p-3 rounded-2xl bg-slate-900/80 hover:bg-slate-900 border border-white/5 hover:border-amber-400/30 transition-all flex items-center gap-3 group shadow-sm"
              >
                <AnimatedSpeedIcon />
                <div className="text-left">
                  <p className="text-white text-xs font-bold font-syne group-hover:text-amber-300 transition">
                    {BRAND_CONFIG.hero.deliveryTag}
                  </p>
                  <p className="text-[10px] text-slate-400 font-mono">Fast Table Serve</p>
                </div>
              </motion.div>

              {/* Badge 2: Contactless Pay */}
              <motion.div
                whileHover={{ y: -3, scale: 1.02 }}
                className="p-3 rounded-2xl bg-slate-900/80 hover:bg-slate-900 border border-white/5 hover:border-cyan-400/30 transition-all flex items-center gap-3 group shadow-sm"
              >
                <AnimatedPaymentIcon />
                <div className="text-left">
                  <p className="text-white text-xs font-bold font-syne group-hover:text-cyan-300 transition">
                    {BRAND_CONFIG.hero.paymentTag}
                  </p>
                  <p className="text-[10px] text-slate-400 font-mono">Instant Pay</p>
                </div>
              </motion.div>

              {/* Badge 3: 24/7 Kitchen */}
              <motion.div
                whileHover={{ y: -3, scale: 1.02 }}
                className="p-3 rounded-2xl bg-slate-900/80 hover:bg-slate-900 border border-white/5 hover:border-rose-400/30 transition-all flex items-center gap-3 group shadow-sm"
              >
                <AnimatedFlameIcon />
                <div className="text-left">
                  <p className="text-white text-xs font-bold font-syne group-hover:text-rose-300 transition">
                    {BRAND_CONFIG.hero.kitchenTag}
                  </p>
                  <p className="text-[10px] text-slate-400 font-mono">Always Sizzling</p>
                </div>
              </motion.div>
            </motion.div>

          </div>

          {/* Right Column: 3D Animated Visual Showcase */}
          <div 
            className="lg:col-span-5 relative"
            style={{ perspective: 1800 }}
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => { setIsPaused(false); handleMouseLeave(); }}
            onMouseMove={handleMouseMove}
            ref={cardRef}
          >
            
            {/* Ambient Background 3D Glow */}
            <div className="absolute -inset-4 bg-gradient-to-r from-amber-500/20 via-orange-500/10 to-rose-500/20 rounded-3xl blur-2xl opacity-60 pointer-events-none transition-all duration-700" />

            {/* 3D Interactive Tilt Container */}
            <motion.div
              style={{
                rotateX,
                rotateY,
                transformStyle: "preserve-3d"
              }}
              className="relative w-full"
            >
              
              {/* Animated Presence for 3D Screen Changing */}
              <AnimatePresence custom={direction} mode="wait">
                <motion.div
                  key={currentDish.id}
                  custom={direction}
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  className="relative rounded-3xl p-1 bg-gradient-to-b from-white/20 via-white/5 to-transparent shadow-2xl overflow-hidden"
                  style={{
                    transformStyle: "preserve-3d"
                  }}
                >
                  {/* Glassmorphic Inner Card */}
                  <div className="relative rounded-[22px] bg-slate-900/95 backdrop-blur-xl border border-white/10 overflow-hidden p-5 shadow-2xl">
                    
                    {/* Top Accent Gradient Light */}
                    <div className={`absolute top-0 left-0 right-0 h-32 bg-gradient-to-b ${currentDish.accentColor} pointer-events-none`} />

                    {/* Image Showcase Container with 3D Depth */}
                    <div className="relative h-60 rounded-2xl overflow-hidden mb-4 shadow-inner group">
                      <motion.img
                        key={currentDish.image}
                        initial={{ scale: 1.1, opacity: 0.85 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.7 }}
                        src={currentDish.image}
                        alt={currentDish.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/25 to-transparent" />
                      
                      {/* Floating Live Badge */}
                      <motion.div 
                        initial={{ y: -10, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.15 }}
                        className="absolute top-3 left-3 px-3 py-1 rounded-full bg-slate-950/85 backdrop-blur-md border border-white/15 text-[11px] font-mono text-amber-300 font-bold tracking-wider shadow-lg flex items-center gap-1.5"
                      >
                        <Award className="w-3.5 h-3.5 text-amber-400" />
                        <span>{currentDish.tag}</span>
                      </motion.div>

                      {/* Top Right Live Tag */}
                      <div className="absolute top-3 right-3 px-2 py-0.5 rounded-lg bg-black/60 backdrop-blur-md border border-white/10 text-[10px] font-mono text-slate-300 flex items-center gap-1">
                        <CheckCircle2 className="w-2.5 h-2.5 text-emerald-400" />
                        <span>FRESH</span>
                      </div>

                      {/* Rating & Price with 3D Floating Feel */}
                      <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs">
                        <span className="px-2.5 py-1 rounded-xl bg-slate-950/90 backdrop-blur-md border border-white/10 text-white font-mono text-[11px] flex items-center gap-1 shadow-md">
                          <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" /> 
                          <span>{currentDish.rating} ({currentDish.reviews})</span>
                        </span>
                        
                        <span className={`px-3 py-1 rounded-xl font-syne font-black text-xs shadow-lg tracking-wide ${currentDish.badgeColor}`}>
                          ₹{currentDish.price} ONLY
                        </span>
                      </div>
                    </div>

                    {/* Card Info Details */}
                    <div className="space-y-2 relative z-10">
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-bold text-white font-syne truncate max-w-[240px]">
                          {currentDish.name}
                        </h3>
                        <span className="text-[10px] px-2 py-0.5 rounded-lg bg-amber-400/10 border border-amber-400/20 text-amber-300 font-mono font-semibold">
                          {currentDish.badge}
                        </span>
                      </div>

                      <p className="text-slate-400 text-xs leading-relaxed line-clamp-2 min-h-[32px]">
                        {currentDish.description}
                      </p>

                      {/* Footer Actions & Carousel Controls */}
                      <div className="pt-2.5 flex items-center justify-between border-t border-white/5">
                        
                        {/* Prep Time */}
                        <div className="flex items-center gap-1.5 text-[11px] text-slate-300 font-mono">
                          <Clock className="w-3.5 h-3.5 text-amber-400" />
                          <span>Ready in {currentDish.prepTime}</span>
                        </div>

                        {/* Order Dish Trigger Button */}
                        <button
                          onClick={() => { sounds.playClick(); onExploreMenu(); }}
                          className="btn-3d btn-3d-amber px-3.5 py-1.5 rounded-xl font-bold text-xs font-syne flex items-center gap-1"
                        >
                          <span>Order Dish</span>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </button>

                      </div>

                    </div>

                  </div>
                </motion.div>
              </AnimatePresence>

              {/* 3D Navigation Controls Bar */}
              <div className="mt-4 flex items-center justify-between px-2">
                
                {/* Dots indicator with animated progress */}
                <div className="flex items-center gap-1.5">
                  {SHOWCASE_DISHES.map((d, idx) => (
                    <button
                      key={d.id}
                      onClick={() => {
                        sounds.playClick();
                        setDirection(idx > currentIndex ? 1 : -1);
                        setCurrentIndex(idx);
                      }}
                      className={`h-2 rounded-full transition-all duration-300 ${
                        currentIndex === idx
                          ? 'w-7 bg-amber-400 shadow-sm shadow-amber-400/50'
                          : 'w-2 bg-slate-800 hover:bg-slate-700'
                      }`}
                      aria-label={`Go to slide ${idx + 1}`}
                    />
                  ))}
                </div>

                {/* Left/Right 3D Interactive Arrows */}
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={handlePrev}
                    className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-white/10 text-slate-300 hover:text-white transition active:scale-90"
                    aria-label="Previous Dish"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>

                  <button
                    onClick={handleNext}
                    className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-white/10 text-slate-300 hover:text-white transition active:scale-90"
                    aria-label="Next Dish"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>

              </div>

            </motion.div>

          </div>

        </div>
      </div>
    </section>
  );
}
