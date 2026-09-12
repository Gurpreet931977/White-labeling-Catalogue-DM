import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, 
  ArrowRight, 
  ArrowUpRight, 
  ArrowDown,
  Calendar, 
  Clock, 
  Check, 
  Compass, 
  ChevronRight, 
  ChevronDown, 
  Eye, 
  Flame, 
  Globe, 
  Heart, 
  Layers, 
  Leaf, 
  MapPin, 
  Maximize2, 
  Menu as MenuIcon, 
  Phone, 
  Plus, 
  RotateCcw, 
  Search, 
  Share2, 
  ShieldCheck, 
  SlidersHorizontal, 
  Sparkles, 
  Star, 
  Utensils, 
  X, 
  Zap,
  Sun,
  Moon,
  Info,
  Activity,
  Award
} from 'lucide-react';
import { sounds } from '../utils/audio';

// ---------------------------------------------------------------------------
// CURATED HEALTHY CULINARY DATA (Organic, Low-Glycemic, Artisan Ingredients)
// ---------------------------------------------------------------------------
const DISHES = [
  {
    id: 'mediterranean-bowl',
    name: 'Mediterranean Harvest Bowl',
    category: 'bowls',
    tagline: 'Ancient grains, sun-blushed tomatoes & cold-pressed emulsion',
    description: 'A vibrant symphony of organic tri-color quinoa, Kalamata olives, fire-roasted chickpeas, cucumber ribbons, and creamy avocado tahini emulsion.',
    price: 490,
    calories: 460,
    macros: { protein: 22, carbs: 48, fat: 18, fiber: 12 },
    dietary: ['Vegan', 'Gluten-Free', 'High-Fiber'],
    pairing: 'Iced Botanical Cold Drip with rosemary sprig',
    prepTime: '8 mins',
    season: 'Summer / Autumn Harvest',
    ingredients: ['Tri-color Quinoa', 'Kalamata Olives', 'Heirloom Tomatoes', 'Cucumber Ribbons', 'Avocado Tahini', 'Fresh Mint & Oregano'],
    allergens: ['Sesame (Tahini)'],
    image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=1000&q=85',
    flavorNotes: 'Zesty citrus finish, herbaceous thyme, velvet sesame richness',
    routineFit: 'Ideal midday revitalizer, sustained low-glycemic cognitive focus'
  },
  {
    id: 'wild-salmon-asparagus',
    name: 'Glazed Wild Salmon & Asparagus',
    category: 'mains',
    tagline: 'Pan-seared Alaskan salmon with charred tenderstem asparagus',
    description: 'Crisp-skin wild salmon fillet drizzled with lemon-dill virgin emulsion, resting on a bed of steamed asparagus and herbed French lentils.',
    price: 740,
    calories: 520,
    macros: { protein: 42, carbs: 24, fat: 26, fiber: 8 },
    dietary: ['High-Protein', 'Gluten-Free', 'Omega-3 Rich'],
    pairing: 'Sparkling Bergamot & White Tea Infusion',
    prepTime: '12 mins',
    season: 'Signature All-Year',
    ingredients: ['Wild Alaskan Salmon', 'Tenderstem Asparagus', 'French Green Lentils', 'Cold-Pressed Olive Oil', 'Dill & Meyer Lemon', 'Pink Sea Salt'],
    allergens: ['Fish'],
    image: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?auto=format&fit=crop&w=1000&q=85',
    flavorNotes: 'Delicate smoky skin, bright lemon zest, buttery green umami',
    routineFit: 'Perfect post-workout recovery or restorative sunset dinner'
  },
  {
    id: 'truffle-burrata-tartine',
    name: 'Truffle & Wild Mushroom Tartine',
    category: 'toasts',
    tagline: 'Slow-fermented sourdough, forest chanterelles & artisanal burrata',
    description: '48-hour sourdough toast topped with sautéed wild chanterelles, creamy buffalo burrata, white truffle oil, and micro-sorrel leaves.',
    price: 580,
    calories: 440,
    macros: { protein: 18, carbs: 38, fat: 22, fiber: 6 },
    dietary: ['Vegetarian', 'Artisan Sourdough'],
    pairing: 'Single-Origin Ethiopian Natural Cold Brew',
    prepTime: '9 mins',
    season: 'Autumn Harvest Special',
    ingredients: ['48hr Fermented Sourdough', 'Forest Chanterelles', 'Artisan Buffalo Burrata', 'White Truffle Essence', 'Micro Sorrel', 'Cracked Peppercorn'],
    allergens: ['Dairy', 'Gluten'],
    image: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&w=1000&q=85',
    flavorNotes: 'Deep earthy mushroom woodland notes, velvet cream, crusty acidity',
    routineFit: 'Mindful leisurely brunch, elevated morning ritual'
  },
  {
    id: 'green-goddess-salad',
    name: 'Crunchy Green Goddess Bowl',
    category: 'bowls',
    tagline: 'Baby Tuscan kale, edamame, shaved radishes & green herb kefir',
    description: 'Crisp green ensemble featuring baby Tuscan kale, organic steamed edamame, sliced Haas avocados, toasted pepitas, and cold green goddess dressing.',
    price: 460,
    calories: 380,
    macros: { protein: 20, carbs: 28, fat: 19, fiber: 14 },
    dietary: ['Gluten-Free', 'Vegetarian', 'Keto-Friendly'],
    pairing: 'Cucumber, Lime & Cold-Pressed Mint Refresher',
    prepTime: '7 mins',
    season: 'Spring / Summer Harvest',
    ingredients: ['Tuscan Lacinato Kale', 'Shelled Edamame', 'Haas Avocado', 'Watermelon Radish', 'Sprouted Pumpkin Seeds', 'Green Goddess Kefir'],
    allergens: ['Dairy (Kefir Option)', 'Soy (Edamame)'],
    image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=1000&q=85',
    flavorNotes: 'Crisp vibrant crunch, soothing garden herbs, tangy probiotic finish',
    routineFit: 'Light refreshing lunch that avoids the afternoon brain-fog'
  },
  {
    id: 'ceremonial-matcha-cloud',
    name: 'Ceremonial Matcha Cloud Elixir',
    category: 'elixirs',
    tagline: 'First-harvest Uji matcha with steamed oat cream & raw vanilla',
    description: 'Single-estate stone-ground ceremonial matcha whisked with filtered alkaline water, poured over chilled oat milk with Madagascar vanilla foam.',
    price: 360,
    calories: 140,
    macros: { protein: 4, carbs: 18, fat: 5, fiber: 3 },
    dietary: ['Vegan', 'Gluten-Free', 'Antioxidant Dense'],
    pairing: 'Dark Cocoa & Almond Flour Truffle',
    prepTime: '5 mins',
    season: 'All-Day Mindful Elixir',
    ingredients: ['Uji First-Harvest Ceremonial Matcha', 'Alkaline Spring Water', 'Steamed Organic Oat Milk', 'Madagascar Vanilla Bean', 'Monk Fruit Sweetener'],
    allergens: ['Oats'],
    image: 'https://images.unsplash.com/photo-1536256263959-770b48d82b0a?auto=format&fit=crop&w=1000&q=85',
    flavorNotes: 'Silky vegetative sweetness, gentle umami, smooth creamy froth',
    routineFit: 'Sustained calm caffeine release without jitters (L-Theanine rich)'
  },
  {
    id: 'acai-pitaya-superbowl',
    name: 'Amazonian Acai & Pitaya Superbowl',
    category: 'bowls',
    tagline: 'Thick organic acai blend, dragon fruit, chia seeds & cacao nibs',
    description: 'Wild harvested organic acai blended thick with dragon fruit, topped with golden kiwi, raw cacao nibs, organic coconut flakes, and sprouted almond butter.',
    price: 490,
    calories: 410,
    macros: { protein: 14, carbs: 54, fat: 16, fiber: 11 },
    dietary: ['Vegan', 'Gluten-Free', 'Superfood Dense'],
    pairing: 'Sparkling Cascara Coffee Berry Infusion',
    prepTime: '6 mins',
    season: 'Morning Energy Ritual',
    ingredients: ['Organic Wild Acai Pulp', 'Pink Pitaya', 'Golden Kiwi Slices', 'Peruvian Raw Cacao Nibs', 'Toasted Coconut Chips', 'Stone-Ground Almond Butter'],
    allergens: ['Tree Nuts (Almond)'],
    image: 'https://images.unsplash.com/photo-1590301157890-4810ed352733?auto=format&fit=crop&w=1000&q=85',
    flavorNotes: 'Rich berry antioxidant depth, crisp cacao crunch, nutty velvet',
    routineFit: 'Morning vitality kickstart, immune & digestive nourishment'
  }
];

