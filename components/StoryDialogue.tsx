"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Image from "next/image";
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from "motion/react";
import {
  Terminal,
  Palette,
  Camera,
  Zap,
  Cpu,
  ShieldCheck,
  Layers,
  Sparkles,
  Activity,
  Film,
  Aperture,
  Gauge,
  ChevronDown,
  Quote,
  Users2,
  Volume2,
} from "lucide-react";
import { playSelectSound } from "@/lib/arcadeSound";

export interface StoryChapter {
  id: "intro" | "developer" | "designer" | "photographer";
  code: string;
  tabLabel: string;
  badge: string;
  title: string;
  discipline: string;
  avatar: string;
  accentColor: string;
  ambientGlow: string;
  navIcon: typeof Terminal;
  quote?: string;
  story: string;
  impactTag?: string;
  impactTitle?: string;
  impactDesc?: string;
  metrics?: {
    label: string;
    value: number;
    icon: typeof Zap;
  }[];
}

const CHAPTERS: StoryChapter[] = [
  {
    id: "intro",
    code: "00",
    tabLabel: "حكايتنا",
    badge: "THE GENESIS // قصة البداية",
    title: "من سهر الليالي لحلم FAME-X: حكاية 3 شباب جمعهم الشغف",
    discipline: "TRIO FOUNDERS & SPECIALISTS",
    avatar: "", // Handled specially in intro lineup
    accentColor: "#a6f45d",
    ambientGlow: "rgba(166, 244, 93, 0.12)",
    navIcon: Users2,
    story:
      "البداية ما كانتش شركة ومكتب فخم.. البداية كانت 3 أصحاب كل واحد فيهم غرقان في ملعبه: واحد عينه ما بتفارقش شاشات الكود، والتاني بيعيد رسم تفصيلة بكسل 20 مرة عشان تطلع مظبوطة، والتالت شايل كاميرته وبيدور على كادر يحبس الأنفاس. اتجمعنا لما لقينا أصحاب البيزنس دايماً تائهين بين مبرمج مش فاهم ديزاين، وديزاينر مش حاسس بالبيزنس، وميديا شكلها باهت. قررنا ندمج الـ 3 قوى في فريق واحد اسمه FAME-X.. شريك يمسك مشروعك من أول فكرة لحد ما يسبق الكل.",
  },
  {
    id: "developer",
    code: "01",
    tabLabel: "المطوّر",
    badge: "SOFTWARE ARCHITECTURE // CH. 01",
    title: "SOFTWARE ARCHITECT",
    discipline: "FULL-STACK CLOUD ARCHITECT",
    avatar: "/characters/developer_v3.png",
    accentColor: "#a6f45d",
    ambientGlow: "rgba(166, 244, 93, 0.16)",
    navIcon: Terminal,
    quote: "الكود مش مجرد أسطر حروف.. الكود هو العمود الفقري اللي بيشيل أحلام بيزنسك وأنت نايم مرتاح.",
    story:
      "رحلتي بدأت من سنين طويلة لما كنت بقعد بالساعات أفكك البرامج وأتعلم إزاي السيرفرات بتشيل ملايين الطلبات في جزء من الثانية بدون ما تعطل. كنت دايماً بتضايق لما أشوف مشاريع واعدة بتفشل أو تخسر عملاء عشان موقعها بطيء أو بيهنج مع أول حملة إعلانية، ومن هنا اتولد هوسي بـ 'الكود النظيف والسرعة الصاروخية'. في FAME-X، أنا هنا عشان أضمن إن فكرتك تتحول لمنظومة برمجية فولاذية، سريعة طلقة، ومستقرة تحت أي ضغط زوار عشان بيزنسك يفضل دايماً في الصدارة.",
    impactTag: "البصمة الاستثنائية",
    impactTitle: "بنية تحتية فولاذية تتحمل أعتى ضغط زوار بدون أي تهنيج",
    impactDesc:
      "بناء منصات متقدمة بأعلى معايير الأمان وسرعة استجابة فائقة تنعكس مباشرة على ثقة العميل وتصدرك لمحركات البحث.",
    metrics: [
      { label: "سرعة المعالجة والتحميل الفوري", value: 99, icon: Zap },
      { label: "استقرار المنظومة وتحمل الضغط", value: 100, icon: Cpu },
      { label: "نقاء البنية البرمجية والأمان", value: 98, icon: ShieldCheck },
    ],
  },
  {
    id: "designer",
    code: "02",
    tabLabel: "المصمّم",
    badge: "UI/UX & INTERACTION // CH. 02",
    title: "UI/UX DESIGNER",
    discipline: "UI/UX & INTERACTION DIRECTOR",
    avatar: "/characters/designer_v3.png",
    accentColor: "#52c974",
    ambientGlow: "rgba(82, 201, 116, 0.16)",
    navIcon: Palette,
    quote: "التصميم الصح مش مجرد ألوان حلوة.. هو الكيمياء اللي بتخلي العميل يثق فيك ويشتري من أول لمسة.",
    story:
      "أول ما مسكت تابلت الرسم، فهمت إن عيون الناس بتفكر وتحس قبل عقولها. شوفت براندات كتيرة ومواقع بتموت في مهدها مش لأن فكرتها وحشة، بل لأن واجهتها باردة والعميل بيتوه فيها وبيقفل الصفحة في ثواني. قعدت أدرس سيكولوجية المستخدم وتأثير كل حركة وزرار ولون. دوري في مشروعك إني أخلق هوية وتجربة مستخدم تخطف العين من أول لمسة، وتخلي كل خطوة في موقعك بديهية ومريحة لدرجة إن عميلك يرتاح نفسياً ويتحول من مجرد زائر لمشتري دائم.",
    impactTag: "البصمة الاستثنائية",
    impactTitle: "واجهات وتجارب استخدام غامرة تضاعف التحويل والمبيعات",
    impactDesc:
      "صياغة هوية بصرية مريحة للعين وتدفق سلس للمعلومات يوجه العميل بسلاسة نحو اتخاذ القرار والشراء بدون أي تشتت.",
    metrics: [
      { label: "سلاسة رحلة العميل وسهولة الاستخدام", value: 99, icon: Layers },
      { label: "قوة الجاذبية البصرية وتميز الهوية", value: 98, icon: Sparkles },
      { label: "انسيابية الحركة والتفاعل الدقيق", value: 96, icon: Activity },
    ],
  },
  {
    id: "photographer",
    code: "03",
    tabLabel: "الكرييتف",
    badge: "CREATIVE & CINEMATIC // CH. 03",
    title: "CREATIVE DIRECTOR",
    discipline: "CINEMATIC & ADVERTISING PRODUCER",
    avatar: "/characters/photographer_v3.png",
    accentColor: "#38bdf8",
    ambientGlow: "rgba(56, 189, 248, 0.16)",
    navIcon: Camera,
    quote: "العالم مليان دوشة إعلانات.. شغلي إني أطلعك بصورة سينمائية توقف الكل وتخلق هيبة حقيقية لبيزنسك.",
    story:
      "الكاميرا بالنسبة لي ما كانتش مجرد عدسة.. الكاميرا هي العين التالتة اللي بتشوف القيمة الخفية في كل شيء. كان دايماً بيحز في نفسي لما أشوف أصحاب مشاريع تعبانين في منتجاتهم، بس معروضة بصور ومحتوى باهت ملوش روح يضيع قيمتها في السوق. كرست سنين لفهم سحر الضوء والإخراج السينمائي الإعلاني. أنا هنا عشان أبرز هيبة علامتك التجارية وأحكي قصة منتجك بصورة وفيديوهات سينمائية توقف أي حد بيسكرول على السوشيال ميديا وتخليه يثق في فخامة بيزنسك.",
    impactTag: "البصمة الاستثنائية",
    impactTitle: "إنتاج بصري سينمائي يمنح علامتك هيبة وفخامة لا تُنسى",
    impactDesc:
      "جلسات تصوير وفيديوهات إعلانية مبتكرة بزوايا وإضاءة سينمائية تركز على قيمة منتجك وتصنع تفاعلاً نارياً على السوشيال ميديا.",
    metrics: [
      { label: "دقة وجودة الإخراج السينمائي", value: 100, icon: Film },
      { label: "قوة التأثير وخطف انتباه الجمهور", value: 98, icon: Aperture },
      { label: "ابتكار الزوايا والإضاءة الإعلانية", value: 97, icon: Gauge },
    ],
  },
];

