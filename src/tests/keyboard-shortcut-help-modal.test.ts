import { describe, it, expect, vi } from 'vitest';
import React from 'react';
import { renderToString } from 'react-dom/server';
import { KeyboardShortcutHelpModal } from '../components/KeyboardShortcutHelpModal';

describe('KeyboardShortcutHelpModal Component', () => {
  it('returns null when isOpen is false', () => {
    const html = renderToString(
      React.createElement(KeyboardShortcutHelpModal, {
        isOpen: false,
        onClose: vi.fn(),
      })
    );
    expect(html).toBe('');
  });

  it('renders modal with hotkey listings when isOpen is true', () => {
    const html = renderToString(
      React.createElement(KeyboardShortcutHelpModal, {
        isOpen: true,
        onClose: vi.fn(),
      })
    );

    expect(html).toContain('Keyboard Shortcuts &amp; Controls');
    expect(html).toContain('Throw / Launch Water Balloon');
    expect(html).toContain('Toggle Global Sound &amp; Audio Synth');
    expect(html).toContain('Close Active Modal / Overlay');
    expect(html).toContain('Space');
    expect(html).toContain('Esc');
    expect(html).toContain('M');
  });
});
