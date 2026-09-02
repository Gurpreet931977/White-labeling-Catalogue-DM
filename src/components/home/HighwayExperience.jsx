import React from 'react';
import { motion } from 'framer-motion';
import { BRAND_CONFIG } from '../../data/cafeConfig';

// =========================================================================
// CUSTOM ANIMATED 2D VECTOR ICONS (MODERN, LAYERED, NO EMOJIS)
// =========================================================================

/** 1. Animated 2D Authentic Lounge & Highway Cruiser Icon */
function AnimatedLoungeIcon() {
  return (
    <div className="relative w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-500/20 via-amber-500/10 to-slate-950 border border-amber-400/30 flex items-center justify-center shadow-lg shadow-amber-500/10 overflow-hidden group">
      {/* Ambient Pulsing Glow */}
      <motion.div
        animate={{ scale: [1, 1.3, 1], opacity: [0.3, 0.7, 0.3] }}
        transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
        className="absolute inset-0 bg-amber-400/20 rounded-full blur-md"
      />

      {/* Floating Highway Cruiser Truck */}
      <motion.svg
        animate={{ y: [0, -2, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        className="w-6 h-6 relative z-10"
        viewBox="0 0 24 24"
        fill="none"
      >
        {/* Main Vehicle Body */}
        <path
          d="M1 4C1 3.44772 1.44772 3 2 3H14C14.5523 3 15 3.44772 15 4V14H1V4Z"
          fill="url(#truck-body-grad)"
          stroke="#F59E0B"
          strokeWidth="1.2"
        />
        {/* Cabin Front */}
        <path
          d="M15 7H18.5C18.8978 7 19.2794 7.15804 19.5607 7.43934L22.5607 10.4393C22.842 10.7206 23 11.1022 23 11.5V14C23 14.5523 22.5523 15 22 15H15V7Z"
          fill="url(#cabin-grad)"
          stroke="#F59E0B"
          strokeWidth="1.2"
        />
        {/* Cabin Window */}
        <path
          d="M16 8.5H18.2L20.8 11H16V8.5Z"
          fill="#FEF3C7"
          opacity="0.8"
        />
        {/* Headlight Beam Pulse */}
        <motion.path
          animate={{ opacity: [0.3, 0.9, 0.3] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          d="M23 13L24.5 12.5V14.5L23 14V13Z"
          fill="#FDE047"
        />
        {/* Back Wheel with rotating rim */}
        <circle cx="5.5" cy="16.5" r="2.5" fill="#0F172A" stroke="#F59E0B" strokeWidth="1.2" />
        <circle cx="5.5" cy="16.5" r="1" fill="#FDE047" />
        {/* Front Wheel with rotating rim */}
        <circle cx="17.5" cy="16.5" r="2.5" fill="#0F172A" stroke="#F59E0B" strokeWidth="1.2" />
        <circle cx="17.5" cy="16.5" r="1" fill="#FDE047" />

        <defs>
          <linearGradient id="truck-body-grad" x1="1" y1="3" x2="15" y2="14" gradientUnits="userSpaceOnUse">
            <stop stopColor="#FBBF24" />
            <stop offset="1" stopColor="#D97706" />
          </linearGradient>
          <linearGradient id="cabin-grad" x1="15" y1="7" x2="23" y2="15" gradientUnits="userSpaceOnUse">
            <stop stopColor="#F59E0B" />
            <stop offset="1" stopColor="#B45309" />
          </linearGradient>
        </defs>
      </motion.svg>
    </div>
  );
}

/** 2. Animated 2D Mountain Peaks & Fresh Breeze Icon */
function AnimatedMountainIcon() {
  return (
    <div className="relative w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500/20 via-teal-500/10 to-slate-950 border border-emerald-400/30 flex items-center justify-center shadow-lg shadow-emerald-500/10 overflow-hidden group">
      {/* Ambient Pulsing Glow */}
      <motion.div
        animate={{ scale: [1, 1.3, 1], opacity: [0.3, 0.7, 0.3] }}
        transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut", delay: 0.3 }}
        className="absolute inset-0 bg-emerald-400/20 rounded-full blur-md"
      />

      {/* Floating Mountain Peaks */}
      <svg className="w-6 h-6 relative z-10" viewBox="0 0 24 24" fill="none">
        {/* Background Sun/Moon Orb */}
        <motion.circle
          animate={{ scale: [0.95, 1.05, 0.95] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          cx="17"
          cy="7"
          r="3"
          fill="url(#mountain-sun-grad)"
        />

        {/* Back Mountain Peak */}
        <path
          d="M13 8L21 20H9L13 8Z"
          fill="url(#mountain-back-grad)"
          stroke="#0D9488"
          strokeWidth="1"
          strokeLinejoin="round"
        />

        {/* Front Majestic Mountain Peak */}
        <path
          d="M7.5 5L15.5 20H1.5L7.5 5Z"
          fill="url(#mountain-front-grad)"
          stroke="#10B981"
          strokeWidth="1.2"
          strokeLinejoin="round"
        />

        {/* Snow Cap on Front Peak */}
        <path
          d="M7.5 5L9.5 9L8 10L7 9L5.5 10L7.5 5Z"
          fill="#ECFDF5"
        />

        {/* Animated Mountain Breeze Wave */}
        <motion.path
          animate={{ x: [-2, 2, -2], opacity: [0.4, 0.9, 0.4] }}
          transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
          d="M1 18C4 17 8 18.5 12 17.5C16 16.5 20 18 23 17"
          stroke="#6EE7B7"
          strokeWidth="1"
          strokeLinecap="round"
        />

        <defs>
          <linearGradient id="mountain-sun-grad" x1="14" y1="4" x2="20" y2="10" gradientUnits="userSpaceOnUse">
            <stop stopColor="#FEF08A" />
            <stop offset="1" stopColor="#F59E0B" />
          </linearGradient>
          <linearGradient id="mountain-front-grad" x1="1.5" y1="5" x2="15.5" y2="20" gradientUnits="userSpaceOnUse">
            <stop stopColor="#34D399" />
            <stop offset="1" stopColor="#065F46" />
          </linearGradient>
          <linearGradient id="mountain-back-grad" x1="9" y1="8" x2="21" y2="20" gradientUnits="userSpaceOnUse">
            <stop stopColor="#14B8A6" />
            <stop offset="1" stopColor="#115E59" />
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

/** 4. Animated 2D Midnight Kitchen / 24/7 Clock & Moon Icon */
function AnimatedMidnightIcon() {
  return (
    <div className="relative w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-500/20 via-indigo-500/10 to-slate-950 border border-purple-400/30 flex items-center justify-center shadow-lg shadow-purple-500/10 overflow-hidden group">
      {/* Ambient Pulsing Glow */}
      <motion.div
        animate={{ scale: [1, 1.3, 1], opacity: [0.3, 0.7, 0.3] }}
        transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut", delay: 0.9 }}
        className="absolute inset-0 bg-purple-400/20 rounded-full blur-md"
      />

      {/* Floating Micro Star 1 */}
      <motion.div
        animate={{ scale: [0.5, 1.2, 0.5], opacity: [0.3, 1, 0.3] }}
        transition={{ duration: 1.8, repeat: Infinity }}
        className="absolute top-2.5 right-3 w-1 h-1 rounded-full bg-amber-300 pointer-events-none"
      />

      {/* Floating Micro Star 2 */}
      <motion.div
        animate={{ scale: [0.4, 1.1, 0.4], opacity: [0.2, 0.9, 0.2] }}
        transition={{ duration: 2.2, repeat: Infinity, delay: 0.6 }}
        className="absolute bottom-3 left-3 w-1 h-1 rounded-full bg-purple-300 pointer-events-none"
      />

      {/* Layered 2D Crescent Moon & Kitchen Spark */}
      <motion.svg
        animate={{ rotate: [-4, 4, -4] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        className="w-6 h-6 relative z-10"
        viewBox="0 0 24 24"
        fill="none"
      >
        {/* Glowing Golden Crescent Moon */}
        <path
          d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79Z"
          fill="url(#moon-grad)"
          stroke="#C084FC"
          strokeWidth="1.2"
          strokeLinejoin="round"
        />

        {/* 24/7 Kitchen Sparkle / Steam Core */}
        <motion.path
          animate={{ scale: [0.8, 1.2, 0.8], opacity: [0.7, 1, 0.7] }}
          transition={{ duration: 1.6, repeat: Infinity }}
          d="M9 10C9 10 9.5 8.5 11 8.5C12.5 8.5 12.5 10 13 11C13.5 12 14.5 12 14.5 12"
          stroke="#FDE047"
          strokeWidth="1"
          strokeLinecap="round"
        />

        <defs>
          <linearGradient id="moon-grad" x1="3" y1="3" x2="21" y2="21" gradientUnits="userSpaceOnUse">
            <stop stopColor="#FDE047" />
            <stop offset="0.6" stopColor="#C084FC" />
            <stop offset="1" stopColor="#7E22CE" />
          </linearGradient>
        </defs>
      </motion.svg>
    </div>
  );
}

// =========================================================================
// MAIN HIGHWAY EXPERIENCE SECTION
// =========================================================================

export function HighwayExperience() {
  const animatedIcons = [
    <AnimatedLoungeIcon key="lounge" />,
    <AnimatedMountainIcon key="mountain" />,
    <AnimatedTableTechIcon key="tech" />,
    <AnimatedMidnightIcon key="midnight" />
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
            {BRAND_CONFIG.tagline} • Crafted for exceptional food lovers and late-night cravings.
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
