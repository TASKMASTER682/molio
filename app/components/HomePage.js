"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import useScrollReveal from "../hooks/useScrollReveal";
import { BackToTop } from "./BackToTop";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const timeline = [
  { year: "2021", title: "The Spark", desc: "Wrote my first Hello World and got completely hooked. Stayed up 48 hours learning HTML & CSS." },
  { year: "2022", title: "Going Deeper", desc: "Dived into JavaScript, built my first dynamic web app. Discovered React and fell in love with components." },
  { year: "2023", title: "Full Stack Mode", desc: "Mastered Node.js, databases, and REST APIs. Deployed 10+ projects. Started exploring Three.js." },
  { year: "2024", title: "Shipping Products", desc: "Shipped real-world products, collaborated globally, contributed to open source, leveled up design." },
  { year: "2025", title: "Now & Beyond", desc: "Building at the intersection of web, 3D, and AI. Creating immersive experiences from Kashmir." },
];

const SOCIAL_ICONS = {
  github: "M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.342-3.369-1.342-.454-1.155-1.11-1.463-1.11-1.463-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.115 2.504.337 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.202 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.163 22 16.418 22 12c0-5.523-4.477-10-10-10z",
  linkedin: "M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z",
  twitter: "M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z",
  instagram: "M12 2c2.717 0 2.817.009 3.295.048.477.04.803.09 1.08.192.28.103.503.229.727.454.224.223.35.447.454.727.102.277.152.603.192 1.08.039.478.048.578.048 3.295s-.009 2.817-.048 3.295c-.04.477-.09.803-.192 1.08-.103.28-.229.503-.454.727-.223.224-.447.35-.727.454-.277.102-.603.152-1.08.192-.478.039-.578.048-3.295.048s-2.817-.009-3.295-.048c-.477-.04-.803-.09-1.08-.192-.28-.103-.503-.229-.727-.454-.224-.223-.35-.447-.454-.727-.102-.277-.152-.603-.192-1.08-.039-.478-.048-.578-.048-3.295s.009-2.817.048-3.295c.04-.477.09-.803.192-1.08.103-.28.229-.503.454-.727.223-.224.447-.35.727-.454.277-.102.603-.152 1.08-.192.478-.039.578-.048 3.295-.048M12 5.875a6.125 6.125 0 100 12.25 6.125 6.125 0 000-12.25zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z",
  youtube: "M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.867 3.893 12 3.893 12 3.893s-7.867 0-9.377.157A3.015 3.015 0 00.502 6.186C0 8.346 0 12 0 12s0 3.653.502 5.814a3.016 3.016 0 002.122 2.136c1.51.157 9.377.157 9.377.157s7.867 0 9.377-.157a3.015 3.015 0 002.132-2.136C24 15.653 24 12 24 12s0-3.653-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z",
  email: "M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z",
};

const SOCIAL_LABELS = {
  github: "GitHub",
  linkedin: "LinkedIn",
  twitter: "Twitter/X",
  instagram: "Instagram",
  youtube: "YouTube",
  email: "Email",
};

function socialHref(platform, link) {
  return platform === "email" ? `mailto:${link}` : link;
}

function handleSubmit(e) {
  e.preventDefault();
  const btn = e.target.querySelector("button[type=submit]");
  btn.textContent = "Message Sent! ✓";
  btn.style.background = "linear-gradient(90deg,var(--highlight),var(--note-yellow))";
  setTimeout(() => {
    btn.textContent = "Send Message to the Coder ✦";
    btn.style.background = "";
  }, 3000);
}

