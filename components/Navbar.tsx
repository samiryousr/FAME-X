"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

const links = [
  { href: "#home", label: "الرئيسية" },
  { href: "#about", label: "من نحن" },
  { href: "#services", label: "خدماتنا" },
  { href: "#projects", label: "أعمالنا" },
];

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

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
      ".section__heading, .card:not(.services__card), .project-card, .contact__panel",
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
          <Image
            className="navbar__mark"
            src="/famex-symbol.svg"
            alt=""
            width={44}
            height={38}
            priority
          />
          <span className="navbar__brand-copy">
            <span className="brand-wordmark" dir="ltr">
              FAME<span className="brand-wordmark__accent">X</span>
            </span>
            <span className="navbar__brand-caption" dir="ltr">
              DIGITAL PLAYERS
            </span>
          </span>
        </a>
        <div
          className={`navbar__links${isMenuOpen ? " navbar__links--open" : ""}`}
          id="primary-navigation"
        >
          {links.map((link) => (
            <a key={link.href} href={link.href} onClick={() => setIsMenuOpen(false)}>
              {link.label}
            </a>
          ))}
        </div>
        <span className="navbar__availability">
          <span className="navbar__cta-dot" aria-hidden="true" />
          متاحون لمشاريع جديدة
        </span>
        <a className="navbar__cta" href="#contact">
          ابدأ مشروعك
        </a>
        <button
          className="navbar__menu-toggle"
          type="button"
          aria-label={isMenuOpen ? "إغلاق القائمة" : "فتح القائمة"}
          aria-expanded={isMenuOpen}
          aria-controls="primary-navigation"
          onClick={() => setIsMenuOpen((open) => !open)}
        >
          <span />
          <span />
          <span />
        </button>
      </nav>
    </header>
  );
}
