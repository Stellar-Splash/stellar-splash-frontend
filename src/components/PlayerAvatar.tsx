import React from 'react';

interface PlayerAvatarProps {
  address: string;
  size?: number;
  className?: string;
}

/**
 * Deterministically generates a colorful SVG avatar from a Stellar public key (G-address).
 * Uses character hashing to select consistent neon cyberpunk gradients and geometric accents.
 */
export const PlayerAvatar: React.FC<PlayerAvatarProps> = ({
  address,
  size = 32,
  className = '',
}) => {
  const safeAddress = address || 'GAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAWHF';

  // Compute simple deterministic hash from address string
  let hash = 0;
  for (let i = 0; i < safeAddress.length; i++) {
    hash = (hash << 5) - hash + safeAddress.charCodeAt(i);
    hash |= 0;
  }
  const positiveHash = Math.abs(hash);

  // Palettes tailored to Cyberpunk / Stellar Splash theme
  const colorPalette = [
    { primary: '#00f0ff', secondary: '#7928ca' }, // Cyan to Neon Purple
    { primary: '#00ffa3', secondary: '#00b8ff' }, // Mint to Cyan
    { primary: '#ff0055', secondary: '#7928ca' }, // Rose to Purple
    { primary: '#ffb800', secondary: '#ff0055' }, // Gold to Rose
    { primary: '#a855f7', secondary: '#3b82f6' }, // Purple to Blue
    { primary: '#06b6d4', secondary: '#10b981' }, // Cyan to Emerald
  ];

  const paletteIndex = positiveHash % colorPalette.length;
  const { primary, secondary } = colorPalette[paletteIndex];

  // Deterministic geometric shapes based on address segments
  const shape1Radius = (positiveHash % 6) + 6;
  const shape2Radius = ((positiveHash >> 3) % 8) + 4;
  const angle = (positiveHash % 360);

  const gradId = `avatar-grad-${positiveHash.toString(36)}`;

  return (
    <div
      className={className}
      style={{
        width: `${size}px`,
        height: `${size}px`,
        borderRadius: '50%',
        overflow: 'hidden',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
        boxShadow: `0 0 8px ${primary}44`,
        border: `1.5px solid ${primary}88`,
        background: '#050811',
      }}
      title={`Player: ${safeAddress.slice(0, 6)}...${safeAddress.slice(-6)}`}
    >
      <svg
        width={size}
        height={size}
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        data-testid="player-avatar-svg"
      >
        <defs>
          <linearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={primary} />
            <stop offset="100%" stopColor={secondary} />
          </linearGradient>
        </defs>

        {/* Background circle */}
        <circle cx="16" cy="16" r="16" fill="#070c1d" />

        {/* Diagonal stylized background */}
        <rect
          x="4"
          y="4"
          width="24"
          height="24"
          rx="6"
          fill={`url(#${gradId})`}
          fillOpacity="0.4"
          transform={`rotate(${angle} 16 16)`}
        />

        {/* Foreground geometric elements */}
        <circle
          cx={16 + (shape1Radius % 5) - 2}
          cy={16 - (shape2Radius % 4) + 2}
          r={shape1Radius}
          fill={primary}
          fillOpacity="0.85"
        />

        <circle
          cx={16 - (shape2Radius % 6) + 3}
          cy={16 + (shape1Radius % 5) - 2}
          r={shape2Radius}
          fill={secondary}
          fillOpacity="0.9"
        />
      </svg>
    </div>
  );
};
