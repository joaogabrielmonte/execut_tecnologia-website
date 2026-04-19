import Container from "../layout/Container";
import howItWorksSteps from "../../data/howItWorksSteps";

function HowItWorks() {
  return (
    <section className="section section-edge" id="como-funciona">
      <Container>
        <div className="section-heading fade-up">
          <span className="eyebrow">Como funciona</span>
          <h2 className="section-title">Do diagnóstico ao resultado em 4 etapas.</h2>
          <p className="section-subtitle">
            Cada projeto começa com escuta e termina com uma solução que funciona na
            operação real — não só no papel.
          </p>
        </div>

        <div className="steps-grid">
          {howItWorksSteps.map((step) => (
            <div className="step fade-up" key={step.num}>
              <div className="step-num">{step.num}</div>
              <h4>{step.title}</h4>
              <p>{step.text}</p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}

export default HowItWorks;
