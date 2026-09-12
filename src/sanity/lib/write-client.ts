import { createClient } from "@sanity/client";
import { apiVersion, dataset, projectId } from "../env";

export function getWriteClient() {
  const token = process.env.SANITY_API_WRITE_TOKEN;

  if (!projectId) {
    throw new Error("Sanity project is not configured.");
  }

  if (!token) {
    throw new Error(
      "SANITY_API_WRITE_TOKEN is not set. Create an Editor token in Rachel's Sanity project.",
    );
  }

  return createClient({
    projectId,
    dataset,
    apiVersion,
    useCdn: false,
    token,
  });
}
