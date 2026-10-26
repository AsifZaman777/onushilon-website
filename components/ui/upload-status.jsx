import React from "react";
import { Loader2 } from "lucide-react";

/** Thumbnail + determinate progress bar shown while an image uploads. */
export function UploadStatus({ preview, progress, label = "Uploading image" }) {
  if (progress === null || progress === undefined) return null;
  const done = progress >= 100;
  return (
    <div
      className="flex items-center gap-3 rounded-lg border border-blue-200 bg-blue-50 p-3"
      role="status"
      aria-live="polite"
    >
      {preview ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={preview} alt="" className="h-12 w-12 shrink-0 rounded-md object-cover" />
      ) : (
        <div className="h-12 w-12 shrink-0 animate-pulse rounded-md bg-blue-100" />
      )}
      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between text-xs font-semibold text-blue-800">
          <span className="flex items-center gap-1.5">
            <Loader2 size={13} className={done ? "" : "animate-spin"} />
            {done ? "Finalising…" : label}
          </span>
          <span>{progress}%</span>
        </div>
        <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-blue-100">
          <div
            className="h-full rounded-full bg-blue-600 transition-all duration-200"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </div>
  );
}
