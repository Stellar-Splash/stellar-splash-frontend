export type DisputeReasonCode =
  | 'DESYNC_TICK_MISMATCH'
  | 'SUSPICIOUS_INPUT_ANOMALY'
  | 'UNAUTHORIZED_RESULT_MUTATION'
  | 'OTHER';

export interface DisputeFilingRequest {
  tournamentId: number;
  matchId: string;
  challengerWallet: string;
  reasonCode: DisputeReasonCode;
  description: string;
  evidenceUri?: string;
  stakedBondXlm: number; // Required dispute staking bond
}
