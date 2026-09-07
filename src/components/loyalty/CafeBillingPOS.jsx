import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Receipt, 
  Printer, 
  Plus, 
  Minus, 
  Trash2, 
  Percent, 
  Coffee, 
  Store, 
  Sparkles, 
  Check, 
  Flame, 
  CreditCard, 
  Banknote, 
  QrCode, 
  Search, 
  X, 
  CheckCircle2, 
  RotateCcw,
  Tag,
  Clock,
  ShieldCheck,
  Zap
} from 'lucide-react';
import { sounds } from '../../utils/audio';
import { 
  LOYALTY_GIFTS_POOL, 
  processBillingTransaction, 
  getGiftById 
} from '../../utils/loyaltyStorage';

// Curated Coffee Shop & Bakery Menu for POS Billing
const POS_MENU_ITEMS = [
  // ☕ Espresso & Handcrafted Brews
  { id: 'pos-1', name: 'Espresso Double Shot', category: 'coffee', price: 130, icon: '☕' },
  { id: 'pos-2', name: 'Americano (Hot / Iced)', category: 'coffee', price: 150, icon: '☕' },
  { id: 'pos-3', name: 'Artisan Flat White', category: 'coffee', price: 180, icon: '☕' },
  { id: 'pos-4', name: 'Creamy Cappuccino', category: 'coffee', price: 170, icon: '☕' },
  { id: 'pos-5', name: 'Caramel Macchiato', category: 'coffee', price: 220, icon: '☕' },
  { id: 'pos-6', name: 'Cold Brew on Ice', category: 'coffee', price: 190, icon: '☕' },
  { id: 'pos-7', name: 'Iced Hazelnut Latte', category: 'coffee', price: 230, icon: '☕' },
  { id: 'pos-8', name: 'Manual Pour-Over V60', category: 'coffee', price: 240, icon: '☕' },

  // 🥐 Artisan Bakery & Pastries
  { id: 'pos-9', name: 'French Butter Croissant', category: 'bakery', price: 140, icon: '🥐' },
  { id: 'pos-10', name: 'Almond Frangipane Croissant', category: 'bakery', price: 180, icon: '🥐' },
  { id: 'pos-11', name: 'Pain au Chocolat', category: 'bakery', price: 170, icon: '🥐' },
  { id: 'pos-12', name: 'Warm Cinnamon Swirl Roll', category: 'bakery', price: 150, icon: '🥐' },
  { id: 'pos-13', name: 'Blueberry Cream Scone', category: 'bakery', price: 130, icon: '🥐' },
  { id: 'pos-14', name: 'Artisan Glazed Donut', category: 'bakery', price: 110, icon: '🍩' },

  // 🥖 Savory & Sourdough
  { id: 'pos-15', name: 'Country Sourdough Loaf', category: 'savory', price: 220, icon: '🥖' },
  { id: 'pos-16', name: 'Pesto Mozzarella Panini', category: 'savory', price: 280, icon: '🥪' },
  { id: 'pos-17', name: 'Avocado Sourdough Toast', category: 'savory', price: 260, icon: '🥑' },
  { id: 'pos-18', name: 'Smoked Cream Cheese Bagel', category: 'savory', price: 240, icon: '🥯' },

  // 🧃 Coolers & Specials
  { id: 'pos-19', name: 'Ceremonial Matcha Latte', category: 'coolers', price: 240, icon: '🍵' },
  { id: 'pos-20', name: 'Belgian Hot Chocolate', category: 'coolers', price: 220, icon: '🍫' },
  { id: 'pos-21', name: 'Mango Passion Fruit Cooler', category: 'coolers', price: 190, icon: '🍹' },
];

