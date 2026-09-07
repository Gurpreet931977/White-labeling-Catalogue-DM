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
  Clock
} from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useOrder } from '../../context/OrderContext';
import { useAuth } from '../../context/AuthContext';
import { BRAND_CONFIG } from '../../data/cafeConfig';
import { sounds } from '../../utils/audio';

// Top Editorial Announcements List
const ANNOUNCEMENTS = [
  {
    badge: 'OFFERTA',
    text: 'Use code: CAFE10 for 10% OFF on your table order',
    tag: 'PROMO 10%'
  },
  {
    badge: 'TAVOLO QR',
    text: 'Zero-wait table service • Scan table plaque to order straight to your seat',
    tag: 'DINE-IN TECH'
  },
  {
    badge: 'FORNO A LEGNA',
    text: 'Slow-fermented 48h sourdough crusts & San Marzano concasse',
    tag: 'ARTISAN PIZZA'
  },
  {
    badge: 'SPECIALITÀ',
    text: 'Single-origin Arabica roasts, silky flat whites & iced caramel macchiato',
    tag: 'CAFFETTERIA'
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
          <span className="px-2 py-0.5 rounded-full text-[9px] font-mono tracking-widest uppercase bg-white/10 text-stone-300 border border-white/10">
            {item.badge}
          </span>
          <span className="text-[11px] font-mono tracking-wide text-stone-300">
            {item.text}
          </span>
          <span className="text-white/20 font-bold ml-2">•</span>
        </div>
      ))}
    </div>
  );

  return (
    <header className="sticky top-0 z-40 bg-[#12100E]/95 backdrop-blur-xl border-b border-white/10 transition-colors">
      
      {/* Editorial Minimalist Marquee Ribbon */}
      <div className="bg-[#0A0807] border-b border-white/5 py-1.5 overflow-hidden whitespace-nowrap relative z-10 flex items-center">
        <div className="animate-marquee-smooth">
          {renderMarqueeSegment('s1')}
          {renderMarqueeSegment('s2')}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          
          {/* Brand Wordmark (Milan High-Fashion Look) */}
          <div 
            onClick={() => navTo('home')}
            className="flex items-center gap-3.5 cursor-pointer group select-none"
          >
            <div className="relative">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#FAF7F2] to-[#E8E0D2] text-[#12100E] flex items-center justify-center font-black font-syne text-lg shadow-md group-hover:scale-105 transition-transform">
                {BRAND_CONFIG.logoInitials}
              </div>
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-[#D04834] ring-2 ring-[#12100E]" />
            </div>

            <div>
              <div className="flex items-baseline gap-2">
                <span className="font-editorial text-xl sm:text-2xl font-bold tracking-tight text-white group-hover:text-[#FAF7F2] transition">
                  {BRAND_CONFIG.brandName}
                </span>
                <span className="hidden xl:inline-block text-[9px] font-mono tracking-widest text-[#D04834] uppercase font-bold px-1.5 py-0.2 rounded border border-[#D04834]/40">
                  MILANO SOUL
                </span>
              </div>
              <p className="text-[10px] text-stone-400 font-mono tracking-wider flex items-center gap-2">
                <span>EST. 2024</span>
                <span className="text-white/30">•</span>
                <span>ED. 2026</span>
                <span className="hidden sm:inline text-white/30">•</span>
                <span className="hidden sm:inline text-stone-300">ARTISAN CAFFÈ & KITCHEN</span>
              </p>
            </div>
          </div>

          {/* Center Editorial Navigation Links */}
          <nav className="hidden md:flex items-center gap-8 text-xs font-mono tracking-wider">
            <button
              onClick={() => navTo('home')}
              className={`relative py-1 transition-colors flex items-center gap-1.5 uppercase ${
                currentView === 'home'
                  ? 'text-white font-bold'
                  : 'text-stone-400 hover:text-white'
              }`}
            >
              <span className="text-[10px] text-stone-500 font-normal">01</span>
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
              className={`relative py-1 transition-colors flex items-center gap-1.5 uppercase ${
                currentView === 'menu'
                  ? 'text-white font-bold'
                  : 'text-stone-400 hover:text-white'
              }`}
            >
              <span className="text-[10px] text-stone-500 font-normal">02</span>
              <span>Il Menu</span>
              {currentView === 'menu' && (
                <motion.span 
                  layoutId="navUnderline" 
                  className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#D04834]" 
                />
              )}
            </button>

            <button
              onClick={handleAdminClick}
              className={`relative py-1 transition-colors flex items-center gap-1.5 uppercase ${
                currentView === 'admin'
                  ? 'text-[#D04834] font-bold'
                  : 'text-stone-400 hover:text-stone-200'
              }`}
            >
              <span className="text-[10px] text-stone-500 font-normal">03</span>
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
          <div className="flex items-center gap-2 sm:gap-2.5">
            {/* Dining Context Capsule */}
            <button
              onClick={() => {
                sounds.playClick();
                if (operationalModel === 'table-qr' || operationalModel === 'loyalty' || (operationalModel === 'hybrid' && diningMode === 'table')) {
                  onOpenScanner();
                } else if (operationalModel === 'showcase' && onOpenReservation) {
                  onOpenReservation();
                }
              }}
              className="flex items-center gap-2 px-3 py-2 rounded-xl bg-[#1A1715] border border-white/10 hover:border-white/25 text-xs font-mono transition text-stone-200"
              title="Station & Service Context"
            >
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              {operationalModel === 'self-serve' || diningMode === 'counter' ? (
                <span className="hidden sm:inline">Banco Pickup</span>
              ) : operationalModel === 'delivery' || diningMode === 'delivery' ? (
                <span className="hidden sm:inline">Consegna</span>
              ) : operationalModel === 'showcase' ? (
                <span className="hidden sm:inline">Showcase</span>
              ) : (
                <span className="hidden sm:inline font-bold">{`Tavolo #${activeTable || '04'}`}</span>
              )}
            </button>

            {/* Loyalty Pill (Only in Loyalty Model) */}
            {operationalModel === 'loyalty' && onOpenLoyaltyModal && (
              <button
                onClick={() => { sounds.playClick(); onOpenLoyaltyModal(); }}
                className={`flex items-center gap-1.5 px-2.5 py-2 rounded-xl border transition text-xs font-mono font-bold ${
                  is7thVisitUnlocked
                    ? 'bg-[#D04834]/20 border-[#D04834] text-[#FAF7F2] animate-pulse'
                    : 'bg-[#1A1715] border-white/10 text-stone-300 hover:border-white/30'
                }`}
                title="Open 7-Visit Loyalty Punch Card"
              >
                <Award className="w-3.5 h-3.5 text-[#E8E439]" />
                <span className="hidden sm:inline">Loyalty</span>
                <span className="px-1.5 py-0.2 rounded bg-white/10 text-stone-300 text-[10px]">
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
                className="hidden xl:flex items-center gap-2 px-3 py-2 rounded-xl bg-cyan-500/10 border border-cyan-400/30 text-cyan-300 text-xs font-mono transition hover:bg-cyan-500/20"
              >
                <Radio className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
                <span>#{activeCustomerOrder.orderNumber}</span>
                <span className="capitalize px-1.5 py-0.2 rounded bg-cyan-400 text-[#12100E] text-[10px] font-bold">
                  {activeCustomerOrder.status}
                </span>
              </motion.button>
            )}

            {/* Customer Profile / Login Button */}
            {isCustomerLoggedIn ? (
              <div className="relative">
                <button
                  onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                  className="flex items-center gap-2 px-2.5 py-2 rounded-xl bg-[#1A1715] border border-white/10 hover:border-white/20 text-xs text-stone-200 transition"
                >
                  <div className="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center text-white shrink-0">
                    <User className="w-3 h-3" />
                  </div>
                  <span className="hidden sm:inline max-w-[85px] truncate font-mono text-[11px]">
                    {customerUser?.name?.split(' ')[0] || 'Ospite'}
                  </span>
                  <ChevronDown className="w-3 h-3 text-stone-400" />
                </button>

                {profileDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-52 rounded-2xl bg-[#181513] border border-white/10 p-2 shadow-2xl z-50 space-y-1">
                    <div className="px-3 py-2 border-b border-white/10">
                      <p className="text-xs font-bold text-white truncate font-editorial">{customerUser?.name}</p>
                      <p className="text-[10px] text-stone-400 font-mono truncate">{customerUser?.phone || customerUser?.email}</p>
                    </div>
                    <button
                      onClick={() => { setProfileDropdownOpen(false); handleMenuClick(); }}
                      className="w-full text-left px-3 py-2 rounded-lg text-xs text-stone-300 hover:bg-white/5 flex items-center gap-2 font-mono"
                    >
                      <UtensilsCrossed className="w-3.5 h-3.5 text-stone-400" />
                      <span>Explore Menu</span>
                    </button>
                    <button
                      onClick={() => { setProfileDropdownOpen(false); customerLogout(); }}
                      className="w-full text-left px-3 py-2 rounded-lg text-xs text-rose-400 hover:bg-rose-950/40 flex items-center gap-2 font-mono"
                    >
                      <LogOut className="w-3.5 h-3.5 text-rose-400" />
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
                className="px-3 py-2 rounded-xl bg-[#1A1715] border border-white/10 hover:border-white/30 text-stone-200 font-mono text-xs transition flex items-center gap-1.5"
              >
                <User className="w-3.5 h-3.5 text-stone-400" />
                <span className="hidden sm:inline">Login</span>
              </button>
            )}

            {/* Sound Toggle */}
            <button
              onClick={handleToggleSound}
              className={`p-2 rounded-xl border transition ${
                soundActive
                  ? 'bg-[#1A1715] border-white/10 text-stone-300 hover:border-white/30'
                  : 'bg-[#12100E] border-white/5 text-stone-600'
              }`}
              title={soundActive ? 'Audio Feedback Active' : 'Audio Muted'}
            >
              {soundActive ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
            </button>

            {/* Luxury Editorial Order Bag Button or Reservation CTA */}
            {operationalModel === 'showcase' && onOpenReservation ? (
              <button
                onClick={() => { sounds.playClick(); onOpenReservation(); }}
                className="relative flex items-center gap-2 px-4 py-2 rounded-xl bg-[#FAF7F2] text-[#12100E] font-syne font-black text-xs hover:bg-[#E8E0D2] transition shadow-lg cursor-pointer tracking-wider uppercase"
              >
                <Calendar className="w-3.5 h-3.5 stroke-[2.5]" />
                <span className="hidden sm:inline">Prenota Tavolo</span>
              </button>
            ) : (
              <button
                onClick={() => { sounds.playClick(); onOpenCart(); }}
                className="relative flex items-center gap-2 px-3.5 sm:px-4 py-2 rounded-xl bg-[#FAF7F2] text-[#12100E] font-syne font-black text-xs hover:bg-[#E8E0D2] transition shadow-lg cursor-pointer tracking-wider uppercase group"
                title="View Bag"
              >
                <ShoppingBag className="w-3.5 h-3.5 stroke-[2.5] group-hover:scale-110 transition-transform" />
                <span className="hidden sm:inline">Ordine</span>
                {itemCount > 0 ? (
                  <span className="px-1.5 py-0.2 rounded-md bg-[#12100E] text-[#FAF7F2] text-[10px] font-mono font-bold">
                    {itemCount}
                  </span>
                ) : null}
              </button>
            )}

            {/* Mobile Lookbook Overlay Trigger */}
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="md:hidden p-2 rounded-xl bg-[#1A1715] border border-white/10 text-stone-200"
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
            className="fixed inset-0 bg-[#12100E] z-50 flex flex-col justify-between p-6 sm:p-8 md:hidden overflow-y-auto"
          >
            {/* Top Bar inside Overlay */}
            <div className="flex items-center justify-between border-b border-white/10 pb-5">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-[#FAF7F2] text-[#12100E] flex items-center justify-center font-black font-syne text-base">
                  {BRAND_CONFIG.logoInitials}
                </div>
                <span className="font-editorial text-lg font-bold text-white tracking-tight">
                  {BRAND_CONFIG.brandName}
                </span>
              </div>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Editorial Massive Links */}
            <div className="py-8 space-y-6">
              <button
                onClick={() => navTo('home')}
                className="w-full text-left group flex items-baseline justify-between border-b border-white/5 pb-4"
              >
                <div>
                  <span className="text-[10px] font-mono text-[#D04834] uppercase tracking-widest block mb-1">
                    01 // BENVENUTI
                  </span>
                  <span className="font-editorial text-3xl font-black text-white group-hover:text-[#D04834] transition">
                    Home Campaign
                  </span>
                </div>
                <ArrowRight className="w-5 h-5 text-stone-500 group-hover:translate-x-2 group-hover:text-white transition" />
              </button>

              <button
                onClick={handleMenuClick}
                className="w-full text-left group flex items-baseline justify-between border-b border-white/5 pb-4"
              >
                <div>
                  <span className="text-[10px] font-mono text-[#D04834] uppercase tracking-widest block mb-1">
                    02 // CULINARY SPREAD
                  </span>
                  <span className="font-editorial text-3xl font-black text-white group-hover:text-[#D04834] transition">
                    Explore Il Menu
                  </span>
                </div>
                <ArrowRight className="w-5 h-5 text-stone-500 group-hover:translate-x-2 group-hover:text-white transition" />
              </button>

              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  if (operationalModel === 'showcase' && onOpenReservation) onOpenReservation();
                  else onOpenScanner();
                }}
                className="w-full text-left group flex items-baseline justify-between border-b border-white/5 pb-4"
              >
                <div>
                  <span className="text-[10px] font-mono text-[#D04834] uppercase tracking-widest block mb-1">
                    03 // DIGITAL SERVICE
                  </span>
                  <span className="font-editorial text-3xl font-black text-white group-hover:text-[#D04834] transition">
                    {operationalModel === 'showcase' ? 'Table Reservation' : 'Scan Table QR'}
                  </span>
                </div>
                <ArrowRight className="w-5 h-5 text-stone-500 group-hover:translate-x-2 group-hover:text-white transition" />
              </button>

              <button
                onClick={handleAdminClick}
                className="w-full text-left group flex items-baseline justify-between border-b border-white/5 pb-4"
              >
                <div>
                  <span className="text-[10px] font-mono text-stone-400 uppercase tracking-widest block mb-1">
                    04 // STAFF TERMINAL
                  </span>
                  <span className="font-editorial text-2xl font-bold text-stone-300 group-hover:text-[#D04834] transition flex items-center gap-2">
                    <span>Kitchen POS</span>
                    {!isAdminLoggedIn && <Lock className="w-4 h-4 text-stone-500" />}
                  </span>
                </div>
                <ArrowRight className="w-5 h-5 text-stone-500 group-hover:translate-x-2 group-hover:text-white transition" />
              </button>
            </div>

            {/* Bottom Meta & Context */}
            <div className="space-y-4 pt-4 border-t border-white/10 font-mono text-xs text-stone-400">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Clock className="w-3.5 h-3.5 text-stone-500" />
                  <span>{BRAND_CONFIG.contact.openingHours}</span>
                </div>
                <span className="text-[10px] text-stone-500">{BRAND_CONFIG.contact.city}</span>
              </div>

              {isCustomerLoggedIn ? (
                <div className="flex items-center justify-between bg-white/5 p-3 rounded-xl">
                  <div>
                    <p className="text-white font-bold">{customerUser?.name}</p>
                    <p className="text-[10px] text-stone-400">{customerUser?.phone || customerUser?.email}</p>
                  </div>
                  <button
                    onClick={() => { setMobileMenuOpen(false); customerLogout(); }}
                    className="text-rose-400 text-xs font-bold hover:underline"
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
                  className="w-full py-3 rounded-xl bg-[#FAF7F2] text-[#12100E] font-syne font-black text-xs text-center uppercase tracking-wider"
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
