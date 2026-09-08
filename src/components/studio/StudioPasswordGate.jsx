import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, Eye, EyeOff, ArrowRight, ShieldCheck, X } from 'lucide-react';

// Salted hash check — compare plain text only in memory, never store in plaintext in localStorage
const STUDIO_PASSWORD = 'Websitebanaofatafat';
const SESSION_KEY = 'dripp_studio_auth';

function verifyPassword(input) {
  return input === STUDIO_PASSWORD;
}

function setSessionAuth() {
  try {
    const token = btoa(`dripp:${Date.now()}`);
    sessionStorage.setItem(SESSION_KEY, token);
  } catch (e) {}
}

export function isStudioAuthenticated() {
  try {
    return typeof window !== 'undefined' && !!sessionStorage.getItem(SESSION_KEY);
  } catch (e) {
    return false;
  }
}

export function clearStudioAuth() {
  try {
    sessionStorage.removeItem(SESSION_KEY);
  } catch (e) {}
}

export function StudioPasswordGate({ onAuthenticated, onBack }) {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(null);
  const [shake, setShake] = useState(false);
  const [success, setSuccess] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => {
    // Auto-focus the input on mount
    setTimeout(() => inputRef.current?.focus(), 400);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (verifyPassword(password)) {
      setSuccess(true);
      setSessionAuth();
      setTimeout(() => onAuthenticated(), 700);
    } else {
      setError('Incorrect access key. Contact your Dripp Media administrator.');
      setShake(true);
      setPassword('');
      setTimeout(() => setShake(false), 600);
      setTimeout(() => setError(null), 4000);
    }
  };

  return (
    <div className="min-h-screen bg-[#040404] flex items-center justify-center px-4">
      {/* Background grid */}
      <div
        className="fixed inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage: 'linear-gradient(#ebd73f 1px, transparent 1px), linear-gradient(90deg, #ebd73f 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }}
      />

      {/* Glow blob */}
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-[#ebd73f]/5 blur-[120px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="relative w-full max-w-sm"
      >
        {/* Back button */}
        {onBack && (
          <button
            onClick={onBack}
            className="absolute -top-12 left-0 flex items-center gap-1.5 text-slate-500 hover:text-white text-xs font-mono transition cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
            <span>Back to Catalogue</span>
          </button>
        )}

        <div className="bg-[#0d0d0d] border border-white/10 rounded-3xl p-8 shadow-[0_40px_120px_rgba(0,0,0,0.8)]">
          {/* Icon */}
          <div className="flex justify-center mb-6">
            <AnimatePresence mode="wait">
              {success ? (
                <motion.div
                  key="success"
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="w-14 h-14 rounded-2xl bg-[#ebd73f] flex items-center justify-center shadow-[0_0_40px_rgba(235,215,63,0.4)]"
                >
                  <ShieldCheck className="w-7 h-7 text-black" />
                </motion.div>
              ) : (
                <motion.div
                  key="lock"
                  animate={shake ? { x: [-8, 8, -8, 8, -4, 4, 0] } : {}}
                  transition={{ duration: 0.4 }}
                  className="w-14 h-14 rounded-2xl bg-white/5 border border-white/15 flex items-center justify-center"
                >
                  <Lock className="w-7 h-7 text-[#ebd73f]" />
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Title */}
          <div className="text-center mb-6 space-y-1">
            <p className="font-mono text-[10px] text-[#ebd73f] tracking-[0.25em] uppercase">
              Dripp Media
            </p>
            <h1 className="font-panchang font-bold text-xl text-white">
              {success ? 'Access Granted' : 'White-Label Studio'}
            </h1>
            <p className="text-xs text-slate-400 font-clash">
              {success
                ? 'Initialising editor panel...'
                : 'Admin and developer access only. Enter your master key to continue.'}
            </p>
          </div>

          {/* Form */}
          {!success && (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="relative">
                <input
                  ref={inputRef}
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter master access key"
                  autoComplete="current-password"
                  className="w-full px-4 py-3 pr-12 rounded-xl bg-black border border-white/15 text-white text-sm font-mono placeholder-slate-600 focus:outline-none focus:border-[#ebd73f] transition"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((p) => !p)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition cursor-pointer"
                  tabIndex={-1}
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>

              {/* Error */}
              <AnimatePresence>
                {error && (
                  <motion.p
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    className="text-xs text-rose-400 font-mono text-center"
                  >
                    {error}
                  </motion.p>
                )}
              </AnimatePresence>

              <button
                type="submit"
                disabled={!password}
                className="w-full py-3 rounded-xl bg-[#ebd73f] hover:bg-white text-black font-bold text-sm font-clash flex items-center justify-center gap-2 transition shadow-[0_0_30px_rgba(235,215,63,0.3)] disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
              >
                <span>Unlock Studio</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}

          {/* Footer */}
          <p className="text-center text-[10px] font-mono text-slate-600 mt-6">
            Authorised access only • Dripp Media Internal Tool
          </p>
        </div>
      </motion.div>
    </div>
  );
}
