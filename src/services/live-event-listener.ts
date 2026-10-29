import { ToastService } from './toast';
import { AudioSynthService } from './audio-synth';

export type LiveEventType =
  | 'TOURNAMENT_CREATED'
  | 'PRIZE_POOL_FUNDED'
  | 'TOURNAMENT_OPENED'
  | 'TOURNAMENT_FINALIZED'
  | 'PLAYER_JOINED'
  | 'MATCH_STARTED'
  | 'MATCH_COMPLETED'
  | 'MATCH_VERIFIED'
  | 'LEADERBOARD_UPDATED'
  | 'RECONCILIATION_UPDATED'
  | 'SETTLEMENT_CONFIRMED'
  | 'SETTLEMENT_FAILED';

export interface LiveEventPayload {
  type: LiveEventType;
  timestamp: number;
  data: Record<string, unknown>;
}

export type LiveEventListener = (event: LiveEventPayload) => void;

export class LiveEventListenerService {
  private static eventSource: EventSource | null = null;
  private static listeners: Set<LiveEventListener> = new Set();
  private static isConnected: boolean = false;
  private static reconnectTimer: ReturnType<typeof setTimeout> | null = null;
  private static retryCount: number = 0;
  private static maxRetries: number = 5;
  private static baseDelayMs: number = 1000;
  private static sseUrl: string = 'http://localhost:3001/api/events/stream';

  public static configure(url: string): void {
    this.sseUrl = url;
  }

  public static getStatus(): { isConnected: boolean; retryCount: number } {
    return {
      isConnected: this.isConnected,
      retryCount: this.retryCount,
    };
  }

  public static subscribe(listener: LiveEventListener): () => void {
    this.listeners.add(listener);
    if (!this.eventSource && typeof window !== 'undefined' && 'EventSource' in window) {
      this.connect();
    }
    return () => {
      this.listeners.delete(listener);
      if (this.listeners.size === 0) {
        this.disconnect();
      }
    };
  }

  public static connect(): void {
    if (this.eventSource) {
      return;
    }

    try {
      const source = new EventSource(this.sseUrl);
      this.eventSource = source;

      source.onopen = () => {
        this.isConnected = true;
        this.retryCount = 0;
      };

      source.onmessage = (event) => {
        try {
          if (!event.data || event.data === ':keepalive') return;
          const parsed = JSON.parse(event.data) as LiveEventPayload;
          this.handleEvent(parsed);
        } catch {
          // Ignore keepalive comments or malformed lines
        }
      };

      source.onerror = () => {
        this.isConnected = false;
        this.disconnect();
        this.scheduleReconnect();
      };
    } catch {
      this.isConnected = false;
      this.scheduleReconnect();
    }
  }

  public static handleEvent(payload: LiveEventPayload): void {
    // Notify all subscriber callbacks
    this.listeners.forEach((fn) => {
      try {
        fn(payload);
      } catch (err) {
        console.error('Error in live event listener callback', err);
      }
    });

    // Auto-trigger rich user toasts for high-value platform activities
    switch (payload.type) {
      case 'TOURNAMENT_CREATED': {
        const title = (payload.data?.title as string) || 'New Tournament';
        const prize = payload.data?.prizePool ? `${payload.data.prizePool} XLM` : '';
        ToastService.info(
          `🏆 Tournament Created: ${title}`,
          prize ? `Prize pool: ${prize}. Register now!` : 'New tournament opened for registration.'
        );
        AudioSynthService.playNotification();
        break;
      }
      case 'PLAYER_JOINED': {
        const player = (payload.data?.player as string) || 'A contender';
        const shortPlayer = player.length > 12 ? `${player.slice(0, 4)}...${player.slice(-4)}` : player;
        ToastService.info('👤 Contender Registered', `${shortPlayer} joined tournament arena.`);
        break;
      }
      case 'SETTLEMENT_CONFIRMED': {
        const txHash = (payload.data?.transactionHash as string) || undefined;
        ToastService.success(
          '💰 Prize Settlement Executed',
          'Winners have received automated on-chain payouts.',
          txHash
        );
        AudioSynthService.playSuccess();
        break;
      }
      case 'SETTLEMENT_FAILED': {
        ToastService.error(
          '⚠️ Settlement Issue',
          (payload.data?.error as string) || 'On-chain payout failed verification.'
        );
        break;
      }
      case 'MATCH_VERIFIED': {
        const score = payload.data?.score as number | undefined;
        if (score && score > 0) {
          ToastService.info('🎯 High Score Verified', `New verified match score: ${score}`);
        }
        break;
      }
      default:
        break;
    }
  }

  public static disconnect(): void {
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }
    if (this.eventSource) {
      this.eventSource.close();
      this.eventSource = null;
    }
    this.isConnected = false;
  }

  private static scheduleReconnect(): void {
    if (this.retryCount >= this.maxRetries) return;

    this.retryCount++;
    const delay = Math.min(this.baseDelayMs * Math.pow(2, this.retryCount - 1), 15000);

    this.reconnectTimer = setTimeout(() => {
      this.reconnectTimer = null;
      if (this.listeners.size > 0) {
        this.connect();
      }
    }, delay);
  }
}
