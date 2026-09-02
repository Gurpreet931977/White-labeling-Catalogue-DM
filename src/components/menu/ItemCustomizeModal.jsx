import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Flame, Plus, Minus, Check, MessageSquare, Leaf, Drumstick } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { sounds } from '../../utils/audio';

export function ItemCustomizeModal({ item, isOpen, onClose }) {
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [selectedSpice, setSelectedSpice] = useState(() => {
    return item?.spiceOptions ? item.spiceOptions[0] : null;
  });
  const [selectedAddons, setSelectedAddons] = useState([]);
  const [notes, setNotes] = useState('');

  if (!isOpen || !item) return null;

  const handleToggleAddon = (addon) => {
    sounds.playClick();
    setSelectedAddons(prev => {
      const exists = prev.some(a => a.id === addon.id);
      if (exists) {
        return prev.filter(a => a.id !== addon.id);
      } else {
        return [...prev, addon];
      }
    });
  };

  const addonsTotal = selectedAddons.reduce((sum, a) => sum + a.price, 0);
  const unitPrice = item.price + addonsTotal;
  const totalPrice = unitPrice * quantity;

  const handleConfirm = () => {
    addToCart(item, quantity, selectedSpice, selectedAddons, notes);
    onClose();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.2 }}
          className="relative w-full max-w-md bg-slate-900 border border-white/10 rounded-3xl overflow-hidden shadow-2xl my-6"
        >
          {/* Header Image */}
          <div className="relative h-44 sm:h-48 bg-slate-950">
            <img
              src={item.image}
              alt={item.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/30 to-transparent" />
            
            {/* Close button */}
            <button
              onClick={() => { sounds.playClick(); onClose(); }}
              className="absolute top-4 right-4 p-2 rounded-full bg-slate-950/80 hover:bg-slate-950 text-white transition"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Price Badge */}
            <div className="absolute bottom-3 left-4 sm:left-5">
              <div className="flex items-center gap-1.5 mb-1">
                <span
                  className={`px-2 py-0.5 rounded text-[10px] font-bold flex items-center gap-1 ${
                    item.isVeg ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'
                  }`}
                >
                  {item.isVeg ? <Leaf className="w-3 h-3" /> : <Drumstick className="w-3 h-3" />}
                  <span>{item.isVeg ? 'VEG' : 'NON-VEG'}</span>
                </span>
              </div>
              <h3 className="text-xl font-bold text-white font-syne">
                {item.name}
              </h3>
            </div>
          </div>

          {/* Body Content */}
          <div className="p-4 sm:p-5 space-y-4 max-h-[50vh] overflow-y-auto">
            <p className="text-slate-400 text-xs leading-relaxed">
              {item.description}
            </p>

            {/* Spice Level Option */}
            {item.spiceOptions && item.spiceOptions.length > 0 && (
              <div className="space-y-2">
                <label className="text-[11px] font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-1">
                  <Flame className="w-3.5 h-3.5 text-rose-400" />
                  <span>Spice Level:</span>
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {item.spiceOptions.map((spice) => (
                    <button
                      key={spice}
                      onClick={() => { sounds.playClick(); setSelectedSpice(spice); }}
                      className={`py-2 px-2.5 rounded-xl text-xs font-medium font-mono transition-all border text-center ${
                        selectedSpice === spice
                          ? 'bg-rose-500/20 border-rose-500 text-rose-300 font-bold'
                          : 'bg-slate-950 border-white/5 text-slate-400 hover:text-white'
                      }`}
                    >
                      {spice}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Addons Section */}
            {item.addons && item.addons.length > 0 && (
              <div className="space-y-2">
                <label className="text-[11px] font-semibold text-slate-300 uppercase tracking-wider block">
                  Add-ons & Extras:
                </label>
                <div className="space-y-1.5">
                  {item.addons.map((addon) => {
                    const isSelected = selectedAddons.some(a => a.id === addon.id);
                    return (
                      <div
                        key={addon.id}
                        onClick={() => handleToggleAddon(addon)}
                        className={`p-2.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                          isSelected
                            ? 'bg-amber-400/10 border-amber-400/50 text-white'
                            : 'bg-slate-950 border-white/5 text-slate-300 hover:border-white/10'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <div
                            className={`w-4 h-4 rounded-md border flex items-center justify-center ${
                              isSelected
                                ? 'bg-amber-400 border-amber-400 text-slate-950'
                                : 'border-slate-700 bg-slate-900'
                            }`}
                          >
                            {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                          </div>
                          <span className="text-xs">{addon.name}</span>
                        </div>
                        <span className="text-xs font-mono font-bold text-amber-300">
                          +₹{addon.price}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Special Instructions */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-1">
                <MessageSquare className="w-3.5 h-3.5 text-cyan-400" />
                <span>Special Note for Kitchen:</span>
              </label>
              <input
                type="text"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="e.g. Less spicy, extra crisp..."
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-white/5 focus:border-amber-400 focus:outline-none text-xs text-white placeholder:text-slate-600"
              />
            </div>
          </div>

          {/* Footer Action Bar */}
          <div className="p-4 bg-slate-950 border-t border-white/5 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2 bg-slate-900 p-1 rounded-xl border border-white/5">
              <button
                onClick={() => {
                  sounds.playClick();
                  if (quantity > 1) setQuantity(quantity - 1);
                }}
                className="w-7 h-7 rounded-lg bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-slate-300"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
              <span className="font-mono font-bold text-xs text-white w-4 text-center">
                {quantity}
              </span>
              <button
                onClick={() => {
                  sounds.playClick();
                  setQuantity(quantity + 1);
                }}
                className="w-7 h-7 rounded-lg bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-slate-300"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>

            <button
              onClick={handleConfirm}
              className="flex-1 py-2.5 px-4 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-syne font-bold text-xs transition flex items-center justify-between"
            >
              <span>ADD TO ORDER</span>
              <span className="font-mono font-bold">₹{totalPrice}</span>
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
