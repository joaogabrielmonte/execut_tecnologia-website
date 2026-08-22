import { Link } from "react-router-dom";
import Container from "./Container";

function Footer() {
  return (
    <footer className="site-footer">
      <Container>
        <div className="footer-top">
          <div className="footer-brand-block">
            <div className="footer-brand">
              <img
                src="/images/logoexecut.jpeg"
                alt=""
                className="footer-logo"
              />
              <strong>Execut Tecnologia</strong>
            </div>
            <p className="footer-tagline">
              Consultoria TOTVS Protheus, integrações e sistemas sob medida para
              operações que precisam de precisão.
            </p>
          </div>

          <div className="footer-links">
            <div className="footer-col">
              <h5>Soluções</h5>
              <Link to="/protheus">Protheus</Link>
              <Link to="/sistemas">Sistemas</Link>
              <Link to="/resultados">Resultados</Link>
            </div>
            <div className="footer-col">
              <h5>Empresa</h5>
              <Link to="/contato">Contato</Link>
              <a href="mailto:contato@execut.com.br">E-mail</a>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <span className="footer-copy">
            © {new Date().getFullYear()} Execut Tecnologia. Todos os direitos
            reservados.
          </span>
          <a href="mailto:contato@execut.com.br" className="footer-email">
            contato@execut.com.br
          </a>
        </div>
      </Container>
    </footer>
  );
}

export default Footer;
