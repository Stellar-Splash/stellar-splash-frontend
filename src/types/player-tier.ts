/**
 * Type definitions for competitive player tier divisions and leaderboard reporting.
 */

export type PlayerTier = 'BRONZE' | 'SILVER' | 'GOLD' | 'PLATINUM' | 'DIAMOND';

export interface PlayerTierInfo {
  tier: PlayerTier;
  tierPoints: number;
  winRatePct: number;
  nextTier: PlayerTier | null;
  progressToNextPct: number;
}

export interface LeaderboardExportFormatOptions {
  format: 'csv' | 'json';
  includeAttestations?: boolean;
  minScoreFilter?: number;
}
