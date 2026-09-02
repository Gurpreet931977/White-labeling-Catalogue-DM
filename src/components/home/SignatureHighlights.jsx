import React from 'react';
import { motion } from 'framer-motion';
import { Plus, Clock, ThumbsUp, Flame, ArrowRight, Lock } from 'lucide-react';
import { MENU_ITEMS } from '../../data/menuData';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { sounds } from '../../utils/audio';

export function SignatureHighlights({ onSelectItemForCustomize, onExploreAll, onRequireAuth }) {
  const { addToCart } = useCart();
  const { isCustomerLoggedIn } = useAuth();
  const bestsellers = MENU_ITEMS.filter(item => item.isBestseller).slice(0, 6);

  const handleAction = (e, item) => {
    e.stopPropagation();
    if (!isCustomerLoggedIn) {
      if (onRequireAuth) onRequireAuth(() => {
        if (item.customizable) {
          onSelectItemForCustomize(item);
        } else {
          addToCart(item, 1);
        }
      });
      return;
    }

    if (item.customizable) {
      onSelectItemForCustomize(item);
    } else {
      addToCart(item, 1);
    }
  };

  return (
    <section className="py-16 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900 border border-white/10 text-slate-300 text-xs font-mono mb-2">
              <Flame className="w-3.5 h-3.5 text-amber-400" />
              <span>Chef's Highway Selection</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-black text-white font-syne tracking-tight">
              Signature Highlights
            </h2>
            <p className="text-slate-400 text-xs sm:text-sm mt-1 max-w-lg">
              Most ordered highway delicacies by road trippers, bikers, and Doon valley foodies.
            </p>
          </div>

          <button
            onClick={() => { sounds.playClick(); onExploreAll(); }}
            className="inline-flex items-center gap-1.5 text-xs font-bold font-syne text-amber-400 hover:text-amber-300 transition group self-start md:self-auto"
          >
            <span>VIEW ALL 24 DISHES</span>
            <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
          </button>
        </div>

        {/* Dishes Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {bestsellers.map((item) => (
            <motion.div
              key={item.id}
              whileHover={{ y: -4 }}
              onClick={(e) => handleAction(e, item)}
              className="rounded-3xl bg-slate-900/90 border border-white/5 hover:border-amber-400/30 transition-all p-4 flex flex-col justify-between group cursor-pointer shadow-sm"
            >
              <div>
                {/* Image Container (Optimized 1:1 Aspect Ratio) */}
                <div className="relative aspect-square w-full rounded-2xl overflow-hidden mb-3.5 bg-slate-950">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent" />

                  {/* Veg / Non-Veg Indicator */}
                  <div className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-md bg-slate-950/80 backdrop-blur-md flex items-center gap-1.5 text-[10px] font-bold">
                    <span
                      className={`w-2 h-2 rounded-full ${
                        item.isVeg ? 'bg-emerald-400' : 'bg-rose-500'
                      }`}
                    />
                    <span className={item.isVeg ? 'text-emerald-400' : 'text-rose-400'}>
                      {item.isVeg ? 'VEG' : 'NON-VEG'}
                    </span>
                  </div>

                  {/* Prep time */}
                  <div className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded-md bg-slate-950/80 backdrop-blur-md text-[10px] font-mono text-slate-300 flex items-center gap-1">
                    <Clock className="w-3 h-3 text-amber-400" />
                    <span>{item.prepTime}</span>
                  </div>

                  {/* Price */}
                  <div className="absolute bottom-2.5 left-3">
                    <span className="text-xl font-bold text-white font-syne">
                      ₹{item.price}
                    </span>
                  </div>
                </div>

                {/* Title & Desc */}
                <div className="space-y-1 mb-3">
                  <h3 className="font-bold text-white text-base font-syne group-hover:text-amber-400 transition line-clamp-1">
                    {item.name}
                  </h3>
                  <p className="text-slate-400 text-xs line-clamp-2 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>

              {/* Action Button Footer */}
              <div className="pt-3 border-t border-white/5 flex items-center justify-between">
                <div className="flex items-center gap-1 text-xs text-amber-400 font-mono font-medium">
                  <ThumbsUp className="w-3.5 h-3.5 text-amber-400" />
                  <span>{item.rating}</span>
                  <span className="text-slate-500 text-[10px]">({item.reviews})</span>
                </div>

                <button
                  onClick={(e) => handleAction(e, item)}
                  className="btn-3d btn-3d-amber px-3.5 py-1.5 rounded-xl font-bold font-syne text-xs flex items-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
                  <span>ADD TO ORDER</span>
                  {!isCustomerLoggedIn && <Lock className="w-3 h-3 ml-0.5 opacity-75" />}
                </button>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
