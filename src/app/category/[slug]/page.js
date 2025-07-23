'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { api } from '@/lib/api'
import { 
    FaDownload, 
    FaStar, 
    FaEye, 
    FaFire, 
    FaCrown, 
    FaSpinner,
    FaArrowLeft,
    FaSearch,
    FaFilter,
    FaSort,
    FaTrophy,
    FaGem,
    FaHome
} from 'react-icons/fa'

// SEO Structured Data Generator
const generateCategoryStructuredData = (category, apps) => {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://crackmarket.xyz'
    
    return {
        "@context": "https://schema.org",
        "@graph": [
            {
                "@type": "WebPage",
                "@id": `${baseUrl}/category/${category.slug}#webpage`,
                "url": `${baseUrl}/category/${category.slug}`,
                "name": `${category.name} Apps - Free Downloads | AppsCracked`,
                "description": `Download ${apps.length}+ premium ${category.name} applications for free. ${category.description || `Best ${category.name} software collection with direct download links.`}`,
                "breadcrumb": {
                    "@id": `${baseUrl}/category/${category.slug}#breadcrumb`
                },
                "inLanguage": "en-US"
            },
            {
                "@type": "BreadcrumbList", 
                "@id": `${baseUrl}/category/${category.slug}#breadcrumb`,
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
                    },
                    {
                        "@type": "ListItem",
                        "position": 3,
                        "name": category.name,
                        "item": `${baseUrl}/category/${category.slug}`
                    }
                ]
            },
            {
                "@type": "CollectionPage",
                "name": `${category.name} Apps Collection`,
                "description": category.description || `Collection of ${category.name} applications for free download`,
                "url": `${baseUrl}/category/${category.slug}`,
                "mainEntity": {
                    "@type": "ItemList",
                    "numberOfItems": apps.length,
                    "itemListElement": apps.slice(0, 20).map((app, index) => ({
                        "@type": "SoftwareApplication",
                        "position": index + 1,
                        "name": app.name,
                        "description": app.shortDescription || app.description || `Download ${app.name} for free - Premium ${category.name} application`,
                        "url": `${baseUrl}/app/${app.slug}`,
                        "downloadUrl": `${baseUrl}/app/${app.slug}`,
                        "applicationCategory": category.name,
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

export default function CategoryPage() {
    const [category, setCategory] = useState(null)
    const [apps, setApps] = useState([])
    const [loading, setLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState('')
    const [sortBy, setSortBy] = useState('createdAt') // Backend controller default
    const [sortOrder, setSortOrder] = useState('desc')
    const [currentPage, setCurrentPage] = useState(1)
    const [totalPages, setTotalPages] = useState(1)
    const [filters, setFilters] = useState({
        featured: false,
        popular: false,
        newest: false
    })
    
    const params = useParams()
    const router = useRouter()

    useEffect(() => {
        if (params.slug) {
            fetchCategoryAndApps()
        }
    }, [params.slug, currentPage, sortBy, sortOrder, searchTerm, filters])

    // Insert structured data
    useEffect(() => {
        if (!loading && category && apps.length > 0) {
            const structuredData = generateCategoryStructuredData(category, apps)
            
            // Remove existing structured data
            const existingScript = document.querySelector('script[data-category-structured="true"]')
            if (existingScript) {
                existingScript.remove()
            }
            
            // Add new structured data
            const script = document.createElement('script')
            script.type = 'application/ld+json'
            script.setAttribute('data-category-structured', 'true')
            script.textContent = JSON.stringify(structuredData)
            document.head.appendChild(script)
        }
    }, [loading, category, apps])

    const fetchCategoryAndApps = async () => {
        try {
            setLoading(true)
            
            // First, get all categories to find the one with this slug
            const categoriesResponse = await api.getCategories()
            const foundCategory = categoriesResponse.categories?.find(c => c.slug === params.slug)
            
            if (!foundCategory) {
                router.push('/404')
                return
            }
            
            setCategory(foundCategory)
            
            // Then fetch apps for this category
            const appsResponse = await api.getApps({
                category: foundCategory._id,
                page: currentPage,
                limit: 12,
                search: searchTerm,
                sortBy: sortBy,
                sortOrder: sortOrder,
                featured: filters.featured ? 'true' : undefined,
                popular: filters.popular ? 'true' : undefined,
                newest: filters.newest ? 'true' : undefined
            })
            
            setApps(appsResponse.data.apps || [])
            setTotalPages(appsResponse.data.pagination?.pages || 1)
        } catch (error) {
            console.error('Error fetching category data:', error)
            if (error.status === 404) {
                router.push('/404')
            }
        } finally {
            setLoading(false)
        }
    }

    const handleAppClick = (app) => {
        router.push(`/app/${app.slug}`)
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

    // SEO title and description
    const getPageTitle = () => {
        if (!category) return 'Category | AppsCracked'
        
        if (searchTerm) {
            return `${searchTerm} in ${category.name} - Free Downloads | AppsCracked`
        }
        if (filters.featured) {
            return `Featured ${category.name} Apps - Premium Downloads 2024 | AppsCracked`
        }
        if (filters.newest) {
            return `Latest ${category.name} Apps - New Releases 2024 | AppsCracked`
        }
        return `${category.name} Apps - Free Download Premium Software 2024 | AppsCracked`
    }

    const getPageDescription = () => {
        if (!category) return 'Browse premium applications by category'
        
        if (searchTerm) {
            return `Download ${searchTerm} in ${category.name} category. ${apps.length} premium cracked applications with direct download links, virus-free and tested.`
        }
        return `Download ${apps.length}+ premium ${category.name} applications for free. ${category.description || `Best ${category.name} software collection with direct download links, 100% free and safe.`}`
    }

    const getKeywords = () => {
        if (!category) return 'apps, software, download'
        
        const baseKeywords = [
            `${category.name.toLowerCase()} apps`,
            `${category.name.toLowerCase()} software`,
            `free ${category.name.toLowerCase()}`,
            `download ${category.name.toLowerCase()}`,
            `${category.name.toLowerCase()} cracked`,
            `premium ${category.name.toLowerCase()}`
        ]
        
        if (searchTerm) {
            return [...baseKeywords, searchTerm, `${searchTerm} ${category.name.toLowerCase()}`, `${searchTerm} free download`].join(', ')
        }
        
        return [...baseKeywords, 'free download', 'cracked apps', 'premium software', 'direct links'].join(', ')
    }

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-black to-gray-800">
                <div className="text-center space-y-4">
                    <FaSpinner className="text-5xl text-red-500 animate-spin mx-auto" />
                    <h2 className="text-2xl text-white font-bold">Loading Category...</h2>
                    <p className="text-gray-400">Fetching premium applications</p>
                </div>
            </div>
        )
    }

    if (!category) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-black to-gray-800">
                <div className="text-center">
                    <div className="text-6xl mb-6">😔</div>
                    <h1 className="text-3xl font-bold text-white mb-4">Category Not Found</h1>
                    <p className="text-gray-400 mb-8">The requested category doesn't exist or has been moved.</p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link href="/categories">
                            <button className="px-8 py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl transition-all duration-300">
                                Browse Categories
                            </button>
                        </Link>
                        <Link href="/apps">
                            <button className="px-8 py-3 bg-gray-700 hover:bg-gray-600 text-white font-bold rounded-xl transition-all duration-300">
                                All Apps
                            </button>
                        </Link>
                    </div>
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
            <link rel="canonical" href={`https://appscracked.com/category/${category.slug}`} />
            
            {/* Open Graph */}
            <meta property="og:title" content={getPageTitle()} />
            <meta property="og:description" content={getPageDescription()} />
            <meta property="og:type" content="website" />
            <meta property="og:url" content={`https://appscracked.com/category/${category.slug}`} />
            <meta property="og:image" content={`https://appscracked.com/og-category-${category.slug}.jpg`} />
            <meta property="og:site_name" content="AppsCracked" />
            
            {/* Twitter Card */}
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:title" content={getPageTitle()} />
            <meta name="twitter:description" content={getPageDescription()} />
            <meta name="twitter:image" content={`https://appscracked.com/twitter-category-${category.slug}.jpg`} />

            <main className="min-h-screen" itemScope itemType="https://schema.org/CollectionPage">
                {/* Enhanced Breadcrumb */}
                <section className="bg-gradient-to-r from-gray-900/50 to-black/50 border-b border-gray-700/50">
                    <div className="container mx-auto px-4 py-6">
                        <nav className="flex items-center space-x-2 text-sm" itemProp="breadcrumb" itemScope itemType="https://schema.org/BreadcrumbList">
                            <Link href="/" className="flex items-center space-x-1 text-gray-400 hover:text-red-400 transition-colors font-medium" itemProp="itemListElement" itemScope itemType="https://schema.org/ListItem">
                                <FaHome />
                                <span itemProp="name">Home</span>
                                <meta itemProp="position" content="1" />
                            </Link>
                            <span className="text-gray-600">/</span>
                            <Link href="/categories" className="text-gray-400 hover:text-red-400 transition-colors font-medium" itemProp="itemListElement" itemScope itemType="https://schema.org/ListItem">
                                <span itemProp="name">Categories</span>
                                <meta itemProp="position" content="2" />
                            </Link>
                            <span className="text-gray-600">/</span>
                            <span className="text-white font-bold" itemProp="itemListElement" itemScope itemType="https://schema.org/ListItem">
                                <span itemProp="name">{category.name}</span>
                                <meta itemProp="position" content="3" />
                            </span>
                        </nav>

                        <button
                            onClick={() => router.back()}
                            className="flex items-center space-x-2 text-gray-400 hover:text-white mt-4 transition-colors font-medium"
                        >
                            <FaArrowLeft />
                            <span>Back to Categories</span>
                        </button>
                    </div>
                </section>

                {/* Enhanced Category Header */}
                <section className="relative py-20 px-4 bg-gradient-to-br from-gray-900 via-black to-red-900/20">
                    <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-5"></div>
                    
                    <div className="container mx-auto relative z-10 max-w-6xl">
                        <div className="flex flex-col md:flex-row items-center space-y-8 md:space-y-0 md:space-x-8">
                            {/* Category Icon */}
                            <div className="flex-shrink-0">
                                <div 
                                    className="w-32 h-32 rounded-3xl flex items-center justify-center text-6xl shadow-2xl border-4 hover:scale-105 transition-transform duration-300"
                                    style={{ 
                                        background: `linear-gradient(135deg, ${category.color || '#ef4444'}10, ${category.color || '#ef4444'}30)`,
                                        borderColor: `${category.color || '#ef4444'}40`
                                    }}
                                >
                                    <span style={{ color: category.color || '#ef4444' }}>
                                        {category.icon || '📱'}
                                    </span>
                                </div>
                            </div>
                            
                            {/* Category Info */}
                            <div className="flex-1 text-center md:text-left">
                                <div className="flex items-center justify-center md:justify-start space-x-4 mb-4">
                                    <h1 className="text-4xl md:text-6xl lg:text-7xl font-black text-white" itemProp="name">
                                        {category.name}
                                    </h1>
                                    {category.isFeatured && (
                                        <span className="px-4 py-2 bg-gradient-to-r from-yellow-500/20 to-amber-500/20 border border-yellow-500/30 text-yellow-300 text-sm rounded-full font-bold flex items-center space-x-2">
                                            <FaStar className="text-yellow-400" />
                                            <span>FEATURED</span>
                                        </span>
                                    )}
                                </div>
                                
                                <h2 className="text-xl md:text-2xl text-gray-300 mb-4 font-medium" itemProp="description">
                                    {category.description || `Explore premium ${category.name} applications`}
                                </h2>
                                
                                {/* Enhanced Stats */}
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
                                    <div className="text-center p-4 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10">
                                        <div className="text-2xl font-black text-red-400">
                                            {apps.length}
                                        </div>
                                        <div className="text-gray-300 font-medium text-sm">Apps Found</div>
                                    </div>
                                    <div className="text-center p-4 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10">
                                        <div className="text-2xl font-black text-green-400">
                                            {category.appCount || 0}
                                        </div>
                                        <div className="text-gray-300 font-medium text-sm">Total Apps</div>
                                    </div>
                                    <div className="text-center p-4 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10">
                                        <div className="text-2xl font-black text-yellow-400">
                                            100%
                                        </div>
                                        <div className="text-gray-300 font-medium text-sm">Free</div>
                                    </div>
                                    <div className="text-center p-4 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10">
                                        <div className="text-2xl font-black text-purple-400">
                                            4.5★
                                        </div>
                                        <div className="text-gray-300 font-medium text-sm">Avg Rating</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Enhanced Search and Filters */}
                <section className="container mx-auto px-4 py-8">
                    <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm border border-gray-700/40 rounded-2xl p-6">
                        <div className="flex flex-col lg:flex-row gap-6 items-center justify-between">
                            {/* Search */}
                            <div className="relative flex-1 max-w-md">
                                <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-lg" />
                                <input
                                    type="text"
                                    placeholder={`Search ${category.name} apps...`}
                                    value={searchTerm}
                                    onChange={(e) => {
                                        setSearchTerm(e.target.value)
                                        setCurrentPage(1)
                                    }}
                                    className="w-full pl-12 pr-4 py-4 bg-gray-700/50 border border-gray-600/50 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500/50 focus:border-red-500/50 text-lg"
                                />
                            </div>

                            {/* Filters */}
                            <div className="flex items-center space-x-4">
                                <div className="flex items-center space-x-2">
                                    <FaFilter className="text-gray-400" />
                                    <span className="text-gray-400 text-sm font-medium">Filters:</span>
                                </div>
                                
                                {Object.entries({
                                    featured: 'Featured',
                                    popular: 'Popular',
                                    newest: 'Latest'
                                }).map(([key, label]) => (
                                    <button
                                        key={key}
                                        onClick={() => handleFilterChange(key)}
                                        className={`px-4 py-2 rounded-lg text-sm font-bold transition-all duration-300 ${
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
                                    className="bg-gray-700/50 border border-gray-600/50 rounded-lg px-4 py-3 text-white text-sm focus:outline-none focus:ring-2 focus:ring-red-500/50 font-medium min-w-[150px]"
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
                    </div>
                </section>

                {/* Enhanced Apps Grid */}
                <section className="container mx-auto px-4 pb-12" itemProp="mainEntity" itemScope itemType="https://schema.org/ItemList">
                    <meta itemProp="numberOfItems" content={apps.length} />
                    
                    {apps.length > 0 ? (
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
                                                            alt={`${app.name} - Free ${category.name} App Download`}
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
                                            <p className="text-gray-400 text-sm" itemProp="publisher">
                                                {app.developer || 'Premium Developer'}
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
                                                aria-label={`Download ${app.name} for free - Premium ${category.name} app`}
                                            >
                                                <FaDownload className="text-sm group-hover:animate-bounce" />
                                                <span>FREE DOWNLOAD</span>
                                            </button>
                                        </div>

                                        {/* Hidden Schema Data */}
                                        <meta itemProp="description" content={app.description || `Download ${app.name} for free - Premium ${category.name} application with full features unlocked.`} />
                                        <meta itemProp="url" content={`https://appscracked.com/app/${app.slug}`} />
                                        <meta itemProp="downloadUrl" content={`https://appscracked.com/app/${app.slug}`} />
                                        <meta itemProp="applicationCategory" content={category.name} />
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
                        <div className="text-center py-20">
                            <div className="text-8xl mb-8">😔</div>
                            <h3 className="text-4xl font-bold text-white mb-6">No Apps Found</h3>
                            <p className="text-gray-400 mb-10 text-xl max-w-2xl mx-auto leading-relaxed">
                                {searchTerm 
                                    ? `No apps found for "${searchTerm}" in ${category.name}. Try different keywords or browse all apps.`
                                    : `No apps available in ${category.name} category yet. Check back soon for new releases!`
                                }
                            </p>
                            {searchTerm ? (
                                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                    <button
                                        onClick={() => {
                                            setSearchTerm('')
                                            setFilters({ featured: false, popular: false, newest: false })
                                        }}
                                        className="px-8 py-4 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl transition-all duration-300 hover:scale-105"
                                    >
                                        Clear Search
                                    </button>
                                    <Link href="/categories">
                                        <button className="px-8 py-4 bg-gray-700 hover:bg-gray-600 text-white font-bold rounded-xl transition-all duration-300">
                                            Browse Categories
                                        </button>
                                    </Link>
                                </div>
                            ) : (
                                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                    <Link href="/categories">
                                        <button className="px-8 py-4 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl transition-all duration-300 hover:scale-105">
                                            Browse Categories
                                        </button>
                                    </Link>
                                    <Link href="/apps">
                                        <button className="px-8 py-4 bg-gray-700 hover:bg-gray-600 text-white font-bold rounded-xl transition-all duration-300">
                                            All Apps
                                        </button>
                                    </Link>
                                </div>
                            )}
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
                                <span className="text-white font-bold">{apps.length}</span> {category.name} apps
                            </p>
                        </div>
                    </section>
                )}

                {/* CTA Section */}
                <section className="py-16 px-4 bg-gradient-to-r from-red-600/10 to-orange-600/10 border-t border-red-500/20">
                    <div className="container mx-auto text-center max-w-4xl">
                        <div className="flex justify-center mb-6">
                            <div className="relative">
                                <FaGem className="text-4xl text-red-400" />
                                <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                            </div>
                        </div>
                        
                        <h2 className="text-3xl md:text-4xl font-black text-white mb-4">
                            Explore More {category.name} Apps
                        </h2>
                        <p className="text-xl text-gray-300 mb-8">
                            Discover thousands more premium applications in other categories
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link href="/categories">
                                <button className="px-8 py-4 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-bold rounded-xl shadow-xl transition-all duration-300 hover:scale-105">
                                    Browse All Categories
                                </button>
                            </Link>
                            <Link href="/apps">
                                <button className="px-8 py-4 bg-transparent border-2 border-red-500 text-red-400 hover:bg-red-500 hover:text-white font-bold rounded-xl transition-all duration-300">
                                    View All Apps
                                </button>
                            </Link>
                        </div>
                    </div>
                </section>
            </main>
        </>
    )
} 