import { describe, it, expect, beforeEach, vi } from 'vitest';
import { AudioSynthService } from '../services/audio-synth';

class MockStorage implements Storage {
  private store: Record<string, string> = {};
  get length(): number {
    return Object.keys(this.store).length;
  }
  clear(): void {
    this.store = {};
  }
  getItem(key: string): string | null {
    return this.store[key] ?? null;
  }
  key(index: number): string | null {
    return Object.keys(this.store)[index] ?? null;
  }
  removeItem(key: string): void {
    delete this.store[key];
  }
  setItem(key: string, value: string): void {
    this.store[key] = value;
  }
}

describe('Audio Settings & AudioSynthService', () => {
  let mockStorage: MockStorage;

  beforeEach(() => {
    mockStorage = new MockStorage();
    (globalThis as any).localStorage = mockStorage;
    (globalThis as any).window = { localStorage: mockStorage };
    AudioSynthService.setMuted(false);
    AudioSynthService.setVolume(0.5);
  });

  it('initializes with default settings and updates volume correctly', () => {
    expect(AudioSynthService.isMuted()).toBe(false);
    expect(AudioSynthService.getVolume()).toBe(0.5);

    AudioSynthService.setVolume(0.8);
    expect(AudioSynthService.getVolume()).toBe(0.8);

    // Clamps values between 0 and 1
    AudioSynthService.setVolume(1.5);
    expect(AudioSynthService.getVolume()).toBe(1.0);

    AudioSynthService.setVolume(-0.2);
    expect(AudioSynthService.getVolume()).toBe(0.0);
  });

  it('persists muted and volume changes to localStorage', () => {
    AudioSynthService.setVolume(0.75);
    AudioSynthService.setMuted(true);

    const storedRaw = mockStorage.getItem('stellar_splash_audio_settings');
    expect(storedRaw).toBeTruthy();
    const stored = JSON.parse(storedRaw!);
    expect(stored.volume).toBe(0.75);
    expect(stored.muted).toBe(true);
  });

  it('toggles mute status and notifies registered listeners', () => {
    const listener = vi.fn();
    const unsubscribe = AudioSynthService.addAudioChangeListener(listener);

    const toggled = AudioSynthService.toggleMuted();
    expect(toggled).toBe(true);
    expect(AudioSynthService.isMuted()).toBe(true);
    expect(listener).toHaveBeenCalledWith(true, expect.any(Number));

    unsubscribe();
    AudioSynthService.setVolume(0.3);
    // Listener should not be called again after unsubscribe
    expect(listener).toHaveBeenCalledTimes(1);
  });
});
