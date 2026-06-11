import { getSession } from "@/lib/auth/session";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { ips } = (await req.json()) as { ips: string[] };
  if (!ips || !Array.isArray(ips)) {
    return NextResponse.json({ error: "Missing ips array" }, { status: 400 });
  }

  const unique = [...new Set(ips)]
    .filter((ip) => ip !== "unknown" && !ip.startsWith("127.") && !ip.startsWith("::"))
    .slice(0, 100);

  if (unique.length === 0) {
    return NextResponse.json({ geoMap: {} });
  }

  try {
    const batch = unique.map((query) => ({
      query,
      fields: "query,lat,lon,country,city,status",
    }));

    const res = await fetch(
      "http://ip-api.com/batch?fields=query,lat,lon,country,city,status",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(batch),
      }
    );

    if (!res.ok) {
      return NextResponse.json({ geoMap: {} });
    }

    const data = await res.json();
    const geoMap: Record<string, { lat: number; lon: number; country: string; city: string }> = {};

    if (Array.isArray(data)) {
      for (const item of data) {
        if (item.status === "success") {
          geoMap[item.query] = {
            lat: item.lat,
            lon: item.lon,
            country: item.country,
            city: item.city,
          };
        }
      }
    }

    return NextResponse.json({ geoMap });
  } catch {
    return NextResponse.json({ geoMap: {} });
  }
}
