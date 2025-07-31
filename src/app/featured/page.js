import { Suspense } from 'react'
import { api } from '@/lib/api'
import { FaStar, FaFire, FaDownload } from 'react-icons/fa'
import LoadingScreen from '@/components/ui/LoadingScreen'

// Generate metadata for SEO
export async function generateMetadata() {
    return {
        title: 'Featured Apps - Premium Cracked Software | CrackMarket',
        description: 'Discover the most popular and featured cracked applications, games, APKs and IPAs. Hand-picked premium software with all features unlocked.',
        keywords: 'featured apps, popular software, trending games, best apks, top ipa, premium cracked',
        openGraph: {
            title: 'Featured Apps - Premium Cracked Software',
            description: 'Discover the most popular and featured cracked applications, games, APKs and IPAs.',
            type: 'website'
        }
    }
}

// Server-side data fetching
async function getFeaturedData() {
    try {
        const baseUrl = process.env.NEXT_PUBLIC_API_URL?.replace('/api/v1', '') || 'http://localhost:5000'
        
        // Helper function to safely extract array from API response
        const extractArray = (response) => {
            if (!response) return []
            if (Array.isArray(response)) return response
            if (response.data && Array.isArray(response.data)) return response.data
            if (response.apps && Array.isArray(response.apps)) return response.apps
            if (response.apks && Array.isArray(response.apks)) return response.apks
            if (response.ipas && Array.isArray(response.ipas)) return response.ipas
            if (response.games && Array.isArray(response.games)) return response.games
            return []
        }
        
        const [appsRes, apksRes, ipasRes, gamesRes] = await Promise.all([
            fetch(`${baseUrl}/api/v1/apps?isFeatured=true&limit=12`, {
                next: { revalidate: 3600 },
                headers: { 'Content-Type': 'application/json' }
            }).then(r => r.ok ? r.json() : null).catch(() => null),
            fetch(`${baseUrl}/api/v1/apk?isFeatured=true&limit=12`, {
                next: { revalidate: 3600 },
                headers: { 'Content-Type': 'application/json' }
            }).then(r => r.ok ? r.json() : null).catch(() => null),
            fetch(`${baseUrl}/api/v1/ipa?isFeatured=true&limit=12`, {
                next: { revalidate: 3600 },
                headers: { 'Content-Type': 'application/json' }
            }).then(r => r.ok ? r.json() : null).catch(() => null),
            fetch(`${baseUrl}/api/v1/games?isFeatured=true&limit=12`, {
                next: { revalidate: 3600 },
                headers: { 'Content-Type': 'application/json' }
            }).then(r => r.ok ? r.json() : null).catch(() => null)
        ])

        return {
            apps: extractArray(appsRes),
            apks: extractArray(apksRes),
            ipas: extractArray(ipasRes),
            games: extractArray(gamesRes)
        }
    } catch (error) {
        console.error('Error fetching featured data:', error)
        return {
            apps: [],
            apks: [],
            ipas: [],
            games: []
        }
    }
}

