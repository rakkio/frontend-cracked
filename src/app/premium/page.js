import { Suspense } from 'react'
import { api } from '@/lib/api'
import { FaCrown, FaStar, FaDownload, FaShieldAlt } from 'react-icons/fa'
import LoadingScreen from '@/components/ui/LoadingScreen'
import UnifiedItemCard from '@/components/marketplace/UnifiedItemCard'

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
                                <UnifiedItemCard 
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
