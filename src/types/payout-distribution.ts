export interface PayoutTier {
  rank: number;
  basisPoints: number; // e.g. 5000 = 50%
  label: string;
  color: string;
}

export interface PayoutDistributionModel {
  totalPrizePoolXlm: number;
  tiers: PayoutTier[];
}
