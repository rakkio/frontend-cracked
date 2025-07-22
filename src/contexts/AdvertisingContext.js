'use client'

import { createContext, useContext, useState, useCallback, useEffect } from 'react'

const AdvertisingContext = createContext({})

export function AdvertisingProvider({ children }) {
    const [isAdModalOpen, setIsAdModalOpen] = useState(false)
    const [pendingDownload, setPendingDownload] = useState(null)
    const [adViewed, setAdViewed] = useState(false)
    const [adTimer, setAdTimer] = useState(0)
    const [canProceed, setCanProceed] = useState(false)

    // Debug: Log state changes
    useEffect(() => {
        console.log('=== AdvertisingContext State Change ===')
        console.log('isAdModalOpen:', isAdModalOpen)
        console.log('pendingDownload:', pendingDownload)
        console.log('adViewed:', adViewed)
        console.log('adTimer:', adTimer)
        console.log('canProceed:', canProceed)
    }, [isAdModalOpen, pendingDownload, adViewed, adTimer, canProceed])

    // Reset ad state
    const resetAdState = useCallback(() => {
        console.log('=== resetAdState called ===')
        setAdViewed(false)
        setAdTimer(0)
        setCanProceed(false)
        // DON'T reset pendingDownload here - it should only be reset when modal closes
    }, [])

    // Show ad modal for download
    const showAdForDownload = useCallback((appData) => {
        console.log('=== showAdForDownload called ===')
        console.log('App data:', appData)
        console.log('Current modal state:', isAdModalOpen)
        
        // Reset ad state FIRST (but not pendingDownload)
        resetAdState()
        
        // Then set the download and open modal
        setPendingDownload(appData)
        setIsAdModalOpen(true)
        
        console.log('📢 Modal state should be TRUE now, pending download set')
    }, [resetAdState, isAdModalOpen])

    // Close ad modal
    const closeAdModal = useCallback(() => {
        console.log('=== closeAdModal called ===')
        setIsAdModalOpen(false)
        
        // Clear safety timeout if it exists
        if (pendingDownload?._safetyTimeout) {
            console.log('🧹 Clearing safety timeout')
            clearTimeout(pendingDownload._safetyTimeout)
        }
        
        // Reset everything when closing
        setAdViewed(false)
        setAdTimer(0)
        setCanProceed(false)
        setPendingDownload(null)  // Only reset pendingDownload when closing
    }, [pendingDownload])

    // Mark ad as viewed and start timer
    const markAdViewed = useCallback(() => {
        console.log('=== markAdViewed called ===')
        setAdViewed(true)
        setAdTimer(15) // 15 seconds countdown
        
        const countdown = setInterval(() => {
            setAdTimer(prev => {
                const newValue = prev - 1
                console.log('Timer countdown:', newValue)
                
                if (newValue <= 0) {
                    clearInterval(countdown)
                    setCanProceed(true)
                    console.log('🎉 Timer finished, user can proceed')
                    
                    // Show completion message
                    if (typeof window !== 'undefined') {
                        setTimeout(() => {
                            console.log('📢 Advertisement viewing completed!')
                        }, 500)
                    }
                    
                    return 0
                }
                return newValue
            })
        }, 1000)

        return countdown
    }, [])

    // Proceed with download after ad
    const proceedWithDownload = useCallback(() => {
        if (!canProceed || !pendingDownload) return null
        
        const download = pendingDownload
        
        // Clear safety timeout if it exists
        if (download._safetyTimeout) {
            console.log('🧹 Clearing safety timeout before download')
            clearTimeout(download._safetyTimeout)
        }
        
        closeAdModal()
        return download
    }, [canProceed, pendingDownload, closeAdModal])

    // Check if user needs to view ad (always true for mandatory ads)
    const needsToViewAd = useCallback(() => {
        return true // Always show ad for every download
    }, [])

    const contextValue = {
        // State
        isAdModalOpen,
        pendingDownload,
        adViewed,
        adTimer,
        canProceed,
        
        // Actions
        showAdForDownload,
        closeAdModal,
        markAdViewed,
        proceedWithDownload,
        needsToViewAd,
        resetAdState
    }

    return (
        <AdvertisingContext.Provider value={contextValue}>
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