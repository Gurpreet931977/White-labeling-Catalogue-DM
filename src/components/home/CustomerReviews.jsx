import React from 'react';
import { motion } from 'framer-motion';
import { Star, Quote, UtensilsCrossed, Instagram, ArrowUpRight } from 'lucide-react';
import { BRAND_CONFIG } from '../../data/cafeConfig';

// Curated Fashion Feed Moodboard
const SOCIAL_MOMENTS = [
  {
    image: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=600&q=80",
    caption: "The morning flat white pour",
    tag: "@thccafe"
  },
  {
    image: "https://images.unsplash.com/photo-1551183053-bf91a1d81141?auto=format&fit=crop&w=600&q=80",
    caption: "Truffle Penne & Aperitivo hour",
    tag: "#lavitaservita"
  },
  {
    image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=600&q=80",
    caption: "Table 04 under the warm pendants",
    tag: "Milano Soul"
  },
  {
    image: "https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?auto=format&fit=crop&w=600&q=80",
    caption: "Valrhona dusted Tiramisu slice",
    tag: "Dolce Vita"
  }
];

export function CustomerReviews() {
  const reviews = BRAND_CONFIG.customerReviews || [];

  return (
    <section className="py-16 sm:py-28 bg-[#12100E] border-b border-white/10 relative text-left">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 sm:mb-16 gap-6 border-b border-white/10 pb-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-white/5 border border-white/10 text-xs font-mono text-stone-300 uppercase tracking-widest mb-3">
              <Quote className="w-3.5 h-3.5 text-[#D04834]" />
              <span>GUEST DISPATCHES // 004</span>
            </div>

            <h2 className="text-3xl sm:text-5xl font-bold text-white tracking-tight">
              <span className="font-editorial block">Stories from Table 04.</span>
              <span className="font-editorial-italic text-[#FAF7F2] font-black text-2xl sm:text-4xl block mt-1">
                {BRAND_CONFIG.rating.tagline}
              </span>
            </h2>
          </div>

          <div className="text-left md:text-right font-mono text-xs text-stone-400">
            <p className="text-white font-bold text-base font-syne">{BRAND_CONFIG.rating.reviewsCount}</p>
            <p>Verified Diner Experiences</p>
          </div>
        </div>

        {/* 3 Editorial Press Review Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 mb-20">
          {reviews.map((rev, idx) => (
            <motion.div
              key={idx}
              whileHover={{ y: -4 }}
              className="p-6 sm:p-8 rounded-3xl bg-[#1A1614] border border-white/10 flex flex-col justify-between space-y-6"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    {[...Array(rev.rating)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-[#E8E439] text-[#E8E439]" />
                    ))}
                  </div>
                  <span className="text-[10px] font-mono text-stone-500 uppercase tracking-wider">
                    DISPATCH 0{idx + 1}
                  </span>
                </div>

                <p className="font-editorial text-base sm:text-lg text-stone-200 leading-relaxed italic">
                  "{rev.review}"
                </p>

                {rev.ordered && (
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-black/40 border border-white/5 text-[11px] font-mono text-stone-300">
                    <UtensilsCrossed className="w-3 h-3 text-[#D04834]" />
                    <span className="text-stone-500">Ordered:</span>
                    <span className="text-[#FAF7F2] font-medium">{rev.ordered}</span>
                  </div>
                )}
              </div>

              {/* Author Row */}
              <div className="flex items-center gap-3 pt-4 border-t border-white/10">
                <img
                  src={rev.avatar}
                  alt={rev.name}
                  className="w-10 h-10 rounded-full object-cover border border-white/15"
                />
                <div>
                  <h4 className="font-editorial text-sm font-bold text-white">{rev.name}</h4>
                  <p className="text-[10px] text-stone-400 font-mono">{rev.role} • {rev.location}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Curated Social Feed / Instagram Lookbook */}
        <div className="pt-8 border-t border-white/10">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2 text-xs font-mono text-stone-300 tracking-wider uppercase">
              <Instagram className="w-4 h-4 text-[#D04834]" />
              <span>CURATED FEED // @THCCAFE.MILANO</span>
            </div>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noreferrer"
              className="text-xs font-mono text-stone-400 hover:text-white flex items-center gap-1 transition"
            >
              <span>Follow the Archive</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </a>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {SOCIAL_MOMENTS.map((item, idx) => (
              <div
                key={idx}
                className="relative aspect-square rounded-2xl overflow-hidden group bg-stone-900 border border-white/10"
              >
                <img
                  src={item.image}
                  alt={item.caption}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-4">
                  <span className="text-[10px] font-mono text-[#E8E439] uppercase tracking-wider">{item.tag}</span>
                  <p className="text-xs font-medium text-white">{item.caption}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
