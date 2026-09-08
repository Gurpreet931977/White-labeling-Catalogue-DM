import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  Check, 
  Layers, 
  QrCode, 
  Crown, 
  Truck, 
  ShoppingBag, 
  Award, 
  ArrowRight,
  Utensils,
  Store,
  Compass
} from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { sounds } from '../../utils/audio';

const MODELS = [
  {
    id: 'table-qr',
    code: 'ARCHETYPE // 01',
    name: 'Dine-In Table QR & POS',
    subtitle: 'Classic Full Dine-In Model',
    icon: QrCode,
    badge: 'ACTIVE BY DEFAULT',
    badgeColor: 'bg-amber-400/20 text-amber-300 border-amber-400/30',
    description: 'Customers scan the QR plaque on their table, customize dishes, and waitstaff deliver meals directly to their seat with live kitchen POS tracking.',
    idealFor: 'Artisan cafes, Italian trattorias & full table-service restaurants'
  },
  {
    id: 'self-serve',
    code: 'ARCHETYPE // 02',
    name: 'Self-Serve & Counter Pickup',
    subtitle: 'Fast-Casual QSR Model',
    icon: Store,
    badge: 'ZERO TABLE SERVICE',
    badgeColor: 'bg-cyan-400/20 text-cyan-300 border-cyan-400/30',
    description: 'No table service. Customers order via phone or counter kiosk, get an automated pickup Token (e.g. TOKEN #C-14), and collect from the kitchen counter.',
    idealFor: 'Coffee kiosks, bakeries, food courts, smash burger counters'
  },
  {
    id: 'showcase',
    code: 'ARCHETYPE // 03',
    name: 'Brand Showcase Landing Page',
    subtitle: 'Curated Menu & VIP Bookings',
    icon: Compass,
    badge: 'SHOWCASE ONLY',
    badgeColor: 'bg-purple-400/20 text-purple-300 border-purple-400/30',
    description: 'A pure digital flagship for brand storytelling, curated menu exploration, opening hours, and table reservations — with in-store checkout hidden.',
    idealFor: 'Sunset lounges, rooftop dining, boutique roasteries, fine dining'
  },
  {
    id: 'delivery',
    code: 'ARCHETYPE // 04',
    name: 'Direct Online Doorstep Delivery',
    subtitle: 'Independent Delivery Suite',
    icon: Truck,
    badge: '0% COMMISSIONS',
    badgeColor: 'bg-emerald-400/20 text-emerald-300 border-emerald-400/30',
    description: 'Accept home delivery orders directly on the website with customer address input, dynamic delivery fees, and live courier dispatch tracking.',
    idealFor: 'Cloud kitchens, gourmet pizza delivery, dessert hubs'
  },
  {
    id: 'hybrid',
    code: 'ARCHETYPE // 05',
    name: 'Hybrid Dine-In & Home Delivery',
    subtitle: 'Omnichannel 3-in-1 Suite',
    icon: Layers,
    badge: 'ALL-IN-ONE HYBRID',
    badgeColor: 'bg-blue-400/20 text-blue-300 border-blue-400/30',
    description: 'Interactive mode switcher enabling Table QR ordering inside the cafe, Doorstep Delivery when at home, or quick takeaway on the go.',
    idealFor: 'Modern high-volume cafes seeking multi-channel revenue'
  },
  {
    id: 'loyalty',
    code: 'ARCHETYPE // 06',
    name: 'Loyalty Rewards & 7-Visit Club',
    subtitle: 'Billing-Integrated Punch Card',
    icon: Award,
    badge: 'RETENTION ENGINE',
    badgeColor: 'bg-rose-400/20 text-rose-300 border-rose-400/30',
    description: 'Interactive 7-stamp digital punch card. Every time a bill is settled or presence is checked in, visits mark up. 7th visit unlocks 50% OFF at checkout!',
    idealFor: 'Repeat-business cafes, coffee bars, bubble tea & dessert clubs'
  },
  {
    id: 'gamified-loyalty',
    code: 'ARCHETYPE // 07',
    name: 'Gamified Coffee & Bakery Loyalty Pass',
    subtitle: '100% Gamified Rewards & Kiosk',
    icon: Crown,
    badge: 'JUST LOYALTY • GAMIFIED',
    badgeColor: 'bg-amber-400/25 text-amber-300 border-amber-400/50 shadow-sm',
    description: 'Zero POS or food menu clutter. A pure gamified loyalty club and barista counter kiosk with bouncy Lottie micro-animations, jiggly stamps, daily caffeine streaks, and mystery scratch treats.',
    idealFor: 'Espresso bars, roasteries, artisan bakeries, sourdough clubs & patisseries'
  }
];

