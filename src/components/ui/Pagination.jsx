import { FaChevronLeft, FaChevronRight } from 'react-icons/fa'

export default function Pagination({ currentPage, totalPages, onPageChange }) {
    if (totalPages <= 1) return null

    const getVisiblePages = () => {
        const delta = 2
        const range = []
        const rangeWithDots = []

        for (let i = Math.max(2, currentPage - delta); i <= Math.min(totalPages - 1, currentPage + delta); i++) {
            range.push(i)
        }

        if (currentPage - delta > 2) {
            rangeWithDots.push(1, '...')
        } else {
            rangeWithDots.push(1)
        }

        rangeWithDots.push(...range)

        if (currentPage + delta < totalPages - 1) {
            rangeWithDots.push('...', totalPages)
        } else {
            rangeWithDots.push(totalPages)
        }

        return rangeWithDots
    }

    const visiblePages = getVisiblePages()

    return (
        <div className="flex items-center justify-center space-x-2">
            {/* Previous Button */}
            <button
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all ${
                    currentPage === 1
                        ? 'bg-gray-700/50 text-gray-500 cursor-not-allowed'
                        : 'bg-gray-700/50 text-white hover:bg-red-600/50 hover:text-white'
                }`}
            >
                <FaChevronLeft className="text-sm" />
                <span className="hidden sm:inline">Previous</span>
            </button>

            {/* Page Numbers */}
            <div className="flex items-center space-x-1">
                {visiblePages.map((page, index) => {
                    if (page === '...') {
                        return (
                            <span
                                key={`dots-${index}`}
                                className="px-3 py-2 text-gray-400"
                            >
                                ...
                            </span>
                        )
                    }

                    return (
                        <button
                            key={page}
                            onClick={() => onPageChange(page)}
                            className={`px-3 py-2 rounded-lg transition-all ${
                                currentPage === page
                                    ? 'bg-red-600 text-white font-bold'
                                    : 'bg-gray-700/50 text-white hover:bg-red-600/50'
                            }`}
                        >
                            {page}
                        </button>
                    )
                })}
            </div>

            {/* Next Button */}
            <button
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all ${
                    currentPage === totalPages
                        ? 'bg-gray-700/50 text-gray-500 cursor-not-allowed'
                        : 'bg-gray-700/50 text-white hover:bg-red-600/50 hover:text-white'
                }`}
            >
                <span className="hidden sm:inline">Next</span>
                <FaChevronRight className="text-sm" />
            </button>
        </div>
    )
}
