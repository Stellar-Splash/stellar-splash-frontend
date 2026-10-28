import { describe, it, expect } from 'vitest';
import { calculateSettlementTimeRemaining } from '../components/SettlementModal';

describe('Settlement Countdown Logic', () => {
  it('correctly reports tournament ended and settlement ready when endTime is in the past', () => {
    const nowMs = 1700000000000;
    const pastEndTime = 1699999000; // seconds (< 1e11)

    const res = calculateSettlementTimeRemaining(pastEndTime, nowMs);
    expect(res.isEnded).toBe(true);
    expect(res.totalSecondsRemaining).toBe(0);
    expect(res.formatted).toContain('Elapsed');
  });

  it('correctly calculates remaining hours, minutes, and seconds when endTime is in the future', () => {
    const nowMs = 1700000000000;
    // 2 hours, 15 minutes, 30 seconds into future
    const futureEndTimeMs = nowMs + (2 * 3600 + 15 * 60 + 30) * 1000;

    const res = calculateSettlementTimeRemaining(futureEndTimeMs, nowMs);
    expect(res.isEnded).toBe(false);
    expect(res.hours).toBe(2);
    expect(res.minutes).toBe(15);
    expect(res.seconds).toBe(30);
    expect(res.formatted).toBe('02:15:30');
  });

  it('formats multi-day remaining durations cleanly', () => {
    const nowMs = 1700000000000;
    // 3 days, 4 hours, 5 minutes, 6 seconds
    const futureEndTimeMs = nowMs + (3 * 86400 + 4 * 3600 + 5 * 60 + 6) * 1000;

    const res = calculateSettlementTimeRemaining(futureEndTimeMs, nowMs);
    expect(res.isEnded).toBe(false);
    expect(res.days).toBe(3);
    expect(res.hours).toBe(4);
    expect(res.minutes).toBe(5);
    expect(res.seconds).toBe(6);
    expect(res.formatted).toBe('3d 04h 05m 06s');
  });
});
