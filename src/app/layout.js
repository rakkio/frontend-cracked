import { Inter } from 'next/font/google'
import './globals.css'
import ClientProviders from '@/components/providers/ClientProviders'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_API_URL?.replace('/api/v1', '') || 'http://localhost:3000'),
  title: 'CrackMarket - Premium Cracked Software & Games',
  description: 'Download premium cracked software, games, Android APKs and iOS IPAs. Safe, fast and virus-free downloads with working cracks.',
  keywords: 'cracked software, free games, android apk, ios ipa, pc games, crack download',
  openGraph: {
    title: 'CrackMarket - Premium Cracked Software & Games',
    description: 'Download premium cracked software, games, Android APKs and iOS IPAs. Safe, fast and virus-free downloads.',
    type: 'website',
    url: 'https://crackmarket.xyz',
    siteName: 'CrackMarket'
  },
  twitter: {
    card: 'summary_large_image',
    title: 'CrackMarket - Premium Cracked Software & Games',
    description: 'Download premium cracked software, games, Android APKs and iOS IPAs. Safe, fast and virus-free downloads.'
  },
  robots: {
    index: true,
    follow: true
  }
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="dark">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
        <meta name="theme-color" content="#000000" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className={`${inter.className} antialiased overflow-x-hidden`}>
        <ClientProviders>
          {children}
        </ClientProviders>
      </body>
    </html>
  )
}
