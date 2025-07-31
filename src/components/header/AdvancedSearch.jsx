'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { 
    FaSearch, FaTimes, FaSpinner, FaAndroid, FaApple, FaGamepad, FaDesktop, 
    FaStar, FaDownload, FaFire, FaClock, FaTag, FaFilter, FaWindows, FaLinux,
    FaCrown, FaGem, FaRocket, FaHeart, FaEye, FaArrowRight
} from 'react-icons/fa'
import { SiMacos } from 'react-icons/si'

const CATEGORIES = [
    { id: 'productivity', name: 'Productivity', icon: '💼', color: 'from-blue-500 to-cyan-500' },
    { id: 'games', name: 'Games', icon: '🎮', color: 'from-purple-500 to-pink-500' },
    { id: 'multimedia', name: 'Multimedia', icon: '🎵', color: 'from-green-500 to-emerald-500' },
    { id: 'design', name: 'Design', icon: '🎨', color: 'from-orange-500 to-red-500' },
    { id: 'development', name: 'Development', icon: '💻', color: 'from-indigo-500 to-purple-500' },
    { id: 'security', name: 'Security', icon: '🔒', color: 'from-gray-500 to-slate-500' },
    { id: 'social', name: 'Social', icon: '💬', color: 'from-pink-500 to-rose-500' },
    { id: 'education', name: 'Education', icon: '📚', color: 'from-yellow-500 to-orange-500' }
]

const PLATFORMS = [
    { id: 'windows', name: 'Windows', icon: FaWindows, color: 'from-blue-500 to-cyan-500' },
    { id: 'macos', name: 'macOS', icon: SiMacos, color: 'from-gray-500 to-slate-500' },
    { id: 'linux', name: 'Linux', icon: FaLinux, color: 'from-yellow-500 to-orange-500' },
    { id: 'android', name: 'Android', icon: FaAndroid, color: 'from-green-500 to-emerald-500' },
    { id: 'ios', name: 'iOS', icon: FaApple, color: 'from-gray-400 to-slate-400' }
]

const PREMIUM_SUGGESTIONS = [
    { name: 'Adobe Creative Suite', type: 'app', rating: 4.9, downloads: '50K+', premium: true },
    { name: 'Microsoft Office 365', type: 'app', rating: 4.8, downloads: '100K+', premium: true },
    { name: 'Spotify Premium APK', type: 'apk', rating: 4.9, downloads: '200K+', premium: true },
    { name: 'YouTube Vanced', type: 'apk', rating: 4.8, downloads: '150K+', premium: true },
    { name: 'TikTok++ IPA', type: 'ipa', rating: 4.7, downloads: '80K+', premium: true },
    { name: 'GTA V Premium', type: 'game', rating: 4.9, downloads: '300K+', premium: true }
]

