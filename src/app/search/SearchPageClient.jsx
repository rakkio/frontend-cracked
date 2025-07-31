'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { 
    FaSearch, FaFilter, FaSortAmountDown, FaAndroid, FaApple, 
    FaWindows, FaGamepad, FaDownload, FaStar, FaEye, FaTh,
    FaList, FaChevronLeft, FaChevronRight
} from 'react-icons/fa'
import SearchFilters from '@/components/search/SearchFilters'
import SearchResultCard from '@/components/search/SearchResultCard'
import SearchStats from '@/components/search/SearchStats'

export default function SearchPageClient({ 
    query: initialQuery, 
    searchData = { apks: [], ipas: [], apps: [], games: [], totalResults: 0 } 
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
        { id: 'apk', label: 'Android APKs', icon: FaAndroid, color: 'green' },
        { id: 'ipa', label: 'iOS IPAs', icon: FaApple, color: 'gray' },
        { id: 'apps', label: 'PC Apps', icon: FaWindows, color: 'blue' },
        { id: 'games', label: 'Games', icon: FaGamepad, color: 'red' }
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
            apks: Array.isArray(searchData?.apks) ? searchData.apks : [],
            ipas: Array.isArray(searchData?.ipas) ? searchData.ipas : [],
            apps: Array.isArray(searchData?.apps) ? searchData.apps : [],
            games: Array.isArray(searchData?.games) ? searchData.games : []
        }
        
        safeSearchData.apks.forEach(item => {
            results.push({ ...item, platform: 'apk', platformLabel: 'Android APK' })
        })
        
        safeSearchData.ipas.forEach(item => {
            results.push({ ...item, platform: 'ipa', platformLabel: 'iOS IPA' })
        })
        
        safeSearchData.apps.forEach(item => {
            results.push({ ...item, platform: 'apps', platformLabel: 'PC App' })
        })
        
        safeSearchData.games.forEach(item => {
            results.push({ ...item, platform: 'games', platformLabel: 'Game' })
        })
        
        return results
    }

    // Filter results by platform
    const getFilteredResults = () => {
        const allResults = getAllResults()
        
        let filtered = activeFilter === 'all' 
            ? allResults 
            : allResults.filter(item => item.platform === activeFilter)
        
        // Sort results
        filtered.sort((a, b) => {
            switch (sortBy) {
                case 'downloads':
                    return (b.downloads || 0) - (a.downloads || 0)
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
    const paginatedResults = filteredResults.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    )

    // Handle search
    const handleSearch = (e) => {
        e.preventDefault()
        if (query.trim()) {
            setIsLoading(true)
            router.push(`/search?q=${encodeURIComponent(query.trim())}`)
        }
    }

    // Handle filter change
    const handleFilterChange = (filter) => {
        setActiveFilter(filter)
        setCurrentPage(1)
    }

    // Get platform colors
    const getPlatformColors = (platform) => {
        const colors = {
            apk: { bg: 'from-green-600 to-emerald-600', text: 'text-green-400', border: 'border-green-500/30' },
            ipa: { bg: 'from-gray-600 to-slate-600', text: 'text-gray-400', border: 'border-gray-500/30' },
            apps: { bg: 'from-blue-600 to-cyan-600', text: 'text-blue-400', border: 'border-blue-500/30' },
            games: { bg: 'from-red-600 to-orange-600', text: 'text-red-400', border: 'border-red-500/30' },
            all: { bg: 'from-purple-600 to-pink-600', text: 'text-purple-400', border: 'border-purple-500/30' }
        }
        return colors[platform] || colors.all
    }

    const activePlatform = platforms.find(p => p.id === activeFilter)
    const colors = getPlatformColors(activeFilter)

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-black">
            {/* Search Header */}
            <div className="bg-black/40 backdrop-blur-sm border-b border-gray-800 sticky top-0 z-50">
                <div className="container mx-auto px-4 py-6">
                    {/* Search Bar */}
                    <form onSubmit={handleSearch} className="max-w-4xl mx-auto mb-6">
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none">
                                <FaSearch className="text-gray-400 text-xl" />
                            </div>
                            <input
                                type="text"
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                placeholder="Search for apps, games, APKs, IPAs..."
                                className="w-full pl-16 pr-32 py-4 text-lg bg-gray-900/50 backdrop-blur-sm border-2 border-gray-700 rounded-xl text-white placeholder-gray-400 focus:border-purple-500 focus:outline-none transition-all duration-300"
                            />
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="absolute inset-y-0 right-0 mr-2 px-6 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-bold rounded-lg transition-all duration-300 hover:scale-105 flex items-center gap-2 disabled:opacity-50"
                            >
                                {isLoading ? 'Searching...' : 'Search'}
                            </button>
                        </div>
                    </form>

                    {/* Platform Filters */}
                    <div className="flex flex-wrap justify-center gap-2 mb-4">
                        {platforms.map((platform) => {
                            const platformColors = getPlatformColors(platform.id)
                            const isActive = activeFilter === platform.id
                            
                            return (
                                <button
                                    key={platform.id}
                                    onClick={() => handleFilterChange(platform.id)}
                                    className={`
                                        flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-all duration-300
                                        ${isActive 
                                            ? `bg-gradient-to-r ${platformColors.bg} text-white shadow-lg scale-105` 
                                            : 'bg-gray-800/50 text-gray-400 hover:text-white hover:bg-gray-700/50 hover:scale-105'
                                        }
                                    `}
                                >
                                    <platform.icon />
                                    <span className="hidden sm:inline">{platform.label}</span>
                                    <span className="text-xs bg-black/30 px-2 py-1 rounded-full">
                                        {platform.id === 'all' 
                                            ? (searchData?.totalResults || 0)
                                            : (() => {
                                                // Map platform IDs to searchData keys
                                                const dataKey = platform.id === 'apk' ? 'apks' 
                                                    : platform.id === 'ipa' ? 'ipas'
                                                    : platform.id === 'apps' ? 'apps'
                                                    : platform.id === 'games' ? 'games'
                                                    : platform.id
                                                return Array.isArray(searchData?.[dataKey]) ? searchData[dataKey].length : 0
                                            })()
                                        }
                                    </span>
                                </button>
                            )
                        })}
                    </div>

                    {/* Search Stats & Controls */}
                    <div className="flex flex-wrap items-center justify-between gap-4">
                        <SearchStats 
                            query={initialQuery}
                            totalResults={filteredResults.length}
                            platform={activePlatform}
                        />
                        
                        <div className="flex items-center gap-4">
                            {/* Sort Dropdown */}
                            <div className="relative">
                                <select
                                    value={sortBy}
                                    onChange={(e) => setSortBy(e.target.value)}
                                    className="bg-gray-800/50 border border-gray-700 rounded-lg px-4 py-2 text-white text-sm focus:outline-none focus:border-gray-600"
                                >
                                    {sortOptions.map(option => (
                                        <option key={option.id} value={option.id}>
                                            {option.label}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* View Mode Toggle */}
                            <div className="flex bg-gray-800/50 border border-gray-700 rounded-lg overflow-hidden">
                                <button
                                    onClick={() => setViewMode('grid')}
                                    className={`p-2 ${viewMode === 'grid' ? 'bg-purple-600 text-white' : 'text-gray-400 hover:text-white'}`}
                                >
                                    <FaTh />
                                </button>
                                <button
                                    onClick={() => setViewMode('list')}
                                    className={`p-2 ${viewMode === 'list' ? 'bg-purple-600 text-white' : 'text-gray-400 hover:text-white'}`}
                                >
                                    <FaList />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Search Results */}
            <div className="container mx-auto px-4 py-8">
                {initialQuery && filteredResults.length === 0 ? (
                    // No Results
                    <div className="text-center py-20">
                        <div className="w-32 h-32 mx-auto mb-6 bg-gradient-to-r from-gray-700 to-gray-800 rounded-full flex items-center justify-center">
                            <FaSearch className="text-gray-400 text-4xl" />
                        </div>
                        <h2 className="text-2xl font-bold text-white mb-4">No results found</h2>
                        <p className="text-gray-400 mb-8">
                            No results found for "{initialQuery}" in {activePlatform.label.toLowerCase()}
                        </p>
                        <button
                            onClick={() => setActiveFilter('all')}
                            className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-lg hover:scale-105 transition-all duration-300"
                        >
                            Search All Platforms
                        </button>
                    </div>
                ) : (
                    <>
                        {/* Results Grid/List */}
                        <div className={`
                            ${viewMode === 'grid' 
                                ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6' 
                                : 'space-y-4'
                            }
                        `}>
                            {paginatedResults.map((item, index) => (
                                <SearchResultCard 
                                    key={`${item.platform}-${item._id || item.id || index}`}
                                    item={item}
                                    viewMode={viewMode}
                                    colors={getPlatformColors(item.platform)}
                                />
                            ))}
                        </div>

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <div className="flex justify-center items-center gap-4 mt-12">
                                <button
                                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                    disabled={currentPage === 1}
                                    className="flex items-center gap-2 px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-lg text-gray-400 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <FaChevronLeft />
                                    Previous
                                </button>
                                
                                <div className="flex gap-2">
                                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                                        <button
                                            key={page}
                                            onClick={() => setCurrentPage(page)}
                                            className={`
                                                w-10 h-10 rounded-lg font-semibold transition-all duration-300
                                                ${currentPage === page 
                                                    ? `bg-gradient-to-r ${colors.bg} text-white` 
                                                    : 'bg-gray-800/50 border border-gray-700 text-gray-400 hover:text-white'
                                                }
                                            `}
                                        >
                                            {page}
                                        </button>
                                    ))}
                                </div>

                                <button
                                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                    disabled={currentPage === totalPages}
                                    className="flex items-center gap-2 px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-lg text-gray-400 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Next
                                    <FaChevronRight />
                                </button>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    )
}