export default function HomePage({ projects: initialProjects, skills: initialSkills, settings: initialSettings }) {
  useScrollReveal();
  const [projects] = useState(initialProjects || []);
  const [skills] = useState(initialSkills || []);
  const [settings] = useState(initialSettings || {});
  const [expandedDesc, setExpandedDesc] = useState({});
  const [descOverflow, setDescOverflow] = useState({});

  useEffect(() => {
    let changed = false;
    const next = { ...descOverflow };
    document.querySelectorAll("[data-desc-id]").forEach((el) => {
      const id = el.dataset.descId;
      if (expandedDesc[id]) return;
      const overflow = el.scrollHeight > el.clientHeight + 4;
      if (next[id] !== overflow) {
        next[id] = overflow;
        changed = true;
      }
    });
    if (changed) setDescOverflow(next);
  }, [projects, expandedDesc, descOverflow]);

  useEffect(() => {
    if (projects.length > 0) {
      document.querySelectorAll(".tilt-card").forEach((card) => {
        if (card.dataset.tiltInit) return;
        card.dataset.tiltInit = "true";

        card.addEventListener("mousemove", (e) => {
          const r = card.getBoundingClientRect();
          const rx = (e.clientY - r.top - r.height / 2) / 18;
          const ry = -(e.clientX - r.left - r.width / 2) / 18;
          card.style.transform = `perspective(800px) rotateX(${rx}deg) rotateY(${ry}deg) translateY(-6px)`;
        });

        card.addEventListener("mouseleave", () => {
          card.style.transform = "perspective(800px) rotateX(0) rotateY(0) translateY(0)";
        });
      });
    }
  }, [projects]);

    useEffect(() => {
    const initStats = () => {
      document.querySelectorAll(".stat-num, .stat-count").forEach((el) => {
        if (el.dataset.initialized) return;
        el.dataset.initialized = "true";

        const tar = parseInt(el.dataset.target);
        let c = 0;
        const dur = 1600;
        const st = performance.now();
        const isHeroStat = el.classList.contains("stat-count");

        const animate = (now) => {
          const p = Math.min((now - st) / dur, 1);
          const ease = 1 - Math.pow(1 - p, 3);
          c = Math.round(ease * tar);
          if (isHeroStat) {
            el.textContent = tar >= 1000 ? c.toLocaleString() : c;
          } else {
            el.textContent = tar >= 1000 ? c.toLocaleString() + "+" : c + "+";
          }
          if (p < 1) requestAnimationFrame(animate);
        };

        animate(performance.now());
      });
    };

    const observer = new IntersectionObserver(
      (es) => {
        es.forEach((e) => {
          if (e.isIntersecting) {
            if (e.target.classList.contains("stat-grid")) initStats();
          }
        });
      },
      { threshold: 0.3 }
    );

    document.querySelectorAll(".stat-grid").forEach((el) => observer.observe(el));
  }, []);

  useEffect(() => {
    if (skills.length === 0) return;

    const initSkills = () => {
      document.querySelectorAll(".skill-orb").forEach((el) => {
        if (el.dataset.initialized) return;
        el.dataset.initialized = "true";

        const progress = el.querySelector(".progress");
        const pctEl = el.querySelector(".orb-p");
        if (!progress || !pctEl) return;

        const offset = parseFloat(progress.dataset.offset);
        const circ = parseFloat(progress.dataset.circ);
        const pct = Math.round((1 - offset / circ) * 100);
        const instant =
          window.matchMedia("(max-width: 768px)").matches ||
          window.matchMedia("(prefers-reduced-motion: reduce)").matches;

        setTimeout(() => {
          progress.style.strokeDashoffset = offset;
          if (instant) {
            pctEl.textContent = pct + "%";
            return;
          }
          let c = 0;
          const id = setInterval(() => {
            c = Math.min(c + pct / 12, pct);
            pctEl.textContent = Math.round(c) + "%";
            if (c >= pct) clearInterval(id);
          }, 65);
        }, 150);
      });
    };

    const observer = new IntersectionObserver(
      (es) => {
        es.forEach((e) => {
          if (e.isIntersecting) {
            initSkills();
            observer.disconnect();
          }
        });
      },
      { threshold: 0.15 }
    );

    const target = document.querySelector(".skills-grid");
    if (target) observer.observe(target);
    return () => observer.disconnect();
  }, [skills]);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (window.matchMedia("(max-width: 768px)").matches) return;

    let ctx;
    let cancelled = false;

    (async () => {
      const { gsap } = await import("gsap");
      const { ScrollTrigger } = await import("gsap/ScrollTrigger");
      if (cancelled) return;

      gsap.registerPlugin(ScrollTrigger);

      ctx = gsap.context(() => {
        const title = document.querySelector(".hero-title");
        if (title && !title.dataset.split) {
          title.dataset.split = "true";
          title.innerHTML = title.textContent
            .trim()
            .split("")
            .map((ch) => `<span class="ch"><span>${ch === " " ? "&nbsp;" : ch}</span></span>`)
            .join("");
        }

        const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

        tl.from(".hero-title .ch > span", {
          yPercent: 118,
          rotate: 8,
          duration: 1.15,
          ease: "power4.out",
          stagger: 0.05,
        }, 0.1)
          .from("[data-hero]", {
            y: 36,
            opacity: 0,
            duration: 0.9,
            stagger: 0.09,
          }, 0.55)
          .from(".portrait-circle", {
            scale: 0,
            duration: 1.3,
            ease: "elastic.out(1,0.55)",
          }, 0.45)
          .from(".hero-portrait-img", {
            clipPath: "inset(100% 0% 0% 0%)",
            duration: 1.15,
            ease: "power4.inOut",
          }, 0.6)
          .from(".hero-badge", {
            scale: 0,
            duration: 0.9,
            ease: "back.out(1.8)",
          }, 1.25)
          .from(".hero-side-label", { opacity: 0, duration: 1.2 }, 1);

        gsap.to(".hero-portrait", {
          y: -40,
          ease: "none",
          scrollTrigger: {
            trigger: "#hero",
            start: "top top",
            end: "bottom top",
            scrub: 1,
          },
        });
      });
    })();

    return () => {
      cancelled = true;
      if (ctx) ctx.revert();
    };
  }, []);

