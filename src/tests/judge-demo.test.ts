import { describe, it, expect } from 'vitest';
import { JudgeDemoService } from '../services/judge-demo.service';

describe('JudgeDemoService', () => {
  it('returns preconfigured hackathon evaluation scenarios', () => {
    const scenarios = JudgeDemoService.getPresetScenarios();
    expect(scenarios.length).toBeGreaterThanOrEqual(2);

    const quickSettle = scenarios.find((s) => s.scenarioId === 'quick-settle');
    expect(quickSettle).toBeDefined();
    expect(quickSettle?.targetPrizeXlm).toBe(100);
    expect(quickSettle?.simulatedPlayersCount).toBe(3);
    expect(quickSettle?.steps.length).toBeGreaterThanOrEqual(4);

    const sponsorBoost = scenarios.find((s) => s.scenarioId === 'sponsor-boost');
    expect(sponsorBoost).toBeDefined();
    expect(sponsorBoost?.targetPrizeXlm).toBe(250);
  });
});
