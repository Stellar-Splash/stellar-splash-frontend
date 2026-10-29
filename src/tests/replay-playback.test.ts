import { describe, it, expect, beforeEach } from 'vitest';
import { ReplayPlaybackService } from '../services/replay-playback.service';
import { ReplayKeyframe } from '../types/interactive-replay';

describe('ReplayPlaybackService', () => {
  let service: ReplayPlaybackService;
  const mockFrames: ReplayKeyframe[] = [
    { tick: 0, timestampMs: 0, playerPositions: {}, scores: { p1: 0 } },
    { tick: 10, timestampMs: 160, playerPositions: {}, scores: { p1: 10 } },
    { tick: 20, timestampMs: 320, playerPositions: {}, scores: { p1: 25 } },
  ];

  beforeEach(() => {
    service = new ReplayPlaybackService(mockFrames);
  });

  it('initializes with totalTicks matching final keyframe', () => {
    expect(service.getState().totalTicks).toBe(20);
    expect(service.getState().currentTick).toBe(0);
    expect(service.getState().isPlaying).toBe(false);
  });

  it('seeks to target tick within boundaries', () => {
    const frame = service.seekToTick(10);
    expect(service.getState().currentTick).toBe(10);
    expect(frame?.scores.p1).toBe(10);

    // Clamps beyond total ticks
    service.seekToTick(999);
    expect(service.getState().currentTick).toBe(20);

    // Clamps below 0
    service.seekToTick(-5);
    expect(service.getState().currentTick).toBe(0);
  });

  it('steps forward and backward by discrete intervals', () => {
    service.seekToTick(10);
    service.stepForward(5);
    expect(service.getState().currentTick).toBe(15);

    service.stepBackward(3);
    expect(service.getState().currentTick).toBe(12);
  });

  it('toggles playing state and updates playback speed', () => {
    expect(service.togglePlay()).toBe(true);
    expect(service.getState().isPlaying).toBe(true);

    service.setSpeed(2.0);
    expect(service.getState().playbackSpeed).toBe(2.0);
  });
});

