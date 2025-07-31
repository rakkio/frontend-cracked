'use client'

import { useState, useEffect } from 'react'
import { FaSearch, FaFilter, FaTh, FaList, FaAndroid, FaSort } from 'react-icons/fa'

export default function ApkFilters({ 
    filters, 
    onFilterChange, 
    viewMode, 
    onViewModeChange, 
    totalItems = 0 
}) {
    const [categories, setCategories] = useState([])
    const [showFilters, setShowFilters] = useState(false)
    const [searchInput, setSearchInput] = useState(filters.search || '')

    // Fetch categories
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'
                const response = await fetch(`${baseUrl}/api/categories`)
                
                if (response.ok) {
                    const data = await response.json()
                    if (data.success) {
                        setCategories(data.data)
                    }
                }
            } catch (error) {
                console.error('Error fetching categories:', error)
            }
        }

        fetchCategories()
    }, [])

    // Handle search input change
    const handleSearchChange = (e) => {
        setSearchInput(e.target.value)
    }

    // Handle search submit
    const handleSearchSubmit = (e) => {
        e.preventDefault()
        onFilterChange({ search: searchInput })
    }

    // Handle filter change
    const handleFilterChange = (key, value) => {
        onFilterChange({ [key]: value })
    }

    // Clear all filters
    const clearFilters = () => {
        setSearchInput('')
        onFilterChange({
            search: '',
            category: '',
            featured: '',
            sort: 'downloads',
            order: 'desc'
        })
    }

    const sortOptions = [
        { value: 'downloads', label: 'Most Downloaded', icon: '📥' },
        { value: 'rating', label: 'Highest Rated', icon: '⭐' },
        { value: 'createdAt', label: 'Newest', icon: '🆕' },
        { value: 'name', label: 'Name A-Z', icon: '🔤' },
        { value: 'views', label: 'Most Viewed', icon: '👁️' }
    ]

    const hasActiveFilters = filters.search || filters.category || filters.featured

    return (
        <div className="bg-gradient-to-r from-gray-800/50 to-gray-900/50 backdrop-blur-sm border border-gray-700/40 rounded-2xl p-6">
            {/* Header */}
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
                {/* Search */}
                <form onSubmit={handleSearchSubmit} className="flex-1 max-w-md">
                    <div className="relative">
                        <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search Android APKs..."
                            value={searchInput}
                            onChange={handleSearchChange}
                            className="w-full pl-12 pr-4 py-3 bg-gray-700/50 border border-gray-600/50 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-green-500/50 focus:ring-2 focus:ring-green-500/20 transition-all"
                        />
                        {searchInput && (
                            <button
                                type="button"
                                onClick={() => {
                                    setSearchInput('')
                                    onFilterChange({ search: '' })
                                }}
                                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                            >
                                ✕
                            </button>
                        )}
                    </div>
                </form>

                {/* Controls */}
                <div className="flex items-center space-x-4">
                    {/* Results Count */}
                    <div className="flex items-center space-x-2 text-gray-400">
                        <FaAndroid className="text-green-400" />
                        <span className="text-sm">
                            {totalItems.toLocaleString()} APKs
                        </span>
                    </div>

                    {/* View Mode Toggle */}
                    <div className="flex items-center bg-gray-700/50 rounded-lg p-1">
                        <button
                            onClick={() => onViewModeChange('grid')}
                            className={`p-2 rounded-md transition-all ${
                                viewMode === 'grid'
                                    ? 'bg-green-600 text-white'
                                    : 'text-gray-400 hover:text-white'
                            }`}
                            title="Grid View"
                        >
                            <FaTh />
                        </button>
                        <button
                            onClick={() => onViewModeChange('list')}
                            className={`p-2 rounded-md transition-all ${
                                viewMode === 'list'
                                    ? 'bg-green-600 text-white'
                                    : 'text-gray-400 hover:text-white'
                            }`}
                            title="List View"
                        >
                            <FaList />
                        </button>
                    </div>

                    {/* Filter Toggle */}
                    <button
                        onClick={() => setShowFilters(!showFilters)}
                        className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all ${
                            showFilters || hasActiveFilters
                                ? 'bg-green-600 text-white'
                                : 'bg-gray-700/50 text-gray-400 hover:text-white'
                        }`}
                    >
                        <FaFilter />
                        <span className="hidden sm:inline">Filters</span>
                        {hasActiveFilters && (
                            <span className="bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                                !
                            </span>
                        )}
                    </button>
                </div>
            </div>

            {/* Expanded Filters */}
            {showFilters && (
                <div className="border-t border-gray-700/40 pt-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {/* Category Filter */}
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Category
                            </label>
                            <select
                                value={filters.category || ''}
                                onChange={(e) => handleFilterChange('category', e.target.value)}
                                className="w-full px-3 py-2 bg-gray-700/50 border border-gray-600/50 rounded-lg text-white focus:outline-none focus:border-green-500/50 focus:ring-2 focus:ring-green-500/20 transition-all"
                            >
                                <option value="">All Categories</option>
                                {categories.map((category) => (
                                    <option key={category._id} value={category._id}>
                                        {category.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Featured Filter */}
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Type
                            </label>
                            <select
                                value={filters.featured || ''}
                                onChange={(e) => handleFilterChange('featured', e.target.value)}
                                className="w-full px-3 py-2 bg-gray-700/50 border border-gray-600/50 rounded-lg text-white focus:outline-none focus:border-green-500/50 focus:ring-2 focus:ring-green-500/20 transition-all"
                            >
                                <option value="">All APKs</option>
                                <option value="true">Featured Only</option>
                                <option value="false">Regular APKs</option>
                            </select>
                        </div>

                        {/* Sort Filter */}
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Sort By
                            </label>
                            <select
                                value={filters.sort || 'downloads'}
                                onChange={(e) => handleFilterChange('sort', e.target.value)}
                                className="w-full px-3 py-2 bg-gray-700/50 border border-gray-600/50 rounded-lg text-white focus:outline-none focus:border-green-500/50 focus:ring-2 focus:ring-green-500/20 transition-all"
                            >
                                {sortOptions.map((option) => (
                                    <option key={option.value} value={option.value}>
                                        {option.icon} {option.label}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Order Filter */}
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Order
                            </label>
                            <select
                                value={filters.order || 'desc'}
                                onChange={(e) => handleFilterChange('order', e.target.value)}
                                className="w-full px-3 py-2 bg-gray-700/50 border border-gray-600/50 rounded-lg text-white focus:outline-none focus:border-green-500/50 focus:ring-2 focus:ring-green-500/20 transition-all"
                            >
                                <option value="desc">Descending</option>
                                <option value="asc">Ascending</option>
                            </select>
                        </div>
                    </div>

                    {/* Filter Actions */}
                    {hasActiveFilters && (
                        <div className="mt-4 flex justify-end">
                            <button
                                onClick={clearFilters}
                                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors text-sm"
                            >
                                Clear All Filters
                            </button>
                        </div>
                    )}
                </div>
            )}

            {/* Active Filters Display */}
            {hasActiveFilters && (
                <div className="mt-4 flex flex-wrap gap-2">
                    {filters.search && (
                        <div className="flex items-center space-x-2 bg-green-600/20 text-green-400 px-3 py-1 rounded-full text-sm">
                            <span>Search: "{filters.search}"</span>
                            <button
                                onClick={() => {
                                    setSearchInput('')
                                    handleFilterChange('search', '')
                                }}
                                className="hover:text-white transition-colors"
                            >
                                ✕
                            </button>
                        </div>
                    )}
                    
                    {filters.category && (
                        <div className="flex items-center space-x-2 bg-blue-600/20 text-blue-400 px-3 py-1 rounded-full text-sm">
                            <span>
                                Category: {categories.find(c => c._id === filters.category)?.name || 'Unknown'}
                            </span>
                            <button
                                onClick={() => handleFilterChange('category', '')}
                                className="hover:text-white transition-colors"
                            >
                                ✕
                            </button>
                        </div>
                    )}
                    
                    {filters.featured && (
                        <div className="flex items-center space-x-2 bg-yellow-600/20 text-yellow-400 px-3 py-1 rounded-full text-sm">
                            <span>
                                {filters.featured === 'true' ? 'Featured Only' : 'Regular APKs'}
                            </span>
                            <button
                                onClick={() => handleFilterChange('featured', '')}
                                className="hover:text-white transition-colors"
                            >
                                ✕
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}
