import { FiShield, FiDownload, FiDollarSign, FiUsers, FiClock, FiCheck } from 'react-icons/fi'
import { useState, useEffect } from 'react'

const TrustSignals = () => {
  const [activeSignal, setActiveSignal] = useState(0)
  
  const signals = [
    {
      icon: FiShield,
      text: '100% Safe',
      subtext: 'Virus Scanned',
      color: 'text-green-400',
      bgColor: 'from-green-500 to-green-700'
    },
    {
      icon: FiDownload,
      text: 'Instant Download',
      subtext: 'No Waiting',
      color: 'text-blue-400',
      bgColor: 'from-blue-500 to-blue-700'
    },
    {
      icon: FiDollarSign,
      text: 'Always Free',
      subtext: 'No Hidden Costs',
      color: 'text-yellow-400',
      bgColor: 'from-yellow-500 to-yellow-700'
    },
    {
      icon: FiUsers,
      text: '2M+ Users',
      subtext: 'Trusted Community',
      color: 'text-purple-400',
      bgColor: 'from-purple-500 to-purple-700'
    },
    {
      icon: FiClock,
      text: '24/7 Support',
      subtext: 'Always Online',
      color: 'text-red-400',
      bgColor: 'from-red-500 to-red-700'
    },
    {
      icon: FiCheck,
      text: '21K+ Apps',
      subtext: 'Premium Software',
      color: 'text-cyan-400',
      bgColor: 'from-cyan-500 to-cyan-700'
    }
  ]
  
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveSignal((prev) => (prev + 1) % signals.length)
    }, 2000)
    
    return () => clearInterval(interval)
  }, [])
  
  return (
    <div className="flex flex-wrap justify-center gap-4 md:gap-6 mt-8">
      {signals.map((signal, index) => {
        const IconComponent = signal.icon
        const isActive = index === activeSignal
        
        return (
          <div
            key={index}
            className={`metro-tile-small group transition-all duration-500 ${
              isActive ? 'scale-110 shadow-2xl' : 'hover:scale-105'
            }`}
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <div className={`absolute inset-0 bg-gradient-to-br ${signal.bgColor} opacity-${isActive ? '100' : '80'} group-hover:opacity-100 transition-opacity duration-300`}></div>
            
            {/* Scan Lines */}
            <div className="absolute inset-0 scan-lines opacity-20"></div>
            
            {/* Glitch Effect for Active */}
            {isActive && (
              <div className="absolute inset-0 bg-white opacity-10 animate-pulse"></div>
            )}
            
            <div className="relative z-10 p-4 text-center">
              <div className="mb-2">
                <IconComponent className={`w-6 h-6 mx-auto ${signal.color} ${isActive ? 'animate-pulse' : ''}`} />
              </div>
              
              <div className="text-white font-bold text-sm mb-1">
                {signal.text}
              </div>
              
              <div className="text-gray-200 text-xs">
                {signal.subtext}
              </div>
              
              {/* Status Indicator */}
              <div className="mt-2 flex justify-center">
                <div className={`w-2 h-2 rounded-full ${isActive ? 'bg-white animate-pulse' : 'bg-gray-400'}`}></div>
              </div>
            </div>
            
            {/* Corner Brackets */}
            <div className={`absolute top-1 left-1 w-3 h-3 border-l border-t ${signal.color} opacity-60 group-hover:opacity-100 transition-opacity`}></div>
            <div className={`absolute top-1 right-1 w-3 h-3 border-r border-t ${signal.color} opacity-60 group-hover:opacity-100 transition-opacity`}></div>
            <div className={`absolute bottom-1 left-1 w-3 h-3 border-l border-b ${signal.color} opacity-60 group-hover:opacity-100 transition-opacity`}></div>
            <div className={`absolute bottom-1 right-1 w-3 h-3 border-r border-b ${signal.color} opacity-60 group-hover:opacity-100 transition-opacity`}></div>
          </div>
        )
      })}
    </div>
  )
}

export default TrustSignals