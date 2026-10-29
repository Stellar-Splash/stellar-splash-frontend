# Stellar Splash: Keyboard Shortcuts & Accessibility Specification (WCAG 2.1 AA)

## 1. Overview
Stellar Splash is built with an accessible, high-performance web architecture adhering to **WCAG 2.1 AA** standards. The application features zero external audio dependencies, fully keyboard-drivable gaming controls, and high-contrast cyberpunk HUD themes.

---

## 2. Keyboard Control Reference

All in-game interactions and dashboard navigation can be executed entirely via keyboard without mouse input:

| Key Binding | Category | Action | Behavioral Details |
| :--- | :--- | :--- | :--- |
| <kbd>W</kbd> or <kbd>↑</kbd> | Game Control | Move Player Up | Moves water-cannon reticle / avatar upwards |
| <kbd>S</kbd> or <kbd>↓</kbd> | Game Control | Move Player Down | Moves water-cannon reticle / avatar downwards |
| <kbd>A</kbd> or <kbd>←</kbd> | Game Control | Move Player Left | Moves water-cannon reticle / avatar leftwards |
| <kbd>D</kbd> or <kbd>→</kbd> | Game Control | Move Player Right | Moves water-cannon reticle / avatar rightwards |
| <kbd>Space</kbd> / <kbd>Enter</kbd> | Game Control | Throw Water Balloon | Fires primary projectile, triggers Web Audio impact |
| <kbd>M</kbd> | Global HUD | Toggle Audio | Mutes or unmutes synthesized Web Audio sound FX |
| <kbd>?</kbd> | Global HUD | Shortcut Guide | Opens `KeyboardShortcutHelpModal` overlay |
| <kbd>Esc</kbd> | Navigation | Dismiss / Close | Closes active modal, dropdown, or toast banner |
| <kbd>Tab</kbd> / <kbd>Shift+Tab</kbd> | Accessibility | Focus Traversal | Cycles focus through interactive buttons & inputs |

---

## 3. WCAG 2.1 AA Compliance Elements

### 3.1 Color Contrast & Visual Legibility
- Text contrast ratios against background panels exceed **7.0:1** for normal text and **4.5:1** for large headings.
- Status indicators do not rely on color alone; every indicator combines color pills with distinct icons (`✓`, `!`, `×`) and explicit textual labels (`Attested on Soroban`, `Dispute Active`).

### 3.2 Screen Reader Landmarks & ARIA Support
- **Modal Dialogs**: Modals implement `role="dialog"`, `aria-modal="true"`, and `aria-labelledby` referencing heading IDs.
- **Dynamic Alerts**: Circuit breaker notices and HTTP 429 warnings implement `role="alert"` with `aria-live="assertive"` for immediate screen reader announcement.
- **Live Event Toasts**: Real-time SSE match and payout alerts use `aria-live="polite"`.

### 3.3 Motion & Sensory Safety
- Animations respect the system `prefers-reduced-motion` media query, disabling camera shake, particle shockwaves, and ambient nebula rotations when requested.
- Audio synthesizer (`AudioSynthService`) relies exclusively on clean non-fatiguing synthesized sine/square waves capped at safe decibel limits.
