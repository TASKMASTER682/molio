"use client";

import Link from "next/link";
import { sanitizeHtml } from "../../../lib/html";

const FIELD_ACCENTS = {
  Problem: "#ffb454",
  "My role": "#66b8ff",
  Timeline: "#c792ea",
  Result: "#00d4c8",
  Stack: "#8db4d4",
};

function MetaField({ label, value }) {
  if (!value) return null;
  const color = FIELD_ACCENTS[label] || "#00d4c8";
  return (
    <div className="rounded-xl border border-[var(--pencil)]/12 bg-[var(--paper)]/70 px-4 py-3.5 transition-colors duration-300 hover:border-[var(--pencil)]/25">
      <p className="flex items-center gap-1.5 text-[10px] font-bold tracking-[0.18em] uppercase font-[var(--mono)] mb-1.5" style={{ color }}>
        <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: color, boxShadow: `0 0 8px ${color}` }}></span>
        {label}
      </p>
      <p className="text-[13px] text-[var(--pencil)]/85 leading-relaxed break-words">{value}</p>
    </div>
  );
}

function SectionLabel({ index, children }) {
  return (
    <p className="flex items-center gap-3 text-[11px] tracking-[0.18em] uppercase text-[var(--accent)] font-[var(--mono)] mb-4">
      <span className="opacity-50">{"//"}</span>
      <span className="opacity-70">{index}</span>
      <span className="h-px flex-1 max-w-[80px]" style={{ background: "linear-gradient(90deg,rgba(0,212,200,0.5),transparent)" }}></span>
      {children}
    </p>
  );
}

