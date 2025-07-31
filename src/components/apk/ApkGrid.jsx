import Image from 'next/image'
import { FaDownload, FaStar, FaEye, FaAndroid, FaShieldAlt, FaRocket, FaClock } from 'react-icons/fa'

// Utility function to format numbers
const formatNumber = (num) => {
    if (!num || num === 0) return '0'
    if (num < 1000) return num.toString()
    if (num < 1000000) return (num / 1000).toFixed(1).replace(/\.0$/, '') + 'K'
    if (num < 1000000000) return (num / 1000000).toFixed(1).replace(/\.0$/, '') + 'M'
    return (num / 1000000000).toFixed(1).replace(/\.0$/, '') + 'B'
}

export default function ApkGrid({ apks, viewMode, handleApkClick }) {
    if (apks.length === 0) {
        return (
            <div className="container mx-auto px-4 py-16 text-center">
                <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm border border-gray-700/40 rounded-2xl p-12">
                    <div className="text-6xl text-gray-600 mb-4">📱</div>
                    <h3 className="text-2xl font-bold text-white mb-2">No APKs Found</h3>
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
                {apks.map((apk) => (
                    <ApkCard 
                        key={apk._id} 
                        apk={apk} 
                        viewMode={viewMode} 
                        onClick={() => handleApkClick(apk)} 
                    />
                ))}
            </div>
        </section>
    )
}

const ApkCard = ({ apk, viewMode, onClick }) => {
    const cardClasses = viewMode === 'list' 
        ? 'flex items-center space-x-4 p-4'
        : 'flex flex-col p-6'

    return (
        <div 
            className={`bg-gradient-to-br from-green-800/20 to-blue-800/20 backdrop-blur-sm border border-green-500/30 rounded-2xl hover:border-green-400/50 transition-all duration-300 cursor-pointer group hover:scale-105 hover:shadow-2xl hover:shadow-green-500/20 ${cardClasses}`}
            onClick={onClick}
        >
            {/* APK Icon */}
            <div className={`relative ${viewMode === 'list' ? 'w-16 h-16' : 'w-20 h-20 mx-auto mb-4'} flex-shrink-0`}>
                <Image
                    src={apk.images?.[0] || '/placeholder-app.png'}
                    alt={apk.name}
                    fill
                    className="rounded-xl object-cover"
                    sizes={viewMode === 'list' ? '64px' : '80px'}
                />
                
                {/* Android Badge */}
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-r from-green-400 to-green-600 rounded-full flex items-center justify-center">
                    <FaAndroid className="text-xs text-white" />
                </div>
                
                {/* Mod Badge */}
                {apk.isModded && (
                    <div className="absolute -bottom-2 -left-2 w-6 h-6 bg-gradient-to-r from-purple-400 to-purple-600 rounded-full flex items-center justify-center">
                        <FaRocket className="text-xs text-white" />
                    </div>
                )}
            </div>

            {/* APK Info */}
            <div className={`${viewMode === 'list' ? 'flex-1' : 'text-center'}`}>
                <h3 className={`font-bold text-white group-hover:text-green-400 transition-colors ${
                    viewMode === 'list' ? 'text-lg' : 'text-xl mb-2'
                }`}>
                    {apk.name}
                </h3>
                
                <p className={`text-gray-400 mb-3 ${
                    viewMode === 'list' ? 'text-sm' : 'text-sm'
                }`}>
                    {apk.developer}
                </p>

                {/* Version and Size */}
                <div className={`flex items-center justify-center space-x-2 text-xs text-gray-500 mb-3 ${
                    viewMode === 'list' ? 'justify-start' : ''
                }`}>
                    <span className="bg-gray-700/50 px-2 py-1 rounded-full">
                        v{apk.version}
                    </span>
                    <span className="bg-gray-700/50 px-2 py-1 rounded-full">
                        {apk.size}
                    </span>
                    {apk.minAndroidVersion && (
                        <span className="bg-green-700/50 text-green-400 px-2 py-1 rounded-full">
                            Android {apk.minAndroidVersion}+
                        </span>
                    )}
                </div>

                {/* Stats - Only show real data */}
                <div className={`flex items-center justify-center space-x-3 text-sm mb-3 ${
                    viewMode === 'list' ? 'justify-start' : ''
                }`}>
                    {/* Only show rating if it exists and is greater than 0 */}
                    {apk.rating > 0 && (
                        <div className="flex items-center space-x-1 text-yellow-400 bg-yellow-400/10 px-2 py-1 rounded-full">
                            <FaStar className="text-xs" />
                            <span className="font-medium">{apk.rating.toFixed(1)}</span>
                        </div>
                    )}
                    
                    {/* Show downloads if they exist and are greater than 0 */}
                    {apk.downloads > 0 && (
                        <div className="flex items-center space-x-1 text-green-400 bg-green-400/10 px-2 py-1 rounded-full">
                            <FaDownload className="text-xs" />
                            <span className="font-medium">{formatNumber(apk.downloads)}</span>
                        </div>
                    )}
                    
                    {/* Show views if they exist and are greater than 0 */}
                    {apk.views > 0 && (
                        <div className="flex items-center space-x-1 text-blue-400 bg-blue-400/10 px-2 py-1 rounded-full">
                            <FaEye className="text-xs" />
                            <span className="font-medium">{formatNumber(apk.views)}</span>
                        </div>
                    )}
                </div>

                {/* Mod Features */}
                {apk.modFeatures && apk.modFeatures.length > 0 && (
                    <div className={`mb-3 ${viewMode === 'list' ? 'text-left' : 'text-center'}`}>
                        <div className="flex flex-wrap gap-1 justify-center">
                            {apk.modFeatures.slice(0, 2).map((feature, index) => (
                                <span 
                                    key={index}
                                    className="text-xs bg-purple-500/20 text-purple-400 px-2 py-1 rounded-full"
                                >
                                    {feature}
                                </span>
                            ))}
                            {apk.modFeatures.length > 2 && (
                                <span className="text-xs bg-gray-500/20 text-gray-400 px-2 py-1 rounded-full">
                                    +{apk.modFeatures.length - 2} more
                                </span>
                            )}
                        </div>
                    </div>
                )}

                {/* Status Badges */}
                <div className={`flex items-center justify-center space-x-2 ${
                    viewMode === 'list' ? 'justify-start' : ''
                }`}>
                    {apk.featured && (
                        <div className="flex items-center space-x-1 bg-gradient-to-r from-yellow-400/20 to-orange-400/20 text-yellow-400 px-2 py-1 rounded-full text-xs">
                            <span>⭐</span>
                            <span className="font-medium">Featured</span>
                        </div>
                    )}
                    
                    {apk.isModded && (
                        <div className="flex items-center space-x-1 bg-gradient-to-r from-purple-400/20 to-pink-400/20 text-purple-400 px-2 py-1 rounded-full text-xs">
                            <FaRocket className="text-xs" />
                            <span className="font-medium">Modded</span>
                        </div>
                    )}
                    
                    {apk.virusTotalScan?.isClean && (
                        <div className="flex items-center space-x-1 bg-gradient-to-r from-green-400/20 to-emerald-400/20 text-green-400 px-2 py-1 rounded-full text-xs">
                            <FaShieldAlt className="text-xs" />
                            <span className="font-medium">Safe</span>
                        </div>
                    )}
                </div>

                {/* Category */}
                {apk.category && (
                    <div className={`mt-3 ${viewMode === 'list' ? 'text-left' : 'text-center'}`}>
                        <span className="text-xs text-gray-500 bg-gray-700/30 px-2 py-1 rounded-full">
                            {apk.category.name}
                        </span>
                    </div>
                )}

                {/* Last Updated */}
                {apk.lastUpdated && (
                    <div className={`mt-2 flex items-center justify-center space-x-1 text-xs text-gray-500 ${
                        viewMode === 'list' ? 'justify-start' : ''
                    }`}>
                        <FaClock className="text-xs" />
                        <span>
                            Updated {new Date(apk.lastUpdated).toLocaleDateString()}
                        </span>
                    </div>
                )}
            </div>
        </div>
    )
}
