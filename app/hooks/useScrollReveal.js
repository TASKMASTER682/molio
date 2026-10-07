// hooks/useScrollReveal.js
"use client";

import { useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export default function useScrollReveal() {
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const isMobile = window.matchMedia("(max-width: 768px)").matches;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const revealEls = document.querySelectorAll(".reveal");
    if (!isMobile && !reduceMotion) {
      revealEls.forEach((el) => {
        const items = el.querySelectorAll(".reveal-item");
        const itemTargets = items.length ? items : el.children.length > 1 ? el.children : el;
        const stagger = 0;

        gsap.from(itemTargets, {
          opacity: 0,
          y: 32,
          duration: 0.9,
          ease: "power3.out",
          stagger,
          scrollTrigger: {
            trigger: el,
            start: "top 85%",
            toggleActions: "play none none none",
            once: true,
          },
        });
      });
    }

    const revObs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) e.target.classList.add("visible");
        });
      },
      { threshold: 0.1 }
    );
    revealEls.forEach((el) => revObs.observe(el));

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
      revObs.disconnect();
    };
  }, []);
}