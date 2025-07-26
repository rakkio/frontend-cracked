'use client'
import React from 'react'
import { FaSearch } from 'react-icons/fa'
import { useSearch } from '@/hooks/useSearch'
import SearchDropdown from './SearchDropdown'

export default function MobileSearchButton() {
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
        openSearch,
        closeSearch,
        removeFromRecentSearches
    } = useSearch()

    return (
        <>
            <button
                onClick={openSearch}
                className="md:hidden p-2 text-red-500 hover:text-red-400 border border-red-500/50 hover:border-red-500 transition-all duration-300 z-[10]"
            >
                <FaSearch />
            </button>

            {/* Search Dropdown for Mobile */}
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
        </>
    )
} 