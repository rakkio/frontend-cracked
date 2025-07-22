'use client'

import { useState, useEffect, useMemo } from 'react'
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
    FaSort
} from 'react-icons/fa'

export default function CategoriesPage() {
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

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <FaSpinner className="text-4xl text-red-500 animate-spin mx-auto mb-4" />
                    <p className="text-gray-400">Loading categories...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-900 to-black">
            {/* Enhanced Header */}
            <section className="relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-red-600/10 via-purple-600/10 to-blue-600/10"></div>
                <div className="container mx-auto px-4 py-16 relative">
                    <div className="text-center mb-12">
                        <div className="flex justify-center mb-6">
                            <div className="relative">
                                <FaTh className="text-6xl text-transparent bg-gradient-to-r from-red-500 via-purple-500 to-blue-500 bg-clip-text" />
                                <div className="absolute inset-0 blur-xl bg-gradient-to-r from-red-500/30 via-purple-500/30 to-blue-500/30 opacity-50"></div>
                            </div>
                        </div>
                        <h1 className="text-5xl md:text-6xl font-bold mb-6">
                            <span className="bg-gradient-to-r from-white via-gray-100 to-gray-300 bg-clip-text text-transparent">
                                App Categories
                            </span>
                        </h1>
                        <p className="text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed">
                            Explore our comprehensive collection of applications organized by category. 
                            Discover new tools, games, and productivity apps tailored to your needs.
                        </p>
                        
                        {/* Statistics Bar */}
                        <div className="flex flex-wrap justify-center gap-6 mt-8">
                            <div className="text-center">
                                <div className="text-2xl font-bold text-white">{filteredCategories.length}</div>
                                <div className="text-gray-400 text-sm">Categories</div>
                            </div>
                            <div className="text-center">
                                <div className="text-2xl font-bold text-purple-400">
                                    {categories.reduce((sum, c) => sum + (c.appCount || 0), 0)}
                                </div>
                                <div className="text-gray-400 text-sm">Total Apps</div>
                            </div>
                            <div className="text-center">
                                <div className="text-2xl font-bold text-green-400">
                                    {categories.filter(c => c.isFeatured).length}
                                </div>
                                <div className="text-gray-400 text-sm">Featured</div>
                            </div>
                        </div>
                    </div>

                    {/* Enhanced Search and Filters */}
                    <div className="max-w-6xl mx-auto">
                        <div className="flex flex-col lg:flex-row gap-4 items-center mb-8">
                            {/* Search Bar */}
                            <div className="relative flex-1 w-full lg:max-w-md">
                                <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Search categories..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-12 pr-4 py-4 bg-gray-800/50 border border-gray-600/50 rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 backdrop-blur-sm"
                                />
                                {searchTerm && (
                                    <button
                                        onClick={() => setSearchTerm('')}
                                        className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                                    >
                                        <FaTimes />
                                    </button>
                                )}
                            </div>

                            {/* Filters Row */}
                            <div className="flex flex-wrap items-center gap-3">
                                {/* Sort Dropdown */}
                                <select
                                    value={sortBy}
                                    onChange={(e) => {
                                        setSortBy(e.target.value)
                                        updateURL({ sort: e.target.value })
                                    }}
                                    className="px-4 py-2 bg-gray-800/50 border border-gray-600/50 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                                >
                                    <option value="name">Sort by Name</option>
                                    <option value="apps">Sort by App Count</option>
                                    <option value="featured">Featured First</option>
                                </select>

                                {/* Featured Toggle */}
                                <button
                                    onClick={() => {
                                        setShowFeaturedOnly(!showFeaturedOnly)
                                        updateURL({ featured: !showFeaturedOnly ? 'true' : null })
                                    }}
                                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                                        showFeaturedOnly
                                            ? 'bg-purple-600 text-white'
                                            : 'bg-gray-800/50 text-gray-400 hover:text-white border border-gray-600/50'
                                    }`}
                                >
                                    <FaStar className="inline mr-2" />
                                    Featured Only
                                </button>

                                {/* View Mode Toggle */}
                                <div className="flex bg-gray-800/50 rounded-lg border border-gray-600/50 overflow-hidden">
                                    <button
                                        onClick={() => {
                                            setViewMode('grid')
                                            updateURL({ view: 'grid' })
                                        }}
                                        className={`px-3 py-2 text-sm ${
                                            viewMode === 'grid'
                                                ? 'bg-purple-600 text-white'
                                                : 'text-gray-400 hover:text-white'
                                        }`}
                                    >
                                        <FaTh />
                                    </button>
                                    <button
                                        onClick={() => {
                                            setViewMode('list')
                                            updateURL({ view: 'list' })
                                        }}
                                        className={`px-3 py-2 text-sm ${
                                            viewMode === 'list'
                                                ? 'bg-purple-600 text-white'
                                                : 'text-gray-400 hover:text-white'
                                        }`}
                                    >
                                        <FaList />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Categories with Apps */}
            <section className="container mx-auto px-4 pb-12">
                {filteredCategories.length > 0 ? (
                    <div className="space-y-8">
                        {filteredCategories.map((category) => {
                            const apps = categoryApps[category._id] || []
                            const isLoadingApps = appsLoading[category._id]

                            return (
                                <div key={category._id} className="group">
                                    <div className="bg-gradient-to-br from-gray-800/40 via-gray-800/30 to-gray-900/50 backdrop-blur-sm border border-gray-700/40 rounded-2xl p-6 hover:border-purple-500/30 transition-all duration-500 overflow-hidden relative">
                                        {/* Background decoration */}
                                        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-purple-600/5 to-transparent rounded-full blur-2xl"></div>
                                        
                                        {/* Category Header */}
                                        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 relative z-10">
                                            <div className="flex items-center space-x-4 mb-4 md:mb-0">
                                                {/* Category Icon */}
                                                <div 
                                                    className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl shadow-xl group-hover:scale-105 transition-transform duration-300"
                                                    style={{ 
                                                        background: `linear-gradient(135deg, ${category.color || '#8b5cf6'}20, ${category.color || '#8b5cf6'}40)`,
                                                        border: `1px solid ${category.color || '#8b5cf6'}30`
                                                    }}
                                                >
                                                    <span style={{ color: category.color || '#8b5cf6' }}>
                                                        {category.icon || '📱'}
                                                    </span>
                                                </div>
                                                
                                                {/* Category Info */}
                                                <div>
                                                    <div className="flex items-center gap-3 mb-1">
                                                        <h2 className="text-2xl font-bold text-white group-hover:text-purple-300 transition-colors">
                                                            {category.name}
                                                        </h2>
                                                        {category.isFeatured && (
                                                            <span className="px-2 py-1 bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30 text-purple-300 text-xs rounded-full font-medium">
                                                                ★ Featured
                                                            </span>
                                                        )}
                                                    </div>
                                                    <p className="text-gray-400 text-sm mb-1">
                                                        {category.appCount || 0} applications available
                                                    </p>
                                                    {category.description && (
                                                        <p className="text-gray-500 text-sm max-w-2xl">
                                                            {category.description.length > 120 
                                                                ? `${category.description.substring(0, 120)}...` 
                                                                : category.description
                                                            }
                                                        </p>
                                                    )}
                                                </div>
                                            </div>

                                            {/* View All Button */}
                                            <button
                                                onClick={() => handleCategoryClick(category)}
                                                className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-purple-600/20 to-blue-600/20 hover:from-purple-600/30 hover:to-blue-600/30 border border-purple-500/30 text-purple-300 rounded-lg transition-all duration-300 group/btn"
                                            >
                                                <span className="text-sm font-medium">View All</span>
                                                <FaArrowRight className="text-xs group-hover/btn:translate-x-1 transition-transform" />
                                            </button>
                                        </div>

                                        {/* Apps Grid */}
                                        <div className="relative">
                                            {isLoadingApps ? (
                                                <div className="flex items-center justify-center py-8">
                                                    <FaSpinner className="text-purple-500 animate-spin mr-2" />
                                                    <span className="text-gray-400">Loading apps...</span>
                                                </div>
                                            ) : apps.length > 0 ? (
                                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
                                                    {apps.map((app) => (
                                                        <div 
                                                            key={app._id}
                                                            onClick={() => handleAppClick(app)}
                                                            className="bg-gray-800/40 hover:bg-gray-700/50 border border-gray-600/30 hover:border-purple-500/30 rounded-xl p-4 cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-lg group/app"
                                                        >
                                                            {/* App Icon */}
                                                            <div className="w-12 h-12 bg-gradient-to-br from-gray-700 to-gray-800 rounded-lg flex items-center justify-center mb-3 group-hover/app:scale-105 transition-transform">
                                                                {app.images?.[0] ? (
                                                                    <img 
                                                                        src={app.images[0]} 
                                                                        alt={app.name} 
                                                                        className="w-8 h-8 rounded object-cover"
                                                                    />
                                                                ) : (
                                                                    <span className="text-purple-400 text-xl">📱</span>
                                                                )}
                                                            </div>

                                                            {/* App Info */}
                                                            <h3 className="font-medium text-white text-sm mb-2 line-clamp-2 group-hover/app:text-purple-300 transition-colors">
                                                                {app.name}
                                                            </h3>

                                                            {/* App Stats */}
                                                            <div className="flex items-center justify-between text-xs text-gray-400">
                                                                <div className="flex items-center space-x-2">
                                                                    {app.rating && (
                                                                        <div className="flex items-center space-x-1">
                                                                            <FaStar className="text-yellow-500" />
                                                                            <span>{app.rating}</span>
                                                                        </div>
                                                                    )}
                                                                    {app.downloadCount && (
                                                                        <div className="flex items-center space-x-1">
                                                                            <FaDownload className="text-green-500" />
                                                                            <span>{app.downloadCount > 1000 ? `${(app.downloadCount/1000).toFixed(1)}k` : app.downloadCount}</span>
                                                                        </div>
                                                                    )}
                                                                </div>
                                                                
                                                                {/* App Badges */}
                                                                <div className="flex items-center space-x-1">
                                                                    {app.isHot && <FaFire className="text-red-500" />}
                                                                    {app.isPremium && <FaCrown className="text-yellow-500" />}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            ) : (
                                                <div className="text-center py-8 text-gray-500">
                                                    <span className="text-2xl mb-2 block">📦</span>
                                                    <p>No apps available in this category yet</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                ) : (
                    <div className="text-center py-20">
                        <div className="text-6xl mb-6">🔍</div>
                        <h3 className="text-2xl font-semibold text-white mb-4">No categories found</h3>
                        <p className="text-gray-400 mb-8 max-w-md mx-auto">
                            {searchTerm 
                                ? `No categories match your search "${searchTerm}"`
                                : 'No categories are available at the moment'
                            }
                        </p>
                        {searchTerm && (
                            <button
                                onClick={() => setSearchTerm('')}
                                className="px-6 py-3 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white rounded-lg font-medium transition-all"
                            >
                                Clear Search
                            </button>
                        )}
                    </div>
                )}
            </section>

            {/* Enhanced CTA Section */}
            <section className="bg-gradient-to-r from-gray-900/50 via-purple-900/10 to-gray-900/50 backdrop-blur-sm">
                <div className="container mx-auto px-4 py-16">
                    <div className="text-center max-w-4xl mx-auto">
                        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                            Ready to explore?
                        </h2>
                        <p className="text-gray-400 mb-8 text-lg">
                            Discover thousands of applications across all categories. Find the perfect tools for your workflow, entertainment, and productivity needs.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link href="/apps">
                                <button className="px-8 py-4 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-semibold rounded-xl shadow-xl transition-all duration-300 hover:shadow-red-500/25 hover:scale-105">
                                    Browse All Apps
                                </button>
                            </Link>
                            <Link href="/apps?featured=true">
                                <button className="px-8 py-4 bg-transparent border-2 border-purple-500 text-purple-400 hover:bg-purple-500 hover:text-white font-semibold rounded-xl transition-all duration-300 hover:scale-105">
                                    Featured Apps
                                </button>
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
} 