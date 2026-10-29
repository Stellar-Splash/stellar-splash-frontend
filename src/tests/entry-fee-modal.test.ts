import { describe, it, expect, vi } from 'vitest';
import React from 'react';
import { renderToString } from 'react-dom/server';
import { EntryFeeModal } from '../components/EntryFeeModal';

describe('EntryFeeModal Component', () => {
  it('renders nothing when isOpen is false', () => {
    const html = renderToString(
      React.createElement(EntryFeeModal, {
        isOpen: false,
        onClose: vi.fn(),
        tournamentId: 'tourn-101',
        tournamentTitle: 'Stellar Sprint',
        entryFee: 15,
      })
    );
    expect(html).toBe('');
  });

  it('renders modal with tournament title, fee breakdown, and player balance when open', () => {
    const html = renderToString(
      React.createElement(EntryFeeModal, {
        isOpen: true,
        onClose: vi.fn(),
        tournamentId: 'tourn-101',
        tournamentTitle: 'Stellar Sprint',
        entryFee: 15,
        assetSymbol: 'XLM',
        playerBalance: 45.5,
      })
    );

    expect(html).toContain('data-testid="entry-fee-modal"');
    expect(html).toContain('Stellar Sprint');
    expect(html).toContain('Tournament Entry Escrow');
    expect(html).toContain('15 XLM');
    expect(html).toContain('45.50 XLM');
    expect(html).toContain('Approve &amp; Deposit Entry Fee');
  });

  it('indicates disabled state when player balance is insufficient', () => {
    const html = renderToString(
      React.createElement(EntryFeeModal, {
        isOpen: true,
        onClose: vi.fn(),
        tournamentId: 'tourn-102',
        tournamentTitle: 'High Stakes Cup',
        entryFee: 100,
        assetSymbol: 'XLM',
        playerBalance: 20.0,
      })
    );

    expect(html).toContain('disabled=""');
    expect(html).toContain('100 XLM');
    expect(html).toContain('20.00 XLM');
  });
});
