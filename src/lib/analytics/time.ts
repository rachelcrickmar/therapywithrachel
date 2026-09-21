export function ymdInZone(date: Date, timeZone: string) {
  return zonedDateTime(date, timeZone).ymd;
}

export function hourInZone(date: Date, timeZone: string) {
  return zonedDateTime(date, timeZone).hour;
}

export function hourFromPeriodKey(period: string) {
  const hour = Number((period.split("T")[1] || "").slice(0, 2));
  return Number.isFinite(hour) ? Math.min(23, Math.max(0, hour)) : 0;
}

export function formatHourLabel(hour: number) {
  const normalized = ((Math.trunc(hour) % 24) + 24) % 24;
  const suffix = normalized < 12 ? "AM" : "PM";
  const twelve = normalized % 12 === 0 ? 12 : normalized % 12;
  return `${twelve} ${suffix}`;
}

export function asInt(value: unknown) {
  if (typeof value === "bigint") return Number(value);
  if (typeof value === "number" && Number.isFinite(value)) return Math.trunc(value);
  const numeric = Number(value);
  return Number.isFinite(numeric) ? Math.trunc(numeric) : Number.NaN;
}

export function periodFromHourBucket(value: unknown) {
  const match = String(value).match(/^(\d{4})(\d{2})(\d{2})(\d{2})$/);
  if (!match) return "";
  return `${match[1]}-${match[2]}-${match[3]}T${match[4]}`;
}

export function hourPeriodKeyFromParts(
  year: unknown,
  month: unknown,
  day: unknown,
  hour: unknown,
) {
  const y = asInt(year);
  const m = asInt(month);
  const d = asInt(day);
  const h = asInt(hour);
  if (![y, m, d].every((part) => Number.isFinite(part)) || y < 2000 || m < 1 || m > 12 || d < 1 || d > 31) {
    return "";
  }
  const hourValue = Number.isFinite(h) ? Math.min(23, Math.max(0, h)) : 0;
  return `${y}-${String(m).padStart(2, "0")}-${String(d).padStart(2, "0")}T${String(hourValue).padStart(2, "0")}`;
}

export function latestHourThrough(
  currentHour: number,
  periods: Iterable<string>,
  ymd: string,
) {
  let hour = Math.min(23, Math.max(0, currentHour));
  const prefix = `${ymd}T`;
  for (const period of periods) {
    if (!period.startsWith(prefix)) continue;
    hour = Math.max(hour, hourFromPeriodKey(period));
  }
  return hour;
}

function zonedDateTime(date: Date, timeZone: string) {
  const formatted = date.toLocaleString("sv-SE", {
    timeZone,
    hourCycle: "h23",
  });
  const match = formatted.match(/(\d{4})-(\d{2})-(\d{2})[ T](\d{2})/);
  if (match) {
    return {
      ymd: `${match[1]}-${match[2]}-${match[3]}`,
      hour: clampHour(Number(match[4])),
    };
  }

  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    hourCycle: "h23",
  }).formatToParts(date);
  const read = (type: Intl.DateTimeFormatPartTypes) =>
    parts.find((part) => part.type === type)?.value;
  const year = read("year");
  const month = read("month");
  const day = read("day");
  return {
    ymd: year && month && day ? `${year}-${month}-${day}` : "",
    hour: hourFromParts(Number(read("hour")), read("dayPeriod")),
  };
}

function hourFromParts(hourRaw: number, dayPeriod?: string) {
  if (!Number.isFinite(hourRaw)) return 0;
  let hour = hourRaw;
  const period = dayPeriod?.toLowerCase() || "";
  if (period.startsWith("p") && hour > 0 && hour < 12) hour += 12;
  if (period.startsWith("a") && hour === 12) hour = 0;
  if (hour === 24) hour = 0;
  return clampHour(hour);
}

function clampHour(hour: number) {
  if (!Number.isFinite(hour)) return 0;
  return Math.min(23, Math.max(0, Math.trunc(hour)));
}
