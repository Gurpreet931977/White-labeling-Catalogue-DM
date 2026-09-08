import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShoppingBag, 
  QrCode, 
  Volume2, 
  VolumeX, 
  UtensilsCrossed, 
  LayoutDashboard, 
  Menu as MenuIcon, 
  X, 
  Home, 
  Lock, 
  User, 
  LogOut, 
  ChevronDown,
  Radio,
  Tag,
  Flame,
  Award,
  Calendar,
  Store,
  Truck,
  ArrowRight,
  Sparkles,
  MapPin,
  Clock,
  Sun,
  Moon
} from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useOrder } from '../../context/OrderContext';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { BRAND_CONFIG } from '../../data/cafeConfig';
import { sounds } from '../../utils/audio';

// Top Editorial Announcements List
const ANNOUNCEMENTS = [
  {
    badge: 'SPECIAL OFFER',
    text: 'Use code: CAFE10 for 10% OFF on your table order',
    tag: 'PROMO 10%'
  },
  {
    badge: 'TABLE QR',
    text: 'Zero-wait table service • Scan table plaque to order straight to your seat',
    tag: 'DINE-IN TECH'
  },
  {
    badge: 'WOOD-FIRED',
    text: 'Slow-fermented 48h sourdough crusts & San Marzano concasse',
    tag: 'ARTISAN PIZZA'
  },
  {
    badge: 'SPECIALTY',
    text: 'Single-origin Arabica roasts, silky flat whites & iced caramel macchiato',
    tag: 'COFFEE BAR'
  }
];

