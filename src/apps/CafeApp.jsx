import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShoppingBag, 
  ArrowRight, 
  BellRing, 
  Flame, 
  CheckCircle2, 
  X, 
  ArrowLeft, 
  Layers, 
  ExternalLink,
  Monitor,
  Smartphone,
  Calculator,
  BellRing as BellIcon
} from 'lucide-react';
import { MobileBottomBar } from '../components/common/MobileBottomBar';
import { Navbar } from '../components/common/Navbar';
import { Footer } from '../components/common/Footer';
import { HeroSection } from '../components/home/HeroSection';
import { LiveCafeVibe } from '../components/home/LiveCafeVibe';
import { SignatureHighlights } from '../components/home/SignatureHighlights';
import { CafeExperience } from '../components/home/HighwayExperience';
import { CustomerReviews } from '../components/home/CustomerReviews';
import { MenuSection } from '../components/menu/MenuSection';
import { ItemCustomizeModal } from '../components/menu/ItemCustomizeModal';
import { CartDrawer } from '../components/cart/CartDrawer';
import { PaymentModal } from '../components/cart/PaymentModal';
import { LiveOrderTracker } from '../components/order/LiveOrderTracker';
import { AdminDashboard } from '../components/admin/AdminDashboard';
import { QRScannerModal } from '../components/common/QRScannerModal';
import { CustomerAuthModal } from '../components/auth/CustomerAuthModal';
import { AdminLoginModal } from '../components/auth/AdminLoginModal';
import { ModelSwitcherModal } from '../components/common/ModelSwitcherModal';
import { LoyaltyCardModal } from '../components/loyalty/LoyaltyCardModal';
import { TableReservationModal } from '../components/common/TableReservationModal';
import { MobileQrLiveModal } from '../components/common/MobileQrLiveModal';
import { VipConciergeModal, VipConciergeFloatingButton } from '../components/common/VipConciergeModal';
import { CafeRoiModal } from '../components/common/CafeRoiModal';
import { SplitBillModal } from '../components/cart/SplitBillModal';
import { AuthProvider, useAuth } from '../context/AuthContext';
import { CartProvider, useCart } from '../context/CartContext';
import { OrderProvider, useOrder } from '../context/OrderContext';
import { ThemeProvider, useTheme } from '../context/ThemeContext';
import { ThemeScreenTransition } from '../components/common/ThemeScreenTransition';
import { sounds } from '../utils/audio';

