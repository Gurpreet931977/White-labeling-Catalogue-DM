import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, 
  ArrowRight, 
  ArrowUpRight, 
  Bell, 
  Check, 
  Clock, 
  Coffee, 
  Flame, 
  Layers, 
  Minus, 
  Plus, 
  RotateCcw, 
  ShoppingBag, 
  Sliders, 
  Sparkles, 
  Store, 
  Tv, 
  Utensils, 
  Volume2, 
  X, 
  Zap
} from 'lucide-react';
import { sounds } from '../utils/audio';

// ---------------------------------------------------------------------------
// EXPRESS ROASTERY & COUNTER MENU ITEMS
// ---------------------------------------------------------------------------
const QSR_MENU = [
  {
    id: 'iced-pistachio-latte',
    name: 'Iced Pistachio Spanish Latte',
    category: 'espresso',
    tagline: 'Double ristretto, Sicilian pistachio cream & cold oat milk',
    price: 380,
    prepTime: '2.5 mins',
    popular: true,
    image: 'https://images.unsplash.com/photo-1517256064527-09c73fc73e38?auto=format&fit=crop&w=800&q=80',
    description: 'Freshly pulled double shot over artisanal Sicilian pistachio purée, condensed cream, and chilled barista oat milk.'
  },
  {
    id: 'nitro-cold-brew',
    name: 'Nitro Cold Brew Reserve',
    category: 'espresso',
    tagline: '20hr single-origin Ethiopian cold drip infused with nitrogen',
    price: 320,
    prepTime: '1 min',
    popular: true,
    image: 'https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?auto=format&fit=crop&w=800&q=80',
    description: 'Velvety cascading head with natural chocolate and black cherry flavor notes. Zero dairy, served ice-cold from tap.'
  },
  {
    id: 'kyoto-matcha-cloud',
    name: 'Kyoto Ceremonial Matcha Cloud',
    category: 'elixirs',
    tagline: 'Stone-ground Uji matcha with Madagascar vanilla foam',
    price: 360,
    prepTime: '2 mins',
    popular: false,
    image: 'https://images.unsplash.com/photo-1536256263959-770b48d82b0a?auto=format&fit=crop&w=800&q=80',
    description: 'First-harvest ceremonial matcha hand-whisked to order, layered over cold oat milk and topped with sea-salt cream foam.'
  },
  {
    id: 'almond-cruffin',
    name: 'Almond & Vanilla Custard Cruffin',
    category: 'bakery',
    tagline: 'Croissant-muffin hybrid with roasted almond praline',
    price: 290,
    prepTime: 'Instant Grab',
    popular: true,
    image: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=800&q=80',
    description: '72-layer flaky laminated pastry rolled in toasted almond flakes and filled with chilled Tahitian vanilla bean pastry cream.'
  },
  {
    id: 'focaccia-melt',
    name: 'Truffle & Smoked Mozzarella Melt',
    category: 'grab-and-go',
    tagline: 'House rosemary focaccia, heirloom pesto & melted mozzarella',
    price: 420,
    prepTime: '3 mins',
    popular: false,
    image: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&w=800&q=80',
    description: 'Warm, crispy pressed focaccia sandwich with smoked mozzarella, semi-dried tomatoes, wild rocket, and black truffle oil.'
  },
  {
    id: 'double-flat-white',
    name: 'Velour Signature Flat White',
    category: 'espresso',
    tagline: 'Double ristretto with micro-textured silky whole milk',
    price: 260,
    prepTime: '2 mins',
    popular: false,
    image: 'https://images.unsplash.com/photo-1577968897966-3d4325b36b61?auto=format&fit=crop&w=800&q=80',
    description: 'Rich, intense espresso foundation with micro-foam latte art. Balanced, sweet, and comforting.'
  }
];

