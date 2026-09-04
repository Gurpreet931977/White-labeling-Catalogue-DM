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
  Zap,
  CreditCard,
  Award,
  Calendar,
  Layers,
  Store,
  Truck
} from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useOrder } from '../../context/OrderContext';
import { useAuth } from '../../context/AuthContext';
import { BRAND_CONFIG } from '../../data/cafeConfig';
import { sounds } from '../../utils/audio';

// Top Marquee Announcements List
const ANNOUNCEMENTS = [
  {
    icon: Tag,
    color: 'text-amber-400',
    badge: 'PROMO CODE',
    badgeColor: 'bg-amber-400/15 text-amber-300 border-amber-400/30',
    text: 'Use code: CAFE10 for 10% OFF on all orders'
  },
  {
    icon: QrCode,
    color: 'text-cyan-400',
    badge: 'TABLE QR TECH',
    badgeColor: 'bg-cyan-400/15 text-cyan-300 border-cyan-400/30',
    text: 'Scan your table QR to order directly to your seat with zero wait'
  },
  {
    icon: Flame,
    color: 'text-rose-400',
    badge: 'ARTISAN KITCHEN',
    badgeColor: 'bg-rose-400/15 text-rose-300 border-rose-400/30',
    text: 'Fresh All-Day Kitchen • Handcrafted wood-fired pizzas, silky pastas & specialty brews'
  },
  {
    icon: CreditCard,
    color: 'text-emerald-400',
    badge: 'EASY CHECKOUT',
    badgeColor: 'bg-emerald-400/15 text-emerald-300 border-emerald-400/30',
    text: 'Instant UPI QR payment or pay cash at counter'
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
    if (!isCustomerLoggedIn) {
      if (onRequireAuth) onRequireAuth(() => navTo('menu'));
      return;
    }
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

  // Render a single track segment for 100% seamless marquee cloning
  const renderMarqueeSegment = (keyPrefix) => (
    <div key={keyPrefix} className="flex items-center gap-8 shrink-0 pr-8">
      {ANNOUNCEMENTS.map((item, idx) => {
        const Icon = item.icon;
        return (
          <div key={`${keyPrefix}-${idx}`} className="flex items-center gap-3 shrink-0">
            <span className={`px-2 py-0.5 rounded-md text-[9px] font-mono font-bold tracking-wider uppercase border ${item.badgeColor}`}>
              {item.badge}
            </span>
            <Icon className={`w-3.5 h-3.5 ${item.color}`} />
            <span className="text-[11px] font-mono font-medium text-slate-300 tracking-wide">
              {item.text}
            </span>
            <span className="text-white/20 font-bold ml-2">•</span>
          </div>
        );
      })}
    </div>
  );

  return (
    <header className="sticky top-0 z-40 bg-slate-950/80 backdrop-blur-xl border-b border-white/5">
      
      {/* 100% Seamless Infinite Hardware-Accelerated Marquee Strip */}
      <div className="bg-slate-950/95 border-b border-white/10 py-1.5 overflow-hidden whitespace-nowrap relative z-10 flex items-center shadow-inner">
        <div className="animate-marquee-smooth">
          {renderMarqueeSegment('set1')}
          {renderMarqueeSegment('set2')}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          
          {/* Brand Logo & Name */}
          <div 
            onClick={() => navTo('home')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-amber-400 flex items-center justify-center font-black text-slate-950 text-lg sm:text-xl font-syne group-hover:scale-105 transition-transform shadow-sm">
              {BRAND_CONFIG.logoInitials}
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-syne text-base sm:text-lg font-black tracking-tight text-white group-hover:text-amber-400 transition">
                  {BRAND_CONFIG.brandName}
                </span>
              </div>
              <p className="text-[10px] text-slate-400 font-mono flex items-center gap-1.5">
                {BRAND_CONFIG.tagline.split('•')[0] || BRAND_CONFIG.shortName}
              </p>
            </div>
          </div>

          {/* Center Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 p-1 rounded-2xl bg-slate-900/60 border border-white/5">
            <button
              onClick={() => navTo('home')}
              className={`px-4 py-2 rounded-xl text-xs font-semibold font-syne transition-all flex items-center gap-1.5 ${
                currentView === 'home'
                  ? 'bg-amber-400 text-slate-950 font-bold shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-white/5'
              }`}
            >
              <Home className="w-3.5 h-3.5" />
              <span>Home</span>
            </button>

            <button
              onClick={handleMenuClick}
              className={`px-4 py-2 rounded-xl text-xs font-semibold font-syne transition-all flex items-center gap-1.5 ${
                currentView === 'menu'
                  ? 'bg-amber-400 text-slate-950 font-bold shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-white/5'
              }`}
            >
              <UtensilsCrossed className="w-3.5 h-3.5" />
              <span>Explore Menu</span>
              {!isCustomerLoggedIn && (
                <Lock className="w-3 h-3 text-amber-400/80 ml-0.5" />
              )}
            </button>

            <button
              onClick={handleAdminClick}
              className={`px-4 py-2 rounded-xl text-xs font-semibold font-syne transition-all flex items-center gap-1.5 ${
                currentView === 'admin'
                  ? 'bg-rose-500 text-white font-bold shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <LayoutDashboard className="w-3.5 h-3.5" />
              <span>Staff / POS</span>
              {!isAdminLoggedIn && (
                <Lock className="w-3 h-3 text-rose-400/80 ml-0.5" />
              )}
            </button>
          </nav>

          {/* Right Action Area */}
          <div className="flex items-center gap-2">
            {/* Context Badge (Table, Counter, Delivery, or Showcase) */}
            <button
              onClick={() => {
                sounds.playClick();
                if (operationalModel === 'table-qr' || diningMode === 'table') onOpenScanner();
              }}
              className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-xl bg-slate-900/80 border border-white/10 hover:border-amber-400/50 text-xs font-mono font-medium text-amber-300 transition"
              title="Service Station"
            >
              {operationalModel === 'self-serve' || diningMode === 'counter' ? (
                <>
                  <Store className="w-3.5 h-3.5 text-cyan-400" />
                  <span className="hidden sm:inline">Counter Pickup</span>
                </>
              ) : operationalModel === 'delivery' || diningMode === 'delivery' ? (
                <>
                  <Truck className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="hidden sm:inline">Doorstep Delivery</span>
                </>
              ) : operationalModel === 'showcase' ? (
                <>
                  <Compass className="w-3.5 h-3.5 text-purple-400" />
                  <span className="hidden sm:inline">Showcase</span>
                </>
              ) : (
                <>
                  <QrCode className="w-3.5 h-3.5 text-amber-400" />
                  <span className="hidden sm:inline">{`Table #${activeTable || '04'}`}</span>
                </>
              )}
            </button>

            {/* Loyalty Club Punch Card Button (ONLY in dedicated Loyalty Model) */}
            {operationalModel === 'loyalty' && onOpenLoyaltyModal && (
              <button
                onClick={() => { sounds.playClick(); onOpenLoyaltyModal(); }}
                className={`flex items-center gap-1.5 px-2 sm:px-2.5 py-1.5 sm:py-2 rounded-xl border transition text-xs font-mono font-bold ${
                  is7thVisitUnlocked
                    ? 'bg-gradient-to-r from-amber-500/20 to-emerald-500/20 border-amber-400 text-amber-300 shadow-md animate-pulse'
                    : 'bg-slate-900/80 border-white/10 text-slate-300 hover:border-amber-400/40 hover:text-amber-300'
                }`}
                title="Open 7-Visit Loyalty Punch Card"
              >
                <Award className="w-3.5 h-3.5 text-amber-400" />
                <span className="hidden sm:inline">Loyalty</span>
                <span className="px-1.5 py-0.2 rounded-md bg-amber-400/20 text-amber-300 text-[10px]">
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
                className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-bold transition hover:bg-cyan-500/20"
              >
                <Radio className="w-3 h-3 text-cyan-400" />
                <span>Track {activeCustomerOrder.orderNumber}</span>
                <span className="capitalize px-1.5 py-0.2 rounded bg-cyan-400 text-slate-950 text-[10px] font-mono">
                  {activeCustomerOrder.status}
                </span>
              </motion.button>
            )}

            {/* Customer Profile / Login Button */}
            {isCustomerLoggedIn ? (
              <div className="relative">
                <button
                  onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                  className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl bg-slate-900 border border-white/10 hover:border-amber-400/40 text-xs text-white transition"
                >
                  <div className="w-5 h-5 rounded-full bg-amber-400/15 border border-amber-400/30 flex items-center justify-center text-amber-400 shrink-0">
                    <User className="w-3.5 h-3.5" />
                  </div>
                  <span className="hidden sm:inline max-w-[90px] truncate font-medium">
                    {customerUser?.name?.split(' ')[0] || 'Foodie'}
                  </span>
                  <ChevronDown className="w-3 h-3 text-slate-400" />
                </button>

                {profileDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 rounded-2xl bg-slate-900 border border-slate-800 p-2 shadow-2xl z-50 space-y-1">
                    <div className="px-3 py-2 border-b border-slate-800 flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-full bg-amber-400/15 border border-amber-400/30 flex items-center justify-center text-amber-400 shrink-0">
                        <User className="w-4 h-4" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-white truncate">{customerUser?.name}</p>
                        <p className="text-[10px] text-slate-400 font-mono truncate">{customerUser?.phone || customerUser?.email}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => { setProfileDropdownOpen(false); handleMenuClick(); }}
                      className="w-full text-left px-3 py-1.5 rounded-lg text-xs text-slate-300 hover:bg-slate-800 flex items-center gap-2"
                    >
                      <UtensilsCrossed className="w-3.5 h-3.5 text-amber-400" />
                      <span>Explore Menu</span>
                    </button>
                    <button
                      onClick={() => { setProfileDropdownOpen(false); customerLogout(); }}
                      className="w-full text-left px-3 py-1.5 rounded-lg text-xs text-rose-400 hover:bg-rose-950/40 flex items-center gap-2"
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
                className="px-3 py-1.5 sm:py-2 rounded-xl bg-slate-900 border border-amber-400/40 hover:border-amber-400 text-amber-300 font-syne font-bold text-xs transition flex items-center gap-1.5"
              >
                <User className="w-3.5 h-3.5 text-amber-400" />
                <span>Login</span>
              </button>
            )}

            {/* Sound Toggle */}
            <button
              onClick={handleToggleSound}
              className={`p-2 rounded-xl border transition ${
                soundActive
                  ? 'bg-slate-900/90 border-white/10 text-amber-400 hover:border-amber-400/40'
                  : 'bg-slate-900/50 border-white/5 text-slate-500 hover:text-slate-300'
              }`}
              title={soundActive ? 'Sound Effects Active' : 'Sound Muted'}
            >
              {soundActive ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
            </button>

            {/* 3D Tactile Order Bag Button or Book Table for Showcase */}
            {operationalModel === 'showcase' && onOpenReservation ? (
              <button
                onClick={() => { sounds.playClick(); onOpenReservation(); }}
                className="btn-3d btn-3d-amber relative flex items-center gap-2 px-3.5 py-2 rounded-xl text-slate-950 font-bold font-syne text-xs transition shadow-lg cursor-pointer"
                title="Book VIP Table Reservation"
              >
                <Calendar className="w-4 h-4 stroke-[2.5]" />
                <span className="hidden sm:inline tracking-wide">Book Table</span>
              </button>
            ) : (
              <button
                onClick={() => { sounds.playClick(); onOpenCart(); }}
                className="btn-3d btn-3d-amber relative flex items-center gap-2 px-3.5 py-2 rounded-xl text-slate-950 font-bold font-syne text-xs transition shadow-lg cursor-pointer"
                title="View Order Bag & Checkout"
              >
                <ShoppingBag className="w-4 h-4 stroke-[2.5]" />
                <span className="hidden sm:inline tracking-wide">Order Bag</span>
                {itemCount > 0 && (
                  <span className="px-1.5 py-0.5 rounded-full bg-slate-950 text-amber-400 text-[10px] font-mono font-black shadow-inner">
                    {itemCount}
                  </span>
                )}
              </button>
            )}

            {/* Mobile Hamburger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-xl bg-slate-900 border border-white/10 text-slate-300"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <MenuIcon className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden border-t border-white/10 bg-slate-950 px-4 py-4 space-y-2 overflow-hidden"
          >
            <button
              onClick={() => navTo('home')}
              className="w-full text-left py-2 px-3 rounded-xl font-medium text-xs text-slate-200 hover:bg-white/5 flex items-center gap-2"
            >
              <Home className="w-4 h-4 text-slate-400" />
              <span>Home</span>
            </button>
            <button
              onClick={handleMenuClick}
              className="w-full text-left py-2 px-3 rounded-xl font-bold text-xs text-amber-400 hover:bg-white/5 flex items-center justify-between"
            >
              <div className="flex items-center gap-2">
                <UtensilsCrossed className="w-4 h-4 text-amber-400" />
                <span>Explore Full Menu</span>
              </div>
              {!isCustomerLoggedIn && <Lock className="w-3.5 h-3.5 text-amber-400" />}
            </button>
            <button
              onClick={handleAdminClick}
              className="w-full text-left py-2 px-3 rounded-xl font-bold text-xs text-rose-400 hover:bg-white/5 flex items-center justify-between"
            >
              <div className="flex items-center gap-2">
                <LayoutDashboard className="w-4 h-4 text-rose-400" />
                <span>Staff & Kitchen POS</span>
              </div>
              {!isAdminLoggedIn && <Lock className="w-3.5 h-3.5 text-rose-400" />}
            </button>

            {isCustomerLoggedIn ? (
              <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
                <span className="text-xs text-slate-300 font-medium">{customerUser?.name}</span>
                <button
                  onClick={customerLogout}
                  className="text-xs text-rose-400 font-medium hover:underline"
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
                className="w-full py-2 px-3 rounded-xl bg-amber-400 text-slate-950 font-bold text-xs text-center font-syne"
              >
                Login / Register to Order
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
