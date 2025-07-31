import { Suspense } from 'react'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import IpaPageClient from './IpaPageClient'
import { generateIpaMetadata } from './metadata'

// Server-side data fetching
async function getIpaData() {
    try {
        const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.crackmarket.xyz'
        
        // Fetch initial IPAs data
        const response = await fetch(`${API_BASE_URL}/api/v1/ipa?page=1&limit=12&sort=createdAt&order=desc`, {
            next: { revalidate: 300 } // Revalidate every 5 minutes
        })
        
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`)
        }
        
        const data = await response.json()
        
        if (!data.success) {
            throw new Error(data.message || 'Failed to fetch IPAs')
        }
        
        return data.data
    } catch (error) {
        console.error('Error fetching IPA data:', error)
        return {
            ipas: [],
            pagination: {
                currentPage: 1,
                totalPages: 1,
                totalItems: 0,
                hasNext: false,
                hasPrev: false,
                limit: 12
            }
        }
    }
}

// Server-side stats fetching
async function getIpaStats() {
    try {
        const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.crackmarket.xyz'
        
        const response = await fetch(`${API_BASE_URL}/api/v1/ipa/stats`, {
            next: { revalidate: 3600 } // Revalidate every hour
        })
        
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`)
        }
        
        const data = await response.json()
        
        if (data.success) {
            return data.data
        }
        
        throw new Error(data.message || 'Failed to fetch stats')
    } catch (error) {
        console.error('Error fetching IPA stats:', error)
        return {
            totalIpas: 0,
            totalDownloads: 0,
            averageRating: 0,
            activeUsers: 0
        }
    }
}

// Generate metadata
export async function generateMetadata() {
    const stats = await getIpaStats()
    return generateIpaMetadata(stats)
}

export default async function IpaPage() {
    // Fetch data server-side
    const [initialData, initialStats] = await Promise.all([
        getIpaData(),
        getIpaStats()
    ])
    
    return (
        <Suspense fallback={
            <div className="flex justify-center items-center min-h-screen">
                <LoadingSpinner />
            </div>
        }>
            <IpaPageClient 
                initialData={initialData}
                initialStats={initialStats}
            />
        </Suspense>
    )
}
