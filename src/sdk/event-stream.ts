export type SdkEventListener<T> = (event: T) => void;

export class EventStreamClient<T = unknown> {
  private listeners: SdkEventListener<T>[] = [];

  public subscribe(listener: SdkEventListener<T>): () => void {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  public emit(event: T): void {
    for (const listener of this.listeners) {
      listener(event);
    }
  }

  public getSubscriberCount(): number {
    return this.listeners.length;
  }
}

