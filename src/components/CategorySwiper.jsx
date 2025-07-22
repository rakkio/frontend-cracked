'use client'

import { memo, useRef, useEffect, useState } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation, Pagination, Autoplay, Grid } from 'swiper/modules'
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa'
import CategoryCard from './CategoryCard'

// Import Swiper styles
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import 'swiper/css/grid'

/**
 * CategorySwiper component - Single Responsibility: Display categories in a responsive swiper
 * Open/Closed: Can be extended with different swiper configurations
 * Dependency Inversion: Depends on abstractions (CategoryCard) not concrete implementations
 */
const CategorySwiper = memo(({ 
  categories = [], 
  onCategoryClick,
  title = "Software Categories",
  subtitle = "Discover applications organized by categories and purpose",
  showTitle = true,
  autoplay = false,
  variant = 'default',
  className = '',
  ...props 
}) => {
  const swiperRef = useRef(null)
  const [isBeginning, setIsBeginning] = useState(true)
  const [isEnd, setIsEnd] = useState(false)
  const [currentBreakpoint, setCurrentBreakpoint] = useState('desktop')

  // Responsive breakpoints configuration
  const swiperConfig = {
    modules: [Navigation, Pagination, Autoplay, Grid],
    spaceBetween: 16,
    loop: categories.length > 6,
    grabCursor: true,
    centeredSlides: false,
    watchOverflow: true,
    autoplay: autoplay ? {
      delay: 3000,
      disableOnInteraction: false,
      pauseOnMouseEnter: true,
    } : false,
    breakpoints: {
      // Mobile (default)
      0: {
        slidesPerView: 2,
        spaceBetween: 12,
        grid: {
          rows: 1,
        }
      },
      // Small mobile
      480: {
        slidesPerView: 2,
        spaceBetween: 16,
        grid: {
          rows: 1,
        }
      },
      // Large mobile / Small tablet
      640: {
        slidesPerView: 3,
        spaceBetween: 16,
        grid: {
          rows: 1,
        }
      },
      // Tablet
      768: {
        slidesPerView: 4,
        spaceBetween: 20,
        grid: {
          rows: 1,
        }
      },
      // Large tablet
      1024: {
        slidesPerView: 5,
        spaceBetween: 24,
        grid: {
          rows: 1,
        }
      },
      // Desktop
      1280: {
        slidesPerView: 6,
        spaceBetween: 24,
        grid: {
          rows: 1,
        }
      },
      // Large desktop
      1536: {
        slidesPerView: 7,
        spaceBetween: 24,
        grid: {
          rows: 1,
        }
      }
    },
    navigation: {
      prevEl: '.category-swiper-prev',
      nextEl: '.category-swiper-next',
    },
    pagination: {
      el: '.category-swiper-pagination',
      clickable: true,
      dynamicBullets: true,
    },
    on: {
      slideChange: (swiper) => {
        setIsBeginning(swiper.isBeginning)
        setIsEnd(swiper.isEnd)
      },
      breakpoint: (swiper, breakpointParams) => {
        const width = window.innerWidth
        if (width < 640) setCurrentBreakpoint('mobile')
        else if (width < 768) setCurrentBreakpoint('tablet-sm')
        else if (width < 1024) setCurrentBreakpoint('tablet')
        else if (width < 1280) setCurrentBreakpoint('desktop-sm')
        else setCurrentBreakpoint('desktop')
      }
    }
  }

  // Handle window resize for responsive behavior
  useEffect(() => {
    const handleResize = () => {
      if (swiperRef.current && swiperRef.current.swiper) {
        swiperRef.current.swiper.update()
      }
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // Handle category click
  const handleCategoryClick = (category) => {
    if (onCategoryClick) {
      onCategoryClick(category)
    }
  }

  // Get variant-specific styles
  const getVariantStyles = () => {
    switch (variant) {
      case 'compact':
        return {
          container: 'py-12',
          title: 'text-2xl md:text-3xl',
          subtitle: 'text-base'
        }
      case 'large':
        return {
          container: 'py-20',
          title: 'text-4xl md:text-5xl',
          subtitle: 'text-xl'
        }
      default:
        return {
          container: 'py-16',
          title: 'text-3xl md:text-4xl',
          subtitle: 'text-lg'
        }
    }
  }

  const styles = getVariantStyles()

  if (!categories || categories.length === 0) {
    return (
      <section className={`${styles.container} px-4 relative ${className}`} {...props}>
        <div className="container mx-auto">
          {showTitle && (
            <header className="text-center mb-12">
              <h2 className={`font-bold mb-4 ${styles.title}`}>
                <span className="bg-gradient-to-r from-red-400 to-orange-500 bg-clip-text text-transparent">
                  {title}
                </span>
              </h2>
              <p className={`text-gray-400 max-w-2xl mx-auto ${styles.subtitle}`}>
                {subtitle}
              </p>
            </header>
          )}
          <div className="text-center py-12">
            <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-gray-700 to-gray-800 rounded-xl flex items-center justify-center">
              <span className="text-2xl">📱</span>
            </div>
            <p className="text-gray-400">No categories available</p>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className={`${styles.container} px-4 relative ${className}`} {...props}>
      <div className="container mx-auto">
        {showTitle && (
          <header className="text-center mb-12">
            <h2 className={`font-bold mb-4 ${styles.title}`}>
              <span className="bg-gradient-to-r from-red-400 to-orange-500 bg-clip-text text-transparent">
                {title}
              </span>
            </h2>
            <p className={`text-gray-400 max-w-2xl mx-auto ${styles.subtitle}`}>
              {subtitle}
            </p>
          </header>
        )}

        <div className="relative">
          {/* Custom Navigation Buttons */}
          <button
            className={`
              category-swiper-prev absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10
              w-12 h-12 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800
              text-white rounded-full flex items-center justify-center shadow-lg
              transition-all duration-300 hover:scale-110 focus:scale-110 outline-none
              ${isBeginning ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-red-500/20'}
              hidden md:flex
            `}
            disabled={isBeginning}
            aria-label="Previous categories"
          >
            <FaChevronLeft />
          </button>

          <button
            className={`
              category-swiper-next absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10
              w-12 h-12 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800
              text-white rounded-full flex items-center justify-center shadow-lg
              transition-all duration-300 hover:scale-110 focus:scale-110 outline-none
              ${isEnd ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-red-500/20'}
              hidden md:flex
            `}
            disabled={isEnd}
            aria-label="Next categories"
          >
            <FaChevronRight />
          </button>

          {/* Swiper Container */}
          <Swiper
            {...swiperConfig}
            ref={swiperRef}
            className="category-swiper"
          >
            {categories.map((category) => (
              <SwiperSlide key={category._id || category.id} className="h-auto">
                <CategoryCard
                  category={category}
                  onClick={handleCategoryClick}
                  variant={variant === 'large' ? 'large' : variant === 'compact' ? 'compact' : 'default'}
                  showAppsCount={true}
                  showProgressBar={variant !== 'compact'}
                  className="h-full"
                />
              </SwiperSlide>
            ))}
          </Swiper>

          {/* Custom Pagination */}
          <div className="category-swiper-pagination flex justify-center mt-8 md:hidden"></div>
        </div>

        {/* Show more button on mobile */}
        <div className="text-center mt-8 md:hidden">
          <button 
            className="px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-medium rounded-lg transition-all duration-300 flex items-center space-x-2 mx-auto"
            onClick={() => {
              // This could navigate to categories page or expand the view
              window.location.href = '/categories'
            }}
          >
            <span>View All Categories</span>
            <FaChevronRight className="text-sm" />
          </button>
        </div>
      </div>

      {/* Custom Swiper Styles */}
      <style jsx global>{`
        .category-swiper .swiper-slide {
          height: auto;
          display: flex;
        }
        
        .category-swiper .swiper-pagination {
          position: static;
          margin-top: 1.5rem;
        }
        
        .category-swiper .swiper-pagination-bullet {
          background: rgba(239, 68, 68, 0.3);
          opacity: 1;
          width: 8px;
          height: 8px;
          margin: 0 4px;
          transition: all 0.3s ease;
        }
        
        .category-swiper .swiper-pagination-bullet-active {
          background: #ef4444;
          transform: scale(1.2);
        }
        
        .category-swiper .swiper-pagination-bullet-dynamic {
          background: rgba(239, 68, 68, 0.5);
        }
        
        @media (max-width: 768px) {
          .category-swiper {
            overflow: visible;
            padding: 0 0 2rem 0;
          }
          
          .category-swiper .swiper-slide {
            margin-bottom: 0.5rem;
          }
        }
      `}</style>
    </section>
  )
})

CategorySwiper.displayName = 'CategorySwiper'

export default CategorySwiper 