function CafeContent({ onBackToCatalogue, onBackToVariants }) {
  const [currentView, setCurrentView] = useState(() => {
    try {
      const hash = (typeof window !== 'undefined' ? window.location.hash : '').toLowerCase();
      if (hash.includes('admin') || hash.includes('pos')) return 'admin';
    } catch (e) {}
    return 'home';
  }); // home | menu | tracker | admin
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);
  const [isModelSwitcherOpen, setIsModelSwitcherOpen] = useState(false);
  const [isLoyaltyModalOpen, setIsLoyaltyModalOpen] = useState(false);
  const [isReservationOpen, setIsReservationOpen] = useState(false);
  const [isLiveQrOpen, setIsLiveQrOpen] = useState(false);
  const [isConciergeOpen, setIsConciergeOpen] = useState(false);
  const [isRoiOpen, setIsRoiOpen] = useState(false);
  const [isSplitBillOpen, setIsSplitBillOpen] = useState(false);
  const [selectedItemForCustomize, setSelectedItemForCustomize] = useState(null);

  const { itemCount, grandTotal, operationalModel, activeTable, diningMode } = useCart();
  const { activeCustomerOrder, liveOrderToast, setLiveOrderToast } = useOrder();
  const { isLight, isDark } = useTheme();
  const { 
    isCustomerLoggedIn, 
    isAdminLoggedIn, 
    isCustomerAuthOpen, 
    setIsCustomerAuthOpen,
    isAdminLoginOpen,
    setIsAdminLoginOpen,
    requireCustomerAuth 
  } = useAuth();

  const [isMobileDevice, setIsMobileDevice] = useState(() => {
    if (typeof window === 'undefined') return false;
    return window.innerWidth < 768;
  });

  useEffect(() => {
    const handleResize = () => {
      setIsMobileDevice(window.innerWidth < 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Scroll to top on view change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentView]);

  // Handle Menu Navigation (Unlocked for all models)
  const handleNavigateMenu = () => {
    sounds.playClick();
    setCurrentView('menu');
  };

  // Handle Admin Navigation with Auth Protection
  const handleNavigateAdmin = () => {
    if (!isAdminLoggedIn) {
      setIsAdminLoginOpen(true);
      return;
    }
    setCurrentView('admin');
  };

  return (
    <div className={`min-h-screen flex flex-col justify-between selection:bg-[#D04834] selection:text-white font-sans relative transition-colors duration-300 ${
      isLight ? 'bg-[#FAF7F2] text-[#12100E]' : 'bg-[#12100E] text-[#FAF7F2]'
    }`}>
      
      {/* Top Dripp Media White-Label Header / Return Bar */}
      {(onBackToVariants || onBackToCatalogue) && (
        <div className={`border-b px-4 py-2 text-xs flex items-center justify-between z-50 sticky top-0 backdrop-blur-md font-mono transition-colors ${
          isLight ? 'bg-[#F0EAE1]/95 border-black/10 text-stone-700' : 'bg-[#0A0807]/95 border-white/10 text-stone-300'
        }`}>
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => {
                sounds.playClick();
                if (onBackToVariants) onBackToVariants();
                else if (onBackToCatalogue) onBackToCatalogue();
              }}
              className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 hover:bg-[#C5A880] hover:text-[#12100E] font-semibold text-white transition-all text-[11px] cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Cafe Options</span>
            </button>
            <span className="hidden sm:inline-block text-white/30">•</span>
            
            {/* Interactive Active Model Switcher Button */}
            <button
              onClick={() => { sounds.playClick(); setIsModelSwitcherOpen(true); }}
              className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#C5A880]/15 hover:bg-[#C5A880]/25 text-[#C5A880] text-[11px] font-semibold border border-[#C5A880]/30 transition cursor-pointer"
              title="Click to Switch Operating Model"
            >
              <Layers className="w-3 h-3 text-[#C5A880]" />
              <span>
                MODEL: {
                  operationalModel === 'self-serve' ? 'Self-Serve Counter QSR' :
                  operationalModel === 'showcase' ? 'Brand Showcase & Menu' :
                  operationalModel === 'delivery' ? 'Online Doorstep Delivery' :
                  operationalModel === 'hybrid' ? 'Hybrid Dine-In & Delivery' :
                  operationalModel === 'loyalty' ? 'Loyalty Club & 7-Visit POS' :
                  operationalModel === 'gamified-loyalty' ? 'Gamified Loyalty Pass' :
                  'Artisan Dine-In & Table QR'
                }
              </span>
              <span className="px-1.5 py-0.2 rounded bg-[#C5A880] text-[#12100E] text-[9px] font-bold">
                SWITCH
              </span>
            </button>
          </div>

          {/* Right Actions: Test on Phone & Cafe ROI */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => { sounds.playClick(); setIsLiveQrOpen(true); }}
              className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-white/10 hover:bg-[#C5A880] hover:text-[#12100E] font-semibold text-white transition-all text-[11px] cursor-pointer border border-white/10"
              title="Test Table QR on your smartphone camera"
            >
              <Smartphone className="w-3 h-3 text-[#C5A880]" />
              <span className="hidden md:inline">Test on Phone</span>
              <span className="md:hidden">Phone QR</span>
            </button>

            <button
              onClick={() => { sounds.playClick(); setIsRoiOpen(true); }}
              className="hidden sm:flex items-center gap-1 px-2.5 py-1 rounded-full bg-white/10 hover:bg-[#C5A880] hover:text-[#12100E] font-semibold text-white transition-all text-[11px] cursor-pointer border border-white/10"
              title="Calculate Commission Savings vs Aggregators"
            >
              <Calculator className="w-3 h-3 text-[#C5A880]" />
              <span>Bistro ROI</span>
            </button>
          </div>
        </div>
      )}

      {/* Navbar (Hidden in Admin POS view for focus) */}
      {currentView !== 'admin' && (
        <Navbar
          currentView={currentView}
          setCurrentView={(view) => {
            if (view === 'menu') {
              handleNavigateMenu();
            } else if (view === 'admin') {
              handleNavigateAdmin();
            } else {
              setCurrentView(view);
            }
          }}
          onOpenCart={() => setIsCartOpen(true)}
          onOpenScanner={() => setIsScannerOpen(true)}
          onOpenTracker={() => setCurrentView('tracker')}
          onRequireAuth={(cb) => requireCustomerAuth(cb)}
          onOpenLoyaltyModal={operationalModel === 'loyalty' ? () => setIsLoyaltyModalOpen(true) : null}
          onOpenReservation={() => setIsReservationOpen(true)}
          onOpenModelSwitcher={() => setIsModelSwitcherOpen(true)}
          onOpenMobileQr={() => setIsLiveQrOpen(true)}
          onOpenRoi={() => setIsRoiOpen(true)}
          onOpenConcierge={() => setIsConciergeOpen(true)}
        />
      )}

      {/* Lively Customer Order Status Toast Notification Banner */}
      <AnimatePresence>
        {liveOrderToast && currentView !== 'admin' && (
          <motion.div
            initial={{ opacity: 0, y: -40, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -30, scale: 0.95 }}
            className="fixed top-24 right-4 sm:right-6 z-50 max-w-sm w-[calc(100vw-2rem)]"
          >
            <div className={`p-4 rounded-3xl border shadow-2xl backdrop-blur-2xl flex items-start justify-between gap-3 ${
              liveOrderToast.type === 'ready'
                ? 'bg-emerald-950/95 border-emerald-500/50 shadow-emerald-500/30 ring-1 ring-emerald-400/40'
                : liveOrderToast.type === 'cooking'
                ? 'bg-amber-950/95 border-amber-500/50 shadow-amber-500/30 ring-1 ring-amber-400/40'
                : 'bg-slate-900/95 border-slate-700 shadow-slate-950/50 ring-1 ring-white/10'
            }`}>
              <div className="flex items-start gap-3">
                <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 shadow-md ${
                  liveOrderToast.type === 'ready'
                    ? 'bg-emerald-400 text-slate-950'
                    : liveOrderToast.type === 'cooking'
                    ? 'bg-amber-400 text-slate-950'
                    : 'bg-cyan-400 text-slate-950'
                }`}>
                  {liveOrderToast.type === 'ready' ? (
                    <BellRing className="w-5 h-5 animate-bounce" />
                  ) : liveOrderToast.type === 'cooking' ? (
                    <Flame className="w-5 h-5 animate-pulse" />
                  ) : (
                    <CheckCircle2 className="w-5 h-5" />
                  )}
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-black font-syne text-white">{liveOrderToast.title}</span>
                    <span className="px-1.5 py-0.2 rounded bg-white/10 text-slate-300 text-[10px] font-mono">
                      #{liveOrderToast.order?.orderNumber}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-300 leading-snug">
                    {liveOrderToast.message}
                  </p>
                  <div className="pt-1.5 flex items-center gap-2">
                    <button
                      onClick={() => {
                        sounds.playClick();
                        setCurrentView('tracker');
                        setLiveOrderToast(null);
                      }}
                      className="btn-3d btn-3d-amber px-3 py-1 rounded-xl text-[11px] font-bold"
                    >
                      Track Live Order
                    </button>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setLiveOrderToast(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content Area */}
      <main className="flex-grow pb-24 md:pb-0">
        {/* VIEW 1: HOME */}
        {currentView === 'home' && (
          <>
            <HeroSection
              onExploreMenu={handleNavigateMenu}
              onOpenScanner={() => setIsScannerOpen(true)}
              onOpenAdmin={handleNavigateAdmin}
              onOpenReservation={() => setIsReservationOpen(true)}
              onOpenLoyaltyModal={() => setIsLoyaltyModalOpen(true)}
              onOpenCart={() => setIsCartOpen(true)}
            />
            <LiveCafeVibe />
            <SignatureHighlights
              onSelectItemForCustomize={(item) => setSelectedItemForCustomize(item)}
              onExploreAll={handleNavigateMenu}
              onRequireAuth={(cb) => requireCustomerAuth(cb)}
              onOpenReservation={() => setIsReservationOpen(true)}
              onOpenCart={() => setIsCartOpen(true)}
            />
            <CafeExperience />
            <CustomerReviews />
          </>
        )}

        {/* VIEW 2: MENU (Customer Auth Protected) */}
        {currentView === 'menu' && (
          <div className="pt-0">
            <MenuSection
              onSelectItemForCustomize={(item) => setSelectedItemForCustomize(item)}
              onOpenScanner={() => setIsScannerOpen(true)}
              onRequireAuth={(cb) => requireCustomerAuth(cb)}
              onOpenReservation={() => setIsReservationOpen(true)}
            />
          </div>
        )}

        {/* VIEW 3: LIVE ORDER TRACKER */}
        {currentView === 'tracker' && (
          <LiveOrderTracker
            onOrderMore={handleNavigateMenu}
            onBackHome={() => setCurrentView('home')}
          />
        )}

        {/* VIEW 4: ADMIN / POS PORTAL (PC Only • Guarded on Mobile) */}
        {currentView === 'admin' && (
          isMobileDevice ? (
            <div className="min-h-[75vh] flex flex-col items-center justify-center p-6 text-center space-y-4 font-sans">
              <div className="w-16 h-16 rounded-3xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center mx-auto text-[#D04834] shadow-md">
                <Monitor className="w-8 h-8 text-[#D04834]" />
              </div>
              <div className="space-y-2 max-w-sm mx-auto">
                <span className="text-[10px] font-mono font-bold uppercase tracking-widest px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-800 dark:text-amber-300">
                  Desktop Station Required
                </span>
                <h3 className={`text-2xl font-editorial font-bold ${isLight ? 'text-[#12100E]' : 'text-white'}`}>
                  Staff POS Terminal
                </h3>
                <p className={`text-xs leading-relaxed ${isLight ? 'text-stone-600' : 'text-stone-400'}`}>
                  Kitchen Display and Staff POS are optimized exclusively for counter screens and desktop tablets. Please open this terminal from your billing computer.
                </p>
              </div>
              <button
                onClick={() => { sounds.playClick(); setCurrentView('menu'); }}
                className={`px-6 py-3 rounded-2xl font-sans font-semibold text-xs uppercase tracking-wider transition cursor-pointer shadow-md border ${
                  isLight ? 'bg-[#141210] text-white hover:bg-black border-black/15' : 'bg-white text-black hover:bg-stone-200 border-white/20'
                }`}
              >
                Return to Customer Menu
              </button>
            </div>
          ) : isAdminLoggedIn ? (
            <AdminDashboard
              onBackToClient={() => setCurrentView('home')}
            />
          ) : (
            <div className="min-h-[80vh] flex flex-col items-center justify-center p-6 text-center space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center mx-auto text-rose-400">
                <span className="text-xl font-bold font-mono">POS</span>
              </div>
              <h3 className="text-2xl font-bold text-white font-serif">Staff Panel is Password Protected</h3>
              <p className="text-slate-400 text-xs max-w-sm">
                Please enter your cafe PIN to access live kitchen tickets and orders.
              </p>
              <div className="flex items-center gap-3 pt-2">
                <button
                  onClick={() => setIsAdminLoginOpen(true)}
                  className="btn-3d btn-3d-amber px-6 py-2.5 rounded-xl font-bold text-xs"
                >
                  Enter Staff PIN
                </button>
                <button
                  onClick={() => setCurrentView('home')}
                  className="btn-3d btn-3d-dark px-4 py-2.5 rounded-xl text-slate-300 text-xs"
                >
                  Return to Home
                </button>
              </div>
            </div>
          )
        )}
      </main>

      {/* Floating Mobile Cart Bar (Positioned above MobileBottomBar on phones) */}
      <AnimatePresence>
        {currentView !== 'admin' && itemCount > 0 && (
          <motion.div
            initial={{ y: 80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 80, opacity: 0 }}
            className="md:hidden fixed bottom-[72px] inset-x-3 z-40 max-w-md mx-auto"
          >
            <button
              onClick={() => { sounds.playClick(); setIsCartOpen(true); }}
              className="w-full p-3.5 rounded-2xl bg-[#12100E] text-[#FAF7F2] dark:bg-[#FAF7F2] dark:text-[#12100E] font-bold shadow-2xl flex items-center justify-between active:scale-95 transition border border-white/20"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-[#FAF7F2] text-[#12100E] dark:bg-[#12100E] dark:text-[#FAF7F2] flex items-center justify-center font-bold text-xs font-number shadow-xs">
                  {itemCount}
                </div>
                <div className="text-left">
                  <p className="text-xs font-semibold font-sans leading-tight">View Your Order</p>
                  <p className="text-[11px] font-number font-bold text-stone-300 dark:text-stone-700">₹{grandTotal}</p>
                </div>
              </div>
              <div className="flex items-center gap-1.5 text-xs font-bold font-sans uppercase tracking-wider bg-[#D04834] text-white px-3.5 py-1.5 rounded-xl shadow-xs">
                <span>Checkout</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Footer (Hidden in Admin POS) */}
      {currentView !== 'admin' && (
        <Footer
          onNavigateMenu={handleNavigateMenu}
          onOpenScanner={() => setIsScannerOpen(true)}
        />
      )}

      {/* MODALS & DRAWERS */}
      
      {/* 1. Customer Authentication Modal */}
      <CustomerAuthModal
        isOpen={isCustomerAuthOpen}
        onClose={() => setIsCustomerAuthOpen(false)}
      />

      {/* 2. Admin Login / Password Protection Modal */}
      <AdminLoginModal
        isOpen={isAdminLoginOpen}
        onClose={() => setIsAdminLoginOpen(false)}
        onSuccess={() => setCurrentView('admin')}
      />

      {/* 3. Item Customization Modal */}
      <ItemCustomizeModal
        item={selectedItemForCustomize}
        isOpen={!!selectedItemForCustomize}
        onClose={() => setSelectedItemForCustomize(null)}
      />

      {/* 4. Cart Slide-over Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        onProceedToPayment={() => {
          setIsCartOpen(false);
          setIsPaymentOpen(true);
        }}
        onOpenScanner={() => {
          setIsCartOpen(false);
          setIsScannerOpen(true);
        }}
        onRequireAuth={(cb) => requireCustomerAuth(cb)}
        onOpenReservation={() => setIsReservationOpen(true)}
        onOpenLoyaltyModal={operationalModel === 'loyalty' ? () => setIsLoyaltyModalOpen(true) : null}
        onOpenSplitBill={() => setIsSplitBillOpen(true)}
      />

      {/* 5. Payment Gateway Modal */}
      <PaymentModal
        isOpen={isPaymentOpen}
        onClose={() => setIsPaymentOpen(false)}
        onOrderPlacedSuccess={() => {
          setCurrentView('tracker');
        }}
      />

      {/* 6. Table QR Scanner Modal */}
      <QRScannerModal
        isOpen={isScannerOpen}
        onClose={() => setIsScannerOpen(false)}
      />

      {/* 7. Active Operating Model Switcher Modal */}
      <ModelSwitcherModal
        isOpen={isModelSwitcherOpen}
        onClose={() => setIsModelSwitcherOpen(false)}
      />

      {/* 8. 7-Visit Loyalty Punch Card Modal (Dedicated to 'loyalty' operational model) */}
      {operationalModel === 'loyalty' && (
        <LoyaltyCardModal
          isOpen={isLoyaltyModalOpen}
          onClose={() => setIsLoyaltyModalOpen(false)}
          onOpenCart={() => setIsCartOpen(true)}
        />
      )}

      {/* 9. VIP Table Reservation Modal */}
      <TableReservationModal
        isOpen={isReservationOpen}
        onClose={() => setIsReservationOpen(false)}
      />

      {/* 10. Live Mobile QR Plaque Test Modal */}
      <MobileQrLiveModal
        isOpen={isLiveQrOpen}
        onClose={() => setIsLiveQrOpen(false)}
        activeTable={activeTable || 8}
      />

      {/* 11. VIP Table Concierge Modal */}
      <VipConciergeModal
        isOpen={isConciergeOpen}
        onClose={() => setIsConciergeOpen(false)}
      />

      {/* 12. Bistro ROI & Economics Modal */}
      <CafeRoiModal
        isOpen={isRoiOpen}
        onClose={() => setIsRoiOpen(false)}
      />

      {/* 13. Split Bill Modal */}
      <SplitBillModal
        isOpen={isSplitBillOpen}
        onClose={() => setIsSplitBillOpen(false)}
        grandTotal={grandTotal}
        tableNumber={activeTable || 8}
      />

      {/* 14. Floating VIP Table Concierge Button (Seated Dine-In) */}
      {currentView !== 'admin' && (operationalModel === 'table-qr' || operationalModel === 'hybrid' || diningMode === 'table') && (
        <VipConciergeFloatingButton
          onOpen={() => setIsConciergeOpen(true)}
          activeTable={activeTable || 8}
        />
      )}

      {/* Native Thumb-Friendly Mobile Bottom Navigation Bar (md:hidden) */}
      {currentView !== 'admin' && (
        <MobileBottomBar
          currentView={currentView}
          onNavigateHome={() => setCurrentView('home')}
          onNavigateMenu={handleNavigateMenu}
          onOpenScanner={() => setIsScannerOpen(true)}
          onOpenTracker={() => setCurrentView('tracker')}
          onOpenCart={() => setIsCartOpen(true)}
        />
      )}

      {/* Full-Screen Radial Iris Theme Screen Transition */}
      <ThemeScreenTransition />

    </div>
  );
}

export default function CafeApp({ onBackToCatalogue, onBackToVariants }) {
  return (
    <ThemeProvider>
      <AuthProvider>
        <OrderProvider>
          <CartProvider>
            <CafeContent 
              onBackToCatalogue={onBackToCatalogue} 
              onBackToVariants={onBackToVariants} 
            />
          </CartProvider>
        </OrderProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
