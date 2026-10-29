import { describe, it, expect } from 'vitest';
import React from 'react';
import { renderToString } from 'react-dom/server';
import { MatchAttestationBadge } from '../components/MatchAttestationBadge';

describe('MatchAttestationBadge Component', () => {
  it('renders pending status badge by default', () => {
    const html = renderToString(
      React.createElement(MatchAttestationBadge, {
        status: 'PENDING',
      })
    );
    expect(html).toContain('Attestation Pending');
  });

  it('renders attested status with truncated hash when showDetails is true', () => {
    const dummyHash = '0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef';
    const html = renderToString(
      React.createElement(MatchAttestationBadge, {
        status: 'ATTESTED',
        attestationHash: dummyHash,
        showDetails: true,
      })
    );
    expect(html).toContain('Attested on Soroban');
    expect(html).toContain('01234567...abcdef');
  });

  it('renders disputed and settled states correctly', () => {
    const disputedHtml = renderToString(
      React.createElement(MatchAttestationBadge, {
        status: 'DISPUTED',
      })
    );
    expect(disputedHtml).toContain('Dispute Active');

    const settledHtml = renderToString(
      React.createElement(MatchAttestationBadge, {
        status: 'SETTLED',
      })
    );
    expect(settledHtml).toContain('Settled &amp; Distributed');
  });
});
