'use client'

import { memo } from 'react'
import { FaChevronLeft, FaChevronRight, FaAngleDoubleLeft, FaAngleDoubleRight, FaTerminal } from 'react-icons/fa'

/**
 * CategoryPagination component - Single Responsibility: Handle page navigation
 * Follows SOLID principles with clean separation of concerns
 */
export const CategoryPagination = memo(({ 
    currentPage = 1, 
    totalPages = 1, 
    onPageChange,
    className = ''
}) => {
    // Don't render if there's only one page or no pages
    if (totalPages <= 1) {
        return null
    }

    const handlePageChange = (page) => {
        if (page >= 1 && page <= totalPages && page !== currentPage) {
            if (onPageChange) {
                onPageChange(page)
            }
        }
    }

    // Generate page numbers to display
    const getPageNumbers = () => {
        const pages = []
        const maxVisiblePages = 7
        
        if (totalPages <= maxVisiblePages) {
            // Show all pages if total is small
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i)
            }
        } else {
            // Show smart pagination
            if (currentPage <= 4) {
                // Show first 5 pages + ... + last page
                for (let i = 1; i <= 5; i++) {
                    pages.push(i)
                }
                pages.push('...')
                pages.push(totalPages)
            } else if (currentPage >= totalPages - 3) {
                // Show first page + ... + last 5 pages
                pages.push(1)
                pages.push('...')
                for (let i = totalPages - 4; i <= totalPages; i++) {
                    pages.push(i)
                }
            } else {
                // Show first + ... + current-1, current, current+1 + ... + last
                pages.push(1)
                pages.push('...')
                for (let i = currentPage - 1; i <= currentPage + 1; i++) {
                    pages.push(i)
                }
                pages.push('...')
                pages.push(totalPages)
            }
        }
        
        return pages
    }

    const pageNumbers = getPageNumbers()

    return (
        <section className={`py-16 px-4 relative ${className}`}>
            <div className="container mx-auto max-w-4xl">
                {/* Terminal Style Pagination */}
                <div className="bg-black/90 border-2 border-red-500 p-6 relative">
                    {/* Terminal corners */}
                    <div className="absolute top-3 left-3 w-6 h-6 border-l-2 border-t-2 border-red-400"></div>
                    <div className="absolute top-3 right-3 w-6 h-6 border-r-2 border-t-2 border-red-400"></div>
                    <div className="absolute bottom-3 left-3 w-6 h-6 border-l-2 border-b-2 border-red-400"></div>
                    <div className="absolute bottom-3 right-3 w-6 h-6 border-r-2 border-b-2 border-red-400"></div>
                    
                    {/* Scan lines effect */}
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-red-500/5 to-transparent opacity-30 pointer-events-none"></div>
                    
                    <div className="relative z-10">
                        {/* Pagination Header */}
                        <div className="flex items-center justify-center mb-6">
                            <FaTerminal className="text-red-500 mr-2" />
                            <span className="text-red-400 font-mono text-sm">
                                [PAGINATION_SYSTEM] Page {currentPage} of {totalPages}
                            </span>
                        </div>
                        
                        {/* Pagination Controls */}
                        <div className="flex items-center justify-center space-x-2 flex-wrap gap-2">
                            {/* First Page */}
                            <button
                                onClick={() => handlePageChange(1)}
                                disabled={currentPage === 1}
                                className={`
                                    flex items-center justify-center w-10 h-10 border-2 transition-all duration-300 font-mono text-sm
                                    ${currentPage === 1 
                                        ? 'border-gray-600 text-gray-600 cursor-not-allowed' 
                                        : 'border-red-500/50 text-red-400 hover:border-red-500 hover:bg-red-500/10 hover:text-white'
                                    }
                                `}
                                aria-label="First page"
                            >
                                <FaAngleDoubleLeft />
                            </button>
                            
                            {/* Previous Page */}
                            <button
                                onClick={() => handlePageChange(currentPage - 1)}
                                disabled={currentPage === 1}
                                className={`
                                    flex items-center justify-center w-10 h-10 border-2 transition-all duration-300 font-mono text-sm
                                    ${currentPage === 1 
                                        ? 'border-gray-600 text-gray-600 cursor-not-allowed' 
                                        : 'border-red-500/50 text-red-400 hover:border-red-500 hover:bg-red-500/10 hover:text-white'
                                    }
                                `}
                                aria-label="Previous page"
                            >
                                <FaChevronLeft />
                            </button>
                            
                            {/* Page Numbers */}
                            {pageNumbers.map((page, index) => {
                                if (page === '...') {
                                    return (
                                        <span 
                                            key={`ellipsis-${index}`}
                                            className="flex items-center justify-center w-10 h-10 text-gray-500 font-mono"
                                        >
                                            ...
                                        </span>
                                    )
                                }
                                
                                const isActive = page === currentPage
                                
                                return (
                                    <button
                                        key={page}
                                        onClick={() => handlePageChange(page)}
                                        className={`
                                            flex items-center justify-center w-10 h-10 border-2 transition-all duration-300 font-mono text-sm
                                            ${isActive 
                                                ? 'border-red-500 bg-red-500/20 text-red-300' 
                                                : 'border-red-500/50 text-red-400 hover:border-red-500 hover:bg-red-500/10 hover:text-white'
                                            }
                                        `}
                                        aria-label={`Page ${page}`}
                                        aria-current={isActive ? 'page' : undefined}
                                    >
                                        {page}
                                    </button>
                                )
                            })}
                            
                            {/* Next Page */}
                            <button
                                onClick={() => handlePageChange(currentPage + 1)}
                                disabled={currentPage === totalPages}
                                className={`
                                    flex items-center justify-center w-10 h-10 border-2 transition-all duration-300 font-mono text-sm
                                    ${currentPage === totalPages 
                                        ? 'border-gray-600 text-gray-600 cursor-not-allowed' 
                                        : 'border-red-500/50 text-red-400 hover:border-red-500 hover:bg-red-500/10 hover:text-white'
                                    }
                                `}
                                aria-label="Next page"
                            >
                                <FaChevronRight />
                            </button>
                            
                            {/* Last Page */}
                            <button
                                onClick={() => handlePageChange(totalPages)}
                                disabled={currentPage === totalPages}
                                className={`
                                    flex items-center justify-center w-10 h-10 border-2 transition-all duration-300 font-mono text-sm
                                    ${currentPage === totalPages 
                                        ? 'border-gray-600 text-gray-600 cursor-not-allowed' 
                                        : 'border-red-500/50 text-red-400 hover:border-red-500 hover:bg-red-500/10 hover:text-white'
                                    }
                                `}
                                aria-label="Last page"
                            >
                                <FaAngleDoubleRight />
                            </button>
                        </div>
                        
                        {/* Page Info */}
                        <div className="mt-6 text-center">
                            <div className="text-gray-400 font-mono text-xs">
                                <span className="text-green-400">root@system:~#</span> 
                                <span className="text-red-400">navigate_pages</span> 
                                <span className="text-yellow-400">--current={currentPage}</span> 
                                <span className="text-blue-400">--total={totalPages}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
})

CategoryPagination.displayName = 'CategoryPagination'