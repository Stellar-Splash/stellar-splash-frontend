import { describe, it, expect, beforeEach, vi } from 'vitest';
import { AudioSynthService } from '../services/audio-synth';

describe('AudioSynthService', () => {
  let mockOscillator: any;
  let mockGain: any;
  let mockAudioContext: any;

  beforeEach(() => {
    AudioSynthService.setMuted(false);
    AudioSynthService.setVolume(0.5);

    mockOscillator = {
      type: 'sine',
      frequency: {
        setValueAtTime: vi.fn(),
        exponentialRampToValueAtTime: vi.fn(),
        linearRampToValueAtTime: vi.fn(),
      },
      connect: vi.fn(),
      start: vi.fn(),
      stop: vi.fn(),
    };

    mockGain = {
      gain: {
        setValueAtTime: vi.fn(),
        exponentialRampToValueAtTime: vi.fn(),
      },
      connect: vi.fn(),
    };

    mockAudioContext = {
      currentTime: 10.0,
      state: 'running',
      destination: {},
      createOscillator: vi.fn(() => mockOscillator),
      createGain: vi.fn(() => mockGain),
      resume: vi.fn().mockResolvedValue(undefined),
    };

    (global as any).window = {
      AudioContext: vi.fn(() => mockAudioContext),
    };
  });

  it('manages mute and volume settings correctly', () => {
    AudioSynthService.setMuted(true);
    expect(AudioSynthService.isMuted()).toBe(true);

    AudioSynthService.setVolume(0.8);
    expect(AudioSynthService.getVolume()).toBe(0.8);

    AudioSynthService.setVolume(1.5); // clamps to 1.0
    expect(AudioSynthService.getVolume()).toBe(1.0);

    AudioSynthService.setVolume(-0.2); // clamps to 0.0
    expect(AudioSynthService.getVolume()).toBe(0.0);
  });

  it('plays target hit effect when unmuted', () => {
    AudioSynthService.setMuted(false);
    AudioSynthService.setVolume(0.5);

    AudioSynthService.playTargetHit(2);
    expect(mockAudioContext.createOscillator).toHaveBeenCalled();
    expect(mockOscillator.start).toHaveBeenCalled();
    expect(mockOscillator.stop).toHaveBeenCalled();
  });

  it('does not trigger audio nodes when muted', () => {
    AudioSynthService.setMuted(true);
    AudioSynthService.playTargetHit(5);
    expect(mockAudioContext.createOscillator).not.toHaveBeenCalled();
  });

  it('plays combo streak, hazard, and buzzer sounds without throwing', () => {
    AudioSynthService.setMuted(false);
    expect(() => AudioSynthService.playComboStreak(3)).not.toThrow();
    expect(() => AudioSynthService.playHazardPenalty()).not.toThrow();
    expect(() => AudioSynthService.playBuzzer()).not.toThrow();
    expect(() => AudioSynthService.playCountdownTick(true)).not.toThrow();
  });
});
