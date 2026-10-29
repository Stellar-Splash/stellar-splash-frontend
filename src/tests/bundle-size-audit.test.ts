import { describe, it, expect } from 'vitest';

function checkChunkBudget(chunkSizeBytes: number, budgetKb: number = 500): boolean {
  const sizeKb = chunkSizeBytes / 1024;
  return sizeKb <= budgetKb;
}

describe('Bundle Size Audit Logic', () => {
  it('passes chunks within 500KB budget', () => {
    const chunk250Kb = 250 * 1024;
    expect(checkChunkBudget(chunk250Kb, 500)).toBe(true);
  });

  it('rejects oversized chunks exceeding budget', () => {
    const chunk600Kb = 600 * 1024;
    expect(checkChunkBudget(chunk600Kb, 500)).toBe(false);
  });
});
