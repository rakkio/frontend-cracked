import { useState } from 'react'
import { 
    FaSearch, 
    FaTh, 
    FaList, 
    FaFilter, 
    FaSort, 
    FaTimes,
    FaChevronDown
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
        <div className="bg-white border-b border-gray-200 sticky top-0 z-40 shadow-sm">
            <div className="container mx-auto px-4 py-4">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0 lg:space-x-6">
                    
                    {/* Search Bar */}
                    <div className="flex-1 max-w-md">
                        <div className="relative">
                            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search applications..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                            {searchTerm && (
                                <button
                                    onClick={() => setSearchTerm('')}
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                >
                                    <FaTimes />
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Category Filter */}
                    <div className="flex items-center space-x-4">
                        <select
                            value={selectedCategory}
                            onChange={(e) => handleCategoryChange(e.target.value)}
                            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                        >
                            <option value="">All Categories</option>
                            {categories.map((category , index) => (
                                <option key={index} value={category.id}>
                                    {category.name}
                                </option>
                            ))}
                        </select>

                        {/* Sort Dropdown */}
                        <select
                            value={`${sortBy}-${sortOrder}`}
                            onChange={(e) => {
                                const [field, order] = e.target.value.split('-')
                                handleSortChange(field, order)
                            }}
                            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                        >
                            <option value="name-asc">Name A-Z</option>
                            <option value="name-desc">Name Z-A</option>
                            <option value="downloads-desc">Most Downloaded</option>
                            <option value="downloads-asc">Least Downloaded</option>
                            <option value="rating-desc">Highest Rated</option>
                            <option value="rating-asc">Lowest Rated</option>
                            <option value="createdAt-desc">Newest First</option>
                            <option value="createdAt-asc">Oldest First</option>
                        </select>

                        {/* View Mode Toggle */}
                        <div className="flex border border-gray-300 rounded-lg overflow-hidden">
                            <button
                                onClick={() => setViewMode('grid')}
                                className={`px-3 py-2 ${
                                    viewMode === 'grid'
                                        ? 'bg-blue-600 text-white'
                                        : 'bg-white text-gray-600 hover:bg-gray-50'
                                }`}
                            >
                                <FaTh />
                            </button>
                            <button
                                onClick={() => setViewMode('list')}
                                className={`px-3 py-2 ${
                                    viewMode === 'list'
                                        ? 'bg-blue-600 text-white'
                                        : 'bg-white text-gray-600 hover:bg-gray-50'
                                }`}
                            >
                                <FaList />
                            </button>
                        </div>

                        {/* Advanced Filters Toggle */}
                        <button
                            onClick={() => setShowAdvanced(!showAdvanced)}
                            className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                            <FaFilter />
                            <span>Filters</span>
                            {activeFiltersCount > 0 && (
                                <span className="bg-blue-600 text-white text-xs px-2 py-1 rounded-full">
                                    {activeFiltersCount}
                                </span>
                            )}
                            <FaChevronDown className={`transform transition-transform ${showAdvanced ? 'rotate-180' : ''}`} />
                        </button>
                    </div>
                </div>

                {/* Advanced Filters Panel */}
                {showAdvanced && (
                    <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {/* Featured Filter */}
                            <label className="flex items-center space-x-2">
                                <input
                                    type="checkbox"
                                    checked={filters.featured || false}
                                    onChange={(e) => handleFilterChange('featured', e.target.checked)}
                                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                />
                                <span className="text-sm font-medium text-gray-700">Featured Apps</span>
                            </label>

                            {/* Premium Filter */}
                            <label className="flex items-center space-x-2">
                                <input
                                    type="checkbox"
                                    checked={filters.premium || false}
                                    onChange={(e) => handleFilterChange('premium', e.target.checked)}
                                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                />
                                <span className="text-sm font-medium text-gray-700">Premium Apps</span>
                            </label>

                            {/* New Apps Filter */}
                            <label className="flex items-center space-x-2">
                                <input
                                    type="checkbox"
                                    checked={filters.new || false}
                                    onChange={(e) => handleFilterChange('new', e.target.checked)}
                                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                />
                                <span className="text-sm font-medium text-gray-700">New Apps</span>
                            </label>
                        </div>

                        {/* Clear Filters */}
                        {activeFiltersCount > 0 && (
                            <div className="mt-4 flex justify-end">
                                <button
                                    onClick={clearAllFilters}
                                    className="flex items-center space-x-2 px-4 py-2 text-sm text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                                >
                                    <FaTimes />
                                    <span>Clear All Filters</span>
                                </button>
                            </div>
                        )}
                    </div>
                )}

                {/* Results Summary */}
                <div className="mt-4 text-sm text-gray-600">
                    {totalApps} applications found
                    {selectedCategory && (
                        <span> in {categories.find(c => c.id === selectedCategory)?.name}</span>
                    )}
                    {searchTerm && (
                        <span> matching "{searchTerm}"</span>
                    )}
                </div>
            </div>
        </div>
    )
}
