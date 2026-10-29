import { describe, it, expect, vi } from 'vitest';
import { isEscapeKey, isEnterKey, trapFocus } from '../utils/accessibility';

describe('Accessibility Utilities', () => {
  it('correctly identifies Escape key events', () => {
    expect(isEscapeKey({ key: 'Escape' } as KeyboardEvent)).toBe(true);
    expect(isEscapeKey({ key: 'Esc' } as KeyboardEvent)).toBe(true);
    expect(isEscapeKey({ key: 'Enter' } as KeyboardEvent)).toBe(false);
    expect(isEscapeKey({ key: 'Tab' } as KeyboardEvent)).toBe(false);
  });

  it('correctly identifies Enter key events', () => {
    expect(isEnterKey({ key: 'Enter' } as KeyboardEvent)).toBe(true);
    expect(isEnterKey({ key: ' ' } as KeyboardEvent)).toBe(false);
    expect(isEnterKey({ key: 'Escape' } as KeyboardEvent)).toBe(false);
  });

  it('traps focus forward when reaching the last element', () => {
    const btn1 = { focus: vi.fn() } as unknown as HTMLElement;
    const btn2 = { focus: vi.fn() } as unknown as HTMLElement;

    const mockContainer = {
      querySelectorAll: vi.fn().mockReturnValue([btn1, btn2]),
    } as unknown as HTMLElement;

    // Simulate activeElement being btn2 (last element) and pressing Tab
    (globalThis as any).document = { activeElement: btn2 };

    const mockEvent = {
      key: 'Tab',
      shiftKey: false,
      preventDefault: vi.fn(),
    } as unknown as KeyboardEvent;

    trapFocus(mockContainer, mockEvent);

    expect(mockEvent.preventDefault).toHaveBeenCalled();
    expect(btn1.focus).toHaveBeenCalled();
  });

  it('traps focus backward when pressing Shift+Tab on the first element', () => {
    const btn1 = { focus: vi.fn() } as unknown as HTMLElement;
    const btn2 = { focus: vi.fn() } as unknown as HTMLElement;

    const mockContainer = {
      querySelectorAll: vi.fn().mockReturnValue([btn1, btn2]),
    } as unknown as HTMLElement;

    (globalThis as any).document = { activeElement: btn1 };

    const mockEvent = {
      key: 'Tab',
      shiftKey: true,
      preventDefault: vi.fn(),
    } as unknown as KeyboardEvent;

    trapFocus(mockContainer, mockEvent);

    expect(mockEvent.preventDefault).toHaveBeenCalled();
    expect(btn2.focus).toHaveBeenCalled();
  });
});
