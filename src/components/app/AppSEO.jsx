import Head from 'next/head'

export default function AppSEO({ app }) {
    if (!app) return null

    const getPageTitle = () => {
        const baseTitle = `${app.name} - Free Download`
        const versionText = app.version ? ` v${app.version}` : ''
        const platformText = app.platform ? ` for ${app.platform}` : ''
        return `${baseTitle}${versionText}${platformText} | AppsCracked`
    }

    const getPageDescription = () => {
        if (app.description) {
            const cleanDesc = app.description.replace(/<[^>]*>/g, '').substring(0, 150)
            return `${cleanDesc}... Download ${app.name} for free with premium features unlocked.`
        }
        return `Download ${app.name} for free. Get the latest version with all premium features unlocked. Safe, fast, and virus-free download.`
    }

    const getKeywords = () => {
        const baseKeywords = [
            app.name?.toLowerCase() || '',
            'free download',
            'cracked',
            'premium',
            'full version'
        ].filter(Boolean)
        
        if (app.category?.name) baseKeywords.push(app.category.name.toLowerCase())
        if (app.platform) baseKeywords.push(app.platform.toLowerCase())
        if (app.developer) baseKeywords.push(app.developer.toLowerCase())
        
        return baseKeywords.join(', ')
    }

    return (
        <Head>
            <title>{getPageTitle()}</title>
            <meta name="description" content={getPageDescription()} />
            <meta name="keywords" content={getKeywords()} />
            <meta name="robots" content="index, follow" />
            <link rel="canonical" href={`https://appscracked.com/app/${app.slug}`} />
            
            {/* Open Graph */}
            <meta property="og:type" content="website" />
            <meta property="og:title" content={getPageTitle()} />
            <meta property="og:description" content={getPageDescription()} />
            <meta property="og:url" content={`https://appscracked.com/app/${app.slug}`} />
            <meta property="og:image" content={app.images?.[0] || 'https://appscracked.com/default-app.jpg'} />
            <meta property="og:image:width" content="1200" />
            <meta property="og:image:height" content="630" />
            <meta property="og:site_name" content="AppsCracked" />
            
            {/* Twitter Card */}
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:title" content={getPageTitle()} />
            <meta name="twitter:description" content={getPageDescription()} />
            <meta name="twitter:image" content={app.images?.[0] || 'https://appscracked.com/default-app.jpg'} />
            
            {/* App-specific meta */}
            <meta name="application-name" content={app.name} />
            <meta name="mobile-web-app-capable" content="yes" />
            <meta property="app:price:amount" content="0.00" />
            <meta property="app:price:currency" content="USD" />
        </Head>
    )
}