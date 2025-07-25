'use client'

import { CategoryPageContainer } from '@/components/category/CategoryPageContainer'
import { CategorySEOHead } from '@/components/category/CategorySEOHead'
import { useCategoryData } from '@/hooks/useCategoryData'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import { CategoryNotFound } from '@/components/category/CategoryNotFound'

export default function CategoryPage() {
    const { category, apps, loading, error, ...categoryData } = useCategoryData()

    if (loading) {
        return <LoadingSpinner message="Cargando categoría..." />
    }

    if (error || !category) {
        return <CategoryNotFound />
    }

    return (
        <>
            <CategorySEOHead category={category} apps={apps} {...categoryData} />
            <CategoryPageContainer 
                category={category} 
                apps={apps} 
                {...categoryData}
            />
        </>
    )
}