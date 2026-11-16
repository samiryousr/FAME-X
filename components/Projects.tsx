"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Aperture,
  ArrowUpLeft,
  Blocks,
  Flame,
  Orbit,
  Layers,
  Zap,
  TrendingUp,
  Menu,
  ShoppingBag,
  Globe,
  Smartphone,
  Palette,
  Layout,
  Sparkles,
  Briefcase,
  Rocket,
  FolderGit2,
  ChevronLeft,
  ChevronRight,
  type LucideIcon,
} from "lucide-react";
import {
  subscribeToProjects,
  getLocalProjects,
  ProjectItem,
} from "@/lib/projectsService";
import ProjectGalleryModal from "@/components/ProjectGalleryModal";

export type Project = {
  id: string;
  title: string;
  label: string;
  description: string;
  Icon: LucideIcon;
  demoScreen?: "commerce" | "identity" | "platform";
  previewImage?: string;
  images?: string[];
  url?: string;
  imageFit?: "smart" | "cover" | "contain";
  showOnHome?: boolean;
  iconName?: string;
};

export const PROJECT_ICON_MAP: Record<string, LucideIcon> = {
  ShoppingBag,
  Globe,
  Smartphone,
  Palette,
  Layout,
  Sparkles,
  Briefcase,
  Rocket,
  Layers,
  FolderGit2,
  Aperture,
  Orbit,
  Blocks,
};

export const defaultProjects: Project[] = [];

export const projects = defaultProjects;

export type ProjectCategoryKey = "mobile" | "web" | "branding";

export interface ProjectCategory {
  id: ProjectCategoryKey;
  label: string;
  subLabel: string;
  en: string;
  iconName: string;
  Icon: LucideIcon;
  accent: string;
}

export const PROJECT_CATEGORIES: ProjectCategory[] = [
  {
    id: "mobile",
    label: "تطبيقات موبايل",
    subLabel: "iOS & Android Apps",
    en: "MOBILE APPS",
    iconName: "Smartphone",
    Icon: Smartphone,
    accent: "#a6f45d",
  },
  {
    id: "web",
    label: "مواقع ويب",
    subLabel: "Websites & Platforms",
    en: "WEBSITES & APPS",
    iconName: "Globe",
    Icon: Globe,
    accent: "#38bdf8",
  },
  {
    id: "branding",
    label: "هوية بصرية وميديا",
    subLabel: "Branding & Media",
    en: "BRANDING & MEDIA",
    iconName: "Palette",
    Icon: Palette,
    accent: "#52c974",
  },
];

export function normalizeProjectCategory(labelOrCategory?: string): ProjectCategoryKey {
  const text = (labelOrCategory || "").toLowerCase().trim();
  if (
    text === "mobile" ||
    text.includes("تطبيق") ||
    text.includes("موبايل") ||
    text.includes("أبلكيشن") ||
    text.includes("ابلكيشن") ||
    text.includes("ios") ||
    text.includes("android") ||
    text.includes("app")
  ) {
    return "mobile";
  }
  if (
    text === "branding" ||
    text.includes("هوية") ||
    text.includes("براند") ||
    text.includes("ديزاين") ||
    text.includes("تصميم") ||
    text.includes("ميديا") ||
    text.includes("تصوير") ||
    text.includes("لوجو")
  ) {
    return "branding";
  }
  return "web";
}

export function mapProjectItemToProject(item: ProjectItem): Project {
  const catKey = normalizeProjectCategory(item.label || item.demoScreen);
  const cat = PROJECT_CATEGORIES.find((c) => c.id === catKey) || PROJECT_CATEGORIES[1];

  let icon: LucideIcon = cat.Icon;
  if (item.iconName && PROJECT_ICON_MAP[item.iconName]) {
    icon = PROJECT_ICON_MAP[item.iconName];
  }

  const allImages = item.images && item.images.length > 0 ? item.images : [];
  const primary = item.previewImage || allImages[0] || "";

  return {
    id: item.id,
    title: item.title,
    label: item.label || cat.label,
    description: item.description,
    Icon: icon,
    demoScreen: item.demoScreen,
    previewImage: primary,
    images: allImages.length > 0 ? allImages : primary ? [primary] : [],
    url: item.url,
    imageFit: "cover",
    showOnHome: item.showOnHome,
    iconName: item.iconName || cat.iconName,
  };
}

