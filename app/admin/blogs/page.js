// app/admin/blogs/page.js
"use client";

import { useEffect, useState } from "react";
import { TiptapEditor } from "../../components/TiptapEditor";

function parseCustomBlocksForEditor(html) {
  if (!html) return html;

  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');

  // Reverse the renderCustomBlocks process
  const reverseMappings = {
    'statsBlock': 'statsBlock',
    'quoteBlock': 'quoteBlock',
    'techGridBlock': 'techGridBlock',
    'caseStudyBlock': 'caseStudyBlock',
    'highlightBlock': 'highlightBlock',
    'workflowBlock': 'workflowBlock',
  };

  // Function to extract data from rendered HTML
  const extractBlockData = (element, blockType) => {
    // First try to get data from data-attrs (preferred method)
    if (element.hasAttribute('data-attrs')) {
      try {
        const dataAttrs = JSON.parse(element.getAttribute('data-attrs'));
        return dataAttrs;
      } catch (e) {
        console.warn(`Failed to parse data-attrs for ${blockType}:`, e);
      }
    }

    // Fallback to DOM parsing (for backward compatibility)
    const attrs = {};

    switch (blockType) {
      case 'statsBlock':
        const statItems = Array.from(element.querySelectorAll('.stat-item'));
        attrs.items = statItems.map(item => ({
          value: item.querySelector('.stat-value')?.textContent?.trim() || '',
          label: item.querySelector('.stat-label')?.textContent?.trim() || '',
          description: item.querySelector('.stat-description')?.textContent?.trim() || '',
        }));
        break;

      case 'quoteBlock':
        attrs.text = element.querySelector('p')?.textContent?.trim() || '';
        attrs.author = element.querySelector('cite')?.textContent?.replace('—', '').trim() || '';
        attrs.style = element.classList.contains('quote-glow') ? 'glow' :
                     element.classList.contains('quote-minimal') ? 'minimal' :
                     element.classList.contains('quote-boxed') ? 'boxed' : 'default';
        break;

      case 'techGridBlock':
        const techCards = Array.from(element.querySelectorAll('.tech-card'));
        attrs.items = techCards.map(card => ({
          icon: card.querySelector('.tech-icon')?.textContent?.trim() || '',
          title: card.querySelector('.tech-title')?.textContent?.trim() || '',
          description: card.querySelector('.tech-desc')?.textContent?.trim() || '',
        }));
        break;

      case 'caseStudyBlock':
        attrs.title = element.querySelector('.case-title')?.textContent?.trim() || '';
        attrs.body = element.querySelector('.case-body')?.textContent?.trim() || '';
        const verdictElement = element.querySelector('.verdict-value');
        attrs.verdict = verdictElement?.textContent?.trim() || '';
        attrs.verdictLabel = element.querySelector('.verdict-label')?.textContent?.trim() || 'Verdict';
        break;

      case 'highlightBlock':
        attrs.content = element.querySelector('p')?.textContent?.trim() || '';
        attrs.style = element.classList.contains('highlight-warning') ? 'warning' :
                     element.classList.contains('highlight-success') ? 'success' : 'info';
        break;

      case 'workflowBlock':
        const stepElements = Array.from(element.querySelectorAll('.workflow-step'));
        attrs.steps = stepElements.map(step => step.querySelector('.step-label')?.textContent?.trim() || '');
        attrs.layout = element.classList.contains('workflow-vertical') ? 'vertical' : 'horizontal';
        break;
    }

    return attrs;
  };

  // Replace rendered blocks with custom block tags
  Object.entries(reverseMappings).forEach(([blockType, blockTypeName]) => {
    const selector = `[data-type="${blockType}"]`;
    const elements = Array.from(doc.querySelectorAll(selector));
    console.log(`🔍 Found ${elements.length} elements for ${blockType} using selector: ${selector}`);

    elements.forEach((element, index) => {
      const attrs = extractBlockData(element, blockType);
      console.log(`🔍 ${blockType} #${index} attrs:`, attrs);
      const attrString = Object.entries(attrs)
        .filter(([key, value]) => value !== undefined && value !== null && value !== '')
        .map(([key, value]) => `${key}="${JSON.stringify(value).replace(/"/g, '&quot;')}"`)
        .join(' ');
      const customTag = `<${blockType} ${attrString}></${blockType}>`;
      console.log(`🔍 Replacing element with:`, customTag);
      element.replaceWith(parser.parseFromString(customTag, 'text/html').body.firstChild);
    });
  });

  return doc.body.innerHTML;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function BlogsPage() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    title: "",
    content: "",
    excerpt: "",
    coverImage: "",
    tags: "",
    isPublished: true,
  });
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);

  async function fetchBlogs() {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/blogs/admin`);
      const json = await res.json();
      setBlogs(Array.isArray(json) ? json : Array.isArray(json?.data) ? json.data : []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchBlogs();
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    console.log("📤 SENDING TO DB:");
    console.log("--- Request Start ---");
    console.log(form.content);
    console.log("--- Request End ---");
    
    try {
      const url = editingId 
        ? `${API_URL}/api/blogs/${editingId}`
        : `${API_URL}/api/blogs`;
      const method = editingId ? "PUT" : "POST";
      
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      
      const savedData = await res.json();
      console.log("📥 SAVED IN DB:");
      console.log("--- DB Response Start ---");
      console.log(savedData.data?.content || savedData.content);
      console.log("--- DB Response End ---");
      
      if (res.ok) {
        setForm({ title: "", content: "", excerpt: "", coverImage: "", tags: "", isPublished: true });
        setEditingId(null);
        setShowForm(false);
        fetchBlogs();
      }
    } catch (e) {
      console.error(e);
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id) {
    if (!confirm("Delete this blog?")) return;
    try {
      await fetch(`${API_URL}/api/blogs/${id}`, { method: "DELETE" });
      fetchBlogs();
    } catch (e) {
      console.error(e);
    }
  }

  function handleEdit(blog) {
    setForm({
      title: blog.title,
      content: parseCustomBlocksForEditor(blog.content),
      excerpt: blog.excerpt || "",
      coverImage: blog.coverImage || "",
      tags: blog.tags?.join(", ") || "",
      isPublished: blog.isPublished,
    });
    setEditingId(blog._id);
    setShowForm(true);
  }

  function handleNew() {
    setForm({ title: "", content: "", excerpt: "", coverImage: "", tags: "", isPublished: true });
    setEditingId(null);
    setShowForm(true);
  }

  return (
    <div className="admin-container">
      <header className="admin-header flex justify-between items-center">
        <div>
          <h1>Blog</h1>
          <p>Write and manage your blog posts.</p>
        </div>
        <button onClick={handleNew} className="btn-primary">
          + New Blog
        </button>
      </header>

      {showForm && (
        <div className="glass-card p-6 mb-8">
          <h2 className="text-lg font-playfair font-bold text-white mb-4">
            {editingId ? "Edit Blog" : "New Blog"}
          </h2>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label className="block text-[11px] text-white/50 tracking-widest uppercase mb-2">
                Title
              </label>
              <input
                type="text"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                placeholder="Your blog title..."
                required
                className="ni w-full px-4 py-3 bg-white/[0.04] border border-white/[0.08] rounded-lg text-white text-sm placeholder-white/20"
              />
            </div>

            <div>
              <label className="block text-[11px] text-white/50 tracking-widest uppercase mb-2">
                Cover Image
              </label>
              <div className="flex gap-4 items-start">
                <label className="cursor-pointer px-4 py-3 rounded-lg bg-cyan/10 border border-cyan/20 text-cyan text-sm hover:bg-cyan/20 transition-colors">
                  📁 Upload Image
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;
                      if (file.size > 512 * 1024) {
                        alert("Image must be less than 1MB");
                        return;
                      }
                      const reader = new FileReader();
                      reader.onload = () => setForm({ ...form, coverImage: reader.result });
                      reader.readAsDataURL(file);
                    }}
                  />
                </label>
                {form.coverImage && (
                  <div className="relative w-24 h-16 rounded-lg overflow-hidden border border-white/[0.08]">
                    <img src={form.coverImage} alt="Cover" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => setForm({ ...form, coverImage: "" })}
                      className="absolute top-0 right-0 w-5 h-5 bg-red-500 text-white text-xs flex items-center justify-center"
                    >
                      ×
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div>
              <label className="block text-[11px] text-white/50 tracking-widest uppercase mb-2">
                Tags (comma separated)
              </label>
              <input
                type="text"
                value={form.tags}
                onChange={(e) => setForm({ ...form, tags: e.target.value })}
                placeholder="react, javascript, tutorial"
                className="ni w-full px-4 py-3 bg-white/[0.04] border border-white/[0.08] rounded-lg text-white text-sm placeholder-white/20"
              />
            </div>

            <div>
              <label className="block text-[11px] text-white/50 tracking-widest uppercase mb-2">
                Content
              </label>
              <TiptapEditor
                content={form.content}
                onChange={(content) => setForm({ ...form, content })}
              />
            </div>

            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="isPublished"
                checked={form.isPublished}
                onChange={(e) => setForm({ ...form, isPublished: e.target.checked })}
                className="w-4 h-4 accent-cyan"
              />
              <label htmlFor="isPublished" className="text-white/60 text-sm">
                Publish immediately
              </label>
            </div>

            <div className="flex gap-3 mt-2">
              <button type="submit" disabled={saving} className="btn-primary">
                {saving ? "Saving..." : editingId ? "Update Blog" : "Publish Blog"}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  setEditingId(null);
                }}
                className="px-4 py-3 rounded-lg bg-white/[0.04] border border-white/[0.08] text-white/60 text-sm hover:text-white transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="glass-card p-6">
        <h2 className="text-lg font-playfair font-bold text-white mb-4">
          {loading ? "Loading..." : `${blogs.length} Blogs`}
        </h2>
        <div className="flex flex-col gap-3">
          {blogs.map((blog) => (
            <div
              key={blog._id}
              className="flex items-center gap-4 p-4 bg-white/[0.02] border border-white/[0.06] rounded-lg"
            >
              {blog.coverImage && (
                <img 
                  src={blog.coverImage} 
                  alt={blog.title}
                  className="w-16 h-16 object-cover rounded-lg"
                />
              )}
              <div className="flex-1 min-w-0">
                <h3 className="text-white font-playfair font-bold text-sm truncate">{blog.title}</h3>
                <p className="text-white/40 text-xs truncate">{blog.excerpt}</p>
                <div className="flex gap-1.5 mt-1.5 flex-wrap">
                  {blog.tags?.map((tag, i) => (
                    <span key={i} className="px-2 py-0.5 rounded-full bg-cyan/10 border border-cyan/20 text-[10px] text-cyan">
                      {tag}
                    </span>
                  ))}
                </div>
                <div className="flex gap-3 mt-2 text-xs text-white/30">
                  <span>{blog.readTime} min read</span>
                  <span>•</span>
                  <span className={blog.isPublished ? "text-cyan" : "text-yellow-500"}>
                    {blog.isPublished ? "Published" : "Draft"}
                  </span>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(blog)}
                  className="p-2 rounded-lg bg-cyan/10 text-cyan hover:bg-cyan/20 transition-colors"
                >
                  ✏️
                </button>
                <button
                  onClick={() => handleDelete(blog._id)}
                  className="p-2 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors"
                >
                  🗑️
                </button>
              </div>
            </div>
          ))}
          {!loading && blogs.length === 0 && (
            <p className="text-white/40 text-center py-8">No blogs yet. Create your first blog!</p>
          )}
        </div>
      </div>
    </div>
  );
}