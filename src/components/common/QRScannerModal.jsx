import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  QrCode, 
  Camera, 
  CheckCircle2, 
  ArrowRight, 
  Volume2, 
  VolumeX, 
  Volume1, 
  Sparkles,
  Zap,
  Sliders
} from 'lucide-react';
import { CAFE_CONFIG } from '../../data/cafeConfig';
import { useCart } from '../../context/CartContext';
import { sounds } from '../../utils/audio';
import { useScanAudio } from '../../utils/scanSound';

export function QRScannerModal({ isOpen, onClose, onScanComplete }) {
  const { activeTable, setActiveTable, setDiningMode } = useCart();
  const [isScanning, setIsScanning] = useState(false);
  const [scannedTable, setScannedTable] = useState(null);
  const [showVolumeControls, setShowVolumeControls] = useState(false);
  const [audioChimeFired, setAudioChimeFired] = useState(false);

  // Hook in our modular high-performance scan audio engine
  const { playScanSuccess, isMuted, toggleMute, volume, setVolume, initAudio } = useScanAudio();

  // Unlock AudioContext on modal open to eliminate browser autoplay restrictions
  useEffect(() => {
    if (isOpen) {
      initAudio();
    }
  }, [isOpen, initAudio]);

  if (!isOpen) return null;

  const handleSimulateScan = (tableNum) => {
    // User interaction immediately warms up AudioContext
    initAudio();
    sounds.playClick();
    setIsScanning(true);
    setAudioChimeFired(false);

    setTimeout(() => {
      setIsScanning(false);
      setScannedTable(tableNum);
      setActiveTable(tableNum);
      setDiningMode('table');

      // Requirement 2: Play the high-quality electronic success beep immediately on completion!
      playScanSuccess();
      setAudioChimeFired(true);

      setTimeout(() => {
        if (onScanComplete) onScanComplete(tableNum);
        onClose();
      }, 750);
    }, 900);
  };

  const handleTestChime = (e) => {
    e.stopPropagation();
    initAudio();
    playScanSuccess();
    setAudioChimeFired(true);
    setTimeout(() => setAudioChimeFired(false), 500);
  };

  const handleCounterSelect = () => {
    sounds.playClick();
    setActiveTable(null);
    setDiningMode('counter');
    if (onScanComplete) onScanComplete('counter');
    onClose();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.2 }}
          className="relative w-full max-w-md bg-slate-900 border border-white/10 rounded-3xl p-6 shadow-2xl overflow-hidden"
        >
          {/* Top Control Bar: Audio Settings + Close Button */}
          <div className="absolute top-4 right-4 flex items-center gap-2">
            
            {/* Sound Volume / Mute Widget */}
            <div className="relative">
              <button
                type="button"
                onClick={() => {
                  initAudio();
                  setShowVolumeControls(!showVolumeControls);
                }}
                className={`p-2 rounded-full transition cursor-pointer border ${
                  isMuted
                    ? 'bg-slate-800 text-rose-400 border-rose-500/30'
                    : 'bg-slate-800/80 text-cyan-400 border-cyan-500/30 hover:bg-slate-700'
                }`}
                title={isMuted ? 'Scan sound muted' : `Scan sound volume: ${Math.round(volume * 100)}%`}
              >
                {isMuted ? (
                  <VolumeX className="w-4 h-4" />
                ) : volume < 0.5 ? (
                  <Volume1 className="w-4 h-4" />
                ) : (
                  <Volume2 className="w-4 h-4" />
                )}
              </button>

              {/* Expandable Audio Settings Popover */}
              <AnimatePresence>
                {showVolumeControls && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9, y: 5 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: 5 }}
                    className="absolute right-0 top-11 z-30 w-56 p-3.5 rounded-2xl bg-slate-950 border border-cyan-500/30 shadow-2xl space-y-2.5 font-sans"
                  >
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-mono text-slate-300 font-bold flex items-center gap-1">
                        <Zap className="w-3.5 h-3.5 text-cyan-400" />
                        SCAN AUDIO
                      </span>
                      <button
                        type="button"
                        onClick={toggleMute}
                        className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold transition ${
                          isMuted ? 'bg-rose-500/20 text-rose-300' : 'bg-cyan-500/20 text-cyan-300'
                        }`}
                      >
                        {isMuted ? 'UNMUTE' : 'MUTE'}
                      </button>
                    </div>

                    {/* Volume Slider */}
                    <div className="space-y-1">
                      <div className="flex justify-between text-[10px] font-mono text-slate-400">
                        <span>Volume:</span>
                        <span className="text-cyan-400 font-bold">{Math.round(volume * 100)}%</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.05"
                        value={isMuted ? 0 : volume}
                        disabled={isMuted}
                        onChange={(e) => {
                          initAudio();
                          setVolume(e.target.value);
                        }}
                        className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
                      />
                    </div>

                    {/* Test Audio Button */}
                    <button
                      type="button"
                      onClick={handleTestChime}
                      className="w-full py-1.5 rounded-xl bg-cyan-500/15 hover:bg-cyan-500/25 border border-cyan-500/40 text-cyan-300 text-xs font-mono font-bold flex items-center justify-center gap-1.5 transition cursor-pointer"
                    >
                      <Sparkles className="w-3 h-3 text-cyan-400" />
                      <span>Test Scan Beep</span>
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Close button */}
            <button
              onClick={() => { sounds.playClick(); onClose(); }}
              className="p-2 rounded-full bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white transition cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Modal Title */}
          <div className="text-center mb-5 pt-1">
            <h3 className="text-xl font-bold text-white font-syne flex items-center justify-center gap-2">
              <QrCode className="w-5 h-5 text-cyan-400" />
              <span>Table QR Scanner</span>
            </h3>
            <p className="text-slate-400 text-xs mt-1">
              Select or scan your table plaque to order directly to your seat.
            </p>
          </div>

          {/* Scanner Simulation Box with Laser Sweep & Audio Wave Pulse */}
          <div className="relative w-full h-44 bg-slate-950 rounded-2xl border border-white/10 overflow-hidden flex flex-col items-center justify-center mb-5 select-none">
            
            {/* Corner Targeting Brackets */}
            <div className="absolute top-2.5 left-2.5 w-4 h-4 border-t-2 border-l-2 border-cyan-400" />
            <div className="absolute top-2.5 right-2.5 w-4 h-4 border-t-2 border-r-2 border-cyan-400" />
            <div className="absolute bottom-2.5 left-2.5 w-4 h-4 border-b-2 border-l-2 border-cyan-400" />
            <div className="absolute bottom-2.5 right-2.5 w-4 h-4 border-b-2 border-r-2 border-cyan-400" />

            {isScanning ? (
              <div className="relative w-full h-full flex flex-col items-center justify-center">
                {/* Active Laser Sweep */}
                <motion.div
                  animate={{ y: [-50, 50, -50] }}
                  transition={{ duration: 0.9, repeat: Infinity, ease: 'easeInOut' }}
                  className="w-4/5 h-0.5 bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_12px_#06b6d4]"
                />
                
                {/* Digital Target Reticle */}
                <div className="w-16 h-16 rounded-xl border border-cyan-500/40 flex items-center justify-center mt-2">
                  <div className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                </div>

                <p className="text-cyan-400 text-xs font-mono mt-3 tracking-wider flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                  <span>Decoding QR Data...</span>
                </p>
              </div>
            ) : scannedTable ? (
              <div className="flex flex-col items-center text-center p-4 relative z-10">
                
                {/* Visual Audio Wave Ripple on Scan Success */}
                {audioChimeFired && (
                  <motion.div
                    initial={{ scale: 0.8, opacity: 1 }}
                    animate={{ scale: 2.2, opacity: 0 }}
                    transition={{ duration: 0.6, ease: 'easeOut' }}
                    className="absolute w-16 h-16 rounded-full border-2 border-cyan-400 pointer-events-none"
                  />
                )}

                <motion.div
                  initial={{ scale: 0.5, rotate: -20 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: 'spring', stiffness: 450, damping: 12 }}
                >
                  <CheckCircle2 className="w-11 h-11 text-amber-400 mb-1.5 drop-shadow-[0_0_10px_rgba(245,158,11,0.5)]" />
                </motion.div>

                <p className="text-white font-bold text-base">Table #{scannedTable} Connected</p>
                <p className="text-cyan-400 text-xs font-mono mt-0.5">Electronic Confirmation Emitted</p>
              </div>
            ) : (
              <div className="flex flex-col items-center text-center px-4">
                <Camera className="w-8 h-8 text-slate-500 mb-2" />
                <p className="text-slate-300 text-xs font-medium">Select Table Plaque Below</p>
                <p className="text-slate-500 text-[10px] mt-0.5">
                  Click any table plaque to simulate instant scan with confirmation sound
                </p>
              </div>
            )}
          </div>

          {/* Table Badges Grid (Clicking acts as User-Interaction that unlocks Audio) */}
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-mono text-slate-400 font-bold uppercase">
                Select Table to Scan:
              </span>
              <button
                type="button"
                onClick={handleTestChime}
                className="text-[10px] font-mono text-cyan-400 hover:underline flex items-center gap-1 cursor-pointer"
              >
                <span>Hear sound</span>
                <Volume2 className="w-3 h-3" />
              </button>
            </div>

            <div className="grid grid-cols-4 gap-2">
              {CAFE_CONFIG.tables.map((t) => (
                <button
                  key={t.id}
                  onClick={() => handleSimulateScan(t.number)}
                  className={`py-2 px-2 rounded-xl text-xs font-mono font-bold transition-all border cursor-pointer ${
                    activeTable === t.number
                      ? 'bg-amber-400 text-slate-950 border-amber-400 shadow-sm'
                      : 'bg-slate-950 text-slate-300 border-white/5 hover:border-cyan-400/50 hover:text-white'
                  }`}
                >
                  <span>T-{t.number < 10 ? `0${t.number}` : t.number}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Counter Pickup Option */}
          <div className="pt-3 border-t border-white/5 flex items-center justify-between gap-3">
            <span className="text-xs text-slate-400">Ordering for takeaway?</span>
            <button
              onClick={handleCounterSelect}
              className="px-3 py-1.5 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 text-xs font-medium transition inline-flex items-center gap-1 cursor-pointer"
            >
              Counter Pickup <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
