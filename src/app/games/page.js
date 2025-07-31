import { Suspense } from 'react'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import GamesPageClient from './GamesPageClient'
import { generateGamesMetadata } from './metadata'

// Server-side data fetching
async function getGamesData() {
    try {
        const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.crackmarket.xyz'
        
        // Fetch initial Games data
        const response = await fetch(`${API_BASE_URL}/api/v1/games?page=1&limit=12&sort=createdAt&order=desc`, {
            next: { revalidate: 300 } // Revalidate every 5 minutes
        })
        
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`)
        }
        
        const data = await response.json()
        
        if (!data.success) {
            throw new Error(data.message || 'Failed to fetch games')
        }
        
        return data.data
    } catch (error) {
        console.error('Error fetching games data:', error)
        return {
            games: [],
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
async function getGamesStats() {
    try {
        const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.crackmarket.xyz'
        
        const response = await fetch(`${API_BASE_URL}/api/v1/games/stats`, {
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
        console.error('Error fetching games stats:', error)
        return {
            totalGames: 0,
            totalDownloads: 0,
            averageRating: 0,
            activeUsers: 0
        }
    }
}

// Generate metadata
export async function generateMetadata() {
    const stats = await getGamesStats()
    return generateGamesMetadata(stats)
}

export default async function GamesPage() {
    // Fetch data server-side
    const [initialData, initialStats] = await Promise.all([
        getGamesData(),
        getGamesStats()
    ])
    
    return (
        <Suspense fallback={
            <div className="flex justify-center items-center min-h-screen">
                <LoadingSpinner />
            </div>
        }>
            <GamesPageClient 
                initialData={initialData}
                initialStats={initialStats}
            />
        </Suspense>
    )
}
