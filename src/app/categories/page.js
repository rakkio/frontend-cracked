'use client'

import { useState, useEffect, useMemo, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { api } from '@/lib/api'
import { 
    FaSpinner,
    FaSearch,
    FaTh, // Grid view icon 
    FaList,
    FaFilter,
    FaTimes,
    FaStar,
    FaDownload,
    FaEye,
    FaFire,
    FaCrown,
    FaArrowRight,
    FaSort,
    FaGem,
    FaTrophy,
    FaApple
} from 'react-icons/fa'

// SEO Structured Data Generator
const generateCategoriesStructuredData = (categories, filteredCategories) => {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://appscracked.com'
    
    return {
        "@context": "https://schema.org",
        "@graph": [
            {
                "@type": "WebPage",
                "@id": `${baseUrl}/categories#webpage`,
                "url": `${baseUrl}/categories`,
                "name": "Software Categories - Browse Premium Apps by Category | AppsCracked",
                "description": `Explore ${filteredCategories.length} categories of premium applications. Find cracked apps organized by type: Games, Utilities, Productivity, Entertainment and more.`,
                "breadcrumb": {
                    "@id": `${baseUrl}/categories#breadcrumb`
                },
                "inLanguage": "en-US"
            },
            {
                "@type": "BreadcrumbList",
                "@id": `${baseUrl}/categories#breadcrumb`,
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
                        "name": "Categories",
                        "item": `${baseUrl}/categories`
                    }
                ]
            },
            {
                "@type": "CollectionPage",
                "name": "Software Categories Collection",
                "description": "Comprehensive collection of software categories for premium applications",
                "url": `${baseUrl}/categories`,
                "mainEntity": {
                    "@type": "ItemList",
                    "numberOfItems": filteredCategories.length,
                    "itemListElement": filteredCategories.slice(0, 20).map((category, index) => ({
                        "@type": "Thing",
                        "position": index + 1,
                        "name": category.name,
                        "description": category.description || `${category.name} applications and software`,
                        "url": `${baseUrl}/category/${category.slug}`,
                        "identifier": category.slug
                    }))
                }
            },
            {
                "@type": "FAQPage",
                "mainEntity": [
                    {
                        "@type": "Question",
                        "name": "How many app categories are available?",
                        "acceptedAnswer": {
                            "@type": "Answer",
                            "text": `We have ${categories.length} different categories of premium applications including Games, Productivity, Utilities, Entertainment, and more.`
                        }
                    },
                    {
                        "@type": "Question",
                        "name": "Are all categories free to browse?",
                        "acceptedAnswer": {
                            "@type": "Answer",
                            "text": "Yes, all categories and applications are completely free to browse and download. No registration or payment required."
                        }
                    }
                ]
            }
        ]
    }
}

