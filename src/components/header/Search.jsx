'use client'
import React from 'react'
import { FaSearch } from 'react-icons/fa'
import { useSearch } from '@/hooks/useSearch'
import SearchDropdown from './SearchDropdown'

export default function Search({ onSearchClick }) {
    const {
        isSearchOpen,
        searchQuery,
        searchResults,
        searchLoading,
        categories,
        recentSearches,
        handleSearchChange,
        handleQuickSearch,
        handleCategoryClick,
        handleAppClick,
        handleSearchSubmit,
        handleKeyPress,
        openSearch,
        closeSearch,
        removeFromRecentSearches
    } = useSearch()

    const handleInputClick = () => {
        openSearch()
        if (onSearchClick) {
            onSearchClick()
        }
    }

    return (
        <div className="relative w-full">
            {/* Search Input */}
            <div className="relative group w-full">
                <div className="absolute inset-0 bg-gradient-to-r from-red-500/20 to-orange-500/20 blur-sm group-focus-within:blur-none transition-all"></div>
                <div className="relative bg-gray-900/90 border border-red-500/50 rounded-none backdrop-blur-sm">
                    <div className="absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 border-red-500"></div>
                    <div className="absolute top-0 right-0 w-2 h-2 border-t-2 border-r-2 border-red-500"></div>
                    <div className="absolute bottom-0 left-0 w-2 h-2 border-b-2 border-l-2 border-red-500"></div>
                    <div className="absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2 border-red-500"></div>
                    
                    <input
                        type="text"
                        placeholder="> search_apps --query"
                        value={searchQuery}
                        onChange={(e) => handleSearchChange(e.target.value)}
                        onKeyPress={handleKeyPress}
                        onClick={handleInputClick}
                        className="w-full px-4 py-2 md:py-3 bg-transparent text-green-400 placeholder-gray-500 font-mono focus:outline-none focus:text-red-400 transition-colors text-sm cursor-pointer"
                        readOnly
                    />
                    <button
                        onClick={handleInputClick}
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 text-red-500 hover:text-red-400 transition-colors p-2 hover:bg-red-500/10 rounded z-[10]"
                    >
                        <FaSearch />
                    </button>
                </div>
            </div>

            {/* Search Dropdown */}
            <SearchDropdown
                isOpen={isSearchOpen}
                searchQuery={searchQuery}
                searchResults={searchResults}
                searchLoading={searchLoading}
                categories={categories}
                recentSearches={recentSearches}
                onClose={closeSearch}
                onSearch={handleSearchChange}
                onCategoryClick={handleCategoryClick}
                onAppClick={handleAppClick}
                onQuickSearch={handleQuickSearch}
                onRemoveSearch={removeFromRecentSearches}
            />
        </div>
    )
}
