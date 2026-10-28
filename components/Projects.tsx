"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Aperture,
  ArrowLeft,
  ArrowUpLeft,
  BatteryFull,
  Blocks,
  Flame,
  Orbit,
  Signal,
  Wifi,
  Layers,
  Zap,
  TrendingUp,
  Maximize2,
  Menu,
  Minimize2,
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
import { getHomeProjects, ProjectItem } from "@/lib/projectsService";

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

export function mapProjectItemToProject(item: ProjectItem): Project {
  let icon: LucideIcon = Sparkles;
  if (item.iconName && PROJECT_ICON_MAP[item.iconName]) {
    icon = PROJECT_ICON_MAP[item.iconName];
  } else if (item.label.includes("متجر") || item.demoScreen === "commerce") {
    icon = ShoppingBag;
  } else if (item.label.includes("تطبيق") || item.label.includes("موبايل")) {
    icon = Smartphone;
  } else if (item.label.includes("هوية") || item.label.includes("براند") || item.demoScreen === "identity") {
    icon = Palette;
  } else if (item.label.includes("داشبورد") || item.demoScreen === "platform") {
    icon = Layout;
  } else if (item.label.includes("موقع") || item.label.includes("ويب")) {
    icon = Globe;
  } else {
    icon = Layers;
  }

  const allImages = item.images && item.images.length > 0 ? item.images : [];
  const primary = item.previewImage || allImages[0] || "";

  return {
    id: item.id,
    title: item.title,
    label: item.label,
    description: item.description,
    Icon: icon,
    demoScreen: item.demoScreen,
    previewImage: primary,
    images: allImages.length > 0 ? allImages : primary ? [primary] : [],
    url: item.url,
    imageFit: item.imageFit || "smart",
    showOnHome: item.showOnHome,
    iconName: item.iconName,
  };
}

