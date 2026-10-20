const services = [
  { title: "التخطيط", description: "نساعدك على تحديد أهداف مشروعك وخطواته." },
  { title: "التصميم", description: "نصمم تجربة واضحة تناسب احتياجات عملائك." },
  { title: "التطوير", description: "نبني حلولًا عملية قابلة للتطوير." },
];

export default function Services() {
  return (
    <section className="section section--muted" id="services">
      <div className="container">
        <h2 className="section__title">خدماتنا</h2>
        <p className="section__intro">
          مجموعة من الخدمات الأساسية لمساعدتك على تطوير مشروعك.
        </p>
        <div className="cards">
          {services.map((service) => (
            <article className="card" key={service.title}>
              <h3 className="card__title">{service.title}</h3>
              <p className="card__text">{service.description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
