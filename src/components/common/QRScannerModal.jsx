import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, QrCode, Camera, CheckCircle2, ArrowRight } from 'lucide-react';
import { CAFE_CONFIG } from '../../data/cafeConfig';
import { useCart } from '../../context/CartContext';
import { sounds } from '../../utils/audio';

export function QRScannerModal({ isOpen, onClose, onScanComplete }) {
  const { activeTable, setActiveTable, setDiningMode } = useCart();
  const [isScanning, setIsScanning] = useState(false);
  const [scannedTable, setScannedTable] = useState(null);

  if (!isOpen) return null;

  const handleSimulateScan = (tableNum) => {
    sounds.playClick();
    setIsScanning(true);
    setTimeout(() => {
      setIsScanning(false);
      setScannedTable(tableNum);
      setActiveTable(tableNum);
      setDiningMode('table');
      sounds.playOrderPlaced();
      setTimeout(() => {
        if (onScanComplete) onScanComplete(tableNum);
        onClose();
      }, 700);
    }, 1000);
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
          {/* Close button */}
          <button
            onClick={() => { sounds.playClick(); onClose(); }}
            className="absolute top-4 right-4 p-2 rounded-full bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white transition"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="text-center mb-5 pt-1">
            <h3 className="text-xl font-bold text-white font-syne">
              Table QR Scanner
            </h3>
            <p className="text-slate-400 text-xs mt-1">
              Select or scan your table plaque to order directly to your seat.
            </p>
          </div>

          {/* Scanner Simulation Box */}
          <div className="relative w-full h-44 bg-slate-950 rounded-2xl border border-white/10 overflow-hidden flex flex-col items-center justify-center mb-5">
            {isScanning ? (
              <div className="relative w-full h-full flex flex-col items-center justify-center">
                <motion.div
                  animate={{ y: [-50, 50, -50] }}
                  transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut' }}
                  className="w-3/4 h-0.5 bg-cyan-400 shadow-sm"
                />
                <p className="text-cyan-400 text-xs font-mono mt-3">
                  Scanning Table QR Code...
                </p>
              </div>
            ) : scannedTable ? (
              <div className="flex flex-col items-center text-center p-4">
                <CheckCircle2 className="w-10 h-10 text-amber-400 mb-1.5" />
                <p className="text-white font-bold text-base">Table #{scannedTable} Connected</p>
                <p className="text-slate-400 text-xs">Opening menu...</p>
              </div>
            ) : (
              <div className="flex flex-col items-center text-center px-4">
                <Camera className="w-8 h-8 text-slate-500 mb-2" />
                <p className="text-slate-300 text-xs font-medium">Select Table Plaque Below</p>
                <p className="text-slate-500 text-[10px] mt-0.5">
                  Click any table number to simulate instant scan
                </p>
              </div>
            )}
          </div>

          {/* Table Badges Grid */}
          <div className="mb-4">
            <div className="grid grid-cols-4 gap-2">
              {CAFE_CONFIG.tables.map((t) => (
                <button
                  key={t.id}
                  onClick={() => handleSimulateScan(t.number)}
                  className={`py-2 px-2 rounded-xl text-xs font-mono font-bold transition-all border ${
                    activeTable === t.number
                      ? 'bg-amber-400 text-slate-950 border-amber-400 shadow-sm'
                      : 'bg-slate-950 text-slate-300 border-white/5 hover:border-amber-400/40 hover:text-white'
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
              className="px-3 py-1.5 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 text-xs font-medium transition inline-flex items-center gap-1"
            >
              Counter Pickup <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
