"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { startPresence, trackPageview } from "@/lib/analytics/client";

export function SiteAnalytics() {
  const pathname = usePathname();

  useEffect(() => {
    if (!pathname) return;
    if (pathname.startsWith("/admin") || pathname.startsWith("/studio")) return;
    trackPageview(pathname);
  }, [pathname]);

  useEffect(() => {
    if (pathname?.startsWith("/admin") || pathname?.startsWith("/studio")) {
      return;
    }
    return startPresence();
  }, [pathname]);

  return null;
}
