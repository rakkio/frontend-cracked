'use client'

import { useMemo } from 'react'
import { 
  generateStructuredData, 
  generateMetaTags,
  generateOpenGraphTags,
  generateTwitterCardTags
} from '@/utils/seoUtils'

const SEOHead = ({ stats, featuredApps, pageData = {} }) => {
  // Generate meta tags
  const metaTags = generateMetaTags('home', pageData.meta)
  const ogTags = generateOpenGraphTags('home', pageData.og)
  const twitterTags = generateTwitterCardTags('home', pageData.twitter)

  // Generate structured data for homepage using useMemo to avoid re-computation
  const structuredData = useMemo(() => {
    if (featuredApps.length > 0 || stats) {
      return generateStructuredData(stats, featuredApps)
    }
    return null
  }, [featuredApps, stats])

  return (
    <>
      {/* Basic Meta Tags */}
      <title>{metaTags.title}</title>
      <meta name="description" content={metaTags.description} />
      <meta name="keywords" content={metaTags.keywords} />
      <meta name="robots" content={metaTags.robots} />
      <meta name="author" content={metaTags.author} />
      <link rel="canonical" href="https://crackmarket.xyz/" />
      
      {/* Open Graph */}
      <meta property="og:title" content={ogTags.title} />
      <meta property="og:description" content={ogTags.description} />
      <meta property="og:type" content={ogTags.type} />
      <meta property="og:url" content={ogTags.url} />
      <meta property="og:image" content={ogTags.image} />
      <meta property="og:site_name" content={ogTags.siteName} />
      
      {/* Twitter Card */}
      <meta name="twitter:card" content={twitterTags.card} />
      <meta name="twitter:title" content={twitterTags.title} />
      <meta name="twitter:description" content={twitterTags.description} />
      <meta name="twitter:image" content={twitterTags.image} />
      
      {/* Additional SEO Meta Tags */}
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <meta name="theme-color" content="#ef4444" />
      <meta name="msapplication-TileColor" content="#ef4444" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
      
      {/* Preconnect for Performance */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link rel="dns-prefetch" href="//appscracked.com" />
      
      {/* Structured Data - Using React approach instead of manual DOM manipulation */}
      {structuredData && (
        <script 
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(structuredData)
          }}
        />
      )}
    </>
  )
}

export default SEOHead