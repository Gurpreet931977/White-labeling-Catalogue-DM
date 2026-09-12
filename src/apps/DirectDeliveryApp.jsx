import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, 
  ArrowRight, 
  ArrowUpRight, 
  Bike, 
  Check, 
  Clock, 
  Compass, 
  CreditCard, 
  Flame, 
  Home, 
  Layers, 
  MapPin, 
  Minus, 
  Navigation, 
  Package, 
  Phone, 
  Plus, 
  QrCode, 
  Receipt, 
  RotateCcw, 
  Search, 
  Share2, 
  ShieldCheck, 
  ShoppingBag, 
  Sparkles, 
  Store, 
  Tag, 
  Truck, 
  Tv, 
  Utensils, 
  Volume2, 
  X, 
  Zap,
  Building,
  Briefcase,
  Radio,
  CircleDot,
  CheckCircle2,
  Sliders,
  Sun,
  Moon
} from 'lucide-react';
import { sounds } from '../utils/audio';

// ============================================================================
// LOTTIE-STYLED VECTOR MICRO-ANIMATIONS (PURE SVG + FRAMER-MOTION)
// ============================================================================

/**
 * 1. LottieDeliveryRider:
 * High-fidelity animated electric delivery courier with rotating spoke wheels,
 * suspension vibration, rising steam curls from thermal box, headlight beam & moving road dashes.
 */
function LottieDeliveryRider({ className = "w-28 h-20", isMoving = true, badgeText, isLight = true }) {
  const riderColor = isLight ? "#1C1612" : "#FAF7F2";
  const roadColor = isLight ? "#D8CCBE" : "#33251D";
  const boxBorder = isLight ? "#1C1612" : "#FAF7F2";

  return (
    <div className={`relative inline-flex flex-col items-center justify-center ${className}`}>
      <svg viewBox="0 0 160 100" className="w-full h-full overflow-visible" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="scooterBodyGrad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#C26D38" />
            <stop offset="100%" stopColor="#E0864B" />
          </linearGradient>
          <linearGradient id="headlightCone" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#DFBA84" stopOpacity="0.45" />
            <stop offset="100%" stopColor="#DFBA84" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* Headlight beam projection */}
        <polygon points="112,60 160,46 160,74" fill="url(#headlightCone)" opacity="0.8" />

        {/* Road surface speed dashes */}
        <g opacity="0.6">
          <line x1="8" y1="88" x2="152" y2="88" stroke={roadColor} strokeWidth="2" strokeDasharray="10 8" />
          {isMoving && (
            <motion.line
              x1="0"
              y1="88"
              x2="160"
              y2="88"
              stroke="#C26D38"
              strokeWidth="2.5"
              strokeDasharray="14 16"
              animate={{ strokeDashoffset: [0, -60] }}
              transition={{ repeat: Infinity, ease: "linear", duration: 0.7 }}
            />
          )}
        </g>

        {/* Scooter and Rider group with suspension bob */}
        <motion.g
          animate={isMoving ? { y: [0, -2.2, 0, -1.2, 0] } : {}}
          transition={{ repeat: Infinity, duration: 0.65, ease: "easeInOut" }}
        >
          {/* Thermal Delivery Backpack on rear rack */}
          <rect x="22" y="34" width="28" height="28" rx="5" fill="#C26D38" stroke={boxBorder} strokeWidth="1.5" />
          <line x1="22" y1="44" x2="50" y2="44" stroke="#120F0D" strokeWidth="1.5" />
          <line x1="36" y1="34" x2="36" y2="62" stroke="#120F0D" strokeWidth="1.5" />
          {/* Active thermal LED dot */}
          <circle cx="44" cy="38" r="2" fill="#16A34A" className="animate-pulse" />

          {/* Steam curls drifting from thermal box micro-vents */}
          <motion.path
            d="M 30 30 Q 28 22, 32 16"
            stroke="#C26D38"
            strokeWidth="1.5"
            strokeLinecap="round"
            fill="none"
            animate={{ opacity: [0, 0.9, 0], y: [0, -7] }}
            transition={{ repeat: Infinity, duration: 1.3, ease: "easeOut" }}
          />
          <motion.path
            d="M 38 31 Q 42 23, 38 17"
            stroke="#C26D38"
            strokeWidth="1.5"
            strokeLinecap="round"
            fill="none"
            animate={{ opacity: [0, 0.9, 0], y: [0, -8] }}
            transition={{ repeat: Infinity, duration: 1.5, delay: 0.35, ease: "easeOut" }}
          />

          {/* Rider Silhouette */}
          {/* Back & Arms */}
          <path d="M 48 46 L 62 50 L 76 58 L 92 56" stroke={riderColor} strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
          {/* Helmet */}
          <circle cx="62" cy="32" r="8" fill={isLight ? "#F5EFE6" : "#1C1814"} stroke="#C26D38" strokeWidth="2" />
          {/* Helmet aerodynamic visor */}
          <path d="M 64 31 Q 70 32, 68 36" stroke="#16A34A" strokeWidth="2" strokeLinecap="round" fill="none" />

          {/* Scooter Frame */}
          <path d="M 38 76 L 68 76 L 88 68 L 102 54" stroke="url(#scooterBodyGrad)" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" fill="none" />
          {/* Handlebar */}
          <line x1="100" y1="52" x2="108" y2="52" stroke={riderColor} strokeWidth="3" strokeLinecap="round" />
          {/* Headlight lens */}
          <circle cx="106" cy="54" r="3.5" fill="#DFBA84" />

          {/* Rear Wheel with rotating spokes */}
          <g transform="translate(36, 76)">
            <circle cx="0" cy="0" r="12" fill={isLight ? "#EDE5DA" : "#14100D"} stroke="#C26D38" strokeWidth="2.5" />
            <circle cx="0" cy="0" r="4" fill="#C26D38" />
            {isMoving && (
              <motion.g
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 0.45, ease: "linear" }}
              >
                <line x1="-10" y1="0" x2="10" y2="0" stroke={riderColor} strokeWidth="1.2" opacity="0.85" />
                <line x1="0" y1="-10" x2="0" y2="10" stroke={riderColor} strokeWidth="1.2" opacity="0.85" />
                <line x1="-7" y1="-7" x2="7" y2="7" stroke={riderColor} strokeWidth="1" opacity="0.6" />
                <line x1="-7" y1="7" x2="7" y2="-7" stroke={riderColor} strokeWidth="1" opacity="0.6" />
              </motion.g>
            )}
          </g>

          {/* Front Wheel with rotating spokes */}
          <g transform="translate(108, 76)">
            <circle cx="0" cy="0" r="12" fill={isLight ? "#EDE5DA" : "#14100D"} stroke="#C26D38" strokeWidth="2.5" />
            <circle cx="0" cy="0" r="4" fill="#C26D38" />
            {isMoving && (
              <motion.g
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 0.45, ease: "linear" }}
              >
                <line x1="-10" y1="0" x2="10" y2="0" stroke={riderColor} strokeWidth="1.2" opacity="0.85" />
                <line x1="0" y1="-10" x2="0" y2="10" stroke={riderColor} strokeWidth="1.2" opacity="0.85" />
                <line x1="-7" y1="-7" x2="7" y2="7" stroke={riderColor} strokeWidth="1" opacity="0.6" />
                <line x1="-7" y1="7" x2="7" y2="-7" stroke={riderColor} strokeWidth="1" opacity="0.6" />
              </motion.g>
            )}
          </g>
        </motion.g>
      </svg>

      {badgeText && (
        <span className={`mt-1 px-2.5 py-0.5 rounded-full border text-[9px] font-mono whitespace-nowrap shadow-xs ${
          isLight ? 'bg-white border-[#E8DFC9] text-[#B35E2A] font-bold' : 'bg-black/90 border-[#C26D38]/60 text-[#DFBA84]'
        }`}>
          {badgeText}
        </span>
      )}
    </div>
  );
}

/**
 * 2. LottieRadarScanner:
 * Live GPS radar with rotating 360-degree sweep gradient, concentric expanding shockwaves,
 * and a pulsing satellite beacon.
 */
function LottieRadarScanner({ size = 110, isLight = true }) {
  return (
    <div className="relative flex items-center justify-center shrink-0" style={{ width: size, height: size }}>
      {/* Wave 1 */}
      <motion.div
        className="absolute inset-0 rounded-full border border-[#C26D38]"
        animate={{ scale: [0.25, 1.25], opacity: [0.85, 0] }}
        transition={{ repeat: Infinity, duration: 2.4, ease: "easeOut" }}
      />
      {/* Wave 2 */}
      <motion.div
        className="absolute inset-0 rounded-full border border-[#E0864B]"
        animate={{ scale: [0.25, 1.25], opacity: [0.85, 0] }}
        transition={{ repeat: Infinity, duration: 2.4, delay: 0.8, ease: "easeOut" }}
      />
      {/* Wave 3 */}
      <motion.div
        className="absolute inset-0 rounded-full border border-[#C26D38]"
        animate={{ scale: [0.25, 1.25], opacity: [0.85, 0] }}
        transition={{ repeat: Infinity, duration: 2.4, delay: 1.6, ease: "easeOut" }}
      />

      {/* Subtle concentric grid rings */}
      <div className={`absolute inset-2 rounded-full border ${isLight ? 'border-[#C26D38]/15' : 'border-white/10'}`} />
      <div className={`absolute inset-6 rounded-full border ${isLight ? 'border-[#C26D38]/15' : 'border-white/10'}`} />
      <div className={`absolute inset-10 rounded-full border ${isLight ? 'border-[#C26D38]/15' : 'border-white/10'}`} />

      {/* Crosshair lines */}
      <div className={`absolute w-full h-[1px] ${isLight ? 'bg-[#C26D38]/20' : 'bg-white/10'}`} />
      <div className={`absolute h-full w-[1px] ${isLight ? 'bg-[#C26D38]/20' : 'bg-white/10'}`} />

      {/* Rotating 360-degree radar sweep beam */}
      <motion.div
        className="absolute inset-0 rounded-full"
        style={{
          background: 'conic-gradient(from 0deg, rgba(194, 109, 56, 0.4) 0deg, rgba(223, 186, 132, 0.15) 45deg, transparent 70deg, transparent 360deg)'
        }}
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 3.2, ease: "linear" }}
      />

      {/* Center GPS Satellite / Courier Ping */}
      <div className="relative z-10 w-4 h-4 rounded-full bg-[#C26D38] border-2 border-white shadow-[0_0_12px_#C26D38] flex items-center justify-center">
        <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
      </div>
    </div>
  );
}

/**
 * 3. LottieKitchenSteamFlame:
 * Wood-fired oven flame flicker and rising sine-wave steam particles.
 */
