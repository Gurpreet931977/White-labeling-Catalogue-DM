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
            <span className="text-[10px] font-mono tracking-widest text-[#3B82F6] uppercase font-bold">
              TRANSACTION AUDIT
            </span>
            <span className="px-2 py-0.5 rounded-full bg-[#1A1C24] text-[#8E91A0] border border-[#2B2E3D] font-mono text-[9px] font-bold">
              VERIFIED LEDGER
            </span>
          </div>
          <h3 className="font-clash font-bold text-xl sm:text-2xl text-[#F4F4F6] mt-0.5">
            Activity & Billing History
          </h3>
        </div>

        {/* Search Bar */}
        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-[#8E91A0] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search bills or items..."
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-[#121318] border border-[#222533] text-xs text-[#F4F4F6] placeholder-[#545768] focus:outline-none focus:border-[#3B82F6] transition-colors"
          />
        </div>
      </div>

      {/* LEDGER TIMELINE LIST */}
      <div className="rounded-3xl bg-[#121318] border border-[#222533] p-5 sm:p-6 shadow-xl space-y-4">
        {filteredHistory.length === 0 ? (
          <div className="text-center py-12 space-y-2">
            <Receipt className="w-8 h-8 text-[#545768] mx-auto opacity-50" />
            <p className="text-sm font-mono text-[#8E91A0]">No matching transactions found</p>
            <p className="text-xs text-[#545768]">Settled bills will automatically appear in this ledger.</p>
          </div>
        ) : (
          <div className="divide-y divide-[#1D1F2B]">
            {filteredHistory.map((entry, index) => (
              <div
                key={entry.id || index}
                className="py-4 first:pt-0 last:pb-0 flex flex-col sm:flex-row sm:items-center justify-between gap-4 group"
              >
                {/* Left: Date & Items */}
                <div className="flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-2xl bg-[#1A1C25] border border-[#2A2D3C] flex items-center justify-center text-[#3B82F6] shrink-0 group-hover:border-[#3B82F6] transition-colors">
                    <Receipt className="w-4 h-4" />
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-mono text-xs font-bold text-[#F4F4F6]">
                        {entry.id}
                      </span>
                      <span className="text-[10px] font-mono text-[#8E91A0] flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {entry.date} • {entry.time}
                      </span>
                      {entry.streakApplied && (
                        <span className="px-2 py-0.2 rounded-full bg-[#F97316]/15 text-[#F97316] font-mono text-[9px] font-bold flex items-center gap-1">
                          <Flame className="w-2.5 h-2.5 fill-[#F97316]" />
                          2X STREAK APPLIED
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-[#8E91A0] font-sans">
                      {entry.items || 'Standard Member Store Items'}
                    </p>
                  </div>
                </div>

                {/* Right: Amount, Stamps & Invoice Trigger */}
                <div className="flex items-center justify-between sm:justify-end gap-4 shrink-0 pl-13 sm:pl-0">
                  <div className="text-left sm:text-right">
                    <div className="font-mono font-bold text-sm text-[#F4F4F6]">
                      ₹{entry.amount}
                    </div>
                    <span className="text-[10px] font-mono text-[#3B82F6] font-semibold">
                      +{entry.stampsAwarded || 1} Stamp • +{entry.streakApplied ? 100 : 50} XP
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleOpenReceipt(entry)}
                    className="px-3 py-1.5 rounded-xl bg-[#1A1C24] hover:bg-[#252836] border border-[#2B2E3D] text-[#8E91A0] hover:text-[#F4F4F6] text-xs font-mono flex items-center gap-1.5 transition-all cursor-pointer"
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
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative w-full max-w-sm rounded-3xl bg-[#FFFFFF] text-[#111827] shadow-2xl p-6 sm:p-7 space-y-5 overflow-hidden font-mono border border-gray-200"
            >
              {/* Close Button */}
              <button
                type="button"
                onClick={() => setSelectedReceipt(null)}
                className="absolute top-4 right-4 w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:text-black cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>

              {/* Thermal Receipt Header */}
              <div className="text-center space-y-1 pb-3 border-b-2 border-dashed border-gray-300">
                <h4 className="font-black text-lg tracking-wider">VALENCE STORE</h4>
                <p className="text-[10px] text-gray-500">UNIVERSAL DIGITAL MEMBERSHIP</p>
                <p className="text-[9px] text-gray-400">GSTIN: 07AAAAA0000A1Z5</p>
              </div>

              {/* Meta details */}
              <div className="text-xs space-y-1 py-1 text-gray-600">
                <div className="flex justify-between">
                  <span>INVOICE:</span>
                  <span className="font-bold text-gray-900">{selectedReceipt.id}</span>
                </div>
                <div className="flex justify-between">
                  <span>DATE:</span>
                  <span>{selectedReceipt.date} {selectedReceipt.time}</span>
                </div>
                <div className="flex justify-between">
                  <span>MEMBER:</span>
                  <span className="font-bold text-gray-900">{customer?.name} ({customer?.phone})</span>
                </div>
              </div>

              {/* Line Items */}
              <div className="py-2 border-y-2 border-dashed border-gray-300 space-y-2 text-xs">
                <div className="flex justify-between font-bold text-gray-800">
                  <span>DESCRIPTION</span>
                  <span>AMOUNT</span>
                </div>
                <div className="flex justify-between text-gray-700">
                  <span className="truncate max-w-[200px]">{selectedReceipt.items}</span>
                  <span>₹{selectedReceipt.amount}</span>
                </div>
              </div>

              {/* Tax Calculations */}
              {(() => {
                const taxes = calculateTaxes(selectedReceipt.amount);
                return (
                  <div className="space-y-1 text-xs text-gray-600">
                    <div className="flex justify-between">
                      <span>Subtotal (Excl. Tax):</span>
                      <span>₹{taxes.subtotal}</span>
                    </div>
                    <div className="flex justify-between text-[11px] text-gray-500">
                      <span>CGST (2.5%):</span>
                      <span>₹{taxes.cgst}</span>
                    </div>
                    <div className="flex justify-between text-[11px] text-gray-500">
                      <span>SGST (2.5%):</span>
                      <span>₹{taxes.sgst}</span>
                    </div>
                    <div className="flex justify-between font-bold text-sm text-gray-900 pt-2 border-t border-gray-200">
                      <span>TOTAL BILLED:</span>
                      <span>₹{taxes.total}</span>
                    </div>
                  </div>
                );
              })()}

              {/* Loyalty Impact Footer */}
              <div className="p-3 bg-gray-50 rounded-xl border border-gray-200 text-center space-y-0.5">
                <span className="text-[10px] text-blue-600 font-bold tracking-wider block">
                  LOYALTY STAMPS CREDITED
                </span>
                <span className="text-xs font-bold text-gray-800">
                  +{selectedReceipt.stampsAwarded || 1} Stamp Awarded To Pass
                </span>
                {selectedReceipt.streakApplied && (
                  <span className="text-[9px] text-orange-600 font-bold block">
                    (Includes 5-Day Streak Double Bonus)
                  </span>
                )}
              </div>

              {/* Actions */}
              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={handlePrint}
                  className="flex-1 py-2 rounded-xl bg-gray-900 hover:bg-black text-white text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print Receipt</span>
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedReceipt(null)}
                  className="px-4 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold cursor-pointer"
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
