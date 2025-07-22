import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { AuthProvider } from "@/contexts/AuthContext";
import { generatePageMetadata, jsonLd, organizationJsonLd } from './metadata';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_API_URL?.replace('/api/v1', '') || 'http://localhost:3000'),
  title: 'AppsCracked - Free Software Downloads',
  description: 'Download free cracked software and applications safely',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="dark scroll-smooth">
      <head>
      <meta name="monetag" content="e441af84d95b06ad46cb441048bc22c9"/>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
        <meta name="theme-color" content="#1a1a1a" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gray-900 text-white min-h-screen relative overflow-x-hidden`}
      >
        {/* Background Pattern Layer */}
        <div className="fixed inset-0 z-0">
          {/* Base gradient background */}
          <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-gray-900 to-black"></div>
          
          {/* Animated dot pattern */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.02)_1px,transparent_0)] [background-size:50px_50px] opacity-60 animate-pulse"></div>
          
          {/* Moving gradient orbs */}
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-red-500/5 via-orange-500/5 to-yellow-500/5 rounded-full blur-3xl animate-pulse opacity-70"></div>
          <div className="absolute top-3/4 right-1/4 w-80 h-80 bg-gradient-to-r from-purple-500/5 via-pink-500/5 to-red-500/5 rounded-full blur-3xl animate-pulse delay-1000 opacity-60"></div>
          <div className="absolute bottom-1/4 left-1/3 w-64 h-64 bg-gradient-to-r from-blue-500/5 via-cyan-500/5 to-teal-500/5 rounded-full blur-3xl animate-pulse delay-2000 opacity-50"></div>
          
          {/* Subtle line pattern */}
          <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent_24px,rgba(255,255,255,0.01)_25px,rgba(255,255,255,0.01)_26px,transparent_27px,transparent_49px,rgba(255,255,255,0.01)_50px),linear-gradient(rgba(255,255,255,0.01)_24px,transparent_25px,transparent_26px,rgba(255,255,255,0.01)_27px,rgba(255,255,255,0.01)_49px,transparent_50px)] [background-size:50px_50px]"></div>
        </div>

        {/* Vignette effect */}
        <div className="fixed inset-0 z-10 pointer-events-none bg-[radial-gradient(ellipse_at_center,transparent_0%,transparent_60%,rgba(0,0,0,0.3)_100%)]"></div>

        <AuthProvider>
          <div className="relative z-20 flex flex-col min-h-screen">
            {/* Header with enhanced shadow */}
            <div className="relative">
              <Header />
              {/* Header glow effect */}
              <div className="absolute -bottom-10 left-0 right-0 h-10 bg-gradient-to-b from-red-500/10 to-transparent blur-xl pointer-events-none"></div>
            </div>
            
            {/* Main content area */}
            <main className="flex-1 relative">
              {/* Content wrapper with enhanced styling */}
              <div className="relative min-h-full">
                {/* Subtle content background */}
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/10 to-transparent pointer-events-none"></div>
                
                {/* Main content */}
                <div className="relative z-10 min-h-full">
                  {children}
                </div>
                
                {/* Floating particles effect */}
                <div className="absolute inset-0 pointer-events-none overflow-hidden">
                  <div className="absolute top-1/4 left-1/4 w-1 h-1 bg-red-400/30 rounded-full animate-ping delay-0"></div>
                  <div className="absolute top-1/2 right-1/3 w-1 h-1 bg-blue-400/30 rounded-full animate-ping delay-1000"></div>
                  <div className="absolute bottom-1/3 left-1/2 w-1 h-1 bg-purple-400/30 rounded-full animate-ping delay-2000"></div>
                  <div className="absolute top-3/4 left-1/5 w-1 h-1 bg-green-400/30 rounded-full animate-ping delay-3000"></div>
                  <div className="absolute bottom-1/4 right-1/4 w-1 h-1 bg-yellow-400/30 rounded-full animate-ping delay-4000"></div>
                </div>
              </div>
            </main>
            
            {/* Footer with enhanced shadow */}
            <div className="relative">
              {/* Footer glow effect */}
              <div className="absolute -top-10 left-0 right-0 h-10 bg-gradient-to-t from-red-500/10 to-transparent blur-xl pointer-events-none"></div>
              <Footer />
            </div>
          </div>
        </AuthProvider>


      </body>
    </html>
  );
}
