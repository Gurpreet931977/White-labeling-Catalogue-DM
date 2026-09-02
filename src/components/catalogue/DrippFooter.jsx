import React from 'react';
import { ArrowUpRight, Globe } from 'lucide-react';
import { sounds } from '../../utils/audio';

export function DrippFooter({ onOpenCustomizer, onOpenQuote }) {
  return (
    <footer className="border-t border-white/10 bg-[#060606] text-white pt-16 pb-12 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto space-y-12">
        
        {/* Top Branding & CTAs */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          
          <div className="md:col-span-6 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#ebd73f] text-black font-black font-panchang flex items-center justify-center text-base">
                D
              </div>
              <span className="font-panchang font-bold text-2xl tracking-wider">
                DRIPP MEDIA
              </span>
            </div>
            <p className="text-slate-400 font-clash text-sm max-w-md leading-relaxed">
              Global creative &amp; digital branding agency offering turnkey white-label web development, video editing, videography, and high-conversion software architecture.
            </p>
            <div className="flex items-center gap-4 text-xs font-mono text-slate-400 pt-2">
              <span className="flex items-center gap-1.5 text-[#ebd73f]">
                <span className="w-2 h-2 rounded-full bg-[#ebd73f] animate-pulse"></span>
                <span>GLOBAL DELIVERY ACTIVE</span>
              </span>
              <span>•</span>
              <span>DEHRADUN, INDIA</span>
            </div>
          </div>

          <div className="md:col-span-3 space-y-3">
            <p className="font-mono text-xs uppercase tracking-widest text-[#ebd73f]">
              White-Label Niches
            </p>
            <ul className="space-y-2 text-xs font-clash text-slate-300">
              <li>• Cafes, Eateries &amp; Lounges</li>
              <li>• Clinics &amp; Healthcare</li>
              <li>• Gyms &amp; CrossFit Studios</li>
              <li>• Nightclubs &amp; VIP Lounges</li>
              <li>• Sports Turfs &amp; Box Arenas</li>
              <li>• Luxury Salons &amp; Aesthetics</li>
            </ul>
          </div>

          <div className="md:col-span-3 space-y-3">
            <p className="font-mono text-xs uppercase tracking-widest text-[#ebd73f]">
              Direct Engagement
            </p>
            <div className="space-y-2 text-xs font-clash">
              <button
                onClick={() => { sounds.playClick(); onOpenQuote(); }}
                className="w-full btn-dripp-primary py-2.5 px-4 font-bold flex items-center justify-center gap-2 cursor-pointer shadow-lg"
              >
                <span>Request Custom Quote</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={() => { sounds.playClick(); onOpenCustomizer(); }}
                className="w-full btn-dripp-secondary py-2.5 px-4 font-semibold flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Interactive Brand Simulator</span>
              </button>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-slate-400">
          <p>© {new Date().getFullYear()} Dripp Media. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <a 
              href="https://www.drippmedia.com" 
              target="_blank" 
              rel="noreferrer" 
              className="hover:text-white transition flex items-center gap-1"
            >
              <Globe className="w-3.5 h-3.5" />
              <span>drippmedia.com</span>
            </a>
            <span>•</span>
            <span className="text-[#ebd73f]">DEVELOPER MODE ACTIVE</span>
          </div>
        </div>

      </div>
    </footer>
  );
}
