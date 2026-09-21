import { LIVE_WINDOW_SECONDS } from "./catalog";
import { analyticsConfigured, withAnalyticsDb } from "./db";
import { cityLabel, countryLabel } from "./geo";
import type { LiveSnapshot, NamedCount } from "./types";

function asNumber(value: unknown) {
  const count = Number(value);
  return Number.isFinite(count) ? count : 0;
}

function asRows<T extends Record<string, unknown>>(result: unknown): T[] {
  return Array.isArray(result) ? (result as T[]) : [];
}

function shareOf(count: number, total: number) {
  if (!total) return 0;
  return count / total;
}

function ranked(rows: { key: string; label: string; count: number }[], total: number): NamedCount[] {
  return rows
    .filter((row) => row.count > 0)
    .sort((a, b) => b.count - a.count || a.label.localeCompare(b.label))
    .map((row) => ({ ...row, share: shareOf(row.count, total) }));
}

const EMPTY_LIVE: LiveSnapshot = { liveVisitors: 0, countries: [], cities: [] };

export async function loadLiveSnapshot(environment: string): Promise<LiveSnapshot> {
  if (!analyticsConfigured()) return EMPTY_LIVE;
  const sql = await withAnalyticsDb();
  const [countResult, countryResult, cityResult] = await Promise.all([
    sql`
      SELECT COUNT(*)::int AS live
      FROM analytics_presence
      WHERE environment = ${environment}
        AND last_seen > NOW() - (${LIVE_WINDOW_SECONDS} * INTERVAL '1 second')
    `,
    sql`
      SELECT country, COUNT(*)::int AS count
      FROM analytics_presence
      WHERE environment = ${environment}
        AND last_seen > NOW() - (${LIVE_WINDOW_SECONDS} * INTERVAL '1 second')
        AND country IS NOT NULL
        AND country <> ''
      GROUP BY country
    `,
    sql`
      SELECT city, country, COUNT(*)::int AS count
      FROM analytics_presence
      WHERE environment = ${environment}
        AND last_seen > NOW() - (${LIVE_WINDOW_SECONDS} * INTERVAL '1 second')
        AND city IS NOT NULL
        AND city <> ''
      GROUP BY city, country
    `,
  ]);

  const liveVisitors = asNumber(asRows<{ live?: unknown }>(countResult)[0]?.live);
  return {
    liveVisitors,
    countries: ranked(
      asRows<{ country?: unknown; count?: unknown }>(countryResult).map((row) => {
        const country = String(row.country || "");
        return { key: country, label: countryLabel(country), count: asNumber(row.count) };
      }),
      liveVisitors,
    ),
    cities: ranked(
      asRows<{ city?: unknown; country?: unknown; count?: unknown }>(cityResult).map((row) => {
        const city = String(row.city || "");
        const country = String(row.country || "") || null;
        return {
          key: `${city}|${country || ""}`,
          label: cityLabel(city, country),
          count: asNumber(row.count),
        };
      }),
      liveVisitors,
    ),
  };
}
