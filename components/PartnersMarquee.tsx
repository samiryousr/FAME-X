"use client";

import { useEffect, useState, useMemo } from "react";
import Image from "next/image";
import {
  subscribeToPartners,
  type Partner,
} from "@/lib/partnersService";

export default function PartnersMarquee() {
  const [partners, setPartners] = useState<Partner[]>([]);
  const [loaded, setLoaded] = useState(false);

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
    // Repeat items until at least 8-12 items are in a set
    const repeatCount = Math.ceil(10 / partners.length);
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

  return (
    <section
      className="partners-section py-10 sm:py-14 relative z-10 overflow-hidden"
      id="partners"
      aria-label="شركاء النجاح"
    >
      <div className="container mb-6 sm:mb-8 text-center">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#0d1f12]/80 border border-[#203c26] text-[#a6f45d] text-[11px] font-mono tracking-wider mb-2.5 shadow-sm">
          <span className="w-1.5 h-1.5 rounded-full bg-[#a6f45d] animate-pulse" />
          <span>{"// TRUSTED BY // شركاء وثقوا بنا"}</span>
        </div>
        <p className="text-xs sm:text-sm text-[#7d9b7f] font-medium max-w-md mx-auto">
          علامات تجارية وكيانات رقمية اختارت FAME-X لتطوير أفكارها ومشاريعها
        </p>
      </div>

      {/* Infinite Seamless Marquee */}
      <div className="partners-marquee w-full select-none" dir="ltr">
        <div className="partners-marquee__track">
          {/* Set 1 */}
          <div className="partners-marquee__set">
            {displayList.map((partner, idx) => (
              <PartnerCard key={`set1-${partner.id}-${idx}`} partner={partner} />
            ))}
          </div>

          {/* Set 2 (Duplicate for 100% Seamless Loop) */}
          <div className="partners-marquee__set" aria-hidden="true">
            {displayList.map((partner, idx) => (
              <PartnerCard key={`set2-${partner.id}-${idx}`} partner={partner} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function PartnerCard({ partner }: { partner: Partner }) {
  const content = (
    <div
      className="relative flex items-center justify-center h-16 sm:h-20 px-6 sm:px-8 py-2.5 rounded-2xl bg-[#09150d]/80 border border-[#1b3420] hover:border-[#a6f45d]/60 hover:bg-[#0f2416] hover:shadow-[0_0_24px_rgba(166,244,93,0.18)] transition-all duration-300 group/partner shrink-0 cursor-pointer backdrop-blur-xs"
      title={partner.name}
    >
      <Image
        src={partner.logoUrl}
        alt={partner.name}
        width={140}
        height={50}
        className="max-h-8 sm:max-h-10 max-w-[110px] sm:max-w-[140px] w-auto h-auto object-contain filter grayscale opacity-60 group-hover/partner:grayscale-0 group-hover/partner:opacity-100 group-hover/partner:scale-105 transition-all duration-300 drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]"
      />
    </div>
  );

  if (partner.websiteUrl) {
    return (
      <a
        href={partner.websiteUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-block"
        aria-label={partner.name}
      >
        {content}
      </a>
    );
  }

  return content;
}
