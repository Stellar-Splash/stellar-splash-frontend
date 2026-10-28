/**
 * Procedural Web Audio API sound synthesizer for Stellar Splash.
 * Generates interactive SFX dynamically without requiring external audio asset downloads.
 */

export type SoundEffectType = 'hit' | 'combo' | 'hazard' | 'buzzer' | 'tick' | 'victory';

export class AudioSynthService {
  private static audioCtx: AudioContext | null = null;
  private static muted: boolean = false;
  private static masterVolume: number = 0.5;

  private static getContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return null;

    if (!this.audioCtx) {
      this.audioCtx = new AudioContextClass();
    }
    if (this.audioCtx.state === 'suspended') {
      this.audioCtx.resume().catch(() => {});
    }
    return this.audioCtx;
  }

  public static isMuted(): boolean {
    return this.muted;
  }

  public static setMuted(muted: boolean): void {
    this.muted = muted;
  }

  public static getVolume(): number {
    return this.masterVolume;
  }

  public static setVolume(volume: number): void {
    this.masterVolume = Math.max(0, Math.min(1, volume));
  }

  /**
   * Sound on successfully splashing a regular target.
   */
  public static playTargetHit(streak = 1): void {
    if (this.muted) return;
    const ctx = this.getContext();
    if (!ctx) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    const baseFreq = 440 + Math.min(streak * 25, 400);
    const now = ctx.currentTime;

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(baseFreq, now);
    osc.frequency.exponentialRampToValueAtTime(baseFreq * 1.5, now + 0.08);

    const vol = this.masterVolume * 0.4;
    gain.gain.setValueAtTime(vol, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.1);
  }

  /**
   * Ascending harmonic chime for reaching a combo milestone.
   */
  public static playComboStreak(combo: number): void {
    if (this.muted) return;
    const ctx = this.getContext();
    if (!ctx) return;

    const baseFreq = 523.25; // C5
    const intervals = [0, 4, 7, 12]; // Major chord arpeggio
    const now = ctx.currentTime;

    intervals.forEach((semitones, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const noteFreq = baseFreq * Math.pow(2, (semitones + (combo % 12)) / 12);
      const noteTime = now + idx * 0.04;

      osc.type = 'sine';
      osc.frequency.setValueAtTime(noteFreq, noteTime);

      const vol = this.masterVolume * 0.3;
      gain.gain.setValueAtTime(vol, noteTime);
      gain.gain.exponentialRampToValueAtTime(0.001, noteTime + 0.15);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(noteTime);
      osc.stop(noteTime + 0.15);
    });
  }

  /**
   * Discordant buzzer when clicking a hazard sponge.
   */
  public static playHazardPenalty(): void {
    if (this.muted) return;
    const ctx = this.getContext();
    if (!ctx) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const now = ctx.currentTime;

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(140, now);
    osc.frequency.linearRampToValueAtTime(70, now + 0.2);

    const vol = this.masterVolume * 0.5;
    gain.gain.setValueAtTime(vol, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.22);
  }

  /**
   * Final round buzzer when game time expires.
   */
  public static playBuzzer(): void {
    if (this.muted) return;
    const ctx = this.getContext();
    if (!ctx) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const now = ctx.currentTime;

    osc.type = 'square';
    osc.frequency.setValueAtTime(180, now);

    const vol = this.masterVolume * 0.45;
    gain.gain.setValueAtTime(vol, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.4);
  }

  /**
   * Short metronome click during countdown.
   */
  public static playCountdownTick(isFinal = false): void {
    if (this.muted) return;
    const ctx = this.getContext();
    if (!ctx) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const now = ctx.currentTime;

    osc.type = 'sine';
    osc.frequency.setValueAtTime(isFinal ? 880 : 440, now);

    const vol = this.masterVolume * 0.35;
    gain.gain.setValueAtTime(vol, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.08);
  }

  /**
   * Subtle click when clicking empty water (miss).
   */
  public static playMiss(): void {
    if (this.muted) return;
    const ctx = this.getContext();
    if (!ctx) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const now = ctx.currentTime;

    osc.type = 'sine';
    osc.frequency.setValueAtTime(200, now);
    osc.frequency.linearRampToValueAtTime(100, now + 0.04);

    const vol = this.masterVolume * 0.2;
    gain.gain.setValueAtTime(vol, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.04);
  }
}
