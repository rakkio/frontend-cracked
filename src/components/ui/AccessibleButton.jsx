import { forwardRef } from 'react'

const AccessibleButton = forwardRef(({ 
  children, 
  variant = 'primary', 
  size = 'md',
  disabled = false,
  ariaLabel,
  className = '',
  ...props 
}, ref) => {
  const baseClasses = 'inline-flex items-center justify-center font-medium transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-black'
  
  const variants = {
    primary: 'bg-red-600 text-white border-2 border-red-500 hover:bg-red-700 hover:border-red-400 focus:ring-red-500',
    secondary: 'bg-black text-white border-2 border-red-500 hover:bg-gray-900 hover:border-red-400 focus:ring-red-500',
    ghost: 'bg-transparent text-red-400 border-2 border-red-500/50 hover:bg-red-500/10 hover:border-red-500 focus:ring-red-500'
  }
  
  const sizes = {
    sm: 'px-3 py-2 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg'
  }
  
  return (
    <button
      ref={ref}
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}
      disabled={disabled}
      aria-label={ariaLabel}
      {...props}
    >
      {children}
    </button>
  )
})

AccessibleButton.displayName = 'AccessibleButton'

export default AccessibleButton