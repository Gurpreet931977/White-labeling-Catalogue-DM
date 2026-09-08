import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

export function ThemeScreenTransition() {
  const { isTransitioning, transitionOrigin, targetTheme } = useTheme();

  const isTargetLight = targetTheme === 'light';
  const originX = transitionOrigin?.x || window.innerWidth / 2;
  const originY = transitionOrigin?.y || 60;

  return (
    <AnimatePresence>
      {isTransitioning && (
        <div className="fixed inset-0 z-[9999] pointer-events-none overflow-hidden">
          
          {/* Radial Circular Iris Expansion Mask */}
          <motion.div
            initial={{
              clipPath: `circle(0px at ${originX}px ${originY}px)`,
              opacity: 1
            }}
            animate={{
              clipPath: `circle(${Math.max(window.innerWidth, window.innerHeight) * 1.6}px at ${originX}px ${originY}px)`,
              opacity: 1
            }}
            exit={{
              opacity: 0,
              transition: { duration: 0.28, ease: "easeOut" }
            }}
            transition={{
              duration: 0.65,
              ease: [0.22, 1, 0.36, 1]
            }}
            className={`absolute inset-0 flex items-center justify-center ${
              isTargetLight 
                ? 'bg-[#FAF7F2] text-[#12100E]' 
                : 'bg-[#12100E] text-[#FAF7F2]'
            }`}
          >
            {/* Subtle background grain */}
            <div className="absolute inset-0 opacity-40 milan-grain pointer-events-none" />

            {/* Floating Luxury Editorial Badge in Center of Screen */}
            <motion.div
              initial={{ scale: 0.85, opacity: 0, y: 15 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: -10 }}
              transition={{ delay: 0.1, duration: 0.35, ease: "easeOut" }}
              className={`relative z-10 px-6 py-3.5 rounded-2xl border shadow-2xl backdrop-blur-xl flex items-center gap-3.5 ${
                isTargetLight
                  ? 'bg-white/90 border-[#12100E]/15 text-[#12100E]'
                  : 'bg-[#1A1614]/95 border-white/15 text-[#FAF7F2]'
              }`}
            >
              <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${
                isTargetLight ? 'bg-[#12100E] text-[#FAF7F2]' : 'bg-[#FAF7F2] text-[#12100E]'
              }`}>
                {isTargetLight ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              </div>

              <div className="text-left font-mono">
                <p className="text-[10px] uppercase tracking-widest text-stone-500 font-bold">
                  {isTargetLight ? 'MODO CHIARO // 2026' : 'MODO SCURO // NOTTE'}
                </p>
                <p className="font-editorial text-sm sm:text-base font-bold">
                  {isTargetLight ? 'Milanese Bone Cream' : 'Obsidian Espresso'}
                </p>
              </div>

              <span className={`w-2 h-2 rounded-full ${
                isTargetLight ? 'bg-[#D04834]' : 'bg-[#E8E439]'
              } animate-pulse`} />
            </motion.div>

          </motion.div>

        </div>
      )}
    </AnimatePresence>
  );
}
