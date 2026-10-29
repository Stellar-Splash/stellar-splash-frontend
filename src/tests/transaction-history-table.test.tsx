import { describe, it, expect } from 'vitest';
import React from 'react';
import { renderToString } from 'react-dom/server';
import {
  TransactionHistoryTable,
  UserTransactionRecord,
  formatTxTypeLabel,
} from '../components/TransactionHistoryTable';

describe('TransactionHistoryTable Component', () => {
  it('correctly maps transaction category codes to friendly labels', () => {
    expect(formatTxTypeLabel('ENTRY_FEE')).toBe('Entry Fee');
    expect(formatTxTypeLabel('PRIZE_PAYOUT')).toBe('Prize Payout');
    expect(formatTxTypeLabel('POOL_FUNDING')).toBe('Pool Funding');
    expect(formatTxTypeLabel('DISPUTE_BOND')).toBe('Dispute Bond');
  });

  it('renders transactions table with rows and StellarExpert links', () => {
    const sampleTxs: UserTransactionRecord[] = [
      {
        id: 'tx-1',
        txHash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
        type: 'PRIZE_PAYOUT',
        amount: 50,
        asset: 'USDC',
        timestamp: 1710000000000,
        status: 'CONFIRMED',
      },
      {
        id: 'tx-2',
        txHash: '1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef',
        type: 'ENTRY_FEE',
        amount: 5,
        asset: 'USDC',
        timestamp: 1709900000000,
        status: 'CONFIRMED',
      },
    ];

    const html = renderToString(<TransactionHistoryTable transactions={sampleTxs} />);

    expect(html).toContain('table aria-label="On-Chain Transaction History"');
    expect(html).toContain('Prize Payout');
    expect(html).toContain('+50 USDC');
    expect(html).toContain('Entry Fee');
    expect(html).toContain('-5 USDC');
    expect(html).toContain('stellar.expert/explorer/testnet/tx/');
  });

  it('renders friendly empty state when no transactions exist', () => {
    const html = renderToString(<TransactionHistoryTable transactions={[]} />);

    expect(html).toContain('tx-history-empty');
    expect(html).toContain('No on-chain transactions recorded yet.');
  });
});
