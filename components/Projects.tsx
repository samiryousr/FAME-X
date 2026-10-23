import { Aperture, Blocks, Orbit } from "lucide-react";

const projects = [
  {
    title: "تجربة التجارة الإلكترونية",
    label: "تجربة رقمية",
    description: "مساحة تسوق عصرية تجعل رحلة العميل أبسط وأكثر وضوحًا.",
    Icon: Blocks,
  },
  {
    title: "هوية تنبض بالحياة",
    label: "هوية بصرية",
    description: "لغة بصرية متناسقة تمنح العلامة حضورًا يسهل تمييزه.",
    Icon: Aperture,
  },
  {
    title: "منصة أعمال متكاملة",
    label: "تطوير ويب",
    description: "منصة مرنة ترتب الخدمات والمعلومات في تجربة واحدة.",
    Icon: Orbit,
  },
];

export default function Projects() {
  return (
    <section className="section section--muted" id="projects">
      <div className="container">
        <div className="section__heading">
          <p className="eyebrow">مساحات للإبداع</p>
          <h2 className="section__title">أفكار تتحول إلى تجارب.</h2>
          <p className="section__intro">
            نؤمن أن كل مشروع يبدأ بفكرة تستحق أن تُقدّم بأفضل صورة.
          </p>
        </div>
        <div className="projects__grid">
          {projects.map(({ title, label, description, Icon }) => (
            <article className="project-card" key={title}>
              <div className="project-card__art" aria-hidden="true">
                <span className="project-card__shape">
                  <Icon size={44} strokeWidth={1.25} />
                </span>
              </div>
              <div className="project-card__content">
                <p className="project-card__label">{label}</p>
                <h3 className="card__title">{title}</h3>
                <p className="card__text">{description}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
