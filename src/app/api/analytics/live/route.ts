import { requireStudioUser } from "@/lib/analytics/auth";
import { loadLiveSnapshot } from "@/lib/analytics/live";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const allowed = await requireStudioUser(request);
  if (!allowed) {
    return Response.json({ error: "Sign in to view analytics." }, { status: 401 });
  }

  const environment = new URL(request.url).searchParams.get("env") === "preview" ? "preview" : "production";

  try {
    const live = await loadLiveSnapshot(environment);
    return Response.json(live, {
      headers: { "cache-control": "private, no-store" },
    });
  } catch (error) {
    console.error("analytics live failed", error);
    return Response.json({ error: "Analytics unavailable." }, { status: 503 });
  }
}
