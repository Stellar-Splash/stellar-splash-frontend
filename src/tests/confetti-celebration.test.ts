import { describe, it, expect, vi } from 'vitest';
import React from 'react';
import { renderToString } from 'react-dom/server';
import { ConfettiCelebration } from '../components/ConfettiCelebration';

describe('ConfettiCelebration Component', () => {
  it('returns null when active is false', () => {
    const html = renderToString(
      React.createElement(ConfettiCelebration, {
        active: false,
      })
    );
    expect(html).toBe('');
  });

  it('renders canvas element when active is true', () => {
    const html = renderToString(
      React.createElement(ConfettiCelebration, {
        active: true,
        durationMs: 3000,
        particleCount: 50,
        onComplete: vi.fn(),
      })
    );

    expect(html).toContain('<canvas');
    expect(html).toContain('data-testid="confetti-canvas"');
    expect(html).toContain('pointer-events:none');
  });
});
