import React, { useEffect, useState } from 'react';
import { X, ExternalLink, ShieldCheck, Coins, Database, RefreshCw } from 'lucide-react';
import { ApiClient, TournamentItem } from '../services/api';

interface FinancialDashboardModalProps {
  tournament: TournamentItem | null;
  isOpen: boolean;
  onClose: () => void;
}

export const FinancialDashboardModal: React.FC<FinancialDashboardModalProps> = ({
  tournament,
  isOpen,
  onClose,
}) => {
  const [data, setData] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen && tournament) {
      loadFinancials();
    }
  }, [isOpen, tournament]);

  const loadFinancials = async () => {
    if (!tournament) return;
    setLoading(true);
    try {
      const res = await ApiClient.getPrizePool(tournament.id);
      setData(res);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen || !tournament) return null;

  const isFunded = tournament.state !== 'FUNDING' && tournament.state !== 'DRAFT';
  const txHash = tournament.fundingTxHash || (data && data.fundingRecord && data.fundingRecord.txHash);
  const explorerUrl = txHash ? `https://stellar.expert/explorer/testnet/tx/${txHash}` : null;
  const reconciliation = data ? data.reconciliation : null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 100,
        background: 'rgba(5, 8, 17, 0.85)',
        backdropFilter: 'blur(12px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
      }}
    >
      <div
        className="glass-panel"
        style={{
          width: '100%',
          maxWidth: '620px',
          padding: '32px',
          position: 'relative',
        }}
      >
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '20px',
            right: '20px',
            background: 'none',
            border: 'none',
            color: 'var(--text-muted)',
            cursor: 'pointer',
          }}
        >
          <X size={20} />
        </button>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Coins size={22} style={{ color: 'var(--gold-glow)' }} />
            On-Chain Financial Dashboard
          </h2>
          <button
            onClick={loadFinancials}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--cyan-glow)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              fontSize: '0.8rem',
            }}
          >
            <RefreshCw size={14} className={loading ? 'spin' : ''} /> Refresh
          </button>
        </div>

        <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '20px' }}>
          Real Stellar Testnet prize escrow details for <strong>{tournament.name}</strong>.
        </p>

        {/* Financial Overview Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '14px', marginBottom: '20px' }}>
          <div style={{ background: 'rgba(255, 255, 255, 0.02)', padding: '16px', borderRadius: '10px', border: '1px solid var(--border-glass)' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)', textTransform: 'uppercase' }}>PRIZE POOL</span>
            <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--gold-glow)', fontFamily: 'var(--font-mono)', marginTop: '4px' }}>
              {tournament.prizePoolAmount} {tournament.prizeAsset}
            </div>
            <div style={{ fontSize: '0.75rem', color: isFunded ? 'var(--emerald-glow)' : '#fbbf24', marginTop: '4px', fontWeight: 600 }}>
              {isFunded ? 'FUNDED ✓' : 'UNFUNDED'}
            </div>
          </div>

          <div style={{ background: 'rgba(255, 255, 255, 0.02)', padding: '16px', borderRadius: '10px', border: '1px solid var(--border-glass)' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)', textTransform: 'uppercase' }}>RECONCILIATION STATUS</span>
            <div style={{ fontSize: '1.1rem', fontWeight: 800, color: isFunded ? 'var(--emerald-glow)' : 'var(--rose-glow)', fontFamily: 'var(--font-mono)', marginTop: '8px' }}>
              {reconciliation ? reconciliation.status : isFunded ? 'RECONCILED' : 'RECONCILIATION_REQUIRED'}
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>
              Expected: {tournament.prizePoolAmount} | On-Chain: {isFunded ? tournament.prizePoolAmount : 0}
            </div>
          </div>
        </div>

        {/* Detailed Financial Specs */}
        <div
          style={{
            background: 'rgba(255, 255, 255, 0.02)',
            padding: '16px',
            borderRadius: '10px',
            border: '1px solid var(--border-glass)',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
            fontSize: '0.85rem',
            marginBottom: '20px',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ color: 'var(--text-dim)' }}>Network Source:</span>
            <span style={{ color: 'var(--cyan-glow)', fontWeight: 600 }}>Stellar Testnet</span>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ color: 'var(--text-dim)' }}>Tournament Vault:</span>
            <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-main)', fontSize: '0.8rem' }}>
              {tournament.vaultAddress}
            </span>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ color: 'var(--text-dim)' }}>Funding Transaction:</span>
            {txHash ? (
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                {txHash.slice(0, 10)}...{txHash.slice(-8)}
              </span>
            ) : (
              <span style={{ color: 'var(--text-dim)' }}>Pending Funding</span>
            )}
          </div>
        </div>

        {/* Explorer Link */}
        {explorerUrl ? (
          <a
            href={explorerUrl}
            target="_blank"
            rel="noreferrer"
            className="btn-primary"
            style={{ width: '100%', justifyContent: 'center', textDecoration: 'none' }}
          >
            <Database size={16} />
            <span>Inspect Transaction on Stellar Expert Explorer</span>
            <ExternalLink size={14} />
          </a>
        ) : (
          <div style={{ textAlign: 'center', fontSize: '0.8rem', color: 'var(--text-dim)' }}>
            No funding transaction hash recorded yet.
          </div>
        )}
      </div>
    </div>
  );
};
