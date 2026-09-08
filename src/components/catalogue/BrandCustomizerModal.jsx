import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  Palette, 
  Sliders, 
  Check, 
  Copy, 
  CheckCheck,
  Send,
  ArrowRight,
  Smartphone,
  Laptop
} from 'lucide-react';
import { sounds } from '../../utils/audio';

const PALETTES = [
  { id: 'yellow', name: 'Cyber Amber', hex: '#ebd73f', border: 'border-[#ebd73f]', text: 'text-[#ebd73f]', bg: 'bg-[#ebd73f]' },
  { id: 'cyan', name: 'Electric Cyan', hex: '#06b6d4', border: 'border-[#06b6d4]', text: 'text-[#06b6d4]', bg: 'bg-[#06b6d4]' },
  { id: 'emerald', name: 'Neon Emerald', hex: '#10b981', border: 'border-[#10b981]', text: 'text-[#10b981]', bg: 'bg-[#10b981]' },
  { id: 'purple', name: 'Ultra Violet', hex: '#a855f7', border: 'border-[#a855f7]', text: 'text-[#a855f7]', bg: 'bg-[#a855f7]' },
  { id: 'rose', name: 'Crimson Rose', hex: '#f43f5e', border: 'border-[#f43f5e]', text: 'text-[#f43f5e]', bg: 'bg-[#f43f5e]' }
];

const NICHES = [
  { id: 'cafes', name: 'Cafe & Restaurant', defaultName: 'The Artisan Roast', tag: 'TABLE QR & POS' },
  { id: 'clinics', name: 'Medical Clinic', defaultName: 'Apex Health Clinic', tag: 'SLOT SCHEDULER' },
  { id: 'gyms', name: 'Fitness & CrossFit', defaultName: 'Titan Performance Gym', tag: 'MEMBERSHIP & CLASSES' },
  { id: 'clubs', name: 'Nightclub & Lounge', defaultName: 'Velvet Sky Lounge', tag: 'VIP TABLES & GUESTLIST' },
  { id: 'turfs', name: 'Sports Turf', defaultName: 'Champions Arena', tag: 'HOURLY SLOTS' },
  { id: 'salons', name: 'Luxury Salon', defaultName: 'Maison Beauty Bar', tag: 'STYLIST APPOINTMENTS' },
];