export function CafeBillingPOS({ 
  customers = [], 
  selectedCustomerId, 
  onSelectCustomer, 
  onBillSettled,
  totalStamps = 6,
  onAddNewCustomer
}) {
  // POS Order Items State
  const [billItems, setBillItems] = useState([
    { id: 'pos-3', name: 'Artisan Flat White', price: 180, qty: 1 },
    { id: 'pos-9', name: 'French Butter Croissant', price: 140, qty: 1 },
  ]);

  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  
  // Custom Off-Menu Item Input
  const [customItemName, setCustomItemName] = useState('');
  const [customItemPrice, setCustomItemPrice] = useState('');

  // Tax & Discount Settings
  const [taxRatePercent, setTaxRatePercent] = useState(5); // 5% standard restaurant GST (2.5% CGST + 2.5% SGST)
  const [discountPercent, setDiscountPercent] = useState(0);
  const [appliedRewardNote, setAppliedRewardNote] = useState('');

  // Payment Tender Option (Cash, UPI, Card - NO payment gateway)
  const [paymentMethod, setPaymentMethod] = useState('UPI'); // 'UPI', 'CASH', 'CARD'
  const [cashTendered, setCashTendered] = useState('');

  // Thermal Receipt Modal
  const [printedReceipt, setPrintedReceipt] = useState(null);

  // Active Linked Customer
  const currentCustomer = customers.find((c) => c.id === selectedCustomerId) || customers[0];
  const hasStreakBonus = (currentCustomer?.streakDays || 0) >= 5;
  const assignedGift = getGiftById(currentCustomer?.assignedGiftId || 'discount50');

  // Add Item to Bill
  const handleAddItem = (item) => {
    sounds.playAddToCart();
    setBillItems((prev) => {
      const existing = prev.find((i) => i.id === item.id);
      if (existing) {
        return prev.map((i) => i.id === item.id ? { ...i, qty: i.qty + 1 } : i);
      }
      return [...prev, { id: item.id, name: item.name, price: item.price, qty: 1 }];
    });
  };

  // Update Qty
  const handleUpdateQty = (itemId, delta) => {
    sounds.playClick();
    setBillItems((prev) => {
      return prev
        .map((i) => {
          if (i.id === itemId) {
            const nextQty = i.qty + delta;
            return nextQty > 0 ? { ...i, qty: nextQty } : null;
          }
          return i;
        })
        .filter(Boolean);
    });
  };

  // Remove Item
  const handleRemoveItem = (itemId) => {
    sounds.playClick();
    setBillItems((prev) => prev.filter((i) => i.id !== itemId));
  };

  // Add Custom Off-Menu Item
  const handleAddCustomItem = (e) => {
    e.preventDefault();
    if (!customItemName || !customItemPrice) return;
    sounds.playAddToCart();
    const newItem = {
      id: `custom-${Date.now()}`,
      name: customItemName,
      price: Number(customItemPrice) || 50,
      qty: 1
    };
    setBillItems((prev) => [...prev, newItem]);
    setCustomItemName('');
    setCustomItemPrice('');
  };

  // Clear Bill
  const handleClearBill = () => {
    sounds.playClick();
    setBillItems([]);
    setDiscountPercent(0);
    setAppliedRewardNote('');
    setCashTendered('');
  };

  // Apply Customer's 50% Milestone Discount
  const handleApply50PercentMilestone = () => {
    sounds.playClick();
    setDiscountPercent(50);
    setAppliedRewardNote('50% OFF Milestone Reward Applied');
  };

  // Financial Calculations (with GST)
  const subtotal = billItems.reduce((acc, item) => acc + item.price * item.qty, 0);
  const discountAmount = Math.round((subtotal * discountPercent) / 100);
  const taxableAmount = Math.max(0, subtotal - discountAmount);
  
  // Split GST into CGST and SGST
  const totalGstAmount = Math.round((taxableAmount * taxRatePercent) / 100);
  const cgstAmount = Number((totalGstAmount / 2).toFixed(2));
  const sgstAmount = Number((totalGstAmount / 2).toFixed(2));
  const grandTotal = taxableAmount + totalGstAmount;

  const changeDue = paymentMethod === 'CASH' && Number(cashTendered) > grandTotal
    ? Number(cashTendered) - grandTotal
    : 0;

  // Filtered Menu Items
  const filteredMenuItems = POS_MENU_ITEMS.filter((item) => {
    const matchesCategory = activeCategory === 'all' || item.category === activeCategory;
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Final Settle & Print Bill Action
  const handleSettleAndPrintBill = () => {
    if (billItems.length === 0) return;
    sounds.playStampSquish();

    const itemsSummary = billItems.map((i) => `${i.qty}x ${i.name}`).join(', ');

    // Call Centralized Billing & Loyalty Auto-Stamp Engine
    const loyaltyResult = processBillingTransaction({
      customerId: currentCustomer?.id,
      phone: currentCustomer?.phone,
      billAmount: grandTotal,
      billItems: itemsSummary
    });

    const invoiceData = {
      invoiceNo: `INV-${new Date().getFullYear()}${(new Date().getMonth() + 1).toString().padStart(2, '0')}-${Math.floor(1000 + Math.random() * 9000)}`,
      date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      cashier: 'Terminal #01 (Barista Alex)',
      gstin: '05AAACH1234F1Z8',
      fssai: '10822005000123',
      cafeName: 'BREW & CRUMB ROASTERY & BAKERY',
      address: 'Shop 12, Rajpur Road, Dehradun • Tel: +91 98765 43210',
      customer: currentCustomer,
      items: [...billItems],
      subtotal,
      discountPercent,
      discountAmount,
      appliedRewardNote,
      taxRatePercent,
      cgstAmount,
      sgstAmount,
      totalGstAmount,
      grandTotal,
      paymentMethod,
      cashTendered: Number(cashTendered) || grandTotal,
      changeDue,
      loyaltyResult: loyaltyResult || {
        stampsAwarded: hasStreakBonus ? 2 : 1,
        hasStreakBonus,
        isRewardUnlocked: (currentCustomer?.stamps || 0) + (hasStreakBonus ? 2 : 1) >= totalStamps,
        customer: {
          ...currentCustomer,
          stamps: Math.min(totalStamps, (currentCustomer?.stamps || 0) + (hasStreakBonus ? 2 : 1))
        }
      }
    };

    setPrintedReceipt(invoiceData);
    if (onBillSettled) onBillSettled(invoiceData);
  };

  // Trigger Browser Native Print
  const handleNativePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      
      {/* POS Top Header Banner */}
      <div className="p-5 rounded-3xl bg-[#111111] border border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-[#ebd73f] text-black flex items-center justify-center font-black shadow-md">
            <Receipt className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono text-[#ebd73f] font-bold uppercase tracking-wider">
                CAFE BILLING &amp; RECEIPT PRINTER
              </span>
              <span className="text-[9px] font-mono px-2 py-0.2 rounded-full bg-white/10 text-slate-300">
                GST ENABLED (CGST+SGST)
              </span>
            </div>
            <h3 className="font-panchang font-bold text-lg text-white">
              Instant Order Invoice &amp; Auto-Stamp Register
            </h3>
          </div>
        </div>

        {/* GSTIN & Cashier Tag */}
        <div className="text-right text-xs font-mono text-slate-400">
          <span className="text-white block font-bold">GSTIN: 05AAACH1234F1Z8</span>
          <span className="text-[11px] text-slate-500">Terminal 01 • No Gateway Needed</span>
        </div>
      </div>

      {/* Customer Linking Bar & Streak Status */}
      <div className="p-4 rounded-2xl bg-black/60 border border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <span className="text-xs font-mono text-slate-400 shrink-0">Bill To Customer:</span>
          <select
            value={selectedCustomerId}
            onChange={(e) => {
              sounds.playClick();
              if (onSelectCustomer) onSelectCustomer(e.target.value);
            }}
            className="flex-1 sm:flex-none px-3 py-1.5 rounded-xl bg-slate-900 border border-white/20 text-white font-mono text-xs focus:outline-none focus:border-[#ebd73f] cursor-pointer"
          >
            {customers.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name} ({c.phone}) • {c.stamps}/{totalStamps} Stamps
              </option>
            ))}
          </select>
          {onAddNewCustomer && (
            <button
              type="button"
              onClick={() => { sounds.playClick(); onAddNewCustomer(); }}
              className="px-2.5 py-1.5 rounded-xl bg-white/10 hover:bg-[#ebd73f] hover:text-black text-white text-xs font-mono font-bold transition flex items-center gap-1 cursor-pointer shrink-0"
              title="Quick enroll new customer at counter"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>New</span>
            </button>
          )}
        </div>

        {/* Live Streak Status on POS */}
        <div className="flex items-center gap-2 text-xs">
          {hasStreakBonus ? (
            <span className="px-3 py-1 rounded-full bg-orange-500/20 text-orange-300 border border-orange-500/40 font-mono font-bold flex items-center gap-1.5 animate-pulse">
              <Zap className="w-3.5 h-3.5 fill-orange-400" />
              <span>5-Day Streak Active: +2 STAMPS on this bill!</span>
            </span>
          ) : (
            <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 font-mono text-slate-400 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-[#ebd73f]" />
              <span>Standard Bill: +1 Stamp on completion</span>
            </span>
          )}

          {/* Quick Apply 50% Milestone if customer assigned 50% discount */}
          {assignedGift.id === 'discount50' && (
            <button
              type="button"
              onClick={handleApply50PercentMilestone}
              className="px-2.5 py-1 rounded-full bg-amber-400/20 hover:bg-amber-400/30 text-amber-300 font-mono text-xs font-bold border border-amber-400/40 transition cursor-pointer"
            >
              Apply 50% OFF
            </button>
          )}
        </div>
      </div>

      {/* Main Billing Grid: Left Menu Catalog (7 Cols) + Right Bill Ticket (5 Cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* ================================================================= */}
        {/* LEFT: POS MENU ITEM SELECTOR (7 Columns)                          */}
        {/* ================================================================= */}
        <div className="lg:col-span-7 space-y-4">
          
          {/* Category Filter Pills & Search */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search coffee or bakery items..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 rounded-xl bg-black border border-white/15 text-white text-xs font-clash focus:outline-none focus:border-[#ebd73f]"
                />
              </div>

              {/* Clear search */}
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="p-2 rounded-xl bg-white/5 text-slate-400 hover:text-white text-xs"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Category Buttons */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs no-scrollbar">
              {[
                { id: 'all', label: 'All Items' },
                { id: 'coffee', label: '☕ Espresso & Brews' },
                { id: 'bakery', label: '🥐 Pastries & Bakes' },
                { id: 'savory', label: '🥖 Sourdough & Savory' },
                { id: 'coolers', label: '🧃 Coolers & Specials' },
              ].map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => { sounds.playClick(); setActiveCategory(cat.id); }}
                  className={`px-3 py-1.5 rounded-xl font-semibold whitespace-nowrap transition cursor-pointer ${
                    activeCategory === cat.id
                      ? 'bg-[#ebd73f] text-black font-bold shadow-sm'
                      : 'bg-white/5 text-slate-300 hover:text-white hover:bg-white/10'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* Grid of Menu Items */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 max-h-[380px] overflow-y-auto pr-1">
            {filteredMenuItems.map((item) => (
              <motion.button
                key={item.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => handleAddItem(item)}
                className="p-3 rounded-2xl bg-[#111111] hover:bg-[#181818] border border-white/10 hover:border-[#ebd73f]/50 text-left transition cursor-pointer flex flex-col justify-between group shadow-sm"
              >
                <div className="flex items-start justify-between gap-1">
                  <span className="text-xl">{item.icon}</span>
                  <span className="font-mono text-xs font-bold text-[#ebd73f]">₹{item.price}</span>
                </div>
                <div className="mt-2">
                  <h5 className="font-syne font-bold text-xs text-white group-hover:text-[#ebd73f] transition-colors line-clamp-1">
                    {item.name}
                  </h5>
                  <span className="text-[10px] font-mono text-slate-500 uppercase">+ Tap to Add</span>
                </div>
              </motion.button>
            ))}
          </div>

          {/* Quick Add Custom Off-Menu Item Form */}
          <form onSubmit={handleAddCustomItem} className="p-3 rounded-2xl bg-black/40 border border-white/10 flex items-center gap-2">
            <span className="text-xs font-mono text-slate-400 whitespace-nowrap hidden sm:inline">Custom Item:</span>
            <input
              type="text"
              placeholder="e.g. Extra Oat Milk, Special Muffin"
              value={customItemName}
              onChange={(e) => setCustomItemName(e.target.value)}
              className="flex-1 px-3 py-1.5 rounded-xl bg-slate-900 border border-white/15 text-white text-xs focus:outline-none focus:border-[#ebd73f]"
            />
            <input
              type="number"
              placeholder="₹ Price"
              value={customItemPrice}
              onChange={(e) => setCustomItemPrice(e.target.value)}
              className="w-20 px-3 py-1.5 rounded-xl bg-slate-900 border border-white/15 text-white text-xs font-mono font-bold focus:outline-none focus:border-[#ebd73f]"
            />
            <button
              type="submit"
              className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-[#ebd73f] hover:text-black text-xs font-bold font-syne transition cursor-pointer whitespace-nowrap"
            >
              + Add
            </button>
          </form>

        </div>

        {/* ================================================================= */}
        {/* RIGHT: LIVE BILL INVOICE & TAX SUMMARY (5 Columns)                */}
        {/* ================================================================= */}
        <div className="lg:col-span-5 p-5 rounded-3xl bg-[#0f0f0f] border-2 border-white/15 shadow-2xl flex flex-col justify-between space-y-4">
          
          {/* Bill Header */}
          <div className="flex items-center justify-between pb-3 border-b border-white/10">
            <div className="flex items-center gap-2">
              <Receipt className="w-4 h-4 text-[#ebd73f]" />
              <h4 className="font-panchang font-bold text-sm text-white">Current Bill Invoice</h4>
            </div>

            <button
              type="button"
              onClick={handleClearBill}
              className="text-[10px] font-mono text-slate-400 hover:text-rose-400 transition cursor-pointer flex items-center gap-1"
            >
              <Trash2 className="w-3 h-3" />
              <span>Clear</span>
            </button>
          </div>

          {/* Itemized Lines */}
          <div className="space-y-2 max-h-52 overflow-y-auto pr-1 flex-1">
            {billItems.length === 0 ? (
              <div className="py-8 text-center text-xs font-mono text-slate-500 space-y-1">
                <Store className="w-6 h-6 mx-auto opacity-40 mb-1" />
                <p>No items added yet.</p>
                <p className="text-[10px]">Tap items on the left to build the bill.</p>
              </div>
            ) : (
              billItems.map((item) => (
                <div
                  key={item.id}
                  className="p-2.5 rounded-xl bg-black/50 border border-white/5 flex items-center justify-between gap-2 text-xs"
                >
                  <div className="flex-1 min-w-0">
                    <h6 className="font-syne font-bold text-white text-xs truncate">{item.name}</h6>
                    <span className="font-mono text-[10px] text-slate-400">₹{item.price} each</span>
                  </div>

                  {/* Quantity stepper */}
                  <div className="flex items-center gap-1.5 bg-white/5 rounded-lg px-1.5 py-0.5 border border-white/10">
                    <button
                      type="button"
                      onClick={() => handleUpdateQty(item.id, -1)}
                      className="p-0.5 text-slate-400 hover:text-white cursor-pointer"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="font-mono font-bold text-xs text-white px-1">{item.qty}</span>
                    <button
                      type="button"
                      onClick={() => handleUpdateQty(item.id, 1)}
                      className="p-0.5 text-slate-400 hover:text-white cursor-pointer"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>

                  {/* Line Total */}
                  <span className="font-mono font-bold text-xs text-[#ebd73f] w-14 text-right">
                    ₹{item.price * item.qty}
                  </span>

                  <button
                    type="button"
                    onClick={() => handleRemoveItem(item.id)}
                    className="text-slate-500 hover:text-rose-400 cursor-pointer p-1"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))
            )}
          </div>

          {/* Tax, GST & Discount Controls */}
          <div className="pt-3 border-t border-white/10 space-y-2 text-xs font-mono">
            
            {/* GST Rate Selector: 5% vs 18% */}
            <div className="flex items-center justify-between">
              <span className="text-slate-400">GST Rate:</span>
              <div className="flex items-center gap-1">
                {[
                  { label: '5% (Cafe/Restaurant)', val: 5 },
                  { label: '18% Special', val: 18 },
                  { label: '0% Nil', val: 0 }
                ].map((g) => (
                  <button
                    type="button"
                    key={g.val}
                    onClick={() => setTaxRatePercent(g.val)}
                    className={`px-2 py-0.5 rounded text-[10px] font-mono transition cursor-pointer ${
                      taxRatePercent === g.val
                        ? 'bg-[#ebd73f] text-black font-bold'
                        : 'bg-white/5 text-slate-400 hover:text-white'
                    }`}
                  >
                    {g.val}%
                  </button>
                ))}
              </div>
            </div>

            {/* Discount Control */}
            <div className="flex items-center justify-between">
              <span className="text-slate-400 flex items-center gap-1">
                <Tag className="w-3 h-3 text-amber-400" />
                <span>Discount:</span>
              </span>
              <div className="flex items-center gap-1">
                {[0, 10, 20, 50].map((d) => (
                  <button
                    type="button"
                    key={d}
                    onClick={() => {
                      setDiscountPercent(d);
                      if (d === 50) setAppliedRewardNote('50% OFF Milestone Reward');
                      else setAppliedRewardNote('');
                    }}
                    className={`px-2 py-0.5 rounded text-[10px] font-mono transition cursor-pointer ${
                      discountPercent === d
                        ? 'bg-amber-400 text-black font-bold'
                        : 'bg-white/5 text-slate-400 hover:text-white'
                    }`}
                  >
                    {d}%
                  </button>
                ))}
              </div>
            </div>

            {/* Calculations Breakdown */}
            <div className="p-3 rounded-2xl bg-black/70 border border-white/5 space-y-1 pt-2">
              <div className="flex items-center justify-between text-slate-400">
                <span>Subtotal ({billItems.reduce((sum, i) => sum + i.qty, 0)} items):</span>
                <span className="text-white">₹{subtotal}</span>
              </div>

              {discountPercent > 0 && (
                <div className="flex items-center justify-between text-emerald-400">
                  <span>Discount ({discountPercent}%):</span>
                  <span>-₹{discountAmount}</span>
                </div>
              )}

              {taxRatePercent > 0 && (
                <>
                  <div className="flex items-center justify-between text-slate-400 text-[11px]">
                    <span>CGST ({(taxRatePercent / 2).toFixed(1)}%):</span>
                    <span>₹{cgstAmount}</span>
                  </div>
                  <div className="flex items-center justify-between text-slate-400 text-[11px]">
                    <span>SGST ({(taxRatePercent / 2).toFixed(1)}%):</span>
                    <span>₹{sgstAmount}</span>
                  </div>
                </>
              )}

              <div className="pt-2 border-t border-white/10 flex items-center justify-between text-sm font-bold font-syne">
                <span className="text-white">Grand Total (Inc. GST):</span>
                <span className="text-[#ebd73f] text-base font-mono">₹{grandTotal}</span>
              </div>
            </div>

            {/* Payment Method Tag (No Gateway, pure POS tender) */}
            <div className="pt-2 space-y-1.5">
              <span className="text-[10px] text-slate-400 block font-mono">Payment Tender Mode (Receipt Tag):</span>
              <div className="grid grid-cols-3 gap-1.5">
                {[
                  { id: 'UPI', label: 'UPI / QR', icon: QrCode },
                  { id: 'CASH', label: 'Cash', icon: Banknote },
                  { id: 'CARD', label: 'Card Swipe', icon: CreditCard }
                ].map((m) => {
                  const Icon = m.icon;
                  return (
                    <button
                      type="button"
                      key={m.id}
                      onClick={() => setPaymentMethod(m.id)}
                      className={`py-2 px-2 rounded-xl text-xs font-mono font-bold flex items-center justify-center gap-1.5 transition cursor-pointer border ${
                        paymentMethod === m.id
                          ? 'bg-amber-400 text-black border-amber-400 shadow-sm'
                          : 'bg-black/50 border-white/10 text-slate-300 hover:text-white'
                      }`}
                    >
                      <Icon className="w-3.5 h-3.5" />
                      <span>{m.label}</span>
                    </button>
                  );
                })}
              </div>

              {/* Cash Change Calculator */}
              {paymentMethod === 'CASH' && (
                <div className="flex items-center gap-2 pt-1">
                  <input
                    type="number"
                    placeholder="Cash Given (e.g. ₹500)"
                    value={cashTendered}
                    onChange={(e) => setCashTendered(e.target.value)}
                    className="flex-1 px-3 py-1.5 rounded-xl bg-black border border-white/15 text-white font-mono text-xs focus:outline-none focus:border-[#ebd73f]"
                  />
                  <div className="text-right font-mono text-xs text-slate-300">
                    <span>Change: </span>
                    <strong className="text-emerald-400">₹{changeDue}</strong>
                  </div>
                </div>
              )}
            </div>

          </div>

          {/* Big Action: Settle Bill & Print Thermal Receipt */}
          <button
            type="button"
            disabled={billItems.length === 0}
            onClick={handleSettleAndPrintBill}
            className="w-full btn-dripp-primary py-3.5 text-xs sm:text-sm font-bold flex items-center justify-center gap-2 cursor-pointer shadow-xl disabled:opacity-40"
          >
            <Printer className="w-4 h-4" />
            <span>Settle Bill &amp; Print Thermal Receipt</span>
          </button>

          <p className="text-[10px] font-mono text-slate-500 text-center">
            Automatically awards loyalty stamp ({hasStreakBonus ? '+2 for 5-day streak' : '+1 stamp'}) upon printing.
          </p>

        </div>

      </div>

      {/* ================================================================= */}
      {/* THERMAL RECEIPT PRINT MODAL (Authentic 80mm Cafe Receipt)         */}
      {/* ================================================================= */}
      <AnimatePresence>
        {printedReceipt && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 15 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 15 }}
              className="relative w-full max-w-sm rounded-3xl bg-neutral-900 border border-white/20 p-5 shadow-2xl space-y-4 text-white max-h-[90vh] flex flex-col no-print"
            >
              {/* Modal Top Bar */}
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <Printer className="w-4 h-4 text-[#ebd73f]" />
                  <h4 className="font-panchang font-bold text-sm text-white">Thermal Receipt Preview</h4>
                </div>
                <button
                  onClick={() => setPrintedReceipt(null)}
                  className="p-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* AUTHENTIC 80MM THERMAL RECEIPT PAPER VIEW */}
              <div 
                id="thermal-receipt-paper" 
                className="print-receipt-container overflow-y-auto p-4 bg-white text-black font-mono text-xs rounded-xl shadow-inner space-y-3 leading-tight select-text"
              >
                {/* Store Header */}
                <div className="text-center space-y-1 pb-2 border-b border-dashed border-neutral-400">
                  <h3 className="font-black text-sm tracking-wider uppercase">{printedReceipt.cafeName}</h3>
                  <p className="text-[10px] text-neutral-600">{printedReceipt.address}</p>
                  <p className="text-[10px] text-neutral-600">GSTIN: {printedReceipt.gstin} | FSSAI: {printedReceipt.fssai}</p>
                  <p className="font-bold text-[11px] pt-1">*** TAX INVOICE / CASH MEMO ***</p>
                </div>

                {/* Invoice Metadata */}
                <div className="space-y-0.5 text-[11px] pb-2 border-b border-dashed border-neutral-400">
                  <div className="flex justify-between">
                    <span>Invoice: {printedReceipt.invoiceNo}</span>
                    <span>Date: {printedReceipt.date}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Time: {printedReceipt.time}</span>
                    <span>Cashier: {printedReceipt.cashier}</span>
                  </div>
                  <div className="flex justify-between font-bold pt-1">
                    <span>Customer: {printedReceipt.customer?.name}</span>
                    <span>#{printedReceipt.customer?.phone}</span>
                  </div>
                </div>

                {/* Items Table */}
                <div className="space-y-1.5 pb-2 border-b border-dashed border-neutral-400">
                  <div className="flex justify-between font-bold text-[11px] pb-1 border-b border-neutral-300">
                    <span className="w-6">Qty</span>
                    <span className="flex-1 text-left">Item</span>
                    <span className="w-12 text-right">Rate</span>
                    <span className="w-14 text-right">Amount</span>
                  </div>

                  {printedReceipt.items.map((it, idx) => (
                    <div key={idx} className="flex justify-between text-[11px]">
                      <span className="w-6">{it.qty}</span>
                      <span className="flex-1 text-left truncate">{it.name}</span>
                      <span className="w-12 text-right">₹{it.price}</span>
                      <span className="w-14 text-right font-bold">₹{it.price * it.qty}</span>
                    </div>
                  ))}
                </div>

                {/* Totals Breakdown */}
                <div className="space-y-1 text-[11px] pb-2 border-b border-dashed border-neutral-400">
                  <div className="flex justify-between">
                    <span>Subtotal:</span>
                    <span>₹{printedReceipt.subtotal}</span>
                  </div>

                  {printedReceipt.discountPercent > 0 && (
                    <div className="flex justify-between text-neutral-700 font-bold">
                      <span>Discount ({printedReceipt.discountPercent}%):</span>
                      <span>-₹{printedReceipt.discountAmount}</span>
                    </div>
                  )}

                  {printedReceipt.taxRatePercent > 0 && (
                    <>
                      <div className="flex justify-between text-neutral-600 text-[10px]">
                        <span>CGST ({(printedReceipt.taxRatePercent / 2).toFixed(1)}%):</span>
                        <span>₹{printedReceipt.cgstAmount}</span>
                      </div>
                      <div className="flex justify-between text-neutral-600 text-[10px]">
                        <span>SGST ({(printedReceipt.taxRatePercent / 2).toFixed(1)}%):</span>
                        <span>₹{printedReceipt.sgstAmount}</span>
                      </div>
                    </>
                  )}

                  <div className="flex justify-between font-black text-sm pt-1 border-t border-neutral-400">
                    <span>GRAND TOTAL:</span>
                    <span>₹{printedReceipt.grandTotal}</span>
                  </div>

                  <div className="flex justify-between text-[10px] text-neutral-600 pt-0.5">
                    <span>Tender Mode: {printedReceipt.paymentMethod}</span>
                    <span>Amount Paid: ₹{printedReceipt.cashTendered}</span>
                  </div>

                  {printedReceipt.changeDue > 0 && (
                    <div className="flex justify-between text-[10px] text-neutral-800 font-bold">
                      <span>Change Returned:</span>
                      <span>₹{printedReceipt.changeDue}</span>
                    </div>
                  )}
                </div>

                {/* LOYALTY PROGRAM SUMMARY ON PRINTED RECEIPT */}
                <div className="text-center space-y-1 pb-2 border-b border-dashed border-neutral-400 pt-1">
                  <p className="font-bold text-[11px]">*** LOYALTY REWARDS STATUS ***</p>
                  <p className="text-[11px]">
                    Stamps Awarded Today: <strong>+{printedReceipt.loyaltyResult?.stampsAwarded} {printedReceipt.loyaltyResult?.hasStreakBonus ? '(Streak ⚡ Boost!)' : ''}</strong>
                  </p>
                  <p className="text-[11px]">
                    Total Stamps: <strong>{printedReceipt.loyaltyResult?.customer?.stamps} / {totalStamps} Stamps</strong>
                  </p>
                  <p className="text-[10px] text-neutral-600">
                    Target Reward: <strong>{assignedGift.title}</strong>
                  </p>
                  {printedReceipt.loyaltyResult?.isRewardUnlocked && (
                    <p className="font-black text-xs text-neutral-900 bg-neutral-200 py-0.5 rounded">
                      🎉 REWARD UNLOCKED &amp; READY TO CLAIM!
                    </p>
                  )}
                </div>

                {/* Footer Greetings */}
                <div className="text-center space-y-0.5 text-[10px] text-neutral-500 pt-1">
                  <p>Thank you for visiting {printedReceipt.cafeName}!</p>
                  <p>Scan your phone pass to view streaks &amp; rewards.</p>
                  <p className="text-[9px] font-mono pt-1 text-neutral-400">*** End of Receipt ***</p>
                </div>

              </div>

              {/* Modal Actions */}
              <div className="grid grid-cols-2 gap-2 pt-2">
                <button
                  type="button"
                  onClick={handleNativePrint}
                  className="btn-dripp-primary py-3 text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer shadow-lg"
                >
                  <Printer className="w-4 h-4" />
                  <span>Print Receipt Now</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPrintedReceipt(null)}
                  className="py-3 px-4 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-bold transition cursor-pointer"
                >
                  Done &amp; New Bill
                </button>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
