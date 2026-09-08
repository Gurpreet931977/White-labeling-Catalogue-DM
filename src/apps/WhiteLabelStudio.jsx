import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, 
  ArrowRight,
  ArrowUpRight, 
  Download, 
  Copy, 
  Check, 
  Upload, 
  Smartphone, 
  Laptop, 
  Palette, 
  Type, 
  Code2, 
  Zap, 
  Flame, 
  Crown,
  Gauge, 
  Terminal,
  Utensils,
  Stethoscope,
  Dumbbell,
  Wine,
  Trophy,
  Scissors,
  CheckCircle2,
  Sliders,
  Layers,
  ShoppingBag,
  ExternalLink,
  Star,
  Heart,
  ChevronRight,
  Rocket
} from 'lucide-react';
import { sounds } from '../utils/audio';

// 6 Crazy & Creative Design Styles
export const CRAZY_STYLES = [
  {
    id: "cyber-hud",
    name: "Cyberpunk 2077 HUD",
    shortName: "Cyber HUD",
    icon: Terminal,
    category: "Sci-Fi & Terminal",
    accentGlow: "rgba(235, 215, 63, 0.4)",
    c60: "#06080b",
    c30: "#0c1017",
    c10: "#ebd73f",
    tagline: "Laser scanlines, HUD targeting telemetry & neon terminal buttons"
  },
  {
    id: "neo-brutalist",
    name: "Neo-Brutalism Drop",
    shortName: "Neo-Brutalist",
    icon: Flame,
    category: "Hypebeast & Raw",
    accentGlow: "#ebd73f",
    c60: "#ebd73f",
    c30: "#ffffff",
    c10: "#000000",
    tagline: "Thick 4px black strokes, tilted sticker badges & live marquee ticker"
  },
  {
    id: "liquid-glass",
    name: "Liquid Aura Chrome",
    shortName: "Liquid Glass",
    icon: Crown,
    category: "Iridescent & Crystal",
    accentGlow: "rgba(168, 85, 247, 0.4)",
    c60: "#070709",
    c30: "#13131a",
    c10: "#c084fc",
    tagline: "Floating aurora orbs, frosted crystal refraction & glossy depth"
  },
  {
    id: "editorial-luxury",
    name: "Ultra-Luxury Editorial",
    shortName: "Vogue Luxury",
    icon: Crown,
    category: "High-Fashion & Void",
    accentGlow: "rgba(212, 175, 55, 0.3)",
    c60: "#050505",
    c30: "#0f0f0f",
    c10: "#d4af37",
    tagline: "High-fashion Roman numerals, gold leaf borders & generous whitespace"
  },
  {
    id: "pop-candy",
    name: "Y2K Pop Candy",
    shortName: "Bouncy Pop",
    icon: Zap,
    category: "Playful & Cheerful",
    accentGlow: "rgba(244, 63, 94, 0.4)",
    c60: "#0e0914",
    c30: "#1b1226",
    c10: "#f43f5e",
    tagline: "Extra bouncy 36px pill curves, squishy buttons & floating sticker fun"
  },
  {
    id: "high-octane",
    name: "High-Octane Racing",
    shortName: "Carbon Nitro",
    icon: Gauge,
    category: "Motorsport & Speed",
    accentGlow: "rgba(235, 215, 63, 0.5)",
    c60: "#0a0a0a",
    c30: "#161616",
    c10: "#ebd73f",
    tagline: "Carbon fiber weaves, dual racing stripes & aggressive 12-degree speed skews"
  }
];

