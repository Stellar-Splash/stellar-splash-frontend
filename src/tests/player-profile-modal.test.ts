import { describe, it, expect, vi } from 'vitest';
import React from 'react';
import { renderToString } from 'react-dom/server';
import { PlayerProfileModal } from '../components/PlayerProfileModal';

describe('PlayerProfileModal Component', () => {
  const dummyWallet = 'GBBD47IF6LWK7P7MDEVSCWR7DPUWV3NY3DTQEVFL4NAT4AQH3ZLLFLA5';

  it('returns null when isOpen is false', () => {
    const html = renderToString(
      React.createElement(PlayerProfileModal, {
        isOpen: false,
        onClose: vi.fn(),
        playerAddress: dummyWallet,
      })
    );
    expect(html).toBe('');
  });

  it('renders modal with player stats and win rate', () => {
    const html = renderToString(
      React.createElement(PlayerProfileModal, {
        isOpen: true,
        onClose: vi.fn(),
        playerAddress: dummyWallet,
        stats: {
          matchesPlayed: 20,
          wins: 5,
          totalScore: 25000,
          totalPrizesEarned: '250 XLM',
          highestRank: 1,
        },
      })
    );

    expect(html).toContain('Player Profile');
    expect(html).toContain('25%'); // 5 / 20 = 25%
    expect(html).toContain('5 wins / 20 matches');
    expect(html).toContain('250 XLM');
    expect(html).toContain('Rank #1');
    expect(html).toContain('25,000');
  });

  it('renders match history records when provided', () => {
    const html = renderToString(
      React.createElement(PlayerProfileModal, {
        isOpen: true,
        onClose: vi.fn(),
        playerAddress: dummyWallet,
        history: [
          {
            tournamentId: 't-1',
            title: 'Sunday Splash Cup',
            rank: 1,
            score: 1200,
            prize: '50 XLM',
            date: 'Oct 28, 2026',
          },
        ],
      })
    );

    expect(html).toContain('Sunday Splash Cup');
    expect(html).toContain('Score: 1200');
    expect(html).toContain('+50 XLM');
  });
});
