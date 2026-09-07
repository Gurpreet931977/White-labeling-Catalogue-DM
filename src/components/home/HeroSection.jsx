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
import { BRAND_CONFIG, MODEL_SYSTEM_CONFIG } from '../../data/cafeConfig';
import { sounds } from '../../utils/audio';

// Curated Editorial Campaign Dishes (High-Res Realistic Photography)
const CAMPAIGN_DISHES = [
  {
    id: "thc-01",
    edition: "LOOK 01",
    tag: "FORNO A LEGNA // 48H FERMENT",
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
    tag: "PASTA FATTA A MANO",
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
    tag: "CAFFETTERIA // SINGLE-ORIGIN",
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
    tag: "DOLCE ARTIGIANALE",
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
    <section className="relative pt-8 sm:pt-14 pb-16 sm:pb-24 overflow-hidden bg-[#12100E] text-[#FAF7F2]">
      
      {/* Background Editorial Watermark & Glow */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-gradient-to-b from-[#D04834]/8 via-[#581422]/5 to-transparent rounded-full blur-[140px] pointer-events-none -z-10" />
      
      {/* Large Subtle Editorial Watermark */}
      <div className="absolute top-20 right-4 lg:right-12 select-none pointer-events-none opacity-[0.03] font-editorial text-[140px] sm:text-[220px] font-black leading-none uppercase tracking-tighter -z-10">
        MILANO
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
        
        {/* Editorial Masthead Micro Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8 sm:mb-12 border-b border-white/10 pb-4 text-[10px] font-mono tracking-widest text-stone-400 uppercase">
          <div className="flex items-center gap-3">
            <span className="w-2 h-2 rounded-full bg-[#D04834]" />
            <span className="text-stone-300 font-bold">VOL. IV // SPRING-SUMMER 2026</span>
            <span className="text-white/20">•</span>
            <span className="hidden sm:inline">DEHRADUN BISTRO HUB</span>
          </div>

          <div className="flex items-center gap-4">
            <span className="hidden md:inline">LAT 30.3165° N // 78.0322° E</span>
            <span className="px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-[#FAF7F2] font-semibold">
              {currentModelConfig.badge}
            </span>
          </div>
        </div>

        {/* Asymmetric Campaign Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          
          {/* Left Column: Huge High-Fashion Typography & Narrative */}
          <div className="lg:col-span-6 space-y-6 sm:space-y-8 text-left">
            
            {/* Italian Phrase Tag */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2.5 px-3 py-1 rounded-md bg-[#1E1A17] border border-white/10 text-xs font-mono text-stone-300"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#E8E439]" />
              <span className="text-[#FAF7F2] font-semibold tracking-wider">LA VITA, SERVITA.</span>
              <span className="text-white/20">•</span>
              <span className="text-[10px] text-stone-400">MILANESE SOUL // LOCAL HEAT</span>
            </motion.div>

            {/* Dramatic Master Headline */}
            <div className="space-y-1">
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                className="text-4xl sm:text-6xl xl:text-7xl font-bold tracking-tight leading-[1.04]"
              >
                <span className="font-editorial text-white block">
                  Eat Well.
                </span>
                <span className="font-editorial-italic text-[#FAF7F2] tracking-normal font-black block">
                  Stay Late.
                </span>
              </motion.h1>
            </div>

            {/* Contemporary Editorial Body */}
            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="text-stone-300 text-sm sm:text-base leading-relaxed max-w-lg font-normal"
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
                className="relative px-6 sm:px-8 py-3.5 sm:py-4 rounded-xl bg-[#FAF7F2] text-[#12100E] font-syne font-black text-xs sm:text-sm tracking-wider uppercase flex items-center gap-3 hover:bg-[#E8E0D2] transition group shadow-xl cursor-pointer"
              >
                <UtensilsCrossed className="w-4 h-4 transition-transform group-hover:rotate-12" />
                <span>{currentModelConfig.primaryCta}</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </button>

              {/* Contextual Secondary Button */}
              {operationalModel === 'table-qr' && (
                <button
                  onClick={() => { sounds.playClick(); onOpenScanner(); }}
                  className="px-5 sm:px-6 py-3.5 sm:py-4 rounded-xl bg-[#1C1815] hover:bg-[#25201C] text-stone-200 border border-white/15 font-mono text-xs sm:text-sm tracking-wide flex items-center gap-2.5 transition cursor-pointer"
                >
                  <QrCode className="w-4 h-4 text-[#D04834]" />
                  <span>SCAN TABLE QR</span>
                </button>
              )}

              {operationalModel === 'self-serve' && (
                <button
                  onClick={() => { sounds.playClick(); onExploreMenu(); }}
                  className="px-5 sm:px-6 py-3.5 sm:py-4 rounded-xl bg-[#1C1815] hover:bg-[#25201C] text-stone-200 border border-white/15 font-mono text-xs sm:text-sm tracking-wide flex items-center gap-2.5 transition cursor-pointer"
                >
                  <Store className="w-4 h-4 text-cyan-400" />
                  <span>BANCO PICKUP</span>
                </button>
              )}

              {operationalModel === 'showcase' && (
                <button
                  onClick={() => {
                    sounds.playClick();
                    if (onOpenReservation) onOpenReservation();
                  }}
                  className="px-5 sm:px-6 py-3.5 sm:py-4 rounded-xl bg-[#1C1815] hover:bg-[#25201C] text-stone-200 border border-white/15 font-mono text-xs sm:text-sm tracking-wide flex items-center gap-2.5 transition cursor-pointer"
                >
                  <Calendar className="w-4 h-4 text-[#E8E439]" />
                  <span>PRENOTA TAVOLO</span>
                </button>
              )}

              {operationalModel === 'delivery' && (
                <button
                  onClick={() => { sounds.playClick(); onExploreMenu(); }}
                  className="px-5 sm:px-6 py-3.5 sm:py-4 rounded-xl bg-[#1C1815] hover:bg-[#25201C] text-stone-200 border border-white/15 font-mono text-xs sm:text-sm tracking-wide flex items-center gap-2.5 transition cursor-pointer"
                >
                  <Truck className="w-4 h-4 text-emerald-400" />
                  <span>CONSEGNA RAPIDA</span>
                </button>
              )}

              {operationalModel === 'hybrid' && (
                <div className="inline-flex rounded-xl bg-[#1C1815] border border-white/15 p-1">
                  <button
                    type="button"
                    onClick={() => { sounds.playClick(); setDiningMode('table'); }}
                    className={`px-3.5 py-2 rounded-lg text-xs font-mono transition cursor-pointer ${
                      diningMode === 'table'
                        ? 'bg-[#FAF7F2] text-[#12100E] font-bold shadow-md'
                        : 'text-stone-400 hover:text-white'
                    }`}
                  >
                    Tavolo QR
                  </button>
                  <button
                    type="button"
                    onClick={() => { sounds.playClick(); setDiningMode('delivery'); }}
                    className={`px-3.5 py-2 rounded-lg text-xs font-mono transition cursor-pointer ${
                      diningMode === 'delivery'
                        ? 'bg-[#FAF7F2] text-[#12100E] font-bold shadow-md'
                        : 'text-stone-400 hover:text-white'
                    }`}
                  >
                    Consegna
                  </button>
                </div>
              )}

              {operationalModel === 'loyalty' && (
                <button
                  onClick={() => {
                    sounds.playClick();
                    if (onOpenLoyaltyModal) onOpenLoyaltyModal();
                  }}
                  className="px-5 sm:px-6 py-3.5 sm:py-4 rounded-xl bg-[#1C1815] hover:bg-[#25201C] text-stone-200 border border-white/15 font-mono text-xs sm:text-sm tracking-wide flex items-center gap-2.5 transition cursor-pointer"
                >
                  <Award className="w-4 h-4 text-[#E8E439]" />
                  <span>PUNCH CARD</span>
                </button>
              )}
            </motion.div>

            {/* Editorial Metadata Strip */}
            <div className="grid grid-cols-3 gap-4 pt-8 border-t border-white/10 text-left">
              <div>
                <p className="text-[10px] font-mono text-stone-500 uppercase tracking-wider">Cucina</p>
                <p className="text-xs sm:text-sm font-bold text-white font-syne mt-0.5">Wood-Fired</p>
                <p className="text-[10px] text-stone-400 font-mono">Slow-fermented</p>
              </div>
              <div>
                <p className="text-[10px] font-mono text-stone-500 uppercase tracking-wider">Servizio</p>
                <p className="text-xs sm:text-sm font-bold text-white font-syne mt-0.5">10-15 Min</p>
                <p className="text-[10px] text-stone-400 font-mono">Zero-wait QR</p>
              </div>
              <div>
                <p className="text-[10px] font-mono text-stone-500 uppercase tracking-wider">Pagamento</p>
                <p className="text-xs sm:text-sm font-bold text-white font-syne mt-0.5">UPI / Card</p>
                <p className="text-[10px] text-stone-400 font-mono">Or cash at seat</p>
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
            <div className="absolute -inset-2 sm:-inset-4 border border-white/10 rounded-3xl pointer-events-none transform -rotate-1 hidden sm:block" />

            <motion.div
              style={{ rotateX, rotateY }}
              className="relative rounded-3xl overflow-hidden bg-[#181412] border border-white/15 shadow-2xl p-4 sm:p-5"
            >
              {/* Card Top Header Lookbook Bar */}
              <div className="flex items-center justify-between pb-3.5 border-b border-white/10 text-[10px] font-mono tracking-widest text-stone-400 uppercase">
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#D04834]" />
                  <span className="text-[#FAF7F2] font-bold">{currentDish.edition}</span>
                  <span className="text-white/20">//</span>
                  <span>{currentDish.tag}</span>
                </div>

                <div className="flex items-center gap-1.5">
                  <span className="text-stone-500">{currentIndex + 1}</span>
                  <span className="text-stone-600">/</span>
                  <span className="text-stone-400">{CAMPAIGN_DISHES.length}</span>
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
                <div className="absolute inset-0 bg-gradient-to-t from-[#12100E] via-transparent to-black/20" />

                {/* Floating Stamp Badge */}
                <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-[#12100E]/90 backdrop-blur-md border border-white/15 text-[10px] font-mono tracking-wider text-[#FAF7F2] font-bold">
                  CHEF'S SIGNATURE
                </div>

                {/* Floating Price Tag */}
                <div className="absolute bottom-3 right-3 px-3.5 py-1.5 rounded-xl bg-[#FAF7F2] text-[#12100E] font-syne font-black text-sm tracking-tight shadow-xl">
                  ₹{currentDish.price}
                </div>
              </div>

              {/* Dish Name & Tasting Note */}
              <div className="space-y-1.5 text-left pt-1">
                <div className="flex items-baseline justify-between gap-2">
                  <h3 className="font-editorial text-xl sm:text-2xl font-bold text-white tracking-tight">
                    {currentDish.name}
                  </h3>
                  <span className="text-[11px] font-mono text-stone-400 shrink-0">
                    Ready in {currentDish.prepTime}
                  </span>
                </div>

                <p className="text-xs text-stone-400 leading-relaxed font-normal">
                  {currentDish.description}
                </p>

                <p className="text-[10px] font-mono text-[#E8E439] pt-1">
                  {currentDish.pairing}
                </p>
              </div>

              {/* Prev / Next Minimalist Editorial Controls */}
              <div className="flex items-center justify-between pt-4 mt-4 border-t border-white/10">
                <button
                  onClick={handlePrev}
                  className="flex items-center gap-1.5 text-xs font-mono text-stone-400 hover:text-white transition cursor-pointer"
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
                          ? 'w-6 bg-[#FAF7F2]' 
                          : 'w-1.5 bg-white/20 hover:bg-white/40'
                      }`}
                      aria-label={`Slide ${idx + 1}`}
                    />
                  ))}
                </div>

                <button
                  onClick={handleNext}
                  className="flex items-center gap-1.5 text-xs font-mono text-stone-400 hover:text-white transition cursor-pointer"
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
