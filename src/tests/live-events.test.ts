import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { LiveEventListenerService, LiveEventPayload } from '../services/live-event-listener';
import { ToastService } from '../services/toast';

describe('LiveEventListenerService & LiveEventToasts', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    LiveEventListenerService.disconnect();
  });

  afterEach(() => {
    LiveEventListenerService.disconnect();
  });

  it('manages subscriber callbacks accurately', () => {
    const mockListener = vi.fn();
    const unsubscribe = LiveEventListenerService.subscribe(mockListener);

    const payload: LiveEventPayload = {
      type: 'TOURNAMENT_CREATED',
      timestamp: Date.now(),
      data: { title: 'Soroban Cup', prizePool: 500 },
    };

    LiveEventListenerService.handleEvent(payload);
    expect(mockListener).toHaveBeenCalledWith(payload);

    unsubscribe();
    mockListener.mockClear();

    LiveEventListenerService.handleEvent(payload);
    expect(mockListener).not.toHaveBeenCalled();
  });

  it('triggers ToastService on critical platform events', () => {
    const toastSpy = vi.spyOn(ToastService, 'info');
    const successSpy = vi.spyOn(ToastService, 'success');

    LiveEventListenerService.handleEvent({
      type: 'TOURNAMENT_CREATED',
      timestamp: Date.now(),
      data: { title: 'Aqua Sprint', prizePool: 100 },
    });
    expect(toastSpy).toHaveBeenCalledWith(
      expect.stringContaining('Tournament Created'),
      expect.stringContaining('100 XLM')
    );

    LiveEventListenerService.handleEvent({
      type: 'PLAYER_JOINED',
      timestamp: Date.now(),
      data: { player: 'GBZXTESTNETUSERWALLET1234567890' },
    });
    expect(toastSpy).toHaveBeenCalledWith(
      '👤 Contender Registered',
      expect.stringContaining('GBZX...7890')
    );

    LiveEventListenerService.handleEvent({
      type: 'SETTLEMENT_CONFIRMED',
      timestamp: Date.now(),
      data: { transactionHash: '0xabc12345' },
    });
    expect(successSpy).toHaveBeenCalledWith(
      '💰 Prize Settlement Executed',
      expect.any(String),
      '0xabc12345'
    );
  });

  it('reports initial disconnected status correctly', () => {
    const status = LiveEventListenerService.getStatus();
    expect(status.isConnected).toBe(false);
    expect(status.retryCount).toBe(0);
  });
});
