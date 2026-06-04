/** @type {import('next').NextConfig} */
const nextConfig = {
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "Content-Security-Policy",
            value: "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://www.google-analytics.com https://www.gstatic.com; font-src 'self' https://fonts.gstatic.com data:;",
          },
        ],
      },
    ];
  },
  async rewrites() {
    return [
      {
        source: '/gtag/js',
        destination: 'https://www.googletagmanager.com/gtag/js?id=G-CQ6W47R42W',
      },
      {
        source: '/g/collect',
        destination: 'https://www.google-analytics.com/g/collect',
      },
    ];
  },
};

module.exports = nextConfig;