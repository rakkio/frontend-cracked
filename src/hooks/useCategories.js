import { useState, useEffect, useCallback } from 'react'
import { api } from '@/lib/api'

/**
 * Custom hook for managing categories data and operations
 * Follows Single Responsibility Principle - only handles category-related logic
 */
export const useCategories = () => {
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Fetch categories with error handling
  const fetchCategories = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await api.getCategories()
      setCategories(response.categories || [])
    } catch (err) {
      console.error('Error fetching categories:', err)
      setError(err.message || 'Failed to fetch categories')
    } finally {
      setLoading(false)
    }
  }, [])

  // Get category by slug
  const getCategoryBySlug = useCallback((slug) => {
    return categories.find(category => category.slug === slug)
  }, [categories])

  // Get categories with apps count filter
  const getCategoriesWithApps = useCallback((minApps = 1) => {
    return categories.filter(category => (category.appsCount || 0) >= minApps)
  }, [categories])

  // Get top categories by apps count
  const getTopCategories = useCallback((limit = 6) => {
    return [...categories]
      .sort((a, b) => (b.appsCount || 0) - (a.appsCount || 0))
      .slice(0, limit)
  }, [categories])

  useEffect(() => {
    fetchCategories()
  }, [fetchCategories])

  return {
    categories,
    loading,
    error,
    refetch: fetchCategories,
    getCategoryBySlug,
    getCategoriesWithApps,
    getTopCategories
  }
} 