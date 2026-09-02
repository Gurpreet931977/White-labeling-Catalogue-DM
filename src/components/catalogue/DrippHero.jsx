import React from 'react';
import { motion } from 'framer-motion';
import { 
  Sparkles, 
  ArrowRight, 
  Coffee, 
  CheckCircle2, 
  Layers, 
  Activity, 
  SlidersHorizontal,
  ChevronDown 
} from 'lucide-react';
import { sounds } from '../../utils/audio';

export function DrippHero({ 
  onLaunchCafeDemo, 
  onOpenCustomizer, 
  onOpenQuote 
}) {
  return (
    <section id="hero" className="relative min-h-[92vh] flex flex-col justify-center items-center text-center px-4 pt-28 pb-16 overflow-hidden cyber-grid">
      
      {/* Ambient Glows */}
      <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[600px] h-[600px] ambient-glow-yellow blur-3xl pointer-events-none -z-10"></div>
      <div className="absolute top-1/3 -left-40 w-[400px] h-[400px] ambient-glow-purple blur-3xl pointer-events-none -z-10"></div>
      <div className="absolute top-1/2 -right-40 w-[400px] h-[400px] ambient-glow-cyan blur-3xl pointer-events-none -z-10"></div>

      {/* Top Status Capsule */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/[0.05] border border-white/10 backdrop-blur-xl mb-6 shadow-xl"
      >
        <span className="w-2 h-2 rounded-full bg-[#ebd73f] animate-pulse"></span>
        <span className="text-[11px] font-mono tracking-wider uppercase text-white/90">
          Dripp Media // White-Labeling Ecosystem
        </span>
        <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-[#ebd73f]/20 text-[#ebd73f] font-bold">
          MULTI-NICHE
        </span>
      </motion.div>

      {/* Hero Massive Typography (Panchang / Syne) */}
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, delay: 0.1 }}
        className="space-y-1 mb-6 max-w-5xl"
      >
        <h1 className="font-panchang font-black text-4xl sm:text-6xl md:text-7xl lg:text-8xl tracking-tight leading-[0.95] text-white">
          <span className="inline-block bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
            DRIPP
          </span>{" "}
          <span className="inline-block text-[#ebd73f] drop-shadow-[0_0_35px_rgba(235,215,63,0.35)]">
            MEDIA
          </span>
        </h1>
        <div className="pt-2">
          <h2 className="font-clash font-extrabold text-xl sm:text-3xl md:text-4xl tracking-wider text-slate-300 uppercase">
            Turnkey White-Label Catalogue
          </h2>
        </div>
      </motion.div>

      {/* Subtitle */}
      <motion.p
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.2 }}
        className="max-w-2xl text-sm sm:text-base md:text-lg text-slate-300/80 font-clash leading-relaxed mb-8"
      >
        High-performance, conversion-engineered digital platforms for modern businesses — from{" "}
        <strong className="text-amber-400 font-semibold">Cafes &amp; Restaurants</strong> to{" "}
        <strong className="text-cyan-400 font-semibold">Clinics</strong>,{" "}
        <strong className="text-rose-400 font-semibold">Gyms</strong>,{" "}
        <strong className="text-purple-400 font-semibold">Nightclubs</strong>, and{" "}
        <strong className="text-emerald-400 font-semibold">Turfs</strong>.
      </motion.p>

      {/* Hero CTA Group */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.3 }}
        className="flex flex-wrap items-center justify-center gap-3.5 mb-14"
      >
        {/* Launch Active Cafe Demo */}
        <button
          onClick={() => {
            sounds.playClick();
            onLaunchCafeDemo();
          }}
          className="btn-dripp-primary px-7 py-3.5 text-sm flex items-center gap-2.5 font-bold shadow-2xl group cursor-pointer"
        >
          <span className="auth-shimmer-sweep"></span>
          <Coffee className="w-4 h-4 text-black group-hover:rotate-12 transition-transform" />
          <span>Launch Live Cafe Demo</span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </button>

        {/* Test Brand Simulator */}
        <button
          onClick={() => {
            sounds.playClick();
            onOpenCustomizer();
          }}
          className="btn-dripp-secondary px-6 py-3.5 text-sm flex items-center gap-2 font-semibold hover:border-[#ebd73f]/60 cursor-pointer"
        >
          <SlidersHorizontal className="w-4 h-4 text-[#ebd73f]" />
          <span>Test Brand Simulator</span>
        </button>

        {/* Get Instant Quote */}
        <button
          onClick={() => {
            sounds.playClick();
            onOpenQuote();
          }}
          className="px-5 py-3.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-white/80 hover:text-white text-sm font-medium transition cursor-pointer"
        >
          <span>Get Turnkey Quote</span>
        </button>
      </motion.div>

      {/* Trust Metrics Bar (Inspired by Dripp Media developermodeon trust bar) */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.4 }}
        className="w-full max-w-4xl p-4 sm:p-5 rounded-3xl bg-[#111111]/80 border border-white/10 backdrop-blur-xl shadow-2xl shadow-black/80"
      >
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 divide-y md:divide-y-0 md:divide-x divide-white/10 text-center">
          
          <div className="pt-2 md:pt-0">
            <p className="font-panchang font-black text-2xl sm:text-3xl text-[#ebd73f]">
              50M+
            </p>
            <p className="text-[11px] font-mono text-slate-400 uppercase tracking-wider mt-1">
              Organic Reach
            </p>
          </div>

          <div className="pt-2 md:pt-0 md:px-4">
            <p className="font-panchang font-black text-2xl sm:text-3xl text-white">
              100+
            </p>
            <p className="text-[11px] font-mono text-slate-400 uppercase tracking-wider mt-1">
              Brands Scaled
            </p>
          </div>

          <div className="pt-2 md:pt-0 md:px-4">
            <p className="font-panchang font-black text-2xl sm:text-3xl text-emerald-400">
              2-3 Wks
            </p>
            <p className="text-[11px] font-mono text-slate-400 uppercase tracking-wider mt-1">
              Rapid Delivery
            </p>
          </div>

          <div className="pt-2 md:pt-0 md:px-4">
            <p className="font-panchang font-black text-2xl sm:text-3xl text-cyan-400">
              Top 1%
            </p>
            <p className="text-[11px] font-mono text-slate-400 uppercase tracking-wider mt-1">
              Design Standard
            </p>
          </div>

        </div>
      </motion.div>

      {/* Scroll indicator */}
      <div className="mt-8 flex flex-col items-center gap-1 text-white/30 text-xs font-mono">
        <span>Scroll to Explore Niches</span>
        <ChevronDown className="w-4 h-4 animate-bounce" />
      </div>

    </section>
  );
}
