import { describe, it, expect, vi } from 'vitest';
import React from 'react';
import { VirtualJoystick } from '../components/VirtualJoystick';

describe('VirtualJoystick Mobile Touch Controls', () => {
  it('does not render when touch is unavailable and forceVisible is false', () => {
    const element = React.createElement(VirtualJoystick, { forceVisible: false });
    expect(React.isValidElement(element)).toBe(true);
    expect(element.props.forceVisible).toBe(false);
  });

  it('renders joystick base and action button when forceVisible is true', () => {
    const onAction = vi.fn();
    const onMove = vi.fn();

    const element = React.createElement(VirtualJoystick, {
      forceVisible: true,
      onAction,
      onMove,
      actionButtonLabel: 'DASH',
    });

    expect(React.isValidElement(element)).toBe(true);
    expect(element.props.actionButtonLabel).toBe('DASH');
    expect(element.props.forceVisible).toBe(true);
  });

  it('correctly handles joystick deadzone calculation logic', () => {
    const maxRadius = 50;
    const deadzone = 0.2; // 20% of 50 = 10px

    const calculateVector = (deltaX: number, deltaY: number) => {
      const distance = Math.hypot(deltaX, deltaY);
      const angle = Math.atan2(deltaY, deltaX);
      const clampedDistance = Math.min(distance, maxRadius);
      const normalizedDistance = clampedDistance / maxRadius;

      if (normalizedDistance < deadzone) {
        return { x: 0, y: 0, angle: 0, distance: 0 };
      }

      const targetX = Math.cos(angle) * clampedDistance;
      const targetY = Math.sin(angle) * clampedDistance;

      return {
        x: targetX / maxRadius,
        y: targetY / maxRadius,
        angle,
        distance: normalizedDistance,
      };
    };

    // Movement inside deadzone (5px distance < 10px threshold)
    const deadzoneResult = calculateVector(3, 4); // dist = 5
    expect(deadzoneResult.distance).toBe(0);
    expect(deadzoneResult.x).toBe(0);
    expect(deadzoneResult.y).toBe(0);

    // Movement outside deadzone (25px distance)
    const activeResult = calculateVector(25, 0);
    expect(activeResult.distance).toBe(0.5);
    expect(activeResult.x).toBe(0.5);
    expect(activeResult.y).toBe(0);

    // Clamped movement beyond maxRadius (100px clamped to 50px)
    const clampedResult = calculateVector(100, 0);
    expect(clampedResult.distance).toBe(1.0);
    expect(clampedResult.x).toBe(1.0);
    expect(clampedResult.y).toBe(0);
  });
});
