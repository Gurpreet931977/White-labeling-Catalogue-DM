import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { 
  QrCode, 
  ShieldCheck, 
  Flame, 
  Copy, 
  Check, 
  Sparkles,
  Zap
} from 'lucide-react';
import { sounds } from '../../utils/audio';

export function ValenceHeroPass({ customer, tier, totalSlots = 6, onShowQrModal }) {
  const cardRef = useRef(null);
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const [glarePosition, setGlarePosition] = useState({ x: 50, y: 50 });
  const [isCopied, setIsCopied] = useState(false);

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotX = ((y - centerY) / centerY) * -6;
    const rotY = ((x - centerX) / centerX) * 6;
    setRotateX(rotX);
    setRotateY(rotY);
    setGlarePosition({
      x: (x / rect.width) * 100,
      y: (y / rect.height) * 100
    });
  };

  const handleMouseLeave = () => {
    setRotateX(0);
    setRotateY(0);
  };

  const handleCopyId = (e) => {
    e.stopPropagation();
    sounds.playClick();
    navigator.clipboard?.writeText(customer.phone || customer.id);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const xpPercent = Math.min(100, ((customer.xp || 420) / 650) * 100);

  return (
    <div className="relative perspective-1000 select-none">
      <motion.div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onClick={() => {
          sounds.playStampSquish();
          if (onShowQrModal) onShowQrModal();
        }}
        style={{
          transform: `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
          transformStyle: 'preserve-3d',
          transition: 'transform 0.15s ease-out'
        }}
        whileHover={{ scale: 1.015 }}
        whileTap={{ scale: 0.985 }}
        className="relative w-full rounded-3xl overflow-hidden p-6 sm:p-8 bg-gradient-to-br from-[#1C120C] via-[#261911] to-[#120B07] text-[#FFFDF9] border-2 border-[#3D291D] shadow-2xl cursor-pointer group"
      >
        {/* Holographic Dynamic Glare Surface */}
        <div
          className="absolute inset-0 pointer-events-none opacity-30 group-hover:opacity-60 transition-opacity duration-300"
          style={{
            background: `radial-gradient(circle at ${glarePosition.x}% ${glarePosition.y}%, rgba(255,255,255,0.18) 0%, rgba(255,72,0,0.12) 35%, transparent 70%)`
          }}
        />

        {/* Debossed Inner Border */}
        <div className="absolute inset-2.5 rounded-2xl border border-[#D4A373]/20 pointer-events-none" />

        {/* Top Accent Line */}
        <div className="absolute top-0 inset-x-12 h-0.5 bg-gradient-to-r from-transparent via-[#FF4800] to-transparent" />

        {/* Card Content */}
        <div className="relative z-10 flex flex-col justify-between min-h-[210px] sm:min-h-[230px]">
          
          {/* Top Header Row */}
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono tracking-[0.25em] text-[#D4A373] uppercase font-bold">
                  VALENCE MEMBERSHIP
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-[#FF4800]/20 text-[#FF8552] border border-[#FF4800]/40 font-mono text-[9px] font-bold tracking-wider">
                  {tier?.badge || 'GOLD MEMBER'}
                </span>
              </div>
              <h3 className="font-clash font-bold text-2xl sm:text-3xl text-white tracking-tight group-hover:text-[#FFFDF9] transition-colors">
                {customer?.name || 'Valued Member'}
              </h3>
            </div>

            {/* Smart NFC / Pass Crest Badge with Poppy Highlight */}
            <div className="flex flex-col items-end gap-1">
              <div className="w-11 h-11 rounded-2xl bg-[#2D1D14] border border-[#4D3323] flex items-center justify-center text-[#FFFDF9] shadow-inner group-hover:border-[#FF4800] transition-colors">
                <QrCode className="w-5 h-5 text-[#FF4800]" />
              </div>
              <span className="text-[9px] font-mono text-[#D4A373] tracking-wide font-bold">
                TAP FOR QR
              </span>
            </div>
          </div>

          {/* Middle Meta: ID & Streak Power */}
          <div className="flex flex-wrap items-center justify-between gap-2 py-3.5 border-y border-[#3D291D]/90">
            <button
              type="button"
              onClick={handleCopyId}
              className="flex items-center gap-1.5 text-xs font-mono text-[#D4A373] hover:text-white transition-colors cursor-pointer"
              title="Click to copy member ID"
            >
              <span>ID: VAL-{customer?.phone || '9876543210'}</span>
              {isCopied ? (
                <Check className="w-3.5 h-3.5 text-[#10B981]" />
              ) : (
                <Copy className="w-3.5 h-3.5 opacity-60 group-hover:opacity-100" />
              )}
            </button>

            <div className="flex items-center gap-2 text-xs font-mono">
              <span className="text-[#A18F80]">STATUS:</span>
              <span className="text-[#FFFDF9] font-bold flex items-center gap-1 bg-[#2D1D14] px-2 py-0.5 rounded-lg border border-[#4D3323]">
                <span>{customer?.streakDays || 1}d Streak</span>
                <Flame className="w-3.5 h-3.5 text-[#FF4800] fill-[#FF4800]" />
              </span>
            </div>
          </div>

          {/* Bottom Row: XP Track & Level Progression */}
          <div className="space-y-2 pt-1">
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-1.5 font-medium text-white">
                <ShieldCheck className="w-3.5 h-3.5 text-[#FF4800]" />
                <span className="font-sans text-xs">{tier?.name || 'Artisan Member'} (Tier {tier?.level || 3})</span>
              </div>
              <span className="font-mono text-[11px] text-[#D4A373] font-bold">
                {customer?.xp || 420} / 650 XP
              </span>
            </div>

            {/* Custom Glowing XP Track with Poppy Gradient */}
            <div className="h-2.5 w-full rounded-full bg-[#120B07] overflow-hidden p-0.5 border border-[#3D291D]">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${xpPercent}%` }}
                transition={{ duration: 1, ease: 'easeOut' }}
                className="h-full rounded-full bg-gradient-to-r from-[#FF4800] via-[#FF7A00] to-[#F59E0B]"
              />
            </div>
          </div>

        </div>

        {/* Bottom Micro-Badge: Digital NFC Simulation */}
        <div className="absolute bottom-2.5 right-4 text-[8px] font-mono text-[#8C7665] tracking-widest uppercase font-bold">
          NFC // VERIFIED DIGITAL PASS
        </div>
      </motion.div>
    </div>
  );
}
