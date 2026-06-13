/** @type {import('next').NextConfig} */
const nextConfig = {
  // RTL و کوردی پشتیوانی
  i18n: {
    locales: ['ku', 'ar', 'en'],
    defaultLocale: 'ku',
    localeDetection: false,
  },

  images: {
    remotePatterns: [
      { protocol: 'https', hostname: '**' },
    ],
  },

  // Security Headers
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-eval' 'unsafe-inline'",
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
              "font-src 'self' https://fonts.gstatic.com",
              "img-src 'self' data: https: blob:",
              "media-src 'self' https: blob:",
              "connect-src 'self' https: wss:",
            ].join('; '),
          },
        ],
      },
    ]
  },

  // API proxy بۆ development
  async rewrites() {
    return [
      {
        source: '/api/backend/:path*',
        destination: `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/:path*`,
      },
      // Stream proxy — لە production ئەمە Cloudflare Worker دەگرێتەوە
      {
        source: '/proxy/:path*',
        destination: `${process.env.NEXT_PUBLIC_STREAM_PROXY || 'http://localhost:8080'}/proxy/:path*`,
      },
    ]
  },

  experimental: {
    optimizePackageImports: ['lucide-react', 'framer-motion'],
  },
}

module.exports = nextConfig
