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
            <div className="bg-gradient-to-br from-gray-900/90 via-black/95 to-red-900/90 backdrop-blur-sm border border-red-500/20 rounded-2xl p-6 mb-8 shadow-xl shadow-red-500/10">
                <h3 className="text-xl font-black text-transparent bg-gradient-to-r from-red-400 to-red-300 bg-clip-text mb-6 font-mono">APP_DETAILS</h3>
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
                    <div className="flex items-center justify-between p-3 bg-red-500/10 rounded-xl border border-red-500/30 hover:border-red-400/50 transition-colors">
                        <span className="text-gray-300 font-medium font-mono">DOWNLOADS</span>
                        <span className="text-green-400 font-bold font-mono">{app.downloadCount?.toLocaleString() || '0'}</span>
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

            {/* Enhanced Safety Notice */}
            <div className="bg-gradient-to-br from-green-900/30 via-black/40 to-green-900/30 border border-green-500/40 rounded-2xl p-6 mb-8 shadow-xl shadow-green-500/10">
                <div className="flex items-center space-x-3 mb-4">
                    <FaShieldAlt className="text-green-400 text-2xl" />
                    <h3 className="text-xl font-black text-green-400 font-mono">100%_SAFE_DOWNLOAD</h3>
                </div>
                <ul className="text-green-300 space-y-3 font-mono text-sm">
                    <li className="flex items-start space-x-2">
                        <FaCheckCircle className="text-green-400 mt-1 flex-shrink-0" />
                        <span>SCANNED for viruses and malware</span>
                    </li>
                    <li className="flex items-start space-x-2">
                        <FaCheckCircle className="text-green-400 mt-1 flex-shrink-0" />
                        <span>NO registration required</span>
                    </li>
                    <li className="flex items-start space-x-2">
                        <FaCheckCircle className="text-green-400 mt-1 flex-shrink-0" />
                        <span>DIRECT download link</span>
                    </li>
                    <li className="flex items-start space-x-2">
                        <FaCheckCircle className="text-green-400 mt-1 flex-shrink-0" />
                        <span>PREMIUM features unlocked</span>
                    </li>
                </ul>
            </div>

            {/* Enhanced Related Apps */}
            {relatedApps.length > 0 && (
                <div className="bg-gradient-to-br from-gray-900/90 via-black/95 to-red-900/90 backdrop-blur-sm border border-red-500/20 rounded-2xl p-6 shadow-xl shadow-red-500/10">
                    <h3 className="text-xl font-black text-transparent bg-gradient-to-r from-red-400 to-red-300 bg-clip-text mb-6 font-mono">RELATED_APPS</h3>
                    <div className="space-y-4">
                        {relatedApps.map((relatedApp) => (
                            <Link
                                key={relatedApp._id}
                                href={`/app/${relatedApp.slug}`}
                                className="flex items-center space-x-4 p-4 rounded-xl hover:bg-red-500/10 transition-all duration-300 border border-red-500/20 hover:border-red-400/50 group"
                                itemScope itemType="https://schema.org/SoftwareApplication"
                            >
                                {relatedApp.images && relatedApp.images.length > 0 ? (
                                    <img
                                        src={relatedApp.images[0]}
                                        alt={`${relatedApp.name} - Related App`}
                                        width={48}
                                        height={48}
                                        className="rounded-lg shadow-lg group-hover:scale-105 transition-transform duration-300 border border-red-500/30"
                                        itemProp="image"
                                    />
                                ) : (   
                                    <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-red-600 rounded-lg flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform duration-300 border border-red-500/30">
                                        <span className="text-white font-bold font-mono">
                                            {relatedApp.name.charAt(0).toUpperCase()}
                                        </span>
                                    </div>
                                )}
                                <div className="flex-1">
                                    <p className="font-bold text-white truncate group-hover:text-red-400 transition-colors font-mono" itemProp="name">{relatedApp.name.toUpperCase()}</p>
                                    <p className="text-gray-400 text-sm truncate font-mono">{relatedApp.developer}</p>
                                    <div className="flex items-center space-x-2 mt-1">
                                        {relatedApp.rating && (
                                            <div className="flex items-center space-x-1">
                                                <FaStar className="text-yellow-500 text-xs" />
                                                <span className="text-gray-300 text-xs font-mono">{relatedApp.rating.toFixed(1)}</span>
                                            </div>
                                        )}
                                        <span className="text-green-400 text-xs font-bold font-mono">FREE</span>
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