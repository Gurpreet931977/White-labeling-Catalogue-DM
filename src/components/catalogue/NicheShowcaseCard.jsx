import React from 'react';
import { motion } from 'framer-motion';
import { 
  ArrowUpRight, 
  CheckCircle2, 
  Sliders, 
  Zap
} from 'lucide-react';
import { sounds } from '../../utils/audio';

export function NicheShowcaseCard({ 
  niche, 
  onLaunchLive, 
  onOpenDemo, 
  onOpenSpecs,
  onOpenCafeOptions 
}) {
  const isLive = niche.cardType === 'live-app';

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.4 }}
      className="group relative rounded-3xl overflow-hidden dripp-card-bg border border-white/10 hover:border-[#ebd73f]/50 transition-all duration-500 flex flex-col justify-between shadow-2xl hover:shadow-[0_20px_50px_rgba(0,0,0,0.9)]"
    >
      {/* Top Ambient Glow on Card Hover - Dripp Yellow */}
      <div className="absolute top-0 right-0 w-64 h-64 ambient-glow-yellow blur-3xl opacity-15 group-hover:opacity-40 transition-opacity pointer-events-none -z-10"></div>

      {/* Card Header & Mockup Area */}
      <div className="p-5 sm:p-6 pb-0">
        
        {/* HUD Top Bar */}
        <div className="flex items-center justify-between gap-2 mb-4">
          <div className="flex items-center gap-2">
            <span className="font-mono text-[11px] font-bold tracking-widest text-[#ebd73f]">
              {niche.code}
            </span>
            <span className="text-white/20">•</span>
            <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider">
              {niche.clientBrand}
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#ebd73f]"></span>
            <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full border bg-white/5 text-white/90 border-white/15">
              {niche.badge}
            </span>
          </div>
        </div>

        {/* Mockup Canvas */}
        <div className="relative rounded-2xl overflow-hidden bg-black/60 border border-white/10 aspect-[16/10] group-hover:border-white/25 transition-all">
          
          {/* Mockup Browser Window Header */}
          <div className="absolute top-0 inset-x-0 h-7 bg-white/[0.04] border-b border-white/10 backdrop-blur-md px-3 flex items-center justify-between z-10">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-white/20"></span>
              <span className="w-2 h-2 rounded-full bg-white/20"></span>
              <span className="w-2 h-2 rounded-full bg-[#ebd73f]/60"></span>
            </div>
            <span className="font-mono text-[9px] text-white/50 tracking-wider">
              whitelabel.{niche.id}.app
            </span>
            <div className="flex items-center gap-1 text-[9px] font-mono text-[#ebd73f]">
              <span>{niche.metrics.loadSpeed}</span>
            </div>
          </div>

          {/* Mockup Image / Preview */}
          <div className="w-full h-full pt-7 relative overflow-hidden">
            <img 
              src={niche.previewImages ? niche.previewImages[0] : (
                niche.id === 'clinics' ? "https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&w=800&q=80" :
                niche.id === 'gyms' ? "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=800&q=80" :
                niche.id === 'clubs' ? "https://images.unsplash.com/photo-1566737236500-c8ac43014a67?auto=format&fit=crop&w=800&q=80" :
                niche.id === 'turfs' ? "https://images.unsplash.com/photo-1529900748604-07564a03e7a6?auto=format&fit=crop&w=800&q=80" :
                "https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=800&q=80"
              )}
              alt={niche.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-80"
            />
            
            {/* Gradient Scrim */}
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/35 to-transparent"></div>

            {/* In-mockup KPI Float Badge - Strictly Dripp Brand Colors */}
            <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
              <div className="px-2.5 py-1 rounded-xl bg-black/85 backdrop-blur-md border border-white/10 flex items-center gap-1.5">
                <Zap className="w-3 h-3 text-[#ebd73f]" />
                <span className="text-[10px] font-mono text-slate-300">
                  {niche.metrics.highlightLabel}: <strong className="text-[#ebd73f] font-bold">{niche.metrics.highlightNum}</strong>
                </span>
              </div>

              <div className="px-2.5 py-1 rounded-xl bg-black/85 backdrop-blur-md border border-white/10 text-[10px] font-mono text-slate-300">
                {niche.metrics.retentionLabel}: <strong className="text-white font-bold">{niche.metrics.retentionNum}</strong>
              </div>
            </div>
          </div>

        </div>

      </div>

      {/* Card Content Details */}
      <div className="p-5 sm:p-6 space-y-4">
        <div>
          <h3 className="font-panchang font-bold text-xl text-white group-hover:text-[#ebd73f] transition-colors leading-snug">
            {niche.title}
          </h3>
          <p className="text-xs text-slate-300/80 font-clash mt-2 leading-relaxed">
            {niche.description}
          </p>
        </div>

        {/* Feature Tags Cloud */}
        <div className="flex flex-wrap gap-1.5 pt-1">
          {niche.tags.map((tag, i) => (
            <span 
              key={i} 
              className="px-2.5 py-1 rounded-full bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-[10px] font-mono text-slate-300 transition"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Feature Highlights List */}
        <div className="pt-2 border-t border-white/10 space-y-1.5 font-clash">
          {niche.features.slice(0, 3).map((feat, idx) => (
            <div key={idx} className="flex items-start gap-2 text-xs text-slate-300/80">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#ebd73f] shrink-0 mt-0.5" />
              <span className="leading-tight">{feat}</span>
            </div>
          ))}
        </div>

        {/* Card CTA Action Row - Equal Balance Across All Niches */}
        <div className="pt-4 flex items-center gap-2.5">
          {niche.id === 'cafes' ? (
            <button
              onClick={() => {
                sounds.playClick();
                if (onOpenCafeOptions) {
                  onOpenCafeOptions();
                } else {
                  onLaunchLive();
                }
              }}
              className="w-full btn-dripp-primary py-3 px-4 text-xs font-bold flex items-center justify-center gap-2 cursor-pointer shadow-lg"
            >
              <span className="auth-shimmer-sweep"></span>
              <span>Choose Cafe Options (4 Models)</span>
              <ArrowUpRight className="w-4 h-4 text-black" />
            </button>
          ) : (
            <button
              onClick={() => {
                sounds.playClick();
                onOpenDemo(niche);
              }}
              className="w-full btn-dripp-primary py-3 px-4 text-xs font-bold flex items-center justify-center gap-2 cursor-pointer shadow-lg"
            >
              <span className="auth-shimmer-sweep"></span>
              <span>Explore Interactive Demo</span>
              <ArrowUpRight className="w-4 h-4 text-black" />
            </button>
          )}

          <button
            onClick={() => {
              sounds.playClick();
              onOpenSpecs(niche);
            }}
            className="p-3 rounded-full bg-white/5 hover:bg-white/15 border border-white/10 text-white/70 hover:text-white transition cursor-pointer shrink-0"
            title="View Turnkey Specifications & Architecture"
          >
            <Sliders className="w-4 h-4" />
          </button>
        </div>

      </div>

    </motion.div>
  );
}
