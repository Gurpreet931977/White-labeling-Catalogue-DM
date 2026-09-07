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
  Flame
} from 'lucide-react';
import { CATEGORIES, MENU_ITEMS, CULINARY_SYNONYMS } from '../../data/menuData';
import { useCart } from '../../context/CartContext';
import { useOrder } from '../../context/OrderContext';
import { useAuth } from '../../context/AuthContext';
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
    <section id="menu-section" className="py-8 sm:py-14 relative bg-[#12100E] text-[#FAF7F2]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Service Station Status Bar */}
        <div className="mb-6 p-4 rounded-2xl bg-[#1A1614] border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-lg text-left">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/15 flex items-center justify-center text-[#D04834] shrink-0">
              {operationalModel === 'self-serve' ? (
                <Store className="w-5 h-5 text-cyan-400" />
              ) : operationalModel === 'delivery' ? (
                <Truck className="w-5 h-5 text-emerald-400" />
              ) : operationalModel === 'showcase' ? (
                <Calendar className="w-5 h-5 text-[#E8E439]" />
              ) : operationalModel === 'loyalty' ? (
                <Award className="w-5 h-5 text-[#E8E439]" />
              ) : (
                <QrCode className="w-5 h-5 text-[#D04834]" />
              )}
            </div>

            <div>
              <p className="text-white font-editorial text-base font-bold flex items-center gap-2">
                <span>
                  {operationalModel === 'self-serve'
                    ? 'Express Counter Pickup Station'
                    : operationalModel === 'delivery'
                    ? 'Doorstep Delivery Active'
                    : operationalModel === 'showcase'
                    ? 'Curated Tasting & Menu Showcase'
                    : operationalModel === 'loyalty'
                    ? `Loyalty Club Table #${activeTable || '04'} (${loyaltyVisits || 1}/7 Stamps)`
                    : `Tavolo #${activeTable || '04'} Connected`}
                </span>
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              </p>
              <p className="text-stone-400 text-xs font-mono">
                {operationalModel === 'self-serve'
                  ? 'Your live queue token will chime at the counter window'
                  : operationalModel === 'delivery'
                  ? '30-40 min thermal dispatch • Free delivery over ₹499'
                  : operationalModel === 'showcase'
                  ? 'Browse authentic Italian recipes and reserve your VIP table'
                  : operationalModel === 'loyalty'
                  ? 'Orders placed automatically earn +1 punch stamp upon billing'
                  : 'Orders are freshly wood-fired and served directly to your seat'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            {customerUser && (
              <div className="px-3 py-1.5 rounded-xl bg-black/40 border border-white/10 text-xs text-stone-300 font-mono flex items-center gap-2">
                <UserCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>Ospite: {customerUser.name?.split(' ')[0]}</span>
              </div>
            )}
            {operationalModel === 'showcase' ? (
              <button
                onClick={() => { sounds.playClick(); if (onOpenReservation) onOpenReservation(); }}
                className="px-4 py-2 rounded-xl bg-[#FAF7F2] text-[#12100E] text-xs font-syne font-bold uppercase transition flex items-center gap-1.5 hover:bg-[#E8E0D2] cursor-pointer"
              >
                <Calendar className="w-3.5 h-3.5" />
                <span>Book Table</span>
              </button>
            ) : (operationalModel === 'table-qr' || operationalModel === 'loyalty' || (operationalModel === 'hybrid' && diningMode === 'table')) ? (
              <button
                onClick={() => { sounds.playClick(); onOpenScanner(); }}
                className="px-3.5 py-2 rounded-xl bg-[#12100E] hover:bg-black text-stone-200 text-xs font-mono transition flex items-center gap-1.5 border border-white/15 cursor-pointer"
              >
                <QrCode className="w-3.5 h-3.5 text-[#D04834]" />
                <span>Change Table</span>
              </button>
            ) : null}
          </div>
        </div>

        {/* In-Dining Quick Table Service Action Bar */}
        {(operationalModel === 'table-qr' || operationalModel === 'loyalty' || (operationalModel === 'hybrid' && diningMode === 'table')) && (
          <div className="mb-6 p-3 sm:p-3.5 rounded-2xl bg-[#161210] border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-left">
            <div className="flex items-center gap-2.5 text-xs text-stone-300 font-mono w-full sm:w-auto justify-between sm:justify-start">
              <div className="flex items-center gap-2">
                <BellRing className="w-3.5 h-3.5 text-[#D04834]" />
                <span className="text-white font-bold font-editorial text-sm">Table #{activeTable || '04'} Service:</span>
              </div>
              <span className="text-[11px] text-stone-400 hidden md:inline">Instant server assistance</span>
            </div>

            {serviceFeedback ? (
              <div className="w-full sm:w-auto px-4 py-1.5 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-mono font-bold flex items-center justify-center gap-2 animate-pulse">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>{serviceFeedback}</span>
              </div>
            ) : (
              <div className="grid grid-cols-3 gap-2 w-full sm:w-auto">
                <button
                  onClick={() => handleTableService('water', 'Drinking Water')}
                  className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-cyan-300 text-xs font-mono flex items-center justify-center gap-1.5 border border-white/10 transition cursor-pointer"
                >
                  <Droplets className="w-3.5 h-3.5" />
                  <span>Acqua</span>
                </button>

                <button
                  onClick={() => handleTableService('waiter', 'Captain / Waiter')}
                  className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-[#E8E439] text-xs font-mono flex items-center justify-center gap-1.5 border border-white/10 transition cursor-pointer"
                >
                  <BellRing className="w-3.5 h-3.5" />
                  <span>Cameriere</span>
                </button>

                <button
                  onClick={() => handleTableService('bill', 'Table Bill')}
                  className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-emerald-300 text-xs font-mono flex items-center justify-center gap-1.5 border border-white/10 transition cursor-pointer"
                >
                  <Receipt className="w-3.5 h-3.5" />
                  <span>Il Conto</span>
                </button>
              </div>
            )}
          </div>
        )}

        {/* Menu Header & Command Bar */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-8 border-b border-white/10 pb-6 text-left">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-white/5 border border-white/10 text-xs font-mono text-stone-300 uppercase tracking-widest mb-2">
              <Clock className="w-3 h-3 text-[#D04834]" />
              <span>{BRAND_CONFIG.contact.openingHours} • CUCINA ATTIVA</span>
            </div>
            
            <h2 className="text-3xl sm:text-5xl font-bold text-white tracking-tight">
              <span className="font-editorial block">Carta delle Vivande.</span>
              <span className="font-editorial-italic text-[#FAF7F2] font-black text-2xl sm:text-4xl block mt-1">
                The Culinary Lookbook.
              </span>
            </h2>
          </div>

          {/* Search & Dietary Filters Bar */}
          <div className="flex flex-col sm:flex-row items-center gap-3 w-full lg:w-auto relative z-40">
            
            {/* Search Box */}
            <div ref={searchContainerRef} className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onFocus={() => setSearchDropdownOpen(true)}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setSearchDropdownOpen(true);
                }}
                placeholder="Search pizza, pasta, macchiato..."
                className="w-full pl-10 pr-9 py-2.5 rounded-xl bg-[#1A1614] border border-white/15 focus:border-[#FAF7F2] focus:outline-none text-white text-xs placeholder:text-stone-500 font-mono transition"
              />
              {searchQuery && (
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setSearchDropdownOpen(false);
                  }}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 rounded-full bg-stone-800 text-stone-400 hover:text-white transition"
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
                    className="absolute left-0 right-0 sm:w-[380px] top-full mt-2 rounded-2xl bg-[#1A1614] border border-white/15 shadow-2xl z-50 overflow-hidden text-left"
                  >
                    <div className="p-3 border-b border-white/10 bg-[#12100E] flex items-center justify-between text-xs font-mono text-stone-300">
                      <span>Matches for "{searchQuery}"</span>
                      <span className="text-[#D04834] font-bold">{searchResults.length} found</span>
                    </div>

                    <div className="max-h-72 overflow-y-auto no-scrollbar p-2 space-y-1 bg-[#1A1614]">
                      {searchResults.length === 0 ? (
                        <div className="p-6 text-center space-y-1 text-xs text-stone-400 font-mono">
                          <p>No culinary matches found.</p>
                          <p className="text-[10px] text-stone-600">Try searching "margherita", "alfredo", or "tiramisu"</p>
                        </div>
                      ) : (
                        searchResults.map((dish) => (
                          <div
                            key={dish.id}
                            onClick={() => {
                              setSearchDropdownOpen(false);
                              handleItemAdd(dish);
                            }}
                            className="p-2 rounded-xl hover:bg-white/5 transition flex items-center justify-between gap-3 group cursor-pointer"
                          >
                            <div className="flex items-center gap-2.5 min-w-0 flex-1">
                              <img
                                src={dish.image}
                                alt={dish.name}
                                className="w-10 h-10 rounded-lg object-cover bg-stone-900 shrink-0"
                              />
                              <div className="min-w-0">
                                <p className="text-xs font-bold text-white font-editorial truncate group-hover:text-[#FAF7F2]">
                                  {dish.name}
                                </p>
                                <p className="text-[10px] font-mono text-stone-400">
                                  ₹{dish.price} • {dish.prepTime}
                                </p>
                              </div>
                            </div>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleItemAdd(dish);
                              }}
                              className="px-2.5 py-1 rounded-lg bg-white/10 text-xs font-mono hover:bg-[#FAF7F2] hover:text-[#12100E] transition"
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
                className={`px-3 py-2 rounded-xl text-xs font-mono flex items-center gap-2 border transition ${
                  isVegOnly
                    ? 'bg-emerald-950/80 border-emerald-500/50 text-emerald-300'
                    : 'bg-[#1A1614] border-white/15 text-stone-300 hover:border-white/30'
                }`}
              >
                <span className={`w-2 h-2 rounded-full ${isVegOnly ? 'bg-emerald-400' : 'bg-stone-500'}`} />
                <span>Veg Only</span>
              </button>

              {/* Bestseller Filter */}
              <button
                onClick={() => {
                  sounds.playClick();
                  setBestsellerOnly(!bestsellerOnly);
                }}
                className={`px-3 py-2 rounded-xl text-xs font-mono flex items-center gap-1.5 border transition ${
                  bestsellerOnly
                    ? 'bg-[#D04834]/20 border-[#D04834] text-[#FAF7F2]'
                    : 'bg-[#1A1614] border-white/15 text-stone-300 hover:border-white/30'
                }`}
              >
                <Award className={`w-3.5 h-3.5 ${bestsellerOnly ? 'text-[#E8E439]' : 'text-stone-400'}`} />
                <span>Bestsellers</span>
              </button>
            </div>

          </div>
        </div>

        {/* Sticky Horizontal Categories Lookbook Bar */}
        <div className="sticky top-16 sm:top-20 z-30 py-2.5 mb-8 bg-[#12100E]/95 backdrop-blur-xl border-y border-white/10 -mx-4 px-4 sm:mx-0 sm:px-0">
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
                  className={`relative px-4 py-2 rounded-xl text-xs font-mono whitespace-nowrap transition-colors flex items-center gap-2 z-10 uppercase tracking-wider ${
                    isSelected
                      ? 'text-[#12100E] font-bold'
                      : 'text-stone-400 hover:text-white'
                  }`}
                >
                  {isSelected && (
                    <motion.div
                      layoutId="menuActiveCategoryPill"
                      transition={{ type: 'spring', stiffness: 400, damping: 35 }}
                      className="absolute inset-0 bg-[#FAF7F2] rounded-xl -z-10 shadow-md"
                    />
                  )}
                  {!isSelected && (
                    <div className="absolute inset-0 bg-[#1A1614] border border-white/10 rounded-xl -z-20" />
                  )}

                  <span>{cat.name}</span>
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-md ${
                    isSelected ? 'bg-black/10 text-[#12100E]' : 'bg-black/40 text-stone-500'
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
          <div className="text-center py-20 bg-[#1A1614] rounded-3xl border border-white/10 space-y-3">
            <p className="font-editorial text-xl text-white">No dishes found matching your current filter.</p>
            <p className="text-stone-400 text-xs font-mono">Try resetting your diet or search query.</p>
            <button
              onClick={() => { setSearchQuery(''); setIsVegOnly(false); setBestsellerOnly(false); setActiveCategory('all'); }}
              className="px-5 py-2.5 rounded-xl bg-[#FAF7F2] text-[#12100E] text-xs font-syne font-bold uppercase"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 relative text-left">
            <AnimatePresence mode="popLayout">
              {filteredItems.map((item, idx) => {
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
                    className={`rounded-3xl bg-[#1A1614] border p-4 flex flex-col justify-between group cursor-pointer relative overflow-hidden transition-all shadow-lg ${
                      isOutOfStock
                        ? 'opacity-50 border-rose-900/30 grayscale'
                        : 'border-white/10 hover:border-white/25'
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
                        <div className="absolute inset-0 bg-gradient-to-t from-[#12100E] via-transparent to-transparent opacity-75" />

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
                          <h3 className="font-editorial text-lg font-bold text-white group-hover:text-[#FAF7F2] transition line-clamp-1">
                            {item.name}
                          </h3>
                        </div>

                        <p className="text-stone-400 text-xs line-clamp-2 leading-relaxed font-normal">
                          {item.description}
                        </p>
                      </div>
                    </div>

                    {/* Price & Action Button */}
                    <div className="pt-3 border-t border-white/10 flex items-center justify-between gap-2">
                      <span className="font-syne text-base font-black text-white">
                        ₹{item.price}
                      </span>

                      <button
                        disabled={isOutOfStock && operationalModel !== 'showcase'}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleItemAdd(item);
                        }}
                        className={`px-3.5 py-1.5 rounded-xl font-syne text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                          isOutOfStock && operationalModel !== 'showcase'
                            ? 'bg-stone-800 text-stone-500 cursor-not-allowed'
                            : 'bg-[#FAF7F2] text-[#12100E] hover:bg-[#E8E0D2]'
                        }`}
                      >
                        {operationalModel === 'showcase' ? (
                          <>
                            <Calendar className="w-3.5 h-3.5" />
                            <span>Prenota</span>
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
