class SEOService {
  static generateAppStructuredData(app) {
    return {
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      "name": app.name,
      "description": app.description || `Download ${app.name} for free - Premium cracked version available`,
      "url": `https://crackmarket.xyz/app/${app.slug}`,
      "downloadUrl": `https://crackmarket.xyz/app/${app.slug}`,
      "operatingSystem": app.compatibility || "Windows, MacOS, Android, iOS",
      "applicationCategory": app.category?.name || "UtilitiesApplication",
      "softwareVersion": app.version,
      "fileSize": app.size,
      "datePublished": app.createdAt,
      "dateModified": app.updatedAt,
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": app.rating || 4.5,
        "reviewCount": app.reviewCount || 100,
        "bestRating": 5,
        "worstRating": 1
      },
      "offers": {
        "@type": "Offer",
        "price": "0.00",
        "priceCurrency": "USD",
        "availability": "https://schema.org/InStock"
      },
      "screenshot": app.screenshots?.map(screenshot => ({
        "@type": "ImageObject",
        "url": screenshot,
        "caption": `${app.name} Screenshot`
      })) || []
    }
  }
  
  static generateCategoryStructuredData(category, apps) {
    return {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      "name": `${category.name} - Free Cracked Apps`,
      "description": `Download free ${category.name.toLowerCase()} apps and software. Premium cracked applications with direct download links.`,
      "url": `https://crackmarket.xyz/category/${category.slug}`,
      "mainEntity": {
        "@type": "ItemList",
        "numberOfItems": apps.length,
        "itemListElement": apps.slice(0, 10).map((app, index) => ({
          "@type": "ListItem",
          "position": index + 1,
          "item": {
            "@type": "SoftwareApplication",
            "name": app.name,
            "url": `https://crackmarket.xyz/app/${app.slug}`
          }
        }))
      }
    }
  }
  
  static generateBreadcrumbStructuredData(items) {
    return {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": items.map((item, index) => ({
        "@type": "ListItem",
        "position": index + 1,
        "name": item.name,
        "item": `https://crackmarket.xyz${item.href}`
      }))
    }
  }
  
  static injectStructuredData(data) {
    if (typeof window !== 'undefined') {
      const existingScript = document.querySelector('script[type="application/ld+json"]')
      if (existingScript) {
        existingScript.remove()
      }
      
      const script = document.createElement('script')
      script.type = 'application/ld+json'
      script.textContent = JSON.stringify(data)
      document.head.appendChild(script)
    }
  }
}

export default SEOService