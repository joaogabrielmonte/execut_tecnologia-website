import Container from "../layout/Container";
import testimonials from "../../data/testimonials";

function Testimonials() {
  return (
    <section className="section section-edge" id="depoimentos">
      <Container>
        <div className="section-heading fade-up">
          <span className="eyebrow">Depoimentos</span>
          <h2 className="section-title">
            Resultados que geram relacionamento de longo prazo.
          </h2>
        </div>

        <div className="testimonials-grid">
          {testimonials.map((testimonial) => (
            <article className="testimonial-card fade-up" key={testimonial.name}>
              <p>{testimonial.quote}</p>
              <div className="testimonial-person">
                <div className="avatar">{testimonial.initials}</div>
                <div>
                  <strong>{testimonial.name}</strong>
                  <span>{testimonial.role}</span>
                </div>
              </div>
            </article>
          ))}
        </div>
      </Container>
    </section>
  );
}

export default Testimonials;
