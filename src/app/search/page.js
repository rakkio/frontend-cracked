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
            data: {
                apps: [],
                apks: [],
                ipas: [],
                games: [],
                all: []
            },
            stats: {
                total: 0,
                apps: 0,
                apks: 0,
                ipas: 0,
                games: 0
            },
            query: ''
        }
    }

    try {
        const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'
        
        // Use unified search endpoint
        const response = await fetch(`${baseUrl}/api/v1/search/all?q=${encodeURIComponent(query)}&limit=20`)
        
        if (!response.ok) {
            throw new Error('Search request failed')
        }

        const data = await response.json()
        
        if (data.success) {
            return {
                data: data.data,
                stats: data.stats,
                query: data.query
            }
        } else {
            throw new Error(data.message || 'Search failed')
        }
    } catch (error) {
        console.error('Error fetching search data:', error)
        return {
            data: {
                apps: [],
                apks: [],
                ipas: [],
                games: [],
                all: []
            },
            stats: {
                total: 0,
                apps: 0,
                apks: 0,
                ipas: 0,
                games: 0
            },
            query: query
        }
    }
}

// Server-side search content component
async function SearchContent({ searchParams }) {
    const params = await searchParams
    const query = params.q || ''
    const searchData = await getSearchData(query)
    
    return (
        <div className="min-h-screen bg-white">
            {/* Hero Section with Modern Design */}
            <section className="relative py-20 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 overflow-hidden">
                {/* Animated Background Elements */}
                <div className="absolute inset-0">
                    <div className="absolute top-0 left-0 w-72 h-72 bg-blue-400/10 rounded-full blur-3xl animate-pulse"></div>
                    <div className="absolute top-0 right-0 w-72 h-72 bg-indigo-400/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
                    <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-96 h-96 bg-purple-400/10 rounded-full blur-3xl animate-pulse delay-2000"></div>
                </div>

                <div className="container mx-auto px-4 relative z-10">
                    <div className="text-center mb-12">
                        <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-3xl mb-6 shadow-lg">
                            <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
                            </svg>
                        </div>
                        <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent mb-6">
                            {query ? `Search Results` : `Search Everything`}
                        </h1>
                        <p className="text-gray-600 text-lg md:text-xl max-w-3xl mx-auto mb-8">
                            {query 
                                ? `Found ${searchData.stats.total} results for "${query}" across all platforms`
                                : 'Search across our vast collection of premium software, games, and applications'
                            }
                        </p>
                        
                        {/* Search Stats */}
                        {query && searchData.stats.total > 0 && (
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
                                <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
                                    <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl mb-3 mx-auto">
                                        <svg className="text-white text-xl" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                                        </svg>
                                    </div>
                                    <h3 className="font-bold text-2xl text-gray-800 mb-1">{searchData.stats.apps}</h3>
                                    <p className="text-gray-600 text-sm font-medium">PC Apps</p>
                                </div>
                                
                                <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
                                    <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl mb-3 mx-auto">
                                        <svg className="text-white text-xl" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M17.523 15.3414c-.0441-.2966-.2217-.5845-.4878-.7529l-2.8041-1.7373c-.1887-.1167-.4355-.1167-.624 0l-2.8041 1.7373c-.2661.1685-.4437.4563-.4878.7529l-.6548 4.3711c-.0415.2764.2217.5088.4878.5088h6.2217c.2661 0 .5293-.2324.4878-.5088l-.6548-4.3711zm-3.523 2.6211c-.8281 0-1.5-.6719-1.5-1.5s.6719-1.5 1.5-1.5 1.5.6719 1.5 1.5-.6719 1.5-1.5 1.5z"/>
                                        </svg>
                                    </div>
                                    <h3 className="font-bold text-2xl text-gray-800 mb-1">{searchData.stats.apks}</h3>
                                    <p className="text-gray-600 text-sm font-medium">Android APKs</p>
                                </div>
                                
                                <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
                                    <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-gray-500 to-gray-600 rounded-xl mb-3 mx-auto">
                                        <svg className="text-white text-xl" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M18.71 19.5c-.83 1.24-2.01 2.5-3.12 3.73C14.41 22.76 13.16 24 12 24c-1.16 0-2.41-1.24-3.59-2.77C7.3 22 6.13 20.74 5.29 19.5 4.47 18.26 4 17.03 4 16c0-1.03.47-2.26 1.29-3.5C6.13 11.26 7.3 10 8.41 8.77 9.59 7.24 10.84 6 12 6c1.16 0 2.41 1.24 3.59 2.77C16.7 10 17.87 11.26 18.71 12.5 19.53 13.74 20 14.97 20 16c0 1.03-.47 2.26-1.29 3.5zM12 8c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/>
                                        </svg>
                                    </div>
                                    <h3 className="font-bold text-2xl text-gray-800 mb-1">{searchData.stats.ipas}</h3>
                                    <p className="text-gray-600 text-sm font-medium">iOS IPAs</p>
                                </div>
                                
                                <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
                                    <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl mb-3 mx-auto">
                                        <svg className="text-white text-xl" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M21 6H3c-1.1 0-2 .9-2 2v8c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm-10 7H8v3H6v-3H3v-2h3V8h2v3h3v2zm4.5 2c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm4-3c-.83 0-1.5-.67-1.5-1.5S18.67 10 19.5 10s1.5.67 1.5 1.5-.67 1.5-1.5 1.5z"/>
                                        </svg>
                                    </div>
                                    <h3 className="font-bold text-2xl text-gray-800 mb-1">{searchData.stats.games}</h3>
                                    <p className="text-gray-600 text-sm font-medium">PC Games</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </section>

            {/* Main Content */}
            <Suspense fallback={
                <div className="container mx-auto px-4 py-12">
                    <div className="text-center mb-12">
                        <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-200 border-t-blue-500 mx-auto mb-4"></div>
                        <p className="text-gray-600">Searching across all platforms...</p>
                    </div>
                    
                    {/* Loading Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                        {[...Array(12)].map((_, i) => (
                            <div key={i} className="group relative">
                                {/* Luxury Glow Effect */}
                                <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-400 via-indigo-500 to-purple-500 rounded-3xl blur opacity-20 group-hover:opacity-40 transition duration-1000 animate-pulse"></div>
                                
                                {/* Light Card */}
                                <div className="relative bg-white/90 backdrop-blur-xl border border-gray-200/60 rounded-3xl p-6 h-full shadow-xl hover:shadow-2xl transition-all duration-300">
                                    <div className="w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl mx-auto mb-4 animate-pulse shadow-inner"></div>
                                    <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded-full mb-2 animate-pulse"></div>
                                    <div className="h-3 bg-gradient-to-r from-gray-200 to-gray-300 rounded-full mb-3 animate-pulse"></div>
                                    <div className="flex justify-center space-x-2">
                                        <div className="h-6 w-16 bg-gradient-to-r from-blue-100 to-indigo-200 rounded-full animate-pulse"></div>
                                        <div className="h-6 w-16 bg-gradient-to-r from-purple-100 to-pink-200 rounded-full animate-pulse"></div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            }>
                <SearchPageClient 
                    query={query}
                    searchData={searchData}
                />
            </Suspense>
        </div>
    )
}

export default function SearchPage({ searchParams }) {
    return (
        <Suspense fallback={<LoadingScreen />}>
            <SearchContent searchParams={searchParams} />
        </Suspense>
    )
}
