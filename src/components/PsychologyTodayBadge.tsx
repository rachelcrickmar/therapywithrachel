"use client";

import { useEffect, useState } from "react";

export type PsychologyTodayBadgeProps = {
  profileId: string;
  badge: string;
  code: string;
  className?: string;
};

type SealPayload = {
  name?: string;
  badgeId?: number | string;
  image?: {
    content?: string;
    dimensions?: { width?: number; height?: number };
  };
};

/**
 * Psychology Today verified seal.
 *
 * Their official loader + JSONP fail in modern apps: the seal API returns
 * Content-Type application/json, so browsers won't execute it as a script.
 * We fetch via our own API proxy and render a real <img>.
 */
export function PsychologyTodayBadge({
  profileId,
  badge,
  code,
  className = "",
}: PsychologyTodayBadgeProps) {
  const [seal, setSeal] = useState<SealPayload | null>(null);

  useEffect(() => {
    if (!profileId || !code) return;

    const params = new URLSearchParams({
      profileId,
      badge: badge || "13",
      code,
    });
    const controller = new AbortController();

    void fetch(`/api/psychology-today-badge?${params.toString()}`, {
      signal: controller.signal,
    })
      .then(async (response) => {
        if (!response.ok) throw new Error("seal fetch failed");
        return (await response.json()) as SealPayload;
      })
      .then((payload) => {
        if (payload?.image?.content) setSeal(payload);
      })
      .catch((error: unknown) => {
        if (
          error &&
          typeof error === "object" &&
          "name" in error &&
          error.name === "AbortError"
        ) {
          return;
        }
        console.warn("Psychology Today badge failed to load.", error);
      });

    return () => controller.abort();
  }, [profileId, badge, code]);

  if (!profileId || !code) return null;

  const width = seal?.image?.dimensions?.width || 146;
  const height = seal?.image?.dimensions?.height || 46;
  const label = seal?.name
    ? `Verified by Psychology Today — ${seal.name}`
    : "Verified by Psychology Today";

  return (
    <div className={`psychology-today-badge ${className}`.trim()}>
      <a
        href={`https://www.psychologytoday.com/profile/${profileId}`}
        className="sx-verified-seal"
        target="_blank"
        rel="noopener noreferrer"
        aria-label={label}
        title={seal?.name || "Psychology Today"}
      >
        {seal?.image?.content ? (
          // eslint-disable-next-line @next/next/no-img-element -- data URI from PT API
          <img
            src={`data:image/svg+xml;base64,${seal.image.content}`}
            alt={label}
            width={width}
            height={height}
            decoding="async"
          />
        ) : (
          <span
            className="psychology-today-badge__slot"
            style={{ width, height }}
            aria-hidden
          />
        )}
      </a>
    </div>
  );
}
