'use client'

import { useCallback } from 'react'
import { useAdvertising } from '@/contexts/AdvertisingContext'

export function useDownload() {
    const { showAdForDownload, needsToViewAd } = useAdvertising()

    const triggerDownload = useCallback((appData) => {
        console.log('=== triggerDownload called ===')
        console.log('App data:', appData)
        console.log('Needs to view ad:', needsToViewAd())
        
        // Check if user needs to view ad
        if (needsToViewAd()) {
            console.log('Showing ad modal for download')
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
            console.log('Proceeding with direct download')
            // Direct download (fallback case)
            directDownload(appData)
        }
    }, [showAdForDownload, needsToViewAd])

    const directDownload = useCallback((appData) => {
        console.log('=== directDownload called ===')
        console.log('App data:', appData)
        
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
            console.log('Download link clicked:', appData.downloadUrl)
        } else if (appData.slug) {
            // Navigate to app page if no direct download URL
            const url = `/app/${appData.slug}`
            window.open(url, '_blank')
            console.log('Navigated to app page:', url)
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