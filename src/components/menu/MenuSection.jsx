import React, { useState, useMemo, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  Plus, 
  Clock, 
  QrCode, 
  Leaf, 
  UserCheck, 
  CheckCircle2, 
  Award, 
  BellRing, 
  Droplets, 
  Receipt,
  X,
  SlidersHorizontal,
  Flame,
  Coffee,
  ChevronDown,
  Layers,
  Check,
  Sparkles,
  ArrowRight,
  Utensils,
  Store,
  Truck,
  Calendar
} from 'lucide-react';
import { CATEGORIES, MENU_ITEMS, CULINARY_SYNONYMS } from '../../data/menuData';
import { useCart } from '../../context/CartContext';
import { useOrder } from '../../context/OrderContext';
import { useAuth } from '../../context/AuthContext';
import { BRAND_CONFIG } from '../../data/cafeConfig';
import { sounds } from '../../utils/audio';

// Smart Approximate & Relevance-Scored Fuzzy Match Function
function scoreItemAgainstQuery(item, query) {
  if (!query || !query.trim()) return 100;
  const q = query.trim().toLowerCase();
  const name = item.name.toLowerCase();
  const desc = item.description.toLowerCase();
  const words = name.split(/[\s\-&(),/]+/);
  const keywords = (item.searchKeywords || []).map(k => k.toLowerCase());

  let score = 0;

  // 1. Direct Full Name Exact or Prefix Match (Highest Priority)
  if (name === q) {
    return 300;
  }
  if (name.startsWith(q)) {
    score += 200;
  }

  // 2. Word-level Prefix & Exact Match (e.g. "paratha" matches "Aloo Pyaaz Paratha", "pa" matches "Pasta", "Paratha", "Paneer")
  if (words.some(w => w === q)) {
    score += 180;
  } else if (words.some(w => w.startsWith(q))) {
    score += 150;
  } else if (name.includes(q)) {
    score += 80;
  }

  // 3. Direct Dictionary Synonyms (e.g. "white sause" -> matches "alfredo", "parantha" -> "paratha")
  const directSyns = CULINARY_SYNONYMS[q];
  if (directSyns) {
    if (directSyns.some(s => words.some(w => w.startsWith(s)) || name.includes(s))) {
      score += 140;
    } else if (directSyns.some(s => desc.includes(s) || keywords.some(k => k.includes(s)))) {
      score += 60;
    }
  }

  // 4. Multi-word phrase matching (e.g. "white sause pasta", "butter maggi")
  const queryTokens = q.split(/\s+/).filter(t => t.length > 0);
  if (queryTokens.length > 1) {
    let tokenMatches = 0;
    for (const token of queryTokens) {
      const syns = CULINARY_SYNONYMS[token] || [token];
      const matched = syns.some(s => 
        words.some(w => w.startsWith(s)) || name.includes(s) || desc.includes(s) || keywords.some(k => k.includes(s))
      );
      if (matched) tokenMatches++;
    }
    if (tokenMatches === queryTokens.length) {
      score += 160;
    } else if (tokenMatches > 0) {
      score += tokenMatches * 40;
    }
  }

  // 5. Keyword & Description match
  if (keywords.some(k => k === q || k.startsWith(q))) {
    score += 70;
  } else if (keywords.some(k => k.includes(q))) {
    score += 40;
  }
  if (desc.includes(q) && score === 0) {
    score += 30;
  }

  return score;
}

