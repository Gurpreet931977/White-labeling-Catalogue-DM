import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  QrCode, 
  Camera, 
  CheckCircle2, 
  ArrowRight, 
  Volume2, 
  VolumeX, 
  Volume1, 
  Sparkles,
  Zap,
  RefreshCw,
  Upload,
  AlertCircle,
  Monitor,
  Smartphone,
  Users,
  Check,
  Copy,
  ExternalLink,
  Store,
  Truck,
  MapPin,
  UtensilsCrossed,
  Info
} from 'lucide-react';
import jsQR from 'jsqr';
import { CAFE_CONFIG, BRAND_CONFIG } from '../../data/cafeConfig';
import { useCart } from '../../context/CartContext';
import { useOrder } from '../../context/OrderContext';
import { useTheme } from '../../context/ThemeContext';
import { sounds } from '../../utils/audio';
import { useScanAudio } from '../../utils/scanSound';
import { 
  parseTableNumberFromText, 
  generateQRCodeDataUrl, 
  getTableOrderUrl 
} from '../../utils/qrCode';

// Device Detection Helper
const isDesktopDevice = () => {
  if (typeof window === 'undefined') return true;
  const isMobileUA = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  return window.innerWidth >= 768 && !isMobileUA;
};

// Dining Zones for PC Table Map
const TABLE_ZONES = [
  { id: 'all', label: 'All Tables (12)' },
  { id: 'main', label: 'Main Dining' },
  { id: 'patio', label: 'Garden Patio' },
  { id: 'lounge', label: 'VIP Lounge' }
];

// Rich Table Metadata
const TABLES_METADATA = [
  { number: 1, name: 'Table 01', capacity: 2, zone: 'main', zoneName: 'Main Dining Hall', desc: 'Window-side two-seater, warm ambient glow' },
  { number: 2, name: 'Table 02', capacity: 4, zone: 'main', zoneName: 'Main Dining Hall', desc: 'Center family table near espresso bar' },
  { number: 3, name: 'Table 03', capacity: 6, zone: 'main', zoneName: 'Main Dining Hall', desc: 'Spacious dining table, acoustic warmth' },
  { number: 4, name: 'Table 04', capacity: 4, zone: 'main', zoneName: 'Main Dining Hall', desc: 'Bistro booth with charging power plugs' },
  { number: 5, name: 'Table 05', capacity: 2, zone: 'patio', zoneName: 'Garden Patio', desc: 'Open-air balcony two-seater, terrace view' },
  { number: 6, name: 'Table 06', capacity: 8, zone: 'patio', zoneName: 'Garden Patio', desc: 'Long cedarwood communal table' },
  { number: 7, name: 'Table 07', capacity: 4, zone: 'patio', zoneName: 'Garden Patio', desc: 'Patio gazebo seating with garden breeze' },
  { number: 8, name: 'Table 08', capacity: 6, zone: 'patio', zoneName: 'Garden Patio', desc: 'Pergola dining with highway panorama' },
  { number: 9, name: 'Table 09', capacity: 4, zone: 'lounge', zoneName: 'VIP Lounge', desc: 'Velvet booth, soft jazz acoustic zone' },
  { number: 10, name: 'Table 10', capacity: 4, zone: 'lounge', zoneName: 'VIP Lounge', desc: 'Corner plush lounge booth' },
  { number: 11, name: 'Table 11', capacity: 2, zone: 'lounge', zoneName: 'VIP Lounge', desc: 'Private intimate cocktail booth' },
  { number: 12, name: 'Table 12', capacity: 10, zone: 'lounge', zoneName: 'VIP Lounge', desc: 'Executive master banquet table' }
];

