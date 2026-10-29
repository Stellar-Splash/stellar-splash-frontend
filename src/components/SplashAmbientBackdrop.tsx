import React from 'react';

interface SplashAmbientBackdropProps {
  /** Intensity of ambient cybernetic grid: 'subtle' | 'medium' | 'high' */
  intensity?: 'subtle' | 'medium' | 'high';
  /** Optional custom CSS class */
  className?: string;
}

export const SplashAmbientBackdrop: React.FC<SplashAmbientBackdropProps> = ({
  intensity = 'subtle',
  className = '',
}) => {
  const opacityMap = {
    subtle: 0.04,
    medium: 0.08,
    high: 0.14,
  };

  const gridOpacity = opacityMap[intensity];

  return (
    <div
      className={`splash-ambient-backdrop ${className}`}
      data-testid="splash-ambient-backdrop"
      style={{
        position: 'fixed',
        inset: 0,
        pointerEvents: 'none',
        zIndex: -1,
        overflow: 'hidden',
      }}
      aria-hidden="true"
    >
      {/* Dynamic Cybernetic Grid SVG */}
      <svg
        width="100%"
        height="100%"
        xmlns="http://www.w3.org/2000/svg"
        style={{
          position: 'absolute',
          inset: 0,
          opacity: gridOpacity,
        }}
      >
        <defs>
          <pattern
            id="cyber-grid"
            width="48"
            height="48"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M 48 0 L 0 0 0 48"
              fill="none"
              stroke="#00F0FF"
              strokeWidth="0.8"
            />
          </pattern>
          <radialGradient id="nebula-cyan" cx="20%" cy="25%" r="45%">
            <stop offset="0%" stopColor="#00F0FF" stopOpacity="0.12" />
            <stop offset="100%" stopColor="#00F0FF" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="nebula-purple" cx="80%" cy="30%" r="50%">
            <stop offset="0%" stopColor="#8A2BE2" stopOpacity="0.12" />
            <stop offset="100%" stopColor="#8A2BE2" stopOpacity="0" />
          </radialGradient>
        </defs>

        <rect width="100%" height="100%" fill="url(#cyber-grid)" />
        <rect width="100%" height="100%" fill="url(#nebula-cyan)" />
        <rect width="100%" height="100%" fill="url(#nebula-purple)" />
      </svg>

      {/* Radial Vignette & Glow Accents */}
      <div
        style={{
          position: 'absolute',
          top: '-15%',
          left: '25%',
          width: '50vw',
          height: '50vw',
          background: 'radial-gradient(circle, rgba(0, 240, 255, 0.05) 0%, transparent 70%)',
          borderRadius: '50%',
          filter: 'blur(60px)',
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: '-10%',
          right: '15%',
          width: '45vw',
          height: '45vw',
          background: 'radial-gradient(circle, rgba(138, 43, 226, 0.05) 0%, transparent 70%)',
          borderRadius: '50%',
          filter: 'blur(70px)',
        }}
      />
    </div>
  );
};
