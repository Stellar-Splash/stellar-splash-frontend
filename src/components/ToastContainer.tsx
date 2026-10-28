import React, { useState, useEffect } from 'react';
import { ToastService, ToastMessage } from '../services/toast';
import { CheckCircle2, AlertCircle, Info, AlertTriangle, ExternalLink, X } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  useEffect(() => {
    return ToastService.subscribe((list) => setToasts(list));
  }, []);

  if (toasts.length === 0) return null;

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '24px',
        right: '24px',
        zIndex: 9999,
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
        maxWidth: '420px',
        width: 'calc(100vw - 48px)',
        pointerEvents: 'none',
      }}
    >
      {toasts.map((toast) => {
        let borderColor = 'rgba(255, 255, 255, 0.15)';
        let glowColor = 'rgba(0, 240, 255, 0.2)';
        let Icon = Info;
        let iconColor = 'var(--cyan-glow)';

        if (toast.type === 'success') {
          borderColor = 'rgba(0, 255, 163, 0.4)';
          glowColor = 'rgba(0, 255, 163, 0.25)';
          Icon = CheckCircle2;
          iconColor = 'var(--emerald-glow)';
        } else if (toast.type === 'error') {
          borderColor = 'rgba(255, 0, 85, 0.4)';
          glowColor = 'rgba(255, 0, 85, 0.25)';
          Icon = AlertCircle;
          iconColor = 'var(--rose-glow)';
        } else if (toast.type === 'warning') {
          borderColor = 'rgba(255, 184, 0, 0.4)';
          glowColor = 'rgba(255, 184, 0, 0.25)';
          Icon = AlertTriangle;
          iconColor = 'var(--gold-glow)';
        }

        return (
          <div
            key={toast.id}
            className="glass-panel"
            style={{
              pointerEvents: 'auto',
              padding: '16px',
              borderRadius: '12px',
              border: `1px solid ${borderColor}`,
              boxShadow: `0 8px 32px ${glowColor}`,
              display: 'flex',
              gap: '14px',
              alignItems: 'flex-start',
              animation: 'slideIn 0.25s ease-out',
              backdropFilter: 'blur(16px)',
              background: 'rgba(10, 15, 30, 0.92)',
            }}
          >
            <div style={{ marginTop: '2px', flexShrink: 0, color: iconColor }}>
              <Icon size={20} />
            </div>

            <div style={{ flex: 1, minWidth: 0 }}>
              <h5
                style={{
                  margin: 0,
                  fontSize: '0.9rem',
                  fontWeight: 700,
                  color: 'var(--text-main)',
                }}
              >
                {toast.title}
              </h5>

              {toast.message && (
                <p
                  style={{
                    margin: '4px 0 0',
                    fontSize: '0.8rem',
                    color: 'var(--text-muted)',
                    lineHeight: 1.4,
                    wordBreak: 'break-word',
                  }}
                >
                  {toast.message}
                </p>
              )}

              {toast.txHash && (
                <a
                  href={`https://stellar.expert/explorer/testnet/tx/${toast.txHash}`}
                  target="_blank"
                  rel="noreferrer"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px',
                    marginTop: '8px',
                    fontSize: '0.75rem',
                    fontFamily: 'var(--font-mono)',
                    color: 'var(--cyan-glow)',
                    textDecoration: 'none',
                  }}
                >
                  <span>Explore Tx: {toast.txHash.slice(0, 8)}...</span>
                  <ExternalLink size={12} />
                </a>
              )}
            </div>

            <button
              onClick={() => ToastService.dismiss(toast.id)}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--text-dim)',
                cursor: 'pointer',
                padding: '2px',
                flexShrink: 0,
              }}
              title="Dismiss"
            >
              <X size={16} />
            </button>
          </div>
        );
      })}
    </div>
  );
};
