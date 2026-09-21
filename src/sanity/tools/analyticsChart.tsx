"use client";

import { useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Flex, Text } from "@sanity/ui";
import {
  TREND_SERIES,
  type AnalyticsGrain,
  type TrendSeriesKey,
} from "@/lib/analytics/catalog";
import { formatHourLabel } from "@/lib/analytics/time";
import type { TrendPoint, TrendValue } from "@/lib/analytics/types";

const numberFmt = new Intl.NumberFormat("en-US");

function seriesValue(point: TrendPoint, key: TrendSeriesKey): TrendValue {
  return point[key];
}

export function formatPeriodLabel(period: string, grain: AnalyticsGrain) {
  if (grain === "hour") {
    const hour = Number((period.split("T")[1] || "0").slice(0, 2));
    return formatHourLabel(Number.isFinite(hour) ? hour : 0);
  }
  const date = new Date(`${period.slice(0, 10)}T12:00:00`);
  if (Number.isNaN(date.getTime())) return period;
  if (grain === "month") {
    return date.toLocaleDateString("en-US", { month: "short", year: "numeric" });
  }
  if (grain === "week") {
    const end = new Date(date);
    end.setDate(end.getDate() + 6);
    const startLabel = date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
    const endLabel = end.toLocaleDateString("en-US", { month: "short", day: "numeric" });
    return `${startLabel} – ${endLabel}`;
  }
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

type InteractiveChartProps = {
  points: TrendPoint[];
  grain: AnalyticsGrain;
  series: TrendSeriesKey[];
  emptyLabel: string;
  seriesLabels?: Partial<Record<TrendSeriesKey, string>>;
};

export function InteractiveChart({
  points,
  grain,
  series,
  emptyLabel,
  seriesLabels,
}: InteractiveChartProps) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [hover, setHover] = useState<number | null>(null);
  const width = 800;
  const height = 200;
  const active = TREND_SERIES.filter((item) => series.includes(item.key)).map((item) => ({
    ...item,
    label: seriesLabels?.[item.key] || item.label,
  }));
  const max = Math.max(
    1,
    ...points.flatMap((point) => active.map((item) => seriesValue(point, item.key) ?? 0)),
  );
  const padX = 6;
  const coords = useMemo(
    () =>
      points.map((point, index) => {
        const x =
          points.length === 1
            ? width / 2
            : padX + (index / Math.max(1, points.length - 1)) * (width - padX * 2);
        return {
          x,
          left: points.length === 1 ? 50 : (x / width) * 100,
          point,
          ys: Object.fromEntries(
            TREND_SERIES.map((item) => {
              const value = seriesValue(point, item.key);
              return [item.key, value == null ? null : height - (value / max) * height];
            }),
          ) as Record<TrendSeriesKey, number | null>,
        };
      }),
    [height, max, points, width],
  );

  const hasData = points.some((point) =>
    active.some((item) => (seriesValue(point, item.key) ?? 0) > 0),
  );
  const labelEvery = Math.max(1, Math.ceil(points.length / (points.length > 20 ? 6 : 7)));
  const hovered = hover !== null ? coords[hover] : null;
  const yTicks = [max, Math.round(max / 2), 0];

  function pathFor(key: TrendSeriesKey) {
    let path = "";
    let drawing = false;
    for (const coord of coords) {
      const y = coord.ys[key];
      if (y == null) {
        drawing = false;
        continue;
      }
      path += `${drawing ? "L" : "M"}${coord.x} ${y} `;
      drawing = true;
    }
    return path.trim();
  }

  function areaFor(key: TrendSeriesKey) {
    const drawn = coords.filter((coord) => coord.ys[key] != null);
    if (drawn.length < 2) return "";
    const line = pathFor(key);
    const first = drawn[0];
    const last = drawn[drawn.length - 1];
    if (!line || !first || !last) return "";
    return `${line} L${last.x} ${height} L${first.x} ${height} Z`;
  }

  function onMove(event: React.MouseEvent<SVGRectElement>) {
    const svg = event.currentTarget.ownerSVGElement;
    if (!svg || !coords.length) return;
    const rect = svg.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / Math.max(1, rect.width)) * width;
    let nearest = 0;
    let best = Infinity;
    coords.forEach((coord, index) => {
      const dist = Math.abs(coord.x - x);
      if (dist < best) {
        best = dist;
        nearest = index;
      }
    });
    setHover(nearest);
  }

  if (!active.length || !hasData) {
    return (
      <Flex align="center" justify="center" padding={5} style={{ minHeight: 200 }}>
        <Text muted size={1}>
          {emptyLabel}
        </Text>
      </Flex>
    );
  }

  const tooltipLeft = hovered ? Math.min(70, Math.max(2, hovered.left - 14)) : 8;

  return (
    <div ref={wrapRef} className="ravie-chart">
      <div className="ravie-chart-y" aria-hidden>
        {yTicks.map((tick) => (
          <Text key={tick} size={1} muted>
            {numberFmt.format(tick)}
          </Text>
        ))}
      </div>
      <div style={{ position: "relative", minWidth: 0 }}>
        <svg
          viewBox={`0 0 ${width} ${height}`}
          width="100%"
          role="img"
          className="ravie-chart-svg"
        >
          {[0, 0.5, 1].map((tick) => {
            const y = height - tick * height;
            return (
              <line
                key={tick}
                x1={0}
                x2={width}
                y1={y}
                y2={y}
                stroke="#e4e3e0"
                strokeDasharray={tick === 0 || tick === 1 ? undefined : "3 4"}
              />
            );
          })}
          {active[0] && areaFor(active[0].key) ? (
            <motion.path
              key={`${active[0].key}-area-${grain}-${points.length}`}
              d={areaFor(active[0].key)}
              fill={active[0].color}
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.08 }}
              transition={{ duration: 0.45 }}
            />
          ) : null}
          {active.map((item) => (
            <motion.path
              key={`${item.key}-line-${grain}-${points.length}`}
              d={pathFor(item.key)}
              fill="none"
              stroke={item.color}
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              pathLength={1}
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            />
          ))}
          {hovered
            ? active.map((item) =>
                hovered.ys[item.key] == null ? null : (
                  <circle
                    key={`dot-${item.key}`}
                    cx={hovered.x}
                    cy={hovered.ys[item.key] ?? 0}
                    r="4"
                    fill="#f6f5f3"
                    stroke={item.color}
                    strokeWidth="2"
                  />
                ),
              )
            : null}
          {hovered ? (
            <line
              x1={hovered.x}
              x2={hovered.x}
              y1={0}
              y2={height}
              stroke="#1a2420"
              strokeOpacity="0.18"
            />
          ) : null}
          <rect
            x={0}
            y={0}
            width={width}
            height={height}
            fill="transparent"
            onMouseMove={onMove}
            onMouseLeave={() => setHover(null)}
          />
        </svg>
        <AnimatePresence>
          {hovered ? (
            <motion.div
              key={hovered.point.period}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              transition={{ duration: 0.16, ease: [0.22, 1, 0.36, 1] }}
              className="ravie-chart-tooltip"
              style={{ left: `${tooltipLeft}%` }}
            >
              <Text size={1} muted>
                {formatPeriodLabel(hovered.point.period, grain)}
              </Text>
              {active.map((item) => (
                <Flex key={item.key} justify="space-between" gap={3} marginTop={2}>
                  <Flex align="center" gap={2}>
                    <span
                      style={{
                        width: 8,
                        height: 8,
                        borderRadius: 99,
                        background: item.color,
                        boxShadow:
                          item.color === "#1a2420" ? "inset 0 0 0 1px #f6f5f3" : undefined,
                      }}
                    />
                    <Text size={1}>{item.label}</Text>
                  </Flex>
                  <Text size={1} weight="medium">
                    {seriesValue(hovered.point, item.key) == null
                      ? "—"
                      : numberFmt.format(seriesValue(hovered.point, item.key) ?? 0)}
                  </Text>
                </Flex>
              ))}
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>
      <div />
      <div className="ravie-chart-x" aria-hidden>
        {coords.map((coord, index) =>
          index % labelEvery === 0 || index === coords.length - 1 ? (
            <span key={coord.point.period} style={{ left: `${coord.left}%` }}>
              <Text size={1} muted>
                {formatPeriodLabel(coord.point.period, grain)}
              </Text>
            </span>
          ) : null,
        )}
      </div>
    </div>
  );
}
