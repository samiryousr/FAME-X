const links = [
  { href: "#about", label: "من نحن" },
  { href: "#services", label: "خدماتنا" },
  { href: "#projects", label: "أعمالنا" },
  { href: "#contact", label: "تواصل معنا" },
];

export default function Navbar() {
  return (
    <header className="navbar">
      <nav className="container navbar__inner" aria-label="التنقل الرئيسي">
        <a className="navbar__brand" href="#" aria-label="Famex - الرئيسية">
          Famex
        </a>
        <div className="navbar__links">
          {links.map((link) => (
            <a key={link.href} href={link.href}>
              {link.label}
            </a>
          ))}
        </div>
      </nav>
    </header>
  );
}
