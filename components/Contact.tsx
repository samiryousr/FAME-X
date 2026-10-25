import ContactForm from "@/components/ContactForm";
import { PixelGamepad } from "@/components/PixelIcons";
import {
  WhatsAppIcon,
  MailIcon,
} from "@/components/SocialIcons";

export default function Contact() {
  return (
    <section className="section contact" id="contact">
      <div className="container contact__container">
        <div className="contact__panel">
          {/* Right Side (RTL): Headline & Brand Identity */}
          <div className="contact__hero">
            <div className="contact__eyebrow-wrap">
              <span className="contact__status-led" aria-hidden="true" />
              <span className="eyebrow">— دورك دلوقتي</span>
            </div>

            <h2 className="contact__hero-title">
              عندك فكرة؟
              <span className="contact__title-highlight">خلّيها تبدأ.</span>
            </h2>

            <p className="contact__hero-desc">
              احكيلنا باختصار عنك وعن مشروعك، وهنجهّزلك رسالة تقدر تنسخها وتبعتها بنفسك في ثواني.
            </p>

            <div className="contact__level-badge" aria-label="Start A New Level - FameX">
              <PixelGamepad size={16} className="contact__level-icon" />
              <span className="contact__level-text">START A NEW LEVEL</span>
              <span className="contact__level-divider" aria-hidden="true" />
              <span className="contact__level-brand" dir="ltr">
                FAME<span className="brand-wordmark__accent">X</span>
                <span className="brand-cursor is-blinking">_</span>
              </span>
            </div>

            {/* Direct Quick Reach Channels with Standard Smooth Social Icons */}
            <div className="contact__quick-channels">
              <span className="contact__quick-label">أو تواصل معنا مباشرة:</span>
              <div className="contact__quick-pills">
                <a
                  href="https://wa.me/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="contact__quick-pill"
                  aria-label="تواصل عبر واتساب"
                >
                  <WhatsAppIcon size={16} />
                  <span>واتساب</span>
                </a>
                <a
                  href="mailto:hello@famex.dev"
                  className="contact__quick-pill"
                  aria-label="تواصل عبر الإيميل"
                >
                  <MailIcon size={16} />
                  <span>الإيميل</span>
                </a>
              </div>
            </div>
          </div>

          {/* Left Side (RTL): Interactive Message Builder Card */}
          <ContactForm />
        </div>
      </div>
    </section>
  );
}
