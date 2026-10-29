import React, { useState, useEffect } from 'react';

export interface RateLimitAlertProps {
  isRateLimited: boolean;
  retryAfterSeconds?: number;
  endpoint?: string;
  onCooldownComplete?: () => void;
  allowDismiss?: boolean;
}

export const RateLimitAlert: React.FC<RateLimitAlertProps> = ({
  isRateLimited,
  retryAfterSeconds = 30,
  endpoint = 'Horizon / Engine API',
  onCooldownComplete,
  allowDismiss = true,
}) => {
  const [secondsRemaining, setSecondsRemaining] = useState<number>(retryAfterSeconds);
  const [dismissed, setDismissed] = useState<boolean>(false);

  useEffect(() => {
    if (!isRateLimited) {
      setDismissed(false);
      return;
    }

    setSecondsRemaining(retryAfterSeconds);
    setDismissed(false);

    const timer = setInterval(() => {
      setSecondsRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          onCooldownComplete?.();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isRateLimited, retryAfterSeconds, onCooldownComplete]);

  if (!isRateLimited || dismissed) {
    return null;
  }

  const progressPercent = Math.max(0, Math.min(100, (secondsRemaining / (retryAfterSeconds || 1)) * 100));

  return (
    <aside
      role="alert"
      aria-live="assertive"
      style={{
        width: '100%',
        background: 'linear-gradient(90deg, rgba(180, 83, 9, 0.95), rgba(146, 64, 14, 0.95))',
        borderBottom: '2px solid #f59e0b',
        boxShadow: '0 4px 20px rgba(245, 158, 11, 0.3)',
        color: '#ffffff',
        padding: '12px 18px',
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
        fontSize: '0.85rem',
        fontWeight: 500,
        zIndex: 9998,
        position: 'sticky',
        top: 0,
        boxSizing: 'border-box',
        backdropFilter: 'blur(10px)',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              background: 'rgba(0, 0, 0, 0.35)',
              padding: '4px 10px',
              borderRadius: '6px',
              fontSize: '0.75rem',
              fontWeight: 700,
              letterSpacing: '0.05em',
              textTransform: 'uppercase',
              border: '1px solid rgba(255, 255, 255, 0.25)',
              color: '#fef3c7',
            }}
          >
            <span
              style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                backgroundColor: '#fbbf24',
                boxShadow: '0 0 8px #fbbf24',
                display: 'inline-block',
              }}
            />
            HTTP 429 Too Many Requests
          </span>

          <span style={{ color: '#fef3c7' }}>
            Rate limit reached for <strong>{endpoint}</strong>. Automated requests paused to protect network quota.
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginLeft: 'auto' }}>
          <span
            data-testid="cooldown-timer"
            style={{
              background: 'rgba(0, 0, 0, 0.4)',
              padding: '4px 12px',
              borderRadius: '6px',
              fontWeight: 700,
              fontFamily: 'monospace',
              color: '#fef08a',
              border: '1px solid rgba(254, 240, 138, 0.3)',
            }}
          >
            {`Resuming in ${secondsRemaining}s`}
          </span>

          {allowDismiss && (
            <button
              type="button"
              onClick={() => setDismissed(true)}
              aria-label="Dismiss rate limit alert"
              style={{
                background: 'transparent',
                border: 'none',
                color: '#fef3c7',
                fontSize: '1.2rem',
                cursor: 'pointer',
                padding: '0 4px',
                lineHeight: 1,
              }}
            >
              &times;
            </button>
          )}
        </div>
      </div>

      <div
        style={{
          width: '100%',
          height: '4px',
          backgroundColor: 'rgba(0, 0, 0, 0.3)',
          borderRadius: '2px',
          overflow: 'hidden',
        }}
      >
        <div
          data-testid="cooldown-bar"
          style={{
            height: '100%',
            width: `${progressPercent}%`,
            backgroundColor: '#fbbf24',
            transition: 'width 1s linear',
          }}
        />
      </div>
    </aside>
  );
};
