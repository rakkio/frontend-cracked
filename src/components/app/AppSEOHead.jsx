import { generateSEOData } from '@/utils/appUtils'

export const AppSEOHead = ({ app }) => {
    const { getPageTitle, getPageDescription, getKeywords } = generateSEOData(app)

    return (
        <>
            <title>{getPageTitle()}</title>
            <meta name="description" content={getPageDescription()} />
            <meta name="keywords" content={getKeywords()} />
            <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
            <meta name="author" content="AppsCracked" />
            <link rel="canonical" href={`https://appscracked.com/app/${app?.slug}`} />
            
            {/* Open Graph */}
            <meta property="og:title" content={getPageTitle()} />
            <meta property="og:description" content={getPageDescription()} />
            <meta property="og:type" content="website" />
            <meta property="og:url" content={`https://appscracked.com/app/${app?.slug}`} />
            <meta property="og:image" content={app?.images?.[0] || 'https://appscracked.com/default-app.jpg'} />
            <meta property="og:image:width" content="1200" />
            <meta property="og:image:height" content="630" />
            <meta property="og:site_name" content="AppsCracked" />
            
            {/* Twitter Card */}
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:title" content={getPageTitle()} />
            <meta name="twitter:description" content={getPageDescription()} />
            <meta name="twitter:image" content={app?.images?.[0] || 'https://appscracked.com/default-app.jpg'} />
            
            {/* App-specific meta */}
            <meta name="application-name" content={app?.name} />
            <meta name="mobile-web-app-capable" content="yes" />
            <meta property="app:price:amount" content="0.00" />
            <meta property="app:price:currency" content="USD" />
        </>
    )
}