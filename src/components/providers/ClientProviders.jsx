'use client'

import { AuthProvider } from '@/contexts/AuthContext'
import { AdvertisingProvider } from '@/contexts/AdvertisingContext'
import LayoutWrapper from '@/components/layout/LayoutWrapper'
import AdModal from '@/components/AdModal'

export default function ClientProviders({ children }) {
    return (
        <AuthProvider>
            <AdvertisingProvider>
                <LayoutWrapper>
                    {children}
                </LayoutWrapper>
                <AdModal />
            </AdvertisingProvider>
        </AuthProvider>
    )
}
