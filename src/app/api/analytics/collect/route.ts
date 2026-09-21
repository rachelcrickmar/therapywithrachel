import { analyticsEnvironment } from "@/lib/analytics/catalog";
import { geoFromHeaders } from "@/lib/analytics/geo";
import { parseIngestBody, recordAnalyticsEvent } from "@/lib/analytics/ingest";

export const runtime = "nodejs";

const hits = new Map<string, { count: number; reset: number }>();
const BOT =
  /bot|spider|crawl|slurp|facebookexternalhit|preview|lighthouse|pagespeed|headless|prerender|wget|curl|python-requests/i;

function rateLimit(key: string, limit = 90, windowMs = 60_000) {
  const now = Date.now();
  const current = hits.get(key);
  if (!current || now > current.reset) {
    hits.set(key, { count: 1, reset: now + windowMs });
    return true;
  }
  if (current.count >= limit) return false;
  current.count += 1;
  return true;
}

export async function POST(request: Request) {
  const ua = request.headers.get("user-agent") || "";
  if (!ua || BOT.test(ua)) {
    return new Response(null, { status: 204 });
  }

  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "unknown";
  if (!rateLimit(ip)) {
    return new Response(null, { status: 204 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid request." }, { status: 400 });
  }

  const event = parseIngestBody(body, analyticsEnvironment());
  if (!event) {
    return Response.json({ error: "Invalid event." }, { status: 400 });
  }
  const geo = geoFromHeaders(request.headers);
  event.country = geo.country;
  event.city = geo.city;

  try {
    await recordAnalyticsEvent(event);
  } catch (error) {
    console.error("analytics ingest failed", error);
    return new Response(null, { status: 204 });
  }

  return new Response(null, { status: 204 });
}
