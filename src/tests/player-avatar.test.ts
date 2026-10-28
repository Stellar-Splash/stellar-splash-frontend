import { describe, it, expect } from 'vitest';
import React from 'react';
import { renderToString } from 'react-dom/server';
import { PlayerAvatar } from '../components/PlayerAvatar';

describe('PlayerAvatar Component', () => {
  const address1 = 'GCKAZD66N6E64B44J7K3XW6P2W3V7QOXWCV7T4KQL3ZPL2GB6V2A73VU';
  const address2 = 'GA2C5RFPE6GCKMY3US5PAB6UZLKIGAHWKXX2GAKVOOUMVQHGASVMOROB';

  it('renders SVG avatar with correct dimensions', () => {
    const html = renderToString(React.createElement(PlayerAvatar, { address: address1, size: 40 }));

    expect(html).toContain('data-testid="player-avatar-svg"');
    expect(html).toContain('width:40px');
    expect(html).toContain('height:40px');
    expect(html).toContain('width="40"');
    expect(html).toContain('height="40"');
  });

  it('renders deterministic gradient IDs for identical addresses', () => {
    const html1 = renderToString(React.createElement(PlayerAvatar, { address: address1 }));
    const html2 = renderToString(React.createElement(PlayerAvatar, { address: address1 }));

    // Extract gradient id
    const match1 = html1.match(/avatar-grad-[a-z0-9]+/);
    const match2 = html2.match(/avatar-grad-[a-z0-9]+/);

    expect(match1).not.toBeNull();
    expect(match2).not.toBeNull();
    expect(match1![0]).toBe(match2![0]);
  });

  it('generates distinct avatars for different addresses', () => {
    const html1 = renderToString(React.createElement(PlayerAvatar, { address: address1 }));
    const html2 = renderToString(React.createElement(PlayerAvatar, { address: address2 }));

    const match1 = html1.match(/avatar-grad-[a-z0-9]+/);
    const match2 = html2.match(/avatar-grad-[a-z0-9]+/);

    expect(match1![0]).not.toBe(match2![0]);
  });

  it('handles empty or missing address safely', () => {
    const html = renderToString(React.createElement(PlayerAvatar, { address: '' }));
    expect(html).toContain('data-testid="player-avatar-svg"');
  });
});
