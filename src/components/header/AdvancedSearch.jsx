'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { 
    FaSearch, FaTimes, FaSpinner, FaAndroid, FaApple, FaGamepad, FaDesktop, 
    FaStar, FaDownload, FaFire, FaClock, FaTag, FaFilter, FaWindows, FaLinux 
} from 'react-icons/fa'
import { SiMacos } from 'react-icons/si'

const CATEGORIES = [
    { id: 'productivity', name: 'Productividad', icon: '💼' },
    { id: 'games', name: 'Juegos', icon: '🎮' },
    { id: 'multimedia', name: 'Multimedia', icon: '🎵' },
    { id: 'design', name: 'Diseño', icon: '🎨' },
    { id: 'development', name: 'Desarrollo', icon: '💻' },
    { id: 'security', name: 'Seguridad', icon: '🔒' },
    { id: 'social', name: 'Social', icon: '💬' },
    { id: 'education', name: 'Educación', icon: '📚' }
]

const PLATFORMS = [
    { id: 'windows', name: 'Windows', icon: FaWindows, color: 'text-blue-400' },
    { id: 'macos', name: 'macOS', icon: SiMacos, color: 'text-gray-300' },
    { id: 'linux', name: 'Linux', icon: FaLinux, color: 'text-yellow-400' },
    { id: 'android', name: 'Android', icon: FaAndroid, color: 'text-green-400' },
    { id: 'ios', name: 'iOS', icon: FaApple, color: 'text-gray-300' }
]

