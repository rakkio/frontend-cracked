'use client'
import { Suspense, use } from 'react'
import { useAppDetails } from '@/hooks/useAppDetails'
import AppSEO from '@/components/app/AppSEO'
import AppBreadcrumb from '@/components/app/AppBreadcrumb'
import AppHeader from '@/components/app/AppHeader'
import AppDescription from '@/components/app/AppDescription'
import AppScreenshots from '@/components/app/AppScreenshots'
import AppSystemRequirements from '@/components/app/AppSystemRequirements'
import AppSidebar from '@/components/app/AppSidebar'
import AppLoading from '@/components/app/AppLoading'

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

// Main app content component
function AppContent({ slug }) {
    const { app, relatedApps, loading, error, handleDownload } = useAppDetails(slug)

    if (loading) {
        return <AppLoading />
    }

    if (error || !app) {
        return <AppError error={error} retry={() => window.location.reload()} />
    }

    return (
        <>
            <AppSEO app={app} />
            
            <main 
                className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-red-900 relative overflow-hidden" 
                itemScope 
                itemType="https://schema.org/SoftwareApplication"
            >
                {/* Animated background elements */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-red-500/5 rounded-full blur-3xl animate-pulse" />
                    <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-red-600/5 rounded-full blur-3xl animate-pulse" style={{animationDelay: '2s'}} />
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-r from-red-500/3 to-transparent rounded-full blur-3xl animate-spin" style={{animationDuration: '20s'}} />
                </div>
                
                <div className="container mx-auto px-4 py-8 max-w-7xl relative z-10">
                    <AppBreadcrumb app={app} />
                    
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                        {/* Main Content */}
                        <div className="lg:col-span-2">
                            <AppHeader app={app} onDownload={handleDownload} />
                            <AppDescription app={app} />
                            <AppScreenshots app={app} />
                            <AppSystemRequirements app={app} />
                        </div>
                        
                        {/* Sidebar */}
                        <AppSidebar app={app} relatedApps={relatedApps} />
                    </div>
                </div>

                {/* Hidden Schema Properties */}
                <div className="hidden">
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
export default function AppPage({ params }) {
    const resolvedParams = use(params)
    
    return (
        <Suspense fallback={<AppLoading />}>
            <AppContent slug={resolvedParams.slug} />
        </Suspense>
    )
}