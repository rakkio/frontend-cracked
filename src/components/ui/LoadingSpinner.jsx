import { FaSpinner, FaTerminal } from 'react-icons/fa'

export const LoadingSpinner = ({ message = "Cargando..." }) => {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-gray-900 to-red-900/20 relative">
            {/* Matrix Rain Background */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="matrix-rain opacity-20"></div>
            </div>
            
            {/* Scan Lines */}
            <div className="scan-lines absolute inset-0 pointer-events-none"></div>
            
            <div className="text-center space-y-6 relative z-10">
                <div className="relative">
                    <div className="absolute inset-0 bg-red-500 blur-xl opacity-50 animate-pulse"></div>
                    <div className="relative bg-black/90 border-2 border-red-500 p-8 backdrop-blur-sm">
                        {/* Terminal corners */}
                        <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-red-500"></div>
                        <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-red-500"></div>
                        <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-red-500"></div>
                        <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-red-500"></div>
                        
                        <FaSpinner className="text-5xl text-red-500 animate-spin mx-auto mb-4" />
                        <div className="flex items-center space-x-2 justify-center mb-2">
                            <FaTerminal className="text-green-400" />
                            <span className="text-green-400 font-mono text-sm">root@appscracked:~#</span>
                        </div>
                        <h2 className="text-2xl text-white font-bold font-mono">{message}</h2>
                        <p className="text-gray-400 font-mono text-sm mt-2">Fetching premium applications...</p>
                        
                        {/* Loading dots animation */}
                        <div className="flex justify-center space-x-1 mt-4">
                            {[0, 1, 2].map((i) => (
                                <div 
                                    key={i}
                                    className="w-2 h-2 bg-red-500 rounded-full animate-pulse"
                                    style={{ animationDelay: `${i * 0.2}s` }}
                                ></div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}