export function ModelSwitcherModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  const { operationalModel, setOperationalModel } = useCart();

  const handleSelectModel = (modelId) => {
    sounds.playSuccess();
    setOperationalModel(modelId);
    window.dispatchEvent(new CustomEvent('thc_model_change', { detail: { model: modelId } }));
    onClose();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-md overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="relative w-full max-w-2xl bg-slate-900 border border-white/15 rounded-3xl p-5 sm:p-7 shadow-2xl overflow-hidden text-white my-8 max-h-[90vh] flex flex-col"
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-white/10 shrink-0">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-2xl bg-[#ebd73f] text-black flex items-center justify-center font-black shadow-lg">
                <Layers className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-mono text-[#ebd73f] uppercase tracking-wider font-bold">
                  WHITE-LABEL ENGINE // ARCHITECTURE SWITCHER
                </span>
                <h3 className="text-lg font-bold font-syne text-white">
                  Switch Active Website Model
                </h3>
              </div>
            </div>

            <button
              onClick={() => { sounds.playClick(); onClose(); }}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <p className="text-xs text-slate-400 font-clash mt-3 shrink-0">
            Select any model below to test how the website adapts its customer flow, checkout, table handling, delivery, and loyalty systems in real-time.
          </p>

          {/* Model Selection List */}
          <div className="mt-4 space-y-3 overflow-y-auto pr-1 flex-1 py-1">
            {MODELS.map((model) => {
              const Icon = model.icon;
              const isSelected = operationalModel === model.id;

              return (
                <div
                  key={model.id}
                  onClick={() => handleSelectModel(model.id)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 ${
                    isSelected
                      ? 'bg-amber-400/10 border-amber-400/60 shadow-lg ring-1 ring-amber-400/40'
                      : 'bg-slate-950/80 border-white/5 hover:border-white/20 hover:bg-slate-800/60'
                  }`}
                >
                  <div className="flex items-start gap-3.5 flex-1 min-w-0">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${
                      isSelected
                        ? 'bg-amber-400 text-slate-950 font-bold shadow-md'
                        : 'bg-white/5 text-slate-300'
                    }`}>
                      <Icon className="w-5 h-5" />
                    </div>

                    <div className="space-y-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-mono text-[10px] text-slate-500 font-bold">{model.code}</span>
                        <span className={`text-[9px] font-mono px-2 py-0.2 rounded-full border font-bold ${model.badgeColor}`}>
                          {model.badge}
                        </span>
                      </div>
                      <h4 className="font-syne font-bold text-sm text-white flex items-center gap-1.5">
                        <span>{model.name}</span>
                        <span className="text-xs text-slate-400 font-normal">({model.subtitle})</span>
                      </h4>
                      <p className="text-xs text-slate-400 leading-relaxed font-clash">
                        {model.description}
                      </p>
                      <p className="text-[10px] font-mono text-amber-400/80">
                        Target: {model.idealFor}
                      </p>
                    </div>
                  </div>

                  {/* Right Status / Select Button */}
                  <div className="shrink-0 self-end sm:self-center">
                    {isSelected ? (
                      <span className="px-3 py-1.5 rounded-xl bg-amber-400 text-slate-950 text-xs font-bold font-syne flex items-center gap-1.5 shadow-sm">
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                        <span>Active</span>
                      </span>
                    ) : (
                      <span className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-semibold font-syne flex items-center gap-1 transition">
                        <span>Switch</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Footer Note */}
          <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-[11px] font-mono text-slate-500 shrink-0">
            <span>Changes take effect immediately across all cart &amp; checkout flows.</span>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-white font-bold"
            >
              Close
            </button>
          </div>

        </motion.div>
      </div>
    </AnimatePresence>
  );
}
