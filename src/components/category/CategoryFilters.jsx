import { useState } from 'react'
import { FaSearch, FaFilter, FaSort, FaTrophy, FaFire, FaClock, FaTerminal } from 'react-icons/fa'

export const CategoryFilters = ({ 
    searchTerm, 
    sortBy, 
    sortOrder, 
    filters, 
    onSearchChange, 
    onSortChange, 
    onFilterChange 
}) => {
    const [isFiltersOpen, setIsFiltersOpen] = useState(false)

    const sortOptions = [
        { value: 'createdAt', label: 'Date Created', icon: FaClock },
        { value: 'name', label: 'Name', icon: FaSort },
        { value: 'downloads', label: 'Downloads', icon: FaTrophy },
        { value: 'rating', label: 'Rating', icon: FaFire }
    ]

    const filterOptions = [
        { key: 'featured', label: 'Featured', icon: FaTrophy, color: 'yellow' },
        { key: 'popular', label: 'Popular', icon: FaFire, color: 'red' },
        { key: 'newest', label: 'Newest', icon: FaClock, color: 'green' }
    ]

    return (
        <section className="container mx-auto px-4 py-4">
            <div className="bg-black/80 backdrop-blur-md border-2 border-red-500/50 p-6 relative">
                {/* Terminal corners */}
                <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-red-500"></div>
                <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-red-500"></div>
                <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-red-500"></div>
                <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-red-500"></div>
                
                {/* Terminal Header */}
                <div className="flex items-center space-x-2 mb-6">
                    <FaTerminal className="text-red-500" />
                    <span className="text-green-400 font-mono text-sm">root@filters:~#</span>
                    <span className="text-gray-400 font-mono text-sm">./search_and_filter.sh</span>
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Search Bar */}
                    <div className="lg:col-span-2">
                        <div className="relative group">
                            <div className="absolute inset-0 bg-gradient-to-r from-red-500/20 to-orange-500/20 blur-sm group-focus-within:blur-none transition-all"></div>
                            <div className="relative bg-gray-900/90 border-2 border-red-500/50 backdrop-blur-sm">
                                <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-red-500"></div>
                                <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-red-500"></div>
                                <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-red-500"></div>
                                <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-red-500"></div>
                                
                                <input
                                    type="text"
                                    placeholder="> search_apps --query=''"
                                    value={searchTerm}
                                    onChange={(e) => onSearchChange(e.target.value)}
                                    className="w-full px-4 py-3 bg-transparent text-green-400 placeholder-gray-500 font-mono focus:outline-none focus:text-red-400 transition-colors"
                                />
                                <button className="absolute right-2 top-1/2 transform -translate-y-1/2 text-red-500 hover:text-red-400 transition-colors p-2 hover:bg-red-500/10">
                                    <FaSearch />
                                </button>
                            </div>
                        </div>
                    </div>
                    
                    {/* Filters Toggle */}
                    <div className="flex justify-end">
                        <button
                            onClick={() => setIsFiltersOpen(!isFiltersOpen)}
                            className="flex items-center space-x-2 px-4 py-3 bg-red-500/20 border-2 border-red-500/50 hover:border-red-500 text-red-400 hover:text-red-300 transition-all duration-300 font-mono"
                        >
                            <FaFilter className={`transition-transform ${isFiltersOpen ? 'rotate-180' : ''}`} />
                            <span>FILTERS</span>
                        </button>
                    </div>
                </div>
                
                {/* Expanded Filters */}
                {isFiltersOpen && (
                    <div className="mt-6 pt-6 border-t-2 border-red-500/30">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Sort Options */}
                            <div>
                                <h3 className="text-red-400 font-mono text-sm mb-3 uppercase tracking-wider">Sort By</h3>
                                <div className="grid grid-cols-2 gap-2">
                                    {sortOptions.map((option) => {
                                        const Icon = option.icon
                                        const isActive = sortBy === option.value
                                        return (
                                            <button
                                                key={option.value}
                                                onClick={() => onSortChange(option.value)}
                                                className={`flex items-center space-x-2 px-3 py-2 border-2 transition-all duration-300 font-mono text-xs ${
                                                    isActive 
                                                        ? 'border-red-500 bg-red-500/20 text-red-300' 
                                                        : 'border-gray-600 hover:border-red-500/50 text-gray-400 hover:text-red-400'
                                                }`}
                                            >
                                                <Icon />
                                                <span>{option.label}</span>
                                                {isActive && (
                                                    <span className="text-xs">
                                                        {sortOrder === 'asc' ? '↑' : '↓'}
                                                    </span>
                                                )}
                                            </button>
                                        )
                                    })}
                                </div>
                            </div>
                            
                            {/* Filter Options */}
                            <div>
                                <h3 className="text-red-400 font-mono text-sm mb-3 uppercase tracking-wider">Filters</h3>
                                <div className="space-y-2">
                                    {filterOptions.map((filter) => {
                                        const Icon = filter.icon
                                        const isActive = filters[filter.key]
                                        return (
                                            <button
                                                key={filter.key}
                                                onClick={() => onFilterChange(filter.key)}
                                                className={`flex items-center space-x-2 px-3 py-2 border-2 transition-all duration-300 font-mono text-xs w-full ${
                                                    isActive 
                                                        ? `border-${filter.color}-500 bg-${filter.color}-500/20 text-${filter.color}-300` 
                                                        : 'border-gray-600 hover:border-red-500/50 text-gray-400 hover:text-red-400'
                                                }`}
                                            >
                                                <Icon />
                                                <span>{filter.label}</span>
                                                {isActive && <span className="ml-auto text-green-400">✓</span>}
                                            </button>
                                        )
                                    })}
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </section>
    )
}