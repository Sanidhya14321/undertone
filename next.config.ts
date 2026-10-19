import type { NextConfig } from "next";
const nextConfig: NextConfig = {
  poweredByHeader: false,
  reactStrictMode: true,
  async redirects() {
    // Keep /studio and its API on the old origin so existing local work stays reachable.
    const migratedPages = ['/', '/home', '/features/:path*', '/guides/:path*', '/extension', '/help', '/privacy', '/robots.txt', '/sitemap.xml', '/opengraph-image'];
    return [
      ...migratedPages.map(source => ({ source, has: [{ type: 'host' as const, value: 'undertone-voice-workspace.vercel.app' }], destination: `https://undertone.vercel.app${source === '/home' ? '/' : source}`, permanent: true })),
      { source: '/home', destination: '/', permanent: true },
    ];
  },
  async headers() {
    return [
      { source: '/:path*', headers: [
        { key: 'X-Content-Type-Options', value: 'nosniff' },
        { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
        { key: 'X-Frame-Options', value: 'DENY' },
        { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
      ] },
      { source: '/api/:path*', headers: [{ key: 'X-Robots-Tag', value: 'noindex, nofollow' }] },
      { source: '/studio', headers: [{ key: 'X-Robots-Tag', value: 'noindex, nofollow' }] },
    ];
  },
};
export default nextConfig;
