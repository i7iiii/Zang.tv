// =========================================================
//  ZangTV — Root Layout
// =========================================================
import type { Metadata, Viewport } from 'next'
import './globals.css'
import { Providers } from '@/components/layout/Providers'

export const metadata: Metadata = {
  title: { default: 'ZangTV — کەناڵە زیندووەکان', template: '%s | ZangTV' },
  description: 'بینینی کەناڵە کوردی و جیهانییەکان بە خێرایی بەرز و کوالیتی HD',
  keywords: ['ZangTV', 'کەناڵی کوردی', 'live tv', 'kurdish tv', 'kurdsat', 'rudaw'],
  authors: [{ name: 'b7ir' }],
  creator: 'ZangTV',
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://zangtv.com'),
  openGraph: {
    type: 'website',
    siteName: 'ZangTV',
    title: 'ZangTV — کەناڵە زیندووەکان',
    description: 'بینینی کەناڵە کوردی و جیهانییەکان',
  },
  twitter: { card: 'summary_large_image' },
  robots: { index: true, follow: true },
  manifest: '/manifest.json',
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
}

export const viewport: Viewport = {
  themeColor: '#07060F',
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ku" dir="rtl" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Readex+Pro:wght@300;400;500;600;700&family=Space+Grotesk:wght@400;500;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
