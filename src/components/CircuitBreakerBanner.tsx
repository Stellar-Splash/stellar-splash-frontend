import React, { useState } from 'react';
import { StellarExpertLink } from './StellarExpertLink';
import { STELLAR_CONSTANTS } from '../constants/stellar';

export interface CircuitBreakerBannerProps {
  isPaused: boolean;
  reason?: string;
  contractId?: string;
  adminContact?: string;
  allowDismiss?: boolean;
  onViewStatus?: () => void;
}

export const CircuitBreakerBanner: React.FC<CircuitBreakerBannerProps> = ({
  isPaused,
  reason = 'Soroban circuit breaker engaged for security audit or parameter updates.',
  contractId = STELLAR_CONSTANTS.DEFAULT_CONTRACT_ID,
  adminContact,
  allowDismiss = false,
  onViewStatus,
}) => {
  const [dismissed, setDismissed] = useState<boolean>(false);

  if (!isPaused || dismissed) {
    return null;
  }

  return (
    <aside
      role="alert"
      aria-live="polite"
      style={{
        width: '100%',
        background: 'linear-gradient(90deg, rgba(185, 28, 28, 0.95), rgba(153, 27, 27, 0.95))',
        borderBottom: '2px solid #ef4444',
        boxShadow: '0 4px 20px rgba(239, 68, 68, 0.35)',
        color: '#ffffff',
        padding: '10px 16px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        fontSize: '0.85rem',
        fontWeight: 500,
        zIndex: 9999,
        position: 'sticky',
        top: 0,
        boxSizing: 'border-box',
        backdropFilter: 'blur(8px)',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
        <span
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            background: 'rgba(0, 0, 0, 0.35)',
            padding: '3px 8px',
            borderRadius: '6px',
            fontSize: '0.75rem',
            fontWeight: 700,
            letterSpacing: '0.05em',
            textTransform: 'uppercase',
            border: '1px solid rgba(255, 255, 255, 0.2)',
          }}
        >
          <span
            style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              backgroundColor: '#fca5a5',
              boxShadow: '0 0 8px #fca5a5',
              display: 'inline-block',
            }}
          />
          Circuit Breaker Active
        </span>

        <span style={{ color: '#fee2e2' }}>
          <strong>Attention:</strong> {reason} Smart contract state mutations (registrations & settlements) are halted.
        </span>

        {contractId && (
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ color: '#fca5a5', fontSize: '0.75rem' }}>Contract:</span>
            <StellarExpertLink id={contractId} type="contract" />
          </div>
        )}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginLeft: 'auto' }}>
        {onViewStatus && (
          <button
            type="button"
            onClick={onViewStatus}
            style={{
              background: 'rgba(255, 255, 255, 0.15)',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              color: '#ffffff',
              borderRadius: '4px',
              padding: '4px 10px',
              fontSize: '0.75rem',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            System Status
          </button>
        )}

        {allowDismiss && (
          <button
            type="button"
            onClick={() => setDismissed(true)}
            aria-label="Dismiss banner"
            style={{
              background: 'transparent',
              border: 'none',
              color: '#fee2e2',
              fontSize: '1.1rem',
              cursor: 'pointer',
              padding: '0 4px',
              lineHeight: 1,
            }}
          >
            &times;
          </button>
        )}
      </div>
    </aside>
  );
};
