'use client'

import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { api } from '@/lib/api'
import { 
    FaDownload, 
    FaStar, 
    FaEye, 
    FaFire, 
    FaCrown, 
    FaSpinner,
    FaSearch,
    FaFilter,
    FaSort,
    FaTh,
    FaList,
    FaTrophy,
    FaGem,
    FaRocket
} from 'react-icons/fa'

// SEO Structured Data Generator
const generateAppsStructuredData = (apps, searchTerm, category) => {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://crackmarket.xyz'
    
    return {
        "@context": "https://schema.org",
        "@graph": [
            {
                "@type": "WebPage",
                "@id": `${baseUrl}/apps#webpage`,
                "url": `${baseUrl}/apps`,
                "name": searchTerm ? `Search Results: ${searchTerm} | AppsCracked` : "All Premium Apps - Free Downloads | AppsCracked",
                "description": searchTerm 
                    ? `Found ${apps.length} premium apps for "${searchTerm}". Download cracked applications, games, and software for free.`
                    : `Browse ${apps.length}+ premium applications. Download cracked apps, games, and software for Windows, Mac, Android, and iOS with direct links.`,
                "breadcrumb": {
                    "@id": `${baseUrl}/apps#breadcrumb`
                },
                "inLanguage": "en-US"
            },
            {
                "@type": "BreadcrumbList",
                "@id": `${baseUrl}/apps#breadcrumb`,
                "itemListElement": [
                    {
                        "@type": "ListItem",
                        "position": 1,
                        "name": "Home",
                        "item": baseUrl
                    },
                    {
                        "@type": "ListItem", 
                        "position": 2,
                        "name": "Apps",
                        "item": `${baseUrl}/apps`
                    }
                ]
            },
            {
                "@type": "CollectionPage",
                "name": "Premium Apps Collection",
                "description": "Complete collection of premium applications for free download",
                "url": `${baseUrl}/apps`,
                "mainEntity": {
                    "@type": "ItemList",
                    "numberOfItems": apps.length,
                    "itemListElement": apps.slice(0, 20).map((app, index) => ({
                        "@type": "SoftwareApplication",
                        "position": index + 1,
                        "name": app.name,
                        "description": app.shortDescription || app.description || `Download ${app.name} for free - Premium cracked version available`,
                        "url": `${baseUrl}/app/${app.slug}`,
                        "downloadUrl": `${baseUrl}/app/${app.slug}`,
                        "applicationCategory": app.category?.name || "UtilitiesApplication",
                        "operatingSystem": "Windows, MacOS, Android, iOS",
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
                            "availability": "https://schema.org/InStock",
                            "seller": {
                                "@type": "Organization",
                                "name": "AppsCracked"
                            }
                        }
                    }))
                }
            }
        ]
    }
}

