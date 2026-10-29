export type TransactionStep = 'SIMULATING' | 'SIGNING' | 'SUBMITTING' | 'CONFIRMED' | 'REVERTED';

export interface TransactionStepperState {
  currentStep: TransactionStep;
  txHash?: string;
  errorMessage?: string;
  actionName: string; // e.g. "Register for Tournament", "Authorize Payout"
  startedAt: number;
  completedAt?: number;
}

