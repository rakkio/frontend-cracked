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
                                ? `Found ${appsCount} premium apps matching your search`
                                : `${appsCount}+ Premium Applications • Free Download • Instant Access`
                            }
                        </h2>
                    </div>

                    {/* Trust Signals */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-8 max-w-2xl mx-auto">
                        <div className="text-center p-3 rounded-lg bg-white/5 backdrop-blur-sm border border-white/10">
                            <FaTrophy className="text-2xl text-yellow-400 mx-auto mb-2" />
                            <span className="text-white font-semibold text-sm">Top Quality</span>
                        </div>
                        <div className="text-center p-3 rounded-lg bg-white/5 backdrop-blur-sm border border-white/10">
                            <FaGem className="text-2xl text-purple-400 mx-auto mb-2" />
                            <span className="text-white font-semibold text-sm">Premium</span>
                        </div>
                        <div className="text-center p-3 rounded-lg bg-white/5 backdrop-blur-sm border border-white/10">
                            <FaDownload className="text-2xl text-green-400 mx-auto mb-2" />
                            <span className="text-white font-semibold text-sm">Direct Links</span>
                        </div>
                        <div className="text-center p-3 rounded-lg bg-white/5 backdrop-blur-sm border border-white/10">
                            <FaFire className="text-2xl text-red-400 mx-auto mb-2" />
                            <span className="text-white font-semibold text-sm">Always Free</span>
                        </div>
                    </div>
                </header>
            </div>
        </section>
    )
}