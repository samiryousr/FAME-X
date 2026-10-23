"use client";

import { useEffect, useState } from "react";

const links = [
  { href: "#about", label: "من نحن" },
  { href: "#services", label: "خدماتنا" },
  { href: "#projects", label: "أعمالنا" },
];

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const updateScrollState = () => setIsScrolled(window.scrollY > 32);
    updateScrollState();
    window.addEventListener("scroll", updateScrollState, { passive: true });

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    );
    if (prefersReducedMotion.matches || !("IntersectionObserver" in window)) {
      return () => window.removeEventListener("scroll", updateScrollState);
    }

    const revealTargets = document.querySelectorAll<HTMLElement>(
      ".section__heading, .about__layout, .card, .project-card, .contact__panel",
    );
    if (revealTargets.length === 0) {
      return () => window.removeEventListener("scroll", updateScrollState);
    }

    document.body.classList.add("scroll-reveal-ready");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("scroll-revealed");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -36px 0px" },
    );
    revealTargets.forEach((target) => observer.observe(target));

    return () => {
      window.removeEventListener("scroll", updateScrollState);
      observer.disconnect();
      document.body.classList.remove("scroll-reveal-ready");
      revealTargets.forEach((target) =>
        target.classList.remove("scroll-revealed"),
      );
    };
  }, []);

  return (
    <header className={`navbar${isScrolled ? " navbar--scrolled" : ""}`}>
      <nav className="container navbar__inner" aria-label="التنقل الرئيسي">
        <a className="navbar__brand" href="#home" aria-label="Famex - الرئيسية">
          <span className="navbar__mark" aria-hidden="true">
            FX
          </span>
          <span className="navbar__brand-copy">
            <span className="brand-wordmark" dir="ltr">
              FAME<span className="brand-wordmark__accent">X</span>
            </span>
            <span className="navbar__brand-caption" dir="ltr">
              DIGITAL PLAYERS
            </span>
          </span>
        </a>
        <div className="navbar__links">
          {links.map((link) => (
            <a key={link.href} href={link.href}>
              {link.label}
            </a>
          ))}
        </div>
        <a className="navbar__cta" href="#contact">
          <span className="navbar__cta-dot" aria-hidden="true" />
          لنتحدث
        </a>
      </nav>
    </header>
  );
}
