import { requireStudioUser } from "@/lib/analytics/auth";
import { parseGrain, parseRange } from "@/lib/analytics/catalog";
import { loadAnalyticsSummary } from "@/lib/analytics/summary";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET(request: Request) {
  const allowed = await requireStudioUser(request);
  if (!allowed) {
    return Response.json({ error: "Sign in to view analytics." }, { status: 401 });
  }

  const url = new URL(request.url);
  const range = parseRange(url.searchParams.get("range"));
  const grain = parseGrain(url.searchParams.get("grain"));
  const environment = url.searchParams.get("env") === "preview" ? "preview" : "production";

  try {
    const summary = await loadAnalyticsSummary(range, environment, grain);
    return Response.json(summary, {
      headers: {
        "cache-control": range === "today" ? "private, no-store" : "private, max-age=30",
      },
    });
  } catch (error) {
    console.error("analytics summary failed", error);
    return Response.json({ error: "Analytics unavailable." }, { status: 503 });
  }
}
