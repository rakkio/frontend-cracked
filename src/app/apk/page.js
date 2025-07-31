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
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
            {/* Header Section */}
            <ApkHeader stats={data.stats} />
            
            {/* Main Content */}
            <Suspense fallback={
                <div className="container mx-auto px-4 py-8">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {[...Array(12)].map((_, i) => (
                            <div key={i} className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm border border-gray-700/40 rounded-2xl p-6 animate-pulse">
                                <div className="w-20 h-20 bg-gray-700 rounded-xl mx-auto mb-4"></div>
                                <div className="h-4 bg-gray-700 rounded mb-2"></div>
                                <div className="h-3 bg-gray-700 rounded mb-3"></div>
                                <div className="flex justify-center space-x-2">
                                    <div className="h-6 w-16 bg-gray-700 rounded-full"></div>
                                    <div className="h-6 w-16 bg-gray-700 rounded-full"></div>
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
