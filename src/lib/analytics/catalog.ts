export const ANALYTICS_TZ = "America/New_York";

export const EVENT_PAGEVIEW = "pageview";
/** Primary conversion: Get in touch / contact CTAs */
export const EVENT_BOOK_CALL = "contact_click";
export const EVENT_PRESENCE = "presence";

export const LIVE_WINDOW_SECONDS = 5 * 60;
export const LIVE_HEARTBEAT_MS = 20_000;

export const RANGE_DAYS = [7, 30, 90, 365] as const;
export type AnalyticsDayRange = (typeof RANGE_DAYS)[number];
export type AnalyticsRange = "today" | AnalyticsDayRange;

export const ANALYTICS_RANGES: { value: AnalyticsRange; label: string }[] = [
  { value: "today", label: "Today" },
  { value: 7, label: "7 days" },
  { value: 30, label: "30 days" },
  { value: 90, label: "90 days" },
  { value: 365, label: "12 months" },
];

export const ANALYTICS_GRAINS = ["day", "week", "month"] as const;
export type AnalyticsChartGrain = (typeof ANALYTICS_GRAINS)[number];
export type AnalyticsGrain = AnalyticsChartGrain | "hour";

export const BOOK_COUNTRY_US = "US";
export const ANALYTICS_BOOK_REGIONS = ["all", "us"] as const;
export type AnalyticsBookRegion = (typeof ANALYTICS_BOOK_REGIONS)[number];
export const ANALYTICS_BOOK_REGION_OPTIONS: {
  value: AnalyticsBookRegion;
  label: string;
}[] = [
  { value: "all", label: "All regions" },
  { value: "us", label: "United States" },
];

export const TREND_SERIES = [
  { key: "pageviews", label: "Page views", color: "#1a2420" },
  { key: "visitors", label: "Unique visitors", color: "#4a5a54" },
  { key: "bookClicks", label: "Get in touch", color: "#1f5c40" },
] as const;
export type TrendSeriesKey = (typeof TREND_SERIES)[number]["key"];

export function isAnalyticsBookRegion(
  value: unknown,
): value is AnalyticsBookRegion {
  return value === "all" || value === "us";
}

export const SITE_PAGE_LABELS: Record<string, string> = {
  "/": "Home",
  "/about": "About",
  "/rates": "Rates & insurance",
  "/faq": "FAQ",
  "/blog": "Blog",
  "/contact": "Contact",
  "/privacy": "Privacy",
};

export const BOOK_LOCATION_LABELS: Record<string, string> = {
  home_hero: "Home — hero",
  home_cta: "Home — consult form",
  nav_desktop: "Nav — desktop",
  nav_mobile: "Nav — mobile",
  footer: "Footer",
  about_sidebar: "About — sidebar",
  rates_insurance: "Rates — insurance CTA",
  faq_cta: "FAQ — get in touch",
  contact_form: "Contact — form submit",
  blog_cta: "Blog — CTA block",
  privacy_cta: "Privacy — get in touch",
};

const SITE_PATHS = new Set(Object.keys(SITE_PAGE_LABELS));

export function isSitePagePath(path: string) {
  return SITE_PATHS.has(path);
}

/** Detail / content pages: individual blog posts */
export function isCaseStudyPath(path: string) {
  if (isSitePagePath(path)) return false;
  const parts = path.split("/").filter(Boolean);
  return parts.length === 2 && parts[0] === "blog";
}

export function caseStudySlugFromPath(path: string) {
  if (!isCaseStudyPath(path)) return null;
  const parts = path.split("/").filter(Boolean);
  return parts[1] || null;
}

export function blogPath(slug: string) {
  return `/blog/${slug}`;
}

export function bookLocationLabel(location: string) {
  return (
    BOOK_LOCATION_LABELS[location] ||
    location
      .split("_")
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join(" ")
  );
}

export function isAnalyticsRange(value: unknown): value is AnalyticsRange {
  return value === "today" || RANGE_DAYS.includes(value as AnalyticsDayRange);
}

export function parseRange(value: string | null): AnalyticsRange {
  if (value === "today" || value === "1") return "today";
  const days = Number(value);
  return RANGE_DAYS.includes(days as AnalyticsDayRange)
    ? (days as AnalyticsDayRange)
    : 30;
}

export function parseGrain(value: string | null): AnalyticsChartGrain {
  return ANALYTICS_GRAINS.includes(value as AnalyticsChartGrain)
    ? (value as AnalyticsChartGrain)
    : "day";
}

export function analyticsEnvironment() {
  const env = process.env.VERCEL_ENV;
  if (env === "preview" || env === "development") return env;
  if (process.env.NODE_ENV !== "production") return "development";
  return "production";
}
