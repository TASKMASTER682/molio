"use client";

import { useEffect, useState, Fragment } from "react";
import Link from "next/link";
import useScrollReveal from "../hooks/useScrollReveal";
import { sanitizeHtml, clampHtml } from "../../lib/html";
import { BackToTop } from "./BackToTop";

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

const services = [
  {
    icon: "⚡",
    title: "Web Apps & Dashboards",
    desc: "React / Next.js products built end-to-end — auth, dashboards, role-based access, payments-ready flows.",
  },
  {
    icon: "📝",
    title: "Exam & EdTech Platforms",
    desc: "CBT engines, question banks, timers, result analytics — designed to hold up under real exam-day traffic.",
  },
  {
    icon: "🔌",
    title: "APIs & Integrations",
    desc: "REST APIs, webhooks, payment & WhatsApp integrations, auth, and background automation.",
  },
  {
    icon: "🚀",
    title: "Fast Marketing & SEO Sites",
    desc: "ISR/static sites with schema markup, clean metadata, and Core Web Vitals kept in the green.",
  },
];

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

const FIELD_ACCENTS = {
  Problem: "#ffb454",
  "My role": "#66b8ff",
  Timeline: "#c792ea",
  Result: "#00d4c8",
  Stack: "#8db4d4",
};

function CaseField({ label, value }) {
  if (!value) return null;
  const color = FIELD_ACCENTS[label] || "#00d4c8";
  return (
    <div className="rounded-lg border border-[var(--pencil)]/10 bg-white/[0.02] px-3.5 py-2.5 transition-colors duration-300 hover:border-[var(--pencil)]/25 hover:bg-white/[0.04]">
      <p className="flex items-center gap-1.5 text-[10px] font-bold tracking-[0.18em] uppercase font-[var(--mono)] mb-1" style={{ color }}>
        <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: color, boxShadow: `0 0 8px ${color}` }}></span>
        {label}
      </p>
      <p className="text-[13px] text-[var(--pencil)]/80 leading-relaxed">{value}</p>
    </div>
  );
}

function ExpandableText({ text, limit = 40, className = "", href, label = "Show more" }) {
  const [open, setOpen] = useState(false);
  if (!text) return null;
  const html = sanitizeHtml(text);
  const { html: preview, truncated } = clampHtml(html, limit);
  const arrow = (
    <svg
      width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"
      className={`transition-transform duration-300 ${open && !href ? "rotate-180" : ""}`}
    >
      {href ? <path d="M5 12h14M12 5l7 7-7 7" /> : <path d="M6 9l6 6 6-6" />}
    </svg>
  );
  return (
    <div>
      <div
        key={open ? "open" : "closed"}
        className={`case-html ${className} ${open ? "case-expand" : ""}`}
        dangerouslySetInnerHTML={{ __html: open ? html : preview }}
      />
      {truncated &&
        (href ? (
          <Link
            href={href}
            className="mt-2 inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.18em] font-[var(--mono)] text-[#66b8ff]/85 hover:text-[#66b8ff] transition-colors no-underline"
          >
            {label}
            {arrow}
          </Link>
        ) : (
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          aria-expanded={open}
          className="mt-2 inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.18em] font-[var(--mono)] text-[#66b8ff]/80 hover:text-[#66b8ff] transition-colors cursor-none"
        >
          {open ? "Show less" : "Show more"}
          <svg
            width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor"
            strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"
            className={`transition-transform duration-300 ${open ? "rotate-180" : ""}`}
          >
            <path d="M6 9l6 6 6-6" />
          </svg>
        </button>
        ))}
    </div>
  );
}