export function MenuSection({ onSelectItemForCustomize, onOpenScanner, onRequireAuth, onOpenReservation }) {
  const { activeTable, diningMode, addToCart, operationalModel, loyaltyVisits } = useCart();
  const { menuItems, menuStockOverrides, requestTableService } = useOrder();
  const { customerUser } = useAuth();
  const liveItems = menuItems || MENU_ITEMS;

  const [serviceFeedback, setServiceFeedback] = useState(null);
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isVegOnly, setIsVegOnly] = useState(false);
  const [bestsellerOnly, setBestsellerOnly] = useState(false);
  const [categoryDropdownOpen, setCategoryDropdownOpen] = useState(false);
  const [searchDropdownOpen, setSearchDropdownOpen] = useState(false);
  const searchContainerRef = useRef(null);

  // Close search dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target)) {
        setSearchDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleTableService = (type, label) => {
    sounds.playClick();
    requestTableService(activeTable, type);
    setServiceFeedback(`Requested ${label} for Table #${activeTable || '04'} • Server notified`);
    setTimeout(() => setServiceFeedback(null), 4000);
  };

  // Approximate Matching Live Search Results for Dropdown (Ranked by Relevance)
  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return [];
    return liveItems
      .map(item => ({ item, score: scoreItemAgainstQuery(item, searchQuery) }))
      .filter(({ item, score }) => {
        if (score <= 0) return false;
        if (isVegOnly && (!item.isVeg || item.isEgg || item.diet === 'egg' || item.diet === 'nonveg')) {
          return false;
        }
        return true;
      })
      .sort((a, b) => b.score - a.score)
      .map(({ item }) => item);
  }, [searchQuery, isVegOnly, liveItems]);

  // Order-Centric Filtered Menu Items for Grid (Ranked by Relevance)
  const filteredItems = useMemo(() => {
    let list = liveItems.filter((item) => {
      // 1. Strict Veg-Only Filter (Strictly removes Non-Veg AND Egg items)
      if (isVegOnly) {
        if (!item.isVeg || item.isEgg || item.diet === 'egg' || item.diet === 'nonveg') {
          return false;
        }
      }

      // 2. Bestsellers Filter
      if (bestsellerOnly && !item.isBestseller) {
        return false;
      }

      // 3. Category Filter (including italian-specials aggregation)
      if (activeCategory !== 'all') {
        if (activeCategory === 'italian-specials') {
          if (!item.isItalian && item.category !== 'woodfired-pizza' && item.category !== 'pastas-mains') return false;
        } else if (item.category !== activeCategory) {
          return false;
        }
      }

      return true;
    });

    // 4. Smart Search Query Filter with Relevance Sorting
    if (searchQuery.trim()) {
      list = list
        .map(item => ({ item, score: scoreItemAgainstQuery(item, searchQuery) }))
        .filter(r => r.score > 0)
        .sort((a, b) => b.score - a.score)
        .map(r => r.item);
    }

    return list;
  }, [activeCategory, searchQuery, isVegOnly, bestsellerOnly, liveItems]);

  const handleItemAdd = (item) => {
    if (operationalModel === 'showcase') {
      sounds.playClick();
      if (onOpenReservation) onOpenReservation();
      return;
    }

    const isOutOfStock = menuStockOverrides[item.id];
    if (isOutOfStock) return;

    if (item.customizable) {
      onSelectItemForCustomize(item);
    } else {
      addToCart(item, 1);
    }
  };

  return (
    <section id="menu-section" className="py-8 sm:py-12 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Connection & Fulfillment Status Strip */}
        <div className="mb-6 p-3.5 sm:p-4 rounded-2xl bg-slate-900/90 border border-white/5 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-lg">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-400/10 border border-amber-400/20 flex items-center justify-center text-amber-400 shrink-0">
              {operationalModel === 'self-serve' ? (
                <Store className="w-4 h-4 text-cyan-400" />
              ) : operationalModel === 'delivery' ? (
                <Truck className="w-4 h-4 text-emerald-400" />
              ) : operationalModel === 'showcase' ? (
                <Calendar className="w-4 h-4 text-purple-400" />
              ) : operationalModel === 'loyalty' ? (
                <Award className="w-4 h-4 text-amber-400" />
              ) : (
                <QrCode className="w-4 h-4 text-amber-400" />
              )}
            </div>
            <div>
              <p className="text-white font-syne font-bold text-xs sm:text-sm flex items-center gap-2">
                <span>
                  {operationalModel === 'self-serve'
                    ? 'Express Counter Pickup Station'
                    : operationalModel === 'delivery'
                    ? 'Direct Doorstep Delivery'
                    : operationalModel === 'showcase'
                    ? 'Curated Tasting & Menu Showcase'
                    : operationalModel === 'loyalty'
                    ? `Loyalty Club Table #${activeTable || '04'} (${loyaltyVisits || 1}/7 Stamps)`
                    : `Table #${activeTable || '04'} Connected`}
                </span>
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              </p>
              <p className="text-slate-400 text-[11px] font-mono">
                {operationalModel === 'self-serve'
                  ? 'Your live queue token will be called at the counter window'
                  : operationalModel === 'delivery'
                  ? '30-40 min thermal courier delivery • Free > ₹499'
                  : operationalModel === 'showcase'
                  ? 'Browse authentic Italian recipes and reserve a VIP table'
                  : operationalModel === 'loyalty'
                  ? 'Orders placed automatically earn +1 punch stamp upon billing'
                  : 'Orders will be prepared fresh and served directly to your seat'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {customerUser && (
              <div className="px-3 py-1.5 rounded-xl bg-slate-950 border border-white/5 text-[11px] text-slate-300 font-mono flex items-center gap-1.5">
                <UserCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>Ordering as {customerUser.name?.split(' ')[0]}</span>
              </div>
            )}
            {operationalModel === 'showcase' ? (
              <button
                onClick={() => { sounds.playClick(); if (onOpenReservation) onOpenReservation(); }}
                className="px-3 py-1.5 rounded-xl bg-amber-400/20 hover:bg-amber-400 text-amber-300 hover:text-slate-950 text-xs font-mono font-bold transition flex items-center gap-1 border border-amber-400/30"
              >
                <Calendar className="w-3 h-3" />
                <span>Book Table Pass</span>
              </button>
            ) : (operationalModel === 'table-qr' || operationalModel === 'loyalty' || (operationalModel === 'hybrid' && diningMode === 'table')) ? (
              <button
                onClick={() => { sounds.playClick(); onOpenScanner(); }}
                className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 text-xs font-mono font-medium transition flex items-center gap-1 border border-white/5"
              >
                <QrCode className="w-3 h-3" />
                <span>Change Table</span>
              </button>
            ) : null}
          </div>
        </div>

        {/* In-Dining Quick Table Service Action Bar */}
        {(operationalModel === 'table-qr' || operationalModel === 'loyalty' || (operationalModel === 'hybrid' && diningMode === 'table')) && (
          <div className="mb-4 sm:mb-6 p-2.5 sm:p-3 rounded-2xl bg-slate-950/80 border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-2.5 sm:gap-3 shadow-inner">
            <div className="flex items-center gap-2 text-xs text-slate-400 font-mono w-full sm:w-auto justify-between sm:justify-start">
              <div className="flex items-center gap-1.5">
                <BellRing className="w-3.5 h-3.5 text-amber-400" />
                <span className="text-white font-bold font-syne">Table #{activeTable || '04'} Service:</span>
              </div>
              <span className="text-[10px] text-slate-500 font-mono sm:hidden">1-Tap Call</span>
              <span className="hidden md:inline">Instant waiter assistance</span>
            </div>

            {serviceFeedback ? (
              <div className="w-full sm:w-auto px-3 py-1.5 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-mono font-bold flex items-center justify-center gap-1.5 animate-pulse">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>{serviceFeedback}</span>
              </div>
            ) : (
              <div className="grid grid-cols-3 gap-1.5 sm:flex sm:flex-wrap w-full sm:w-auto justify-end">
                <button
                  onClick={() => handleTableService('water', 'Drinking Water')}
                  className="btn-3d btn-3d-dark px-2 sm:px-3 py-1.5 sm:py-1.5 rounded-xl text-[11px] sm:text-xs font-semibold flex items-center justify-center gap-1 sm:gap-1.5 text-cyan-300"
                >
                  <Droplets className="w-3.5 h-3.5" />
                  <span>Water</span>
                </button>

                <button
                  onClick={() => handleTableService('waiter', 'Captain / Waiter')}
                  className="btn-3d btn-3d-dark px-2 sm:px-3 py-1.5 sm:py-1.5 rounded-xl text-[11px] sm:text-xs font-semibold flex items-center justify-center gap-1 sm:gap-1.5 text-amber-300"
                >
                  <BellRing className="w-3.5 h-3.5" />
                  <span>Waiter</span>
                </button>

                <button
                  onClick={() => handleTableService('bill', 'Table Bill')}
                  className="btn-3d btn-3d-dark px-2 sm:px-3 py-1.5 sm:py-1.5 rounded-xl text-[11px] sm:text-xs font-semibold flex items-center justify-center gap-1 sm:gap-1.5 text-emerald-300"
                >
                  <Receipt className="w-3.5 h-3.5" />
                  <span>Bill</span>
                </button>
              </div>
            )}
          </div>
        )}

        {/* Minimal Order-Centric Menu Header & Controls (relative z-40 for dropdown stacking) */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 sm:gap-4 mb-4 sm:mb-6 relative z-40">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900 border border-white/10 text-slate-300 text-xs font-mono mb-1.5">
              <Clock className="w-3.5 h-3.5 text-amber-400" />
              <span>{BRAND_CONFIG.contact.openingHours} • Kitchen Active</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white font-syne tracking-tight">
              Explore Menu
            </h2>
          </div>

          {/* Unified Glassmorphic Command & Filter Console */}
          <div className="p-1.5 sm:p-2 rounded-2xl bg-slate-900/90 border border-white/10 backdrop-blur-2xl shadow-xl flex flex-col sm:flex-row items-center gap-2 w-full lg:w-auto relative z-40">
            
            {/* Search Box with Approximate Live Search Dropdown */}
            <div ref={searchContainerRef} className="relative w-full sm:w-80 z-50">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onFocus={() => setSearchDropdownOpen(true)}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setSearchDropdownOpen(true);
                }}
                placeholder="Search dishes or drinks... (e.g. pa, white sause)"
                className="w-full pl-10 pr-9 py-2 rounded-xl bg-slate-950/80 border border-white/5 focus:border-amber-400/60 focus:bg-slate-950 focus:outline-none text-white text-xs placeholder:text-slate-500 transition shadow-inner font-sans"
              />
              {searchQuery && (
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setSearchDropdownOpen(false);
                  }}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 rounded-full bg-slate-800 text-slate-400 hover:text-white transition"
                >
                  <X className="w-3 h-3" />
                </button>
              )}

              {/* MODERN & CREATIVE ANIMATED APPROXIMATE SEARCH DROPDOWN (Floats above sticky slider) */}
              <AnimatePresence>
                {searchDropdownOpen && searchQuery.trim().length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.96 }}
                    transition={{ duration: 0.2 }}
                    className="absolute left-0 right-0 sm:-left-6 sm:w-[420px] top-full mt-2 rounded-2xl sm:rounded-3xl bg-slate-900 border-2 border-slate-700/90 shadow-[0_25px_60px_rgba(0,0,0,0.95)] z-50 overflow-hidden ring-2 ring-white/10"
                  >
                    {/* Header Bar */}
                    <div className="p-3 border-b border-slate-800 bg-slate-950/80 flex items-center justify-between">
                      <div className="flex items-center gap-1.5 text-xs text-slate-300 font-syne">
                        <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                        <span>Matching dishes for <strong className="text-amber-300">"{searchQuery}"</strong></span>
                      </div>
                      <span className="px-2 py-0.5 rounded-full bg-amber-400/10 text-amber-300 font-mono text-[10px] font-bold border border-amber-400/20">
                        {searchResults.length} {searchResults.length === 1 ? 'dish' : 'dishes'}
                      </span>
                    </div>

                    {/* Results List */}
                    <div className="max-h-72 overflow-y-auto no-scrollbar p-2 space-y-1.5 bg-slate-900">
                      {searchResults.length === 0 ? (
                        <div className="p-6 text-center space-y-1">
                          <p className="text-xs text-slate-400 font-syne">No exact or approximate matches found.</p>
                          <p className="text-[10px] text-slate-600 font-mono">Try searching "pasta", "maggi", "chai", or "burger"</p>
                        </div>
                      ) : (
                        searchResults.map((dish) => {
                          const isOutOfStock = menuStockOverrides[dish.id];

                          return (
                            <div
                              key={dish.id}
                              className="p-2 rounded-xl sm:rounded-2xl bg-slate-950/80 hover:bg-slate-800 border border-white/5 hover:border-amber-400/30 transition flex items-center justify-between gap-3 group"
                            >
                              {/* Left Thumbnail + Info */}
                              <div
                                onClick={() => {
                                  setSearchDropdownOpen(false);
                                  handleItemAdd(dish);
                                }}
                                className="flex items-center gap-2.5 min-w-0 flex-1 cursor-pointer"
                              >
                                <div className="relative w-11 h-11 rounded-xl overflow-hidden shrink-0 border border-white/10 bg-slate-950">
                                  <img
                                    src={dish.image}
                                    alt={dish.name}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                  />
                                  <span
                                    className={`absolute top-1 left-1 w-2 h-2 rounded-full ring-1 ring-black ${
                                      dish.isEgg ? 'bg-amber-400' : dish.isVeg ? 'bg-emerald-400' : 'bg-rose-500'
                                    }`}
                                  />
                                </div>

                                <div className="min-w-0">
                                  <p className="text-xs font-bold text-white group-hover:text-amber-300 transition truncate font-syne">
                                    {dish.name}
                                  </p>
                                  <div className="flex items-center gap-2 text-[10px] font-mono mt-0.5">
                                    <span className="text-amber-400 font-bold">₹{dish.price}</span>
                                    <span className="text-slate-500">•</span>
                                    <span className="text-slate-400 capitalize">{dish.category.replace('-', ' ')}</span>
                                  </div>
                                </div>
                              </div>

                              {/* Right 1-Tap 3D Add to Cart Button */}
                              <button
                                disabled={isOutOfStock}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleItemAdd(dish);
                                }}
                                className={`btn-3d py-1.5 px-3 rounded-xl text-xs font-bold font-syne shrink-0 flex items-center gap-1 shadow-md ${
                                  isOutOfStock
                                    ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                                    : 'btn-3d-amber'
                                }`}
                                title="Add to Cart"
                              >
                                <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
                                <span>Add</span>
                              </button>
                            </div>
                          );
                        })
                      )}
                    </div>

                    {/* Footer Tip */}
                    <div className="p-2 px-3 border-t border-slate-800 bg-slate-950/80 text-[10px] text-slate-500 font-mono flex items-center justify-between">
                      <span>1-Tap to add or customize</span>
                      <button
                        onClick={() => setSearchDropdownOpen(false)}
                        className="text-slate-400 hover:text-white font-bold"
                      >
                        Close [Esc]
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Quick Filters Row (Veg Only & Bestseller Pills) */}
            <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-start">
              
              {/* LOTTIE-STYLE ANIMATED VEG-ONLY TOGGLE SWITCH */}
              <button
                type="button"
                onClick={() => {
                  sounds.playClick();
                  setIsVegOnly(!isVegOnly);
                }}
                className={`relative flex-1 sm:flex-none px-3 sm:px-3.5 py-1.5 sm:py-2 rounded-xl transition-all duration-300 flex items-center justify-between sm:justify-start gap-2.5 sm:gap-3 border ${
                  isVegOnly
                    ? 'bg-emerald-950/70 border-emerald-500/60 text-emerald-300 shadow-[0_0_20px_rgba(16,185,129,0.25)] ring-1 ring-emerald-400/40'
                    : 'bg-slate-950/80 hover:bg-slate-800/80 border-slate-800 text-slate-400 hover:text-white'
                }`}
                title="Filter Vegetarian Only (excludes meat and eggs)"
              >
                {/* Left: Lottie-Style Animated Sprout Icon + Fixed 'Veg Only' Label */}
                <div className="flex items-center gap-2 relative z-10">
                  <div className="relative w-5 h-5 flex items-center justify-center">
                    {/* Organic Lottie Leaf Bloom Animation */}
                    <motion.svg
                      viewBox="0 0 24 24"
                      className="w-4 h-4 overflow-visible"
                      animate={isVegOnly ? {
                        scale: [0.85, 1.3, 1],
                        rotate: [0, -18, 18, 0]
                      } : {
                        scale: 1,
                        rotate: 0
                      }}
                      transition={{ duration: 0.45, ease: "easeOut" }}
                    >
                      {/* Stem */}
                      <motion.path
                        d="M12 22C12 16 14 12 20 10"
                        fill="none"
                        stroke={isVegOnly ? '#34d399' : '#64748b'}
                        strokeWidth="2.2"
                        strokeLinecap="round"
                      />
                      {/* Leaf */}
                      <motion.path
                        d="M20 10C16 10 12 14 12 22C12 14 16 6 20 10Z"
                        fill={isVegOnly ? '#10b981' : 'none'}
                        stroke={isVegOnly ? '#059669' : '#64748b'}
                        strokeWidth="1.8"
                        strokeLinejoin="round"
                      />
                    </motion.svg>
                  </div>

                  {/* Fixed Label - Always 'Veg Only' */}
                  <span className={`text-[11px] sm:text-xs font-bold font-syne whitespace-nowrap tracking-wide transition-colors ${
                    isVegOnly ? 'text-emerald-300' : 'text-slate-300'
                  }`}>
                    Veg Only
                  </span>
                </div>

                {/* Right: Modern Spring-Loaded Slider Knob (Smooth Full Slide Left <-> Right) */}
                <div className={`w-9 h-5 rounded-full p-0.5 transition-colors duration-300 relative flex items-center shrink-0 border ${
                  isVegOnly
                    ? 'bg-emerald-500 border-emerald-400/60 shadow-lg justify-end'
                    : 'bg-slate-800 border-slate-700/80 justify-start'
                }`}>
                  <motion.div
                    layout
                    transition={{ type: 'spring', stiffness: 600, damping: 30 }}
                    className="w-4 h-4 rounded-full bg-white shadow-md flex items-center justify-center"
                  >
                    {isVegOnly && (
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 inline-block" />
                    )}
                  </motion.div>
                </div>
              </button>

              {/* 3D Tactile Bestsellers Filter Button */}
              <button
                onClick={() => {
                  sounds.playClick();
                  setBestsellerOnly(!bestsellerOnly);
                }}
                className={`btn-3d flex-1 sm:flex-none px-3 sm:px-3.5 py-1.5 sm:py-2 rounded-xl text-xs font-bold font-syne flex items-center justify-center gap-1.5 transition ${
                  bestsellerOnly
                    ? 'btn-3d-amber shadow-md'
                    : 'btn-3d-dark text-slate-400 hover:text-white'
                }`}
              >
                <Award className={`w-3.5 h-3.5 ${bestsellerOnly ? 'text-slate-950' : 'text-amber-400'}`} />
                <span>Bestsellers</span>
              </button>
            </div>

          </div>
        </div>

        {/* STICKY CATEGORY NAVIGATION WITH 3D DROPDOWN + SMOOTH GLIDE ANIMATION */}
        <div className="sticky top-16 sm:top-20 z-30 py-2 sm:py-2.5 mb-4 sm:mb-6 bg-slate-950/95 backdrop-blur-xl border-y border-white/5 -mx-4 px-4 sm:mx-0 sm:px-0">
          <div className="flex items-center gap-1.5 sm:gap-2">
            
            {/* 3D DROPDOWN BUTTON AT THE START */}
            <div className="relative shrink-0">
              <button
                onClick={() => {
                  sounds.playClick();
                  setCategoryDropdownOpen(!categoryDropdownOpen);
                }}
                className={`btn-3d ${
                  categoryDropdownOpen ? 'btn-3d-amber' : 'btn-3d-dark'
                } px-2.5 sm:px-3.5 py-1.5 sm:py-2 rounded-xl text-xs font-bold font-syne flex items-center gap-1.5 shadow-md`}
                title="Select Menu Category"
              >
                <Layers className="w-3.5 h-3.5 text-amber-400" />
                <span className="hidden sm:inline">Categories</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${categoryDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* Animated Category Dropdown Menu */}
              <AnimatePresence>
                {categoryDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.95 }}
                    transition={{ duration: 0.15 }}
                    className="absolute left-0 mt-2 w-64 rounded-3xl bg-slate-900 border border-slate-800 p-2 shadow-2xl z-50 space-y-1 backdrop-blur-2xl ring-1 ring-white/10"
                  >
                    <div className="px-3 py-2 border-b border-slate-800 text-[11px] font-mono font-bold text-slate-400 uppercase tracking-wider flex items-center justify-between">
                      <span>Menu Categories</span>
                      <span className="text-amber-400 font-bold">{CATEGORIES.length}</span>
                    </div>

                    <div className="max-h-72 overflow-y-auto no-scrollbar py-1 space-y-1">
                      {CATEGORIES.map((cat) => {
                        const isSelected = activeCategory === cat.id;
                        const count = cat.id === 'all'
                          ? liveItems.length
                          : cat.id === 'italian-specials'
                          ? liveItems.filter(i => i.isItalian || i.category === 'woodfired-pizza' || i.category === 'pastas-mains').length
                          : liveItems.filter(i => i.category === cat.id).length;

                        return (
                          <button
                            key={cat.id}
                            onClick={() => {
                              sounds.playClick();
                              setActiveCategory(cat.id);
                              setCategoryDropdownOpen(false);
                            }}
                            className={`w-full px-3 py-2 rounded-xl text-xs font-bold text-left transition flex items-center justify-between ${
                              isSelected
                                ? 'bg-amber-400 text-slate-950 font-black shadow-sm'
                                : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                            }`}
                          >
                            <span className="font-syne truncate">{cat.name}</span>
                            <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded-md ${
                              isSelected ? 'bg-slate-950/20 text-slate-950' : 'bg-slate-950 text-slate-400'
                            }`}>
                              {count}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* SMOOTH ANIMATED HORIZONTAL CATEGORIES SLIDER */}
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-0.5 flex-1 relative">
              {CATEGORIES.map((cat) => {
                const isSelected = activeCategory === cat.id;

                return (
                  <button
                    key={cat.id}
                    onClick={() => { sounds.playClick(); setActiveCategory(cat.id); }}
                    className={`relative px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl text-[11px] sm:text-xs font-bold whitespace-nowrap transition-colors duration-200 z-10 flex items-center gap-1.5 ${
                      isSelected
                        ? 'text-slate-950 font-black'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {/* Smooth LayoutId Glide Background Indicator */}
                    {isSelected && (
                      <motion.div
                        layoutId="activeCategoryIndicator"
                        transition={{ type: 'spring', stiffness: 450, damping: 35 }}
                        className="absolute inset-0 bg-amber-400 rounded-xl shadow-md -z-10 border-t border-white/40"
                      />
                    )}
                    
                    {!isSelected && (
                      <div className="absolute inset-0 bg-slate-900/90 border border-slate-800 rounded-xl -z-20" />
                    )}

                    <span className="font-syne">{cat.name}</span>
                  </button>
                );
              })}
            </div>

          </div>
        </div>

        {/* Menu Items Grid with Silk-Smooth Fluid Position Transitions */}
        {filteredItems.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.22 }}
            className="text-center py-16 bg-slate-900/40 rounded-3xl border border-white/5 space-y-3"
          >
            <p className="text-slate-400 text-xs sm:text-sm">No dishes found matching your selected filters.</p>
            <button
              onClick={() => { setSearchQuery(''); setIsVegOnly(false); setBestsellerOnly(false); setActiveCategory('all'); }}
              className="btn-3d btn-3d-amber px-4 py-2 rounded-xl text-xs font-bold font-syne"
            >
              Reset All Filters
            </button>
          </motion.div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-5 relative">
            <AnimatePresence mode="popLayout">
              {filteredItems.map((item) => {
                const isOutOfStock = menuStockOverrides[item.id];
                return (
                  <motion.div
                    key={item.id}
                    layout="position"
                    initial={{ opacity: 0, scale: 0.93, y: 10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.92, y: -8 }}
                    transition={{
                      layout: { type: "spring", stiffness: 220, damping: 26, mass: 0.9 },
                      opacity: { duration: 0.22, ease: "easeOut" },
                      scale: { duration: 0.22, ease: "easeOut" },
                      y: { duration: 0.22, ease: "easeOut" }
                    }}
                    whileHover={!isOutOfStock ? { y: -4, scale: 1.012, transition: { duration: 0.2, ease: "easeOut" } } : {}}
                    whileTap={!isOutOfStock ? { scale: 0.98 } : {}}
                    onClick={() => !isOutOfStock && handleItemAdd(item)}
                    className={`rounded-2xl sm:rounded-3xl bg-slate-900/90 border transition-colors p-2.5 sm:p-3.5 flex flex-col justify-between group cursor-pointer relative overflow-hidden shadow-lg ${
                      isOutOfStock
                        ? 'opacity-50 border-rose-900/40 grayscale'
                        : 'border-white/5 hover:border-amber-400/30'
                    }`}
                  >
                    <div>
                      {/* Item Image (Optimized 1:1 Aspect Ratio) */}
                      <div className="relative aspect-square w-full rounded-xl sm:rounded-2xl overflow-hidden mb-2 sm:mb-3 bg-slate-950">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent" />

                        {/* Tag indicator */}
                        <div className="absolute top-2 left-2 sm:top-2.5 sm:left-2.5 flex items-center gap-1 sm:gap-1.5">
                          <span
                            className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full ${
                              item.isEgg ? 'bg-amber-400' : item.isVeg ? 'bg-emerald-400' : 'bg-rose-500'
                            }`}
                          />
                          <span className={`text-[8px] sm:text-[9px] font-mono font-bold px-1 sm:px-1.5 py-0.2 rounded bg-slate-950/85 ${
                            item.isEgg ? 'text-amber-300' : item.isVeg ? 'text-emerald-400' : 'text-rose-400'
                          }`}>
                            {item.isEgg ? 'EGG' : item.isVeg ? 'VEG' : 'NON-VEG'}
                          </span>
                          {item.isBestseller && (
                            <span className="hidden xs:inline-block px-1 sm:px-1.5 py-0.2 rounded bg-amber-400 text-slate-950 text-[8px] sm:text-[9px] font-bold">
                              POPULAR
                            </span>
                          )}
                        </div>

                        {/* Out of stock banner */}
                        {isOutOfStock && (
                          <div className="absolute inset-0 bg-slate-950/85 flex items-center justify-center p-1 text-center">
                            <span className="px-1.5 sm:px-2.5 py-0.5 sm:py-1 rounded bg-rose-500/20 border border-rose-500/40 text-rose-300 font-mono font-bold text-[9px] sm:text-[11px] uppercase">
                              Sold Out
                            </span>
                          </div>
                        )}

                        {/* Prep time */}
                        <div className="absolute bottom-1.5 right-1.5 sm:bottom-2.5 sm:right-2.5 px-1.5 sm:px-2 py-0.5 rounded-md bg-slate-950/85 backdrop-blur-md text-[9px] sm:text-[10px] font-mono text-slate-300 flex items-center gap-1">
                          <Clock className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-amber-400" />
                          <span>{item.prepTime}</span>
                        </div>
                      </div>

                      {/* Title & Desc */}
                      <div className="space-y-0.5 sm:space-y-1 mb-2 sm:mb-3">
                        <h4 className="font-bold text-white text-xs sm:text-sm font-syne group-hover:text-amber-400 transition truncate sm:line-clamp-1">
                          {item.name}
                        </h4>
                        <p className="text-slate-400 text-[11px] sm:text-xs line-clamp-1 sm:line-clamp-2 leading-tight sm:leading-tight">
                          {item.description}
                        </p>
                      </div>
                    </div>

                    {/* Price & Add Action */}
                    <div className="pt-2 sm:pt-2.5 border-t border-white/5 flex items-center justify-between gap-1">
                      <span className="text-xs sm:text-base font-bold text-white font-syne shrink-0">
                        ₹{item.price}
                      </span>

                      <button
                        disabled={isOutOfStock && operationalModel !== 'showcase'}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleItemAdd(item);
                        }}
                        className={`px-2 sm:px-3.5 py-1 sm:py-1.5 rounded-lg sm:rounded-xl font-bold font-syne text-[11px] sm:text-xs flex items-center justify-center gap-1 transition shrink-0 ${
                          isOutOfStock && operationalModel !== 'showcase'
                            ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
                            : 'btn-3d btn-3d-amber'
                        }`}
                      >
                        {operationalModel === 'showcase' ? (
                          <>
                            <Calendar className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                            <span>RESERVE TABLE</span>
                          </>
                        ) : (
                          <>
                            <Plus className="w-3 h-3 sm:w-3.5 sm:h-3.5 stroke-[2.5]" />
                            <span>
                              {operationalModel === 'self-serve' 
                                ? 'PICKUP' 
                                : operationalModel === 'delivery' 
                                ? 'DELIVER' 
                                : 'ADD'}
                              <span className="hidden sm:inline">
                                {operationalModel === 'self-serve' 
                                  ? ' ORDER' 
                                  : operationalModel === 'delivery' 
                                  ? ' TO BAG' 
                                  : ' TO ORDER'}
                              </span>
                            </span>
                          </>
                        )}
                      </button>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}

      </div>
    </section>
  );
}
