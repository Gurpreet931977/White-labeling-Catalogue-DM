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
  Zap
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
    flavorNotes: 'Deep wild berry tartness, tropical dragonfruit, crunchy cacao nibs',
    routineFit: 'Vibrant morning starter, high natural polyphenols and clean energy'
  }
];

const PHILOSOPHY_PILLARS = [
  {
    code: '01',
    label: 'OVERLOAD',
    title: 'Too many lists, trends, and rules make an everyday decision more tiring.',
    description: 'Modern dining is flooded with endless restrictive dietary formulas, conflicting advice, and cluttered menus. We eliminate the noise so your natural intuition can guide your nourishment.'
  },
  {
    code: '02',
    label: 'PREFERENCES',
    title: 'Tastes, schedules, and needs change. Menus should offer starting points, not rigid formulas.',
    description: 'A healthy meal on a high-stress workday looks very different from a slow Sunday brunch. Our menu is architected around your context, routine, and sensory preferences.'
  },
  {
    code: '03',
    label: 'CLARITY',
    title: 'Side-by-side photos and descriptions make it easy to compare without opening multiple tabs.',
    description: 'Honest sourcing, transparent macronutrient profiles, and high-fidelity culinary photography let you inspect every element before you take your first bite.'
  }
];

const WAYS_TO_EXPLORE = [
  {
    step: '01',
    title: 'Discovery',
    tagline: 'New finds • inspiration • ideas',
    desc: 'Explore rare heirloom grains, cold-pressed infusions, and seasonal culinary pairings to broaden your daily dining repertoire.',
    image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=600&q=80'
  },
  {
    step: '02',
    title: 'Rhythm',
    tagline: 'Routine • variety • convenience',
    desc: 'Find nourishing, grounded everyday staples to revisit whenever you want to eat exceptionally well with zero decision fatigue.',
    image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=600&q=80'
  },
  {
    step: '03',
    title: 'Expression',
    tagline: 'Color • texture • creativity',
    desc: 'Notice vibrant plant pigments, contrasting textures, and artisanal fermentations to step out of autopilot and enjoy eating.',
    image: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?auto=format&fit=crop&w=600&q=80'
  }
];

const FOUR_STEPS = [
  {
    num: '01',
    title: 'Define your moment',
    desc: 'Decide whether your body desires light revitalizing energy, warm comforting depth, or high-protein recovery.'
  },
  {
    num: '02',
    title: 'Compare side-by-side',
    desc: 'Examine detailed photos, macros, ingredients, and allergen certifications with our 1-tap comparison engine.'
  },
  {
    num: '03',
    title: 'Honor your context',
    desc: 'Consider your daily schedule, energy requirements, and digestive comfort without feeling pressured by rigid dogmas.'
  },
  {
    num: '04',
    title: 'Choose with confidence',
    desc: 'Select your dish or reserve a VIP table for a curated chef-led tasting experience tailored to your exact profile.'
  }
];

