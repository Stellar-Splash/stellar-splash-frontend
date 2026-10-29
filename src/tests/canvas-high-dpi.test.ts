import { describe, it, expect, vi } from 'vitest';
import { setupHighDpiCanvas, resetCanvasContext } from '../utils/canvas-high-dpi';

describe('High-DPI Canvas Scaling Utility', () => {
  it('correctly scales canvas dimensions and context by devicePixelRatio', () => {
    const scaleFn = vi.fn();
    const canvas = {
      width: 0,
      height: 0,
      style: { width: '', height: '' },
      getContext: vi.fn().mockReturnValue({
        scale: scaleFn,
        imageSmoothingEnabled: false,
      }),
    } as unknown as HTMLCanvasElement;

    const dimensions = setupHighDpiCanvas(canvas, 800, 600, 2);

    expect(dimensions.cssWidth).toBe(800);
    expect(dimensions.cssHeight).toBe(600);
    expect(dimensions.dpr).toBe(2);
    expect(dimensions.pixelWidth).toBe(1600);
    expect(dimensions.pixelHeight).toBe(1200);

    expect(canvas.width).toBe(1600);
    expect(canvas.height).toBe(1200);
    expect(canvas.style.width).toBe('800px');
    expect(canvas.style.height).toBe('600px');
    expect(scaleFn).toHaveBeenCalledWith(2, 2);
  });

  it('defaults to DPR 1 when custom DPR is not provided or window is missing', () => {
    const scaleFn = vi.fn();
    const canvas = {
      width: 0,
      height: 0,
      style: { width: '', height: '' },
      getContext: vi.fn().mockReturnValue({
        scale: scaleFn,
        imageSmoothingEnabled: false,
      }),
    } as unknown as HTMLCanvasElement;

    const dimensions = setupHighDpiCanvas(canvas, 400, 300, 1);

    expect(dimensions.dpr).toBe(1);
    expect(canvas.width).toBe(400);
    expect(canvas.height).toBe(300);
    expect(scaleFn).toHaveBeenCalledWith(1, 1);
  });

  it('resets context transform and applies DPR scaling', () => {
    const setTransformFn = vi.fn();
    const scaleFn = vi.fn();
    const ctx = {
      setTransform: setTransformFn,
      scale: scaleFn,
    } as unknown as CanvasRenderingContext2D;

    resetCanvasContext(ctx, 3);

    expect(setTransformFn).toHaveBeenCalledWith(1, 0, 0, 1, 0, 0);
    expect(scaleFn).toHaveBeenCalledWith(3, 3);
  });
});
