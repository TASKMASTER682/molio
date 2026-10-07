// app/admin/projects/page.js
"use client";

import { useEffect, useState, useRef } from "react";
import { sanitizeHtml } from "../../../lib/html";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const iconOptions = [
  { value: "🌐", label: "🌐 Globe" },
  { value: "🤖", label: "🤖 Robot" },
  { value: "🎮", label: "🎮 Game" },
  { value: "📊", label: "📊 Chart" },
  { value: "🔐", label: "🔐 Lock" },
  { value: "🎵", label: "🎵 Music" },
  { value: "🛒", label: "🛒 Shop" },
  { value: "📱", label: "📱 Mobile" },
  { value: "☁️", label: "☁️ Cloud" },
  { value: "📡", label: "📡 API" },
  { value: "🎨", label: "🎨 Design" },
  { value: "🔗", label: "🔗 Link" },
];

export default function ProjectsPage() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    icon: "🌐",
    title: "",
    description: "",
    tags: "",
    liveLink: "",
    type: "own",
    clientType: "",
    problem: "",
    role: "",
    timeline: "",
    result: "",
    hardProblem: "",
    featured: false,
  });
  const [editingId, setEditingId] = useState(null);
  const hardRef = useRef(null);

  function wrapHard(before, after = "") {
    const el = hardRef.current;
    if (!el) return;
    const s = el.selectionStart ?? form.hardProblem.length;
    const e = el.selectionEnd ?? s;
    const value = form.hardProblem;
    const next = value.slice(0, s) + before + value.slice(s, e) + after + value.slice(e);
    setForm((f) => ({ ...f, hardProblem: next }));
    requestAnimationFrame(() => {
      el.focus();
      const pos = e + before.length;
      el.setSelectionRange(pos, pos);
    });
  }

  const emptyForm = {
    icon: "🌐",
    title: "",
    description: "",
    tags: "",
    liveLink: "",
    type: "own",
    clientType: "",
    problem: "",
    role: "",
    timeline: "",
    result: "",
    hardProblem: "",
    featured: false,
  };

  async function fetchProjects() {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/projects`);
      const json = await res.json();
      setProjects(Array.isArray(json) ? json : Array.isArray(json?.data) ? json.data : []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchProjects();
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    try {
      const url = editingId 
        ? `${API_URL}/api/projects/${editingId}`
        : `${API_URL}/api/projects`;
      const method = editingId ? "PUT" : "POST";
      
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          hardProblem: form.hardProblem ? sanitizeHtml(form.hardProblem) : "",
        }),
      });
      
      if (res.ok) {
        setForm(emptyForm);
        setEditingId(null);
        fetchProjects();
      }
    } catch (e) {
      console.error(e);
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id) {
    if (!confirm("Delete this project?")) return;
    try {
      await fetch(`${API_URL}/api/projects/${id}`, { method: "DELETE" });
      fetchProjects();
    } catch (e) {
      console.error(e);
    }
  }

  function handleEdit(project) {
    setForm({
      icon: project.icon,
      title: project.title,
      description: project.description,
      tags: project.tags.join(", "),
      liveLink: project.liveLink,
      type: project.type || "own",
      clientType: project.clientType || "",
      problem: project.problem || "",
      role: project.role || "",
      timeline: project.timeline || "",
      result: project.result || "",
      hardProblem: project.hardProblem || "",
      featured: !!project.featured,
    });
    setEditingId(project._id);
  }

  return (
    <div className="admin-container">
      <header className="admin-header">
        <h1>Projects</h1>
        <p>Add and manage portfolio projects displayed on the homepage.</p>
      </header>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Add/Edit Form */}
        <div className="glass-card p-6 min-w-0">
          <h2 className="text-lg font-playfair font-bold text-white mb-4">
            {editingId ? "Edit Project" : "Add New Project"}
          </h2>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label className="block text-[11px] text-white/50 tracking-widest uppercase mb-2">
                Icon
              </label>
              <select
                value={form.icon}
                onChange={(e) => setForm({ ...form, icon: e.target.value })}
                className="ni w-full px-4 py-3 bg-white/[0.04] border border-white/[0.08] rounded-lg text-white text-sm"
              >
                {iconOptions.map((opt) => (
                  <option key={opt.value} value={opt.value} className="bg-[#0a0a0a]">
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[11px] text-white/50 tracking-widest uppercase mb-2">
                Title
              </label>
              <input
                type="text"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                placeholder="Project Name"
                required
                className="ni w-full px-4 py-3 bg-white/[0.04] border border-white/[0.08] rounded-lg text-white text-sm placeholder-white/20"
              />
            </div>

            <div>
              <label className="block text-[11px] text-white/50 tracking-widest uppercase mb-2">
                Description
              </label>
              <textarea
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                placeholder="Short description..."
                required
                rows={3}
                className="ni w-full px-4 py-3 bg-white/[0.04] border border-white/[0.08] rounded-lg text-white text-sm placeholder-white/20 resize-none"
              />
            </div>

            <div>
              <label className="block text-[11px] text-white/50 tracking-widest uppercase mb-2">
                Tags (comma separated)
              </label>
              <input
                type="text"
                value={form.tags}
                onChange={(e) => setForm({ ...form, tags: e.target.value })}
                placeholder="Next.js, Node, MongoDB"
                className="ni w-full px-4 py-3 bg-white/[0.04] border border-white/[0.08] rounded-lg text-white text-sm placeholder-white/20"
              />
            </div>

            <div>
              <label className="block text-[11px] text-white/50 tracking-widest uppercase mb-2">
                Live Link
              </label>
              <input
                type="url"
                value={form.liveLink}
                onChange={(e) => setForm({ ...form, liveLink: e.target.value })}
                placeholder="https://..."
                required
                className="ni w-full px-4 py-3 bg-white/[0.04] border border-white/[0.08] rounded-lg text-white text-sm placeholder-white/20"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] text-white/50 tracking-widest uppercase mb-2">
                  Project Type
                </label>
                <select
                  value={form.type}
                  onChange={(e) => setForm({ ...form, type: e.target.value })}
                  className="ni w-full px-4 py-3 bg-white/[0.04] border border-white/[0.08] rounded-lg text-white text-sm"
                >
                  <option value="own" className="bg-[#0a0a0a]">Own Product</option>
                  <option value="client" className="bg-[#0a0a0a]">Client Project</option>
                </select>
              </div>
              <div>
                <label className="block text-[11px] text-white/50 tracking-widest uppercase mb-2">
                  Timeline
                </label>
                <input
                  type="text"
                  value={form.timeline}
                  onChange={(e) => setForm({ ...form, timeline: e.target.value })}
                  placeholder="e.g. 3 months"
                  className="ni w-full px-4 py-3 bg-white/[0.04] border border-white/[0.08] rounded-lg text-white text-sm placeholder-white/20"
                />
              </div>
            </div>

            {form.type === "client" && (
              <div>
                <label className="block text-[11px] text-white/50 tracking-widest uppercase mb-2">
                  Client Type (leave blank for NDA)
                </label>
                <input
                  type="text"
                  value={form.clientType}
                  onChange={(e) => setForm({ ...form, clientType: e.target.value })}
                  placeholder="e.g. Local coaching institute"
                  className="ni w-full px-4 py-3 bg-white/[0.04] border border-white/[0.08] rounded-lg text-white text-sm placeholder-white/20"
                />
              </div>
            )}

            <div>
              <label className="block text-[11px] text-white/50 tracking-widest uppercase mb-2">
                Problem (what the client/user faced)
              </label>
              <textarea
                value={form.problem}
                onChange={(e) => setForm({ ...form, problem: e.target.value })}
                placeholder="e.g. Paper-based mock tests, no analytics for 400+ students"
                rows={2}
                className="ni w-full px-4 py-3 bg-white/[0.04] border border-white/[0.08] rounded-lg text-white text-sm placeholder-white/20 resize-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] text-white/50 tracking-widest uppercase mb-2">
                  My Role
                </label>
                <input
                  type="text"
                  value={form.role}
                  onChange={(e) => setForm({ ...form, role: e.target.value })}
                  placeholder="e.g. Design + Full-stack dev"
                  className="ni w-full px-4 py-3 bg-white/[0.04] border border-white/[0.08] rounded-lg text-white text-sm placeholder-white/20"
                />
              </div>
              <div>
                <label className="block text-[11px] text-white/50 tracking-widest uppercase mb-2">
                  Result (with numbers if possible)
                </label>
                <input
                  type="text"
                  value={form.result}
                  onChange={(e) => setForm({ ...form, result: e.target.value })}
                  placeholder="e.g. Cut grading time by 80%"
                  className="ni w-full px-4 py-3 bg-white/[0.04] border border-white/[0.08] rounded-lg text-white text-sm placeholder-white/20"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] text-white/50 tracking-widest uppercase mb-2">
                Hard Problem Solved
              </label>
              <p className="text-[11px] text-white/35 mb-2">
                HTML allowed: <code className="text-cyan/70">&lt;p&gt;</code> <code className="text-cyan/70">&lt;b&gt;</code> <code className="text-cyan/70">&lt;i&gt;</code> <code className="text-cyan/70">&lt;a&gt;</code> <code className="text-cyan/70">&lt;h3&gt;</code> <code className="text-cyan/70">&lt;ul&gt;</code> — no inline styles (they get stripped).
              </p>

              <div className="flex items-center gap-1.5 mb-2 flex-wrap">
                {[
                  { label: "B", title: "Bold", before: "<b>", after: "</b>", style: "font-bold" },
                  { label: "I", title: "Italic", before: "<i>", after: "</i>", style: "italic" },
                  { label: "H3", title: "Heading", before: "<h3>", after: "</h3>", style: "font-bold" },
                  { label: "Link", title: "Link", before: '<a href="https://">', after: "</a>", style: "" },
                  { label: "• List", title: "Bullet list", before: "<ul><li>", after: "</li></ul>", style: "" },
                ].map((b) => (
                  <button
                    key={b.label}
                    type="button"
                    title={b.title}
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => wrapHard(b.before, b.after)}
                    className={`px-2.5 py-1 rounded-md bg-white/[0.05] border border-white/[0.1] text-white/65 text-[11px] hover:text-cyan hover:border-cyan/40 transition-colors ${b.style}`}
                  >
                    {b.label}
                  </button>
                ))}
              </div>

              <textarea
                ref={hardRef}
                value={form.hardProblem}
                onChange={(e) => setForm({ ...form, hardProblem: e.target.value })}
                placeholder="The trickiest technical challenge you solved (HTML ok)"
                rows={4}
                className="ni w-full px-4 py-3 bg-white/[0.04] border border-white/[0.08] rounded-lg text-white text-sm placeholder-white/20 resize-y font-mono"
              />

              {form.hardProblem && (
                <div className="mt-3">
                  <p className="text-[10px] tracking-[0.18em] uppercase text-white/35 mb-1.5">Live preview</p>
                  <div className="rounded-lg border border-white/[0.08] bg-[#0b111a] px-4 py-3 text-[13px] leading-relaxed text-white/70 case-html">
                    <div dangerouslySetInnerHTML={{ __html: sanitizeHtml(form.hardProblem) }} />
                  </div>
                </div>
              )}
            </div>

            <label className="flex items-center gap-3 text-sm text-white/70 cursor-pointer">
              <input
                type="checkbox"
                checked={form.featured}
                onChange={(e) => setForm({ ...form, featured: e.target.checked })}
                className="w-4 h-4 accent-cyan"
              />
              Featured (show first in Case Studies)
            </label>

            <div className="flex gap-3 mt-2">
              <button
                type="submit"
                disabled={saving}
                className="btn-primary flex-1"
              >
                {saving ? "Saving..." : editingId ? "Update Project" : "Add Project"}
              </button>
              {editingId && (
                <button
                  type="button"
                  onClick={() => {
                    setEditingId(null);
                    setForm(emptyForm);
                  }}
                  className="px-4 py-3 rounded-lg bg-white/[0.04] border border-white/[0.08] text-white/60 text-sm hover:text-white transition-colors"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Projects List */}
        <div className="glass-card p-6 min-w-0">
          <h2 className="text-lg font-playfair font-bold text-white mb-4">
            {loading ? "Loading..." : `${projects.length} Projects`}
          </h2>
          <div className="flex flex-col gap-3 max-h-[500px] overflow-y-auto">
            {projects.map((project) => (
              <div
                key={project._id}
                className="flex items-center gap-4 p-4 bg-white/[0.02] border border-white/[0.06] rounded-lg"
              >
                <span className="text-2xl">{project.icon}</span>
                <div className="flex-1 min-w-0">
                  <h3 className="text-white font-playfair font-bold text-sm truncate">
                    {project.title}
                    {project.featured && <span className="ml-2 text-yellow-400 text-xs">★</span>}
                    <span className={`ml-2 px-1.5 py-0.5 rounded text-[9px] uppercase ${project.type === "client" ? "bg-purple-500/15 text-purple-300" : "bg-cyan/10 text-cyan"}`}>
                      {project.type === "client" ? "Client" : "Own"}
                    </span>
                  </h3>
                  <p className="text-white/40 text-xs truncate">{project.description}</p>
                  <div className="flex gap-1.5 mt-1.5 flex-wrap">
                    {project.tags.map((tag, i) => (
                      <span key={i} className="px-2 py-0.5 rounded-full bg-cyan/10 border border-cyan/20 text-[10px] text-cyan">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(project)}
                    className="p-2 rounded-lg bg-cyan/10 text-cyan hover:bg-cyan/20 transition-colors"
                  >
                    ✏️
                  </button>
                  <button
                    onClick={() => handleDelete(project._id)}
                    className="p-2 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors"
                  >
                    🗑️
                  </button>
                </div>
              </div>
            ))}
            {!loading && projects.length === 0 && (
              <p className="text-white/40 text-center py-8">No projects yet. Add your first project!</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}