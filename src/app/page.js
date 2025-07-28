import { Suspense } from 'react'
import { api } from '@/lib/api'
import { siteConfig } from './metadata'
import CategoriesWithApps from '@/components/CategoriesWithApps'

// Componentes SOLID
import SEOHead from '@/components/home/SEOHead'
import LoadingScreen from '@/components/ui/LoadingScreen'
import HeroSection from '@/components/home/HeroSection'
import StatsSection from '@/components/home/StatsSection'
import FeaturedAppsSection from '@/components/home/FeaturedAppsSection'
import WhyChooseSection from '@/components/home/WhyChooseSection'
import FinalCTASection from '@/components/home/FinalCTASection'
import HomePageClient from './HomePageClient'

// Generate metadata for SEO
export async function generateMetadata() {
    try {
        // Fetch initial data for metadata
        const [appsResponse, categoriesResponse] = await Promise.all([
            api.getFeaturedApps(12),
            api.getCategories()
        ])
        
        const featuredApps = appsResponse.apps || []
        const totalApps = appsResponse.pagination?.total || 50000
        const categoriesCount = categoriesResponse.categories?.length || 20
        
        return {
            title: 'AppsCracked - Free Premium Software Downloads',
            description: `Download ${totalApps}+ premium cracked apps and software for free. All categories available including productivity, games, design tools and more. Latest versions with full features unlocked.`,
            keywords: [
                'cracked apps',
                'free software',
                'premium apps download',
                'software crack',
                'free premium software',
                'apps download',
                'cracked software',
                'free apps',
                'premium software free'
            ].join(', '),
            openGraph: {
                title: 'AppsCracked - Free Premium Software Downloads',
                description: `Access ${totalApps}+ premium cracked apps across ${categoriesCount} categories. All free to download with full features unlocked.`,
                type: 'website',
                url: siteConfig.url,
                images: featuredApps.slice(0, 3).map(app => ({
                    url: app.icon || app.images?.[0] || '/default-app-icon.png',
                    width: 512,
                    height: 512,
                    alt: `${app.name} - Free Download`
                }))
            },
            twitter: {
                card: 'summary_large_image',
                title: 'AppsCracked - Free Premium Software Downloads',
                description: `Download ${totalApps}+ premium cracked apps for free`
            },
            alternates: {
                canonical: siteConfig.url
            }
        }
    } catch (error) {
        console.error('Error generating homepage metadata:', error)
        return {
            title: 'AppsCracked - Free Premium Software Downloads',
            description: 'Download premium cracked applications for free. All software with full features unlocked and direct download links.',
            alternates: {
                canonical: siteConfig.url
            }
        }
    }
}

// Server-side data fetching
async function getHomeData() {
    try {
        console.log('Fetching homepage data for SSR...')
        
        // Fetch all data needed for homepage
        const [appsResponse, categoriesResponse, featuredAppsResponse] = await Promise.all([
            api.getApps({ limit: 1 }),
            api.getCategories(),
            api.getFeaturedApps(6)
        ])
        
        const totalApps = appsResponse.data?.pagination?.total || 0
        const categories = categoriesResponse.categories || []
        const featuredApps = featuredAppsResponse.data?.apps || featuredAppsResponse.apps || []
        
        // Generate stats
        const stats = {
            totalApps,
            totalCategories: categories.length,
            totalDownloads: totalApps * 150, // Estimated
            activeUsers: Math.floor(totalApps * 2.5) // Estimated
        }
        
        console.log('Homepage SSR data fetched:', { 
            totalApps, 
            categoriesCount: categories.length,
            featuredAppsCount: featuredApps.length 
        })
        
        return {
            featuredApps,
            stats,
            categories
        }
    } catch (error) {
        console.error('Error fetching homepage data for SSR:', error)
        return {
            featuredApps: [],
            stats: {
                totalApps: 0,
                totalCategories: 0,
                totalDownloads: 0,
                activeUsers: 0
            },
            categories: []
        }
    }
}

// Server-side homepage content component
async function HomeContent() {
    const { featuredApps, stats, categories } = await getHomeData()
    
    return (
        <>
            <SEOHead stats={stats} featuredApps={featuredApps} />
            
            <main className="min-h-screen bg-matrix-dark">
                <HeroSection stats={stats} />
                
                <StatsSection stats={stats} />
                
                <FeaturedAppsSection 
                    featuredApps={featuredApps}
                    stats={stats}
                />
                
                <CategoriesWithApps
                    maxCategories={8}
                    maxAppsPerCategory={6}
                    showViewAll={true}
                />
                
                <WhyChooseSection />
                
                <FinalCTASection />
                
                {/* Client-side interactive components */}
                <HomePageClient 
                    featuredApps={featuredApps}
                    stats={stats}
                    categories={categories}
                />
            </main>
            
            {/* Structured Data for SEO */}
            <script 
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "WebSite",
                        "name": "AppsCracked",
                        "description": "Download premium cracked applications for free",
                        "url": "https://appscracked.com",
                        "potentialAction": {
                            "@type": "SearchAction",
                            "target": "https://appscracked.com/apps?search={search_term_string}",
                            "query-input": "required name=search_term_string"
                        },
                        "mainEntity": {
                            "@type": "Organization",
                            "name": "AppsCracked",
                            "url": "https://appscracked.com",
                            "description": "Free premium software downloads platform",
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
            <HomeContent />
        </Suspense>
    )
}
