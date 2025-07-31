import { Suspense } from 'react'
import { notFound } from 'next/navigation'
import ApkPageClient from './ApkPageClient'
import ApkBreadcrumb from '../../../components/apk/ApkBreadcrumb'
import { generateApkDetailMetadata } from './metadata'

// Server-side data fetching
async function getApkData(slug) {
    try {
        const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'
        
        const response = await fetch(`${baseUrl}/api/v1/apk/${slug}`, {
            next: { revalidate: 300 },
            headers: { 'Content-Type': 'application/json' }
        })

        if (!response.ok) {
            if (response.status === 404) {
                return null
            }
            throw new Error('Failed to fetch APK')
        }

        const data = await response.json()
        
        if (!data.success || !data.data.apk) {
            return null
        }

        return {
            apk: data.data.apk,
            relatedApks: data.data.relatedApks || []
        }
    } catch (error) {
        console.error('Error fetching APK data:', error)
        return null
    }
}

export async function generateMetadata({ params }) {
    const resolvedParams = await params
    const data = await getApkData(resolvedParams.slug)
    
    if (!data) {
        return {
            title: 'APK Not Found | CrackMarket',
            description: 'The requested Android APK could not be found.'
        }
    }

    return generateApkDetailMetadata(data.apk)
}

export default async function ApkDetailPage({ params }) {
    const resolvedParams = await params
    const data = await getApkData(resolvedParams.slug)
    
    if (!data) {
        notFound()
    }

    const { apk, relatedApks } = data

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
            {/* Breadcrumb */}
            <ApkBreadcrumb apk={apk} />
            
            {/* Main Content */}
            <Suspense fallback={
                <div className="container mx-auto px-4 py-8">
                    <div className="animate-pulse">
                        {/* Header Skeleton */}
                        <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm border border-gray-700/40 rounded-2xl p-8 mb-8">
                            <div className="flex flex-col md:flex-row gap-6">
                                <div className="w-32 h-32 bg-gray-700 rounded-2xl"></div>
                                <div className="flex-1">
                                    <div className="h-8 bg-gray-700 rounded mb-4"></div>
                                    <div className="h-4 bg-gray-700 rounded mb-2"></div>
                                    <div className="h-4 bg-gray-700 rounded mb-4 w-3/4"></div>
                                    <div className="flex space-x-4">
                                        <div className="h-12 w-32 bg-gray-700 rounded-lg"></div>
                                        <div className="h-12 w-32 bg-gray-700 rounded-lg"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        {/* Content Skeleton */}
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            <div className="lg:col-span-2">
                                <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm border border-gray-700/40 rounded-2xl p-6">
                                    <div className="h-6 bg-gray-700 rounded mb-4"></div>
                                    <div className="space-y-2">
                                        {[...Array(6)].map((_, i) => (
                                            <div key={i} className="h-4 bg-gray-700 rounded"></div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                            <div>
                                <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm border border-gray-700/40 rounded-2xl p-6">
                                    <div className="h-6 bg-gray-700 rounded mb-4"></div>
                                    <div className="space-y-3">
                                        {[...Array(4)].map((_, i) => (
                                            <div key={i} className="flex justify-between">
                                                <div className="h-4 bg-gray-700 rounded w-1/3"></div>
                                                <div className="h-4 bg-gray-700 rounded w-1/2"></div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            }>
                <ApkPageClient 
                    apk={apk}
                    relatedApks={relatedApks}
                />
            </Suspense>
        </div>
    )
}
