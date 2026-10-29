import { PlaybackSpeed, ReplayKeyframe, ReplayTimelineState } from '../types/interactive-replay';

export class ReplayPlaybackService {
  private keyframes: ReplayKeyframe[] = [];
  private state: ReplayTimelineState;
  private onStateChange?: (state: ReplayTimelineState) => void;

  constructor(keyframes: ReplayKeyframe[] = [], onStateChange?: (state: ReplayTimelineState) => void) {
    this.keyframes = keyframes;
    this.onStateChange = onStateChange;
    this.state = {
      currentTick: 0,
      totalTicks: keyframes.length > 0 ? keyframes[keyframes.length - 1].tick : 0,
      isPlaying: false,
      playbackSpeed: 1.0,
      markers: [],
    };
  }

  public setKeyframes(frames: ReplayKeyframe[]): void {
    this.keyframes = frames;
    this.state.totalTicks = frames.length > 0 ? frames[frames.length - 1].tick : 0;
    this.notify();
  }

  public seekToTick(tick: number): ReplayKeyframe | null {
    const clamped = Math.max(0, Math.min(tick, this.state.totalTicks));
    this.state.currentTick = clamped;
    this.notify();
    return this.getCurrentFrame();
  }

  public stepForward(ticks: number = 1): ReplayKeyframe | null {
    return this.seekToTick(this.state.currentTick + ticks);
  }

  public stepBackward(ticks: number = 1): ReplayKeyframe | null {
    return this.seekToTick(this.state.currentTick - ticks);
  }

  public togglePlay(): boolean {
    this.state.isPlaying = !this.state.isPlaying;
    this.notify();
    return this.state.isPlaying;
  }

  public setSpeed(speed: PlaybackSpeed): void {
    this.state.playbackSpeed = speed;
    this.notify();
  }

  public getCurrentFrame(): ReplayKeyframe | null {
    if (this.keyframes.length === 0) return null;
    return (
      this.keyframes.find((k) => k.tick === this.state.currentTick) ||
      this.keyframes[this.keyframes.length - 1]
    );
  }

  public getState(): ReplayTimelineState {
    return { ...this.state };
  }

  private notify(): void {
    this.onStateChange?.(this.getState());
  }
}
