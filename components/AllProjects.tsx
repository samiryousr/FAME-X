"use client";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { ArrowLeft, Layers, FolderGit2, RotateCw } from "lucide-react";
import {
  ProjectScreen,
  ProjectActionButton,
  mapProjectItemToProject,
  Project,
  PROJECT_CATEGORIES,
  ProjectCategoryKey,
  normalizeProjectCategory,
} from "@/components/Projects";
import ProjectGalleryModal from "@/components/ProjectGalleryModal";
import {
  subscribeToProjects,
  getLocalProjects,
  ProjectItem,
} from "@/lib/projectsService";

export function ProjectCardSkeleton() {
  return (
    <article className="all-projects__card animate-pulse select-none pointer-events-none">
      <div className="all-projects__preview relative aspect-[16/10] !h-auto w-full bg-[#0d1610] overflow-hidden border-b border-[#1b3420]">
        <div className="absolute top-3 right-3 w-16 h-5 rounded-full bg-[#16271c] border border-white/5" />
      </div>
      <div className="all-projects__details">
        <div className="space-y-3">
          <div className="w-24 h-5 rounded-full bg-[#16271c] border border-white/5" />
          <div className="w-3/4 h-6 rounded-lg bg-[#1a2e22]" />
          <div className="space-y-1.5 pt-1">
            <div className="w-full h-3 rounded bg-[#132218]" />
            <div className="w-5/6 h-3 rounded bg-[#132218]" />
          </div>
        </div>
        <footer className="all-projects__card-footer pt-3.5 border-t border-[#1b3420] flex items-center justify-between">
          <div className="w-28 h-8 rounded-xl bg-[#16271c] border border-white/5" />
          <div className="w-14 h-5 rounded-full bg-[#132218]" />
        </footer>
      </div>
    </article>
  );
}


type WirePoint = { x: number; y: number };
type WireSegment = { start: WirePoint; end: WirePoint; length: number };