export default function StoryDialogue() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeChapterIndex, setActiveChapterIndex] = useState(0);

  // 📱 مرجع اللمس للسحب الأفقي على الموبايل
  const touchStartRef = useRef<{ x: number; y: number } | null>(null);

  // Track scroll progression through the sticky scrollytelling section (Desktop Only)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    // 🛑 على الموبايل: الاسكرول الرأسي لا يغير الكروت مطلقاً! (التغيير فقط بالسحب الأفقي يمين/شمال أو الأزرار)
    if (typeof window !== "undefined" && window.innerWidth < 768) {
      return;
    }

    let newIndex = 0;
    if (latest >= 0.75) {
      newIndex = 3;
    } else if (latest >= 0.5) {
      newIndex = 2;
    } else if (latest >= 0.22) {
      newIndex = 1;
    } else {
      newIndex = 0;
    }

    if (newIndex !== activeChapterIndex) {
      setActiveChapterIndex(newIndex);
    }
  });

  const handleSelectChapter = useCallback(
    (index: number) => {
      if (index === activeChapterIndex) return;
      playSelectSound(1.0 + index * 0.1);
      setActiveChapterIndex(index);

      // السكرول الناعم مقتصر فقط على شاشات الديسكتوب (md وأكبر)
      if (
        typeof window !== "undefined" &&
        window.innerWidth >= 768 &&
        containerRef.current
      ) {
        const rect = containerRef.current.getBoundingClientRect();
        const containerTop = window.scrollY + rect.top;
        const containerHeight = containerRef.current.offsetHeight;
        const scrollableDist = Math.max(containerHeight - window.innerHeight, 1);
        const targetScroll = containerTop + (index / (CHAPTERS.length - 1)) * scrollableDist;
        window.scrollTo({ top: targetScroll, behavior: "smooth" });
      }
    },
    [activeChapterIndex]
  );

  // 🎮 أزرار التحكم:
  // التالي (التقدم للأمام في القصة)
  const handleNext = useCallback(() => {
    const nextIdx = Math.min(activeChapterIndex + 1, CHAPTERS.length - 1);
    handleSelectChapter(nextIdx);
  }, [activeChapterIndex, handleSelectChapter]);

  // السابق (الرجوع للخلف في القصة)
  const handlePrev = useCallback(() => {
    const prevIdx = Math.max(activeChapterIndex - 1, 0);
    handleSelectChapter(prevIdx);
  }, [activeChapterIndex, handleSelectChapter]);

  // 👆 معالجة السحب الأفقي باللمس (مخصص للموبايل: يمين وشمال فقط بدون التأثير على الاسكرول الرأسي)
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartRef.current = {
      x: e.touches[0].clientX,
      y: e.touches[0].clientY,
    };
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!touchStartRef.current) return;
    const endX = e.changedTouches[0].clientX;
    const endY = e.changedTouches[0].clientY;

    const diffX = touchStartRef.current.x - endX;
    const diffY = touchStartRef.current.y - endY;

    // تفعيل التنقل فقط إذا كانت الحركة الأفقية واضحة وأكبر من الرأسية وتجاوزت عتبة 35 بكسل
    if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 35) {
      if (diffX > 0) {
        // سحب لليسار: رجوع للبطاقة السابقة (معكوس بناءً على رغبة المستخدم)
        handlePrev();
      } else {
        // سحب لليمين: تقدم للبطاقة التالية (معكوس بناءً على رغبة المستخدم)
        handleNext();
      }
    }
    touchStartRef.current = null;
  };

  // دعم أزرار الكيبورد (الأسهم و A/B)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        document.activeElement?.tagName === "INPUT" ||
        document.activeElement?.tagName === "TEXTAREA"
      ) {
        return;
      }
      // تحت / شمال / B = التقدم للأمام في القصة
      if (e.key === "ArrowDown" || e.key === "ArrowLeft" || e.key === "b" || e.key === "B") {
        e.preventDefault();
        handleNext();
      }
      // فوق / يمين / A = الرجوع للخلف في القصة
      else if (e.key === "ArrowUp" || e.key === "ArrowRight" || e.key === "a" || e.key === "A") {
        e.preventDefault();
        handlePrev();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleNext, handlePrev]);

  const currentChapter = CHAPTERS[activeChapterIndex];

  return (
    <div
      ref={containerRef}
      className="relative w-full md:min-h-[300vh] py-4 md:py-0 select-none"
      dir="rtl"
    >
      {/* 📌 CINEMATIC VIEWPORT (Sticky على الديسكتوب، Relative طبيعي على الموبايل لمنع احتجاز الاسكرول) */}
      <div className="relative md:sticky md:top-0 h-auto md:h-screen md:max-h-[780px] w-full flex flex-col justify-center py-2 sm:py-3 px-2 sm:px-3 overflow-hidden">
        {/* 🧭 Top HUD Header & Chapter Quick Bar */}
        <div className="relative z-20 w-full max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 pb-2 mb-1 border-b border-white/[0.08]">
          {/* Live Phase Indicator */}
          <div className="flex items-center gap-2">
            <span
              className="w-2 h-2 rounded-full animate-pulse shadow-sm"
              style={{ backgroundColor: currentChapter.accentColor }}
            />
            <span className="text-[11px] font-mono font-bold tracking-wider text-[#a8bda7] uppercase">
              {currentChapter.badge}
            </span>
          </div>

          {/* Quick Chapter Selector Pills */}
          <div className="flex items-center p-0.5 rounded-xl bg-black/60 border border-white/[0.08] backdrop-blur-md">
            {CHAPTERS.map((chap, idx) => {
              const isSelected = idx === activeChapterIndex;
              const Icon = chap.navIcon;

              return (
                <button
                  key={chap.id}
                  onClick={() => handleSelectChapter(idx)}
                  className={`relative flex items-center gap-1.5 px-2.5 sm:px-3 py-1 rounded-lg text-xs font-bold transition-colors ${
                    isSelected ? "text-white" : "text-[#7f9980] hover:text-white"
                  }`}
                >
                  {isSelected && (
                    <motion.div
                      layoutId="activeStoryPill"
                      className="absolute inset-0 rounded-lg bg-white/[0.1] border border-white/[0.14] shadow-sm"
                      transition={{ type: "spring", stiffness: 350, damping: 30 }}
                    />
                  )}
                  <span className="relative z-10 flex items-center gap-1">
                    <Icon className="w-3 h-3" style={{ color: chap.accentColor }} />
                    <span className="hidden sm:inline">{chap.tabLabel}</span>
                    <span className="text-[9px] font-mono opacity-60">{chap.code}</span>
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* 📱 MOBILE CHASSIS: FAME-X POCKET (يظهر فقط على شاشات الموبايل: جهاز مخصص بأبعاد رأسية + اتجاهات يمين وشمال فقط + سحب أفقي) */}
        <div className="block md:hidden relative z-10 w-full max-w-md mx-auto p-1">
          <div className="relative rounded-[28px] bg-gradient-to-b from-[#14281a] via-[#0d1a11] to-[#070e0a] border-2 border-[#1f3f26] shadow-[0_16px_40px_rgba(0,0,0,0.9),inset_0_1px_2px_rgba(255,255,255,0.14)] p-3 transition-all duration-700">
            {/* Ambient Background Glow */}
            <div
              className="absolute inset-0 rounded-[28px] blur-2xl opacity-20 pointer-events-none transition-colors duration-700"
              style={{ backgroundColor: currentChapter.accentColor }}
            />

            {/* Handheld Top Edge Status Bar */}
            <div className="flex items-center justify-between px-2 pb-2 mb-2 border-b border-[#1b3420] text-[9px] text-[#7d9b7f] font-mono">
              <div className="flex items-center gap-1.5">
                <span
                  className="w-2 h-2 rounded-full animate-pulse shadow-sm"
                  style={{ backgroundColor: currentChapter.accentColor }}
                />
                <span className="font-bold text-white tracking-wider">FAME-X POCKET DECK</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="px-1.5 py-0.5 rounded bg-white/[0.06] text-[#a6f45d] font-bold">
                  CH. {currentChapter.code}
                </span>
                <span className="flex items-center gap-0.5 text-[#7d9b7f]">
                  <Volume2 className="w-2.5 h-2.5" />
                  <span>SFX</span>
                </span>
              </div>
            </div>

            {/* 📺 The Mobile Screen: Swipeable Horizontally Only (touch-pan-y allows normal page scroll) */}
            <div
              onTouchStart={handleTouchStart}
              onTouchEnd={handleTouchEnd}
              className="relative rounded-xl bg-[#060c07] border-2 border-[#162a1a] p-3 overflow-hidden shadow-[inset_0_2px_12px_rgba(0,0,0,0.95)] touch-pan-y"
            >
              {/* CRT Scanline & Glass Glare Overlay */}
              <div
                className="absolute inset-0 opacity-[0.03] pointer-events-none z-20"
                style={{
                  backgroundImage: "linear-gradient(rgba(255,255,255,0.15) 1px, transparent 1px)",
                  backgroundSize: "100% 3px",
                }}
              />
              <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-tr from-transparent via-white/[0.02] to-transparent pointer-events-none z-20" />

              {/* Dynamic Screen Ambient Glow */}
              <div
                className="absolute -top-12 -right-12 w-48 h-48 rounded-full blur-[70px] pointer-events-none transition-colors duration-700 opacity-25"
                style={{ backgroundColor: currentChapter.accentColor }}
              />

              <AnimatePresence mode="wait">
                {/* ════════════ SCENE 00: THE SQUAD LINEUP (مشهد البداية على الموبايل) ════════════ */}
                {activeChapterIndex === 0 && (
                  <motion.div
                    key="mobile-intro-scene"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                    className="flex flex-col items-center text-center space-y-2 py-1"
                  >
                    <div className="space-y-1">
                      <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-white/[0.04] border border-white/[0.08] text-[9px] font-bold text-[#a6f45d] font-mono">
                        <Sparkles className="w-2.5 h-2.5 text-[#a6f45d]" />
                        <span>فريق FAME-X {"//"} الترويكا الرقمية</span>
                      </div>
                      <h3 className="text-base font-black text-white leading-snug">
                        {CHAPTERS[0].title}
                      </h3>
                      <p className="text-[10px] text-[#b8ccb5] leading-relaxed line-clamp-3 font-[family-name:var(--font-digital)]">
                        {CHAPTERS[0].story}
                      </p>
                    </div>

                    {/* 👥 The 3 Heroes Standing Together */}
                    <div className="grid grid-cols-3 gap-1.5 items-end justify-center w-full pt-1">
                      {/* Hero 1: Developer */}
                      <div
                        className="flex flex-col items-center cursor-pointer group"
                        onClick={() => handleSelectChapter(1)}
                      >
                        <div className="relative w-16 h-22 flex items-end justify-center transition-transform duration-200 group-hover:scale-105">
                          <Image
                            src="/characters/developer_v3.png"
                            alt="SOFTWARE ARCHITECT"
                            width={75}
                            height={100}
                            priority
                            className="object-contain max-h-full drop-shadow-[0_4px_8px_rgba(0,0,0,0.85)] [image-rendering:pixelated]"
                          />
                          <div className="absolute -bottom-1 w-12 h-2 bg-[#a6f45d]/20 rounded-full blur-sm" />
                        </div>
                        <div className="mt-1 px-1 py-0.5 rounded bg-white/[0.04] border border-white/[0.08] text-center w-full">
                          <p className="text-[7.5px] font-black text-white font-mono leading-tight truncate">
                            SOFTWARE ARCHITECT
                          </p>
                          <p className="text-[6.5px] text-[#a6f45d] font-mono uppercase font-bold">
                            LEAD DEV
                          </p>
                        </div>
                      </div>

                      {/* Hero 2: Designer (Center Stage) */}
                      <div
                        className="flex flex-col items-center cursor-pointer group -translate-y-1"
                        onClick={() => handleSelectChapter(2)}
                      >
                        <div className="relative w-18 h-24 flex items-end justify-center transition-transform duration-200 group-hover:scale-105">
                          <Image
                            src="/characters/designer_v3.png"
                            alt="UI/UX DESIGNER"
                            width={80}
                            height={110}
                            priority
                            className="object-contain max-h-full drop-shadow-[0_6px_10px_rgba(0,0,0,0.85)] [image-rendering:pixelated]"
                          />
                          <div className="absolute -bottom-1 w-14 h-2.5 bg-[#52c974]/25 rounded-full blur-sm" />
                        </div>
                        <div className="mt-1 px-1 py-0.5 rounded bg-[#52c974]/15 border border-[#52c974]/30 text-center w-full">
                          <p className="text-[7.5px] font-black text-white font-mono leading-tight truncate">
                            UI/UX DESIGNER
                          </p>
                          <p className="text-[6.5px] text-[#52c974] font-mono uppercase font-bold">
                            PRODUCT
                          </p>
                        </div>
                      </div>

                      {/* Hero 3: Photographer */}
                      <div
                        className="flex flex-col items-center cursor-pointer group"
                        onClick={() => handleSelectChapter(3)}
                      >
                        <div className="relative w-16 h-22 flex items-end justify-center transition-transform duration-200 group-hover:scale-105">
                          <Image
                            src="/characters/photographer_v3.png"
                            alt="CREATIVE DIRECTOR"
                            width={75}
                            height={100}
                            priority
                            className="object-contain max-h-full drop-shadow-[0_4px_8px_rgba(0,0,0,0.85)] [image-rendering:pixelated]"
                          />
                          <div className="absolute -bottom-1 w-12 h-2 bg-[#38bdf8]/20 rounded-full blur-sm" />
                        </div>
                        <div className="mt-1 px-1 py-0.5 rounded bg-white/[0.04] border border-white/[0.08] text-center w-full">
                          <p className="text-[7.5px] font-black text-white font-mono leading-tight truncate">
                            CREATIVE DIRECTOR
                          </p>
                          <p className="text-[6.5px] text-[#38bdf8] font-mono uppercase font-bold">
                            PRODUCER
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Micro Hint for Mobile */}
                    <div className="pt-1 flex items-center justify-center gap-1.5 text-[9px] text-[#7d9b7f] font-mono">
                      <span className="text-[#a6f45d]">◄</span>
                      <span>اسحب أفقياً أو استخدم الأزرار بالأسفل</span>
                      <span className="text-[#a6f45d]">►</span>
                    </div>
                  </motion.div>
                )}

                {/* ════════════ SCENES 01, 02, 03: INDIVIDUAL HERO CHAPTERS (على الموبايل) ════════════ */}
                {activeChapterIndex > 0 && (
                  <motion.div
                    key={`mobile-${currentChapter.id}`}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                    className="flex flex-col items-center text-center space-y-2 py-0.5"
                  >
                    {/* Quote Bubble */}
                    {currentChapter.quote && (
                      <div className="relative px-2.5 py-1 rounded-lg bg-white/[0.04] border border-white/[0.1] text-center max-w-xs shadow-sm">
                        <p className="text-[10px] font-semibold text-white leading-relaxed">
                          &ldquo;{currentChapter.quote}&rdquo;
                        </p>
                      </div>
                    )}

                    {/* Character Mascot & Light Pedestal */}
                    <div className="relative w-28 h-36 flex items-end justify-center my-0.5">
                      <Image
                        src={currentChapter.avatar}
                        alt={currentChapter.title}
                        width={130}
                        height={160}
                        priority
                        className="object-contain max-h-full drop-shadow-[0_8px_16px_rgba(0,0,0,0.85)] [image-rendering:pixelated] z-10"
                      />
                      <div
                        className="absolute -bottom-1 w-24 h-4 rounded-full blur-[2px] opacity-80"
                        style={{
                          background: `radial-gradient(ellipse at center, ${currentChapter.accentColor}70, transparent 70%)`,
                          boxShadow: `0 0 14px ${currentChapter.accentColor}50`,
                        }}
                      />
                    </div>

                    {/* Title & Technical Discipline */}
                    <div>
                      <h3 className="text-sm font-black text-white tracking-tight">
                        {currentChapter.title}
                      </h3>
                      <div className="inline-flex items-center gap-1 mt-0.5 px-2 py-0.5 rounded-full bg-white/[0.05] border border-white/[0.08]">
                        <span
                          className="w-1.5 h-1.5 rounded-full"
                          style={{ backgroundColor: currentChapter.accentColor }}
                        />
                        <span className="text-[8px] font-mono tracking-wider text-[#a8bda7] uppercase font-bold">
                          {currentChapter.discipline}
                        </span>
                      </div>
                    </div>

                    {/* Story Narrative */}
                    <p className="text-[10px] text-[#c8dcc4] leading-relaxed text-right font-[family-name:var(--font-digital)] bg-white/[0.02] p-2 rounded-lg border border-white/[0.06] w-full">
                      {currentChapter.story}
                    </p>

                    {/* Performance Metrics */}
                    {currentChapter.metrics && (
                      <div className="w-full space-y-1.5 pt-0.5 text-right">
                        {currentChapter.metrics.map((metric) => {
                          const Icon = metric.icon;
                          return (
                            <div key={metric.label} className="space-y-0.5">
                              <div className="flex items-center justify-between text-[9px]">
                                <span className="text-[#d8ebd5] font-medium flex items-center gap-1">
                                  <Icon
                                    className="w-2.5 h-2.5"
                                    style={{ color: currentChapter.accentColor }}
                                  />
                                  <span>{metric.label}</span>
                                </span>
                                <span className="font-mono text-[9px] font-bold text-white">
                                  {metric.value}%
                                </span>
                              </div>
                              <div className="h-1 w-full bg-white/[0.05] rounded-full overflow-hidden border border-white/[0.06]">
                                <motion.div
                                  className="h-full rounded-full"
                                  initial={{ width: 0 }}
                                  animate={{ width: `${metric.value}%` }}
                                  transition={{ duration: 0.8 }}
                                  style={{
                                    backgroundColor: currentChapter.accentColor,
                                    boxShadow: `0 0 6px ${currentChapter.accentColor}60`,
                                  }}
                                />
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* 🕹️ The Mobile Controls Deck: اتجاهات يمين وشمال فقط */}
            <div className="mt-3 pt-2.5 border-t border-[#1a3520] flex flex-col items-center gap-2.5">
              {/* Directional Two-Way Bar: اتجاهات يمين وشمال فقط */}
              <div className="w-full flex items-center justify-between px-1">
                {/* زر اليمين: السابق (Previous) */}
                <button
                  onClick={handlePrev}
                  disabled={activeChapterIndex === 0}
                  aria-label="Previous Chapter"
                  className={`relative flex items-center gap-1.5 px-3.5 py-2 rounded-xl border font-mono text-xs font-bold transition-all duration-200 active:scale-95 ${
                    activeChapterIndex === 0
                      ? "border-[#142817] bg-[#08120a] text-[#344b36] cursor-not-allowed opacity-40"
                      : "border-[#254b2b] bg-gradient-to-r from-[#142918] to-[#0c1a10] text-white hover:border-[#a6f45d] shadow-[0_4px_12px_rgba(0,0,0,0.6)] cursor-pointer"
                  }`}
                >
                  <span className="text-sm font-black text-[#a6f45d]">▶</span>
                  <span>السابق</span>
                </button>

                {/* مؤشر رقم الفصل الديجيتال بالمنتصف */}
                <div className="flex flex-col items-center px-3 py-1 rounded-lg bg-[#070e09] border border-[#1b3420] shadow-inner">
                  <span className="text-[7.5px] font-mono text-[#6c876e] uppercase">CHAPTER</span>
                  <span
                    className="text-xs font-mono font-black"
                    style={{ color: currentChapter.accentColor }}
                  >
                    {currentChapter.code} / 03
                  </span>
                </div>

                {/* زر الشمال: التالي (Next) */}
                <button
                  onClick={handleNext}
                  disabled={activeChapterIndex === CHAPTERS.length - 1}
                  aria-label="Next Chapter"
                  className={`relative flex items-center gap-1.5 px-3.5 py-2 rounded-xl border font-mono text-xs font-bold transition-all duration-200 active:scale-95 ${
                    activeChapterIndex === CHAPTERS.length - 1
                      ? "border-[#142817] bg-[#08120a] text-[#344b36] cursor-not-allowed opacity-40"
                      : "border-[#254b2b] bg-gradient-to-l from-[#142918] to-[#0c1a10] text-white hover:border-[#a6f45d] shadow-[0_4px_12px_rgba(0,0,0,0.6)] cursor-pointer"
                  }`}
                >
                  <span>التالي</span>
                  <span className="text-sm font-black text-[#a6f45d]">◀</span>
                </button>
              </div>

              {/* Direct Chapter Selection Dots */}
              <div className="flex items-center gap-2 pt-0.5">
                {CHAPTERS.map((chap, i) => (
                  <button
                    key={chap.id}
                    onClick={() => handleSelectChapter(i)}
                    aria-label={`Jump to chapter ${chap.code}`}
                    className={`h-1.5 rounded-full transition-all duration-300 ${
                      i === activeChapterIndex
                        ? "w-6 shadow-sm"
                        : "w-2 bg-white/20 hover:bg-white/40"
                    }`}
                    style={{
                      backgroundColor: i === activeChapterIndex ? currentChapter.accentColor : undefined,
                    }}
                  />
                ))}
              </div>

              {/* Bottom Console Badge & Retro Speaker Vents */}
              <div className="w-full flex items-center justify-between pt-1 border-t border-[#132717] text-[8px] font-mono text-[#526f54]">
                <span>FAME-X POCKET // D-PAD 2-WAY</span>
                <div className="flex items-center gap-1">
                  <div className="w-3.5 h-0.5 bg-[#254429] rounded-full" />
                  <div className="w-3.5 h-0.5 bg-[#254429] rounded-full" />
                  <div className="w-3.5 h-0.5 bg-[#254429] rounded-full" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 💻 DESKTOP CHASSIS: THE FAME-X CYBER DECK (يظهر فقط على الشاشات المتوسطة والكبيرة md+) */}
        <div className="hidden md:block relative z-10 w-full max-w-4xl mx-auto p-1">
          {/* Handheld Device Chassis (هيكل مدمج وخفيف) */}
          <div className="relative rounded-[24px] sm:rounded-[36px] bg-gradient-to-b from-[#112316] via-[#0b170e] to-[#070e09] border-2 border-[#1d3822] shadow-[0_16px_40px_rgba(0,0,0,0.85),inset_0_1px_2px_rgba(255,255,255,0.12)] p-2.5 sm:p-4 transition-all duration-700">
            {/* Ambient Back Glow */}
            <div
              className="absolute inset-0 rounded-[36px] blur-3xl opacity-20 pointer-events-none transition-colors duration-700"
              style={{ backgroundColor: currentChapter.accentColor }}
            />

            {/* Handheld Top Edge Status Bar */}
            <div className="flex items-center justify-between px-2 sm:px-3 pb-2 border-b border-[#1b3420] text-[9px] sm:text-[10px] text-[#7d9b7f] font-mono">
              <div className="flex items-center gap-1.5">
                <span
                  className="w-1.5 h-1.5 rounded-full animate-ping"
                  style={{ backgroundColor: currentChapter.accentColor }}
                />
                <span className="font-bold text-white tracking-wider">FAME-X DECK {"//"} STORY MODE</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="hidden sm:inline">CH. {currentChapter.code} {"//"} REEL ACTIVE</span>
                <span className="flex items-center gap-1 text-[#a6f45d]">
                  <Volume2 className="w-3 h-3" />
                  <span>STEREO</span>
                </span>
              </div>
            </div>

            {/* Main Handheld Body: Split into [D-PAD Controls] + [Screen Display] + [Action Buttons] */}
            <div className="relative mt-2 grid grid-cols-1 md:grid-cols-12 gap-2 sm:gap-3 items-center">
              {/* 🕹️ Left Controls Deck (D-Pad & Stereo Grills) */}
              <div className="hidden md:flex md:col-span-1 flex-col items-center justify-center space-y-4">
                {/* Directional Pad (D-Pad) */}
                <div className="relative w-11 h-11 rounded-lg bg-[#09140c] border border-[#203c26] p-1 shadow-inner flex flex-col justify-between items-center">
                  {/* سهم لفوق: رجوع للخلف */}
                  <button
                    onClick={handlePrev}
                    aria-label="Up - Prev Chapter"
                    className="w-3.5 h-3 bg-[#172e1c] hover:bg-[#a6f45d] hover:text-black rounded-t text-[7px] flex items-center justify-center transition-colors text-white font-bold"
                  >
                    ▲
                  </button>
                  <div className="w-full flex justify-between">
                    {/* سهم شمال: تقدم للأمام */}
                    <button
                      onClick={handleNext}
                      aria-label="Left - Next Chapter"
                      className="w-3 h-3.5 bg-[#172e1c] hover:bg-[#a6f45d] hover:text-black rounded-l text-[7px] flex items-center justify-center transition-colors text-white font-bold"
                    >
                      ◀
                    </button>
                    <div className="w-2.5 h-2.5 bg-[#0d1e11] rounded-full" />
                    {/* سهم يمين: رجوع للخلف */}
                    <button
                      onClick={handlePrev}
                      aria-label="Right - Prev Chapter"
                      className="w-3 h-3.5 bg-[#172e1c] hover:bg-[#a6f45d] hover:text-black rounded-r text-[7px] flex items-center justify-center transition-colors text-white font-bold"
                    >
                      ▶
                    </button>
                  </div>
                  {/* سهم تحت: تقدم للأمام */}
                  <button
                    onClick={handleNext}
                    aria-label="Down - Next Chapter"
                    className="w-3.5 h-3 bg-[#172e1c] hover:bg-[#a6f45d] hover:text-black rounded-b text-[7px] flex items-center justify-center transition-colors text-white font-bold"
                  >
                    ▼
                  </button>
                </div>

                {/* Speaker Grill Slits */}
                <div className="space-y-1 opacity-40">
                  <div className="w-5 h-0.5 bg-[#7d9b7f] rounded-full" />
                  <div className="w-5 h-0.5 bg-[#7d9b7f] rounded-full" />
                  <div className="w-5 h-0.5 bg-[#7d9b7f] rounded-full" />
                </div>
              </div>

              {/* 📺 The Handheld Screen Bezel & Display (شاشة الكونسول المدمجة) */}
              <div className="md:col-span-10 relative rounded-xl sm:rounded-2xl bg-[#060c07] border-2 border-[#162a1a] p-3 sm:p-5 overflow-hidden shadow-[inset_0_2px_12px_rgba(0,0,0,0.95)]">
                {/* CRT Scanline & Glass Glare Overlay */}
                <div
                  className="absolute inset-0 opacity-[0.03] pointer-events-none z-20"
                  style={{
                    backgroundImage: "linear-gradient(rgba(255,255,255,0.15) 1px, transparent 1px)",
                    backgroundSize: "100% 3px",
                  }}
                />
                <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-tr from-transparent via-white/[0.02] to-transparent pointer-events-none z-20" />

                {/* Dynamic Screen Ambient Glow */}
                <div
                  className="absolute -top-20 -right-20 w-64 h-64 rounded-full blur-[90px] pointer-events-none transition-colors duration-700 opacity-30"
                  style={{ backgroundColor: currentChapter.accentColor }}
                />

                <AnimatePresence mode="wait">
                  {/* ════════════ SCENE 00: THE SQUAD LINEUP (المشهد الترحيبي الأول) ════════════ */}
                  {activeChapterIndex === 0 && (
                    <motion.div
                      key="intro-scene"
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -12 }}
                      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                      className="flex flex-col items-center text-center space-y-3 sm:space-y-4 py-1"
                    >
                      <div className="max-w-xl mx-auto space-y-1.5">
                        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/[0.04] border border-white/[0.08] text-[10px] font-bold text-[#a6f45d] font-mono">
                          <Sparkles className="w-2.5 h-2.5 text-[#a6f45d]" />
                          <span>فريق FAME-X {"//"} الترويكا الرقمية</span>
                        </div>
                        <h3 className="text-lg sm:text-2xl font-black text-white tracking-tight leading-snug">
                          {CHAPTERS[0].title}
                        </h3>
                        <p className="text-[11px] sm:text-xs text-[#b8ccb5] leading-relaxed font-[family-name:var(--font-digital)]">
                          {CHAPTERS[0].story}
                        </p>
                      </div>

                      {/* 👥 The 3 Heroes Standing Together */}
                      <div className="grid grid-cols-3 gap-2 sm:gap-4 items-end justify-center w-full max-w-md mx-auto pt-1">
                        {/* Hero 1: Developer */}
                        <div
                          className="flex flex-col items-center group cursor-pointer"
                          onClick={() => handleSelectChapter(1)}
                        >
                          <div className="relative w-20 sm:w-26 h-28 sm:h-38 flex items-end justify-center transition-transform duration-300 group-hover:scale-105">
                            <Image
                              src="/characters/developer_v3.png"
                              alt="SOFTWARE ARCHITECT"
                              width={110}
                              height={150}
                              priority
                              className="object-contain max-h-full drop-shadow-[0_8px_14px_rgba(0,0,0,0.85)] [image-rendering:pixelated]"
                            />
                            <div className="absolute -bottom-1 w-16 h-2.5 bg-[#a6f45d]/20 rounded-full blur-sm" />
                          </div>
                          <div className="mt-1.5 px-2 py-0.5 rounded bg-white/[0.04] border border-white/[0.08] text-center">
                            <p className="text-[8.5px] sm:text-[10px] font-black text-white font-mono tracking-tight sm:tracking-wider whitespace-nowrap">
                              SOFTWARE ARCHITECT
                            </p>
                            <p className="text-[7.5px] sm:text-[8.5px] text-[#a6f45d] font-mono uppercase tracking-widest font-bold">
                              LEAD DEVELOPER
                            </p>
                          </div>
                        </div>

                        {/* Hero 2: Designer (Center Stage) */}
                        <div
                          className="flex flex-col items-center group cursor-pointer -translate-y-1"
                          onClick={() => handleSelectChapter(2)}
                        >
                          <div className="relative w-22 sm:w-28 h-30 sm:h-42 flex items-end justify-center transition-transform duration-300 group-hover:scale-105">
                            <Image
                              src="/characters/designer_v3.png"
                              alt="UI/UX DESIGNER"
                              width={120}
                              height={160}
                              priority
                              className="object-contain max-h-full drop-shadow-[0_10px_16px_rgba(0,0,0,0.85)] [image-rendering:pixelated]"
                            />
                            <div className="absolute -bottom-1 w-20 h-3 bg-[#52c974]/25 rounded-full blur-sm" />
                          </div>
                          <div className="mt-1.5 px-2.5 py-0.5 rounded bg-[#52c974]/10 border border-[#52c974]/30 text-center shadow-sm">
                            <p className="text-[8.5px] sm:text-[10px] font-black text-white font-mono tracking-tight sm:tracking-wider whitespace-nowrap">
                              UI/UX DESIGNER
                            </p>
                            <p className="text-[7.5px] sm:text-[8.5px] text-[#52c974] font-mono uppercase tracking-widest font-bold">
                              PRODUCT DESIGN
                            </p>
                          </div>
                        </div>

                        {/* Hero 3: Photographer */}
                        <div
                          className="flex flex-col items-center group cursor-pointer"
                          onClick={() => handleSelectChapter(3)}
                        >
                          <div className="relative w-20 sm:w-26 h-28 sm:h-38 flex items-end justify-center transition-transform duration-300 group-hover:scale-105">
                            <Image
                              src="/characters/photographer_v3.png"
                              alt="CREATIVE DIRECTOR"
                              width={110}
                              height={150}
                              priority
                              className="object-contain max-h-full drop-shadow-[0_8px_14px_rgba(0,0,0,0.85)] [image-rendering:pixelated]"
                            />
                            <div className="absolute -bottom-1 w-16 h-2.5 bg-[#38bdf8]/20 rounded-full blur-sm" />
                          </div>
                          <div className="mt-1.5 px-2 py-0.5 rounded bg-white/[0.04] border border-white/[0.08] text-center">
                            <p className="text-[8.5px] sm:text-[10px] font-black text-white font-mono tracking-tight sm:tracking-wider whitespace-nowrap">
                              CREATIVE DIRECTOR
                            </p>
                            <p className="text-[7.5px] sm:text-[8.5px] text-[#38bdf8] font-mono uppercase tracking-widest font-bold">
                              MEDIA PRODUCER
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Micro Scroll Hint */}
                      <div className="pt-0.5 flex items-center justify-center gap-1.5 text-[11px] font-medium text-[#7d9b7f] animate-bounce">
                        <span>اسكرول أو استخدم أزرار الجهاز لتشغيل القصة</span>
                        <ChevronDown className="w-3 h-3 text-[#a6f45d]" />
                      </div>
                    </motion.div>
                  )}

                  {/* ════════════ SCENES 01, 02, 03: INDIVIDUAL HERO CHAPTERS ════════════ */}
                  {activeChapterIndex > 0 && (
                    <motion.div
                      key={currentChapter.id}
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -12 }}
                      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                      className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-6 items-center"
                    >
                      {/* Character Mascot & Light Stage (5 cols) */}
                      <div className="lg:col-span-5 flex flex-col items-center justify-center">
                        {currentChapter.quote && (
                          <div className="relative mb-2 max-w-xs w-full">
                            <div className="relative z-10 px-3 py-1.5 rounded-lg bg-white/[0.04] border border-white/[0.1] backdrop-blur-md shadow-md text-center">
                              <Quote
                                className="w-2.5 h-2.5 mb-0.5 opacity-60 mx-auto"
                                style={{ color: currentChapter.accentColor }}
                              />
                              <p className="text-[11px] sm:text-xs font-semibold text-white leading-relaxed">
                                {currentChapter.quote}
                              </p>
                            </div>
                            <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 rotate-45 bg-[#0e1710] border-r border-b border-white/[0.1] z-0" />
                          </div>
                        )}

                        <motion.div
                          animate={{ y: [0, -4, 0] }}
                          transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
                          className="relative w-32 h-44 sm:w-44 sm:h-56 flex items-end justify-center"
                        >
                          <Image
                            src={currentChapter.avatar}
                            alt={currentChapter.title}
                            width={180}
                            height={220}
                            priority
                            className="object-contain max-h-full drop-shadow-[0_12px_24px_rgba(0,0,0,0.85)] [image-rendering:pixelated] z-10"
                          />

                          <div
                            className="absolute -bottom-2 w-32 sm:w-40 h-6 rounded-full blur-[2px] border border-white/20 -z-0 opacity-80"
                            style={{
                              background: `radial-gradient(ellipse at center, ${currentChapter.accentColor}50, transparent 70%)`,
                              boxShadow: `0 0 20px ${currentChapter.accentColor}40`,
                            }}
                          />
                        </motion.div>

                        <div className="mt-2 inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/[0.04] border border-white/[0.08]">
                          <span
                            className="w-1.5 h-1.5 rounded-full"
                            style={{ backgroundColor: currentChapter.accentColor }}
                          />
                          <span className="text-[9px] sm:text-[10px] font-mono tracking-wider text-[#a8bda7] uppercase font-bold">
                            {currentChapter.discipline}
                          </span>
                        </div>
                      </div>

                      {/* Story Narrative & Performance Readout (7 cols) */}
                      <div className="lg:col-span-7 flex flex-col justify-center">
                        <div className="mb-2">
                          <div className="flex items-center gap-1.5 mb-0.5">
                            <span
                              className="text-[9px] font-bold font-mono px-1.5 py-0.2 rounded bg-white/[0.06] border border-white/[0.08]"
                              style={{ color: currentChapter.accentColor }}
                            >
                              CARTRIDGE {"//"} {currentChapter.code}
                            </span>
                            <span className="text-[11px] text-[#8fa88d] font-medium">
                              {currentChapter.badge.split("//")[0]}
                            </span>
                          </div>
                          <h3 className="text-lg sm:text-xl font-black text-white tracking-tight">
                            {currentChapter.title}
                          </h3>
                        </div>

                        {/* Personal Human Story */}
                        <p className="text-[11px] sm:text-xs text-[#c8dcc4] leading-relaxed mb-3 font-[family-name:var(--font-digital)] bg-white/[0.02] p-2.5 sm:p-3 rounded-lg border border-white/[0.06]">
                          {currentChapter.story}
                        </p>

                        {/* Performance Metrics */}
                        {currentChapter.metrics && (
                          <div className="space-y-2 mb-3">
                            {currentChapter.metrics.map((metric) => {
                              const Icon = metric.icon;

                              return (
                                <div key={metric.label} className="space-y-0.5">
                                  <div className="flex items-center justify-between text-[11px]">
                                    <span className="text-[#d8ebd5] font-medium flex items-center gap-1.5">
                                      <span className="w-3.5 h-3.5 rounded bg-white/[0.04] border border-white/[0.08] flex items-center justify-center shrink-0">
                                        <Icon
                                          className="w-2 h-2"
                                          style={{ color: currentChapter.accentColor }}
                                        />
                                      </span>
                                      <span>{metric.label}</span>
                                    </span>
                                    <span className="font-mono text-[10px] font-bold text-white">
                                      {metric.value}%
                                    </span>
                                  </div>

                                  <div className="relative h-1.5 w-full bg-white/[0.05] rounded-full overflow-hidden border border-white/[0.06]">
                                    <motion.div
                                      className="h-full rounded-full"
                                      initial={{ width: 0 }}
                                      animate={{ width: `${metric.value}%` }}
                                      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                                      style={{
                                        backgroundColor: currentChapter.accentColor,
                                        boxShadow: `0 0 8px ${currentChapter.accentColor}60`,
                                      }}
                                    />
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        )}

                        {/* Impact Card */}
                        {currentChapter.impactTitle && (
                          <div className="p-2 sm:p-2.5 rounded-lg bg-white/[0.03] border border-white/[0.08] relative overflow-hidden backdrop-blur-sm">
                            <div className="flex items-center gap-1.5 mb-0.5">
                              <span
                                className="text-[8px] sm:text-[9px] font-mono font-bold px-1 py-0.2 rounded uppercase"
                                style={{
                                  backgroundColor: `${currentChapter.accentColor}20`,
                                  color: currentChapter.accentColor,
                                  border: `1px solid ${currentChapter.accentColor}40`,
                                }}
                              >
                                {currentChapter.impactTag}
                              </span>
                              <h4 className="text-xs font-bold text-white">
                                {currentChapter.impactTitle}
                              </h4>
                            </div>
                            <p className="text-[10px] sm:text-[11px] text-[#a3bfa0] leading-relaxed">
                              {currentChapter.impactDesc}
                            </p>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* 🕹️ Right Controls Deck (Action Buttons A / B & Speaker) */}
              <div className="hidden md:flex md:col-span-1 flex-col items-center justify-center space-y-4">
                {/* Tactile Retro Action Buttons */}
                <div className="flex flex-col items-center space-y-2.5">
                  <button
                    onClick={handlePrev}
                    aria-label="Previous Chapter (A)"
                    className="w-8 h-8 rounded-full border-2 border-[#203c26] bg-gradient-to-b from-[#142817] to-[#0b170e] hover:border-[#7d9b7f] text-[#7d9b7f] font-mono font-black text-[10px] shadow-md active:scale-90 transition-all flex items-center justify-center"
                  >
                    A
                  </button>
                  <button
                    onClick={handleNext}
                    aria-label="Next Chapter (B)"
                    className="w-8 h-8 rounded-full border-2 border-[#2b5233] bg-gradient-to-b from-[#1b3d23] to-[#0f2414] hover:border-[#a6f45d] text-[#a6f45d] font-mono font-black text-[10px] shadow-md active:scale-90 transition-all flex items-center justify-center"
                  >
                    B
                  </button>
                </div>

                {/* Speaker Grill Slits */}
                <div className="space-y-1 opacity-40">
                  <div className="w-5 h-0.5 bg-[#7d9b7f] rounded-full" />
                  <div className="w-5 h-0.5 bg-[#7d9b7f] rounded-full" />
                  <div className="w-5 h-0.5 bg-[#7d9b7f] rounded-full" />
                </div>
              </div>
            </div>

            {/* Handheld Bottom Bevel with Jack and Serial */}
            <div className="mt-2 pt-2 border-t border-[#1b3420] flex items-center justify-between text-[8px] sm:text-[9px] text-[#5e7760] font-mono">
              <span>HEADPHONES {"//"} 3.5MM</span>
              <div className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[#a6f45d]/40" />
                <span>SN: FAME-X-STORY-2026</span>
              </div>
            </div>
          </div>
        </div>

        {/* 🧭 Bottom Chapter Progression Dots (يظهر فقط على الديسكتوب) */}
        <div className="hidden md:flex relative z-20 w-full max-w-4xl mx-auto items-center justify-between pt-1.5 border-t border-white/[0.06] text-[11px] text-[#7d9b7f]">
          <div className="flex items-center gap-1.5">
            <span>الفصل:</span>
            <span className="font-mono font-bold text-white">
              {currentChapter.code} / 03
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            {CHAPTERS.map((_, i) => (
              <button
                key={i}
                onClick={() => handleSelectChapter(i)}
                aria-label={`Go to chapter ${i}`}
                className={`h-1 rounded-full transition-all duration-300 ${
                  i === activeChapterIndex
                    ? "w-6 bg-white"
                    : "w-1.5 bg-white/20 hover:bg-white/40"
                }`}
                style={{
                  backgroundColor: i === activeChapterIndex ? currentChapter.accentColor : undefined,
                }}
              />
            ))}
          </div>

          <div className="flex items-center gap-1 font-mono text-[10px]">
            <span>SCROLL OR USE BUTTONS</span>
            <span className="text-[#a6f45d]">↓</span>
          </div>
        </div>
      </div>
    </div>
  );
}
