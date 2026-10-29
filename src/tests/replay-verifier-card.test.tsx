import { describe, it, expect } from 'vitest';
import React from 'react';
import { renderToString } from 'react-dom/server';
import { ReplayVerifierCard } from '../components/ReplayVerifierCard';

describe('ReplayVerifierCard Component', () => {
  it('renders initial form inputs and verification instructions', () => {
    const html = renderToString(
      <ReplayVerifierCard initialMatchId="match-cup-101" />
    );

    expect(html).toContain('role="region"');
    expect(html).toContain('Deterministic Replay Verifier');
    expect(html).toContain('match-cup-101');
    expect(html).toContain('Audit &amp; Verify Replay');
  });

  it('renders empty form state with placeholder text', () => {
    const html = renderToString(<ReplayVerifierCard />);

    expect(html).toContain('e.g. match-splash-rush-102');
    expect(html).toContain('Paste raw {&quot;version&quot;: 1, &quot;matchId&quot;: ...} bundle JSON');
  });
});
