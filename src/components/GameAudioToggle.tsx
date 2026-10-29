import React, { useState } from 'react';
import { AudioPresetSynthesizerService } from '../services/audio-preset-synthesizer.service';
import './GameAudioToggle.css';

export const GameAudioToggle: React.FC = () => {
  const [isMuted, setIsMuted] = useState(AudioPresetSynthesizerService.getMuted());

  const handleToggle = () => {
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);
    AudioPresetSynthesizerService.setMuted(nextMuted);
    if (!nextMuted) {
      AudioPresetSynthesizerService.playTransactionChime();
    }
  };

  return (
    <button
      className={`game-audio-toggle ${isMuted ? 'muted' : 'unmuted'}`}
      onClick={handleToggle}
      title={isMuted ? 'Unmute Game SFX' : 'Mute Game SFX'}
      aria-label={isMuted ? 'Unmute Game SFX' : 'Mute Game SFX'}
    >
      <span className="audio-icon">{isMuted ? '🔇' : '🔊'}</span>
      <span className="audio-status-label">{isMuted ? 'Muted' : 'SFX ON'}</span>
    </button>
  );
};

