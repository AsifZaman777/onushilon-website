/**
 * Onushilon Website API Client
 * Connects the public Next.js frontend to the Express + Supabase backend
 */

export const LOCAL_API_URL = "http://localhost:5000/api/v1";
export const RENDER_API_URL = "https://onushilon-crm-backend.onrender.com/api/v1";

/**
 * Normalizes an API base URL by stripping trailing slashes or /health and
 * ensuring the /api/v1 prefix is appended.
 */
export function normalizeApiUrl(url) {
  if (!url || typeof url !== "string") return "";
  const cleaned = url.trim().replace(/\/health\/?$/, "").replace(/\/+$/, "");
  if (!cleaned) return "";
  return cleaned.endsWith("/api/v1") ? cleaned : `${cleaned}/api/v1`;
}

function resolveApiBase() {
  const envUrl = process.env.NEXT_PUBLIC_API_URL;
  if (envUrl && envUrl.trim()) {
    return normalizeApiUrl(envUrl);
  }
  return process.env.NODE_ENV === "production" ? RENDER_API_URL : LOCAL_API_URL;
}

export const API_BASE = resolveApiBase();

/** Origin of the CRM backend (without /api/v1) — used to resolve /uploads/* media. */
export const BACKEND_ORIGIN = API_BASE.replace(/\/api\/v1$/, "");

export function getApiCandidateUrls() {
  const urls = [];

  // 1. Primary configured base URL
  if (API_BASE) {
    urls.push(API_BASE);
  }

  // 2. In browser on localhost or during local development, ensure local server is checked
  const isLocalHost =
    typeof window !== "undefined" &&
    (window.location.hostname === "localhost" ||
      window.location.hostname === "127.0.0.1" ||
      window.location.hostname === "0.0.0.0");

  if ((isLocalHost || process.env.NODE_ENV !== "production") && !urls.includes(LOCAL_API_URL)) {
    urls.push(LOCAL_API_URL);
  }

  // 3. Fallback to production Render server
  if (!urls.includes(RENDER_API_URL)) {
    urls.push(RENDER_API_URL);
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
    const json = await res.json().catch(() => ({}));
    if (!res.ok) {
      return { success: false, message: json.message || "Could not submit your request." };
    }
    return json;
  } catch (err) {
    console.warn("Could not submit lead to backend:", err.message);
    return { success: false, message: "Network error. Please try again." };
  }
}

