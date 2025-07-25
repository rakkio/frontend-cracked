import { useState, useEffect } from 'react'
import { api } from '@/lib/api'

export const useHomeData = () => {
  const [featuredApps, setFeaturedApps] = useState([])
  const [stats, setStats] = useState(null)
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const [appsResponse, statsResponse, categoriesResponse] = await Promise.all([
          api.getFeaturedApps(12),
          api.getAppsStats(),
          api.getCategories()
        ])
        
        setFeaturedApps(appsResponse.apps || [])
        setStats(statsResponse.stats || {})
        setCategories(categoriesResponse.categories?.slice(0, 8) || [])
      } catch (err) {
        setError(err)
        console.error('Error fetching home data:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  return {
    featuredApps,
    stats,
    categories,
    loading,
    error
  }
}