export function Navbar({ 
  currentView, 
  setCurrentView, 
  onOpenCart, 
  onOpenScanner,
  onOpenTracker,
  onRequireAuth,
  onOpenLoyaltyModal,
  onOpenReservation,
  onOpenModelSwitcher
}) {
  const { 
    itemCount, 
    activeTable, 
    diningMode, 
    operationalModel, 
    loyaltyVisits, 
    is7thVisitUnlocked 
  } = useCart();
  const { activeCustomerOrder } = useOrder();
  const { customerUser, isCustomerLoggedIn, customerLogout, isAdminLoggedIn } = useAuth();
  const { theme, toggleTheme, isLight } = useTheme();

  const [soundActive, setSoundActive] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  const handleToggleSound = () => {
    const newState = sounds.toggleSound();
    setSoundActive(newState);
    if (newState) sounds.playClick();
  };

  const handleMenuClick = () => {
    sounds.playClick();
    navTo('menu');
  };

  const handleAdminClick = () => {
    sounds.playClick();
    navTo('admin');
  };

  const navTo = (view) => {
    sounds.playClick();
    setCurrentView(view);
    setMobileMenuOpen(false);
    if (view === 'menu') {
      const menuEl = document.getElementById('menu-section');
      if (menuEl) {
        menuEl.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  // Render seamless marquee track segment
  const renderMarqueeSegment = (keyPrefix) => (
    <div key={keyPrefix} className="flex items-center gap-10 shrink-0 pr-10">
      {ANNOUNCEMENTS.map((item, idx) => (
        <div key={`${keyPrefix}-${idx}`} className="flex items-center gap-3 shrink-0">
          <span className={`px-2 py-0.5 rounded-full text-[9px] font-mono tracking-widest uppercase border ${
            isLight
              ? 'bg-black/5 text-stone-700 border-black/10'
              : 'bg-white/10 text-stone-300 border-white/10'
          }`}>
            {item.badge}
          </span>
          <span className={`text-[11px] font-mono tracking-wide ${
            isLight ? 'text-stone-700' : 'text-stone-300'
          }`}>
            {item.text}
          </span>
          <span className={`${isLight ? 'text-black/20' : 'text-white/20'} font-bold ml-2`}>•</span>
        </div>
      ))}
    </div>
  );

  return (
    <header className={`sticky top-0 z-40 backdrop-blur-xl border-b transition-colors duration-300 ${
      isLight
        ? 'bg-[#FAF7F2]/95 border-black/10 text-[#12100E]'
        : 'bg-[#12100E]/95 border-white/10 text-[#FAF7F2]'
    }`}>
      
      {/* Editorial Minimalist Marquee Ribbon */}
      <div className={`border-b py-1.5 overflow-hidden whitespace-nowrap relative z-10 flex items-center transition-colors duration-300 ${
        isLight ? 'bg-[#F0EAE1] border-black/5' : 'bg-[#0A0807] border-white/5'
      }`}>
        <div className="animate-marquee-smooth">
          {renderMarqueeSegment('s1')}
          {renderMarqueeSegment('s2')}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-3 sm:px-5 lg:px-6 xl:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-2 lg:gap-4">
          
          {/* Brand Wordmark (Milan High-Fashion Look) */}
          <div 
            onClick={() => navTo('home')}
            className="flex items-center gap-2.5 sm:gap-3.5 cursor-pointer group select-none shrink-0"
          >
            <div className="relative">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black font-syne text-lg shadow-md group-hover:scale-105 transition-transform ${
                isLight
                  ? 'bg-[#12100E] text-[#FAF7F2]'
                  : 'bg-gradient-to-br from-[#FAF7F2] to-[#E8E0D2] text-[#12100E]'
              }`}>
                {BRAND_CONFIG.logoInitials}
              </div>
              <span className={`absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-[#D04834] ring-2 ${
                isLight ? 'ring-[#FAF7F2]' : 'ring-[#12100E]'
              }`} />
            </div>

            <div>
              <div className="flex items-baseline gap-2">
                <span className={`font-editorial text-lg sm:text-2xl font-bold tracking-tight transition whitespace-nowrap ${
                  isLight ? 'text-[#12100E]' : 'text-white'
                }`}>
                  <span className="sm:hidden">{BRAND_CONFIG.shortName || 'THC Cafe'}</span>
                  <span className="hidden sm:inline">{BRAND_CONFIG.brandName}</span>
                </span>
              </div>
              <p className={`text-[10px] font-mono tracking-wider flex items-center gap-2 ${
                isLight ? 'text-stone-500' : 'text-stone-400'
              }`}>
                <span>EST. 2024</span>
                <span className={isLight ? 'text-black/20' : 'text-white/30'}>•</span>
                <span>ED. 2026</span>
                <span className={`hidden xl:inline ${isLight ? 'text-black/20' : 'text-white/30'}`}>•</span>
                <span className={`hidden xl:inline ${isLight ? 'text-stone-600' : 'text-stone-300'}`}>ARTISAN CAFE & KITCHEN</span>
              </p>
            </div>
          </div>

          {/* Center Editorial Navigation Links */}
          <nav className="hidden lg:flex items-center gap-3 xl:gap-8 text-xs font-mono tracking-wider shrink-0">
            <button
              onClick={() => navTo('home')}
              className={`relative py-1 transition-colors flex items-center gap-1.5 uppercase whitespace-nowrap ${
                currentView === 'home'
                  ? isLight ? 'text-[#12100E] font-bold' : 'text-white font-bold'
                  : isLight ? 'text-stone-500 hover:text-black' : 'text-stone-400 hover:text-white'
              }`}
            >
              <span className="text-[10px] opacity-60 font-normal">01</span>
              <span>Home</span>
              {currentView === 'home' && (
                <motion.span 
                  layoutId="navUnderline" 
                  className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#D04834]" 
                />
              )}
            </button>

            <button
              onClick={handleMenuClick}
              className={`relative py-1 transition-colors flex items-center gap-1.5 uppercase whitespace-nowrap ${
                currentView === 'menu'
                  ? isLight ? 'text-[#12100E] font-bold' : 'text-white font-bold'
                  : isLight ? 'text-stone-500 hover:text-black' : 'text-stone-400 hover:text-white'
              }`}
            >
              <span className="text-[10px] opacity-60 font-normal">02</span>
              <span>Menu</span>
              {currentView === 'menu' && (
                <motion.span 
                  layoutId="navUnderline" 
                  className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#D04834]" 
                />
              )}
            </button>

            <button
              onClick={handleAdminClick}
              className={`relative py-1 transition-colors flex items-center gap-1.5 uppercase whitespace-nowrap ${
                currentView === 'admin'
                  ? 'text-[#D04834] font-bold'
                  : isLight ? 'text-stone-500 hover:text-black' : 'text-stone-400 hover:text-stone-200'
              }`}
            >
              <span className="text-[10px] opacity-60 font-normal">03</span>
              <span>Staff POS</span>
              {!isAdminLoggedIn && (
                <Lock className="w-3 h-3 text-[#D04834]/80 ml-0.5" />
              )}
              {currentView === 'admin' && (
                <motion.span 
                  layoutId="navUnderline" 
                  className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#D04834]" 
                />
              )}
            </button>
          </nav>

          {/* Right Action Area */}
          <div className="flex items-center gap-1.5 sm:gap-2 lg:gap-2.5 shrink-0">
            {/* Dining Context Capsule */}
            <button
              onClick={() => {
                sounds.playClick();
                if (operationalModel === 'showcase' && onOpenReservation) {
                  onOpenReservation();
                } else if (onOpenScanner) {
                  onOpenScanner();
                } else if (onOpenModelSwitcher) {
                  onOpenModelSwitcher();
                }
              }}
              className={`hidden sm:flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-xl border text-xs font-mono transition cursor-pointer shrink-0 ${
                isLight
                  ? 'bg-[#EAE4D9] border-black/10 text-[#12100E] hover:border-black/25'
                  : 'bg-[#1A1715] border-white/10 text-stone-200 hover:border-white/25'
              }`}
              title="Click to change Table or dining station"
            >
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              {operationalModel === 'self-serve' || diningMode === 'counter' ? (
                <span className="hidden sm:inline">Counter Pickup</span>
              ) : operationalModel === 'delivery' || diningMode === 'delivery' ? (
                <span className="hidden sm:inline">Delivery</span>
              ) : operationalModel === 'showcase' ? (
                <span className="hidden sm:inline">Showcase</span>
              ) : activeTable ? (
                <span className="hidden sm:inline font-bold">{`Table #${activeTable}`}</span>
              ) : (
                <span className="hidden sm:inline font-bold text-[#D04834]">Select Table</span>
              )}
            </button>

            {/* Loyalty Pill (Only in Loyalty Model) */}
            {operationalModel === 'loyalty' && onOpenLoyaltyModal && (
              <button
                onClick={() => { sounds.playClick(); onOpenLoyaltyModal(); }}
                className={`hidden sm:flex items-center gap-1.5 px-2.5 py-2 rounded-xl border transition text-xs font-mono font-bold shrink-0 ${
                  is7thVisitUnlocked
                    ? 'bg-[#D04834]/20 border-[#D04834] text-[#D04834] animate-pulse'
                    : isLight
                    ? 'bg-[#EAE4D9] border-black/10 text-[#12100E]'
                    : 'bg-[#1A1715] border-white/10 text-stone-300'
                }`}
                title="Open 7-Visit Loyalty Punch Card"
              >
                <Award className="w-3.5 h-3.5 text-[#E8E439]" />
                <span className="hidden sm:inline">Loyalty</span>
                <span className="px-1.5 py-0.2 rounded bg-black/10 text-[10px]">
                  {loyaltyVisits}/7
                </span>
              </button>
            )}

            {/* Active Order Live Tracker Pill */}
            {activeCustomerOrder && (
              <motion.button
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                onClick={() => { sounds.playClick(); onOpenTracker(); }}
                className="hidden xl:flex items-center gap-2 px-3 py-2 rounded-xl bg-cyan-500/10 border border-cyan-400/40 text-cyan-500 text-xs font-mono transition hover:bg-cyan-500/20"
              >
                <Radio className="w-3.5 h-3.5 text-cyan-500 animate-pulse" />
                <span>#{activeCustomerOrder.orderNumber}</span>
                <span className="capitalize px-1.5 py-0.2 rounded bg-cyan-500 text-white text-[10px] font-bold">
                  {activeCustomerOrder.status}
                </span>
              </motion.button>
            )}

            {/* Customer Profile / Login Button */}
            {isCustomerLoggedIn ? (
              <div className="relative">
                <button
                  onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                  className={`flex items-center gap-1.5 sm:gap-2 px-2 sm:px-2.5 py-1.5 sm:py-2 rounded-xl border text-xs transition shrink-0 ${
                    isLight
                      ? 'bg-[#EAE4D9] border-black/10 text-[#12100E] hover:border-black/25'
                      : 'bg-[#1A1715] border-white/10 text-stone-200 hover:border-white/20'
                  }`}
                >
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${
                    isLight ? 'bg-black/10 text-black' : 'bg-white/10 text-white'
                  }`}>
                    <User className="w-3 h-3" />
                  </div>
                  <span className="hidden sm:inline max-w-[65px] lg:max-w-[85px] xl:max-w-[120px] truncate font-mono text-[11px]">
                    {customerUser?.name?.split(' ')[0] || 'Ospite'}
                  </span>
                  <ChevronDown className="w-3 h-3 opacity-60 shrink-0" />
                </button>

                {profileDropdownOpen && (
                  <div className={`absolute right-0 mt-2 w-52 rounded-2xl border p-2 shadow-2xl z-50 space-y-1 ${
                    isLight
                      ? 'bg-[#FAF7F2] border-black/10 text-[#12100E]'
                      : 'bg-[#181513] border-white/10 text-[#FAF7F2]'
                  }`}>
                    <div className="px-3 py-2 border-b border-black/10">
                      <p className="text-xs font-bold truncate font-editorial">{customerUser?.name}</p>
                      <p className="text-[10px] opacity-60 font-mono truncate">{customerUser?.phone || customerUser?.email}</p>
                    </div>
                    <button
                      onClick={() => { setProfileDropdownOpen(false); handleMenuClick(); }}
                      className="w-full text-left px-3 py-2 rounded-lg text-xs hover:bg-black/5 flex items-center gap-2 font-mono"
                    >
                      <UtensilsCrossed className="w-3.5 h-3.5 opacity-60" />
                      <span>Explore Menu</span>
                    </button>
                    <button
                      onClick={() => { setProfileDropdownOpen(false); customerLogout(); }}
                      className="w-full text-left px-3 py-2 rounded-lg text-xs text-rose-500 hover:bg-rose-500/10 flex items-center gap-2 font-mono"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={() => {
                  sounds.playClick();
                  if (onRequireAuth) onRequireAuth(() => navTo('menu'));
                }}
                className={`px-3 py-2 rounded-xl border font-mono text-xs transition flex items-center gap-1.5 ${
                  isLight
                    ? 'bg-[#EAE4D9] border-black/10 text-[#12100E] hover:border-black/30'
                    : 'bg-[#1A1715] border-white/10 text-stone-200 hover:border-white/30'
                }`}
              >
                <User className="w-3.5 h-3.5 opacity-60" />
                <span className="hidden sm:inline">Login</span>
              </button>
            )}

            {/* LIGHT / DARK MODE TOGGLE BUTTON WITH CINEMATIC RIPPLE */}
            <button
              onClick={(e) => toggleTheme(e)}
              className={`p-1.5 sm:p-2 rounded-xl border transition flex items-center justify-center cursor-pointer shrink-0 ${
                isLight
                  ? 'bg-[#EAE4D9] border-black/10 text-[#12100E] hover:bg-[#DFD8CC]'
                  : 'bg-[#1A1715] border-white/10 text-[#FAF7F2] hover:border-white/30'
              }`}
              title={isLight ? 'Switch to Dark Mode (Modo Scuro)' : 'Switch to Light Mode (Modo Chiaro)'}
              aria-label="Toggle Light and Dark Mode"
            >
              {isLight ? (
                <Moon className="w-3.5 h-3.5 text-[#12100E]" />
              ) : (
                <Sun className="w-3.5 h-3.5 text-[#E8E439]" />
              )}
            </button>

            {/* Sound Toggle */}
            <button
              onClick={handleToggleSound}
              className={`hidden sm:flex p-1.5 sm:p-2 rounded-xl border transition shrink-0 ${
                soundActive
                  ? isLight
                    ? 'bg-[#EAE4D9] border-black/10 text-stone-700 hover:border-black/30'
                    : 'bg-[#1A1715] border-white/10 text-stone-300 hover:border-white/30'
                  : 'opacity-40 border-transparent'
              }`}
              title={soundActive ? 'Audio Feedback Active' : 'Audio Muted'}
            >
              {soundActive ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
            </button>

            {/* Luxury Editorial Order Bag Button or Reservation CTA */}
            {operationalModel === 'showcase' && onOpenReservation ? (
              <button
                onClick={() => { sounds.playClick(); onOpenReservation(); }}
                className={`relative flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl font-syne font-black text-xs transition shadow-lg cursor-pointer tracking-wider uppercase shrink-0 ${
                  isLight
                    ? 'bg-[#12100E] text-[#FAF7F2] hover:bg-black'
                    : 'bg-[#FAF7F2] text-[#12100E] hover:bg-[#E8E0D2]'
                }`}
              >
                <Calendar className="w-3.5 h-3.5 stroke-[2.5]" />
                <span className="hidden sm:inline">Book Table</span>
              </button>
            ) : (
              <button
                onClick={() => { sounds.playClick(); onOpenCart(); }}
                className={`relative flex items-center gap-1.5 sm:gap-2 px-3 sm:px-3.5 py-1.5 sm:py-2 rounded-xl font-syne font-black text-xs transition shadow-lg cursor-pointer tracking-wider uppercase group shrink-0 ${
                  isLight
                    ? 'bg-[#12100E] text-[#FAF7F2] hover:bg-black shadow-black/10'
                    : 'bg-[#FAF7F2] text-[#12100E] hover:bg-[#E8E0D2] shadow-black/30'
                }`}
                title="View Bag"
              >
                <ShoppingBag className="w-3.5 h-3.5 stroke-[2.5] group-hover:scale-110 transition-transform" />
                <span className="hidden sm:inline">Order</span>
                {itemCount > 0 ? (
                  <span className={`px-1.5 py-0.2 rounded-md text-[10px] font-number font-bold ${
                    isLight ? 'bg-[#FAF7F2] text-[#12100E]' : 'bg-[#12100E] text-[#FAF7F2]'
                  }`}>
                    {itemCount}
                  </span>
                ) : null}
              </button>
            )}

            {/* Mobile Lookbook Overlay Trigger */}
            <button
              onClick={() => setMobileMenuOpen(true)}
              className={`lg:hidden p-1.5 sm:p-2 rounded-xl border shrink-0 ${
                isLight ? 'bg-[#EAE4D9] border-black/10 text-[#12100E]' : 'bg-[#1A1715] border-white/10 text-stone-200'
              }`}
              aria-label="Open Navigation Menu"
            >
              <MenuIcon className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Full-Screen Milan Fashion Editorial Mobile Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className={`fixed inset-0 z-50 flex flex-col justify-between p-6 sm:p-8 lg:hidden overflow-y-auto ${
              isLight ? 'bg-[#FAF7F2] text-[#12100E]' : 'bg-[#12100E] text-[#FAF7F2]'
            }`}
          >
            {/* Top Bar inside Overlay */}
            <div className={`flex items-center justify-between border-b pb-5 ${isLight ? 'border-black/10' : 'border-white/10'}`}>
              <div className="flex items-center gap-2.5">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-black font-syne text-base ${
                  isLight ? 'bg-[#12100E] text-[#FAF7F2]' : 'bg-[#FAF7F2] text-[#12100E]'
                }`}>
                  {BRAND_CONFIG.logoInitials}
                </div>
                <span className="font-editorial text-lg font-bold tracking-tight">
                  {BRAND_CONFIG.brandName}
                </span>
              </div>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className={`w-10 h-10 rounded-xl border flex items-center justify-center ${
                  isLight ? 'bg-black/5 border-black/10 text-black' : 'bg-white/5 border-white/10 text-white'
                }`}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Editorial Massive Links */}
            <div className="py-8 space-y-6">
              <button
                onClick={() => navTo('home')}
                className={`w-full text-left group flex items-baseline justify-between border-b pb-4 ${isLight ? 'border-black/10' : 'border-white/5'}`}
              >
                <div>
                  <span className="text-[10px] font-mono text-[#D04834] uppercase tracking-widest block mb-1">
                    01 // WELCOME
                  </span>
                  <span className={`font-editorial text-3xl font-black group-hover:text-[#D04834] transition ${
                    isLight ? 'text-[#12100E]' : 'text-white'
                  }`}>
                    Home Campaign
                  </span>
                </div>
                <ArrowRight className="w-5 h-5 opacity-40 group-hover:translate-x-2 group-hover:opacity-100 transition" />
              </button>

              <button
                onClick={handleMenuClick}
                className={`w-full text-left group flex items-baseline justify-between border-b pb-4 ${isLight ? 'border-black/10' : 'border-white/5'}`}
              >
                <div>
                  <span className="text-[10px] font-mono text-[#D04834] uppercase tracking-widest block mb-1">
                    02 // CULINARY SPREAD
                  </span>
                  <span className={`font-editorial text-3xl font-black group-hover:text-[#D04834] transition ${
                    isLight ? 'text-[#12100E]' : 'text-white'
                  }`}>
                    Explore Menu
                  </span>
                </div>
                <ArrowRight className="w-5 h-5 opacity-40 group-hover:translate-x-2 group-hover:opacity-100 transition" />
              </button>

              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  if (operationalModel === 'showcase' && onOpenReservation) onOpenReservation();
                  else onOpenScanner();
                }}
                className={`w-full text-left group flex items-baseline justify-between border-b pb-4 ${isLight ? 'border-black/10' : 'border-white/5'}`}
              >
                <div>
                  <span className="text-[10px] font-mono text-[#D04834] uppercase tracking-widest block mb-1">
                    03 // DIGITAL SERVICE
                  </span>
                  <span className={`font-editorial text-3xl font-black group-hover:text-[#D04834] transition ${
                    isLight ? 'text-[#12100E]' : 'text-white'
                  }`}>
                    {operationalModel === 'showcase' ? 'Table Reservation' : 'Scan Table QR'}
                  </span>
                </div>
                <ArrowRight className="w-5 h-5 opacity-40 group-hover:translate-x-2 group-hover:opacity-100 transition" />
              </button>

            </div>

            {/* Theme Toggle & Bottom Meta */}
            <div className={`space-y-4 pt-4 border-t font-mono text-xs ${isLight ? 'border-black/10 text-stone-600' : 'border-white/10 text-stone-400'}`}>
              {/* Mobile Light/Dark Mode Switcher */}
              <div className={`p-3 rounded-xl border flex items-center justify-between ${
                isLight ? 'bg-black/5 border-black/10' : 'bg-white/5 border-white/10'
              }`}>
                <div className="flex items-center gap-2">
                  {isLight ? <Sun className="w-4 h-4 text-[#D04834]" /> : <Moon className="w-4 h-4 text-[#E8E439]" />}
                  <span className="font-bold">{isLight ? 'Light Mode' : 'Dark Mode'}</span>
                </div>
                <button
                  onClick={(e) => toggleTheme(e)}
                  className={`px-3 py-1 rounded-lg text-xs font-bold uppercase transition ${
                    isLight ? 'bg-[#12100E] text-[#FAF7F2]' : 'bg-[#FAF7F2] text-[#12100E]'
                  }`}
                >
                  Switch
                </button>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-mono">
                  {soundActive ? <Volume2 className="w-3.5 h-3.5 text-[#D04834]" /> : <VolumeX className="w-3.5 h-3.5 opacity-60" />}
                  <span className="font-bold">{soundActive ? 'Sound On' : 'Sound Muted'}</span>
                </div>
                <button
                  onClick={handleToggleSound}
                  className={`px-3 py-1 rounded-lg text-xs font-bold uppercase transition ${
                    soundActive 
                      ? isLight ? 'bg-black/10 text-black' : 'bg-white/10 text-white'
                      : isLight ? 'bg-black/5 text-stone-500' : 'bg-white/5 text-stone-500'
                  }`}
                >
                  {soundActive ? 'Mute' : 'Enable'}
                </button>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Clock className="w-3.5 h-3.5 opacity-60" />
                  <span>{BRAND_CONFIG.contact.openingHours}</span>
                </div>
                <span className="text-[10px] opacity-60">{BRAND_CONFIG.contact.city}</span>
              </div>

              {isCustomerLoggedIn ? (
                <div className={`flex items-center justify-between p-3 rounded-xl ${isLight ? 'bg-black/5' : 'bg-white/5'}`}>
                  <div>
                    <p className="font-bold">{customerUser?.name}</p>
                    <p className="text-[10px] opacity-60">{customerUser?.phone || customerUser?.email}</p>
                  </div>
                  <button
                    onClick={() => { setMobileMenuOpen(false); customerLogout(); }}
                    className="text-rose-500 text-xs font-bold hover:underline"
                  >
                    Sign Out
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    if (onRequireAuth) onRequireAuth(() => navTo('menu'));
                  }}
                  className={`w-full py-3 rounded-xl font-syne font-black text-xs text-center uppercase tracking-wider ${
                    isLight ? 'bg-[#12100E] text-[#FAF7F2]' : 'bg-[#FAF7F2] text-[#12100E]'
                  }`}
                >
                  Sign In / Register
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </header>
  );
}
