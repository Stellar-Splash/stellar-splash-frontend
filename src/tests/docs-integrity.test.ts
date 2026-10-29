import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';

describe('Frontend Documentation Integrity', () => {
  const docsDir = path.join(__dirname, '..', '..', 'docs');
  const contractId = 'CACHWJEZY6JN36VFACWRQ7FP4T5EPRRRNBVLOSFHXTJHETZY36JD7QYJ';

  it('contains valid contract ID in Pitch Deck', () => {
    const pitchDeck = fs.readFileSync(path.join(docsDir, 'HACKATHON_PITCH_DECK.md'), 'utf8');
    expect(pitchDeck).toContain(contractId);
  });

  it('contains valid contract ID and live URL in Judge Cheatsheet', () => {
    const cheatsheet = fs.readFileSync(path.join(docsDir, 'JUDGE_CHEATSHEET.md'), 'utf8');
    expect(cheatsheet).toContain(contractId);
    expect(cheatsheet).toContain('stellar-splash.netlify.app');
  });

  it('includes production checklist with all key items', () => {
    const checklist = fs.readFileSync(path.join(docsDir, 'PRODUCTION_CHECKLIST.md'), 'utf8');
    expect(checklist).toContain('Protocol 21/22');
    expect(checklist).toContain('Channel account');
  });
});

