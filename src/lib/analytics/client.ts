"use client";

import {
  EVENT_BOOK_CALL,
  EVENT_PAGEVIEW,
  EVENT_PRESENCE,
  LIVE_HEARTBEAT_MS,
} from "./catalog";
import { normalizePath } from "./path";

const VISITOR_KEY = "twr_vid";
const SESSION_KEY = "twr_sid";

type TrackableName =
  | typeof EVENT_PAGEVIEW
  | typeof EVENT_BOOK_CALL
  | typeof EVENT_PRESENCE;

let lastPath = "";
let lastAt = 0;

function storageId(storage: Storage, key: string) {
  try {
    let value = storage.getItem(key);
    if (!value) {
      value = crypto.randomUUID();
      storage.setItem(key, value);
    }
    return value;
  } catch {
    return null;
  }
}

function inStudioPreview() {
  try {
    return window.self !== window.top;
  } catch {
    return true;
  }
}

function send(payload: Record<string, unknown>) {
  const body = JSON.stringify(payload);
  const blob = new Blob([body], { type: "application/json" });
  try {
    if (payload.name === EVENT_BOOK_CALL && navigator.sendBeacon) {
      navigator.sendBeacon("/api/analytics/collect", blob);
      return;
    }
  } catch {
    // Fall through to fetch.
  }
  void fetch("/api/analytics/collect", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body,
    keepalive: true,
  }).catch(() => {
    try {
      navigator.sendBeacon?.("/api/analytics/collect", blob);
    } catch {
      // Ignore tracker failures.
    }
  });
}

export function trackSiteEvent(input: {
  name: TrackableName;
  path?: string;
  location?: string;
}) {
  if (typeof window === "undefined" || inStudioPreview()) return;
  const path = normalizePath(input.path || window.location.pathname);
  if (!path) return;
  send({
    name: input.name,
    path,
    location: input.location,
    referrer: document.referrer || undefined,
    visitorId: storageId(localStorage, VISITOR_KEY),
    sessionId: storageId(sessionStorage, SESSION_KEY),
  });
}

export function trackPageview(path: string) {
  const now = Date.now();
  if (path === lastPath && now - lastAt < 1500) return;
  lastPath = path;
  lastAt = now;
  trackSiteEvent({ name: EVENT_PAGEVIEW, path });
}

/** Track a Get in touch / contact conversion click. Location is required. */
export function trackContactClick(location: string) {
  if (!location) return;
  trackSiteEvent({ name: EVENT_BOOK_CALL, location });
}

/** @deprecated Use trackContactClick */
export function trackBookCall(location: string) {
  trackContactClick(location);
}

export function startPresence() {
  if (typeof window === "undefined" || inStudioPreview()) return () => {};

  const beat = () => {
    if (document.visibilityState !== "visible") return;
    trackSiteEvent({ name: EVENT_PRESENCE, path: window.location.pathname });
  };

  beat();
  const timer = window.setInterval(beat, LIVE_HEARTBEAT_MS);
  document.addEventListener("visibilitychange", beat);
  return () => {
    window.clearInterval(timer);
    document.removeEventListener("visibilitychange", beat);
  };
}
