import React, { useEffect, useRef } from 'react';
import { ConfettiParticle } from '../types/confetti-particle';
import './ParticleCelebrationCanvas.css';

interface ParticleCelebrationCanvasProps {
  isActive: boolean;
  onComplete?: () => void;
  durationMs?: number;
}

const COLORS = ['#38bdf8', '#eab308', '#ec4899', '#22c55e', '#a855f7', '#f97316'];

export const ParticleCelebrationCanvas: React.FC<ParticleCelebrationCanvasProps> = ({
  isActive,
  onComplete,
  durationMs = 4000,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (!isActive) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles: ConfettiParticle[] = [];
    const particleCount = 120;

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: canvas.width / 2,
        y: canvas.height * 0.4,
        vx: (Math.random() - 0.5) * 14,
        vy: (Math.random() - 0.7) * 16,
        size: Math.random() * 8 + 4,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 10,
        opacity: 1.0,
        decay: Math.random() * 0.005 + 0.005,
      });
    }

    let animationId: number;
    const startTime = Date.now();

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      let aliveCount = 0;
      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.35; // gravity
        p.vx *= 0.98; // drag
        p.rotation += p.rotationSpeed;
        p.opacity -= p.decay;

        if (p.opacity > 0) {
          aliveCount++;
          ctx.save();
          ctx.translate(p.x, p.y);
          ctx.rotate((p.rotation * Math.PI) / 180);
          ctx.globalAlpha = Math.max(p.opacity, 0);
          ctx.fillStyle = p.color;
          ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6);
          ctx.restore();
        }
      }

      if (aliveCount > 0 && Date.now() - startTime < durationMs) {
        animationId = requestAnimationFrame(render);
      } else {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        onComplete?.();
      }
    };

    animationId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationId);
      if (ctx) ctx.clearRect(0, 0, canvas.width, canvas.height);
    };
  }, [isActive, durationMs, onComplete]);

  if (!isActive) return null;

  return (
    <canvas
      ref={canvasRef}
      className="particle-celebration-canvas"
      aria-hidden="true"
    />
  );
};
