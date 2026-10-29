import { describe, it, expect, vi } from 'vitest';
import React from 'react';
import { renderToString } from 'react-dom/server';
import {
  SolvencyStatusCard,
  getSolvencyRating,
} from '../components/SolvencyStatusCard';

describe('SolvencyStatusCard Component', () => {
  it('correctly calculates solvency ratings based on reserve ratios', () => {
    expect(getSolvencyRating(1000, 1000)).toBe('SOLVENT');
    expect(getSolvencyRating(1500, 1000)).toBe('SOLVENT');
    expect(getSolvencyRating(960, 1000)).toBe('MARGINAL');
    expect(getSolvencyRating(900, 1000)).toBe('DEFICIT');
    expect(getSolvencyRating(500, 0)).toBe('SOLVENT');
  });

  it('renders solvent card when vault balance fully covers obligations', () => {
    const html = renderToString(
      <SolvencyStatusCard
        assetCode="USDC"
        vaultBalance={12500}
        totalObligations={10000}
      />
    );

    expect(html).toContain('role="region"');
    expect(html).toContain('solvency-solvent');
    expect(html).toContain('12,500 USDC');
    expect(html).toContain('10,000 USDC');
    expect(html).toContain('125%');
  });

  it('renders deficit card when balance falls short of obligations', () => {
    const html = renderToString(
      <SolvencyStatusCard
        assetCode="XLM"
        vaultBalance={8000}
        totalObligations={10000}
        onRefresh={vi.fn()}
      />
    );

    expect(html).toContain('solvency-deficit');
    expect(html).toContain('DEFICIT');
    expect(html).toContain('80%');
    expect(html).toContain('Reconcile Ledger Balance');
  });
});
