import type { MetadataRoute } from "next";
import { samplePosts } from "@/lib/content";
import { getSiteUrl } from "@/lib/site";
import { sanityFetch } from "@/sanity/lib/client";
import { postSlugsQuery } from "@/sanity/lib/queries";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = getSiteUrl();
  const slugs = await sanityFetch<string[]>({ query: postSlugsQuery });
  const postSlugs = new Set([...(slugs || []), ...samplePosts.map((p) => p.slug)]);

  const staticRoutes = ["", "/about", "/rates", "/blog", "/contact", "/privacy"].map(
    (path) => ({
      url: `${base}${path}`,
      lastModified: new Date(),
    }),
  );

  const postRoutes = [...postSlugs].map((slug) => ({
    url: `${base}/blog/${slug}`,
    lastModified: new Date(),
  }));

  return [...staticRoutes, ...postRoutes];
}
