import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  Smartphone, 
  Copy, 
  Check, 
  ExternalLink, 
  QrCode, 
  ShieldCheck, 
  Sparkles,
  Layers,
  ArrowRight
} from 'lucide-react';
import { generateQRCodeDataUrl, getTableOrderUrl } from '../../utils/qrCode';
import { BRAND_CONFIG } from '../../data/cafeConfig';
import { sounds } from '../../utils/audio';

export function MobileQrLiveModal({ isOpen, onClose, activeTable = 8 }) {
  const [qrDataUrl, setQrDataUrl] = useState('');
  const [copied, setCopied] = useState(false);
  const [targetUrl, setTargetUrl] = useState('');

  useEffect(() => {
    if (!isOpen) return;

    const url = getTableOrderUrl(activeTable || 8);
    setTargetUrl(url);

    generateQRCodeDataUrl(url, {
      width: 480,
      margin: 1,
      darkColor: '#12100E',
      lightColor: '#FFFFFF'
    }).then(dataUrl => {
      setQrDataUrl(dataUrl);
    });
  }, [isOpen, activeTable]);

  if (!isOpen) return null;

  const handleCopyLink = () => {
    sounds.playClick();
    if (navigator?.clipboard?.writeText && targetUrl) {
      navigator.clipboard.writeText(targetUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2400);
    }
  };

  const handleOpenDirect = () => {
    sounds.playClick();
    if (targetUrl) {
      window.open(targetUrl, '_blank');
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/80 backdrop-blur-md"
        />

        {/* Modal Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: 16 }}
          transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full max-w-xl bg-[#141210] border border-[#C5A880]/30 rounded-3xl shadow-2xl shadow-black/80 text-[#FAF7F2] overflow-hidden z-10 my-8"
        >
          {/* Subtle Ambient Radial Lighting */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-[#C5A880]/10 rounded-full blur-3xl pointer-events-none -z-10" />

          {/* Top Header Bar */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-[#0E0C0B]">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-[#C5A880]/15 border border-[#C5A880]/30 flex items-center justify-center text-[#C5A880]">
                <Smartphone className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-mono tracking-widest uppercase text-[#C5A880] font-semibold">
                  Live Hardware Demonstration
                </p>
                <h3 className="font-editorial text-base font-bold text-white">
                  Test Instant Table QR on Your Phone
                </h3>
              </div>
            </div>

            <button
              onClick={() => { sounds.playClick(); onClose(); }}
              className="p-1.5 rounded-xl text-stone-400 hover:text-white hover:bg-white/10 transition cursor-pointer"
              aria-label="Close"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="p-6 space-y-6">
            {/* Split Grid: Acrylic Plaque Mockup + Scan Instructions */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
              
              {/* Acrylic / Brass Table Plaque Simulation */}
              <div className="md:col-span-6 flex flex-col items-center">
                <div className="relative p-5 rounded-2xl bg-[#1D1916] border border-[#C5A880]/40 shadow-2xl w-full max-w-[260px] text-center">
                  
                  {/* Brass Engraved Plaque Header */}
                  <div className="border-b border-[#C5A880]/20 pb-2.5 mb-3">
                    <p className="text-[9px] font-mono tracking-[0.25em] text-[#C5A880] uppercase font-bold">
                      {BRAND_CONFIG.shortName.toUpperCase()} BISTRO HUB
                    </p>
                    <p className="font-editorial text-xl font-bold text-white tracking-wide mt-0.5">
                      TABLE {String(activeTable).padStart(2, '0')}
                    </p>
                  </div>

                  {/* High-Resolution QR Canvas */}
                  <div className="relative p-2 bg-white rounded-xl shadow-md mx-auto aspect-square w-full max-w-[190px] flex items-center justify-center">
                    {qrDataUrl ? (
                      <img
                        src={qrDataUrl}
                        alt={`Table ${activeTable} QR Code`}
                        className="w-full h-full object-contain rounded-lg"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-stone-400">
                        <QrCode className="w-10 h-10 animate-spin" />
                      </div>
                    )}
                  </div>

                  {/* Plaque Base Text */}
                  <div className="mt-3 pt-2.5 border-t border-[#C5A880]/20 space-y-0.5">
                    <p className="text-[9px] font-mono text-stone-300 uppercase tracking-wider">
                      Zero-Wait Dining System
                    </p>
                    <p className="text-[8px] font-mono text-stone-400">
                      Scan with iPhone / Android Camera
                    </p>
                  </div>
                </div>
              </div>

              {/* Instruction & Capabilities */}
              <div className="md:col-span-6 space-y-4 text-left">
                <div className="space-y-1.5">
                  <span className="text-[10px] font-mono font-bold tracking-widest text-[#C5A880] uppercase">
                    Step-by-Step Flow
                  </span>
                  <h4 className="font-editorial text-xl font-bold text-white leading-snug">
                    Experience Zero-Wait Table Ordering
                  </h4>
                  <p className="text-xs text-stone-300 leading-relaxed font-sans">
                    Point your smartphone camera at the plaque QR on the left. The live web application will load instantly on your phone with Table #{activeTable} pre-bound. No app download required.
                  </p>
                </div>

                {/* Feature Highlights */}
                <div className="space-y-2 pt-1 font-mono text-[11px]">
                  <div className="flex items-center gap-2 text-stone-300">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#C5A880] shrink-0" />
                    <span>Table bound automatically without manual entry</span>
                  </div>
                  <div className="flex items-center gap-2 text-stone-300">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#C5A880] shrink-0" />
                    <span>Real-time kitchen tickets sync directly with POS</span>
                  </div>
                  <div className="flex items-center gap-2 text-stone-300">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#C5A880] shrink-0" />
                    <span>Simulated UPI & card payment gateway</span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                  <button
                    onClick={handleCopyLink}
                    className="px-4 py-2.5 rounded-xl border border-white/15 bg-white/5 hover:bg-white/10 text-xs font-mono flex items-center justify-center gap-2 transition cursor-pointer"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? 'Link Copied' : 'Copy Session URL'}</span>
                  </button>

                  <button
                    onClick={handleOpenDirect}
                    className="px-4 py-2.5 rounded-xl bg-[#C5A880] hover:bg-[#B89358] text-[#12100E] text-xs font-mono font-bold flex items-center justify-center gap-1.5 transition cursor-pointer shadow-md"
                  >
                    <span>Open in New Tab</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

            </div>

            {/* Bottom Enterprise Pitch Footer */}
            <div className="p-3.5 rounded-2xl bg-[#0E0C0B] border border-white/10 flex items-center justify-between text-[11px] font-mono text-stone-400">
              <span className="truncate">Laser-engraved acrylic & brushed brass stands supplied for client deployments</span>
              <span className="text-[#C5A880] font-semibold shrink-0 ml-2">Dripp Media Hospitality</span>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
