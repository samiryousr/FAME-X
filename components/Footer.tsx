import NinoSky from "@/components/NinoSky";
import {
  FacebookIcon,
  InstagramIcon,
  MailIcon,
} from "@/components/SocialIcons";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer i9k-footer i9k-footer--structured" id="footer">
      <NinoSky>
        <div className="container i9k-footer__inner">
          <div className="i9k-footer__top">
            {/* Brand & Identity Column */}
            <div className="i9k-footer__brand">
              <a href="#home" className="i9k-footer__brand-link" aria-label="FameX - الرئيسية">
                <span className="brand-visual" aria-hidden="true">
                  <span className="brand-current" dir="ltr">
                    <span className="brand-letter">
                      FAME<span className="brand-wordmark__accent">X</span>
                    </span>
                    <span className="brand-cursor is-blinking">_</span>
                  </span>
                </span>
              </a>
              <p className="footer-tagline">
                صُنع بحب 💚، وبأعلى ليفل من الكود والابتكار، لنقل أفكارك إلى القمة.
              </p>
              <div className="i9k-footer__status">
                <span className="i9k-footer__status-dot" aria-hidden="true" />
                <span>متاح لاستقبال مشاريع جديدة</span>
              </div>
              <div className="i9k-footer__socials" aria-label="حسابات التواصل الاجتماعي">
                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="i9k-footer__social-link"
                  aria-label="فيسبوك"
                >
                  <FacebookIcon size={16} />
                </a>
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="i9k-footer__social-link"
                  aria-label="إنستجرام"
                >
                  <InstagramIcon size={16} />
                </a>
                <a
                  href="mailto:hello@famex.dev"
                  className="i9k-footer__social-link"
                  aria-label="البريد الإلكتروني"
                >
                  <MailIcon size={16} />
                </a>
              </div>
            </div>

            {/* Navigation Section */}
            <nav className="i9k-footer__nav" aria-label="روابط الفوتر">
              <h2 className="i9k-footer__heading">استكشف</h2>
              <ul className="i9k-footer__links">
                <li>
                  <a href="#home" className="i9k-footer__link">
                    الرئيسية
                  </a>
                </li>
                <li>
                  <a href="#about" className="i9k-footer__link">
                    مين إحنا
                  </a>
                </li>
                <li>
                  <a href="#services" className="i9k-footer__link">
                    بنقدملك إيه
                  </a>
                </li>
                <li>
                  <a href="#projects" className="i9k-footer__link">
                    شغلنا السابق
                  </a>
                </li>
              </ul>
            </nav>
          </div>

          {/* Bottom Bar: Copyright & Back to Top */}
          <div className="i9k-footer__bottom">
            <p className="i9k-footer__copyright">
              © {currentYear} FameX. جميع الحقوق محفوظة.
            </p>
            <a href="#home" className="i9k-footer__top-link" aria-label="العودة لأعلى الصفحة">
              <span>العودة للأعلى</span>
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M12 19V5M5 12l7-7 7 7" />
              </svg>
            </a>
          </div>
        </div>
      </NinoSky>
    </footer>
  );
}
