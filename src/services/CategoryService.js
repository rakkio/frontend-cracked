import { api } from '@/lib/api'

export class CategoryService {
    static async fetchCategoryWithApps({ slug, page, searchTerm, sortBy, sortOrder, filters }) {
        // Fetch categories to find the one with this slug
        const categoriesResponse = await api.getCategories()
        const foundCategory = categoriesResponse.categories?.find(c => c.slug === slug)
        
        if (!foundCategory) {
            throw new Error('Category not found')
        }
        
        // Fetch apps for this category
        const appsResponse = await api.getApps({
            category: foundCategory._id,
            page,
            limit: 12,
            search: searchTerm,
            sortBy,
            sortOrder,
            featured: filters.featured ? 'true' : undefined,
            popular: filters.popular ? 'true' : undefined,
            newest: filters.newest ? 'true' : undefined
        })
        
        return {
            category: foundCategory,
            apps: appsResponse.data.apps || [],
            totalPages: appsResponse.data.pagination?.pages || 1
        }
    }

    static generatePageTitle(category, searchTerm, filters) {
        if (!category) return 'Category | AppsCracked'
        
        if (searchTerm) {
            return `${searchTerm} in ${category.name} - Free Downloads | AppsCracked`
        }
        if (filters.featured) {
            return `Featured ${category.name} Apps - Premium Downloads 2024 | AppsCracked`
        }
        if (filters.newest) {
            return `Latest ${category.name} Apps - New Releases 2024 | AppsCracked`
        }
        return `${category.name} Apps - Free Download Premium Software 2024 | AppsCracked`
    }

    static generatePageDescription(category, apps, searchTerm) {
        if (!category) return 'Browse premium applications by category'
        
        if (searchTerm) {
            return `Download ${searchTerm} in ${category.name} category. ${apps.length} premium cracked applications with direct download links, virus-free and tested.`
        }
        return `Download ${apps.length}+ premium ${category.name} applications for free. ${category.description || `Best ${category.name} software collection with direct download links, 100% free and safe.`}`
    }

    static generateKeywords(category, searchTerm) {
        if (!category) return 'apps, software, download'
        
        const baseKeywords = [
            `${category.name.toLowerCase()} apps`,
            `${category.name.toLowerCase()} software`,
            `free ${category.name.toLowerCase()}`,
            `download ${category.name.toLowerCase()}`,
            `${category.name.toLowerCase()} cracked`,
            `premium ${category.name.toLowerCase()}`
        ]
        
        if (searchTerm) {
            return [...baseKeywords, searchTerm, `${searchTerm} ${category.name.toLowerCase()}`, `${searchTerm} free download`].join(', ')
        }
        
        return [...baseKeywords, 'free download', 'cracked apps', 'premium software', 'direct links'].join(', ')
    }
}