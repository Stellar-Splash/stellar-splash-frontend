import { describe, it, expect, vi } from 'vitest';
import React from 'react';
import { renderToString } from 'react-dom/server';
import { TournamentFilterBar } from '../components/TournamentFilterBar';

describe('TournamentFilterBar Component', () => {
  const defaultProps = {
    searchQuery: 'Genesis Cup',
    onSearchChange: vi.fn(),
    statusFilter: 'OPEN',
    onStatusChange: vi.fn(),
    assetFilter: 'USDC',
    onAssetChange: vi.fn(),
    sortBy: 'prize_desc',
    onSortChange: vi.fn(),
  };

  it('renders all filter controls and input fields', () => {
    const html = renderToString(React.createElement(TournamentFilterBar, defaultProps));

    expect(html).toContain('data-testid="tournament-filter-bar"');
    expect(html).toContain('value="Genesis Cup"');
    expect(html).toContain('Search tournaments by name or ID...');
    expect(html).toContain('All Statuses');
    expect(html).toContain('Open (Joinable)');
    expect(html).toContain('All Assets');
    expect(html).toContain('Highest Prize Pool');
  });

  it('reflects selected status and asset filters in select values', () => {
    const html = renderToString(React.createElement(TournamentFilterBar, defaultProps));

    expect(html).toContain('value="OPEN"');
    expect(html).toContain('value="USDC"');
    expect(html).toContain('value="prize_desc"');
  });
});
