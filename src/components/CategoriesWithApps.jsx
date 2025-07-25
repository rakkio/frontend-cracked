'use client'

import { memo } from 'react'
import { useCategories } from '@/hooks/useCategories'
import CategorySection from './CategorySection'
import { FaSpinner, FaExclamationTriangle, FaSkull, FaTerminal } from 'react-icons/fa'
import { FiCode, FiDatabase, FiCpu } from 'react-icons/fi'

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
      <section className={`py-20 bg-gray-900 relative overflow-hidden ${className}`} {...props}>
        {/* Matrix Background */}
        <div className="absolute inset-0 opacity-5">
          <div className="matrix-bg"></div>
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center">
            {/* Terminal Loading Header */}
            <div className="mb-8">
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 terminal-text">
                <span className="text-red-500">[</span>SCANNING CATEGORIES<span className="text-red-500">]</span>
              </h2>
              <div className="flex justify-center items-center space-x-4">
                <FaTerminal className="text-red-500 text-2xl" />
                <div className="text-green-400 font-mono text-lg">
                  INITIALIZING_DATABASE_CONNECTION...
                  <span className="animate-pulse text-red-500 ml-2">█</span>
                </div>
              </div>
            </div>
            
            {/* Loading Animation */}
            <div className="metro-tile mx-auto max-w-md mb-8">
              <div className="relative p-8">
                <div className="absolute inset-0 bg-gradient-to-br from-red-600/20 to-black opacity-90"></div>
                <div className="absolute inset-0 scan-lines opacity-30"></div>
                
                <div className="relative z-10">
                  <FaSkull className="text-6xl text-red-500 mx-auto mb-4 animate-pulse" />
                  <div className="flex items-center justify-center space-x-2 mb-4">
                    <FaSpinner className="text-2xl text-red-500 animate-spin" />
                    <span className="text-white font-mono">LOADING</span>
                  </div>
                  
                  {/* Progress Bar */}
                  <div className="w-full bg-gray-800 rounded-full h-2 mb-4">
                    <div className="bg-gradient-to-r from-red-500 to-red-600 h-2 rounded-full animate-loading-bar"></div>
                  </div>
                  
                  <p className="text-gray-300 font-mono text-sm">
                    FETCHING_CATEGORY_DATA | STATUS: PROCESSING
                  </p>
                </div>
                
                {/* Corner Brackets */}
                <div className="absolute top-3 left-3 w-6 h-6 border-l-2 border-t-2 border-red-400 opacity-60"></div>
                <div className="absolute top-3 right-3 w-6 h-6 border-r-2 border-t-2 border-red-400 opacity-60"></div>
                <div className="absolute bottom-3 left-3 w-6 h-6 border-l-2 border-b-2 border-red-400 opacity-60"></div>
                <div className="absolute bottom-3 right-3 w-6 h-6 border-r-2 border-b-2 border-red-400 opacity-60"></div>
              </div>
            </div>
          </div>
        </div>
      </section>
    )
  }

  // Error state
  if (error) {
    return (
      <section className={`py-20 bg-gray-900 relative overflow-hidden ${className}`} {...props}>
        {/* Matrix Background */}
        <div className="absolute inset-0 opacity-5">
          <div className="matrix-bg"></div>
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center">
            <div className="metro-tile mx-auto max-w-lg mb-8">
              <div className="relative p-8">
                <div className="absolute inset-0 bg-gradient-to-br from-red-600/30 to-black opacity-90"></div>
                <div className="absolute inset-0 scan-lines opacity-30"></div>
                
                <div className="relative z-10">
                  <FaExclamationTriangle className="text-6xl text-red-500 mx-auto mb-4 animate-pulse" />
                  <h2 className="text-3xl font-bold text-white mb-4 terminal-text">
                    <span className="text-red-500">[</span>ERROR<span className="text-red-500">]</span>
                  </h2>
                  <h3 className="text-xl font-bold text-red-400 mb-4">DATABASE CONNECTION FAILED</h3>
                  <p className="text-gray-300 mb-6 font-mono text-sm">
                    ERROR_CODE: {error} | RETRY_AVAILABLE: TRUE
                  </p>
                  <button 
                    onClick={() => window.location.reload()}
                    className="metro-button bg-gradient-to-r from-red-600 to-red-800 hover:from-red-500 hover:to-red-700 text-white px-8 py-3 font-bold transition-all duration-300 transform hover:scale-105"
                  >
                    <div className="flex items-center space-x-2">
                      <FaTerminal className="w-5 h-5" />
                      <span>RETRY CONNECTION</span>
                    </div>
                  </button>
                </div>
                
                {/* Corner Brackets */}
                <div className="absolute top-3 left-3 w-6 h-6 border-l-2 border-t-2 border-red-400 opacity-60"></div>
                <div className="absolute top-3 right-3 w-6 h-6 border-r-2 border-t-2 border-red-400 opacity-60"></div>
                <div className="absolute bottom-3 left-3 w-6 h-6 border-l-2 border-b-2 border-red-400 opacity-60"></div>
                <div className="absolute bottom-3 right-3 w-6 h-6 border-r-2 border-b-2 border-red-400 opacity-60"></div>
              </div>
            </div>
          </div>
        </div>
      </section>
    )
  }

  const filteredCategories = getFilteredCategories()

  // No categories state
  if (filteredCategories.length === 0) {
    return (
      <section className={`py-20 bg-gray-900 relative overflow-hidden ${className}`} {...props}>
        {/* Matrix Background */}
        <div className="absolute inset-0 opacity-5">
          <div className="matrix-bg"></div>
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center">
            <div className="metro-tile mx-auto max-w-lg mb-8">
              <div className="relative p-8">
                <div className="absolute inset-0 bg-gradient-to-br from-gray-700/20 to-black opacity-90"></div>
                <div className="absolute inset-0 scan-lines opacity-20"></div>
                
                <div className="relative z-10">
                  <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-gray-700 to-gray-800 rounded-xl flex items-center justify-center text-4xl border border-red-500/30">
                    <FiDatabase className="text-red-400" />
                  </div>
                  <h2 className="text-3xl font-bold text-white mb-4 terminal-text">
                    <span className="text-red-500">[</span>NO DATA<span className="text-red-500">]</span>
                  </h2>
                  <p className="text-gray-300 font-mono text-sm">
                    CATEGORIES_FOUND: 0 | STATUS: EMPTY_DATABASE
                  </p>
                </div>
                
                {/* Corner Brackets */}
                <div className="absolute top-3 left-3 w-6 h-6 border-l-2 border-t-2 border-red-400 opacity-60"></div>
                <div className="absolute top-3 right-3 w-6 h-6 border-r-2 border-t-2 border-red-400 opacity-60"></div>
                <div className="absolute bottom-3 left-3 w-6 h-6 border-l-2 border-b-2 border-red-400 opacity-60"></div>
                <div className="absolute bottom-3 right-3 w-6 h-6 border-r-2 border-b-2 border-red-400 opacity-60"></div>
              </div>
            </div>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className={`py-20 bg-gray-900 relative overflow-hidden ${className}`} {...props}>
      {/* Matrix Background */}
      <div className="absolute inset-0 opacity-5">
        <div className="matrix-bg"></div>
      </div>
      
      {/* Floating Code Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 text-red-500/20 font-mono text-sm animate-float" style={{animationDelay: '0s'}}>{'<categories>'}</div>
        <div className="absolute top-40 right-20 text-red-500/20 font-mono text-sm animate-float" style={{animationDelay: '2s'}}>{'function()'}</div>
        <div className="absolute bottom-40 left-20 text-red-500/20 font-mono text-sm animate-float" style={{animationDelay: '4s'}}>{'[data]'}</div>
        <div className="absolute bottom-20 right-10 text-red-500/20 font-mono text-sm animate-float" style={{animationDelay: '6s'}}>{'</apps>'}</div>
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="space-y-16">
          {/* Section Header */}
          <div className="text-center">
            <h2 className="text-4xl md:text-6xl font-bold text-white mb-6 terminal-text">
              <span className="text-red-500">[</span>FEATURED<span className="text-red-500">]</span>
              <br />
              <span className="text-red-500">CATEGORIES</span>
            </h2>
            <p className="text-gray-300 text-xl max-w-3xl mx-auto mb-8">
              Explore our curated collection of premium cracked software organized by category. Each section contains the most popular and highest-rated applications.
            </p>
            
            {/* Status Indicators */}
            <div className="flex justify-center space-x-8 mb-8">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse mr-2"></div>
                <span className="text-green-400 font-mono text-sm">✅ Categories Active</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-blue-400 rounded-full animate-pulse mr-2"></div>
                <span className="text-blue-400 font-mono text-sm">🔍 Apps Indexed</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-yellow-400 rounded-full animate-pulse mr-2"></div>
                <span className="text-yellow-400 font-mono text-sm">⚡ Real-time Updates</span>
              </div>
            </div>
          </div>

          {/* Categories with Apps */}
          <div className="space-y-20">
            {filteredCategories.map((category, index) => (
              <div
                key={category._id || category.slug}
                className="relative"
                style={{ animationDelay: `${index * 0.2}s` }}
              >
                {/* Category Header with Metro Design */}
                <div className="metro-tile mb-8 group hover:scale-105 transition-all duration-500">
                  <div className="absolute inset-0 bg-gradient-to-br from-red-600/20 to-black opacity-90 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="absolute inset-0 scan-lines opacity-20"></div>
                  
                  <div className="relative z-10 p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-red-700 rounded-lg flex items-center justify-center">
                          <FiCode className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h3 className="text-2xl font-bold text-white terminal-text">
                            <span className="text-red-500">[</span>{category.name}<span className="text-red-500">]</span>
                          </h3>
                          <p className="text-gray-300 font-mono text-sm">
                            APPS_COUNT: {category.appsCount || 0} | STATUS: ACTIVE
                          </p>
                        </div>
                      </div>
                      
                      <button
                        onClick={() => handleCategoryClick(category)}
                        className="metro-button bg-black border border-red-500 text-red-500 hover:bg-red-500 hover:text-white px-6 py-2 font-bold transition-all duration-300"
                      >
                        VIEW ALL
                      </button>
                    </div>
                  </div>
                  
                  {/* Corner Brackets */}
                  <div className="absolute top-3 left-3 w-6 h-6 border-l-2 border-t-2 border-red-400 opacity-60 group-hover:opacity-100 transition-opacity"></div>
                  <div className="absolute top-3 right-3 w-6 h-6 border-r-2 border-t-2 border-red-400 opacity-60 group-hover:opacity-100 transition-opacity"></div>
                  <div className="absolute bottom-3 left-3 w-6 h-6 border-l-2 border-b-2 border-red-400 opacity-60 group-hover:opacity-100 transition-opacity"></div>
                  <div className="absolute bottom-3 right-3 w-6 h-6 border-r-2 border-b-2 border-red-400 opacity-60 group-hover:opacity-100 transition-opacity"></div>
                </div>
                
                {/* Category Section */}
                <CategorySection
                  category={category}
                  onAppClick={handleAppClick}
                  maxApps={maxAppsPerCategory}
                  showViewAll={showViewAll}
                  className="bg-gradient-to-r from-gray-900/10 via-transparent to-transparent"
                />
              </div>
            ))}
          </div>

          {/* View All Categories Button */}
          {showViewAll && categories.length > maxCategories && (
            <div className="text-center">
              <button 
                onClick={() => window.location.href = '/categories'}
                className="metro-button bg-gradient-to-r from-red-600 to-red-800 hover:from-red-500 hover:to-red-700 text-white px-12 py-4 text-xl font-bold transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-red-500/25"
              >
                <div className="flex items-center space-x-3">
                  <FiDatabase className="w-6 h-6" />
                  <span>EXPLORE ALL CATEGORIES</span>
                  <span className="bg-black px-2 py-1 rounded text-sm">({categories.length})</span>
                </div>
              </button>
            </div>
          )}
          
          {/* Terminal Status */}
          <div className="text-center">
            <div className="inline-block bg-black border border-red-500 rounded px-6 py-3">
              <span className="text-green-400 font-mono">
                CATEGORIES_LOADED: {filteredCategories.length} | TOTAL_APPS: {filteredCategories.reduce((acc, cat) => acc + (cat.appsCount || 0), 0)} | STATUS: READY
                <span className="animate-pulse text-red-500 ml-2">█</span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
})

CategoriesWithApps.displayName = 'CategoriesWithApps'

export default CategoriesWithApps