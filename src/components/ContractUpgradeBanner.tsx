import React, { useState } from 'react';
import { CopyTooltipButton } from './CopyTooltipButton';

export interface ContractUpgradeBannerProps {
  isUpgraded: boolean;
  newWasmHash?: string;
  protocolVersion?: number;
  allowDismiss?: boolean;
  onViewDetails?: () => void;
}

export const ContractUpgradeBanner: React.FC<ContractUpgradeBannerProps> = ({
  isUpgraded,
  newWasmHash = 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
  protocolVersion = 21,
  allowDismiss = true,
  onViewDetails,
}) => {
  const [dismissed, setDismissed] = useState<boolean>(false);

  if (!isUpgraded || dismissed) {
    return null;
  }

  return (
    <aside
      role="alert"
      aria-live="polite"
      style={{
        width: '100%',
        background: 'linear-gradient(90deg, rgba(79, 70, 229, 0.95), rgba(124, 58, 237, 0.95))',
        borderBottom: '2px solid #8b5cf6',
        boxShadow: '0 4px 20px rgba(139, 92, 246, 0.35)',
        color: '#ffffff',
        padding: '10px 18px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        fontSize: '0.85rem',
        fontWeight: 500,
        zIndex: 9997,
        position: 'sticky',
        top: 0,
        boxSizing: 'border-box',
        backdropFilter: 'blur(10px)',
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
            border: '1px solid rgba(255, 255, 255, 0.25)',
          }}
        >
          <span
            style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              backgroundColor: '#a78bfa',
              boxShadow: '0 0 8px #a78bfa',
              display: 'inline-block',
            }}
          />
          {`Contract Upgraded (v${protocolVersion})`}
        </span>

        <span style={{ color: '#ede9fe' }}>
          Soroban vault bytecode has been upgraded to a new verified WASM release.
        </span>

        {newWasmHash && (
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
            <span
              style={{
                fontFamily: 'monospace',
                fontSize: '0.75rem',
                color: '#ddd6fe',
                background: 'rgba(0, 0, 0, 0.3)',
                padding: '2px 6px',
                borderRadius: '4px',
              }}
            >
              {`${newWasmHash.slice(0, 8)}...${newWasmHash.slice(-6)}`}
            </span>
            <CopyTooltipButton textToCopy={newWasmHash} label="Copy Hash" />
          </div>
        )}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginLeft: 'auto' }}>
        {onViewDetails && (
          <button
            type="button"
            onClick={onViewDetails}
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
            Release Notes
          </button>
        )}

        {allowDismiss && (
          <button
            type="button"
            onClick={() => setDismissed(true)}
            aria-label="Dismiss upgrade banner"
            style={{
              background: 'transparent',
              border: 'none',
              color: '#ede9fe',
              fontSize: '1.2rem',
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
