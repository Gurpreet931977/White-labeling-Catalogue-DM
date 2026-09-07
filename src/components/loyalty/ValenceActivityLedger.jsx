import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Receipt,
  Calendar,
  Search,
  ChevronRight,
  Printer,
  X,
  Flame,
  CheckCircle2
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
    <section className="space-y-6">
      
      {/* SECTION HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-1">
        <div>
          <span className="text-xs font-mono font-bold tracking-widest text-[#7A1F1F] uppercase">
            TRANSACTION AUDIT
          </span>
          <h3 className="font-groovy font-black text-3xl sm:text-4xl text-[#7A1F1F] tracking-wide mt-0.5 leading-none">
            Activity &amp; Billing History
          </h3>
        </div>

        {/* Search Bar */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-[#7A1F1F] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search bills or items..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#FAF6EA] border-2 border-[#7A1F1F] text-xs font-mono text-[#7A1F1F] placeholder-[#7A1F1F]/60 focus:outline-none focus:bg-white transition-colors"
          />
        </div>
      </div>

      {/* LEDGER LIST (Warm Cream Container with Bold 3px Oxblood Border) */}
      <div className="rounded-3xl bg-[#FAF6EA] border-3 border-[#7A1F1F] p-6 shadow-[8px_8px_0px_#7A1F1F] space-y-4">
        {filteredHistory.length === 0 ? (
          <div className="text-center py-12 space-y-2 font-mono">
            <Receipt className="w-10 h-10 text-[#7A1F1F]/40 mx-auto" />
            <p className="text-sm font-bold text-[#7A1F1F]">No matching transactions found</p>
            <p className="text-xs text-[#7A1F1F]/70">Settled receipts appear automatically in this ledger.</p>
          </div>
        ) : (
          <div className="divide-y-2 divide-dashed divide-[#7A1F1F]/20">
            {filteredHistory.map((entry, index) => (
              <div
                key={entry.id || index}
                className="py-4 first:pt-0 last:pb-0 flex flex-col sm:flex-row sm:items-center justify-between gap-4 group"
              >
                {/* Left Info */}
                <div className="flex items-start gap-3.5">
                  <div className="w-11 h-11 rounded-2xl bg-[#7A1F1F] text-[#E5A93C] flex items-center justify-center shrink-0 border-2 border-[#5C1414] shadow-sm">
                    <Receipt className="w-5 h-5 stroke-[2.5]" />
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-mono text-sm font-black text-[#7A1F1F]">
                        {entry.id}
                      </span>
                      <span className="text-xs font-mono text-[#7A1F1F]/80 flex items-center gap-1 font-bold">
                        <Calendar className="w-3.5 h-3.5" />
                        {entry.date} • {entry.time}
                      </span>
                      {entry.streakApplied && (
                        <span className="px-2 py-0.5 rounded-full bg-[#E5A93C] text-[#7A1F1F] font-groovy text-[10px] font-black flex items-center gap-1 uppercase">
                          <Flame className="w-3 h-3 fill-[#7A1F1F]" />
                          2X STREAK APPLIED
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-[#7A1F1F]/80 font-sans font-medium">
                      {entry.items || 'Standard Store Member Order'}
                    </p>
                  </div>
                </div>

                {/* Right: Amount & Receipt Button */}
                <div className="flex items-center justify-between sm:justify-end gap-4 shrink-0 pl-14 sm:pl-0">
                  <div className="text-left sm:text-right">
                    <div className="font-groovy font-black text-xl text-[#7A1F1F] leading-none">
                      ₹{entry.amount}
                    </div>
                    <span className="text-[11px] font-mono text-[#7A1F1F] font-bold">
                      +{entry.stampsAwarded || 1} Stamp • +{entry.streakApplied ? 100 : 50} XP
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleOpenReceipt(entry)}
                    className="px-3.5 py-2 rounded-xl bg-[#7A1F1F] hover:bg-[#5C1414] text-[#F2ECD8] text-xs font-groovy font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-[3px_3px_0px_#470D0D] uppercase"
                  >
                    <span>Receipt</span>
                    <ChevronRight className="w-3.5 h-3.5 stroke-[3]" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 80MM THERMAL RECEIPT MODAL */}
      <AnimatePresence>
        {selectedReceipt && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative w-full max-w-sm rounded-3xl bg-[#FAF6EA] text-[#7A1F1F] shadow-[12px_12px_0px_#7A1F1F] p-6 sm:p-7 space-y-4 overflow-hidden font-mono border-3 border-[#7A1F1F]"
            >
              <button
                type="button"
                onClick={() => setSelectedReceipt(null)}
                className="absolute top-4 right-4 w-8 h-8 rounded-full bg-[#7A1F1F] text-[#F2ECD8] flex items-center justify-center hover:bg-[#5C1414] cursor-pointer"
              >
                <X className="w-4 h-4 stroke-[3]" />
              </button>

              {/* Thermal Header */}
              <div className="text-center space-y-1 pb-3 border-b-2 border-dashed border-[#7A1F1F]">
                <h4 className="font-groovy font-black text-2xl tracking-wide">VALENCE STORE</h4>
                <p className="text-[10px] font-bold uppercase tracking-wider">OFFICIAL TAX INVOICE</p>
                <p className="text-[9px] text-[#7A1F1F]/70">GSTIN: 07AAAAA0000A1Z5</p>
              </div>

              {/* Meta */}
              <div className="text-xs space-y-1 py-1 text-[#7A1F1F]">
                <div className="flex justify-between">
                  <span>INVOICE:</span>
                  <span className="font-bold">{selectedReceipt.id}</span>
                </div>
                <div className="flex justify-between">
                  <span>DATE:</span>
                  <span>{selectedReceipt.date} {selectedReceipt.time}</span>
                </div>
                <div className="flex justify-between">
                  <span>MEMBER:</span>
                  <span className="font-bold">{customer?.name} ({customer?.phone})</span>
                </div>
              </div>

              {/* Line Items */}
              <div className="py-2 border-y-2 border-dashed border-[#7A1F1F] space-y-1.5 text-xs">
                <div className="flex justify-between font-bold">
                  <span>DESCRIPTION</span>
                  <span>AMOUNT</span>
                </div>
                <div className="flex justify-between">
                  <span className="truncate max-w-[190px]">{selectedReceipt.items}</span>
                  <span className="font-bold">₹{selectedReceipt.amount}</span>
                </div>
              </div>

              {/* Taxes */}
              {(() => {
                const taxes = calculateTaxes(selectedReceipt.amount);
                return (
                  <div className="space-y-1 text-xs text-[#7A1F1F]/80">
                    <div className="flex justify-between">
                      <span>Subtotal:</span>
                      <span>₹{taxes.subtotal}</span>
                    </div>
                    <div className="flex justify-between text-[11px]">
                      <span>CGST (2.5%):</span>
                      <span>₹{taxes.cgst}</span>
                    </div>
                    <div className="flex justify-between text-[11px]">
                      <span>SGST (2.5%):</span>
                      <span>₹{taxes.sgst}</span>
                    </div>
                    <div className="flex justify-between font-bold text-sm text-[#7A1F1F] pt-1.5 border-t border-[#7A1F1F]/30">
                      <span>TOTAL BILLED:</span>
                      <span>₹{taxes.total}</span>
                    </div>
                  </div>
                );
              })()}

              {/* Stamp sync confirmation */}
              <div className="p-3 bg-[#E5A93C] rounded-xl border-2 border-[#7A1F1F] text-center space-y-0.5 text-[#7A1F1F]">
                <span className="text-[10px] font-groovy font-black tracking-wider uppercase block">
                  PASS STAMP RECORDED
                </span>
                <span className="text-xs font-bold">
                  +{selectedReceipt.stampsAwarded || 1} Stamp Credited To Pass
                </span>
                {selectedReceipt.streakApplied && (
                  <span className="text-[9px] font-bold block">
                    (Includes 5-Day Streak Double Bonus)
                  </span>
                )}
              </div>

              {/* Actions */}
              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={handlePrint}
                  className="flex-1 py-2.5 rounded-xl bg-[#7A1F1F] hover:bg-[#5C1414] text-[#F2ECD8] text-xs font-groovy font-bold flex items-center justify-center gap-1.5 cursor-pointer uppercase shadow-[3px_3px_0px_#470D0D]"
                >
                  <Printer className="w-4 h-4" />
                  <span>Print Receipt</span>
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedReceipt(null)}
                  className="px-4 py-2.5 rounded-xl bg-[#F2ECD8] hover:bg-[#E2D8BE] text-[#7A1F1F] border-2 border-[#7A1F1F] text-xs font-groovy font-bold cursor-pointer uppercase"
                >
                  Close
                </button>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </section>
  );
}
