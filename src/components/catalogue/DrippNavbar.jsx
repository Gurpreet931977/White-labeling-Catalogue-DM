import React, { useState, useEffect } from 'react';
import { 
  Terminal, 
  Sparkles, 
  ArrowUpRight, 
  Menu, 
  X, 
  Cpu, 
  SlidersHorizontal,
  LayoutGrid,
  Utensils,
  Wand2
} from 'lucide-react';
import { sounds } from '../../utils/audio';

export function DrippNavbar({ 
  isDevMode, 
  setIsDevMode, 
  onOpenStudio,
  onOpenCafeOptions,
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
        ? 'bg-[#080808]/95 backdrop-blur-xl border-b border-white/10 shadow-2xl shadow-black/90 py-3' 
        : 'bg-transparent py-5'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between">
        
        {/* Brand Logo - Dripp Media Panchang Typography */}
        <div className="flex items-center gap-3">
          <a 
            href="#hero" 
            className="group flex items-center gap-2.5"
            onClick={() => sounds.playClick()}
          >
            <div className="w-9 h-9 rounded-xl bg-[#ebd73f] text-black font-black font-panchang flex items-center justify-center text-sm shadow-lg shadow-[#ebd73f]/25 group-hover:scale-105 transition">
              D
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-panchang font-bold text-lg tracking-wider text-white group-hover:text-[#ebd73f] transition">
                  DRIPP
                </span>
                <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-white/10 text-white/90 border border-white/10">
                  MEDIA
                </span>
              </div>
              <p className="text-[9px] font-mono tracking-widest text-[#ebd73f] -mt-0.5 font-semibold">
                WHITE-LABEL SUITE
              </p>
            </div>
          </a>
        </div>

        {/* Desktop Nav Links - Clean & Executive for Sales Pitches */}
        <nav className="hidden lg:flex items-center gap-6 text-xs font-clash font-medium text-white/80">
          <a 
            href="#niches" 
            className="hover:text-[#ebd73f] transition flex items-center gap-1.5"
            onClick={() => sounds.playClick()}
          >
            <span className="text-[#ebd73f] font-mono text-[10px]">01/</span>
            <span>Niches &amp; Catalogue</span>
          </a>

          <button 
            onClick={() => {
              sounds.playClick();
              if (onOpenCafeOptions) onOpenCafeOptions();
            }} 
            className="hover:text-[#ebd73f] transition flex items-center gap-1.5 cursor-pointer"
          >
            <span className="text-[#ebd73f] font-mono text-[10px]">02/</span>
            <span>Cafe Models (4 Types)</span>
          </button>

          <button 
            onClick={() => {
              sounds.playClick();
              if (onOpenStudio) onOpenStudio();
            }} 
            className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#ebd73f]/10 border border-[#ebd73f]/30 text-[#ebd73f] font-bold transition hover:bg-[#ebd73f] hover:text-black cursor-pointer shadow-sm"
          >
            <Wand2 className="w-3.5 h-3.5" />
            <span>Brand Studio &amp; Editor</span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#ebd73f] animate-pulse"></span>
          </button>

          <a 
            href="#developer-specs" 
            className="hover:text-[#ebd73f] transition flex items-center gap-1.5"
            onClick={() => sounds.playClick()}
          >
            <span className="text-[#ebd73f] font-mono text-[10px]">03/</span>
            <span>Architecture &amp; Stack</span>
          </a>
        </nav>

        {/* Action Controls */}
        <div className="flex items-center gap-3">
          
          {/* Developer Mode Switch (Dripp Yellow / Dark) */}
          <button
            onClick={() => {
              sounds.playClick();
              setIsDevMode(!isDevMode);
            }}
            className={`hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-mono transition-all cursor-pointer ${
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
            className="btn-dripp-primary px-4 py-2 text-xs flex items-center gap-1.5 font-bold shadow-lg cursor-pointer"
          >
            <span className="auth-shimmer-sweep"></span>
            <span>Get Quote</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-xl bg-white/5 border border-white/10 text-white hover:bg-white/10 transition cursor-pointer"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden mt-3 px-4 py-5 bg-[#080808]/98 border-b border-white/10 backdrop-blur-2xl space-y-3 font-clash">
          <a
            href="#niches"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-2.5 p-3 rounded-xl bg-white/[0.04] border border-white/10 text-white hover:text-[#ebd73f] transition text-sm"
          >
            <LayoutGrid className="w-4 h-4 text-[#ebd73f]" />
            <span>01/ Niches &amp; Catalogue</span>
          </a>

          <button
            onClick={() => {
              setMobileMenuOpen(false);
              if (onOpenCafeOptions) onOpenCafeOptions();
            }}
            className="w-full flex items-center gap-2.5 p-3 rounded-xl bg-white/[0.04] border border-white/10 text-white hover:text-[#ebd73f] transition text-sm text-left"
          >
            <Utensils className="w-4 h-4 text-[#ebd73f]" />
            <span>02/ Cafe Models (4 Types)</span>
          </button>

          <button
            onClick={() => {
              setMobileMenuOpen(false);
              if (onOpenStudio) onOpenStudio();
            }}
            className="w-full flex items-center justify-between p-3 rounded-xl bg-[#ebd73f]/15 border border-[#ebd73f] text-[#ebd73f] font-bold text-sm text-left"
          >
            <div className="flex items-center gap-2.5">
              <Wand2 className="w-4 h-4 text-[#ebd73f]" />
              <span>03/ Brand Studio &amp; Editor</span>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#ebd73f] text-black">
              STUDIO
            </span>
          </button>

          <a
            href="#developer-specs"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-2.5 p-3 rounded-xl bg-white/[0.04] border border-white/10 text-white hover:text-[#ebd73f] transition text-sm"
          >
            <Terminal className="w-4 h-4 text-[#ebd73f]" />
            <span>04/ Architecture &amp; Tech Specs</span>
          </a>

          <button
            onClick={() => {
              setIsDevMode(!isDevMode);
              setMobileMenuOpen(false);
            }}
            className="w-full flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/10 text-white font-mono text-xs"
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
        </div>
      )}
    </header>
  );
}
