/**
 * Onushilon Website API Client
 * Connects the public Next.js frontend to the Express + Supabase backend
 */

export const API_BASE = (
  process.env.NEXT_PUBLIC_API_URL || "https://onushilon-crm-backend.onrender.com/api/v1"
)
  .replace(/\/health\/?$/, "")
  .replace(/\/+$/, "");

export function getApiCandidateUrls() {
  const envUrl = process.env.NEXT_PUBLIC_API_URL
    ? process.env.NEXT_PUBLIC_API_URL.replace(/\/health\/?$/, "").replace(/\/+$/, "")
    : null;
  const urls = [];

  // When testing in browser on localhost, check local backend first
  if (
    typeof window !== "undefined" &&
    (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1")
  ) {
    urls.push("http://localhost:5000/api/v1");
  }

  if (envUrl && !urls.includes(envUrl)) {
    urls.push(envUrl);
  }

  const defaultRender = "https://onushilon-crm-backend.onrender.com/api/v1";
  if (!urls.includes(defaultRender)) {
    urls.push(defaultRender);
  }

  return urls;
}

let activeApiBase = API_BASE;

export async function fetchPublicData() {
  const candidates = getApiCandidateUrls();

  for (const base of candidates) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 4000);
      const res = await fetch(`${base}/public/all?_t=${Date.now()}`, {
        cache: "no-store",
        signal: controller.signal,
        headers: {
          "Cache-Control": "no-cache, no-store, must-revalidate",
          Pragma: "no-cache",
        },
      });
      clearTimeout(timeoutId);
      if (res.ok) {
        const json = await res.json();
        if (json.success && json.data) {
          activeApiBase = base;
          return json.data;
        }
      }
    } catch (err) {
      // try next candidate endpoint
    }
  }

  return null;
}

export async function submitLead(leadData) {
  const base = activeApiBase || API_BASE;
  try {
    const res = await fetch(`${base}/public/leads`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(leadData),
    });
    const json = await res.json();
    return json;
  } catch (err) {
    console.warn("Could not submit lead to backend:", err.message);
    return { success: true, localOnly: true };
  }
}

