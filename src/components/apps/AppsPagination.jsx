import { FaChevronLeft, FaChevronRight, FaEllipsisH } from 'react-icons/fa'

export const AppsPagination = ({ currentPage, totalPages, setCurrentPage, totalApps }) => {
    if (totalPages <= 1) return null

    const getPageNumbers = () => {
        const pages = []
        const maxVisible = 5
        
        if (totalPages <= maxVisible) {
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i)
            }
        } else {
            if (currentPage <= 3) {
                for (let i = 1; i <= 4; i++) pages.push(i)
                pages.push('...')
                pages.push(totalPages)
            } else if (currentPage >= totalPages - 2) {
                pages.push(1)
                pages.push('...')
                for (let i = totalPages - 3; i <= totalPages; i++) pages.push(i)
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
        <div className="flex flex-col items-center space-y-6 py-12">
            {/* Results Info */}
            <div className="text-center">
                <p className="text-gray-600 text-lg font-medium">
                    Showing <span className="font-bold text-blue-600">{startItem}-{endItem}</span> of{' '}
                    <span className="font-bold text-blue-600">{totalApps}</span> applications
                </p>
            </div>

            {/* Pagination Controls */}
            <div className="flex items-center space-x-2">
                {/* Previous Button */}
                <button
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className="flex items-center space-x-2 px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 hover:border-gray-400 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:border-gray-300 transition-all duration-200 font-medium shadow-sm"
                >
                    <FaChevronLeft className="text-sm" />
                    <span>Previous</span>
                </button>
                
                {/* Page Numbers */}
                {getPageNumbers().map((page, index) => (
                    page === '...' ? (
                        <div key={index} className="flex items-center justify-center px-3 py-2">
                            <FaEllipsisH className="text-gray-400" />
                        </div>
                    ) : (
                        <button
                            key={index}
                            onClick={() => setCurrentPage(page)}
                            className={`px-4 py-2 font-medium transition-all duration-200 border rounded-lg min-w-[44px] shadow-sm ${
                                currentPage === page
                                    ? 'bg-blue-600 border-blue-600 text-white shadow-md'
                                    : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400'
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
                    className="flex items-center space-x-2 px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 hover:border-gray-400 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:border-gray-300 transition-all duration-200 font-medium shadow-sm"
                >
                    <span>Next</span>
                    <FaChevronRight className="text-sm" />
                </button>
            </div>

            {/* Page Info */}
            <div className="text-center">
                <p className="text-sm text-gray-500">
                    Page <span className="font-semibold text-gray-700">{currentPage}</span> of{' '}
                    <span className="font-semibold text-gray-700">{totalPages}</span>
                </p>
            </div>
        </div>
    )
}