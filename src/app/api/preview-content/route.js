import { draftMode } from "next/headers";
import { fetchContent } from "../../../../scripts/cms/content.mjs";

export const dynamic = "force-dynamic";

export async function GET() {
  if (!(await draftMode()).isEnabled) {
    return Response.json({ error: "Preview mode is not enabled." }, { status: 401 });
  }

  const token = process.env.SANITY_API_READ_TOKEN;
  if (!token) {
    return Response.json({ error: "The preview token is not configured." }, { status: 503 });
  }

  try {
    const content = await fetchContent({ token, perspective: "drafts" });
    return Response.json(content, {
      headers: { "Cache-Control": "private, no-store" },
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 502 });
  }
}
