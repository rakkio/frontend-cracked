export default function AppLoading() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-red-900 flex items-center justify-center">
            <div className="text-center">
                <div className="relative">
                    {/* Outer rotating ring */}
                    <div className="w-32 h-32 border-4 border-red-500/20 rounded-full animate-spin">
                        <div className="absolute top-0 left-0 w-8 h-8 bg-red-500 rounded-full animate-pulse"></div>
                    </div>
                    
                    {/* Inner pulsing circle */}
                    <div className="absolute inset-4 bg-gradient-to-br from-red-600 to-red-800 rounded-full animate-pulse flex items-center justify-center">
                        <div className="w-12 h-12 bg-gradient-to-br from-red-400 to-red-600 rounded-full animate-bounce"></div>
                    </div>
                </div>
                
                <div className="mt-8 space-y-2">
                    <h2 className="text-2xl font-black text-transparent bg-gradient-to-r from-red-400 to-red-300 bg-clip-text font-mono">
                        LOADING_APP_DATA...
                    </h2>
                    <div className="flex justify-center space-x-1">
                        <div className="w-2 h-2 bg-red-500 rounded-full animate-bounce" style={{animationDelay: '0ms'}}></div>
                        <div className="w-2 h-2 bg-red-500 rounded-full animate-bounce" style={{animationDelay: '150ms'}}></div>
                        <div className="w-2 h-2 bg-red-500 rounded-full animate-bounce" style={{animationDelay: '300ms'}}></div>
                    </div>
                </div>
            </div>
        </div>
    )
}