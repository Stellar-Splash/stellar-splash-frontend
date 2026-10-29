import { describe, it, expect, vi } from 'vitest';
import React from 'react';
import { renderToString } from 'react-dom/server';
import { ReplayExportButton } from '../components/ReplayExportButton';

describe('ReplayExportButton Component', () => {
  const dummyMatch = {
    matchId: 'match-xyz-99',
    tournamentId: 'tourn-1',
    player: 'GBZXTESTNETUSERWALLET1234567890',
    score: 1850,
    seed: 'seed-test-1234',
    durationMs: 45000,
    signature: 'sig-abc-123',
    ticks: [{ tick: 1, x: 100, y: 150, t: 10, type: 'HIT' }],
  };

  it('renders button with export label and accessible attributes', () => {
    const html = renderToString(
      React.createElement(ReplayExportButton, {
        matchData: dummyMatch,
      })
    );

    expect(html).toContain('data-testid="replay-export-button"');
    expect(html).toContain('Export Replay Proof (.json)');
    expect(html).toContain('Download verifiable cryptographic match replay for match-xyz-99');
  });

  it('supports custom button label', () => {
    const html = renderToString(
      React.createElement(ReplayExportButton, {
        matchData: dummyMatch,
        label: 'Save Proof Bundle',
      })
    );

    expect(html).toContain('Save Proof Bundle');
  });
});
