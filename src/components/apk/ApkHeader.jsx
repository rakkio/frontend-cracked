import { FaAndroid, FaDownload, FaStar, FaShieldAlt, FaRocket } from 'react-icons/fa'

export default function ApkHeader({ stats = {} }) {
    const {
        totalApks = 0,
        totalDownloads = 0,
        averageRating = 0,
        featuredCount = 0
    } = stats

    const formatNumber = (num) => {
        if (!num || num === 0) return '0'
        if (num < 1000) return num.toString()
        if (num < 1000000) return (num / 1000).toFixed(1).replace(/\.0$/, '') + 'K'
        if (num < 1000000000) return (num / 1000000).toFixed(1).replace(/\.0$/, '') + 'M'
        return (num / 1000000000).toFixed(1).replace(/\.0$/, '') + 'B'
    }

    return (
        <section className="relative overflow-hidden bg-gradient-to-br from-green-900/20 via-slate-800/50 to-blue-900/20 backdrop-blur-sm">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-10">
                <div className="absolute top-10 left-10 w-32 h-32 bg-green-500 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute top-32 right-20 w-24 h-24 bg-blue-500 rounded-full blur-2xl animate-pulse delay-1000"></div>
                <div className="absolute bottom-20 left-1/3 w-40 h-40 bg-purple-500 rounded-full blur-3xl animate-pulse delay-2000"></div>
            </div>

            <div className="container mx-auto px-4 py-16 relative z-10">
                <div className="text-center mb-12">
                    {/* Main Title */}
                    <div className="flex items-center justify-center mb-6">
                        <div className="bg-gradient-to-r from-green-400 to-blue-500 p-4 rounded-2xl mr-4">
                            <FaAndroid className="text-4xl text-white" />
                        </div>
                        <div className="text-left">
                            <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-green-400 via-blue-500 to-purple-500 bg-clip-text text-transparent">
                                Android APK
                            </h1>
                            <p className="text-xl text-gray-300 mt-2">
                                Premium Apps & Games
                            </p>
                        </div>
                    </div>

                    {/* Description */}
                    <p className="text-lg text-gray-300 max-w-3xl mx-auto mb-8 leading-relaxed">
                        Download premium Android APK files with unlimited features, ad-free experience, 
                        and premium content unlocked. All apps are tested and verified for your security.
                    </p>

                    {/* Trust Signals */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
                        <div className="bg-gradient-to-br from-green-800/30 to-green-900/30 backdrop-blur-sm border border-green-500/30 rounded-2xl p-6 hover:border-green-400/50 transition-all duration-300 group">
                            <div className="flex items-center justify-center mb-3">
                                <div className="bg-gradient-to-r from-green-400 to-green-600 p-3 rounded-xl group-hover:scale-110 transition-transform">
                                    <FaAndroid className="text-2xl text-white" />
                                </div>
                            </div>
                            <div className="text-2xl font-bold text-white mb-1">
                                {formatNumber(totalApks)}+
                            </div>
                            <div className="text-sm text-gray-400">
                                Android APKs
                            </div>
                            <div className="text-xs text-green-400 mt-1">
                                Modded & Premium
                            </div>
                        </div>

                        <div className="bg-gradient-to-br from-blue-800/30 to-blue-900/30 backdrop-blur-sm border border-blue-500/30 rounded-2xl p-6 hover:border-blue-400/50 transition-all duration-300 group">
                            <div className="flex items-center justify-center mb-3">
                                <div className="bg-gradient-to-r from-blue-400 to-blue-600 p-3 rounded-xl group-hover:scale-110 transition-transform">
                                    <FaDownload className="text-2xl text-white" />
                                </div>
                            </div>
                            <div className="text-2xl font-bold text-white mb-1">
                                {formatNumber(totalDownloads)}+
                            </div>
                            <div className="text-sm text-gray-400">
                                Total Downloads
                            </div>
                            <div className="text-xs text-blue-400 mt-1">
                                Safe & Secure
                            </div>
                        </div>

                        <div className="bg-gradient-to-br from-yellow-800/30 to-yellow-900/30 backdrop-blur-sm border border-yellow-500/30 rounded-2xl p-6 hover:border-yellow-400/50 transition-all duration-300 group">
                            <div className="flex items-center justify-center mb-3">
                                <div className="bg-gradient-to-r from-yellow-400 to-yellow-600 p-3 rounded-xl group-hover:scale-110 transition-transform">
                                    <FaStar className="text-2xl text-white" />
                                </div>
                            </div>
                            <div className="text-2xl font-bold text-white mb-1">
                                {averageRating > 0 ? averageRating.toFixed(1) : '4.8'}
                            </div>
                            <div className="text-sm text-gray-400">
                                Average Rating
                            </div>
                            <div className="text-xs text-yellow-400 mt-1">
                                User Verified
                            </div>
                        </div>

                        <div className="bg-gradient-to-br from-purple-800/30 to-purple-900/30 backdrop-blur-sm border border-purple-500/30 rounded-2xl p-6 hover:border-purple-400/50 transition-all duration-300 group">
                            <div className="flex items-center justify-center mb-3">
                                <div className="bg-gradient-to-r from-purple-400 to-purple-600 p-3 rounded-xl group-hover:scale-110 transition-transform">
                                    <FaShieldAlt className="text-2xl text-white" />
                                </div>
                            </div>
                            <div className="text-2xl font-bold text-white mb-1">
                                100%
                            </div>
                            <div className="text-sm text-gray-400">
                                Virus Free
                            </div>
                            <div className="text-xs text-purple-400 mt-1">
                                Scanned & Clean
                            </div>
                        </div>
                    </div>

                    {/* Features */}
                    <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
                        <div className="flex items-center justify-center space-x-3 bg-gradient-to-r from-green-800/20 to-green-900/20 backdrop-blur-sm border border-green-500/20 rounded-xl p-4">
                            <FaRocket className="text-green-400 text-xl" />
                            <span className="text-white font-medium">Premium Unlocked</span>
                        </div>
                        
                        <div className="flex items-center justify-center space-x-3 bg-gradient-to-r from-blue-800/20 to-blue-900/20 backdrop-blur-sm border border-blue-500/20 rounded-xl p-4">
                            <FaShieldAlt className="text-blue-400 text-xl" />
                            <span className="text-white font-medium">Ad-Free Experience</span>
                        </div>
                        
                        <div className="flex items-center justify-center space-x-3 bg-gradient-to-r from-purple-800/20 to-purple-900/20 backdrop-blur-sm border border-purple-500/20 rounded-xl p-4">
                            <FaDownload className="text-purple-400 text-xl" />
                            <span className="text-white font-medium">Instant Download</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Floating Elements */}
            <div className="absolute top-20 left-10 w-2 h-2 bg-green-400 rounded-full animate-ping"></div>
            <div className="absolute top-40 right-20 w-3 h-3 bg-blue-400 rounded-full animate-ping delay-1000"></div>
            <div className="absolute bottom-20 left-1/4 w-2 h-2 bg-purple-400 rounded-full animate-ping delay-2000"></div>
        </section>
    )
}
