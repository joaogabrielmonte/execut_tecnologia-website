import Container from "../layout/Container";
import bentoCards from "../../data/servicesData";

function Services() {
  return (
    <section className="section section-soft section-edge" id="servicos">
      <Container>
        <div className="section-heading fade-up">
          <span className="eyebrow">Soluções</span>
          <h2 className="section-title">Tecnologia que move a operação.</h2>
          <p className="section-subtitle">
            Atuamos entre regra de negócio, ERP e desenvolvimento para entregar sistemas
            que conversam com a realidade da empresa — não com uma especificação genérica.
          </p>
        </div>

        <div className="bento-grid">
          {bentoCards.map((card, index) => (
            <article
              key={index}
              className={`bento-card fade-up${card.dark ? " dark" : ""}${card.span2 ? " span2" : ""}`}
            >
              {card.type === "stat" ? (
                <>
                  <span className="bento-stat">{card.stat}</span>
                  <h3>{card.title}</h3>
                  <p>{card.text}</p>
                </>
              ) : (
                <>
                  <div className="bento-icon">{card.icon}</div>
                  <h3>{card.title}</h3>
                  <p>{card.text}</p>
                </>
              )}
            </article>
          ))}
        </div>
      </Container>
    </section>
  );
}

export default Services;
