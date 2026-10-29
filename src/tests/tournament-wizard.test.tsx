import { describe, it, expect } from 'vitest';
import React from 'react';
import { renderToString } from 'react-dom/server';
import { TournamentCreationWizard } from '../components/TournamentCreationWizard';

describe('TournamentCreationWizard Component', () => {
  it('renders nothing when isOpen is false', () => {
    const html = renderToString(
      <TournamentCreationWizard isOpen={false} onClose={() => {}} onSubmit={() => {}} />
    );
    expect(html).toBe('');
  });

  it('renders step 1 inputs when opened', () => {
    const html = renderToString(
      <TournamentCreationWizard isOpen={true} onClose={() => {}} onSubmit={() => {}} />
    );
    expect(html).toContain('Tournament Identity');
    expect(html).toContain('Tournament Title');
    expect(html).toContain('Aqua Dash');
    expect(html).toContain('Bubble Blaster');
    expect(html).toContain('Next Step');
  });
});

