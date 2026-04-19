import Footer from "./components/layout/Footer";
import Header from "./components/layout/Header";
import About from "./components/sections/About";
import CTA from "./components/sections/CTA";
import Clients from "./components/sections/Clients";
import Hero from "./components/sections/Hero";
import HowItWorks from "./components/sections/HowItWorks";
import Services from "./components/sections/Services";
import Testimonials from "./components/sections/Testimonials";
import pageContent from "./data/pageContent";
import useRevealOnScroll from "./hooks/useRevealOnScroll";

function App() {
  useRevealOnScroll();

  const path = window.location.pathname;
  const currentPage = pageContent[path];

  return (
    <>
      <Header />
      <main>
        {currentPage ? (
          <SimplePage page={currentPage} />
        ) : (
          <>
            <Hero />
            <About />
            <Services />
            <HowItWorks />
            <Clients />
            <Testimonials />
            <CTA />
          </>
        )}
      </main>
      <Footer />
    </>
  );
}

function SimplePage({ page }) {
  return (
    <section className="page-hero">
      <div className="container page-hero-inner fade-up">
        <span className="eyebrow">{page.eyebrow}</span>
        <h1>{page.title}</h1>
        <p>{page.text}</p>
        <div className="page-card-grid">
          {page.items.map((item) => (
            <article className="page-card" key={item}>
              <span></span>
              <h2>{item}</h2>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export default App;