// Step 1 Categories & Step 2 Models
export const CATEGORY_MODELS = [
  {
    id: "cafes",
    name: "Cafes & Eateries",
    icon: Utensils,
    tagline: "From artisan cafes with QR table ordering to specialty micro-roasteries",
    models: [
      {
        id: "thc-diner",
        name: "Artisan Cafe & Dine-In Table QR",
        subtitle: "Table QR & Dine-In Model",
        badge: "FULL-STACK LIVE APP",
        isLiveTHC: true,
        tagline: "Table QR Ordering, Dish Customization & PIN Staff Terminal",
        item1: "Wood-Fired Margherita Basilico",
        price1: "349",
        item2: "Smoked Alfredo Penne & Brew",
        price2: "269",
        specialAction: "Launch Full Live THC Website",
        stat1: "2.8x Table Speed",
        stat2: "99.4% Precision"
      },
      {
        id: "self-serve",
        name: "Self-Serve & Counter Pickup QSR",
        subtitle: "Self-Serve Counter Model",
        badge: "ZERO TABLE SERVICE",
        isLiveTHC: true,
        tagline: "Mobile & Kiosk Ordering with Automated Counter Queue Tokens (e.g. TOKEN #C-14)",
        item1: "Double Smash Cheeseburger & Fries",
        price1: "299",
        item2: "Iced Caramel Macchiato Float",
        price2: "189",
        specialAction: "Test Counter Token Flow",
        stat1: "45s Avg Order",
        stat2: "3.2x Velocity"
      },
      {
        id: "showcase",
        name: "Brand Showcase Landing Page",
        subtitle: "Showcase & Menu Model",
        badge: "SHOWCASE ONLY",
        isLiveTHC: true,
        tagline: "Curated Menu Showcase, Brand Storytelling & VIP Table Reservation Engine",
        item1: "VIP Indoor Warm Dining Table",
        price1: "Pass #9042",
        item2: "Terrace Sunset Wine Table",
        price2: "Pass #9043",
        specialAction: "Test Table Reservation",
        stat1: "94% Booking Rate",
        stat2: "0% No-Shows"
      },
      {
        id: "delivery",
        name: "Direct Doorstep Online Delivery",
        subtitle: "Direct Delivery Model",
        badge: "0% COMMISSIONS",
        isLiveTHC: true,
        tagline: "Direct-to-Consumer Doorstep Delivery with Address Capture & Live Rider Tracker",
        item1: "Quattro Formaggi Pizza Box",
        price1: "449",
        item2: "Nutella Hazelnut Thickshake",
        price2: "229",
        specialAction: "Test Delivery Address Flow",
        stat1: "30% Margin Saved",
        stat2: "35m Avg Delivery"
      },
      {
        id: "hybrid",
        name: "Hybrid Dine-In & Doorstep Delivery",
        subtitle: "Omnichannel 3-in-1 Model",
        badge: "ALL-IN-ONE HYBRID",
        isLiveTHC: true,
        tagline: "Seamless Switcher: Table QR Dine-In, Doorstep Delivery & Express Takeaway",
        item1: "Pesto Tagliatelle Bowl",
        price1: "289",
        item2: "Tiramisu Classico della Casa",
        price2: "229",
        specialAction: "Test Dual-Mode Switcher",
        stat1: "3.5x Revenue",
        stat2: "Unified POS"
      },
      {
        id: "loyalty",
        name: "Loyalty Rewards & 7-Visit Punch Card",
        subtitle: "Billing-Integrated Punch Card",
        badge: "HIGH RETENTION",
        isLiveTHC: true,
        tagline: "7-Stamp Digital Punch Card • Billing Auto-Stamps +1 • 50% OFF on 7th Visit",
        item1: "7th Visit Milestone Reward (50% OFF)",
        price1: "FREE / 50%",
        item2: "Artisan Velvet Flat White",
        price2: "169",
        specialAction: "Test 7-Stamp Punch Card",
        stat1: "4.8x Repeat Visits",
        stat2: "87% Adoption"
      }
    ]
  },
  {
    id: "clinics",
    name: "Medical & Dental Clinics",
    icon: Stethoscope,
    tagline: "Cosmetic dentistry, smile simulators & telehealth slot bookings",
    models: [
      {
        id: "dental-aesthetic",
        name: "Cosmetic Dental & Aesthetics",
        subtitle: "AuraCare Practice",
        badge: "TREATMENT PLANNER",
        isLiveTHC: false,
        tagline: "Digital Smile Simulator, Treatment Deposit & Doctor Scheduling",
        item1: "Digital Smile Design Consultation",
        price1: "999",
        item2: "HydraGlow Skin Resurfacing",
        price2: "3,200",
        specialAction: "Book Specialist Slot",
        stat1: "98% Slot Fill",
        stat2: "VIP Concierge"
      },
      {
        id: "urgent-telehealth",
        name: "Urgent Care & Telehealth",
        subtitle: "PulseCare Virtual",
        badge: "INSTANT QUEUE",
        isLiveTHC: false,
        tagline: "10-Minute Video Consult Queue & Digital E-Prescriptions",
        item1: "Instant Video Doctor Consult (15m)",
        price1: "499",
        item2: "Full Diagnostic Health Screen",
        price2: "1,899",
        specialAction: "Join Virtual Queue",
        stat1: "10m Wait Time",
        stat2: "100% HIPAA Ready"
      }
    ]
  },
  {
    id: "gyms",
    name: "Gyms & CrossFit",
    icon: Dumbbell,
    tagline: "Class booking calendars, workout logs & 24/7 keycard turnstile passes",
    models: [
      {
        id: "crossfit-strength",
        name: "CrossFit & Strength Arena",
        subtitle: "Titan Arena Model",
        badge: "WOD CALENDAR",
        isLiveTHC: false,
        tagline: "Live Class Capacity Scheduler & Personal Coaching Marketplace",
        item1: "Unlimited WOD Class Pass (Monthly)",
        price1: "3,499",
        item2: "1-on-1 Olympic Lifting Coach (3x)",
        price2: "2,500",
        specialAction: "Reserve Spot in WOD",
        stat1: "300+ Members",
        stat2: "Zero Overcrowd"
      },
      {
        id: "fitness-247",
        name: "24/7 Keycard Fitness Club",
        subtitle: "Pulse24 Fitness",
        badge: "DIGITAL PASS",
        isLiveTHC: false,
        tagline: "Instant Turnstile QR Pass & Recurring Membership Engine",
        item1: "24/7 All-Access Monthly Pass",
        price1: "1,999",
        item2: "1-Day VIP Drop-In Pass",
        price2: "499",
        specialAction: "Generate Mobile Pass",
        stat1: "Instant Access",
        stat2: "Auto-Renewal"
      }
    ]
  },
  {
    id: "clubs",
    name: "Nightclubs & VIP Lounges",
    icon: Wine,
    tagline: "Interactive 3D table floorplans, bottle service & guestlist RSVP passes",
    models: [
      {
        id: "vip-booths",
        name: "VIP Bottle Service Lounge",
        subtitle: "Velvet Sky Lounge",
        badge: "MINIMUM SPEND",
        isLiveTHC: false,
        tagline: "Floorplan Table Selection with Minimum Spend Pre-Authorization",
        item1: "Center Dancefloor Booth (6 Guests)",
        price1: "25,000",
        item2: "Dom Pérignon VIP Table Package",
        price2: "45,000",
        specialAction: "Reserve VIP Table",
        stat1: "100% Pre-Paid",
        stat2: "VIP Concierge"
      },
      {
        id: "guestlist-tickets",
        name: "Nightclub Guestlist & RSVP",
        subtitle: "Nocturne Club",
        badge: "APPLE WALLET QR",
        isLiveTHC: false,
        tagline: "Fast Entry QR Passes, DJ Night Tickets & Ladies Night RSVP",
        item1: "Friday Headliner General Pass",
        price1: "1,500",
        item2: "Couples Guestlist Entry (Before 11PM)",
        price2: "999",
        specialAction: "RSVP to Guestlist",
        stat1: "Sub-Second Entry",
        stat2: "Dynamic Tiers"
      }
    ]
  },
  {
    id: "turfs",
    name: "Sports Turfs & Arenas",
    icon: Trophy,
    tagline: "Hourly box cricket, futsal slot matrices & tournament bracket engines",
    models: [
      {
        id: "box-turf",
        name: "Box Arena & Futsal Turf",
        subtitle: "BoxArena Complex",
        badge: "HOURLY SLOT MATRIX",
        isLiveTHC: false,
        tagline: "Visual Time-Slot Grid, Split Payments & Floodlight Bookings",
        item1: "Prime Floodlit Evening Slot (8-9 PM)",
        price1: "1,499",
        item2: "Weekend Morning Saver Slot (7-8 AM)",
        price2: "999",
        specialAction: "Lock 60m Turf Slot",
        stat1: "Zero Double-Book",
        stat2: "Split-Bill Ready"
      },
      {
        id: "turf-league",
        name: "Tournament & Sports Hub",
        subtitle: "ProLeague Arena",
        badge: "BRACKET LEAGUES",
        isLiveTHC: false,
        tagline: "Multi-Team Registration, Match Schedules & Championship Tables",
        item1: "Corporate Cup Team Registration",
        price1: "12,000",
        item2: "Monthly Junior Multi-Sport Pass",
        price2: "2,999",
        specialAction: "Register Team",
        stat1: "16 Teams Live",
        stat2: "Instant Schedule"
      }
    ]
  },
  {
    id: "salons",
    name: "Luxury Salons & Spas",
    icon: Scissors,
    tagline: "Stylist portfolios, treatment duration scheduler & bespoke memberships",
    models: [
      {
        id: "haute-salon",
        name: "Bespoke Hair & Aesthetic Spa",
        subtitle: "Maison de Luxe",
        badge: "STYLIST PORTFOLIO",
        isLiveTHC: false,
        tagline: "Select Senior Master Stylist, Treatment Duration & Aftercare",
        item1: "Signature Balayage & Silk Glaze",
        price1: "6,500",
        item2: "Korean Glass Skin Hydration Facial",
        price2: "3,800",
        specialAction: "Book Master Stylist",
        stat1: "95% Re-Booking",
        stat2: "Portfolio Sync"
      },
      {
        id: "barbershop-club",
        name: "Gentleman's Grooming Lounge",
        subtitle: "The Heritage Barber",
        badge: "WALK-IN QUEUE",
        isLiveTHC: false,
        tagline: "Real-Time Barber Chair Queue & Monthly Beard VIP Club",
        item1: "Hot Towel Straight Razor Shave",
        price1: "1,200",
        item2: "Beard Sculpt & Charcoal Detox",
        price2: "1,800",
        specialAction: "Join Barber Queue",
        stat1: "Real-Time Chair",
        stat2: "VIP Club Pass"
      }
    ]
  }
];

