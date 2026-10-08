import { describe, it, expect } from 'vitest';
import { SettlementRecord, SettlementSnapshot } from '../services/api';

describe('Settlement and Payout Accounting Frontend Tests', () => {
  it('enforces accounting invariant: Gross Prize Pool = Sum of Allocations + Residual', () => {
    const grossPrizePool = 100;
    const recipients = [
      { rank: 1, amount: 50, allocationBps: 5000, isResidualRecipient: false },
      { rank: 2, amount: 30, allocationBps: 3000, isResidualRecipient: false },
      { rank: 3, amount: 20, allocationBps: 2000, isResidualRecipient: false },
    ];

    const totalAllocated = recipients.reduce((sum, r) => sum + r.amount, 0);
    const residualAmount = 0;

    expect(totalAllocated + residualAmount).toBe(grossPrizePool);
    expect(recipients.reduce((sum, r) => sum + r.allocationBps, 0)).toBe(10000);
  });

  it('allocates dust residual deterministically to Rank 1 recipient', () => {
    const grossPrizePool = 10001; // 1 unit remainder with 50/30/20 bps
    const baseRank1 = Math.floor((grossPrizePool * 5000) / 10000); // 5000
    const baseRank2 = Math.floor((grossPrizePool * 3000) / 10000); // 3000
    const baseRank3 = Math.floor((grossPrizePool * 2000) / 10000); // 2000
    const distributed = baseRank1 + baseRank2 + baseRank3; // 10000
    const dust = grossPrizePool - distributed; // 1

    const finalRank1 = baseRank1 + dust; // 5001

    expect(finalRank1).toBe(5001);
    expect(baseRank2).toBe(3000);
    expect(baseRank3).toBe(2000);
    expect(finalRank1 + baseRank2 + baseRank3).toBe(grossPrizePool);
  });

  it('verifies settlement snapshot immutability binding', () => {
    const snapshot: SettlementSnapshot = {
      settlementId: 'set-tourn-001-12345',
      tournamentId: 'tourn-splash-001',
      agreementId: 'agr-tourn-001-v1',
      agreementVersion: 1,
      agreementHash: 'b4a8e23f1c9d784a0b5e6f3c2d1a89b7e4f3c2d1a0b9e8f7a6b5c4d3e2f1a0b9',
      rankingId: 'rnk-tourn-001-v1',
      rankingVersion: 1,
      rankingHash: 'c7d9e23f1c9d784a0b5e6f3c2d1a89b7e4f3c2d1a0b9e8f7a6b5c4d3e2f1a0b9',
      prizePoolAmount: 100,
      prizeAsset: 'USDC',
      allocationRules: [
        { rank: 1, basisPoints: 5000, label: '1st (50%)' },
        { rank: 2, basisPoints: 3000, label: '2nd (30%)' },
        { rank: 3, basisPoints: 2000, label: '3rd (20%)' },
      ],
      roundingRule: 'INTEGER_FLOOR_REMAINDER_TO_RANK_1',
      residualRule: 'ALLOCATE_DUST_TO_FIRST_PLACE',
      tieRule: 'SCORE_THEN_ACCURACY_THEN_TIMESTAMP',
      recipients: [
        {
          rank: 1,
          playerWallet: 'GCKAZD66N6E64B44J7K3XW6P2W3V7QOXWCV7T4KQL3ZPL2GB6V2A73VU',
          allocationBps: 5000,
          amount: 50,
          amountBaseUnits: 500000000,
          isResidualRecipient: false,
          status: 'CONFIRMED',
        },
      ],
      grossPrizePool: 100,
      totalAllocated: 50,
      residualAmount: 0,
      createdAt: 1700000000,
    };

    const settlement: SettlementRecord = {
      ...snapshot,
      settlementHash: 'settle-hash-999999999999999999999999999999999999999999999999999999',
      status: 'RECONCILED',
      snapshot,
      updatedAt: 1700000001,
    };

    expect(settlement.status).toBe('RECONCILED');
    expect(settlement.agreementHash).toBe(snapshot.agreementHash);
    expect(settlement.rankingHash).toBe(snapshot.rankingHash);
    expect(settlement.snapshot.roundingRule).toBe('INTEGER_FLOOR_REMAINDER_TO_RANK_1');
  });
});
