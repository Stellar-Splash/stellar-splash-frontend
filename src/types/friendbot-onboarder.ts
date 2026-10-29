export interface FriendbotFundingState {
  isFunding: boolean;
  txHash?: string;
  error?: string;
  lastFundedAt?: number;
}

