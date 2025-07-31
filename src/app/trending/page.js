import { Suspense } from 'react'
import { FaFire, FaRocket } from 'react-icons/fa'
import { FiTrendingUp, FiEye, FiZap } from 'react-icons/fi'
import TrendingPageClient from './TrendingPageClient'

// Generate metadata for SEO
export async function generateMetadata() {
    return {
        title: 'Trending Apps - Most Popular Software | CrackMarket',
        description: 'Discover the most trending and popular cracked applications, games, APKs and IPAs. See what\'s hot right now in the software world.',
        keywords: 'trending apps, popular software, hot games, trending apks, viral ipa, most downloaded',
        openGraph: {
            title: 'Trending Apps - Most Popular Software',
            description: 'Discover the most trending and popular cracked applications, games, APKs and IPAs.',
            type: 'website'
        }
    }
}

// Server-side data fetching
async function getTrendingData() {
    try {
        const baseUrl = process.env.NEXT_PUBLIC_API_URL?.replace('/api/v1', '') || 'http://localhost:5000'
        
        // Fetch trending data from the new unified endpoint
        const response = await fetch(`${baseUrl}/api/v1/trending/data?limit=12`, {
            next: { revalidate: 1800 }, // 30 minutes cache
            headers: { 'Content-Type': 'application/json' }
        })
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`)
        }
        
        const data = await response.json()
        
        if (data.success && data.data) {
            console.log('Server Trending data:')
            console.log('- Apps:', data.data.apps?.length || 0, data.data.apps?.slice(0, 2).map(a => a.name))
            console.log('- APKs:', data.data.apks?.length || 0, data.data.apks?.slice(0, 2).map(a => a.name))
            console.log('- IPAs:', data.data.ipas?.length || 0, data.data.ipas?.slice(0, 2).map(a => a.name))
            console.log('- Games:', data.data.games?.length || 0, data.data.games?.slice(0, 2).map(a => a.name))
            console.log('- Stats:', data.stats)
            
            // Calculate total stats
            const totalItems = (data.data.apps?.length || 0) + (data.data.apks?.length || 0) + 
                             (data.data.ipas?.length || 0) + (data.data.games?.length || 0)
            const totalDownloads = [...(data.data.apps || []), ...(data.data.apks || []), 
                                   ...(data.data.ipas || []), ...(data.data.games || [])]
                .reduce((sum, item) => sum + (item.downloads || item.downloadCount || 0), 0)
            
            return {
                apps: data.data.apps || [],
                apks: data.data.apks || [],
                ipas: data.data.ipas || [],
                games: data.data.games || [],
                stats: {
                    totalItems,
                    totalDownloads,
                    appsCount: data.data.apps?.length || 0,
                    apksCount: data.data.apks?.length || 0,
                    ipasCount: data.data.ipas?.length || 0,
                    gamesCount: data.data.games?.length || 0
                }
            }
        }
        
        return {
            apps: [],
            apks: [],
            ipas: [],
            games: [],
            stats: {
                totalItems: 0,
                totalDownloads: 0,
                appsCount: 0,
                apksCount: 0,
                ipasCount: 0,
                gamesCount: 0
            }
        }
    } catch (error) {
        console.error('Error fetching trending data:', error)
        return {
            apps: [],
            apks: [],
            ipas: [],
            games: [],
            stats: {
                totalItems: 0,
                totalDownloads: 0,
                appsCount: 0,
                apksCount: 0,
                ipasCount: 0,
                gamesCount: 0
            }
        }
    }
}

// Helper function to format numbers
function formatNumber(num) {
    if (!num || num === 0) return '0'
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M'
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K'
    return num.toString()
}

export default async function TrendingPage() {
    const data = await getTrendingData()

    return (
        <div className="min-h-screen bg-white">
            {/* Hero Section */}
            <section className="py-16 bg-gradient-to-br from-red-50 via-orange-50 to-pink-50">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-12">
                        <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-red-500 to-pink-500 rounded-3xl mb-6 shadow-lg">
                            <FaFire className="text-white text-3xl" />
                        </div>
                        <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-red-600 via-pink-600 to-orange-600 bg-clip-text text-transparent mb-6">
                            Trending Now
                        </h1>
                        <p className="text-gray-600 text-lg md:text-xl max-w-3xl mx-auto mb-8">
                            Discover the hottest and most popular software across all platforms. From Windows apps to Android APKs, iOS IPAs to PC games.
                        </p>
                        
                        {/* Quick Stats */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
                            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
                                <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl mb-3 mx-auto">
                                    <FiTrendingUp className="text-white text-xl" />
                                </div>
                                <h3 className="font-bold text-2xl text-gray-800 mb-1">{data.stats.totalItems}</h3>
                                <p className="text-gray-600 text-sm font-medium">Trending Items</p>
                            </div>
                            
                            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
                                <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl mb-3 mx-auto">
                                    <FiEye className="text-white text-xl" />
                                </div>
                                <h3 className="font-bold text-2xl text-gray-800 mb-1">{formatNumber(data.stats.totalDownloads)}</h3>
                                <p className="text-gray-600 text-sm font-medium">Total Downloads</p>
                            </div>
                            
                            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
                                <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl mb-3 mx-auto">
                                    <FaRocket className="text-white text-xl" />
                                </div>
                                <h3 className="font-bold text-2xl text-gray-800 mb-1">24h</h3>
                                <p className="text-gray-600 text-sm font-medium">Updated</p>
                            </div>
                            
                            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
                                <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl mb-3 mx-auto">
                                    <FiZap className="text-white text-xl" />
                                </div>
                                <h3 className="font-bold text-2xl text-gray-800 mb-1">100%</h3>
                                <p className="text-gray-600 text-sm font-medium">Safe & Clean</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Client Component for Interactive Features */}
            <Suspense fallback={
                <div className="container mx-auto px-4 py-12">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-200 border-t-red-500 mx-auto mb-4"></div>
                        <p className="text-gray-600">Loading trending content...</p>
                    </div>
                </div>
            }>
                <TrendingPageClient initialData={data} />
            </Suspense>
        </div>
    )
}
