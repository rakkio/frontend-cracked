'use client'

import { useApps } from '@/hooks/useApps'
import { AppsFilters } from '@/components/apps/AppsFilters'
import { AppsGrid } from '@/components/apps/AppsGrid'
import { AppsPagination } from '@/components/apps/AppsPagination'
import { AppsLoading } from '@/components/apps/AppsLoading'

export default function AppsPageClient({ initialApps, categories, initialPagination }) {
    const {
        // State
        apps,
        loading,
        searchTerm,
        selectedCategory,
        sortBy,
        sortOrder,
        currentPage,
        totalPages,
        totalApps,
        viewMode,
        filters,
        // Actions
        setSearchTerm,
        setCurrentPage,
        setViewMode,
        handleAppClick,
        handleCategoryChange,
        handleFilterChange,
        handleSortChange,
        clearAllFilters
    } = useApps({
        initialApps,
        initialCategories: categories,
        initialPagination
    })

    if (loading) {
        return <AppsLoading />
    }

    return (
        <>
            <AppsFilters
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                selectedCategory={selectedCategory}
                categories={categories}
                handleCategoryChange={handleCategoryChange}
                filters={filters}
                handleFilterChange={handleFilterChange}
                sortBy={sortBy}
                sortOrder={sortOrder}
                handleSortChange={handleSortChange}
                viewMode={viewMode}
                setViewMode={setViewMode}
                clearAllFilters={clearAllFilters}
                totalApps={totalApps}
            />

            <AppsGrid
                apps={apps}
                viewMode={viewMode}
                handleAppClick={handleAppClick}
            />

            <AppsPagination
                currentPage={currentPage}
                totalPages={totalPages}
                setCurrentPage={setCurrentPage}
                totalApps={totalApps}
            />
        </>
    )
}
