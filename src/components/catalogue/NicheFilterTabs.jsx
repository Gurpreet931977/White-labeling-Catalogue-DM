import React from 'react';
import { 
  Utensils, 
  Stethoscope, 
  Dumbbell, 
  Wine, 
  Trophy, 
  Sparkles,
  LayoutGrid
} from 'lucide-react';
import { sounds } from '../../utils/audio';

const ICONS = {
  all: LayoutGrid,
  cafes: Utensils,
  clinics: Stethoscope,
  gyms: Dumbbell,
  clubs: Wine,
  turfs: Trophy,
  salons: Sparkles
};

export function NicheFilterTabs({ categories, selectedCategory, onSelectCategory }) {
  return (
    <div className="flex items-center justify-start sm:justify-center overflow-x-auto no-scrollbar gap-2.5 py-3 px-2">
      {categories.map((cat) => {
        const Icon = ICONS[cat.id] || LayoutGrid;
        const isSelected = selectedCategory === cat.id;

        return (
          <button
            key={cat.id}
            onClick={() => {
              sounds.playClick();
              onSelectCategory(cat.id);
            }}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-full text-xs font-clash font-semibold transition-all shrink-0 cursor-pointer ${
              isSelected
                ? 'bg-[#ebd73f] text-black shadow-glow-yellow scale-105'
                : 'bg-[#141414] hover:bg-[#1f1f1f] text-white/70 hover:text-white border border-white/10'
            }`}
          >
            <Icon className={`w-3.5 h-3.5 ${isSelected ? 'text-black' : 'text-[#ebd73f]'}`} />
            <span>{cat.label}</span>
            {cat.isLiveDemo && (
              <span className={`text-[9px] font-mono font-bold px-1.5 py-0.2 rounded-full ${
                isSelected ? 'bg-black text-[#ebd73f]' : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
              }`}>
                LIVE
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