export default function CaseStudyDetail({ project: p, others = [] }) {
  const hardHtml = p.hardProblem ? sanitizeHtml(p.hardProblem) : "";

  return (
    <main
      className="relative min-h-screen pt-24 pb-24 px-6 overflow-x-hidden"
      style={{
        background:
          "radial-gradient(ellipse at 50% -10%, rgba(0,212,200,0.12) 0%, transparent 55%), #080d14",
      }}
    >
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(to right, rgba(0,212,200,0.03) 1px, transparent 1px), linear-gradient(to bottom, rgba(0,212,200,0.03) 1px, transparent 1px)",
          backgroundSize: "80px 80px",
        }}
      ></div>

      <div className="relative max-w-4xl mx-auto">
        {/* Back link */}
        <Link
          href="/#work"
          className="cs-in inline-flex items-center gap-2 text-[11px] tracking-[0.18em] uppercase text-[var(--pencil)]/55 hover:text-[var(--accent)] transition-colors no-underline mb-8"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M12 19l-7-7 7-7" /></svg>
          All case studies
        </Link>

        {/* Header */}
        <header className="cs-in" style={{ animationDelay: "0.06s" }}>
          <div className="flex items-start gap-4 flex-wrap">
            <span className="grid h-16 w-16 shrink-0 place-items-center rounded-2xl border border-[var(--accent)]/30 bg-[var(--accent)]/10 text-3xl shadow-[0_0_30px_rgba(0,212,200,0.18)]">
              {p.icon}
            </span>
            <div className="min-w-0 flex-1">
              <div className="flex gap-2 flex-wrap mb-2.5">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[var(--accent)]/10 border border-[var(--accent)]/25 text-[10px] tracking-widest uppercase text-[var(--accent)] font-[var(--mono)]">
                  {p.featured && <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent)] animate-pulse"></span>}
                  {p.featured ? "Featured case study" : "Case study"}
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-white/[0.05] border border-white/10 text-[10px] tracking-widest uppercase text-[var(--pencil)]/70 font-[var(--mono)]">
                  {p.type === "client" ? p.clientType || "Client project" : "Own product"}
                </span>
              </div>
              <h1
                className="font-[var(--serif)] tracking-[-0.03em] leading-[1.05] text-[var(--ink)]"
                style={{ fontSize: "clamp(2rem,6vw,3.75rem)" }}
              >
                {p.title}
              </h1>
            </div>
          </div>

          <p className="mt-5 text-[15px] md:text-base text-[var(--pencil)]/75 leading-relaxed max-w-2xl">
            {p.description}
          </p>

          <div className="mt-5 flex items-center gap-3 flex-wrap">
            {p.tags?.map((t, i) => (
              <span
                key={i}
                className="cs-in px-3 py-1 rounded-full bg-[var(--accent)]/[0.07] border border-[var(--accent)]/25 text-[12px] text-[var(--accent)]/90"
                style={{ animationDelay: `${0.25 + i * 0.05}s` }}
              >
                {t}
              </span>
            ))}
          </div>

          <div className="mt-7 flex gap-3 flex-wrap">
            <a
              href={p.liveLink}
              target="_blank"
              rel="noopener noreferrer"
              className="cs-in inline-flex items-center gap-2 px-7 py-3 rounded-[4px] text-[11px] font-bold tracking-widest uppercase cursor-none no-underline hover:shadow-[0_0_20px_rgba(0,212,200,0.45)] transition-all duration-300 hover:-translate-y-0.5"
              style={{ background: "linear-gradient(90deg, #00d4c8, #0084ff)", color: "#080d14", animationDelay: "0.35s" }}
            >
              View Live
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M7 17 17 7M8 7h9v9" /></svg>
            </a>
            <Link
              href="/#contact"
              className="cs-in inline-flex items-center gap-2 px-7 py-3 rounded-[4px] border border-white/15 text-[11px] font-bold tracking-widest uppercase text-[#8db4d4]/70 hover:border-[#00d4c8]/45 hover:text-[#00d4c8] transition-all duration-300 no-underline"
              style={{ animationDelay: "0.42s" }}
            >
              Build something like this
            </Link>
          </div>
        </header>

        {/* Meta strip */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-12 cs-in" style={{ animationDelay: "0.2s" }}>
          <MetaField label="My role" value={p.role} />
          <MetaField label="Timeline" value={p.timeline} />
          <MetaField label="Result" value={p.result} />
          <MetaField label="Stack" value={p.tags?.join(" · ")} />
        </div>

        {/* Problem */}
        <section className="mt-14 cs-in" style={{ animationDelay: "0.28s" }}>
          <SectionLabel index="01">The Problem</SectionLabel>
          {p.problem ? (
            <p className="font-[var(--serif)] text-[clamp(1.15rem,2.4vw,1.6rem)] leading-[1.5] text-[var(--ink)]/90 tracking-[-0.01em] border-l-2 border-[#ffb454]/50 pl-5">
              {p.problem}
            </p>
          ) : (
            <p className="text-[15px] text-[var(--pencil)]/75 leading-relaxed">{p.description}</p>
          )}
        </section>

        {/* Hard problem solved — full HTML */}
        {hardHtml && (
          <section className="mt-14 cs-in" style={{ animationDelay: "0.34s" }}>
            <SectionLabel index="02">Hard Problem Solved</SectionLabel>
            <div className="rounded-2xl border border-dashed border-[#66b8ff]/30 bg-[var(--paper-tint)] p-6 md:p-8 transition-colors duration-300 hover:border-[#66b8ff]/50">
              <div className="case-html text-[14px] md:text-[15px] text-[var(--pencil)]/85 leading-relaxed" dangerouslySetInnerHTML={{ __html: hardHtml }} />
            </div>
          </section>
        )}

        {/* Result */}
        {p.result && (
          <section className="mt-14 cs-in" style={{ animationDelay: "0.4s" }}>
            <SectionLabel index={hardHtml ? "03" : "02"}>The Outcome</SectionLabel>
            <div className="relative overflow-hidden rounded-2xl border border-[#00d4c8]/30 bg-[#00d4c8]/[0.06] pl-6 pr-6 py-6 md:pl-8 md:pr-8">
              <span className="absolute left-0 top-0 h-full w-[3px] bg-gradient-to-b from-[#00d4c8] to-[#0084ff]"></span>
              <p className="text-[10px] tracking-[0.18em] uppercase text-[var(--accent)] font-[var(--mono)] mb-2">Result</p>
              <p className="font-[var(--serif)] text-[clamp(1.2rem,2.6vw,1.75rem)] leading-snug text-[var(--ink)] tracking-[-0.02em]">
                {p.result}
              </p>
            </div>
          </section>
        )}

        {/* More case studies */}
        {others.length > 0 && (
          <section className="mt-16 cs-in" style={{ animationDelay: "0.46s" }}>
            <SectionLabel index="→">More case studies</SectionLabel>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {others.map((o) => (
                <Link
                  key={o._id}
                  href={`/work/${o._id}`}
                  className="case-card group flex flex-col gap-2 rounded-2xl border border-[var(--pencil)]/15 bg-[var(--paper)] p-5 no-underline"
                >
                  <span className="text-2xl">{o.icon}</span>
                  <span className="text-[15px] font-[var(--serif)] text-[var(--ink)] leading-snug transition-colors duration-300 group-hover:text-[var(--accent)]">
                    {o.title}
                  </span>
                  <span className="text-[12px] text-[var(--pencil)]/55 leading-relaxed line-clamp-2">{o.description}</span>
                  <span className="mt-1 inline-flex items-center gap-1 text-[10px] uppercase tracking-[0.18em] font-[var(--mono)] text-[var(--accent)]/80">
                    Read case study
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="transition-transform duration-300 group-hover:translate-x-0.5"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
                  </span>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Footer CTA */}
        <div className="mt-16 pt-8 border-t border-[var(--pencil)]/10 flex items-center justify-between gap-4 flex-wrap cs-in" style={{ animationDelay: "0.52s" }}>
          <p className="text-[13px] text-[var(--pencil)]/55">
            Have a platform that needs to hold up under real traffic?
          </p>
          <Link
            href="/#contact"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-[11px] font-bold tracking-[0.15em] uppercase no-underline transition-all duration-300 hover:-translate-y-0.5 border border-[#00d4c8]/40 text-[#00d4c8] hover:shadow-[0_0_18px_rgba(0,212,200,0.3)]"
          >
            Let&apos;s talk
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
          </Link>
        </div>
      </div>
    </main>
  );
}
