import { describe, it, expect } from 'vitest';
import React from 'react';
import { renderToString } from 'react-dom/server';
import { PayoutBasisPointsChart } from '../components/PayoutBasisPointsChart';
import { PayoutDistributionModel } from '../types/payout-distribution';

describe('PayoutBasisPointsChart Component', () => {
  const model: PayoutDistributionModel = {
    totalPrizePoolXlm: 500,
    tiers: [
      { rank: 1, basisPoints: 5000, label: '1st Place', color: '#eab308' },
      { rank: 2, basisPoints: 3000, label: '2nd Place', color: '#38bdf8' },
      { rank: 3, basisPoints: 2000, label: '3rd Place', color: '#a855f7' },
    ],
  };

  it('renders SVG donut segments for each payout tier', () => {
    const html = renderToString(<PayoutBasisPointsChart distribution={model} />);
    expect(html).toContain('<svg');
    expect(html).toContain('circle');
    expect(html).toContain('donut-total-amount');
    expect(html).toContain('500');
    expect(html).toContain('Total Pool');
  });

  it('renders legend rows with basis points percentages and computed XLM payouts', () => {
    const html = renderToString(<PayoutBasisPointsChart distribution={model} />);
    expect(html).toContain('1st Place');
    expect(html).toContain('50');
    expect(html).toContain('250.0');

    expect(html).toContain('2nd Place');
    expect(html).toContain('30');
    expect(html).toContain('150.0');

    expect(html).toContain('3rd Place');
    expect(html).toContain('20');
    expect(html).toContain('100.0');
  });
});
