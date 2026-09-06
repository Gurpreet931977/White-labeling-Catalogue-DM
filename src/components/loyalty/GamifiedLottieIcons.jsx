import React from 'react';
import { motion } from 'framer-motion';

// ============================================================================
// 1. STEAMING COFFEE CUP (Lottie-Style Micro-Animation)
// ============================================================================
export function LottieSteamingCup({ size = 56, className = '', isHappy = true }) {
  return (
    <motion.div
      className={`relative inline-flex items-center justify-center cursor-pointer select-none ${className}`}
      whileHover={{ scale: 1.12, rotate: [-2, 2, -1, 1, 0], transition: { type: 'spring', stiffness: 400, damping: 10 } }}
      whileTap={{ scale: 0.9, rotate: -4 }}
      style={{ width: size, height: size }}
    >
      {/* 3 Rising Steam Wisps (SVG Animated) */}
      <svg
        viewBox="0 0 40 24"
        className="absolute -top-3 left-1/2 -translate-x-1/2 w-8 h-6 pointer-events-none overflow-visible"
      >
        {/* Steam 1 */}
        <path
          d="M 12 22 Q 10 14 14 8 Q 18 2 13 0"
          fill="none"
          stroke="#ebd73f"
          strokeWidth="2"
          strokeLinecap="round"
          className="animate-steam-1 opacity-70"
        />
        {/* Steam 2 */}
        <path
          d="M 20 23 Q 23 15 19 9 Q 15 3 20 0"
          fill="none"
          stroke="#fef08a"
          strokeWidth="2.2"
          strokeLinecap="round"
          className="animate-steam-2 opacity-80"
        />
        {/* Steam 3 */}
        <path
          d="M 28 22 Q 26 14 29 8 Q 32 2 28 0"
          fill="none"
          stroke="#ebd73f"
          strokeWidth="2"
          strokeLinecap="round"
          className="animate-steam-3 opacity-70"
        />
      </svg>

      {/* Ceramic Coffee Cup Body */}
      <svg viewBox="0 0 64 64" className="w-full h-full drop-shadow-[0_8px_16px_rgba(235,215,63,0.3)]">
        {/* Saucer */}
        <ellipse cx="32" cy="58" rx="26" ry="4.5" fill="#1e293b" stroke="#ebd73f" strokeWidth="2" />
        <ellipse cx="32" cy="57" rx="20" ry="2.5" fill="#334155" />

        {/* Cup Shadow */}
        <ellipse cx="32" cy="54" rx="18" ry="3.5" fill="rgba(0,0,0,0.3)" />

        {/* Cup Handle */}
        <path
          d="M 44 26 C 56 26 56 44 43 45"
          fill="none"
          stroke="#ebd73f"
          strokeWidth="4.5"
          strokeLinecap="round"
        />

        {/* Main Cup Body */}
        <path
          d="M 16 22 L 20 50 C 21 54 43 54 44 50 L 48 22 Z"
          fill="url(#cupGradient)"
          stroke="#ebd73f"
          strokeWidth="2.5"
        />

        {/* Cup Rim Top */}
        <ellipse cx="32" cy="22" rx="16" ry="4" fill="#2d1b00" stroke="#ebd73f" strokeWidth="2" />
        {/* Rich Crema / Coffee Surface */}
        <ellipse cx="32" cy="22.5" rx="14" ry="3" fill="#854d0e" />
        <ellipse cx="32" cy="22.5" rx="10" ry="2" fill="#a16207" />
        {/* Latte Art Heart */}
        <path
          d="M 32 24 C 30 22 28 22 28 23 C 28 24 32 25 32 25 C 32 25 36 24 36 23 C 36 22 34 22 32 24 Z"
          fill="#fef08a"
          opacity="0.9"
        />

        {/* Cute Kawaii Face */}
        {isHappy && (
          <g>
            {/* Blinking / Happy Eyes */}
            <path d="M 26 34 Q 28 32 30 34" fill="none" stroke="#000" strokeWidth="2" strokeLinecap="round" />
            <path d="M 34 34 Q 36 32 38 34" fill="none" stroke="#000" strokeWidth="2" strokeLinecap="round" />
            {/* Smile */}
            <path d="M 30 38 Q 32 41 34 38" fill="none" stroke="#000" strokeWidth="2" strokeLinecap="round" />
            {/* Rosy Cheeks */}
            <circle cx="25" cy="37" r="2" fill="#f43f5e" opacity="0.6" />
            <circle cx="39" cy="37" r="2" fill="#f43f5e" opacity="0.6" />
          </g>
        )}

        {/* Gradients */}
        <defs>
          <linearGradient id="cupGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#fef08a" />
            <stop offset="50%" stopColor="#ebd73f" />
            <stop offset="100%" stopColor="#ca8a04" />
          </linearGradient>
        </defs>
      </svg>
    </motion.div>
  );
}

