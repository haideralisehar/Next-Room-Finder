import { useEffect } from "react";

export default function useLazyReveal(dep) {
  useEffect(() => {
    const cards = document.querySelectorAll(".hotel-card");

    if (!cards.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("show");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );

    cards.forEach((card) => {
      if (!card.classList.contains("show")) {
        observer.observe(card);
      }
    });

    return () => observer.disconnect();
  }, [dep]); // 👈 IMPORTANT
}
