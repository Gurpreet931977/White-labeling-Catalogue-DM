import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BellRing, 
  X, 
  Droplets, 
  Utensils, 
  UserCheck, 
  CreditCard, 
  Check, 
  Clock, 
  ShieldCheck, 
  Sparkles,
  PhoneCall
} from 'lucide-react';
import { useOrder } from '../../context/OrderContext';
import { useCart } from '../../context/CartContext';
import { useTheme } from '../../context/ThemeContext';
import { sounds } from '../../utils/audio';

export function VipConciergeModal({ isOpen, onClose }) {
  const { activeTable } = useCart();
  const { requestTableService } = useOrder();
  const { isLight } = useTheme();

  const [lastRequested, setLastRequested] = useState(null);
  const [submittingType, setSubmittingType] = useState(null);

  if (!isOpen) return null;

  const handleServiceSelect = (type, title, description) => {
    sounds.playClick();
    setSubmittingType(type);

    if (requestTableService) {
      requestTableService(activeTable || 8, type);
    }

    setTimeout(() => {
      setSubmittingType(null);
      setLastRequested({
        title,
        description,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      });
    }, 400);
  };

  const CONCIERGE_ACTIONS = [
    {
      type: 'water',
      icon: Droplets,
      title: 'Water Service',
      subtitle: 'Chilled still mountain spring or sparkling mineral water with fresh lemon slice.',
      eta: '45 seconds'
    },
    {
      type: 'silverware',
      icon: Utensils,
      title: 'Linen & Cutlery',
      subtitle: 'Extra linen napkins, polished steak knives, ceramic side plates, or dip ramekins.',
      eta: '60 seconds'
    },
    {
      type: 'captain',
      icon: UserCheck,
      title: 'Floor Captain & Sommelier',
      subtitle: 'Request dietary consultation, sommelier pairing guidance, or special chef requests.',
      eta: '90 seconds'
    },
    {
      type: 'bill',
      icon: CreditCard,
      title: 'Settle Table Bill',
      subtitle: 'Request wireless payment terminal, printed GST receipt, or table cash settlement.',
      eta: 'Immediate'
    }
  ];

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

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 16 }}
          transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
          className={`relative w-full max-w-lg rounded-3xl border shadow-2xl overflow-hidden z-10 my-8 transition-colors ${
            isLight
              ? 'bg-[#FAF7F2] border-black/15 text-[#12100E] shadow-stone-400/40'
              : 'bg-[#141210] border-[#C5A880]/30 text-[#FAF7F2] shadow-black/80'
          }`}
        >
          {/* Header */}
          <div className={`px-6 py-5 border-b flex items-center justify-between ${
            isLight ? 'bg-[#F0EAE1] border-black/10' : 'bg-[#0E0C0B] border-white/10'
          }`}>
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-[#C5A880]/20 border border-[#C5A880]/40 flex items-center justify-center text-[#C5A880]">
                <BellRing className="w-4 h-4 animate-pulse" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono font-bold tracking-widest uppercase text-[#C5A880]">
                    VIP Concierge
                  </span>
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  <span className="text-[10px] font-mono text-stone-400">
                    Station #{activeTable || 8}
                  </span>
                </div>
                <h3 className="font-editorial text-lg font-bold text-inherit leading-tight">
                  Instant Table Assistance
                </h3>
              </div>
            </div>

            <button
              onClick={() => { sounds.playClick(); onClose(); }}
              className={`p-1.5 rounded-xl transition cursor-pointer ${
                isLight ? 'text-stone-500 hover:text-black hover:bg-black/5' : 'text-stone-400 hover:text-white hover:bg-white/10'
              }`}
              aria-label="Close Concierge"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="p-6 space-y-4 text-left">
            {/* Last Requested Banner Feedback */}
            <AnimatePresence>
              {lastRequested && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="p-4 rounded-2xl bg-emerald-950/80 border border-emerald-500/40 text-emerald-200 flex items-start gap-3 text-xs"
                >
                  <div className="w-6 h-6 rounded-full bg-emerald-500/20 flex items-center justify-center shrink-0 text-emerald-400 mt-0.5">
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  </div>
                  <div className="space-y-0.5">
                    <p className="font-syne font-bold text-white">
                      Request Dispatched to Floor Captain
                    </p>
                    <p className="text-[11px] text-emerald-300 font-mono">
                      {lastRequested.title} requested at {lastRequested.timestamp} for Table #{activeTable || 8}. Staff assigned.
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <p className={`text-xs leading-relaxed ${isLight ? 'text-stone-600' : 'text-stone-300'}`}>
              Select a service request below. Our dining room floor captain receives an acoustic alert on their kitchen dispatch terminal immediately.
            </p>

            {/* Concierge Action Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              {CONCIERGE_ACTIONS.map((action) => {
                const Icon = action.icon;
                const isProcessing = submittingType === action.type;

                return (
                  <button
                    key={action.type}
                    onClick={() => handleServiceSelect(action.type, action.title, action.subtitle)}
                    disabled={isProcessing}
                    className={`p-4 rounded-2xl border text-left flex flex-col justify-between space-y-3 transition cursor-pointer group relative overflow-hidden ${
                      isLight
                        ? 'bg-white border-black/10 hover:border-[#C5A880] hover:shadow-md'
                        : 'bg-[#1A1614] border-white/10 hover:border-[#C5A880]/60 hover:bg-[#201C19]'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="w-8 h-8 rounded-xl bg-[#C5A880]/15 border border-[#C5A880]/30 flex items-center justify-center text-[#C5A880] group-hover:scale-110 transition-transform">
                        <Icon className="w-4 h-4" />
                      </div>
                      <span className="text-[9px] font-mono px-2 py-0.5 rounded-full bg-black/10 dark:bg-white/10 text-stone-400">
                        ETA {action.eta}
                      </span>
                    </div>

                    <div className="space-y-1">
                      <h4 className="font-editorial text-sm font-bold text-inherit group-hover:text-[#C5A880] transition-colors">
                        {action.title}
                      </h4>
                      <p className={`text-[11px] leading-snug line-clamp-2 ${isLight ? 'text-stone-500' : 'text-stone-400'}`}>
                        {action.subtitle}
                      </p>
                    </div>

                    <div className="pt-1 flex items-center justify-between text-[10px] font-mono font-bold text-[#C5A880]">
                      <span>{isProcessing ? 'Alerting...' : 'Tap to Summon'}</span>
                      <span className="group-hover:translate-x-1 transition-transform">→</span>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Bottom Guarantee */}
            <div className={`p-3 rounded-xl border text-[11px] font-mono flex items-center justify-between ${
              isLight ? 'bg-black/5 border-black/10 text-stone-600' : 'bg-white/5 border-white/10 text-stone-400'
            }`}>
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-[#C5A880]" />
                <span>Audited Table Dispatch Protocol</span>
              </span>
              <span className="text-[#C5A880] font-bold">Average ETA ~60s</span>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

/**
 * Floating VIP Table Concierge Trigger Pill
 */
export function VipConciergeFloatingButton({ onOpen, activeTable = 8 }) {
  const { isLight } = useTheme();

  return (
    <motion.button
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={() => { sounds.playClick(); onOpen(); }}
      className={`fixed bottom-6 right-4 sm:right-6 z-40 px-3.5 py-2.5 rounded-full border shadow-2xl backdrop-blur-xl flex items-center gap-2 text-xs font-mono transition cursor-pointer ${
        isLight
          ? 'bg-[#FAF7F2]/95 border-black/15 text-[#12100E] shadow-black/15 hover:border-[#C5A880]'
          : 'bg-[#141210]/95 border-[#C5A880]/40 text-[#FAF7F2] shadow-black/60 hover:border-[#C5A880]'
      }`}
      title="Summon Table Concierge"
      aria-label="Summon Table Concierge"
    >
      <span className="relative flex h-2 w-2">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#C5A880] opacity-75" />
        <span className="relative inline-flex rounded-full h-2 w-2 bg-[#C5A880]" />
      </span>
      <span className="font-bold tracking-wider uppercase text-[10px]">Table #{activeTable} Concierge</span>
    </motion.button>
  );
}
