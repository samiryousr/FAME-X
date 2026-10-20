const projects = [
  { title: "المشروع الأول", description: "أضف هنا نبذة قصيرة عن المشروع." },
  { title: "المشروع الثاني", description: "أضف هنا نبذة قصيرة عن المشروع." },
  { title: "المشروع الثالث", description: "أضف هنا نبذة قصيرة عن المشروع." },
];

export default function Projects() {
  return (
    <section className="section" id="projects">
      <div className="container">
        <h2 className="section__title">أعمالنا</h2>
        <p className="section__intro">نماذج من المشاريع التي عملنا عليها.</p>
        <div className="cards">
          {projects.map((project) => (
            <article className="card" key={project.title}>
              <h3 className="card__title">{project.title}</h3>
              <p className="card__text">{project.description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