function LottieKitchenSteamFlame({ size = 36 }) {
  return (
    <div className="relative inline-flex items-center justify-center shrink-0" style={{ width: size, height: size }}>
      <svg viewBox="0 0 40 40" className="w-full h-full overflow-visible" fill="none">
        {/* Rising steam curls */}
        <motion.path
          d="M 14 18 Q 11 12, 15 7"
          stroke="#C26D38"
          strokeWidth="1.5"
          strokeLinecap="round"
          animate={{ opacity: [0, 0.85, 0], y: [0, -6] }}
          transition={{ repeat: Infinity, duration: 1.4, ease: "easeOut" }}
        />
        <motion.path
          d="M 20 20 Q 24 13, 20 7"
          stroke="#C26D38"
          strokeWidth="1.5"
          strokeLinecap="round"
          animate={{ opacity: [0, 0.85, 0], y: [0, -7] }}
          transition={{ repeat: Infinity, duration: 1.7, delay: 0.35, ease: "easeOut" }}
        />
        <motion.path
          d="M 26 19 Q 23 13, 26 8"
          stroke="#C26D38"
          strokeWidth="1.5"
          strokeLinecap="round"
          animate={{ opacity: [0, 0.85, 0], y: [0, -6] }}
          transition={{ repeat: Infinity, duration: 1.5, delay: 0.7, ease: "easeOut" }}
        />

        {/* Outer flame */}
        <motion.path
          d="M 20 37 C 13 37, 11 31, 15 26 C 18 23, 18 19, 20 17 C 22 19, 22 23, 25 26 C 29 31, 27 37, 20 37 Z"
          fill="#C26D38"
          animate={{
            scaleY: [1, 1.14, 0.94, 1.06, 1],
            scaleX: [1, 0.95, 1.05, 0.97, 1]
          }}
          transition={{ repeat: Infinity, duration: 0.9, ease: "easeInOut" }}
        />
        {/* Inner core flame */}
        <motion.path
          d="M 20 37 C 17 37, 15 32, 17 29 C 18 27, 19 25, 20 23 C 21 25, 22 27, 23 29 C 25 32, 23 37, 20 37 Z"
          fill="#DFBA84"
          animate={{
            scaleY: [1, 1.18, 0.9, 1],
            scaleX: [1, 0.9, 1.1, 1]
          }}
          transition={{ repeat: Infinity, duration: 0.7, ease: "easeInOut" }}
        />
      </svg>
    </div>
  );
}

/**
 * 4. LottieCelebrationBurst:
 * Radial particle celebration burst with golden circles, stars, and rings.
 */
