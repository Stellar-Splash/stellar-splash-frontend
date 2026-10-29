import { describe, it, expect } from 'vitest';
import { SolvencyAuditor } from '../sdk';

describe('SDK SolvencyAuditor', () => {
  it('confirms solvency when vault exceeds liabilities', () => {
    const audit = SolvencyAuditor.verifySolvency(1500, 1000);
    expect(audit.isSolvent).toBe(true);
    expect(audit.deltaXlm).toBe(500);
    expect(audit.contractVaultBalance).toBe(1500);
  });

  it('detects insolvency when liabilities exceed vault', () => {
    const audit = SolvencyAuditor.verifySolvency(800, 1000);
    expect(audit.isSolvent).toBe(false);
    expect(audit.deltaXlm).toBe(-200);
  });

  it('marks exact match as solvent', () => {
    const audit = SolvencyAuditor.verifySolvency(1000, 1000);
    expect(audit.isSolvent).toBe(true);
    expect(audit.deltaXlm).toBe(0);
  });
});

