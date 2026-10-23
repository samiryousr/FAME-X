"use client";

import { useState } from "react";
import { Aperture, ArrowUpLeft, Blocks, Orbit, Sparkles } from "lucide-react";

const projects = [
  {
    id: "commerce",
    title: "تجربة التجارة الإلكترونية",
    label: "تطبيق متجر",
    description: "تجربة تسوق سلسة تعرض المنتجات وتسهّل الوصول إليها.",
    Icon: Blocks,
  },
  {
    id: "identity",
    title: "هوية تنبض بالحياة",
    label: "هوية بصرية",
    description: "واجهة تعكس شخصية العلامة وتجمع ألوانها وتفاصيلها.",
    Icon: Aperture,
  },
  {
    id: "platform",
    title: "منصة أعمال متكاملة",
    label: "منصة رقمية",
    description: "مساحة منظمة للخدمات والمعلومات في تجربة واحدة.",
    Icon: Orbit,
  },
];

function ProjectScreen({ projectId }: { projectId: string }) {
  if (projectId === "identity") {
    return (
      <div className="projects__screen-content projects__screen-content--identity">
        <div className="projects__screen-brand">
          <span className="projects__brand-mark"><Aperture size={24} /></span>
          <span>FORMA</span>
        </div>
        <p className="projects__screen-kicker">هويتك، بطريقتك</p>
        <h3>بصمة<br />تُشبهك.</h3>
        <p className="projects__screen-copy">تفاصيل صغيرة تصنع فرقًا كبيرًا.</p>
        <div className="projects__palette" aria-label="لوحة ألوان الهوية">
          <span /><span /><span /><span />
        </div>
        <div className="projects__screen-link">اكتشف الهوية <ArrowUpLeft size={13} /></div>
      </div>
    );
  }

  if (projectId === "platform") {
    return (
      <div className="projects__screen-content projects__screen-content--platform">
        <div className="projects__screen-topline">
          <span className="projects__mini-mark"><Orbit size={15} /></span>
          <span>مساحة أعمالك</span>
          <span className="projects__avatar">م</span>
        </div>
        <p className="projects__screen-kicker">لوحة التحكم</p>
        <h3>أهلاً، محمد</h3>
        <div className="projects__metric">
          <span>ملخص الأداء</span>
          <strong>+٢٤٪</strong>
          <div className="projects__chart"><i /><i /><i /><i /><i /><i /><i /></div>
        </div>
        <p className="projects__screen-subtitle">خدماتك</p>
        <div className="projects__service-row"><span><Blocks size={15} /></span><b>إدارة المشاريع</b><ArrowUpLeft size={13} /></div>
        <div className="projects__service-row"><span><Sparkles size={15} /></span><b>التقارير والتحليلات</b><ArrowUpLeft size={13} /></div>
      </div>
    );
  }

  return (
    <div className="projects__screen-content projects__screen-content--commerce">
      <div className="projects__screen-topline">
        <span className="projects__mini-mark"><Blocks size={15} /></span>
        <span>نُقطة</span>
        <span className="projects__bag">٢</span>
      </div>
      <div className="projects__shop-banner">
        <p className="projects__screen-kicker">مجموعة جديدة</p>
        <h3>اختار<br />اللي يناسبك.</h3>
        <span>اكتشف المجموعة <ArrowUpLeft size={13} /></span>
        <div className="projects__product-art"><Blocks size={39} strokeWidth={1.2} /></div>
      </div>
      <div className="projects__shop-heading"><b>الأكثر طلبًا</b><span>عرض الكل</span></div>
      <div className="projects__products">
        <div><span className="projects__product-thumb"><Blocks size={21} /></span><b>اختيار اليوم</b><small>٢٤٩ ج.م</small></div>
        <div><span className="projects__product-thumb projects__product-thumb--second"><Sparkles size={21} /></span><b>قطعة مميزة</b><small>٣٨٠ ج.م</small></div>
      </div>
    </div>
  );
}

export default function Projects() {
  const [activeProject, setActiveProject] = useState(projects[0]);

  return (
    <section className="section section--muted projects" id="projects">
      <div className="container">
        <header className="projects__heading">
          <p className="eyebrow">نماذج من أفكارنا</p>
          <h2 className="section__title">المشاريع</h2>
          <p className="section__intro">اختار مشروع وشوف تفاصيله على الموبايل.</p>
        </header>

        <div className="projects__showcase">
          <div className="projects__device-column">
            <div className="projects__phone" data-project={activeProject.id} aria-label={`معاينة ${activeProject.title}`}>
              <div className="projects__phone-bezel">
                <div className="projects__phone-camera" />
                <div className="projects__phone-screen">
                  <div className="projects__status-bar"><span>٩:٤١</span><span>● ● ▰</span></div>
                  <ProjectScreen projectId={activeProject.id} />
                  <div className="projects__phone-nav"><span /><span /><span /><span /></div>
                </div>
              </div>
            </div>
            <p className="projects__device-caption">معاينة تفاعلية <span /></p>
          </div>

          <div className="projects__selector">
            <p className="projects__selector-label">استكشف أعمالنا <span>({String(projects.length).padStart(2, "0")})</span></p>
            <ul className="projects__list">
              {projects.map(({ id, title, label, description, Icon }, index) => {
                const isActive = activeProject.id === id;
                return (
                  <li key={id}>
                    <button
                      className={`projects__option${isActive ? " is-active" : ""}`}
                      type="button"
                      aria-pressed={isActive}
                      onClick={() => setActiveProject(projects[index])}
                    >
                      <span className="projects__option-icon"><Icon size={19} strokeWidth={1.6} /></span>
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
            <p className="projects__selector-hint">اضغط على أي مشروع لمعاينته <span>←</span></p>
          </div>
        </div>
      </div>
    </section>
  );
}
