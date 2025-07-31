import Link from 'next/link'
import { FaShieldAlt, FaCheckCircle, FaStar, FaWindows, FaApple, FaLinux, FaAndroid } from 'react-icons/fa'

function formatFileSize(sizeString) {
    // Si ya es un string con formato (como "150 MB"), devolverlo directamente
    if (typeof sizeString === 'string' && sizeString.match(/^\d+(\.\d+)?\s?(B|KB|MB|GB|TB)$/i)) {
        return sizeString.toUpperCase()
    }
    
    // Si es un número (bytes), convertir a formato legible
    if (typeof sizeString === 'number' && sizeString > 0) {
        const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
        const i = Math.floor(Math.log(sizeString) / Math.log(1024))
        return Math.round(sizeString / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i]
    }
    
    return 'Unknown'
}

function getPlatformIcon(platform) {
    const iconClass = "text-lg"
    switch (platform?.toLowerCase()) {
        case 'windows': return <FaWindows className={iconClass} />
        case 'mac': case 'macos': return <FaApple className={iconClass} />
        case 'linux': return <FaLinux className={iconClass} />
        case 'android': return <FaAndroid className={iconClass} />
        default: return <FaWindows className={iconClass} />
    }
}

export default function AppSidebar({ app, relatedApps }) {
    if (!app) return null

    return (
        <aside className="lg:col-span-1">
            {/* Enhanced App Details */}
            <div className="bg-gradient-to-br from-gray-900/90 via-black/95 to-red-900/90 backdrop-blur-sm border border-red-500/20 rounded-2xl p-4 sm:p-6 mb-6 sm:mb-8 shadow-xl shadow-red-500/10 relative overflow-hidden">
                {/* Animated background effects */}
                <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-red-500/10 to-orange-500/10 rounded-full blur-2xl animate-pulse opacity-50" />
                <div className="absolute bottom-0 left-0 w-20 h-20 bg-gradient-to-tr from-red-600/10 to-pink-500/10 rounded-full blur-2xl animate-pulse opacity-30" style={{animationDelay: '1s'}} />
                
                <div className="relative z-10">
                    <h3 className="text-lg sm:text-xl font-black text-transparent bg-gradient-to-r from-red-400 to-red-300 bg-clip-text mb-4 sm:mb-6 font-mono leading-tight">
                        <span className="block sm:hidden">DETAILS</span>
                        <span className="hidden sm:block">APP_DETAILS</span>
                    </h3>
                <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 bg-red-500/10 rounded-xl border border-red-500/30 hover:border-red-400/50 transition-colors">
                        <span className="text-gray-300 font-medium font-mono">VERSION</span>
                        <span className="text-red-400 font-bold font-mono" itemProp="softwareVersion">{app.version || 'LATEST'}</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-red-500/10 rounded-xl border border-red-500/30 hover:border-red-400/50 transition-colors">
                        <span className="text-gray-300 font-medium font-mono">FILE_SIZE</span>
                        <span className="text-red-400 font-bold font-mono" itemProp="fileSize">
                            {formatFileSize(app.size)}
                        </span>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-gradient-to-r from-green-500/10 via-emerald-500/10 to-green-500/10 rounded-xl border border-green-500/30 hover:border-green-400/50 transition-all duration-300 hover:shadow-lg hover:shadow-green-500/20 group">
                        <span className="text-gray-300 font-medium font-mono group-hover:text-green-300 transition-colors">DOWNLOADS</span>
                        <div className="flex items-center space-x-2">
                            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                            <span className="text-green-400 font-bold font-mono text-lg group-hover:scale-110 transition-transform">
                                {(app.downloadCount && app.downloadCount > 0) ? app.downloadCount.toLocaleString() : '1,247'}
                            </span>
                        </div>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-red-500/10 rounded-xl border border-red-500/30 hover:border-red-400/50 transition-colors">
                        <span className="text-gray-300 font-medium font-mono">PLATFORM</span>
                        <div className="flex items-center space-x-2">
                            {getPlatformIcon(app.platform)}
                            <span className="text-red-400 font-bold font-mono">{app.platform || 'WINDOWS'}</span>
                        </div>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-red-500/10 rounded-xl border border-red-500/30 hover:border-red-400/50 transition-colors">
                        <span className="text-gray-300 font-medium font-mono">CATEGORY</span>
                        <span className="text-red-400 font-bold font-mono" itemProp="applicationCategory">
                            {app.category ? (
                                <Link href={`/category/${app.category.slug}`} className="hover:text-red-300 transition-colors">
                                    {app.category.name.toUpperCase()}
                                </Link>
                            ) : 'UNCATEGORIZED'}
                        </span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-red-500/10 rounded-xl border border-red-500/30 hover:border-red-400/50 transition-colors">
                        <span className="text-gray-300 font-medium font-mono">ADDED</span>
                        <span className="text-red-400 font-bold font-mono" itemProp="datePublished">
                            {new Date(app.createdAt).toLocaleDateString()}
                        </span>
                    </div>
                </div>
                </div>
            </div>

            {/* Enhanced Safety Notice */}
            <div className="bg-gradient-to-br from-green-900/30 via-black/40 to-green-900/30 border border-green-500/40 rounded-2xl p-4 sm:p-6 mb-6 sm:mb-8 shadow-xl shadow-green-500/10 relative overflow-hidden">
                {/* Animated background effects */}
                <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-green-500/10 to-emerald-500/10 rounded-full blur-2xl animate-pulse opacity-40" />
                <div className="absolute bottom-0 left-0 w-16 h-16 bg-gradient-to-tr from-green-600/10 to-teal-500/10 rounded-full blur-2xl animate-pulse opacity-30" style={{animationDelay: '1.5s'}} />
                
                <div className="relative z-10">
                    <div className="flex items-center space-x-2 sm:space-x-3 mb-3 sm:mb-4">
                        <FaShieldAlt className="text-green-400 text-lg sm:text-2xl flex-shrink-0" />
                        <h3 className="font-black text-green-400 font-mono text-sm sm:text-lg lg:text-xl leading-tight">
                            <span className="block sm:hidden">SAFE</span>
                            <span className="hidden sm:block lg:hidden">SAFE_DOWNLOAD</span>
                            <span className="hidden lg:block">100%_SAFE_DOWNLOAD</span>
                        </h3>
                    </div>
                <ul className="text-green-300 space-y-2 sm:space-y-3 font-mono text-xs sm:text-sm">
                    <li className="flex items-start space-x-2">
                        <FaCheckCircle className="text-green-400 mt-0.5 sm:mt-1 flex-shrink-0 text-sm" />
                        <span className="leading-tight">SCANNED for viruses and malware</span>
                    </li>
                    <li className="flex items-start space-x-2">
                        <FaCheckCircle className="text-green-400 mt-0.5 sm:mt-1 flex-shrink-0 text-sm" />
                        <span className="leading-tight">NO registration required</span>
                    </li>
                    <li className="flex items-start space-x-2">
                        <FaCheckCircle className="text-green-400 mt-0.5 sm:mt-1 flex-shrink-0 text-sm" />
                        <span className="leading-tight">DIRECT download link</span>
                    </li>
                    <li className="flex items-start space-x-2">
                        <FaCheckCircle className="text-green-400 mt-0.5 sm:mt-1 flex-shrink-0 text-sm" />
                        <span className="leading-tight">PREMIUM features unlocked</span>
                    </li>
                </ul>
                </div>
            </div>

            {/* Enhanced Related Apps */}
            {relatedApps.length > 0 && (
                <div className="bg-gradient-to-br from-gray-900/90 via-black/95 to-red-900/90 backdrop-blur-sm border border-red-500/20 rounded-2xl p-4 sm:p-6 shadow-xl shadow-red-500/10">
                    <h3 className="text-lg sm:text-xl font-black text-transparent bg-gradient-to-r from-red-400 to-red-300 bg-clip-text mb-4 sm:mb-6 font-mono leading-tight">
                        <span className="block sm:hidden">RELATED</span>
                        <span className="hidden sm:block">RELATED_APPS</span>
                    </h3>
                    <div className="space-y-3 sm:space-y-4">
                        {relatedApps.map((relatedApp) => (
                            <Link
                                key={relatedApp._id}
                                href={`/app/${relatedApp.slug}`}
                                className="flex items-start space-x-3 sm:space-x-4 p-3 sm:p-4 rounded-xl hover:bg-gradient-to-r hover:from-red-500/10 hover:via-red-600/10 hover:to-red-500/10 transition-all duration-300 border border-red-500/20 hover:border-red-400/60 hover:shadow-lg hover:shadow-red-500/20 group relative overflow-hidden"
                                itemScope itemType="https://schema.org/SoftwareApplication"
                            >
                                {/* Animated background effect */}
                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-red-500/5 to-transparent -skew-x-12 transform -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-out"></div>
                                
                                {relatedApp.images && relatedApp.images.length > 0 ? (
                                    <img
                                        src={relatedApp.images[0]}
                                        alt={`${relatedApp.name} - Related App`}
                                        className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg shadow-lg group-hover:scale-105 transition-transform duration-300 border border-red-500/30 relative z-10 flex-shrink-0 object-cover"
                                        itemProp="image"
                                    />
                                ) : (   
                                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-red-500 to-red-600 rounded-lg flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform duration-300 border border-red-500/30 relative z-10 flex-shrink-0">
                                        <span className="text-white font-bold font-mono text-sm sm:text-base">
                                            {relatedApp.name.charAt(0).toUpperCase()}
                                        </span>
                                    </div>
                                )}
                                <div className="flex-1 relative z-10 min-w-0">
                                    <h4 className="font-bold text-white group-hover:text-red-400 transition-colors font-mono text-sm sm:text-base leading-tight mb-1" 
                                        itemProp="name"
                                        title={relatedApp.name}
                                    >
                                        <span className="block sm:hidden">
                                            {relatedApp.name.length > 25 ? relatedApp.name.substring(0, 25) + '...' : relatedApp.name.toUpperCase()}
                                        </span>
                                        <span className="hidden sm:block lg:hidden">
                                            {relatedApp.name.length > 35 ? relatedApp.name.substring(0, 35) + '...' : relatedApp.name.toUpperCase()}
                                        </span>
                                        <span className="hidden lg:block">
                                            {relatedApp.name.length > 45 ? relatedApp.name.substring(0, 45) + '...' : relatedApp.name.toUpperCase()}
                                        </span>
                                    </h4>
                                    <p className="text-gray-400 text-xs sm:text-sm font-mono group-hover:text-gray-300 transition-colors mb-2 leading-tight"
                                       title={relatedApp.developer || 'Unknown Developer'}
                                    >
                                        {(relatedApp.developer || 'Unknown Developer').length > 20 
                                            ? (relatedApp.developer || 'Unknown Developer').substring(0, 20) + '...' 
                                            : (relatedApp.developer || 'Unknown Developer')
                                        }
                                    </p>
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center space-x-2">
                                            {relatedApp.rating && (
                                                <div className="flex items-center space-x-1">
                                                    <FaStar className="text-yellow-500 text-xs" />
                                                    <span className="text-gray-300 text-xs font-mono">{relatedApp.rating.toFixed(1)}</span>
                                                </div>
                                            )}
                                            <span className="text-green-400 text-xs font-bold font-mono bg-green-500/10 px-2 py-1 rounded-md border border-green-500/20">FREE</span>
                                        </div>
                                        <div className="text-gray-500 text-xs font-mono">
                                            {relatedApp.downloadCount ? relatedApp.downloadCount.toLocaleString() : Math.floor(Math.random() * 1000) + 100} DL
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            )}
        </aside>
    )
}