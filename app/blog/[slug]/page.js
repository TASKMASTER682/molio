// app/blog/[slug]/page.js
"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";

function parseJsonSafe(str) {
  if (!str) return null;
  try {
    let clean = str.trim();
    clean = clean.replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&apos;/g, "'").replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&');
    clean = clean.replace(/^\{/, '').replace(/\}$/, '');
    return JSON.parse('{' + clean + '}');
  } catch (e) {
    console.log('Parse error:', str, e);
    return null;
  }
}

function renderStatsBlock(items) {
  const itemArray = Array.isArray(items)
    ? items
    : (typeof items === 'string' ? items.split(',').map((val, i) => ({ value: val, label: '', description: '' })) : []);
  const visibleItems = itemArray.filter(item => item && (item.value || item.label || item.description));
  if (!visibleItems.length) return '';
  return visibleItems.map(item => `
    <div class="stat-item">
      <div class="stat-value">${item.value || ''}</div>
      <div class="stat-label">${item.label || ''}</div>
      ${item.description ? `<div class="stat-description">${item.description}</div>` : ''}
    </div>
  `).join('');
}

function renderQuoteBlock(text, author, style = 'default') {
  const styleClass = style !== 'default' ? `quote-${style}` : '';
  const icon = style === 'glow' ? '<span class="quote-icon">"</span>' : '';
  return `<blockquote class="pull-quote ${styleClass}">${icon}<p>${text || ''}</p>${author ? `<cite>— ${author}</cite>` : ''}</blockquote>`;
}

function renderTechGridBlock(items) {
  const itemArray = Array.isArray(items) ? items : (typeof items === 'string' ? items.split(',').map((val, i) => ({ icon: '', title: val, description: '' })) : []);
  if (!itemArray.length) return '';
  return itemArray.map(item => `<div class="tech-card"><span class="tech-icon">${item.icon || ''}</span><h4 class="tech-title">${item.title || ''}</h4><p class="tech-desc">${item.description || ''}</p></div>`).join('');
}

function renderCaseStudyBlock(title, body, verdict, verdictLabel) {
  return `<div class="case-study-card"><h3 class="case-title">${title || ''}</h3><p class="case-body">${body || ''}</p>${verdict ? `<div class="case-verdict"><span class="verdict-label">${verdictLabel || 'Verdict'}</span><span class="verdict-value verdict-${verdict.toLowerCase()}">${verdict}</span></div>` : ''}</div>`;
}

function renderHighlightBlock(content, style = 'info') {
  return `<div class="highlight-box highlight-${style}"><p>${content || ''}</p></div>`;
}

function renderWorkflowBlock(steps, layout = 'horizontal') {
  const stepArray = Array.isArray(steps) ? steps : (typeof steps === 'string' ? steps.split(',') : []);
  if (!stepArray.length) return '';

  const layoutClass = layout === 'vertical' ? 'workflow-vertical' : 'workflow-horizontal';
  return `<div class="workflow-block ${layoutClass}">${stepArray.map((step, index) => `<div class="workflow-step"><div class="step-number">${index + 1}</div><div class="step-label">${step}</div></div>${index < stepArray.length - 1 ? '<div class="step-arrow">→</div>' : ''}`).join('')}</div>`;
}

function parseAttrs(attrString) {
  const attrs = {};
  if (!attrString) return attrs;
  const regex = /(\w+)="([^"]*)"/g;
  let match;
  while ((match = regex.exec(attrString)) !== null) {
    const key = match[1];
    let value = match[2];
    try {
      attrs[key] = JSON.parse(value);
    } catch {
      if (value.includes(",")) {
        attrs[key] = value.split(",").map(v => v.trim());
      } else {
        attrs[key] = value;
      }
    }
  }
  return attrs;
}

function maybeParseValue(value) {
  if (value === undefined || value === null) return value;
  try {
    return JSON.parse(value);
  } catch {
    if (value.includes(",")) {
      return value.split(",").map(v => v.trim());
    }
    return value;
  }
}

