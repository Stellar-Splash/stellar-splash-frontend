import React, { useEffect, useState } from 'react';
import { EventStreamClientService } from '../services/event-stream-client.service';
import { LiveContractEvent } from '../types/event-stream-listener';
import './LiveContractEventTicker.css';

export const LiveContractEventTicker: React.FC = () => {
  const [events, setEvents] = useState<LiveContractEvent[]>([
    {
      type: 'EVENT',
      topic: 'Tournament#101 Settle',
      data: { winner: 'GCQ3...6OW', payoutXlm: '120.00' },
      timestamp: Date.now() - 30000,
    },
    {
      type: 'EVENT',
      topic: 'Tournament#102 Sponsor',
      data: { sponsor: 'GBZX...ADI', amountXlm: '50.00' },
      timestamp: Date.now() - 60000,
    },
  ]);

  useEffect(() => {
    const unsubscribe = EventStreamClientService.subscribe((ev) => {
      if (ev.type === 'EVENT') {
        setEvents((prev) => [ev, ...prev].slice(0, 5));
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <div className="live-event-ticker" role="region" aria-label="Live Soroban Events Ticker">
      <div className="ticker-badge">
        <span className="ticker-live-dot" />
        <span>Soroban Testnet Feed</span>
      </div>
      <div className="ticker-stream">
        {events.map((ev, idx) => (
          <div key={idx} className="ticker-item">
            <span className="ticker-topic">{ev.topic || 'Contract Event'}</span>
            <span className="ticker-summary">
              {ev.data?.winner
                ? `Winner: ${ev.data.winner} (+${ev.data.payoutXlm} XLM)`
                : ev.data?.sponsor
                ? `Sponsor: ${ev.data.sponsor} (+${ev.data.amountXlm} XLM)`
                : 'Execution Confirmed'}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
