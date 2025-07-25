import { CategoryBreadcrumb } from './CategoryBreadcrumb'
import { CategoryHeader } from './CategoryHeader'
import { CategoryFilters } from './CategoryFilters'
import { CategoryAppsGrid } from './CategoryAppsGrid'
import { CategoryPagination } from './CategoryPagination'
import { MetroBackground } from '@/components/ui/MetroBackground'

export const CategoryPageContainer = ({ 
    category, 
    apps, 
    searchTerm,
    sortBy,
    sortOrder,
    currentPage,
    totalPages,
    filters,
    handleAppClick,
    handleFilterChange,
    handleSortChange,
    handleSearchChange,
    handlePageChange
}) => {
    // Ensure floating code elements are always strings
    const floatingCodeElements = ['sudo access granted', 'root@system:~#', 'exploit.exe', 'bypass.dll', 'crack.bat', 'keygen.exe']
    
    return (
        <main className="min-h-screen relative" itemScope itemType="https://schema.org/CollectionPage">
            
            {/* Matrix Rain Background */}
            <div className="fixed top-0 left-0 w-full h-full pointer-events-none z-0 overflow-hidden">
                <div className="matrix-rain opacity-10"></div>
            <MetroBackground />

            </div>
            
            {/* Scan Lines Effect */}
            <div className="fixed inset-0 bg-gradient-to-b from-transparent via-red-500/5 to-transparent animate-pulse pointer-events-none z-[1]"></div>
            <div className="scan-lines fixed inset-0 pointer-events-none z-[1]"></div>
            
            {/* Floating Code Elements */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none z-[1]">
                <div className="floating-code text-red-500/20 text-xs font-mono">
                    {floatingCodeElements.map((code, i) => (
                        <span key={i} className={`absolute animate-float-${(i % 4) + 1}`} style={{
                            left: `${10 + i * 15}%`,
                            top: `${5 + i * 12}%`,
                            animationDelay: `${i * 0.7}s`
                        }}>
                            {String(code)}
                        </span>
                    ))}
                </div>
            </div>
            
            <div className="relative z-10">
                <CategoryBreadcrumb category={category} />
                <CategoryHeader category={category} apps={apps} />
                <CategoryFilters 
                    searchTerm={searchTerm}
                    sortBy={sortBy}
                    sortOrder={sortOrder}
                    filters={filters}
                    onSearchChange={handleSearchChange}
                    onSortChange={handleSortChange}
                    onFilterChange={handleFilterChange}
                />
                <CategoryAppsGrid 
                    apps={apps || []}
                    onAppClick={handleAppClick}
                />
                <CategoryPagination 
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                />
            </div>
        </main>
    )
}