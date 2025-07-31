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
        <section className="relative overflow-hidden bg-gradient-to-br from-white via-blue-50/50 to-purple-50/30 border-b border-gray-200/60">
            {/* Light Luxury Background Pattern */}
            <div className="absolute inset-0 opacity-15">
                <div className="absolute top-10 left-10 w-40 h-40 bg-gradient-to-br from-emerald-400 to-cyan-500 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute top-32 right-20 w-32 h-32 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-full blur-3xl animate-pulse delay-1000"></div>
                <div className="absolute bottom-20 left-1/3 w-48 h-48 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full blur-3xl animate-pulse delay-2000"></div>
                <div className="absolute top-1/2 right-1/4 w-24 h-24 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full blur-2xl animate-pulse delay-3000"></div>
                <div className="absolute bottom-10 right-10 w-36 h-36 bg-gradient-to-br from-orange-400 to-red-500 rounded-full blur-3xl animate-pulse delay-4000"></div>
            </div>
            
            {/* Light Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/70 via-transparent to-blue-50/50"></div>

            <div className="container mx-auto px-4 py-16 relative z-10">
                <div className="text-center mb-12">
                    {/* Light Luxury Main Title */}
                    <div className="flex items-center justify-center mb-8">
                        <div className="relative group">
                            {/* Subtle Glow Effect */}
                            <div className="absolute -inset-1 bg-gradient-to-r from-emerald-400 via-cyan-500 to-blue-500 rounded-3xl blur opacity-30 group-hover:opacity-50 transition duration-1000"></div>
                            
                            {/* Icon Container */}
                            <div className="relative bg-gradient-to-br from-emerald-500 via-cyan-500 to-blue-600 p-6 rounded-3xl mr-6 shadow-2xl">
                                <FaAndroid className="text-5xl text-white drop-shadow-lg" />
                            </div>
                        </div>
                        <div className="text-left">
                            <h1 className="text-6xl md:text-7xl font-black bg-gradient-to-r from-emerald-600 via-cyan-600 to-blue-600 bg-clip-text text-transparent">
                                Android APK
                            </h1>
                            <p className="text-2xl bg-gradient-to-r from-gray-700 to-gray-600 bg-clip-text text-transparent mt-3 font-semibold">
                                Premium Apps & Games Collection
                            </p>
                            <div className="flex items-center mt-2 space-x-2">
                                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                                <span className="text-emerald-600 text-sm font-medium">Verified & Safe</span>
                            </div>
                        </div>
                    </div>

                    {/* Light Luxury Description */}
                    <div className="max-w-4xl mx-auto mb-10">
                        <p className="text-xl text-gray-700 leading-relaxed mb-4 font-medium">
                            Discover the ultimate collection of premium Android APK files with unlimited features, 
                            ad-free experience, and exclusive content unlocked.
                        </p>
                        <p className="text-lg bg-gradient-to-r from-gray-600 to-gray-500 bg-clip-text text-transparent font-medium">
                            Every app is meticulously tested, verified, and optimized for maximum performance and security.
                        </p>
                    </div>

                    {/* Light Luxury Trust Signals */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-6xl mx-auto">
                        <div className="group relative">
                            {/* Subtle Glow Effect */}
                            <div className="absolute -inset-0.5 bg-gradient-to-r from-emerald-400 to-cyan-400 rounded-3xl blur opacity-20 group-hover:opacity-40 transition duration-1000"></div>
                            
                            {/* Light Card */}
                            <div className="relative bg-white/80 backdrop-blur-xl border border-emerald-200/60 rounded-3xl p-8 hover:border-emerald-300/80 transition-all duration-500 group shadow-xl hover:shadow-2xl">
                                <div className="flex items-center justify-center mb-4">
                                    <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 p-4 rounded-2xl group-hover:scale-110 transition-transform duration-300 shadow-xl">
                                        <FaAndroid className="text-3xl text-white drop-shadow-lg" />
                                    </div>
                                </div>
                                <div className="text-3xl font-black bg-gradient-to-r from-emerald-600 to-emerald-700 bg-clip-text text-transparent mb-2">
                                    {formatNumber(totalApks)}+
                                </div>
                                <div className="text-sm text-gray-700 font-semibold mb-2">
                                    Android APKs
                                </div>
                                <div className="text-xs text-emerald-600 font-medium bg-emerald-100 px-3 py-1 rounded-full">
                                    Modded & Premium
                                </div>
                            </div>
                        </div>

                        <div className="group relative">
                            <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-3xl blur opacity-20 group-hover:opacity-40 transition duration-1000"></div>
                            <div className="relative bg-white/80 backdrop-blur-xl border border-blue-200/60 rounded-3xl p-8 hover:border-blue-300/80 transition-all duration-500 group shadow-xl hover:shadow-2xl">
                                <div className="flex items-center justify-center mb-4">
                                    <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-4 rounded-2xl group-hover:scale-110 transition-transform duration-300 shadow-xl">
                                        <FaDownload className="text-3xl text-white drop-shadow-lg" />
                                    </div>
                                </div>
                                <div className="text-3xl font-black bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent mb-2">
                                    {formatNumber(totalDownloads)}+
                                </div>
                                <div className="text-sm text-gray-700 font-semibold mb-2">
                                    Total Downloads
                                </div>
                                <div className="text-xs text-blue-600 font-medium bg-blue-100 px-3 py-1 rounded-full">
                                    Safe & Secure
                                </div>
                            </div>
                        </div>

                        <div className="group relative">
                            <div className="absolute -inset-0.5 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-3xl blur opacity-20 group-hover:opacity-40 transition duration-1000"></div>
                            <div className="relative bg-white/80 backdrop-blur-xl border border-yellow-200/60 rounded-3xl p-8 hover:border-yellow-300/80 transition-all duration-500 group shadow-xl hover:shadow-2xl">
                                <div className="flex items-center justify-center mb-4">
                                    <div className="bg-gradient-to-br from-yellow-500 to-orange-500 p-4 rounded-2xl group-hover:scale-110 transition-transform duration-300 shadow-xl">
                                        <FaStar className="text-3xl text-white drop-shadow-lg" />
                                    </div>
                                </div>
                                <div className="text-3xl font-black bg-gradient-to-r from-yellow-600 to-orange-600 bg-clip-text text-transparent mb-2">
                                    {averageRating > 0 ? averageRating.toFixed(1) : '4.8'}
                                </div>
                                <div className="text-sm text-gray-700 font-semibold mb-2">
                                    Average Rating
                                </div>
                                <div className="text-xs text-yellow-600 font-medium bg-yellow-100 px-3 py-1 rounded-full">
                                    User Verified
                                </div>
                            </div>
                        </div>

                        <div className="group relative">
                            <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-400 to-pink-400 rounded-3xl blur opacity-20 group-hover:opacity-40 transition duration-1000"></div>
                            <div className="relative bg-white/80 backdrop-blur-xl border border-purple-200/60 rounded-3xl p-8 hover:border-purple-300/80 transition-all duration-500 group shadow-xl hover:shadow-2xl">
                                <div className="flex items-center justify-center mb-4">
                                    <div className="bg-gradient-to-br from-purple-500 to-pink-500 p-4 rounded-2xl group-hover:scale-110 transition-transform duration-300 shadow-xl">
                                        <FaShieldAlt className="text-3xl text-white drop-shadow-lg" />
                                    </div>
                                </div>
                                <div className="text-3xl font-black bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
                                    100%
                                </div>
                                <div className="text-sm text-gray-700 font-semibold mb-2">
                                    Virus Free
                                </div>
                                <div className="text-xs text-purple-600 font-medium bg-purple-100 px-3 py-1 rounded-full">
                                    Scanned & Clean
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Light Features */}
                    <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
                        <div className="flex items-center justify-center space-x-3 bg-white/60 backdrop-blur-sm border border-emerald-200/60 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 group">
                            <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 p-2 rounded-xl group-hover:scale-110 transition-transform">
                                <FaRocket className="text-white text-xl" />
                            </div>
                            <span className="text-gray-700 font-semibold">Premium Unlocked</span>
                        </div>
                        
                        <div className="flex items-center justify-center space-x-3 bg-white/60 backdrop-blur-sm border border-blue-200/60 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 group">
                            <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-2 rounded-xl group-hover:scale-110 transition-transform">
                                <FaShieldAlt className="text-white text-xl" />
                            </div>
                            <span className="text-gray-700 font-semibold">Ad-Free Experience</span>
                        </div>
                        
                        <div className="flex items-center justify-center space-x-3 bg-white/60 backdrop-blur-sm border border-purple-200/60 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 group">
                            <div className="bg-gradient-to-br from-purple-500 to-purple-600 p-2 rounded-xl group-hover:scale-110 transition-transform">
                                <FaDownload className="text-white text-xl" />
                            </div>
                            <span className="text-gray-700 font-semibold">Instant Download</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Light Floating Elements */}
            <div className="absolute top-20 left-10 w-2 h-2 bg-emerald-500 rounded-full animate-ping opacity-60"></div>
            <div className="absolute top-40 right-20 w-3 h-3 bg-blue-500 rounded-full animate-ping delay-1000 opacity-60"></div>
            <div className="absolute bottom-20 left-1/4 w-2 h-2 bg-purple-500 rounded-full animate-ping delay-2000 opacity-60"></div>
            <div className="absolute top-1/3 right-1/3 w-1 h-1 bg-cyan-500 rounded-full animate-ping delay-3000 opacity-40"></div>
            <div className="absolute bottom-1/3 right-10 w-2 h-2 bg-pink-500 rounded-full animate-ping delay-4000 opacity-50"></div>
        </section>
    )
}
