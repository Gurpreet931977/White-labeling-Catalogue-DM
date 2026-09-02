import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Terminal, 
  Cpu, 
  ChevronUp, 
  ChevronDown, 
  X,
  Zap,
  Database
} from 'lucide-react';
import { CATALOGUE_DATA } from '../../data/catalogueData';
import { sounds } from '../../utils/audio';

export function DeveloperModeHUD({ isDevMode, onCloseDevMode }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [fps, setFps] = useState(60);

  // Measure approximate FPS
  useEffect(() => {
    let frameCount = 0;
    let lastTime = performance.now();
    let animId;

    const loop = (now) => {
      frameCount++;
      if (now - lastTime >= 1000) {
        setFps(Math.min(60, Math.round((frameCount * 1000) / (now - lastTime))));
        frameCount = 0;
        lastTime = now;
      }
      animId = requestAnimationFrame(loop);
    };

    animId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animId);
  }, []);

  if (!isDevMode) return null;

  return (
    <div className="fixed bottom-4 inset-x-3 sm:inset-x-6 z-50 pointer-events-none flex flex-col items-center">
      <div className="w-full max-w-4xl pointer-events-auto">
        
        {/* Floating Mini HUD Capsule - Dripp Yellow & Obsidian */}
        <div className="p-2 sm:p-2.5 rounded-2xl bg-[#080808]/95 border border-[#ebd73f]/40 backdrop-blur-2xl shadow-2xl shadow-black flex items-center justify-between gap-3 text-xs font-mono">
          
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-xl bg-[#ebd73f]/20 border border-[#ebd73f]/50 flex items-center justify-center text-[#ebd73f]">
              <Cpu className="w-4 h-4 animate-spin" />
            </div>
            
            <div className="flex items-center gap-2">
              <span className="font-bold text-[#ebd73f]">SYS.DEV // ON</span>
              <span className="hidden sm:inline-block text-white/30">•</span>
              <span className="hidden sm:inline-flex items-center gap-1.5 text-white">
                <span className="w-1.5 h-1.5 rounded-full bg-[#ebd73f] animate-ping"></span>
                <span>{fps} FPS GPU</span>
              </span>
              <span className="hidden md:inline-block text-white/30">•</span>
              <span className="hidden md:inline-block text-slate-400 text-[11px]">
                BUILD: VITE 5 + REACT 18
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                sounds.playClick();
                setIsExpanded(!isExpanded);
              }}
              className="px-3 py-1 rounded-xl bg-white/10 hover:bg-[#ebd73f] hover:text-black text-white text-[11px] font-semibold flex items-center gap-1 transition cursor-pointer"
            >
              <span>{isExpanded ? 'Hide Specs' : 'Inspect Stack'}</span>
              {isExpanded ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronUp className="w-3.5 h-3.5" />}
            </button>

            <button
              onClick={() => {
                sounds.playClick();
                onCloseDevMode();
              }}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition cursor-pointer"
              title="Close Dev Mode"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

        </div>

        {/* Expanded Tech Architecture Drawer */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ opacity: 0, y: 15, height: 0 }}
              animate={{ opacity: 1, y: 0, height: 'auto' }}
              exit={{ opacity: 0, y: 15, height: 0 }}
              className="mt-2 p-5 rounded-3xl bg-[#0a0a0a] border border-white/15 backdrop-blur-2xl shadow-2xl text-xs space-y-4 max-h-[60vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <Terminal className="w-4 h-4 text-[#ebd73f]" />
                  <span className="font-panchang font-bold text-white text-sm">
                    Dripp Media Architecture &amp; Performance Inspection
                  </span>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#ebd73f]/20 text-[#ebd73f]">
                  READY TO WHITE-LABEL
                </span>
              </div>

              {/* Lighthouse 100/100 Row */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {Object.entries(CATALOGUE_DATA.developerSpecs.lighthouse).map(([k, v]) => (
                  <div key={k} className="p-3 rounded-2xl bg-black/70 border border-white/10 text-center">
                    <p className="font-panchang font-bold text-2xl text-[#ebd73f]">{v}</p>
                    <p className="text-[10px] font-mono text-slate-400 uppercase mt-0.5">{k}</p>
                  </div>
                ))}
              </div>

              {/* Tech Stack Specs */}
              <div className="space-y-2">
                <p className="text-[11px] font-mono text-slate-400 uppercase tracking-wider">
                  Technology Stack &amp; White-Label Modules
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {CATALOGUE_DATA.developerSpecs.stack.map((item, idx) => (
                    <div key={idx} className="p-2.5 rounded-xl bg-white/[0.03] border border-white/10 flex items-center justify-between font-mono text-[11px]">
                      <span className="text-slate-300 font-semibold">{item.name}</span>
                      <span className="text-[#ebd73f]">{item.tech}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* How White-Labeling works */}
              <div className="p-3.5 rounded-2xl bg-[#111111] border border-[#ebd73f]/25 font-mono text-[11px] space-y-1">
                <p className="text-white font-bold flex items-center gap-1.5">
                  <Database className="w-3.5 h-3.5 text-[#ebd73f]" />
                  <span>Single-File Configuration Engine:</span>
                </p>
                <p className="text-slate-300">
                  Each niche is isolated into a modular config schema. Rebranding requires simply modifying 1 JSON file with your client's logo, colors, pricing, and domain.
                </p>
              </div>

            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
}
