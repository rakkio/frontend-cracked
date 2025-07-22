'use client'

import { useCallback } from 'react'
import { useAdvertising } from '@/contexts/AdvertisingContext'

export function useDownload() {
    const { showAdForDownload, needsToViewAd } = useAdvertising()

    const triggerDownload = useCallback((appData) => {
        // Check if user needs to view ad
        if (needsToViewAd()) {
            // Show advertisement modal
            showAdForDownload({
                _id: appData._id,
                name: appData.name,
                slug: appData.slug,
                downloadUrl: appData.downloadUrl,
                size: appData.size,
                version: appData.version
            })
        } else {
            // Direct download (fallback case)
            directDownload(appData)
        }
    }, [showAdForDownload, needsToViewAd])

    const directDownload = useCallback((appData) => {
        if (appData.downloadUrl) {
            // Create temporary link for download
            const link = document.createElement('a')
            link.href = appData.downloadUrl
            link.download = appData.name || 'download'
            link.target = '_blank'
            link.rel = 'noopener noreferrer'
            
            // Add to DOM temporarily
            document.body.appendChild(link)
            link.click()
            document.body.removeChild(link)
        } else if (appData.slug) {
            // Navigate to app page if no direct download URL
            window.open(`/app/${appData.slug}`, '_blank')
        } else {
            // Fallback
            console.warn('No download URL or slug provided')
            alert('Download link not available. Please try again later.')
        }
    }, [])

    return {
        triggerDownload,
        directDownload
    }
} 