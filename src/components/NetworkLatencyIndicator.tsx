import React, { useState } from 'react';

export interface NetworkLatencyIndicatorProps {
  latencyMs?: number;
  isOnline?: boolean;
  endpointName?: string;
  onRefresh?: () => Promise<number> | void;
}

export type LatencyTier = 'OPTIMAL' | 'NORMAL' | 'DEGRADED' | 'CRITICAL' | 'OFFLINE';

export const getLatencyTier = (latencyMs: number, isOnline: boolean): LatencyTier => {
  if (!isOnline) return 'OFFLINE';
  if (latencyMs < 100) return 'OPTIMAL';
  if (latencyMs <= 250) return 'NORMAL';
  if (latencyMs <= 500) return 'DEGRADED';
  return 'CRITICAL';
};

export const getLatencyColor = (tier: LatencyTier): string => {
  switch (tier) {
    case 'OPTIMAL':
      return '#10b981'; // Green
    case 'NORMAL':
      return '#06b6d4'; // Cyan
    case 'DEGRADED':
      return '#f59e0b'; // Amber
    case 'CRITICAL':
    case 'OFFLINE':
      return '#ef4444'; // Red
  }
};

export const NetworkLatencyIndicator: React.FC<NetworkLatencyIndicatorProps> = ({
  latencyMs = 45,
  isOnline = true,
  endpointName = 'Soroban RPC',
  onRefresh,
}) => {
  const [isPinging, setIsPinging] = useState(false);

  const tier = getLatencyTier(latencyMs, isOnline);
  const color = getLatencyColor(tier);

  const handleRefreshClick = async () => {
    if (!onRefresh || isPinging) return;
    setIsPinging(true);
    try {
      await onRefresh();
    } finally {
      setIsPinging(false);
    }
  };

  return (
    <div
      role="status"
      aria-label={`${endpointName} latency: ${isOnline ? `${latencyMs}ms (${tier})` : 'Offline'}`}
      className={`latency-indicator latency-${tier.toLowerCase()}`}
      onClick={handleRefreshClick}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.4rem',
        padding: '0.2rem 0.5rem',
        borderRadius: '9999px',
        backgroundColor: 'rgba(15, 23, 42, 0.7)',
        border: `1px solid ${color}40`,
        fontSize: '0.75rem',
        fontFamily: 'monospace',
        cursor: onRefresh ? 'pointer' : 'default',
        userSelect: 'none',
      }}
      title={`${endpointName} - Status: ${tier}${onRefresh ? ' (Click to ping)' : ''}`}
    >
      <span
        style={{
          width: '6px',
          height: '6px',
          borderRadius: '50%',
          backgroundColor: color,
          boxShadow: `0 0 6px ${color}`,
          display: 'inline-block',
          animation: isPinging ? 'pulse 0.5s infinite' : 'none',
        }}
      />
      <span style={{ color: '#94a3b8', fontSize: '0.85em' }}>{`${endpointName}:`}</span>
      <span style={{ color, fontWeight: 600 }}>
        {isOnline ? `${latencyMs}ms` : 'Offline'}
      </span>
    </div>
  );
};
