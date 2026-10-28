import { describe, it, expect } from 'vitest';
import React from 'react';
import { renderToString } from 'react-dom/server';
import {
  TransactionStatusBadge,
  formatShortTxHash,
} from '../components/TransactionStatusBadge';

describe('TransactionStatusBadge Component', () => {
  const sampleTx = 'a1b2c3d4e5f60718293a4b5c6d7e8f90123456789abcdef0123456789abcdef0';

  it('correctly shortens long 64-char transaction hashes', () => {
    expect(formatShortTxHash(sampleTx)).toBe('a1b2c3...bcdef0');
    expect(formatShortTxHash('short')).toBe('short');
  });

  it('renders PENDING transaction state with spinner class and pending label', () => {
    const html = renderToString(
      React.createElement(TransactionStatusBadge, {
        status: 'PENDING',
        txHash: sampleTx,
      })
    );

    expect(html).toContain('Pending Ledger Confirmation');
    expect(html).toContain('a1b2c3...bcdef0');
    expect(html).toContain('https://stellar.expert/explorer/testnet/tx/' + sampleTx);
  });

  it('renders SUCCESS state with confirmed label and emerald color token', () => {
    const html = renderToString(
      React.createElement(TransactionStatusBadge, {
        status: 'CONFIRMED',
        label: 'Settlement Distributed',
        txHash: sampleTx,
      })
    );

    expect(html).toContain('Settlement Distributed');
    expect(html).toContain('rgba(16, 185, 129, 0.12)');
  });

  it('renders FAILED state with error label', () => {
    const html = renderToString(
      React.createElement(TransactionStatusBadge, {
        status: 'FAILED',
        label: 'Transaction Aborted (Timeout)',
      })
    );

    expect(html).toContain('Transaction Aborted (Timeout)');
    expect(html).toContain('rgba(239, 68, 68, 0.12)');
  });
});
