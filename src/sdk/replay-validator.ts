export interface VerificationResult {
  valid: boolean;
  score: number;
  entropy: number;
  reason?: string;
}

export class ReplayValidator {
  public static calculateEntropy(inputSequence: number[]): number {
    if (inputSequence.length === 0) return 0;
    const freq: Record<number, number> = {};
    for (const val of inputSequence) {
      freq[val] = (freq[val] || 0) + 1;
    }
    let entropy = 0;
    const total = inputSequence.length;
    for (const key of Object.keys(freq)) {
      const p = freq[Number(key)] / total;
      entropy -= p * Math.log2(p);
    }
    return Math.round(entropy * 100) / 100;
  }

  public static verifyRun(inputs: number[], rawScore: number): VerificationResult {
    const entropy = this.calculateEntropy(inputs);
    if (inputs.length < 10) {
      return { valid: false, score: 0, entropy, reason: 'ERR_RUN_TOO_SHORT' };
    }
    if (entropy < 1.0) {
      return { valid: false, score: 0, entropy, reason: 'ERR_LOW_ENTROPY' };
    }
    return { valid: true, score: rawScore, entropy };
  }
}