// ============================================================================
// 2. JIGGLY BUTTER CROISSANT (Squishy Rubber Spring Mascot)
// ============================================================================
export function LottieJigglyCroissant({ size = 56, className = '' }) {
  return (
    <motion.div
      className={`relative inline-flex items-center justify-center cursor-pointer select-none ${className}`}
      whileHover={{
        scaleX: [1, 1.25, 0.85, 1.12, 0.98, 1],
        scaleY: [1, 0.82, 1.18, 0.92, 1.04, 1],
        rotate: [-6, 6, -3, 3, 0],
        transition: { duration: 0.7, ease: 'easeInOut' }
      }}
      whileTap={{
        scaleX: 1.35,
        scaleY: 0.68,
        transition: { type: 'spring', stiffness: 500, damping: 12 }
      }}
      style={{ width: size, height: size }}
    >
      <svg viewBox="0 0 64 64" className="w-full h-full drop-shadow-[0_8px_16px_rgba(245,158,11,0.35)]">
        <defs>
          <linearGradient id="croissantGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#fed7aa" />
            <stop offset="35%" stopColor="#f59e0b" />
            <stop offset="85%" stopColor="#b45309" />
            <stop offset="100%" stopColor="#78350f" />
          </linearGradient>
          <linearGradient id="crustGlow" x1="50%" y1="0%" x2="50%" y2="100%">
            <stop offset="0%" stopColor="#fef3c7" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#d97706" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* Outer Shadow */}
        <ellipse cx="32" cy="54" rx="22" ry="5" fill="rgba(0,0,0,0.35)" />

        {/* Croissant Crescent Body */}
        <path
          d="M 10 42 C 6 30 18 14 32 14 C 46 14 58 30 54 42 C 50 48 44 42 38 38 C 34 35 30 35 26 38 C 20 42 14 48 10 42 Z"
          fill="url(#croissantGrad)"
          stroke="#78350f"
          strokeWidth="2"
        />

        {/* Flaky Pastry Tier Ribs (Segment Lines) */}
        <path
          d="M 23 20 C 25 31 24 37 25 41"
          fill="none"
          stroke="#fef3c7"
          strokeWidth="2.5"
          strokeLinecap="round"
          opacity="0.8"
        />
        <path
          d="M 32 15 C 33 28 32 35 32 40"
          fill="none"
          stroke="#fef3c7"
          strokeWidth="3"
          strokeLinecap="round"
          opacity="0.85"
        />
        <path
          d="M 41 20 C 39 31 40 37 39 41"
          fill="none"
          stroke="#fef3c7"
          strokeWidth="2.5"
          strokeLinecap="round"
          opacity="0.8"
        />

        {/* Butter Glaze Shine Highlights */}
        <path
          d="M 22 17 C 28 15 36 15 42 17"
          fill="none"
          stroke="#fff"
          strokeWidth="2.5"
          strokeLinecap="round"
          opacity="0.6"
        />

        {/* Happy Kawaii Eyes & Cheeks */}
        <ellipse cx="28" cy="27" rx="1.8" ry="2.2" fill="#451a03" />
        <ellipse cx="36" cy="27" rx="1.8" ry="2.2" fill="#451a03" />
        <circle cx="28.5" cy="26.3" r="0.7" fill="#fff" />
        <circle cx="36.5" cy="26.3" r="0.7" fill="#fff" />
        <path d="M 30 31 Q 32 33 34 31" fill="none" stroke="#451a03" strokeWidth="1.6" strokeLinecap="round" />
        <circle cx="24" cy="30" r="1.8" fill="#f43f5e" opacity="0.6" />
        <circle cx="40" cy="30" r="1.8" fill="#f43f5e" opacity="0.6" />
      </svg>
    </motion.div>
  );
}

