import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  Plus,
  Minus,
  Trash2,
  Receipt,
  User,
  CheckCircle2,
  Printer,
  X,
  CreditCard,
  QrCode,
  Flame,
  ArrowRight,
  ShieldCheck,
  Percent,
  Check,
  Banknote
} from 'lucide-react';
import { sounds } from '../../utils/audio';
import { processBillingTransaction } from '../../utils/loyaltyStorage';

// Universal Product Catalog (Universal Lifestyle & Retail Items)
const UNIVERSAL_CATALOG = [
  { id: 'item-1', name: 'Signature Series Item', category: 'Signature Series', price: 240, sku: 'VAL-SIG-01' },
  { id: 'item-2', name: 'Reserve Premium Pack', category: 'Reserve Editions', price: 380, sku: 'VAL-RES-02' },
  { id: 'item-3', name: 'Deluxe Edition Box', category: 'Bundles', price: 650, sku: 'VAL-DLX-03' },
  { id: 'item-4', name: 'Essential Unit', category: 'Lifestyle Goods', price: 180, sku: 'VAL-ESS-04' },
  { id: 'item-5', name: 'Limited Collector Item', category: 'Reserve Editions', price: 890, sku: 'VAL-COL-05' },
  { id: 'item-6', name: 'Member Access Pass Item', category: 'Signature Series', price: 450, sku: 'VAL-ACC-06' },
  { id: 'item-7', name: 'Artisan Selection Unit', category: 'Lifestyle Goods', price: 320, sku: 'VAL-ART-07' },
  { id: 'item-8', name: 'Standard Edition Pack', category: 'Signature Series', price: 210, sku: 'VAL-STD-08' }
];

const CATEGORIES = ['All', 'Signature Series', 'Reserve Editions', 'Lifestyle Goods', 'Bundles'];

