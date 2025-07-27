'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function HomePageClient({ featuredApps, stats, categories }) {
    const router = useRouter()
    const [isNavigating, setIsNavigating] = useState(false)

    const handleCategoryClick = async (category) => {
        if (isNavigating) return
        
        setIsNavigating(true)
        try {
            // Add analytics tracking
            if (typeof gtag !== 'undefined') {
                gtag('event', 'category_click', {
                    event_category: 'navigation',
                    event_label: category.name,
                    value: 1
                })
            }
            
            router.push(`/category/${category.slug}`)
        } catch (error) {
            console.error('Navigation error:', error)
            setIsNavigating(false)
        }
    }

    const handleAppClick = async (app) => {
        if (isNavigating) return
        
        setIsNavigating(true)
        try {
            // Add analytics tracking
            if (typeof gtag !== 'undefined') {
                gtag('event', 'app_click', {
                    event_category: 'navigation',
                    event_label: app.name,
                    value: 1
                })
            }
            
            router.push(`/app/${app.slug || app._id}`)
        } catch (error) {
            console.error('Navigation error:', error)
            setIsNavigating(false)
        }
    }

    const handleViewAllApps = () => {
        if (isNavigating) return
        
        setIsNavigating(true)
        try {
            if (typeof gtag !== 'undefined') {
                gtag('event', 'view_all_apps', {
                    event_category: 'navigation',
                    value: 1
                })
            }
            
            router.push('/apps')
        } catch (error) {
            console.error('Navigation error:', error)
            setIsNavigating(false)
        }
    }

    const handleViewAllCategories = () => {
        if (isNavigating) return
        
        setIsNavigating(true)
        try {
            if (typeof gtag !== 'undefined') {
                gtag('event', 'view_all_categories', {
                    event_category: 'navigation',
                    value: 1
                })
            }
            
            router.push('/categories')
        } catch (error) {
            console.error('Navigation error:', error)
            setIsNavigating(false)
        }
    }

    const handleSearchSubmit = (searchTerm) => {
        if (isNavigating || !searchTerm.trim()) return
        
        setIsNavigating(true)
        try {
            if (typeof gtag !== 'undefined') {
                gtag('event', 'search', {
                    event_category: 'engagement',
                    event_label: searchTerm,
                    value: 1
                })
            }
            
            router.push(`/apps?search=${encodeURIComponent(searchTerm.trim())}`)
        } catch (error) {
            console.error('Search navigation error:', error)
            setIsNavigating(false)
        }
    }

    // This component provides client-side interactivity handlers
    // The actual rendering is done by server components
    // We expose these handlers through a global context or props to child components
    
    return (
        <div style={{ display: 'none' }}>
            {/* This component only provides client-side handlers */}
            {/* The actual UI is rendered by server components */}
            {/* Handlers are available through context or passed as props */}
            
            {/* Store handlers in window for access by server components */}
            <script
                dangerouslySetInnerHTML={{
                    __html: `
                        window.homePageHandlers = {
                            handleCategoryClick: ${handleCategoryClick.toString()},
                            handleAppClick: ${handleAppClick.toString()},
                            handleViewAllApps: ${handleViewAllApps.toString()},
                            handleViewAllCategories: ${handleViewAllCategories.toString()},
                            handleSearchSubmit: ${handleSearchSubmit.toString()}
                        };
                    `
                }}
            />
        </div>
    )
}
