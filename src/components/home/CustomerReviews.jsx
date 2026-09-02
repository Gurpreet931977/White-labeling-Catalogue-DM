import React from 'react';
import { motion } from 'framer-motion';
import { Star, Quote, UtensilsCrossed } from 'lucide-react';
import { BRAND_CONFIG } from '../../data/cafeConfig';

export function CustomerReviews() {
  const reviews = BRAND_CONFIG.customerReviews || [];

  return (
    <section className="py-16 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900 border border-white/10 text-slate-300 text-xs font-mono mb-2">
            <Quote className="w-3.5 h-3.5 text-amber-400" />
            <span>{BRAND_CONFIG.rating.tagline}</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-black text-white font-syne tracking-tight">
            Guest Experiences & Reviews
          </h2>
          <p className="text-slate-400 text-xs sm:text-sm mt-1">
            What our guests and diners say about their time at {BRAND_CONFIG.brandName}.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {reviews.map((rev, idx) => (
            <motion.div
              key={idx}
              whileHover={{ y: -4 }}
              className="p-5 sm:p-6 rounded-3xl bg-slate-900/90 border border-white/5 hover:border-white/10 transition-all flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    {[...Array(rev.rating)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <Quote className="w-5 h-5 text-slate-700" />
                </div>

                <p className="text-slate-300 text-xs sm:text-sm leading-relaxed italic">
                  "{rev.review}"
                </p>

                {rev.ordered && (
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-950 text-[11px] font-mono text-amber-300">
                    <UtensilsCrossed className="w-3 h-3 text-amber-400" />
                    <span className="text-slate-400">Ordered:</span>
                    <span className="font-semibold text-white">{rev.ordered}</span>
                  </div>
                )}
              </div>

              {/* Author */}
              <div className="flex items-center gap-3 pt-3 border-t border-white/5">
                <img
                  src={rev.avatar}
                  alt={rev.name}
                  className="w-9 h-9 rounded-full object-cover border border-white/10"
                />
                <div>
                  <h4 className="text-white font-bold text-xs sm:text-sm font-syne">{rev.name}</h4>
                  <p className="text-[10px] text-slate-400 font-mono">{rev.role} • {rev.location}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
