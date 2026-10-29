import { describe, it, expect } from 'vitest';
import React from 'react';
import { renderToString } from 'react-dom/server';
import { TokenAllowlistBadge } from '../components/TokenAllowlistBadge';

describe('TokenAllowlistBadge Component', () => {
  it('renders verified shield badge for whitelisted assets', () => {
    const html = renderToString(
      React.createElement(TokenAllowlistBadge, {
        assetAddress: 'CDLZFC3SYJYDZT7K67VZ75HPJVIEUVNIXF47ZG2FB2RMQQVU2HHGCYSC',
        symbol: 'USDC',
        isWhitelisted: true,
        showAddress: true,
      })
    );

    expect(html).toContain('data-testid="token-allowlist-badge"');
    expect(html).toContain('USDC • VERIFIED');
    expect(html).toContain('(CDLZ...CYSC)');
    expect(html).toContain('color:var(--emerald-glow, #10b981)');
  });

  it('renders custom SAC alert badge for unverified assets', () => {
    const html = renderToString(
      React.createElement(TokenAllowlistBadge, {
        assetAddress: 'CA3D5KRYM6CB7OWQ6TWYRR3Z4T7GNZLKODWW542GAKVOOUMVQHGASVMO',
        symbol: 'CUSTOM',
        isWhitelisted: false,
      })
    );

    expect(html).toContain('data-testid="token-allowlist-badge"');
    expect(html).toContain('CUSTOM • CUSTOM SAC');
    expect(html).toContain('color:var(--gold-glow, #ffb800)');
    expect(html).toContain('Ensure you trust this contract issuer');
  });
});