export function QRScannerModal({ isOpen, onClose, onScanComplete }) {
  const { activeTable, setActiveTable, setDiningMode } = useCart();
  const { tables = [], getTableOccupancy, serviceRequests = [] } = useOrder();
  const { isLight } = useTheme();
  
  // Dual Mode: 'manual' (PC / Desktop default) vs 'camera' (Mobile phone default)
  const [scanMode, setScanMode] = useState(() => isDesktopDevice() ? 'manual' : 'camera');
  const [selectedZone, setSelectedZone] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all'); // 'all' | 'vacant' | 'busy'
  const [manualTableNumber, setManualTableNumber] = useState('');
  const [previewStandeeTable, setPreviewStandeeTable] = useState(null);
  const [standeeQrUrl, setStandeeQrUrl] = useState('');
  const [copiedLink, setCopiedLink] = useState(false);

  // Camera & Scan States
  const [cameraActive, setCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState(null);
  const [facingMode, setFacingMode] = useState('environment'); // 'environment' | 'user'
  const [isScanning, setIsScanning] = useState(true);
  const [scannedTable, setScannedTable] = useState(null);
  const [audioChimeFired, setAudioChimeFired] = useState(false);
  const [showVolumeControls, setShowVolumeControls] = useState(false);

  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const fileInputRef = useRef(null);
  const animationFrameId = useRef(null);
  const streamRef = useRef(null);

  // Audio Engine Hook
  const { playScanSuccess, isMuted, toggleMute, volume, setVolume, initAudio } = useScanAudio();

  // Stop camera helper
  const stopCamera = () => {
    if (animationFrameId.current) {
      cancelAnimationFrame(animationFrameId.current);
      animationFrameId.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setCameraActive(false);
  };

  // Start live camera stream (ONLY called if user selects 'camera' mode)
  const startCamera = async (mode = facingMode) => {
    stopCamera();
    setCameraError(null);
    setIsScanning(true);
    setScannedTable(null);

    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Camera not supported by this browser.');
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: { ideal: mode },
          width: { ideal: 1280 },
          height: { ideal: 720 }
        },
        audio: false
      });

      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.setAttribute('playsinline', 'true');
        await videoRef.current.play();
        setCameraActive(true);
        startScanLoop();
      }
    } catch (err) {
      console.warn('Camera stream could not be started:', err.message);
      setCameraError(err.name === 'NotAllowedError' 
        ? 'Camera permission denied. On desktop/PC, please use the Manual Table Selector below.' 
        : 'Camera unavailable on this device. Please use the Manual Table Selector below.'
      );
      setCameraActive(false);
    }
  };

  // Real-time video frame scanning loop using jsQR
  const startScanLoop = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;

    const ctx = canvas.getContext('2d', { willReadFrequently: true });

    const scanFrame = () => {
      if (!video || video.readyState !== video.HAVE_ENOUGH_DATA) {
        animationFrameId.current = requestAnimationFrame(scanFrame);
        return;
      }

      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const code = jsQR(imageData.data, imageData.width, imageData.height, {
        inversionAttempts: 'dontInvert'
      });

      if (code && code.data) {
        handleSuccessfulQR(code.data);
        return;
      }

      animationFrameId.current = requestAnimationFrame(scanFrame);
    };

    animationFrameId.current = requestAnimationFrame(scanFrame);
  };

  // Handle scanned QR payload
  const handleSuccessfulQR = (data) => {
    const tableNum = parseTableNumberFromText(data);

    if (tableNum) {
      handleCompleteTableConnection(tableNum);
    } else {
      initAudio();
      sounds.playClick();
      setIsScanning(false);
      setTimeout(() => {
        setIsScanning(true);
        startScanLoop();
      }, 1500);
    }
  };

  // Connect table and trigger success alert
  const handleCompleteTableConnection = (tableNum) => {
    stopCamera();
    initAudio();
    setIsScanning(false);
    setScannedTable(tableNum);
    setActiveTable(tableNum);
    setDiningMode('table');

    playScanSuccess();
    setAudioChimeFired(true);

    setTimeout(() => {
      if (onScanComplete) onScanComplete(tableNum);
      onClose();
    }, 1000);
  };

  // Scan QR from an uploaded photo or image file
  const handleQrFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    initAudio();
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0);

        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const code = jsQR(imageData.data, imageData.width, imageData.height);

        if (code && code.data) {
          handleSuccessfulQR(code.data);
        } else {
          alert('No readable QR code found in this image. Please select your table manually.');
        }
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  // Flip camera between back/front
  const handleFlipCamera = () => {
    sounds.playClick();
    const nextMode = facingMode === 'environment' ? 'user' : 'environment';
    setFacingMode(nextMode);
    startCamera(nextMode);
  };

  // Generate QR standee preview when requested
  useEffect(() => {
    if (!previewStandeeTable) {
      setStandeeQrUrl('');
      return;
    }
    let active = true;
    const url = getTableOrderUrl(previewStandeeTable);
    generateQRCodeDataUrl(url, {
      width: 260,
      margin: 1,
      color: { dark: '#12100E', light: '#FFFFFF' }
    })
      .then((dataUrl) => {
        if (active) setStandeeQrUrl(dataUrl);
      })
      .catch((err) => console.error('Standee QR error:', err));

    return () => { active = false; };
  }, [previewStandeeTable]);

  // Handle modal open/close & mode lifecycle
  useEffect(() => {
    if (isOpen) {
      initAudio();
      // On PC, default to manual table selector unless explicitly changed
      const defaultMode = isDesktopDevice() ? 'manual' : 'camera';
      setScanMode(defaultMode);

      if (defaultMode === 'camera') {
        startCamera(facingMode);
      } else {
        stopCamera();
      }
    } else {
      stopCamera();
      setPreviewStandeeTable(null);
      setScannedTable(null);
    }
    return () => stopCamera();
  }, [isOpen]);

  // Dynamic tables list from OrderContext (with fallback to TABLES_METADATA)
  const activeTablesList = useMemo(() => {
    if (tables && tables.length > 0) return tables;
    return TABLES_METADATA;
  }, [tables]);

  // Compute live occupancy for all tables
  const tablesWithOccupancy = useMemo(() => {
    return activeTablesList.map(t => {
      const occ = getTableOccupancy ? getTableOccupancy(t.number) : { isBusy: false, status: 'vacant' };
      const hasCall = serviceRequests?.some(r => r.tableNumber === t.number);
      const isBusy = occ.isBusy || hasCall;
      return {
        ...t,
        occupancy: occ,
        hasCall,
        isBusy
      };
    });
  }, [activeTablesList, getTableOccupancy, serviceRequests]);

  const totalCount = tablesWithOccupancy.length;
  const vacantCount = tablesWithOccupancy.filter(t => !t.isBusy).length;
  const busyCount = tablesWithOccupancy.filter(t => t.isBusy).length;

  // Filtered tables by zone and status
  const filteredTables = useMemo(() => {
    return tablesWithOccupancy.filter(t => {
      if (selectedZone !== 'all' && t.zone !== selectedZone) return false;
      if (statusFilter === 'vacant' && t.isBusy) return false;
      if (statusFilter === 'busy' && !t.isBusy) return false;
      return true;
    });
  }, [tablesWithOccupancy, selectedZone, statusFilter]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/75 backdrop-blur-md overflow-hidden font-sans">
        {/* Tap backdrop to close */}
        <div className="absolute inset-0 -z-10" onClick={() => { stopCamera(); onClose(); }} />

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 40 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className={`relative w-full max-w-2xl rounded-t-[32px] sm:rounded-3xl p-5 sm:p-7 shadow-2xl overflow-y-auto max-h-[94vh] sm:max-h-[92vh] border transition-colors flex flex-col ${
            isLight 
              ? 'bg-[#FAF7F2] text-[#12100E] border-[#E8E2D5]' 
              : 'bg-[#141210] text-[#FAF7F2] border-white/10'
          }`}
        >
          {/* Mobile Sheet Drag Indicator */}
          <div className="sm:hidden pt-0 pb-2 flex justify-center shrink-0">
            <div className="w-12 h-1.5 bg-stone-400/50 rounded-full" />
          </div>
          {/* Top Control Bar: Audio Settings + Close Button */}
          <div className="absolute top-5 right-5 flex items-center gap-2 z-20">
            {/* Sound Volume / Mute Widget */}
            <div className="relative">
              <button
                type="button"
                onClick={() => {
                  initAudio();
                  setShowVolumeControls(!showVolumeControls);
                }}
                className={`p-2 rounded-xl border transition cursor-pointer ${
                  isLight
                    ? 'border-stone-200 text-stone-600 hover:text-black hover:bg-stone-100'
                    : 'border-white/10 text-stone-400 hover:text-white hover:bg-white/5'
                }`}
                title={isMuted ? 'Scan sound muted' : `Scan sound volume: ${Math.round(volume * 100)}%`}
              >
                {isMuted ? (
                  <VolumeX className="w-4 h-4 text-[#D04834]" />
                ) : volume < 0.5 ? (
                  <Volume1 className="w-4 h-4 text-[#D04834]" />
                ) : (
                  <Volume2 className="w-4 h-4 text-[#D04834]" />
                )}
              </button>

              {/* Expandable Audio Settings Popover */}
              <AnimatePresence>
                {showVolumeControls && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9, y: 5 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: 5 }}
                    className={`absolute right-0 top-11 z-30 w-56 p-3.5 rounded-2xl border shadow-xl space-y-2.5 font-sans ${
                      isLight ? 'bg-white border-stone-200 text-[#12100E]' : 'bg-[#1C1917] border-white/10 text-white'
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-mono font-bold flex items-center gap-1 text-[#D04834]">
                        <Zap className="w-3.5 h-3.5" />
                        SCAN AUDIO
                      </span>
                      <button
                        type="button"
                        onClick={toggleMute}
                        className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold transition ${
                          isMuted ? 'bg-rose-500/10 text-rose-600' : 'bg-stone-100 text-stone-700'
                        }`}
                      >
                        {isMuted ? 'UNMUTE' : 'MUTE'}
                      </button>
                    </div>

                    <div className="space-y-1">
                      <div className="flex justify-between text-[10px] font-mono opacity-70">
                        <span>Volume:</span>
                        <span className="font-bold">{Math.round(volume * 100)}%</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.05"
                        value={isMuted ? 0 : volume}
                        disabled={isMuted}
                        onChange={(e) => {
                          initAudio();
                          setVolume(e.target.value);
                        }}
                        className="w-full h-1.5 bg-stone-200 dark:bg-stone-800 rounded-lg appearance-none cursor-pointer accent-[#D04834]"
                      />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Close button */}
            <button
              onClick={() => { sounds.playClick(); onClose(); }}
              className={`p-2 rounded-xl border transition-all cursor-pointer ${
                isLight 
                  ? 'border-stone-200 text-stone-500 hover:text-black hover:bg-stone-100' 
                  : 'border-white/10 text-stone-400 hover:text-white hover:bg-white/5'
              }`}
              aria-label="Close"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Modal Masthead */}
          <div className="mb-5 pr-16 text-left">
            <div className="flex items-center gap-2">
              <span className={`text-[10px] font-mono uppercase tracking-widest px-2.5 py-0.5 rounded-full border ${
                isLight 
                  ? 'bg-stone-100 border-stone-200 text-stone-600' 
                  : 'bg-white/5 border-white/10 text-stone-400'
              }`}>
                Dine-In Service // Table Station
              </span>
              {isDesktopDevice() && (
                <span className="hidden sm:inline-flex items-center gap-1 text-[10px] font-mono text-[#D04834] font-semibold">
                  <Monitor className="w-3 h-3" /> Desktop Optimized
                </span>
              )}
            </div>
            <h3 className="text-2xl sm:text-3xl font-editorial tracking-tight font-normal mt-2">
              Select Dining Table
            </h3>
            <p className={`text-xs mt-1 ${isLight ? 'text-stone-500' : 'text-stone-400'}`}>
              Link your order to a table seat for seamless kitchen delivery, or scan an acrylic table plaque.
            </p>
          </div>

          {/* Boutique Mode Switcher Segmented Control */}
          <div className={`flex items-center p-1 rounded-2xl border mb-5 shrink-0 transition-colors ${
            isLight ? 'bg-stone-100 border-stone-200/80' : 'bg-white/5 border-white/10'
          }`}>
            <button
              type="button"
              onClick={() => {
                sounds.playClick();
                setScanMode('manual');
                stopCamera();
              }}
              className={`flex-1 py-2 px-3 rounded-xl text-xs font-mono font-bold flex items-center justify-center gap-2 transition cursor-pointer ${
                scanMode === 'manual'
                  ? isLight
                    ? 'bg-[#12100E] text-[#FAF7F2] shadow-sm'
                    : 'bg-[#FAF7F2] text-[#12100E] shadow-sm'
                  : isLight
                  ? 'text-stone-500 hover:text-black'
                  : 'text-stone-400 hover:text-white'
              }`}
            >
              <Monitor className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Table Selector (PC Mode)</span>
              <span className="sm:hidden">Choose Table</span>
              {isDesktopDevice() && (
                <span className={`text-[9px] px-1.5 py-0.2 rounded font-bold uppercase hidden md:inline ${
                  scanMode === 'manual' 
                    ? isLight ? 'bg-white/20 text-white' : 'bg-black/15 text-black' 
                    : 'bg-stone-200 dark:bg-stone-800 text-stone-600 dark:text-stone-300'
                }`}>
                  Instant
                </span>
              )}
            </button>

            <button
              type="button"
              onClick={() => {
                sounds.playClick();
                setScanMode('camera');
                startCamera(facingMode);
              }}
              className={`flex-1 py-2 px-3 rounded-xl text-xs font-mono font-bold flex items-center justify-center gap-2 transition cursor-pointer ${
                scanMode === 'camera'
                  ? isLight
                    ? 'bg-[#12100E] text-[#FAF7F2] shadow-sm'
                    : 'bg-[#FAF7F2] text-[#12100E] shadow-sm'
                  : isLight
                  ? 'text-stone-500 hover:text-black'
                  : 'text-stone-400 hover:text-white'
              }`}
            >
              <Camera className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Camera QR Scanner</span>
              <span className="sm:hidden">Scan QR</span>
            </button>
          </div>

          {/* Hidden Canvas for QR frame processing */}
          <canvas ref={canvasRef} className="hidden" />

          {/* ========================================================================= */}
          {/* TAB 1: BOUTIQUE PC TABLE STATION SELECTOR                                 */}
          {/* ========================================================================= */}
          {scanMode === 'manual' ? (
            <div className="flex-1 overflow-y-auto space-y-4 pr-1">
              {/* Active Table Status Banner */}
              <div className={`p-3 rounded-2xl border flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 text-xs font-mono transition-colors ${
                isLight ? 'bg-white border-[#E8E2D5]' : 'bg-[#1C1917] border-white/10'
              }`}>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0"></span>
                  <span className={isLight ? 'text-stone-600' : 'text-stone-300'}>
                    Click any table below to link your order directly to the kitchen.
                  </span>
                </div>
                <span className="text-[11px] font-bold text-[#D04834] px-2.5 py-0.5 rounded-lg border border-[#D04834]/30 bg-[#D04834]/10 shrink-0 self-start sm:self-auto">
                  Active: Table #{activeTable || '04'}
                </span>
              </div>

              {/* Live Occupancy Status & Zone Filter Pills */}
              <div className="space-y-2">
                {/* Status Pills */}
                <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5 scrollbar-none">
                  {[
                    { id: 'all', label: `All Tables (${totalCount})` },
                    { id: 'vacant', label: `🟢 Vacant (${vacantCount})` },
                    { id: 'busy', label: `🔴 Busy (${busyCount})` }
                  ].map(tab => (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => { sounds.playClick(); setStatusFilter(tab.id); }}
                      className={`px-3 py-1 rounded-xl text-xs font-mono transition cursor-pointer shrink-0 border ${
                        statusFilter === tab.id
                          ? 'bg-[#12100E] text-white dark:bg-white dark:text-black font-bold shadow-xs border-transparent'
                          : isLight
                          ? 'bg-white border-stone-200 text-stone-600 hover:border-stone-400'
                          : 'bg-[#1C1917] border-white/10 text-stone-400 hover:text-white'
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>

                {/* Zone Pills */}
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-[11px]">
                  {TABLE_ZONES.map((z) => (
                    <button
                      key={z.id}
                      type="button"
                      onClick={() => { sounds.playClick(); setSelectedZone(z.id); }}
                      className={`px-2.5 py-0.5 rounded-lg text-[11px] font-mono transition cursor-pointer shrink-0 border ${
                        selectedZone === z.id
                          ? isLight
                            ? 'bg-stone-200 text-stone-900 border-stone-300 font-bold'
                            : 'bg-white/20 text-white border-white/30 font-bold'
                          : isLight
                          ? 'bg-stone-50 border-stone-200 text-stone-500 hover:border-stone-300'
                          : 'bg-white/5 border-white/5 text-stone-400 hover:text-white'
                      }`}
                    >
                      <span>{z.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Interactive Table Cards Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-h-[300px] sm:max-h-[330px] overflow-y-auto pr-1">
                {filteredTables.map((t) => {
                  const isSelected = activeTable === t.number;
                  let badge = { text: '🟢 VACANT', bg: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30' };

                  if (isSelected) {
                    badge = { text: 'ACTIVE', bg: 'bg-[#D04834] text-white border-transparent' };
                  } else if (t.isBusy) {
                    if (t.occupancy?.status === 'served_dining') {
                      badge = { text: `🍽️ DINING (${t.occupancy.remainingMins}m)`, bg: 'bg-cyan-500/20 text-cyan-600 dark:text-cyan-300 border-cyan-500/30' };
                    } else if (t.occupancy?.stage === 'cooking') {
                      badge = { text: '🔥 PREP', bg: 'bg-amber-500/20 text-amber-700 dark:text-amber-300 border-amber-500/30' };
                    } else if (t.occupancy?.stage === 'ready') {
                      badge = { text: '🛎️ READY', bg: 'bg-cyan-500/20 text-cyan-700 dark:text-cyan-300 border-cyan-500/30' };
                    } else {
                      badge = { text: '🔴 BUSY', bg: 'bg-rose-500/15 text-rose-600 dark:text-rose-400 border-rose-500/30' };
                    }
                  }

                  return (
                    <div
                      key={t.number}
                      className={`p-3.5 rounded-2xl border transition-all text-left flex flex-col justify-between relative group ${
                        isSelected
                          ? isLight
                            ? 'bg-white border-[#D04834] shadow-md ring-1 ring-[#D04834]'
                            : 'bg-[#1C1917] border-[#D04834] shadow-md ring-1 ring-[#D04834]'
                          : t.isBusy
                          ? isLight
                            ? 'bg-[#FCFAF7] border-amber-200/80 shadow-xs'
                            : 'bg-[#181513] border-white/10'
                          : isLight
                          ? 'bg-white border-[#E8E2D5] hover:border-stone-400 hover:shadow-xs'
                          : 'bg-[#1C1917] border-white/10 hover:border-white/20'
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between gap-1">
                          <span className="font-mono text-sm font-bold tracking-tight">
                            T-{t.number < 10 ? `0${t.number}` : t.number}
                          </span>
                          <span className={`text-[9px] font-mono px-2 py-0.5 rounded-full font-bold uppercase border ${badge.bg}`}>
                            {badge.text}
                          </span>
                        </div>

                        <h4 className="text-base font-editorial font-normal mt-1.5">{t.name}</h4>
                        <p className={`text-[11px] font-mono flex items-center gap-1 mt-0.5 ${isLight ? 'text-stone-500' : 'text-stone-400'}`}>
                          <Users className="w-3 h-3 text-[#D04834]" />
                          <span>Seats {t.capacity} Guests • {t.zoneName || 'Dining'}</span>
                        </p>
                        <p className={`text-[10px] line-clamp-1 mt-1 ${isLight ? 'text-stone-400' : 'text-stone-500'}`}>
                          {t.isBusy && !isSelected ? 'Dining party seated' : (t.desc || 'Available for seating')}
                        </p>
                      </div>

                      <div className={`pt-2.5 mt-2.5 border-t flex items-center gap-2 ${
                        isLight ? 'border-stone-100' : 'border-white/5'
                      }`}>
                        <button
                          type="button"
                          onClick={() => {
                            if (t.isBusy && !isSelected) {
                              sounds.playClick();
                              const proceed = window.confirm(`Table #${t.number} is currently occupied by another dining party. Link to Table #${t.number} anyway?`);
                              if (!proceed) return;
                            }
                            handleCompleteTableConnection(t.number);
                          }}
                          className={`flex-1 py-1.5 px-2 rounded-xl text-xs font-syne font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
                            isSelected
                              ? 'bg-[#D04834] text-white shadow-xs'
                              : t.isBusy
                              ? isLight
                                ? 'bg-amber-100 hover:bg-amber-200 text-amber-900'
                                : 'bg-amber-950/40 hover:bg-amber-900/60 text-amber-200'
                              : isLight
                              ? 'bg-[#12100E] hover:bg-stone-800 text-white'
                              : 'bg-white hover:bg-stone-200 text-black'
                          }`}
                        >
                          <Check className="w-3 h-3" />
                          <span>{isSelected ? 'Bound' : t.isBusy ? 'Occupied' : 'Select'}</span>
                        </button>

                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            sounds.playClick();
                            setPreviewStandeeTable(t.number);
                          }}
                          className={`p-1.5 rounded-xl border transition cursor-pointer ${
                            isLight 
                              ? 'border-stone-200 text-stone-600 hover:text-black hover:bg-stone-100' 
                              : 'border-white/10 text-stone-400 hover:text-white hover:bg-white/5'
                          }`}
                          title="Preview scannable QR standee to test scanning with phone"
                        >
                          <QrCode className="w-3.5 h-3.5 text-[#D04834]" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Direct Table Number Input & Alternative Modes */}
              <div className={`pt-3 border-t flex flex-col sm:flex-row items-center justify-between gap-3 ${
                isLight ? 'border-stone-200' : 'border-white/10'
              }`}>
                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <span className={`text-xs font-mono ${isLight ? 'text-stone-600' : 'text-stone-400'}`}>
                    Enter Table #:
                  </span>
                  <input
                    type="number"
                    min="1"
                    max={totalCount || 12}
                    placeholder={`1-${totalCount || 12}`}
                    value={manualTableNumber}
                    onChange={(e) => setManualTableNumber(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        const num = parseInt(manualTableNumber, 10);
                        if (num >= 1 && num <= (totalCount || 12)) handleCompleteTableConnection(num);
                      }
                    }}
                    className={`w-16 px-2.5 py-1.5 rounded-xl border font-mono text-center text-xs focus:outline-none transition ${
                      isLight 
                        ? 'bg-white border-stone-300 text-stone-900 focus:border-[#12100E]' 
                        : 'bg-[#1C1917] border-white/15 text-white focus:border-white/40'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => {
                      const num = parseInt(manualTableNumber, 10);
                      if (num >= 1 && num <= 12) handleCompleteTableConnection(num);
                      else alert('Please enter a valid table number between 1 and 12');
                    }}
                    className={`px-3 py-1.5 rounded-xl font-syne font-bold text-xs cursor-pointer transition shadow-xs ${
                      isLight ? 'bg-[#12100E] text-white hover:bg-stone-800' : 'bg-white text-black hover:bg-stone-200'
                    }`}
                  >
                    Set Table
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      sounds.playClick();
                      setActiveTable(null);
                      setDiningMode('counter');
                      if (onScanComplete) onScanComplete('counter');
                      onClose();
                    }}
                    className={`px-3 py-1.5 rounded-xl text-xs font-mono border transition flex items-center gap-1.5 cursor-pointer ${
                      isLight 
                        ? 'bg-white border-stone-200 text-stone-700 hover:border-stone-400' 
                        : 'bg-white/5 border-white/10 text-stone-300 hover:text-white'
                    }`}
                  >
                    <Store className="w-3.5 h-3.5 text-[#D04834]" />
                    <span>Counter Pickup</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      sounds.playClick();
                      setActiveTable(null);
                      setDiningMode('delivery');
                      if (onScanComplete) onScanComplete('delivery');
                      onClose();
                    }}
                    className={`px-3 py-1.5 rounded-xl text-xs font-mono border transition flex items-center gap-1.5 cursor-pointer ${
                      isLight 
                        ? 'bg-white border-stone-200 text-stone-700 hover:border-stone-400' 
                        : 'bg-white/5 border-white/10 text-stone-300 hover:text-white'
                    }`}
                  >
                    <Truck className="w-3.5 h-3.5 text-[#D04834]" />
                    <span>Doorstep Delivery</span>
                  </button>
                </div>
              </div>
            </div>
          ) : (
            /* ========================================================================= */
            /* TAB 2: ARTISANAL CAMERA SCANNER VIEWPORT                                  */
            /* ========================================================================= */
            <div className="space-y-4">
              <div className="relative w-full h-64 bg-stone-950 rounded-3xl border-2 border-stone-900 overflow-hidden flex flex-col items-center justify-center select-none shadow-inner">
                <video
                  ref={videoRef}
                  playsInline
                  muted
                  className={`w-full h-full object-cover transition-opacity duration-300 ${
                    cameraActive && !scannedTable ? 'opacity-100' : 'opacity-0'
                  }`}
                />

                {/* Boutique Targeting Reticle */}
                {cameraActive && !scannedTable && (
                  <div className="absolute inset-0 pointer-events-none flex flex-col items-center justify-center p-6">
                    <div className="relative w-48 h-48 border-2 border-[#D04834]/40 rounded-3xl flex items-center justify-center shadow-[0_0_30px_rgba(208,72,52,0.15)]">
                      {/* Terracotta Corner Brackets */}
                      <div className="absolute -top-1 -left-1 w-5 h-5 border-t-2 border-l-2 border-[#D04834]" />
                      <div className="absolute -top-1 -right-1 w-5 h-5 border-t-2 border-r-2 border-[#D04834]" />
                      <div className="absolute -bottom-1 -left-1 w-5 h-5 border-b-2 border-l-2 border-[#D04834]" />
                      <div className="absolute -bottom-1 -right-1 w-5 h-5 border-b-2 border-r-2 border-[#D04834]" />

                      {/* Scanning Beam */}
                      <motion.div
                        animate={{ y: [-70, 70, -70] }}
                        transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
                        className="w-full h-0.5 bg-gradient-to-r from-transparent via-[#D04834] to-transparent shadow-[0_0_12px_#D04834]"
                      />
                    </div>

                    <div className="absolute bottom-3 px-3 py-1 rounded-full bg-black/70 backdrop-blur-sm border border-white/10">
                      <span className="text-[11px] font-mono text-[#FAF7F2] flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-[#D04834] animate-ping" />
                        Scanning Table QR Plaque...
                      </span>
                    </div>
                  </div>
                )}

                {/* Camera Inactive / PC Recommendation Notification */}
                {!cameraActive && !scannedTable && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center bg-stone-950/95 z-10 space-y-3">
                    <Camera className="w-10 h-10 text-stone-600 mb-1" />
                    <p className="text-xs font-mono text-stone-300 max-w-sm leading-relaxed">
                      {cameraError || 'Camera stream inactive.'}
                    </p>
                    <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
                      <button
                        type="button"
                        onClick={() => {
                          sounds.playClick();
                          setScanMode('manual');
                          stopCamera();
                        }}
                        className="px-4 py-2 rounded-xl bg-[#D04834] hover:bg-[#b83b29] text-white text-xs font-syne font-bold flex items-center gap-1.5 cursor-pointer shadow-sm"
                      >
                        <Monitor className="w-3.5 h-3.5" />
                        <span>Use PC Table Selector</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => startCamera(facingMode)}
                        className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-white border border-white/20 text-xs font-mono flex items-center gap-1.5 cursor-pointer"
                      >
                        <RefreshCw className="w-3.5 h-3.5" /> Retry Camera
                      </button>
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-white border border-white/20 text-xs font-mono flex items-center gap-1.5 cursor-pointer"
                      >
                        <Upload className="w-3.5 h-3.5" /> Upload QR Image
                      </button>
                    </div>
                  </div>
                )}

                {/* Floating Controls */}
                {cameraActive && !scannedTable && (
                  <div className="absolute bottom-3 right-3 flex items-center gap-1.5 z-10">
                    <button
                      type="button"
                      onClick={handleFlipCamera}
                      className="p-2.5 rounded-xl bg-black/70 hover:bg-black/90 text-white backdrop-blur-sm border border-white/20 transition cursor-pointer"
                      title="Flip camera"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="p-2.5 rounded-xl bg-black/70 hover:bg-black/90 text-white backdrop-blur-sm border border-white/20 transition cursor-pointer"
                      title="Upload QR Image"
                    >
                      <Upload className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
              </div>

              {/* Quick Fallback Table Buttons */}
              <div className="pt-1">
                <span className={`text-[10px] font-mono uppercase tracking-wider block mb-2 font-bold ${
                  isLight ? 'text-stone-500' : 'text-stone-400'
                }`}>
                  Or Tap Table Directly:
                </span>
                <div className="grid grid-cols-4 gap-2">
                  {CAFE_CONFIG.tables.map((t) => (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => handleCompleteTableConnection(t.number)}
                      className={`py-2 px-2 rounded-xl text-xs font-mono font-bold transition border cursor-pointer ${
                        activeTable === t.number
                          ? 'bg-[#D04834] text-white border-[#D04834] shadow-xs'
                          : isLight
                          ? 'bg-white border-stone-200 text-stone-700 hover:border-stone-400'
                          : 'bg-[#1C1917] border-white/10 text-stone-300 hover:text-white'
                      }`}
                    >
                      <span>T-{t.number < 10 ? `0${t.number}` : t.number}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Hidden File Input for QR Image upload */}
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleQrFileUpload}
            accept="image/*"
            className="hidden"
          />

          {/* ========================================================================= */}
          {/* SUCCESS OVERLAY ON TABLE CONNECTION                                      */}
          {/* ========================================================================= */}
          {scannedTable && (
            <div className="absolute inset-0 bg-[#12100E]/95 backdrop-blur-md flex flex-col items-center justify-center text-center p-6 z-30">
              {audioChimeFired && (
                <motion.div
                  initial={{ scale: 0.8, opacity: 1 }}
                  animate={{ scale: 2.4, opacity: 0 }}
                  transition={{ duration: 0.7, ease: 'easeOut' }}
                  className="absolute w-24 h-24 rounded-full border-2 border-emerald-400 pointer-events-none"
                />
              )}
              <motion.div
                initial={{ scale: 0.4, rotate: -20 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: 'spring', stiffness: 400, damping: 14 }}
              >
                <CheckCircle2 className="w-16 h-16 text-emerald-400 mb-3 drop-shadow-[0_0_20px_rgba(52,211,153,0.5)]" />
              </motion.div>
              <h4 className="text-3xl font-editorial font-normal text-white">
                Table #{scannedTable} Connected
              </h4>
              <p className="text-emerald-400 text-xs font-mono mt-1">
                Contactless dining session active &bull; Kitchen POS ticket linked
              </p>
            </div>
          )}

          {/* ========================================================================= */}
          {/* AUTHENTIC ACRYLIC STANDEE PREVIEW (For PC Users Testing Phone Scan)       */}
          {/* ========================================================================= */}
          {previewStandeeTable && (
            <div className={`absolute inset-0 z-30 backdrop-blur-md p-6 flex flex-col items-center justify-center text-center transition-colors ${
              isLight ? 'bg-[#FAF7F2]/95 text-[#12100E]' : 'bg-[#12100E]/95 text-white'
            }`}>
              <button
                type="button"
                onClick={() => setPreviewStandeeTable(null)}
                className={`absolute top-5 right-5 p-2 rounded-xl border transition cursor-pointer ${
                  isLight ? 'border-stone-200 text-stone-600 hover:bg-stone-100' : 'border-white/10 text-stone-400 hover:bg-white/5'
                }`}
              >
                <X className="w-4 h-4" />
              </button>

              <span className="text-[10px] font-mono uppercase tracking-widest text-[#D04834] font-bold">
                PHYSICAL STANDEE // REAL SCANNABLE QR
              </span>
              <h3 className="text-2xl font-editorial font-normal mt-1">
                Table #{previewStandeeTable < 10 ? `0${previewStandeeTable}` : previewStandeeTable} Acrylic Plaque
              </h3>
              <p className={`text-xs mt-0.5 max-w-sm ${isLight ? 'text-stone-500' : 'text-stone-400'}`}>
                Point your mobile phone's camera at this screen to test live contactless ordering on your phone!
              </p>

              <div className="p-4 bg-white rounded-3xl border-4 border-stone-900 shadow-xl my-4 flex flex-col items-center">
                {standeeQrUrl ? (
                  <img src={standeeQrUrl} alt="Table QR" className="w-44 h-44 object-contain rounded-lg" />
                ) : (
                  <div className="w-44 h-44 flex items-center justify-center text-stone-500 font-mono text-xs">
                    Generating QR...
                  </div>
                )}
                <span className="font-mono text-stone-950 font-bold text-xs tracking-widest mt-2 bg-stone-100 px-3 py-1 rounded-full border border-stone-300">
                  TABLE #{previewStandeeTable < 10 ? `0${previewStandeeTable}` : previewStandeeTable}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    handleCompleteTableConnection(previewStandeeTable);
                    setPreviewStandeeTable(null);
                  }}
                  className={`px-4 py-2 rounded-xl font-syne font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-sm ${
                    isLight ? 'bg-[#12100E] text-white hover:bg-stone-800' : 'bg-white text-black hover:bg-stone-200'
                  }`}
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Select Table #{previewStandeeTable} on PC</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    sounds.playClick();
                    if (navigator.clipboard) {
                      navigator.clipboard.writeText(getTableOrderUrl(previewStandeeTable));
                    }
                    setCopiedLink(true);
                    setTimeout(() => setCopiedLink(false), 2000);
                  }}
                  className={`px-3 py-2 rounded-xl font-mono text-xs flex items-center gap-1 cursor-pointer border ${
                    isLight ? 'border-stone-300 text-stone-700 hover:bg-stone-100' : 'border-white/20 text-white hover:bg-white/10'
                  }`}
                >
                  {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedLink ? 'Copied!' : 'Copy Link'}</span>
                </button>
              </div>
            </div>
          )}

        </motion.div>
      </div>
    </AnimatePresence>
  );
}
