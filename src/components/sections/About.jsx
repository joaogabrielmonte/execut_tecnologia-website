import Container from "../layout/Container";
import aboutMetrics from "../../data/aboutMetrics";

function About() {
  return (
    <section className="section section-edge" id="sobre">
      <Container className="about-grid">
        <div className="section-heading fade-up">
          <span className="eyebrow">Sobre</span>
          <h2 className="section-title">
            Consultoria Protheus com visão de processo e código.
          </h2>
          <p className="section-subtitle">
            A Execut Tecnologia apoia empresas que usam Protheus ERP e precisam ajustar
            rotinas, integrar sistemas, automatizar fluxos e criar soluções digitais sob
            medida — sem perder estabilidade na operação.
          </p>
        </div>

        <div className="metrics-panel fade-up">
          {aboutMetrics.map((metric) => (
            <div className="metric-item" key={metric.label}>
              <strong>{metric.value}</strong>
              <span>{metric.label}</span>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}

export default About;
