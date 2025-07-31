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
        <div className="min-h-screen bg-gradient-to-br from-white via-gray-50 to-blue-50 relative overflow-hidden">
            {/* Animated Background Elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-cyan-400/10 to-blue-500/15 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-purple-400/10 to-pink-500/15 rounded-full blur-3xl animate-pulse delay-1000"></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-emerald-400/8 to-teal-500/12 rounded-full blur-3xl animate-pulse delay-500"></div>
                <div className="absolute top-20 left-1/4 w-64 h-64 bg-gradient-to-br from-orange-400/8 to-red-500/12 rounded-full blur-3xl animate-pulse delay-2000"></div>
            </div>
            
            {/* Light Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/60 via-transparent to-blue-50/40 pointer-events-none"></div>
            
            {/* Header Section */}
            <ApkHeader stats={data.stats} />
            
            {/* Main Content */}
            <Suspense fallback={
                <div className="container mx-auto px-4 py-8 relative z-10">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                        {[...Array(12)].map((_, i) => (
                            <div key={i} className="group relative">
                                {/* Luxury Glow Effect */}
                                <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 rounded-3xl blur opacity-20 group-hover:opacity-40 transition duration-1000 animate-pulse"></div>
                                
                                {/* Light Card */}
                                <div className="relative bg-white/90 backdrop-blur-xl border border-gray-200/60 rounded-3xl p-6 h-full shadow-xl hover:shadow-2xl transition-all duration-300">
                                    <div className="w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl mx-auto mb-4 animate-pulse shadow-inner"></div>
                                    <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded-full mb-2 animate-pulse"></div>
                                    <div className="h-3 bg-gradient-to-r from-gray-200 to-gray-300 rounded-full mb-3 animate-pulse"></div>
                                    <div className="flex justify-center space-x-2">
                                        <div className="h-6 w-16 bg-gradient-to-r from-cyan-100 to-blue-200 rounded-full animate-pulse"></div>
                                        <div className="h-6 w-16 bg-gradient-to-r from-purple-100 to-pink-200 rounded-full animate-pulse"></div>
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
