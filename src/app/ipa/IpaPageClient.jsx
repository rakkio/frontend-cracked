'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import IpaHeader from '@/components/ipa/IpaHeader'
import IpaGrid from '@/components/ipa/IpaGrid'
import IpaFilters from '@/components/ipa/IpaFilters'
import Pagination from '@/components/ui/Pagination'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'

export default function IpaPageClient({ initialData, initialStats }) {
    const router = useRouter()
    const searchParams = useSearchParams()
    
    const [ipas, setIpas] = useState(initialData?.ipas || [])
    const [pagination, setPagination] = useState(initialData?.pagination || {})
    const [stats, setStats] = useState(initialStats || {})
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)
    
    // Filter states
    const [filters, setFilters] = useState({
        search: searchParams.get('search') || '',
        category: searchParams.get('category') || '',
        featured: searchParams.get('featured') === 'true',
        jailbreak: searchParams.get('jailbreak') || '',
        minIosVersion: searchParams.get('minIosVersion') || '',
        deviceCompatibility: searchParams.get('deviceCompatibility') || '',
        sort: searchParams.get('sort') || 'createdAt',
        order: searchParams.get('order') || 'desc',
        page: parseInt(searchParams.get('page')) || 1,
        limit: parseInt(searchParams.get('limit')) || 12
    })
    
    const [viewMode, setViewMode] = useState('grid')

    // Fetch IPAs with current filters
    const fetchIpas = async (newFilters = filters) => {
        setLoading(true)
        setError(null)
        
        try {
            const queryParams = new URLSearchParams()
            
            Object.entries(newFilters).forEach(([key, value]) => {
                if (value !== '' && value !== false && value !== null && value !== undefined) {
                    queryParams.append(key, value.toString())
                }
            })
            
            const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.crackmarket.xyz'
            const response = await fetch(`${API_BASE_URL}/api/v1/ipa?${queryParams}`)
            
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`)
            }
            
            const data = await response.json()
            
            if (data.success) {
                setIpas(data.data.ipas)
                setPagination(data.data.pagination)
            } else {
                throw new Error(data.message || 'Failed to fetch IPAs')
            }
        } catch (err) {
            console.error('Error fetching IPAs:', err)
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    // Update URL with current filters
    const updateURL = (newFilters) => {
        const queryParams = new URLSearchParams()
        
        Object.entries(newFilters).forEach(([key, value]) => {
            if (value !== '' && value !== false && value !== null && value !== undefined && key !== 'limit') {
                queryParams.append(key, value.toString())
            }
        })
        
        const newURL = `/ipa${queryParams.toString() ? `?${queryParams.toString()}` : ''}`
        router.push(newURL, { scroll: false })
    }

    // Handle filter changes
    const handleFilterChange = (newFilters) => {
        const updatedFilters = { ...filters, ...newFilters, page: 1 }
        setFilters(updatedFilters)
        updateURL(updatedFilters)
        fetchIpas(updatedFilters)
    }

    // Handle pagination
    const handlePageChange = (page) => {
        const updatedFilters = { ...filters, page }
        setFilters(updatedFilters)
        updateURL(updatedFilters)
        fetchIpas(updatedFilters)
    }

    // Handle view mode change
    const handleViewModeChange = (mode) => {
        setViewMode(mode)
    }

    // Featured IPAs for header
    const featuredIpas = ipas.filter(ipa => ipa.featured).slice(0, 3)

    return (
        <div className="min-h-screen bg-black text-white">
            {/* Header Section */}
            <IpaHeader 
                stats={stats}
                featuredIpas={featuredIpas}
            />

            <div className="container mx-auto px-4 py-8">
                {/* Filters */}
                <IpaFilters
                    filters={filters}
                    onFilterChange={handleFilterChange}
                    viewMode={viewMode}
                    onViewModeChange={handleViewModeChange}
                    loading={loading}
                />

                {/* Error State */}
                {error && (
                    <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-4 mb-6">
                        <p className="text-red-400 font-mono text-sm">
                            Error: {error}
                        </p>
                    </div>
                )}

                {/* Loading State */}
                {loading && (
                    <div className="flex justify-center py-12">
                        <LoadingSpinner />
                    </div>
                )}

                {/* IPAs Grid */}
                {!loading && (
                    <>
                        <IpaGrid
                            ipas={ipas}
                            viewMode={viewMode}
                            loading={loading}
                        />

                        {/* Empty State */}
                        {ipas.length === 0 && !loading && (
                            <div className="text-center py-12">
                                <div className="text-6xl mb-4">📱</div>
                                <h3 className="text-xl font-mono text-gray-400 mb-2">
                                    No IPAs found
                                </h3>
                                <p className="text-gray-500 font-mono text-sm">
                                    Try adjusting your filters or search terms
                                </p>
                            </div>
                        )}

                        {/* Pagination */}
                        {pagination.totalPages > 1 && (
                            <div className="mt-8">
                                <Pagination
                                    currentPage={pagination.currentPage}
                                    totalPages={pagination.totalPages}
                                    onPageChange={handlePageChange}
                                    showInfo={true}
                                    totalItems={pagination.totalItems}
                                    itemsPerPage={pagination.limit}
                                />
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    )
}
