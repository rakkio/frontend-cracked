'use client'

import { FiDownload, FiUsers, FiShield, FiHeadphones } from 'react-icons/fi'
import { useEffect, useState } from 'react'

const StatsSection = ({ stats }) => {
  const [animatedStats, setAnimatedStats] = useState({
    totalApps: 0,
    totalDownloads: 0,
    activeUsers: 0,
    supportHours: 0
  })

  useEffect(() => {
    if (!stats) return

    const animateNumber = (target, key) => {
      let current = 0
      const increment = target / 100
      const timer = setInterval(() => {
        current += increment
        if (current >= target) {
          current = target
          clearInterval(timer)
        }
        setAnimatedStats(prev => ({ ...prev, [key]: Math.floor(current) }))
      }, 20)
    }

    animateNumber(stats.totalApps || 21000, 'totalApps')
    animateNumber(stats.totalDownloads || 2100000, 'totalDownloads')
    animateNumber(stats.activeUsers || 210000, 'activeUsers')
    animateNumber(24, 'supportHours')
  }, [stats])

  const formatNumber = (num) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`
    if (num >= 1000) return `${(num / 1000).toFixed(0)}K`
    return num.toString()
  }

  const statsData = [
    {
      icon: FiDownload,
      value: formatNumber(animatedStats.totalApps),
      label: 'Apps Available',
      suffix: '+',
      color: 'from-red-500 to-red-700'
    },
    {
      icon: FiUsers,
      value: formatNumber(animatedStats.totalDownloads),
      label: 'Downloads',
      suffix: '+',
      color: 'from-red-600 to-red-800'
    },
    {
      icon: FiShield,
      value: formatNumber(animatedStats.activeUsers),
      label: 'Active Users',
      suffix: '+',
      color: 'from-red-700 to-red-900'
    },
    {
      icon: FiHeadphones,
      value: animatedStats.supportHours,
      label: 'Support',
      suffix: '/7',
      color: 'from-red-500 to-red-700'
    }
  ]

  return (
    <section className="py-16 bg-black relative overflow-hidden">
      {/* Matrix Background */}
      <div className="absolute inset-0 opacity-10">
        <div className="matrix-bg"></div>
      </div>
      
      {/* Glitch Lines */}
      <div className="absolute inset-0">
        <div className="glitch-line" style={{ top: '20%', animationDelay: '0s' }}></div>
        <div className="glitch-line" style={{ top: '60%', animationDelay: '2s' }}></div>
        <div className="glitch-line" style={{ top: '80%', animationDelay: '4s' }}></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 terminal-text">
            <span className="text-red-500">[</span>REAL-TIME STATS<span className="text-red-500">]</span>
          </h2>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto">
            Live data from our global network of hackers and crackers
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {statsData.map((stat, index) => {
            const IconComponent = stat.icon
            return (
              <div
                key={index}
                className="metro-tile group hover:scale-105 transition-all duration-300 cursor-pointer"
                style={{ animationDelay: `${index * 0.2}s` }}
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-90 group-hover:opacity-100 transition-opacity duration-300`}></div>
                
                {/* Scan Lines */}
                <div className="absolute inset-0 scan-lines opacity-20"></div>
                
                <div className="relative z-10 p-6 text-center">
                  <div className="mb-4">
                    <IconComponent className="w-12 h-12 text-white mx-auto group-hover:animate-pulse" />
                  </div>
                  
                  <div className="mb-2">
                    <span className="text-3xl md:text-4xl font-bold text-white terminal-text">
                      {stat.value}{stat.suffix}
                    </span>
                  </div>
                  
                  <div className="text-gray-200 font-medium uppercase tracking-wider text-sm">
                    {stat.label}
                  </div>
                  
                  {/* Terminal Cursor */}
                  <div className="inline-block w-2 h-6 bg-red-500 ml-1 animate-pulse"></div>
                </div>
                
                {/* Corner Brackets */}
                <div className="absolute top-2 left-2 w-4 h-4 border-l-2 border-t-2 border-red-500 opacity-60"></div>
                <div className="absolute top-2 right-2 w-4 h-4 border-r-2 border-t-2 border-red-500 opacity-60"></div>
                <div className="absolute bottom-2 left-2 w-4 h-4 border-l-2 border-b-2 border-red-500 opacity-60"></div>
                <div className="absolute bottom-2 right-2 w-4 h-4 border-r-2 border-b-2 border-red-500 opacity-60"></div>
              </div>
            )
          })}
        </div>
        
        {/* Terminal Status */}
        <div className="mt-12 text-center">
          <div className="inline-block bg-black border border-red-500 rounded px-4 py-2">
            <span className="text-green-400 font-mono text-sm">
             STATUS: ONLINE | SERVERS: OPERATIONAL | SECURITY: MAXIMUM
              <span className="animate-pulse text-red-500 ml-2">█</span>
            </span>
          </div>
        </div>
      </div>
    </section>
  )
}

export default StatsSection