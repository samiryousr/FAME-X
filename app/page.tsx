import About from "@/components/About";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import Hero from "@/components/Hero";
import Navbar from "@/components/Navbar";
import Projects from "@/components/Projects";
import Services from "@/components/Services";

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <div
          className="arcade-ticker"
          role="region"
          aria-label="خدماتنا: استراتيجية، تصميم، تطوير، ونمو"
        >
          <div className="arcade-ticker__track" dir="ltr">
            {[0, 1].map((copy) => (
              <div
                className="arcade-ticker__set"
                key={copy}
                aria-hidden={copy === 1}
              >
                <span>
                  STRATEGY <b>استراتيجية</b>
                </span>
                <i />
                <span>
                  DESIGN <b>تصميم</b>
                </span>
                <i />
                <span>
                  DEVELOPMENT <b>تطوير</b>
                </span>
                <i />
                <span>
                  GROWTH <b>نمو</b>
                </span>
                <i />
              </div>
            ))}
          </div>
        </div>
        <About />
        <Services />
        <Projects />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
