"use client";

import { Camera, Code2, Smartphone, Sparkles } from "lucide-react";
import { useEffect, useRef } from "react";

type WirePoint = { x: number; y: number };

const services = [
  {
    title: "أبلكيشن موبايل طلقة",
    description: "تطبيق سريع وخفيف على iOS وAndroid، عميلك هيفتحه كل يوم ويفضل معاه.. مريح ومفهوش تعقيد.",
    Icon: Smartphone,
  },
  {
    title: "مواقع تفتح النفس وتبيع",
    description: "موقعك هو واجهتك الأولى.. بنبنيه سريع زي الصاروخ، يشرفك قدام زباينك ويحوّل الزائر لمشتري فوري.",
    Icon: Code2,
  },
  {
    title: "هوية كاملة تثبت في الدماغ",
    description: "لوجو وديزاين كامل بيخلّي براندك ليه هيبة وشخصية تفرّقك عن أي منافس.. العميل يشوفه يعلّم معاه على طول.",
    Icon: Sparkles,
  },
  {
    title: "محتوى يخطف العين والقلب",
    description: "تصوير وموشن جرافيك يبرز جمال منتجك ويحكي قصتك بأسلوب يخلي العميل يوقف سكرول ويطلب فوراً.",
    Icon: Camera,
  },
];

export default function Services() {
  const sectionRef = useRef<HTMLElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const glowRef = useRef<SVGPathElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const path = pathRef.current;
    const glow = glowRef.current;
    if (!section || !path || !glow) return;

    let animationFrame = 0;
    let pathLength = 0;

    const updateWire = () => {
      const svg = path.ownerSVGElement;
      const cards = Array.from(
        section.querySelectorAll<HTMLElement>(".services__card"),
      );
      if (!svg || cards.length !== services.length) return;

      const svgBounds = svg.getBoundingClientRect();
      const isDesktop = window.matchMedia("(min-width: 641px)").matches;
      const getPoint = (
        card: HTMLElement,
        side: "center" | "left" | "right" | "top" | "bottom",
      ) => {
        const bounds = card.getBoundingClientRect();
        if (side === "left" || side === "right") {
          return {
            x: (side === "left" ? bounds.left : bounds.right) - svgBounds.left,
            y: bounds.top + bounds.height / 2 - svgBounds.top,
          };
        }
        if (side === "center") {
          return {
            x: bounds.left + bounds.width / 2 - svgBounds.left,
            y: bounds.top + bounds.height / 2 - svgBounds.top,
          };
        }
        return {
          x: bounds.left + bounds.width / 2 - svgBounds.left,
          y: (side === "top" ? bounds.top : bounds.bottom) - svgBounds.top,
        };
      };
      let points: WirePoint[];
      if (isDesktop) {
        points = cards.map((card) => getPoint(card, "center"));
      } else {
        points = cards.map((card) => getPoint(card, "center"));
      }
      svg.setAttribute(
        "viewBox",
        `0 0 ${Math.max(1, svgBounds.width)} ${Math.max(1, svgBounds.height)}`,
      );
      path.setAttribute(
        "d",
        points
          .map(
            (point, index) =>
              `${index === 0 ? "M" : "L"} ${point.x} ${point.y}`,
          )
          .join(" "),
      );
      pathLength = path.getTotalLength();
      updateProgress();
    };

    const updateProgress = () => {
      cancelAnimationFrame(animationFrame);
      animationFrame = requestAnimationFrame(() => {
        const bounds = section.getBoundingClientRect();
        const isDesktop = window.matchMedia("(min-width: 641px)").matches;
        if (!pathLength) return;

        const isMobile = window.matchMedia("(max-width: 640px)").matches;
        const glowLength = Math.min(isMobile ? 88 : 34, pathLength);
        let center: number;
        if (isDesktop) {
          const sectionRange = Math.max(section.offsetHeight - window.innerHeight, 1);
          const progress = Math.min(1, Math.max(0, -bounds.top / sectionRange));
          center = progress * pathLength;
        } else {
          const svgTop = path.ownerSVGElement?.getBoundingClientRect().top ?? bounds.top;
          center = window.innerHeight * 0.58 - svgTop;
          if (center < 0 || center > pathLength) {
            glow.setAttribute("d", "");
            return;
          }
        }
        const start = path.getPointAtLength(Math.max(0, center - glowLength / 2));
        const end = path.getPointAtLength(Math.min(pathLength, center + glowLength / 2));
        glow.setAttribute("d", `M ${start.x} ${start.y} L ${end.x} ${end.y}`);
      });
    };

    const resizeObserver = new ResizeObserver(updateWire);
    resizeObserver.observe(section);
    section.querySelectorAll(".services__card").forEach((card) =>
      resizeObserver.observe(card),
    );
    updateWire();
    window.addEventListener("scroll", updateProgress, { passive: true });
    window.addEventListener("resize", updateWire);

    return () => {
      cancelAnimationFrame(animationFrame);
      resizeObserver.disconnect();
      window.removeEventListener("scroll", updateProgress);
      window.removeEventListener("resize", updateWire);
    };
  }, []);

  return (
    <section className="section services" id="services" ref={sectionRef}>
      <div className="container services__sticky">
        <div className="section__heading">
          <p className="eyebrow">بنقدملك إيه؟</p>
          <h2 className="section__title">كل اللي محتاجه عشان فكرتك تطير في السما.</h2>
          <p className="section__intro">
            خدمات متفصلة على مقاس بيزنسك بالملّي.. بنجمع بين الشياكة في الديزاين وسرعة الصاروخ في البرمجة عشان تبيع وتنتشر صح.
          </p>
        </div>
        <div className="services__path">
          <svg className="services__wire" aria-hidden="true" focusable="false">
            <path className="services__wire-base" ref={pathRef} />
            <path className="services__wire-glow" ref={glowRef} />
          </svg>
          <div className="services__cards">
            {services.map(({ title, description, Icon }, index) => (
              <article className="card services__card" key={title}>
                <div className="card__topline">
                  <span className="card__level" dir="ltr">
                    STAGE 0{index + 1}
                  </span>
                  <span className="card__status" dir="ltr">
                    READY
                  </span>
                </div>
                <span className="card__icon">
                  <Icon size={22} strokeWidth={1.8} aria-hidden="true" />
                </span>
                <h3 className="card__title">{title}</h3>
                <p className="card__text">{description}</p>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
