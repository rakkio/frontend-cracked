// SEO Structured Data Generator
export const generateStructuredData = (stats, featuredApps) => {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": "https://crackmarket.xyz/#website",
        "url": "https://crackmarket.xyz/",
        "name": "AppsCracked",
        "description": "Download free cracked apps, premium software, and games. Safe, tested, and virus-free applications with direct download links.",
        "publisher": {
          "@id": "https://crackmarket.xyz/#organization"
        },
        "potentialAction": [
          {
            "@type": "SearchAction",
            "target": {
              "@type": "EntryPoint",
              "urlTemplate": "https://crackmarket.xyz/apps?search={search_term_string}"
            },
            "query-input": "required name=search_term_string"
          }
        ],
        "inLanguage": "en-US"
      },
      {
        "@type": "Organization",
        "@id": "https://crackmarket.xyz/#organization",
        "name": "AppsCracked",
        "url": "https://crackmarket.xyz/",
        "logo": {
          "@type": "ImageObject",
          "inLanguage": "en-US",
          "@id": "https://crackmarket.xyz/#/schema/logo/image/",
          "url": "https://crackmarket.xyz/logo.png",
          "contentUrl": "https://crackmarket.xyz/logo.png",
          "width": 512,
          "height": 512,
          "caption": "AppsCracked"
        },
        "image": {
          "@id": "https://crackmarket.xyz/#/schema/logo/image/"
        },
        "sameAs": [
          "https://twitter.com/appscracked",
          "https://facebook.com/appscracked"
        ]
      },
      {
        "@type": "WebPage",
        "@id": "https://crackmarket.xyz/#webpage",
        "url": "https://crackmarket.xyz/",
        "name": "AppsCracked - Download Free Cracked Apps & Premium Software 2024",
        "isPartOf": {
          "@id": "https://crackmarket.xyz/#website"
        },
        "about": {
          "@id": "https://crackmarket.xyz/#organization"
        },
        "description": "Download the latest cracked apps, premium software, and games for free. Safe, tested, and virus-free applications with direct download links. Over 10,000+ apps available.",
        "breadcrumb": {
          "@id": "https://crackmarket.xyz/#breadcrumb"
        },
        "inLanguage": "en-US",
        "potentialAction": [
          {
            "@type": "ReadAction",
            "target": ["https://crackmarket.xyz/"]
          }
        ]
      },
      {
        "@type": "BreadcrumbList",
        "@id": "https://crackmarket.xyz/#breadcrumb",
        "itemListElement": [
          {
            "@type": "ListItem",
            "position": 1,
            "name": "Home",
            "item": "https://crackmarket.xyz/"
          }
        ]
      },
      ...(featuredApps?.slice(0, 5).map((app, index) => ({
        "@type": "SoftwareApplication",
        "name": app.name,
        "description": app.description || `Download ${app.name} for free - Premium cracked version available`,
        "url": `https://crackmarket.xyz/app/${app.slug}`,
        "downloadUrl": `https://crackmarket.xyz/app/${app.slug}`,
        "operatingSystem": "Windows, MacOS, Android, iOS",
        "applicationCategory": "UtilitiesApplication",
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
        }
      })) || [])
    ]
  }
}

// Additional SEO utilities
export const generateMetaTags = (page, data = {}) => {
  const defaultMeta = {
    title: "AppsCracked - Download Free Cracked Apps & Premium Software 2024",
    description: "Download the latest cracked apps, premium software, and games for free. Safe, tested, and virus-free applications with direct download links.",
    keywords: "cracked apps, free software download, premium apps free, cracked software, free apps download, crack apps, modded apps",
    author: "AppsCracked",
    robots: "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1"
  }

  return {
    ...defaultMeta,
    ...data
  }
}

export const generateOpenGraphTags = (page, data = {}) => {
  const defaultOG = {
    title: "AppsCracked - Download Free Cracked Apps & Premium Software",
    description: "Access thousands of premium applications for free. Download cracked apps, games, and software with direct links. Safe, tested, and virus-free.",
    type: "website",
    url: "https://crackmarket.xyz/",
    image: "https://crackmarket.xyz/og-image.jpg",
    siteName: "AppsCracked"
  }

  return {
    ...defaultOG,
    ...data
  }
}

export const generateTwitterCardTags = (page, data = {}) => {
  const defaultTwitter = {
    card: "summary_large_image",
    title: "AppsCracked - Download Free Cracked Apps & Premium Software",
    description: "Access thousands of premium applications for free. Download cracked apps, games, and software with direct links.",
    image: "https://crackmarket.xyz/twitter-image.jpg"
  }

  return {
    ...defaultTwitter,
    ...data
  }
}