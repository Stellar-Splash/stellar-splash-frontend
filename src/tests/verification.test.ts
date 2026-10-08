import { describe, it, expect, vi } from 'vitest';
import { ApiClient } from '../services/api';

describe('Frontend Verification API Client', () => {
  it('fetches match verification record with cryptographic attestation', async () => {
    const mockVerification = {
      verificationId: 'verif-test-001',
      matchId: 'match-genesis-001',
      tournamentId: 'tourn-splash-001',
      playerWallet: 'GCKAZD66N6E64B44J7K3XW6P2W3V7QOXWCV7T4KQL3ZPL2GB6V2A73VU',
      gameVersion: '1.0.0',
      submittedScore: 2450,
      replayedScore: 2450,
      scoreMatch: true,
      resultHash: '7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b',
      verificationAlgorithm: 'DETERMINISTIC_REPLAY_ENGINE',
      verificationVersion: '1.0.0',
      verifier: 'verifier.stellar-splash.org',
      verifiedAt: Date.now(),
      status: 'VERIFIED' as const,
      attestation: {
        attestationId: 'attest-001',
        tournamentId: 'tourn-splash-001',
        matchId: 'match-genesis-001',
        playerWallet: 'GCKAZD66N6E64B44J7K3XW6P2W3V7QOXWCV7T4KQL3ZPL2GB6V2A73VU',
        resultHash: '7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b',
        finalScore: 2450,
        verificationVersion: '1.0.0',
        verifierIdentity: 'verifier.stellar-splash.org',
        timestamp: Date.now(),
        attestationDigest: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
      },
    };

    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      json: async () => ({ success: true, verification: mockVerification }),
    }));

    const res = await ApiClient.getVerification('match-genesis-001');

    expect(res.success).toBe(true);
    expect(res.verification).toBeDefined();
    expect(res.verification?.status).toBe('VERIFIED');
    expect(res.verification?.scoreMatch).toBe(true);
    expect(res.verification?.resultHash).toHaveLength(64);
    expect(res.verification?.attestation?.verifierIdentity).toBe('verifier.stellar-splash.org');
  });

  it('triggers match verification against independent replay engine', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      json: async () => ({
        success: true,
        verification: {
          verificationId: 'verif-new-002',
          matchId: 'match-play-123',
          tournamentId: 'tourn-splash-001',
          playerWallet: 'GCKAZD66N6E64B44J7K3XW6P2W3V7QOXWCV7T4KQL3ZPL2GB6V2A73VU',
          gameVersion: '1.0.0',
          submittedScore: 1800,
          replayedScore: 1800,
          scoreMatch: true,
          resultHash: 'a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2',
          verificationAlgorithm: 'DETERMINISTIC_REPLAY_ENGINE',
          verificationVersion: '1.0.0',
          verifier: 'verifier.stellar-splash.org',
          verifiedAt: Date.now(),
          status: 'VERIFIED',
        },
      }),
    }));

    const res = await ApiClient.verifyMatch('match-play-123');
    expect(res.success).toBe(true);
    expect(res.verification?.status).toBe('VERIFIED');
  });
});
