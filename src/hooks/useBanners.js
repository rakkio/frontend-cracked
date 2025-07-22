'use client'
import { useState, useEffect, useCallback } from 'react'
import { api } from '@/lib/api'

/**
 * Custom hook for banner management
 * Following Single Responsibility Principle - manages only banner-related state and operations
 */
export const useBanners = (initialFilters = {}) => {
    const [banners, setBanners] = useState([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)
    const [pagination, setPagination] = useState({
        current: 1,
        pages: 1,
        total: 0,
        hasNext: false,
        hasPrev: false
    })

    // Fetch banners with filters
    const fetchBanners = useCallback(async (filters = {}) => {
        setLoading(true)
        setError(null)
        
        try {
            const response = await api.getAllBanners({
                ...initialFilters,
                ...filters
            })
            
            setBanners(response.data || [])
            setPagination(response.pagination || {
                current: 1,
                pages: 1,
                total: 0,
                hasNext: false,
                hasPrev: false
            })
        } catch (err) {
            console.error('Error fetching banners:', err)
            setError(err.message || 'Failed to fetch banners')
            setBanners([])
        } finally {
            setLoading(false)
        }
    }, [initialFilters])

    // Create banner
    const createBanner = useCallback(async (bannerData) => {
        setLoading(true)
        setError(null)
        
        try {
            const response = await api.createBanner(bannerData)
            
            // Add new banner to the beginning of the list
            setBanners(prev => [response.data, ...prev])
            
            return response.data
        } catch (err) {
            console.error('Error creating banner:', err)
            setError(err.message || 'Failed to create banner')
            throw err
        } finally {
            setLoading(false)
        }
    }, [])

    // Update banner
    const updateBanner = useCallback(async (id, bannerData) => {
        setLoading(true)
        setError(null)
        
        try {
            const response = await api.updateBanner(id, bannerData)
            
            // Update banner in the list
            setBanners(prev => 
                prev.map(banner => 
                    banner._id === id ? response.data : banner
                )
            )
            
            return response.data
        } catch (err) {
            console.error('Error updating banner:', err)
            setError(err.message || 'Failed to update banner')
            throw err
        } finally {
            setLoading(false)
        }
    }, [])

    // Delete banner
    const deleteBanner = useCallback(async (id) => {
        setLoading(true)
        setError(null)
        
        try {
            await api.deleteBanner(id)
            
            // Remove banner from the list
            setBanners(prev => prev.filter(banner => banner._id !== id))
            
            return true
        } catch (err) {
            console.error('Error deleting banner:', err)
            setError(err.message || 'Failed to delete banner')
            throw err
        } finally {
            setLoading(false)
        }
    }, [])

    // Search banners
    const searchBanners = useCallback(async (query, filters = {}) => {
        if (!query.trim()) {
            return fetchBanners(filters)
        }
        
        setLoading(true)
        setError(null)
        
        try {
            const response = await api.searchBanners(query, filters)
            setBanners(response.data || [])
            
            // Reset pagination for search results
            setPagination({
                current: 1,
                pages: 1,
                total: response.count || 0,
                hasNext: false,
                hasPrev: false
            })
        } catch (err) {
            console.error('Error searching banners:', err)
            setError(err.message || 'Failed to search banners')
            setBanners([])
        } finally {
            setLoading(false)
        }
    }, [fetchBanners])

    // Toggle banner status
    const toggleBannerStatus = useCallback(async (id, isActive) => {
        try {
            const response = await api.updateBanner(id, { isActive })
            
            setBanners(prev => 
                prev.map(banner => 
                    banner._id === id ? response.data : banner
                )
            )
            
            return response.data
        } catch (err) {
            console.error('Error toggling banner status:', err)
            setError(err.message || 'Failed to update banner status')
            throw err
        }
    }, [])

    // Toggle featured status
    const toggleFeaturedStatus = useCallback(async (id, isFeatured) => {
        try {
            const response = await api.updateBanner(id, { isFeatured })
            
            setBanners(prev => 
                prev.map(banner => 
                    banner._id === id ? response.data : banner
                )
            )
            
            return response.data
        } catch (err) {
            console.error('Error toggling featured status:', err)
            setError(err.message || 'Failed to update featured status')
            throw err
        }
    }, [])

    // Refresh banners
    const refresh = useCallback(() => {
        fetchBanners()
    }, [fetchBanners])

    // Load more banners (pagination)
    const loadMore = useCallback(async () => {
        if (!pagination.hasNext || loading) return
        
        try {
            const nextPage = pagination.current + 1
            const response = await api.getAllBanners({
                ...initialFilters,
                page: nextPage
            })
            
            setBanners(prev => [...prev, ...response.data])
            setPagination(response.pagination)
        } catch (err) {
            console.error('Error loading more banners:', err)
            setError(err.message || 'Failed to load more banners')
        }
    }, [pagination, loading, initialFilters])

    // Initial load
    useEffect(() => {
        fetchBanners()
    }, [])

    return {
        // State
        banners,
        loading,
        error,
        pagination,
        
        // Actions
        fetchBanners,
        createBanner,
        updateBanner,
        deleteBanner,
        searchBanners,
        toggleBannerStatus,
        toggleFeaturedStatus,
        refresh,
        loadMore,
        
        // Utils
        clearError: () => setError(null)
    }
}

/**
 * Hook for managing public banners (no auth required)
 * Following Open/Closed Principle - extends functionality without modifying useBanners
 */
export const usePublicBanners = () => {
    const [heroBanners, setHeroBanners] = useState([])
    const [featuredBanners, setFeaturedBanners] = useState([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)

    const fetchHeroBanners = useCallback(async (limit = 5) => {
        setLoading(true)
        try {
            const response = await api.getBannersByPosition('hero', { limit })
            setHeroBanners(response.data || [])
        } catch (err) {
            console.error('Error fetching hero banners:', err)
            setError(err.message || 'Failed to fetch hero banners')
        } finally {
            setLoading(false)
        }
    }, [])

    const fetchFeaturedBanners = useCallback(async (limit = 3) => {
        setLoading(true)
        try {
            const response = await api.getFeaturedBanners({ limit })
            setFeaturedBanners(response.data || [])
        } catch (err) {
            console.error('Error fetching featured banners:', err)
            setError(err.message || 'Failed to fetch featured banners')
        } finally {
            setLoading(false)
        }
    }, [])

    const trackImpression = useCallback(async (bannerId) => {
        try {
            await api.incrementBannerImpressions(bannerId)
        } catch (err) {
            console.error('Error tracking impression:', err)
        }
    }, [])

    const trackClick = useCallback(async (bannerId) => {
        try {
            await api.incrementBannerClicks(bannerId)
        } catch (err) {
            console.error('Error tracking click:', err)
        }
    }, [])

    return {
        heroBanners,
        featuredBanners,
        loading,
        error,
        fetchHeroBanners,
        fetchFeaturedBanners,
        trackImpression,
        trackClick,
        clearError: () => setError(null)
    }
}

/**
 * Hook for banner statistics (admin only)
 */
export const useBannerStats = () => {
    const [stats, setStats] = useState(null)
    const [topPerforming, setTopPerforming] = useState([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)

    const fetchStats = useCallback(async () => {
        setLoading(true)
        try {
            const response = await api.getBannerStats()
            setStats(response.data.stats)
            setTopPerforming(response.data.topPerforming || [])
        } catch (err) {
            console.error('Error fetching banner stats:', err)
            setError(err.message || 'Failed to fetch banner stats')
        } finally {
            setLoading(false)
        }
    }, [])

    useEffect(() => {
        fetchStats()
    }, [])

    return {
        stats,
        topPerforming,
        loading,
        error,
        fetchStats,
        clearError: () => setError(null)
    }
} 