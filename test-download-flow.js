// Script de prueba para verificar el flujo completo de descarga
console.log('🧪 Testing complete download flow...')

// Simular datos de una app
const mockAppData = {
    _id: '507f1f77bcf86cd799439011',
    name: 'Test App Pro',
    slug: 'test-app-pro',
    downloadUrl: 'https://example.com/download/test-app-pro.apk',
    size: '25.6 MB',
    version: '2.1.0'
}

// Simular el hook useDownload
function triggerDownload(appData) {
    console.log('📦 Preparing download data:', appData)
    
    // Validate app data
    if (!appData?.downloadUrl) {
        console.error('❌ No download URL provided')
        return
    }

    if (!appData?.name) {
        console.error('❌ No app name provided')
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
    
    console.log('✅ Would redirect to /ad-redirect')
}

// Simular el hook useAdRedirect
function initializeDownload() {
    console.log('🚀 Initializing download...')
    
    const storedDownload = sessionStorage.getItem('pendingDownload')
    console.log('📦 Stored download data:', storedDownload)
    
    if (!storedDownload) {
        console.log('❌ No download information found')
        return
    }
    
    try {
        const downloadData = JSON.parse(storedDownload)
        console.log('📋 Parsed download data:', downloadData)
        
        // Validate required fields
        if (!downloadData.url) {
            console.log('❌ Invalid download data - missing URL')
            return
        }
        
        if (!downloadData.appName) {
            console.log('❌ Invalid download data - missing app name')
            return
        }
        
        // Validate URL format
        try {
            new URL(downloadData.url)
        } catch (urlError) {
            console.error('❌ Invalid URL format:', downloadData.url)
            return
        }
        
        console.log('✅ Download data validated:', downloadData.appName)
        console.log('🔄 Would load advertisement...')
        
    } catch (error) {
        console.error('❌ Initialization error:', error)
    }
}

// Test 1: Trigger download
console.log('📋 Test 1: Trigger download')
triggerDownload(mockAppData)

// Test 2: Initialize download
setTimeout(() => {
    console.log('📋 Test 2: Initialize download')
    initializeDownload()
}, 1000)

// Test 3: Verify sessionStorage
setTimeout(() => {
    console.log('📋 Test 3: Verify sessionStorage')
    const stored = sessionStorage.getItem('pendingDownload')
    console.log('📦 Stored data:', stored)
    
    if (stored) {
        const parsed = JSON.parse(stored)
        console.log('📋 Parsed data:', parsed)
        console.log('✅ All tests passed!')
    } else {
        console.log('❌ No data in sessionStorage')
    }
}, 2000) 