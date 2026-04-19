import { useEffect, useRef } from "react";
import Container from "../layout/Container";

function CTA() {
  const sectionRef = useRef(null);
  const logoRef = useRef(null);

  useEffect(() => {
    const section = sectionRef.current;
    const logo = logoRef.current;
    if (!section || !logo) return undefined;

    const reducedMotionQuery = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    );

    const clamp = (value, min, max) => Math.min(Math.max(value, min), max);
    let frame = 0;

    const setLogoProgress = (progress) => {
      const easedProgress = 1 - Math.pow(1 - progress, 2.6);
      const isMobile = window.innerWidth <= 680;

      logo.style.setProperty(
        "--final-logo-opacity",
        `${isMobile ? 0.14 + easedProgress * 0.82 : 0.02 + easedProgress * 0.6}`,
      );
      logo.style.setProperty(
        "--final-logo-y",
        `${(1 - easedProgress) * (isMobile ? 72 : 172)}px`,
      );
      logo.style.setProperty(
        "--final-logo-blur",
        `${(1 - easedProgress) * (isMobile ? 10 : 30)}px`,
      );
      logo.style.setProperty(
        "--final-logo-scale",
        `${isMobile ? 0.86 + easedProgress * 0.14 : 0.62 + easedProgress * 0.38}`,
      );
    };

    const updateLogo = () => {
      frame = 0;

      if (reducedMotionQuery.matches) {
        setLogoProgress(1);
        return;
      }

      const rect = section.getBoundingClientRect();
      const start = window.innerHeight * 1.08;
      const end = window.innerHeight * 0.34;
      const progress = clamp((start - rect.top) / (start - end), 0, 1);
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
    <section className="final-cta" id="contato" ref={sectionRef}>
      <div className="final-cta-bg" aria-hidden="true"></div>

      <Container>
        <div className="final-cta-inner fade-up">
          <div className="final-cta-copy">
            <h2>Vamos conversar sobre sua operação?</h2>
            <p>
              Conte onde a operação trava hoje. Desenhamos um caminho claro para
              consultoria, integração ou desenvolvimento — sem enrolação, sem
              proposta genérica.
            </p>
          </div>

          <div className="final-cta-action">
            <div className="final-cta-logo-wrap">
              <img
                ref={logoRef}
                src="/images/logoexecut-removebg-preview.png"
                alt=""
                className="final-cta-logo"
                aria-hidden="true"
                loading="lazy"
              />
            </div>

            <a href="mailto:contato@execut.com.br" className="btn-cta-white">
              Fale com a gente
            </a>
          </div>
        </div>
      </Container>
    </section>
  );
}

export default CTA;