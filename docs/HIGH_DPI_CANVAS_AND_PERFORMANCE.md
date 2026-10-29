# High-DPI Canvas Rendering & 60 FPS Performance Specification

## 1. Overview
Stellar Splash is a fast-paced, skill-based competitive arcade game running directly in modern web browsers. Crisp, pixel-perfect visuals and consistent 60 frames-per-second (FPS) rendering are essential for player accuracy, input responsiveness, and visual prestige.

This specification documents the High-DPI Canvas scaling mechanics, frame budget management, and garbage-collection optimizations implemented in `src/utils/canvas-high-dpi.ts` and the rendering pipeline.

---

## 2. High-DPI Display Challenges
Modern displays (Apple Retina, 4K monitors, modern smartphones) operate with a `window.devicePixelRatio` (DPR) of 2.0 to 3.5. When an HTML5 `<canvas>` element is rendered with matching internal buffer and CSS dimensions (e.g., $800 \times 600$), the browser upscales the raster buffer across physical pixels, producing blurry graphics, fuzzy text, and indistinct collision targets.

### Solution: Coordinate Normalization Architecture
```
[Logical Game Coordinates] (e.g. 800 x 600 CSS px)
             │
             ▼
[setupHighDpiCanvas]
   ├─ Internal Buffer: canvas.width = 800 * 2.0 = 1600 physical px
   ├─ Internal Buffer: canvas.height = 600 * 2.0 = 1200 physical px
   ├─ Display Size: canvas.style.width = "800px"
   ├─ Display Size: canvas.style.height = "600px"
   └─ Context Scale: ctx.scale(2.0, 2.0)
             │
             ▼
[Hardware GPU Composition] -> Crystal-clear native pixel rasterization
```

---

## 3. Frame Budget Allocation (16.6ms Target)
To maintain smooth 60 FPS animation, every frame must complete within a strict 16.6ms window:

| Pipeline Stage | Budget | Description |
|---|---|---|
| **Input Ingestion** | `1.5 ms` | Process pointer, touch, keyboard, and virtual joystick state |
| **Physics & Determinism** | `3.5 ms` | Advance game physics, collision detection, and combo multipliers |
| **Canvas Drawing** | `7.0 ms` | Render background, targets, particle sprays, HUD score, and timer |
| **Browser Compositing** | `4.0 ms` | CSS layout, style recalculation, and GPU swap buffers |
| **Safety Margin** | `0.6 ms` | Overhead headroom preventing dropped frames |

---

## 4. Garbage Collection (GC) Optimization
Garbage collection pauses in JavaScript are a primary cause of micro-stuttering and missed target hits. Stellar Splash applies strict zero-allocation patterns during active gameplay:

1. **Object Pooling**: Pre-allocates a fixed pool of 200 `Particle` objects for water splashes and target explosions.
2. **Reused Coordinate Vectors**: Point vectors and bounds calculations reuse persistent scratch structures rather than creating short-lived object literals.
3. **Array Mutation In-Place**: Active particle lists are managed using index swapping (`swap-and-pop`) rather than `Array.prototype.splice()`.

---

## 5. Implementation Reference

### `setupHighDpiCanvas(canvas, cssWidth, cssHeight, customDpr?)`
Configures the canvas backing store buffer and sets the 2D transformation matrix:
```typescript
import { setupHighDpiCanvas } from '../utils/canvas-high-dpi';

const dimensions = setupHighDpiCanvas(canvasRef.current, 800, 600);
// Canvas buffer: 1600x1200, Display: 800x600, DPR: 2.0
```

### `resetCanvasContext(ctx, dpr)`
Restores DPR scaling if the canvas context is completely reset via `setTransform(1, 0, 0, 1, 0, 0)`.
