import { useState, useEffect, useCallback } from 'react'
import { api } from '@/lib/api'

/**
 * Custom hook for admin dashboard statistics
 * Follows Single Responsibility Principle - only handles admin stats logic
 */
export const useAdminStats = () => {
  const [stats, setStats] = useState({
    apps: null,
    categories: null,
    users: null,
    overview: null
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Fetch all admin statistics
  const fetchAdminStats = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      
      // Fetch stats in parallel for better performance
      const [appsStats, categoriesStats, usersStats] = await Promise.all([
        api.getAppsStats().catch(err => ({ error: err.message })),
        api.getCategoriesStats().catch(err => ({ error: err.message })),
        api.getUsersStats().catch(err => ({ error: err.message }))
      ])
      
      // Process app stats
      const processedAppsStats = appsStats.error ? null : {
        totalApps: appsStats.stats?.totalApps || 0,
        activeApps: appsStats.stats?.activeApps || 0,
        featuredApps: appsStats.stats?.featuredApps || 0,
        totalDownloads: appsStats.stats?.totalDownloads || 0,
        avgRating: appsStats.stats?.avgRating || 0,
        categoryStats: appsStats.categoryStats || []
      }
      
      // Process category stats
      const processedCategoriesStats = categoriesStats.error ? null : {
        totalCategories: categoriesStats.stats?.totalCategories || 0,
        activeCategories: categoriesStats.stats?.activeCategories || 0,
        featuredCategories: categoriesStats.stats?.featuredCategories || 0,
        categoriesWithApps: categoriesStats.stats?.categoriesWithApps || 0,
        avgAppsPerCategory: categoriesStats.stats?.avgAppsPerCategory || 0,
        appsPerCategory: categoriesStats.appsPerCategory || []
      }
      
      // Process user stats
      const processedUsersStats = usersStats.error ? null : {
        totalUsers: usersStats.stats?.totalUsers || 0,
        activeUsers: usersStats.stats?.activeUsers || 0,
        adminUsers: usersStats.stats?.adminUsers || 0,
        moderatorUsers: usersStats.stats?.moderatorUsers || 0,
        recentUsers: usersStats.stats?.recentUsers || 0
      }
      
      // Create overview stats
      const overview = {
        totalContent: (processedAppsStats?.totalApps || 0) + (processedCategoriesStats?.totalCategories || 0),
        totalEngagement: processedAppsStats?.totalDownloads || 0,
        contentHealth: processedAppsStats?.totalApps > 0 
          ? Math.round((processedAppsStats.activeApps / processedAppsStats.totalApps) * 100)
          : 0,
        avgQuality: processedAppsStats?.avgRating || 0
      }
      
      setStats({
        apps: processedAppsStats,
        categories: processedCategoriesStats,
        users: processedUsersStats,
        overview
      })
      
    } catch (err) {
      console.error('Error fetching admin stats:', err)
      setError(err.message || 'Failed to fetch admin statistics')
    } finally {
      setLoading(false)
    }
  }, [])

  // Get recent activity data
  // TODO: Implement when backend route is ready
  const getRecentActivity = useCallback(async () => {
    try {
      // Return mock data for now
      console.warn('Recent activity endpoint not implemented yet')
      return []
    } catch (err) {
      console.error('Error fetching recent activity:', err)
      return []
    }
  }, [])

  // Get growth metrics
  // TODO: Implement when backend route is ready
  const getGrowthMetrics = useCallback(async (period = '30d') => {
    try {
      // Return mock data for now
      console.warn('Growth metrics endpoint not implemented yet')
      return null
    } catch (err) {
      console.error('Error fetching growth metrics:', err)
      return null
    }
  }, [])

  // Refresh all stats
  const refresh = useCallback(() => {
    fetchAdminStats()
  }, [fetchAdminStats])

  // Initial load
  useEffect(() => {
    fetchAdminStats()
  }, [fetchAdminStats])

  // Calculate derived metrics
  const derivedMetrics = {
    appsGrowthRate: stats.apps ? 
      ((stats.apps.activeApps / Math.max(stats.apps.totalApps, 1)) * 100).toFixed(1) : 0,
    categoriesUtilization: stats.categories ? 
      ((stats.categories.categoriesWithApps / Math.max(stats.categories.totalCategories, 1)) * 100).toFixed(1) : 0,
    avgDownloadsPerApp: stats.apps ? 
      Math.round(stats.apps.totalDownloads / Math.max(stats.apps.totalApps, 1)) : 0,
    adminPercentage: stats.users ? 
      ((stats.users.adminUsers / Math.max(stats.users.totalUsers, 1)) * 100).toFixed(1) : 0
  }

  return {
    stats,
    loading,
    error,
    refresh,
    derivedMetrics,
    getRecentActivity,
    getGrowthMetrics,
    
    // Convenience getters
    hasAppsData: !!stats.apps,
    hasCategoriesData: !!stats.categories,
    hasUsersData: !!stats.users,
    hasAnyData: !!(stats.apps || stats.categories || stats.users)
  }
} 