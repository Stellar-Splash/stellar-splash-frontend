import { describe, it, expect, beforeEach, vi } from 'vitest';
import { ToastService } from '../services/toast';

describe('ToastService', () => {
  beforeEach(() => {
    ToastService.clear();
  });

  it('adds and retrieves toasts with unique IDs', () => {
    const id1 = ToastService.success('Tx Confirmed', 'Tournament open');
    const id2 = ToastService.error('Tx Failed', 'Timeout reached');

    const toasts = ToastService.getToasts();
    expect(toasts.length).toBe(2);
    expect(toasts[0].id).toBe(id1);
    expect(toasts[0].type).toBe('success');
    expect(toasts[1].id).toBe(id2);
    expect(toasts[1].type).toBe('error');
  });

  it('notifies subscribers upon adding and dismissing toasts', () => {
    const subscriber = vi.fn();
    const unsubscribe = ToastService.subscribe(subscriber);

    expect(subscriber).toHaveBeenCalledWith([]);

    const id = ToastService.info('Info message');
    expect(subscriber).toHaveBeenLastCalledWith(
      expect.arrayContaining([expect.objectContaining({ id, title: 'Info message' })])
    );

    ToastService.dismiss(id);
    expect(subscriber).toHaveBeenLastCalledWith([]);

    unsubscribe();
  });

  it('auto-dismisses toasts after duration', () => {
    vi.useFakeTimers();
    ToastService.show({
      type: 'warning',
      title: 'Warning Title',
      durationMs: 1000,
    });

    expect(ToastService.getToasts().length).toBe(1);
    vi.advanceTimersByTime(1100);
    expect(ToastService.getToasts().length).toBe(0);
    vi.useRealTimers();
  });
});
