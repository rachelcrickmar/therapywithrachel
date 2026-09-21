import { EVENT_BOOK_CALL, EVENT_PAGEVIEW, EVENT_PRESENCE } from "./catalog";
import { withAnalyticsDb } from "./db";
import { normalizePath } from "./path";

const UUID =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export type AnalyticsEventName =
  | typeof EVENT_PAGEVIEW
  | typeof EVENT_BOOK_CALL
  | typeof EVENT_PRESENCE;

export type IngestEvent = {
  name: AnalyticsEventName;
  path: string;
  location?: string | null;
  referrer?: string | null;
  visitorId?: string | null;
  sessionId?: string | null;
  environment: string;
  country?: string | null;
  city?: string | null;
};

function cleanId(value: unknown) {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  return UUID.test(trimmed) ? trimmed : null;
}

function cleanText(value: unknown, max: number) {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  if (!trimmed) return null;
  return trimmed.slice(0, max);
}

export function parseIngestBody(body: unknown, environment: string): IngestEvent | null {
  if (!body || typeof body !== "object") return null;
  const payload = body as Record<string, unknown>;
  const name = payload.name;
  if (name !== EVENT_PAGEVIEW && name !== EVENT_BOOK_CALL && name !== EVENT_PRESENCE) return null;
  const path = normalizePath(payload.path);
  if (!path) return null;
  const location = cleanText(payload.location, 80);
  if (name === EVENT_BOOK_CALL && !location) return null;
  return {
    name,
    path,
    location,
    referrer: cleanText(payload.referrer, 300),
    visitorId: cleanId(payload.visitorId),
    sessionId: cleanId(payload.sessionId),
    environment,
    country: null,
    city: null,
  };
}

export async function recordPresence(event: IngestEvent) {
  if (!event.visitorId) return;
  const sql = await withAnalyticsDb();
  await sql`
    INSERT INTO analytics_presence (visitor_id, environment, path, country, city, last_seen)
    VALUES (
      ${event.visitorId},
      ${event.environment},
      ${event.path},
      ${event.country || null},
      ${event.city || null},
      NOW()
    )
    ON CONFLICT (visitor_id, environment)
    DO UPDATE SET
      last_seen = NOW(),
      path = EXCLUDED.path,
      country = COALESCE(EXCLUDED.country, analytics_presence.country),
      city = COALESCE(EXCLUDED.city, analytics_presence.city)
  `;
}

export async function recordAnalyticsEvent(event: IngestEvent) {
  await recordPresence(event);
  if (event.name === EVENT_PRESENCE) return;

  const sql = await withAnalyticsDb();
  await sql`
    WITH inserted AS (
      INSERT INTO analytics_events (
        occurred_at, environment, name, path, location, referrer, visitor_id, session_id, country, city
      )
      VALUES (
        NOW(),
        ${event.environment},
        ${event.name},
        ${event.path},
        ${event.location || null},
        ${event.referrer || null},
        ${event.visitorId || null},
        ${event.sessionId || null},
        ${event.country || null},
        ${event.city || null}
      )
      RETURNING occurred_at, name, path, COALESCE(location, '') AS location
    )
    INSERT INTO analytics_daily (day, environment, name, path, location, count)
    SELECT (occurred_at AT TIME ZONE 'America/New_York')::date, ${event.environment}, name, path, location, 1
    FROM inserted
    ON CONFLICT (day, environment, name, path, location)
    DO UPDATE SET count = analytics_daily.count + 1
  `;
}
