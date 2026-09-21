import { client } from "@/sanity/lib/client";
import {
  ANALYTICS_TZ,
  BOOK_COUNTRY_US,
  EVENT_BOOK_CALL,
  EVENT_PAGEVIEW,
  type AnalyticsGrain,
  type AnalyticsRange,
  blogPath,
  bookLocationLabel,
  caseStudySlugFromPath,
  isCaseStudyPath,
  SITE_PAGE_LABELS,
} from "./catalog";
import { analyticsConfigured, withAnalyticsDb } from "./db";
import { cityLabel, countryLabel } from "./geo";
import { loadLiveSnapshot } from "./live";
import {
  hourFromPeriodKey,
  hourInZone,
  latestHourThrough,
  periodFromHourBucket,
  ymdInZone,
} from "./time";
import type { AnalyticsSummary, NamedCount } from "./types";

function asNumber(value: unknown) {
  const count = Number(value);
  return Number.isFinite(count) ? count : 0;
}

function asRows<T extends Record<string, unknown>>(result: unknown): T[] {
  return Array.isArray(result) ? (result as T[]) : [];
}

function firstRow<T extends Record<string, unknown>>(result: unknown): T | undefined {
  return asRows<T>(result)[0];
}

function shiftYmd(ymd: string, days: number) {
  const [year, month, day] = ymd.split("-").map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));
  date.setUTCDate(date.getUTCDate() + days);
  return date.toISOString().slice(0, 10);
}

function weekStart(ymd: string) {
  const [year, month, day] = ymd.split("-").map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));
  const dow = date.getUTCDay();
  date.setUTCDate(date.getUTCDate() + (dow === 0 ? -6 : 1 - dow));
  return date.toISOString().slice(0, 10);
}

function monthStart(ymd: string) {
  return `${ymd.slice(0, 7)}-01`;
}

function addMonths(ymd: string, count: number) {
  const [year, month] = ymd.split("-").map(Number);
  const date = new Date(Date.UTC(year, month - 1 + count, 1));
  return date.toISOString().slice(0, 10);
}

function eachHour(ymd: string) {
  return Array.from({ length: 24 }, (_, hour) => `${ymd}T${String(hour).padStart(2, "0")}`);
}

function eachPeriod(from: string, toExclusive: string, grain: AnalyticsGrain) {
  if (grain === "hour") {
    return eachHour(from);
  }
  if (grain === "month") {
    const periods: string[] = [];
    const last = monthStart(shiftYmd(toExclusive, -1));
    for (let cursor = monthStart(from); cursor <= last; cursor = addMonths(cursor, 1)) {
      periods.push(cursor);
    }
    return periods;
  }
  if (grain === "week") {
    const periods: string[] = [];
    const last = weekStart(shiftYmd(toExclusive, -1));
    for (let cursor = weekStart(from); cursor <= last; cursor = shiftYmd(cursor, 7)) {
      periods.push(cursor);
    }
    return periods;
  }
  return eachDay(from, toExclusive);
}

