import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Clock, Coffee, Flame, QrCode, Music } from 'lucide-react';
import { BRAND_CONFIG } from '../../data/cafeConfig';
import { useTheme } from '../../context/ThemeContext';

const PHOTO_STORY = [
  {
    title: "The Sourdough Hearth",
    caption: "48h slow-fermented Neapolitan dough baked at 450°C",
    image: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80",
    tag: "WOOD-FIRED OVEN"
  },
  {
    title: "The Extraction Ritual",
    caption: "Single-origin beans roasted and pulled with millimetric precision",
    image: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=800&q=80",
    tag: "SPECIALTY COFFEE"
  },
  {
    title: "The Evening Ambience",
    caption: "Warm pendant glow, acoustic jazz, and unhurried dining",
    image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80",
    tag: "CAFE AMBIENCE"
  }
];

export function CafeExperience() {
  const { isLight } = useTheme();

  return (
    <section className={`py-16 sm:py-28 border-b relative text-left transition-colors duration-300 ${
      isLight ? 'bg-[#F5F0E6] border-black/10 text-[#12100E]' : 'bg-[#161210] border-white/10 text-[#FAF7F2]'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-2xl mb-12 sm:mb-16">
          <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-md border text-xs font-mono uppercase tracking-widest mb-3 ${
            isLight ? 'bg-black/5 border-black/10 text-stone-700' : 'bg-white/5 border-white/10 text-stone-300'
          }`}>
            <Flame className="w-3.5 h-3.5 text-[#D04834]" />
            <span>THE SPACE & CULTURE // 003</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-bold tracking-tight">
            <span className={`font-editorial block ${isLight ? 'text-[#12100E]' : 'text-white'}`}>
              The Ambience.
            </span>
            <span className={`font-editorial-italic font-black text-2xl sm:text-4xl block mt-1 ${
              isLight ? 'text-[#12100E]' : 'text-[#FAF7F2]'
            }`}>
              A Place You Won't Want to Leave.
            </span>
          </h2>

          <p className={`text-xs sm:text-sm mt-3 leading-relaxed font-normal ${
            isLight ? 'text-stone-600' : 'text-stone-400'
          }`}>
            Whether it’s a morning espresso date, remote work with high-speed WiFi, or a vibrant late-night pasta feast—{BRAND_CONFIG.brandName} is built for lingering.
          </p>
        </div>

        {/* Campaign Photo Story Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 mb-16">
          {PHOTO_STORY.map((story, idx) => (
            <motion.div
              key={idx}
              whileHover={{ y: -6 }}
              className={`rounded-3xl overflow-hidden border group flex flex-col justify-between transition-colors ${
                isLight
                  ? 'bg-white border-black/10 shadow-sm'
                  : 'bg-[#1D1815] border-white/10'
              }`}
            >
              <div className="relative aspect-[4/5] overflow-hidden bg-stone-900">
                <img
                  src={story.image}
                  alt={story.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-70" />

                <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-[#12100E]/80 backdrop-blur-md border border-white/10 text-[9px] font-mono tracking-widest text-white uppercase font-bold">
                  {story.tag}
                </div>
              </div>

              <div className="p-5 space-y-1.5 text-left">
                <h3 className={`font-editorial text-lg sm:text-xl font-bold ${
                  isLight ? 'text-[#12100E]' : 'text-white'
                }`}>
                  {story.title}
                </h3>
                <p className={`text-xs leading-relaxed font-normal ${
                  isLight ? 'text-stone-600' : 'text-stone-400'
                }`}>
                  {story.caption}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* 4 Pillars Strip with Clean Editorial Typography */}
        <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pt-10 border-t transition-colors ${
          isLight ? 'border-black/10' : 'border-white/10'
        }`}>
          
          <div className="space-y-2">
            <div className={`w-10 h-10 rounded-xl border flex items-center justify-center text-[#D04834] ${
              isLight ? 'bg-black/5 border-black/10' : 'bg-white/5 border-white/10'
            }`}>
              <Flame className="w-5 h-5" />
            </div>
            <h4 className={`font-editorial text-base font-bold ${isLight ? 'text-[#12100E]' : 'text-white'}`}>
              Handcrafted Kitchen
            </h4>
            <p className={`text-xs leading-relaxed font-normal ${isLight ? 'text-stone-600' : 'text-stone-400'}`}>
              Slow-fermented dough, San Marzano tomatoes, and authentic European butter sauces.
            </p>
          </div>

          <div className="space-y-2">
            <div className={`w-10 h-10 rounded-xl border flex items-center justify-center text-[#D04834] ${
              isLight ? 'bg-black/5 border-black/10' : 'bg-white/5 border-white/10'
            }`}>
              <Coffee className="w-5 h-5" />
            </div>
            <h4 className={`font-editorial text-base font-bold ${isLight ? 'text-[#12100E]' : 'text-white'}`}>
              Specialty Roasts
            </h4>
            <p className={`text-xs leading-relaxed font-normal ${isLight ? 'text-stone-600' : 'text-stone-400'}`}>
              Single-origin Arabica beans roasted with care, silky flat whites, and cold brews.
            </p>
          </div>

          <div className="space-y-2">
            <div className={`w-10 h-10 rounded-xl border flex items-center justify-center text-cyan-600 ${
              isLight ? 'bg-black/5 border-black/10' : 'bg-white/5 border-white/10'
            }`}>
              <QrCode className="w-5 h-5" />
            </div>
            <h4 className={`font-editorial text-base font-bold ${isLight ? 'text-[#12100E]' : 'text-white'}`}>
              Zero-Wait Table Tech
            </h4>
            <p className={`text-xs leading-relaxed font-normal ${isLight ? 'text-stone-600' : 'text-stone-400'}`}>
              Order directly to your seat via table plaque QR, pay via UPI, and track live cooking.
            </p>
          </div>

          <div className="space-y-2">
            <div className={`w-10 h-10 rounded-xl border flex items-center justify-center text-emerald-600 ${
              isLight ? 'bg-black/5 border-black/10' : 'bg-white/5 border-white/10'
            }`}>
              <Music className="w-5 h-5" />
            </div>
            <h4 className={`font-editorial text-base font-bold ${isLight ? 'text-[#12100E]' : 'text-white'}`}>
              Curated Soundscape
            </h4>
            <p className={`text-xs leading-relaxed font-normal ${isLight ? 'text-stone-600' : 'text-stone-400'}`}>
              Acoustic warmth, lo-fi beats, and warm lighting designed for relaxed conversations.
            </p>
          </div>

        </div>

      </div>
    </section>
  );
}

export { CafeExperience as HighwayExperience };
