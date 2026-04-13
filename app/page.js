"use client";

import { useEffect, useState } from "react";
import useScrollReveal from "./hooks/useScrollReveal";
import { BackToTop } from "./components/BackToTop";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const timeline = [
  { year: "2021", title: "The Spark", desc: "Wrote my first Hello World and got completely hooked. Stayed up 48 hours learning HTML & CSS." },
  { year: "2022", title: "Going Deeper", desc: "Dived into JavaScript, built my first dynamic web app. Discovered React and fell in love with components." },
  { year: "2023", title: "Full Stack Mode", desc: "Mastered Node.js, databases, and REST APIs. Deployed 10+ projects. Started exploring Three.js." },
  { year: "2024", title: "Shipping Products", desc: "Shipped real-world products, collaborated globally, contributed to open source, leveled up design." },
  { year: "2025", title: "Now & Beyond", desc: "Building at the intersection of web, 3D, and AI. Creating immersive experiences from Kashmir." },
];

function handleSubmit(e) {
  e.preventDefault();
  const btn = e.target.querySelector("button[type=submit]");
  btn.textContent = "Message Sent! ✓";
  btn.style.background = "linear-gradient(90deg,#00c896,#00f5ff)";
  setTimeout(() => {
    btn.textContent = "Send Message to the Coder ✦";
    btn.style.background = "";
  }, 3000);
}

