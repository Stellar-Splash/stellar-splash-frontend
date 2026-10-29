import React, { useEffect } from 'react';
import { PlayerAvatar } from './PlayerAvatar';
import { StellarExpertLink } from './StellarExpertLink';

export interface PlayerStatSummary {
  matchesPlayed: number;
  wins: number;
  totalScore: number;
  totalPrizesEarned: string;
  highestRank: number;
}

export interface PlayerMatchHistoryItem {
  tournamentId: string;
  title: string;
  rank: number;
  score: number;
  prize?: string;
  date: string;
}

export interface PlayerProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  playerAddress: string;
  stats?: PlayerStatSummary;
  history?: PlayerMatchHistoryItem[];
}

export const PlayerProfileModal: React.FC<PlayerProfileModalProps> = ({
  isOpen,
  onClose,
  playerAddress,
  stats = {
    matchesPlayed: 14,
    wins: 4,
    totalScore: 18450,
    totalPrizesEarned: '120.5 XLM',
    highestRank: 1,
  },
  history = [],
}) => {
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const winRate =
    stats.matchesPlayed > 0 ? Math.round((stats.wins / stats.matchesPlayed) * 100) : 0;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="player-profile-title"
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.75)',
        backdropFilter: 'blur(8px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999,
        padding: '16px',
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '560px',
          background: 'linear-gradient(135deg, #111827 0%, #1f2937 100%)',
          borderRadius: '16px',
          border: '1px solid rgba(59, 130, 246, 0.3)',
          boxShadow: '0 20px 40px rgba(0, 0, 0, 0.6), 0 0 30px rgba(59, 130, 246, 0.15)',
          padding: '24px',
          color: '#ffffff',
          maxHeight: '90vh',
          overflowY: 'auto',
          boxSizing: 'border-box',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <PlayerAvatar address={playerAddress} size={48} />
            <div>
              <h2 id="player-profile-title" style={{ margin: 0, fontSize: '1.25rem', fontWeight: 700 }}>
                Player Profile
              </h2>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px' }}>
                <StellarExpertLink id={playerAddress} type="account" />
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close profile"
            style={{
              background: 'rgba(255, 255, 255, 0.08)',
              border: 'none',
              borderRadius: '8px',
              color: '#9ca3af',
              cursor: 'pointer',
              fontSize: '1.2rem',
              width: '32px',
              height: '32px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            &times;
          </button>
        </div>

        {/* Stats Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: '12px',
            marginBottom: '24px',
          }}
        >
          <div
            style={{
              background: 'rgba(255, 255, 255, 0.03)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '10px',
              padding: '14px',
            }}
          >
            <span style={{ fontSize: '0.75rem', color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Win Rate
            </span>
            <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#10b981', marginTop: '4px' }}>
              {`${winRate}%`}
            </div>
            <span style={{ fontSize: '0.75rem', color: '#6b7280' }}>
              {`${stats.wins} wins / ${stats.matchesPlayed} matches`}
            </span>
          </div>

          <div
            style={{
              background: 'rgba(255, 255, 255, 0.03)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '10px',
              padding: '14px',
            }}
          >
            <span style={{ fontSize: '0.75rem', color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Total Earnings
            </span>
            <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#38bdf8', marginTop: '4px' }}>
              {stats.totalPrizesEarned}
            </div>
            <span style={{ fontSize: '0.75rem', color: '#6b7280' }}>
              Cumulative on-chain escrow payouts
            </span>
          </div>

          <div
            style={{
              background: 'rgba(255, 255, 255, 0.03)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '10px',
              padding: '14px',
            }}
          >
            <span style={{ fontSize: '0.75rem', color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Best Finish
            </span>
            <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#f59e0b', marginTop: '4px' }}>
              {`Rank #${stats.highestRank}`}
            </div>
            <span style={{ fontSize: '0.75rem', color: '#6b7280' }}>
              Tournament peak standing
            </span>
          </div>

          <div
            style={{
              background: 'rgba(255, 255, 255, 0.03)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '10px',
              padding: '14px',
            }}
          >
            <span style={{ fontSize: '0.75rem', color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Career Points
            </span>
            <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#a855f7', marginTop: '4px' }}>
              {stats.totalScore.toLocaleString()}
            </div>
            <span style={{ fontSize: '0.75rem', color: '#6b7280' }}>
              Total verified splash score
            </span>
          </div>
        </div>

        {/* Match History */}
        <div>
          <h3 style={{ fontSize: '0.95rem', fontWeight: 600, color: '#e5e7eb', marginBottom: '12px' }}>
            Recent Tournament Matches
          </h3>

          {history.length === 0 ? (
            <div
              style={{
                textAlign: 'center',
                padding: '24px',
                background: 'rgba(255, 255, 255, 0.02)',
                borderRadius: '8px',
                color: '#6b7280',
                fontSize: '0.85rem',
              }}
            >
              No past matches recorded on-chain yet for this wallet.
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {history.map((m) => (
                <div
                  key={m.tournamentId}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '10px 14px',
                    borderRadius: '8px',
                    background: 'rgba(255, 255, 255, 0.03)',
                    border: '1px solid rgba(255, 255, 255, 0.05)',
                  }}
                >
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '0.85rem' }}>{m.title}</div>
                    <div style={{ fontSize: '0.75rem', color: '#6b7280', marginTop: '2px' }}>
                      {`${m.date} • Score: ${m.score}`}
                    </div>
                  </div>

                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontWeight: 700, fontSize: '0.85rem', color: m.rank === 1 ? '#f59e0b' : '#9ca3af' }}>
                      {`#${m.rank}`}
                    </div>
                    {m.prize && (
                      <div style={{ fontSize: '0.75rem', color: '#10b981', fontWeight: 600 }}>
                        {`+${m.prize}`}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
