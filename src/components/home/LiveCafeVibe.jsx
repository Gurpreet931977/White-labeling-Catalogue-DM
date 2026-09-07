import React from 'react';
import { motion } from 'framer-motion';
import { Users, Music, Coffee, CheckCircle2, Clock, Sparkles, Flame } from 'lucide-react';
import { BRAND_CONFIG } from '../../data/cafeConfig';

const MARQUEE_ITEMS = [
  "CAFFÈ SPECIALITÀ",
  "PASTA FATTA A MANO",
  "APERITIVO RITUAL",
  "FORNO A LEGNA",
  "DOLCI ARTIGIANALI",
  "VINO NATURALE",
  "MILANO ENERGY"
];

export function LiveCafeVibe() {
  const totalTables = BRAND_CONFIG.tables.length || 12;
  const activeTables = Math.min(8, totalTables);
  const freeTables = Math.max(1, totalTables - activeTables);

  const renderRibbon = (keyPrefix) => (
    <div key={keyPrefix} className="flex items-center gap-8 shrink-0 pr-8">
      {MARQUEE_ITEMS.map((item, idx) => (
        <div key={`${keyPrefix}-${idx}`} className="flex items-center gap-8 shrink-0">
          <span className="font-syne font-black text-sm sm:text-base tracking-[0.25em] text-white uppercase">
            {item}
          </span>
          <span className="w-1.5 h-1.5 rounded-full bg-[#D04834]" />
        </div>
      ))}
    </div>
  );

  return (
    <section className="relative bg-[#161210] border-y border-white/10 overflow-hidden">
      
      {/* 1. Continuous Kinetic Typographic Loop */}
      <div className="bg-[#0D0B0A] py-3.5 sm:py-4 border-b border-white/10 overflow-hidden select-none">
        <div className="animate-marquee-smooth">
          {renderRibbon('ribbon-1')}
          {renderRibbon('ribbon-2')}
        </div>
      </div>

      {/* 2. Brand Manifesto: "The Ritual, Not Just Food" */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 relative">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
          
          {/* Left: Manifesto Statement & Philosophy */}
          <div className="lg:col-span-7 space-y-6 text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-white/5 border border-white/10 text-xs font-mono text-stone-300 uppercase tracking-widest">
              <Sparkles className="w-3 h-3 text-[#E8E439]" />
              <span>THE BRAND MANIFESTO // 001</span>
            </div>

            <h2 className="text-3xl sm:text-5xl font-bold text-white tracking-tight leading-[1.1]">
              <span className="font-editorial block">It's not just Italian food.</span>
              <span className="font-editorial-italic text-[#FAF7F2] font-black block">
                It's the ritual around it.
              </span>
            </h2>

            <p className="text-stone-300 text-sm sm:text-base leading-relaxed max-w-xl font-normal">
              From 48-hour slow-fermented Neapolitan dough kissed by wood flame to single-origin Arabica roasts extracted with millimetric pressure. We believe in lingering over good conversations, the clatter of porcelain at aperitivo hour, and unhurried meals that turn into late nights.
            </p>

            {/* Live Atmosphere Capsules */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
              
              {/* Capsule 1: Live Seating Status */}
              <div className="p-4 rounded-2xl bg-[#1C1815] border border-white/10 flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
                  <Users className="w-4 h-4" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="text-xs font-bold text-white font-syne">{activeTables} of {totalTables} Tables Active</span>
                  </div>
                  <p className="text-[11px] text-stone-400 font-mono mt-0.5">
                    {freeTables} seats available • Scan table QR for instant dining
                  </p>
                </div>
              </div>

              {/* Capsule 2: Live Cafe Music Vibe */}
              <div className="p-4 rounded-2xl bg-[#1C1815] border border-white/10 flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-[#E8E439]/10 border border-[#E8E439]/30 flex items-center justify-center text-[#E8E439] shrink-0">
                  <Music className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs font-bold text-white font-syne">Curated Lo-Fi & Jazz</p>
                  <p className="text-[11px] text-stone-400 font-mono mt-0.5">
                    {BRAND_CONFIG.shortName} lounge acoustics • Chill ambient beats
                  </p>
                </div>
              </div>

            </div>
          </div>

          {/* Right: Fashion-Editorial Image Diptych with Offset Stacking */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              
              {/* Main Photo: Handcrafted Artisan Pizza Peel */}
              <div className="relative aspect-[3/4] rounded-3xl overflow-hidden bg-stone-900 border border-white/15 shadow-2xl">
                <img
                  src="https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=800&q=80"
                  alt="Artisan Pizza in Wood-Fired Oven"
                  className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#12100E] via-transparent to-transparent opacity-80" />

                <div className="absolute bottom-4 left-4 right-4">
                  <p className="text-[10px] font-mono text-[#E8E439] uppercase tracking-widest">
                    ARCHIVE // SHOT 04
                  </p>
                  <p className="font-editorial text-lg font-bold text-white">
                    Wood, Flour, Fire & Time.
                  </p>
                </div>
              </div>

              {/* Secondary Floating Overlapping Photo: Espresso Pull */}
              <motion.div
                whileHover={{ scale: 1.03 }}
                className="absolute -bottom-6 -left-6 sm:-bottom-8 sm:-left-8 w-44 sm:w-52 aspect-square rounded-2xl overflow-hidden border-2 border-[#FAF7F2] shadow-2xl hidden sm:block bg-stone-950"
              >
                <img
                  src="https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=600&q=80"
                  alt="Espresso Extraction"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/20" />
                <div className="absolute bottom-2 left-2.5 right-2.5">
                  <span className="text-[9px] font-mono tracking-wider text-[#FAF7F2] uppercase font-bold bg-[#12100E]/80 px-2 py-0.5 rounded">
                    SINGLE-ORIGIN ROAST
                  </span>
                </div>
              </motion.div>

            </div>
          </div>

        </div>
      </div>

    </section>
  );
}
