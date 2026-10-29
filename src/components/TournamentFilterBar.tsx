import React from 'react';
import { Search, Filter, ArrowUpDown, DollarSign, X, Tag } from 'lucide-react';

export interface TournamentFilterProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  statusFilter: string;
  onStatusChange: (status: string) => void;
  assetFilter: string;
  onAssetChange: (asset: string) => void;
  sortBy: string;
  onSortChange: (sort: string) => void;
  totalCount?: number;
  onClearFilters?: () => void;
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
  totalCount,
  onClearFilters,
}) => {
  const hasActiveFilters =
    Boolean(searchQuery) ||
    (statusFilter && statusFilter !== 'ALL') ||
    (assetFilter && assetFilter !== 'ALL') ||
    (sortBy && sortBy !== 'prize_desc');

  const activeFilterCount =
    (searchQuery ? 1 : 0) +
    (statusFilter && statusFilter !== 'ALL' ? 1 : 0) +
    (assetFilter && assetFilter !== 'ALL' ? 1 : 0) +
    (sortBy && sortBy !== 'prize_desc' ? 1 : 0);

  const quickStatusTags = [
    { label: 'All', value: 'ALL' },
    { label: '🔥 Open', value: 'OPEN' },
    { label: '⚡ Active', value: 'ACTIVE' },
    { label: '🏆 Completed', value: 'COMPLETED' },
  ];

  return (
    <div
      className="glass-panel"
      style={{
        padding: '16px 20px',
        marginBottom: '24px',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
        borderRadius: '12px',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        background: 'rgba(8, 12, 24, 0.85)',
      }}
      data-testid="tournament-filter-bar"
    >
      {/* Top Row: Search + Select Dropdowns */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '14px',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
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
          {searchQuery && (
            <button
              type="button"
              onClick={() => onSearchChange('')}
              style={{
                position: 'absolute',
                right: '10px',
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'none',
                border: 'none',
                color: 'var(--text-dim)',
                cursor: 'pointer',
                padding: '2px',
              }}
              title="Clear search"
            >
              <X size={14} />
            </button>
          )}
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
                fontSize: '0.82rem',
                outline: 'none',
                cursor: 'pointer',
              }}
            >
              <option value="ALL">All Statuses</option>
              <option value="OPEN">Open (Joinable)</option>
              <option value="ACTIVE">Active (In Progress)</option>
              <option value="COMPLETED">Completed (Settled)</option>
              <option value="CANCELLED">Cancelled</option>
            </select>
          </div>

          {/* Asset Filter */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <DollarSign size={14} style={{ color: 'var(--emerald-glow)' }} />
            <select
              value={assetFilter}
              onChange={(e) => onAssetChange(e.target.value)}
              aria-label="Filter by prize token"
              style={{
                padding: '8px 12px',
                background: 'rgba(0, 0, 0, 0.35)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '8px',
                color: 'var(--text-main)',
                fontSize: '0.82rem',
                outline: 'none',
                cursor: 'pointer',
              }}
            >
              <option value="ALL">All Assets</option>
              <option value="XLM">Native XLM</option>
              <option value="USDC">USDC (Testnet)</option>
            </select>
          </div>

          {/* Sort Control */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <ArrowUpDown size={14} style={{ color: 'var(--gold-glow)' }} />
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
                fontSize: '0.82rem',
                outline: 'none',
                cursor: 'pointer',
              }}
            >
              <option value="prize_desc">Highest Prize Pool</option>
              <option value="prize_asc">Lowest Prize Pool</option>
              <option value="participants_desc">Most Participants</option>
              <option value="date_desc">Newest First</option>
            </select>
          </div>
        </div>
      </div>

      {/* Bottom Row: Quick Status Pills & Active Filters Info */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '8px',
          paddingTop: '6px',
          borderTop: '1px solid rgba(255, 255, 255, 0.04)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
          <Tag size={13} style={{ color: 'var(--text-dim)', marginRight: '2px' }} />
          {quickStatusTags.map((tag) => {
            const isSelected = statusFilter === tag.value;
            return (
              <button
                key={tag.value}
                type="button"
                onClick={() => onStatusChange(tag.value)}
                style={{
                  padding: '4px 10px',
                  borderRadius: '6px',
                  fontSize: '0.75rem',
                  fontWeight: isSelected ? 600 : 400,
                  border: isSelected
                    ? '1px solid var(--cyan-glow, #00F0FF)'
                    : '1px solid rgba(255, 255, 255, 0.08)',
                  background: isSelected
                    ? 'rgba(0, 240, 255, 0.12)'
                    : 'rgba(255, 255, 255, 0.03)',
                  color: isSelected ? 'var(--cyan-glow, #00F0FF)' : 'var(--text-dim)',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                }}
              >
                {tag.label}
              </button>
            );
          })}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {typeof totalCount === 'number' && (
            <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>
              {`Showing ${totalCount} tournament${totalCount === 1 ? '' : 's'}`}
            </span>
          )}

          {hasActiveFilters && onClearFilters && (
            <button
              type="button"
              onClick={onClearFilters}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
                padding: '3px 8px',
                borderRadius: '6px',
                fontSize: '0.72rem',
                border: '1px solid rgba(255, 0, 85, 0.3)',
                background: 'rgba(255, 0, 85, 0.08)',
                color: 'var(--rose-glow, #ff0055)',
                cursor: 'pointer',
              }}
            >
              <X size={12} />
              Reset Filters ({activeFilterCount})
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