export function SelfServeCounterApp({ onBackToVariants, onBackToCatalogue }) {
  // Active View Mode: 'ordering' | 'queue-board' | 'barista'
  const [activeMode, setActiveMode] = useState('ordering');

  // Selected Category
  const [activeCategory, setActiveCategory] = useState('all');

  // Customization Modal State
  const [customizingItem, setCustomizingItem] = useState(null);
  const [selectedMilk, setSelectedMilk] = useState('Barista Oat');
  const [selectedTemp, setSelectedTemp] = useState('Iced');
  const [extraShot, setExtraShot] = useState(false);
  const [selectedSweetness, setSelectedSweetness] = useState('Standard');

  // Express Cart State
  const [cart, setCart] = useState([
    {
      id: 'iced-pistachio-latte',
      name: 'Iced Pistachio Spanish Latte',
      price: 380,
      qty: 1,
      milk: 'Barista Oat',
      temp: 'Iced',
      extraShot: true
    }
  ]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Customer Checkout Info
  const [customerName, setCustomerName] = useState('Jordan Lee');
  const [customerMobile, setCustomerMobile] = useState('+91 98112 34567');
  const [paymentMethod, setPaymentMethod] = useState('upi');

  // Live Queue State (Now Serving vs Preparing)
  const [queueState, setQueueState] = useState({
    nowServing: [
      { token: 'TOKEN #C-12', station: 'Counter Station A', item: 'Flat White + Cruffin', time: 'Ready 1m ago' },
      { token: 'TOKEN #C-14', station: 'Express Pickup B', item: 'Nitro Cold Brew', time: 'Ready just now' }
    ],
    preparing: [
      { token: 'TOKEN #C-15', customer: 'David R.', items: 'Pistachio Latte', wait: '~2 mins' },
      { token: 'TOKEN #C-16', customer: 'Sophia M.', items: 'Focaccia Melt', wait: '~3 mins' },
      { token: 'TOKEN #C-17', customer: 'Liam K.', items: 'Kyoto Cloud', wait: '~4 mins' }
    ]
  });

  // Active Customer's Placed Order Token (if any)
  const [activeOrderToken, setActiveOrderToken] = useState(null);
  const [isTokenModalOpen, setIsTokenModalOpen] = useState(false);
  const [orderStep, setOrderStep] = useState(1); // 1: Received, 2: Brewing, 3: Ready for Pickup

  // Play bell chime sound helper
  const playCounterChime = () => {
    sounds.playSuccess();
  };

  // Add to cart handler
  const handleAddToCart = () => {
    if (!customizingItem) return;
    sounds.playClick();
    const newItem = {
      id: `${customizingItem.id}-${Date.now()}`,
      name: customizingItem.name,
      price: customizingItem.price + (extraShot ? 50 : 0),
      qty: 1,
      milk: selectedMilk,
      temp: selectedTemp,
      extraShot
    };
    setCart((prev) => [...prev, newItem]);
    setCustomizingItem(null);
  };

  // Checkout & Generate Live Token
  const handlePlaceOrder = (e) => {
    e.preventDefault();
    if (cart.length === 0) return;
    sounds.playSuccess();

    // Generate new sequential token
    const tokenNumber = Math.floor(18 + Math.random() * 80);
    const generatedTokenString = `TOKEN #C-${tokenNumber}`;

    const newOrder = {
      token: generatedTokenString,
      customer: customerName,
      items: cart.map((i) => i.name).join(', '),
      total: cart.reduce((sum, i) => sum + i.price * i.qty, 0),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    // Add to preparing queue
    setQueueState((prev) => ({
      ...prev,
      preparing: [...prev.preparing, { token: generatedTokenString, customer: customerName, items: newOrder.items, wait: '~3.5 mins' }]
    }));

    setActiveOrderToken(newOrder);
    setOrderStep(1);
    setCart([]);
    setIsCartOpen(false);
    setIsTokenModalOpen(true);

    // Simulate barista brewing advancement after 4s
    setTimeout(() => {
      setOrderStep(2);
    }, 4000);
  };

  // Fast forward token status for demo testing
  const handleAdvanceToReady = () => {
    if (!activeOrderToken) return;
    playCounterChime();
    setOrderStep(3);

    // Move token from preparing to nowServing in queue state
    setQueueState((prev) => {
      const remainingPreparing = prev.preparing.filter((p) => p.token !== activeOrderToken.token);
      return {
        nowServing: [{ token: activeOrderToken.token, station: 'Express Pickup B', item: activeOrderToken.items, time: 'Ready just now' }, ...prev.nowServing.slice(0, 3)],
        preparing: remainingPreparing
      };
    });
  };

  // Barista Staff Action: Mark any preparing token Ready
  const handleBaristaMarkReady = (tokenObj) => {
    playCounterChime();
    setQueueState((prev) => ({
      nowServing: [{ token: tokenObj.token, station: 'Counter Station B', item: tokenObj.items, time: 'Ready just now' }, ...prev.nowServing.slice(0, 3)],
      preparing: prev.preparing.filter((p) => p.token !== tokenObj.token)
    }));

    if (activeOrderToken && activeOrderToken.token === tokenObj.token) {
      setOrderStep(3);
    }
  };

  // Filtered menu items
  const filteredMenu = activeCategory === 'all'
    ? QSR_MENU
    : QSR_MENU.filter((m) => m.category === activeCategory);

  const cartTotal = cart.reduce((sum, i) => sum + i.price * i.qty, 0);

  return (
    <div className="min-h-screen bg-[#100E0C] text-[#FAF7F2] font-sans selection:bg-[#C5A880] selection:text-[#12100E] overflow-x-hidden relative">
      
      {/* --------------------------------------------------------------------- */}
      {/* TOP HEADER & OPERATIONAL MODE SWITCHER                                */}
      {/* --------------------------------------------------------------------- */}
      <header className="sticky top-0 inset-x-0 z-40 bg-[#100E0C]/95 backdrop-blur-xl border-b border-[#26201A] py-3 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          
          {/* Left Brand Identifier */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                sounds.playClick();
                if (onBackToVariants) onBackToVariants();
                else if (onBackToCatalogue) onBackToCatalogue();
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/[0.04] hover:bg-[#C5A880] text-stone-300 hover:text-[#12100E] border border-white/10 hover:border-[#C5A880] text-xs font-mono font-medium transition cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Back to Chooser</span>
            </button>

            <span className="hidden sm:inline text-white/20">•</span>

            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#C5A880] shadow-[0_0_8px_#C5A880] animate-pulse"></span>
              <span className="font-mono text-xs font-bold tracking-[0.2em] text-[#FAF7F2] uppercase">
                VELOUR <span className="text-[#C5A880]">//</span> EXPRESS COUNTER
              </span>
            </div>
          </div>

          {/* Center: 3-in-1 View Mode Switcher */}
          <div className="hidden md:flex items-center gap-1 p-1 rounded-full bg-[#181412] border border-[#2D251F]">
            <button
              onClick={() => {
                sounds.playClick();
                setActiveMode('ordering');
              }}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-mono transition cursor-pointer ${
                activeMode === 'ordering'
                  ? 'bg-[#C5A880] text-[#12100E] font-bold shadow-md'
                  : 'text-stone-400 hover:text-white'
              }`}
            >
              <Coffee className="w-3.5 h-3.5" />
              <span>Customer Kiosk</span>
            </button>

            <button
              onClick={() => {
                sounds.playClick();
                setActiveMode('queue-board');
              }}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-mono transition cursor-pointer ${
                activeMode === 'queue-board'
                  ? 'bg-[#C5A880] text-[#12100E] font-bold shadow-md'
                  : 'text-stone-400 hover:text-white'
              }`}
            >
              <Tv className="w-3.5 h-3.5" />
              <span>Counter Queue Screen</span>
            </button>

            <button
              onClick={() => {
                sounds.playClick();
                setActiveMode('barista');
              }}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-mono transition cursor-pointer ${
                activeMode === 'barista'
                  ? 'bg-[#C5A880] text-[#12100E] font-bold shadow-md'
                  : 'text-stone-400 hover:text-white'
              }`}
            >
              <Utensils className="w-3.5 h-3.5" />
              <span>Barista Terminal</span>
            </button>
          </div>

          {/* Right: Active Order Ticket Badge & Cart */}
          <div className="flex items-center gap-2.5">
            {activeOrderToken && (
              <button
                onClick={() => {
                  sounds.playClick();
                  setIsTokenModalOpen(true);
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#C5A880]/15 border border-[#C5A880]/40 text-[#FAF7F2] text-xs font-mono font-bold tracking-wider uppercase animate-pulse cursor-pointer"
              >
                <Bell className="w-3.5 h-3.5 text-[#C5A880]" />
                <span>{activeOrderToken.token}</span>
              </button>
            )}

            {activeMode === 'ordering' && (
              <button
                onClick={() => {
                  sounds.playClick();
                  setIsCartOpen(true);
                }}
                className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-[#C5A880] to-[#D4AF37] hover:brightness-110 text-[#12100E] font-mono text-xs font-bold tracking-wide uppercase transition cursor-pointer shadow-md"
              >
                <ShoppingBag className="w-3.5 h-3.5 text-[#12100E]" />
                <span>Bag ({cart.reduce((sum, i) => sum + i.qty, 0)})</span>
              </button>
            )}
          </div>

        </div>
      </header>

      {/* Mobile Mode Switcher (Visible on small screens) */}
      <div className="md:hidden flex items-center justify-around bg-[#161310] border-b border-[#26201A] p-2 text-[11px] font-mono">
        <button
          onClick={() => { sounds.playClick(); setActiveMode('ordering'); }}
          className={`px-3 py-1 rounded-lg ${activeMode === 'ordering' ? 'bg-[#C5A880] text-[#12100E] font-bold' : 'text-stone-400'}`}
        >
          Customer Order
        </button>
        <button
          onClick={() => { sounds.playClick(); setActiveMode('queue-board'); }}
          className={`px-3 py-1 rounded-lg ${activeMode === 'queue-board' ? 'bg-[#C5A880] text-[#12100E] font-bold' : 'text-stone-400'}`}
        >
          TV Queue Board
        </button>
        <button
          onClick={() => { sounds.playClick(); setActiveMode('barista'); }}
          className={`px-3 py-1 rounded-lg ${activeMode === 'barista' ? 'bg-[#C5A880] text-[#12100E] font-bold' : 'text-stone-400'}`}
        >
          Barista POS
        </button>
      </div>

      {/* --------------------------------------------------------------------- */}
      {/* VIEW 1: CUSTOMER SELF-SERVE ORDERING KIOSK                            */}
      {/* --------------------------------------------------------------------- */}
      {activeMode === 'ordering' && (
        <main className="max-w-7xl mx-auto px-4 sm:px-8 py-8 space-y-8">
          
          {/* Hero Banner & Live Counter Telemetry */}
          <div className="p-6 sm:p-8 rounded-[32px] bg-gradient-to-r from-[#181411] via-[#14110E] to-[#181411] border border-[#2D251F] shadow-xl relative overflow-hidden space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="space-y-2">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#C5A880]/10 border border-[#C5A880]/25 text-[10px] font-mono text-[#C5A880] font-semibold tracking-wider uppercase">
                  <Store className="w-3 h-3 text-[#C5A880]" />
                  <span>ZERO TABLE SERVICE • INSTANT COUNTER PICKUP</span>
                </div>
                <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-[#FAF7F2] tracking-tight">
                  Artisan Coffee &amp; Bakery. <span className="italic font-normal text-[#C5A880]">Pulled Fresh, Grab &amp; Go.</span>
                </h1>
                <p className="text-xs sm:text-sm text-stone-300/80 font-sans max-w-xl">
                  Order on your device, receive an automated Order Token, and collect from Counter Station B when the chime sounds.
                </p>
              </div>

              {/* Counter Velocity Stat Box */}
              <div className="p-4 rounded-2xl bg-[#0D0B0A] border border-[#2D251F] shrink-0 font-mono text-xs space-y-2 min-w-[220px]">
                <div className="flex items-center justify-between text-stone-400 pb-1 border-b border-[#201A16]">
                  <span>AVERAGE VELOCITY:</span>
                  <span className="text-[#C5A880] font-bold">2.8 Mins</span>
                </div>
                <div className="flex items-center justify-between text-stone-400">
                  <span>NOW SERVING:</span>
                  <span className="text-white font-bold">{queueState.nowServing[0]?.token || 'TOKEN #C-14'}</span>
                </div>
                <div className="flex items-center justify-between text-stone-400">
                  <span>ACTIVE QUEUE:</span>
                  <span className="text-emerald-400 font-bold">{queueState.preparing.length} Orders</span>
                </div>
              </div>
            </div>
          </div>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap items-center gap-2 border-b border-[#26201A] pb-4">
            {[
              { id: 'all', label: 'All Items' },
              { id: 'espresso', label: 'Artisan Espresso & Nitro' },
              { id: 'bakery', label: 'Fresh Viennoiserie' },
              { id: 'grab-and-go', label: 'Focaccia Melts' },
              { id: 'elixirs', label: 'Ceremonial Matcha' }
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => {
                  sounds.playClick();
                  setActiveCategory(cat.id);
                }}
                className={`px-4 py-2 rounded-full font-mono text-xs transition cursor-pointer ${
                  activeCategory === cat.id
                    ? 'bg-[#C5A880] text-[#12100E] font-bold shadow-md'
                    : 'bg-[#181411] hover:bg-[#201A16] text-stone-300 border border-[#2B231D]'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Express Menu Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredMenu.map((item) => (
              <div
                key={item.id}
                className="group rounded-[28px] overflow-hidden bg-gradient-to-b from-[#181412] to-[#110E0C] border border-[#2D251F] hover:border-[#C5A880]/50 transition-all duration-300 flex flex-col justify-between shadow-lg"
              >
                <div className="relative aspect-[16/10] overflow-hidden bg-black/40">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#110E0C] via-transparent to-transparent"></div>

                  <div className="absolute top-3 left-3 right-3 flex items-center justify-between font-mono text-[10px]">
                    <span className="px-2.5 py-1 rounded-full bg-[#100E0C]/85 backdrop-blur-md border border-white/10 text-[#C5A880] font-semibold">
                      {item.prepTime}
                    </span>
                    {item.popular && (
                      <span className="px-2.5 py-1 rounded-full bg-[#C5A880] text-[#12100E] font-bold uppercase tracking-wider">
                        POPULAR
                      </span>
                    )}
                  </div>
                </div>

                <div className="p-6 space-y-3">
                  <div>
                    <div className="flex items-baseline justify-between gap-2">
                      <h3 className="font-serif text-lg font-bold text-[#FAF7F2] group-hover:text-[#C5A880] transition-colors leading-snug">
                        {item.name}
                      </h3>
                      <span className="font-mono text-sm font-bold text-[#C5A880] shrink-0">
                        ₹{item.price}
                      </span>
                    </div>
                    <p className="text-[11px] font-mono text-stone-400 mt-0.5 line-clamp-1">
                      {item.tagline}
                    </p>
                  </div>

                  <p className="text-xs text-stone-300/75 font-sans leading-relaxed line-clamp-2">
                    {item.description}
                  </p>
                </div>

                <div className="p-6 pt-0">
                  <button
                    onClick={() => {
                      sounds.playClick();
                      setCustomizingItem(item);
                    }}
                    className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-[#C5A880] to-[#D4AF37] hover:brightness-110 text-[#12100E] font-mono text-xs font-bold uppercase tracking-wider transition flex items-center justify-center gap-1.5 cursor-pointer shadow-md"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Quick Order • ₹{item.price}</span>
                  </button>
                </div>

              </div>
            ))}
          </div>

        </main>
      )}

      {/* --------------------------------------------------------------------- */}
      {/* VIEW 2: IN-STORE TV COUNTER QUEUE BOARD (Simulation of Cafe Big Screen)*/}
      {/* --------------------------------------------------------------------- */}
      {activeMode === 'queue-board' && (
        <main className="max-w-7xl mx-auto px-4 sm:px-8 py-10 space-y-8">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#26201A]">
            <div>
              <span className="font-mono text-[10px] text-[#C5A880] tracking-[0.25em] uppercase font-semibold">
                IN-STORE DIGITAL SIGNAGE DISPLAY
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#FAF7F2]">
                Live Counter Queue Board
              </h2>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={playCounterChime}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/[0.05] hover:bg-white/10 text-stone-300 hover:text-white border border-white/10 text-xs font-mono transition cursor-pointer"
              >
                <Volume2 className="w-3.5 h-3.5 text-[#C5A880]" />
                <span>Test Pickup Chime</span>
              </button>

              <button
                onClick={() => setActiveMode('ordering')}
                className="px-4 py-1.5 rounded-full bg-[#C5A880] text-[#12100E] font-mono text-xs font-bold uppercase tracking-wider cursor-pointer"
              >
                Place Order
              </button>
            </div>
          </div>

          {/* Split Screen Queue Matrix */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* Column A: NOW SERVING (Ready for Pickup) */}
            <div className="p-8 rounded-[32px] bg-gradient-to-b from-[#1E1813] to-[#14110E] border-2 border-[#C5A880]/50 shadow-2xl space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-[#C5A880]/30">
                <div className="flex items-center gap-3">
                  <span className="relative flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#C5A880] opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-[#C5A880]"></span>
                  </span>
                  <h3 className="font-serif text-2xl font-bold text-[#FAF7F2] tracking-wide uppercase">
                    NOW READY FOR PICKUP
                  </h3>
                </div>
                <span className="font-mono text-xs text-[#C5A880] font-semibold">
                  Collect at Window
                </span>
              </div>

              <div className="space-y-4">
                {queueState.nowServing.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-6 rounded-2xl bg-[#0D0B0A] border border-[#C5A880]/40 flex items-center justify-between shadow-lg"
                  >
                    <div>
                      <span className="font-mono text-[10px] text-stone-400 tracking-wider uppercase">
                        {item.station}
                      </span>
                      <h4 className="font-mono text-3xl sm:text-4xl font-black text-[#C8FF47] tracking-wider mt-1">
                        {item.token}
                      </h4>
                      <p className="text-xs text-stone-300 font-sans mt-1">
                        {item.item}
                      </p>
                    </div>

                    <div className="text-right">
                      <span className="px-3 py-1 rounded-full bg-[#C8FF47]/20 text-[#C8FF47] font-mono text-xs font-bold border border-[#C8FF47]/30">
                        READY
                      </span>
                      <p className="font-mono text-[10px] text-stone-400 mt-2">
                        {item.time}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Column B: IN PREPARATION (In the Machine) */}
            <div className="p-8 rounded-[32px] bg-[#14110E] border border-[#2D251F] shadow-xl space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-[#2D251F]">
                <h3 className="font-serif text-2xl font-bold text-stone-300 tracking-wide uppercase">
                  IN PREPARATION
                </h3>
                <span className="font-mono text-xs text-stone-400">
                  Est. 2-4 mins
                </span>
              </div>

              <div className="space-y-3">
                {queueState.preparing.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-5 rounded-2xl bg-[#0D0B0A] border border-white/5 flex items-center justify-between"
                  >
                    <div>
                      <h4 className="font-mono text-2xl font-bold text-stone-300">
                        {item.token}
                      </h4>
                      <p className="text-xs text-stone-400 font-sans mt-0.5">
                        {item.items} • Guest: {item.customer}
                      </p>
                    </div>

                    <span className="font-mono text-xs text-[#C5A880] px-3 py-1 rounded-full bg-white/[0.04] border border-white/10">
                      {item.wait}
                    </span>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </main>
      )}

      {/* --------------------------------------------------------------------- */}
      {/* VIEW 3: BARISTA EXPEDITOR TERMINAL (Staff Screen Simulator)           */}
      {/* --------------------------------------------------------------------- */}
      {activeMode === 'barista' && (
        <main className="max-w-7xl mx-auto px-4 sm:px-8 py-10 space-y-8">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#26201A]">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-[10px] font-mono text-amber-300 font-bold uppercase mb-1">
                <span>STAFF KITCHEN POS MODE</span>
              </div>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#FAF7F2]">
                Barista Order Expeditor Station
              </h2>
            </div>

            <button
              onClick={() => setActiveMode('ordering')}
              className="px-4 py-2 rounded-full bg-[#C5A880] text-[#12100E] font-mono text-xs font-bold uppercase tracking-wider cursor-pointer"
            >
              Return to Customer View
            </button>
          </div>

          {/* Active Incoming Kitchen Tickets */}
          <div className="space-y-4">
            <h3 className="font-mono text-xs text-stone-400 uppercase tracking-widest">
              ACTIVE TICKETS IN BREWING QUEUE ({queueState.preparing.length})
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {queueState.preparing.map((ticket, idx) => (
                <div
                  key={idx}
                  className="p-6 rounded-[24px] bg-[#16120F] border border-[#332A22] space-y-4 flex flex-col justify-between shadow-xl"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between pb-2 border-b border-[#2A221C]">
                      <span className="font-mono text-xl font-black text-[#C5A880]">
                        {ticket.token}
                      </span>
                      <span className="font-mono text-xs px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/30">
                        IN BREW
                      </span>
                    </div>

                    <div>
                      <span className="font-mono text-[10px] text-stone-400 uppercase block">GUEST:</span>
                      <p className="font-serif font-bold text-base text-white">{ticket.customer}</p>
                    </div>

                    <div>
                      <span className="font-mono text-[10px] text-stone-400 uppercase block">ITEMS:</span>
                      <p className="text-xs text-stone-200 font-mono mt-0.5">{ticket.items}</p>
                    </div>
                  </div>

                  <button
                    onClick={() => handleBaristaMarkReady(ticket)}
                    className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 hover:brightness-110 text-black font-mono text-xs font-bold uppercase tracking-wider transition cursor-pointer flex items-center justify-center gap-2 shadow-lg"
                  >
                    <Bell className="w-4 h-4 text-black" />
                    <span>Mark Ready (Ring Bell)</span>
                  </button>
                </div>
              ))}
            </div>
          </div>

        </main>
      )}

      {/* --------------------------------------------------------------------- */}
      {/* ITEM CUSTOMIZATION MODAL (Milk, Ice, Shots)                           */}
      {/* --------------------------------------------------------------------- */}
      <AnimatePresence>
        {customizingItem && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setCustomizingItem(null)}
              className="fixed inset-0 bg-black/85 backdrop-blur-xl -z-10"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="w-full max-w-lg bg-[#14110E] border border-[#2D251F] rounded-[32px] overflow-hidden shadow-2xl my-8 flex flex-col"
            >
              <div className="relative aspect-[16/9] overflow-hidden">
                <img
                  src={customizingItem.image}
                  alt={customizingItem.name}
                  className="w-full h-full object-cover"
                />
                <button
                  onClick={() => setCustomizingItem(null)}
                  className="absolute top-4 right-4 p-2 rounded-full bg-black/70 text-white hover:text-[#C5A880] transition cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6 sm:p-7 space-y-5">
                <div>
                  <h3 className="font-serif text-xl font-bold text-[#FAF7F2]">
                    {customizingItem.name}
                  </h3>
                  <p className="text-xs text-stone-300 font-sans mt-1">
                    {customizingItem.description}
                  </p>
                </div>

                {/* Milk Selection */}
                <div className="space-y-2">
                  <label className="text-[10px] font-mono text-stone-400 uppercase tracking-wider block">
                    1. Select Milk Base
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {['Barista Oat', 'Organic Whole', 'Almond', 'Pistachio'].map((m) => (
                      <button
                        key={m}
                        type="button"
                        onClick={() => { sounds.playClick(); setSelectedMilk(m); }}
                        className={`p-2.5 rounded-xl border text-xs font-mono transition cursor-pointer ${
                          selectedMilk === m
                            ? 'bg-[#C5A880] text-[#12100E] font-bold border-[#C5A880]'
                            : 'bg-[#0D0B0A] border-[#2A221C] text-stone-300 hover:text-white'
                        }`}
                      >
                        {m}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Temperature */}
                <div className="space-y-2">
                  <label className="text-[10px] font-mono text-stone-400 uppercase tracking-wider block">
                    2. Temperature
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {['Iced (Chilled Rock)', 'Steamed Hot (65°C)'].map((temp) => (
                      <button
                        key={temp}
                        type="button"
                        onClick={() => { sounds.playClick(); setSelectedTemp(temp); }}
                        className={`p-2.5 rounded-xl border text-xs font-mono transition cursor-pointer ${
                          selectedTemp === temp
                            ? 'bg-[#C5A880] text-[#12100E] font-bold border-[#C5A880]'
                            : 'bg-[#0D0B0A] border-[#2A221C] text-stone-300 hover:text-white'
                        }`}
                      >
                        {temp}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Extra Shot Add-on */}
                <div
                  onClick={() => { sounds.playClick(); setExtraShot(!extraShot); }}
                  className="p-3 rounded-xl bg-[#0D0B0A] border border-[#2A221C] flex items-center justify-between cursor-pointer"
                >
                  <div className="font-mono text-xs">
                    <span className="text-stone-200 block">+ Double Ristretto Shot</span>
                    <span className="text-[10px] text-stone-400">Extra caffeine boost (+₹50)</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={extraShot}
                    readOnly
                    className="accent-[#C5A880] w-4 h-4 cursor-pointer"
                  />
                </div>

                {/* Add to Bag Button */}
                <button
                  onClick={handleAddToCart}
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#C5A880] to-[#D4AF37] hover:brightness-110 text-[#12100E] font-mono text-xs font-bold uppercase tracking-wider transition cursor-pointer flex items-center justify-center gap-2 shadow-xl"
                >
                  <span>Add to Express Bag • ₹{customizingItem.price + (extraShot ? 50 : 0)}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* --------------------------------------------------------------------- */}
      {/* EXPRESS CART & CHECKOUT DRAWER                                       */}
      {/* --------------------------------------------------------------------- */}
      <AnimatePresence>
        {isCartOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-end">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsCartOpen(false)}
              className="fixed inset-0 bg-black/80 backdrop-blur-md"
            />

            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="relative w-full max-w-md bg-[#14110E] border-l border-[#2D251F] h-full shadow-2xl flex flex-col justify-between z-10"
            >
              {/* Cart Header */}
              <div className="p-6 border-b border-[#26201A] flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <ShoppingBag className="w-5 h-5 text-[#C5A880]" />
                  <h3 className="font-serif font-bold text-lg text-white">
                    Express Pickup Bag
                  </h3>
                </div>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-stone-400 hover:text-white transition cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Cart Items List */}
              <div className="p-6 overflow-y-auto flex-grow space-y-4">
                {cart.length === 0 ? (
                  <div className="text-center py-12 text-stone-400 font-mono text-xs space-y-2">
                    <p>Your bag is empty.</p>
                    <p className="text-[11px] text-stone-500">Select any drink to place a self-serve order.</p>
                  </div>
                ) : (
                  cart.map((item, idx) => (
                    <div
                      key={item.id}
                      className="p-4 rounded-2xl bg-[#0D0B0A] border border-[#231C17] space-y-2"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h4 className="font-serif font-bold text-sm text-white">
                            {item.name}
                          </h4>
                          <p className="font-mono text-[10px] text-[#C5A880]">
                            {item.milk} • {item.temp} {item.extraShot ? '• +Extra Shot' : ''}
                          </p>
                        </div>
                        <span className="font-mono text-xs font-bold text-white">
                          ₹{item.price * item.qty}
                        </span>
                      </div>

                      <div className="flex items-center justify-between pt-2 border-t border-white/5 text-xs font-mono">
                        <span className="text-stone-400">Qty: {item.qty}</span>
                        <button
                          onClick={() => {
                            sounds.playClick();
                            setCart(cart.filter((_, i) => i !== idx));
                          }}
                          className="text-stone-500 hover:text-red-400 transition cursor-pointer"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  ))
                )}

                {/* Customer Pickup Details */}
                {cart.length > 0 && (
                  <div className="pt-4 border-t border-[#26201A] space-y-3 font-mono text-xs">
                    <span className="text-stone-400 uppercase text-[10px] tracking-wider block">
                      Pickup Customer Info
                    </span>

                    <div className="space-y-1">
                      <label className="text-[10px] text-stone-400">Your Name (for Token Callout)</label>
                      <input
                        type="text"
                        required
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-[#0D0B0A] border border-[#2D251F] text-white focus:outline-none focus:border-[#C5A880]"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] text-stone-400">Payment Option</label>
                      <div className="grid grid-cols-3 gap-2">
                        {['upi', 'card', 'cash'].map((p) => (
                          <button
                            key={p}
                            type="button"
                            onClick={() => { sounds.playClick(); setPaymentMethod(p); }}
                            className={`p-2 rounded-xl border text-[10px] uppercase font-bold transition cursor-pointer ${
                              paymentMethod === p
                                ? 'bg-[#C5A880] text-[#12100E] border-[#C5A880]'
                                : 'bg-[#0D0B0A] border-[#2A221C] text-stone-400 hover:text-white'
                            }`}
                          >
                            {p === 'upi' ? 'UPI QR' : p === 'card' ? 'Card' : 'Counter Cash'}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Cart Footer / Checkout Trigger */}
              {cart.length > 0 && (
                <div className="p-6 border-t border-[#26201A] bg-[#0D0B0A] space-y-3">
                  <div className="flex items-center justify-between font-mono">
                    <span className="text-xs text-stone-400">ESTIMATED TOTAL:</span>
                    <span className="text-base font-bold text-[#C5A880]">₹{cartTotal}</span>
                  </div>

                  <button
                    onClick={handlePlaceOrder}
                    className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#C5A880] to-[#D4AF37] hover:brightness-110 text-[#12100E] font-mono text-xs font-bold uppercase tracking-wider transition cursor-pointer flex items-center justify-center gap-2 shadow-xl"
                  >
                    <span>Place Order &amp; Generate Token</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              )}

            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* --------------------------------------------------------------------- */}
      {/* LIVE ORDER TOKEN PASS MODAL (Customer View)                           */}
      {/* --------------------------------------------------------------------- */}
      <AnimatePresence>
        {isTokenModalOpen && activeOrderToken && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsTokenModalOpen(false)}
              className="fixed inset-0 bg-black/85 backdrop-blur-xl -z-10"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="w-full max-w-md bg-[#16120F] border-2 border-[#C5A880]/60 rounded-[32px] overflow-hidden shadow-2xl my-8 flex flex-col p-6 sm:p-8 space-y-6 text-center"
            >
              <div className="flex items-center justify-between pb-3 border-b border-[#2A221C]">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#C5A880] animate-ping"></span>
                  <span className="font-mono text-[10px] text-[#C5A880] tracking-widest uppercase font-bold">
                    AUTOMATED PICKUP TICKET
                  </span>
                </div>
                <button
                  onClick={() => setIsTokenModalOpen(false)}
                  className="text-stone-400 hover:text-white transition cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Huge Token Badge */}
              <div className="py-6 px-4 rounded-3xl bg-[#0D0B0A] border border-[#C5A880]/40 space-y-2">
                <span className="font-mono text-xs text-stone-400 tracking-wider">YOUR COUNTER QUEUE NUMBER:</span>
                <h3 className="font-mono text-4xl sm:text-5xl font-black text-[#C8FF47] tracking-wider">
                  {activeOrderToken.token}
                </h3>
                <p className="text-xs font-mono text-[#C5A880] pt-1">
                  Pickup at: Counter Station B
                </p>
              </div>

              {/* Animated 3-Stage Progress Stepper */}
              <div className="space-y-3 text-left font-mono text-xs">
                <span className="text-stone-400 text-[10px] tracking-wider block">LIVE FULFILLMENT STATUS:</span>

                <div className="space-y-2">
                  <div className={`p-3 rounded-xl border flex items-center gap-3 ${
                    orderStep >= 1 ? 'bg-white/[0.04] border-emerald-500/40 text-emerald-400' : 'bg-black/30 border-white/5 text-stone-500'
                  }`}>
                    <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>1. Order Received by Roastery ({activeOrderToken.timestamp})</span>
                  </div>

                  <div className={`p-3 rounded-xl border flex items-center gap-3 ${
                    orderStep === 2
                      ? 'bg-amber-500/10 border-amber-500/50 text-amber-300 animate-pulse'
                      : orderStep > 2
                      ? 'bg-white/[0.04] border-emerald-500/40 text-emerald-400'
                      : 'bg-black/30 border-white/5 text-stone-500'
                  }`}>
                    <Coffee className="w-4 h-4 shrink-0" />
                    <span>2. Barista Pulling Shots &amp; Packaging</span>
                  </div>

                  <div className={`p-3 rounded-xl border flex items-center gap-3 ${
                    orderStep === 3
                      ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300 font-bold'
                      : 'bg-black/30 border-white/5 text-stone-500'
                  }`}>
                    <Bell className="w-4 h-4 shrink-0" />
                    <span>3. Ready for Counter Pickup (Bell Sounded)</span>
                  </div>
                </div>
              </div>

              {/* Fast Forward for Demo Testing */}
              {orderStep < 3 && (
                <button
                  onClick={handleAdvanceToReady}
                  className="w-full py-2.5 px-4 rounded-xl bg-white/[0.06] hover:bg-white/10 text-stone-200 border border-white/10 text-xs font-mono transition cursor-pointer flex items-center justify-center gap-2"
                >
                  <Zap className="w-3.5 h-3.5 text-[#C5A880]" />
                  <span>Fast-Forward: Ring Order Ready Now</span>
                </button>
              )}

              <button
                onClick={() => {
                  sounds.playClick();
                  setIsTokenModalOpen(false);
                }}
                className="w-full py-3 rounded-xl bg-[#C5A880] hover:bg-[#D4AF37] text-[#12100E] font-mono text-xs font-bold uppercase tracking-wider transition cursor-pointer"
              >
                Keep Order Open
              </button>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
