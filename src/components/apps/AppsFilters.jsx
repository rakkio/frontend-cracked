import { useState } from 'react'
import { 
    FaSearch, 
    FaTh, 
    FaList, 
    FaFilter, 
    FaSort, 
    FaTimes,
    FaChevronDown,
    FaTerminal,
    FaCode,
    FaBolt
} from 'react-icons/fa'

export const AppsFilters = ({
    searchTerm,
    setSearchTerm,
    selectedCategory,
    categories,
    handleCategoryChange,
    filters,
    handleFilterChange,
    sortBy,
    sortOrder,
    handleSortChange,
    viewMode,
    setViewMode,
    clearAllFilters,
    totalApps
}) => {
    const [showAdvanced, setShowAdvanced] = useState(false)
    
    const activeFiltersCount = Object.values(filters).filter(Boolean).length
    
    return (
        <section className="container mx-auto px-4 py-6">
            {/* Metro UI Hacker Header */}
            <div className="mb-6">
                <div className="flex items-center space-x-3 mb-2">
                    <div className="w-3 h-3 bg-red-500 animate-pulse"></div>
                    <h2 className="text-red-400 font-mono text-sm uppercase tracking-wider">
                        [SYSTEM_FILTERS_ACTIVE]
                    </h2>
                    <div className="flex-1 h-px bg-gradient-to-r from-red-500/50 to-transparent"></div>
                </div>
                <p className="text-gray-400 font-mono text-xs">
                    {totalApps} applications found in database
                </p>
            </div>

            {/* Main Filter Panel */}
            <div className="bg-black/80 border-2 border-red-500/30 rounded-none shadow-2xl shadow-red-500/10 backdrop-blur-sm">
                {/* Header Bar */}
                <div className="bg-gradient-to-r from-red-600 to-red-700 px-4 py-2 flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                        <FaTerminal className="text-white text-sm" />
                        <span className="text-white font-mono text-sm font-bold">FILTER_CONSOLE.EXE</span>
                    </div>
                    <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                        <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                        <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                    </div>
                </div>

                <div className="p-6 space-y-6">
                    {/* Search Bar */}
                    <div className="relative">
                        <div className="absolute left-0 top-0 w-full h-full bg-gradient-to-r from-red-500/10 to-transparent pointer-events-none"></div>
                        <div className="relative flex items-center">
                            <FaSearch className="absolute left-4 text-red-400 text-lg z-10" />
                            <input
                                type="text"
                                placeholder="> SEARCH_APPLICATIONS..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-12 pr-4 py-4 bg-gray-900/50 border-2 border-red-500/30 text-white placeholder-red-300/50 focus:outline-none focus:border-red-400 focus:shadow-lg focus:shadow-red-500/20 font-mono text-lg transition-all duration-300"
                            />
                            {searchTerm && (
                                <button
                                    onClick={() => setSearchTerm('')}
                                    className="absolute right-4 text-red-400 hover:text-red-300 transition-colors z-10"
                                >
                                    <FaTimes />
                                </button>
                            )}
                        </div>
                        <div className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-red-500 via-red-400 to-red-500 opacity-50"></div>
                    </div>

                    {/* Quick Actions Row */}
                    <div className="flex flex-wrap items-center justify-between gap-4">
                        {/* View Mode */}
                        <div className="flex items-center space-x-3">
                            <span className="text-red-400 font-mono text-sm uppercase">VIEW:</span>
                            <div className="flex bg-gray-900/50 border border-red-500/30 overflow-hidden">
                                <button
                                    onClick={() => setViewMode('grid')}
                                    className={`p-3 transition-all duration-300 ${
                                        viewMode === 'grid' 
                                            ? 'bg-red-600 text-white shadow-lg shadow-red-500/30' 
                                            : 'text-red-300 hover:bg-red-500/20 hover:text-white'
                                    }`}
                                >
                                    <FaTh />
                                </button>
                                <button
                                    onClick={() => setViewMode('list')}
                                    className={`p-3 transition-all duration-300 ${
                                        viewMode === 'list' 
                                            ? 'bg-red-600 text-white shadow-lg shadow-red-500/30' 
                                            : 'text-red-300 hover:bg-red-500/20 hover:text-white'
                                    }`}
                                >
                                    <FaList />
                                </button>
                            </div>
                        </div>

                        {/* Advanced Toggle */}
                        <button
                            onClick={() => setShowAdvanced(!showAdvanced)}
                            className="flex items-center space-x-2 px-4 py-2 bg-gray-900/50 border border-red-500/30 text-red-300 hover:bg-red-500/20 hover:text-white transition-all duration-300 font-mono text-sm"
                        >
                            <FaCode />
                            <span>ADVANCED</span>
                            <FaChevronDown className={`transform transition-transform ${
                                showAdvanced ? 'rotate-180' : ''
                            }`} />
                        </button>

                        {/* Clear All */}
                        {(searchTerm || selectedCategory || activeFiltersCount > 0) && (
                            <button
                                onClick={clearAllFilters}
                                className="flex items-center space-x-2 px-4 py-2 bg-red-600/20 border border-red-500/50 text-red-300 hover:bg-red-600/40 hover:text-white transition-all duration-300 font-mono text-sm"
                            >
                                <FaTimes />
                                <span>CLEAR_ALL</span>
                            </button>
                        )}
                    </div>

                    {/* Advanced Filters */}
                    {showAdvanced && (
                        <div className="space-y-4 border-t border-red-500/20 pt-6">
                            {/* Category Filter */}
                            <div className="flex flex-col space-y-2">
                                <label className="text-red-400 font-mono text-sm uppercase">CATEGORY_FILTER:</label>
                                <select
                                    value={selectedCategory}
                                    onChange={(e) => handleCategoryChange(e.target.value)}
                                    className="bg-gray-900/50 border-2 border-red-500/30 px-4 py-3 text-white focus:outline-none focus:border-red-400 font-mono transition-all duration-300"
                                >
                                    <option value="">ALL_CATEGORIES</option>
                                    {categories.map(category => (
                                        <option key={category._id} value={category._id}>
                                            {category.name.toUpperCase()}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Quick Filters */}
                            <div className="space-y-2">
                                <label className="text-red-400 font-mono text-sm uppercase">QUICK_FILTERS:</label>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                                    {Object.entries({
                                        featured: 'FEATURED',
                                        popular: 'POPULAR',
                                        newest: 'NEWEST',
                                        topRated: 'TOP_RATED'
                                    }).map(([key, label]) => (
                                        <button
                                            key={key}
                                            onClick={() => handleFilterChange(key)}
                                            className={`p-3 font-mono text-sm transition-all duration-300 border-2 ${
                                                filters[key]
                                                    ? 'bg-red-600 border-red-400 text-white shadow-lg shadow-red-500/30'
                                                    : 'bg-gray-900/50 border-red-500/30 text-red-300 hover:bg-red-500/20 hover:border-red-400 hover:text-white'
                                            }`}
                                        >
                                            <div className="flex items-center justify-center space-x-2">
                                                <FaBolt className="text-xs" />
                                                <span>{label}</span>
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Sort Options */}
                            <div className="space-y-2">
                                <label className="text-red-400 font-mono text-sm uppercase">SORT_ALGORITHM:</label>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                                    {[
                                        { key: 'createdAt', label: 'DATE' },
                                        { key: 'name', label: 'NAME' },
                                        { key: 'downloads', label: 'DOWNLOADS' },
                                        { key: 'rating', label: 'RATING' }
                                    ].map(({ key, label }) => (
                                        <button
                                            key={key}
                                            onClick={() => handleSortChange(key)}
                                            className={`p-3 font-mono text-sm transition-all duration-300 border-2 ${
                                                sortBy === key
                                                    ? 'bg-red-600 border-red-400 text-white shadow-lg shadow-red-500/30'
                                                    : 'bg-gray-900/50 border-red-500/30 text-red-300 hover:bg-red-500/20 hover:border-red-400 hover:text-white'
                                            }`}
                                        >
                                            <div className="flex items-center justify-center space-x-2">
                                                <span>{label}</span>
                                                {sortBy === key && (
                                                    <FaSort className={`text-xs transform ${
                                                        sortOrder === 'asc' ? 'rotate-180' : ''
                                                    }`} />
                                                )}
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Status Bar */}
                <div className="bg-red-600/20 border-t border-red-500/30 px-4 py-2 flex items-center justify-between">
                    <div className="flex items-center space-x-4 text-xs font-mono">
                        <span className="text-red-400">STATUS:</span>
                        <span className="text-green-400">ONLINE</span>
                        <span className="text-red-400">FILTERS:</span>
                        <span className="text-white">{activeFiltersCount}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-green-400 animate-pulse rounded-full"></div>
                        <span className="text-green-400 text-xs font-mono">CONNECTED</span>
                    </div>
                </div>
            </div>
        </section>
    )
}