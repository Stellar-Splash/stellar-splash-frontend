import { describe, it, expect } from 'vitest';
import { generateLeaderboardCSV, generateLeaderboardJSON } from '../components/LeaderboardModal';
import { TournamentItem, LeaderboardEntry } from '../services/api';

describe('Leaderboard Data Export (CSV & JSON)', () => {
  const mockTournament: TournamentItem = {
    id: '42',
    name: 'Cosmic Splash Championship',
    description: 'A test tournament',
    creatorWallet: 'GBBD47IF6LWK7P7MDEVSCWR7DPUWV3NY3DTQEVFL4NAT4AQH3ZLLFLA5',
    prizePoolAmount: 1000,
    prizeAsset: 'XLM',
    startTime: 1000,
    endTime: 2000,
    maxParticipants: 16,
    currentParticipants: 2,
    gameId: 'splash-rush-v1',
    gameVersion: '1.0.0',
    vaultAddress: 'CACHWJEZY6JN36VFACWRQ7FP4T5EPRRRNBVLOSFHXTJHETZY36JD7QYJ',
    state: 'OPEN',
    createdAt: 1000,
    updatedAt: 1000,
  };

  const mockLeaderboard: LeaderboardEntry[] = [
    {
      rank: 1,
      playerWallet: 'GAAAZZZ111222333444555666777888999AAABBBCCCDDDEEEFFFGGG',
      shortWallet: 'GAAA...FGGG',
      currentScore: 1250,
      matchesPlayed: 3,
      status: 'ACTIVE',
      scoreLabel: 'Current Score',
      finalVerifiedResult: {
        score: 1250,
        resultHash: 'abcdef0123456789abcdef0123456789abcdef0123456789abcdef0123456789',
        verified: true,
      },
    },
    {
      rank: 2,
      playerWallet: 'GBBBZZZ111222333444555666777888999AAABBBCCCDDDEEEFFFGGG',
      shortWallet: 'GBBB...FGGG',
      currentScore: 920,
      matchesPlayed: 2,
      status: 'ACTIVE',
      scoreLabel: 'Current Score',
      finalVerifiedResult: null,
    },
  ];

  it('generates valid RFC-compliant CSV with headers and row fields', () => {
    const csv = generateLeaderboardCSV(mockTournament, mockLeaderboard);
    expect(csv).toContain('Rank,PlayerWallet,CurrentScore,MatchesPlayed,VerificationStatus,VerifiedScore,ResultHash');
    
    // First row (verified)
    expect(csv).toContain('1,"GAAAZZZ111222333444555666777888999AAABBBCCCDDDEEEFFFGGG",1250,3,VERIFIED,1250,"abcdef0123456789abcdef0123456789abcdef0123456789abcdef0123456789"');

    // Second row (pending verification)
    expect(csv).toContain('2,"GBBBZZZ111222333444555666777888999AAABBBCCCDDDEEEFFFGGG",920,2,PENDING,,');
  });

  it('generates structured JSON export payload containing tournament telemetry and participants', () => {
    const json = generateLeaderboardJSON(mockTournament, mockLeaderboard);
    expect(json.tournamentId).toBe('42');
    expect(json.tournamentName).toBe('Cosmic Splash Championship');
    expect(json.totalParticipants).toBe(2);
    expect(json.leaderboard).toHaveLength(2);
    expect(json.leaderboard[0].rank).toBe(1);
    expect(json.leaderboard[0].currentScore).toBe(1250);
    expect(json.exportedAt).toBeDefined();
  });
});