export default function AdvancedSearch({ onClose }) {
    const [query, setQuery] = useState('')
    const [activeTab, setActiveTab] = useState('all')
    const [selectedCategory, setSelectedCategory] = useState('')
    const [selectedPlatform, setSelectedPlatform] = useState('')
    const [results, setResults] = useState({
        apps: [],
        apks: [],
        ipas: [],
        games: []
    })
    const [loading, setLoading] = useState(false)
    const [showFilters, setShowFilters] = useState(false)
    const [recommendations, setRecommendations] = useState([])
    const [searchHistory, setSearchHistory] = useState([])
    const [trendingSearches, setTrendingSearches] = useState([])
    const searchRef = useRef(null)
    const inputRef = useRef(null)
    const router = useRouter()

    useEffect(() => {
        if (inputRef.current) {
            inputRef.current.focus()
        }
        loadRecommendations()
        loadSearchHistory()
        loadTrendingSearches()
    }, [])

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (searchRef.current && !searchRef.current.contains(event.target)) {
                onClose?.()
            }
        }

        const handleEscape = (event) => {
            if (event.key === 'Escape') {
                onClose?.()
            }
        }

        document.addEventListener('mousedown', handleClickOutside)
        document.addEventListener('keydown', handleEscape)
        return () => {
            document.removeEventListener('mousedown', handleClickOutside)
            document.removeEventListener('keydown', handleEscape)
        }
    }, [onClose])

    useEffect(() => {
        if (query.length >= 2) {
            const timeoutId = setTimeout(() => {
                performSearch(query)
            }, 300)
            return () => clearTimeout(timeoutId)
        } else {
            setResults({ apps: [], apks: [], ipas: [], games: [] })
        }
    }, [query, selectedCategory, selectedPlatform])

    const loadRecommendations = async () => {
        try {
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'
            const response = await fetch(`${apiUrl}/api/v1/apps?limit=6&featured=true`)
            if (response.ok) {
                const data = await response.json()
                setRecommendations(data.data?.apps || [])
            }
        } catch (error) {
            console.error('Error loading recommendations:', error)
        }
    }

    const loadTrendingSearches = async () => {
        try {
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'
            const response = await fetch(`${apiUrl}/api/v1/trending/data`)
            if (response.ok) {
                const data = await response.json()
                // Extract trending items from all platforms
                const trending = []
                if (data.data?.apps) trending.push(...data.data.apps.slice(0, 3))
                if (data.data?.apks) trending.push(...data.data.apks.slice(0, 3))
                if (data.data?.ipas) trending.push(...data.data.ipas.slice(0, 3))
                if (data.data?.games) trending.push(...data.data.games.slice(0, 3))
                setTrendingSearches(trending.slice(0, 8))
            }
        } catch (error) {
            console.error('Error loading trending searches:', error)
        }
    }

    const loadSearchHistory = () => {
        const history = JSON.parse(localStorage.getItem('searchHistory') || '[]')
        setSearchHistory(history.slice(0, 5))
    }

    const addToSearchHistory = (term) => {
        const history = JSON.parse(localStorage.getItem('searchHistory') || '[]')
        const newHistory = [term, ...history.filter(item => item !== term)].slice(0, 10)
        localStorage.setItem('searchHistory', JSON.stringify(newHistory))
        setSearchHistory(newHistory.slice(0, 5))
    }

    const performSearch = async (searchQuery) => {
        if (!searchQuery.trim()) return
        
        setLoading(true)
        addToSearchHistory(searchQuery)
        
        try {
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'
            
            // Usar el endpoint unificado de search
            const response = await fetch(`${apiUrl}/api/v1/search/all?q=${encodeURIComponent(searchQuery)}&limit=20`)
            
            let apps = []
            let apks = []
            let ipas = []
            let games = []
            
            if (response.ok) {
                const data = await response.json()
                if (data.success && data.data) {
                    apps = data.data.apps || []
                    apks = data.data.apks || []
                    ipas = data.data.ipas || []
                    games = data.data.games || []
                }
            }

            setResults({ apps, apks, ipas, games })
            
        } catch (error) {
            console.error('Search error:', error)
            setResults({ apps: [], apks: [], ipas: [], games: [] })
        } finally {
            setLoading(false)
        }
    }

    const handleItemClick = (item, type) => {
        const url = `/${type}/${item.slug}`
        router.push(url)
        onClose?.()
    }

    const handleTrendingClick = (term) => {
        setQuery(term)
    }

    const handleCategoryClick = (categoryId) => {
        setSelectedCategory(selectedCategory === categoryId ? '' : categoryId)
    }

    const handlePlatformClick = (platformId) => {
        setSelectedPlatform(selectedPlatform === platformId ? '' : platformId)
    }

    const getFilteredResults = () => {
        if (activeTab === 'all') {
            return {
                apps: results.apps,
                apks: results.apks,
                ipas: results.ipas,
                games: results.games
            }
        }
        return {
            apps: activeTab === 'apps' ? results.apps : [],
            apks: activeTab === 'apks' ? results.apks : [],
            ipas: activeTab === 'ipas' ? results.ipas : [],
            games: activeTab === 'games' ? results.games : []
        }
    }

    const filteredResults = getFilteredResults()
    const totalResults = filteredResults.apps.length + filteredResults.apks.length + filteredResults.ipas.length + filteredResults.games.length

    return (
        <div ref={searchRef} className="w-full bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden z-50">
            {/* Header */}
            <div className="bg-gradient-to-r from-gray-50 to-gray-100 p-6 border-b border-gray-200">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg">
                            <FaSearch className="text-white text-lg" />
                        </div>
                        <div>
                            <h2 className="text-gray-900 text-xl font-bold">Marketplace Search</h2>
                            <p className="text-gray-500 text-sm">Discover premium apps, games & tools</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="w-8 h-8 bg-gray-100 hover:bg-gray-200 rounded-xl flex items-center justify-center transition-all duration-300 hover:scale-110"
                    >
                        <FaTimes className="text-gray-600 text-sm" />
                    </button>
                </div>

                {/* Search Input */}
                <div className="relative">
                    <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                        <FaSearch className="text-gray-400 text-lg" />
                    </div>
                    <input
                        ref={inputRef}
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Search for apps, games, APKs, IPAs..."
                        className="w-full bg-white border-2 border-gray-200 rounded-xl pl-12 pr-16 py-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all duration-300 text-base"
                    />
                    {loading && (
                        <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                            <FaSpinner className="text-purple-500 animate-spin text-lg" />
                        </div>
                    )}
                    <button
                        onClick={() => setShowFilters(!showFilters)}
                        className={`absolute right-12 top-1/2 transform -translate-y-1/2 p-2 rounded-lg transition-all duration-300 ${
                            showFilters ? 'bg-purple-500 text-white shadow-lg' : 'text-gray-400 hover:text-purple-500 hover:bg-purple-50'
                        }`}
                    >
                        <FaFilter />
                    </button>
                </div>

                {/* Filters */}
                {showFilters && (
                    <div className="mt-4 space-y-4 animate-in slide-in-from-top-2 duration-300">
                        {/* Categories */}
                        <div>
                            <h4 className="text-gray-700 text-sm font-semibold mb-2 flex items-center">
                                <FaTag className="mr-2" />
                                Categories
                            </h4>
                            <div className="flex flex-wrap gap-2">
                                {CATEGORIES.map((category) => (
                                    <button
                                        key={category.id}
                                        onClick={() => handleCategoryClick(category.id)}
                                        className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-300 ${
                                            selectedCategory === category.id
                                                ? 'bg-gradient-to-r ' + category.color + ' text-white shadow-lg scale-105'
                                                : 'bg-white border border-gray-200 text-gray-600 hover:border-purple-300 hover:text-purple-600'
                                        }`}
                                    >
                                        {category.icon} {category.name}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Platforms */}
                        <div>
                            <h4 className="text-gray-700 text-sm font-semibold mb-2 flex items-center">
                                <FaDesktop className="mr-2" />
                                Platforms
                            </h4>
                            <div className="flex flex-wrap gap-2">
                                {PLATFORMS.map((platform) => {
                                    const IconComponent = platform.icon
                                    return (
                                        <button
                                            key={platform.id}
                                            onClick={() => handlePlatformClick(platform.id)}
                                            className={`flex items-center space-x-1 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-300 ${
                                                selectedPlatform === platform.id
                                                    ? 'bg-gradient-to-r ' + platform.color + ' text-white shadow-lg scale-105'
                                                    : 'bg-white border border-gray-200 text-gray-600 hover:border-purple-300 hover:text-purple-600'
                                            }`}
                                        >
                                            <IconComponent className="text-xs" />
                                            <span>{platform.name}</span>
                                        </button>
                                    )
                                })}
                            </div>
                        </div>
                    </div>
                )}

                {/* Tabs */}
                <div className="flex space-x-1 mt-4 bg-gray-100 rounded-lg p-1">
                    {[
                        { id: 'all', name: 'All', icon: FaSearch, color: 'from-purple-500 to-pink-500' },
                        { id: 'apps', name: 'PC Apps', icon: FaDesktop, color: 'from-blue-500 to-cyan-500' },
                        { id: 'apks', name: 'APKs', icon: FaAndroid, color: 'from-green-500 to-emerald-500' },
                        { id: 'ipas', name: 'IPAs', icon: FaApple, color: 'from-gray-500 to-slate-500' },
                        { id: 'games', name: 'Games', icon: FaGamepad, color: 'from-purple-500 to-pink-500' }
                    ].map((tab) => {
                        const IconComponent = tab.icon
                        return (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex items-center space-x-1 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-300 ${
                                    activeTab === tab.id
                                        ? 'bg-gradient-to-r ' + tab.color + ' text-white shadow-lg'
                                        : 'text-gray-600 hover:text-purple-600 hover:bg-white'
                                }`}
                            >
                                <IconComponent className="text-xs" />
                                <span>{tab.name}</span>
                            </button>
                        )
                    })}
                </div>
            </div>

            {/* Content */}
            <div className="max-h-96 overflow-y-auto bg-gray-50">
                {query.length >= 2 ? (
                    <div className="p-6">
                        {totalResults > 0 ? (
                            <div className="space-y-6">
                                {/* Results sections */}
                                {filteredResults.apps.length > 0 && (
                                    <ResultSection
                                        title="PC Applications"
                                        icon={FaDesktop}
                                        color="blue"
                                        items={filteredResults.apps}
                                        onItemClick={(item) => handleItemClick(item, 'app')}
                                    />
                                )}
                                {filteredResults.apks.length > 0 && (
                                    <ResultSection
                                        title="Android APKs"
                                        icon={FaAndroid}
                                        color="green"
                                        items={filteredResults.apks}
                                        onItemClick={(item) => handleItemClick(item, 'apk')}
                                    />
                                )}
                                {filteredResults.ipas.length > 0 && (
                                    <ResultSection
                                        title="iOS IPAs"
                                        icon={FaApple}
                                        color="gray"
                                        items={filteredResults.ipas}
                                        onItemClick={(item) => handleItemClick(item, 'ipa')}
                                    />
                                )}
                                {filteredResults.games.length > 0 && (
                                    <ResultSection
                                        title="Premium Games"
                                        icon={FaGamepad}
                                        color="purple"
                                        items={filteredResults.games}
                                        onItemClick={(item) => handleItemClick(item, 'game')}
                                    />
                                )}
                            </div>
                        ) : (
                            <NoResults query={query} />
                        )}
                    </div>
                ) : (
                    <div className="p-6">
                        {/* Main Grid Layout */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                            
                            {/* Premium Suggestions */}
                            <div className="lg:col-span-2 xl:col-span-1">
                                <div className="flex items-center space-x-2 mb-4">
                                    <div className="w-6 h-6 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-lg flex items-center justify-center">
                                        <FaCrown className="text-white text-xs" />
                                    </div>
                                    <h3 className="text-gray-900 text-lg font-bold">Premium Picks</h3>
                                </div>
                                <div className="space-y-3">
                                    {PREMIUM_SUGGESTIONS.slice(0, 4).map((item, index) => (
                                        <PremiumCard
                                            key={index}
                                            item={item}
                                            onClick={() => handleItemClick(item, item.type)}
                                        />
                                    ))}
                                </div>
                            </div>

                            {/* Trending Searches from API */}
                            {trendingSearches.length > 0 && (
                                <div className="lg:col-span-2 xl:col-span-1">
                                    <div className="flex items-center space-x-2 mb-4">
                                        <div className="w-6 h-6 bg-gradient-to-br from-red-500 to-pink-500 rounded-lg flex items-center justify-center">
                                            <FaFire className="text-white text-xs" />
                                        </div>
                                        <h3 className="text-gray-900 text-lg font-bold">Trending Now</h3>
                                    </div>
                                    <div className="grid grid-cols-2 gap-2">
                                        {trendingSearches.slice(0, 6).map((item, index) => (
                                            <TrendingCard
                                                key={index}
                                                item={item}
                                                onClick={() => handleTrendingClick(item.name)}
                                            />
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Search History & Recommendations */}
                            <div className="lg:col-span-2 xl:col-span-1">
                                {/* Search History */}
                                {searchHistory.length > 0 && (
                                    <div className="mb-6">
                                        <div className="flex items-center space-x-2 mb-4">
                                            <div className="w-6 h-6 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
                                                <FaClock className="text-white text-xs" />
                                            </div>
                                            <h3 className="text-gray-900 text-lg font-bold">Recent Searches</h3>
                                        </div>
                                        <div className="flex flex-wrap gap-2">
                                            {searchHistory.map((term, index) => (
                                                <button
                                                    key={index}
                                                    onClick={() => handleTrendingClick(term)}
                                                    className="px-3 py-1.5 bg-white border border-gray-200 hover:border-purple-300 text-gray-700 hover:text-purple-600 rounded-lg text-xs font-medium transition-all duration-300 hover:shadow-md"
                                                >
                                                    {term}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Recommendations */}
                                {recommendations.length > 0 && (
                                    <div>
                                        <div className="flex items-center space-x-2 mb-4">
                                            <div className="w-6 h-6 bg-gradient-to-br from-green-500 to-emerald-500 rounded-lg flex items-center justify-center">
                                                <FaStar className="text-white text-xs" />
                                            </div>
                                            <h3 className="text-gray-900 text-lg font-bold">Featured Apps</h3>
                                        </div>
                                        <div className="space-y-2">
                                            {recommendations.slice(0, 3).map((item, index) => (
                                                <RecommendationCard
                                                    key={index}
                                                    item={item}
                                                    onClick={() => handleItemClick(item, 'app')}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Quick Navigation */}
                        <div className="mt-8 pt-6 border-t border-gray-200">
                            <h3 className="text-gray-900 text-lg font-bold mb-4 text-center">Quick Navigation</h3>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                {[
                                    { name: 'Browse PC Apps', icon: FaDesktop, color: 'from-blue-500 to-cyan-500', href: '/apps' },
                                    { name: 'Browse APKs', icon: FaAndroid, color: 'from-green-500 to-emerald-500', href: '/apk' },
                                    { name: 'Browse IPAs', icon: FaApple, color: 'from-gray-500 to-slate-500', href: '/ipa' },
                                    { name: 'Browse Games', icon: FaGamepad, color: 'from-purple-500 to-pink-500', href: '/games' }
                                ].map((item, index) => {
                                    const IconComponent = item.icon
                                    return (
                                        <button
                                            key={index}
                                            onClick={() => router.push(item.href)}
                                            className={`flex items-center space-x-2 p-3 bg-white border border-gray-200 rounded-xl hover:border-purple-300 hover:shadow-lg transition-all duration-300 group`}
                                        >
                                            <div className={`w-8 h-8 bg-gradient-to-br ${item.color} rounded-lg flex items-center justify-center`}>
                                                <IconComponent className="text-white text-sm" />
                                            </div>
                                            <span className="text-gray-700 font-medium text-sm group-hover:text-purple-600 transition-colors">
                                                {item.name}
                                            </span>
                                        </button>
                                    )
                                })}
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Footer */}
            <div className="px-6 py-4 bg-white border-t border-gray-100">
                <div className="flex items-center justify-between text-xs">
                    <div className="text-gray-500">
                        Press <kbd className="px-1.5 py-0.5 bg-gray-100 border border-gray-200 rounded text-gray-600 font-mono">ESC</kbd> to close
                    </div>
                    {query.length >= 2 && (
                        <div className="text-gray-700 font-medium">
                            {totalResults} result{totalResults !== 1 ? 's' : ''} found
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

// Premium Card Component
function PremiumCard({ item, onClick }) {
    const getTypeIcon = (type) => {
        switch (type) {
            case 'app': return FaDesktop
            case 'apk': return FaAndroid
            case 'ipa': return FaApple
            case 'game': return FaGamepad
            default: return FaDesktop
        }
    }

    const getTypeColor = (type) => {
        switch (type) {
            case 'app': return 'from-blue-500 to-cyan-500'
            case 'apk': return 'from-green-500 to-emerald-500'
            case 'ipa': return 'from-gray-500 to-slate-500'
            case 'game': return 'from-purple-500 to-pink-500'
            default: return 'from-blue-500 to-cyan-500'
        }
    }

    const IconComponent = getTypeIcon(item.type)
    const colorClass = getTypeColor(item.type)

    return (
        <div
            onClick={onClick}
            className="group relative bg-white border border-gray-200 rounded-xl p-4 cursor-pointer transition-all duration-300 hover:shadow-lg hover:scale-105 hover:border-purple-300"
        >
            <div className="absolute top-2 right-2">
                <FaGem className="text-yellow-500 text-sm" />
            </div>
            
            <div className="flex items-start space-x-3">
                <div className={`w-8 h-8 bg-gradient-to-br ${colorClass} rounded-lg flex items-center justify-center shadow-md`}>
                    <IconComponent className="text-white text-sm" />
                </div>
                <div className="flex-1 min-w-0">
                    <h5 className="text-gray-900 font-bold text-sm truncate group-hover:text-purple-600 transition-colors">
                        {item.name}
                    </h5>
                    <p className="text-gray-500 text-xs capitalize">{item.type}</p>
                    <div className="flex items-center space-x-3 mt-2 text-xs">
                        <div className="flex items-center space-x-1">
                            <FaStar className="text-yellow-400" />
                            <span className="text-gray-700 font-medium">{item.rating}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                            <FaDownload className="text-gray-400" />
                            <span className="text-gray-600">{item.downloads}</span>
                        </div>
                    </div>
                </div>
            </div>
            
            <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <FaArrowRight className="text-purple-500 text-xs" />
            </div>
        </div>
    )
}

// Trending Card Component
function TrendingCard({ item, onClick }) {
    return (
        <button
            onClick={onClick}
            className="group bg-white border border-gray-200 rounded-lg p-3 text-left transition-all duration-300 hover:shadow-md hover:border-purple-300 hover:scale-105"
        >
            <div className="flex items-center space-x-2">
                <div className="text-lg">📱</div>
                <div className="flex-1 min-w-0">
                    <h6 className="text-gray-900 font-semibold text-xs truncate group-hover:text-purple-600 transition-colors">
                        {item.name}
                    </h6>
                    <p className="text-gray-500 text-xs truncate">{item.developer || 'Premium App'}</p>
                </div>
            </div>
        </button>
    )
}

// Result Section Component
function ResultSection({ title, icon: IconComponent, color, items, onItemClick }) {
    const colorClasses = {
        blue: 'text-blue-500 bg-blue-50 border-blue-200',
        green: 'text-green-500 bg-green-50 border-green-200',
        gray: 'text-gray-500 bg-gray-50 border-gray-200',
        purple: 'text-purple-500 bg-purple-50 border-purple-200'
    }

    return (
        <div>
            <div className="flex items-center space-x-2 mb-3">
                <div className={`w-6 h-6 rounded-lg flex items-center justify-center border ${colorClasses[color]}`}>
                    <IconComponent className="text-xs" />
                </div>
                <h4 className="text-gray-900 font-bold text-base">{title}</h4>
                <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full font-medium">
                    {items.length}
                </span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {items.map((item, index) => (
                    <ResultCard
                        key={index}
                        item={item}
                        color={color}
                        onClick={() => onItemClick(item)}
                    />
                ))}
            </div>
        </div>
    )
}

// Result Card Component
function ResultCard({ item, color, onClick }) {
    const colorClasses = {
        blue: 'hover:bg-blue-50 hover:border-blue-300',
        green: 'hover:bg-green-50 hover:border-green-300',
        gray: 'hover:bg-gray-50 hover:border-gray-300',
        purple: 'hover:bg-purple-50 hover:border-purple-300'
    }

    return (
        <div
            onClick={onClick}
            className={`p-3 bg-white border border-gray-200 rounded-lg cursor-pointer transition-all duration-300 ${colorClasses[color]} hover:shadow-md`}
        >
            <div className="flex items-start space-x-3">
                <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                    <span className="text-gray-400 text-xs">IMG</span>
                </div>
                <div className="flex-1 min-w-0">
                    <h5 className="text-gray-900 font-semibold text-sm truncate">{item.name}</h5>
                    <p className="text-gray-500 text-xs truncate">{item.developer}</p>
                    <div className="flex items-center space-x-3 mt-1 text-xs text-gray-500">
                        {item.rating > 0 && (
                            <div className="flex items-center space-x-1">
                                <FaStar className="text-yellow-400" />
                                <span className="font-medium">{item.rating.toFixed(1)}</span>
                            </div>
                        )}
                        <div className="flex items-center space-x-1">
                            <FaDownload className="text-gray-400" />
                            <span className="font-medium">{item.downloads || 0}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

// Recommendation Card Component
function RecommendationCard({ item, onClick }) {
    return (
        <div
            onClick={onClick}
            className="p-3 bg-white border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 hover:border-purple-300 transition-all duration-300"
        >
            <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                    <span className="text-gray-400 text-xs">IMG</span>
                </div>
                <div className="flex-1 min-w-0">
                    <h6 className="text-gray-900 font-semibold truncate text-sm">{item.name}</h6>
                    <p className="text-gray-500 text-xs truncate">{item.developer}</p>
                </div>
                <FaStar className="text-yellow-400 text-sm" />
            </div>
        </div>
    )
}

// No Results Component
function NoResults({ query }) {
    return (
        <div className="text-center py-8">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaSearch className="text-gray-400 text-xl" />
            </div>
            <h3 className="text-gray-900 text-lg font-bold mb-2">No results found</h3>
            <p className="text-gray-600 mb-4 max-w-md mx-auto text-sm">
                We couldn't find anything for "<span className="text-purple-600 font-semibold">{query}</span>"
            </p>
            <div className="text-xs text-gray-500 space-y-1 max-w-md mx-auto">
                <p>• Check your spelling</p>
                <p>• Try more general keywords</p>
                <p>• Use filters to refine your search</p>
            </div>
        </div>
    )
}
