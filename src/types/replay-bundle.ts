/**
 * Verifiable Game Replay Bundle Schema
 * Cryptographically sealed game input and state stream used for on-chain
 * attestation, dispute challenges, and determinism audits.
 */

export type ReplayActionType =
  | 'MOVE_UP'
  | 'MOVE_DOWN'
  | 'MOVE_LEFT'
  | 'MOVE_RIGHT'
  | 'FIRE_WATER_BALLOON'
  | 'COLLECT_POWERUP'
  | 'SPLASH_HIT'
  | 'MATCH_START'
  | 'MATCH_END';

export interface ReplayTickEvent {
  tickIndex: number;
  playerIndex: number;
  action: ReplayActionType | string;
  payload?: Record<string, unknown>;
  timestamp: number;
}

export interface PlayerScoreSummary {
  playerAddress: string;
  score: number;
  rank: number;
  hitsDealt: number;
  hitsReceived: number;
  waterBalloonsThrown: number;
}

export interface ReplayEnvelopeMetadata {
  engineVersion: string;
  gameId: string;
  seed: number;
  durationMs: number;
  clientUserAgent?: string;
  recordingCompletedAt: number;
}

export interface VerifiableReplayBundle {
  version: '1.0.0' | string;
  matchId: string;
  tournamentId: string;
  players: string[];
  finalScores: Record<string, number>;
  scoreSummaries: PlayerScoreSummary[];
  stateRootSha256: string;
  ticks: ReplayTickEvent[];
  metadata: ReplayEnvelopeMetadata;
  timestamp: number;
}