export function GooglePlayIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M3.609 1.814L13.792 12 3.61 22.186a2.38 2.38 0 0 1-.61-.968c-.147-.468-.2-.968-.2-1.468V4.25c0-.5.053-1 .2-1.468.125-.398.337-.745.61-.968zm11.242 11.244l2.122 2.123-11.75 6.782 9.628-8.905zm0-2.116L5.221 2.037l11.75 6.782-2.12 2.123zm1.461 1.058l3.666 2.115c.66.381 1.022.955 1.022 1.637 0 .682-.362 1.256-1.022 1.637l-3.666 2.116-2.26-2.26 2.26-2.245z" />
    </svg>
  );
}

export function AppleIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.37c.62-.75 1.04-1.8 0.93-2.85-.9.04-1.99.6-2.63 1.35-.57.65-1.07 1.71-.93 2.73 1.01.08 2.02-.51 2.63-1.23z" />
    </svg>
  );
}

export function ProjectActionButton({
  project,
  className = "",
}: {
  project: Project;
  className?: string;
}) {
  const url = (project.url || "").trim();
  const lowerUrl = url.toLowerCase();
  const catKey = normalizeProjectCategory(project.label || project.demoScreen);

  if (url) {
    let IconComponent: React.ComponentType<{ className?: string }> = Globe;
    let label = "زيارة الموقع";

    if (
      lowerUrl.includes("play.google.com") ||
      lowerUrl.includes("google.com/store")
    ) {
      IconComponent = GooglePlayIcon;
      label = "Google Play";
    } else if (
      lowerUrl.includes("apps.apple.com") ||
      lowerUrl.includes("apple.co")
    ) {
      IconComponent = AppleIcon;
      label = "App Store";
    } else if (catKey === "mobile") {
      IconComponent = GooglePlayIcon;
      label = "معاينة التطبيق";
    } else if (catKey === "branding") {
      IconComponent = Palette;
      label = "استعراض الهوية";
    } else {
      IconComponent = Globe;
      label = "زيارة الموقع";
    }

    return (
      <a
        href={url}
        target="_blank"
        rel="noreferrer"
        className={`group/btn inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-[#a6f45d]/10 hover:bg-[#a6f45d] text-[#a6f45d] hover:text-[#070d08] border border-[#a6f45d]/30 hover:border-[#a6f45d] font-bold text-xs transition-all duration-300 shadow-[0_0_15px_rgba(166,244,93,0.12)] hover:shadow-[0_0_20px_rgba(166,244,93,0.35)] active:scale-95 ${className}`}
        aria-label={`${label} لمشروع ${project.title}`}
        onClick={(e) => e.stopPropagation()}
      >
        <IconComponent className="w-3.5 h-3.5 shrink-0 transition-transform duration-300 group-hover/btn:scale-110" />
        <span className="leading-none">{label}</span>
        <ArrowUpLeft
          size={13}
          aria-hidden="true"
          className="shrink-0 text-[#a6f45d] group-hover/btn:text-[#070d08] group-hover/btn:-translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform duration-200"
        />
      </a>
    );
  }

  let StatusIcon: React.ComponentType<{ className?: string }> = Globe;
  let statusText = "معاينة وتصميم";

  if (catKey === "mobile") {
    StatusIcon = Smartphone;
    statusText = "تطبيق موبايل";
  } else if (catKey === "branding") {
    StatusIcon = Palette;
    statusText = "هوية وتصميم";
  }

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/[0.04] border border-white/[0.08] text-[#8fa593] text-[11px] font-mono select-none ${className}`}
    >
      <StatusIcon className="w-3.5 h-3.5 text-[#a6f45d]/70" />
      <span>{statusText}</span>
    </span>
  );
}

