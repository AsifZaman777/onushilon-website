import Image from "next/image";
import { BACKEND_ORIGIN } from "../lib/api";
import { resolveMediaUrl } from "../lib/utils";

/**
 * Renders CMS images through the Next.js image optimizer (AVIF/WebP, responsive
 * srcset, lazy loading). Fills its (position: relative) parent by default.
 */
export default function SmartImage({
  src,
  alt = "",
  sizes = "(max-width: 768px) 100vw, 50vw",
  priority = false,
  quality = 75,
  className,
  style,
  width,
  height,
}) {
  const resolved = resolveMediaUrl(src, BACKEND_ORIGIN);
  if (!resolved) return null;

  const sizing =
    width && height ? { width, height } : { fill: true };

  return (
    <Image
      src={resolved}
      alt={alt}
      sizes={sizes}
      priority={priority}
      quality={quality}
      className={className}
      style={style}
      {...sizing}
    />
  );
}
