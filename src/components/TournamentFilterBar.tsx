import React from 'react';
import { Search, Filter, ArrowUpDown, DollarSign } from 'lucide-react';

export interface TournamentFilterProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  statusFilter: string;
  onStatusChange: (status: string) => void;
  assetFilter: string;
  onAssetChange: (asset: string) => void;
  sortBy: string;
  onSortChange: (sort: string) => void;
}

export const TournamentFilterBar: React.FC<TournamentFilterProps> = ({
  searchQuery,
  onSearchChange,
  statusFilter,
  onStatusChange,
  assetFilter,
  onAssetChange,
  sortBy,
  onSortChange,
}) => {
  return (
    <div
      className="glass-panel"
      style={{
        padding: '16px 20px',
        marginBottom: '24px',
        display: 'flex',
        flexWrap: 'wrap',
        gap: '14px',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderRadius: '12px',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        background: 'rgba(8, 12, 24, 0.85)',
      }}
      data-testid="tournament-filter-bar"
    >
      {/* Search Input */}
      <div
        style={{
          position: 'relative',
          flex: '1 1 240px',
          minWidth: '200px',
        }}
      >
        <Search
          size={16}
          style={{
            position: 'absolute',
            left: '12px',
            top: '50%',
            transform: 'translateY(-50%)',
            color: 'var(--text-dim)',
          }}
        />
        <input
          type="text"
          placeholder="Search tournaments by name or ID..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          aria-label="Search tournaments"
          style={{
            width: '100%',
            padding: '10px 14px 10px 36px',
            background: 'rgba(0, 0, 0, 0.35)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '8px',
            color: 'var(--text-main)',
            fontSize: '0.85rem',
            outline: 'none',
          }}
        />
      </div>

      {/* Filter Controls Row */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '10px',
          alignItems: 'center',
        }}
      >
        {/* Status Filter */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Filter size={14} style={{ color: 'var(--cyan-glow)' }} />
          <select
            value={statusFilter}
            onChange={(e) => onStatusChange(e.target.value)}
            aria-label="Filter by tournament status"
            style={{
              padding: '8px 12px',
              background: 'rgba(0, 0, 0, 0.35)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '8px',
              color: 'var(--text-main)',
              fontSize: '0.8rem',
              cursor: 'pointer',
              outline: 'none',
            }}
          >
            <option value="ALL">All Statuses</option>
            <option value="OPEN">Open (Joinable)</option>
            <option value="FUNDING">Funding</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="COMPLETED">Completed</option>
          </select>
        </div>

        {/* Prize Asset Filter */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <DollarSign size={14} style={{ color: 'var(--gold-glow)' }} />
          <select
            value={assetFilter}
            onChange={(e) => onAssetChange(e.target.value)}
            aria-label="Filter by prize asset"
            style={{
              padding: '8px 12px',
              background: 'rgba(0, 0, 0, 0.35)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '8px',
              color: 'var(--text-main)',
              fontSize: '0.8rem',
              cursor: 'pointer',
              outline: 'none',
            }}
          >
            <option value="ALL">All Assets</option>
            <option value="USDC">USDC (Stellar)</option>
            <option value="XLM">Native XLM</option>
          </select>
        </div>

        {/* Sort Order Selector */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <ArrowUpDown size={14} style={{ color: 'var(--purple-neon)' }} />
          <select
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value)}
            aria-label="Sort tournaments"
            style={{
              padding: '8px 12px',
              background: 'rgba(0, 0, 0, 0.35)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '8px',
              color: 'var(--text-main)',
              fontSize: '0.8rem',
              cursor: 'pointer',
              outline: 'none',
            }}
          >
            <option value="prize_desc">Highest Prize Pool</option>
            <option value="prize_asc">Lowest Prize Pool</option>
            <option value="participants_desc">Most Participants</option>
            <option value="ending_soon">Ending Soon</option>
          </select>
        </div>
      </div>
    </div>
  );
};
