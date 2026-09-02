import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, 
  ArrowUpRight, 
  Download, 
  Copy, 
  Check, 
  Upload, 
  Smartphone, 
  Laptop, 
  Palette, 
  Type, 
  Code2, 
  Zap, 
  Flame, 
  Sparkles, 
  Compass, 
  Gauge, 
  Crown,
  Trash2,
  Sliders,
  CheckCircle2,
  Terminal,
  Activity
} from 'lucide-react';
import { sounds } from '../utils/audio';

// 6 Creative & Bold Design Styles
export const CRAZY_STYLES = [
  {
    id: "cyber-hud",
    name: "Cyberpunk 2077 HUD",
    shortName: "Cyber HUD",
    icon: Terminal,
    category: "Sci-Fi & Terminal",
    accentGlow: "rgba(235, 215, 63, 0.4)",
    c60: "#06080b",
    c30: "#0c1017",
    c10: "#ebd73f",
    tagline: "Laser scanlines, HUD targeting telemetry & neon terminal buttons"
  },
  {
    id: "neo-brutalist",
    name: "Neo-Brutalism Drop",
    shortName: "Neo-Brutalist",
    icon: Flame,
    category: "Hypebeast & Raw",
    accentGlow: "#ebd73f",
    c60: "#ebd73f",
    c30: "#ffffff",
    c10: "#000000",
    tagline: "Thick 4px black strokes, tilted sticker badges & live marquee ticker"
  },
  {
    id: "liquid-glass",
    name: "Liquid Aura Chrome",
    shortName: "Liquid Glass",
    icon: Sparkles,
    category: "Iridescent & Crystal",
    accentGlow: "rgba(168, 85, 247, 0.4)",
    c60: "#070709",
    c30: "#13131a",
    c10: "#c084fc",
    tagline: "Floating aurora orbs, frosted crystal refraction & glossy depth"
  },
  {
    id: "editorial-luxury",
    name: "Ultra-Luxury Editorial",
    shortName: "Vogue Luxury",
    icon: Crown,
    category: "High-Fashion & Void",
    accentGlow: "rgba(212, 175, 55, 0.3)",
    c60: "#050505",
    c30: "#0f0f0f",
    c10: "#d4af37",
    tagline: "High-fashion Roman numerals, gold leaf borders & generous whitespace"
  },
  {
    id: "pop-candy",
    name: "Y2K Pop Candy",
    shortName: "Bouncy Pop",
    icon: Zap,
    category: "Playful & Cheerful",
    accentGlow: "rgba(244, 63, 94, 0.4)",
    c60: "#0e0914",
    c30: "#1b1226",
    c10: "#f43f5e",
    tagline: "Extra bouncy 36px pill curves, squishy buttons & floating sticker fun"
  },
  {
    id: "high-octane",
    name: "High-Octane Racing",
    shortName: "Carbon Nitro",
    icon: Gauge,
    category: "Motorsport & Speed",
    accentGlow: "rgba(235, 215, 63, 0.5)",
    c60: "#0a0a0a",
    c30: "#161616",
    c10: "#ebd73f",
    tagline: "Carbon fiber weaves, dual racing stripes & aggressive 12-degree speed skews"
  }
];

const NICHES = [
  { id: "cafes", label: "Cafe & Eatery", defaultName: "The Roast & Kitchen", defaultTag: "Gourmet Smash & Cold Brew", item1: "Double Truffle Smash", price1: "349", item2: "Pour-Over Cold Drip", price2: "190" },
  { id: "clinics", label: "Medical & Clinic", defaultName: "AuraCare Specialist", defaultTag: "Advanced Aesthetic Practice", item1: "Cosmetic Consultation", price1: "800", item2: "HydraGlow Therapy", price2: "2,500" },
  { id: "gyms", label: "Gym & CrossFit", defaultName: "Titan Performance Club", defaultTag: "Strength & Conditioning", item1: "Pro Athlete Monthly", price1: "2,499", item2: "1-Day Drop-In Pass", price2: "499" },
  { id: "clubs", label: "Nightclub & VIP", defaultName: "Velvet Sky Lounge", defaultTag: "VIP Tables & Cocktails", item1: "VIP Dancefloor Booth", price1: "20,000", item2: "Guestlist RSVP Pass", price2: "Free" },
  { id: "turfs", label: "Sports Turf", defaultName: "BoxArena Complex", defaultTag: "Hourly Box Football & Cricket", item1: "Prime Evening Slot (1hr)", price1: "1,499", item2: "Morning Saver Slot", price2: "999" },
  { id: "salons", label: "Luxury Salon", defaultName: "Maison de Luxe", defaultTag: "Bespoke Hair & Spa Studio", item1: "Signature Balayage & Glaze", price1: "6,500", item2: "Glass Skin Facial", price2: "3,800" },
];

