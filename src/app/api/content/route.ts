
import { fetchContent } from "../../../../scripts/cms/content.mjs";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const content = await fetchContent({
      perspective: "published",
    });

    return Response.json(content, {
      headers: {
        "Cache-Control": "no-store",
      },
    });
  } catch (error) {
    console.error("Failed to fetch Sanity content:", error);

    return Response.json(
      { error: "Failed to fetch content" },
      { status: 502 }
    );
  }
}
