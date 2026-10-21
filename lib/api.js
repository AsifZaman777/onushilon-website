/**
 * Onushilon Website API Client
 * Connects the public Next.js frontend to the Express + Supabase backend
 */

export const API_BASE =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";

export async function fetchPublicData() {
  try {
    const res = await fetch(`${API_BASE}/public/all?_t=${Date.now()}`, {
      cache: "no-store",
      headers: {
        "Cache-Control": "no-cache, no-store, must-revalidate",
        Pragma: "no-cache",
      },
    });
    if (!res.ok) return null;
    const json = await res.json();
    return json.success ? json.data : null;
  } catch (err) {
    // Graceful fallback to static assets if backend is starting or offline
    return null;
  }
}

export async function submitLead(leadData) {
  try {
    const res = await fetch(`${API_BASE}/public/leads`, {
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
