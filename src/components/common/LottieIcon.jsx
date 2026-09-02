import React from 'react';
import { motion } from 'framer-motion';
import { Truck, Flame, Bell, Coffee, Sparkles, CheckCircle2 } from 'lucide-react';

export function LottieIcon({ type, className = "w-8 h-8", color = "#FFD000" }) {
  if (type === 'truck') {
    return (
      <div className={`relative inline-flex items-center justify-center ${className}`}>
        <motion.div
          animate={{ x: [-2, 2, -2], y: [0, -1, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
        >
          <Truck className="w-full h-full text-thc-yellow drop-shadow-[0_0_10px_rgba(255,208,0,0.5)]" />
        </motion.div>
        <motion.div
          animate={{ opacity: [0.3, 0.8, 0.3], scale: [0.8, 1.2, 0.8] }}
          transition={{ duration: 1, repeat: Infinity }}
          className="absolute -bottom-1 -left-1 w-2 h-2 rounded-full bg-thc-yellow blur-[1px]"
        />
      </div>
    );
  }

  if (type === 'cooking-pan') {
    return (
      <div className={`relative inline-flex items-center justify-center ${className}`}>
        <motion.svg
          animate={{ rotate: [-8, 8, -8] }}
          transition={{ duration: 0.8, repeat: Infinity, ease: "easeInOut" }}
          viewBox="0 0 24 24"
          fill="none"
          stroke={color}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="w-full h-full drop-shadow-[0_0_8px_rgba(255,208,0,0.5)]"
        >
          <path d="M2 12h14a2 2 0 0 1 2 2v2a4 4 0 0 1-4 4H8a4 4 0 0 1-4-4v-2a2 2 0 0 1 2-2z" />
          <line x1="18" y1="14" x2="22" y2="10" />
        </motion.svg>
        <motion.div
          animate={{ y: [-4, -14], opacity: [0.8, 0], scale: [0.6, 1.2] }}
          transition={{ duration: 1, repeat: Infinity, ease: "easeOut" }}
          className="absolute top-0 left-3 w-1.5 h-3 bg-thc-yellow rounded-full blur-[1px]"
        />
        <motion.div
          animate={{ y: [-3, -16], opacity: [0.7, 0], scale: [0.5, 1.3] }}
          transition={{ duration: 1.2, repeat: Infinity, ease: "easeOut", delay: 0.3 }}
          className="absolute top-0 right-3 w-1.5 h-3 bg-thc-red rounded-full blur-[1px]"
        />
      </div>
    );
  }

  if (type === 'scanner-laser') {
    return (
      <div className={`relative overflow-hidden rounded-xl ${className}`}>
        <div className="absolute inset-0 border-2 border-dashed border-thc-turquoise/60 rounded-xl" />
        <motion.div
          animate={{ y: ['0%', '100%', '0%'] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "linear" }}
          className="w-full h-1 bg-gradient-to-r from-transparent via-thc-turquoise to-transparent shadow-[0_0_15px_#00F2FE]"
        />
      </div>
    );
  }

  if (type === 'fire') {
    return (
      <motion.div
        animate={{ scale: [1, 1.15, 0.95, 1.1, 1], rotate: [-4, 4, -2, 3, 0] }}
        transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
        className={`inline-flex items-center justify-center ${className}`}
      >
        <Flame className="w-full h-full text-thc-red drop-shadow-[0_0_8px_rgba(255,42,84,0.6)]" />
      </motion.div>
    );
  }

  if (type === 'bell') {
    return (
      <motion.div
        animate={{ rotate: [0, 18, -18, 12, -12, 0] }}
        transition={{ duration: 1.2, repeat: Infinity, repeatDelay: 1.5 }}
        className={`inline-flex items-center justify-center ${className}`}
      >
        <Bell className="w-full h-full text-thc-turquoise drop-shadow-[0_0_8px_rgba(0,242,254,0.6)]" />
      </motion.div>
    );
  }

  if (type === 'coffee') {
    return (
      <div className={`relative inline-flex items-center justify-center ${className}`}>
        <Coffee className="w-full h-full text-thc-yellow drop-shadow-[0_0_8px_rgba(255,208,0,0.5)]" />
        <motion.div
          animate={{ y: [-2, -10], opacity: [0.8, 0], x: [0, 2, -1] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="absolute -top-2 left-3 w-1 h-3 bg-white/70 rounded-full blur-[0.5px]"
        />
      </div>
    );
  }

  return <Sparkles className={`${className} text-thc-yellow`} />;
}
