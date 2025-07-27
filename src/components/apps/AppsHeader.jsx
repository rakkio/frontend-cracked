import { FaRocket, FaTrophy, FaGem, FaDownload, FaFire } from 'react-icons/fa'

export const AppsHeader = ({ searchTerm, appsCount }) => {
    return (
        <section className="relative py-16 px-4 bg-gradient-to-br from-gray-900 via-black to-red-900/20">
            <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-5"></div>
            
            <div className="container mx-auto text-center relative z-10 max-w-6xl">
                <header className="space-y-6">
                    {/* Icon & Title */}
                    <div className="flex justify-center mb-6">
                        <div className="relative group">
                            <FaRocket className="text-6xl text-red-500 drop-shadow-2xl group-hover:scale-110 transition-transform duration-300" />
                            <div className="absolute -top-2 -right-2 w-5 h-5 bg-gradient-to-r from-red-400 to-red-600 rounded-full animate-pulse shadow-lg"></div>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <h1 className="text-4xl md:text-6xl lg:text-7xl font-black leading-tight" itemProp="name">
                            {searchTerm ? (
                                <>
                                    <span className="bg-gradient-to-r from-red-400 to-red-600 bg-clip-text text-transparent">
                                        "{searchTerm}"
                                    </span>
                                    <br />
                                    <span className="text-white text-2xl md:text-4xl">Search Results</span>
                                </>
                            ) : (
                                <span className="bg-gradient-to-r from-red-400 via-red-500 to-red-600 bg-clip-text text-transparent drop-shadow-lg">
                                    ALL PREMIUM APPS
                                </span>
                            )}
                        </h1>
                        
                        <h2 className="text-xl md:text-3xl text-gray-300 font-medium" itemProp="description">
                            {searchTerm 
                                ? `Found ${appsCount} ${appsCount === 1 ? 'app' : 'apps'} matching "${searchTerm}"`
                                : `${appsCount} Premium Applications • Free Download • Instant Access`
                            }
                        </h2>
                    </div>

                    {/* Enhanced Trust Signals */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-8 max-w-3xl mx-auto">
                        <div className="text-center p-4 rounded-xl bg-gradient-to-br from-yellow-500/10 to-yellow-600/10 backdrop-blur-sm border border-yellow-500/20 hover:border-yellow-400/40 transition-all duration-300 group">
                            <FaTrophy className="text-3xl text-yellow-400 mx-auto mb-3 group-hover:scale-110 transition-transform" />
                            <span className="text-white font-bold text-sm block">Top Quality</span>
                            <span className="text-yellow-300/70 text-xs">Verified Apps</span>
                        </div>
                        <div className="text-center p-4 rounded-xl bg-gradient-to-br from-purple-500/10 to-purple-600/10 backdrop-blur-sm border border-purple-500/20 hover:border-purple-400/40 transition-all duration-300 group">
                            <FaGem className="text-3xl text-purple-400 mx-auto mb-3 group-hover:scale-110 transition-transform" />
                            <span className="text-white font-bold text-sm block">Premium</span>
                            <span className="text-purple-300/70 text-xs">Full Features</span>
                        </div>
                        <div className="text-center p-4 rounded-xl bg-gradient-to-br from-green-500/10 to-green-600/10 backdrop-blur-sm border border-green-500/20 hover:border-green-400/40 transition-all duration-300 group">
                            <FaDownload className="text-3xl text-green-400 mx-auto mb-3 group-hover:scale-110 transition-transform" />
                            <span className="text-white font-bold text-sm block">Direct Links</span>
                            <span className="text-green-300/70 text-xs">Fast Download</span>
                        </div>
                        <div className="text-center p-4 rounded-xl bg-gradient-to-br from-red-500/10 to-red-600/10 backdrop-blur-sm border border-red-500/20 hover:border-red-400/40 transition-all duration-300 group">
                            <FaFire className="text-3xl text-red-400 mx-auto mb-3 group-hover:scale-110 transition-transform" />
                            <span className="text-white font-bold text-sm block">Always Free</span>
                            <span className="text-red-300/70 text-xs">No Payments</span>
                        </div>
                    </div>
                </header>
            </div>
        </section>
    )
}