function AppsContent() {
    const [apps, setApps] = useState([])
    const [categories, setCategories] = useState([])
    const [loading, setLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState('')
    const [selectedCategory, setSelectedCategory] = useState('')
    const [sortBy, setSortBy] = useState('createdAt') // Backend controller default
    const [sortOrder, setSortOrder] = useState('desc')
    const [currentPage, setCurrentPage] = useState(1)
    const [totalPages, setTotalPages] = useState(1)
    const [viewMode, setViewMode] = useState('grid') // 'grid' or 'list'
    const [filters, setFilters] = useState({
        featured: false,
        popular: false,
        newest: false,
        topRated: false
    })
    
    const router = useRouter()
    const searchParams = useSearchParams()

    useEffect(() => {
        // Get initial params from URL
        const category = searchParams.get('category')
        const search = searchParams.get('search')
        const featured = searchParams.get('featured')
        
        if (category) setSelectedCategory(category)
        if (search) setSearchTerm(search)
        if (featured) setFilters(prev => ({ ...prev, featured: true }))
        
        fetchData()
    }, [])

    useEffect(() => {
        fetchApps()
    }, [currentPage, sortBy, sortOrder, searchTerm, selectedCategory, filters])

    // Insert structured data
    useEffect(() => {
        if (!loading && apps.length > 0) {
            const structuredData = generateAppsStructuredData(apps, searchTerm, selectedCategory)
            
            // Remove existing structured data
            const existingScript = document.querySelector('script[data-apps-structured="true"]')
            if (existingScript) {
                existingScript.remove()
            }
            
            // Add new structured data
            const script = document.createElement('script')
            script.type = 'application/ld+json'
            script.setAttribute('data-apps-structured', 'true')
            script.textContent = JSON.stringify(structuredData)
            document.head.appendChild(script)
        }
    }, [loading, apps, searchTerm, selectedCategory])

    const fetchData = async () => {
        await Promise.all([fetchApps(), fetchCategories()])
        setLoading(false)
    }

    const fetchApps = async () => {
        try {
            const response = await api.getApps({
                page: currentPage,
                limit: 20,
                search: searchTerm,
                category: selectedCategory,
                sortBy: sortBy,
                sortOrder: sortOrder,
                featured: filters.featured ? 'true' : undefined,
                popular: filters.popular ? 'true' : undefined,
                newest: filters.newest ? 'true' : undefined,
                topRated: filters.topRated ? 'true' : undefined
            })
            
            setApps(response.data.apps || [])
            setTotalPages(response.data.pagination?.pages || 1)
        } catch (error) {
            console.error('Error fetching apps:', error)
        }
    }

    const fetchCategories = async () => {
        try {
            const response = await api.getCategories()
            setCategories(response.categories || [])
        } catch (error) {
            console.error('Error fetching categories:', error)
        }
    }

    const handleAppClick = (app) => {
        router.push(`/app/${app.slug}`)
    }

    const handleCategoryChange = (categoryId) => {
        setSelectedCategory(categoryId)
        setCurrentPage(1)
        updateURL({ category: categoryId })
    }

    const handleFilterChange = (filterName) => {
        setFilters(prev => ({
            ...prev,
            [filterName]: !prev[filterName]
        }))
        setCurrentPage(1)
    }

    const handleSortChange = (newSortBy) => {
        if (sortBy === newSortBy) {
            setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
        } else {
            setSortBy(newSortBy)
            setSortOrder('desc')
        }
        setCurrentPage(1)
    }

    const updateURL = (params) => {
        const url = new URL(window.location)
        Object.entries(params).forEach(([key, value]) => {
            if (value) {
                url.searchParams.set(key, value)
            } else {
                url.searchParams.delete(key)
            }
        })
        window.history.pushState({}, '', url)
    }

    const clearAllFilters = () => {
        setSearchTerm('')
        setSelectedCategory('')
        setFilters({
            featured: false,
            popular: false,
            newest: false,
            topRated: false
        })
        setSortBy('createdAt')
        setSortOrder('desc')
        setCurrentPage(1)
        window.history.pushState({}, '', '/apps')
    }

    // Generate SEO optimized titles and descriptions
    const getPageTitle = () => {
        if (searchTerm) {
            return `${searchTerm} - Free Cracked Apps Download | AppsCracked`
        }
        if (filters.featured) {
            return 'Featured Premium Apps - Free Download 2024 | AppsCracked'
        }
        if (filters.newest) {
            return 'Latest Cracked Apps - New Releases 2024 | AppsCracked'
        }
        if (filters.topRated) {
            return 'Top Rated Apps - Best Premium Software Free | AppsCracked'
        }
        return 'All Premium Apps - Free Cracked Software Download 2024 | AppsCracked'
    }

    const getPageDescription = () => {
        if (searchTerm) {
            return `Download ${searchTerm} and related premium apps for free. ${apps.length} cracked applications with direct download links, virus-free and tested.`
        }
        if (filters.featured) {
            return `Browse our featured collection of ${apps.length}+ premium apps. Download the most popular cracked applications with direct links, 100% free and safe.`
        }
        return `Download ${apps.length}+ premium applications for free. Cracked apps, games, and software for Windows, Mac, Android, and iOS with instant direct download links.`
    }

    const getKeywords = () => {
        const baseKeywords = ['cracked apps', 'free software download', 'premium apps free', 'download cracked apps', 'free crack software']
        if (searchTerm) {
            return [...baseKeywords, searchTerm, `${searchTerm} cracked`, `download ${searchTerm} free`].join(', ')
        }
        return [...baseKeywords, 'modded apps', 'premium software free', 'apps cracked', 'full version software free'].join(', ')
    }

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-black to-gray-800">
                <div className="text-center space-y-4">
                    <FaSpinner className="text-5xl text-red-500 animate-spin mx-auto" />
                    <p className="text-gray-400 text-lg">Loading Premium Apps...</p>
                </div>
            </div>
        )
    }

    return (
        <>
            {/* SEO Meta Tags */}
            <title>{getPageTitle()}</title>
            <meta name="description" content={getPageDescription()} />
            <meta name="keywords" content={getKeywords()} />
            <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
            <meta name="author" content="AppsCracked" />
            <link rel="canonical" href={`https://appscracked.com/apps${searchTerm ? `?search=${encodeURIComponent(searchTerm)}` : ''}`} />
            
            {/* Open Graph */}
            <meta property="og:title" content={getPageTitle()} />
            <meta property="og:description" content={getPageDescription()} />
            <meta property="og:type" content="website" />
            <meta property="og:url" content="https://appscracked.com/apps" />
            <meta property="og:image" content="https://appscracked.com/og-apps.jpg" />
            <meta property="og:site_name" content="AppsCracked" />
            
            {/* Twitter Card */}
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:title" content={getPageTitle()} />
            <meta name="twitter:description" content={getPageDescription()} />
            <meta name="twitter:image" content="https://appscracked.com/twitter-apps.jpg" />

            <main className="min-h-screen" itemScope itemType="https://schema.org/CollectionPage">
                {/* Enhanced Header */}
                <section className="relative py-16 px-4 bg-gradient-to-br from-gray-900 via-black to-red-900/20">
                    <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-5"></div>
                    
                    <div className="container mx-auto text-center relative z-10 max-w-6xl">
                        <header className="space-y-6">
                            {/* Icon & Title */}
                            <div className="flex justify-center mb-6">
                                <div className="relative group">
                                    <FaRocket className="text-6xl text-red-500 drop-shadow-2xl group-hover:scale-110 transition-transform duration-300" />
                                    <div className="absolute -top-2 -right-2 w-5 h-5 bg-gradient-to-r from-red-400 to-red-600 rounded-full animate-pulse shadow-lg"></div>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <h1 className="text-4xl md:text-6xl lg:text-7xl font-black leading-tight" itemProp="name">
                                    {searchTerm ? (
                                        <>
                                            <span className="bg-gradient-to-r from-red-400 to-red-600 bg-clip-text text-transparent">
                                                "{searchTerm}"
                                            </span>
                                            <br />
                                            <span className="text-white text-2xl md:text-4xl">Search Results</span>
                                        </>
                                    ) : (
                                        <span className="bg-gradient-to-r from-red-400 via-red-500 to-red-600 bg-clip-text text-transparent drop-shadow-lg">
                                            ALL PREMIUM APPS
                                        </span>
                                    )}
                                </h1>
                                
                                <h2 className="text-xl md:text-3xl text-gray-300 font-medium" itemProp="description">
                                    {searchTerm 
                                        ? `Found ${apps.length} premium apps matching your search`
                                        : `${apps.length}+ Premium Applications • Free Download • Instant Access`
                                    }
                                </h2>
                            </div>

                            {/* Trust Signals */}
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-8 max-w-2xl mx-auto">
                                <div className="text-center p-3 rounded-lg bg-white/5 backdrop-blur-sm border border-white/10">
                                    <FaTrophy className="text-2xl text-yellow-400 mx-auto mb-2" />
                                    <span className="text-white font-semibold text-sm">Top Quality</span>
                                </div>
                                <div className="text-center p-3 rounded-lg bg-white/5 backdrop-blur-sm border border-white/10">
                                    <FaGem className="text-2xl text-purple-400 mx-auto mb-2" />
                                    <span className="text-white font-semibold text-sm">Premium</span>
                                </div>
                                <div className="text-center p-3 rounded-lg bg-white/5 backdrop-blur-sm border border-white/10">
                                    <FaDownload className="text-2xl text-green-400 mx-auto mb-2" />
                                    <span className="text-white font-semibold text-sm">Direct Links</span>
                                </div>
                                <div className="text-center p-3 rounded-lg bg-white/5 backdrop-blur-sm border border-white/10">
                                    <FaFire className="text-2xl text-red-400 mx-auto mb-2" />
                                    <span className="text-white font-semibold text-sm">Always Free</span>
                                </div>
                            </div>
                        </header>
                    </div>
                </section>

                {/* Search and Filters */}
                <section className="container mx-auto px-4 py-8">
                    <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm border border-gray-700/40 rounded-2xl p-6">
                        {/* Top Row - Search and View Mode */}
                        <div className="flex flex-col lg:flex-row gap-4 items-center justify-between mb-6">
                            <div className="relative flex-1 max-w-xl">
                                <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-lg" />
                                <input
                                    type="text"
                                    placeholder="Search premium applications..."
                                    value={searchTerm}
                                    onChange={(e) => {
                                        setSearchTerm(e.target.value)
                                        setCurrentPage(1)
                                        updateURL({ search: e.target.value })
                                    }}
                                    className="w-full pl-12 pr-4 py-4 bg-gray-700/50 border border-gray-600/50 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500/50 focus:border-red-500/50 text-lg"
                                />
                            </div>

                            <div className="flex items-center space-x-3">
                                <span className="text-gray-400 text-sm">View:</span>
                                <div className="flex bg-gray-700/50 rounded-lg border border-gray-600/50 overflow-hidden">
                                    <button
                                        onClick={() => setViewMode('grid')}
                                        className={`p-3 transition-colors ${
                                            viewMode === 'grid' ? 'bg-red-600 text-white' : 'text-gray-300 hover:bg-gray-600'
                                        }`}
                                    >
                                        <FaTh />
                                    </button>
                                    <button
                                        onClick={() => setViewMode('list')}
                                        className={`p-3 transition-colors ${
                                            viewMode === 'list' ? 'bg-red-600 text-white' : 'text-gray-300 hover:bg-gray-600'
                                        }`}
                                    >
                                        <FaList />
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Filters Row */}
                        <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
                            {/* Category Filter */}
                            <div className="flex items-center space-x-3">
                                <span className="text-gray-400 text-sm font-medium">Category:</span>
                                <select
                                    value={selectedCategory}
                                    onChange={(e) => handleCategoryChange(e.target.value)}
                                    className="bg-gray-700/50 border border-gray-600/50 rounded-lg px-4 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-red-500/50 min-w-[150px]"
                                >
                                    <option value="">All Categories</option>
                                    {categories.map(category => (
                                        <option key={category._id} value={category._id}>
                                            {category.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Filter Buttons */}
                            <div className="flex items-center space-x-4">
                                <div className="flex items-center space-x-2">
                                    <FaFilter className="text-gray-400" />
                                    <span className="text-gray-400 text-sm font-medium">Filters:</span>
                                </div>
                                
                                {Object.entries({
                                    featured: 'Featured',
                                    popular: 'Popular', 
                                    newest: 'Latest',
                                    topRated: 'Top Rated'
                                }).map(([key, label]) => (
                                    <button
                                        key={key}
                                        onClick={() => handleFilterChange(key)}
                                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                                            filters[key] 
                                                ? 'bg-red-600 text-white shadow-lg' 
                                                : 'bg-gray-700/50 text-gray-300 hover:bg-gray-600 border border-gray-600/50'
                                        }`}
                                    >
                                        {label}
                                    </button>
                                ))}
                            </div>

                            {/* Sort */}
                            <div className="flex items-center space-x-3">
                                <FaSort className="text-gray-400" />
                                <select
                                    value={`${sortBy}-${sortOrder}`}
                                    onChange={(e) => {
                                        const [newSortBy, newSortOrder] = e.target.value.split('-')
                                        setSortBy(newSortBy)
                                        setSortOrder(newSortOrder)
                                        setCurrentPage(1)
                                    }}
                                    className="bg-gray-700/50 border border-gray-600/50 rounded-lg px-4 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-red-500/50 min-w-[150px]"
                                >
                                    <option value="createdAt-desc">🆕 Newest First</option>
                                    <option value="createdAt-asc">🕐 Oldest First</option>
                                    <option value="name-asc">🔤 Name A-Z</option>
                                    <option value="name-desc">🔤 Name Z-A</option>
                                    <option value="downloads-desc">📥 Most Downloaded</option>
                                    <option value="rating-desc">⭐ Highest Rated</option>
                                </select>
                            </div>
                        </div>

                        {/* Clear Filters */}
                        {(searchTerm || selectedCategory || Object.values(filters).some(f => f)) && (
                            <div className="mt-6 pt-4 border-t border-gray-700/50">
                                <button
                                    onClick={clearAllFilters}
                                    className="text-red-400 hover:text-red-300 text-sm font-medium transition-colors duration-300 flex items-center space-x-2"
                                >
                                    <span>✖</span>
                                    <span>Clear all filters</span>
                                </button>
                            </div>
                        )}
                    </div>
                </section>

                {/* Apps Grid/List */}
                <section className="container mx-auto px-4 pb-12" itemProp="mainEntity" itemScope itemType="https://schema.org/ItemList">
                    <meta itemProp="numberOfItems" content={apps.length} />
                    
                    {apps.length > 0 ? (
                        viewMode === 'grid' ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                                {apps.map((app, index) => (
                                    <article 
                                        key={app._id} 
                                        className="group relative cursor-pointer transform hover:scale-105 transition-all duration-300"
                                        onClick={() => handleAppClick(app)}
                                        itemScope itemType="https://schema.org/SoftwareApplication"
                                        itemProp="itemListElement"
                                    >
                                        <div className="absolute inset-0 bg-gradient-to-br from-gray-800/80 to-gray-900/80 rounded-2xl backdrop-blur-sm border border-gray-700/40 hover:border-red-500/60 transition-all duration-300 shadow-xl hover:shadow-2xl hover:shadow-red-500/20"></div>
                                        
                                        <div className="relative p-6 h-full flex flex-col">
                                            {/* Priority Badges */}
                                            <div className="absolute -top-2 -right-2 z-10 flex flex-col gap-2">
                                                {app.isHot && (
                                                    <div className="bg-gradient-to-r from-red-500 to-orange-500 text-white text-xs px-2 py-1 rounded-full font-bold flex items-center shadow-lg animate-pulse">
                                                        <FaFire className="mr-1" />
                                                        HOT
                                                    </div>
                                                )}
                                                {app.isPremium && (
                                                    <div className="bg-gradient-to-r from-yellow-400 to-amber-500 text-black text-xs px-2 py-1 rounded-full font-bold flex items-center shadow-lg">
                                                        <FaCrown className="mr-1" />
                                                        PRO
                                                    </div>
                                                )}
                                                {index < 3 && (
                                                    <div className="bg-gradient-to-r from-green-500 to-emerald-500 text-white text-xs px-2 py-1 rounded-full font-bold flex items-center shadow-lg">
                                                        <FaTrophy className="mr-1" />
                                                        TOP
                                                    </div>
                                                )}
                                            </div>
                                            
                                            {/* App Icon & Info */}
                                            <div className="text-center mb-6">
                                                <div className="relative mb-4">
                                                    <div className="w-16 h-16 mx-auto rounded-xl overflow-hidden shadow-2xl border border-gray-600/40 group-hover:border-red-500/60 transition-all duration-300">
                                                        {app.images && app.images[0] ? (
                                                            <img 
                                                                src={app.images[0]} 
                                                                alt={`${app.name} - Free Cracked App Download`}
                                                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                                                                loading={index < 8 ? "eager" : "lazy"}
                                                                itemProp="image"
                                                            />
                                                        ) : (
                                                            <div className="w-full h-full bg-gradient-to-br from-gray-700 to-gray-800 flex items-center justify-center text-2xl">
                                                                📱
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                                
                                                <h3 className="text-lg font-bold text-white mb-2 line-clamp-2 group-hover:text-red-400 transition-colors duration-300" itemProp="name">
                                                    {app.name}
                                                </h3>
                                                <p className="text-gray-400 text-sm" itemProp="applicationCategory">
                                                    {app.category?.name || 'Premium Software'}
                                                </p>
                                            </div>
                                            
                                            {/* App Stats */}
                                            <div className="flex justify-between items-center mb-4 text-sm">
                                                <div className="flex items-center space-x-1" itemProp="aggregateRating" itemScope itemType="https://schema.org/AggregateRating">
                                                    <div className="flex text-yellow-400">
                                                        {[...Array(5)].map((_, i) => (
                                                            <FaStar 
                                                                key={i} 
                                                                className={`${i < Math.floor(app.rating || 4.5) ? 'text-yellow-400' : 'text-gray-600'} text-xs`} 
                                                            />
                                                        ))}
                                                    </div>
                                                    <span className="text-gray-300 ml-1 font-medium" itemProp="ratingValue">
                                                        {app.rating || '4.5'}
                                                    </span>
                                                    <meta itemProp="reviewCount" content={app.reviewCount || '100'} />
                                                    <meta itemProp="bestRating" content="5" />
                                                    <meta itemProp="worstRating" content="1" />
                                                </div>
                                                <div className="text-gray-400 font-medium">
                                                    <FaDownload className="inline mr-1" />
                                                    {app.downloads > 1000 ? `${(app.downloads/1000).toFixed(1)}K` : app.downloads || '0'}
                                                </div>
                                            </div>
                                            
                                            {/* File Info */}
                                            <div className="flex justify-between items-center mb-4">
                                                <span className="text-gray-400 text-xs px-2 py-1 bg-gray-700/40 rounded-lg">
                                                    📦 {app.size || 'N/A'}
                                                </span>
                                                <span className="text-green-400 text-xs px-2 py-1 bg-green-900/20 rounded-lg border border-green-500/30 font-bold">
                                                    FREE
                                                </span>
                                            </div>
                                            
                                            {/* Download Button */}
                                            <div className="mt-auto">
                                                <button 
                                                    className="w-full px-4 py-3 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-bold rounded-lg shadow-lg transition-all duration-300 flex items-center justify-center space-x-2 hover:shadow-red-500/25 group-hover:scale-105"
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
                                            <meta itemProp="operatingSystem" content="Windows, MacOS, Android, iOS" />
                                            <div itemProp="offers" itemScope itemType="https://schema.org/Offer" className="hidden">
                                                <meta itemProp="price" content="0.00" />
                                                <meta itemProp="priceCurrency" content="USD" />
                                                <meta itemProp="availability" content="https://schema.org/InStock" />
                                            </div>
                                        </div>
                                    </article>
                                ))}
                            </div>
                        ) : (
                            <div className="space-y-6">
                                {apps.map((app, index) => (
                                    <article 
                                        key={app._id} 
                                        className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-sm border border-gray-700/40 rounded-2xl p-6 cursor-pointer hover:border-red-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-red-500/10"
                                        onClick={() => handleAppClick(app)}
                                        itemScope itemType="https://schema.org/SoftwareApplication"
                                        itemProp="itemListElement"
                                    >
                                        <div className="flex items-center space-x-6">
                                            {/* App Icon */}
                                            <div className="flex-shrink-0">
                                                <div className="w-16 h-16 rounded-xl overflow-hidden shadow-lg border border-gray-600/40">
                                                    {app.images && app.images[0] ? (
                                                        <img 
                                                            src={app.images[0]} 
                                                            alt={`${app.name} - Free App Download`}
                                                            className="w-full h-full object-cover"
                                                            loading={index < 5 ? "eager" : "lazy"}
                                                            itemProp="image"
                                                        />
                                                    ) : (
                                                        <div className="w-full h-full bg-gradient-to-br from-gray-700 to-gray-800 flex items-center justify-center text-2xl">
                                                            📱
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                            
                                            {/* App Info */}
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center space-x-3 mb-2">
                                                    <h3 className="text-xl font-bold text-white truncate" itemProp="name">
                                                        {app.name}
                                                    </h3>
                                                    {app.isHot && (
                                                        <span className="bg-gradient-to-r from-red-500 to-orange-500 text-white text-xs px-2 py-1 rounded-full font-bold flex items-center">
                                                            <FaFire className="mr-1" />
                                                            HOT
                                                        </span>
                                                    )}
                                                    {app.isPremium && (
                                                        <span className="bg-gradient-to-r from-yellow-400 to-amber-500 text-black text-xs px-2 py-1 rounded-full font-bold flex items-center">
                                                            <FaCrown className="mr-1" />
                                                            PRO
                                                        </span>
                                                    )}
                                                </div>
                                                
                                                <p className="text-gray-400 mb-3 line-clamp-2" itemProp="description">
                                                    {app.shortDescription || app.description?.substring(0, 120) + '...' || `Download ${app.name} for free - Premium cracked version with full features.`}
                                                </p>
                                                
                                                <div className="flex items-center space-x-6 text-sm">
                                                    <span className="text-gray-300" itemProp="applicationCategory">
                                                        {app.category?.name || 'Software'}
                                                    </span>
                                                    <div className="flex items-center text-yellow-400" itemProp="aggregateRating" itemScope itemType="https://schema.org/AggregateRating">
                                                        <FaStar className="mr-1" />
                                                        <span itemProp="ratingValue">{app.rating || '4.5'}</span>
                                                        <meta itemProp="reviewCount" content={app.reviewCount || '100'} />
                                                    </div>
                                                    <div className="text-gray-400">
                                                        <FaDownload className="inline mr-1" />
                                                        {app.downloads > 1000 ? `${(app.downloads/1000).toFixed(1)}K` : app.downloads || '0'}
                                                    </div>
                                                    <span className="text-gray-400">{app.size || 'N/A'}</span>
                                                </div>
                                            </div>
                                            
                                            {/* Download Button */}
                                            <div className="flex-shrink-0">
                                                <button 
                                                    className="px-8 py-3 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-bold rounded-xl transition-all duration-300 flex items-center space-x-2 hover:scale-105 shadow-lg hover:shadow-red-500/25"
                                                    onClick={(e) => {
                                                        e.stopPropagation()
                                                        handleAppClick(app)
                                                    }}
                                                    aria-label={`Download ${app.name} for free`}
                                                >
                                                    <FaDownload />
                                                    <span>FREE DOWNLOAD</span>
                                                </button>
                                            </div>

                                            {/* Hidden Schema Data */}
                                            <meta itemProp="url" content={`https://appscracked.com/app/${app.slug}`} />
                                            <meta itemProp="downloadUrl" content={`https://appscracked.com/app/${app.slug}`} />
                                            <meta itemProp="operatingSystem" content="Windows, MacOS, Android, iOS" />
                                            <div itemProp="offers" itemScope itemType="https://schema.org/Offer" className="hidden">
                                                <meta itemProp="price" content="0.00" />
                                                <meta itemProp="priceCurrency" content="USD" />
                                                <meta itemProp="availability" content="https://schema.org/InStock" />
                                            </div>
                                        </div>
                                    </article>
                                ))}
                            </div>
                        )
                    ) : (
                        <div className="text-center py-20">
                            <div className="text-6xl mb-6">🔍</div>
                            <h3 className="text-3xl font-bold text-white mb-4">No Apps Found</h3>
                            <p className="text-gray-400 mb-8 text-lg max-w-md mx-auto">
                                {searchTerm 
                                    ? `No apps found for "${searchTerm}". Try different keywords or browse all categories.`
                                    : 'No applications match your current filters. Try adjusting your search criteria.'
                                }
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <button
                                    onClick={clearAllFilters}
                                    className="px-8 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold transition-all duration-300 hover:scale-105"
                                >
                                    Clear All Filters
                                </button>
                                <Link href="/categories">
                                    <button className="px-8 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-xl font-bold transition-all duration-300">
                                        Browse Categories
                                    </button>
                                </Link>
                            </div>
                        </div>
                    )}
                </section>

                {/* Enhanced Pagination */}
                {totalPages > 1 && (
                    <section className="container mx-auto px-4 pb-12">
                        <div className="flex justify-center items-center space-x-3">
                            <button
                                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                disabled={currentPage === 1}
                                className="px-6 py-3 bg-gray-700/50 hover:bg-gray-600 disabled:bg-gray-800 disabled:text-gray-500 text-white rounded-xl transition-all duration-300 font-medium border border-gray-600/50"
                            >
                                ← Previous
                            </button>
                            
                            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                                let pageNum
                                if (totalPages <= 5) {
                                    pageNum = i + 1
                                } else if (currentPage <= 3) {
                                    pageNum = i + 1
                                } else if (currentPage >= totalPages - 2) {
                                    pageNum = totalPages - 4 + i
                                } else {
                                    pageNum = currentPage - 2 + i
                                }
                                
                                return (
                                    <button
                                        key={pageNum}
                                        onClick={() => setCurrentPage(pageNum)}
                                        className={`px-4 py-3 rounded-xl transition-all duration-300 font-bold ${
                                            currentPage === pageNum
                                                ? 'bg-red-600 text-white shadow-lg'
                                                : 'bg-gray-700/50 hover:bg-gray-600 text-white border border-gray-600/50'
                                        }`}
                                    >
                                        {pageNum}
                                    </button>
                                )
                            })}
                            
                            <button
                                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                disabled={currentPage === totalPages}
                                className="px-6 py-3 bg-gray-700/50 hover:bg-gray-600 disabled:bg-gray-800 disabled:text-gray-500 text-white rounded-xl transition-all duration-300 font-medium border border-gray-600/50"
                            >
                                Next →
                            </button>
                        </div>
                        
                        <div className="text-center mt-6 text-gray-400">
                            <p className="text-lg">
                                <span className="text-white font-bold">Page {currentPage}</span> of <span className="text-white font-bold">{totalPages}</span>
                                <span className="mx-3">•</span>
                                <span className="text-white font-bold">{apps.length}</span> premium apps
                            </p>
                        </div>
                    </section>
                )}

                {/* CTA Section */}
                <section className="py-16 px-4 bg-gradient-to-r from-red-600/10 to-orange-600/10 border-t border-red-500/20">
                    <div className="container mx-auto text-center max-w-4xl">
                        <h2 className="text-3xl md:text-4xl font-black text-white mb-4">
                            Can't Find What You're Looking For?
                        </h2>
                        <p className="text-xl text-gray-300 mb-8">
                            Browse our categories or contact us to request specific applications
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link href="/categories">
                                <button className="px-8 py-4 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-bold rounded-xl shadow-xl transition-all duration-300 hover:scale-105">
                                    Browse Categories
                                </button>
                            </Link>
                            <Link href="/contact">
                                <button className="px-8 py-4 bg-transparent border-2 border-red-500 text-red-400 hover:bg-red-500 hover:text-white font-bold rounded-xl transition-all duration-300">
                                    Request App
                                </button>
                            </Link>
                        </div>
                    </div>
                </section>
            </main>
        </>
    )
}

// Loading component for Suspense fallback
function AppsPageLoading() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 flex items-center justify-center">
            <div className="text-center">
                <FaSpinner className="animate-spin text-5xl text-red-500 mx-auto mb-6" />
                <h2 className="text-2xl text-white font-bold mb-2">Loading Premium Apps...</h2>
                <p className="text-gray-400">Fetching the latest cracked applications</p>
            </div>
        </div>
    )
}

// Main page component with Suspense wrapper
export default function AppsPage() {
    return (
        <Suspense fallback={<AppsPageLoading />}>
            <AppsContent />
        </Suspense>
    )
} 