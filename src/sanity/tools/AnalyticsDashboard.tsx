"use client";

import { useCallback, useEffect, useMemo, useState, type CSSProperties, type ReactNode } from "react";
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragStartEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  rectSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { DragHandleIcon } from "@sanity/icons/DragHandle";
import { Button, Card, Flex, Spinner, Stack, Text } from "@sanity/ui";
import { AnimatePresence, motion } from "framer-motion";
import { useClient } from "sanity";
import {
  ANALYTICS_BOOK_REGION_OPTIONS,
  ANALYTICS_GRAINS,
  ANALYTICS_RANGES,
  isAnalyticsBookRegion,
  isAnalyticsRange,
  TREND_SERIES,
  type AnalyticsBookRegion,
  type AnalyticsChartGrain,
  type AnalyticsRange,
  type TrendSeriesKey,
} from "@/lib/analytics/catalog";
import type { AnalyticsSummary, LiveSnapshot, NamedCount } from "@/lib/analytics/types";
import { apiVersion } from "@/sanity/env";
import { InteractiveChart, formatPeriodLabel } from "./analyticsChart";

const PREFS_KEY = "twr.analytics.dashboard.v1";
const LIVE_POLL_MS = 10_000;
const TODAY_POLL_MS = 60_000;
const numberFmt = new Intl.NumberFormat("en-US");
const percentFmt = new Intl.NumberFormat("en-US", {
  signDisplay: "exceptZero",
  maximumFractionDigits: 0,
});

const CARD_IDS = [
  "kpi-live",
  "kpi-pageviews",
  "kpi-visitors",
  "kpi-book",
  "kpi-top",
  "chart",
  "book-buttons",
  "book-geo",
  "pages",
  "case-studies",
  "book-pages",
] as const;

type CardId = (typeof CARD_IDS)[number];

const CARD_SPAN: Record<CardId, number> = {
  "kpi-live": 12,
  "kpi-pageviews": 3,
  "kpi-visitors": 3,
  "kpi-book": 3,
  "kpi-top": 3,
  chart: 12,
  "book-buttons": 12,
  "book-geo": 12,
  pages: 6,
  "case-studies": 6,
  "book-pages": 6,
};

const GRAIN_LABELS: Record<AnalyticsChartGrain, string> = {
  day: "Days",
  week: "Weeks",
  month: "Months",
};

type Prefs = {
  order: CardId[];
  series: TrendSeriesKey[];
  grain: AnalyticsChartGrain;
  range: AnalyticsRange;
  bookRegion: AnalyticsBookRegion;
};

const DEFAULT_PREFS: Prefs = {
  order: [...CARD_IDS],
  series: ["pageviews", "visitors", "bookClicks"],
  grain: "day",
  range: 30,
  bookRegion: "us",
};

function isCardId(value: string): value is CardId {
  return (CARD_IDS as readonly string[]).includes(value);
}

function loadPrefs(): Prefs {
  try {
    const raw = window.localStorage.getItem(PREFS_KEY);
    if (!raw) return DEFAULT_PREFS;
    const parsed = JSON.parse(raw) as Partial<Prefs>;
    const known = Array.isArray(parsed.order) ? parsed.order.filter(isCardId) : [];
    const missing = CARD_IDS.filter((id) => !known.includes(id));
    const order: CardId[] = missing.includes("kpi-live")
      ? ["kpi-live", ...known, ...missing.filter((id) => id !== "kpi-live")]
      : known.length
        ? [...known, ...missing]
        : DEFAULT_PREFS.order;
    const series = Array.isArray(parsed.series)
      ? parsed.series.filter((key): key is TrendSeriesKey =>
          TREND_SERIES.some((item) => item.key === key),
        )
      : DEFAULT_PREFS.series;
    return {
      order,
      series: series.length ? series : DEFAULT_PREFS.series,
      grain: parsed.grain && ANALYTICS_GRAINS.includes(parsed.grain) ? parsed.grain : "day",
      range: isAnalyticsRange(parsed.range) ? parsed.range : 30,
      bookRegion: isAnalyticsBookRegion(parsed.bookRegion) ? parsed.bookRegion : "us",
    };
  } catch {
    return DEFAULT_PREFS;
  }
}

