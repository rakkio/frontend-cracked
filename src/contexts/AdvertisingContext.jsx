'use client'

import { createContext, useContext, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'

const AdvertisingContext = createContext()

export function AdvertisingProvider({ children }) {
    const [isAdModalOpen, setIsAdModalOpen] = useState(false)
    const [pendingDownload, setPendingDownload] = useState(null)
    const [adViewCount, setAdViewCount] = useState(0)
    const router = useRouter()

    // Check if user needs to view ad (for demo purposes, require ad every 3 downloads)
    const needsToViewAd = useCallback(() => {
        // For demo purposes, show ad every 3rd download
        return adViewCount % 3 === 0
    }, [adViewCount])

    // Show ad modal for download
    const showAdForDownload = useCallback((appData) => {
        console.log('📢 Showing ad for download:', appData)
        
        // Clear any existing safety timeout
        if (appData._safetyTimeout) {
            clearTimeout(appData._safetyTimeout)
        }

        // Store the pending download
        setPendingDownload(appData)
        
        // For now, redirect to ad-redirect page instead of modal
        const adRedirectUrl = `/ad-redirect?` + new URLSearchParams({
            appId: appData._id || '',
            appName: appData.name || '',
            appSlug: appData.slug || '',
            returnUrl: window.location.href,
            downloadUrl: appData.downloadUrl || '',
            fileName: `${appData.name || 'app'}.exe`,
            fileSize: appData.size || '150 MB'
        }).toString()

        console.log('🔗 Redirecting to ad page:', adRedirectUrl)
        router.push(adRedirectUrl)
        
        // Increment ad view count
        setAdViewCount(prev => prev + 1)
    }, [router])

    // Complete download after ad is viewed
    const completeDownload = useCallback(() => {
        if (pendingDownload) {
            console.log('✅ Completing download after ad:', pendingDownload)
            
            // Trigger actual download
            if (pendingDownload.downloadUrl) {
                const link = document.createElement('a')
                link.href = pendingDownload.downloadUrl
                link.download = pendingDownload.name || 'download'
                link.target = '_blank'
                link.rel = 'noopener noreferrer'
                
                document.body.appendChild(link)
                link.click()
                document.body.removeChild(link)
            }
            
            // Clear pending download
            setPendingDownload(null)
            setIsAdModalOpen(false)
        }
    }, [pendingDownload])

    // Skip ad and download directly (fallback)
    const skipAdAndDownload = useCallback(() => {
        if (pendingDownload) {
            console.log('⏭️ Skipping ad and downloading directly:', pendingDownload)
            completeDownload()
        }
    }, [pendingDownload, completeDownload])

    const value = {
        isAdModalOpen,
        setIsAdModalOpen,
        pendingDownload,
        adViewCount,
        needsToViewAd,
        showAdForDownload,
        completeDownload,
        skipAdAndDownload
    }

    return (
        <AdvertisingContext.Provider value={value}>
            {children}
        </AdvertisingContext.Provider>
    )
}

export function useAdvertising() {
    const context = useContext(AdvertisingContext)
    if (!context) {
        throw new Error('useAdvertising must be used within an AdvertisingProvider')
    }
    return context
}
