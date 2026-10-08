import React, { useState } from 'react';
import { Search, PlusCircle, RefreshCw } from 'lucide-react';
import { TournamentCard } from './TournamentCard';
import { TournamentItem } from '../services/api';

interface TournamentDiscoveryProps {
  tournaments: TournamentItem[];
  loading: boolean;
  onRefresh: () => void;
  onPlay: (t: TournamentItem) => void;
  onFund: (t: TournamentItem) => void;
  onLeaderboard: (t: TournamentItem) => void;
  onFinancials: (t: TournamentItem) => void;
  onAgreement?: (t: TournamentItem) => void;
  onRankings?: (t: TournamentItem) => void;
  onCreateClick: () => void;
}

export const TournamentDiscovery: React.FC<TournamentDiscoveryProps> = ({
  tournaments,
  loading,
  onRefresh,
  onPlay,
  onFund,
  onLeaderboard,
  onFinancials,
  onAgreement,
  onRankings,
  onCreateClick,
}) => {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<string>('ALL');

  const filtered = tournaments.filter((t) => {
    const matchesSearch =
      t.name.toLowerCase().includes(search.toLowerCase()) ||
      t.description.toLowerCase().includes(search.toLowerCase());

    if (!matchesSearch) return false;
    if (filter === 'ALL') return true;
    return t.state === filter;
  });

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 32px 64px' }}>
      {/* Controls Bar */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '16px',
          marginBottom: '32px',
        }}
      >
        <div>
          <h2 style={{ fontSize: '1.8rem', fontWeight: 800 }}>Explore Tournaments</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            Compete for real Stellar Testnet prize pools in verified arenas.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
          {/* Search Box */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              background: 'rgba(255, 255, 255, 0.04)',
              border: '1px solid var(--border-glass)',
              borderRadius: '8px',
              padding: '8px 14px',
            }}
          >
            <Search size={16} style={{ color: 'var(--text-dim)' }} />
            <input
              type="text"
              placeholder="Search tournaments..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--text-main)',
                fontSize: '0.85rem',
                outline: 'none',
                width: '180px',
              }}
            />
          </div>

          {/* Refresh Button */}
          <button
            className="btn-secondary"
            onClick={onRefresh}
            style={{ padding: '8px 14px' }}
            title="Refresh Tournament List"
          >
            <RefreshCw size={16} className={loading ? 'spin' : ''} />
          </button>

          {/* Create Button */}
          <button className="btn-purple" onClick={onCreateClick} style={{ padding: '8px 18px', fontSize: '0.85rem' }}>
            <PlusCircle size={16} /> Create Tournament
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '24px', flexWrap: 'wrap' }}>
        {['ALL', 'OPEN', 'FUNDING', 'IN_PROGRESS', 'COMPLETED'].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            style={{
              background: filter === f ? 'rgba(0, 240, 255, 0.15)' : 'rgba(255, 255, 255, 0.03)',
              color: filter === f ? 'var(--cyan-glow)' : 'var(--text-muted)',
              border: filter === f ? '1px solid rgba(0, 240, 255, 0.4)' : '1px solid transparent',
              borderRadius: '9999px',
              padding: '6px 16px',
              fontSize: '0.75rem',
              fontWeight: 700,
              cursor: 'pointer',
              fontFamily: 'var(--font-mono)',
              transition: 'all 0.2s ease',
            }}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Tournament Cards Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))',
          gap: '24px',
        }}
      >
        {filtered.map((t) => (
          <TournamentCard
            key={t.id}
            tournament={t}
            onPlay={onPlay}
            onFund={onFund}
            onLeaderboard={onLeaderboard}
            onFinancials={onFinancials}
            onAgreement={onAgreement}
            onRankings={onRankings}
          />
        ))}
      </div>

      {filtered.length === 0 && !loading && (
        <div className="glass-panel" style={{ padding: '48px', textAlign: 'center', color: 'var(--text-dim)' }}>
          No tournaments found matching your filter criteria.
        </div>
      )}
    </div>
  );
};