function change(current: number, previous: number) {
  if (!previous && !current) return null;
  if (!previous) return 100;
  return Math.round(((current - previous) / previous) * 100);
}

function withBookRegion(data: AnalyticsSummary, region: AnalyticsBookRegion): AnalyticsSummary {
  if (region !== "us") return data;
  return {
    ...data,
    totals: {
      ...data.totals,
      bookClicks: data.totals.bookClicksUs || 0,
      bookVisitors: data.totals.bookVisitorsUs || 0,
    },
    previous: {
      ...data.previous,
      bookClicks: data.previous.bookClicksUs || 0,
    },
    trend: data.trend.map((point) => ({
      ...point,
      bookClicks: point.bookClicksUs,
    })),
    bookButtons: data.bookButtonsUs || [],
    bookPages: data.bookPagesUs || [],
    bookCountries: (data.bookCountries || []).filter((row) => row.key.toUpperCase() === "US"),
    bookCities: data.bookCitiesUs || [],
  };
}

function RankedList({
  rows,
  empty,
  limit = 12,
}: {
  rows: NamedCount[];
  empty: string;
  limit?: number;
}) {
  if (!rows.length) {
    return (
      <Text muted size={1}>
        {empty}
      </Text>
    );
  }
  const max = rows[0]?.count || 1;
  return (
    <Stack gap={3}>
      {rows.slice(0, limit).map((row) => (
        <Stack key={row.key} gap={2}>
          <Flex justify="space-between" gap={3}>
            <Text size={1} weight="medium">
              {row.label}
            </Text>
            <Text size={1} muted>
              {numberFmt.format(row.count)}
              {row.share ? ` · ${Math.round(row.share * 100)}%` : ""}
            </Text>
          </Flex>
          <div style={{ height: 6, background: "#e4e3e0", overflow: "hidden" }}>
            <div
              style={{
                height: "100%",
                width: `${Math.max(4, (row.count / max) * 100)}%`,
                background: "#111111",
                transition: "width 480ms cubic-bezier(0.22, 1, 0.36, 1)",
              }}
            />
          </div>
        </Stack>
      ))}
    </Stack>
  );
}

function SortableCard({
  id,
  title,
  children,
}: {
  id: CardId;
  title: string;
  children: ReactNode;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id,
  });
  const style: CSSProperties = {
    gridColumn: `span ${CARD_SPAN[id]}`,
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.55 : 1,
    zIndex: isDragging ? 6 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} className="ravie-analytics-card">
      <Card padding={4} radius={2} border style={{ height: "100%" }}>
        <Stack gap={4}>
          <Flex align="center" justify="space-between" gap={3}>
            <Text size={1} weight="medium" muted>
              {title}
            </Text>
            <button
              type="button"
              aria-label={`Move ${title}`}
              {...attributes}
              {...listeners}
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                width: 28,
                height: 28,
                border: 0,
                background: "transparent",
                color: "#8c8c8c",
                cursor: "grab",
              }}
            >
              <DragHandleIcon />
            </button>
          </Flex>
          {children}
        </Stack>
      </Card>
    </div>
  );
}