function LottieCelebrationBurst() {
  const particles = Array.from({ length: 20 });
  return (
    <div className="absolute inset-0 pointer-events-none flex items-center justify-center overflow-hidden z-40">
      {particles.map((_, i) => {
        const angle = (i / 20) * 360;
        const dist = 75 + (i % 4) * 30;
        const rad = (angle * Math.PI) / 180;
        const x = Math.cos(rad) * dist;
        const y = Math.sin(rad) * dist;
        const colors = ['#C26D38', '#DFBA84', '#1C1612', '#E0864B', '#F3D1A5'];
        const color = colors[i % colors.length];

        return (
          <motion.div
            key={i}
            initial={{ scale: 0, x: 0, y: 0, opacity: 1 }}
            animate={{
              scale: [0, 1.3, 0.8, 0],
              x: [0, x * 1.15, x],
              y: [0, y * 1.15, y + 25],
              opacity: [1, 1, 0.9, 0],
              rotate: [0, (i % 2 === 0 ? 240 : -240)]
            }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            className="absolute"
          >
            {i % 3 === 0 ? (
              <div className="w-2.5 h-2.5 rounded-full shadow-sm" style={{ backgroundColor: color }} />
            ) : i % 3 === 1 ? (
              <div className="w-3.5 h-1.5 rounded-sm" style={{ backgroundColor: color }} />
            ) : (
              <div className="w-2.5 h-2.5 rotate-45" style={{ border: `2px solid ${color}` }} />
            )}
          </motion.div>
        );
      })}
    </div>
  );
}

/**
 * 5. LottieTamperSeal:
 * Self-drawing circular path with spring-loaded checkmark.
 */
function LottieTamperSeal({ label = "HOT THERMAL SEALED", isLight = true }) {
  return (
    <div className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border shadow-xs ${
      isLight ? 'bg-[#FAF6F0] border-[#E8DFC9]' : 'bg-[#181310] border-[#3A2A20]'
    }`}>
      <svg className="w-4 h-4 text-[#C26D38]" viewBox="0 0 36 36" fill="none">
        <motion.circle
          cx="18"
          cy="18"
          r="14"
          stroke="#C26D38"
          strokeWidth="3"
          strokeLinecap="round"
          initial={{ pathLength: 0, rotate: -90 }}
          animate={{ pathLength: 1, rotate: 0 }}
          transition={{ duration: 1.1, ease: "easeInOut" }}
        />
        <motion.path
          d="M 12 18 L 16 22 L 24 14"
          stroke="#B35E2A"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ delay: 0.5, duration: 0.45, ease: "backOut" }}
        />
      </svg>
      <span className="font-mono text-[10px] text-[#B35E2A] font-bold tracking-wider uppercase">
        {label}
      </span>
    </div>
  );
}

/**
 * 6. LottieFreeDeliveryMeter:
 * Fluid progress bar with sliding delivery scooter indicator.
 */
function LottieFreeDeliveryMeter({ subtotal, threshold, isLight = true }) {
  const isFree = subtotal >= threshold;
  const pct = Math.min(100, Math.round((subtotal / threshold) * 100));

  return (
    <div className={`p-4 rounded-2xl border space-y-2 relative overflow-hidden transition-colors ${
      isLight ? 'bg-[#FAF6F0] border-[#E8DFC9]' : 'bg-[#1D1713] border-[#33261D]'
    }`}>
      {isFree && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="absolute inset-0 bg-gradient-to-r from-[#C26D38]/10 via-[#DFBA84]/15 to-[#C26D38]/10 pointer-events-none"
        />
      )}

      <div className="flex items-center justify-between text-xs font-mono relative z-10">
        <span className={`flex items-center gap-1.5 ${isLight ? 'text-[#3D3128]' : 'text-stone-300'}`}>
          <Truck className="w-3.5 h-3.5 text-[#C26D38]" />
          <span className="font-medium">
            {isFree ? 'Free Doorstep Delivery Unlocked!' : `Add ₹${threshold - subtotal} more for FREE Delivery`}
          </span>
        </span>
        <span className="text-[#C26D38] font-bold">₹{subtotal} / ₹{threshold}</span>
      </div>

      <div className={`relative w-full h-3 rounded-full overflow-visible p-0.5 ${
        isLight ? 'bg-[#EAE0D2]' : 'bg-black/50'
      }`}>
        {/* Progress track */}
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="h-full bg-gradient-to-r from-[#C26D38] via-[#E0864B] to-[#DFBA84] rounded-full relative"
        >
          {/* Shimmer sweep */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent animate-pulse rounded-full" />
        </motion.div>

        {/* Sliding Scooter indicator */}
        <motion.div
          className="absolute top-1/2 -translate-y-1/2"
          animate={{ left: `calc(${pct}% - 10px)` }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          <div className={`w-5 h-5 rounded-full border-2 border-[#C26D38] shadow-md flex items-center justify-center ${
            isLight ? 'bg-white' : 'bg-[#FAF7F2]'
          }`}>
            <Bike className="w-3 h-3 text-[#C26D38]" />
          </div>
        </motion.div>
      </div>
    </div>
  );
}

// ============================================================================
// DIRECT DELIVERY MENU (Cloud Kitchen Specialties)
// ============================================================================
const DELIVERY_MENU = [
  {
    id: 'sourdough-margherita',
    name: '48h Fermented Margherita Rustica',
    category: 'pizzas',
    tagline: 'San Marzano DOP, buffalo mozzarella, wild basil & cold-pressed EVOO',
    price: 495,
    prepTime: '18 mins',
    popular: true,
    image: 'https://images.unsplash.com/photo-1604382355076-af4b0eb60143?auto=format&fit=crop&w=900&q=80',
    description: 'Slow-fermented 48-hour sourdough crust baked at 450°C. Delivered in a micro-vented thermal box to preserve blistered crust crispness.'
  },
  {
    id: 'truffle-funghi-pizza',
    name: 'Wild Chanterelle & White Truffle Pizza',
    category: 'pizzas',
    tagline: 'Sautéed forest mushrooms, fior di latte, white truffle oil & thyme',
    price: 645,
    prepTime: '20 mins',
    popular: true,
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=900&q=80',
    description: 'Wild forest chanterelles and cremini mushrooms over garlic cream base, finished with Piedmontese white truffle essence and cracked black pepper.'
  },
  {
    id: 'burrata-pesto-melt',
    name: 'Artisanal Burrata & Pistachio Pesto Melt',
    category: 'melts',
    tagline: 'Warm toasted focaccia, whole buffalo burrata & Sicilian pesto',
    price: 480,
    prepTime: '14 mins',
    popular: true,
    image: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&w=900&q=80',
    description: 'Herb-dusted focaccia pressed with creamy burrata, sun-dried heirloom tomatoes, and freshly stone-ground Sicilian pistachio pesto.'
  },
  {
    id: 'smoked-brisket-panini',
    name: '12hr Smoked Brisket & Gruyère Panini',
    category: 'melts',
    tagline: 'Slow-smoked tender beef brisket, melted Swiss Gruyère & pickled shallots',
    price: 540,
    prepTime: '16 mins',
    popular: false,
    image: 'https://images.unsplash.com/photo-1509722747041-616f39b57569?auto=format&fit=crop&w=900&q=80',
    description: 'Low-and-slow oak-smoked brisket layered with aged Gruyère, whole-grain Dijon mustard, and sweet balsamic pickled shallots on sourdough.'
  },
  {
    id: 'truffle-gnocchi-bowl',
    name: 'Hand-Rolled Truffle Gnocchi Bowl',
    category: 'pastas',
    tagline: 'Potato gnocchi in brown butter sage cream & 24-month Parmigiano',
    price: 580,
    prepTime: '18 mins',
    popular: true,
    image: 'https://images.unsplash.com/photo-1551183053-bf91a1d81141?auto=format&fit=crop&w=900&q=80',
    description: 'Pillowy ricotta & potato gnocchi tossed in a velvety brown butter sage cream, topped with shaved 24-month Parmigiano-Reggiano.'
  },
  {
    id: 'cacio-e-pepe-bucatini',
    name: 'Roman Cacio e Pepe Bucatini',
    category: 'pastas',
    tagline: 'Bronze-cut bucatini, Pecorino Romano DOP & toasted Malabar peppercorns',
    price: 520,
    prepTime: '15 mins',
    popular: false,
    image: 'https://images.unsplash.com/photo-1621996346565-e3d5d628169e?auto=format&fit=crop&w=900&q=80',
    description: 'Authentic Roman emulsion of Pecorino Romano and freshly crushed toasted black pepper. Packaged with heat-retaining steam seal.'
  },
  {
    id: 'sealed-cold-drip-bottle',
    name: 'Reserve Ethiopian Cold Drip (500ml Glass Bottle)',
    category: 'brews',
    tagline: '18hr slow cold extraction, notes of blueberry, bergamot & jasmine',
    price: 340,
    prepTime: 'Ready to Dispatch',
    popular: true,
    image: 'https://images.unsplash.com/photo-1517701604599-bb29b565090c?auto=format&fit=crop&w=900&q=80',
    description: 'Crafted with single-origin Yirgacheffe beans. Delivered in a tamper-sealed amber apothecary glass bottle with thermal chill wrap.'
  },
  {
    id: 'madagascar-vanilla-nitro',
    name: 'Madagascar Vanilla Nitro Brew Can',
    category: 'brews',
    tagline: 'Velvety nitrogen cascade infused with authentic vanilla bean',
    price: 290,
    prepTime: 'Ready to Dispatch',
    popular: false,
    image: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?auto=format&fit=crop&w=900&q=80',
    description: 'Micro-pressurized nitro brew cold-canned with creamy cascading head. Crack and pour inverted into a glass at home.'
  },
  {
    id: 'tiramisu-classico-jar',
    name: 'Venetian Tiramisu Classico (Glass Mason Jar)',
    category: 'desserts',
    tagline: 'Savoiardi dipped in espresso, mascarpone mousse & Valrhona cacao',
    price: 380,
    prepTime: 'Ready to Dispatch',
    popular: true,
    image: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?auto=format&fit=crop&w=900&q=80',
    description: 'Assembled in reusable glass mason jars with airtight screw caps to protect the delicate mascarpone cream during transit.'
  },
  {
    id: 'pistachio-ganache-cruffin',
    name: 'Sicilian Pistachio Ganache Cruffin',
    category: 'desserts',
    tagline: 'Laminated croissant dough baked into a muffin, pistachio cream',
    price: 260,
    prepTime: 'Ready to Dispatch',
    popular: false,
    image: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=900&q=80',
    description: 'Delivered in a ventilated pastry pouch to preserve crisp flaky layers. Filled to order with white chocolate pistachio ganache.'
  }
];

export function DirectDeliveryApp({ onBackToVariants, onBackToCatalogue }) {
  // Ambience Palette Mode: 'light' (DEFAULT - Sunlit Linen Cafe) | 'dark' (Midnight Atelier)
  const [ambience, setAmbience] = useState('light');
  const isLight = ambience === 'light';

  // Operational View Modes: 'storefront' | 'kitchen-kds' | 'courier-rider'
  const [activeMode, setActiveMode] = useState('storefront');

  // Menu Category Filter
  const [activeCategory, setActiveCategory] = useState('all');

  // Floating Flying Particle for Add-to-Cart
  const [flyingParticles, setFlyingParticles] = useState([]);

  // Delivery Address & Zone State
  const [address, setAddress] = useState({
    preset: 'Home',
    flatNo: 'Apt 402, Oakwood Court',
    building: 'Block B, Sunset Boulevard',
    area: 'Indiranagar 100ft Road',
    landmark: 'Opposite Corner House Ice Cream',
    riderNotes: 'Leave with front desk security / Ring doorbell if after 9pm',
    recipientName: 'Jordan Lee',
    recipientPhone: '+91 98112 34567',
    distanceKm: 2.4,
    estimatedMins: '28-34'
  });
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);

  // Cart / Basket State
  const [cart, setCart] = useState([
    {
      id: 'sourdough-margherita',
      name: '48h Fermented Margherita Rustica',
      price: 495,
      qty: 1,
      crust: 'Classic Sourdough',
      addons: ['Extra Basil', 'Truffle Olive Drizzle (+₹60)'],
      itemTotal: 555
    },
    {
      id: 'sealed-cold-drip-bottle',
      name: 'Reserve Ethiopian Cold Drip (500ml Glass Bottle)',
      price: 340,
      qty: 1,
      crust: 'Glass Bottle (Tamper Sealed)',
      addons: [],
      itemTotal: 340
    }
  ]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [cartBadgeBumping, setCartBadgeBumping] = useState(false);

  // Item Customizer Modal State
  const [customizingItem, setCustomizingItem] = useState(null);
  const [selectedCrust, setSelectedCrust] = useState('Classic Sourdough');
  const [selectedAddons, setSelectedAddons] = useState(['Truffle Olive Drizzle (+₹60)']);

  // Checkout & Payment State
  const [paymentMethod, setPaymentMethod] = useState('upi');
  const [promoCode, setPromoCode] = useState('');
  const [appliedDiscount, setAppliedDiscount] = useState(0);
  const [showCelebration, setShowCelebration] = useState(false);

  // Live Placed Order & GPS Journey State
  const [activeOrder, setActiveOrder] = useState({
    id: 'DELIV-#84920',
    placedAt: '12:45 PM',
    status: 'in-transit', // 'confirmed' | 'cooking' | 'in-transit' | 'delivered'
    etaMins: 14,
    courier: {
      name: 'Rahul Sharma',
      vehicle: 'Ather 450X Electric Scooter (KA-03-EM-8821)',
      rating: '4.98',
      deliveries: 1840,
      phone: '+91 98450 11223'
    },
    items: 'Margherita Rustica, Ethiopian Cold Drip (500ml)',
    total: 895,
    addressSummary: 'Apt 402, Oakwood Court, Indiranagar'
  });
  const [isLiveTrackingOpen, setIsLiveTrackingOpen] = useState(false);

  // Sound triggers
  const playChime = () => sounds.playSuccess();

  // Basket Calculations
  const subtotal = cart.reduce((sum, item) => sum + item.itemTotal * item.qty, 0);
  const freeDeliveryThreshold = 499;
  const isFreeDelivery = subtotal >= freeDeliveryThreshold;
  const deliveryFee = isFreeDelivery ? 0 : 40;
  const packagingFee = 25; // Tamper-evident thermal pouch
  const finalTotal = Math.max(0, subtotal + deliveryFee + packagingFee - appliedDiscount);
  const aggregatorComparisonSavings = Math.round(subtotal * 0.28); // 28% aggregator markup saved

  // Trigger bounce animation on cart badge
  const triggerCartBump = () => {
    setCartBadgeBumping(true);
    setTimeout(() => setCartBadgeBumping(false), 600);
  };

  // Toggle Addon in customizer
  const toggleAddon = (addonStr) => {
    sounds.playClick();
    setSelectedAddons((prev) => 
      prev.includes(addonStr) ? prev.filter((a) => a !== addonStr) : [...prev, addonStr]
    );
  };

  // Add customized item to cart with flying micro-particle
  const handleAddToCart = () => {
    if (!customizingItem) return;
    sounds.playClick();
    triggerCartBump();

    // Spawn flying particle
    const particleId = Date.now();
    setFlyingParticles((prev) => [...prev, { id: particleId, label: '+1' }]);
    setTimeout(() => {
      setFlyingParticles((prev) => prev.filter((p) => p.id !== particleId));
    }, 1000);

    const addonPrice = selectedAddons.length * 60;
    const newItem = {
      id: `${customizingItem.id}-${Date.now()}`,
      name: customizingItem.name,
      price: customizingItem.price,
      qty: 1,
      crust: selectedCrust,
      addons: [...selectedAddons],
      itemTotal: customizingItem.price + addonPrice
    };
    setCart((prev) => [...prev, newItem]);
    setCustomizingItem(null);
  };

  // Quick Add directly from card
  const handleQuickAdd = (item) => {
    sounds.playClick();
    triggerCartBump();

    const particleId = Date.now();
    setFlyingParticles((prev) => [...prev, { id: particleId, label: '+1' }]);
    setTimeout(() => {
      setFlyingParticles((prev) => prev.filter((p) => p.id !== particleId));
    }, 1000);

    const newItem = {
      id: `${item.id}-${Date.now()}`,
      name: item.name,
      price: item.price,
      qty: 1,
      crust: 'Standard Artisanal',
      addons: [],
      itemTotal: item.price
    };
    setCart((prev) => [...prev, newItem]);
  };

  // Apply Promo
  const handleApplyPromo = (e) => {
    e.preventDefault();
    sounds.playClick();
    if (promoCode.trim().toUpperCase() === 'FIRSTDRIPP') {
      setAppliedDiscount(Math.round(subtotal * 0.15));
      setShowCelebration(true);
      setTimeout(() => setShowCelebration(false), 2000);
    } else if (promoCode.trim().toUpperCase() === 'FREEDELIVERY') {
      setAppliedDiscount(40);
      setShowCelebration(true);
      setTimeout(() => setShowCelebration(false), 2000);
    } else {
      setAppliedDiscount(50);
      setShowCelebration(true);
      setTimeout(() => setShowCelebration(false), 2000);
    }
  };

  // Place Direct Delivery Order
  const handlePlaceOrder = (e) => {
    e.preventDefault();
    if (cart.length === 0) return;
    playChime();
    setShowCelebration(true);
    setTimeout(() => setShowCelebration(false), 2500);

    const orderNum = Math.floor(80000 + Math.random() * 19000);
    const orderObj = {
      id: `DELIV-#${orderNum}`,
      placedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: 'confirmed',
      etaMins: 32,
      courier: {
        name: 'Rahul Sharma',
        vehicle: 'Ather 450X Electric Scooter (KA-03-EM-8821)',
        rating: '4.98',
        deliveries: 1840,
        phone: '+91 98450 11223'
      },
      items: cart.map((i) => `${i.qty}x ${i.name}`).join(', '),
      total: finalTotal,
      addressSummary: `${address.flatNo}, ${address.area}`
    };

    setActiveOrder(orderObj);
    setIsCartOpen(false);
    setIsLiveTrackingOpen(true);

    // Simulate cooking advancement after 4.5 seconds
    setTimeout(() => {
      setActiveOrder((prev) => ({ ...prev, status: 'cooking', etaMins: 24 }));
    }, 4500);
  };

  // Fast forward simulation controls for demo
  const handleFastForward = (nextStatus, mins) => {
    playChime();
    setActiveOrder((prev) => ({
      ...prev,
      status: nextStatus,
      etaMins: mins
    }));
  };

  // Filtered menu
  const filteredMenu = activeCategory === 'all'
    ? DELIVERY_MENU
    : DELIVERY_MENU.filter((i) => i.category === activeCategory);

  return (
    <div className={`min-h-screen font-sans selection:bg-[#C26D38] selection:text-white overflow-x-hidden relative transition-colors duration-300 ${
      isLight ? 'bg-[#FBF9F6] text-[#1C1612]' : 'bg-[#0F0D0B] text-[#FAF7F2]'
    }`}>
      
      {/* Celebration Burst Overlay */}
      {showCelebration && <LottieCelebrationBurst />}

      {/* Floating flying "+1" badge micro-animation */}
      <AnimatePresence>
        {flyingParticles.map((p) => (
          <motion.div
            key={p.id}
            initial={{ opacity: 1, scale: 0.8, y: 0, x: 0 }}
            animate={{ opacity: 0, scale: 1.4, y: -60, x: 20 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.9, ease: "easeOut" }}
            className="fixed top-1/2 right-12 z-50 pointer-events-none px-3 py-1 rounded-full bg-[#C26D38] text-white font-mono text-xs font-bold shadow-2xl"
          >
            {p.label}
          </motion.div>
        ))}
      </AnimatePresence>

      {/* --------------------------------------------------------------------- */}
      {/* TOP HEADER & OPERATIONAL VIEW SWITCHER                                */}
      {/* --------------------------------------------------------------------- */}
      <header className={`sticky top-0 inset-x-0 z-40 backdrop-blur-xl border-b py-3 px-4 sm:px-8 transition-colors duration-300 ${
        isLight ? 'bg-[#FFFFFF]/90 border-[#E8DFC9] shadow-xs' : 'bg-[#0F0D0B]/95 border-[#28201A]'
      }`}>
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-3 sm:gap-4">
          
          {/* Left Brand Identifier */}
          <div className="flex items-center gap-2.5 sm:gap-3">
            <button
              onClick={() => {
                sounds.playClick();
                if (onBackToVariants) onBackToVariants();
                else if (onBackToCatalogue) onBackToCatalogue();
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-mono font-medium transition cursor-pointer border ${
                isLight 
                  ? 'bg-[#F5EFE6] hover:bg-[#EAE0D2] text-[#3D3128] border-[#DFD3C3]' 
                  : 'bg-white/[0.04] hover:bg-[#C26D38] text-stone-300 hover:text-white border-white/10 hover:border-[#C26D38]'
              }`}
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Back to Models</span>
            </button>

            <span className={isLight ? "hidden sm:inline text-black/20" : "hidden sm:inline text-white/20"}>•</span>

            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#C26D38] shadow-[0_0_8px_#C26D38] animate-pulse"></span>
              <span className={`font-mono text-xs font-bold tracking-[0.18em] uppercase ${
                isLight ? 'text-[#1C1612]' : 'text-[#FAF7F2]'
              }`}>
                VELOUR <span className="text-[#C26D38]">//</span> DIRECT DELIVERY
              </span>
            </div>
          </div>

          {/* Center 3-in-1 View Switcher */}
          <div className={`hidden md:flex items-center gap-1 p-1 rounded-full border transition-colors ${
            isLight ? 'bg-[#F3ECE1] border-[#E2D6C5]' : 'bg-[#181310] border-[#2B211A]'
          }`}>
            {[
              { id: 'storefront', label: 'Online Storefront', icon: ShoppingBag },
              { id: 'kitchen-kds', label: 'Kitchen KDS Dispatch', icon: Utensils },
              { id: 'courier-rider', label: 'Courier Rider Terminal', icon: Bike }
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeMode === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    sounds.playClick();
                    setActiveMode(tab.id);
                  }}
                  className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-mono transition cursor-pointer relative ${
                    isActive
                      ? 'bg-[#C26D38] text-white font-bold shadow-md'
                      : isLight ? 'text-[#6B5A4E] hover:text-[#1C1612]' : 'text-stone-400 hover:text-white'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Right: Address Trigger, Ambience Toggle & Bag */}
          <div className="flex items-center gap-2 sm:gap-2.5">
            {/* Address Pill Trigger */}
            <button
              onClick={() => {
                sounds.playClick();
                setIsAddressModalOpen(true);
              }}
              className={`hidden lg:flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-mono border transition cursor-pointer ${
                isLight 
                  ? 'bg-[#F5EFE6] hover:bg-[#EAE0D2] text-[#1C1612] border-[#DFD3C3]' 
                  : 'bg-[#1A1512] hover:bg-[#261E19] text-stone-300 border-[#33271F] hover:border-[#C26D38]/50'
              }`}
            >
              <MapPin className="w-3.5 h-3.5 text-[#C26D38]" />
              <span className="truncate max-w-[150px]">{address.flatNo}, {address.area}</span>
              <span className="text-[10px] text-[#C26D38] font-bold">({address.estimatedMins}m)</span>
            </button>

            {/* Active Order Live Tracker Badge */}
            {activeOrder && (
              <button
                onClick={() => {
                  sounds.playClick();
                  setIsLiveTrackingOpen(true);
                }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-mono font-bold tracking-wider uppercase transition cursor-pointer shadow-xs ${
                  isLight 
                    ? 'bg-[#C26D38]/10 border-[#C26D38]/30 text-[#C26D38] hover:bg-[#C26D38]/20' 
                    : 'bg-[#C26D38]/15 border-[#C26D38]/50 text-[#FAF7F2] hover:bg-[#C26D38]/25'
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-[#C26D38] animate-ping" />
                <Bike className="w-3.5 h-3.5 text-[#C26D38]" />
                <span className="hidden sm:inline">{activeOrder.id}</span>
                <span className="text-[10px] text-[#B35E2A]">({activeOrder.etaMins}m)</span>
              </button>
            )}

            {/* Light / Dark Mode Ambience Switcher */}
            <button
              onClick={() => {
                sounds.playClick();
                setAmbience(isLight ? 'dark' : 'light');
              }}
              className={`p-2 rounded-full border transition cursor-pointer ${
                isLight 
                  ? 'bg-[#F5EFE6] hover:bg-[#EAE0D2] border-[#DFD3C3] text-[#C26D38]' 
                  : 'bg-white/5 hover:bg-white/10 border-white/10 text-[#DFBA84]'
              }`}
              title={isLight ? "Switch to Midnight Dark Mode" : "Switch to Sunlit Light Mode"}
            >
              {isLight ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
            </button>

            {/* Basket Bag Trigger with Spring Bounce */}
            {activeMode === 'storefront' && (
              <motion.button
                animate={cartBadgeBumping ? { scale: [1, 1.25, 0.9, 1.1, 1] } : {}}
                transition={{ duration: 0.45 }}
                onClick={() => {
                  sounds.playClick();
                  setIsCartOpen(true);
                }}
                className="flex items-center gap-2 px-3.5 sm:px-4 py-1.5 rounded-full bg-gradient-to-r from-[#C26D38] to-[#D47E48] hover:brightness-110 text-white font-mono text-xs font-bold tracking-wide uppercase transition cursor-pointer shadow-md"
              >
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>Bag ({cart.reduce((s, i) => s + i.qty, 0)})</span>
                <span className="hidden xs:inline">• ₹{finalTotal}</span>
              </motion.button>
            )}
          </div>

        </div>
      </header>

      {/* --------------------------------------------------------------------- */}
      {/* 0% AGGREGATOR COMMISSION BANNER & LIVE ROI SAVINGS TICKER             */}
      {/* --------------------------------------------------------------------- */}
      <div className={`py-2.5 px-4 border-b text-xs font-mono transition-colors duration-300 ${
        isLight 
          ? 'bg-[#F5EFE6] border-[#E8DFC9] text-[#4A3D32]' 
          : 'bg-gradient-to-r from-[#1C1612] via-[#241A14] to-[#1C1612] border-[#33251D] text-stone-300'
      }`}>
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className={`px-2.5 py-0.5 rounded-full border font-bold text-[10px] tracking-wider uppercase flex items-center gap-1 ${
              isLight 
                ? 'bg-[#C26D38]/15 border-[#C26D38]/30 text-[#C26D38]' 
                : 'bg-[#C26D38]/20 border-[#C26D38]/50 text-[#DFBA84]'
            }`}>
              <Sparkles className="w-3 h-3" />
              0% COMMISSION DIRECT
            </span>
            <span>Direct Kitchen to Doorstep • Zero 30% Swiggy / Zomato Markups</span>
          </div>

          <div className="flex items-center gap-4 text-[11px]">
            <span>
              Customer Savings: <strong className={isLight ? "text-[#B35E2A]" : "text-[#DFBA84]"}>₹{aggregatorComparisonSavings}</strong> on this basket
            </span>
            <span className={isLight ? "hidden sm:inline text-black/20" : "hidden sm:inline text-stone-500"}>•</span>
            <span className={isLight ? "hidden sm:inline text-[#6B5A4E]" : "hidden sm:inline text-stone-400"}>
              Kitchen Radius: <strong>8.5 km Express Zone</strong>
            </span>
          </div>
        </div>
      </div>

      {/* --------------------------------------------------------------------- */}
      {/* VIEW 1: CUSTOMER ONLINE STOREFRONT                                    */}
      {/* --------------------------------------------------------------------- */}
      {activeMode === 'storefront' && (
        <main className="max-w-7xl mx-auto px-4 sm:px-8 py-8 space-y-10">
          
          {/* Hero Showcase: Cloud Kitchen & Direct Doorstep Delivery */}
          <section className={`relative rounded-[32px] overflow-hidden border p-6 sm:p-10 transition-colors duration-300 ${
            isLight 
              ? 'bg-white border-[#E8DFC9] shadow-[0_20px_50px_rgba(40,25,15,0.06)]' 
              : 'bg-gradient-to-b from-[#181310] to-[#120F0D] border-[#2D231C] shadow-2xl'
          }`}>
            
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              
              <div className="lg:col-span-7 space-y-5 text-left">
                <div className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border text-xs font-mono ${
                  isLight ? 'bg-[#F6EFE6] border-[#E5DACB] text-[#B35E2A]' : 'bg-white/[0.04] border-white/10 text-[#DFBA84]'
                }`}>
                  <LottieKitchenSteamFlame size={20} />
                  <span>WOOD-FIRED SOURDOUGH &amp; TAMPER-SEALED COLD BREWS</span>
                </div>

                <h1 className={`font-serif text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.1] ${
                  isLight ? 'text-[#16120F]' : 'text-[#FAF7F2]'
                }`}>
                  Doorstep dining without <br />
                  <span className="italic font-normal text-transparent bg-clip-text bg-gradient-to-r from-[#C26D38] via-[#B35E2A] to-[#8C4A1F]">
                    aggregator markups
                  </span>.
                </h1>

                <p className={`text-sm sm:text-base font-sans leading-relaxed max-w-xl ${
                  isLight ? 'text-[#665547]' : 'text-stone-400'
                }`}>
                  Order direct from our artisanal cloud kitchen. Sealed in micro-vented thermal packaging, dispatched via dedicated electric couriers, and tracked live to your exact flat number.
                </p>

                {/* Free Delivery Target Indicator with Lottie Fluid Meter */}
                <div className="max-w-lg">
                  <LottieFreeDeliveryMeter subtotal={subtotal} threshold={freeDeliveryThreshold} isLight={isLight} />
                </div>

                {/* Address Bar Action & Tamper Seal Badge */}
                <div className="flex flex-wrap items-center gap-3 pt-1">
                  <button
                    onClick={() => {
                      sounds.playClick();
                      setIsAddressModalOpen(true);
                    }}
                    className={`px-5 py-3 rounded-full text-xs font-mono flex items-center gap-2 transition cursor-pointer border shadow-xs ${
                      isLight 
                        ? 'bg-[#F5EFE6] hover:bg-[#EAE0D2] text-[#1C1612] border-[#DFD3C3]' 
                        : 'bg-[#241A14] hover:bg-[#2E211A] text-white border-[#3D2D22]'
                    }`}
                  >
                    <MapPin className="w-4 h-4 text-[#C26D38]" />
                    <span>Change Address: {address.preset} ({address.area})</span>
                  </button>

                  <LottieTamperSeal label="THERMAL SEALED" isLight={isLight} />

                  <div className={`flex items-center gap-2 text-xs font-mono ${
                    isLight ? 'text-[#6B5A4E]' : 'text-stone-400'
                  }`}>
                    <Clock className="w-3.5 h-3.5 text-[#C26D38]" />
                    <span>Est. Doorstep ETA: <strong className={isLight ? "text-[#1C1612]" : "text-white"}>{address.estimatedMins} mins</strong></span>
                  </div>
                </div>
              </div>

              {/* Right Hero Card with Animated Scooter Badge & Image */}
              <div className="lg:col-span-5 relative">
                <div className={`relative rounded-3xl overflow-hidden border shadow-xl group ${
                  isLight ? 'border-[#E8DFC9]' : 'border-[#33271F]'
                }`}>
                  <img
                    src="https://images.unsplash.com/photo-1604382355076-af4b0eb60143?auto=format&fit=crop&w=800&q=80"
                    alt="Artisan Sourdough Pizza Delivery"
                    className="w-full h-[320px] object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>

                  {/* Lottie Courier Badge floating in top right */}
                  <div className="absolute top-4 right-4 z-20">
                    <div className={`p-2.5 rounded-2xl backdrop-blur-md border shadow-lg ${
                      isLight ? 'bg-white/95 border-[#E8DFC9]' : 'bg-black/80 border-white/20'
                    }`}>
                      <LottieDeliveryRider className="w-24 h-14" isMoving={true} badgeText="DIRECT COURIER" isLight={isLight} />
                    </div>
                  </div>

                  <div className="absolute top-4 left-4 z-20">
                    <span className="px-3 py-1 rounded-full bg-white/90 backdrop-blur-md border border-black/10 text-[10px] font-mono text-[#1C1612] font-semibold uppercase shadow-xs">
                      VENTILATED THERMAL BOX
                    </span>
                  </div>

                  <div className={`absolute bottom-4 inset-x-4 p-4 rounded-2xl backdrop-blur-xl border shadow-md ${
                    isLight ? 'bg-white/95 border-[#E8DFC9] text-[#1C1612]' : 'bg-black/80 border-white/15 text-white'
                  }`}>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-serif font-bold text-base">48h Fermented Margherita Rustica</p>
                        <p className={`text-[11px] mt-0.5 ${isLight ? 'text-[#665547]' : 'text-stone-300'}`}>Delivered piping hot with blistered crust intact</p>
                      </div>
                      <span className="font-mono font-bold text-[#C26D38] text-base">₹495</span>
                    </div>
                  </div>
                </div>
              </div>

            </div>

          </section>

          {/* Category Filter Pills */}
          <div className={`flex flex-wrap items-center justify-between gap-4 pt-2 border-b pb-4 ${
            isLight ? 'border-[#E8DFC9]' : 'border-[#241C16]'
          }`}>
            <div className="flex flex-wrap items-center gap-2">
              {[
                { id: 'all', label: 'All Items' },
                { id: 'pizzas', label: 'Sourdough Pizzas' },
                { id: 'melts', label: 'Paninis & Melts' },
                { id: 'pastas', label: 'Pastas & Bowls' },
                { id: 'brews', label: 'Sealed Brews' },
                { id: 'desserts', label: 'Desserts & Jars' }
              ].map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => {
                    sounds.playClick();
                    setActiveCategory(cat.id);
                  }}
                  className={`px-4 py-2 rounded-full text-xs font-mono transition cursor-pointer border ${
                    activeCategory === cat.id
                      ? 'bg-[#C26D38] text-white border-[#C26D38] font-bold shadow-md'
                      : isLight 
                        ? 'bg-white hover:bg-[#F6EFE6] text-[#5C4C40] hover:text-[#1C1612] border-[#E8DFC9] shadow-2xs' 
                        : 'bg-[#181310] hover:bg-[#221A15] text-stone-400 hover:text-white border-[#2E231A]'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            <span className={`text-xs font-mono ${isLight ? 'text-[#8C7B6E]' : 'text-stone-500'}`}>
              Showing {filteredMenu.length} delivery items
            </span>
          </div>

          {/* Menu Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredMenu.map((item) => (
              <motion.div
                key={item.id}
                whileHover={{ y: -4 }}
                transition={{ duration: 0.25 }}
                className={`group rounded-3xl overflow-hidden border transition-all duration-300 flex flex-col justify-between ${
                  isLight 
                    ? 'bg-white border-[#E8DFC9] shadow-[0_8px_25px_rgba(40,25,15,0.05)] hover:border-[#C26D38]/60 hover:shadow-[0_16px_35px_rgba(194,109,56,0.12)]' 
                    : 'bg-[#16120F] border-[#2A2018] hover:border-[#C26D38]/60 shadow-lg'
                }`}
              >
                <div className="relative aspect-[16/10] overflow-hidden bg-black/10">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>

                  <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                    {item.popular && (
                      <span className="px-2.5 py-1 rounded-full bg-[#C26D38] text-white text-[10px] font-mono font-bold uppercase tracking-wider shadow-md">
                        KITCHEN BESTSELLER
                      </span>
                    )}
                    <span className="ml-auto px-2.5 py-1 rounded-full bg-white/90 backdrop-blur-md border border-black/10 text-[10px] font-mono text-[#1C1612] font-semibold shadow-xs">
                      {item.prepTime}
                    </span>
                  </div>
                </div>

                <div className="p-6 space-y-3 flex-grow flex flex-col justify-between">
                  <div className="space-y-1">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className={`font-serif text-lg font-bold leading-snug group-hover:text-[#C26D38] transition-colors ${
                        isLight ? 'text-[#16120F]' : 'text-[#FAF7F2]'
                      }`}>
                        {item.name}
                      </h3>
                      <span className="font-mono text-sm font-bold text-[#C26D38] shrink-0">
                        ₹{item.price}
                      </span>
                    </div>
                    <p className={`text-xs font-sans line-clamp-2 ${
                      isLight ? 'text-[#665547]' : 'text-stone-400'
                    }`}>
                      {item.description}
                    </p>
                  </div>

                  <div className={`pt-3 border-t flex items-center justify-between gap-2 ${
                    isLight ? 'border-[#F0E8DD]' : 'border-[#261D16]'
                  }`}>
                    <span className={`text-[11px] font-mono truncate ${
                      isLight ? 'text-[#8C7B6E]' : 'text-stone-500'
                    }`}>
                      Thermal Pack
                    </span>

                    <div className="flex items-center gap-1.5">
                      {/* Quick Add Button */}
                      <button
                        onClick={() => handleQuickAdd(item)}
                        className={`p-2 rounded-xl transition cursor-pointer border ${
                          isLight 
                            ? 'bg-[#FAF6F0] hover:bg-[#F0E6D8] text-[#3D3128] border-[#E5DACB]' 
                            : 'bg-[#201813] hover:bg-[#C26D38]/30 text-stone-300 border-[#33261D]'
                        }`}
                        title="Quick Add 1"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>

                      {/* Customize and Add */}
                      <button
                        onClick={() => {
                          sounds.playClick();
                          setCustomizingItem(item);
                          setSelectedCrust('Classic Sourdough');
                          setSelectedAddons(['Truffle Olive Drizzle (+₹60)']);
                        }}
                        className={`px-3.5 py-2 rounded-xl font-mono text-xs font-bold transition flex items-center gap-1.5 cursor-pointer border shadow-xs active:scale-95 ${
                          isLight 
                            ? 'bg-[#F5EFE6] hover:bg-[#C26D38] text-[#2E241E] hover:text-white border-[#DFD3C3] hover:border-[#C26D38]' 
                            : 'bg-[#251B15] hover:bg-[#C26D38] text-white border-[#38281E] hover:border-[#C26D38]'
                        }`}
                      >
                        <span>Customize</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>

              </motion.div>
            ))}
          </div>

        </main>
      )}

      {/* --------------------------------------------------------------------- */}
      {/* VIEW 2: KITCHEN KDS DISPATCH TERMINAL                                 */}
      {/* --------------------------------------------------------------------- */}
      {activeMode === 'kitchen-kds' && (
        <main className="max-w-7xl mx-auto px-4 sm:px-8 py-8 space-y-6">
          <div className={`flex items-center justify-between border-b pb-4 ${
            isLight ? 'border-[#E8DFC9]' : 'border-[#28201A]'
          }`}>
            <div>
              <span className="font-mono text-xs text-[#C26D38] uppercase tracking-widest font-semibold flex items-center gap-1.5">
                <LottieKitchenSteamFlame size={18} />
                KITCHEN DISPLAY SYSTEM // KDS EXPEDITE
              </span>
              <h2 className="font-serif text-2xl font-bold">Live Cloud Kitchen Dispatch Terminal</h2>
            </div>

            <div className="flex items-center gap-3 font-mono text-xs">
              <span className={`px-3 py-1.5 rounded-full border ${
                isLight ? 'bg-white border-[#E8DFC9] text-[#3D3128]' : 'bg-[#1A1512] border-[#2D221A] text-stone-300'
              }`}>
                Oven Hearth: <strong>3 Active</strong>
              </span>
              <span className="px-3 py-1.5 rounded-full bg-[#C26D38]/15 border border-[#C26D38]/30 text-[#B35E2A] font-bold">
                Avg Prep Velocity: <strong>14.2 mins</strong>
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Active Ticket 1 */}
            <div className={`p-6 rounded-3xl border space-y-4 shadow-xl relative overflow-hidden ${
              isLight ? 'bg-white border-[#C26D38]' : 'bg-[#16120F] border-[#C26D38]'
            }`}>
              <div className="flex items-center justify-between pb-3 border-b border-[#E8DFC9]">
                <div>
                  <span className="font-mono text-lg font-bold text-[#C26D38]">{activeOrder.id}</span>
                  <p className={`text-[11px] font-mono ${isLight ? 'text-[#8C7B6E]' : 'text-stone-400'}`}>Placed at {activeOrder.placedAt}</p>
                </div>
                <span className="px-2.5 py-1 rounded-full bg-[#C26D38]/15 text-[#B35E2A] text-[10px] font-mono font-bold uppercase">
                  STATUS: {activeOrder.status}
                </span>
              </div>

              <div className="space-y-2 text-xs font-mono">
                <p><strong>Customer:</strong> {address.recipientName} ({address.recipientPhone})</p>
                <p><strong>Dropoff:</strong> {address.flatNo}, {address.area}</p>
                <p className={isLight ? "text-[#8C7B6E]" : "text-stone-400"}><strong>Rider Notes:</strong> {address.riderNotes}</p>
              </div>

              <div className={`p-3 rounded-2xl border space-y-2 text-xs ${
                isLight ? 'bg-[#FAF6F0] border-[#E8DFC9]' : 'bg-[#201813] border-[#33261D]'
              }`}>
                <span className={`font-mono text-[10px] uppercase ${isLight ? 'text-[#8C7B6E]' : 'text-stone-400'}`}>PREPARATION CHECKLIST:</span>
                <p className="font-bold">• 1x 48h Fermented Margherita Rustica (Extra Truffle Oil)</p>
                <p className="font-bold">• 1x Reserve Ethiopian Cold Drip (500ml Glass Bottle Sealed)</p>
                <p className={`text-[11px] ${isLight ? 'text-[#8C7B6E]' : 'text-stone-400'}`}>• Packed with insulated thermal liner &amp; tamper tape</p>
              </div>

              <div className="pt-2 flex flex-col gap-2">
                <button
                  onClick={() => handleFastForward('in-transit', 12)}
                  className="w-full py-3 rounded-xl bg-[#C26D38] hover:bg-[#B35E2A] text-white font-mono text-xs font-bold uppercase tracking-wider transition cursor-pointer shadow-md flex items-center justify-center gap-2"
                >
                  <Bike className="w-4 h-4" />
                  <span>Mark Packed &amp; Dispatch Courier</span>
                </button>
              </div>
            </div>

            {/* In-Oven Prep Ticket 2 */}
            <div className={`p-6 rounded-3xl border space-y-4 ${
              isLight ? 'bg-white border-[#E8DFC9] shadow-sm' : 'bg-[#16120F] border-[#2A2018]'
            }`}>
              <div className={`flex items-center justify-between pb-3 border-b ${
                isLight ? 'border-[#E8DFC9]' : 'border-[#2A2018]'
              }`}>
                <div>
                  <span className="font-mono text-lg font-bold">DELIV-#84918</span>
                  <p className={`text-[11px] font-mono ${isLight ? 'text-[#8C7B6E]' : 'text-stone-400'}`}>Placed 12m ago</p>
                </div>
                <span className={`px-2.5 py-1 rounded-full text-[10px] font-mono font-bold uppercase ${
                  isLight ? 'bg-[#F5EFE6] text-[#3D3128]' : 'bg-white/10 text-stone-300'
                }`}>
                  OVEN HEARTH
                </span>
              </div>
              <div className="space-y-1 text-xs">
                <p className="font-bold">• 1x Wild Chanterelle &amp; White Truffle Pizza</p>
                <p className="font-bold">• 1x Tiramisu Classico (Glass Jar)</p>
              </div>
              <p className={`text-xs ${isLight ? 'text-[#8C7B6E]' : 'text-stone-400'}`}>Courier Assigned: Vikrant M. (Arrived at kitchen pickup bay)</p>
              <button
                onClick={() => playChime()}
                className={`w-full py-2.5 rounded-xl font-mono text-xs font-medium cursor-pointer transition border ${
                  isLight ? 'bg-[#FAF6F0] hover:bg-[#F0E6D8] border-[#E8DFC9] text-[#3D3128]' : 'bg-white/10 hover:bg-white/15 text-stone-200'
                }`}
              >
                Promote to Packing Station
              </button>
            </div>

            {/* Completed Ticket 3 */}
            <div className={`p-6 rounded-3xl border space-y-4 opacity-80 ${
              isLight ? 'bg-white border-[#E8DFC9] shadow-sm' : 'bg-[#16120F] border-[#2A2018]'
            }`}>
              <div className={`flex items-center justify-between pb-3 border-b ${
                isLight ? 'border-[#E8DFC9]' : 'border-[#2A2018]'
              }`}>
                <div>
                  <span className="font-mono text-lg font-bold text-[#8C7B6E]">DELIV-#84915</span>
                  <p className="text-[11px] font-mono text-[#8C7B6E]">Delivered 18m ago</p>
                </div>
                <span className="px-2.5 py-1 rounded-full bg-[#16A34A]/15 text-[#16A34A] text-[10px] font-mono font-bold uppercase">
                  COMPLETED
                </span>
              </div>
              <p className="text-xs text-[#8C7B6E] font-mono">Delivered to Koramangala 4th Block • ₹820 COD Settled</p>
            </div>
          </div>
        </main>
      )}

      {/* --------------------------------------------------------------------- */}
      {/* VIEW 3: COURIER RIDER TERMINAL SIMULATION                             */}
      {/* --------------------------------------------------------------------- */}
      {activeMode === 'courier-rider' && (
        <main className="max-w-4xl mx-auto px-4 sm:px-8 py-8 space-y-6">
          <div className={`flex items-center justify-between border-b pb-4 ${
            isLight ? 'border-[#E8DFC9]' : 'border-[#28201A]'
          }`}>
            <div>
              <span className="font-mono text-xs text-[#C26D38] uppercase tracking-widest font-semibold flex items-center gap-1.5">
                <Bike className="w-3.5 h-3.5" />
                COURIER APP // RIDER MOBILE SIMULATION
              </span>
              <h2 className="font-serif text-2xl font-bold">Rider Dispatch &amp; Doorstep Dropoff</h2>
            </div>
            <span className="px-3 py-1 rounded-full bg-[#16A34A]/15 text-[#16A34A] border border-[#16A34A]/30 font-mono text-xs font-bold flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#16A34A] animate-ping" />
              GPS Active
            </span>
          </div>

          <div className={`p-6 sm:p-8 rounded-3xl border space-y-6 shadow-xl ${
            isLight ? 'bg-white border-[#E8DFC9]' : 'bg-[#16120F] border-[#33271F]'
          }`}>
            {/* Courier Bio Header */}
            <div className={`flex items-center justify-between p-4 rounded-2xl border ${
              isLight ? 'bg-[#FAF6F0] border-[#E8DFC9]' : 'bg-[#1D1713] border-[#2E231B]'
            }`}>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-[#C26D38] text-white flex items-center justify-center font-bold text-base shadow-md">
                  RS
                </div>
                <div>
                  <h4 className="font-serif font-bold text-base">{activeOrder.courier.name}</h4>
                  <p className={`text-xs font-mono ${isLight ? 'text-[#8C7B6E]' : 'text-stone-400'}`}>{activeOrder.courier.vehicle}</p>
                </div>
              </div>
              <div className="text-right font-mono text-xs">
                <span className="text-[#C26D38] font-bold flex items-center justify-end gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-[#C26D38]" />
                  {activeOrder.courier.rating}
                </span>
                <p className={isLight ? "text-[#8C7B6E]" : "text-stone-400"}>{activeOrder.courier.deliveries} trips</p>
              </div>
            </div>

            {/* Courier Rider Lottie Vector Graphic */}
            <div className={`p-6 rounded-2xl border flex items-center justify-center ${
              isLight ? 'bg-[#FAF6F0] border-[#E8DFC9]' : 'bg-[#14100D] border-[#2A2018]'
            }`}>
              <LottieDeliveryRider className="w-48 h-28" isMoving={true} badgeText="SCOOTER IN TRANSIT" isLight={isLight} />
            </div>

            {/* Current Active Delivery Job */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-mono text-[#C26D38] uppercase font-bold">CURRENT TRIP ASSIGNMENT</span>
                  <h3 className="font-mono text-xl font-bold mt-0.5">{activeOrder.id}</h3>
                </div>
                <span className="px-3 py-1 rounded-full bg-[#C26D38] text-white font-mono text-xs font-bold">
                  ETA ~{activeOrder.etaMins} Mins
                </span>
              </div>

              <div className={`p-4 rounded-2xl border space-y-3 font-mono text-xs ${
                isLight ? 'bg-[#FAF6F0] border-[#E8DFC9]' : 'bg-[#201813] border-[#33261D]'
              }`}>
                <div className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 text-[#C26D38] shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold">{address.flatNo}, {address.building}</p>
                    <p className={isLight ? "text-[#8C7B6E]" : "text-stone-400"}>{address.area} (Landmark: {address.landmark})</p>
                  </div>
                </div>
                <div className="pt-2 border-t border-black/10 flex items-center justify-between">
                  <span className={isLight ? "text-[#8C7B6E]" : "text-stone-400"}>Rider Instructions:</span>
                  <span className="text-[#B35E2A] font-bold">{address.riderNotes}</span>
                </div>
              </div>

              {/* Action Buttons for Rider */}
              <div className="grid grid-cols-2 gap-3 pt-2">
                <a
                  href={`tel:${address.recipientPhone}`}
                  className={`py-3 px-4 rounded-xl font-mono text-xs font-bold flex items-center justify-center gap-2 transition cursor-pointer border ${
                    isLight 
                      ? 'bg-[#FAF6F0] hover:bg-[#F0E6D8] border-[#E8DFC9] text-[#3D3128]' 
                      : 'bg-white/10 hover:bg-white/15 text-white border-white/10'
                  }`}
                >
                  <Phone className="w-4 h-4 text-[#C26D38]" />
                  <span>Call Customer</span>
                </a>

                <button
                  onClick={() => {
                    handleFastForward('delivered', 0);
                    sounds.playSuccess();
                  }}
                  className="py-3 px-4 rounded-xl bg-gradient-to-r from-[#C26D38] to-[#D47E48] text-white font-mono text-xs font-bold flex items-center justify-center gap-2 shadow-lg cursor-pointer hover:brightness-110 transition active:scale-95"
                >
                  <Check className="w-4 h-4" />
                  <span>Mark Handed Over &amp; Complete</span>
                </button>
              </div>
            </div>
          </div>
        </main>
      )}

      {/* --------------------------------------------------------------------- */}
      {/* ITEM CUSTOMIZER & FINISHING DRIZZLE MODAL                             */}
      {/* --------------------------------------------------------------------- */}
      <AnimatePresence>
        {customizingItem && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setCustomizingItem(null)}
              className="fixed inset-0 bg-black/60 backdrop-blur-md"
            ></motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className={`relative w-full max-w-lg rounded-[32px] border p-6 sm:p-8 z-10 space-y-6 shadow-2xl ${
                isLight ? 'bg-[#FAF8F5] border-[#E8DFC9] text-[#16120F]' : 'bg-[#16120F] border-[#33261D] text-white'
              }`}
            >
              {/* Top Modal Header */}
              <div className={`flex items-start justify-between pb-3 border-b ${
                isLight ? 'border-[#E8DFC9]' : 'border-[#281F18]'
              }`}>
                <div>
                  <span className="font-mono text-xs text-[#C26D38] uppercase tracking-wider font-bold">
                    DOORSTEP CUSTOMIZATION
                  </span>
                  <h3 className="font-serif text-2xl font-bold">{customizingItem.name}</h3>
                  <p className={`text-xs font-mono mt-0.5 ${isLight ? 'text-[#8C7B6E]' : 'text-stone-400'}`}>Base Price: ₹{customizingItem.price}</p>
                </div>
                <button
                  onClick={() => setCustomizingItem(null)}
                  className={`p-2 rounded-full transition cursor-pointer ${
                    isLight ? 'hover:bg-black/5 text-[#8C7B6E] hover:text-[#16120F]' : 'hover:bg-white/10 text-stone-400 hover:text-white'
                  }`}
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Crust / Base Selection */}
              <div className="space-y-2">
                <label className={`text-xs font-mono uppercase font-bold ${
                  isLight ? 'text-[#3D3128]' : 'text-stone-300'
                }`}>1. Sourdough Crust &amp; Base Style:</label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    'Classic Sourdough',
                    'High Hydration Thin Crust',
                    'Herb Garlic Charred Crust',
                    'Gluten-Friendly Base'
                  ].map((crust) => (
                    <button
                      key={crust}
                      onClick={() => {
                        sounds.playClick();
                        setSelectedCrust(crust);
                      }}
                      className={`p-3 rounded-xl text-left text-xs font-mono transition border cursor-pointer ${
                        selectedCrust === crust
                          ? 'bg-[#C26D38] text-white border-[#C26D38] font-bold shadow-sm'
                          : isLight
                            ? 'bg-white text-[#5C4C40] border-[#E5DACB] hover:bg-[#F6EFE6] hover:text-[#1C1612]'
                            : 'bg-[#1D1713] text-stone-400 border-[#2E2219] hover:text-white'
                      }`}
                    >
                      {crust}
                    </button>
                  ))}
                </div>
              </div>

              {/* Gourmet Addons & Finishing Drizzles */}
              <div className="space-y-2">
                <label className={`text-xs font-mono uppercase font-bold ${
                  isLight ? 'text-[#3D3128]' : 'text-stone-300'
                }`}>2. Gourmet Add-Ons (+₹60 each):</label>
                <div className="space-y-2">
                  {[
                    'Truffle Olive Drizzle (+₹60)',
                    'Extra Buffalo Mozzarella (+₹60)',
                    'Charred Garlic Confit Cloves (+₹60)',
                    'Spicy Hot Honey Dip Pot (+₹60)'
                  ].map((addon) => (
                    <button
                      key={addon}
                      onClick={() => toggleAddon(addon)}
                      className={`w-full p-3 rounded-xl text-left text-xs font-mono flex items-center justify-between transition border cursor-pointer ${
                        selectedAddons.includes(addon)
                          ? 'bg-[#C26D38]/15 border-[#C26D38] text-[#B35E2A] font-bold'
                          : isLight
                            ? 'bg-white border-[#E5DACB] text-[#5C4C40] hover:bg-[#F6EFE6] hover:text-[#1C1612]'
                            : 'bg-[#1D1713] border-[#2E2219] text-stone-400 hover:text-white'
                      }`}
                    >
                      <span>{addon}</span>
                      {selectedAddons.includes(addon) && <Check className="w-4 h-4 text-[#C26D38]" />}
                    </button>
                  ))}
                </div>
              </div>

              {/* Action Button */}
              <div className="pt-2">
                <button
                  onClick={handleAddToCart}
                  className="w-full py-4 rounded-2xl bg-gradient-to-r from-[#C26D38] to-[#D47E48] text-white font-mono text-xs font-bold uppercase tracking-wider hover:brightness-110 transition shadow-lg cursor-pointer flex items-center justify-center gap-2 active:scale-95"
                >
                  <span>Add to Delivery Bag • ₹{customizingItem.price + selectedAddons.length * 60}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* --------------------------------------------------------------------- */}
      {/* DELIVERY ADDRESS & ZONE DRAWER                                        */}
      {/* --------------------------------------------------------------------- */}
      <AnimatePresence>
        {isAddressModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsAddressModalOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-md"
            ></motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className={`relative w-full max-w-lg rounded-[32px] border p-6 sm:p-8 z-10 space-y-6 shadow-2xl ${
                isLight ? 'bg-[#FAF8F5] border-[#E8DFC9] text-[#16120F]' : 'bg-[#16120F] border-[#33261D] text-white'
              }`}
            >
              <div className={`flex items-center justify-between pb-3 border-b ${
                isLight ? 'border-[#E8DFC9]' : 'border-[#281F18]'
              }`}>
                <div>
                  <span className="font-mono text-xs text-[#C26D38] uppercase tracking-wider font-bold">
                    DOORSTEP ADDRESS CAPTURE
                  </span>
                  <h3 className="font-serif text-2xl font-bold">Delivery Coordinates</h3>
                </div>
                <button
                  onClick={() => setIsAddressModalOpen(false)}
                  className={`p-2 rounded-full transition cursor-pointer ${
                    isLight ? 'hover:bg-black/5 text-[#8C7B6E] hover:text-[#16120F]' : 'hover:bg-white/10 text-stone-400 hover:text-white'
                  }`}
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Preset selector */}
              <div className="space-y-1">
                <label className={`text-[11px] font-mono font-bold uppercase ${
                  isLight ? 'text-[#6B5A4E]' : 'text-stone-400'
                }`}>ADDRESS PRESET</label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'Home', icon: Home },
                    { id: 'Studio / Office', icon: Briefcase },
                    { id: 'Hotel / Event', icon: Building }
                  ].map((p) => {
                    const Icon = p.icon;
                    return (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => {
                          sounds.playClick();
                          setAddress((prev) => ({ ...prev, preset: p.id }));
                        }}
                        className={`p-2.5 rounded-xl text-xs font-mono flex items-center justify-center gap-1.5 transition border cursor-pointer ${
                          address.preset === p.id
                            ? 'bg-[#C26D38] text-white border-[#C26D38] font-bold shadow-xs'
                            : isLight
                              ? 'bg-white text-[#5C4C40] border-[#E5DACB] hover:text-[#1C1612]'
                              : 'bg-[#1E1713] text-stone-400 border-[#2D221A] hover:text-white'
                        }`}
                      >
                        <Icon className="w-3.5 h-3.5" />
                        <span className="truncate">{p.id}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="space-y-3 font-mono text-xs">
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className={isLight ? "text-[#6B5A4E]" : "text-stone-400"}>FLAT / SUITE NO.</label>
                    <input
                      type="text"
                      value={address.flatNo}
                      onChange={(e) => setAddress({ ...address, flatNo: e.target.value })}
                      className={`w-full px-3.5 py-2.5 rounded-xl font-sans border focus:outline-none focus:border-[#C26D38] shadow-2xs ${
                        isLight ? 'bg-white border-[#DFD3C3] text-[#16120F]' : 'bg-[#1D1713] border-[#33261D] text-white'
                      }`}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className={isLight ? "text-[#6B5A4E]" : "text-stone-400"}>BUILDING / COMPLEX</label>
                    <input
                      type="text"
                      value={address.building}
                      onChange={(e) => setAddress({ ...address, building: e.target.value })}
                      className={`w-full px-3.5 py-2.5 rounded-xl font-sans border focus:outline-none focus:border-[#C26D38] shadow-2xs ${
                        isLight ? 'bg-white border-[#DFD3C3] text-[#16120F]' : 'bg-[#1D1713] border-[#33261D] text-white'
                      }`}
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className={isLight ? "text-[#6B5A4E]" : "text-stone-400"}>STREET / AREA / SECTOR</label>
                  <input
                    type="text"
                    value={address.area}
                    onChange={(e) => setAddress({ ...address, area: e.target.value })}
                    className={`w-full px-3.5 py-2.5 rounded-xl font-sans border focus:outline-none focus:border-[#C26D38] shadow-2xs ${
                      isLight ? 'bg-white border-[#DFD3C3] text-[#16120F]' : 'bg-[#1D1713] border-[#33261D] text-white'
                    }`}
                  />
                </div>

                <div className="space-y-1">
                  <label className={isLight ? "text-[#6B5A4E]" : "text-stone-400"}>LANDMARK</label>
                  <input
                    type="text"
                    value={address.landmark}
                    onChange={(e) => setAddress({ ...address, landmark: e.target.value })}
                    className={`w-full px-3.5 py-2.5 rounded-xl font-sans border focus:outline-none focus:border-[#C26D38] shadow-2xs ${
                      isLight ? 'bg-white border-[#DFD3C3] text-[#16120F]' : 'bg-[#1D1713] border-[#33261D] text-white'
                    }`}
                  />
                </div>

                <div className="space-y-1">
                  <label className={isLight ? "text-[#6B5A4E]" : "text-stone-400"}>INSTRUCTIONS FOR RIDER</label>
                  <input
                    type="text"
                    value={address.riderNotes}
                    onChange={(e) => setAddress({ ...address, riderNotes: e.target.value })}
                    className={`w-full px-3.5 py-2.5 rounded-xl font-sans border focus:outline-none focus:border-[#C26D38] shadow-2xs ${
                      isLight ? 'bg-white border-[#DFD3C3] text-[#16120F]' : 'bg-[#1D1713] border-[#33261D] text-white'
                    }`}
                  />
                </div>
              </div>

              <div className={`p-3.5 rounded-2xl border flex items-center justify-between text-xs font-mono ${
                isLight ? 'bg-[#F5EFE6] border-[#E5DACB] text-[#5C4C40]' : 'bg-[#201813] border-[#33261D] text-stone-400'
              }`}>
                <span>Calculated Radius from Kitchen:</span>
                <span className="text-[#B35E2A] font-bold">{address.distanceKm} km ({address.estimatedMins} mins)</span>
              </div>

              <button
                onClick={() => {
                  sounds.playSuccess();
                  setIsAddressModalOpen(false);
                }}
                className="w-full py-3.5 rounded-2xl bg-[#C26D38] hover:bg-[#B35E2A] text-white font-mono text-xs font-bold uppercase tracking-wider transition cursor-pointer shadow-md"
              >
                Save Delivery Address
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* --------------------------------------------------------------------- */}
      {/* SHOPPING BASKET DRAWER & DYNAMIC FEE ENGINE                           */}
      {/* --------------------------------------------------------------------- */}
      <AnimatePresence>
        {isCartOpen && (
          <div className="fixed inset-0 z-50 flex justify-end">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsCartOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            ></motion.div>

            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className={`relative w-full max-w-md h-full border-l z-10 flex flex-col justify-between shadow-2xl p-6 overflow-y-auto ${
                isLight ? 'bg-[#FAF8F5] border-[#E8DFC9] text-[#16120F]' : 'bg-[#16120F] border-[#33261D] text-white'
              }`}
            >
              {/* Drawer Top Header */}
              <div className="space-y-4">
                <div className={`flex items-center justify-between pb-3 border-b ${
                  isLight ? 'border-[#E8DFC9]' : 'border-[#281F18]'
                }`}>
                  <div className="flex items-center gap-2">
                    <ShoppingBag className="w-5 h-5 text-[#C26D38]" />
                    <h3 className="font-serif text-xl font-bold">Your Delivery Bag</h3>
                  </div>
                  <button
                    onClick={() => setIsCartOpen(false)}
                    className={`p-2 rounded-full transition cursor-pointer ${
                      isLight ? 'hover:bg-black/5 text-[#8C7B6E] hover:text-[#16120F]' : 'hover:bg-white/10 text-stone-400 hover:text-white'
                    }`}
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Free Delivery Meter inside Bag */}
                <LottieFreeDeliveryMeter subtotal={subtotal} threshold={freeDeliveryThreshold} isLight={isLight} />

                {/* Address Summary chip */}
                <div className={`p-3 rounded-2xl border flex items-center justify-between text-xs font-mono ${
                  isLight ? 'bg-white border-[#E8DFC9]' : 'bg-[#1D1713] border-[#2E2219]'
                }`}>
                  <div className="flex items-center gap-2 truncate">
                    <MapPin className="w-3.5 h-3.5 text-[#C26D38] shrink-0" />
                    <span className="truncate">{address.flatNo}, {address.area}</span>
                  </div>
                  <button
                    onClick={() => setIsAddressModalOpen(true)}
                    className="text-[#C26D38] hover:underline shrink-0 font-bold ml-2 cursor-pointer"
                  >
                    Edit
                  </button>
                </div>

                {/* Cart Items List */}
                <div className="space-y-3 max-h-[38vh] overflow-y-auto pr-1">
                  {cart.length === 0 ? (
                    <div className="py-12 text-center text-[#8C7B6E] font-mono text-xs">
                      Your bag is empty. Add artisanal items from the menu!
                    </div>
                  ) : (
                    cart.map((item, idx) => (
                      <div
                        key={item.id}
                        className={`p-3.5 rounded-2xl border space-y-2 shadow-2xs ${
                          isLight ? 'bg-white border-[#E8DFC9]' : 'bg-[#1E1713] border-[#2D221A]'
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          <div>
                            <h4 className="font-serif text-sm font-bold leading-snug">{item.name}</h4>
                            <p className="text-[11px] font-mono text-[#C26D38] mt-0.5">{item.crust}</p>
                          </div>
                          <span className="font-mono text-xs font-bold text-[#C26D38]">
                            ₹{item.itemTotal * item.qty}
                          </span>
                        </div>

                        {item.addons && item.addons.length > 0 && (
                          <p className={`text-[10px] font-mono ${isLight ? 'text-[#8C7B6E]' : 'text-stone-400'}`}>
                            + {item.addons.join(', ')}
                          </p>
                        )}

                        <div className="flex items-center justify-between pt-1">
                          <div className={`flex items-center gap-2 rounded-lg p-1 border ${
                            isLight ? 'bg-[#F5EFE6] border-[#E2D6C5]' : 'bg-[#140F0C] border-white/5'
                          }`}>
                            <button
                              onClick={() => {
                                sounds.playClick();
                                setCart((prev) =>
                                  prev
                                    .map((i, index) => (index === idx ? { ...i, qty: i.qty - 1 } : i))
                                    .filter((i) => i.qty > 0)
                                );
                              }}
                              className={`p-1 rounded transition ${
                                isLight ? 'hover:bg-black/5 text-[#5C4C40]' : 'hover:bg-white/10 text-stone-400 hover:text-white'
                              }`}
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="font-mono text-xs font-bold px-2">{item.qty}</span>
                            <button
                              onClick={() => {
                                sounds.playClick();
                                setCart((prev) =>
                                  prev.map((i, index) => (index === idx ? { ...i, qty: i.qty + 1 } : i))
                                );
                              }}
                              className={`p-1 rounded transition ${
                                isLight ? 'hover:bg-black/5 text-[#5C4C40]' : 'hover:bg-white/10 text-stone-400 hover:text-white'
                              }`}
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>

                          <span className={`text-[10px] font-mono ${isLight ? 'text-[#8C7B6E]' : 'text-stone-500'}`}>
                            Thermal sealed
                          </span>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                {/* Promo Code Input */}
                <form onSubmit={handleApplyPromo} className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Coupon: FIRSTDRIPP"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    className={`flex-1 px-3 py-2 rounded-xl text-xs font-mono border focus:outline-none focus:border-[#C26D38] shadow-2xs ${
                      isLight 
                        ? 'bg-white border-[#DFD3C3] text-[#16120F] placeholder-stone-400' 
                        : 'bg-[#1D1713] border-[#33261D] text-white placeholder-stone-500'
                    }`}
                  />
                  <button
                    type="submit"
                    className={`px-4 py-2 rounded-xl font-mono text-xs font-bold transition border cursor-pointer ${
                      isLight 
                        ? 'bg-[#F5EFE6] hover:bg-[#C26D38] text-[#2E241E] hover:text-white border-[#DFD3C3]' 
                        : 'bg-[#251B15] hover:bg-[#C26D38] text-white border-[#38281E]'
                    }`}
                  >
                    Apply
                  </button>
                </form>
              </div>

              {/* Drawer Bottom Checkout & Bill */}
              <div className={`pt-4 border-t space-y-3 ${
                isLight ? 'border-[#E8DFC9]' : 'border-[#281F18]'
              }`}>
                <div className="space-y-1.5 font-mono text-xs">
                  <div className={`flex justify-between ${isLight ? 'text-[#6B5A4E]' : 'text-stone-400'}`}>
                    <span>Item Subtotal:</span>
                    <span className={isLight ? "text-[#16120F] font-semibold" : "text-white"}>₹{subtotal}</span>
                  </div>
                  <div className={`flex justify-between ${isLight ? 'text-[#6B5A4E]' : 'text-stone-400'}`}>
                    <span>Doorstep Transit Fee:</span>
                    <span className={deliveryFee === 0 ? 'text-[#16A34A] font-bold' : (isLight ? 'text-[#16120F]' : 'text-white')}>
                      {deliveryFee === 0 ? 'FREE' : `₹${deliveryFee}`}
                    </span>
                  </div>
                  <div className={`flex justify-between ${isLight ? 'text-[#6B5A4E]' : 'text-stone-400'}`}>
                    <span>Ventilated Thermal Pouch:</span>
                    <span className={isLight ? "text-[#16120F]" : "text-white"}>₹{packagingFee}</span>
                  </div>
                  {appliedDiscount > 0 && (
                    <div className="flex justify-between text-[#C26D38] font-bold">
                      <span>Promo Savings:</span>
                      <span>-₹{appliedDiscount}</span>
                    </div>
                  )}
                  <div className={`flex justify-between text-base font-bold pt-2 border-t ${
                    isLight ? 'border-[#E8DFC9] text-[#16120F]' : 'border-[#2B2018] text-white'
                  }`}>
                    <span>Total Amount:</span>
                    <span className="text-[#C26D38]">₹{finalTotal}</span>
                  </div>
                </div>

                {/* Payment method selector */}
                <div className="grid grid-cols-3 gap-2 pt-1">
                  {[
                    { id: 'upi', label: 'Instant UPI', icon: QrCode },
                    { id: 'card', label: 'Card', icon: CreditCard },
                    { id: 'cod', label: 'Cash on Deliv', icon: Receipt }
                  ].map((p) => {
                    const Icon = p.icon;
                    return (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => {
                          sounds.playClick();
                          setPaymentMethod(p.id);
                        }}
                        className={`p-2 rounded-xl text-[10px] font-mono flex flex-col items-center gap-1 transition border cursor-pointer ${
                          paymentMethod === p.id
                            ? 'bg-[#C26D38] text-white border-[#C26D38] font-bold shadow-xs'
                            : isLight 
                              ? 'bg-white text-[#5C4C40] border-[#E5DACB]' 
                              : 'bg-[#1D1713] text-stone-400 border-[#2D221A]'
                        }`}
                      >
                        <Icon className="w-3.5 h-3.5" />
                        <span>{p.label}</span>
                      </button>
                    );
                  })}
                </div>

                <button
                  disabled={cart.length === 0}
                  onClick={handlePlaceOrder}
                  className="w-full py-4 rounded-2xl bg-gradient-to-r from-[#C26D38] to-[#D47E48] text-white font-mono text-xs font-bold uppercase tracking-wider hover:brightness-110 transition shadow-xl disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2 active:scale-95"
                >
                  <span>Authorize Order &amp; Launch Rider Track</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* --------------------------------------------------------------------- */}
      {/* LIVE COURIER DISPATCH & GPS TRACKING MODAL WITH LOTTIE RADAR          */}
      {/* --------------------------------------------------------------------- */}
      <AnimatePresence>
        {isLiveTrackingOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsLiveTrackingOpen(false)}
              className="fixed inset-0 bg-black/75 backdrop-blur-md"
            ></motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className={`relative w-full max-w-2xl rounded-[32px] border p-6 sm:p-8 z-10 space-y-6 shadow-2xl max-h-[92vh] overflow-y-auto ${
                isLight ? 'bg-[#FAF8F5] border-[#E8DFC9] text-[#16120F]' : 'bg-[#16120F] border-[#33271F] text-white'
              }`}
            >
              {/* Top Modal Header */}
              <div className={`flex items-start justify-between pb-4 border-b ${
                isLight ? 'border-[#E8DFC9]' : 'border-[#281F18]'
              }`}>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#C26D38] animate-ping"></span>
                    <span className="font-mono text-xs text-[#C26D38] uppercase font-bold tracking-widest">
                      LIVE GPS COURIER RADAR
                    </span>
                  </div>
                  <h3 className="font-serif text-2xl font-bold mt-0.5">{activeOrder.id}</h3>
                  <p className={`text-xs font-mono ${isLight ? 'text-[#8C7B6E]' : 'text-stone-400'}`}>
                    Destination: {address.flatNo}, {address.area}
                  </p>
                </div>
                <button
                  onClick={() => setIsLiveTrackingOpen(false)}
                  className={`p-2 rounded-full transition cursor-pointer ${
                    isLight ? 'hover:bg-black/5 text-[#8C7B6E] hover:text-[#16120F]' : 'hover:bg-white/10 text-stone-400 hover:text-white'
                  }`}
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Lottie-style Animated GPS Radar & Journey Map (High-Tech Contrast Map) */}
              <div className="relative h-56 sm:h-64 rounded-2xl overflow-hidden bg-[#14100D] border border-[#2B2019] p-4 flex flex-col justify-between shadow-inner">
                
                {/* Background Radar Scanner Animation */}
                <div className="absolute -right-6 -bottom-6 opacity-30 pointer-events-none">
                  <LottieRadarScanner size={220} isLight={false} />
                </div>

                {/* SVG Animated Route Polyline */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M 60 180 Q 180 50, 320 130 T 560 70"
                    fill="none"
                    stroke="#382C22"
                    strokeWidth="4"
                  />
                  <motion.path
                    d="M 60 180 Q 180 50, 320 130 T 560 70"
                    fill="none"
                    stroke="#C26D38"
                    strokeWidth="4"
                    strokeDasharray="10 10"
                    animate={{ strokeDashoffset: [0, -80] }}
                    transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
                  />
                </svg>

                {/* Top status info on map */}
                <div className="relative z-10 flex items-center justify-between">
                  <span className="px-3 py-1 rounded-full bg-black/80 backdrop-blur-md border border-white/15 text-[10px] font-mono text-[#DFBA84]">
                    ORIGIN: Velour Cloud Kitchen Atelier
                  </span>
                  <span className="px-3 py-1 rounded-full bg-[#C26D38] text-white text-xs font-mono font-bold shadow-md">
                    ETA: ~{activeOrder.etaMins} Mins
                  </span>
                </div>

                {/* Animated Rider Pin along the route */}
                <div className="relative z-10 flex items-center justify-center">
                  <div className="flex items-center gap-3 px-4 py-2 rounded-2xl bg-black/90 border border-[#C26D38] text-white text-xs font-mono shadow-2xl backdrop-blur-md">
                    <LottieDeliveryRider className="w-16 h-10" isMoving={true} isLight={false} />
                    <div>
                      <p className="font-bold text-white">Courier In Transit</p>
                      <p className="text-[10px] text-[#DFBA84]">{address.distanceKm} km away on Ather 450X</p>
                    </div>
                  </div>
                </div>

                {/* Bottom destination marker on map */}
                <div className="relative z-10 flex items-center justify-between text-[11px] font-mono text-stone-400">
                  <span className="flex items-center gap-1.5 text-white">
                    <MapPin className="w-4 h-4 text-[#C26D38]" />
                    <span>{address.flatNo}</span>
                  </span>
                  <LottieTamperSeal label="THERMAL SEAL VERIFIED" isLight={false} />
                </div>
              </div>

              {/* 4-Stage Fulfillment Stepper with Animated Micro-Indicators */}
              <div className="space-y-3">
                <span className={`font-mono text-xs uppercase font-bold ${
                  isLight ? 'text-[#6B5A4E]' : 'text-stone-400'
                }`}>ORDER LIFECYCLE PROGRESSION:</span>
                
                <div className="grid grid-cols-4 gap-2 text-center font-mono text-[10px]">
                  {[
                    { id: 'confirmed', label: '1. Confirmed', desc: 'Ticket printed', icon: Receipt },
                    { id: 'cooking', label: '2. In Oven', desc: 'Thermal packed', icon: Flame },
                    { id: 'in-transit', label: '3. In Transit', desc: 'Rahul on Ather', icon: Bike },
                    { id: 'delivered', label: '4. Delivered', desc: 'At your door', icon: CheckCircle2 }
                  ].map((s, idx) => {
                    const statusOrder = ['confirmed', 'cooking', 'in-transit', 'delivered'];
                    const isDone = statusOrder.indexOf(activeOrder.status) >= idx;
                    const isCurrent = activeOrder.status === s.id;
                    const Icon = s.icon;

                    return (
                      <div
                        key={s.id}
                        className={`p-2.5 rounded-xl border transition flex flex-col items-center gap-1 ${
                          isCurrent
                            ? 'bg-[#C26D38]/15 border-[#C26D38] text-[#B35E2A] font-bold shadow-xs'
                            : isDone
                              ? isLight ? 'bg-white border-[#E5DACB] text-[#1C1612]' : 'bg-white/5 border-white/10 text-stone-300'
                              : isLight ? 'bg-[#F5EFE6] border-[#EAE0D2] text-[#8C7B6E]' : 'bg-black/20 border-white/5 text-stone-600'
                        }`}
                      >
                        <Icon className={`w-3.5 h-3.5 ${isCurrent ? 'text-[#C26D38] animate-bounce' : isDone ? 'text-[#C26D38]' : 'text-stone-400'}`} />
                        <p className="font-bold">{s.label}</p>
                        <p className="text-[9px] opacity-75">{s.desc}</p>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Assigned Courier Bio & Contact */}
              <div className={`p-4 rounded-2xl border flex items-center justify-between shadow-2xs ${
                isLight ? 'bg-white border-[#E8DFC9]' : 'bg-[#1D1713] border-[#2E221B]'
              }`}>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#C26D38] text-white font-bold flex items-center justify-center shadow-xs">
                    RS
                  </div>
                  <div>
                    <h4 className="font-serif font-bold text-sm">{activeOrder.courier.name}</h4>
                    <p className={`text-[11px] font-mono ${isLight ? 'text-[#8C7B6E]' : 'text-stone-400'}`}>{activeOrder.courier.vehicle}</p>
                  </div>
                </div>

                <a
                  href={`tel:${activeOrder.courier.phone}`}
                  className={`px-4 py-2 rounded-full font-mono text-xs font-bold transition flex items-center gap-1.5 cursor-pointer border ${
                    isLight 
                      ? 'bg-[#FAF6F0] hover:bg-[#F0E6D8] border-[#E8DFC9] text-[#3D3128]' 
                      : 'bg-white/10 hover:bg-white/15 text-white border-white/10'
                  }`}
                >
                  <Phone className="w-3.5 h-3.5 text-[#C26D38]" />
                  <span>Call Courier</span>
                </a>
              </div>

              {/* Fast-Forward Simulation Demo Controls */}
              <div className={`p-4 rounded-2xl border space-y-2 ${
                isLight ? 'bg-[#F5EFE6] border-[#E5DACB]' : 'bg-[#201813] border-[#33261D]'
              }`}>
                <span className="font-mono text-[10px] text-[#B35E2A] uppercase tracking-wider block font-bold">
                  DEMO CONTROLS: FAST-FORWARD ORDER LIFECYCLE
                </span>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    onClick={() => handleFastForward('cooking', 20)}
                    className={`py-2 px-2.5 rounded-xl text-[11px] font-mono transition cursor-pointer border ${
                      isLight 
                        ? 'bg-white hover:bg-[#F0E6D8] border-[#DFD3C3] text-[#3D3128]' 
                        : 'bg-white/5 hover:bg-white/10 text-stone-300 border-white/10'
                    }`}
                  >
                    1. In Oven Prep
                  </button>
                  <button
                    onClick={() => handleFastForward('in-transit', 12)}
                    className={`py-2 px-2.5 rounded-xl text-[11px] font-mono transition cursor-pointer border ${
                      isLight 
                        ? 'bg-white hover:bg-[#F0E6D8] border-[#DFD3C3] text-[#3D3128]' 
                        : 'bg-white/5 hover:bg-white/10 text-stone-300 border-white/10'
                    }`}
                  >
                    2. Dispatch Courier
                  </button>
                  <button
                    onClick={() => handleFastForward('delivered', 0)}
                    className="py-2 px-2.5 rounded-xl bg-[#C26D38] hover:bg-[#B35E2A] text-white text-[11px] font-mono font-bold transition cursor-pointer shadow-md"
                  >
                    3. Arrived at Door
                  </button>
                </div>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