export function ProjectScreen({
  project,
}: {
  project: Project;
  variant?: "home" | "gallery";
}) {
  const [activeImgIndex, setActiveImgIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const isDraggingRef = useRef(false);

  useEffect(() => {
    setActiveImgIndex(0);
  }, [project.id]);

  const allImages =
    project.images && project.images.length > 0
      ? project.images
      : project.previewImage
      ? [project.previewImage]
      : [];

  const handleNext = useCallback(() => {
    if (allImages.length <= 1) return;
    setDirection(1);
    setActiveImgIndex((prev) => (prev + 1) % allImages.length);
  }, [allImages.length]);

  const handlePrev = useCallback(() => {
    if (allImages.length <= 1) return;
    setDirection(-1);
    setActiveImgIndex((prev) => (prev - 1 + allImages.length) % allImages.length);
  }, [allImages.length]);

  const currentImage = allImages[activeImgIndex] || project.previewImage;

  if (currentImage) {
    const previewContent = (
      <div className="group/screen absolute inset-0 overflow-hidden bg-[#0a0d0b] flex items-center justify-center select-none touch-pan-y">
        {/* Foreground Main Image with Swipe / Dragging (Mobile & Computer - RTL) */}
        <AnimatePresence initial={false} custom={direction}>
          <motion.div
            key={activeImgIndex}
            custom={direction}
            initial={{ opacity: 0, x: -direction * 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: direction * 50 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            drag={allImages.length > 1 ? "x" : false}
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.25}
            onDragStart={() => {
              isDraggingRef.current = true;
            }}
            onDragEnd={(_, info) => {
              const swipe = info.offset.x;
              const velocity = info.velocity.x;
              if (swipe > 35 || velocity > 250) {
                // سحب لليمين: الصورة التالية في العربي
                handleNext();
              } else if (swipe < -35 || velocity < -250) {
                // سحب لليسار: الصورة السابقة
                handlePrev();
              }
              setTimeout(() => {
                isDraggingRef.current = false;
              }, 120);
            }}
            className={`absolute inset-0 flex items-center justify-center z-10 ${
              allImages.length > 1 ? "cursor-grab active:cursor-grabbing" : ""
            }`}
          >
            {/* Ambient Blurred Aura (eliminates empty space and creates cyber depth for vertical products) */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
              <Image
                src={currentImage}
                alt=""
                fill
                aria-hidden="true"
                className="object-cover blur-2xl opacity-35 scale-125"
              />
            </div>

            {/* Sharp Uncropped Foreground Image */}
            <Image
              className="object-contain p-2 group-hover:scale-105 transition-transform duration-500 pointer-events-none relative z-10 drop-shadow-[0_4px_16px_rgba(0,0,0,0.6)]"
              src={currentImage}
              alt={`معاينة مشروع ${project.title}`}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              draggable={false}
              priority={activeImgIndex === 0}
            />
          </motion.div>
        </AnimatePresence>

        {/* Multi-image Navigation Arrows (Computer & Mobile - RTL) */}
        {allImages.length > 1 && (
          <>
            {/* زر الصورة التالية (يسار في العربي) */}
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                handleNext();
              }}
              className="absolute left-2 top-1/2 -translate-y-1/2 z-30 p-1.5 rounded-full bg-black/65 hover:bg-black/90 text-white/80 hover:text-white border border-white/10 backdrop-blur transition-all opacity-0 group-hover/screen:opacity-100 hidden sm:flex items-center justify-center cursor-pointer shadow-lg hover:scale-110 active:scale-95 pointer-events-auto"
              aria-label="الصورة التالية"
              title="التالي"
            >
              <ChevronLeft size={16} />
            </button>

            {/* زر الصورة السابقة (يمين في العربي) */}
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                handlePrev();
              }}
              className="absolute right-2 top-1/2 -translate-y-1/2 z-30 p-1.5 rounded-full bg-black/65 hover:bg-black/90 text-white/80 hover:text-white border border-white/10 backdrop-blur transition-all opacity-0 group-hover/screen:opacity-100 hidden sm:flex items-center justify-center cursor-pointer shadow-lg hover:scale-110 active:scale-95 pointer-events-auto"
              aria-label="الصورة السابقة"
              title="السابق"
            >
              <ChevronRight size={16} />
            </button>
          </>
        )}

        {/* Multi-image indicator dots */}
        {allImages.length > 1 && (
          <div className="absolute bottom-3 left-0 right-0 flex items-center justify-center gap-2 z-30 pointer-events-auto">
            {allImages.map((_, idx) => (
              <button
                key={idx}
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setDirection(idx > activeImgIndex ? 1 : -1);
                  setActiveImgIndex(idx);
                }}
                className={`w-2.5 h-2.5 rounded-full transition-all cursor-pointer ${
                  idx === activeImgIndex
                    ? "bg-[#39a653] scale-125 shadow-[0_0_8px_#39a653]"
                    : "bg-white/60 hover:bg-white"
                }`}
                aria-label={`عرض الصورة رقم ${idx + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    );

    return (
      <div className="projects__real-preview">
        {previewContent}
      </div>
    );
  }

  if (project.demoScreen === "identity") {
    return (
      <div className="projects__screen-content projects__screen-content--identity">
        <div className="projects__screen-brand">
          <span className="projects__brand-mark"><Aperture size={24} /></span>
          <span>FORMA</span>
        </div>
        <p className="projects__screen-kicker">براندك، على طريقتك</p>
        <h3>بصمة<br />ملهاش بديل.</h3>
        <p className="projects__screen-copy">كل بكسل محسوب عشان يعلّم في دماغ عميلك.</p>
        <div className="projects__palette" aria-label="لوحة ألوان الهوية">
          <span /><span /><span /><span />
        </div>
        <div className="projects__screen-link">شوف الهوية كاملة <ArrowUpLeft size={13} /></div>
      </div>
    );
  }

  if (project.demoScreen === "platform") {
    return (
      <div className="projects__screen-content projects__screen-content--platform">
        <div className="projects__screen-topline">
          <span className="projects__mini-mark"><Orbit size={15} /></span>
          <span>إدارة بيزنسك</span>
          <span className="projects__avatar">م</span>
        </div>
        <p className="projects__screen-kicker">الداشبورد</p>
        <h3>
          منوّر يا بطل
          <Zap size={15} className="projects__sparkle-icon" aria-hidden="true" />
        </h3>
        <div className="projects__metric">
          <span>أرباح الشهر ده</span>
          <strong>+٢٤٪</strong>
          <div className="projects__chart"><i /><i /><i /><i /><i /><i /><i /></div>
        </div>
        <p className="projects__screen-subtitle">خدماتك السريعة</p>
        <div className="projects__service-row"><span><Blocks size={15} /></span><b>المشاريع الشغالة</b><ArrowUpLeft size={13} /></div>
        <div className="projects__service-row"><span><TrendingUp size={15} /></span><b>تقارير الأرباح والمبيعات</b><ArrowUpLeft size={13} /></div>
      </div>
    );
  }

  if (project.demoScreen === "commerce") {
    return (
      <div className="projects__screen-content projects__screen-content--commerce">
        <div className="projects__screen-topline">
          <span className="projects__mini-mark"><Blocks size={15} /></span>
          <span className="projects__screen-store-name">متجري</span>
          <span className="projects__bag">٢</span>
          <span className="projects__screen-menu" aria-hidden="true"><Menu size={14} /></span>
        </div>
        <div className="projects__shop-banner">
          <p className="projects__screen-kicker">كوليكشن جديد</p>
          <h3>اطلب دلوقتي<br />واستلم في يومين.</h3>
          <span>تسوّق الكوليكشن <ArrowUpLeft size={13} /></span>
          <div className="projects__product-art"><Blocks size={39} strokeWidth={1.2} /></div>
        </div>
        <div className="projects__shop-heading">
          <b>
            <Flame size={14} className="projects__flame-icon" aria-hidden="true" />
            <span>الأكتر مبيعاً</span>
          </b>
          <span>عرض الكل</span>
        </div>
        <div className="projects__products">
          <div><span className="projects__product-thumb"><Blocks size={21} /></span><b>العرض الأقوى</b><small>٢٤٩ ج.م</small></div>
          <div><span className="projects__product-thumb projects__product-thumb--second"><Flame size={21} /></span><b>الأكتر طلباً</b><small>٣٨٠ ج.م</small></div>
        </div>
      </div>
    );
  }

  const PreviewIcon = project.Icon || Layers;

  return (
    <div className="projects__empty-preview">
      <PreviewIcon size={30} strokeWidth={1.5} aria-hidden="true" />
      <strong>{project.title}</strong>
      <span>أضف صورة معاينة المشروع لعرضه هنا</span>
    </div>
  );
}

export default function Projects() {
  const [projectList, setProjectList] = useState<Project[]>([]);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  useEffect(() => {
    let isMounted = true;

    const syncProjects = (items: ProjectItem[]) => {
      if (!isMounted) return;
      const homeOnly = items.filter((p) => p.showOnHome !== false);
      const mapped = (homeOnly.length > 0 ? homeOnly : items)
        .map(mapProjectItemToProject)
        .slice(0, 3);
      setProjectList(mapped);
    };

    // 1. Initial fast local load (zero flicker)
    const cached = getLocalProjects();
    if (cached) {
      syncProjects(cached);
    }

    // 2. Real-time Firestore sync
    const unsubscribe = subscribeToProjects(syncProjects);

    // 3. Local custom event sync
    const handleUpdate = (e: Event) => {
      const customEvent = e as CustomEvent<ProjectItem[]>;
      if (customEvent.detail && Array.isArray(customEvent.detail)) {
        syncProjects(customEvent.detail);
      }
    };

    window.addEventListener("famex_projects_updated", handleUpdate);
    window.addEventListener("storage", handleUpdate);

    return () => {
      isMounted = false;
      unsubscribe();
      window.removeEventListener("famex_projects_updated", handleUpdate);
      window.removeEventListener("storage", handleUpdate);
    };
  }, []);

  return (
    <section className="section section--muted projects" id="projects">
      <div className="container">
        <header className="projects__heading">
          <p className="eyebrow">شغلنا بيتكلم عننا</p>
          <h2 className="section__title">أعمال كسّرت الدنيا</h2>
          <p className="section__intro">
            نماذج من أحدث مشاريعنا وتطبيقاتنا اللي صممناها ونفذناها بأعلى كفاءة لتخدم بيزنس عملائنا.
          </p>
        </header>

        {projectList.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7 mt-8 sm:mt-12">
            {projectList.map((project) => {
              const ProjectIcon = project.Icon || Layers;
              return (
                <article
                  key={project.id}
                  className="group relative flex flex-col rounded-2xl border border-[#1b3420] bg-gradient-to-b from-[#0f1d13] via-[#09130d] to-[#040805] hover:border-[#a6f45d]/45 transition-all duration-300 shadow-xl hover:shadow-[0_16px_36px_rgba(0,0,0,0.8),0_0_24px_rgba(166,244,93,0.1)] overflow-hidden cursor-pointer"
                  onClick={() => setSelectedProject(project)}
                >
                  {/* 🖼️ Card Media Preview Area (aspect 16/10, matching admin card exactly) */}
                  <div className="relative aspect-[16/10] w-full overflow-hidden bg-[#070d08] border-b border-[#1b3420]">
                    <ProjectScreen project={project} variant="gallery" />

                    {/* Floating Badges */}
                    <div className="absolute top-3 right-3 z-30 flex items-center gap-1.5 pointer-events-none">
                      <span className="px-2.5 py-1 rounded-full bg-black/80 border border-[#a6f45d]/40 backdrop-blur-md text-[10px] font-mono font-bold text-[#a6f45d] shadow-sm">
                        {project.label || "مشروع مميز"}
                      </span>
                    </div>
                  </div>

                  {/* 📝 Card Content Body */}
                  <div className="flex flex-col flex-1 justify-between p-5 gap-4">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-[#7d9b7f] text-xs font-mono">
                        <ProjectIcon size={14} className="text-[#a6f45d]" />
                        <span>{project.label || "FAME-X PROJECT"}</span>
                      </div>

                      <h3 className="text-lg sm:text-xl font-bold text-white group-hover:text-[#a6f45d] transition-colors leading-snug">
                        {project.title}
                      </h3>

                      <p className="text-xs sm:text-sm text-[#a8bda7] leading-relaxed line-clamp-3">
                        {project.description || "مشروع رقمي متكامل تم تنفيذه بأعلى معايير الجودة والسرعة."}
                      </p>
                    </div>

                    {/* 🔗 Card Footer with Action */}
                    <div className="pt-3.5 border-t border-[#1b3420] flex items-center justify-between">
                      <ProjectActionButton project={project} />

                      {project.images && project.images.length > 1 && (
                        <span className="text-[10px] font-mono text-[#7d9b7f] bg-black/40 px-2.5 py-1 rounded-full border border-white/5">
                          {project.images.length} صور
                        </span>
                      )}
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        ) : (
          <div className="py-16 text-center text-[#7d9b7f] font-mono border border-dashed border-[#1f3f26] rounded-2xl bg-black/40 mt-8">
            <p>لا توجد مشاريع مضافة حالياً في الرئيسية.</p>
          </div>
        )}

        <div className="projects__all-projects-wrap mt-10">
          <Link className="projects__all-projects" href="/projects">
            عرض كل المشاريع <ArrowUpLeft size={17} aria-hidden="true" />
          </Link>
        </div>

        {/* Project Details & Gallery Modal */}
        <ProjectGalleryModal
          project={selectedProject}
          isOpen={!!selectedProject}
          onClose={() => setSelectedProject(null)}
        />
      </div>
    </section>
  );
}
