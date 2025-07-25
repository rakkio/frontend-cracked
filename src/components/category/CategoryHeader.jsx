import { FaStar, FaTerminal, FaCode, FaShieldAlt } from 'react-icons/fa'

export const CategoryHeader = ({ category, apps }) => {
    return (
        <section className="relative py-12 px-4 bg-gradient-to-br from-black via-gray-900 to-red-900/20">
            {/* Grid Pattern Background */}
            <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-5"></div>
            
            {/* Glitch Effect Overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-red-500/5 to-transparent animate-pulse"></div>
            
            <div className="container mx-auto relative z-10 max-w-6xl">
                <div className="flex flex-col md:flex-row items-center space-y-8 md:space-y-0 md:space-x-8">
                    {/* Category Icon with Terminal Style */}
                    <div className="flex-shrink-0 relative">
                        <div className="absolute inset-0 bg-red-500 blur-xl opacity-30 animate-pulse"></div>
                        <div 
                            className="relative w-32 h-32 flex items-center justify-center text-6xl shadow-2xl border-4 hover:scale-105 transition-all duration-300 bg-black/90 backdrop-blur-sm"
                            style={{ 
                                borderColor: category?.color || '#ef4444',
                                boxShadow: `0 0 30px ${category?.color || '#ef4444'}40`
                            }}
                        >
                            {/* Terminal corners */}
                            <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2" style={{ borderColor: category?.color || '#ef4444' }}></div>
                            <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2" style={{ borderColor: category?.color || '#ef4444' }}></div>
                            <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2" style={{ borderColor: category?.color || '#ef4444' }}></div>
                            <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2" style={{ borderColor: category?.color || '#ef4444' }}></div>
                            
                            <span style={{ color: category?.color || '#ef4444' }} className="relative z-10">
                                {category?.icon || '📱'}
                            </span>
                        </div>
                    </div>
                    
                    {/* Category Info with Terminal Style */}
                    <div className="flex-1 text-center md:text-left">
                        <div className="flex items-center justify-center md:justify-start space-x-4 mb-4">
                            <h1 className="text-4xl md:text-6xl lg:text-7xl font-black text-white font-mono" itemProp="name">
                                <span className="text-red-500">[</span>
                                {category?.name}
                                <span className="text-red-500">]</span>
                            </h1>
                            {category?.isFeatured && (
                                <span className="px-4 py-2 bg-gradient-to-r from-yellow-500/20 to-amber-500/20 border-2 border-yellow-500/50 text-yellow-300 text-sm font-mono font-bold flex items-center space-x-2 backdrop-blur-sm">
                                    <FaStar className="text-yellow-400 animate-pulse" />
                                    <span>FEATURED</span>
                                </span>
                            )}
                        </div>
                        
                        <h2 className="text-xl md:text-2xl text-green-400 mb-4 font-mono" itemProp="description">
                            <span className="text-gray-500"></span> {category?.description || `Explore premium ${category?.name} applications`}
                        </h2>
                        
                        {/* Enhanced Stats with Terminal Style */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
                            <div className="text-center p-4 bg-black/50 backdrop-blur-sm border-2 border-red-500/30 hover:border-red-500 transition-all duration-300 group">
                                <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-red-500"></div>
                                <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-red-500"></div>
                                <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-red-500"></div>
                                <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-red-500"></div>
                                
                                <div className="text-2xl font-black text-red-400 font-mono group-hover:text-red-300 transition-colors">
                                    {apps?.length || 0}
                                </div>
                                <div className="text-gray-300 font-mono text-xs uppercase tracking-wider">Apps Found</div>
                            </div>
                            <div className="text-center p-4 bg-black/50 backdrop-blur-sm border-2 border-green-500/30 hover:border-green-500 transition-all duration-300 group relative">
                                <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-green-500"></div>
                                <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-green-500"></div>
                                <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-green-500"></div>
                                <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-green-500"></div>
                                
                                <div className="text-2xl font-black text-green-400 font-mono group-hover:text-green-300 transition-colors">
                                    {category?.appCount || 0}
                                </div>
                                <div className="text-gray-300 font-mono text-xs uppercase tracking-wider">Total Apps</div>
                            </div>
                            <div className="text-center p-4 bg-black/50 backdrop-blur-sm border-2 border-yellow-500/30 hover:border-yellow-500 transition-all duration-300 group relative">
                                <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-yellow-500"></div>
                                <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-yellow-500"></div>
                                <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-yellow-500"></div>
                                <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-yellow-500"></div>
                                
                                <div className="text-2xl font-black text-yellow-400 font-mono group-hover:text-yellow-300 transition-colors">
                                    100%
                                </div>
                                <div className="text-gray-300 font-mono text-xs uppercase tracking-wider">Free</div>
                            </div>
                            <div className="text-center p-4 bg-black/50 backdrop-blur-sm border-2 border-purple-500/30 hover:border-purple-500 transition-all duration-300 group relative">
                                <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-purple-500"></div>
                                <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-purple-500"></div>
                                <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-purple-500"></div>
                                <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-purple-500"></div>
                                
                                <div className="text-2xl font-black text-purple-400 font-mono group-hover:text-purple-300 transition-colors">
                                    4.5★
                                </div>
                                <div className="text-gray-300 font-mono text-xs uppercase tracking-wider">Avg Rating</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}