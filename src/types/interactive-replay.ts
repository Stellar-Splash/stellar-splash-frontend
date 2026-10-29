export type PlaybackSpeed = 0.5 | 1.0 | 1.5 | 2.0;

export interface ReplayKeyframe {
  tick: number;
  timestampMs: number;
  playerPositions: Record<string, { x: number; y: number; angle: number }>;
  scores: Record<string, number>;
  events?: string[];
}

export interface ReplayTimelineState {
  currentTick: number;
  totalTicks: number;
  isPlaying: boolean;
  playbackSpeed: PlaybackSpeed;
  markers: Array<{
    tick: number;
    label: string;
    type: 'score' | 'anomaly' | 'finish';
  }>;
}

