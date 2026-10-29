import React from 'react';

export type SolvencyRating = 'SOLVENT' | 'MARGINAL' | 'DEFICIT';

export interface SolvencyStatusCardProps {
  assetCode?: string;
  vaultBalance: number;
  totalObligations: number;
  lastAuditedTimestamp?: number;
  onRefresh?: () => void;
}

export const getSolvencyRating = (balance: number, obligations: number): SolvencyRating => {
  if (obligations <= 0) return 'SOLVENT';
  const ratio = (balance / obligations) * 100;
  if (ratio >= 100) return 'SOLVENT';
  if (ratio >= 95) return 'MARGINAL';
  return 'DEFICIT';
};

export const SolvencyStatusCard: React.FC<SolvencyStatusCardProps> = ({
  assetCode = 'USDC',
  vaultBalance,
  totalObligations,
  lastAuditedTimestamp = Date.now(),
  onRefresh,
}) => {
  const rating = getSolvencyRating(vaultBalance, totalObligations);
  const ratioPct =
    totalObligations > 0
      ? Math.min(999, Math.round((vaultBalance / totalObligations) * 100))
      : 100;

  const getStatusColor = () => {
    switch (rating) {
      case 'SOLVENT':
        return '#10b981'; // Green
      case 'MARGINAL':
        return '#f59e0b'; // Amber
      case 'DEFICIT':
        return '#ef4444'; // Red
    }
  };

  const color = getStatusColor();

  return (
    <div
      role="region"
      aria-label={`Vault Solvency Status: ${rating}`}
      className={`solvency-card solvency-${rating.toLowerCase()}`}
      style={{
        padding: '1.25rem',
        borderRadius: '12px',
        backgroundColor: '#0f172a',
        border: `1px solid ${color}40`,
        color: '#f8fafc',
        boxShadow: `0 4px 20px -2px ${color}20`,
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '1rem',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span style={{ fontSize: '1.2rem' }}>🏦</span>
          <h4 style={{ margin: 0, fontSize: '1.05rem', color: '#e2e8f0' }}>
            Vault Solvency Health
          </h4>
        </div>
        <span
          className="solvency-badge"
          style={{
            padding: '0.2rem 0.6rem',
            borderRadius: '9999px',
            fontSize: '0.75rem',
            fontWeight: 'bold',
            backgroundColor: `${color}20`,
            color,
            border: `1px solid ${color}60`,
            textTransform: 'uppercase',
          }}
        >
          {rating}
        </span>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: '0.75rem',
          marginBottom: '1rem',
          fontSize: '0.9rem',
        }}
      >
        <div
          style={{
            padding: '0.75rem',
            backgroundColor: '#1e293b',
            borderRadius: '8px',
          }}
        >
          <div style={{ color: '#94a3b8', fontSize: '0.75rem', marginBottom: '0.25rem' }}>
            On-Chain Vault Balance
          </div>
          <div style={{ fontSize: '1.1rem', fontWeight: 600, color: '#38bdf8' }}>
            {`${vaultBalance.toLocaleString()} ${assetCode}`}
          </div>
        </div>

        <div
          style={{
            padding: '0.75rem',
            backgroundColor: '#1e293b',
            borderRadius: '8px',
          }}
        >
          <div style={{ color: '#94a3b8', fontSize: '0.75rem', marginBottom: '0.25rem' }}>
            Active Obligations
          </div>
          <div style={{ fontSize: '1.1rem', fontWeight: 600, color: '#f1f5f9' }}>
            {`${totalObligations.toLocaleString()} ${assetCode}`}
          </div>
        </div>
      </div>

      {/* Progress / Ratio Bar */}
      <div>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            fontSize: '0.8rem',
            color: '#94a3b8',
            marginBottom: '0.35rem',
          }}
        >
          <span>Reserve Ratio</span>
          <span style={{ color, fontWeight: 'bold' }}>{`${ratioPct}%`}</span>
        </div>
        <div
          style={{
            width: '100%',
            height: '8px',
            backgroundColor: '#334155',
            borderRadius: '4px',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              width: `${Math.min(100, ratioPct)}%`,
              height: '100%',
              backgroundColor: color,
              transition: 'width 0.3s ease',
            }}
          />
        </div>
      </div>

      {onRefresh && (
        <button
          type="button"
          onClick={onRefresh}
          className="btn-refresh-solvency"
          style={{
            marginTop: '1rem',
            width: '100%',
            padding: '0.45rem',
            backgroundColor: 'transparent',
            border: '1px solid #334155',
            color: '#94a3b8',
            borderRadius: '6px',
            fontSize: '0.8rem',
            cursor: 'pointer',
          }}
        >
          Reconcile Ledger Balance
        </button>
      )}
    </div>
  );
};
