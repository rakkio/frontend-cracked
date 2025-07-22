'use client'

import { memo, useState, useEffect } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation, Pagination } from 'swiper/modules'
import { FaChevronLeft, FaChevronRight, FaDownload, FaStar, FaArrowRight, FaFire, FaEye } from 'react-icons/fa'
import Link from 'next/link'
import { api } from '@/lib/api'

// Import Swiper styles
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'

/**
 * CategorySection component - Shows a category with its applications
 * Follows Single Responsibility Principle - only handles one category display
 */
const CategorySection = memo(({ 
  category, 
  onAppClick,
  maxApps = 8,
  showViewAll = true,
  variant = 'default',
  className = ''
}) => {
  const [apps, setApps] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Fetch apps for this category
  useEffect(() => {
    const fetchCategoryApps = async () => {
      if (!category?.slug) return

      try {
        setLoading(true)
        setError(null)
        const response = await api.getAppsByCategory(category.slug, {
          limit: maxApps,
          sort: 'popularity'
        })
        
        // Handle both possible response structures
        const appsData = response.data?.apps || response.apps || []
        setApps(appsData)
      } catch (err) {
        console.error(`Error fetching apps for category ${category.slug}:`, err)
        setError(err.message)
        setApps([])
      } finally {
        setLoading(false)
      }
    }

    fetchCategoryApps()
  }, [category?.slug, maxApps])

  // Handle app click
  const handleAppClick = (app) => {
    if (onAppClick) {
      onAppClick(app)
    } else {
      // Default behavior - navigate to app page
      window.location.href = `/app/${app.slug || app._id}`
    }
  }

  // Get category icon
  const getCategoryIcon = () => {
    if (category.icon) return category.icon
    const name = category.name?.toLowerCase() || ''
    if (name.includes('productivity')) return '📊'
    if (name.includes('communication')) return '💬'
    if (name.includes('creativity') || name.includes('design')) return '🎨'
    if (name.includes('entertainment')) return '🎮'
    if (name.includes('utilities') || name.includes('tools')) return '🔧'
    if (name.includes('security')) return '🔒'
    return '📱'
  }

  // Get category color
  const getCategoryColor = () => {
    return category.color || '#8b5cf6'
  }

  // Don't render if no apps and not loading
  if (!loading && (!apps || apps.length === 0)) {
    return null
  }

  return (
    <section className={`py-8 px-4 ${className}`}>
      <div className="container mx-auto">
        {/* Category Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            {/* Category Icon */}
            <div 
              className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl shadow-lg"
              style={{ 
                background: `linear-gradient(135deg, ${getCategoryColor()}20, ${getCategoryColor()}40)`,
                border: `1px solid ${getCategoryColor()}30`
              }}
            >
              <span style={{ color: getCategoryColor() }}>
                {getCategoryIcon()}
              </span>
            </div>
            
            {/* Category Title & Count */}
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-1">
                {category.name}
              </h2>
              <p className="text-gray-400 text-sm">
                {category.appsCount || apps.length} applications available
              </p>
              {category.description && (
                <p className="text-gray-500 text-xs mt-1 max-w-md">
                  {category.description.length > 100 
                    ? `${category.description.substring(0, 100)}...` 
                    : category.description
                  }
                </p>
              )}
            </div>
          </div>

          {/* View All Button */}
          {showViewAll && (
            <Link href={`/category/${category.slug}`}>
              <button className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-red-600/20 to-red-700/20 hover:from-red-600/40 hover:to-red-700/40 text-red-400 hover:text-white border border-red-500/30 hover:border-red-400 rounded-lg transition-all duration-300 group">
                <span>View All</span>
                <FaArrowRight className="group-hover:translate-x-1 transition-transform duration-300" />
              </button>
            </Link>
          )}
        </div>

        {/* Apps Grid/Swiper */}
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
            {Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="animate-pulse">
                <div className="bg-gray-800/60 rounded-xl p-4 border border-gray-700/40">
                  <div className="w-12 h-12 bg-gray-700 rounded-lg mb-3 mx-auto"></div>
                  <div className="h-4 bg-gray-700 rounded mb-2"></div>
                  <div className="h-3 bg-gray-700 rounded w-3/4 mx-auto"></div>
                </div>
              </div>
            ))}
          </div>
        ) : apps.length > 6 ? (
          // Use Swiper for many apps
          <div className="relative">
            <Swiper
              modules={[Navigation]}
              spaceBetween={16}
              slidesPerView={2}
              navigation={{
                prevEl: `.category-${category.slug}-prev`,
                nextEl: `.category-${category.slug}-next`,
              }}
              breakpoints={{
                480: { slidesPerView: 3 },
                768: { slidesPerView: 4 },
                1024: { slidesPerView: 5 },
                1280: { slidesPerView: 6 },
              }}
              className="category-apps-swiper"
            >
              {apps.map((app) => (
                <SwiperSlide key={app._id || app.id}>
                  <AppCard 
                    app={app} 
                    onClick={handleAppClick}
                    categoryColor={getCategoryColor()}
                  />
                </SwiperSlide>
              ))}
            </Swiper>

            {/* Navigation Buttons */}
            <button 
              className={`category-${category.slug}-prev absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 w-10 h-10 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white rounded-full flex items-center justify-center shadow-lg transition-all duration-300 hover:scale-110 hidden md:flex`}
            >
              <FaChevronLeft className="text-sm" />
            </button>
            <button 
              className={`category-${category.slug}-next absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 w-10 h-10 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white rounded-full flex items-center justify-center shadow-lg transition-all duration-300 hover:scale-110 hidden md:flex`}
            >
              <FaChevronRight className="text-sm" />
            </button>
          </div>
        ) : (
          // Use Grid for few apps
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
            {apps.map((app) => (
              <AppCard 
                key={app._id || app.id}
                app={app} 
                onClick={handleAppClick}
                categoryColor={getCategoryColor()}
              />
            ))}
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="text-center py-8">
            <div className="text-red-400 mb-2">⚠️</div>
            <p className="text-gray-400">Failed to load applications</p>
          </div>
        )}
      </div>
    </section>
  )
})

