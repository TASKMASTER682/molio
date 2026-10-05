// POST /api/revalidate — on-demand ISR revalidation (called by backend on content changes)
import { revalidatePath } from "next/cache";

export async function POST(request) {
  const { searchParams } = new URL(request.url);
  const secret = searchParams.get("secret");

  if (!process.env.REVALIDATE_SECRET || secret !== process.env.REVALIDATE_SECRET) {
    return Response.json({ message: "Invalid secret" }, { status: 401 });
  }

  let paths = ["/"];
  try {
    const body = await request.json();
    if (Array.isArray(body?.paths) && body.paths.length) {
      paths = body.paths;
    }
  } catch {
    // no body → default path
  }

  for (const p of paths) {
    if (p.includes("[") && p.includes("]")) {
      revalidatePath(p, "page");
    } else {
      revalidatePath(p);
    }
  }

  return Response.json({ revalidated: true, paths });
}