// ---------------------------------------------------------------------------
// 4 SIGNATURE HERO SHOWPIECES (With Deconstructed Hotspot Pins & Macro Data)
// ---------------------------------------------------------------------------
const HERO_DISHES = [
  {
    id: 'mediterranean-bowl',
    name: 'Mediterranean Harvest Quinoa Bowl',
    chefTag: 'FARM HARVEST // BOWL 01',
    categoryName: 'Midday Vitality & Cognitive Focus',
    calories: '460 kcal',
    prepTime: '8 mins',
    price: 490,
    headline: 'Tri-color Andean quinoa with Kalamata olives & cold-pressed avocado tahini',
    image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=1200&q=85',
    pairing: {
      name: 'Cold-Drip Ethiopian Natural',
      note: 'Rosemary sprig & bergamot',
      price: '₹280'
    },
    macros: {
      protein: '22g',
      carbs: '48g',
      fat: '18g',
      fiber: '12g',
      glycemicIndex: 'Low (GI 32)'
    },
    pins: [
      { id: 'p1', x: 28, y: 44, label: 'Tri-Color Quinoa', origin: 'Andean Biodynamic heirloom grain, 8g complete protein' },
      { id: 'p2', x: 68, y: 32, label: 'Kalamata Olives & EVOO', origin: 'Greek Peloponnese, stone-milled first cold-press' },
      { id: 'p3', x: 44, y: 64, label: 'Avocado Tahini Dressing', origin: 'Stone-ground sesame emulsified with fresh lime' },
      { id: 'p4', x: 74, y: 60, label: 'Charred Spiced Chickpeas', origin: 'Fire-roasted with smoked paprika & sea salt' }
    ]
  },
  {
    id: 'wild-salmon-asparagus',
    name: 'Glazed Wild Alaskan Salmon',
    chefTag: 'WILD CATCH // MAIN 02',
    categoryName: 'Post-Workout Restoration & Omega-3s',
    calories: '520 kcal',
    prepTime: '12 mins',
    price: 740,
    headline: 'Pan-seared crisp-skin fillet with charred tenderstem asparagus & lentils',
    image: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?auto=format&fit=crop&w=1200&q=85',
    pairing: {
      name: 'Sparkling Bergamot White Tea',
      note: 'Cold fermented sparkling botanical',
      price: '₹320'
    },
    macros: {
      protein: '42g',
      carbs: '24g',
      fat: '26g',
      fiber: '8g',
      glycemicIndex: 'Ultra-Low (GI 18)'
    },
    pins: [
      { id: 'p1', x: 46, y: 38, label: 'Wild Alaskan Salmon', origin: 'Line-caught Pacific wild salmon, high natural EPA/DHA' },
      { id: 'p2', x: 28, y: 68, label: 'Tenderstem Asparagus', origin: 'Charred over volcanic coals with pink sea salt' },
      { id: 'p3', x: 66, y: 62, label: 'French Green Puy Lentils', origin: 'Simmered slow with garden thyme & shallots' },
      { id: 'p4', x: 50, y: 52, label: 'Meyer Lemon Emulsion', origin: 'Cold-pressed extra virgin olive oil & fresh dill' }
    ]
  },
  {
    id: 'truffle-burrata-tartine',
    name: 'Truffle & Forest Chanterelle Tartine',
    chefTag: 'SLOW FERMENT // TARTINE 03',
    categoryName: 'Mindful Leisure Brunch & Artisan Sourdough',
    calories: '440 kcal',
    prepTime: '9 mins',
    price: 580,
    headline: '48hr fermented sourdough with buffalo burrata & white truffle essence',
    image: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&w=1200&q=85',
    pairing: {
      name: 'Single-Estate Geisha Pourover',
      note: 'Panama Boquete floral jasmine notes',
      price: '₹380'
    },
    macros: {
      protein: '18g',
      carbs: '38g',
      fat: '22g',
      fiber: '6g',
      glycemicIndex: 'Moderate (GI 42)'
    },
    pins: [
      { id: 'p1', x: 38, y: 44, label: 'Artisan Buffalo Burrata', origin: 'Pugliese sweet cream curd with tender mozzarella shell' },
      { id: 'p2', x: 64, y: 34, label: 'Forest Chanterelles', origin: 'Wild woodland mushrooms sautéed in grass-fed ghee' },
      { id: 'p3', x: 48, y: 74, label: '48hr Levain Sourdough', origin: 'Ancient stone-milled wheat, slow fermented crust' },
      { id: 'p4', x: 70, y: 56, label: 'White Truffle & Sorrel', origin: 'Piedmontese truffle essence & fresh micro sorrel' }
    ]
  },
  {
    id: 'ceremonial-matcha-cloud',
    name: 'Ceremonial Matcha Cloud Elixir',
    chefTag: 'UJIKIN // ELIXIR 04',
    categoryName: 'Calm Cellular Focus & L-Theanine Energy',
    calories: '140 kcal',
    prepTime: '5 mins',
    price: 360,
    headline: 'First-harvest stone-ground Uji matcha with steamed oat vanilla foam',
    image: 'https://images.unsplash.com/photo-1536256263959-770b48d82b0a?auto=format&fit=crop&w=1200&q=85',
    pairing: {
      name: 'Dark Raw Cacao Truffle',
      note: 'Peruvian 85% single-origin raw cacao',
      price: '₹180'
    },
    macros: {
      protein: '4g',
      carbs: '18g',
      fat: '5g',
      fiber: '3g',
      glycemicIndex: 'Zero Spike (GI 15)'
    },
    pins: [
      { id: 'p1', x: 50, y: 32, label: 'Madagascar Vanilla Cloud', origin: 'Cold-frothed barista oat cream with real vanilla bean' },
      { id: 'p2', x: 50, y: 56, label: 'First-Harvest Uji Matcha', origin: 'Shade-grown, granite stone-milled in Kyoto, Japan' },
      { id: 'p3', x: 42, y: 76, label: 'Alkaline Spring Water', origin: 'Ph 8.2 filtered mountain water for clean extraction' },
      { id: 'p4', x: 62, y: 70, label: 'L-Theanine Amino Acids', origin: 'Calm sustained cognitive flow without caffeine crash' }
    ]
  }
];

const PHILOSOPHY_PILLARS = [
  {
    code: '01 / OVERLOAD',
    title: 'Too many recipes create decision paralysis.',
    label: 'DECISION CLARITY',
    description: 'We eliminate overwhelming 80-item diner menus. Instead, our culinary directors present a focused seasonal palette where every ingredient is intentionally sourced.'
  },
  {
    code: '02 / PROVENANCE',
    title: 'Real organic produce changes how you feel.',
    label: '100% UNPROCESSED',
    description: 'Zero industrial seed oils, zero refined white sugars, zero synthetic binders. Every dish is seasoned with cold-pressed olive oils, organic ghee, and Celtic sea salt.'
  },
  {
    code: '03 / VITALITY',
    title: 'Food that respects your daily rhythm.',
    label: 'BIOMETRIC HARMONY',
    description: 'Whether you seek sharp cognitive focus for creative work or deep post-workout muscle restoration, every dish displays complete macronutrient clarity.'
  }
];

const FOUR_STEPS = [
  {
    step: '01',
    title: 'Define your moment',
    desc: 'Choose how you want to feel: energized for mental flow, restored after training, or grounded in a slow mindful lunch.'
  },
  {
    step: '02',
    title: 'Compare side-by-side',
    desc: 'Use our 1-click comparison tray to evaluate macros, calories, allergens, and flavor profiles between your top choices.'
  },
  {
    step: '03',
    title: 'Select dining atmosphere',
    desc: 'Reserve your curated seating in the Sunlit Solarium, the Terrace Olive Garden, or the Chef’s Intimate Tasting Alcove.'
  },
  {
    step: '04',
    title: 'Dine with pure intention',
    desc: 'Experience transparent, biodynamic dining prepared fresh to order, accompanied by single-origin roasts and elixir pairings.'
  }
];

const FAQ_ITEMS = [
  {
    q: 'How does the side-by-side dish comparison tool work?',
    a: 'Tap the "+ Compare" button on any two dishes. A floating comparison drawer opens at the bottom of your screen, displaying nutritional macros, flavor profiles, and allergen matrices side-by-side.'
  },
  {
    q: 'Are all ingredients organic and free of industrial seed oils?',
    a: '100%. We cook exclusively using extra-virgin cold-pressed olive oil, avocado oil, and grass-fed organic ghee. All produce is sourced from biodynamic regional farms without synthetic pesticides or processed sugars.'
  },
  {
    q: 'Can I book a private chef tasting or reserve a seating zone?',
    a: 'Yes. Our VIP reservation engine allows you to book curated dining tables (Indoor Solarium, Terrace Garden, or Chef’s Tasting Alcove) with instant confirmation passes.'
  }
];

