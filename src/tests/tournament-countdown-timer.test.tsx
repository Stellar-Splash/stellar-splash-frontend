import { describe, it, expect, vi } from 'vitest';
import React from 'react';
import { renderToString } from 'react-dom/server';
import { TournamentCountdownTimer } from '../components/TournamentCountdownTimer';

describe('TournamentCountdownTimer Component', () => {
  it('renders countdown timer with formatted time remaining', () => {
    // 2 hours in the future
    const target = Date.now() + 2 * 3600 * 1000 + 15 * 60 * 1000;
    const html = renderToString(
      <TournamentCountdownTimer targetTimestamp={target} label="Round Ends In" />
    );

    expect(html).toContain('role="timer"');
    expect(html).toContain('Round Ends In:');
    expect(html).toContain('countdown-timer-container');
  });

  it('renders urgent style when time remaining is under 5 minutes', () => {
    // 2 minutes in the future
    const target = Date.now() + 120 * 1000;
    const html = renderToString(
      <TournamentCountdownTimer targetTimestamp={target} />
    );

    expect(html).toContain('urgent');
  });

  it('renders concluded expired state when timestamp is in past', () => {
    const past = Date.now() - 5000;
    const onExpireMock = vi.fn();
    const html = renderToString(
      <TournamentCountdownTimer targetTimestamp={past} onExpire={onExpireMock} />
    );

    expect(html).toContain('expired');
    expect(html).toContain('00:00:00');
    expect(html).toContain('Concluded');
  });
});
