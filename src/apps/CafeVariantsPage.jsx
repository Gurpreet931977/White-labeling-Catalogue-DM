import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, 
  ArrowUpRight, 
  Crown, 
  Coffee, 
  Check, 
  Sliders, 
  ArrowRight,
  Layers,
  Utensils,
  LayoutGrid,
  QrCode,
  Store,
  Calendar,
  Truck,
  RefreshCw,
  Award
} from 'lucide-react';
import { CAFE_VARIANTS } from '../data/cafeVariantsData';
import { CafeDemoModal } from '../components/catalogue/CafeDemoModal';
import { InstantQuoteDrawer } from '../components/catalogue/InstantQuoteDrawer';
import { DrippFooter } from '../components/catalogue/DrippFooter';
import { sounds } from '../utils/audio';

export function CafeVariantsPage({ onBackToCatalogue, onLaunchTHCDemo, onLaunchLoyaltyApp, onLaunchShowcaseApp, onLaunchSelfServeApp }) {
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [selectedVariantModal, setSelectedVariantModal] = useState(null);
  const [isQuoteOpen, setIsQuoteOpen] = useState(false);

  const filters = [
    { id: 'all', label: 'All 7 Models', icon: LayoutGrid },
    { id: 'Dine-In Table QR & POS', label: 'Table QR Dine-In', icon: QrCode },
    { id: 'Self-Serve & Counter Pickup', label: 'Self-Serve Counter', icon: Store },
    { id: 'Brand Showcase Landing Page', label: 'Showcase Landing', icon: Calendar },
    { id: 'Direct Online Doorstep Delivery', label: 'Doorstep Delivery', icon: Truck },
    { id: 'Hybrid Dine-In & Delivery', label: 'Hybrid Dual-Mode', icon: RefreshCw },
    { id: 'Loyalty Club & Visit Tracker', label: 'Loyalty POS', icon: Award },
    { id: 'Gamified Member Loyalty Pass', label: 'Gamified Loyalty', icon: Crown },
  ];

  const filteredVariants = selectedFilter === 'all'
    ? CAFE_VARIANTS
    : CAFE_VARIANTS.filter((v) => v.type === selectedFilter);

  return (
    <div className="min-h-screen bg-[#0A0908] text-stone-100 selection:bg-[#C5A880] selection:text-[#12100E] font-sans relative overflow-x-hidden">
      
      {/* Top Header Navigation */}
      <header className="sticky top-0 inset-x-0 z-40 bg-[#0A0908]/95 backdrop-blur-xl border-b border-[#221C17] py-3.5 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                sounds.playClick();
                onBackToCatalogue();
              }}
              className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/[0.06] hover:bg-[#C5A880] text-stone-200 hover:text-[#12100E] border border-white/10 hover:border-[#C5A880] font-sans font-medium text-xs transition duration-200 cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Master Catalogue</span>
            </button>

            <span className="hidden md:inline-block text-white/20">•</span>
            <span className="hidden md:inline-flex items-center gap-1.5 font-mono text-[11px] text-[#C5A880]">
              <span>CAFE &amp; RESTAURANT ARCHITECTURES</span>
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                sounds.playClick();
                setIsQuoteOpen(true);
              }}
              className="relative overflow-hidden px-4 py-2 rounded-full bg-gradient-to-r from-[#C5A880] via-[#D8B98C] to-[#C5A880] hover:brightness-110 text-[#12100E] text-xs font-sans font-bold tracking-wide flex items-center gap-1.5 shadow-[0_4px_16px_rgba(197,168,128,0.25)] cursor-pointer transition-all duration-300"
            >
              <span className="auth-shimmer-sweep"></span>
              <span>Get Turnkey Quote</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-16 pb-12 px-4 sm:px-6 text-center max-w-5xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#C5A880]/10 border border-[#C5A880]/30 text-xs font-mono text-[#C5A880]">
          <Utensils className="w-3.5 h-3.5" />
          <span>DRIPP MEDIA // WHITE-LABEL SUITE</span>
        </div>

        <h1 className="font-serif font-bold text-3xl sm:text-5xl md:text-6xl text-[#FAF7F2] tracking-tight leading-tight">
          Choose Your <span className="italic font-normal text-[#C5A880]">Cafe Architecture</span>.
        </h1>

        <p className="max-w-2xl mx-auto text-sm sm:text-base text-stone-300/80 font-sans leading-relaxed">
          Not all cafes operate the same. Select from 7 purpose-built turnkey white-label systems tailored for table QR service, self-serve counter pickups, brand showcase landing pages, direct online delivery, hybrid dining, 7-visit loyalty rewards, or 100% gamified coffee &amp; bakery loyalty passes.
        </p>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-2.5 pt-6 max-w-4xl mx-auto px-2">
          {filters.map((f) => {
            const Icon = f.icon;
            const isSelected = selectedFilter === f.id;
            return (
              <button
                key={f.id}
                onClick={() => {
                  sounds.playClick();
                  setSelectedFilter(f.id);
                }}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-full text-xs font-sans font-medium transition-all duration-200 cursor-pointer ${
                  isSelected
                    ? 'bg-[#C5A880] text-[#12100E] shadow-[0_4px_20px_rgba(197,168,128,0.35)] scale-105 font-bold ring-1 ring-[#FAF7F2]/30'
                    : 'bg-[#151210] hover:bg-[#1E1916] text-stone-300 hover:text-white border border-[#2C241E] hover:border-[#C5A880]/40 hover:scale-[1.02]'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 transition-colors ${isSelected ? 'text-[#12100E]' : 'text-[#C5A880]'}`} />
                <span>{f.label}</span>
              </button>
            );
          })}
        </div>
      </section>

      {/* Grid of 7 Archetype Cards */}
      <section className="pb-24 px-4 sm:px-6 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {filteredVariants.map((item) => (
              <motion.div
                layout
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="group relative rounded-[28px] overflow-hidden bg-gradient-to-b from-[#181512] via-[#14120F] to-[#0E0C0A] border border-[#2B231D] hover:border-[#C5A880]/50 transition-all duration-500 flex flex-col justify-between shadow-[0_12px_40px_rgba(0,0,0,0.65)] hover:shadow-[0_24px_60px_rgba(0,0,0,0.9),0_0_35px_rgba(197,168,128,0.12)] hover:-translate-y-1"
              >
                {/* Top Subtle Specular Light Rim */}
                <div className="pointer-events-none absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-[#C5A880]/30 to-transparent z-20" />
                
                {/* Radial Amber Ambient Hover Bloom */}
                <div className="pointer-events-none absolute -inset-px rounded-[28px] opacity-0 group-hover:opacity-100 transition-opacity duration-700 bg-radial-[at_top_center] from-[#C5A880]/10 via-transparent to-transparent z-0" />

                <div className="p-6 sm:p-7 pb-0 space-y-4 relative z-10">
                  
                  {/* Card Header: Archetype Serial + Status Badge */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2">
                        <span className="relative flex h-2 w-2">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#C5A880] opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-[#C5A880]"></span>
                        </span>
                        <span className="font-mono text-xs font-semibold text-[#C5A880] tracking-[0.18em] uppercase whitespace-nowrap">
                          {item.code}
                        </span>
                      </div>

                      <span className="text-[10px] font-mono font-medium px-2.5 py-0.5 rounded-full bg-[#C5A880]/10 text-[#E6D5B8] border border-[#C5A880]/25 shrink-0 whitespace-nowrap tracking-wider uppercase">
                        {item.badge}
                      </span>
                    </div>

                    <div className="text-[10px] font-mono text-stone-400 tracking-[0.2em] uppercase truncate">
                      {item.type}
                    </div>
                  </div>

                  {/* Mockup Preview Window: Refined Cafe Architecture Display */}
                  <div className="relative rounded-2xl overflow-hidden bg-[#0A0908] border border-[#2B231D] group-hover:border-[#C5A880]/40 transition-all duration-500 aspect-[16/10]">
                    
                    {/* Frosted Glass Window Top Bar */}
                    <div className="absolute top-0 inset-x-0 h-8 bg-[#161311]/90 border-b border-[#2B231D] backdrop-blur-md px-3.5 flex items-center justify-between z-10 font-mono text-[10px]">
                      <div className="flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-stone-700"></span>
                        <span className="w-2 h-2 rounded-full bg-stone-600"></span>
                        <span className="w-2 h-2 rounded-full bg-[#C5A880]/80"></span>
                      </div>
                      <span className="truncate max-w-[140px] text-stone-300 font-medium tracking-wide">
                        {item.modelName}
                      </span>
                      <span className="text-[#C5A880] font-semibold">
                        {item.metrics.speed}
                      </span>
                    </div>

                    {/* Preview Image with Warm Vignette */}
                    <img 
                      src={item.previewImage} 
                      alt={item.title} 
                      className="w-full h-full object-cover pt-8 opacity-85 group-hover:opacity-95 group-hover:scale-105 transition-transform duration-700 ease-out"
                    />

                    <div className="absolute inset-0 bg-gradient-to-t from-[#0E0C0A] via-[#0E0C0A]/35 to-transparent pointer-events-none"></div>

                    {/* In-Card KPI Floating Badges */}
                    <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between gap-2 text-[10px] font-mono pointer-events-none">
                      <div className="px-2.5 py-1.5 rounded-xl bg-[#12100E]/90 backdrop-blur-md border border-white/10 text-stone-300 shadow-md">
                        {item.metrics.turnover}
                      </div>
                      <div className="px-2.5 py-1.5 rounded-xl bg-[#12100E]/90 backdrop-blur-md border border-[#C5A880]/30 text-[#E6D5B8] font-bold shadow-md">
                        {item.metrics.accuracy}
                      </div>
                    </div>
                  </div>

                  {/* Card Title, Venue Suitability & Description */}
                  <div className="space-y-1.5">
                    <h3 className="font-serif text-xl sm:text-[22px] font-semibold text-[#FAF7F2] group-hover:text-[#C5A880] transition-colors duration-300 leading-snug tracking-tight">
                      {item.title}
                    </h3>
                    
                    <div className="flex items-baseline gap-2 pt-0.5">
                      <span className="text-[10px] font-mono tracking-wider font-semibold text-[#C5A880] uppercase shrink-0">
                        SUITED FOR:
                      </span>
                      <span className="text-xs font-sans text-stone-400 line-clamp-1 truncate">
                        {item.idealFor}
                      </span>
                    </div>

                    <p className="text-xs text-stone-300/80 font-sans leading-relaxed line-clamp-3 pt-1">
                      {item.description}
                    </p>
                  </div>

                  {/* Feature Bullets with Luxury Checkmarks */}
                  <div className="pt-3 border-t border-[#26201B] space-y-2 font-sans">
                    {item.features.slice(0, 3).map((f, fIdx) => (
                      <div key={fIdx} className="flex items-start gap-2.5 text-xs text-stone-300/85">
                        <div className="w-4 h-4 rounded-full bg-[#C5A880]/15 border border-[#C5A880]/30 flex items-center justify-center shrink-0 mt-0.5">
                          <Check className="w-2.5 h-2.5 text-[#C5A880] stroke-[2.5]" />
                        </div>
                        <span className="line-clamp-1 leading-snug">{f}</span>
                      </div>
                    ))}
                  </div>

                </div>

                {/* Redesigned Minimal Premium Action Buttons */}
                <div className="p-6 sm:p-7 pt-4 grid grid-cols-2 gap-2.5 relative z-10">
                  <button
                    onClick={() => {
                      sounds.playClick();
                      setSelectedVariantModal(item);
                    }}
                    className="group/btn relative py-3 px-3.5 rounded-xl bg-[#1A1613] hover:bg-[#241F1A] text-stone-200 hover:text-white font-sans text-xs font-semibold tracking-wide flex items-center justify-center gap-2 transition-all duration-300 border border-[#332A22] hover:border-[#C5A880]/50 cursor-pointer shadow-sm active:scale-[0.98]"
                  >
                    <Sliders className="w-3.5 h-3.5 text-[#C5A880] transition-transform duration-300 group-hover/btn:rotate-12" />
                    <span>Simulator</span>
                  </button>

                  <button
                    onClick={() => {
                      sounds.playClick();
                      localStorage.setItem('thc_operational_model', item.id);
                      window.dispatchEvent(new CustomEvent('thc_model_change', { detail: { model: item.id } }));
                      if (item.id === 'self-serve') {
                        if (onLaunchSelfServeApp) onLaunchSelfServeApp();
                        else onLaunchTHCDemo();
                      } else if (item.id === 'gamified-loyalty') {
                        if (onLaunchLoyaltyApp) onLaunchLoyaltyApp();
                        else onLaunchTHCDemo();
                      } else if (item.id === 'showcase') {
                        if (onLaunchShowcaseApp) onLaunchShowcaseApp();
                        else onLaunchTHCDemo();
                      } else {
                        onLaunchTHCDemo();
                      }
                    }}
                    className="group/launch relative overflow-hidden py-3 px-3.5 rounded-xl bg-gradient-to-r from-[#C5A880] via-[#D8B98C] to-[#C5A880] hover:from-[#D4B588] hover:to-[#BFA075] text-[#12100E] font-sans font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 cursor-pointer shadow-[0_4px_20px_rgba(197,168,128,0.25)] hover:shadow-[0_6px_28px_rgba(197,168,128,0.45)] hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] transition-all duration-300"
                  >
                    <span className="auth-shimmer-sweep"></span>
                    <span>Launch</span>
                    <ArrowUpRight className="w-3.5 h-3.5 text-[#12100E] stroke-[2.5] transition-transform duration-300 group-hover/launch:translate-x-0.5 group-hover/launch:-translate-y-0.5" />
                  </button>
                </div>

              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </section>

      {/* Footer */}
      <DrippFooter
        onOpenCustomizer={() => {}}
        onOpenQuote={() => setIsQuoteOpen(true)}
      />

      {/* Interactive Modal for other Cafe archetypes */}
      <CafeDemoModal
        variant={selectedVariantModal}
        isOpen={!!selectedVariantModal}
        onClose={() => setSelectedVariantModal(null)}
        onOpenQuote={() => setIsQuoteOpen(true)}
      />

      {/* Instant Quote Drawer */}
      <InstantQuoteDrawer
        isOpen={isQuoteOpen}
        onClose={() => setIsQuoteOpen(false)}
      />

    </div>
  );
}
