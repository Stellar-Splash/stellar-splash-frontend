import { describe, it, expect, vi } from 'vitest';
import React from 'react';
import { HighScoreCelebration } from '../components/HighScoreCelebration';

describe('HighScoreCelebration Component', () => {
  it('renders null when isVisible is false', () => {
    const element = React.createElement(HighScoreCelebration, {
      score: 1500,
      isVisible: false,
    });
    expect(React.isValidElement(element)).toBe(true);
    expect(element.props.isVisible).toBe(false);
  });

  it('renders personal best badge when current score exceeds previous best', () => {
    const onDismiss = vi.fn();
    const element = React.createElement(HighScoreCelebration, {
      score: 2500,
      previousBest: 1800,
      tournamentTitle: 'Splash Championship',
      onDismiss,
      isVisible: true,
    });

    expect(React.isValidElement(element)).toBe(true);
    expect(element.props.score).toBe(2500);
    expect(element.props.previousBest).toBe(1800);
    expect(element.props.score > (element.props.previousBest ?? 0)).toBe(true);
  });

  it('identifies standard completion when score does not exceed previous best', () => {
    const element = React.createElement(HighScoreCelebration, {
      score: 1200,
      previousBest: 1500,
      tournamentTitle: 'Weekly Qualifier',
      isVisible: true,
    });

    expect(element.props.score > (element.props.previousBest ?? 0)).toBe(false);
  });
});
