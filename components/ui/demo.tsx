"use client";

import React, { useState, useEffect, useRef } from "react";
import { DotPattern } from "@/components/ui/dot-pattern";
import { cn } from "@/lib/utils";

interface DotPatternDemoProps {
  className?: string;
  title?: string;
  glowRadius?: number;
}

export function DotPatternDemo({
  className,
  title = "Dot Pattern",
  glowRadius = 350,
}: DotPatternDemoProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mousePosition, setMousePosition] = useState<{ x: number; y: number }>({
    x: 0,
    y: 0,
  });
  const [isMounted, setIsMounted] = useState(false);

  // Initialize mouse position to center on initial render
  useEffect(() => {
    setIsMounted(true);
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      setMousePosition({
        x: rect.width / 2,
        y: rect.height / 2,
      });
    }
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    setMousePosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className={cn(
        "relative flex h-[500px] w-full flex-col items-center justify-center overflow-hidden rounded-xl border border-neutral-800 bg-[#09090b] shadow-2xl",
        className,
      )}
    >
      <p className="pointer-events-none z-10 select-none text-center text-5xl font-medium tracking-tighter text-white">
        {title}
      </p>

      {/* Dot Pattern with cursor-following radial mask */}
      <DotPattern
        width={24}
        height={24}
        cx={1}
        cy={1}
        cr={1}
        className={cn("fill-neutral-400/50 transition-opacity duration-150")}
        style={{
          maskImage: isMounted
            ? `radial-gradient(${glowRadius}px circle at ${mousePosition.x}px ${mousePosition.y}px, white, transparent)`
            : "radial-gradient(350px circle at center, white, transparent)",
          WebkitMaskImage: isMounted
            ? `radial-gradient(${glowRadius}px circle at ${mousePosition.x}px ${mousePosition.y}px, white, transparent)`
            : "radial-gradient(350px circle at center, white, transparent)",
        }}
      />
    </div>
  );
}

export { DotPatternDemo as default };
