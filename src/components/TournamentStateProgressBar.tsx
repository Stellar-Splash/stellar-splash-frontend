import React from 'react';

export type TournamentLifecycleStep =
  | 'CREATED'
  | 'FUNDING'
  | 'OPEN'
  | 'IN_PROGRESS'
  | 'DISPUTE_WINDOW'
  | 'SETTLED'
  | 'CANCELLED';

export interface TournamentStateProgressBarProps {
  currentState: TournamentLifecycleStep;
  isDisputed?: boolean;
}

const STEPS: Array<{ key: TournamentLifecycleStep; label: string }> = [
  { key: 'CREATED', label: 'Created' },
  { key: 'FUNDING', label: 'Escrow Funding' },
  { key: 'OPEN', label: 'Open' },
  { key: 'IN_PROGRESS', label: 'In Progress' },
  { key: 'DISPUTE_WINDOW', label: 'Challenge Window' },
  { key: 'SETTLED', label: 'Settled' },
];

export const TournamentStateProgressBar: React.FC<TournamentStateProgressBarProps> = ({
  currentState,
  isDisputed = false,
}) => {
  if (currentState === 'CANCELLED') {
    return (
      <div
        role="status"
        aria-label="Tournament status: Cancelled"
        style={{
          width: '100%',
          padding: '12px 16px',
          background: 'rgba(239, 68, 68, 0.1)',
          border: '1px solid rgba(239, 68, 68, 0.3)',
          borderRadius: '8px',
          color: '#f87171',
          fontSize: '0.85rem',
          fontWeight: 600,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '8px',
        }}
      >
        <span
          style={{
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            backgroundColor: '#ef4444',
            display: 'inline-block',
          }}
        />
        Tournament Cancelled — Escrow Refund Worker Active
      </div>
    );
  }

  const currentIndex = STEPS.findIndex((s) => s.key === currentState);
  const activeIndex = currentIndex === -1 ? 0 : currentIndex;

  return (
    <div
      role="region"
      aria-label="Tournament lifecycle progress"
      style={{
        width: '100%',
        padding: '12px 0',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          position: 'relative',
        }}
      >
        {/* Background connector line */}
        <div
          style={{
            position: 'absolute',
            top: '14px',
            left: '20px',
            right: '20px',
            height: '2px',
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            zIndex: 0,
          }}
        />

        {/* Active connector progress */}
        <div
          style={{
            position: 'absolute',
            top: '14px',
            left: '20px',
            width: `${(activeIndex / (STEPS.length - 1)) * 90}%`,
            height: '2px',
            backgroundColor: isDisputed ? '#f59e0b' : '#38bdf8',
            transition: 'width 0.3s ease',
            zIndex: 0,
          }}
        />

        {STEPS.map((step, idx) => {
          const isCompleted = idx < activeIndex;
          const isCurrent = idx === activeIndex;
          const isChallengeDisputed = step.key === 'DISPUTE_WINDOW' && isCurrent && isDisputed;

          let circleBg = 'rgba(255, 255, 255, 0.08)';
          let circleBorder = 'rgba(255, 255, 255, 0.2)';
          let textColor = '#6b7280';

          if (isChallengeDisputed) {
            circleBg = '#f59e0b';
            circleBorder = '#fbbf24';
            textColor = '#fbbf24';
          } else if (isCurrent) {
            circleBg = '#38bdf8';
            circleBorder = '#7dd3fc';
            textColor = '#38bdf8';
          } else if (isCompleted) {
            circleBg = '#10b981';
            circleBorder = '#34d399';
            textColor = '#9ca3af';
          }

          return (
            <div
              key={step.key}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '6px',
                zIndex: 1,
                position: 'relative',
              }}
            >
              <div
                data-testid={`step-circle-${step.key}`}
                style={{
                  width: '28px',
                  height: '28px',
                  borderRadius: '50%',
                  backgroundColor: circleBg,
                  border: `2px solid ${circleBorder}`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  color: isCurrent || isCompleted ? '#ffffff' : '#9ca3af',
                  boxShadow: isCurrent ? '0 0 12px rgba(56, 189, 248, 0.5)' : 'none',
                }}
              >
                {isCompleted ? '✓' : idx + 1}
              </div>

              <span
                style={{
                  fontSize: '0.7rem',
                  fontWeight: isCurrent ? 700 : 500,
                  color: textColor,
                  textAlign: 'center',
                  whiteSpace: 'nowrap',
                }}
              >
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
