import { useEffect, useRef } from "react";
import Container from "../layout/Container";
import clientLogos from "../../data/clientLogos";

function Clients() {
  const sectionRef = useRef(null);

  useEffect(() => {
    const isTouchLike =
      window.matchMedia("(hover: none)").matches ||
      window.matchMedia("(pointer: coarse)").matches;

    if (!isTouchLike || !sectionRef.current) return;

    const items = sectionRef.current.querySelectorAll(".client-logo-slot");

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-revealed");
          } else {
            entry.target.classList.remove("is-revealed");
          }
        });
      },
      {
        threshold: 0.45,
        rootMargin: "0px 0px -8% 0px",
      }
    );

    items.forEach((item) => observer.observe(item));

    return () => observer.disconnect();
  }, []);

  return (
    <section className="clients-section" id="clientes" ref={sectionRef}>
      <Container>
        <div className="clients-heading fade-up">
          <span className="eyebrow">Clientes</span>
          <h2>Empresas que confiam na Execut</h2>
        </div>

        <div className="logo-wall" aria-label="Logos de clientes e marcas ilustrativas">
          {clientLogos.map((logo) => (
            <div className={`client-logo-slot ${logo.className ?? ""}`} key={logo.name}>
              <img
                className="client-logo-image"
                src={logo.src}
                alt={`${logo.fictional ? "Marca ilustrativa" : "Logo"} ${logo.name}`}
                loading="lazy"
              />
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}

export default Clients;