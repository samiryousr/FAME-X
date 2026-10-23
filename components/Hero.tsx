"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowLeft, Volume2, VolumeX } from "lucide-react";
import {
  playCoinSound,
  playSelectSound,
  playJoystickSound,
  playStartSound,
  toggleArcadeMute,
} from "@/lib/arcadeSound";

const PLAYERS = [
  { id: "gamer-boy", label: "PLAYER 01" },
  { id: "dev-girl", label: "PLAYER 02" },
  { id: "arcade-mascot", label: "PLAYER 03" },
] as const;

type PupilPosition = { x: number; y: number };

export default function Hero() {
  const characterRef = useRef<SVGSVGElement>(null);
  const playerLabelRef = useRef<HTMLSpanElement>(null);
  const activePlayerRef = useRef(0);
  const pupilTargetsRef = useRef(new Map<string, PupilPosition>());
  const pupilPositionsRef = useRef(new Map<string, PupilPosition>());
  const gazeFrameRef = useRef(0);
  const [isMuted, setIsMuted] = useState(false);

  useEffect(() => {
    const animateGaze = () => {
      gazeFrameRef.current = 0;
      const svg = characterRef.current;
      const activeAvatar = svg?.querySelector<SVGGElement>(
        `[data-player-avatar="${PLAYERS[activePlayerRef.current].id}"]`,
      );
      if (!activeAvatar) return;

      let isMoving = false;
      activeAvatar
        .querySelectorAll<SVGRectElement>("[data-player-pupil]")
        .forEach((pupil) => {
          const id = pupil.dataset.playerPupil;
          if (!id) return;

          const target = pupilTargetsRef.current.get(id) ?? { x: 0, y: 0 };
          const position = pupilPositionsRef.current.get(id) ?? { x: 0, y: 0 };
          const x = position.x + (target.x - position.x) * 0.24;
          const y = position.y + (target.y - position.y) * 0.24;
          const nextPosition =
            Math.abs(target.x - x) < 0.01 &&
            Math.abs(target.y - y) < 0.01
              ? target
              : { x, y };

          pupilPositionsRef.current.set(id, nextPosition);
          pupil.setAttribute(
            "transform",
            `translate(${nextPosition.x} ${nextPosition.y})`,
          );
          if (nextPosition !== target) isMoving = true;
        });

      if (isMoving) {
        gazeFrameRef.current = window.requestAnimationFrame(animateGaze);
      }
    };

    const queueGazeAnimation = () => {
      if (!gazeFrameRef.current) {
        gazeFrameRef.current = window.requestAnimationFrame(animateGaze);
      }
    };

    const handlePointerMove = (event: PointerEvent) => {
      const svg = characterRef.current;
      const activeAvatar = svg?.querySelector<SVGGElement>(
        `[data-player-avatar="${PLAYERS[activePlayerRef.current].id}"]`,
      );
      if (!svg || !activeAvatar) return;

      const svgBounds = svg.getBoundingClientRect();
      const unitScaleX = svgBounds.width / 96;
      const unitScaleY = svgBounds.height / 112;
      if (!unitScaleX || !unitScaleY) return;

      activeAvatar
        .querySelectorAll<SVGRectElement>("[data-player-eye]")
        .forEach((eye) => {
        const pupil = activeAvatar.querySelector<SVGRectElement>(
          `[data-player-pupil="${eye.dataset.playerEye}"]`,
        );
        if (!pupil) return;

        const eyeBounds = eye.getBoundingClientRect();
        const deltaX =
          (event.clientX - (eyeBounds.left + eyeBounds.width / 2)) /
          unitScaleX;
        const deltaY =
          (event.clientY - (eyeBounds.top + eyeBounds.height / 2)) /
          unitScaleY;
        const angle = Math.atan2(deltaY, deltaX);
        const directionX = Math.cos(angle);
        const directionY = Math.sin(angle);
        const eyeBox = eye.getBBox();
        const pupilBox = pupil.getBBox();
        const limitX =
          directionX > 0
            ? (eyeBox.x + eyeBox.width - pupilBox.x - pupilBox.width) /
              directionX
            : directionX < 0
              ? (pupilBox.x - eyeBox.x) / -directionX
              : Number.POSITIVE_INFINITY;
        const limitY =
          directionY > 0
            ? (eyeBox.y + eyeBox.height - pupilBox.y - pupilBox.height) /
              directionY
            : directionY < 0
              ? (pupilBox.y - eyeBox.y) / -directionY
              : Number.POSITIVE_INFINITY;
        const distance = Math.min(
          2.4,
          Math.hypot(deltaX, deltaY),
          limitX,
          limitY,
        );
        const id = pupil.dataset.playerPupil;
        if (!id) return;
        pupilTargetsRef.current.set(id, {
          x: directionX * distance,
          y: directionY * distance,
        });
      });
      queueGazeAnimation();
    };

    const handlePointerLeave = () => {
      pupilTargetsRef.current.forEach((_, id) => {
        pupilTargetsRef.current.set(id, { x: 0, y: 0 });
      });
      queueGazeAnimation();
    };

    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    window.addEventListener("pointerleave", handlePointerLeave);
    return () => {
      window.cancelAnimationFrame(gazeFrameRef.current);
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerleave", handlePointerLeave);
    };
  }, []);

  const selectNextPlayer = () => {
    const svg = characterRef.current;
    if (!svg) return;

    activePlayerRef.current = (activePlayerRef.current + 1) % PLAYERS.length;
    const activePlayer = PLAYERS[activePlayerRef.current];

    PLAYERS.forEach((player) => {
      const avatar = svg.querySelector<SVGGElement>(
        `[data-player-avatar="${player.id}"]`,
      );
      avatar?.setAttribute("opacity", player.id === activePlayer.id ? "1" : "0");
      avatar
        ?.querySelectorAll<SVGRectElement>("[data-player-pupil]")
        .forEach((pupil) => {
          const id = pupil.dataset.playerPupil;
          pupil.setAttribute("transform", "translate(0 0)");
          if (id) {
            pupilTargetsRef.current.set(id, { x: 0, y: 0 });
            pupilPositionsRef.current.set(id, { x: 0, y: 0 });
          }
        });
    });
    if (playerLabelRef.current) {
      playerLabelRef.current.textContent = activePlayer.label;
    }
  };

  const handleCoinInsert = () => {
    playCoinSound();
    selectNextPlayer();
  };

  const handleJoystickClick = () => {
    playJoystickSound();
    selectNextPlayer();
  };

  const handleButtonClick = () => {
    playSelectSound();
    selectNextPlayer();
  };

  const handleStartClick = () => {
    playStartSound();
  };

  const handleToggleSound = () => {
    const muted = toggleArcadeMute();
    setIsMuted(muted);
    if (!muted) {
      playSelectSound();
    }
  };

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

        <div className="hero__visual">
          <div className="arcade-cabinet" role="region" aria-label="جهاز آركيد FameX">
            {/* T-Molding Glowing Edge Trims */}
            <div className="arcade-cabinet__trim arcade-cabinet__trim--left" aria-hidden="true" />
            <div className="arcade-cabinet__trim arcade-cabinet__trim--right" aria-hidden="true" />

            {/* Marquee Canopy & Top Speakers */}
            <div className="arcade-cabinet__canopy">
              <div className="arcade-cabinet__speakers" aria-hidden="true">
                <span /><span /><span /><span />
              </div>
              <div className="arcade-machine__topline">
                <span>FAME-X // ARCADE STUDIO</span>
                <div className="arcade-cabinet__top-actions">
                  <button
                    type="button"
                    className="arcade-cabinet__audio-btn"
                    onClick={handleToggleSound}
                    title={isMuted ? "تشغيل صوت الآركيد" : "كتم صوت الآركيد"}
                    aria-label={isMuted ? "تشغيل صوت الآركيد" : "كتم صوت الآركيد"}
                  >
                    {isMuted ? <VolumeX size={12} /> : <Volume2 size={12} />}
                    <span>{isMuted ? "MUTED" : "SFX"}</span>
                  </button>
                  <span className="arcade-machine__live">
                    <i /> READY
                  </span>
                </div>
              </div>
              <div className="arcade-machine__marquee">
                <span className="arcade-machine__spark">✦</span>
                <span className="brand-wordmark" dir="ltr">
                  FAME<span className="brand-wordmark__accent">X</span>
                </span>
                <span className="arcade-machine__spark">✦</span>
              </div>
            </div>

            {/* CRT Screen Bezel Housing */}
            <div className="arcade-cabinet__bezel">
              <div className="arcade-machine__screen">
                <div className="arcade-machine__screen-grid" aria-hidden="true" />
                <div className="arcade-cabinet__crt-glare" aria-hidden="true" />
              <span
                className="arcade-machine__screen-label"
                dir="ltr"
                ref={playerLabelRef}
              >
                PLAYER 01
              </span>
              <div className="arcade-machine__character-stage" aria-hidden="true">
                <svg
                  ref={characterRef}
                  className="arcade-machine__mascot"
                  viewBox="0 0 96 112"
                  shapeRendering="crispEdges"
                >
                  <g data-player-avatar="gamer-boy" opacity="1">
                    <g className="arcade-machine__mascot-arm arcade-machine__mascot-arm--left">
                      <rect x="16" y="64" width="16" height="18" fill="#244453" />
                      <rect x="12" y="78" width="16" height="10" fill="#244453" />
                      <rect x="12" y="84" width="12" height="8" fill="#edbd96" />
                    </g>
                    <g className="arcade-machine__mascot-arm arcade-machine__mascot-arm--right">
                      <rect x="64" y="64" width="16" height="18" fill="#244453" />
                      <rect x="68" y="78" width="16" height="10" fill="#244453" />
                      <rect x="72" y="84" width="12" height="8" fill="#edbd96" />
                    </g>
                    <g fill="#26323a">
                      <rect x="36" y="8" width="28" height="8" />
                      <rect x="28" y="16" width="44" height="8" />
                      <rect x="24" y="24" width="48" height="8" />
                      <rect x="24" y="28" width="8" height="12" />
                    </g>
                    <g fill="#00ff66">
                      <rect x="52" y="12" width="8" height="4" />
                      <rect x="48" y="16" width="12" height="4" />
                      <rect x="28" y="24" width="8" height="4" />
                    </g>
                    <rect x="28" y="28" width="40" height="32" fill="#f2c9a7" />
                    <rect x="28" y="36" width="4" height="16" fill="#dfa984" />
                    <rect x="64" y="36" width="4" height="16" fill="#dfa984" />
                    <rect x="24" y="40" width="4" height="8" fill="#e8b18c" />
                    <rect x="68" y="40" width="4" height="8" fill="#e8b18c" />
                    <rect x="32" y="36" width="12" height="12" fill="#fff8ec" data-player-eye="boy-left" />
                    <rect x="52" y="36" width="12" height="12" fill="#fff8ec" data-player-eye="boy-right" />
                    <rect x="36" y="39" width="5" height="7" fill="#263a42" data-player-pupil="boy-left" />
                    <rect x="56" y="39" width="5" height="7" fill="#263a42" data-player-pupil="boy-right" />
                    <rect x="32" y="33" width="12" height="3" fill="#322c35" />
                    <rect x="52" y="33" width="12" height="3" fill="#322c35" />
                    <rect x="30" y="50" width="4" height="3" fill="#efaaa0" />
                    <rect x="62" y="50" width="4" height="3" fill="#efaaa0" />
                    <path d="M39 51h18v3h-3v3H42v-3h-3z" fill="#a75b52" />
                    <rect x="43" y="51" width="10" height="3" fill="#fff0d8" />
                    <g fill="#111b1d">
                      <rect x="18" y="32" width="10" height="22" />
                      <rect x="68" y="32" width="10" height="22" />
                    </g>
                    <g fill="#00ff66">
                      <rect x="20" y="38" width="6" height="10" />
                      <rect x="70" y="38" width="6" height="10" />
                    </g>
                    <rect x="24" y="62" width="48" height="9" fill="#1a303a" />
                    <g fill="#263c4c">
                      <rect x="28" y="68" width="40" height="20" />
                      <rect x="32" y="88" width="12" height="12" />
                      <rect x="52" y="88" width="12" height="12" />
                    </g>
                    <g fill="#315766">
                      <rect x="32" y="72" width="32" height="4" />
                      <rect x="28" y="76" width="4" height="8" />
                      <rect x="64" y="76" width="4" height="8" />
                    </g>
                    <g fill="#a6f45d">
                      <rect x="38" y="76" width="4" height="4" />
                      <rect x="34" y="80" width="12" height="4" />
                      <rect x="54" y="78" width="4" height="4" />
                      <rect x="60" y="78" width="4" height="4" />
                    </g>
                    <rect x="28" y="96" width="20" height="8" fill="#26323a" />
                    <rect x="48" y="96" width="20" height="8" fill="#26323a" />
                    <rect x="24" y="102" width="24" height="5" fill="#a8b4ad" />
                    <rect x="48" y="102" width="24" height="5" fill="#a8b4ad" />
                  </g>
                  <g data-player-avatar="dev-girl" opacity="0">
                    <g fill="#29233a">
                      <rect x="32" y="12" width="32" height="8" />
                      <rect x="24" y="20" width="48" height="12" />
                      <rect x="20" y="30" width="8" height="28" />
                      <rect x="68" y="30" width="8" height="28" />
                      <rect x="24" y="54" width="8" height="18" />
                      <rect x="64" y="54" width="8" height="18" />
                    </g>
                    <g fill="#b17bdb">
                      <rect x="32" y="12" width="8" height="4" />
                      <rect x="56" y="18" width="12" height="6" />
                      <rect x="20" y="40" width="8" height="10" />
                      <rect x="68" y="38" width="8" height="10" />
                    </g>
                    <rect x="28" y="28" width="40" height="32" fill="#f0c9a7" />
                    <rect x="24" y="36" width="8" height="16" fill="#dca985" />
                    <rect data-player-eye="girl-left" x="32" y="36" width="12" height="12" fill="#fff4df" />
                    <rect data-player-eye="girl-right" x="52" y="36" width="12" height="12" fill="#fff4df" />
                    <rect data-player-pupil="girl-left" x="36" y="39" width="5" height="7" fill="#25332b" />
                    <rect data-player-pupil="girl-right" x="56" y="39" width="5" height="7" fill="#25332b" />
                    <path d="M42 51h12v3h-3v2h-6v-2h-3z" fill="#a85862" />
                    <g fill="#653d83">
                      <rect x="28" y="62" width="40" height="26" />
                      <rect x="32" y="88" width="12" height="12" />
                      <rect x="52" y="88" width="12" height="12" />
                    </g>
                    <g fill="#00ff66">
                      <rect x="32" y="66" width="32" height="4" />
                      <rect x="44" y="70" width="8" height="14" />
                      <rect x="38" y="80" width="20" height="4" />
                    </g>
                    <rect x="28" y="98" width="20" height="8" fill="#29233a" />
                    <rect x="48" y="98" width="20" height="8" fill="#29233a" />
                    <rect x="24" y="104" width="24" height="4" fill="#89958d" />
                    <rect x="48" y="104" width="24" height="4" fill="#89958d" />
                  </g>
                  <g data-player-avatar="arcade-mascot" opacity="0">
                    <g fill="#79d75a">
                      <rect x="40" y="12" width="16" height="8" />
                      <rect x="32" y="20" width="32" height="8" />
                      <rect x="24" y="28" width="48" height="28" />
                      <rect x="28" y="56" width="40" height="8" />
                      <rect x="36" y="64" width="24" height="10" />
                      <rect x="32" y="74" width="12" height="12" />
                      <rect x="52" y="74" width="12" height="12" />
                    </g>
                    <rect data-player-eye="mascot-left" x="32" y="36" width="14" height="14" fill="#fff4df" />
                    <rect data-player-eye="mascot-right" x="50" y="36" width="14" height="14" fill="#fff4df" />
                    <rect data-player-pupil="mascot-left" x="37" y="40" width="5" height="8" fill="#25332b" />
                    <rect data-player-pupil="mascot-right" x="55" y="40" width="5" height="8" fill="#25332b" />
                    <path d="M43 54h12v3h-3v2h-6v-2h-3z" fill="#385c35" />
                    <rect x="18" y="38" width="6" height="12" fill="#e7d76c" />
                    <rect x="72" y="38" width="6" height="12" fill="#e7d76c" />
                  </g>
                </svg>
              </div>
              <span className="arcade-machine__screen-message">
                فكرتك، المرحلة القادمة
              </span>
              <a
                className="arcade-machine__prompt"
                href="#contact"
                aria-label="ابدأ مشروعك"
                dir="ltr"
                onClick={handleStartClick}
              >
                PRESS START <i />
              </a>
              </div>
            </div>

            {/* Control Panel Deck */}
            <div className="arcade-cabinet__deck">
              <div className="arcade-cabinet__deck-surface" dir="ltr">
                {/* Joystick */}
                <div
                  className="arcade-cabinet__joystick"
                  aria-hidden="true"
                  title="عصا التحكم - اضغط لتغيير اللاعب"
                  onClick={handleJoystickClick}
                >
                  <div className="arcade-cabinet__joystick-washer" />
                  <div className="arcade-cabinet__joystick-shaft">
                    <div className="arcade-cabinet__joystick-ball" />
                  </div>
                </div>

                {/* Arcade Push Buttons */}
                <div className="arcade-cabinet__buttons">
                  <button
                    type="button"
                    className="arcade-button arcade-button--cyan"
                    onClick={handleButtonClick}
                    title="تغيير اللاعب"
                    aria-label="الزر P1 - تغيير اللاعب"
                  >
                    <span className="arcade-button__cap">P1</span>
                  </button>
                  <button
                    type="button"
                    className="arcade-button arcade-button--green"
                    onClick={handleButtonClick}
                    title="تغيير اللاعب"
                    aria-label="الزر A - تغيير اللاعب"
                  >
                    <span className="arcade-button__cap">A</span>
                  </button>
                  <button
                    type="button"
                    className="arcade-button arcade-button--red"
                    onClick={handleButtonClick}
                    title="تغيير اللاعب"
                    aria-label="الزر B - تغيير اللاعب"
                  >
                    <span className="arcade-button__cap">B</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Lower Cabinet Base & Coin Door */}
            <div className="arcade-cabinet__base">
              <div className="arcade-cabinet__coin-door" dir="ltr">
                <div className="arcade-cabinet__coin-slots">
                  <button
                    type="button"
                    className="arcade-cabinet__coin-slot"
                    onClick={handleCoinInsert}
                    title="أدخل عملة لتغيير اللاعب"
                  >
                    <span className="arcade-cabinet__coin-slit" />
                    <span className="arcade-cabinet__coin-reject">25¢</span>
                  </button>
                  <button
                    type="button"
                    className="arcade-cabinet__coin-slot"
                    onClick={handleCoinInsert}
                    title="أدخل عملة لتغيير اللاعب"
                  >
                    <span className="arcade-cabinet__coin-slit" />
                    <span className="arcade-cabinet__coin-reject">25¢</span>
                  </button>
                </div>
                <div className="arcade-cabinet__insert-label" dir="ltr" onClick={handleCoinInsert}>INSERT COIN</div>
                <div className="arcade-cabinet__keyhole" aria-hidden="true" />
              </div>

              <button
                className="arcade-machine__selector"
                type="button"
                onClick={handleButtonClick}
                dir="ltr"
              >
                SELECT PLAYER <span aria-hidden="true">🔄</span>
              </button>
            </div>
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
