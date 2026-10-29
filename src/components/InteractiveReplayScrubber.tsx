import React from 'react';
import { PlaybackSpeed, ReplayTimelineState } from '../types/interactive-replay';
import './InteractiveReplayScrubber.css';

interface InteractiveReplayScrubberProps {
  timeline: ReplayTimelineState;
  onSeek: (tick: number) => void;
  onTogglePlay: () => void;
  onStepForward: () => void;
  onStepBackward: () => void;
  onSpeedChange: (speed: PlaybackSpeed) => void;
}

export const InteractiveReplayScrubber: React.FC<InteractiveReplayScrubberProps> = ({
  timeline,
  onSeek,
  onTogglePlay,
  onStepForward,
  onStepBackward,
  onSpeedChange,
}) => {
  const progressPercent = timeline.totalTicks > 0
    ? (timeline.currentTick / timeline.totalTicks) * 100
    : 0;

  return (
    <div className="replay-scrubber-card" role="region" aria-label="Interactive Match Scrubber">
      <div className="scrubber-timeline-container">
        <input
          type="range"
          min="0"
          max={timeline.totalTicks}
          value={timeline.currentTick}
          onChange={(e) => onSeek(parseInt(e.target.value, 10))}
          className="scrubber-range-slider"
          aria-label="Replay tick position"
        />
        <div
          className="scrubber-progress-fill"
          style={{ width: `${progressPercent}%` }}
        />

        {/* Forensic Event Markers */}
        {timeline.markers.map((marker, idx) => {
          const leftPercent = timeline.totalTicks > 0 ? (marker.tick / timeline.totalTicks) * 100 : 0;
          return (
            <div
              key={idx}
              className={`scrubber-marker ${marker.type}`}
              style={{ left: `${leftPercent}%` }}
              title={`${marker.label} (Tick ${marker.tick})`}
            />
          );
        })}
      </div>

      <div className="scrubber-controls-row">
        <div className="scrubber-left-controls">
          <button className="scrubber-btn" onClick={onStepBackward} title="Step 1 Frame Back">
            ⏮
          </button>
          <button className="scrubber-play-btn" onClick={onTogglePlay}>
            {timeline.isPlaying ? '⏸ Pause' : '▶ Play'}
          </button>
          <button className="scrubber-btn" onClick={onStepForward} title="Step 1 Frame Forward">
            ⏭
          </button>
          <span className="scrubber-tick-counter">
            Tick: <strong>{timeline.currentTick}</strong> / {timeline.totalTicks}
          </span>
        </div>

        <div className="scrubber-speed-selector">
          {([0.5, 1.0, 1.5, 2.0] as PlaybackSpeed[]).map((spd) => (
            <button
              key={spd}
              className={`speed-chip ${timeline.playbackSpeed === spd ? 'active' : ''}`}
              onClick={() => onSpeedChange(spd)}
            >
              {spd}x
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

