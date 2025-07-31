'use client'

import { useState } from 'react'
import { FaSearch, FaFilter, FaTh, FaList, FaGamepad, FaTrophy, FaWindows, FaApple, FaLinux } from 'react-icons/fa'
import { MdClear } from 'react-icons/md'

export default function GamesFilters({ 
    filters, 
    onFilterChange, 
    viewMode, 
    onViewModeChange, 
    loading = false 
}) {
    const [showAdvanced, setShowAdvanced] = useState(false)

    const genres = [
        'Action', 'Adventure', 'RPG', 'Strategy', 'Simulation', 'Sports',
        'Racing', 'Puzzle', 'Platformer', 'Fighting', 'Shooter', 'Horror',
        'Survival', 'Sandbox', 'MMORPG', 'Indie', 'Casual', 'Educational'
    ]

    const platforms = [
        { value: 'windows', label: 'Windows', icon: <FaWindows /> },
        { value: 'mac', label: 'macOS', icon: <FaApple /> },
        { value: 'linux', label: 'Linux', icon: <FaLinux /> }
    ]

    const esrbRatings = [
        { value: 'E', label: 'Everyone' },
        { value: 'E10+', label: 'Everyone 10+' },
        { value: 'T', label: 'Teen' },
        { value: 'M', label: 'Mature 17+' },
        { value: 'AO', label: 'Adults Only' }
    ]

    const gameModes = [
        'Single-player', 'Multiplayer', 'Co-op', 'Online', 'Local',
        'Split-screen', 'Cross-platform', 'VR', 'Controller Support'
    ]

    const sortOptions = [
        { value: 'createdAt', label: 'Date Added' },
        { value: 'name', label: 'Name' },
        { value: 'downloads', label: 'Downloads' },
        { value: 'rating', label: 'Rating' },
        { value: 'views', label: 'Views' },
        { value: 'releaseYear', label: 'Release Year' },
        { value: 'fileSize', label: 'File Size' }
    ]

    // Generate year options (current year back to 1990)
    const currentYear = new Date().getFullYear()
    const years = Array.from({ length: currentYear - 1989 }, (_, i) => currentYear - i)

    const handleInputChange = (key, value) => {
        onFilterChange({ [key]: value })
    }

    const clearFilters = () => {
        onFilterChange({
            search: '',
            category: '',
            genre: '',
            featured: false,
            platform: '',
            releaseYear: '',
            esrbRating: '',
            gameMode: '',
            sort: 'createdAt',
            order: 'desc'
        })
    }

    const hasActiveFilters = filters.search || filters.category || filters.genre || 
                            filters.featured || filters.platform || filters.releaseYear || 
                            filters.esrbRating || filters.gameMode

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
                            placeholder="Search PC games..."
                            value={filters.search}
                            onChange={(e) => handleInputChange('search', e.target.value)}
                            className="w-full pl-10 pr-4 py-2 bg-black/50 border border-gray-600/50 rounded-lg text-white placeholder-gray-400 focus:border-purple-500/50 focus:outline-none transition-colors"
                            disabled={loading}
                        />
                    </div>
                </div>

                {/* Genre */}
                <div className="lg:w-48">
                    <select
                        value={filters.genre}
                        onChange={(e) => handleInputChange('genre', e.target.value)}
                        className="w-full px-3 py-2 bg-black/50 border border-gray-600/50 rounded-lg text-white focus:border-purple-500/50 focus:outline-none transition-colors"
                        disabled={loading}
                    >
                        <option value="">All Genres</option>
                        {genres.map(genre => (
                            <option key={genre} value={genre}>{genre}</option>
                        ))}
                    </select>
                </div>

                {/* Sort */}
                <div className="lg:w-40">
                    <select
                        value={filters.sort}
                        onChange={(e) => handleInputChange('sort', e.target.value)}
                        className="w-full px-3 py-2 bg-black/50 border border-gray-600/50 rounded-lg text-white focus:border-purple-500/50 focus:outline-none transition-colors"
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
                        className="w-full px-3 py-2 bg-black/50 border border-gray-600/50 rounded-lg text-white focus:border-purple-500/50 focus:outline-none transition-colors"
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
                        <FaTrophy className="inline mr-1" />
                        Featured
                    </button>

                    {/* Advanced Filters Toggle */}
                    <button
                        onClick={() => setShowAdvanced(!showAdvanced)}
                        className="flex items-center px-3 py-1 rounded-full text-sm font-mono bg-purple-500/20 text-purple-400 border border-purple-500/50 hover:bg-purple-500/30 transition-all duration-300"
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
                                ? 'bg-purple-500/20 text-purple-400'
                                : 'text-gray-400 hover:text-purple-400'
                        }`}
                        title="Grid View"
                    >
                        <FaTh />
                    </button>
                    <button
                        onClick={() => onViewModeChange('list')}
                        className={`p-2 rounded transition-all duration-300 ${
                            viewMode === 'list'
                                ? 'bg-purple-500/20 text-purple-400'
                                : 'text-gray-400 hover:text-purple-400'
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
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {/* Platform */}
                        <div>
                            <label className="block text-sm font-mono text-gray-400 mb-2">
                                Platform
                            </label>
                            <select
                                value={filters.platform}
                                onChange={(e) => handleInputChange('platform', e.target.value)}
                                className="w-full px-3 py-2 bg-black/50 border border-gray-600/50 rounded-lg text-white focus:border-purple-500/50 focus:outline-none transition-colors"
                                disabled={loading}
                            >
                                <option value="">All Platforms</option>
                                {platforms.map(platform => (
                                    <option key={platform.value} value={platform.value}>
                                        {platform.label}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Release Year */}
                        <div>
                            <label className="block text-sm font-mono text-gray-400 mb-2">
                                Release Year
                            </label>
                            <select
                                value={filters.releaseYear}
                                onChange={(e) => handleInputChange('releaseYear', e.target.value)}
                                className="w-full px-3 py-2 bg-black/50 border border-gray-600/50 rounded-lg text-white focus:border-purple-500/50 focus:outline-none transition-colors"
                                disabled={loading}
                            >
                                <option value="">Any Year</option>
                                {years.map(year => (
                                    <option key={year} value={year}>{year}</option>
                                ))}
                            </select>
                        </div>

                        {/* ESRB Rating */}
                        <div>
                            <label className="block text-sm font-mono text-gray-400 mb-2">
                                ESRB Rating
                            </label>
                            <select
                                value={filters.esrbRating}
                                onChange={(e) => handleInputChange('esrbRating', e.target.value)}
                                className="w-full px-3 py-2 bg-black/50 border border-gray-600/50 rounded-lg text-white focus:border-purple-500/50 focus:outline-none transition-colors"
                                disabled={loading}
                            >
                                <option value="">Any Rating</option>
                                {esrbRatings.map(rating => (
                                    <option key={rating.value} value={rating.value}>
                                        {rating.label}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Game Mode */}
                        <div>
                            <label className="block text-sm font-mono text-gray-400 mb-2">
                                Game Mode
                            </label>
                            <select
                                value={filters.gameMode}
                                onChange={(e) => handleInputChange('gameMode', e.target.value)}
                                className="w-full px-3 py-2 bg-black/50 border border-gray-600/50 rounded-lg text-white focus:border-purple-500/50 focus:outline-none transition-colors"
                                disabled={loading}
                            >
                                <option value="">Any Mode</option>
                                {gameModes.map(mode => (
                                    <option key={mode} value={mode}>{mode}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Filter Info */}
                    <div className="mt-4 flex flex-wrap gap-2">
                        {filters.platform && (
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-mono bg-blue-500/20 text-blue-400 border border-blue-500/30">
                                {platforms.find(p => p.value === filters.platform)?.icon}
                                <span className="ml-1">{platforms.find(p => p.value === filters.platform)?.label}</span>
                            </span>
                        )}
                        {filters.releaseYear && (
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-mono bg-green-500/20 text-green-400 border border-green-500/30">
                                📅 {filters.releaseYear}
                            </span>
                        )}
                        {filters.esrbRating && (
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-mono bg-orange-500/20 text-orange-400 border border-orange-500/30">
                                🔞 {filters.esrbRating}
                            </span>
                        )}
                        {filters.gameMode && (
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-mono bg-purple-500/20 text-purple-400 border border-purple-500/30">
                                <FaGamepad className="mr-1" />
                                {filters.gameMode}
                            </span>
                        )}
                    </div>
                </div>
            )}
        </div>
    )
}
