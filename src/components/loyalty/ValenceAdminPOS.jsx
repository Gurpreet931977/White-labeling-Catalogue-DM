import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  Plus,
  Minus,
  Trash2,
  Receipt,
  Printer,
  X,
  Flame,
  CheckCircle2,
  ShieldCheck,
  Check
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
  const [thermalReceipt, setThermalReceipt] = useState(null);

  const activeCust = selectedCustomer || customers[0];
  const hasStreakBonus = (activeCust?.streakDays || 0) >= 5;

  const filteredItems = UNIVERSAL_CATALOG.filter((item) => {
    const matchesCat = selectedCategory === 'All' || item.category === selectedCategory;
    const matchesSearch =
      !searchQuery ||
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.sku.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const rawSubtotal = cart.reduce((sum, i) => sum + i.price * i.qty, 0);
  const taxableAmount = rawSubtotal;
  const cgst = Math.round((taxableAmount * 0.025) * 100) / 100;
  const sgst = Math.round((taxableAmount * 0.025) * 100) / 100;
  const totalAmount = Math.round(taxableAmount + cgst + sgst);
  const cashChange = Math.max(0, (Number(cashTendered) || 0) - totalAmount);

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

  const handleRemoveItem = (itemId) => {
    sounds.playClick();
    setCart((prev) => prev.filter((i) => i.id !== itemId));
  };

  const handleSettleBill = () => {
    if (cart.length === 0 || !activeCust) return;

    sounds.playOrderPlaced();
    const itemsSummary = cart.map((i) => `${i.qty}x ${i.name}`).join(', ');

    const result = processBillingTransaction({
      customerId: activeCust.id,
      phone: activeCust.phone,
      billAmount: totalAmount,
      billItems: itemsSummary
    });

    if (result) {
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
    <div className="space-y-6">
      
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 pb-1">
        <div>
          <span className="text-xs font-mono font-bold tracking-widest text-[#7A1F1F] uppercase">
            TERMINAL REGISTER • 5% GST DOCKET
          </span>
          <h3 className="font-groovy font-black text-3xl sm:text-4xl text-[#7A1F1F] tracking-wide mt-0.5 leading-none">
            Billing &amp; Receipt Settlement
          </h3>
        </div>

        {/* Member Selector Bar */}
        <div className="flex items-center gap-3">
          <span className="text-xs font-mono text-[#7A1F1F] font-bold hidden sm:inline">Target Pass:</span>
          <select
            value={activeCust?.id}
            onChange={(e) => {
              sounds.playClick();
              const found = customers.find((c) => c.id === e.target.value);
              if (found && onSelectCustomer) onSelectCustomer(found);
            }}
            className="px-4 py-2 rounded-xl bg-[#FAF6EA] border-2 border-[#7A1F1F] text-xs font-mono font-bold text-[#7A1F1F] focus:outline-none cursor-pointer shadow-[3px_3px_0px_#7A1F1F]"
          >
            {customers.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name} ({c.phone}) • {c.stamps}/6 stamps
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* 2-COLUMN REGISTER WORKSPACE */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* LEFT COLUMN (7 Cols): CATALOG SELECTOR */}
        <div className="lg:col-span-7 space-y-4">
          
          <div className="p-5 rounded-3xl bg-[#FAF6EA] border-3 border-[#7A1F1F] shadow-[6px_6px_0px_#7A1F1F] space-y-3">
            <div className="relative">
              <Search className="w-4 h-4 text-[#7A1F1F] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search catalog by product name or SKU..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#F2ECD8] border-2 border-[#7A1F1F] text-xs font-mono text-[#7A1F1F] placeholder-[#7A1F1F]/60 focus:outline-none focus:bg-white"
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
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-groovy uppercase tracking-wider whitespace-nowrap cursor-pointer transition-colors ${
                    selectedCategory === cat
                      ? 'bg-[#7A1F1F] text-[#F2ECD8] font-bold shadow-sm'
                      : 'bg-[#F2ECD8] text-[#7A1F1F] hover:bg-white border border-[#7A1F1F]'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Product Items Grid (Warm Cream Cards with Solid Oxblood Borders) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 p-1 pb-2">
            {filteredItems.map((item) => (
              <motion.div
                key={item.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleAddItem(item)}
                className="p-4 rounded-2xl bg-[#FAF6EA] border-2 border-[#7A1F1F] shadow-[4px_4px_0px_#7A1F1F] hover:bg-white flex flex-col justify-between space-y-3 cursor-pointer group transition-all"
              >
                <div>
                  <div className="flex items-center justify-between text-[10px] font-mono font-bold text-[#7A1F1F]/80">
                    <span>{item.sku}</span>
                    <span className="text-[#7A1F1F] uppercase">{item.category}</span>
                  </div>
                  <h4 className="font-groovy font-black text-lg text-[#7A1F1F] mt-1 leading-tight">
                    {item.name}
                  </h4>
                </div>

                <div className="flex items-center justify-between pt-2 border-t-2 border-dashed border-[#7A1F1F]/20">
                  <span className="font-groovy font-black text-xl text-[#7A1F1F]">
                    ₹{item.price}
                  </span>
                  <button
                    type="button"
                    className="p-1.5 rounded-lg bg-[#7A1F1F] text-[#F2ECD8] group-hover:bg-[#5C1414] transition-colors"
                  >
                    <Plus className="w-4 h-4 stroke-[3]" />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>

        </div>

        {/* RIGHT COLUMN (5 Cols): ORDER DOCKET & SETTLEMENT */}
        <div className="lg:col-span-5 space-y-4">
          
          <div className="rounded-3xl bg-[#7A1F1F] text-[#F2ECD8] border-3 border-[#5C1414] p-6 shadow-[8px_8px_0px_#470D0D] space-y-5 flex flex-col justify-between">
            
            {/* Top Docket Header */}
            <div>
              <div className="flex items-center justify-between pb-3 border-b-2 border-[#5C1414]">
                <div className="flex items-center gap-2">
                  <Receipt className="w-5 h-5 text-[#E5A93C]" />
                  <h4 className="font-groovy font-black text-xl text-[#F2ECD8] uppercase tracking-wide">
                    Current Docket
                  </h4>
                </div>
                <span className="text-xs font-mono font-bold text-[#E5A93C]">
                  {cart.reduce((sum, i) => sum + i.qty, 0)} items
                </span>
              </div>

              {/* Active Customer Sync Callout */}
              <div className="mt-3 p-3.5 rounded-2xl bg-[#5C1414] border border-[#470D0D] space-y-1">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-[#F2ECD8]/80 font-bold">MEMBER:</span>
                  <span className="font-groovy font-bold text-sm text-[#F2ECD8]">{activeCust?.name}</span>
                </div>
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-[#F2ECD8]/80 font-bold">CURRENT STAMPS:</span>
                  <span className="text-[#E5A93C] font-groovy font-bold text-sm">{activeCust?.stamps || 0} / 6</span>
                </div>

                {hasStreakBonus ? (
                  <div className="pt-1 text-[11px] font-mono text-[#E5A93C] font-bold flex items-center gap-1">
                    <Flame className="w-3.5 h-3.5 fill-[#E5A93C]" />
                    <span>5-Day Streak Active: +2 STAMPS WILL BE CREDITED!</span>
                  </div>
                ) : (
                  <div className="pt-1 text-[11px] font-mono text-[#F2ECD8]/90 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-[#E5A93C]" />
                    <span>+1 Stamp will be automatically credited on settlement</span>
                  </div>
                )}
              </div>
            </div>

            {/* Cart Line Items */}
            <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
              {cart.length === 0 ? (
                <div className="text-center py-8 text-xs font-mono text-[#F2ECD8]/70">
                  Docket is empty. Select products from catalog.
                </div>
              ) : (
                cart.map((item) => (
                  <div
                    key={item.id}
                    className="p-2.5 rounded-xl bg-[#5C1414] border border-[#470D0D] flex items-center justify-between gap-3 text-xs font-mono"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="font-bold text-[#F2ECD8] truncate">{item.name}</p>
                      <span className="text-[11px] text-[#F2ECD8]/80">
                        ₹{item.price} each
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => handleUpdateQty(item.id, -1)}
                        className="w-6 h-6 rounded-lg bg-[#7A1F1F] text-[#F2ECD8] hover:bg-[#470D0D] flex items-center justify-center cursor-pointer font-bold"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="font-groovy text-sm text-[#E5A93C] w-5 text-center">
                        {item.qty}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleUpdateQty(item.id, 1)}
                        className="w-6 h-6 rounded-lg bg-[#7A1F1F] text-[#F2ECD8] hover:bg-[#470D0D] flex items-center justify-center cursor-pointer font-bold"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>

                    <div className="font-groovy text-sm text-[#F2ECD8] w-14 text-right">
                      ₹{item.price * item.qty}
                    </div>

                    <button
                      type="button"
                      onClick={() => handleRemoveItem(item.id)}
                      className="text-[#F2ECD8]/60 hover:text-white cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))
              )}
            </div>

            {/* Calculations & GST */}
            <div className="space-y-1.5 pt-2 border-t-2 border-[#5C1414] text-xs font-mono text-[#F2ECD8]/90">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span>₹{taxableAmount}</span>
              </div>
              <div className="flex justify-between text-[11px]">
                <span>CGST (2.5%):</span>
                <span>₹{cgst}</span>
              </div>
              <div className="flex justify-between text-[11px]">
                <span>SGST (2.5%):</span>
                <span>₹{sgst}</span>
              </div>
              <div className="flex justify-between text-lg font-groovy text-[#E5A93C] pt-2 border-t border-[#5C1414]">
                <span>TOTAL DUE:</span>
                <span>₹{totalAmount}</span>
              </div>
            </div>

            {/* Tender Mode */}
            <div className="space-y-2">
              <span className="text-[10px] font-mono uppercase text-[#F2ECD8]/80 block font-bold">
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
                    className={`py-2 rounded-xl text-xs font-groovy font-black cursor-pointer transition-colors uppercase ${
                      tenderMethod === method
                        ? 'bg-[#E5A93C] text-[#7A1F1F]'
                        : 'bg-[#5C1414] text-[#F2ECD8] hover:bg-[#470D0D]'
                    }`}
                  >
                    {method}
                  </button>
                ))}
              </div>

              {tenderMethod === 'Cash' && (
                <div className="p-3 rounded-xl bg-[#5C1414] border border-[#470D0D] flex items-center justify-between text-xs font-mono mt-2">
                  <div className="flex items-center gap-2">
                    <span className="text-[#F2ECD8]/80">Tendered: ₹</span>
                    <input
                      type="number"
                      value={cashTendered}
                      onChange={(e) => setCashTendered(e.target.value)}
                      className="w-20 bg-transparent text-[#E5A93C] font-bold focus:outline-none border-b border-[#E5A93C]"
                    />
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-[#F2ECD8]/80 block">Change:</span>
                    <span className="text-sm font-groovy text-[#E5A93C]">₹{cashChange}</span>
                  </div>
                </div>
              )}
            </div>

            {/* Settle Action */}
            <button
              type="button"
              disabled={cart.length === 0}
              onClick={handleSettleBill}
              className={`w-full py-4 rounded-2xl font-groovy font-black text-sm tracking-wider uppercase flex items-center justify-center gap-2 shadow-[4px_4px_0px_#470D0D] transition-all cursor-pointer ${
                cart.length > 0
                  ? 'bg-[#E5A93C] hover:bg-[#C98D25] text-[#7A1F1F]'
                  : 'bg-[#5C1414] text-[#F2ECD8]/50 cursor-not-allowed'
              }`}
            >
              <Printer className="w-4 h-4 stroke-[2.5]" />
              <span>Settle Bill &amp; Print Receipt</span>
            </button>

          </div>

        </div>

      </div>

      {/* 80MM THERMAL RECEIPT MODAL */}
      <AnimatePresence>
        {thermalReceipt && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative w-full max-w-sm rounded-3xl bg-[#FAF6EA] text-[#7A1F1F] shadow-[12px_12px_0px_#7A1F1F] p-6 sm:p-7 space-y-4 overflow-hidden font-mono border-3 border-[#7A1F1F]"
            >
              <button
                type="button"
                onClick={() => setThermalReceipt(null)}
                className="absolute top-4 right-4 w-8 h-8 rounded-full bg-[#7A1F1F] text-[#F2ECD8] flex items-center justify-center hover:bg-[#5C1414] cursor-pointer"
              >
                <X className="w-4 h-4 stroke-[3]" />
              </button>

              <div className="text-center space-y-1 pb-3 border-b-2 border-dashed border-[#7A1F1F]">
                <h4 className="font-groovy font-black text-2xl tracking-wide">VALENCE STORE</h4>
                <p className="text-[10px] font-bold uppercase tracking-wider">TAX INVOICE / CASH RECEIPT</p>
                <p className="text-[9px] text-[#7A1F1F]/70">GSTIN: 07AAAAA0000A1Z5</p>
              </div>

              <div className="text-xs space-y-1 py-1 text-[#7A1F1F]">
                <div className="flex justify-between">
                  <span>INVOICE NO:</span>
                  <span className="font-bold">{thermalReceipt.billId}</span>
                </div>
                <div className="flex justify-between">
                  <span>DATE / TIME:</span>
                  <span>{thermalReceipt.date} {thermalReceipt.time}</span>
                </div>
                <div className="flex justify-between">
                  <span>MEMBER:</span>
                  <span className="font-bold">{thermalReceipt.customerName}</span>
                </div>
              </div>

              <div className="py-2 border-y-2 border-dashed border-[#7A1F1F] space-y-1.5 text-xs">
                <div className="flex justify-between font-bold">
                  <span>ITEM</span>
                  <span>QTY</span>
                  <span>AMT</span>
                </div>
                {thermalReceipt.items.map((item) => (
                  <div key={item.id} className="flex justify-between">
                    <span className="truncate max-w-[150px]">{item.name}</span>
                    <span>{item.qty}</span>
                    <span>₹{item.price * item.qty}</span>
                  </div>
                ))}
              </div>

              <div className="space-y-1 text-xs text-[#7A1F1F]/80">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span>₹{thermalReceipt.subtotal}</span>
                </div>
                <div className="flex justify-between text-[11px]">
                  <span>CGST (2.5%):</span>
                  <span>₹{thermalReceipt.cgst}</span>
                </div>
                <div className="flex justify-between text-[11px]">
                  <span>SGST (2.5%):</span>
                  <span>₹{thermalReceipt.sgst}</span>
                </div>
                <div className="flex justify-between font-bold text-sm text-[#7A1F1F] pt-1.5 border-t border-[#7A1F1F]/30">
                  <span>TOTAL:</span>
                  <span>₹{thermalReceipt.total}</span>
                </div>
              </div>

              {/* Stamp Sync confirmation */}
              <div className="p-3 bg-[#E5A93C] rounded-xl border-2 border-[#7A1F1F] text-center space-y-0.5 text-[#7A1F1F]">
                <span className="text-[10px] font-groovy font-black uppercase tracking-wider block">
                  PASS STAMP SYNCHRONIZED
                </span>
                <span className="text-xs font-bold">
                  +{thermalReceipt.stampsAwarded} Stamp Awarded ({thermalReceipt.newStampTotal}/6 Total)
                </span>
                {thermalReceipt.hasStreakBonus && (
                  <span className="text-[9px] font-bold block">
                    (5-Day Active Streak Multiplier Applied)
                  </span>
                )}
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    sounds.playClick();
                    window.print();
                  }}
                  className="flex-1 py-2.5 rounded-xl bg-[#7A1F1F] hover:bg-[#5C1414] text-[#F2ECD8] text-xs font-groovy font-bold flex items-center justify-center gap-1.5 cursor-pointer uppercase shadow-[3px_3px_0px_#470D0D]"
                >
                  <Printer className="w-4 h-4" />
                  <span>Print Receipt</span>
                </button>
                <button
                  type="button"
                  onClick={() => setThermalReceipt(null)}
                  className="px-4 py-2.5 rounded-xl bg-[#F2ECD8] hover:bg-[#E2D8BE] text-[#7A1F1F] border-2 border-[#7A1F1F] text-xs font-groovy font-bold cursor-pointer uppercase"
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
