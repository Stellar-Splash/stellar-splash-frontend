/**
 * Keyboard accessibility and focus management utilities for Stellar Splash modals and interactive widgets.
 */

export const FOCUSABLE_SELECTORS =
  'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

/**
 * Traps Tab focus within a modal container to ensure screen-reader and keyboard accessibility.
 */
export function trapFocus(container: HTMLElement, e: KeyboardEvent): void {
  if (e.key !== 'Tab') return;

  const focusable = container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTORS);
  if (focusable.length === 0) return;

  const first = focusable[0];
  const last = focusable[focusable.length - 1];

  if (e.shiftKey) {
    if (document.activeElement === first) {
      last.focus();
      e.preventDefault();
    }
  } else {
    if (document.activeElement === last) {
      first.focus();
      e.preventDefault();
    }
  }
}

/**
 * Returns true if the key pressed is the Escape key.
 */
export function isEscapeKey(e: KeyboardEvent): boolean {
  return e.key === 'Escape' || e.key === 'Esc';
}

/**
 * Returns true if the key pressed is Enter.
 */
export function isEnterKey(e: KeyboardEvent): boolean {
  return e.key === 'Enter';
}
