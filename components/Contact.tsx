import { ArrowLeft, Camera, Mail, MessageCircle } from "lucide-react";

export default function Contact() {
  return (
    <section className="section contact" id="contact">
      <div className="container contact__container">
        <div className="contact__panel">
          <div className="contact__copy">
            <p className="eyebrow">خطوتك القادمة</p>
            <h2 className="section__title">عندك فكرة؟ خلّينا نبدأها سوا.</h2>
            <p className="section__intro">
              شاركنا تفاصيل مشروعك، وفريقنا هيساعدك تلاقي الطريق المناسب.
            </p>
          </div>
          <div className="contact__channels" id="contact-channels" aria-label="طرق التواصل">
            <div className="contact__channel">
              <span className="contact__channel-icon"><Mail size={19} aria-hidden="true" /></span>
              <span className="contact__channel-copy">
                <strong>البريد الإلكتروني</strong>
                <span>أضف بريدك هنا</span>
              </span>
            </div>
            <div className="contact__channel">
              <span className="contact__channel-icon"><Camera size={19} aria-hidden="true" /></span>
              <span className="contact__channel-copy">
                <strong>إنستجرام</strong>
                <span>أضف رابط حسابك هنا</span>
              </span>
            </div>
            <div className="contact__channel">
              <span className="contact__channel-icon"><MessageCircle size={19} aria-hidden="true" /></span>
              <span className="contact__channel-copy">
                <strong>واتساب</strong>
                <span>أضف رقمك هنا</span>
              </span>
            </div>
          </div>
          <a className="button contact__action" href="#contact-channels">
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
