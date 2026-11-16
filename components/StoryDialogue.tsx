"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Image from "next/image";
import { motion, useScroll } from "framer-motion";
import {
  Volume2,
  VolumeX,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import {
  PixelGamepad,
  PixelTerminal,
  PixelPalette,
  PixelCamera,
} from "@/components/PixelIcons";
import {
  playSelectSound,
  playChimeSound,
  playJumpSound,
  playDialogueBlipSound,
  toggleArcadeMute,
  getArcadeMuteState,
} from "@/lib/arcadeSound";

interface StoryScene {
  id: string;
  badge: string;
  speaker: string;
  roleTitle: string;
  avatar: string;
  accentColor: string;
  glowColor: string;
  activeCharacter: "none" | "developer" | "designer" | "photographer" | "all";
  dialogue: string;
  highlightWords: string[];
}

const STORY_SCENES: StoryScene[] = [
  {
    id: "scene-origin",
    badge: "01 // THE GENESIS",
    speaker: "FAME-X // قصة البداية",
    roleTitle: "THE GENESIS",
    avatar: "/characters/avatars/trio_squad_v2.png",
    accentColor: "#a6f45d",
    glowColor: "rgba(166, 244, 93, 0.3)",
    activeCharacter: "all",
    dialogue:
      "إحنا 3 صحاب جمعنا الشغف من سنين.. كل واحد فينا كان غرقان في ملعبه وبيطور نفسه ليل نهار، لحد ما قررنا نجمع خبراتنا ونبني كيان رقمي متكامل اسمه FAME-X.",
    highlightWords: ["3 صحاب جمعنا الشغف", "غرقان في ملعبه", "كيان رقمي متكامل", "FAME-X"],
  },
  {
    id: "scene-developer",
    badge: "02 // MOBILE APP DEVELOPER",
    speaker: "إياد // MOBILE APP DEVELOPER",
    roleTitle: "IOS & ANDROID SPECIALIST",
    avatar: "/characters/avatars/developer_face.png",
    accentColor: "#a6f45d",
    glowColor: "rgba(166, 244, 93, 0.3)",
    activeCharacter: "developer",
    dialogue:
      "أنا إياد.. غاوي برمجة وتطوير تطبيقات موبايل من سنين. دوري في مشروعك إني أبنيلك أبلكيشن سريع طلقة وسلس على آيفون وأندرويد، خفيف ومبيقعش تحت أي ضغط مستخدمين.",
    highlightWords: ["أنا إياد", "تطبيقات موبايل من سنين", "أبلكيشن سريع طلقة", "آيفون وأندرويد", "مبيقعش تحت أي ضغط"],
  },
  {
    id: "scene-designer",
    badge: "03 // UI/UX DESIGNER",
    speaker: "محمد // UI/UX DESIGNER",
    roleTitle: "PRODUCT & INTERACTION DESIGN",
    avatar: "/characters/avatars/designer_face.png",
    accentColor: "#52c974",
    glowColor: "rgba(82, 201, 116, 0.3)",
    activeCharacter: "designer",
    dialogue:
      "وأنا محمد.. مهووس بتفاصيل التصميم وسيكولوجية تجربة المستخدم. وظيفتي أصنع لبيزنسك واجهات وتطبيقات تخطف العين، وتجربة سهلة تخلي العميل يرتاح نفسياً وميستغناش عن الأبلكيشن بتاعك.",
    highlightWords: ["وأنا محمد", "سيكولوجية تجربة المستخدم", "واجهات وتطبيقات تخطف العين", "تجربة سهلة", "وميستغناش عن الأبلكيشن"],
  },
  {
    id: "scene-photographer",
    badge: "04 // CREATIVE DIRECTOR",
    speaker: "جلال // CREATIVE DIRECTOR",
    roleTitle: "MEDIA & CINEMATIC",
    avatar: "/characters/avatars/photographer_face.png",
    accentColor: "#38bdf8",
    glowColor: "rgba(56, 189, 248, 0.3)",
    activeCharacter: "photographer",
    dialogue:
      "أما أنا جلال.. عيني التالتة هي الكاميرا. مسؤوليتي أطلع مشروعك ومنتجاتك بكادرات وإضاءة سينمائية فخمة، تفرّقك عن كل منافسيك وتعمل لعلامتك التجارية هيبة حقيقية.",
    highlightWords: ["أما أنا جلال", "عيني التالتة هي الكاميرا", "إضاءة سينمائية فخمة", "تفرّقك عن كل منافسيك", "هيبة حقيقية"],
  },
  {
    id: "scene-trio",
    badge: "05 // DIGITAL TRIO",
    speaker: "FAME-X TRIO // DIGITAL SQUAD",
    roleTitle: "UNBEATABLE ALLIANCE",
    avatar: "/characters/avatars/trio_squad_v2.png",
    accentColor: "#a6f45d",
    glowColor: "rgba(166, 244, 93, 0.4)",
    activeCharacter: "all",
    dialogue:
      "اتجمعنا إحنا التلاتة عشان منسبلكش حيرة.. شريك رقمي واحد ماسك فكرتك من الكود للتصميم للميديا، عشان بيزنسك يسبق الكل. جاهز نبدأ رحلتنا سوا؟",
    highlightWords: ["اتجمعنا إحنا التلاتة", "شريك رقمي واحد", "من الكود للتصميم للميديا", "يسبق الكل", "جاهز نبدأ رحلتنا سوا؟"],
  },
];

export default function StoryDialogue() {
  const containerRef = useRef<HTMLDivElement>(null);
  const isProgrammaticScrollRef = useRef(false);
  const scrollUnlockTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const [activeSceneIndex, setActiveSceneIndex] = useState(0);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [isInView, setIsInView] = useState(false);

  // Typewriter States
  const [displayedCharCount, setDisplayedCharCount] = useState(0);
  const [isTyping, setIsTyping] = useState(false);

  // Sync mute state on mount
  useEffect(() => {
    setSoundEnabled(!getArcadeMuteState());
  }, []);

  // 👁️ Viewport Observer: Only activate story when user actually reaches the section!
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry) {
          setIsInView(entry.isIntersecting);
          // If user scrolled back above the section, reset to scene 0
          if (!entry.isIntersecting && entry.boundingClientRect.top > 0) {
            setActiveSceneIndex(0);
          }
        }
      },
      {
        threshold: 0.05,
      }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const handleToggleSound = (e: React.MouseEvent) => {
    e.stopPropagation();
    const muted = toggleArcadeMute();
    setSoundEnabled(!muted);
    if (!muted) playSelectSound();
  };

  const currentScene = STORY_SCENES[activeSceneIndex];

  // 🖨️ RPG Dialogue Typewriter Effect (ONLY runs when section is visible in viewport)
  useEffect(() => {
    if (!isInView) {
      setDisplayedCharCount(0);
      setIsTyping(false);
      return;
    }

    setDisplayedCharCount(0);
    setIsTyping(true);

    const fullText = currentScene.dialogue;
    let currentIdx = 0;

    const timer = setInterval(() => {
      currentIdx += 2;
      if (currentIdx > fullText.length) currentIdx = fullText.length;
      setDisplayedCharCount(currentIdx);

      // Play soft 8-bit text blip ONLY when in view
      if (currentIdx % 6 === 0) {
        playDialogueBlipSound();
      }

      if (currentIdx >= fullText.length) {
        clearInterval(timer);
        setIsTyping(false);
      }
    }, 24);

    return () => clearInterval(timer);
  }, [activeSceneIndex, currentScene.dialogue, isInView]);

  // Scrollytelling Progress Observer
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  useEffect(() => {
    const unsubscribe = scrollYProgress.on("change", (latest) => {
      // 📱 On mobile: disable scrollytelling completely. Navigation is exclusively via Next/Prev buttons, character clicks, dots, or dialogue clicks.
      if (typeof window !== "undefined" && window.innerWidth < 640) return;

      // Don't fight programmatic clicks (Prev, Next, character buttons)
      if (isProgrammaticScrollRef.current) return;

      // 🛑 Only update scenes from scroll when the section is actually in view!
      if (!isInView) return;

      const sceneIndex = Math.min(4, Math.max(0, Math.floor(latest * 5)));
      setActiveSceneIndex((prev) => {
        if (prev !== sceneIndex) {
          if (sceneIndex === 4) {
            playChimeSound();
          } else {
            playSelectSound();
          }
          return sceneIndex;
        }
        return prev;
      });
    });

    return () => unsubscribe();
  }, [scrollYProgress, isInView]);

  // Jump to specific scene smoothly
  const jumpToScene = useCallback((index: number) => {
    if (index < 0 || index >= STORY_SCENES.length) return;

    const isMobileView = typeof window !== "undefined" && window.innerWidth < 640;

    // 1. Lock programmatic scroll so the scroll listener doesn't fight this action
    isProgrammaticScrollRef.current = true;
    if (scrollUnlockTimeoutRef.current) {
      clearTimeout(scrollUnlockTimeoutRef.current);
    }
    scrollUnlockTimeoutRef.current = setTimeout(() => {
      isProgrammaticScrollRef.current = false;
    }, 850);

    // 2. Update state immediately
    setActiveSceneIndex(index);
    if (index === 4) {
      playChimeSound();
    } else {
      playSelectSound();
    }

    // 3. Align page scroll smoothly with target scene ONLY on desktop where scrollytelling track exists
    if (!isMobileView && containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const containerTop = rect.top + scrollTop;
      const totalTrackScrollable = rect.height - window.innerHeight;

      if (totalTrackScrollable > 0) {
        // Target safely inside each scene's scroll band to avoid border flickering
        const targetProgress = (index + 0.45) / STORY_SCENES.length;
        const targetScroll = containerTop + targetProgress * totalTrackScrollable;
        window.scrollTo({ top: targetScroll, behavior: "smooth" });
      }
    }
  }, []);

  // When clicking on the dialogue box:
  // If typing -> instantly complete typing!
  // If finished typing -> advance to next scene!
  const handleBoxClick = () => {
    if (isTyping) {
      setDisplayedCharCount(currentScene.dialogue.length);
      setIsTyping(false);
    } else {
      if (activeSceneIndex < STORY_SCENES.length - 1) {
        jumpToScene(activeSceneIndex + 1);
      } else {
        const el = document.getElementById("services") || document.getElementById("about");
        if (el) el.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (activeSceneIndex < STORY_SCENES.length - 1) {
      jumpToScene(activeSceneIndex + 1);
    } else {
      const el = document.getElementById("services") || document.getElementById("about");
      if (el) el.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (activeSceneIndex > 0) {
      jumpToScene(activeSceneIndex - 1);
    }
  };

  const handleSkipToServices = (e: React.MouseEvent) => {
    e.stopPropagation();
    playJumpSound();
    const el = document.getElementById("services");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  // Format highlighted words cleanly without underlines
  const renderFormattedDialogue = (text: string, highlights: string[], accent: string) => {
    let result = text;
    highlights.forEach((word) => {
      if (result.includes(word)) {
        result = result.replace(word, `__HL_START__${word}__HL_END__`);
      }
    });

    const parts = result.split(/(__HL_START__|__HL_END__)/);
    let isHighlight = false;

    return parts.map((part, i) => {
      if (part === "__HL_START__") {
        isHighlight = true;
        return null;
      }
      if (part === "__HL_END__") {
        isHighlight = false;
        return null;
      }
      if (isHighlight) {
        return (
          <span
            key={i}
            className="font-black"
            style={{ color: accent }}
          >
            {part}
          </span>
        );
      }
      return <span key={i}>{part}</span>;
    });
  };

  const visibleDialogue = currentScene.dialogue.slice(0, displayedCharCount);

  return (
    <div
      ref={containerRef}
      className="relative w-full py-2 sm:py-0 sm:min-h-[280vh]"
      id="story-mode-track"
    >
      {/* 📍 Viewport Window: Clean Flow on Mobile (< sm), Sticky Scrollytelling on Desktop (sm+) */}
      <div className="relative sm:sticky sm:top-14 md:top-20 w-full sm:h-[calc(100dvh-3.75rem)] sm:max-h-[720px] flex flex-col justify-center sm:justify-between py-1 sm:py-3 px-2 sm:px-4 overflow-hidden select-none gap-2 sm:gap-0">
        
        {/* 🎮 Retro Header Bar & Controls */}
        <div className="relative z-30 w-full max-w-4xl mx-auto flex items-center justify-between gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1.5 rounded-xl bg-[#09150d]/80 border border-[#1b3420] backdrop-blur-md shadow-lg">
          {/* Live Chapter Indicator */}
          <div className="flex items-center gap-1.5 sm:gap-2 min-w-0" dir="ltr">
            <span
              className="w-2 h-2 rounded-full animate-ping shrink-0"
              style={{ backgroundColor: currentScene.accentColor }}
            />
            <span className="text-[9.5px] sm:text-xs font-mono font-bold tracking-wider text-[#a8bda7] truncate">
              <span className="hidden sm:inline">FAME-X RPG STORY // </span>{currentScene.badge}
            </span>
          </div>

          {/* Quick Scene Dots + Sound + Skip Button */}
          <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
            {/* Step Dots */}
            <div className="flex items-center gap-1 sm:gap-1.5">
              {STORY_SCENES.map((scene, idx) => (
                <button
                  key={scene.id}
                  onClick={(e) => {
                    e.stopPropagation();
                    jumpToScene(idx);
                  }}
                  aria-label={`Jump to scene ${idx + 1}`}
                  className={`h-1.5 sm:h-2 rounded-full transition-all duration-300 ${
                    idx === activeSceneIndex
                      ? "w-4 sm:w-6 shadow-[0_0_8px_currentColor]"
                      : "w-1.5 sm:w-2 bg-white/20 hover:bg-white/40"
                  }`}
                  style={{
                    backgroundColor: idx === activeSceneIndex ? currentScene.accentColor : undefined,
                    color: currentScene.accentColor,
                  }}
                />
              ))}
            </div>

            {/* Mute/Unmute */}
            <button
              onClick={handleToggleSound}
              aria-label="Toggle retro arcade sounds"
              className="p-1 rounded-lg bg-black/40 hover:bg-black/60 text-[#a8bda7] hover:text-white transition-colors"
            >
              {soundEnabled ? (
                <Volume2 className="w-3.5 h-3.5 text-[#a6f45d]" />
              ) : (
                <VolumeX className="w-3.5 h-3.5 opacity-60" />
              )}
            </button>

            {/* Skip to Services Button */}
            <button
              onClick={handleSkipToServices}
              className="hidden sm:inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg bg-white/[0.05] hover:bg-white/[0.1] border border-white/10 text-[10px] font-bold text-[#b5ceb2] transition-colors"
            >
              <span>تخطي للخدمات</span>
              <span className="text-xs">⏭</span>
            </button>
          </div>
        </div>

        {/* 📖 The Arcade Comic Panels Stage (بانيلز الكوميكس التفاعلية ثلاثية الأبعاد) */}
        <div className="relative z-20 w-full max-w-4xl mx-auto flex flex-col justify-center items-center py-1 sm:py-3 select-none sm:flex-1 sm:my-auto">

          {/* 📱 MOBILE VIEW: Open Cinematic Character Stage (< sm) */}
          <div className="sm:hidden relative z-10 w-full flex flex-col items-center justify-center px-2">
            
            {/* 🌟 Open Character Stage (Zero-Lag Pre-Mounted Cross-Fade) */}
            <div className="relative w-full max-w-[340px] h-[215px] xs:h-[230px] flex items-end justify-center">

              {/* 💻 Hero 1: إياد - المطوّر */}
              <div
                className={`absolute inset-0 flex flex-col items-center justify-end pb-1 transition-all duration-300 ease-out ${
                  currentScene.activeCharacter === "developer"
                    ? "opacity-100 scale-100 pointer-events-auto z-10"
                    : "opacity-0 scale-95 pointer-events-none z-0"
                }`}
              >
                {/* Floating Character Badge */}
                <div className="mb-auto mt-0.5 flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/85 border border-[#a6f45d]/40 backdrop-blur-md shadow-sm">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#a6f45d] animate-pulse" />
                  <span className="text-[10px] font-black text-white font-mono">إياد</span>
                  <span className="text-[8px] text-[#a6f45d] font-mono font-bold tracking-wider">{"// MOBILE APP ARCHITECT"}</span>
                </div>

                {/* Ground Radial Halo & Floor Shadow */}
                <div className="absolute bottom-1 w-36 h-5 rounded-[100%] bg-black/80 blur-[3px] pointer-events-none" />
                <div
                  className="absolute bottom-0 w-44 h-7 rounded-[100%] opacity-20 pointer-events-none"
                  style={{
                    background: "radial-gradient(ellipse at center, #a6f45d 0%, transparent 70%)",
                  }}
                />

                {/* Full-Body Hero Sprite (Unbounded, No Slicing, Full Shoes Visible) */}
                <div
                  onClick={() => jumpToScene(2)}
                  className="relative z-10 w-36 xs:w-40 h-[175px] xs:h-[185px] flex items-end justify-center cursor-pointer transition-transform active:scale-95"
                >
                  <Image
                    src="/characters/developer_v4.png"
                    alt="إياد - المطوّر"
                    width={155}
                    height={185}
                    priority
                    className="object-contain max-h-full drop-shadow-[0_12px_24px_rgba(0,0,0,0.95)] [image-rendering:pixelated]"
                  />
                </div>
              </div>

              {/* 🎨 Hero 2: محمد - المصمّم */}
              <div
                className={`absolute inset-0 flex flex-col items-center justify-end pb-1 transition-all duration-300 ease-out ${
                  currentScene.activeCharacter === "designer"
                    ? "opacity-100 scale-100 pointer-events-auto z-10"
                    : "opacity-0 scale-95 pointer-events-none z-0"
                }`}
              >
                {/* Floating Character Badge */}
                <div className="mb-auto mt-0.5 flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/85 border border-[#52c974]/40 backdrop-blur-md shadow-sm">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#52c974] animate-pulse" />
                  <span className="text-[10px] font-black text-white font-mono">محمد</span>
                  <span className="text-[8px] text-[#52c974] font-mono font-bold tracking-wider">{"// UI/UX PRODUCT DESIGNER"}</span>
                </div>

                {/* Ground Radial Halo & Floor Shadow */}
                <div className="absolute bottom-1 w-36 h-5 rounded-[100%] bg-black/80 blur-[3px] pointer-events-none" />
                <div
                  className="absolute bottom-0 w-44 h-7 rounded-[100%] opacity-20 pointer-events-none"
                  style={{
                    background: "radial-gradient(ellipse at center, #52c974 0%, transparent 70%)",
                  }}
                />

                {/* Full-Body Hero Sprite (Unbounded, No Slicing, Full Shoes Visible) */}
                <div
                  onClick={() => jumpToScene(3)}
                  className="relative z-10 w-36 xs:w-40 h-[175px] xs:h-[185px] flex items-end justify-center cursor-pointer transition-transform active:scale-95"
                >
                  <Image
                    src="/characters/designer_v4.png"
                    alt="محمد - المصمّم"
                    width={155}
                    height={185}
                    priority
                    className="object-contain max-h-full drop-shadow-[0_12px_24px_rgba(0,0,0,0.95)] [image-rendering:pixelated]"
                  />
                </div>
              </div>

              {/* 📸 Hero 3: جلال - الكرييتف */}
              <div
                className={`absolute inset-0 flex flex-col items-center justify-end pb-1 transition-all duration-300 ease-out ${
                  currentScene.activeCharacter === "photographer"
                    ? "opacity-100 scale-100 pointer-events-auto z-10"
                    : "opacity-0 scale-95 pointer-events-none z-0"
                }`}
              >
                {/* Floating Character Badge */}
                <div className="mb-auto mt-0.5 flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/85 border border-[#38bdf8]/40 backdrop-blur-md shadow-sm">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#38bdf8] animate-pulse" />
                  <span className="text-[10px] font-black text-white font-mono">جلال</span>
                  <span className="text-[8px] text-[#38bdf8] font-mono font-bold tracking-wider">{"// CREATIVE MEDIA DIRECTOR"}</span>
                </div>

                {/* Ground Radial Halo & Floor Shadow */}
                <div className="absolute bottom-1 w-36 h-5 rounded-[100%] bg-black/80 blur-[3px] pointer-events-none" />
                <div
                  className="absolute bottom-0 w-44 h-7 rounded-[100%] opacity-20 pointer-events-none"
                  style={{
                    background: "radial-gradient(ellipse at center, #38bdf8 0%, transparent 70%)",
                  }}
                />

                {/* Full-Body Hero Sprite (Unbounded, No Slicing, Full Shoes Visible) */}
                <div
                  onClick={() => jumpToScene(4)}
                  className="relative z-10 w-36 xs:w-40 h-[175px] xs:h-[185px] flex items-end justify-center cursor-pointer transition-transform active:scale-95"
                >
                  <Image
                    src="/characters/photographer_v4.png"
                    alt="جلال - الكرييتف"
                    width={155}
                    height={185}
                    priority
                    className="object-contain max-h-full drop-shadow-[0_12px_24px_rgba(0,0,0,0.95)] [image-rendering:pixelated]"
                  />
                </div>
              </div>

              {/* 👥 Hero 4: الفريق المتكامل (Trio Squad Open Formation) */}
              <div
                className={`absolute inset-0 flex flex-col items-center justify-end pb-1 transition-all duration-300 ease-out ${
                  currentScene.activeCharacter === "all"
                    ? "opacity-100 scale-100 pointer-events-auto z-10"
                    : "opacity-0 scale-95 pointer-events-none z-0"
                }`}
              >
                {/* Floating Character Badge */}
                <div className="mb-auto mt-0.5 flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/85 border border-[#a6f45d]/40 backdrop-blur-md shadow-sm">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#a6f45d] animate-pulse" />
                  <span className="text-[10px] font-black text-white font-mono">فريق FAME-X</span>
                  <span className="text-[8px] text-[#a6f45d] font-mono font-bold tracking-wider">{"// 3 EXPERTS • ONE ALLIANCE"}</span>
                </div>

                {/* Ground Radial Halo & Floor Shadows */}
                <div className="absolute bottom-1 w-60 h-5 rounded-[100%] bg-black/85 blur-[3px] pointer-events-none" />
                <div
                  className="absolute bottom-0 w-64 h-7 rounded-[100%] opacity-20 pointer-events-none"
                  style={{
                    background: "radial-gradient(ellipse at center, #a6f45d 0%, transparent 70%)",
                  }}
                />

                {/* 💥 Trio Open Formation (Full Shoes & Full Bodies Visible, Fully Interactive) */}
                <div className="relative z-10 w-full flex items-end justify-center px-1">
                  {/* Left: جلال */}
                  <div
                    onClick={() => jumpToScene(3)}
                    className="relative -ml-1 -mb-0.5 w-24 xs:w-28 h-[150px] xs:h-[160px] shrink-0 opacity-95 z-10 flex items-end justify-center cursor-pointer transition-transform active:scale-95"
                    title="جلال - Creative Media"
                  >
                    <Image
                      src="/characters/photographer_v4.png"
                      alt="جلال"
                      width={120}
                      height={160}
                      priority
                      className="object-contain max-h-full drop-shadow-[0_10px_18px_rgba(0,0,0,0.9)] [image-rendering:pixelated]"
                    />
                  </div>

                  {/* Center: إياد */}
                  <div
                    onClick={() => jumpToScene(1)}
                    className="relative -mx-3 z-20 w-28 xs:w-32 h-[170px] xs:h-[180px] shrink-0 flex items-end justify-center cursor-pointer transition-transform active:scale-95"
                    title="إياد - Mobile Dev"
                  >
                    <Image
                      src="/characters/developer_v4.png"
                      alt="إياد"
                      width={135}
                      height={180}
                      priority
                      className="object-contain max-h-full drop-shadow-[0_14px_24px_rgba(0,0,0,0.95)] [image-rendering:pixelated]"
                    />
                  </div>

                  {/* Right: محمد */}
                  <div
                    onClick={() => jumpToScene(2)}
                    className="relative -mr-1 -mb-0.5 w-24 xs:w-28 h-[150px] xs:h-[160px] shrink-0 opacity-95 z-10 flex items-end justify-center cursor-pointer transition-transform active:scale-95"
                    title="محمد - UI/UX Designer"
                  >
                    <Image
                      src="/characters/designer_v4.png"
                      alt="محمد"
                      width={120}
                      height={160}
                      priority
                      className="object-contain max-h-full drop-shadow-[0_10px_18px_rgba(0,0,0,0.9)] [image-rendering:pixelated]"
                    />
                  </div>
                </div>
              </div>

            </div>
          </div>

          {/* 💻 DESKTOP VIEW: 3-Way Comic Action Panels Grid (sm and up) */}
          <div className="hidden sm:grid sm:grid-cols-3 relative z-10 w-full max-w-md sm:max-w-xl mx-auto gap-4 items-end justify-items-center px-1">
            
            {/* 🎨 Comic Panel 1 (Right): محمد - المصمّم (Designer) */}
            <div
              onClick={() => jumpToScene(2)}
              className={`group relative w-full flex flex-col items-center cursor-pointer transition-all duration-500 ${
                currentScene.activeCharacter === "designer"
                  ? "scale-105 z-20 -translate-y-1"
                  : currentScene.activeCharacter === "all"
                  ? "scale-100 z-10"
                  : "scale-95 z-0 opacity-40 hover:opacity-75 grayscale-[20%]"
              }`}
            >
              {/* Comic Frame Card */}
              <div
                className={`relative w-full rounded-2xl border-2 transition-all duration-500 overflow-hidden flex flex-col justify-between p-1.5 sm:p-2.5 h-[160px] sm:h-[185px] md:h-[195px] ${
                  currentScene.activeCharacter === "designer" || currentScene.activeCharacter === "all"
                    ? "border-[#52c974] bg-gradient-to-b from-[#0c2617] via-[#09170e] to-[#040905] shadow-md"
                    : "border-[#1b3420] bg-[#071009] shadow-none"
                }`}
              >
                {/* Blueprint Wireframe Grid Background */}
                <div
                  className="absolute inset-0 opacity-20 pointer-events-none"
                  style={{
                    backgroundImage:
                      "linear-gradient(to right, rgba(82,201,116,0.18) 1px, transparent 1px), linear-gradient(to bottom, rgba(82,201,116,0.18) 1px, transparent 1px)",
                    backgroundSize: "14px 14px",
                  }}
                />

                {/* Floating Design Ambience */}
                <div className="hidden sm:block absolute top-7 left-1.5 font-mono text-[10px] text-[#52c974]/40 font-bold select-none">
                  {"UI // UX"}
                </div>
                <div className="hidden sm:block absolute bottom-10 right-1.5 font-mono text-[10px] text-[#52c974]/30 font-bold select-none">
                  {"FIGMA ❖"}
                </div>

                {/* Comic Header Ribbon */}
                <div className="relative z-10 flex items-center justify-between w-full border-b border-[#52c974]/20 pb-0.5 sm:pb-1">
                  <span className="text-[7.5px] sm:text-[9px] font-mono font-black tracking-wider text-[#52c974] flex items-center gap-0.5 sm:gap-1">
                    <PixelPalette size={9} />
                    <span>UI/UX</span>
                  </span>
                  {currentScene.activeCharacter === "designer" && (
                    <span className="px-1 sm:px-1.5 py-0.2 rounded-full bg-[#52c974] text-black font-mono font-black text-[6px] sm:text-[7.5px] animate-pulse">
                      TALKING
                    </span>
                  )}
                </div>

                {/* In-Frame Solid Nameplate Base */}
                <div className="relative z-30 w-full mt-auto py-1 border-t border-[#52c974]/25 bg-black/75 backdrop-blur-xs text-center rounded-b-xl">
                  <p className="text-[9px] sm:text-[11px] font-black text-white font-mono leading-tight">
                    محمد
                  </p>
                  <p className="text-[6.5px] sm:text-[7.5px] text-[#52c974] font-mono font-bold tracking-tight">
                    UI/UX DESIGNER
                  </p>
                </div>
              </div>

              {/* 💥 3D Pop-Out Character Sprite */}
              <div className="absolute bottom-5 sm:bottom-6 z-20 w-24 sm:w-32 md:w-36 h-[160px] sm:h-[195px] md:h-[210px] flex items-end justify-center pointer-events-none transition-transform duration-500 group-hover:scale-105">
                <Image
                  src="/characters/designer_v4.png"
                  alt="محمد - المصمّم"
                  width={140}
                  height={180}
                  priority
                  className="object-contain max-h-full drop-shadow-[0_12px_24px_rgba(0,0,0,0.95)] [image-rendering:pixelated]"
                />
              </div>
            </div>

            {/* 💻 Comic Panel 2 (Center): إياد - المطوّر (Developer) */}
            <div
              onClick={() => jumpToScene(1)}
              className={`group relative w-full flex flex-col items-center cursor-pointer transition-all duration-500 ${
                currentScene.activeCharacter === "developer"
                  ? "scale-105 z-20 -translate-y-1"
                  : currentScene.activeCharacter === "all"
                  ? "scale-100 z-10"
                  : "scale-95 z-0 opacity-40 hover:opacity-75 grayscale-[20%]"
              }`}
            >
              {/* Comic Frame Card */}
              <div
                className={`relative w-full rounded-2xl border-2 transition-all duration-500 overflow-hidden flex flex-col justify-between p-1.5 sm:p-2.5 h-[160px] sm:h-[185px] md:h-[195px] ${
                  currentScene.activeCharacter === "developer" || currentScene.activeCharacter === "all"
                    ? "border-[#a6f45d] bg-gradient-to-b from-[#0c2413] via-[#09170e] to-[#040905] shadow-md"
                    : "border-[#1b3420] bg-[#071009] shadow-none"
                }`}
              >
                {/* Halftone / Matrix Pattern */}
                <div
                  className="absolute inset-0 opacity-20 pointer-events-none"
                  style={{
                    backgroundImage: "radial-gradient(#a6f45d 1px, transparent 1px)",
                    backgroundSize: "12px 12px",
                  }}
                />

                {/* Floating Code Ambience */}
                <div className="hidden sm:block absolute top-7 left-1.5 font-mono text-[10px] text-[#a6f45d]/40 font-bold select-none">
                  {"<App />"}
                </div>
                <div className="hidden sm:block absolute bottom-10 right-1.5 font-mono text-[10px] text-[#a6f45d]/30 font-bold select-none">
                  {"{ iOS }"}
                </div>

                {/* Comic Header Ribbon */}
                <div className="relative z-10 flex items-center justify-between w-full border-b border-[#a6f45d]/20 pb-0.5 sm:pb-1">
                  <span className="text-[7.5px] sm:text-[9px] font-mono font-black tracking-wider text-[#a6f45d] flex items-center gap-0.5 sm:gap-1">
                    <PixelTerminal size={9} />
                    <span>DEV</span>
                  </span>
                  {currentScene.activeCharacter === "developer" && (
                    <span className="px-1 sm:px-1.5 py-0.2 rounded-full bg-[#a6f45d] text-black font-mono font-black text-[6px] sm:text-[7.5px] animate-pulse">
                      TALKING
                    </span>
                  )}
                </div>

                {/* In-Frame Solid Nameplate Base */}
                <div className="relative z-30 w-full mt-auto py-1 border-t border-[#a6f45d]/25 bg-black/75 backdrop-blur-xs text-center rounded-b-xl">
                  <p className="text-[9px] sm:text-[11px] font-black text-white font-mono leading-tight">
                    إياد
                  </p>
                  <p className="text-[6.5px] sm:text-[7.5px] text-[#a6f45d] font-mono font-bold tracking-tight">
                    MOBILE DEV
                  </p>
                </div>
              </div>

              {/* 💥 3D Pop-Out Character Sprite */}
              <div className="absolute bottom-5 sm:bottom-6 z-20 w-24 sm:w-32 md:w-36 h-[160px] sm:h-[195px] md:h-[210px] flex items-end justify-center pointer-events-none transition-transform duration-500 group-hover:scale-105">
                <Image
                  src="/characters/developer_v4.png"
                  alt="إياد - المطوّر"
                  width={140}
                  height={180}
                  priority
                  className="object-contain max-h-full drop-shadow-[0_12px_24px_rgba(0,0,0,0.95)] [image-rendering:pixelated]"
                />
              </div>
            </div>

            {/* 📸 Comic Panel 3: جلال - الكرييتف (Photographer / Creative) */}
            <div
              onClick={() => jumpToScene(3)}
              className={`group relative w-full flex flex-col items-center cursor-pointer transition-all duration-500 ${
                currentScene.activeCharacter === "photographer"
                  ? "scale-105 z-20 -translate-y-1"
                  : currentScene.activeCharacter === "all"
                  ? "scale-100 z-10"
                  : "scale-95 z-0 opacity-40 hover:opacity-75 grayscale-[20%]"
              }`}
            >
              {/* Comic Frame Card */}
              <div
                className={`relative w-full rounded-2xl border-2 transition-all duration-500 overflow-hidden flex flex-col justify-between p-1.5 sm:p-2.5 h-[160px] sm:h-[185px] md:h-[195px] ${
                  currentScene.activeCharacter === "photographer" || currentScene.activeCharacter === "all"
                    ? "border-[#38bdf8] bg-gradient-to-b from-[#0c222b] via-[#08151b] to-[#040905] shadow-md"
                    : "border-[#1b3420] bg-[#071009] shadow-none"
                }`}
              >
                {/* Cinematic Viewfinder / Corner Marks Background */}
                <div className="absolute inset-0 p-2 opacity-25 pointer-events-none flex flex-col justify-between">
                  <div className="flex justify-between text-[#38bdf8] text-[9px] font-mono font-bold">
                    <span>⌜</span>
                    <span>⌝</span>
                  </div>
                  <div className="text-center font-mono text-[9px] text-[#38bdf8]/40">
                    +
                  </div>
                  <div className="flex justify-between text-[#38bdf8] text-[9px] font-mono font-bold">
                    <span>⌞</span>
                    <span>⌟</span>
                  </div>
                </div>

                {/* Floating Cinematic Ambience */}
                <div className="hidden sm:block absolute top-7 left-1.5 font-mono text-[10px] text-[#38bdf8]/40 font-bold select-none">
                  {"4K // REC"}
                </div>
                <div className="hidden sm:block absolute bottom-10 right-1.5 font-mono text-[10px] text-[#38bdf8]/30 font-bold select-none">
                  {"60 FPS"}
                </div>

                {/* Comic Header Ribbon */}
                <div className="relative z-10 flex items-center justify-between w-full border-b border-[#38bdf8]/20 pb-0.5 sm:pb-1">
                  <span className="text-[7.5px] sm:text-[9px] font-mono font-black tracking-wider text-[#38bdf8] flex items-center gap-0.5 sm:gap-1">
                    <PixelCamera size={9} />
                    <span>MEDIA</span>
                  </span>
                  {currentScene.activeCharacter === "photographer" && (
                    <span className="px-1 sm:px-1.5 py-0.2 rounded-full bg-[#38bdf8] text-black font-mono font-black text-[6px] sm:text-[7.5px] animate-pulse">
                      TALKING
                    </span>
                  )}
                </div>

                {/* In-Frame Solid Nameplate Base */}
                <div className="relative z-30 w-full mt-auto py-1 border-t border-[#38bdf8]/25 bg-black/75 backdrop-blur-xs text-center rounded-b-xl">
                  <p className="text-[9px] sm:text-[11px] font-black text-white font-mono leading-tight">
                    جلال
                  </p>
                  <p className="text-[6.5px] sm:text-[7.5px] text-[#38bdf8] font-mono font-bold tracking-tight">
                    CREATIVE
                  </p>
                </div>
              </div>

              {/* 💥 3D Pop-Out Character Sprite (Grounded on pedestal, bursting through top frame!) */}
              <div className="absolute bottom-5 sm:bottom-6 z-20 w-24 sm:w-32 md:w-36 h-[160px] sm:h-[195px] md:h-[210px] flex items-end justify-center pointer-events-none transition-transform duration-500 group-hover:scale-105">
                <Image
                  src="/characters/photographer_v4.png"
                  alt="جلال - الكرييتف"
                  width={140}
                  height={180}
                  priority
                  className="object-contain max-h-full drop-shadow-[0_12px_24px_rgba(0,0,0,0.95)] [image-rendering:pixelated]"
                />
              </div>
            </div>

          </div>
        </div>

        {/* 💬 THE CLASSIC RPG DIALOGUE BOX (Mega Man GBA Style With Typewriter) */}
        <div className="relative z-30 w-full max-w-4xl mx-auto mt-1 sm:mt-0">
          <div
            onClick={handleBoxClick}
            className="group relative rounded-xl sm:rounded-2xl bg-[#09150d]/95 border-2 sm:border-[3px] border-[#224429] hover:border-[#a6f45d]/60 shadow-[0_16px_40px_rgba(0,0,0,0.9),inset_0_1px_2px_rgba(255,255,255,0.12)] p-2.5 sm:p-4 cursor-pointer transition-all duration-300 min-h-[130px] sm:min-h-[155px] flex flex-col justify-between"
            style={{
              boxShadow: "0 16px 40px rgba(0,0,0,0.95)",
            }}
          >
            {/* Top Corner Speaker Badge Tag */}
            <div className="flex items-center justify-between pb-1.5 sm:pb-2 mb-1.5 sm:mb-2 border-b border-[#1b3420] gap-2">
              <div className="flex items-center gap-1.5 sm:gap-2 min-w-0">
                <span
                  className="w-2 h-2 rounded-full animate-pulse shrink-0"
                  style={{ backgroundColor: currentScene.accentColor }}
                />
                <span
                  className="text-[11px] sm:text-sm font-black font-mono tracking-wide truncate"
                  style={{ color: currentScene.accentColor }}
                >
                  {currentScene.speaker}
                </span>
                <span className="hidden sm:inline text-[10px] text-[#7d9b7f] font-mono opacity-80 shrink-0">
                  <bdi dir="ltr">{"//"} {currentScene.roleTitle}</bdi>
                </span>
              </div>

              {/* Scene Counter Tag */}
              <div className="flex items-center gap-2 shrink-0">
                <span
                  dir="ltr"
                  className="px-1.5 sm:px-2 py-0.5 rounded bg-black/60 border border-white/10 text-[8.5px] sm:text-[10px] font-mono font-bold text-white tracking-widest"
                >
                  <bdi dir="ltr">0{activeSceneIndex + 1} / 05</bdi>
                </span>
              </div>
            </div>

            {/* Dialogue Body: Face Portrait Box + Live Typewritten Dialogue */}
            <div className="flex items-start gap-2.5 sm:gap-4 flex-1">
              
              {/* 🖼️ Retro Pixel Face Portrait (GBA Dialogue Portrait Box) */}
              <div
                className="relative w-14 h-14 sm:w-22 sm:h-22 md:w-28 md:h-28 shrink-0 rounded-xl sm:rounded-2xl bg-black/90 border-2 sm:border-[2.5px] overflow-hidden shadow-inner flex items-center justify-center transition-all duration-300 group-hover:scale-105"
                style={{ borderColor: currentScene.accentColor }}
              >
                <Image
                  src={currentScene.avatar}
                  alt={currentScene.speaker}
                  width={112}
                  height={112}
                  priority
                  className="object-contain w-full h-full [image-rendering:pixelated]"
                />
                {/* CRT Scanline over the portrait */}
                <div
                  className="absolute inset-0 opacity-15 pointer-events-none"
                  style={{
                    backgroundImage: "linear-gradient(rgba(255,255,255,0.3) 1px, transparent 1px)",
                    backgroundSize: "100% 3px",
                  }}
                />
              </div>

              {/* 📜 The Egyptian Colloquial Dialogue Script (Typewritten!) */}
              <div className="flex-1 min-w-0 pr-1">
                <p className="text-[12.5px] sm:text-base md:text-lg font-bold leading-relaxed sm:leading-loose text-[#f0fdf4] font-[family-name:var(--font-digital)]">
                  &ldquo;
                  {renderFormattedDialogue(
                    visibleDialogue,
                    currentScene.highlightWords,
                    currentScene.accentColor
                  )}
                  {/* Blinking Retro Typewriter Cursor */}
                  {isTyping && (
                    <span
                      className="inline-block w-1.5 sm:w-2.5 h-3.5 sm:h-5 mr-1 align-middle animate-pulse shadow-[0_0_8px_currentColor]"
                      style={{ backgroundColor: currentScene.accentColor, color: currentScene.accentColor }}
                    />
                  )}
                  &rdquo;
                </p>

                {/* Scene 5 Call-To-Action (ظهر في آخر مشهد بعد انتهاء الكتابة) */}
                {activeSceneIndex === 4 && !isTyping && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.15 }}
                    className="mt-2 sm:mt-3 flex items-center gap-3"
                  >
                    <a
                      href="#contact"
                      onClick={handleSkipToServices}
                      className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl bg-[#132817] hover:bg-[#1a3821] border border-[#2b5233] hover:border-[#a6f45d] text-[#e8f5e9] hover:text-white font-bold text-[11px] sm:text-sm hover:scale-105 transition-all shadow-md hover:shadow-[0_0_14px_rgba(166,244,93,0.25)]"
                    >
                      <PixelGamepad size={14} className="text-[#a6f45d] shrink-0" />
                      <span>ابدأ مشروعك مع FAME-X دلوقتي</span>
                    </a>
                  </motion.div>
                )}
              </div>

            </div>

            {/* Bottom Controls Deck: Navigation Arrows & Blinking GBA Arrow */}
            <div className="flex items-center justify-between pt-1.5 sm:pt-2 mt-1.5 sm:mt-2 border-t border-[#132817] text-[9.5px] sm:text-[10px] text-[#7d9b7f] font-mono">
              {/* Micro Tip */}
              <div className="flex items-center gap-1 sm:gap-1.5">
                <span className="text-[#a6f45d] animate-pulse">▼</span>
                <span className="hidden sm:inline">
                  {isTyping ? "اضغط بالماوس لإظهار الكلام فوراً" : "اسكرول لأسفل أو اضغط بالماوس للرد التالي"}
                </span>
                <span className="sm:hidden text-[9px]">
                  {isTyping ? "المس لإظهار النص" : "اضغط التالي أو الصور للتنقل"}
                </span>
              </div>

              {/* Prev / Next Buttons */}
              <div className="flex items-center gap-1.5">
                {activeSceneIndex > 0 && (
                  <button
                    onClick={handlePrev}
                    aria-label="Previous Dialogue"
                    className="flex items-center gap-1 px-2.5 py-1 sm:py-0.5 rounded-lg bg-black/50 hover:bg-black/70 text-[#a8bda7] hover:text-white transition-colors active:scale-95 text-[10px] sm:text-[10px]"
                  >
                    <span>السابق</span>
                    <ChevronRight className="w-3 h-3" />
                  </button>
                )}

                <button
                  onClick={handleNext}
                  aria-label="Next Dialogue"
                  className="flex items-center gap-1 px-3 py-1 sm:py-0.5 rounded-lg bg-[#172e1c] hover:bg-[#a6f45d] hover:text-black text-white font-bold transition-all active:scale-95 text-[10px] sm:text-[10px]"
                >
                  <span>{activeSceneIndex === 4 ? "للخدمات" : "التالي"}</span>
                  <ChevronLeft className="w-3 h-3 text-[#a6f45d] group-hover:text-black" />
                </button>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
