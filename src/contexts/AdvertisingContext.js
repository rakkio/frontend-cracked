'use client'

import { createContext, useContext, useState, useCallback, useEffect } from 'react'

const AdvertisingContext = createContext({})

export function AdvertisingProvider({ children }) {
    const [isAdModalOpen, setIsAdModalOpen] = useState(false)
    const [pendingDownload, setPendingDownload] = useState(null)
    const [adViewed, setAdViewed] = useState(false)
    const [adTimer, setAdTimer] = useState(0)
    const [canProceed, setCanProceed] = useState(false)

    // Reset ad state
    const resetAdState = useCallback(() => {
        setAdViewed(false)
        setAdTimer(0)
        setCanProceed(false)
        setPendingDownload(null)
    }, [])

    // Show ad modal for download
    const showAdForDownload = useCallback((appData) => {
        setPendingDownload(appData)
        setIsAdModalOpen(true)
        resetAdState()
    }, [resetAdState])

    // Close ad modal
    const closeAdModal = useCallback(() => {
        setIsAdModalOpen(false)
        resetAdState()
    }, [resetAdState])

    // Mark ad as viewed and start timer
    const markAdViewed = useCallback(() => {
        setAdViewed(true)
        setAdTimer(15) // 15 seconds countdown
        
        const countdown = setInterval(() => {
            setAdTimer(prev => {
                if (prev <= 1) {
                    clearInterval(countdown)
                    setCanProceed(true)
                    return 0
                }
                return prev - 1
            })
        }, 1000)

        return countdown
    }, [])

    // Proceed with download after ad
    const proceedWithDownload = useCallback(() => {
        if (!canProceed || !pendingDownload) return null
        
        const download = pendingDownload
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