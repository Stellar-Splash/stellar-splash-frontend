export interface TournamentCreationFormData {
  title: string;
  gameId: string;
  targetPrizeAmountXlm: number;
  entryFeeXlm: number;
  maxParticipants: number;
  disputeWindowHours: number;
  creatorRoyaltyBps: number;
  bannerUri: string;
}

export type WizardStep = 1 | 2 | 3;

