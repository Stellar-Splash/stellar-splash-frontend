import React, { useEffect, useState } from 'react';
import { Activity, ShieldCheck, ExternalLink, Zap } from 'lucide-react';
import { SorobanRpcService } from '../services/soroban-rpc';

interface NetworkStatusBarProps {
  contractId?: string;
}

export const NetworkStatusBar: React.FC<NetworkStatusBarProps> = ({
  contractId = 'CACHWJEZY6JN36VFACWRQ7FP4T5EPRRRNBVLOSFHXTJHETZY36JD7QYJ',
}) => {
  const [latestLedger, setLatestLedger] = useState<number>(0);
  const [rpcStatus, setRpcStatus] = useState<'healthy' | 'unhealthy' | 'checking'>('checking');

  useEffect(() => {
    let mounted = true;

    const checkHealth = async () => {
      try {
        const health = await SorobanRpcService.getHealth();
        if (mounted) {
          setRpcStatus(health.status);
          if (health.latestLedger > 0) {
            setLatestLedger(health.latestLedger);
          }
        }
      } catch {
        if (mounted) setRpcStatus('unhealthy');
      }
    };

    checkHealth();
    const interval = setInterval(checkHealth, 8000);
    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, []);

  const explorerUrl = `https://stellar.expert/explorer/testnet/contract/${contractId}`;

  return (
    <footer
      style={{
        borderTop: '1px solid rgba(255, 255, 255, 0.08)',
        background: 'rgba(10, 15, 29, 0.85)',
        backdropFilter: 'blur(12px)',
        padding: '8px 24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        fontSize: '0.75rem',
        color: 'var(--text-muted)',
        zIndex: 40,
        position: 'sticky',
        bottom: 0,
        width: '100%',
        boxSizing: 'border-box',
        flexWrap: 'wrap',
        gap: '12px',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span
            style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              backgroundColor: rpcStatus === 'healthy' ? '#10B981' : '#F59E0B',
              boxShadow: rpcStatus === 'healthy' ? '0 0 8px #10B981' : 'none',
              display: 'inline-block',
            }}
          />
          <span style={{ fontWeight: 600, color: 'var(--text-main)' }}>Stellar Testnet</span>
          <span style={{ color: 'var(--text-dim)' }}>|</span>
          <span style={{ color: 'var(--text-dim)' }}>Soroban RPC:</span>
          <span
            style={{
              fontWeight: 500,
              color: rpcStatus === 'healthy' ? '#10B981' : '#F59E0B',
              textTransform: 'uppercase',
              fontSize: '0.7rem',
            }}
          >
            {rpcStatus}
          </span>
        </div>

        {latestLedger > 0 && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontFamily: 'var(--font-mono)' }}>
            <Activity size={12} color="var(--cyan-glow)" />
            <span>Ledger:</span>
            <span style={{ color: 'var(--cyan-glow)', fontWeight: 600 }}>#{latestLedger}</span>
          </div>
        )}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Zap size={12} color="var(--gold-glow)" />
          <span style={{ color: 'var(--text-dim)' }}>Protocol:</span>
          <span style={{ color: 'var(--gold-glow)', fontWeight: 600 }}>Soroban v22</span>
        </div>

        <a
          href={explorerUrl}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            color: 'var(--cyan-glow)',
            textDecoration: 'none',
            fontWeight: 500,
            fontFamily: 'var(--font-mono)',
          }}
          title="Inspect contract on Stellar Expert Explorer"
        >
          <ShieldCheck size={13} />
          <span>{`${contractId.slice(0, 6)}...${contractId.slice(-6)}`}</span>
          <ExternalLink size={10} />
        </a>
      </div>
    </footer>
  );
};
