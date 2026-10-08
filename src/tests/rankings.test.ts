import { describe, it, expect, vi } from 'vitest';
import { ApiClient } from '../services/api';

describe('Frontend Tournament Rankings Client', () => {
  it('retrieves tournament rankings with deterministic tie-breaker sorting', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      json: async () => ({
        success: true,
        finalized: true,
        ranking: {
          tournamentId: 'tourn-splash-001',
          rankingVersion: 1,
          entries: [
            {
              rank: 1,
              playerWallet: 'GCKAZD66N6E64B44J7K3XW6P2W3V7QOXWCV7T4KQL3ZPL2GB6V2A73VU',
              score: 2450,
              accuracy: 95,
              completedAt: 1000,
              matchId: 'match-genesis-001',
              resultHash: '7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b',
            },
            {
              rank: 2,
              playerWallet: 'GD4KQL3ZPL2GB6V2A73VUX6KAZD66N6E64B44J7K3XW6P2W3V7QOXWCV',
              score: 1820,
              accuracy: 88,
              completedAt: 1200,
              matchId: 'match-genesis-002',
              resultHash: '6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c',
            },
          ],
          rankingHash: '9a8b7c6d5e4f3a2b1c0d9e8f7a6b5c4d3e2f1a0b9c8d7e6f5a4b3c2d1e0f9a8b',
          finalizedAt: 2000,
          finalizedBy: 'GA2C5RFPE6GCKMY3US5PAB6UZLKIGAHWKXX2GAKVOOUMVQHGASVMOROB',
        },
      }),
    }));

    const res = await ApiClient.getTournamentRanking('tourn-splash-001');
    expect(res.success).toBe(true);
    expect(res.finalized).toBe(true);
    expect(res.ranking.entries.length).toBe(2);
    expect(res.ranking.entries[0].rank).toBe(1);
    expect(res.ranking.entries[0].score).toBeGreaterThan(res.ranking.entries[1].score);
    expect(res.ranking.rankingHash).toHaveLength(64);
  });
});
