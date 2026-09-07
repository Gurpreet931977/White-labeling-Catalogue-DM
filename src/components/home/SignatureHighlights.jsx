import React from 'react';
import { motion } from 'framer-motion';
import { Plus, Clock, ThumbsUp, Flame, ArrowRight, Sparkles, Calendar } from 'lucide-react';
import { MENU_ITEMS } from '../../data/menuData';
import { useCart } from '../../context/CartContext';
import { useTheme } from '../../context/ThemeContext';
import { sounds } from '../../utils/audio';

export function SignatureHighlights({ onSelectItemForCustomize, onExploreAll, onRequireAuth, onOpenReservation }) {
  const { addToCart, operationalModel } = useCart();
  const { isLight } = useTheme();

  // Flagship star dish and 4 orbiting companions
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
    <section className={`py-16 sm:py-28 relative border-b transition-colors duration-300 ${
      isLight ? 'bg-[#FAF7F2] border-black/10 text-[#12100E]' : 'bg-[#12100E] border-white/10 text-[#FAF7F2]'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Editorial Section Header */}
        <div className={`flex flex-col md:flex-row md:items-end justify-between mb-12 sm:mb-16 gap-6 border-b pb-6 text-left transition-colors ${
          isLight ? 'border-black/10' : 'border-white/10'
        }`}>
          <div>
            <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-md border text-xs font-mono uppercase tracking-widest mb-3 ${
              isLight ? 'bg-black/5 border-black/10 text-stone-700' : 'bg-white/5 border-white/10 text-stone-300'
            }`}>
              <Flame className="w-3.5 h-3.5 text-[#D04834]" />
              <span>FEATURED SELECTIONS // 002</span>
            </div>
            
            <h2 className="text-3xl sm:text-5xl font-bold tracking-tight">
              <span className={`font-editorial block ${isLight ? 'text-[#12100E]' : 'text-white'}`}>
                The Star Signatures.
              </span>
              <span className={`font-editorial-italic font-black text-2xl sm:text-4xl block mt-1 ${
                isLight ? 'text-[#12100E]' : 'text-[#FAF7F2]'
              }`}>
                Dishes Worth Traveling For.
              </span>
            </h2>
            
            <p className={`text-xs sm:text-sm mt-3 max-w-lg leading-relaxed font-normal ${
              isLight ? 'text-stone-600' : 'text-stone-400'
            }`}>
              Slow-stretched pizzas, handcrafted pasta sauces, single-origin espressos, and gourmet desserts made fresh daily.
            </p>
          </div>

          <button
            onClick={() => { sounds.playClick(); onExploreAll(); }}
            className={`inline-flex items-center gap-2 text-xs font-mono tracking-wider uppercase font-bold transition group self-start md:self-auto border px-4 py-2.5 rounded-xl cursor-pointer ${
              isLight
                ? 'bg-[#EAE4D9] hover:bg-[#DFD8CC] text-[#12100E] border-black/15'
                : 'bg-white/5 hover:bg-white/10 text-[#FAF7F2] border-white/15'
            }`}
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
              className={`rounded-3xl overflow-hidden border shadow-2xl p-5 sm:p-7 flex flex-col justify-between group cursor-pointer text-left relative transition-colors ${
                isLight ? 'bg-white border-black/10 shadow-stone-300/40' : 'bg-[#1A1614] border-white/15'
              }`}
            >
              {/* Top Lookbook Tag */}
              <div className={`flex items-center justify-between pb-4 border-b text-[10px] font-mono tracking-widest uppercase ${
                isLight ? 'border-black/10 text-stone-500' : 'border-white/10 text-stone-400'
              }`}>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#D04834]" />
                  <span className={`font-bold ${isLight ? 'text-[#12100E]' : 'text-[#FAF7F2]'}`}>
                    FEATURED // CHEF'S SPECIAL
                  </span>
                </div>
                <span className="text-[#D04834] font-bold">PREP: {starDish.prepTime}</span>
              </div>

              {/* Huge Photo Spread */}
              <div className="relative aspect-[16/10] w-full rounded-2xl overflow-hidden my-5 bg-stone-950">
                <img
                  src={starDish.image}
                  alt={starDish.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-80" />

                {/* Diet Badge */}
                <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-[#12100E]/85 backdrop-blur-md border border-white/15 text-[10px] font-mono tracking-wider text-emerald-400 font-bold flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  <span>VEG // 100% ARTISAN</span>
                </div>

                {/* Price Tag */}
                <div className={`absolute bottom-3 right-3 px-4 py-2 rounded-xl font-number font-bold text-base shadow-xl ${
                  isLight ? 'bg-[#12100E] text-[#FAF7F2]' : 'bg-[#FAF7F2] text-[#12100E]'
                }`}>
                  ₹{starDish.price}
                </div>
              </div>

              {/* Star Dish Narrative */}
              <div className="space-y-2">
                <div className="flex items-baseline justify-between gap-2">
                  <h3 className={`font-editorial text-2xl sm:text-3xl font-bold tracking-tight transition-colors ${
                    isLight ? 'text-[#12100E]' : 'text-white'
                  }`}>
                    {starDish.name}
                  </h3>
                </div>

                <p className={`text-xs sm:text-sm leading-relaxed font-normal ${
                  isLight ? 'text-stone-600' : 'text-stone-300'
                }`}>
                  {starDish.description}
                </p>

                <p className={`text-[11px] font-mono pt-1 ${
                  isLight ? 'text-stone-500' : 'text-stone-400'
                }`}>
                  Ingredients: San Marzano D.O.P., Fior di Latte Mozzarella, Ligurian Sweet Basil & Extra Virgin Olive Oil.
                </p>
              </div>

              {/* Action Footer */}
              <div className={`pt-6 mt-6 border-t flex items-center justify-between transition-colors ${
                isLight ? 'border-black/10' : 'border-white/10'
              }`}>
                <div className={`flex items-center gap-1.5 text-xs font-mono ${
                  isLight ? 'text-stone-600' : 'text-stone-300'
                }`}>
                  <ThumbsUp className="w-3.5 h-3.5 text-[#D04834]" />
                  <span>{starDish.rating} Verified Rating</span>
                  <span className="opacity-60 text-[10px]">({starDish.reviews})</span>
                </div>

                <button
                  onClick={(e) => handleAction(e, starDish)}
                  className={`px-5 py-2.5 rounded-xl font-syne font-bold text-xs uppercase tracking-wider flex items-center gap-2 transition cursor-pointer shadow-md ${
                    isLight
                      ? 'bg-[#12100E] text-[#FAF7F2] hover:bg-black'
                      : 'bg-[#FAF7F2] text-[#12100E] hover:bg-[#E8E0D2]'
                  }`}
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
                className={`p-4 rounded-2xl border transition-all flex items-center justify-between gap-4 group cursor-pointer text-left shadow-sm ${
                  isLight
                    ? 'bg-white border-black/10 hover:border-black/25 text-[#12100E]'
                    : 'bg-[#181412] border-white/10 hover:border-white/20 text-[#FAF7F2]'
                }`}
              >
                {/* Square Crop Photo */}
                <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-xl overflow-hidden shrink-0 bg-stone-900 border border-black/10">
                  <img
                    src={dish.image}
                    alt={dish.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-1.5 left-1.5">
                    <span className={`w-2 h-2 rounded-full inline-block ${dish.isVeg ? 'bg-emerald-500' : 'bg-[#D04834]'}`} />
                  </div>
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0 space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[9px] font-mono opacity-60 uppercase tracking-widest">
                      ITEM 0{idx + 2}
                    </span>
                    <span className="opacity-30">•</span>
                    <span className="text-[9px] font-mono opacity-80">{dish.prepTime}</span>
                  </div>

                  <h4 className={`font-editorial text-base sm:text-lg font-bold truncate transition-colors ${
                    isLight ? 'text-[#12100E]' : 'text-white'
                  }`}>
                    {dish.name}
                  </h4>

                  <p className={`text-[11px] line-clamp-1 leading-snug font-normal ${
                    isLight ? 'text-stone-600' : 'text-stone-400'
                  }`}>
                    {dish.description}
                  </p>

                  <div className="flex items-center gap-3 pt-0.5">
                    <span className={`text-sm font-bold font-number tracking-tight ${isLight ? 'text-[#12100E]' : 'text-white'}`}>
                      ₹{dish.price}
                    </span>
                    <span className="text-[11px] font-number text-[#D04834] flex items-center gap-1 font-semibold">
                      <ThumbsUp className="w-3 h-3" />
                      {dish.rating}
                    </span>
                  </div>
                </div>

                {/* 1-Tap Add Action */}
                <button
                  onClick={(e) => handleAction(e, dish)}
                  className={`w-9 h-9 rounded-xl border flex items-center justify-center transition shrink-0 cursor-pointer ${
                    isLight
                      ? 'bg-black/5 hover:bg-[#12100E] hover:text-[#FAF7F2] border-black/10 text-[#12100E]'
                      : 'bg-white/5 hover:bg-[#FAF7F2] hover:text-[#12100E] border-white/10 text-stone-300'
                  }`}
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
