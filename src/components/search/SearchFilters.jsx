'use client'

import { useState } from 'react'
import { FaFilter, FaTimes, FaCheck } from 'react-icons/fa'

export default function SearchFilters({ onFiltersChange, initialFilters = {} }) {
    const [isOpen, setIsOpen] = useState(false)
    const [filters, setFilters] = useState({
        category: initialFilters.category || '',
        rating: initialFilters.rating || '',
        size: initialFilters.size || '',
        updated: initialFilters.updated || '',
        ...initialFilters
    })

    const categories = [
        'Productivity', 'Games', 'Entertainment', 'Social', 'Photography',
        'Music', 'Video', 'Education', 'Business', 'Utilities', 'Design',
        'Development', 'Security', 'Health', 'Travel', 'News', 'Shopping'
    ]

    const ratingOptions = [
        { value: '4.5', label: '4.5+ Stars' },
        { value: '4.0', label: '4.0+ Stars' },
        { value: '3.5', label: '3.5+ Stars' },
        { value: '3.0', label: '3.0+ Stars' }
    ]

    const sizeOptions = [
        { value: 'small', label: 'Under 50MB' },
        { value: 'medium', label: '50MB - 500MB' },
        { value: 'large', label: '500MB - 2GB' },
        { value: 'xlarge', label: 'Over 2GB' }
    ]

    const updatedOptions = [
        { value: 'day', label: 'Last 24 hours' },
        { value: 'week', label: 'Last week' },
        { value: 'month', label: 'Last month' },
        { value: 'year', label: 'Last year' }
    ]

    const handleFilterChange = (key, value) => {
        const newFilters = { ...filters, [key]: value }
        setFilters(newFilters)
        onFiltersChange(newFilters)
    }

    const clearFilters = () => {
        const clearedFilters = {
            category: '',
            rating: '',
            size: '',
            updated: ''
        }
        setFilters(clearedFilters)
        onFiltersChange(clearedFilters)
    }

    const hasActiveFilters = Object.values(filters).some(value => value !== '')

    return (
        <div className="relative">
            {/* Filter Toggle Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`
                    flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-all duration-300
                    ${hasActiveFilters || isOpen
                        ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg'
                        : 'bg-gray-800/50 text-gray-400 hover:text-white hover:bg-gray-700/50'
                    }
                `}
            >
                <FaFilter />
                Filters
                {hasActiveFilters && (
                    <span className="bg-white/20 text-xs px-2 py-1 rounded-full">
                        {Object.values(filters).filter(v => v !== '').length}
                    </span>
                )}
            </button>

            {/* Filter Panel */}
            {isOpen && (
                <div className="absolute top-full right-0 mt-2 w-80 bg-gray-900/95 backdrop-blur-sm border border-gray-700 rounded-xl p-6 z-50 shadow-2xl">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-lg font-bold text-white">Filters</h3>
                        <div className="flex items-center gap-2">
                            {hasActiveFilters && (
                                <button
                                    onClick={clearFilters}
                                    className="text-gray-400 hover:text-white text-sm"
                                >
                                    Clear all
                                </button>
                            )}
                            <button
                                onClick={() => setIsOpen(false)}
                                className="text-gray-400 hover:text-white"
                            >
                                <FaTimes />
                            </button>
                        </div>
                    </div>

                    {/* Category Filter */}
                    <div className="mb-6">
                        <label className="block text-sm font-semibold text-gray-300 mb-3">
                            Category
                        </label>
                        <select
                            value={filters.category}
                            onChange={(e) => handleFilterChange('category', e.target.value)}
                            className="w-full bg-gray-800/50 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-purple-500"
                        >
                            <option value="">All Categories</option>
                            {categories.map(category => (
                                <option key={category} value={category.toLowerCase()}>
                                    {category}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Rating Filter */}
                    <div className="mb-6">
                        <label className="block text-sm font-semibold text-gray-300 mb-3">
                            Minimum Rating
                        </label>
                        <div className="space-y-2">
                            {ratingOptions.map(option => (
                                <label key={option.value} className="flex items-center gap-3 cursor-pointer">
                                    <input
                                        type="radio"
                                        name="rating"
                                        value={option.value}
                                        checked={filters.rating === option.value}
                                        onChange={(e) => handleFilterChange('rating', e.target.value)}
                                        className="sr-only"
                                    />
                                    <div className={`
                                        w-4 h-4 rounded-full border-2 flex items-center justify-center
                                        ${filters.rating === option.value
                                            ? 'border-purple-500 bg-purple-500'
                                            : 'border-gray-600'
                                        }
                                    `}>
                                        {filters.rating === option.value && (
                                            <FaCheck className="text-white text-xs" />
                                        )}
                                    </div>
                                    <span className="text-gray-300 text-sm">{option.label}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* Size Filter */}
                    <div className="mb-6">
                        <label className="block text-sm font-semibold text-gray-300 mb-3">
                            File Size
                        </label>
                        <div className="space-y-2">
                            {sizeOptions.map(option => (
                                <label key={option.value} className="flex items-center gap-3 cursor-pointer">
                                    <input
                                        type="radio"
                                        name="size"
                                        value={option.value}
                                        checked={filters.size === option.value}
                                        onChange={(e) => handleFilterChange('size', e.target.value)}
                                        className="sr-only"
                                    />
                                    <div className={`
                                        w-4 h-4 rounded-full border-2 flex items-center justify-center
                                        ${filters.size === option.value
                                            ? 'border-purple-500 bg-purple-500'
                                            : 'border-gray-600'
                                        }
                                    `}>
                                        {filters.size === option.value && (
                                            <FaCheck className="text-white text-xs" />
                                        )}
                                    </div>
                                    <span className="text-gray-300 text-sm">{option.label}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* Updated Filter */}
                    <div className="mb-6">
                        <label className="block text-sm font-semibold text-gray-300 mb-3">
                            Last Updated
                        </label>
                        <div className="space-y-2">
                            {updatedOptions.map(option => (
                                <label key={option.value} className="flex items-center gap-3 cursor-pointer">
                                    <input
                                        type="radio"
                                        name="updated"
                                        value={option.value}
                                        checked={filters.updated === option.value}
                                        onChange={(e) => handleFilterChange('updated', e.target.value)}
                                        className="sr-only"
                                    />
                                    <div className={`
                                        w-4 h-4 rounded-full border-2 flex items-center justify-center
                                        ${filters.updated === option.value
                                            ? 'border-purple-500 bg-purple-500'
                                            : 'border-gray-600'
                                        }
                                    `}>
                                        {filters.updated === option.value && (
                                            <FaCheck className="text-white text-xs" />
                                        )}
                                    </div>
                                    <span className="text-gray-300 text-sm">{option.label}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* Apply Button */}
                    <button
                        onClick={() => setIsOpen(false)}
                        className="w-full py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-bold rounded-lg transition-all duration-300 hover:scale-105"
                    >
                        Apply Filters
                    </button>
                </div>
            )}

            {/* Backdrop */}
            {isOpen && (
                <div 
                    className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
                    onClick={() => setIsOpen(false)}
                />
            )}
        </div>
    )
}
