// app/admin/skills/page.js
"use client";

import { useEffect, useState } from "react";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const colorOptions = [
  { value: "#61dafb", label: "React (Blue)" },
  { value: "#ffffff", label: "Next.js (White)" },
  { value: "#8cc84b", label: "Node.js (Green)" },
  { value: "#00f5ff", label: "Three.js (Cyan)" },
  { value: "#38bdf8", label: "Tailwind (Sky)" },
  { value: "#ffd43b", label: "Python (Yellow)" },
  { value: "#3178c6", label: "TypeScript (Blue)" },
  { value: "#47a248", label: "MongoDB (Green)" },
  { value: "#336791", label: "PostgreSQL (Blue)" },
  { value: "#2496ed", label: "Docker (Blue)" },
  { value: "#f14e32", label: "Git (Red)" },
  { value: "#f24e1e", label: "Figma (Orange)" },
];

export default function SkillsPage() {
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    name: "",
    percentage: 80,
    color: "#00f5ff",
  });
  const [editingId, setEditingId] = useState(null);

  async function fetchSkills() {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/skills`);
      const json = await res.json();
      setSkills(Array.isArray(json) ? json : Array.isArray(json?.data) ? json.data : []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchSkills();
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    try {
      const url = editingId 
        ? `${API_URL}/api/skills/${editingId}`
        : `${API_URL}/api/skills`;
      const method = editingId ? "PUT" : "POST";
      
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      
      if (res.ok) {
        setForm({ name: "", percentage: 80, color: "#00f5ff" });
        setEditingId(null);
        fetchSkills();
      }
    } catch (e) {
      console.error(e);
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id) {
    if (!confirm("Delete this skill?")) return;
    try {
      await fetch(`${API_URL}/api/skills/${id}`, { method: "DELETE" });
      fetchSkills();
    } catch (e) {
      console.error(e);
    }
  }

  function handleEdit(skill) {
    setForm({
      name: skill.name,
      percentage: skill.percentage,
      color: skill.color || "#00f5ff",
    });
    setEditingId(skill._id);
  }

  return (
    <div className="admin-container">
      <header className="admin-header">
        <h1>Skills</h1>
        <p>Add and manage skills displayed on the homepage.</p>
      </header>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Add/Edit Form */}
        <div className="glass-card p-6">
          <h2 className="text-lg font-playfair font-bold text-white mb-4">
            {editingId ? "Edit Skill" : "Add New Skill"}
          </h2>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label className="block text-[11px] text-white/50 tracking-widest uppercase mb-2">
                Skill Name
              </label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="e.g. React, Python, Node.js"
                required
                className="ni w-full px-4 py-3 bg-white/[0.04] border border-white/[0.08] rounded-lg text-white text-sm placeholder-white/20"
              />
            </div>

            <div>
              <label className="block text-[11px] text-white/50 tracking-widest uppercase mb-2">
                Expertise: {form.percentage}%
              </label>
              <input
                type="range"
                min="0"
                max="100"
                value={form.percentage}
                onChange={(e) => setForm({ ...form, percentage: parseInt(e.target.value) })}
                className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer"
                style={{
                  background: `linear-gradient(to right, #00f5ff ${form.percentage}%, rgba(255,255,255,0.1) ${form.percentage}%)`
                }}
              />
              <div className="flex justify-between text-xs text-white/30 mt-1">
                <span>0%</span>
                <span>100%</span>
              </div>
            </div>

            <div>
              <label className="block text-[11px] text-white/50 tracking-widest uppercase mb-2">
                Color
              </label>
              <select
                value={form.color}
                onChange={(e) => setForm({ ...form, color: e.target.value })}
                className="ni w-full px-4 py-3 bg-white/[0.04] border border-white/[0.08] rounded-lg text-white text-sm"
              >
                {colorOptions.map((opt) => (
                  <option key={opt.value} value={opt.value} className="bg-[#0a0a0a]">
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex gap-3 mt-2">
              <button
                type="submit"
                disabled={saving}
                className="btn-primary flex-1"
              >
                {saving ? "Saving..." : editingId ? "Update Skill" : "Add Skill"}
              </button>
              {editingId && (
                <button
                  type="button"
                  onClick={() => {
                    setEditingId(null);
                    setForm({ name: "", percentage: 80, color: "#00f5ff" });
                  }}
                  className="px-4 py-3 rounded-lg bg-white/[0.04] border border-white/[0.08] text-white/60 text-sm hover:text-white transition-colors"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Skills List */}
        <div className="glass-card p-6">
          <h2 className="text-lg font-playfair font-bold text-white mb-4">
            {loading ? "Loading..." : `${skills.length} Skills`}
          </h2>
          <div className="flex flex-col gap-3 max-h-[500px] overflow-y-auto">
            {skills.map((skill) => (
              <div
                key={skill._id}
                className="flex items-center gap-4 p-4 bg-white/[0.02] border border-white/[0.06] rounded-lg"
              >
                <div 
                  className="w-4 h-4 rounded-full"
                  style={{ backgroundColor: skill.color || "#00f5ff" }}
                />
                <div className="flex-1 min-w-0">
                  <h3 className="text-white font-playfair font-bold text-sm">{skill.name}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="flex-1 h-1.5 bg-white/10 rounded-full overflow-hidden">
                      <div 
                        className="h-full rounded-full"
                        style={{ 
                          width: `${skill.percentage}%`,
                          backgroundColor: skill.color || "#00f5ff"
                        }}
                      />
                    </div>
                    <span className="text-xs text-white/50">{skill.percentage}%</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(skill)}
                    className="p-2 rounded-lg bg-cyan/10 text-cyan hover:bg-cyan/20 transition-colors"
                  >
                    ✏️
                  </button>
                  <button
                    onClick={() => handleDelete(skill._id)}
                    className="p-2 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors"
                  >
                    🗑️
                  </button>
                </div>
              </div>
            ))}
            {!loading && skills.length === 0 && (
              <p className="text-white/40 text-center py-8">No skills yet. Add your first skill!</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}