'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import ApkGrid from '@/components/apk/ApkGrid'
import ApkFilters from '@/components/apk/ApkFilters'
import Pagination from '@/components/ui/Pagination'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'

export default function ApkPageClient({ initialStats, initialFeatured, searchParams }) {
    const router = useRouter()
    const urlSearchParams = useSearchParams()
    
    // State management
    const [apks, setApks] = useState([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)
    const [pagination, setPagination] = useState({
        currentPage: 1,
        totalPages: 1,
        totalItems: 0,
        itemsPerPage: 12
    })
    
    // Filter states
    const [filters, setFilters] = useState({
        category: searchParams?.category || '',
        featured: searchParams?.featured || '',
        sort: searchParams?.sort || 'downloads',
        order: searchParams?.order || 'desc',
        search: searchParams?.search || '',
        page: parseInt(searchParams?.page) || 1
    })
    
    const [viewMode, setViewMode] = useState('grid')
    const [showFeatured, setShowFeatured] = useState(true)

    // Fetch APKs function
    const fetchApks = useCallback(async (filterParams = filters) => {
        setLoading(true)
        setError(null)
        
        try {
            const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'
            const queryParams = new URLSearchParams()
            
            // Add filter parameters
            Object.entries(filterParams).forEach(([key, value]) => {
                if (value && value !== '') {
                    queryParams.append(key, value)
                }
            })
            
            const response = await fetch(`${baseUrl}/api/v1/apk?${queryParams}`)
            
            if (!response.ok) {
                throw new Error('Failed to fetch APKs')
            }
            
            const data = await response.json()
            
            if (data.success) {
                setApks(data.data)
                setPagination(data.pagination)
                setShowFeatured(filterParams.page === 1 && !filterParams.search && !filterParams.category)
            } else {
                throw new Error(data.message || 'Failed to fetch APKs')
            }
        } catch (err) {
            console.error('Error fetching APKs:', err)
            setError(err.message)
            setApks([])
        } finally {
            setLoading(false)
        }
    }, [filters])

    // Update URL when filters change
    const updateURL = useCallback((newFilters) => {
        const params = new URLSearchParams()
        
        Object.entries(newFilters).forEach(([key, value]) => {
            if (value && value !== '' && value !== 1) {
                params.set(key, value)
            }
        })
        
        const newURL = params.toString() ? `/apk?${params.toString()}` : '/apk'
        router.push(newURL, { scroll: false })
    }, [router])

    // Handle filter changes
    const handleFilterChange = useCallback((newFilters) => {
        const updatedFilters = { ...filters, ...newFilters, page: 1 }
        setFilters(updatedFilters)
        updateURL(updatedFilters)
    }, [filters, updateURL])

    // Handle page change
    const handlePageChange = useCallback((page) => {
        const updatedFilters = { ...filters, page }
        setFilters(updatedFilters)
        updateURL(updatedFilters)
        
        // Scroll to top
        window.scrollTo({ top: 0, behavior: 'smooth' })
    }, [filters, updateURL])

    // Handle APK click
    const handleApkClick = useCallback((apk) => {
        // Track analytics
        if (typeof gtag !== 'undefined') {
            gtag('event', 'apk_click', {
                apk_id: apk._id,
                apk_name: apk.name,
                category: apk.category?.name
            })
        }
        
        router.push(`/apk/${apk.slug}`)
    }, [router])

    // Initial data fetch
    useEffect(() => {
        fetchApks()
    }, [fetchApks])

    // Handle search params changes
    useEffect(() => {
        const newFilters = {
            category: urlSearchParams.get('category') || '',
            featured: urlSearchParams.get('featured') || '',
            sort: urlSearchParams.get('sort') || 'downloads',
            order: urlSearchParams.get('order') || 'desc',
            search: urlSearchParams.get('search') || '',
            page: parseInt(urlSearchParams.get('page')) || 1
        }
        
        setFilters(newFilters)
    }, [urlSearchParams])

    return (
        <div className="container mx-auto px-4 py-8">
            {/* Featured APKs Section */}
            {showFeatured && initialFeatured.length > 0 && (
                <section className="mb-12">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-3xl font-bold text-white flex items-center">
                            <span className="bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent">
                                🔥 Featured APKs
                            </span>
                        </h2>
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {initialFeatured.map((apk) => (
                            <div
                                key={apk._id}
                                className="bg-gradient-to-br from-green-800/30 to-blue-800/30 backdrop-blur-sm border border-green-500/30 rounded-2xl p-6 hover:border-green-400/50 transition-all duration-300 cursor-pointer group hover:scale-105 hover:shadow-2xl hover:shadow-green-500/20"
                                onClick={() => handleApkClick(apk)}
                            >
                                <div className="relative w-16 h-16 mx-auto mb-4">
                                    <img
                                        src={apk.images?.[0] || '/placeholder-app.png'}
                                        alt={apk.name}
                                        className="w-full h-full rounded-xl object-cover"
                                    />
                                    <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center">
                                        <span className="text-xs">⭐</span>
                                    </div>
                                </div>
                                
                                <h3 className="font-bold text-white text-center mb-2 group-hover:text-green-400 transition-colors">
                                    {apk.name}
                                </h3>
                                
                                <p className="text-gray-400 text-sm text-center mb-3">
                                    {apk.developer}
                                </p>
                                
                                <div className="flex justify-center space-x-2 text-xs">
                                    {apk.downloads > 0 && (
                                        <span className="bg-green-500/20 text-green-400 px-2 py-1 rounded-full">
                                            {apk.downloads.toLocaleString()} DL
                                        </span>
                                    )}
                                    {apk.rating > 0 && (
                                        <span className="bg-yellow-500/20 text-yellow-400 px-2 py-1 rounded-full">
                                            ⭐ {apk.rating.toFixed(1)}
                                        </span>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {/* Filters and Controls */}
            <div className="mb-8">
                <ApkFilters
                    filters={filters}
                    onFilterChange={handleFilterChange}
                    viewMode={viewMode}
                    onViewModeChange={setViewMode}
                    totalItems={pagination.totalItems}
                />
            </div>

            {/* Error State */}
            {error && (
                <div className="bg-red-900/50 border border-red-500/50 rounded-2xl p-6 mb-8">
                    <h3 className="text-red-400 font-bold mb-2">Error Loading APKs</h3>
                    <p className="text-red-300">{error}</p>
                    <button
                        onClick={() => fetchApks()}
                        className="mt-4 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
                    >
                        Try Again
                    </button>
                </div>
            )}

            {/* Loading State */}
            {loading && (
                <div className="flex justify-center py-12">
                    <LoadingSpinner />
                </div>
            )}

            {/* APKs Grid */}
            {!loading && !error && (
                <>
                    <ApkGrid
                        apks={apks}
                        viewMode={viewMode}
                        handleApkClick={handleApkClick}
                    />

                    {/* Pagination */}
                    {pagination.totalPages > 1 && (
                        <div className="mt-12 flex justify-center">
                            <Pagination
                                currentPage={pagination.currentPage}
                                totalPages={pagination.totalPages}
                                onPageChange={handlePageChange}
                            />
                        </div>
                    )}
                </>
            )}

            {/* Empty State */}
            {!loading && !error && apks.length === 0 && (
                <div className="text-center py-16">
                    <div className="text-6xl text-gray-600 mb-4">📱</div>
                    <h3 className="text-2xl font-bold text-white mb-2">No APKs Found</h3>
                    <p className="text-gray-400 mb-6">
                        {filters.search 
                            ? `No APKs found for "${filters.search}"`
                            : 'No APKs match your current filters'
                        }
                    </p>
                    <button
                        onClick={() => handleFilterChange({ search: '', category: '', featured: '' })}
                        className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg transition-colors"
                    >
                        Clear Filters
                    </button>
                </div>
            )}
        </div>
    )
}
