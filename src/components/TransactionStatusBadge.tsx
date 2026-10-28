import React from 'react';
import { CheckCircle2, XCircle, Loader2, ExternalLink } from 'lucide-react';
import { STELLAR_CONSTANTS, buildExplorerTxUrl } from '../constants/stellar';

export type TxState = 'PENDING' | 'SUBMITTING' | 'SUCCESS' | 'CONFIRMED' | 'FAILED' | 'REJECTED';

export interface TransactionStatusBadgeProps {
  status: TxState;
  txHash?: string;
  label?: string;
  showExplorerLink?: boolean;
  size?: 'sm' | 'md' | 'lg';
  network?: 'testnet' | 'public';
}

export function formatShortTxHash(hash: string): string {
  if (!hash || hash.length < 12) return hash;
  return `${hash.slice(0, 6)}...${hash.slice(-6)}`;
}

export const TransactionStatusBadge: React.FC<TransactionStatusBadgeProps> = ({
  status,
  txHash,
  label,
  showExplorerLink = true,
  size = 'md',
  network = 'testnet',
}) => {
  const isPending = status === 'PENDING' || status === 'SUBMITTING';
  const isSuccess = status === 'SUCCESS' || status === 'CONFIRMED';
  const isFailed = status === 'FAILED' || status === 'REJECTED';

  const explorerUrl = txHash
    ? network === 'public'
      ? `https://stellar.expert/explorer/public/tx/${txHash}`
      : buildExplorerTxUrl(txHash)
    : null;

  const sizeStyles = {
    sm: { padding: '3px 8px', fontSize: '0.7rem', iconSize: 12, gap: '4px' },
    md: { padding: '5px 12px', fontSize: '0.8rem', iconSize: 14, gap: '6px' },
    lg: { padding: '8px 16px', fontSize: '0.9rem', iconSize: 16, gap: '8px' },
  }[size];

  const palette = isSuccess
    ? {
        bg: 'rgba(16, 185, 129, 0.12)',
        border: 'rgba(16, 185, 129, 0.35)',
        text: 'var(--emerald-glow, #10b981)',
        dot: '#10b981',
      }
    : isPending
    ? {
        bg: 'rgba(245, 158, 11, 0.12)',
        border: 'rgba(245, 158, 11, 0.35)',
        text: 'var(--amber-glow, #f59e0b)',
        dot: '#f59e0b',
      }
    : {
        bg: 'rgba(239, 68, 68, 0.12)',
        border: 'rgba(239, 68, 68, 0.35)',
        text: 'var(--crimson-glow, #ef4444)',
        dot: '#ef4444',
      };

  const displayLabel =
    label ||
    (isPending ? 'Pending Ledger Confirmation' : isSuccess ? 'Confirmed on Stellar' : 'Transaction Failed');

  return (
    <div
      data-testid="transaction-status-badge"
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        background: palette.bg,
        border: `1px solid ${palette.border}`,
        borderRadius: '20px',
        color: palette.text,
        padding: sizeStyles.padding,
        fontSize: sizeStyles.fontSize,
        fontFamily: 'var(--font-mono, monospace)',
        gap: sizeStyles.gap,
        boxShadow: isPending ? `0 0 10px ${palette.bg}` : undefined,
      }}
    >
      {isPending && <Loader2 size={sizeStyles.iconSize} className="spin" data-testid="status-spinner" />}
      {isSuccess && <CheckCircle2 size={sizeStyles.iconSize} data-testid="status-success" />}
      {isFailed && <XCircle size={sizeStyles.iconSize} data-testid="status-failed" />}

      <span style={{ fontWeight: 600 }}>{displayLabel}</span>

      {txHash && (
        <span style={{ color: 'var(--text-muted, #94a3b8)', marginLeft: '2px' }}>
          ({formatShortTxHash(txHash)})
        </span>
      )}

      {showExplorerLink && explorerUrl && (
        <a
          href={explorerUrl}
          target="_blank"
          rel="noopener noreferrer"
          title="Inspect on StellarExpert"
          data-testid="explorer-link"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            color: 'inherit',
            textDecoration: 'none',
            marginLeft: '4px',
            opacity: 0.8,
            transition: 'opacity 0.2s',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.opacity = '1')}
          onMouseLeave={(e) => (e.currentTarget.style.opacity = '0.8')}
        >
          <ExternalLink size={sizeStyles.iconSize} />
        </a>
      )}
    </div>
  );
};