export function HealthyMenuLandingApp({ onBackToVariants, onBackToCatalogue }) {
  // Ambience Palette Mode: 'sunlit' (Daylight Bistro - Default) | 'midnight' (Evening Roastery)
  const [ambience, setAmbience] = useState('sunlit');
  const isSunlit = ambience === 'sunlit';

  // Navigation & Modal States
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedDietary, setSelectedDietary] = useState('all');
  const [activeDishModal, setActiveDishModal] = useState(null);
  const [comparedDishes, setComparedDishes] = useState([]);
  const [isCompareOpen, setIsCompareOpen] = useState(false);
  const [isReservationOpen, setIsReservationOpen] = useState(false);
  const [reservationSuccess, setReservationSuccess] = useState(false);
  const [activeFaqIndex, setActiveFaqIndex] = useState(0);

  // Hero Interactive State (Visualistic Centerpiece)
  const [heroDishIdx, setHeroDishIdx] = useState(0);
  const [heroLensMode, setHeroLensMode] = useState('plated'); // 'plated' | 'deconstructed' | 'nutrition'
  const [hoveredPin, setHoveredPin] = useState(null);
  const activeHeroDish = HERO_DISHES[heroDishIdx];

  // Reservation Form State
  const [resDate, setResDate] = useState('Tomorrow');
  const [resTime, setResTime] = useState('1:00 PM');
  const [resGuests, setResGuests] = useState(2);
  const [resSeating, setResSeating] = useState('Indoor Solarium');
  const [guestName, setGuestName] = useState('Alex Morgan');
  const [guestContact, setGuestContact] = useState('+91 98765 43210');
  const [dietaryNotes, setDietaryNotes] = useState('Gluten-sensitive, prefers high-protein dishes');
  const [generatedPass, setGeneratedPass] = useState(null);

  // Comparison toggle handler
  const toggleCompare = (dish) => {
    sounds.playClick();
    setComparedDishes((prev) => {
      const exists = prev.some((d) => d.id === dish.id);
      if (exists) {
        return prev.filter((d) => d.id !== dish.id);
      }
      if (prev.length >= 2) {
        return [prev[1], dish];
      }
      return [...prev, dish];
    });
  };

  const handleReservationSubmit = (e) => {
    e.preventDefault();
    sounds.playSuccess();
    const passId = `VELOUR-${Math.floor(100000 + Math.random() * 900000)}`;
    setGeneratedPass({
      passId,
      date: resDate,
      time: resTime,
      guests: resGuests,
      seating: resSeating,
      name: guestName,
      dietaryNotes
    });
    setReservationSuccess(true);
  };

  // Filter logic
  const filteredDishes = DISHES.filter((dish) => {
    const matchesCategory = selectedCategory === 'all' || dish.category === selectedCategory;
    const matchesDietary = selectedDietary === 'all' || dish.dietary.includes(selectedDietary);
    return matchesCategory && matchesDietary;
  });

  return (
    <div className={`min-h-screen font-sans selection:bg-[#C26D38] selection:text-white overflow-x-hidden relative transition-colors duration-500 ${
      isSunlit ? 'bg-[#FBF8F4] text-[#1C1612]' : 'bg-[#120F0D] text-[#FAF7F2]'
    }`}>
      
      {/* --------------------------------------------------------------------- */}
      {/* TOP HEADER / NAVIGATION                                               */}
      {/* --------------------------------------------------------------------- */}
      <header className={`sticky top-0 inset-x-0 z-40 backdrop-blur-xl border-b py-3.5 px-4 sm:px-8 transition-colors duration-500 ${
        isSunlit 
          ? 'bg-[#FBF8F4]/90 border-[#E8DFC9]' 
          : 'bg-[#120F0D]/90 border-[#2E251E]'
      }`}>
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
          
          {/* Left Brand Identity */}
          <div className="flex items-center gap-3.5">
            <button
              onClick={() => {
                sounds.playClick();
                if (onBackToVariants) onBackToVariants();
                else if (onBackToCatalogue) onBackToCatalogue();
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-mono font-medium transition cursor-pointer border ${
                isSunlit 
                  ? 'bg-white hover:bg-[#C26D38] text-[#52443A] hover:text-white border-[#E5DBCA] hover:border-[#C26D38]' 
                  : 'bg-white/[0.04] hover:bg-[#C5A880] text-stone-300 hover:text-[#0E0C0A] border-white/10 hover:border-[#C5A880]'
              }`}
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Back to Models</span>
            </button>

            <div className={`h-4 w-px hidden md:block ${isSunlit ? 'bg-[#E5DBCA]' : 'bg-white/10'}`}></div>

            <div className="flex items-center gap-2">
              <span className={`w-2 h-2 rounded-full animate-pulse ${isSunlit ? 'bg-[#C26D38]' : 'bg-[#C5A880]'}`}></span>
              <span className={`font-mono text-xs tracking-[0.2em] uppercase font-bold ${isSunlit ? 'text-[#1C1612]' : 'text-[#FAF7F2]'}`}>
                VELOUR <span className={isSunlit ? 'text-[#C26D38]' : 'text-[#C5A880]'}>//</span> HEALTHY MENU
              </span>
            </div>
          </div>

          {/* Center Navigation Links */}
          <nav className={`hidden lg:flex items-center gap-6 font-mono text-xs ${
            isSunlit ? 'text-[#6B5A4E]' : 'text-[#D8CEBF]/70'
          }`}>
            <a href="#menu" className={`transition ${isSunlit ? 'hover:text-[#C26D38]' : 'hover:text-[#C5A880]'}`}>The Menu</a>
            <a href="#philosophy" className={`transition ${isSunlit ? 'hover:text-[#C26D38]' : 'hover:text-[#C5A880]'}`}>Philosophy</a>
            <a href="#explore" className={`transition ${isSunlit ? 'hover:text-[#C26D38]' : 'hover:text-[#C5A880]'}`}>Ways to Explore</a>
            <a href="#steps" className={`transition ${isSunlit ? 'hover:text-[#C26D38]' : 'hover:text-[#C5A880]'}`}>4 Steps</a>
            <a href="#faq" className={`transition ${isSunlit ? 'hover:text-[#C26D38]' : 'hover:text-[#C5A880]'}`}>FAQ</a>
          </nav>

          {/* Right Header Controls: Ambience Toggle & CTAs */}
          <div className="flex items-center gap-2.5">
            
            {/* Ambience Switcher (Sunlit Bistro vs Midnight Roast) */}
            <button
              onClick={() => {
                sounds.playClick();
                setAmbience(isSunlit ? 'midnight' : 'sunlit');
              }}
              title="Toggle Daylight / Evening Ambience"
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-mono transition cursor-pointer border ${
                isSunlit
                  ? 'bg-white hover:bg-[#F3ECE0] text-[#1C1612] border-[#E8DFC9] shadow-sm'
                  : 'bg-[#1C1714] hover:bg-[#28211C] text-[#FAF7F2] border-[#382E25]'
              }`}
            >
              {isSunlit ? (
                <>
                  <Sun className="w-3.5 h-3.5 text-[#C26D38]" />
                  <span className="hidden sm:inline font-semibold">Sunlit Bistro</span>
                </>
              ) : (
                <>
                  <Moon className="w-3.5 h-3.5 text-[#DFBA84]" />
                  <span className="hidden sm:inline font-semibold">Midnight Roast</span>
                </>
              )}
            </button>

            <button
              onClick={() => {
                sounds.playClick();
                const menuEl = document.getElementById('menu');
                if (menuEl) menuEl.scrollIntoView({ behavior: 'smooth' });
              }}
              className={`hidden sm:flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-mono font-bold tracking-wider uppercase transition cursor-pointer shadow-md ${
                isSunlit 
                  ? 'bg-gradient-to-r from-[#C26D38] to-[#D47E48] hover:brightness-110 text-white shadow-[0_4px_16px_rgba(194,109,56,0.25)]' 
                  : 'bg-[#C5A880] hover:bg-[#DFBA84] text-[#0E0C0A]'
              }`}
            >
              <span>Explore Menu</span>
              <ArrowDown className="w-3 h-3 rotate-[-45deg]" />
            </button>

            <button
              onClick={() => {
                sounds.playClick();
                setIsReservationOpen(true);
              }}
              className={`px-3.5 sm:px-4 py-2 rounded-full text-xs font-mono font-medium tracking-wide transition border cursor-pointer flex items-center gap-1.5 ${
                isSunlit
                  ? 'bg-white hover:bg-[#F3ECE0] text-[#1C1612] border-[#E8DFC9]'
                  : 'bg-white/[0.06] hover:bg-white/10 text-[#FAF7F2] border-white/10'
              }`}
            >
              <Calendar className={`w-3.5 h-3.5 ${isSunlit ? 'text-[#C26D38]' : 'text-[#C5A880]'}`} />
              <span className="hidden xs:inline">Book Table</span>
            </button>
          </div>

        </div>
      </header>

      {/* --------------------------------------------------------------------- */}
      {/* REDESIGNED HERO SECTION: Deeply Engaging, Creative & Visualistic       */}
      {/* --------------------------------------------------------------------- */}
      <section className="relative pt-6 sm:pt-8 pb-16 px-4 sm:px-8 max-w-7xl mx-auto space-y-6 sm:space-y-7">
        
        {/* Ambient Soft Sunlit Illumination */}
        <div className={`absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] sm:w-[1000px] h-[500px] rounded-full blur-3xl pointer-events-none -z-10 transition-colors duration-700 ${
          isSunlit 
            ? 'bg-gradient-to-b from-[#C26D38]/8 via-[#D4AF37]/5 to-transparent' 
            : 'bg-gradient-to-b from-[#C5A880]/15 via-[#DFBA84]/5 to-transparent'
        }`}></div>

        {/* 1. Vitality & Daily Rhythm Mood Switcher Ribbon (Encapsulated & Aligned Control Card) */}
        <div className={`p-2 sm:p-2.5 rounded-2xl border flex flex-col md:flex-row md:items-center justify-between gap-3 shadow-xs transition-colors ${
          isSunlit 
            ? 'bg-white border-[#E8DFC9]' 
            : 'bg-[#181411] border-[#2E251E]'
        }`}>
          <div className="flex items-center gap-2 pl-2">
            <Sparkles className={`w-4 h-4 ${isSunlit ? 'text-[#C26D38]' : 'text-[#C5A880]'}`} />
            <span className={`font-mono text-xs uppercase tracking-widest font-bold ${
              isSunlit ? 'text-[#1C1612]' : 'text-[#FAF7F2]'
            }`}>
              SELECT YOUR RHYTHM:
            </span>
            <span className={`hidden sm:inline text-xs font-sans ${
              isSunlit ? 'text-[#7D6E63]' : 'text-[#D8CEBF]/70'
            }`}>
              Tailored culinary craft for your daily rhythm
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-1.5">
            {[
              { label: 'Midday Focus', idx: 0, fullLabel: 'Midday Cognitive Focus' },
              { label: 'Post-Workout', idx: 1, fullLabel: 'Post-Workout Recovery' },
              { label: 'Weekend Brunch', idx: 2, fullLabel: 'Leisure Weekend Brunch' },
              { label: 'Antioxidant Reset', idx: 3, fullLabel: 'Antioxidant Reset' }
            ].map((mood) => (
              <button
                key={mood.idx}
                onClick={() => {
                  sounds.playClick();
                  setHeroDishIdx(mood.idx);
                }}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-mono transition cursor-pointer border ${
                  heroDishIdx === mood.idx
                    ? isSunlit
                      ? 'bg-[#C26D38] text-white border-[#C26D38] font-bold shadow-xs'
                      : 'bg-[#C5A880] text-[#120F0D] border-[#C5A880] font-bold shadow-xs'
                    : isSunlit
                      ? 'bg-[#FAF8F5] hover:bg-[#F3ECE0] text-[#5C4D42] border-[#E8DFC9]'
                      : 'bg-[#1F1A15] hover:bg-[#26201B] text-[#D8CEBF]/70 border-[#2E251E]'
                }`}
                title={mood.fullLabel}
              >
                {mood.label}
              </button>
            ))}
          </div>
        </div>

        {/* 2. Main Asymmetrical Editorial Composition (Top-Aligned Baseline) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
          
          {/* Left Column: Narrative, Accolades & Actions (6 cols) */}
          <div className="lg:col-span-6 space-y-6 text-left">
            
            {/* Atelier Micro Badge (Height-matched with right lens switcher) */}
            <div className={`h-11 inline-flex items-center gap-2.5 px-4 rounded-full text-[11px] font-mono tracking-widest uppercase border shadow-xs ${
              isSunlit 
                ? 'bg-white border-[#E8DFC9] text-[#3B5038]' 
                : 'bg-[#161311] border-[#2E251E] text-[#C5A880]'
            }`}>
              <Leaf className={`w-3.5 h-3.5 ${isSunlit ? 'text-[#3B5038]' : 'text-[#C5A880]'}`} />
              <span>100% BIODYNAMIC • ZERO SEED OILS • MINDFUL VITALITY</span>
            </div>

            {/* Monumental Editorial Headline */}
            <h1 className={`font-serif text-4xl sm:text-6xl lg:text-[66px] font-bold tracking-tight leading-[1.05] ${
              isSunlit ? 'text-[#1C1612]' : 'text-[#FAF7F2]'
            }`}>
              Discover dishes that{' '}
              <span className={`italic font-normal ${
                isSunlit 
                  ? 'text-transparent bg-clip-text bg-gradient-to-r from-[#C26D38] via-[#B25C26] to-[#D47E48]' 
                  : 'text-transparent bg-clip-text bg-gradient-to-r from-[#DFBA84] via-[#FAF7F2] to-[#C5A880]'
              }`}>
                fit your routine
              </span>.
            </h1>

            {/* Subhead Narrative */}
            <p className={`max-w-xl text-base sm:text-lg font-sans leading-relaxed ${
              isSunlit ? 'text-[#52443A]' : 'text-[#D8CEBF]/85'
            }`}>
              Between crowded menus and clinical diets, dining has lost its soul. Velour reimagines gastronomy through transparent culinary craft, biodynamic ingredients, and dishes composed for real mindful vitality.
            </p>

            {/* Dual CTAs & Social Proof */}
            <div className="space-y-5 pt-1">
              <div className="flex flex-wrap items-center gap-3">
                <a
                  href="#menu"
                  onClick={() => sounds.playClick()}
                  className={`px-7 py-3.5 rounded-full font-mono font-bold text-xs tracking-widest uppercase flex items-center gap-2 transition-all shadow-md hover:-translate-y-0.5 active:translate-y-0 cursor-pointer ${
                    isSunlit 
                      ? 'bg-gradient-to-r from-[#C26D38] via-[#D47E48] to-[#C26D38] hover:brightness-110 text-white shadow-[0_6px_24px_rgba(194,109,56,0.3)]' 
                      : 'bg-gradient-to-r from-[#C5A880] via-[#DFBA84] to-[#C5A880] hover:brightness-110 text-[#0E0C0A] shadow-[0_4px_24px_rgba(197,168,128,0.35)]'
                  }`}
                >
                  <span>Explore The Menu</span>
                  <ArrowRight className="w-4 h-4" />
                </a>

                <button
                  onClick={() => {
                    sounds.playClick();
                    setIsReservationOpen(true);
                  }}
                  className={`px-6 py-3.5 rounded-full font-mono font-semibold text-xs tracking-wider uppercase transition cursor-pointer flex items-center gap-2 border ${
                    isSunlit 
                      ? 'bg-white hover:bg-[#F3ECE0] text-[#1C1612] border-[#E8DFC9] shadow-sm' 
                      : 'bg-[#161311] hover:bg-[#1F1A15] text-[#FAF7F2] border-[#2E251E]'
                  }`}
                >
                  <Calendar className={`w-4 h-4 ${isSunlit ? 'text-[#C26D38]' : 'text-[#C5A880]'}`} />
                  <span>Reserve Tasting Table</span>
                </button>
              </div>

              {/* Social Proof & Gastronomy Accolades */}
              <div className="flex items-center gap-3.5 pt-1 text-xs">
                <div className="flex -space-x-2">
                  {[
                    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80',
                    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80',
                    'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=120&q=80'
                  ].map((src, i) => (
                    <img key={i} src={src} alt="Guest" className={`w-7 h-7 rounded-full border-2 object-cover ${
                      isSunlit ? 'border-white' : 'border-[#120F0D]'
                    }`} />
                  ))}
                </div>
                <div className={`flex items-center gap-2 font-mono text-[11px] ${
                  isSunlit ? 'text-[#5C4D42]' : 'text-[#D8CEBF]/75'
                }`}>
                  <span className={`font-bold ${isSunlit ? 'text-[#C26D38]' : 'text-[#DFBA84]'}`}>4.95 / 5.0</span>
                  <span>•</span>
                  <span>1,400+ Curated Tastings</span>
                  <span>•</span>
                  <span className={`font-semibold ${isSunlit ? 'text-[#3B5038]' : 'text-[#C5A880]'}`}>38 reserved today</span>
                </div>
              </div>
            </div>

          </div>

          {/* Right Column: Interactive Visual Platter Centerpiece (6 cols) */}
          <div className="lg:col-span-6 space-y-3">
            
            {/* 3-Mode Lens Switcher: Plated vs Deconstructed vs Nutrition (Height-matched h-11) */}
            <div className={`h-11 px-2 rounded-2xl flex items-center justify-between border transition ${
              isSunlit 
                ? 'bg-white border-[#E8DFC9] shadow-xs' 
                : 'bg-[#181411] border-[#2E251E]'
            }`}>
              <div className="flex items-center gap-1">
                {[
                  { id: 'plated', label: 'Plated Dish', icon: Eye },
                  { id: 'deconstructed', label: 'Deconstructed Sourcing', icon: MapPin },
                  { id: 'nutrition', label: 'Macro Breakdown', icon: Activity }
                ].map((tab) => {
                  const Icon = tab.icon;
                  const isActive = heroLensMode === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => {
                        sounds.playClick();
                        setHeroLensMode(tab.id);
                      }}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-mono transition cursor-pointer ${
                        isActive
                          ? isSunlit 
                            ? 'bg-[#C26D38] text-white font-bold shadow-sm' 
                            : 'bg-[#C5A880] text-[#120F0D] font-bold shadow-sm'
                          : isSunlit 
                            ? 'text-[#66574D] hover:bg-[#F5EFE6]' 
                            : 'text-[#D8CEBF]/70 hover:bg-white/5'
                      }`}
                    >
                      <Icon className="w-3.5 h-3.5" />
                      <span className="hidden xs:inline">{tab.label}</span>
                    </button>
                  );
                })}
              </div>

              <span className={`font-mono text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-md ${
                isSunlit ? 'bg-[#F3ECE0] text-[#7D6E63]' : 'bg-[#221B16] text-[#C5A880]'
              }`}>
                {activeHeroDish.prepTime}
              </span>
            </div>

            {/* Main Interactive Visual Platter Card */}
            <div className={`relative rounded-[32px] overflow-hidden border p-3.5 transition duration-500 shadow-xl ${
              isSunlit 
                ? 'bg-white border-[#E8DFC9] shadow-[0_20px_50px_rgba(45,30,20,0.08)]' 
                : 'bg-[#161311] border-[#2E251E] shadow-[0_20px_50px_rgba(0,0,0,0.6)]'
            }`}>
              
              <div className="relative h-[380px] sm:h-[440px] rounded-[24px] overflow-hidden bg-black/5">
                
                {/* Culinary Image with Cross-Fade Motion */}
                <AnimatePresence mode="wait">
                  <motion.img
                    key={activeHeroDish.id}
                    src={activeHeroDish.image}
                    alt={activeHeroDish.name}
                    initial={{ opacity: 0, scale: 1.06 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.96 }}
                    transition={{ duration: 0.45 }}
                    className="w-full h-full object-cover"
                  />
                </AnimatePresence>

                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent pointer-events-none"></div>

                {/* Top Floating Badge Bar */}
                <div className="absolute top-4 left-4 right-4 flex items-center justify-between pointer-events-none">
                  <span className="px-3 py-1 rounded-full bg-black/75 backdrop-blur-md border border-white/20 text-[10px] font-mono text-[#FAF7F2] font-semibold tracking-wider uppercase">
                    {activeHeroDish.chefTag}
                  </span>
                  <span className="px-3 py-1 rounded-full bg-[#C26D38] text-white text-xs font-mono font-bold shadow-md">
                    ₹{activeHeroDish.price}
                  </span>
                </div>

                {/* VIEW 1: PLATED DISH VIEW (Sommelier Pairing Capsule) */}
                {heroLensMode === 'plated' && (
                  <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="absolute top-16 right-4 max-w-[200px] p-2.5 rounded-2xl bg-black/75 backdrop-blur-md border border-white/15 text-left text-white space-y-1 shadow-lg"
                  >
                    <span className="font-mono text-[9px] text-[#DFBA84] uppercase tracking-wider block">
                      SOMMELIER PAIRING
                    </span>
                    <p className="font-serif font-bold text-xs leading-tight">
                      {activeHeroDish.pairing.name}
                    </p>
                    <p className="text-[10px] text-white/70 leading-tight">
                      {activeHeroDish.pairing.note}
                    </p>
                  </motion.div>
                )}

                {/* VIEW 2: DECONSTRUCTED SOURCING HOTSPOT PINS */}
                {heroLensMode === 'deconstructed' && (
                  <div className="absolute inset-0 pointer-events-auto">
                    {activeHeroDish.pins.map((pin, i) => (
                      <div
                        key={pin.id}
                        style={{ left: `${pin.x}%`, top: `${pin.y}%` }}
                        className="absolute -translate-x-1/2 -translate-y-1/2 z-20 group"
                        onMouseEnter={() => {
                          sounds.playClick();
                          setHoveredPin(pin);
                        }}
                        onMouseLeave={() => setHoveredPin(null)}
                      >
                        {/* Glowing Pulsing Ring */}
                        <span className="absolute -inset-2 rounded-full bg-[#C26D38]/40 animate-ping"></span>
                        
                        <button
                          onClick={() => {
                            sounds.playClick();
                            setHoveredPin(pin);
                          }}
                          className="relative w-8 h-8 rounded-full bg-[#C26D38] text-white font-mono text-xs font-bold flex items-center justify-center border-2 border-white shadow-xl hover:scale-110 transition cursor-pointer"
                        >
                          0{i + 1}
                        </button>

                        {/* Interactive Tooltip Card */}
                        <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 w-52 p-3 rounded-xl bg-black/90 backdrop-blur-xl border border-white/20 text-white text-left opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-30 shadow-2xl">
                          <p className="font-serif font-bold text-xs text-[#DFBA84]">{pin.label}</p>
                          <p className="text-[10px] text-white/80 font-sans mt-0.5 leading-snug">{pin.origin}</p>
                        </div>
                      </div>
                    ))}

                    <div className="absolute top-16 left-4 px-3 py-1.5 rounded-xl bg-black/80 backdrop-blur-md border border-white/15 text-[10px] font-mono text-white">
                      Hover or tap pins 01–04 to inspect provenance
                    </div>
                  </div>
                )}

                {/* VIEW 3: NUTRITION & MACRO ARCHITECTURE */}
                {heroLensMode === 'nutrition' && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="absolute inset-4 rounded-2xl bg-black/85 backdrop-blur-xl border border-white/20 p-5 flex flex-col justify-between text-white"
                  >
                    <div className="space-y-1">
                      <span className="font-mono text-[10px] text-[#DFBA84] uppercase tracking-wider">
                        NUTRITIONAL ARCHITECTURE // 100% TRANSPARENT
                      </span>
                      <h4 className="font-serif font-bold text-lg text-white">
                        {activeHeroDish.name}
                      </h4>
                      <p className="text-xs text-white/70">
                        {activeHeroDish.headline}
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-3 font-mono text-xs">
                      <div className="p-3 rounded-xl bg-white/5 border border-white/10 space-y-1">
                        <span className="text-[10px] text-white/60">PROTEIN RATIO</span>
                        <p className="text-lg font-bold text-[#DFBA84]">{activeHeroDish.macros.protein}</p>
                        <div className="h-1.5 rounded-full bg-white/10 overflow-hidden">
                          <div className="h-full bg-[#C26D38] rounded-full w-[70%]"></div>
                        </div>
                      </div>
                      <div className="p-3 rounded-xl bg-white/5 border border-white/10 space-y-1">
                        <span className="text-[10px] text-white/60">CLEAN HEALTHY FATS</span>
                        <p className="text-lg font-bold text-[#DFBA84]">{activeHeroDish.macros.fat}</p>
                        <div className="h-1.5 rounded-full bg-white/10 overflow-hidden">
                          <div className="h-full bg-[#DFBA84] rounded-full w-[45%]"></div>
                        </div>
                      </div>
                      <div className="p-3 rounded-xl bg-white/5 border border-white/10 space-y-1">
                        <span className="text-[10px] text-white/60">COMPLEX CARBS</span>
                        <p className="text-lg font-bold text-white">{activeHeroDish.macros.carbs}</p>
                        <p className="text-[9px] text-white/50">Low-Glycemic slow release</p>
                      </div>
                      <div className="p-3 rounded-xl bg-white/5 border border-white/10 space-y-1">
                        <span className="text-[10px] text-white/60">GLYCEMIC INDEX</span>
                        <p className="text-sm font-bold text-[#3B5038]">{activeHeroDish.macros.glycemicIndex}</p>
                        <p className="text-[9px] text-white/50">Zero energy crash</p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-[10px] font-mono text-white/60 border-t border-white/10 pt-2">
                      <span>Total Caloric Density: <strong className="text-white">{activeHeroDish.calories}</strong></span>
                      <span className="text-[#DFBA84]">Zero Industrial Seed Oils</span>
                    </div>
                  </motion.div>
                )}

                {/* Bottom Floating Details Bar */}
                <div className="absolute bottom-3 inset-x-3 p-3.5 rounded-2xl bg-black/75 backdrop-blur-xl border border-white/15 text-white">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="font-serif font-bold text-base sm:text-lg leading-tight">
                      {activeHeroDish.name}
                    </h3>
                    <span className="font-mono text-xs font-bold text-[#DFBA84] shrink-0">
                      {activeHeroDish.calories}
                    </span>
                  </div>
                  <p className="text-[11px] text-white/80 font-sans line-clamp-1 mt-0.5">
                    {activeHeroDish.headline}
                  </p>
                </div>

              </div>

              {/* 3. Taste Flight Horizontal Mini Gallery Ribbon */}
              <div className="grid grid-cols-4 gap-2 mt-3 pt-1">
                {HERO_DISHES.map((dish, idx) => (
                  <button
                    key={dish.id}
                    onClick={() => {
                      sounds.playClick();
                      setHeroDishIdx(idx);
                    }}
                    className={`p-1.5 rounded-xl flex flex-col items-center text-center transition cursor-pointer border ${
                      heroDishIdx === idx
                        ? isSunlit 
                          ? 'bg-[#F4ECE2] border-[#C26D38] shadow-sm ring-1 ring-[#C26D38]' 
                          : 'bg-[#26201B] border-[#C5A880] shadow-sm'
                        : isSunlit 
                          ? 'bg-white hover:bg-[#FAF7F2] border-[#E8DFC9]' 
                          : 'bg-[#1C1714] hover:bg-[#241E1A] border-[#2E251E]'
                    }`}
                  >
                    <img src={dish.image} alt={dish.name} className="w-10 h-10 rounded-lg object-cover mb-1 shadow-sm" />
                    <span className={`text-[10px] font-mono uppercase font-bold truncate max-w-full ${
                      isSunlit ? 'text-[#1C1612]' : 'text-white'
                    }`}>
                      0{idx + 1} {dish.id === 'mediterranean-bowl' ? 'Harvest' : dish.id === 'wild-salmon-asparagus' ? 'Salmon' : dish.id === 'truffle-burrata-tartine' ? 'Burrata' : 'Matcha'}
                    </span>
                    <span className={`text-[9px] font-mono ${
                      isSunlit ? 'text-[#C26D38]' : 'text-[#DFBA84]'
                    }`}>
                      ₹{dish.price}
                    </span>
                  </button>
                ))}
              </div>

            </div>

          </div>

        </div>

        {/* 4-Pillar Culinary Trust Telemetry Grid */}
        <div className={`grid grid-cols-2 sm:grid-cols-4 gap-3.5 pt-4 border-t ${
          isSunlit ? 'border-[#E8DFC9]' : 'border-[#2E251E]'
        }`}>
          <div className={`p-4 rounded-2xl border text-left space-y-1 transition ${
            isSunlit 
              ? 'bg-white border-[#E8DFC9] hover:border-[#C26D38]/40 shadow-sm' 
              : 'bg-[#161311] border-[#2E251E] hover:border-[#C5A880]/40'
          }`}>
            <span className={`font-mono text-[10px] tracking-wider uppercase font-semibold ${
              isSunlit ? 'text-[#C26D38]' : 'text-[#C5A880]'
            }`}>01 // SOURCING</span>
            <p className={`font-serif font-bold text-base ${isSunlit ? 'text-[#1C1612]' : 'text-[#FAF7F2]'}`}>100% Biodynamic</p>
            <p className={`text-[11px] font-sans ${isSunlit ? 'text-[#7D6E63]' : 'text-[#D8CEBF]/60'}`}>Organic regional farm fresh</p>
          </div>
          <div className={`p-4 rounded-2xl border text-left space-y-1 transition ${
            isSunlit 
              ? 'bg-white border-[#E8DFC9] hover:border-[#C26D38]/40 shadow-sm' 
              : 'bg-[#161311] border-[#2E251E] hover:border-[#C5A880]/40'
          }`}>
            <span className={`font-mono text-[10px] tracking-wider uppercase font-semibold ${
              isSunlit ? 'text-[#C26D38]' : 'text-[#C5A880]'
            }`}>02 // PURITY</span>
            <p className={`font-serif font-bold text-base ${isSunlit ? 'text-[#1C1612]' : 'text-[#FAF7F2]'}`}>Zero Seed Oils</p>
            <p className={`text-[11px] font-sans ${isSunlit ? 'text-[#7D6E63]' : 'text-[#D8CEBF]/60'}`}>Cold-pressed EVOO &amp; ghee</p>
          </div>
          <div className={`p-4 rounded-2xl border text-left space-y-1 transition ${
            isSunlit 
              ? 'bg-white border-[#E8DFC9] hover:border-[#C26D38]/40 shadow-sm' 
              : 'bg-[#161311] border-[#2E251E] hover:border-[#C5A880]/40'
          }`}>
            <span className={`font-mono text-[10px] tracking-wider uppercase font-semibold ${
              isSunlit ? 'text-[#C26D38]' : 'text-[#C5A880]'
            }`}>03 // NUTRITION</span>
            <p className={`font-serif font-bold text-base ${isSunlit ? 'text-[#1C1612]' : 'text-[#FAF7F2]'}`}>Transparent Macros</p>
            <p className={`text-[11px] font-sans ${isSunlit ? 'text-[#7D6E63]' : 'text-[#D8CEBF]/60'}`}>Caloric &amp; protein clarity</p>
          </div>
          <div className={`p-4 rounded-2xl border text-left space-y-1 transition ${
            isSunlit 
              ? 'bg-white border-[#E8DFC9] hover:border-[#C26D38]/40 shadow-sm' 
              : 'bg-[#161311] border-[#2E251E] hover:border-[#C5A880]/40'
          }`}>
            <span className={`font-mono text-[10px] tracking-wider uppercase font-semibold ${
              isSunlit ? 'text-[#C26D38]' : 'text-[#C5A880]'
            }`}>04 // TASTING</span>
            <p className={`font-serif font-bold text-base ${isSunlit ? 'text-[#1C1612]' : 'text-[#FAF7F2]'}`}>VIP Dining Room</p>
            <p className={`text-[11px] font-sans ${isSunlit ? 'text-[#7D6E63]' : 'text-[#D8CEBF]/60'}`}>Curated seat reservations</p>
          </div>
        </div>

      </section>

      {/* --------------------------------------------------------------------- */}
      {/* CONTINUOUS TICKER MARQUEE                                             */}
      {/* --------------------------------------------------------------------- */}
      <div className={`py-3.5 border-y overflow-hidden whitespace-nowrap transition-colors duration-500 ${
        isSunlit 
          ? 'bg-[#F3ECE0] border-[#E5DBCA] text-[#C26D38]' 
          : 'bg-[#161311] border-[#2E251E] text-[#C5A880]'
      }`}>
        <div className="inline-flex gap-8 items-center font-mono text-xs tracking-[0.25em] uppercase font-bold animate-marquee">
          <span>• SEASONAL HARVEST</span>
          <span>• COLD-PRESSED ELIXIRS</span>
          <span>• REFINED ARTISAN GRAINS</span>
          <span>• ZERO REFINED SUGARS</span>
          <span>• LOW GLYCEMIC COGNITIVE FOCUS</span>
          <span>• SINGLE-ORIGIN ROASTS</span>
          <span>• BIODYNAMIC BOTANICALS</span>
          <span>• SEASONAL HARVEST</span>
          <span>• COLD-PRESSED ELIXIRS</span>
          <span>• REFINED ARTISAN GRAINS</span>
        </div>
      </div>

      {/* --------------------------------------------------------------------- */}
      {/* PHILOSOPHY / CONTEXT PILLARS                                          */}
      {/* --------------------------------------------------------------------- */}
      <section id="philosophy" className="py-24 px-4 sm:px-8 max-w-6xl mx-auto space-y-12">
        <div className="space-y-3 text-center sm:text-left">
          <span className={`font-mono text-xs tracking-[0.2em] uppercase font-semibold ${
            isSunlit ? 'text-[#C26D38]' : 'text-[#C5A880]'
          }`}>
            THE PHILOSOPHY
          </span>
          <h2 className={`font-serif text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight ${
            isSunlit ? 'text-[#1C1612]' : 'text-[#FAF7F2]'
          }`}>
            It is not about rigid diets. It is about finding what fits real life.
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {PHILOSOPHY_PILLARS.map((p) => (
            <div
              key={p.code}
              className={`p-8 rounded-[28px] border transition-all duration-500 space-y-4 relative group ${
                isSunlit 
                  ? 'bg-white border-[#E8DFC9] hover:border-[#C26D38]/50 shadow-sm' 
                  : 'bg-gradient-to-b from-[#161311] to-[#0E0C0A] border-[#2E251E] hover:border-[#C5A880]/40'
              }`}
            >
              <div className={`flex items-center justify-between pb-3 border-b ${
                isSunlit ? 'border-[#E8DFC9]' : 'border-[#2E251E]'
              }`}>
                <span className={`font-mono text-2xl font-bold ${
                  isSunlit ? 'text-[#C26D38]' : 'text-[#C5A880]'
                }`}>{p.code}</span>
                <span className={`font-mono text-[10px] tracking-widest uppercase px-2.5 py-0.5 rounded-full border ${
                  isSunlit 
                    ? 'bg-[#F9ECE0] text-[#C26D38] border-[#EADFD3]' 
                    : 'bg-[#C5A880]/10 text-[#C5A880] border-[#C5A880]/20'
                }`}>
                  {p.label}
                </span>
              </div>
              <h3 className={`font-serif text-xl font-semibold leading-snug transition-colors ${
                isSunlit 
                  ? 'text-[#1C1612] group-hover:text-[#C26D38]' 
                  : 'text-[#FAF7F2] group-hover:text-[#C5A880]'
              }`}>
                {p.title}
              </h3>
              <p className={`text-xs font-sans leading-relaxed ${
                isSunlit ? 'text-[#5C4D42]' : 'text-[#D8CEBF]/75'
              }`}>
                {p.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* --------------------------------------------------------------------- */}
      {/* FEATURED VISUAL DISH SHOWCASE: "A Menu That Begins with the Eyes"     */}
      {/* --------------------------------------------------------------------- */}
      <section className="py-16 px-4 sm:px-8 max-w-7xl mx-auto space-y-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="space-y-2">
            <span className={`font-mono text-xs tracking-[0.2em] uppercase font-semibold ${
              isSunlit ? 'text-[#C26D38]' : 'text-[#C5A880]'
            }`}>
              SIGNATURE INSPIRATION
            </span>
            <h2 className={`font-serif text-3xl sm:text-5xl font-bold tracking-tight ${
              isSunlit ? 'text-[#1C1612]' : 'text-[#FAF7F2]'
            }`}>
              A menu that begins with the eyes.
            </h2>
            <p className={`text-xs sm:text-sm font-sans max-w-xl ${
              isSunlit ? 'text-[#5C4D42]' : 'text-[#D8CEBF]/70'
            }`}>
              Browse dishes curated to compare ingredients, flavor palettes, and energy profiles. Tap any dish to inspect or compare side-by-side.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className={`text-xs font-mono ${isSunlit ? 'text-[#7D6E63]' : 'text-[#D8CEBF]/60'}`}>
              {comparedDishes.length}/2 dishes selected for comparison
            </span>
            {comparedDishes.length > 0 && (
              <button
                onClick={() => {
                  sounds.playClick();
                  setIsCompareOpen(true);
                }}
                className={`px-3.5 py-1.5 rounded-full font-mono text-xs font-bold uppercase tracking-wider flex items-center gap-1 cursor-pointer ${
                  isSunlit 
                    ? 'bg-[#C26D38] text-white shadow-sm' 
                    : 'bg-[#C5A880] text-[#0E0C0A]'
                }`}
              >
                <span>Compare Now</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            )}
          </div>
        </div>

        {/* Horizontal Carousel Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {DISHES.map((dish) => {
            const isCompared = comparedDishes.some((d) => d.id === dish.id);

            return (
              <div
                key={dish.id}
                className={`group rounded-[28px] overflow-hidden border transition-all duration-500 flex flex-col justify-between shadow-lg ${
                  isSunlit 
                    ? isCompared
                      ? 'bg-white border-[#C26D38] ring-2 ring-[#C26D38]/30 shadow-xl'
                      : 'bg-white border-[#E8DFC9] hover:border-[#C26D38]/50 hover:shadow-xl'
                    : isCompared
                      ? 'bg-[#161311] border-[#C5A880] ring-1 ring-[#C5A880]/50 shadow-[0_0_30px_rgba(197,168,128,0.15)]'
                      : 'bg-[#161311] border-[#2E251E] hover:border-[#C5A880]/50'
                }`}
              >
                {/* Visual Image Header with Macro Pills */}
                <div className="relative aspect-[16/11] overflow-hidden bg-black/10">
                  <img
                    src={dish.image}
                    alt={dish.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent pointer-events-none"></div>

                  {/* Top Floating Badge */}
                  <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                    <span className="px-2.5 py-1 rounded-full bg-black/75 backdrop-blur-md border border-white/20 text-[10px] font-mono text-white font-semibold tracking-wider uppercase">
                      {dish.dietary[0]}
                    </span>

                    <button
                      onClick={() => toggleCompare(dish)}
                      className={`px-3 py-1 rounded-full text-[10px] font-mono font-bold tracking-wider uppercase transition cursor-pointer flex items-center gap-1.5 shadow-md ${
                        isCompared
                          ? isSunlit 
                            ? 'bg-[#C26D38] text-white' 
                            : 'bg-[#C5A880] text-[#0E0C0A]'
                          : 'bg-black/75 hover:bg-black/90 text-white border border-white/20'
                      }`}
                    >
                      <Layers className="w-3 h-3" />
                      <span>{isCompared ? 'Comparing' : '+ Compare'}</span>
                    </button>
                  </div>

                  {/* Bottom Macro Bar */}
                  <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between font-mono text-[10px] text-white pointer-events-none">
                    <span className="px-2.5 py-1 rounded-xl bg-black/75 backdrop-blur-md border border-white/20">
                      {dish.calories} kcal
                    </span>
                    <span className={`px-2.5 py-1 rounded-xl bg-black/75 backdrop-blur-md border font-bold ${
                      isSunlit ? 'border-[#DFBA84] text-[#DFBA84]' : 'border-[#C5A880]/40 text-[#C5A880]'
                    }`}>
                      {dish.macros.protein}g Protein
                    </span>
                  </div>
                </div>

                {/* Dish Information */}
                <div className="p-6 space-y-3 flex-grow flex flex-col justify-between">
                  <div className="space-y-1">
                    <div className="flex items-baseline justify-between gap-2">
                      <h3 className={`font-serif text-xl font-bold leading-snug transition-colors ${
                        isSunlit 
                          ? 'text-[#1C1612] group-hover:text-[#C26D38]' 
                          : 'text-[#FAF7F2] group-hover:text-[#C5A880]'
                      }`}>
                        {dish.name}
                      </h3>
                      <span className={`font-mono text-sm font-bold shrink-0 ${
                        isSunlit ? 'text-[#C26D38]' : 'text-[#C5A880]'
                      }`}>
                        ₹{dish.price}
                      </span>
                    </div>
                    <p className={`text-[11px] font-mono line-clamp-1 ${
                      isSunlit ? 'text-[#7D6E63]' : 'text-[#D8CEBF]/70'
                    }`}>
                      {dish.tagline}
                    </p>
                  </div>

                  <p className={`text-xs font-sans line-clamp-2 leading-relaxed ${
                    isSunlit ? 'text-[#5C4D42]' : 'text-[#D8CEBF]/80'
                  }`}>
                    {dish.description}
                  </p>

                  <div className={`flex flex-wrap gap-1.5 pt-1 border-t ${
                    isSunlit ? 'border-[#E8DFC9]' : 'border-[#2E251E]'
                  }`}>
                    {dish.dietary.map((tag) => (
                      <span
                        key={tag}
                        className={`text-[9px] font-mono px-2 py-0.5 rounded-md ${
                          isSunlit ? 'bg-[#F3ECE0] text-[#5C4D42]' : 'bg-[#1F1A15] text-[#D8CEBF]/60'
                        }`}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  <div className="pt-2 grid grid-cols-2 gap-2">
                    <button
                      onClick={() => {
                        sounds.playClick();
                        setActiveDishModal(dish);
                      }}
                      className={`py-2 px-3 rounded-xl text-xs font-mono font-semibold uppercase tracking-wider transition flex items-center justify-center gap-1 cursor-pointer border ${
                        isSunlit 
                          ? 'bg-white hover:bg-[#F3ECE0] text-[#1C1612] border-[#E8DFC9]' 
                          : 'bg-[#1F1A15] hover:bg-[#28211C] text-[#FAF7F2] border-[#2E251E]'
                      }`}
                    >
                      <Eye className={`w-3.5 h-3.5 ${isSunlit ? 'text-[#C26D38]' : 'text-[#C5A880]'}`} />
                      <span>Inspect</span>
                    </button>

                    <button
                      onClick={() => {
                        sounds.playClick();
                        toggleCompare(dish);
                      }}
                      className={`py-2 px-3 rounded-xl text-xs font-mono font-bold uppercase tracking-wider transition flex items-center justify-center gap-1 cursor-pointer shadow-sm ${
                        isCompared
                          ? isSunlit 
                            ? 'bg-[#C26D38] text-white' 
                            : 'bg-[#C5A880] text-[#0E0C0A]'
                          : isSunlit 
                            ? 'bg-[#F3ECE0] hover:bg-[#C26D38] text-[#1C1612] hover:text-white' 
                            : 'bg-white/10 hover:bg-white/15 text-white'
                      }`}
                    >
                      <Layers className="w-3.5 h-3.5" />
                      <span>{isCompared ? 'Added' : 'Compare'}</span>
                    </button>
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      </section>

      {/* --------------------------------------------------------------------- */}
      {/* THREE WAYS TO EXPLORE                                                 */}
      {/* --------------------------------------------------------------------- */}
      <section id="explore" className="py-20 px-4 sm:px-8 max-w-7xl mx-auto space-y-12">
        <div className="space-y-3 text-center sm:text-left">
          <span className={`font-mono text-xs tracking-[0.2em] uppercase font-semibold ${
            isSunlit ? 'text-[#C26D38]' : 'text-[#C5A880]'
          }`}>
            WAYS TO EXPLORE
          </span>
          <h2 className={`font-serif text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight ${
            isSunlit ? 'text-[#1C1612]' : 'text-[#FAF7F2]'
          }`}>
            One menu, three perspectives.
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              num: '01',
              title: 'Discovery',
              tag: 'UNEXPECTED PAIRINGS',
              desc: 'Rare grains, wild chanterelles, and floral cold brews that awaken your palate beyond the usual routines.',
              img: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=800&q=80'
            },
            {
              num: '02',
              title: 'Rhythm',
              tag: 'EVERYDAY COMFORT',
              desc: 'Balanced, restorative nourishment designed to anchor your workday without brain fog or insulin spikes.',
              img: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?auto=format&fit=crop&w=800&q=80'
            },
            {
              num: '03',
              title: 'Expression',
              tag: 'VIBRANT TEXTURES',
              desc: 'High-contrast plant pigments, sourdough crunches, and velvet tahini creams that make eating mindful and joyous.',
              img: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&w=800&q=80'
            }
          ].map((card) => (
            <div
              key={card.num}
              className={`group relative rounded-[28px] overflow-hidden border transition-all duration-500 flex flex-col justify-between shadow-lg ${
                isSunlit 
                  ? 'bg-white border-[#E8DFC9] hover:border-[#C26D38]/50 shadow-md' 
                  : 'bg-[#161311] border-[#2E251E] hover:border-[#C5A880]/50'
              }`}
            >
              <div className="relative h-60 overflow-hidden">
                <img
                  src={card.img}
                  alt={card.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
                <span className="absolute top-4 left-4 font-mono text-xs font-bold px-3 py-1 rounded-full bg-black/75 backdrop-blur-md border border-white/20 text-white">
                  PERSPECTIVE // {card.num}
                </span>
                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <h3 className="font-serif text-2xl font-bold">{card.title}</h3>
                  <p className="font-mono text-[11px] text-[#DFBA84] tracking-wider mt-0.5">{card.tag}</p>
                </div>
              </div>

              <div className="p-6 space-y-4 flex-grow flex flex-col justify-between">
                <p className={`text-xs font-sans leading-relaxed ${
                  isSunlit ? 'text-[#5C4D42]' : 'text-[#D8CEBF]/80'
                }`}>
                  {card.desc}
                </p>

                <div className={`pt-3 border-t ${isSunlit ? 'border-[#E8DFC9]' : 'border-[#2E251E]'}`}>
                  <button
                    onClick={() => {
                      sounds.playClick();
                      const menuEl = document.getElementById('menu');
                      if (menuEl) menuEl.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className={`inline-flex items-center gap-1.5 text-xs font-mono font-bold transition-colors cursor-pointer ${
                      isSunlit ? 'text-[#1C1612] hover:text-[#C26D38]' : 'text-[#FAF7F2] hover:text-[#C5A880]'
                    }`}
                  >
                    <span>Explore this direction</span>
                    <ChevronRight className={`w-3.5 h-3.5 ${isSunlit ? 'text-[#C26D38]' : 'text-[#C5A880]'}`} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* --------------------------------------------------------------------- */}
      {/* CURATED MENU BROWSER & DIETARY FILTER ENGINE                          */}
      {/* --------------------------------------------------------------------- */}
      <section id="menu" className="py-20 px-4 sm:px-8 max-w-7xl mx-auto space-y-10">
        <div className="space-y-3 text-center sm:text-left">
          <span className={`font-mono text-xs tracking-[0.2em] uppercase font-semibold ${
            isSunlit ? 'text-[#C26D38]' : 'text-[#C5A880]'
          }`}>
            COMPLETE DISH COLLECTION
          </span>
          <h2 className={`font-serif text-3xl sm:text-5xl font-bold tracking-tight ${
            isSunlit ? 'text-[#1C1612]' : 'text-[#FAF7F2]'
          }`}>
            Mindfully composed dishes.
          </h2>
        </div>

        {/* Category & Dietary Filter Strip */}
        <div className="space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            {[
              { id: 'all', label: 'All Dishes' },
              { id: 'bowls', label: 'Harvest Bowls' },
              { id: 'mains', label: 'Artisan Mains' },
              { id: 'toasts', label: 'Sourdough Tartines' },
              { id: 'elixirs', label: 'Cold Elixirs' }
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => {
                  sounds.playClick();
                  setSelectedCategory(cat.id);
                }}
                className={`px-4 py-2 rounded-full text-xs font-mono transition cursor-pointer border ${
                  selectedCategory === cat.id
                    ? isSunlit 
                      ? 'bg-[#C26D38] text-white border-[#C26D38] font-bold shadow-sm' 
                      : 'bg-[#C5A880] text-[#0E0C0A] border-[#C5A880] font-bold'
                    : isSunlit 
                      ? 'bg-white hover:bg-[#F3ECE0] text-[#5C4D42] border-[#E8DFC9]' 
                      : 'bg-[#161311] hover:bg-[#1F1A15] text-[#D8CEBF]/70 border-[#2E251E]'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <span className={`text-[11px] font-mono uppercase tracking-wider mr-1 ${
              isSunlit ? 'text-[#7D6E63]' : 'text-[#D8CEBF]/60'
            }`}>Dietary:</span>
            {['all', 'Vegan', 'Gluten-Free', 'High-Protein', 'Vegetarian'].map((diet) => (
              <button
                key={diet}
                onClick={() => {
                  sounds.playClick();
                  setSelectedDietary(diet);
                }}
                className={`px-3 py-1 rounded-lg text-[11px] font-mono transition cursor-pointer border ${
                  selectedDietary === diet
                    ? isSunlit 
                      ? 'bg-[#3B5038] text-white border-[#3B5038] font-bold shadow-sm' 
                      : 'bg-[#2E251E] text-[#C5A880] border-[#C5A880]/40 font-bold'
                    : isSunlit 
                      ? 'bg-white text-[#5C4D42] border-[#E8DFC9]' 
                      : 'bg-[#161311]/60 text-[#D8CEBF]/60 border-white/5'
                }`}
              >
                {diet === 'all' ? 'All Diets' : diet}
              </button>
            ))}
          </div>
        </div>

        {/* Menu Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDishes.map((dish) => (
            <div
              key={dish.id}
              className={`rounded-2xl border p-5 space-y-4 transition-all duration-300 shadow-sm ${
                isSunlit 
                  ? 'bg-white border-[#E8DFC9] hover:border-[#C26D38]/50 hover:shadow-md' 
                  : 'bg-[#161311] border-[#2E251E] hover:border-[#C5A880]/40'
              }`}
            >
              <div className="flex gap-4">
                <img
                  src={dish.image}
                  alt={dish.name}
                  className="w-24 h-24 rounded-xl object-cover shrink-0 shadow-sm"
                />
                <div className="space-y-1 min-w-0">
                  <div className="flex items-start justify-between gap-1">
                    <h3 className={`font-serif font-bold text-base leading-snug truncate ${
                      isSunlit ? 'text-[#1C1612]' : 'text-[#FAF7F2]'
                    }`}>
                      {dish.name}
                    </h3>
                    <span className={`font-mono text-xs font-bold shrink-0 ${
                      isSunlit ? 'text-[#C26D38]' : 'text-[#C5A880]'
                    }`}>
                      ₹{dish.price}
                    </span>
                  </div>
                  <p className={`text-[11px] font-sans line-clamp-2 ${
                    isSunlit ? 'text-[#5C4D42]' : 'text-[#D8CEBF]/70'
                  }`}>
                    {dish.tagline}
                  </p>
                  <div className={`flex items-center gap-2 pt-1 font-mono text-[10px] ${
                    isSunlit ? 'text-[#7D6E63]' : 'text-[#DFBA84]'
                  }`}>
                    <span>{dish.calories} kcal</span>
                    <span>•</span>
                    <span>{dish.macros.protein}g Protein</span>
                  </div>
                </div>
              </div>

              <div className={`flex items-center justify-between pt-3 border-t text-xs ${
                isSunlit ? 'border-[#E8DFC9]' : 'border-[#2E251E]'
              }`}>
                <span className={`text-[10px] font-mono ${
                  isSunlit ? 'text-[#3B5038]' : 'text-[#C5A880]'
                }`}>
                  {dish.dietary[0]}
                </span>
                <button
                  onClick={() => {
                    sounds.playClick();
                    setActiveDishModal(dish);
                  }}
                  className={`font-mono text-xs font-semibold flex items-center gap-1 cursor-pointer transition ${
                    isSunlit ? 'text-[#1C1612] hover:text-[#C26D38]' : 'text-[#FAF7F2] hover:text-[#C5A880]'
                  }`}
                >
                  <span>Details</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* --------------------------------------------------------------------- */}
      {/* FOUR SIMPLE STEPS ROADMAP                                             */}
      {/* --------------------------------------------------------------------- */}
      <section id="steps" className={`py-24 px-4 sm:px-8 max-w-7xl mx-auto border-t space-y-12 ${
        isSunlit ? 'border-[#E8DFC9]' : 'border-[#2E251E]'
      }`}>
        <div className="space-y-3 text-center sm:text-left">
          <span className={`font-mono text-xs tracking-[0.2em] uppercase font-semibold ${
            isSunlit ? 'text-[#C26D38]' : 'text-[#C5A880]'
          }`}>
            THE PROCESS
          </span>
          <h2 className={`font-serif text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight ${
            isSunlit ? 'text-[#1C1612]' : 'text-[#FAF7F2]'
          }`}>
            Four simple steps to clarity.
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {FOUR_STEPS.map((step) => (
            <div
              key={step.step}
              className={`p-6 rounded-2xl border space-y-3 ${
                isSunlit 
                  ? 'bg-white border-[#E8DFC9] shadow-sm' 
                  : 'bg-[#161311] border-[#2E251E]'
              }`}
            >
              <span className={`font-mono text-2xl font-black ${
                isSunlit ? 'text-[#C26D38]' : 'text-[#C5A880]'
              }`}>{step.step}</span>
              <h3 className={`font-serif text-lg font-bold ${
                isSunlit ? 'text-[#1C1612]' : 'text-[#FAF7F2]'
              }`}>{step.title}</h3>
              <p className={`text-xs font-sans leading-relaxed ${
                isSunlit ? 'text-[#5C4D42]' : 'text-[#D8CEBF]/70'
              }`}>{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* --------------------------------------------------------------------- */}
      {/* VIP TABLE RESERVATION BANNER                                          */}
      {/* --------------------------------------------------------------------- */}
      <section className="py-16 px-4 sm:px-8 max-w-5xl mx-auto">
        <div className={`p-8 sm:p-12 rounded-[32px] border text-center space-y-6 relative overflow-hidden shadow-xl ${
          isSunlit 
            ? 'bg-white border-[#E8DFC9] shadow-[0_20px_50px_rgba(45,30,20,0.06)]' 
            : 'bg-gradient-to-b from-[#1A1613] to-[#120F0D] border-[#2E251E]'
        }`}>
          <div className="space-y-3 max-w-xl mx-auto">
            <span className={`font-mono text-xs uppercase tracking-widest font-semibold ${
              isSunlit ? 'text-[#C26D38]' : 'text-[#C5A880]'
            }`}>
              VIP TASTING EXPERIENCE
            </span>
            <h2 className={`font-serif text-3xl sm:text-5xl font-bold tracking-tight ${
              isSunlit ? 'text-[#1C1612]' : 'text-[#FAF7F2]'
            }`}>
              Reserve your seat at the Chef’s Table.
            </h2>
            <p className={`text-xs sm:text-sm font-sans ${
              isSunlit ? 'text-[#5C4D42]' : 'text-[#D8CEBF]/80'
            }`}>
              Indoor Solarium, Sunlit Terrace, or the Chef’s Tasting Alcove. Guaranteed seating with bespoke allergy &amp; dietary curation.
            </p>
          </div>

          <div className="pt-2">
            <button
              onClick={() => {
                sounds.playClick();
                setIsReservationOpen(true);
              }}
              className={`px-8 py-4 rounded-full font-mono font-bold text-xs tracking-widest uppercase transition-all shadow-lg hover:-translate-y-0.5 active:translate-y-0 cursor-pointer ${
                isSunlit 
                  ? 'bg-gradient-to-r from-[#C26D38] to-[#D47E48] hover:brightness-110 text-white shadow-[0_6px_24px_rgba(194,109,56,0.3)]' 
                  : 'bg-gradient-to-r from-[#C5A880] via-[#DFBA84] to-[#C5A880] hover:brightness-110 text-[#0E0C0A]'
              }`}
            >
              <span>Book Curated Table</span>
            </button>
          </div>
        </div>
      </section>

      {/* --------------------------------------------------------------------- */}
      {/* FAQ SECTION                                                           */}
      {/* --------------------------------------------------------------------- */}
      <section id="faq" className={`py-20 px-4 sm:px-8 max-w-4xl mx-auto border-t space-y-10 ${
        isSunlit ? 'border-[#E8DFC9]' : 'border-[#2E251E]'
      }`}>
        <div className="space-y-2 text-center">
          <span className={`font-mono text-xs tracking-[0.2em] uppercase font-semibold ${
            isSunlit ? 'text-[#C26D38]' : 'text-[#C5A880]'
          }`}>
            FREQUENTLY ASKED
          </span>
          <h2 className={`font-serif text-3xl sm:text-4xl font-bold tracking-tight ${
            isSunlit ? 'text-[#1C1612]' : 'text-[#FAF7F2]'
          }`}>
            Clarity in every question.
          </h2>
        </div>

        <div className="space-y-3">
          {FAQ_ITEMS.map((faq, i) => (
            <div
              key={i}
              className={`rounded-2xl border transition-all ${
                isSunlit 
                  ? 'bg-white border-[#E8DFC9]' 
                  : 'bg-[#161311] border-[#2E251E]'
              }`}
            >
              <button
                onClick={() => {
                  sounds.playClick();
                  setActiveFaqIndex(activeFaqIndex === i ? -1 : i);
                }}
                className={`w-full p-5 text-left flex items-center justify-between gap-4 font-serif font-bold text-base cursor-pointer ${
                  isSunlit ? 'text-[#1C1612]' : 'text-[#FAF7F2]'
                }`}
              >
                <span>{faq.q}</span>
                <ChevronDown
                  className={`w-4 h-4 transition-transform duration-300 shrink-0 ${
                    activeFaqIndex === i ? 'rotate-180 text-[#C26D38]' : isSunlit ? 'text-[#7D6E63]' : 'text-[#C5A880]'
                  }`}
                />
              </button>

              <AnimatePresence>
                {activeFaqIndex === i && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className={`px-5 pb-5 text-xs font-sans leading-relaxed border-t pt-3 ${
                      isSunlit ? 'text-[#5C4D42] border-[#E8DFC9]' : 'text-[#D8CEBF]/80 border-[#2E251E]'
                    }`}
                  >
                    {faq.a}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </section>

      {/* --------------------------------------------------------------------- */}
      {/* FOOTER                                                                */}
      {/* --------------------------------------------------------------------- */}
      <footer className={`py-12 px-4 sm:px-8 border-t text-center space-y-4 font-mono text-xs ${
        isSunlit 
          ? 'bg-[#F3ECE0] border-[#E5DBCA] text-[#7D6E63]' 
          : 'bg-[#0E0C0A] border-[#2E251E] text-[#D8CEBF]/60'
      }`}>
        <p className={`font-serif font-bold text-base ${isSunlit ? 'text-[#1C1612]' : 'text-[#FAF7F2]'}`}>
          VELOUR // HEALTHY MENU
        </p>
        <p>100% Biodynamic Gastronomy • Zero Industrial Seed Oils • Mindful Vitality</p>
        <p className="text-[10px] opacity-70">© 2026 Velour Artisan Roastery &amp; Culinary Atelier. All rights reserved.</p>
      </footer>

      {/* --------------------------------------------------------------------- */}
      {/* FLOATING SIDE-BY-SIDE DISH COMPARISON DOCK                            */}
      {/* --------------------------------------------------------------------- */}
      <AnimatePresence>
        {comparedDishes.length > 0 && !isCompareOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-6 inset-x-0 z-40 flex justify-center px-4 pointer-events-none"
          >
            <div className={`p-3 rounded-full border shadow-2xl flex items-center gap-4 pointer-events-auto backdrop-blur-xl ${
              isSunlit 
                ? 'bg-white/95 border-[#E8DFC9] text-[#1C1612] shadow-[0_10px_30px_rgba(45,30,20,0.15)]' 
                : 'bg-[#161311]/95 border-[#C5A880]/50 text-[#FAF7F2]'
            }`}>
              <div className="flex items-center gap-2 pl-2">
                <span className="w-2 h-2 rounded-full bg-[#C26D38] animate-ping"></span>
                <span className="font-mono text-xs font-bold">
                  {comparedDishes.length} of 2 Dishes in Compare Tray
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    sounds.playClick();
                    setIsCompareOpen(true);
                  }}
                  className="px-4 py-2 rounded-full bg-[#C26D38] text-white font-mono text-xs font-bold uppercase tracking-wider hover:brightness-110 transition cursor-pointer shadow-md flex items-center gap-1.5"
                >
                  <Layers className="w-3.5 h-3.5" />
                  <span>Open Comparison Tray</span>
                </button>

                <button
                  onClick={() => {
                    sounds.playClick();
                    setComparedDishes([]);
                  }}
                  className="p-2 rounded-full hover:bg-black/5 text-stone-400 hover:text-stone-700 transition cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* --------------------------------------------------------------------- */}
      {/* SIDE-BY-SIDE DISH COMPARISON MODAL                                    */}
      {/* --------------------------------------------------------------------- */}
      <AnimatePresence>
        {isCompareOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsCompareOpen(false)}
              className="fixed inset-0 bg-black/75 backdrop-blur-md"
            ></motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className={`relative w-full max-w-4xl rounded-[32px] border p-6 sm:p-8 z-10 space-y-6 max-h-[90vh] overflow-y-auto shadow-2xl ${
                isSunlit 
                  ? 'bg-white border-[#E8DFC9] text-[#1C1612]' 
                  : 'bg-[#161311] border-[#2E251E] text-[#FAF7F2]'
              }`}
            >
              <div className="flex items-center justify-between pb-4 border-b border-inherit">
                <div>
                  <span className={`font-mono text-xs uppercase tracking-widest ${
                    isSunlit ? 'text-[#C26D38]' : 'text-[#C5A880]'
                  }`}>
                    SIDE-BY-SIDE EVALUATION
                  </span>
                  <h3 className="font-serif text-2xl font-bold">Nutritional &amp; Sourcing Matrix</h3>
                </div>
                <button
                  onClick={() => setIsCompareOpen(false)}
                  className="p-2 rounded-full hover:bg-black/10 transition cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {comparedDishes.map((dish) => (
                  <div key={dish.id} className={`p-5 rounded-2xl border space-y-4 ${
                    isSunlit ? 'bg-[#FBF8F4] border-[#E8DFC9]' : 'bg-[#1F1A15] border-[#2E251E]'
                  }`}>
                    <img src={dish.image} alt={dish.name} className="w-full h-44 rounded-xl object-cover" />
                    <div className="flex items-start justify-between">
                      <h4 className="font-serif font-bold text-lg">{dish.name}</h4>
                      <span className="font-mono text-sm font-bold text-[#C26D38]">₹{dish.price}</span>
                    </div>
                    <p className="text-xs text-stone-500">{dish.description}</p>
                    
                    <div className="grid grid-cols-2 gap-2 font-mono text-xs">
                      <div className="p-2 rounded-lg bg-black/5">
                        <span className="text-[10px] text-stone-400">CALORIES</span>
                        <p className="font-bold">{dish.calories} kcal</p>
                      </div>
                      <div className="p-2 rounded-lg bg-black/5">
                        <span className="text-[10px] text-stone-400">PROTEIN</span>
                        <p className="font-bold">{dish.macros.protein}g</p>
                      </div>
                      <div className="p-2 rounded-lg bg-black/5">
                        <span className="text-[10px] text-stone-400">FATS</span>
                        <p className="font-bold">{dish.macros.fat}g</p>
                      </div>
                      <div className="p-2 rounded-lg bg-black/5">
                        <span className="text-[10px] text-stone-400">PREP TIME</span>
                        <p className="font-bold">{dish.prepTime}</p>
                      </div>
                    </div>

                    <div className="space-y-1 text-xs">
                      <span className="font-mono text-[10px] text-stone-400">SOMMELIER PAIRING</span>
                      <p className="font-sans font-medium">{dish.pairing}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* --------------------------------------------------------------------- */}
      {/* DISH INSPECTION MODAL                                                 */}
      {/* --------------------------------------------------------------------- */}
      <AnimatePresence>
        {activeDishModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setActiveDishModal(null)}
              className="fixed inset-0 bg-black/75 backdrop-blur-md"
            ></motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className={`relative w-full max-w-2xl rounded-[32px] border overflow-hidden z-10 shadow-2xl ${
                isSunlit 
                  ? 'bg-white border-[#E8DFC9] text-[#1C1612]' 
                  : 'bg-[#161311] border-[#2E251E] text-[#FAF7F2]'
              }`}
            >
              <div className="relative h-64 sm:h-72">
                <img src={activeDishModal.image} alt={activeDishModal.name} className="w-full h-full object-cover" />
                <button
                  onClick={() => setActiveDishModal(null)}
                  className="absolute top-4 right-4 p-2 rounded-full bg-black/60 text-white hover:bg-black transition cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6 sm:p-8 space-y-5">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <span className="font-mono text-xs uppercase tracking-widest text-[#C26D38]">
                      {activeDishModal.season}
                    </span>
                    <h3 className="font-serif text-2xl font-bold">{activeDishModal.name}</h3>
                  </div>
                  <span className="font-mono text-xl font-bold text-[#C26D38]">₹{activeDishModal.price}</span>
                </div>

                <p className="text-sm leading-relaxed text-stone-600 dark:text-stone-300">
                  {activeDishModal.description}
                </p>

                <div className="space-y-2">
                  <span className="font-mono text-xs uppercase tracking-wider text-stone-400">KEY INGREDIENTS:</span>
                  <div className="flex flex-wrap gap-2">
                    {activeDishModal.ingredients.map((ing) => (
                      <span key={ing} className="px-3 py-1 rounded-full text-xs font-mono bg-black/5 dark:bg-white/5">
                        {ing}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-2 flex items-center justify-between">
                  <button
                    onClick={() => {
                      sounds.playClick();
                      toggleCompare(activeDishModal);
                      setActiveDishModal(null);
                    }}
                    className="px-6 py-3 rounded-full bg-[#C26D38] text-white font-mono text-xs font-bold uppercase tracking-wider transition hover:brightness-110 cursor-pointer flex items-center gap-2"
                  >
                    <Layers className="w-4 h-4" />
                    <span>Add to Comparison</span>
                  </button>

                  <button
                    onClick={() => setActiveDishModal(null)}
                    className="px-5 py-3 rounded-full text-xs font-mono font-medium hover:bg-black/5 transition cursor-pointer"
                  >
                    Close
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* --------------------------------------------------------------------- */}
      {/* VIP TABLE RESERVATION MODAL                                           */}
      {/* --------------------------------------------------------------------- */}
      <AnimatePresence>
        {isReservationOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsReservationOpen(false)}
              className="fixed inset-0 bg-black/75 backdrop-blur-md"
            ></motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className={`relative w-full max-w-xl rounded-[32px] border p-6 sm:p-8 z-10 space-y-6 shadow-2xl ${
                isSunlit 
                  ? 'bg-white border-[#E8DFC9] text-[#1C1612]' 
                  : 'bg-[#161311] border-[#2E251E] text-[#FAF7F2]'
              }`}
            >
              <div className="flex items-center justify-between pb-3 border-b border-inherit">
                <div>
                  <span className="font-mono text-xs uppercase tracking-widest text-[#C26D38]">
                    VIP RESERVATION ATELIER
                  </span>
                  <h3 className="font-serif text-2xl font-bold">Book Tasting Table</h3>
                </div>
                <button
                  onClick={() => setIsReservationOpen(false)}
                  className="p-2 rounded-full hover:bg-black/10 transition cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {reservationSuccess ? (
                <div className="text-center py-6 space-y-4">
                  <div className="w-12 h-12 rounded-full bg-[#3B5038] text-white flex items-center justify-center mx-auto">
                    <Check className="w-6 h-6" />
                  </div>
                  <h4 className="font-serif text-2xl font-bold">Table Confirmed</h4>
                  <p className="font-mono text-sm text-[#C26D38] font-bold">{generatedPass?.passId}</p>
                  <p className="text-xs text-stone-500">
                    We have reserved {generatedPass?.guests} guests for {generatedPass?.seating} on {generatedPass?.date} at {generatedPass?.time}.
                  </p>
                  <button
                    onClick={() => {
                      setIsReservationOpen(false);
                      setReservationSuccess(false);
                    }}
                    className="px-6 py-2.5 rounded-full bg-[#C26D38] text-white font-mono text-xs font-bold uppercase tracking-wider"
                  >
                    Done
                  </button>
                </div>
              ) : (
                <form onSubmit={handleReservationSubmit} className="space-y-4 text-xs font-mono">
                  <div className="space-y-1">
                    <label className="text-stone-400">GUEST NAME</label>
                    <input
                      type="text"
                      required
                      value={guestName}
                      onChange={(e) => setGuestName(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border bg-black/5 dark:bg-white/5 border-inherit text-inherit font-sans"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-stone-400">DATE</label>
                      <select
                        value={resDate}
                        onChange={(e) => setResDate(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl border bg-black/5 dark:bg-white/5 border-inherit text-inherit font-sans"
                      >
                        <option value="Today">Today</option>
                        <option value="Tomorrow">Tomorrow</option>
                        <option value="This Friday">This Friday</option>
                        <option value="This Saturday">This Saturday</option>
                      </select>
                    </div>
                    <div className="space-y-1">
                      <label className="text-stone-400">SEATING ZONE</label>
                      <select
                        value={resSeating}
                        onChange={(e) => setResSeating(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl border bg-black/5 dark:bg-white/5 border-inherit text-inherit font-sans"
                      >
                        <option value="Indoor Solarium">Indoor Solarium</option>
                        <option value="Terrace Garden">Terrace Garden</option>
                        <option value="Chef’s Tasting Alcove">Chef’s Tasting Alcove</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-stone-400">DIETARY &amp; ALLERGY PREFERENCES</label>
                    <input
                      type="text"
                      value={dietaryNotes}
                      onChange={(e) => setDietaryNotes(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border bg-black/5 dark:bg-white/5 border-inherit text-inherit font-sans"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3.5 rounded-xl bg-[#C26D38] hover:bg-[#B25C26] text-white font-mono text-xs font-bold uppercase tracking-wider transition shadow-md cursor-pointer"
                  >
                    Confirm VIP Table Pass
                  </button>
                </form>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
