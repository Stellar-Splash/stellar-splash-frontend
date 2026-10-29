import React, { useEffect, useState } from 'react';

export interface TournamentCountdownTimerProps {
  targetTimestamp: number;
  label?: string;
  onExpire?: () => void;
  size?: 'sm' | 'md' | 'lg';
}

export const TournamentCountdownTimer: React.FC<TournamentCountdownTimerProps> = ({
  targetTimestamp,
  label = 'Time Remaining',
  onExpire,
  size = 'md',
}) => {
  const [timeLeft, setTimeLeft] = useState<number>(() =>
    Math.max(0, targetTimestamp - Date.now())
  );
  const [hasExpired, setHasExpired] = useState<boolean>(false);

  useEffect(() => {
    const checkExpiry = () => {
      const remaining = Math.max(0, targetTimestamp - Date.now());
      setTimeLeft(remaining);

      if (remaining === 0 && !hasExpired) {
        setHasExpired(true);
        if (onExpire) onExpire();
      }
    };

    checkExpiry();
    const interval = setInterval(checkExpiry, 1000);
    return () => clearInterval(interval);
  }, [targetTimestamp, onExpire, hasExpired]);

  const totalSeconds = Math.floor(timeLeft / 1000);
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  const isUrgent = totalSeconds > 0 && totalSeconds < 300; // Less than 5 minutes
  const isExpired = totalSeconds === 0;

  const pad = (n: number) => n.toString().padStart(2, '0');

  const formattedTime = isExpired
    ? '00:00:00'
    : days > 0
    ? `${days}d ${pad(hours)}h ${pad(minutes)}m`
    : `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;

  return (
    <div
      role="timer"
      aria-label={`${label}: ${formattedTime}`}
      aria-live="polite"
      className={`countdown-timer-container countdown-${size} ${isUrgent ? 'urgent' : ''} ${
        isExpired ? 'expired' : ''
      }`}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.5rem',
        padding: size === 'sm' ? '0.25rem 0.5rem' : '0.4rem 0.8rem',
        borderRadius: '6px',
        backgroundColor: isExpired
          ? 'rgba(239, 68, 68, 0.15)'
          : isUrgent
          ? 'rgba(245, 158, 11, 0.15)'
          : 'rgba(15, 23, 42, 0.6)',
        border: `1px solid ${
          isExpired
            ? 'rgba(239, 68, 68, 0.4)'
            : isUrgent
            ? 'rgba(245, 158, 11, 0.4)'
            : 'rgba(56, 189, 248, 0.25)'
        }`,
        color: isExpired ? '#f87171' : isUrgent ? '#fbbf24' : '#38bdf8',
        fontFamily: 'monospace',
        fontWeight: 'bold',
      }}
    >
      <span
        style={{
          width: '8px',
          height: '8px',
          borderRadius: '50%',
          backgroundColor: isExpired ? '#ef4444' : isUrgent ? '#f59e0b' : '#38bdf8',
          animation: isUrgent ? 'pulse 1s infinite' : 'none',
        }}
      />
      <span style={{ fontSize: '0.85em', opacity: 0.8, fontWeight: 'normal' }}>
        {label}:
      </span>
      <span className="countdown-value">{formattedTime}</span>
      {isExpired && (
        <span
          style={{
            fontSize: '0.7em',
            padding: '0.1rem 0.3rem',
            backgroundColor: 'rgba(239, 68, 68, 0.3)',
            borderRadius: '4px',
            textTransform: 'uppercase',
          }}
        >
          Concluded
        </span>
      )}
    </div>
  );
};
