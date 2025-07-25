'use client'

import { Suspense } from 'react'
import { useApps } from '@/hooks/useApps'
import { AppsSEO } from '@/components/seo/AppsSEO'
import { AppsHeader } from '@/components/apps/AppsHeader'
import { AppsFilters } from '@/components/apps/AppsFilters'
import { AppsGrid } from '@/components/apps/AppsGrid'
import { AppsPagination } from '@/components/apps/AppsPagination'
import { AppsLoading } from '@/components/apps/AppsLoading'

function AppsContent() {
    const {
        // State
        apps,
        categories,
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
    } = useApps()

    if (loading) {
        return <AppsLoading />
    }

    return (
        <>
            <AppsSEO 
                apps={apps}
                searchTerm={searchTerm}
                selectedCategory={selectedCategory}
                filters={filters}
            />

            <main className="min-h-screen bg-black" itemScope itemType="https://schema.org/CollectionPage">
                <AppsHeader 
                    searchTerm={searchTerm}
                    appsCount={totalApps}
                />

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
            </main>
        </>
    )
}

export default function AppsPage() {
    return (
        <Suspense fallback={<AppsLoading />}>
            <AppsContent />
        </Suspense>
    )
}