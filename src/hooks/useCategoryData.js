import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { api } from '@/lib/api'
import { CategoryService } from '@/services/CategoryService'
import SEOService from '@/services/SEOService'

export const useCategoryData = () => {
    const [category, setCategory] = useState(null)
    const [apps, setApps] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [searchTerm, setSearchTerm] = useState('')
    const [sortBy, setSortBy] = useState('createdAt')
    const [sortOrder, setSortOrder] = useState('desc')
    const [currentPage, setCurrentPage] = useState(1)
    const [totalPages, setTotalPages] = useState(1)
    const [filters, setFilters] = useState({
        featured: false,
        popular: false,
        newest: false
    })
    
    const params = useParams()
    const router = useRouter()

    useEffect(() => {
        if (params.slug) {
            fetchCategoryAndApps()
        }
    }, [params.slug, currentPage, sortBy, sortOrder, searchTerm, filters])

    // SEO structured data effect
    useEffect(() => {
        if (!loading && category && apps.length > 0) {
            // Generate structured data
            const structuredData = SEOService.generateCategoryStructuredData(category, apps)
            
            // Insert structured data into DOM
            const script = document.createElement('script')
            script.type = 'application/ld+json'
            script.textContent = JSON.stringify(structuredData)
            script.id = 'category-structured-data'
            
            // Remove existing structured data if present
            const existingScript = document.getElementById('category-structured-data')
            if (existingScript) {
                existingScript.remove()
            }
            
            // Add new structured data
            document.head.appendChild(script)
            
            // Cleanup function
            return () => {
                const scriptToRemove = document.getElementById('category-structured-data')
                if (scriptToRemove) {
                    scriptToRemove.remove()
                }
            }
        }
    }, [loading, category, apps])

    const fetchCategoryAndApps = async () => {
        try {
            setLoading(true)
            setError(null)
            
            const result = await CategoryService.fetchCategoryWithApps({
                slug: params.slug,
                page: currentPage,
                searchTerm,
                sortBy,
                sortOrder,
                filters
            })
            
            if (!result.category) {
                router.push('/404')
                return
            }
            
            setCategory(result.category)
            setApps(result.apps)
            setTotalPages(result.totalPages)
        } catch (error) {
            console.error('Error fetching category data:', error)
            setError(error)
            if (error.status === 404) {
                router.push('/404')
            }
        } finally {
            setLoading(false)
        }
    }

    const handleAppClick = (app) => {
        router.push(`/app/${app.slug}`)
    }

    const handleFilterChange = (filterName) => {
        setFilters(prev => ({
            ...prev,
            [filterName]: !prev[filterName]
        }))
        setCurrentPage(1)
    }

    const handleSortChange = (newSortBy) => {
        if (sortBy === newSortBy) {
            setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
        } else {
            setSortBy(newSortBy)
            setSortOrder('desc')
        }
        setCurrentPage(1)
    }

    const handleSearchChange = (term) => {
        setSearchTerm(term)
        setCurrentPage(1)
    }

    const handlePageChange = (page) => {
        setCurrentPage(page)
    }

    return {
        category,
        apps,
        loading,
        error,
        searchTerm,
        sortBy,
        sortOrder,
        currentPage,
        totalPages,
        filters,
        handleAppClick,
        handleFilterChange,
        handleSortChange,
        handleSearchChange,
        handlePageChange
    }
}