export function ProjectScreen({
  project,
  variant = "home",
}: {
  project: Project;
  variant?: "home" | "gallery";
}) {
  const [activeImgIndex, setActiveImgIndex] = useState(0);
  const [fitMode, setFitMode] = useState<"smart" | "cover" | "contain">(
    project.imageFit || "smart"
  );
  const [direction, setDirection] = useState(0);
  const isDraggingRef = useRef(false);

  useEffect(() => {
    setActiveImgIndex(0);
    setFitMode(project.imageFit || "smart");
  }, [project.id, project.imageFit]);

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
    const isCover = fitMode === "cover";

    const previewContent = (
      <div className="group/screen absolute inset-0 overflow-hidden bg-[#0a0d0b] flex items-center justify-center select-none touch-pan-y">
        {/* Ambient Blur Layer: fills empty spaces with soft matching color aura */}
        {!isCover && (
          <div className="absolute inset-0 overflow-hidden pointer-events-none -z-0">
            <Image
              src={currentImage}
              alt=""
              fill
              className="object-cover blur-2xl opacity-40 scale-125 transition-all duration-500"
              aria-hidden="true"
            />
          </div>
        )}

        {/* Foreground Main Image with Swipe / Dragging (Mobile & Computer) */}
        <AnimatePresence initial={false} custom={direction}>
          <motion.div
            key={activeImgIndex}
            custom={direction}
            initial={{ opacity: 0, x: direction * 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -direction * 50 }}
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
              if (swipe < -35 || velocity < -250) {
                // سحب لليسار: الصورة التالية
                handleNext();
              } else if (swipe > 35 || velocity > 250) {
                // سحب لليمين: الصورة السابقة
                handlePrev();
              }
              setTimeout(() => {
                isDraggingRef.current = false;
              }, 120);
            }}
            className={`absolute inset-0 flex items-center justify-center ${
              isCover ? "" : variant === "home" ? "p-1.5 sm:p-2" : "p-2 sm:p-3"
            } z-10 ${allImages.length > 1 ? "cursor-grab active:cursor-grabbing" : ""}`}
          >
            <Image
              className={`transition-all duration-300 pointer-events-none ${
                isCover
                  ? "object-cover object-top"
                  : "object-contain drop-shadow-[0_8px_25px_rgba(0,0,0,0.5)]"
              }`}
              src={currentImage}
              alt={`معاينة مشروع ${project.title}`}
              fill
              sizes="(max-width: 640px) 340px, (max-width: 1024px) 450px, 600px"
              draggable={false}
              priority={activeImgIndex === 0}
            />
          </motion.div>
        </AnimatePresence>

        {/* Home Phone Mode: Toggle Fit Button (Cover vs Contain) */}
        {variant === "home" && (
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setFitMode((prev) => (prev === "cover" ? "smart" : "cover"));
            }}
            className="absolute top-2.5 left-2.5 z-30 p-1.5 rounded-lg bg-black/65 hover:bg-black/90 text-white/80 hover:text-white border border-white/10 backdrop-blur transition-all text-[10px] flex items-center gap-1 cursor-pointer pointer-events-auto"
            title={fitMode === "cover" ? "عرض الصورة كاملة بدون قص" : "ملء الشاشة بالكامل"}
          >
            {fitMode === "cover" ? (
              <>
                <Minimize2 size={12} />
                <span className="text-[9px] font-sans">احتواء</span>
              </>
            ) : (
              <>
                <Maximize2 size={12} />
                <span className="text-[9px] font-sans">ملء</span>
              </>
            )}
          </button>
        )}

        {/* Multi-image Navigation Arrows (Computer & Mobile) */}
        {allImages.length > 1 && (
          <>
            {/* زر الصورة السابقة (يسار) */}
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                handlePrev();
              }}
              className="absolute left-2 top-1/2 -translate-y-1/2 z-30 p-1.5 rounded-full bg-black/65 hover:bg-black/90 text-white/80 hover:text-white border border-white/10 backdrop-blur transition-all opacity-0 group-hover/screen:opacity-100 hidden sm:flex items-center justify-center cursor-pointer shadow-lg hover:scale-110 active:scale-95 pointer-events-auto"
              aria-label="الصورة السابقة"
              title="السابق"
            >
              <ChevronLeft size={16} />
            </button>

            {/* زر الصورة التالية (يمين) */}
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                handleNext();
              }}
              className="absolute right-2 top-1/2 -translate-y-1/2 z-30 p-1.5 rounded-full bg-black/65 hover:bg-black/90 text-white/80 hover:text-white border border-white/10 backdrop-blur transition-all opacity-0 group-hover/screen:opacity-100 hidden sm:flex items-center justify-center cursor-pointer shadow-lg hover:scale-110 active:scale-95 pointer-events-auto"
              aria-label="الصورة التالية"
              title="التالي"
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

    return project.url ? (
      <a
        className="projects__real-preview"
        href={project.url}
        target="_blank"
        rel="noreferrer"
        onClick={(e) => {
          if (isDraggingRef.current) {
            e.preventDefault();
            e.stopPropagation();
          }
        }}
        aria-label={`افتح مشروع ${project.title} في نافذة جديدة`}
      >
        {previewContent}
      </a>
    ) : (
      <div className="projects__real-preview">{previewContent}</div>
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
  const [activeProject, setActiveProject] = useState<Project | null>(null);

  useEffect(() => {
    let isMounted = true;

    const loadProjects = () => {
      getHomeProjects()
        .then((items) => {
          if (isMounted) {
            if (items && items.length > 0) {
              const mapped = items.map(mapProjectItemToProject).slice(0, 3);
              setProjectList(mapped);
              setActiveProject((prev) => {
                const stillExists = mapped.find((p) => p.id === prev?.id);
                return stillExists || mapped[0];
              });
            } else {
              setProjectList([]);
              setActiveProject(null);
            }
          }
        })
        .catch((err) => {
          console.warn("Could not load dynamic projects:", err);
        });
    };

    loadProjects();

    const handleUpdate = () => {
      loadProjects();
    };

    window.addEventListener("famex_projects_updated", handleUpdate);
    window.addEventListener("storage", handleUpdate);

    return () => {
      isMounted = false;
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
          <p className="section__intro">جرّب وعاين الشغل بنفسك على الموبايل ده وحس بالفرق في التجربة.</p>
        </header>

        {activeProject ? (
          <div className="projects__showcase">
          <div className="projects__device-column">
            <div className="projects__phone" data-project={activeProject.id} aria-label={`معاينة ${activeProject.title}`}>
              <div className="projects__phone-bezel">
                <div className="projects__phone-camera" />
                <div className="projects__phone-screen">
                  <div className="projects__status-bar">
                    <span>9:41</span>
                    <span className="projects__status-icons" aria-label="إشارة وواي فاي وبطارية ممتلئة">
                      <Signal size={13} strokeWidth={2.4} />
                      <Wifi size={14} strokeWidth={2.4} />
                      <BatteryFull size={16} strokeWidth={2.2} />
                    </span>
                  </div>
                  <ProjectScreen project={activeProject} />
                  <div className="projects__phone-nav"><span /><span /><span /><span /></div>
                </div>
              </div>
            </div>
            {(activeProject.url || activeProject.previewImage) && (
              <div className="projects__device-caption">
                {activeProject.url ? (
                  <a
                    className="projects__visit-btn"
                    href={activeProject.url}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={`زيارة موقع مشروع ${activeProject.title}`}
                  >
                    زيارة الموقع <ArrowUpLeft size={15} aria-hidden="true" />
                  </a>
                ) : (
                  <span className="projects__visit-btn projects__visit-btn--badge">
                    معاينة المشروع
                  </span>
                )}
                <i aria-hidden="true" />
              </div>
            )}
          </div>

          <div className="projects__selector">
            <p className="projects__selector-label">استكشف شغلنا <span>({String(projectList.length).padStart(2, "0")})</span></p>
            <ul className="projects__list">
              {projectList.map((project) => {
                const { id, title, label, description, Icon } = project;
                const isActive = activeProject.id === id;
                const ProjectIcon = Icon || Layers;
                return (
                  <li key={id}>
                    <button
                      className={`projects__option${isActive ? " is-active" : ""}`}
                      type="button"
                      aria-pressed={isActive}
                      onClick={() => setActiveProject(project)}
                    >
                      <span className="projects__option-icon"><ProjectIcon size={19} strokeWidth={1.6} /></span>
                      <span className="projects__option-copy">
                        <span className="projects__option-label">{label}</span>
                        <span className="projects__option-title">{title}</span>
                        <span className="projects__option-description">{description}</span>
                      </span>
                      <span className="projects__option-arrow"><ArrowUpLeft size={17} /></span>
                    </button>
                  </li>
                );
              })}
            </ul>
            <p className="projects__selector-hint">
              <span>دوس على أي مشروع عشان تعاينه فوري</span>
              <ArrowLeft size={14} aria-hidden="true" />
            </p>
          </div>
        </div>
        ) : (
          <div className="py-16 text-center text-[#7d9b7f] font-mono border border-dashed border-[#1f3f26] rounded-2xl bg-black/40">
            <p>لا توجد مشاريع مضافة حالياً في الرئيسية.</p>
          </div>
        )}
        <div className="projects__all-projects-wrap">
          <Link className="projects__all-projects" href="/projects">
            عرض كل المشاريع <ArrowUpLeft size={17} aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  );
}
