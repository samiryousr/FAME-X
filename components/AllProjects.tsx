"use client";

import Link from "next/link";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { useEffect, useRef } from "react";
import { ProjectScreen, projects } from "@/components/Projects";

type WirePoint = { x: number; y: number };
type WireSegment = { start: WirePoint; end: WirePoint; length: number };

export default function AllProjects() {
  const gridRef = useRef<HTMLElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const glowRef = useRef<SVGPathElement>(null);
  const segmentsRef = useRef<WireSegment[]>([]);

  useEffect(() => {
    const grid = gridRef.current;
    const path = pathRef.current;
    const glow = glowRef.current;
    if (!grid || !path || !glow) return;
    let animationFrame = 0;

    const updateProgress = () => {
      cancelAnimationFrame(animationFrame);
      animationFrame = requestAnimationFrame(() => {
        const segments = segmentsRef.current;
        if (!segments.length) return;
        const bounds = grid.getBoundingClientRect();
        const center = window.innerHeight * 0.58 - bounds.top;
        if (center < 0 || center > bounds.height) {
          glow.setAttribute("d", "");
          return;
        }

        const progress = Math.min(1, Math.max(0, center / bounds.height));
        let distance = progress * segments.reduce(
          (total, segment) => total + segment.length,
          0,
        );
        let activeSegment = segments[segments.length - 1];
        let segmentDistance = activeSegment.length;
        for (const segment of segments) {
          if (distance <= segment.length) {
            activeSegment = segment;
            segmentDistance = distance;
            break;
          }
          distance -= segment.length;
        }

        const glowLength = Math.min(
          window.matchMedia("(max-width: 640px)").matches ? 88 : 34,
          activeSegment.length,
        );
        const startDistance = Math.max(0, segmentDistance - glowLength / 2);
        const endDistance = Math.min(
          activeSegment.length,
          segmentDistance + glowLength / 2,
        );
        const pointAt = (distance: number) => {
          const progress = distance / activeSegment.length;
          return {
            x:
              activeSegment.start.x +
              (activeSegment.end.x - activeSegment.start.x) * progress,
            y:
              activeSegment.start.y +
              (activeSegment.end.y - activeSegment.start.y) * progress,
          };
        };
        const start = pointAt(startDistance);
        const end = pointAt(endDistance);
        glow.setAttribute("d", `M ${start.x} ${start.y} L ${end.x} ${end.y}`);
      });
    };

    const updateWire = () => {
      const svg = path.ownerSVGElement;
      const cards = Array.from(
        grid.querySelectorAll<HTMLElement>(".all-projects__card"),
      );
      if (!svg || cards.length !== projects.length) return;

      const svgBounds = svg.getBoundingClientRect();
      const cardBounds = cards.map((card) => {
        const bounds = card.getBoundingClientRect();
        return {
          center: {
            x: bounds.left + bounds.width / 2 - svgBounds.left,
            y: bounds.top + bounds.height / 2 - svgBounds.top,
          },
          width: bounds.width,
          height: bounds.height,
        };
      });
      const getEdgePoint = (
        bounds: (typeof cardBounds)[number],
        center: WirePoint,
        deltaX: number,
        deltaY: number,
      ) => {
        const scale = Math.min(
          deltaX === 0 ? Infinity : bounds.width / 2 / Math.abs(deltaX),
          deltaY === 0 ? Infinity : bounds.height / 2 / Math.abs(deltaY),
        );
        return {
          x: center.x + deltaX * scale,
          y: center.y + deltaY * scale,
        };
      };
      const segments = cardBounds.slice(0, -1).map((bounds, index) => {
        const next = cardBounds[index + 1];
        const deltaX = next.center.x - bounds.center.x;
        const deltaY = next.center.y - bounds.center.y;
        const start = getEdgePoint(bounds, bounds.center, deltaX, deltaY);
        const end = getEdgePoint(next, next.center, -deltaX, -deltaY);
        return {
          start,
          end,
          length: Math.hypot(end.x - start.x, end.y - start.y),
        };
      });
      segmentsRef.current = segments;

      svg.setAttribute(
        "viewBox",
        `0 0 ${Math.max(1, svgBounds.width)} ${Math.max(1, svgBounds.height)}`,
      );
      path.setAttribute(
        "d",
        segments
          .map(({ start, end }) => `M ${start.x} ${start.y} L ${end.x} ${end.y}`)
          .join(" "),
      );
      updateProgress();
    };

    const resizeObserver = new ResizeObserver(updateWire);
    resizeObserver.observe(grid);
    grid.querySelectorAll(".all-projects__card").forEach((card) =>
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
    <main className="all-projects" id="home">
      <div className="all-projects__inner">
        <header className="all-projects__top">
          <Link className="all-projects__brand" href="/#home" dir="ltr">
            FAME<span>X</span>
          </Link>
          <Link className="all-projects__back" href="/#projects">
            <ArrowLeft size={16} aria-hidden="true" />
            رجوع للموقع
          </Link>
        </header>

        <section className="all-projects__intro" aria-labelledby="all-projects-title">
          <p className="all-projects__eyebrow">FAMEX // PORTFOLIO</p>
          <h1 id="all-projects-title">
            مشاريعنا <span>على حقيقتها.</span>
          </h1>
          <p>
            كل مشروع له فكرته وتجربته. اختار مشروعًا لمعاينة تصميمه، أو افتح
            الموقع مباشرةً لو أضفت رابطه.
          </p>
          <div className="all-projects__status">
            <span aria-hidden="true" />
            <span>{String(projects.length).padStart(2, "0")} مشاريع في المعرض</span>
          </div>
        </section>

        <section
          className="services__path all-projects__path"
          aria-label="معرض المشاريع"
          ref={gridRef}
        >
          <svg className="services__wire" aria-hidden="true" focusable="false">
            <path className="services__wire-base" ref={pathRef} />
            <path className="services__wire-glow" ref={glowRef} />
          </svg>
          <div className="services__cards">
            {projects.map((project) => {
              const ProjectIcon = project.Icon;

              return (
                <article
                  className="all-projects__card"
                  key={project.id}
                >
                  <div className="all-projects__preview">
                    <ProjectScreen project={project} />
                    <span className="all-projects__featured">
                      {project.url ? "LIVE" : "Featured"}
                    </span>
                    <span className="all-projects__preview-label" dir="ltr">
                      PROJECT PREVIEW
                    </span>
                  </div>
                  <div className="all-projects__details">
                    <h2>{project.title}</h2>
                    <p>{project.description}</p>
                    <div className="all-projects__tags">
                      <span>{project.label}</span>
                      <span>{project.demoScreen ? "معاينة تفاعلية" : "مشروع"}</span>
                    </div>
                    <footer className="all-projects__card-footer">
                      <span className="all-projects__card-type">
                        <ProjectIcon size={15} strokeWidth={1.8} aria-hidden="true" />
                        {project.url ? "مشروع مباشر" : "نموذج تصميم"}
                      </span>
                      {project.url && (
                        <a
                          className="all-projects__visit"
                          href={project.url}
                          target="_blank"
                          rel="noreferrer"
                        >
                          زيارة المشروع
                          <ExternalLink size={15} aria-hidden="true" />
                        </a>
                      )}
                    </footer>
                  </div>
                </article>
              );
            })}
          </div>
        </section>
      </div>
    </main>
  );
}
