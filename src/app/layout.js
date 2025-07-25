import { Inter } from 'next/font/google'
import './globals.css'
import { AuthProvider } from '@/contexts/AuthContext'
import { AdvertisingProvider } from '@/contexts/AdvertisingContext'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import AdModal from '@/components/AdModal'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_API_URL?.replace('/api/v1', '') || 'http://localhost:3000'),
  title: 'AppsCracked - Free Software Downloads',
  description: 'Download free cracked software and applications safely',
}

export default function RootLayout({ children }) {
  console.log('=== RootLayout rendering AdModal ===')
  
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <AdvertisingProvider>
            <div className="min-h-screen flex flex-col">
              <Header />
              <main className="flex-1 ">
                {children}
              </main>
              <Footer />
              <AdModal />
            </div>
          </AdvertisingProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
