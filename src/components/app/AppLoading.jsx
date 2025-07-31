export default function AppLoading() {
    return (
        <div className="min-h-screen bg-white flex items-center justify-center">
            <div className="text-center">
                <div className="relative">
                    {/* Outer rotating ring */}
                    <div className="w-32 h-32 border-4 border-blue-200 rounded-full animate-spin">
                        <div className="absolute top-0 left-0 w-8 h-8 bg-blue-500 rounded-full animate-pulse"></div>
                    </div>
                    
                    {/* Inner pulsing circle */}
                    <div className="absolute inset-4 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full animate-pulse flex items-center justify-center">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full animate-bounce"></div>
                    </div>
                </div>
                
                <div className="mt-8 space-y-2">
                    <h2 className="text-2xl font-bold text-transparent bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text">
                        Loading App…
                    </h2>
                    <div className="flex justify-center space-x-1">
                        <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{animationDelay: '0ms'}}></div>
                        <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{animationDelay: '150ms'}}></div>
                        <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{animationDelay: '300ms'}}></div>
                    </div>
                </div>
            </div>
        </div>
    )
}