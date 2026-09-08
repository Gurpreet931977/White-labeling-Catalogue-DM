import React from 'react';
import { motion } from 'framer-motion';
import { Users, Music, Coffee, CheckCircle2, Clock, Flame } from 'lucide-react';
import { BRAND_CONFIG } from '../../data/cafeConfig';
import { useTheme } from '../../context/ThemeContext';

const MARQUEE_ITEMS = [
  "SPECIALTY COFFEE",
  "HANDMADE ARTISAN PASTA",
  "WOOD-FIRED PIZZAS",
  "GOURMET DESSERTS",
  "ZERO-WAIT TABLE QR",
  "ORGANIC BREWS",
  "WARM CAFE AMBIENCE"
];

export function LiveCafeVibe() {
  const { isLight } = useTheme();
  const totalTables = BRAND_CONFIG.tables.length || 12;
  const activeTables = Math.min(8, totalTables);
  const freeTables = Math.max(1, totalTables - activeTables);

  const renderRibbon = (keyPrefix) => (
    <div key={keyPrefix} className="flex items-center gap-8 shrink-0 pr-8">
      {MARQUEE_ITEMS.map((item, idx) => (
        <div key={`${keyPrefix}-${idx}`} className="flex items-center gap-8 shrink-0">
          <span className={`font-syne font-black text-sm sm:text-base tracking-[0.25em] uppercase ${
            isLight ? 'text-[#FAF7F2]' : 'text-white'
          }`}>
            {item}
          </span>
          <span className="w-1.5 h-1.5 rounded-full bg-[#D04834]" />
        </div>
      ))}
    </div>
  );

  return (
    <section className={`relative border-y transition-colors duration-300 overflow-hidden ${
      isLight ? 'bg-[#F5F0E6] border-black/10 text-[#12100E]' : 'bg-[#161210] border-white/10 text-[#FAF7F2]'
    }`}>
      
      {/* 1. Continuous Kinetic Typographic Loop */}
      <div className={`py-3.5 sm:py-4 border-b overflow-hidden select-none transition-colors ${
        isLight ? 'bg-[#12100E] border-black/10' : 'bg-[#0D0B0A] border-white/10'
      }`}>
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
            <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-md border text-xs font-mono uppercase tracking-widest ${
              isLight ? 'bg-black/5 border-black/10 text-stone-700' : 'bg-white/5 border-white/10 text-stone-300'
            }`}>
              <Flame className="w-3 h-3 text-[#D04834]" />
              <span>THE BRAND MANIFESTO // 001</span>
            </div>

            <h2 className="text-3xl sm:text-5xl font-bold tracking-tight leading-[1.1]">
              <span className={`font-editorial block transition-colors ${isLight ? 'text-[#12100E]' : 'text-white'}`}>
                It's not just good food.
              </span>
              <span className={`font-editorial-italic font-black block transition-colors ${isLight ? 'text-[#12100E]' : 'text-[#FAF7F2]'}`}>
                It's the warmth around it.
              </span>
            </h2>

            <p className={`text-sm sm:text-base leading-relaxed max-w-xl font-normal transition-colors ${
              isLight ? 'text-stone-600' : 'text-stone-300'
            }`}>
              From slow-fermented wood-fired sourdough crusts to single-origin Arabica roasts extracted with precision. We believe in lingering over good conversations, warm cafe ambience, and unhurried meals that turn into unforgettable memories.
            </p>

            {/* Live Atmosphere Capsules */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
              
              {/* Capsule 1: Live Seating Status */}
              <div className={`p-4 rounded-2xl border flex items-start gap-3.5 transition-colors ${
                isLight ? 'bg-white border-black/10 shadow-sm' : 'bg-[#1C1815] border-white/10'
              }`}>
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-600 shrink-0">
                  <Users className="w-4 h-4" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span className={`text-xs font-bold font-number ${isLight ? 'text-[#12100E]' : 'text-white'}`}>
                      {activeTables} of {totalTables} Tables Active
                    </span>
                  </div>
                  <p className={`text-[11px] font-mono mt-0.5 ${isLight ? 'text-stone-500' : 'text-stone-400'}`}>
                    {freeTables} seats available • Scan table QR for instant dining
                  </p>
                </div>
              </div>

              {/* Capsule 2: Live Cafe Music Vibe */}
              <div className={`p-4 rounded-2xl border flex items-start gap-3.5 transition-colors ${
                isLight ? 'bg-white border-black/10 shadow-sm' : 'bg-[#1C1815] border-white/10'
              }`}>
                <div className="w-10 h-10 rounded-xl bg-[#D04834]/10 border border-[#D04834]/30 flex items-center justify-center text-[#D04834] shrink-0">
                  <Music className="w-4 h-4" />
                </div>
                <div>
                  <p className={`text-xs font-bold font-syne ${isLight ? 'text-[#12100E]' : 'text-white'}`}>
                    Curated Lo-Fi & Jazz
                  </p>
                  <p className={`text-[11px] font-mono mt-0.5 ${isLight ? 'text-stone-500' : 'text-stone-400'}`}>
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
              <div className={`relative aspect-[3/4] rounded-3xl overflow-hidden shadow-2xl border ${
                isLight ? 'bg-stone-100 border-black/10' : 'bg-stone-900 border-white/15'
              }`}>
                <img
                  src="https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=800&q=80"
                  alt="Artisan Pizza in Wood-Fired Oven"
                  className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-80" />

                <div className="absolute bottom-4 left-4 right-4">
                  <p className="text-[10px] font-mono text-[#FAF7F2] uppercase tracking-widest font-bold">
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
                className={`absolute -bottom-6 -left-6 sm:-bottom-8 sm:-left-8 w-44 sm:w-52 aspect-square rounded-2xl overflow-hidden border-2 shadow-2xl hidden sm:block bg-stone-950 ${
                  isLight ? 'border-[#12100E]' : 'border-[#FAF7F2]'
                }`}
              >
                <img
                  src="https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=600&q=80"
                  alt="Espresso Extraction"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/20" />
                <div className="absolute bottom-2 left-2.5 right-2.5">
                  <span className="text-[9px] font-mono tracking-wider text-white uppercase font-bold bg-[#12100E]/80 px-2 py-0.5 rounded">
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
