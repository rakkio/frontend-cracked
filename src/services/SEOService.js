export class SEOService {
    static generateCategoryStructuredData(category, apps) {
        const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://crackmarket.xyz'
        
        return {
            "@context": "https://schema.org",
            "@graph": [
                {
                    "@type": "WebPage",
                    "@id": `${baseUrl}/category/${category.slug}#webpage`,
                    "url": `${baseUrl}/category/${category.slug}`,
                    "name": `${category.name} Apps - Free Downloads | AppsCracked`,
                    "description": `Download ${apps.length}+ premium ${category.name} applications for free. ${category.description || `Best ${category.name} software collection with direct download links.`}`,
                    "breadcrumb": {
                        "@id": `${baseUrl}/category/${category.slug}#breadcrumb`
                    },
                    "inLanguage": "en-US"
                },
                {
                    "@type": "BreadcrumbList", 
                    "@id": `${baseUrl}/category/${category.slug}#breadcrumb`,
                    "itemListElement": [
                        {
                            "@type": "ListItem",
                            "position": 1,
                            "name": "Home",
                            "item": baseUrl
                        },
                        {
                            "@type": "ListItem",
                            "position": 2,
                            "name": "Categories", 
                            "item": `${baseUrl}/categories`
                        },
                        {
                            "@type": "ListItem",
                            "position": 3,
                            "name": category.name,
                            "item": `${baseUrl}/category/${category.slug}`
                        }
                    ]
                },
                {
                    "@type": "CollectionPage",
                    "name": `${category.name} Apps Collection`,
                    "description": category.description || `Collection of ${category.name} applications for free download`,
                    "url": `${baseUrl}/category/${category.slug}`,
                    "mainEntity": {
                        "@type": "ItemList",
                        "numberOfItems": apps.length,
                        "itemListElement": apps.slice(0, 20).map((app, index) => ({
                            "@type": "SoftwareApplication",
                            "position": index + 1,
                            "name": app.name,
                            "description": app.shortDescription || app.description || `Download ${app.name} for free - Premium ${category.name} application`,
                            "url": `${baseUrl}/app/${app.slug}`,
                            "downloadUrl": `${baseUrl}/app/${app.slug}`,
                            "applicationCategory": category.name,
                            "operatingSystem": "Windows, MacOS, Android, iOS",
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
                                "availability": "https://schema.org/InStock",
                                "seller": {
                                    "@type": "Organization",
                                    "name": "AppsCracked"
                                }
                            }
                        }))
                    }
                }
            ]
        }
    }

    static insertCategoryStructuredData(category, apps) {
        const structuredData = this.generateCategoryStructuredData(category, apps)
        
        // Remove existing structured data
        const existingScript = document.querySelector('script[data-category-structured="true"]')
        if (existingScript) {
            existingScript.remove()
        }
        
        // Add new structured data
        const script = document.createElement('script')
        script.type = 'application/ld+json'
        script.setAttribute('data-category-structured', 'true')
        script.textContent = JSON.stringify(structuredData)
        document.head.appendChild(script)
    }
}