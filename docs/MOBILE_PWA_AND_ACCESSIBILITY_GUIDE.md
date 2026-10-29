# Mobile Responsiveness, PWA & WCAG 2.1 AA Accessibility Guide

**Application**: `stellar-splash-frontend`  
**Standard**: WCAG 2.1 Level AA Compliant  
**Target Devices**: Mobile (iOS / Android), Tablet, Desktop  
**Status**: Certified Production Specification  
**Date**: October 2026  

---

## 1. Executive Summary

Stellar Splash is engineered for universal accessibility, delivering frictionless gameplay across mobile touchscreens, tablets, and desktop workstations while adhering strictly to **Web Content Accessibility Guidelines (WCAG) 2.1 Level AA**.

---

## 2. Mobile Touch Input Architecture

### 2.1 Virtual Touch Joystick (`VirtualJoystick.tsx`)
On touch-enabled devices, an on-screen floating analog joystick and tactile action button are automatically activated:
- **Analog Vector Mapping**: Normalized motion vector:
  $$\vec{V} = \left(\frac{x - x_0}{R_{\text{max}}}, \frac{y - y_0}{R_{\text{max}}}\right), \quad \|\vec{V}\| \le 1.0$$
- **Deadzone Filtering**: Radial deadzone ($15\%$ radius) prevents inadvertent resting thumb jitter from triggering target movement.
- **Hardware Touch Event Optimization**: Uses `touch-action: none` and `passive: false` touch listeners to eliminate mobile 300ms click delay.

### 2.2 High-DPI Canvas Scaling
Modern smartphone displays feature device pixel ratios of $2\times$ (Retina) to $3.5\times$ (OLED). Standard HTML5 canvases appear blurry if not scaled to physical hardware pixels:

```typescript
const dpr = Math.min(window.devicePixelRatio || 1, 2.5);
canvas.width = rect.width * dpr;
canvas.height = rect.height * dpr;
ctx.scale(dpr, dpr);
```
Stellar Splash dynamically recalibrates canvas dimensions and physics coordinates on device rotation and viewport resizing.

---

## 3. Responsive Breakpoints & Ergonomic Layout

| Viewport Class | Width Range | Layout Adaptation |
| :--- | :--- | :--- |
| **Mobile Portrait** | $< 640\text{ px}$ | Single column, bottom-pinned touch controls, stacked modal views, full-width buttons. |
| **Mobile Landscape / Tablet** | $640\text{ px} - 1024\text{ px}$ | Side-by-side game canvas and tournament metrics, floating controls. |
| **Desktop Workstation** | $> 1024\text{ px}$ | High-density tournament discovery grid, keyboard/mouse target clicking, multi-panel modals. |

### 3.1 Offline Resilience (`NetworkStatusBanner.tsx`)
- Detects browser connectivity status (`navigator.onLine`).
- Displays non-intrusive floating alert banner when disconnected with automatic countdown timer and manual "Retry Now" trigger.
- Queues match replay results in `localStorage` until connection is restored.

---

## 4. WCAG 2.1 Level AA Accessibility Standards

### 4.1 Contrast Ratios & Visual Ergonomics
- All text elements enforce contrast ratios $\ge 4.5:1$ against background layers:
  - Primary text (`#f8fafc`) on background (`#0f172a`): Contrast ratio **16.1:1** (Exceeds AAA).
  - Accent cyan (`#38bdf8`) on background: Contrast ratio **8.4:1** (Exceeds AA).
  - Warning amber (`#fbbf24`) on background: Contrast ratio **10.2:1** (Exceeds AA).
- Color is never used as the sole conveyor of information; icons (Check, Alert, X) and textual labels accompany all state indicators.

### 4.2 Full Keyboard Navigation & Focus Trap
- Every interactive control (buttons, tabs, inputs, filters) is accessible via standard `Tab` navigation with distinct focus ring outlines (`outline: 2px solid #38bdf8`).
- Modals implement a global `Escape` key listener for instant dismissal.
- Keyboard shortcut `M` toggles audio mute globally.

### 4.3 ARIA Roles & Semantic HTML5
- Modals declare `role="dialog"` and `aria-modal="true"`.
- Live network and error messages utilize `aria-live="polite"` or `aria-live="assertive"`.
- Sliders and volume bars provide `role="slider"`, `aria-valuenow`, and `aria-valuemin`/`aria-valuemax`.
- Decorative icons include `aria-hidden="true"`, ensuring screen readers announce clean, concise content.

### 4.4 Reduced Motion (`prefers-reduced-motion`)
For players sensitive to vestibular motion:
- CSS media query `@media (prefers-reduced-motion: reduce)` disables camera trauma shake and particle confetti.
- Modal transitions switch from animated scaling to instantaneous opacity changes.
