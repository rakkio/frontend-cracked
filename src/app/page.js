'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { api } from '@/lib/api'
import { useCategories } from '@/hooks/useCategories'
import CategoriesWithApps from '@/components/CategoriesWithApps'

// Componentes SOLID
import SEOHead from '@/components/home/SEOHead'
import LoadingScreen from '@/components/ui/LoadingScreen'
import HeroSection from '@/components/home/HeroSection'
import StatsSection from '@/components/home/StatsSection'
import FeaturedAppsSection from '@/components/home/FeaturedAppsSection'
import WhyChooseSection from '@/components/home/WhyChooseSection'
import FinalCTASection from '@/components/home/FinalCTASection'
import { useHomeData } from '@/hooks/useHomeData'

export default function Home() {
  const router = useRouter()
  const {
    featuredApps,
    stats,
    categories,
    loading,
    error
  } = useHomeData()

  const handleCategoryClick = (category) => {
    router.push(`/category/${category.slug}`)
  }

  const handleAppClick = (app) => {
    router.push(`/app/${app.slug || app._id}`)
  }

  if (loading) {
    return <LoadingScreen />
  }

  if (error) {
    return <ErrorScreen error={error} />
  }

  return (
    <>
      <SEOHead stats={stats} featuredApps={featuredApps} />
      
      <main className="min-h-screen bg-matrix-dark">
        <HeroSection stats={stats} />
        
        <StatsSection stats={stats} />
        
        <FeaturedAppsSection 
          featuredApps={featuredApps}
          onAppClick={handleAppClick}
          stats={stats}
        />
        
        <CategoriesWithApps
          maxCategories={8}
          maxAppsPerCategory={6}
          onAppClick={handleAppClick}
          onCategoryClick={handleCategoryClick}
          showViewAll={true}
        />
        
        <WhyChooseSection />
        
        <FinalCTASection />
      </main>
    </>
  )
}
