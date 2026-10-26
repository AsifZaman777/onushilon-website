/** Hostnames that serve CMS-managed images (Supabase bucket + CRM backend uploads). */
const remotePatterns = [
  { protocol: "https", hostname: "**.supabase.co", pathname: "/storage/v1/object/public/**" },
  { protocol: "https", hostname: "**.onrender.com", pathname: "/uploads/**" },
  { protocol: "http", hostname: "localhost", port: "5000", pathname: "/uploads/**" },
  { protocol: "http", hostname: "127.0.0.1", port: "5000", pathname: "/uploads/**" },
];

// Also allow a custom backend host configured through NEXT_PUBLIC_API_URL
try {
  if (process.env.NEXT_PUBLIC_API_URL) {
    const u = new URL(process.env.NEXT_PUBLIC_API_URL);
    remotePatterns.push({
      protocol: u.protocol.replace(":", ""),
      hostname: u.hostname,
      ...(u.port ? { port: u.port } : {}),
      pathname: "/uploads/**",
    });
  }
} catch {}

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60 * 60 * 24 * 30, // 30 days cache
    remotePatterns,
  },
  compress: true,
  poweredByHeader: false,
  experimental: {
    optimizePackageImports: ["lucide-react", "framer-motion", "recharts"],
  },
  async headers() {
    return [
      {
        source: "/images/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
