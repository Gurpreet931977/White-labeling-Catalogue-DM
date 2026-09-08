import React from 'react';
import { MapPin, Phone, Clock, Send, Navigation, Mail, ArrowUpRight, Crown } from 'lucide-react';
import { BRAND_CONFIG } from '../../data/cafeConfig';
import { useTheme } from '../../context/ThemeContext';
import { sounds } from '../../utils/audio';

export function Footer({ onNavigateMenu, onOpenScanner }) {
  const { isLight } = useTheme();

  return (
    <footer className={`border-t text-xs relative overflow-hidden text-left transition-colors duration-300 ${
      isLight ? 'bg-[#FAF7F2] border-black/10 text-stone-600' : 'bg-[#0D0B0A] border-white/10 text-stone-400'
    }`}>
      
      {/* Top Dramatic Signoff Statement */}
      <div className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 sm:pt-24 pb-12 border-b ${
        isLight ? 'border-black/10' : 'border-white/10'
      }`}>
        
        <div className="space-y-4 mb-10">
          <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-md border text-[10px] font-mono uppercase tracking-widest ${
            isLight ? 'bg-black/5 border-black/10 text-stone-700' : 'bg-white/5 border-white/10 text-stone-300'
          }`}>
            <Crown className="w-3 h-3 text-[#D04834]" />
            <span>SEE YOU SOON // ALWAYS WELCOME</span>
          </div>

          <h2 className={`font-editorial text-5xl sm:text-7xl lg:text-9xl font-black tracking-tight leading-[0.95] ${
            isLight ? 'text-[#12100E]' : 'text-white'
          }`}>
            Warm Welcome, Always<span className="text-[#D04834]">.</span>
          </h2>

          <p className={`font-editorial-italic text-lg sm:text-2xl max-w-xl ${
            isLight ? 'text-stone-700' : 'text-stone-300'
          }`}>
            Crafted for slow days, freshly made artisan plates, and lingering conversations.
          </p>
        </div>

        {/* Quick Action Bar */}
        <div className="flex flex-wrap items-center gap-4 pt-4">
          <button
            onClick={() => { sounds.playClick(); onNavigateMenu(); }}
            className={`px-6 py-3 rounded-xl font-syne font-black text-xs uppercase tracking-wider transition cursor-pointer shadow-md ${
              isLight ? 'bg-[#12100E] text-[#FAF7F2] hover:bg-black' : 'bg-[#FAF7F2] text-[#12100E] hover:bg-[#E8E0D2]'
            }`}
          >
            Explore Digital Menu
          </button>

          <a
            href={`https://wa.me/${BRAND_CONFIG.contact.whatsapp}`}
            target="_blank"
            rel="noreferrer"
            className={`px-6 py-3 rounded-xl border font-mono text-xs uppercase tracking-wider flex items-center gap-2 transition ${
              isLight
                ? 'bg-[#EAE4D9] hover:bg-[#DFD8CC] text-[#12100E] border-black/15'
                : 'bg-[#1C1815] hover:bg-[#25201C] text-stone-200 border-white/15'
            }`}
          >
            <Send className="w-3.5 h-3.5 text-emerald-600" />
            <span>Concierge WhatsApp</span>
          </a>

          <button
            onClick={() => { sounds.playClick(); onOpenScanner(); }}
            className={`px-6 py-3 rounded-xl border font-mono text-xs uppercase tracking-wider flex items-center gap-2 transition cursor-pointer ${
              isLight
                ? 'bg-[#EAE4D9] hover:bg-[#DFD8CC] text-[#12100E] border-black/15'
                : 'bg-[#1C1815] hover:bg-[#25201C] text-stone-200 border-white/15'
            }`}
          >
            <span className="hidden sm:inline">Select Dining Table</span>
            <span className="sm:hidden">Select Table</span>
          </button>
        </div>

      </div>

      {/* Structured Editorial Columns */}
      <div className={`transition-colors duration-300 ${isLight ? 'bg-[#F5F0E6]' : 'bg-transparent'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-10">
            
            {/* Col 1: Brand & Soul */}
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-black font-syne text-sm ${
                  isLight ? 'bg-[#12100E] text-[#FAF7F2]' : 'bg-[#FAF7F2] text-[#12100E]'
                }`}>
                  {BRAND_CONFIG.logoInitials}
                </div>
                <h4 className={`font-editorial text-base font-bold ${isLight ? 'text-[#12100E]' : 'text-white'}`}>
                  {BRAND_CONFIG.brandName}
                </h4>
              </div>
              <p className={`text-xs leading-relaxed ${isLight ? 'text-stone-600' : 'text-stone-400'}`}>
                {BRAND_CONFIG.tagline}. Authentic wood-fired culinary craft and single-origin roastery.
              </p>
              <p className="text-[10px] font-mono opacity-60 uppercase tracking-widest">
                ARTISAN KITCHEN & BISTRO
              </p>
            </div>

            {/* Col 2: Opening Hours */}
            <div className="space-y-2.5 font-mono">
              <h5 className={`text-[11px] font-bold uppercase tracking-widest ${isLight ? 'text-[#12100E]' : 'text-stone-200'}`}>
                Opening Hours
              </h5>
              <div className="space-y-2 text-xs">
                <div className="flex items-start gap-2.5">
                  <Clock className="w-3.5 h-3.5 text-[#D04834] shrink-0 mt-0.5" />
                  <div>
                    <p className={`font-semibold ${isLight ? 'text-[#12100E]' : 'text-white'}`}>
                      {BRAND_CONFIG.contact.openingHours}
                    </p>
                    <p className="text-[10px] opacity-60">Continuous kitchen operations</p>
                  </div>
                </div>
                <p className="text-[10px] opacity-80">
                  Breakfast • Lunch • Evening • Late Dinner
                </p>
              </div>
            </div>

            {/* Col 3: Reservations & Contact */}
            <div className="space-y-2.5 font-mono">
              <h5 className={`text-[11px] font-bold uppercase tracking-widest ${isLight ? 'text-[#12100E]' : 'text-stone-200'}`}>
                Reservations & Contact
              </h5>
              <div className="space-y-2 text-xs">
                <div className="flex items-start gap-2.5">
                  <Phone className="w-3.5 h-3.5 text-[#D04834] shrink-0 mt-0.5" />
                  <div>
                    <p className={`font-semibold ${isLight ? 'text-[#12100E]' : 'text-white'}`}>
                      {BRAND_CONFIG.contact.phone}
                    </p>
                    <p className="text-[10px] opacity-60">Table booking & inquiries</p>
                  </div>
                </div>
                {BRAND_CONFIG.contact.email && (
                  <div className="flex items-start gap-2.5">
                    <Mail className="w-3.5 h-3.5 opacity-60 shrink-0 mt-0.5" />
                    <div>
                      <p className={`font-semibold ${isLight ? 'text-[#12100E]' : 'text-white'}`}>
                        {BRAND_CONFIG.contact.email}
                      </p>
                      <p className="text-[10px] opacity-60">Direct assistance</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Col 4: Location & Directions */}
            <div className="space-y-2.5 font-mono">
              <h5 className={`text-[11px] font-bold uppercase tracking-widest ${isLight ? 'text-[#12100E]' : 'text-stone-200'}`}>
                Location & Directions
              </h5>
              <div className={`p-3.5 rounded-2xl border space-y-2 text-xs ${
                isLight ? 'bg-white border-black/10' : 'bg-[#161311] border-white/10'
              }`}>
                <div className="flex items-start gap-2">
                  <MapPin className="w-3.5 h-3.5 text-[#D04834] shrink-0 mt-0.5" />
                  <span className="text-[11px] leading-snug">{BRAND_CONFIG.contact.fullAddress}</span>
                </div>
                <a
                  href={BRAND_CONFIG.contact.googleMapsUrl}
                  target="_blank"
                  rel="noreferrer"
                  className={`w-full py-2 px-3 rounded-lg font-mono text-[11px] font-semibold transition flex items-center justify-center gap-1.5 ${
                    isLight ? 'bg-black/5 hover:bg-black/10 text-[#12100E]' : 'bg-white/5 hover:bg-white/10 text-white'
                  }`}
                >
                  <Navigation className="w-3 h-3" />
                  <span>Open in Google Maps</span>
                </a>
              </div>
            </div>

          </div>

          {/* Bottom Colophon Bar */}
          <div className={`mt-12 pt-6 border-t flex flex-col sm:flex-row items-center justify-between gap-3 text-[10px] font-mono ${
            isLight ? 'border-black/10 text-stone-500' : 'border-white/10 text-stone-500'
          }`}>
            <p>
              © {new Date().getFullYear()} {BRAND_CONFIG.brandName} • {BRAND_CONFIG.contact.city}. All rights reserved.
            </p>
            <div className="flex items-center gap-2">
              <span>Crafted for high-fashion hospitality by</span>
              <a
                href="https://www.drippmedia.com"
                target="_blank"
                rel="noopener noreferrer"
                className={`font-bold hover:underline ${isLight ? 'text-[#12100E]' : 'text-[#FAF7F2]'}`}
              >
                Dripp Media
              </a>
            </div>
          </div>

        </div>
      </div>
    </footer>
  );
}
