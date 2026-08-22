import { useEffect, useRef } from "react";
import { Link, Route, Routes, useLocation, useNavigate } from "react-router-dom";
import Footer from "./components/layout/Footer";
import Header from "./components/layout/Header";
import About from "./components/sections/About";
import CTA from "./components/sections/CTA";
import Hero from "./components/sections/Hero";
import HowItWorks from "./components/sections/HowItWorks";
import Services from "./components/sections/Services";
import pageContent from "./data/pageContent";
import useRevealOnScroll from "./hooks/useRevealOnScroll";

function ScrollManager() {
  const location = useLocation();
  const navigate = useNavigate();
  const previousPathname = useRef(location.pathname);

  useEffect(() => {
    const pathnameChanged = previousPathname.current !== location.pathname;
    previousPathname.current = location.pathname;

    if (location.hash) {
      const target = document.getElementById(location.hash.slice(1));

      if (target) {
        target.scrollIntoView({ behavior: "smooth", block: "start" });
        navigate(location.pathname + location.search, { replace: true });
        return;
      }
    }

    if (pathnameChanged) {
      window.scrollTo({ top: 0, behavior: "auto" });
    }
  }, [location.pathname, location.hash, location.search, navigate]);

  return null;
}

function Home() {
  return (
    <>
      <Hero />
      <About />
      <Services />
      <HowItWorks />
      <CTA />
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

function NotFound() {
  return (
    <section className="page-hero">
      <div className="container page-hero-inner fade-up">
        <span className="eyebrow">Página não encontrada</span>
        <h1>Esse endereço não existe (ainda).</h1>
        <p>
          O link pode ter mudado ou o endereço foi digitado errado. Volte para a
          página inicial para continuar navegando.
        </p>
        <Link to="/" className="btn btn-primary" style={{ width: "fit-content" }}>
          Voltar para o início
        </Link>
      </div>
    </section>
  );
}

function App() {
  useRevealOnScroll();

  return (
    <>
      <ScrollManager />
      <Header />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          {Object.entries(pageContent).map(([path, page]) => (
            <Route key={path} path={path} element={<SimplePage page={page} />} />
          ))}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </>
  );
}

export default App;
