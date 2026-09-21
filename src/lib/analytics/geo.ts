const COUNTRY_CODE = /^[A-Z]{2}$/;
const regionNames = new Intl.DisplayNames(["en"], { type: "region" });

export function geoFromHeaders(headers: Headers) {
  const countryRaw = (headers.get("x-vercel-ip-country") || "").trim().toUpperCase();
  const country = COUNTRY_CODE.test(countryRaw) ? countryRaw : null;
  const cityHeader = headers.get("x-vercel-ip-city") || "";
  let city = "";
  try {
    city = decodeURIComponent(cityHeader.replace(/\+/g, " ")).trim();
  } catch {
    city = cityHeader.trim();
  }
  city = city.replace(/\s+/g, " ").slice(0, 80);
  if (!city || /^unknown$/i.test(city)) city = "";
  return { country, city: city || null };
}

export function countryLabel(code: string) {
  try {
    return regionNames.of(code.toUpperCase()) || code;
  } catch {
    return code;
  }
}

export function cityLabel(city: string, country: string | null) {
  if (country) return `${city}, ${countryLabel(country)}`;
  return city;
}
