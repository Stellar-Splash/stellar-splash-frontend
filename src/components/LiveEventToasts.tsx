import React, { useEffect, useState } from 'react';
import { LiveEventListenerService, LiveEventPayload } from '../services/live-event-listener';
import { Radio } from 'lucide-react';

interface LiveEventToastsProps {
  /** Optional custom SSE endpoint URL */
  sseUrl?: string;
  /** When true, renders a subtle live stream status pulse dot */
  showIndicator?: boolean;
}

export const LiveEventToasts: React.FC<LiveEventToastsProps> = ({
  sseUrl,
  showIndicator = false,
}) => {
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [lastEvent, setLastEvent] = useState<string | null>(null);

  useEffect(() => {
    if (sseUrl) {
      LiveEventListenerService.configure(sseUrl);
    }

    const unsubscribe = LiveEventListenerService.subscribe((event: LiveEventPayload) => {
      setLastEvent(event.type);
      setIsConnected(true);
    });

    // Check status periodically
    const interval = setInterval(() => {
      const status = LiveEventListenerService.getStatus();
      setIsConnected(status.isConnected);
    }, 2000);

    return () => {
      clearInterval(interval);
      unsubscribe();
    };
  }, [sseUrl]);

  if (!showIndicator) {
    return null;
  }

  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '6px',
        padding: '4px 10px',
        borderRadius: '999px',
        background: isConnected ? 'rgba(0, 255, 163, 0.08)' : 'rgba(255, 255, 255, 0.04)',
        border: `1px solid ${isConnected ? 'rgba(0, 255, 163, 0.25)' : 'rgba(255, 255, 255, 0.1)'}`,
        fontSize: '0.75rem',
        color: isConnected ? 'var(--emerald-glow, #00FFA3)' : 'var(--text-muted, #94a3b8)',
        fontFamily: 'monospace',
      }}
      title={isConnected ? `Live SSE connected${lastEvent ? ` • Last: ${lastEvent}` : ''}` : 'SSE connecting...'}
    >
      <Radio size={12} className={isConnected ? 'animate-pulse' : ''} />
      <span>{isConnected ? 'LIVE FEED' : 'CONNECTING'}</span>
    </div>
  );
};
