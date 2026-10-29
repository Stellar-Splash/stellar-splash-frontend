import React, { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import { Trophy, Star, ArrowRight, X } from 'lucide-react';
import { AudioSynthService } from '../services/audio-synth';

export interface HighScoreCelebrationProps {
  score: number;
  previousBest?: number;
  tournamentTitle?: string;
  onDismiss?: () => void;
  autoDismissMs?: number;
  isVisible?: boolean;
}

export const HighScoreCelebration: React.FC<HighScoreCelebrationProps> = ({
  score,
  previousBest = 0,
  tournamentTitle,
  onDismiss,
  autoDismissMs = 6000,
  isVisible = true,
}) => {
  const [displayScore, setDisplayScore] = useState<number>(0);
  const isNewBest = score > previousBest;
  const animFrameRef = useRef<number | null>(null);

  useEffect(() => {
    if (!isVisible) return;

    // Trigger celebratory confetti cannon
    try {
      confetti({
        particleCount: 100,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#38bdf8', '#f59e0b', '#10b981', '#ec4899', '#8b5cf6'],
      });
    } catch {
      // In non-DOM test environments, confetti might be a no-op
    }

    // Play victory audio fanfare
    try {
      AudioSynthService.playSuccess();
    } catch {
      // Audio synth optional in headless environments
    }

    // Animate score counter increment from 0 to score
    const startTime = performance.now();
    const duration = 1200; // ms

    const animateCount = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.floor(eased * score);
      setDisplayScore(current);

      if (progress < 1) {
        animFrameRef.current = requestAnimationFrame(animateCount);
      } else {
        setDisplayScore(score);
      }
    };

    animFrameRef.current = requestAnimationFrame(animateCount);

    // Auto dismiss timer
    let dismissTimer: any = null;
    if (autoDismissMs > 0 && onDismiss) {
      dismissTimer = setTimeout(() => {
        onDismiss();
      }, autoDismissMs);
    }

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      if (dismissTimer) clearTimeout(dismissTimer);
    };
  }, [isVisible, score, autoDismissMs, onDismiss]);

  if (!isVisible) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      data-testid="high-score-celebration"
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(15, 23, 42, 0.85)',
        backdropFilter: 'blur(10px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1050,
        padding: '20px',
        animation: 'fadeIn 0.25s ease-out',
      }}
    >
      <div
        style={{
          background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
          border: isNewBest ? '2px solid #f59e0b' : '1px solid rgba(56, 189, 248, 0.4)',
          boxShadow: isNewBest
            ? '0 0 50px rgba(245, 158, 11, 0.3), 0 25px 50px -12px rgba(0, 0, 0, 0.7)'
            : '0 20px 40px rgba(0, 0, 0, 0.6)',
          borderRadius: '24px',
          padding: '36px 32px',
          maxWidth: '440px',
          width: '100%',
          textAlign: 'center',
          position: 'relative',
        }}
      >
        {onDismiss && (
          <button
            type="button"
            onClick={onDismiss}
            aria-label="Dismiss celebration"
            data-testid="celebration-dismiss-button"
            style={{
              position: 'absolute',
              top: '16px',
              right: '16px',
              background: 'none',
              border: 'none',
              color: '#94a3b8',
              cursor: 'pointer',
              padding: '6px',
            }}
          >
            <X size={20} />
          </button>
        )}

        {/* Icon & Badge */}
        <div
          style={{
            width: 72,
            height: 72,
            borderRadius: '50%',
            background: isNewBest
              ? 'radial-gradient(circle, #fef3c7, #f59e0b)'
              : 'radial-gradient(circle, #e0f2fe, #38bdf8)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 16px auto',
            boxShadow: isNewBest ? '0 0 24px rgba(245, 158, 11, 0.6)' : '0 0 20px rgba(56, 189, 248, 0.4)',
          }}
        >
          {isNewBest ? <Trophy size={36} color="#78350f" /> : <Star size={36} color="#0369a1" />}
        </div>

        {isNewBest ? (
          <div
            data-testid="personal-best-badge"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              backgroundColor: 'rgba(245, 158, 11, 0.15)',
              border: '1px solid rgba(245, 158, 11, 0.4)',
              color: '#fbbf24',
              padding: '4px 12px',
              borderRadius: '9999px',
              fontSize: '0.75rem',
              fontWeight: 800,
              letterSpacing: '0.05em',
              textTransform: 'uppercase',
              marginBottom: '12px',
            }}
          >
            ★ New Personal Best! ★
          </div>
        ) : (
          <div
            style={{
              color: '#38bdf8',
              fontSize: '0.75rem',
              fontWeight: 700,
              letterSpacing: '0.05em',
              textTransform: 'uppercase',
              marginBottom: '12px',
            }}
          >
            Match Complete
          </div>
        )}

        {tournamentTitle && (
          <div style={{ color: '#94a3b8', fontSize: '0.875rem', marginBottom: '8px' }}>
            {tournamentTitle}
          </div>
        )}

        {/* Animated Score Display */}
        <div
          data-testid="celebration-score-display"
          style={{
            fontSize: '3.5rem',
            fontWeight: 900,
            color: '#f8fafc',
            lineHeight: 1,
            margin: '12px 0 20px 0',
            fontVariantNumeric: 'tabular-nums',
            textShadow: '0 2px 10px rgba(0, 0, 0, 0.5)',
          }}
        >
          {displayScore.toLocaleString()}
        </div>

        {previousBest > 0 && (
          <div style={{ fontSize: '0.8125rem', color: '#64748b', marginBottom: '24px' }}>
            Previous Best: {previousBest.toLocaleString()} pts
          </div>
        )}

        {onDismiss && (
          <button
            type="button"
            onClick={onDismiss}
            data-testid="celebration-continue-button"
            style={{
              width: '100%',
              padding: '12px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #0284c7 0%, #2563eb 100%)',
              color: '#ffffff',
              border: 'none',
              fontWeight: 700,
              fontSize: '0.9375rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              boxShadow: '0 4px 14px rgba(2, 132, 199, 0.4)',
            }}
          >
            Continue to Leaderboard
            <ArrowRight size={18} />
          </button>
        )}
      </div>
    </div>
  );
};
