import { urlFor } from "@/sanity/lib/image";
import {
  isPsychologyTodayPlacement,
  normalizePsychologyTodayBadge,
  parsePsychologyTodayEmbed,
  sanitizePsychologyTodayEmbed,
  type PsychologyTodayPlacement,
} from "@/lib/psychology-today";

export type SiteBadge = {
  id: string;
  name: string;
  placements: PsychologyTodayPlacement[];
} & (
  | {
      kind: "psychologyToday";
      profileId: string;
      badge: string;
      code: string;
    }
  | {
      kind: "image";
      href: string;
      src: string;
      alt: string;
    }
);

type DirectoryBadgeInput = {
  _key?: string;
  name?: string | null;
  placements?: unknown[] | null;
  embed?: string | null;
  link?: string | null;
  alt?: string | null;
  imageUrl?: string | null;
  image?: unknown;
};

function safeHttpUrl(value: string | null | undefined) {
  if (!value?.trim()) return null;
  try {
    const url = new URL(value.trim(), "https://therapywithrachel.com");
    if (url.protocol !== "https:" && url.protocol !== "http:") return null;
    return url.toString();
  } catch {
    return null;
  }
}

function placementsFrom(value: unknown[] | null | undefined) {
  const placements = (value || [])
    .map((item) => (typeof item === "string" ? item.trim() : item))
    .filter(isPsychologyTodayPlacement)
    .filter((item, index, all) => all.indexOf(item) === index);
  return placements.length ? placements : (["footer"] as PsychologyTodayPlacement[]);
}

/** Image + link from a typical directory badge snippet: <a href><img src></a> */
export function parseImageBadgeEmbed(html: string | null | undefined) {
  if (!html?.trim()) return null;
  const cleaned = sanitizePsychologyTodayEmbed(html);
  const href = cleaned.match(/<a\b[^>]*href\s*=\s*["']([^"']+)["']/i)?.[1];
  const imgTag = cleaned.match(/<img\b[^>]*>/i)?.[0];
  const src = imgTag?.match(/\bsrc\s*=\s*["']([^"']+)["']/i)?.[1];
  const alt = imgTag?.match(/\balt\s*=\s*["']([^"']*)["']/i)?.[1];
  const safeSrc = safeHttpUrl(src);
  if (!safeSrc) return null;
  return {
    href: safeHttpUrl(href),
    src: safeSrc,
    alt: alt?.trim() || "",
  };
}

function sanityImageUrl(image: unknown) {
  if (!image || typeof image !== "object") return null;
  const asset = (image as { asset?: { _ref?: string; _id?: string; url?: string } })
    .asset;
  if (!asset) return null;
  if (asset.url) return asset.url;
  if (!asset._ref && !asset._id) return null;
  try {
    return urlFor(image as never)?.width(480).url() || null;
  } catch {
    return null;
  }
}

export function normalizeSiteBadges(input: {
  psychologyToday?: Parameters<typeof normalizePsychologyTodayBadge>[0];
  directoryBadges?: DirectoryBadgeInput[] | null;
}): SiteBadge[] {
  const badges: SiteBadge[] = [];
  const legacy = normalizePsychologyTodayBadge(input.psychologyToday);
  if (legacy.enabled && legacy.profileId && legacy.code) {
    badges.push({
      id: "psychology-today",
      name: "Psychology Today",
      kind: "psychologyToday",
      placements: legacy.placements,
      profileId: legacy.profileId,
      badge: legacy.badge,
      code: legacy.code,
    });
  }

  for (const [index, item] of (input.directoryBadges || []).entries()) {
    const id = item._key || `badge-${index}`;
    const name = item.name?.trim() || "Directory badge";
    const placements = placementsFrom(item.placements);
    const seal = parsePsychologyTodayEmbed(item.embed);
    if (seal) {
      badges.push({
        id,
        name,
        kind: "psychologyToday",
        placements,
        profileId: seal.profileId,
        badge: seal.badge,
        code: seal.code,
      });
      continue;
    }

    const fromEmbed = parseImageBadgeEmbed(item.embed);
    const src =
      sanityImageUrl(item.image) ||
      safeHttpUrl(item.imageUrl) ||
      fromEmbed?.src ||
      null;
    const href = safeHttpUrl(item.link) || fromEmbed?.href || null;
    if (!src || !href) continue;
    badges.push({
      id,
      name,
      kind: "image",
      placements,
      href,
      src,
      alt: item.alt?.trim() || fromEmbed?.alt || name,
    });
  }

  return badges;
}

export function badgesForPlacement(
  badges: SiteBadge[],
  placement: PsychologyTodayPlacement,
) {
  return badges.filter((badge) => badge.placements.includes(placement));
}
