import { Suspense } from 'react'
import ApkPageClient from './ApkPageClient'
import ApkHeader from '@/components/apk/ApkHeader'
import { generateApkMetadata } from './metadata'

// Server-side data fetching
async function getApkData() {
    try {
        const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'
        
        // Fetch APK stats and featured APKs
        const [statsResponse, featuredResponse] = await Promise.all([
            fetch(`${baseUrl}/api/v1/apk/stats`, { 
                next: { revalidate: 300 },
                headers: { 'Content-Type': 'application/json' }
            }),
            fetch(`${baseUrl}/api/v1/apk/featured?limit=8`, { 
                next: { revalidate: 300 },
                headers: { 'Content-Type': 'application/json' }
            })
        ])

        const stats = statsResponse.ok ? await statsResponse.json() : { data: {} }
        const featured = featuredResponse.ok ? await featuredResponse.json() : { data: [] }

        return {
            stats: stats.data || {},
            featured: featured.data || []
        }
    } catch (error) {
        console.error('Error fetching APK data:', error)
        return {
            stats: {},
            featured: []
        }
    }
}

export async function generateMetadata() {
    const data = await getApkData()
    return generateApkMetadata(data.stats)
}

export default async function ApkPage({ searchParams }) {
    const data = await getApkData()
    
    return (
        <div className="min-h-screen bg-white">
            {/* Hero Section with Modern Design */}
            <section className="relative py-20 bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 overflow-hidden">
                {/* Animated Background Elements */}
                <div className="absolute inset-0">
                    <div className="absolute top-0 left-0 w-72 h-72 bg-green-400/10 rounded-full blur-3xl animate-pulse"></div>
                    <div className="absolute top-0 right-0 w-72 h-72 bg-emerald-400/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
                    <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-96 h-96 bg-teal-400/10 rounded-full blur-3xl animate-pulse delay-2000"></div>
                </div>

                <div className="container mx-auto px-4 relative z-10">
                    <div className="text-center mb-12">
                        <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-600 rounded-3xl mb-6 shadow-lg">
                            <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M17.523 15.3414c-.0441-.2966-.2217-.5845-.4878-.7529l-2.8041-1.7373c-.1887-.1167-.4355-.1167-.624 0l-2.8041 1.7373c-.2661.1685-.4437.4563-.4878.7529l-.6548 4.3711c-.0415.2764.2217.5088.4878.5088h6.2217c.2661 0 .5293-.2324.4878-.5088l-.6548-4.3711zm-3.523 2.6211c-.8281 0-1.5-.6719-1.5-1.5s.6719-1.5 1.5-1.5 1.5.6719 1.5 1.5-.6719 1.5-1.5 1.5z"/>
                            </svg>
                        </div>
                        <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 bg-clip-text text-transparent mb-6">
                            Android APKs
                        </h1>
                        <p className="text-gray-600 text-lg md:text-xl max-w-3xl mx-auto mb-8">
                            Discover the best cracked Android applications. Premium apps, games, and tools with all features unlocked.
                        </p>
                        
                        {/* Quick Stats */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
                            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
                                <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl mb-3 mx-auto">
                                    <svg className="text-white text-xl" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                                    </svg>
                                </div>
                                <h3 className="font-bold text-2xl text-gray-800 mb-1">{data.stats.totalApks || 0}</h3>
                                <p className="text-gray-600 text-sm font-medium">Total APKs</p>
                            </div>
                            
                            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
                                <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl mb-3 mx-auto">
                                    <svg className="text-white text-xl" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M16 6l2.29 2.29-4.88 4.88-4-4L2 16.59 3.41 18l6-6 4 4 6.3-6.29L22 12V6z"/>
                                    </svg>
                                </div>
                                <h3 className="font-bold text-2xl text-gray-800 mb-1">{data.stats.totalDownloads || 0}</h3>
                                <p className="text-gray-600 text-sm font-medium">Downloads</p>
                            </div>
                            
                            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
                                <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-teal-500 to-teal-600 rounded-xl mb-3 mx-auto">
                                    <svg className="text-white text-xl" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                                    </svg>
                                </div>
                                <h3 className="font-bold text-2xl text-gray-800 mb-1">{data.stats.avgRating || '4.5'}</h3>
                                <p className="text-gray-600 text-sm font-medium">Avg Rating</p>
                            </div>
                            
                            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
                                <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-cyan-500 to-cyan-600 rounded-xl mb-3 mx-auto">
                                    <svg className="text-white text-xl" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                                    </svg>
                                </div>
                                <h3 className="font-bold text-2xl text-gray-800 mb-1">100%</h3>
                                <p className="text-gray-600 text-sm font-medium">Safe & Clean</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Main Content */}
            <Suspense fallback={
                <div className="container mx-auto px-4 py-12">
                    <div className="text-center mb-12">
                        <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-200 border-t-green-500 mx-auto mb-4"></div>
                        <p className="text-gray-600">Loading Android applications...</p>
                    </div>
                    
                    {/* Loading Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                        {[...Array(12)].map((_, i) => (
                            <div key={i} className="group relative">
                                {/* Luxury Glow Effect */}
                                <div className="absolute -inset-0.5 bg-gradient-to-r from-green-400 via-emerald-500 to-teal-500 rounded-3xl blur opacity-20 group-hover:opacity-40 transition duration-1000 animate-pulse"></div>
                                
                                {/* Light Card */}
                                <div className="relative bg-white/90 backdrop-blur-xl border border-gray-200/60 rounded-3xl p-6 h-full shadow-xl hover:shadow-2xl transition-all duration-300">
                                    <div className="w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl mx-auto mb-4 animate-pulse shadow-inner"></div>
                                    <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded-full mb-2 animate-pulse"></div>
                                    <div className="h-3 bg-gradient-to-r from-gray-200 to-gray-300 rounded-full mb-3 animate-pulse"></div>
                                    <div className="flex justify-center space-x-2">
                                        <div className="h-6 w-16 bg-gradient-to-r from-green-100 to-emerald-200 rounded-full animate-pulse"></div>
                                        <div className="h-6 w-16 bg-gradient-to-r from-teal-100 to-cyan-200 rounded-full animate-pulse"></div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            }>
                <ApkPageClient 
                    initialStats={data.stats}
                    initialFeatured={data.featured}
                    searchParams={searchParams}
                />
            </Suspense>
        </div>
    )
}
