import { describe, it, expect } from 'vitest';
import React from 'react';
import { renderToString } from 'react-dom/server';
import { CopyTooltipButton } from '../components/CopyTooltipButton';

describe('CopyTooltipButton Component', () => {
  it('renders default copy label and icon', () => {
    const html = renderToString(
      React.createElement(CopyTooltipButton, {
        textToCopy: '0x1234567890abcdef',
      })
    );

    expect(html).toContain('Copy');
    expect(html).toContain('Copy 0x1234567890abcdef');
    expect(html).toContain('<svg');
  });

  it('renders custom labels when specified', () => {
    const html = renderToString(
      React.createElement(CopyTooltipButton, {
        textToCopy: 'CACHWJEZY6JN36VFACWRQ7FP4T5EPRRRNBVLOSFHXTJHETZY36JD7QYJ',
        label: 'Copy Contract ID',
      })
    );

    expect(html).toContain('Copy Contract ID');
  });
});
