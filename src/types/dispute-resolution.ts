/**
 * Type definitions and schemas for tournament dispute resolution.
 * Synchronized with on-chain Soroban DisputeRecord and backend DisputeResolutionService.
 */

export type DisputeLifecycleStatus = 'ACTIVE' | 'RESOLVED' | 'DISMISSED';

export enum DisputeReasonCode {
  TICK_DESYNC = 101,
  ILLEGAL_ACTION = 102,
  SCORE_ANOMALY = 103,
  TIMEOUT_ABUSE = 104,
  COLLUSION_SUSPECTED = 105,
  OTHER = 199,
}

export interface DisputeRecord {
  tournamentId: string;
  challengerWallet: string;
  reasonCode: DisputeReasonCode | number;
  reasonText: string;
  submittedAt: number;
  status: DisputeLifecycleStatus;
  evidenceHash?: string;
  resolutionNotes?: string;
  resolvedBy?: string;
  resolvedAt?: number;
}

export interface DisputeFilingPayload {
  tournamentId: string;
  challengerWallet: string;
  reasonCode: DisputeReasonCode | number;
  reasonText: string;
  evidenceHash?: string;
}

export interface DisputeResolutionPayload {
  tournamentId: string;
  adminWallet: string;
  action: 'RESOLVE' | 'DISMISS';
  notes: string;
}
