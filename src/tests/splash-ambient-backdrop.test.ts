import { describe, it, expect } from 'vitest';
import React from 'react';
import { renderToString } from 'react-dom/server';
import { SplashAmbientBackdrop } from '../components/SplashAmbientBackdrop';

describe('SplashAmbientBackdrop Component', () => {
  it('renders fixed background container with accessibility hidden attribute', () => {
    const html = renderToString(React.createElement(SplashAmbientBackdrop, { intensity: 'subtle' }));

    expect(html).toContain('data-testid="splash-ambient-backdrop"');
    expect(html).toContain('aria-hidden="true"');
    expect(html).toContain('url(#cyber-grid)');
    expect(html).toContain('url(#nebula-cyan)');
    expect(html).toContain('url(#nebula-purple)');
  });

  it('adjusts SVG grid opacity based on intensity prop', () => {
    const subtleHtml = renderToString(React.createElement(SplashAmbientBackdrop, { intensity: 'subtle' }));
    const highHtml = renderToString(React.createElement(SplashAmbientBackdrop, { intensity: 'high' }));

    expect(subtleHtml).toContain('opacity:0.04');
    expect(highHtml).toContain('opacity:0.14');
  });
});
