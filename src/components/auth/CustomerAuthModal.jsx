import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  Phone, 
  User, 
  Mail, 
  CheckCircle2, 
  ArrowRight, 
  ShieldCheck, 
  Zap, 
  UtensilsCrossed,
  ArrowLeft
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { BRAND_CONFIG } from '../../data/cafeConfig';
import { sounds } from '../../utils/audio';

export function CustomerAuthModal({ isOpen, onClose, onSuccess }) {
  const { customerLogin } = useAuth();
  const [tab, setTab] = useState('phone'); // 'phone' | 'email' | 'quick'
  
  // Step in phone login: 1 = Enter phone, 2 = Enter OTP code
  const [step, setStep] = useState(1);
  const [phone, setPhone] = useState('9876543210');
  const [name, setName] = useState('Guest');
  const [email, setEmail] = useState('guest@example.com');
  const [otp, setOtp] = useState('7788');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  // Step 1: Send SMS code
  const handleSendOtp = (e) => {
    e.preventDefault();
    if (!phone || phone.length < 10) {
      setErrorMsg('Please enter your 10-digit mobile number');
      return;
    }
    setErrorMsg('');
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setStep(2);
      sounds.playClick();
    }, 400);
  };

  // Step 2: Verify code and login
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setIsLoading(true);

    const res = await customerLogin({
      phone,
      name: name.trim() || 'Guest',
      email: `${phone}@guest.com`,
      avatar: `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(name || phone)}`
    });

    setIsLoading(false);
    if (res.success) {
      if (onSuccess) onSuccess(res.user);
      onClose();
    } else {
      setErrorMsg(res.message || 'Verification failed. Please try again.');
    }
  };

  // Email login
  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      setErrorMsg('Please enter a valid email address');
      return;
    }
    setErrorMsg('');
    setIsLoading(true);

    const res = await customerLogin({
      name: name.trim() || 'Guest',
      email: email.trim(),
      phone: phone || '9876543210',
      avatar: `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(name || email)}`
    });

    setIsLoading(false);
    if (res.success) {
      if (onSuccess) onSuccess(res.user);
      onClose();
    } else {
      setErrorMsg(res.message || 'Login failed. Please try again.');
    }
  };

  // 1-Click Fast Guest Login
  const handleQuickLogin = async (personaName, personaPhone) => {
    sounds.playClick();
    setIsLoading(true);
    const res = await customerLogin({
      name: personaName,
      phone: personaPhone,
      email: `${personaPhone}@guest.com`,
      avatar: `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(personaName)}`
    });
    setIsLoading(false);
    if (res.success) {
      if (onSuccess) onSuccess(res.user);
      onClose();
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.2 }}
          className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl overflow-hidden"
        >
          {/* Subtle Ambient Glow */}
          <div className="absolute -top-24 -right-24 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

          {/* Close Button */}
          <button
            onClick={() => { sounds.playClick(); onClose(); }}
            className="absolute top-5 right-5 p-2 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Modal Header */}
          <div className="text-center mb-6">
            <div className="w-12 h-12 rounded-2xl bg-amber-400/10 border border-amber-400/20 text-amber-400 flex items-center justify-center mx-auto mb-3">
              <UtensilsCrossed className="w-6 h-6" />
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-white font-syne">
              Welcome to {BRAND_CONFIG.brandName}
            </h3>
            <p className="text-slate-400 text-xs mt-1.5 leading-relaxed">
              Login with your mobile number to view the menu, customize spices, and order directly to your table.
            </p>
          </div>

          {/* Simple Tab Switcher */}
          <div className="flex items-center p-1 bg-slate-950 rounded-2xl border border-slate-800 mb-6">
            <button
              onClick={() => { sounds.playClick(); setTab('phone'); setErrorMsg(''); }}
              className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 ${
                tab === 'phone'
                  ? 'bg-amber-400 text-slate-950 shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Phone className="w-3.5 h-3.5" />
              <span>Mobile SMS</span>
            </button>
            <button
              onClick={() => { sounds.playClick(); setTab('quick'); setErrorMsg(''); }}
              className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 ${
                tab === 'quick'
                  ? 'bg-amber-400 text-slate-950 shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Zap className="w-3.5 h-3.5" />
              <span>1-Click Test</span>
            </button>
            <button
              onClick={() => { sounds.playClick(); setTab('email'); setErrorMsg(''); }}
              className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 ${
                tab === 'email'
                  ? 'bg-amber-400 text-slate-950 shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Mail className="w-3.5 h-3.5" />
              <span>Email</span>
            </button>
          </div>

          {/* TAB 1: Mobile Phone (2-Step Easy Flow) */}
          {tab === 'phone' && (
            <div className="space-y-4">
              
              {/* STEP 1: Enter Phone Number */}
              {step === 1 && (
                <form onSubmit={handleSendOtp} className="space-y-4">
                  <div className="p-2.5 bg-amber-400/10 rounded-xl border border-amber-400/20 text-center">
                    <span className="text-xs font-bold text-amber-300">
                      Step 1 of 2: Enter your details
                    </span>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-200 block mb-1">
                      Your Name (Optional)
                    </label>
                    <div className="relative">
                      <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="e.g. Rahul Sharma"
                        className="w-full pl-10 pr-3 py-3 rounded-xl bg-slate-950 border border-slate-700 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-amber-400 transition"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-200 block mb-1">
                      Mobile Number <span className="text-rose-400">*</span>
                    </label>
                    <div className="relative">
                      <span className="text-sm font-semibold text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2">
                        +91
                      </span>
                      <input
                        type="tel"
                        maxLength="10"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                        placeholder="98765 43210"
                        className="w-full pl-12 pr-3 py-3 rounded-xl bg-slate-950 border border-slate-700 text-sm text-white font-mono placeholder:text-slate-500 focus:outline-none focus:border-amber-400 transition"
                        autoFocus
                      />
                    </div>
                    <p className="text-[11px] text-slate-400 mt-1">
                      We will send a 4-digit code to this number.
                    </p>
                  </div>

                  {errorMsg && (
                    <div className="p-3 bg-rose-950/60 border border-rose-800 rounded-xl text-rose-300 text-xs">
                      {errorMsg}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-3.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-sm shadow-md transition flex items-center justify-center gap-2"
                  >
                    <span>{isLoading ? 'Sending Code...' : 'Next: Get 4-Digit Code'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </form>
              )}

              {/* STEP 2: Enter 4-Digit Code */}
              {step === 2 && (
                <form onSubmit={handleVerifyOtp} className="space-y-4">
                  <div className="p-2.5 bg-emerald-500/10 rounded-xl border border-emerald-500/20 text-center">
                    <span className="text-xs font-bold text-emerald-300">
                      Step 2 of 2: Enter the 4-digit code
                    </span>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300 flex items-center justify-between">
                    <span>Code sent to: <strong>+91 {phone}</strong></span>
                    <button
                      type="button"
                      onClick={() => { setStep(1); setErrorMsg(''); }}
                      className="text-amber-400 font-bold hover:underline inline-flex items-center gap-1"
                    >
                      <ArrowLeft className="w-3 h-3" /> Change
                    </button>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-200 block mb-1 text-center">
                      Enter 4-Digit Code
                    </label>
                    <input
                      type="text"
                      maxLength="4"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                      placeholder="7788"
                      className="w-full py-3 text-center rounded-xl bg-slate-950 border-2 border-amber-400 text-white font-mono text-xl font-bold tracking-widest focus:outline-none focus:ring-2 focus:ring-amber-400"
                      autoFocus
                    />
                    <div className="mt-2 text-center p-2 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-300">
                      Demo Code: <span className="text-amber-400 font-bold font-mono text-sm">7788</span>
                    </div>
                  </div>

                  {errorMsg && (
                    <div className="p-3 bg-rose-950/60 border border-rose-800 rounded-xl text-rose-300 text-xs">
                      {errorMsg}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm shadow-md transition flex items-center justify-center gap-2"
                  >
                    <CheckCircle2 className="w-5 h-5" />
                    <span>{isLoading ? 'Checking Code...' : 'Verify & Open Menu'}</span>
                  </button>
                </form>
              )}

            </div>
          )}

          {/* TAB 2: 1-Click Fast Guest Login */}
          {tab === 'quick' && (
            <div className="space-y-3">
              <p className="text-slate-300 text-xs text-center">
                Click any profile below to instantly login:
              </p>
              {[
                { name: 'Rahul Sharma', phone: '9876543210', tag: 'Diner' },
                { name: 'Pooja Negi', phone: '9811223344', tag: 'Foodie' },
                { name: 'Aman Rawat', phone: '9988776655', tag: 'Guest' }
              ].map((p, idx) => (
                <button
                  key={idx}
                  onClick={() => handleQuickLogin(p.name, p.phone)}
                  className="w-full p-3.5 rounded-2xl bg-slate-950 hover:bg-slate-800 border border-slate-800 hover:border-amber-400 transition flex items-center justify-between text-left group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-amber-400/20 border border-amber-400/30 flex items-center justify-center text-amber-300 font-bold text-sm">
                      {p.name.charAt(0)}
                    </div>
                    <div>
                      <p className="text-white text-xs font-bold group-hover:text-amber-400 transition">
                        {p.name}
                      </p>
                      <p className="text-[11px] text-slate-400 font-mono">+91 {p.phone}</p>
                    </div>
                  </div>
                  <span className="text-xs px-2 py-1 rounded bg-slate-900 text-amber-300 font-semibold">
                    {p.tag}
                  </span>
                </button>
              ))}
            </div>
          )}

          {/* TAB 3: Email Login */}
          {tab === 'email' && (
            <form onSubmit={handleEmailSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-200 block mb-1">
                  Your Full Name
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Rahul Sharma"
                    className="w-full pl-10 pr-3 py-3 rounded-xl bg-slate-950 border border-slate-700 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-amber-400 transition"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-200 block mb-1">
                  Email Address <span className="text-rose-400">*</span>
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="foodie@example.com"
                    className="w-full pl-10 pr-3 py-3 rounded-xl bg-slate-950 border border-slate-700 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-amber-400 transition"
                  />
                </div>
              </div>

              {errorMsg && (
                <div className="p-3 bg-rose-950/60 border border-rose-800 rounded-xl text-rose-300 text-xs">
                  {errorMsg}
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-sm shadow-md transition flex items-center justify-center gap-2"
              >
                <span>{isLoading ? 'Logging In...' : 'Continue to Menu'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}

          {/* Simple Safe Badge */}
          <div className="mt-6 pt-3 border-t border-slate-800 flex items-center justify-center gap-2 text-xs text-slate-400">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Fast, safe & simple ordering</span>
          </div>

        </motion.div>
      </div>
    </AnimatePresence>
  );
}