export default function AllProjects() {
  const [projectList, setProjectList] = useState<Project[]>([]);
  const [activeCategory, setActiveCategory] = useState<"all" | ProjectCategoryKey>("all");
  const [isLoading, setIsLoading] = useState(true);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const gridRef = useRef<HTMLElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const glowRef = useRef<SVGPathElement>(null);
  const segmentsRef = useRef<WireSegment[]>([]);

  // Read URL query param ?cat=... on mount for direct sharing
  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const cat = params.get("cat");
      if (cat === "mobile" || cat === "web" || cat === "branding") {
        setActiveCategory(cat);
      }
    }
  }, []);

  const handleCategoryChange = (key: "all" | ProjectCategoryKey) => {
    setActiveCategory(key);
    if (typeof window !== "undefined") {
      const url = new URL(window.location.href);
      if (key === "all") {
        url.searchParams.delete("cat");
      } else {
        url.searchParams.set("cat", key);
      }
      window.history.replaceState({}, "", url.toString());
    }
  };

  // Load dynamic projects with instant local cache + real-time Firestore sync
  useEffect(() => {
    let isMounted = true;

    // 1. Instant local load (zero flicker, zero blank screen)
    const cached = getLocalProjects();
    if (cached && cached.length > 0 && isMounted) {
      setProjectList(cached.map(mapProjectItemToProject));
      setIsLoading(false);
    }

    // 2. Real-time live subscription with Firestore + parallel direct fetch
    const unsubscribe = subscribeToProjects((items) => {
      if (isMounted) {
        setProjectList(items.map(mapProjectItemToProject));
        setIsLoading(false);
      }
    });

    // 3. Fallback safety timer: Never let the skeleton hang if connection is slow
    const safetyTimer = setTimeout(() => {
      if (isMounted) {
        setIsLoading(false);
      }
    }, 3500);

    // 4. Local custom event sync across tabs/components
    const handleUpdate = (e: Event) => {
      const customEvent = e as CustomEvent<ProjectItem[]>;
      if (customEvent.detail && Array.isArray(customEvent.detail) && isMounted) {
        setProjectList(customEvent.detail.map(mapProjectItemToProject));
        setIsLoading(false);
      }
    };

    window.addEventListener("famex_projects_updated", handleUpdate);
    window.addEventListener("storage", handleUpdate);

    return () => {
      isMounted = false;
      clearTimeout(safetyTimer);
      unsubscribe();
      window.removeEventListener("famex_projects_updated", handleUpdate);
      window.removeEventListener("storage", handleUpdate);
    };
  }, []);

  const counts = {
    all: projectList.length,
    mobile: projectList.filter((p) => normalizeProjectCategory(p.label) === "mobile").length,
    web: projectList.filter((p) => normalizeProjectCategory(p.label) === "web").length,
    branding: projectList.filter((p) => normalizeProjectCategory(p.label) === "branding").length,
  };

  const filteredProjects =
    activeCategory === "all"
      ? projectList
      : projectList.filter((p) => normalizeProjectCategory(p.label) === activeCategory);

  // Glowing wire connection animation
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
      if (!svg || cards.length !== filteredProjects.length) return;

      if (cards.length <= 1) {
        path.setAttribute("d", "");
        glow.setAttribute("d", "");
        segmentsRef.current = [];
        return;
      }

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
  }, [filteredProjects]);

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
              الموقع مباشرةً بضغطة زر.
            </p>
          </section>

          {/* Category Filter Tabs with Native Mobile Horizontal Scroll Bar */}
          <div className="w-full max-w-4xl mx-auto mb-8 sm:mb-12 px-2 sm:px-4">
            <nav
              aria-label="تصنيفات المشاريع"
              className="flex items-center gap-2 sm:gap-3 overflow-x-auto no-scrollbar py-2 px-1 sm:px-0 justify-start sm:justify-center select-none touch-pan-x"
            >
              {/* All Projects Button */}
              <button
                type="button"
                onClick={() => handleCategoryChange("all")}
                className={`inline-flex items-center shrink-0 gap-2 sm:gap-2.5 px-4 sm:px-5 py-2.5 sm:py-3 rounded-full text-xs sm:text-sm font-bold transition-all duration-300 cursor-pointer select-none whitespace-nowrap ${
                  activeCategory === "all"
                    ? "bg-[#a6f45d] text-[#070d08] shadow-[0_0_24px_rgba(166,244,93,0.4)] scale-[1.03] font-black"
                    : "bg-[#0b140d]/80 hover:bg-[#122216] text-[#8fa593] hover:text-[#e5fbe6] border border-[#a6f45d]/15 hover:border-[#a6f45d]/40 backdrop-blur-md"
                }`}
              >
                <Layers className="w-4 h-4 shrink-0" />
                <span>الكل</span>
                <span
                  className={`text-[10px] sm:text-[11px] px-2 py-0.5 rounded-full font-mono font-bold transition-colors ${
                    activeCategory === "all"
                      ? "bg-[#070d08]/20 text-[#070d08]"
                      : "bg-[#a6f45d]/10 text-[#a6f45d]"
                  }`}
                >
                  {counts.all}
                </span>
              </button>

              {/* Category Specific Buttons */}
              {PROJECT_CATEGORIES.map((cat) => {
                const IconCmp = cat.Icon;
                const isSelected = activeCategory === cat.id;
                const count = counts[cat.id];
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => handleCategoryChange(cat.id)}
                    className={`inline-flex items-center shrink-0 gap-2 sm:gap-2.5 px-4 sm:px-5 py-2.5 sm:py-3 rounded-full text-xs sm:text-sm font-bold transition-all duration-300 cursor-pointer select-none whitespace-nowrap ${
                      isSelected
                        ? "bg-[#a6f45d] text-[#070d08] shadow-[0_0_24px_rgba(166,244,93,0.4)] scale-[1.03] font-black"
                        : "bg-[#0b140d]/80 hover:bg-[#122216] text-[#8fa593] hover:text-[#e5fbe6] border border-[#a6f45d]/15 hover:border-[#a6f45d]/40 backdrop-blur-md"
                    }`}
                  >
                    <IconCmp className="w-4 h-4 shrink-0" />
                    <span>{cat.label}</span>
                    <span
                      className={`text-[10px] sm:text-[11px] px-2 py-0.5 rounded-full font-mono font-bold transition-colors ${
                        isSelected
                          ? "bg-[#070d08]/20 text-[#070d08]"
                          : "bg-[#a6f45d]/10 text-[#a6f45d]"
                      }`}
                    >
                      {count}
                    </span>
                  </button>
                );
              })}
            </nav>
          </div>

          <section
            className="services__path all-projects__path"
            aria-label="معرض المشاريع"
            ref={gridRef}
          >
            <svg className="services__wire" aria-hidden="true" focusable="false">
              <path className="services__wire-base" ref={pathRef} />
              <path className="services__wire-glow" ref={glowRef} />
            </svg>

            {isLoading && projectList.length === 0 ? (
              <div className="w-full">
                <div className="flex items-center justify-center gap-2.5 py-4 mb-4 text-xs font-mono text-[#a6f45d] animate-pulse">
                  <RotateCw className="w-3.5 h-3.5 animate-spin" />
                  <span>[FAME_X // CONNECTING] جاري جلب أحدث المشاريع من الخادم...</span>
                </div>
                <div className="services__cards">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <ProjectCardSkeleton key={i} />
                  ))}
                </div>
              </div>
            ) : filteredProjects.length === 0 ? (
              <div className="text-center py-16 px-6 max-w-md mx-auto my-8 bg-[#0b140d]/80 border border-[#a6f45d]/20 rounded-3xl backdrop-blur-md shadow-xl">
                <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-[#a6f45d]/10 border border-[#a6f45d]/25 flex items-center justify-center text-[#a6f45d]">
                  <FolderGit2 className="w-7 h-7" />
                </div>
                <h3 className="text-base font-bold text-[#e5fbe6] mb-1.5">
                  لا توجد مشاريع مضافة في هذا القسم حالياً
                </h3>
                <p className="text-xs text-[#8fa593] mb-5 leading-relaxed">
                  جاري إضافة وتحديث أحدث المشاريع والأعمال الخاصة بهذا القسم قريباً.
                </p>
                <button
                  type="button"
                  onClick={() => handleCategoryChange("all")}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#a6f45d] text-[#070d08] text-xs font-black hover:bg-[#bcf980] transition-all cursor-pointer shadow-[0_0_15px_rgba(166,244,93,0.3)]"
                >
                  <span>عرض جميع المشاريع ({counts.all})</span>
                </button>
              </div>
            ) : (
              <div className="services__cards">
                {filteredProjects.map((project) => {
                  const catKey = normalizeProjectCategory(project.label);
                  const cat = PROJECT_CATEGORIES.find((c) => c.id === catKey);
                  const CategoryIcon = cat ? cat.Icon : project.Icon;
                  return (
                    <article
                      className="all-projects__card cursor-pointer"
                      key={project.id}
                      onClick={() => setSelectedProject(project)}
                    >
                      <div className="all-projects__preview relative aspect-[16/10] !h-auto w-full">
                        <ProjectScreen project={project} variant="gallery" />
                        {/* Status Badges like Admin */}
                        <div className="all-projects__preview-badges">
                          {project.showOnHome && (
                            <span className="all-projects__badge all-projects__badge--home">
                              الرئيسية
                            </span>
                          )}
                          {project.images && project.images.length > 1 && (
                            <span className="all-projects__badge all-projects__badge--count">
                              {project.images.length} صور
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="all-projects__details">
                        <div className="space-y-2">
                          {/* Category Label at Top */}
                          <div className="all-projects__tags">
                            <span className="all-projects__tag inline-flex items-center gap-1.5">
                              <CategoryIcon className="w-3.5 h-3.5 text-[#a6f45d]" />
                              {cat?.label || project.label || "مشروع مميز"}
                            </span>
                          </div>

                          <h2>{project.title}</h2>

                          <p>
                            {project.description &&
                            project.description.trim() &&
                            project.description !== "لا يوجد وصف مدخل."
                              ? project.description
                              : catKey === "mobile"
                              ? "تطبيق ذكي متكامل بنظام تشغيل سريع وتجربة مستخدم تفاعلية متطورة."
                              : catKey === "branding"
                              ? "هوية بصرية كاملة وتصميم جرافيكي مبتكر يبرز قوة وحضور علامتك التجارية."
                              : "منصة ويب متطورة وتجربة رقمية فائقة السرعة تخدم نمو البيزنس وتحقق أعلى مبيعات."}
                          </p>
                        </div>

                        <footer className="all-projects__card-footer pt-3.5 border-t border-[#1b3420] flex items-center justify-between gap-3">
                          <ProjectActionButton project={project} />

                          {project.images && project.images.length > 1 && (
                            <span className="inline-flex items-center gap-1 text-[11px] font-mono text-[#7d9b7f] bg-black/40 px-2.5 py-1 rounded-full border border-white/5">
                              <span>{project.images.length} صور</span>
                            </span>
                          )}
                        </footer>
                      </div>
                    </article>
                  );
                })}
              </div>
            )}
          </section>
        </div>

        {/* Project Details & Gallery Modal */}
        <ProjectGalleryModal
          project={selectedProject}
          isOpen={!!selectedProject}
          onClose={() => setSelectedProject(null)}
        />
    </main>
  );
}
