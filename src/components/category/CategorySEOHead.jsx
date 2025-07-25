import Head from 'next/head'
import { CategoryService } from '@/services/CategoryService'

export const CategorySEOHead = ({ category, apps, searchTerm, filters }) => {
    const pageTitle = CategoryService.generatePageTitle(category, searchTerm, filters)
    const pageDescription = CategoryService.generatePageDescription(category, apps, searchTerm)
    const keywords = CategoryService.generateKeywords(category, searchTerm)

    return (
        <Head>
            <title>{pageTitle}</title>
            <meta name="description" content={pageDescription} />
            <meta name="keywords" content={keywords} />
            <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
            <meta name="author" content="AppsCracked" />
            <link rel="canonical" href={`https://appscracked.com/category/${category?.slug}`} />
            
            {/* Open Graph */}
            <meta property="og:title" content={pageTitle} />
            <meta property="og:description" content={pageDescription} />
            <meta property="og:type" content="website" />
            <meta property="og:url" content={`https://appscracked.com/category/${category?.slug}`} />
            <meta property="og:image" content={`https://appscracked.com/og-category-${category?.slug}.jpg`} />
            <meta property="og:site_name" content="AppsCracked" />
            
            {/* Twitter Card */}
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:title" content={pageTitle} />
            <meta name="twitter:description" content={pageDescription} />
            <meta name="twitter:image" content={`https://appscracked.com/twitter-category-${category?.slug}.jpg`} />
        </Head>
    )
}