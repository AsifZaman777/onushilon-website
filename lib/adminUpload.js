/**
 * Browser helpers used by the CRM for fast, observable image uploads.
 */

const MAX_DIMENSION = 1920;
const WEBP_QUALITY = 0.86;

/**
 * Downscales large photos and converts them to WebP before upload. Typically
 * shrinks multi-MB phone photos to a few hundred KB, which makes uploads (and
 * the public site) much faster. GIF/SVG/WebP files are sent untouched.
 */
export async function compressImage(file) {
  const skip = ["image/gif", "image/svg+xml", "image/webp", "image/avif"];
  if (skip.includes(file.type) || typeof createImageBitmap !== "function") return file;

  try {
    const bitmap = await createImageBitmap(file);
    const scale = Math.min(1, MAX_DIMENSION / Math.max(bitmap.width, bitmap.height));
    const width = Math.round(bitmap.width * scale);
    const height = Math.round(bitmap.height * scale);

    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    canvas.getContext("2d").drawImage(bitmap, 0, 0, width, height);
    bitmap.close?.();

    const blob = await new Promise((resolve) =>
      canvas.toBlob(resolve, "image/webp", WEBP_QUALITY),
    );
    if (!blob || blob.size >= file.size) return file; // keep original if not smaller

    const baseName = file.name.replace(/\.[^.]+$/, "");
    return new File([blob], `${baseName}.webp`, { type: "image/webp" });
  } catch {
    return file;
  }
}

/**
 * Uploads a file through XHR so the UI can show real progress.
 * Resolves with the parsed JSON body or rejects with an Error(message).
 */
export function uploadWithProgress({ url, token, file, folder, onProgress }) {
  return new Promise((resolve, reject) => {
    const form = new FormData();
    form.append("image", file);
    form.append("folder", folder);

    const xhr = new XMLHttpRequest();
    xhr.open("POST", url);
    if (token) xhr.setRequestHeader("Authorization", `Bearer ${token}`);

    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable && onProgress) {
        // Cap at 95%: the last bit is the server storing + cataloguing the file
        onProgress(Math.min(95, Math.round((event.loaded / event.total) * 100)));
      }
    };
    xhr.onload = () => {
      let body = {};
      try {
        body = JSON.parse(xhr.responseText || "{}");
      } catch {}
      if (xhr.status >= 200 && xhr.status < 300) {
        onProgress?.(100);
        resolve(body);
      } else if (xhr.status === 401) {
        reject(new Error("Unauthorized"));
      } else {
        reject(new Error(body.message || `Upload failed (${xhr.status})`));
      }
    };
    xhr.onerror = () => reject(new Error("Network error while uploading"));
    xhr.ontimeout = () => reject(new Error("Upload timed out"));
    xhr.timeout = 120000;
    xhr.send(form);
  });
}
