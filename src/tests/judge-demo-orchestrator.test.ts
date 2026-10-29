import { describe, it, expect } from 'vitest';
// @ts-expect-error cjs import
import { DEMO_CONFIG } from '../../scripts/run-judge-demo.cjs';

describe('Judge Demo Orchestrator Configuration', () => {
  it('has verified testnet contract address configured', () => {
    expect(DEMO_CONFIG.contractId).toBe('CACHWJEZY6JN36VFACWRQ7FP4T5EPRRRNBVLOSFHXTJHETZY36JD7QYJ');
  });

  it('has valid admin public key configured', () => {
    expect(DEMO_CONFIG.adminKey).toBe('GCQ3OLBMJUGWN3PHYE3SDIKKIPVLJSFFWG4Q4CEABGHWGBEBPBKMY6OW');
  });

  it('targets Stellar testnet network', () => {
    expect(DEMO_CONFIG.network).toBe('testnet');
    expect(DEMO_CONFIG.tournamentId).toBe(101);
  });
});

