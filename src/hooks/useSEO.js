import { useEffect } from 'react'
import SEOService from '@/services/SEOService'

export const useSEO = (type, data) => {
  useEffect(() => {
    if (!data) return
    
    let structuredData
    
    switch (type) {
      case 'app':
        structuredData = SEOService.generateAppStructuredData(data)
        break
      case 'category':
        structuredData = SEOService.generateCategoryStructuredData(data.category, data.apps)
        break
      case 'breadcrumb':
        structuredData = SEOService.generateBreadcrumbStructuredData(data)
        break
      default:
        return
    }
    
    SEOService.injectStructuredData(structuredData)
  }, [type, data])
}

export const usePageSEO = (metadata) => {
  useEffect(() => {
    if (typeof window !== 'undefined' && metadata) {
      // Update page title
      document.title = metadata.title
      
      // Update meta description
      const metaDescription = document.querySelector('meta[name="description"]')
      if (metaDescription) {
        metaDescription.setAttribute('content', metadata.description)
      }
      
      // Update meta keywords
      const metaKeywords = document.querySelector('meta[name="keywords"]')
      if (metaKeywords) {
        metaKeywords.setAttribute('content', metadata.keywords)
      }
      
      // Update canonical URL
      const canonicalLink = document.querySelector('link[rel="canonical"]')
      if (canonicalLink && metadata.canonical) {
        canonicalLink.setAttribute('href', metadata.canonical)
      }
    }
  }, [metadata])
}