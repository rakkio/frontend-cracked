import { Suspense } from 'react'
import { useRouter } from 'next/navigation'
import { notFound } from 'next/navigation'
import { api } from '@/lib/api'
import { FaDownload, FaStar, FaEye, FaShieldAlt, FaWindows, FaApple, FaLinux } from 'react-icons/fa'
import { BiCategory } from 'react-icons/bi'
import AppLoading from '@/components/app/AppLoading'
import AppPageClient from './AppPageClient' 
import { useRouter } from 'next/navigation'
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

    // Format numbers
    const formatNumber = (num) => {
        if (!num || num === 0) return '0'
        if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M'
        if (num >= 1000) return (num / 1000).toFixed(1) + 'K'
        return num.toString()
    }

    // Get platform icon
    const getPlatformIcon = (platforms) => {
        if (!platforms || platforms.length === 0) return null
        const platform = platforms[0].toLowerCase()
        if (platform.includes('windows')) return <FaWindows className="text-blue-500" />
        if (platform.includes('mac')) return <FaApple className="text-gray-600" />
        if (platform.includes('linux')) return <FaLinux className="text-orange-500" />
        return <FaWindows className="text-blue-500" />
    }

    const handleRedirect = (relatedApps) => {
        router.push(`/app/${relatedApps.slug}`)
    }

    const router = useRouter()  

    return (
        <>
            <main className="w-full min-h-screen bg-white relative overflow-x-hidden">
                {/* Breadcrumb */}
                <div className="bg-gray-50 border-b border-gray-200">
                    <div className="container mx-auto px-4 py-3">
                        <nav className="flex items-center space-x-2 text-sm text-gray-600">
                            <a href="/" className="hover:text-blue-600 transition-colors">Home</a>
                            <span>/</span>
                            <a href="/apps" className="hover:text-blue-600 transition-colors">Apps</a>
                            <span>/</span>
                            <span className="text-gray-900 font-medium">{app.name}</span>
                        </nav>
                    </div>
                </div>

                <div className="container mx-auto px-4 py-8">
                    {/* Hero Section */}
                    <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8 mb-8">
                        <div className="flex flex-col lg:flex-row items-start lg:items-center gap-8">
                            {/* App Icon */}
                            <div className="flex-shrink-0">
                                <div className="w-32 h-32 bg-gradient-to-br from-blue-500 to-purple-600 rounded-3xl flex items-center justify-center shadow-xl">
                                    {app.images ? (
                                        <img 
                                            src={app.images[0]} 
                                            alt={app.name}
                                            className="w-28 h-28 rounded-2xl object-cover "
                                        />
                                    ) : (
                                        <span className="text-4xl font-bold text-white">
                                            {app.name.charAt(0)}
                                        </span>
                                    )}
                                </div>
                            </div>

                            {/* App Info */}
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-3 mb-2">
                                    <h1 className="text-3xl font-bold text-gray-900 truncate">{app.name}</h1>
                                    {getPlatformIcon(app.platforms)}
                                </div>
                                
                                <div className="flex items-center gap-4 mb-4">
                                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                                        <BiCategory className="w-4 h-4 mr-1" />
                                        {app.category?.name || 'Software'}
                                    </span>
                                    {app.isPremium && (
                                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800">
                                            Premium
                                        </span>
                                    )}
                                </div>

                                <p className="text-gray-600 text-lg mb-6 line-clamp-2">
                                    {app.shortDescription || app.description}
                                </p>

                                {/* Rating */}
                                <div className="flex items-center gap-4 mb-6">
                                    <div className="flex items-center gap-2">
                                        <div className="flex items-center">
                                            {[...Array(5)].map((_, i) => (
                                                <FaStar 
                                                    key={i} 
                                                    className={`w-5 h-5 ${
                                                        i < Math.floor(app.rating || 4.5) 
                                                            ? 'text-yellow-400' 
                                                            : 'text-gray-300'
                                                    }`} 
                                                />
                                            ))}
                                        </div>
                                        <span className="text-lg font-semibold text-gray-900">
                                            {app.rating || '4.5'}
                                        </span>
                                        <span className="text-gray-500">
                                            ({formatNumber(app.reviewsCount || 90)} reviews)
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Download Button */}
                            <AppPageClient app={app} />
                            
                            <script dangerouslySetInnerHTML={{
                                __html: `
                                    document.addEventListener('DOMContentLoaded', function() {
                                        // This will be handled by the client component
                                    });
                                `
                            }} />       
                        </div>
                    </div>

                    {/* Quick Stats */}
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                        <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6 text-center">
                            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                                <FaDownload className="w-6 h-6 text-green-600" />
                            </div>
                            <div className="text-2xl font-bold text-gray-900 mb-1">
                                {formatNumber(app.downloads || app.downloadCount || 2300)}
                            </div>
                            <div className="text-sm text-gray-500">Downloads</div>
                        </div>

                        <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6 text-center">
                            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                                <FaShieldAlt className="w-6 h-6 text-blue-600" />
                            </div>
                            <div className="text-2xl font-bold text-gray-900 mb-1">
                                {app.version || '1.0.0'}
                            </div>
                            <div className="text-sm text-gray-500">Version</div>
                        </div>

                        <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6 text-center">
                            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                                <FaEye className="w-6 h-6 text-purple-600" />
                            </div>
                            <div className="text-2xl font-bold text-gray-900 mb-1">
                                {app.size || '150 MB'}
                            </div>
                            <div className="text-sm text-gray-500">Size</div>
                        </div>

                        <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6 text-center">
                            <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-3">
                                <FaStar className="w-6 h-6 text-orange-600" />
                            </div>
                            <div className="text-2xl font-bold text-gray-900 mb-1">
                                {new Date(app.updatedAt || app.createdAt).toLocaleDateString()}
                            </div>
                            <div className="text-sm text-gray-500">Updated</div>
                        </div>
                    </div>

                    {/* Tabs Section */}
                    <div className="bg-white rounded-2xl shadow-lg border border-gray-200 mb-8">
                        <div className="border-b border-gray-200">
                            <nav className="flex space-x-8 px-8">
                                <button className="py-4 px-1 border-b-2 border-blue-500 text-blue-600 font-medium text-sm">
                                    Overview
                                </button>
                                <button className="py-4 px-1 border-b-2 border-transparent text-gray-500 hover:text-gray-700 font-medium text-sm">
                                    Screenshots
                                </button>
                                <button className="py-4 px-1 border-b-2 border-transparent text-gray-500 hover:text-gray-700 font-medium text-sm">
                                    System Requirements
                                </button>
                                <button className="py-4 px-1 border-b-2 border-transparent text-gray-500 hover:text-gray-700 font-medium text-sm">
                                    Reviews
                                </button>
                            </nav>
                        </div>

                        <div className="p-8">
                            {/* Description */}
                            <div className="mb-8">
                                <h3 className="text-xl font-semibold text-gray-900 mb-4">About this app</h3>
                                <div className="prose max-w-none text-gray-600">
                                    <p>{app.description}</p>
                                </div>
                            </div>

                            {/* Screenshots */}
                            {app.images && app.images.length > 0 && (
                                <div className="mb-8">
                                    <h3 className="text-xl font-semibold text-gray-900 mb-4">Screenshots</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                        {app.images.slice(0, 6).map((image, index) => (
                                            <div key={index} className="aspect-video bg-gray-100 rounded-lg overflow-hidden">
                                                <img 
                                                    src={image} 
                                                    alt={`${app.name} screenshot ${index + 1}`}
                                                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-200"
                                                />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* System Requirements */}
                            <div className="mb-8">
                                <h3 className="text-xl font-semibold text-gray-900 mb-4">System Requirements</h3>
                                <div className="bg-gray-50 rounded-lg p-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <h4 className="font-medium text-gray-900 mb-2">Minimum Requirements</h4>
                                            <ul className="space-y-2 text-sm text-gray-600">
                                                <li>• OS: Windows 10 or later</li>
                                                <li>• Processor: Intel Core i3 or equivalent</li>
                                                <li>• Memory: 4 GB RAM</li>
                                                <li>• Storage: {app.size || '150 MB'} available space</li>
                                            </ul>
                                        </div>
                                        <div>
                                            <h4 className="font-medium text-gray-900 mb-2">Recommended</h4>
                                            <ul className="space-y-2 text-sm text-gray-600">
                                                <li>• OS: Windows 11</li>
                                                <li>• Processor: Intel Core i5 or equivalent</li>
                                                <li>• Memory: 8 GB RAM</li>
                                                <li>• Graphics: DirectX 11 compatible</li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Related Apps */}
                    {relatedApps && relatedApps.length > 0 && (
                        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
                            <h3 className="text-2xl font-bold text-gray-900 mb-6">Similar Apps</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {relatedApps.slice(0, 6).map((relatedApp) => (
                                    <div key={relatedApp._id} className="group cursor-pointer " onClick={() => router.push(`/app/${relatedApp.slug}`)}>
                                        <div className="bg-gray-50 rounded-xl p-6 hover:shadow-md transition-all duration-200 border border-gray-100 hover:border-gray-200">
                                            <div className="flex items-center gap-4 mb-4">
                                                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center flex-shrink-0">
                                                    {relatedApp.images ? (
                                                        <img 
                                                            src={relatedApp.images[0]} 
                                                            alt={relatedApp.name}
                                                            className="w-10 h-10 rounded-lg object-cover"
                                                        />
                                                    ) : (
                                                        <span className="text-lg font-bold text-white">
                                                            {relatedApp.name.charAt(0)}
                                                        </span>
                                                    )}
                                                </div>
                                                <div className="min-w-0 flex-1">
                                                    <h4 className="font-semibold text-gray-900 truncate group-hover:text-blue-600 transition-colors">
                                                        {relatedApp.name}
                                                    </h4>
                                                    <p className="text-sm text-gray-500">
                                                        {relatedApp.category?.name || 'Software'}
                                                    </p>
                                                </div>
                                            </div>
                                            
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-1">
                                                    <FaStar className="w-4 h-4 text-yellow-400" />
                                                    <span className="text-sm font-medium text-gray-700">
                                                        {relatedApp.rating || '4.5'}
                                                    </span>
                                                </div>
                                                <div className="text-sm text-gray-500">
                                                    {formatNumber(relatedApp.downloads || relatedApp.downloadCount || 1200)} downloads
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Client-side interactive components */}
                <AppPageClient app={app} relatedApps={relatedApps} />
            </main>
                
            {/* Structured Data for SEO */}
            <script 
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "SoftwareApplication",
                        "name": app.name,
                        "description": app.description,
                        "applicationCategory": app.category?.name || 'Software',
                        "operatingSystem": "Windows",
                        "url": `https://crackmarket.xyz/app/${app.slug}`,
                        "downloadUrl": `https://crackmarket.xyz/app/${app.slug}`,
                        "offers": {
                            "@type": "Offer",
                            "price": "0.00",
                            "priceCurrency": "USD",
                            "availability": "https://schema.org/InStock"
                        },
                        "publisher": {
                            "@type": "Organization",
                            "name": "CrackMarket",
                            "url": "https://crackmarket.xyz"
                        }
                    })
                }}
            />
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