export function WhiteLabelStudio({ onBackToCatalogue, onLaunchLiveDemo }) {
  // Step Workflow: 1 = Category, 2 = Model, 3 = Styles & Colors, 4 = Export
  const [currentStep, setCurrentStep] = useState(1);

  // Selections
  const [selectedCategory, setSelectedCategory] = useState(CATEGORY_MODELS[0]);
  const [selectedModel, setSelectedModel] = useState(CATEGORY_MODELS[0].models[0]); // Defaults to THC Cafe Model!
  const [selectedStyle, setSelectedStyle] = useState(CRAZY_STYLES[0]);
  
  // Custom Identity
  const [brandName, setBrandName] = useState(CATEGORY_MODELS[0].models[0].subtitle);
  const [tagline, setTagline] = useState(CATEGORY_MODELS[0].models[0].tagline);
  const [currency, setCurrency] = useState('₹');
  const [deviceView, setDeviceView] = useState('desktop'); // 'desktop' | 'mobile'

  // Colors
  const [color60, setColor60] = useState(CRAZY_STYLES[0].c60);
  const [color30, setColor30] = useState(CRAZY_STYLES[0].c30);
  const [color10, setColor10] = useState(CRAZY_STYLES[0].c10);

  // Logo
  const [logoImage, setLogoImage] = useState(null);
  const fileInputRef = useRef(null);

  // Notifications
  const [copiedToast, setCopiedToast] = useState(null);

  // Category Selection
  const handleSelectCategory = (cat) => {
    sounds.playClick();
    setSelectedCategory(cat);
    setSelectedModel(cat.models[0]);
    setBrandName(cat.models[0].subtitle);
    setTagline(cat.models[0].tagline);
    setCurrentStep(2); // Automatically advance to Step 2: Choose Model!
  };

  // Model Selection
  const handleSelectModel = (mod) => {
    sounds.playClick();
    setSelectedModel(mod);
    setBrandName(mod.subtitle);
    setTagline(mod.tagline);
    setCurrentStep(3); // Automatically advance to Step 3: Styles & Colors!
  };

  // Style Selection
  const handleSelectStyle = (st) => {
    sounds.playClick();
    setSelectedStyle(st);
    setColor60(st.c60);
    setColor30(st.c30);
    setColor10(st.c10);
  };

  // Logo Upload
  const handleLogoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setLogoImage(reader.result);
        sounds.playSuccess();
      };
      reader.readAsDataURL(file);
    }
  };

  // Download Config Files
  const downloadFile = (filename, content, mimeType = 'application/json') => {
    sounds.playPop();
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const generateConfigJson = () => {
    return JSON.stringify({
      category: selectedCategory.name,
      model: {
        id: selectedModel.id,
        name: selectedModel.name,
        subtitle: selectedModel.subtitle,
        tagline: selectedModel.tagline
      },
      designStyle: {
        id: selectedStyle.id,
        name: selectedStyle.name,
        category: selectedStyle.category
      },
      branding: {
        brandName,
        tagline,
        currency,
        logoProvided: !!logoImage
      },
      palette: {
        dominant60: color60,
        surface30: color30,
        accent10: color10
      },
      exportedAt: new Date().toISOString()
    }, null, 2);
  };

  const handleDownloadAll = () => {
    downloadFile('brand-config.json', generateConfigJson(), 'application/json');
    setCopiedToast('Full Brand Code Package Exported!');
    setTimeout(() => setCopiedToast(null), 3000);
  };

  const handleCopyJson = () => {
    sounds.playPop();
    navigator.clipboard.writeText(generateConfigJson());
    setCopiedToast('Config JSON Copied to Clipboard!');
    setTimeout(() => setCopiedToast(null), 2500);
  };

  return (
    <div className="min-h-screen bg-[#060606] text-white selection:bg-[#ebd73f] selection:text-black font-sans flex flex-col justify-between">
      
      {/* Top Header & Breadcrumb Step Indicator */}
      <header className="sticky top-0 inset-x-0 z-40 bg-[#060606]/95 backdrop-blur-xl border-b border-white/10 px-4 sm:px-6 py-3">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          
          {/* Back & Title */}
          <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-start">
            <button
              onClick={() => { sounds.playClick(); onBackToCatalogue(); }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 hover:bg-[#ebd73f] hover:text-black text-xs font-semibold transition cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Catalogue</span>
            </button>

            <span className="text-white/20 hidden sm:inline">•</span>
            
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#ebd73f] animate-pulse"></span>
              <span className="font-panchang font-bold text-xs tracking-wider">
                WHITE-LABEL STUDIO
              </span>
            </div>
          </div>

          {/* Stepper Tabs */}
          <div className="flex items-center gap-1 bg-[#111111] p-1 rounded-2xl border border-white/10 text-xs font-clash">
            {[
              { step: 1, label: '1. Category' },
              { step: 2, label: `2. Model (${selectedCategory.name.split(" ")[0]})` },
              { step: 3, label: '3. Style & Colors' },
              { step: 4, label: '4. Export' },
            ].map((s) => (
              <button
                key={s.step}
                onClick={() => { sounds.playClick(); setCurrentStep(s.step); }}
                className={`px-3 py-1.5 rounded-xl transition cursor-pointer text-[11px] whitespace-nowrap ${
                  currentStep === s.step
                    ? 'bg-[#ebd73f] text-black font-bold shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>

          {/* Device & Export */}
          <div className="flex items-center gap-2">
            <div className="flex items-center bg-[#111111] p-1 rounded-xl border border-white/10">
              <button
                onClick={() => { sounds.playClick(); setDeviceView('desktop'); }}
                className={`p-1 px-2.5 rounded-lg text-xs flex items-center gap-1 transition cursor-pointer ${
                  deviceView === 'desktop' ? 'bg-[#ebd73f] text-black font-bold' : 'text-slate-400 hover:text-white'
                }`}
              >
                <Laptop className="w-3.5 h-3.5" />
                <span className="hidden md:inline">Desktop</span>
              </button>
              <button
                onClick={() => { sounds.playClick(); setDeviceView('mobile'); }}
                className={`p-1 px-2.5 rounded-lg text-xs flex items-center gap-1 transition cursor-pointer ${
                  deviceView === 'mobile' ? 'bg-[#ebd73f] text-black font-bold' : 'text-slate-400 hover:text-white'
                }`}
              >
                <Smartphone className="w-3.5 h-3.5" />
                <span className="hidden md:inline">Mobile</span>
              </button>
            </div>

            <button
              onClick={handleDownloadAll}
              className="btn-dripp-primary px-3.5 py-1.5 text-xs font-bold flex items-center gap-1 shadow-lg cursor-pointer"
            >
              <Download className="w-3.5 h-3.5 text-black" />
              <span>Export</span>
            </button>
          </div>

        </div>
      </header>

      {/* Toast Notification */}
      <AnimatePresence>
        {copiedToast && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-16 left-1/2 -translate-x-1/2 z-50 px-4 py-2 rounded-full bg-[#ebd73f] text-black font-bold text-xs shadow-2xl flex items-center gap-2 font-mono"
          >
            <Check className="w-3.5 h-3.5 stroke-[3]" />
            <span>{copiedToast}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Workspace */}
      <main className="max-w-7xl mx-auto w-full px-4 sm:px-6 py-6 grid grid-cols-1 lg:grid-cols-12 gap-6 flex-grow items-start">
        
        {/* LEFT COLUMN: Step-by-Step Interactive Form (5 cols) */}
        <div className="lg:col-span-5 bg-[#0d0d0d] border border-white/10 rounded-3xl p-5 space-y-5 shadow-2xl">
          
          {/* STEP 1: CHOOSE CATEGORY */}
          {currentStep === 1 && (
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[10px] text-[#ebd73f] tracking-widest uppercase">
                    STEP 01 / SELECT NICHE
                  </span>
                  <span className="text-[10px] font-mono text-slate-400">6 AVAILABLE</span>
                </div>
                <h3 className="font-panchang font-bold text-base text-white mt-1">
                  Choose Business Category
                </h3>
                <p className="text-xs text-slate-400 font-clash mt-0.5">
                  Select your client's industry to browse specialized operational models.
                </p>
              </div>

              <div className="space-y-2 max-h-[50vh] overflow-y-auto pr-1">
                {CATEGORY_MODELS.map((cat) => {
                  const Icon = cat.icon;
                  const isSelected = selectedCategory.id === cat.id;
                  return (
                    <div
                      key={cat.id}
                      onClick={() => handleSelectCategory(cat)}
                      className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                        isSelected
                          ? 'bg-[#ebd73f]/15 border-[#ebd73f] shadow-glow-yellow'
                          : 'bg-[#121212] border-white/5 hover:border-white/20 hover:bg-[#181818]'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div 
                          className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                          style={{
                            backgroundColor: isSelected ? '#ebd73f' : 'rgba(255,255,255,0.06)',
                            color: isSelected ? '#000000' : '#ffffff'
                          }}
                        >
                          <Icon className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="font-bold text-xs text-white font-clash">{cat.name}</p>
                          <p className="text-[10px] text-slate-400 font-mono mt-0.5">
                            {cat.models.length} Operational Models
                          </p>
                        </div>
                      </div>

                      <ArrowRight className="w-4 h-4 text-[#ebd73f]" />
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 2: CHOOSE OPERATIONAL MODEL */}
          {currentStep === 2 && (
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[10px] text-[#ebd73f] tracking-widest uppercase">
                    STEP 02 / {selectedCategory.name}
                  </span>
                  <button 
                    onClick={() => setCurrentStep(1)} 
                    className="text-[10px] text-slate-400 hover:text-white underline cursor-pointer"
                  >
                    Change Category
                  </button>
                </div>
                <h3 className="font-panchang font-bold text-base text-white mt-1">
                  Choose Operational Architecture
                </h3>
                <p className="text-xs text-slate-400 font-clash mt-0.5">
                  Select the exact operational flow (e.g. THC QR diner vs roastery vs bistro).
                </p>
              </div>

              <div className="space-y-2.5 max-h-[50vh] overflow-y-auto pr-1">
                {selectedCategory.models.map((mod) => {
                  const isSelected = selectedModel.id === mod.id;
                  return (
                    <div
                      key={mod.id}
                      onClick={() => handleSelectModel(mod)}
                      className={`p-3.5 rounded-2xl border transition-all cursor-pointer space-y-2 ${
                        isSelected
                          ? 'bg-[#ebd73f]/15 border-[#ebd73f] shadow-glow-yellow'
                          : 'bg-[#121212] border-white/5 hover:border-white/20 hover:bg-[#181818]'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-xs text-white font-clash">{mod.name}</span>
                        <span className="text-[9px] font-mono px-2 py-0.5 rounded-full bg-white/10 text-[#ebd73f] font-bold border border-white/10">
                          {mod.badge}
                        </span>
                      </div>

                      <p className="text-[11px] text-slate-300 font-clash leading-snug">
                        {mod.tagline}
                      </p>

                      <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 pt-1 border-t border-white/5">
                        <span className="text-[#ebd73f]">{mod.stat1}</span>
                        <span>{mod.stat2}</span>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="pt-2 flex items-center justify-between">
                <button
                  onClick={() => setCurrentStep(1)}
                  className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-white text-xs font-semibold transition cursor-pointer"
                >
                  ← Back to Categories
                </button>
                <button
                  onClick={() => setCurrentStep(3)}
                  className="btn-dripp-primary px-5 py-2 text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-lg"
                >
                  <span>Customize Styles &amp; Colors</span>
                  <ArrowRight className="w-3.5 h-3.5 text-black" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: CREATIVE STYLES, COLORS & LOGO */}
          {currentStep === 3 && (
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[10px] text-[#ebd73f] tracking-widest uppercase">
                    STEP 03 / AESTHETIC &amp; BRANDING
                  </span>
                  <button 
                    onClick={() => setCurrentStep(2)} 
                    className="text-[10px] text-slate-400 hover:text-white underline cursor-pointer"
                  >
                    Change Model
                  </button>
                </div>
                <h3 className="font-panchang font-bold text-base text-white mt-1">
                  Design Aesthetics &amp; Palette
                </h3>
              </div>

              {/* 6 Crazy Styles Selector */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-mono text-slate-400 uppercase flex items-center justify-between">
                  <span>Creative Design Language</span>
                  <span className="text-[#ebd73f] font-bold">{selectedStyle.name}</span>
                </label>
                <div className="grid grid-cols-2 gap-1.5">
                  {CRAZY_STYLES.map((st) => {
                    const Icon = st.icon;
                    const isSelected = selectedStyle.id === st.id;
                    return (
                      <button
                        key={st.id}
                        onClick={() => handleSelectStyle(st)}
                        className={`p-2.5 rounded-xl border text-left flex items-center gap-2 transition cursor-pointer ${
                          isSelected
                            ? 'bg-[#ebd73f]/20 border-[#ebd73f] text-[#ebd73f] font-bold shadow-md'
                            : 'bg-[#121212] border-white/5 text-slate-300 hover:text-white'
                        }`}
                      >
                        <Icon className="w-3.5 h-3.5 shrink-0" />
                        <span className="text-xs truncate">{st.shortName}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Brand Name & Tagline */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <div className="space-y-1">
                  <label className="text-[10px] font-mono text-slate-400 uppercase">Brand Name</label>
                  <input
                    type="text"
                    value={brandName}
                    onChange={(e) => setBrandName(e.target.value)}
                    className="w-full px-3 py-1.5 rounded-xl bg-black border border-white/15 text-white text-xs font-clash focus:outline-none focus:border-[#ebd73f]"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-mono text-slate-400 uppercase">Tagline</label>
                  <input
                    type="text"
                    value={tagline}
                    onChange={(e) => setTagline(e.target.value)}
                    className="w-full px-3 py-1.5 rounded-xl bg-black border border-white/15 text-white text-xs font-clash focus:outline-none focus:border-[#ebd73f]"
                  />
                </div>
              </div>

              {/* Logo Uploader */}
              <div className="space-y-1">
                <input type="file" ref={fileInputRef} onChange={handleLogoUpload} accept="image/*" className="hidden" />
                <div 
                  onClick={() => fileInputRef.current.click()}
                  className="p-2.5 rounded-xl border border-dashed border-white/20 hover:border-[#ebd73f] bg-black text-center cursor-pointer transition flex items-center justify-center gap-2"
                >
                  <Upload className="w-3.5 h-3.5 text-[#ebd73f]" />
                  <span className="text-xs text-slate-300 font-clash">
                    {logoImage ? 'Change Brand Logo' : 'Upload Custom Logo'}
                  </span>
                  {logoImage && (
                    <button 
                      onClick={(e) => { e.stopPropagation(); setLogoImage(null); }} 
                      className="text-rose-400 text-[10px] hover:underline ml-2"
                    >
                      Remove
                    </button>
                  )}
                </div>
              </div>

              {/* 60-30-10 Colors */}
              <div className="space-y-1.5 pt-1 border-t border-white/10">
                <label className="text-[10px] font-mono text-slate-400 uppercase">60-30-10 Color Engine</label>
                <div className="grid grid-cols-3 gap-2">
                  <div className="p-2 rounded-xl bg-black border border-white/10 text-center">
                    <span className="text-[9px] font-mono text-slate-400">60% Canvas</span>
                    <input
                      type="color"
                      value={color60}
                      onChange={(e) => setColor60(e.target.value)}
                      className="w-full h-6 rounded mt-1 cursor-pointer bg-transparent"
                    />
                  </div>
                  <div className="p-2 rounded-xl bg-black border border-white/10 text-center">
                    <span className="text-[9px] font-mono text-slate-400">30% Surface</span>
                    <input
                      type="color"
                      value={color30}
                      onChange={(e) => setColor30(e.target.value)}
                      className="w-full h-6 rounded mt-1 cursor-pointer bg-transparent"
                    />
                  </div>
                  <div className="p-2 rounded-xl bg-black border border-white/10 text-center">
                    <span className="text-[9px] font-mono text-[#ebd73f]">10% Accent</span>
                    <input
                      type="color"
                      value={color10}
                      onChange={(e) => setColor10(e.target.value)}
                      className="w-full h-6 rounded mt-1 cursor-pointer bg-transparent"
                    />
                  </div>
                </div>
              </div>

              {/* Navigation Buttons */}
              <div className="pt-2 flex items-center justify-between">
                <button
                  onClick={() => setCurrentStep(2)}
                  className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-white text-xs font-semibold transition cursor-pointer"
                >
                  ← Back to Models
                </button>
                <button
                  onClick={() => setCurrentStep(4)}
                  className="btn-dripp-primary px-5 py-2 text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-lg"
                >
                  <span>Export Code Package</span>
                  <ArrowRight className="w-3.5 h-3.5 text-black" />
                </button>
              </div>

            </div>
          )}

          {/* STEP 4: EXPORT PACKAGE */}
          {currentStep === 4 && (
            <div className="space-y-4">
              <div>
                <span className="font-mono text-[10px] text-[#ebd73f] tracking-widest uppercase">
                  STEP 04 / CODE EXPORT
                </span>
                <h3 className="font-panchang font-bold text-base text-white mt-1">
                  Ready for Production Deploy
                </h3>
                <p className="text-xs text-slate-400 font-clash mt-0.5">
                  Package configured for <strong>{selectedModel.name}</strong> styled in <strong>{selectedStyle.name}</strong>.
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-black border border-white/10 space-y-2 text-xs font-mono">
                <div className="flex justify-between border-b border-white/5 pb-1">
                  <span className="text-slate-400">CATEGORY:</span>
                  <span className="text-white">{selectedCategory.name}</span>
                </div>
                <div className="flex justify-between border-b border-white/5 pb-1">
                  <span className="text-slate-400">MODEL:</span>
                  <span className="text-[#ebd73f]">{selectedModel.name}</span>
                </div>
                <div className="flex justify-between border-b border-white/5 pb-1">
                  <span className="text-slate-400">AESTHETIC:</span>
                  <span className="text-white">{selectedStyle.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">PALETTE:</span>
                  <span className="text-white">{color60} • {color30} • {color10}</span>
                </div>
              </div>

              <div className="space-y-2">
                <button
                  onClick={handleDownloadAll}
                  className="w-full btn-dripp-primary py-3 px-4 text-xs font-bold flex items-center justify-center gap-2 cursor-pointer shadow-xl"
                >
                  <Download className="w-4 h-4 text-black" />
                  <span>Download Complete Brand Package (.json)</span>
                </button>

                <button
                  onClick={handleCopyJson}
                  className="w-full py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-white font-mono text-xs flex items-center justify-center gap-1.5 transition cursor-pointer"
                >
                  <Copy className="w-3.5 h-3.5 text-[#ebd73f]" />
                  <span>Copy Configuration JSON</span>
                </button>
              </div>

              <div className="pt-2">
                <button
                  onClick={() => setCurrentStep(3)}
                  className="text-slate-400 hover:text-white text-xs underline cursor-pointer"
                >
                  ← Back to Customize Styles &amp; Colors
                </button>
              </div>
            </div>
          )}

        </div>

        {/* RIGHT COLUMN: The Adaptive Crazy Canvas (7 cols) */}
        <div className="lg:col-span-7 flex flex-col items-center justify-center min-h-[550px] w-full">
          
          <div 
            className={`w-full transition-all duration-700 relative overflow-hidden shadow-2xl ${
              deviceView === 'mobile' 
                ? 'max-w-[340px] rounded-[48px] border-[10px] border-[#222222] shadow-[0_25px_60px_rgba(0,0,0,0.9)]' 
                : 'rounded-3xl border border-white/15'
            }`}
            style={{ 
              backgroundColor: color60,
              color: selectedStyle.id === 'neo-brutalist' ? '#000000' : '#ffffff'
            }}
          >
            
            {/* Desktop Mac Header Dots */}
            {deviceView === 'desktop' && (
              <div className="px-4 py-2.5 border-b border-white/10 flex items-center justify-between bg-black/40 backdrop-blur-md">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80"></span>
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80"></span>
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80"></span>
                </div>
                <span className="text-[10px] font-mono text-slate-400">
                  {brandName.toLowerCase().replace(/\s+/g, '')}.com • {selectedModel.name}
                </span>
                <span className="text-[9px] font-mono text-[#ebd73f]">VERIFIED</span>
              </div>
            )}

            {/* Mobile Notch */}
            {deviceView === 'mobile' && (
              <div className="pt-2 pb-1 flex items-center justify-center">
                <div className="w-24 h-4 rounded-full bg-black border border-white/10 flex items-center justify-end px-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#ebd73f]/60"></span>
                </div>
              </div>
            )}

            {/* ========================================================================= */}
            {/* 1. CYBERPUNK 2077 HUD AESTHETIC                                           */}
            {/* ========================================================================= */}
            {selectedStyle.id === 'cyber-hud' && (
              <div className="p-6 relative cyber-grid overflow-hidden min-h-[460px] flex flex-col justify-between">
                <div className="animate-scanline"></div>

                <div className="flex items-center justify-between font-mono text-[10px] text-[#ebd73f] border-b border-[#ebd73f]/30 pb-2">
                  <div className="flex items-center gap-2">
                    <span className="animate-pulse">SYS.CORE // {selectedModel.name.toUpperCase()}</span>
                    <span>•</span>
                    <span className="text-white">{selectedModel.badge}</span>
                  </div>
                  <span>LATENCY: 4.2ms</span>
                </div>

                <div className="py-6 space-y-3">
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 border border-[#ebd73f] font-mono text-[9px] text-[#ebd73f] bg-black">
                    <span>[ {selectedCategory.name.toUpperCase()} ENGINE ]</span>
                  </div>

                  <h2 className="font-panchang font-black text-2xl sm:text-3xl text-white tracking-tight leading-tight">
                    {brandName} <span className="text-[#ebd73f]">// TERMINAL</span>
                  </h2>
                  <p className="font-mono text-xs text-slate-400 max-w-md">
                    {tagline}. Sub-second responsive checkout protocol.
                  </p>

                  <div className="flex flex-wrap gap-2 pt-1">
                    <button className="px-6 py-3 bg-[#ebd73f] text-black font-mono font-black text-xs uppercase tracking-widest shadow-[0_0_25px_rgba(235,215,63,0.5)] hover:bg-white transition cursor-pointer flex items-center gap-1.5">
                      <Zap className="w-3.5 h-3.5" />
                      <span>[ {selectedModel.specialAction} ]</span>
                    </button>

                    {selectedModel.isLiveTHC && onLaunchLiveDemo && (
                      <button
                        onClick={onLaunchLiveDemo}
                        className="px-4 py-3 bg-white/10 hover:bg-white/20 text-white font-mono text-xs uppercase tracking-wider flex items-center gap-1.5 cursor-pointer"
                      >
                        <ExternalLink className="w-3.5 h-3.5 text-[#ebd73f]" />
                        <span>Launch Full THC Website</span>
                      </button>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3">
                  {[
                    { name: selectedModel.item1, price: selectedModel.price1, code: "MOD.01", status: selectedModel.stat1 },
                    { name: selectedModel.item2, price: selectedModel.price2, code: "MOD.02", status: selectedModel.stat2 },
                  ].map((item, idx) => (
                    <div key={idx} className="p-3.5 bg-black/80 border border-[#ebd73f]/40">
                      <div className="flex justify-between font-mono text-[10px] text-[#ebd73f]">
                        <span>{item.code}</span>
                        <span>{item.status}</span>
                      </div>
                      <p className="font-mono font-bold text-sm text-white mt-1">{item.name}</p>
                      <p className="font-mono text-xs text-[#ebd73f] font-bold mt-1">{currency}{item.price}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ========================================================================= */}
            {/* 2. NEO-BRUTALISM DROP AESTHETIC                                          */}
            {/* ========================================================================= */}
            {selectedStyle.id === 'neo-brutalist' && (
              <div className="bg-[#ebd73f] text-black p-6 min-h-[460px] flex flex-col justify-between relative overflow-hidden font-sans">
                
                {/* Marquee Ticker */}
                <div className="overflow-hidden bg-black text-[#ebd73f] py-1 -mx-6 -mt-6 border-b-4 border-black font-mono text-xs font-black">
                  <div className="animate-marquee whitespace-nowrap">
                    <span>// {selectedCategory.name.toUpperCase()} // {selectedModel.name.toUpperCase()} // 100% UNFILTERED // FAST ACTION //&nbsp;</span>
                    <span>// {selectedCategory.name.toUpperCase()} // {selectedModel.name.toUpperCase()} // 100% UNFILTERED // FAST ACTION //&nbsp;</span>
                  </div>
                </div>

                <div className="py-6 space-y-4">
                  <div className="flex items-center gap-2">
                    <span className="px-3 py-1 bg-black text-white font-black text-xs uppercase -rotate-2 border-2 border-black shadow-[3px_3px_0px_#fff] flex items-center gap-1">
                      <Zap className="w-3 h-3" />
                      {selectedModel.badge}
                    </span>
                    <span className="px-2 py-1 bg-white text-black font-black text-xs uppercase rotate-2 border-2 border-black">
                      RAW
                    </span>
                  </div>

                  <h2 className="font-black text-3xl sm:text-4xl uppercase tracking-tighter leading-none">
                    {brandName}
                  </h2>
                  <p className="font-bold text-xs max-w-md uppercase">
                    {tagline}. No fluff, straight execution.
                  </p>

                  <div className="flex flex-wrap gap-2 pt-1">
                    <button className="px-7 py-3.5 bg-black text-[#ebd73f] font-black text-sm uppercase tracking-wider border-3 border-black shadow-[6px_6px_0px_#000] hover:translate-x-1 hover:translate-y-1 hover:shadow-[2px_2px_0px_#000] active:translate-x-1.5 active:translate-y-1.5 active:shadow-none transition cursor-pointer flex items-center gap-2">
                      <span>{selectedModel.specialAction}</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>

                    {selectedModel.isLiveTHC && onLaunchLiveDemo && (
                      <button
                        onClick={onLaunchLiveDemo}
                        className="px-5 py-3.5 bg-white text-black font-black text-sm uppercase tracking-wider border-3 border-black shadow-[4px_4px_0px_#000] hover:translate-x-0.5 hover:translate-y-0.5 cursor-pointer"
                      >
                        Launch THC Live App
                      </button>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  {[
                    { name: selectedModel.item1, price: selectedModel.price1, tag: selectedModel.stat1 },
                    { name: selectedModel.item2, price: selectedModel.price2, tag: selectedModel.stat2 },
                  ].map((item, idx) => (
                    <div key={idx} className="p-3.5 bg-white border-3 border-black shadow-[5px_5px_0px_#000] space-y-1">
                      <div className="flex justify-between items-start">
                        <p className="font-black text-xs uppercase">{item.name}</p>
                        <span className="px-1.5 py-0.5 bg-black text-white text-[9px] font-black">{item.tag}</span>
                      </div>
                      <p className="font-black text-base">{currency}{item.price}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ========================================================================= */}
            {/* 3. LIQUID AURA // CHROMATIC GLASS                                        */}
            {/* ========================================================================= */}
            {selectedStyle.id === 'liquid-glass' && (
              <div className="p-6 relative min-h-[460px] flex flex-col justify-between overflow-hidden bg-[#09090e]">
                <div className="absolute -top-16 -left-16 w-56 h-56 rounded-full bg-purple-600/30 blur-3xl animate-float-orb pointer-events-none"></div>
                <div className="absolute -bottom-16 -right-16 w-56 h-56 rounded-full bg-[#ebd73f]/25 blur-3xl animate-float-orb pointer-events-none"></div>

                <div className="relative z-10 flex items-center justify-between pb-3 border-b border-white/15">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-purple-400 animate-ping"></span>
                    <span className="font-clash font-bold text-sm text-white">{brandName}</span>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full bg-white/10 border border-white/20 text-[10px] text-purple-300 backdrop-blur-md">
                    {selectedModel.badge}
                  </span>
                </div>

                <div className="relative z-10 py-6 space-y-3">
                  <span className="px-3 py-1 rounded-full text-[10px] font-mono bg-white/10 border border-white/20 backdrop-blur-xl text-white">
                    {selectedModel.name}
                  </span>
                  <h2 className="font-clash font-bold text-2xl sm:text-3xl text-white tracking-tight">
                    {brandName}
                  </h2>
                  <p className="text-xs text-slate-300 font-clash max-w-md leading-relaxed">
                    {tagline}. Experience tactile crystal refraction and liquid state syncing.
                  </p>

                  <div className="flex flex-wrap gap-2 pt-1">
                    <button className="px-6 py-3 rounded-2xl bg-white/15 hover:bg-white/25 border border-white/30 backdrop-blur-2xl text-white font-clash font-bold text-xs shadow-2xl transition cursor-pointer flex items-center gap-2">
                      <Crown className="w-3.5 h-3.5 text-purple-300" />
                      <span>{selectedModel.specialAction}</span>
                    </button>

                    {selectedModel.isLiveTHC && onLaunchLiveDemo && (
                      <button
                        onClick={onLaunchLiveDemo}
                        className="px-5 py-3 rounded-2xl bg-[#ebd73f] text-black font-clash font-bold text-xs shadow-xl cursor-pointer"
                      >
                        Launch THC Live App
                      </button>
                    )}
                  </div>
                </div>

                <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  {[selectedModel.item1, selectedModel.item2].map((item, idx) => (
                    <div key={idx} className="p-3.5 rounded-2xl bg-white/[0.08] border border-white/20 backdrop-blur-xl space-y-1">
                      <p className="font-clash font-bold text-xs text-white">{item}</p>
                      <p className="font-mono text-xs text-purple-300 font-bold">{currency}{idx === 0 ? selectedModel.price1 : selectedModel.price2}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ========================================================================= */}
            {/* 4. ULTRA-LUXURY EDITORIAL                                                 */}
            {/* ========================================================================= */}
            {selectedStyle.id === 'editorial-luxury' && (
              <div className="p-8 min-h-[460px] flex flex-col justify-between bg-[#050505] text-white">
                <div className="flex items-center justify-between border-b border-white/15 pb-4">
                  <span className="font-mono text-[9px] tracking-[0.3em] uppercase text-[#d4af37]">
                    {selectedCategory.name.toUpperCase()} // {selectedModel.badge}
                  </span>
                  <span className="font-mono text-[9px] text-slate-400">EST. {new Date().getFullYear()}</span>
                </div>

                <div className="py-8 space-y-4 text-center">
                  <p className="font-mono text-[10px] tracking-[0.35em] text-[#d4af37] uppercase">
                    {selectedModel.name}
                  </p>
                  <h2 className="font-panchang font-light text-2xl sm:text-4xl text-white tracking-wider uppercase">
                    {brandName}
                  </h2>
                  <p className="text-xs text-slate-400 font-clash max-w-sm mx-auto italic">
                    "{tagline}"
                  </p>

                  <div className="pt-2 flex items-center justify-center gap-3">
                    <button className="px-8 py-3 border border-[#d4af37] text-[#d4af37] hover:bg-[#d4af37] hover:text-black font-mono text-[11px] tracking-[0.3em] uppercase transition cursor-pointer">
                      {selectedModel.specialAction}
                    </button>

                    {selectedModel.isLiveTHC && onLaunchLiveDemo && (
                      <button
                        onClick={onLaunchLiveDemo}
                        className="px-6 py-3 bg-[#d4af37] text-black font-mono text-[11px] tracking-[0.2em] uppercase font-bold cursor-pointer"
                      >
                        Launch THC Live
                      </button>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 border-t border-white/15 pt-4 text-left">
                  <div>
                    <span className="font-mono text-[9px] text-[#d4af37]">№ 01</span>
                    <p className="font-clash font-bold text-xs text-white mt-0.5">{selectedModel.item1}</p>
                    <p className="font-mono text-[11px] text-slate-400">{currency}{selectedModel.price1}</p>
                  </div>
                  <div>
                    <span className="font-mono text-[9px] text-[#d4af37]">№ 02</span>
                    <p className="font-clash font-bold text-xs text-white mt-0.5">{selectedModel.item2}</p>
                    <p className="font-mono text-[11px] text-slate-400">{currency}{selectedModel.price2}</p>
                  </div>
                </div>
              </div>
            )}

            {/* ========================================================================= */}
            {/* 5. Y2K POP CANDY                                                          */}
            {/* ========================================================================= */}
            {selectedStyle.id === 'pop-candy' && (
              <div className="p-6 min-h-[460px] flex flex-col justify-between bg-[#12081c] text-white">
                <div className="flex items-center justify-between pb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-[#f43f5e] flex items-center justify-center">
                      <Crown className="w-3.5 h-3.5 text-white" />
                    </div>
                    <span className="font-black text-lg text-[#f43f5e]">{brandName}</span>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-[#f43f5e] text-white font-black text-xs shadow-lg">
                    {selectedModel.badge}
                  </span>
                </div>

                <div className="py-6 space-y-3">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-[#f43f5e]/20 flex items-center justify-center">
                      <Zap className="w-3.5 h-3.5 text-[#f43f5e]" />
                    </div>
                    <div className="w-7 h-7 rounded-full bg-pink-500/20 flex items-center justify-center">
                      <Heart className="w-3.5 h-3.5 text-pink-400" />
                    </div>
                    <div className="w-7 h-7 rounded-full bg-purple-500/20 flex items-center justify-center">
                      <Star className="w-3.5 h-3.5 text-purple-400" />
                    </div>
                  </div>
                  <h2 className="font-black text-3xl text-white tracking-tight">
                    {selectedModel.name}
                  </h2>
                  <p className="text-xs text-slate-300 max-w-sm">
                    {tagline}
                  </p>

                  <div className="flex flex-wrap gap-2 pt-1">
                    <button className="px-6 py-3 rounded-full bg-gradient-to-r from-[#f43f5e] to-pink-500 text-white font-black text-xs shadow-xl hover:scale-105 active:scale-95 transition cursor-pointer flex items-center gap-2">
                      <Heart className="w-3.5 h-3.5" />
                      <span>{selectedModel.specialAction}</span>
                    </button>

                    {selectedModel.isLiveTHC && onLaunchLiveDemo && (
                      <button
                        onClick={onLaunchLiveDemo}
                        className="px-5 py-3 rounded-full bg-white text-black font-black text-xs cursor-pointer shadow-lg"
                      >
                        Launch Live THC Site
                      </button>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {[selectedModel.item1, selectedModel.item2].map((item, idx) => (
                    <div key={idx} className="p-3.5 rounded-[24px] bg-[#221333] border-2 border-pink-500/30 flex justify-between items-center">
                      <div>
                        <p className="font-black text-xs text-white">{item}</p>
                        <p className="text-[10px] text-pink-300 font-bold">{idx === 0 ? selectedModel.stat1 : selectedModel.stat2}</p>
                      </div>
                      <span className="font-black text-sm text-[#f43f5e]">
                        {currency}{idx === 0 ? selectedModel.price1 : selectedModel.price2}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ========================================================================= */}
            {/* 6. HIGH-OCTANE RACING NITRO                                              */}
            {/* ========================================================================= */}
            {selectedStyle.id === 'high-octane' && (
              <div className="p-6 min-h-[460px] flex flex-col justify-between carbon-pattern text-white relative overflow-hidden">
                <div className="absolute top-0 right-12 w-2 h-full bg-[#ebd73f]/60 -skew-x-12 pointer-events-none"></div>
                <div className="absolute top-0 right-16 w-1 h-full bg-white/40 -skew-x-12 pointer-events-none"></div>

                <div className="relative z-10 flex items-center justify-between pb-2 border-b border-white/20">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 bg-[#ebd73f] -skew-x-12"></span>
                    <span className="font-black italic text-sm tracking-wider text-white uppercase">{brandName}</span>
                  </div>
                  <span className="font-mono text-[10px] text-[#ebd73f] font-black italic">
                    {selectedModel.badge}
                  </span>
                </div>

                <div className="relative z-10 py-6 space-y-3">
                  <span className="inline-block px-2.5 py-0.5 bg-[#ebd73f] text-black font-black italic text-[10px] -skew-x-12 uppercase">
                    {selectedModel.name}
                  </span>
                  <h2 className="font-black italic text-3xl sm:text-4xl uppercase tracking-wider text-white">
                    {brandName}
                  </h2>
                  <p className="text-xs text-slate-300 font-mono max-w-sm">
                    {tagline}
                  </p>

                  <div className="flex flex-wrap gap-2 pt-1">
                    <button className="px-7 py-3.5 bg-[#ebd73f] hover:bg-white text-black font-black italic text-xs uppercase tracking-wider -skew-x-12 shadow-2xl transition cursor-pointer flex items-center gap-2">
                      <Zap className="w-3.5 h-3.5" />
                      <span>{selectedModel.specialAction}</span>
                    </button>

                    {selectedModel.isLiveTHC && onLaunchLiveDemo && (
                      <button
                        onClick={onLaunchLiveDemo}
                        className="px-5 py-3.5 bg-white hover:bg-slate-200 text-black font-black italic text-xs uppercase tracking-wider -skew-x-12 cursor-pointer"
                      >
                        Launch Live THC Site
                      </button>
                    )}
                  </div>
                </div>

                <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {[
                    { name: selectedModel.item1, price: selectedModel.price1, stat: selectedModel.stat1 },
                    { name: selectedModel.item2, price: selectedModel.price2, stat: selectedModel.stat2 }
                  ].map((item, idx) => (
                    <div key={idx} className="p-3 bg-black/90 border-l-4 border-l-[#ebd73f] border border-white/15 -skew-x-6 space-y-1">
                      <div className="flex justify-between items-center">
                        <p className="font-black italic text-xs text-white">{item.name}</p>
                        <span className="text-[9px] font-mono text-[#ebd73f]">{item.stat}</span>
                      </div>
                      <p className="font-mono font-bold text-sm text-[#ebd73f]">{currency}{item.price}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>

        </div>

      </main>

    </div>
  );
}
