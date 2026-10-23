import Image from "next/image";
import { ArrowUp } from "lucide-react";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer__inner">
        <div className="footer__top">
          <div className="footer__identity">
            <a className="footer__brand" href="#home" aria-label="Famex - الرئيسية">
              <Image
                className="footer__mark"
                src="/famex-symbol.svg"
                alt=""
                width={36}
                height={30}
              />
              <span className="brand-wordmark" dir="ltr">
                FAME<span className="brand-wordmark__accent">X</span>
              </span>
            </a>
            <p className="footer__tagline">
              نحوّل أفكارك إلى تجارب رقمية تساعد أعمالك على النمو.
            </p>
          </div>
          <nav className="footer__links" aria-label="روابط الفوتر">
            <a href="#about">من نحن</a>
            <a href="#services">خدماتنا</a>
            <a href="#projects">أعمالنا</a>
            <a href="#contact">تواصل معنا</a>
          </nav>
        </div>
        <div className="footer__bottom">
          <p>© {new Date().getFullYear()} Famex. جميع الحقوق محفوظة.</p>
          <a className="footer__top-link" href="#home">
            العودة للأعلى
            <ArrowUp size={15} aria-hidden="true" />
          </a>
        </div>
      </div>
    </footer>
  );
}
