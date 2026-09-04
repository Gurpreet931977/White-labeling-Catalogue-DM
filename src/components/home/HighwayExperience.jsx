import React from 'react';
import { motion } from 'framer-motion';
import { BRAND_CONFIG } from '../../data/cafeConfig';

// =========================================================================
// CUSTOM ANIMATED 2D VECTOR ICONS (MODERN, LAYERED, NO EMOJIS)
// =========================================================================

/** 1. Animated 2D Handcrafted Italian Kitchen & Wood-Fired Oven Icon */
function AnimatedItalianKitchenIcon() {
  return (
    <div className="relative w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-500/20 via-orange-500/10 to-slate-950 border border-amber-400/30 flex items-center justify-center shadow-lg shadow-amber-500/10 overflow-hidden group">
      {/* Ambient Pulsing Hearth Glow */}
      <motion.div
        animate={{ scale: [1, 1.3, 1], opacity: [0.3, 0.7, 0.3] }}
        transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
        className="absolute inset-0 bg-amber-400/20 rounded-full blur-md"
      />

      {/* Layered 2D Wood-Fired Oven & Pizza Peel */}
      <motion.svg
        animate={{ y: [0, -2, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        className="w-6 h-6 relative z-10"
        viewBox="0 0 24 24"
        fill="none"
      >
        {/* Oven Brick Dome Outline */}
        <path
          d="M3 19C3 12 7 6 12 6C17 6 21 12 21 19H3Z"
          fill="url(#oven-dome-grad)"
          stroke="#F59E0B"
          strokeWidth="1.2"
        />
        {/* Oven Hearth Opening */}
        <path
          d="M7 19C7 14 9.2 11 12 11C14.8 11 17 14 17 19H7Z"
          fill="#1E1B18"
          stroke="#D97706"
          strokeWidth="1"
        />
        {/* Radiant Inner Ember Glow */}
        <motion.ellipse
          animate={{ rx: [3.5, 4.2, 3.5], opacity: [0.7, 1, 0.7] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          cx="12"
          cy="18"
          rx="4"
          ry="1.5"
          fill="#F59E0B"
        />
        {/* Chimney / Steam Exhaust */}
        <path d="M11 6V3H13V6" stroke="#F59E0B" strokeWidth="1.2" strokeLinecap="round" />
        <motion.path
          animate={{ opacity: [0.3, 0.9, 0.3], y: [0, -2, 0] }}
          transition={{ duration: 1.4, repeat: Infinity }}
          d="M12 2C11.5 1.5 12.5 1 12 0.5"
          stroke="#FDE047"
          strokeWidth="1"
          strokeLinecap="round"
        />

        <defs>
          <linearGradient id="oven-dome-grad" x1="3" y1="6" x2="21" y2="19" gradientUnits="userSpaceOnUse">
            <stop stopColor="#F59E0B" />
            <stop offset="0.7" stopColor="#B45309" />
            <stop offset="1" stopColor="#78350F" />
          </linearGradient>
        </defs>
      </motion.svg>
    </div>
  );
}

/** 2. Animated 2D Specialty Coffee Roastery & Velvet Microfoam Icon */
function AnimatedCoffeeRoastIcon() {
  return (
    <div className="relative w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500/20 via-teal-500/10 to-slate-950 border border-emerald-400/30 flex items-center justify-center shadow-lg shadow-emerald-500/10 overflow-hidden group">
      {/* Ambient Pulsing Glow */}
      <motion.div
        animate={{ scale: [1, 1.3, 1], opacity: [0.3, 0.7, 0.3] }}
        transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut", delay: 0.3 }}
        className="absolute inset-0 bg-emerald-400/20 rounded-full blur-md"
      />

      {/* Layered Coffee Cup & Rising Steaming Swirls */}
      <svg className="w-6 h-6 relative z-10" viewBox="0 0 24 24" fill="none">
        {/* Coffee Cup Body */}
        <path
          d="M3 8C3 13.5 6 17 12 17C18 17 21 13.5 21 8H3Z"
          fill="url(#coffee-cup-grad)"
          stroke="#10B981"
          strokeWidth="1.2"
        />
        {/* Cup Handle */}
        <path
          d="M19 10C20.5 10 21.5 11 21.5 12.5C21.5 14 20.5 15 19 15"
          stroke="#34D399"
          strokeWidth="1.2"
          strokeLinecap="round"
        />
        {/* Cup Saucer Base */}
        <line x1="4" y1="19" x2="20" y2="19" stroke="#059669" strokeWidth="1.4" strokeLinecap="round" />

        {/* Rising Steam Swirl 1 */}
        <motion.path
          animate={{ y: [0, -3, 0], opacity: [0.4, 0.9, 0.4] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
          d="M8 5C7.5 4 8.5 3 8 2"
          stroke="#6EE7B7"
          strokeWidth="1.2"
          strokeLinecap="round"
        />
        {/* Rising Steam Swirl 2 */}
        <motion.path
          animate={{ y: [0, -3, 0], opacity: [0.4, 0.9, 0.4] }}
          transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut", delay: 0.4 }}
          d="M12 5C11.5 4 12.5 3 12 2"
          stroke="#A7F3D0"
          strokeWidth="1.2"
          strokeLinecap="round"
        />
        {/* Rising Steam Swirl 3 */}
        <motion.path
          animate={{ y: [0, -3, 0], opacity: [0.4, 0.9, 0.4] }}
          transition={{ duration: 1.9, repeat: Infinity, ease: "easeInOut", delay: 0.8 }}
          d="M16 5C15.5 4 16.5 3 16 2"
          stroke="#6EE7B7"
          strokeWidth="1.2"
          strokeLinecap="round"
        />

        <defs>
          <linearGradient id="coffee-cup-grad" x1="3" y1="8" x2="21" y2="17" gradientUnits="userSpaceOnUse">
            <stop stopColor="#059669" />
            <stop offset="1" stopColor="#064E3B" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
}

/** 3. Animated 2D Table QR Tech Icon with Laser Scan Wave */
function AnimatedTableTechIcon() {
  return (
    <div className="relative w-12 h-12 rounded-2xl bg-gradient-to-br from-cyan-500/20 via-sky-500/10 to-slate-950 border border-cyan-400/30 flex items-center justify-center shadow-lg shadow-cyan-500/10 overflow-hidden group">
      {/* Ambient Pulsing Glow */}
      <motion.div
        animate={{ scale: [1, 1.3, 1], opacity: [0.3, 0.7, 0.3] }}
        transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut", delay: 0.6 }}
        className="absolute inset-0 bg-cyan-400/20 rounded-full blur-md"
      />

      {/* Modern 2D QR Table Plaque with Laser Beam */}
      <div className="relative w-6 h-6 z-10 flex items-center justify-center">
        <svg className="w-full h-full" viewBox="0 0 24 24" fill="none">
          {/* Table Plaque Frame */}
          <rect x="2" y="2" width="20" height="20" rx="4" fill="#082F49" stroke="#38BDF8" strokeWidth="1.2" />

          {/* QR Corner Markers */}
          <rect x="5" y="5" width="4" height="4" rx="1" fill="#38BDF8" />
          <rect x="15" y="5" width="4" height="4" rx="1" fill="#38BDF8" />
          <rect x="5" y="15" width="4" height="4" rx="1" fill="#38BDF8" />

          {/* Center Tech Dots */}
          <rect x="11" y="11" width="2" height="2" fill="#7DD3FC" />
          <rect x="15" y="15" width="2.5" height="2.5" fill="#7DD3FC" />
          <rect x="11" y="5.5" width="1.5" height="2" fill="#7DD3FC" />
          <rect x="5.5" y="11" width="2" height="1.5" fill="#7DD3FC" />
        </svg>

        {/* Animated Laser Scanning Line */}
        <motion.div
          animate={{ y: [-8, 8, -8] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute left-1 right-1 h-0.5 bg-gradient-to-r from-transparent via-cyan-300 to-transparent shadow-[0_0_6px_#38BDF8]"
        />
      </div>
    </div>
  );
}

/** 4. Animated 2D Cozy Bistro Ambience & Warm Lo-Fi Lamp Icon */
function AnimatedBistroAmbienceIcon() {
  return (
    <div className="relative w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-500/20 via-indigo-500/10 to-slate-950 border border-purple-400/30 flex items-center justify-center shadow-lg shadow-purple-500/10 overflow-hidden group">
      {/* Ambient Pulsing Glow */}
      <motion.div
        animate={{ scale: [1, 1.3, 1], opacity: [0.3, 0.7, 0.3] }}
        transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut", delay: 0.9 }}
        className="absolute inset-0 bg-purple-400/20 rounded-full blur-md"
      />

      {/* Floating Micro Star / Music Spark 1 */}
      <motion.div
        animate={{ scale: [0.5, 1.2, 0.5], opacity: [0.3, 1, 0.3] }}
        transition={{ duration: 1.8, repeat: Infinity }}
        className="absolute top-2.5 right-3 w-1 h-1 rounded-full bg-amber-300 pointer-events-none"
      />

      {/* Floating Micro Star / Music Spark 2 */}
      <motion.div
        animate={{ scale: [0.4, 1.1, 0.4], opacity: [0.2, 0.9, 0.2] }}
        transition={{ duration: 2.2, repeat: Infinity, delay: 0.6 }}
        className="absolute bottom-3 left-3 w-1 h-1 rounded-full bg-purple-300 pointer-events-none"
      />

      {/* Layered 2D Warm Pendant Bistro Lamp & Acoustic Wave */}
      <motion.svg
        animate={{ rotate: [-2, 2, -2] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        className="w-6 h-6 relative z-10 origin-top"
        viewBox="0 0 24 24"
        fill="none"
      >
        {/* Lamp Cord */}
        <line x1="12" y1="2" x2="12" y2="7" stroke="#A855F7" strokeWidth="1.2" />
        {/* Lamp Shade Dome */}
        <path
          d="M7 13C7 9.5 9.2 7 12 7C14.8 7 17 9.5 17 13H7Z"
          fill="url(#lamp-shade-grad)"
          stroke="#C084FC"
          strokeWidth="1.2"
        />
        {/* Warm Filament Glow Bulb */}
        <motion.circle
          animate={{ opacity: [0.6, 1, 0.6], scale: [0.9, 1.1, 0.9] }}
          transition={{ duration: 1.6, repeat: Infinity }}
          cx="12"
          cy="15"
          r="2.5"
          fill="#FDE047"
        />
        {/* Ambient Light Cone */}
        <path
          d="M7 13L4 21H20L17 13Z"
          fill="url(#light-cone-grad)"
          opacity="0.25"
        />

        <defs>
          <linearGradient id="lamp-shade-grad" x1="7" y1="7" x2="17" y2="13" gradientUnits="userSpaceOnUse">
            <stop stopColor="#A855F7" />
            <stop offset="1" stopColor="#6B21A8" />
          </linearGradient>
          <linearGradient id="light-cone-grad" x1="12" y1="13" x2="12" y2="21" gradientUnits="userSpaceOnUse">
            <stop stopColor="#FDE047" stopOpacity="0.8" />
            <stop offset="1" stopColor="#F59E0B" stopOpacity="0" />
          </linearGradient>
        </defs>
      </motion.svg>
    </div>
  );
}

// =========================================================================
// MAIN EXPERIENCE SECTION
// =========================================================================

export function CafeExperience() {
  const animatedIcons = [
    <AnimatedItalianKitchenIcon key="kitchen" />,
    <AnimatedCoffeeRoastIcon key="coffee" />,
    <AnimatedTableTechIcon key="tech" />,
    <AnimatedBistroAmbienceIcon key="ambience" />
  ];

  return (
    <section className="py-16 bg-slate-900/30 border-t border-white/5 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Heading */}
        <div className="text-center max-w-xl mx-auto mb-12">
          <h2 className="text-2xl sm:text-4xl font-black text-white font-syne tracking-tight">
            More Than Just a Cafe
          </h2>
          <p className="text-slate-400 text-xs sm:text-sm mt-2 leading-relaxed">
            {BRAND_CONFIG.tagline} • Crafted for true food lovers, slow coffee moments, and comfortable gatherings.
          </p>
        </div>

        {/* 4 Feature Cards with Custom Animated 2D Vector Icons */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {BRAND_CONFIG.experiences.map((exp, idx) => {
            const IconComponent = animatedIcons[idx % animatedIcons.length];
            return (
              <motion.div
                key={idx}
                whileHover={{ y: -5, scale: 1.01 }}
                className="p-5 sm:p-6 rounded-3xl bg-slate-900/90 border border-white/5 hover:border-amber-400/30 transition-all space-y-4 group shadow-md"
              >
                {/* Custom Animated 2D Icon Container */}
                <div>
                  {IconComponent}
                </div>

                {/* Card Title & Description */}
                <h3 className="text-base font-bold text-white font-syne group-hover:text-amber-300 transition">
                  {exp.title}
                </h3>
                <p className="text-slate-400 text-xs leading-relaxed font-normal">
                  {exp.desc}
                </p>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
export { CafeExperience as HighwayExperience };
