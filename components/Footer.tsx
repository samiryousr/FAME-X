import Image from "next/image";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer__inner">
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
        <p>© {new Date().getFullYear()} Famex. جميع الحقوق محفوظة.</p>
      </div>
    </footer>
  );
}
