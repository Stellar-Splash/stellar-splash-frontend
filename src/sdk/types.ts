/**
 * Stellar Splash Client SDK - Core Types
 */

export interface SdkConfig {
  network: 'testnet' | 'public';
  contractId: string;
  rpcUrl: string;
  horizonUrl: string;
}

export interface TournamentMetadata {
  id: number;
  title: string;
  entryFeeXlm: number;
  prizePoolXlm: number;
  maxPlayers: number;
  currentPlayers: number;
  status: 'Created' | 'Active' | 'Settled' | 'Cancelled';
  endLedger: number;
}

export interface PlayerScoreSubmission {
  tournamentId: number;
  playerAddress: string;
  score: number;
  tickCount: number;
  replayPayloadHash: string;
  entropyScore: number;
}

export interface SolvencyAuditResult {
  contractVaultBalance: number;
  totalTournamentLiabilities: number;
  isSolvent: boolean;
  deltaXlm: number;
  timestamp: string;
}

