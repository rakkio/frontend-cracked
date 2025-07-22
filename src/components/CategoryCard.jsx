'use client'

import { memo } from 'react'
import { FaArrowRight } from 'react-icons/fa'

/**
 * CategoryCard component - Single Responsibility: Display category information
 * Open/Closed: Can be extended without modifying the core component
 * Interface Segregation: Only receives the props it needs
 */
const CategoryCard = memo(({ 
  category, 
  onClick, 
  variant = 'default',
  showAppsCount = true,
  showProgressBar = false,
  className = '',
  ...props 
}) => {
  const handleClick = () => {
    if (onClick) {
      onClick(category)
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      handleClick()
    }
  }

  // Get category icon with fallback
  const getCategoryIcon = () => {
    if (category.icon) {
      return category.icon
    }
    // Fallback icons based on category name
    const name = category.name?.toLowerCase() || ''
    if (name.includes('productivity')) return '📊'
    if (name.includes('communication')) return '💬'
    if (name.includes('creativity') || name.includes('design')) return '🎨'
    if (name.includes('entertainment')) return '🎮'
    if (name.includes('utilities') || name.includes('tools')) return '🔧'
    if (name.includes('security')) return '🔒'
    return '📱'
  }

  // Get category color with fallback
  const getCategoryColor = () => {
    return category.color || '#8b5cf6'
  }

  // Variant styles
  const getVariantStyles = () => {
    switch (variant) {
      case 'compact':
        return {
          card: 'p-3',
          icon: 'w-10 h-10 text-lg',
          title: 'text-sm',
          count: 'text-xs'
        }
      case 'large':
        return {
          card: 'p-8',
          icon: 'w-20 h-20 text-3xl',
          title: 'text-xl',
          count: 'text-base'
        }
      default:
        return {
          card: 'p-4',
          icon: 'w-12 h-12 text-xl',
          title: 'text-sm',
          count: 'text-xs'
        }
    }
  }

  const styles = getVariantStyles()

  return (
    <article
      className={`
        group cursor-pointer relative transform transition-all duration-300 hover:scale-105 
        focus:scale-105 outline-none ${className}
      `}
      onClick={handleClick}
      onKeyPress={handleKeyPress}
      tabIndex={0}
      role="button"
      aria-label={`Explore ${category.name} category with ${category.appsCount || 0} applications`}
      {...props}
    >
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-800/60 to-gray-900/60 rounded-xl backdrop-blur-sm border border-gray-700/40 group-hover:border-red-500/40 group-focus:border-red-500/40 transition-all duration-300"></div>
      
      {/* Content */}
      <div className={`relative text-center ${styles.card}`}>
        {/* Icon */}
        <div className="relative mb-3">
          <div className={`
            mx-auto bg-gradient-to-br from-gray-700/40 to-gray-800/40 rounded-lg 
            flex items-center justify-center group-hover:scale-105 transition-transform duration-300
            ${styles.icon}
          `}>
            <div 
              className={`group-hover:scale-105 transition-transform duration-300 ${styles.icon.includes('text-3xl') ? 'text-3xl' : styles.icon.includes('text-lg') ? 'text-lg' : 'text-xl'}`}
              style={{ color: getCategoryColor() }}
              role="img"
              aria-hidden="true"
            >
              {getCategoryIcon()}
            </div>
          </div>
          
          {/* Glow effect on hover */}
          <div 
            className="absolute inset-0 rounded-lg blur-xl opacity-0 group-hover:opacity-30 transition-opacity duration-300 pointer-events-none"
            style={{ 
              backgroundColor: getCategoryColor(),
              width: styles.icon.includes('w-20') ? '80px' : styles.icon.includes('w-10') ? '40px' : '48px',
              height: styles.icon.includes('h-20') ? '80px' : styles.icon.includes('h-10') ? '40px' : '48px',
              margin: '0 auto'
            }}
          ></div>
        </div>
        
        {/* Title */}
        <h3 className={`font-medium text-white mb-1 group-hover:text-red-300 transition-colors duration-300 ${styles.title}`}>
          {category.name}
        </h3>
        
        {/* Apps Count */}
        {showAppsCount && (
          <div className={`text-gray-400 mb-2 ${styles.count}`}>
            {category.appsCount || 0} apps
          </div>
        )}

        {/* Progress Bar */}
        {showProgressBar && (
          <div className="h-1 bg-gray-700/40 rounded-full overflow-hidden">
            <div 
              className="h-full rounded-full transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"
              style={{ 
                backgroundColor: getCategoryColor(),
                width: `${Math.min((category.appsCount || 0) / 20 * 100, 100)}%`
              }}
            ></div>
          </div>
        )}

        {/* Hover Arrow */}
        <div className="absolute -top-2 -right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center shadow-lg">
            <FaArrowRight className="text-white text-xs" />
          </div>
        </div>
      </div>

      {/* Shine effect */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-white/5 to-transparent skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
      </div>
    </article>
  )
})

CategoryCard.displayName = 'CategoryCard'

export default CategoryCard 