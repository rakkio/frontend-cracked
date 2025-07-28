import { Suspense } from 'react'
import { api } from '@/lib/api'
import { siteConfig } from '../metadata'
import { AppsSEO } from '@/components/seo/AppsSEO'
import { AppsHeader } from '@/components/apps/AppsHeader'
import { AppsLoading } from '@/components/apps/AppsLoading'
import AppsPageClient from './AppsPageClient'

// Generate metadata for SEO
export async function generateMetadata() {
    try {
        // Fetch initial apps data for metadata
        const appsResponse = await api.getApps({ limit: 20 })
        const categoriesResponse = await api.getCategories()
        
        const totalApps = appsResponse.data?.pagination?.total || 0
        const categoriesCount = categoriesResponse.categories?.length || 0
        
        return {
            title: 'Free Cracked Apps - Download Premium Software | AppsCracked',
            description: `Browse and download ${totalApps}+ premium cracked apps for free. All categories available including productivity, games, design tools and more. Latest versions with full features unlocked.`,
            keywords: [
                'cracked apps',
                'free software',
                'premium apps',
                'download apps',
                'software crack',
                'free download',
                'apps collection'
            ].join(', '),
            openGraph: {
                title: 'Free Cracked Apps - Premium Software Downloads',
                description: `Discover ${totalApps}+ premium cracked applications across ${categoriesCount} categories. All free to download with full features unlocked.`,
                type: 'website',
                url: `${siteConfig.url}/apps`
            },
            twitter: {
                card: 'summary_large_image',
                title: 'Free Cracked Apps - Premium Software Downloads',
                description: `Browse ${totalApps}+ premium cracked apps for free download`
            },
            alternates: {
                canonical: `${siteConfig.url}/apps`
            }
        }
    } catch (error) {
        console.error('Error generating apps metadata:', error)
        return {
            title: 'Free Cracked Apps - AppsCracked',
            description: 'Browse and download premium cracked apps for free. All categories available with latest versions and full features unlocked.',
            alternates: {
                canonical: `${siteConfig.url}/apps`
            }
        }
    }
}

// Server-side data fetching
async function getAppsData() {
    try {
        console.log('Fetching initial apps data for SSR...')
        
        // Fetch initial apps and categories for SSR
        const [appsResponse, categoriesResponse] = await Promise.all([
            api.getApps({ limit: 20, page: 1 }),
            api.getCategories()
        ])
        
        const apps = appsResponse.data?.apps || []
        const categories = categoriesResponse.categories || []
        const pagination = appsResponse.data?.pagination || {}
        
        console.log('SSR data fetched:', { 
            appsCount: apps.length, 
            categoriesCount: categories.length,
            totalApps: pagination.total 
        })
        
        return {
            initialApps: apps,
            categories,
            pagination
        }
    } catch (error) {
        console.error('Error fetching apps data for SSR:', error)
        return {
            initialApps: [],
            categories: [],
            pagination: {}
        }
    }
}

// Server-side apps content component
async function AppsContent() {
    const { initialApps, categories, pagination } = await getAppsData()
    
    return (
        <>
            <AppsSEO 
                apps={initialApps}
                searchTerm=""
                selectedCategory={null}
                filters={{}}
            />

            <main className="min-h-screen bg-black" itemScope itemType="https://schema.org/CollectionPage">
                <AppsHeader 
                    searchTerm=""
                    appsCount={pagination.total}
                />

                {/* Client-side interactive components */}
                <AppsPageClient 
                    initialApps={initialApps}
                    categories={categories}
                    initialPagination={pagination}
                />
            </main>
            
            {/* Structured Data for SEO */}
            <script 
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "CollectionPage",
                        "name": "Free Cracked Apps Collection",
                        "description": "Browse and download premium cracked applications for free",
                        "url": `${siteConfig.url}/apps`,
                        "mainEntity": {
                            "@type": "ItemList",
                            "numberOfItems": pagination.total,
                            "itemListElement": initialApps.slice(0, 10).map((app, index) => ({
                                "@type": "ListItem",
                                "position": index + 1,
                                "item": {
                                    "@type": "SoftwareApplication",
                                    "name": app.name,
                                    "description": app.description || `Download ${app.name} for free`,
                                    "url": `${siteConfig.url}/app/${app.slug}`,
                                    "applicationCategory": app.category?.name || "Software"
                                }
                            }))
                        }
                    })
                }}
            />
        </>
    )
}

export default function AppsPage() {
    return (
        <Suspense fallback={<AppsLoading />}>
            <AppsContent />
        </Suspense>
    )
}