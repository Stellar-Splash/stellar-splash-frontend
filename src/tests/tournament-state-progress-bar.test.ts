import { describe, it, expect } from 'vitest';
import React from 'react';
import { renderToString } from 'react-dom/server';
import { TournamentStateProgressBar } from '../components/TournamentStateProgressBar';

describe('TournamentStateProgressBar Component', () => {
  it('renders all steps and marks Created as active', () => {
    const html = renderToString(
      React.createElement(TournamentStateProgressBar, {
        currentState: 'CREATED',
      })
    );

    expect(html).toContain('Created');
    expect(html).toContain('Escrow Funding');
    expect(html).toContain('Open');
    expect(html).toContain('In Progress');
    expect(html).toContain('Challenge Window');
    expect(html).toContain('Settled');
  });

  it('renders completed checkmarks for past steps when InProgress', () => {
    const html = renderToString(
      React.createElement(TournamentStateProgressBar, {
        currentState: 'IN_PROGRESS',
      })
    );

    expect(html).toContain('✓');
  });

  it('renders cancelled state banner when tournament is cancelled', () => {
    const html = renderToString(
      React.createElement(TournamentStateProgressBar, {
        currentState: 'CANCELLED',
      })
    );

    expect(html).toContain('Tournament Cancelled — Escrow Refund Worker Active');
    expect(html).not.toContain('Escrow Funding');
  });
});
