import { projectId } from "@/sanity/env";

export async function isSanityProjectMember(token: string) {
  const response = await fetch(`https://api.sanity.io/v2021-06-07/projects/${projectId}`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: "no-store",
  });
  return response.ok;
}

export async function requireStudioUser(request: Request) {
  const header = request.headers.get("authorization") || "";
  const token = header.replace(/^Bearer\s+/i, "").trim();
  if (!token) return false;
  try {
    return await isSanityProjectMember(token);
  } catch {
    return false;
  }
}