function eachDay(from: string, toExclusive: string) {
  const days: string[] = [];
  for (let cursor = from; cursor < toExclusive; cursor = shiftYmd(cursor, 1)) {
    days.push(cursor);
  }
  return days;
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

async function caseStudyTitles() {
  try {
    if (!client) {
      return { titles: new Map<string, string>(), paths: new Map<string, string>() };
    }
    const rows = await client.fetch<{ title?: string | null; slug?: string | null }[]>(
      `*[_type == "post" && defined(slug.current)]{ title, "slug": slug.current }`,
    );
    const titles = new Map<string, string>();
    const paths = new Map<string, string>();
    for (const row of rows || []) {
      const slug = row.slug?.trim();
      if (!slug) continue;
      const title = row.title?.trim() || slug;
      titles.set(slug, title);
      paths.set(blogPath(slug), title);
    }
    return { titles, paths };
  } catch {
    return { titles: new Map<string, string>(), paths: new Map<string, string>() };
  }
}

function labelForPath(
  path: string,
  studies: { titles: Map<string, string>; paths: Map<string, string> },
) {
  if (SITE_PAGE_LABELS[path]) return SITE_PAGE_LABELS[path];
  if (studies.paths.has(path)) return studies.paths.get(path) || path;
  const slug = caseStudySlugFromPath(path);
  if (slug && studies.titles.has(slug)) return studies.titles.get(slug) || path;
  return path;
}

export async function loadAnalyticsSummary(
  range: AnalyticsRange,
  environment = "production",
  grain: AnalyticsGrain = "day",
): Promise<AnalyticsSummary> {
  const now = new Date();
  const today = ymdInZone(now, ANALYTICS_TZ);
  const isToday = range === "today";
  const resolvedGrain: AnalyticsGrain = isToday ? "hour" : grain === "hour" ? "day" : grain;
  const currentHour = hourInZone(now, ANALYTICS_TZ);
  const end = shiftYmd(today, 1);
  const start = isToday ? today : shiftYmd(end, -range);
  const previousStart = isToday ? shiftYmd(today, -1) : shiftYmd(start, -range);
  const emptyTrend = eachPeriod(start, end, resolvedGrain).map((period) => ({
    period,
    pageviews: 0,
    visitors: 0,
    bookClicks: 0,
    bookClicksUs: 0,
  }));
  const empty = (
    totals = {
      pageviews: 0,
      visitors: 0,
      bookClicks: 0,
      bookVisitors: 0,
      bookClicksUs: 0,
      bookVisitorsUs: 0,
    },
  ): AnalyticsSummary => ({
    configured: analyticsConfigured(),
    environment,
    range,
    grain: resolvedGrain,
    from: start,
    to: today,
    liveVisitors: 0,
    liveCountries: [],
    liveCities: [],
    totals,
    previous: { pageviews: 0, visitors: 0, bookClicks: 0, bookClicksUs: 0 },
    trend: emptyTrend,
    pages: [],
    caseStudies: [],
    bookButtons: [],
    bookPages: [],
    bookCountries: [],
    bookCities: [],
    bookButtonsUs: [],
    bookPagesUs: [],
    bookCitiesUs: [],
  });

  if (!analyticsConfigured()) return empty();

  // Neon sessions are GMT. `date AT TIME ZONE` casts in that session TZ, so
  // "today" ended at 4pm ET. Interpret naive midnight as America/New_York.
  const sql = await withAnalyticsDb();
  const [
    currentTotals,
    previousTotals,
    uniqueNow,
    uniquePrev,
    uniqueBook,
    periodRows,
    visitorPeriodRows,
    pageRows,
    bookLocationRows,
    bookPathRows,
    bookCountryRows,
    bookCityRows,
    usBookNow,
    usBookPrev,
    usPeriodRows,
    usLocationRows,
    usPathRows,
    studies,
    live,
  ] = await Promise.all([
    sql`
      SELECT
        COALESCE(SUM(count) FILTER (WHERE name = ${EVENT_PAGEVIEW}), 0) AS pageviews,
        COALESCE(SUM(count) FILTER (WHERE name = ${EVENT_BOOK_CALL}), 0) AS book_clicks
      FROM analytics_daily
      WHERE environment = ${environment}
        AND day >= ${start}::date
        AND day < ${end}::date
    `,
    sql`
      SELECT
        COALESCE(SUM(count) FILTER (WHERE name = ${EVENT_PAGEVIEW}), 0) AS pageviews,
        COALESCE(SUM(count) FILTER (WHERE name = ${EVENT_BOOK_CALL}), 0) AS book_clicks
      FROM analytics_daily
      WHERE environment = ${environment}
        AND day >= ${previousStart}::date
        AND day < ${start}::date
    `,
    sql`
      SELECT COUNT(DISTINCT visitor_id)::int AS visitors
      FROM analytics_events
      WHERE environment = ${environment}
        AND name = ${EVENT_PAGEVIEW}
        AND occurred_at >= timezone('America/New_York', (${start}::text || ' 00:00:00')::timestamp)
        AND occurred_at < timezone('America/New_York', (${end}::text || ' 00:00:00')::timestamp)
        AND visitor_id IS NOT NULL
    `,
    sql`
      SELECT COUNT(DISTINCT visitor_id)::int AS visitors
      FROM analytics_events
      WHERE environment = ${environment}
        AND name = ${EVENT_PAGEVIEW}
        AND occurred_at >= timezone('America/New_York', (${previousStart}::text || ' 00:00:00')::timestamp)
        AND occurred_at < timezone('America/New_York', (${start}::text || ' 00:00:00')::timestamp)
        AND visitor_id IS NOT NULL
    `,
    sql`
      SELECT COUNT(DISTINCT visitor_id)::int AS visitors
      FROM analytics_events
      WHERE environment = ${environment}
        AND name = ${EVENT_BOOK_CALL}
        AND occurred_at >= timezone('America/New_York', (${start}::text || ' 00:00:00')::timestamp)
        AND occurred_at < timezone('America/New_York', (${end}::text || ' 00:00:00')::timestamp)
        AND visitor_id IS NOT NULL
    `,
    resolvedGrain === "hour"
      ? sql`
          SELECT
            to_char(occurred_at AT TIME ZONE 'America/New_York', 'YYYYMMDDHH24') AS bucket,
            COUNT(*) FILTER (WHERE name = ${EVENT_PAGEVIEW})::int AS pageviews,
            COUNT(*) FILTER (WHERE name = ${EVENT_BOOK_CALL})::int AS book_clicks
          FROM analytics_events
          WHERE environment = ${environment}
            AND occurred_at >= timezone('America/New_York', (${start}::text || ' 00:00:00')::timestamp)
            AND occurred_at < timezone('America/New_York', (${end}::text || ' 00:00:00')::timestamp)
            AND (name = ${EVENT_PAGEVIEW} OR name = ${EVENT_BOOK_CALL})
          GROUP BY 1
          ORDER BY 1
        `
      : sql`
          SELECT
            to_char(date_trunc(${resolvedGrain}, day::timestamp), 'YYYY-MM-DD') AS period,
            COALESCE(SUM(count) FILTER (WHERE name = ${EVENT_PAGEVIEW}), 0) AS pageviews,
            COALESCE(SUM(count) FILTER (WHERE name = ${EVENT_BOOK_CALL}), 0) AS book_clicks
          FROM analytics_daily
          WHERE environment = ${environment}
            AND day >= ${start}::date
            AND day < ${end}::date
          GROUP BY 1
          ORDER BY 1
        `,
    resolvedGrain === "hour"
      ? sql`
          SELECT
            to_char(occurred_at AT TIME ZONE 'America/New_York', 'YYYYMMDDHH24') AS bucket,
            COUNT(DISTINCT visitor_id)::int AS visitors
          FROM analytics_events
          WHERE environment = ${environment}
            AND name = ${EVENT_PAGEVIEW}
            AND occurred_at >= timezone('America/New_York', (${start}::text || ' 00:00:00')::timestamp)
            AND occurred_at < timezone('America/New_York', (${end}::text || ' 00:00:00')::timestamp)
            AND visitor_id IS NOT NULL
          GROUP BY 1
        `
      : sql`
          SELECT
            to_char(
              date_trunc(${resolvedGrain}, (occurred_at AT TIME ZONE 'America/New_York')::timestamp),
              'YYYY-MM-DD'
            ) AS period,
            COUNT(DISTINCT visitor_id)::int AS visitors
          FROM analytics_events
          WHERE environment = ${environment}
            AND name = ${EVENT_PAGEVIEW}
            AND occurred_at >= timezone('America/New_York', (${start}::text || ' 00:00:00')::timestamp)
            AND occurred_at < timezone('America/New_York', (${end}::text || ' 00:00:00')::timestamp)
            AND visitor_id IS NOT NULL
          GROUP BY 1
        `,
    sql`
      SELECT path, SUM(count)::int AS count
      FROM analytics_daily
      WHERE environment = ${environment}
        AND name = ${EVENT_PAGEVIEW}
        AND day >= ${start}::date
        AND day < ${end}::date
      GROUP BY path
    `,
    sql`
      SELECT location, SUM(count)::int AS count
      FROM analytics_daily
      WHERE environment = ${environment}
        AND name = ${EVENT_BOOK_CALL}
        AND day >= ${start}::date
        AND day < ${end}::date
      GROUP BY location
    `,
    sql`
      SELECT path, SUM(count)::int AS count
      FROM analytics_daily
      WHERE environment = ${environment}
        AND name = ${EVENT_BOOK_CALL}
        AND day >= ${start}::date
        AND day < ${end}::date
      GROUP BY path
    `,
    sql`
      SELECT country, COUNT(*)::int AS count
      FROM analytics_events
      WHERE environment = ${environment}
        AND name = ${EVENT_BOOK_CALL}
        AND occurred_at >= timezone('America/New_York', (${start}::text || ' 00:00:00')::timestamp)
        AND occurred_at < timezone('America/New_York', (${end}::text || ' 00:00:00')::timestamp)
        AND country IS NOT NULL
        AND country <> ''
      GROUP BY country
    `,
    sql`
      SELECT city, country, COUNT(*)::int AS count
      FROM analytics_events
      WHERE environment = ${environment}
        AND name = ${EVENT_BOOK_CALL}
        AND occurred_at >= timezone('America/New_York', (${start}::text || ' 00:00:00')::timestamp)
        AND occurred_at < timezone('America/New_York', (${end}::text || ' 00:00:00')::timestamp)
        AND city IS NOT NULL
        AND city <> ''
      GROUP BY city, country
    `,
    sql`
      SELECT
        COUNT(*)::int AS book_clicks,
        COUNT(DISTINCT visitor_id)::int AS book_visitors
      FROM analytics_events
      WHERE environment = ${environment}
        AND name = ${EVENT_BOOK_CALL}
        AND country = ${BOOK_COUNTRY_US}
        AND occurred_at >= timezone('America/New_York', (${start}::text || ' 00:00:00')::timestamp)
        AND occurred_at < timezone('America/New_York', (${end}::text || ' 00:00:00')::timestamp)
    `,
    sql`
      SELECT COUNT(*)::int AS book_clicks
      FROM analytics_events
      WHERE environment = ${environment}
        AND name = ${EVENT_BOOK_CALL}
        AND country = ${BOOK_COUNTRY_US}
        AND occurred_at >= timezone('America/New_York', (${previousStart}::text || ' 00:00:00')::timestamp)
        AND occurred_at < timezone('America/New_York', (${start}::text || ' 00:00:00')::timestamp)
    `,
    resolvedGrain === "hour"
      ? sql`
          SELECT
            to_char(occurred_at AT TIME ZONE 'America/New_York', 'YYYYMMDDHH24') AS bucket,
            COUNT(*)::int AS book_clicks
          FROM analytics_events
          WHERE environment = ${environment}
            AND name = ${EVENT_BOOK_CALL}
            AND country = ${BOOK_COUNTRY_US}
            AND occurred_at >= timezone('America/New_York', (${start}::text || ' 00:00:00')::timestamp)
            AND occurred_at < timezone('America/New_York', (${end}::text || ' 00:00:00')::timestamp)
          GROUP BY 1
        `
      : sql`
          SELECT
            to_char(
              date_trunc(${resolvedGrain}, (occurred_at AT TIME ZONE 'America/New_York')::timestamp),
              'YYYY-MM-DD'
            ) AS period,
            COUNT(*)::int AS book_clicks
          FROM analytics_events
          WHERE environment = ${environment}
            AND name = ${EVENT_BOOK_CALL}
            AND country = ${BOOK_COUNTRY_US}
            AND occurred_at >= timezone('America/New_York', (${start}::text || ' 00:00:00')::timestamp)
            AND occurred_at < timezone('America/New_York', (${end}::text || ' 00:00:00')::timestamp)
          GROUP BY 1
        `,
    sql`
      SELECT COALESCE(location, '') AS location, COUNT(*)::int AS count
      FROM analytics_events
      WHERE environment = ${environment}
        AND name = ${EVENT_BOOK_CALL}
        AND country = ${BOOK_COUNTRY_US}
        AND occurred_at >= timezone('America/New_York', (${start}::text || ' 00:00:00')::timestamp)
        AND occurred_at < timezone('America/New_York', (${end}::text || ' 00:00:00')::timestamp)
      GROUP BY 1
    `,
    sql`
      SELECT path, COUNT(*)::int AS count
      FROM analytics_events
      WHERE environment = ${environment}
        AND name = ${EVENT_BOOK_CALL}
        AND country = ${BOOK_COUNTRY_US}
        AND occurred_at >= timezone('America/New_York', (${start}::text || ' 00:00:00')::timestamp)
        AND occurred_at < timezone('America/New_York', (${end}::text || ' 00:00:00')::timestamp)
      GROUP BY path
    `,
    caseStudyTitles(),
    loadLiveSnapshot(environment),
  ]);

  const totals = firstRow<{ pageviews?: unknown; book_clicks?: unknown }>(currentTotals);
  const prev = firstRow<{ pageviews?: unknown; book_clicks?: unknown }>(previousTotals);
  const pageviews = asNumber(totals?.pageviews);
  const bookClicks = asNumber(totals?.book_clicks);
  const bookClicksUs = asNumber(firstRow<{ book_clicks?: unknown }>(usBookNow)?.book_clicks);
  const bookVisitorsUs = asNumber(firstRow<{ book_visitors?: unknown }>(usBookNow)?.book_visitors);
  const visitors = asNumber(firstRow<{ visitors?: unknown }>(uniqueNow)?.visitors);
  const bookVisitors = asNumber(firstRow<{ visitors?: unknown }>(uniqueBook)?.visitors);
  const paths = asRows<{ path?: unknown; count?: unknown }>(pageRows);
  const locations = asRows<{ location?: unknown; count?: unknown }>(bookLocationRows);
  const bookingPaths = asRows<{ path?: unknown; count?: unknown }>(bookPathRows);
  const usLocations = asRows<{ location?: unknown; count?: unknown }>(usLocationRows);
  const usBookingPaths = asRows<{ path?: unknown; count?: unknown }>(usPathRows);
  const periodKey = (row: {
    period?: unknown;
    bucket?: unknown;
  }) =>
    resolvedGrain === "hour"
      ? periodFromHourBucket(row.bucket)
      : String(row.period).slice(0, 10);

  const byPeriod = new Map<
    string,
    { pageviews: number; visitors: number; bookClicks: number; bookClicksUs: number }
  >();
  for (const row of asRows<{
    period?: unknown;
    bucket?: unknown;
    pageviews?: unknown;
    book_clicks?: unknown;
  }>(periodRows)) {
    const period = periodKey(row);
    if (!period) continue;
    byPeriod.set(period, {
      pageviews: asNumber(row.pageviews),
      visitors: 0,
      bookClicks: asNumber(row.book_clicks),
      bookClicksUs: 0,
    });
  }
  for (const row of asRows<{
    period?: unknown;
    bucket?: unknown;
    visitors?: unknown;
  }>(visitorPeriodRows)) {
    const period = periodKey(row);
    if (!period) continue;
    const current = byPeriod.get(period) || {
      pageviews: 0,
      visitors: 0,
      bookClicks: 0,
      bookClicksUs: 0,
    };
    current.visitors = asNumber(row.visitors);
    byPeriod.set(period, current);
  }
  for (const row of asRows<{
    period?: unknown;
    bucket?: unknown;
    book_clicks?: unknown;
  }>(usPeriodRows)) {
    const period = periodKey(row);
    if (!period) continue;
    const current = byPeriod.get(period) || {
      pageviews: 0,
      visitors: 0,
      bookClicks: 0,
      bookClicksUs: 0,
    };
    current.bookClicksUs = asNumber(row.book_clicks);
    byPeriod.set(period, current);
  }

  const elapsedThrough = isToday
    ? latestHourThrough(currentHour, byPeriod.keys(), today)
    : 23;

  const pages = ranked(
    paths.map((row) => {
      const path = String(row.path || "");
      return { key: path, label: labelForPath(path, studies), count: asNumber(row.count) };
    }),
    pageviews,
  );

  const caseStudies = ranked(
    paths
      .filter((row) => isCaseStudyPath(String(row.path || "")))
      .map((row) => {
        const path = String(row.path || "");
        return { key: path, label: labelForPath(path, studies), count: asNumber(row.count) };
      }),
    pageviews,
  );

  return {
    configured: true,
    environment,
    range,
    grain: resolvedGrain,
    from: start,
    to: today,
    liveVisitors: live.liveVisitors,
    liveCountries: live.countries,
    liveCities: live.cities,
    totals: { pageviews, visitors, bookClicks, bookVisitors, bookClicksUs, bookVisitorsUs },
    previous: {
      pageviews: asNumber(prev?.pageviews),
      visitors: asNumber(firstRow<{ visitors?: unknown }>(uniquePrev)?.visitors),
      bookClicks: asNumber(prev?.book_clicks),
      bookClicksUs: asNumber(firstRow<{ book_clicks?: unknown }>(usBookPrev)?.book_clicks),
    },
    trend: eachPeriod(start, end, resolvedGrain).map((period) => {
      const future =
        isToday &&
        resolvedGrain === "hour" &&
        hourFromPeriodKey(period) > elapsedThrough;
      if (future) {
        return {
          period,
          pageviews: null,
          visitors: null,
          bookClicks: null,
          bookClicksUs: null,
        };
      }
      const point = byPeriod.get(period);
      return {
        period,
        pageviews: point?.pageviews || 0,
        visitors: point?.visitors || 0,
        bookClicks: point?.bookClicks || 0,
        bookClicksUs: point?.bookClicksUs || 0,
      };
    }),
    pages,
    caseStudies,
    bookButtons: ranked(
      locations.map((row) => {
        const location = String(row.location || "unknown");
        return { key: location, label: bookLocationLabel(location), count: asNumber(row.count) };
      }),
      bookClicks,
    ),
    bookPages: ranked(
      bookingPaths.map((row) => {
        const path = String(row.path || "");
        return { key: path, label: labelForPath(path, studies), count: asNumber(row.count) };
      }),
      bookClicks,
    ),
    bookCountries: ranked(
      asRows<{ country?: unknown; count?: unknown }>(bookCountryRows).map((row) => {
        const country = String(row.country || "");
        return { key: country, label: countryLabel(country), count: asNumber(row.count) };
      }),
      bookClicks,
    ),
    bookCities: ranked(
      asRows<{ city?: unknown; country?: unknown; count?: unknown }>(bookCityRows).map((row) => {
        const city = String(row.city || "");
        const country = String(row.country || "") || null;
        return {
          key: `${city}|${country || ""}`,
          label: cityLabel(city, country),
          count: asNumber(row.count),
        };
      }),
      bookClicks,
    ),
    bookButtonsUs: ranked(
      usLocations.map((row) => {
        const location = String(row.location || "unknown");
        return { key: location, label: bookLocationLabel(location), count: asNumber(row.count) };
      }),
      bookClicksUs,
    ),
    bookPagesUs: ranked(
      usBookingPaths.map((row) => {
        const path = String(row.path || "");
        return { key: path, label: labelForPath(path, studies), count: asNumber(row.count) };
      }),
      bookClicksUs,
    ),
    bookCitiesUs: ranked(
      asRows<{ city?: unknown; country?: unknown; count?: unknown }>(bookCityRows)
        .filter((row) => String(row.country || "").toUpperCase() === BOOK_COUNTRY_US)
        .map((row) => {
          const city = String(row.city || "");
          return {
            key: city,
            label: city,
            count: asNumber(row.count),
          };
        }),
      bookClicksUs,
    ),
  };
}
