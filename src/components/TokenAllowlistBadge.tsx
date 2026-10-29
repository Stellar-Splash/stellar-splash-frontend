import React from 'react';
import { ShieldCheck, AlertTriangle, ExternalLink } from 'lucide-react';

export interface TokenAllowlistBadgeProps {
  assetAddress: string;
  symbol: string;
  isWhitelisted: boolean;
  showAddress?: boolean;
}

export const TokenAllowlistBadge: React.FC<TokenAllowlistBadgeProps> = ({
  assetAddress,
  symbol,
  isWhitelisted,
  showAddress = false,
}) => {
  const shortAddress =
    assetAddress.length > 12 ? `${assetAddress.slice(0, 4)}...${assetAddress.slice(-4)}` : assetAddress;

  if (isWhitelisted) {
    return (
      <div
        data-testid="token-allowlist-badge"
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '5px',
          padding: '3px 8px',
          borderRadius: '6px',
          background: 'rgba(16, 185, 129, 0.12)',
          border: '1px solid rgba(16, 185, 129, 0.35)',
          color: 'var(--emerald-glow, #10b981)',
          fontSize: '0.75rem',
          fontWeight: 600,
          fontFamily: 'monospace',
        }}
        title={`Verified Protocol Asset: ${symbol} (${assetAddress})`}
      >
        <ShieldCheck size={13} />
        <span>{`${symbol} • VERIFIED`}</span>
        {showAddress && <span style={{ opacity: 0.8 }}>{`(${shortAddress})`}</span>}
      </div>
    );
  }

  return (
    <div
      data-testid="token-allowlist-badge"
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '5px',
        padding: '3px 8px',
        borderRadius: '6px',
        background: 'rgba(255, 184, 0, 0.12)',
        border: '1px solid rgba(255, 184, 0, 0.35)',
        color: 'var(--gold-glow, #ffb800)',
        fontSize: '0.75rem',
        fontWeight: 600,
        fontFamily: 'monospace',
      }}
      title={`Custom SAC Asset: ${symbol} (${assetAddress}) - Ensure you trust this contract issuer.`}
    >
      <AlertTriangle size={13} />
      <span>{`${symbol} • CUSTOM SAC`}</span>
      {showAddress && <span style={{ opacity: 0.8 }}>{`(${shortAddress})`}</span>}
    </div>
  );
};
