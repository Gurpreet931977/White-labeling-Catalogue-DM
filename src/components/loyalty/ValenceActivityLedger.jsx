import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Receipt,
  Clock,
  ArrowUpRight,
  CheckCircle2,
  Printer,
  X,
  Flame,
  Calendar,
  CreditCard,
  Check,
  Search,
  ChevronRight,
  ShieldCheck
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

  // Calculate taxes for thermal invoice modal
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
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono tracking-widest text-[#FF4800] uppercase font-bold">
              TRANSACTION AUDIT
            </span>
            <span className="px-2.5 py-0.5 rounded-full bg-[#EAE0CE] text-[#6E5D4F] border border-[#DDD0BC] font-mono text-[9px] font-bold">
              VERIFIED LEDGER
            </span>
          </div>
          <h3 className="font-clash font-bold text-xl sm:text-2xl text-[#1C120C] mt-0.5">
            Activity & Billing History
          </h3>
        </div>

        {/* Search Bar */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-[#8C7D70] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search bills or items..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white border border-[#E2D6C3] text-xs text-[#1C120C] placeholder-[#A19183] focus:outline-none focus:border-[#FF4800] transition-colors"
          />
        </div>
      </div>

      {/* LEDGER TIMELINE LIST */}
      <div className="rounded-3xl bg-white border border-[#E2D6C3] p-6 sm:p-7 shadow-md space-y-4">
        {filteredHistory.length === 0 ? (
          <div className="text-center py-12 space-y-2">
            <Receipt className="w-8 h-8 text-[#A19183] mx-auto opacity-50" />
            <p className="text-sm font-mono text-[#76675B]">No matching transactions found</p>
            <p className="text-xs text-[#8C7D70]">Settled bills will automatically appear in this ledger.</p>
          </div>
        ) : (
          <div className="divide-y divide-[#EAE0CE]">
            {filteredHistory.map((entry, index) => (
              <div
                key={entry.id || index}
                className="py-4 first:pt-0 last:pb-0 flex flex-col sm:flex-row sm:items-center justify-between gap-4 group"
              >
                {/* Left: Date & Items */}
                <div className="flex items-start gap-4">
                  <div className="w-11 h-11 rounded-2xl bg-[#F7F2E7] border border-[#E2D6C3] flex items-center justify-center text-[#FF4800] shrink-0 group-hover:bg-[#FF4800] group-hover:text-white transition-colors">
                    <Receipt className="w-5 h-5" />
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-2.5 flex-wrap">
                      <span className="font-mono text-xs font-bold text-[#1C120C]">
                        {entry.id}
                      </span>
                      <span className="text-[10px] font-mono text-[#76675B] flex items-center gap-1 bg-[#F7F2E7] px-2 py-0.5 rounded-md">
                        <Calendar className="w-3 h-3" />
                        {entry.date} • {entry.time}
                      </span>
                      {entry.streakApplied && (
                        <span className="px-2 py-0.5 rounded-full bg-[#FF4800]/15 text-[#FF4800] font-mono text-[9px] font-bold flex items-center gap-1">
                          <Flame className="w-2.5 h-2.5 fill-[#FF4800]" />
                          2X STREAK APPLIED
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-[#76675B] font-sans">
                      {entry.items || 'Standard Member Store Items'}
                    </p>
                  </div>
                </div>

                {/* Right: Amount, Stamps & Invoice Trigger */}
                <div className="flex items-center justify-between sm:justify-end gap-4 shrink-0 pl-15 sm:pl-0">
                  <div className="text-left sm:text-right">
                    <div className="font-mono font-bold text-base text-[#1C120C]">
                      ₹{entry.amount}
                    </div>
                    <span className="text-[10px] font-mono text-[#FF4800] font-bold">
                      +{entry.stampsAwarded || 1} Stamp • +{entry.streakApplied ? 100 : 50} XP
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleOpenReceipt(entry)}
                    className="px-3.5 py-1.5 rounded-xl bg-[#F7F2E7] hover:bg-[#1C120C] hover:text-[#FFFDF9] border border-[#E2D6C3] text-[#6E5D4F] text-xs font-mono font-bold flex items-center gap-1.5 transition-all cursor-pointer"
                  >
                    <span>Receipt</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ITEM AUDIT RECEIPT MODAL (80mm Digital Thermal Docket) */}
      <AnimatePresence>
        {selectedReceipt && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1C120C]/80 backdrop-blur-md">
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative w-full max-w-sm rounded-3xl bg-white text-[#1C120C] shadow-2xl p-6 sm:p-7 space-y-5 overflow-hidden font-mono border border-[#E2D6C3]"
            >
              {/* Close Button */}
              <button
                type="button"
                onClick={() => setSelectedReceipt(null)}
                className="absolute top-4 right-4 w-7 h-7 rounded-full bg-[#F7F2E7] flex items-center justify-center text-[#76675B] hover:text-[#1C120C] cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>

              {/* Thermal Receipt Header */}
              <div className="text-center space-y-1 pb-3 border-b-2 border-dashed border-[#DDD1BE]">
                <h4 className="font-black text-xl tracking-wider">VALENCE STORE</h4>
                <p className="text-[10px] text-[#76675B]">UNIVERSAL DIGITAL MEMBERSHIP</p>
                <p className="text-[9px] text-[#A19183]">GSTIN: 07AAAAA0000A1Z5</p>
              </div>

              {/* Meta details */}
              <div className="text-xs space-y-1 py-1 text-[#6E5D4F]">
                <div className="flex justify-between">
                  <span>INVOICE:</span>
                  <span className="font-bold text-[#1C120C]">{selectedReceipt.id}</span>
                </div>
                <div className="flex justify-between">
                  <span>DATE:</span>
                  <span>{selectedReceipt.date} {selectedReceipt.time}</span>
                </div>
                <div className="flex justify-between">
                  <span>MEMBER:</span>
                  <span className="font-bold text-[#1C120C]">{customer?.name} ({customer?.phone})</span>
                </div>
              </div>

              {/* Line Items */}
              <div className="py-2 border-y-2 border-dashed border-[#DDD1BE] space-y-2 text-xs">
                <div className="flex justify-between font-bold text-[#1C120C]">
                  <span>DESCRIPTION</span>
                  <span>AMOUNT</span>
                </div>
                <div className="flex justify-between text-[#6E5D4F]">
                  <span className="truncate max-w-[200px]">{selectedReceipt.items}</span>
                  <span className="font-bold text-[#1C120C]">₹{selectedReceipt.amount}</span>
                </div>
              </div>

              {/* Tax Calculations */}
              {(() => {
                const taxes = calculateTaxes(selectedReceipt.amount);
                return (
                  <div className="space-y-1 text-xs text-[#6E5D4F]">
                    <div className="flex justify-between">
                      <span>Subtotal (Excl. Tax):</span>
                      <span>₹{taxes.subtotal}</span>
                    </div>
                    <div className="flex justify-between text-[11px] text-[#8C7D70]">
                      <span>CGST (2.5%):</span>
                      <span>₹{taxes.cgst}</span>
                    </div>
                    <div className="flex justify-between text-[11px] text-[#8C7D70]">
                      <span>SGST (2.5%):</span>
                      <span>₹{taxes.sgst}</span>
                    </div>
                    <div className="flex justify-between font-bold text-sm text-[#1C120C] pt-2 border-t border-[#EAE0CE]">
                      <span>TOTAL BILLED:</span>
                      <span className="text-[#FF4800]">₹{taxes.total}</span>
                    </div>
                  </div>
                );
              })()}

              {/* Loyalty Impact Footer */}
              <div className="p-3.5 bg-[#FFF5F0] rounded-xl border border-[#FF4800]/25 text-center space-y-0.5">
                <span className="text-[10px] text-[#FF4800] font-bold tracking-wider block">
                  LOYALTY STAMPS CREDITED
                </span>
                <span className="text-xs font-bold text-[#1C120C]">
                  +{selectedReceipt.stampsAwarded || 1} Stamp Awarded To Pass
                </span>
                {selectedReceipt.streakApplied && (
                  <span className="text-[9px] text-[#FF4800] font-bold block">
                    (Includes 5-Day Streak Double Bonus)
                  </span>
                )}
              </div>

              {/* Actions */}
              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={handlePrint}
                  className="flex-1 py-2.5 rounded-xl bg-[#1C120C] hover:bg-black text-white text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print Receipt</span>
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedReceipt(null)}
                  className="px-4 py-2.5 rounded-xl bg-[#F7F2E7] hover:bg-[#EAE0CE] text-[#1C120C] text-xs font-bold cursor-pointer"
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
