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
  Layers, 
  Sliders, 
  CheckCircle2, 
  Sparkles, 
  FileText, 
  Code2, 
  RefreshCw,
  ShoppingBag,
  Clock,
  Eye,
  Trash2
} from 'lucide-react';
import { sounds } from '../utils/audio';

// 60-30-10 Curated Brand Presets
const PRESET_PALETTES = [
  {
    id: "dripp-gold",
    name: "Dripp Signature Gold",
    rule: "60-30-10 Luxury",
    c60: "#080808", // Dominant Background (60%)
    c30: "#141414", // Secondary Structure/Cards (30%)
    c10: "#ebd73f", // Accent Highlights/CTAs (10%)
    textLight: "#ffffff",
    textMuted: "#8e8e8e"
  },
  {
    id: "silicon-monochrome",
    name: "High-Contrast Platinum",
    rule: "60-30-10 Minimalist",
    c60: "#09090b",
    c30: "#18181b",
    c10: "#ffffff",
    textLight: "#ffffff",
    textMuted: "#a1a1aa"
  },
  {
    id: "nordic-emerald",
    name: "Nordic Clinic Emerald",
    rule: "60-30-10 Healthcare",
    c60: "#05110d",
    c30: "#0c211a",
    c10: "#10b981",
    textLight: "#ffffff",
    textMuted: "#6ee7b7"
  },
  {
    id: "electric-cyan",
    name: "Cyber Performance Cyan",
    rule: "60-30-10 Sports & Fitness",
    c60: "#061017",
    c30: "#0e1f2b",
    c10: "#06b6d4",
    textLight: "#ffffff",
    textMuted: "#67e8f9"
  },
  {
    id: "nightclub-violet",
    name: "Nocturne Royal Violet",
    rule: "60-30-10 Nightlife",
    c60: "#0a0614",
    c30: "#160e29",
    c10: "#a855f7",
    textLight: "#ffffff",
    textMuted: "#c084fc"
  },
  {
    id: "rosso-lounge",
    name: "Crimson Velvet Lounge",
    rule: "60-30-10 Hospitality",
    c60: "#120709",
    c30: "#241014",
    c10: "#f43f5e",
    textLight: "#ffffff",
    textMuted: "#fda4af"
  },
  {
    id: "warm-terracotta",
    name: "Artisan Terracotta",
    rule: "60-30-10 Roastery & Dining",
    c60: "#120d09",
    c30: "#241a12",
    c10: "#f97316",
    textLight: "#ffffff",
    textMuted: "#fed7aa"
  }
];

const FONT_PAIRINGS = [
  { id: "panchang-clash", name: "Cyber Luxury", display: "Panchang", body: "Clash Display", classDisplay: "font-panchang", classBody: "font-clash" },
  { id: "syne-inter", name: "Contemporary Bold", display: "Syne", body: "Inter", classDisplay: "font-syne", classBody: "font-sans" },
  { id: "clash-mono", name: "Tech Architectural", display: "Clash Display", body: "JetBrains Mono", classDisplay: "font-clash", classBody: "font-mono" },
  { id: "minimal-clean", name: "Clean Minimalist", display: "Inter", body: "Inter", classDisplay: "font-sans", classBody: "font-sans" }
];

const NICHES = [
  { id: "cafes", label: "Cafe & Restaurant", defaultName: "The Roast & Kitchen", defaultTagline: "Artisanal Brews & Gourmet Kitchen", item1: "Double Truffle Smash", price1: "349", item2: "Pour-Over Cold Drip", price2: "190" },
  { id: "clinics", label: "Medical & Dental Clinic", defaultName: "AuraCare Specialist Clinic", defaultTagline: "Advanced Dental & Aesthetic Practice", item1: "Cosmetic Consultation", price1: "800", item2: "HydraGlow Therapy", price2: "2,500" },
  { id: "gyms", label: "Gym & CrossFit Studio", defaultName: "Titan Performance Club", defaultTagline: "Strength, Conditioning & Recovery", item1: "Pro Athlete Monthly", price1: "2,499", item2: "1-Day Drop-In Pass", price2: "499" },
  { id: "clubs", label: "Nightclub & VIP Lounge", defaultName: "Velvet Sky Lounge", defaultTagline: "VIP Table Reservations & Cocktails", item1: "Center Dancefloor Booth", price1: "20,000", item2: "Guestlist RSVP Pass", price2: "Free" },
  { id: "turfs", label: "Sports Turf & Box Arena", defaultName: "BoxArena Sports Complex", defaultTagline: "Hourly Box Cricket & Football", item1: "Prime Evening Slot (1hr)", price1: "1,499", item2: "Morning Saver Slot", price2: "999" },
  { id: "salons", label: "Luxury Salon & Spa", defaultName: "Maison de Luxe Studio", defaultTagline: "Bespoke Hair & Aesthetic Treatments", item1: "Signature Balayage & Glaze", price1: "6,500", item2: "Korean Glass Facial", price2: "3,800" },
];

