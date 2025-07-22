'use client'

import { memo } from 'react'
import { useCategories } from '@/hooks/useCategories'
import CategorySection from './CategorySection'
import { FaSpinner, FaExclamationTriangle } from 'react-icons/fa'

/**
 * CategoriesWithApps component - Displays multiple categories with their applications
 * Follows Single Responsibility Principle - only handles multiple categories display
 * Follows Dependency Inversion - depends on useCategories abstraction
 */
const CategoriesWithApps = memo(({ 
  maxCategories = 6,
  maxAppsPerCategory = 6,
  onAppClick,
  onCategoryClick,
  showViewAll = true,
  excludeCategories = [],
  className = '',
  ...props
}) => {
  const { 
    categories, 
    loading, 
    error, 
    getTopCategories 
  } = useCategories()

  // Handle app click
  const handleAppClick = (app) => {
    if (onAppClick) {
      onAppClick(app)
    } else {
      // Default navigation to app page
      window.location.href = `/app/${app.slug || app._id}`
    }
  }

  // Handle category click
  const handleCategoryClick = (category) => {
    if (onCategoryClick) {
      onCategoryClick(category)
    } else {
      // Default navigation to category page
      window.location.href = `/category/${category.slug}`
    }
  }

  // Filter and limit categories
  const getFilteredCategories = () => {
    let filtered = getTopCategories()
    
    // Exclude specified categories
    if (excludeCategories.length > 0) {
      filtered = filtered.filter(category => 
        !excludeCategories.includes(category.slug) && 
        !excludeCategories.includes(category._id)
      )
    }

    // Only show categories with apps
    filtered = filtered.filter(category => 
      (category.appsCount || 0) > 0
    )

    return filtered.slice(0, maxCategories)
  }

  // Loading state
  if (loading) {
    return (
      <section className={`py-16 px-4 ${className}`} {...props}>
        <div className="container mx-auto">
          <div className="text-center">
            <FaSpinner className="text-4xl text-red-500 animate-spin mx-auto mb-4" />
            <p className="text-gray-400">Loading categories...</p>
          </div>
        </div>
      </section>
    )
  }

  // Error state
  if (error) {
    return (
      <section className={`py-16 px-4 ${className}`} {...props}>
        <div className="container mx-auto">
          <div className="text-center">
            <FaExclamationTriangle className="text-4xl text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-white mb-2">Failed to Load Categories</h2>
            <p className="text-gray-400 mb-6">{error}</p>
            <button 
              onClick={() => window.location.reload()}
              className="px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-medium rounded-lg transition-all duration-300"
            >
              Try Again
            </button>
          </div>
        </div>
      </section>
    )
  }

  const filteredCategories = getFilteredCategories()

  // No categories state
  if (filteredCategories.length === 0) {
    return (
      <section className={`py-16 px-4 ${className}`} {...props}>
        <div className="container mx-auto">
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-gray-700 to-gray-800 rounded-xl flex items-center justify-center text-2xl">
              📱
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">No Categories Available</h2>
            <p className="text-gray-400">Categories will appear here once they're added.</p>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className={`py-8 ${className}`} {...props}>
      <div className="space-y-12">
        {/* Section Header */}
        <div className="text-center px-4">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            <span className="bg-gradient-to-r from-red-400 to-orange-500 bg-clip-text text-transparent">
              Featured Categories
            </span>
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto mb-8">
            Discover the best applications organized by categories. Each category features our most popular and highest-rated software.
          </p>
        </div>

        {/* Categories with Apps */}
        <div className="space-y-16">
          {filteredCategories.map((category, index) => (
            <CategorySection
              key={category._id || category.slug}
              category={category}
              onAppClick={handleAppClick}
              maxApps={maxAppsPerCategory}
              showViewAll={showViewAll}
              className={`
                ${index % 2 === 0 
                  ? 'bg-gradient-to-r from-gray-900/20 via-transparent to-transparent' 
                  : 'bg-gradient-to-l from-gray-900/20 via-transparent to-transparent'
                }
              `}
            />
          ))}
        </div>

        {/* View All Categories Button */}
        {showViewAll && categories.length > maxCategories && (
          <div className="text-center px-4">
            <button 
              onClick={() => window.location.href = '/categories'}
              className="px-8 py-4 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-semibold rounded-lg shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-red-500/25"
            >
              <span>Explore All Categories</span>
              <span className="ml-2">({categories.length})</span>
            </button>
          </div>
        )}
      </div>
    </section>
  )
})

CategoriesWithApps.displayName = 'CategoriesWithApps'

export default CategoriesWithApps 