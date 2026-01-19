import type React from "react"
import type { Metadata, Viewport } from "next"
import { Geist, Geist_Mono, Noto_Sans_Arabic } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { LanguageProvider } from "@/contexts/language-context"
import { CartProvider } from "@/contexts/cart-context"
import { AuthProvider } from "@/contexts/auth-context"
import { SessionProvider } from "@/components/providers/session-provider"
import { LanguageSelector } from "@/components/language-selector"
import { Toaster } from "@/components/ui/sonner"
import "./globals.css"

const _geist = Geist({ subsets: ["latin"] })
const _geistMono = Geist_Mono({ subsets: ["latin"] })
const _notoArabic = Noto_Sans_Arabic({ subsets: ["arabic"], weight: ["400", "500", "600", "700"] })

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || process.env.NEXTAUTH_URL || 'http://localhost:3000'),
  title: {
    default: 'MOTIVEX | Pièces Auto Algérie',
    template: '%s | MOTIVEX'
  },
  description: 'MOTIVEX - Pièces de carrosserie et optique automobile en Algérie. قطع غيار الكاروسري والبصريات للسيارات في الجزائر. Livraison rapide, paiement COD et BaridiMob.',
  keywords: ['pièces auto', 's', 'carrosserie', 'optique', 'قطع غيار السيارات', 'الجزائر'],
  authors: [{ name: 'MOTIVEX' }],
  creator: 'MOTIVEX',
  publisher: 'MOTIVEX',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'fr_DZ',
    alternateLocale: 'ar_DZ',
    url: '/',
    siteName: 'MOTIVEX',
    title: 'MOTIVEX | Pièces Auto Algérie',
    description: 'Pièces de carrosserie et optique automobile en Algérie. Livraison rapide, paiement COD et BaridiMob.',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'MOTIVEX - Pièces Auto Algérie',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'MOTIVEX | Pièces Auto Algérie',
    description: 'Pièces auto en Algérie. COD & BaridiMob.',
    images: ['/og-image.jpg'],
  },
  icons: {
    icon: [{ url: '/icon.svg', type: 'image/svg+xml' }],
    apple: '/icon.svg',
  },
  manifest: '/manifest.webmanifest',
}

export const viewport: Viewport = {
  themeColor: "#2d3436",
  width: "device-width",
  initialScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="fr" dir="ltr" suppressHydrationWarning>
      <body className="font-sans antialiased">
        <SessionProvider>
          <LanguageProvider>
            <AuthProvider>
              <CartProvider>
                <LanguageSelector />
                {children}
                <Toaster position="top-center" />
              </CartProvider>
            </AuthProvider>
          </LanguageProvider>
        </SessionProvider>
        <Analytics />
      </body>
    </html>
  )
}
