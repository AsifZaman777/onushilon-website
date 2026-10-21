import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

/**
 * Ensures image URLs invalidate client, browser, and CDN cache when modified or reloaded
 */
export function cacheBustUrl(url, customVersion = null) {
  if (!url || typeof url !== "string") return url || "";
  if (url.startsWith("data:") || url.startsWith("blob:") || url.endsWith(".svg")) return url;
  const version = customVersion || Date.now();
  const [base, query] = url.split("?");
  const params = new URLSearchParams(query || "");
  params.set("v", version);
  return `${base}?${params.toString()}`;
}
