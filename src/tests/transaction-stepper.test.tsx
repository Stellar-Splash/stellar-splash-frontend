import { describe, it, expect } from 'vitest';
import React from 'react';
import { renderToString } from 'react-dom/server';
import { TransactionStepperToast } from '../components/TransactionStepperToast';
import { TransactionStepperState } from '../types/transaction-stepper';

describe('TransactionStepperToast Component', () => {
  it('renders nothing when state is null', () => {
    const html = renderToString(<TransactionStepperToast state={null} />);
    expect(html).toBe('');
  });

  it('renders active action name and steps during SIMULATING', () => {
    const state: TransactionStepperState = {
      actionName: 'Register for Tournament',
      currentStep: 'SIMULATING',
      startedAt: Date.now(),
    };

    const html = renderToString(<TransactionStepperToast state={state} />);
    expect(html).toContain('Register for Tournament');
    expect(html).toContain('Simulate');
    expect(html).toContain('Submit');
    expect(html).toContain('tx-step-dot active');
  });

  it('renders StellarExpert deep-link upon confirmation', () => {
    const state: TransactionStepperState = {
      actionName: 'Prize Pool Settlement',
      currentStep: 'CONFIRMED',
      txHash: '0xabc123456789abcdef',
      startedAt: Date.now() - 5000,
      completedAt: Date.now(),
    };

    const html = renderToString(<TransactionStepperToast state={state} />);
    expect(html).toContain('View on StellarExpert');
    expect(html).toContain('https://stellar.expert/explorer/testnet/tx/0xabc123456789abcdef');
    expect(html).toContain('confirmed');
  });

  it('renders error message when transaction is reverted', () => {
    const state: TransactionStepperState = {
      actionName: 'Fund Tournament',
      currentStep: 'REVERTED',
      errorMessage: 'HostError: Error(Contract, #9)',
      startedAt: Date.now(),
    };

    const html = renderToString(<TransactionStepperToast state={state} />);
    expect(html).toContain('HostError: Error(Contract, #9)');
    expect(html).toContain('reverted');
  });
});
