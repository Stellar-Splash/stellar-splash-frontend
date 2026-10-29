/**
 * Solvency and Transaction History Domain Types
 * Synchronized across frontend monitoring and engine auditing services.
 */

export type SolvencyStatusLevel = 'HEALTHY' | 'WARNING' | 'CRITICAL';

export interface VaultSolvencySnapshot {
  assetCode: string;
  vaultAddress: string;
  vaultBalance: number;
  totalObligations: number;
  netReserveMargin: number;
  coverageRatioPct: number;
  status: SolvencyStatusLevel;
  activeTournamentCount: number;
  lastAuditedTimestamp: number;
}

export type TransactionType = 'ENTRY_FEE' | 'PRIZE_PAYOUT' | 'POOL_FUNDING' | 'DISPUTE_BOND';
export type TransactionStatus = 'CONFIRMED' | 'PENDING' | 'FAILED';

export interface TransactionHistoryItem {
  id: string;
  txHash: string;
  type: TransactionType;
  amount: number;
  asset: string;
  timestamp: number;
  status: TransactionStatus;
  ledger?: number;
  memo?: string;
  explorerUrl?: string;
}

export interface SolvencyAuditQueryFilter {
  assetCode?: string;
  minRatio?: number;
  status?: SolvencyStatusLevel;
  limit?: number;
}
