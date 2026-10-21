import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  const envUrl = process.env.NEXT_PUBLIC_API_URL;
  const cleanEnvUrl = envUrl
    ? envUrl.replace(/\/health\/?$/, "").replace(/\/+$/, "")
    : null;

  const candidateUrls = Array.from(
    new Set(
      [
        cleanEnvUrl,
        "https://onushilon-crm-backend.onrender.com/api/v1",
        "http://127.0.0.1:5000/api/v1",
        "http://localhost:5000/api/v1",
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
