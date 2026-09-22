"use client";

import { useEffect } from "react";

const SCRIPT_ID = "psychology-today-verified-seal";

export type PsychologyTodayBadgeProps = {
  profileId: string;
  badge: string;
  code: string;
  className?: string;
};

/**
 * Psychology Today verified seal embed.
 * Loads their script once per page; safe to mount in multiple placements.
 */
export function PsychologyTodayBadge({
  profileId,
  badge,
  code,
  className = "",
}: PsychologyTodayBadgeProps) {
  useEffect(() => {
    if (!profileId || !code) return;

    const existing = document.getElementById(SCRIPT_ID) as HTMLScriptElement | null;
    if (existing) {
      // Re-run if their script exposes a global refresh (many badge scripts re-scan on load only).
      existing.dataset.badge = badge;
      existing.dataset.id = profileId;
      existing.dataset.code = code;
      return;
    }

    const script = document.createElement("script");
    script.id = SCRIPT_ID;
    script.src = "https://member.psychologytoday.com/verified-seal.js";
    script.async = true;
    script.dataset.badge = badge;
    script.dataset.id = profileId;
    script.dataset.code = code;
    document.body.appendChild(script);
  }, [profileId, badge, code]);

  if (!profileId || !code) return null;

  return (
    <div className={`psychology-today-badge ${className}`.trim()}>
      <a
        href={`https://www.psychologytoday.com/profile/${profileId}`}
        className="sx-verified-seal"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Verified by Psychology Today"
      />
    </div>
  );
}
