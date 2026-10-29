import { describe, it, expect, vi } from 'vitest';
import React from 'react';
import { renderToString } from 'react-dom/server';
import { DisputeResolutionModal } from '../components/DisputeResolutionModal';

describe('DisputeResolutionModal Component', () => {
  it('returns null when isOpen is false', () => {
    const html = renderToString(
      React.createElement(DisputeResolutionModal, {
        isOpen: false,
        onClose: vi.fn(),
        tournamentId: '101',
      })
    );
    expect(html).toBe('');
  });

  it('renders dispute modal with challenge details and reason', () => {
    const html = renderToString(
      React.createElement(DisputeResolutionModal, {
        isOpen: true,
        onClose: vi.fn(),
        tournamentId: '202',
        dispute: {
          challengerWallet: 'GBBD47IF6LWK7P7MDEVSCWR7DPUWV3NY3DTQEVFL4NAT4AQH3ZLLFLA5',
          reasonCode: 104,
          reasonText: 'Irregular packet injection during round 3',
          submittedAt: 1700000000,
          status: 'ACTIVE',
        },
      })
    );

    expect(html).toContain('Dispute Review: Tournament #202');
    expect(html).toContain('Challenge Active');
    expect(html).toContain('Code: 104');
    expect(html).toContain('Irregular packet injection during round 3');
  });

  it('renders admin resolution action buttons when isAdmin is true', () => {
    const html = renderToString(
      React.createElement(DisputeResolutionModal, {
        isOpen: true,
        onClose: vi.fn(),
        tournamentId: '202',
        isAdmin: true,
        onResolve: vi.fn(),
        onDismiss: vi.fn(),
      })
    );

    expect(html).toContain('Resolve &amp; Unlock Vault');
    expect(html).toContain('Dismiss Challenge');
  });
});