export function WhiteLabelStudio({ onBackToCatalogue }) {
  // Studio Navigation & Mode
  const [activeTab, setActiveTab] = useState('styles'); // 'styles' | 'brand' | 'colors' | 'export'
  const [selectedStyle, setSelectedStyle] = useState(CRAZY_STYLES[0]);
  const [selectedNiche, setSelectedNiche] = useState(NICHES[0]);
  const [brandName, setBrandName] = useState(NICHES[0].defaultName);
  const [tagline, setTagline] = useState(NICHES[0].defaultTag);
  const [currency, setCurrency] = useState('₹');
  const [deviceView, setDeviceView] = useState('desktop'); // 'desktop' | 'mobile'

  // Colors
  const [color60, setColor60] = useState(CRAZY_STYLES[0].c60);
  const [color30, setColor30] = useState(CRAZY_STYLES[0].c30);
  const [color10, setColor10] = useState(CRAZY_STYLES[0].c10);

  // Logo
  const [logoImage, setLogoImage] = useState(null);
  const fileInputRef = useRef(null);

  // Notifications
  const [copiedToast, setCopiedToast] = useState(null);

  // Select Style Handler
  const handleSelectStyle = (style) => {
    sounds.playClick();
    setSelectedStyle(style);
    setColor60(style.c60);
    setColor30(style.c30);
    setColor10(style.c10);
  };

  // Niche Change Handler
  const handleNicheChange = (niche) => {
    sounds.playClick();
    setSelectedNiche(niche);
    setBrandName(niche.defaultName);
    setTagline(niche.defaultTag);
  };

  // Logo Upload
  const handleLogoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setLogoImage(reader.result);
        sounds.playSuccess();
      };
      reader.readAsDataURL(file);
    }
  };

  // Export JSON & Files
  const downloadFile = (filename, content, mimeType = 'application/json') => {
    sounds.playPop();
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const generateConfigJson = () => {
    return JSON.stringify({
      brandName,
      tagline,
      niche: selectedNiche.id,
      style: {
        id: selectedStyle.id,
        name: selectedStyle.name,
        category: selectedStyle.category
      },
      palette: {
        dominant60: color60,
        surface30: color30,
        accent10: color10
      },
      exportedAt: new Date().toISOString()
    }, null, 2);
  };

  const handleDownloadAll = () => {
    downloadFile('brand-config.json', generateConfigJson(), 'application/json');
    setCopiedToast('Full Brand Code Package Exported!');
    setTimeout(() => setCopiedToast(null), 3000);
  };

  const handleCopyJson = () => {
    sounds.playPop();
    navigator.clipboard.writeText(generateConfigJson());
    setCopiedToast('Config JSON Copied to Clipboard!');
    setTimeout(() => setCopiedToast(null), 2500);
  };

  return (
    <div className="min-h-screen bg-[#070707] text-white selection:bg-[#ebd73f] selection:text-black font-sans flex flex-col">
      
      {/* Minimal Top Control Bar */}
      <header className="sticky top-0 inset-x-0 z-40 bg-[#070707]/90 backdrop-blur-xl border-b border-white/10 px-4 sm:px-6 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          
          <div className="flex items-center gap-3">
            <button
              onClick={() => { sounds.playClick(); onBackToCatalogue(); }}
              className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 hover:bg-[#ebd73f] hover:text-black text-xs font-semibold transition cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back</span>
            </button>

            <span className="text-white/20">•</span>
            
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#ebd73f] animate-pulse"></span>
              <span className="font-panchang font-bold text-xs tracking-wider">
                DRIPP STUDIO
              </span>
              <span className="hidden sm:inline-block text-[10px] font-mono px-2 py-0.5 rounded bg-white/10 text-slate-300">
                {selectedStyle.shortName}
              </span>
            </div>
          </div>

          {/* Device & Export */}
          <div className="flex items-center gap-2.5">
            
            <div className="flex items-center bg-[#121212] p-1 rounded-xl border border-white/10">
              <button
                onClick={() => { sounds.playClick(); setDeviceView('desktop'); }}
                className={`p-1.5 px-3 rounded-lg text-xs flex items-center gap-1.5 transition cursor-pointer ${
                  deviceView === 'desktop' ? 'bg-[#ebd73f] text-black font-bold' : 'text-slate-400 hover:text-white'
                }`}
              >
                <Laptop className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Desktop</span>
              </button>
              <button
                onClick={() => { sounds.playClick(); setDeviceView('mobile'); }}
                className={`p-1.5 px-3 rounded-lg text-xs flex items-center gap-1.5 transition cursor-pointer ${
                  deviceView === 'mobile' ? 'bg-[#ebd73f] text-black font-bold' : 'text-slate-400 hover:text-white'
                }`}
              >
                <Smartphone className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Mobile</span>
              </button>
            </div>

            <button
              onClick={handleDownloadAll}
              className="btn-dripp-primary px-4 py-2 text-xs font-bold flex items-center gap-1.5 shadow-lg cursor-pointer"
            >
              <Download className="w-3.5 h-3.5 text-black" />
              <span>Export</span>
            </button>

          </div>

        </div>
      </header>

      {/* Toast */}
      <AnimatePresence>
        {copiedToast && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-16 left-1/2 -translate-x-1/2 z-50 px-4 py-2 rounded-full bg-[#ebd73f] text-black font-bold text-xs shadow-2xl flex items-center gap-2 font-mono"
          >
            <Check className="w-3.5 h-3.5 stroke-[3]" />
            <span>{copiedToast}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Studio Area */}
      <main className="max-w-7xl mx-auto w-full px-4 sm:px-6 py-6 grid grid-cols-1 lg:grid-cols-12 gap-6 flex-grow items-start">
        
        {/* LEFT COLUMN: Clean, Uncluttered Studio Controls (4 cols) */}
        <div className="lg:col-span-4 bg-[#0d0d0d] border border-white/10 rounded-3xl p-5 space-y-5 shadow-2xl">
          
          {/* Navigation Tabs */}
          <div className="grid grid-cols-3 gap-1 bg-[#141414] p-1 rounded-2xl border border-white/5 text-xs font-clash font-semibold">
            {[
              { id: 'styles', label: 'Styles' },
              { id: 'brand', label: 'Brand' },
              { id: 'colors', label: 'Colors' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => { sounds.playClick(); setActiveTab(tab.id); }}
                className={`py-2 rounded-xl transition cursor-pointer ${
                  activeTab === tab.id 
                    ? 'bg-[#ebd73f] text-black font-bold shadow-md' 
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* TAB 1: 6 CRAZY AESTHETIC STYLES */}
          {activeTab === 'styles' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400 font-mono">CHOOSE AESTHETIC</span>
                <span className="text-[#ebd73f] font-mono text-[10px] font-bold">{selectedStyle.shortName}</span>
              </div>

              <div className="space-y-2">
                {CRAZY_STYLES.map((style) => {
                  const Icon = style.icon;
                  const isSelected = selectedStyle.id === style.id;
                  return (
                    <div
                      key={style.id}
                      onClick={() => handleSelectStyle(style)}
                      className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                        isSelected
                          ? 'bg-[#ebd73f]/15 border-[#ebd73f] shadow-glow-yellow'
                          : 'bg-[#121212] border-white/5 hover:border-white/20 hover:bg-[#181818]'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div 
                          className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                          style={{ 
                            backgroundColor: isSelected ? '#ebd73f' : 'rgba(255,255,255,0.06)',
                            color: isSelected ? '#000000' : '#ffffff'
                          }}
                        >
                          <Icon className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="font-bold text-xs text-white font-clash">{style.name}</p>
                          <p className="text-[10px] text-slate-400 font-mono">{style.category}</p>
                        </div>
                      </div>

                      {isSelected && (
                        <div className="w-6 h-6 rounded-full bg-[#ebd73f] text-black flex items-center justify-center">
                          <Check className="w-3.5 h-3.5 stroke-[3]" />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 2: BRAND IDENTITY & LOGO */}
          {activeTab === 'brand' && (
            <div className="space-y-4">
              
              {/* Niche Selector */}
              <div className="space-y-1">
                <label className="text-[10px] font-mono text-slate-400 uppercase">Select Niche</label>
                <div className="grid grid-cols-2 gap-1.5">
                  {NICHES.map((n) => (
                    <button
                      key={n.id}
                      onClick={() => handleNicheChange(n)}
                      className={`p-2 rounded-xl text-left text-xs font-clash transition cursor-pointer border ${
                        selectedNiche.id === n.id
                          ? 'bg-[#ebd73f]/15 border-[#ebd73f] text-[#ebd73f] font-bold'
                          : 'bg-[#121212] border-white/5 text-slate-400 hover:text-white'
                      }`}
                    >
                      {n.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Brand Name */}
              <div className="space-y-1">
                <label className="text-[10px] font-mono text-slate-400 uppercase">Brand Name</label>
                <input
                  type="text"
                  value={brandName}
                  onChange={(e) => setBrandName(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-black border border-white/15 text-white text-xs font-clash focus:outline-none focus:border-[#ebd73f]"
                />
              </div>

              {/* Tagline */}
              <div className="space-y-1">
                <label className="text-[10px] font-mono text-slate-400 uppercase">Tagline</label>
                <input
                  type="text"
                  value={tagline}
                  onChange={(e) => setTagline(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-black border border-white/15 text-white text-xs font-clash focus:outline-none focus:border-[#ebd73f]"
                />
              </div>

              {/* Logo Upload */}
              <div className="space-y-1.5 pt-1">
                <label className="text-[10px] font-mono text-slate-400 uppercase flex items-center justify-between">
                  <span>Custom Logo</span>
                  {logoImage && (
                    <button onClick={() => setLogoImage(null)} className="text-rose-400 text-[10px] hover:underline">
                      Remove
                    </button>
                  )}
                </label>

                <input type="file" ref={fileInputRef} onChange={handleLogoUpload} accept="image/*" className="hidden" />

                <div 
                  onClick={() => fileInputRef.current.click()}
                  className="p-3 rounded-2xl border border-dashed border-white/20 hover:border-[#ebd73f] bg-black text-center cursor-pointer transition flex items-center justify-center gap-2"
                >
                  <Upload className="w-3.5 h-3.5 text-[#ebd73f]" />
                  <span className="text-xs text-slate-300 font-clash">
                    {logoImage ? 'Change Uploaded Logo' : 'Upload PNG / SVG Logo'}
                  </span>
                </div>
              </div>

            </div>
          )}

          {/* TAB 3: 60-30-10 COLORS */}
          {activeTab === 'colors' && (
            <div className="space-y-4">
              <div className="p-3 rounded-2xl bg-[#121212] border border-white/5 text-xs font-mono">
                <p className="text-[#ebd73f] font-bold">60-30-10 Balance Engine</p>
                <p className="text-slate-400 text-[10px] mt-0.5">60% Canvas • 30% Structure • 10% Focus</p>
              </div>

              {/* Dominant */}
              <div className="p-2.5 rounded-xl bg-black border border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={color60}
                    onChange={(e) => setColor60(e.target.value)}
                    className="w-7 h-7 rounded-lg cursor-pointer bg-transparent"
                  />
                  <div>
                    <p className="text-xs font-bold text-white">60% Dominant</p>
                    <p className="text-[9px] font-mono text-slate-400">Background Canvas</p>
                  </div>
                </div>
                <input
                  type="text"
                  value={color60}
                  onChange={(e) => setColor60(e.target.value)}
                  className="w-20 px-2 py-1 rounded bg-white/5 border border-white/15 text-xs font-mono text-center text-white"
                />
              </div>

              {/* Surface */}
              <div className="p-2.5 rounded-xl bg-black border border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={color30}
                    onChange={(e) => setColor30(e.target.value)}
                    className="w-7 h-7 rounded-lg cursor-pointer bg-transparent"
                  />
                  <div>
                    <p className="text-xs font-bold text-white">30% Structure</p>
                    <p className="text-[9px] font-mono text-slate-400">Cards &amp; Panels</p>
                  </div>
                </div>
                <input
                  type="text"
                  value={color30}
                  onChange={(e) => setColor30(e.target.value)}
                  className="w-20 px-2 py-1 rounded bg-white/5 border border-white/15 text-xs font-mono text-center text-white"
                />
              </div>

              {/* Accent */}
              <div className="p-2.5 rounded-xl bg-black border border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={color10}
                    onChange={(e) => setColor10(e.target.value)}
                    className="w-7 h-7 rounded-lg cursor-pointer bg-transparent"
                  />
                  <div>
                    <p className="text-xs font-bold text-white">10% Accent</p>
                    <p className="text-[9px] font-mono text-[#ebd73f]">Action CTAs</p>
                  </div>
                </div>
                <input
                  type="text"
                  value={color10}
                  onChange={(e) => setColor10(e.target.value)}
                  className="w-20 px-2 py-1 rounded bg-white/5 border border-white/15 text-xs font-mono text-center text-white"
                />
              </div>

            </div>
          )}

          {/* Quick Copy Action */}
          <div className="pt-2 border-t border-white/10">
            <button
              onClick={handleCopyJson}
              className="w-full py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-white font-mono text-xs flex items-center justify-center gap-1.5 transition cursor-pointer"
            >
              <Copy className="w-3.5 h-3.5 text-[#ebd73f]" />
              <span>Copy Config JSON</span>
            </button>
          </div>

        </div>

        {/* RIGHT COLUMN: The Crazy & Creative Live Canvas (8 cols) */}
        <div className="lg:col-span-8 flex flex-col items-center justify-center min-h-[600px] w-full">
          
          {/* Main Device Preview Frame */}
          <div 
            className={`w-full transition-all duration-700 relative overflow-hidden shadow-2xl ${
              deviceView === 'mobile' 
                ? 'max-w-[340px] rounded-[48px] border-[10px] border-[#222222] shadow-[0_25px_60px_rgba(0,0,0,0.9)]' 
                : 'rounded-3xl border border-white/15'
            }`}
            style={{ 
              backgroundColor: color60,
              color: selectedStyle.id === 'neo-brutalist' ? '#000000' : '#ffffff'
            }}
          >
            
            {/* Desktop Mac Header Dots (only in desktop mode) */}
            {deviceView === 'desktop' && (
              <div className="px-4 py-2.5 border-b border-white/10 flex items-center justify-between bg-black/40 backdrop-blur-md">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80"></span>
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80"></span>
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80"></span>
                </div>
                <span className="text-[10px] font-mono text-slate-400">
                  {brandName.toLowerCase().replace(/\s+/g, '')}.com • {selectedStyle.shortName}
                </span>
                <span className="text-[9px] font-mono text-[#ebd73f]">ONLINE</span>
              </div>
            )}

            {/* Mobile Dynamic Island (only in mobile mode) */}
            {deviceView === 'mobile' && (
              <div className="pt-2 pb-1 flex items-center justify-center">
                <div className="w-24 h-4 rounded-full bg-black border border-white/10 flex items-center justify-end px-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#ebd73f]/60"></span>
                </div>
              </div>
            )}

            {/* ========================================================================= */}
            {/* STYLE 1: CYBERPUNK 2077 // HUD MATRIX                                    */}
            {/* ========================================================================= */}
            {selectedStyle.id === 'cyber-hud' && (
              <div className="p-6 relative cyber-grid overflow-hidden min-h-[460px] flex flex-col justify-between">
                <div className="animate-scanline"></div>

                {/* Cyber HUD Corner Telemetry */}
                <div className="flex items-center justify-between font-mono text-[10px] text-[#ebd73f] border-b border-[#ebd73f]/30 pb-2">
                  <div className="flex items-center gap-2">
                    <span className="animate-pulse">SYS.CORE // ONLINE</span>
                    <span>•</span>
                    <span className="text-white">QUANTUM 0x9F</span>
                  </div>
                  <span>LATENCY: 4.2ms</span>
                </div>

                {/* Hero */}
                <div className="py-6 space-y-3">
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 border border-[#ebd73f] font-mono text-[9px] text-[#ebd73f] bg-black">
                    <span>[ TARGET_LOCKED ]</span>
                  </div>

                  <h2 className="font-panchang font-black text-2xl sm:text-3xl text-white tracking-tight leading-tight">
                    {brandName} <span className="text-[#ebd73f]">// TERMINAL</span>
                  </h2>
                  <p className="font-mono text-xs text-slate-400 max-w-md">
                    {tagline}. Neural dispatch engine active. Zero-wait sub-second food &amp; reservation protocol.
                  </p>

                  <button className="px-6 py-3 bg-[#ebd73f] text-black font-mono font-black text-xs uppercase tracking-widest shadow-[0_0_25px_rgba(235,215,63,0.5)] hover:bg-white transition cursor-pointer">
                    [ INITIALIZE ORDER // ⚡ ]
                  </button>
                </div>

                {/* Cyber Crate Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3">
                  {[
                    { name: selectedNiche.item1, price: selectedNiche.price1, code: "MOD.01", status: "98% PREP" },
                    { name: selectedNiche.item2, price: selectedNiche.price2, code: "MOD.02", status: "READY" },
                  ].map((item, idx) => (
                    <div key={idx} className="p-3.5 bg-black/80 border border-[#ebd73f]/40 relative">
                      <div className="flex justify-between font-mono text-[10px] text-[#ebd73f]">
                        <span>{item.code}</span>
                        <span>{item.status}</span>
                      </div>
                      <p className="font-mono font-bold text-sm text-white mt-1">{item.name}</p>
                      <p className="font-mono text-xs text-[#ebd73f] font-bold mt-1">{currency}{item.price}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ========================================================================= */}
            {/* STYLE 2: NEO-BRUTALISM // HYPEBEAST DROP                                 */}
            {/* ========================================================================= */}
            {selectedStyle.id === 'neo-brutalist' && (
              <div className="bg-[#ebd73f] text-black p-6 min-h-[460px] flex flex-col justify-between relative overflow-hidden font-sans">
                
                {/* Marquee Ticker */}
                <div className="overflow-hidden bg-black text-[#ebd73f] py-1 -mx-6 -mt-6 border-b-4 border-black font-mono text-xs font-black">
                  <div className="animate-marquee whitespace-nowrap">
                    <span>★ HIGH ENERGY ★ ZERO WAIT ★ 100% UNFILTERED ★ FRESH DROP ★ INSTANT CHECKOUT ★ HIGH ENERGY ★ ZERO WAIT ★ 100% UNFILTERED ★ FRESH DROP ★&nbsp;</span>
                    <span>★ HIGH ENERGY ★ ZERO WAIT ★ 100% UNFILTERED ★ FRESH DROP ★ INSTANT CHECKOUT ★ HIGH ENERGY ★ ZERO WAIT ★ 100% UNFILTERED ★ FRESH DROP ★&nbsp;</span>
                  </div>
                </div>

                {/* Main Content */}
                <div className="py-6 space-y-4">
                  <div className="flex items-center gap-2">
                    <span className="px-3 py-1 bg-black text-white font-black text-xs uppercase -rotate-2 border-2 border-black shadow-[3px_3px_0px_#fff]">
                      ★ LIMITED DROP ★
                    </span>
                    <span className="px-2 py-1 bg-white text-black font-black text-xs uppercase rotate-2 border-2 border-black">
                      100% RAW
                    </span>
                  </div>

                  <h2 className="font-black text-3xl sm:text-4xl uppercase tracking-tighter leading-none">
                    {brandName}
                  </h2>
                  <p className="font-bold text-xs max-w-md uppercase">
                    {tagline}. No fluff, straight flavor. Pick your items and secure your order now.
                  </p>

                  <button className="px-7 py-3.5 bg-black text-[#ebd73f] font-black text-sm uppercase tracking-wider border-3 border-black shadow-[6px_6px_0px_#000] hover:translate-x-1 hover:translate-y-1 hover:shadow-[2px_2px_0px_#000] active:translate-x-1.5 active:translate-y-1.5 active:shadow-none transition cursor-pointer">
                    GRAB YOUR ORDER ↗
                  </button>
                </div>

                {/* Brutalist Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  {[
                    { name: selectedNiche.item1, price: selectedNiche.price1, tag: "TOP PICK" },
                    { name: selectedNiche.item2, price: selectedNiche.price2, tag: "FRESH" },
                  ].map((item, idx) => (
                    <div key={idx} className="p-3.5 bg-white border-3 border-black shadow-[5px_5px_0px_#000] space-y-1">
                      <div className="flex justify-between items-start">
                        <p className="font-black text-xs uppercase">{item.name}</p>
                        <span className="px-1.5 py-0.5 bg-black text-white text-[9px] font-black">{item.tag}</span>
                      </div>
                      <p className="font-black text-base">{currency}{item.price}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ========================================================================= */}
            {/* STYLE 3: LIQUID AURA // CHROMATIC GLASS                                  */}
            {/* ========================================================================= */}
            {selectedStyle.id === 'liquid-glass' && (
              <div className="p-6 relative min-h-[460px] flex flex-col justify-between overflow-hidden bg-[#09090e]">
                
                {/* Floating Aurora Blobs */}
                <div className="absolute -top-16 -left-16 w-56 h-56 rounded-full bg-purple-600/30 blur-3xl animate-float-orb pointer-events-none"></div>
                <div className="absolute -bottom-16 -right-16 w-56 h-56 rounded-full bg-[#ebd73f]/25 blur-3xl animate-float-orb pointer-events-none"></div>

                <div className="relative z-10 flex items-center justify-between pb-3 border-b border-white/15">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-purple-400 animate-ping"></span>
                    <span className="font-clash font-bold text-sm text-white">{brandName}</span>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full bg-white/10 border border-white/20 text-[10px] text-purple-300 backdrop-blur-md">
                    AURA REFRACTION
                  </span>
                </div>

                <div className="relative z-10 py-6 space-y-3">
                  <span className="px-3 py-1 rounded-full text-[10px] font-mono bg-white/10 border border-white/20 backdrop-blur-xl text-white">
                    FROSTED GLASS ENGINE
                  </span>
                  <h2 className="font-clash font-bold text-2xl sm:text-3xl text-white tracking-tight">
                    {brandName}
                  </h2>
                  <p className="text-xs text-slate-300 font-clash max-w-md leading-relaxed">
                    {tagline}. Experience tactile glass refraction and liquid reservation flows.
                  </p>

                  <button className="px-6 py-3 rounded-2xl bg-white/15 hover:bg-white/25 border border-white/30 backdrop-blur-2xl text-white font-clash font-bold text-xs shadow-2xl transition cursor-pointer">
                    Experience Liquid Menu ✦
                  </button>
                </div>

                <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  {[selectedNiche.item1, selectedNiche.item2].map((item, idx) => (
                    <div key={idx} className="p-3.5 rounded-2xl bg-white/[0.08] border border-white/20 backdrop-blur-xl space-y-1">
                      <p className="font-clash font-bold text-xs text-white">{item}</p>
                      <p className="font-mono text-xs text-purple-300 font-bold">{currency}{idx === 0 ? selectedNiche.price1 : selectedNiche.price2}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ========================================================================= */}
            {/* STYLE 4: ULTRA-LUXURY // VOGUE EDITORIAL                                 */}
            {/* ========================================================================= */}
            {selectedStyle.id === 'editorial-luxury' && (
              <div className="p-8 min-h-[460px] flex flex-col justify-between bg-[#050505] text-white">
                
                <div className="flex items-center justify-between border-b border-white/15 pb-4">
                  <span className="font-mono text-[9px] tracking-[0.3em] uppercase text-[#d4af37]">
                    VINTAGE // EDITION
                  </span>
                  <span className="font-mono text-[9px] text-slate-400">EST. {new Date().getFullYear()}</span>
                </div>

                <div className="py-8 space-y-4 text-center">
                  <p className="font-mono text-[10px] tracking-[0.35em] text-[#d4af37] uppercase">
                    HAUTE CUISINE &amp; HOSPITALITY
                  </p>
                  <h2 className="font-panchang font-light text-2xl sm:text-4xl text-white tracking-wider uppercase">
                    {brandName}
                  </h2>
                  <p className="text-xs text-slate-400 font-clash max-w-sm mx-auto italic">
                    "{tagline}. An understated culinary sanctuary."
                  </p>

                  <div className="pt-2">
                    <button className="px-8 py-3 border border-[#d4af37] text-[#d4af37] hover:bg-[#d4af37] hover:text-black font-mono text-[11px] tracking-[0.3em] uppercase transition cursor-pointer">
                      RESERVE TABLE
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 border-t border-white/15 pt-4 text-left">
                  <div>
                    <span className="font-mono text-[9px] text-[#d4af37]">№ 01</span>
                    <p className="font-clash font-bold text-xs text-white mt-0.5">{selectedNiche.item1}</p>
                    <p className="font-mono text-[11px] text-slate-400">{currency}{selectedNiche.price1}</p>
                  </div>
                  <div>
                    <span className="font-mono text-[9px] text-[#d4af37]">№ 02</span>
                    <p className="font-clash font-bold text-xs text-white mt-0.5">{selectedNiche.item2}</p>
                    <p className="font-mono text-[11px] text-slate-400">{currency}{selectedNiche.price2}</p>
                  </div>
                </div>
              </div>
            )}

            {/* ========================================================================= */}
            {/* STYLE 5: Y2K POP CANDY // BOUNCY FUN                                     */}
            {/* ========================================================================= */}
            {selectedStyle.id === 'pop-candy' && (
              <div className="p-6 min-h-[460px] flex flex-col justify-between bg-[#12081c] text-white">
                
                <div className="flex items-center justify-between pb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">🍕</span>
                    <span className="font-black text-lg text-[#f43f5e]">{brandName}</span>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-[#f43f5e] text-white font-black text-xs shadow-lg">
                    HOT DROP 🔥
                  </span>
                </div>

                <div className="py-6 space-y-3">
                  <div className="flex items-center gap-1.5 text-lg">
                    <span>⚡</span>
                    <span>🤤</span>
                    <span>✨</span>
                  </div>
                  <h2 className="font-black text-3xl text-white tracking-tight">
                    Crave It? <span className="text-[#f43f5e]">Get It!</span>
                  </h2>
                  <p className="text-xs text-slate-300 max-w-sm">
                    {tagline}. Fresh bites made with maximum love and bouncy vibes!
                  </p>

                  <button className="px-6 py-3 rounded-full bg-gradient-to-r from-[#f43f5e] to-pink-500 text-white font-black text-xs shadow-xl hover:scale-105 active:scale-95 transition cursor-pointer">
                    Grab Yours Now! 💖
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {[selectedNiche.item1, selectedNiche.item2].map((item, idx) => (
                    <div key={idx} className="p-3.5 rounded-[24px] bg-[#221333] border-2 border-pink-500/30 flex justify-between items-center">
                      <div>
                        <p className="font-black text-xs text-white">{item}</p>
                        <p className="text-[10px] text-pink-300 font-bold">100% YUMMY</p>
                      </div>
                      <span className="font-black text-sm text-[#f43f5e]">
                        {currency}{idx === 0 ? selectedNiche.price1 : selectedNiche.price2}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ========================================================================= */}
            {/* STYLE 6: HIGH-OCTANE // RACING NITRO                                     */}
            {/* ========================================================================= */}
            {selectedStyle.id === 'high-octane' && (
              <div className="p-6 min-h-[460px] flex flex-col justify-between carbon-pattern text-white relative overflow-hidden">
                
                {/* Racing Stripes */}
                <div className="absolute top-0 right-12 w-2 h-full bg-[#ebd73f]/60 -skew-x-12 pointer-events-none"></div>
                <div className="absolute top-0 right-16 w-1 h-full bg-white/40 -skew-x-12 pointer-events-none"></div>

                <div className="relative z-10 flex items-center justify-between pb-2 border-b border-white/20">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 bg-[#ebd73f] -skew-x-12"></span>
                    <span className="font-black italic text-sm tracking-wider text-white uppercase">{brandName}</span>
                  </div>
                  <span className="font-mono text-[10px] text-[#ebd73f] font-black italic">
                    0-60 IN 8 MINS
                  </span>
                </div>

                <div className="relative z-10 py-6 space-y-3">
                  <span className="inline-block px-2.5 py-0.5 bg-[#ebd73f] text-black font-black italic text-[10px] -skew-x-12 uppercase">
                    NITRO SPEED CHECKOUT
                  </span>
                  <h2 className="font-black italic text-3xl sm:text-4xl uppercase tracking-wider text-white">
                    {brandName}
                  </h2>
                  <p className="text-xs text-slate-300 font-mono max-w-sm">
                    {tagline}. High-velocity culinary performance. Built for maximum speed.
                  </p>

                  <button className="px-7 py-3.5 bg-[#ebd73f] hover:bg-white text-black font-black italic text-xs uppercase tracking-wider -skew-x-12 shadow-2xl transition cursor-pointer">
                    BOOST ORDER NOW ⚡
                  </button>
                </div>

                <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {[
                    { name: selectedNiche.item1, price: selectedNiche.price1, stat: "STAGE 1" },
                    { name: selectedNiche.item2, price: selectedNiche.price2, stat: "STAGE 2" }
                  ].map((item, idx) => (
                    <div key={idx} className="p-3 bg-black/90 border-l-4 border-l-[#ebd73f] border border-white/15 -skew-x-6 space-y-1">
                      <div className="flex justify-between items-center">
                        <p className="font-black italic text-xs text-white">{item.name}</p>
                        <span className="text-[9px] font-mono text-[#ebd73f]">{item.stat}</span>
                      </div>
                      <p className="font-mono font-bold text-sm text-[#ebd73f]">{currency}{item.price}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>

        </div>

      </main>

    </div>
  );
}