export function ValenceAdminPOS({ customers = [], selectedCustomer, onSelectCustomer, onTransactionComplete }) {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [cart, setCart] = useState([
    { id: 'item-1', name: 'Signature Series Item', price: 240, qty: 1 },
    { id: 'item-2', name: 'Reserve Premium Pack', price: 380, qty: 1 }
  ]);
  const [tenderMethod, setTenderMethod] = useState('UPI');
  const [cashTendered, setCashTendered] = useState('1000');
  const [discountPercent, setDiscountPercent] = useState(0);

  // Printed Receipt Modal State
  const [thermalReceipt, setThermalReceipt] = useState(null);

  // Customer Target
  const activeCust = selectedCustomer || customers[0];
  const hasStreakBonus = (activeCust?.streakDays || 0) >= 5;

  // Filter Catalog
  const filteredItems = UNIVERSAL_CATALOG.filter((item) => {
    const matchesCat = selectedCategory === 'All' || item.category === selectedCategory;
    const matchesSearch = !searchQuery || item.name.toLowerCase().includes(searchQuery.toLowerCase()) || item.sku.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  // Cart Calculations
  const rawSubtotal = cart.reduce((sum, i) => sum + i.price * i.qty, 0);
  const discountAmount = Math.round((rawSubtotal * (discountPercent / 100)) * 100) / 100;
  const taxableAmount = Math.max(0, rawSubtotal - discountAmount);
  
  // 5% GST computation (2.5% CGST + 2.5% SGST)
  const cgst = Math.round((taxableAmount * 0.025) * 100) / 100;
  const sgst = Math.round((taxableAmount * 0.025) * 100) / 100;
  const totalAmount = Math.round(taxableAmount + cgst + sgst);
  const cashChange = Math.max(0, (Number(cashTendered) || 0) - totalAmount);

  // Add Item to Docket
  const handleAddItem = (item) => {
    sounds.playAddToCart();
    setCart((prev) => {
      const existing = prev.find((i) => i.id === item.id);
      if (existing) {
        return prev.map((i) => (i.id === item.id ? { ...i, qty: i.qty + 1 } : i));
      }
      return [...prev, { id: item.id, name: item.name, price: item.price, qty: 1 }];
    });
  };

  // Adjust Qty
  const handleUpdateQty = (itemId, delta) => {
    sounds.playClick();
    setCart((prev) =>
      prev
        .map((i) => {
          if (i.id === itemId) {
            const newQty = i.qty + delta;
            return newQty > 0 ? { ...i, qty: newQty } : null;
          }
          return i;
        })
        .filter(Boolean)
    );
  };

  // Remove Item
  const handleRemoveItem = (itemId) => {
    sounds.playClick();
    setCart((prev) => prev.filter((i) => i.id !== itemId));
  };

  // Settle Bill & Markup Stamps Automatically
  const handleSettleBill = () => {
    if (cart.length === 0) return;
    if (!activeCust) return;

    sounds.playOrderPlaced();

    const itemsSummary = cart.map((i) => `${i.qty}x ${i.name}`).join(', ');

    const result = processBillingTransaction({
      customerId: activeCust.id,
      phone: activeCust.phone,
      billAmount: totalAmount,
      billItems: itemsSummary
    });

    if (result) {
      // Build thermal receipt data
      const receiptData = {
        billId: result.billRecord.id,
        date: result.billRecord.date,
        time: result.billRecord.time,
        customerName: activeCust.name,
        customerPhone: activeCust.phone,
        items: [...cart],
        subtotal: taxableAmount,
        cgst,
        sgst,
        total: totalAmount,
        tenderMethod,
        cashTendered: tenderMethod === 'Cash' ? Number(cashTendered) : totalAmount,
        change: tenderMethod === 'Cash' ? cashChange : 0,
        stampsAwarded: result.stampsAwarded,
        hasStreakBonus: result.hasStreakBonus,
        newStampTotal: result.customer.stamps,
        isRewardUnlocked: result.isRewardUnlocked
      };

      setThermalReceipt(receiptData);
      setCart([]);

      if (onTransactionComplete) {
        onTransactionComplete(result);
      }
    }
  };

  return (
    <div className="space-y-8">
      
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-1">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono tracking-widest text-[#FF4800] uppercase font-bold">
              TERMINAL POS
            </span>
            <span className="px-2.5 py-0.5 rounded-full bg-[#EAE0CE] text-[#6E5D4F] border border-[#DDD0BC] font-mono text-[9px] font-bold">
              AUTO-STAMP ENGINE
            </span>
          </div>
          <h3 className="font-clash font-bold text-2xl sm:text-3xl text-[#1C120C] mt-1">
            Billing &amp; Receipt Settlement
          </h3>
        </div>

        {/* Member Selector Bar */}
        <div className="flex items-center gap-3">
          <span className="text-xs font-mono text-[#76675B] hidden sm:inline font-bold">Target Customer:</span>
          <select
            value={activeCust?.id}
            onChange={(e) => {
              sounds.playClick();
              const found = customers.find((c) => c.id === e.target.value);
              if (found && onSelectCustomer) onSelectCustomer(found);
            }}
            className="px-4 py-2.5 rounded-2xl bg-white border border-[#E2D6C3] text-xs font-mono font-bold text-[#1C120C] focus:outline-none focus:border-[#FF4800] cursor-pointer shadow-xs"
          >
            {customers.map((c) => (
              <option key={c.id} value={c.id} className="bg-[#F7F2E7]">
                {c.name} ({c.phone}) • {c.stamps}/6 stamps
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* 2-COLUMN REGISTER WORKSPACE */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* LEFT COLUMN (7 Cols): CATALOG SELECTOR */}
        <div className="lg:col-span-7 space-y-5">
          
          {/* Category Tabs & Search */}
          <div className="p-5 rounded-3xl bg-white border border-[#E2D6C3] shadow-md space-y-3.5">
            <div className="relative">
              <Search className="w-4 h-4 text-[#8C7D70] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search catalog by product name or SKU..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#F8F4EC] border border-[#E2D6C3] text-xs text-[#1C120C] placeholder-[#A19183] focus:outline-none focus:border-[#FF4800]"
              />
            </div>

            <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => {
                    sounds.playClick();
                    setSelectedCategory(cat);
                  }}
                  className={`px-4 py-2 rounded-xl text-xs font-mono whitespace-nowrap cursor-pointer transition-colors ${
                    selectedCategory === cat
                      ? 'bg-[#1C120C] text-white font-bold'
                      : 'bg-[#F8F4EC] text-[#6E5D4F] hover:text-[#1C120C] border border-[#E2D6C3]'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Product Items Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-[560px] overflow-y-auto pr-1">
            {filteredItems.map((item) => (
              <motion.div
                key={item.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleAddItem(item)}
                className="p-5 rounded-3xl bg-white border border-[#E2D6C3] hover:border-[#FF4800] shadow-sm flex flex-col justify-between space-y-3 cursor-pointer group transition-all"
              >
                <div>
                  <div className="flex items-center justify-between text-[10px] font-mono text-[#8C7D70]">
                    <span>{item.sku}</span>
                    <span className="text-[#FF4800] font-bold">{item.category}</span>
                  </div>
                  <h4 className="font-clash font-bold text-lg text-[#1C120C] mt-1 group-hover:text-[#FF4800] transition-colors">
                    {item.name}
                  </h4>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-[#EAE0CE]">
                  <span className="font-mono font-bold text-lg text-[#1C120C]">
                    ₹{item.price}
                  </span>
                  <button
                    type="button"
                    className="p-2 rounded-xl bg-[#F8F4EC] group-hover:bg-[#FF4800] group-hover:text-white text-[#1C120C] transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>

        </div>

        {/* RIGHT COLUMN (5 Cols): ORDER DOCKET & SETTLEMENT */}
        <div className="lg:col-span-5 space-y-5">
          
          <div className="rounded-3xl bg-white border border-[#E2D6C3] p-6 sm:p-7 shadow-md space-y-5 flex flex-col justify-between">
            
            {/* Top Docket Header */}
            <div>
              <div className="flex items-center justify-between pb-3.5 border-b border-[#E2D6C3]">
                <div className="flex items-center gap-2">
                  <Receipt className="w-5 h-5 text-[#FF4800]" />
                  <h4 className="font-clash font-bold text-lg text-[#1C120C]">
                    Current Docket
                  </h4>
                </div>
                <span className="text-xs font-mono text-[#76675B] font-bold">
                  {cart.reduce((sum, i) => sum + i.qty, 0)} items
                </span>
              </div>

              {/* Active Customer Sync Callout */}
              <div className="mt-4 p-4 rounded-2xl bg-[#F8F4EC] border border-[#E2D6C3] space-y-1.5">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-[#76675B] font-bold">TARGET PASS:</span>
                  <span className="font-bold text-[#1C120C]">{activeCust?.name}</span>
                </div>
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-[#76675B]">CURRENT STAMPS:</span>
                  <span className="text-[#FF4800] font-bold">{activeCust?.stamps || 0} / 6</span>
                </div>

                {hasStreakBonus ? (
                  <div className="pt-1.5 text-[10px] font-mono text-[#FF4800] font-black flex items-center gap-1">
                    <Flame className="w-3.5 h-3.5 fill-[#FF4800]" />
                    <span>5-Day Streak Active: +2 STAMPS WILL BE CREDITED!</span>
                  </div>
                ) : (
                  <div className="pt-1.5 text-[10px] font-mono text-[#047857] font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>+1 Stamp will be automatically credited on settlement</span>
                  </div>
                )}
              </div>
            </div>

            {/* Cart Line Items */}
            <div className="space-y-2.5 max-h-56 overflow-y-auto pr-1">
              {cart.length === 0 ? (
                <div className="text-center py-8 text-xs font-mono text-[#A19183]">
                  Docket is empty. Select products from catalog.
                </div>
              ) : (
                cart.map((item) => (
                  <div
                    key={item.id}
                    className="p-3 rounded-2xl bg-[#F8F4EC] border border-[#E2D6C3] flex items-center justify-between gap-3 text-xs"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="font-bold text-[#1C120C] truncate">{item.name}</p>
                      <span className="font-mono text-[11px] text-[#76675B]">
                        ₹{item.price} each
                      </span>
                    </div>

                    {/* Qty Controls */}
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => handleUpdateQty(item.id, -1)}
                        className="w-6 h-6 rounded-lg bg-white border border-[#E2D6C3] text-[#76675B] hover:text-[#1C120C] flex items-center justify-center cursor-pointer"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="font-mono font-bold text-xs text-[#1C120C] w-5 text-center">
                        {item.qty}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleUpdateQty(item.id, 1)}
                        className="w-6 h-6 rounded-lg bg-white border border-[#E2D6C3] text-[#76675B] hover:text-[#1C120C] flex items-center justify-center cursor-pointer"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>

                    <div className="font-mono font-bold text-xs text-[#1C120C] w-14 text-right">
                      ₹{item.price * item.qty}
                    </div>

                    <button
                      type="button"
                      onClick={() => handleRemoveItem(item.id)}
                      className="text-[#A19183] hover:text-[#EF4444] cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))
              )}
            </div>

            {/* Calculations & GST Breakup */}
            <div className="space-y-2 pt-2 border-t border-[#E2D6C3] text-xs font-mono text-[#76675B]">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span className="text-[#1C120C] font-bold">₹{taxableAmount}</span>
              </div>
              <div className="flex justify-between text-[11px]">
                <span>CGST (2.5%):</span>
                <span>₹{cgst}</span>
              </div>
              <div className="flex justify-between text-[11px]">
                <span>SGST (2.5%):</span>
                <span>₹{sgst}</span>
              </div>
              <div className="flex justify-between text-base font-bold text-[#1C120C] pt-2 border-t border-[#E2D6C3]">
                <span>TOTAL DUE:</span>
                <span className="text-[#FF4800] text-xl">₹{totalAmount}</span>
              </div>
            </div>

            {/* Tender Mode */}
            <div className="space-y-2">
              <span className="text-[10px] font-mono uppercase text-[#76675B] block font-bold">
                Payment Tender
              </span>
              <div className="grid grid-cols-3 gap-2">
                {['UPI', 'Cash', 'Card'].map((method) => (
                  <button
                    key={method}
                    type="button"
                    onClick={() => {
                      sounds.playClick();
                      setTenderMethod(method);
                    }}
                    className={`py-2.5 rounded-xl text-xs font-mono font-bold cursor-pointer transition-colors ${
                      tenderMethod === method
                        ? 'bg-[#1C120C] text-white'
                        : 'bg-[#F8F4EC] text-[#6E5D4F] hover:text-[#1C120C] border border-[#E2D6C3]'
                    }`}
                  >
                    {method}
                  </button>
                ))}
              </div>

              {tenderMethod === 'Cash' && (
                <div className="p-3.5 rounded-2xl bg-[#F8F4EC] border border-[#E2D6C3] flex items-center justify-between text-xs font-mono mt-2">
                  <div className="flex items-center gap-2">
                    <span className="text-[#76675B]">Tendered: ₹</span>
                    <input
                      type="number"
                      value={cashTendered}
                      onChange={(e) => setCashTendered(e.target.value)}
                      className="w-20 bg-transparent text-[#1C120C] font-bold focus:outline-none border-b border-[#FF4800]"
                    />
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-[#76675B] block">Change:</span>
                    <span className="text-sm font-bold text-[#047857]">₹{cashChange}</span>
                  </div>
                </div>
              )}
            </div>

            {/* Settle Action (POPPY HERO BUTTON) */}
            <button
              type="button"
              disabled={cart.length === 0}
              onClick={handleSettleBill}
              className={`w-full py-4 rounded-2xl font-sans font-bold text-xs tracking-wider uppercase flex items-center justify-center gap-2 shadow-lg transition-all cursor-pointer ${
                cart.length > 0
                  ? 'bg-[#FF4800] hover:bg-[#E03F00] text-white shadow-[#FF4800]/30'
                  : 'bg-[#EAE0CE] text-[#A19183] cursor-not-allowed'
              }`}
            >
              <Printer className="w-4 h-4" />
              <span>Settle Bill &amp; Print Thermal Receipt</span>
            </button>

          </div>

        </div>

      </div>

      {/* 80MM THERMAL RECEIPT MODAL */}
      <AnimatePresence>
        {thermalReceipt && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1C120C]/80 backdrop-blur-md">
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative w-full max-w-sm rounded-3xl bg-white text-[#1C120C] shadow-2xl p-6 sm:p-7 space-y-4 overflow-hidden font-mono border border-[#E2D6C3]"
            >
              <button
                type="button"
                onClick={() => setThermalReceipt(null)}
                className="absolute top-4 right-4 w-7 h-7 rounded-full bg-[#F7F2E7] flex items-center justify-center text-[#76675B] hover:text-[#1C120C] cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>

              {/* Receipt Header */}
              <div className="text-center space-y-1 pb-3 border-b-2 border-dashed border-[#DDD1BE]">
                <h4 className="font-black text-xl tracking-wider">VALENCE STORE</h4>
                <p className="text-[10px] text-[#76675B]">DIGITAL MEMBERSHIP PLATFORM</p>
                <p className="text-[9px] text-[#A19183]">GSTIN: 07AAAAA0000A1Z5</p>
              </div>

              {/* Meta */}
              <div className="text-xs space-y-1 py-1 text-[#6E5D4F]">
                <div className="flex justify-between">
                  <span>INVOICE NO:</span>
                  <span className="font-bold text-[#1C120C]">{thermalReceipt.billId}</span>
                </div>
                <div className="flex justify-between">
                  <span>DATE / TIME:</span>
                  <span>{thermalReceipt.date} {thermalReceipt.time}</span>
                </div>
                <div className="flex justify-between">
                  <span>MEMBER:</span>
                  <span className="font-bold text-[#1C120C]">{thermalReceipt.customerName}</span>
                </div>
              </div>

              {/* Items */}
              <div className="py-2 border-y-2 border-dashed border-[#DDD1BE] space-y-1.5 text-xs">
                <div className="flex justify-between font-bold text-[#1C120C] pb-1">
                  <span>ITEM</span>
                  <span>QTY</span>
                  <span>AMT</span>
                </div>
                {thermalReceipt.items.map((item) => (
                  <div key={item.id} className="flex justify-between text-[#6E5D4F]">
                    <span className="truncate max-w-[150px]">{item.name}</span>
                    <span>{item.qty}</span>
                    <span>₹{item.price * item.qty}</span>
                  </div>
                ))}
              </div>

              {/* Totals */}
              <div className="space-y-1 text-xs text-[#6E5D4F]">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span>₹{thermalReceipt.subtotal}</span>
                </div>
                <div className="flex justify-between text-[11px] text-[#8C7D70]">
                  <span>CGST (2.5%):</span>
                  <span>₹{thermalReceipt.cgst}</span>
                </div>
                <div className="flex justify-between text-[11px] text-[#8C7D70]">
                  <span>SGST (2.5%):</span>
                  <span>₹{thermalReceipt.sgst}</span>
                </div>
                <div className="flex justify-between font-bold text-sm text-[#1C120C] pt-2 border-t border-[#EAE0CE]">
                  <span>TOTAL:</span>
                  <span className="text-[#FF4800]">₹{thermalReceipt.total}</span>
                </div>
                <div className="flex justify-between text-[11px] text-[#8C7D70] pt-1">
                  <span>Tender ({thermalReceipt.tenderMethod}):</span>
                  <span>₹{thermalReceipt.cashTendered}</span>
                </div>
                {thermalReceipt.tenderMethod === 'Cash' && (
                  <div className="flex justify-between text-[11px] font-bold text-[#1C120C]">
                    <span>Change:</span>
                    <span>₹{thermalReceipt.change}</span>
                  </div>
                )}
              </div>

              {/* Stamp sync confirmation badge */}
              <div className="p-3.5 bg-[#FFF5F0] rounded-xl border border-[#FF4800]/30 text-center space-y-0.5">
                <span className="text-[10px] text-[#FF4800] font-bold uppercase tracking-wider block">
                  PASS STAMP SYNCHRONIZED
                </span>
                <span className="text-xs font-bold text-[#1C120C]">
                  +{thermalReceipt.stampsAwarded} Stamp Awarded ({thermalReceipt.newStampTotal}/6 Total)
                </span>
                {thermalReceipt.hasStreakBonus && (
                  <span className="text-[9px] text-[#FF4800] font-bold block">
                    (5-Day Active Streak Multiplier Applied)
                  </span>
                )}
              </div>

              {/* Actions */}
              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    sounds.playClick();
                    window.print();
                  }}
                  className="flex-1 py-2.5 rounded-xl bg-[#1C120C] hover:bg-black text-white text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print Receipt</span>
                </button>
                <button
                  type="button"
                  onClick={() => setThermalReceipt(null)}
                  className="px-4 py-2.5 rounded-xl bg-[#F7F2E7] hover:bg-[#EAE0CE] text-[#1C120C] text-xs font-bold cursor-pointer"
                >
                  Done
                </button>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
