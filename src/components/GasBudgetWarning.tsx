import { AlertCircle, AlertTriangle, Zap, ExternalLink } from 'lucide-react';
import { STELLAR_CONSTANTS } from '../constants/stellar';

interface GasBudgetWarningProps {
  balanceXLM: number;
  subentryCount?: number;
  publicKey?: string | null;
  onFundClick?: () => void;
  compact?: boolean;
}

export const GasBudgetWarning: React.FC<GasBudgetWarningProps> = ({
  balanceXLM,
  subentryCount = 0,
  publicKey,
  onFundClick,
  compact = false,
}) => {
  // Stellar protocol rules: 0.5 XLM account base + 0.5 XLM per subentry
  const baseReserve = 1.0 + subentryCount * 0.5;
  const spendable = Math.max(0, balanceXLM - baseReserve);

  // If spendable balance is healthy (>= 1.5 XLM), don't show warning
  if (spendable >= 1.5 && balanceXLM >= 2.5) {
    return null;
  }

  const isCritical = balanceXLM <= baseReserve || spendable < 0.2;
  const borderColor = isCritical ? 'rgba(244, 63, 94, 0.4)' : 'rgba(255, 184, 0, 0.4)';
  const bgColor = isCritical ? 'rgba(244, 63, 94, 0.1)' : 'rgba(255, 184, 0, 0.08)';
  const textColor = isCritical ? '#f43f5e' : '#ffb800';

  if (compact) {
    return (
      <div
        data-testid="gas-warning-compact"
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px',
          padding: '4px 8px',
          borderRadius: '6px',
          background: bgColor,
          border: `1px solid ${borderColor}`,
          color: textColor,
          fontSize: '0.75rem',
          fontFamily: 'var(--font-mono)',
        }}
        title={`Spendable: ${spendable.toFixed(2)} XLM (Base Reserve: ${baseReserve.toFixed(1)} XLM)`}
      >
        {isCritical ? <AlertCircle size={13} /> : <AlertTriangle size={13} />}
        <span>{isCritical ? 'Low Gas (<0.2 XLM)' : 'Low Balance'}</span>
      </div>
    );
  }

  return (
    <div
      data-testid="gas-warning-banner"
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '12px',
        padding: '10px 16px',
        borderRadius: '8px',
        background: bgColor,
        border: `1px solid ${borderColor}`,
        color: textColor,
        fontSize: '0.82rem',
        marginBottom: '16px',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        {isCritical ? <AlertCircle size={18} /> : <AlertTriangle size={18} />}
        <div>
          <span style={{ fontWeight: 700 }}>
            {isCritical ? 'Critical Gas Alert: ' : 'Low Gas Budget Warning: '}
          </span>
          <span>
            {isCritical
              ? `Account balance (${balanceXLM.toFixed(2)} XLM) is at or below the Stellar base reserve (${baseReserve.toFixed(1)} XLM). Soroban transactions will fail.`
              : `Only ~${spendable.toFixed(2)} XLM spendable beyond base reserve (${baseReserve.toFixed(1)} XLM). Consider topping up for smooth tournament play.`}
          </span>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
        {onFundClick ? (
          <button
            onClick={onFundClick}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              padding: '4px 10px',
              borderRadius: '6px',
              background: 'rgba(255, 255, 255, 0.1)',
              border: `1px solid ${borderColor}`,
              color: textColor,
              fontSize: '0.75rem',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            <Zap size={12} /> Top Up XLM
          </button>
        ) : publicKey ? (
          <a
            href={`${STELLAR_CONSTANTS.FRIENDBOT_URL}?addr=${publicKey}`}
            target="_blank"
            rel="noreferrer"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              padding: '4px 10px',
              borderRadius: '6px',
              background: 'rgba(255, 255, 255, 0.1)',
              border: `1px solid ${borderColor}`,
              color: textColor,
              fontSize: '0.75rem',
              fontWeight: 600,
              textDecoration: 'none',
            }}
          >
            <ExternalLink size={12} /> Friendbot Faucet
          </a>
        ) : null}
      </div>
    </div>
  );
};
