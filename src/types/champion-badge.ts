export interface ChampionBadge {
  badgeId: number;
  tournamentId: number;
  tournamentTitle: string;
  gameId: string;
  awardedAt: number;
  isSoulbound: true;
  tier: 'Gold' | 'Diamond' | 'Champion';
  issuerContract: string;
}

