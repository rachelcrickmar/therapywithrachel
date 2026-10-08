import { PsychologyTodayBadge } from "@/components/PsychologyTodayBadge";
import type { SiteBadge } from "@/lib/badges";
import type { PsychologyTodayPlacement } from "@/lib/psychology-today";

export function DirectoryBadges({
  badges,
  placement,
  className = "",
}: {
  badges: SiteBadge[];
  placement: PsychologyTodayPlacement;
  className?: string;
}) {
  const visible = badges.filter((badge) => badge.placements.includes(placement));
  if (!visible.length) return null;

  return (
    <div className={`directory-badges flex flex-wrap items-center gap-3 ${className}`.trim()}>
      {visible.map((badge) =>
        badge.kind === "psychologyToday" ? (
          <PsychologyTodayBadge
            key={badge.id}
            profileId={badge.profileId}
            badge={badge.badge}
            code={badge.code}
          />
        ) : (
          <a
            key={badge.id}
            href={badge.href}
            className="directory-badge"
            target="_blank"
            rel="noopener noreferrer"
          >
            {/* eslint-disable-next-line @next/next/no-img-element -- directory CDNs and data URLs */}
            <img src={badge.src} alt={badge.alt} decoding="async" />
          </a>
        ),
      )}
    </div>
  );
}