// ============================================================================
// 3. FLICKERING JIGGLY STREAK FLAME
// ============================================================================
export function LottieStreakFlame({ days = 5, size = 48, className = '' }) {
  return (
    <motion.div
      className={`relative inline-flex items-center justify-center cursor-pointer select-none ${className}`}
      whileHover={{ scale: 1.15, transition: { type: 'spring', stiffness: 450, damping: 10 } }}
      whileTap={{ scale: 0.9 }}
      style={{ width: size, height: size }}
    >
      <svg viewBox="0 0 64 64" className="w-full h-full animate-flame-wobble drop-shadow-[0_0_16px_rgba(249,115,22,0.6)]">
        <defs>
          <linearGradient id="flameOuter" x1="0%" y1="100%" x2="0%" y2="0%">
            <stop offset="0%" stopColor="#ea580c" />
            <stop offset="50%" stopColor="#f97316" />
            <stop offset="100%" stopColor="#ef4444" />
          </linearGradient>
          <linearGradient id="flameMid" x1="0%" y1="100%" x2="0%" y2="0%">
            <stop offset="0%" stopColor="#f59e0b" />
            <stop offset="70%" stopColor="#fbbf24" />
            <stop offset="100%" stopColor="#fef08a" />
          </linearGradient>
          <linearGradient id="flameInner" x1="0%" y1="100%" x2="0%" y2="0%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="100%" stopColor="#fef08a" />
          </linearGradient>
        </defs>

        {/* Outer Flame */}
        <path
          d="M 32 4 C 36 16 52 24 52 40 C 52 52 42 60 32 60 C 22 60 12 52 12 40 C 12 28 24 16 32 4 Z"
          fill="url(#flameOuter)"
        />

        {/* Middle Vibrant Flame */}
        <path
          d="M 32 16 C 36 24 44 30 44 42 C 44 50 38 56 32 56 C 26 56 20 50 20 42 C 20 32 28 24 32 16 Z"
          fill="url(#flameMid)"
        />

        {/* Hot White-Gold Core */}
        <path
          d="M 32 28 C 34 34 38 38 38 45 C 38 51 35 54 32 54 C 29 54 26 51 26 45 C 26 38 30 34 32 28 Z"
          fill="url(#flameInner)"
        />

        {/* Sparkle Embers */}
        <circle cx="48" cy="18" r="1.5" fill="#fef08a" className="animate-ping" />
        <circle cx="16" cy="22" r="1.2" fill="#fbbf24" className="animate-pulse" />
      </svg>
    </motion.div>
  );
}

