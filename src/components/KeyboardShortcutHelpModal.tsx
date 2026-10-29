import React, { useEffect } from 'react';

export interface ShortcutItem {
  keys: string[];
  description: string;
  category: 'Game Action' | 'Global / HUD' | 'Accessibility';
}

export interface KeyboardShortcutHelpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SHORTCUTS: ShortcutItem[] = [
  { keys: ['W', '↑'], description: 'Move Player Up', category: 'Game Action' },
  { keys: ['S', '↓'], description: 'Move Player Down', category: 'Game Action' },
  { keys: ['A', '←'], description: 'Move Player Left', category: 'Game Action' },
  { keys: ['D', '→'], description: 'Move Player Right', category: 'Game Action' },
  { keys: ['Space', 'Enter'], description: 'Throw / Launch Water Balloon', category: 'Game Action' },
  { keys: ['M'], description: 'Toggle Global Sound & Audio Synth', category: 'Global / HUD' },
  { keys: ['?'], description: 'Open Keyboard Shortcuts Reference', category: 'Global / HUD' },
  { keys: ['Esc'], description: 'Close Active Modal / Overlay', category: 'Accessibility' },
  { keys: ['Tab'], description: 'Navigate Focusable Controls', category: 'Accessibility' },
];

export const KeyboardShortcutHelpModal: React.FC<KeyboardShortcutHelpModalProps> = ({
  isOpen,
  onClose,
}) => {
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="shortcuts-title"
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.75)',
        backdropFilter: 'blur(8px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 10000,
        padding: '16px',
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '520px',
          background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
          borderRadius: '16px',
          border: '1px solid rgba(56, 189, 248, 0.3)',
          boxShadow: '0 20px 40px rgba(0, 0, 0, 0.6), 0 0 30px rgba(56, 189, 248, 0.15)',
          padding: '24px',
          color: '#ffffff',
          maxHeight: '90vh',
          overflowY: 'auto',
          boxSizing: 'border-box',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                background: 'rgba(56, 189, 248, 0.15)',
                color: '#38bdf8',
                fontWeight: 700,
                fontSize: '1rem',
              }}
            >
              ⌨
            </span>
            <h2 id="shortcuts-title" style={{ margin: 0, fontSize: '1.2rem', fontWeight: 700 }}>
              Keyboard Shortcuts &amp; Controls
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close shortcuts modal"
            style={{
              background: 'rgba(255, 255, 255, 0.08)',
              border: 'none',
              borderRadius: '8px',
              color: '#9ca3af',
              cursor: 'pointer',
              fontSize: '1.2rem',
              width: '32px',
              height: '32px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            &times;
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {SHORTCUTS.map((s, idx) => (
            <div
              key={idx}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '8px 12px',
                borderRadius: '8px',
                background: 'rgba(255, 255, 255, 0.03)',
                border: '1px solid rgba(255, 255, 255, 0.05)',
              }}
            >
              <span style={{ fontSize: '0.85rem', color: '#e2e8f0', fontWeight: 500 }}>
                {s.description}
              </span>

              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                {s.keys.map((k, kIdx) => (
                  <kbd
                    key={kIdx}
                    style={{
                      background: 'rgba(0, 0, 0, 0.4)',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      borderRadius: '6px',
                      padding: '3px 8px',
                      fontSize: '0.75rem',
                      fontFamily: 'monospace',
                      fontWeight: 700,
                      color: '#38bdf8',
                      boxShadow: '0 2px 0 rgba(0, 0, 0, 0.5)',
                    }}
                  >
                    {k}
                  </kbd>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
