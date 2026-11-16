"use client";

import { useEffect, useState, useMemo, useRef } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import {
  subscribeToPartners,
  type Partner,
} from "@/lib/partnersService";

export default function PartnersMarquee() {
  const [partners, setPartners] = useState<Partner[]>([]);
  const [loaded, setLoaded] = useState(false);
  const overflowRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

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

  // If no partners are published yet, hide section cleanly
  if (loaded && partners.length === 0) {
    return null;
  }

  if (displayList.length === 0) {
    return null;
  }

  const handleScroll = (direction: "left" | "right") => {
    if (!overflowRef.current) return;
    const amount = direction === "left" ? -280 : 280;
    overflowRef.current.scrollBy({ left: amount, behavior: "smooth" });
  };

  return (
    <section className="partners-wrap" id="partners" aria-label="شركاء النجاح">
      {/* Category / Section Label */}
      <div className="partners-label">
        <span className="w-2.5 h-2.5 rounded-full bg-[#a6f45d] animate-pulse shrink-0 shadow-[0_0_10px_#a6f45d]" />
        <span className="text-base sm:text-lg md:text-xl font-black text-white tracking-wide">
          شركاء وثقوا بنا
        </span>
        <span className="text-[11px] sm:text-xs font-mono font-bold text-[#a6f45d]/80 tracking-widest hidden sm:inline" dir="ltr">
          {"// CLIENTS & PARTNERS"}
        </span>
      </div>

      {/* Marquee Outer Frame with Navigation Arrows */}
      <div className="marquee-outer">
        {/* Scroll Left Button */}
        <button
          type="button"
          onClick={() => handleScroll("left")}
          className="marquee-btn marquee-btn--prev"
          aria-label="التمرير لليسار"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        {/* Marquee Track Overflow */}
        <div ref={overflowRef} className="marquee-overflow">
          <div ref={trackRef} className="marquee-track">
            {/* Set A */}
            <div className="marquee-set marquee-set-a">
              {displayList.map((partner, idx) => (
                <div key={`set-a-${partner.id}-${idx}`} className="partner-logo-item">
                  <PartnerItem partner={partner} />
                </div>
              ))}
            </div>

            {/* Set B (Duplicate for 100% Seamless Infinite Loop) */}
            <div className="marquee-set marquee-set-b" aria-hidden="true">
              {displayList.map((partner, idx) => (
                <div key={`set-b-${partner.id}-${idx}`} className="partner-logo-item">
                  <PartnerItem partner={partner} />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Scroll Right Button */}
        <button
          type="button"
          onClick={() => handleScroll("right")}
          className="marquee-btn marquee-btn--next"
          aria-label="التمرير لليمين"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </section>
  );
}

function PartnerItem({ partner }: { partner: Partner }) {
  const imageElement = (
    <Image
      src={partner.logoUrl}
      alt={partner.name}
      width={240}
      height={85}
      loading="lazy"
      decoding="async"
      className="cursor-pointer"
      title={partner.name}
    />
  );

  if (partner.websiteUrl) {
    return (
      <a
        href={partner.websiteUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={partner.name}
        className="inline-flex items-center justify-center transition-transform hover:scale-105"
      >
        {imageElement}
      </a>
    );
  }

  return imageElement;
}
