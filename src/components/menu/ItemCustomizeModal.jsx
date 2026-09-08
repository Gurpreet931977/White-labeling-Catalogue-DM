import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Flame, Plus, Minus, Check, MessageSquare, Leaf, Drumstick } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useTheme } from '../../context/ThemeContext';
import { sounds } from '../../utils/audio';

export function ItemCustomizeModal({ item, isOpen, onClose }) {
  const { addToCart } = useCart();
  const { isLight } = useTheme();
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
    sounds.playClick();
    addToCart(item, quantity, selectedSpice, selectedAddons, notes);
    onClose();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/75 backdrop-blur-md overflow-hidden font-sans">
        {/* Backdrop tap to close */}
        <div className="absolute inset-0 -z-10" onClick={() => { sounds.playClick(); onClose(); }} />

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 40 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className={`relative w-full max-w-md rounded-t-[32px] sm:rounded-3xl overflow-hidden shadow-2xl border transition-colors flex flex-col max-h-[92vh] sm:max-h-[85vh] ${
            isLight 
              ? 'bg-[#FAF7F2] text-[#12100E] border-[#E8E2D5]' 
              : 'bg-[#141210] text-[#FAF7F2] border-white/10'
          }`}
        >
          {/* Mobile Sheet Drag Indicator */}
          <div className="sm:hidden pt-2.5 pb-1 flex justify-center">
            <div className="w-12 h-1.5 bg-stone-400/50 rounded-full" />
          </div>

          {/* Header Image with Gradient */}
          <div className="relative h-44 sm:h-48 bg-stone-900 shrink-0">
            <img
              src={item.image}
              alt={item.name}
              className="w-full h-full object-cover"
            />
            <div className={`absolute inset-0 bg-gradient-to-t ${
              isLight 
                ? 'from-[#FAF7F2] via-[#FAF7F2]/30 to-transparent' 
                : 'from-[#141210] via-[#141210]/40 to-transparent'
            }`} />
            
            {/* Close button */}
            <button
              onClick={() => { sounds.playClick(); onClose(); }}
              className={`absolute top-4 right-4 p-2 rounded-xl border backdrop-blur-md transition ${
                isLight 
                  ? 'bg-white/80 border-stone-200 text-stone-700 hover:text-black hover:bg-white' 
                  : 'bg-black/60 border-white/10 text-white/80 hover:text-white'
              }`}
              aria-label="Close"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Diet & Title */}
            <div className="absolute bottom-3 left-4 sm:left-5">
              <div className="flex items-center gap-1.5 mb-1">
                <span
                  className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold flex items-center gap-1 border ${
                    item.isVeg 
                      ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-700 dark:text-emerald-400' 
                      : 'bg-rose-500/15 border-rose-500/30 text-rose-700 dark:text-rose-400'
                  }`}
                >
                  {item.isVeg ? <Leaf className="w-3 h-3" /> : <Drumstick className="w-3 h-3" />}
                  <span>{item.isVeg ? 'VEGETARIAN' : 'NON-VEGETARIAN'}</span>
                </span>
              </div>
              <h3 className="text-xl sm:text-2xl font-editorial tracking-tight font-normal">
                {item.name}
              </h3>
            </div>
          </div>

          {/* Body Content */}
          <div className="p-4 sm:p-5 space-y-4 max-h-[50vh] overflow-y-auto">
            <p className={`text-xs leading-relaxed ${isLight ? 'text-stone-600' : 'text-stone-300'}`}>
              {item.description}
            </p>

            {/* Spice Level Option */}
            {item.spiceOptions && item.spiceOptions.length > 0 && (
              <div className="space-y-2">
                <label className={`text-[10px] font-mono uppercase tracking-widest flex items-center gap-1 font-bold ${
                  isLight ? 'text-stone-500' : 'text-stone-400'
                }`}>
                  <Flame className="w-3.5 h-3.5 text-[#D04834]" />
                  <span>Spice Level:</span>
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {item.spiceOptions.map((spice) => {
                    const isSelected = selectedSpice === spice;
                    return (
                      <button
                        key={spice}
                        onClick={() => { sounds.playClick(); setSelectedSpice(spice); }}
                        className={`py-2 px-2.5 rounded-xl text-xs font-mono font-medium transition-all border text-center ${
                          isSelected
                            ? isLight
                              ? 'bg-[#12100E] border-[#12100E] text-white shadow-xs'
                              : 'bg-white border-white text-black shadow-xs'
                            : isLight
                            ? 'bg-white border-stone-200 text-stone-600 hover:text-black'
                            : 'bg-[#1C1917] border-white/5 text-stone-400 hover:text-white'
                        }`}
                      >
                        {spice}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Addons Section */}
            {item.addons && item.addons.length > 0 && (
              <div className="space-y-2">
                <label className={`text-[10px] font-mono uppercase tracking-widest block font-bold ${
                  isLight ? 'text-stone-500' : 'text-stone-400'
                }`}>
                  Customize & Add-ons:
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
                            ? isLight
                              ? 'bg-stone-100 border-[#12100E] text-[#12100E]'
                              : 'bg-white/10 border-white text-white'
                            : isLight
                            ? 'bg-white border-stone-200 text-stone-700 hover:border-stone-400'
                            : 'bg-[#1C1917] border-white/5 text-stone-300 hover:border-white/20'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <div
                            className={`w-4 h-4 rounded-md border flex items-center justify-center transition-colors ${
                              isSelected
                                ? isLight
                                  ? 'bg-[#12100E] border-[#12100E] text-white'
                                  : 'bg-white border-white text-black'
                                : isLight
                                ? 'border-stone-300 bg-stone-50'
                                : 'border-stone-700 bg-stone-900'
                            }`}
                          >
                            {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                          </div>
                          <span className="text-xs">{addon.name}</span>
                        </div>
                        <span className="text-xs font-number font-bold text-[#D04834]">
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
              <label className={`text-[10px] font-mono uppercase tracking-widest flex items-center gap-1 font-bold ${
                isLight ? 'text-stone-500' : 'text-stone-400'
              }`}>
                <MessageSquare className="w-3.5 h-3.5 text-[#D04834]" />
                <span>Special Instructions for Chef:</span>
              </label>
              <input
                type="text"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="e.g. Extra hot, no dressing..."
                className={`w-full px-3 py-2 rounded-xl border text-xs focus:outline-none transition ${
                  isLight 
                    ? 'bg-white border-stone-300 text-stone-900 placeholder:text-stone-400 focus:border-[#12100E]' 
                    : 'bg-[#0E0C0B] border-white/10 text-white placeholder:text-stone-600 focus:border-white/30'
                }`}
              />
            </div>
          </div>

          {/* Footer Action Bar */}
          <div className={`p-4 border-t flex items-center justify-between gap-3 transition-colors ${
            isLight ? 'bg-white border-stone-200' : 'bg-[#0E0C0B] border-white/10'
          }`}>
            <div className={`flex items-center gap-2 p-1 rounded-xl border ${
              isLight ? 'bg-stone-100 border-stone-200' : 'bg-[#1C1917] border-white/10'
            }`}>
              <button
                onClick={() => {
                  sounds.playClick();
                  if (quantity > 1) setQuantity(quantity - 1);
                }}
                className={`w-8 h-8 sm:w-7 sm:h-7 rounded-lg flex items-center justify-center transition active:scale-95 ${
                  isLight ? 'text-stone-700 hover:bg-white active:bg-stone-200' : 'text-stone-400 hover:text-white hover:bg-white/10 active:bg-white/20'
                }`}
                aria-label="Decrease quantity"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
              <span className="font-number font-bold text-sm w-5 text-center">
                {quantity}
              </span>
              <button
                onClick={() => {
                  sounds.playClick();
                  setQuantity(quantity + 1);
                }}
                className={`w-8 h-8 sm:w-7 sm:h-7 rounded-lg flex items-center justify-center transition active:scale-95 ${
                  isLight ? 'text-stone-700 hover:bg-white active:bg-stone-200' : 'text-stone-400 hover:text-white hover:bg-white/10 active:bg-white/20'
                }`}
                aria-label="Increase quantity"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>

            <button
              onClick={handleConfirm}
              className={`flex-1 py-3.5 sm:py-3 px-4 rounded-2xl font-syne font-bold text-xs transition active:scale-[0.98] flex items-center justify-between shadow-sm cursor-pointer ${
                isLight 
                  ? 'bg-[#12100E] text-[#FAF7F2] hover:bg-stone-800 active:bg-black' 
                  : 'bg-[#FAF7F2] text-[#12100E] hover:bg-stone-200 active:bg-white'
              }`}
            >
              <span>ADD TO ORDER</span>
              <span className="font-number font-bold text-sm">₹{totalPrice}</span>
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
