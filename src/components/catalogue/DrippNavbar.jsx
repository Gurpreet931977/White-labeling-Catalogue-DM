import React, { useState, useEffect } from 'react';
import { 
  Terminal, 
  Sparkles, 
  ArrowUpRight, 
  Menu, 
  X, 
  Cpu, 
  Coffee, 
  SlidersHorizontal,
  PhoneCall
} from 'lucide-react';
import { sounds } from '../../utils/audio';

export function DrippNavbar({ 
  isDevMode, 
  setIsDevMode, 
  onLaunchCafeDemo, 
  onOpenCustomizer,
  onOpenQuote 
}) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`fixed top-0 inset-x-0 z-40 transition-all duration-300 ${
      isScrolled 
        ? 'bg-[#080808]/90 backdrop-blur-xl border-b border-white/10 shadow-2xl shadow-black/80 py-3' 
        : 'bg-transparent py-5'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between">
        
        {/* Brand Logo */}
        <div className="flex items-center gap-3">
          <a 
            href="#hero" 
            className="group flex items-center gap-2"
            onClick={() => sounds.playClick()}
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#ebd73f] to-[#b39e14] text-black font-black font-panchang flex items-center justify-center text-sm shadow-lg shadow-[#ebd73f]/20 group-hover:scale-105 transition">
              D
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-panchang font-bold text-lg tracking-wider text-white group-hover:text-[#ebd73f] transition">
                  DRIPP
                </span>
                <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-white/10 text-white/80 border border-white/10">
                  MEDIA
                </span>
              </div>
              <p className="text-[9px] font-mono tracking-widest text-[#ebd73f] -mt-0.5">
                WHITE-LABEL SUITE
              </p>
            </div>
          </a>
        </div>

        {/* Desktop Nav Links */}
        <nav className="hidden lg:flex items-center gap-7 text-xs font-clash font-medium text-white/70">
          <a 
            href="#niches" 
            className="hover:text-white transition flex items-center gap-1"
            onClick={() => sounds.playClick()}
          >
            <span className="text-[#ebd73f] font-mono text-[10px]">01/</span>
            <span>Niches &amp; Catalog</span>
          </a>

          <button
            onClick={() => {
              sounds.playClick();
              onLaunchCafeDemo();
            }}
            className="hover:text-amber-400 text-amber-300 font-semibold transition flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-400/10 border border-amber-400/20"
          >
            <Coffee className="w-3.5 h-3.5 animate-bounce text-amber-400" />
            <span>Active Cafe Demo</span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
          </button>

          <button 
            onClick={() => {
              sounds.playClick();
              onOpenCustomizer();
            }} 
            className="hover:text-white transition flex items-center gap-1"
          >
            <SlidersHorizontal className="w-3.5 h-3.5 text-[#ebd73f]" />
            <span>Brand Simulator</span>
          </button>

          <a 
            href="#developer-specs" 
            className="hover:text-white transition flex items-center gap-1"
            onClick={() => sounds.playClick()}
          >
            <span className="text-[#ebd73f] font-mono text-[10px]">02/</span>
            <span>Architecture</span>
          </a>
        </nav>

        {/* Action Controls */}
        <div className="flex items-center gap-3">
          
          {/* Developer Mode Switch */}
          <button
            onClick={() => {
              sounds.playClick();
              setIsDevMode(!isDevMode);
            }}
            className={`hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-mono transition-all ${
              isDevMode 
                ? 'bg-[#ebd73f]/15 border-[#ebd73f] text-[#ebd73f] shadow-glow-yellow' 
                : 'bg-white/5 border-white/10 text-white/60 hover:text-white hover:border-white/25'
            }`}
            title="Toggle Developer HUD Inspection Mode"
          >
            <Cpu className={`w-3.5 h-3.5 ${isDevMode ? 'animate-spin text-[#ebd73f]' : ''}`} />
            <span className="font-semibold text-[11px]">
              {isDevMode ? 'SYS.DEV // ON' : 'DEV MODE'}
            </span>
            <span className={`w-2 h-2 rounded-full ${isDevMode ? 'bg-[#ebd73f] animate-ping' : 'bg-white/30'}`}></span>
          </button>

          {/* Let's Talk / Quote CTA */}
          <button
            onClick={() => {
              sounds.playClick();
              onOpenQuote();
            }}
            className="btn-dripp-primary px-4 py-2 text-xs flex items-center gap-1.5 font-bold shadow-lg"
          >
            <span className="auth-shimmer-sweep"></span>
            <span>Get Quote</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-xl bg-white/5 border border-white/10 text-white hover:bg-white/10 transition"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden mt-3 px-4 py-5 bg-[#0a0a0a]/95 border-b border-white/10 backdrop-blur-2xl space-y-4">
          <div className="flex flex-col gap-3 font-clash text-sm">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onLaunchCafeDemo();
              }}
              className="flex items-center justify-between p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 font-bold"
            >
              <div className="flex items-center gap-2">
                <Coffee className="w-4 h-4 text-amber-400" />
                <span>Launch Live Cafe Demo</span>
              </div>
              <span className="text-[10px] font-mono bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded">
                LIVE
              </span>
            </button>

            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenCustomizer();
              }}
              className="flex items-center gap-2 p-3 rounded-xl bg-white/5 border border-white/10 text-white font-medium"
            >
              <SlidersHorizontal className="w-4 h-4 text-[#ebd73f]" />
              <span>Interactive Brand Simulator</span>
            </button>

            <button
              onClick={() => {
                setIsDevMode(!isDevMode);
                setMobileMenuOpen(false);
              }}
              className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/10 text-white font-mono text-xs"
            >
              <span className="flex items-center gap-2">
                <Cpu className="w-4 h-4 text-[#ebd73f]" />
                <span>Developer HUD Inspection</span>
              </span>
              <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                isDevMode ? 'bg-[#ebd73f] text-black' : 'bg-white/10 text-white/60'
              }`}>
                {isDevMode ? 'ACTIVE' : 'OFF'}
              </span>
            </button>

            <a
              href="#niches"
              onClick={() => setMobileMenuOpen(false)}
              className="p-3 text-white/80 hover:text-white transition"
            >
              Browse All Niches &amp; Catalogs
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
