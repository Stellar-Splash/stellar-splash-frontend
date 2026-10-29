import { ContractEventCallback, LiveContractEvent } from '../types/event-stream-listener';

export class EventStreamClientService {
  private static eventSource: EventSource | null = null;
  private static listeners: Set<ContractEventCallback> = new Set();
  private static reconnectTimer: any = null;

  public static subscribe(callback: ContractEventCallback): () => void {
    this.listeners.add(callback);
    if (!this.eventSource && typeof window !== 'undefined' && window.EventSource) {
      this.initConnection();
    }

    return () => {
      this.listeners.delete(callback);
      if (this.listeners.size === 0 && this.eventSource) {
        this.eventSource.close();
        this.eventSource = null;
      }
    };
  }

  private static initConnection(): void {
    try {
      this.eventSource = new EventSource('http://localhost:3000/api/events/contracts/stream');

      this.eventSource.onmessage = (e) => {
        try {
          const event: LiveContractEvent = JSON.parse(e.data);
          this.listeners.forEach((listener) => listener(event));
        } catch {
          // Ignore JSON parse errors
        }
      };

      this.eventSource.onerror = () => {
        if (this.eventSource) {
          this.eventSource.close();
          this.eventSource = null;
        }
        // Attempt reconnect after 5s
        clearTimeout(this.reconnectTimer);
        this.reconnectTimer = setTimeout(() => {
          if (this.listeners.size > 0) {
            this.initConnection();
          }
        }, 5000);
      };
    } catch {
      // EventSource instantiation failure
    }
  }
}

