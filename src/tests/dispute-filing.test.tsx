import { describe, it, expect } from 'vitest';
import React from 'react';
import { renderToString } from 'react-dom/server';
import { DisputeFilingModal } from '../components/DisputeFilingModal';

describe('DisputeFilingModal Component', () => {
  it('renders nothing when isOpen is false', () => {
    const html = renderToString(
      <DisputeFilingModal
        isOpen={false}
        tournamentId={105}
        matchId="MATCH_99"
        challengerWallet="GCHALLENGER_1"
        onClose={() => {}}
        onSubmit={() => {}}
      />
    );
    expect(html).toBe('');
  });

  it('renders tournament metadata and dispute reasons when opened', () => {
    const html = renderToString(
      <DisputeFilingModal
        isOpen={true}
        tournamentId={105}
        matchId="MATCH_99"
        challengerWallet="GCHALLENGER_1"
        onClose={() => {}}
        onSubmit={() => {}}
      />
    );
    expect(html).toContain('Contest Tournament Outcome');
    expect(html).toContain('Tournament ID');
    expect(html).toContain('105');
    expect(html).toContain('MATCH_99');
    expect(html).toContain('Simulation Desync');
    expect(html).toContain('Input Telemetry Anomaly');
  });
});
