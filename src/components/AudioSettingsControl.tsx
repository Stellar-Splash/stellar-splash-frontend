import React, { useState, useEffect, useRef } from 'react';
import { Volume2, VolumeX, Sliders, Bell } from 'lucide-react';
import { AudioSynthService } from '../services/audio-synth';

export const AudioSettingsControl: React.FC = () => {
  const [muted, setMuted] = useState<boolean>(AudioSynthService.isMuted());
  const [volume, setVolume] = useState<number>(AudioSynthService.getVolume());
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    // Sync with AudioSynthService state updates
    const unsubscribe = AudioSynthService.addAudioChangeListener((isMuted, vol) => {
      setMuted(isMuted);
      setVolume(vol);
    });

    // Global keyboard shortcut 'M' to toggle mute
    const handleKeyDown = (e: KeyboardEvent) => {
      const activeTag = document.activeElement?.tagName.toLowerCase();
      if (activeTag === 'input' || activeTag === 'textarea' || (document.activeElement as HTMLElement)?.isContentEditable) {
        return;
      }
      if (e.key === 'm' || e.key === 'M') {
        e.preventDefault();
        AudioSynthService.toggleMuted();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    // Click outside to close popover
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      unsubscribe();
      window.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVol = parseFloat(e.target.value);
    AudioSynthService.setVolume(newVol);
    if (newVol > 0 && muted) {
      AudioSynthService.setMuted(false);
    }
  };

  const handleToggleMute = () => {
    AudioSynthService.toggleMuted();
  };

  const handleTestChime = () => {
    AudioSynthService.playTargetHit(5);
  };

  const volumePercent = Math.round((muted ? 0 : volume) * 100);

  return (
    <div ref={containerRef} style={{ position: 'relative', display: 'inline-block' }}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        title={`Audio Settings: ${volumePercent}% (Press 'M' to mute/unmute)`}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          background: 'rgba(255, 255, 255, 0.05)',
          border: '1px solid var(--border-glass)',
          borderRadius: '8px',
          padding: '6px 12px',
          color: muted ? 'var(--text-muted)' : 'var(--cyan-glow)',
          cursor: 'pointer',
          fontSize: '0.8rem',
          fontFamily: 'var(--font-mono)',
          transition: 'all 0.2s ease',
        }}
      >
        {muted ? <VolumeX size={15} /> : <Volume2 size={15} />}
        <span>{volumePercent}%</span>
        <span style={{ fontSize: '0.65rem', color: 'var(--text-dim)', border: '1px solid rgba(255,255,255,0.1)', padding: '1px 4px', borderRadius: '4px' }}>M</span>
      </button>

      {isOpen && (
        <div
          className="glass-panel"
          style={{
            position: 'absolute',
            top: 'calc(100% + 8px)',
            right: 0,
            zIndex: 100,
            minWidth: '220px',
            padding: '16px',
            borderRadius: '12px',
            boxShadow: '0 12px 32px rgba(0, 0, 0, 0.6)',
            border: '1px solid rgba(0, 240, 255, 0.3)',
            background: 'rgba(7, 12, 26, 0.95)',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Sliders size={14} color="var(--cyan-glow)" /> Audio Synth
            </span>
            <button
              onClick={handleToggleMute}
              style={{
                background: muted ? 'rgba(244, 63, 94, 0.2)' : 'rgba(0, 240, 255, 0.15)',
                border: `1px solid ${muted ? '#f43f5e' : 'var(--cyan-glow)'}`,
                color: muted ? '#f43f5e' : 'var(--cyan-glow)',
                borderRadius: '6px',
                padding: '3px 8px',
                fontSize: '0.75rem',
                cursor: 'pointer',
              }}
            >
              {muted ? 'Unmute' : 'Mute'}
            </button>
          </div>

          <div style={{ marginBottom: '14px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-dim)', marginBottom: '6px' }}>
              <span>Volume</span>
              <span style={{ fontFamily: 'var(--font-mono)' }}>{Math.round(volume * 100)}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={volume}
              onChange={handleVolumeChange}
              style={{
                width: '100%',
                accentColor: 'var(--cyan-glow)',
                cursor: 'pointer',
              }}
            />
          </div>

          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              onClick={handleTestChime}
              style={{
                flex: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
                background: 'rgba(255, 255, 255, 0.08)',
                border: '1px solid var(--border-glass)',
                borderRadius: '6px',
                padding: '6px 10px',
                color: 'var(--text-main)',
                fontSize: '0.75rem',
                cursor: 'pointer',
              }}
            >
              <Bell size={12} /> Test SFX
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
