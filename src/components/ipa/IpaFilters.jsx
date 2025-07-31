'use client'

import { useState } from 'react'
import { FaSearch, FaFilter, FaTh, FaList, FaApple, FaShieldAlt } from 'react-icons/fa'
import { MdClear, MdWarning } from 'react-icons/md'

export default function IpaFilters({ 
    filters, 
    onFilterChange, 
    viewMode, 
    onViewModeChange, 
    loading = false 
}) {
    const [showAdvanced, setShowAdvanced] = useState(false)

    const categories = [
        'Games', 'Social', 'Entertainment', 'Productivity', 'Utilities',
        'Photo & Video', 'Music', 'Education', 'Business', 'Health & Fitness',
        'News', 'Finance', 'Weather', 'Sports', 'Travel'
    ]

    const sortOptions = [
        { value: 'createdAt', label: 'Date Added' },
        { value: 'name', label: 'Name' },
        { value: 'downloads', label: 'Downloads' },
        { value: 'rating', label: 'Rating' },
        { value: 'views', label: 'Views' },
        { value: 'fileSize', label: 'File Size' }
    ]

    const iosVersions = [
        '12.0', '13.0', '14.0', '15.0', '16.0', '17.0', '18.0'
    ]

    const deviceTypes = [
        { value: 'iPhone', label: 'iPhone' },
        { value: 'iPad', label: 'iPad' },
        { value: 'iPod', label: 'iPod Touch' }
    ]

    const handleInputChange = (key, value) => {
        onFilterChange({ [key]: value })
    }

    const clearFilters = () => {
        onFilterChange({
            search: '',
            category: '',
            featured: false,
            jailbreak: '',
            minIosVersion: '',
            deviceCompatibility: '',
            sort: 'createdAt',
            order: 'desc'
        })
    }

    const hasActiveFilters = filters.search || filters.category || filters.featured || 
                            filters.jailbreak || filters.minIosVersion || filters.deviceCompatibility

    return (
        <div className="bg-gradient-to-r from-gray-900/50 to-gray-800/50 border border-gray-700/50 rounded-lg p-4 mb-6">
            {/* Main Filter Row */}
            <div className="flex flex-col lg:flex-row gap-4 mb-4">
                {/* Search */}
                <div className="flex-1">
                    <div className="relative">
                        <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search iOS apps..."
                            value={filters.search}
                            onChange={(e) => handleInputChange('search', e.target.value)}
                            className="w-full pl-10 pr-4 py-2 bg-black/50 border border-gray-600/50 rounded-lg text-white placeholder-gray-400 focus:border-blue-500/50 focus:outline-none transition-colors"
                            disabled={loading}
                        />
                    </div>
                </div>

                {/* Category */}
                <div className="lg:w-48">
                    <select
                        value={filters.category}
                        onChange={(e) => handleInputChange('category', e.target.value)}
                        className="w-full px-3 py-2 bg-black/50 border border-gray-600/50 rounded-lg text-white focus:border-blue-500/50 focus:outline-none transition-colors"
                        disabled={loading}
                    >
                        <option value="">All Categories</option>
                        {categories.map(category => (
                            <option key={category} value={category}>{category}</option>
                        ))}
                    </select>
                </div>

                {/* Sort */}
                <div className="lg:w-40">
                    <select
                        value={filters.sort}
                        onChange={(e) => handleInputChange('sort', e.target.value)}
                        className="w-full px-3 py-2 bg-black/50 border border-gray-600/50 rounded-lg text-white focus:border-blue-500/50 focus:outline-none transition-colors"
                        disabled={loading}
                    >
                        {sortOptions.map(option => (
                            <option key={option.value} value={option.value}>{option.label}</option>
                        ))}
                    </select>
                </div>

                {/* Order */}
                <div className="lg:w-32">
                    <select
                        value={filters.order}
                        onChange={(e) => handleInputChange('order', e.target.value)}
                        className="w-full px-3 py-2 bg-black/50 border border-gray-600/50 rounded-lg text-white focus:border-blue-500/50 focus:outline-none transition-colors"
                        disabled={loading}
                    >
                        <option value="desc">Desc</option>
                        <option value="asc">Asc</option>
                    </select>
                </div>
            </div>

            {/* Action Buttons Row */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                {/* Left Side - Filter Controls */}
                <div className="flex flex-wrap items-center gap-2">
                    {/* Featured Toggle */}
                    <button
                        onClick={() => handleInputChange('featured', !filters.featured)}
                        className={`px-3 py-1 rounded-full text-sm font-mono border transition-all duration-300 ${
                            filters.featured
                                ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50'
                                : 'bg-gray-700/50 text-gray-400 border-gray-600/50 hover:border-yellow-500/50'
                        }`}
                        disabled={loading}
                    >
                        ⭐ Featured
                    </button>

                    {/* Advanced Filters Toggle */}
                    <button
                        onClick={() => setShowAdvanced(!showAdvanced)}
                        className="flex items-center px-3 py-1 rounded-full text-sm font-mono bg-blue-500/20 text-blue-400 border border-blue-500/50 hover:bg-blue-500/30 transition-all duration-300"
                    >
                        <FaFilter className="mr-1" />
                        Advanced
                    </button>

                    {/* Clear Filters */}
                    {hasActiveFilters && (
                        <button
                            onClick={clearFilters}
                            className="flex items-center px-3 py-1 rounded-full text-sm font-mono bg-red-500/20 text-red-400 border border-red-500/50 hover:bg-red-500/30 transition-all duration-300"
                            disabled={loading}
                        >
                            <MdClear className="mr-1" />
                            Clear
                        </button>
                    )}
                </div>

                {/* Right Side - View Mode */}
                <div className="flex items-center bg-black/50 border border-gray-600/50 rounded-lg p-1">
                    <button
                        onClick={() => onViewModeChange('grid')}
                        className={`p-2 rounded transition-all duration-300 ${
                            viewMode === 'grid'
                                ? 'bg-blue-500/20 text-blue-400'
                                : 'text-gray-400 hover:text-blue-400'
                        }`}
                        title="Grid View"
                    >
                        <FaTh />
                    </button>
                    <button
                        onClick={() => onViewModeChange('list')}
                        className={`p-2 rounded transition-all duration-300 ${
                            viewMode === 'list'
                                ? 'bg-blue-500/20 text-blue-400'
                                : 'text-gray-400 hover:text-blue-400'
                        }`}
                        title="List View"
                    >
                        <FaList />
                    </button>
                </div>
            </div>

            {/* Advanced Filters */}
            {showAdvanced && (
                <div className="mt-4 pt-4 border-t border-gray-700/50">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {/* Installation Method */}
                        <div>
                            <label className="block text-sm font-mono text-gray-400 mb-2">
                                Installation Method
                            </label>
                            <select
                                value={filters.jailbreak}
                                onChange={(e) => handleInputChange('jailbreak', e.target.value)}
                                className="w-full px-3 py-2 bg-black/50 border border-gray-600/50 rounded-lg text-white focus:border-blue-500/50 focus:outline-none transition-colors"
                                disabled={loading}
                            >
                                <option value="">All Methods</option>
                                <option value="false">Sideload (No Jailbreak)</option>
                                <option value="true">Jailbreak Required</option>
                            </select>
                        </div>

                        {/* Minimum iOS Version */}
                        <div>
                            <label className="block text-sm font-mono text-gray-400 mb-2">
                                Minimum iOS Version
                            </label>
                            <select
                                value={filters.minIosVersion}
                                onChange={(e) => handleInputChange('minIosVersion', e.target.value)}
                                className="w-full px-3 py-2 bg-black/50 border border-gray-600/50 rounded-lg text-white focus:border-blue-500/50 focus:outline-none transition-colors"
                                disabled={loading}
                            >
                                <option value="">Any Version</option>
                                {iosVersions.map(version => (
                                    <option key={version} value={version}>iOS {version}+</option>
                                ))}
                            </select>
                        </div>

                        {/* Device Compatibility */}
                        <div>
                            <label className="block text-sm font-mono text-gray-400 mb-2">
                                Device Compatibility
                            </label>
                            <select
                                value={filters.deviceCompatibility}
                                onChange={(e) => handleInputChange('deviceCompatibility', e.target.value)}
                                className="w-full px-3 py-2 bg-black/50 border border-gray-600/50 rounded-lg text-white focus:border-blue-500/50 focus:outline-none transition-colors"
                                disabled={loading}
                            >
                                <option value="">All Devices</option>
                                {deviceTypes.map(device => (
                                    <option key={device.value} value={device.value}>{device.label}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Filter Info */}
                    <div className="mt-4 flex flex-wrap gap-2">
                        {filters.jailbreak === 'true' && (
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-mono bg-orange-500/20 text-orange-400 border border-orange-500/30">
                                <MdWarning className="mr-1" />
                                Jailbreak Required
                            </span>
                        )}
                        {filters.jailbreak === 'false' && (
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-mono bg-green-500/20 text-green-400 border border-green-500/30">
                                <FaShieldAlt className="mr-1" />
                                Sideload Compatible
                            </span>
                        )}
                        {filters.minIosVersion && (
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-mono bg-blue-500/20 text-blue-400 border border-blue-500/30">
                                <FaApple className="mr-1" />
                                iOS {filters.minIosVersion}+
                            </span>
                        )}
                        {filters.deviceCompatibility && (
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-mono bg-purple-500/20 text-purple-400 border border-purple-500/30">
                                📱 {filters.deviceCompatibility}
                            </span>
                        )}
                    </div>
                </div>
            )}
        </div>
    )
}
