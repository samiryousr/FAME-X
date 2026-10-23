import { Code2, Compass, PenTool } from "lucide-react";

const services = [
  {
    title: "التخطيط والاستراتيجية",
    description: "نحدد أهدافك ونرسم الطريق الأنسب لتحويل رؤيتك إلى خطوات قابلة للتنفيذ.",
    Icon: Compass,
  },
  {
    title: "التصميم وتجربة المستخدم",
    description: "نصمم هويات وواجهات تجمع بين الجمال والوضوح وتضع احتياجات عملائك أولًا.",
    Icon: PenTool,
  },
  {
    title: "التطوير الرقمي",
    description: "نبني مواقع وحلولًا رقمية سريعة ومرنة، مستعدة للنمو مع مشروعك.",
    Icon: Code2,
  },
];

export default function Services() {
  return (
    <section className="section" id="services">
      <div className="container">
        <div className="section__heading">
          <p className="eyebrow">كيف نساعدك</p>
          <h2 className="section__title">كل ما تحتاجه لتنمو فكرتك.</h2>
          <p className="section__intro">
            خدمات مترابطة تجمع بين الرؤية الإبداعية والخبرة التقنية، لتقدم
            لمشروعك أساسًا رقميًا أقوى.
          </p>
        </div>
        <div className="cards">
          {services.map(({ title, description, Icon }, index) => (
            <article className="card" key={title}>
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
    </section>
  );
}
