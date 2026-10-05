// app/blog/[slug]/page.js — Server component with ISR + static params
import { notFound } from "next/navigation";
import BlogPostClient from "./BlogPostClient";
import { getBlogBySlug, getAllBlogSlugs } from "../../../lib/data";

export const revalidate = 60;

export async function generateStaticParams() {
  try {
    const slugs = await getAllBlogSlugs();
    return slugs.map((slug) => ({ slug }));
  } catch (e) {
    console.error("[blog] generateStaticParams failed:", e.message);
    return [];
  }
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const blog = await getBlogBySlug(slug);
  if (!blog) {
    return { title: "Post not found | The Technocrat" };
  }

  const rawDesc = blog.excerpt || (blog.content ? blog.content.replace(/<[^>]*>/g, "").substring(0, 160) : "");
  const description = rawDesc.length > 160 ? rawDesc.substring(0, 157) + "..." : rawDesc;
  const postUrl = `https://thetechnocrat.com/blog/${slug}`;

  return {
    title: `${blog.title} | The Technocrat`,
    description,
    keywords: blog.tags?.join(", "),
    alternates: { canonical: postUrl },
    openGraph: {
      title: blog.title,
      description,
      url: postUrl,
      type: "article",
      publishedTime: blog.createdAt ? new Date(blog.createdAt).toISOString() : undefined,
      authors: [blog.author || "The Technocrat"],
      tags: blog.tags,
      images: blog.coverImage ? [{ url: blog.coverImage }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: blog.title,
      description,
      creator: "@thetechnocrat",
      images: blog.coverImage ? [blog.coverImage] : undefined,
    },
  };
}

export default async function BlogPostPage({ params }) {
  const { slug } = await params;
  const blog = await getBlogBySlug(slug);
  if (!blog) notFound();
  return <BlogPostClient blog={blog} slug={slug} />;
}
