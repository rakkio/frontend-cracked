import { FaDownload, FaCheckCircle, FaArrowRight, FaRocket, FaHeart, FaEye } from 'react-icons/fa'
import { FaWindows, FaApple, FaLinux, FaAndroid } from 'react-icons/fa'

export default function DownloadSidebar({ 
    pendingDownload, 
    deviceType, 
    countdown, 
    error, 
    advertisement, 
    adLoaded, 
    canSkip, 
    onSkip, 
    onDirectDownload 
}) {
    const getDeviceIcon = () => {
        const iconClass = "text-lg"
        switch (deviceType) {
            case 'windows': 
                return <FaWindows className={iconClass} />
            case 'mac': 
            case 'ios': 
                return <FaApple className={iconClass} />
            case 'linux': 
                return <FaLinux className={iconClass} />
            case 'android': 
                return <FaAndroid className={iconClass} />
            default: 
                return <FaWindows className={iconClass} />
        }
    }

    const getEnhancedAdTypeDisplay = () => {
        if (!advertisement) return 'Loading...'
        
        const format = advertisement.crackmarket?.adFormat || advertisement.type
        switch (format) {
            case 'direct_link': return '🔗 Direct Link'
            case 'multitag': return '🏷️ Multi-Tag'
            case 'onclick_popunder': return '👆 Click Popunder'
            case 'push_notifications': return '🔔 Push Notification'
            case 'in_page_push': return '📱 In-Page Push'
            case 'vignette_banner': return '🖼️ Vignette Banner'
            case 'interstitial': return '📺 Interstitial'
            default: return '📺 Advertisement'
        }
    }

    return (
        <div className="lg:col-span-1">
            <div className="bg-gradient-to-b from-gray-800/60 to-gray-900/60 backdrop-blur-sm border border-gray-600 rounded-2xl p-6 sticky top-8">
                <h3 className="text-xl font-semibold text-white mb-6 flex items-center">
                    <FaDownload className="mr-2 text-green-400" />
                    Download Status
                </h3>
                
                {pendingDownload && (
                    <div className="mb-6 p-4 bg-gradient-to-r from-blue-900/30 to-purple-900/30 rounded-xl border border-blue-500/30">
                        <div className="text-sm text-gray-300 mb-2 flex items-center">
                            <FaDownload className="mr-2 text-blue-400" />
                            Application:
                        </div>
                        <div className="text-white font-medium break-words text-lg">{pendingDownload.appName}</div>
                        <div className="mt-2 flex items-center text-xs text-gray-400">
                            {getDeviceIcon()}
                            <span className="ml-1 capitalize">{deviceType} optimized</span>
                        </div>
                    </div>
                )}
                
                {/* Enhanced Countdown Display */}
                <div className="text-center mb-6">
                    {countdown > 0 ? (
                        <div className="relative">
                            <div className="text-6xl font-bold text-red-500 mb-4 animate-pulse">{countdown}</div>
                            <div className="absolute inset-0 flex items-center justify-center">
                                <div className="w-20 h-20 border-4 border-red-500/30 rounded-full animate-spin border-t-red-500"></div>
                            </div>
                            <p className="text-gray-300 text-sm mt-8">
                                {error ? '🔄 Redirecting back...' :
                                 !advertisement && adLoaded ? '⚡ Download starts in...' :
                                 advertisement?.crackmarket?.adFormat === 'direct_link' 
                                    ? '🔗 Redirecting in...' 
                                    : '📥 Download starts in...'}
                            </p>
                        </div>
                    ) : (
                        <div className="relative">
                            <FaCheckCircle className="text-6xl text-green-500 mx-auto mb-4 animate-bounce" />
                            <p className="text-green-400 font-medium text-lg">
                                {error ? '🔄 Redirecting...' : '🎉 Ready to download!'}
                            </p>
                            <div className="mt-2 text-xs text-green-300">✨ Premium download unlocked</div>
                        </div>
                    )}
                </div>
                
                {/* Enhanced Action Buttons */}
                <div className="space-y-4">
                    {countdown > 0 && canSkip && advertisement?.crackmarket?.adFormat !== 'direct_link' && !error && (
                        <button
                            onClick={onSkip}
                            className="w-full px-4 py-3 bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-700 hover:to-orange-700 text-white font-semibold rounded-xl transition-all duration-300 flex items-center justify-center space-x-2 transform hover:scale-105 shadow-lg"
                        >
                            <FaArrowRight className="animate-pulse" />
                            <span>Skip & Try Another Ad</span>
                        </button>
                    )}
                    
                    {countdown === 0 && (
                        <button
                            onClick={onDirectDownload}
                            className="w-full px-4 py-4 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-bold rounded-xl transition-all duration-300 flex items-center justify-center space-x-2 transform hover:scale-105 shadow-xl animate-pulse"
                        >
                            <FaDownload className="text-xl" />
                            <span className="text-lg">Download Now</span>
                        </button>
                    )}
                    
                    {countdown === 0 && advertisement?.settings?.autoClose === false && (
                        <div className="text-xs text-blue-400 text-center bg-blue-500/20 px-3 py-3 rounded-xl border border-blue-500/30">
                            <FaRocket className="inline mr-1" />
                            💡 Click "Download Now" to proceed with your premium download
                        </div>
                    )}
                    
                    <div className="text-xs text-gray-400 text-center p-3 bg-gray-800/40 rounded-xl">
                        <FaHeart className="inline text-red-400 mr-1" />
                        {error ? 'Please try again if the issue persists' : 
                         'Advertisements help us provide free downloads'}
                    </div>
                </div>
                
                {/* Enhanced Ad Information */}
                {advertisement && (
                    <div className="mt-6 pt-6 border-t border-gray-600">
                        <h4 className="text-sm font-semibold text-gray-300 mb-4 flex items-center">
                            <FaEye className="mr-2" />
                            Advertisement Info
                        </h4>
                        <div className="space-y-3 text-xs">
                            <div className="flex justify-between">
                                <span>Type:</span>
                                <span className="text-gray-200 font-medium">{getEnhancedAdTypeDisplay()}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Network:</span>
                                <span className="text-blue-300 font-medium">CrackMarket.xyz</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Duration:</span>
                                <span className="text-yellow-300 font-medium">{advertisement.settings?.countdown || 15}s</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Skippable:</span>
                                <span className={`font-medium ${advertisement.settings?.closable ? "text-green-300" : "text-red-300"}`}>
                                    {advertisement.settings?.closable ? "✅ Yes" : "❌ No"}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span>Auto-Start:</span>
                                <span className={`font-medium ${advertisement.settings?.autoClose ? "text-green-300" : "text-yellow-300"}`}>
                                    {advertisement.settings?.autoClose ? "🚀 Yes" : "👆 Manual"}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span>Priority:</span>
                                <span className="text-purple-300 font-medium">{advertisement.priority || 0}</span>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
} 