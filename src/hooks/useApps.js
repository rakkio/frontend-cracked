'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { api } from '@/lib/api'

export const useApps = () => {
    const [apps, setApps] = useState([])
    const [categories, setCategories] = useState([])
    const [loading, setLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState('')
    const [selectedCategory, setSelectedCategory] = useState('')
    const [sortBy, setSortBy] = useState('createdAt')
    const [sortOrder, setSortOrder] = useState('desc')
    const [currentPage, setCurrentPage] = useState(1)
    const [totalPages, setTotalPages] = useState(1)
    const [totalApps, setTotalApps] = useState(0)
    const [viewMode, setViewMode] = useState('grid')
    const [filters, setFilters] = useState({
        featured: false,
        popular: false,
        newest: false,
        topRated: false
    })
    
    const router = useRouter()
    const searchParams = useSearchParams()

    // Initialize from URL params
    useEffect(() => {
        const search = searchParams.get('search') || ''
        const category = searchParams.get('category') || ''
        const page = parseInt(searchParams.get('page')) || 1
        const sort = searchParams.get('sort') || 'createdAt'
        const order = searchParams.get('order') || 'desc'
        const featured = searchParams.get('featured') === 'true'
        const popular = searchParams.get('popular') === 'true'
        const newest = searchParams.get('newest') === 'true'
        const topRated = searchParams.get('topRated') === 'true'

        setSearchTerm(search)
        setSelectedCategory(category)
        setCurrentPage(page)
        setSortBy(sort)
        setSortOrder(order)
        setFilters({ featured, popular, newest, topRated })
    }, [searchParams])

    const fetchApps = useCallback(async () => {
        try {
            setLoading(true)
            const response = await api.getApps({
                page: currentPage,
                limit: 20,
                search: searchTerm || undefined,
                category: selectedCategory || undefined,
                sortBy: sortBy,
                sortOrder: sortOrder,
                featured: filters.featured ? 'true' : undefined,
                popular: filters.popular ? 'true' : undefined,
                newest: filters.newest ? 'true' : undefined,
                topRated: filters.topRated ? 'true' : undefined
            })
            
            setApps(response.data?.apps || [])
            setTotalPages(response.data?.pagination?.pages || 1)
            setTotalApps(response.data?.pagination?.total || 0)
        } catch (error) {
            console.error('Error fetching apps:', error)
            setApps([])
        } finally {
            setLoading(false)
        }
    }, [currentPage, searchTerm, selectedCategory, sortBy, sortOrder, filters])

    const fetchCategories = useCallback(async () => {
        try {
            const response = await api.getCategories()
            setCategories(response.categories || [])
        } catch (error) {
            console.error('Error fetching categories:', error)
        }
    }, [])

    // Fetch data when dependencies change
    useEffect(() => {
        fetchApps()
    }, [fetchApps])

    // Fetch categories once
    useEffect(() => {
        fetchCategories()
    }, [fetchCategories])

    const updateURL = useCallback((newParams) => {
        const url = new URL(window.location)
        
        // Clear existing params
        url.searchParams.delete('search')
        url.searchParams.delete('category')
        url.searchParams.delete('page')
        url.searchParams.delete('sort')
        url.searchParams.delete('order')
        url.searchParams.delete('featured')
        url.searchParams.delete('popular')
        url.searchParams.delete('newest')
        url.searchParams.delete('topRated')
        
        // Set new params
        if (newParams.search) url.searchParams.set('search', newParams.search)
        if (newParams.category) url.searchParams.set('category', newParams.category)
        if (newParams.page && newParams.page > 1) url.searchParams.set('page', newParams.page)
        if (newParams.sort && newParams.sort !== 'createdAt') url.searchParams.set('sort', newParams.sort)
        if (newParams.order && newParams.order !== 'desc') url.searchParams.set('order', newParams.order)
        if (newParams.featured) url.searchParams.set('featured', 'true')
        if (newParams.popular) url.searchParams.set('popular', 'true')
        if (newParams.newest) url.searchParams.set('newest', 'true')
        if (newParams.topRated) url.searchParams.set('topRated', 'true')
        
        window.history.pushState({}, '', url)
    }, [])

    const handleAppClick = (app) => {
        router.push(`/app/${app.slug}`)
    }

    const handleSearchChange = useCallback((value) => {
        setSearchTerm(value)
        setCurrentPage(1)
        updateURL({
            search: value,
            category: selectedCategory,
            page: 1,
            sort: sortBy,
            order: sortOrder,
            featured: filters.featured,
            popular: filters.popular,
            newest: filters.newest,
            topRated: filters.topRated
        })
    }, [selectedCategory, sortBy, sortOrder, filters, updateURL])

    const handleCategoryChange = useCallback((categoryId) => {
        setSelectedCategory(categoryId)
        setCurrentPage(1)
        updateURL({
            search: searchTerm,
            category: categoryId,
            page: 1,
            sort: sortBy,
            order: sortOrder,
            featured: filters.featured,
            popular: filters.popular,
            newest: filters.newest,
            topRated: filters.topRated
        })
    }, [searchTerm, sortBy, sortOrder, filters, updateURL])

    const handleFilterChange = useCallback((filterName) => {
        const newFilters = {
            ...filters,
            [filterName]: !filters[filterName]
        }
        setFilters(newFilters)
        setCurrentPage(1)
        updateURL({
            search: searchTerm,
            category: selectedCategory,
            page: 1,
            sort: sortBy,
            order: sortOrder,
            featured: newFilters.featured,
            popular: newFilters.popular,
            newest: newFilters.newest,
            topRated: newFilters.topRated
        })
    }, [filters, searchTerm, selectedCategory, sortBy, sortOrder, updateURL])

    const handleSortChange = useCallback((newSortBy) => {
        let newSortOrder = 'desc'
        if (sortBy === newSortBy) {
            newSortOrder = sortOrder === 'asc' ? 'desc' : 'asc'
        }
        
        setSortBy(newSortBy)
        setSortOrder(newSortOrder)
        setCurrentPage(1)
        updateURL({
            search: searchTerm,
            category: selectedCategory,
            page: 1,
            sort: newSortBy,
            order: newSortOrder,
            featured: filters.featured,
            popular: filters.popular,
            newest: filters.newest,
            topRated: filters.topRated
        })
    }, [sortBy, sortOrder, searchTerm, selectedCategory, filters, updateURL])

    const handlePageChange = useCallback((page) => {
        setCurrentPage(page)
        updateURL({
            search: searchTerm,
            category: selectedCategory,
            page: page,
            sort: sortBy,
            order: sortOrder,
            featured: filters.featured,
            popular: filters.popular,
            newest: filters.newest,
            topRated: filters.topRated
        })
        
        // Scroll to top when page changes
        window.scrollTo({ top: 0, behavior: 'smooth' })
    }, [searchTerm, selectedCategory, sortBy, sortOrder, filters, updateURL])

    const clearAllFilters = useCallback(() => {
        setSearchTerm('')
        setSelectedCategory('')
        setFilters({
            featured: false,
            popular: false,
            newest: false,
            topRated: false
        })
        setSortBy('createdAt')
        setSortOrder('desc')
        setCurrentPage(1)
        window.history.pushState({}, '', '/apps')
    }, [])

    return {
        // State
        apps,
        categories,
        loading,
        searchTerm,
        selectedCategory,
        sortBy,
        sortOrder,
        currentPage,
        totalPages,
        totalApps,
        viewMode,
        filters,
        // Actions
        setSearchTerm: handleSearchChange,
        setCurrentPage: handlePageChange,
        setViewMode,
        handleAppClick,
        handleCategoryChange,
        handleFilterChange,
        handleSortChange,
        clearAllFilters,
        fetchData: fetchApps,
        updateURL
    }
}