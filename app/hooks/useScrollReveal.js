// hooks/useScrollReveal.js
"use client";

import { useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export default function useScrollReveal() {
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const revealEls = document.querySelectorAll(".reveal");
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

    const revObs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) e.target.classList.add("visible");
        });
      },
      { threshold: 0.1 }
    );
    revealEls.forEach((el) => revObs.observe(el));

    const skillObs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (!e.isIntersecting) return;
          const card = e.target;
          const circle = card.querySelector(".progress");
          const pctEl = card.querySelector(".orb-p");
          if (!circle || !pctEl) return;
          const finalOffset = parseFloat(circle.dataset.offset);
          const circ = parseFloat(circle.dataset.circ);
          const pct = Math.round((1 - finalOffset / circ) * 100);
          circle.style.strokeDashoffset = finalOffset;
          let cur = 0;
          const step = () => {
            cur = Math.min(cur + pct / 60, pct);
            pctEl.textContent = Math.round(cur) + "%";
            if (cur < pct) requestAnimationFrame(step);
          };
          requestAnimationFrame(step);
          skillObs.unobserve(card);
        });
      },
      { threshold: 0.5 }
    );
    document.querySelectorAll(".skill-orb").forEach((el) => skillObs.observe(el));

    const statObs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (!e.isIntersecting) return;
          const el = e.target;
          const target = parseInt(el.dataset.target);
          let cur = 0;
          const dur = 1500;
          const start = performance.now();
          const tick = (now) => {
            const p = Math.min((now - start) / dur, 1);
            const ease = 1 - Math.pow(1 - p, 3);
            cur = Math.round(ease * target);
            el.textContent = target >= 1000 ? cur.toLocaleString() + "+" : cur + "+";
            if (p < 1) requestAnimationFrame(tick);
          };
          requestAnimationFrame(tick);
          statObs.unobserve(el);
        });
      },
      { threshold: 0.5 }
    );
    document.querySelectorAll(".stat-num").forEach((el) => statObs.observe(el));

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
      revObs.disconnect();
      skillObs.disconnect();
      statObs.disconnect();
    };
  }, []);
}