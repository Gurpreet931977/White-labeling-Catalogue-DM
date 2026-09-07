import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Lock, KeyRound, Eye, EyeOff, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { BRAND_CONFIG } from '../../data/cafeConfig';
import { sounds } from '../../utils/audio';

export function AdminLoginModal({ isOpen, onClose, onSuccess }) {
  const { adminLogin } = useAuth();
  const { isLight } = useTheme();
  const defaultPin = BRAND_CONFIG.admin.defaultPin || '7788';
  const [pinOrPass, setPinOrPass] = useState(defaultPin);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!pinOrPass.trim()) {
      setErrorMsg('Please enter the 4-digit Staff PIN');
      return;
    }

    setErrorMsg('');
    setIsLoading(true);

    const res = await adminLogin(pinOrPass.trim());
    setIsLoading(false);

    if (res.success) {
      if (onSuccess) onSuccess();
      onClose();
    } else {
      setErrorMsg(res.message || `Incorrect PIN. Default PIN is ${defaultPin}.`);
    }
  };

  const handleQuickKey = (keyVal) => {
    setPinOrPass(keyVal);
    setErrorMsg('');
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md font-sans">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.2 }}
          className={`relative w-full max-w-sm rounded-3xl p-6 sm:p-7 shadow-2xl overflow-hidden border transition-colors ${
            isLight 
              ? 'bg-[#FAF7F2] text-[#12100E] border-[#E8E2D5]' 
              : 'bg-[#141210] text-[#FAF7F2] border-white/10'
          }`}
        >
          {/* Close Button */}
          <button
            onClick={() => { sounds.playClick(); onClose(); }}
            className={`absolute top-5 right-5 p-2 rounded-xl border transition-all ${
              isLight 
                ? 'border-stone-200 text-stone-500 hover:text-black hover:bg-stone-100' 
                : 'border-white/10 text-stone-400 hover:text-white hover:bg-white/5'
            }`}
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Masthead */}
          <div className="text-center mb-6">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-3 border transition-colors ${
              isLight 
                ? 'bg-white border-[#E8E2D5] text-[#12100E]' 
                : 'bg-white/5 border-white/10 text-white'
            }`}>
              <Lock className="w-5 h-5 text-[#D04834]" />
            </div>
            <span className={`text-[10px] font-mono uppercase tracking-widest px-2.5 py-0.5 rounded-full border ${
              isLight 
                ? 'bg-stone-100 border-stone-200 text-stone-600' 
                : 'bg-white/5 border-white/10 text-stone-400'
            }`}>
              Atelier Terminal Access
            </span>
            <h3 className="text-2xl font-editorial tracking-tight mt-2 font-normal">
              {BRAND_CONFIG.brandName}
            </h3>
            <p className={`text-xs mt-1 leading-relaxed ${isLight ? 'text-stone-500' : 'text-stone-400'}`}>
              Enter the staff authentication PIN to launch active kitchen tickets and live order management.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className={`text-[10px] font-mono uppercase tracking-widest block mb-2 text-center font-bold ${
                isLight ? 'text-stone-600' : 'text-stone-400'
              }`}>
                4-Digit Staff PIN
              </label>

              <div className="relative">
                <KeyRound className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={pinOrPass}
                  onChange={(e) => setPinOrPass(e.target.value)}
                  placeholder={defaultPin}
                  className={`w-full pl-10 pr-10 py-3 text-center rounded-2xl border text-lg font-mono font-bold tracking-widest focus:outline-none transition ${
                    isLight 
                      ? 'bg-white border-stone-300 text-stone-900 focus:border-[#12100E]' 
                      : 'bg-[#0E0C0B] border-white/10 text-white focus:border-white/30'
                  }`}
                  autoFocus
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 dark:hover:text-white transition"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Quick Demo Helper */}
            <div className={`p-2.5 border rounded-2xl text-center text-xs ${
              isLight 
                ? 'bg-white border-[#E8E2D5] text-stone-600' 
                : 'bg-[#1C1917] border-white/10 text-stone-400'
            }`}>
              <span>Default Demo PIN: </span>
              <button
                type="button"
                onClick={() => handleQuickKey(defaultPin)}
                className="text-[#D04834] font-mono font-bold underline hover:opacity-80 ml-1"
              >
                {defaultPin} (Click to auto-fill)
              </button>
            </div>

            {errorMsg && (
              <div className="p-3 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 text-xs text-center font-mono">
                {errorMsg}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-3.5 rounded-2xl font-syne font-bold text-sm shadow-md transition flex items-center justify-center gap-2 cursor-pointer ${
                isLight 
                  ? 'bg-[#12100E] text-[#FAF7F2] hover:bg-stone-800' 
                  : 'bg-[#FAF7F2] text-[#12100E] hover:bg-stone-200'
              }`}
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{isLoading ? 'Verifica PIN...' : 'Apri Terminale POS'}</span>
            </button>
          </form>

        </motion.div>
      </div>
    </AnimatePresence>
  );
}
