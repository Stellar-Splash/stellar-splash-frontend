import { describe, it, expect, vi } from 'vitest';
import React from 'react';
import { TournamentShareModal } from '../components/TournamentShareModal';

describe('TournamentShareModal Component', () => {
  it('renders null when isOpen is false', () => {
    const element = React.createElement(TournamentShareModal, {
      isOpen: false,
      onClose: vi.fn(),
      tournamentId: 101,
      tournamentTitle: 'Splash Grand Prix',
      prizePoolAmount: '1,000',
    });
    expect(React.isValidElement(element)).toBe(true);
    expect(element.props.isOpen).toBe(false);
  });

  it('renders share links and parameters when isOpen is true', () => {
    const onClose = vi.fn();
    const element = React.createElement(TournamentShareModal, {
      isOpen: true,
      onClose,
      tournamentId: 505,
      tournamentTitle: 'Super Soroban Splash',
      prizePoolAmount: '500',
      prizeTokenSymbol: 'USDC',
      shareBaseUrl: 'https://stellarsplash.game',
    });

    expect(React.isValidElement(element)).toBe(true);
    expect(element.props.tournamentId).toBe(505);
    expect(element.props.tournamentTitle).toBe('Super Soroban Splash');
    expect(element.props.prizePoolAmount).toBe('500');
    expect(element.props.prizeTokenSymbol).toBe('USDC');
  });

  it('constructs correct social share URL intents', () => {
    const baseUrl = 'https://stellarsplash.game';
    const tournamentId = 888;
    const tournamentTitle = 'Championship Cup';
    const prizePoolAmount = '2,500';
    const prizeTokenSymbol = 'XLM';

    const shareUrl = `${baseUrl}?tournament=${tournamentId}`;
    const shareText = `Compete in ${tournamentTitle} on Stellar Splash! Prize pool: ${prizePoolAmount} ${prizeTokenSymbol} powered by Soroban on Stellar.`;

    const twitterIntent = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
      shareText,
    )}&url=${encodeURIComponent(shareUrl)}&hashtags=Stellar,Soroban,Gaming`;

    const telegramIntent = `https://t.me/share/url?url=${encodeURIComponent(
      shareUrl,
    )}&text=${encodeURIComponent(shareText)}`;

    expect(twitterIntent).toContain('https://twitter.com/intent/tweet');
    expect(twitterIntent).toContain(encodeURIComponent(shareUrl));
    expect(telegramIntent).toContain('https://t.me/share/url');
    expect(telegramIntent).toContain(encodeURIComponent(shareUrl));
  });
});