export function AnalyticsDashboard() {
  const client = useClient({ apiVersion });
  const [prefs, setPrefs] = useState<Prefs>(DEFAULT_PREFS);
  const [prefsReady, setPrefsReady] = useState(false);
  const [token, setToken] = useState<string | undefined>(client.config().token);
  const [data, setData] = useState<AnalyticsSummary | null>(null);
  const [live, setLive] = useState<LiveSnapshot | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeId, setActiveId] = useState<CardId | null>(null);
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 6 } }));

  useEffect(() => {
    setPrefs(loadPrefs());
    setPrefsReady(true);
  }, []);

  useEffect(() => {
    if (!prefsReady) return;
    window.localStorage.setItem(PREFS_KEY, JSON.stringify(prefs));
  }, [prefs, prefsReady]);

  useEffect(() => {
    let ticks = 0;
    const timer = window.setInterval(() => {
      const found = client.config().token;
      if (found) {
        setToken(found);
        window.clearInterval(timer);
      } else if (++ticks > 20) {
        window.clearInterval(timer);
      }
    }, 250);
    return () => window.clearInterval(timer);
  }, [client]);

  const load = useCallback(async (silent = false) => {
    if (!token) {
      setLoading(false);
      setError("Sign in to Sanity to view analytics.");
      return;
    }
    if (!silent) {
      setLoading(true);
      setError(null);
    }
    try {
      const search = new URLSearchParams({
        range: String(prefs.range),
        grain: prefs.grain,
      });
      if (prefs.range === "today") search.set("_", String(Date.now()));
      const response = await fetch(`/api/analytics/summary?${search}`, {
        headers: { Authorization: `Bearer ${token}` },
        cache: "no-store",
      });
      const json = (await response.json()) as AnalyticsSummary & { error?: string };
      if (!response.ok) {
        throw new Error(json.error || "Could not load analytics.");
      }
      setData(json);
      setLive({
        liveVisitors: json.liveVisitors,
        countries: json.liveCountries || [],
        cities: json.liveCities || [],
      });
    } catch (err) {
      if (!silent) {
        setError(err instanceof Error ? err.message : "Could not load analytics.");
      }
    } finally {
      if (!silent) setLoading(false);
    }
  }, [prefs.grain, prefs.range, token]);

  useEffect(() => {
    if (!prefsReady) return;
    void load();
  }, [load, prefsReady]);

  useEffect(() => {
    if (!prefsReady || !token || prefs.range !== "today") return;
    const timer = window.setInterval(() => void load(true), TODAY_POLL_MS);
    return () => window.clearInterval(timer);
  }, [load, prefs.range, prefsReady, token]);

  useEffect(() => {
    if (!token) return;
    let cancelled = false;

    async function tick() {
      try {
        const response = await fetch("/api/analytics/live", {
          headers: { Authorization: `Bearer ${token}` },
          cache: "no-store",
        });
        const json = (await response.json()) as LiveSnapshot & { error?: string };
        if (
          !cancelled &&
          response.ok &&
          typeof json.liveVisitors === "number" &&
          Array.isArray(json.countries) &&
          Array.isArray(json.cities)
        ) {
          setLive({
            liveVisitors: json.liveVisitors,
            countries: json.countries,
            cities: json.cities,
          });
        }
      } catch {
        // Keep the last live count if a poll fails.
      }
    }

    void tick();
    const timer = window.setInterval(() => void tick(), LIVE_POLL_MS);
    return () => {
      cancelled = true;
      window.clearInterval(timer);
    };
  }, [token]);

  const subtitle = useMemo(() => {
    if (!data) return "Page views, blog posts, and get-in-touch clicks.";
    if (data.range === "today") return `Today · ${formatPeriodLabel(data.from, "day")}`;
    return `${formatPeriodLabel(data.from, "day")} – ${formatPeriodLabel(data.to, "day")}`;
  }, [data]);

  const view = useMemo(
    () => (data ? withBookRegion(data, prefs.bookRegion) : null),
    [data, prefs.bookRegion],
  );
  const usOnly = prefs.bookRegion === "us";
  const bookHint = view
    ? [
        view.totals.bookVisitors
          ? `${numberFmt.format(view.totals.bookVisitors)} people clicked at least once`
          : "",
        usOnly ? "Only clicks with a recorded US location" : "",
      ]
        .filter(Boolean)
        .join(". ")
    : "";

  function updatePrefs(patch: Partial<Prefs>) {
    setPrefs((current) => ({ ...current, ...patch }));
  }

  function toggleSeries(key: TrendSeriesKey) {
    setPrefs((current) => {
      const on = current.series.includes(key);
      if (on && current.series.length === 1) return current;
      return {
        ...current,
        series: on ? current.series.filter((item) => item !== key) : [...current.series, key],
      };
    });
  }

  function onDragStart(event: DragStartEvent) {
    if (isCardId(String(event.active.id))) setActiveId(event.active.id as CardId);
  }

  function onDragEnd(event: DragEndEvent) {
    setActiveId(null);
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const from = String(active.id);
    const to = String(over.id);
    if (!isCardId(from) || !isCardId(to)) return;
    setPrefs((current) => ({
      ...current,
      order: arrayMove(current.order, current.order.indexOf(from), current.order.indexOf(to)),
    }));
  }

  const titles: Record<CardId, string> = {
    "kpi-live": "Live users",
    "kpi-pageviews": "Page views",
    "kpi-visitors": "Unique visitors",
    "kpi-book": usOnly ? "Get in touch clicks · US" : "Get in touch clicks",
    "kpi-top": usOnly ? "Top Get in touch button · US" : "Top Get in touch button",
    chart: "Trends",
    "book-buttons": usOnly ? "Get in touch by button · US" : "Get in touch by button",
    "book-geo": usOnly ? "Get in touch by location · US" : "Get in touch by location",
    pages: "Pages",
    "case-studies": "Blog posts",
    "book-pages": usOnly ? "Get in touch by page · US" : "Get in touch by page",
  };

  function kpiBody(value: number, previous: number, hint?: string, hideChange?: boolean) {
    const delta = change(value, previous);
    return (
      <Stack gap={3}>
        <Text size={3} weight="semibold">
          {numberFmt.format(value)}
        </Text>
        {hideChange ? (
          hint ? (
            <Text size={1} muted>
              {hint}
            </Text>
          ) : null
        ) : (
          <Text size={1} muted>
            {delta === null ? "No prior period" : `${percentFmt.format(delta)}% vs prior`}
          </Text>
        )}
        {!hideChange && hint ? (
          <Text size={1} muted>
            {hint}
          </Text>
        ) : null}
      </Stack>
    );
  }

  function cardBody(id: CardId) {
    if (!view) return null;
    if (id === "kpi-live") {
      const liveCount = live?.liveVisitors ?? view.liveVisitors ?? 0;
      const countries = live?.countries ?? view.liveCountries ?? [];
      const cities = live?.cities ?? view.liveCities ?? [];
      return (
        <Stack gap={4}>
          <Stack gap={3}>
            <Flex align="center" gap={3}>
              <span
                className={liveCount > 0 ? "ravie-live-dot" : "ravie-live-dot is-idle"}
                aria-hidden
              />
              <Text size={3} weight="semibold">
                <span aria-live="polite">{numberFmt.format(liveCount)}</span>
              </Text>
            </Flex>
            <Text size={1} muted>
              Unique visitors on the site now
            </Text>
          </Stack>
          <div className="ravie-live-geo">
            <Stack gap={3}>
              <Text size={1} weight="medium" muted>
                Countries
              </Text>
              <RankedList rows={countries} empty="No country data yet." limit={8} />
            </Stack>
            <Stack gap={3}>
              <Text size={1} weight="medium" muted>
                Cities
              </Text>
              <RankedList rows={cities} empty="No city data yet." limit={8} />
            </Stack>
          </div>
        </Stack>
      );
    }
    if (id === "kpi-pageviews") {
      return kpiBody(view.totals.pageviews, view.previous.pageviews);
    }
    if (id === "kpi-visitors") {
      return kpiBody(view.totals.visitors, view.previous.visitors);
    }
    if (id === "kpi-book") {
      return kpiBody(
        view.totals.bookClicks,
        view.previous.bookClicks,
        bookHint || undefined,
      );
    }
    if (id === "kpi-top") {
      return kpiBody(
        view.bookButtons[0]?.count || 0,
        view.bookButtons[0]?.count || 0,
        view.bookButtons[0]?.label || "No clicks yet",
        true,
      );
    }
    if (id === "chart") {
      return (
        <Stack gap={4}>
          <Flex gap={4} wrap="wrap" justify="space-between">
            <Flex gap={2} wrap="wrap">
              {TREND_SERIES.map((item) => {
                const on = prefs.series.includes(item.key);
                const label =
                  item.key === "bookClicks" && usOnly ? "Get in touch · US" : item.label;
                return (
                  <Button
                    key={item.key}
                    mode={on ? "default" : "ghost"}
                    tone={on ? "primary" : "default"}
                    text={label}
                    onClick={() => toggleSeries(item.key)}
                    fontSize={1}
                    padding={2}
                  />
                );
              })}
            </Flex>
            <Flex gap={2} wrap="wrap">
              {prefs.range === "today" ? (
                <Button mode="default" tone="primary" text="Hours" fontSize={1} padding={2} disabled />
              ) : (
                ANALYTICS_GRAINS.map((grain) => (
                  <Button
                    key={grain}
                    mode={prefs.grain === grain ? "default" : "ghost"}
                    tone={prefs.grain === grain ? "primary" : "default"}
                    text={GRAIN_LABELS[grain]}
                    onClick={() => updatePrefs({ grain })}
                    fontSize={1}
                    padding={2}
                  />
                ))
              )}
            </Flex>
          </Flex>
          <div style={{ opacity: loading ? 0.55 : 1, transition: "opacity 280ms ease" }}>
            <InteractiveChart
              points={view.trend}
              grain={view.grain || prefs.grain}
              series={prefs.series}
              seriesLabels={usOnly ? { bookClicks: "Get in touch · US" } : undefined}
              emptyLabel="No trend data in this range yet. Choose another metric or wait for visits."
            />
          </div>
        </Stack>
      );
    }
    if (id === "book-buttons") {
      return (
        <Stack gap={3}>
          <Text muted size={1}>
            {usOnly
              ? "US Get in touch clicks by button. Clicks without a recorded US location are omitted."
              : "Every Get in touch link on the site, ranked by clicks."}
          </Text>
          <RankedList rows={view.bookButtons} empty="No Get in touch clicks yet." />
        </Stack>
      );
    }
    if (id === "book-geo") {
      return (
        <Stack gap={4}>
          <Text muted size={1}>
            {usOnly
              ? "US cities for Get in touch clicks with a recorded location."
              : "Where Get in touch clicks came from, by country and city."}
          </Text>
          {usOnly ? (
            <RankedList
              rows={view.bookCities}
              empty="No US city data yet. New Get in touch clicks record location going forward."
              limit={12}
            />
          ) : (
            <div className="ravie-live-geo">
              <Stack gap={3}>
                <Text size={1} weight="medium" muted>
                  Countries
                </Text>
                <RankedList
                  rows={view.bookCountries}
                  empty="No country data yet. New Get in touch clicks record location going forward."
                  limit={8}
                />
              </Stack>
              <Stack gap={3}>
                <Text size={1} weight="medium" muted>
                  Cities
                </Text>
                <RankedList
                  rows={view.bookCities}
                  empty="No city data yet. New Get in touch clicks record location going forward."
                  limit={8}
                />
              </Stack>
            </div>
          )}
        </Stack>
      );
    }
    if (id === "pages") {
      return <RankedList rows={view.pages} empty="No page views yet." />;
    }
    if (id === "case-studies") {
      return <RankedList rows={view.caseStudies} empty="No blog post views yet." />;
    }
    return (
      <Stack gap={3}>
        <Text muted size={1}>
          {usOnly
            ? "Where US visitors were when they clicked."
            : "Where people were when they clicked."}
        </Text>
        <RankedList rows={view.bookPages} empty="No Get in touch clicks yet." />
      </Stack>
    );
  }

  return (
    <div style={{ overflow: "auto", height: "100%", padding: 28 }}>
      <style>{`
        .ravie-analytics-grid {
          display: grid;
          grid-template-columns: repeat(12, minmax(0, 1fr));
          gap: 16px;
          align-items: stretch;
        }
        .ravie-analytics-card { min-width: 0; }
        .ravie-analytics-card > div {
          transition: box-shadow 220ms ease, transform 220ms ease;
        }
        .ravie-analytics-card:hover > div {
          box-shadow: 0 10px 28px rgba(17, 17, 17, 0.06);
        }
        @media (max-width: 1080px) {
          .ravie-analytics-card { grid-column: 1 / -1 !important; }
        }
        .ravie-chart {
          display: grid;
          grid-template-columns: 40px minmax(0, 1fr);
          grid-template-rows: auto auto;
          column-gap: 8px;
          row-gap: 8px;
          align-items: stretch;
        }
        .ravie-chart-y {
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          align-items: flex-end;
          padding: 2px 0;
        }
        .ravie-chart-svg {
          display: block;
          overflow: visible;
          font-size: 12px;
        }
        .ravie-chart-x {
          position: relative;
          height: 22px;
        }
        .ravie-chart-x > span {
          position: absolute;
          top: 0;
          transform: translateX(-50%);
          white-space: nowrap;
        }
        .ravie-chart-tooltip {
          position: absolute;
          top: 8px;
          min-width: 168px;
          padding: 10px 12px;
          background: #111111;
          color: #f6f5f3;
          pointer-events: none;
          z-index: 2;
        }
        .ravie-chart-tooltip * {
          color: #f6f5f3 !important;
        }
        .ravie-live-dot {
          width: 9px;
          height: 9px;
          flex: 0 0 auto;
          border-radius: 99px;
          background: #1f5c40;
          box-shadow: 0 0 0 0 rgba(196, 92, 56, 0.55);
          animation: ravie-live-pulse 1.8s ease-out infinite;
        }
        .ravie-live-dot.is-idle {
          background: #c8c6c3;
          box-shadow: none;
          animation: none;
        }
        @keyframes ravie-live-pulse {
          0% { box-shadow: 0 0 0 0 rgba(196, 92, 56, 0.5); }
          70% { box-shadow: 0 0 0 10px rgba(196, 92, 56, 0); }
          100% { box-shadow: 0 0 0 0 rgba(196, 92, 56, 0); }
        }
        @media (prefers-reduced-motion: reduce) {
          .ravie-live-dot { animation: none; }
        }
        .ravie-live-geo {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 28px;
        }
        @media (max-width: 1080px) {
          .ravie-live-geo { grid-template-columns: 1fr; }
        }
      `}</style>
      <Stack gap={5}>
        <Flex align="flex-start" justify="space-between" gap={4} wrap="wrap">
          <Stack gap={3}>
            <Text size={3} weight="semibold">
              Analytics
            </Text>
            <Text muted>{subtitle}</Text>
            <Text muted size={1}>
              Drag the handle on any card to rearrange. Your layout is saved on this browser.
            </Text>
          </Stack>
          <Flex gap={3} wrap="wrap" align="center" justify="flex-end">
            <Flex gap={2} wrap="wrap">
              {ANALYTICS_RANGES.map((item) => (
                <Button
                  key={String(item.value)}
                  mode={prefs.range === item.value ? "default" : "ghost"}
                  tone={prefs.range === item.value ? "primary" : "default"}
                  text={item.label}
                  onClick={() => updatePrefs({ range: item.value })}
                />
              ))}
            </Flex>
            <Flex gap={2} wrap="wrap" align="center" role="group" aria-label="Conversion region">
              <Text size={1} muted>
                Region
              </Text>
              {ANALYTICS_BOOK_REGION_OPTIONS.map((item) => (
                <Button
                  key={item.value}
                  mode={prefs.bookRegion === item.value ? "default" : "ghost"}
                  tone={prefs.bookRegion === item.value ? "primary" : "default"}
                  text={item.label}
                  onClick={() => updatePrefs({ bookRegion: item.value })}
                />
              ))}
            </Flex>
            <Button mode="ghost" text="Refresh" onClick={() => void load()} disabled={loading} />
            <Button
              mode="ghost"
              text="Reset layout"
              onClick={() =>
                updatePrefs({
                  order: [...CARD_IDS],
                })
              }
            />
          </Flex>
        </Flex>

        {loading && !data ? (
          <Flex align="center" justify="center" padding={6}>
            <Spinner muted />
          </Flex>
        ) : null}

        {error ? (
          <Card padding={4} radius={2} tone="caution" border>
            <Text>{error}</Text>
          </Card>
        ) : null}

        {data && !data.configured ? (
          <Card padding={4} radius={2} tone="caution" border>
            <Text>The analytics database is not connected yet.</Text>
          </Card>
        ) : null}

        {data ? (
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragStart={onDragStart}
            onDragEnd={onDragEnd}
            onDragCancel={() => setActiveId(null)}
          >
            <SortableContext items={prefs.order} strategy={rectSortingStrategy}>
              <div className="ravie-analytics-grid">
                {prefs.order.map((id, index) => (
                  <motion.div
                    key={id}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.35, delay: Math.min(index, 8) * 0.04, ease: [0.22, 1, 0.36, 1] }}
                    style={{ display: "contents" }}
                  >
                    <SortableCard id={id} title={titles[id]}>
                      {cardBody(id)}
                    </SortableCard>
                  </motion.div>
                ))}
              </div>
            </SortableContext>
            <AnimatePresence>
              <DragOverlay dropAnimation={{ duration: 200, easing: "cubic-bezier(0.22, 1, 0.36, 1)" }}>
                {activeId ? (
                  <Card padding={4} radius={2} border>
                    <Text size={1} weight="medium">
                      {titles[activeId]}
                    </Text>
                  </Card>
                ) : null}
              </DragOverlay>
            </AnimatePresence>
          </DndContext>
        ) : null}
      </Stack>
    </div>
  );
}