// Featured content component
function FeaturedCard({ item, type }) {
    const formatNumber = (num) => {
        if (!num || num === 0) return '0'
        if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M'
        if (num >= 1000) return (num / 1000).toFixed(1) + 'K'
        return num.toString()
    }

    const getItemUrl = () => {
        switch (type) {
            case 'apk': return `/apk/${item.slug}`
            case 'ipa': return `/ipa/${item.slug}`
            case 'game': return `/games/${item.slug}`
            default: return `/app/${item.slug}`
        }
    }

    return (
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 hover:shadow-xl transition-all duration-200 group">
            <div className="flex items-center gap-4 mb-4">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center flex-shrink-0">
                    {item.images && item.images[0] ? (
                        <img 
                            src={item.images[0]} 
                            alt={item.name}
                            className="w-14 h-14 rounded-lg object-cover"
                        />
                    ) : (
                        <span className="text-xl font-bold text-white">
                            {item.name.charAt(0)}
                        </span>
                    )}
                </div>
                <div className="min-w-0 flex-1">
                    <h3 className="font-bold text-gray-900 truncate group-hover:text-blue-600 transition-colors">
                        {item.name}
                    </h3>
                    <p className="text-sm text-gray-500 mb-2">
                        {item.category?.name || 'Software'} • {item.version || '1.0.0'}
                    </p>
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                            <FaStar className="w-4 h-4 text-yellow-400" />
                            <span>{item.rating || '4.5'}</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <FaDownload className="w-4 h-4 text-green-500" />
                            <span>{formatNumber(item.downloads || item.downloadCount || 1200)}</span>
                        </div>
                    </div>
                </div>
            </div>
            
            <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                {item.shortDescription || item.description}
            </p>
            
            <div className="flex items-center justify-between">
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                    type === 'apk' ? 'bg-green-100 text-green-800' :
                    type === 'ipa' ? 'bg-blue-100 text-blue-800' :
                    type === 'game' ? 'bg-purple-100 text-purple-800' :
                    'bg-gray-100 text-gray-800'
                }`}>
                    {type.toUpperCase()}
                </span>
                
                <a 
                    href={getItemUrl()}
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 transform hover:scale-105"
                >
                    View Details
                </a>
            </div>
        </div>
    )
}

// Server-side featured content component
async function FeaturedContent() {
    const data = await getFeaturedData()
    const allItems = [
        ...data.apps.map(item => ({ ...item, type: 'app' })),
        ...data.apks.map(item => ({ ...item, type: 'apk' })),
        ...data.ipas.map(item => ({ ...item, type: 'ipa' })),
        ...data.games.map(item => ({ ...item, type: 'game' }))
    ]

    return (
        <main className="w-full min-h-screen bg-white relative overflow-x-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-16">
                <div className="container mx-auto px-4 text-center">
                    <div className="flex items-center justify-center gap-3 mb-4">
                        <FaFire className="w-8 h-8 text-yellow-400" />
                        <h1 className="text-4xl font-bold">Featured Content</h1>
                        <FaFire className="w-8 h-8 text-yellow-400" />
                    </div>
                    <p className="text-xl text-blue-100 max-w-2xl mx-auto">
                        Discover the most popular and trending cracked applications, games, APKs and IPAs
                    </p>
                    <div className="mt-6 flex items-center justify-center gap-6 text-blue-100">
                        <div className="text-center">
                            <div className="text-2xl font-bold">{data.apps.length + data.apks.length + data.ipas.length + data.games.length}</div>
                            <div className="text-sm">Featured Items</div>
                        </div>
                        <div className="w-px h-8 bg-blue-400"></div>
                        <div className="text-center">
                            <div className="text-2xl font-bold">100%</div>
                            <div className="text-sm">Safe & Tested</div>
                        </div>
                        <div className="w-px h-8 bg-blue-400"></div>
                        <div className="text-center">
                            <div className="text-2xl font-bold">Free</div>
                            <div className="text-sm">Always Free</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="container mx-auto px-4 py-12">
                {allItems.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {allItems.map((item, index) => (
                            <FeaturedCard 
                                key={`${item.type}-${item._id || index}`} 
                                item={item} 
                                type={item.type} 
                            />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-16">
                        <FaStar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold text-gray-600 mb-2">No Featured Content</h3>
                        <p className="text-gray-500">Featured content will appear here once available.</p>
                    </div>
                )}
            </div>

            {/* Structured Data for SEO */}
            <script 
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "CollectionPage",
                        "name": "Featured Apps - CrackMarket",
                        "description": "Featured and popular cracked applications, games, APKs and IPAs",
                        "url": "https://crackmarket.xyz/featured",
                        "mainEntity": {
                            "@type": "ItemList",
                            "numberOfItems": allItems.length,
                            "itemListElement": allItems.slice(0, 10).map((item, index) => ({
                                "@type": "SoftwareApplication",
                                "position": index + 1,
                                "name": item.name,
                                "description": item.shortDescription || item.description,
                                "applicationCategory": item.category?.name || "Software"
                            }))
                        }
                    })
                }}
            />
        </main>
    )
}

export default function FeaturedPage() {
    return (
        <Suspense fallback={<LoadingScreen />}>
            <FeaturedContent />
        </Suspense>
    )
}
