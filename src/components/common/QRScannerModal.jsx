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
  AlertCircle
} from 'lucide-react';
import jsQR from 'jsqr';
import { CAFE_CONFIG } from '../../data/cafeConfig';
import { useCart } from '../../context/CartContext';
import { sounds } from '../../utils/audio';
import { useScanAudio } from '../../utils/scanSound';
import { parseTableNumberFromText } from '../../utils/qrCode';

export function QRScannerModal({ isOpen, onClose, onScanComplete }) {
  const { activeTable, setActiveTable, setDiningMode } = useCart();
  
  // Camera & Scan States
  const [cameraActive, setCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState(null);
  const [facingMode, setFacingMode] = useState('environment'); // 'environment' | 'user'
  const [isScanning, setIsScanning] = useState(true);
  const [scannedTable, setScannedTable] = useState(null);
  const [detectedText, setDetectedText] = useState(null);
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

  // Start live camera stream
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
        ? 'Camera permission denied. Use manual table plaques below or upload a QR image.' 
        : 'Camera unavailable on this device. Select your table below.'
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
        return; // Pause scanning loop upon successful match
      }

      animationFrameId.current = requestAnimationFrame(scanFrame);
    };

    animationFrameId.current = requestAnimationFrame(scanFrame);
  };

  // Handle scanned QR payload
  const handleSuccessfulQR = (data) => {
    const tableNum = parseTableNumberFromText(data);
    setDetectedText(data);

    if (tableNum) {
      handleCompleteTableConnection(tableNum);
    } else {
      // If code was scanned but no table number could be extracted
      initAudio();
      sounds.playClick();
      setIsScanning(false);
      // Resume scanning after brief notification
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
    }, 1100);
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
          alert('No readable QR code found in this image. Please try another photo or select your table below.');
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

  // Initialize camera when modal opens
  useEffect(() => {
    if (isOpen) {
      initAudio();
      startCamera(facingMode);
    } else {
      stopCamera();
    }
    return () => stopCamera();
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.2 }}
          className="relative w-full max-w-md bg-slate-900 border border-white/10 rounded-3xl p-6 shadow-2xl overflow-hidden font-sans text-white"
        >
          {/* Top Control Bar: Audio Settings + Close Button */}
          <div className="absolute top-4 right-4 flex items-center gap-2 z-20">
            {/* Sound Volume / Mute Widget */}
            <div className="relative">
              <button
                type="button"
                onClick={() => {
                  initAudio();
                  setShowVolumeControls(!showVolumeControls);
                }}
                className={`p-2 rounded-full transition cursor-pointer border ${
                  isMuted
                    ? 'bg-slate-800 text-rose-400 border-rose-500/30'
                    : 'bg-slate-800/80 text-cyan-400 border-cyan-500/30 hover:bg-slate-700'
                }`}
                title={isMuted ? 'Scan sound muted' : `Scan sound volume: ${Math.round(volume * 100)}%`}
              >
                {isMuted ? (
                  <VolumeX className="w-4 h-4" />
                ) : volume < 0.5 ? (
                  <Volume1 className="w-4 h-4" />
                ) : (
                  <Volume2 className="w-4 h-4" />
                )}
              </button>

              {/* Expandable Audio Settings Popover */}
              <AnimatePresence>
                {showVolumeControls && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9, y: 5 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: 5 }}
                    className="absolute right-0 top-11 z-30 w-56 p-3.5 rounded-2xl bg-slate-950 border border-cyan-500/30 shadow-2xl space-y-2.5 font-sans"
                  >
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-mono text-slate-300 font-bold flex items-center gap-1">
                        <Zap className="w-3.5 h-3.5 text-cyan-400" />
                        SCAN AUDIO
                      </span>
                      <button
                        type="button"
                        onClick={toggleMute}
                        className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold transition ${
                          isMuted ? 'bg-rose-500/20 text-rose-300' : 'bg-cyan-500/20 text-cyan-300'
                        }`}
                      >
                        {isMuted ? 'UNMUTE' : 'MUTE'}
                      </button>
                    </div>

                    <div className="space-y-1">
                      <div className="flex justify-between text-[10px] font-mono text-slate-400">
                        <span>Volume:</span>
                        <span className="text-cyan-400 font-bold">{Math.round(volume * 100)}%</span>
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
                        className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
                      />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Close button */}
            <button
              onClick={() => { sounds.playClick(); onClose(); }}
              className="p-2 rounded-full bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white transition cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Modal Header */}
          <div className="text-center mb-4 pt-1">
            <h3 className="text-xl font-bold font-syne flex items-center justify-center gap-2">
              <QrCode className="w-5 h-5 text-cyan-400" />
              <span>Real Camera QR Scanner</span>
            </h3>
            <p className="text-slate-400 text-xs mt-1">
              Point your camera at the Table QR plaque to connect instantly.
            </p>
          </div>

          {/* Hidden Canvas for QR frame processing */}
          <canvas ref={canvasRef} className="hidden" />

          {/* Real Live Camera Viewport / Scanner Window */}
          <div className="relative w-full h-56 bg-slate-950 rounded-2xl border border-white/10 overflow-hidden flex flex-col items-center justify-center mb-4 select-none">
            {/* Live Video Feed */}
            <video
              ref={videoRef}
              playsInline
              muted
              className={`w-full h-full object-cover transition-opacity duration-300 ${
                cameraActive && !scannedTable ? 'opacity-100' : 'opacity-0'
              }`}
            />

            {/* Targeting Crosshairs & Laser Sweep Overlay */}
            {cameraActive && !scannedTable && (
              <div className="absolute inset-0 pointer-events-none flex flex-col items-center justify-center p-6">
                {/* Aiming Bracket Box */}
                <div className="relative w-44 h-44 border-2 border-cyan-400/40 rounded-2xl flex items-center justify-center shadow-[0_0_25px_rgba(6,182,212,0.15)]">
                  {/* Glowing Corner Accents */}
                  <div className="absolute -top-1 -left-1 w-5 h-5 border-t-2 border-l-2 border-cyan-400" />
                  <div className="absolute -top-1 -right-1 w-5 h-5 border-t-2 border-r-2 border-cyan-400" />
                  <div className="absolute -bottom-1 -left-1 w-5 h-5 border-b-2 border-l-2 border-cyan-400" />
                  <div className="absolute -bottom-1 -right-1 w-5 h-5 border-b-2 border-r-2 border-cyan-400" />

                  {/* Laser Scan Line */}
                  <motion.div
                    animate={{ y: [-70, 70, -70] }}
                    transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
                    className="w-full h-0.5 bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_12px_#06b6d4]"
                  />
                </div>

                <div className="absolute bottom-3 px-3 py-1 rounded-full bg-black/60 backdrop-blur-sm border border-white/10">
                  <span className="text-[11px] font-mono text-cyan-400 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                    Scanning Real QR Code...
                  </span>
                </div>
              </div>
            )}

            {/* Success State Overlay */}
            {scannedTable && (
              <div className="absolute inset-0 bg-slate-950/95 flex flex-col items-center justify-center text-center p-4 z-20">
                {audioChimeFired && (
                  <motion.div
                    initial={{ scale: 0.8, opacity: 1 }}
                    animate={{ scale: 2.2, opacity: 0 }}
                    transition={{ duration: 0.6, ease: 'easeOut' }}
                    className="absolute w-20 h-20 rounded-full border-2 border-emerald-400 pointer-events-none"
                  />
                )}
                <motion.div
                  initial={{ scale: 0.4, rotate: -20 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 14 }}
                >
                  <CheckCircle2 className="w-14 h-14 text-emerald-400 mb-2 drop-shadow-[0_0_15px_rgba(52,211,153,0.5)]" />
                </motion.div>
                <h4 className="text-xl font-bold text-white font-syne">Table #{scannedTable} Connected!</h4>
                <p className="text-emerald-400 text-xs font-mono mt-1">Contactless dining session active</p>
              </div>
            )}

            {/* Fallback / Error State */}
            {!cameraActive && !scannedTable && (
              <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center bg-slate-950/90 z-10 space-y-2">
                <Camera className="w-10 h-10 text-slate-600 mb-1" />
                <p className="text-xs font-semibold text-slate-300">
                  {cameraError || 'Camera inactive'}
                </p>
                <div className="flex items-center gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => startCamera(facingMode)}
                    className="px-3 py-1.5 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40 text-xs font-mono font-bold flex items-center gap-1.5 cursor-pointer"
                  >
                    <RefreshCw className="w-3.5 h-3.5" /> Start Camera
                  </button>
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/20 text-xs font-mono flex items-center gap-1.5 cursor-pointer"
                  >
                    <Upload className="w-3.5 h-3.5" /> Upload QR Image
                  </button>
                </div>
              </div>
            )}

            {/* Floating Camera Flip & Upload Actions */}
            {cameraActive && !scannedTable && (
              <div className="absolute bottom-2.5 right-2.5 flex items-center gap-1.5 z-10">
                <button
                  type="button"
                  onClick={handleFlipCamera}
                  className="p-2 rounded-xl bg-black/60 hover:bg-black/80 text-white backdrop-blur-sm border border-white/20 transition cursor-pointer"
                  title="Flip camera"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="p-2 rounded-xl bg-black/60 hover:bg-black/80 text-white backdrop-blur-sm border border-white/20 transition cursor-pointer"
                  title="Upload QR Image"
                >
                  <Upload className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>

          {/* Hidden File Input for QR Image upload */}
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleQrFileUpload}
            accept="image/*"
            className="hidden"
          />

          {/* Table Plaques Quick-Select (Useful for testing & when camera is unavailable) */}
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-mono text-slate-400 font-bold uppercase tracking-wider">
                Or Tap Table Plaque Directly:
              </span>
              <span className="text-[10px] font-mono text-cyan-400">
                Active: T-{activeTable < 10 ? `0${activeTable}` : activeTable}
              </span>
            </div>

            <div className="grid grid-cols-4 gap-2">
              {CAFE_CONFIG.tables.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => handleCompleteTableConnection(t.number)}
                  className={`py-2 px-2 rounded-xl text-xs font-mono font-bold transition-all border cursor-pointer ${
                    activeTable === t.number
                      ? 'bg-amber-400 text-slate-950 border-amber-400 shadow-md scale-[1.02]'
                      : 'bg-slate-950 text-slate-300 border-white/10 hover:border-cyan-400/60 hover:text-white'
                  }`}
                >
                  <span>T-{t.number < 10 ? `0${t.number}` : t.number}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Takeaway / Counter Pickup Option */}
          <div className="pt-3 border-t border-white/10 flex items-center justify-between gap-3">
            <span className="text-xs text-slate-400">Not seated at a table?</span>
            <button
              type="button"
              onClick={() => {
                sounds.playClick();
                setActiveTable(null);
                setDiningMode('counter');
                if (onScanComplete) onScanComplete('counter');
                onClose();
              }}
              className="px-3 py-1.5 rounded-xl bg-cyan-500/15 hover:bg-cyan-500/25 text-cyan-300 text-xs font-medium border border-cyan-500/30 transition inline-flex items-center gap-1 cursor-pointer"
            >
              <span>Takeaway / Counter</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
