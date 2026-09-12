export const apiVersion =
  process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2025-01-01";

export const dataset =
  process.env.NEXT_PUBLIC_SANITY_DATASET || "production";

/** Public project id — safe to fallback so production still reads CMS content */
export const projectId =
  process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "7bqhkhgx";

export const hasSanityConfig = Boolean(projectId);

export function assertSanityConfig() {
  if (!projectId) {
    throw new Error(
      "Missing NEXT_PUBLIC_SANITY_PROJECT_ID. Add Rachel's Sanity project ID to .env.local.",
    );
  }
}
