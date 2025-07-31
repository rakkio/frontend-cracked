import { Suspense } from 'react'
import SearchPageClient from './SearchPageClient'
import LoadingScreen from '@/components/ui/LoadingScreen'

// Generate metadata for search page
export async function generateMetadata({ searchParams }) {
    const params = await searchParams
    const query = params.q || ''
    
    return {
        title: query ? `Search: ${query} - CrackMarket` : 'Search - CrackMarket',
        description: query 
            ? `Search results for "${query}" - Find APKs, IPAs, Games, and Apps on CrackMarket`
            : 'Search for premium cracked software, games, APKs, and IPAs across all platforms',
        keywords: [
            'search',
            'find apps',
            'apk search',
            'ipa search', 
            'games search',
            'software search',
            query
        ].filter(Boolean).join(', '),
        openGraph: {
            title: query ? `Search: ${query} - CrackMarket` : 'Search - CrackMarket',
            description: query 
                ? `Search results for "${query}" across all platforms`
                : 'Search across our vast collection of premium software',
            type: 'website'
        }
    }
}

// Server-side data fetching for search
async function getSearchData(query) {
    if (!query) {
        return {
            apks: [],
            ipas: [],
            apps: [],
            games: [],
            totalResults: 0
        }
    }

    try {
        const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'
        
        // Search across all platforms
        const [apksResponse, ipasResponse, appsResponse, gamesResponse] = await Promise.all([
            fetch(`${baseUrl}/api/v1/apk/search?q=${encodeURIComponent(query)}&limit=12`)
                .then(r => r.ok ? r.json() : { data: [] })
                .catch(() => ({ data: [] })),
            fetch(`${baseUrl}/api/v1/ipa/search?q=${encodeURIComponent(query)}&limit=12`)
                .then(r => r.ok ? r.json() : { data: [] })
                .catch(() => ({ data: [] })),
            fetch(`${baseUrl}/api/v1/apps/search?q=${encodeURIComponent(query)}&limit=12`)
                .then(r => r.ok ? r.json() : { data: [] })
                .catch(() => ({ data: [] })),
            fetch(`${baseUrl}/api/v1/games/search?q=${encodeURIComponent(query)}&limit=12`)
                .then(r => r.ok ? r.json() : { data: [] })
                .catch(() => ({ data: [] }))
        ])

        const apks = apksResponse.data || []
        const ipas = ipasResponse.data || []
        const apps = appsResponse.data || []
        const games = gamesResponse.data || []

        return {
            apks,
            ipas,
            apps,
            games,
            totalResults: apks.length + ipas.length + apps.length + games.length
        }
    } catch (error) {
        console.error('Error fetching search data:', error)
        return {
            apks: [],
            ipas: [],
            apps: [],
            games: [],
            totalResults: 0
        }
    }
}

// Server-side search content component
async function SearchContent({ searchParams }) {
    const params = await searchParams
    const query = params.q || ''
    const searchData = await getSearchData(query)
    
    return (
        <SearchPageClient 
            query={query}
            searchData={searchData}
        />
    )
}

export default function SearchPage({ searchParams }) {
    return (
        <Suspense fallback={<LoadingScreen />}>
            <SearchContent searchParams={searchParams} />
        </Suspense>
    )
}
