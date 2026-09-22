"use client";

import { useEffect, useId, useRef } from "react";

export type PsychologyTodayBadgeProps = {
  profileId: string;
  badge: string;
  code: string;
  className?: string;
};

type SealPayload = {
  badgeId?: number | string;
  name?: string;
  image?: {
    content?: string;
    dimensions?: { width?: number; height?: number };
  };
};

/**
 * Psychology Today verified seal.
 *
 * Their official loader only runs on DOMContentLoaded, so injecting
 * verified-seal.js from React never paints the badge. We call their
 * JSONP seal API directly (same endpoint the embed uses) instead.
 */
export function PsychologyTodayBadge({
  profileId,
  badge,
  code,
  className = "",
}: PsychologyTodayBadgeProps) {
  const anchorRef = useRef<HTMLAnchorElement>(null);
  const reactId = useId().replace(/:/g, "");
  const callbackName = `sxPtBadge_${reactId}`;

  useEffect(() => {
    if (!profileId || !code || !anchorRef.current) return;

    let apiUrl = "";
    try {
      apiUrl = atob(code.trim().replace(/[“”‘’]/g, "").replace(/\s+/g, ""))
        .replace("[BADGE]", badge)
        .replace("[PROFILE_ID]", String(parseInt(profileId, 10)));
    } catch {
      return;
    }

    if (!apiUrl.startsWith("https://")) return;

    const applySeal = (payload: SealPayload) => {
      const anchor = anchorRef.current;
      if (!anchor || !payload?.image?.content) return;
      const width = payload.image.dimensions?.width || 120;
      const height = payload.image.dimensions?.height || 120;
      anchor.style.display = "inline-block";
      anchor.style.backgroundRepeat = "no-repeat";
      anchor.style.backgroundSize = "contain";
      anchor.style.backgroundImage = `url("data:image/svg+xml;base64,${payload.image.content}")`;
      anchor.style.width = `${width}px`;
      anchor.style.height = `${height}px`;
      if (payload.name) anchor.title = payload.name;
    };

    const url = new URL(apiUrl);
    url.searchParams.set("callback", callbackName);

    const previous = (window as unknown as Record<string, unknown>)[callbackName];
    (window as unknown as Record<string, unknown>)[callbackName] = (
      payload: SealPayload,
    ) => {
      applySeal(payload);
    };

    const script = document.createElement("script");
    script.async = true;
    script.src = url.toString();
    script.onerror = () => {
      console.warn("Psychology Today badge failed to load.");
    };
    document.body.appendChild(script);

    return () => {
      script.remove();
      if (previous) {
        (window as unknown as Record<string, unknown>)[callbackName] = previous;
      } else {
        delete (window as unknown as Record<string, unknown>)[callbackName];
      }
    };
  }, [profileId, badge, code, callbackName]);

  if (!profileId || !code) return null;

  return (
    <div className={`psychology-today-badge ${className}`.trim()}>
      <a
        ref={anchorRef}
        href={`https://www.psychologytoday.com/profile/${profileId}`}
        className="sx-verified-seal"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Verified by Psychology Today"
      />
    </div>
  );
}
