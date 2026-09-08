// Web Audio API Synthesizer for rich cafe & POS sound effects

class SoundController {
  constructor() {
    this.ctx = null;
    this.enabled = true;
    this.volume = 0.85;
  }

  init() {
    if (!this.ctx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) {
        this.ctx = new AudioContext();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  setVolume(val) {
    this.volume = Math.max(0, Math.min(1, Number(val)));
  }

  getVolume() {
    return this.volume;
  }

  toggleSound() {
    this.enabled = !this.enabled;
    return this.enabled;
  }

  // Click / Tap feedback
  playClick() {
    if (!this.enabled) return;
    try {
      this.init();
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      
      osc.type = 'sine';
      osc.frequency.setValueAtTime(600, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(300, this.ctx.currentTime + 0.05);
      
      gain.gain.setValueAtTime(0.12, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.05);
      
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      
      osc.start();
      osc.stop(this.ctx.currentTime + 0.05);
    } catch (e) {
      // Audio context might be restricted before user gesture
    }
  }

  // Add to cart chime
  playAddToCart() {
    if (!this.enabled) return;
    try {
      this.init();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      
      // Note 1 (E5)
      const osc1 = this.ctx.createOscillator();
      const gain1 = this.ctx.createGain();
      osc1.frequency.setValueAtTime(659.25, now);
      gain1.gain.setValueAtTime(0.15, now);
      gain1.gain.exponentialRampToValueAtTime(0.01, now + 0.12);
      osc1.connect(gain1);
      gain1.connect(this.ctx.destination);
      osc1.start(now);
      osc1.stop(now + 0.12);

      // Note 2 (B5)
      const osc2 = this.ctx.createOscillator();
      const gain2 = this.ctx.createGain();
      osc2.frequency.setValueAtTime(987.77, now + 0.08);
      gain2.gain.setValueAtTime(0.18, now + 0.08);
      gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
      osc2.connect(gain2);
      gain2.connect(this.ctx.destination);
      osc2.start(now + 0.08);
      osc2.stop(now + 0.25);
    } catch (e) {}
  }

  // Order placed celebratory truck horn & chord
  playOrderPlaced() {
    if (!this.enabled) return;
    try {
      this.init();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;

      // Deep friendly truck horn base chords
      const frequencies = [220, 277.18, 329.63, 440];
      frequencies.forEach((freq, idx) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        
        osc.type = idx % 2 === 0 ? 'sawtooth' : 'triangle';
        osc.frequency.setValueAtTime(freq, now);
        
        // Swell and fade
        gain.gain.setValueAtTime(0.01, now);
        gain.gain.linearRampToValueAtTime(0.08, now + 0.08);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.65);
        
        // Lowpass filter for warm analog feel
        const filter = this.ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(900, now);
        
        osc.connect(filter);
        filter.connect(gain);
        gain.connect(this.ctx.destination);
        
        osc.start(now);
        osc.stop(now + 0.65);
      });

      // High sparkle
      const sparkle = this.ctx.createOscillator();
      const sparkGain = this.ctx.createGain();
      sparkle.type = 'sine';
      sparkle.frequency.setValueAtTime(1046.50, now + 0.2);
      sparkle.frequency.exponentialRampToValueAtTime(1567.98, now + 0.5);
      sparkGain.gain.setValueAtTime(0.12, now + 0.2);
      sparkGain.gain.exponentialRampToValueAtTime(0.001, now + 0.7);
      sparkle.connect(sparkGain);
      sparkGain.connect(this.ctx.destination);
      sparkle.start(now + 0.2);
      sparkle.stop(now + 0.7);
    } catch (e) {}
  }

  // Kitchen Alert for new incoming order
  playKitchenAlert() {
    if (!this.enabled) return;
    try {
      this.init();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      
      [523.25, 659.25, 783.99, 1046.50].forEach((freq, i) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + i * 0.1);
        gain.gain.setValueAtTime(0.2, now + i * 0.1);
        gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.1 + 0.35);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now + i * 0.1);
        osc.stop(now + i * 0.1 + 0.35);
      });
    } catch (e) {}
  }

  // Ready to serve bell ring
  playReadyBell() {
    if (!this.enabled) return;
    try {
      this.init();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(1760, now); // A6 bell
      gain.gain.setValueAtTime(0.25, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.8);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.8);
    } catch (e) {}
  }

  // Cinematic 3-Second Table Service Alarm (Warm, luxury, orchestral chime)
  playCinematicTableAlarm() {
    if (!this.enabled) return;
    try {
      this.init();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;

      // Stop any previously playing alarm
      this.stopCinematicTableAlarm();

      // Master low-pass filter to keep sound velvety, warm, with zero harsh high-frequency spikes
      const masterFilter = this.ctx.createBiquadFilter();
      masterFilter.type = 'lowpass';
      masterFilter.frequency.setValueAtTime(1350, now);
      masterFilter.Q.setValueAtTime(1.1, now);

      // Master output gain over 3.0 seconds
      const masterGain = this.ctx.createGain();
      masterGain.gain.setValueAtTime(0.42, now);
      masterGain.gain.exponentialRampToValueAtTime(0.001, now + 3.0);

      masterFilter.connect(masterGain);
      masterGain.connect(this.ctx.destination);

      this._activeAlarmNodes = [masterGain, masterFilter];

      // 3-Pulse Cinematic Chime Sequence across 3 seconds:
      // Pulse 1 at 0.0s: Deep warm fundamental (F3 174.61Hz, C4 261.63Hz, A4 440Hz)
      // Pulse 2 at 0.85s: Harmonious lift (G3 196.0Hz, D4 293.66Hz, B4 493.88Hz)
      // Pulse 3 at 1.7s: Grand luxury resolution (C3 130.81Hz, C4 261.63Hz, G4 392Hz, E5 659.25Hz) with long 1.3s tail
      const chords = [
        { time: 0.0, freqs: [174.61, 261.63, 440.0], dur: 1.1, vol: 0.28 },
        { time: 0.85, freqs: [196.0, 293.66, 493.88], dur: 1.1, vol: 0.32 },
        { time: 1.7, freqs: [130.81, 261.63, 392.0, 659.25], dur: 1.3, vol: 0.38 }
      ];

      chords.forEach(({ time, freqs, dur, vol }) => {
        const strikeTime = now + time;
        freqs.forEach((freq, idx) => {
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();

          // Smooth sinusoidal fundamental with soft warm triangle overtone
          osc.type = idx === 0 ? 'sine' : idx % 2 === 0 ? 'triangle' : 'sine';
          osc.frequency.setValueAtTime(freq, strikeTime);

          // Soft 25ms attack to eliminate clicks
          gain.gain.setValueAtTime(0.0001, strikeTime);
          gain.gain.linearRampToValueAtTime(vol * (idx === 0 ? 1.0 : 0.65), strikeTime + 0.025);
          // Rich, lingering exponential decay
          gain.gain.exponentialRampToValueAtTime(0.0001, strikeTime + dur);

          osc.connect(gain);
          gain.connect(masterFilter);

          osc.start(strikeTime);
          osc.stop(strikeTime + dur);
          this._activeAlarmNodes.push(osc, gain);
        });
      });
    } catch (e) {
      console.warn('Cinematic alarm error:', e);
    }
  }

  stopCinematicTableAlarm() {
    try {
      if (this._activeAlarmNodes && this.ctx) {
        const now = this.ctx.currentTime;
        this._activeAlarmNodes.forEach(node => {
          try {
            if (node.gain) {
              node.gain.linearRampToValueAtTime(0.0001, now + 0.08);
            }
            if (node.stop) {
              node.stop(now + 0.1);
            }
          } catch (e) {}
        });
        this._activeAlarmNodes = [];
      }
    } catch (e) {}
  }

  // Alias for backward compatibility
  playServiceCallChime() {
    this.playCinematicTableAlarm();
  }

  // Gamified Rubber Stamp Squish & Pop
  playStampSquish() {
    if (!this.enabled) return;
    try {
      this.init();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;

      // Deep squish thud
      const thud = this.ctx.createOscillator();
      const thudGain = this.ctx.createGain();
      thud.type = 'sine';
      thud.frequency.setValueAtTime(160, now);
      thud.frequency.exponentialRampToValueAtTime(70, now + 0.08);
      thudGain.gain.setValueAtTime(0.35, now);
      thudGain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);
      thud.connect(thudGain);
      thudGain.connect(this.ctx.destination);
      thud.start(now);
      thud.stop(now + 0.1);

      // Bright rubber pop
      const pop = this.ctx.createOscillator();
      const popGain = this.ctx.createGain();
      pop.type = 'triangle';
      pop.frequency.setValueAtTime(540, now + 0.03);
      pop.frequency.exponentialRampToValueAtTime(980, now + 0.09);
      popGain.gain.setValueAtTime(0.2, now + 0.03);
      popGain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);
      pop.connect(popGain);
      popGain.connect(this.ctx.destination);
      pop.start(now + 0.03);
      pop.stop(now + 0.18);
    } catch (e) {}
  }

  // Gamified Level Up / Milestone Fanfare
  playRewardFanfare() {
    if (!this.enabled) return;
    try {
      this.init();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;

      // Major Triad Arpeggio (C5 - E5 - G5 - C6) + High Sparkle
      const notes = [523.25, 659.25, 783.99, 1046.50, 1318.51];
      notes.forEach((freq, idx) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now + idx * 0.08);
        gain.gain.setValueAtTime(0.18, now + idx * 0.08);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.08 + 0.45);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now + idx * 0.08);
        osc.stop(now + idx * 0.08 + 0.45);
      });
    } catch (e) {}
  }

  // High-Pitch Electronic Scan Success Confirmation Beep / Digital Chime
  playScanSuccess(customVol = null) {
    if (!this.enabled) return;
    try {
      this.init();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      const targetVol = customVol !== null ? Math.max(0, Math.min(1, customVol)) : this.volume;
      const masterGain = this.ctx.createGain();
      masterGain.gain.setValueAtTime(targetVol * 0.75, now);
      masterGain.connect(this.ctx.destination);

      // 1. Tactile digital frequency blip (1950Hz -> 2650Hz in 45ms)
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

      // 2. High crystalline confirmation tone: E7 (2637Hz) + B7 (3951Hz)
      const chimeStart = now + 0.035;

      const tone1 = this.ctx.createOscillator();
      const tone1Gain = this.ctx.createGain();
      tone1.type = 'sine';
      tone1.frequency.setValueAtTime(2637.0, chimeStart);
      tone1Gain.gain.setValueAtTime(0.001, chimeStart);
      tone1Gain.gain.linearRampToValueAtTime(0.48, chimeStart + 0.004);
      tone1Gain.gain.exponentialRampToValueAtTime(0.0005, chimeStart + 0.24);

      tone1.connect(tone1Gain);
      tone1Gain.connect(masterGain);
      tone1.start(chimeStart);
      tone1.stop(chimeStart + 0.24);

      const tone2 = this.ctx.createOscillator();
      const tone2Gain = this.ctx.createGain();
      tone2.type = 'sine';
      tone2.frequency.setValueAtTime(3296.3, chimeStart);
      tone2Gain.gain.setValueAtTime(0.001, chimeStart);
      tone2Gain.gain.linearRampToValueAtTime(0.24, chimeStart + 0.004);
      tone2Gain.gain.exponentialRampToValueAtTime(0.0005, chimeStart + 0.2);

      tone2.connect(tone2Gain);
      tone2Gain.connect(masterGain);
      tone2.start(chimeStart);
      tone2.stop(chimeStart + 0.2);

      const tone3 = this.ctx.createOscillator();
      const tone3Gain = this.ctx.createGain();
      tone3.type = 'sine';
      tone3.frequency.setValueAtTime(3951.0, chimeStart + 0.01);
      tone3Gain.gain.setValueAtTime(0.001, chimeStart + 0.01);
      tone3Gain.gain.linearRampToValueAtTime(0.16, chimeStart + 0.015);
      tone3Gain.gain.exponentialRampToValueAtTime(0.0005, chimeStart + 0.16);

      tone3.connect(tone3Gain);
      tone3Gain.connect(masterGain);
      tone3.start(chimeStart + 0.01);
      tone3.stop(chimeStart + 0.16);
    } catch (e) {}
  }
}

export const sounds = new SoundController();
