import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { 
  QrCode, 
  UtensilsCrossed, 
  Compass,
  Award,
  Clock, 
  ArrowRight,
  ChevronRight, 
  ChevronLeft, 
  Store, 
  Truck, 
  Calendar,
  CakeSlice,
  Crown,
  ChefHat,
  Flame,
  Coffee,
  CheckCircle2,
  MapPin,
  Sparkles,
  Plus
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { useTheme } from '../../context/ThemeContext';
import { BRAND_CONFIG, MODEL_SYSTEM_CONFIG } from '../../data/cafeConfig';
import { MENU_ITEMS } from '../../data/menuData';
import { sounds } from '../../utils/audio';

// Curated Editorial Campaign Dishes (High-Res Realistic Photography)
const CAMPAIGN_DISHES = [
  {
    id: "thc-01",
    edition: "LOOK 01",
    shortCategory: "Pizza",
    icon: Flame,
    tag: "WOOD-FIRED // 48H FERMENT",
    name: "Wood-Fired Margherita Basilico",
    price: 349,
    rating: "5.0",
    prepTime: "12 min",
    pairing: "Best paired with Cold Brew & Truffle Fries",
    pairingItemIds: ["thc-21", "thc-17"],
    pairingBundleName: "Signature Neapolitan Tasting Bundle",
    pairingBundlePrice: 629,
    pairingSavings: 108,
    sommelierNote: "Natural sweetness of San Marzano D.O.P. concasse elevated by cold-aerated Arabica acidity.",
    image: "https://images.unsplash.com/photo-1604382355076-af4b0eb60143?auto=format&fit=crop&w=1200&q=85",
    description: "Slow-fermented Neapolitan crust, San Marzano tomato concasse, creamy buffalo mozzarella & fragrant sweet basil.",
    accent: "#D04834"
  },
  {
    id: "thc-05",
    edition: "LOOK 02",
    shortCategory: "Pasta",
    icon: UtensilsCrossed,
    tag: "HANDMADE PASTA",
    name: "Smoked Alfredo White Sauce Penne",
    price: 269,
    rating: "4.9",
    prepTime: "12 min",
    pairing: "Best paired with Iced Macchiato & Cheesy Focaccia",
    pairingItemIds: ["thc-21", "thc-16"],
    pairingBundleName: "Italian Cream & Roastery Bundle",
    pairingBundlePrice: 539,
    pairingSavings: 99,
    sommelierNote: "Rich European butter and aged Parmesan cut gracefully by chilled espresso caramel microfoam.",
    image: "https://images.unsplash.com/photo-1645112411341-6c4fd023714a?auto=format&fit=crop&w=1200&q=85",
    description: "Velvety Parmesan & European butter cream sauce tossed with charred sweet corn and sautéed wild forest mushrooms.",
    accent: "#C5A880"
  },
  {
    id: "thc-21",
    edition: "LOOK 03",
    shortCategory: "Coffee",
    icon: Coffee,
    tag: "SPECIALTY COFFEE // SINGLE-ORIGIN",
    name: "Classic Iced Caramel Macchiato",
    price: 189,
    rating: "4.9",
    prepTime: "5 min",
    pairing: "Best paired with Tiramisu Classico",
    pairingItemIds: ["thc-29"],
    pairingBundleName: "Dolce Espresso Afternoon Pair",
    pairingBundlePrice: 369,
    pairingSavings: 49,
    sommelierNote: "Madagascar vanilla infusion harmonizes with layered Savoiardi cocoa and espresso mascarpone.",
    image: "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?auto=format&fit=crop&w=1200&q=85",
    description: "Cold-aerated Madagascar vanilla milk poured over slow-dripped espresso float with salted butter caramel drizzle.",
    accent: "#C28E5C"
  },
  {
    id: "thc-29",
    edition: "LOOK 04",
    shortCategory: "Dolci",
    icon: CakeSlice,
    tag: "ARTISAN DESSERT",
    name: "Tiramisu Classico della Casa",
    price: 229,
    rating: "5.0",
    prepTime: "4 min",
    pairing: "Best paired with Double Ristretto Espresso",
    pairingItemIds: ["thc-21"],
    pairingBundleName: "House Mascarpone & Brew Bundle",
    pairingBundlePrice: 359,
    pairingSavings: 59,
    sommelierNote: "Raw dusted Valrhona cocoa balances the airy sweetness of authentic Venetian mascarpone.",
    image: "https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?auto=format&fit=crop&w=1200&q=85",
    description: "Espresso-steeped Savoiardi biscuits layered with pillowy Italian mascarpone cream and dusted with raw cocoa.",
    accent: "#D04834"
  }
];

export function HeroSection({ 
  onExploreMenu, 
  onOpenScanner, 
  onOpenAdmin,
  onOpenReservation,
  onOpenLoyaltyModal,
  onOpenCart
}) {
  const { isCustomerLoggedIn } = useAuth();
  const { operationalModel, diningMode, setDiningMode, activeTable, addToCart } = useCart();
  const { isLight } = useTheme();
  const currentModelConfig = MODEL_SYSTEM_CONFIG[operationalModel] || MODEL_SYSTEM_CONFIG['table-qr'];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const [isPaused, setIsPaused] = useState(false);
  const [pairingToast, setPairingToast] = useState(null);

  // Handle 1-click Quick Order
  const handleQuickOrder = (e, dish) => {
    e.stopPropagation();
    e.preventDefault();
    sounds.playSuccess();
    
    // Add main dish
    const mainDishItem = MENU_ITEMS.find(i => i.id === dish.id) || {
      id: dish.id,
      name: dish.name,
      price: dish.price,
      image: dish.image,
      category: dish.shortCategory ? dish.shortCategory.toLowerCase() : 'all'
    };
    addToCart(mainDishItem, 1);

    setPairingToast(`${dish.name} added to table order`);
    if (onOpenCart) {
      setTimeout(() => {
        onOpenCart();
      }, 250);
    }
    setTimeout(() => setPairingToast(null), 3200);
  };

  // Handle adding the chef's curated sommelier pairing bundle
  const handleAddCuratedPairing = (e, dish) => {
    e.stopPropagation();
    e.preventDefault();
    sounds.playSuccess();
    
    // Add main dish
    const mainDishItem = MENU_ITEMS.find(i => i.id === dish.id) || {
      id: dish.id,
      name: dish.name,
      price: dish.price,
      image: dish.image,
      category: dish.shortCategory ? dish.shortCategory.toLowerCase() : 'all'
    };
    addToCart(mainDishItem, 1);

    // Add pairing companion items
    if (dish.pairingItemIds && Array.isArray(dish.pairingItemIds)) {
      dish.pairingItemIds.forEach(id => {
        const compItem = MENU_ITEMS.find(i => i.id === id);
        if (compItem) {
          addToCart(compItem, 1);
        }
      });
    }

    setPairingToast(`${dish.pairingBundleName || 'Chef Pairing Bundle'} added to table order`);
    if (onOpenCart) {
      setTimeout(() => {
        onOpenCart();
      }, 250);
    }
    setTimeout(() => setPairingToast(null), 3200);
  };

  // Subtle 3D Card Tilt Physics
  const cardRef = useRef(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [3, -3]), { stiffness: 200, damping: 25 });
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-3, 3]), { stiffness: 200, damping: 25 });

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    mouseX.set(x);
    mouseY.set(y);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  // Auto slide
  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      setDirection(1);
      setCurrentIndex((prev) => (prev + 1) % CAMPAIGN_DISHES.length);
    }, 4600);
    return () => clearInterval(interval);
  }, [isPaused]);

  const handleNext = () => {
    sounds.playClick();
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % CAMPAIGN_DISHES.length);
  };

  const handlePrev = () => {
    sounds.playClick();
    setDirection(-1);
    setCurrentIndex((prev) => (prev - 1 + CAMPAIGN_DISHES.length) % CAMPAIGN_DISHES.length);
  };

  const currentDish = CAMPAIGN_DISHES[currentIndex];

  return (
    <section className={`relative pt-8 sm:pt-14 pb-16 sm:pb-24 overflow-hidden transition-colors duration-300 ${
      isLight ? 'bg-[#FAF7F2] text-[#12100E]' : 'bg-[#12100E] text-[#FAF7F2]'
    }`}>
      
      {/* Background Editorial Watermark & Glow */}
      <div className={`absolute top-10 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] rounded-full blur-[140px] pointer-events-none -z-10 ${
        isLight
          ? 'bg-gradient-to-b from-[#D04834]/5 via-[#581422]/5 to-transparent'
          : 'bg-gradient-to-b from-[#D04834]/8 via-[#581422]/5 to-transparent'
      }`} />
      
      {/* Large Subtle Editorial Watermark */}
      <div className={`absolute top-20 right-4 lg:right-12 select-none pointer-events-none font-editorial text-[140px] sm:text-[220px] font-black leading-none uppercase tracking-tighter -z-10 transition-colors ${
        isLight ? 'opacity-[0.04] text-[#12100E]' : 'opacity-[0.03] text-white'
      }`}>
        BISTRO
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
        
        {/* ========================================================================= */}
        {/* 1. MOBILE HERO DESIGN (< lg) - CREATIVE, APPETIZING & HIGHLY ENGAGING     */}
        {/* ========================================================================= */}
        <div className="block lg:hidden space-y-3 text-left">
          {/* Top Atmosphere Bar: Kitchen Status & Smart Table Pill */}
          <div className="flex items-center justify-between gap-2">
            <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border text-[10px] font-mono transition-colors ${
              isLight ? 'bg-[#EAE4D9] border-black/10 text-stone-800' : 'bg-[#1C1815] border-white/10 text-stone-200'
            }`}>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="font-semibold tracking-tight">Rajpur Rd • Kitchen Live</span>
              <span className="opacity-30">•</span>
              <span className="opacity-70">10-15m</span>
            </div>

            {activeTable ? (
              <button 
                onClick={() => { sounds.playClick(); onOpenScanner(); }}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#D04834]/15 border border-[#D04834]/30 text-[#D04834] text-[10px] font-mono font-bold active:scale-95 transition cursor-pointer"
              >
                <QrCode className="w-3 h-3" />
                <span>Table #{activeTable}</span>
              </button>
            ) : (
              <button
                onClick={() => { sounds.playClick(); onOpenScanner(); }}
                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-[10px] font-mono font-bold active:scale-95 transition cursor-pointer ${
                  isLight ? 'bg-white border-black/15 text-[#12100E]' : 'bg-[#181412] border-white/15 text-stone-200'
                }`}
              >
                <QrCode className="w-3 h-3 text-[#D04834]" />
                <span>Select Table</span>
              </button>
            )}
          </div>

          {/* Editorial Master Headline & Crisp Sensory Hook */}
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <img src={BRAND_CONFIG.logoTransparent} alt="Velour" className="h-4 w-auto object-contain" />
              <span className="text-[9px] font-mono tracking-widest uppercase font-bold text-[#D04834]">
                Velour Cafe & Wood-Fired Bistro
              </span>
            </div>
            
            <h1 className="text-2xl xs:text-3xl font-bold tracking-tight leading-[1.06]">
              <span className={`font-editorial ${isLight ? 'text-[#12100E]' : 'text-white'}`}>
                Eat Well.{" "}
              </span>
              <span className="font-editorial-italic font-black text-[#D04834]">
                Stay Late.
              </span>
            </h1>

            <p className={`text-xs leading-snug line-clamp-2 font-normal ${isLight ? 'text-stone-600' : 'text-stone-300'}`}>
              {currentModelConfig.description}
            </p>
          </div>

          {/* Interactive Category Chips (Quick-Filter Reel) */}
          <div>
            <div className="flex items-center justify-between pb-1">
              <span className="text-[9px] font-mono uppercase tracking-wider opacity-60">
                Today's Signature Reel
              </span>
              <span className="text-[9px] font-mono text-[#D04834] font-bold">
                {currentIndex + 1} of {CAMPAIGN_DISHES.length}
              </span>
            </div>

            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-0.5 -mx-4 px-4">
              {CAMPAIGN_DISHES.map((dish, idx) => {
                const isActive = idx === currentIndex;
                const DishIcon = dish.icon;
                return (
                  <button
                    key={dish.id}
                    onClick={() => {
                      sounds.playClick();
                      setDirection(idx > currentIndex ? 1 : -1);
                      setCurrentIndex(idx);
                    }}
                    className={`shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-mono transition-all cursor-pointer select-none active:scale-95 ${
                      isActive
                        ? isLight
                          ? 'bg-[#12100E] text-[#FAF7F2] font-bold shadow-md shadow-black/10'
                          : 'bg-[#FAF7F2] text-[#12100E] font-bold shadow-md shadow-black/30'
                        : isLight
                          ? 'bg-[#EAE4D9] text-stone-700 hover:bg-[#DFD8CC] border border-black/10'
                          : 'bg-[#1C1815] text-stone-300 hover:bg-[#25201C] border border-white/10'
                    }`}
                  >
                    <DishIcon className={`w-3.5 h-3.5 ${isActive ? isLight ? 'text-[#FAF7F2]' : 'text-[#12100E]' : isLight ? 'text-stone-600' : 'text-stone-400'}`} />
                    <span>{dish.shortCategory}</span>
                    {isActive && (
                      <span className="w-1.5 h-1.5 rounded-full bg-[#D04834]" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* The Showstopper Visual: Interactive Touch-Carousel Card */}
          <div 
            className="relative touch-pan-y"
            onTouchStart={() => setIsPaused(true)}
            onTouchEnd={() => setIsPaused(false)}
          >
            <motion.div
              key={currentDish.id}
              initial={{ opacity: 0, x: direction * 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -direction * 20 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.2}
              onDragEnd={(e, { offset }) => {
                const swipe = offset.x;
                if (swipe < -35) {
                  handleNext();
                } else if (swipe > 35) {
                  handlePrev();
                }
              }}
              className={`relative rounded-2xl overflow-hidden border shadow-lg p-2.5 sm:p-3.5 transition-colors ${
                isLight
                  ? 'bg-white border-black/10 shadow-stone-300/40'
                  : 'bg-[#181412] border-white/15 shadow-black/80'
              }`}
            >
              {/* Top Header inside Card */}
              <div className={`flex items-center justify-between pb-1.5 border-b text-[9px] font-mono tracking-wider uppercase ${
                isLight ? 'border-black/10 text-stone-500' : 'border-white/10 text-stone-400'
              }`}>
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#D04834]" />
                  <span className={`font-bold ${isLight ? 'text-[#12100E]' : 'text-white'}`}>
                    {currentDish.edition}
                  </span>
                  <span className="opacity-30">•</span>
                  <span className="truncate max-w-[140px]">{currentDish.shortCategory}</span>
                </div>

                <span className="text-[9px] opacity-60">
                  Swipe ↔
                </span>
              </div>

              {/* Main Image with Floating Badges (Ergonomic 16:10 Ratio) */}
              <div className="relative aspect-[16/10] w-full rounded-xl overflow-hidden my-2 bg-stone-950">
                <img
                  src={currentDish.image}
                  alt={currentDish.name}
                  className="w-full h-full object-cover select-none pointer-events-none"
                />

                {/* Subtle Vignette Gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/20" />

                {/* Top Badges */}
                <div className="absolute top-2 left-2 right-2 flex items-center justify-between">
                  <div className="px-2 py-0.5 rounded-full bg-[#12100E]/85 backdrop-blur-md border border-white/15 text-[9px] font-mono tracking-wider text-[#FAF7F2] font-bold flex items-center gap-1">
                    <Flame className="w-2.5 h-2.5 text-[#D04834]" />
                    <span>CHEF'S SIGNATURE</span>
                  </div>

                  <div className="px-2 py-0.5 rounded-full bg-black/75 backdrop-blur-md border border-white/15 text-[9px] font-mono text-white flex items-center gap-1">
                    <Clock className="w-2.5 h-2.5 text-amber-400" />
                    <span>{currentDish.prepTime}</span>
                  </div>
                </div>

                {/* Bottom Floating Card Content */}
                <div className="absolute bottom-2 left-2 right-2 flex items-end justify-between gap-2 text-white">
                  <div className="space-y-0.5 max-w-[75%]">
                    <span className="text-[8px] font-mono tracking-widest uppercase text-white/70 block">
                      {currentDish.tag}
                    </span>
                    <h3 className="font-editorial text-base font-bold leading-tight drop-shadow-sm text-white line-clamp-1">
                      {currentDish.name}
                    </h3>
                  </div>

                  {/* Price Badge */}
                  <div className="px-2.5 py-1 rounded-lg font-number font-bold text-xs tracking-tight shadow-xl shrink-0 bg-[#FAF7F2] text-[#12100E]">
                    ₹{currentDish.price}
                  </div>
                </div>
              </div>

              {/* Description & Sommelier Pairing Tip */}
              <div className="space-y-1.5 px-0.5">
                <p className={`text-[11px] leading-snug line-clamp-1 ${isLight ? 'text-stone-600' : 'text-stone-300'}`}>
                  {currentDish.description}
                </p>

                <div className={`p-2 rounded-xl border flex items-center justify-between gap-2 ${
                  isLight ? 'bg-black/[0.03] border-black/10' : 'bg-white/[0.03] border-white/10'
                }`}>
                  <div className="flex items-center gap-1.5 text-[10px] font-mono font-medium overflow-hidden">
                    <ChefHat className="w-3 h-3 shrink-0 text-[#C5A880]" />
                    <span className="truncate">{currentDish.pairing}</span>
                  </div>

                  {operationalModel !== 'showcase' && (
                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        type="button"
                        onClick={(e) => handleQuickOrder(e, currentDish)}
                        className="px-2 py-1 rounded-lg bg-[#12100E] dark:bg-white text-white dark:text-[#12100E] font-mono text-[9px] font-bold transition active:scale-95 flex items-center gap-1 cursor-pointer shadow-sm"
                      >
                        <Plus className="w-2.5 h-2.5" />
                        <span>Order</span>
                      </button>

                      <button
                        type="button"
                        onClick={(e) => handleAddCuratedPairing(e, currentDish)}
                        className="px-2 py-1 rounded-lg bg-[#C5A880] text-[#12100E] font-mono text-[9px] font-bold transition active:scale-95 flex items-center gap-1 cursor-pointer shadow-sm"
                      >
                        <span>Pair ₹{currentDish.pairingBundlePrice}</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Card Carousel Controls & Progress Dots */}
              <div className={`flex items-center justify-between pt-2 mt-2 border-t ${
                isLight ? 'border-black/10' : 'border-white/10'
              }`}>
                <button
                  onClick={handlePrev}
                  className={`flex items-center gap-1 text-[10px] font-mono py-1 px-2 rounded-lg transition active:scale-95 cursor-pointer ${
                    isLight ? 'text-stone-600 hover:text-black bg-black/5' : 'text-stone-400 hover:text-white bg-white/5'
                  }`}
                >
                  <ChevronLeft className="w-3 h-3" />
                  <span>PREV</span>
                </button>

                {/* 4 Interactive Segment Indicators */}
                <div className="flex items-center gap-1.5">
                  {CAMPAIGN_DISHES.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        sounds.playClick();
                        setDirection(idx > currentIndex ? 1 : -1);
                        setCurrentIndex(idx);
                      }}
                      className={`h-1.5 rounded-full transition-all cursor-pointer ${
                        idx === currentIndex
                          ? isLight ? 'w-5 bg-[#12100E]' : 'w-5 bg-[#FAF7F2]'
                          : isLight ? 'w-1.5 bg-black/20' : 'w-1.5 bg-white/20'
                      }`}
                      aria-label={`Go to slide ${idx + 1}`}
                    />
                  ))}
                </div>

                <button
                  onClick={handleNext}
                  className={`flex items-center gap-1 text-[10px] font-mono py-1 px-2 rounded-lg transition active:scale-95 cursor-pointer ${
                    isLight ? 'text-stone-600 hover:text-black bg-black/5' : 'text-stone-400 hover:text-white bg-white/5'
                  }`}
                >
                  <span>NEXT</span>
                  <ChevronRight className="w-3 h-3" />
                </button>
              </div>
            </motion.div>
          </div>

          {/* Mobile Ergonomic Action Buttons */}
          <div className="grid grid-cols-2 gap-2 pt-0.5">
            <button
              onClick={() => {
                sounds.playClick();
                onExploreMenu();
              }}
              className={`py-3 px-3 rounded-2xl font-sans font-bold text-xs tracking-wider uppercase flex items-center justify-center gap-2 transition-all duration-300 active:scale-95 shadow-lg cursor-pointer border ${
                isLight
                  ? 'bg-[#141210] active:bg-[#201C19] text-[#FAF7F2] border-black/15 shadow-black/15'
                  : 'bg-gradient-to-r from-[#FAF7F2] to-[#ECE5D8] active:bg-white text-[#141210] border-white/30 shadow-black/40'
              }`}
            >
              <UtensilsCrossed className="w-3.5 h-3.5 stroke-[1.8] text-[#C5A880]" />
              <span className="tracking-wider">EXPLORE MENU</span>
              <ArrowRight className="w-3.5 h-3.5 stroke-[1.8]" />
            </button>

            {/* Secondary Context Button */}
            {operationalModel === 'table-qr' && (
              <button
                onClick={() => { sounds.playClick(); onOpenScanner(); }}
                className={`py-3 px-3 rounded-2xl font-sans font-semibold text-xs tracking-wider uppercase flex items-center justify-center gap-2 transition active:scale-95 border cursor-pointer ${
                  isLight
                    ? 'bg-[#EAE4D9]/85 active:bg-[#DFD8CC] text-[#12100E] border-black/15 shadow-xs'
                    : 'bg-[#1C1815]/90 active:bg-[#25201C] text-[#FAF7F2] border-white/10 shadow-xs'
                }`}
              >
                <QrCode className="w-3.5 h-3.5 stroke-[1.8] text-[#D04834]" />
                <span className="truncate">{activeTable ? `TABLE #${activeTable}` : 'SELECT TABLE'}</span>
              </button>
            )}

            {operationalModel === 'self-serve' && (
              <button
                onClick={() => { sounds.playClick(); onExploreMenu(); }}
                className={`py-3 px-3 rounded-2xl font-sans font-semibold text-xs tracking-wider uppercase flex items-center justify-center gap-2 transition active:scale-95 border cursor-pointer ${
                  isLight
                    ? 'bg-[#EAE4D9]/85 active:bg-[#DFD8CC] text-[#12100E] border-black/15 shadow-xs'
                    : 'bg-[#1C1815]/90 active:bg-[#25201C] text-[#FAF7F2] border-white/10 shadow-xs'
                }`}
              >
                <Store className="w-3.5 h-3.5 stroke-[1.8] text-cyan-500" />
                <span>COUNTER PICKUP</span>
              </button>
            )}

            {operationalModel === 'showcase' && (
              <button
                onClick={() => {
                  sounds.playClick();
                  if (onOpenReservation) onOpenReservation();
                }}
                className={`py-3 px-3 rounded-2xl font-sans font-semibold text-xs tracking-wider uppercase flex items-center justify-center gap-2 transition active:scale-95 border cursor-pointer ${
                  isLight
                    ? 'bg-[#EAE4D9]/85 active:bg-[#DFD8CC] text-[#12100E] border-black/15 shadow-xs'
                    : 'bg-[#1C1815]/90 active:bg-[#25201C] text-[#FAF7F2] border-white/10 shadow-xs'
                }`}
              >
                <Calendar className="w-3.5 h-3.5 stroke-[1.8] text-[#C5A880]" />
                <span>BOOK A TABLE</span>
              </button>
            )}

            {operationalModel === 'delivery' && (
              <button
                onClick={() => { sounds.playClick(); onExploreMenu(); }}
                className={`py-3 px-3 rounded-2xl font-sans font-semibold text-xs tracking-wider uppercase flex items-center justify-center gap-2 transition active:scale-95 border cursor-pointer ${
                  isLight
                    ? 'bg-[#EAE4D9]/85 active:bg-[#DFD8CC] text-[#12100E] border-black/15 shadow-xs'
                    : 'bg-[#1C1815]/90 active:bg-[#25201C] text-[#FAF7F2] border-white/10 shadow-xs'
                }`}
              >
                <Truck className="w-3.5 h-3.5 stroke-[1.8] text-emerald-500" />
                <span>FAST DELIVERY</span>
              </button>
            )}

            {operationalModel === 'hybrid' && (
              <button
                onClick={() => { sounds.playClick(); onOpenScanner(); }}
                className={`py-3 px-3 rounded-2xl font-sans font-semibold text-xs tracking-wider uppercase flex items-center justify-center gap-2 transition active:scale-95 border cursor-pointer ${
                  isLight
                    ? 'bg-[#EAE4D9]/85 active:bg-[#DFD8CC] text-[#12100E] border-black/15 shadow-xs'
                    : 'bg-[#1C1815]/90 active:bg-[#25201C] text-[#FAF7F2] border-white/10 shadow-xs'
                }`}
              >
                <QrCode className="w-3.5 h-3.5 stroke-[1.8] text-[#D04834]" />
                <span>TABLE / PICKUP</span>
              </button>
            )}

            {operationalModel === 'loyalty' && (
              <button
                onClick={() => {
                  sounds.playClick();
                  if (onOpenLoyaltyModal) onOpenLoyaltyModal();
                }}
                className={`py-3 px-3 rounded-2xl font-sans font-semibold text-xs tracking-wider uppercase flex items-center justify-center gap-2 transition active:scale-95 border cursor-pointer ${
                  isLight
                    ? 'bg-[#EAE4D9]/85 active:bg-[#DFD8CC] text-[#12100E] border-black/15 shadow-xs'
                    : 'bg-[#1C1815]/90 active:bg-[#25201C] text-[#FAF7F2] border-white/10 shadow-xs'
                }`}
              >
                <Award className="w-3.5 h-3.5 stroke-[1.8] text-[#C5A880]" />
                <span>PUNCH CARD</span>
              </button>
            )}
          </div>

          {/* Mobile Cafe Perks Micro-Bar */}
          <div className={`grid grid-cols-3 gap-2 pt-3 border-t text-left ${
            isLight ? 'border-black/10' : 'border-white/10'
          }`}>
            <div className={`p-2 rounded-xl border ${isLight ? 'bg-black/[0.02] border-black/5' : 'bg-white/[0.02] border-white/5'}`}>
              <p className="text-[9px] font-mono opacity-50 uppercase tracking-wider">Kitchen</p>
              <p className={`text-xs font-bold font-syne mt-0.5 truncate ${isLight ? 'text-[#12100E]' : 'text-white'}`}>Wood-Fired</p>
              <p className={`text-[9px] font-mono truncate ${isLight ? 'text-stone-600' : 'text-stone-400'}`}>48h Sourdough</p>
            </div>
            <div className={`p-2 rounded-xl border ${isLight ? 'bg-black/[0.02] border-black/5' : 'bg-white/[0.02] border-white/5'}`}>
              <p className="text-[9px] font-mono opacity-50 uppercase tracking-wider">Speed</p>
              <p className={`text-xs font-bold font-number mt-0.5 truncate ${isLight ? 'text-[#12100E]' : 'text-white'}`}>10-15 Min</p>
              <p className={`text-[9px] font-mono truncate ${isLight ? 'text-stone-600' : 'text-stone-400'}`}>Zero-Wait QR</p>
            </div>
            <div className={`p-2 rounded-xl border ${isLight ? 'bg-black/[0.02] border-black/5' : 'bg-white/[0.02] border-white/5'}`}>
              <p className="text-[9px] font-mono opacity-50 uppercase tracking-wider">Billing</p>
              <p className={`text-xs font-bold font-syne mt-0.5 truncate ${isLight ? 'text-[#12100E]' : 'text-white'}`}>UPI / Card</p>
              <p className={`text-[9px] font-mono truncate ${isLight ? 'text-stone-600' : 'text-stone-400'}`}>Or Counter Cash</p>
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 2. DESKTOP HERO LAYOUT (lg+) - 100% INTACT & PRESERVED FOR PC             */}
        {/* ========================================================================= */}
        <div className="hidden lg:grid grid-cols-12 gap-10 lg:gap-14 items-center">
          
          {/* Left Column: Huge High-Fashion Typography & Narrative */}
          <div className="lg:col-span-6 space-y-6 sm:space-y-8 text-left">
            
            {/* Tagline Badge */}
            <div
              className={`inline-flex items-center gap-2.5 px-3 py-1 rounded-md border text-xs font-mono transition-colors ${
                isLight
                  ? 'bg-[#EAE4D9] border-black/10 text-stone-700'
                  : 'bg-[#1E1A17] border-white/10 text-stone-300'
              }`}
            >
              <img src={BRAND_CONFIG.logoTransparent} alt="Velour" className="h-4 w-auto object-contain" />
              <span className={`font-semibold tracking-wider ${isLight ? 'text-[#12100E]' : 'text-[#FAF7F2]'}`}>
                VELOUR CAFE & BISTRO
              </span>
              <span className="opacity-30">•</span>
              <span className="text-[10px] opacity-70">ARTISAN KITCHEN</span>
            </div>

            {/* Dramatic Master Headline */}
            <div className="space-y-1">
              <h1
                className="text-4xl sm:text-6xl xl:text-7xl font-bold tracking-tight leading-[1.04]"
              >
                <span className={`font-editorial block transition-colors ${isLight ? 'text-[#12100E]' : 'text-white'}`}>
                  Eat Well.
                </span>
                <span className={`font-editorial-italic tracking-normal font-black block transition-colors ${
                  isLight ? 'text-[#12100E]' : 'text-[#FAF7F2]'
                }`}>
                  Stay Late.
                </span>
              </h1>
            </div>

            {/* Contemporary Editorial Body */}
            <p
              className={`text-sm sm:text-base leading-relaxed max-w-lg font-normal transition-colors ${
                isLight ? 'text-stone-600' : 'text-stone-300'
              }`}
            >
              {currentModelConfig.description}
            </p>

            {/* Editorial Action CTAs */}
            <div
              className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2"
            >
              {/* Primary Button */}
              <button
                onClick={() => {
                  sounds.playClick();
                  onExploreMenu();
                }}
                className={`relative px-6 sm:px-8 py-3.5 sm:py-4 rounded-2xl font-sans font-bold text-xs sm:text-sm tracking-wider uppercase flex items-center justify-center gap-3 transition-all duration-300 active:scale-[0.98] group shadow-xl cursor-pointer border ${
                  isLight
                    ? 'bg-[#141210] hover:bg-[#201C19] text-[#FAF7F2] border-black/15 hover:border-[#C5A880]/50 shadow-black/15 hover:shadow-black/25'
                    : 'bg-gradient-to-r from-[#FAF7F2] to-[#ECE5D8] hover:from-white hover:to-[#FAF7F2] text-[#141210] border-white/40 shadow-black/40 hover:shadow-[0_10px_35px_rgba(197,168,128,0.25)]'
                }`}
              >
                <UtensilsCrossed className="w-4 h-4 stroke-[1.8] text-[#C5A880] transition-transform duration-300 group-hover:rotate-12" />
                <span className="tracking-widest">{currentModelConfig.primaryCta}</span>
                <ArrowRight className="w-4 h-4 stroke-[1.8] text-[#C5A880] sm:text-current transition-transform duration-300 group-hover:translate-x-1.5" />
              </button>

              {/* Contextual Secondary Button */}
              {operationalModel === 'table-qr' && (
                <button
                  onClick={() => { sounds.playClick(); onOpenScanner(); }}
                  className={`px-5 sm:px-6 py-3.5 sm:py-4 rounded-2xl font-sans font-semibold text-xs sm:text-sm tracking-wider uppercase flex items-center justify-center gap-2.5 transition-all duration-300 active:scale-[0.98] border cursor-pointer ${
                    isLight
                      ? 'bg-[#EAE4D9]/85 hover:bg-[#DFD8CC] active:bg-[#d6cfc1] text-[#12100E] border-black/15 hover:border-black/25 shadow-xs'
                      : 'bg-[#1C1815]/90 hover:bg-[#25201C] active:bg-[#2e2722] text-[#FAF7F2] border-white/10 hover:border-[#C5A880]/30 shadow-xs'
                  }`}
                >
                  <UtensilsCrossed className="w-4 h-4 stroke-[1.8] text-[#D04834]" />
                  <span>SELECT DINING TABLE</span>
                </button>
              )}

              {operationalModel === 'self-serve' && (
                <button
                  onClick={() => { sounds.playClick(); onExploreMenu(); }}
                  className={`px-5 sm:px-6 py-3.5 sm:py-4 rounded-2xl font-sans font-semibold text-xs sm:text-sm tracking-wider uppercase flex items-center justify-center gap-2.5 transition-all duration-300 active:scale-[0.98] border cursor-pointer ${
                    isLight
                      ? 'bg-[#EAE4D9]/85 hover:bg-[#DFD8CC] active:bg-[#d6cfc1] text-[#12100E] border-black/15 hover:border-black/25 shadow-xs'
                      : 'bg-[#1C1815]/90 hover:bg-[#25201C] active:bg-[#2e2722] text-[#FAF7F2] border-white/10 hover:border-[#C5A880]/30 shadow-xs'
                  }`}
                >
                  <Store className="w-4 h-4 stroke-[1.8] text-cyan-500" />
                  <span>COUNTER PICKUP</span>
                </button>
              )}

              {operationalModel === 'showcase' && (
                <button
                  onClick={() => {
                    sounds.playClick();
                    if (onOpenReservation) onOpenReservation();
                  }}
                  className={`px-5 sm:px-6 py-3.5 sm:py-4 rounded-2xl font-sans font-semibold text-xs sm:text-sm tracking-wider uppercase flex items-center justify-center gap-2.5 transition-all duration-300 active:scale-[0.98] border cursor-pointer ${
                    isLight
                      ? 'bg-[#EAE4D9]/85 hover:bg-[#DFD8CC] active:bg-[#d6cfc1] text-[#12100E] border-black/15 hover:border-black/25 shadow-xs'
                      : 'bg-[#1C1815]/90 hover:bg-[#25201C] active:bg-[#2e2722] text-[#FAF7F2] border-white/10 hover:border-[#C5A880]/30 shadow-xs'
                  }`}
                >
                  <Calendar className="w-4 h-4 stroke-[1.8] text-[#C5A880]" />
                  <span>BOOK A TABLE</span>
                </button>
              )}

              {operationalModel === 'delivery' && (
                <button
                  onClick={() => { sounds.playClick(); onExploreMenu(); }}
                  className={`px-5 sm:px-6 py-3.5 sm:py-4 rounded-2xl font-sans font-semibold text-xs sm:text-sm tracking-wider uppercase flex items-center justify-center gap-2.5 transition-all duration-300 active:scale-[0.98] border cursor-pointer ${
                    isLight
                      ? 'bg-[#EAE4D9]/85 hover:bg-[#DFD8CC] active:bg-[#d6cfc1] text-[#12100E] border-black/15 hover:border-black/25 shadow-xs'
                      : 'bg-[#1C1815]/90 hover:bg-[#25201C] active:bg-[#2e2722] text-[#FAF7F2] border-white/10 hover:border-[#C5A880]/30 shadow-xs'
                  }`}
                >
                  <Truck className="w-4 h-4 stroke-[1.8] text-emerald-500" />
                  <span>FAST DELIVERY</span>
                </button>
              )}

              {operationalModel === 'hybrid' && (
                <div className={`inline-flex rounded-2xl border p-1 ${
                  isLight ? 'bg-[#EAE4D9]/85 border-black/15' : 'bg-[#1C1815]/90 border-white/10'
                }`}>
                  <button
                    type="button"
                    onClick={() => { sounds.playClick(); setDiningMode('table'); }}
                    className={`px-4 py-2.5 rounded-xl text-xs font-sans font-semibold tracking-wider uppercase transition cursor-pointer ${
                      diningMode === 'table'
                        ? isLight ? 'bg-[#141210] text-[#FAF7F2] font-bold shadow-md' : 'bg-[#FAF7F2] text-[#141210] font-bold shadow-md'
                        : isLight ? 'text-stone-600 hover:text-black' : 'text-stone-400 hover:text-white'
                    }`}
                  >
                    Table QR
                  </button>
                  <button
                    type="button"
                    onClick={() => { sounds.playClick(); setDiningMode('delivery'); }}
                    className={`px-4 py-2.5 rounded-xl text-xs font-sans font-semibold tracking-wider uppercase transition cursor-pointer ${
                      diningMode === 'delivery'
                        ? isLight ? 'bg-[#141210] text-[#FAF7F2] font-bold shadow-md' : 'bg-[#FAF7F2] text-[#141210] font-bold shadow-md'
                        : isLight ? 'text-stone-600 hover:text-black' : 'text-stone-400 hover:text-white'
                    }`}
                  >
                    Delivery
                  </button>
                </div>
              )}

              {operationalModel === 'loyalty' && (
                <button
                  onClick={() => {
                    sounds.playClick();
                    if (onOpenLoyaltyModal) onOpenLoyaltyModal();
                  }}
                  className={`px-5 sm:px-6 py-3.5 sm:py-4 rounded-2xl font-sans font-semibold text-xs sm:text-sm tracking-wider uppercase flex items-center gap-2.5 transition-all duration-300 border cursor-pointer ${
                    isLight
                      ? 'bg-[#EAE4D9]/85 hover:bg-[#DFD8CC] text-[#12100E] border-black/15 hover:border-black/25 shadow-xs'
                      : 'bg-[#1C1815]/90 hover:bg-[#25201C] text-[#FAF7F2] border-white/10 hover:border-[#C5A880]/30 shadow-xs'
                  }`}
                >
                  <Award className="w-4 h-4 stroke-[1.8] text-[#C5A880]" />
                  <span>PUNCH CARD</span>
                </button>
              )}
            </div>

            {/* Editorial Metadata Strip */}
            <div className={`grid grid-cols-3 gap-4 pt-8 border-t text-left transition-colors ${
              isLight ? 'border-black/10' : 'border-white/10'
            }`}>
              <div>
                <p className="text-[10px] font-mono opacity-60 uppercase tracking-wider">Kitchen</p>
                <p className={`text-xs sm:text-sm font-bold font-syne mt-0.5 ${isLight ? 'text-[#12100E]' : 'text-white'}`}>Wood-Fired</p>
                <p className={`text-[10px] font-mono ${isLight ? 'text-stone-600' : 'text-stone-400'}`}>Slow-fermented</p>
              </div>
              <div>
                <p className="text-[10px] font-mono opacity-60 uppercase tracking-wider">Service</p>
                <p className={`text-xs sm:text-sm font-bold font-number mt-0.5 ${isLight ? 'text-[#12100E]' : 'text-white'}`}>10-15 Min</p>
                <p className={`text-[10px] font-mono ${isLight ? 'text-stone-600' : 'text-stone-400'}`}>Zero-wait QR</p>
              </div>
              <div>
                <p className="text-[10px] font-mono opacity-60 uppercase tracking-wider">Payment</p>
                <p className={`text-xs sm:text-sm font-bold font-syne mt-0.5 ${isLight ? 'text-[#12100E]' : 'text-white'}`}>UPI / Card</p>
                <p className={`text-[10px] font-mono ${isLight ? 'text-stone-600' : 'text-stone-400'}`}>Or cash at seat</p>
              </div>
            </div>

          </div>

          {/* Right Column: Fashion Lookbook Photo Composition with Asymmetric Layering */}
          <div 
            ref={cardRef}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            onMouseEnter={() => setIsPaused(true)}
            className="lg:col-span-6 relative perspective-1000"
          >
            {/* Layered Decorative Editorial Frame Behind */}
            <div className={`absolute -inset-2 sm:-inset-4 border rounded-3xl pointer-events-none transform -rotate-1 hidden sm:block transition-colors ${
              isLight ? 'border-black/10' : 'border-white/10'
            }`} />

            <motion.div
              style={{ rotateX, rotateY }}
              className={`relative rounded-3xl overflow-hidden border shadow-2xl p-4 sm:p-5 transition-colors ${
                isLight
                  ? 'bg-white border-black/10 shadow-stone-300/40'
                  : 'bg-[#181412] border-white/15 shadow-black/80'
              }`}
            >
              {/* Card Top Header Lookbook Bar */}
              <div className={`flex items-center justify-between pb-3.5 border-b text-[10px] font-mono tracking-widest uppercase transition-colors ${
                isLight ? 'border-black/10 text-stone-500' : 'border-white/10 text-stone-400'
              }`}>
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#D04834]" />
                  <span className={`font-bold ${isLight ? 'text-[#12100E]' : 'text-[#FAF7F2]'}`}>
                    {currentDish.edition}
                  </span>
                  <span className="opacity-30">//</span>
                  <span>{currentDish.tag}</span>
                </div>

                <div className="flex items-center gap-1.5">
                  <span className="opacity-60">{currentIndex + 1}</span>
                  <span className="opacity-40">/</span>
                  <span className="opacity-80">{CAMPAIGN_DISHES.length}</span>
                </div>
              </div>

              {/* Main Lookbook Photography Spread */}
              <div className="relative aspect-[4/3] sm:aspect-[16/11] w-full rounded-2xl overflow-hidden my-4 bg-stone-950 group/img">
                <AnimatePresence mode="wait">
                  <motion.img
                    key={currentDish.id}
                    src={currentDish.image}
                    alt={currentDish.name}
                    initial={{ opacity: 0, scale: 1.08 }}
                    animate={{ opacity: 1, scale: 1.01 }}
                    exit={{ opacity: 0, scale: 0.96 }}
                    transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover/img:scale-105"
                  />
                </AnimatePresence>

                {/* Subtle Cinematic Vignette */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20 pointer-events-none -z-0" />

                {/* Floating Stamp Badge */}
                <div className="absolute top-3 left-3 z-20 px-3 py-1 rounded-full bg-[#12100E]/85 backdrop-blur-md border border-white/15 text-[10px] font-mono tracking-wider text-[#FAF7F2] font-bold">
                  CHEF'S SIGNATURE
                </div>

                {/* Quick Add Main Dish Button */}
                {operationalModel !== 'showcase' && (
                  <button
                    type="button"
                    onClick={(e) => handleQuickOrder(e, currentDish)}
                    className="absolute bottom-3 left-3 z-30 px-3.5 py-2 rounded-xl bg-[#12100E]/90 hover:bg-black active:scale-95 backdrop-blur-md border border-[#C5A880]/60 hover:border-[#C5A880] text-white font-mono text-[10px] font-bold tracking-wider uppercase flex items-center gap-1.5 transition cursor-pointer shadow-2xl pointer-events-auto"
                    title={`Quick add ${currentDish.name} to order`}
                  >
                    <Plus className="w-3.5 h-3.5 text-[#C5A880] stroke-[3]" />
                    <span>Quick Order</span>
                  </button>
                )}

                {/* Floating Price Tag */}
                <div className={`absolute bottom-3 right-3 z-20 px-3.5 py-1.5 rounded-xl font-number font-bold text-base tracking-tight shadow-xl ${
                  isLight ? 'bg-[#12100E] text-[#FAF7F2]' : 'bg-[#FAF7F2] text-[#12100E]'
                }`}>
                  ₹{currentDish.price}
                </div>
              </div>

              {/* Dish Name & Tasting Note */}
              <div className="space-y-1.5 text-left pt-1">
                <div className="flex items-baseline justify-between gap-2">
                  <h3 className={`font-editorial text-xl sm:text-2xl font-bold tracking-tight transition-colors ${
                    isLight ? 'text-[#12100E]' : 'text-white'
                  }`}>
                    {currentDish.name}
                  </h3>
                  <span className={`text-[11px] font-mono shrink-0 ${isLight ? 'text-stone-500' : 'text-stone-400'}`}>
                    Ready in {currentDish.prepTime}
                  </span>
                </div>

                <p className={`text-xs leading-relaxed font-normal ${isLight ? 'text-stone-600' : 'text-stone-400'}`}>
                  {currentDish.description}
                </p>

                {/* Sommelier Tasting Note & 1-Click Pairing Add */}
                <div className={`p-3 rounded-2xl border text-[11px] font-mono flex items-center justify-between gap-3 mt-2.5 ${
                  isLight ? 'bg-black/[0.03] border-black/10' : 'bg-white/[0.03] border-white/10'
                }`}>
                  <div className="space-y-0.5 overflow-hidden text-left">
                    <div className="flex items-center gap-1.5 text-[9px] uppercase tracking-widest text-[#C5A880] font-bold">
                      <ChefHat className="w-3 h-3 text-[#C5A880]" />
                      <span>Sommelier Pairing</span>
                    </div>
                    <p className={`text-[11px] font-sans line-clamp-1 ${isLight ? 'text-stone-700' : 'text-stone-300'}`}>
                      {currentDish.sommelierNote || currentDish.pairing}
                    </p>
                  </div>

                  {operationalModel !== 'showcase' && (
                    <button
                      onClick={(e) => handleAddCuratedPairing(e, currentDish)}
                      className="px-3.5 py-2 rounded-xl bg-[#C5A880] hover:bg-[#B89358] text-[#12100E] font-mono text-[10px] font-bold tracking-wider uppercase shrink-0 transition flex items-center gap-1.5 cursor-pointer shadow-md active:scale-95"
                    >
                      <Plus className="w-3 h-3 stroke-[2.5]" />
                      <span>Pair ₹{currentDish.pairingBundlePrice}</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Prev / Next Minimalist Editorial Controls */}
              <div className={`flex items-center justify-between pt-4 mt-4 border-t transition-colors ${
                isLight ? 'border-black/10' : 'border-white/10'
              }`}>
                <button
                  onClick={handlePrev}
                  className={`flex items-center gap-1.5 text-xs font-mono transition cursor-pointer ${
                    isLight ? 'text-stone-600 hover:text-black' : 'text-stone-400 hover:text-white'
                  }`}
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>PREV LOOK</span>
                </button>

                {/* Interactive Dots */}
                <div className="flex items-center gap-2">
                  {CAMPAIGN_DISHES.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => { sounds.playClick(); setCurrentIndex(idx); }}
                      className={`h-1.5 transition-all rounded-full ${
                        idx === currentIndex 
                          ? isLight ? 'w-6 bg-[#12100E]' : 'w-6 bg-[#FAF7F2]' 
                          : isLight ? 'w-1.5 bg-black/20 hover:bg-black/40' : 'w-1.5 bg-white/20 hover:bg-white/40'
                      }`}
                      aria-label={`Slide ${idx + 1}`}
                    />
                  ))}
                </div>

                <button
                  onClick={handleNext}
                  className={`flex items-center gap-1.5 text-xs font-mono transition cursor-pointer ${
                    isLight ? 'text-stone-600 hover:text-black' : 'text-stone-400 hover:text-white'
                  }`}
                >
                  <span>NEXT LOOK</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

            </motion.div>
          </div>

        </div>

      </div>

      {/* Sommelier Pairing Added Live Toast */}
      <AnimatePresence>
        {pairingToast && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="fixed top-28 left-1/2 -translate-x-1/2 z-50 px-5 py-3 rounded-2xl bg-[#141210]/95 border border-[#C5A880]/50 text-[#FAF7F2] shadow-2xl backdrop-blur-xl flex items-center gap-3 text-xs font-mono"
          >
            <div className="w-6 h-6 rounded-full bg-[#C5A880]/20 flex items-center justify-center text-[#C5A880]">
              <CheckCircle2 className="w-4 h-4" />
            </div>
            <span>{pairingToast}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
