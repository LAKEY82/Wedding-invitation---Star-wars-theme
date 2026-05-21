class AudioEngine {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private droneGain: GainNode | null = null;
  private padGain: GainNode | null = null;
  private starsGain: GainNode | null = null;
  
  private padOscs: OscillatorNode[] = [];
  private droneOscs: OscillatorNode[] = [];
  
  private activeChords: { [key: number]: OscillatorNode } = {};
  private starTimer: any = null;
  private chordTimer: any = null;
  
  private audioEl: HTMLAudioElement | null = null;
  private isPlaying = false;
  private isMuted = false;
  private currentChordIndex = 0;
  
  // Romantic and epic space progression (Root frequencies)
  // C2, F2, A2, G2 roots with corresponding celestial extensions
  private chords = [
    [130.81, 164.81, 196.00, 246.94, 293.66], // Cmaj9 (C3, E3, G3, B3, D4)
    [174.61, 220.00, 261.63, 329.63, 349.23], // Fmaj7 (F3, A3, C4, E4, F4)
    [146.83, 174.61, 220.00, 293.66, 392.00], // Dm7/G (D3, F3, A3, D4, G4)
    [110.07, 130.81, 164.81, 220.00, 329.63], // Am7 (A2, C3, E3, A3, E4)
  ];

  constructor(private audioUrl?: string) {}

  public async start() {
    if (this.isPlaying) return;
    this.isPlaying = true;

    if (this.audioUrl) {
      this.playAudioFile();
      return;
    }

    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      this.ctx = new AudioCtx();
      
      // Master Gain for smooth volume control
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(0.0001, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);
      
      // Sub gains for different textures
      this.droneGain = this.ctx.createGain();
      this.droneGain.gain.value = 0.45;
      this.droneGain.connect(this.masterGain);

      this.padGain = this.ctx.createGain();
      this.padGain.gain.value = 0.35;
      this.padGain.connect(this.masterGain);

      this.starsGain = this.ctx.createGain();
      this.starsGain.gain.value = 0.15;
      this.starsGain.connect(this.masterGain);

      // Start synthesizers
      this.initDrone();
      this.startChordProgression();
      this.startStarTwinkles();

      // Fade in master volume
      this.masterGain.gain.exponentialRampToValueAtTime(0.8, this.ctx.currentTime + 3.0);
    } catch (e) {
      console.error("Web Audio API failed to initialize", e);
    }
  }

  private playAudioFile() {
    if (!this.audioUrl) return;
    this.audioEl = new Audio(this.audioUrl);
    this.audioEl.loop = true;
    this.audioEl.volume = 0;
    this.audioEl.play().then(() => {
      // Fade in audio file
      let volume = 0;
      const interval = setInterval(() => {
        if (!this.audioEl || !this.isPlaying || this.isMuted) {
          clearInterval(interval);
          return;
        }
        volume = Math.min(volume + 0.05, 0.7);
        this.audioEl.volume = volume;
        if (volume >= 0.7) clearInterval(interval);
      }, 200);
    }).catch(e => {
      console.error("Audio file autoplay blocked or failed", e);
    });
  }

  private initDrone() {
    if (!this.ctx || !this.droneGain) return;
    
    // Deep space rumble: Low frequency detuned triangle/sine oscillators
    const freq1 = 55.00; // A1
    const freq2 = 55.30; // Detuned slightly
    const freq3 = 36.71; // D1 (deep base)

    const oscs = [
      { freq: freq1, type: "triangle" as OscillatorType },
      { freq: freq2, type: "sine" as OscillatorType },
      { freq: freq3, type: "sine" as OscillatorType }
    ];

    oscs.forEach(({ freq, type }) => {
      if (!this.ctx || !this.droneGain) return;
      const osc = this.ctx.createOscillator();
      const filter = this.ctx.createBiquadFilter();
      
      osc.type = type;
      osc.frequency.value = freq;
      
      filter.type = "lowpass";
      filter.frequency.value = 120; // Cut off high frequencies for deep rumble
      
      osc.connect(filter);
      filter.connect(this.droneGain);
      osc.start(0);
      
      this.droneOscs.push(osc);
    });
  }

  private startChordProgression() {
    this.playChord(this.chords[this.currentChordIndex]);
    
    const intervalTime = 8000; // Chord changes every 8 seconds
    this.chordTimer = setInterval(() => {
      if (!this.isPlaying) return;
      this.currentChordIndex = (this.currentChordIndex + 1) % this.chords.length;
      this.playChord(this.chords[this.currentChordIndex]);
    }, intervalTime);
  }

  private playChord(frequencies: number[]) {
    if (!this.ctx || !this.padGain) return;
    
    const now = this.ctx.currentTime;
    const fadeTime = 4.0; // 4-second crossfade
    
    // Clear old oscillators after fading them out
    const oldOscs = [...this.padOscs];
    this.padOscs = [];

    oldOscs.forEach(osc => {
      try {
        // Find the gain node associated with this oscillator or just fade them all out
        osc.stop(now + fadeTime);
      } catch (e) {}
    });

    // Start new chord
    frequencies.forEach(freq => {
      if (!this.ctx || !this.padGain) return;

      const osc = this.ctx.createOscillator();
      const filter = this.ctx.createBiquadFilter();
      const oscGain = this.ctx.createGain();

      osc.type = "triangle"; // Warm organ-like sound
      osc.frequency.setValueAtTime(freq, now);
      
      // Add subtle vibrato (LFO)
      const lfo = this.ctx.createOscillator();
      const lfoGain = this.ctx.createGain();
      lfo.frequency.value = 3.5 + Math.random(); // 3.5 - 4.5 Hz
      lfoGain.gain.value = 0.8; // vibrato depth (Hz)
      lfo.connect(lfoGain);
      lfoGain.connect(osc.frequency);
      lfo.start(now);

      filter.type = "lowpass";
      filter.frequency.setValueAtTime(200, now);
      filter.frequency.exponentialRampToValueAtTime(700 + Math.random() * 300, now + fadeTime);

      oscGain.gain.setValueAtTime(0.0001, now);
      oscGain.gain.linearRampToValueAtTime(0.12, now + fadeTime / 2);
      oscGain.gain.setValueAtTime(0.12, now + fadeTime / 2);
      
      // Connect nodes
      osc.connect(filter);
      filter.connect(oscGain);
      oscGain.connect(this.padGain);

      osc.start(now);
      
      // Store reference to fade out later
      this.padOscs.push(osc);
      
      // Fade out envelope
      oscGain.gain.setValueAtTime(0.12, now + 7.5 - fadeTime);
      oscGain.gain.linearRampToValueAtTime(0.0001, now + 7.9);
    });
  }

  private startStarTwinkles() {
    const scale = [523.25, 587.33, 659.25, 783.99, 880.00, 1046.50]; // C Pentatonic scale (C5, D5, E5, G5, A5, C6)
    
    this.starTimer = setInterval(() => {
      if (!this.ctx || !this.starsGain || !this.isPlaying || Math.random() > 0.6) return;

      const now = this.ctx.currentTime;
      const note = scale[Math.floor(Math.random() * scale.length)];
      
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const delay = this.ctx.createDelay();
      const feedback = this.ctx.createGain();
      
      osc.type = "sine";
      osc.frequency.setValueAtTime(note, now);
      
      gain.gain.setValueAtTime(0.0001, now);
      gain.gain.linearRampToValueAtTime(0.08, now + 0.05); // Rapid attack
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.8); // Smooth decay
      
      // Simple delay feedback network for celestial echo
      delay.delayTime.value = 0.25;
      feedback.gain.value = 0.4;
      
      osc.connect(gain);
      gain.connect(this.starsGain);
      
      // Connect delay
      gain.connect(delay);
      delay.connect(feedback);
      feedback.connect(delay);
      delay.connect(this.starsGain);

      osc.start(now);
      osc.stop(now + 1.5);
    }, 800);
  }

  public setMute(mute: boolean) {
    this.isMuted = mute;
    
    if (this.audioEl) {
      this.audioEl.volume = mute ? 0 : 0.7;
      return;
    }

    if (!this.masterGain || !this.ctx) return;
    
    const now = this.ctx.currentTime;
    if (mute) {
      this.masterGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.5);
    } else {
      this.masterGain.gain.exponentialRampToValueAtTime(0.8, now + 0.5);
    }
  }

  public toggleMute() {
    this.setMute(!this.isMuted);
    return this.isMuted;
  }

  public stop() {
    this.isPlaying = false;
    
    if (this.audioEl) {
      this.audioEl.pause();
      this.audioEl = null;
      return;
    }

    clearInterval(this.starTimer);
    clearInterval(this.chordTimer);

    if (this.masterGain && this.ctx) {
      const now = this.ctx.currentTime;
      this.masterGain.gain.linearRampToValueAtTime(0.0001, now + 1.0);
      setTimeout(() => {
        this.droneOscs.forEach(o => { try { o.stop(); } catch(e) {} });
        this.padOscs.forEach(o => { try { o.stop(); } catch(e) {} });
        if (this.ctx) {
          this.ctx.close();
          this.ctx = null;
        }
      }, 1100);
    }
  }
}

export default AudioEngine;
