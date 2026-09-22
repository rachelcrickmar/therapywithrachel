/** Defaults from Rachel’s Psychology Today verified-seal embed. */
export const PSYCHOLOGY_TODAY_DEFAULTS = {
  profileId: "1608263",
  badge: "13",
  code: "aHR0cHM6Ly93d3cucHN5Y2hvbG9neXRvZGF5LmNvbS9hcGkvdmVyaWZpZWQtc2VhbC9zZWFscy8xMy9wcm9maWxlLzE2MDgyNjM/Y2FsbGJhY2s9c3hjYWxsYmFjaw==",
} as const;

export const PSYCHOLOGY_TODAY_DEFAULT_EMBED = `<!-- Professional verification provided by Psychology Today -->
<a href="https://www.psychologytoday.com/profile/${PSYCHOLOGY_TODAY_DEFAULTS.profileId}" class="sx-verified-seal"></a>
<script type="text/javascript" src="https://member.psychologytoday.com/verified-seal.js" data-badge="${PSYCHOLOGY_TODAY_DEFAULTS.badge}" data-id="${PSYCHOLOGY_TODAY_DEFAULTS.profileId}" data-code="${PSYCHOLOGY_TODAY_DEFAULTS.code}"></script>
<!-- End Verification -->`;

export const PSYCHOLOGY_TODAY_PLACEMENTS = [
  { value: "footer", title: "Footer" },
  { value: "homeHero", title: "Home — hero" },
  { value: "about", title: "About page" },
] as const;

export type PsychologyTodayPlacement =
  (typeof PSYCHOLOGY_TODAY_PLACEMENTS)[number]["value"];

export type PsychologyTodayBadgeConfig = {
  enabled: boolean;
  placements: PsychologyTodayPlacement[];
  profileId: string;
  badge: string;
  code: string;
};

export function isPsychologyTodayPlacement(
  value: unknown,
): value is PsychologyTodayPlacement {
  return value === "footer" || value === "homeHero" || value === "about";
}

/** Pull profile id / badge style / verification code from a Psychology Today embed snippet. */
export function sanitizePsychologyTodayEmbed(html: string) {
  return html
    // Editors / OS autocorrect often turn HTML comment endings into arrows or dashes.
    .replace(/→/g, "-->")
    .replace(/←/g, "<!--")
    .replace(/<!—/g, "<!--")
    .replace(/<!–/g, "<!--")
    .replace(/—>/g, "-->")
    .replace(/–>/g, "-->")
    .replace(/[“”]/g, '"')
    .replace(/[‘’]/g, "'");
}

export function parsePsychologyTodayEmbed(html: string | null | undefined) {
  if (!html?.trim()) return null;
  const cleaned = sanitizePsychologyTodayEmbed(html);

  const profileId =
    cleaned.match(/data-id\s*=\s*["'](\d+)["']/i)?.[1] ||
    cleaned.match(/data-id\s*=\s*(\d+)/i)?.[1] ||
    cleaned.match(/psychologytoday\.com\/(?:us\/)?profile\/(\d+)/i)?.[1] ||
    null;
  const badge =
    cleaned.match(/data-badge\s*=\s*["'](\d+)["']/i)?.[1] ||
    cleaned.match(/data-badge\s*=\s*(\d+)/i)?.[1] ||
    null;
  // Codes are base64; allow mangled quotes and whitespace wrapping.
  const code =
    cleaned.match(/data-code\s*=\s*["']([A-Za-z0-9+/=]+)["']/i)?.[1] ||
    cleaned.match(/data-code\s*=\s*([A-Za-z0-9+/=]{20,})/i)?.[1] ||
    null;

  if (!profileId || !code) return null;
  return {
    profileId,
    badge: badge || PSYCHOLOGY_TODAY_DEFAULTS.badge,
    code,
  };
}

export function normalizePsychologyTodayBadge(input: {
  enabled?: boolean | null;
  placements?: unknown[] | null;
  embed?: string | null;
  profileId?: string | null;
  badge?: string | null;
  code?: string | null;
} | null | undefined): PsychologyTodayBadgeConfig {
  const placements = (input?.placements || [])
    .map((value) => (typeof value === "string" ? value.trim() : value))
    .filter(isPsychologyTodayPlacement)
    .filter((value, index, all) => all.indexOf(value) === index);

  const fromEmbed = parsePsychologyTodayEmbed(input?.embed);
  const profileId =
    input?.profileId?.trim() ||
    fromEmbed?.profileId ||
    PSYCHOLOGY_TODAY_DEFAULTS.profileId;
  const badge =
    input?.badge?.trim() ||
    fromEmbed?.badge ||
    PSYCHOLOGY_TODAY_DEFAULTS.badge;
  const code =
    input?.code?.trim() || fromEmbed?.code || PSYCHOLOGY_TODAY_DEFAULTS.code;

  // Treat a pasted embed (or explicit on) as enabled. Only stay off when
  // the toggle is explicitly false and there is no usable embed/code.
  const hasEmbed = Boolean(fromEmbed || input?.code?.trim() || input?.embed?.trim());
  const enabled =
    input?.enabled === false && !hasEmbed
      ? false
      : input?.enabled !== false;

  return {
    enabled,
    placements: placements.length ? placements : ["footer"],
    profileId,
    badge,
    code,
  };
}

export function showPsychologyTodayBadge(
  config: PsychologyTodayBadgeConfig,
  placement: PsychologyTodayPlacement,
) {
  return (
    config.enabled &&
    Boolean(config.profileId && config.code) &&
    config.placements.includes(placement)
  );
}