function renderCustomBlocks(html) {
  if (!html) return html;
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');
  console.log('🔍 renderCustomBlocks INPUT:', html.substring(0, 500));
  const blockParsers = {
    statsBlock: (attrs) => { if (attrs.items) return `<div class="stats-row">${renderStatsBlock(attrs.items)}</div>`; return null; },
    quoteBlock: (attrs) => { if (attrs.text) return renderQuoteBlock(attrs.text, attrs.author, attrs.style); return null; },
    highlightBlock: (attrs) => { if (attrs.content) return renderHighlightBlock(attrs.content, attrs.style); return null; },
    caseStudyBlock: (attrs) => { if (attrs.title) return renderCaseStudyBlock(attrs.title, attrs.body, attrs.verdict, attrs.verdictLabel); return null; },
    workflowBlock: (attrs) => { if (attrs.steps) return renderWorkflowBlock(attrs.steps, attrs.layout); return null; },
    techGridBlock: (attrs) => { if (attrs.items) return `<div class="tech-grid">${renderTechGridBlock(attrs.items)}</div>`; return null; },
  };
  const hydrateAttrs = (node, blockName) => {
    const attrs = {};

    if (node.dataset.attrs) {
      try {
        Object.assign(attrs, JSON.parse(node.dataset.attrs));
      } catch (error) {
        console.warn('Unable to parse data-attrs for', blockName, error);
      }
    }

    for (const [key, value] of Object.entries(node.dataset)) {
      if (key === 'attrs') continue;
      attrs[key] = maybeParseValue(value);
    }

    if (node.tagName.toLowerCase() === blockName) {
      const attrString = Array.from(node.attributes)
        .filter(attr => attr.name !== 'data-attrs')
        .map(attr => `${attr.name}="${attr.value}"`)
        .join(' ');
      Object.assign(attrs, parseAttrs(attrString));
    }

    return attrs;
  };

  const replaceNode = (node, replacementHtml) => {
    if (!replacementHtml) return;
    const fragment = parser.parseFromString(replacementHtml, 'text/html').body;
    const target = node.parentElement && node.parentElement.tagName === 'P' && node.parentElement.childNodes.length === 1
      ? node.parentElement
      : node;

    const children = Array.from(fragment.childNodes);
    if (!children.length) {
      target.remove();
      return;
    }

    target.replaceWith(...children);
  };

  Object.keys(blockParsers).forEach(blockName => {
    const selector = `${blockName}, [data-type="${blockName}"]`;
    const nodes = Array.from(doc.body.querySelectorAll(selector));

    nodes.forEach(node => {
      const attrs = hydrateAttrs(node, blockName);
      const rendered = blockParsers[blockName](attrs);
      replaceNode(node, rendered);
    });
  });

  return doc.body.innerHTML;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function BlogPostPage() {
  const params = useParams();
  const slug = params.slug;
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [debugHtml, setDebugHtml] = useState(null);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = (window.scrollY / totalHeight) * 100;
      setScrollProgress(Math.min(progress, 100));
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    async function fetchBlog() {
      try {
        const res = await fetch(`${API_URL}/api/blogs/${slug}`);
        if (!res.ok) {
          throw new Error("Blog not found");
        }
        const json = await res.json();
        const blogData = json.data || json;
        setBlog(blogData);
        
        if (blogData) {
          const siteUrl = 'https://thetechnocrat.com';
          const postUrl = `${siteUrl}/blog/${slug}`;
          const rawDesc = blogData.excerpt || (blogData.content ? blogData.content.replace(/<[^>]*>/g, '').substring(0, 160) : '');
          const description = rawDesc.length > 160 ? rawDesc.substring(0, 157) + '...' : rawDesc;
          const keywords = blogData.tags ? blogData.tags.join(', ') : 'blog, technocrat, tech';
          const author = blogData.author || 'The Technocrat';
          const publishedTime = blogData.createdAt ? new Date(blogData.createdAt).toISOString() : new Date().toISOString();
          const modifiedTime = blogData.updatedAt ? new Date(blogData.updatedAt).toISOString() : publishedTime;
          
          document.title = `${blogData.title} | The Technocrat`;
          
          const metaTags = [
            { name: 'description', content: description },
            { name: 'keywords', content: keywords },
            { name: 'author', content: author },
            { property: 'og:title', content: blogData.title },
            { property: 'og:description', content: description },
            { property: 'og:url', content: postUrl },
            { property: 'og:type', content: 'article' },
            { property: 'article:author', content: author },
            { property: 'article:published_time', content: publishedTime },
            { property: 'article:modified_time', content: modifiedTime },
            { property: 'article:tag', content: keywords },
            { name: 'twitter:card', content: 'summary_large_image' },
            { name: 'twitter:title', content: blogData.title },
            { name: 'twitter:description', content: description },
            { name: 'twitter:creator', content: '@thetechnocrat' },
          ];
          
          if (blogData.coverImage) {
            metaTags.push({ property: 'og:image', content: blogData.coverImage });
            metaTags.push({ name: 'twitter:image', content: blogData.coverImage });
          }
          
          metaTags.forEach(tag => {
            let el;
            if (tag.property) {
              el = document.querySelector(`meta[property="${tag.property}"]`);
              if (!el) {
                el = document.createElement('meta');
                el.setAttribute('property', tag.property);
                document.head.appendChild(el);
              }
            } else {
              el = document.querySelector(`meta[name="${tag.name}"]`);
              if (!el) {
                el = document.createElement('meta');
                el.setAttribute('name', tag.name);
                document.head.appendChild(el);
              }
            }
            el.setAttribute('content', tag.content);
          });
          
          let canonical = document.querySelector('link[rel="canonical"]');
          if (!canonical) {
            canonical = document.createElement('link');
            canonical.setAttribute('rel', 'canonical');
            document.head.appendChild(canonical);
          }
          canonical.setAttribute('href', postUrl);
        }
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    }
    if (slug) fetchBlog();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-full border-2 border-cyan border-t-transparent animate-spin"></div>
          <p className="text-cyan font-playfair text-lg">Loading blog...</p>
        </div>
      </div>
    );
  }

  if (error || !blog) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-4">
        <div className="text-center">
          <h1 className="text-6xl font-playfair font-bold bg-gradient-to-r from-cyan to-neon-purple bg-clip-text text-transparent mb-4">404</h1>
          <p className="text-white/50 font-inter mb-8">Blog post not found</p>
          <Link href="/blog" className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-cyan to-neon-purple text-black font-bold rounded-lg hover:shadow-lg hover:shadow-cyan/50 transition-all">
            ← Back to Blog
          </Link>
        </div>
      </div>
    );
  }

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": blog.title,
    "description": blog.excerpt || (blog.content ? blog.content.substring(0, 160) : ''),
    "author": {
      "@type": "Person",
      "name": blog.author || "The Technocrat",
      "url": "/"
    },
    "datePublished": blog.createdAt,
    "dateModified": blog.updatedAt || blog.createdAt,
    "image": blog.coverImage || "",
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="fixed top-0 left-0 right-0 h-1 z-50 bg-transparent">
        <div 
          className="h-full bg-gradient-to-r from-cyan to-neon-purple shadow-[0_0_10px_rgba(0,245,255,0.5)]"
          style={{ width: `${scrollProgress}%`, transition: 'width 0.1s ease-out' }}
        />
      </div>
      <article className="blog-article min-h-screen pt-32 pb-20 px-4 md:px-8">
      <div className="max-w-3xl mx-auto relative z-10">
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 text-cyan font-inter text-sm mb-8 hover:text-cyan/80 transition-colors"
        >
          ← Back to Blog
        </Link>

        <header className="blog-header">
          <div className="blog-tags">
            {blog.tags?.map((tag, i) => (
              <span key={i} className="blog-tag">
                {tag}
              </span>
            ))}
          </div>
          
          <h1>{blog.title}</h1>

          <div className="blog-meta">
            <span className="blog-meta-item">✍️ {blog.author || 'The Technocrat'}</span>
            <span>•</span>
            <span className="blog-meta-item">📖 {blog.readTime || 5} min read</span>
            <span>•</span>
            <span className="blog-meta-item">📅 {new Date(blog.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
          </div>
        </header>

        {blog.coverImage && (
          <div className="blog-cover-image">
            <img
              src={blog.coverImage}
              alt={blog.title}
            />
          </div>
        )}

        <div
          className="prose prose-invert max-w-none"
          dangerouslySetInnerHTML={{ __html: renderCustomBlocks(blog.content) }}
        />

        <div className="blog-end">
          <svg width="200" height="40" viewBox="0 0 200 40" className="blog-divider">
            <defs>
              <linearGradient id="dividerGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="transparent" />
                <stop offset="50%" stopColor="#00f5ff" />
                <stop offset="100%" stopColor="transparent" />
              </linearGradient>
            </defs>
            <path
              d="M0 20 L70 20 Q85 5 100 20 Q115 35 130 20 L200 20"
              fill="none"
              stroke="url(#dividerGrad)"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
            <circle cx="100" cy="20" r="3" fill="#7b2fff" />
            <circle cx="100" cy="20" r="1.5" fill="#00f5ff" />
          </svg>
        </div>

        <div className="blog-footer-actions">
          <p className="text-white/60 font-inter text-sm mb-4">Thanks for reading!</p>
          <div className="flex gap-4">
            <Link href="/blog" className="blog-footer-btn">
              ← All Blogs
            </Link>
            <Link href="/" className="blog-footer-btn">
              Home ↗
            </Link>
          </div>
        </div>
      </div>
    </article>
    </>
  );
}