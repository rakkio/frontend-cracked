'use client'

import { Suspense } from 'react'
import { useAdRedirect } from '@/hooks/useAdRedirect'
import {
    BackgroundPattern,
    AdRedirectHeader,
    ErrorState,
    LoadingState,
    AdBlockerWarning,
    AdvertisementDisplay,
    DownloadSidebar,
    InfoFooter
} from '@/components/ad-redirect'

function AdRedirectContent() {
    const {
        countdown,
        advertisement,
        adLoaded,
        error,
        pendingDownload,
        canSkip,
        adBlockDetected,
        deviceType,
        adContainerRef,
        handleDirectDownload,
        handleEnhancedSkip,
        detectAdBlocker
    } = useAdRedirect()

    // Render different states
    if (error) {
        return (
            <div className="w-full min-h-screen bg-white relative overflow-x-hidden">
                <BackgroundPattern />
                <div className="relative z-10 container mx-auto px-4 py-12">
                    <AdRedirectHeader />
                    <ErrorState 
                        error={error} 
                        onRetry={() => window.location.reload()} 
                        onContinue={handleDirectDownload} 
                    />
                    <InfoFooter />
                </div>
            </div>
        )
    }

    if (!pendingDownload) {
        return (
            <div className="w-full min-h-screen bg-white relative overflow-x-hidden">
                <BackgroundPattern />
                <div className="relative z-10 container mx-auto px-4 py-12">
                    <AdRedirectHeader />
                    <LoadingState />
                    <InfoFooter />
                </div>
            </div>
        )
    }

    if (adBlockDetected) {
        return (
            <div className="w-full min-h-screen bg-white relative overflow-x-hidden">
                <BackgroundPattern />
                <div className="relative z-10 container mx-auto px-4 py-12">
                    <AdRedirectHeader />
                    <AdBlockerWarning onDirectDownload={handleDirectDownload} />
                    <InfoFooter />
                </div>
            </div>
        )
    }

    return (
        <div className="w-full min-h-screen bg-white relative overflow-x-hidden">
            <BackgroundPattern />
            <div className="relative z-10 container mx-auto px-4 py-12">
                <AdRedirectHeader />
                
                <div className="grid lg:grid-cols-3 gap-8">
                    <AdvertisementDisplay 
                        advertisement={advertisement}
                        adLoaded={adLoaded}
                        adContainerRef={adContainerRef}
                    />
                    
                    <DownloadSidebar 
                        pendingDownload={pendingDownload}
                        deviceType={deviceType}
                        countdown={countdown}
                        error={error}
                        advertisement={advertisement}
                        adLoaded={adLoaded}
                        canSkip={canSkip}
                        onSkip={handleEnhancedSkip}
                        onDirectDownload={handleDirectDownload}
                    />
                </div>
                
                <InfoFooter />
            </div>
        </div>
    )
}

export default function AdRedirectPage() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-white flex items-center justify-center"><div className="text-gray-600">Loading...</div></div>}>
            <AdRedirectContent />
        </Suspense>
    )
}
