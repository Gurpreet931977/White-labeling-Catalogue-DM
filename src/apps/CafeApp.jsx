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
  ExternalLink 
} from 'lucide-react';
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
import { AuthProvider, useAuth } from '../context/AuthContext';
import { CartProvider, useCart } from '../context/CartContext';
import { OrderProvider, useOrder } from '../context/OrderContext';
import { sounds } from '../utils/audio';

function CafeContent({ onBackToCatalogue, onBackToVariants }) {
  const [currentView, setCurrentView] = useState('home'); // home | menu | tracker | admin
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);
  const [isModelSwitcherOpen, setIsModelSwitcherOpen] = useState(false);
  const [isLoyaltyModalOpen, setIsLoyaltyModalOpen] = useState(false);
  const [isReservationOpen, setIsReservationOpen] = useState(false);
  const [selectedItemForCustomize, setSelectedItemForCustomize] = useState(null);

  const { itemCount, grandTotal, operationalModel } = useCart();
  const { activeCustomerOrder, liveOrderToast, setLiveOrderToast } = useOrder();
  const { 
    isCustomerLoggedIn, 
    isAdminLoggedIn, 
    isCustomerAuthOpen, 
    setIsCustomerAuthOpen,
    isAdminLoginOpen,
    setIsAdminLoginOpen,
    requireCustomerAuth 
  } = useAuth();

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
    <div className="min-h-screen bg-[#12100E] text-[#FAF7F2] flex flex-col justify-between selection:bg-[#D04834] selection:text-white font-sans relative">
      
      {/* Top Dripp Media White-Label Header / Return Bar */}
      {(onBackToVariants || onBackToCatalogue) && (
        <div className="bg-[#0A0807] border-b border-white/10 px-4 py-2 text-xs flex items-center justify-between z-50 sticky top-0 backdrop-blur-md font-mono">
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                sounds.playClick();
                if (onBackToVariants) onBackToVariants();
                else if (onBackToCatalogue) onBackToCatalogue();
              }}
              className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 hover:bg-[#ebd73f] hover:text-black font-semibold text-white transition-all text-[11px] cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Cafe Options</span>
            </button>
            <span className="hidden sm:inline-block text-white/30">•</span>
            
            {/* Interactive Active Model Switcher Button */}
            <button
              onClick={() => { sounds.playClick(); setIsModelSwitcherOpen(true); }}
              className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#ebd73f]/15 hover:bg-[#ebd73f]/25 text-[#ebd73f] text-[11px] font-semibold border border-[#ebd73f]/30 transition cursor-pointer"
              title="Click to Switch Operating Model"
            >
              <Layers className="w-3 h-3 text-[#ebd73f]" />
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
              <span className="px-1.5 py-0.2 rounded bg-[#ebd73f] text-black text-[9px] font-bold">
                SWITCH
              </span>
            </button>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                sounds.playClick();
                handleNavigateAdmin();
              }}
              className="text-[11px] text-slate-400 hover:text-white transition flex items-center gap-1 font-mono cursor-pointer"
            >
              <span>Staff POS (PIN: 7788)</span>
            </button>
            {onBackToCatalogue && (
              <button
                onClick={() => {
                  sounds.playClick();
                  onBackToCatalogue();
                }}
                className="text-[11px] font-bold text-[#ebd73f] hover:underline cursor-pointer"
              >
                Master Catalogue
              </button>
            )}
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
      <main className="flex-grow">
        {/* VIEW 1: HOME */}
        {currentView === 'home' && (
          <>
            <HeroSection
              onExploreMenu={handleNavigateMenu}
              onOpenScanner={() => setIsScannerOpen(true)}
              onOpenAdmin={handleNavigateAdmin}
              onOpenReservation={() => setIsReservationOpen(true)}
              onOpenLoyaltyModal={() => setIsLoyaltyModalOpen(true)}
            />
            <LiveCafeVibe />
            <SignatureHighlights
              onSelectItemForCustomize={(item) => setSelectedItemForCustomize(item)}
              onExploreAll={handleNavigateMenu}
              onRequireAuth={(cb) => requireCustomerAuth(cb)}
              onOpenReservation={() => setIsReservationOpen(true)}
            />
            <CafeExperience />
            <CustomerReviews />
          </>
        )}

        {/* VIEW 2: MENU (Customer Auth Protected) */}
        {currentView === 'menu' && (
          <div className="pt-2">
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

        {/* VIEW 4: ADMIN / POS PORTAL (Password Protected) */}
        {currentView === 'admin' && (
          isAdminLoggedIn ? (
            <AdminDashboard
              onBackToClient={() => setCurrentView('home')}
            />
          ) : (
            <div className="min-h-[80vh] flex flex-col items-center justify-center p-6 text-center space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center mx-auto text-rose-400">
                <span className="text-xl font-bold font-mono">POS</span>
              </div>
              <h3 className="text-2xl font-bold text-white font-syne">Staff Panel is Password Protected</h3>
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

      {/* Floating Mobile Cart Bar (Mobile Only: md:hidden) */}
      <AnimatePresence>
        {currentView !== 'admin' && itemCount > 0 && (
          <motion.div
            initial={{ y: 80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 80, opacity: 0 }}
            className="md:hidden fixed bottom-4 inset-x-4 z-40"
          >
            <button
              onClick={() => { sounds.playClick(); setIsCartOpen(true); }}
              className="w-full p-3.5 rounded-2xl bg-[#FAF7F2] text-[#12100E] font-bold shadow-2xl flex items-center justify-between active:scale-95 transition border border-white/20"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-[#12100E] text-[#FAF7F2] flex items-center justify-center font-bold text-xs font-mono">
                  {itemCount}
                </div>
                <div className="text-left">
                  <p className="text-xs font-black font-syne leading-tight">Vedi Ordine</p>
                  <p className="text-[11px] font-mono font-bold text-stone-700">₹{grandTotal}</p>
                </div>
              </div>
              <div className="flex items-center gap-1.5 text-xs font-black font-syne uppercase tracking-wider bg-[#12100E] text-[#FAF7F2] px-3.5 py-1.5 rounded-xl">
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

    </div>
  );
}

export default function CafeApp({ onBackToCatalogue, onBackToVariants }) {
  return (
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
  );
}
