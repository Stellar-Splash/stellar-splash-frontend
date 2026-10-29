export type SolvencyGrade = 'AAA' | 'AA' | 'A' | 'DEFICIT';

export interface SolvencyAuditReport {
  contractAddress: string;
  vaultBalanceXlm: number;
  totalCommittedPrizesXlm: number;
  unreservedSurplusXlm: number;
  reserveCoverageRatio: number; // e.g. 1.25 = 125% collateralized
  grade: SolvencyGrade;
  activeTournamentsCount: number;
  auditedAt: number;
  explorerUrl: string;
}

