"use client";

import { useEffect, useState, useMemo, useRef, useCallback } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import {
  subscribeToPartners,
  type Partner,
} from "@/lib/partnersService";

export default function PartnersMarquee() {
  const [partners, setPartners] = useState<Partner[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [isGrabbing, setIsGrabbing] = useState(false);

  const trackRef = useRef<HTMLDivElement>(null);
  const offsetRef = useRef(0);
  const isDraggingRef = useRef(false);
  const dragStartXRef = useRef(0);
  const dragStartOffsetRef = useRef(0);
  const hasDraggedRef = useRef(false);
  const isHoveredRef = useRef(false);
  const reqIdRef = useRef<number | null>(null);

  useEffect(() => {
    const unsubscribe = subscribeToPartners((list) => {
      setPartners(list);
      setLoaded(true);
    }, true); // onlyVisible = true

    return () => unsubscribe();
  }, []);

  // Duplicate items to ensure smooth infinite marquee across all screen sizes
  const displayList = useMemo(() => {
    if (partners.length === 0) return [];
    if (partners.length >= 8) return partners;
    const repeatCount = Math.ceil(12 / partners.length);
    const repeated: Partner[] = [];
    for (let i = 0; i < repeatCount; i++) {
      repeated.push(...partners);
    }
    return repeated;
  }, [partners]);

  // Seamless 60FPS / 120FPS Animation & Drag Engine
  useEffect(() => {
    const track = trackRef.current;
    if (!track || displayList.length === 0) return;

    let lastTime = performance.now();

    const renderLoop = (time: number) => {
      const dt = Math.min((time - lastTime) / 1000, 0.1);
      lastTime = time;

      const halfWidth = track.scrollWidth / 2;

      if (halfWidth > 50) {
        if (!isDraggingRef.current) {
          // Normal auto-scroll speed: 36px/sec; slow down to 10px/sec when hovered
          const speed = isHoveredRef.current ? 10 : 36;
          offsetRef.current -= speed * dt;
        }

        // Infinite loop wrap: seamless jump by halfWidth
        while (offsetRef.current <= -halfWidth) {
          offsetRef.current += halfWidth;
          dragStartOffsetRef.current += halfWidth;
        }
        while (offsetRef.current > 0) {
          offsetRef.current -= halfWidth;
          dragStartOffsetRef.current -= halfWidth;
        }

        track.style.transform = `translate3d(${offsetRef.current}px, 0, 0)`;
      }

      reqIdRef.current = requestAnimationFrame(renderLoop);
    };

    reqIdRef.current = requestAnimationFrame(renderLoop);

    return () => {
      if (reqIdRef.current) {
        cancelAnimationFrame(reqIdRef.current);
      }
    };
  }, [displayList]);

  // Pointer Drag Handlers (Mouse, Touch, Stylus)
  const handlePointerDown = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    if (e.button !== 0 && e.pointerType === "mouse") return;
    isDraggingRef.current = true;
    hasDraggedRef.current = false;
    dragStartXRef.current = e.clientX;
    dragStartOffsetRef.current = offsetRef.current;
    setIsGrabbing(true);

    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch {
      // Ignore fallback if capture unsupported
    }
  }, []);

  const handlePointerMove = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDraggingRef.current) return;
    const deltaX = e.clientX - dragStartXRef.current;
    if (Math.abs(deltaX) > 5) {
      hasDraggedRef.current = true;
    }
    offsetRef.current = dragStartOffsetRef.current + deltaX;
  }, []);

  const handlePointerUp = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDraggingRef.current) return;
    isDraggingRef.current = false;
    setIsGrabbing(false);
    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch {
      // Ignore fallback
    }
  }, []);

  // Arrow Button Nudge
  const handleNudge = useCallback((direction: "left" | "right") => {
    const amount = direction === "left" ? -260 : 260;
    offsetRef.current += amount;
  }, []);

  // If no partners are published yet, hide section cleanly
  if (loaded && partners.length === 0) {
    return null;
  }

  if (displayList.length === 0) {
    return null;
  }

  return (
    <section className="partners-wrap select-none" id="partners" aria-label="شركاء النجاح">
      {/* Category / Section Label */}
      <div className="partners-label">
        <span className="w-2.5 h-2.5 rounded-full bg-[#a6f45d] animate-pulse shrink-0 shadow-[0_0_10px_#a6f45d]" />
        <span className="text-base sm:text-lg md:text-xl font-black text-white tracking-wide">
          شركاء وثقوا بنا
        </span>
        <span
          className="text-[11px] sm:text-xs font-mono font-bold text-[#a6f45d]/80 tracking-widest hidden sm:inline"
          dir="ltr"
        >
          {"// CLIENTS & PARTNERS"}
        </span>
      </div>

      {/* Marquee Outer Frame with Navigation Arrows */}
      <div className="marquee-outer">
        {/* Scroll Left Button */}
        <button
          type="button"
          onClick={() => handleNudge("left")}
          className="marquee-btn marquee-btn--prev"
          aria-label="التمرير لليسار"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        {/* Marquee Track Overflow with Pointer Drag Events */}
        <div
          className="marquee-overflow cursor-grab active:cursor-grabbing"
          onMouseEnter={() => {
            isHoveredRef.current = true;
          }}
          onMouseLeave={() => {
            isHoveredRef.current = false;
          }}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
        >
          <div
            ref={trackRef}
            className={`marquee-track ${isGrabbing ? "is-grabbing" : ""}`}
          >
            {/* Set A */}
            <div className="marquee-set marquee-set-a">
              {displayList.map((partner, idx) => (
                <div key={`set-a-${partner.id}-${idx}`} className="partner-logo-item">
                  <PartnerItem
                    partner={partner}
                    hasDraggedRef={hasDraggedRef}
                  />
                </div>
              ))}
            </div>

            {/* Set B (Duplicate for 100% Seamless Infinite Loop) */}
            <div className="marquee-set marquee-set-b" aria-hidden="true">
              {displayList.map((partner, idx) => (
                <div key={`set-b-${partner.id}-${idx}`} className="partner-logo-item">
                  <PartnerItem
                    partner={partner}
                    hasDraggedRef={hasDraggedRef}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Scroll Right Button */}
        <button
          type="button"
          onClick={() => handleNudge("right")}
          className="marquee-btn marquee-btn--next"
          aria-label="التمرير لليمين"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </section>
  );
}

function PartnerItem({
  partner,
  hasDraggedRef,
}: {
  partner: Partner;
  hasDraggedRef: React.RefObject<boolean>;
}) {
  const handleClick = (e: React.MouseEvent) => {
    // If the user was dragging/swiping, suppress link click so it doesn't accidentally open
    if (hasDraggedRef.current) {
      e.preventDefault();
      e.stopPropagation();
    }
  };

  const imageElement = (
    <Image
      src={partner.logoUrl}
      alt={partner.name}
      width={240}
      height={85}
      loading="lazy"
      decoding="async"
      draggable={false}
      className="pointer-events-none"
      title={partner.name}
    />
  );

  if (partner.websiteUrl) {
    return (
      <a
        href={partner.websiteUrl}
        target="_blank"
        rel="noopener noreferrer"
        onClick={handleClick}
        aria-label={partner.name}
        className="inline-flex items-center justify-center transition-transform hover:scale-105"
      >
        {imageElement}
      </a>
    );
  }

  return imageElement;
}
