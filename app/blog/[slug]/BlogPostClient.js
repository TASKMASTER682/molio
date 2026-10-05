// app/blog/[slug]/BlogPostClient.js
"use client";

import { useEffect, useState, useRef } from "react";
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

export default function BlogPostClient({ blog, slug }) {
  const [scrollProgress, setScrollProgress] = useState(0);
  const contentRef = useRef(null);

  // DOMParser is browser-only — process custom blocks after hydration to keep SSR working
  useEffect(() => {
    const el = contentRef.current;
    if (el && blog?.content) {
      el.innerHTML = renderCustomBlocks(blog.content);
    }
  }, [blog]);

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
    if (!blog) return;
    const siteUrl = 'https://thetechnocrat.com';
    const postUrl = `${siteUrl}/blog/${slug}`;
    const rawDesc = blog.excerpt || (blog.content ? blog.content.replace(/<[^>]*>/g, '').substring(0, 160) : '');
    const description = rawDesc.length > 160 ? rawDesc.substring(0, 157) + '...' : rawDesc;
    const keywords = blog.tags ? blog.tags.join(', ') : 'blog, technocrat, tech';
    const author = blog.author || 'The Technocrat';
    const publishedTime = blog.createdAt ? new Date(blog.createdAt).toISOString() : new Date().toISOString();
    const modifiedTime = blog.updatedAt ? new Date(blog.updatedAt).toISOString() : publishedTime;

    document.title = `${blog.title} | The Technocrat`;

    const metaTags = [
      { name: 'description', content: description },
      { name: 'keywords', content: keywords },
      { name: 'author', content: author },
      { property: 'og:title', content: blog.title },
      { property: 'og:description', content: description },
      { property: 'og:url', content: postUrl },
      { property: 'og:type', content: 'article' },
      { property: 'article:author', content: author },
      { property: 'article:published_time', content: publishedTime },
      { property: 'article:modified_time', content: modifiedTime },
      { property: 'article:tag', content: keywords },
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:title', content: blog.title },
      { name: 'twitter:description', content: description },
      { name: 'twitter:creator', content: '@thetechnocrat' },
    ];

    if (blog.coverImage) {
      metaTags.push({ property: 'og:image', content: blog.coverImage });
      metaTags.push({ name: 'twitter:image', content: blog.coverImage });
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
  }, [blog, slug]);

  if (!blog) return null;

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
      <div className="fixed top-0 left-0 right-0 h-1 z-[1001] bg-transparent">
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
          ref={contentRef}
          dangerouslySetInnerHTML={{ __html: blog.content ?? "" }}
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