const TRENDING_SEARCHES = [
    'Adobe Photoshop', 'WhatsApp', 'Spotify', 'Discord', 'Telegram',
    'VLC Media Player', 'OBS Studio', 'Steam', 'Chrome', 'Firefox'
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
    const searchRef = useRef(null)
    const inputRef = useRef(null)
    const router = useRouter()

    useEffect(() => {
        if (inputRef.current) {
            inputRef.current.focus()
        }
        loadRecommendations()
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

    const performSearch = async (searchQuery) => {
        if (!searchQuery.trim()) return
        
        setLoading(true)
        console.log('🔍 Advanced search:', { query: searchQuery, category: selectedCategory, platform: selectedPlatform })
        
        try {
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'
            
            const buildUrl = (endpoint, type) => {
                const params = new URLSearchParams({
                    q: searchQuery,
                    limit: '8'
                })
                if (selectedCategory) params.append('category', selectedCategory)
                if (selectedPlatform && type !== 'games') params.append('platform', selectedPlatform)
                return `${apiUrl}/api/v1/${endpoint}/search?${params}`
            }

            // Simplificar para probar solo apps primero
            console.log('🔍 Searching apps with URL:', `${apiUrl}/api/v1/apps/search?q=${encodeURIComponent(searchQuery)}&limit=8`)
            
            const appsResponse = await fetch(`${apiUrl}/api/v1/apps/search?q=${encodeURIComponent(searchQuery)}&limit=8`)
            console.log('📡 Apps response status:', appsResponse.status, appsResponse.statusText)
            
            let apps = []
            if (appsResponse.ok) {
                const appsData = await appsResponse.json()
                console.log('📡 Apps data:', appsData)
                apps = appsData.success && appsData.data ? appsData.data.apps || [] : []
            }
            
            // Por ahora solo apps, luego agregaremos el resto
            const apks = []
            const ipas = []
            const games = []

            setResults({ apps, apks, ipas, games })
            
        } catch (error) {
            console.error('💥 Search error:', error)
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
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 px-4">
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/80" />
            
            {/* Search Container */}
            <div ref={searchRef} className="relative w-full max-w-4xl bg-gray-900 rounded-2xl shadow-2xl border border-gray-700 overflow-hidden">
                {/* Header */}
                <div className="bg-gradient-to-r from-red-600 via-red-500 to-orange-500 p-6">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-3">
                            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                                <FaSearch className="text-white text-xl" />
                            </div>
                            <div>
                                <h2 className="text-white text-2xl font-bold">Buscar Contenido</h2>
                                <p className="text-white/80 text-sm">Encuentra apps, juegos, APKs e IPAs</p>
                            </div>
                        </div>
                        <button
                            onClick={onClose}
                            className="w-10 h-10 bg-white/20 hover:bg-white/30 rounded-xl flex items-center justify-center transition-colors"
                        >
                            <FaTimes className="text-white text-lg" />
                        </button>
                    </div>

                    {/* Search Input */}
                    <div className="relative">
                        <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                            <FaSearch className="text-white/60 text-lg" />
                        </div>
                        <input
                            ref={inputRef}
                            type="text"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder="Buscar por nombre, desarrollador, categoría..."
                            className="w-full bg-white/20 border border-white/30 rounded-xl pl-12 pr-16 py-4 text-white placeholder-white/60 focus:outline-none focus:border-white/50 focus:bg-white/30 transition-all text-lg"
                        />
                        {loading && (
                            <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                                <FaSpinner className="text-white animate-spin text-lg" />
                            </div>
                        )}
                        <button
                            onClick={() => setShowFilters(!showFilters)}
                            className={`absolute right-12 top-1/2 transform -translate-y-1/2 p-2 rounded-lg transition-colors ${
                                showFilters ? 'bg-white/30 text-white' : 'text-white/60 hover:text-white hover:bg-white/20'
                            }`}
                        >
                            <FaFilter />
                        </button>
                    </div>

                    {/* Filters */}
                    {showFilters && (
                        <div className="mt-4 space-y-3">
                            {/* Categories */}
                            <div>
                                <h4 className="text-white text-sm font-medium mb-2">Categorías</h4>
                                <div className="flex flex-wrap gap-2">
                                    {CATEGORIES.map((category) => (
                                        <button
                                            key={category.id}
                                            onClick={() => handleCategoryClick(category.id)}
                                            className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${
                                                selectedCategory === category.id
                                                    ? 'bg-white text-red-600 font-medium'
                                                    : 'bg-white/20 text-white hover:bg-white/30'
                                            }`}
                                        >
                                            {category.icon} {category.name}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Platforms */}
                            <div>
                                <h4 className="text-white text-sm font-medium mb-2">Plataformas</h4>
                                <div className="flex flex-wrap gap-2">
                                    {PLATFORMS.map((platform) => {
                                        const IconComponent = platform.icon
                                        return (
                                            <button
                                                key={platform.id}
                                                onClick={() => handlePlatformClick(platform.id)}
                                                className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg text-sm transition-colors ${
                                                    selectedPlatform === platform.id
                                                        ? 'bg-white text-gray-900 font-medium'
                                                        : 'bg-white/20 text-white hover:bg-white/30'
                                                }`}
                                            >
                                                <IconComponent className="text-sm" />
                                                <span>{platform.name}</span>
                                            </button>
                                        )
                                    })}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Tabs */}
                    <div className="flex space-x-1 mt-4 bg-white/20 rounded-lg p-1">
                        {[
                            { id: 'all', name: 'Todo', icon: FaSearch },
                            { id: 'apps', name: 'Apps PC', icon: FaDesktop },
                            { id: 'apks', name: 'APKs', icon: FaAndroid },
                            { id: 'ipas', name: 'IPAs', icon: FaApple },
                            { id: 'games', name: 'Juegos', icon: FaGamepad }
                        ].map((tab) => {
                            const IconComponent = tab.icon
                            return (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                                        activeTab === tab.id
                                            ? 'bg-white text-red-600'
                                            : 'text-white hover:bg-white/20'
                                    }`}
                                >
                                    <IconComponent className="text-sm" />
                                    <span>{tab.name}</span>
                                </button>
                            )
                        })}
                    </div>
                </div>

                {/* Content */}
                <div className="max-h-96 overflow-y-auto">
                    {query.length >= 2 ? (
                        <div className="p-6">
                            {totalResults > 0 ? (
                                <div className="space-y-6">
                                    {/* Results sections */}
                                    {filteredResults.apps.length > 0 && (
                                        <ResultSection
                                            title="Aplicaciones PC"
                                            icon={FaDesktop}
                                            color="blue"
                                            items={filteredResults.apps}
                                            onItemClick={(item) => handleItemClick(item, 'app')}
                                        />
                                    )}
                                    {filteredResults.apks.length > 0 && (
                                        <ResultSection
                                            title="APKs Android"
                                            icon={FaAndroid}
                                            color="green"
                                            items={filteredResults.apks}
                                            onItemClick={(item) => handleItemClick(item, 'apk')}
                                        />
                                    )}
                                    {filteredResults.ipas.length > 0 && (
                                        <ResultSection
                                            title="IPAs iOS"
                                            icon={FaApple}
                                            color="gray"
                                            items={filteredResults.ipas}
                                            onItemClick={(item) => handleItemClick(item, 'ipa')}
                                        />
                                    )}
                                    {filteredResults.games.length > 0 && (
                                        <ResultSection
                                            title="Juegos PC"
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
                            {/* Trending Searches */}
                            <div className="mb-8">
                                <div className="flex items-center space-x-2 mb-4">
                                    <FaFire className="text-orange-500" />
                                    <h3 className="text-white font-semibold">Búsquedas Populares</h3>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {TRENDING_SEARCHES.map((term) => (
                                        <button
                                            key={term}
                                            onClick={() => handleTrendingClick(term)}
                                            className="px-3 py-2 bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white rounded-lg text-sm transition-colors"
                                        >
                                            {term}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Recommendations */}
                            {recommendations.length > 0 && (
                                <div>
                                    <div className="flex items-center space-x-2 mb-4">
                                        <FaStar className="text-yellow-500" />
                                        <h3 className="text-white font-semibold">Recomendados</h3>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                        {recommendations.slice(0, 4).map((item, index) => (
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
                    )}
                </div>

                {/* Footer */}
                <div className="px-6 py-4 bg-gray-800 border-t border-gray-700">
                    <div className="flex items-center justify-between text-sm">
                        <div className="text-gray-400">
                            Presiona <kbd className="px-2 py-1 bg-gray-700 border border-gray-600 rounded text-gray-300">ESC</kbd> para cerrar
                        </div>
                        {query.length >= 2 && (
                            <div className="text-gray-300">
                                {totalResults} resultado{totalResults !== 1 ? 's' : ''}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

// Result Section Component
function ResultSection({ title, icon: IconComponent, color, items, onItemClick }) {
    const colorClasses = {
        blue: 'text-blue-400 bg-blue-500/20',
        green: 'text-green-400 bg-green-500/20',
        gray: 'text-gray-400 bg-gray-500/20',
        purple: 'text-purple-400 bg-purple-500/20'
    }

    return (
        <div>
            <div className="flex items-center space-x-2 mb-3">
                <div className={`w-6 h-6 rounded flex items-center justify-center ${colorClasses[color]}`}>
                    <IconComponent className="text-xs" />
                </div>
                <h4 className="text-white font-semibold">{title}</h4>
                <span className="text-xs bg-gray-700 text-gray-300 px-2 py-1 rounded-full">
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
        blue: 'hover:bg-blue-500/10 hover:border-blue-500/30',
        green: 'hover:bg-green-500/10 hover:border-green-500/30',
        gray: 'hover:bg-gray-500/10 hover:border-gray-500/30',
        purple: 'hover:bg-purple-500/10 hover:border-purple-500/30'
    }

    return (
        <div
            onClick={onClick}
            className={`p-4 bg-gray-800/50 border border-gray-700 rounded-lg cursor-pointer transition-all ${colorClasses[color]}`}
        >
            <div className="flex items-start space-x-3">
                <div className="w-12 h-12 bg-gray-700 rounded-lg flex items-center justify-center">
                    <span className="text-gray-400 text-xs">IMG</span>
                </div>
                <div className="flex-1 min-w-0">
                    <h5 className="text-white font-medium truncate">{item.name}</h5>
                    <p className="text-gray-400 text-sm truncate">{item.developer}</p>
                    <div className="flex items-center space-x-3 mt-2 text-xs text-gray-500">
                        {item.rating > 0 && (
                            <div className="flex items-center space-x-1">
                                <FaStar className="text-yellow-400" />
                                <span>{item.rating.toFixed(1)}</span>
                            </div>
                        )}
                        <div className="flex items-center space-x-1">
                            <FaDownload />
                            <span>{item.downloads || 0}</span>
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
            className="p-3 bg-gray-800/50 border border-gray-700 rounded-lg cursor-pointer hover:bg-gray-700/50 transition-colors"
        >
            <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gray-700 rounded-lg flex items-center justify-center">
                    <span className="text-gray-400 text-xs">IMG</span>
                </div>
                <div className="flex-1 min-w-0">
                    <h6 className="text-white font-medium truncate text-sm">{item.name}</h6>
                    <p className="text-gray-400 text-xs truncate">{item.developer}</p>
                </div>
                <FaStar className="text-yellow-400 text-sm" />
            </div>
        </div>
    )
}

// No Results Component
function NoResults({ query }) {
    return (
        <div className="text-center py-12">
            <div className="w-20 h-20 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaSearch className="text-gray-500 text-2xl" />
            </div>
            <h3 className="text-white text-xl font-semibold mb-2">Sin resultados</h3>
            <p className="text-gray-400 mb-6">
                No encontramos nada para "<span className="text-white font-medium">{query}</span>"
            </p>
            <div className="text-sm text-gray-500 space-y-1">
                <p>• Verifica la ortografía</p>
                <p>• Intenta con términos más generales</p>
                <p>• Usa los filtros para refinar tu búsqueda</p>
            </div>
        </div>
    )
}
