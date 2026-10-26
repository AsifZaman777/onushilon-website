import { NextResponse } from "next/server";
import { LOCAL_API_URL, RENDER_API_URL, normalizeApiUrl } from "../../../lib/api";

export const dynamic = "force-dynamic";

export async function GET() {
  const envUrl = process.env.NEXT_PUBLIC_API_URL;
  const cleanEnvUrl = envUrl ? normalizeApiUrl(envUrl) : null;
  const isProd = process.env.NODE_ENV === "production";
  const primaryUrl = cleanEnvUrl || (isProd ? RENDER_API_URL : LOCAL_API_URL);

  const candidateUrls = Array.from(
    new Set(
      [
        primaryUrl,
        isProd ? RENDER_API_URL : LOCAL_API_URL,
        LOCAL_API_URL,
        "http://127.0.0.1:5000/api/v1",
        RENDER_API_URL,
      ].filter(Boolean)
    )
  );

  let backendHealth = null;

  for (const baseUrl of candidateUrls) {
    try {
      const res = await fetch(`${baseUrl}/health`, {
        cache: "no-store",
        headers: { "Cache-Control": "no-cache" },
      });
      if (res.ok) {
        backendHealth = await res.json();
        break;
      }
    } catch {
      // Try next candidate URL
    }
  }

  if (!backendHealth) {
    backendHealth = {
      status: "unreachable",
      checkedUrls: candidateUrls,
    };
  }

  return NextResponse.json(
    {
      status: "ok",
      service: "Onushilon Website Frontend (Next.js)",
      timestamp: new Date().toISOString(),
      backend: backendHealth,
    },
    {
      status: 200,
      headers: {
        "Cache-Control": "no-store, no-cache, must-revalidate",
      },
    }
  );
}
