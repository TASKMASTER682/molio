// app/blog/page.js
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function BlogPage() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchBlogs() {
      try {
        const res = await fetch(`${API_URL}/api/blogs`);
        const json = await res.json();
        setBlogs(Array.isArray(json) ? json : Array.isArray(json?.data) ? json.data : []);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    fetchBlogs();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-cyan text-xl font-playfair animate-pulse">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-32 pb-20 px-4 md:px-8 max-w-7xl mx-auto">
      <header className="mb-16 text-center reveal">
        <h1 className="text-4xl md:text-6xl font-playfair text-white mb-4">
          BLOG<span className="text-cyan">.</span>
        </h1>
        <p className="text-white/50 font-inter max-w-xl mx-auto">
          Thoughts on development, design, and everything in between.
        </p>
      </header>

      {blogs.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-white/30 font-inter text-lg">No blogs yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 reveal">
          {blogs.map((blog) => (
            <Link
              key={blog._id}
              href={`/blog/${blog.slug}`}
              className="block group reveal-item"
            >
              <article className="glass-card overflow-hidden h-full transition-all duration-300 group-hover:border-cyan/30 group-hover:translate-y-[-4px]">
                {blog.coverImage && (
                  <div className="aspect-video overflow-hidden">
                    <img
                      src={blog.coverImage}
                      alt={blog.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                )}
                <div className="p-5">
                  <div className="flex gap-2 mb-3 flex-wrap">
                    {blog.tags?.slice(0, 3).map((tag, i) => (
                      <span
                        key={i}
                        className="px-2 py-0.5 rounded-full bg-cyan/10 border border-cyan/20 text-[10px] text-cyan font-inter"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  <h2 className="text-xl font-playfair text-white mb-2 group-hover:text-cyan transition-colors line-clamp-2">
                    {blog.title}
                  </h2>
                  <p className="text-white/40 font-inter text-sm line-clamp-2 mb-4">
                    {blog.excerpt || (blog.content?.replace(/<[^>]*>/g, '') || '').slice(0, 150)}...
                  </p>
                  <div className="flex items-center justify-between text-xs text-white/30 font-inter">
                    <span>{blog.readTime} min read</span>
                    <span>{new Date(blog.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                  </div>
                </div>
              </article>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}