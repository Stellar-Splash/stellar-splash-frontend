import React, { useState, useRef, useEffect, useCallback } from 'react';

export interface JoystickVector {
  x: number;
  y: number;
  angle: number;
  distance: number;
}

export interface VirtualJoystickProps {
  onMove?: (vector: JoystickVector) => void;
  onAction?: () => void;
  onRelease?: () => void;
  disabled?: boolean;
  maxRadius?: number;
  deadzone?: number;
  actionButtonLabel?: string;
  forceVisible?: boolean;
}

export const VirtualJoystick: React.FC<VirtualJoystickProps> = ({
  onMove,
  onAction,
  onRelease,
  disabled = false,
  maxRadius = 50,
  deadzone = 0.15,
  actionButtonLabel = 'BOOST',
  forceVisible = false,
}) => {
  const [knobPos, setKnobPos] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  const baseRef = useRef<HTMLDivElement>(null);
  const touchIdRef = useRef<number | null>(null);

  // Detect touch device on mount
  useEffect(() => {
    const hasTouch =
      typeof window !== 'undefined' &&
      ('ontouchstart' in window || navigator.maxTouchPoints > 0);
    setIsTouchDevice(hasTouch);
  }, []);

  const handleTouchStart = useCallback(
    (e: React.TouchEvent<HTMLDivElement>) => {
      if (disabled || touchIdRef.current !== null) return;
      const touch = e.changedTouches[0];
      touchIdRef.current = touch.identifier;
      setIsDragging(true);
    },
    [disabled],
  );

  const handleTouchMove = useCallback(
    (e: React.TouchEvent<HTMLDivElement>) => {
      if (disabled || touchIdRef.current === null || !baseRef.current) return;

      for (let i = 0; i < e.changedTouches.length; i++) {
        const touch = e.changedTouches[i];
        if (touch.identifier === touchIdRef.current) {
          const rect = baseRef.current.getBoundingClientRect();
          const centerX = rect.left + rect.width / 2;
          const centerY = rect.top + rect.height / 2;

          let deltaX = touch.clientX - centerX;
          let deltaY = touch.clientY - centerY;
          const distance = Math.hypot(deltaX, deltaY);
          const angle = Math.atan2(deltaY, deltaX);

          const clampedDistance = Math.min(distance, maxRadius);
          const normalizedDistance = clampedDistance / maxRadius;

          if (normalizedDistance < deadzone) {
            setKnobPos({ x: 0, y: 0 });
            onMove?.({ x: 0, y: 0, angle: 0, distance: 0 });
            return;
          }

          const targetX = Math.cos(angle) * clampedDistance;
          const targetY = Math.sin(angle) * clampedDistance;
          setKnobPos({ x: targetX, y: targetY });

          const normX = targetX / maxRadius;
          const normY = targetY / maxRadius;

          onMove?.({
            x: normX,
            y: normY,
            angle,
            distance: normalizedDistance,
          });
          break;
        }
      }
    },
    [disabled, maxRadius, deadzone, onMove],
  );

  const handleTouchEnd = useCallback(
    (e: React.TouchEvent<HTMLDivElement>) => {
      if (touchIdRef.current === null) return;

      for (let i = 0; i < e.changedTouches.length; i++) {
        if (e.changedTouches[i].identifier === touchIdRef.current) {
          touchIdRef.current = null;
          setIsDragging(false);
          setKnobPos({ x: 0, y: 0 });
          onRelease?.();
          onMove?.({ x: 0, y: 0, angle: 0, distance: 0 });
          break;
        }
      }
    },
    [onRelease, onMove],
  );

  if (!isTouchDevice && !forceVisible) {
    return null;
  }

  return (
    <div
      role="region"
      aria-label="Touch Game Controls"
      style={{
        position: 'absolute',
        bottom: 24,
        left: 24,
        right: 24,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        pointerEvents: 'none',
        zIndex: 90,
        userSelect: 'none',
      }}
    >
      {/* Directional Analog Joystick */}
      <div
        ref={baseRef}
        data-testid="virtual-joystick-base"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onTouchCancel={handleTouchEnd}
        style={{
          width: maxRadius * 2 + 30,
          height: maxRadius * 2 + 30,
          borderRadius: '50%',
          backgroundColor: 'rgba(15, 23, 42, 0.65)',
          border: '2px solid rgba(56, 189, 248, 0.4)',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.4), inset 0 0 15px rgba(56, 189, 248, 0.1)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          pointerEvents: disabled ? 'none' : 'auto',
          touchAction: 'none',
          position: 'relative',
        }}
      >
        {/* Joystick Thumb Knob */}
        <div
          data-testid="virtual-joystick-knob"
          style={{
            width: 52,
            height: 52,
            borderRadius: '50%',
            background: isDragging
              ? 'radial-gradient(circle at 30% 30%, #38bdf8, #0284c7)'
              : 'radial-gradient(circle at 30% 30%, #64748b, #334155)',
            boxShadow: isDragging
              ? '0 0 16px rgba(56, 189, 248, 0.7), inset 0 2px 4px rgba(255, 255, 255, 0.4)'
              : '0 2px 6px rgba(0, 0, 0, 0.5)',
            transform: `translate3d(${knobPos.x}px, ${knobPos.y}px, 0)`,
            transition: isDragging ? 'none' : 'transform 0.15s cubic-bezier(0.2, 0.9, 0.3, 1)',
            pointerEvents: 'none',
          }}
        />
      </div>

      {/* Floating Action Button (Boost / Jump) */}
      <button
        data-testid="virtual-action-button"
        type="button"
        disabled={disabled}
        onTouchStart={(e) => {
          e.preventDefault();
          onAction?.();
        }}
        onClick={(e) => {
          e.preventDefault();
          onAction?.();
        }}
        aria-label={actionButtonLabel}
        style={{
          width: 76,
          height: 76,
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
          color: '#ffffff',
          fontWeight: 800,
          fontSize: '0.875rem',
          letterSpacing: '0.05em',
          border: '3px solid rgba(254, 243, 199, 0.4)',
          boxShadow: '0 4px 20px rgba(217, 119, 6, 0.5), inset 0 2px 4px rgba(255, 255, 255, 0.3)',
          cursor: disabled ? 'not-allowed' : 'pointer',
          pointerEvents: disabled ? 'none' : 'auto',
          opacity: disabled ? 0.5 : 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          touchAction: 'none',
        }}
      >
        {actionButtonLabel}
      </button>
    </div>
  );
};