export default function HomePage() {
  useScrollReveal();
  const [projects, setProjects] = useState([]);
  const [skills, setSkills] = useState([]);
  const [settings, setSettings] = useState({});
  const [typewriterText, setTypewriterText] = useState("");
  const [typewriterIndex, setTypewriterIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const words = ["Developer", "UPSC Aspirant", "Full-Stack Maker", "Problem Solver"];
    const current = words[typewriterIndex % words.length];
    const timeout = setTimeout(() => {
      const nextValue = isDeleting
        ? current.slice(0, typewriterText.length - 1)
        : current.slice(0, typewriterText.length + 1);

      setTypewriterText(nextValue);

      if (!isDeleting && nextValue === current) {
        setTimeout(() => setIsDeleting(true), 1200);
      } else if (isDeleting && nextValue === "") {
        setIsDeleting(false);
        setTypewriterIndex((index) => index + 1);
      }
    }, isDeleting ? 80 : 120);

    return () => clearTimeout(timeout);
  }, [typewriterText, isDeleting, typewriterIndex]);

  useEffect(() => {
    async function fetchProjects() {
      try {
        console.log("Fetching projects from:", `${API_URL}/api/projects`);
        const res = await fetch(`${API_URL}/api/projects`);
        console.log("Projects response:", res.status);
        const json = await res.json();
        console.log("Projects data:", json);
        const projectData = Array.isArray(json) ? json : Array.isArray(json?.data) ? json.data : [];
        setProjects(projectData);
      } catch (e) {
        console.error("Failed to fetch projects:", e);
      }
    }

    async function fetchSkills() {
      try {
        console.log("Fetching skills from:", `${API_URL}/api/skills`);
        const res = await fetch(`${API_URL}/api/skills`);
        console.log("Skills response:", res.status);
        const json = await res.json();
        console.log("Skills data:", json);
        const skillData = Array.isArray(json) ? json : Array.isArray(json?.data) ? json.data : [];
        setSkills(skillData);
      } catch (e) {
        console.error("Failed to fetch skills:", e);
      }
    }

    async function fetchSettings() {
      try {
        console.log("Fetching settings from:", `${API_URL}/api/settings`);
        const res = await fetch(`${API_URL}/api/settings`);
        console.log("Settings response:", res.status);
        const json = await res.json();
        console.log("Settings data:", json);
        setSettings(json?.data || json || {});
      } catch (e) {
        console.error("Failed to fetch settings:", e);
      }
    }

    fetchProjects();
    fetchSkills();
    fetchSettings();
  }, []);

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
    const canvas = document.getElementById("ptc");
    if (!canvas) return;
    
    const ctx = canvas.getContext("2d");
    let W, H, pts = [];
    
    function rz() {
      W = canvas.width = window.innerWidth;
      H = canvas.height = window.innerHeight;
    }
    rz();
    window.addEventListener("resize", rz);
    
    for (let i = 0; i < 80; i++) {
      pts.push({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        r: Math.random() * 1.5 + 0.4,
        cy: Math.random() < 0.5,
        a: Math.random() * 0.5 + 0.1,
      });
    }
    
    function draw() {
      ctx.clearRect(0, 0, W, H);
      pts.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0) p.x = W;
        if (p.x > W) p.x = 0;
        if (p.y < 0) p.y = H;
        if (p.y > H) p.y = 0;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = p.cy ? `rgba(0,245,255,${p.a})` : `rgba(123,47,255,${p.a})`;
        ctx.fill();
      });
      for (let i = 0; i < pts.length; i++) {
        for (let j = i + 1; j < pts.length; j++) {
          const dx = pts[i].x - pts[j].x;
          const dy = pts[i].y - pts[j].y;
          const d = Math.sqrt(dx * dx + dy * dy);
          if (d < 120) {
            ctx.beginPath();
            ctx.moveTo(pts[i].x, pts[i].y);
            ctx.lineTo(pts[j].x, pts[j].y);
            ctx.strokeStyle = `rgba(0,245,255,${0.05 * (1 - d / 120)})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }
      requestAnimationFrame(draw);
    }
    draw();

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

        let c = 0;
        const animate = () => {
          c = Math.min(c + pct / 60, pct);
          pctEl.textContent = Math.round(c) + "%";
          if (c < pct) requestAnimationFrame(animate);
        };
        
        setTimeout(() => {
          progress.style.strokeDashoffset = offset;
          animate();
        }, 300);
      });
    };

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
            if (e.target.classList.contains("skills-grid")) initSkills();
            if (e.target.classList.contains("stat-grid")) initStats();
          }
        });
      },
      { threshold: 0.3 }
    );

    document.querySelectorAll(".skills-grid, .stat-grid").forEach((el) => observer.observe(el));
  }, []);

  return (
    <div className="bg-[#0a0a0a] text-gray-200 font-sans overflow-x-hidden">
      
      {/* Particle BG */}
      <canvas id="ptc" className="fixed inset-0 z-0 pointer-events-none opacity-40" />
      
      {/* Particle BG */}
      <canvas id="ptc" className="fixed inset-0 z-0 pointer-events-none opacity-60" />

      {/* HERO */}
      <section id="hero" className="relative min-h-screen md:h-screen flex flex-col md:flex-row items-center md:items-center overflow-hidden">
        
        {/* Background grid pattern */}
        <div className="absolute inset-0 opacity-[0.03] z-0" style={{ backgroundImage: 'linear-gradient(rgba(0,245,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(0,245,255,0.5) 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
        
        {/* Holo labels */}
        <span className="absolute top-[15%] right-[5%] z-[1] text-[10px] tracking-[0.15em] uppercase text-cyan/15 animate-float pointer-events-none select-none font-mono">
          v2.4.1 // deployed
        </span>
        <span className="absolute bottom-[32%] right-[4%] z-[1] text-[10px] tracking-[0.15em] uppercase text-cyan/15 animate-float-d pointer-events-none select-none font-mono">
          Kashmir.dev // online
        </span>

        {/* Floating code badges - left side */}
        <div className="absolute left-[3%] top-[38%] z-[1] hidden lg:flex flex-col gap-2 opacity-50">
          <div className="flex items-center gap-2 px-3 py-1 bg-white/[0.02] border border-white/[0.06] rounded text-[10px] font-mono text-white/35" style={{ clipPath: 'polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% 100%, 6px 100%, 0 calc(100% - 6px))' }}>
            <span className="w-1.5 h-1.5 rounded-full bg-green-400"></span> Systems operational
          </div>
          <div className="flex items-center gap-2 px-3 py-1 bg-white/[0.02] border border-white/[0.06] rounded text-[10px] font-mono text-white/35" style={{ clipPath: 'polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% 100%, 6px 100%, 0 calc(100% - 6px))' }}>
            <span className="w-1.5 h-1.5 rounded-full bg-orange-400"></span> 12 commits today
          </div>
        </div>

        {/* Floating code snippets - right side */}
        <div className="absolute right-[2%] top-[30%] z-[1] hidden lg:flex flex-col gap-2 opacity-40">
          <div className="px-3 py-2 bg-[#0a0a0a]/80 border border-white/[0.08] rounded text-[9px] font-mono" style={{ clipPath: 'polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% 100%, 6px 100%, 0 calc(100% - 6px))' }}>
            <span className="text-purple">const</span> <span className="text-cyan">developer</span> <span className="text-white/50">=</span> <span className="text-orange">"passionate"</span>
          </div>
          <div className="px-3 py-2 bg-[#0a0a0a]/80 border border-white/[0.08] rounded text-[9px] font-mono" style={{ clipPath: 'polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% 100%, 6px 100%, 0 calc(100% - 6px))' }}>
            <span className="text-purple">while</span><span className="text-white/50">(</span><span className="text-cyan">alive</span><span className="text-white/50">) {'{ code(); }'}</span>
          </div>
        </div>

        {/* Keyboard shortcut hints - bottom left */}
        <div className="absolute left-[3%] bottom-[15%] z-[1] hidden lg:flex items-center gap-3 opacity-35">
          <div className="flex items-center gap-1.5 text-[9px] font-mono text-white/40">
            <kbd className="px-1.5 py-0.5 bg-white/[0.06] border border-white/[0.1] rounded text-[8px]">↑</kbd>
            <kbd className="px-1.5 py-0.5 bg-white/[0.06] border border-white/[0.1] rounded text-[8px]">↓</kbd>
            <span className="ml-1">Navigate</span>
          </div>
          <div className="flex items-center gap-1.5 text-[9px] font-mono text-white/40">
            <kbd className="px-1.5 py-0.5 bg-white/[0.06] border border-white/[0.1] rounded text-[8px]">ESC</kbd>
            <span className="ml-1">Menu</span>
          </div>
        </div>

        {/* Hero content — left half on desktop (50%) */}
        <div className="reveal relative z-[2] w-full px-6 pt-20 flex flex-col gap-4 md:w-1/2 md:max-w-none md:mx-0 md:ml-12 md:pt-0">

          {/* Status badge with better styling */}
          <div className="inline-flex items-center gap-2 bg-cyan/[0.05] border border-cyan/[0.12] rounded-full px-4 py-1.5 w-fit text-[11px] text-cyan tracking-[0.12em] uppercase font-mono" style={{ clipPath: 'polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))' }}>
            <span className="w-1.5 h-1.5 rounded-full bg-cyan animate-pulse shadow-[0_0_8px_rgba(0,245,255,0.6)]"></span> Available for work
          </div>

          {/* Name - improved typography with glitch effect */}
          <div className="flex flex-col gap-0">
            <span className="text-grad-c text-xs font-mono tracking-[0.28em] uppercase mb-2">The</span>
            <h1 className="text-white font-bold leading-[0.88] tracking-[-0.03em] glitch-text" style={{ fontSize: "clamp(3.5rem,10vw,9rem)" }} data-text="Technocrat">
              <span className="text-grad-c">Technocrat</span>
            </h1>
          </div>

          {/* Subtitle with improved typewriter */}
          <div className="font-mono text-white/55 tracking-wide flex items-center gap-2" style={{ fontSize: "clamp(0.9rem,1.6vw,1.2rem)" }}>
            <span className="text-cyan">~/portfolio</span>
            <span className="text-white/25">$</span>
            <span>{typewriterText}</span>
            <span className="typewriter-cursor text-cyan animate-pulse">|</span>
          </div>

          {/* Tagline */}
          <p className="flex items-center gap-2 text-xs text-white/30 font-mono">
            <span className="text-purple text-[8px]">◆</span>
            Code &nbsp;·&nbsp; Constitution &nbsp;·&nbsp; Culture &nbsp;·&nbsp; Srinagar, Kashmir
          </p>

          {/* Description */}
          <p className="text-white/35 leading-relaxed text-sm max-w-md font-light" style={{ fontSize: "clamp(0.8rem,1.1vw,0.92rem)" }}>
            Full-stack developer crafting digital experiences with clean code & bold ideas. Building at the intersection of web, 3D & UPSC.
          </p>

          {/* CTA buttons with angled edges */}
          <div className="flex gap-3 flex-wrap mt-0">
            <button
              onClick={() => document.getElementById("projects").scrollIntoView({ behavior: "smooth" })}
              className="mag btn-main relative overflow-hidden px-8 py-3.5 text-xs font-bold tracking-widest uppercase cursor-none transition-all duration-200 hover:-translate-y-1 z-[1] flex items-center gap-2"
              style={{ clipPath: 'polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 12px 100%, 0 calc(100% - 12px))' }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
              View Work
            </button>
            <button
              onClick={() => document.getElementById("contact").scrollIntoView({ behavior: "smooth" })}
              className="mag px-8 py-3.5 text-xs font-bold tracking-widest uppercase cursor-none transition-all duration-200 hover:-translate-y-1 flex items-center gap-2 bg-white/[0.02] border border-white/[0.1] text-white/60 hover:border-cyan/40 hover:text-cyan"
              style={{ clipPath: 'polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 12px 100%, 0 calc(100% - 12px))' }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3"/></svg>
              Contact Us
            </button>
          </div>
        </div>

        {/* Character image on right half / bottom on mobile with enhanced frame */}
        <div className="relative md:absolute w-full md:w-[45%] md:h-[80%] flex items-center justify-center md:right-[5%] md:top-1/2 md:-translate-y-1/2 z-[0] md:z-[1] py-8 md:py-0">
          {/* Outer glow ring */}
          <div className="absolute inset-0 rounded-full animate-pulse" style={{ background: 'radial-gradient(circle, rgba(0,245,255,0.08) 0%, transparent 70%)' }}></div>
          
          {/* Glow background */}
          <div className="absolute inset-0 blur-[100px] opacity-35" style={{ background: 'radial-gradient(circle, rgba(0,245,255,0.3) 0%, rgba(123,47,255,0.15) 50%, transparent 70%)' }}></div>
          
          {/* Hexagonal spinning frame - outer */}
          <div className="absolute inset-0 flex items-center justify-center">
            <svg viewBox="0 0 400 400" className="w-[360px] h-[360px] animate-spin-slow opacity-40" style={{ animationDuration: '25s' }}>
              <polygon points="200,5 380,100 380,300 200,395 20,300 20,100" fill="none" stroke="rgba(0,245,255,0.15)" strokeWidth="1" strokeDasharray="6 8"/>
            </svg>
          </div>
          
          {/* Hexagonal spinning frame - inner (reverse) */}
          <div className="absolute inset-0 flex items-center justify-center">
            <svg viewBox="0 0 400 400" className="w-[300px] h-[300px] animate-spin-slow opacity-30" style={{ animationDuration: '18s', animationDirection: 'reverse' }}>
              <polygon points="200,15 370,110 370,290 200,385 30,290 30,110" fill="none" stroke="rgba(123,47,255,0.2)" strokeWidth="0.5" strokeDasharray="4 6"/>
            </svg>
          </div>
          
          {/* Image container with scan effect */}
          <div className="relative">
            {/* Scan line */}
            <div className="absolute inset-0 overflow-hidden rounded-full z-10 pointer-events-none">
              <div className="absolute w-full h-[2px] bg-gradient-to-r from-transparent via-cyan to-transparent opacity-60 animate-scan"></div>
            </div>
            
            <img 
              src="/main_character.png" 
              alt="Sayed" 
              className="max-w-[200px] md:max-w-full max-h-[280px] md:max-h-full object-contain animate-float relative z-[1] drop-shadow-[0_0_50px_rgba(0,245,255,0.2)]"
            />
          </div>

          {/* Corner decorations - larger */}
          <div className="absolute top-2 left-2 w-8 h-8 border-t-2 border-l-2 border-cyan/50"></div>
          <div className="absolute top-2 right-2 w-8 h-8 border-t-2 border-r-2 border-cyan/50"></div>
          <div className="absolute bottom-2 left-2 w-8 h-8 border-b-2 border-l-2 border-cyan/50"></div>
          <div className="absolute bottom-2 right-2 w-8 h-8 border-b-2 border-r-2 border-cyan/50"></div>
          
          {/* Floating badge on image */}
          <div className="absolute -right-4 top-1/4 z-20 hidden md:block">
            <div className="px-3 py-1.5 bg-[#0a0a0a]/90 border border-cyan/30 rounded text-[9px] font-mono text-cyan flex items-center gap-1.5" style={{ clipPath: 'polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% 100%, 6px 100%, 0 calc(100% - 6px))' }}>
              <span className="w-1 h-1 rounded-full bg-cyan animate-pulse"></span> Open to work
            </div>
          </div>
        </div>

        {/* Bounce chevron with enhanced styling */}
        <div className="absolute bottom-8 left-1/2 z-[2] flex flex-col items-center gap-2 -translate-x-1/2">
          <span className="text-[9px] text-white/20 font-mono tracking-[0.2em] uppercase">Scroll</span>
          <div className="w-px h-10 bg-gradient-to-b from-cyan to-transparent opacity-30 animate-scroll-line"></div>
        </div>
      </section>

      {/* Divider */}
      <div className="h-px w-full" style={{ background: "linear-gradient(90deg,transparent,rgba(0,245,255,0.3),rgba(123,47,255,0.3),transparent)" }}></div>

      {/* ABOUT */}
      <section id="about" className="relative z-[1] py-28 px-8">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <div className="reveal">
            <p className="flex items-center gap-2 text-cyan text-[11px] tracking-[0.15em] uppercase mb-3">
              <span className="opacity-50">//</span>About Me
            </p>
            <h2 className="font-playfair tracking-[-0.03em] leading-[1.1] mb-6" style={{ fontSize: "clamp(2rem,5vw,3.5rem)" }}>
              The <span className="text-grad-c">Human</span> Behind the Code
            </h2>
            <p className="text-white/50 leading-relaxed mb-4 text-sm">
              Hey! I'm <strong>The Technocrat</strong>, a passionate full-stack developer &amp; UPSC aspirant from the breathtaking valley of Srinagar, Kashmir. I breathe life into digital experiences—from elegant UIs to powerful backend systems.
            </p>
            <p className="text-white/35 leading-relaxed mb-8 text-sm">
              When I'm not coding or preparing for UPSC, you'll find me experimenting with 3D visuals, chasing mountain sunsets, or sipping kahwa while architecting the next big idea.
            </p>
            <button 
              className="mag btn-main relative overflow-hidden px-6 py-3 rounded-[4px] text-xs font-inter font-bold tracking-widest uppercase cursor-none hover:-translate-y-0.5 transition-transform duration-200 z-[1]"
              onClick={() => settings?.resumeUrl ? window.open(`${API_URL}/api/settings/resume`, '_blank') : window.open('/admin/settings', '_blank')}
            >
              Download Resume
            </button>
          </div>

          <div className="reveal stat-grid grid grid-cols-2 gap-4">
            <div className="bg-white/5 border border-white/10 rounded-xl p-6 text-center backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-cyan-500/40 hover:shadow-[0_0_30px_rgba(0,245,255,0.15)]">
              <div className="stat-num text-4xl font-bold text-white tracking-[-0.02em]" data-target="3">
                0
              </div>
              <p className="text-white/70 text-[10px] mt-2 tracking-[0.15em] uppercase font-mono">Years Coding</p>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-xl p-6 text-center backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-cyan-500/40 hover:shadow-[0_0_30px_rgba(0,245,255,0.15)]">
              <div className="stat-num text-4xl font-bold text-white tracking-[-0.02em]" data-target="24">
                0
              </div>
              <p className="text-white/70 text-[10px] mt-2 tracking-[0.15em] uppercase font-mono">Projects Done</p>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-xl p-6 text-center backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-cyan-500/40 hover:shadow-[0_0_30px_rgba(0,245,255,0.15)]">
              <div className="stat-num text-4xl font-bold text-white tracking-[-0.02em]" data-target="1200">
                0
              </div>
              <p className="text-white/70 text-[10px] mt-2 tracking-[0.15em] uppercase font-mono">Coffee Cups</p>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-xl p-6 text-center backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-cyan-500/40 hover:shadow-[0_0_30px_rgba(0,245,255,0.15)]">
              <div className="stat-num text-5xl font-playfair tracking-[-0.04em] text-grad-c" data-target="8">
                0
              </div>
              <p className="text-white/70 text-[11px] mt-2 tracking-widest uppercase">Open Source</p>
            </div>
          </div>
        </div>
      </section>

      <div className="h-px w-full" style={{ background: "linear-gradient(90deg,transparent,rgba(0,245,255,0.3),rgba(123,47,255,0.3),transparent)" }}></div>

      {/* SKILLS */}
      <section id="skills" className="relative z-[1] py-28 px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 reveal">
            <p className="flex items-center justify-center gap-2 text-cyan text-[11px] tracking-[0.15em] uppercase mb-3">
              <span className="opacity-50">//</span>Tech Arsenal
            </p>
            <h2 className="font-playfair tracking-[-0.03em] leading-[1.1] mb-4" style={{ fontSize: "clamp(2rem,5vw,3.5rem)" }}>
              Skills &amp; <span className="text-grad-c">Technologies</span>
            </h2>
            <p className="text-white/40 max-w-md mx-auto leading-relaxed text-sm">
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
                <div key={s._id || i} className="skill-orb bg-white/[0.04] border border-white/[0.08] rounded-2xl p-5 flex flex-col items-center gap-3 backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:border-cyan/20 hover:shadow-glass">
                  <div className="relative w-[100px] h-[100px]">
                    <svg viewBox="0 0 100 100" width="100" height="100" style={{ transform: "rotate(-90deg)" }}>
                      <circle cx="50" cy="50" r={r} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="3" />
                      <circle
                        className="progress ring-prog"
                        cx="50"
                        cy="50"
                        r={r}
                        fill="none"
                        stroke={s.color || "#00f5ff"}
                        strokeWidth="3"
                        data-offset={offset}
                        data-circ={circ}
                        style={{ strokeDasharray: circ }}
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="orb-p text-lg font-playfair text-white">0%</span>
                    </div>
                  </div>
                  <p className="text-[13px] font-semibold text-white/80 tracking-wide">{s.name}</p>
                </div>
              );
            }) : (
              <div className="col-span-full text-center text-white/40 py-12">
                No skills yet. Add skills from the admin panel.
              </div>
            )}
          </div>
        </div>
      </section>

      <div className="h-px w-full" style={{ background: "linear-gradient(90deg,transparent,rgba(0,245,255,0.3),rgba(123,47,255,0.3),transparent)" }}></div>

      {/* PROJECTS */}
      <section id="projects" className="relative z-[1] py-28 px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 reveal">
            <p className="flex items-center justify-center gap-2 text-cyan text-[11px] tracking-[0.15em] uppercase mb-3">
              <span className="opacity-50">//</span>Featured Work
            </p>
            <h2 className="font-playfair tracking-[-0.03em] leading-[1.1] mb-4" style={{ fontSize: "clamp(2rem,5vw,3.5rem)" }}>
              Selected <span className="text-grad-c">Projects</span>
            </h2>
            <p className="text-white/40 max-w-md mx-auto leading-relaxed text-sm">
              A curated showcase of digital products I&apos;ve designed, built, and shipped.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-7 reveal">
            {projects.length > 0 ? projects.map((p, i) => (
              <div
                key={p._id || i}
                className="tilt-card relative overflow-hidden bg-white/[0.04] border border-white/[0.08] rounded-2xl"
              >
                <div className="proj-glow"></div>
                <div
                  className="w-full h-48 flex items-center justify-center text-6xl border-b border-white/[0.08]"
                  style={{ background: "linear-gradient(135deg,rgba(0,245,255,0.08),rgba(123,47,255,0.08))" }}
                >
                  {p.icon}
                </div>
                <div className="p-6 relative z-[1]">
                  <div className="flex gap-2 flex-wrap mb-3">
                    {p.tags?.map((t, j) => (
                      <span key={j} className="px-2.5 py-0.5 rounded-full bg-cyan/10 border border-cyan/20 text-[11px] text-cyan tracking-wide">
                        {t}
                      </span>
                    ))}
                  </div>
                  <h3 className="text-lg font-inter text-white mb-2">{p.title}</h3>
                  <p className="text-[13px] text-white/40 leading-relaxed mb-5">{p.description}</p>
                  <div className="flex gap-3">
                    <a 
                      href={p.liveLink} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="mag btn-main relative overflow-hidden flex-1 py-2 rounded-[4px] text-[11px] font-inter tracking-widest uppercase cursor-none z-[1] text-center"
                    >
                      Live Demo
                    </a>
                  </div>
                </div>
              </div>
            )) : (
              <div className="col-span-full text-center text-white/40 py-12">
                No projects yet. Add projects from the admin panel.
              </div>
            )}
          </div>
        </div>
      </section>

      <div className="h-px w-full" style={{ background: "linear-gradient(90deg,transparent,rgba(0,245,255,0.3),rgba(123,47,255,0.3),transparent)" }}></div>

      {/* JOURNEY */}
      <section id="journey" className="relative z-[1] py-28 px-8">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-16 items-start">
          <div className="reveal">
            <p className="flex items-center gap-2 text-cyan text-[11px] tracking-[0.15em] uppercase mb-3">
              <span className="opacity-50">//</span>My Path
            </p>
            <h2 className="font-playfair tracking-[-0.03em] leading-[1.1] mb-6" style={{ fontSize: "clamp(2rem,5vw,3.5rem)" }}>
              The <span className="text-grad-c">Journey</span>
            </h2>
            <p className="text-white/40 leading-relaxed text-sm">
              Every great story has a beginning. Here&apos;s how I went from curious kid to digital craftsman, one milestone at a time.
            </p>
          </div>
          <div className="reveal relative pt-4">
            <div
              className="absolute left-8 top-0 bottom-0 w-px"
              style={{ background: "linear-gradient(to bottom,transparent,rgba(0,245,255,0.3),rgba(123,47,255,0.3),transparent)" }}
            ></div>
            <div id="tl">
              {timeline.map((t, i) => (
                <div key={i} className="relative pl-20 pb-12">
                  <div className="tl-dot absolute left-8 top-8 w-3 h-3 rounded-full bg-cyan -translate-x-1/2"></div>
                  <p className="text-[11px] text-cyan tracking-widest uppercase mb-1.5">{t.year}</p>
                  <h4 className="text-base font-inter text-white mb-1.5">{t.title}</h4>
                  <p className="text-[13px] text-white/40 leading-relaxed">{t.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <div className="h-px w-full" style={{ background: "linear-gradient(90deg,transparent,rgba(0,245,255,0.3),rgba(123,47,255,0.3),transparent)" }}></div>

      {/* CONTACT */}
      <section id="contact" className="relative z-[1] py-28 px-8">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-16 items-start">
          {/* Left info */}
          <div className="reveal">
            <p className="flex items-center gap-2 text-cyan text-[11px] tracking-[0.15em] uppercase mb-3">
              <span className="opacity-50">//</span>Get in Touch
            </p>
            <h2 className="font-playfair tracking-[-0.03em] leading-[1.1] mb-6" style={{ fontSize: "clamp(2rem,5vw,3.5rem)" }}>
              Let&apos;s <span className="text-grad-c">Create</span>
              <br />
              Together
            </h2>
            <p className="text-white/40 leading-relaxed mb-8 text-sm">
              Have a project in mind? Want to collaborate or just say hello? My inbox is always open for interesting ideas.
            </p>

            {/* Social icons */}
            <div className="flex gap-3 flex-wrap mb-8">
              <a href="#" className="si w-11 h-11 rounded-xl bg-white/[0.04] border border-white/[0.08] flex items-center justify-center text-white/50 transition-all duration-300 cursor-none" title="GitHub">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.342-3.369-1.342-.454-1.155-1.11-1.463-1.11-1.463-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.115 2.504.337 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.202 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.163 22 16.418 22 12c0-5.523-4.477-10-10-10z" />
                </svg>
              </a>
              <a href="#" className="si w-11 h-11 rounded-xl bg-white/[0.04] border border-white/[0.08] flex items-center justify-center text-white/50 transition-all duration-300 cursor-none" title="LinkedIn">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
              </a>
              <a href="#" className="si w-11 h-11 rounded-xl bg-white/[0.04] border border-white/[0.08] flex items-center justify-center text-white/50 transition-all duration-300 cursor-none" title="Twitter">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>
              <a href="#" className="si w-11 h-11 rounded-xl bg-white/[0.04] border border-white/[0.08] flex items-center justify-center text-white/50 transition-all duration-300 cursor-none" title="Email">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </a>
            </div>

            <div className="bg-white/[0.04] border border-white/[0.08] rounded-2xl p-6 backdrop-blur-md">
              <p className="text-cyan text-[11px] tracking-widest uppercase mb-1">Based in</p>
              <p className="font-semibold text-white/80">Srinagar, Jammu &amp; Kashmir</p>
              <p className="text-[11px] text-white/30 mt-0.5">India · UTC+5:30</p>
            </div>
          </div>

          {/* Form */}
          <div className="reveal">
            <form
              id="contact-form"
              className="bg-white/[0.04] border border-white/[0.08] rounded-2xl p-8 backdrop-blur-md flex flex-col gap-6"
              onSubmit={handleSubmit}
            >
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] text-white/40 tracking-widest uppercase mb-2">Name</label>
                  <input
                    type="text"
                    placeholder="Your name"
                    className="ni w-full px-4 py-3.5 bg-white/[0.04] border border-white/[0.08] rounded-lg text-white text-sm placeholder-white/20 transition-all duration-300"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-white/40 tracking-widest uppercase mb-2">Email</label>
                  <input
                    type="email"
                    placeholder="your@email.com"
                    className="ni w-full px-4 py-3.5 bg-white/[0.04] border border-white/[0.08] rounded-lg text-white text-sm placeholder-white/20 transition-all duration-300"
                  />
                </div>
              </div>
              <div>
                <label className="block text-[11px] text-white/40 tracking-widest uppercase mb-2">Subject</label>
                <input
                  type="text"
                  placeholder="What's this about?"
                  className="ni w-full px-4 py-3.5 bg-white/[0.04] border border-white/[0.08] rounded-lg text-white text-sm placeholder-white/20 transition-all duration-300"
                />
              </div>
              <div>
                <label className="block text-[11px] text-white/40 tracking-widest uppercase mb-2">Message</label>
                <textarea
                  rows="5"
                  placeholder="Tell me about your project..."
                  className="ni w-full px-4 py-3.5 bg-white/[0.04] border border-white/[0.08] rounded-lg text-white text-sm placeholder-white/20 transition-all duration-300 resize-none"
                ></textarea>
              </div>
              <button
                id="sub-btn"
                type="submit"
                className="mag btn-main relative overflow-hidden w-full py-4 rounded-[4px] text-xs font-inter font-bold tracking-widest uppercase cursor-none hover:-translate-y-0.5 transition-transform duration-200 z-[1]"
              >
                Send Message to the Coder ✦
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className={`relative z-[1] bg-gradient-to-b from-transparent via-white/[0.01] to-white/[0.02] border-t border-white/[0.08] px-8 py-16`}>
        <div className="max-w-7xl mx-auto">
          {/* Main Footer Content */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
            {/* Brand Section */}
            <div className="md:col-span-1">
              <div className="text-grad-c text-2xl font-playfair tracking-wider mb-3 font-bold">The Technocrat</div>
              <p className="text-xs text-white/40 leading-relaxed mb-4">
                Crafting digital experiences with code, creativity, and precision. UPSC aspirant from Kashmir.
              </p>
              <div className="flex gap-3">
                {settings?.socialLinks && Object.entries(settings.socialLinks).map(([platform, link]) => {
                  if (!link) return null;
                  const icons = {
                    github: <path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.342-3.369-1.342-.454-1.155-1.11-1.463-1.11-1.463-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.115 2.504.337 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.202 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.163 22 16.418 22 12c0-5.523-4.477-10-10-10z" />,
                    linkedin: <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />,
                    twitter: <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />,
                    instagram: <path d="M12 2c2.717 0 2.817.009 3.295.048.477.04.803.09 1.08.192.28.103.503.229.727.454.224.223.35.447.454.727.102.277.152.603.192 1.08.039.478.048.578.048 3.295s-.009 2.817-.048 3.295c-.04.477-.09.803-.192 1.08-.103.28-.229.503-.454.727-.223.224-.447.35-.727.454-.277.102-.603.152-1.08.192-.478.039-.578.048-3.295.048s-2.817-.009-3.295-.048c-.477-.04-.803-.09-1.08-.192-.28-.103-.503-.229-.727-.454-.224-.223-.35-.447-.454-.727-.102-.277-.152-.603-.192-1.08-.039-.478-.048-.578-.048-3.295s.009-2.817.048-3.295c.04-.477.09-.803.192-1.08.103-.28.229-.503.454-.727.223-.224.447-.35.727-.454.277-.102.603-.152 1.08-.192.478-.039.578-.048 3.295-.048M12 5.875a6.125 6.125 0 100 12.25 6.125 6.125 0 000-12.25zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 0 000-2.881z" />,
                    youtube: <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.867 3.893 12 3.893 12 3.893s-7.867 0-9.377.157A3.015 3.015 0 00.502 6.186C0 8.346 0 12 0 12s0 3.653.502 5.814a3.016 3.016 0 002.122 2.136c1.51.157 9.377.157 9.377.157s7.867 0 9.377-.157a3.015 3.015 0 002.132-2.136C24 15.653 24 12 24 12s0-3.653-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />,
                    email: <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />,
                  };
                  const labels = { github: 'GitHub', linkedin: 'LinkedIn', twitter: 'Twitter/X', instagram: 'Instagram', youtube: 'YouTube', email: 'Email' };
                  return (
                    <a 
                      key={platform}
                      href={platform === 'email' ? `mailto:${link}` : link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="social-icon w-8 h-8 rounded-lg bg-white/[0.05] border border-white/[0.1] flex items-center justify-center text-white/40 hover:text-cyan hover:border-cyan/30 hover:shadow-[0_0_20px_rgba(0,245,255,0.3)] hover:scale-110 transition-all duration-300"
                      title={labels[platform] || platform}
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                        {icons[platform]}
                      </svg>
                    </a>
                  );
                })}
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="text-sm font-semibold text-white mb-4 tracking-widest uppercase">Navigation</h3>
              <ul className="space-y-2 text-xs">
                <li><a href="#about" className="text-white/40 hover:text-cyan transition-colors no-underline">About</a></li>
                <li><a href="#skills" className="text-white/40 hover:text-cyan transition-colors no-underline">Skills</a></li>
                <li><a href="#projects" className="text-white/40 hover:text-cyan transition-colors no-underline">Projects</a></li>
                <li><a href="#journey" className="text-white/40 hover:text-cyan transition-colors no-underline">Journey</a></li>
                <li><a href="#contact" className="text-white/40 hover:text-cyan transition-colors no-underline">Contact</a></li>
              </ul>
            </div>

            {/* Resources */}
            <div>
              <h3 className="text-sm font-semibold text-white mb-4 tracking-widest uppercase">Resources</h3>
              <ul className="space-y-2 text-xs">
                <li><a href="/blog" className="text-white/40 hover:text-cyan transition-colors no-underline">Blog</a></li>
                <li>
                  <a 
                    href={settings?.resumeUrl || '#'} 
                    className={`text-white/40 hover:text-cyan transition-colors no-underline ${!settings?.resumeUrl ? 'pointer-events-none opacity-50' : ''}`}
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
                <li><a href="#" className="text-white/40 hover:text-cyan transition-colors no-underline">Dev Tools</a></li>
                <li><a href="#" className="text-white/40 hover:text-cyan transition-colors no-underline">Snippets</a></li>
              </ul>
            </div>

            {/* Legal */}
            <div>
              <h3 className="text-sm font-semibold text-white mb-4 tracking-widest uppercase">Legal</h3>
              <ul className="space-y-2 text-xs">
                <li><a href="#" className="text-white/40 hover:text-cyan transition-colors no-underline">Privacy</a></li>
                <li><a href="#" className="text-white/40 hover:text-cyan transition-colors no-underline">Terms</a></li>
                <li><a href="#" className="text-white/40 hover:text-cyan transition-colors no-underline">Cookies</a></li>
                <li><a href="#" className="text-white/40 hover:text-cyan transition-colors no-underline">Disclaimer</a></li>
              </ul>
            </div>
          </div>

          {/* Divider */}
          <div className="h-px w-full bg-gradient-to-r from-transparent via-white/[0.1] to-transparent mb-8"></div>

          {/* Bottom Footer */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-white/30">
            <p>© 2026 The Technocrat. All rights reserved.</p>
            <p className="text-center md:text-right">Designed &amp; built with <span className="text-cyan">code</span> in Srinagar, Kashmir</p>
          </div>
        </div>
      </footer>

      <BackToTop />
    </div>
  );
}