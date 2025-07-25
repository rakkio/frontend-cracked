import Link from 'next/link'
import { FaSkull, FaCode, FaTerminal } from 'react-icons/fa'
import { useState, useEffect } from 'react'

const BrandLogo = ({ size = 'default', showText = true, className = '' }) => {
  const [glitchActive, setGlitchActive] = useState(false)
  
  useEffect(() => {
    const interval = setInterval(() => {
      setGlitchActive(true)
      setTimeout(() => setGlitchActive(false), 200)
    }, 5000)
    
    return () => clearInterval(interval)
  }, [])
  
  const sizeClasses = {
    small: {
      container: 'text-2xl',
      icon: 'w-8 h-8',
      text: 'text-xl'
    },
    default: {
      container: 'text-3xl md:text-4xl',
      icon: 'w-10 h-10 md:w-12 md:h-12',
      text: 'text-2xl md:text-3xl'
    },
    large: {
      container: 'text-4xl md:text-6xl',
      icon: 'w-12 h-12 md:w-16 md:h-16',
      text: 'text-3xl md:text-5xl'
    }
  }
  
  const currentSize = sizeClasses[size]
  
  return (
    <Link href="/" className={`group inline-flex items-center space-x-3 ${className}`}>
      {/* Logo Icon Container */}
      <div className="relative">
        {/* Main Logo Background */}
        <div className="relative bg-gradient-to-br from-red-600 to-red-900 p-3 rounded-lg border-2 border-red-500 group-hover:border-red-400 transition-all duration-300">
          {/* Scan Lines */}
          <div className="absolute inset-0 scan-lines opacity-30 rounded-lg"></div>
          
          {/* Glitch Effect */}
          {glitchActive && (
            <div className="absolute inset-0 bg-red-500 opacity-50 rounded-lg animate-pulse"></div>
          )}
          
          {/* Logo Icon */}
          <div className="relative z-10">
            <FaSkull className={`${currentSize.icon} text-white group-hover:animate-pulse transition-all duration-300`} />
          </div>
          
          {/* Corner Brackets */}
          <div className="absolute top-1 left-1 w-3 h-3 border-l-2 border-t-2 border-red-400 opacity-60 group-hover:opacity-100 transition-opacity"></div>
          <div className="absolute top-1 right-1 w-3 h-3 border-r-2 border-t-2 border-red-400 opacity-60 group-hover:opacity-100 transition-opacity"></div>
          <div className="absolute bottom-1 left-1 w-3 h-3 border-l-2 border-b-2 border-red-400 opacity-60 group-hover:opacity-100 transition-opacity"></div>
          <div className="absolute bottom-1 right-1 w-3 h-3 border-r-2 border-b-2 border-red-400 opacity-60 group-hover:opacity-100 transition-opacity"></div>
        </div>
        
        {/* Floating Code Elements */}
        <div className="absolute -top-2 -right-2 opacity-60 group-hover:opacity-100 transition-opacity">
          <FaCode className="w-4 h-4 text-green-400 animate-float" />
        </div>
        <div className="absolute -bottom-2 -left-2 opacity-60 group-hover:opacity-100 transition-opacity">
          <FaTerminal className="w-4 h-4 text-cyan-400 animate-float" style={{ animationDelay: '1s' }} />
        </div>
      </div>
      
      {/* Brand Text */}
      {showText && (
        <div className="flex flex-col">
          <div className={`font-bold text-white terminal-text ${currentSize.text} group-hover:text-red-400 transition-colors duration-300`}>
            <span className={`${glitchActive ? 'animate-pulse' : ''}`}>
              CRACK<span className="text-red-500">MARKET</span>
            </span>
          </div>
          <div className="text-gray-400 text-sm font-mono uppercase tracking-wider">
            <span className="text-red-500">[</span>PREMIUM SOFTWARE FREE<span className="text-red-500">]</span>
          </div>
        </div>
      )}
      
      {/* Terminal Cursor */}
      {showText && (
        <div className="w-1 h-6 bg-red-500 animate-pulse ml-1"></div>
      )}
    </Link>
  )
}

export default BrandLogo