// ============================================================================
// 4. BOUNCY COFFEE BEAN MASCOT
// ============================================================================
export function LottieCoffeeBean({ size = 36, className = '' }) {
  return (
    <motion.div
      className={`relative inline-flex items-center justify-center cursor-pointer select-none ${className}`}
      whileHover={{ scale: 1.25, rotate: 180, transition: { type: 'spring', stiffness: 350, damping: 12 } }}
      style={{ width: size, height: size }}
    >
      <svg viewBox="0 0 48 48" className="w-full h-full drop-shadow-[0_4px_10px_rgba(202,138,4,0.4)]">
        <defs>
          <linearGradient id="beanGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#78350f" />
            <stop offset="50%" stopColor="#451a03" />
            <stop offset="100%" stopColor="#1c0d02" />
          </linearGradient>
        </defs>

        {/* Oval Bean Body */}
        <ellipse cx="24" cy="24" rx="16" ry="20" fill="url(#beanGrad)" stroke="#b45309" strokeWidth="1.5" />
        {/* Curving Center Crease */}
        <path
          d="M 24 8 C 20 16 28 32 24 40"
          fill="none"
          stroke="#ebd73f"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
        {/* Specular Highlight */}
        <ellipse cx="18" cy="16" rx="3" ry="5" fill="#fff" opacity="0.25" transform="rotate(-15 18 16)" />
      </svg>
    </motion.div>
  );
}

// ============================================================================
// 5. BOUNCY DONUT WITH SPRINKLES
// ============================================================================
export function LottieBouncyDonut({ size = 52, className = '' }) {
  return (
    <motion.div
      className={`relative inline-flex items-center justify-center cursor-pointer select-none ${className}`}
      whileHover={{
        rotate: [0, 90, 180, 270, 360],
        scale: 1.15,
        transition: { duration: 0.8, ease: 'easeInOut' }
      }}
      whileTap={{ scale: 0.85 }}
      style={{ width: size, height: size }}
    >
      <svg viewBox="0 0 64 64" className="w-full h-full drop-shadow-[0_8px_16px_rgba(236,72,153,0.35)]">
        <defs>
          <linearGradient id="doughGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#fde68a" />
            <stop offset="100%" stopColor="#d97706" />
          </linearGradient>
          <linearGradient id="icingGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#f472b6" />
            <stop offset="100%" stopColor="#db2777" />
          </linearGradient>
        </defs>

        {/* Outer Dough */}
        <circle cx="32" cy="32" r="26" fill="url(#doughGrad)" stroke="#b45309" strokeWidth="1.5" />
        
        {/* Strawberry Icing with Wavy Glaze Drips */}
        <path
          d="M 32 9 C 45 9 55 19 55 32 C 55 37 53 42 49 46 C 45 44 42 47 38 44 C 34 47 30 45 26 48 C 22 45 19 47 16 43 C 11 39 9 34 9 32 C 9 19 19 9 32 9 Z"
          fill="url(#icingGrad)"
        />

        {/* Center Hole */}
        <circle cx="32" cy="32" r="10" fill="#090c12" stroke="#b45309" strokeWidth="1.5" />

        {/* Rainbow Sprinkles */}
        <rect x="22" y="16" width="5" height="2" rx="1" fill="#ebd73f" transform="rotate(25 22 16)" />
        <rect x="36" y="15" width="5" height="2" rx="1" fill="#38bdf8" transform="rotate(-30 36 15)" />
        <rect x="44" y="24" width="5" height="2" rx="1" fill="#4ade80" transform="rotate(45 44 24)" />
        <rect x="18" y="28" width="5" height="2" rx="1" fill="#facc15" transform="rotate(-15 18 28)" />
        <rect x="32" y="42" width="5" height="2" rx="1" fill="#ffffff" transform="rotate(10 32 42)" />
        <rect x="42" y="36" width="5" height="2" rx="1" fill="#a855f7" transform="rotate(-40 42 36)" />
      </svg>
    </motion.div>
  );
}

