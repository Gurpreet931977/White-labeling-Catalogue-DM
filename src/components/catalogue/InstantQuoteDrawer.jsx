import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  Send, 
  Sparkles, 
  Check, 
  ArrowRight, 
  Clock, 
  ShieldCheck, 
  Layers,
  MessageSquare
} from 'lucide-react';
import { CATALOGUE_DATA } from '../../data/catalogueData';
import { sounds } from '../../utils/audio';

const FEATURES_LIST = [
  { id: 'whitelabel-theme', label: 'Bespoke Brand Theme & Custom Typography', defaultChecked: true },
  { id: 'booking-flow', label: 'Interactive Slot / Table Reservation Engine', defaultChecked: true },
  { id: 'payment-gateway', label: 'UPI, Card & Razorpay/Stripe Payment Gateway', defaultChecked: true },
  { id: 'whatsapp-alerts', label: 'Instant WhatsApp & SMS Automation Hooks', defaultChecked: false },
  { id: 'admin-pos', label: 'PIN-Protected Staff & Merchant Terminal', defaultChecked: true },
  { id: 'custom-domain', label: 'Custom Domain Setup & SSL Deployment', defaultChecked: true },
];

export function InstantQuoteDrawer({ isOpen, onClose, initialBrandData }) {
  const [selectedNiche, setSelectedNiche] = useState(initialBrandData?.niche || 'cafes');
  const [brandName, setBrandName] = useState(initialBrandData?.brandName || '');
  const [clientContact, setClientContact] = useState('');
  const [selectedFeatures, setSelectedFeatures] = useState(
    FEATURES_LIST.map((f) => f.id)
  );
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const toggleFeature = (id) => {
    sounds.playClick();
    if (selectedFeatures.includes(id)) {
      setSelectedFeatures(selectedFeatures.filter((f) => f !== id));
    } else {
      setSelectedFeatures([...selectedFeatures, id]);
    }
  };

  const handleSendWhatsApp = (e) => {
    e.preventDefault();
    sounds.playSuccess();

    const nicheItem = CATALOGUE_DATA.niches.find((n) => n.id === selectedNiche);
    const msg = `Hi Dripp Media Team, I want to discuss a White-Label Build:%0A%0A• Niche: ${nicheItem?.title || selectedNiche}%0A• Business Name: ${brandName || 'Not specified'}%0A• Selected Features: ${selectedFeatures.length} features%0A• Contact: ${clientContact}%0A%0APlease share the quote and turnaround timeline!`;

    window.open(`https://wa.me/${CATALOGUE_DATA.agency.contactWhatsApp}?text=${msg}`, '_blank');
    setSubmitted(true);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-end">
        
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/80 backdrop-blur-md"
        ></motion.div>

        {/* Slide-in Drawer */}
        <motion.div
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className="relative w-full max-w-lg h-full bg-[#0c0c0c] border-l border-white/15 p-6 sm:p-8 flex flex-col justify-between overflow-y-auto z-10 shadow-2xl"
        >
          {/* Drawer Header */}
          <div>
            <div className="flex items-center justify-between pb-5 border-b border-white/10">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-[#ebd73f] text-black font-black flex items-center justify-center font-panchang text-xs">
                  DM
                </div>
                <div>
                  <h3 className="font-panchang font-bold text-base text-white">
                    Get Instant Quote
                  </h3>
                  <p className="text-[11px] font-mono text-slate-400">
                    TURNKEY WHITE-LABEL DELIVERY
                  </p>
                </div>
              </div>

              <button
                onClick={onClose}
                className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-white/70 hover:text-white transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSendWhatsApp} className="mt-6 space-y-5">
              
              {/* Niche Choice */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-mono text-slate-400 uppercase tracking-wider">
                  Select Niche Category
                </label>
                <select
                  value={selectedNiche}
                  onChange={(e) => setSelectedNiche(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-black border border-white/15 text-white text-xs font-clash focus:outline-none focus:border-[#ebd73f]"
                >
                  {CATALOGUE_DATA.niches.map((n) => (
                    <option key={n.id} value={n.id} className="bg-black text-white">
                      {n.title}
                    </option>
                  ))}
                </select>
              </div>

              {/* Brand Name */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-mono text-slate-400 uppercase tracking-wider">
                  Your Business / Client Name
                </label>
                <input
                  type="text"
                  required
                  value={brandName}
                  onChange={(e) => setBrandName(e.target.value)}
                  placeholder="e.g. Apex Sports Hub, Aura Dental..."
                  className="w-full px-4 py-2.5 rounded-xl bg-black border border-white/15 text-white text-xs font-clash focus:outline-none focus:border-[#ebd73f]"
                />
              </div>

              {/* Contact */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-mono text-slate-400 uppercase tracking-wider">
                  Your WhatsApp / Email
                </label>
                <input
                  type="text"
                  required
                  value={clientContact}
                  onChange={(e) => setClientContact(e.target.value)}
                  placeholder="e.g. +91 98765 43210 or name@brand.com"
                  className="w-full px-4 py-2.5 rounded-xl bg-black border border-white/15 text-white text-xs font-clash focus:outline-none focus:border-[#ebd73f]"
                />
              </div>

              {/* Features Required */}
              <div className="space-y-2 pt-2">
                <label className="text-[11px] font-mono text-slate-400 uppercase tracking-wider block">
                  Included White-Label Modules
                </label>
                <div className="space-y-2">
                  {FEATURES_LIST.map((feat) => {
                    const isChecked = selectedFeatures.includes(feat.id);
                    return (
                      <div
                        key={feat.id}
                        onClick={() => toggleFeature(feat.id)}
                        className={`p-3 rounded-xl border cursor-pointer transition flex items-center justify-between text-xs font-clash ${
                          isChecked 
                            ? 'bg-white/[0.08] border-[#ebd73f]/60 text-white font-medium' 
                            : 'bg-white/[0.02] border-white/10 text-white/50 hover:text-white/80'
                        }`}
                      >
                        <span>{feat.label}</span>
                        <div className={`w-4 h-4 rounded-md border flex items-center justify-center ${
                          isChecked ? 'bg-[#ebd73f] border-[#ebd73f] text-black' : 'border-white/30'
                        }`}>
                          {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Delivery Guarantee Pill */}
              <div className="p-3.5 rounded-2xl bg-[#141414] border border-white/10 flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                  <Clock className="w-4 h-4" />
                </div>
                <div className="text-xs">
                  <p className="font-bold text-white font-clash">2 to 3 Weeks Turnaround</p>
                  <p className="text-[11px] text-slate-400 font-mono">100% turnkey setup on custom domain.</p>
                </div>
              </div>

              {/* Submit CTA */}
              <button
                type="submit"
                className="w-full btn-dripp-primary py-3.5 rounded-full font-bold text-xs flex items-center justify-center gap-2 cursor-pointer shadow-xl mt-4"
              >
                <span className="auth-shimmer-sweep"></span>
                <MessageSquare className="w-4 h-4 text-black" />
                <span>Send WhatsApp Inquiry to Dripp Media</span>
                <ArrowRight className="w-4 h-4" />
              </button>

            </form>
          </div>

          {/* Drawer Footer */}
          <div className="pt-6 border-t border-white/10 text-center text-[11px] font-mono text-slate-400">
            Dripp Media Global Studio • Dehradun, India
          </div>
        </motion.div>

      </div>
    </AnimatePresence>
  );
}
