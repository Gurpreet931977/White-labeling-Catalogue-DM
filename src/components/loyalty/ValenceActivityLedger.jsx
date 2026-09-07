import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Receipt,
  Search,
  Printer,
  X,
  Flame,
  CheckCircle2,
  ArrowRight
} from 'lucide-react';
import { sounds } from '../../utils/audio';

export function ValenceActivityLedger({ customer }) {
  const [selectedReceipt, setSelectedReceipt] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  const history = customer?.billingHistory || [];

  const filteredHistory = history.filter((item) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      item.id?.toLowerCase().includes(q) ||
      item.items?.toLowerCase().includes(q) ||
      item.date?.includes(q)
    );
  });

  const handleOpenReceipt = (record) => {
    sounds.playClick();
    setSelectedReceipt(record);
  };

  const handlePrint = () => {
    sounds.playClick();
    window.print();
  };

  const calculateTaxes = (amount = 350) => {
    const subtotal = Math.round((amount / 1.05) * 100) / 100;
    const totalTax = Math.round((amount - subtotal) * 100) / 100;
    const cgst = Math.round((totalTax / 2) * 100) / 100;
    const sgst = Math.round((totalTax / 2) * 100) / 100;
    return { subtotal, cgst, sgst, total: amount };
  };

  return (
    <section className="relative space-y-6 pt-4">
      
      {/* SECTION HEADER */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b-3 border-[#1F1614] pb-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded bg-[#1F1614] text-[#E5A93C] font-mono text-[9px] font-black uppercase tracking-widest">
              SECTION 04 // LEDGER
            </span>
            <span className="font-mono text-xs font-bold text-[#7A1F1F]/70 uppercase tracking-wider">
              SETTLED RECEIPTS &amp; PUNCH AUDIT
            </span>
          </div>

          <h3 className="font-groovy font-black text-4xl sm:text-6xl text-[#7A1F1F] tracking-tight leading-[0.9]">
            ACTIVITY DOCKET
          </h3>
        </div>

        {/* Search Input (Brutalist Pill) */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-[#1F1614] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search docket or items..."
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-[#FAF6EA] border-3 border-[#1F1614] text-xs font-mono font-bold text-[#1F1614] placeholder-[#1F1614]/50 focus:outline-none focus:bg-white shadow-[3px_3px_0px_#1F1614] transition-all"
          />
        </div>
      </div>

      {/* CONTINUOUS THERMAL RECEIPT STRIP CONTAINER */}
      <div className="relative rounded-3xl bg-[#FAF6EA] border-3 border-[#1F1614] p-6 sm:p-8 shadow-[8px_8px_0px_#1F1614] space-y-4 overflow-hidden">
        
        {/* Paper Grain */}
        <div className="absolute inset-0 bg-halftone-dots opacity-10 pointer-events-none" />

        {filteredHistory.length === 0 ? (
          <div className="text-center py-12 space-y-2 font-mono">
            <Receipt className="w-10 h-10 text-[#7A1F1F]/40 mx-auto" />
            <p className="text-sm font-bold text-[#1F1614]">No matching docket records found</p>
            <p className="text-xs text-[#1F1614]/60">Settled counter transactions will record automatically here.</p>
          </div>
        ) : (
          <div className="divide-y-2 divide-dashed divide-[#1F1614]/20 relative z-10">
            {filteredHistory.map((entry, index) => (
              <div
                key={entry.id || index}
                className="py-4 first:pt-0 last:pb-0 flex flex-col sm:flex-row sm:items-center justify-between gap-4 group"
              >
                {/* Left Docket Entry */}
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-[#7A1F1F] text-[#E5A93C] flex items-center justify-center shrink-0 border-2 border-[#1F1614] shadow-[2px_2px_0px_#1F1614]">
                    <Receipt className="w-5 h-5 stroke-[2.5]" />
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-mono text-sm font-black text-[#1F1614]">
                        {entry.id}
                      </span>
                      <span className="font-mono text-xs text-[#1F1614]/60">
                        {entry.date} • {entry.time}
                      </span>
                      {entry.streakApplied && (
                        <span className="px-2 py-0.5 rounded-full bg-[#E5A93C] text-[#1F1614] font-mono text-[9px] font-black flex items-center gap-1 uppercase">
                          <Flame className="w-2.5 h-2.5 fill-current" />
                          2X STREAK BONUS
                        </span>
                      )}
                    </div>

                    <p className="font-mono text-xs text-[#1F1614]/80 font-bold">
                      {entry.items}
                    </p>
                  </div>
                </div>

                {/* Right Amount + Punch Awarded + Action */}
                <div className="flex items-center gap-4 self-end sm:self-auto">
                  <div className="text-right font-mono">
                    <div className="font-groovy font-black text-xl text-[#7A1F1F]">
                      ₹{entry.amount}
                    </div>
                    <div className="text-[10px] text-[#E5A93C] bg-[#1F1614] px-2 py-0.5 rounded font-black tracking-wider uppercase inline-block">
                      +{entry.stampsAwarded || 1} PUNCH
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleOpenReceipt(entry)}
                    className="px-3.5 py-2 rounded-xl bg-[#FAF6EA] hover:bg-white text-[#1F1614] border-2 border-[#1F1614] text-xs font-mono font-black uppercase cursor-pointer transition-all shadow-[2px_2px_0px_#1F1614] flex items-center gap-1"
                  >
                    <span>INSPECT</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>

      {/* =================================================================== */}
      {/* AUTHENTIC THERMAL SLIP MODAL                                        */}
      {/* =================================================================== */}
      <AnimatePresence>
        {selectedReceipt && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative w-full max-w-sm bg-white text-[#1F1614] border-3 border-[#1F1614] shadow-[12px_12px_0px_#1F1614] p-6 space-y-4 font-mono text-xs serrated-edge-bottom"
            >
              <button
                type="button"
                onClick={() => setSelectedReceipt(null)}
                className="absolute top-4 right-4 w-8 h-8 rounded-full bg-[#1F1614] text-[#F2ECD8] flex items-center justify-center hover:bg-[#7A1F1F] cursor-pointer"
              >
                <X className="w-4 h-4 stroke-[3]" />
              </button>

              <div className="text-center space-y-1 pb-3 border-b-2 border-dashed border-[#1F1614]/40">
                <div className="font-groovy font-black text-2xl text-[#7A1F1F]">
                  VALENCE
                </div>
                <div className="text-[10px] tracking-widest uppercase font-bold text-[#1F1614]/70">
                  OFFICIAL TAX INVOICE
                </div>
                <div className="text-[10px] text-[#1F1614]/60">
                  DOCKET NO: {selectedReceipt.id}
                </div>
                <div className="text-[10px] text-[#1F1614]/60">
                  DATE: {selectedReceipt.date} • {selectedReceipt.time}
                </div>
              </div>

              {/* Items Breakdown */}
              <div className="py-2 border-b-2 border-dashed border-[#1F1614]/40 space-y-1.5">
                <div className="flex justify-between font-bold">
                  <span>{selectedReceipt.items}</span>
                  <span>₹{selectedReceipt.amount}</span>
                </div>
              </div>

              {/* Taxes Breakdown */}
              {(() => {
                const tax = calculateTaxes(selectedReceipt.amount);
                return (
                  <div className="space-y-1 text-[11px] text-[#1F1614]/80 pb-2 border-b-2 border-dashed border-[#1F1614]/40">
                    <div className="flex justify-between">
                      <span>Subtotal</span>
                      <span>₹{tax.subtotal}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>CGST (2.5%)</span>
                      <span>₹{tax.cgst}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>SGST (2.5%)</span>
                      <span>₹{tax.sgst}</span>
                    </div>
                    <div className="flex justify-between font-black text-sm text-[#1F1614] pt-1">
                      <span>TOTAL BILLED</span>
                      <span>₹{tax.total}</span>
                    </div>
                  </div>
                );
              })()}

              {/* Punch Accrual Details */}
              <div className="p-3 rounded-xl bg-[#FAF6EA] border border-[#1F1614] space-y-1">
                <div className="flex justify-between font-bold text-[#7A1F1F]">
                  <span>PUNCHES RECORDED</span>
                  <span className="font-groovy text-sm">+{selectedReceipt.stampsAwarded || 1}</span>
                </div>
                <div className="flex justify-between text-[10px] text-[#1F1614]/70">
                  <span>Customer</span>
                  <span>{customer?.name} ({customer?.phone})</span>
                </div>
              </div>

              {/* Print Button */}
              <div className="pt-2">
                <button
                  type="button"
                  onClick={handlePrint}
                  className="w-full py-2.5 rounded-xl bg-[#1F1614] hover:bg-[#7A1F1F] text-[#F2ECD8] font-bold text-xs flex items-center justify-center gap-2 cursor-pointer transition-colors"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>PRINT THERMAL DOCKET</span>
                </button>
              </div>

              {/* Barcode on thermal slip */}
              <div className="pt-2 flex flex-col items-center justify-center space-y-1">
                <div className="h-6 w-48 flex items-stretch justify-between gap-[2px] opacity-80">
                  {[2, 1, 3, 1, 2, 4, 1, 2, 3, 1, 4, 2, 1, 3, 2, 4, 1, 2, 3, 1, 4, 2, 1].map((w, i) => (
                    <div key={i} className="bg-[#1F1614] h-full" style={{ width: `${w}px` }} />
                  ))}
                </div>
                <span className="text-[8px] tracking-widest text-[#1F1614]/50">
                  THANK YOU FOR YOUR PATRONAGE
                </span>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </section>
  );
}
