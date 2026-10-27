import About from "@/components/About";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import Hero from "@/components/Hero";
import Navbar from "@/components/Navbar";
import Projects from "@/components/Projects";
import Services from "@/components/Services";
import TestimonialsSection from "@/components/ui/testimonials-3";

const TICKER_ITEMS = [
  { en: "STRATEGY", ar: "تخطيط ع الصح" },
  { en: "DESIGN", ar: "ديزاين من الآخر" },
  { en: "DEVELOPMENT", ar: "كود طلقة" },
  { en: "GROWTH", ar: "مبيعات تفرّق" },
] as const;

function ArcadeTickerSet({ hidden = false }: { hidden?: boolean }) {
  return (
    <div className="arcade-ticker__set" aria-hidden={hidden || undefined}>
      {Array.from({ length: 3 }, (_, loop) =>
        TICKER_ITEMS.map((item) => (
          <span key={`${loop}-${item.en}`}>
            {item.en} <b>{item.ar}</b>
            <i />
          </span>
        )),
      )}
    </div>
  );
}

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <div
          className="arcade-ticker"
          dir="ltr"
          role="region"
          aria-label="خدماتنا: استراتيجية، تصميم، تطوير، ونمو"
        >
          <div className="arcade-ticker__track">
            <ArcadeTickerSet />
            <ArcadeTickerSet hidden />
          </div>
        </div>
        <About />
        <Services />
        <Projects />
        <Contact />
        <section className="testimonials-section section" id="testimonials">
          <div className="container">
            <div className="section__heading" style={{ marginInline: "auto", textAlign: "center" }}>
              <p className="eyebrow">آراء عملائنا</p>
              <h2 className="section__title">تجارب عملائنا</h2>
              <p className="section__intro">
                مش إحنا اللي هنمدح نفسنا — خلي عملائنا يحكولك.
              </p>
            </div>
            <TestimonialsSection />
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
