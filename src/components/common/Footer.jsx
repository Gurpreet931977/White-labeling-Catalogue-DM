import React from 'react';
import { MapPin, Phone, Clock, Instagram, Send, Navigation, Mail } from 'lucide-react';
import { BRAND_CONFIG } from '../../data/cafeConfig';
import { sounds } from '../../utils/audio';

export function Footer({ onNavigateMenu, onOpenScanner }) {
  return (
    <footer className="bg-slate-950 border-t border-white/5 text-slate-400 text-xs mt-20 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          
          {/* Col 1: Brand */}
          <div className="space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-amber-400 flex items-center justify-center font-black text-slate-950 text-base font-syne">
                {BRAND_CONFIG.logoInitials}
              </div>
              <h4 className="text-white font-syne font-bold text-base uppercase">
                {BRAND_CONFIG.brandName}
              </h4>
            </div>
            <p className="text-xs leading-relaxed text-slate-400 max-w-xs">
              {BRAND_CONFIG.tagline}. Sizzling platters, signature specials, and hot beverages served directly to your table.
            </p>
            <div className="flex items-center gap-2 pt-1">
              <a
                href={`https://wa.me/${BRAND_CONFIG.contact.whatsapp}`}
                target="_blank"
                rel="noreferrer"
                className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-emerald-500/20 hover:text-emerald-400 text-slate-300 font-semibold text-xs transition flex items-center gap-1.5"
              >
                <Send className="w-3.5 h-3.5" />
                <span>WhatsApp Us</span>
              </a>
            </div>
          </div>

          {/* Col 2: Navigation */}
          <div className="space-y-2.5">
            <h5 className="text-white font-syne font-semibold text-xs uppercase tracking-wider">
              Quick Links
            </h5>
            <ul className="space-y-1.5 text-xs text-slate-400">
              <li>
                <button
                  onClick={() => { sounds.playClick(); onNavigateMenu(); }}
                  className="hover:text-amber-400 transition"
                >
                  Explore Digital Menu
                </button>
              </li>
              <li>
                <button
                  onClick={() => { sounds.playClick(); onOpenScanner(); }}
                  className="hover:text-amber-400 transition"
                >
                  Table QR Scanner
                </button>
              </li>
              <li>
                <span>Live Table Plaque Ordering</span>
              </li>
              <li>
                <span>Chef Specials & Sizzlers</span>
              </li>
            </ul>
          </div>

          {/* Col 3: Timings & Contact */}
          <div className="space-y-2.5">
            <h5 className="text-white font-syne font-semibold text-xs uppercase tracking-wider">
              Timing & Contact
            </h5>
            <div className="space-y-2 text-xs">
              <div className="flex items-start gap-2 text-slate-300">
                <Clock className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-white">{BRAND_CONFIG.contact.openingHours}</p>
                  <p className="text-[11px] text-slate-500">Continuous kitchen operations</p>
                </div>
              </div>
              <div className="flex items-start gap-2 text-slate-300">
                <Phone className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-white">{BRAND_CONFIG.contact.phone}</p>
                  <p className="text-[11px] text-slate-500">Table booking & queries</p>
                </div>
              </div>
              {BRAND_CONFIG.contact.email && (
                <div className="flex items-start gap-2 text-slate-300">
                  <Mail className="w-3.5 h-3.5 text-rose-400 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-white">{BRAND_CONFIG.contact.email}</p>
                    <p className="text-[11px] text-slate-500">Support & feedback</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Col 4: Location */}
          <div className="space-y-2.5">
            <h5 className="text-white font-syne font-semibold text-xs uppercase tracking-wider">
              Location Landmark
            </h5>
            <div className="p-3.5 rounded-2xl bg-slate-900 border border-white/5 space-y-2.5 text-xs">
              <div className="flex items-start gap-2 text-slate-300">
                <MapPin className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                <span>{BRAND_CONFIG.contact.fullAddress}</span>
              </div>
              <a
                href={BRAND_CONFIG.contact.googleMapsUrl}
                target="_blank"
                rel="noreferrer"
                className="w-full py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 font-mono text-xs font-semibold transition flex items-center justify-center gap-1.5"
              >
                <Navigation className="w-3.5 h-3.5" /> Open in Google Maps
              </a>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="mt-10 pt-6 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-slate-500">
          <p className="font-mono">
            © {new Date().getFullYear()} {BRAND_CONFIG.brandName} • {BRAND_CONFIG.contact.city}.
          </p>
          <div className="flex items-center gap-1.5 text-xs text-slate-400">
            <span>Designed with passion by</span>
            <a
              href="https://www.drippmedia.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-amber-400 font-bold hover:text-amber-300 transition hover:underline"
            >
              Dripp Media
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
