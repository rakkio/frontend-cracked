'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { api } from '@/lib/api'
import { useCategories } from '@/hooks/useCategories'
import CategoriesWithApps from '@/components/CategoriesWithApps'
import { FaDownload, FaFire, FaStar, FaShieldAlt, FaRocket, FaCheckCircle, FaLock, FaBolt, FaGem, FaCrown, FaSkull, FaSpinner, FaEye, FaArrowRight, FaUsers, FaMobile, FaTrophy, FaGift } from 'react-icons/fa'

// SEO Structured Data
const generateStructuredData = (stats, featuredApps) => {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": "https://appscracked.com/#website",
        "url": "https://appscracked.com/",
        "name": "AppsCracked",
        "description": "Download free cracked apps, premium software, and games. Safe, tested, and virus-free applications with direct download links.",
        "publisher": {
          "@id": "https://appscracked.com/#organization"
        },
        "potentialAction": [
          {
            "@type": "SearchAction",
            "target": {
              "@type": "EntryPoint",
              "urlTemplate": "https://appscracked.com/apps?search={search_term_string}"
            },
            "query-input": "required name=search_term_string"
          }
        ],
        "inLanguage": "en-US"
      },
      {
        "@type": "Organization",
        "@id": "https://appscracked.com/#organization",
        "name": "AppsCracked",
        "url": "https://appscracked.com/",
        "logo": {
          "@type": "ImageObject",
          "inLanguage": "en-US",
          "@id": "https://appscracked.com/#/schema/logo/image/",
          "url": "https://appscracked.com/logo.png",
          "contentUrl": "https://appscracked.com/logo.png",
          "width": 512,
          "height": 512,
          "caption": "AppsCracked"
        },
        "image": {
          "@id": "https://appscracked.com/#/schema/logo/image/"
        },
        "sameAs": [
          "https://twitter.com/appscracked",
          "https://facebook.com/appscracked"
        ]
      },
      {
        "@type": "WebPage",
        "@id": "https://appscracked.com/#webpage",
        "url": "https://appscracked.com/",
        "name": "AppsCracked - Download Free Cracked Apps & Premium Software 2024",
        "isPartOf": {
          "@id": "https://appscracked.com/#website"
        },
        "about": {
          "@id": "https://appscracked.com/#organization"
        },
        "description": "Download the latest cracked apps, premium software, and games for free. Safe, tested, and virus-free applications with direct download links. Over 10,000+ apps available.",
        "breadcrumb": {
          "@id": "https://appscracked.com/#breadcrumb"
        },
        "inLanguage": "en-US",
        "potentialAction": [
          {
            "@type": "ReadAction",
            "target": ["https://appscracked.com/"]
          }
        ]
      },
      {
        "@type": "BreadcrumbList",
        "@id": "https://appscracked.com/#breadcrumb",
        "itemListElement": [
          {
            "@type": "ListItem",
            "position": 1,
            "name": "Home",
            "item": "https://appscracked.com/"
          }
        ]
      },
      ...(featuredApps?.slice(0, 5).map((app, index) => ({
        "@type": "SoftwareApplication",
        "name": app.name,
        "description": app.description || `Download ${app.name} for free - Premium cracked version available`,
        "url": `https://appscracked.com/app/${app.slug}`,
        "downloadUrl": `https://appscracked.com/app/${app.slug}`,
        "operatingSystem": "Windows, MacOS, Android, iOS",
        "applicationCategory": "UtilitiesApplication",
        "aggregateRating": {
          "@type": "AggregateRating",
          "ratingValue": app.rating || 4.5,
          "reviewCount": app.reviewCount || 100,
          "bestRating": 5,
          "worstRating": 1
        },
        "offers": {
          "@type": "Offer",
          "price": "0.00",
          "priceCurrency": "USD",
          "availability": "https://schema.org/InStock"
        }
      })) || [])
    ]
  }
}

