import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sparkles, 
  ArrowRight, 
  SlidersHorizontal, 
  Terminal, 
  LayoutGrid,
  Wand2,
  Code2
} from 'lucide-react';
import { CATALOGUE_DATA } from '../data/catalogueData';
import { DrippNavbar } from '../components/catalogue/DrippNavbar';
import { DrippHero } from '../components/catalogue/DrippHero';
import { NicheFilterTabs } from '../components/catalogue/NicheFilterTabs';
import { NicheShowcaseCard } from '../components/catalogue/NicheShowcaseCard';
import { BrandCustomizerModal } from '../components/catalogue/BrandCustomizerModal';
import { InteractiveDemoModal } from '../components/catalogue/InteractiveDemoModal';
import { DeveloperModeHUD } from '../components/catalogue/DeveloperModeHUD';
import { InstantQuoteDrawer } from '../components/catalogue/InstantQuoteDrawer';
import { DrippFooter } from '../components/catalogue/DrippFooter';
import { sounds } from '../utils/audio';

export function DrippCatalogueApp({ onOpenStudio, onOpenCafeOptions, onLaunchCafeDemo }) {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isDevMode, setIsDevMode] = useState(false); // Default OFF as requested
  const [isCustomizerOpen, setIsCustomizerOpen] = useState(false);
  const [isQuoteOpen, setIsQuoteOpen] = useState(false);
  const [selectedDemoNiche, setSelectedDemoNiche] = useState(null);
  const [quoteInitialBrand, setQuoteInitialBrand] = useState(null);

  // Filter niches based on selected category
  const filteredNiches = selectedCategory === 'all'
    ? CATALOGUE_DATA.niches
    : CATALOGUE_DATA.niches.filter((n) => n.category === selectedCategory);

  const handleOpenSpecs = (niche) => {
    setSelectedDemoNiche(niche);
  };

  const handleOpenQuoteWithBrand = (brandData) => {
    setQuoteInitialBrand(brandData);
    setIsQuoteOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#080808] text-white selection:bg-[#ebd73f] selection:text-black font-sans relative overflow-x-hidden">
      
      {/* Top Navigation */}
      <DrippNavbar
        isDevMode={isDevMode}
        setIsDevMode={setIsDevMode}
        onOpenStudio={onOpenStudio}
        onOpenCafeOptions={onOpenCafeOptions}
        onOpenQuote={() => setIsQuoteOpen(true)}
      />

      {/* Hero Section */}
      <DrippHero
        onOpenStudio={onOpenStudio}
        onOpenCustomizer={() => setIsCustomizerOpen(true)}
        onOpenQuote={() => setIsQuoteOpen(true)}
      />

      {/* Niche Filter & Showcase Section */}
      <section id="niches" className="py-16 px-4 sm:px-6 max-w-7xl mx-auto space-y-10">
        
        {/* Section Heading */}
        <div className="text-center space-y-3 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-mono text-[#ebd73f]">
            <Sparkles className="w-3.5 h-3.5" />
            <span>01 / WHITE-LABEL CATALOGUE</span>
          </div>
          <h2 className="font-panchang font-black text-3xl sm:text-4xl md:text-5xl tracking-tight text-white">
            Engineered for High-Conversion Niches.
          </h2>
          <p className="text-sm sm:text-base text-slate-400 font-clash">
            Each turnkey suite is architected with contactless reservation flows, custom branding engines, and sub-second load performance.
          </p>
        </div>

        {/* Category Tabs */}
        <NicheFilterTabs
          categories={CATALOGUE_DATA.categories}
          selectedCategory={selectedCategory}
          onSelectCategory={(id) => setSelectedCategory(id)}
        />

        {/* Niche Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-4">
          <AnimatePresence>
            {filteredNiches.map((niche) => (
              <NicheShowcaseCard
                key={niche.id}
                niche={niche}
                onLaunchLive={onLaunchCafeDemo}
                onOpenCafeOptions={onOpenCafeOptions}
                onOpenDemo={(item) => setSelectedDemoNiche(item)}
                onOpenSpecs={handleOpenSpecs}
              />
            ))}
          </AnimatePresence>
        </div>

      </section>

      {/* Advanced White-Label Studio & Editor Banner */}
      <section className="py-16 px-4 sm:px-6 max-w-7xl mx-auto">
        <div className="relative rounded-3xl p-8 sm:p-12 overflow-hidden bg-gradient-to-br from-[#121212] via-[#0d0d0d] to-[#080808] border border-white/15 shadow-2xl">
          
          <div className="absolute top-0 right-0 w-96 h-96 ambient-glow-yellow blur-3xl opacity-20 pointer-events-none"></div>

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            <div className="lg:col-span-8 space-y-4">
              <span className="text-[11px] font-mono px-2.5 py-1 rounded-full bg-[#ebd73f]/20 text-[#ebd73f] font-bold border border-[#ebd73f]/30">
                ADVANCED BRAND STUDIO &amp; CODE GENERATOR
              </span>
              <h3 className="font-panchang font-black text-2xl sm:text-3xl md:text-4xl text-white leading-tight">
                Design, Reskin &amp; Download Full Code Files.
              </h3>
              <p className="text-sm text-slate-300 font-clash max-w-xl leading-relaxed">
                Need to pitch or deploy for a new client? Use our full-page Brand Studio to upload custom logos, select 60-30-10 color palettes with hex codes, test live mobile previews, and download production-ready JSON and Tailwind configuration packages.
              </p>
            </div>

            <div className="lg:col-span-4 flex flex-col gap-3 justify-end">
              <button
                onClick={() => {
                  sounds.playClick();
                  if (onOpenStudio) onOpenStudio();
                }}
                className="btn-dripp-primary py-4 px-6 text-xs font-bold flex items-center justify-center gap-2 cursor-pointer shadow-xl"
              >
                <span className="auth-shimmer-sweep"></span>
                <Wand2 className="w-4 h-4 text-black" />
                <span>Open Brand Studio &amp; Editor</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    sounds.playClick();
                    setIsCustomizerOpen(true);
                  }}
                  className="flex-1 btn-dripp-secondary py-3 px-4 text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer text-center"
                >
                  <SlidersHorizontal className="w-3.5 h-3.5 text-[#ebd73f]" />
                  <span>Quick Simulator</span>
                </button>

                <a
                  href="#niches"
                  onClick={() => sounds.playClick()}
                  className="flex-1 btn-dripp-secondary py-3 px-4 text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer text-center"
                >
                  <LayoutGrid className="w-3.5 h-3.5 text-[#ebd73f]" />
                  <span>All Niches</span>
                </a>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Developer Architecture & Inspection Section */}
      <section id="developer-specs" className="py-16 px-4 sm:px-6 max-w-7xl mx-auto space-y-8">
        
        <div className="text-center space-y-2 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-mono text-[#ebd73f]">
            <Terminal className="w-3.5 h-3.5" />
            <span>02 / ARCHITECTURE &amp; PERFORMANCE</span>
          </div>
          <h2 className="font-panchang font-bold text-2xl sm:text-3xl text-white">
            Single-File White-Label Architecture.
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 font-clash">
            Zero vendor lock-in. 100% customizable configurations, sub-second TTFB, and offline-first state synchronization.
          </p>
        </div>

        {/* Tech Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {CATALOGUE_DATA.developerSpecs.stack.map((item, idx) => (
            <div 
              key={idx} 
              className="p-5 rounded-2xl bg-[#111111] border border-white/10 space-y-2 hover:border-[#ebd73f]/40 transition"
            >
              <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest">
                0{idx + 1} / {item.name}
              </span>
              <p className="font-clash font-bold text-base text-white">{item.tech}</p>
              <div className="flex items-center gap-1.5 text-xs font-mono text-[#ebd73f] pt-1">
                <span>{item.status}</span>
              </div>
            </div>
          ))}
        </div>

      </section>

      {/* Footer */}
      <DrippFooter
        onOpenCustomizer={() => setIsCustomizerOpen(true)}
        onOpenQuote={() => setIsQuoteOpen(true)}
      />

      {/* Interactive Brand Customizer Modal */}
      <BrandCustomizerModal
        isOpen={isCustomizerOpen}
        onClose={() => setIsCustomizerOpen(false)}
        onOpenQuoteWithBrand={handleOpenQuoteWithBrand}
      />

      {/* Interactive Demo Modal for Other Niches */}
      <InteractiveDemoModal
        niche={selectedDemoNiche}
        isOpen={!!selectedDemoNiche}
        onClose={() => setSelectedDemoNiche(null)}
        onOpenQuote={() => setIsQuoteOpen(true)}
      />

      {/* Instant Quote Slide-Over Drawer */}
      <InstantQuoteDrawer
        isOpen={isQuoteOpen}
        onClose={() => setIsQuoteOpen(false)}
        initialBrandData={quoteInitialBrand}
      />

      {/* Developer HUD Persistent Bar (developermodeon) */}
      <DeveloperModeHUD
        isDevMode={isDevMode}
        onCloseDevMode={() => setIsDevMode(false)}
      />

    </div>
  );
}
