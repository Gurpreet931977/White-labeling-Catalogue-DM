import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Lock, KeyRound, Eye, EyeOff, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { BRAND_CONFIG } from '../../data/cafeConfig';
import { sounds } from '../../utils/audio';

export function AdminLoginModal({ isOpen, onClose, onSuccess }) {
  const { adminLogin } = useAuth();
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
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.2 }}
          className="relative w-full max-w-sm bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-7 shadow-2xl overflow-hidden"
        >
          {/* Close Button */}
          <button
            onClick={() => { sounds.playClick(); onClose(); }}
            className="absolute top-5 right-5 p-2 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Header */}
          <div className="text-center mb-6">
            <div className="w-12 h-12 rounded-2xl bg-amber-400/10 border border-amber-400/30 text-amber-400 flex items-center justify-center mx-auto mb-3">
              <Lock className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-white font-syne">
              {BRAND_CONFIG.brandName}
            </h3>
            <p className="text-slate-400 text-xs mt-1 leading-relaxed">
              Enter the staff PIN below to open incoming orders, kitchen tickets, and menu stock.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-slate-200 block mb-1.5 text-center">
                Enter 4-Digit Staff PIN
              </label>

              <div className="relative">
                <KeyRound className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={pinOrPass}
                  onChange={(e) => setPinOrPass(e.target.value)}
                  placeholder={defaultPin}
                  className="w-full pl-11 pr-11 py-3 text-center rounded-xl bg-slate-950 border-2 border-slate-700 text-lg font-mono font-bold text-white placeholder:text-slate-600 focus:outline-none focus:border-amber-400 transition"
                  autoFocus
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Quick Demo Key Helper */}
            <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl text-center">
              <span className="text-xs text-slate-400">Default Staff PIN: </span>
              <button
                type="button"
                onClick={() => handleQuickKey(defaultPin)}
                className="text-amber-400 font-bold font-mono text-sm underline hover:text-amber-300 ml-1"
              >
                {defaultPin} (Click to fill)
              </button>
            </div>

            {errorMsg && (
              <div className="p-3 rounded-xl bg-rose-950/60 border border-rose-800 text-rose-300 text-xs text-center font-medium">
                {errorMsg}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold font-syne text-sm shadow-md transition flex items-center justify-center gap-2"
            >
              <CheckCircle2 className="w-5 h-5" />
              <span>{isLoading ? 'Checking PIN...' : 'Open Staff Dashboard'}</span>
            </button>
          </form>

        </motion.div>
      </div>
    </AnimatePresence>
  );
}
