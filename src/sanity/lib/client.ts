import { createClient } from "next-sanity";
import { apiVersion, dataset, hasSanityConfig, projectId } from "../env";

/**
 * Server client for public content.
 * Prefer a read token when available (private datasets / drafts).
 * Always time-revalidate so Admin publishes show up without a webhook.
 */
export const client = hasSanityConfig
  ? createClient({
      projectId,
      dataset,
      apiVersion,
      useCdn: true,
      token: process.env.SANITY_API_READ_TOKEN || undefined,
    })
  : null;

export async function sanityFetch<T>({
  query,
  params = {},
  revalidate = 30,
  tags = [],
}: {
  query: string;
  params?: Record<string, unknown>;
  revalidate?: number | false;
  tags?: string[];
}): Promise<T | null> {
  if (!client) return null;

  try {
    return await client.fetch<T>(query, params, {
      next: {
        // Never cache forever — Admin edits must appear on the live site
        revalidate: revalidate === false ? 30 : revalidate,
        tags,
      },
    });
  } catch (error) {
    console.error("Sanity fetch failed:", error);
    return null;
  }
}
