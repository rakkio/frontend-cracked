'use client'
import React, { useState, useEffect, useRef } from 'react'
import { FaSearch, FaTimes, FaSpinner, FaMobile, FaDownload, FaStar, FaFire, FaCrown, FaGem } from 'react-icons/fa'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function Search({ onClose }) {
    const [searchQuery, setSearchQuery] = useState('')
    const [searchResults, setSearchResults] = useState([])
    const [isLoading, setIsLoading] = useState(false)
    const [isMounted, setIsMounted] = useState(false)
    const [recentSearches, setRecentSearches] = useState([])
    const searchTimeoutRef = useRef(null)
    const router = useRouter()

    useEffect(() => {
        setIsMounted(true)
        // Load recent searches from localStorage
        try {
            const saved = localStorage.getItem('recentSearches')
            if (saved) {
                setRecentSearches(JSON.parse(saved))
            }
        } catch (error) {
            console.error('Error loading recent searches:', error)
        }
    }, [])

    // Search function
    const performSearch = async (query) => {
        if (!query.trim()) {
            setSearchResults([])
            return
        }

        setIsLoading(true)
        try {
            const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'
            
            // Use quick search endpoint for better performance
            const response = await fetch(`${API_BASE_URL}/api/v1/apps/quick-search?q=${encodeURIComponent(query)}&limit=12`)
            
            if (response.ok) {
                const data = await response.json()
                if (data.success && data.apps) {
                    // Add type and icon info to each app
                    const results = data.apps.map(app => ({
                        ...app,
                        type: 'app',
                        icon: FaMobile,
                        color: 'text-blue-500'
                    }))
                    setSearchResults(results)
                } else {
                    setSearchResults([])
                }
            } else {
                console.error('Search API error:', response.status)
                setSearchResults([])
            }
        } catch (error) {
            console.error('Search error:', error)
            setSearchResults([])
        } finally {
            setIsLoading(false)
        }
    }

    // Debounced search
    useEffect(() => {
        if (searchTimeoutRef.current) {
            clearTimeout(searchTimeoutRef.current)
        }
        
        if (searchQuery.trim()) {
            searchTimeoutRef.current = setTimeout(() => {
                performSearch(searchQuery)
            }, 300)
        } else {
            setSearchResults([])
        }
        
        return () => {
            if (searchTimeoutRef.current) {
                clearTimeout(searchTimeoutRef.current)
            }
        }
    }, [searchQuery])

    const handleSearch = (e) => {
        e.preventDefault()
        if (searchQuery.trim()) {
            saveToRecentSearches(searchQuery.trim())
            router.push(`/apps?search=${encodeURIComponent(searchQuery.trim())}`)
            if (onClose) onClose()
        }
    }

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleSearch(e)
        }
        if (e.key === 'Escape') {
            if (onClose) onClose()
        }
    }

    const saveToRecentSearches = (query) => {
        try {
            const updated = [query, ...recentSearches.filter(s => s !== query)].slice(0, 10)
            setRecentSearches(updated)
            localStorage.setItem('recentSearches', JSON.stringify(updated))
        } catch (error) {
            console.error('Error saving recent search:', error)
        }
    }

    const getItemUrl = (item) => {
        return `/app/${item.slug}`
    }

    const formatDownloads = (count) => {
        if (count >= 1000000) return `${(count / 1000000).toFixed(1)}M`
        if (count >= 1000) return `${(count / 1000).toFixed(1)}K`
        return count.toString()
    }

    if (!isMounted) {
        return (
            <div className="bg-black/90 border border-red-500/20 rounded-lg p-4">
                <div className="text-gray-400 text-sm">Cargando búsqueda...</div>
            </div>
        )
    }

    return (
        <div className="relative w-full max-w-3xl">
            <style jsx>{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 6px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: rgba(0, 0, 0, 0.2);
                    border-radius: 3px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: rgba(239, 68, 68, 0.5);
                    border-radius: 3px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: rgba(239, 68, 68, 0.7);
                }
                .line-clamp-2 {
                    display: -webkit-box;
                    -webkit-line-clamp: 2;
                    -webkit-box-orient: vertical;
                    overflow: hidden;
                }
                .scan-lines {
                    background: linear-gradient(
                        to bottom,
                        transparent 50%,
                        rgba(239, 68, 68, 0.03) 51%,
                        rgba(239, 68, 68, 0.03) 52%,
                        transparent 53%
                    );
                    background-size: 100% 4px;
                    animation: scanlines 2s linear infinite;
                }
                @keyframes scanlines {
                    0% { background-position: 0 0; }
                    100% { background-position: 0 4px; }
                }
                .terminal-glow {
                    box-shadow: 
                        0 0 20px rgba(239, 68, 68, 0.3),
                        inset 0 0 20px rgba(0, 0, 0, 0.5);
                }
            `}</style>
            
            {/* Search Modal/Dropdown */}
            <div className="bg-black/95 backdrop-blur-xl border-2 border-red-500/30 rounded-lg shadow-2xl terminal-glow overflow-hidden">
                {/* Scan lines effect */}
                <div className="scan-lines absolute inset-0 pointer-events-none"></div>
                
                {/* Header */}
                <div className="relative bg-gradient-to-r from-red-500/20 via-orange-500/15 to-red-500/20 p-4 border-b border-red-500/20">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                            <div className="relative">
                                <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-orange-500 rounded-lg flex items-center justify-center">
                                    <FaSearch className="text-black text-lg" />
                                </div>
                                <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-pulse border border-black"></div>
                            </div>
                            <div>
                                <h3 className="text-white font-mono text-lg font-bold tracking-wider">SEARCH_TERMINAL</h3>
                                <p className="text-green-400 text-xs font-mono">root@crackmarket:~# find_apps --interactive</p>
                            </div>
                        </div>
                        {onClose && (
                            <button
                                type="button"
                                onClick={onClose}
                                className="text-gray-400 hover:text-red-400 transition-all duration-200 p-2 hover:bg-red-500/10 rounded-lg border border-transparent hover:border-red-500/30"
                            >
                                <FaTimes className="text-lg" />
                            </button>
                        )}
                    </div>
                </div>

                {/* Search Input */}
                <form onSubmit={handleSearch} className="p-4">
                    <div className="relative group">
                        {/* Terminal corners */}
                        <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-red-500"></div>
                        <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-red-500"></div>
                        <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-red-500"></div>
                        <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-red-500"></div>
                        
                        {/* Glow effect */}
                        <div className="absolute inset-0 bg-gradient-to-r from-red-500/10 to-orange-500/10 blur-sm group-focus-within:blur-none transition-all"></div>
                        
                        <div className="relative bg-gray-900/90 border border-red-500/50 backdrop-blur-sm">
                            <div className="flex items-center">
                                <span className="text-green-400 font-mono text-sm px-3 py-3 border-r border-red-500/20">
                                    $
                                </span>
                                <input
                                    type="text"
                                    placeholder="search_apps --query 'aplicaciones, juegos, apks...'"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    onKeyPress={handleKeyPress}
                                    className="flex-1 px-4 py-3 bg-transparent text-green-400 placeholder-gray-500 font-mono focus:outline-none focus:text-red-400 transition-colors text-sm"
                                    autoFocus
                                />
                                <button
                                    type="submit"
                                    className="px-4 py-3 text-red-500 hover:text-red-400 hover:bg-red-500/10 transition-colors border-l border-red-500/20"
                                >
                                    <FaSearch />
                                </button>
                            </div>
                        </div>
                    </div>
                </form>

                {/* Search Results */}
                {searchQuery.trim() && (
                    <div className="border-t border-red-500/20">
                        <div className="px-4 py-3">
                            <div className="flex items-center justify-between mb-3">
                                <span className="text-gray-400 font-mono text-xs uppercase tracking-wider">
                                    {isLoading ? 'Searching...' : `Results for "${searchQuery}"`}
                                </span>
                                {isLoading && <FaSpinner className="text-red-500 animate-spin" />}
                            </div>
                            
                            {searchResults.length > 0 ? (
                                <div className="space-y-2 max-h-80 overflow-y-auto custom-scrollbar">
                                    {searchResults.map((item, index) => {
                                        const IconComponent = item.icon
                                        const downloadCount = item.downloadCount || item.downloads || 0
                                        
                                        return (
                                            <Link
                                                key={`${item.type}-${item._id || item.id}-${index}`}
                                                href={getItemUrl(item)}
                                                onClick={() => {
                                                    saveToRecentSearches(searchQuery)
                                                    if (onClose) onClose()
                                                }}
                                                className="group flex items-center space-x-4 p-4 bg-gradient-to-r from-black/40 to-gray-900/40 hover:from-red-500/10 hover:to-orange-500/10 border border-red-500/10 hover:border-red-500/30 rounded-lg transition-all duration-300 backdrop-blur-sm"
                                            >
                                                {/* App Icon/Image */}
                                                <div className="flex-shrink-0 relative">
                                                    {item.images && item.images[0] ? (
                                                        <img 
                                                            src={item.images[0]} 
                                                            alt={item.name}
                                                            className="w-12 h-12 rounded-lg object-cover border border-red-500/20"
                                                            onError={(e) => {
                                                                e.target.style.display = 'none'
                                                                e.target.nextSibling.style.display = 'flex'
                                                            }}
                                                        />
                                                    ) : null}
                                                    <div className={`w-12 h-12 bg-gradient-to-br from-red-500/20 to-orange-500/20 border border-red-500/30 rounded-lg flex items-center justify-center ${item.images && item.images[0] ? 'hidden' : 'flex'}`}>
                                                        <IconComponent className={`text-xl ${item.color}`} />
                                                    </div>
                                                    
                                                    {/* Status badges */}
                                                    <div className="absolute -top-1 -right-1 flex flex-col space-y-1">
                                                        {item.isFeatured && (
                                                            <div className="w-4 h-4 bg-yellow-500 rounded-full flex items-center justify-center">
                                                                <FaCrown className="text-black text-xs" />
                                                            </div>
                                                        )}
                                                        {item.isHot && (
                                                            <div className="w-4 h-4 bg-red-500 rounded-full flex items-center justify-center">
                                                                <FaFire className="text-white text-xs" />
                                                            </div>
                                                        )}
                                                        {item.isPremium && (
                                                            <div className="w-4 h-4 bg-purple-500 rounded-full flex items-center justify-center">
                                                                <FaGem className="text-white text-xs" />
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                                
                                                {/* App Info */}
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center space-x-2 mb-1">
                                                        <h4 className="text-white font-semibold text-sm truncate group-hover:text-red-400 transition-colors font-mono">
                                                            {item.name || item.title}
                                                        </h4>
                                                        <span className="px-2 py-0.5 bg-red-500/20 text-red-400 text-xs font-mono rounded border border-red-500/30 uppercase">
                                                            {item.type}
                                                        </span>
                                                    </div>
                                                    
                                                    <p className="text-gray-400 text-xs mb-2 line-clamp-2">
                                                        {item.shortDescription || item.description?.substring(0, 80) || 'No description available'}...
                                                    </p>
                                                    
                                                    <div className="flex items-center space-x-4 text-xs">
                                                        {item.developer && (
                                                            <span className="text-gray-500 truncate max-w-24">
                                                                by {item.developer}
                                                            </span>
                                                        )}
                                                        
                                                        {item.category && (
                                                            <span className="text-blue-400 font-mono">
                                                                {item.category.name || item.category}
                                                            </span>
                                                        )}
                                                        
                                                        {item.rating && item.rating > 0 && (
                                                            <div className="flex items-center space-x-1">
                                                                <FaStar className="text-yellow-400" />
                                                                <span className="text-yellow-400 font-mono">{item.rating}</span>
                                                            </div>
                                                        )}
                                                        
                                                        {downloadCount > 0 && (
                                                            <div className="flex items-center space-x-1">
                                                                <FaDownload className="text-green-400" />
                                                                <span className="text-green-400 font-mono">{formatDownloads(downloadCount)}</span>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                                
                                                {/* Version & Size */}
                                                <div className="text-right text-xs space-y-1 flex-shrink-0">
                                                    {item.version && (
                                                        <div className="text-gray-400 font-mono">v{item.version}</div>
                                                    )}
                                                    {item.size && (
                                                        <div className="text-gray-500 font-mono">{item.size}</div>
                                                    )}
                                                </div>
                                            </Link>
                                        )
                                    })}
                                </div>
                            ) : !isLoading && (
                                <div className="text-center py-8">
                                    <div className="text-gray-500 font-mono text-sm mb-2">No results found</div>
                                    <div className="text-gray-600 text-xs">Try different keywords or browse categories</div>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* Quick Categories & Recent Searches */}
                {!searchQuery.trim() && (
                    <div className="px-4 pb-4">
                        {/* Recent Searches */}
                        {recentSearches.length > 0 && (
                            <div className="mb-4">
                                <div className="mb-3">
                                    <span className="text-gray-400 font-mono text-xs uppercase tracking-wider">Recent:</span>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {recentSearches.slice(0, 5).map((search, index) => (
                                        <button
                                            key={index}
                                            type="button"
                                            onClick={() => {
                                                setSearchQuery(search)
                                                router.push(`/apps?search=${encodeURIComponent(search)}`)
                                                if (onClose) onClose()
                                            }}
                                            className="px-3 py-1 bg-gray-700/50 border border-gray-600/50 hover:border-red-500/40 rounded text-gray-300 hover:text-red-400 transition-colors text-xs font-mono"
                                        >
                                            {search}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                        
                        {/* Quick Categories */}
                        <div className="mb-3">
                            <span className="text-gray-400 font-mono text-xs uppercase tracking-wider">Quick Search:</span>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {[
                                { name: 'PC Games', icon: '🎮', query: 'juegos pc', type: 'apps' },
                                { name: 'Productivity', icon: '💼', query: 'productividad', type: 'apps' },
                                { name: 'Multimedia', icon: '🎵', query: 'multimedia', type: 'apps' },
                                { name: 'Development', icon: '💻', query: 'desarrollo', type: 'apps' },
                                { name: 'Design', icon: '🎨', query: 'diseño', type: 'apps' },
                                { name: 'Security', icon: '🔒', query: 'seguridad', type: 'apps' }
                            ].map((category) => (
                                <button
                                    key={category.name}
                                    type="button"
                                    onClick={() => {
                                        setSearchQuery(category.query)
                                        router.push(`/${category.type}?search=${encodeURIComponent(category.query)}`)
                                        if (onClose) onClose()
                                    }}
                                    className="group flex items-center space-x-2 px-3 py-2 bg-black/50 border border-red-500/20 hover:border-red-500/40 rounded text-gray-300 hover:text-red-400 transition-all duration-200 hover:bg-red-500/10"
                                >
                                    <span className="text-sm">{category.icon}</span>
                                    <span className="font-mono text-xs">{category.name}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* Terminal Footer */}
                <div className="bg-black/50 border-t border-red-500/20 px-4 py-2">
                    <div className="flex items-center justify-between text-xs font-mono">
                        <span className="text-gray-500">Press Enter to search • ESC to close</span>
                        <div className="flex items-center space-x-2">
                            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                            <span className="text-green-400">ONLINE</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
