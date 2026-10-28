"use client";

import { useEffect, useRef } from "react";
import type { CSSProperties } from "react";
import StoryDialogue from "@/components/StoryDialogue";

export default function About() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const numberObserver =
      "IntersectionObserver" in window
        ? new IntersectionObserver(
            (entries) => {
              if (entries.some((entry) => entry.isIntersecting)) {
                section.dataset.numbersReady = "true";
                numberObserver?.disconnect();
              }
            },
            { threshold: 0.15 },
          )
        : null;
    numberObserver?.observe(section);
    if (!numberObserver) section.dataset.numbersReady = "true";

    return () => {
      numberObserver?.disconnect();
    };
  }, []);

  const aboutStats = [
    { value: "04", suffix: "", label: "مراحل العمل والإنتاج" },
    { value: "10", suffix: "+", label: "منصات ويب و تطبيقات موبايل" },
    { value: "15", suffix: "+", label: "خدمات وحلول رقمية" },
    { value: "50", suffix: "+", label: "مشروع ناجح تم تنفيذه" },
  ];

  return (
    <section
      className="section section--muted about"
      id="about"
      ref={sectionRef}
    >
      <div className="container about__layout">
        <p className="eyebrow">حكايتنا ومين إحنا</p>
        <h2 className="section__title">التفاصيل الصغيرة هي اللي بتصنع البيزنس الكبير.</h2>

        {/* 🕹️ Retro RPG Story Mode Dialogue Stage (طور القصة) */}
        <StoryDialogue />

        <div className="about__stats" aria-label="أرقامنا">
          {aboutStats.map(({ value, suffix, label }) => (
            <div
              className="about__stat"
              key={label}
              role="group"
              aria-label={`${value}${suffix} ${label}`}
            >
              <span className="about__stat-value" dir="ltr" aria-hidden="true">
                {value.split("").map((digit, index) => (
                  <span className="about__stat-digit-window" key={index}>
                    <span
                      className="about__stat-digit-reel"
                      style={
                        {
                          "--digit-roll": `${-(20 + Number(digit))}em`,
                        } as CSSProperties
                      }
                    >
                      {Array.from({ length: 30 }, (_, reelIndex) => (
                        <span key={reelIndex}>{reelIndex % 10}</span>
                      ))}
                    </span>
                  </span>
                ))}
                {suffix && <span className="about__stat-suffix">{suffix}</span>}
              </span>
              <span className="about__stat-label">{label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
