/**
 * Player Profile & Reputation Type Definitions
 */

export interface PlayerCareerSummary {
  playerWallet: string;
  matchesPlayed: number;
  wins: number;
  totalScore: number;
  totalPrizesEarned: string;
  highestRank: number;
  winRatePercent: number;
  firstActiveAt: number;
  lastActiveAt: number;
}

export interface PlayerBadge {
  badgeId: string;
  name: string;
  description: string;
  icon: string;
  category: 'CHAMPION' | 'VETERAN' | 'SPLASHER' | 'SPEEDSTER';
  unlockedAt: number;
}

export interface PlayerHistoryRecord {
  tournamentId: string;
  title: string;
  rank: number;
  score: number;
  prizeWon?: string;
  asset?: string;
  completedAt: number;
  dateString: string;
}
