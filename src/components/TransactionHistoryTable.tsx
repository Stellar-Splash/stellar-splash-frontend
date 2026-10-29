import React from 'react';
import { StellarExpertLink } from './StellarExpertLink';

export type TxCategory = 'ENTRY_FEE' | 'PRIZE_PAYOUT' | 'POOL_FUNDING' | 'DISPUTE_BOND';
export type TxState = 'CONFIRMED' | 'PENDING' | 'FAILED';

export interface UserTransactionRecord {
  id: string;
  txHash: string;
  type: TxCategory;
  amount: number;
  asset: string;
  timestamp: number;
  status: TxState;
  ledger?: number;
}

export interface TransactionHistoryTableProps {
  transactions?: UserTransactionRecord[];
  network?: 'testnet' | 'public';
}

export const formatTxTypeLabel = (type: TxCategory): string => {
  switch (type) {
    case 'ENTRY_FEE':
      return 'Entry Fee';
    case 'PRIZE_PAYOUT':
      return 'Prize Payout';
    case 'POOL_FUNDING':
      return 'Pool Funding';
    case 'DISPUTE_BOND':
      return 'Dispute Bond';
  }
};

export const TransactionHistoryTable: React.FC<TransactionHistoryTableProps> = ({
  transactions = [],
  network = 'testnet',
}) => {
  if (transactions.length === 0) {
    return (
      <div
        className="tx-history-empty"
        style={{
          padding: '2rem',
          textAlign: 'center',
          color: '#94a3b8',
          backgroundColor: '#0f172a',
          borderRadius: '8px',
          border: '1px solid #334155',
        }}
      >
        <span style={{ fontSize: '1.5rem', display: 'block', marginBottom: '0.5rem' }}>📜</span>
        No on-chain transactions recorded yet.
      </div>
    );
  }

  return (
    <div
      className="tx-history-container"
      style={{
        overflowX: 'auto',
        borderRadius: '8px',
        border: '1px solid #334155',
        backgroundColor: '#0f172a',
      }}
    >
      <table
        aria-label="On-Chain Transaction History"
        style={{
          width: '100%',
          borderCollapse: 'collapse',
          fontSize: '0.85rem',
          color: '#f8fafc',
          textAlign: 'left',
        }}
      >
        <thead>
          <tr style={{ backgroundColor: '#1e293b', borderBottom: '1px solid #334155', color: '#94a3b8' }}>
            <th style={{ padding: '0.75rem 1rem' }}>Type</th>
            <th style={{ padding: '0.75rem 1rem' }}>Amount</th>
            <th style={{ padding: '0.75rem 1rem' }}>Status</th>
            <th style={{ padding: '0.75rem 1rem' }}>Date</th>
            <th style={{ padding: '0.75rem 1rem' }}>StellarExpert</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((tx) => {
            const isCredit = tx.type === 'PRIZE_PAYOUT';
            const statusColor =
              tx.status === 'CONFIRMED'
                ? '#10b981'
                : tx.status === 'PENDING'
                ? '#f59e0b'
                : '#ef4444';

            return (
              <tr
                key={tx.id}
                style={{
                  borderBottom: '1px solid #1e293b',
                  transition: 'background-color 0.2s',
                }}
              >
                <td style={{ padding: '0.75rem 1rem', fontWeight: 500 }}>
                  {formatTxTypeLabel(tx.type)}
                </td>
                <td
                  style={{
                    padding: '0.75rem 1rem',
                    fontWeight: 600,
                    color: isCredit ? '#34d399' : '#f8fafc',
                  }}
                >
                  {`${isCredit ? '+' : '-'}${tx.amount.toLocaleString()} ${tx.asset}`}
                </td>
                <td style={{ padding: '0.75rem 1rem' }}>
                  <span
                    style={{
                      display: 'inline-block',
                      padding: '0.15rem 0.4rem',
                      borderRadius: '4px',
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      backgroundColor: `${statusColor}20`,
                      color: statusColor,
                      border: `1px solid ${statusColor}40`,
                    }}
                  >
                    {tx.status}
                  </span>
                </td>
                <td style={{ padding: '0.75rem 1rem', color: '#94a3b8', fontSize: '0.8rem' }}>
                  {new Date(tx.timestamp).toLocaleDateString()}
                </td>
                <td style={{ padding: '0.75rem 1rem' }}>
                  <StellarExpertLink
                    type="tx"
                    id={tx.txHash}
                    label="View Tx"
                  />
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};
