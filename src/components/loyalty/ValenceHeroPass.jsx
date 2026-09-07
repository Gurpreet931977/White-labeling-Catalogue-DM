import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  QrCode, 
  Flame, 
  Copy, 
  Check, 
  ShieldCheck,
  Maximize2
} from 'lucide-react';
import { sounds } from '../../utils/audio';
import { CircularStampBadge } from './CircularStampBadge';

export function ValenceHeroPass({ customer, tier, totalSlots = 6, onShowQrModal }) {
  const [isCopied, setIsCopied] = useState(false);

  const handleCopyId = (e) => {
    e.stopPropagation();
    sounds.playClick();
    navigator.clipboard?.writeText(customer?.phone || customer?.id || '9876543210');
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const xpPercent = Math.min(100, ((customer?.xp || 420) / 650) * 100);
  const memberId = customer?.phone || '9876543210';

  return (
    <div className="relative select-none group">
      
      {/* BACKGROUND HARD GRAPHIC SHADOW BLOCK (Asymmetrical Offset) */}
      <div className="absolute inset-0 translate-x-2.5 translate-y-2.5 bg-[#1F1614] rounded-3xl -z-10 transition-transform duration-300 group-hover:translate-x-3.5 group-hover:translate-y-3.5" />

      {/* COLLECTIBLE PHYSICAL TICKET ARTIFACT */}
      <motion.div
        whileHover={{ y: -3, rotate: 0.5 }}
        whileTap={{ scale: 0.99 }}
        onClick={() => {
          sounds.playScanSuccess();
          if (onShowQrModal) onShowQrModal();
        }}
        className="relative w-full rounded-3xl bg-[#7A1F1F] text-[#F2ECD8] border-3 border-[#1F1614] cursor-pointer overflow-hidden transition-all duration-300"
      >
        {/* Physical Left Ticket Notch on Perforation Line */}
        <div className="absolute -left-3.5 top-[64%] -translate-y-1/2 w-7 h-7 rounded-full bg-[#F2ECD8] border-r-3 border-[#1F1614] z-20" />
        
        {/* Physical Right Ticket Notch on Perforation Line */}
        <div className="absolute -right-3.5 top-[64%] -translate-y-1/2 w-7 h-7 rounded-full bg-[#F2ECD8] border-l-3 border-[#1F1614] z-20" />

        {/* Paper Grain Subtle Texture */}
        <div className="absolute inset-0 bg-halftone-dots pointer-events-none opacity-20" />

        {/* Technical Corner Crosshairs (Brutalist Print Marks) */}
        <span className="absolute top-2.5 left-4 text-[10px] font-mono font-bold text-[#F2ECD8]/30 pointer-events-none">+</span>
        <span className="absolute top-2.5 right-4 text-[10px] font-mono font-bold text-[#F2ECD8]/30 pointer-events-none">+</span>
        <span className="absolute bottom-2.5 left-4 text-[10px] font-mono font-bold text-[#F2ECD8]/30 pointer-events-none">+</span>
        <span className="absolute bottom-2.5 right-4 text-[10px] font-mono font-bold text-[#F2ECD8]/30 pointer-events-none">+</span>

        {/* ============================================================= */}
        {/* MAIN CREDENTIAL BODY (TOP HALF)                               */}
        {/* ============================================================= */}
        <div className="p-6 sm:p-7 relative z-10 space-y-5">
          
          {/* Header Metadata Ribbon */}
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-md bg-[#1F1614] text-[#E5A93C] font-mono text-[9px] font-black uppercase tracking-widest border border-[#E5A93C]/40">
                CREDENTIAL // ARCHIVAL PASS
              </span>
              <span className="font-mono text-[10px] font-bold text-[#F2ECD8]/60 tracking-wider">
                ISSUE NO. 084-26
              </span>
            </div>

            <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-[#E5A93C] bg-[#5C1414] px-2.5 py-1 rounded-lg border border-[#1F1614]">
              <Flame className="w-3.5 h-3.5 fill-[#E5A93C] text-[#E5A93C]" />
              <span>{customer?.streakDays || 5}D VELOCITY</span>
            </div>
          </div>

          {/* Member Name Hero + Integrated Stamp Badge */}
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-1">
              <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#E5A93C] font-black block">
                AUTHORIZED HOLDER
              </span>
              <h2 className="font-groovy font-black text-3xl sm:text-4xl lg:text-5xl text-[#F2ECD8] tracking-wide leading-[0.95] drop-shadow-sm">
                {customer?.name || 'Maya Chen'}
              </h2>
              <div className="pt-1 flex items-center gap-2">
                <span className="px-2 py-0.5 rounded-md bg-[#E5A93C] text-[#1F1614] font-groovy text-xs font-black uppercase tracking-wider">
                  {tier?.badge || 'GOLD MEMBER'}
                </span>
                <span className="font-mono text-xs text-[#F2ECD8]/70 font-bold">
                  LEVEL {tier?.level || 3}
                </span>
              </div>
            </div>

            {/* Rubber Stamp Impression Seal (Rotated Organically) */}
            <div className="shrink-0 -rotate-6 group-hover:rotate-0 transition-transform duration-300">
              <CircularStampBadge
                text="• VALENCE PHYSICAL ARCHIVE • 2026 •"
                centerText="VERIFIED"
                subText="PASSED"
                size={82}
                variant="mustard"
              />
            </div>
          </div>

          {/* Integrated Optical QR Pass Feature & ID */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2">
            
            {/* Click-to-copy Member Code */}
            <button
              type="button"
              onClick={handleCopyId}
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#5C1414] hover:bg-[#470D0D] border-2 border-[#1F1614] text-xs font-mono text-[#F2ECD8] cursor-pointer transition-colors w-fit"
              title="Click to copy member ID"
            >
              <span className="font-bold text-[#E5A93C]">ID:</span>
              <span className="tracking-wider">{memberId}</span>
              {isCopied ? (
                <Check className="w-3.5 h-3.5 text-[#E5A93C]" />
              ) : (
                <Copy className="w-3.5 h-3.5 text-[#F2ECD8]/60" />
              )}
            </button>

            {/* Embedded Optical QR Button */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                sounds.playScanSuccess();
                if (onShowQrModal) onShowQrModal();
              }}
              className="flex items-center gap-3 bg-[#FAF6EA] hover:bg-white text-[#1F1614] p-2.5 rounded-2xl border-2 border-[#1F1614] shadow-[3px_3px_0px_#1F1614] hover:shadow-[4px_4px_0px_#1F1614] active:translate-y-0.5 cursor-pointer transition-all w-fit group/opt"
              title="Click to expand optical QR key"
            >
              <div className="w-10 h-10 bg-white p-1 rounded-lg border border-[#1F1614] flex items-center justify-center shrink-0 group-hover/opt:scale-105 transition-transform">
                {/* SVG Mini QR Code */}
                <svg viewBox="0 0 24 24" className="w-full h-full text-[#7A1F1F]">
                  <rect x="2" y="2" width="7" height="7" fill="currentColor" />
                  <rect x="3" y="3" width="5" height="5" fill="#FAF6EA" />
                  <rect x="4" y="4" width="3" height="3" fill="currentColor" />
                  <rect x="15" y="2" width="7" height="7" fill="currentColor" />
                  <rect x="16" y="3" width="5" height="5" fill="#FAF6EA" />
                  <rect x="17" y="4" width="3" height="3" fill="currentColor" />
                  <rect x="2" y="15" width="7" height="7" fill="currentColor" />
                  <rect x="3" y="16" width="5" height="5" fill="#FAF6EA" />
                  <rect x="4" y="17" width="3" height="3" fill="currentColor" />
                  <rect x="11" y="4" width="2" height="5" fill="currentColor" />
                  <rect x="14" y="11" width="5" height="2" fill="currentColor" />
                  <rect x="11" y="15" width="2" height="6" fill="currentColor" />
                  <rect x="15" y="15" width="3" height="3" fill="currentColor" />
                  <rect x="19" y="19" width="3" height="3" fill="currentColor" />
                </svg>
              </div>

              <div className="text-left pr-1">
                <div className="font-mono text-[9px] font-black uppercase tracking-wider text-[#7A1F1F]">
                  OPTICAL KEY
                </div>
                <div className="font-groovy text-xs text-[#1F1614] flex items-center gap-1">
                  <span>TAP TO EXPAND</span>
                  <Maximize2 className="w-3 h-3 text-[#7A1F1F] group-hover/opt:translate-x-0.5 transition-transform" />
                </div>
              </div>
            </button>

          </div>

        </div>

        {/* ============================================================= */}
        {/* PERFORATED TEAR-OFF LINE                                      */}
        {/* ============================================================= */}
        <div className="relative w-full border-b-2 border-dashed border-[#F2ECD8]/30 px-6 my-1">
          <span className="absolute -top-2 left-8 px-2 bg-[#7A1F1F] font-mono text-[8px] tracking-widest text-[#F2ECD8]/40 uppercase">
            CUT OR TEAR ALONG DOTTED LINE
          </span>
        </div>

        {/* ============================================================= */}
        {/* LOWER ARTIFACT: XP PROGRESS + AUTHENTIC BARCODE STRIP        */}
        {/* ============================================================= */}
        <div className="p-6 sm:p-7 pt-4 bg-[#5C1414] relative z-10 space-y-4">
          
          {/* XP Meter with Chunky Numbers */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs font-mono font-bold">
              <span className="text-[#F2ECD8]/80 uppercase tracking-wider">
                XP VELOCITY
              </span>
              <span className="font-groovy text-sm sm:text-base text-[#E5A93C]">
                {customer?.xp || 420} / 650 XP ({Math.round(xpPercent)}%)
              </span>
            </div>

            <div className="h-3 w-full rounded-full bg-[#470D0D] border-2 border-[#1F1614] overflow-hidden p-0.5">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${xpPercent}%` }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
                className="h-full rounded-full bg-[#E5A93C]"
              />
            </div>
          </div>

          {/* Authentic High-Density SVG Barcode Strip */}
          <div className="pt-1 flex flex-col items-center justify-center space-y-1">
            <div className="h-8 w-full max-w-sm flex items-stretch justify-between gap-[2px] opacity-85 overflow-hidden">
              {[3, 1, 4, 1, 2, 5, 1, 3, 2, 1, 4, 2, 1, 3, 5, 2, 1, 4, 1, 3, 2, 4, 1, 5, 2, 1, 3, 4, 1, 2, 5, 3, 1, 4, 2, 1, 3, 5, 2, 1, 4, 1, 3, 2, 4, 1, 5, 2, 1, 3].map((w, i) => (
                <div
                  key={i}
                  className="bg-[#F2ECD8] h-full"
                  style={{ width: `${w}px` }}
                />
              ))}
            </div>
            <span className="font-mono text-[9px] tracking-[0.3em] text-[#F2ECD8]/60 uppercase font-bold">
              * VAL-{memberId} *
            </span>
          </div>

        </div>

      </motion.div>
    </div>
  );
}
