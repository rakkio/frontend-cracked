export class DownloadService {
    static async handleDownload(app, params) {
        if (!app) return

        if (!app.downloadUrl) {
            console.error('❌ No download URL available')
            alert('Download URL not available for this app')
            return
        }
        
        const downloadData = {
            url: app.downloadUrl,
            appName: app.name,
            appSlug: app.slug || params.slug,
            appId: app._id,
            categorySlug: app.category?.slug
        }
        
        try {
            sessionStorage.setItem('pendingDownload', JSON.stringify(downloadData))
            
            const savedData = sessionStorage.getItem('pendingDownload')
            if (!savedData) {
                console.error('❌ Failed to save data to sessionStorage')
                alert('Error preparing download. Please try again.')
                return
            }
            
        } catch (error) {
            console.error('❌ Error saving to sessionStorage:', error)
            alert('Error preparing download. Please try again.')
            return
        }
        
        setTimeout(() => {
            window.location.href = '/ad-redirect'
        }, 100)
    }
}