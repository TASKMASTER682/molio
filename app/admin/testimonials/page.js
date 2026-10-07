// app/admin/testimonials/page.js
"use client";

import { useEffect, useState } from "react";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function TestimonialsPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    name: "",
    role: "",
    quote: "",
    displayOrder: 0,
    isActive: true,
  });
  const [editingId, setEditingId] = useState(null);

  const emptyForm = { name: "", role: "", quote: "", displayOrder: 0, isActive: true };

  async function fetchItems() {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/testimonials`);
      const json = await res.json();
      setItems(Array.isArray(json) ? json : Array.isArray(json?.data) ? json.data : []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchItems();
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    try {
      const url = editingId
        ? `${API_URL}/api/testimonials/${editingId}`
        : `${API_URL}/api/testimonials`;
      const method = editingId ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (res.ok) {
        setForm(emptyForm);
        setEditingId(null);
        fetchItems();
      }
    } catch (e) {
      console.error(e);
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id) {
    if (!confirm("Delete this testimonial?")) return;
    try {
      await fetch(`${API_URL}/api/testimonials/${id}`, { method: "DELETE" });
      fetchItems();
    } catch (e) {
      console.error(e);
    }
  }

  function handleEdit(item) {
    setForm({
      name: item.name,
      role: item.role || "",
      quote: item.quote,
      displayOrder: item.displayOrder || 0,
      isActive: item.isActive !== false,
    });
    setEditingId(item._id);
  }

  return (
    <div className="admin-container">
      <header className="admin-header">
        <h1>Testimonials</h1>
        <p>Client / collaborator quotes shown on the homepage. Section hides automatically when empty.</p>
      </header>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Add/Edit Form */}
        <div className="glass-card p-6">
          <h2 className="text-lg font-playfair font-bold text-white mb-4">
            {editingId ? "Edit Testimonial" : "Add New Testimonial"}
          </h2>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] text-white/50 tracking-widest uppercase mb-2">
                  Name
                </label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="Client name"
                  required
                  className="ni w-full px-4 py-3 bg-white/[0.04] border border-white/[0.08] rounded-lg text-white text-sm placeholder-white/20"
                />
              </div>
              <div>
                <label className="block text-[11px] text-white/50 tracking-widest uppercase mb-2">
                  Role / Company
                </label>
                <input
                  type="text"
                  value={form.role}
                  onChange={(e) => setForm({ ...form, role: e.target.value })}
                  placeholder="e.g. Founder, Inst. Name"
                  className="ni w-full px-4 py-3 bg-white/[0.04] border border-white/[0.08] rounded-lg text-white text-sm placeholder-white/20"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] text-white/50 tracking-widest uppercase mb-2">
                Quote
              </label>
              <textarea
                value={form.quote}
                onChange={(e) => setForm({ ...form, quote: e.target.value })}
                placeholder="What they said about working with you..."
                required
                rows={4}
                className="ni w-full px-4 py-3 bg-white/[0.04] border border-white/[0.08] rounded-lg text-white text-sm placeholder-white/20 resize-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-4 items-end">
              <div>
                <label className="block text-[11px] text-white/50 tracking-widest uppercase mb-2">
                  Display Order
                </label>
                <input
                  type="number"
                  value={form.displayOrder}
                  onChange={(e) => setForm({ ...form, displayOrder: parseInt(e.target.value) || 0 })}
                  className="ni w-full px-4 py-3 bg-white/[0.04] border border-white/[0.08] rounded-lg text-white text-sm"
                />
              </div>
              <label className="flex items-center gap-3 text-sm text-white/70 cursor-pointer pb-3">
                <input
                  type="checkbox"
                  checked={form.isActive}
                  onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
                  className="w-4 h-4 accent-cyan"
                />
                Visible on site
              </label>
            </div>

            <div className="flex gap-3 mt-2">
              <button type="submit" disabled={saving} className="btn-primary flex-1">
                {saving ? "Saving..." : editingId ? "Update Testimonial" : "Add Testimonial"}
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

        {/* List */}
        <div className="glass-card p-6">
          <h2 className="text-lg font-playfair font-bold text-white mb-4">
            {loading ? "Loading..." : `${items.length} Testimonials`}
          </h2>
          <div className="flex flex-col gap-3 max-h-[500px] overflow-y-auto">
            {items.map((item) => (
              <div
                key={item._id}
                className="flex items-start gap-4 p-4 bg-white/[0.02] border border-white/[0.06] rounded-lg"
              >
                <div className="flex-1 min-w-0">
                  <h3 className="text-white font-playfair font-bold text-sm">
                    {item.name}
                    <span className="ml-2 text-white/40 font-normal text-xs">{item.role}</span>
                  </h3>
                  <p className="text-white/50 text-xs mt-1 line-clamp-2">&ldquo;{item.quote}&rdquo;</p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(item)}
                    className="p-2 rounded-lg bg-cyan/10 text-cyan hover:bg-cyan/20 transition-colors"
                  >
                    ✏️
                  </button>
                  <button
                    onClick={() => handleDelete(item._id)}
                    className="p-2 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors"
                  >
                    🗑️
                  </button>
                </div>
              </div>
            ))}
            {!loading && items.length === 0 && (
              <p className="text-white/40 text-center py-8">No testimonials yet.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
