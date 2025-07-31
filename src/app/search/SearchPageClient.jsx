'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { 
    FaSearch, FaFilter, FaSortAmountDown, FaAndroid, FaApple, 
    FaWindows, FaGamepad, FaDownload, FaStar, FaEye, FaTh,
    FaList, FaChevronLeft, FaChevronRight, FaDesktop
} from 'react-icons/fa'
import SearchFilters from '@/components/search/SearchFilters'
import SearchResultCard from '@/components/search/SearchResultCard'
import SearchStats from '@/components/search/SearchStats'

export default function SearchPageClient({ 
    query: initialQuery, 
    searchData = { 
        data: { apps: [], apks: [], ipas: [], games: [], all: [] },
        stats: { total: 0, apps: 0, apks: 0, ipas: 0, games: 0 },
        query: ''
    } 
}) {
    const router = useRouter()
    const searchParams = useSearchParams()
    const [query, setQuery] = useState(initialQuery)
    const [activeFilter, setActiveFilter] = useState('all')
    const [sortBy, setSortBy] = useState('relevance')
    const [viewMode, setViewMode] = useState('grid')
    const [showFilters, setShowFilters] = useState(false)
    const [currentPage, setCurrentPage] = useState(1)
    const [isLoading, setIsLoading] = useState(false)

    const itemsPerPage = 12

    // Platform configurations
    const platforms = [
        { id: 'all', label: 'All Results', icon: FaSearch, color: 'purple' },
        { id: 'app', label: 'PC Apps', icon: FaDesktop, color: 'blue' },
        { id: 'apk', label: 'Android APKs', icon: FaAndroid, color: 'green' },
        { id: 'ipa', label: 'iOS IPAs', icon: FaApple, color: 'gray' },
        { id: 'game', label: 'PC Games', icon: FaGamepad, color: 'red' }
    ]

    const sortOptions = [
        { id: 'relevance', label: 'Relevance' },
        { id: 'downloads', label: 'Most Downloaded' },
        { id: 'rating', label: 'Highest Rated' },
        { id: 'newest', label: 'Newest First' },
        { id: 'name', label: 'Name A-Z' }
    ]

    // Combine all results with platform info
    const getAllResults = () => {
        const results = []
        
        // Ensure searchData exists and has arrays
        const safeSearchData = {
            apps: Array.isArray(searchData?.data?.apps) ? searchData.data.apps : [],
            apks: Array.isArray(searchData?.data?.apks) ? searchData.data.apks : [],
            ipas: Array.isArray(searchData?.data?.ipas) ? searchData.data.ipas : [],
            games: Array.isArray(searchData?.data?.games) ? searchData.data.games : []
        }
        
        safeSearchData.apps.forEach(item => {
            results.push({ ...item, platform: 'app', platformLabel: 'PC App' })
        })
        
        safeSearchData.apks.forEach(item => {
            results.push({ ...item, platform: 'apk', platformLabel: 'Android APK' })
        })
        
        safeSearchData.ipas.forEach(item => {
            results.push({ ...item, platform: 'ipa', platformLabel: 'iOS IPA' })
        })
        
        safeSearchData.games.forEach(item => {
            results.push({ ...item, platform: 'game', platformLabel: 'PC Game' })
        })
        
        return results
    }

    // Filter results by platform
    const getFilteredResults = () => {
        const allResults = getAllResults()
        
        let filtered = activeFilter === 'all' 
            ? allResults 
            : allResults.filter(item => item.type === activeFilter)
        
        // Sort results
        filtered.sort((a, b) => {
            switch (sortBy) {
                case 'downloads':
                    return (b.downloads || b.downloadCount || 0) - (a.downloads || a.downloadCount || 0)
                case 'rating':
                    return (b.rating || 0) - (a.rating || 0)
                case 'newest':
                    return new Date(b.createdAt || 0) - new Date(a.createdAt || 0)
                case 'name':
                    return (a.name || '').localeCompare(b.name || '')
                default:
                    return 0
            }
        })
        
        return filtered
    }

    const filteredResults = getFilteredResults()
    const totalPages = Math.ceil(filteredResults.length / itemsPerPage)
    const startIndex = (currentPage - 1) * itemsPerPage
    const endIndex = startIndex + itemsPerPage
    const currentResults = filteredResults.slice(startIndex, endIndex)

    const handleSearch = (e) => {
        e.preventDefault()
        if (query.trim()) {
            router.push(`/search?q=${encodeURIComponent(query.trim())}`)
        }
    }

    const handleFilterChange = (filter) => {
        setActiveFilter(filter)
        setCurrentPage(1)
    }

    const getPlatformColors = (platform) => {
        switch (platform) {
            case 'app':
                return {
                    bg: 'from-blue-500 to-blue-600',
                    text: 'text-blue-500',
                    border: 'border-blue-200',
                    hover: 'hover:bg-blue-50'
                }
            case 'apk':
                return {
                    bg: 'from-green-500 to-green-600',
                    text: 'text-green-500',
                    border: 'border-green-200',
                    hover: 'hover:bg-green-50'
                }
            case 'ipa':
                return {
                    bg: 'from-gray-500 to-gray-600',
                    text: 'text-gray-500',
                    border: 'border-gray-200',
                    hover: 'hover:bg-gray-50'
                }
            case 'game':
                return {
                    bg: 'from-red-500 to-red-600',
                    text: 'text-red-500',
                    border: 'border-red-200',
                    hover: 'hover:bg-red-50'
                }
            default:
                return {
                    bg: 'from-purple-500 to-purple-600',
                    text: 'text-purple-500',
                    border: 'border-purple-200',
                    hover: 'hover:bg-purple-50'
                }
        }
    }

    const getPlatformIcon = (platform) => {
        switch (platform) {
            case 'app': return FaDesktop
            case 'apk': return FaAndroid
            case 'ipa': return FaApple
            case 'game': return FaGamepad
            default: return FaSearch
        }
    }

    const formatNumber = (num) => {
        if (num >= 1000000) {
            return (num / 1000000).toFixed(1) + 'M'
        } else if (num >= 1000) {
            return (num / 1000).toFixed(1) + 'K'
        }
        return num.toString()
    }

    const getCategorySlug = (type) => {
        switch (type) {
            case 'app': return 'app'
            case 'apk': return 'apk'
            case 'ipa': return 'ipa'
            case 'game': return 'games'
            default: return 'apps'
        }
    }

    // No results state
    if (!query || searchData.stats.total === 0) {
        return (
            <div className="container mx-auto px-4 py-12">
                <div className="text-center">
                    <div className="w-24 h-24 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <FaSearch className="text-4xl text-blue-500" />
                    </div>
                    <h2 className="text-3xl font-bold text-gray-800 mb-4">
                        {!query ? 'Start Your Search' : 'No Results Found'}
                    </h2>
                    <p className="text-gray-600 text-lg mb-8 max-w-2xl mx-auto">
                        {!query 
                            ? 'Search across our vast collection of premium software, games, and applications'
                            : `No results found for "${query}". Try different keywords or browse our categories.`
                        }
                    </p>
                    
                    {!query && (
                        <div className="max-w-2xl mx-auto">
                            <form onSubmit={handleSearch} className="flex gap-4">
                                <input
                                    type="text"
                                    value={query}
                                    onChange={(e) => setQuery(e.target.value)}
                                    placeholder="Search for apps, games, APKs, IPAs..."
                                    className="flex-1 px-6 py-4 text-lg bg-white border-2 border-gray-200 rounded-2xl focus:border-blue-500 focus:outline-none transition-all duration-300"
                                />
                                <button
                                    type="submit"
                                    className="px-8 py-4 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-bold rounded-2xl hover:from-blue-600 hover:to-indigo-700 transition-all duration-300 flex items-center gap-2"
                                >
                                    <FaSearch />
                                    Search
                                </button>
                            </form>
                        </div>
                    )}
                </div>
            </div>
        )
    }

    return (
        <div className="container mx-auto px-4 py-12">
            {/* Search Header */}
            <div className="mb-8">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-800 mb-2">
                            Search Results for "{query}"
                        </h2>
                        <p className="text-gray-600">
                            Found {searchData.stats.total} results across all platforms
                        </p>
                    </div>
                    
                    {/* Search Form */}
                    <form onSubmit={handleSearch} className="flex gap-2">
                        <input
                            type="text"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder="Search again..."
                            className="px-4 py-2 bg-white border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-all duration-300"
                        />
                        <button
                            type="submit"
                            className="px-6 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-bold rounded-xl hover:from-blue-600 hover:to-indigo-700 transition-all duration-300"
                        >
                            <FaSearch />
                        </button>
                    </form>
                </div>

                {/* Filters and Stats */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <SearchStats stats={searchData.stats} />
                    
                    <div className="flex items-center gap-4">
                        {/* Platform Filters */}
                        <div className="flex gap-2">
                            {platforms.map((platform) => (
                                <button
                                    key={platform.id}
                                    onClick={() => handleFilterChange(platform.id)}
                                    className={`
                                        flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all duration-300
                                        ${activeFilter === platform.id 
                                            ? `bg-gradient-to-r ${getPlatformColors(platform.id).bg} text-white shadow-lg` 
                                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                        }
                                    `}
                                >
                                    <platform.icon className="text-sm" />
                                    {platform.label}
                                </button>
                            ))}
                        </div>

                        {/* Sort and View */}
                        <div className="flex items-center gap-2">
                            <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                                className="px-3 py-2 bg-white border border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none"
                            >
                                {sortOptions.map(option => (
                                    <option key={option.id} value={option.id}>
                                        {option.label}
                                    </option>
                                ))}
                            </select>

                            <div className="flex bg-gray-100 rounded-lg p-1">
                                <button
                                    onClick={() => setViewMode('grid')}
                                    className={`p-2 rounded ${viewMode === 'grid' ? 'bg-white shadow' : 'text-gray-500'}`}
                                >
                                    <FaTh />
                                </button>
                                <button
                                    onClick={() => setViewMode('list')}
                                    className={`p-2 rounded ${viewMode === 'list' ? 'bg-white shadow' : 'text-gray-500'}`}
                                >
                                    <FaList />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Results Grid */}
            {currentResults.length > 0 ? (
                <div className={`
                    grid gap-6
                    ${viewMode === 'grid' 
                        ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' 
                        : 'grid-cols-1'
                    }
                `}>
                    {currentResults.map((item, index) => (
                        <SearchResultCard
                            key={item._id || item.id || index}
                            item={item}
                            viewMode={viewMode}
                            getPlatformColors={getPlatformColors}
                            getPlatformIcon={getPlatformIcon}
                            formatNumber={formatNumber}
                            getCategorySlug={getCategorySlug}
                        />
                    ))}
                </div>
            ) : (
                <div className="text-center py-12">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <FaSearch className="text-2xl text-gray-400" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">No results found</h3>
                    <p className="text-gray-600">Try adjusting your filters or search terms</p>
                </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex justify-center mt-12">
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                            disabled={currentPage === 1}
                            className="p-2 rounded-lg bg-white border border-gray-200 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <FaChevronLeft />
                        </button>
                        
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                            <button
                                key={page}
                                onClick={() => setCurrentPage(page)}
                                className={`
                                    px-4 py-2 rounded-lg font-medium transition-all duration-300
                                    ${currentPage === page 
                                        ? 'bg-blue-500 text-white' 
                                        : 'bg-white border border-gray-200 hover:bg-gray-50'
                                    }
                                `}
                            >
                                {page}
                            </button>
                        ))}
                        
                        <button
                            onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                            disabled={currentPage === totalPages}
                            className="p-2 rounded-lg bg-white border border-gray-200 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <FaChevronRight />
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}
