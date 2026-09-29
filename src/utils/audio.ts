/**
 * Procedural sci-fi ambient sound generator using Web Audio API
 */
class AmbientSoundSystem {
  private ctx: AudioContext | null = null;
  private isPlaying = false;
  private masterGain: GainNode | null = null;
  private oscillators: OscillatorNode[] = [];
  private filter: BiquadFilterNode | null = null;

  init() {
    if (this.ctx) return;
    const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    this.ctx = new AudioCtx();
  }

  toggle(): boolean {
    if (this.isPlaying) {
      this.stop();
      return false;
    } else {
      this.start();
      return true;
    }
  }

  start() {
    this.init();
    if (!this.ctx) return;

    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }

    this.stop();

    // Master gain
    this.masterGain = this.ctx.createGain();
    this.masterGain.gain.setValueAtTime(0.01, this.ctx.currentTime);
    this.masterGain.gain.exponentialRampToValueAtTime(0.12, this.ctx.currentTime + 2.5);

    // Warm Low-pass filter
    this.filter = this.ctx.createBiquadFilter();
    this.filter.type = 'lowpass';
    this.filter.frequency.setValueAtTime(380, this.ctx.currentTime);
    this.filter.Q.setValueAtTime(3.0, this.ctx.currentTime);

    this.filter.connect(this.masterGain);
    this.masterGain.connect(this.ctx.destination);

    // Drone chord frequencies (C minor 9 / futuristic aesthetic: C2, G2, Eb3, Bb3, D4)
    const freqs = [65.41, 98.0, 155.56, 233.08, 293.66];

    this.oscillators = freqs.map((freq, index) => {
      const osc = this.ctx!.createOscillator();
      const oscGain = this.ctx!.createGain();

      osc.type = index % 2 === 0 ? 'sine' : 'triangle';
      osc.frequency.setValueAtTime(freq, this.ctx!.currentTime);

      // Subtle detune for shimmer
      osc.detune.setValueAtTime((Math.random() - 0.5) * 12, this.ctx!.currentTime);

      const gainVal = 0.2 / (index + 1);
      oscGain.gain.setValueAtTime(gainVal, this.ctx!.currentTime);

      osc.connect(oscGain);
      oscGain.connect(this.filter!);
      osc.start();
      return osc;
    });

    this.isPlaying = true;
  }

  playBlip() {
    this.init();
    if (!this.ctx) return;
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(880, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(1760, this.ctx.currentTime + 0.08);

    gain.gain.setValueAtTime(0.08, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.1);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start();
    osc.stop(this.ctx.currentTime + 0.1);
  }

  stop() {
    if (this.masterGain && this.ctx) {
      try {
        this.masterGain.gain.linearRampToValueAtTime(0.0001, this.ctx.currentTime + 0.8);
      } catch {
        // ignore
      }
    }
    setTimeout(() => {
      this.oscillators.forEach(osc => {
        try {
          osc.stop();
          osc.disconnect();
        } catch {
          // ignore
        }
      });
      this.oscillators = [];
      this.isPlaying = false;
    }, 850);
  }

  get active(): boolean {
    return this.isPlaying;
  }
}

export const soundSystem = new AmbientSoundSystem();
