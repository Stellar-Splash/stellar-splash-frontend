import { describe, it, expect } from 'vitest';
import React from 'react';
import { GasBudgetWarning } from '../components/GasBudgetWarning';

describe('GasBudgetWarning Component', () => {
  it('renders null when balance is comfortably above base reserve', () => {
    // 100 XLM is well above base reserve
    const element = GasBudgetWarning({ balanceXLM: 100, subentryCount: 2 });
    expect(element).toBeNull();
  });

  it('renders critical alert when balance is less than or equal to base reserve', () => {
    // Base reserve with 0 subentries is 1.0 XLM. Balance 0.8 XLM is critical.
    const element = GasBudgetWarning({ balanceXLM: 0.8, subentryCount: 0 });
    expect(element).not.toBeNull();
    expect(React.isValidElement(element)).toBe(true);
    if (React.isValidElement(element)) {
      expect((element.props as any)['data-testid']).toBe('gas-warning-banner');
    }
  });

  it('renders warning when spendable balance is low (< 1.5 XLM)', () => {
    // Base reserve 1.0 XLM, balance 1.8 XLM -> spendable 0.8 XLM (< 1.5 XLM)
    const element = GasBudgetWarning({ balanceXLM: 1.8, subentryCount: 0 });
    expect(element).not.toBeNull();
    expect(React.isValidElement(element)).toBe(true);
    if (React.isValidElement(element)) {
      expect((element.props as any)['data-testid']).toBe('gas-warning-banner');
    }
  });

  it('renders compact mode with gas-warning-compact testid', () => {
    const element = GasBudgetWarning({ balanceXLM: 0.5, compact: true });
    expect(element).not.toBeNull();
    expect(React.isValidElement(element)).toBe(true);
    if (React.isValidElement(element)) {
      expect((element.props as any)['data-testid']).toBe('gas-warning-compact');
    }
  });
});
