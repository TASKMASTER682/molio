// Server-side data fetching with ISR (time-based revalidation).
// Pages that import these become static/ISR instead of client-fetching from DB.

const API_URL = process.env.NEXT_PUBLIC_API_URL;
const REVALIDATE_SECONDS = 60;

async function apiFetch(path) {
  try {
    const res = await fetch(`${API_URL}${path}`, { next: { revalidate: REVALIDATE_SECONDS } });
    if (!res.ok) return null;
    return await res.json();
  } catch (e) {
    console.error(`[data] fetch failed: ${path} — ${e.message}`);
    return null;
  }
}

export async function getProjects() {
  const json = await apiFetch("/api/projects");
  return Array.isArray(json) ? json : Array.isArray(json?.data) ? json.data : [];
}

export async function getSkills() {
  const json = await apiFetch("/api/skills");
  return Array.isArray(json) ? json : Array.isArray(json?.data) ? json.data : [];
}

export async function getSettings() {
  const json = await apiFetch("/api/settings");
  const s = json?.data || json;
  if (!s || typeof s !== "object") return null;
  const { resumeUrl, ...rest } = s;
  return {
    ...rest,
    resumeUrl: resumeUrl ? `${API_URL}/api/settings/resume` : "",
  };
}

export async function getBlogs() {
  const json = await apiFetch("/api/blogs");
  return Array.isArray(json) ? json : Array.isArray(json?.data) ? json.data : [];
}

export async function getTestimonials() {
  const json = await apiFetch("/api/testimonials");
  return Array.isArray(json) ? json : Array.isArray(json?.data) ? json.data : [];
}

export async function getBlogBySlug(slug) {
  if (!slug) return null;
  const json = await apiFetch(`/api/blogs/${encodeURIComponent(slug)}`);
  if (!json) return null;
  return json.data || json;
}

export async function getAllBlogSlugs() {
  const blogs = await getBlogs();
  return blogs.map((b) => b.slug).filter(Boolean);
}

export async function getAllProjectIds() {
  const projects = await getProjects();
  return projects.map((p) => String(p._id)).filter(Boolean);
}

export async function getProjectById(id) {
  if (!id) return null;
  const projects = await getProjects();
  return projects.find((p) => String(p._id) === String(id)) || null;
}
