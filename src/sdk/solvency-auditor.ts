import { SolvencyAuditResult } from './types';

export class SolvencyAuditor {
  public static verifySolvency(vaultBalanceXlm: number, activeLiabilitiesXlm: number): SolvencyAuditResult {
    const isSolvent = vaultBalanceXlm >= activeLiabilitiesXlm;
    const deltaXlm = vaultBalanceXlm - activeLiabilitiesXlm;

    return {
      contractVaultBalance: vaultBalanceXlm,
      totalTournamentLiabilities: activeLiabilitiesXlm,
      isSolvent,
      deltaXlm,
      timestamp: new Date().toISOString()
    };
  }
}

