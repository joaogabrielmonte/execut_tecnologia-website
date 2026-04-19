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
              <a href="/protheus">Protheus</a>
              <a href="/sistemas">Sistemas</a>
              <a href="/resultados">Resultados</a>
            </div>
            <div className="footer-col">
              <h5>Empresa</h5>
              <a href="/contato">Contato</a>
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
