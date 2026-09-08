import React from 'react';
import { motion } from 'framer-motion';
import { 
  Home, 
  UtensilsCrossed, 
  QrCode, 
  Radio, 
  ShoppingBag
} from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useOrder } from '../../context/OrderContext';
import { useTheme } from '../../context/ThemeContext';
import { sounds } from '../../utils/audio';

export function MobileBottomBar({ 
  currentView, 
  onNavigateHome, 
  onNavigateMenu, 
  onOpenScanner, 
  onOpenTracker, 
  onOpenCart 
}) {
  const { itemCount, activeTable, diningMode, operationalModel, grandTotal } = useCart();
  const { activeCustomerOrder } = useOrder();
  const { isLight } = useTheme();

  const handleTab = (action) => {
    sounds.playClick();
    action();
  };

  const isOrderActive = activeCustomerOrder && activeCustomerOrder.status !== 'cancelled';

  return (
    <div className="md:hidden fixed bottom-0 inset-x-0 z-40 pointer-events-none">
      {/* Subtle top blur shadow fade */}
      <div className="h-4 w-full bg-gradient-to-t from-black/10 to-transparent pointer-events-none" />

      {/* Main Bar Card */}
      <nav 
        aria-label="Mobile Navigation"
        className={`pointer-events-auto border-t px-2 py-2 backdrop-blur-2xl transition-colors duration-300 shadow-2xl safe-area-pb ${
          isLight 
            ? 'bg-[#FAF7F2]/95 border-black/10 text-[#12100E]' 
            : 'bg-[#12100E]/95 border-white/10 text-[#FAF7F2]'
        }`}
      >
        <div className="grid grid-cols-5 items-center justify-between max-w-md mx-auto relative">
          
          {/* TAB 1: HOME */}
          <button
            onClick={() => handleTab(onNavigateHome)}
            className={`flex flex-col items-center justify-center py-1.5 px-1 rounded-xl transition-all relative active:scale-90 select-none cursor-pointer ${
              currentView === 'home'
                ? isLight ? 'text-[#12100E] font-bold' : 'text-white font-bold'
                : isLight ? 'text-stone-600 hover:text-black' : 'text-stone-400 hover:text-white'
            }`}
          >
            <div className="relative">
              <Home className={`w-5 h-5 transition-transform ${currentView === 'home' ? 'scale-110' : ''}`} />
              {currentView === 'home' && (
                <motion.div 
                  layoutId="mobileNavIndicator" 
                  className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-[#D04834]" 
                />
              )}
            </div>
            <span className="text-[10px] font-mono tracking-tight mt-1">Home</span>
          </button>

          {/* TAB 2: MENU */}
          <button
            onClick={() => handleTab(onNavigateMenu)}
            className={`flex flex-col items-center justify-center py-1.5 px-1 rounded-xl transition-all relative active:scale-90 select-none cursor-pointer ${
              currentView === 'menu'
                ? isLight ? 'text-[#12100E] font-bold' : 'text-white font-bold'
                : isLight ? 'text-stone-600 hover:text-black' : 'text-stone-400 hover:text-white'
            }`}
          >
            <div className="relative">
              <UtensilsCrossed className={`w-5 h-5 transition-transform ${currentView === 'menu' ? 'scale-110 text-[#D04834]' : ''}`} />
              {currentView === 'menu' && (
                <motion.div 
                  layoutId="mobileNavIndicator" 
                  className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-[#D04834]" 
                />
              )}
            </div>
            <span className="text-[10px] font-mono tracking-tight mt-1">Menu</span>
          </button>

          {/* TAB 3: TABLE / QR SELECTOR (CENTER EMPHASIS) */}
          <button
            onClick={() => handleTab(onOpenScanner)}
            className="flex flex-col items-center justify-center py-1 px-1 rounded-xl transition-all active:scale-90 select-none cursor-pointer group"
          >
            <div className={`w-10 h-10 -mt-3 rounded-2xl flex items-center justify-center shadow-lg border transition-transform group-hover:scale-105 ${
              activeTable 
                ? (isLight ? 'bg-[#12100E] text-white border-black/20' : 'bg-white text-black border-white/20')
                : 'bg-gradient-to-tr from-[#D04834] to-[#e45a46] text-white border-white/20 shadow-[#D04834]/30'
            }`}>
              <QrCode className="w-5 h-5" />
            </div>
            <span className="text-[9px] font-mono font-bold tracking-tight mt-0.5 max-w-[68px] truncate">
              {operationalModel === 'self-serve' || diningMode === 'counter'
                ? 'Counter'
                : operationalModel === 'delivery'
                ? 'Delivery'
                : activeTable
                ? `Table #${activeTable}`
                : 'Scan Table'}
            </span>
          </button>

          {/* TAB 4: LIVE ORDER TRACKER */}
          <button
            onClick={() => handleTab(onOpenTracker)}
            className={`flex flex-col items-center justify-center py-1.5 px-1 rounded-xl transition-all relative active:scale-90 select-none cursor-pointer ${
              currentView === 'tracker'
                ? isLight ? 'text-[#12100E] font-bold' : 'text-white font-bold'
                : isLight ? 'text-stone-600 hover:text-black' : 'text-stone-400 hover:text-white'
            }`}
          >
            <div className="relative">
              <Radio className={`w-5 h-5 transition-transform ${isOrderActive ? 'text-emerald-500 animate-pulse' : ''}`} />
              {isOrderActive && (
                <span className="absolute -top-1 -right-1.5 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-black animate-ping" />
              )}
              {currentView === 'tracker' && (
                <motion.div 
                  layoutId="mobileNavIndicator" 
                  className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-[#D04834]" 
                />
              )}
            </div>
            <span className="text-[10px] font-mono tracking-tight mt-1">
              {isOrderActive ? 'Tracking' : 'Status'}
            </span>
          </button>

          {/* TAB 5: BAG / CART */}
          <button
            onClick={() => handleTab(onOpenCart)}
            className={`flex flex-col items-center justify-center py-1.5 px-1 rounded-xl transition-all relative active:scale-90 select-none cursor-pointer ${
              itemCount > 0 
                ? 'text-[#D04834] font-bold' 
                : isLight ? 'text-stone-600 hover:text-black' : 'text-stone-400 hover:text-white'
            }`}
          >
            <div className="relative">
              <ShoppingBag className="w-5 h-5" />
              {itemCount > 0 && (
                <span className="absolute -top-1.5 -right-2 px-1.5 py-0.2 rounded-full bg-[#D04834] text-white text-[9px] font-bold font-number shadow-xs">
                  {itemCount}
                </span>
              )}
            </div>
            <span className="text-[10px] font-mono tracking-tight mt-1 font-bold">
              {itemCount > 0 ? `₹${grandTotal}` : 'Bag'}
            </span>
          </button>

        </div>
      </nav>
    </div>
  );
}
