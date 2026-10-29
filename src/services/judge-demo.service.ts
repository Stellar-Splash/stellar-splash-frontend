import { JudgeDemoScenario } from '../types/judge-demo';

export class JudgeDemoService {
  public static getPresetScenarios(): JudgeDemoScenario[] {
    return [
      {
        scenarioId: 'quick-settle',
        title: 'Instant 3-Player Tournament & Soroban Settlement',
        description: 'Auto-funds a 100 XLM prize pool, registers 3 synthetic bot competitors, simulates gameplay, and triggers instant on-chain prize settlement.',
        targetPrizeXlm: 100,
        simulatedPlayersCount: 3,
        steps: [
          'Pre-flight simulate contract invocation',
          'Fund 100 XLM vault reserve with Friendbot',
          'Enroll Alice, Bob, and Charlie',
          'Attest replay scores with SHA-256 verification hash',
          'Execute Soroban multi-player payout split',
        ],
      },
      {
        scenarioId: 'sponsor-boost',
        title: 'Crowdsourced Sponsorship & Creator Royalty',
        description: 'Demonstrates community prize pool boosting with sponsor refunds and 2.5% creator royalty distribution.',
        targetPrizeXlm: 250,
        simulatedPlayersCount: 5,
        steps: [
          'Open community tournament',
          'Deposit 150 XLM third-party sponsorship',
          'Calculate 2.5% protocol royalty share',
          'Verify solvency reserve balance',
        ],
      },
    ];
  }
}

