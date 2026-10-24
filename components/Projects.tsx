"use client";

import { useState } from "react";
import {
  Aperture,
  ArrowLeft,
  ArrowUpLeft,
  Blocks,
  Flame,
  Orbit,
  Sparkles,
} from "lucide-react";

const projects = [
  {
    id: "commerce",
    title: "متجر إلكتروني طلقة وبيبيع",
    label: "أبلكيشن متجر",
    description: "تجربة تسوق سالكة وسريعة تخلي الزبون يملى السلة ويدفع في ثواني.",
    Icon: Blocks,
  },
  {
    id: "identity",
    title: "هوية بصرية تعلّم وتعيش",
    label: "براندينج وهوية",
    description: "ديزاين كامل مليان روح وشخصية بتعكس هيبة البراند وتفاصيله.",
    Icon: Aperture,
  },
  {
    id: "platform",
    title: "داشبورد ومنصة إدارة ذكية",
    label: "منصة ويب وسحابية",
    description: "كل أرقام وبيانات بيزنسك في مكان واحد منظم وسهل من غير وجع دماغ.",
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

  if (projectId === "platform") {
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
          <Sparkles size={15} className="projects__sparkle-icon" aria-hidden="true" />
        </h3>
        <div className="projects__metric">
          <span>أرباح الشهر ده</span>
          <strong>+٢٤٪</strong>
          <div className="projects__chart"><i /><i /><i /><i /><i /><i /><i /></div>
        </div>
        <p className="projects__screen-subtitle">خدماتك السريعة</p>
        <div className="projects__service-row"><span><Blocks size={15} /></span><b>المشاريع الشغالة</b><ArrowUpLeft size={13} /></div>
        <div className="projects__service-row"><span><Sparkles size={15} /></span><b>تقارير الأرباح والمبيعات</b><ArrowUpLeft size={13} /></div>
      </div>
    );
  }

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
        <div><span className="projects__product-thumb projects__product-thumb--second"><Sparkles size={21} /></span><b>الأكتر طلباً</b><small>٣٨٠ ج.م</small></div>
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
                  <div className="projects__status-bar"><span>٩:٤١</span><span>● ● ▰</span></div>
                  <ProjectScreen projectId={activeProject.id} />
                  <div className="projects__phone-nav"><span /><span /><span /><span /></div>
                </div>
              </div>
            </div>
            <p className="projects__device-caption">معاينة تفاعلية <span /></p>
          </div>

          <div className="projects__selector">
            <p className="projects__selector-label">استكشف شغلنا <span>({String(projects.length).padStart(2, "0")})</span></p>
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
            <p className="projects__selector-hint">
              <span>دوس على أي مشروع عشان تعاينه فوري</span>
              <ArrowLeft size={14} aria-hidden="true" />
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
