import React from 'react';
import { ChampionBadge } from '../types/champion-badge';
import './ChampionBadgeCard.css';

interface ChampionBadgeCardProps {
  badge: ChampionBadge;
}

export const ChampionBadgeCard: React.FC<ChampionBadgeCardProps> = ({ badge }) => {
  const formattedDate = new Date(badge.awardedAt).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  return (
    <div className={`champion-badge-card ${badge.tier.toLowerCase()}`}>
      <div className="badge-hexagon-wrapper">
        <svg viewBox="0 0 100 115" className="badge-hexagon-svg">
          <polygon
            points="50 0, 100 25, 100 85, 50 115, 0 85, 0 25"
            className="hexagon-polygon"
          />
        </svg>
        <span className="badge-trophy-icon">🏆</span>
      </div>

      <div className="badge-info">
        <span className="badge-tier-tag">{badge.tier} Victor</span>
        <h4 className="badge-tournament-title">{badge.tournamentTitle}</h4>
        <span className="badge-game-id">{badge.gameId}</span>
        <div className="badge-meta">
          <span>Awarded {formattedDate}</span>
          <span className="badge-sbt-pill">Soulbound Token</span>
        </div>
      </div>
    </div>
  );
};

