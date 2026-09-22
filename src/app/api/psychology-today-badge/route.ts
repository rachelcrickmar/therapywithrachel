import { NextRequest } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type SealPayload = {
  name?: string;
  badgeId?: number | string;
  image?: {
    content?: string;
    dimensions?: { width?: number; height?: number };
  };
};

function decodeCode(code: string) {
  try {
    return atob(code.trim().replace(/[“”‘’\s]/g, ""));
  } catch {
    return "";
  }
}

/**
 * Proxy Psychology Today's verified-seal JSON.
 * Their JSONP endpoint returns Content-Type: application/json, which browsers
 * refuse to execute as a <script>, so the official embed never paints in SPA/React.
 */
export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const profileId = (searchParams.get("profileId") || "").trim();
  const badge = (searchParams.get("badge") || "13").trim();
  const code = (searchParams.get("code") || "").trim();

  if (!profileId || !/^\d+$/.test(profileId)) {
    return Response.json({ error: "Invalid profile." }, { status: 400 });
  }

  let apiUrl = "";
  if (code) {
    apiUrl = decodeCode(code)
      .replace("[BADGE]", badge)
      .replace("[PROFILE_ID]", String(parseInt(profileId, 10)));
  }
  if (!apiUrl.startsWith("https://www.psychologytoday.com/")) {
    apiUrl = `https://www.psychologytoday.com/api/verified-seal/seals/${encodeURIComponent(badge)}/profile/${encodeURIComponent(profileId)}`;
  }

  try {
    const url = new URL(apiUrl);
    url.searchParams.delete("callback");

    const upstream = await fetch(url.toString(), {
      headers: { Accept: "application/json" },
      next: { revalidate: 86400 },
    });

    if (!upstream.ok) {
      return Response.json(
        { error: "Seal upstream failed." },
        { status: 502 },
      );
    }

    const text = await upstream.text();
    const start = text.indexOf("{");
    const end = text.lastIndexOf("}");
    if (start < 0 || end <= start) {
      return Response.json({ error: "Seal response invalid." }, { status: 502 });
    }
    const payload = JSON.parse(text.slice(start, end + 1)) as SealPayload;

    if (!payload?.image?.content) {
      return Response.json({ error: "Seal missing image." }, { status: 502 });
    }

    return Response.json(payload, {
      headers: {
        "cache-control": "public, s-maxage=86400, stale-while-revalidate=604800",
      },
    });
  } catch (error) {
    console.error("psychology today seal proxy failed", error);
    return Response.json({ error: "Seal unavailable." }, { status: 502 });
  }
}
