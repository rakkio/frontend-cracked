'use client'

import { memo } from 'react'
import { FaCaretUp, FaCaretDown } from 'react-icons/fa'

/**
 * StatsCard component - Single Responsibility: Display statistical information
 * Open/Closed: Can be extended with different variants and styles
 * Interface Segregation: Only receives the props it needs
 */
const StatsCard = memo(({
  title,
  value,
  subvalue,
  icon: Icon,
  trend,
  trendValue,
  color = 'blue',
  loading = false,
  onClick,
  className = '',
  variant = 'default'
}) => {
  // Color schemes
  const colorSchemes = {
    blue: {
      icon: 'text-blue-500',
      trend: 'text-blue-400',
      gradient: 'from-blue-500/10 to-blue-600/5',
      border: 'border-blue-500/20 hover:border-blue-400/40'
    },
    red: {
      icon: 'text-red-500',
      trend: 'text-red-400', 
      gradient: 'from-red-500/10 to-red-600/5',
      border: 'border-red-500/20 hover:border-red-400/40'
    },
    green: {
      icon: 'text-green-500',
      trend: 'text-green-400',
      gradient: 'from-green-500/10 to-green-600/5', 
      border: 'border-green-500/20 hover:border-green-400/40'
    },
    purple: {
      icon: 'text-purple-500',
      trend: 'text-purple-400',
      gradient: 'from-purple-500/10 to-purple-600/5',
      border: 'border-purple-500/20 hover:border-purple-400/40'
    },
    orange: {
      icon: 'text-orange-500',
      trend: 'text-orange-400',
      gradient: 'from-orange-500/10 to-orange-600/5',
      border: 'border-orange-500/20 hover:border-orange-400/40'
    }
  }

  const colors = colorSchemes[color] || colorSchemes.blue

  const handleClick = () => {
    if (onClick) {
      onClick()
    }
  }

  const handleKeyPress = (e) => {
    if ((e.key === 'Enter' || e.key === ' ') && onClick) {
      e.preventDefault()
      onClick()
    }
  }

  // Loading skeleton
  if (loading) {
    return (
      <div className={`bg-gray-800/50 backdrop-blur-sm border border-gray-700/40 rounded-xl p-6 ${className}`}>
        <div className="animate-pulse">
          <div className="flex items-center justify-between mb-4">
            <div className="h-4 bg-gray-700 rounded w-20"></div>
            <div className="h-8 w-8 bg-gray-700 rounded"></div>
          </div>
          <div className="h-8 bg-gray-700 rounded w-16 mb-2"></div>
          <div className="h-3 bg-gray-700 rounded w-24"></div>
        </div>
      </div>
    )
  }

  return (
    <div
      className={`
        bg-gray-800/50 backdrop-blur-sm border ${colors.border} rounded-xl p-6 
        relative overflow-hidden transition-all duration-300
        ${onClick ? 'cursor-pointer hover:bg-gray-800/70 hover:scale-[1.02] focus:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-red-500/50' : ''}
        ${className}
      `}
      onClick={handleClick}
      onKeyPress={handleKeyPress}
      tabIndex={onClick ? 0 : undefined}
      role={onClick ? 'button' : undefined}
      aria-label={onClick ? `View details for ${title}` : undefined}
    >
      {/* Background gradient */}
      <div className={`absolute inset-0 bg-gradient-to-br ${colors.gradient} pointer-events-none`}></div>
      
      {/* Content */}
      <div className="relative">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-gray-400 text-sm font-medium">{title}</h3>
          {Icon && (
            <div className={`p-2 rounded-lg bg-gray-700/40 ${colors.icon}`}>
              <Icon className="text-lg" />
            </div>
          )}
        </div>

        {/* Main value */}
        <div className="mb-2">
          <span className="text-2xl md:text-3xl font-bold text-white">
            {typeof value === 'number' && value >= 1000 
              ? value >= 1000000 
                ? `${(value/1000000).toFixed(1)}M`
                : `${(value/1000).toFixed(1)}K`
              : value || '0'
            }
          </span>
        </div>

        {/* Subvalue and trend */}
        <div className="flex items-center justify-between">
          {subvalue && (
            <span className="text-gray-400 text-sm">{subvalue}</span>
          )}
          
          {trend && trendValue && (
            <div className={`flex items-center space-x-1 text-sm ${colors.trend}`}>
              {trend === 'up' ? <FaCaretUp /> : <FaCaretDown />}
              <span>{trendValue}</span>
            </div>
          )}
        </div>
      </div>

      {/* Hover effect */}
      {onClick && (
        <div className="absolute inset-0 opacity-0 hover:opacity-100 transition-opacity duration-300 pointer-events-none">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-white/5 to-transparent skew-x-12 -translate-x-full hover:translate-x-full transition-transform duration-700"></div>
        </div>
      )}
    </div>
  )
})

StatsCard.displayName = 'StatsCard'

export default StatsCard 