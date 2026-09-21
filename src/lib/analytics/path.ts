const IGNORED_PREFIXES = ["/admin", "/studio", "/api", "/_next"];

export function normalizePath(input: unknown) {
  if (typeof input !== "string" || !input.trim()) return null;
  try {
    const url = input.startsWith("http")
      ? new URL(input)
      : new URL(input, "https://therapywithrachel.com");
    let path = url.pathname || "/";
    if (path.length > 1 && path.endsWith("/")) path = path.slice(0, -1);
    path = path.replace(/\/{2,}/g, "/");
    if (!path.startsWith("/") || path.length > 180) return null;
    if (
      IGNORED_PREFIXES.some(
        (prefix) => path === prefix || path.startsWith(`${prefix}/`),
      )
    ) {
      return null;
    }
    return path;
  } catch {
    return null;
  }
}