export function WhiteLabelStudio({ onBackToCatalogue, onLaunchLiveDemo }) {
  // Brand Setup State
  const [activeTab, setActiveTab] = useState('brand'); // 'brand' | 'colors' | 'preview' | 'export'
  const [selectedNiche, setSelectedNiche] = useState(NICHES[0]);
  const [brandName, setBrandName] = useState(NICHES[0].defaultName);
  const [tagline, setTagline] = useState(NICHES[0].defaultTagline);
  const [currency, setCurrency] = useState('₹');
  const [fontPairing, setFontPairing] = useState(FONT_PAIRINGS[0]);
  
  // Logo State (Base64 data or null)
  const [logoImage, setLogoImage] = useState(null);
  const fileInputRef = useRef(null);

  // 60-30-10 Colors State
  const [activePreset, setActivePreset] = useState(PRESET_PALETTES[0]);
  const [color60, setColor60] = useState(PRESET_PALETTES[0].c60); // 60% Dominant (Canvas / Background)
  const [color30, setColor30] = useState(PRESET_PALETTES[0].c30); // 30% Secondary (Cards / Surfaces)
  const [color10, setColor10] = useState(PRESET_PALETTES[0].c10); // 10% Accent (CTAs / Highlights)
  const [deviceView, setDeviceView] = useState('desktop'); // 'desktop' | 'mobile'

  // Interactive Test State in Live Preview
  const [testModalOpen, setTestModalOpen] = useState(false);
  const [copiedNotification, setCopiedNotification] = useState(null);

  // Handle Logo Upload
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

  const handleApplyPreset = (preset) => {
    sounds.playClick();
    setActivePreset(preset);
    setColor60(preset.c60);
    setColor30(preset.c30);
    setColor10(preset.c10);
  };

  const handleNicheChange = (niche) => {
    sounds.playClick();
    setSelectedNiche(niche);
    setBrandName(niche.defaultName);
    setTagline(niche.defaultTagline);
  };

  // Generate Export Code Strings
  const generateBrandConfigJson = () => {
    return JSON.stringify({
      brandName: brandName,
      tagline: tagline,
      niche: selectedNiche.id,
      currency: currency,
      colorRule: "60-30-10",
      palette: {
        dominant60_bg: color60,
        secondary30_surface: color30,
        accent10_cta: color10
      },
      typography: {
        headingFont: fontPairing.display,
        bodyFont: fontPairing.body
      },
      logoProvided: !!logoImage,
      exportedAt: new Date().toISOString(),
      generator: "Dripp Media White-Label Studio v4.2"
    }, null, 2);
  };

  const generateTailwindConfig = () => {
    return `// tailwind.config.js - Custom White-Label Theme for ${brandName}
module.exports = {
  theme: {
    extend: {
      colors: {
        brand: {
          bg: '${color60}',       // 60% Dominant Base
          surface: '${color30}',  // 30% Structure & Cards
          accent: '${color10}',   // 10% Call-to-Action Focus
        }
      },
      fontFamily: {
        heading: ['"${fontPairing.display}"', 'sans-serif'],
        body: ['"${fontPairing.body}"', 'sans-serif'],
      }
    }
  }
};`;
  };

  const generateCssVariables = () => {
    return `/* theme.css - 60-30-10 Color Engine for ${brandName} */
:root {
  --color-brand-60-bg: ${color60};
  --color-brand-30-surface: ${color30};
  --color-brand-10-accent: ${color10};
  --font-heading: '${fontPairing.display}', sans-serif;
  --font-body: '${fontPairing.body}', sans-serif;
}

body {
  background-color: var(--color-brand-60-bg);
  color: #ffffff;
  font-family: var(--font-body);
}

.brand-card {
  background-color: var(--color-brand-30-surface);
  border: 1px solid rgba(255, 255, 255, 0.08);
}

.brand-btn-primary {
  background-color: var(--color-brand-10-accent);
  color: #000000;
  font-weight: 700;
}`;
  };

  // Automated File Download Handler
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

  const handleDownloadAll = () => {
    downloadFile('brand-config.json', generateBrandConfigJson(), 'application/json');
    setTimeout(() => {
      downloadFile('tailwind-theme.js', generateTailwindConfig(), 'text/javascript');
    }, 200);
    setTimeout(() => {
      downloadFile('theme.css', generateCssVariables(), 'text/css');
    }, 400);

    setCopiedNotification('All White-Label Code Files Downloaded!');
    setTimeout(() => setCopiedNotification(null), 3000);
  };

  const copyToClipboard = (text, label) => {
    sounds.playPop();
    navigator.clipboard.writeText(text);
    setCopiedNotification(`${label} Copied to Clipboard!`);
    setTimeout(() => setCopiedNotification(null), 2500);
  };

  return (
    <div className="min-h-screen bg-[#080808] text-white selection:bg-[#ebd73f] selection:text-black font-sans flex flex-col justify-between">
      
      {/* Top Header Navigation */}
      <header className="sticky top-0 inset-x-0 z-40 bg-[#080808]/95 backdrop-blur-xl border-b border-white/10 py-3 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          
          {/* Back & Title */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                sounds.playClick();
                onBackToCatalogue();
              }}
              className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 hover:bg-[#ebd73f] hover:text-black font-clash font-semibold text-xs transition cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Catalogue</span>
            </button>

            <span className="hidden md:inline-block text-white/20">•</span>
            
            <div className="hidden sm:flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#ebd73f] animate-pulse"></span>
              <span className="font-panchang font-bold text-xs text-white">
                WHITE-LABEL STUDIO
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/10 text-white/80">
                EDITOR PANEL
              </span>
            </div>
          </div>

          {/* Device Switcher & Quick Download */}
          <div className="flex items-center gap-3">
            
            <div className="hidden md:flex items-center gap-1 bg-[#141414] p-1 rounded-xl border border-white/10">
              <button
                onClick={() => { sounds.playClick(); setDeviceView('desktop'); }}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-mono transition cursor-pointer ${
                  deviceView === 'desktop' ? 'bg-[#ebd73f] text-black font-bold' : 'text-slate-400 hover:text-white'
                }`}
              >
                <Laptop className="w-3.5 h-3.5" />
                <span>Desktop</span>
              </button>
              <button
                onClick={() => { sounds.playClick(); setDeviceView('mobile'); }}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-mono transition cursor-pointer ${
                  deviceView === 'mobile' ? 'bg-[#ebd73f] text-black font-bold' : 'text-slate-400 hover:text-white'
                }`}
              >
                <Smartphone className="w-3.5 h-3.5" />
                <span>Mobile</span>
              </button>
            </div>

            <button
              onClick={handleDownloadAll}
              className="btn-dripp-primary px-4 py-2 text-xs font-bold flex items-center gap-1.5 shadow-lg cursor-pointer"
            >
              <Download className="w-3.5 h-3.5 text-black" />
              <span>Export Code Package</span>
            </button>

          </div>

        </div>
      </header>

      {/* Copied Notification Toast */}
      <AnimatePresence>
        {copiedNotification && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-16 left-1/2 -translate-x-1/2 z-50 px-4 py-2 rounded-full bg-[#ebd73f] text-black font-bold text-xs font-clash shadow-2xl flex items-center gap-2"
          >
            <Check className="w-4 h-4 stroke-[3]" />
            <span>{copiedNotification}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Studio Work Area */}
      <main className="max-w-7xl mx-auto w-full px-4 sm:px-6 py-6 grid grid-cols-1 lg:grid-cols-12 gap-6 flex-grow">
        
        {/* LEFT COLUMN: Controls & Setup (5 cols) */}
        <div className="lg:col-span-5 bg-[#0e0e0e] border border-white/10 rounded-3xl p-5 sm:p-6 flex flex-col justify-between shadow-2xl space-y-6">
          
          <div>
            {/* Editor Navigation Tabs */}
            <div className="flex items-center gap-1 pb-4 border-b border-white/10 overflow-x-auto no-scrollbar">
              {[
                { id: 'brand', label: '1. Brand & Logo', icon: Type },
                { id: 'colors', label: '2. 60-30-10 Colors', icon: Palette },
                { id: 'export', label: '3. Code Export', icon: Code2 },
              ].map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => { sounds.playClick(); setActiveTab(tab.id); }}
                    className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-clash font-semibold transition cursor-pointer shrink-0 ${
                      isActive 
                        ? 'bg-white/15 text-[#ebd73f] border border-white/20' 
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>

            {/* TAB 1: BRAND IDENTITY & LOGO */}
            {activeTab === 'brand' && (
              <div className="pt-5 space-y-5">
                
                {/* Niche Selector */}
                <div className="space-y-1.5">
                  <label className="text-[11px] font-mono text-slate-400 uppercase tracking-wider">
                    Select Business Niche
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {NICHES.map((n) => (
                      <button
                        key={n.id}
                        onClick={() => handleNicheChange(n)}
                        className={`p-2.5 rounded-xl text-left border text-xs font-clash transition cursor-pointer ${
                          selectedNiche.id === n.id
                            ? 'bg-white/15 border-[#ebd73f] text-[#ebd73f] font-bold'
                            : 'bg-white/[0.02] border-white/10 text-white/60 hover:text-white'
                        }`}
                      >
                        {n.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Brand Name */}
                <div className="space-y-1.5">
                  <label className="text-[11px] font-mono text-slate-400 uppercase tracking-wider">
                    Brand / Business Name
                  </label>
                  <input
                    type="text"
                    value={brandName}
                    onChange={(e) => setBrandName(e.target.value)}
                    placeholder="Enter Brand Name..."
                    className="w-full px-4 py-2.5 rounded-xl bg-black border border-white/15 text-white text-sm font-clash focus:outline-none focus:border-[#ebd73f]"
                  />
                </div>

                {/* Tagline */}
                <div className="space-y-1.5">
                  <label className="text-[11px] font-mono text-slate-400 uppercase tracking-wider">
                    Tagline / Subtitle
                  </label>
                  <input
                    type="text"
                    value={tagline}
                    onChange={(e) => setTagline(e.target.value)}
                    placeholder="Enter Subtitle Tagline..."
                    className="w-full px-4 py-2.5 rounded-xl bg-black border border-white/15 text-white text-xs font-clash focus:outline-none focus:border-[#ebd73f]"
                  />
                </div>

                {/* Logo Uploader */}
                <div className="space-y-2">
                  <label className="text-[11px] font-mono text-slate-400 uppercase tracking-wider flex items-center justify-between">
                    <span>Brand Logo Asset</span>
                    {logoImage && (
                      <button
                        onClick={() => setLogoImage(null)}
                        className="text-[10px] text-rose-400 hover:underline flex items-center gap-1 cursor-pointer"
                      >
                        <Trash2 className="w-3 h-3" />
                        <span>Remove Logo</span>
                      </button>
                    )}
                  </label>

                  <div className="flex items-center gap-3">
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleLogoUpload}
                      accept="image/*"
                      className="hidden"
                    />

                    <div 
                      onClick={() => fileInputRef.current.click()}
                      className="flex-1 p-3.5 rounded-2xl border border-dashed border-white/20 hover:border-[#ebd73f] bg-black/40 text-center cursor-pointer transition flex flex-col items-center justify-center gap-1.5"
                    >
                      <Upload className="w-4 h-4 text-[#ebd73f]" />
                      <span className="text-xs font-clash text-slate-300">
                        Upload Custom Logo (.PNG / .SVG)
                      </span>
                      <span className="text-[10px] font-mono text-slate-500">
                        Auto-scaled to header &amp; icon assets
                      </span>
                    </div>

                    {logoImage ? (
                      <div className="w-14 h-14 rounded-2xl bg-black border border-[#ebd73f] p-1.5 flex items-center justify-center shrink-0">
                        <img src={logoImage} alt="Uploaded Logo" className="max-h-full max-w-full object-contain" />
                      </div>
                    ) : (
                      <div 
                        className="w-14 h-14 rounded-2xl font-black font-panchang text-black flex items-center justify-center text-sm shadow-md shrink-0"
                        style={{ backgroundColor: color10 }}
                      >
                        {brandName.substring(0, 2).toUpperCase() || 'DM'}
                      </div>
                    )}
                  </div>
                </div>

                {/* Font Pairing Selection */}
                <div className="space-y-2">
                  <label className="text-[11px] font-mono text-slate-400 uppercase tracking-wider">
                    Typography Pairing
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {FONT_PAIRINGS.map((fp) => (
                      <button
                        key={fp.id}
                        onClick={() => { sounds.playClick(); setFontPairing(fp); }}
                        className={`p-2.5 rounded-xl border text-left transition cursor-pointer ${
                          fontPairing.id === fp.id
                            ? 'bg-white/15 border-[#ebd73f] text-[#ebd73f]'
                            : 'bg-white/[0.02] border-white/10 text-white/60 hover:text-white'
                        }`}
                      >
                        <p className="text-xs font-bold leading-tight">{fp.name}</p>
                        <p className="text-[10px] font-mono text-slate-400 mt-0.5">{fp.display} + {fp.body}</p>
                      </button>
                    ))}
                  </div>
                </div>

              </div>
            )}

            {/* TAB 2: 60-30-10 COLOR SCIENCE ENGINE */}
            {activeTab === 'colors' && (
              <div className="pt-5 space-y-6">
                
                {/* 60-30-10 Explanation Pill */}
                <div className="p-3.5 rounded-2xl bg-black/60 border border-white/10 text-xs font-mono space-y-1">
                  <p className="text-[#ebd73f] font-bold">The 60-30-10 Color Architecture Rule:</p>
                  <p className="text-slate-300 text-[11px] leading-relaxed">
                    <strong>60% Dominant:</strong> Background canvas &amp; atmosphere. <br />
                    <strong>30% Secondary:</strong> Structural cards, navigation &amp; elevation. <br />
                    <strong>10% Accent:</strong> High-conversion buttons, pricing &amp; focal calls.
                  </p>
                </div>

                {/* Curated Presets */}
                <div className="space-y-2">
                  <label className="text-[11px] font-mono text-slate-400 uppercase tracking-wider">
                    1-Click Professional Presets
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {PRESET_PALETTES.map((preset) => (
                      <button
                        key={preset.id}
                        onClick={() => handleApplyPreset(preset)}
                        className={`p-2.5 rounded-xl border text-left flex items-center justify-between transition cursor-pointer ${
                          activePreset.id === preset.id
                            ? 'bg-white/15 border-[#ebd73f] text-white'
                            : 'bg-white/[0.02] border-white/10 text-white/70 hover:text-white'
                        }`}
                      >
                        <div>
                          <p className="text-xs font-bold font-clash">{preset.name}</p>
                          <p className="text-[10px] font-mono text-slate-400">{preset.rule}</p>
                        </div>
                        <div className="flex items-center gap-1">
                          <span className="w-3 h-3 rounded-full border border-white/20" style={{ backgroundColor: preset.c60 }}></span>
                          <span className="w-3 h-3 rounded-full border border-white/20" style={{ backgroundColor: preset.c30 }}></span>
                          <span className="w-3 h-3 rounded-full" style={{ backgroundColor: preset.c10 }}></span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Granular Color Choosers with Hex Codes */}
                <div className="space-y-3.5 pt-2 border-t border-white/10">
                  <p className="text-[11px] font-mono text-slate-400 uppercase tracking-wider">
                    Granular Color Chooser &amp; Hex Code Inputs
                  </p>

                  {/* 60% Dominant (Canvas) */}
                  <div className="p-3 rounded-xl bg-black border border-white/10 flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <input
                        type="color"
                        value={color60}
                        onChange={(e) => setColor60(e.target.value)}
                        className="w-8 h-8 rounded-lg cursor-pointer bg-transparent border-none"
                      />
                      <div>
                        <p className="text-xs font-bold text-white font-clash">60% Dominant Base (Canvas)</p>
                        <p className="text-[10px] font-mono text-slate-400">Background atmosphere</p>
                      </div>
                    </div>
                    <input
                      type="text"
                      value={color60}
                      onChange={(e) => setColor60(e.target.value)}
                      className="w-24 px-2 py-1 rounded-lg bg-white/5 border border-white/20 text-xs font-mono text-center text-white focus:outline-none focus:border-[#ebd73f]"
                    />
                  </div>

                  {/* 30% Secondary (Cards/Surfaces) */}
                  <div className="p-3 rounded-xl bg-black border border-white/10 flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <input
                        type="color"
                        value={color30}
                        onChange={(e) => setColor30(e.target.value)}
                        className="w-8 h-8 rounded-lg cursor-pointer bg-transparent border-none"
                      />
                      <div>
                        <p className="text-xs font-bold text-white font-clash">30% Secondary Structure</p>
                        <p className="text-[10px] font-mono text-slate-400">Cards, chrome &amp; panels</p>
                      </div>
                    </div>
                    <input
                      type="text"
                      value={color30}
                      onChange={(e) => setColor30(e.target.value)}
                      className="w-24 px-2 py-1 rounded-lg bg-white/5 border border-white/20 text-xs font-mono text-center text-white focus:outline-none focus:border-[#ebd73f]"
                    />
                  </div>

                  {/* 10% Accent (Focal CTAs) */}
                  <div className="p-3 rounded-xl bg-black border border-white/10 flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <input
                        type="color"
                        value={color10}
                        onChange={(e) => setColor10(e.target.value)}
                        className="w-8 h-8 rounded-lg cursor-pointer bg-transparent border-none"
                      />
                      <div>
                        <p className="text-xs font-bold text-white font-clash">10% Accent Action (Focal)</p>
                        <p className="text-[10px] font-mono text-[#ebd73f]">Buttons, Badges &amp; Prices</p>
                      </div>
                    </div>
                    <input
                      type="text"
                      value={color10}
                      onChange={(e) => setColor10(e.target.value)}
                      className="w-24 px-2 py-1 rounded-lg bg-white/5 border border-white/20 text-xs font-mono text-center text-white focus:outline-none focus:border-[#ebd73f]"
                    />
                  </div>

                </div>

              </div>
            )}

            {/* TAB 3: CODE EXPORT & DOWNLOAD CENTER */}
            {activeTab === 'export' && (
              <div className="pt-5 space-y-4 font-mono text-xs">
                
                <div className="p-3.5 rounded-2xl bg-black/60 border border-white/10 space-y-1">
                  <p className="text-[#ebd73f] font-bold">Turnkey Export Center:</p>
                  <p className="text-slate-300 text-[11px]">
                    Download the exact production-ready configuration, Tailwind design tokens, and CSS variables for {brandName}.
                  </p>
                </div>

                <div className="space-y-2">
                  <button
                    onClick={() => downloadFile('brand-config.json', generateBrandConfigJson(), 'application/json')}
                    className="w-full p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-left flex items-center justify-between transition cursor-pointer"
                  >
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-[#ebd73f]" />
                      <span className="text-white font-semibold">1. Download brand-config.json</span>
                    </div>
                    <span className="text-[10px] text-slate-400 font-mono">JSON Config</span>
                  </button>

                  <button
                    onClick={() => downloadFile('tailwind-theme.js', generateTailwindConfig(), 'text/javascript')}
                    className="w-full p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-left flex items-center justify-between transition cursor-pointer"
                  >
                    <div className="flex items-center gap-2">
                      <Code2 className="w-4 h-4 text-[#ebd73f]" />
                      <span className="text-white font-semibold">2. Download tailwind-theme.js</span>
                    </div>
                    <span className="text-[10px] text-slate-400 font-mono">Tailwind Config</span>
                  </button>

                  <button
                    onClick={() => downloadFile('theme.css', generateCssVariables(), 'text/css')}
                    className="w-full p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-left flex items-center justify-between transition cursor-pointer"
                  >
                    <div className="flex items-center gap-2">
                      <Palette className="w-4 h-4 text-[#ebd73f]" />
                      <span className="text-white font-semibold">3. Download theme.css</span>
                    </div>
                    <span className="text-[10px] text-slate-400 font-mono">CSS Variables</span>
                  </button>
                </div>

                {/* Quick Copy Snippets */}
                <div className="pt-2 flex items-center gap-2">
                  <button
                    onClick={() => copyToClipboard(generateBrandConfigJson(), 'Configuration JSON')}
                    className="flex-1 py-2.5 px-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-mono text-[11px] flex items-center justify-center gap-1.5 transition cursor-pointer"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy JSON</span>
                  </button>

                  <button
                    onClick={handleDownloadAll}
                    className="flex-1 py-2.5 px-3 rounded-xl btn-dripp-primary font-bold text-[11px] flex items-center justify-center gap-1.5 transition cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5 text-black" />
                    <span>Download All Files</span>
                  </button>
                </div>

              </div>
            )}

          </div>

          {/* Bottom Actions */}
          <div className="pt-4 border-t border-white/10 flex items-center justify-between text-xs font-mono text-slate-400">
            <span>Niche: {selectedNiche.label}</span>
            <span className="text-[#ebd73f]">Status: Live Synchronized</span>
          </div>

        </div>

        {/* RIGHT COLUMN: Live Interactive Device Preview (7 cols) */}
        <div className="lg:col-span-7 bg-[#0c0c0c] border border-white/10 rounded-3xl p-5 sm:p-7 flex flex-col justify-between shadow-2xl overflow-hidden relative">
          
          {/* Top Bar of Preview */}
          <div className="flex items-center justify-between pb-4 border-b border-white/10">
            <div className="flex items-center gap-2 font-mono text-xs text-slate-400">
              <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: color10 }}></span>
              <span className="text-white font-bold">CLIENT PREVIEW: {brandName}</span>
              <span className="hidden sm:inline-block text-white/30">•</span>
              <span className="hidden sm:inline-block text-[11px] text-slate-400 font-mono">
                {fontPairing.name}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-bold">
                60-30-10 PASS
              </span>
            </div>
          </div>

          {/* Device Mockup Canvas */}
          <div className="my-6 flex items-center justify-center flex-grow overflow-y-auto">
            
            <div 
              className={`transition-all duration-500 shadow-2xl rounded-3xl overflow-hidden border border-white/15 ${
                deviceView === 'mobile' ? 'w-full max-w-[340px] aspect-[9/18]' : 'w-full aspect-[16/10]'
              }`}
              style={{ backgroundColor: color60 }}
            >
              
              {/* Simulated Navigation Bar */}
              <div 
                className="p-3.5 border-b border-white/10 flex items-center justify-between backdrop-blur-md sticky top-0 z-20"
                style={{ backgroundColor: `${color60}ee` }}
              >
                <div className="flex items-center gap-2.5">
                  {logoImage ? (
                    <img src={logoImage} alt={brandName} className="h-7 w-auto object-contain max-w-[70px]" />
                  ) : (
                    <div 
                      className="w-7 h-7 rounded-lg flex items-center justify-center font-black text-black text-xs shadow-md"
                      style={{ backgroundColor: color10 }}
                    >
                      {brandName.substring(0, 1).toUpperCase() || 'W'}
                    </div>
                  )}

                  <div>
                    <p className={`font-bold text-sm text-white leading-none ${fontPairing.classDisplay}`}>
                      {brandName}
                    </p>
                    <p className="text-[9px] font-mono text-slate-400 mt-0.5 leading-none">
                      {tagline.substring(0, 26)}...
                    </p>
                  </div>
                </div>

                <div 
                  className="px-2.5 py-1 rounded-full text-[10px] font-bold text-black shadow-md cursor-pointer font-clash"
                  style={{ backgroundColor: color10 }}
                  onClick={() => setTestModalOpen(true)}
                >
                  Book / Order
                </div>
              </div>

              {/* Simulated Hero Section */}
              <div className="p-5 text-center space-y-3 relative overflow-hidden">
                <div 
                  className="absolute -top-10 left-1/2 -translate-x-1/2 w-48 h-48 rounded-full blur-3xl opacity-20 pointer-events-none"
                  style={{ backgroundColor: color10 }}
                ></div>

                <span 
                  className="inline-block text-[10px] font-mono px-2.5 py-0.5 rounded-full border border-white/15 text-white/80"
                  style={{ backgroundColor: `${color30}aa` }}
                >
                  VERIFIED 60-30-10 WHITE-LABEL BUILD
                </span>

                <h2 className={`font-bold text-xl sm:text-2xl text-white tracking-tight leading-snug ${fontPairing.classDisplay}`}>
                  Experience <span style={{ color: color10 }}>{brandName}</span>
                </h2>

                <p className={`text-xs text-slate-300 max-w-sm mx-auto leading-relaxed ${fontPairing.classBody}`}>
                  {tagline}. Savor gourmet recipes, book reservations, and experience zero-wait service on your phone.
                </p>

                <div className="pt-2 flex items-center justify-center gap-2">
                  <button
                    onClick={() => setTestModalOpen(true)}
                    className="px-4 py-2 rounded-full font-bold text-xs text-black shadow-lg cursor-pointer transition hover:scale-105"
                    style={{ backgroundColor: color10 }}
                  >
                    Start Order &amp; Book
                  </button>
                  <button
                    className="px-3.5 py-2 rounded-full font-medium text-xs text-white border border-white/20 transition hover:bg-white/10"
                    style={{ backgroundColor: color30 }}
                  >
                    Explore Menu
                  </button>
                </div>
              </div>

              {/* Simulated Product / Service Cards (Styled in 30% Surface) */}
              <div className="p-4 pt-0 grid grid-cols-1 sm:grid-cols-2 gap-3">
                
                {/* Card 1 */}
                <div 
                  className="p-3.5 rounded-2xl border border-white/10 space-y-2 relative overflow-hidden"
                  style={{ backgroundColor: color30 }}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <p className={`font-bold text-xs text-white ${fontPairing.classDisplay}`}>
                        {selectedNiche.item1}
                      </p>
                      <p className="text-[10px] text-slate-400 mt-0.5">Chef's Signature Selection</p>
                    </div>
                    <span className="font-mono font-bold text-xs" style={{ color: color10 }}>
                      {currency}{selectedNiche.price1}
                    </span>
                  </div>

                  <button 
                    onClick={() => setTestModalOpen(true)}
                    className="w-full py-1.5 rounded-xl font-bold text-[10px] text-black transition cursor-pointer"
                    style={{ backgroundColor: color10 }}
                  >
                    Add / Book Instantly
                  </button>
                </div>

                {/* Card 2 */}
                <div 
                  className="p-3.5 rounded-2xl border border-white/10 space-y-2 relative overflow-hidden"
                  style={{ backgroundColor: color30 }}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <p className={`font-bold text-xs text-white ${fontPairing.classDisplay}`}>
                        {selectedNiche.item2}
                      </p>
                      <p className="text-[10px] text-slate-400 mt-0.5">Crafted Fresh On-Demand</p>
                    </div>
                    <span className="font-mono font-bold text-xs" style={{ color: color10 }}>
                      {currency}{selectedNiche.price2}
                    </span>
                  </div>

                  <button 
                    onClick={() => setTestModalOpen(true)}
                    className="w-full py-1.5 rounded-xl font-semibold text-[10px] text-white border border-white/20 transition hover:bg-white/10 cursor-pointer"
                  >
                    Select Option
                  </button>
                </div>

              </div>

            </div>

          </div>

          {/* Bottom Bar Controls */}
          <div className="pt-4 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-mono">
            <div className="flex items-center gap-2 text-slate-400">
              <span>Dominant: <strong className="text-white">{color60}</strong></span>
              <span>•</span>
              <span>Surface: <strong className="text-white">{color30}</strong></span>
              <span>•</span>
              <span>Accent: <strong style={{ color: color10 }}>{color10}</strong></span>
            </div>

            <button
              onClick={handleDownloadAll}
              className="text-[#ebd73f] hover:underline font-bold flex items-center gap-1 cursor-pointer"
            >
              <span>Download Brand Package</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

        </div>

      </main>

      {/* Interactive Simulation Modal Triggered from inside the preview */}
      <AnimatePresence>
        {testModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-md p-6 rounded-3xl border border-white/20 shadow-2xl text-center space-y-4"
              style={{ backgroundColor: color30 }}
            >
              <div 
                className="w-12 h-12 rounded-full mx-auto flex items-center justify-center text-black font-bold shadow-lg"
                style={{ backgroundColor: color10 }}
              >
                <Check className="w-6 h-6 stroke-[3]" />
              </div>

              <div>
                <h4 className={`font-bold text-lg text-white ${fontPairing.classDisplay}`}>
                  {brandName} Checkout Simulator
                </h4>
                <p className="text-xs text-slate-300 font-clash mt-1">
                  Testing customer checkout flow rendered with your 60-30-10 brand palette and typography.
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-black/60 border border-white/10 text-left text-xs font-mono space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">ITEM:</span>
                  <span className="text-white">{selectedNiche.item1}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">AMOUNT:</span>
                  <span className="font-bold" style={{ color: color10 }}>{currency}{selectedNiche.price1}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">STATUS:</span>
                  <span className="text-emerald-400">MOCK TOKEN ACTIVE</span>
                </div>
              </div>

              <button
                onClick={() => setTestModalOpen(false)}
                className="w-full py-2.5 rounded-xl font-bold text-xs text-black cursor-pointer shadow-lg"
                style={{ backgroundColor: color10 }}
              >
                Close Simulator
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
