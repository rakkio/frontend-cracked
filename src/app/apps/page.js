'use client'

import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import Head from 'next/head'
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
    FaList
} from 'react-icons/fa'

function AppsContent() {
    const [apps, setApps] = useState([])
    const [categories, setCategories] = useState([])
    const [loading, setLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState('')
    const [selectedCategory, setSelectedCategory] = useState('')
    const [sortBy, setSortBy] = useState('createdAt')
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
                sortBy,
                sortOrder,
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

    // Generate page title and description based on filters
    const getPageTitle = () => {
        if (searchTerm) {
            return `Search Results for "${searchTerm}" | Apps Cracked`
        }
        if (filters.featured) {
            return 'Featured Apps - Premium Downloads | Apps Cracked'
        }
        if (filters.newest) {
            return 'Latest Apps - New Releases | Apps Cracked'
        }
        return 'All Apps - Premium Software Downloads | Apps Cracked'
    }

    const getPageDescription = () => {
        if (searchTerm) {
            return `Search results for "${searchTerm}". Download premium apps, games, and software for free with direct links.`
        }
        if (filters.featured) {
            return 'Browse our featured collection of premium apps. Download the most popular cracked applications with direct links.'
        }
        return `Browse ${apps.length}+ premium applications. Download cracked apps, games, and software for Windows, Mac, Android, and iOS with direct links.`
    }

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <FaSpinner className="text-4xl text-red-500 animate-spin" />
            </div>
        )
    }

    return (
        <>
            <Head>
                <title>{getPageTitle()}</title>
                <meta name="description" content={getPageDescription()} />
                <meta name="keywords" content={`apps, software, downloads, premium, cracked, free, ${searchTerm}, games, utilities, productivity`} />
                <meta property="og:title" content={getPageTitle()} />
                <meta property="og:description" content={getPageDescription()} />
                <meta property="og:type" content="website" />
                <meta name="twitter:card" content="summary" />
                <meta name="twitter:title" content={getPageTitle()} />
                <meta name="twitter:description" content={getPageDescription()} />
                <link rel="canonical" href={`${process.env.NEXT_PUBLIC_SITE_URL || 'https://appscracked.com'}/apps${searchTerm ? `?search=${encodeURIComponent(searchTerm)}` : ''}`} />
                <script type="application/ld+json">
                    {JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "CollectionPage",
                        "name": "Premium Apps Collection",
                        "description": "Complete collection of premium applications for download",
                        "url": `${process.env.NEXT_PUBLIC_SITE_URL || 'https://appscracked.com'}/apps`,
                        "mainEntity": {
                            "@type": "ItemList",
                            "numberOfItems": apps.length,
                            "itemListElement": apps.slice(0, 20).map((app, index) => ({
                                "@type": "SoftwareApplication",
                                "position": index + 1,
                                "name": app.name,
                                "description": app.shortDescription || app.description,
                                "url": `${process.env.NEXT_PUBLIC_SITE_URL || 'https://appscracked.com'}/app/${app.slug}`,
                                "applicationCategory": app.category?.name,
                                "operatingSystem": "Windows, Mac, Android, iOS"
                            }))
                        }
                    })}
                </script>
            </Head>
            
            <div className="min-h-screen">
                {/* Header */}
                <section className="container mx-auto px-4 py-8">
                    <div className="text-center mb-8">
                        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                            {searchTerm ? `Search: "${searchTerm}"` : 'All Applications'}
                        </h1>
                        <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                            {searchTerm 
                                ? `Found ${apps.length} results for your search`
                                : 'Discover and download premium applications from our extensive collection'
                            }
                        </p>
                    </div>
                </section>

                {/* Search and Filters */}
                <section className="container mx-auto px-4 mb-8">
                    <div className="card p-6">
                        {/* Top Row - Search and View Mode */}
                        <div className="flex flex-col lg:flex-row gap-4 items-center justify-between mb-6">
                            <div className="relative flex-1 max-w-xl">
                                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Search applications..."
                                    value={searchTerm}
                                    onChange={(e) => {
                                        setSearchTerm(e.target.value)
                                        setCurrentPage(1)
                                        updateURL({ search: e.target.value })
                                    }}
                                    className="w-full pl-10 pr-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500"
                                />
                            </div>

                            <div className="flex items-center space-x-2">
                                <button
                                    onClick={() => setViewMode('grid')}
                                    className={`p-2 rounded-lg transition-colors ${
                                        viewMode === 'grid' ? 'bg-red-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                                    }`}
                                >
                                    <FaTh />
                                </button>
                                <button
                                    onClick={() => setViewMode('list')}
                                    className={`p-2 rounded-lg transition-colors ${
                                        viewMode === 'list' ? 'bg-red-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                                    }`}
                                >
                                    <FaList />
                                </button>
                            </div>
                        </div>

                        {/* Filters Row */}
                        <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
                            {/* Category Filter */}
                            <div className="flex items-center space-x-2">
                                <span className="text-gray-400 text-sm">Category:</span>
                                <select
                                    value={selectedCategory}
                                    onChange={(e) => handleCategoryChange(e.target.value)}
                                    className="bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
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
                                    <span className="text-gray-400 text-sm">Filters:</span>
                                </div>
                                
                                {Object.entries(filters).map(([key, value]) => (
                                    <button
                                        key={key}
                                        onClick={() => handleFilterChange(key)}
                                        className={`px-3 py-1 rounded-full text-xs font-medium transition-colors capitalize ${
                                            value 
                                                ? 'bg-red-600 text-white' 
                                                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                                        }`}
                                    >
                                        {key === 'topRated' ? 'Top Rated' : key}
                                    </button>
                                ))}
                            </div>

                            {/* Sort */}
                            <div className="flex items-center space-x-2">
                                <FaSort className="text-gray-400" />
                                <select
                                    value={`${sortBy}-${sortOrder}`}
                                    onChange={(e) => {
                                        const [newSortBy, newSortOrder] = e.target.value.split('-')
                                        setSortBy(newSortBy)
                                        setSortOrder(newSortOrder)
                                        setCurrentPage(1)
                                    }}
                                    className="bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                                >
                                    <option value="createdAt-desc">Newest First</option>
                                    <option value="createdAt-asc">Oldest First</option>
                                    <option value="name-asc">Name A-Z</option>
                                    <option value="name-desc">Name Z-A</option>
                                    <option value="downloads-desc">Most Downloaded</option>
                                    <option value="rating-desc">Highest Rated</option>
                                </select>
                            </div>
                        </div>

                        {/* Clear Filters */}
                        {(searchTerm || selectedCategory || Object.values(filters).some(f => f)) && (
                            <div className="mt-4 pt-4 border-t border-gray-700">
                                <button
                                    onClick={clearAllFilters}
                                    className="text-red-400 hover:text-red-300 text-sm font-medium"
                                >
                                    Clear all filters
                                </button>
                            </div>
                        )}
                    </div>
                </section>

                {/* Apps Grid/List */}
                <section className="container mx-auto px-4 mb-12">
                    {apps.length > 0 ? (
                        viewMode === 'grid' ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                {apps.map((app) => (
                                    <div 
                                        key={app._id} 
                                        className="card p-6 group cursor-pointer relative overflow-hidden"
                                        onClick={() => handleAppClick(app)}
                                    >
                                        {app.isHot && (
                                            <div className="absolute top-3 right-3 bg-gradient-to-r from-red-500 to-orange-500 text-white text-xs px-2 py-1 rounded-full font-semibold flex items-center">
                                                <FaFire className="mr-1" />
                                                HOT
                                            </div>
                                        )}
                                        {app.isPremium && (
                                            <div className="absolute top-3 left-3 bg-gradient-to-r from-yellow-500 to-amber-500 text-black text-xs px-2 py-1 rounded-full font-semibold flex items-center">
                                                <FaCrown className="mr-1" />
                                                PRO
                                            </div>
                                        )}
                                        
                                        <div className="text-center mb-4">
                                            {app.images && app.images[0] ? (
                                                <img 
                                                    src={app.images[0]} 
                                                    alt={app.name}
                                                    className="w-16 h-16 mx-auto mb-3 rounded-lg object-cover"
                                                />
                                            ) : (
                                                <div className="w-16 h-16 mx-auto mb-3 bg-gray-700 rounded-lg flex items-center justify-center text-2xl">
                                                    📱
                                                </div>
                                            )}
                                            <h3 className="text-lg font-semibold text-white mb-1">{app.name}</h3>
                                            <p className="text-gray-400 text-sm">{app.category?.name || 'App'}</p>
                                        </div>
                                        
                                        <div className="flex justify-between items-center mb-4 text-sm">
                                            <div className="flex items-center text-yellow-400">
                                                <FaStar className="mr-1" />
                                                {app.rating || '4.5'}
                                            </div>
                                            <div className="text-gray-400">
                                                <FaDownload className="inline mr-1" />
                                                {app.downloads || 0}
                                            </div>
                                        </div>
                                        
                                        <div className="flex justify-between items-center">
                                            <span className="text-gray-400 text-sm">{app.size}</span>
                                            <button 
                                                className="px-4 py-2 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white text-sm font-medium rounded-lg transition-all duration-300"
                                                onClick={(e) => {
                                                    e.stopPropagation()
                                                    handleAppClick(app)
                                                }}
                                            >
                                                <FaEye className="inline mr-1" />
                                                View
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {apps.map((app) => (
                                    <div 
                                        key={app._id} 
                                        className="card p-6 cursor-pointer hover:bg-gray-800/50 transition-colors"
                                        onClick={() => handleAppClick(app)}
                                    >
                                        <div className="flex items-center space-x-6">
                                            {app.images && app.images[0] ? (
                                                <img 
                                                    src={app.images[0]} 
                                                    alt={app.name}
                                                    className="w-16 h-16 rounded-lg object-cover flex-shrink-0"
                                                />
                                            ) : (
                                                <div className="w-16 h-16 bg-gray-700 rounded-lg flex items-center justify-center text-2xl flex-shrink-0">
                                                    📱
                                                </div>
                                            )}
                                            
                                            <div className="flex-1">
                                                <div className="flex items-center space-x-3 mb-2">
                                                    <h3 className="text-xl font-semibold text-white">{app.name}</h3>
                                                    {app.isHot && (
                                                        <span className="bg-gradient-to-r from-red-500 to-orange-500 text-white text-xs px-2 py-1 rounded-full font-semibold flex items-center">
                                                            <FaFire className="mr-1" />
                                                            HOT
                                                        </span>
                                                    )}
                                                    {app.isPremium && (
                                                        <span className="bg-gradient-to-r from-yellow-500 to-amber-500 text-black text-xs px-2 py-1 rounded-full font-semibold flex items-center">
                                                            <FaCrown className="mr-1" />
                                                            PRO
                                                        </span>
                                                    )}
                                                </div>
                                                
                                                <p className="text-gray-400 mb-3 line-clamp-2">
                                                    {app.shortDescription || app.description?.substring(0, 100) + '...'}
                                                </p>
                                                
                                                <div className="flex items-center space-x-6 text-sm">
                                                    <span className="text-gray-300">{app.category?.name}</span>
                                                    <span className="text-gray-300">{app.developer}</span>
                                                    <div className="flex items-center text-yellow-400">
                                                        <FaStar className="mr-1" />
                                                        {app.rating || '4.5'}
                                                    </div>
                                                    <div className="text-gray-400">
                                                        <FaDownload className="inline mr-1" />
                                                        {app.downloads || 0}
                                                    </div>
                                                    <span className="text-gray-400">{app.size}</span>
                                                </div>
                                            </div>
                                            
                                            <button 
                                                className="px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-medium rounded-lg transition-all duration-300 flex items-center space-x-2"
                                                onClick={(e) => {
                                                    e.stopPropagation()
                                                    handleAppClick(app)
                                                }}
                                            >
                                                <FaEye />
                                                <span>View Details</span>
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )
                    ) : (
                        <div className="text-center py-20">
                            <div className="text-6xl mb-4">🔍</div>
                            <h3 className="text-2xl font-semibold text-white mb-2">No apps found</h3>
                            <p className="text-gray-400 mb-6">
                                Try adjusting your search criteria or filters
                            </p>
                            <button
                                onClick={clearAllFilters}
                                className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg"
                            >
                                Clear All Filters
                            </button>
                        </div>
                    )}
                </section>

                {/* Pagination */}
                {totalPages > 1 && (
                    <section className="container mx-auto px-4 mb-12">
                        <div className="flex justify-center items-center space-x-2">
                            <button
                                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                disabled={currentPage === 1}
                                className="px-4 py-2 bg-gray-700 hover:bg-gray-600 disabled:bg-gray-800 disabled:text-gray-500 text-white rounded-lg transition-colors"
                            >
                                Previous
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
                                        className={`px-4 py-2 rounded-lg transition-colors ${
                                            currentPage === pageNum
                                                ? 'bg-red-600 text-white'
                                                : 'bg-gray-700 hover:bg-gray-600 text-white'
                                        }`}
                                    >
                                        {pageNum}
                                    </button>
                                )
                            })}
                            
                            <button
                                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                disabled={currentPage === totalPages}
                                className="px-4 py-2 bg-gray-700 hover:bg-gray-600 disabled:bg-gray-800 disabled:text-gray-500 text-white rounded-lg transition-colors"
                            >
                                Next
                            </button>
                        </div>
                        
                        <div className="text-center mt-4 text-gray-400 text-sm">
                            Page {currentPage} of {totalPages} • {apps.length} apps
                        </div>
                    </section>
                )}
            </div>
        </>
    )
}

// Loading component for Suspense fallback
function AppsPageLoading() {
    return (
        <div className="min-h-screen bg-gray-900">
            <div className="container mx-auto px-4 py-8">
                <div className="flex items-center justify-center min-h-[400px]">
                    <div className="text-center">
                        <FaSpinner className="animate-spin text-4xl text-red-500 mx-auto mb-4" />
                        <p className="text-gray-400">Loading apps...</p>
                    </div>
                </div>
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