import { useState, useEffect, useCallback } from 'react'
import { api } from '@/lib/api'

/**
 * Custom hook for managing category-specific applications
 * Follows Single Responsibility Principle - only handles category apps logic
 * Follows Open/Closed Principle - can be extended without modification
 */
export const useCategoryApps = (categorySlug) => {
  const [apps, setApps] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 12,
    total: 0,
    totalPages: 0,
    hasNext: false,
    hasPrev: false
  })

  // Fetch apps by category with pagination
  const fetchCategoryApps = useCallback(async (page = 1, limit = 12, append = false) => {
    if (!categorySlug) return

    try {
      setLoading(true)
      setError(null)
      
      const response = await api.getAppsByCategory(categorySlug, {
        page,
        limit,
        sort: 'popularity' // Valid values: popularity, newest, rating, downloads, name
      })

      const newApps = response.data?.apps || []
      const paginationData = response.data?.pagination || {}

      if (append && page > 1) {
        setApps(prevApps => [...prevApps, ...newApps])
      } else {
        setApps(newApps)
      }

      setPagination({
        page: paginationData.page || page,
        limit: paginationData.limit || limit,
        total: paginationData.total || 0,
        totalPages: paginationData.totalPages || 0,
        hasNext: paginationData.hasNext || false,
        hasPrev: paginationData.hasPrev || false
      })

    } catch (err) {
      console.error('Error fetching category apps:', err)
      setError(err.message || 'Failed to fetch category applications')
      if (!append) {
        setApps([])
      }
    } finally {
      setLoading(false)
    }
  }, [categorySlug])

  // Load more apps (pagination)
  const loadMore = useCallback(() => {
    if (pagination.hasNext && !loading) {
      fetchCategoryApps(pagination.page + 1, pagination.limit, true)
    }
  }, [fetchCategoryApps, pagination.hasNext, pagination.page, pagination.limit, loading])

  // Refresh apps
  const refresh = useCallback(() => {
    fetchCategoryApps(1, pagination.limit, false)
  }, [fetchCategoryApps, pagination.limit])

  // Search within category
  const searchInCategory = useCallback(async (searchTerm, filters = {}) => {
    if (!categorySlug) return

    try {
      setLoading(true)
      setError(null)
      
      const response = await api.searchAppsInCategory(categorySlug, {
        search: searchTerm,
        ...filters,
        page: 1,
        limit: pagination.limit
      })

      const searchResults = response.data?.apps || []
      const paginationData = response.data?.pagination || {}

      setApps(searchResults)
      setPagination(prev => ({
        ...prev,
        ...paginationData,
        page: 1
      }))

    } catch (err) {
      console.error('Error searching in category:', err)
      setError(err.message || 'Failed to search in category')
    } finally {
      setLoading(false)
    }
  }, [categorySlug, pagination.limit])

  // Get featured apps from category
  const getFeaturedApps = useCallback((count = 6) => {
    return apps
      .filter(app => app.isFeatured || app.isHot)
      .slice(0, count)
  }, [apps])

  // Get apps by rating
  const getTopRatedApps = useCallback((count = 6) => {
    return [...apps]
      .sort((a, b) => (b.rating || 0) - (a.rating || 0))
      .slice(0, count)
  }, [apps])

  // Get newest apps
  const getNewestApps = useCallback((count = 6) => {
    return [...apps]
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, count)
  }, [apps])

  // Initial fetch when categorySlug changes
  useEffect(() => {
    if (categorySlug) {
      fetchCategoryApps(1, pagination.limit, false)
    } else {
      setApps([])
      setPagination(prev => ({
        ...prev,
        page: 1,
        total: 0,
        totalPages: 0,
        hasNext: false,
        hasPrev: false
      }))
    }
  }, [categorySlug, fetchCategoryApps])

  return {
    // Data
    apps,
    loading,
    error,
    pagination,
    
    // Actions
    fetchCategoryApps,
    loadMore,
    refresh,
    searchInCategory,
    
    // Computed values
    getFeaturedApps,
    getTopRatedApps,
    getNewestApps,
    
    // State checks
    hasApps: apps.length > 0,
    canLoadMore: pagination.hasNext && !loading,
    isEmpty: !loading && apps.length === 0
  }
} 