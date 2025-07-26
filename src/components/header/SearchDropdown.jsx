'use client'
import React from 'react'
import Link from 'next/link'
import { FaSearch, FaTimes, FaFire, FaStar, FaDownload, FaClock, FaGamepad, FaLaptop, FaMobile, FaDesktop, FaTools, FaMusic, FaVideo, FaBook, FaShieldAlt } from 'react-icons/fa'
import { MdSecurity, MdBusiness, MdEducation, MdSportsEsports } from 'react-icons/md'
import SearchStats from './SearchStats'
import CategoryList from './CategoryList'
import RecentSearches from './RecentSearches'
import SearchSuggestions from './SearchSuggestions'

export default function SearchDropdown({ 
    isOpen, 
    searchQuery, 
    searchResults, 
    searchLoading, 
    categories = [],
    recentSearches = [],
    onClose,
    onSearch,
    onCategoryClick,
    onAppClick,
    onQuickSearch,
    onRemoveSearch
}) {
    if (!isOpen) return null

    const quickSearchTerms = [
        { term: 'Gaming', icon: FaGamepad, color: 'text-purple-400' },
        { term: 'Productivity', icon: FaLaptop, color: 'text-blue-400' },
        { term: 'Security', icon: FaShieldAlt, color: 'text-green-400' },
        { term: 'Entertainment', icon: FaVideo, color: 'text-pink-400' },
        { term: 'Development', icon: FaTools, color: 'text-orange-400' },
        { term: 'Music', icon: FaMusic, color: 'text-yellow-400' }
    ]

    // Categories will be passed as props from the hook

    // Recent searches are now passed as props

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[1000]" onClick={onClose}>
            <div className="absolute top-16 left-1/2 transform -translate-x-1/2 w-full max-w-4xl bg-gray-900/95 border-2 border-red-500 backdrop-blur-md shadow-2xl" onClick={(e) => e.stopPropagation()}>
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-red-500/30">
                    <h3 className="text-red-500 font-mono text-lg">SEARCH RESULTS</h3>
                    <button
                        onClick={onClose}
                        className="text-red-500 hover:text-red-400 transition-colors p-2"
                    >
                        <FaTimes />
                    </button>
                </div>

                <div className="max-h-[70vh] overflow-y-auto">
                    {/* Search Input */}
                    <div className="p-4 border-b border-red-500/20">
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="> search_apps --query"
                                value={searchQuery}
                                onChange={(e) => onSearch(e.target.value)}
                                className="w-full px-4 py-3 bg-gray-800/50 border border-red-500/50 text-green-400 placeholder-gray-500 font-mono focus:outline-none focus:border-red-500 transition-colors"
                                autoFocus
                            />
                            <FaSearch className="absolute right-3 top-1/2 transform -translate-y-1/2 text-red-500" />
                        </div>
                    </div>

                    {/* Content */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-0">
                        {/* Left Column - Quick Search & Categories */}
                        <div className="lg:col-span-1 p-4 border-r border-red-500/20">
                            {/* Quick Search Terms */}
                            <div className="mb-6">
                                <h4 className="text-red-500 font-mono text-sm mb-3">QUICK SEARCH</h4>
                                <div className="space-y-2">
                                    {quickSearchTerms.map((item, index) => (
                                        <button
                                            key={index}
                                            onClick={() => onQuickSearch(item.term)}
                                            className="w-full flex items-center space-x-3 p-2 text-gray-300 hover:text-red-400 hover:bg-red-500/10 transition-all duration-300 rounded"
                                        >
                                            <item.icon className={`${item.color}`} />
                                            <span className="font-mono text-sm">{item.term}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Popular Categories */}
                            <div className="mb-6">
                                <h4 className="text-red-500 font-mono text-sm mb-3">POPULAR CATEGORIES</h4>
                                <CategoryList 
                                    categories={categories}
                                    onCategoryClick={onCategoryClick}
                                />
                            </div>

                            {/* Recent Searches */}
                            <RecentSearches
                                recentSearches={recentSearches}
                                onQuickSearch={onQuickSearch}
                                onRemoveSearch={onRemoveSearch}
                            />
                        </div>

                        {/* Right Column - Search Results */}
                        <div className="lg:col-span-2 p-4">
                            {searchLoading ? (
                                <div className="flex items-center justify-center py-8">
                                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-500"></div>
                                    <span className="ml-3 text-red-500 font-mono">Searching...</span>
                                </div>
                            ) : searchQuery ? (
                                <div>
                                    <h4 className="text-red-500 font-mono text-sm mb-4">
                                        SEARCH RESULTS FOR "{searchQuery.toUpperCase()}"
                                    </h4>
                                    
                                    {searchResults.length > 0 ? (
                                        <>
                                            <div className="space-y-3">
                                                {searchResults.map((app, index) => (
                                                    <div
                                                        key={app._id || index}
                                                        onClick={() => onAppClick(app)}
                                                        className="flex items-center space-x-4 p-3 bg-gray-800/50 border border-red-500/20 hover:border-red-500 hover:bg-red-500/10 transition-all duration-300 cursor-pointer"
                                                    >
                                                        <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center rounded">
                                                            <FaGamepad className="text-black" />
                                                        </div>
                                                        <div className="flex-1">
                                                            <h5 className="text-green-400 font-mono text-sm font-bold">{app.name}</h5>
                                                            <p className="text-gray-400 text-xs">{app.shortDescription || app.description?.substring(0, 60)}...</p>
                                                            <div className="flex items-center space-x-4 mt-1">
                                                                <span className="text-gray-500 text-xs flex items-center">
                                                                    <FaDownload className="mr-1" />
                                                                    {app.downloads || 0}
                                                                </span>
                                                                <span className="text-gray-500 text-xs flex items-center">
                                                                    <FaStar className="mr-1 text-yellow-500" />
                                                                    {app.rating || 'N/A'}
                                                                </span>
                                                                {app.isHot && (
                                                                    <span className="text-red-500 text-xs flex items-center">
                                                                        <FaFire className="mr-1" />
                                                                        HOT
                                                                    </span>
                                                                )}
                                                            </div>
                                                        </div>
                                                        <div className="text-right">
                                                            <span className="text-gray-500 text-xs">{app.size}</span>
                                                            <div className="text-red-500 text-xs mt-1">{app.version}</div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                            <SearchStats 
                                                searchQuery={searchQuery}
                                                searchResults={searchResults}
                                                searchLoading={searchLoading}
                                            />
                                        </>
                                    ) : (
                                        <div>
                                            <div className="text-center py-8">
                                                <FaSearch className="text-gray-500 text-4xl mx-auto mb-4" />
                                                <p className="text-gray-400 font-mono">No results found for "{searchQuery}"</p>
                                                <p className="text-gray-500 text-sm mt-2">Try different keywords or browse categories</p>
                                            </div>
                                            <SearchSuggestions
                                                searchQuery={searchQuery}
                                                onSuggestionClick={onQuickSearch}
                                            />
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div className="text-center py-8">
                                    <FaSearch className="text-gray-500 text-4xl mx-auto mb-4" />
                                    <p className="text-gray-400 font-mono">Start typing to search apps</p>
                                    <p className="text-gray-500 text-sm mt-2">Or browse popular categories</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
} 