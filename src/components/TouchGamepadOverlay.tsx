import React, { useState } from 'react';
import { ActionButtonType, VirtualJoystickVector } from '../types/gamepad-controller';
import './TouchGamepadOverlay.css';

interface TouchGamepadOverlayProps {
  onMove?: (vector: VirtualJoystickVector) => void;
  onAction?: (action: ActionButtonType) => void;
}

export const TouchGamepadOverlay: React.FC<TouchGamepadOverlayProps> = ({
  onMove,
  onAction,
}) => {
  const [knobPos, setKnobPos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const touch = e.touches[0];
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const rawDx = touch.clientX - centerX;
    const rawDy = touch.clientY - centerY;
    const radius = rect.width / 2;

    const dist = Math.min(Math.hypot(rawDx, rawDy), radius);
    const angle = Math.atan2(rawDy, rawDx);

    const clampedX = Math.cos(angle) * dist;
    const clampedY = Math.sin(angle) * dist;

    setKnobPos({ x: clampedX, y: clampedY });

    onMove?.({
      dx: clampedX / radius,
      dy: clampedY / radius,
      distance: dist / radius,
      angleRadians: angle,
    });
  };

  const handleTouchEnd = () => {
    setKnobPos({ x: 0, y: 0 });
    onMove?.({
      dx: 0,
      dy: 0,
      distance: 0,
      angleRadians: 0,
    });
  };

  return (
    <div className="touch-gamepad-overlay" role="group" aria-label="Touch Gamepad Controls">
      {/* Left thumbstick */}
      <div
        className="touch-joystick-base"
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div
          className="touch-joystick-knob"
          style={{ transform: `translate(${knobPos.x}px, ${knobPos.y}px)` }}
        />
      </div>

      {/* Right Action Buttons */}
      <div className="touch-action-buttons">
        <button
          className="touch-btn action-boost"
          onTouchStart={() => onAction?.('boost')}
          aria-label="Boost Action"
        >
          ⚡
        </button>
        <button
          className="touch-btn action-jump"
          onTouchStart={() => onAction?.('jump')}
          aria-label="Jump Action"
        >
          ⬆
        </button>
      </div>
    </div>
  );
};

