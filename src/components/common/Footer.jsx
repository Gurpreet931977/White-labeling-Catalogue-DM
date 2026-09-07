import React from 'react';
import { MapPin, Phone, Clock, Send, Navigation, Mail, ArrowUpRight, Sparkles } from 'lucide-react';
import { BRAND_CONFIG } from '../../data/cafeConfig';
import { sounds } from '../../utils/audio';

export function Footer({ onNavigateMenu, onOpenScanner }) {
  return (
    <footer className="bg-[#0D0B0A] border-t border-white/10 text-stone-400 text-xs relative overflow-hidden text-left">
      
      {/* Top Dramatic Signoff Statement */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 sm:pt-24 pb-12 border-b border-white/10">
        
        <div className="space-y-4 mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-white/5 border border-white/10 text-[10px] font-mono text-stone-300 uppercase tracking-widest">
            <Sparkles className="w-3 h-3 text-[#D04834]" />
            <span>ARRIVEDERCI // SEE YOU SOON</span>
          </div>

          <h2 className="font-editorial text-5xl sm:text-7xl lg:text-9xl font-black text-white tracking-tight leading-[0.95]">
            Ciao, for now<span className="text-[#D04834]">.</span>
          </h2>

          <p className="font-editorial-italic text-lg sm:text-2xl text-stone-300 max-w-xl">
            La vita è bella. Made for slow days, artisan Italian plates, and lingering conversations.
          </p>
        </div>

        {/* Quick Action Bar */}
        <div className="flex flex-wrap items-center gap-4 pt-4">
          <button
            onClick={() => { sounds.playClick(); onNavigateMenu(); }}
            className="px-6 py-3 rounded-xl bg-[#FAF7F2] text-[#12100E] font-syne font-black text-xs uppercase tracking-wider hover:bg-[#E8E0D2] transition cursor-pointer"
          >
            Explore Digital Menu
          </button>

          <a
            href={`https://wa.me/${BRAND_CONFIG.contact.whatsapp}`}
            target="_blank"
            rel="noreferrer"
            className="px-6 py-3 rounded-xl bg-[#1C1815] hover:bg-[#25201C] text-stone-200 border border-white/15 font-mono text-xs uppercase tracking-wider flex items-center gap-2 transition"
          >
            <Send className="w-3.5 h-3.5 text-emerald-400" />
            <span>Concierge WhatsApp</span>
          </a>

          <button
            onClick={() => { sounds.playClick(); onOpenScanner(); }}
            className="px-6 py-3 rounded-xl bg-[#1C1815] hover:bg-[#25201C] text-stone-200 border border-white/15 font-mono text-xs uppercase tracking-wider flex items-center gap-2 transition cursor-pointer"
          >
            <span>Scan Table Plaque</span>
          </button>
        </div>

      </div>

      {/* Structured Editorial Columns */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-10">
          
          {/* Col 1: Brand & Soul */}
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-[#FAF7F2] text-[#12100E] flex items-center justify-center font-black font-syne text-sm">
                {BRAND_CONFIG.logoInitials}
              </div>
              <h4 className="font-editorial text-base font-bold text-white">
                {BRAND_CONFIG.brandName}
              </h4>
            </div>
            <p className="text-stone-400 text-xs leading-relaxed">
              {BRAND_CONFIG.tagline}. Authentic wood-fired culinary craft and single-origin roastery.
            </p>
            <p className="text-[10px] font-mono text-stone-500 uppercase tracking-widest">
              VOL. IV // MILANO ENERGY
            </p>
          </div>

          {/* Col 2: Orari & Hours */}
          <div className="space-y-2.5 font-mono">
            <h5 className="text-[11px] font-bold text-stone-200 uppercase tracking-widest">
              Orari di Apertura
            </h5>
            <div className="space-y-2 text-xs">
              <div className="flex items-start gap-2.5 text-stone-300">
                <Clock className="w-3.5 h-3.5 text-[#D04834] shrink-0 mt-0.5" />
                <div>
                  <p className="text-white font-semibold">{BRAND_CONFIG.contact.openingHours}</p>
                  <p className="text-[10px] text-stone-500">Continuous kitchen operations</p>
                </div>
              </div>
              <p className="text-[10px] text-stone-400">
                Breakfast • Lunch • Aperitivo • Late Dinner
              </p>
            </div>
          </div>

          {/* Col 3: Contatti */}
          <div className="space-y-2.5 font-mono">
            <h5 className="text-[11px] font-bold text-stone-200 uppercase tracking-widest">
              Prenotazioni & Contatti
            </h5>
            <div className="space-y-2 text-xs">
              <div className="flex items-start gap-2.5 text-stone-300">
                <Phone className="w-3.5 h-3.5 text-[#E8E439] shrink-0 mt-0.5" />
                <div>
                  <p className="text-white font-semibold">{BRAND_CONFIG.contact.phone}</p>
                  <p className="text-[10px] text-stone-500">Table booking & inquiries</p>
                </div>
              </div>
              {BRAND_CONFIG.contact.email && (
                <div className="flex items-start gap-2.5 text-stone-300">
                  <Mail className="w-3.5 h-3.5 text-stone-400 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-white font-semibold">{BRAND_CONFIG.contact.email}</p>
                    <p className="text-[10px] text-stone-500">Direct assistance</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Col 4: Posizione */}
          <div className="space-y-2.5 font-mono">
            <h5 className="text-[11px] font-bold text-stone-200 uppercase tracking-widest">
              Posizione Geografica
            </h5>
            <div className="p-3.5 rounded-2xl bg-[#161311] border border-white/10 space-y-2 text-xs">
              <div className="flex items-start gap-2 text-stone-300">
                <MapPin className="w-3.5 h-3.5 text-[#D04834] shrink-0 mt-0.5" />
                <span className="text-[11px] leading-snug">{BRAND_CONFIG.contact.fullAddress}</span>
              </div>
              <a
                href={BRAND_CONFIG.contact.googleMapsUrl}
                target="_blank"
                rel="noreferrer"
                className="w-full py-2 px-3 rounded-lg bg-white/5 hover:bg-white/10 text-white font-mono text-[11px] font-semibold transition flex items-center justify-center gap-1.5"
              >
                <Navigation className="w-3 h-3" />
                <span>Open in Google Maps</span>
              </a>
            </div>
          </div>

        </div>

        {/* Bottom Colophon Bar */}
        <div className="mt-12 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-[10px] text-stone-500 font-mono">
          <p>
            © {new Date().getFullYear()} {BRAND_CONFIG.brandName} • {BRAND_CONFIG.contact.city}. All rights reserved.
          </p>
          <div className="flex items-center gap-2 text-stone-400">
            <span>Crafted for high-fashion hospitality by</span>
            <a
              href="https://www.drippmedia.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#FAF7F2] font-bold hover:underline"
            >
              Dripp Media
            </a>
          </div>
        </div>

      </div>
    </footer>
  );
}
