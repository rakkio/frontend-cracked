import { FaInfoCircle } from 'react-icons/fa'

export default function AppDescription({ app }) {
    if (!app?.description) return null

    // Función para truncar el título según el breakpoint
    const getTruncatedTitle = (name) => {
        const cleanName = name.toUpperCase().replace(/\s+/g, '_')
        return {
            mobile: cleanName.length > 20 ? cleanName.substring(0, 20) + '...' : cleanName,
            tablet: cleanName.length > 35 ? cleanName.substring(0, 35) + '...' : cleanName,
            desktop: cleanName.length > 50 ? cleanName.substring(0, 50) + '...' : cleanName
        }
    }

    const titles = getTruncatedTitle(app.name)

    return (
        <section className="bg-gradient-to-br from-gray-900/90 via-black/95 to-red-900/90 backdrop-blur-sm border border-red-500/20 rounded-2xl p-4 sm:p-6 lg:p-8 mb-6 sm:mb-8 shadow-xl shadow-red-500/10 relative overflow-hidden">
            {/* Animated background effects */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-red-500/10 to-orange-500/10 rounded-full blur-3xl animate-pulse opacity-60" />
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-red-600/10 to-pink-500/10 rounded-full blur-3xl animate-pulse opacity-40" style={{animationDelay: '1s'}} />
            
            <div className="relative z-10">
                <h2 className="font-black text-transparent bg-gradient-to-r from-red-400 to-red-300 bg-clip-text mb-4 sm:mb-6 flex items-start sm:items-center space-x-2 sm:space-x-3 font-mono leading-tight"
                    title={`ABOUT_${app.name.toUpperCase().replace(/\s+/g, '_')}`}
                >
                    <FaInfoCircle className="text-red-400 flex-shrink-0 text-lg sm:text-xl lg:text-2xl mt-1 sm:mt-0" />
                    <div className="min-w-0 flex-1">
                        {/* Mobile title */}
                        <span className="block sm:hidden text-base font-bold">
                            ABOUT_{titles.mobile}
                        </span>
                        {/* Tablet title */}
                        <span className="hidden sm:block lg:hidden text-lg font-bold">
                            ABOUT_{titles.tablet}
                        </span>
                        {/* Desktop title */}
                        <span className="hidden lg:block text-xl xl:text-2xl font-bold">
                            ABOUT_{titles.desktop}
                        </span>
                    </div>
                </h2>
                
                <div className="relative">
                    {/* Content container with improved styling */}
                    <div 
                        className="text-gray-300 prose prose-invert max-w-none leading-relaxed font-mono text-xs sm:text-sm lg:text-base border-l-4 border-red-500/50 pl-4 sm:pl-6 bg-black/20 p-4 sm:p-6 rounded-lg backdrop-blur-sm shadow-inner"
                        dangerouslySetInnerHTML={{ __html: app.description.replace(/\n/g, '<br>') }}
                        itemProp="description"
                    />
                    
                    {/* Decorative elements */}
                    <div className="absolute -top-2 -right-2 w-4 h-4 bg-red-500/20 rounded-full animate-pulse" />
                    <div className="absolute -bottom-2 -left-2 w-3 h-3 bg-green-500/20 rounded-full animate-pulse" style={{animationDelay: '0.5s'}} />
                </div>
            </div>
        </section>
    )
}