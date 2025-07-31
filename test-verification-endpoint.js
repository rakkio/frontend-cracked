// Script de prueba para verificar el endpoint de verificación
const API_BASE_URL = 'http://localhost:3000'

async function testVerificationEndpoint() {
    try {
        console.log('🧪 Testing verification endpoint...')
        
        // Test 1: Get a random advertisement first
        console.log('📋 Test 1: Getting random advertisement')
        const adResponse = await fetch(`${API_BASE_URL}/api/v1/advertisements/random?type=download&placement=button_click`)
        const adData = await adResponse.json()
        
        if (!adData.success || !adData.data.advertisement) {
            console.log('❌ No advertisement found')
            return
        }
        
        const advertisement = adData.data.advertisement
        console.log('✅ Advertisement found:', advertisement.name)
        console.log('🆔 Advertisement ID:', advertisement._id)
        
        // Test 2: Test verification endpoint
        console.log('📋 Test 2: Testing verification endpoint')
        const verifyResponse = await fetch(`${API_BASE_URL}/api/v1/advertisements/verify-view`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                adId: advertisement._id,
                downloadToken: `download_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
                downloadUrl: 'https://example.com/test-download.apk'
            })
        })
        
        const verifyData = await verifyResponse.json()
        console.log('📊 Verification response:', verifyData)
        
        if (verifyData.success) {
            console.log('✅ Verification successful!')
            console.log('🔓 Unlock token:', verifyData.data.unlockToken)
            console.log('⏰ Expires at:', verifyData.data.expiresAt)
        } else {
            console.log('❌ Verification failed:', verifyData.message)
        }
        
        // Test 3: Test with invalid ad ID
        console.log('📋 Test 3: Testing with invalid ad ID')
        const invalidResponse = await fetch(`${API_BASE_URL}/api/v1/advertisements/verify-view`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                adId: '507f1f77bcf86cd799439011', // Invalid ID
                downloadToken: `download_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
                downloadUrl: 'https://example.com/test-download.apk'
            })
        })
        
        const invalidData = await invalidResponse.json()
        console.log('📊 Invalid ID response:', invalidData)
        
        if (!invalidData.success) {
            console.log('✅ Invalid ID correctly rejected')
        } else {
            console.log('❌ Invalid ID should have been rejected')
        }
        
    } catch (error) {
        console.error('❌ Error testing verification endpoint:', error)
    }
}

// Ejecutar la prueba
testVerificationEndpoint() 