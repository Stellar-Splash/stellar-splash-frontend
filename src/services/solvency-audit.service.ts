import { SolvencyAuditReport, SolvencyGrade } from '../types/solvency-audit';
import { STELLAR_CONSTANTS } from '../constants/stellar';

export class SolvencyAuditService {
  public static calculateGrade(coverageRatio: number): SolvencyGrade {
    if (coverageRatio >= 1.2) return 'AAA';
    if (coverageRatio >= 1.05) return 'AA';
    if (coverageRatio >= 1.0) return 'A';
    return 'DEFICIT';
  }

  public static generateReport(params: {
    vaultBalanceXlm: number;
    committedPrizesXlm: number;
    activeTournamentsCount: number;
    contractAddress?: string;
  }): SolvencyAuditReport {
    const contract = params.contractAddress || STELLAR_CONSTANTS.DEFAULT_CONTRACT_ID;
    const committed = Math.max(0, params.committedPrizesXlm);
    const balance = Math.max(0, params.vaultBalanceXlm);

    const ratio = committed === 0
      ? balance > 0 ? 2.0 : 1.0
      : Math.round((balance / committed) * 100) / 100;

    const surplus = Math.round((balance - committed) * 100) / 100;
    const grade = this.calculateGrade(ratio);

    return {
      contractAddress: contract,
      vaultBalanceXlm: balance,
      totalCommittedPrizesXlm: committed,
      unreservedSurplusXlm: surplus,
      reserveCoverageRatio: ratio,
      grade,
      activeTournamentsCount: params.activeTournamentsCount,
      auditedAt: Date.now(),
      explorerUrl: `https://stellar.expert/explorer/testnet/contract/${contract}`,
    };
  }
}
