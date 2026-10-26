"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
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
};

export const defaultProjects: Project[] = [
  {
    id: "commerce",
    title: "متجر إلكتروني طلقة وبيبيع",
    label: "أبلكيشن متجر",
    description: "تجربة تسوق سالكة وسريعة تخلي الزبون يملى السلة ويدفع في ثواني.",
    Icon: Blocks,
    demoScreen: "commerce",
  },
  {
    id: "identity",
    title: "هوية بصرية تعلّم وتعيش",
    label: "براندينج وهوية",
    description: "ديزاين كامل مليان روح وشخصية بتعكس هيبة البراند وتفاصيله.",
    Icon: Aperture,
    demoScreen: "identity",
  },
  {
    id: "platform",
    title: "داشبورد ومنصة إدارة ذكية",
    label: "منصة ويب وسحابية",
    description: "كل أرقام وبيانات بيزنسك في مكان واحد منظم وسهل من غير وجع دماغ.",
    Icon: Orbit,
    demoScreen: "platform",
  },
];

export const projects = defaultProjects;

export function mapProjectItemToProject(item: ProjectItem): Project {
  let icon = Layers;
  if (item.demoScreen === "commerce" || item.label.includes("متجر")) {
    icon = Blocks;
  } else if (item.demoScreen === "identity" || item.label.includes("هوية")) {
    icon = Aperture;
  } else if (item.demoScreen === "platform" || item.label.includes("داشبورد")) {
    icon = Orbit;
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
  };
}

export function ProjectScreen({ project }: { project: Project }) {
  const [activeImgIndex, setActiveImgIndex] = useState(0);

  useEffect(() => {
    setActiveImgIndex(0);
  }, [project.id]);

  const allImages =
    project.images && project.images.length > 0
      ? project.images
      : project.previewImage
      ? [project.previewImage]
      : [];

  const currentImage = allImages[activeImgIndex] || project.previewImage;

  if (currentImage) {
    const preview = (
      <div className="relative w-full h-full min-h-[480px] bg-[#0d140e]">
        <Image
          className="projects__real-preview-image"
          src={currentImage}
          alt={`معاينة مشروع ${project.title}`}
          fill
          sizes="(max-width: 640px) 310px, 330px"
          priority
        />
        {allImages.length > 1 && (
          <div className="absolute bottom-3 left-0 right-0 flex items-center justify-center gap-2 z-20 pointer-events-auto">
            {allImages.map((_, idx) => (
              <button
                key={idx}
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setActiveImgIndex(idx);
                }}
                className={`w-2.5 h-2.5 rounded-full transition-all ${
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
        aria-label={`افتح مشروع ${project.title} في نافذة جديدة`}
      >
        {preview}
      </a>
    ) : (
      <div className="projects__real-preview">{preview}</div>
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
          <span>متجري</span>
          <span className="projects__bag">٢</span>
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
  const [projectList, setProjectList] = useState<Project[]>(defaultProjects);
  const [activeProject, setActiveProject] = useState<Project>(defaultProjects[0]);

  useEffect(() => {
    let isMounted = true;
    getHomeProjects()
      .then((items) => {
        if (isMounted && items && items.length > 0) {
          const mapped = items.map(mapProjectItemToProject);
          setProjectList(mapped);
          setActiveProject(mapped[0]);
        }
      })
      .catch((err) => {
        console.warn("Could not load dynamic projects from Firestore:", err);
      });

    return () => {
      isMounted = false;
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
            <div className="projects__device-caption">
              {activeProject.url ? (
                <a href={activeProject.url} target="_blank" rel="noreferrer">
                  زيارة المشروع <ArrowUpLeft size={14} aria-hidden="true" />
                </a>
              ) : (
                <span>{activeProject.previewImage ? "معاينة المشروع" : "نموذج تجريبي"}</span>
              )}
              <i aria-hidden="true" />
            </div>
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
        <div className="projects__all-projects-wrap">
          <Link className="projects__all-projects" href="/projects">
            عرض كل المشاريع <ArrowUpLeft size={17} aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  );
}
