import { ArrowLeft, Layers3, Sparkles } from "lucide-react";

export default function Hero() {
  return (
    <section className="hero" id="home">
      <div className="container hero__layout">
        <div className="hero__copy">
          <p className="hero__eyebrow">
            <span className="hero__eyebrow-dot" aria-hidden="true" />
            <span>شريكك في النمو الرقمي</span>
            <span className="hero__eyebrow-tag" dir="ltr">
              LEVEL UP
            </span>
          </p>
          <h1 className="hero__title">
            أفكارك تستحق
            <span className="hero__title-accent">حضورًا مختلفًا.</span>
          </h1>
          <p className="hero__tagline">
            نصنع تجارب رقمية مدروسة تجمع بين الإبداع والتقنية، وتساعد علامتك
            التجارية على الوصول بثقة إلى الخطوة التالية.
          </p>
          <div className="hero__actions">
            <a className="button" href="#contact">
              ابدأ مشروعك
              <ArrowLeft size={18} aria-hidden="true" />
            </a>
            <a className="button button--secondary" href="#services">
              اكتشف خدماتنا
            </a>
          </div>
          <div className="hero__meta" aria-label="مراحل العمل">
            <span>
              <i aria-hidden="true" /> تخطيط
            </span>
            <span>
              <i aria-hidden="true" /> تصميم
            </span>
            <span>
              <i aria-hidden="true" /> إطلاق
            </span>
          </div>
        </div>

        <div className="hero__visual" aria-hidden="true">
          <div className="arcade-machine">
            <div className="arcade-machine__topline">
              <span>FAME-X // ARCADE STUDIO</span>
              <span className="arcade-machine__live">
                <i /> READY
              </span>
            </div>
            <div className="arcade-machine__marquee">
              <span className="arcade-machine__spark">✦</span>
              <span className="brand-wordmark" dir="ltr">
                FAME<span className="brand-wordmark__accent">X</span>
              </span>
              <span className="arcade-machine__spark">✦</span>
            </div>
            <div className="arcade-machine__screen">
              <div className="arcade-machine__screen-grid" />
              <span className="arcade-machine__screen-label" dir="ltr">
                PLAYER 01
              </span>
              <div className="arcade-machine__pixel-art">
                <span />
                <span />
                <span />
              </div>
              <span className="arcade-machine__screen-message">
                فكرتك، المرحلة القادمة
              </span>
              <span className="arcade-machine__prompt" dir="ltr">
                PRESS START <i />
              </span>
            </div>
            <div className="arcade-machine__controls">
              <div className="arcade-machine__joystick">
                <i />
              </div>
              <div className="arcade-machine__control-label" dir="ltr">
                INSERT
                <br />
                YOUR IDEA
              </div>
              <div className="arcade-machine__buttons">
                <i />
                <i />
                <i />
              </div>
            </div>
            <div className="arcade-machine__base">
              <span>BUILT TO PLAY. MADE TO GROW.</span>
            </div>
          </div>
          <div className="hero__float-card hero__float-card--top">
            <span className="hero__float-icon">
              <Sparkles size={19} />
            </span>
            <p>
              إبداع يصنع الفرق
              <span>أفكار تتحول إلى واقع</span>
            </p>
          </div>
          <div className="hero__float-card hero__float-card--bottom">
            <span className="hero__float-icon">
              <Layers3 size={19} />
            </span>
            <p>
              تجربة متكاملة
              <span>من الفكرة إلى الإطلاق</span>
            </p>
          </div>
        </div>
      </div>
      <a className="hero__scroll" href="#about">
        <span className="hero__scroll-line" />
        <span>اكتشف المزيد</span>
        <span className="hero__scroll-key" dir="ltr">
          ↓
        </span>
      </a>
    </section>
  );
}
