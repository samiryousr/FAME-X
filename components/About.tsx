"use client";

import { useEffect, useRef } from "react";
import type { CSSProperties } from "react";

const aboutCopy =
  "نحن فريق شغوف بالتقنية والتصميم، نعمل مع أصحاب المشاريع لتحويل طموحاتهم إلى تجارب رقمية واضحة وسهلة الاستخدام. نبدأ بالاستماع، ونكمل معك خطوة بخطوة حتى يصبح لكل فكرة مكانها الصحيح.";

const aboutWords = aboutCopy.split(/(\s+)/);

const aboutStats = [
  { value: "03", label: "خدمات رقمية" },
  { value: "03", label: "نماذج أعمال" },
  { value: "01", label: "رحلة متكاملة" },
];

export default function About() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    let animationFrame = 0;
    const numberObserver =
      "IntersectionObserver" in window
        ? new IntersectionObserver(
            (entries) => {
              if (entries.some((entry) => entry.isIntersecting)) {
                section.dataset.numbersReady = "true";
                numberObserver?.disconnect();
              }
            },
            { threshold: 0.1 },
          )
        : null;
    numberObserver?.observe(section);
    if (!numberObserver) section.dataset.numbersReady = "true";

    const updateProgress = () => {
      cancelAnimationFrame(animationFrame);
      animationFrame = requestAnimationFrame(() => {
        const scrollRange = Math.max(
          section.offsetHeight - window.innerHeight,
          1,
        );
        const progress = Math.min(
          1,
          Math.max(0, -section.getBoundingClientRect().top / scrollRange),
        );
        const words = section.querySelectorAll<HTMLElement>("[data-about-word]");
        words.forEach((word, index) => {
          const wordProgress = Math.min(
            1,
            Math.max(0, progress * words.length - index),
          );
          word.style.setProperty("--word-reveal-progress", `${wordProgress * 100}%`);
        });
      });
    };

    updateProgress();
    window.addEventListener("scroll", updateProgress, { passive: true });
    window.addEventListener("resize", updateProgress);

    return () => {
      numberObserver?.disconnect();
      cancelAnimationFrame(animationFrame);
      window.removeEventListener("scroll", updateProgress);
      window.removeEventListener("resize", updateProgress);
    };
  }, []);

  return (
    <section
      className="section section--muted about"
      id="about"
      ref={sectionRef}
    >
      <div className="container about__layout">
        <p className="eyebrow">من نحن</p>
        <h2 className="section__title">نؤمن أن التفاصيل تصنع فرقًا.</h2>
        <p className="about__text">
          {aboutWords.map((word, index) =>
            /\s+/.test(word) ? (
              word
            ) : (
              <span data-about-word key={index}>
                {word}
              </span>
            ),
          )}
        </p>
        <p className="about__note">تفكير استراتيجي، تنفيذ متقن، وشراكة حقيقية.</p>
        <div className="about__stats" aria-label="أرقامنا">
          {aboutStats.map(({ value, label }) => (
            <div
              className="about__stat"
              key={label}
              role="group"
              aria-label={`${value} ${label}`}
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
              </span>
              <span className="about__stat-label">{label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
