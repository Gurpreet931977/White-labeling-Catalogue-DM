import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, 
  ArrowUpRight, 
  Crown, 
  Coffee, 
  CheckCircle2, 
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

export function CafeVariantsPage({ onBackToCatalogue, onLaunchTHCDemo, onLaunchLoyaltyApp }) {
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
    <div className="min-h-screen bg-[#080808] text-white selection:bg-[#ebd73f] selection:text-black font-sans relative overflow-x-hidden">
      
      {/* Top Header Navigation */}
      <header className="sticky top-0 inset-x-0 z-40 bg-[#080808]/95 backdrop-blur-xl border-b border-white/10 py-3.5 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                sounds.playClick();
                onBackToCatalogue();
              }}
              className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 hover:bg-[#ebd73f] hover:text-black font-clash font-semibold text-xs transition cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Master Catalogue</span>
            </button>

            <span className="hidden md:inline-block text-white/20">•</span>
            <span className="hidden md:inline-flex items-center gap-1.5 font-mono text-[11px] text-[#ebd73f]">
              <span>CAFE &amp; RESTAURANT ARCHITECTURES</span>
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                sounds.playClick();
                setIsQuoteOpen(true);
              }}
              className="btn-dripp-primary px-4 py-2 text-xs font-bold flex items-center gap-1.5 shadow-lg cursor-pointer"
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
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/[0.04] border border-white/10 text-xs font-mono text-[#ebd73f]">
          <Utensils className="w-3.5 h-3.5" />
          <span>DRIPP MEDIA // WHITE-LABEL SUITE</span>
        </div>

        <h1 className="font-panchang font-black text-3xl sm:text-5xl md:text-6xl text-white tracking-tight leading-tight">
          Choose Your <span className="text-[#ebd73f]">Cafe Architecture</span>.
        </h1>

        <p className="max-w-2xl mx-auto text-sm sm:text-base text-slate-300 font-clash leading-relaxed">
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
                className={`flex items-center gap-2 px-4 py-2.5 rounded-full text-xs font-clash font-semibold transition-all duration-200 cursor-pointer ${
                  isSelected
                    ? 'bg-[#ebd73f] text-black shadow-glow-yellow scale-105 font-bold ring-2 ring-[#ebd73f]/50'
                    : 'bg-[#121212] hover:bg-[#1c1c1c] text-white/70 hover:text-white border border-white/10 hover:border-white/20 hover:scale-[1.02]'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 transition-colors ${isSelected ? 'text-black' : 'text-[#ebd73f]'}`} />
                <span>{f.label}</span>
              </button>
            );
          })}
        </div>
      </section>

      {/* Grid of 6 Archetype Cards */}
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
                className="group relative rounded-3xl overflow-hidden dripp-card-bg border border-white/10 hover:border-[#ebd73f]/50 transition-all duration-500 flex flex-col justify-between shadow-2xl hover:shadow-[0_20px_50px_rgba(0,0,0,0.9)]"
              >
                <div className="p-6 pb-0 space-y-4">
                  
                  {/* Card Header */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-[#ebd73f] tracking-wider whitespace-nowrap">
                          {item.code}
                        </span>
                        <span className="w-1.5 h-1.5 rounded-full bg-[#ebd73f]/60 animate-pulse"></span>
                      </div>

                      <span className="text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full border bg-white/5 text-white/90 border-white/15 shrink-0 whitespace-nowrap">
                        {item.badge}
                      </span>
                    </div>

                    <div className="text-[11px] font-mono text-slate-400 uppercase tracking-wide truncate">
                      {item.type}
                    </div>
                  </div>

                  {/* Mockup Preview Window */}
                  <div className="relative rounded-2xl overflow-hidden bg-black/60 border border-white/10 aspect-[16/9] group-hover:border-white/25 transition-all">
                    <div className="absolute top-0 inset-x-0 h-7 bg-white/[0.04] border-b border-white/10 backdrop-blur-md px-3 flex items-center justify-between z-10 font-mono text-[9px] text-white/50">
                      <div className="flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-white/20"></span>
                        <span className="w-2 h-2 rounded-full bg-white/20"></span>
                        <span className="w-2 h-2 rounded-full bg-[#ebd73f]/60"></span>
                      </div>
                      <span className="truncate max-w-[140px]">{item.modelName}</span>
                      <span className="text-[#ebd73f]">{item.metrics.speed}</span>
                    </div>

                    <img 
                      src={item.previewImage} 
                      alt={item.title} 
                      className="w-full h-full object-cover pt-7 opacity-80 group-hover:scale-105 transition-transform duration-700"
                    />

                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent"></div>

                    {/* In-Card KPI Pills */}
                    <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-[10px] font-mono">
                      <div className="px-2.5 py-1 rounded-xl bg-black/85 backdrop-blur-md border border-white/10 text-slate-300">
                        {item.metrics.turnover}
                      </div>
                      <div className="px-2.5 py-1 rounded-xl bg-black/85 backdrop-blur-md border border-white/10 text-[#ebd73f] font-bold">
                        {item.metrics.accuracy}
                      </div>
                    </div>
                  </div>

                  {/* Card Title & Desc */}
                  <div>
                    <h3 className="font-panchang font-bold text-lg text-white group-hover:text-[#ebd73f] transition-colors leading-snug">
                      {item.title}
                    </h3>
                    <p className="text-[11px] font-mono text-[#ebd73f] mt-1 line-clamp-1">
                      Target: {item.idealFor}
                    </p>
                    <p className="text-xs text-slate-300/80 font-clash mt-2 leading-relaxed line-clamp-3">
                      {item.description}
                    </p>
                  </div>

                  {/* Feature Bullets */}
                  <div className="pt-2 border-t border-white/10 space-y-1.5 font-clash">
                    {item.features.slice(0, 3).map((f, fIdx) => (
                      <div key={fIdx} className="flex items-start gap-2 text-[11px] text-slate-300/80">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#ebd73f] shrink-0 mt-0.5" />
                        <span className="line-clamp-1">{f}</span>
                      </div>
                    ))}
                  </div>

                </div>

                {/* Card Action Buttons: Simulator Preview + Live Launch */}
                <div className="p-6 pt-4 grid grid-cols-2 gap-2">
                  <button
                    onClick={() => {
                      sounds.playClick();
                      setSelectedVariantModal(item);
                    }}
                    className="py-2.5 px-3 rounded-xl bg-white/5 hover:bg-white/10 text-white font-clash text-xs font-semibold flex items-center justify-center gap-1.5 transition border border-white/10 cursor-pointer"
                  >
                    <Crown className="w-3.5 h-3.5 text-[#ebd73f]" />
                    <span>Simulator</span>
                  </button>

                  <button
                    onClick={() => {
                      sounds.playClick();
                      localStorage.setItem('thc_operational_model', item.id);
                      window.dispatchEvent(new CustomEvent('thc_model_change', { detail: { model: item.id } }));
                      if (item.id === 'gamified-loyalty') {
                        if (onLaunchLoyaltyApp) onLaunchLoyaltyApp();
                        else onLaunchTHCDemo();
                      } else {
                        onLaunchTHCDemo();
                      }
                    }}
                    className="btn-dripp-primary py-2.5 px-3 text-xs font-bold flex items-center justify-center gap-1 cursor-pointer shadow-xl"
                  >
                    <span className="auth-shimmer-sweep"></span>
                    <span>Launch</span>
                    <ArrowUpRight className="w-3.5 h-3.5 text-black" />
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
