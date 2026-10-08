import React from 'react';
import { Users, Coins, ExternalLink, Play, Lock, BarChart2, ShieldCheck, Trophy, CheckCircle } from 'lucide-react';
import { TournamentItem } from '../services/api';

interface TournamentCardProps {
  tournament: TournamentItem;
  onPlay: (t: TournamentItem) => void;
  onFund: (t: TournamentItem) => void;
  onLeaderboard: (t: TournamentItem) => void;
  onFinancials: (t: TournamentItem) => void;
  onAgreement?: (t: TournamentItem) => void;
  onRankings?: (t: TournamentItem) => void;
  onSettle?: (t: TournamentItem) => void;
}

export const TournamentCard: React.FC<TournamentCardProps> = ({
  tournament,
  onPlay,
  onFund,
  onLeaderboard,
  onFinancials,
  onAgreement,
  onRankings,
  onSettle,
}) => {
  const getBadgeClass = (state: string) => {
    switch (state) {
      case 'OPEN':
        return 'badge badge-open';
      case 'FUNDING':
        return 'badge badge-funding';
      case 'IN_PROGRESS':
        return 'badge badge-progress';
      case 'FULL':
        return 'badge badge-full';
      default:
        return 'badge badge-completed';
    }
  };

  const isFunded = tournament.state !== 'FUNDING' && tournament.state !== 'DRAFT';
  const shorten = (str: string) => `${str.slice(0, 4)}...${str.slice(-4)}`;

  return (
    <div className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '18px' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px' }}>
        <div>
          <span className={getBadgeClass(tournament.state)}>{tournament.state}</span>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginTop: '8px' }}>{tournament.name}</h3>
        </div>

        <div style={{ textAlign: 'right' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--gold-glow)', fontWeight: 800, fontSize: '1.25rem', fontFamily: 'var(--font-mono)' }}>
            <Coins size={18} />
            <span>{tournament.prizePoolAmount} {tournament.prizeAsset}</span>
          </div>
          <span style={{ fontSize: '0.75rem', color: isFunded ? 'var(--emerald-glow)' : 'var(--text-dim)', fontWeight: 600 }}>
            {isFunded ? 'PRIZE POOL FUNDED ✓' : 'UNFUNDED'}
          </span>
        </div>
      </div>

      {/* Description */}
      <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', lineHeight: 1.5, flex: 1 }}>
        {tournament.description}
      </p>

      {/* Metadata Metrics */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: '12px',
          background: 'rgba(255, 255, 255, 0.02)',
          padding: '12px',
          borderRadius: '8px',
          border: '1px solid rgba(255, 255, 255, 0.05)',
        }}
      >
        <div>
          <span style={{ fontSize: '0.7rem', color: 'var(--text-dim)', textTransform: 'uppercase' }}>Game</span>
          <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-main)' }}>
            Splash Rush <span style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>v1.0.0</span>
          </div>
        </div>

        <div>
          <span style={{ fontSize: '0.7rem', color: 'var(--text-dim)', textTransform: 'uppercase' }}>Players</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.85rem', fontWeight: 700, fontFamily: 'var(--font-mono)' }}>
            <Users size={14} style={{ color: 'var(--cyan-glow)' }} />
            <span>{tournament.currentParticipants} / {tournament.maxParticipants}</span>
          </div>
        </div>

        <div>
          <span style={{ fontSize: '0.7rem', color: 'var(--text-dim)', textTransform: 'uppercase' }}>Creator</span>
          <div style={{ fontSize: '0.8rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>
            {shorten(tournament.creatorWallet)}
          </div>
        </div>

        <div>
          <span style={{ fontSize: '0.7rem', color: 'var(--text-dim)', textTransform: 'uppercase' }}>Vault Escrow</span>
          <div style={{ fontSize: '0.8rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>
            {shorten(tournament.vaultAddress)}
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginTop: '6px' }}>
        {tournament.state === 'OPEN' && (
          <button className="btn-primary" onClick={() => onPlay(tournament)} style={{ flex: 1, justifyContent: 'center' }}>
            <Play size={16} /> Play Match
          </button>
        )}

        {tournament.state === 'FUNDING' && (
          <button className="btn-purple" onClick={() => onFund(tournament)} style={{ flex: 1, justifyContent: 'center' }}>
            <Coins size={16} /> Fund Prize Pool
          </button>
        )}

        {tournament.state !== 'FUNDING' && tournament.state !== 'OPEN' && (
          <button className="btn-secondary" disabled style={{ flex: 1, justifyContent: 'center' }}>
            <Lock size={16} /> {tournament.state}
          </button>
        )}

        <button
          className="btn-secondary"
          onClick={() => onAgreement && onAgreement(tournament)}
          title="Prize Agreement & Financial Rules"
        >
          <ShieldCheck size={16} />
        </button>

        <button
          className="btn-secondary"
          onClick={() => onRankings && onRankings(tournament)}
          title="Verified Tournament Standings"
        >
          <Trophy size={16} />
        </button>

        <button className="btn-secondary" onClick={() => onLeaderboard(tournament)} title="Live Leaderboard">
          <BarChart2 size={16} />
        </button>

        <button className="btn-secondary" onClick={() => onFinancials(tournament)} title="On-chain Vault Financials">
          <ExternalLink size={16} />
        </button>

        <button
          className="btn-secondary"
          onClick={() => onSettle && onSettle(tournament)}
          title="Deterministic Prize Settlement & Payouts"
          style={{ borderColor: 'rgba(6, 182, 212, 0.4)', color: '#06b6d4' }}
        >
          <CheckCircle size={16} />
        </button>
      </div>
    </div>
  );
};
