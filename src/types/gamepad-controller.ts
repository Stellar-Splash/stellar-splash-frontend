export interface VirtualJoystickVector {
  dx: number; // -1.0 to 1.0
  dy: number; // -1.0 to 1.0
  distance: number; // 0.0 to 1.0
  angleRadians: number;
}

export type ActionButtonType = 'jump' | 'boost' | 'interact';
