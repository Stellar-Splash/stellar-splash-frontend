import React from 'react';
import { StellarExpertLink } from './StellarExpertLink';

export type AttestationBadgeStatus = 'PENDING' | 'ATTESTED' | 'DISPUTED' | 'SETTLED';

export interface MatchAttestationBadgeProps {
  status: AttestationBadgeStatus;
  attestationHash?: string;
  txHash?: string;
  showDetails?: boolean;
}

export const MatchAttestationBadge: React.FC<MatchAttestationBadgeProps> = ({
  status,
  attestationHash,
  txHash,
  showDetails = false,
}) => {
  const getBadgeConfig = () => {
    switch (status) {
      case 'ATTESTED':
        return {
          bg: 'rgba(16, 185, 129, 0.15)',
          border: 'rgba(16, 185, 129, 0.35)',
          color: '#34d399',
          dot: '#10b981',
          label: 'Attested on Soroban',
        };
      case 'DISPUTED':
        return {
          bg: 'rgba(239, 68, 68, 0.15)',
          border: 'rgba(239, 68, 68, 0.35)',
          color: '#f87171',
          dot: '#ef4444',
          label: 'Dispute Active',
        };
      case 'SETTLED':
        return {
          bg: 'rgba(56, 189, 248, 0.15)',
          border: 'rgba(56, 189, 248, 0.35)',
          color: '#38bdf8',
          dot: '#0284c7',
          label: 'Settled & Distributed',
        };
      case 'PENDING':
      default:
        return {
          bg: 'rgba(245, 158, 11, 0.15)',
          border: 'rgba(245, 158, 11, 0.35)',
          color: '#fbbf24',
          dot: '#f59e0b',
          label: 'Attestation Pending',
        };
    }
  };

  const config = getBadgeConfig();

  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '8px',
        flexWrap: 'wrap',
      }}
    >
      <span
        data-testid="attestation-badge"
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px',
          background: config.bg,
          border: `1px solid ${config.border}`,
          borderRadius: '9999px',
          padding: '3px 10px',
          fontSize: '0.75rem',
          fontWeight: 600,
          color: config.color,
          letterSpacing: '0.02em',
        }}
      >
        <span
          style={{
            width: '6px',
            height: '6px',
            borderRadius: '50%',
            backgroundColor: config.dot,
            display: 'inline-block',
            boxShadow: `0 0 6px ${config.dot}`,
          }}
        />
        {config.label}
      </span>

      {showDetails && attestationHash && (
        <span
          title={attestationHash}
          style={{
            fontFamily: 'monospace',
            fontSize: '0.7rem',
            color: '#9ca3af',
            background: 'rgba(255, 255, 255, 0.05)',
            padding: '2px 6px',
            borderRadius: '4px',
          }}
        >
          {`${attestationHash.slice(0, 8)}...${attestationHash.slice(-6)}`}
        </span>
      )}

      {txHash && (
        <StellarExpertLink id={txHash} type="tx" label="Tx" />
      )}
    </div>
  );
};
