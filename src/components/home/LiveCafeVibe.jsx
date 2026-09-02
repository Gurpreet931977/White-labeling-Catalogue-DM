import React from 'react';
import { Users, Music, Coffee, CheckCircle2 } from 'lucide-react';
import { BRAND_CONFIG } from '../../data/cafeConfig';

export function LiveCafeVibe() {
  const totalTables = BRAND_CONFIG.tables.length || 12;
  const activeTables = Math.min(8, totalTables);
  const freeTables = Math.max(1, totalTables - activeTables);

  return (
    <section className="py-10 bg-slate-900/40 border-y border-white/5 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          
          {/* Card 1: Live Table Occupancy */}
          <div className="p-4 sm:p-5 rounded-2xl bg-slate-900/90 border border-white/5 flex items-center justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-[10px] font-mono font-semibold text-emerald-400 uppercase tracking-wider">
                  Live Dining
                </span>
              </div>
              <h4 className="text-lg font-bold text-white font-syne">{activeTables} / {totalTables} Tables Active</h4>
              <p className="text-slate-400 text-xs">{freeTables} Tables ready • Instant table QR ordering</p>
            </div>
            <div className="w-11 h-11 rounded-2xl bg-white/5 flex items-center justify-center text-emerald-400">
              <Users className="w-5 h-5" />
            </div>
          </div>

          {/* Card 2: Location Ambience */}
          <div className="p-4 sm:p-5 rounded-2xl bg-slate-900/90 border border-white/5 flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-[10px] font-mono font-semibold text-cyan-400 uppercase tracking-wider">
                Dining Ambience
              </span>
              <h4 className="text-lg font-bold text-white font-syne">Cozy Lounge & Kitchen</h4>
              <p className="text-slate-400 text-xs">{BRAND_CONFIG.contact.shortAddress} • Fresh hot food</p>
            </div>
            <div className="w-11 h-11 rounded-2xl bg-white/5 flex items-center justify-center text-cyan-400">
              <Coffee className="w-5 h-5" />
            </div>
          </div>

          {/* Card 3: Live Lounge Music */}
          <div className="p-4 sm:p-5 rounded-2xl bg-slate-900/90 border border-white/5 flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-[10px] font-mono font-semibold text-amber-400 uppercase tracking-wider">
                Now Playing at {BRAND_CONFIG.shortName}
              </span>
              <h4 className="text-lg font-bold text-white font-syne">Retro & Acoustic Lo-Fi</h4>
              <p className="text-slate-400 text-xs">Curated road trip soundtrack & acoustic hits</p>
            </div>
            <div className="w-11 h-11 rounded-2xl bg-white/5 flex items-center justify-center text-amber-400">
              <Music className="w-5 h-5" />
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
