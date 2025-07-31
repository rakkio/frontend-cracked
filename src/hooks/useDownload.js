import { useRouter } from 'next/navigation'

export function useDownload() {
    const router = useRouter()

    const triggerDownload = (appData) => {
        try {
            console.log('📦 Preparing download data:', appData)
            
            // Validate app data
            if (!appData?.downloadUrl) {
                console.error('❌ No download URL provided')
                alert('Download URL not available')
                return
            }

            if (!appData?.name) {
                console.error('❌ No app name provided')
                alert('App name not available')
                return
            }

            // Prepare download data for ad redirect page
            const downloadData = {
                url: appData.downloadUrl,
                appName: appData.name,
                appSlug: appData.slug,
                appId: appData._id,
                size: appData.size,
                version: appData.version,
                timestamp: Date.now()
            }

            // Store download data in sessionStorage
            sessionStorage.setItem('pendingDownload', JSON.stringify(downloadData))
            console.log('📦 Download data stored:', downloadData)

            // Redirect to ad redirect page
            router.push('/ad-redirect')
            
        } catch (error) {
            console.error('❌ Error preparing download:', error)
            alert('Unable to prepare download. Please try again.')
        }
    }

    return {
        triggerDownload
    }
} 