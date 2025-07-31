// Script de prueba para verificar el sistema de verificación de publicidad
const API_BASE_URL = 'http://localhost:3000'

async function testVerificationSystem() {
    try {
        console.log('🧪 Testing advertisement verification system...')
        
        // Test 1: Get a random advertisement
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
        
        // Test 2: Verify advertisement view and unlock download
        console.log('📋 Test 2: Verifying advertisement view')
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
            console.log('✅ Download unlocked successfully')
            console.log('🔓 Unlock token:', verifyData.data.unlockToken)
            console.log('⏰ Expires at:', verifyData.data.expiresAt)
        } else {
            console.log('❌ Verification failed:', verifyData.message)
        }
        
        // Test 3: Test with invalid data
        console.log('📋 Test 3: Testing with invalid data')
        const invalidResponse = await fetch(`${API_BASE_URL}/api/v1/advertisements/verify-view`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                adId: 'invalid_id',
                downloadToken: 'invalid_token',
                downloadUrl: 'https://example.com/test-download.apk'
            })
        })
        
        const invalidData = await invalidResponse.json()
        console.log('📊 Invalid data response:', invalidData)
        
        if (!invalidData.success) {
            console.log('✅ Invalid data correctly rejected')
        } else {
            console.log('❌ Invalid data should have been rejected')
        }
        
    } catch (error) {
        console.error('❌ Error testing verification system:', error)
    }
}

// Ejecutar la prueba
testVerificationSystem() 