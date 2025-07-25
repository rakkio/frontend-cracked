import { FaSkull, FaSpinner, FaTerminal } from 'react-icons/fa'

const LoadingScreen = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-matrix-dark relative overflow-hidden">
      {/* Matrix Background Effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-black to-red-900/20"></div>
      <div className="absolute inset-0 bg-matrix-pattern opacity-10 animate-matrix-rain"></div>
      
      {/* Terminal Window */}
      <div className="relative z-10 bg-black/90 border-2 border-red-500/50 rounded-lg p-8 max-w-md w-full mx-4 shadow-2xl shadow-red-500/20">
        {/* Terminal Header */}
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-red-500/30">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full bg-red-500 animate-pulse"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-500 animate-pulse delay-100"></div>
            <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse delay-200"></div>
          </div>
          <FaTerminal className="text-red-400 text-sm" />
        </div>
        
        {/* Loading Content */}
        <div className="text-center space-y-6">
          <div className="relative">
            <FaSkull className="text-6xl text-red-500 mx-auto animate-pulse drop-shadow-lg" />
            <div className="absolute -top-2 -right-2 w-4 h-4 bg-red-400 rounded-full animate-ping"></div>
          </div>
          
          <div className="space-y-3">
            <div className="flex items-center justify-center space-x-3">
              <FaSpinner className="text-xl text-red-400 animate-spin" />
              <span className="text-red-400 font-mono text-lg font-bold tracking-wider">
                INITIALIZING...
              </span>
            </div>
            
            <div className="text-green-400 font-mono text-sm">
              <div className="animate-typewriter">
                 Connecting to secure servers...
              </div>
              <div className="animate-typewriter delay-500">
                 Loading premium apps database...
              </div>
              <div className="animate-typewriter delay-1000">
                 Decrypting application data...
              </div>
            </div>
          </div>
          
          {/* Progress Bar */}
          <div className="w-full bg-gray-800 rounded-full h-2 overflow-hidden">
            <div className="h-full bg-gradient-to-r from-red-500 to-red-600 rounded-full animate-loading-bar"></div>
          </div>
          
          <p className="text-gray-400 font-mono text-sm">
            Accessing <span className="text-red-400 font-bold">10,000+</span> cracked applications...
          </p>
        </div>
      </div>
      
      {/* Floating Code Elements */}
      <div className="absolute top-20 left-10 text-green-400/20 font-mono text-xs animate-float">
        {`{"status": "loading"}`}
      </div>
      <div className="absolute bottom-20 right-10 text-red-400/20 font-mono text-xs animate-float delay-300">
        {`[ENCRYPTED]`}
      </div>
      <div className="absolute top-1/3 right-20 text-blue-400/20 font-mono text-xs animate-float delay-700">
        {`0x7F4A2B1C`}
      </div>
    </div>
  )
}

export default LoadingScreen