export function BrandCustomizerModal({ isOpen, onClose, onOpenQuoteWithBrand }) {
  const [selectedNiche, setSelectedNiche] = useState(NICHES[0]);
  const [brandName, setBrandName] = useState(NICHES[0].defaultName);
  const [selectedPalette, setSelectedPalette] = useState(PALETTES[0]);
  const [currency, setCurrency] = useState('₹');
  const [copiedConfig, setCopiedConfig] = useState(false);

  if (!isOpen) return null;

  const handleSelectNiche = (niche) => {
    setSelectedNiche(niche);
    setBrandName(niche.defaultName);
    sounds.playClick();
  };

  const handleCopyJSON = () => {
    sounds.playPop();
    const configJson = JSON.stringify({
      niche: selectedNiche.id,
      brandName: brandName,
      primaryColor: selectedPalette.hex,
      currency: currency,
      timestamp: new Date().toISOString()
    }, null, 2);
    navigator.clipboard.writeText(configJson);
    setCopiedConfig(true);
    setTimeout(() => setCopiedConfig(false), 2500);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
        
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/85 backdrop-blur-xl -z-10"
        ></motion.div>

        {/* Modal Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="w-full max-w-4xl bg-[#0c0c0c] border border-white/15 rounded-3xl overflow-hidden shadow-2xl shadow-black my-8 flex flex-col max-h-[90vh]"
        >
          {/* Modal Header */}
          <div className="p-5 sm:p-6 border-b border-white/10 flex items-center justify-between bg-white/[0.02]">
            <div className="flex items-center gap-3">
              <div 
                className="w-10 h-10 rounded-xl flex items-center justify-center text-black font-bold shadow-lg"
                style={{ backgroundColor: selectedPalette.hex }}
              >
                <Sliders className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-panchang font-bold text-lg text-white flex items-center gap-2">
                  <span>Interactive Brand Simulator</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/10 text-white/80">
                    REAL-TIME
                  </span>
                </h3>
                <p className="text-xs text-slate-400 font-clash">
                  Customize business details and watch the white-labeled system adapt instantly.
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-white/70 hover:text-white transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Modal Body: Split Controls & Live Mockup */}
          <div className="grid grid-cols-1 lg:grid-cols-12 overflow-y-auto flex-grow divide-y lg:divide-y-0 lg:divide-x divide-white/10">
            
            {/* Left Controls (5 cols) */}
            <div className="lg:col-span-5 p-5 sm:p-6 space-y-5">
              
              {/* Step 1: Select Niche */}
              <div className="space-y-2">
                <label className="text-[11px] font-mono text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                  <span>1. Select Business Niche</span>
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {NICHES.map((n) => (
                    <button
                      key={n.id}
                      onClick={() => handleSelectNiche(n)}
                      className={`p-2.5 rounded-xl text-left border transition text-xs font-clash ${
                        selectedNiche.id === n.id
                          ? 'bg-white/15 border-white text-white font-bold'
                          : 'bg-white/[0.03] border-white/10 text-white/60 hover:text-white hover:bg-white/[0.07]'
                      }`}
                    >
                      <p className="leading-tight">{n.name}</p>
                      <p className="text-[9px] font-mono opacity-50 mt-0.5">{n.tag}</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Step 2: Brand Name Input */}
              <div className="space-y-2">
                <label className="text-[11px] font-mono text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                  <span>2. Business / Brand Name</span>
                </label>
                <input
                  type="text"
                  value={brandName}
                  onChange={(e) => setBrandName(e.target.value)}
                  placeholder="Enter your brand name..."
                  className="w-full px-4 py-2.5 rounded-xl bg-black border border-white/20 text-white font-clash text-sm focus:outline-none focus:border-[#ebd73f] transition"
                />
              </div>

              {/* Step 3: Color Accent Palette */}
              <div className="space-y-2">
                <label className="text-[11px] font-mono text-slate-400 uppercase tracking-wider flex items-center justify-between">
                  <span>3. Accent Color Theme</span>
                  <span className="text-[10px] font-mono" style={{ color: selectedPalette.hex }}>
                    {selectedPalette.name}
                  </span>
                </label>
                <div className="flex items-center gap-2.5">
                  {PALETTES.map((pal) => (
                    <button
                      key={pal.id}
                      onClick={() => {
                        sounds.playClick();
                        setSelectedPalette(pal);
                      }}
                      className={`w-9 h-9 rounded-xl border-2 flex items-center justify-center transition-all ${
                        selectedPalette.id === pal.id 
                          ? 'scale-110 border-white shadow-lg' 
                          : 'border-transparent opacity-70 hover:opacity-100'
                      }`}
                      style={{ backgroundColor: pal.hex }}
                    >
                      {selectedPalette.id === pal.id && <Check className="w-4 h-4 text-black" />}
                    </button>
                  ))}
                </div>
              </div>

              {/* Step 4: Currency */}
              <div className="space-y-2">
                <label className="text-[11px] font-mono text-slate-400 uppercase tracking-wider">
                  <span>4. Operating Currency</span>
                </label>
                <div className="flex items-center gap-2">
                  {['₹', '$', '£', '€', 'AED'].map((cur) => (
                    <button
                      key={cur}
                      onClick={() => {
                        sounds.playClick();
                        setCurrency(cur);
                      }}
                      className={`flex-1 py-1.5 rounded-xl border text-xs font-mono font-bold transition ${
                        currency === cur 
                          ? 'bg-white/20 border-white text-white' 
                          : 'bg-white/[0.03] border-white/10 text-white/60 hover:text-white'
                      }`}
                    >
                      {cur}
                    </button>
                  ))}
                </div>
              </div>

              {/* Quick Actions */}
              <div className="pt-2 flex flex-col gap-2">
                <button
                  onClick={handleCopyJSON}
                  className="w-full py-2.5 px-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-mono text-slate-300 flex items-center justify-center gap-2 transition"
                >
                  {copiedConfig ? (
                    <>
                      <CheckCheck className="w-4 h-4 text-emerald-400" />
                      <span className="text-emerald-400 font-bold">White-Label JSON Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4 text-slate-400" />
                      <span>Copy White-Label Config JSON</span>
                    </>
                  )}
                </button>
              </div>

            </div>

            {/* Right Live Simulation Preview (7 cols) */}
            <div className="lg:col-span-7 p-5 sm:p-6 bg-black flex flex-col justify-between">
              
              {/* Preview Window Header */}
              <div className="flex items-center justify-between pb-4 border-b border-white/10 text-xs font-mono text-slate-400">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: selectedPalette.hex }}></span>
                  <span className="text-white font-bold">LIVE WHITE-LABEL PREVIEW</span>
                </div>
                <div className="flex items-center gap-2">
                  <Laptop className="w-4 h-4 text-slate-400" />
                  <Smartphone className="w-4 h-4 text-slate-400" />
                </div>
              </div>

              {/* Simulated UI Card */}
              <div className="my-5 p-5 rounded-2xl bg-[#141414] border border-white/15 space-y-4 shadow-2xl relative overflow-hidden">
                
                {/* Dynamic Ambient light */}
                <div 
                  className="absolute -top-20 -right-20 w-48 h-48 rounded-full blur-3xl opacity-30 pointer-events-none"
                  style={{ backgroundColor: selectedPalette.hex }}
                ></div>

                {/* Simulated Brand Nav */}
                <div className="flex items-center justify-between pb-3 border-b border-white/10">
                  <div className="flex items-center gap-2.5">
                    <div 
                      className="w-8 h-8 rounded-lg flex items-center justify-center font-black font-panchang text-black text-xs"
                      style={{ backgroundColor: selectedPalette.hex }}
                    >
                      {brandName.substring(0, 1) || 'W'}
                    </div>
                    <div>
                      <p className="font-panchang font-bold text-sm text-white leading-none">
                        {brandName || 'Your Brand'}
                      </p>
                      <p className="text-[9px] font-mono tracking-widest text-slate-400 mt-0.5">
                        POWERED BY DRIPP WHITE-LABEL
                      </p>
                    </div>
                  </div>

                  <span 
                    className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full border text-black"
                    style={{ backgroundColor: selectedPalette.hex, borderColor: selectedPalette.hex }}
                  >
                    ONLINE PORTAL
                  </span>
                </div>

                {/* Simulated Hero Banner */}
                <div className="p-4 rounded-xl bg-black/60 border border-white/10 space-y-2">
                  <p className="text-[10px] font-mono tracking-wider uppercase text-slate-400">
                    {selectedNiche.name} System Active
                  </p>
                  <h4 className="font-panchang font-bold text-base sm:text-lg text-white leading-snug">
                    Welcome to <span style={{ color: selectedPalette.hex }}>{brandName || 'Your Brand'}</span>
                  </h4>
                  <p className="text-xs text-slate-300">
                    Instant customer reservations, order management, and secure checkouts calibrated for your brand identity.
                  </p>
                </div>

                {/* Simulated Item / Service Cards */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 rounded-xl bg-black/40 border border-white/10 space-y-1">
                    <p className="text-xs font-bold text-white font-clash">
                      {selectedNiche.id === 'cafes' ? 'Chef Signature Special' :
                       selectedNiche.id === 'clinics' ? 'Consultation & X-Ray' :
                       selectedNiche.id === 'gyms' ? 'Full Access Pass' :
                       selectedNiche.id === 'clubs' ? 'VIP Lounge Table' :
                       selectedNiche.id === 'turfs' ? 'Peak Hour Turf Slot' : 'Luxury Hair Spa'}
                    </p>
                    <p className="text-xs font-mono font-bold" style={{ color: selectedPalette.hex }}>
                      {currency}{selectedNiche.id === 'cafes' ? '349' : selectedNiche.id === 'clubs' ? '15,000' : '999'}
                    </p>
                    <button 
                      className="w-full py-1.5 rounded-lg text-[10px] font-bold text-black transition mt-1"
                      style={{ backgroundColor: selectedPalette.hex }}
                    >
                      Instant Book
                    </button>
                  </div>

                  <div className="p-3 rounded-xl bg-black/40 border border-white/10 space-y-1">
                    <p className="text-xs font-bold text-white font-clash">
                      {selectedNiche.id === 'cafes' ? 'Artisanal Cold Brew' :
                       selectedNiche.id === 'clinics' ? 'Cosmetic Smile Care' :
                       selectedNiche.id === 'gyms' ? 'CrossFit Group Pass' :
                       selectedNiche.id === 'clubs' ? 'Guestlist RSVP Pass' :
                       selectedNiche.id === 'turfs' ? 'Floodlight Night Slot' : 'Glass Skin Facial'}
                    </p>
                    <p className="text-xs font-mono font-bold" style={{ color: selectedPalette.hex }}>
                      {currency}{selectedNiche.id === 'cafes' ? '180' : selectedNiche.id === 'clubs' ? '0' : '1,499'}
                    </p>
                    <button 
                      className="w-full py-1.5 rounded-lg text-[10px] font-bold text-white border border-white/20 transition mt-1 hover:bg-white/10"
                    >
                      Select
                    </button>
                  </div>
                </div>

              </div>

              {/* Bottom Inquire Button */}
              <button
                onClick={() => {
                  sounds.playClick();
                  onClose();
                  if (onOpenQuoteWithBrand) {
                    onOpenQuoteWithBrand({
                      niche: selectedNiche.id,
                      brandName: brandName,
                      color: selectedPalette.hex
                    });
                  }
                }}
                className="w-full py-3.5 px-6 rounded-full font-bold text-xs flex items-center justify-center gap-2 text-black shadow-xl cursor-pointer transition hover:scale-[1.02]"
                style={{ backgroundColor: selectedPalette.hex }}
              >
                <span>Request White-Label Build for "{brandName}"</span>
                <ArrowRight className="w-4 h-4" />
              </button>

            </div>

          </div>

        </motion.div>

      </div>
    </AnimatePresence>
  );
}
