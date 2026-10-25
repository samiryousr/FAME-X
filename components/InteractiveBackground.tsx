"use client";

import { useEffect, useRef } from "react";

type PixelTone = "green" | "orange" | "white";

type Pixel = {
  x: number;
  y: number;
  size: number;
  alpha: number;
  phase: number;
  speed: number;
  tone: PixelTone;
};

const COLORS: Record<PixelTone, string> = {
  green: "#a6f45d",
  orange: "#e85a02", // warm amber/orange matching footer
  white: "#ffffff",  // crisp white star pixel matching footer
};

export default function InteractiveBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");
    if (!canvas || !context) {
      return;
    }

    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const pointer = { x: -1000, y: -1000, active: false };
    let pixels: Pixel[] = [];
    let width = 0;
    let height = 0;
    let frame = 0;
    let previousTime = 0;
    let time = 0;

    const resize = () => {
      const pixelRatio = Math.min(window.devicePixelRatio || 1, 1.5);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = Math.round(width * pixelRatio);
      canvas.height = Math.round(height * pixelRatio);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);

      const mobile = width < 700;
      const count = Math.min(
        mobile ? 160 : 400,
        Math.max(mobile ? 80 : 180, Math.floor((width * height) / 5800)),
      );
      pixels = Array.from({ length: count }, () => {
        const rand = Math.random();
        const tone: PixelTone =
          rand < 0.45 ? "green" : rand < 0.72 ? "orange" : "white";

        return {
          x: Math.random() * width,
          y: Math.random() * height,
          size: Math.random() < 0.2 ? 4 : 2 + Math.random() * 2,
          alpha:
            tone === "white"
              ? 0.18 + Math.random() * 0.32
              : tone === "orange"
              ? 0.22 + Math.random() * 0.32
              : 0.14 + Math.random() * 0.24,
          phase: Math.random() * Math.PI * 2,
          speed: 0.25 + Math.random() * 0.65,
          tone,
        };
      });
      draw(0, true);
    };

    const draw = (timestamp: number, staticFrame = false) => {
      const delta = Math.min((timestamp - previousTime) / 1000 || 0, 0.04);
      previousTime = timestamp;
      time += delta;
      context.clearRect(0, 0, width, height);

      pixels.forEach((pixel) => {
        let proximity = 0;

        if (pointer.active) {
          const dx = pixel.x - pointer.x;
          const dy = pixel.y - pointer.y;
          const distance = Math.hypot(dx, dy);
          const radius = 190;
          if (distance < radius) {
            proximity = 1 - distance / radius;
          }
        }

        if (!staticFrame) {
          pixel.x += Math.sin(time * pixel.speed + pixel.phase) * 2 * delta;
          pixel.y += Math.cos(time * pixel.speed + pixel.phase) * 1.5 * delta;
          if (pixel.x < -8) pixel.x = width + 8;
          if (pixel.x > width + 8) pixel.x = -8;
          if (pixel.y < -8) pixel.y = height + 8;
          if (pixel.y > height + 8) pixel.y = -8;
        }

        const pulse = 0.78 + Math.sin(time * pixel.speed + pixel.phase) * 0.22;
        const alpha = Math.min(0.92, (pixel.alpha + proximity * 0.68) * pulse);
        const color = COLORS[pixel.tone];
        context.globalAlpha = alpha;
        context.fillStyle = color;
        if (proximity > 0.08) {
          context.shadowColor = color;
          context.shadowBlur = proximity * 16;
        } else {
          context.shadowBlur = 0;
        }
        context.fillRect(
          Math.round(pixel.x / 4) * 4,
          Math.round(pixel.y / 4) * 4,
          pixel.size,
          pixel.size,
        );
      });
      context.globalAlpha = 1;
      context.shadowBlur = 0;

      if (!staticFrame) {
        frame = window.requestAnimationFrame(draw);
      }
    };

    const handlePointerMove = (event: PointerEvent) => {
      pointer.x = event.clientX;
      pointer.y = event.clientY;
      pointer.active = true;
    };
    const handlePointerLeave = () => {
      pointer.active = false;
    };
    const handleVisibilityChange = () => {
      if (document.hidden) {
        window.cancelAnimationFrame(frame);
        return;
      }
      if (reducedMotion) {
        return;
      }
      previousTime = 0;
      frame = window.requestAnimationFrame(draw);
    };

    resize();
    if (!reducedMotion) {
      frame = window.requestAnimationFrame(draw);
    }
    window.addEventListener("resize", resize, { passive: true });
    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    window.addEventListener("pointerleave", handlePointerLeave);
    window.addEventListener("blur", handlePointerLeave);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerleave", handlePointerLeave);
      window.removeEventListener("blur", handlePointerLeave);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  return (
    <div aria-hidden="true" className="ambient-background">
      <canvas className="ambient-background__canvas" ref={canvasRef} />
    </div>
  );
}
