import { Suspense } from 'react'
import { api } from '@/lib/api'
import { FaCrown, FaStar, FaDownload, FaShieldAlt } from 'react-icons/fa'
import LoadingScreen from '@/components/ui/LoadingScreen'

// Generate metadata for SEO
export async function generateMetadata() {
    return {
        title: 'Premium Cracked Software - Full Version Free | CrackMarket',
        description: 'Download premium cracked software with all features unlocked. Professional applications, games, and tools completely free with working cracks.',
        keywords: 'premium cracked software, full version free, professional apps, premium games, unlocked features',
        openGraph: {
            title: 'Premium Cracked Software - Full Version Free',
            description: 'Download premium cracked software with all features unlocked. Professional applications, games, and tools completely free.',
            type: 'website'
        }
    }
}

// Server-side data fetching
async function getPremiumData() {
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
            fetch(`${baseUrl}/api/v1/apps?isPremium=true&limit=12`, { 
                next: { revalidate: 3600 },
                headers: { 'Content-Type': 'application/json' }
            }).then(r => r.ok ? r.json() : null).catch(() => null),
            fetch(`${baseUrl}/api/v1/apk?isPremium=true&limit=12`, {
                next: { revalidate: 3600 },
                headers: { 'Content-Type': 'application/json' }
            }).then(r => r.ok ? r.json() : null).catch(() => null),
            fetch(`${baseUrl}/api/v1/ipa?isPremium=true&limit=12`, {
                next: { revalidate: 3600 },
                headers: { 'Content-Type': 'application/json' }
            }).then(r => r.ok ? r.json() : null).catch(() => null),
            fetch(`${baseUrl}/api/v1/games?isPremium=true&limit=12`, {
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
        console.error('Error fetching premium data:', error)
        return {
            apps: [],
            apks: [],
            ipas: [],
            games: []
        }
    }
}

// Premium content component
function PremiumCard({ item, type }) {
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

    const getOriginalPrice = () => {
        if (item.originalPrice) return item.originalPrice
        // Generate realistic prices based on type
        const prices = {
            app: ['$29.99', '$49.99', '$99.99', '$199.99'],
            apk: ['$4.99', '$9.99', '$19.99', '$29.99'],
            ipa: ['$2.99', '$7.99', '$14.99', '$24.99'],
            game: ['$19.99', '$39.99', '$59.99', '$79.99']
        }
        const typePrices = prices[type] || prices.app
        return typePrices[Math.floor(Math.random() * typePrices.length)]
    }

    return (
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 hover:shadow-xl transition-all duration-200 group relative overflow-hidden">
            {/* Premium Badge */}
            <div className="absolute top-4 right-4 bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                <FaCrown className="w-3 h-3" />
                PREMIUM
            </div>

            <div className="flex items-center gap-4 mb-4">
                <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg">
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
                    <h3 className="font-bold text-gray-900 truncate group-hover:text-orange-600 transition-colors">
                        {item.name}
                    </h3>
                    <p className="text-sm text-gray-500 mb-2">
                        {item.category?.name || 'Software'} • {item.version || '1.0.0'}
                    </p>
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                            <FaStar className="w-4 h-4 text-yellow-400" />
                            <span>{item.rating || '4.8'}</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <FaDownload className="w-4 h-4 text-green-500" />
                            <span>{formatNumber(item.downloads || item.downloadCount || 2500)}</span>
                        </div>
                    </div>
                </div>
            </div>
            
            <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                {item.shortDescription || item.description}
            </p>

            {/* Price Section */}
            <div className="mb-4 p-3 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg border border-green-200">
                <div className="flex items-center justify-between">
                    <div>
                        <div className="text-lg font-bold text-green-600">FREE</div>
                        <div className="text-xs text-gray-500 line-through">{getOriginalPrice()}</div>
                    </div>
                    <div className="text-right">
                        <div className="text-xs text-gray-600">100% Savings</div>
                        <div className="text-xs text-green-600 font-medium">All Features Unlocked</div>
                    </div>
                </div>
            </div>
            
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
                    className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 transform hover:scale-105 flex items-center gap-2"
                >
                    <FaDownload className="w-3 h-3" />
                    Get Free
                </a>
            </div>
        </div>
    )
}

// Server-side premium content component
async function PremiumContent() {
    const data = await getPremiumData()
    const allItems = [
        ...data.apps.map(item => ({ ...item, type: 'app' })),
        ...data.apks.map(item => ({ ...item, type: 'apk' })),
        ...data.ipas.map(item => ({ ...item, type: 'ipa' })),
        ...data.games.map(item => ({ ...item, type: 'game' }))
    ]

    return (
        <main className="w-full min-h-screen bg-white relative overflow-x-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 text-white py-16">
                <div className="container mx-auto px-4 text-center">
                    <div className="flex items-center justify-center gap-3 mb-4">
                        <FaCrown className="w-8 h-8 text-yellow-200" />
                        <h1 className="text-4xl font-bold">Premium Software</h1>
                        <FaCrown className="w-8 h-8 text-yellow-200" />
                    </div>
                    <p className="text-xl text-orange-100 max-w-2xl mx-auto mb-6">
                        Professional applications and games worth thousands of dollars, completely free with all premium features unlocked
                    </p>
                    
                    {/* Features */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto mt-8">
                        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                            <FaShieldAlt className="w-8 h-8 text-yellow-200 mx-auto mb-2" />
                            <h3 className="font-semibold mb-1">100% Safe</h3>
                            <p className="text-sm text-orange-100">Virus-free and tested</p>
                        </div>
                        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                            <FaCrown className="w-8 h-8 text-yellow-200 mx-auto mb-2" />
                            <h3 className="font-semibold mb-1">Full Version</h3>
                            <p className="text-sm text-orange-100">All features unlocked</p>
                        </div>
                        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                            <FaDownload className="w-8 h-8 text-yellow-200 mx-auto mb-2" />
                            <h3 className="font-semibold mb-1">Instant Download</h3>
                            <p className="text-sm text-orange-100">No waiting, no surveys</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="container mx-auto px-4 py-12">
                {allItems.length > 0 ? (
                    <>
                        <div className="text-center mb-8">
                            <h2 className="text-2xl font-bold text-gray-900 mb-2">
                                {allItems.length} Premium Applications Available
                            </h2>
                            <p className="text-gray-600">
                                Save thousands of dollars with our premium cracked software collection
                            </p>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {allItems.map((item, index) => (
                                <PremiumCard 
                                    key={`${item.type}-${item._id || index}`} 
                                    item={item} 
                                    type={item.type} 
                                />
                            ))}
                        </div>
                    </>
                ) : (
                    <div className="text-center py-16">
                        <FaCrown className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold text-gray-600 mb-2">No Premium Content</h3>
                        <p className="text-gray-500">Premium software will appear here once available.</p>
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
                        "name": "Premium Software - CrackMarket",
                        "description": "Premium cracked software with all features unlocked, completely free",
                        "url": "https://crackmarket.xyz/premium",
                        "mainEntity": {
                            "@type": "ItemList",
                            "numberOfItems": allItems.length,
                            "itemListElement": allItems.slice(0, 10).map((item, index) => ({
                                "@type": "SoftwareApplication",
                                "position": index + 1,
                                "name": item.name,
                                "description": item.shortDescription || item.description,
                                "applicationCategory": item.category?.name || "Software",
                                "offers": {
                                    "@type": "Offer",
                                    "price": "0.00",
                                    "priceCurrency": "USD"
                                }
                            }))
                        }
                    })
                }}
            />
        </main>
    )
}

export default function PremiumPage() {
    return (
        <Suspense fallback={<LoadingScreen />}>
            <PremiumContent />
        </Suspense>
    )
}
