/**
 * High-DPI Canvas Scaling Utility
 * Ensures crystal-clear 60fps rendering across Retina, 4K, and high-density mobile displays.
 */

export interface CanvasDimensions {
  cssWidth: number;
  cssHeight: number;
  dpr: number;
  pixelWidth: number;
  pixelHeight: number;
}

/**
 * Configures an HTML5 Canvas element for high-DPI crisp rendering.
 * Scales the internal pixel buffer by devicePixelRatio while preserving CSS display size.
 */
export function setupHighDpiCanvas(
  canvas: HTMLCanvasElement,
  cssWidth: number,
  cssHeight: number,
  customDpr?: number
): CanvasDimensions {
  const dpr = customDpr !== undefined ? customDpr : (typeof window !== 'undefined' ? window.devicePixelRatio || 1 : 1);

  // Set internal resolution buffer
  canvas.width = Math.round(cssWidth * dpr);
  canvas.height = Math.round(cssHeight * dpr);

  // Set CSS display size
  canvas.style.width = `${cssWidth}px`;
  canvas.style.height = `${cssHeight}px`;

  // Scale context to match standard CSS pixel coordinate space
  const ctx = canvas.getContext('2d');
  if (ctx) {
    ctx.scale(dpr, dpr);
    ctx.imageSmoothingEnabled = true;
  }

  return {
    cssWidth,
    cssHeight,
    dpr,
    pixelWidth: canvas.width,
    pixelHeight: canvas.height,
  };
}

/**
 * Resets context transformation for High-DPI rendering after full clears.
 */
export function resetCanvasContext(ctx: CanvasRenderingContext2D, dpr: number): void {
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.scale(dpr, dpr);
}
