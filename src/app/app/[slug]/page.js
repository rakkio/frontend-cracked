import { Suspense } from 'react'
import { notFound } from 'next/navigation'
import { api } from '@/lib/api'
import AppSEO from '@/components/app/AppSEO'
import AppBreadcrumb from '@/components/app/AppBreadcrumb'
import AppHeader from '@/components/app/AppHeader'
import AppDescription from '@/components/app/AppDescription'
import AppScreenshots from '@/components/app/AppScreenshots'
import AppSystemRequirements from '@/components/app/AppSystemRequirements'
import AppSidebar from '@/components/app/AppSidebar'
import AppLoading from '@/components/app/AppLoading'
import AppPageClient from './AppPageClient'

// Generate metadata for SEO
export async function generateMetadata({ params }) {
    try {
        const resolvedParams = await params
        const response = await api.getAppBySlug(resolvedParams.slug)
        
        // Extract app data from response (handle different response structures)
        const app = response.data?.app || response.app || response.data || response
        
        if (!app) {
            return {
                title: 'App Not Found - AppsCracked',
                description: 'The requested app could not be found.'
            }
        }

        return {
            title: `${app.name} - Download Free Cracked App | AppsCracked`,
            description: app.description || `Download ${app.name} for free. ${app.shortDescription || 'Premium software available for free download.'} Latest version with all features unlocked.`,
            keywords: [
                app.name,
                'download',
                'free',
                'cracked',
                'software',
                app.category?.name,
                ...(app.tags || [])
            ].filter(Boolean).join(', '),
            openGraph: {
                title: `${app.name} - Free Download`,
                description: app.description || `Download ${app.name} for free with all premium features unlocked.`,
                images: app.icon ? [{
                    url: app.icon,
                    width: 512,
                    height: 512,
                    alt: `${app.name} icon`
                }] : [],
                type: 'website',
                url: `https://appscracked.com/app/${app.slug}`
            },
            twitter: {
                card: 'summary_large_image',
                title: `${app.name} - Free Download`,
                description: app.description || `Download ${app.name} for free with all premium features unlocked.`,
                images: app.icon ? [app.icon] : []
            },
            alternates: {
                canonical: `https://appscracked.com/app/${app.slug}`
            }
        }
    } catch (error) {
        console.error('Error generating metadata:', error)
        return {
            title: 'AppsCracked - Free Software Downloads',
            description: 'Download premium software for free with all features unlocked.'
        }
    }
}

// Server-side data fetching
async function getAppData(slug) {
    try {
        console.log('Fetching app data for slug:', slug)
        const response = await api.getAppBySlug(slug)
        console.log('App response:', response)
        
        // Extract app data from response (handle different response structures)
        const appData = response.data?.app || response.app || response.data || response
        
        if (!appData) {
            console.error('No app data found in response:', response)
            return null
        }
        
        console.log('App data extracted:', appData)
        
        // Fetch related apps if category exists
        let relatedApps = []
        if (appData.category?._id) {
            try {
                const relatedAppsResponse = await api.getApps({
                    category: appData.category._id,
                    limit: 6,
                    exclude: appData._id
                })
                relatedApps = relatedAppsResponse.data?.apps || relatedAppsResponse.apps || []
                console.log('Related apps fetched:', relatedApps.length)
            } catch (relatedError) {
                console.error('Error fetching related apps:', relatedError)
                relatedApps = []
            }
        }
        
        return {
            app: appData,
            relatedApps
        }
    } catch (error) {
        console.error('Error fetching app data:', error)
        return null
    }
}

// Error boundary component
function AppError({ error, retry }) {
    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-red-900 flex items-center justify-center">
            <div className="text-center max-w-md mx-auto p-8">
                <div className="w-24 h-24 bg-gradient-to-br from-red-600 to-red-800 rounded-full flex items-center justify-center mx-auto mb-6">
                    <span className="text-white text-4xl font-black font-mono">!</span>
                </div>
                <h1 className="text-3xl font-black text-transparent bg-gradient-to-r from-red-400 to-red-300 bg-clip-text mb-4 font-mono">
                    ERROR_404
                </h1>
                <p className="text-gray-300 mb-6 font-mono">
                    {error || 'APP_NOT_FOUND'}
                </p>
                <button
                    onClick={retry}
                    className="px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white font-bold rounded-lg hover:from-red-500 hover:to-red-600 transition-all duration-300 font-mono"
                >
                    RETRY_LOADING
                </button>
            </div>
        </div>
    )
}

// Server-side app content component
async function AppContent({ slug }) {
    const data = await getAppData(slug)
    
    if (!data || !data.app) {
        notFound()
    }

    const { app, relatedApps } = data

    return (
        <>
            <AppSEO app={app} />
            <main className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-blue-900">
                <div className="container mx-auto px-4 py-8">
                    <AppBreadcrumb app={app} />
                    
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
                        <div className="lg:col-span-2 space-y-8">
                            <AppHeader app={app} />
                            <AppDescription app={app} />
                            <AppScreenshots app={app} />
                            <AppSystemRequirements app={app} />
                        </div>
                        
                        <div className="lg:col-span-1">
                            <Suspense fallback={<div className="animate-pulse bg-gray-800 rounded-lg h-96"></div>}>
                                <AppSidebar 
                                    app={app} 
                                    relatedApps={relatedApps}
                                />
                            </Suspense>
                        </div>
                    </div>
                    
                    {/* Client-side interactive components */}
                    <AppPageClient app={app} relatedApps={relatedApps} />
                </div>
                
                {/* Structured Data for SEO */}
                <div 
                    itemScope 
                    itemType="https://schema.org/SoftwareApplication" 
                    style={{ display: 'none' }}
                >
                    <meta itemProp="name" content={app.name} />
                    <meta itemProp="description" content={app.description} />
                    <meta itemProp="applicationCategory" content={app.category?.name || 'Software'} />
                    <meta itemProp="operatingSystem" content="Windows" />
                    <meta itemProp="url" content={`https://appscracked.com/app/${app.slug}`} />
                    <meta itemProp="downloadUrl" content={`https://appscracked.com/app/${app.slug}`} />
                    <div itemProp="offers" itemScope itemType="https://schema.org/Offer">
                        <meta itemProp="price" content="0.00" />
                        <meta itemProp="priceCurrency" content="USD" />
                        <meta itemProp="availability" content="https://schema.org/InStock" />
                    </div>
                    <div itemProp="publisher" itemScope itemType="https://schema.org/Organization">
                        <meta itemProp="name" content="AppsCracked" />
                        <meta itemProp="url" content="https://appscracked.com" />
                    </div>
                </div>
            </main>
        </>
    )
}

// Main page component
export default async function AppPage({ params }) {
    const resolvedParams = await params
    
    return (
        <Suspense fallback={<AppLoading />}>
            <AppContent slug={resolvedParams.slug} />
        </Suspense>
    )
}