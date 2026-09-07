import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  QrCode, 
  Sparkles, 
  ShieldCheck, 
  Award, 
  Flame, 
  Zap, 
  Star, 
  Copy, 
  Check, 
  X,
  CreditCard,
  ChevronRight
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
    const rotX = ((y - centerY) / centerY) * -7;
    const rotY = ((x - centerX) / centerX) * 7;
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
        className="relative w-full rounded-3xl overflow-hidden p-6 sm:p-8 bg-gradient-to-br from-[#161821] via-[#101117] to-[#0A0B0E] border border-[#2B2E3D] shadow-2xl cursor-pointer group"
      >
        {/* Holographic Dynamic Glare Surface */}
        <div
          className="absolute inset-0 pointer-events-none opacity-40 group-hover:opacity-60 transition-opacity duration-300"
          style={{
            background: `radial-gradient(circle at ${glarePosition.x}% ${glarePosition.y}%, rgba(255,255,255,0.12) 0%, rgba(37,99,235,0.08) 35%, transparent 70%)`
          }}
        />

        {/* Subtle Luxury Security Mesh Background */}
        <div 
          className="absolute inset-0 pointer-events-none opacity-10"
          style={{
            backgroundImage: `radial-gradient(rgba(255, 255, 255, 0.4) 1px, transparent 1px)`,
            backgroundSize: '20px 20px'
          }}
        />

        {/* Ambient Top Glow Line */}
        <div className="absolute top-0 inset-x-12 h-px bg-gradient-to-r from-transparent via-[#3B82F6]/60 to-transparent" />

        {/* Card Content (Elevated with 3D Depth) */}
        <div className="relative z-10 flex flex-col justify-between min-h-[200px] sm:min-h-[220px]">
          
          {/* Top Header Row */}
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono tracking-[0.25em] text-[#8E91A0] uppercase font-bold">
                  VALENCE MEMBERSHIP
                </span>
                <span className="px-2 py-0.5 rounded-full bg-[#F59E0B]/15 text-[#F59E0B] border border-[#F59E0B]/30 font-mono text-[9px] font-bold tracking-wider">
                  {tier?.badge || 'GOLD MEMBER'}
                </span>
              </div>
              <h3 className="font-clash font-bold text-2xl sm:text-3xl text-[#F4F4F6] tracking-tight group-hover:text-white transition-colors">
                {customer?.name || 'Valued Member'}
              </h3>
            </div>

            {/* Smart NFC / Pass Crest Badge */}
            <div className="flex flex-col items-end gap-1">
              <div className="w-10 h-10 rounded-2xl bg-[#1F222E] border border-[#363A4D] flex items-center justify-center text-[#F4F4F6] shadow-inner group-hover:border-[#3B82F6] transition-colors">
                <QrCode className="w-5 h-5 text-[#3B82F6]" />
              </div>
              <span className="text-[9px] font-mono text-[#8E91A0] tracking-wide">
                TAP FOR QR
              </span>
            </div>
          </div>

          {/* Middle Meta: ID & Streak Power */}
          <div className="flex flex-wrap items-center justify-between gap-2 py-3 border-y border-[#222533]/80">
            <button
              type="button"
              onClick={handleCopyId}
              className="flex items-center gap-1.5 text-xs font-mono text-[#8E91A0] hover:text-[#F4F4F6] transition-colors cursor-pointer"
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
              <span className="text-[#8E91A0]">STATUS:</span>
              <span className="text-[#F4F4F6] font-bold flex items-center gap-1">
                <span>{customer?.streakDays || 1}d Streak</span>
                <Flame className="w-3.5 h-3.5 text-[#F97316] fill-[#F97316]" />
              </span>
            </div>
          </div>

          {/* Bottom Row: XP Track & Level Progression */}
          <div className="space-y-2 pt-1">
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-1.5 font-medium text-[#F4F4F6]">
                <ShieldCheck className="w-3.5 h-3.5 text-[#3B82F6]" />
                <span className="font-sans text-xs">{tier?.name || 'Artisan Member'} (Tier {tier?.level || 3})</span>
              </div>
              <span className="font-mono text-[11px] text-[#F59E0B] font-bold">
                {customer?.xp || 420} / 650 XP
              </span>
            </div>

            {/* Custom Glowing XP Track */}
            <div className="h-2 w-full rounded-full bg-[#0D0E12] overflow-hidden p-0.5 border border-[#252836]">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${xpPercent}%` }}
                transition={{ duration: 1, ease: 'easeOut' }}
                className="h-full rounded-full bg-gradient-to-r from-[#2563EB] via-[#3B82F6] to-[#F59E0B]"
              />
            </div>
          </div>

        </div>

        {/* Bottom Micro-Badge: Digital NFC Simulation */}
        <div className="absolute bottom-2 right-4 text-[8px] font-mono text-[#545768] tracking-widest uppercase">
          NFC // VERIFIED DIGITAL PASS
        </div>
      </motion.div>
    </div>
  );
}