const FAQS = [
  {
    q: 'What makes the Healthy Menu showcase distinct from standard restaurant menus?',
    a: 'Unlike cluttered digital menus that prioritize transaction speed over mindful dining, Healthy Menu is an editorial flagship built on clarity. It provides high-definition culinary photography, transparent macro breakdowns, and side-by-side comparison tools so you can make informed choices with zero guesswork.'
  },
  {
    q: 'How does the side-by-side dish comparison tool work?',
    a: 'Simply tap the "Compare" pill on any 2 dishes. A floating comparison bar will appear at the bottom of your screen. Opening the drawer reveals a split-screen matrix comparing macros, calories, ingredients, allergens, and routine suitability side-by-side.'
  },
  {
    q: 'Do you cater to specific dietary restrictions like Celiac or Vegan?',
    a: 'Yes. Every dish is certified with clear dietary badges (Gluten-Free, Vegan, High-Protein, Keto-Friendly). When reserving a VIP table, our reservation engine captures your exact dietary sensitivities for the executive chef.'
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
  // Navigation & Modal States
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedDietary, setSelectedDietary] = useState('all');
  const [activeDishModal, setActiveDishModal] = useState(null);
  const [comparedDishes, setComparedDishes] = useState([]);
  const [isCompareOpen, setIsCompareOpen] = useState(false);
  const [isReservationOpen, setIsReservationOpen] = useState(false);
  const [reservationSuccess, setReservationSuccess] = useState(false);
  const [activeFaqIndex, setActiveFaqIndex] = useState(0);

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
        // Keep the latest 2
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
    <div className="min-h-screen bg-[#0B120E] text-[#F4F0E5] font-sans selection:bg-[#C8FF47] selection:text-[#0B120E] overflow-x-hidden relative">
      
      {/* --------------------------------------------------------------------- */}
      {/* TOP HEADER / NAVIGATION (Modernist Editorial Bar)                     */}
      {/* --------------------------------------------------------------------- */}
      <header className="sticky top-0 inset-x-0 z-40 bg-[#0B120E]/90 backdrop-blur-xl border-b border-[#233227] py-3.5 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          
          {/* Left Brand Identity */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => {
                sounds.playClick();
                if (onBackToVariants) onBackToVariants();
                else if (onBackToCatalogue) onBackToCatalogue();
              }}
              className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/[0.04] hover:bg-[#C8FF47] text-stone-300 hover:text-[#0B120E] border border-white/10 hover:border-[#C8FF47] text-xs font-mono font-medium transition cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Back to Models</span>
            </button>

            <div className="h-4 w-px bg-white/10 hidden md:block"></div>

            <div className="flex items-center gap-2.5">
              <span className="w-2 h-2 rounded-full bg-[#C8FF47] shadow-[0_0_8px_#C8FF47] animate-pulse"></span>
              <span className="font-mono text-xs tracking-[0.2em] uppercase font-bold text-[#F4F0E5]">
                VELOUR <span className="text-[#C8FF47]">//</span> HEALTHY MENU
              </span>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-6 font-mono text-xs text-[#D8D2C5]/70">
            <a href="#menu" className="hover:text-[#C8FF47] transition">The Menu</a>
            <a href="#philosophy" className="hover:text-[#C8FF47] transition">Philosophy</a>
            <a href="#explore" className="hover:text-[#C8FF47] transition">Ways to Explore</a>
            <a href="#steps" className="hover:text-[#C8FF47] transition">4 Steps</a>
            <a href="#faq" className="hover:text-[#C8FF47] transition">FAQ</a>
          </nav>

          {/* Right Header Actions */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                sounds.playClick();
                const menuEl = document.getElementById('menu');
                if (menuEl) menuEl.scrollIntoView({ behavior: 'smooth' });
              }}
              className="hidden sm:flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#C8FF47] hover:bg-[#D6FF66] text-[#0B120E] text-xs font-mono font-bold tracking-wider uppercase transition shadow-[0_4px_16px_rgba(200,255,71,0.25)] cursor-pointer"
            >
              <span>Explore Menu</span>
              <ArrowDown className="w-3 h-3 rotate-[-45deg]" />
            </button>

            <button
              onClick={() => {
                sounds.playClick();
                setIsReservationOpen(true);
              }}
              className="px-4 py-2 rounded-full bg-white/[0.06] hover:bg-white/10 text-[#F4F0E5] text-xs font-mono font-medium tracking-wide transition border border-white/10 hover:border-[#C8FF47]/40 cursor-pointer flex items-center gap-2"
            >
              <Calendar className="w-3.5 h-3.5 text-[#C8FF47]" />
              <span>Book Table</span>
            </button>
          </div>

        </div>
      </header>

      {/* --------------------------------------------------------------------- */}
      {/* HERO SECTION: Framer "Healthy Menu" Visual Showcase                    */}
      {/* --------------------------------------------------------------------- */}
      <section className="relative pt-20 pb-16 px-4 sm:px-8 max-w-6xl mx-auto text-center space-y-8">
        
        {/* Editorial Pill */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#131C16] border border-[#233227] text-xs font-mono text-[#C8FF47] tracking-widest uppercase">
          <Leaf className="w-3.5 h-3.5 text-[#C8FF47]" />
          <span>EAT WELL • KEEP IT SIMPLE • CHOOSE WITH INTENTION</span>
        </div>

        {/* Main Editorial Headline */}
        <h1 className="font-serif text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight text-[#F4F0E5] leading-[1.08] max-w-4xl mx-auto">
          Discover dishes that <span className="italic font-normal text-[#C8FF47]">fit your routine</span>.
        </h1>

        {/* Subhead */}
        <p className="max-w-2xl mx-auto text-sm sm:text-base md:text-lg text-[#D8D2C5]/80 font-sans leading-relaxed">
          Between too many ideas and too little reliable information, deciding what to eat becomes another daily chore. Velour brings visual dish inspiration together in one transparent space to make every choice clearer.
        </p>

        {/* Dual Primary Call-to-Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 pt-2">
          <a
            href="#menu"
            onClick={() => sounds.playClick()}
            className="w-full sm:w-auto px-7 py-3.5 rounded-full bg-[#C8FF47] hover:bg-[#D6FF66] text-[#0B120E] font-mono font-bold text-xs tracking-widest uppercase flex items-center justify-center gap-2 transition-all shadow-[0_6px_24px_rgba(200,255,71,0.3)] hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
          >
            <span>Explore The Menu</span>
            <ArrowRight className="w-4 h-4 text-[#0B120E]" />
          </a>

          <button
            onClick={() => {
              sounds.playClick();
              const el = document.getElementById('philosophy');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }}
            className="w-full sm:w-auto px-7 py-3.5 rounded-full bg-[#131C16] hover:bg-[#1A261E] text-[#F4F0E5] border border-[#2B3B2F] hover:border-[#C8FF47]/40 font-mono font-semibold text-xs tracking-wider uppercase transition cursor-pointer flex items-center justify-center gap-2"
          >
            <span>See How It Works</span>
            <Compass className="w-4 h-4 text-[#C8FF47]" />
          </button>
        </div>

        {/* Quality Metrics Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-4xl mx-auto pt-8 border-t border-[#1C2A20]">
          <div className="p-3.5 rounded-2xl bg-[#131C16]/80 border border-[#233227] text-left space-y-1">
            <span className="font-mono text-[10px] text-[#C8FF47] tracking-wider uppercase">SOURCING</span>
            <p className="font-serif font-bold text-base text-[#F4F0E5]">100% Organic</p>
            <p className="text-[11px] text-[#D8D2C5]/60 font-sans">Biodynamic farm fresh</p>
          </div>
          <div className="p-3.5 rounded-2xl bg-[#131C16]/80 border border-[#233227] text-left space-y-1">
            <span className="font-mono text-[10px] text-[#C8FF47] tracking-wider uppercase">PURITY</span>
            <p className="font-serif font-bold text-base text-[#F4F0E5]">Zero Seed Oils</p>
            <p className="text-[11px] text-[#D8D2C5]/60 font-sans">Cold-pressed olive &amp; ghee</p>
          </div>
          <div className="p-3.5 rounded-2xl bg-[#131C16]/80 border border-[#233227] text-left space-y-1">
            <span className="font-mono text-[10px] text-[#C8FF47] tracking-wider uppercase">NUTRITION</span>
            <p className="font-serif font-bold text-base text-[#F4F0E5]">Transparent Macros</p>
            <p className="text-[11px] text-[#D8D2C5]/60 font-sans">Full protein, carbs, fats</p>
          </div>
          <div className="p-3.5 rounded-2xl bg-[#131C16]/80 border border-[#233227] text-left space-y-1">
            <span className="font-mono text-[10px] text-[#C8FF47] tracking-wider uppercase">HOSPITALITY</span>
            <p className="font-serif font-bold text-base text-[#F4F0E5]">VIP Tastings</p>
            <p className="text-[11px] text-[#D8D2C5]/60 font-sans">Curated seat reservations</p>
          </div>
        </div>

      </section>

      {/* --------------------------------------------------------------------- */}
      {/* CONTINUOUS TICKER MARQUEE                                             */}
      {/* --------------------------------------------------------------------- */}
      <div className="py-3 bg-[#131C16] border-y border-[#233227] overflow-hidden whitespace-nowrap">
        <div className="inline-flex gap-8 items-center font-mono text-xs text-[#C8FF47] tracking-[0.25em] uppercase font-bold animate-marquee">
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
      {/* PHILOSOPHY / CONTEXT PILLARS: 01 Overload, 02 Preferences, 03 Clarity */}
      {/* --------------------------------------------------------------------- */}
      <section id="philosophy" className="py-24 px-4 sm:px-8 max-w-6xl mx-auto space-y-12">
        <div className="space-y-3 text-center sm:text-left">
          <span className="font-mono text-xs text-[#C8FF47] tracking-[0.2em] uppercase font-semibold">
            THE PHILOSOPHY
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-[#F4F0E5] tracking-tight">
            It is not about rigid diets. It is about finding what fits real life.
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {PHILOSOPHY_PILLARS.map((p) => (
            <div
              key={p.code}
              className="p-8 rounded-[28px] bg-gradient-to-b from-[#131C16] to-[#0D1410] border border-[#233227] hover:border-[#C8FF47]/40 transition-all duration-500 space-y-4 relative group"
            >
              <div className="flex items-center justify-between pb-3 border-b border-[#233227]">
                <span className="font-mono text-2xl font-bold text-[#C8FF47]">{p.code}</span>
                <span className="font-mono text-[10px] tracking-widest uppercase px-2.5 py-0.5 rounded-full bg-[#C8FF47]/10 text-[#C8FF47] border border-[#C8FF47]/20">
                  {p.label}
                </span>
              </div>
              <h3 className="font-serif text-xl font-semibold text-[#F4F0E5] leading-snug group-hover:text-[#C8FF47] transition-colors">
                {p.title}
              </h3>
              <p className="text-xs text-[#D8D2C5]/75 font-sans leading-relaxed">
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
            <span className="font-mono text-xs text-[#C8FF47] tracking-[0.2em] uppercase font-semibold">
              SIGNATURE INSPIRATION
            </span>
            <h2 className="font-serif text-3xl sm:text-5xl font-bold text-[#F4F0E5] tracking-tight">
              A menu that begins with the eyes.
            </h2>
            <p className="text-xs sm:text-sm text-[#D8D2C5]/70 font-sans max-w-xl">
              Browse dishes curated to compare ingredients, flavor palettes, and energy profiles. Tap any dish to inspect or compare side-by-side.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-[#D8D2C5]/60">
              {comparedDishes.length}/2 dishes selected for comparison
            </span>
            {comparedDishes.length > 0 && (
              <button
                onClick={() => {
                  sounds.playClick();
                  setIsCompareOpen(true);
                }}
                className="px-3.5 py-1.5 rounded-full bg-[#C8FF47] text-[#0B120E] font-mono text-xs font-bold uppercase tracking-wider flex items-center gap-1 cursor-pointer"
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
                className={`group rounded-[28px] overflow-hidden bg-gradient-to-b from-[#131C16] to-[#0E1611] border transition-all duration-500 flex flex-col justify-between shadow-xl ${
                  isCompared
                    ? 'border-[#C8FF47] ring-1 ring-[#C8FF47]/50 shadow-[0_0_30px_rgba(200,255,71,0.15)]'
                    : 'border-[#233227] hover:border-[#C8FF47]/50'
                }`}
              >
                {/* Visual Image Header with Macro Pills */}
                <div className="relative aspect-[16/11] overflow-hidden bg-black/40">
                  <img
                    src={dish.image}
                    alt={dish.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0E1611] via-[#0E1611]/20 to-transparent pointer-events-none"></div>

                  {/* Top Floating Badge */}
                  <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                    <span className="px-2.5 py-1 rounded-full bg-[#0B120E]/85 backdrop-blur-md border border-white/10 text-[10px] font-mono text-[#C8FF47] font-semibold tracking-wider uppercase">
                      {dish.dietary[0]}
                    </span>

                    <button
                      onClick={() => toggleCompare(dish)}
                      className={`px-3 py-1 rounded-full text-[10px] font-mono font-bold tracking-wider uppercase transition cursor-pointer flex items-center gap-1.5 shadow-md ${
                        isCompared
                          ? 'bg-[#C8FF47] text-[#0B120E]'
                          : 'bg-[#0B120E]/85 hover:bg-[#1C281F] text-[#F4F0E5] border border-white/15'
                      }`}
                    >
                      <Layers className="w-3 h-3" />
                      <span>{isCompared ? 'Comparing' : '+ Compare'}</span>
                    </button>
                  </div>

                  {/* Bottom Macro Bar */}
                  <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between font-mono text-[10px] text-[#F4F0E5] pointer-events-none">
                    <span className="px-2.5 py-1 rounded-xl bg-[#0B120E]/85 backdrop-blur-md border border-white/10">
                      {dish.calories} kcal
                    </span>
                    <span className="px-2.5 py-1 rounded-xl bg-[#0B120E]/85 backdrop-blur-md border border-[#C8FF47]/30 text-[#C8FF47] font-bold">
                      {dish.macros.protein}g Protein
                    </span>
                  </div>
                </div>

                {/* Dish Information */}
                <div className="p-6 space-y-3">
                  <div className="space-y-1">
                    <div className="flex items-baseline justify-between gap-2">
                      <h3 className="font-serif text-xl font-bold text-[#F4F0E5] group-hover:text-[#C8FF47] transition-colors leading-snug">
                        {dish.name}
                      </h3>
                      <span className="font-mono text-sm font-bold text-[#C8FF47] shrink-0">
                        ₹{dish.price}
                      </span>
                    </div>
                    <p className="text-[11px] font-mono text-[#C8FF47]/80 line-clamp-1">
                      {dish.tagline}
                    </p>
                  </div>

                  <p className="text-xs text-[#D8D2C5]/70 font-sans leading-relaxed line-clamp-2">
                    {dish.description}
                  </p>

                  {/* Dietary tags */}
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {dish.dietary.map((tag, idx) => (
                      <span
                        key={idx}
                        className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-white/[0.04] border border-white/10 text-stone-300"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Card Action Footers */}
                <div className="p-6 pt-0 flex items-center justify-between gap-2 border-t border-[#233227] mt-2 pt-4">
                  <button
                    onClick={() => {
                      sounds.playClick();
                      setActiveDishModal(dish);
                    }}
                    className="flex-1 py-2.5 px-3 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] text-stone-200 text-xs font-mono font-medium transition flex items-center justify-center gap-1.5 cursor-pointer border border-white/10"
                  >
                    <Eye className="w-3.5 h-3.5 text-[#C8FF47]" />
                    <span>Inspect Details</span>
                  </button>

                  <button
                    onClick={() => {
                      sounds.playClick();
                      setIsReservationOpen(true);
                    }}
                    className="py-2.5 px-3.5 rounded-xl bg-[#C8FF47] hover:bg-[#D6FF66] text-[#0B120E] text-xs font-mono font-bold uppercase tracking-wider transition flex items-center justify-center gap-1 cursor-pointer shadow-md"
                  >
                    <span>Taste</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </button>
                </div>

              </div>
            );
          })}
        </div>
      </section>

      {/* --------------------------------------------------------------------- */}
      {/* THREE WAYS TO EXPLORE: Discovery, Rhythm, Expression                  */}
      {/* --------------------------------------------------------------------- */}
      <section id="explore" className="py-24 px-4 sm:px-8 max-w-6xl mx-auto space-y-12">
        <div className="text-center space-y-3">
          <span className="font-mono text-xs text-[#C8FF47] tracking-[0.2em] uppercase font-semibold">
            ONE MENU • THREE PERSPECTIVES
          </span>
          <h2 className="font-serif text-3xl sm:text-5xl font-bold text-[#F4F0E5] tracking-tight">
            Choose the starting point that fits your moment.
          </h2>
          <p className="text-xs sm:text-sm text-[#D8D2C5]/70 font-sans max-w-xl mx-auto">
            Start with something new, ground yourself in nourishing everyday comfort, or explore bold colors that take you beyond food autopilot.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {WAYS_TO_EXPLORE.map((way) => (
            <div
              key={way.step}
              className="group relative rounded-[28px] overflow-hidden bg-[#131C16] border border-[#233227] hover:border-[#C8FF47]/50 transition-all duration-500 flex flex-col justify-between shadow-xl"
            >
              <div className="relative aspect-[16/10] overflow-hidden">
                <img
                  src={way.image}
                  alt={way.title}
                  className="w-full h-full object-cover opacity-80 group-hover:opacity-95 group-hover:scale-105 transition-all duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#131C16] via-[#131C16]/30 to-transparent"></div>
                
                <span className="absolute top-4 left-4 font-mono text-xs font-bold px-3 py-1 rounded-full bg-[#0B120E]/80 backdrop-blur-md border border-white/10 text-[#C8FF47]">
                  WAY // {way.step}
                </span>
              </div>

              <div className="p-7 space-y-3">
                <div>
                  <h3 className="font-serif text-2xl font-bold text-[#F4F0E5] group-hover:text-[#C8FF47] transition-colors">
                    {way.title}
                  </h3>
                  <p className="font-mono text-[11px] text-[#C8FF47] tracking-wider mt-1">
                    {way.tagline}
                  </p>
                </div>
                <p className="text-xs text-[#D8D2C5]/75 font-sans leading-relaxed">
                  {way.desc}
                </p>

                <div className="pt-2">
                  <a
                    href="#menu"
                    onClick={() => sounds.playClick()}
                    className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-[#F4F0E5] group-hover:text-[#C8FF47] transition-colors cursor-pointer"
                  >
                    <span>View Curated Dishes</span>
                    <ChevronRight className="w-3.5 h-3.5 text-[#C8FF47]" />
                  </a>
                </div>
              </div>

            </div>
          ))}
        </div>
      </section>

      {/* --------------------------------------------------------------------- */}
      {/* CURATED MENU BROWSER & DIETARY FILTER ENGINE                          */}
      {/* --------------------------------------------------------------------- */}
      <section id="menu" className="py-20 px-4 sm:px-8 max-w-7xl mx-auto space-y-10 border-t border-[#1C2A20]">
        
        <div className="text-center space-y-3 max-w-3xl mx-auto">
          <span className="font-mono text-xs text-[#C8FF47] tracking-[0.2em] uppercase font-semibold">
            THE ARCHITECTURE OF TASTE
          </span>
          <h2 className="font-serif text-3xl sm:text-5xl font-bold text-[#F4F0E5] tracking-tight">
            Curated Menu &amp; Macro Transparency
          </h2>
          <p className="text-xs sm:text-sm text-[#D8D2C5]/75 font-sans">
            Every dish engineered without industrial seed oils or synthetic preservatives. Filter by routine, macro balance, or dietary lifestyle.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="space-y-4">
          {/* Category Tabs */}
          <div className="flex flex-wrap items-center justify-center gap-2">
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
                className={`px-4 py-2 rounded-full font-mono text-xs transition-all cursor-pointer ${
                  selectedCategory === cat.id
                    ? 'bg-[#C8FF47] text-[#0B120E] font-bold shadow-[0_2px_12px_rgba(200,255,71,0.25)]'
                    : 'bg-[#131C16] hover:bg-[#1B271F] text-[#D8D2C5]/80 border border-[#233227]'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Dietary Filter Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-1 font-mono text-[11px]">
            <span className="text-stone-400 mr-1">DIETARY:</span>
            {['all', 'Gluten-Free', 'Vegan', 'High-Protein', 'Vegetarian'].map((diet) => (
              <button
                key={diet}
                onClick={() => {
                  sounds.playClick();
                  setSelectedDietary(diet);
                }}
                className={`px-3 py-1 rounded-lg transition cursor-pointer ${
                  selectedDietary === diet
                    ? 'bg-[#233227] text-[#C8FF47] border border-[#C8FF47]/40 font-bold'
                    : 'bg-white/[0.03] text-stone-400 hover:text-white border border-white/5'
                }`}
              >
                {diet === 'all' ? 'All Lifestyles' : diet}
              </button>
            ))}
          </div>
        </div>

        {/* Menu Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDishes.map((dish) => (
            <div
              key={dish.id}
              onClick={() => {
                sounds.playClick();
                setActiveDishModal(dish);
              }}
              className="p-5 rounded-3xl bg-[#131C16]/80 hover:bg-[#17221B] border border-[#233227] hover:border-[#C8FF47]/40 transition-all duration-300 flex items-center gap-4 cursor-pointer group shadow-md"
            >
              <img
                src={dish.image}
                alt={dish.name}
                className="w-24 h-24 rounded-2xl object-cover shrink-0 group-hover:scale-105 transition-transform duration-500"
              />
              <div className="space-y-1 flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <h4 className="font-serif font-bold text-base text-[#F4F0E5] group-hover:text-[#C8FF47] transition-colors truncate">
                    {dish.name}
                  </h4>
                  <span className="font-mono text-xs font-bold text-[#C8FF47]">
                    ₹{dish.price}
                  </span>
                </div>
                <p className="text-[11px] text-[#D8D2C5]/70 font-sans line-clamp-1">
                  {dish.tagline}
                </p>
                <div className="flex items-center gap-3 font-mono text-[10px] text-stone-400 pt-1">
                  <span>{dish.calories} kcal</span>
                  <span>•</span>
                  <span>{dish.macros.protein}g protein</span>
                </div>
              </div>
            </div>
          ))}
        </div>

      </section>

      {/* --------------------------------------------------------------------- */}
      {/* FOUR SIMPLE STEPS ROADMAP ("Find an option in four simple steps")      */}
      {/* --------------------------------------------------------------------- */}
      <section id="steps" className="py-24 px-4 sm:px-8 max-w-6xl mx-auto space-y-12">
        <div className="text-center space-y-3">
          <span className="font-mono text-xs text-[#C8FF47] tracking-[0.2em] uppercase font-semibold">
            THE PROCESS
          </span>
          <h2 className="font-serif text-3xl sm:text-5xl font-bold text-[#F4F0E5] tracking-tight">
            Find an option in four simple steps.
          </h2>
          <p className="text-xs sm:text-sm text-[#D8D2C5]/70 font-sans max-w-xl mx-auto">
            Less time searching. More clarity to choose without sensory exhaustion.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {FOUR_STEPS.map((step) => (
            <div
              key={step.num}
              className="p-7 rounded-[26px] bg-[#131C16] border border-[#233227] space-y-4 relative group hover:border-[#C8FF47]/40 transition-all"
            >
              <span className="font-mono text-3xl font-black text-[#C8FF47]/40 group-hover:text-[#C8FF47] transition-colors">
                {step.num}
              </span>
              <h3 className="font-serif text-lg font-bold text-[#F4F0E5]">
                {step.title}
              </h3>
              <p className="text-xs text-[#D8D2C5]/70 font-sans leading-relaxed">
                {step.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* --------------------------------------------------------------------- */}
      {/* VIP TABLE & TASTING RESERVATION ENGINE                                */}
      {/* --------------------------------------------------------------------- */}
      <section className="py-20 px-4 sm:px-8 max-w-5xl mx-auto">
        <div className="p-8 sm:p-12 rounded-[32px] bg-gradient-to-br from-[#131C16] via-[#101913] to-[#0A100C] border border-[#2B3C2F] shadow-2xl relative overflow-hidden space-y-8">
          
          <div className="max-w-2xl space-y-3">
            <span className="font-mono text-xs text-[#C8FF47] tracking-[0.2em] uppercase font-semibold">
              VIP TABLE BOOKING &amp; CHEF CONSULTATION
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-[#F4F0E5] tracking-tight">
              Reserve your curated culinary session.
            </h2>
            <p className="text-xs sm:text-sm text-[#D8D2C5]/80 font-sans leading-relaxed">
              Skip lines and experience an artisan dining setting designed around your dietary profile. Select your preferred date, party size, and zone.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-4">
            <button
              onClick={() => {
                sounds.playClick();
                setIsReservationOpen(true);
              }}
              className="w-full sm:w-auto px-8 py-4 rounded-full bg-[#C8FF47] hover:bg-[#D6FF66] text-[#0B120E] font-mono font-bold text-xs tracking-widest uppercase transition-all shadow-[0_6px_25px_rgba(200,255,71,0.3)] cursor-pointer flex items-center justify-center gap-2"
            >
              <span>Instant VIP Table Booking</span>
              <ArrowRight className="w-4 h-4 text-[#0B120E]" />
            </button>

            <span className="text-xs font-mono text-stone-400">
              Zero cancellation fees • Immediate Pass Generator
            </span>
          </div>

        </div>
      </section>

      {/* --------------------------------------------------------------------- */}
      {/* FAQ ACCORDION ("What you need to know before choosing")               */}
      {/* --------------------------------------------------------------------- */}
      <section id="faq" className="py-20 px-4 sm:px-8 max-w-4xl mx-auto space-y-8">
        <div className="text-center space-y-3">
          <span className="font-mono text-xs text-[#C8FF47] tracking-[0.2em] uppercase font-semibold">
            ANSWERS &amp; ASSURANCE
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#F4F0E5] tracking-tight">
            What you need to know before choosing.
          </h2>
          <p className="text-xs sm:text-sm text-[#D8D2C5]/70 font-sans">
            Clear facts regarding sourcing, allergen certifications, and booking.
          </p>
        </div>

        <div className="space-y-3">
          {FAQS.map((faq, idx) => {
            const isOpen = activeFaqIndex === idx;
            return (
              <div
                key={idx}
                className="rounded-2xl bg-[#131C16] border border-[#233227] overflow-hidden transition-all"
              >
                <button
                  onClick={() => {
                    sounds.playClick();
                    setActiveFaqIndex(isOpen ? -1 : idx);
                  }}
                  className="w-full p-5 text-left flex items-center justify-between gap-4 font-serif font-semibold text-base text-[#F4F0E5] hover:text-[#C8FF47] transition cursor-pointer"
                >
                  <span>{faq.q}</span>
                  <ChevronDown className={`w-4 h-4 text-[#C8FF47] transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
                </button>

                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="px-5 pb-5 text-xs text-[#D8D2C5]/75 font-sans leading-relaxed border-t border-[#233227]/50 pt-3"
                    >
                      {faq.a}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </section>

      {/* --------------------------------------------------------------------- */}
      {/* MODERNIST MINIMAL LUXURY FOOTER                                       */}
      {/* --------------------------------------------------------------------- */}
      <footer className="pt-20 pb-12 px-4 sm:px-8 border-t border-[#1C2A20] bg-[#080E0A] text-[#D8D2C5]/70 font-sans text-xs">
        <div className="max-w-7xl mx-auto space-y-12">
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="space-y-3 md:col-span-2">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#C8FF47]"></span>
                <span className="font-mono text-sm font-bold tracking-widest text-[#F4F0E5] uppercase">
                  VELOUR // HEALTHY MENU
                </span>
              </div>
              <p className="text-xs text-[#D8D2C5]/60 max-w-md leading-relaxed">
                A visual culinary flagship engineered for discovering clean nourishment, comparing nutritional combinations, and choosing with complete clarity.
              </p>
              <div className="font-mono text-[11px] text-[#C8FF47] pt-1">
                DRIPP MEDIA WHITE-LABEL ARCHITECTURE // 03
              </div>
            </div>

            <div className="space-y-2">
              <h5 className="font-mono text-xs font-bold text-[#F4F0E5] uppercase tracking-wider">
                HOURS &amp; ACCESS
              </h5>
              <p className="text-[11px] text-[#D8D2C5]/60">Monday – Friday: 7:30 AM – 10:00 PM</p>
              <p className="text-[11px] text-[#D8D2C5]/60">Saturday – Sunday: 8:00 AM – 11:30 PM</p>
              <p className="text-[11px] text-[#C8FF47] pt-1 font-mono">Open for Dine-In &amp; Private Tastings</p>
            </div>

            <div className="space-y-2">
              <h5 className="font-mono text-xs font-bold text-[#F4F0E5] uppercase tracking-wider">
                SANCTUARY LOCATION
              </h5>
              <p className="text-[11px] text-[#D8D2C5]/60">Via Monte Napoleone 42, Milan</p>
              <p className="text-[11px] text-[#D8D2C5]/60">concierge@velour-bistro.com</p>
              <p className="text-[11px] text-[#D8D2C5]/60">+39 02 8945 2200</p>
            </div>
          </div>

          <div className="pt-8 border-t border-[#16231A] flex flex-col sm:flex-row items-center justify-between gap-4 font-mono text-[11px]">
            <span>© 2026 VELOUR HEALTHY MENU. ALL RIGHTS RESERVED.</span>
            <div className="flex items-center gap-4">
              <button
                onClick={() => {
                  sounds.playClick();
                  if (onBackToVariants) onBackToVariants();
                  else if (onBackToCatalogue) onBackToCatalogue();
                }}
                className="hover:text-[#C8FF47] transition cursor-pointer"
              >
                ← Return to Archetype Chooser
              </button>
              <span>•</span>
              <button
                onClick={() => {
                  sounds.playClick();
                  if (onBackToCatalogue) onBackToCatalogue();
                }}
                className="hover:text-[#C8FF47] transition cursor-pointer"
              >
                Master Catalogue
              </button>
            </div>
          </div>

        </div>
      </footer>

      {/* --------------------------------------------------------------------- */}
      {/* FLOATING COMPARISON TRAY (When dishes are selected)                   */}
      {/* --------------------------------------------------------------------- */}
      <AnimatePresence>
        {comparedDishes.length > 0 && !isCompareOpen && (
          <motion.div
            initial={{ y: 80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 80, opacity: 0 }}
            className="fixed bottom-6 inset-x-4 sm:inset-x-auto sm:left-1/2 sm:-translate-x-1/2 z-50 max-w-xl w-full"
          >
            <div className="p-4 rounded-2xl bg-[#0B120E]/95 backdrop-blur-xl border border-[#C8FF47]/40 shadow-2xl shadow-black flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="flex -space-x-2">
                  {comparedDishes.map((d) => (
                    <img
                      key={d.id}
                      src={d.image}
                      alt={d.name}
                      className="w-10 h-10 rounded-full object-cover border-2 border-[#0B120E]"
                    />
                  ))}
                </div>
                <div>
                  <p className="font-mono text-xs font-bold text-[#F4F0E5]">
                    {comparedDishes.length === 1 ? '1 Dish Selected' : '2 Dishes Ready for Comparison'}
                  </p>
                  <p className="text-[10px] font-mono text-[#C8FF47]">
                    {comparedDishes.map((d) => d.name).join(' vs ')}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    sounds.playClick();
                    setComparedDishes([]);
                  }}
                  className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-stone-400 hover:text-white transition cursor-pointer text-xs font-mono"
                >
                  Clear
                </button>
                <button
                  onClick={() => {
                    sounds.playClick();
                    setIsCompareOpen(true);
                  }}
                  className="px-4 py-2 rounded-xl bg-[#C8FF47] hover:bg-[#D6FF66] text-[#0B120E] font-mono text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 cursor-pointer shadow-md"
                >
                  <span>Compare</span>
                  <ArrowRight className="w-3.5 h-3.5" />
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
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsCompareOpen(false)}
              className="fixed inset-0 bg-black/85 backdrop-blur-xl -z-10"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 20 }}
              className="w-full max-w-4xl bg-[#0E1611] border border-[#233227] rounded-[32px] overflow-hidden shadow-2xl my-8 flex flex-col max-h-[90vh]"
            >
              {/* Header */}
              <div className="p-6 border-b border-[#233227] flex items-center justify-between bg-white/[0.02]">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#C8FF47] text-[#0B120E] flex items-center justify-center font-bold">
                    <Layers className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="font-mono text-[10px] text-[#C8FF47] tracking-widest uppercase">
                      SIDE-BY-SIDE EVALUATION
                    </span>
                    <h3 className="font-serif font-bold text-xl text-[#F4F0E5]">
                      Compare Dishes with Complete Clarity
                    </h3>
                  </div>
                </div>

                <button
                  onClick={() => setIsCompareOpen(false)}
                  className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-stone-300 hover:text-white transition cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Split Comparison Columns */}
              <div className="p-6 overflow-y-auto flex-grow space-y-6">
                {comparedDishes.length === 0 ? (
                  <div className="text-center py-12 space-y-3">
                    <p className="font-serif text-lg text-stone-300">No dishes selected yet</p>
                    <p className="text-xs text-stone-400 font-sans">
                      Tap the "+ Compare" pill on any 2 dishes on the menu to see their macro differences side-by-side.
                    </p>
                  </div>
                ) : (
                  <div className={`grid grid-cols-1 ${comparedDishes.length === 2 ? 'md:grid-cols-2' : 'max-w-md mx-auto'} gap-6`}>
                    {comparedDishes.map((dish) => (
                      <div
                        key={dish.id}
                        className="p-6 rounded-3xl bg-[#131C16] border border-[#233227] space-y-5 flex flex-col justify-between"
                      >
                        <div className="space-y-4">
                          <img
                            src={dish.image}
                            alt={dish.name}
                            className="w-full h-44 rounded-2xl object-cover"
                          />
                          <div>
                            <div className="flex items-baseline justify-between gap-2">
                              <h4 className="font-serif font-bold text-lg text-[#F4F0E5]">
                                {dish.name}
                              </h4>
                              <span className="font-mono text-sm font-bold text-[#C8FF47]">
                                ₹{dish.price}
                              </span>
                            </div>
                            <p className="text-xs font-mono text-[#C8FF47] mt-0.5">
                              {dish.tagline}
                            </p>
                          </div>

                          {/* Nutrition Grid */}
                          <div className="grid grid-cols-4 gap-2 text-center font-mono">
                            <div className="p-2 rounded-xl bg-black/40 border border-white/5">
                              <span className="text-[9px] text-stone-400 block">KCAL</span>
                              <span className="text-xs font-bold text-white">{dish.calories}</span>
                            </div>
                            <div className="p-2 rounded-xl bg-black/40 border border-white/5">
                              <span className="text-[9px] text-[#C8FF47] block">PROTEIN</span>
                              <span className="text-xs font-bold text-[#C8FF47]">{dish.macros.protein}g</span>
                            </div>
                            <div className="p-2 rounded-xl bg-black/40 border border-white/5">
                              <span className="text-[9px] text-stone-400 block">CARBS</span>
                              <span className="text-xs font-bold text-white">{dish.macros.carbs}g</span>
                            </div>
                            <div className="p-2 rounded-xl bg-black/40 border border-white/5">
                              <span className="text-[9px] text-stone-400 block">FAT</span>
                              <span className="text-xs font-bold text-white">{dish.macros.fat}g</span>
                            </div>
                          </div>

                          {/* Sensory Profile */}
                          <div className="space-y-1 font-sans text-xs">
                            <span className="font-mono text-[10px] text-stone-400 uppercase tracking-wider block">
                              FLAVOR PROFILE:
                            </span>
                            <p className="text-stone-300 italic">{dish.flavorNotes}</p>
                          </div>

                          {/* Routine Suitability */}
                          <div className="space-y-1 font-sans text-xs">
                            <span className="font-mono text-[10px] text-[#C8FF47] uppercase tracking-wider block">
                              SUITED FOR:
                            </span>
                            <p className="text-stone-300">{dish.routineFit}</p>
                          </div>

                          {/* Ingredients */}
                          <div className="space-y-1 text-xs">
                            <span className="font-mono text-[10px] text-stone-400 uppercase tracking-wider block">
                              KEY INGREDIENTS:
                            </span>
                            <div className="flex flex-wrap gap-1">
                              {dish.ingredients.map((ing, i) => (
                                <span key={i} className="px-2 py-0.5 rounded-md bg-white/[0.04] text-stone-300 text-[10px] font-mono">
                                  {ing}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>

                        <button
                          onClick={() => {
                            sounds.playClick();
                            setIsCompareOpen(false);
                            setIsReservationOpen(true);
                          }}
                          className="w-full py-3 rounded-xl bg-[#C8FF47] hover:bg-[#D6FF66] text-[#0B120E] font-mono text-xs font-bold uppercase tracking-wider transition cursor-pointer"
                        >
                          Reserve Tasting for This Dish
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* --------------------------------------------------------------------- */}
      {/* INDIVIDUAL DISH INSPECTION MODAL                                      */}
      {/* --------------------------------------------------------------------- */}
      <AnimatePresence>
        {activeDishModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setActiveDishModal(null)}
              className="fixed inset-0 bg-black/85 backdrop-blur-xl -z-10"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 20 }}
              className="w-full max-w-2xl bg-[#0E1611] border border-[#233227] rounded-[32px] overflow-hidden shadow-2xl my-8 flex flex-col"
            >
              <div className="relative aspect-[16/10] overflow-hidden">
                <img
                  src={activeDishModal.image}
                  alt={activeDishModal.name}
                  className="w-full h-full object-cover"
                />
                <button
                  onClick={() => setActiveDishModal(null)}
                  className="absolute top-4 right-4 p-2 rounded-full bg-black/70 text-white hover:text-[#C8FF47] transition cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
                <div className="absolute bottom-4 left-4 font-mono text-xs px-3 py-1 rounded-full bg-[#0B120E]/90 text-[#C8FF47] font-bold">
                  ₹{activeDishModal.price} • {activeDishModal.calories} kcal
                </div>
              </div>

              <div className="p-6 sm:p-8 space-y-6">
                <div>
                  <span className="font-mono text-[10px] text-[#C8FF47] tracking-widest uppercase">
                    {activeDishModal.season}
                  </span>
                  <h3 className="font-serif text-2xl font-bold text-[#F4F0E5] mt-1">
                    {activeDishModal.name}
                  </h3>
                  <p className="text-xs font-mono text-stone-400 mt-0.5">
                    {activeDishModal.tagline}
                  </p>
                  <p className="text-xs sm:text-sm text-[#D8D2C5]/80 font-sans mt-3 leading-relaxed">
                    {activeDishModal.description}
                  </p>
                </div>

                {/* Macro Breakdown */}
                <div className="p-4 rounded-2xl bg-[#131C16] border border-[#233227] grid grid-cols-4 gap-2 text-center font-mono">
                  <div>
                    <span className="text-[10px] text-stone-400 block">ENERGY</span>
                    <span className="text-sm font-bold text-white">{activeDishModal.calories} kcal</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-[#C8FF47] block">PROTEIN</span>
                    <span className="text-sm font-bold text-[#C8FF47]">{activeDishModal.macros.protein}g</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-stone-400 block">CARBS</span>
                    <span className="text-sm font-bold text-white">{activeDishModal.macros.carbs}g</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-stone-400 block">FATS</span>
                    <span className="text-sm font-bold text-white">{activeDishModal.macros.fat}g</span>
                  </div>
                </div>

                <div className="space-y-3 font-sans text-xs text-[#D8D2C5]/85">
                  <div>
                    <span className="font-mono text-[10px] text-[#C8FF47] tracking-wider uppercase block">
                      PAIRING RECOMMENDATION:
                    </span>
                    <p>{activeDishModal.pairing}</p>
                  </div>
                  <div>
                    <span className="font-mono text-[10px] text-[#C8FF47] tracking-wider uppercase block">
                      SUITED FOR:
                    </span>
                    <p>{activeDishModal.routineFit}</p>
                  </div>
                </div>

                <div className="pt-2 flex items-center gap-3">
                  <button
                    onClick={() => {
                      toggleCompare(activeDishModal);
                      setActiveDishModal(null);
                    }}
                    className="flex-1 py-3 px-4 rounded-xl bg-white/[0.05] hover:bg-white/10 text-stone-200 font-mono text-xs font-medium transition cursor-pointer border border-white/10 flex items-center justify-center gap-2"
                  >
                    <Layers className="w-4 h-4 text-[#C8FF47]" />
                    <span>Add to Compare</span>
                  </button>

                  <button
                    onClick={() => {
                      sounds.playClick();
                      setActiveDishModal(null);
                      setIsReservationOpen(true);
                    }}
                    className="flex-1 py-3 px-4 rounded-xl bg-[#C8FF47] hover:bg-[#D6FF66] text-[#0B120E] font-mono text-xs font-bold uppercase tracking-wider transition cursor-pointer flex items-center justify-center gap-1.5 shadow-lg"
                  >
                    <span>Reserve Tasting</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* --------------------------------------------------------------------- */}
      {/* VIP TABLE & TASTING RESERVATION MODAL                                 */}
      {/* --------------------------------------------------------------------- */}
      <AnimatePresence>
        {isReservationOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => {
                setIsReservationOpen(false);
                setReservationSuccess(false);
              }}
              className="fixed inset-0 bg-black/85 backdrop-blur-xl -z-10"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="w-full max-w-xl bg-[#0E1611] border border-[#233227] rounded-[32px] overflow-hidden shadow-2xl my-8 flex flex-col"
            >
              <div className="p-6 border-b border-[#233227] flex items-center justify-between bg-white/[0.02]">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#C8FF47] text-[#0B120E] flex items-center justify-center font-bold">
                    <Calendar className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="font-mono text-[10px] text-[#C8FF47] tracking-widest uppercase">
                      VIP TABLE RESERVATION
                    </span>
                    <h3 className="font-serif font-bold text-lg text-[#F4F0E5]">
                      Curated In-Bistro Seating
                    </h3>
                  </div>
                </div>

                <button
                  onClick={() => {
                    setIsReservationOpen(false);
                    setReservationSuccess(false);
                  }}
                  className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-stone-300 hover:text-white transition cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6 sm:p-8 space-y-6">
                {reservationSuccess ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center space-y-5"
                  >
                    <div className="w-16 h-16 rounded-full bg-[#C8FF47] text-[#0B120E] mx-auto flex items-center justify-center shadow-xl shadow-[#C8FF47]/20">
                      <Check className="w-8 h-8 stroke-[3]" />
                    </div>

                    <div className="space-y-1">
                      <span className="text-[11px] font-mono px-3 py-1 rounded-full bg-[#C8FF47]/20 text-[#C8FF47] font-bold border border-[#C8FF47]/30">
                        RESERVATION CONFIRMED
                      </span>
                      <h4 className="font-serif font-bold text-2xl text-[#F4F0E5] pt-2">
                        Your VIP Table is Reserved
                      </h4>
                      <p className="text-xs text-[#D8D2C5]/70 font-sans max-w-sm mx-auto">
                        A confirmation ticket has been dispatched. Our sommelier and culinary floor captain look forward to welcoming you.
                      </p>
                    </div>

                    {/* Digital Pass Mockup */}
                    <div className="p-4 rounded-2xl bg-[#131C16] border border-[#233227] text-left font-mono text-xs space-y-2.5 max-w-md mx-auto">
                      <div className="flex items-center justify-between pb-2 border-b border-[#233227]">
                        <span className="text-stone-400">PASS ID:</span>
                        <span className="text-[#C8FF47] font-bold">{generatedPass?.passId}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-stone-400">GUEST:</span>
                        <span className="text-white font-bold">{generatedPass?.name}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-stone-400">DATE &amp; TIME:</span>
                        <span className="text-white">{generatedPass?.date} • {generatedPass?.time}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-stone-400">ZONE:</span>
                        <span className="text-white">{generatedPass?.seating} ({generatedPass?.guests} Guests)</span>
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        sounds.playClick();
                        setIsReservationOpen(false);
                        setReservationSuccess(false);
                      }}
                      className="w-full py-3.5 rounded-full bg-[#C8FF47] hover:bg-[#D6FF66] text-[#0B120E] font-mono text-xs font-bold uppercase tracking-wider transition cursor-pointer"
                    >
                      Done • Return to Showcase
                    </button>
                  </motion.div>
                ) : (
                  <form onSubmit={handleReservationSubmit} className="space-y-4">
                    
                    {/* Seating Zone Selector */}
                    <div className="space-y-2">
                      <label className="text-[11px] font-mono text-stone-400 uppercase tracking-wider block">
                        Select Seating Atmosphere
                      </label>
                      <div className="grid grid-cols-3 gap-2">
                        {['Indoor Solarium', 'Terrace Garden', 'Chef Tasting Alcove'].map((zone) => (
                          <div
                            key={zone}
                            onClick={() => { sounds.playClick(); setResSeating(zone); }}
                            className={`p-3 rounded-xl border text-center cursor-pointer transition ${
                              resSeating === zone
                                ? 'bg-[#C8FF47]/20 border-[#C8FF47] text-[#C8FF47] font-bold'
                                : 'bg-[#131C16] border-[#233227] text-stone-400 hover:text-white'
                            }`}
                          >
                            <p className="text-[11px] font-serif leading-tight">{zone}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Date & Time */}
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="text-[10px] font-mono text-stone-400">Date</label>
                        <select
                          value={resDate}
                          onChange={(e) => setResDate(e.target.value)}
                          className="w-full px-3 py-2.5 rounded-xl bg-[#131C16] border border-[#233227] text-white text-xs font-mono focus:outline-none focus:border-[#C8FF47]"
                        >
                          <option>Today</option>
                          <option>Tomorrow</option>
                          <option>This Friday</option>
                          <option>This Saturday</option>
                          <option>This Sunday</option>
                        </select>
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] font-mono text-stone-400">Time Slot</label>
                        <select
                          value={resTime}
                          onChange={(e) => setResTime(e.target.value)}
                          className="w-full px-3 py-2.5 rounded-xl bg-[#131C16] border border-[#233227] text-white text-xs font-mono focus:outline-none focus:border-[#C8FF47]"
                        >
                          <option>12:30 PM (Lunch)</option>
                          <option>1:00 PM (Lunch)</option>
                          <option>2:15 PM (Afternoon)</option>
                          <option>7:00 PM (Dinner)</option>
                          <option>8:30 PM (Sunset Tasting)</option>
                        </select>
                      </div>
                    </div>

                    {/* Guests & Contact */}
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="text-[10px] font-mono text-stone-400">Party Size</label>
                        <select
                          value={resGuests}
                          onChange={(e) => setResGuests(Number(e.target.value))}
                          className="w-full px-3 py-2.5 rounded-xl bg-[#131C16] border border-[#233227] text-white text-xs font-mono focus:outline-none focus:border-[#C8FF47]"
                        >
                          <option value={1}>1 Guest (Solo Mindful)</option>
                          <option value={2}>2 Guests (Intimate Table)</option>
                          <option value={4}>4 Guests (Dinner Party)</option>
                          <option value={6}>6 Guests (Salon Tasting)</option>
                        </select>
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] font-mono text-stone-400">Guest Name</label>
                        <input
                          type="text"
                          required
                          value={guestName}
                          onChange={(e) => setGuestName(e.target.value)}
                          className="w-full px-3 py-2.5 rounded-xl bg-[#131C16] border border-[#233227] text-white text-xs font-sans focus:outline-none focus:border-[#C8FF47]"
                        />
                      </div>
                    </div>

                    {/* Dietary Accommodation Notes */}
                    <div className="space-y-1">
                      <label className="text-[10px] font-mono text-stone-400">Dietary Preferences &amp; Allergies</label>
                      <input
                        type="text"
                        value={dietaryNotes}
                        onChange={(e) => setDietaryNotes(e.target.value)}
                        placeholder="e.g. Gluten-free, no peanuts, high-protein"
                        className="w-full px-3 py-2.5 rounded-xl bg-[#131C16] border border-[#233227] text-white text-xs font-sans focus:outline-none focus:border-[#C8FF47]"
                      />
                    </div>

                    <div className="pt-2">
                      <button
                        type="submit"
                        className="w-full py-3.5 rounded-xl bg-[#C8FF47] hover:bg-[#D6FF66] text-[#0B120E] font-mono text-xs font-bold uppercase tracking-wider transition cursor-pointer flex items-center justify-center gap-2 shadow-xl"
                      >
                        <span>Confirm VIP Reservation Pass</span>
                        <ArrowRight className="w-4 h-4 text-[#0B120E]" />
                      </button>
                    </div>

                  </form>
                )}
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
