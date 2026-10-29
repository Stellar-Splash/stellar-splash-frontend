import { describe, it, expect } from 'vitest';
import { SolvencyAuditService } from '../services/solvency-audit.service';

describe('SolvencyAuditService', () => {
  it('correctly maps coverage ratios to solvency grades', () => {
    expect(SolvencyAuditService.calculateGrade(1.25)).toBe('AAA');
    expect(SolvencyAuditService.calculateGrade(1.1)).toBe('AA');
    expect(SolvencyAuditService.calculateGrade(1.02)).toBe('A');
    expect(SolvencyAuditService.calculateGrade(0.95)).toBe('DEFICIT');
  });

  it('generates accurate report for collateralized vault', () => {
    const report = SolvencyAuditService.generateReport({
      vaultBalanceXlm: 1200,
      committedPrizesXlm: 1000,
      activeTournamentsCount: 5,
      contractAddress: 'CCONTRACT_1',
    });

    expect(report.reserveCoverageRatio).toBe(1.2);
    expect(report.grade).toBe('AAA');
    expect(report.unreservedSurplusXlm).toBe(200);
    expect(report.explorerUrl).toContain('CCONTRACT_1');
  });

  it('flags deficit when liabilities exceed vault reserves', () => {
    const report = SolvencyAuditService.generateReport({
      vaultBalanceXlm: 800,
      committedPrizesXlm: 1000,
      activeTournamentsCount: 3,
    });

    expect(report.reserveCoverageRatio).toBe(0.8);
    expect(report.grade).toBe('DEFICIT');
    expect(report.unreservedSurplusXlm).toBe(-200);
  });
});

