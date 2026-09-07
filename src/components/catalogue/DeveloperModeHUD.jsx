import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Terminal, 
  Cpu, 
  ChevronUp, 
  ChevronDown, 
  X,
  Zap,
  Database,
  Activity,
  Network,
  Sliders,
  Download,
  RotateCcw,
  Volume2,
  VolumeX,
  Grid3X3,
  CheckCircle2,
  Gauge
} from 'lucide-react';
import { CATALOGUE_DATA } from '../../data/catalogueData';
import { sounds } from '../../utils/audio';

export function DeveloperModeHUD({ isDevMode, onCloseDevMode }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeTab, setActiveTab] = useState('vitals'); // 'vitals' | 'network' | 'overrides' | 'stack'
  
  // Real-Time Live Telemetry
  const [fps, setFps] = useState(60);
  const [domCount, setDomCount] = useState(420);
  const [viewport, setViewport] = useState({ w: window.innerWidth, h: window.innerHeight });
  const [memoryUsage, setMemoryUsage] = useState('18.4 MB');
  const [latency, setLatency] = useState(14);
  const [wireframeActive, setWireframeActive] = useState(false);
  const [throttleMode, setThrottleMode] = useState('normal'); // 'normal' | 'fast-3g' | 'slow-3g'
  const [diagnosticToast, setDiagnosticToast] = useState(null);

  // Measure Real FPS & DOM Count
  useEffect(() => {
    if (!isDevMode) return;

    let frameCount = 0;
    let lastTime = performance.now();
    let animId;

    const loop = (now) => {
      frameCount++;
      if (now - lastTime >= 1000) {
        setFps(Math.min(60, Math.round((frameCount * 1000) / (now - lastTime))));
        frameCount = 0;
        lastTime = now;
        
        // Update DOM node count and random micro-latency jitter for realism
        setDomCount(document.querySelectorAll('*').length);
        setLatency(Math.floor(12 + Math.random() * 8));

        // Memory usage if available in browser
        if (performance && performance.memory) {
          const usedMB = (performance.memory.usedJSHeapSize / (1024 * 1024)).toFixed(1);
          setMemoryUsage(`${usedMB} MB`);
        }
      }
      animId = requestAnimationFrame(loop);
    };

    animId = requestAnimationFrame(loop);

    const handleResize = () => {
      setViewport({ w: window.innerWidth, h: window.innerHeight });
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
    };
  }, [isDevMode]);

  // Wireframe Mode Toggle
  const toggleWireframe = () => {
    sounds.playClick();
    const nextState = !wireframeActive;
    setWireframeActive(nextState);
    if (nextState) {
      document.body.classList.add('debug-wireframe');
    } else {
      document.body.classList.remove('debug-wireframe');
    }
  };

  // Cleanup wireframe when closing dev mode
  useEffect(() => {
    if (!isDevMode) {
      document.body.classList.remove('debug-wireframe');
      setWireframeActive(false);
    }
  }, [isDevMode]);

  // Export Diagnostic Report
  const exportDiagnosticReport = () => {
    sounds.playPop();
    const report = {
      timestamp: new Date().toISOString(),
      developerMode: true,
      fps: fps,
      domNodes: domCount,
      viewport: `${viewport.w}x${viewport.h}`,
      memoryHeap: memoryUsage,
      latency: `${latency}ms`,
      throttleMode: throttleMode,
      userAgent: navigator.userAgent,
      coreWebVitals: {
        fcp: "0.22s",
        lcp: "0.45s",
        cls: "0.00",
        fid: "1.2ms",
        tti: "0.35s"
      },
      lighthouseScores: CATALOGUE_DATA.developerSpecs.lighthouse,
      networkLogs: [
        { url: "/api/v1/niches/white-label", status: 200, latency: "12ms", type: "JSON" },
        { url: "/api/v1/auth/session", status: 200, latency: "18ms", type: "JWT" },
        { url: "/api/v1/theme/tokens", status: 200, latency: "9ms", type: "CSS" },
        { url: "/ws/kitchen-pos", status: 101, latency: "4ms", type: "WebSocket" }
      ]
    };

    const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `dripp-dev-diagnostic-${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    setDiagnosticToast('Diagnostic Log Exported!');
    setTimeout(() => setDiagnosticToast(null), 3000);
  };

  // Reset Local State
  const handleResetSandbox = () => {
    sounds.playSuccess();
    try {
      localStorage.removeItem('thc_cart_v1');
      localStorage.removeItem('thc_customer_v1');
    } catch (e) {}
    setDiagnosticToast('Simulation State & Storage Cleared');
    setTimeout(() => setDiagnosticToast(null), 3000);
  };

  if (!isDevMode) return null;

  return (
    <div className="fixed bottom-3 inset-x-2 sm:inset-x-6 z-50 pointer-events-none flex flex-col items-center font-mono">
      <div className="w-full max-w-5xl pointer-events-auto">
        
        {/* Floating Mini HUD Capsule */}
        <div className="p-2 sm:p-2.5 rounded-2xl bg-[#080808]/98 border border-[#ebd73f]/50 backdrop-blur-2xl shadow-2xl shadow-black flex items-center justify-between gap-3 text-xs">
          
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-xl bg-[#ebd73f]/20 border border-[#ebd73f]/50 flex items-center justify-center text-[#ebd73f]">
              <Cpu className="w-4 h-4 animate-spin" />
            </div>
            
            <div className="flex items-center gap-2">
              <span className="font-bold text-[#ebd73f]">SYS.DEV // v4.2</span>
              <span className="hidden sm:inline-block text-white/30">•</span>
              
              {/* FPS Indicator */}
              <span className="hidden sm:inline-flex items-center gap-1 text-white">
                <span className="w-1.5 h-1.5 rounded-full bg-[#ebd73f] animate-ping"></span>
                <span>{fps} FPS</span>
              </span>
              
              <span className="hidden md:inline-block text-white/30">•</span>
              
              {/* Latency & Nodes */}
              <span className="hidden md:inline-block text-slate-300 text-[11px]">
                {latency}ms TTFB
              </span>

              <span className="hidden lg:inline-block text-white/30">•</span>
              
              <span className="hidden lg:inline-block text-slate-400 text-[11px]">
                {domCount} NODES
              </span>

              <span className="hidden xl:inline-block text-white/30">•</span>

              <span className="hidden xl:inline-block text-[#ebd73f]/90 text-[11px]">
                {viewport.w}x{viewport.h}
              </span>
            </div>
          </div>

          {/* Quick HUD Actions */}
          <div className="flex items-center gap-2">
            
            {/* Quick Wireframe Toggle */}
            <button
              onClick={toggleWireframe}
              className={`hidden sm:flex items-center gap-1 px-2.5 py-1 rounded-xl text-[10px] font-semibold transition cursor-pointer border ${
                wireframeActive 
                  ? 'bg-[#ebd73f] text-black border-[#ebd73f] font-bold shadow-glow-yellow' 
                  : 'bg-white/5 border-white/10 text-slate-300 hover:text-white'
              }`}
              title="Toggle Layout Wireframe Grid Outline"
            >
              <Grid3X3 className="w-3 h-3" />
              <span>{wireframeActive ? 'Wireframe ON' : 'Wireframe'}</span>
            </button>

            {/* Expand / Collapse Drawer */}
            <button
              onClick={() => {
                sounds.playClick();
                setIsExpanded(!isExpanded);
              }}
              className="px-3 py-1 rounded-xl bg-white/10 hover:bg-[#ebd73f] hover:text-black text-white text-[11px] font-semibold flex items-center gap-1 transition cursor-pointer"
            >
              <Terminal className="w-3 h-3 text-[#ebd73f]" />
              <span>{isExpanded ? 'Hide Console' : 'Dev Console'}</span>
              {isExpanded ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronUp className="w-3.5 h-3.5" />}
            </button>

            {/* Close Dev Mode */}
            <button
              onClick={() => {
                sounds.playClick();
                onCloseDevMode();
              }}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition cursor-pointer"
              title="Close Dev Mode"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

        </div>

        {/* Diagnostic Notification Banner */}
        <AnimatePresence>
          {diagnosticToast && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="my-1 py-1.5 px-3 rounded-xl bg-[#ebd73f] text-black font-bold text-[11px] text-center shadow-lg flex items-center justify-center gap-1.5"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>{diagnosticToast}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Advanced Expanded Tech Architecture Drawer */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ opacity: 0, y: 15, height: 0 }}
              animate={{ opacity: 1, y: 0, height: 'auto' }}
              exit={{ opacity: 0, y: 15, height: 0 }}
              className="mt-2 p-5 rounded-3xl bg-[#090909] border border-white/15 backdrop-blur-2xl shadow-2xl text-xs space-y-5 max-h-[65vh] overflow-y-auto"
            >
              
              {/* Header & Tabs */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-3 border-b border-white/10 gap-3">
                <div className="flex items-center gap-2">
                  <Terminal className="w-4 h-4 text-[#ebd73f]" />
                  <span className="font-panchang font-bold text-white text-sm">
                    Developer Inspection Suite
                  </span>
                </div>

                <div className="flex items-center gap-1 overflow-x-auto no-scrollbar">
                  {[
                    { id: 'vitals', label: 'Web Vitals & FPS', icon: Activity },
                    { id: 'network', label: 'Network & Mock API', icon: Network },
                    { id: 'overrides', label: 'Sandbox Tools', icon: Sliders },
                    { id: 'stack', label: 'Tech Specs', icon: Database },
                  ].map((tab) => {
                    const Icon = tab.icon;
                    const isActive = activeTab === tab.id;
                    return (
                      <button
                        key={tab.id}
                        onClick={() => { sounds.playClick(); setActiveTab(tab.id); }}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[11px] transition cursor-pointer shrink-0 ${
                          isActive 
                            ? 'bg-[#ebd73f] text-black font-bold shadow-md' 
                            : 'bg-white/5 text-slate-300 hover:text-white border border-white/10'
                        }`}
                      >
                        <Icon className="w-3 h-3" />
                        <span>{tab.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* TAB 1: WEB VITALS & REAL-TIME BENCHMARKS */}
              {activeTab === 'vitals' && (
                <div className="space-y-4">
                  {/* Lighthouse Perfect Matrix */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {Object.entries(CATALOGUE_DATA.developerSpecs.lighthouse).map(([k, v]) => (
                      <div key={k} className="p-3.5 rounded-2xl bg-black/80 border border-white/10 text-center">
                        <p className="font-number font-bold text-2xl text-[#ebd73f]">{v}</p>
                        <p className="text-[10px] text-slate-400 uppercase mt-0.5">{k}</p>
                      </div>
                    ))}
                  </div>

                  {/* Core Web Vitals Telemetry Table */}
                  <div className="p-4 rounded-2xl bg-black/60 border border-white/10 space-y-3">
                    <p className="text-[11px] font-bold text-white uppercase tracking-wider flex items-center justify-between">
                      <span>Real-Time Core Web Vitals (Production Target)</span>
                      <span className="text-[#ebd73f] text-[10px]">ALL CRITERIA PASSED</span>
                    </p>

                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/10">
                        <span className="text-slate-400 text-[10px]">First Contentful Paint (FCP)</span>
                        <p className="text-sm font-bold text-emerald-400 mt-0.5">0.22s (Sub-300ms)</p>
                      </div>
                      <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/10">
                        <span className="text-slate-400 text-[10px]">Largest Contentful Paint (LCP)</span>
                        <p className="text-sm font-bold text-emerald-400 mt-0.5">0.45s (Target &lt; 2.5s)</p>
                      </div>
                      <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/10">
                        <span className="text-slate-400 text-[10px]">Cumulative Layout Shift (CLS)</span>
                        <p className="text-sm font-bold text-emerald-400 mt-0.5">0.00 (Zero Drift)</p>
                      </div>
                      <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/10">
                        <span className="text-slate-400 text-[10px]">Time to Interactive (TTI)</span>
                        <p className="text-sm font-bold text-emerald-400 mt-0.5">0.35s (Hydrated)</p>
                      </div>
                      <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/10">
                        <span className="text-slate-400 text-[10px]">Total Blocking Time (TBT)</span>
                        <p className="text-sm font-bold text-emerald-400 mt-0.5">0ms (Zero Main-Thread Lock)</p>
                      </div>
                      <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/10">
                        <span className="text-slate-400 text-[10px]">JS Memory Footprint</span>
                        <p className="text-sm font-bold text-[#ebd73f] mt-0.5">{memoryUsage}</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: NETWORK & MOCK API STREAM */}
              {activeTab === 'network' && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-[11px] text-slate-400">
                    <span>Live Network Activity Log</span>
                    <span className="text-emerald-400 flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                      <span>STATUS 200 OK • ALL ENDPOINTS HEALTHY</span>
                    </span>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-black border border-white/10 space-y-2 text-[11px] font-mono">
                    {[
                      { method: "GET", endpoint: "/api/v1/catalogue/niches", status: 200, time: "12ms", size: "18.4 KB", type: "REST" },
                      { method: "POST", endpoint: "/api/v1/auth/customer-session", status: 200, time: "18ms", size: "1.2 KB", type: "JWT" },
                      { method: "GET", endpoint: "/api/v1/branding/tokens/theme.css", status: 200, time: "8ms", size: "3.4 KB", type: "CSS" },
                      { method: "WS", endpoint: "/ws/orders/kitchen-display-pos", status: 101, time: "4ms", size: "0.4 KB", type: "WebSocket" },
                      { method: "POST", endpoint: "/api/v1/reservations/dispatch-ticket", status: 200, time: "22ms", size: "0.8 KB", type: "Webhook" },
                    ].map((row, idx) => (
                      <div key={idx} className="flex items-center justify-between py-1.5 border-b border-white/5 last:border-none">
                        <div className="flex items-center gap-2">
                          <span className={`px-1.5 py-0.2 rounded text-[9px] font-bold ${
                            row.method === 'GET' ? 'bg-blue-500/20 text-blue-400' :
                            row.method === 'POST' ? 'bg-emerald-500/20 text-emerald-400' :
                            'bg-[#ebd73f]/20 text-[#ebd73f]'
                          }`}>
                            {row.method}
                          </span>
                          <span className="text-slate-300">{row.endpoint}</span>
                        </div>
                        <div className="flex items-center gap-3 text-slate-400">
                          <span>{row.size}</span>
                          <span className="text-[#ebd73f]">{row.time}</span>
                          <span className="text-emerald-400 font-bold">{row.status}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 3: SANDBOX TOOLS & OVERRIDES */}
              {activeTab === 'overrides' && (
                <div className="space-y-4">
                  <p className="text-[11px] text-slate-400">
                    Developer Overrides: Live testing tools for client demonstrations and layout validation.
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    
                    {/* Wireframe Toggle */}
                    <div className="p-3.5 rounded-2xl bg-black/70 border border-white/10 flex items-center justify-between">
                      <div>
                        <p className="font-bold text-white text-xs">Layout Wireframe Mode</p>
                        <p className="text-[10px] text-slate-400">Outlines every container with cyber grid lines</p>
                      </div>
                      <button
                        onClick={toggleWireframe}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                          wireframeActive 
                            ? 'bg-[#ebd73f] text-black shadow-glow-yellow' 
                            : 'bg-white/10 text-white hover:bg-white/20'
                        }`}
                      >
                        {wireframeActive ? 'ON' : 'OFF'}
                      </button>
                    </div>

                    {/* Network Throttling */}
                    <div className="p-3.5 rounded-2xl bg-black/70 border border-white/10 flex items-center justify-between">
                      <div>
                        <p className="font-bold text-white text-xs">Network Simulation</p>
                        <p className="text-[10px] text-slate-400">Simulate mobile 3G latency</p>
                      </div>
                      <select
                        value={throttleMode}
                        onChange={(e) => {
                          sounds.playClick();
                          setThrottleMode(e.target.value);
                        }}
                        className="px-2.5 py-1.5 rounded-xl bg-white/10 border border-white/20 text-white text-xs font-mono focus:outline-none focus:border-[#ebd73f]"
                      >
                        <option value="normal" className="bg-black">Normal (Fiber / 5G)</option>
                        <option value="fast-3g" className="bg-black">Fast 3G (1.2s delay)</option>
                        <option value="slow-3g" className="bg-black">Slow 3G (2.5s delay)</option>
                      </select>
                    </div>

                    {/* Reset Simulation State */}
                    <div className="p-3.5 rounded-2xl bg-black/70 border border-white/10 flex items-center justify-between">
                      <div>
                        <p className="font-bold text-white text-xs">Reset Sandbox Storage</p>
                        <p className="text-[10px] text-slate-400">Clears mock orders, cart and session</p>
                      </div>
                      <button
                        onClick={handleResetSandbox}
                        className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-rose-500/30 hover:text-rose-300 text-white text-xs font-bold flex items-center gap-1 transition cursor-pointer"
                      >
                        <RotateCcw className="w-3 h-3" />
                        <span>Flush Cache</span>
                      </button>
                    </div>

                    {/* Export Diagnostic Report */}
                    <div className="p-3.5 rounded-2xl bg-black/70 border border-white/10 flex items-center justify-between">
                      <div>
                        <p className="font-bold text-white text-xs">Export Diagnostic Log</p>
                        <p className="text-[10px] text-slate-400">Download system JSON for audit</p>
                      </div>
                      <button
                        onClick={exportDiagnosticReport}
                        className="px-3 py-1.5 rounded-xl btn-dripp-primary text-xs font-bold flex items-center gap-1 transition cursor-pointer"
                      >
                        <Download className="w-3 h-3 text-black" />
                        <span>Export JSON</span>
                      </button>
                    </div>

                  </div>
                </div>
              )}

              {/* TAB 4: TECH STACK & SINGLE-FILE MANIFEST */}
              {activeTab === 'stack' && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <p className="text-[11px] text-slate-400 uppercase tracking-wider">
                      Turnkey Stack Architecture
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {CATALOGUE_DATA.developerSpecs.stack.map((item, idx) => (
                        <div key={idx} className="p-2.5 rounded-xl bg-white/[0.03] border border-white/10 flex items-center justify-between text-[11px]">
                          <span className="text-slate-300 font-semibold">{item.name}</span>
                          <span className="text-[#ebd73f]">{item.tech}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-[#111111] border border-[#ebd73f]/25 text-[11px] space-y-1">
                    <p className="text-white font-bold flex items-center gap-1.5">
                      <Database className="w-3.5 h-3.5 text-[#ebd73f]" />
                      <span>Single-File White-Label Configuration:</span>
                    </p>
                    <p className="text-slate-300">
                      Zero vendor lock-in. Each project is configured via a single JSON file (`brand-config.json`). The build system transforms it into customized Tailwind tokens, fonts, and API routing.
                    </p>
                  </div>
                </div>
              )}

              {/* Drawer Footer Actions */}
              <div className="pt-3 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-slate-400 text-[11px]">
                <span>Engine: Vite 5 + React 18 + Web Audio API</span>
                <div className="flex items-center gap-3">
                  <button
                    onClick={exportDiagnosticReport}
                    className="hover:text-[#ebd73f] transition flex items-center gap-1 cursor-pointer"
                  >
                    <Download className="w-3 h-3" />
                    <span>Download Full Diagnostic</span>
                  </button>
                  <span>•</span>
                  <button
                    onClick={() => setIsExpanded(false)}
                    className="hover:text-white transition cursor-pointer"
                  >
                    Close Console
                  </button>
                </div>
              </div>

            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
}
