import { FaChevronLeft, FaChevronRight, FaEllipsisH } from 'react-icons/fa'

export const AppsPagination = ({ currentPage, totalPages, setCurrentPage, totalApps }) => {
    if (totalPages <= 1) return null

    const getPageNumbers = () => {
        const pages = []
        const maxVisible = 7
        
        if (totalPages <= maxVisible) {
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i)
            }
        } else {
            if (currentPage <= 4) {
                for (let i = 1; i <= 5; i++) pages.push(i)
                pages.push('...')
                pages.push(totalPages)
            } else if (currentPage >= totalPages - 3) {
                pages.push(1)
                pages.push('...')
                for (let i = totalPages - 4; i <= totalPages; i++) pages.push(i)
            } else {
                pages.push(1)
                pages.push('...')
                for (let i = currentPage - 1; i <= currentPage + 1; i++) pages.push(i)
                pages.push('...')
                pages.push(totalPages)
            }
        }
        
        return pages
    }

    const startItem = (currentPage - 1) * 20 + 1
    const endItem = Math.min(currentPage * 20, totalApps)

    return (
        <section className="container mx-auto px-4 py-8">
            {/* Metro UI Header */}
            <div className="mb-6">
                <div className="flex items-center space-x-3 mb-2">
                    <div className="w-3 h-3 bg-red-500 animate-pulse"></div>
                    <h3 className="text-red-400 font-mono text-sm uppercase tracking-wider">
                        [PAGINATION_SYSTEM]
                    </h3>
                    <div className="flex-1 h-px bg-gradient-to-r from-red-500/50 to-transparent"></div>
                </div>
                <p className="text-gray-400 font-mono text-xs">
                    Showing {startItem}-{endItem} of {totalApps} applications
                </p>
            </div>

            {/* Pagination Panel */}
            <div className="bg-black/80 border-2 border-red-500/30 rounded-none shadow-2xl shadow-red-500/10">
                {/* Header Bar */}
                <div className="bg-gradient-to-r from-red-600 to-red-700 px-4 py-2 flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                        <span className="text-white font-mono text-sm font-bold">PAGE_NAVIGATOR.EXE</span>
                    </div>
                    <div className="text-white font-mono text-xs">
                        {currentPage}/{totalPages}
                    </div>
                </div>

                <div className="p-6">
                    <div className="flex items-center justify-center space-x-2">
                        {/* Previous Button */}
                        <button
                            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                            disabled={currentPage === 1}
                            className="flex items-center space-x-2 px-4 py-3 bg-gray-900/50 border-2 border-red-500/30 text-red-300 hover:bg-red-500/20 hover:border-red-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-gray-900/50 disabled:hover:border-red-500/30 disabled:hover:text-red-300 transition-all duration-300 font-mono text-sm"
                        >
                            <FaChevronLeft className="text-xs" />
                            <span>PREV</span>
                        </button>
                        
                        {/* Page Numbers */}
                        {getPageNumbers().map((page, index) => (
                            page === '...' ? (
                                <div key={index} className="flex items-center justify-center px-3 py-3">
                                    <FaEllipsisH className="text-red-400 text-xs" />
                                </div>
                            ) : (
                                <button
                                    key={index}
                                    onClick={() => setCurrentPage(page)}
                                    className={`px-4 py-3 font-mono text-sm transition-all duration-300 border-2 min-w-[50px] ${
                                        currentPage === page
                                            ? 'bg-red-600 border-red-400 text-white shadow-lg shadow-red-500/30'
                                            : 'bg-gray-900/50 border-red-500/30 text-red-300 hover:bg-red-500/20 hover:border-red-400 hover:text-white'
                                    }`}
                                >
                                    {page}
                                </button>
                            )
                        ))}
                        
                        {/* Next Button */}
                        <button
                            onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                            disabled={currentPage === totalPages}
                            className="flex items-center space-x-2 px-4 py-3 bg-gray-900/50 border-2 border-red-500/30 text-red-300 hover:bg-red-500/20 hover:border-red-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-gray-900/50 disabled:hover:border-red-500/30 disabled:hover:text-red-300 transition-all duration-300 font-mono text-sm"
                        >
                            <span>NEXT</span>
                            <FaChevronRight className="text-xs" />
                        </button>
                    </div>
                </div>

                {/* Status Bar */}
                <div className="bg-red-600/20 border-t border-red-500/30 px-4 py-2 flex items-center justify-between">
                    <div className="flex items-center space-x-4 text-xs font-mono">
                        <span className="text-red-400">CURRENT:</span>
                        <span className="text-white">{currentPage}</span>
                        <span className="text-red-400">TOTAL:</span>
                        <span className="text-white">{totalPages}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-green-400 animate-pulse rounded-full"></div>
                        <span className="text-green-400 text-xs font-mono">ACTIVE</span>
                    </div>
                </div>
            </div>
        </section>
    )
}