function CategoriesContent() {
    const [categories, setCategories] = useState([])
    const [categoryApps, setCategoryApps] = useState({}) // Store apps per category
    const [loading, setLoading] = useState(true)
    const [appsLoading, setAppsLoading] = useState({}) // Track loading per category
    const [searchTerm, setSearchTerm] = useState('')
    const [viewMode, setViewMode] = useState('grid') // 'grid' or 'list'
    const [sortBy, setSortBy] = useState('name') // 'name', 'apps', 'featured'
    const [showFeaturedOnly, setShowFeaturedOnly] = useState(false)
    const [selectedCategory, setSelectedCategory] = useState(null)
    const router = useRouter()
    const searchParams = useSearchParams()

    // Filtered and sorted categories
    const filteredCategories = useMemo(() => {
        let filtered = categories.filter(category => {
            const matchesSearch = category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                (category.description && category.description.toLowerCase().includes(searchTerm.toLowerCase()))
            const matchesFeatured = !showFeaturedOnly || category.isFeatured
            return matchesSearch && matchesFeatured
        })

        // Sort categories
        filtered.sort((a, b) => {
            switch (sortBy) {
                case 'apps':
                    return (b.appCount || 0) - (a.appCount || 0)
                case 'featured':
                    if (a.isFeatured && !b.isFeatured) return -1
                    if (!a.isFeatured && b.isFeatured) return 1
                    return a.name.localeCompare(b.name)
                default: // 'name'
                    return a.name.localeCompare(b.name)
            }
        })

        return filtered
    }, [categories, searchTerm, sortBy, showFeaturedOnly])

    useEffect(() => {
        fetchCategories()
        // Read URL params
        const view = searchParams.get('view')
        const sort = searchParams.get('sort')
        const featured = searchParams.get('featured')
        
        if (view) setViewMode(view)
        if (sort) setSortBy(sort)
        if (featured === 'true') setShowFeaturedOnly(true)
    }, [searchParams])

    // Insert structured data
    useEffect(() => {
        if (!loading && filteredCategories.length > 0) {
            const structuredData = generateCategoriesStructuredData(categories, filteredCategories)
            
            // Remove existing structured data
            const existingScript = document.querySelector('script[data-categories-structured="true"]')
            if (existingScript) {
                existingScript.remove()
            }
            
            // Add new structured data
            const script = document.createElement('script')
            script.type = 'application/ld+json'
            script.setAttribute('data-categories-structured', 'true')
            script.textContent = JSON.stringify(structuredData)
            document.head.appendChild(script)
        }
    }, [loading, categories, filteredCategories])

    const fetchCategories = async () => {
        try {
            setLoading(true)
            const response = await api.getCategories({ limit: 50 })
            const categoriesData = response.categories || []
            setCategories(categoriesData)
            
            // Fetch apps for each category (limit to first few apps for preview)
            await fetchCategoryApps(categoriesData.slice(0, 10)) // Limit to avoid too many requests
        } catch (error) {
            console.error('Error fetching categories:', error)
        } finally {
            setLoading(false)
        }
    }

    const fetchCategoryApps = async (categoriesToFetch) => {
        const appsData = {}
        const loadingState = {}

        for (const category of categoriesToFetch) {
            try {
                loadingState[category._id] = true
                setAppsLoading(prev => ({ ...prev, [category._id]: true }))
                
                const response = await api.getAppsByCategory(category.slug, {
                    limit: 6, // Show 6 apps per category
                    sort: 'popularity'
                })
                
                appsData[category._id] = response.data?.apps || response.apps || []
            } catch (error) {
                console.error(`Error fetching apps for ${category.name}:`, error)
                appsData[category._id] = []
            } finally {
                loadingState[category._id] = false
            }
        }
        
        setCategoryApps(prev => ({ ...prev, ...appsData }))
        setAppsLoading(prev => ({ ...prev, ...loadingState }))
    }

 

    const handleAppClick = (app) => {
        router.push(`/app/${app.slug || app._id}`)
    }

    const handleCategoryClick = (category) => {
        router.push(`/category/${category.slug}`)
    }

    const updateURL = (params) => {
        const current = new URLSearchParams(searchParams)
        Object.entries(params).forEach(([key, value]) => {
            if (value) {
                current.set(key, value)
            } else {
                current.delete(key)
            }
        })
        router.push(`/categories?${current.toString()}`, { scroll: false })
    }

    // SEO title and description
    const getPageTitle = () => {
        if (searchTerm) {
            return `${searchTerm} Categories - Software Types | AppsCracked`
        }
        if (showFeaturedOnly) {
            return 'Featured Categories - Popular Software Types | AppsCracked'
        }
        return 'Software Categories - Browse Premium Apps by Type 2024 | AppsCracked'
    }

    const getPageDescription = () => {
        if (searchTerm) {
            return `Find ${searchTerm} software categories. Browse ${filteredCategories.length} app categories with premium cracked applications and games.`
        }
        if (showFeaturedOnly) {
            return `Explore our most popular software categories. ${filteredCategories.length} featured categories with thousands of premium cracked applications.`
        }
        return `Browse ${filteredCategories.length} software categories. Find premium cracked apps organized by type: Games, Productivity, Utilities, Entertainment, Graphics, and more.`
    }

    const getKeywords = () => {
        const baseKeywords = ['software categories', 'app categories', 'cracked software types', 'premium app categories', 'free software categories']
        const categoryNames = filteredCategories.slice(0, 10).map(cat => cat.name.toLowerCase()).join(', ')
        if (searchTerm) {
            return [...baseKeywords, searchTerm, `${searchTerm} software`, `${searchTerm} categories`].join(', ')
        }
        return [...baseKeywords, categoryNames, 'games', 'productivity', 'utilities', 'entertainment'].join(', ')
    }

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-black to-purple-900/20">
                <div className="text-center space-y-4">
                    <FaSpinner className="text-5xl text-purple-500 animate-spin mx-auto" />
                    <h2 className="text-2xl text-white font-bold">Loading Categories...</h2>
                    <p className="text-gray-400">Organizing premium software by type</p>
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
            <link rel="canonical" href="https://appscracked.com/categories" />
            
            {/* Open Graph */}
            <meta property="og:title" content={getPageTitle()} />
            <meta property="og:description" content={getPageDescription()} />
            <meta property="og:type" content="website" />
            <meta property="og:url" content="https://appscracked.com/categories" />
            <meta property="og:image" content="https://appscracked.com/og-categories.jpg" />
            <meta property="og:site_name" content="AppsCracked" />
            
            {/* Twitter Card */}
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:title" content={getPageTitle()} />
            <meta name="twitter:description" content={getPageDescription()} />
            <meta name="twitter:image" content="https://appscracked.com/twitter-categories.jpg" />

            <main className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-900 to-black" itemScope itemType="https://schema.org/CollectionPage">
                {/* Enhanced Header */}
                <section className="relative overflow-hidden py-20">
                    <div className="absolute inset-0 bg-gradient-to-r from-red-600/10 via-purple-600/10 to-blue-600/10"></div>
                    <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-5"></div>
                    
                    <div className="container mx-auto px-4 relative z-10">
                        <div className="text-center mb-12">
                            <div className="flex justify-center mb-8">
                                <div className="relative group">
                                    <FaTh className="text-7xl text-transparent bg-gradient-to-r from-red-500 via-purple-500 to-blue-500 bg-clip-text drop-shadow-2xl group-hover:scale-110 transition-transform duration-300" />
                                    <div className="absolute inset-0 blur-2xl bg-gradient-to-r from-red-500/20 via-purple-500/20 to-blue-500/20 opacity-75 group-hover:opacity-100 transition-opacity duration-300"></div>
                                </div>
                            </div>
                            
                            <header className="space-y-6">
                                <h1 className="text-5xl md:text-7xl lg:text-8xl font-black mb-6" itemProp="name">
                                    <span className="bg-gradient-to-r from-white via-gray-100 to-gray-300 bg-clip-text text-transparent drop-shadow-lg">
                                        SOFTWARE CATEGORIES
                                    </span>
                                </h1>
                                
                                <h2 className="text-2xl md:text-4xl text-gray-300 font-medium leading-relaxed max-w-4xl mx-auto" itemProp="description">
                                    Explore our comprehensive collection of applications organized by category. 
                                    Discover new tools, games, and productivity apps tailored to your needs.
                                </h2>

                                {/* Enhanced Statistics Bar */}
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12 max-w-4xl mx-auto">
                                    <div className="text-center p-4 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10">
                                        <div className="text-3xl font-black text-red-400" itemProp="numberOfItems">
                                            {filteredCategories.length}
                                        </div>
                                        <div className="text-gray-300 font-medium">Categories</div>
                                        <div className="text-gray-500 text-sm">Available</div>
                                    </div>
                                    
                                    <div className="text-center p-4 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10">
                                        <div className="text-3xl font-black text-purple-400">
                                            {categories.reduce((sum, c) => sum + (c.appCount || 0), 0)}+
                                        </div>
                                        <div className="text-gray-300 font-medium">Total Apps</div>
                                        <div className="text-gray-500 text-sm">Premium Software</div>
                                    </div>
                                    
                                    <div className="text-center p-4 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10">
                                        <div className="text-3xl font-black text-green-400">
                                            {categories.filter(c => c.isFeatured).length}
                                        </div>
                                        <div className="text-gray-300 font-medium">Featured</div>
                                        <div className="text-gray-500 text-sm">Popular Types</div>
                                    </div>
                                    
                                    <div className="text-center p-4 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10">
                                        <div className="text-3xl font-black text-yellow-400">
                                            100%
                                        </div>
                                        <div className="text-gray-300 font-medium">Free</div>
                                        <div className="text-gray-500 text-sm">Always</div>
                                    </div>
                                </div>
                            </header>
                        </div>

                        {/* Enhanced Search and Filters */}
                        <div className="max-w-6xl mx-auto">
                            <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm border border-gray-700/40 rounded-2xl p-6">
                                <div className="flex flex-col lg:flex-row gap-6 items-center">
                                    {/* Search Bar */}
                                    <div className="relative flex-1 w-full lg:max-w-md">
                                        <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-lg" />
                                        <input
                                            type="text"
                                            placeholder="Search categories..."
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                            className="w-full pl-12 pr-12 py-4 bg-gray-700/50 border border-gray-600/50 rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 backdrop-blur-sm text-lg"
                                        />
                                        {searchTerm && (
                                            <button
                                                onClick={() => setSearchTerm('')}
                                                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                                            >
                                                <FaTimes />
                                            </button>
                                        )}
                                    </div>

                                    {/* Filters Row */}
                                    <div className="flex flex-wrap items-center gap-4">
                                        {/* Sort Dropdown */}
                                        <select
                                            value={sortBy}
                                            onChange={(e) => {
                                                setSortBy(e.target.value)
                                                updateURL({ sort: e.target.value })
                                            }}
                                            className="px-4 py-3 bg-gray-700/50 border border-gray-600/50 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/50 font-medium"
                                        >
                                            <option value="name">📝 Sort by Name</option>
                                            <option value="apps">📊 Sort by App Count</option>
                                            <option value="featured">⭐ Featured First</option>
                                        </select>

                                        {/* Featured Toggle */}
                                        <button
                                            onClick={() => {
                                                setShowFeaturedOnly(!showFeaturedOnly)
                                                updateURL({ featured: !showFeaturedOnly ? 'true' : null })
                                            }}
                                            className={`px-6 py-3 rounded-xl text-sm font-bold transition-all duration-300 flex items-center space-x-2 ${
                                                showFeaturedOnly
                                                    ? 'bg-purple-600 text-white shadow-lg'
                                                    : 'bg-gray-700/50 text-gray-300 hover:text-white border border-gray-600/50 hover:border-purple-500/50'
                                            }`}
                                        >
                                            <FaStar className={showFeaturedOnly ? 'text-yellow-300' : ''} />
                                            <span>Featured Only</span>
                                        </button>

                                        {/* View Mode Toggle */}
                                        <div className="flex bg-gray-700/50 rounded-xl border border-gray-600/50 overflow-hidden">
                                            <button
                                                onClick={() => {
                                                    setViewMode('grid')
                                                    updateURL({ view: 'grid' })
                                                }}
                                                className={`px-4 py-3 text-sm transition-colors ${
                                                    viewMode === 'grid'
                                                        ? 'bg-purple-600 text-white'
                                                        : 'text-gray-300 hover:text-white'
                                                }`}
                                            >
                                                <FaTh />
                                            </button>
                                            <button
                                                onClick={() => {
                                                    setViewMode('list')
                                                    updateURL({ view: 'list' })
                                                }}
                                                className={`px-4 py-3 text-sm transition-colors ${
                                                    viewMode === 'list'
                                                        ? 'bg-purple-600 text-white'
                                                        : 'text-gray-300 hover:text-white'
                                                }`}
                                            >
                                                <FaList />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Categories with Apps */}
                <section className="container mx-auto px-4 pb-12" itemProp="mainEntity" itemScope itemType="https://schema.org/ItemList">
                    <meta itemProp="numberOfItems" content={filteredCategories.length} />
                    
                    {filteredCategories.length > 0 ? (
                        <div className="space-y-12">
                            {filteredCategories.map((category, index) => {
                                const apps = categoryApps[category._id] || []
                                const isLoadingApps = appsLoading[category._id]

                                return (
                                    <article 
                                        key={category._id} 
                                        className="group"
                                        itemScope itemType="https://schema.org/Thing"
                                        itemProp="itemListElement"
                                    >
                                        <div className="bg-gradient-to-br from-gray-800/40 via-gray-800/30 to-gray-900/50 backdrop-blur-sm border border-gray-700/40 rounded-3xl p-8 hover:border-purple-500/30 transition-all duration-500 overflow-hidden relative shadow-xl hover:shadow-2xl hover:shadow-purple-500/10">
                                            {/* Background decoration */}
                                            <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-bl from-purple-600/5 to-transparent rounded-full blur-2xl"></div>
                                            
                                            {/* Category Header */}
                                            <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 relative z-10">
                                                <div className="flex items-center space-x-6 mb-6 md:mb-0">
                                                    {/* Category Icon */}
                                                    <div 
                                                        className="w-20 h-20 rounded-2xl flex items-center justify-center text-4xl shadow-2xl group-hover:scale-105 transition-transform duration-300 border-2"
                                                        style={{ 
                                                            background: `linear-gradient(135deg, ${category.color || '#8b5cf6'}15, ${category.color || '#8b5cf6'}30)`,
                                                            borderColor: `${category.color || '#8b5cf6'}40`
                                                        }}
                                                    >
                                                        <span style={{ color: category.color || '#8b5cf6' }}>
                                                            {category.icon || '📱'}
                                                        </span>
                                                    </div>
                                                    
                                                    {/* Category Info */}
                                                    <div>
                                                        <div className="flex items-center gap-4 mb-2">
                                                            <h2 className="text-3xl font-black text-white group-hover:text-purple-300 transition-colors duration-300" itemProp="name">
                                                                {category.name}
                                                            </h2>
                                                            {category.isFeatured && (
                                                                <span className="px-3 py-1 bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30 text-purple-300 text-xs rounded-full font-bold flex items-center space-x-1">
                                                                    <FaStar className="text-yellow-300" />
                                                                    <span>FEATURED</span>
                                                                </span>
                                                            )}
                                                            {index < 3 && (
                                                                <span className="px-3 py-1 bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/30 text-green-300 text-xs rounded-full font-bold flex items-center space-x-1">
                                                                    <FaTrophy />
                                                                    <span>TOP</span>
                                                                </span>
                                                            )}
                                                        </div>
                                                        <p className="text-gray-300 text-lg mb-2 font-medium">
                                                            <span className="text-purple-400 font-bold">{category.appCount || 0}</span> premium applications available
                                                        </p>
                                                        {category.description && (
                                                            <p className="text-gray-500 max-w-3xl leading-relaxed" itemProp="description">
                                                                {category.description.length > 150 
                                                                    ? `${category.description.substring(0, 150)}...` 
                                                                    : category.description
                                                                }
                                                            </p>
                                                        )}
                                                    </div>
                                                </div>

                                                {/* View All Button */}
                                                <button
                                                    onClick={() => handleCategoryClick(category)}
                                                    className="flex items-center space-x-3 px-6 py-4 bg-gradient-to-r from-purple-600/20 to-blue-600/20 hover:from-purple-600/30 hover:to-blue-600/30 border border-purple-500/30 hover:border-purple-400/50 text-purple-300 hover:text-purple-200 rounded-xl transition-all duration-300 group/btn shadow-lg hover:shadow-purple-500/20 hover:scale-105"
                                                    aria-label={`View all ${category.name} applications`}
                                                >
                                                    <span className="font-bold">View All {category.appCount || 0}</span>
                                                    <FaArrowRight className="text-sm group-hover/btn:translate-x-1 transition-transform" />
                                                </button>
                                            </div>

                                            {/* Apps Grid */}
                                            <div className="relative">
                                                {isLoadingApps ? (
                                                    <div className="flex items-center justify-center py-12">
                                                        <FaSpinner className="text-purple-500 animate-spin mr-3 text-xl" />
                                                        <span className="text-gray-400 text-lg">Loading premium apps...</span>
                                                    </div>
                                                ) : apps.length > 0 ? (
                                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
                                                        {apps.map((app, appIndex) => (
                                                            <div 
                                                                key={app._id}
                                                                onClick={() => handleAppClick(app)}
                                                                className="bg-gray-800/40 hover:bg-gray-700/50 border border-gray-600/30 hover:border-purple-500/40 rounded-2xl p-6 cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-lg group/app"
                                                                itemScope itemType="https://schema.org/SoftwareApplication"
                                                            >
                                                                {/* App Icon */}
                                                                <div className="w-14 h-14 bg-gradient-to-br from-gray-700 to-gray-800 rounded-xl flex items-center justify-center mb-4 group-hover/app:scale-110 transition-transform duration-300 border border-gray-600/40">
                                                                    {app.images?.[0] ? (
                                                                        <img 
                                                                            src={app.images[0]} 
                                                                            alt={`${app.name} - Free Download`}
                                                                            className="w-10 h-10 rounded-lg object-cover" 
                                                                            loading="lazy"
                                                                            itemProp="image"
                                                                        />
                                                                    ) : (
                                                                        <span className="text-purple-400 text-2xl">📱</span>
                                                                    )}
                                                                </div>

                                                                {/* App Info */}
                                                                <h3 className="font-bold text-white text-sm mb-3 line-clamp-2 group-hover/app:text-purple-300 transition-colors leading-tight" itemProp="name">
                                                                    {app.name}
                                                                </h3>

                                                                {/* App Stats */}
                                                                <div className="flex items-center justify-between text-xs">
                                                                    <div className="flex items-center space-x-3">
                                                                        {app.rating && (
                                                                            <div className="flex items-center space-x-1" itemProp="aggregateRating" itemScope itemType="https://schema.org/AggregateRating">
                                                                                <FaStar className="text-yellow-500" />
                                                                                <span className="text-gray-300 font-medium" itemProp="ratingValue">{app.rating}</span>
                                                                            </div>
                                                                        )}
                                                                        {app.downloadCount && (
                                                                            <div className="flex items-center space-x-1">
                                                                                <FaDownload className="text-green-500" />
                                                                                <span className="text-gray-300 font-medium">
                                                                                    {app.downloadCount > 1000 ? `${(app.downloadCount/1000).toFixed(1)}k` : app.downloadCount}
                                                                                </span>
                                                                            </div>
                                                                        )}
                                                                    </div>
                                                                    
                                                                    {/* App Badges */}
                                                                    <div className="flex items-center space-x-1">
                                                                        {app.isHot && <FaFire className="text-red-500" title="Hot App" />}
                                                                        {app.isPremium && <FaCrown className="text-yellow-500" title="Premium App" />}
                                                                        {appIndex === 0 && <FaTrophy className="text-green-500" title="Top in Category" />}
                                                                    </div>
                                                                </div>

                                                                {/* Hidden Schema Data */}
                                                                <meta itemProp="description" content={app.description || `Download ${app.name} for free - Premium cracked version available`} />
                                                                <meta itemProp="url" content={`https://appscracked.com/app/${app.slug}`} />
                                                                <meta itemProp="applicationCategory" content={category.name} />
                                                                <meta itemProp="operatingSystem" content="Windows, MacOS, Android, iOS" />
                                                            </div>
                                                        ))}
                                                    </div>
                                                ) : (
                                                    <div className="text-center py-12 text-gray-500">
                                                        <span className="text-3xl mb-3 block">📦</span>
                                                        <p className="text-lg">No apps available in this category yet</p>
                                                        <p className="text-sm mt-2">Check back soon for new releases!</p>
                                                    </div>
                                                )}
                                            </div>

                                            {/* Hidden Schema Data */}
                                            <meta itemProp="url" content={`https://appscracked.com/category/${category.slug}`} />
                                            <meta itemProp="identifier" content={category.slug} />
                                        </div>
                                    </article>
                                )
                            })}
                        </div>
                    ) : (
                        <div className="text-center py-20">
                            <div className="text-8xl mb-8">🔍</div>
                            <h3 className="text-4xl font-bold text-white mb-6">No Categories Found</h3>
                            <p className="text-gray-400 mb-10 text-xl max-w-2xl mx-auto leading-relaxed">
                                {searchTerm 
                                    ? `No categories match your search "${searchTerm}". Try different keywords or browse all categories.`
                                    : 'No categories are available at the moment. Please check back later.'
                                }
                            </p>
                            {searchTerm && (
                                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                    <button
                                        onClick={() => setSearchTerm('')}
                                        className="px-8 py-4 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white rounded-xl font-bold transition-all duration-300 hover:scale-105 shadow-lg"
                                    >
                                        Clear Search
                                    </button>
                                    <Link href="/apps">
                                        <button className="px-8 py-4 bg-transparent border-2 border-purple-500 text-purple-400 hover:bg-purple-500 hover:text-white rounded-xl font-bold transition-all duration-300">
                                            Browse All Apps
                                        </button>
                                    </Link>
                                </div>
                            )}
                        </div>
                    )}
                </section>

                {/* Enhanced CTA Section */}
                <section className="bg-gradient-to-r from-gray-900/50 via-purple-900/10 to-gray-900/50 backdrop-blur-sm border-t border-purple-500/20">
                    <div className="container mx-auto px-4 py-20">
                        <div className="text-center max-w-5xl mx-auto">
                            <div className="flex justify-center mb-8">
                                <div className="relative">
                                    <FaGem className="text-5xl text-purple-400" />
                                    <div className="absolute -top-2 -right-2 w-4 h-4 bg-purple-500 rounded-full animate-pulse"></div>
                                </div>
                            </div>
                            
                            <h2 className="text-4xl md:text-5xl font-black text-white mb-6">
                                Ready to Explore Premium Software?
                            </h2>
                            <p className="text-gray-300 mb-10 text-xl leading-relaxed">
                                Discover thousands of applications across all categories. Find the perfect tools for your workflow, 
                                entertainment, and productivity needs - all completely free.
                            </p>
                            
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                                <div className="p-6 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10">
                                    <FaApple className="text-3xl text-blue-400 mx-auto mb-3" />
                                    <h3 className="text-white font-bold mb-2">All Platforms</h3>
                                    <p className="text-gray-400 text-sm">Windows, Mac, Android, iOS</p>
                                </div>
                                <div className="p-6 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10">
                                    <FaTrophy className="text-3xl text-yellow-400 mx-auto mb-3" />
                                    <h3 className="text-white font-bold mb-2">Premium Quality</h3>
                                    <p className="text-gray-400 text-sm">Tested & virus-free apps</p>
                                </div>
                                <div className="p-6 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10">
                                    <FaDownload className="text-3xl text-green-400 mx-auto mb-3" />
                                    <h3 className="text-white font-bold mb-2">Instant Access</h3>
                                    <p className="text-gray-400 text-sm">Direct download links</p>
                                </div>
                            </div>
                            
                            <div className="flex flex-col sm:flex-row gap-6 justify-center">
                                <Link href="/apps">
                                    <button className="px-10 py-4 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-bold rounded-xl shadow-2xl transition-all duration-300 hover:shadow-red-500/25 hover:scale-105">
                                        Browse All Apps
                                    </button>
                                </Link>
                                <Link href="/apps?featured=true">
                                    <button className="px-10 py-4 bg-transparent border-2 border-purple-500 text-purple-400 hover:bg-purple-500 hover:text-white font-bold rounded-xl transition-all duration-300 hover:scale-105">
                                        Featured Apps
                                    </button>
                                </Link>
                            </div>
                        </div>
                    </div>
                </section>
            </main>
        </>
    )
}

// Loading component for Suspense fallback
function CategoriesPageLoading() {
    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-900 to-black flex items-center justify-center">
            <div className="text-center space-y-4">
                <FaSpinner className="animate-spin text-5xl text-purple-500 mx-auto" />
                <h2 className="text-2xl text-white font-bold">Loading Categories...</h2>
                <p className="text-gray-400">Organizing premium software by type</p>
            </div>
        </div>
    )
}

// Main page component with Suspense wrapper
export default function CategoriesPage() {
    return (
        <Suspense fallback={<CategoriesPageLoading />}>
            <CategoriesContent />
        </Suspense>
    )
} 