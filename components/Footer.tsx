export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer__inner">
        <a className="footer__brand" href="#home" aria-label="Famex - الرئيسية">
          <span className="brand-wordmark" dir="ltr">
            FAME<span className="brand-wordmark__accent">X</span>
          </span>
        </a>
        <p>© {new Date().getFullYear()} Famex. جميع الحقوق محفوظة.</p>
      </div>
    </footer>
  );
}
