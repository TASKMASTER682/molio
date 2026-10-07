// app/work/[id]/page.js — Case study detail page, ISR
import { notFound } from "next/navigation";
import CaseStudyDetail from "./CaseStudyDetail";
import { getProjectById, getAllProjectIds, getProjects } from "../../../lib/data";

export const revalidate = 60;

export async function generateStaticParams() {
  try {
    const ids = await getAllProjectIds();
    return ids.map((id) => ({ id }));
  } catch (e) {
    console.error("[work] generateStaticParams failed:", e.message);
    return [];
  }
}

export async function generateMetadata({ params }) {
  const { id } = await params;
  const project = await getProjectById(id);
  if (!project) return { title: "Case study not found | The Technocrat" };

  const description = (project.problem || project.description || "")
    .replace(/<[^>]*>/g, "")
    .trim()
    .slice(0, 160);
  const url = `https://thetechnocrat.com/work/${id}`;

  return {
    title: `${project.title} — Case Study | The Technocrat`,
    description,
    alternates: { canonical: url },
    keywords: project.tags?.join(", "),
    openGraph: {
      title: `${project.title} — Case Study`,
      description,
      url,
      type: "article",
    },
  };
}

export default async function CaseStudyPage({ params }) {
  const { id } = await params;
  const project = await getProjectById(id);
  if (!project) notFound();

  const all = await getProjects();
  const others = all
    .filter((p) => String(p._id) !== String(id) && p.type !== "client")
    .slice(0, 3);

  return <CaseStudyDetail project={project} others={others} />;
}
