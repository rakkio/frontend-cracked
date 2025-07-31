import { Suspense } from 'react'
import { siteConfig } from './metadata'
import LoadingScreen from '@/components/ui/LoadingScreen'
import MarketplaceHero from '@/components/home/MarketplaceHero'
import FeaturedCarousel from '@/components/home/FeaturedCarousel'
import CategoriesGrid from '@/components/home/CategoriesGrid'   
import StatsMarquee from '@/components/home/StatsMarquee'
import PlatformSections from '@/components/home/PlatformSections'
import TrendingSection from '@/components/home/TrendingSection'
import SecurityBanner from '@/components/home/SecurityBanner'

// Generate metadata for SEO
export async function generateMetadata() {
    return {
        title: 'CrackMarket - Premium Apps, APKs, IPAs & Games for Free',
        description: 'Download 50,000+ premium cracked applications, Android APKs, iOS IPAs, and PC games for free. All platforms supported with latest versions and full features unlocked.',
        keywords: [
            'cracked apps',
            'free apk download',
            'ios ipa free',
            'premium games crack',
            'android mod apk',
            'free software download',
            'cracked games',
            'premium apps free',
            'marketplace apps',
            'mod apk download'
        ].join(', '),
        openGraph: {
            title: 'CrackMarket - Premium Apps, APKs, IPAs & Games',
            description: 'Your ultimate marketplace for free premium software across all platforms. Android, iOS, Windows, and Mac supported.',
            type: 'website',
            url: siteConfig.url,
            images: [{
                url: '/og-marketplace.jpg',
                width: 1200,
                height: 512,
                alt: 'CrackMarket - Premium Apps Marketplace'
            }]
        },
        twitter: {
            card: 'summary_large_image',
            title: 'CrackMarket - Premium Apps, APKs, IPAs & Games',
            description: 'Download 50,000+ premium software for free across all platforms'
        },
        alternates: {
            canonical: siteConfig.url
        }
    }
}

// Server-side data fetching for marketplace
async function getMarketplaceData() {
    try {
        const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'
        
        console.log('Fetching marketplace data from:', baseUrl)
        
        // Fetch data from all platforms
        const [appsResponse, apksResponse, ipasResponse, gamesResponse] = await Promise.all([
            fetch(`${baseUrl}/api/v1/apps/featured?limit=6`).then(r => r.ok ? r.json() : { success: false, data: [] }).catch(() => ({ success: false, data: [] })),
            fetch(`${baseUrl}/api/v1/apk/featured?limit=6`).then(r => r.ok ? r.json() : { success: false, data: [] }).catch(() => ({ success: false, data: [] })),
            fetch(`${baseUrl}/api/v1/ipa/featured?limit=6`).then(r => r.ok ? r.json() : { success: false, data: [] }).catch(() => ({ success: false, data: [] })),
            fetch(`${baseUrl}/api/v1/games/featured?limit=6`).then(r => r.ok ? r.json() : { success: false, data: [] }).catch(() => ({ success: false, data: [] }))
        ])
        
        console.log('API Responses:')
        console.log('Apps:', appsResponse)
        console.log('APKs:', apksResponse)
        console.log('IPAs:', ipasResponse)
        console.log('Games:', gamesResponse)
        
        // Handle different response structures
        const featuredApps = appsResponse.success ? (appsResponse.data || appsResponse.apps || []) : []
        const featuredApks = apksResponse.success ? (apksResponse.data || apksResponse.apks || []) : []
        const featuredIpas = ipasResponse.success ? (ipasResponse.data || ipasResponse.ipas || []) : []
        const featuredGames = gamesResponse.success ? (gamesResponse.data || gamesResponse.games || []) : []
        
        console.log('Processed data:')
        console.log('Featured Apps:', featuredApps.length)
        console.log('Featured APKs:', featuredApks.length)
        console.log('Featured IPAs:', featuredIpas.length)
        console.log('Featured Games:', featuredGames.length)
        
        return {
            featuredApps,
            featuredApks,
            featuredIpas,
            featuredGames,
            stats: {
                totalApps: 15000,
                totalApks: 25000,
                totalIpas: 8000,
                totalGames: 12000,
                totalDownloads: 5000000,
                activeUsers: 250000
            }
        }
    } catch (error) {
        console.error('Error fetching marketplace data:', error)
        return {
            featuredApps: [],
            featuredApks: [],
            featuredIpas: [],
            featuredGames: [],
            stats: {
                totalApps: 15000,
                totalApks: 25000,
                totalIpas: 8000,
                totalGames: 12000,
                totalDownloads: 5000000,
                activeUsers: 250000
            }
        }
    }
}

// Server-side marketplace content component
async function MarketplaceContent() {
    const marketplaceData = await getMarketplaceData()
    
    return (
        <>
            <main className="w-full min-h-screen bg-gradient-to-br bg-white from-white via-white to-white relative overflow-x-hidden">
                {/* Hero Section */}
                <MarketplaceHero stats={marketplaceData.stats} />
                
                {/* Stats Marquee */}
                <StatsMarquee stats={marketplaceData.stats} />
                
                {/* Featured Carousel */}
                <FeaturedCarousel 
                    apps={marketplaceData.featuredApps}
                    apks={marketplaceData.featuredApks}
                    ipas={marketplaceData.featuredIpas}
                    games={marketplaceData.featuredGames}
                />
                
                {/* Platform Sections */}
                <PlatformSections 
                    apps={marketplaceData.featuredApps}
                    apks={marketplaceData.featuredApks}
                    ipas={marketplaceData.featuredIpas}
                    games={marketplaceData.featuredGames}
                />
                
                {/* Categories Grid */}
                <CategoriesGrid />
                
                {/* Trending Section */}
                <TrendingSection />
                
                {/* Security Banner */}
                <SecurityBanner />
            </main>
            
            {/* Structured Data for SEO */}
            <script 
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "WebSite",
                        "name": "CrackMarket",
                        "description": "Premium apps, APKs, IPAs and games marketplace",
                        "url": siteConfig.url,
                        "potentialAction": {
                            "@type": "SearchAction",
                            "target": `${siteConfig.url}/search?q={search_term_string}`,
                            "query-input": "required name=search_term_string"
                        },
                        "mainEntity": {
                            "@type": "Organization",
                            "name": "CrackMarket",
                            "url": siteConfig.url,
                            "description": "Multi-platform software marketplace",
                            "serviceType": "Software Distribution"
                        }
                    })
                }}
            />
        </>
    )
}

export default function Home() {
    return (
        <Suspense fallback={<LoadingScreen />}>
            <MarketplaceContent />
        </Suspense>
    )
}
