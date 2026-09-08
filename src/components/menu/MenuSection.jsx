import React, { useState, useMemo, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  Plus, 
  Clock, 
  QrCode, 
  UserCheck, 
  CheckCircle2, 
  Award, 
  BellRing, 
  Droplets, 
  Receipt,
  X,
  ChevronDown,
  Layers,
  Sparkles,
  Utensils,
  Store,
  Truck,
  Calendar,
  ThumbsUp,
  Flame,
  ChefHat
} from 'lucide-react';
import { CATEGORIES, MENU_ITEMS, CULINARY_SYNONYMS } from '../../data/menuData';
import { useCart } from '../../context/CartContext';
import { useOrder } from '../../context/OrderContext';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { BRAND_CONFIG } from '../../data/cafeConfig';
import { sounds } from '../../utils/audio';

// Smart Fuzzy Match Scoring Function
function scoreItemAgainstQuery(item, query) {
  if (!query || !query.trim()) return 100;
  const q = query.trim().toLowerCase();
  const name = item.name.toLowerCase();
  const desc = item.description.toLowerCase();
  const words = name.split(/[\s\-&(),/]+/);
  const keywords = (item.searchKeywords || []).map(k => k.toLowerCase());

  let score = 0;

  if (name === q) return 300;
  if (name.startsWith(q)) score += 200;

  if (words.some(w => w === q)) {
    score += 180;
  } else if (words.some(w => w.startsWith(q))) {
    score += 150;
  } else if (name.includes(q)) {
    score += 80;
  }

  const directSyns = CULINARY_SYNONYMS[q];
  if (directSyns) {
    if (directSyns.some(s => words.some(w => w.startsWith(s)) || name.includes(s))) {
      score += 140;
    } else if (directSyns.some(s => desc.includes(s) || keywords.some(k => k.includes(s)))) {
      score += 60;
    }
  }

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
    if (tokenMatches === queryTokens.length) score += 160;
    else if (tokenMatches > 0) score += tokenMatches * 40;
  }

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
  const { isLight } = useTheme();
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
    if (!activeTable) {
      if (onOpenScanner) onOpenScanner();
      return;
    }
    requestTableService(activeTable, type);
    setServiceFeedback(`Requested ${label} for Table #${activeTable} • Server notified`);
    setTimeout(() => setServiceFeedback(null), 4000);
  };

  // Fuzzy Search Results for Dropdown
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

  // Filtered Menu Items for Grid
  const filteredItems = useMemo(() => {
    let list = liveItems.filter((item) => {
      if (isVegOnly) {
        if (!item.isVeg || item.isEgg || item.diet === 'egg' || item.diet === 'nonveg') {
          return false;
        }
      }

      if (bestsellerOnly && !item.isBestseller) {
        return false;
      }

      if (activeCategory !== 'all') {
        if (activeCategory === 'italian-specials') {
          if (!item.isItalian && item.category !== 'woodfired-pizza' && item.category !== 'pastas-mains') return false;
        } else if (item.category !== activeCategory) {
          return false;
        }
      }

      return true;
    });

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
    <section id="menu-section" className={`pt-3 sm:pt-5 pb-12 sm:pb-16 relative transition-colors duration-300 ${
      isLight ? 'bg-[#FAF7F2] text-[#12100E]' : 'bg-[#12100E] text-[#FAF7F2]'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Atelier Table Dining Welcome & Status Header (Fills space above Table Connected) */}
        <div className="mb-4 sm:mb-5 space-y-2.5 text-left">
          {/* Top Breadcrumb & Live Kitchen Status Pill */}
          <div className="flex flex-wrap items-center justify-between gap-2.5 pb-2.5 border-b border-black/10 dark:border-white/10">
            <div className="flex items-center gap-2 text-[11px] font-mono tracking-wider uppercase">
              <span className="text-[#D04834] font-bold flex items-center gap-1">
                <Sparkles className="w-3 h-3" />
                MILAN ATELIER
              </span>
              <span className={isLight ? 'text-black/20' : 'text-white/20'}>/</span>
              <span className={isLight ? 'text-stone-600' : 'text-stone-300'}>IN-SEAT DINING</span>
              <span className={isLight ? 'text-black/20' : 'text-white/20'}>/</span>
              <span className={`font-bold ${activeTable ? 'text-emerald-600 dark:text-emerald-400' : 'text-[#D04834]'}`}>
                {activeTable ? `TABLE #${activeTable}` : 'NO TABLE BOUND'}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <div className={`flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-mono border ${
                isLight 
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-700' 
                  : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
              }`}>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span>KITCHEN FIRING • LIVE PREP</span>
              </div>
              <span className={`text-[10px] font-mono hidden sm:inline ${
                isLight ? 'text-stone-500' : 'text-stone-400'
              }`}>
                {BRAND_CONFIG.contact.openingHours}
              </span>
            </div>
          </div>

          {/* Editorial Headline & Brief Dining Context */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-3">
            <div>
              <h2 className="text-xl sm:text-3xl font-editorial font-bold tracking-tight">
                <span className={isLight ? 'text-[#12100E]' : 'text-white'}>
                  Seat-Side Ordering & Table Concierge
                </span>
              </h2>
              <p className={`text-xs font-mono mt-0.5 max-w-2xl ${isLight ? 'text-stone-600' : 'text-stone-400'}`}>
                Handcrafted woodfired recipes, artisanal sourdough crusts, and specialty brews prepared fresh and delivered straight to your seat.
              </p>
            </div>

            {/* Quick Dining Value Badges */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0 scrollbar-none shrink-0">
              <div className={`px-2.5 py-1 rounded-xl border text-[10px] font-mono flex items-center gap-1.5 shrink-0 ${
                isLight ? 'bg-white border-black/10 text-stone-700' : 'bg-white/5 border-white/10 text-stone-300'
              }`}>
                <Flame className="w-3 h-3 text-[#D04834]" />
                <span>Woodfired Live</span>
              </div>
              <div className={`px-2.5 py-1 rounded-xl border text-[10px] font-mono flex items-center gap-1.5 shrink-0 ${
                isLight ? 'bg-white border-black/10 text-stone-700' : 'bg-white/5 border-white/10 text-stone-300'
              }`}>
                <ChefHat className="w-3 h-3 text-emerald-500" />
                <span>Chef Prepared</span>
              </div>
              <div className={`px-2.5 py-1 rounded-xl border text-[10px] font-mono flex items-center gap-1.5 shrink-0 ${
                isLight ? 'bg-white border-black/10 text-stone-700' : 'bg-white/5 border-white/10 text-stone-300'
              }`}>
                <Clock className="w-3 h-3 text-amber-500" />
                <span>12-15m Avg Prep</span>
              </div>
            </div>
          </div>
        </div>

        {/* Service Station Status Bar */}
        <div className={`mb-6 p-4 rounded-2xl border flex flex-col sm:flex-row items-center justify-between gap-4 shadow-lg text-left transition-colors ${
          isLight ? 'bg-white border-black/10 shadow-stone-300/30' : 'bg-[#1A1614] border-white/10'
        }`}>
          <div className="flex items-center gap-3.5">
            <div className={`w-10 h-10 rounded-xl border flex items-center justify-center text-[#D04834] shrink-0 ${
              isLight ? 'bg-black/5 border-black/10' : 'bg-white/5 border-white/15'
            }`}>
              {operationalModel === 'self-serve' ? (
                <Store className="w-5 h-5 text-cyan-600" />
              ) : operationalModel === 'delivery' ? (
                <Truck className="w-5 h-5 text-emerald-600" />
              ) : operationalModel === 'showcase' ? (
                <Calendar className="w-5 h-5 text-[#D04834]" />
              ) : operationalModel === 'loyalty' ? (
                <Award className="w-5 h-5 text-[#D04834]" />
              ) : (
                <QrCode className="w-5 h-5 text-[#D04834]" />
              )}
            </div>

            <div>
              <p className={`font-editorial text-base font-bold flex items-center gap-2 ${isLight ? 'text-[#12100E]' : 'text-white'}`}>
                <span>
                  {operationalModel === 'self-serve'
                    ? 'Express Counter Pickup Station'
                    : operationalModel === 'delivery'
                    ? 'Doorstep Delivery Active'
                    : operationalModel === 'showcase'
                    ? 'Curated Tasting & Menu Showcase'
                    : operationalModel === 'loyalty'
                    ? activeTable ? `Loyalty Club Table #${activeTable} (${loyaltyVisits || 1}/7 Stamps)` : 'Loyalty Club • Select Table'
                    : activeTable ? `Table #${activeTable} Connected` : 'Select Dining Table'}
                </span>
                <CheckCircle2 className={`w-4 h-4 ${activeTable ? 'text-emerald-500' : 'text-amber-500'}`} />
              </p>
              <p className={`text-xs font-mono ${isLight ? 'text-stone-600' : 'text-stone-400'}`}>
                {operationalModel === 'self-serve'
                  ? 'Your live queue token will chime at the counter window'
                  : operationalModel === 'delivery'
                  ? '30-40 min thermal dispatch • Free delivery over ₹499'
                  : operationalModel === 'showcase'
                  ? 'Browse handcrafted recipes and reserve your VIP table'
                  : operationalModel === 'loyalty'
                  ? 'Orders placed automatically earn +1 punch stamp upon billing'
                  : activeTable
                  ? 'Orders are freshly prepared and served directly to your seat'
                  : 'Tap to select an available table or scan table QR plaque'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            {customerUser && (
              <div className={`px-3 py-1.5 rounded-xl border text-xs font-mono flex items-center gap-2 ${
                isLight ? 'bg-[#FAF7F2] border-black/10 text-stone-700' : 'bg-black/40 border-white/10 text-stone-300'
              }`}>
                <UserCheck className="w-3.5 h-3.5 text-emerald-500" />
                <span>Guest: {customerUser.name?.split(' ')[0]}</span>
              </div>
            )}
            {operationalModel === 'showcase' ? (
              <button
                onClick={() => { sounds.playClick(); if (onOpenReservation) onOpenReservation(); }}
                className={`px-4 py-2 rounded-xl text-xs font-syne font-bold uppercase transition flex items-center gap-1.5 cursor-pointer ${
                  isLight ? 'bg-[#12100E] text-[#FAF7F2] hover:bg-black' : 'bg-[#FAF7F2] text-[#12100E] hover:bg-[#E8E0D2]'
                }`}
              >
                <Calendar className="w-3.5 h-3.5" />
                <span>Book Table</span>
              </button>
            ) : (operationalModel === 'table-qr' || operationalModel === 'loyalty' || (operationalModel === 'hybrid' && diningMode === 'table')) ? (
              <button
                onClick={() => { sounds.playClick(); onOpenScanner(); }}
                className={`px-3.5 py-2 rounded-xl text-xs font-mono transition flex items-center gap-1.5 border cursor-pointer ${
                  isLight
                    ? 'bg-[#EAE4D9] hover:bg-[#DFD8CC] text-[#12100E] border-black/15'
                    : 'bg-[#12100E] hover:bg-black text-stone-200 border-white/15'
                }`}
              >
                <QrCode className="w-3.5 h-3.5 text-[#D04834]" />
                <span>{activeTable ? 'Change Table' : 'Select Table'}</span>
              </button>
            ) : null}
          </div>
        </div>

        {/* In-Dining Quick Table Service Action Bar */}
        {(operationalModel === 'table-qr' || operationalModel === 'loyalty' || (operationalModel === 'hybrid' && diningMode === 'table')) && (
          <div className={`mb-6 p-3 sm:p-3.5 rounded-2xl border flex flex-col sm:flex-row items-center justify-between gap-3 text-left transition-colors ${
            isLight ? 'bg-[#F0EAE1] border-black/10' : 'bg-[#161210] border-white/10'
          }`}>
            <div className="flex items-center gap-2.5 text-xs font-mono w-full sm:w-auto justify-between sm:justify-start">
              <div className="flex items-center gap-2">
                <BellRing className="w-3.5 h-3.5 text-[#D04834]" />
                <span className={`font-bold font-editorial text-sm ${isLight ? 'text-[#12100E]' : 'text-white'}`}>
                  {activeTable ? `Table #${activeTable} Service:` : 'Seat Service:'}
                </span>
              </div>
              <span className={`text-[11px] hidden md:inline ${isLight ? 'text-stone-600' : 'text-stone-400'}`}>
                Instant server assistance
              </span>
            </div>

            {serviceFeedback ? (
              <div className="w-full sm:w-auto px-4 py-1.5 rounded-xl bg-emerald-500/20 text-emerald-600 border border-emerald-500/30 text-xs font-mono font-bold flex items-center justify-center gap-2 animate-pulse">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>{serviceFeedback}</span>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2 w-full sm:w-auto">
                <button
                  onClick={() => handleTableService('water', 'Drinking Water')}
                  className={`px-4 py-2 sm:py-1.5 rounded-xl text-xs font-mono font-medium flex items-center justify-center gap-1.5 border transition active:scale-95 cursor-pointer ${
                    isLight
                      ? 'bg-white hover:bg-stone-50 active:bg-stone-100 text-sky-700 border-stone-200 shadow-2xs'
                      : 'bg-[#1C1917] hover:bg-[#25201C] active:bg-[#2f2924] text-sky-400 border-white/10'
                  }`}
                  title="Request drinking water for your table"
                >
                  <Droplets className="w-3.5 h-3.5 text-sky-500" />
                  <span>Water</span>
                </button>

                <button
                  onClick={() => handleTableService('waiter', 'Captain / Waiter')}
                  className={`px-4 py-2 sm:py-1.5 rounded-xl text-xs font-mono font-medium flex items-center justify-center gap-1.5 border transition active:scale-95 cursor-pointer ${
                    isLight
                      ? 'bg-white hover:bg-stone-50 active:bg-stone-100 text-[#D04834] border-stone-200 shadow-2xs'
                      : 'bg-[#1C1917] hover:bg-[#25201C] active:bg-[#2f2924] text-[#E8E439] border-white/10'
                  }`}
                  title="Call Captain / Waiter to your table"
                >
                  <BellRing className="w-3.5 h-3.5 text-[#D04834]" />
                  <span>Waiter</span>
                </button>
              </div>
            )}
          </div>
        )}

        {/* Menu Header & Command Bar */}
        <div className={`flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-8 border-b pb-6 text-left transition-colors ${
          isLight ? 'border-black/10' : 'border-white/10'
        }`}>
          <div>
            <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-md border text-xs font-mono uppercase tracking-widest mb-2 ${
              isLight ? 'bg-black/5 border-black/10 text-stone-700' : 'bg-white/5 border-white/10 text-stone-300'
            }`}>
              <Clock className="w-3 h-3 text-[#D04834]" />
              <span>{BRAND_CONFIG.contact.openingHours} • KITCHEN OPEN</span>
            </div>
            
            <h2 className="text-3xl sm:text-5xl font-bold tracking-tight">
              <span className={`font-editorial block ${isLight ? 'text-[#12100E]' : 'text-white'}`}>
                Our Menu & Offerings.
              </span>
              <span className={`font-editorial-italic font-black text-2xl sm:text-4xl block mt-1 ${
                isLight ? 'text-[#12100E]' : 'text-[#FAF7F2]'
              }`}>
                The Culinary Lookbook.
              </span>
            </h2>
          </div>

          {/* Search & Dietary Filters Bar */}
          <div className="flex flex-col sm:flex-row items-center gap-3 w-full lg:w-auto relative z-40">
            
            {/* Search Box */}
            <div ref={searchContainerRef} className="relative w-full sm:w-80">
              <Search className="w-4 h-4 opacity-50 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onFocus={() => setSearchDropdownOpen(true)}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setSearchDropdownOpen(true);
                }}
                placeholder="Search pizza, pasta, macchiato..."
                className={`w-full pl-10 pr-9 py-2.5 rounded-xl border focus:outline-none text-xs font-mono transition ${
                  isLight
                    ? 'bg-white border-black/15 text-[#12100E] placeholder:text-stone-400 focus:border-black'
                    : 'bg-[#1A1614] border-white/15 text-white placeholder:text-stone-500 focus:border-[#FAF7F2]'
                }`}
              />
              {searchQuery && (
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setSearchDropdownOpen(false);
                  }}
                  className={`absolute right-2.5 top-1/2 -translate-y-1/2 p-1 rounded-full ${
                    isLight ? 'bg-stone-200 text-stone-600' : 'bg-stone-800 text-stone-400'
                  } hover:text-white transition`}
                >
                  <X className="w-3 h-3" />
                </button>
              )}

              {/* Search Dropdown */}
              <AnimatePresence>
                {searchDropdownOpen && searchQuery.trim().length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.96 }}
                    transition={{ duration: 0.18 }}
                    className={`absolute left-0 right-0 sm:w-[380px] top-full mt-2 rounded-2xl border shadow-2xl z-50 overflow-hidden text-left ${
                      isLight
                        ? 'bg-white border-black/15 text-[#12100E]'
                        : 'bg-[#1A1614] border-white/15 text-white'
                    }`}
                  >
                    <div className={`p-3 border-b flex items-center justify-between text-xs font-mono ${
                      isLight ? 'bg-[#FAF7F2] border-black/10' : 'bg-[#12100E] border-white/10'
                    }`}>
                      <span>Matches for "{searchQuery}"</span>
                      <span className="text-[#D04834] font-bold">{searchResults.length} found</span>
                    </div>

                    <div className="max-h-72 overflow-y-auto no-scrollbar p-2 space-y-1">
                      {searchResults.length === 0 ? (
                        <div className="p-6 text-center space-y-1 text-xs opacity-60 font-mono">
                          <p>No culinary matches found.</p>
                          <p className="text-[10px]">Try searching "margherita", "alfredo", or "tiramisu"</p>
                        </div>
                      ) : (
                        searchResults.map((dish) => (
                          <div
                            key={dish.id}
                            onClick={() => {
                              setSearchDropdownOpen(false);
                              handleItemAdd(dish);
                            }}
                            className={`p-2 rounded-xl transition flex items-center justify-between gap-3 group cursor-pointer ${
                              isLight ? 'hover:bg-black/5' : 'hover:bg-white/5'
                            }`}
                          >
                            <div className="flex items-center gap-2.5 min-w-0 flex-1">
                              <img
                                src={dish.image}
                                alt={dish.name}
                                className="w-10 h-10 rounded-lg object-cover bg-stone-900 shrink-0"
                              />
                              <div className="min-w-0">
                                <p className="text-xs font-bold font-editorial truncate">
                                  {dish.name}
                                </p>
                                <p className="text-[10px] font-mono opacity-60">
                                  <span className="font-number font-bold">₹{dish.price}</span> • {dish.prepTime}
                                </p>
                              </div>
                            </div>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleItemAdd(dish);
                              }}
                              className={`px-2.5 py-1 rounded-lg text-xs font-mono transition ${
                                isLight
                                  ? 'bg-black/5 hover:bg-[#12100E] hover:text-[#FAF7F2]'
                                  : 'bg-white/10 hover:bg-[#FAF7F2] hover:text-[#12100E]'
                              }`}
                            >
                              Add
                            </button>
                          </div>
                        ))
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Quick Toggle Filters */}
            <div className="flex items-center gap-2 w-full sm:w-auto">
              {/* Veg Only Switch */}
              <button
                onClick={() => {
                  sounds.playClick();
                  setIsVegOnly(!isVegOnly);
                }}
                className={`px-3 py-2 rounded-xl text-xs font-mono flex items-center gap-2 border transition cursor-pointer ${
                  isVegOnly
                    ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-600 font-bold'
                    : isLight
                    ? 'bg-white border-black/15 text-[#12100E] hover:border-black/30'
                    : 'bg-[#1A1614] border-white/15 text-stone-300 hover:border-white/30'
                }`}
              >
                <span className={`w-2 h-2 rounded-full ${isVegOnly ? 'bg-emerald-500' : 'bg-stone-400'}`} />
                <span>Veg Only</span>
              </button>

              {/* Bestseller Filter */}
              <button
                onClick={() => {
                  sounds.playClick();
                  setBestsellerOnly(!bestsellerOnly);
                }}
                className={`px-3 py-2 rounded-xl text-xs font-mono flex items-center gap-1.5 border transition cursor-pointer ${
                  bestsellerOnly
                    ? 'bg-[#D04834]/20 border-[#D04834] text-[#D04834] font-bold'
                    : isLight
                    ? 'bg-white border-black/15 text-[#12100E] hover:border-black/30'
                    : 'bg-[#1A1614] border-white/15 text-stone-300 hover:border-white/30'
                }`}
              >
                <Award className={`w-3.5 h-3.5 ${bestsellerOnly ? 'text-[#D04834]' : 'opacity-60'}`} />
                <span>Bestsellers</span>
              </button>
            </div>

          </div>
        </div>

        {/* Sticky Horizontal Categories Lookbook Bar */}
        <div className={`sticky top-16 sm:top-20 z-30 py-2.5 mb-8 backdrop-blur-xl border-y -mx-4 px-4 sm:mx-0 sm:px-0 transition-colors duration-300 ${
          isLight ? 'bg-[#FAF7F2]/95 border-black/10' : 'bg-[#12100E]/95 border-white/10'
        }`}>
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
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
                  onClick={() => { sounds.playClick(); setActiveCategory(cat.id); }}
                  className={`relative px-4 py-2 rounded-xl text-xs font-mono whitespace-nowrap transition-colors flex items-center gap-2 z-10 uppercase tracking-wider cursor-pointer ${
                    isSelected
                      ? isLight ? 'text-[#FAF7F2] font-bold' : 'text-[#12100E] font-bold'
                      : isLight ? 'text-stone-700 hover:text-black' : 'text-stone-400 hover:text-white'
                  }`}
                >
                  {isSelected && (
                    <motion.div
                      layoutId="menuActiveCategoryPill"
                      transition={{ type: 'spring', stiffness: 400, damping: 35 }}
                      className={`absolute inset-0 rounded-xl -z-10 shadow-md ${
                        isLight ? 'bg-[#12100E]' : 'bg-[#FAF7F2]'
                      }`}
                    />
                  )}
                  {!isSelected && (
                    <div className={`absolute inset-0 rounded-xl -z-20 border ${
                      isLight ? 'bg-white border-black/10' : 'bg-[#1A1614] border-white/10'
                    }`} />
                  )}

                  <span>{cat.name}</span>
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-md ${
                    isSelected 
                      ? isLight ? 'bg-white/20 text-[#FAF7F2]' : 'bg-black/10 text-[#12100E]' 
                      : isLight ? 'bg-black/5 text-stone-600' : 'bg-black/40 text-stone-500'
                  }`}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Editorial Culinary Spread Grid */}
        {filteredItems.length === 0 ? (
          <div className={`text-center py-20 rounded-3xl border space-y-3 ${
            isLight ? 'bg-white border-black/10' : 'bg-[#1A1614] border-white/10'
          }`}>
            <p className={`font-editorial text-xl ${isLight ? 'text-[#12100E]' : 'text-white'}`}>
              No dishes found matching your current filter.
            </p>
            <p className="opacity-60 text-xs font-mono">Try resetting your diet or search query.</p>
            <button
              onClick={() => { setSearchQuery(''); setIsVegOnly(false); setBestsellerOnly(false); setActiveCategory('all'); }}
              className={`px-5 py-2.5 rounded-xl text-xs font-syne font-bold uppercase ${
                isLight ? 'bg-[#12100E] text-[#FAF7F2]' : 'bg-[#FAF7F2] text-[#12100E]'
              }`}
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 relative text-left">
            <AnimatePresence mode="popLayout">
              {filteredItems.map((item) => {
                const isOutOfStock = menuStockOverrides[item.id];

                return (
                  <motion.div
                    key={item.id}
                    layout="position"
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                    whileHover={!isOutOfStock ? { y: -5 } : {}}
                    onClick={() => !isOutOfStock && handleItemAdd(item)}
                    className={`rounded-3xl border p-4 flex flex-col justify-between group cursor-pointer relative overflow-hidden transition-all shadow-lg ${
                      isOutOfStock
                        ? 'opacity-50 border-rose-900/30 grayscale'
                        : isLight
                        ? 'bg-white border-black/10 hover:border-black/25 shadow-stone-300/30'
                        : 'bg-[#1A1614] border-white/10 hover:border-white/25'
                    }`}
                  >
                    <div>
                      {/* Dish Photo */}
                      <div className="relative aspect-[4/3] w-full rounded-2xl overflow-hidden mb-3.5 bg-stone-950">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-75" />

                        {/* Top Badges */}
                        <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
                          <span
                            className={`w-2 h-2 rounded-full ${
                              item.isEgg ? 'bg-[#E8E439]' : item.isVeg ? 'bg-emerald-400' : 'bg-[#D04834]'
                            }`}
                          />
                          <span className="text-[9px] font-mono font-bold px-2 py-0.5 rounded-full bg-[#12100E]/90 text-stone-200 border border-white/10 uppercase">
                            {item.isEgg ? 'Egg' : item.isVeg ? 'Veg' : 'Non-Veg'}
                          </span>
                          {item.isBestseller && (
                            <span className="text-[9px] font-mono font-bold px-2 py-0.5 rounded-full bg-[#D04834] text-white">
                              SIGNATURE
                            </span>
                          )}
                        </div>

                        {/* Out of Stock Banner */}
                        {isOutOfStock && (
                          <div className="absolute inset-0 bg-[#12100E]/85 flex items-center justify-center p-2 text-center">
                            <span className="px-3 py-1 rounded bg-rose-500/20 border border-rose-500/40 text-rose-300 font-mono font-bold text-xs uppercase">
                              Sold Out
                            </span>
                          </div>
                        )}

                        {/* Prep time */}
                        <div className="absolute bottom-2.5 right-2.5 px-2 py-0.5 rounded-md bg-[#12100E]/90 backdrop-blur-md text-[10px] font-mono text-stone-300 flex items-center gap-1">
                          <Clock className="w-3 h-3 text-[#D04834]" />
                          <span>{item.prepTime}</span>
                        </div>
                      </div>

                      {/* Title & Description */}
                      <div className="space-y-1.5 mb-4">
                        <div className="flex items-start justify-between gap-2">
                          <h3 className={`font-editorial text-lg font-bold transition line-clamp-1 ${
                            isLight ? 'text-[#12100E]' : 'text-white'
                          }`}>
                            {item.name}
                          </h3>
                        </div>

                        <p className={`text-xs line-clamp-2 leading-relaxed font-normal ${
                          isLight ? 'text-stone-600' : 'text-stone-400'
                        }`}>
                          {item.description}
                        </p>
                      </div>
                    </div>

                    {/* Price & Action Button */}
                    <div className={`pt-3 border-t flex items-center justify-between gap-2 ${
                      isLight ? 'border-black/10' : 'border-white/10'
                    }`}>
                      <span className={`font-number text-lg font-bold tracking-tight ${isLight ? 'text-[#12100E]' : 'text-white'}`}>
                        ₹{item.price}
                      </span>

                      <button
                        disabled={isOutOfStock && operationalModel !== 'showcase'}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleItemAdd(item);
                        }}
                        className={`px-4 py-2 sm:px-3.5 sm:py-1.5 rounded-xl font-syne text-xs font-bold transition active:scale-95 flex items-center gap-1.5 cursor-pointer shadow-md ${
                          isOutOfStock && operationalModel !== 'showcase'
                            ? 'bg-stone-300 text-stone-500 cursor-not-allowed'
                            : isLight
                            ? 'bg-[#12100E] text-[#FAF7F2] hover:bg-black active:bg-stone-800'
                            : 'bg-[#FAF7F2] text-[#12100E] hover:bg-[#E8E0D2] active:bg-white'
                        }`}
                      >
                        {operationalModel === 'showcase' ? (
                          <>
                            <Calendar className="w-3.5 h-3.5" />
                            <span>Reserve</span>
                          </>
                        ) : (
                          <>
                            <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
                            <span>{item.customizable ? 'Customize' : 'Add'}</span>
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
