import { describe, it, expect } from 'vitest';
import { BasisPointsCalculator, TOTAL_BASIS_POINTS } from '../services/basis-points';

describe('BasisPointsCalculator', () => {
  it('validates 10,000 bps invariant distributions', () => {
    expect(BasisPointsCalculator.isValidDistribution([5000, 3000, 2000])).toBe(true);
    expect(BasisPointsCalculator.isValidDistribution([7000, 2000, 1000])).toBe(true);
    expect(BasisPointsCalculator.isValidDistribution([5000, 3000])).toBe(false); // 8000
    expect(BasisPointsCalculator.isValidDistribution([5000, 3000, 2001])).toBe(false); // 10001
  });

  it('formats percentages accurately', () => {
    expect(BasisPointsCalculator.formatPercentage(5000)).toBe('50.00%');
    expect(BasisPointsCalculator.formatPercentage(3333)).toBe('33.33%');
    expect(BasisPointsCalculator.formatPercentage(50)).toBe('0.50%');
  });

  it('converts percentages into basis points', () => {
    expect(BasisPointsCalculator.fromPercentage(50)).toBe(5000);
    expect(BasisPointsCalculator.fromPercentage(12.5)).toBe(1250);
  });

  it('distributes prize pool with exact integer precision and allocates dust to Rank 1', () => {
    // 100 XLM = 1,000,000,000 Stroops
    // Distribution: 50% (5000), 30% (3000), 20% (2000)
    const totalPrize = 1_000_000_000n;
    const bps = [5000, 3000, 2000];

    const result = BasisPointsCalculator.calculatePayoutShares(totalPrize, bps);

    expect(result.length).toBe(3);
    expect(result[0].payoutStroops).toBe(500_000_000n);
    expect(result[1].payoutStroops).toBe(300_000_000n);
    expect(result[2].payoutStroops).toBe(200_000_000n);

    // Sum must equal totalPrize exactly
    const totalAllocated = result.reduce((sum, item) => sum + item.payoutStroops, 0n);
    expect(totalAllocated).toBe(totalPrize);
  });

  it('allocates fractional dust remainders to Rank 1 deterministically', () => {
    // Total: 10,001 Stroops (odd number where division by 10,000 leaves remainder)
    // 50% = 5000 Stroops, 30% = 3000 Stroops, 20% = 2000 Stroops -> Sum = 10,000 Stroops, Dust = 1 Stroop
    const totalPrize = 10_001n;
    const bps = [5000, 3000, 2000];

    const result = BasisPointsCalculator.calculatePayoutShares(totalPrize, bps);

    expect(result[0].dustAllocatedStroops).toBe(1n);
    expect(result[0].payoutStroops).toBe(5001n);
    expect(result[1].payoutStroops).toBe(3000n);
    expect(result[2].payoutStroops).toBe(2000n);

    const sum = result.reduce((acc, curr) => acc + curr.payoutStroops, 0n);
    expect(sum).toBe(totalPrize);
  });

  it('throws an error if bps list does not total 10,000', () => {
    expect(() =>
      BasisPointsCalculator.calculatePayoutShares(1_000_000n, [5000, 4000])
    ).toThrow(`must equal ${TOTAL_BASIS_POINTS}`);
  });
});
