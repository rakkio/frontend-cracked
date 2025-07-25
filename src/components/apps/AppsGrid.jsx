import Image from 'next/image'
import { FaDownload, FaStar, FaEye, FaCrown } from 'react-icons/fa'

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

                {/* Stats */}
                <div className={`flex items-center justify-center space-x-4 text-sm ${
                    viewMode === 'list' ? 'justify-start' : ''
                }`}>
                    <div className="flex items-center space-x-1 text-yellow-400">
                        <FaStar className="text-xs" />
                        <span>{app.rating || '4.5'}</span>
                    </div>
                    <div className="flex items-center space-x-1 text-green-400">
                        <FaDownload className="text-xs" />
                        <span>{app.downloads || '1K'}</span>
                    </div>
                    <div className="flex items-center space-x-1 text-blue-400">
                        <FaEye className="text-xs" />
                        <span>{app.views || '500'}</span>
                    </div>
                </div>

                {/* Category */}
                {app.category && (
                    <div className={`mt-3 ${
                        viewMode === 'list' ? 'text-left' : 'text-center'
                    }`}>
                        <span className="inline-block px-3 py-1 bg-red-600/20 text-red-400 rounded-full text-xs font-medium">
                            {app.category.name}
                        </span>
                    </div>
                )}
            </div>
        </div>
    )
}