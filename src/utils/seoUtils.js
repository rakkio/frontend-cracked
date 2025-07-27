// SEO Structured Data Generator
export const generateStructuredData = (stats, featuredApps) => {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": "https://crackmarket.xyz/#website",
        "url": "https://crackmarket.xyz/",
        "name": "CrackMarket",
        "alternateName": "Crack Market - Free Software Downloads",
        "description": "Download free cracked apps, premium software, and games. Over 50,000+ tested applications with direct download links. Safe, virus-free, and updated daily.",
        "keywords": "cracked apps download, free premium software, crack software download, modded apps free, premium apps cracked",
        "inLanguage": ["en-US", "it-IT", "es-ES"],
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
        ]
      },
      {
        "@type": "Organization",
        "@id": "https://crackmarket.xyz/#organization",
        "name": "CrackMarket",
        "url": "https://crackmarket.xyz/",
        "description": "Leading platform for downloading free cracked applications and premium software. Trusted by millions of users worldwide.",
        "foundingDate": "2024",
        "knowsAbout": [
          "Software Cracking",
          "Application Distribution",
          "Digital Downloads",
          "Software Testing",
          "Cybersecurity"
        ],
        "areaServed": "Worldwide",
        "logo": {
          "@type": "ImageObject",
          "url": "https://crackmarket.xyz/logo.png",
          "width": 512,
          "height": 512
        }
      },
      {
        "@type": "WebPage",
        "@id": "https://crackmarket.xyz/#webpage",
        "url": "https://crackmarket.xyz/",
        "name": "AppsCracked - Download Free Cracked Apps & Premium Software 2025",
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

// Nuove funzioni SEO
export const generateKeywordMetadata = (keyword, pageType = 'keyword') => {
  const keywordData = {
    'cracked-apps-download': {
      title: 'Download Cracked Apps Free - Latest Premium Applications 2024 | CrackMarket',
      description: 'Download the latest cracked apps for free. Premium applications, games, and software with direct download links. Safe, tested, and virus-free.',
      keywords: 'cracked apps download, free premium apps, crack apps, modded applications, premium software free'
    },
    'free-premium-software': {
      title: 'Free Premium Software Download - Cracked Programs 2024 | CrackMarket',
      description: 'Download premium software for free. Professional programs, design tools, and productivity software with full features unlocked.',
      keywords: 'free premium software, cracked software download, premium programs free, professional software crack'
    },
    'app-craccate-gratis': {
      title: 'App Craccate Gratis - Scarica Software Premium Gratuito 2024 | CrackMarket',
      description: 'Scarica le ultime app craccate gratis. Applicazioni premium, giochi e software con link di download diretto. Sicuro, testato e senza virus.',
      keywords: 'app craccate gratis, software premium gratuito, programmi craccati, applicazioni premium gratis'
    }
  }
  
  return keywordData[keyword] || {
    title: `${keyword.replace(/-/g, ' ')} | CrackMarket`,
    description: `Find the best ${keyword.replace(/-/g, ' ')} on CrackMarket. Download premium software and applications for free.`,
    keywords: keyword.replace(/-/g, ' ')
  }
}

export const generateCategoryMetadata = (categorySlug, categoryName) => {
  return {
    title: `${categoryName} - Free Cracked Apps & Software | CrackMarket`,
    description: `Download free ${categoryName.toLowerCase()} apps and software. Premium cracked applications with direct download links. Safe, tested, and virus-free.`,
    keywords: `${categoryName.toLowerCase()} cracked apps, free ${categoryName.toLowerCase()} software, ${categoryName.toLowerCase()} crack download, premium ${categoryName.toLowerCase()} apps`,
    openGraph: {
      title: `${categoryName} - Free Cracked Apps | CrackMarket`,
      description: `Download free ${categoryName.toLowerCase()} apps and software. Premium cracked applications with direct download links.`,
      url: `https://crackmarket.xyz/category/${categorySlug}`,
      type: 'website'
    }
  }
}

export const generateMetaTags = (page, data = {}) => {
  const defaultMeta = {
    title: "AppsCracked - Download Free Cracked Apps & Premium Software 2025",
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