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
  Sparkles,
  Flame,
  Coffee,
  CheckCircle2,
  MapPin
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { useTheme } from '../../context/ThemeContext';
import { BRAND_CONFIG, MODEL_SYSTEM_CONFIG } from '../../data/cafeConfig';
import { sounds } from '../../utils/audio';

// Curated Editorial Campaign Dishes (High-Res Realistic Photography)
const CAMPAIGN_DISHES = [
  {
    id: "thc-01",
    edition: "LOOK 01",
    tag: "WOOD-FIRED // 48H FERMENT",
    name: "Wood-Fired Margherita Basilico",
    price: 349,
    rating: "5.0",
    prepTime: "12 min",
    pairing: "Best paired with Cold Brew & Truffle Fries",
    image: "https://images.unsplash.com/photo-1604382355076-af4b0eb60143?auto=format&fit=crop&w=1200&q=85",
    description: "Slow-fermented Neapolitan crust, San Marzano tomato concasse, creamy buffalo mozzarella & fragrant sweet basil.",
    accent: "#D04834"
  },
  {
    id: "thc-05",
    edition: "LOOK 02",
    tag: "HANDMADE PASTA",
    name: "Smoked Alfredo White Sauce Penne",
    price: 269,
    rating: "4.9",
    prepTime: "12 min",
    pairing: "Best paired with Iced Macchiato",
    image: "https://images.unsplash.com/photo-1645112411341-6c4fd023714a?auto=format&fit=crop&w=1200&q=85",
    description: "Velvety Parmesan & European butter cream sauce tossed with charred sweet corn and sautéed wild forest mushrooms.",
    accent: "#E8E439"
  },
  {
    id: "thc-21",
    edition: "LOOK 03",
    tag: "SPECIALTY COFFEE // SINGLE-ORIGIN",
    name: "Classic Iced Caramel Macchiato",
    price: 189,
    rating: "4.9",
    prepTime: "5 min",
    pairing: "Best paired with Tiramisu Classico",
    image: "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?auto=format&fit=crop&w=1200&q=85",
    description: "Cold-aerated Madagascar vanilla milk poured over slow-dripped espresso float with salted butter caramel drizzle.",
    accent: "#C28E5C"
  },
  {
    id: "thc-29",
    edition: "LOOK 04",
    tag: "ARTISAN DESSERT",
    name: "Tiramisu Classico della Casa",
    price: 229,
    rating: "5.0",
    prepTime: "4 min",
    pairing: "Best paired with Double Espresso",
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
  onOpenLoyaltyModal
}) {
  const { isCustomerLoggedIn } = useAuth();
  const { operationalModel, diningMode, setDiningMode } = useCart();
  const { isLight } = useTheme();
  const currentModelConfig = MODEL_SYSTEM_CONFIG[operationalModel] || MODEL_SYSTEM_CONFIG['table-qr'];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const [isPaused, setIsPaused] = useState(false);

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
        
        {/* Asymmetric Campaign Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          
          {/* Left Column: Huge High-Fashion Typography & Narrative */}
          <div className="lg:col-span-6 space-y-6 sm:space-y-8 text-left">
            
            {/* Tagline Badge */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`inline-flex items-center gap-2.5 px-3 py-1 rounded-md border text-xs font-mono transition-colors ${
                isLight
                  ? 'bg-[#EAE4D9] border-black/10 text-stone-700'
                  : 'bg-[#1E1A17] border-white/10 text-stone-300'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-[#D04834]" />
              <span className={`font-semibold tracking-wider ${isLight ? 'text-[#12100E]' : 'text-[#FAF7F2]'}`}>
                FRESHLY CRAFTED.
              </span>
              <span className="opacity-30">•</span>
              <span className="text-[10px] opacity-70">ARTISAN CAFE & BISTRO</span>
            </motion.div>

            {/* Dramatic Master Headline */}
            <div className="space-y-1">
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
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
              </motion.h1>
            </div>

            {/* Contemporary Editorial Body */}
            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className={`text-sm sm:text-base leading-relaxed max-w-lg font-normal transition-colors ${
                isLight ? 'text-stone-600' : 'text-stone-300'
              }`}
            >
              {currentModelConfig.description}
            </motion.p>

            {/* Editorial Action CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="flex flex-wrap items-center gap-3 pt-2"
            >
              {/* Primary Button */}
              <button
                onClick={() => {
                  sounds.playClick();
                  onExploreMenu();
                }}
                className={`relative px-6 sm:px-8 py-3.5 sm:py-4 rounded-xl font-syne font-black text-xs sm:text-sm tracking-wider uppercase flex items-center gap-3 transition group shadow-xl cursor-pointer ${
                  isLight
                    ? 'bg-[#12100E] text-[#FAF7F2] hover:bg-black shadow-black/15'
                    : 'bg-[#FAF7F2] text-[#12100E] hover:bg-[#E8E0D2] shadow-black/40'
                }`}
              >
                <UtensilsCrossed className="w-4 h-4 transition-transform group-hover:rotate-12" />
                <span>{currentModelConfig.primaryCta}</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </button>

              {/* Contextual Secondary Button */}
              {operationalModel === 'table-qr' && (
                <button
                  onClick={() => { sounds.playClick(); onOpenScanner(); }}
                  className={`px-5 sm:px-6 py-3.5 sm:py-4 rounded-xl font-mono text-xs sm:text-sm tracking-wide flex items-center gap-2.5 transition border cursor-pointer ${
                    isLight
                      ? 'bg-[#EAE4D9] hover:bg-[#DFD8CC] text-[#12100E] border-black/15'
                      : 'bg-[#1C1815] hover:bg-[#25201C] text-stone-200 border-white/15'
                  }`}
                >
                  <QrCode className="w-4 h-4 text-[#D04834]" />
                  <span>SCAN TABLE QR</span>
                </button>
              )}

              {operationalModel === 'self-serve' && (
                <button
                  onClick={() => { sounds.playClick(); onExploreMenu(); }}
                  className={`px-5 sm:px-6 py-3.5 sm:py-4 rounded-xl font-mono text-xs sm:text-sm tracking-wide flex items-center gap-2.5 transition border cursor-pointer ${
                    isLight
                      ? 'bg-[#EAE4D9] hover:bg-[#DFD8CC] text-[#12100E] border-black/15'
                      : 'bg-[#1C1815] hover:bg-[#25201C] text-stone-200 border-white/15'
                  }`}
                >
                  <Store className="w-4 h-4 text-cyan-500" />
                  <span>COUNTER PICKUP</span>
                </button>
              )}

              {operationalModel === 'showcase' && (
                <button
                  onClick={() => {
                    sounds.playClick();
                    if (onOpenReservation) onOpenReservation();
                  }}
                  className={`px-5 sm:px-6 py-3.5 sm:py-4 rounded-xl font-mono text-xs sm:text-sm tracking-wide flex items-center gap-2.5 transition border cursor-pointer ${
                    isLight
                      ? 'bg-[#EAE4D9] hover:bg-[#DFD8CC] text-[#12100E] border-black/15'
                      : 'bg-[#1C1815] hover:bg-[#25201C] text-stone-200 border-white/15'
                  }`}
                >
                  <Calendar className="w-4 h-4 text-[#D04834]" />
                  <span>BOOK A TABLE</span>
                </button>
              )}

              {operationalModel === 'delivery' && (
                <button
                  onClick={() => { sounds.playClick(); onExploreMenu(); }}
                  className={`px-5 sm:px-6 py-3.5 sm:py-4 rounded-xl font-mono text-xs sm:text-sm tracking-wide flex items-center gap-2.5 transition border cursor-pointer ${
                    isLight
                      ? 'bg-[#EAE4D9] hover:bg-[#DFD8CC] text-[#12100E] border-black/15'
                      : 'bg-[#1C1815] hover:bg-[#25201C] text-stone-200 border-white/15'
                  }`}
                >
                  <Truck className="w-4 h-4 text-emerald-600" />
                  <span>FAST DELIVERY</span>
                </button>
              )}

              {operationalModel === 'hybrid' && (
                <div className={`inline-flex rounded-xl border p-1 ${
                  isLight ? 'bg-[#EAE4D9] border-black/15' : 'bg-[#1C1815] border-white/15'
                }`}>
                  <button
                    type="button"
                    onClick={() => { sounds.playClick(); setDiningMode('table'); }}
                    className={`px-3.5 py-2 rounded-lg text-xs font-mono transition cursor-pointer ${
                      diningMode === 'table'
                        ? isLight ? 'bg-[#12100E] text-[#FAF7F2] font-bold shadow-md' : 'bg-[#FAF7F2] text-[#12100E] font-bold shadow-md'
                        : isLight ? 'text-stone-600 hover:text-black' : 'text-stone-400 hover:text-white'
                    }`}
                  >
                    Table QR
                  </button>
                  <button
                    type="button"
                    onClick={() => { sounds.playClick(); setDiningMode('delivery'); }}
                    className={`px-3.5 py-2 rounded-lg text-xs font-mono transition cursor-pointer ${
                      diningMode === 'delivery'
                        ? isLight ? 'bg-[#12100E] text-[#FAF7F2] font-bold shadow-md' : 'bg-[#FAF7F2] text-[#12100E] font-bold shadow-md'
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
                  className={`px-5 sm:px-6 py-3.5 sm:py-4 rounded-xl font-mono text-xs sm:text-sm tracking-wide flex items-center gap-2.5 transition border cursor-pointer ${
                    isLight
                      ? 'bg-[#EAE4D9] hover:bg-[#DFD8CC] text-[#12100E] border-black/15'
                      : 'bg-[#1C1815] hover:bg-[#25201C] text-stone-200 border-white/15'
                  }`}
                >
                  <Award className="w-4 h-4 text-[#D04834]" />
                  <span>PUNCH CARD</span>
                </button>
              )}
            </motion.div>

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
              <div className="relative aspect-[4/3] sm:aspect-[16/11] w-full rounded-2xl overflow-hidden my-4 bg-stone-950">
                <AnimatePresence mode="wait">
                  <motion.img
                    key={currentDish.id}
                    src={currentDish.image}
                    alt={currentDish.name}
                    initial={{ opacity: 0, scale: 1.05 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.98 }}
                    transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                    className="w-full h-full object-cover"
                  />
                </AnimatePresence>

                {/* Subtle Cinematic Vignette */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />

                {/* Floating Stamp Badge */}
                <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-[#12100E]/85 backdrop-blur-md border border-white/15 text-[10px] font-mono tracking-wider text-[#FAF7F2] font-bold">
                  CHEF'S SIGNATURE
                </div>

                {/* Floating Price Tag */}
                <div className={`absolute bottom-3 right-3 px-3.5 py-1.5 rounded-xl font-number font-bold text-base tracking-tight shadow-xl ${
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

                <p className="text-[10px] font-mono text-[#D04834] font-semibold pt-1">
                  {currentDish.pairing}
                </p>
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
    </section>
  );
}
