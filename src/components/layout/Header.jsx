import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import Button from "../ui/Button";
import Container from "./Container";

const navItems = [
  { label: "Sobre", href: "/#sobre" },
  { label: "Protheus", href: "/protheus" },
  { label: "Sistemas", href: "/sistemas" },
  { label: "Resultados", href: "/resultados" },
];

function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const currentPath = location.pathname;
  const currentHash = location.hash;
  const isHome = currentPath === "/";

  useEffect(() => {
    document.body.classList.toggle("menu-open", menuOpen);

    const closeOnEscape = (event) => {
      if (event.key === "Escape") setMenuOpen(false);
    };

    if (menuOpen) {
      window.addEventListener("keydown", closeOnEscape);
    }

    return () => {
      document.body.classList.remove("menu-open");
      window.removeEventListener("keydown", closeOnEscape);
    };
  }, [menuOpen]);

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [location]);

  const closeMenu = () => setMenuOpen(false);
  const isNavItemActive = (item) => {
    if (item.href.startsWith("/#")) {
      return currentPath === "/" && currentHash === item.href.slice(1);
    }

    return currentPath === item.href;
  };

  return (
    <>
      <header
        className={`site-header ${isScrolled ? "is-scrolled" : ""} ${
          isHome ? "" : "on-page"
        }`}
      >
        <Container className="header-inner">
          <Link to="/" className="brand" aria-label="Execut Tecnologia" onClick={closeMenu}>
            <img src="/images/logoexecut-symbol.png" alt="" className="brand-image" />
          </Link>

          <nav className="nav desktop-nav" aria-label="Navegação principal">
            {navItems.map((item) => (
              <Link
                key={item.href}
                to={item.href}
                className={isNavItemActive(item) ? "is-active" : ""}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <Button href="/contato" className="header-cta">
            Agendar conversa
          </Button>

          <button
            className={`menu-toggle ${menuOpen ? "is-open" : ""}`}
            type="button"
            aria-label={menuOpen ? "Fechar menu" : "Abrir menu"}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((v) => !v)}
          >
            <span className="menu-toggle__icon" aria-hidden="true">
              <span></span>
              <span></span>
            </span>
            <span className="menu-toggle__text">{menuOpen ? "Fechar" : "Menu"}</span>
          </button>
        </Container>
      </header>

      <div className={`mobile-drawer ${menuOpen ? "is-open" : ""}`} aria-hidden={!menuOpen}>
        <div className="mobile-drawer__top">
          <span>Menu</span>
          <button
            className="drawer-close"
            type="button"
            aria-label="Fechar menu"
            onClick={closeMenu}
          >
            <span className="drawer-close__text">Fechar</span>
            <span className="drawer-close__icon" aria-hidden="true">
              <span></span>
              <span></span>
            </span>
          </button>
        </div>
        <nav className="mobile-nav" aria-label="Navegação mobile">
          {navItems.map((item) => (
            <Link key={item.href} to={item.href} onClick={closeMenu}>
              {item.label}
            </Link>
          ))}
          <Button href="/contato" onClick={closeMenu}>
            Agendar conversa
          </Button>
        </nav>
      </div>

      {menuOpen && (
        <button
          className="drawer-scrim"
          type="button"
          aria-label="Fechar menu"
          onClick={closeMenu}
        />
      )}
    </>
  );
}

export default Header;
