'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { api } from '@/lib/api'
import { useDownload } from '@/hooks/useDownload'

export function useAppDetails(slug) {
    const [app, setApp] = useState(null)
    const [relatedApps, setRelatedApps] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const router = useRouter()
    const { triggerDownload } = useDownload()

    useEffect(() => {
        if (!slug) return

        const fetchAppData = async () => {
            try {
                setLoading(true)
                setError(null)

                const response = await api.getAppBySlug(slug)
                
                // Extraer los datos de la app de la respuesta
                const appData = response.data?.app || response.app || response.data || response
                
                if (!appData) {
                    setError('App not found')
                    return
                }

                setApp(appData)

                // Fetch related apps
                if (appData.category) {
                    try {
                        const relatedResponse = await api.getApps({
                            category: appData.category._id,
                            limit: 5,
                            exclude: appData._id
                        })
                        // Extraer las apps relacionadas de la respuesta
                        const relatedAppsData = relatedResponse.data?.apps || relatedResponse.apps || []
                        setRelatedApps(relatedAppsData)
                    } catch (relatedError) {
                        setRelatedApps([])
                    }
                }

                // Insert structured data
                const structuredData = generateAppStructuredData(appData)
                const script = document.createElement('script')
                script.type = 'application/ld+json'
                script.textContent = JSON.stringify(structuredData)
                document.head.appendChild(script)

                return () => {
                    const existingScript = document.querySelector('script[type="application/ld+json"]')
                    if (existingScript) {
                        document.head.removeChild(existingScript)
                    }
                }
            } catch (err) {
                setError(err.message || 'Failed to load app')
            } finally {
                setLoading(false)
            }
        }

        fetchAppData()
    }, [slug])

    const handleDownload = () => {
        if (!app) return
    
        
        // Prepare download data for ad-redirect page
        const downloadData = {
            url: app.downloadUrl || `https://example.com/download/${app.slug}`, // Use actual download URL
            appName: app.name,
            appSlug: app.slug,
            timestamp: Date.now()
        }
        
        
        // Save to sessionStorage for ad-redirect page
        sessionStorage.setItem('pendingDownload', JSON.stringify(downloadData))
        
        // Redirect to ad-redirect page instead of non-existent download page
        router.push('/ad-redirect')
    }

    return {
        app,
        relatedApps,
        loading,
        error,
        handleDownload
    }
}

// Utility function for structured data
function generateAppStructuredData(app) {
    return {
        "@context": "https://schema.org",
        "@type": "SoftwareApplication",
        "name": app.name,
        "description": app.description || `Download ${app.name} for free`,
        "url": `https://appscracked.com/app/${app.slug}`,
        "downloadUrl": `https://appscracked.com/app/${app.slug}`,
        "operatingSystem": app.platform || "Windows",
        "applicationCategory": app.category?.name || "Software",
        "softwareVersion": app.version || "Latest",
        "fileSize": app.fileSize || "Unknown",
        "datePublished": app.createdAt,
        "author": {
            "@type": "Organization",
            "name": app.developer || "Unknown Developer"
        },
        "publisher": {
            "@type": "Organization",
            "name": "AppsCracked",
            "url": "https://appscracked.com"
        },
        "offers": {
            "@type": "Offer",
            "price": "0.00",
            "priceCurrency": "USD",
            "availability": "https://schema.org/InStock"
        },
        "aggregateRating": app.rating ? {
            "@type": "AggregateRating",
            "ratingValue": app.rating,
            "reviewCount": app.totalRatings || 100,
            "bestRating": 5,
            "worstRating": 1
        } : undefined,
        "image": app.images?.[0] || "https://appscracked.com/default-app.jpg",
        "screenshot": app.screenshots || []
    }
}