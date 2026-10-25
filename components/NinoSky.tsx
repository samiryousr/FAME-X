"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { createPortal } from "react-dom";

// --- Seeded PRNG and Geometry Math from 9k.school ---
function seededRandom(seed: number) {
  let t = seed >>> 0;
  return () => {
    t = (t + 1831565813) >>> 0;
    let e = t;
    e = Math.imul(e ^ (e >>> 15), e | 1);
    e ^= e + Math.imul(e ^ (e >>> 7), e | 61);
    return ((e ^ (e >>> 14)) >>> 0) / 4294967296;
  };
}

function round4(v: number) {
  return Math.round(v / 4) * 4;
}

type StarTone = "warm" | "cool" | "faint" | "accent";

type Star = {
  x: number;
  y: number;
  tone: StarTone;
  period: number;
  phase: number;
  vx: number;
  vy: number;
  swayAmp: number;
  swayFreq: number;
  swayPhase: number;
};

type PlanetPoint = { x: number; y: number };

type BurstParticle = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  tone: "warm" | "cool";
  born: number;
};

function wrapMargin(val: number, max: number, margin = 12): number {
  const span = max + margin * 2;
  return (((val + margin) % span + span) % span) - margin;
}

function generateStars(width: number, height: number, seed = 9): Star[] {
  const cols = Math.floor(width / 4);
  const rows = Math.floor(height / 4);
  if (cols < 1 || rows < 1) return [];
  const count = Math.min(380, Math.floor((width * height) / 950));
  const rng = seededRandom(seed);
  const stars: Star[] = [];
  for (let i = 0; i < count; i++) {
    const x = Math.floor(rng() * cols) * 4;
    const y = Math.floor(rng() * rows) * 4;
    const rand = rng();
    const tone: StarTone =
      rand < 0.12 ? "warm" : rand < 0.24 ? "cool" : rand < 0.38 ? "accent" : "faint";

    // Gentle swimming drift: 4 to 12 px per second in random smooth directions
    const driftAngle = rng() * Math.PI * 2;
    const driftSpeed = 0.004 + rng() * 0.008; // px/ms

    stars.push({
      x,
      y,
      tone,
      period: 2000 + rng() * 4000,
      phase: rng(),
      vx: Math.cos(driftAngle) * driftSpeed,
      vy: Math.sin(driftAngle) * driftSpeed,
      swayAmp: 2.5 + rng() * 4.5, // 2.5px to 7px gentle swimming sway
      swayFreq: (2 * Math.PI) / (3800 + rng() * 3500), // 3.8s to 7.3s swimming cycle
      swayPhase: rng() * Math.PI * 2,
    });
  }
  return stars;
}

function generatePlanet(type: "crescent" | "ringed", cx: number, cy: number, r: number): PlanetPoint[] {
  const points: PlanetPoint[] = [];
  const maxExtent = type === "ringed" ? r * 1.9 : r;

  for (let y = round4(cy - maxExtent); y <= cy + maxExtent; y += 4) {
    for (let x = round4(cx - maxExtent); x <= cx + maxExtent; x += 4) {
      const dx = x - cx;
      const dy = y - cy;
      const inCircle = dx * dx + dy * dy <= r * r;

      if (type === "crescent") {
        const offsetDx = dx - r * 0.45;
        const offsetDy = dy + r * 0.15;
        if (inCircle && offsetDx * offsetDx + offsetDy * offsetDy > r * r * 0.8) {
          points.push({ x, y });
        }
      } else {
        // Saturn with ring
        const inRing = (dx / (r * 1.9)) ** 2 + (dy / (r * 0.45)) ** 2;
        if (inCircle || (inRing <= 1 && inRing >= 0.6 && !(dy < 0 && inCircle))) {
          points.push({ x, y });
        }
      }
    }
  }
  return points;
}

function getTwinkle(star: Star, time: number) {
  return 0.15 + 0.85 * (0.5 + 0.5 * Math.sin(2 * Math.PI * (time / star.period + star.phase)));
}

function getDriftOffset(time: number, width: number, height: number, ninoHeight = 72) {
  const sin = (period: number) => Math.sin((2 * Math.PI * time) / period);
  const maxH = Math.max(0, (height - ninoHeight) / 2);
  return {
    x: width * 0.04 * sin(23000),
    y: maxH * 0.65 * sin(9000),
    tilt: 6 * sin(5000),
  };
}