function PaletteWidget() {
  const TOTAL = 15;
  const [statuses, setStatuses] = useState(() =>
    Array.from({ length: TOTAL }, (_, i) => (i < 4 ? "answered" : "unanswered"))
  );
  const [current, setCurrent] = useState(4);
  const [seconds, setSeconds] = useState(45 * 60);

  useEffect(() => {
    const id = setInterval(() => setSeconds((s) => (s > 0 ? s - 1 : 0)), 1000);
    return () => clearInterval(id);
  }, []);

  const answered = statuses.filter((s) => s === "answered").length;
  const marked = statuses.filter((s) => s === "marked").length;
  const mm = String(Math.floor(seconds / 60)).padStart(2, "0");
  const ss = String(seconds % 60).padStart(2, "0");

  function setStatus(next) {
    setStatuses((prev) => prev.map((s, i) => (i === current ? next : s)));
  }

  const cellColor = (s) => {
    if (s === "answered") return { background: "rgba(0,212,200,0.15)", borderColor: "rgba(0,212,200,0.55)", color: "#00d4c8" };
    if (s === "marked") return { background: "rgba(0,132,255,0.15)", borderColor: "rgba(0,132,255,0.55)", color: "#66b8ff" };
    return { background: "rgba(141,180,212,0.05)", borderColor: "rgba(141,180,212,0.2)", color: "rgba(141,180,212,0.6)" };
  };

  return (
    <div className="rounded-2xl border border-[var(--pencil)]/15 bg-[var(--paper)] p-6" style={{ boxShadow: "0 10px 30px rgba(0,0,0,0.4)" }}>
      <div className="flex items-center justify-between gap-4 mb-4 flex-wrap">
        <div>
          <p className="text-[10px] tracking-[0.18em] uppercase text-[var(--accent)] font-[var(--mono)]">Live preview</p>
          <p className="text-sm text-[var(--ink)] font-semibold">Exam-OS question palette</p>
        </div>
        <div className="text-right">
          <p className="text-[10px] tracking-[0.18em] uppercase text-[var(--pencil)]/50 font-[var(--mono)]">Time left</p>
          <p className="text-lg font-[var(--serif)] text-[var(--accent)] tabular-nums">{mm}:{ss}</p>
        </div>
      </div>

      <div className="flex gap-1.5 flex-wrap mb-4">
        {statuses.map((s, i) => (
          <button
            key={i}
            type="button"
            onClick={() => setCurrent(i)}
            aria-label={`Question ${i + 1}`}
            className={`w-8 h-8 rounded-md text-[11px] font-bold font-[var(--mono)] border transition-all duration-200 cursor-none ${i === current ? "ring-2 ring-[var(--accent)] ring-offset-2 ring-offset-[var(--paper)]" : ""}`}
            style={cellColor(s)}
          >
            {i + 1}
          </button>
        ))}
      </div>

      <div className="flex items-center gap-2 flex-wrap mb-4">
        <button
          type="button"
          onClick={() => setStatus("answered")}
          className="px-3 py-1.5 rounded-full text-[10px] font-bold tracking-widest uppercase border border-[#00d4c8]/40 text-[#00d4c8] hover:bg-[#00d4c8]/10 transition-colors cursor-none"
        >
          Mark answered
        </button>
        <button
          type="button"
          onClick={() => setStatus("marked")}
          className="px-3 py-1.5 rounded-full text-[10px] font-bold tracking-widest uppercase border border-[#0084ff]/40 text-[#66b8ff] hover:bg-[#0084ff]/10 transition-colors cursor-none"
        >
          Mark for review
        </button>
        <button
          type="button"
          onClick={() => setStatus("unanswered")}
          className="px-3 py-1.5 rounded-full text-[10px] font-bold tracking-widest uppercase border border-[var(--pencil)]/25 text-[var(--pencil)]/60 hover:border-[var(--pencil)]/50 transition-colors cursor-none"
        >
          Clear
        </button>
      </div>

      <div className="flex items-center justify-between text-[11px] font-[var(--mono)] text-[var(--pencil)]/55">
        <span>Answered: {answered}/{TOTAL}</span>
        <span>For review: {marked}</span>
        <span>Q {current + 1} of {TOTAL}</span>
      </div>
    </div>
  );
}

