'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { api } from '@/lib/api'
import { useCategories } from '@/hooks/useCategories'
import CategoriesWithApps from '@/components/CategoriesWithApps'
import { FaDownload, FaFire, FaStar, FaShieldAlt, FaRocket, FaCheckCircle, FaLock, FaBolt, FaGem, FaCrown, FaSkull, FaSpinner, FaEye, FaArrowRight } from 'react-icons/fa'

export default function Home() {
  const [featuredApps, setFeaturedApps] = useState([])
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    Promise.all([
      fetchFeaturedApps(),
      fetchStats()
    ]).finally(() => setLoading(false))
  }, [])

  const fetchFeaturedApps = async () => {
    try {
      const response = await api.getFeaturedApps(8)
      setFeaturedApps(response.apps || [])
    } catch (error) {
      console.error('Error fetching featured apps:', error)
    }
  }

  const fetchStats = async () => {
    try {
      const response = await api.getAppsStats()
      setStats(response.stats || {})
    } catch (error) {
      console.error('Error fetching stats:', error)
    }
  }

  const handleCategoryClick = (category) => {
    router.push(`/category/${category.slug}`)
  }

  const handleAppClick = (app) => {
    router.push(`/app/${app.slug || app._id}`)
  }

  // Removed static content - focusing on dynamic real data

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-black to-gray-800">
        <div className="text-center space-y-4">
          <FaSkull className="text-5xl text-red-500 animate-pulse mx-auto" />
          <FaSpinner className="text-xl text-red-400 animate-spin mx-auto" />
          <p className="text-gray-400">Loading the Underground...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      {/* SEO Optimized Hero Section */}
      <section className="relative py-20 px-4 min-h-[80vh] flex items-center">
        {/* Simplified Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-black to-gray-800"></div>
        
        <div className="container mx-auto text-center relative z-10">
          <header className="space-y-6">
            {/* Logo */}
            <div className="flex justify-center mb-6">
              <div className="relative">
                <FaSkull className="text-6xl text-red-500" />
                <div className="absolute -top-2 -right-2 w-4 h-4 bg-red-500 rounded-full animate-pulse"></div>
              </div>
            </div>

            {/* SEO Optimized Headings */}
            <div className="space-y-3">
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-black leading-tight">
                <span className="bg-gradient-to-r from-red-400 to-red-600 bg-clip-text text-transparent">
                  UNDERGROUND
                </span>
              </h1>
              <h2 className="text-xl md:text-3xl font-bold text-gray-400">
                <span className="text-red-400">BLACK MARKET</span> HUB
              </h2>
            </div>

            {/* SEO Optimized Description */}
            <p className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Access premium applications without limits. 
              Join thousands of users in the digital underground network for software downloads.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-6">
              <Link href="/apps">
                <button className="px-8 py-4 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-semibold rounded-lg shadow-lg transition-all duration-300 flex items-center space-x-2 hover:scale-105" aria-label="Explore premium applications">
                  <FaRocket className="text-lg" />
                  <span>Explore Apps</span>
                </button>
              </Link>
              
              <Link href="/safety-guide">
                <button className="px-8 py-4 bg-transparent border-2 border-red-500 text-red-400 hover:bg-red-500 hover:text-white font-semibold rounded-lg transition-all duration-300 flex items-center space-x-2" aria-label="View safety guide">
                  <FaShieldAlt className="text-lg" />
                  <span>Safety Guide</span>
                </button>
              </Link>
            </div>

            {/* Trust Indicators */}
            <div className="flex flex-wrap justify-center gap-6 pt-8 opacity-60">
              <div className="flex items-center space-x-2 text-green-400 text-sm">
                <FaCheckCircle />
                <span>Virus-Free</span>
              </div>
              <div className="flex items-center space-x-2 text-blue-400 text-sm">
                <FaLock />
                <span>Anonymous</span>
              </div>
              <div className="flex items-center space-x-2 text-gray-400 text-sm">
                <FaBolt />
                <span>Fast Downloads</span>
              </div>
            </div>
          </header>
        </div>
      </section>

      {/* Quick Stats - Real Data Only */}
      {stats && (
        <section className="py-8 px-4">
          <div className="container mx-auto">
            <div className="flex justify-center items-center space-x-8 text-center">
              {stats.totalApps > 0 && (
                <div className="text-center">
                  <div className="text-2xl font-bold text-red-400">{stats.totalApps}</div>
                  <div className="text-gray-400 text-sm">Apps</div>
                </div>
              )}
              {stats.totalDownloads > 0 && (
                <div className="text-center">
                  <div className="text-2xl font-bold text-red-400">
                    {stats.totalDownloads > 1000000 ? `${(stats.totalDownloads/1000000).toFixed(1)}M` : 
                     stats.totalDownloads > 1000 ? `${(stats.totalDownloads/1000).toFixed(1)}K` : stats.totalDownloads}
                  </div>
                  <div className="text-gray-400 text-sm">Downloads</div>
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Enhanced Featured Apps Section */}
      <section className="py-20 px-4 relative bg-gradient-to-br from-gray-900/50 via-black/20 to-gray-800/50" aria-labelledby="featured-apps-heading">
        <div className="container mx-auto">
          <header className="text-center mb-16">
            <div className="inline-flex items-center justify-center p-3 bg-gradient-to-r from-red-600/20 to-orange-600/20 rounded-2xl mb-6 backdrop-blur-sm border border-red-500/20">
              <FaFire className="text-2xl text-red-400" />
            </div>
            <h2 id="featured-apps-heading" className="text-4xl md:text-5xl font-bold mb-4">
              <span className="bg-gradient-to-r from-red-400 to-orange-500 bg-clip-text text-transparent">
                Hot Applications
              </span>
            </h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto mb-8">
              Latest and most downloaded applications from our community
            </p>
            <Link href="/apps">
              <button className="px-8 py-4 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-semibold rounded-xl shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-red-500/25 flex items-center space-x-2 mx-auto">
                <span>Explore All Apps</span>
                <FaArrowRight className="group-hover:translate-x-1 transition-transform duration-300" />
              </button>
            </Link>
          </header>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 max-w-7xl mx-auto">
            {featuredApps.slice(0, 8).map((app, index) => (
              <article 
                key={app._id} 
                className="group relative cursor-pointer"
                onClick={() => handleAppClick(app)}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-gray-800/70 to-gray-900/70 rounded-2xl backdrop-blur-sm border border-gray-700/40 hover:border-red-500/50 transition-all duration-300"></div>
                
                <div className="relative p-6">
                  {/* Badges */}
                  {app.isHot && (
                    <div className="absolute -top-2 -right-2 bg-gradient-to-r from-red-500 to-orange-500 text-white text-xs px-2 py-1 rounded-full font-bold flex items-center shadow-lg z-10">
                      <FaFire className="mr-1 text-xs" />
                      HOT
                    </div>
                  )}
                  {app.isPremium && (
                    <div className="absolute -top-2 -left-2 bg-gradient-to-r from-yellow-400 to-amber-500 text-black text-xs px-2 py-1 rounded-full font-bold flex items-center shadow-lg z-10">
                      <FaCrown className="mr-1 text-xs" />
                      PRO
                    </div>
                  )}
                  
                  {/* App Icon */}
                  <div className="text-center mb-4">
                    <div className="relative mb-3">
                      <div className="w-16 h-16 mx-auto rounded-xl overflow-hidden shadow-lg border border-gray-600/40">
                        {app.images && app.images[0] ? (
                          <img 
                            src={app.images[0]} 
                            alt={`${app.name} application icon`}
                            className="w-full h-full object-cover"
                            loading="lazy"
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-gray-700 to-gray-800 flex items-center justify-center text-2xl">
                            📱
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <h3 className="text-lg font-semibold text-white mb-1">
                      {app.name}
                    </h3>
                    <p className="text-gray-400 text-sm mb-3">
                      {app.category?.name || 'Application'}
                    </p>
                  </div>
                  
                  {/* Stats */}
                  <div className="flex justify-between items-center mb-4 text-sm">
                    <div className="flex items-center space-x-1">
                      <div className="flex text-yellow-400" role="img" aria-label={`${app.rating || '4.5'} stars rating`}>
                        {[...Array(5)].map((_, i) => (
                          <FaStar 
                            key={i} 
                            className={`${i < Math.floor(app.rating || 4.5) ? 'text-yellow-400' : 'text-gray-600'} text-xs`} 
                          />
                        ))}
                      </div>
                      <span className="text-gray-300 ml-1 text-xs">{app.rating || '4.5'}</span>
                    </div>
                    <div className="flex items-center text-gray-400 space-x-1">
                      <FaDownload className="text-xs" />
                      <span className="text-xs">{app.downloads || '0'}</span>
                    </div>
                  </div>
                  
                  {/* Action */}
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400 text-xs px-2 py-1 bg-gray-700/40 rounded-lg">
                      {app.size || 'N/A'}
                    </span>
                    <button 
                      className="px-4 py-2 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white text-sm font-medium rounded-lg shadow-lg transition-all duration-300 flex items-center space-x-1"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleAppClick(app)
                      }}
                      aria-label={`View ${app.name} details`}
                    >
                      <FaEye className="text-xs" />
                      <span>View</span>
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>

          {featuredApps.length === 0 && (
            <div className="text-center py-12">
              <FaRocket className="text-4xl text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400">Loading featured applications...</p>
            </div>
          )}
        </div>
      </section>



      {/* Enhanced Categories Section with Apps */}
      <CategoriesWithApps
        maxCategories={6}
        maxAppsPerCategory={6}
        onAppClick={handleAppClick}
        onCategoryClick={handleCategoryClick}
        showViewAll={true}
      />

      {/* Simple Footer CTA */}
      <section className="py-12 px-4 text-center">
        <div className="container mx-auto">
          <p className="text-gray-400 mb-4">
            Discover more applications and explore categories
          </p>
          <div className="flex flex-col sm:flex-row justify-center items-center space-y-3 sm:space-y-0 sm:space-x-4">
            <Link href="/apps">
              <button className="px-6 py-3 bg-gradient-to-r from-gray-700 to-gray-800 hover:from-gray-600 hover:to-gray-700 text-white font-medium rounded-lg transition-all duration-300">
                Browse All Apps
              </button>
            </Link>
            <Link href="/categories">
              <button className="px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-medium rounded-lg transition-all duration-300">
                View Categories
              </button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
