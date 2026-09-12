import { defaultServices, type Service } from "@/lib/content";
import { sanityFetch } from "@/sanity/lib/client";
import { servicesQuery } from "@/sanity/lib/queries";

export async function getServices(): Promise<Service[]> {
  const fromCms = await sanityFetch<Service[]>({
    query: servicesQuery,
    tags: ["service"],
  });

  if (fromCms && fromCms.length > 0) return fromCms;
  return defaultServices;
}
