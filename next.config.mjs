// next.config.mjs
import nextPWA from "@ducanh2912/next-pwa";

// Konfigurasi plugin PWA
const withPWA = nextPWA({
  dest: "public",                          // sw.js akan digenerate ke /public
  register: true,                          // auto-registrasi SW
  skipWaiting: true,                       // SW baru langsung aktif
  disable: process.env.NODE_ENV === "development", // matikan caching saat dev
  // workboxOptions: { }                    // (opsional) custom Workbox
});

// Konfigurasi Next.js milikmu (dipertahankan)
const baseConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
    dangerouslyAllowSVG: true,
    contentSecurityPolicy:
      "default-src 'self'; frame-ancestors 'none'; img-src 'self' data: https:; style-src 'unsafe-inline';",
    remotePatterns: [
      { protocol: "https", hostname: "lh3.googleusercontent.com" },
      { protocol: "https", hostname: "*.googleusercontent.com" },
      { protocol: "https", hostname: "avatars.githubusercontent.com" },
      { protocol: "https", hostname: "gravatar.com" },
      { protocol: "https", hostname: "*.gravatar.com" },
      { protocol: "https", hostname: "res.cloudinary.com" },
      { protocol: "https", hostname: "*.cloudinary.com" },
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "i.pravatar.cc" },
      { protocol: "https", hostname: "cdn.discordapp.com" },
      { protocol: "https", hostname: "media.discordapp.net" },
      { protocol: "https", hostname: "graph.facebook.com" },
      { protocol: "https", hostname: "platform-lookaside.fbsbx.com" },
      { protocol: "https", hostname: "*.fbcdn.net" },
      { protocol: "https", hostname: "pbs.twimg.com" },
      { protocol: "https", hostname: "abs.twimg.com" },
      { protocol: "https", hostname: "static-cdn.jtvnw.net" },
    ],
  },
};

// Bungkus config dengan PWA dan export
const nextConfig = withPWA(baseConfig);
export default nextConfig;
