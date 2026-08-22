import { useEffect } from "react";
import { useLocation } from "react-router-dom";

function useRevealOnScroll(selector = ".fade-up", threshold = 0.14) {
  const location = useLocation();

  useEffect(() => {
    const animatedItems = document.querySelectorAll(selector);
    if (!animatedItems.length) return undefined;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold },
    );

    animatedItems.forEach((item) => observer.observe(item));
    return () => observer.disconnect();
  }, [selector, threshold, location.pathname]);
}

export default useRevealOnScroll;
