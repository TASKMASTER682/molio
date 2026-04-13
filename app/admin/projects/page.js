// app/admin/projects/page.js
"use client";

import { useEffect, useState } from "react";

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
  });
  const [editingId, setEditingId] = useState(null);

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
        body: JSON.stringify(form),
      });
      
      if (res.ok) {
        setForm({ icon: "🌐", title: "", description: "", tags: "", liveLink: "" });
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
        <div className="glass-card p-6">
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
                    setForm({ icon: "🌐", title: "", description: "", tags: "", liveLink: "" });
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
        <div className="glass-card p-6">
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
                  <h3 className="text-white font-playfair font-bold text-sm truncate">{project.title}</h3>
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