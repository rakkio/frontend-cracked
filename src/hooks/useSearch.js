import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { api } from '@/lib/api'

export const useSearch = () => {
    const [isSearchOpen, setIsSearchOpen] = useState(false)
    const [searchQuery, setSearchQuery] = useState('')
    const [searchResults, setSearchResults] = useState([])
    const [searchLoading, setSearchLoading] = useState(false)
    const [categories, setCategories] = useState([])
    const [recentSearches, setRecentSearches] = useState([])
    
    const router = useRouter()

    // Load recent searches from localStorage
    useEffect(() => {
        const saved = localStorage.getItem('recentSearches')
        if (saved) {
            try {
                setRecentSearches(JSON.parse(saved))
            } catch (error) {
                console.error('Error loading recent searches:', error)
            }
        }
    }, [])

    // Load categories
    useEffect(() => {
        const loadCategories = async () => {
            try {
                const response = await api.getCategories()
                setCategories(response.data || [])
            } catch (error) {
                console.error('Error loading categories:', error)
            }
        }
        loadCategories()
    }, [])

    // Save search to recent searches
    const saveToRecentSearches = useCallback((query) => {
        if (!query.trim()) return
        
        const updated = [query, ...recentSearches.filter(s => s !== query)].slice(0, 10)
        setRecentSearches(updated)
        localStorage.setItem('recentSearches', JSON.stringify(updated))
    }, [recentSearches])

    // Remove search from recent searches
    const removeFromRecentSearches = useCallback((query) => {
        const updated = recentSearches.filter(s => s !== query)
        setRecentSearches(updated)
        localStorage.setItem('recentSearches', JSON.stringify(updated))
    }, [recentSearches])

    // Perform search
    const performSearch = useCallback(async (query) => {
        if (!query.trim()) {
            setSearchResults([])
            return
        }

        setSearchLoading(true)
        try {
            // Use quick search endpoint for better performance
            const response = await api.quickSearch(query.trim(), 12)
            setSearchResults(response.apps || [])
        } catch (error) {
            console.error('Search error:', error)
            setSearchResults([])
        } finally {
            setSearchLoading(false)
        }
    }, [])

    // Debounced search
    useEffect(() => {
        const timer = setTimeout(() => {
            if (searchQuery) {
                performSearch(searchQuery)
            } else {
                setSearchResults([])
            }
        }, 300)

        return () => clearTimeout(timer)
    }, [searchQuery, performSearch])

    // Handle search input change
    const handleSearchChange = useCallback((value) => {
        setSearchQuery(value)
    }, [])

    // Handle quick search
    const handleQuickSearch = useCallback((term) => {
        setSearchQuery(term)
        saveToRecentSearches(term)
        performSearch(term)
    }, [saveToRecentSearches, performSearch])

    // Handle category click
    const handleCategoryClick = useCallback((categoryName) => {
        setIsSearchOpen(false)
        router.push(`/categories?search=${encodeURIComponent(categoryName)}`)
    }, [router])

    // Handle app click
    const handleAppClick = useCallback((app) => {
        setIsSearchOpen(false)
        saveToRecentSearches(app.name)
        router.push(`/app/${app.slug}`)
    }, [router, saveToRecentSearches])

    // Handle search submit
    const handleSearchSubmit = useCallback((e) => {
        e?.preventDefault()
        if (searchQuery.trim()) {
            saveToRecentSearches(searchQuery.trim())
            setIsSearchOpen(false)
            router.push(`/apps?search=${encodeURIComponent(searchQuery.trim())}`)
        }
    }, [searchQuery, router, saveToRecentSearches])

    // Handle key press
    const handleKeyPress = useCallback((e) => {
        if (e.key === 'Enter') {
            handleSearchSubmit(e)
        } else if (e.key === 'Escape') {
            setIsSearchOpen(false)
        }
    }, [handleSearchSubmit])

    // Open search
    const openSearch = useCallback(() => {
        setIsSearchOpen(true)
    }, [])

    // Close search
    const closeSearch = useCallback(() => {
        setIsSearchOpen(false)
        setSearchQuery('')
        setSearchResults([])
    }, [])

    return {
        // State
        isSearchOpen,
        searchQuery,
        searchResults,
        searchLoading,
        categories,
        recentSearches,
        
        // Actions
        handleSearchChange,
        handleQuickSearch,
        handleCategoryClick,
        handleAppClick,
        handleSearchSubmit,
        handleKeyPress,
        openSearch,
        closeSearch,
        performSearch,
        removeFromRecentSearches
    }
} 