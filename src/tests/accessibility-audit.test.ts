import { describe, it, expect } from 'vitest';

function isElementAccessible(elementMarkup: string): boolean {
  return /aria-label|role=|title=/i.test(elementMarkup);
}

describe('Accessibility Compliance Validator', () => {
  it('identifies accessible buttons with aria-label', () => {
    const btn = '<button aria-label="Close modal">&times;</button>';
    expect(isElementAccessible(btn)).toBe(true);
  });

  it('identifies accessible regions with semantic roles', () => {
    const region = '<div role="dialog" aria-modal="true">Content</div>';
    expect(isElementAccessible(region)).toBe(true);
  });

  it('flags unlabelled non-semantic clickable elements', () => {
    const unlabelled = '<div onClick={handleClick}>X</div>';
    expect(isElementAccessible(unlabelled)).toBe(false);
  });
});

