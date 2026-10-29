import { describe, it, expect } from 'vitest';
import { ReplayValidator } from '../sdk';

describe('SDK ReplayValidator', () => {
  it('computes shannon entropy correctly for varied inputs', () => {
    const varied = [1, 2, 3, 4, 1, 2, 3, 4, 1, 2];
    const entropy = ReplayValidator.calculateEntropy(varied);
    expect(entropy).toBeGreaterThan(1.5);
  });

  it('rejects short runs', () => {
    const res = ReplayValidator.verifyRun([1, 2, 3], 100);
    expect(res.valid).toBe(false);
    expect(res.reason).toBe('ERR_RUN_TOO_SHORT');
  });

  it('approves valid long runs with sufficient entropy', () => {
    const validInputs = [1, 2, 3, 4, 1, 2, 3, 4, 1, 2, 3, 4, 1, 2, 3, 4];
    const res = ReplayValidator.verifyRun(validInputs, 2500);
    expect(res.valid).toBe(true);
    expect(res.score).toBe(2500);
    expect(res.entropy).toBeGreaterThan(1.0);
  });
});