const EXPRESSIONS = ["idle", "happy", "surprised", "thinking", "eyes-closed", "worried"] as const;
type Expression = (typeof EXPRESSIONS)[number];

interface NinoSkyProps {
  children?: React.ReactNode;
}

export default function NinoSky({ children }: NinoSkyProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const flightRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const [expression, setExpression] = useState<Expression>("idle");
  const [look, setLook] = useState<
    | "center"
    | "up"
    | "down"
    | "left"
    | "right"
    | "up-left"
    | "up-right"
    | "down-left"
    | "down-right"
    | "start"
    | "end"
  >("center");
  const [isSpinning, setIsSpinning] = useState(false);
  const [isAirborne, setIsAirborne] = useState(false);
  const [isDetached, setIsDetached] = useState(false);
  const [mounted, setMounted] = useState(false);

  const starsRef = useRef<Star[]>([]);
  const planetsRef = useRef<PlanetPoint[]>([]);
  const burstsRef = useRef<BurstParticle[]>([]);
  const rafRef = useRef<number>(0);
  const startTimeRef = useRef<number>(0);
  const boopCountRef = useRef<number>(0);
  const lookTimeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);
  const exprTimeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);

  // Physics state for dragging / tossing Nino anywhere on the page
  const physicsRef = useRef({
    mode: "drifting" as "drifting" | "dragging" | "flying" | "returning",
    pos: { x: 0, y: 0 },
    anchorPos: { x: 0, y: 0 },
    velocity: { vx: 0, vy: 0 },
    history: [] as { x: number; y: number; t: number }[],
    dragOffset: { x: 0, y: 0 },
  });

  // Rebuild stars and planets on resize
  const handleResize = useCallback(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    const width = container.clientWidth;
    const height = container.clientHeight;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);

    starsRef.current = generateStars(width, height);

    // Responsive placement for Crescent Moon and Saturn
    const isMobile = width < 640;
    const crescentR = isMobile ? Math.min(26, width * 0.08) : 40;
    const crescentX = width - Math.max(crescentR + 24, width * 0.12);
    const crescentY = isMobile ? height * 0.10 : height * 0.18;

    const saturnR = isMobile ? Math.min(22, width * 0.065) : 34;
    const saturnX = Math.max(saturnR * 1.9 + 18, width * 0.12);
    const saturnY = isMobile ? height * 0.88 : height * 0.80;

    planetsRef.current = [
      ...generatePlanet("crescent", crescentX, crescentY, crescentR),
      ...generatePlanet("ringed", saturnX, saturnY, saturnR),
    ];
  }, []);

  // Mount flag for client-side portal rendering
  useEffect(() => {
    setMounted(true);
  }, []);

  const autoReturnTimeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);

  const returnHome = useCallback(() => {
    clearTimeout(autoReturnTimeoutRef.current);
    physicsRef.current.mode = "returning";
    setIsAirborne(true);
  }, []);

  const startAutoReturnTimer = useCallback(() => {
    clearTimeout(autoReturnTimeoutRef.current);
    autoReturnTimeoutRef.current = setTimeout(() => {
      returnHome();
    }, 5000); // 5 seconds
  }, [returnHome]);

  const cancelAutoReturnTimer = useCallback(() => {
    clearTimeout(autoReturnTimeoutRef.current);
  }, []);

  useEffect(() => {
    return () => {
      clearTimeout(autoReturnTimeoutRef.current);
    };
  }, []);

  // Global pointer move tracking so Nino's gaze follows mouse across the entire page
  useEffect(() => {
    const handleGlobalPointerMove = (e: PointerEvent) => {
      if (physicsRef.current.mode === "dragging") return;
      const button = buttonRef.current;
      if (!button) return;

      const bRect = button.getBoundingClientRect();
      const centerX = bRect.left + bRect.width / 2;
      const centerY = bRect.top + bRect.height / 2;
      const dx = e.clientX - centerX;
      const dy = e.clientY - centerY;

      if (Math.hypot(dx, dy) < 25) {
        setLook("center");
      } else {
        const isUp = dy < -20;
        const isDown = dy > 20;
        const isRight = dx > 20;
        const isLeft = dx < -20;

        if (isUp && isRight) setLook("up-right");
        else if (isUp && isLeft) setLook("up-left");
        else if (isDown && isRight) setLook("down-right");
        else if (isDown && isLeft) setLook("down-left");
        else if (isUp) setLook("up");
        else if (isDown) setLook("down");
        else if (isRight) setLook("right");
        else if (isLeft) setLook("left");
        else setLook("center");
      }

      clearTimeout(lookTimeoutRef.current);
      lookTimeoutRef.current = setTimeout(() => {
        setLook("center");
      }, 2000);
    };

    window.addEventListener("pointermove", handleGlobalPointerMove);
    return () => window.removeEventListener("pointermove", handleGlobalPointerMove);
  }, []);

  // Main Canvas Render + Physics Loop
  useEffect(() => {
    handleResize();
    window.addEventListener("resize", handleResize);

    const render = (now: number) => {
      if (!startTimeRef.current) startTimeRef.current = now;
      const elapsed = now - startTimeRef.current;

      const canvas = canvasRef.current;
      const container = containerRef.current;
      if (canvas && container) {
        const ctx = canvas.getContext("2d");
        const width = container.clientWidth;
        const height = container.clientHeight;

        if (ctx && width > 0 && height > 0) {
          const dpr = canvas.width / width;
          ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
          ctx.clearRect(0, 0, width, height);

          // Color palette from 9k.school + FameX neon accent
          const colors = {
            faint: "#ffffff",
            warm: "#e85a02", // amber/orange
            cool: "#2fb161", // emerald green
            accent: "#a6f45d", // lime green
            planet: "#f5f5f5",
          };

          // 1. Draw Planets (Dotted pixels, opacity 0.35 with gentle zero-g float)
          ctx.globalAlpha = 0.35;
          ctx.fillStyle = colors.planet;
          const planetFloatY = Math.sin(elapsed / 3800) * 2.5;
          const planetFloatX = Math.cos(elapsed / 5400) * 1.8;
          for (const p of planetsRef.current) {
            ctx.fillRect(p.x + planetFloatX, p.y + planetFloatY, 2, 2);
          }

          // 2. Draw Stars (Swimming gracefully through space & Twinkling)
          for (const s of starsRef.current) {
            const alpha = getTwinkle(s, elapsed);

            // Continuous cosmic drift + undulating swimming wave
            const swimX = Math.cos(elapsed * s.swayFreq + s.swayPhase) * s.swayAmp;
            const swimY = Math.sin(elapsed * s.swayFreq * 0.85 + s.swayPhase) * (s.swayAmp * 0.7);

            const curX = wrapMargin(s.x + s.vx * elapsed + swimX, width, 12);
            const curY = wrapMargin(s.y + s.vy * elapsed + swimY, height, 12);

            ctx.globalAlpha = s.tone === "faint" ? alpha * 0.45 : alpha * 0.9;
            ctx.fillStyle = colors[s.tone];
            const size = s.tone === "faint" ? 2 : 3;
            ctx.fillRect(curX, curY, size, size);
          }

          // 3. Subtle shooting stars gliding across the cosmos
          const shootPeriod = 7500;
          const shootDuration = 650;
          const cycleTime = elapsed % shootPeriod;
          if (cycleTime < shootDuration) {
            const progress = cycleTime / shootDuration;
            const cycleIndex = Math.floor(elapsed / shootPeriod);
            const shootRng = seededRandom(cycleIndex * 6271);
            const startX = shootRng() * (width * 0.75);
            const startY = shootRng() * (height * 0.45);
            const distance = 160;
            const sx = startX + progress * distance * 1.3;
            const sy = startY + progress * distance * 0.65;

            const shootAlpha = Math.sin(progress * Math.PI) * 0.65;
            ctx.globalAlpha = shootAlpha;
            ctx.fillStyle = colors.accent;
            ctx.fillRect(sx, sy, 3, 2);
            ctx.globalAlpha = shootAlpha * 0.45;
            ctx.fillRect(sx - 3, sy - 1.5, 3, 2);
            ctx.globalAlpha = shootAlpha * 0.2;
            ctx.fillRect(sx - 6, sy - 3, 3, 1);
          }

          // 4. Draw Burst Particles (from clicking Nino)
          burstsRef.current = burstsRef.current.filter((b) => elapsed - b.born < 700);
          for (const b of burstsRef.current) {
            const age = elapsed - b.born;
            const progress = age / 700;
            ctx.globalAlpha = Math.max(0, 1 - progress);
            ctx.fillStyle = colors[b.tone];
            const px = Math.round((b.x + b.vx * age) / 4) * 4;
            const py = Math.round((b.y + b.vy * age) / 4) * 4;
            ctx.fillRect(px, py, 4, 4);
          }

          ctx.globalAlpha = 1;
        }

        // 4. Update Nino Flight Position
        const flight = flightRef.current;
        const button = buttonRef.current;
        const stage = stageRef.current;
        const physics = physicsRef.current;
        const stageWidth = stage ? stage.clientWidth : width;
        const stageHeight = stage ? stage.clientHeight : 180;

        if (flight && button) {
          if (!isDetached) {
            // At home in the footer stage: track stage position with natural page scroll + drift
            if (stage) {
              const sRect = stage.getBoundingClientRect();
              const drift = getDriftOffset(elapsed, stageWidth, stageHeight, button.offsetHeight);
              const curX = sRect.left + sRect.width / 2 - 36 + drift.x;
              const curY = sRect.top + sRect.height / 2 - 36 + drift.y;
              physics.pos = { x: curX, y: curY };
              flight.style.transform = `translate(${curX.toFixed(1)}px, ${curY.toFixed(1)}px) rotate(${drift.tilt.toFixed(2)}deg)`;
            }
          } else {
            // Detached: free to fly across the entire page & viewport!
            if (physics.mode === "flying") {
              physics.pos.x += physics.velocity.vx;
              physics.pos.y += physics.velocity.vy;
              physics.velocity.vx *= 0.978;
              physics.velocity.vy *= 0.978;

              // Bounds: entire screen viewport
              const bWidth = button.offsetWidth || 64;
              const bHeight = button.offsetHeight || 64;
              const minX = 12;
              const maxX = window.innerWidth - bWidth - 12;
              const minY = 12;
              const maxY = window.innerHeight - bHeight - 12;

              if (physics.pos.x < minX) {
                physics.pos.x = minX;
                physics.velocity.vx = -physics.velocity.vx * 0.72;
              } else if (physics.pos.x > maxX) {
                physics.pos.x = maxX;
                physics.velocity.vx = -physics.velocity.vx * 0.72;
              }

              if (physics.pos.y < minY) {
                physics.pos.y = minY;
                physics.velocity.vy = -physics.velocity.vy * 0.72;
              } else if (physics.pos.y > maxY) {
                physics.pos.y = maxY;
                physics.velocity.vy = -physics.velocity.vy * 0.72;
              }

              flight.style.transform = `translate(${physics.pos.x.toFixed(1)}px, ${physics.pos.y.toFixed(1)}px)`;

              if (Math.hypot(physics.velocity.vx, physics.velocity.vy) < 0.25) {
                physics.mode = "drifting";
                physics.anchorPos = { x: physics.pos.x, y: physics.pos.y };
                setIsAirborne(false);
              }
            } else if (physics.mode === "drifting") {
              const sin = (p: number) => Math.sin((2 * Math.PI * elapsed) / p);
              const driftX = (physics.anchorPos?.x ?? physics.pos.x) + 8 * sin(9000);
              const driftY = (physics.anchorPos?.y ?? physics.pos.y) + 6 * sin(6000);
              const tilt = 4 * sin(4000);
              flight.style.transform = `translate(${driftX.toFixed(1)}px, ${driftY.toFixed(1)}px) rotate(${tilt.toFixed(2)}deg)`;
            } else if (physics.mode === "returning") {
              if (stage) {
                const sRect = stage.getBoundingClientRect();
                const targetX = sRect.left + sRect.width / 2 - 36;
                const targetY = sRect.top + sRect.height / 2 - 36;
                const dx = targetX - physics.pos.x;
                const dy = targetY - physics.pos.y;
                const dist = Math.hypot(dx, dy);

                if (dist < 8) {
                  physics.pos = { x: targetX, y: targetY };
                  physics.mode = "drifting";
                  setIsDetached(false);
                  setIsAirborne(false);
                } else {
                  physics.pos.x += dx * 0.14;
                  physics.pos.y += dy * 0.14;
                  flight.style.transform = `translate(${physics.pos.x.toFixed(1)}px, ${physics.pos.y.toFixed(1)}px)`;
                }
              } else {
                setIsDetached(false);
                physics.mode = "drifting";
                setIsAirborne(false);
              }
            }
          }
        }
      }

      rafRef.current = requestAnimationFrame(render);
    };

    rafRef.current = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", handleResize);
    };
  }, [handleResize, isDetached]);

  // Click / Boop Nino
  const handleBoop = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isDetached) {
      startAutoReturnTimer();
    }
    boopCountRef.current += 1;
    const nextExpr = EXPRESSIONS[boopCountRef.current % EXPRESSIONS.length];
    setExpression(nextExpr);

    // Spin animation
    setIsSpinning(false);
    requestAnimationFrame(() => setIsSpinning(true));

    // Particle burst on canvas if in footer
    const container = containerRef.current;
    const button = buttonRef.current;
    if (container && button) {
      const cRect = container.getBoundingClientRect();
      const bRect = button.getBoundingClientRect();
      const originX = bRect.left - cRect.left + bRect.width / 2;
      const originY = bRect.top - cRect.top + bRect.height / 2;

      const rng = seededRandom(boopCountRef.current);
      const newParticles: BurstParticle[] = Array.from({ length: 14 }, (_, i) => {
        const angle = (2 * Math.PI * i) / 14 + (rng() - 0.5) * 0.4;
        const speed = 0.08 + rng() * 0.14;
        return {
          x: originX,
          y: originY,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          tone: i % 2 === 0 ? "warm" : "cool",
          born: performance.now() - startTimeRef.current,
        };
      });

      burstsRef.current.push(...newParticles);
    }

    clearTimeout(exprTimeoutRef.current);
    exprTimeoutRef.current = setTimeout(() => {
      setExpression("idle");
      setIsSpinning(false);
    }, 1500);
  };

  // Pointer Dragging & Throwing anywhere across the page
  const handlePointerDown = (e: React.PointerEvent) => {
    if (e.button !== 0) return;
    const button = buttonRef.current;
    if (!button) return;

    cancelAutoReturnTimer();
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    const bRect = button.getBoundingClientRect();
    physicsRef.current.mode = "dragging";
    physicsRef.current.pos = { x: bRect.left, y: bRect.top };
    physicsRef.current.dragOffset = {
      x: e.clientX - bRect.left,
      y: e.clientY - bRect.top,
    };
    physicsRef.current.history = [{ x: e.clientX, y: e.clientY, t: performance.now() }];
    setIsAirborne(true);
    setIsDetached(true);
  };

  const handleDragMove = (e: React.PointerEvent) => {
    if (physicsRef.current.mode !== "dragging") return;
    const currentX = e.clientX - physicsRef.current.dragOffset.x;
    const currentY = e.clientY - physicsRef.current.dragOffset.y;

    physicsRef.current.pos = { x: currentX, y: currentY };
    const flight = flightRef.current;
    if (flight) {
      flight.style.transform = `translate(${currentX.toFixed(1)}px, ${currentY.toFixed(1)}px)`;
    }

    const now = performance.now();
    physicsRef.current.history.push({ x: e.clientX, y: e.clientY, t: now });
    physicsRef.current.history = physicsRef.current.history.filter((h) => now - h.t <= 90);
  };

  const handlePointerUp = () => {
    if (physicsRef.current.mode !== "dragging") return;
    const history = physicsRef.current.history;

    if (history.length >= 2) {
      const first = history[0];
      const last = history[history.length - 1];
      const dt = last.t - first.t;
      if (dt > 10) {
        physicsRef.current.velocity = {
          vx: Math.max(-24, Math.min(24, ((last.x - first.x) / dt) * 16)),
          vy: Math.max(-24, Math.min(24, ((last.y - first.y) / dt) * 16)),
        };
        physicsRef.current.mode = "flying";
        startAutoReturnTimer();
        return;
      }
    }

    physicsRef.current.mode = "drifting";
    physicsRef.current.anchorPos = { x: physicsRef.current.pos.x, y: physicsRef.current.pos.y };
    setIsAirborne(false);
    startAutoReturnTimer();
  };

  const flightElement = (
    <div
      ref={flightRef}
      className={`i9k-nino-sky__flight${isAirborne ? " i9k-nino-sky__flight--airborne" : ""}${isDetached ? " i9k-nino-sky__flight--detached" : ""}`}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        zIndex: 99999,
        pointerEvents: "none",
        willChange: "transform",
      }}
    >
      <div
        className="i9k-nino-sky__flight-inner"
        style={{ display: "flex", flexDirection: "column", alignItems: "center" }}
      >
        <button
          ref={buttonRef}
          type="button"
          className={`i9k-nino-sky__nino${isSpinning ? " i9k-nino-sky__nino--spin" : ""}`}
          aria-label="سلّم على نينو"
          onClick={handleBoop}
          onDoubleClick={returnHome}
          onPointerDown={handlePointerDown}
          onPointerMove={handleDragMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
        >
          <svg
            className={`i9k-nino i9k-nino--${expression} i9k-nino--look-${look} i9k-nino--lg i9k-nino--animated`}
            viewBox="0 0 64 64"
            shapeRendering="crispEdges"
            focusable="false"
            aria-hidden="true"
          >
            <g className="i9k-nino__stage" data-nino-part="stage">
              <g className="i9k-nino__figure" data-nino-part="figure">
                {/* Legs and Feet */}
                <rect className="i9k-nino__body" data-nino-part="leg" x="20" y="48" width="4" height="2" />
                <rect className="i9k-nino__body" data-nino-part="leg" x="40" y="48" width="4" height="2" />
                <rect className="i9k-nino__body" data-nino-part="foot" x="16" y="50" width="12" height="6" />
                <rect className="i9k-nino__body" data-nino-part="foot" x="36" y="50" width="12" height="6" />

                {/* Upper Body (Breathing Animated Group) */}
                <g className="i9k-nino__upper" data-nino-part="upper">
                  {/* Arms */}
                  <g className="i9k-nino__arm i9k-nino__arm--left">
                    <rect className="i9k-nino__body" data-nino-part="arm" x="2" y="24" width="6" height="14" />
                  </g>
                  <g className="i9k-nino__arm i9k-nino__arm--right">
                    <rect className="i9k-nino__body" data-nino-part="arm" x="56" y="24" width="6" height="14" />
                  </g>

                  {/* Antenna */}
                  <rect className="i9k-nino__body" data-nino-part="antenna-stem" x="30" y="4" width="4" height="4" />
                  <rect className="i9k-nino__antenna" data-nino-part="antenna" x="28" y="0" width="8" height="4" />

                  {/* TV Robot Head Outer Shell */}
                  <path
                    className="i9k-nino__body"
                    data-nino-part="head"
                    d="M10 8H54V10H56V46H54V48H10V46H8V10H10Z"
                  />

                  {/* TV Inner Screen */}
                  <path
                    className="i9k-nino__screen"
                    data-nino-part="screen"
                    d="M14 12H50V14H52V42H50V44H14V42H12V14H14Z"
                  />

                  {/* Screen Glint Corner Reflection */}
                  <path
                    className="i9k-nino__glint"
                    data-nino-part="glint"
                    d="M14 14H18V16H16V18H14V14Z"
                  />

                  {/* Eyes (Look Direction Controlled) */}
                  <g className="i9k-nino__eyes" data-nino-part="eyes">
                    <rect className="i9k-nino__eye" data-nino-part="eye" x="18" y="16" width="12" height="12" />
                    <rect className="i9k-nino__eye" data-nino-part="eye" x="34" y="16" width="12" height="12" />
                  </g>

                  {/* Smiling Mouth */}
                  <path
                    className="i9k-nino__mouth"
                    data-nino-part="mouth"
                    d="M18 32H22V34H42V32H46V36H44V38H40V40H24V38H20V36H18Z"
                  />
                </g>
              </g>
            </g>
          </svg>
        </button>
      </div>
    </div>
  );

  return (
    <div
      ref={containerRef}
      className="i9k-nino-sky i9k-nino-sky--integrated"
      aria-label="سماء نينو الفضائية التفاعلية"
    >
      <canvas ref={canvasRef} className="i9k-nino-sky__canvas" aria-hidden="true" />

      {children && <div className="i9k-nino-sky__content">{children}</div>}

      <div ref={stageRef} className="i9k-nino-sky__stage" />

      {mounted && typeof document !== "undefined"
        ? createPortal(flightElement, document.body)
        : null}
    </div>
  );
}
