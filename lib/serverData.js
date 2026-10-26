import "server-only";
import { LOCAL_API_URL, RENDER_API_URL, normalizeApiUrl } from "./api";

export const CONTENT_TAG = "public-content";
export const CONTENT_REVALIDATE_SECONDS = 60;

function candidateBases() {
  const env = process.env.NEXT_PUBLIC_API_URL;
  const cleanEnv = env ? normalizeApiUrl(env) : "";
  const bases = [];

  if (cleanEnv) {
    bases.push(cleanEnv);
  }

  if (process.env.NODE_ENV !== "production") {
    bases.push(LOCAL_API_URL);
    bases.push(RENDER_API_URL);
  } else {
    bases.push(RENDER_API_URL);
  }

  return [...new Set(bases.filter(Boolean))];
}

/**
 * Fetches every public section (settings, courses, sections, mentors, moments)
 * on the server. Result is cached by Next (ISR) and invalidated instantly by the
 * CRM through /api/revalidate, so the first paint always shows real content.
 */
export async function getPublicContent() {
  for (const base of candidateBases()) {
    try {
      const res = await fetch(`${base}/public/all`, {
        next: { revalidate: CONTENT_REVALIDATE_SECONDS, tags: [CONTENT_TAG] },
        signal: AbortSignal.timeout(12000),
      });
      if (!res.ok) continue;
      const json = await res.json();
      if (json?.success && json.data) return json.data;
    } catch {
      // try next candidate
    }
  }
  return null;
}
