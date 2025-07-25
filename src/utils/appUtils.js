export const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 B'
    const k = 1024
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

export const generateSEOData = (app) => {
    const getPageTitle = () => {
        if (!app) return 'Loading App | AppsCracked'
        
        const version = app.version ? ` v${app.version}` : ''
        const category = app.category ? ` ${app.category.name}` : ''
        
        return `Download ${app.name}${version} Free - Premium${category} App 2024 | AppsCracked`
    }

    const getPageDescription = () => {
        if (!app) return 'Premium application download'
        
        const baseDesc = `Download ${app.name} for free. ${app.description ? app.description.substring(0, 120) + '...' : 'Premium cracked version with full features unlocked.'} Direct download link, virus-free, and 100% safe.`
        
        return baseDesc.length > 160 ? baseDesc.substring(0, 157) + '...' : baseDesc
    }

    const getKeywords = () => {
        if (!app) return 'app, download, free'
        
        const keywords = [
            app.name.toLowerCase(),
            `download ${app.name.toLowerCase()}`,
            `${app.name.toLowerCase()} free`,
            `${app.name.toLowerCase()} cracked`,
            `${app.name.toLowerCase()} premium`,
            app.category?.name.toLowerCase(),
            app.developer?.toLowerCase(),
            app.platform?.toLowerCase(),
            'free download',
            'cracked app',
            'premium software'
        ].filter(Boolean)
        
        return keywords.slice(0, 15).join(', ')
    }

    return { getPageTitle, getPageDescription, getKeywords }
}