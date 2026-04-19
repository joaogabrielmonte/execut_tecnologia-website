import { useEffect, useRef } from "react";
import Container from "../layout/Container";
import Button from "../ui/Button";

function Hero() {
  const logoRef = useRef(null);
  const ghostLogoRef = useRef(null);

  useEffect(() => {
    const logo = logoRef.current;
    const ghostLogo = ghostLogoRef.current;
    if (!logo) return undefined;

    const reducedMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    let frame = 0;

    const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

    const setLogoProgress = (progress) => {
      const pushY = window.innerWidth <= 760 ? 78 : 118;
      const ghostOpacity = progress < 0.12 ? 0 : (progress - 0.12) * 0.24;

      logo.style.setProperty("--hero-logo-x", "0px");
      logo.style.setProperty("--hero-logo-y", `${progress * pushY}px`);
      logo.style.setProperty("--hero-logo-blur", `${progress * 8}px`);
      logo.style.setProperty("--hero-logo-opacity", `${Math.max(0.18, 1 - progress * 0.74)}`);
      logo.style.setProperty("--hero-logo-scale", `${1 + progress * 0.48}`);

      if (ghostLogo) {
        ghostLogo.style.setProperty("--ghost-logo-opacity", `${Math.min(ghostOpacity, 0.2)}`);
        ghostLogo.style.setProperty("--ghost-logo-scale", `${1 + progress * 0.16}`);
      }
    };

    const updateLogo = () => {
      frame = 0;

      if (reducedMotionQuery.matches) {
        setLogoProgress(0);
        return;
      }

      const scrollDistance = clamp(window.innerHeight * 0.58, 220, 520);
      const progress = clamp(window.scrollY / scrollDistance, 0, 1);
      setLogoProgress(progress);
    };

    const requestUpdate = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(updateLogo);
    };

    updateLogo();
    window.addEventListener("scroll", requestUpdate, { passive: true });
    window.addEventListener("resize", requestUpdate);

    if (reducedMotionQuery.addEventListener) {
      reducedMotionQuery.addEventListener("change", requestUpdate);
    } else {
      reducedMotionQuery.addListener(requestUpdate);
    }

    return () => {
      if (frame) window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", requestUpdate);
      window.removeEventListener("resize", requestUpdate);

      if (reducedMotionQuery.removeEventListener) {
        reducedMotionQuery.removeEventListener("change", requestUpdate);
      } else {
        reducedMotionQuery.removeListener(requestUpdate);
      }
    };
  }, []);

  return (
    <section className="hero hero-brand-light" id="inicio">
      <img
        ref={ghostLogoRef}
        src="/images/logoexecut-removebg-preview.png"
        alt=""
        className="hero-brand-light__scroll-ghost"
        aria-hidden="true"
      />

      <div className="hero-brand-light__bg" aria-hidden="true">
        <div className="hero-brand-light__mesh hero-brand-light__mesh--one"></div>
        <div className="hero-brand-light__mesh hero-brand-light__mesh--two"></div>
        <div className="hero-brand-light__glow"></div>
      </div>

      <Container>
        <div className="hero-brand-light__inner">
          <div className="hero-brand-light__content fade-up">
            <img
              ref={logoRef}
              src="/images/logoexecut-removebg-preview.png"
              alt="Execut Tecnologia"
              className="hero-brand-light__logo"
            />

            <h1>
              Sistemas conectados.
              <span>Operação mais leve.</span>
            </h1>

            <p className="hero-brand-light__microcopy">
              Criamos integrações, automações e sistemas sob medida para sua equipe
              trabalhar com mais clareza e menos retrabalho.
            </p>

            <div className="hero-brand-light__actions">
              <Button href="/contato">Conversar sobre operação</Button>
              <a className="hero-brand-light__quiet-link" href="/sistemas">
                Sistemas e integrações
              </a>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}

export default Hero;
