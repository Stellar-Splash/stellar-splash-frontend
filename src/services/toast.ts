export type ToastType = 'info' | 'success' | 'error' | 'warning';

export interface ToastMessage {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
  txHash?: string;
  durationMs?: number;
}

type ToastListener = (toasts: ToastMessage[]) => void;

export class ToastService {
  private static toasts: ToastMessage[] = [];
  private static listeners: Set<ToastListener> = new Set();

  public static getToasts(): ToastMessage[] {
    return [...this.toasts];
  }

  public static subscribe(listener: ToastListener): () => void {
    this.listeners.add(listener);
    listener(this.getToasts());
    return () => {
      this.listeners.delete(listener);
    };
  }

  private static notify(): void {
    const copy = this.getToasts();
    this.listeners.forEach((listener) => listener(copy));
  }

  public static show(toast: Omit<ToastMessage, 'id'>): string {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`;
    const newToast: ToastMessage = {
      id,
      durationMs: 5000,
      ...toast,
    };

    this.toasts = [...this.toasts, newToast];
    this.notify();

    if (newToast.durationMs && newToast.durationMs > 0) {
      setTimeout(() => {
        this.dismiss(id);
      }, newToast.durationMs);
    }

    return id;
  }

  public static success(title: string, message?: string, txHash?: string): string {
    return this.show({ type: 'success', title, message, txHash });
  }

  public static error(title: string, message?: string, txHash?: string): string {
    return this.show({ type: 'error', title, message, txHash, durationMs: 7000 });
  }

  public static info(title: string, message?: string, txHash?: string): string {
    return this.show({ type: 'info', title, message, txHash });
  }

  public static warning(title: string, message?: string): string {
    return this.show({ type: 'warning', title, message });
  }

  public static dismiss(id: string): void {
    this.toasts = this.toasts.filter((t) => t.id !== id);
    this.notify();
  }

  public static clear(): void {
    this.toasts = [];
    this.notify();
  }
}
