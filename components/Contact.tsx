import { ArrowLeft } from "lucide-react";

export default function Contact() {
  return (
    <section className="section contact" id="contact">
      <div className="container">
        <div className="contact__panel">
          <div className="contact__copy">
            <p className="eyebrow">خطوتك القادمة</p>
            <h2 className="section__title">عندك فكرة؟ خلّينا نبدأها سوا.</h2>
            <p className="section__intro">
              شاركنا تفاصيل مشروعك، وفريقنا هيساعدك تلاقي الطريق المناسب.
            </p>
          </div>
          <a className="button contact__action" href="mailto:hello@example.com">
            <span className="contact__action-icon" aria-hidden="true">
              ▶
            </span>
            تواصل معنا
            <ArrowLeft size={18} aria-hidden="true" />
          </a>
        </div>
      </div>
    </section>
  );
}
