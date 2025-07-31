'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import GamesHeader from '@/components/games/GamesHeader'
import GamesGrid from '@/components/games/GamesGrid'
import GamesFilters from '@/components/games/GamesFilters'
import Pagination from '@/components/ui/Pagination'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'

export default function GamesPageClient({ initialData, initialStats }) {
    const router = useRouter()
    const searchParams = useSearchParams()
    
    const [games, setGames] = useState(initialData?.games || [])
    const [pagination, setPagination] = useState(initialData?.pagination || {})
    const [stats, setStats] = useState(initialStats || {})
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)
    
    // Filter states
    const [filters, setFilters] = useState({
        search: searchParams.get('search') || '',
        category: searchParams.get('category') || '',
        genre: searchParams.get('genre') || '',
        featured: searchParams.get('featured') === 'true',
        platform: searchParams.get('platform') || '',
        releaseYear: searchParams.get('releaseYear') || '',
        esrbRating: searchParams.get('esrbRating') || '',
        gameMode: searchParams.get('gameMode') || '',
        sort: searchParams.get('sort') || 'createdAt',
        order: searchParams.get('order') || 'desc',
        page: parseInt(searchParams.get('page')) || 1,
        limit: parseInt(searchParams.get('limit')) || 12
    })
    
    const [viewMode, setViewMode] = useState('grid')

    // Fetch Games with current filters
    const fetchGames = async (newFilters = filters) => {
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
            const response = await fetch(`${API_BASE_URL}/api/v1/games?${queryParams}`)
            
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`)
            }
            
            const data = await response.json()
            
            if (data.success) {
                setGames(data.data.games)
                setPagination(data.data.pagination)
            } else {
                throw new Error(data.message || 'Failed to fetch games')
            }
        } catch (err) {
            console.error('Error fetching games:', err)
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
        
        const newURL = `/games${queryParams.toString() ? `?${queryParams.toString()}` : ''}`
        router.push(newURL, { scroll: false })
    }

    // Handle filter changes
    const handleFilterChange = (newFilters) => {
        const updatedFilters = { ...filters, ...newFilters, page: 1 }
        setFilters(updatedFilters)
        updateURL(updatedFilters)
        fetchGames(updatedFilters)
    }

    // Handle pagination
    const handlePageChange = (page) => {
        const updatedFilters = { ...filters, page }
        setFilters(updatedFilters)
        updateURL(updatedFilters)
        fetchGames(updatedFilters)
    }

    // Handle view mode change
    const handleViewModeChange = (mode) => {
        setViewMode(mode)
    }

    // Featured games for header
    const featuredGames = games.filter(game => game.featured).slice(0, 3)

    return (
        <div className="min-h-screen bg-black text-white">
            {/* Header Section */}
            <GamesHeader 
                stats={stats}
                featuredGames={featuredGames}
            />

            <div className="container mx-auto px-4 py-8">
                {/* Filters */}
                <GamesFilters
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

                {/* Games Grid */}
                {!loading && (
                    <>
                        <GamesGrid
                            games={games}
                            viewMode={viewMode}
                            loading={loading}
                        />

                        {/* Empty State */}
                        {games.length === 0 && !loading && (
                            <div className="text-center py-12">
                                <div className="text-6xl mb-4">🎮</div>
                                <h3 className="text-xl font-mono text-gray-400 mb-2">
                                    No games found
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