export default function HomePage({ projects: initialProjects, skills: initialSkills, settings: initialSettings, testimonials = [] }) {
  useScrollReveal();
  const [projects] = useState(initialProjects || []);
  const [skills] = useState(initialSkills || []);
  const [settings] = useState(initialSettings || {});

  const proofStats = (settings?.proofStats || []).filter((s) => s && s.value && s.label).slice(0, 4);

  const ownProjects = projects.filter((p) => p.type !== "client");
  const featured = ownProjects.filter((p) => p.featured);
  const mainCases = (featured.length ? featured : ownProjects).slice(0, 4);
  const mainCaseIds = new Set(mainCases.map((p) => p._id));
  const moreProjects = ownProjects.filter((p) => !mainCaseIds.has(p._id));
  const clientProjects = projects.filter((p) => p.type === "client");

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

  const primaryContactEmail = settings?.socialLinks?.email || "sayedanwarulhaq@gmail.com";

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

      {/* HERO */}
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
        <div className="hero-side-label left"><i></i>NEXT.JS · NODE.JS · MONGODB<i></i></div>
        <div className="hero-side-label right"><i></i>EXAM PLATFORMS · FULL-STACK · KASHMIR<i></i></div>

        {/* Ambient glow behind portrait side */}
        <div className="absolute z-0 rounded-full right-[6%] top-[55%] -translate-y-1/2 w-[min(35vw,350px)] h-[min(35vw,350px)] bg-[radial-gradient(circle,rgba(0,212,200,0.12)_0%,transparent_70%)] hidden md:block"></div>

        <div className="relative z-[2] w-full max-w-[1240px] mx-auto px-6 pt-28 pb-8 md:pt-32">
          {/* Status badge */}
          <div className="inline-flex items-center gap-2 bg-[#00d4c8]/10 border border-[#00d4c8]/30 rounded-full px-4 py-1.5 w-fit text-[11px] text-[#00d4c8] tracking-[0.12em] uppercase font-mono">
            <span className="w-1.5 h-1.5 rounded-full bg-[#00d4c8] animate-pulse"></span> Available for work — replies within 24h
          </div>

          {/* Giant split-letter title */}
          <h1 className="hero-title mt-6" aria-label="Portfolio">PORTFOLIO</h1>

          {/* Copy + portrait */}
          <div className="hero-body">
            <div className="hero-copy">
              <p className="hero-overline" data-hero>HELLO, I&apos;M</p>
              <h2 className="hero-name" data-hero>Sayed <em>Anwar</em></h2>
              <p className="hero-role" data-hero>I build exam &amp; education platforms that hold up under real traffic.</p>
              <p className="hero-desc" data-hero>
                Full-stack developer from Srinagar, Kashmir — Next.js, Node.js, MongoDB. Shipping Exam-OS and client platforms end-to-end.
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
                  onClick={() => document.getElementById("work")?.scrollIntoView({ behavior: "smooth" })}
                  className="relative overflow-hidden px-8 py-3.5 rounded-full text-xs font-bold tracking-[0.2em] uppercase cursor-none transition-all duration-300 hover:-translate-y-1 z-[1] flex items-center gap-3"
                  style={{ background: 'linear-gradient(90deg, #00d4c8, #0084ff)', color: '#080d14', border: 'none' }}
                >
                  View Case Studies
                  <span className="w-5 h-5 rounded-full bg-[#080d14]/10 flex items-center justify-center">
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                  </span>
                </button>
                <a
                  href="/resume.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-8 py-3.5 rounded-full text-xs font-bold tracking-[0.15em] uppercase cursor-none transition-all duration-300 hover:-translate-y-1 flex items-center gap-2 bg-transparent border border-white/15 text-[#8db4d4]/60 hover:border-[#00d4c8]/40 hover:text-[#00d4c8] no-underline"
                >
                  Download Resume
                </a>
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
      </section>

      {/* MARQUEE */}
      <div className="marquee" aria-hidden="true">
        <div className="marquee-track">
          <span>Available for Freelance</span><span>Exam &amp; EdTech Platforms</span><span>React &amp; Next.js</span><span>Node.js &amp; APIs</span><span>Full-Stack Development</span><span>Built in Kashmir</span>
          <span>Available for Freelance</span><span>Exam &amp; EdTech Platforms</span><span>React &amp; Next.js</span><span>Node.js &amp; APIs</span><span>Full-Stack Development</span><span>Built in Kashmir</span>
        </div>
      </div>

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

      {/* PROOF STRIP */}
      {proofStats.length > 0 && (
        <section className="relative z-[1] py-14 px-8 border-b border-[var(--pencil)]/10" style={{ background: 'var(--paper)' }}>
          <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
            {proofStats.map((s, i) => (
              <div key={i} className="text-center reveal">
                <p className="font-[var(--serif)] tracking-[-0.03em] leading-none text-[clamp(2rem,4.5vw,3.25rem)]" style={{ color: 'var(--accent)' }}>{s.value}</p>
                <p className="text-[var(--pencil)]/60 text-[10px] mt-2.5 tracking-[0.15em] uppercase font-[var(--mono)]">{s.label}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      <div className="h-px w-full" style={{ background: "linear-gradient(90deg,transparent,rgba(0,212,200,0.3),rgba(0,212,200,0.1),transparent)" }}></div>

      {/* CASE STUDIES */}
      <section id="work" className="relative z-[1] py-28 px-8" style={{ background: 'var(--paper-tint)' }}>
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 reveal">
            <p className="flex items-center justify-center gap-2 text-[var(--accent)] text-[11px] tracking-[0.15em] uppercase mb-3 font-[var(--mono)]">
              <span className="opacity-50">{"//"}</span>Proof of Work
            </p>
            <h2 className="font-[var(--serif)] tracking-[-0.03em] leading-[1.1] mb-4" style={{ fontSize: "clamp(2rem,5vw,3.5rem)", color: "var(--ink)" }}>
              Case <span style={{ color: "var(--accent)" }}>Studies</span>
            </h2>
            <p className="text-[var(--pencil)]/60 max-w-lg mx-auto leading-relaxed text-sm">
              Real products with the problem they solved, my role, and the hard part I actually shipped.
            </p>
          </div>

          <div className="flex flex-col gap-10">
            {mainCases.length > 0 ? mainCases.map((p, i) => {
              const isExam = /exam/i.test(p.title || "");
              return (
                <Fragment key={p._id || i}>
                  <article className="reveal case-card group relative rounded-2xl border border-[var(--pencil)]/15 bg-[var(--paper)] overflow-hidden" style={{ boxShadow: '0 10px 30px rgba(0,0,0,0.4)' }}>
                    <div className="relative h-full">
                      {/* top accent sweep */}
                      <span className="pointer-events-none absolute top-0 left-0 h-[2px] w-full origin-left scale-x-0 bg-gradient-to-r from-[#00d4c8] via-[#0084ff] to-transparent transition-transform duration-700 ease-out group-hover:scale-x-100"></span>
                      {/* corner glow */}
                      <span className="pointer-events-none absolute -right-20 -top-20 h-48 w-48 rounded-full bg-[radial-gradient(circle,rgba(0,212,200,0.14),transparent_70%)] opacity-0 transition-opacity duration-500 group-hover:opacity-100"></span>

                      <div className="relative grid md:grid-cols-2 gap-8 px-7 pt-7 md:px-9 md:pt-9">
                        {/* Left: identity + structure */}
                        <div>
                          <div className="flex items-start gap-4 mb-5">
                            <span className="grid h-14 w-14 shrink-0 place-items-center rounded-xl border border-[var(--accent)]/25 bg-[var(--accent)]/10 text-2xl transition-all duration-300 group-hover:scale-105 group-hover:border-[var(--accent)]/50 group-hover:shadow-[0_0_22px_rgba(0,212,200,0.25)]">{p.icon}</span>
                            <div className="min-w-0">
                              <div className="flex gap-2 flex-wrap mb-2">
                                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[var(--accent)]/10 border border-[var(--accent)]/25 text-[10px] tracking-widest uppercase text-[var(--accent)] font-[var(--mono)]">
                                  {p.featured && <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent)] animate-pulse"></span>}
                                  {p.featured ? "Featured case study" : "Case study"}
                                </span>
                                <span className="px-2.5 py-0.5 rounded-full bg-white/[0.05] border border-white/10 text-[10px] tracking-widest uppercase text-[var(--pencil)]/70 font-[var(--mono)]">
                                  Own product
                                </span>
                              </div>
                              <h3 className="text-2xl font-[var(--serif)] text-[var(--ink)] tracking-[-0.02em] transition-colors duration-300 group-hover:text-[var(--accent)]">{p.title}</h3>
                            </div>
                            <span aria-hidden="true" className="ml-auto hidden md:block font-[var(--serif)] leading-none select-none text-[3.25rem] text-[var(--pencil)]/[0.08] transition-colors duration-500 group-hover:text-[var(--accent)]/25">{String(i + 1).padStart(2, "0")}</span>
                          </div>

                          <div className="grid sm:grid-cols-2 gap-5 mb-5">
                            <CaseField label="Problem" value={p.problem} />
                            <CaseField label="My role" value={p.role} />
                            <CaseField label="Timeline" value={p.timeline} />
                          </div>

                          {!p.problem && (
                            <ExpandableText text={p.description} limit={40} href={`/work/${p._id}`} className="text-[13px] text-[var(--pencil)]/60 leading-relaxed mb-5" />
                          )}
                        </div>

                        {/* Right: outcome + hard problem */}
                        <div className="flex flex-col gap-4">
                          {p.result && (
                            <div className="relative overflow-hidden rounded-xl border border-[#00d4c8]/25 bg-[#00d4c8]/[0.06] pl-6 pr-5 py-5 transition-colors duration-300 hover:border-[#00d4c8]/45">
                              <span className="absolute left-0 top-0 h-full w-[3px] bg-gradient-to-b from-[#00d4c8] to-[#0084ff]"></span>
                              <p className="text-[10px] tracking-[0.18em] uppercase text-[var(--accent)] font-[var(--mono)] mb-1.5">Result</p>
                              <p className="text-[15px] text-[var(--ink)] leading-relaxed font-semibold">{p.result}</p>
                            </div>
                          )}
                          {p.hardProblem && (
                            <div className="rounded-xl border border-dashed border-[#66b8ff]/30 bg-[var(--paper-tint)] p-5 transition-colors duration-300 hover:border-[#66b8ff]/55">
                              <p className="flex items-center gap-2 text-[10px] tracking-[0.18em] uppercase text-[#66b8ff] font-[var(--mono)] mb-1.5">
                                <span className="w-1.5 h-1.5 rounded-full bg-[#66b8ff]"></span>
                                Hard problem solved
                              </p>
                              <ExpandableText text={p.hardProblem} limit={40} href={`/work/${p._id}`} label="Show more" className="text-[13px] text-[var(--pencil)]/75 leading-relaxed" />
                            </div>
                          )}
                          {!p.result && !p.hardProblem && (
                            <div className="rounded-xl border border-[var(--pencil)]/15 bg-[var(--paper-tint)] p-5">
                              <p className="text-[10px] tracking-[0.18em] uppercase text-[var(--pencil)]/50 font-[var(--mono)] mb-1.5">About</p>
                              <ExpandableText text={p.description} limit={40} href={`/work/${p._id}`} className="text-[13px] text-[var(--pencil)]/75 leading-relaxed" />
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Footer: stack + CTA */}
                      <div className="relative mt-6 flex items-center justify-between gap-4 flex-wrap border-t border-[var(--pencil)]/10 px-7 py-5 md:px-9">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-[10px] tracking-[0.18em] uppercase text-[var(--pencil)]/45 font-[var(--mono)] mr-1">Stack</span>
                          {p.tags?.map((t, j) => (
                            <span key={j} className="px-2.5 py-0.5 rounded-full bg-[var(--accent)]/[0.07] border border-[var(--accent)]/20 text-[11px] text-[var(--accent)]/85 transition-colors duration-300 group-hover:border-[var(--accent)]/40">{t}</span>
                          ))}
                        </div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <Link
                            href={`/work/${p._id}`}
                            className="group/read inline-flex items-center gap-1.5 px-5 py-2.5 rounded-[4px] border border-[var(--pencil)]/25 text-[11px] font-bold tracking-widest uppercase text-[var(--pencil)]/70 hover:text-[var(--accent)] hover:border-[var(--accent)]/45 transition-all duration-300 no-underline"
                          >
                            Full case study
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="transition-transform duration-300 group-hover/read:translate-x-0.5"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
                          </Link>
                          <a
                            href={p.liveLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group/cta inline-flex items-center gap-2 px-6 py-2.5 rounded-[4px] text-[11px] font-bold tracking-widest uppercase cursor-none z-[1] hover:shadow-[0_0_18px_rgba(0,212,200,0.45)] transition-all duration-300 hover:-translate-y-0.5 no-underline"
                            style={{ background: 'linear-gradient(90deg, #00d4c8, #0084ff)', color: '#080d14', border: 'none' }}
                          >
                            View Live
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="transition-transform duration-300 group-hover/cta:translate-x-0.5 group-hover/cta:-translate-y-0.5"><path d="M7 17 17 7M8 7h9v9" /></svg>
                          </a>
                        </div>
                      </div>
                    </div>
                  </article>

                  {i === 0 && isExam && (
                    <div className="reveal">
                      <p className="text-[10px] tracking-[0.18em] uppercase text-[var(--pencil)]/50 font-[var(--mono)] mb-3 text-center">
                        Try it — click the palette, it&apos;s the real interaction model
                      </p>
                      <PaletteWidget />
                    </div>
                  )}
                </Fragment>
              );
            }) : (
              <div className="text-center text-[var(--pencil)]/40 py-12">
                No projects yet. Add projects from the admin panel.
              </div>
            )}
          </div>

          {/* More shipped work */}
          {moreProjects.length > 0 && (
            <div className="mt-14 reveal">
              <p className="text-[10px] tracking-[0.18em] uppercase text-[var(--pencil)]/50 font-[var(--mono)] mb-4">More shipped work</p>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {moreProjects.map((p, i) => (
                  <a
                    key={p._id || i}
                    href={p.liveLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center gap-3 p-4 rounded-xl border border-[var(--pencil)]/12 bg-[var(--paper)] hover:border-[var(--accent)]/40 transition-all duration-300 no-underline"
                  >
                    <span className="text-xl">{p.icon}</span>
                    <span className="flex-1 min-w-0">
                      <span className="block text-[13px] text-[var(--ink)]/90 truncate group-hover:text-[var(--accent)] transition-colors">{p.title}</span>
                      <span className="block text-[11px] text-[var(--pencil)]/45 truncate">{p.tags?.slice(0, 3).join(" · ")}</span>
                    </span>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-[var(--pencil)]/40 group-hover:text-[var(--accent)] transition-colors shrink-0"><path d="M7 17 17 7M8 7h9v9" /></svg>
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      <div className="h-px w-full" style={{ background: "linear-gradient(90deg,transparent,rgba(0,212,200,0.3),rgba(0,212,200,0.1),transparent)" }}></div>

      {/* CLIENT WORK */}
      {clientProjects.length > 0 && (
        <section id="client-work" className="relative z-[1] py-28 px-8" style={{ background: 'var(--paper)' }}>
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-14 reveal">
              <p className="flex items-center justify-center gap-2 text-[var(--accent)] text-[11px] tracking-[0.15em] uppercase mb-3 font-[var(--mono)]">
                <span className="opacity-50">{"//"}</span>For Clients
              </p>
              <h2 className="font-[var(--serif)] tracking-[-0.03em] leading-[1.1] mb-4" style={{ fontSize: "clamp(2rem,5vw,3.5rem)", color: "var(--ink)" }}>
                Client <span style={{ color: "var(--accent)" }}>Work</span>
              </h2>
              <p className="text-[var(--pencil)]/60 max-w-lg mx-auto leading-relaxed text-sm">
                Delivered for real clients — some named, some under NDA.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-7 reveal">
              {clientProjects.map((p, i) => (
                <article key={p._id || i} className="rounded-2xl border border-[var(--pencil)]/15 bg-[var(--paper-tint)] p-7 transition-all duration-300 hover:-translate-y-1 hover:border-[var(--accent)]/35" style={{ boxShadow: '0 8px 25px rgba(0,0,0,0.3)' }}>
                  <div className="flex items-center gap-3 mb-4 flex-wrap">
                    <span className="text-2xl">{p.icon}</span>
                    <span className="px-2.5 py-0.5 rounded-full bg-purple-500/10 border border-purple-400/25 text-[10px] tracking-widest uppercase text-purple-300 font-[var(--mono)]">
                      Client Project
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full bg-white/[0.05] border border-white/10 text-[10px] tracking-widest uppercase text-[var(--pencil)]/70 font-[var(--mono)]">
                      {p.clientType || "NDA — confidential"}
                    </span>
                  </div>
                  <h3 className="text-xl font-[var(--serif)] text-[var(--ink)] mb-2">{p.title}</h3>
                  <div className="grid gap-4 mb-4">
                    <CaseField label="Problem" value={p.problem} />
                    {!p.problem && <p className="text-[13px] text-[var(--pencil)]/60 leading-relaxed">{p.description}</p>}
                    <div className="grid sm:grid-cols-2 gap-4">
                      <CaseField label="My role" value={p.role} />
                      <CaseField label="Timeline" value={p.timeline} />
                    </div>
                    <CaseField label="Result" value={p.result} />
                  </div>
                  <div className="flex gap-2 flex-wrap mb-5">
                    {p.tags?.map((t, j) => (
                      <span key={j} className="px-2.5 py-0.5 rounded-full bg-[var(--accent)]/10 border border-[var(--accent)]/20 text-[11px] text-[var(--accent)]">{t}</span>
                    ))}
                  </div>
                  <a
                    href={p.liveLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block px-6 py-2.5 rounded-[4px] text-[11px] font-bold tracking-widest uppercase cursor-none hover:shadow-[0_0_15px_rgba(0,212,200,0.4)] no-underline"
                    style={{ background: 'linear-gradient(90deg, #00d4c8, #0084ff)', color: '#080d14', border: 'none' }}
                  >
                    View Live
                  </a>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}

      {clientProjects.length > 0 && (
        <div className="h-px w-full" style={{ background: "linear-gradient(90deg,transparent,rgba(0,212,200,0.3),rgba(0,212,200,0.1),transparent)" }}></div>
      )}

      {/* WHAT I DO */}
      <section id="services" className="relative z-[1] py-28 px-8" style={{ background: clientProjects.length > 0 ? 'var(--paper-tint)' : 'var(--paper)' }}>
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14 reveal">
            <p className="flex items-center justify-center gap-2 text-[var(--accent)] text-[11px] tracking-[0.15em] uppercase mb-3 font-[var(--mono)]">
              <span className="opacity-50">{"//"}</span>Services
            </p>
            <h2 className="font-[var(--serif)] tracking-[-0.03em] leading-[1.1] mb-4" style={{ fontSize: "clamp(2rem,5vw,3.5rem)", color: "var(--ink)" }}>
              What I <span style={{ color: "var(--accent)" }}>Do</span>
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 reveal">
            {services.map((s, i) => (
              <div key={i} className="rounded-2xl border border-[var(--pencil)]/15 bg-[var(--paper-tint)] p-6 transition-all duration-300 hover:-translate-y-1 hover:border-[var(--accent)]/35" style={{ boxShadow: '0 6px 20px rgba(0,0,0,0.25)' }}>
                <div className="text-3xl mb-4">{s.icon}</div>
                <h3 className="text-[15px] font-semibold text-[var(--ink)] mb-2">{s.title}</h3>
                <p className="text-[13px] text-[var(--pencil)]/60 leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      {testimonials.length > 0 && (
        <>
          <div className="h-px w-full" style={{ background: "linear-gradient(90deg,transparent,rgba(0,212,200,0.3),rgba(0,212,200,0.1),transparent)" }}></div>
          <section className="relative z-[1] py-28 px-8" style={{ background: 'var(--paper-tint)' }}>
            <div className="max-w-7xl mx-auto">
              <div className="text-center mb-14 reveal">
                <p className="flex items-center justify-center gap-2 text-[var(--accent)] text-[11px] tracking-[0.15em] uppercase mb-3 font-[var(--mono)]">
                  <span className="opacity-50">{"//"}</span>Testimonials
                </p>
                <h2 className="font-[var(--serif)] tracking-[-0.03em] leading-[1.1]" style={{ fontSize: "clamp(2rem,5vw,3.5rem)", color: "var(--ink)" }}>
                  What Clients <span style={{ color: "var(--accent)" }}>Say</span>
                </h2>
              </div>
              <div className="grid md:grid-cols-3 gap-6 reveal">
                {testimonials.map((t, i) => (
                  <figure key={t._id || i} className="rounded-2xl border border-[var(--pencil)]/15 bg-[var(--paper)] p-6 flex flex-col" style={{ boxShadow: '0 6px 20px rgba(0,0,0,0.25)' }}>
                    <span className="text-4xl leading-none font-[var(--serif)] text-[var(--accent)]/50 mb-3">&ldquo;</span>
                    <blockquote className="text-[13px] text-[var(--pencil)]/75 leading-relaxed flex-1">{t.quote}</blockquote>
                    <figcaption className="mt-5 pt-4 border-t border-[var(--pencil)]/10">
                      <p className="text-[13px] font-semibold text-[var(--ink)]">{t.name}</p>
                      {t.role && <p className="text-[11px] text-[var(--pencil)]/50 tracking-wide">{t.role}</p>}
                    </figcaption>
                  </figure>
                ))}
              </div>
            </div>
          </section>
        </>
      )}

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
              I&apos;m <strong style={{ color: "var(--ink)" }}>Sayed Anwar</strong> — a full-stack developer from Srinagar, Kashmir, focused on exam and education platforms that work for real users at real scale.
            </p>
            <p className="text-[var(--pencil)]/60 leading-relaxed mb-8 text-sm">
              Outside of client and product work, I prepare for the UPSC civil-services exam — it keeps me disciplined. When I get free hours, I experiment with motion and 3D on the web.
            </p>
            <a
              href="/resume.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block relative overflow-hidden px-6 py-3 rounded-[4px] text-xs font-bold tracking-widest uppercase cursor-none hover:-translate-y-0.5 transition-transform duration-200 z-[1] hover:shadow-[0_0_20px_rgba(0,212,200,0.4)] no-underline"
              style={{ background: 'linear-gradient(90deg, #00d4c8, #0084ff)', color: '#080d14', border: 'none' }}
            >
              Download Resume
            </a>
          </div>

          <div className="reveal bg-[var(--paper-tint)] border border-[var(--pencil)]/12 rounded-2xl p-7" style={{ boxShadow: '0 6px 25px rgba(0,0,0,0.3)' }}>
            <p className="text-[10px] tracking-[0.2em] uppercase text-[var(--accent)] font-[var(--mono)] mb-5">Quick facts</p>
            <ul className="space-y-4 m-0 p-0 list-none">
              {[
                ["Based in", "Srinagar, J&K, India · UTC+5:30"],
                ["Open to", "Freelance projects & full-time roles"],
                ["Availability", "Typically replies within 24 hours"],
                ["Focus", "Exam / EdTech platforms & full-stack web"],
              ].map(([k, v]) => (
                <li key={k} className="flex items-baseline gap-4 pb-4 border-b border-[var(--pencil)]/10 last:border-0 last:pb-0">
                  <span className="w-28 shrink-0 text-[10px] tracking-[0.15em] uppercase text-[var(--pencil)]/45 font-[var(--mono)]">{k}</span>
                  <span className="text-[13px] text-[var(--ink)]/85">{v}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <div className="h-px w-full" style={{ background: "linear-gradient(90deg,transparent,rgba(0,212,200,0.3),rgba(0,212,200,0.1),transparent)" }}></div>

      {/* CONTACT */}
      <section id="contact" className="relative z-[1] py-28 px-8" style={{ background: 'var(--paper-tint)' }}>
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-16 items-start">
          {/* Left info */}
          <div className="reveal">
            <p className="flex items-center gap-2 text-[var(--accent)] text-[11px] tracking-[0.15em] uppercase mb-3 font-[var(--mono)]">
              <span className="opacity-50">{"//"}</span>Get in Touch
            </p>
            <h2 className="font-[var(--serif)] tracking-[-0.03em] leading-[1.1] mb-6" style={{ fontSize: "clamp(2rem,5vw,3.5rem)", color: "var(--ink)" }}>
              Let&apos;s <span style={{ color: "var(--accent)" }}>Build</span>
              <br />
              Something Solid
            </h2>
            <p className="text-[var(--pencil)]/60 leading-relaxed mb-6 text-sm">
              Have an exam platform to ship or a full-stack build in mind? Email me directly — I typically reply within 24 hours.
            </p>

            <a
              href={`mailto:${primaryContactEmail}`}
              className="inline-flex items-center gap-3 mb-6 text-[var(--ink)] hover:text-[var(--accent)] transition-colors no-underline group"
            >
              <span className="w-10 h-10 rounded-xl bg-[var(--paper)] border border-[var(--pencil)]/15 flex items-center justify-center text-[var(--accent)]">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </span>
              <span className="text-sm font-semibold group-hover:underline">{primaryContactEmail}</span>
            </a>

            {/* Social icons */}
            <div className="flex gap-3 flex-wrap mb-8">
              {settings?.socialLinks && Object.entries(settings.socialLinks).map(([platform, link]) => {
                if (!link || !SOCIAL_ICONS[platform]) return null;
                return (
                  <a
                    key={platform}
                    href={socialHref(platform, link)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-11 h-11 rounded-xl bg-[var(--paper)] border border-[var(--pencil)]/15 flex items-center justify-center text-[var(--pencil)]/55 transition-all duration-300 hover:text-[var(--accent)] hover:border-[var(--accent)]/40 hover:shadow-[0_0_15px_rgba(0,212,200,0.2)] cursor-none"
                    title={SOCIAL_LABELS[platform] || platform}
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                      <path d={SOCIAL_ICONS[platform]} />
                    </svg>
                  </a>
                );
              })}
            </div>

            <div className="bg-[var(--paper)] border border-[var(--pencil)]/15 rounded-2xl p-6">
              <p className="text-[var(--accent)] text-[11px] tracking-widest uppercase mb-1">Based in</p>
              <p className="font-semibold text-[var(--ink)]/80">Srinagar, Jammu &amp; Kashmir</p>
              <p className="text-[11px] text-[var(--pencil)]/30 mt-0.5">India · UTC+5:30</p>
            </div>
          </div>

          {/* Form */}
          <div className="reveal">
            <form
              id="contact-form"
              className="bg-[var(--paper)] border border-[var(--pencil)]/15 rounded-2xl p-8 flex flex-col gap-6"
              onSubmit={handleSubmit}
            >
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] text-[var(--pencil)]/40 tracking-widest uppercase mb-2" htmlFor="cf-name">Name</label>
                  <input
                    id="cf-name"
                    type="text"
                    placeholder="Your name"
                    className="w-full px-4 py-3.5 bg-[#0d1520] border border-[var(--pencil)]/15 rounded-lg text-[var(--ink)] text-sm placeholder-[var(--pencil)]/30 focus:border-[#00d4c8]/50 focus:shadow-[0_0_15px_rgba(0,212,200,0.15)] transition-all duration-300 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-[var(--pencil)]/40 tracking-widest uppercase mb-2" htmlFor="cf-email">Email</label>
                  <input
                    id="cf-email"
                    type="email"
                    placeholder="your@email.com"
                    className="w-full px-4 py-3.5 bg-[#0d1520] border border-[var(--pencil)]/15 rounded-lg text-[var(--ink)] text-sm placeholder-[var(--pencil)]/30 focus:border-[#00d4c8]/50 focus:shadow-[0_0_15px_rgba(0,212,200,0.15)] transition-all duration-300 outline-none"
                  />
                </div>
              </div>
              <div>
                <label className="block text-[11px] text-[var(--pencil)]/40 tracking-widest uppercase mb-2" htmlFor="cf-subject">Subject</label>
                <input
                  id="cf-subject"
                  type="text"
                  placeholder="What's this about?"
                  className="w-full px-4 py-3.5 bg-[#0d1520] border border-[var(--pencil)]/15 rounded-lg text-[var(--ink)] text-sm placeholder-[var(--pencil)]/30 focus:border-[#00d4c8]/50 focus:shadow-[0_0_15px_rgba(0,212,200,0.15)] transition-all duration-300 outline-none"
                />
              </div>
              <div>
                <label className="block text-[11px] text-[var(--pencil)]/40 tracking-widest uppercase mb-2" htmlFor="cf-message">Message</label>
                <textarea
                  id="cf-message"
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
                Full-stack developer building exam &amp; education platforms from Srinagar, Kashmir.
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

            {/* Navigation */}
            <div>
              <h3 className="text-sm font-semibold text-[var(--ink)] mb-4 tracking-widest uppercase">Navigation</h3>
              <ul className="space-y-2 text-xs list-none m-0 p-0">
                <li><a href="#work" className="text-[var(--pencil)]/60 hover:text-[var(--accent)] transition-colors no-underline">Case Studies</a></li>
                <li><a href="#services" className="text-[var(--pencil)]/60 hover:text-[var(--accent)] transition-colors no-underline">Services</a></li>
                <li><a href="#skills" className="text-[var(--pencil)]/60 hover:text-[var(--accent)] transition-colors no-underline">Tech Stack</a></li>
                <li><a href="#about" className="text-[var(--pencil)]/60 hover:text-[var(--accent)] transition-colors no-underline">About</a></li>
                <li><a href="#contact" className="text-[var(--pencil)]/60 hover:text-[var(--accent)] transition-colors no-underline">Contact</a></li>
              </ul>
            </div>

            {/* Resources */}
            <div>
              <h3 className="text-sm font-semibold text-[var(--ink)] mb-4 tracking-widest uppercase">Resources</h3>
              <ul className="space-y-2 text-xs list-none m-0 p-0">
                <li><Link href="/blog" className="text-[var(--pencil)]/60 hover:text-[var(--accent)] transition-colors no-underline">Blog</Link></li>
                <li>
                  <a
                    href="/resume.pdf"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[var(--pencil)]/60 hover:text-[var(--accent)] transition-colors no-underline"
                  >
                    Resume (PDF)
                  </a>
                </li>
                {settings?.socialLinks?.github && (
                  <li>
                    <a href={settings.socialLinks.github} target="_blank" rel="noopener noreferrer" className="text-[var(--pencil)]/60 hover:text-[var(--accent)] transition-colors no-underline">
                      GitHub
                    </a>
                  </li>
                )}
                {settings?.socialLinks?.linkedin && (
                  <li>
                    <a href={settings.socialLinks.linkedin} target="_blank" rel="noopener noreferrer" className="text-[var(--pencil)]/60 hover:text-[var(--accent)] transition-colors no-underline">
                      LinkedIn
                    </a>
                  </li>
                )}
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h3 className="text-sm font-semibold text-[var(--ink)] mb-4 tracking-widest uppercase">Contact</h3>
              <ul className="space-y-2 text-xs list-none m-0 p-0">
                <li>
                  <a href={`mailto:${primaryContactEmail}`} className="text-[var(--pencil)]/60 hover:text-[var(--accent)] transition-colors no-underline">
                    {primaryContactEmail}
                  </a>
                </li>
                <li className="text-[var(--pencil)]/60">Srinagar, India</li>
                <li className="text-[var(--pencil)]/60">Replies within 24 hours</li>
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
