import Image from 'next/image'
import { FaDownload, FaStar, FaEye, FaCrown, FaHeart, FaFire, FaGem, FaClock } from 'react-icons/fa'

// Utility function to format numbers
const formatNumber = (num) => {
    if (!num || num === 0) return '0'
    if (num < 1000) return num.toString()
    if (num < 1000000) return (num / 1000).toFixed(1).replace(/\.0$/, '') + 'K'
    if (num < 1000000000) return (num / 1000000).toFixed(1).replace(/\.0$/, '') + 'M'
    return (num / 1000000000).toFixed(1).replace(/\.0$/, '') + 'B'
}

export const AppsGrid = ({ apps, viewMode, handleAppClick }) => {
    if (apps.length === 0) {
        return (
            <div className="container mx-auto px-4 py-16 text-center">
                <div className="bg-white shadow-xl border border-gray-200 rounded-3xl p-12 hover:shadow-2xl transition-all duration-300">
                    <div className="text-6xl text-gray-400 mb-6">🔍</div>
                    <h3 className="text-3xl font-bold text-gray-800 mb-3">No Apps Found</h3>
                    <p className="text-gray-500 text-lg">Try adjusting your search criteria or filters</p>
                </div>
            </div>
        )
    }

    return (
        <section className="container mx-auto px-4 py-8">
            <div className={`grid gap-8 ${
                viewMode === 'grid' 
                    ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' 
                    : 'grid-cols-1'
            }`}>
                {apps.map((app) => (
                    <AppCard 
                        key={app._id} 
                        app={app} 
                        viewMode={viewMode} 
                        onClick={() => handleAppClick(app)} 
                    />
                ))}
            </div>
        </section>
    )
}

const AppCard = ({ app, viewMode, onClick }) => {
    const cardClasses = viewMode === 'list' 
        ? 'flex items-center space-x-6 p-6'
        : 'flex flex-col p-8'

    return (
        <div 
            className={`bg-white shadow-lg hover:shadow-2xl border border-gray-200 hover:border-blue-300 transition-all duration-500 cursor-pointer group hover:scale-[1.02] rounded-2xl overflow-hidden backdrop-blur-sm ${cardClasses}`}
            onClick={onClick}
        >
            {/* App Icon */}
            <div className={`relative ${
                viewMode === 'list' ? 'w-20 h-20' : 'w-24 h-24 mx-auto mb-6'
            } flex-shrink-0 group-hover:scale-110 transition-transform duration-300`}>
                <Image
                    src={app.images?.[0] || '/placeholder-app.png'}
                    alt={app.name}
                    fill
                    className="rounded-2xl object-cover shadow-md"
                    sizes={viewMode === 'list' ? '80px' : '96px'}
                />
                {app.isPremium && (
                    <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center shadow-lg animate-pulse">
                        <FaCrown className="text-sm text-white" />
                    </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>

            {/* App Info */}
            <div className={`${viewMode === 'list' ? 'flex-1' : 'text-center'}`}>
                <h3 className={`font-bold text-gray-800 group-hover:text-blue-600 transition-colors duration-300 ${
                    viewMode === 'list' ? 'text-xl' : 'text-2xl mb-3'
                }`}>
                    {app.name}
                </h3>
                
                <p className={`text-gray-500 mb-4 font-medium ${
                    viewMode === 'list' ? 'text-base' : 'text-base'
                }`}>
                    {app.developer}
                </p>

                {/* Stats - Only show real data */}
                <div className={`flex items-center justify-center space-x-3 text-sm mb-4 ${
                    viewMode === 'list' ? 'justify-start' : ''
                }`}>
                    {/* Only show rating if it exists and is greater than 0 */}
                    {app.rating > 0 && (
                        <div className="flex items-center space-x-2 text-yellow-600 bg-yellow-50 px-3 py-2 rounded-full border border-yellow-200 hover:bg-yellow-100 transition-colors duration-200">
                            <FaStar className="text-sm" />
                            <span className="font-semibold">{app.rating.toFixed(1)}</span>
                        </div>
                    )}
                    
                    {/* Show downloads if they exist and are greater than 0 */}
                    {(app.downloads > 0 || app.downloadCount > 0) && (
                        <div className="flex items-center space-x-2 text-green-600 bg-green-50 px-3 py-2 rounded-full border border-green-200 hover:bg-green-100 transition-colors duration-200">
                            <FaDownload className="text-sm" />
                            <span className="font-semibold">{formatNumber(app.downloads || app.downloadCount)}</span>
                        </div>
                    )}
                    
                    {/* Show reviews count if it exists */}
                    {app.reviewsCount > 0 && (
                        <div className="flex items-center space-x-2 text-pink-600 bg-pink-50 px-3 py-2 rounded-full border border-pink-200 hover:bg-pink-100 transition-colors duration-200">
                            <FaHeart className="text-sm" />
                            <span className="font-semibold">{app.reviewsCount}</span>
                        </div>
                    )}
                </div>

                {/* Badges for special apps */}
                <div className={`flex items-center justify-center space-x-2 mb-4 flex-wrap gap-2 ${
                    viewMode === 'list' ? 'justify-start' : ''
                }`}>
                    {app.isFeatured && (
                        <span className="inline-flex items-center space-x-2 px-3 py-2 bg-gradient-to-r from-red-50 to-red-100 text-red-600 rounded-full text-sm font-semibold border border-red-200 hover:from-red-100 hover:to-red-200 transition-all duration-200">
                            <FaCrown className="text-sm" />
                            <span>Featured</span>
                        </span>
                    )}
                    {app.isHot && (
                        <span className="inline-flex items-center space-x-2 px-3 py-2 bg-gradient-to-r from-orange-50 to-red-50 text-orange-600 rounded-full text-sm font-semibold border border-orange-200 hover:from-orange-100 hover:to-red-100 transition-all duration-200">
                            <FaFire className="text-sm" />
                            <span>Hot</span>
                        </span>
                    )}
                    {app.isNewApp && (
                        <span className="inline-flex items-center space-x-2 px-3 py-2 bg-gradient-to-r from-blue-50 to-cyan-50 text-blue-600 rounded-full text-sm font-semibold border border-blue-200 hover:from-blue-100 hover:to-cyan-100 transition-all duration-200">
                            <FaClock className="text-sm" />
                            <span>New</span>
                        </span>
                    )}
                    {app.isPremium && (
                        <span className="inline-flex items-center space-x-2 px-3 py-2 bg-gradient-to-r from-yellow-50 to-yellow-100 text-yellow-600 rounded-full text-sm font-semibold border border-yellow-200 hover:from-yellow-100 hover:to-yellow-200 transition-all duration-200">
                            <FaGem className="text-sm" />
                            <span>Premium</span>
                        </span>
                    )}
                </div>

                {/* Category */}
                {app.category && (
                    <div className={`mb-3 ${
                        viewMode === 'list' ? 'text-left' : 'text-center'
                    }`}>
                        <span className="inline-block px-4 py-2 bg-gray-100 text-gray-700 rounded-xl text-sm font-semibold border border-gray-200 hover:bg-gray-200 hover:text-gray-800 transition-all duration-200 cursor-pointer">
                            {app.category.name}
                        </span>
                    </div>
                )}
                
                {/* Version info */}
                {app.version && (
                    <div className={`${
                        viewMode === 'list' ? 'text-left' : 'text-center'
                    }`}>
                        <span className="text-sm text-gray-400 font-mono bg-gray-50 px-3 py-1 rounded-lg border border-gray-200">
                            v{app.version}
                        </span>
                    </div>
                )}
            </div>
        </div>
    )
}