export default function Home() {
  const [featuredApps, setFeaturedApps] = useState([])
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [categories, setCategories] = useState([])
  const router = useRouter()

  useEffect(() => {
    Promise.all([
      fetchFeaturedApps(),
      fetchStats(),
      fetchTopCategories()
    ]).finally(() => setLoading(false))
  }, [])

  const fetchFeaturedApps = async () => {
    try {
      const response = await api.getFeaturedApps(12)
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

  const fetchTopCategories = async () => {
    try {
      const response = await api.getCategories()
      setCategories(response.categories?.slice(0, 8) || [])
    } catch (error) {
      console.error('Error fetching categories:', error)
    }
  }

  const handleCategoryClick = (category) => {
    router.push(`/category/${category.slug}`)
  }

  const handleAppClick = (app) => {
    router.push(`/app/${app.slug || app._id}`)
  }

  // Insert structured data
  useEffect(() => {
    if (!loading && (featuredApps.length > 0 || stats)) {
      const structuredData = generateStructuredData(stats, featuredApps)
      
      // Remove existing structured data
      const existingScript = document.querySelector('script[type="application/ld+json"]')
      if (existingScript) {
        existingScript.remove()
      }
      
      // Add new structured data
      const script = document.createElement('script')
      script.type = 'application/ld+json'
      script.textContent = JSON.stringify(structuredData)
      document.head.appendChild(script)
    }
  }, [loading, featuredApps, stats])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-black to-gray-800">
        <div className="text-center space-y-4">
          <FaSkull className="text-5xl text-red-500 animate-pulse mx-auto" />
          <FaSpinner className="text-xl text-red-400 animate-spin mx-auto" />
          <p className="text-gray-400">Loading Premium Apps...</p>
        </div>
      </div>
    )
  }

  return (
    <>
      {/* SEO Meta Tags */}
      <title>AppsCracked - Download Free Cracked Apps & Premium Software 2024</title>
      <meta name="description" content="Download the latest cracked apps, premium software, and games for free. Safe, tested, and virus-free applications with direct download links. Over 10,000+ apps available." />
      <meta name="keywords" content="cracked apps, free software download, premium apps free, cracked software, free apps download, crack apps, modded apps, premium software free, apps cracked, free crack software, download cracked apps, full version software free" />
      <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
      <meta name="author" content="AppsCracked" />
      <link rel="canonical" href="https://appscracked.com/" />
      
      {/* Open Graph */}
      <meta property="og:title" content="AppsCracked - Download Free Cracked Apps & Premium Software" />
      <meta property="og:description" content="Access thousands of premium applications for free. Download cracked apps, games, and software with direct links. Safe, tested, and virus-free." />
      <meta property="og:type" content="website" />
      <meta property="og:url" content="https://appscracked.com/" />
      <meta property="og:image" content="https://appscracked.com/og-image.jpg" />
      <meta property="og:site_name" content="AppsCracked" />
      
      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content="AppsCracked - Download Free Cracked Apps & Premium Software" />
      <meta name="twitter:description" content="Access thousands of premium applications for free. Download cracked apps, games, and software with direct links." />
      <meta name="twitter:image" content="https://appscracked.com/twitter-image.jpg" />

      <main className="min-h-screen">
        {/* Hero Section - Above the fold optimization */}
        <section className="relative py-16 px-4 min-h-[90vh] flex items-center" itemScope itemType="https://schema.org/WebSite">
          <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-black to-red-900/20"></div>
          <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-10"></div>
        
          <div className="container mx-auto text-center relative z-10 max-w-6xl">
            <header className="space-y-8">
              {/* Brand Logo */}
              <div className="flex justify-center mb-8">
                <div className="relative group">
                  <FaSkull className="text-7xl text-red-500 drop-shadow-2xl group-hover:scale-110 transition-transform duration-300" />
                  <div className="absolute -top-3 -right-3 w-6 h-6 bg-gradient-to-r from-red-400 to-red-600 rounded-full animate-pulse shadow-lg"></div>
                  <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 text-xs text-red-400 font-bold tracking-wider">CRACKED</div>
              </div>
            </div>

              {/* SEO Optimized Headlines */}
              <div className="space-y-4">
                <h1 className="text-5xl md:text-7xl lg:text-8xl font-black leading-tight tracking-tight" itemProp="name">
                  <span className="bg-gradient-to-r from-red-400 via-red-500 to-red-600 bg-clip-text text-transparent drop-shadow-lg">
                    FREE CRACKED APPS
                </span>
              </h1>
                <h2 className="text-2xl md:text-4xl lg:text-5xl font-bold text-white/90 leading-tight">
                  Download <span className="text-red-400">Premium Software</span> for Free
              </h2>
                <h3 className="text-lg md:text-2xl text-gray-300 font-medium">
                  10,000+ Apps • Zero Cost • Instant Download • Virus-Free
                </h3>
            </div>

              {/* SEO Rich Description */}
              <div className="max-w-4xl mx-auto space-y-4" itemProp="description">
                <p className="text-xl md:text-2xl text-gray-200 leading-relaxed font-light">
                  Access the world's largest collection of <strong className="text-red-400">cracked applications</strong>, 
                  <strong className="text-red-400"> premium software</strong>, and <strong className="text-red-400">modded games</strong> 
                  completely free. All downloads are tested, safe, and include full versions.
                </p>
                <p className="text-lg text-gray-300 leading-relaxed">
                  Join over <strong>2 million users</strong> who trust our platform for secure, fast downloads 
                  of premium applications without subscriptions or licenses.
            </p>
              </div>

              {/* Primary CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-6 justify-center items-center pt-8">
                <Link href="/apps" className="group">
                  <button className="px-10 py-5 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white text-lg font-bold rounded-xl shadow-2xl transition-all duration-300 flex items-center space-x-3 hover:scale-105 hover:shadow-red-500/25 transform" 
                          aria-label="Browse all free cracked apps">
                    <FaRocket className="text-xl group-hover:rotate-12 transition-transform duration-300" />
                    <span>Browse 10,000+ Apps</span>
                    <FaArrowRight className="group-hover:translate-x-1 transition-transform duration-300" />
                </button>
              </Link>
              
                <Link href="/categories" className="group">
                  <button className="px-10 py-5 bg-transparent border-2 border-red-500 text-red-400 hover:bg-red-500 hover:text-white text-lg font-bold rounded-xl transition-all duration-300 flex items-center space-x-3 hover:scale-105" 
                          aria-label="Explore software categories">
                    <FaGem className="text-xl" />
                    <span>Explore Categories</span>
                </button>
              </Link>
            </div>

              {/* Trust Signals & Features */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 pt-12 max-w-4xl mx-auto">
                <div className="flex flex-col items-center space-y-2 text-center p-4 rounded-lg bg-white/5 backdrop-blur-sm border border-white/10">
                  <FaShieldAlt className="text-3xl text-green-400" />
                  <span className="text-white font-semibold">100% Safe</span>
                  <span className="text-gray-400 text-sm">Virus Scanned</span>
                </div>
                <div className="flex flex-col items-center space-y-2 text-center p-4 rounded-lg bg-white/5 backdrop-blur-sm border border-white/10">
                  <FaBolt className="text-3xl text-yellow-400" />
                  <span className="text-white font-semibold">Instant Download</span>
                  <span className="text-gray-400 text-sm">No Waiting</span>
              </div>
                <div className="flex flex-col items-center space-y-2 text-center p-4 rounded-lg bg-white/5 backdrop-blur-sm border border-white/10">
                  <FaGift className="text-3xl text-blue-400" />
                  <span className="text-white font-semibold">Always Free</span>
                  <span className="text-gray-400 text-sm">No Hidden Costs</span>
              </div>
                <div className="flex flex-col items-center space-y-2 text-center p-4 rounded-lg bg-white/5 backdrop-blur-sm border border-white/10">
                  <FaUsers className="text-3xl text-purple-400" />
                  <span className="text-white font-semibold">2M+ Users</span>
                  <span className="text-gray-400 text-sm">Trusted Community</span>
              </div>
            </div>
          </header>
        </div>
      </section>

        {/* Real-time Stats Section */}
      {stats && (
          <section className="py-12 px-4 bg-gradient-to-r from-gray-900/50 to-black/50 border-y border-gray-700/50" itemScope itemType="https://schema.org/Organization">
          <div className="container mx-auto">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto text-center">
              {stats.totalApps > 0 && (
                  <div className="space-y-2">
                    <div className="text-4xl md:text-5xl font-black text-red-400" itemProp="numberOfEmployees">
                      {stats.totalApps.toLocaleString()}+
                    </div>
                    <div className="text-gray-300 font-medium">Apps Available</div>
                    <div className="text-gray-500 text-sm">Premium Software</div>
                </div>
              )}
              {stats.totalDownloads > 0 && (
                  <div className="space-y-2">
                    <div className="text-4xl md:text-5xl font-black text-red-400">
                    {stats.totalDownloads > 1000000 ? `${(stats.totalDownloads/1000000).toFixed(1)}M` : 
                     stats.totalDownloads > 1000 ? `${(stats.totalDownloads/1000).toFixed(1)}K` : stats.totalDownloads}
                    </div>
                    <div className="text-gray-300 font-medium">Downloads</div>
                    <div className="text-gray-500 text-sm">This Month</div>
                  </div>
                )}
                <div className="space-y-2">
                  <div className="text-4xl md:text-5xl font-black text-red-400">2.1M+</div>
                  <div className="text-gray-300 font-medium">Active Users</div>
                  <div className="text-gray-500 text-sm">Worldwide</div>
                </div>
                <div className="space-y-2">
                  <div className="text-4xl md:text-5xl font-black text-red-400">24/7</div>
                  <div className="text-gray-300 font-medium">Support</div>
                  <div className="text-gray-500 text-sm">Always Online</div>
                </div>
            </div>
          </div>
        </section>
      )}

        {/* Featured Apps Section - Optimized for SEO */}
        <section className="py-20 px-4 relative bg-gradient-to-br from-gray-900/50 via-black/20 to-gray-800/50" 
                 aria-labelledby="featured-apps-heading" 
                 itemScope itemType="https://schema.org/ItemList">
          <div className="container mx-auto max-w-7xl">
          <header className="text-center mb-16">
              <div className="inline-flex items-center justify-center p-4 bg-gradient-to-r from-red-600/20 to-orange-600/20 rounded-3xl mb-8 backdrop-blur-sm border border-red-500/20">
                <FaFire className="text-3xl text-red-400 animate-pulse" />
            </div>
              <h2 id="featured-apps-heading" className="text-4xl md:text-6xl font-black mb-6" itemProp="name">
              <span className="bg-gradient-to-r from-red-400 to-orange-500 bg-clip-text text-transparent">
                  🔥 Trending Cracked Apps
              </span>
            </h2>
              <p className="text-gray-300 text-xl max-w-3xl mx-auto mb-8 leading-relaxed" itemProp="description">
                Most downloaded premium applications this week. All apps are <strong>100% free</strong>, 
                <strong> fully cracked</strong>, and <strong>virus-scanned</strong> for your safety.
            </p>
              <div className="flex flex-wrap justify-center gap-4 mb-8">
                <span className="px-4 py-2 bg-green-900/30 border border-green-500/50 rounded-full text-green-300 text-sm font-medium">
                  ✅ Virus Free
                </span>
                <span className="px-4 py-2 bg-blue-900/30 border border-blue-500/50 rounded-full text-blue-300 text-sm font-medium">
                  🚀 Instant Download
                </span>
                <span className="px-4 py-2 bg-purple-900/30 border border-purple-500/50 rounded-full text-purple-300 text-sm font-medium">
                  🎯 Full Version
                </span>
              </div>
          </header>
          
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8" itemProp="itemListElement">
              {featuredApps.slice(0, 12).map((app, index) => (
              <article 
                key={app._id} 
                  className="group relative cursor-pointer transform hover:scale-105 transition-all duration-300"
                onClick={() => handleAppClick(app)}
                  itemScope itemType="https://schema.org/SoftwareApplication"
                  itemProp="itemListElement"
              >
                  <div className="absolute inset-0 bg-gradient-to-br from-gray-800/80 to-gray-900/80 rounded-3xl backdrop-blur-sm border border-gray-700/40 hover:border-red-500/60 transition-all duration-300 shadow-xl hover:shadow-2xl hover:shadow-red-500/20"></div>
                
                  <div className="relative p-6 h-full flex flex-col">
                    {/* Priority Badges */}
                    <div className="absolute -top-3 -right-3 z-10 flex flex-col gap-2">
                  {app.isHot && (
                        <div className="bg-gradient-to-r from-red-500 to-orange-500 text-white text-xs px-3 py-1 rounded-full font-bold flex items-center shadow-lg animate-pulse">
                      <FaFire className="mr-1 text-xs" />
                      HOT
                    </div>
                  )}
                  {app.isPremium && (
                        <div className="bg-gradient-to-r from-yellow-400 to-amber-500 text-black text-xs px-3 py-1 rounded-full font-bold flex items-center shadow-lg">
                      <FaCrown className="mr-1 text-xs" />
                      PRO
                    </div>
                  )}
                      {index < 3 && (
                        <div className="bg-gradient-to-r from-green-500 to-emerald-500 text-white text-xs px-3 py-1 rounded-full font-bold flex items-center shadow-lg">
                          <FaTrophy className="mr-1 text-xs" />
                          TOP
                        </div>
                      )}
                    </div>
                  
                    {/* App Icon & Info */}
                    <div className="text-center mb-6">
                      <div className="relative mb-4">
                        <div className="w-20 h-20 mx-auto rounded-2xl overflow-hidden shadow-2xl border-2 border-gray-600/40 group-hover:border-red-500/60 transition-all duration-300">
                        {app.images && app.images[0] ? (
                          <img 
                            src={app.images[0]} 
                              alt={`${app.name} - Free Cracked App Download`}
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                              loading={index < 4 ? "eager" : "lazy"}
                              itemProp="image"
                          />
                        ) : (
                            <div className="w-full h-full bg-gradient-to-br from-gray-700 to-gray-800 flex items-center justify-center text-3xl">
                            📱
                          </div>
                        )}
                      </div>
                    </div>
                    
                      <h3 className="text-xl font-bold text-white mb-2 line-clamp-2 group-hover:text-red-400 transition-colors duration-300" itemProp="name">
                      {app.name}
                    </h3>
                      <p className="text-gray-400 text-sm mb-1" itemProp="applicationCategory">
                        {app.category?.name || 'Premium Software'}
                      </p>
                      <p className="text-gray-500 text-xs" itemProp="operatingSystem">
                        Windows • Mac • Mobile
                    </p>
                  </div>
                  
                    {/* App Stats */}
                  <div className="flex justify-between items-center mb-4 text-sm">
                      <div className="flex items-center space-x-1" itemProp="aggregateRating" itemScope itemType="https://schema.org/AggregateRating">
                        <div className="flex text-yellow-400">
                        {[...Array(5)].map((_, i) => (
                          <FaStar 
                            key={i} 
                              className={`${i < Math.floor(app.rating || 4.5) ? 'text-yellow-400' : 'text-gray-600'} text-sm`} 
                          />
                        ))}
                        </div>
                        <span className="text-gray-300 ml-2 text-sm font-medium" itemProp="ratingValue">
                          {app.rating || '4.5'}
                        </span>
                        <meta itemProp="reviewCount" content={app.reviewCount || '100'} />
                        <meta itemProp="bestRating" content="5" />
                        <meta itemProp="worstRating" content="1" />
                      </div>
                      <div className="flex items-center text-gray-400 space-x-1">
                        <FaDownload className="text-sm" />
                        <span className="text-sm font-medium">
                          {app.downloads > 1000 ? `${(app.downloads/1000).toFixed(1)}K` : app.downloads || '0'}
                        </span>
                    </div>
                    </div>
                    
                    {/* File Info */}
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-gray-400 text-xs px-3 py-1 bg-gray-700/40 rounded-lg border border-gray-600/30">
                        📦 {app.size || 'N/A'}
                      </span>
                      <span className="text-green-400 text-xs px-3 py-1 bg-green-900/20 rounded-lg border border-green-500/30 font-medium">
                        FREE
                      </span>
                  </div>
                  
                    {/* Download Button */}
                    <div className="mt-auto">
                    <button 
                        className="w-full px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-bold rounded-xl shadow-lg transition-all duration-300 flex items-center justify-center space-x-2 hover:shadow-red-500/25 group-hover:scale-105"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleAppClick(app)
                      }}
                        aria-label={`Download ${app.name} for free - Cracked version`}
                    >
                        <FaDownload className="text-sm group-hover:animate-bounce" />
                        <span>FREE DOWNLOAD</span>
                    </button>
                  </div>

                    {/* Hidden Schema Data */}
                    <meta itemProp="description" content={app.description || `Download ${app.name} for free - Premium cracked version available with full features unlocked.`} />
                    <meta itemProp="url" content={`https://appscracked.com/app/${app.slug}`} />
                    <meta itemProp="downloadUrl" content={`https://appscracked.com/app/${app.slug}`} />
                    <div itemProp="offers" itemScope itemType="https://schema.org/Offer" className="hidden">
                      <meta itemProp="price" content="0.00" />
                      <meta itemProp="priceCurrency" content="USD" />
                      <meta itemProp="availability" content="https://schema.org/InStock" />
                  </div>
                </div>
              </article>
            ))}
          </div>

            {/* View All CTA */}
            <div className="text-center mt-16">
              <Link href="/apps" className="group">
                <button className="px-12 py-5 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white text-xl font-bold rounded-2xl shadow-2xl transition-all duration-300 hover:scale-105 hover:shadow-red-500/25 flex items-center space-x-3 mx-auto">
                  <span>View All {stats?.totalApps || '10,000+'} Apps</span>
                  <FaArrowRight className="group-hover:translate-x-2 transition-transform duration-300" />
                </button>
              </Link>
              <p className="text-gray-400 mt-4 text-lg">
                Discover premium software, games, and utilities - all completely free!
              </p>
          </div>

          {featuredApps.length === 0 && (
              <div className="text-center py-16">
                <FaSpinner className="text-4xl text-red-500 animate-spin mx-auto mb-6" />
                <h3 className="text-2xl text-white font-bold mb-2">Loading Premium Apps...</h3>
                <p className="text-gray-400">Fetching the latest cracked applications for you</p>
            </div>
          )}
        </div>
      </section>

        {/* Categories Section with Apps */}
      <CategoriesWithApps
          maxCategories={8}
        maxAppsPerCategory={6}
        onAppClick={handleAppClick}
        onCategoryClick={handleCategoryClick}
        showViewAll={true}
      />

        {/* SEO Content Section */}
        <section className="py-20 px-4 bg-gradient-to-br from-gray-900 via-black to-gray-800">
          <div className="container mx-auto max-w-6xl">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-black mb-6">
                <span className="bg-gradient-to-r from-red-400 to-orange-500 bg-clip-text text-transparent">
                  Why Choose AppsCracked?
                </span>
              </h2>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
                The most trusted platform for downloading premium software applications completely free
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="p-8 rounded-2xl bg-gradient-to-br from-gray-800/50 to-gray-900/50 border border-gray-700/50 hover:border-red-500/50 transition-all duration-300">
                <FaShieldAlt className="text-4xl text-green-400 mb-4" />
                <h3 className="text-2xl font-bold text-white mb-4">100% Safe & Tested</h3>
                <p className="text-gray-400 leading-relaxed">
                  Every application is thoroughly scanned for viruses and malware. Our security team ensures all downloads are completely safe for your device.
                </p>
              </div>

              <div className="p-8 rounded-2xl bg-gradient-to-br from-gray-800/50 to-gray-900/50 border border-gray-700/50 hover:border-red-500/50 transition-all duration-300">
                <FaBolt className="text-4xl text-yellow-400 mb-4" />
                <h3 className="text-2xl font-bold text-white mb-4">Lightning Fast Downloads</h3>
                <p className="text-gray-400 leading-relaxed">
                  Our high-speed servers ensure you get maximum download speeds. No waiting, no throttling - just instant access to your favorite software.
                </p>
              </div>

              <div className="p-8 rounded-2xl bg-gradient-to-br from-gray-800/50 to-gray-900/50 border border-gray-700/50 hover:border-red-500/50 transition-all duration-300">
                <FaGift className="text-4xl text-purple-400 mb-4" />
                <h3 className="text-2xl font-bold text-white mb-4">Always Free</h3>
                <p className="text-gray-400 leading-relaxed">
                  No subscriptions, no hidden fees, no premium accounts. Access thousands of premium applications without spending a single penny.
                </p>
              </div>

              <div className="p-8 rounded-2xl bg-gradient-to-br from-gray-800/50 to-gray-900/50 border border-gray-700/50 hover:border-red-500/50 transition-all duration-300">
                <FaUsers className="text-4xl text-blue-400 mb-4" />
                <h3 className="text-2xl font-bold text-white mb-4">Trusted Community</h3>
                <p className="text-gray-400 leading-relaxed">
                  Join over 2 million users worldwide who trust our platform for safe, reliable downloads of cracked applications and premium software.
                </p>
              </div>

              <div className="p-8 rounded-2xl bg-gradient-to-br from-gray-800/50 to-gray-900/50 border border-gray-700/50 hover:border-red-500/50 transition-all duration-300">
                <FaMobile className="text-4xl text-red-400 mb-4" />
                <h3 className="text-2xl font-bold text-white mb-4">All Platforms</h3>
                <p className="text-gray-400 leading-relaxed">
                  Whether you need Windows, Mac, Android, or iOS applications, we have everything covered. Cross-platform compatibility guaranteed.
                </p>
              </div>

              <div className="p-8 rounded-2xl bg-gradient-to-br from-gray-800/50 to-gray-900/50 border border-gray-700/50 hover:border-red-500/50 transition-all duration-300">
                <FaRocket className="text-4xl text-orange-400 mb-4" />
                <h3 className="text-2xl font-bold text-white mb-4">Latest Versions</h3>
                <p className="text-gray-400 leading-relaxed">
                  We constantly update our database with the newest versions of popular software. Get access to the latest features and improvements.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Final CTA Section */}
        <section className="py-16 px-4 text-center bg-gradient-to-r from-red-600/10 to-orange-600/10 border-t border-red-500/20">
          <div className="container mx-auto max-w-4xl">
            <h2 className="text-3xl md:text-4xl font-black mb-6 text-white">
              Ready to Access Premium Software for Free?
            </h2>
            <p className="text-xl text-gray-300 mb-8 leading-relaxed">
              Join millions of users who have discovered the power of free premium applications. 
              Start downloading today and unlock unlimited possibilities.
            </p>
            <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-6">
            <Link href="/apps">
                <button className="px-10 py-4 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white text-lg font-bold rounded-xl shadow-2xl transition-all duration-300 hover:scale-105">
                  Start Downloading Now
              </button>
            </Link>
            <Link href="/categories">
                <button className="px-10 py-4 bg-gradient-to-r from-gray-700 to-gray-800 hover:from-gray-600 hover:to-gray-700 text-white text-lg font-bold rounded-xl transition-all duration-300">
                  Browse by Category
              </button>
            </Link>
          </div>
        </div>
      </section>
      </main>
    </>
  )
}
