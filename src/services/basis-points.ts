/**
 * Financial governance utility ensuring exact 10,000 Basis Points (bps) distribution invariants
 * and deterministic integer dust settlement for Soroban prize pools.
 */

export const TOTAL_BASIS_POINTS = 10_000;

export interface ShareAllocation {
  rank: number;
  bps: number;
  percentageString: string;
  payoutStroops: bigint;
  dustAllocatedStroops: bigint;
}

export class BasisPointsCalculator {
  /**
   * Asserts whether a list of basis points equals exactly 10,000 bps (100.00%).
   */
  public static isValidDistribution(bpsList: number[]): boolean {
    if (!bpsList || bpsList.length === 0) return false;
    const sum = bpsList.reduce((acc, curr) => acc + curr, 0);
    return sum === TOTAL_BASIS_POINTS;
  }

  /**
   * Formats basis points into human-readable percentage with 2 decimals (e.g. 5000 -> '50.00%').
   */
  public static formatPercentage(bps: number): string {
    return `${(bps / 100).toFixed(2)}%`;
  }

  /**
   * Converts percentage number into basis points (e.g. 12.5 -> 1250 bps).
   */
  public static fromPercentage(percentage: number): number {
    return Math.round(percentage * 100);
  }

  /**
   * Calculates deterministic prize payouts across all ranks using integer floor arithmetic,
   * guaranteeing that any fractional dust remainder is allocated to Rank 1.
   * Total payouts will ALWAYS match totalPrizeStroops exactly.
   */
  public static calculatePayoutShares(
    totalPrizeStroops: bigint,
    bpsList: number[]
  ): ShareAllocation[] {
    if (!this.isValidDistribution(bpsList)) {
      throw new Error(`Basis points sum (${bpsList.reduce((a, b) => a + b, 0)}) must equal ${TOTAL_BASIS_POINTS}`);
    }

    let allocatedTotal = 0n;
    const initialShares: bigint[] = bpsList.map((bps) => {
      const share = (totalPrizeStroops * BigInt(bps)) / BigInt(TOTAL_BASIS_POINTS);
      allocatedTotal += share;
      return share;
    });

    const dust = totalPrizeStroops - allocatedTotal;

    return bpsList.map((bps, idx) => {
      const dustAddition = idx === 0 ? dust : 0n;
      const finalPayout = initialShares[idx] + dustAddition;

      return {
        rank: idx + 1,
        bps,
        percentageString: this.formatPercentage(bps),
        payoutStroops: finalPayout,
        dustAllocatedStroops: dustAddition,
      };
    });
  }
}
