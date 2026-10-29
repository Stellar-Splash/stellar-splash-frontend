# Stellar Splash - Graphics, Audio & Physics Optimization Guide

## 1. High-Performance Canvas Rendering
Stellar Splash achieves stable 60 FPS rendering across both high-end desktop displays and mobile hardware:
- **Device Pixel Ratio (DPR) Scaling**: Backing canvas buffer is scaled dynamically by `window.devicePixelRatio` while styling bounds remain normalized, ensuring crisp visuals on Retina/OLED mobile screens without blurry antialiasing artifacts.
- **Layered Rendering Pipeline**:
  1. Static Ambient Grid & Starfield (Cached off-screen canvas)
  2. Dynamic Particle Emitters (Object-pooled splash bubbles)
  3. Player Avatar & Hitbox
  4. HUD & Score Overlays
- **Garbage Collection (GC) Elimination**: All physics vectors, particle arrays, and input delta packets are pre-allocated at match initialization to avoid frame drops caused by V8 runtime GC pauses.

## 2. Web Audio Procedural Synthesis
To eliminate heavy sound asset downloads:
- Custom Web Audio API synthesizer generates retro arcade tones, laser splashes, and victory fanfares procedurally via mathematical oscillators (`sine`, `square`, `sawtooth`).
- Zero audio asset fetch latency; sound is 100% available offline and in low-bandwidth environments.

## 3. Mobile Touch & Responsive Design
- Virtual Dual-Zone Touch Joystick overlays automatically when touch devices or viewport widths $< 768\text{px}$ are detected.
- Haptic feedback integration (Vibration API) on mobile devices upon collecting XLM tokens or sustaining obstacle damage.