return (
    <div className="bg-[#080d14] text-[var(--ink)] font-sans overflow-x-hidden relative">
      {/* Global Background Grid */}
      <div 
        className="absolute inset-0 pointer-events-none z-0" 
        style={{ 
          backgroundImage: `
            linear-gradient(to right, rgba(0, 212, 200, 0.03) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(0, 212, 200, 0.03) 1px, transparent 1px)
          `,
          backgroundSize: '80px 80px',
        }}
      ></div>
       
      {/* HERO - reference inspired (giant title + copy + portrait) */}
      <section id="hero" className="relative min-h-screen flex flex-col justify-center overflow-hidden" style={{ background: 'radial-gradient(ellipse at 60% 50%, rgba(0,212,200,0.08) 0%, transparent 60%), #080d14' }}>
        
        {/* Focused Hero grid */}
        <div 
          className="absolute inset-0 pointer-events-none z-[1]" 
          style={{ 
            backgroundImage: `
              linear-gradient(to right, rgba(0, 212, 200, 0.08) 1.5px, transparent 1.5px),
              linear-gradient(to bottom, rgba(0, 212, 200, 0.08) 1.5px, transparent 1.5px)
            `,
            backgroundSize: '60px 60px',
            maskImage: 'radial-gradient(circle at center, black 40%, transparent 80%)',
            WebkitMaskImage: 'radial-gradient(circle at center, black 40%, transparent 80%)'
          }}
        ></div>

        {/* Vertical side labels */}
        <div className="hero-side-label left"><i></i>REACT · NEXT.JS · NODE.JS<i></i></div>
        <div className="hero-side-label right"><i></i>3D · MOTION · CREATIVE ENGINEERING<i></i></div>

        {/* Ambient glow behind portrait side */}
        <div className="absolute z-0 rounded-full right-[6%] top-[55%] -translate-y-1/2 w-[min(35vw,350px)] h-[min(35vw,350px)] bg-[radial-gradient(circle,rgba(0,212,200,0.12)_0%,transparent_70%)] hidden md:block"></div>

        <div className="relative z-[2] w-full max-w-[1240px] mx-auto px-6 pt-28 pb-8 md:pt-32">
          {/* Status badge */}
          <div className="inline-flex items-center gap-2 bg-[#00d4c8]/10 border border-[#00d4c8]/30 rounded-full px-4 py-1.5 w-fit text-[11px] text-[#00d4c8] tracking-[0.12em] uppercase font-mono">
            <span className="w-1.5 h-1.5 rounded-full bg-[#00d4c8] animate-pulse"></span> Systems operational
          </div>

          {/* Giant split-letter title */}
          <h1 className="hero-title mt-6" aria-label="Portfolio">PORTFOLIO</h1>

          {/* Copy + portrait */}
          <div className="hero-body">
            <div className="hero-copy">
              <p className="hero-overline" data-hero>HELLO, I&apos;M</p>
              <h2 className="hero-name" data-hero>Sayed <em>Anwar</em></h2>
              <p className="hero-role" data-hero>Full-Stack Developer &amp; Creator</p>
              <p className="hero-desc" data-hero>
                Crafting elegant digital products with high-performance code, custom animations, and clean visuals. Based in Srinagar, Kashmir.
              </p>
              <span className="hero-signature" data-hero>Sayed Anwar</span>

              <div className="hero-socials" data-hero>
                {settings?.socialLinks && Object.entries(settings.socialLinks).map(([platform, link]) => {
                  if (!link || !SOCIAL_ICONS[platform]) return null;
                  return (
                    <a
                      key={platform}
                      href={socialHref(platform, link)}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={SOCIAL_LABELS[platform] || platform}
                      title={SOCIAL_LABELS[platform] || platform}
                    >
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                        <path d={SOCIAL_ICONS[platform]} />
                      </svg>
                    </a>
                  );
                })}
              </div>

              {/* CTA buttons */}
              <div className="flex gap-4 flex-wrap mt-7" data-hero>
                <button
                  onClick={() => document.getElementById("projects").scrollIntoView({ behavior: "smooth" })}
                  className="relative overflow-hidden px-8 py-3.5 rounded-full text-xs font-bold tracking-[0.2em] uppercase cursor-none transition-all duration-300 hover:-translate-y-1 z-[1] flex items-center gap-3"
                  style={{ background: 'linear-gradient(90deg, #00d4c8, #0084ff)', color: '#080d14', border: 'none' }}
                >
                  Explore Work
                  <span className="w-5 h-5 rounded-full bg-[#080d14]/10 flex items-center justify-center">
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                  </span>
                </button>
                <button
                  onClick={() => document.getElementById("contact").scrollIntoView({ behavior: "smooth" })}
                  className="px-8 py-3.5 rounded-full text-xs font-bold tracking-[0.15em] uppercase cursor-none transition-all duration-300 hover:-translate-y-1 flex items-center gap-2 bg-transparent border border-white/15 text-[#8db4d4]/60 hover:border-[#00d4c8]/40 hover:text-[#00d4c8]"
                >
                  Contact
                </button>
              </div>
            </div>

            {/* Portrait with accent circle + rotating badge */}
            <div className="hero-portrait">
              <div className="portrait-circle"></div>
              <img className="hero-portrait-img" src="/main_character.png" alt="Portrait of Sayed Anwar" />
              <div className="hero-badge" aria-hidden="true">
                <svg className="hero-ring" viewBox="0 0 100 100">
                  <defs><path id="heroBadgeCircle" d="M50,50 m-36,0 a36,36 0 1,1 72,0 a36,36 0 1,1 -72,0" /></defs>
                  <text><textPath href="#heroBadgeCircle">OPEN FOR NEW PROJECTS • AVAILABLE WORLDWIDE •</textPath></text>
                </svg>
                <span className="core">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M7 17 17 7M8 7h9v9" /></svg>
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Holo label */}
        <span className="absolute bottom-[14%] right-[8%] z-[1] text-[10px] tracking-[0.2em] uppercase text-[#00d4c8]/30 animate-float pointer-events-none select-none font-mono hidden md:block">
          Kashmir.dev // online
        </span>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 z-[2] flex flex-col items-center gap-2 -translate-x-1/2">
          <span className="text-[9px] text-[#00d4c8]/30 font-mono tracking-[0.2em] uppercase">Scroll</span>
          <div className="w-px h-10 bg-gradient-to-b from-[#00d4c8] to-transparent opacity-30 animate-scroll-line"></div>
        </div>

        {/* Explore Pages badge - top right corner */}
        <div className="absolute top-24 right-8 z-[2] hidden md:flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-white/[0.03] text-[10px] font-mono text-white/40 tracking-wider uppercase">
          Explore Pages
          <span className="w-5 h-5 rounded-full border border-[#00d4c8]/30 flex items-center justify-center">
            <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="#00d4c8" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
          </span>
        </div>
      </section>

      {/* MARQUEE */}
      <div className="marquee" aria-hidden="true">
        <div className="marquee-track">
          <span>Available for Freelance</span><span>Full-Stack Development</span><span>React &amp; Next.js</span><span>Node.js &amp; APIs</span><span>3D &amp; Motion</span><span>Creative Engineering</span>
          <span>Available for Freelance</span><span>Full-Stack Development</span><span>React &amp; Next.js</span><span>Node.js &amp; APIs</span><span>3D &amp; Motion</span><span>Creative Engineering</span>
        </div>
      </div>

      {/* Divider */}
      <div className="h-px w-full" style={{ background: "linear-gradient(90deg,transparent,rgba(0,212,200,0.3),rgba(0,212,200,0.1),transparent)" }}></div>

      {/* ABOUT */}
      <section id="about" className="relative z-[1] py-28 px-8" style={{ background: 'var(--paper)' }}>
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <div className="reveal">
            <p className="flex items-center gap-2 text-[var(--accent)] text-[11px] tracking-[0.15em] uppercase mb-3 font-[var(--mono)]">
              <span className="opacity-50">{"//"}</span>About Me
            </p>
            <h2 className="font-[var(--serif)] tracking-[-0.03em] leading-[1.1] mb-6" style={{ fontSize: "clamp(2rem,5vw,3.5rem)", color: "var(--ink)" }}>
              The <span style={{ color: "var(--accent)" }}>Human</span> Behind the Code
            </h2>
            <p className="text-[var(--pencil)]/80 leading-relaxed mb-4 text-sm">
              Hey! I&apos;m <strong style={{ color: "var(--ink)" }}>The Technocrat</strong>, a passionate full-stack developer &amp; UPSC aspirant from the breathtaking valley of Srinagar, Kashmir. I breathe life into digital experiences—from elegant UIs to powerful backend systems.
            </p>
            <p className="text-[var(--pencil)]/60 leading-relaxed mb-8 text-sm">
              When I&apos;m not coding or preparing for UPSC, you&apos;ll find me experimenting with 3D visuals, chasing mountain sunsets, or sipping kahwa while architecting the next big idea.
            </p>
            <button 
              className="relative overflow-hidden px-6 py-3 rounded-[4px] text-xs font-bold tracking-widest uppercase cursor-none hover:-translate-y-0.5 transition-transform duration-200 z-[1] hover:shadow-[0_0_20px_rgba(0,212,200,0.4)]"
              style={{ background: 'linear-gradient(90deg, #00d4c8, #0084ff)', color: '#080d14', border: 'none' }}
              onClick={() => settings?.resumeUrl ? window.open(`${API_URL}/api/settings/resume`, '_blank') : window.open('/admin/settings', '_blank')}
            >
              Download Resume
            </button>
          </div>
 
          <div className="reveal stat-grid grid grid-cols-2 gap-4">
            <div className="bg-[var(--paper-tint)] border border-[var(--pencil)]/10 rounded-xl p-6 text-center transition-all duration-300 hover:-translate-y-1 hover:border-[var(--accent)]/40 hover:shadow-[0_0_25px_rgba(0,212,200,0.15)]" style={{ boxShadow: '0 4px 20px rgba(0,0,0,0.3)' }}>
              <div className="stat-num text-4xl font-bold tracking-[-0.02em]" style={{ color: "var(--accent)" }} data-target="4">
                0
              </div>
              <p className="text-[var(--pencil)]/70 text-[10px] mt-2 tracking-[0.15em] uppercase font-[var(--mono)]">Years Coding</p>
            </div>
            <div className="bg-[var(--paper-tint)] border border-[var(--pencil)]/10 rounded-xl p-6 text-center transition-all duration-300 hover:-translate-y-1 hover:border-[var(--accent)]/40 hover:shadow-[0_0_25px_rgba(0,212,200,0.15)]" style={{ boxShadow: '0 4px 20px rgba(0,0,0,0.3)' }}>
              <div className="stat-num text-4xl font-bold tracking-[-0.02em]" style={{ color: "var(--accent)" }} data-target="16">
                0
              </div>
              <p className="text-[var(--pencil)]/70 text-[10px] mt-2 tracking-[0.15em] uppercase font-[var(--mono)]">Projects Done</p>
            </div>
            <div className="bg-[var(--paper-tint)] border border-[var(--pencil)]/10 rounded-xl p-6 text-center transition-all duration-300 hover:-translate-y-1 hover:border-[var(--accent)]/40 hover:shadow-[0_0_25px_rgba(0,212,200,0.15)]" style={{ boxShadow: '0 4px 20px rgba(0,0,0,0.3)' }}>
              <div className="stat-num text-4xl font-bold tracking-[-0.02em]" style={{ color: "var(--accent)" }} data-target="1200">
                0
              </div>
              <p className="text-[var(--pencil)]/70 text-[10px] mt-2 tracking-[0.15em] uppercase font-[var(--mono)]">Coffee Cups</p>
            </div>
            <div className="bg-[var(--paper-tint)] border border-[var(--pencil)]/10 rounded-xl p-6 text-center transition-all duration-300 hover:-translate-y-1 hover:border-[var(--accent)]/40 hover:shadow-[0_0_25px_rgba(0,212,200,0.15)]" style={{ boxShadow: '0 4px 20px rgba(0,0,0,0.3)' }}>
              <div className="stat-num text-5xl font-[var(--serif)] tracking-[-0.04em]" style={{ color: "var(--accent)" }} data-target="4">
                0
              </div>
              <p className="text-[var(--pencil)]/70 text-[11px] mt-2 tracking-widest uppercase font-[var(--mono)]">Open Source</p>
            </div>
          </div>
        </div>
      </section>

      <div className="h-px w-full" style={{ background: "linear-gradient(90deg,transparent,rgba(0,212,200,0.3),rgba(0,212,200,0.1),transparent)" }}></div>
 
      {/* SKILLS */}
      <section id="skills" className="relative z-[1] py-28 px-8" style={{ background: 'var(--paper-tint)' }}>
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 reveal">
            <p className="flex items-center justify-center gap-2 text-[var(--accent)] text-[11px] tracking-[0.15em] uppercase mb-3 font-[var(--mono)]">
              <span className="opacity-50">{"//"}</span>Tech Arsenal
            </p>
            <h2 className="font-[var(--serif)] tracking-[-0.03em] leading-[1.1] mb-4" style={{ fontSize: "clamp(2rem,5vw,3.5rem)", color: "var(--ink)" }}>
              Skills &amp; <span style={{ color: "var(--accent)" }}>Technologies</span>
            </h2>
            <p className="text-[var(--pencil)]/60 max-w-md mx-auto leading-relaxed text-sm">
              The tools I wield to turn ideas into reality. Each skill forged through real-world projects and late-night sessions.
            </p>
          </div>
          <div className="skills-grid grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-5 reveal">
            {skills.length > 0 ? skills.map((s, i) => {
              const r = 45;
              const circ = 2 * Math.PI * r;
              const pct = s.percentage || 0;
              const offset = circ - (pct / 100) * circ;
              return (
                <div key={s._id || i} className="skill-orb bg-[var(--paper)] border border-[var(--pencil)]/15 rounded-2xl p-5 flex flex-col items-center gap-3 transition-all duration-300 hover:-translate-y-1 hover:border-[var(--accent)]/30 hover:shadow-[0_0_20px_rgba(0,212,200,0.1)]" style={{ boxShadow: '0 4px 20px rgba(0,0,0,0.2)' }}>
                  <div className="relative w-[100px] h-[100px]">
                    <svg viewBox="0 0 100 100" width="100" height="100" style={{ transform: "rotate(-90deg)" }}>
                      <circle cx="50" cy="50" r={r} fill="none" stroke="rgba(0,212,200,0.06)" strokeWidth="3" />
                      <circle
                        className="progress ring-prog"
                        cx="50"
                        cy="50"
                        r={r}
                        fill="none"
                        stroke={s.color || "var(--accent)"}
                        strokeWidth="3"
                        data-offset={offset}
                        data-circ={circ}
                        style={{ strokeDasharray: circ }}
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="orb-p text-lg font-[var(--serif)]" style={{ color: "var(--accent)" }}>0%</span>
                    </div>
                  </div>
                  <p className="text-[13px] font-semibold text-[var(--ink)]/80 tracking-wide">{s.name}</p>
                </div>
              );
            }) : (
              <div className="col-span-full text-center text-[var(--pencil)]/40 py-12">
                No skills yet. Add skills from the admin panel.
              </div>
            )}
          </div>
        </div>
      </section>
 
      <div className="h-px w-full" style={{ background: "linear-gradient(90deg,transparent,rgba(0,212,200,0.3),rgba(0,212,200,0.1),transparent)" }}></div>
 
      {/* PROJECTS */}
      <section id="projects" className="relative z-[1] py-28 px-8" style={{ background: 'var(--paper)' }}>
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 reveal">
            <p className="flex items-center justify-center gap-2 text-[var(--accent)] text-[11px] tracking-[0.15em] uppercase mb-3 font-[var(--mono)]">
              <span className="opacity-50">{"//"}</span>Featured Work
            </p>
            <h2 className="font-[var(--serif)] tracking-[-0.03em] leading-[1.1] mb-4" style={{ fontSize: "clamp(2rem,5vw,3.5rem)", color: "var(--ink)" }}>
              Selected <span style={{ color: "var(--accent)" }}>Projects</span>
            </h2>
            <p className="text-[var(--pencil)]/60 max-w-md mx-auto leading-relaxed text-sm">
              A curated showcase of digital products I&apos;ve designed, built, and shipped.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-7 reveal">
            {projects.length > 0 ? projects.map((p, i) => (
              <div
                key={p._id || i}
                className="tilt-card relative overflow-hidden bg-[var(--paper-tint)] border border-[var(--pencil)]/15 rounded-2xl"
                style={{ boxShadow: '0 10px 30px rgba(0,0,0,0.4)' }}
              >
                <div className="proj-glow"></div>
                <div
                  className="w-full h-48 flex items-center justify-center text-6xl border-b border-[var(--pencil)]/15"
                  style={{ background: "linear-gradient(135deg,var(--paper-tint),var(--grid))" }}
                >
                  {p.icon}
                </div>
                <div className="p-6 relative z-[1]">
                  <div className="flex gap-2 flex-wrap mb-3">
                    {p.tags?.map((t, j) => (
                      <span key={j} className="px-2.5 py-0.5 rounded-full bg-[var(--accent)]/10 border border-[var(--accent)]/20 text-[11px] text-[var(--accent)] tracking-wide">
                        {t}
                      </span>
                    ))}
                  </div>
                  <h3 className="text-lg text-[var(--ink)] mb-2">{p.title}</h3>
                  <p
                    data-desc-id={p._id || i}
                    className={`text-[13px] text-[var(--pencil)]/60 leading-relaxed ${descOverflow[p._id || i] ? "mb-1.5" : "mb-5"} ${expandedDesc[p._id || i] ? "" : "line-clamp-3"}`}
                  >
                    {p.description}
                  </p>
                  {descOverflow[p._id || i] && (
                    <button
                      type="button"
                      onClick={() => setExpandedDesc(prev => ({ ...prev, [p._id || i]: !prev[p._id || i] }))}
                      className="text-[11px] font-bold tracking-widest uppercase text-[var(--accent)] hover:underline mb-5 cursor-none"
                    >
                      {expandedDesc[p._id || i] ? "Show less" : "Show more"}
                    </button>
                  )}
                  <div className="flex gap-3">
                    <a 
                      href={p.liveLink} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="relative overflow-hidden flex-1 py-2 rounded-[4px] text-[11px] font-bold tracking-widest uppercase cursor-none z-[1] text-center hover:shadow-[0_0_15px_rgba(0,212,200,0.4)]"
                      style={{ background: 'linear-gradient(90deg, #00d4c8, #0084ff)', color: '#080d14', border: 'none' }}
                    >
                      Live Demo
                    </a>
                  </div>
                </div>
              </div>
            )) : (
              <div className="col-span-full text-center text-[var(--pencil)]/40 py-12">
                No projects yet. Add projects from the admin panel.
              </div>
            )}
          </div>
        </div>
      </section>

      <div className="h-px w-full" style={{ background: "linear-gradient(90deg,transparent,rgba(0,212,200,0.3),rgba(0,212,200,0.1),transparent)" }}></div>
 
      {/* JOURNEY */}
      <section id="journey" className="relative z-[1] py-28 px-8" style={{ background: 'var(--paper-tint)' }}>
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-16 items-start">
          <div className="reveal">
            <p className="flex items-center gap-2 text-[var(--accent)] text-[11px] tracking-[0.15em] uppercase mb-3 font-[var(--mono)]">
              <span className="opacity-50">{"//"}</span>My Path
            </p>
            <h2 className="font-[var(--serif)] tracking-[-0.03em] leading-[1.1] mb-6" style={{ fontSize: "clamp(2rem,5vw,3.5rem)", color: "var(--ink)" }}>
              The <span style={{ color: "var(--accent)" }}>Journey</span>
            </h2>
            <p className="text-[var(--pencil)]/60 leading-relaxed text-sm">
              Every great story has a beginning. Here&apos;s how I went from curious kid to digital craftsman, one milestone at a time.
            </p>
          </div>
          <div className="reveal relative pt-4">
            <div
              className="absolute left-8 top-0 bottom-0 w-px"
              style={{ background: "linear-gradient(to bottom,transparent,rgba(0,212,200,0.4),rgba(0,132,255,0.4),transparent)" }}
            ></div>
            <div id="tl">
              {timeline.map((t, i) => (
                <div key={i} className="relative pl-20 pb-12">
                  <div className="tl-dot absolute left-8 top-8 w-3 h-3 rounded-full animate-dot-pulse" style={{ background: "var(--accent)", transform: 'translateX(-50%)' }}></div>
                  <p className="text-[11px] text-[var(--accent)] tracking-widest uppercase mb-1.5 font-[var(--mono)]">{t.year}</p>
                  <h4 className="text-base text-[var(--ink)] mb-1.5">{t.title}</h4>
                  <p className="text-[13px] text-[var(--pencil)]/60 leading-relaxed">{t.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
 
      <div className="h-px w-full" style={{ background: "linear-gradient(90deg,transparent,rgba(0,212,200,0.3),rgba(0,212,200,0.1),transparent)" }}></div>
 
      {/* CONTACT */}
      <section id="contact" className="relative z-[1] py-28 px-8" style={{ background: 'var(--paper)' }}>
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-16 items-start">
          {/* Left info */}
          <div className="reveal">
            <p className="flex items-center gap-2 text-[var(--accent)] text-[11px] tracking-[0.15em] uppercase mb-3 font-[var(--mono)]">
              <span className="opacity-50">{"//"}</span>Get in Touch
            </p>
            <h2 className="font-[var(--serif)] tracking-[-0.03em] leading-[1.1] mb-6" style={{ fontSize: "clamp(2rem,5vw,3.5rem)", color: "var(--ink)" }}>
              Let&apos;s <span style={{ color: "var(--accent)" }}>Create</span>
              <br />
              Together
            </h2>
            <p className="text-[var(--pencil)]/60 leading-relaxed mb-8 text-sm">
              Have a project in mind? Want to collaborate or just say hello? My inbox is always open for interesting ideas.
            </p>
 
            {/* Social icons */}
            <div className="flex gap-3 flex-wrap mb-8">
              <a href="#" className="w-11 h-11 rounded-xl bg-[var(--paper-tint)] border border-[var(--pencil)]/15 flex items-center justify-center text-[var(--pencil)]/55 transition-all duration-300 hover:text-[var(--accent)] hover:border-[var(--accent)]/40 hover:shadow-[0_0_15px_rgba(0,212,200,0.2)] cursor-none" title="GitHub">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.342-3.369-1.342-.454-1.155-1.11-1.463-1.11-1.463-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.115 2.504.337 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.202 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.163 22 16.418 22 12c0-5.523-4.477-10-10-10z" />
                </svg>
              </a>
              <a href="#" className="w-11 h-11 rounded-xl bg-[var(--paper-tint)] border border-[var(--pencil)]/15 flex items-center justify-center text-[var(--pencil)]/55 transition-all duration-300 hover:text-[var(--accent)] hover:border-[var(--accent)]/40 hover:shadow-[0_0_15px_rgba(0,212,200,0.2)] cursor-none" title="LinkedIn">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
              </a>
              <a href="#" className="w-11 h-11 rounded-xl bg-[var(--paper-tint)] border border-[var(--pencil)]/15 flex items-center justify-center text-[var(--pencil)]/55 transition-all duration-300 hover:text-[var(--accent)] hover:border-[var(--accent)]/40 hover:shadow-[0_0_15px_rgba(0,212,200,0.2)] cursor-none" title="Twitter">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>
              <a href="#" className="w-11 h-11 rounded-xl bg-[var(--paper-tint)] border border-[var(--pencil)]/15 flex items-center justify-center text-[var(--pencil)]/55 transition-all duration-300 hover:text-[var(--accent)] hover:border-[var(--accent)]/40 hover:shadow-[0_0_15px_rgba(0,212,200,0.2)] cursor-none" title="Email">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </a>
            </div>
 
            <div className="bg-[var(--paper-tint)] border border-[var(--pencil)]/15 rounded-2xl p-6">
              <p className="text-[var(--accent)] text-[11px] tracking-widest uppercase mb-1">Based in</p>
              <p className="font-semibold text-[var(--ink)]/80">Srinagar, Jammu &amp; Kashmir</p>
              <p className="text-[11px] text-[var(--pencil)]/30 mt-0.5">India · UTC+5:30</p>
            </div>
          </div>
 
          {/* Form */}
          <div className="reveal">
            <form
              id="contact-form"
              className="bg-[var(--paper-tint)] border border-[var(--pencil)]/15 rounded-2xl p-8 flex flex-col gap-6"
              onSubmit={handleSubmit}
            >
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] text-[var(--pencil)]/40 tracking-widest uppercase mb-2">Name</label>
                  <input
                    type="text"
                    placeholder="Your name"
                    className="w-full px-4 py-3.5 bg-[#0d1520] border border-[var(--pencil)]/15 rounded-lg text-[var(--ink)] text-sm placeholder-[var(--pencil)]/30 focus:border-[#00d4c8]/50 focus:shadow-[0_0_15px_rgba(0,212,200,0.15)] transition-all duration-300 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-[var(--pencil)]/40 tracking-widest uppercase mb-2">Email</label>
                  <input
                    type="email"
                    placeholder="your@email.com"
                    className="w-full px-4 py-3.5 bg-[#0d1520] border border-[var(--pencil)]/15 rounded-lg text-[var(--ink)] text-sm placeholder-[var(--pencil)]/30 focus:border-[#00d4c8]/50 focus:shadow-[0_0_15px_rgba(0,212,200,0.15)] transition-all duration-300 outline-none"
                  />
                </div>
              </div>
              <div>
                <label className="block text-[11px] text-[var(--pencil)]/40 tracking-widest uppercase mb-2">Subject</label>
                <input
                  type="text"
                  placeholder="What's this about?"
                  className="w-full px-4 py-3.5 bg-[#0d1520] border border-[var(--pencil)]/15 rounded-lg text-[var(--ink)] text-sm placeholder-[var(--pencil)]/30 focus:border-[#00d4c8]/50 focus:shadow-[0_0_15px_rgba(0,212,200,0.15)] transition-all duration-300 outline-none"
                />
              </div>
              <div>
                <label className="block text-[11px] text-[var(--pencil)]/40 tracking-widest uppercase mb-2">Message</label>
                <textarea
                  rows="5"
                  placeholder="Tell me about your project..."
                  className="w-full px-4 py-3.5 bg-[#0d1520] border border-[var(--pencil)]/15 rounded-lg text-[var(--ink)] text-sm placeholder-[var(--pencil)]/30 focus:border-[#00d4c8]/50 focus:shadow-[0_0_15px_rgba(0,212,200,0.15)] transition-all duration-300 outline-none resize-none"
                ></textarea>
              </div>
              <button
                id="sub-btn"
                type="submit"
                className="relative overflow-hidden w-full py-4 rounded-[4px] text-xs font-bold tracking-widest uppercase cursor-none hover:opacity-90 hover:shadow-[0_0_20px_rgba(0,212,200,0.4)] transition-all duration-200 z-[1]"
                style={{ background: 'linear-gradient(90deg, #00d4c8, #0084ff)', color: '#080d14', border: 'none' }}
              >
                Send Message to the Coder ✦
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className={`relative z-[1] px-8 py-16`} style={{ background: 'linear-gradient(to bottom, transparent, var(--paper-tint))', borderTop: '1px solid var(--rule)' }}>
        <div className="max-w-7xl mx-auto">
          {/* Main Footer Content */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
            {/* Brand Section */}
            <div className="md:col-span-1">
              <div className="text-[var(--accent)] text-2xl font-[var(--serif)] tracking-wider mb-3 font-bold italic">The Technocrat</div>
              <p className="text-xs text-[var(--pencil)]/60 leading-relaxed mb-4">
                Crafting digital experiences with code, creativity, and precision. UPSC aspirant from Kashmir.
              </p>
              <div className="flex gap-3">
                {settings?.socialLinks && Object.entries(settings.socialLinks).map(([platform, link]) => {
                  if (!link || !SOCIAL_ICONS[platform]) return null;
                  return (
                    <a 
                      key={platform}
                      href={socialHref(platform, link)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-8 h-8 rounded-lg bg-[var(--paper-tint)] border border-[var(--pencil)]/20 flex items-center justify-center text-[var(--pencil)]/40 hover:text-[var(--accent)] hover:border-[var(--accent)]/30 transition-all duration-300"
                      title={SOCIAL_LABELS[platform] || platform}
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                        <path d={SOCIAL_ICONS[platform]} />
                      </svg>
                    </a>
                  );
                })}
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="text-sm font-semibold text-[var(--ink)] mb-4 tracking-widest uppercase">Navigation</h3>
              <ul className="space-y-2 text-xs">
                <li><a href="#about" className="text-[var(--pencil)]/60 hover:text-[var(--accent)] transition-colors no-underline">About</a></li>
                <li><a href="#skills" className="text-[var(--pencil)]/60 hover:text-[var(--accent)] transition-colors no-underline">Skills</a></li>
                <li><a href="#projects" className="text-[var(--pencil)]/60 hover:text-[var(--accent)] transition-colors no-underline">Projects</a></li>
                <li><a href="#journey" className="text-[var(--pencil)]/60 hover:text-[var(--accent)] transition-colors no-underline">Journey</a></li>
                <li><a href="#contact" className="text-[var(--pencil)]/60 hover:text-[var(--accent)] transition-colors no-underline">Contact</a></li>
              </ul>
            </div>

            {/* Resources */}
            <div>
              <h3 className="text-sm font-semibold text-[var(--ink)] mb-4 tracking-widest uppercase">Resources</h3>
              <ul className="space-y-2 text-xs">
                <li><Link href="/blog" className="text-[var(--pencil)]/60 hover:text-[var(--accent)] transition-colors no-underline">Blog</Link></li>
                <li>
                  <a 
                    href={settings?.resumeUrl || '#'} 
                    className={`text-[var(--pencil)]/60 hover:text-[var(--accent)] transition-colors no-underline ${!settings?.resumeUrl ? 'pointer-events-none opacity-50' : ''}`}
                    onClick={(e) => {
                      if (!settings?.resumeUrl) {
                        e.preventDefault();
                        alert('Please upload your resume from Settings first!');
                        window.location.href = '/admin/settings';
                      }
                    }}
                  >
                    Resume
                  </a>
                </li>
                <li><a href="#" className="text-[var(--pencil)]/60 hover:text-[var(--accent)] transition-colors no-underline">Dev Tools</a></li>
                <li><a href="#" className="text-[var(--pencil)]/60 hover:text-[var(--accent)] transition-colors no-underline">Snippets</a></li>
              </ul>
            </div>

            {/* Legal */}
            <div>
              <h3 className="text-sm font-semibold text-[var(--ink)] mb-4 tracking-widest uppercase">Legal</h3>
              <ul className="space-y-2 text-xs">
                <li><a href="#" className="text-[var(--pencil)]/60 hover:text-[var(--accent)] transition-colors no-underline">Privacy</a></li>
                <li><a href="#" className="text-[var(--pencil)]/60 hover:text-[var(--accent)] transition-colors no-underline">Terms</a></li>
                <li><a href="#" className="text-[var(--pencil)]/60 hover:text-[var(--accent)] transition-colors no-underline">Cookies</a></li>
                <li><a href="#" className="text-[var(--pencil)]/60 hover:text-[var(--accent)] transition-colors no-underline">Disclaimer</a></li>
              </ul>
            </div>
          </div>

          {/* Divider */}
          <div className="h-px w-full mb-8" style={{ background: "linear-gradient(to right, transparent, var(--rule), transparent)" }}></div>

          {/* Bottom Footer */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-[var(--pencil)]/30">
            <p>© 2026 The Technocrat. All rights reserved.</p>
            <p className="text-center md:text-right">Designed &amp; built with <span style={{ color: "var(--accent)" }}>code</span> in Srinagar, Kashmir</p>
          </div>
        </div>
      </footer>

      <BackToTop />
    </div>
  );
}