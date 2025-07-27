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
                <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm border border-gray-700/40 rounded-2xl p-12">
                    <div className="text-6xl text-gray-600 mb-4">🔍</div>
                    <h3 className="text-2xl font-bold text-white mb-2">No Apps Found</h3>
                    <p className="text-gray-400">Try adjusting your search criteria or filters</p>
                </div>
            </div>
        )
    }

    return (
        <section className="container mx-auto px-4 py-8">
            <div className={`grid gap-6 ${
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
        ? 'flex items-center space-x-4 p-4'
        : 'flex flex-col p-6'

    return (
        <div 
            className={`bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm border border-gray-700/40 rounded-2xl hover:border-red-500/50 transition-all duration-300 cursor-pointer group hover:scale-105 hover:shadow-2xl hover:shadow-red-500/20 ${cardClasses}`}
            onClick={onClick}
        >
            {/* App Icon */}
            <div className={`relative ${viewMode === 'list' ? 'w-16 h-16' : 'w-20 h-20 mx-auto mb-4'} flex-shrink-0`}>
                <Image
                    src={app.images?.[0] || '/placeholder-app.png'}
                    alt={app.name}
                    fill
                    className="rounded-xl object-cover"
                    sizes={viewMode === 'list' ? '64px' : '80px'}
                />
                {app.isPremium && (
                    <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center">
                        <FaCrown className="text-xs text-white" />
                    </div>
                )}
            </div>

            {/* App Info */}
            <div className={`${viewMode === 'list' ? 'flex-1' : 'text-center'}`}>
                <h3 className={`font-bold text-white group-hover:text-red-400 transition-colors ${
                    viewMode === 'list' ? 'text-lg' : 'text-xl mb-2'
                }`}>
                    {app.name}
                </h3>
                
                <p className={`text-gray-400 mb-3 ${
                    viewMode === 'list' ? 'text-sm' : 'text-sm'
                }`}>
                    {app.developer}
                </p>

                {/* Stats - Only show real data */}
                <div className={`flex items-center justify-center space-x-3 text-sm mb-3 ${
                    viewMode === 'list' ? 'justify-start' : ''
                }`}>
                    {/* Only show rating if it exists and is greater than 0 */}
                    {app.rating > 0 && (
                        <div className="flex items-center space-x-1 text-yellow-400 bg-yellow-400/10 px-2 py-1 rounded-full">
                            <FaStar className="text-xs" />
                            <span className="font-medium">{app.rating.toFixed(1)}</span>
                        </div>
                    )}
                    
                    {/* Show downloads if they exist and are greater than 0 */}
                    {(app.downloads > 0 || app.downloadCount > 0) && (
                        <div className="flex items-center space-x-1 text-green-400 bg-green-400/10 px-2 py-1 rounded-full">
                            <FaDownload className="text-xs" />
                            <span className="font-medium">{formatNumber(app.downloads || app.downloadCount)}</span>
                        </div>
                    )}
                    
                    {/* Show reviews count if it exists */}
                    {app.reviewsCount > 0 && (
                        <div className="flex items-center space-x-1 text-purple-400 bg-purple-400/10 px-2 py-1 rounded-full">
                            <FaHeart className="text-xs" />
                            <span className="font-medium">{app.reviewsCount}</span>
                        </div>
                    )}
                </div>

                {/* Badges for special apps */}
                <div className={`flex items-center justify-center space-x-2 mb-3 ${
                    viewMode === 'list' ? 'justify-start' : ''
                }`}>
                    {app.isFeatured && (
                        <span className="inline-flex items-center space-x-1 px-2 py-1 bg-gradient-to-r from-red-500/20 to-red-600/20 text-red-400 rounded-full text-xs font-medium border border-red-500/30">
                            <FaCrown className="text-xs" />
                            <span>Featured</span>
                        </span>
                    )}
                    {app.isHot && (
                        <span className="inline-flex items-center space-x-1 px-2 py-1 bg-gradient-to-r from-orange-500/20 to-red-500/20 text-orange-400 rounded-full text-xs font-medium border border-orange-500/30">
                            <FaFire className="text-xs" />
                            <span>Hot</span>
                        </span>
                    )}
                    {app.isNewApp && (
                        <span className="inline-flex items-center space-x-1 px-2 py-1 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 text-blue-400 rounded-full text-xs font-medium border border-blue-500/30">
                            <FaClock className="text-xs" />
                            <span>New</span>
                        </span>
                    )}
                    {app.isPremium && (
                        <span className="inline-flex items-center space-x-1 px-2 py-1 bg-gradient-to-r from-yellow-500/20 to-yellow-600/20 text-yellow-400 rounded-full text-xs font-medium border border-yellow-500/30">
                            <FaGem className="text-xs" />
                            <span>Premium</span>
                        </span>
                    )}
                </div>

                {/* Category */}
                {app.category && (
                    <div className={`${
                        viewMode === 'list' ? 'text-left' : 'text-center'
                    }`}>
                        <span className="inline-block px-3 py-1 bg-gray-700/50 text-gray-300 rounded-lg text-xs font-medium border border-gray-600/50 hover:bg-gray-600/50 transition-colors">
                            {app.category.name}
                        </span>
                    </div>
                )}
                
                {/* Version info */}
                {app.version && (
                    <div className={`mt-2 ${
                        viewMode === 'list' ? 'text-left' : 'text-center'
                    }`}>
                        <span className="text-xs text-gray-500 font-mono">
                            v{app.version}
                        </span>
                    </div>
                )}
            </div>
        </div>
    )
}