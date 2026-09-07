import React from 'react';
import { motion } from 'framer-motion';
import { Plus, Clock, ThumbsUp, Flame, ArrowRight, Sparkles, Calendar } from 'lucide-react';
import { MENU_ITEMS } from '../../data/menuData';
import { useCart } from '../../context/CartContext';
import { sounds } from '../../utils/audio';

export function SignatureHighlights({ onSelectItemForCustomize, onExploreAll, onRequireAuth, onOpenReservation }) {
  const { addToCart, operationalModel } = useCart();

  // Pick the flagship star dish and 4 orbiting companions
  const starDish = MENU_ITEMS.find(i => i.id === 'thc-01') || MENU_ITEMS[0];
  const orbitingDishes = MENU_ITEMS.filter(i => ['thc-05', 'thc-17', 'thc-21', 'thc-29'].includes(i.id));

  const handleAction = (e, item) => {
    e.stopPropagation();
    if (operationalModel === 'showcase') {
      sounds.playClick();
      if (onOpenReservation) onOpenReservation();
      else onExploreAll();
      return;
    }

    if (item.customizable) {
      onSelectItemForCustomize(item);
    } else {
      addToCart(item, 1);
    }
  };

  return (
    <section className="py-16 sm:py-28 bg-[#12100E] relative border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Editorial Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 sm:mb-16 gap-6 border-b border-white/10 pb-6 text-left">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-white/5 border border-white/10 text-xs font-mono text-stone-300 uppercase tracking-widest mb-3">
              <Flame className="w-3.5 h-3.5 text-[#D04834]" />
              <span>EDIZIONE SELEZIONATA // 002</span>
            </div>
            
            <h2 className="text-3xl sm:text-5xl font-bold text-white tracking-tight">
              <span className="font-editorial block">The Star Signatures.</span>
              <span className="font-editorial-italic text-[#FAF7F2] font-black text-2xl sm:text-4xl block mt-1">
                Dishes Worth Traveling For.
              </span>
            </h2>
            
            <p className="text-stone-400 text-xs sm:text-sm mt-3 max-w-lg leading-relaxed font-normal">
              Slow-stretched pizzas, handcrafted pasta sauces, single-origin espressos, and authentic Italian dolci made fresh daily.
            </p>
          </div>

          <button
            onClick={() => { sounds.playClick(); onExploreAll(); }}
            className="inline-flex items-center gap-2 text-xs font-mono tracking-wider text-[#FAF7F2] hover:text-[#D04834] uppercase font-bold transition group self-start md:self-auto border border-white/15 px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10"
          >
            <span>DISCOVER ALL 24+ DISHES</span>
            <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
          </button>
        </div>

        {/* Editorial Asymmetric Spread: 1 Giant Star Feature + 4 Orbiting Dishes */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* STAR HERO DISH (Occupies 7 Columns) */}
          <div className="lg:col-span-7">
            <motion.div
              whileHover={{ y: -4 }}
              onClick={(e) => handleAction(e, starDish)}
              className="rounded-3xl overflow-hidden bg-[#1A1614] border border-white/15 shadow-2xl p-5 sm:p-7 flex flex-col justify-between group cursor-pointer text-left relative"
            >
              {/* Top Lookbook Tag */}
              <div className="flex items-center justify-between pb-4 border-b border-white/10 text-[10px] font-mono tracking-widest text-stone-400 uppercase">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#D04834]" />
                  <span className="text-[#FAF7F2] font-bold">N° 01 // CAPOLAVORO</span>
                </div>
                <span className="text-[#E8E439] font-bold">PREP: {starDish.prepTime}</span>
              </div>

              {/* Huge Photo Spread */}
              <div className="relative aspect-[16/10] w-full rounded-2xl overflow-hidden my-5 bg-stone-950">
                <img
                  src={starDish.image}
                  alt={starDish.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#12100E] via-transparent to-transparent opacity-80" />

                {/* Diet Badge */}
                <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-[#12100E]/85 backdrop-blur-md border border-white/15 text-[10px] font-mono tracking-wider text-emerald-300 font-bold flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  <span>VEG // 100% ARTISAN</span>
                </div>

                {/* Price Tag */}
                <div className="absolute bottom-3 right-3 px-4 py-2 rounded-xl bg-[#FAF7F2] text-[#12100E] font-syne font-black text-base shadow-xl">
                  ₹{starDish.price}
                </div>
              </div>

              {/* Star Dish Narrative */}
              <div className="space-y-2">
                <div className="flex items-baseline justify-between gap-2">
                  <h3 className="font-editorial text-2xl sm:text-3xl font-bold text-white tracking-tight group-hover:text-[#FAF7F2] transition">
                    {starDish.name}
                  </h3>
                </div>

                <p className="text-stone-300 text-xs sm:text-sm leading-relaxed font-normal">
                  {starDish.description}
                </p>

                <p className="text-[11px] font-mono text-stone-400 pt-1">
                  Ingredients: San Marzano D.O.P., Fior di Latte Mozzarella, Ligurian Sweet Basil & Extra Virgin Olive Oil.
                </p>
              </div>

              {/* Action Footer */}
              <div className="pt-6 mt-6 border-t border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-xs font-mono text-stone-300">
                  <ThumbsUp className="w-3.5 h-3.5 text-[#E8E439]" />
                  <span>{starDish.rating} Verified Rating</span>
                  <span className="text-stone-500 text-[10px]">({starDish.reviews})</span>
                </div>

                <button
                  onClick={(e) => handleAction(e, starDish)}
                  className="px-5 py-2.5 rounded-xl bg-[#FAF7F2] text-[#12100E] font-syne font-bold text-xs uppercase tracking-wider flex items-center gap-2 hover:bg-[#E8E0D2] transition group-hover:shadow-md cursor-pointer"
                >
                  {operationalModel === 'showcase' ? (
                    <>
                      <Calendar className="w-3.5 h-3.5" />
                      <span>Reserve Table</span>
                    </>
                  ) : (
                    <>
                      <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
                      <span>{starDish.customizable ? 'Customize & Add' : 'Add to Order'}</span>
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          </div>

          {/* 4 ORBITING DISHES (Occupies 5 Columns - Staggered Editorial List) */}
          <div className="lg:col-span-5 space-y-4">
            {orbitingDishes.map((dish, idx) => (
              <motion.div
                key={dish.id}
                whileHover={{ x: 4 }}
                onClick={(e) => handleAction(e, dish)}
                className="p-4 rounded-2xl bg-[#181412] border border-white/10 hover:border-white/20 transition-all flex items-center justify-between gap-4 group cursor-pointer text-left"
              >
                {/* Square Crop Photo */}
                <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-xl overflow-hidden shrink-0 bg-stone-900 border border-white/10">
                  <img
                    src={dish.image}
                    alt={dish.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-1.5 left-1.5">
                    <span className={`w-2 h-2 rounded-full inline-block ${dish.isVeg ? 'bg-emerald-400' : 'bg-rose-500'}`} />
                  </div>
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0 space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[9px] font-mono text-stone-500 uppercase tracking-widest">
                      N° 0{idx + 2}
                    </span>
                    <span className="text-white/20">•</span>
                    <span className="text-[9px] font-mono text-stone-400">{dish.prepTime}</span>
                  </div>

                  <h4 className="font-editorial text-base sm:text-lg font-bold text-white group-hover:text-[#FAF7F2] transition truncate">
                    {dish.name}
                  </h4>

                  <p className="text-stone-400 text-[11px] line-clamp-1 leading-snug font-normal">
                    {dish.description}
                  </p>

                  <div className="flex items-center gap-3 pt-0.5">
                    <span className="text-xs font-bold text-white font-syne">₹{dish.price}</span>
                    <span className="text-[10px] font-mono text-[#E8E439] flex items-center gap-1">
                      <ThumbsUp className="w-3 h-3" />
                      {dish.rating}
                    </span>
                  </div>
                </div>

                {/* 1-Tap Add Action */}
                <button
                  onClick={(e) => handleAction(e, dish)}
                  className="w-9 h-9 rounded-xl bg-white/5 hover:bg-[#FAF7F2] hover:text-[#12100E] border border-white/10 flex items-center justify-center text-stone-300 transition shrink-0 cursor-pointer"
                  title="Add Item"
                >
                  <Plus className="w-4 h-4 stroke-[2.5]" />
                </button>
              </motion.div>
            ))}
          </div>

        </div>

      </div>
    </section>
  );
}
