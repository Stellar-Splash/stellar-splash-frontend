import { describe, it, expect, vi } from 'vitest';
import { ApiClient } from '../services/api';

describe('Frontend Prize Agreement Client & Validation', () => {
  it('retrieves locked tournament prize agreements', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      json: async () => ({
        success: true,
        agreements: [
          {
            agreementId: 'agr-tourn-splash-001-v1',
            tournamentId: 'tourn-splash-001',
            version: 1,
            prizeAsset: 'USDC',
            prizePoolAmount: 100,
            rankingMethod: 'FINAL_VERIFIED_SCORE',
            allocationRules: [
              { rank: 1, basisPoints: 5000, label: '1st Place (50%)' },
              { rank: 2, basisPoints: 3000, label: '2nd Place (30%)' },
              { rank: 3, basisPoints: 2000, label: '3rd Place (20%)' },
            ],
            tieRule: 'SCORE_THEN_ACCURACY_THEN_TIMESTAMP',
            roundingRule: 'INTEGER_FLOOR_REMAINDER_TO_RANK_1',
            residualRule: 'ALLOCATE_DUST_TO_FIRST_PLACE',
            agreementHash: 'b4a8e23f1c9d784a0b5e6f3c2d1a89b7e4f3c2d1a0b9e8f7a6b5c4d3e2f1a0b9',
            status: 'LOCKED',
            createdBy: 'GA2C5RFPE6GCKMY3US5PAB6UZLKIGAHWKXX2GAKVOOUMVQHGASVMOROB',
            createdAt: Date.now() - 3600000,
            approvedBy: 'GA2C5RFPE6GCKMY3US5PAB6UZLKIGAHWKXX2GAKVOOUMVQHGASVMOROB',
            approvedAt: Date.now() - 3500000,
            lockedAt: Date.now() - 3500000,
          },
        ],
      }),
    }));

    const res = await ApiClient.getTournamentAgreements('tourn-splash-001');
    expect(res.success).toBe(true);
    expect(res.agreements.length).toBe(1);

    const agreement = res.agreements[0];
    expect(agreement.status).toBe('LOCKED');
    expect(agreement.version).toBe(1);

    // Verify 10,000 basis points rule
    const totalBps = agreement.allocationRules.reduce((acc, r) => acc + r.basisPoints, 0);
    expect(totalBps).toBe(10000);
  });

  it('submits agreement approval bound to version and wallet', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      json: async () => ({
        success: true,
        agreement: {
          agreementId: 'agr-tourn-splash-001-v2',
          tournamentId: 'tourn-splash-001',
          version: 2,
          status: 'READY_TO_LOCK',
          approvedBy: 'GA2C5RFPE6GCKMY3US5PAB6UZLKIGAHWKXX2GAKVOOUMVQHGASVMOROB',
        },
      }),
    }));

    const res = await ApiClient.approveAgreement(
      'tourn-splash-001',
      2,
      'GA2C5RFPE6GCKMY3US5PAB6UZLKIGAHWKXX2GAKVOOUMVQHGASVMOROB'
    );

    expect(res.success).toBe(true);
    expect(res.agreement?.status).toBe('READY_TO_LOCK');
  });
});