// ============================================================================
// 6. JIGGLY MYSTERY TREAT BOX
// ============================================================================
export function LottieMysteryBox({ size = 52, isShaking = false, className = '' }) {
  return (
    <motion.div
      className={`relative inline-flex items-center justify-center cursor-pointer select-none ${className}`}
      animate={isShaking ? {
        rotate: [-8, 8, -6, 6, -3, 3, 0],
        scale: [1, 1.15, 0.95, 1.1, 1],
        transition: { duration: 0.6, repeat: Infinity }
      } : {}}
      whileHover={{
        scale: 1.1,
        rotate: [-3, 3, 0],
        transition: { type: 'spring', stiffness: 400, damping: 10 }
      }}
      whileTap={{ scale: 0.9 }}
      style={{ width: size, height: size }}
    >
      <svg viewBox="0 0 64 64" className="w-full h-full drop-shadow-[0_8px_20px_rgba(235,215,63,0.45)]">
        <defs>
          <linearGradient id="boxGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ca8a04" />
            <stop offset="50%" stopColor="#eab308" />
            <stop offset="100%" stopColor="#a16207" />
          </linearGradient>
          <linearGradient id="ribbonGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#f43f5e" />
            <stop offset="100%" stopColor="#be123c" />
          </linearGradient>
        </defs>

        {/* Box Body */}
        <rect x="14" y="26" width="36" height="30" rx="6" fill="url(#boxGrad)" stroke="#fef08a" strokeWidth="2" />

        {/* Vertical Ribbon */}
        <rect x="29" y="26" width="6" height="30" fill="url(#ribbonGrad)" />

        {/* Box Lid */}
        <rect x="11" y="20" width="42" height="9" rx="3" fill="#fef08a" stroke="#ca8a04" strokeWidth="2" />
        <rect x="29" y="20" width="6" height="9" fill="url(#ribbonGrad)" />

        {/* Ribbon Bow Left */}
        <ellipse cx="26" cy="16" rx="6" ry="4" fill="url(#ribbonGrad)" stroke="#fef08a" strokeWidth="1" transform="rotate(-25 26 16)" />
        {/* Ribbon Bow Right */}
        <ellipse cx="38" cy="16" rx="6" ry="4" fill="url(#ribbonGrad)" stroke="#fef08a" strokeWidth="1" transform="rotate(25 38 16)" />
        {/* Center Knot */}
        <circle cx="32" cy="17" r="3" fill="#fff" />

        {/* Sparkle Star */}
        <polygon points="46,14 47,17 50,18 47,19 46,22 45,19 42,18 45,17" fill="#ebd73f" className="animate-pulse" />
      </svg>
    </motion.div>
  );
}

// ============================================================================
// 7. JIGGLY RUBBER STAMP MARK (With Squish and Particle Burst)
// ============================================================================
export function JigglyStampMark({ stampNumber, label = "STAMPED", isMilestone = false, icon: Icon }) {
  return (
    <motion.div
      initial={{ scale: 2.2, rotate: -25, opacity: 0 }}
      animate={{
        scale: [2.2, 0.85, 1.15, 0.95, 1],
        rotate: [-25, 6, -3, 0],
        opacity: 1
      }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className={`relative w-full h-full flex flex-col items-center justify-center p-2 rounded-2xl ${
        isMilestone
          ? 'bg-gradient-to-br from-amber-400 via-amber-500 to-amber-600 text-slate-950 ring-4 ring-amber-300/80 shadow-glow-yellow'
          : 'bg-gradient-to-br from-[#ebd73f] to-[#ca8a04] text-slate-950 ring-2 ring-yellow-200/60 shadow-lg shadow-amber-500/30'
      }`}
    >
      {/* Ink Texture Ring */}
      <div className="absolute inset-1 rounded-xl border border-dashed border-slate-950/40 pointer-events-none" />

      {/* Stamp Icon */}
      {Icon ? (
        <Icon className="w-5 h-5 sm:w-6 sm:h-6 stroke-[2.5]" />
      ) : (
        <span className="font-panchang font-black text-base sm:text-lg">#{stampNumber}</span>
      )}

      {/* Rubber Ink Text */}
      <span className="font-mono text-[9px] font-black uppercase tracking-wider mt-0.5 opacity-90">
        {label}
      </span>
    </motion.div>
  );
}
