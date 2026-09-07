// Modular High-Performance Scan Sound Utility & React Hook
// Features: Zero-lag Web Audio API synthesizer + Static WAV asset fallback, volume control, and autoplay handling.

import { useState, useEffect, useCallback, useRef } from 'react';

export const SCAN_SOUND_ASSET = '/sounds/scan-success.wav';

class ScanAudioEngine {
  constructor() {
    this.ctx = null;
    this.audioBuffer = null;
    this.volume = 0.85; // 0.0 to 1.0
    this.isMuted = false;
    this.isPreloaded = false;
  }

  // Initialize and unlock AudioContext on user interaction
  init() {
    try {
      if (!this.ctx) {
        const AudioContextClass = window.AudioContext || window.webkitAudioContext;
        if (AudioContextClass) {
          this.ctx = new AudioContextClass();
        }
      }
      if (this.ctx && this.ctx.state === 'suspended') {
        this.ctx.resume();
      }
    } catch (e) {
      console.warn('AudioContext initialization failed:', e);
    }
  }

  // Preload the WAV file into memory for instant zero-latency playback
  async preloadAsset() {
    if (this.isPreloaded || typeof window === 'undefined') return;
    this.init();
    try {
      const response = await fetch(SCAN_SOUND_ASSET);
      if (response.ok) {
        const arrayBuffer = await response.arrayBuffer();
        if (this.ctx) {
          this.audioBuffer = await this.ctx.decodeAudioData(arrayBuffer);
          this.isPreloaded = true;
        }
      }
    } catch (e) {
      // If fetch fails or offline, Web Audio synthesis will be used seamlessly
      this.isPreloaded = false;
    }
  }

  setVolume(newVol) {
    this.volume = Math.max(0, Math.min(1, Number(newVol)));
  }

  getVolume() {
    return this.volume;
  }

  setMuted(muted) {
    this.isMuted = Boolean(muted);
  }

  toggleMute() {
    this.isMuted = !this.isMuted;
    return this.isMuted;
  }

  // Play high-precision modern electronic success beep / scan chime
  play(customVol = null) {
    if (this.isMuted) return;

    const targetVolume = customVol !== null ? Math.max(0, Math.min(1, customVol)) : this.volume;
    if (targetVolume <= 0) return;

    this.init();

    // If preloaded buffer is available and AudioContext is running, play buffer
    if (this.ctx && this.audioBuffer && this.ctx.state === 'running') {
      try {
        const source = this.ctx.createBufferSource();
        const gainNode = this.ctx.createGain();
        source.buffer = this.audioBuffer;
        gainNode.gain.setValueAtTime(targetVolume, this.ctx.currentTime);
        source.connect(gainNode);
        gainNode.connect(this.ctx.destination);
        source.start(0);
        return;
      } catch (err) {
        // Fall back to algorithmic synthesizer
      }
    }

    // High-Precision Algorithmic Synthesis (Zero-Latency Guarantee)
    if (this.ctx) {
      try {
        const now = this.ctx.currentTime;
        const masterGain = this.ctx.createGain();
        masterGain.gain.setValueAtTime(targetVolume * 0.7, now);
        masterGain.connect(this.ctx.destination);

        // Stage 1: Ultra-fast digital laser blip (1950Hz -> 2650Hz sweep over 45ms)
        const blipOsc = this.ctx.createOscillator();
        const blipGain = this.ctx.createGain();
        blipOsc.type = 'triangle';
        blipOsc.frequency.setValueAtTime(1950, now);
        blipOsc.frequency.exponentialRampToValueAtTime(2650, now + 0.045);
        blipGain.gain.setValueAtTime(0.001, now);
        blipGain.gain.linearRampToValueAtTime(0.35, now + 0.008);
        blipGain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);

        blipOsc.connect(blipGain);
        blipGain.connect(masterGain);
        blipOsc.start(now);
        blipOsc.stop(now + 0.05);

        // Stage 2: Crisp confirmation chime: E7 (2637.0Hz) + B7 (3951.0Hz) shimmer
        const chimeStartTime = now + 0.035;
        
        // Primary fundamental
        const tone1 = this.ctx.createOscillator();
        const tone1Gain = this.ctx.createGain();
        tone1.type = 'sine';
        tone1.frequency.setValueAtTime(2637.0, chimeStartTime); // E7
        tone1Gain.gain.setValueAtTime(0.001, chimeStartTime);
        tone1Gain.gain.linearRampToValueAtTime(0.5, chimeStartTime + 0.004);
        tone1Gain.gain.exponentialRampToValueAtTime(0.0005, chimeStartTime + 0.24);

        tone1.connect(tone1Gain);
        tone1Gain.connect(masterGain);
        tone1.start(chimeStartTime);
        tone1.stop(chimeStartTime + 0.24);

        // Secondary crystalline harmonic: E8 (3296.3Hz)
        const tone2 = this.ctx.createOscillator();
        const tone2Gain = this.ctx.createGain();
        tone2.type = 'sine';
        tone2.frequency.setValueAtTime(3296.3, chimeStartTime);
        tone2Gain.gain.setValueAtTime(0.001, chimeStartTime);
        tone2Gain.gain.linearRampToValueAtTime(0.25, chimeStartTime + 0.004);
        tone2Gain.gain.exponentialRampToValueAtTime(0.0005, chimeStartTime + 0.2);

        tone2.connect(tone2Gain);
        tone2Gain.connect(masterGain);
        tone2.start(chimeStartTime);
        tone2.stop(chimeStartTime + 0.2);

        // High shimmer sparkle: B7 (3951Hz)
        const tone3 = this.ctx.createOscillator();
        const tone3Gain = this.ctx.createGain();
        tone3.type = 'sine';
        tone3.frequency.setValueAtTime(3951.0, chimeStartTime + 0.01);
        tone3Gain.gain.setValueAtTime(0.001, chimeStartTime + 0.01);
        tone3Gain.gain.linearRampToValueAtTime(0.15, chimeStartTime + 0.015);
        tone3Gain.gain.exponentialRampToValueAtTime(0.0005, chimeStartTime + 0.16);

        tone3.connect(tone3Gain);
        tone3Gain.connect(masterGain);
        tone3.start(chimeStartTime + 0.01);
        tone3.stop(chimeStartTime + 0.16);
      } catch (err) {
        console.warn('Scan synthesis error:', err);
      }
    }
  }
}

export const scanAudio = new ScanAudioEngine();

// Clean, modular React Hook for any component
export function useScanAudio() {
  const [isMuted, setIsMuted] = useState(scanAudio.isMuted);
  const [volume, setVolumeState] = useState(scanAudio.volume);

  useEffect(() => {
    // Automatically attempt buffer preload on mount
    scanAudio.preloadAsset();
  }, []);

  const playScanSuccess = useCallback((customVol = null) => {
    scanAudio.play(customVol);
  }, []);

  const toggleMute = useCallback(() => {
    const nextMute = scanAudio.toggleMute();
    setIsMuted(nextMute);
    return nextMute;
  }, []);

  const setVolume = useCallback((val) => {
    scanAudio.setVolume(val);
    setVolumeState(val);
  }, []);

  const initAudio = useCallback(() => {
    scanAudio.init();
  }, []);

  return {
    playScanSuccess,
    isMuted,
    toggleMute,
    volume,
    setVolume,
    initAudio
  };
}