/**
 * AppCard component - Shows individual app information
 * Follows Single Responsibility Principle
 */
const AppCard = memo(({ app, onClick, categoryColor }) => {
  const handleClick = () => {
    if (onClick) {
      onClick(app)
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      handleClick()
    }
  }

  return (
    <article
      className="group cursor-pointer transform transition-all duration-300 hover:scale-105"
      onClick={handleClick}
      onKeyPress={handleKeyPress}
      tabIndex={0}
      role="button"
      aria-label={`Download ${app.name}`}
    >
      <div className="bg-gradient-to-br from-gray-800/60 to-gray-900/60 rounded-xl p-4 border border-gray-700/40 hover:border-red-500/40 transition-all duration-300 backdrop-blur-sm group-hover:shadow-lg group-hover:shadow-red-500/10 h-full">
        {/* App Icon */}
        <div className="relative mb-3">
          {app.images && app.images.length > 0 ? (
            <div className="w-12 h-12 mx-auto rounded-lg overflow-hidden bg-gray-700/40 flex items-center justify-center">
              <img 
                src={app.images[0]} 
                alt={`${app.name} icon`}
                className="w-full h-full object-cover"
                loading="lazy"
                onError={(e) => {
                  e.target.style.display = 'none'
                  e.target.nextSibling.style.display = 'flex'
                }}
              />
              <div className="w-full h-full bg-gray-700 rounded-lg items-center justify-center text-gray-400 text-xl hidden">
                📱
              </div>
            </div>
          ) : (
            <div className="w-12 h-12 mx-auto rounded-lg bg-gray-700/40 flex items-center justify-center text-gray-400 text-xl">
              📱
            </div>
          )}

          {/* Hot/Featured Badge */}
          {(app.isHot || app.isFeatured || app.isNewApp || app.isPopular || app.isTopRated) && (
            <div className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center">
              {app.isHot && <FaFire className="text-white text-xs" />}
              {app.isNewApp && !app.isHot && <span className="text-white text-xs font-bold">N</span>}
              {app.isTopRated && !app.isHot && !app.isNewApp && <FaStar className="text-white text-xs" />}
              {(app.isFeatured || app.isPopular) && !app.isHot && !app.isNewApp && !app.isTopRated && <FaFire className="text-white text-xs" />}
            </div>
          )}
        </div>

        {/* App Name */}
        <h3 className="font-medium text-white text-sm mb-1 text-center line-clamp-1 group-hover:text-red-300 transition-colors duration-300">
          {app.name}
        </h3>

        {/* App Developer */}
        {app.developer && (
          <div className="text-center mb-1">
            <span className="text-xs text-gray-400">
              by {app.developer}
            </span>
          </div>
        )}

        {/* App Stats */}
        <div className="flex items-center justify-center space-x-3 text-xs text-gray-400 mb-2">
          {app.rating > 0 && (
            <div className="flex items-center space-x-1">
              <FaStar className="text-yellow-400" />
              <span>{app.rating.toFixed(1)}</span>
            </div>
          )}
          {(app.downloadCount || app.downloads) && (
            <div className="flex items-center space-x-1">
              <FaDownload />
              <span>
                {(() => {
                  const count = app.downloadCount || app.downloads || 0
                  return count > 1000 ? `${(count/1000).toFixed(1)}k` : count
                })()}
              </span>
            </div>
          )}
          {app.viewCount && (
            <div className="flex items-center space-x-1">
              <FaEye className="text-blue-400" />
              <span>
                {app.viewCount > 1000 ? `${(app.viewCount/1000).toFixed(1)}k` : app.viewCount}
              </span>
            </div>
          )}
        </div>

        {/* App Info Row */}
        <div className="flex items-center justify-center space-x-2 mb-2">
          {app.size && (
            <span className="text-xs text-gray-500 px-2 py-1 bg-gray-800/40 rounded">
              {app.size}
            </span>
          )}
          {app.version && (
            <span className="text-xs text-blue-400 px-2 py-1 bg-blue-900/20 rounded">
              v{app.version}
            </span>
          )}
        </div>

        {/* Premium Badge */}
        {app.isPremium && (
          <div className="text-center mb-2">
            <span className="text-xs text-yellow-400 px-2 py-1 bg-yellow-900/20 rounded border border-yellow-600/30">
              Premium
            </span>
          </div>
        )}

        {/* Hover Effect */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none rounded-xl">
          <div 
            className="absolute inset-0 rounded-xl"
            style={{ 
              background: `linear-gradient(135deg, ${categoryColor}10, transparent)`,
              border: `1px solid ${categoryColor}20`
            }}
          ></div>
        </div>
      </div>
    </article>
  )
})

CategorySection.displayName = 'CategorySection'
AppCard.displayName = 'AppCard'

export default CategorySection 